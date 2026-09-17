export interface SaleItemInput {
  quantity: number;
  unitPrice: number;
}

export interface SaleTotals {
  subtotal: number;
  tax: number;
  discounts: number;
  total: number;
}

export class SaleCalculatorDomainService {
  calculateSubtotal(items: SaleItemInput[]): number {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  }

  calculateTotals(
    items: SaleItemInput[],
    tax = 0,
    discounts = 0,
  ): SaleTotals {
    const subtotal = this.calculateSubtotal(items);
    const total = subtotal + tax - discounts;

    return {
      subtotal,
      tax,
      discounts,
      total,
    };
  }
}
