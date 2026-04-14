type SharedTextFieldProps = {
  label: string
  defaultValue: string
  placeholder?: string
  type?: 'text' | 'email' | 'tel'
  prefix?: string
  textarea?: boolean
  rows?: number
}

function SharedTextField({
  label,
  defaultValue,
  placeholder,
  type = 'text',
  prefix,
  textarea = false,
  rows = 4,
}: SharedTextFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-(--on-surface-variant)">
        {label}
      </span>

      {textarea ? (
        <textarea
          defaultValue={defaultValue}
          rows={rows}
          placeholder={placeholder}
          className="ghost-field w-full resize-none rounded-xl px-4 py-3"
        />
      ) : (
        <div className="relative">
          {prefix ? (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--on-surface-variant) opacity-70">
              {prefix}
            </span>
          ) : null}

          <input
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={`ghost-field h-12 w-full rounded-xl px-4 ${prefix ? 'pl-23' : ''}`}
          />
        </div>
      )}
    </label>
  )
}

export default SharedTextField
