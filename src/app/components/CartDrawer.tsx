import { useEffect, useRef, useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { buildOrderMessage, buildWhatsAppLink } from "@/app/lib/whatsapp";
import { CURRENCY_SYMBOL } from "@/app/config";

const MONO = "'DM Mono', 'Courier New', monospace";
const SANS = "'Jost', system-ui, sans-serif";
const DISPLAY = "'Big Shoulders Display', Impact, sans-serif";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"delivery" | "retiro">("delivery");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const canSubmit = name.trim() !== "" && phone.trim() !== "" && (method === "retiro" || address.trim() !== "");

  const handleClose = () => {
    closeCart();
    setStep("cart");
  };

  const handleSend = () => {
    const message = buildOrderMessage(items, totalPrice, { name, phone, method, address, notes }, CURRENCY_SYMBOL);
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    clearCart();
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md h-full bg-background border-l border-border flex flex-col" role="dialog" aria-modal="true" aria-label="Carrito de compras" tabIndex={-1} ref={panelRef}>
        <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
          <h2 className="text-lg font-black text-white uppercase" style={{ fontFamily: DISPLAY }}>
            {step === "cart" ? "Tu pedido" : "Datos de entrega"}
          </h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-white transition-colors" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === "cart" ? (
            items.length === 0 ? (
              <p className="text-muted-foreground text-sm font-light" style={{ fontFamily: SANS }}>
                Tu carrito está vacío. Agrega algo del menú o de la tienda.
              </p>
            ) : (
              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start border-b border-border/60 pb-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5" style={{ fontFamily: MONO }}>
                        {CURRENCY_SYMBOL}
                        {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3 mt-2.5">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 border border-border flex items-center justify-center text-white hover:border-primary transition-colors"
                          aria-label="Restar"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm w-4 text-center" style={{ fontFamily: MONO }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-6 h-6 border border-border flex items-center justify-center text-white hover:border-primary transition-colors"
                          aria-label="Sumar"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-white text-sm shrink-0" style={{ fontFamily: MONO }}>
                      {CURRENCY_SYMBOL}
                      {(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-5">
              <div>
                <label htmlFor="checkout-name" className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2" style={{ fontFamily: MONO }}>
                  Nombre
                </label>
                <input
                  id="checkout-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-card border border-border px-3 py-2.5 text-white text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="checkout-phone" className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2" style={{ fontFamily: MONO }}>
                  Teléfono
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-card border border-border px-3 py-2.5 text-white text-sm outline-none focus:border-primary transition-colors"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <fieldset>
                <legend className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2" style={{ fontFamily: MONO }}>
                  Tipo de entrega
                </legend>
                <div className="flex gap-0 border border-border w-fit" role="group" aria-label="Tipo de entrega">
                  {(["delivery", "retiro"] as const).map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={method === m}
                      onClick={() => setMethod(m)}
                      className={`px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                        method === m ? "bg-white text-background" : "text-muted-foreground hover:text-white"
                      } ${i > 0 ? "border-l border-border" : ""}`}
                      style={{ fontFamily: MONO }}
                    >
                      {m === "delivery" ? "Delivery" : "Retiro en local"}
                    </button>
                  ))}
                </div>
              </fieldset>
              {method === "delivery" && (
                <div>
                  <label htmlFor="checkout-address" className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2" style={{ fontFamily: MONO }}>
                    Dirección
                  </label>
                  <input
                    id="checkout-address"
                    name="address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-card border border-border px-3 py-2.5 text-white text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Calle, número, referencia"
                  />
                </div>
              )}
              <div>
                <label htmlFor="checkout-notes" className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2" style={{ fontFamily: MONO }}>
                  Notas (opcional)
                </label>
                <textarea
                  id="checkout-notes"
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-card border border-border px-3 py-2.5 text-white text-sm outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Alergias, instrucciones especiales, etc."
                />
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-6 space-y-4 shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs uppercase tracking-[0.3em]" style={{ fontFamily: MONO }}>
                Total
              </span>
              <span className="text-white text-lg" style={{ fontFamily: MONO }}>
                {CURRENCY_SYMBOL}
                {totalPrice.toFixed(2)}
              </span>
            </div>

            {step === "cart" ? (
              <button
                onClick={() => setStep("form")}
                className="w-full py-3 bg-white text-background text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-primary hover:text-white transition-colors duration-300"
                style={{ fontFamily: MONO }}
              >
                Continuar
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("cart")}
                  className="flex-1 py-3 border border-border text-[11px] tracking-[0.35em] uppercase text-muted-foreground hover:text-white transition-colors duration-300"
                  style={{ fontFamily: MONO }}
                >
                  Volver
                </button>
                <button
                  disabled={!canSubmit}
                  onClick={handleSend}
                  className="flex-1 py-3 bg-[#25D366] text-background text-[11px] tracking-[0.35em] uppercase font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-300"
                  style={{ fontFamily: MONO }}
                >
                  Enviar por WhatsApp
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
