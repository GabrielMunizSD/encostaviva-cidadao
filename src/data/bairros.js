// Bairros da cidade fictícia "Serra Alta" e a leitura mais recente das sentinelas (dados simulados).
// A resistência do memristor vai de 16 kΩ (nenhum evento) a 100 Ω (saturado).
export const BAIRROS = [
  { nome: 'Morro do Sol', sentinelas: 4, menorResistencia: 527 },
  { nome: 'Vila Esperança', sentinelas: 4, menorResistencia: 7322 },
  { nome: 'Jardim das Pedras', sentinelas: 4, menorResistencia: 2818 },
  { nome: 'Encosta Verde', sentinelas: 4, menorResistencia: 14441 },
  { nome: 'Vale Fundo', sentinelas: 4, menorResistencia: 8090 },
  { nome: 'Alto do Cruzeiro', sentinelas: 4, menorResistencia: 14301 },
]

export function doseMemristor(resistencia) {
  return Math.min(1, Math.max(0, (16000 - resistencia) / (16000 - 100)))
}
