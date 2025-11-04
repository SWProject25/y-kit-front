import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import PolicyListPage from './pages/PolicyListPage'
import PolicyDetailsPage from './pages/PolicyDetailsPage'
import AffordableMapPage from './pages/AffordableMapPage'
import GroupPurchasePage from './pages/GroupPurchasePage'
import GroupPurchaseDetailsPage from './pages/GroupPurchaseDetailsPage'
import CommunityPage from './pages/CommunityPage'
import CommunityDetailsPage from './pages/CommunityDetailsPage'
import HotDealsPage from './pages/HotDealsPage'
import HotDealDetailsPage from './pages/HotDealDetailsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/policies" element={<PolicyListPage />} />
        <Route path="/policies/:id" element={<PolicyDetailsPage />} />
        <Route path="/map" element={<AffordableMapPage />} />
        <Route path="/group-purchase" element={<GroupPurchasePage />} />
        <Route path="/group-purchase/:id" element={<GroupPurchaseDetailsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:id" element={<CommunityDetailsPage />} />
        <Route path="/hot-deals" element={<HotDealsPage />} />
        <Route path="/hot-deals/:id" element={<HotDealDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App