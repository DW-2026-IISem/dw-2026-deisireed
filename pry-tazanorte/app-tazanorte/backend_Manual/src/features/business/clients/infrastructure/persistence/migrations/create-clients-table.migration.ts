export const createClientsTableMigration = {
  name: 'create-clients-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
  },
  async down(): Promise<void> {
    // Production: DROP TABLE clients
  },
};
