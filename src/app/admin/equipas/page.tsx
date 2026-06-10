'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase, type Equipa } from '@/lib/supabase'
import styles from './page.module.css'

export default function EquipasPage() {
  const [equipas, setEquipas] = useState<Equipa[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedProvincia, setSelectedProvincia] = useState('')
  const [exportLoading, setExportLoading] = useState(false)

  const PROVINCES = [
    'Cabo Delgado', 'Gaza', 'Inhambane', 'Manica', 'Maputo Cidade',
    'Maputo Província', 'Nampula', 'Niassa', 'Sofala', 'Tete', 'Zambézia'
  ]

  const loadEquipas = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('equipas')
      .select('*')
      .order('data_inscricao', { ascending: false })
    setEquipas(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadEquipas() }, [loadEquipas])

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tens a certeza que queres apagar a equipa "${nome}"? Esta ação não pode ser desfeita.`)) return
    setDeleting(id)
    await supabase.from('equipas').delete().eq('id', id)
    setEquipas(prev => prev.filter(e => e.id !== id))
    setDeleting(null)
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const { data: eqs } = await supabase.from('equipas').select('*').order('data_inscricao', { ascending: false })
      const { data: jogs } = await supabase.from('jogadores').select('*').order('ordem', { ascending: true })

      const { utils, writeFile } = await import('xlsx')
      const wb = utils.book_new()

      // Equipas sheet
      const equipasData = (eqs || []).map(e => ({
        'Nome da Equipa': e.nome_equipa,
        'Província': e.provincia,
        'Cidade/Distrito': e.cidade_distrito || '',
        'Guilda': e.nome_guilda || '',
        'Capitão': e.nome_capitao,
        'WhatsApp Capitão': e.whatsapp_capitao,
        'Vice-Capitão': e.nome_vice_capitao,
        'WhatsApp Vice-Capitão': e.whatsapp_vice_capitao,
        'Data de Inscrição': new Date(e.data_inscricao).toLocaleString('pt-PT'),
      }))
      utils.book_append_sheet(wb, utils.json_to_sheet(equipasData), 'Equipas')

      // Jogadores sheet
      const jogadoresData = (jogs || []).map(j => {
        const equipa = (eqs || []).find(e => e.id === j.equipa_id)
        return {
          'Equipa': equipa?.nome_equipa || '',
          'Província': equipa?.provincia || '',
          'Jogador': j.nome_jogador,
          'Tipo': j.tipo === 'titular' ? 'Titular' : 'Reserva',
          'Ordem': j.ordem,
        }
      })
      utils.book_append_sheet(wb, utils.json_to_sheet(jogadoresData), 'Jogadores')

      writeFile(wb, `Copa-Enigma-Inscricoes-${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch (err) {
      console.error(err)
      alert('Erro ao exportar. Tenta novamente.')
    }
    setExportLoading(false)
  }

  const filtered = equipas.filter(e => {
    const matchSearch = search === '' ||
      e.nome_equipa.toLowerCase().includes(search.toLowerCase()) ||
      e.nome_capitao.toLowerCase().includes(search.toLowerCase())
    const matchProv = selectedProvincia === '' || e.provincia === selectedProvincia
    return matchSearch && matchProv
  })

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Equipas Inscritas</h1>
          <p className={styles.subtitle}>
            {equipas.length} equipa{equipas.length !== 1 ? 's' : ''} registada{equipas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            id="btn-export"
            onClick={handleExport}
            disabled={exportLoading || equipas.length === 0}
            className="btn btn-success"
          >
            {exportLoading ? (
              <><div className="spinner" /> A exportar...</>
            ) : (
              '📥 Exportar Excel'
            )}
          </button>
          <button onClick={loadEquipas} className="btn btn-ghost btn-sm">
            🔄
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <input
          type="search"
          className="form-input"
          placeholder="🔍 Pesquisar por equipa ou capitão..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
          id="search-equipas"
        />
        <select
          className="form-select"
          value={selectedProvincia}
          onChange={e => setSelectedProvincia(e.target.value)}
          style={{ width: '200px' }}
          id="filter-provincia"
        >
          <option value="">Todas as províncias</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* TABLE */}
      <div className={styles.tableSection}>
        {loading ? (
          <div className={styles.loading}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
            <span>A carregar equipas...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p style={{ fontSize: '2rem' }}>🏜️</p>
            <p>{search || selectedProvincia ? 'Nenhuma equipa encontrada com esses filtros.' : 'Ainda não há equipas inscritas.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipa</th>
                  <th>Província</th>
                  <th>Capitão</th>
                  <th>WhatsApp</th>
                  <th>Vice-Capitão</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((equipa, i) => (
                  <tr key={equipa.id}>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      {i + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{equipa.nome_equipa}</div>
                      {equipa.nome_guilda && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {equipa.nome_guilda}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-primary">{equipa.provincia}</span>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>{equipa.nome_capitao}</td>
                    <td>
                      <a
                        href={`https://wa.me/${equipa.whatsapp_capitao.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#25D366', fontSize: '0.85rem', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                      >
                        {equipa.whatsapp_capitao}
                      </a>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>{equipa.nome_vice_capitao}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(equipa.data_inscricao)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <Link
                          href={`/admin/equipas/${equipa.id}`}
                          className="btn btn-ghost btn-sm"
                          title="Ver detalhes"
                        >
                          👁️
                        </Link>
                        <Link
                          href={`/admin/equipas/${equipa.id}/editar`}
                          className="btn btn-outline btn-sm"
                          title="Editar"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(equipa.id, equipa.nome_equipa)}
                          className="btn btn-danger btn-sm"
                          disabled={deleting === equipa.id}
                          title="Apagar"
                        >
                          {deleting === equipa.id ? <div className="spinner" style={{ width: 14, height: 14 }} /> : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
