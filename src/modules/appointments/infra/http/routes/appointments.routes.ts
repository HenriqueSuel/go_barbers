import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmentsController'
import ensureAuthemticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRoutes = Router();
const appointmentsController = new AppointmentsController();

appointmentsRoutes.use(ensureAuthemticated);

/* appointmentsRoutes.get('/', async (request, response) => {
  const appointments = await appointmentsRepository.find()
  response.json(appointments)
}); */

appointmentsRoutes.post('/', appointmentsController.create);

export default appointmentsRoutes;
