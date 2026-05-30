import React from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import CheckoutFlow from '../components/CheckoutFlow.tsx';
import OrderSummary from '../components/OrderSummary.tsx';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-red selection:text-brand-dark">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-8">
            <CheckoutFlow />
          </div>
          
          <div className="col-span-12 lg:col-span-4">
            <OrderSummary />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
