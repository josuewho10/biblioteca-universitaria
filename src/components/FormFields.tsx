import type { ChangeEvent } from 'react'

// Componentes reutilizables de formulario: label + control + mensaje de error

interface BaseProps {
  id: string
  label: string
  error?: string
}

interface InputFieldProps extends BaseProps {
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'number'
  placeholder?: string
  min?: number
}

export function InputField({ id, label, error, value, onChange, type = 'text', placeholder, min }: InputFieldProps) {
  return (
    <div className="inv-campo">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {error && <small className="inv-error">{error}</small>}
    </div>
  )
}

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
}

export function SelectField({ id, label, error, value, onChange, options, placeholder = 'Selecciona...' }: SelectFieldProps) {
  return (
    <div className="inv-campo">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((op) => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
      {error && <small className="inv-error">{error}</small>}
    </div>
  )
}

interface TextAreaFieldProps extends BaseProps {
  value: string
  onChange: (value: string) => void
  rows?: number
}

export function TextAreaField({ id, label, error, value, onChange, rows = 3 }: TextAreaFieldProps) {
  return (
    <div className="inv-campo">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      />
      {error && <small className="inv-error">{error}</small>}
    </div>
  )
}
