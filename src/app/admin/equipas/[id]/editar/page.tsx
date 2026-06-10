'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type EquipaComJogadores, type Jogador } from '@/lib/supabase'
import styles from './page.module.css'

const PROVINCES = [
  'Cabo Delgado', 'Gaza', 'Inhambane', 'Manica', 'Maputo Cidade',
  'Maputo Província', 'Nampula', 'Niassa', 'Sofala', 'Tete', 'Zambézia'
]

export default function EditarEquipaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nome_equipa: '', provincia: '', cidade_distrito: '', nome_guilda: '',
    nome_capitao: '', whatsapp_capitao: '', nome_vice_capitao: '', whatsapp_vice_capitao: '',
  })

  const [jogadoresTitulares, setJogadoresTitulares] = useState<string[]>(['', '', '', ''])
  const [jogadoresReservas, setJogadoresReservas] = useState<string[]>(['', ''])
  const [originalJogadores, setOriginalJogadores] = useState<Jogador[]>([])

  useEffect(() => { loadEquipa() }, [id])

  const loadEquipa = async () => {
    const { data } = await supabase
      .from('equipas')
      .select('*, jogadores(*)')
      .eq('id', id)
      .single() as { data: EquipaComJogadores }

    if (!data) { setLoading(false); return }

    setForm({
      nome_equipa: data.nome_equipa,
      provincia: data.provincia,
      cidade_distrito: data.cidade_distrito || '',
      nome_guilda: data.nome_guilda || '',
      nome_capitao: data.nome_capitao,
      whatsapp_capitao: data.whatsapp_capitao,
      nome_vice_capitao: data.nome_vice_capitao,
      whatsapp_vice_capitao: data.whatsapp_vice_capitao,
    })

    const jogs = data.jogadores || []
    setOriginalJogadores(jogs)

    const titulares = jogs.filter(j => j.tipo === 'titular').sort((a, b) => a.ordem - b.ordem)
    const reservas = jogs.filter(j => j.tipo === 'reserva').sort((a, b) => a.ordem - b.ordem)

    setJogadoresTitulares([
      titulares[0]?.nome_jogador || '',
      titulares[1]?.nome_jogador || '',
      titulares[2]?.nome_jogador || '',
      titulares[3]?.nome_jogador || '',
    ])
    setJogadoresReservas([
      reservas[0]?.nome_jogador || '',
      reservas[1]?.nome_jogador || '',
    ])

    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.nome_equipa.trim() || !form.nome_capitao.trim() || !form.whatsapp_capitao.trim() ||
      !form.nome_vice_capitao.trim() || !form.whatsapp_vice_capitao.trim()) {
      setError('Preenche todos os campos obrigatórios.')
      return
    }
    if (jogadoresTitulares.filter(j => j.trim()).length < 4) {
      setError('São necessários pelo menos 4 jogadores titulares.')
      return
    }

    setSaving(true)
    try {
      await supabase.from('equipas').update({
        nome_equipa: form.nome_equipa.trim(),
        provincia: form.provincia,
        cidade_distrito: form.cidade_distrito.trim() || null,
        nome_guilda: form.nome_guilda.trim() || null,
        nome_capitao: form.nome_capitao.trim(),
        whatsapp_capitao: form.whatsapp_capitao.trim(),
        nome_vice_capitao: form.nome_vice_capitao.trim(),
        whatsapp_vice_capitao: form.whatsapp_vice_capitao.trim(),
      }).eq('id', id)

      // Delete old players and re-insert
      await supabase.from('jogadores').delete().eq('equipa_id', id)

      const newJogadores = [
        ...jogadoresTitulares.filter(n => n.trim()).map((n, i) => ({ equipa_id: id, nome_jogador: n.trim(), tipo: 'titular' as const, ordem: i + 1 })),
        ...jogadoresReservas.filter(n => n.trim()).map((n, i) => ({ equipa_id: id, nome_jogador: n.trim(), tipo: 'reserva' as const, ordem: i + 5 })),
      ]

      await supabase.from('jogadores').insert(newJogadores)
      setSuccess(true)
      setTimeout(() => router.push(`/admin/equipas/${id}`), 1500)
    } catch {
      setError('Erro ao guardar. Tenta novamente.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--color-text-muted)' }}>
        <div className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Link href={`/admin/equipas/${id}`} className="btn btn-ghost btn-sm">← Voltar</Link>
        <h1 className={styles.title}>Editar Equipa</h1>
      </div>

      {success && <div className="alert alert-success">✅ Guardado com sucesso! A redirecionar...</div>}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <form onSubmit={handleSave} className={styles.form}>
        {/* EQUIPA */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Dados da Equipa</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nome da Equipa <span className="required">*</span></label>
              <input className="form-input" value={form.nome_equipa} onChange={e => setForm(f => ({ ...f, nome_equipa: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Província <span className="required">*</span></label>
              <select className="form-select" value={form.provincia} onChange={e => setForm(f => ({ ...f, provincia: e.target.value }))}>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Cidade/Distrito</label>
              <input className="form-input" value={form.cidade_distrito} onChange={e => setForm(f => ({ ...f, cidade_distrito: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Guilda</label>
              <input className="form-input" value={form.nome_guilda} onChange={e => setForm(f => ({ ...f, nome_guilda: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* LEADERS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Capitão & Vice-Capitão</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nome do Capitão <span className="required">*</span></label>
              <input className="form-input" value={form.nome_capitao} onChange={e => setForm(f => ({ ...f, nome_capitao: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Capitão <span className="required">*</span></label>
              <input className="form-input" value={form.whatsapp_capitao} onChange={e => setForm(f => ({ ...f, whatsapp_capitao: e.target.value }))} />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nome do Vice-Capitão <span className="required">*</span></label>
              <input className="form-input" value={form.nome_vice_capitao} onChange={e => setForm(f => ({ ...f, nome_vice_capitao: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Vice-Capitão <span className="required">*</span></label>
              <input className="form-input" value={form.whatsapp_vice_capitao} onChange={e => setForm(f => ({ ...f, whatsapp_vice_capitao: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* PLAYERS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Jogadores Titulares <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>(mín. 4)</span></h2>
          <div className="form-grid">
            {jogadoresTitulares.map((nome, i) => (
              <div key={i} className="form-group">
                <label className="form-label">Jogador {i + 1} {i < 4 && <span className="required">*</span>}</label>
                <input
                  className="form-input"
                  value={nome}
                  onChange={e => setJogadoresTitulares(prev => prev.map((n, idx) => idx === i ? e.target.value : n))}
                  placeholder="Nick no Free Fire"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Reservas <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>(opcional)</span></h2>
          <div className="form-grid">
            {jogadoresReservas.map((nome, i) => (
              <div key={i} className="form-group">
                <label className="form-label">Reserva {i + 1}</label>
                <input
                  className="form-input"
                  value={nome}
                  onChange={e => setJogadoresReservas(prev => prev.map((n, idx) => idx === i ? e.target.value : n))}
                  placeholder="Nick no Free Fire (opcional)"
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link href={`/admin/equipas/${id}`} className="btn btn-ghost">Cancelar</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <><div className="spinner" /> A guardar...</> : '💾 Guardar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
