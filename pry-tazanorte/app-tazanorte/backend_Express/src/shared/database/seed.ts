import { sequelize } from './index';
import { UserModel } from './models/user.model';
import { RoleModel } from './models/role.model';
import { ResourceModel } from './models/resource.model';
import { RoleUserModel } from './models/role-user.model';
import { ResourceRoleModel } from './models/resource-role.model';
import { PasswordHasher } from '../auth/password';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Iniciando proceso de Seeding...');

    // Sincronizar tablas en la base de datos
    await sequelize.sync({ alter: true });

    // 1. Roles Base
    const [adminRole] = await RoleModel.findOrCreate({
      where: { name: 'ADMIN' },
      defaults: { name: 'ADMIN', description: 'Administrador del sistema con acceso total' },
    });

    const [userRole] = await RoleModel.findOrCreate({
      where: { name: 'USER' },
      defaults: { name: 'USER', description: 'Usuario estándar del sistema' },
    });

    // 2. Usuario Administrador por Defecto
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tazanorte.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456!';
    const passwordHash = await PasswordHasher.hash(adminPassword);

    const [adminUser, createdUser] = await UserModel.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'Super Admin',
        email: adminEmail,
        password_hash: passwordHash,
        is_active: true,
      },
    });

    // Asignar Rol ADMIN al usuario creado
    await RoleUserModel.findOrCreate({
      where: { user_id: adminUser.id, role_id: adminRole.id },
      defaults: { user_id: adminUser.id, role_id: adminRole.id },
    });

    // 3. Registrar Recurso de Ejemplo (Ruta protegida para pruebas)
    const [userResource] = await ResourceModel.findOrCreate({
      where: { method: 'GET', path: '/api/users' },
      defaults: {
        name: 'Obtener Usuarios',
        path: '/api/users',
        method: 'GET',
        module: 'USERS',
      },
    });

    // Asignar Permiso de Recurso al Rol ADMIN
    await ResourceRoleModel.findOrCreate({
      where: { resource_id: userResource.id, role_id: adminRole.id },
      defaults: { resource_id: userResource.id, role_id: adminRole.id },
    });

    console.log('✅ Seeding completado exitosamente.');
    console.log(`👤 Usuario Admin: ${adminEmail}`);
    console.log(`🔑 Contraseña: ${adminPassword}`);
  } catch (error) {
    console.error('❌ Error durante el Seeding:', error);
    throw error;
  }
};

// Permitir ejecución directa desde CLI
if (require.main === module) {
  sequelize.authenticate()
    .then(() => seedDatabase())
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
