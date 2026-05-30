import React, { useState, useEffect } from 'react';
import { CheckCircle2, CreditCard, Wallet, Camera, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';


export default function CheckoutFlow() {
  const { cart, clearCart, addOrder } = useApp();
  const [fullName, setFullName] = useState("John Builder");
  const [email, setEmail] = useState("john@ggstore.com");
  const [phone, setPhone] = useState("+6281234567890");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 2000000 ? 0 : 50000;
  const tax = Math.round(subtotal * 0.11);
  const totalAmount = subtotal + shippingCost + tax;

  useEffect(() => {
    // Load Midtrans Snap JS — always use sandbox URL for sandbox keys
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';
    // Sandbox keys from Midtrans dashboard start with "Mid-client-" (not "SB-")
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';

    let script = document.querySelector(`script[src*="/snap/snap.js"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.src = midtransScriptUrl;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg("");
    setPaymentResult(null);

    // Split name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'John';
    const lastName = nameParts.slice(1).join(' ') || 'Builder';

    try {
      const response = await fetch('/api/midtrans-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount, // Dynamic IDR amount based on cart
          firstName,
          lastName,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize payment.');
      }

      const snapToken = data.token;
      if (!snapToken) {
        throw new Error('No Snap token received from Midtrans API.');
      }

      // Trigger Snap popup
      if ((window as any).snap) {
        (window as any).snap.pay(snapToken, {
          onSuccess: function (result: any) {
            console.log('payment success:', result);
            const orderId = result?.order_id || 'GG-' + Math.round(Math.random() * 10000000) + '-' + Date.now();
            const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            addOrder({
              id: orderId,
              date: dateStr,
              status: 'Delivered',
              total: totalAmount,
              items: cart.reduce((acc, item) => acc + item.quantity, 0),
              details: [...cart]
            });
            clearCart();
            setPaymentResult({ status: 'success', result });
          },
          onPending: function (result: any) {
            console.log('payment pending:', result);
            setPaymentResult({ status: 'pending', result });
          },
          onError: function (result: any) {
            console.error('payment error:', result);
            setPaymentResult({ status: 'error', result });
          },
          onClose: function () {
            console.log('customer closed the popup without finishing the payment');
            setErrorMsg("Payment modal was closed before completion.");
          }
        });
      } else {
        throw new Error('Midtrans Snap SDK not loaded. Check your internet connection.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary border border-border-subtle p-8 text-center space-y-6 rounded-sm"
      >
        <div className="flex justify-center">
          {paymentResult.status === 'success' ? (
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500">
              <CheckCircle2 className="text-green-500 w-10 h-10" />
            </div>
          ) : paymentResult.status === 'pending' ? (
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500">
              <AlertCircle className="text-yellow-500 w-10 h-10 animate-pulse" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center border border-brand-red">
              <AlertCircle className="text-brand-red w-10 h-10" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-text-primary">
            {paymentResult.status === 'success' ? 'Payment Completed!' : 
             paymentResult.status === 'pending' ? 'Payment Pending' : 'Payment Failed'}
          </h2>
          <p className="text-gray-400 font-mono text-xs">
            ORDER ID: {paymentResult.result?.order_id || 'N/A'}
          </p>
        </div>

        <div className="bg-bg-primary/40 border border-border-subtle p-6 rounded-sm text-left font-mono text-xs space-y-2 max-w-md mx-auto">
          <p><span className="text-gray-500">Status Code:</span> {paymentResult.result?.status_code || '200'}</p>
          <p><span className="text-gray-500">Transaction Status:</span> <span className="text-brand-red uppercase font-bold">{paymentResult.result?.transaction_status}</span></p>
          <p><span className="text-gray-500">Payment Type:</span> {paymentResult.result?.payment_type}</p>
          <p><span className="text-gray-500">Amount Paid:</span> Rp {Number(paymentResult.result?.gross_amount || 3800000).toLocaleString('id-ID')}</p>
        </div>

        <button 
          onClick={() => setPaymentResult(null)}
          className="bg-brand-red text-brand-dark font-black py-4 px-10 rounded-sm uppercase tracking-tighter hover:opacity-90 transition-all italic text-sm"
        >
          Return to Checkout
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-red/10 border border-brand-red p-4 rounded-sm flex items-start gap-3"
        >
          <AlertCircle className="text-brand-red w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-brand-red text-sm uppercase tracking-wider font-mono">Payment Error</h4>
            <p className="text-gray-300 text-xs mt-1 font-light leading-relaxed">{errorMsg}</p>
          </div>
        </motion.div>
      )}

      {/* Step 1: Shipping Address */}
      <section className="bg-bg-secondary border border-border-subtle overflow-hidden rounded-sm">
        <div className="bg-bg-primary px-6 py-4 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center font-black text-brand-dark italic">1</span>
            <h2 className="font-black italic text-xl text-text-primary uppercase tracking-tighter">Shipping Address</h2>
          </div>
          <CheckCircle2 className="text-brand-red w-6 h-6" />
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
            <input 
              className="input-field" 
              placeholder="John 'Master' Builder" 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
            <input 
              className="input-field" 
              placeholder="john@ggstore.com" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Phone Number</label>
            <input 
              className="input-field" 
              placeholder="+6281234567890" 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Street Address</label>
            <input className="input-field" placeholder="123 Modular Ave, Piece 4" type="text" defaultValue="123 Modular Ave, Piece 4" />
          </div>
          <div>
            <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">City</label>
            <input className="input-field" placeholder="Lego City" type="text" defaultValue="Lego City" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">State</label>
              <input className="input-field" placeholder="NY" type="text" defaultValue="NY" />
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Zip</label>
              <input className="input-field" placeholder="10001" type="text" defaultValue="10001" />
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Payment Method */}
      <section className="bg-bg-secondary border border-border-subtle overflow-hidden rounded-sm">
        <div className="bg-bg-primary px-6 py-4 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center font-black text-brand-dark italic">2</span>
            <h2 className="font-black italic text-xl text-text-primary uppercase tracking-tighter">Payment Gateway</h2>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <label className="flex items-center justify-between p-6 border border-brand-red bg-brand-red/5 rounded-sm cursor-pointer shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]">
              <div className="flex items-center gap-4">
                <input checked readOnly className="w-5 h-5 accent-brand-red border-white/20 focus:ring-0" name="payment" type="radio" />
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-red" />
                  <span className="font-bold text-text-primary uppercase tracking-tighter text-base">Midtrans Sandbox</span>
                </div>
              </div>
              <span className="font-mono text-[10px] bg-brand-red/10 text-brand-red border border-brand-red/20 px-2 py-1 rounded-sm uppercase font-bold tracking-wider">
                Active Sandbox
              </span>
            </label>
          </div>
          <p className="text-gray-500 text-xs font-mono leading-relaxed mt-2 uppercase tracking-wide">
            Note: Midtrans payment window will launch securely when you click place order.
          </p>
        </div>
      </section>

      {/* Step 3: Review */}
      <section className="bg-bg-secondary border border-border-subtle overflow-hidden rounded-sm">
        <div className="bg-bg-primary px-6 py-4 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center font-black text-text-primary italic">3</span>
            <h2 className="font-black italic text-xl text-text-primary uppercase tracking-tighter">Order Review</h2>
          </div>
        </div>
        
        <div className="p-8">
          <p className="text-gray-500 text-sm mb-8 font-light italic leading-relaxed">By clicking "Confirm Order," you agree to the GG Store terms of service and modular gear agreement.</p>
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            onClick={handlePayment}
            className="w-full bg-brand-red text-brand-dark font-black py-5 px-12 rounded-sm uppercase tracking-tighter transition-all shadow-xl hover:opacity-90 text-lg italic flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Initializing Sandbox...
              </>
            ) : (
              <>
                Confirm & Pay with Midtrans
              </>
            )}
          </motion.button>
        </div>
      </section>
    </div>
  );
}
