'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      router.push('/admin/dashboard')
    } catch {
      setError('Credenciais inválidas. Verifica o email e a senha.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🛡️</div>
            <h1 className="orbitron gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              PAINEL ADMIN
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Copa Enigma & Batata Doce
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@copaenigma.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Senha <span className="required">*</span>
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="btn-login"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  A entrar...
                </>
              ) : (
                '🔐 ENTRAR NO PAINEL'
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <a href="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
