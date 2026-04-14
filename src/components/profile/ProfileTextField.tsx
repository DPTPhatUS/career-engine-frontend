type ProfileTextFieldProps = {
  label: string
  value: string
  placeholder: string
  type?: 'text' | 'email' | 'tel'
  prefix?: string
}

function ProfileTextField({
  label,
  value,
  placeholder,
  type = 'text',
  prefix,
}: ProfileTextFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold uppercase tracking-wide text-(--on-surface-variant)">
        {label}
      </span>

      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--on-surface-variant) opacity-60">
            {prefix}
          </span>
        ) : null}

        <input
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          className={`h-12 w-full rounded-xl border border-(--outline-variant)/15 bg-base-200 px-4 font-medium text-(--on-surface) transition-all focus:border-primary focus:outline-none focus:ring-0 ${
            prefix ? 'pl-[92px]' : ''
          }`}
        />
      </div>
    </label>
  )
}

export default ProfileTextField
