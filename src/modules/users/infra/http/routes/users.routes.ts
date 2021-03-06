import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';
import ensureAuthemticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController'
import UsersAvatarController from '../controllers/UserAvatarController'
import { celebrate, Segments, Joi } from 'celebrate';



const usersRouter = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }
  }),
  usersController.create
  );

usersRouter.patch(
  '/avatar',
  ensureAuthemticated,
  upload.single('avatar'),
  usersAvatarController.Update
  )
export default usersRouter;
