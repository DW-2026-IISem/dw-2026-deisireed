import { Router } from "express";

export const apiRouter = Router();

// Ruta de diagnóstico
apiRouter.get("/v1/clientes-test", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Enrutador API funcionando",
  });
});
