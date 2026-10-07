import { CreationAttributes, Transaction } from "sequelize";
import { SupplyOrderItem } from "./supply-order-item.model";

export class SupplyOrderItemsRepository {
  public async findAll(): Promise<SupplyOrderItem[]> {
    return SupplyOrderItem.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<SupplyOrderItem | null> {
    return SupplyOrderItem.findByPk(id, { transaction });
  }

  public async create(data: CreationAttributes<SupplyOrderItem>, transaction?: Transaction): Promise<SupplyOrderItem> {
    return SupplyOrderItem.create(data, { transaction });
  }

  public async update(item: SupplyOrderItem, data: Partial<SupplyOrderItem>, transaction?: Transaction): Promise<SupplyOrderItem> {
    return item.update(data, { transaction });
  }

  public async delete(item: SupplyOrderItem, transaction?: Transaction): Promise<void> {
    await item.destroy({ transaction });
  }
}
