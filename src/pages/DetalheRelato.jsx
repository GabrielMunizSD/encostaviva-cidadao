import { Link, useNavigate, useParams } from 'react-router-dom'
import ResultadoIA from '../components/ResultadoIA.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { buscarRelato, excluirRelato } from '../services/armazenamento.js'

export default function DetalheRelato() {
  const { id } = useParams()
  const { sessao } = useAuth()
  const navegar = useNavigate()
  const relato = buscarRelato(sessao.usuario, id)

  if (!relato) {
    return (
      <>
        <h1>Relato não encontrado</h1>
        <p><Link to="/relatos">Voltar para meus relatos</Link></p>
      </>
    )
  }

  function excluir() {
    if (window.confirm(`Excluir o relato ${relato.protocolo}? Esta ação não pode ser desfeita.`)) {
      excluirRelato(sessao.usuario, relato.id)
      navegar('/relatos')
    }
  }

  return (
    <>
      <p><Link to="/relatos">← Meus relatos</Link></p>
      <h1>Protocolo {relato.protocolo}</h1>
      <dl className="detalhes">
        <dt>Bairro</dt><dd>{relato.bairro}</dd>
        <dt>Enviado em</dt><dd>{new Date(relato.criadoEm).toLocaleString('pt-BR')}</dd>
        <dt>Relato (anonimizado)</dt><dd>{relato.texto}</dd>
      </dl>
      <ResultadoIA relato={relato} />
      <button type="button" className="botao botao-perigo" onClick={excluir}>Excluir este relato</button>
    </>
  )
}
