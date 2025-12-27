import express from 'express';
import users from '../routes/users';
import auth from '../routes/auth';
import { errorHandler } from '../middleware/errorHandler';
import entity from '../routes/entity.routes';
export default function (app: express.Application) {
   app.use(express.json());
   app.use('/api/entity', entity);
   app.use('/api/users', users);
   app.use('/api/auth', auth);
   app.use(errorHandler);
}
