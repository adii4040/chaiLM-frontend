import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Loader2, ShieldCheck, Zap, Lock } from 'lucide-react';
import useCurrentUser from '../../modules/auth/query/useCurrentUser';
import { usePlans } from '../../modules/billing/query/usePlans';
import { useSubscribe } from '../../modules/billing/mutation/useSubscribe';
import { useVerifySubscription } from '../../modules/billing/mutation/useVerifySubscription';
import type { RazorpayPaymentSuccessResponse } from '../../modules/billing/dto/billingDto';
import { colors, serif, mono } from '../landing/tokens';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PlanSelection = 'free' | 'standard_monthly' | 'pro_monthly';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { data: userData } = useCurrentUser();
  const { data: plansData } = usePlans();
  const { mutateAsync: subscribe, isPending: isCreatingSubscription } = useSubscribe();
  const { mutateAsync: verifySubscription, isPending: isVerifying } = useVerifySubscription();

  const [selectedPlanKey, setSelectedPlanKey] = useState<PlanSelection>('pro_monthly');
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'opening' | 'verifying' | 'success' | 'error'>('idle');
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

  const user = userData?.user;
  const currentPlan = user?.plan || 'free';

  const plans = plansData?.plans || [];
  const selectedPlan =
    selectedPlanKey === 'free'
      ? {
        key: 'free',
        name: 'ChaiLM Free',
        amount: 0,
        description: 'Free forever. Essential multi-source research for personal projects.',
      }
      : plans.find((p) => p.key === selectedPlanKey) || {
        key: selectedPlanKey,
        name: selectedPlanKey === 'standard_monthly' ? 'ChaiLM Standard' : 'ChaiLM Pro',
        amount: selectedPlanKey === 'standard_monthly' ? 9900 : 19900,
        description:
          selectedPlanKey === 'standard_monthly'
            ? 'Essential multi-source research for active learners'
            : 'Full power studio suite for heavy research',
      };

  const handleUpgrade = async () => {
    if (selectedPlanKey === 'free') {
      onClose();
      return;
    }

    try {
      setErrorMessage(null);
      setCheckoutStep('opening');

      if (!window.Razorpay) {
        throw new Error('Razorpay Checkout SDK is not loaded. Please refresh the page.');
      }

      // 1. Create subscription on server
      const subResponse = await subscribe({ planKey: selectedPlanKey });
      const subscriptionId = subResponse.subscriptionId;

      if (!subscriptionId) {
        throw new Error('Could not initiate subscription. Please try again.');
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('VITE_RAZORPAY_KEY_ID is missing in client environment.');
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: razorpayKey,
        subscription_id: subscriptionId,
        name: 'ChaiLM',
        description: `${selectedPlan.name} Subscription`,
        handler: async (response: RazorpayPaymentSuccessResponse) => {
          try {
            setCheckoutStep('verifying');
            await verifySubscription({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            });
            setCheckoutStep('success');
            setTimeout(() => {
              onClose();
              setCheckoutStep('idle');
            }, 1800);
          } catch (err: any) {
            setCheckoutStep('error');
            setErrorMessage(err?.message || 'Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setCheckoutStep('idle');
          },
        },
        prefill: {
          name: user?.fullname || '',
          email: user?.email || '',
        },
        theme: {
          color: '#1F7A5C',
        },
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', (response: any) => {
        setCheckoutStep('error');
        setErrorMessage(response.error?.description || 'Payment failed. Please try a different method.');
      });

      rzpInstance.open();
    } catch (err: any) {
      setCheckoutStep('error');
      setErrorMessage(err?.message || 'Something went wrong launching payment.');
    }
  };

  const isBusy = isCreatingSubscription || isVerifying || checkoutStep === 'opening' || checkoutStep === 'verifying';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E2E4E1] flex flex-col"
        style={{ background: colors.surface }}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#E2E4E1]">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs"
              style={{ background: colors.verified }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#14171A]" style={serif}>
                Compare & Choose Your Plan
              </h3>
              <p className="text-xs text-[#5C6169]">
                See what is included in Free vs Standard and Pro tiers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1.5 rounded-full text-[#5C6169] hover:text-[#14171A] hover:bg-[#F0F1EE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Plan Selector 3-Column Tabs */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Free Tier Card */}
            <button
              type="button"
              onClick={() => setSelectedPlanKey('free')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${selectedPlanKey === 'free'
                  ? 'border-[#1F7A5C] bg-[#1F7A5C]/5 shadow-xs ring-2 ring-[#1F7A5C]/20'
                  : 'border-[#E2E4E1] bg-white hover:border-[#CAD1C8]'
                }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#14171A]" style={serif}>
                  Free
                </span>
                <span className="text-xs font-extrabold text-[#14171A] mt-0.5" style={serif}>
                  ₹0<span className="text-[10px] font-normal text-[#5C6169]">/mo</span>
                </span>
              </div>
              <p className="text-[10px] text-[#5C6169] mt-1 line-clamp-2">
                3 Workspaces · 500 Queries
              </p>
            </button>

            {/* Standard Tier Card */}
            <button
              type="button"
              onClick={() => setSelectedPlanKey('standard_monthly')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${selectedPlanKey === 'standard_monthly'
                  ? 'border-[#1F7A5C] bg-[#1F7A5C]/5 shadow-xs ring-2 ring-[#1F7A5C]/20'
                  : 'border-[#E2E4E1] bg-white hover:border-[#CAD1C8]'
                }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#14171A]" style={serif}>
                  Standard
                </span>
                <span className="text-xs font-extrabold text-[#14171A] mt-0.5" style={serif}>
                  ₹99<span className="text-[10px] font-normal text-[#5C6169]">/mo</span>
                </span>
              </div>
              <p className="text-[10px] text-[#5C6169] mt-1 line-clamp-2">
                10 Workspaces · 1,200 Queries
              </p>
            </button>

            {/* Pro Tier Card */}
            <button
              type="button"
              onClick={() => setSelectedPlanKey('pro_monthly')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${selectedPlanKey === 'pro_monthly'
                  ? 'border-[#1F7A5C] bg-[#1F7A5C]/5 shadow-xs ring-2 ring-[#1F7A5C]/20'
                  : 'border-[#E2E4E1] bg-white hover:border-[#CAD1C8]'
                }`}
            >
              <div
                className="absolute -top-2.5 right-1.5 bg-[#1F7A5C] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                style={mono}
              >
                Best
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#14171A]" style={serif}>
                  Pro
                </span>
                <span className="text-xs font-extrabold text-[#14171A] mt-0.5" style={serif}>
                  ₹199<span className="text-[10px] font-normal text-[#5C6169]">/mo</span>
                </span>
              </div>
              <p className="text-[10px] text-[#5C6169] mt-1 line-clamp-2">
                22 Workspaces · 1,600 Queries
              </p>
            </button>
          </div>

          {/* Selected Plan Details Banner */}
          <div
            className="p-4 rounded-xl border flex items-center justify-between"
            style={{
              background: colors.verifiedSoft,
              borderColor: colors.verifiedBorder,
            }}
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-[#14171A]" style={serif}>
                  {selectedPlanKey === 'free'
                    ? 'ChaiLM Free Plan'
                    : selectedPlanKey === 'standard_monthly'
                      ? 'ChaiLM Standard'
                      : 'ChaiLM Pro'}
                </span>
                <span
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full text-[#1F7A5C] bg-white border border-[#1F7A5C]/20"
                  style={mono}
                >
                  {selectedPlanKey === 'free'
                    ? 'Free Forever'
                    : selectedPlanKey === 'standard_monthly'
                      ? 'Active Learner'
                      : 'Most Popular'}
                </span>
              </div>
              <p className="text-xs text-[#5C6169] mt-0.5">
                {selectedPlanKey === 'free'
                  ? 'No credit card required. Includes static sample workspace.'
                  : 'Billed monthly via Razorpay. Cancel anytime.'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-[#14171A]" style={serif}>
                {selectedPlanKey === 'free' ? '₹0' : selectedPlanKey === 'standard_monthly' ? '₹99' : '₹199'}
              </div>
              <span className="text-[11px] text-[#5C6169]">/ month</span>
            </div>
          </div>

          {/* Feature Comparison Breakdown for Selected Plan */}
          <div className="space-y-2.5 text-xs text-[#14171A]">
            {selectedPlanKey === 'free' ? (
              <>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>3 Workspaces</strong> (up to 3 sources each · 9 total documents)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>500 AI queries/mo</strong> (30/day burst protection limit)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>8 Study Guides & 8 Flashcards decks</strong> per month
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>3 Web Scraping</strong> URL ingests per month + 6MB PDF uploads
                  </span>
                </div>
                <div className="flex items-center space-x-2.5 text-[#5C6169]">
                  <div className="w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                  <span>
                    <em>Quizzes, Mindmaps & Audio Overviews</em> (Demo available in Sample Workspace)
                  </span>
                </div>
              </>
            ) : selectedPlanKey === 'standard_monthly' ? (
              <>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>10 Workspaces</strong> (up to 8 sources each · 80 total documents)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>1,200 AI queries/mo</strong> (150/day burst protection limit)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>25/mo each</strong> Study Guides, Flashcards, Quizzes & Mindmaps
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>4 Audio Overviews</strong> + <strong>15 Web Scrapes/mo</strong> (Email Support)
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>22 Workspaces</strong> (up to 20 sources each · 440 total documents)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>1,600 AI queries/mo</strong> (200/day burst protection limit)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>60/mo each</strong> Study Guides, Flashcards, Quizzes & Mindmaps
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#1F7A5C] shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>
                    <strong>10 Audio Overviews</strong> + <strong>25 Web Scrapes/mo</strong> (Priority Support)
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Status Message / Activating State */}
          {checkoutStep === 'verifying' && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
              <span>Payment received! Activating your subscription...</span>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Subscription activated! Welcome to ChaiLM{' '}
                {selectedPlanKey === 'standard_monthly' ? 'Standard' : 'Pro'}.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAFBF9] border-t border-[#E2E4E1] flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-[#5C6169]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A5C]" />
            <span>{selectedPlanKey === 'free' ? 'Included Free' : 'Secured by Razorpay'}</span>
          </div>

          {selectedPlanKey === 'free' ? (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#14171A] bg-[#F0F1EE] hover:bg-[#E2E4E1] transition-all cursor-pointer"
            >
              {currentPlan === 'free' ? 'Your Current Plan' : 'Close'}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={isBusy || currentPlan === selectedPlanKey}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: colors.verified }}
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{checkoutStep === 'verifying' ? 'Activating...' : 'Preparing Checkout...'}</span>
                </>
              ) : currentPlan === selectedPlanKey ? (
                <span>Current Plan</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {currentPlan === 'pro_monthly' && selectedPlanKey === 'standard_monthly'
                      ? 'Downgrade to Standard (₹99)'
                      : currentPlan === 'standard_monthly' && selectedPlanKey === 'pro_monthly'
                      ? 'Upgrade to Pro (₹199)'
                      : `Subscribe to ${selectedPlanKey === 'standard_monthly' ? 'Standard (₹99)' : 'Pro (₹199)'}`}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
