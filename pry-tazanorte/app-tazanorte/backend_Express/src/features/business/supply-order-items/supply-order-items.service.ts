import { SupplyOrderItemsRepository } from "./supply-order-items.repository";
import { CreateSupplyOrderItemDto, UpdateSupplyOrderItemDto, PatchSupplyOrderItemDto, SupplyOrderItemResponseDto, toSupplyOrderItemResponse } from "./dto";
import { SupplyOrderItem } from "./supply-order-item.model";
import { AppError } from "../../../shared/errors/app-error";

export class SupplyOrderItemsService {
  public constructor(
    private readonly repository: SupplyOrderItemsRepository = new SupplyOrderItemsRepository()
  ) {}

  public async getAll(): Promise<SupplyOrderItemResponseDto[]> {
    const items = await this.repository.findAll();
    return items.map((item) => toSupplyOrderItemResponse(item));
  }

  public async getOne(id: number): Promise<SupplyOrderItemResponseDto> {
    return toSupplyOrderItemResponse(await this.findOrFail(id));
  }

  public async create(body: CreateSupplyOrderItemDto): Promise<SupplyOrderItemResponseDto> {
    const item = await this.repository.create({
      orderItemId: body.orderItemId,
      supplyId: body.supplyId,
      quantityUsed: body.quantityUsed,
    });
    return toSupplyOrderItemResponse(item);
  }

  public async updatePut(id: number, body: UpdateSupplyOrderItemDto): Promise<SupplyOrderItemResponseDto> {
    const item = await this.findOrFail(id);
    const updated = await this.repository.update(item, {
      orderItemId: body.orderItemId,
      supplyId: body.supplyId,
      quantityUsed: body.quantityUsed,
    });
    return toSupplyOrderItemResponse(updated);
  }

  public async updatePatch(id: number, body: PatchSupplyOrderItemDto): Promise<SupplyOrderItemResponseDto> {
    const item = await this.findOrFail(id);
    const updated = await this.repository.update(item, body);
    return toSupplyOrderItemResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const item = await this.findOrFail(id);
    await this.repository.delete(item);
  }

  private async findOrFail(id: number): Promise<SupplyOrderItem> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(404, "Supply order item not found");
    }
    return item;
  }
}
