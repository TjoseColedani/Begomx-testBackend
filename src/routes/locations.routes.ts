import { Router } from 'express';
import { getLocations, getLocationById, createLocation, updateLocation, deleteLocation } from '../controllers/locations.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getLocations);
router.get('/:id', getLocationById);

router.post('/', [
    body('place_id').notEmpty().withMessage('place_id is required'),
    validateRequest
], createLocation);

router.put('/:id', [
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    validateRequest
], updateLocation);

router.delete('/:id', deleteLocation);

export default router;
