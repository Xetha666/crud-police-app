import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text({ unique: true }),
    password: column.text(),
    name: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  }
})

export default defineDb({
  tables: { User }
});
