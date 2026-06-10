'use client'
import Link from 'next/link'
import styles from './page.module.css'

const DISCORD_LINK = process.env.NEXT_PUBLIC_DISCORD_LINK || 'https://discord.gg/copaenigma'

export default function SucessoPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <div className={styles.successRing} />
            <div className={styles.successIcon}>🏆</div>
          </div>

          <div className="tag" style={{ justifyContent: 'center' }}>
            ✅ Inscrição Confirmada
          </div>

          <h1 className={styles.title}>
            <span className="gradient-text">Parabéns!</span>
          </h1>

          <p className={styles.message}>
            A vossa equipa foi inscrita com sucesso na{' '}
            <strong>Copa Enigma & Batata Doce</strong>.
          </p>

          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              Agora entrem no Discord oficial para receber anúncios, horários, salas, regras e todas as atualizações do campeonato.
            </p>
          </div>

          <div className={styles.actions}>
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-discord"
              className="btn btn-gold btn-lg"
              style={{ width: '100%' }}
            >
              💬 ENTRAR NO DISCORD OFICIAL
            </a>
            <Link href="/" className="btn btn-ghost" style={{ width: '100%' }}>
              ← Voltar ao Início
            </Link>
          </div>

          <div className={styles.tips}>
            <h3>Próximos passos:</h3>
            <ul>
              <li>📱 Entra no Discord e apresenta a tua equipa</li>
              <li>📋 Aguarda os horários e sala da competição</li>
              <li>⚔️ Prepara a tua equipa para a batalha</li>
              <li>🏆 Conquista a glória nacional!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
