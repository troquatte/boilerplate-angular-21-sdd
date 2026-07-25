import request from 'supertest';
import { app } from '../../src/server';
import { prisma } from '../../src/server/prisma-conn';

describe('Customer Integration Tests', () => {
  let adminCookie: string[] = [];
  let clientCookie: string[] = [];
  let anotherClientCookie: string[] = [];

  let adminUserId = '';
  let clientUserId = '';
  let anotherClientUserId = '';

  let createdCustomerId = '';

  const testAdminUser = {
    name: 'Admin User',
    email: 'admin-customer-test@example.com',
    password: 'password123',
    role: 'ADMIN',
  };

  const testClientUser = {
    name: 'Client User',
    email: 'client-customer-test@example.com',
    password: 'password123',
    role: 'CUSTOMER',
  };

  const anotherClientUser = {
    name: 'Another Client User',
    email: 'another-client-customer-test@example.com',
    password: 'password123',
    role: 'CUSTOMER',
  };

  beforeAll(async () => {
    // Limpeza de segurança de execuções anteriores
    await prisma.customer.deleteMany({
      where: {
        phone: {
          in: ['11988887777', '11977776666', '11966665555'],
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

    // Criação dos usuários no banco
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

    // Login para obtenção dos cookies
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
  });

  afterAll(async () => {
    await prisma.customer.deleteMany({
      where: {
        userId: {
          in: [adminUserId, clientUserId, anotherClientUserId],
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

  describe('POST /api/customers - Criar Cliente', () => {
    it('should block customer creation for non-authenticated requests', async () => {
      const res = await request(app)
        .post('/api/customers')
        .send({ phone: '11988887777', userId: clientUserId });

      expect(res.status).toBe(401);
    });

    it('should block customer creation for non-ADMIN users', async () => {
      const res = await request(app)
        .post('/api/customers')
        .set('Cookie', clientCookie)
        .send({ phone: '11988887777', userId: clientUserId });

      expect(res.status).toBe(403);
    });

    it('should allow customer creation for ADMIN with only phone as mandatory field', async () => {
      const res = await request(app)
        .post('/api/customers')
        .set('Cookie', adminCookie)
        .send({
          phone: '11988887777',
          userId: clientUserId,
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.phone).toBe('11988887777');
      expect(res.body.data.name).toBeNull(); // name opcional
      expect(res.body.data.cpf).toBeNull(); // cpf opcional

      createdCustomerId = res.body.data.id;
    });

    it('should block creation if userId already has an associated customer', async () => {
      const res = await request(app)
        .post('/api/customers')
        .set('Cookie', adminCookie)
        .send({
          phone: '11977776666',
          userId: clientUserId, // mesmo userId da inserção anterior
        });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/customers - Listar Clientes', () => {
    it('should block list access for non-ADMIN users', async () => {
      const res = await request(app)
        .get('/api/customers')
        .set('Cookie', clientCookie);

      expect(res.status).toBe(403);
    });

    it('should allow list access for ADMIN users', async () => {
      const res = await request(app)
        .get('/api/customers')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.customers).toBeInstanceOf(Array);
      expect(res.body.data.total).toBeGreaterThan(0);
    });
  });

  describe('GET /api/customers/:id - Buscar Cliente por ID', () => {
    it('should allow ADMIN to view any customer profile', async () => {
      const res = await request(app)
        .get(`/api/customers/${createdCustomerId}`)
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdCustomerId);
    });

    it('should allow non-ADMIN to view their own customer profile', async () => {
      const res = await request(app)
        .get(`/api/customers/${createdCustomerId}`)
        .set('Cookie', clientCookie); // client é o dono do registro (userId coincide)

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdCustomerId);
    });

    it('should block non-ADMIN from viewing third-party customer profile', async () => {
      const res = await request(app)
        .get(`/api/customers/${createdCustomerId}`)
        .set('Cookie', anotherClientCookie); // outro cliente tentando acessar

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/customers/:id - Editar Cliente', () => {
    it('should allow non-ADMIN to update their own profile details', async () => {
      const res = await request(app)
        .put(`/api/customers/${createdCustomerId}`)
        .set('Cookie', clientCookie)
        .send({
          name: 'Client User Named',
          phone: '11966665555',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Client User Named');
      expect(res.body.data.phone).toBe('11966665555');
    });

    it('should block non-ADMIN from updating third-party customer profiles', async () => {
      const res = await request(app)
        .put(`/api/customers/${createdCustomerId}`)
        .set('Cookie', anotherClientCookie)
        .send({
          name: 'Intruder Name',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/customers/:id - Desativar Cliente', () => {
    it('should block customer deactivation for non-ADMIN users', async () => {
      const res = await request(app)
        .delete(`/api/customers/${createdCustomerId}`)
        .set('Cookie', clientCookie);

      expect(res.status).toBe(403);
    });

    it('should allow ADMIN to deactivate a customer (logical deletion)', async () => {
      const res = await request(app)
        .delete(`/api/customers/${createdCustomerId}`)
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cliente desativado com sucesso.');

      // Verifica no banco se a propriedade active foi alterada para false
      const checkDb = await prisma.customer.findUnique({
        where: { id: createdCustomerId },
      });
      expect(checkDb?.active).toBe(false);
    });
  });
});
