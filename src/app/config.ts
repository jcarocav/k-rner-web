// ─────────────────────────────────────────────────────────
// Configuración del pedido por WhatsApp
// ─────────────────────────────────────────────────────────

// Número de WhatsApp del local en formato internacional,
// SOLO números, sin "+", espacios ni guiones.
// Ejemplo Chile (+56 9 9999 9999) => "56999999999"
export const WHATSAPP_NUMBER = "56999999999";

// Símbolo de moneda usado en el carrito y el mensaje de WhatsApp.
// Los precios actuales en App.tsx están escritos en euros (€),
// pero el local está en Chile (footer/teléfono con +56).
// Si prefieres pesos chilenos, cambia esto a "$" y actualiza
// los precios en menuData / merch dentro de App.tsx.
export const CURRENCY_SYMBOL = "€";
