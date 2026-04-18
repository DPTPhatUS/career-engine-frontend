type ScreenHeaderProps = {
  title: string
  description: string
  className?: string
  descriptionClassName?: string
}

function ScreenHeader({
  title,
  description,
}: ScreenHeaderProps) {
  return (
    <div className="hero place-items-start">
      <div className="hero-content">
        <div>
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="py-6">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScreenHeader
