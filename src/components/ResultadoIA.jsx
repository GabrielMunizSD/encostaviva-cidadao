import SeloUrgencia from './SeloUrgencia.jsx'

const ORIGEM = {
  ia: 'Decidido pelo modelo de IA',
  regra: 'Decidido pela regra de segurança',
  revisao: 'Enviado para revisão humana',
}

// Mostra a resposta da IA e a ação gerada, com a explicação de por que a decisão foi tomada.
export default function ResultadoIA({ relato }) {
  const { decisao, acao } = relato
  return (
    <section className={`resultado resultado-${decisao.urgencia ?? 'revisao'}`} aria-labelledby="titulo-resultado">
      <h2 id="titulo-resultado">{acao.titulo}</h2>
      <p>
        <SeloUrgencia urgencia={decisao.urgencia} /> <span className="discreto">Protocolo {relato.protocolo}</span>
      </p>
      <p><strong>Prazo:</strong> {acao.prazo}</p>
      <h3>O que fazer agora</h3>
      <ul>
        {acao.orientacoes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <details>
        <summary>Por que a IA decidiu assim?</summary>
        <ul>
          <li>{ORIGEM[decisao.origem]}.</li>
          {decisao.origem !== 'revisao' || decisao.confianca > 0 ? (
            <li>Confiança do modelo: {decisao.confianca > 0.99 ? "mais de 99" : Math.round(decisao.confianca * 100)}%.</li>
          ) : null}
          {decisao.motivo && <li>{decisao.motivo}</li>}
          {decisao.termos?.length > 0 && <li>Palavras que mais pesaram: {decisao.termos.join(', ')}.</li>}
          <li>Texto analisado (anonimizado): “{relato.texto}”</li>
        </ul>
      </details>
    </section>
  )
}
