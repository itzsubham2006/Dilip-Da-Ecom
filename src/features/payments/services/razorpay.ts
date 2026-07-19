export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openRazorpayCheckout(options: {
  key: string;
  amount: number;
  currency?: string;
  name: string;
  description?: string;
  orderId?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  onFailure: (error: string) => void;
}) {
  const rzp = new (window as any).Razorpay({
    key: options.key,
    amount: options.amount,
    currency: options.currency ?? 'INR',
    name: options.name,
    description: options.description ?? '',
    order_id: options.orderId,
    prefill: options.prefill ?? {},
    handler(response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss() {
        options.onFailure('Payment cancelled');
      },
    },
  });
  rzp.open();
}
