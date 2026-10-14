import { Router } from "express";
import { SessionController } from "./session.controller";
import { authenticate } from "../access";

const router = Router();
const controller = new SessionController();

router.post("/login", (req, res) => controller.login(req, res));
router.post("/refresh", (req, res) => controller.refresh(req, res));
router.post("/logout", (req, res) => controller.logout(req, res));
router.get("/me", authenticate, (req, res) => controller.me(req, res));

export default router;
