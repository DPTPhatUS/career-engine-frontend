import { Plus } from 'lucide-react'

function HomeFab() {
  return (
    <div className="tooltip tooltip-left fixed bottom-8 right-8" data-tip="Quick Add Project">
      <button type="button" className="btn btn-circle primary-cta border-0 text-lg font-bold">
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default HomeFab
