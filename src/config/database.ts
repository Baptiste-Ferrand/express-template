import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;
  console.log(uri)
  if (!uri) {
    console.error('❌ MONGO_URI non définie dans .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ Échec connexion MongoDB', err);
    process.exit(1);
  }
}
