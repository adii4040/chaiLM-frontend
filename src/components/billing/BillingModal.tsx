import React, { useState, useEffect } from 'react';
import { X, CreditCard, AlertTriangle, CheckCircle, Loader2, Calendar, Sparkles } from 'lucide-react';
import { useBillingDetails } from '../../modules/billing/query/useBillingDetails';
import { useCancelSubscription } from '../../modules/billing/mutation/useCancelSubscription';
import { colors, serif, mono } from '../landing/tokens';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpgrade?: () => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({
  isOpen,
  onClose,
  onOpenUpgrade,
}) => {
  const { data: billingData, isLoading } = useBillingDetails(isOpen);
  const { mutateAsync: cancelSubscription, isPending: isCancelling } = useCancelSubscription();

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const billing = billingData?.billing;
  const isPaid = (billing?.plan === 'pro_monthly' || billing?.plan === 'standard_monthly') && (billing?.status === 'active' || billing?.status === 'authenticated');
  const isPro = billing?.plan === 'pro_monthly';
  const isStandard = billing?.plan === 'standard_monthly';
  const isCancelled = billing?.cancelAtCycleEnd;

  const handleCancel = async () => {
    try {
      setErrorMessage(null);
      await cancelSubscription();
      setSuccessMessage('Your subscription has been scheduled for cancellation at the end of the billing cycle.');
      setConfirmCancel(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not cancel subscription. Please try again.');
    }
  };

  const formattedEndDate = billing?.currentEnd
    ? new Date(billing.currentEnd).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const displayPrice = billing?.amount
    ? `₹${(billing.amount / 100).toFixed(0)} / month`
    : isPro
    ? '₹199 / month'
    : isStandard
    ? '₹99 / month'
    : 'Free Tier';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E4E1] flex flex-col"
        style={{ background: colors.surface }}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#E2E4E1]">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs"
              style={{ background: isPaid ? colors.verified : colors.cobalt }}
            >
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#14171A]" style={serif}>
                Billing & Subscription
              </h3>
              <p className="text-xs text-[#5C6169]">
                Manage your plan, renewals, and payment status.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5C6169] hover:text-[#14171A] hover:bg-[#F0F1EE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#1F7A5C]" />
              <span className="text-xs text-[#5C6169]">Loading billing details...</span>
            </div>
          ) : (
            <>
              {/* Plan Status Banner */}
              <div
                className="p-4 rounded-xl border flex items-center justify-between"
                style={{
                  background: isPaid ? colors.verifiedSoft : colors.surface2,
                  borderColor: isPaid ? colors.verifiedBorder : colors.hairline,
                }}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#14171A]" style={serif}>
                      {billing?.planName || (isPro ? 'ChaiLM Pro' : isStandard ? 'ChaiLM Standard' : 'Free Tier')}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        isPaid
                          ? isCancelled
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : 'text-[#1F7A5C] bg-white border-[#1F7A5C]/20'
                          : 'text-[#5C6169] bg-white border-[#E2E4E1]'
                      }`}
                      style={mono}
                    >
                      {isCancelled ? 'Cancels at Cycle End' : isPaid ? 'Active' : 'Free'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6169] mt-0.5">
                    {displayPrice}
                  </p>
                </div>

                {!isPaid && onOpenUpgrade && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenUpgrade();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white cursor-pointer"
                    style={{ background: colors.verified }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Upgrade</span>
                  </button>
                )}
              </div>

              {/* Renewal / Expiry Date */}
              {isPaid && formattedEndDate && (
                <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-[#FAFBF9] border border-[#E2E4E1] text-xs text-[#14171A]">
                  <Calendar className="w-4 h-4 text-[#5C6169] shrink-0" />
                  <div>
                    <span className="text-[#5C6169]">
                      {isCancelled ? 'Access expires on: ' : 'Next renewal date: '}
                    </span>
                    <strong className="text-[#14171A]">{formattedEndDate}</strong>
                  </div>
                </div>
              )}

              {/* Notice for Cancelled Subscription */}
              {isCancelled && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Cancellation Scheduled:</strong> You have full Pro access until{' '}
                    <strong>{formattedEndDate}</strong>. Your card will not be charged again.
                  </div>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Cancel Confirmation Prompt */}
              {isPro && !isCancelled && (
                <div className="pt-2">
                  {confirmCancel ? (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
                      <p className="text-xs text-red-800">
                        Are you sure you want to cancel your subscription? You will retain access to
                        ChaiLM Pro until <strong>{formattedEndDate}</strong>.
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleCancel}
                          disabled={isCancelling}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Cancelling...</span>
                            </>
                          ) : (
                            <span>Confirm Cancellation</span>
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmCancel(false)}
                          disabled={isCancelling}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#5C6169] hover:bg-red-100/50 cursor-pointer"
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="text-xs text-red-600 hover:text-red-700 hover:underline cursor-pointer font-medium"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#FAFBF9] border-t border-[#E2E4E1] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#5C6169] hover:bg-[#F0F1EE] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
