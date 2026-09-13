import { Status } from '../../../../../common/enums/status.enum';

export class ClientFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
}
