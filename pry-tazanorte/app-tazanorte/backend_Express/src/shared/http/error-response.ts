import { Response } from "express";
import { AppError } from "../errors/app-error";

/**
 * Único punto donde se traduce un error a HTTP.
 * AppError -> su statusCode; cualquier otra cosa -> 500.
 */
export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: "Internal server error", detail: String(error) });
}
