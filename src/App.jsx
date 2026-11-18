import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import Cadastro from './pages/Cadastro.jsx'
import DetalheRelato from './pages/DetalheRelato.jsx'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'
import NovoRelato from './pages/NovoRelato.jsx'
import Privacidade from './pages/Privacidade.jsx'
import Relatos from './pages/Relatos.jsx'
import Sobre from './pages/Sobre.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route element={<RotaProtegida />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/relatos/novo" element={<NovoRelato />} />
          <Route path="/relatos" element={<Relatos />} />
          <Route path="/relatos/:id" element={<DetalheRelato />} />
          <Route path="/privacidade" element={<Privacidade />} />
        </Route>
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
