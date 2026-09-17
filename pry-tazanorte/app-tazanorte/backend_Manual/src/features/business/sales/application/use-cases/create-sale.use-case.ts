import { Inject, Injectable } from '@nestjs/common';
import { ClientNotFoundException } from '../../../clients/domain/exceptions/client-not-found.exception';
import {
  CLIENT_REPOSITORY,
  type IClientRepository,
} from '../../../clients/domain/interfaces/client-repository.interface';
import { ProductNotFoundException } from '../../../products/domain/exceptions/product-not-found.exception';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/interfaces/product-repository.interface';
import { InsufficientStockException } from '../../domain/exceptions/insufficient-stock.exception';
import { Sale, SaleItem } from '../../domain/entities/sale.entity';
import {
  type ISaleRepository,
  SALE_REPOSITORY,
} from '../../domain/interfaces/sale-repository.interface';
import { SaleCalculatorDomainService } from '../../domain/services/sale-calculator.domain-service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleMapper } from '../mappers/sale.mapper';

@Injectable()
export class CreateSaleUseCase {
  private readonly saleCalculator = new SaleCalculatorDomainService();

  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateSaleDto) {
    const client = await this.clientRepository.findById(dto.clientId);
    if (!client) {
      throw new ClientNotFoundException(dto.clientId);
    }

    const saleItems: SaleItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productRepository.findById(itemDto.productId);
      if (!product) {
        throw new ProductNotFoundException(itemDto.productId);
      }

      const productStock = (product as any).stock ?? (product as any).quantity ?? 0;

      if (productStock < itemDto.quantity) {
        throw new InsufficientStockException(
          (product as any).name ?? `Producto #${product.id}`,
          productStock,
          itemDto.quantity,
        );
      }

      saleItems.push(
        SaleItem.create({
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
        }),
      );
    }

    const totals = this.saleCalculator.calculateTotals(
      dto.items,
      dto.tax ?? 0,
      dto.discounts ?? 0,
    );

    const sale = Sale.create({
      saleDate: new Date(),
      subtotal: totals.subtotal,
      tax: totals.tax,
      discounts: totals.discounts,
      total: totals.total,
      clientId: dto.clientId,
      items: saleItems,
    });

    const created = await this.saleRepository.create(sale);
    return SaleMapper.toResponse(created);
  }
}
