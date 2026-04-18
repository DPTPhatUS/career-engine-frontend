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
    <label className="fieldset w-full gap-2">
      <span className="label">
        {label}
      </span>

      {textarea ? (
        <textarea
          defaultValue={defaultValue}
          rows={rows}
          placeholder={placeholder}
          className="textarea textarea-bordered w-full text-base"
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
            className={`input input-bordered h-12 w-full text-base ${prefix ? 'pl-24' : ''}`}
          />
        </div>
      )}
    </label>
  )
}

export default SharedTextField
