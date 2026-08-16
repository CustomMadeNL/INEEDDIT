"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: "Wonen" | "Beauty" | "Viral";
  price: number;
  oldPrice: number;
  rating: string;
  label: string;
  icon: string;
  color: string;
  description: string;
};

const products: Product[] = [
  { id: 1, name: "Spin & Store Organizer", category: "Wonen", price: 24.95, oldPrice: 39.95, rating: "4.8", label: "BESTSELLER", icon: "↻", color: "lime", description: "Nooit meer graven in een volle kast." },
  { id: 2, name: "CloudCurl Heatless Set", category: "Beauty", price: 19.95, oldPrice: 29.95, rating: "4.9", label: "VIRAL", icon: "〰", color: "pink", description: "Wakker worden met zachte curls, zonder hitte." },
  { id: 3, name: "Pocket Label Studio", category: "Viral", price: 34.95, oldPrice: 49.95, rating: "4.7", label: "INEEDDIT PICK", icon: "▣", color: "blue", description: "Print labels vanaf je telefoon. Alles op orde." },
  { id: 4, name: "FreshLock Mini Sealer", category: "Wonen", price: 14.95, oldPrice: 22.95, rating: "4.6", label: "HOT", icon: "≋", color: "orange", description: "Sluit open zakken in seconden opnieuw af." },
  { id: 5, name: "IcePop Facial Roller", category: "Beauty", price: 17.95, oldPrice: 26.95, rating: "4.8", label: "SELFCARE", icon: "✦", color: "blue", description: "Een frisse start voor je ochtendroutine." },
  { id: 6, name: "SwipeClean Hair Brush", category: "Viral", price: 21.95, oldPrice: 32.95, rating: "4.9", label: "TIKTOK MADE ME", icon: "⌁", color: "pink", description: "Eén druk en je borstel is weer schoon." },
];

const money = (value: number) => `€ ${value.toFixed(2).replace(".", ",")}`;

export default function Home() {
  const [filter, setFilter] = useState("Alles");
  const [cart, setCart] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  const visibleProducts = useMemo(
    () => filter === "Alles" ? products : products.filter((product) => product.category === filter),
    [filter],
  );

  const cartProducts = cart.map((id) => products.find((product) => product.id === id)!).filter(Boolean);
  const total = cartProducts.reduce((sum, product) => sum + product.price, 0);

  function addToCart(product: Product) {
    setCart((current) => [...current, product.id]);
    setToast(`${product.name} zit in je mandje`);
    window.setTimeout(() => setToast(""), 2200);
  }

  return (
    <main>
      <div className="announcement">VANDAAG GESPOT · MORGEN JOUW FAVORIET · GRATIS VERZENDING VANAF €50</div>
      <header className="nav shell">
        <a className="logo" href="#top" aria-label="INEEDDIT home">I<span>NEED</span>DIT<i>.</i></a>
        <nav aria-label="Hoofdnavigatie">
          <a href="#shop">Shop</a><a href="#categories">Categorieën</a><a href="#why">Waarom wij</a>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Winkelmand met ${cart.length} items`}>
          Mandje <b>{cart.length}</b>
        </button>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">HET INTERNET, MAAR DAN GECUREERD.</p>
          <h1>Waarom heb ik dit <em>niet eerder</em> gekocht?</h1>
          <p className="hero-text">Slimme vondsten, virale must-haves en kleine oplossingen die je dag verrassend veel makkelijker maken.</p>
          <div className="hero-actions">
            <a className="primary" href="#shop">SHOP DE FINDS <span>→</span></a>
            <a className="text-link" href="#categories">Wat is trending?</a>
          </div>
          <div className="trust-row"><span>✓ 30 dagen bedenktijd</span><span>✓ Veilig betalen</span><span>✓ Track & trace</span></div>
        </div>
        <div className="hero-art" aria-label="Uitgelichte productvondsten">
          <div className="blob blob-one" />
          <div className="blob blob-two" />
          <article className="floating-card card-a"><small>01 / ORGANIZE</small><strong>↻</strong><p>SPIN & STORE</p></article>
          <article className="floating-card card-b"><small>02 / SELFCARE</small><strong>〰</strong><p>CLOUD CURL</p></article>
          <div className="stamp">100%<br /><b>I NEED<br />THIS</b></div>
        </div>
      </section>

      <section className="category-strip shell" id="categories">
        <button onClick={() => { setFilter("Wonen"); document.getElementById("shop")?.scrollIntoView({behavior:"smooth"}); }}><span>01</span><b>SLIM WONEN</b><i>Ruimte, rust, gemak →</i></button>
        <button onClick={() => { setFilter("Beauty"); document.getElementById("shop")?.scrollIntoView({behavior:"smooth"}); }}><span>02</span><b>BEAUTY & SELFCARE</b><i>Low effort, high impact →</i></button>
        <button onClick={() => { setFilter("Viral"); document.getElementById("shop")?.scrollIntoView({behavior:"smooth"}); }}><span>03</span><b>VIRAL RIGHT NOW</b><i>Het internet is obsessed →</i></button>
      </section>

      <section className="shop shell" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">GETEST OP HEBBERIGHEID</p><h2>Trending finds</h2></div>
          <div className="filters" role="group" aria-label="Filter producten">
            {["Alles", "Wonen", "Beauty", "Viral"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className={`product-visual ${product.color}`}><span className="pill">{product.label}</span><strong>{product.icon}</strong><button className="heart" aria-label={`Bewaar ${product.name}`}>♡</button></div>
              <div className="product-info">
                <div className="rating">★★★★★ <span>{product.rating}</span></div>
                <h3>{product.name}</h3><p>{product.description}</p>
                <div className="buy-row"><div><b>{money(product.price)}</b><s>{money(product.oldPrice)}</s></div><button onClick={() => addToCart(product)} aria-label={`Voeg ${product.name} toe aan winkelmand`}>+</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="why" id="why">
        <div className="shell why-grid">
          <div><p className="eyebrow">GEEN EINDLOOS SCROLLEN</p><h2>Wij vinden het.<br />Jij wilt het.</h2></div>
          <div className="why-points">
            <article><span>01</span><div><h3>Probleem opgelost</h3><p>Elk product verdient zijn plek doordat het iets slimmer, sneller of fijner maakt.</p></div></article>
            <article><span>02</span><div><h3>Alleen de good stuff</h3><p>Geen digitale rommelmarkt. Een scherpe selectie van finds met I-need-this-factor.</p></div></article>
            <article><span>03</span><div><h3>Trending, niet tijdelijk</h3><p>We spotten vroeg en selecteren op nut, wow-factor en echte dagelijkse waarde.</p></div></article>
          </div>
        </div>
      </section>

      <section className="newsletter shell"><div><p>DE DROP KOMT EERST IN JE INBOX</p><h2>Need it before everyone else?</h2></div><form onSubmit={(event) => {event.preventDefault(); setToast("Je staat op de INEEDDIT-list");}}><label className="sr-only" htmlFor="email">E-mailadres</label><input id="email" type="email" required placeholder="jouw@email.nl"/><button type="submit">I'M IN →</button></form></section>

      <footer><div className="shell footer-grid"><a className="logo light" href="#top">I<span>NEED</span>DIT<i>.</i></a><div><b>SHOP</b><a href="#shop">Alle finds</a><a href="#categories">Categorieën</a><a href="#shop">Trending</a></div><div><b>HELP</b><a href="#why">Verzending</a><a href="#why">Retourneren</a><a href="mailto:hello@ineeddit.nl">Contact</a></div><p>© 2026 INEEDDIT<br />Smart finds. Big need-energy.</p></div></footer>

      {toast && <div className="toast" role="status">✓ {toast}</div>}
      {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()} aria-label="Winkelmand"><div className="cart-head"><h2>Jouw mandje <span>({cart.length})</span></h2><button onClick={() => setCartOpen(false)} aria-label="Sluit winkelmand">×</button></div>{cartProducts.length === 0 ? <div className="empty"><b>Nog niks nodig?</b><p>Dat gaat zo veranderen.</p><button onClick={() => setCartOpen(false)}>SHOP DE FINDS</button></div> : <><div className="cart-items">{cartProducts.map((product, index) => <div className="cart-item" key={`${product.id}-${index}`}><div className={`mini-visual ${product.color}`}>{product.icon}</div><div><b>{product.name}</b><span>{money(product.price)}</span></div><button onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Verwijder ${product.name}`}>×</button></div>)}</div><div className="cart-total"><span>Totaal</span><b>{money(total)}</b></div><button className="checkout" onClick={() => setToast("Checkout wordt gekoppeld bij livegang")}>NAAR AFREKENEN →</button><small>Inclusief btw · verzending berekend bij checkout</small></>}</aside></div>}
    </main>
  );
}
