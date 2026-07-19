'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, CreditCard, Banknote, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { loadRazorpayScript, openRazorpayCheckout } from '@/features/payments/services/razorpay';

const paymentMethods = [
  { id: 'razorpay', label: 'Pay with Razorpay', desc: 'Credit/Debit card, UPI, Net Banking', icon: CreditCard },
  { id: 'bnpl', label: 'Ethics Pay BNPL', desc: 'Pay in 15 days. Zero interest. ₹5,000 limit', icon: ShieldCheck },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your food arrives', icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const store = useCartStore();
  const { items, subtotal, deliveryFee, taxAmount, total, clearCart } = store;
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const razorpayKey = typeof window !== 'undefined' ? (window as any).NEXT_PUBLIC_RAZORPAY_KEY_ID : null;

  if (items.length === 0) {
    return (
      <div className="page-pad">
        <div className="container-z mx-auto max-w-xl text-center py-16">
          <h1 className="text-2xl font-bold text-ztext">Your bag is empty</h1>
          <p className="text-ztext-light mt-2">Add items before checking out.</p>
          <Link href="/" className="button-z button-z-primary mt-6">View menu</Link>
        </div>
      </div>
    );
  }

  async function handlePlaceOrder() {
    setError('');
    if (!address.trim()) { setError('Please enter your delivery address'); return; }
    setPlacing(true);

    if (paymentMethod === 'razorpay') {
      const loaded = await loadRazorpayScript();
      if (!loaded || !razorpayKey) {
        await new Promise((r) => setTimeout(r, 1000));
        clearCart();
        router.push('/order/confirmed');
        return;
      }
      openRazorpayCheckout({
        key: razorpayKey,
        amount: total() * 100,
        name: 'Dilip Da',
        description: 'Food order',
        onSuccess: () => { clearCart(); router.push('/order/confirmed'); },
        onFailure: (err) => { setError(err); setPlacing(false); },
      });
      return;
    }

    await new Promise((r) => setTimeout(r, 1000));
    clearCart();
    router.push('/order/confirmed');
  }

  return (
    <div className="page-pad">
      <div className="container-z mx-auto max-w-4xl">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-ztext-light hover:text-zred mb-4">
          <ArrowLeft size={14} /> Back to bag
        </Link>
        <h1 className="text-2xl font-bold text-ztext mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-z p-6">
              <h2 className="font-bold text-ztext mb-4 flex items-center gap-2"><MapPin size={18} style={{ color: '#E23744' }} /> Delivery address</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-ztext-light font-medium">Street / Area</label>
                  <input className="input-z mt-1" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Sector V, Salt Lake" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-ztext-light font-medium">City</label>
                    <input className="input-z mt-1" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="w-28">
                    <label className="text-xs text-ztext-light font-medium">Pincode</label>
                    <input className="input-z mt-1" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="700091" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-z p-6">
              <h2 className="font-bold text-ztext mb-4 flex items-center gap-2"><CreditCard size={18} style={{ color: '#E23744' }} /> Payment method</h2>
              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      paymentMethod === pm.id ? 'border-[#E23744] bg-red-50' : 'border-zborder hover:border-ztext-light'
                    }`}>
                    <pm.icon size={20} className="mt-0.5 shrink-0" style={{ color: paymentMethod === pm.id ? '#E23744' : '#9C9C9C' }} />
                    <div>
                      <p className="font-semibold text-ztext text-sm">{pm.label}</p>
                      <p className="text-xs text-ztext-light mt-0.5">{pm.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-z p-6">
              <h2 className="font-bold text-ztext mb-2">Delivery notes (optional)</h2>
              <textarea className="input-z h-20 resize-none mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-z p-6 sticky top-24">
              <h2 className="font-bold text-ztext mb-4">Order summary</h2>
              <p className="text-sm text-ztext-light mb-3">Dilip Da • {items.length} item{items.length > 1 ? 's' : ''}</p>
              <div className="space-y-2 max-h-36 overflow-y-auto text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-ztext truncate mr-2">{item.quantity}x {item.name}</span>
                    <span className="font-medium text-ztext shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zborder mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-ztext-light"><span>Subtotal</span><span className="font-medium text-ztext">₹{subtotal()}</span></div>
                <div className="flex justify-between text-ztext-light"><span>Delivery fee</span><span className="font-medium text-ztext">{deliveryFee() > 0 ? `₹${deliveryFee()}` : 'Free'}</span></div>
                <div className="flex justify-between text-ztext-light"><span>Tax</span><span className="font-medium text-ztext">₹{taxAmount()}</span></div>
                <div className="border-t border-zborder pt-3 flex justify-between font-bold text-ztext text-base"><span>Total</span><span>₹{total()}</span></div>
              </div>
              {error && <p className="text-xs mt-2" style={{ color: '#E23744' }}>{error}</p>}
              <button onClick={handlePlaceOrder} disabled={placing || !address.trim()} className="button-z button-z-primary w-full mt-5 h-11 text-sm font-bold" style={{ opacity: (!address.trim() && !placing) ? 0.6 : 1 }}>
                {placing ? 'Processing...' : `Place order • ₹${total()}`}
              </button>
              <p className="text-xs text-ztext-lighter text-center mt-3">By placing this order, you agree to our Terms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
