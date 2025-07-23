import { ProfilModel, IProfil } from '../entity/profil.entity';

export class ProfilService {
  static async createProfil(profil: {
    email: string;
    password: string;
  }): Promise<IProfil> {
    const doc = new ProfilModel(profil);
    return doc.save();
  }

  static async findByEmail(email: string): Promise<IProfil | null> {
    return ProfilModel.findOne({ email }).exec();
  }

  static async deleteProfil(profilId: string): Promise<IProfil | null> {
    return ProfilModel
      .findOneAndDelete({ profil_id: profilId })
      .exec();
  }

}