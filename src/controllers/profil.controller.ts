import { Request, Response, NextFunction } from 'express';
import { ProfilService } from '../services/profil.service';
import { hashPassword, comparePassword } from '../utils/password.util';
import { signJwt } from '../utils/jwt.util';
import { HttpCode } from '../http_code';
import {
  CreateProfilInput,
  LoginInput,
  profilWithTokenSchema,
  ProfilWithToken,
  tokenResponseSchema,
  TokenResponse
} from '../schemas/profil.schema';

export class ProfilController {
  static async create(
    req: Request<{}, {}, CreateProfilInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const hashed = await hashPassword(password);

      const profil = await ProfilService.createProfil({
        email,
        password: hashed,
      });

      const token = signJwt({
        profil_id: profil.profil_id,
        email:     profil.email,
      });

      const rawResponse = {
        profil_id: profil.profil_id,
        email:     profil.email,
        createdAt: profil.createdAt.toISOString(),
        token,
      };

      const parsed = profilWithTokenSchema.safeParse(rawResponse);
      if (!parsed.success) {
        const errors = parsed.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        return res
          .status(HttpCode.INTERNAL)
          .json({
            message: 'Erreur interne de validation de la réponse',
            errors,
          });
      }

      return res
        .status(HttpCode.CREATED)
        .json(parsed.data as ProfilWithToken);

    } catch (err: any) {
      if (err.code === 11000) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: 'Cet email est déjà utilisé' });
      }
      next(err);
    }
  }

  static async login(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const profil = await ProfilService.findByEmail(email);
      if (!profil) {
        return res
          .status(HttpCode.UNAUTHORIZED)
          .json({ message: 'Email ou mot de passe incorrect' });
      }

      const valid = await comparePassword(password, profil.password);
      if (!valid) {
        return res
          .status(HttpCode.UNAUTHORIZED)
          .json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = signJwt({
        profil_id: profil.profil_id,
        email:     profil.email,
      });

      const rawResponse = {
        profil_id: profil.profil_id,
        email:     profil.email,
        createdAt: profil.createdAt.toISOString(),
        token,
      };

      const raw = { token };
      const parsed = tokenResponseSchema.safeParse(raw);
      if (!parsed.success) {
        const errors = parsed.error.issues.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return res
          .status(HttpCode.INTERNAL)
          .json({ message: 'Erreur interne de validation de la réponse', errors });
      }

      return res
        .status(HttpCode.OK)
        .json(parsed.data as TokenResponse);

    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: Request<{ profilId: string }, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { profilId } = req.params;

      const deletedProfil = await ProfilService.deleteProfil(profilId);
      if (!deletedProfil) {
        return res
          .status(HttpCode.NOT_FOUND)
          .json({ message: 'Profil non trouvé' });
      }

      return res
        .status(HttpCode.OK)
        .json({ message: 'Profil supprimé avec succès' });
    } catch (err) {
      next(err);
    }
  }
}
