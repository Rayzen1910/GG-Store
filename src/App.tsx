/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.tsx';
import HomePage from './pages/HomePage.tsx';
import CatalogPage from './pages/CatalogPage.tsx';
import ProductPage from './pages/ProductPage.tsx';
import CartPage from './pages/CartPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import AccountPage from './pages/AccountPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AiAssistant from './components/AiAssistant.tsx';
import SupportPage from './pages/SupportPage.tsx';

import { ThemeProvider } from './context/ThemeContext.tsx';
import { AppProvider } from './context/AppContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        <AppProvider>
          <Router>
            <ScrollToTop />
            <CustomCursor />
            <div className="min-h-screen flex flex-col transition-colors duration-300">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/support" element={<SupportPage />} />

                {/* Protected routes — require Supabase session */}
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <AiAssistant />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
