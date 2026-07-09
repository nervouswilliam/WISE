import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { hasRouteAccess, ROLE_DEFAULT_PATH } from './utils/roleAccess.js';

// Wraps every authenticated page: bounces to /login if not signed in, and to the role's
// default page if this role isn't allowed to see the current path (UI-only gating - see
// utils/roleAccess.js for the caveat that this isn't backed by RLS).
function ProtectedRoute({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRouteAccess(user?.role, location.pathname)) {
    return <Navigate to={ROLE_DEFAULT_PATH[user?.role] || '/dashboard'} replace />;
  }
  return <Layout user={user}>{children}</Layout>;
}

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

  const protect = (element) => (
    <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>{element}</ProtectedRoute>
  );

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
      <Route path="/dashboard" element={protect(<Dashboard user={user}/>)} />
      <Route path="/statistic" element={protect(<StatisticPage user={user}/>)} />
      <Route path="/forecast" element={protect(<SalesForecastPage user={user}/>)} />
      <Route path="/warehouse" element={protect(<WarehousePage user={user}/>)} />
      <Route path="/product/:id" element={protect(<ProductDetailPage user={user}/>)} />
      <Route path="/product/add" element={protect(<AddEditProductPage user={user}/>)} />
      <Route path="/product/stock-add/:id" element={protect(<AddProductStockPage user={user}/>)} />
      <Route path="/product/edit/:id" element={protect(<AddEditProductPage user={user}/>)} />
      <Route path="/sales" element={protect(<SalesPage user={user}/>)} />
      <Route path="/report" element={protect(<ReportPage user={user}/>)} />
      <Route path="/report/:id" element={protect(<ReportDetailPage user={user}/>)} />
      <Route path="/supplier" element={protect(<SupplierPage user={user}/>)} />
      <Route path="/supplier/add" element={protect(<AddEditSupplierPage user={user}/>)} />
      <Route path="/supplier/edit/:id" element={protect(<AddEditSupplierPage user={user}/>)} />
      <Route path="/supplier/:id" element={protect(<SupplierDetailPage user={user}/>)} />
      <Route path="/settings" element={protect(<SettingsPage user={user}/>)} />
      <Route path="/team" element={protect(<TeamPage user={user}/>)} />
      <Route path="/order" element={protect(<OrderPage user={user}/>)} />
      <Route path="/order/:id" element={protect(<OrderDetailPage user={user}/>)} />
      <Route path="/notifications" element={protect(<NotificationPage user={user}/>)} />
      <Route path="/expenses" element={protect(<ExpensePage user={user}/>)} />
      <Route path="/reset-password" element={<LightModeShell><ResetPasswordPage /></LightModeShell>} />


      {/* Fallback 404 */}
      <Route path="*" element={<LightModeShell><NotFoundPage /></LightModeShell>} />
    </Routes>
  );
}

export default App;
