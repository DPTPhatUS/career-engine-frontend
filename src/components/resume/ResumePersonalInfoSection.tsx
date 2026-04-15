import { CircleAlert } from 'lucide-react'
import ResumeTextField from './ResumeTextField'

function ResumePersonalInfoSection() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResumeTextField label="First Name" defaultValue="Alexander" />
        <ResumeTextField label="Last Name" defaultValue="Sterling" />
      </div>

      <ResumeTextField
        label="Professional Headline"
        defaultValue="Senior Full-Stack Engineer and Product Strategist"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResumeTextField label="Email Address" type="email" defaultValue="alex.sterling@dev.io" />
        <ResumeTextField label="Phone Number" type="tel" defaultValue="+1 (555) 234-8901" />
      </div>

      <ResumeTextField
        label="Professional Summary"
        textarea
        rows={5}
        defaultValue="Results-driven Software Engineer with over 8 years of experience building scalable web applications. Expert in React, Node.js, and Cloud Infrastructure. Passionate about precision functionalism in UI/UX."
      />

      <div className="flex items-start gap-3 rounded-xl bg-primary/10 px-4 py-4">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-primary">
          Use active verbs like \"Architected\" or \"Spearheaded\" to highlight leadership.
        </p>
      </div>
    </section>
  )
}

export default ResumePersonalInfoSection
