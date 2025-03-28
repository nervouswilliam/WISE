import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './routes/Login/LoginPage';
import Dashboard from './routes/Dashboard/DashboardPage';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Header from './routes/components/Header';
import { useContext } from 'react';
import { NotificationProvider } from './routes/helper/NotificationProvider';
import Product from './routes/Product/ProductPage';
import Supplier from './routes/Supplier/SupplierPage';
import Report from './routes/Report/ReportPage';
import ProductDetailPage from './routes/Product/detail/ProductDetailPage';
import NotFoundPage from './routes/NotFoundPage';
import { ProductEditPage } from './routes/Product/Edit/ProductEditPage';
import SignUpPage from './routes/Signup/SignupPage';
// import { Box } from '@mui/material';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </NotificationProvider>
  );
}

function AppContent() {
  const { isAuthenticated, user } = useContext(AuthContext);
  return (
    <>
      {/* Render Header only when logged in */}
      {isAuthenticated && user? (<Header username={user.username} role={user.role} profilePic={user.image} />):null}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
        <Route path="/product/edit/:id" element={<ProtectedRoute><ProductEditPage /></ProtectedRoute>} />
        <Route path="/supplier" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </>
  );
}

export default App;
