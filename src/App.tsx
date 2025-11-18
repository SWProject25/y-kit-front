import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import MainPage from './pages/MainPage'
import LoginPage from "./pages/LoginPage"
import PolicyListPage from './pages/PolicyListPage'
import PolicyDetailsPage from './pages/PolicyDetailsPage'
import AffordableMapPage from './pages/AffordableMapPage'
import GroupPurchasePage from './pages/GroupPurchasePage'
import GroupPurchaseDetailsPage from './pages/GroupPurchaseDetailsPage'
import CommunityPage from './pages/CommunityPage'
import CommunityDetailsPage from './pages/CommunityDetailsPage'
import HotDealsPage from './pages/HotDealsPage'
import HotDealDetailsPage from './pages/HotDealDetailsPage'
import SignUpPage from "./pages/SignUpPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/policies" element={<PolicyListPage />} />
          <Route path="/policies/:id" element={<ProtectedRoute><PolicyDetailsPage /></ProtectedRoute>} />
          <Route path="/map" element={<AffordableMapPage />} />
          <Route path="/group-purchase" element={<ProtectedRoute><GroupPurchasePage /></ProtectedRoute>} />
          <Route path="/group-purchase/:id" element={<ProtectedRoute><GroupPurchaseDetailsPage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/community/:id" element={<ProtectedRoute><CommunityDetailsPage /></ProtectedRoute>} />
          <Route path="/hot-deals" element={<ProtectedRoute><HotDealsPage /></ProtectedRoute>} />
          <Route path="/hot-deals/:id" element={<ProtectedRoute><HotDealDetailsPage /></ProtectedRoute>} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App