import SharedTextField from '../shared/form/SharedTextField'

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
    <SharedTextField
      label={label}
      defaultValue={value}
      placeholder={placeholder}
      type={type}
      prefix={prefix}
    />
  )
}

export default ProfileTextField
