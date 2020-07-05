import { Router } from 'express';
import ensureAuthemticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController'

const providersRoutes = Router();
const providersController = new ProvidersController();

providersRoutes.use(ensureAuthemticated);

providersRoutes.get('/', providersController.index);

export default providersRoutes;
