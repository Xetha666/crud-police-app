import { db, User } from 'astro:db';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

export default async function seed() {
  const password = process.env.DB_USER_PASSWORD;

  if (!password) {
    throw new Error("ERROR: No se encontró DB_USER_PASSWORD en el archivo .env");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  //await db.delete(User);

  await db.insert(User).values([
    { 
      id: "1", 
      username: "Edgard2692", 
      password: hashedPassword,
      name: "Edgard" 
    }
  ]);
}
