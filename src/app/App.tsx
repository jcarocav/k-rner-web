import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Instagram, Twitter, MapPin, Clock, Mail, ShoppingBag, Plus } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "@/app/components/CartDrawer";
import { parsePrice, slugify } from "@/app/lib/format";

type MenuTab = "cafe" | "cocteles" | "comida";

const menuData: Record<MenuTab, { name: string; desc: string; price: string }[]> = {
  cafe: [
    { name: "Espresso Solo", desc: "Origen único, tueste oscuro, notas de cacao amargo y cereza seca", price: "€2.80" },
    { name: "Cortado de Autor", desc: "Espresso con leche texturizada al vapor y cardamomo molido", price: "€3.20" },
    { name: "Cold Brew 18H", desc: "Macerado en frío durante 18 horas, servido con hielo y twist de naranja", price: "€4.50" },
    { name: "Café de Olla", desc: "Canela en rama, piloncillo, receta tradicional mexicana", price: "€3.80" },
    { name: "Latte de Temporada", desc: "Leche de avena, sirope de lavanda provenzal, espuma fina", price: "€4.20" },
    { name: "Matcha Ceremonial", desc: "Grado ceremonial japonés, leche de coco, miel de acacia", price: "€4.80" },
  ],
  cocteles: [
    { name: "Negroni de la Casa", desc: "Gin botánico, Campari, vermouth rojo Punt e Mes, twist de naranja", price: "€10.50" },
    { name: "Mezcal Sour", desc: "Mezcal artesanal Oaxaqueño, limón amarillo, clara de huevo, sal de gusano", price: "€11.00" },
    { name: "Old Fashioned Ahumado", desc: "Bourbon 10 años, bitter de naranja, azúcar moscovado, humo de madera de cerezo", price: "€12.00" },
    { name: "Körner Signature", desc: "Ron añejo 8 años, café frío de especialidad, licor de avellana, hielo esculpido", price: "€11.50" },
    { name: "Spritz Oscuro", desc: "Aperol, cava brut nature, bergamota fresca, ramita de romero", price: "€9.50" },
    { name: "Whisky Highball", desc: "Japonés Suntory Toki, agua con gas Fever-Tree, yuzu, pepino laminado", price: "€13.00" },
  ],
  comida: [
    { name: "Tabla de Ahumados", desc: "Salmón atlántico, trucha de río, queso ahumado, encurtidos y pan negro de centeno", price: "€18.00" },
    { name: "Croquetas Líquidas", desc: "De jamón ibérico de bellota, bechamel fluida, panko japonés dorado", price: "€9.50" },
    { name: "Pulpo a la Brasa", desc: "Papas confitadas en grasa de pato, pimentón de la Vera DOP, aceite de albahaca", price: "€22.00" },
    { name: "Huevos Rotos Nocturnos", desc: "Patatas bravas finas, huevo campero de corral, trufa negra Périgord rallada", price: "€14.00" },
    { name: "Tartar de Atún Rojo", desc: "Aguacate cremoso, soja tamari, aceite de sésamo tostado, crujiente de algas nori", price: "€17.50" },
    { name: "Pan de la Casa", desc: "Masa madre con 72h de fermentación, mantequilla ahumada, flor de sal de Guérande", price: "€5.50" },
  ],
};

const merch = [
  {
    name: "Tote de Lona",
    desc: "100% algodón orgánico certificado, serigrafía en tinta mineral negra",
    price: "€22.00",
    img: "https://images.unsplash.com/photo-1548863227-3af567fc3b27?w=600&h=750&fit=crop&auto=format",
    tag: "BESTSELLER",
    alt: "Tote bag de algodón blanco sobre fondo neutro",
  },
  {
    name: "Taza de Porcelana",
    desc: "350ml, acabado mate interior y exterior, logo grabado bajo esmalte",
    price: "€18.00",
    img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=750&fit=crop&auto=format",
    tag: null,
    alt: "Taza blanca de cerámica con café espresso",
  },
  {
    name: "Café Especialidad 250g",
    desc: "Origen Etiopía Yirgacheffe, proceso lavado, tueste medio-oscuro de autor",
    price: "€14.00",
    img: "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?w=600&h=750&fit=crop&auto=format",
    tag: "EDICIÓN LIMITADA",
    alt: "Taza de café sobre mesa de madera oscura",
  },
  {
    name: "Tote Premium",
    desc: "Lona encerada resistente al agua, asas de cuero curtido, bordado en hilo dorado",
    price: "€38.00",
    img: "https://images.unsplash.com/photo-1627453995730-bf7fd69c30fc?w=600&h=750&fit=crop&auto=format",
    tag: null,
    alt: "Bolsa premium blanca y negra con asa de cuero",
  },
];

const navLinks = [
  { label: "Inicio", id: "inicio" },
  { label: "Menú", id: "menu" },
  { label: "Tienda", id: "merch" },
  { label: "Contacto", id: "contacto" },
];

const DISPLAY = "'Big Shoulders Display', Impact, sans-serif";
const SANS = "'Jost', system-ui, sans-serif";
const MONO = "'DM Mono', 'Courier New', monospace";

export default function App() {
  const [activeTab, setActiveTab] = useState<MenuTab>("cafe");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { addItem, totalItems, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: SANS }}>

      {/* ── NAV ── */}
      <nav
        aria-label="Navegación principal"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center">
          {/* Left links */}
          <div className="hidden md:flex items-center gap-10 flex-1">
            {navLinks.slice(0, 2).map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                style={{ fontFamily: MONO }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Logo — Ö centered */}
          <button
            onClick={() => scrollTo("inicio")}
            className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-4xl font-black text-white hover:text-primary transition-colors duration-300 leading-none"
            style={{ fontFamily: DISPLAY, letterSpacing: "0.05em" }}
          >
            Ö
          </button>

          {/* Right links */}
          <div className="hidden md:flex items-center gap-10 flex-1 justify-end">
            {navLinks.slice(2).map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                style={{ fontFamily: MONO }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={openCart}
              className="relative text-foreground hover:text-primary transition-colors duration-300"
              aria-label="Ver carrito"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center"
                  style={{ fontFamily: MONO }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: carrito + hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-5">
            <button onClick={openCart} className="relative text-foreground hover:text-primary transition-colors" aria-label="Ver carrito">
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center"
                  style={{ fontFamily: MONO }}
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Abrir menú"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-56 border-b border-border" : "max-h-0"
          } bg-background/97 backdrop-blur-md`}
        >
          <div className="flex flex-col items-center gap-7 py-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontFamily: MONO }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="inicio" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image — minimal overlay so red neon bleeds through */}
        <div className="absolute inset-0 bg-[#0a0808]">
          <img
            src="https://images.unsplash.com/photo-1578911489158-334e5cd2a051?w=1800&h=1100&fit=crop&auto=format"
            alt="Interior de bar Körner con iluminación roja de neón"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        {/* Thin vignette — only edges, keep the red neon center alive */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/50" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          {/* Ö mark */}
          <div
            className="text-6xl md:text-7xl font-black text-white leading-none mb-2"
            style={{ fontFamily: DISPLAY }}
          >
            
          </div>

          {/* KÖRNER */}
          <h1
            className="font-black text-white leading-none tracking-tight mb-0"
            style={{ fontFamily: DISPLAY, letterSpacing: "-0.01em", fontSize: "clamp(3.4rem, 17vw, 11rem)" }}
          >
            KÖRNER
          </h1>

          <p
            className="text-[18px] tracking-[0.55em] uppercase text-white/60 mt-3 mb-8"
            style={{ fontFamily: MONO }}
          >
            Bar · Cafetería
          </p>

          <p
            className="text-white/50 text-sm font-light tracking-wide leading-relaxed max-w-xs mb-10"
            style={{ fontFamily: SANS }}
          >
            Un concepto completamente nuevo en Punta Arenas, diseño y entretenimiento.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("menu")}
              className="px-8 py-3 bg-white text-background text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-primary hover:text-white transition-colors duration-300"
              style={{ fontFamily: MONO }}
            >
              Ver Menú
            </button>
            <button
              onClick={() => scrollTo("merch")}
              className="px-8 py-3 border border-white/25 text-[11px] tracking-[0.35em] uppercase text-white/60 hover:text-white hover:border-white/50 transition-colors duration-300"
              style={{ fontFamily: MONO }}
            >
              Nuestra Tienda
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/25">
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: MONO }}>Scroll</span>
          <ChevronDown size={14} className="animate-bounce mt-1" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="order-2 md:order-1">
            <p
              className="text-primary text-[11px] tracking-[0.45em] uppercase mb-6"
              style={{ fontFamily: MONO }}
            >
              Nuestra historia
            </p>
            <h2
              className="text-5xl md:text-7xl font-black text-white leading-none mb-8 uppercase"
              style={{ fontFamily: DISPLAY }}
            >
              Un rincón<br />
              <span className="text-primary">para los que saben</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light mb-5" style={{ fontFamily: SANS }}>
              Körner nació de una idea simple: que un buen café por la mañana y un cóctel
              bien hecho por la noche pueden coexistir en el mismo espacio, con el mismo criterio.
            </p>
            <p className="text-muted-foreground leading-relaxed font-light mb-10" style={{ fontFamily: SANS }}>
              Trabajamos con tostadores de especialidad, productores locales y bartenders que
              entienden que cada copa y cada taza cuentan una historia. Sin pretensiones.
              Con mucho criterio.
            </p>
            <div className="flex gap-12 border-t border-border pt-8">
              {[
                ["Lun – Vie", "8:00 – 02:00"],
                ["Sáb – Dom", "10:00 – 03:00"],
              ].map(([day, time]) => (
                <div key={day}>
                  <p className="text-[10px] tracking-[0.35em] text-primary uppercase mb-2" style={{ fontFamily: MONO }}>{day}</p>
                  <p className="text-white font-light text-sm" style={{ fontFamily: SANS }}>{time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 relative h-72 md:h-[520px] bg-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1656329379773-5ff518e51ed4?w=700&h=900&fit=crop&auto=format"
              alt="Barra del bar Körner con iluminación cálida nocturna"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 border border-border bg-background/70 backdrop-blur-sm px-3 py-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60" style={{ fontFamily: MONO }}>Punta Arenas, Chile</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* ── MENU ── */}
      <section id="menu" className="py-24 md:py-36 bg-secondary">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p
                className="text-primary text-[11px] tracking-[0.5em] uppercase mb-4"
                style={{ fontFamily: MONO }}
              >
                Lo que ofrecemos
              </p>
              <h2
                className="text-5xl md:text-8xl font-black text-white leading-none uppercase"
                style={{ fontFamily: DISPLAY }}
              >
                Nuestra Carta
              </h2>
            </div>
            <p className="text-muted-foreground font-light text-sm max-w-xs leading-relaxed" style={{ fontFamily: SANS }}>
              Ingredientes de temporada. Productores de confianza. Sin concesiones en la calidad.
            </p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 mb-12 border border-border w-fit">
            {(["cafe", "cocteles", "comida"] as MenuTab[]).map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-3 text-[11px] tracking-[0.3em] uppercase transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                } ${i > 0 ? "border-l border-border" : ""}`}
                style={{ fontFamily: MONO }}
              >
                {tab === "cafe" ? "Café" : tab === "cocteles" ? "Cócteles" : "Cocina"}
              </button>
            ))}
          </div>

          {/* Menu grid */}
          <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
            {menuData[activeTab].map((item, i) => (
              <div
                key={`${activeTab}-${i}`}
                className="bg-secondary hover:bg-card transition-colors duration-300 p-7 md:p-8 group"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors duration-300 uppercase"
                      style={{ fontFamily: DISPLAY }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed" style={{ fontFamily: SANS }}>
                      {item.desc}
                    </p>
                  </div>
                  <span
                    className="text-white text-sm shrink-0 pt-1"
                    style={{ fontFamily: MONO }}
                  >
                    {item.price}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex-1 h-px bg-border/60 group-hover:bg-primary/40 transition-colors duration-300" />
                  <button
                    onClick={() =>
                      addItem({
                        id: slugify(`menu-${item.name}`),
                        name: item.name,
                        price: parsePrice(item.price),
                        category: "menu",
                      })
                    }
                    className="ml-4 flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors duration-200 shrink-0"
                    style={{ fontFamily: MONO }}
                  >
                    <Plus size={12} />
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Photo strip */}
          <div className="mt-12 grid grid-cols-3 gap-4 h-52 md:h-72">
            <div className="col-span-2 relative bg-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1772311698901-fe3fa07141be?w=900&h=500&fit=crop&auto=format"
                alt="Cócteles de colores sobre superficie oscura y reflectante"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 to-transparent" />
              <div className="absolute bottom-5 left-6">
                <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-1.5" style={{ fontFamily: MONO }}>Cócteles</p>
                <p className="text-white text-xl md:text-2xl font-black leading-tight uppercase" style={{ fontFamily: DISPLAY }}>
                  Creaciones<br />de temporada
                </p>
              </div>
            </div>
            <div className="relative bg-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1765646772493-7b5341714eea?w=500&h=600&fit=crop&auto=format"
                alt="Mesa de restaurante íntimamente iluminada"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-1.5" style={{ fontFamily: MONO }}>Cocina</p>
                <p className="text-white text-lg md:text-xl font-black leading-tight uppercase" style={{ fontFamily: DISPLAY }}>
                  Producto<br />de autor
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MERCH ── */}
      <section id="merch" className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p
                className="text-primary text-[11px] tracking-[0.5em] uppercase mb-4"
                style={{ fontFamily: MONO }}
              >
                Llévalo contigo
              </p>
              <h2
                className="text-5xl md:text-8xl font-black text-white leading-none uppercase"
                style={{ fontFamily: DISPLAY }}
              >
                Merch
              </h2>
            </div>
            <p className="text-muted-foreground font-light text-sm max-w-xs leading-relaxed" style={{ fontFamily: SANS }}>
              Objetos hechos con el mismo cuidado que ponemos en cada taza. Para llevar un poco de Körner donde vayas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {merch.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative bg-card overflow-hidden mb-4" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {item.tag && (
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-[9px] tracking-[0.25em] uppercase bg-white text-background px-2 py-1"
                        style={{ fontFamily: MONO }}
                      >
                        {item.tag}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() =>
                        addItem({
                          id: slugify(`merch-${item.name}`),
                          name: item.name,
                          price: parsePrice(item.price),
                          category: "merch",
                        })
                      }
                      className="w-full py-2.5 bg-white text-background text-[10px] tracking-[0.35em] uppercase hover:bg-primary hover:text-white transition-colors duration-200"
                      style={{ fontFamily: MONO }}
                    >
                      Añadir al carro
                    </button>
                  </div>
                </div>

                <h3
                  className="text-base font-black text-white mb-1.5 group-hover:text-primary transition-colors duration-300 uppercase"
                  style={{ fontFamily: DISPLAY }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-muted-foreground text-xs font-light mb-2.5 leading-relaxed"
                  style={{ fontFamily: SANS }}
                >
                  {item.desc}
                </p>
                <p className="text-white text-sm" style={{ fontFamily: MONO }}>
                  {item.price}
                </p>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div className="mt-16 border border-border p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-card">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-2" style={{ fontFamily: MONO }}>
                Envíos a toda España
              </p>
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: DISPLAY }}>
                ¿Quieres personalizar tu pedido?
              </h3>
              <p className="text-muted-foreground text-sm font-light mt-2" style={{ fontFamily: SANS }}>
                Para pedidos corporativos o merchandising personalizado, escríbenos.
              </p>
            </div>
            <a
              href="mailto:hola@korner.es"
              className="shrink-0 px-8 py-3 bg-white text-background text-[11px] tracking-[0.35em] uppercase font-medium hover:bg-primary hover:text-white transition-colors duration-300 text-center"
              style={{ fontFamily: MONO }}
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contacto" className="border-t border-border bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-3 gap-12 md:gap-16">

          <div>
            <h3
              className="text-4xl font-black text-white mb-1 tracking-tight uppercase"
              style={{ fontFamily: DISPLAY }}
            >
              Körner
            </h3>
            <p className="text-primary text-[10px] tracking-[0.35em] uppercase mb-6" style={{ fontFamily: MONO }}>
              Cafetería & Bar
            </p>
            <div className="flex items-start gap-2 text-muted-foreground text-sm font-light mb-3" style={{ fontFamily: SANS }}>
              <MapPin size={14} className="shrink-0 mt-0.5 text-primary" />
              <span>Pasaje Emilio Körner #1022<br />Punta Arenas, Chile</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-light mb-3" style={{ fontFamily: SANS }}>
              <Mail size={14} className="shrink-0 text-primary" />
              <a href="mailto:hola@korner.cl" className="hover:text-white transition-colors">
                hola@korner.cl
              </a>
            </div>
            <div className="flex gap-3 mt-6">
              {[Instagram, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-white/30 transition-colors duration-300"
                  aria-label="Red social"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 flex items-center gap-2"
              style={{ fontFamily: MONO }}
            >
              <Clock size={12} />
              Horarios
            </p>
            <div className="space-y-3 text-sm font-light" style={{ fontFamily: SANS }}>
              {[
                ["Lunes – Viernes", "8:00 – 02:00"],
                ["Sábado", "10:00 – 03:00"],
                ["Domingo", "10:00 – 00:00"],
                ["Festivos", "12:00 – 00:00"],
              ].map(([day, time]) => (
                <div key={day} className="flex justify-between items-center gap-8 border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">{day}</span>
                  <span className="text-white" style={{ fontFamily: MONO }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6"
              style={{ fontFamily: MONO }}
            >
              Reservas & Eventos
            </p>
            <p className="text-muted-foreground text-sm font-light leading-relaxed mb-5" style={{ fontFamily: SANS }}>
              Para grupos de más de 8 personas o eventos privados, contáctanos
              directamente. Ofrecemos menús cerrados y cócteles de bienvenida.
            </p>
            <a
              href="tel:+34910000000"
              className="block text-white text-sm hover:text-primary transition-colors duration-300 mb-2"
              style={{ fontFamily: MONO }}
            >
              +56 9 9999 9999
            </a>
            <a
              href="mailto:reservas@korner.es"
              className="text-sm text-muted-foreground hover:text-white transition-colors duration-300 underline underline-offset-4"
              style={{ fontFamily: SANS }}
            >
              reservas@korner.cl
            </a>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
            <p
              className="text-white/30 text-[10px] tracking-[0.25em] uppercase"
              style={{ fontFamily: MONO }}
            >
              © 2026 Körner · Punta Arenas - Magallanes, Chile. Todos los derechos reservados.
            </p>
            <p
              className="text-white/20 text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: MONO }}
            >
              Hecho con criterio.
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer />

    </div>
  );
}
