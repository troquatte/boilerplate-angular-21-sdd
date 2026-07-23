import request from 'supertest';
import { app } from '../../server';
import { prisma } from '../prisma-conn';

describe('Auth Integration Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'integration-test@example.com',
    password: 'password123',
    role: 'CLIENT',
  };

  beforeAll(async () => {
    // Limpa registros anteriores para evitar conflito
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, 'attacker-xss@example.com'],
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, 'attacker-xss@example.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  it('should register a new user successfully in POST /api/auth/register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data.password).toBeUndefined();
  });

  it('should login successfully in POST /api/auth/login and return HttpOnly cookies', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login realizado com sucesso.');

    const setCookieHeader = res.headers['set-cookie'];
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : typeof setCookieHeader === 'string'
      ? [setCookieHeader]
      : [];
    expect(cookies.some((c: string) => c.includes('accessToken'))).toBe(true);
    expect(cookies.some((c: string) => c.includes('refreshToken'))).toBe(true);
    expect(cookies.some((c: string) => c.includes('HttpOnly'))).toBe(true);
    expect(cookies.some((c: string) => c.includes('SameSite=Strict'))).toBe(true);
  });

  it('should sanitize HTML inputs and strip scripts', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: '<b>Attacker</b><script>console.log("xss")</script>',
        email: 'attacker-xss@example.com',
        password: 'password123',
        role: 'CLIENT',
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data.name).toBe('Attacker'); // tags HTML e scripts devem ter sido completamente sanitizados

    // Cleanup do usuário XSS
    await prisma.user.deleteMany({
      where: { email: 'attacker-xss@example.com' },
    });
  });

  it('should block multiple authentication requests (Rate Limiting)', async () => {
    let lastRes;
    for (let i = 0; i < 6; i++) {
      lastRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'rate-limit@example.com',
          password: 'password123',
        });
    }
    expect(lastRes?.status).toBe(429);
  });
});
