// Convierte un precio en texto (ej: "€12.00") a número (12.0)
export function parsePrice(priceText: string): number {
  const cleaned = priceText.replace(/[^0-9.,]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isNaN(value) ? 0 : value;
}

// Genera un id estable a partir de un nombre, ej: "Cold Brew 18H" -> "cold-brew-18h"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
