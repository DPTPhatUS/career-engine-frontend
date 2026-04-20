import { Navigate, Route, Routes } from 'react-router-dom'
import EducationScreen from './screens/EducationScreen.tsx'
import HomeScreen from './screens/HomeScreen.tsx'
import LoginScreen from './screens/LoginScreen.tsx'
import ProfileScreen from './screens/ProfileScreen.tsx'
import ProjectsScreen from './screens/ProjectsScreen.tsx'
import ResumeScreen from './screens/ResumeScreen.tsx'
import RequireAuth from './components/shared/navigation/RequireAuth.tsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route
        path="/home"
        element={(
          <RequireAuth>
            <HomeScreen />
          </RequireAuth>
        )}
      />
      <Route
        path="/profile"
        element={(
          <RequireAuth>
            <ProfileScreen />
          </RequireAuth>
        )}
      />
      <Route
        path="/education"
        element={(
          <RequireAuth>
            <EducationScreen />
          </RequireAuth>
        )}
      />
      <Route
        path="/projects"
        element={(
          <RequireAuth>
            <ProjectsScreen />
          </RequireAuth>
        )}
      />
      <Route path="/resume" element={<ResumeScreen />} />

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
