import { Navigate, Route, Routes } from 'react-router-dom'
import EducationScreen from './screens/EducationScreen.tsx'
import HomeScreen from './screens/HomeScreen.tsx'
import LoginScreen from './screens/LoginScreen.tsx'
import ProfileScreen from './screens/ProfileScreen.tsx'
import ProjectsScreen from './screens/ProjectsScreen.tsx'
import ResumeScreen from './screens/ResumeScreen.tsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/education" element={<EducationScreen />} />
      <Route path="/projects" element={<ProjectsScreen />} />
      <Route path="/resume" element={<ResumeScreen />} />

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
