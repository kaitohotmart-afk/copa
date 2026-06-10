'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Equipa } from '@/lib/supabase'
import styles from './page.module.css'

interface Stats {
  totalEquipas: number
  totalJogadores: number
  totalProvincias: number
  ultimasInscricoes: Equipa[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalEquipas: 0,
    totalJogadores: 0,
    totalProvincias: 0,
    ultimasInscricoes: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const [equipasRes, jogadoresRes, ultimasRes] = await Promise.all([
      supabase.from('equipas').select('id, provincia'),
      supabase.from('jogadores').select('id', { count: 'exact' }),
      supabase.from('equipas').select('*').order('data_inscricao', { ascending: false }).limit(5),
    ])

    const equipas = equipasRes.data || []
    const provincias = new Set(equipas.map((e: { id: string; provincia: string }) => e.provincia))

    setStats({
      totalEquipas: equipas.length,
      totalJogadores: jogadoresRes.count || 0,
      totalProvincias: provincias.size,
      ultimasInscricoes: ultimasRes.data || [],
    })
    setLoading(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const statCards = [
    { icon: '🛡️', value: stats.totalEquipas, label: 'Equipas Inscritas', color: 'var(--color-primary)' },
    { icon: '👥', value: stats.totalJogadores, label: 'Total de Jogadores', color: 'var(--color-gold)' },
    { icon: '🗺️', value: stats.totalProvincias, label: 'Províncias Representadas', color: '#63b3ed' },
    { icon: '🎯', value: `${Math.min(stats.totalEquipas, 999)}`, label: 'Inscrições Recebidas', color: 'var(--color-success)' },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--color-text-muted)' }}>
        <div className="spinner" style={{ width: 28, height: 28 }} />
        <span>A carregar dados...</span>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Visão geral do campeonato em tempo real</p>
        </div>
        <button onClick={loadStats} className="btn btn-ghost btn-sm">
          🔄 Atualizar
        </button>
      </div>

      {/* STAT CARDS */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: stat.color }}>{stat.icon}</div>
            <div className="orbitron" style={{ fontSize: '2.2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* RECENT REGISTRATIONS */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Últimas Inscrições</h2>
          <Link href="/admin/equipas" className="btn btn-outline btn-sm">
            Ver Todas →
          </Link>
        </div>

        {stats.ultimasInscricoes.length === 0 ? (
          <div className={styles.empty}>
            <p>🏜️ Ainda não há equipas inscritas.</p>
            <p style={{ fontSize: '0.85rem' }}>Partilha o link de inscrição para começar!</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Equipa</th>
                  <th>Província</th>
                  <th>Capitão</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.ultimasInscricoes.map(equipa => (
                  <tr key={equipa.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{equipa.nome_equipa}</div>
                      {equipa.nome_guilda && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Guilda: {equipa.nome_guilda}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-primary">{equipa.provincia}</span>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>{equipa.nome_capitao}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(equipa.data_inscricao)}
                    </td>
                    <td>
                      <Link href={`/admin/equipas/${equipa.id}`} className="btn btn-ghost btn-sm">
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className={styles.quickActions}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Ações Rápidas</h2>
        <div className={styles.actionGrid}>
          <Link href="/admin/equipas" className={styles.actionCard}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
            <span>Gerir Equipas</span>
          </Link>
          <Link href="/" target="_blank" className={styles.actionCard}>
            <span style={{ fontSize: '1.5rem' }}>🌐</span>
            <span>Ver Landing Page</span>
          </Link>
          <Link href="/inscricao" target="_blank" className={styles.actionCard}>
            <span style={{ fontSize: '1.5rem' }}>📝</span>
            <span>Ver Formulário</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
