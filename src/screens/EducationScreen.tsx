import EducationFormPane from '../components/education/EducationFormPane'
import EducationListPane from '../components/education/EducationListPane'
import EducationTopNav from '../components/education/EducationTopNav'
import ScreenHeader from '../components/shared/layout/ScreenHeader'
import AppFooter from '../components/shared/navigation/AppFooter'

function EducationScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-(--surface) text-(--on-surface)">
      <EducationTopNav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ScreenHeader
          title="Academic History"
          description="Manage your academic achievements and credentials to optimize your career trajectory."
        />

        <div className="grid grid-cols-12 items-start gap-8">
          <EducationListPane />
          <EducationFormPane />
        </div>
      </main>

      <AppFooter />
    </div>
  )
}

export default EducationScreen
