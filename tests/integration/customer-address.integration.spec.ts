import request from 'supertest';
import { app } from '../../src/server';
import { prisma } from '../../src/server/prisma-conn';

describe('Customer Address Integration Tests', () => {
  let adminCookie: string[] = [];
  let clientCookie: string[] = [];
  let anotherClientCookie: string[] = [];

  let adminUserId = '';
  let clientUserId = '';
  let anotherClientUserId = '';

  let clientCustomerId = '';
  let anotherClientCustomerId = '';

  let createdAddressId = '';

  const testAdminUser = {
    name: 'Admin User',
    email: 'admin-addr-test@example.com',
    password: 'password123',
    role: 'ADMIN',
  };

  const testClientUser = {
    name: 'Client User',
    email: 'client-addr-test@example.com',
    password: 'password123',
    role: 'CUSTOMER',
  };

  const anotherClientUser = {
    name: 'Another Client User',
    email: 'another-client-addr-test@example.com',
    password: 'password123',
    role: 'CUSTOMER',
  };

  beforeAll(async () => {
    // Limpeza de segurança
    await prisma.customerAddress.deleteMany({
      where: {
        cep: {
          in: ['12240-000', '12245-000', '12245-111'],
        },
      },
    });

    await prisma.customer.deleteMany({
      where: {
        phone: {
          in: ['11955554444', '11944443333'],
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            testAdminUser.email,
            testClientUser.email,
            anotherClientUser.email,
          ],
        },
      },
    });

    // Registra usuários
    const admin = await request(app)
      .post('/api/auth/register')
      .send(testAdminUser);
    adminUserId = admin.body.data.id;

    const client = await request(app)
      .post('/api/auth/register')
      .send(testClientUser);
    clientUserId = client.body.data.id;

    const anotherClient = await request(app)
      .post('/api/auth/register')
      .send(anotherClientUser);
    anotherClientUserId = anotherClient.body.data.id;

    // Login e cookies
    const loginAdmin = await request(app)
      .post('/api/auth/login')
      .send({ email: testAdminUser.email, password: testAdminUser.password });
    const adminSetCookie = loginAdmin.headers['set-cookie'];
    adminCookie = Array.isArray(adminSetCookie)
      ? adminSetCookie
      : typeof adminSetCookie === 'string'
      ? [adminSetCookie]
      : [];

    const loginClient = await request(app)
      .post('/api/auth/login')
      .send({ email: testClientUser.email, password: testClientUser.password });
    const clientSetCookie = loginClient.headers['set-cookie'];
    clientCookie = Array.isArray(clientSetCookie)
      ? clientSetCookie
      : typeof clientSetCookie === 'string'
      ? [clientSetCookie]
      : [];

    const loginAnother = await request(app)
      .post('/api/auth/login')
      .send({
        email: anotherClientUser.email,
        password: anotherClientUser.password,
      });
    const anotherSetCookie = loginAnother.headers['set-cookie'];
    anotherClientCookie = Array.isArray(anotherSetCookie)
      ? anotherSetCookie
      : typeof anotherSetCookie === 'string'
      ? [anotherSetCookie]
      : [];

    // Cria os cadastros de clientes associados via prisma
    const cust1 = await prisma.customer.create({
      data: {
        phone: '11955554444',
        name: 'Client Customer',
        userId: clientUserId,
      },
    });
    clientCustomerId = cust1.id;

    const cust2 = await prisma.customer.create({
      data: {
        phone: '11944443333',
        name: 'Another Client Customer',
        userId: anotherClientUserId,
      },
    });
    anotherClientCustomerId = cust2.id;
  });

  afterAll(async () => {
    await prisma.customerAddress.deleteMany({
      where: {
        customerId: {
          in: [clientCustomerId, anotherClientCustomerId],
        },
      },
    });

    await prisma.customer.deleteMany({
      where: {
        id: {
          in: [clientCustomerId, anotherClientCustomerId],
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [adminUserId, clientUserId, anotherClientUserId],
        },
      },
    });

    await prisma.$disconnect();
  });

  describe('POST /api/customers/:customerId/addresses - Criar Endereço', () => {
    it('should block anonymous requests', async () => {
      const res = await request(app)
        .post(`/api/customers/${clientCustomerId}/addresses`)
        .send({
          cep: '12240-000',
          logradouro: 'Avenida Paulista',
          bairro: 'Bela Vista',
          localidade: 'São Paulo',
          uf: 'SP',
        });

      expect(res.status).toBe(401);
    });

    it('should block non-ADMIN from creating address for third-party customer', async () => {
      const res = await request(app)
        .post(`/api/customers/${anotherClientCustomerId}/addresses`)
        .set('Cookie', clientCookie) // clientCookie tenta postar em anotherClientCustomerId
        .send({
          cep: '12240-000',
          logradouro: 'Avenida Paulista',
          bairro: 'Bela Vista',
          localidade: 'São Paulo',
          uf: 'SP',
        });

      expect(res.status).toBe(403);
    });

    it('should allow non-ADMIN to create address in their own profile', async () => {
      const res = await request(app)
        .post(`/api/customers/${clientCustomerId}/addresses`)
        .set('Cookie', clientCookie)
        .send({
          cep: '12240-000',
          logradouro: 'Avenida Paulista',
          bairro: 'Bela Vista',
          localidade: 'São Paulo',
          uf: 'SP',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.logradouro).toBe('Avenida Paulista');
      createdAddressId = res.body.data.id;
    });

    it('should allow ADMIN to create address for any customer profile', async () => {
      const res = await request(app)
        .post(`/api/customers/${anotherClientCustomerId}/addresses`)
        .set('Cookie', adminCookie)
        .send({
          cep: '12245-000',
          logradouro: 'Rua das Flores',
          bairro: 'Centro',
          localidade: 'Campinas',
          uf: 'SP',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.logradouro).toBe('Rua das Flores');
    });
  });

  describe('GET /api/customers/:customerId/addresses - Listar Endereços', () => {
    it('should allow non-ADMIN to list their own addresses', async () => {
      const res = await request(app)
        .get(`/api/customers/${clientCustomerId}/addresses`)
        .set('Cookie', clientCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].id).toBe(createdAddressId);
    });

    it('should block non-ADMIN from listing third-party customer addresses', async () => {
      const res = await request(app)
        .get(`/api/customers/${anotherClientCustomerId}/addresses`)
        .set('Cookie', clientCookie);

      expect(res.status).toBe(403);
    });

    it('should allow ADMIN to list any customer addresses', async () => {
      const res = await request(app)
        .get(`/api/customers/${anotherClientCustomerId}/addresses`)
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('PUT /api/customers/:customerId/addresses/:id - Editar Endereço', () => {
    it('should allow non-ADMIN to update their own address', async () => {
      const res = await request(app)
        .put(`/api/customers/${clientCustomerId}/addresses/${createdAddressId}`)
        .set('Cookie', clientCookie)
        .send({
          logradouro: 'Avenida Paulista Editada',
          cep: '12245-111',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.logradouro).toBe('Avenida Paulista Editada');
      expect(res.body.data.cep).toBe('12245-111');
    });

    it('should block non-ADMIN from updating third-party addresses', async () => {
      const res = await request(app)
        .put(`/api/customers/${clientCustomerId}/addresses/${createdAddressId}`)
        .set('Cookie', anotherClientCookie) // outro cliente tentando editar o endereço do clientCustomerId
        .send({
          logradouro: 'Invasão',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/customers/:customerId/addresses/:id - Deletar Endereço', () => {
    it('should block non-ADMIN from deleting third-party addresses', async () => {
      const res = await request(app)
        .delete(`/api/customers/${clientCustomerId}/addresses/${createdAddressId}`)
        .set('Cookie', anotherClientCookie);

      expect(res.status).toBe(403);
    });

    it('should allow non-ADMIN to delete their own address', async () => {
      const res = await request(app)
        .delete(`/api/customers/${clientCustomerId}/addresses/${createdAddressId}`)
        .set('Cookie', clientCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Endereço deletado com sucesso.');

      // Confirma exclusão física no banco
      const checkDb = await prisma.customerAddress.findUnique({
        where: { id: createdAddressId },
      });
      expect(checkDb).toBeNull();
    });
  });
});
