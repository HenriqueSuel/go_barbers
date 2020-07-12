import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';


import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import { errors } from 'celebrate'

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import cors from 'cors';

import '@shared/infra/typeorm'
import '@shared/container'

const app = express();

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadFolder))
app.use(routes);

app.use(errors());

app.use((err: Error,request:Request, response:Response, _:NextFunction ) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
});

const port = 3334;
app.listen(port, () => {
  console.log('🚀 Server started on port ' + port);
});
