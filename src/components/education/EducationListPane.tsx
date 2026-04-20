import EducationCard, { type EducationItem } from './EducationCard'

type EducationListPaneProps = {
  educations: EducationItem[]
  deletingId: string | null
  onEdit: (item: EducationItem) => void
  onDelete: (item: EducationItem) => void
}

function EducationListPane({ educations, deletingId, onEdit, onDelete }: EducationListPaneProps) {
  if (educations.length === 0) {
    return (
      <div className="lg:col-span-7">
        <div className="card border border-dashed border-base-300 bg-base-100">
          <div className="card-body">
            <h3 className="text-lg font-semibold">No education entries yet</h3>
            <p className="text-sm opacity-70">
              Add your first education record in the editor pane.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 lg:col-span-7">
      {educations.map((item) => (
        <EducationCard
          key={item.id}
          item={item}
          isDeleting={deletingId === item.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default EducationListPane
