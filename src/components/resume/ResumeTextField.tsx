import SharedTextField from '../shared/form/SharedTextField'

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
    <SharedTextField
      label={label}
      defaultValue={defaultValue}
      type={type}
      textarea={textarea}
      rows={rows}
    />
  )
}

export default ResumeTextField
