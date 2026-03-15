import { Router } from 'express';
import { getTrucks, getTruckById, createTruck, updateTruck, deleteTruck } from '../controllers/trucks.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getTrucks);
router.get('/:id', getTruckById);

router.post('/', [
    body('year').notEmpty().withMessage('Year is required'),
    body('color').notEmpty().withMessage('Color is required'),
    body('plates').notEmpty().withMessage('Plates are required'),
    validateRequest
], createTruck);

router.put('/:id', [
    body('year').optional().notEmpty().withMessage('Year cannot be empty'),
    body('color').optional().notEmpty().withMessage('Color cannot be empty'),
    body('plates').optional().notEmpty().withMessage('Plates cannot be empty'),
    validateRequest
], updateTruck);

router.delete('/:id', deleteTruck);

export default router;
