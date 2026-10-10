import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCreateOrder } from '../../modules/billing/mutation/useCreateOrder';
import { useVerifyPayment } from '../../modules/billing/mutation/useVerifyPayment';
import type { RazorpayOrderSuccessResponse } from '../../modules/billing/dto/billingDto';

export interface RazorpayCheckoutButtonProps {
  amountInPaise: number; // e.g. 50000 = ₹500
  currency?: string;
  notes?: Record<string, any>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  productName?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (response: { payment_id: string; order_id: string; signature: string }) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayCheckoutButton: React.FC<RazorpayCheckoutButtonProps> = ({
  amountInPaise,
  currency = 'INR',
  notes = {},
  prefill,
  productName = 'ChaiLM Credit Pack',
  description = 'One-time Standard Payment',
  buttonText,
  className = '',
  onSuccess,
  onFailure,
  onDismiss,
}) => {
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const [checkoutState, setCheckoutState] = useState<'idle' | 'opening' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedPrice = `₹${(amountInPaise / 100).toLocaleString('en-IN')}`;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setErrorMessage(null);
    setCheckoutState('opening');

    try {
      // 1. Ensure Razorpay SDK script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Could not load Razorpay Checkout SDK. Please check your internet connection.');
      }

      // 2. Step 1: Call Backend to create order (POST /api/create-order)
      const orderData = await createOrder({
        amount: amountInPaise,
        currency,
        notes,
      });

      const orderId = orderData.order_id || orderData.id;
      if (!orderId) {
        throw new Error(orderData.message || 'Failed to create order on server.');
      }

      // 3. Step 2: Open Razorpay Checkout Modal
      const keyId =
        import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key;

      if (!keyId) {
        throw new Error('Razorpay Key ID is not configured.');
      }

      const options = {
        key: keyId,
        amount: orderData.amount || amountInPaise,
        currency: orderData.currency || currency,
        name: productName,
        description,
        order_id: orderId,
        prefill: {
          name: prefill?.name || '',
          email: prefill?.email || '',
          contact: prefill?.contact || '',
        },
        theme: {
          color: '#1F7A5C', // ChaiLM verified emerald green brand color
        },
        modal: {
          ondismiss: () => {
            setCheckoutState('idle');
            if (onDismiss) onDismiss();
          },
        },
        handler: async (response: RazorpayOrderSuccessResponse) => {
          // Step 3: Call Backend to verify signature (POST /api/verify-payment)
          try {
            setCheckoutState('verifying');
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setCheckoutState('success');
              if (onSuccess) {
                onSuccess({
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                });
              }
              setTimeout(() => {
                setCheckoutState('idle');
              }, 3000);
            } else {
              throw new Error(verifyRes.message || 'Signature verification failed.');
            }
          } catch (verifyErr: any) {
            console.error('Payment verification error:', verifyErr);
            setCheckoutState('error');
            const msg = verifyErr?.message || 'Payment signature verification failed.';
            setErrorMessage(msg);
            if (onFailure) onFailure(verifyErr);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure event
      rzp.on('payment.failed', (failResponse: any) => {
        console.error('Razorpay payment.failed:', failResponse);
        setCheckoutState('error');
        const desc =
          failResponse.error?.description ||
          failResponse.error?.reason ||
          'Payment process failed or was declined.';
        setErrorMessage(desc);
        if (onFailure) onFailure(failResponse.error);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Razorpay Standard Checkout error:', err);
      setCheckoutState('error');
      const errText = err?.message || 'Could not initiate Razorpay checkout.';
      setErrorMessage(errText);
      if (onFailure) onFailure(err);
    }
  };

  const isBusy = isCreatingOrder || isVerifying || checkoutState === 'opening' || checkoutState === 'verifying';

  return (
    <div className="flex flex-col space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isBusy}
        className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          checkoutState === 'success'
            ? 'bg-emerald-600 text-white'
            : checkoutState === 'error'
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-[#1F7A5C] text-white hover:bg-[#18644B]'
        } ${className}`}
      >
        {isBusy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>
              {checkoutState === 'verifying'
                ? 'Verifying Payment...'
                : 'Initializing Checkout...'}
            </span>
          </>
        ) : checkoutState === 'success' ? (
          <>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Paid Successfully!</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>{buttonText || `Pay ${formattedPrice} with Razorpay`}</span>
          </>
        )}
      </button>

      {/* Inline Notifications for user experience */}
      {errorMessage && (
        <div className="flex items-center space-x-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {checkoutState === 'success' && (
        <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Payment verified securely. Thank you!</span>
        </div>
      )}
    </div>
  );
};

export default RazorpayCheckoutButton;
