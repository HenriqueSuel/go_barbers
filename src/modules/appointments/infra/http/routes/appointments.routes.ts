import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmentsController'
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController'
import ensureAuthemticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRoutes = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRoutes.use(ensureAuthemticated);

/* appointmentsRoutes.get('/', async (request, response) => {
  const appointments = await appointmentsRepository.find()
  response.json(appointments)
}); */

appointmentsRoutes.post('/', appointmentsController.create);
appointmentsRoutes.get('/me', providerAppointmentsController.index);

export default appointmentsRoutes;
