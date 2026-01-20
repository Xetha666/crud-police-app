import { db, User } from 'astro:db';

export default async function seed() {
  await db.insert(User).values([
    { id: "1", username: "Edgard", password: "Edgard1" }
  ]);	
}
