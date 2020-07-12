import { Router } from 'express';


import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthemticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController'
import ProviderMonthAvailabilityController from '../controllers/ProviderDayAvailabillityController';
import ProviderDayAvailabilityController from '../controllers/ProviderMonthAvailabillityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthemticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required()
    }
  }),
  providerMonthAvailabilityController.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required()
    }
  }),
  providerDayAvailabilityController.index,
);
export default providersRouter;
