import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateCashRegisterDto, PatchCashRegisterDto, UpdateCashRegisterDto } from "./dto";
import { CashRegistersService } from "./cash-registers.service";

/**
 * Capa Controller del feature CashRegisters.
 * Solo HTTP: lee `req`, llama al service y arma la respuesta.
 */
export class CashRegistersController extends BaseController {
  public constructor(
    private readonly service: CashRegistersService = new CashRegistersService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const cash_registers = await this.service.getAll();
      res.status(200).json({ cash_registers });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const cash_register = await this.service.getOne(this.paramId(req));
      res.status(200).json({ cash_register });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const cash_register = await this.service.create(req.body as CreateCashRegisterDto);
      res.status(201).json({ cash_register });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const cash_register = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateCashRegisterDto
      );
      res.status(200).json({ cash_register });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const cash_register = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchCashRegisterDto
      );
      res.status(200).json({ cash_register });
    });
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Cash register permanently deleted", id });
    });
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const cash_register = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Cash register deactivated (logical delete)",
        cash_register,
      });
    });
  }
}
