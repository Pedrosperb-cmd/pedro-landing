import { useState, useEffect, useRef } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [interest, setInterest] = useState("newsletter");
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const TALLY_SESSION_URL = import.meta.env.VITE_TALLY_SESSION_URL;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
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
      title: "Guia espiritual",
      description: "Encontros individuais para trazer clareza, direção e presença. Um espaço para olhar a vida com mais verdade, entender padrões e reorganizar o que está desalinhado.",
    },
    {
      glyph: "◈",
      title: "Limpeza espiritual",
      description: "Para momentos em que a energia está pesada, confusa ou travada. Um trabalho voltado a limpar excessos, devolver leveza e abrir espaço interno para um novo movimento.",
    },
    {
      glyph: "○",
      title: "Reiki",
      description: "Uma prática de harmonização energética para restaurar equilíbrio, acalmar o sistema e favorecer bem-estar, presença e integração.",
    },
  ];

const testimonials = [
    {
      quote: "Cheguei sem saber bem o que esperar e saí com uma clareza que não tinha há anos. O Pedro tem uma presença que acalma e ao mesmo tempo move.",
      author: "Camila R.",
    },
    {
      quote: "Fiz a limpeza espiritual num momento muito difícil. Foi como tirar um peso que eu nem sabia que estava carregando. Recomendo de olhos fechados.",
      author: "Marcos T.",
    },
    {
      quote: "O reiki com o Pedro é diferente de tudo que já experimentei. Saí renovada, com o corpo leve e a mente mais quieta. Uma experiência transformadora.",
      author: "Beatriz S.",
    },
    {
      quote: "Eu estava tentando resolver tudo pela cabeça e não chegava a lugar nenhum. A mentoria me mostrou onde eu estava me sabotando sem perceber.",
      author: "Lucas F.",
    },
    {
      quote: "Não foi sobre me sentir melhor por um dia. Foi sobre entender o que estava acontecendo de verdade e conseguir agir de forma diferente depois.",
      author: "Patrícia M.",
    },
    {
      quote: "A energia estava completamente travada. Depois da sessão algo se reorganizou por dentro — uma leveza e uma direção que eu não conseguia encontrar sozinha.",
      author: "Rafael N.",
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

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
          --text: #2e2a1e;
          --text-soft: #6b6350;
          --white: #fdfcf8;
          --px: clamp(20px, 5vw, 64px);
        }

        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

        body {
          font-family: 'Jost', sans-serif;
          background: var(--cream);
          color: var(--text);
          overflow-x: hidden;
        }

        /* ─── Noise texture ─── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 9999;
        }

        /* ─── Ambient blobs — smaller on mobile ─── */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.14;
        }
        .blob-1 { width: min(500px, 80vw); height: min(500px, 80vw); background: var(--sage); top: -80px; left: -100px; }
        .blob-2 { width: min(400px, 70vw); height: min(400px, 70vw); background: var(--gold); top: 40%; right: -100px; }
        .blob-3 { width: min(300px, 60vw); height: min(300px, 60vw); background: var(--moss); bottom: 10%; left: 15%; }

        /* ─── Layout ─── */
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 var(--px);
          position: relative;
          z-index: 1;
        }

        /* ─── Scroll reveal ─── */
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.shown { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.32s; }

        /* ─── Header ─── */
        header {
          padding: clamp(20px, 4vw, 36px) var(--px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 4vw, 22px);
          font-weight: 400;
          font-style: italic;
          color: var(--moss);
          letter-spacing: 0.03em;
        }
        .nav-cta {
          display: inline-block;
          font-size: clamp(10px, 2.5vw, 12px);
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--moss);
          text-decoration: none;
          border-bottom: 1px solid var(--sage);
          padding-bottom: 2px;
          transition: color 0.3s, border-color 0.3s;
          white-space: nowrap;
        }
        .nav-cta:hover { color: var(--fern); border-color: var(--fern); }

        /* ─── Hero ─── */
        .hero {
          min-height: 85svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(48px, 8vw, 80px) var(--px) clamp(40px, 6vw, 60px);
          position: relative;
        }
        @media (max-width: 640px) {
          .hero {
            min-height: unset;
            padding-top: 32px;
            padding-bottom: 48px;
          }
        }
        .hero-eyebrow {
          font-size: clamp(9px, 2.5vw, 11px);
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ochre);
          margin-bottom: clamp(20px, 4vw, 32px);
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 9vw, 112px);
          font-weight: 300;
          line-height: 1.0;
          color: var(--moss);
          max-width: 900px;
          margin-bottom: clamp(24px, 4vw, 40px);
        }
        .hero-title em { font-style: italic; color: var(--fern); }
        .hero-sub {
          font-size: clamp(15px, 2.5vw, 18px);
          font-weight: 300;
          line-height: 1.75;
          color: var(--text-soft);
          max-width: 520px;
          margin-bottom: clamp(36px, 6vw, 56px);
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: var(--moss);
          color: var(--cream);
          text-decoration: none;
          padding: clamp(14px, 3vw, 18px) clamp(24px, 5vw, 40px);
          font-size: clamp(11px, 2.5vw, 13px);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: background 0.3s, gap 0.3s;
          width: fit-content;
          /* Bigger tap target on mobile */
          min-height: 52px;
        }
        .hero-cta:hover { background: var(--fern); gap: 20px; }
        .hero-cta::after { content: '→'; font-size: 16px; }
        .hero-ornament {
          position: absolute;
          right: 80px;
          bottom: 80px;
          width: 180px;
          height: 180px;
          border: 1px solid var(--sage);
          border-radius: 50%;
          opacity: 0.2;
          pointer-events: none;
        }
        .hero-ornament::before {
          content: '';
          position: absolute;
          inset: 18px;
          border: 1px solid var(--gold);
          border-radius: 50%;
          opacity: 0.5;
        }
        @media (max-width: 640px) {
          .hero-ornament { display: none; }
        }

        /* ─── Divider ─── */
        .divider {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 var(--px);
          margin: 16px 0;
          opacity: 0.35;
        }
        .divider-line { flex: 1; height: 1px; background: var(--sage); }
        .divider-glyph { font-size: 13px; color: var(--ochre); }

        /* ─── About ─── */
        .about {
          padding: clamp(60px, 8vw, 100px) var(--px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: center;
        }
        @media (max-width: 768px) {
          .about { grid-template-columns: 1fr; }
        }
        .about-image-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-image-frame { display: none; }
        .about-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ochre);
          margin-bottom: 18px;
        }
        .about-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 4vw, 54px);
          font-weight: 400;
          font-style: italic;
          line-height: 1.1;
          color: var(--moss);
          margin-bottom: 24px;
        }
        .about-text {
          font-size: clamp(14px, 2vw, 16px);
          font-weight: 300;
          line-height: 1.85;
          color: var(--text-soft);
          margin-bottom: 18px;
        }
        .about-values {
          display: flex;
          gap: clamp(16px, 4vw, 32px);
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid var(--parchment);
          flex-wrap: wrap;
        }
        .about-value-word {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 3vw, 22px);
          font-style: italic;
          color: var(--fern);
          display: block;
          min-width: 80px;
        }
        .about-value-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-soft);
        }
        .about-stats {
          display: flex;
          align-items: center;
          margin-top: 28px;
          padding: 24px 0;
          border-top: 1px solid var(--parchment);
          border-bottom: 1px solid var(--parchment);
        }
        .about-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2px;
          padding: 0 8px;
        }
        .about-stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 42px);
          font-weight: 300;
          color: var(--moss);
          line-height: 1;
        }
        .about-stat-unit {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--fern);
        }
        .about-stat-label {
          font-size: 10px;
          font-weight: 300;
          color: var(--text-soft);
        }
        .about-stat-divider {
          width: 1px;
          height: 48px;
          background: var(--parchment);
          flex-shrink: 0;
        }

        /* ─── Offerings ─── */
        .offerings { padding: clamp(48px, 7vw, 80px) var(--px); }
        .section-header { margin-bottom: clamp(40px, 6vw, 64px); }
        .section-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ochre);
          margin-bottom: 14px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 4vw, 52px);
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
          padding: clamp(28px, 5vw, 52px) clamp(20px, 4vw, 40px);
          transition: background 0.4s;
        }
        .offering-item:hover { background: var(--cream); }
        .offering-glyph {
          font-size: 26px;
          color: var(--gold);
          margin-bottom: 22px;
          display: block;
          line-height: 1;
        }
        .offering-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 26px);
          font-weight: 400;
          color: var(--moss);
          margin-bottom: 14px;
        }
        .offering-text {
          font-size: clamp(13px, 2vw, 14px);
          font-weight: 300;
          line-height: 1.85;
          color: var(--text-soft);
        }

        /* ─── Testimonials ─── */
        .testimonials {
          padding: clamp(60px, 8vw, 100px) var(--px);
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
          font-size: clamp(160px, 25vw, 320px);
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
          margin-top: clamp(36px, 5vw, 56px);
        }
        @media (max-width: 768px) {
          .testimonial-grid { grid-template-columns: 1fr; }
        }
        .testimonial-item {
          background: rgba(255,255,255,0.04);
          padding: clamp(28px, 4vw, 48px) clamp(20px, 3vw, 36px);
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: background 0.4s;
        }
        .testimonial-item:hover { background: rgba(255,255,255,0.07); }
        .testimonial-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(17px, 2.5vw, 19px);
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
        .contact-section { padding: clamp(60px, 8vw, 100px) var(--px) clamp(40px, 5vw, 60px); }
        .contact-wrap {
          max-width: 760px;
          margin: 0 auto;
          background: var(--white);
          padding: clamp(28px, 6vw, 64px) clamp(20px, 5vw, 64px);
          border: 1px solid var(--parchment);
        }
        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 6vw, 60px);
          font-weight: 300;
          color: var(--moss);
          line-height: 1.1;
          margin-bottom: 14px;
        }
        .contact-sub {
          font-size: clamp(14px, 2vw, 16px);
          font-weight: 300;
          color: var(--text-soft);
          margin-bottom: clamp(32px, 5vw, 56px);
          line-height: 1.7;
        }
        .form { display: flex; flex-direction: column; gap: 0; }
        .field {
          position: relative;
          border-bottom: 2px solid var(--parchment);
          padding: 24px 0 8px;
          transition: border-color 0.3s;
        }
        .field:focus-within { border-color: var(--moss); }
        .field label {
          position: absolute;
          top: 8px;
          left: 0;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--moss);
        }
        .field input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: var(--text);
          padding: 12px 0 4px;
          /* prevent iOS zoom on focus */
          font-size: max(16px, 1em);
        }
        .field input::placeholder { color: #b0a890; }

        .interest-group { padding: clamp(28px, 5vw, 40px) 0 16px; }
        .interest-label-header {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--moss);
          margin-bottom: 16px;
          display: block;
        }
        .interest-options {
          display: flex;
          flex-direction: column;
          border: 2px solid var(--parchment);
        }
        .interest-option {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: clamp(14px, 3vw, 18px) clamp(14px, 3vw, 24px);
          cursor: pointer;
          border-bottom: 1px solid var(--parchment);
          transition: background 0.25s;
          user-select: none;
          /* Good tap target */
          min-height: 52px;
        }
        .interest-option:last-child { border-bottom: none; }
        .interest-option:hover { background: var(--cream); }
        .interest-option input[type="radio"] { display: none; }
        .radio-dot {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border: 2px solid var(--sage);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.25s;
        }
        .radio-dot::after {
          content: '';
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--moss);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .interest-option.selected .radio-dot { border-color: var(--moss); }
        .interest-option.selected .radio-dot::after { opacity: 1; }
        .interest-option.selected { background: var(--cream); }
        .interest-option-text {
          font-size: clamp(14px, 2.5vw, 15px);
          font-weight: 400;
          color: var(--text);
          flex: 1;
        }
        .interest-option-hint {
          font-size: 11px;
          color: var(--text-soft);
          font-style: italic;
          white-space: nowrap;
        }
        @media (max-width: 480px) {
          .interest-option-hint { display: none; }
        }

        .submit-btn {
          margin-top: clamp(32px, 5vw, 48px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          background: var(--moss);
          color: var(--white);
          border: none;
          padding: clamp(16px, 3vw, 22px) 24px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s, gap 0.3s;
          width: 100%;
          min-height: 56px;
          touch-action: manipulation;
        }
        .submit-btn:hover:not(:disabled) { background: var(--fern); gap: 20px; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .submit-btn::after { content: '→'; font-size: 16px; }

        .status-msg {
          margin-top: 20px;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 400;
          text-align: center;
          border-left: 3px solid;
        }
        .status-msg.success { background: rgba(90,122,42,0.08); border-color: var(--fern); color: var(--fern); }
        .status-msg.error { background: rgba(180,60,40,0.08); border-color: #b43c28; color: #8a2e1c; }

        /* ─── Footer ─── */
        footer {
          padding: clamp(36px, 5vw, 60px) var(--px);
          border-top: 1px solid var(--parchment);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
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
        .footer-glyphs { display: flex; gap: 18px; color: var(--sage); font-size: 16px; }
        @media (max-width: 480px) {
          footer { flex-direction: column; align-items: center; text-align: center; }
        }

        /* ─── Mobile fine-tuning ─── */
        @media (max-width: 640px) {
          header {
            padding-left: var(--px);
            padding-right: var(--px);
          }
          .about-values {
            gap: 24px;
          }
          .about-value-word {
            min-width: 70px;
          }
          .contact-wrap {
            /* remove side border on very small screens for cleaner look */
            border-left: none;
            border-right: none;
          }
        }
      `}</style>

      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <header>
        <span className="logo">Pedro Monteiro</span>
        <a href="#contato" className="nav-cta">Primeiro contato</a>
      </header>

      <section className="hero container">
        <p id="hero-eye" ref={setRef("hero-eye")} className={`hero-eyebrow reveal${visible["hero-eye"] ? " shown" : ""}`}>
          Guia espiritual · Limpeza espiritual · Reiki
        </p>
        <h2 id="hero-title" ref={setRef("hero-title")} className={`hero-title reveal reveal-delay-1${visible["hero-title"] ? " shown" : ""}`}>
          Quando a energia pesa,<br />
          <em>a vida inteira sente.</em>
        </h2>
        <p id="hero-sub" ref={setRef("hero-sub")} className={`hero-sub reveal reveal-delay-2${visible["hero-sub"] ? " shown" : ""}`}>
          Este é um espaço para quem busca clareza, limpeza e presença. Um trabalho espiritual para reorganizar o que está confuso, aliviar o que está pesado e devolver direção ao que perdeu força.
        </p>
        <div id="hero-cta" ref={setRef("hero-cta")} className={`reveal reveal-delay-3${visible["hero-cta"] ? " shown" : ""}`}>
          <a href="#contato" className="hero-cta">Dar o primeiro passo</a>
        </div>
        <div className="hero-ornament" />
      </section>

      <div className="divider"><div className="divider-line" /><span className="divider-glyph">✦</span><div className="divider-line" /></div>

      <section className="about container">
        <div id="about-img" ref={setRef("about-img")} className={`about-image-wrap reveal${visible["about-img"] ? " shown" : ""}`}>
<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" style={{width:"100%", maxWidth:"340px", display:"block", margin:"0 auto"}}>
  <style>{`
    @keyframes breathe {
      0%, 100% { transform: translateY(0px) scaleX(1); }
      50% { transform: translateY(-6px) scaleX(0.98); }
    }
    @keyframes float1 {
      0%, 100% { transform: translate(0px, 0px); opacity: 0.4; }
      33% { transform: translate(-6px, -8px); opacity: 0.7; }
      66% { transform: translate(4px, -5px); opacity: 0.3; }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0px, 0px); opacity: 0.3; }
      33% { transform: translate(5px, -10px); opacity: 0.6; }
      66% { transform: translate(-3px, -6px); opacity: 0.2; }
    }
    @keyframes float3 {
      0%, 100% { transform: translate(0px, 0px); opacity: 0.4; }
      50% { transform: translate(6px, -7px); opacity: 0.7; }
    }
    @keyframes float4 {
      0%, 100% { transform: translate(0px, 0px); opacity: 0.3; }
      50% { transform: translate(-5px, -9px); opacity: 0.6; }
    }
    @keyframes sway-left {
      0%, 100% { transform-origin: 100px 390px; transform: rotate(0deg); }
      30% { transform-origin: 100px 390px; transform: rotate(-8deg); }
      60% { transform-origin: 100px 390px; transform: rotate(5deg); }
    }
    @keyframes sway-right {
      0%, 100% { transform-origin: 300px 390px; transform: rotate(0deg); }
      30% { transform-origin: 300px 390px; transform: rotate(8deg); }
      60% { transform-origin: 300px 390px; transform: rotate(-5deg); }
    }
    @keyframes aura-pulse {
      0%, 100% { opacity: 0.7; transform: translateY(0px); }
      50% { opacity: 1; transform: translateY(-4px); }
    }
    @keyframes aura-pulse2 {
      0%, 100% { opacity: 0.5; transform: translateY(0px); }
      50% { opacity: 0.8; transform: translateY(-6px); }
    }
    @keyframes aura-pulse3 {
      0%, 100% { opacity: 0.3; transform: translateY(0px); }
      50% { opacity: 0.6; transform: translateY(-8px); }
    }
    .figure { animation: breathe 5s ease-in-out infinite; transform-origin: 200px 480px; }
    .p1 { animation: float1 4s ease-in-out infinite; }
    .p2 { animation: float2 5s ease-in-out infinite 0.5s; }
    .p3 { animation: float3 4.5s ease-in-out infinite 1s; }
    .p4 { animation: float4 3.8s ease-in-out infinite 0.3s; }
    .plant-left { animation: sway-left 4s ease-in-out infinite; }
    .plant-right { animation: sway-right 4s ease-in-out infinite 0.8s; }
    .aura1 { animation: aura-pulse 3s ease-in-out infinite; }
    .aura2 { animation: aura-pulse2 3s ease-in-out infinite 0.5s; }
    .aura3 { animation: aura-pulse3 3s ease-in-out infinite 1s; }
  `}</style>
  <circle cx="200" cy="200" r="140" fill="none" stroke="#8aab5c" strokeWidth="1" opacity="0.3"/>
  <circle cx="200" cy="200" r="110" fill="none" stroke="#c4a84a" strokeWidth="0.5" opacity="0.25"/>
  <g className="plant-left">
    <path d="M100 390 Q90 370 80 355" fill="none" stroke="#8aab5c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M100 390 Q85 375 88 358" fill="none" stroke="#8aab5c" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="80" cy="353" rx="10" ry="6" fill="#5a7a2a" opacity="0.5" transform="rotate(-20 80 353)"/>
    <ellipse cx="87" cy="356" rx="9" ry="5" fill="#8aab5c" opacity="0.4" transform="rotate(10 87 356)"/>
  </g>
  <g className="plant-right">
    <path d="M300 390 Q310 370 320 355" fill="none" stroke="#8aab5c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M300 390 Q315 375 312 358" fill="none" stroke="#8aab5c" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="320" cy="353" rx="10" ry="6" fill="#5a7a2a" opacity="0.5" transform="rotate(20 320 353)"/>
    <ellipse cx="313" cy="356" rx="9" ry="5" fill="#8aab5c" opacity="0.4" transform="rotate(-10 313 356)"/>
  </g>
  <g className="p1"><circle cx="130" cy="210" r="3.5" fill="#8aab5c"/></g>
  <g className="p2"><circle cx="118" cy="195" r="2.5" fill="#8aab5c"/></g>
  <g className="p3"><circle cx="270" cy="210" r="3.5" fill="#8aab5c"/></g>
  <g className="p4"><circle cx="282" cy="195" r="2.5" fill="#8aab5c"/></g>
  <g className="figure">
    <ellipse cx="200" cy="390" rx="110" ry="14" fill="#c8e09a" opacity="0.5"/>
    <ellipse cx="200" cy="390" rx="85" ry="9" fill="#8aab5c" opacity="0.25"/>
    <path d="M145 360 Q160 380 200 382 Q240 380 255 360" fill="none" stroke="#3d5a1e" strokeWidth="3" strokeLinecap="round"/>
    <path d="M148 362 Q155 375 178 378" fill="none" stroke="#3d5a1e" strokeWidth="8" strokeLinecap="round"/>
    <path d="M252 362 Q245 375 222 378" fill="none" stroke="#3d5a1e" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="175" cy="379" rx="14" ry="7" fill="#5a7a2a" opacity="0.7"/>
    <ellipse cx="225" cy="379" rx="14" ry="7" fill="#5a7a2a" opacity="0.7"/>
    <path d="M175 270 Q165 310 162 345 Q180 360 200 361 Q220 360 238 345 Q235 310 225 270 Z" fill="#3d5a1e"/>
    <path d="M175 270 Q155 300 148 350 Q165 365 200 366 Q235 365 252 350 Q245 300 225 270 Z" fill="#5a7a2a" opacity="0.5"/>
    <rect x="192" y="248" width="16" height="26" rx="8" fill="#a08c3c" opacity="0.8"/>
    <ellipse cx="200" cy="228" rx="34" ry="38" fill="#c4a84a" opacity="0.85"/>
    <ellipse cx="200" cy="200" rx="34" ry="18" fill="#3d5a1e" opacity="0.9"/>
    <path d="M187 228 Q192 232 197 228" fill="none" stroke="#3d5a1e" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M203 228 Q208 232 213 228" fill="none" stroke="#3d5a1e" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M192 240 Q200 246 208 240" fill="none" stroke="#3d5a1e" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M175 285 Q155 320 150 355" fill="none" stroke="#3d5a1e" strokeWidth="9" strokeLinecap="round"/>
    <ellipse cx="150" cy="358" rx="10" ry="6" fill="#5a7a2a" opacity="0.8" transform="rotate(-15 150 358)"/>
    <path d="M225 285 Q245 320 250 355" fill="none" stroke="#3d5a1e" strokeWidth="9" strokeLinecap="round"/>
    <ellipse cx="250" cy="358" rx="10" ry="6" fill="#5a7a2a" opacity="0.8" transform="rotate(15 250 358)"/>
    <g className="aura1"><circle cx="200" cy="152" r="4" fill="#c4a84a"/></g>
    <g className="aura2"><circle cx="200" cy="138" r="2.5" fill="#c4a84a"/></g>
    <g className="aura3"><circle cx="200" cy="128" r="1.5" fill="#c4a84a"/></g>
<text x="200" y="472" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fill="#3d5a1e" opacity="0.85" fontStyle="italic">presença · clareza · verdade</text>  </g>
</svg>
          <div className="about-image-frame" />
        </div>
        <div id="about-text" ref={setRef("about-text")} className={`reveal reveal-delay-1${visible["about-text"] ? " shown" : ""}`}>
          <p className="about-tag">Quem é Pedro Monteiro</p>
          <h3 className="about-title">Um olhar que<br />acompanha sem julgar.</h3>
          <p className="about-text">Pedro Monteiro é guia espiritual e conduz trabalhos de limpeza energética, reiki e acompanhamento individual. Sua proposta une sensibilidade, presença e profundidade para ajudar pessoas que sentem necessidade de se reorganizar por dentro.</p>
          <p className="about-text">Cada encontro é construído a partir do que a pessoa carrega — sem fórmulas prontas, sem respostas impostas. Apenas espaço, escuta e movimento real.</p>
          <div className="about-values">
            <div><span className="about-value-word">presença</span><span className="about-value-label">como base</span></div>
            <div><span className="about-value-word">clareza</span><span className="about-value-label">como direção</span></div>
            <div><span className="about-value-word">verdade</span><span className="about-value-label">como caminho</span></div>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <span className="about-stat-number">+7</span>
              <span className="about-stat-unit">anos</span>
              <span className="about-stat-label">de atendimento</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="about-stat-number">+200</span>
              <span className="about-stat-unit">pessoas</span>
              <span className="about-stat-label">atendidas</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat">
              <span className="about-stat-number">3</span>
              <span className="about-stat-unit">práticas</span>
              <span className="about-stat-label">integradas</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"><div className="divider-line" /><span className="divider-glyph">◈</span><div className="divider-line" /></div>

      <section className="offerings">
        <div className="container">
          <div id="off-header" ref={setRef("off-header")} className={`section-header reveal${visible["off-header"] ? " shown" : ""}`}>
            <p className="section-tag">Caminhos disponíveis</p>
            <h3 className="section-title">Cuidado espiritual<br />de diferentes formas</h3>
          </div>
          <div id="off-list" ref={setRef("off-list")} className={`offering-list reveal reveal-delay-1${visible["off-list"] ? " shown" : ""}`}>
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

      <section className="testimonials">
        <div className="container">
          <div id="test-header" ref={setRef("test-header")} className={`section-header reveal${visible["test-header"] ? " shown" : ""}`}>
            <p className="section-tag">Relatos de travessia</p>
            <h3 className="section-title">O que as pessoas<br />carregam depois</h3>
          </div>
          <div id="test-grid" ref={setRef("test-grid")} className={`testimonial-grid reveal reveal-delay-1${visible["test-grid"] ? " shown" : ""}`}>
            {testimonials.map((item) => (
              <div key={item.author} className="testimonial-item">
                <p className="testimonial-quote">"{item.quote}"</p>
                <cite className="testimonial-author">— {item.author}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div className="container">
          <div className="contact-wrap">
            <div id="contact-header" ref={setRef("contact-header")} className={`reveal${visible["contact-header"] ? " shown" : ""}`}>
              <p className="section-tag" style={{ marginBottom: 14 }}>Primeiro contato</p>
              <h2 className="contact-title">Escolha como quer<br />se aproximar</h2>
              <p className="contact-sub">Deixe seus dados e selecione o caminho que faz mais sentido para você agora.</p>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input id="name" name="name" type="text" required placeholder="Seu nome completo" autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" required placeholder="seuemail@exemplo.com" autoComplete="email" inputMode="email" />
              </div>
              <div className="field">
                <label htmlFor="phone">Telefone</label>
                <input id="phone" name="phone" type="tel" required placeholder="(00) 00000-0000" autoComplete="tel" inputMode="tel" />
              </div>
              <div className="interest-group">
                <span className="interest-label-header">O que você deseja?</span>
                <div className="interest-options">
                  {[
                    { value: "newsletter", label: "Receber a newsletter", hint: "gratuito" },
                    { value: "community", label: "Entrar na comunidade", hint: "gratuito" },
                    { value: "session", label: "Aplicar para sessão", hint: "via Tally" },
                  ].map((opt) => (
                    <label key={opt.value} className={`interest-option${interest === opt.value ? " selected" : ""}`} onClick={() => setInterest(opt.value)}>
                      <input type="radio" name="interest" value={opt.value} onChange={() => setInterest(opt.value)} checked={interest === opt.value} readOnly />
                      <span className="radio-dot" />
                      <span className="interest-option-text">{opt.label}</span>
                      <span className="interest-option-hint">{opt.hint}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
              {statusMessage && <div className={`status-msg ${statusType}`}>{statusMessage}</div>}
            </form>
          </div>
        </div>
      </section>

      <footer>
        <span className="footer-logo">Pedro Monteiro</span>
        <p className="footer-copy">© 2026 Pedro Monteiro · Todos os direitos reservados</p>
        <div className="footer-glyphs"><span>✦</span><span>◈</span><span>○</span></div>
      </footer>
            <SpeedInsights />
    </div>
  );
}
