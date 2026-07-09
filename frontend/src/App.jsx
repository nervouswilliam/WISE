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
import AddEditSupplierPage from './pages/AddEditSupplierPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import SupplierDetailPage from './pages/SupplierDetailPage.jsx';
import AddProductStockPage from './pages/AddProductStockPage.jsx';
import ReportDetailPage from './pages/ReportDetailPage.jsx';
import NotificationPage from './pages/notificationPage.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import SalesForecastPage from './pages/SalesForecastPage.jsx';
import LightModeShell from './components/LightModeShell.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import teamService from './services/teamService.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.whoami()
        const metadata  = data.user_metadata;
        const authId = data.id;

        // First, silently accept any pending team invite addressed to this person's
        // own verified email - safe to attempt every login, it's a no-op if there isn't one.
        await teamService.acceptPendingInviteIfAny(authId, data.email);

        // Then resolve which business this login should actually operate on: their own
        // (owner), or - if they're active staff on someone else's team - that owner's.
        // Every existing page/service in the app uses `user.id` as the business scope, so
        // resolving it here means nothing downstream needs to change.
        const membership = await teamService.getActiveMembership(authId);

        setUser(
          membership
            ? { ...metadata, id: membership.owner_id, authId, role: membership.role, isStaff: true }
            : { ...metadata, id: authId, authId, role: 'owner', isStaff: false }
        );
        const valid = data !== null
        setIsAuthenticated(valid);
      } catch (err) {
        console.error('Auth check failed:', err);
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
      <Route path="/landingPage" element={<LightModeShell><LandingPage /></LightModeShell>} />
      <Route path="/login" element={<LightModeShell><LoginPage /></LightModeShell>} />
      <Route path="/signup" element={<LightModeShell><SignupPage /></LightModeShell>} />
      <Route path="/terms-of-service" element={<LightModeShell><TermsOfServicePage /></LightModeShell>} />
      <Route path="/privacy-policy" element={<LightModeShell><PrivacyPolicyPage /></LightModeShell>} />
      <Route path="/dashboard" element={isAuthenticated ? (<Layout user={user}><Dashboard user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/statistic" element={isAuthenticated ? (<Layout user={user}><StatisticPage user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/forecast" element={isAuthenticated ? (<Layout user={user}><SalesForecastPage user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/warehouse" element={isAuthenticated ? (<Layout user={user}><WarehousePage user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/product/:id" element={isAuthenticated ? (<Layout user={user}><ProductDetailPage user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/product/add" element={isAuthenticated ? (<Layout user={user}><AddEditProductPage user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/product/stock-add/:id" element={isAuthenticated ? (<Layout user={user}><AddProductStockPage user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/product/edit/:id" element={isAuthenticated ? (<Layout user={user}><AddEditProductPage user = {user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/sales" element={isAuthenticated ? (<Layout user={user}><SalesPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/report" element={isAuthenticated ? (<Layout user={user}><ReportPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/report/:id" element={isAuthenticated ? (<Layout user={user}><ReportDetailPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/supplier" element={isAuthenticated ? (<Layout user={user}><SupplierPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/supplier/add" element={isAuthenticated ? (<Layout user={user}><AddEditSupplierPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/supplier/edit/:id" element={isAuthenticated ? (<Layout user={user}><AddEditSupplierPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/supplier/:id" element={isAuthenticated ? (<Layout user={user}><SupplierDetailPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/settings" element={isAuthenticated ? (<Layout user={user}><SettingsPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/team" element={isAuthenticated ? (<Layout user={user}><TeamPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/order" element={isAuthenticated ? (<Layout user={user}><OrderPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/order/:id" element={isAuthenticated ? (<Layout user={user}><OrderDetailPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/notifications" element={isAuthenticated ? (<Layout user={user}><NotificationPage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/expenses" element={isAuthenticated ? (<Layout user={user}><ExpensePage user={user}/></Layout>) : <Navigate to="/login" replace/>} />
      <Route path="/reset-password" element={<LightModeShell><ResetPasswordPage /></LightModeShell>} />


      {/* Fallback 404 */}
      <Route path="*" element={<LightModeShell><NotFoundPage /></LightModeShell>} />
    </Routes>
  );
}

export default App;
