type ProfileSectionHeadingProps = {
  title: string
  accentClass: string
}

function ProfileSectionHeading({ title, accentClass }: ProfileSectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className={`h-10 w-1 rounded-full ${accentClass}`} />
      <h3 className="text-lg font-bold uppercase tracking-widest text-(--on-surface-variant)">
        {title}
      </h3>
    </div>
  )
}

export default ProfileSectionHeading
