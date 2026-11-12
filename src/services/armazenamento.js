// Persistência no navegador (localStorage). Todas as leituras são protegidas com try/catch:
// em modo anônimo ou com armazenamento bloqueado, o app continua funcionando sem quebrar.
const CHAVE_USUARIOS = 'encostaviva:usuarios'
const CHAVE_SESSAO = 'encostaviva:sessao'
const chaveRelatos = (usuario) => `encostaviva:relatos:${usuario}`

function ler(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave)
    return bruto ? JSON.parse(bruto) : padrao
  } catch {
    return padrao
  }
}

function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

// ---------- usuários e login local ----------
async function hashSenha(senha, sal) {
  const dados = new TextEncoder().encode(`${sal}:${senha}`)
  const digest = await crypto.subtle.digest('SHA-256', dados)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function cadastrarUsuario({ usuario, nome, senha, bairro }) {
  const usuarios = ler(CHAVE_USUARIOS, {})
  if (usuarios[usuario]) throw new Error('Este nome de usuário já existe.')
  const sal = crypto.getRandomValues(new Uint32Array(2)).join('')
  usuarios[usuario] = { nome, bairro, sal, hash: await hashSenha(senha, sal), criadoEm: new Date().toISOString() }
  if (!gravar(CHAVE_USUARIOS, usuarios)) throw new Error('O navegador bloqueou o armazenamento local.')
}

export async function autenticar(usuario, senha) {
  const u = ler(CHAVE_USUARIOS, {})[usuario]
  if (!u || u.hash !== (await hashSenha(senha, u.sal))) throw new Error('Usuário ou senha incorretos.')
  const sessao = { usuario, nome: u.nome, bairro: u.bairro }
  try {
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
  } catch {
    /* sem sessão persistente: o login vale só até recarregar a página */
  }
  return sessao
}

export function sessaoAtual() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO)) ?? null
  } catch {
    return null
  }
}

export function encerrarSessao() {
  try {
    sessionStorage.removeItem(CHAVE_SESSAO)
  } catch {
    /* nada a fazer */
  }
}

// ---------- relatos ----------
export function listarRelatos(usuario) {
  return ler(chaveRelatos(usuario), [])
}

export function salvarRelato(usuario, relato) {
  const relatos = listarRelatos(usuario)
  const protocolo = `EV-${new Date().getFullYear()}-${String(relatos.length + 1).padStart(4, '0')}`
  const novo = { ...relato, id: crypto.randomUUID(), protocolo, criadoEm: new Date().toISOString() }
  gravar(chaveRelatos(usuario), [novo, ...relatos])
  return novo
}

export function buscarRelato(usuario, id) {
  return listarRelatos(usuario).find((r) => r.id === id) ?? null
}

export function excluirRelato(usuario, id) {
  gravar(chaveRelatos(usuario), listarRelatos(usuario).filter((r) => r.id !== id))
}

// ---------- direitos do titular (LGPD) ----------
export function exportarMeusDados(usuario) {
  const perfil = { ...(ler(CHAVE_USUARIOS, {})[usuario] ?? {}) }
  delete perfil.sal // dados de segurança não fazem parte da exportação
  delete perfil.hash
  return { usuario, perfil, relatos: listarRelatos(usuario), exportadoEm: new Date().toISOString() }
}

export function apagarMeusDados(usuario) {
  const usuarios = ler(CHAVE_USUARIOS, {})
  delete usuarios[usuario]
  gravar(CHAVE_USUARIOS, usuarios)
  try {
    localStorage.removeItem(chaveRelatos(usuario))
  } catch {
    /* nada a fazer */
  }
  encerrarSessao()
}
