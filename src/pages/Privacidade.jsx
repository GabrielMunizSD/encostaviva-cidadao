import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apagarMeusDados, exportarMeusDados } from '../services/armazenamento.js'

export default function Privacidade() {
  const { sessao, setSessao } = useAuth()
  const navegar = useNavigate()

  function exportar() {
    const dados = exportarMeusDados(sessao.usuario)
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `encostaviva-meus-dados-${sessao.usuario}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function apagar() {
    if (window.confirm('Apagar sua conta e todos os seus relatos deste navegador? Esta ação não pode ser desfeita.')) {
      apagarMeusDados(sessao.usuario)
      setSessao(null)
      navegar('/login')
    }
  }

  return (
    <>
      <h1>Meus dados</h1>
      <h2>O que guardamos</h2>
      <ul>
        <li>Seu apelido, nome de usuário e bairro.</li>
        <li>Sua senha, guardada só como <em>hash</em> (SHA-256 com sal), nunca o texto da senha.</li>
        <li>Seus relatos, já anonimizados: telefone, e-mail e CPF são trocados por marcadores antes de salvar.</li>
      </ul>
      <h2>Onde ficam</h2>
      <p>
        Somente neste navegador (armazenamento local). Nada é enviado para servidores, e a IA roda no próprio aparelho.
      </p>
      <h2>Seus direitos (LGPD)</h2>
      <p>Você pode ver uma cópia de tudo o que está guardado ou apagar tudo agora.</p>
      <p>
        <button type="button" className="botao botao-secundario" onClick={exportar}>Baixar meus dados (JSON)</button>{' '}
        <button type="button" className="botao botao-perigo" onClick={apagar}>Apagar minha conta e meus dados</button>
      </p>
    </>
  )
}
