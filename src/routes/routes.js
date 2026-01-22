import { Router } from 'express';
import authController from '../modules/auth/auth.controller.js';
import serviceScheduleController from '../modules/serviceSchedule/serviceSchedule.controller.js';
import serviceBookingController from '../modules/serviceBooking/serviceBooking.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/auth/login', authController.login);

router.get('/available/schedules', serviceScheduleController.fetchServiceScheduleAvailable);
router.get('/available/schedules/:id', serviceScheduleController.findServiceScheduleByIdAvailable);
router.post('/bookings', serviceBookingController.createServiceBooking);

router.use(authenticateToken);
router.get('/schedules', serviceScheduleController.fetchServiceSchedule);
router.get('/schedules/:id', serviceScheduleController.findServiceScheduleById);
router.post('/schedules', serviceScheduleController.createServiceSchedule);
router.patch('/bookings/:id', serviceBookingController.updateStatusServiceBooking);
router.get('/bookings/:id', serviceBookingController.findById);
router.get('/bookings', serviceBookingController.fetchServiceBookings);

export default router;
