import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCashRegisterShiftUseCase } from '../../application/use-cases/create-cash-register-shift.use-case';
import { GetCashRegisterShiftsUseCase } from '../../application/use-cases/get-cash-register-shifts.use-case';
import { CreateCashRegisterShiftDto } from '../dtos/create-cash-register-shift.dto';

@Controller('cash-registers')
export class CashRegistersController {
  constructor(
    private readonly createCashRegisterShiftUseCase: CreateCashRegisterShiftUseCase,
    private readonly getCashRegisterShiftsUseCase: GetCashRegisterShiftsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCashRegisterShiftDto) {
    return this.createCashRegisterShiftUseCase.execute(dto);
  }

  @Get()
  async findAll() {
    return this.getCashRegisterShiftsUseCase.execute();
  }
}
