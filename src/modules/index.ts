import { createRouter } from '@/configs/server.config';
import membersRoutes from './members/members.route';
import departmentsRoute from './departments/departments.route';

const router = createRouter();

router.use('/members', membersRoutes);
router.use('/departments', departmentsRoute);

export default router;
