'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type EquipaComJogadores } from '@/lib/supabase'
import styles from './page.module.css'

export default function EquipaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [equipa, setEquipa] = useState<EquipaComJogadores | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadEquipa()
  }, [id])

  const loadEquipa = async () => {
    const { data } = await supabase
      .from('equipas')
      .select('*, jogadores(*)')
      .eq('id', id)
      .single()
    setEquipa(data)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!equipa) return
    if (!confirm(`Apagar a equipa "${equipa.nome_equipa}"? Esta ação é irreversível.`)) return
    setDeleting(true)
    await supabase.from('equipas').delete().eq('id', id)
    router.push('/admin/equipas')
  }

  const formatDate = (d: string) => new Date(d).toLocaleString('pt-PT', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--color-text-muted)' }}>
        <div className="spinner" style={{ width: 28, height: 28 }} />
        <span>A carregar...</span>
      </div>
    )
  }

  if (!equipa) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>😕</p>
        <p>Equipa não encontrada.</p>
        <Link href="/admin/equipas" className="btn btn-ghost" style={{ marginTop: '1rem' }}>← Voltar</Link>
      </div>
    )
  }

  const titulares = (equipa.jogadores || []).filter(j => j.tipo === 'titular').sort((a, b) => a.ordem - b.ordem)
  const reservas = (equipa.jogadores || []).filter(j => j.tipo === 'reserva').sort((a, b) => a.ordem - b.ordem)

  return (
    <div className={styles.page}>
      {/* BACK + ACTIONS */}
      <div className={styles.toolbar}>
        <Link href="/admin/equipas" className="btn btn-ghost btn-sm">
          ← Voltar às Equipas
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href={`/admin/equipas/${id}/editar`} className="btn btn-outline btn-sm">
            ✏️ Editar
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="btn btn-danger btn-sm">
            {deleting ? <><div className="spinner" style={{ width: 14, height: 14 }} /> A apagar...</> : '🗑️ Apagar'}
          </button>
        </div>
      </div>

      {/* TEAM HEADER */}
      <div className={styles.teamHeader}>
        <div className={styles.teamAvatar}>
          {equipa.nome_equipa.charAt(0).toUpperCase()}
        </div>
        <div className={styles.teamInfo}>
          <h1 className={styles.teamName}>{equipa.nome_equipa}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="badge badge-primary">🗺️ {equipa.provincia}</span>
            {equipa.cidade_distrito && <span className="badge badge-info">📍 {equipa.cidade_distrito}</span>}
            {equipa.nome_guilda && <span className="tag" style={{ fontSize: '0.72rem' }}>⚔️ {equipa.nome_guilda}</span>}
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              📅 {formatDate(equipa.data_inscricao)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* LEADERS */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>👑 Liderança</h2>
          <div className={styles.leaderCard}>
            <div className={styles.leaderBadge} style={{ background: 'rgba(255,215,0,0.1)', borderColor: 'rgba(255,215,0,0.3)', color: 'var(--color-gold)' }}>
              Capitão
            </div>
            <div className={styles.leaderName}>{equipa.nome_capitao}</div>
            <a
              href={`https://wa.me/${equipa.whatsapp_capitao.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappLink}
            >
              📱 {equipa.whatsapp_capitao}
            </a>
          </div>
          <div className={styles.divider} />
          <div className={styles.leaderCard}>
            <div className={styles.leaderBadge} style={{ background: 'rgba(148,163,184,0.1)', borderColor: 'rgba(148,163,184,0.3)', color: '#94a3b8' }}>
              Vice-Capitão
            </div>
            <div className={styles.leaderName}>{equipa.nome_vice_capitao}</div>
            <a
              href={`https://wa.me/${equipa.whatsapp_vice_capitao.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappLink}
            >
              📱 {equipa.whatsapp_vice_capitao}
            </a>
          </div>
        </div>

        {/* PLAYERS */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            👥 Jogadores
            <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
              {(equipa.jogadores || []).length} total
            </span>
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', fontWeight: 700 }}>
              Titulares ({titulares.length})
            </div>
            <div className={styles.playersList}>
              {titulares.map((j, i) => (
                <div key={j.id} className={styles.playerItem}>
                  <div className={styles.playerOrder}>{i + 1}</div>
                  <span style={{ fontWeight: 500 }}>{j.nome_jogador}</span>
                </div>
              ))}
            </div>
          </div>

          {reservas.length > 0 && (
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', fontWeight: 700 }}>
                Reservas ({reservas.length})
              </div>
              <div className={styles.playersList}>
                {reservas.map((j, i) => (
                  <div key={j.id} className={`${styles.playerItem} ${styles.playerReserva}`}>
                    <div className={styles.playerOrder} style={{ background: 'rgba(148,163,184,0.15)', color: '#94a3b8' }}>
                      R{i + 1}
                    </div>
                    <span style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>{j.nome_jogador}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(equipa.jogadores || []).length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Nenhum jogador registado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
