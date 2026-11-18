import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const TITULOS = {
  '/': 'Início',
  '/relatos/novo': 'Novo relato',
  '/relatos': 'Meus relatos',
  '/privacidade': 'Meus dados',
  '/sobre': 'Sobre e ODS',
  '/login': 'Entrar',
  '/cadastro': 'Criar conta',
}

export default function Layout() {
  const { sessao, sair } = useAuth()
  const local = useLocation()
  const navegar = useNavigate()
  const mainRef = useRef(null)
  const primeiraTela = useRef(true)

  // A cada troca de tela: atualiza o título da aba e leva o foco para o conteúdo (leitores de tela anunciam a nova página).
  // No primeiro carregamento o foco fica no início, para o atalho "Pular para o conteúdo" ser o primeiro Tab.
  useEffect(() => {
    const titulo = TITULOS[local.pathname] ?? 'Detalhe do relato'
    document.title = `${titulo} | EncostaViva`
    if (primeiraTela.current) {
      primeiraTela.current = false
      return
    }
    mainRef.current?.focus()
  }, [local.pathname])

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="topo">
        <div className="topo-interno">
          <NavLink to="/" className="marca" aria-label="EncostaViva, página inicial">
            <span aria-hidden="true">⛰️</span> EncostaViva
          </NavLink>
          <nav aria-label="Navegação principal">
            <ul className="menu">
              {sessao ? (
                <>
                  <li><NavLink to="/" end>Início</NavLink></li>
                  <li><NavLink to="/relatos/novo">Novo relato</NavLink></li>
                  <li><NavLink to="/relatos" end>Meus relatos</NavLink></li>
                  <li><NavLink to="/privacidade">Meus dados</NavLink></li>
                  <li><NavLink to="/sobre">Sobre e ODS</NavLink></li>
                  <li>
                    <button type="button" className="botao-link" onClick={() => { sair(); navegar('/login') }}>
                      Sair <span className="sr-only">da conta de {sessao.nome}</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><NavLink to="/login">Entrar</NavLink></li>
                  <li><NavLink to="/cadastro">Criar conta</NavLink></li>
                  <li><NavLink to="/sobre">Sobre e ODS</NavLink></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main id="conteudo" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="rodape">
        <p>
          <strong>Em perigo? Ligue 199 (Defesa Civil) ou 193 (Bombeiros).</strong> Este é um protótipo acadêmico (FIAP,
          Global Solution 2026.2): os dados ficam só neste navegador e a vistoria é simulada.
        </p>
      </footer>
    </>
  )
}
