import { useState, useEffect, useRef } from "react";

export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [interest, setInterest] = useState("newsletter");
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
const TALLY_SESSION_URL = import.meta.env.VITE_TALLY_SESSION_URL;

  // Intersection observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const offerings = [
    {
      glyph: "✦",
      title: "Mentoria espiritual",
      description:
        "Encontros individuais para trazer clareza, direção e presença. Um espaço para olhar a vida com mais verdade, entender padrões e reorganizar o que está desalinhado.",
    },
    {
      glyph: "◈",
      title: "Limpeza espiritual",
      description:
        "Para momentos em que a energia está pesada, confusa ou travada. Um trabalho voltado a limpar excessos, devolver leveza e abrir espaço interno para um novo movimento.",
    },
    {
      glyph: "○",
      title: "Reiki",
      description:
        "Uma prática de harmonização energética para restaurar equilíbrio, acalmar o sistema e favorecer bem-estar, presença e integração.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Encontrei no trabalho do Pedro algo raro: profundidade sem exagero. Saí mais leve, mais presente e com uma direção muito mais clara.",
      author: "Mariana L.",
    },
    {
      quote:
        "A limpeza espiritual marcou um antes e um depois. Eu já sabia que estava pesada, mas não imaginava o quanto isso estava afetando minha vida.",
      author: "Roberto K.",
    },
    {
      quote:
        "O Reiki trouxe uma paz muito concreta para o meu corpo e para a minha mente. Não foi só uma sensação boa, foi reorganização real.",
      author: "Clarice M.",
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      interest: interest,
      message: formData.get("message"),
      source: "landing-page",
      createdAt: new Date().toISOString(),
    };

    if (interest === "session") {
      const query = new URLSearchParams({
        name: payload.name || "",
        email: payload.email || "",
        phone: payload.phone || "",
      }).toString();
      window.location.href = `${TALLY_SESSION_URL}?${query}`;
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao enviar.");

      form.reset();
      setInterest("newsletter");
      setStatusType("success");
      setStatusMessage(
        interest === "newsletter"
          ? "Seu cadastro para a newsletter foi enviado com sucesso."
          : "Seu pedido para entrar na comunidade foi enviado com sucesso."
      );
    } catch {
      setStatusType("error");
      setStatusMessage("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --moss: #3d5a1e;
          --fern: #5a7a2a;
          --sage: #8aab5c;
          --lime-mist: #c8e09a;
          --cream: #f6f2e8;
          --parchment: #ede8d8;
          --ochre: #a08c3c;
          --gold: #c4a84a;
          --earth: #4a3c1e;
          --text: #2e2a1e;
          --text-soft: #6b6350;
          --white: #fdfcf8;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Jost', sans-serif;
          background: var(--cream);
          color: var(--text);
          overflow-x: hidden;
        }

        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

        /* ─── Noise texture overlay ─── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.028;
          pointer-events: none;
          z-index: 9999;
        }

        /* ─── Ambient blobs ─── */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.18;
        }
        .blob-1 { width: 600px; height: 600px; background: var(--sage); top: -100px; left: -150px; }
        .blob-2 { width: 500px; height: 500px; background: var(--gold); top: 40%; right: -150px; }
        .blob-3 { width: 400px; height: 400px; background: var(--moss); bottom: 10%; left: 20%; }

        /* ─── Layout ─── */
        .container { max-width: 1100px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 1; }

        /* ─── Scroll reveal ─── */
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .reveal.shown { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.22s; }
        .reveal-delay-3 { transition-delay: 0.36s; }

        /* ─── Header ─── */
        header {
          padding: 36px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          font-style: italic;
          color: var(--moss);
          letter-spacing: 0.03em;
        }
        .nav-cta {
          display: inline-block;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--moss);
          text-decoration: none;
          border-bottom: 1px solid var(--sage);
          padding-bottom: 2px;
          transition: color 0.3s, border-color 0.3s;
        }
        .nav-cta:hover { color: var(--fern); border-color: var(--fern); }

        /* ─── Hero ─── */
        .hero {
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 40px 60px;
          position: relative;
        }
        .hero-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ochre);
          margin-bottom: 32px;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 8vw, 112px);
          font-weight: 300;
          line-height: 1.0;
          color: var(--moss);
          max-width: 900px;
          margin-bottom: 40px;
        }
        .hero-title em {
          font-style: italic;
          color: var(--fern);
        }
        .hero-sub {
          font-size: 18px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--text-soft);
          max-width: 520px;
          margin-bottom: 56px;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: var(--moss);
          color: var(--cream);
          text-decoration: none;
          padding: 18px 40px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 0;
          transition: background 0.3s, gap 0.3s;
          width: fit-content;
        }
        .hero-cta:hover { background: var(--fern); gap: 20px; }
        .hero-cta::after { content: '→'; font-size: 16px; }

        .hero-ornament {
          position: absolute;
          right: 80px;
          bottom: 80px;
          width: 220px;
          height: 220px;
          border: 1px solid var(--sage);
          border-radius: 50%;
          opacity: 0.25;
          pointer-events: none;
        }
        .hero-ornament::before {
          content: '';
          position: absolute;
          inset: 20px;
          border: 1px solid var(--gold);
          border-radius: 50%;
          opacity: 0.5;
        }

        /* ─── Divider ─── */
        .divider {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 0 40px;
          margin: 20px 0;
          opacity: 0.4;
        }
        .divider-line { flex: 1; height: 1px; background: var(--sage); }
        .divider-glyph { font-size: 14px; color: var(--ochre); }

        /* ─── About ─── */
        .about {
          padding: 100px 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .about { grid-template-columns: 1fr; gap: 48px; }
        }
        .about-image-wrap {
          position: relative;
        }
        .about-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          display: block;
          filter: sepia(10%) contrast(1.02);
        }
        .about-image-frame {
          position: absolute;
          inset: -16px -16px 16px 16px;
          border: 1px solid var(--sage);
          pointer-events: none;
          opacity: 0.5;
          z-index: -1;
        }
        .about-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ochre);
          margin-bottom: 20px;
        }
        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 54px);
          font-weight: 400;
          font-style: italic;
          line-height: 1.1;
          color: var(--moss);
          margin-bottom: 28px;
        }
        .about-text {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.85;
          color: var(--text-soft);
          margin-bottom: 20px;
        }
        .about-values {
          display: flex;
          gap: 32px;
          margin-top: 36px;
          padding-top: 32px;
          border-top: 1px solid var(--parchment);
        }
        .about-value-word {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-style: italic;
          color: var(--fern);
          display: block;
        }
        .about-value-label {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-soft);
        }

        /* ─── Offerings ─── */
        .offerings { padding: 80px 40px; }
        .section-header { margin-bottom: 64px; }
        .section-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ochre);
          margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 300;
          color: var(--moss);
          line-height: 1.15;
        }
        .offering-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--parchment);
          border: 1px solid var(--parchment);
        }
        @media (max-width: 768px) {
          .offering-list { grid-template-columns: 1fr; }
        }
        .offering-item {
          background: var(--white);
          padding: 52px 40px;
          transition: background 0.4s;
          cursor: default;
        }
        .offering-item:hover { background: var(--cream); }
        .offering-glyph {
          font-size: 28px;
          color: var(--gold);
          margin-bottom: 28px;
          display: block;
          line-height: 1;
        }
        .offering-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          color: var(--moss);
          margin-bottom: 16px;
        }
        .offering-text {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.85;
          color: var(--text-soft);
        }

        /* ─── Testimonials ─── */
        .testimonials {
          padding: 100px 40px;
          background: var(--moss);
          position: relative;
          overflow: hidden;
        }
        .testimonials::before {
          content: '"';
          position: absolute;
          top: -40px;
          left: 40px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 320px;
          color: rgba(255,255,255,0.04);
          line-height: 1;
          pointer-events: none;
        }
        .testimonials .section-title { color: var(--lime-mist); }
        .testimonials .section-tag { color: var(--sage); }
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.1);
          margin-top: 56px;
        }
        @media (max-width: 768px) {
          .testimonial-grid { grid-template-columns: 1fr; }
        }
        .testimonial-item {
          background: rgba(255,255,255,0.04);
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          transition: background 0.4s;
        }
        .testimonial-item:hover { background: rgba(255,255,255,0.07); }
        .testimonial-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          font-weight: 300;
          font-style: italic;
          line-height: 1.65;
          color: rgba(255,255,255,0.85);
          flex: 1;
        }
        .testimonial-author {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sage);
        }

        /* ─── Contact form ─── */
        .contact-section { padding: 100px 40px; }
        .contact-wrap {
          max-width: 760px;
          margin: 0 auto;
        }
        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5vw, 60px);
          font-weight: 300;
          color: var(--moss);
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .contact-sub {
          font-size: 16px;
          font-weight: 300;
          color: var(--text-soft);
          margin-bottom: 56px;
          line-height: 1.7;
        }
        .form { display: flex; flex-direction: column; gap: 0; }
        .field {
          position: relative;
          border-bottom: 1px solid var(--parchment);
          padding: 24px 0 8px;
          transition: border-color 0.3s;
        }
        .field:focus-within { border-color: var(--moss); }
        .field label {
          position: absolute;
          top: 8px;
          left: 0;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ochre);
        }
        .field input,
        .field textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: var(--text);
          padding: 12px 0 4px;
          resize: none;
        }
        .field input::placeholder,
        .field textarea::placeholder { color: var(--parchment); }

        .interest-group {
          padding: 40px 0 20px;
        }
        .interest-label-header {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ochre);
          margin-bottom: 20px;
          display: block;
        }
        .interest-options {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--parchment);
        }
        .interest-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 24px;
          cursor: pointer;
          border-bottom: 1px solid var(--parchment);
          transition: background 0.25s;
          user-select: none;
        }
        .interest-option:last-child { border-bottom: none; }
        .interest-option:hover { background: var(--parchment); }
        .interest-option input[type="radio"] { display: none; }
        .radio-dot {
          width: 18px;
          height: 18px;
          border: 1px solid var(--sage);
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.25s;
        }
        .radio-dot::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--moss);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .interest-option.selected .radio-dot { border-color: var(--moss); }
        .interest-option.selected .radio-dot::after { opacity: 1; }
        .interest-option.selected { background: var(--parchment); }
        .interest-option-text {
          font-size: 15px;
          font-weight: 300;
          color: var(--text);
        }
        .interest-option-hint {
          margin-left: auto;
          font-size: 11px;
          color: var(--text-soft);
          font-style: italic;
        }

        .submit-btn {
          margin-top: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          background: var(--moss);
          color: var(--cream);
          border: none;
          padding: 20px 48px;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s, gap 0.3s;
          width: 100%;
        }
        .submit-btn:hover:not(:disabled) { background: var(--fern); gap: 20px; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .submit-btn::after { content: '→'; font-size: 16px; }

        .status-msg {
          margin-top: 24px;
          padding: 16px 24px;
          font-size: 14px;
          font-weight: 300;
          text-align: center;
          border-left: 3px solid;
        }
        .status-msg.success {
          background: rgba(90,122,42,0.08);
          border-color: var(--fern);
          color: var(--fern);
        }
        .status-msg.error {
          background: rgba(180,60,40,0.08);
          border-color: #b43c28;
          color: #8a2e1c;
        }

        /* ─── Footer ─── */
        footer {
          padding: 60px 40px;
          border-top: 1px solid var(--parchment);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-style: italic;
          color: var(--moss);
        }
        .footer-copy {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--text-soft);
          text-align: center;
        }
        .footer-glyphs {
          display: flex;
          gap: 20px;
          color: var(--sage);
          font-size: 18px;
        }
      `}</style>

      {/* Ambient */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Header */}
      <header>
        <span className="logo">Pedro Monteiro</span>
        <a href="#contato" className="nav-cta">Primeiro contato</a>
      </header>

      {/* Hero */}
      <section className="hero container">
        <p
          id="hero-eye"
          ref={setRef("hero-eye")}
          className={`hero-eyebrow reveal${visible["hero-eye"] ? " shown" : ""}`}
        >
          Mentor espiritual · Limpeza espiritual · Reiki
        </p>
        <h2
          id="hero-title"
          ref={setRef("hero-title")}
          className={`hero-title reveal reveal-delay-1${visible["hero-title"] ? " shown" : ""}`}
        >
          Quando a energia pesa,<br />
          <em>a vida inteira sente.</em>
        </h2>
        <p
          id="hero-sub"
          ref={setRef("hero-sub")}
          className={`hero-sub reveal reveal-delay-2${visible["hero-sub"] ? " shown" : ""}`}
        >
          Este é um espaço para quem busca clareza, limpeza e presença. Um trabalho espiritual para reorganizar o que está confuso, aliviar o que está pesado e devolver direção ao que perdeu força.
        </p>
        <div
          id="hero-cta"
          ref={setRef("hero-cta")}
          className={`reveal reveal-delay-3${visible["hero-cta"] ? " shown" : ""}`}
        >
          <a href="#contato" className="hero-cta">Dar o primeiro passo</a>
        </div>
        <div className="hero-ornament" />
      </section>

      {/* Divider */}
      <div className="divider">
        <div className="divider-line" />
        <span className="divider-glyph">✦</span>
        <div className="divider-line" />
      </div>

      {/* About */}
      <section className="about container">
        <div
          id="about-img"
          ref={setRef("about-img")}
          className={`about-image-wrap reveal${visible["about-img"] ? " shown" : ""}`}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnCOd7COyFjkOlJdaQdvceibIIIrE-bEWoFIKbeE4SYQ2rH3OnBcPOwNrONWpRK8nth16Ij1WfF7Qqh9xDyRq9PyG_b6Egbe3Yac6qTj7TTRCtr2k9RnYTv07KtYVllsx3hGifX0i9b7FEYDcpV1S_xCLBY2RtpvlMop8ZAffK1c3QfEYR5j-xb2NPOBGt9rJeLTNGGMBcdQKWc6xoUbaQUVE4BzM9oiUXWk2QK7gGIMK29MeVPkkG5s5vxQThsEK_xIDvUKe_Z40"
            alt="Pedro Monteiro"
            className="about-image"
          />
          <div className="about-image-frame" />
        </div>
        <div
          id="about-text"
          ref={setRef("about-text")}
          className={`reveal reveal-delay-1${visible["about-text"] ? " shown" : ""}`}
        >
          <p className="about-tag">Quem é Pedro Monteiro</p>
          <h3 className="about-title">
            Um olhar que<br />acompanha sem julgar.
          </h3>
          <p className="about-text">
            Pedro Monteiro é mentor espiritual e conduz trabalhos de limpeza energética, reiki e acompanhamento individual. Sua proposta une sensibilidade, presença e profundidade para ajudar pessoas que sentem necessidade de se reorganizar por dentro.
          </p>
          <p className="about-text">
            Cada encontro é construído a partir do que a pessoa carrega — sem fórmulas prontas, sem respostas impostas. Apenas espaço, escuta e movimento real.
          </p>
          <div className="about-values">
            <div>
              <span className="about-value-word">presença</span>
              <span className="about-value-label">como base</span>
            </div>
            <div>
              <span className="about-value-word">clareza</span>
              <span className="about-value-label">como direção</span>
            </div>
            <div>
              <span className="about-value-word">verdade</span>
              <span className="about-value-label">como caminho</span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider">
        <div className="divider-line" />
        <span className="divider-glyph">◈</span>
        <div className="divider-line" />
      </div>

      {/* Offerings */}
      <section className="offerings">
        <div className="container">
          <div
            id="off-header"
            ref={setRef("off-header")}
            className={`section-header reveal${visible["off-header"] ? " shown" : ""}`}
          >
            <p className="section-tag">Caminhos disponíveis</p>
            <h3 className="section-title">Cuidado espiritual<br />de diferentes formas</h3>
          </div>
          <div
            id="off-list"
            ref={setRef("off-list")}
            className={`offering-list reveal reveal-delay-1${visible["off-list"] ? " shown" : ""}`}
          >
            {offerings.map((item) => (
              <div key={item.title} className="offering-item">
                <span className="offering-glyph">{item.glyph}</span>
                <h4 className="offering-title">{item.title}</h4>
                <p className="offering-text">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div
            id="test-header"
            ref={setRef("test-header")}
            className={`section-header reveal${visible["test-header"] ? " shown" : ""}`}
          >
            <p className="section-tag">Relatos de travessia</p>
            <h3 className="section-title">O que as pessoas<br />carregam depois</h3>
          </div>
          <div
            id="test-grid"
            ref={setRef("test-grid")}
            className={`testimonial-grid reveal reveal-delay-1${visible["test-grid"] ? " shown" : ""}`}
          >
            {testimonials.map((item) => (
              <div key={item.author} className="testimonial-item">
                <p className="testimonial-quote">"{item.quote}"</p>
                <cite className="testimonial-author">— {item.author}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contato">
        <div className="container">
          <div className="contact-wrap">
            <div
              id="contact-header"
              ref={setRef("contact-header")}
              className={`reveal${visible["contact-header"] ? " shown" : ""}`}
            >
              <p className="section-tag" style={{ marginBottom: 16 }}>Primeiro contato</p>
              <h2 className="contact-title">
                Escolha como quer<br />se aproximar
              </h2>
              <p className="contact-sub">
                Deixe seus dados e selecione o caminho que faz mais sentido para você agora.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="form"
              id="contact-form"
              ref={setRef("contact-form")}
            >
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input id="name" name="name" type="text" required placeholder="Seu nome completo" />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" required placeholder="seuemail@exemplo.com" />
              </div>
              <div className="field">
                <label htmlFor="phone">Telefone</label>
                <input id="phone" name="phone" type="tel" required placeholder="(00) 00000-0000" />
              </div>

              <div className="interest-group">
                <span className="interest-label-header">O que você deseja?</span>
                <div className="interest-options">
                  {[
                    { value: "newsletter", label: "Receber a newsletter", hint: "gratuito" },
                    { value: "community", label: "Entrar na comunidade", hint: "gratuito" },
                    { value: "session", label: "Aplicar para sessão online", hint: "redirecionado ao Tally" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`interest-option${interest === opt.value ? " selected" : ""}`}
                      onClick={() => setInterest(opt.value)}
                    >
                      <input type="radio" name="interest" value={opt.value} onChange={() => setInterest(opt.value)} checked={interest === opt.value} readOnly />
                      <span className="radio-dot" />
                      <span className="interest-option-text">{opt.label}</span>
                      <span className="interest-option-hint">{opt.hint}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field" style={{ borderBottom: "none", paddingBottom: 0 }}>
                <label htmlFor="message" style={{ position: "relative", top: "auto", display: "block", marginBottom: 8 }}>Mensagem opcional</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Se quiser, escreva brevemente o que está vivendo hoje"
                  style={{ paddingTop: 0 }}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>

              {statusMessage && (
                <div className={`status-msg ${statusType}`}>{statusMessage}</div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <span className="footer-logo">Pedro Monteiro</span>
        <p className="footer-copy">© 2026 Pedro Monteiro · Todos os direitos reservados</p>
        <div className="footer-glyphs">
          <span>✦</span>
          <span>◈</span>
          <span>○</span>
        </div>
      </footer>
    </div>
  );
}
