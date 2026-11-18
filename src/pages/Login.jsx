import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { entrar } = useAuth()
  const navegar = useNavigate()
  const local = useLocation()
  const [form, setForm] = useState({ usuario: '', senha: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await entrar(form.usuario.trim().toLowerCase(), form.senha)
      navegar(local.state?.voltarPara ?? '/', { replace: true })
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="estreito">
      <h1>Entrar</h1>
      <p>Acesse para relatar riscos na sua encosta e acompanhar seus protocolos.</p>
      <form onSubmit={enviar} noValidate>
        <Campo rotulo="Nome de usuário" autoComplete="username" required value={form.usuario}
          onChange={(e) => setForm({ ...form, usuario: e.target.value })} />
        <Campo rotulo="Senha" tipo="password" autoComplete="current-password" required value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })} />
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </div>
  )
}
