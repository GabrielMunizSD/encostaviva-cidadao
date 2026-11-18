import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { BAIRROS } from '../data/bairros.js'
import { cadastrarUsuario } from '../services/armazenamento.js'

const VAZIO = { nome: '', usuario: '', bairro: '', senha: '', confirmar: '', consentimento: false }

function validar(f) {
  const e = {}
  if (f.nome.trim().length < 2) e.nome = 'Informe como você quer ser chamado (pode ser um apelido).'
  if (!/^[a-z0-9._-]{3,20}$/i.test(f.usuario.trim())) e.usuario = 'Use de 3 a 20 letras, números, ponto, hífen ou sublinhado.'
  if (!f.bairro) e.bairro = 'Escolha o seu bairro.'
  if (f.senha.length < 6) e.senha = 'A senha precisa ter pelo menos 6 caracteres.'
  if (f.confirmar !== f.senha) e.confirmar = 'As senhas não são iguais.'
  if (!f.consentimento) e.consentimento = 'É preciso concordar com o uso dos dados para criar a conta.'
  return e
}

export default function Cadastro() {
  const [form, setForm] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const { entrar } = useAuth()
  const navegar = useNavigate()
  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  async function enviar(e) {
    e.preventDefault()
    const encontrados = validar(form)
    setErros(encontrados)
    if (Object.keys(encontrados).length) return
    try {
      const usuario = form.usuario.trim().toLowerCase()
      await cadastrarUsuario({ usuario, nome: form.nome.trim(), senha: form.senha, bairro: form.bairro })
      await entrar(usuario, form.senha)
      navegar('/', { replace: true })
    } catch (err) {
      setErroGeral(err.message)
    }
  }

  return (
    <div className="estreito">
      <h1>Criar conta</h1>
      <p className="aviso">
        Pedimos só o mínimo: um apelido, um nome de usuário e o bairro. Não pedimos CPF, endereço nem telefone.
        Protótipo: não use sua senha de verdade.
      </p>
      <form onSubmit={enviar} noValidate>
        <Campo rotulo="Como quer ser chamado" dica="Pode ser um apelido." autoComplete="nickname" required
          value={form.nome} onChange={mudar('nome')} erro={erros.nome} />
        <Campo rotulo="Nome de usuário" autoComplete="username" required value={form.usuario}
          onChange={mudar('usuario')} erro={erros.usuario} />
        <Campo rotulo="Bairro" required opcoes={BAIRROS.map((b) => b.nome)} value={form.bairro}
          onChange={mudar('bairro')} erro={erros.bairro} />
        <Campo rotulo="Senha" tipo="password" autoComplete="new-password" required dica="Mínimo de 6 caracteres."
          value={form.senha} onChange={mudar('senha')} erro={erros.senha} />
        <Campo rotulo="Confirme a senha" tipo="password" autoComplete="new-password" required
          value={form.confirmar} onChange={mudar('confirmar')} erro={erros.confirmar} />
        <div className="campo campo-check">
          <input id="consentimento" type="checkbox" checked={form.consentimento} onChange={mudar('consentimento')}
            aria-describedby={erros.consentimento ? 'erro-consentimento' : undefined}
            aria-invalid={erros.consentimento ? true : undefined} />
          <label htmlFor="consentimento">
            Concordo que meus relatos sejam usados para priorizar vistorias da Defesa Civil. Sei que posso exportar
            ou apagar meus dados a qualquer momento em “Meus dados”.
          </label>
          {erros.consentimento && <p id="erro-consentimento" className="erro" role="alert">{erros.consentimento}</p>}
        </div>
        {erroGeral && <p className="erro" role="alert">{erroGeral}</p>}
        <button className="botao" type="submit">Criar conta</button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
