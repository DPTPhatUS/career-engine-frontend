import EducationFooter from '../components/education/EducationFooter'
import EducationFormPane from '../components/education/EducationFormPane'
import EducationHeader from '../components/education/EducationHeader'
import EducationListPane from '../components/education/EducationListPane'
import EducationMobileBottomNav from '../components/education/EducationMobileBottomNav'
import EducationTopNav from '../components/education/EducationTopNav'

function EducationScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <EducationTopNav />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 pb-28 md:pb-12">
        <EducationHeader />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <EducationListPane />
          <EducationFormPane />
        </div>
      </main>

      <EducationFooter />
      <EducationMobileBottomNav />
    </div>
  )
}

export default EducationScreen
