import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'
import Sobre from './pages/Sobre.jsx'

// Versão provisória: a tela inicial de verdade entra num próximo commit.
function EmConstrucao() {
  return (
    <>
      <h1>EncostaViva Cidadão</h1>
      <p>Login feito. As outras telas estão em construção.</p>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route element={<RotaProtegida />}>
          <Route path="/" element={<EmConstrucao />} />
        </Route>
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
