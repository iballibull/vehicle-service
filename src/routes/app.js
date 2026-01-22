import express from 'express';
import routes from './routes.js';
import { errorMiddleware } from '../middlewares/error.middleware.js';
import openApiDocument from '../docs/openapi.json' with { type: 'json' };
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api', routes);
app.use(errorMiddleware);

export default app;
