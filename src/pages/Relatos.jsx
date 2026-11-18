import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CartaoRelato from '../components/CartaoRelato.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { listarRelatos } from '../services/armazenamento.js'

const FILTROS = [
  ['todas', 'Todas'],
  ['alta', 'Alta'],
  ['media', 'Média'],
  ['baixa', 'Baixa'],
  ['revisao', 'Em revisão'],
]

export default function Relatos() {
  const { sessao } = useAuth()
  const [filtro, setFiltro] = useState('todas')
  const [busca, setBusca] = useState('')
  const relatos = listarRelatos(sessao.usuario)

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return relatos.filter((r) => {
      const urg = r.decisao.urgencia ?? 'revisao'
      const passaFiltro = filtro === 'todas' || urg === filtro
      const passaBusca = !termo || `${r.texto} ${r.bairro} ${r.protocolo}`.toLowerCase().includes(termo)
      return passaFiltro && passaBusca
    })
  }, [relatos, filtro, busca])

  return (
    <>
      <h1>Meus relatos</h1>
      {relatos.length === 0 ? (
        <p>
          Você ainda não enviou relatos. <Link to="/relatos/novo">Relatar um risco</Link>
        </p>
      ) : (
        <>
          <div className="filtros">
            <fieldset>
              <legend>Filtrar por urgência</legend>
              {FILTROS.map(([valor, rotulo]) => (
                <label key={valor} className="chip">
                  <input type="radio" name="filtro" value={valor} checked={filtro === valor}
                    onChange={() => setFiltro(valor)} />
                  {rotulo}
                </label>
              ))}
            </fieldset>
            <div className="campo">
              <label htmlFor="busca">Buscar por texto, bairro ou protocolo</label>
              <input id="busca" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>
          <p role="status" className="discreto">
            {visiveis.length} de {relatos.length} relato(s)
          </p>
          <ul className="lista">
            {visiveis.map((r) => (
              <CartaoRelato key={r.id} relato={r} />
            ))}
          </ul>
        </>
      )}
    </>
  )
}
