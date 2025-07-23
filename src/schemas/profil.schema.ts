import { z } from 'zod';

export const createProfilSchema = z.object({
  body: z.object({
    email:    z.string().email({ message: "Email invalide" }),
    password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email:    z.string().email(),
    password: z.string(),
  })
});

export const profilResponseSchema = z.object({
  profil_id: z.string().uuid(),
  email:     z.string().email(),
  createdAt: z.string(),  // ISO
});

export const profilWithTokenSchema = profilResponseSchema.merge(
  z.object({ token: z.string() })
);

export const tokenResponseSchema = z.object({
  token: z.string()
})

export type CreateProfilInput      = z.infer<typeof createProfilSchema>['body'];
export type LoginInput            = z.infer<typeof loginSchema>['body'];
export type ProfilResponse        = z.infer<typeof profilResponseSchema>;
export type ProfilWithToken       = z.infer<typeof profilWithTokenSchema>;
export type TokenResponse         = z.infer<typeof tokenResponseSchema>;