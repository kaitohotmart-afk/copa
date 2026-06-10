'use client'
import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

const PROVINCES = [
  'Cabo Delgado', 'Gaza', 'Inhambane', 'Manica', 'Maputo Cidade',
  'Maputo Província', 'Nampula', 'Niassa', 'Sofala', 'Tete', 'Zambézia'
]

const FEATURES = [
  { icon: '🏆', value: '5.000 MT', label: 'Premiação Total' },
  { icon: '🆓', value: 'Gratuito', label: 'Inscrição' },
  { icon: '⏰', value: '24 Horas', label: 'Duração do Evento' },
  { icon: '🇲🇿', value: 'Nacional', label: 'Campeonato' },
]

const RULES = [
  { icon: '🇲🇿', text: 'Campeonato exclusivo para equipas de Moçambique.' },
  { icon: '🆓', text: 'Inscrição totalmente gratuita.' },
  { icon: '👥', text: 'Cada equipa deve possuir no mínimo 4 jogadores.' },
  { icon: '🔄', text: 'É permitido cadastrar até 2 jogadores reservas.' },
  { icon: '📱', text: 'Capitão e vice-capitão devem possuir contactos válidos.' },
  { icon: '💬', text: 'Todas as equipas devem entrar no Discord oficial após a inscrição.' },
  { icon: '⚠️', text: 'Uso de hacks, cheats ou programas ilegais resulta em desclassificação imediata.' },
  { icon: '📋', text: 'A organização poderá atualizar horários e regulamentos quando necessário.' },
]

export default function LandingPage() {
  return (
    <main className={styles.main}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <div className={styles.navLogo}>
            <span className="orbitron gradient-text">COPA ENIGMA</span>
          </div>
          <Link href="/inscricao" className="btn btn-primary btn-sm">
            INSCREVER EQUIPA
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroParticles} aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className="animate-fade-in-up">
            <span className="tag">🎮 Free Fire · Squad</span>
          </div>
          <div className={`${styles.heroImageWrapper} animate-fade-in-up animate-delay-1`}>
            <Image
              src="/banner.png"
              alt="Copa Enigma & Batata Doce Banner"
              width={900}
              height={450}
              className={styles.heroBanner}
              priority
            />
            <div className={styles.heroBannerGlow} />
          </div>
          <h1 className={`${styles.heroTitle} animate-fade-in-up animate-delay-2`}>
            <span className="orbitron gradient-text">COPA ENIGMA</span>
            <br />
            <span className={styles.heroTitleAnd}>&</span>
            <br />
            <span className="orbitron gradient-text">BATATA DOCE</span>
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-in-up animate-delay-3`}>
            O maior Campeonato Nacional de Free Fire de Moçambique.
            <br />
            Representa a tua província. Luta pelo prémio. Conquista a glória.
          </p>
          <div className={`${styles.heroCta} animate-fade-in-up animate-delay-4`}>
            <Link href="/inscricao" id="btn-inscrever-hero" className="btn btn-primary btn-lg">
              🔥 INSCREVER EQUIPA AGORA
            </Link>
            <a href="#sobre" className="btn btn-ghost btn-lg">SABER MAIS</a>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <div className={styles.scrollIndicator} />
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className={styles.features} id="sobre">
        <div className="container">
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={`${styles.featureCard} animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={styles.featureValue}>{f.value}</div>
                <div className={styles.featureLabel}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={`section ${styles.about}`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <div className="tag" style={{ marginBottom: '1rem' }}>🏅 Sobre o Campeonato</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1.25rem' }}>
                O Maior Torneio Nacional de{' '}
                <span className="gradient-text">Free Fire</span>{' '}
                de Moçambique
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                A Copa Enigma & Batata Doce reúne as melhores equipas de todas as províncias
                de Moçambique para uma competição épica de 24 horas no modo Squad do Free Fire.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                Competição organizada, Fair Play garantido e um prémio de{' '}
                <strong style={{ color: 'var(--color-gold)' }}>5.000 MT</strong> para
                os campeões nacionais.
              </p>
              <div className={styles.aboutStats}>
                <div className={styles.aboutStat}>
                  <span className="orbitron gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>11</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Províncias</span>
                </div>
                <div className={styles.aboutStat}>
                  <span className="orbitron gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>4–6</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Jogadores/Equipa</span>
                </div>
                <div className={styles.aboutStat}>
                  <span className="orbitron gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>5K</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>MT em Prémios</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutCards}>
              <div className={`card ${styles.aboutInfoCard}`}>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>🎮</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Modalidade</div>
                    <div style={{ fontWeight: 600 }}>Free Fire – Modo Squad</div>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>🏆</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Premiação</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-gold)' }}>5.000 MT</div>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>⏰</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Duração</div>
                    <div style={{ fontWeight: 600 }}>24 Horas</div>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>🆓</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Inscrição</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-success)' }}>Totalmente Gratuita</div>
                  </div>
                </div>
              </div>
              <div className={`card ${styles.aboutProvCard}`}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Províncias Participantes
                </h4>
                <div className={styles.provincesGrid}>
                  {PROVINCES.map(p => (
                    <span key={p} className={styles.provinceTag}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className={`section ${styles.rules}`} id="regras">
        <div className="container">
          <div className="section-header">
            <div className="tag" style={{ marginBottom: '1rem' }}>📋 Regulamento</div>
            <h2>Regras do <span className="gradient-text">Campeonato</span></h2>
            <p>Lê com atenção antes de te inscrever. O Fair Play é obrigatório.</p>
          </div>
          <div className={styles.rulesGrid}>
            {RULES.map((rule, i) => (
              <div key={i} className={`${styles.ruleCard} card`}>
                <span className={styles.ruleIcon}>{rule.icon}</span>
                <p>{rule.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={`container ${styles.ctaContent}`}>
          <h2 className="orbitron" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
            PRONTO PARA <span className="gradient-text">COMPETIR?</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Inscreve a tua equipa gratuitamente e representa a tua província no palco nacional.
          </p>
          <Link href="/inscricao" id="btn-inscrever-cta" className="btn btn-gold btn-lg">
            🔥 INSCREVER EQUIPA — É GRÁTIS!
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div>
              <div className="orbitron gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                COPA ENIGMA & BATATA DOCE
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Campeonato Nacional de Free Fire – Moçambique 🇲🇿
              </p>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
              <p>© 2025 Copa Enigma & Batata Doce</p>
              <p>Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
