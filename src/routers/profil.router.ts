import { Router } from 'express';
import { ProfilController } from '../controllers/profil.controller';
import { validateResource } from '../middleware/validate.middleware';
import { verifyOwnership } from '../middleware/ownership.middleware';
import { verifyToken } from '../middleware/auth.middleware';
import { createProfilSchema, loginSchema } from '../schemas/profil.schema';

export const profilRouter = Router();
profilRouter.post(
    '/',
    validateResource(createProfilSchema),
    ProfilController.create
);

profilRouter.post(
    '/login',
    validateResource(loginSchema),
    ProfilController.login
);

  profilRouter.delete(
    '/:profilId',
    verifyToken(),              
    verifyOwnership('profilId'),      
    ProfilController.delete    
);