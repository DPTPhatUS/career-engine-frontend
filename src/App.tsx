import { Navigate, Route, Routes } from 'react-router-dom'
import EducationScreen from './screens/EducationScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProjectsScreen from './screens/ProjectsScreen'
import ResumeScreen from './screens/ResumeScreen'

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
