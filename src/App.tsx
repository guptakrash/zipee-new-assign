import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext'
import Home from './pages/Home'
import Login from './components/Login/Login'

const AppContent = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Home /> : <Login />
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <RecentlyViewedProvider>
            <AppContent />
          </RecentlyViewedProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

