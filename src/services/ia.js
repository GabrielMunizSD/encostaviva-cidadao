// IA de triagem do EncostaViva (roda 100% no navegador, nenhum texto sai do aparelho).
// Camadas:
//   1. anonimização: telefone, e-mail e CPF são mascarados antes de qualquer coisa;
//   2. classificador Naive Bayes multinomial (palavras e pares de palavras) treinado com exemplos rotulados;
//   3. regra de segurança: termos de perigo imediato forçam urgência alta;
//   4. revisão humana: texto curto demais ou baixa confiança não é decidido pela IA.
import { EXEMPLOS_TREINO } from '../data/treino.js'

export const CLASSES = ['alta', 'media', 'baixa']
export const LIMIAR_CONFIANCA = 0.6

const PADROES_PII = [
  [/[\w.+-]+@[\w-]+\.[\w.]+/g, '[EMAIL]'],
  [/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[CPF]'],
  [/\(?\b\d{2}\)?\s?9?\d{4}-?\d{4}\b/g, '[TELEFONE]'],
]

const TERMOS_CRITICOS =
  /desab|desmoron|soterr|gente presa|pessoa presa|deslizou|deslizamento|veio abaixo|barranco caiu|escorregando|caiu em cima|lama invadiu|afund|cedeu|despencou/

const STOPWORDS = new Set(
  'a o e de da do das dos em no na nos nas um uma uns umas que com por para pra pro se ao aos me meu minha eu tem ta ja mais muito esta estao estou esse essa isso aqui la atras foi ser oi ola bom dia boa noite tarde'.split(
    ' ',
  ),
)

export function anonimizar(texto) {
  return PADROES_PII.reduce((t, [padrao, marcador]) => t.replace(padrao, marcador), String(texto ?? ''))
}

export function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\[(telefone|email|cpf)\]/g, ' ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Radical simples (corta finais comuns) para "rachadura"/"rachaduras", "inclinada"/"inclinando" se parecerem.
function radical(p) {
  return p.length > 5 ? p.replace(/(mente|coes|cao|ndo|das|dos|ada|ado|ras|res|as|os|es|a|o|s)$/, '') : p
}

export function tokens(texto) {
  const palavras = normalizar(texto)
    .split(' ')
    .filter((p) => p && !STOPWORDS.has(p))
    .map(radical)
  const bigramas = palavras.slice(1).map((p, i) => `${palavras[i]}_${p}`)
  return [...palavras, ...bigramas]
}

export function treinar(exemplos = EXEMPLOS_TREINO) {
  const contagem = Object.fromEntries(CLASSES.map((c) => [c, {}]))
  const totalTokens = Object.fromEntries(CLASSES.map((c) => [c, 0]))
  const docs = Object.fromEntries(CLASSES.map((c) => [c, 0]))
  const vocabulario = new Set()
  for (const [texto, classe] of exemplos) {
    docs[classe] += 1
    for (const t of tokens(texto)) {
      contagem[classe][t] = (contagem[classe][t] ?? 0) + 1
      totalTokens[classe] += 1
      vocabulario.add(t)
    }
  }
  return { contagem, totalTokens, docs, vocabulario, n: exemplos.length }
}

const MODELO = treinar()

function probabilidades(texto, modelo = MODELO) {
  const toks = tokens(texto).filter((t) => modelo.vocabulario.has(t))
  const V = modelo.vocabulario.size
  const logp = {}
  const contribuicao = {}
  for (const c of CLASSES) {
    logp[c] = Math.log(modelo.docs[c] / modelo.n)
    for (const t of toks) {
      const lp = Math.log(((modelo.contagem[c][t] ?? 0) + 1) / (modelo.totalTokens[c] + V))
      logp[c] += lp
      contribuicao[t] = contribuicao[t] ?? {}
      contribuicao[t][c] = lp
    }
  }
  const max = Math.max(...Object.values(logp))
  const exp = Object.fromEntries(CLASSES.map((c) => [c, Math.exp(logp[c] - max)]))
  const soma = Object.values(exp).reduce((a, b) => a + b, 0)
  const prob = Object.fromEntries(CLASSES.map((c) => [c, exp[c] / soma]))
  return { prob, toks, contribuicao }
}

// Palavras que mais puxaram a decisão para a classe escolhida (explicabilidade).
// Mostra a palavra como o cidadão escreveu, e não o radical interno usado pelo modelo.
function termosDecisivos(classe, contribuicao, texto) {
  const original = {}
  for (const p of normalizar(texto).split(' ')) original[radical(p)] ??= p
  return Object.entries(contribuicao)
    .filter(([t]) => !t.includes('_') && original[t])
    .map(([t, lp]) => {
      const outras = CLASSES.filter((c) => c !== classe).map((c) => lp[c])
      return [original[t], lp[classe] - Math.max(...outras)]
    })
    .filter(([, peso]) => peso > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([p]) => p)
}

export function classificar(textoOriginal) {
  const texto = anonimizar(textoOriginal)
  const palavras = normalizar(texto).split(' ').filter(Boolean)
  if (palavras.length < 3) {
    return { texto, urgencia: null, confianca: 0, origem: 'revisao', motivo: 'Texto curto demais para a IA entender.', termos: [] }
  }
  const { prob, contribuicao } = probabilidades(texto)
  const classe = CLASSES.reduce((a, b) => (prob[a] >= prob[b] ? a : b))
  const confianca = prob[classe]
  if (TERMOS_CRITICOS.test(normalizar(texto)) && classe !== 'alta') {
    return {
      texto, urgencia: 'alta', confianca, origem: 'regra', prob,
      motivo: `Termo de perigo imediato encontrado (a IA sozinha diria "${classe}").`,
      termos: (normalizar(texto).match(TERMOS_CRITICOS) ?? []).map(String),
    }
  }
  if (confianca < LIMIAR_CONFIANCA) {
    return {
      texto, urgencia: null, confianca, origem: 'revisao', prob,
      motivo: `Confiança baixa (${Math.round(confianca * 100)}%). Um agente vai ler o relato.`,
      termos: termosDecisivos(classe, contribuicao, texto),
    }
  }
  return { texto, urgencia: classe, confianca, origem: 'ia', prob, motivo: '', termos: termosDecisivos(classe, contribuicao, texto) }
}

// Ação gerada para o cidadão a partir da decisão.
export function gerarAcao(decisao) {
  switch (decisao.urgencia) {
    case 'alta':
      return {
        titulo: 'Vistoria imediata solicitada',
        prazo: 'Equipe acionada agora',
        orientacoes: [
          'Se ouvir estalos, ver rachaduras abrindo ou portas emperrando, saia de casa com sua família agora.',
          'Ligue 199 (Defesa Civil) ou 193 (Corpo de Bombeiros).',
          'Avise os vizinhos e não volte para buscar objetos.',
        ],
      }
    case 'media':
      return {
        titulo: 'Vistoria agendada',
        prazo: 'Até 48 horas (simulado)',
        orientacoes: [
          'Fotografe o problema hoje e de novo amanhã para comparar.',
          'Se a chuva continuar ou o problema aumentar, envie um novo relato.',
          'Se possível, desvie a água da chuva para longe da encosta.',
        ],
      }
    case 'baixa':
      return {
        titulo: 'Encaminhado ao atendimento',
        prazo: 'Resposta em até 5 dias úteis (simulado)',
        orientacoes: ['Seu pedido foi registrado e será respondido pela equipe.'],
      }
    default:
      return {
        titulo: 'Em revisão por um agente',
        prazo: 'Um agente vai ler o relato',
        orientacoes: [
          'A IA não teve certeza suficiente e preferiu não decidir sozinha.',
          'Em caso de perigo, ligue 199 (Defesa Civil) ou 193 (Corpo de Bombeiros).',
        ],
      }
  }
}
