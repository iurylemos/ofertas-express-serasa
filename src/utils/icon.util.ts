export class IconUtil {
  public static methodIcon(methodId: string): string {
    if (methodId === "pix") return "✣";
    if (methodId === "boleto") return "▤";
    return "◈";
  }
}
