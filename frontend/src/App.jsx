import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StatisticPage from './pages/StatisticPage.jsx';
import Layout from './components/Layout.jsx';
import authService from './services/authService.js';
import WarehousePage from './pages/WarehousePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AddEditProductPage from './pages/AddEditProductPage.jsx';
import SalesPage from './pages/SalesPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import SupplierPage from './pages/SupplierPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.whoami()
        setUser(data.identities?.[0]?.identity_data)
        const valid = data !== null
        setIsAuthenticated(valid);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {/* Default redirect to login if not authenticated */}
      <Route path="/" element={<Navigate to="/landingPage" />} />

      {/* Pages */}
      <Route path="/landingPage" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={isAuthenticated ? (<Layout user={user}><Dashboard user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/statistic" element={isAuthenticated ? (<Layout user={user}><StatisticPage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/warehouse" element={isAuthenticated ? (<Layout user={user}><WarehousePage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/product/:id" element={isAuthenticated ? (<Layout user={user}><ProductDetailPage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/product/add" element={isAuthenticated ? (<Layout user={user}><AddEditProductPage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/product/edit/:id" element={isAuthenticated ? (<Layout user={user}><AddEditProductPage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/sales" element={isAuthenticated ? (<Layout user={user}><SalesPage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/report" element={isAuthenticated ? (<Layout user={user}><ReportPage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/supplier" element={isAuthenticated ? (<Layout user={user}><SupplierPage/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/settings" element={isAuthenticated ? (<Layout user={user}><SettingsPage/></Layout>) : <Navigate to="/login" replace/>} />

      {/* Fallback 404 */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
