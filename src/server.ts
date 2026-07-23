import 'dotenv/config';
import '@angular/compiler';

import {
    AngularNodeAppEngine,
    createNodeRequestHandler,
    isMainModule,
    writeResponseToNodeResponse,
} from '@angular/ssr/node';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { resolve } from 'node:path';
import { MiddlewareAuth } from './server/middleware/auth-middleware';
import { sanitizeInput } from './server/middleware/sanitize.middleware';
import { router } from './server/modules/router';
import { authRouter } from './server/modules/router-auth';
import { authAdmRouter } from './server/modules/router-auth-admin';
import { getDistPaths, isMain } from './server/utils/ssr-compat';

const { serverDistFolder, browserDistFolder } = getDistPaths();

export const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(cookieParser());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Ensure this doesn't block Angular's frontend features such as fonts/inlines unless explicitly configured later
  crossOriginEmbedderPolicy: false,
}));

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */
app.use(express.json());
app.use(sanitizeInput);

// Limiter para as rotas de autenticação (máximo 5 requisições por IP a cada 15 minutos)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Muitas tentativas de autenticação.',
    message: 'Por favor, tente novamente após 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

// ##################################################
if (router.length) app.use('/api', router);
if (authRouter.length) app.use('/api', MiddlewareAuth.authenticate, authRouter);
if (authAdmRouter.length)
  app.use('/api', MiddlewareAuth.authenticateAdmin, authAdmRouter);

// ##################################################
app.get('/health', async (_req, res) => {
  res.status(200).send('ok');
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMain()) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
