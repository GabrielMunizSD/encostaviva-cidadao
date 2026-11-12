import { useId } from 'react'

// Campo de formulário acessível: rótulo ligado ao campo, dica e erro anunciados por leitores de tela.
export default function Campo({ rotulo, dica, erro, tipo = 'text', multilinha = false, opcoes, ...props }) {
  const id = useId()
  const idDica = dica ? `${id}-dica` : undefined
  const idErro = erro ? `${id}-erro` : undefined
  const descricao = [idDica, idErro].filter(Boolean).join(' ') || undefined
  const comum = { id, 'aria-describedby': descricao, 'aria-invalid': erro ? true : undefined, ...props }

  return (
    <div className="campo">
      <label htmlFor={id}>
        {rotulo}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      {dica && <p id={idDica} className="dica">{dica}</p>}
      {opcoes ? (
        <select {...comum}>
          <option value="">Selecione...</option>
          {opcoes.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : multilinha ? (
        <textarea rows={5} {...comum} />
      ) : (
        <input type={tipo} {...comum} />
      )}
      {erro && <p id={idErro} className="erro" role="alert">{erro}</p>}
    </div>
  )
}
