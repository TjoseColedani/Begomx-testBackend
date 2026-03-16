import { Router } from 'express';
import { getOrders, getOrderById, getOrderDetails, createOrder, updateOrder, updateOrderStatus, deleteOrder, getOrderStats } from '../controllers/orders.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/details', getOrderDetails);
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrderById);

router.post('/', [
    body('truck').isMongoId().withMessage('Valid Truck ID is required'),
    body('pickup').isMongoId().withMessage('Valid Pickup Location ID is required'),
    body('dropoff').isMongoId().withMessage('Valid Dropoff Location ID is required'),
    validateRequest
], createOrder);

router.put('/:id', [
    body('truck').optional().isMongoId().withMessage('Valid Truck ID is required'),
    body('pickup').optional().isMongoId().withMessage('Valid Pickup Location ID is required'),
    body('dropoff').optional().isMongoId().withMessage('Valid Dropoff Location ID is required'),
    body('status').optional().isIn(['created', 'in_transit', 'completed']).withMessage('Invalid status'),
    validateRequest
], updateOrder);

router.patch('/:id/status', [
    body('status').isIn(['created', 'in_transit', 'completed']).withMessage('Invalid status'),
    validateRequest
], updateOrderStatus);

router.delete('/:id', deleteOrder);

export default router;
