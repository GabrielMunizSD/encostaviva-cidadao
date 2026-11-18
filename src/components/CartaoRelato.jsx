import { Link } from 'react-router-dom'
import SeloUrgencia from './SeloUrgencia.jsx'

export default function CartaoRelato({ relato }) {
  const data = new Date(relato.criadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  return (
    <li className="cartao">
      <div className="cartao-topo">
        <SeloUrgencia urgencia={relato.decisao.urgencia} />
        <span className="discreto">{data}</span>
      </div>
      <h3>
        <Link to={`/relatos/${relato.id}`}>
          {relato.protocolo} · {relato.bairro}
        </Link>
      </h3>
      <p className="resumo">{relato.texto}</p>
      <p className="discreto">{relato.acao.titulo}</p>
    </li>
  )
}
