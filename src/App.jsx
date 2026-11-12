import { Route, Routes } from 'react-router-dom'
import RotaProtegida from './components/RotaProtegida.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'

// Versão provisória: a tela inicial de verdade entra num próximo commit.
function EmConstrucao() {
  return (
    <main id="conteudo">
      <h1>EncostaViva Cidadão</h1>
      <p>Login feito. As outras telas estão em construção.</p>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route element={<RotaProtegida />}>
        <Route path="/" element={<EmConstrucao />} />
      </Route>
    </Routes>
  )
}
