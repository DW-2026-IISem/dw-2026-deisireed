import { PartialType } from '@nestjs/mapped-types';
import { CreateCashRegisterShiftDto } from './create-cash-register-shift.dto';

export class UpdateCashRegisterShiftDto extends PartialType(CreateCashRegisterShiftDto) {}
