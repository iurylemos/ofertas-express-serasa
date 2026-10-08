export class NumberUtil {
  public static formatMoney(amountMinor: number, currency: string): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(amountMinor / 100);
  }
}
