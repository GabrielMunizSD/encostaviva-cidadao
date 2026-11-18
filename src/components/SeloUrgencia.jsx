// Selo de urgência: a informação vem por texto e ícone, não só pela cor (acessível para daltônicos).
const SELOS = {
  alta: { texto: 'Urgência alta', icone: '▲' },
  media: { texto: 'Urgência média', icone: '●' },
  baixa: { texto: 'Urgência baixa', icone: '▼' },
  revisao: { texto: 'Em revisão humana', icone: '?' },
}

export default function SeloUrgencia({ urgencia }) {
  const chave = urgencia ?? 'revisao'
  const { texto, icone } = SELOS[chave]
  return (
    <span className={`selo selo-${chave}`}>
      <span aria-hidden="true">{icone}</span> {texto}
    </span>
  )
}
