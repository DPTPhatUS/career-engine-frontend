type ProfileTextFieldProps = {
  label: string
  value: string
  placeholder: string
  type?: 'text' | 'email' | 'tel'
  prefix?: string
  textarea?: boolean
  rows?: number
}

function ProfileTextField({
  label,
  value,
  placeholder,
  type = 'text',
  prefix,
  textarea = false,
  rows = 4,
}: ProfileTextFieldProps) {
  const fieldId = `profile-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <fieldset className="fieldset w-full gap-2">
      <legend className="fieldset-legend uppercase tracking-[0.12em] text-(--on-surface-variant)">
        {label}
      </legend>

      {textarea ? (
        <textarea
          id={fieldId}
          defaultValue={value}
          rows={rows}
          placeholder={placeholder}
          className="textarea w-full resize-none"
        />
      ) : prefix ? (
        <label className="input w-full">
          <span className="text-sm text-(--on-surface-variant)">
            {prefix}
          </span>
          <input
            id={fieldId}
            type={type}
            placeholder={placeholder}
            defaultValue={value}
            className="grow"
          />
        </label>
      ) : (
        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          className="input w-full"
        />
      )}
    </fieldset>
  )
}

export default ProfileTextField
