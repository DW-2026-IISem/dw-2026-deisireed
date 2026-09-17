export const createSalesTableMigration = {
  name: 'create-sales-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE sales (...), CREATE TABLE product_sales (...)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE product_sales, DROP TABLE sales
  },
};
