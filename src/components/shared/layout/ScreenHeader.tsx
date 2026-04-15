type ScreenHeaderProps = {
  title: string
  description: string
  className?: string
  descriptionClassName?: string
}

function ScreenHeader({
  title,
  description,
  className = 'mb-10',
  descriptionClassName = 'mt-2 max-w-2xl text-lg text-(--on-surface-variant)',
}: ScreenHeaderProps) {
  return (
    <header className={className}>
      <h1 className="text-5xl font-extrabold tracking-[-0.02em] text-(--on-surface)">{title}</h1>
      <p className={descriptionClassName}>{description}</p>
    </header>
  )
}

export default ScreenHeader
