import { Plus } from 'lucide-react'

function ProjectsMobileFab() {
  return (
    <button
      type="button"
      className="btn btn-circle primary-cta fixed bottom-6 right-6 z-40 border-0 text-3xl md:hidden"
      aria-label="Add project"
    >
      <Plus className="h-6 w-6" aria-hidden="true" />
    </button>
  )
}

export default ProjectsMobileFab
