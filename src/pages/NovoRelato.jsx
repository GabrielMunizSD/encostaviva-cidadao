import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import ResultadoIA from '../components/ResultadoIA.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { BAIRROS } from '../data/bairros.js'
import { salvarRelato } from '../services/armazenamento.js'
import { anonimizar, classificar, gerarAcao } from '../services/ia.js'

const EXEMPLOS = [
  'o barranco atrás de casa deslizou e a parede está abrindo',
  'apareceu uma rachadura nova no muro depois da chuva',
  'queria saber como funciona a sentinela',
]

export default function NovoRelato() {
  const { sessao } = useAuth()
  const [bairro, setBairro] = useState(sessao.bairro ?? '')
  const [texto, setTexto] = useState('')
  const [erros, setErros] = useState({})
  const [processando, setProcessando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const regiaoResultado = useRef(null)

  const textoAnonimo = anonimizar(texto)
  const temDadoPessoal = texto && textoAnonimo !== texto

  async function enviar(e) {
    e.preventDefault()
    const encontrados = {}
    if (!bairro) encontrados.bairro = 'Escolha o bairro.'
    if (texto.trim().length < 10) encontrados.texto = 'Descreva o que está acontecendo com pelo menos algumas palavras.'
    setErros(encontrados)
    if (Object.keys(encontrados).length) return

    setProcessando(true)
    await new Promise((r) => setTimeout(r, 600)) // simula o tempo de processamento
    const decisao = classificar(texto)
    const acao = gerarAcao(decisao)
    // Só o texto anonimizado é guardado: o original com telefone, e-mail ou CPF nunca é salvo.
    const relato = salvarRelato(sessao.usuario, { bairro, texto: decisao.texto, decisao, acao })
    setResultado(relato)
    setProcessando(false)
    setTexto('')
    setTimeout(() => regiaoResultado.current?.focus(), 0)
  }

  return (
    <>
      <h1>Relatar um risco</h1>
      <form onSubmit={enviar} noValidate className="estreito-form">
        <Campo rotulo="Bairro" required opcoes={BAIRROS.map((b) => b.nome)} value={bairro}
          onChange={(e) => setBairro(e.target.value)} erro={erros.bairro} />
        <Campo rotulo="O que está acontecendo?" multilinha required value={texto}
          onChange={(e) => setTexto(e.target.value)} erro={erros.texto}
          dica="Escreva com suas palavras. Não precisa informar telefone, endereço ou documentos." />
        {temDadoPessoal && (
          <p className="aviso" role="status">
            Encontramos dados pessoais no texto. Eles serão escondidos antes de salvar: “{textoAnonimo}”
          </p>
        )}
        <p className="discreto">
          Exemplos para testar:{' '}
          {EXEMPLOS.map((ex, i) => (
            <span key={ex}>
              <button type="button" className="botao-link" onClick={() => setTexto(ex)}>“{ex}”</button>
              {i < EXEMPLOS.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
        <button className="botao" type="submit" disabled={processando} aria-describedby="aviso-emergencia">
          {processando ? 'Analisando com IA...' : 'Enviar relato'}
        </button>
        <p id="aviso-emergencia" className="discreto">Em perigo imediato, ligue 199 antes de preencher.</p>
      </form>

      <div ref={regiaoResultado} tabIndex={-1} aria-live="polite" className="regiao-resultado">
        {processando && <p role="status">Analisando o relato...</p>}
        {resultado && !processando && (
          <>
            <ResultadoIA relato={resultado} />
            <p>
              <Link to={`/relatos/${resultado.id}`}>Ver o protocolo {resultado.protocolo}</Link> ·{' '}
              <Link to="/relatos">Todos os meus relatos</Link>
            </p>
          </>
        )}
      </div>
    </>
  )
}
