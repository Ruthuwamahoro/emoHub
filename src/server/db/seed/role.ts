import { eq } from 'drizzle-orm';
import db from '..';
import { Role } from '../schema';

const seedRoles = async () => {
  const roles = [
    {
      id: '5d8fde84-524e-4f07-bdf5-f64ed3cb3719',
      name: 'SuperAdmin',
      description: 'Administrator with full access',
    },
    {
      id: '5d8fde84-524e-4f07-bdf5-f64ed3cb3720',
      name: 'Admin',
      description: 'Care giver with limited access',
    },
    {
      id: '5d8fde84-524e-4f07-bdf5-f64ed3cb3721',
      name: 'Moderator',
      description: 'Regular user with basic access',
    },
    {
    id: '5d8fde84-524e-4f07-bdf5-f64ed3cb3722',
    name: 'Specialists',
    description: 'Counsellor with basic access',
    },
    {
      id: '5d8fde84-524e-4f07-bdf5-f64ed3cb3723',
      name: 'User',
      description: 'This is the admin role',
    }
  ];

  for (const role of roles) {
    const existingRole = await db
      .select()
      .from(Role)
      .where(eq(Role.id, role.id))
      .limit(1);

    if (existingRole.length === 0) {
      await db.insert(Role).values(role).returning();
    } else {
      await db
        .update(Role)
        .set({
          name: role.name,
          description: role.description,
        })
        .where(eq(Role.id, role.id));
    }
  }
};
seedRoles().catch(error => {
  process.exit(1);
});
