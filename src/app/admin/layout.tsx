'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from './layout.module.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !isLoginPage) {
        router.push('/admin/login')
      } else {
        setChecking(false)
      }
    })
  }, [router, isLoginPage])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (isLoginPage) return <>{children}</>

  if (checking) {
    return (
      <div className={styles.loading}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <p>A verificar autenticação...</p>
      </div>
    )
  }

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/equipas', label: 'Equipas', icon: '🛡️' },
  ]

  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoIcon}>🏆</div>
          <div>
            <div className="orbitron gradient-text" style={{ fontSize: '0.8rem', fontWeight: 800 }}>COPA ENIGMA</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Painel Administrativo</div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href || pathname.startsWith(link.href + '/') ? styles.navLinkActive : ''}`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.siteLink} target="_blank">
            🌐 Ver Site
          </Link>
          <button onClick={handleLogout} className={`btn btn-ghost btn-sm ${styles.logoutBtn}`}>
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>
        {/* TOP BAR */}
        <header className={styles.topBar}>
          <div className={styles.topBarTitle}>
            {navLinks.find(l => pathname.startsWith(l.href))?.label || 'Admin'}
          </div>
          <div className={styles.topBarActions}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              admin@copaenigma.com
            </span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              🚪 Sair
            </button>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
