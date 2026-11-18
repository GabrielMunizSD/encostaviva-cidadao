import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { BAIRROS, doseMemristor } from '../data/bairros.js'
import { listarRelatos } from '../services/armazenamento.js'

function nivel(dose) {
  if (dose >= 0.7) return { texto: 'Atenção máxima', classe: 'alta' }
  if (dose >= 0.4) return { texto: 'Atenção', classe: 'media' }
  return { texto: 'Estável', classe: 'baixa' }
}

export default function Inicio() {
  const { sessao } = useAuth()
  const relatos = listarRelatos(sessao.usuario)
  const meuBairro = BAIRROS.find((b) => b.nome === sessao.bairro)

  return (
    <>
      <h1>Olá, {sessao.nome}</h1>
      <p className="destaque">
        Viu algo estranho na encosta? Conte com suas palavras. A IA entende o relato, diz o que fazer e prioriza a
        vistoria da Defesa Civil.
      </p>
      <p>
        <Link className="botao" to="/relatos/novo">Relatar um risco</Link>{' '}
        <Link className="botao botao-secundario" to="/relatos">Meus relatos ({relatos.length})</Link>
      </p>

      <h2>Sentinelas por bairro</h2>
      <p className="discreto">
        Cada sentinela guarda num memristor a “dose” de eventos de instabilidade do solo, mesmo sem energia. Leitura
        simulada.
      </p>
      <ul className="grade">
        {BAIRROS.map((b) => {
          const dose = doseMemristor(b.menorResistencia)
          const n = nivel(dose)
          return (
            <li key={b.nome} className={`cartao ${b.nome === meuBairro?.nome ? 'cartao-meu' : ''}`}>
              <h3>
                {b.nome}
                {b.nome === meuBairro?.nome && <span className="discreto"> (seu bairro)</span>}
              </h3>
              <p>
                <span className={`selo selo-${n.classe}`}>{n.texto}</span>
              </p>
              <label className="discreto" htmlFor={`dose-${b.nome}`}>
                Dose acumulada: {Math.round(dose * 100)}%
              </label>
              <progress id={`dose-${b.nome}`} max="100" value={Math.round(dose * 100)}>
                {Math.round(dose * 100)}%
              </progress>
              <p className="discreto">
                {b.sentinelas} sentinelas · menor leitura {b.menorResistencia.toLocaleString('pt-BR')} Ω
              </p>
            </li>
          )
        })}
      </ul>
    </>
  )
}
