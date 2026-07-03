import { CartItem } from "@/app/context/CartContext";
import { WHATSAPP_NUMBER } from "@/app/config";

export type CheckoutInfo = {
  name: string;
  phone: string;
  method: "delivery" | "retiro";
  address?: string;
  notes?: string;
};

export function buildOrderMessage(
  items: CartItem[],
  total: number,
  info: CheckoutInfo,
  currency: string
): string {
  const lines: string[] = [];

  lines.push("Hola Körner! 👋 Quiero hacer el siguiente pedido:");
  lines.push("");

  const menuItems = items.filter((i) => i.category === "menu");
  const merchItems = items.filter((i) => i.category === "merch");

  if (menuItems.length > 0) {
    lines.push("*Menú:*");
    menuItems.forEach((i) => {
      lines.push(`• ${i.qty}x ${i.name} — ${currency}${(i.price * i.qty).toFixed(2)}`);
    });
    lines.push("");
  }

  if (merchItems.length > 0) {
    lines.push("*Merch:*");
    merchItems.forEach((i) => {
      lines.push(`• ${i.qty}x ${i.name} — ${currency}${(i.price * i.qty).toFixed(2)}`);
    });
    lines.push("");
  }

  lines.push(`*Total: ${currency}${total.toFixed(2)}*`);
  lines.push("");
  lines.push(`Nombre: ${info.name}`);
  lines.push(`Teléfono: ${info.phone}`);
  lines.push(`Entrega: ${info.method === "delivery" ? "Delivery" : "Retiro en local"}`);

  if (info.method === "delivery" && info.address) {
    lines.push(`Dirección: ${info.address}`);
  }
  if (info.notes && info.notes.trim()) {
    lines.push(`Notas: ${info.notes}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
