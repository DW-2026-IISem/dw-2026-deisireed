import { App } from "./config/index";
import { connectDB } from "./database/db";

const PORT = process.env.PORT || 4000;
const server = new App().app;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor oñepyrũma ko puerto-pe: http://localhost:${PORT}`);
    console.log(`Swagger omba'apo ko'ápe: http://localhost:${PORT}/api/docs`);
  });
});
