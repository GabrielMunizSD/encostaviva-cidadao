import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Só deixa entrar quem fez login. Quem não está logado vai para /login e volta para onde queria depois.
export default function RotaProtegida() {
  const { sessao } = useAuth()
  const local = useLocation()
  if (!sessao) return <Navigate to="/login" replace state={{ voltarPara: local.pathname }} />
  return <Outlet />
}
