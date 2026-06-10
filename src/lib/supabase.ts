import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Equipa = {
  id: string
  nome_equipa: string
  provincia: string
  cidade_distrito: string | null
  nome_guilda: string | null
  nome_capitao: string
  whatsapp_capitao: string
  nome_vice_capitao: string
  whatsapp_vice_capitao: string
  data_inscricao: string
}

export type Jogador = {
  id: string
  equipa_id: string
  nome_jogador: string
  tipo: 'titular' | 'reserva'
  ordem: number
}

export type EquipaComJogadores = Equipa & {
  jogadores: Jogador[]
}
