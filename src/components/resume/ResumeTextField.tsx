type ResumeTextFieldProps = {
  label: string
  defaultValue: string
  type?: 'text' | 'email' | 'tel'
  textarea?: boolean
  rows?: number
}

function ResumeTextField({
  label,
  defaultValue,
  type = 'text',
  textarea = false,
  rows = 4,
}: ResumeTextFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
        {label}
      </span>

      {textarea ? (
        <textarea
          defaultValue={defaultValue}
          rows={rows}
          className="textarea ghost-field w-full resize-none rounded-xl border-(--outline-variant)/15 bg-(--surface-container-lowest) px-4 py-3"
        />
      ) : (
        <input
          type={type}
          defaultValue={defaultValue}
          className="input ghost-field h-12 w-full rounded-xl border-(--outline-variant)/15 bg-(--surface-container-lowest) px-4"
        />
      )}
    </label>
  )
}

export default ResumeTextField
