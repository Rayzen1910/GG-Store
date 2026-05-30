import React from 'react';
import { Verified } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export default function OrderSummary() {
  const { cart: items } = useApp();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 2000000 ? 0 : 50000;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shippingCost + tax;

  const formatIDR = (amount: number) =>
    'Rp ' + amount.toLocaleString('id-ID');

  return (
    <aside className="sticky top-28 bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden">
      <div className="bg-bg-primary p-6 border-b border-border-subtle">
        <h3 className="font-black italic text-2xl text-text-primary uppercase tracking-tighter">Order Summary</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 items-start pb-6 border-b border-border-subtle last:border-0 last:pb-0">
            <div className="w-20 h-20 bg-bg-primary rounded-sm flex-shrink-0 border border-border-subtle overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-80" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-text-primary leading-tight uppercase tracking-tighter text-sm italic">{item.name}</h4>
                <span className="font-bold text-lg text-text-primary tracking-tighter italic">{formatIDR(item.price)}</span>
              </div>
              <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-widest">{item.color}</p>
              <div className="mt-2 text-[10px] font-mono text-brand-red/80 font-bold uppercase">
                QTY: {item.quantity}
              </div>
            </div>
          </div>
        ))}

        <div className="space-y-3 pt-6 border-t border-border-subtle">
          <div className="flex justify-between text-xs font-mono text-gray-500">
            <span className="uppercase tracking-widest">Subtotal</span>
            <span className="font-bold text-text-primary tracking-tighter">{formatIDR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs font-mono text-gray-500">
            <span className="uppercase tracking-widest">Shipping</span>
            <span className="text-brand-red font-bold tracking-tighter uppercase">
              {shippingCost === 0 ? 'GRATIS' : formatIDR(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between text-xs font-mono text-gray-500">
            <span className="uppercase tracking-widest">PPN (11%)</span>
            <span className="font-bold text-text-primary tracking-tighter">{formatIDR(tax)}</span>
          </div>
          
          <div className="border-t border-border-subtle pt-6 mt-6 flex justify-between items-baseline">
            <span className="font-black italic text-xl uppercase tracking-tighter text-gray-400">Total</span>
            <span className="font-black italic text-3xl text-brand-red tracking-tighter italic">{formatIDR(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-bg-primary/20 p-6 flex items-center gap-3 border-t border-border-subtle">
        <Verified className="text-brand-red w-5 h-5 opacity-50" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-600">Piece-by-piece reliability guaranteed</span>
      </div>
    </aside>
  );
}
