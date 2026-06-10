'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const PROVINCES = [
  'Cabo Delgado', 'Gaza', 'Inhambane', 'Manica', 'Maputo Cidade',
  'Maputo Província', 'Nampula', 'Niassa', 'Sofala', 'Tete', 'Zambézia'
]

interface FormData {
  nome_equipa: string
  provincia: string
  cidade_distrito: string
  nome_guilda: string
  nome_capitao: string
  whatsapp_capitao: string
  nome_vice_capitao: string
  whatsapp_vice_capitao: string
  jogador1: string
  jogador2: string
  jogador3: string
  jogador4: string
  reserva1: string
  reserva2: string
}

interface FormErrors {
  [key: string]: string
}

const initialForm: FormData = {
  nome_equipa: '',
  provincia: '',
  cidade_distrito: '',
  nome_guilda: '',
  nome_capitao: '',
  whatsapp_capitao: '',
  nome_vice_capitao: '',
  whatsapp_vice_capitao: '',
  jogador1: '',
  jogador2: '',
  jogador3: '',
  jogador4: '',
  reserva1: '',
  reserva2: '',
}

export default function InscricaoPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.nome_equipa.trim()) newErrors.nome_equipa = 'Nome da equipa é obrigatório.'
    if (!form.provincia) newErrors.provincia = 'Seleciona a província.'
    if (!form.nome_capitao.trim()) newErrors.nome_capitao = 'Nome do capitão é obrigatório.'
    if (!form.whatsapp_capitao.trim()) newErrors.whatsapp_capitao = 'WhatsApp do capitão é obrigatório.'
    if (!form.nome_vice_capitao.trim()) newErrors.nome_vice_capitao = 'Nome do vice-capitão é obrigatório.'
    if (!form.whatsapp_vice_capitao.trim()) newErrors.whatsapp_vice_capitao = 'WhatsApp do vice-capitão é obrigatório.'
    if (!form.jogador1.trim()) newErrors.jogador1 = 'Nome do Jogador 1 é obrigatório.'
    if (!form.jogador2.trim()) newErrors.jogador2 = 'Nome do Jogador 2 é obrigatório.'
    if (!form.jogador3.trim()) newErrors.jogador3 = 'Nome do Jogador 3 é obrigatório.'
    if (!form.jogador4.trim()) newErrors.jogador4 = 'Nome do Jogador 4 é obrigatório.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)
    try {
      // Insert equipa
      const { data: equipa, error: equipaError } = await supabase
        .from('equipas')
        .insert({
          nome_equipa: form.nome_equipa.trim(),
          provincia: form.provincia,
          cidade_distrito: form.cidade_distrito.trim() || null,
          nome_guilda: form.nome_guilda.trim() || null,
          nome_capitao: form.nome_capitao.trim(),
          whatsapp_capitao: form.whatsapp_capitao.trim(),
          nome_vice_capitao: form.nome_vice_capitao.trim(),
          whatsapp_vice_capitao: form.whatsapp_vice_capitao.trim(),
        })
        .select('id')
        .single()

      if (equipaError) throw equipaError

      // Build jogadores list
      const jogadores = [
        { nome_jogador: form.jogador1.trim(), tipo: 'titular', ordem: 1 },
        { nome_jogador: form.jogador2.trim(), tipo: 'titular', ordem: 2 },
        { nome_jogador: form.jogador3.trim(), tipo: 'titular', ordem: 3 },
        { nome_jogador: form.jogador4.trim(), tipo: 'titular', ordem: 4 },
        ...(form.reserva1.trim() ? [{ nome_jogador: form.reserva1.trim(), tipo: 'reserva', ordem: 5 }] : []),
        ...(form.reserva2.trim() ? [{ nome_jogador: form.reserva2.trim(), tipo: 'reserva', ordem: 6 }] : []),
      ].map(j => ({ ...j, equipa_id: equipa.id }))

      const { error: jogadoresError } = await supabase
        .from('jogadores')
        .insert(jogadores)

      if (jogadoresError) throw jogadoresError

      router.push('/sucesso')
    } catch (err: unknown) {
      console.error(err)
      setGlobalError('Ocorreu um erro ao enviar a inscrição. Por favor, tenta novamente.')
      setLoading(false)
    }
  }

  const Field = ({
    field, label, placeholder, required = false, type = 'text'
  }: {
    field: keyof FormData; label: string; placeholder?: string; required?: boolean; type?: string
  }) => (
    <div className="form-group">
      <label className="form-label" htmlFor={field}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={field}
        type={type}
        className={`form-input${errors[field] ? ' error' : ''}`}
        value={form[field]}
        onChange={e => updateField(field, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {errors[field] && <span className="form-error">⚠ {errors[field]}</span>}
    </div>
  )

  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link href="/" className={styles.navBack}>
            ← Voltar ao Início
          </Link>
          <span className="orbitron gradient-text" style={{ fontWeight: 800, fontSize: '0.95rem' }}>
            INSCRIÇÃO DE EQUIPA
          </span>
        </div>
      </nav>

      <div className={`container ${styles.container}`}>
        {/* HEADER */}
        <div className={styles.pageHeader}>
          <div className="tag">🎮 Free Fire · Squad</div>
          <h1 className={styles.pageTitle}>
            Inscrever <span className="gradient-text">Equipa</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Preenche o formulário abaixo para inscrever a tua equipa na{' '}
            <strong style={{ color: 'var(--color-primary)' }}>Copa Enigma & Batata Doce</strong>.
            A inscrição é totalmente gratuita!
          </p>
        </div>

        {globalError && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>❌</span>
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* ====================== DADOS DA EQUIPA ====================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionNumber}>1</div>
              <div>
                <h2>Dados da Equipa</h2>
                <p>Informações gerais sobre a vossa equipa</p>
              </div>
            </div>
            <div className={styles.sectionBody}>
              <div className="form-grid">
                <Field field="nome_equipa" label="Nome da Equipa" placeholder="Ex: Lobos de Maputo" required />
                <div className="form-group">
                  <label className="form-label" htmlFor="provincia">
                    Província <span className="required">*</span>
                  </label>
                  <select
                    id="provincia"
                    className={`form-select${errors.provincia ? ' error' : ''}`}
                    value={form.provincia}
                    onChange={e => updateField('provincia', e.target.value)}
                  >
                    <option value="">Seleciona a província</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.provincia && <span className="form-error">⚠ {errors.provincia}</span>}
                </div>
              </div>
              <div className="form-grid">
                <Field field="cidade_distrito" label="Cidade ou Distrito" placeholder="Ex: Matola (opcional)" />
                <Field field="nome_guilda" label="Nome da Guilda" placeholder="Ex: Fire Storm (opcional)" />
              </div>
            </div>
          </div>

          {/* ====================== CAPITÃO ====================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionNumber}>2</div>
              <div>
                <h2>Capitão & Vice-Capitão</h2>
                <p>Responsáveis pela equipa no campeonato</p>
              </div>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.captainGrid}>
                <div className={styles.captainCard}>
                  <div className={styles.captainBadge}>👑 Capitão</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Field field="nome_capitao" label="Nome do Capitão" placeholder="Nome ou Nick no jogo" required />
                    <Field field="whatsapp_capitao" label="WhatsApp do Capitão" placeholder="+258 8X XXX XXXX" required type="tel" />
                  </div>
                </div>
                <div className={styles.captainCard}>
                  <div className={styles.captainBadge} style={{ background: 'rgba(148,163,184,0.1)', borderColor: 'rgba(148,163,184,0.3)', color: '#94a3b8' }}>
                    🥈 Vice-Capitão
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Field field="nome_vice_capitao" label="Nome do Vice-Capitão" placeholder="Nome ou Nick no jogo" required />
                    <Field field="whatsapp_vice_capitao" label="WhatsApp do Vice-Capitão" placeholder="+258 8X XXX XXXX" required type="tel" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================== TITULARES ====================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionNumber}>3</div>
              <div>
                <h2>Jogadores Titulares</h2>
                <p>Mínimo de 4 jogadores obrigatórios</p>
              </div>
            </div>
            <div className={styles.sectionBody}>
              <div className="form-grid">
                {([1, 2, 3, 4] as const).map(n => (
                  <div key={n} className={styles.playerCard}>
                    <div className={styles.playerNum}>#{n}</div>
                    <Field
                      field={`jogador${n}` as keyof FormData}
                      label={`Jogador ${n}`}
                      placeholder="Nick no Free Fire"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ====================== RESERVAS ====================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionNumber}>4</div>
              <div>
                <h2>Jogadores Reservas</h2>
                <p>Opcional – até 2 reservas permitidos</p>
              </div>
            </div>
            <div className={styles.sectionBody}>
              <div className="form-grid">
                <div className={`${styles.playerCard} ${styles.playerCardOptional}`}>
                  <div className={styles.playerNum} style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8' }}>R1</div>
                  <Field field="reserva1" label="Reserva 1" placeholder="Nick no Free Fire (opcional)" />
                </div>
                <div className={`${styles.playerCard} ${styles.playerCardOptional}`}>
                  <div className={styles.playerNum} style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8' }}>R2</div>
                  <Field field="reserva2" label="Reserva 2" placeholder="Nick no Free Fire (opcional)" />
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className={styles.submitSection}>
            <div className={styles.submitInfo}>
              <p>✅ Ao submeter, concordas com as regras do campeonato</p>
              <p>🔒 Os teus dados são usados apenas para a inscrição</p>
            </div>
            <button
              id="btn-submeter"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ minWidth: '240px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  A processar...
                </>
              ) : (
                '🔥 CONFIRMAR INSCRIÇÃO'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
