import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IProfil extends Document {
  profil_id: string;
  email: string;
  password: string;
  createdAt: Date;
}

const ProfilSchema = new Schema<IProfil>({
  profil_id: { type: String, default: () => uuidv4(), unique: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  createdAt:  { type: Date,   default: () => new Date() }
});

export const ProfilModel = model<IProfil>('Profil', ProfilSchema);
