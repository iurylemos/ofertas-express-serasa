export class StringUtil {
  public static initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toLocaleUpperCase("pt-BR"))
      .join("");
  }
}
