const ODS = [
  ['11', 'Cidades e comunidades sustentáveis', 'Meta 11.5: reduzir mortes e afetados por desastres. O relato vira prioridade de vistoria em segundos.'],
  ['13', 'Ação contra a mudança global do clima', 'Meta 13.1: resiliência a riscos climáticos. Chuvas extremas são o gatilho dos deslizamentos.'],
  ['3', 'Saúde e bem-estar', 'Orientação imediata (sair de casa, ligar 199) e vistoria rápida reduzem mortos e feridos.'],
  ['10', 'Redução das desigualdades', 'As áreas de risco concentram moradores de baixa renda. O app é gratuito e funciona no celular.'],
  ['9', 'Indústria, inovação e infraestrutura', 'IA embarcada e sentinelas com memristor como infraestrutura de alerta.'],
]

export default function Sobre() {
  return (
    <>
      <h1>Sobre o EncostaViva</h1>
      <p>
        <strong>Problema:</strong> milhões de brasileiros vivem em áreas de risco de deslizamento. Depois de uma chuva
        forte, a Defesa Civil recebe muitos relatos ao mesmo tempo e precisa decidir rápido onde vistoriar primeiro.
      </p>
      <p>
        <strong>Público afetado:</strong> moradores de encostas em áreas de risco e as equipes da Defesa Civil municipal.
      </p>
      <p>
        <strong>Solução:</strong> o morador descreve o que vê, com suas palavras. A IA esconde dados pessoais, classifica a
        urgência, mostra o que fazer agora e gera a ação: vistoria imediata, vistoria agendada, encaminhamento ou revisão
        por um agente.
      </p>

      <h2>Como a IA decide</h2>
      <ol>
        <li><strong>Anonimização:</strong> telefone, e-mail e CPF são trocados por marcadores.</li>
        <li><strong>Classificador Naive Bayes</strong> treinado com relatos rotulados (alta, média e baixa urgência).</li>
        <li><strong>Regra de segurança:</strong> palavras de perigo imediato, como “desabou” ou “soterrado”, sempre geram urgência alta.</li>
        <li><strong>Revisão humana:</strong> quando a IA não tem confiança suficiente, ela não decide sozinha.</li>
      </ol>
      <p>
        A IA roda no próprio navegador, sem enviar o texto para nenhum servidor. A decisão final de vistoria é sempre da
        Defesa Civil.
      </p>

      <h2>Objetivos de Desenvolvimento Sustentável</h2>
      <ul className="grade">
        {ODS.map(([n, nome, texto]) => (
          <li key={n} className="cartao">
            <h3>ODS {n}: {nome}</h3>
            <p>{texto}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
