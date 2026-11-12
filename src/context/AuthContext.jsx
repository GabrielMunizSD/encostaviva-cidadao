import { createContext, useContext, useState } from 'react'
import { autenticar, encerrarSessao, sessaoAtual } from '../services/armazenamento.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(() => sessaoAtual())

  async function entrar(usuario, senha) {
    const s = await autenticar(usuario, senha)
    setSessao(s)
    return s
  }

  function sair() {
    encerrarSessao()
    setSessao(null)
  }

  return <AuthContext.Provider value={{ sessao, entrar, sair, setSessao }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
