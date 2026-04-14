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
      <span className="form-label ml-1 block">
        {label}
      </span>

      {textarea ? (
        <textarea
          defaultValue={defaultValue}
          rows={rows}
          placeholder={placeholder}
          className="ghost-field w-full resize-none rounded-xl px-4 py-3 text-base"
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
            className={`ghost-field h-12 w-full rounded-xl px-4 text-base ${prefix ? 'pl-24' : ''}`}
          />
        </div>
      )}
    </label>
  )
}

export default SharedTextField
