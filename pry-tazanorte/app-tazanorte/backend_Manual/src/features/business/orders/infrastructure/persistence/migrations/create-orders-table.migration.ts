export const createOrdersTableMigration = {
  name: 'create-orders-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
  },
  async down(): Promise<void> {
    // Production: DROP TABLE pedidos
  },
};
