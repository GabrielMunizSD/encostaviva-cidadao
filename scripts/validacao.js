// Validação da IA de triagem com relatos que NÃO estão no treino (linguagem livre, gíria, negação).
// Rodar com: npm run validar
import { classificar, CLASSES, anonimizar } from '../src/services/ia.js'

const VALIDACAO = [
  ['a terra desceu inteira e levou o barraco do lado', 'alta'],
  ['acabou de cair um pedaço enorme do morro na rua, carro soterrado', 'alta'],
  ['SOCORRO TEM UMA FAMILIA PRESA NA CASA QUE CAIU', 'alta'],
  ['a parede estalou a noite toda e agora a porta não fecha mais', 'alta'],
  ['o barranco tá descendo devagar, dá pra ver a cerca andando', 'alta'],
  ['água barrenta brotando do chão com muita força e o poste entortou', 'alta'],
  ['minha casa está trincando enquanto falo, estamos saindo', 'alta'],
  ['deslizamento na escadaria, pedras enormes rolaram', 'alta'],
  ['o morro escorreu e cobriu a viela inteira', 'alta'],
  ['a laje do vizinho despencou depois do estrondo', 'alta'],
  ['tem rachadura enorme abrindo no chão do quintal e a casa tá afundando', 'alta'],
  ['árvore gigante tombou com raiz e tudo em cima do telhado', 'alta'],
  ['notei umas rachaduras finas novas no banheiro depois da chuva', 'media'],
  ['o quintal tá virando um brejo, a água não para de brotar', 'media'],
  ['o muro de contenção tá meio estufado, não sei se é normal', 'media'],
  ['tem uma árvore torta que piorou essa semana', 'media'],
  ['a canaleta entupiu e a água tá descendo pelo barranco', 'media'],
  ['o piso da sala ficou desnivelado', 'media'],
  ['apareceu uma trinca fina no muro mas nada caiu', 'media'],
  ['a terra do barranco está mole e escorrendo um pouco', 'media'],
  ['infiltração nova na parede que encosta no morro', 'media'],
  ['pedra solta lá em cima, por enquanto parada', 'media'],
  ['o cano da rua estourou e tá jorrando água no morro', 'media'],
  ['a sentinela da esquina mudou bastante o valor', 'media'],
  ['boa tarde, qual o telefone da defesa civil?', 'baixa'],
  ['vocês vão fazer palestra na escola esse mês?', 'baixa'],
  ['a tampa da sentinela sumiu', 'baixa'],
  ['obrigado pela visita de ontem, deu tudo certo', 'baixa'],
  ['queria ser voluntário no treinamento', 'baixa'],
  ['o caminhão de lixo não passou', 'baixa'],
  ['dá pra colocar uma sentinela perto da creche?', 'baixa'],
  ['não tem nada de errado, só queria confirmar meu cadastro', 'baixa'],
  ['o mato tá alto na praça', 'baixa'],
  ['nenhuma rachadura por aqui, tudo tranquilo', 'baixa'],
  ['meu filho quer saber como a sentinela funciona', 'baixa'],
  ['o app pede senha e eu esqueci', 'baixa'],
]

const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : '-')
const resultados = VALIDACAO.map(([texto, real]) => ({ texto, real, ...classificar(texto) }))
const decididos = resultados.filter((r) => r.urgencia)
const acertos = decididos.filter((r) => r.urgencia === r.real)
const altas = resultados.filter((r) => r.real === 'alta')
const altasRebaixadas = altas.filter((r) => r.urgencia && r.urgencia !== 'alta')

console.log(`Validação da IA de triagem: ${resultados.length} relatos inéditos (12 por classe)\n`)
console.log(`Decididos pela IA:            ${decididos.length}/${resultados.length} (${pct(decididos.length, resultados.length)})`)
console.log(`Enviados para revisão humana: ${resultados.length - decididos.length}`)
console.log(`Acurácia nos decididos:       ${acertos.length}/${decididos.length} (${pct(acertos.length, decididos.length)})`)
console.log(`Emergências rebaixadas:       ${altasRebaixadas.length}/${altas.length} (alta classificada como média ou baixa)`)
console.log(`Decisões pela regra:          ${resultados.filter((r) => r.origem === 'regra').length}\n`)

console.log('Matriz de confusão (linhas = real, colunas = decisão)')
const cols = [...CLASSES, 'revisão']
console.log('          ' + cols.map((c) => c.padStart(8)).join(''))
for (const real of CLASSES) {
  const linha = cols.map((c) =>
    String(resultados.filter((r) => r.real === real && (r.urgencia ?? 'revisão') === c).length).padStart(8),
  )
  console.log(real.padEnd(10) + linha.join(''))
}

console.log('\nErros da IA (decididos com a classe errada):')
for (const r of decididos.filter((r) => r.urgencia !== r.real)) {
  console.log(`  real=${r.real.padEnd(5)} ia=${r.urgencia.padEnd(5)} (${r.origem}) "${r.texto}"`)
}

console.log('\nAnonimização:')
console.log(' ', anonimizar('o muro rachou, meu telefone é (24) 99812-3344 e email ana.teste@exemplo.com'))
