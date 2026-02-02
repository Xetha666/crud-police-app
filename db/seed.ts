import { db, User } from 'astro:db';
import bcrypt from 'bcryptjs';
import 'dotenv/config';



export default async function seed() {
  const password = process.env.DB_USER_PASSWORD;

  if (!password) {
    throw new Error("ERROR: No se encontró DB_USER_PASSWORD en el archivo .env");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedTestPassword = await bcrypt.hash("test123", 10);
  
  //await db.delete(User);

  await db.insert(User).values([
    { 
      id: "1", 
      username: "Edgard2692", 
      password: hashedPassword,
      name: "Edgard" 
    },
    { 
      id: "2", 
      username: "test", 
      password: hashedTestPassword, //test123
      name: "Test User" 
    }
  ]);
}
