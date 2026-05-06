import CompanyCard from './CompanyCard'
import type { CompanyItem } from './CompanyCard.types'

type CompaniesListPaneProps = {
  companies: CompanyItem[]
  selectedId?: string | null
  deletingId: string | null
  onEdit: (item: CompanyItem) => void
  onDelete: (item: CompanyItem) => void
}

function CompaniesListPane({ companies, selectedId, deletingId, onEdit, onDelete }: CompaniesListPaneProps) {
  if (companies.length === 0) {
    return (
      <section className="lg:col-span-7">
        <div className="card border border-dashed border-base-300 bg-base-100">
          <div className="card-body">
            <h3 className="text-lg font-semibold">No companies yet</h3>
            <p className="text-sm opacity-70">Add your first company in the editor pane.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8 lg:col-span-7">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          item={company}
          isSelected={selectedId === company.id}
          isDeleting={deletingId === company.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default CompaniesListPane
