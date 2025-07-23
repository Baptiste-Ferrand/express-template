import { Request, Response, NextFunction } from 'express';
import { HttpCode } from '../http_code';


export function verifyOwnership(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { profil_id: string };
    if (!user) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: 'Non authentifié' });
    }

    const resourceId = req.params[paramName];
    if (!resourceId) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: `Paramètre ${paramName} manquant` });
    }

    if (user.profil_id !== resourceId) {
      return res
        .status(HttpCode.FORBIDDEN)
        .json({ message: "Accès refusé: vous n'êtes pas le propriétaire de cette ressource" });
    }

    next();
  };
}
