import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CreditCard,
  KeyRound,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  MessageSquare,
  BookOpen,
  FileText,
  HelpCircle,
  Network,
  Radio,
  Globe,
  Lock,
  AlertTriangle,
  Zap,
  Receipt,
  ExternalLink,
} from 'lucide-react';
import useCurrentUser from '../modules/auth/query/useCurrentUser';
import { useUpdateProfile } from '../modules/auth/mutation/useUpdateProfile';
import { useChangePassword } from '../modules/auth/mutation/useChangePassword';
import { useBillingDetails } from '../modules/billing/query/useBillingDetails';
import { useInvoices } from '../modules/billing/query/useInvoices';
import { useCancelSubscription } from '../modules/billing/mutation/useCancelSubscription';
import { useGetAllWorkspaces } from '../modules/workspace/query/useGetAllWorkspaces';
import { UpgradeModal } from '../components/billing/UpgradeModal';
import { colors, serif, mono } from '../components/landing/tokens';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: userData, isLoading: isLoadingUser } = useCurrentUser();
  const { data: billingData, isLoading: isLoadingBilling } = useBillingDetails(true);
  const { data: invoicesData, isLoading: isLoadingInvoices } = useInvoices(1, 50, true);
  const { data: workspacesData } = useGetAllWorkspaces();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutateAsync: cancelSubscription, isPending: isCancelling } = useCancelSubscription();

  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const billing = billingData?.billing;
  const entitlements = billing?.entitlements || {};
  const usage = billing?.usage || {};

  const effectivePlan = billing?.effectivePlan || billing?.plan || 'free';
  const isPaid =
    (effectivePlan === 'pro_monthly' || effectivePlan === 'standard_monthly') &&
    (billing?.status === 'active' || billing?.status === 'authenticated');
  const isPro = effectivePlan === 'pro_monthly' && isPaid;
  const isStandard = effectivePlan === 'standard_monthly' && isPaid;
  const isCancelled = isPaid && Boolean(billing?.cancelAtCycleEnd);

  const currentWorkspaceCount = (workspacesData?.data || []).length;
  const totalSourcesUploaded = (workspacesData?.data || []).reduce(
    (acc: number, ws: any) => acc + (ws.sourceCount || ws.sourcesSummary?.length || ws.sources?.length || 0),
    0
  );
  const maxTotalSources = (entitlements.maxWorkspaces ?? 3) * (entitlements.maxDocumentsPerWorkspace ?? 3);

  // Profile form state
  const user = userData?.user;
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Cancel subscription state
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  // Sync fullname when user data loads
  React.useEffect(() => {
    if (user?.fullname) {
      setFullname(user.fullname);
    }
  }, [user?.fullname]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!fullname.trim()) {
      setProfileError('Full name cannot be empty');
      return;
    }

    try {
      await updateProfile({ fullname: fullname.trim() });
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to change password. Please verify current password.');
    }
  };

  const handleCancelSub = async () => {
    try {
      await cancelSubscription();
      setCancelMessage('Your subscription has been scheduled for cancellation at cycle end.');
      setConfirmCancel(false);
    } catch (err: any) {
      alert(err?.message || 'Could not cancel subscription');
    }
  };

  const rawEndDate = billing?.currentEnd || user?.planExpiresAt;
  const formattedEndDate = rawEndDate
    ? new Date(rawEndDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Quota bar helper
  const renderQuotaItem = (
    label: string,
    current: number,
    max: number | undefined,
    icon: React.ReactNode,
    unit: string = '',
    isLocked: boolean = false
  ) => {
    const isUnlimited = max === undefined;
    const maxVal = max ?? 0;
    const percent = maxVal > 0 ? Math.min(100, Math.round((current / maxVal) * 100)) : 0;
    const isNearLimit = percent >= 80;

    return (
      <div className="p-4 rounded-xl border border-[#E2E4E1] bg-white space-y-2.5 transition-all hover:border-[#CAD1C8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#14171A]">
            <span className="text-[#5C6169]">{icon}</span>
            <span>{label}</span>
          </div>
          {isLocked ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1"
              style={mono}
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Locked</span>
            </span>
          ) : (
            <span className="text-xs font-bold text-[#14171A]" style={mono}>
              {current} / {isUnlimited ? '∞' : maxVal} {unit}
            </span>
          )}
        </div>

        {isLocked ? (
          <div className="text-[11px] text-[#5C6169] flex items-center justify-between pt-1">
            <span>Upgrade to unlock live generation</span>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="text-[#1F7A5C] font-semibold hover:underline cursor-pointer"
            >
              Unlock
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-[#F0F1EE] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isNearLimit ? 'bg-amber-500' : 'bg-[#1F7A5C]'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#5C6169]">
              <span>{percent}% used</span>
              <span>{isUnlimited ? 'Unlimited' : `${maxVal - current} remaining`}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingUser || isLoadingBilling) {
    return (
      <div className="min-h-screen bg-[#F5F6F4] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1F7A5C]" />
        <p className="text-xs text-[#5C6169]">Loading your account settings & live quotas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F4] text-[#14171A] flex flex-col">
      {/* Top Header */}
      <header
        className="h-16 px-4 sm:px-8 flex items-center justify-between bg-white border-b sticky top-0 z-30 select-none"
        style={{ borderColor: colors.hairline }}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/workspace')}
            className="p-1.5 rounded-lg text-[#5C6169] hover:text-[#14171A] hover:bg-[#F0F1EE] transition-colors cursor-pointer flex items-center space-x-1 text-xs font-semibold"
            title="Back to Workspaces"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Workspaces</span>
          </button>
          <span className="text-[#CAD1C8]">/</span>
          <h1 className="text-base font-bold text-[#14171A]" style={serif}>
            Account Settings
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {isPro ? (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-[#1F7A5C] bg-[#1F7A5C]/10 border border-[#1F7A5C]/20"
              style={mono}
            >
              PRO ACTIVE
            </span>
          ) : isStandard ? (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20"
              style={mono}
            >
              STANDARD ACTIVE
            </span>
          ) : (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
              style={{ background: colors.verified }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade Plan</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Settings Container */}
      <div className="max-w-5xl w-full mx-auto p-4 sm:p-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1 space-y-1">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#5C6169]" style={mono}>
              Settings Hub
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-[#1F7A5C] shadow-xs border border-[#E2E4E1]'
                  : 'text-[#5C6169] hover:bg-[#EAECE8] hover:text-[#14171A]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile & Account</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-white text-[#1F7A5C] shadow-xs border border-[#E2E4E1]'
                  : 'text-[#5C6169] hover:bg-[#EAECE8] hover:text-[#14171A]'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Plans & Usage</span>
            </button>
          </aside>

          {/* Tab Content Panels */}
          <main className="md:col-span-3 space-y-6">
            {/* ----------------- PROFILE TAB ----------------- */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="p-6 rounded-2xl bg-white border border-[#E2E4E1] shadow-xs space-y-5">
                  <div className="border-b border-[#E2E4E1] pb-4">
                    <h2 className="text-base font-bold text-[#14171A]" style={serif}>
                      Profile Information
                    </h2>
                    <p className="text-xs text-[#5C6169] mt-0.5">
                      Update your display name and view account credentials.
                    </p>
                  </div>

                  {profileSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{profileSuccess}</span>
                    </div>
                  )}

                  {profileError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#14171A]">Full Name</label>
                      <input
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2E4E1] text-xs focus:outline-none focus:border-[#1F7A5C] bg-[#FAFBF9]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#14171A]">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2E4E1] text-xs bg-[#F0F1EE] text-[#5C6169] cursor-not-allowed"
                      />
                      <span className="text-[11px] text-[#5C6169]">
                        Email cannot be changed directly for security.
                      </span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                        style={{ background: colors.verified }}
                      >
                        {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Change Card */}
                <div className="p-6 rounded-2xl bg-white border border-[#E2E4E1] shadow-xs space-y-5">
                  <div className="border-b border-[#E2E4E1] pb-4">
                    <h2 className="text-base font-bold text-[#14171A]" style={serif}>
                      Security & Password
                    </h2>
                    <p className="text-xs text-[#5C6169] mt-0.5">
                      Change your password to keep your research workspaces secure.
                    </p>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#14171A]">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E2E4E1] text-xs focus:outline-none focus:border-[#1F7A5C] bg-[#FAFBF9]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#14171A]">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E2E4E1] text-xs focus:outline-none focus:border-[#1F7A5C] bg-[#FAFBF9]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#14171A]">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E2E4E1] text-xs focus:outline-none focus:border-[#1F7A5C] bg-[#FAFBF9]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                        style={{ background: colors.cobalt }}
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{isChangingPassword ? 'Updating...' : 'Update Password'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ----------------- BILLING & USAGE TAB ----------------- */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                {/* Active Plan Overview Card */}
                <div className="p-6 rounded-2xl bg-white border border-[#E2E4E1] shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E4E1] pb-5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-bold text-[#14171A]" style={serif}>
                          {billing?.planName || (isPro ? 'ChaiLM Pro' : isStandard ? 'ChaiLM Standard' : 'Free Tier')}
                        </h2>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isPaid
                              ? isCancelled
                                ? 'text-amber-700 bg-amber-50 border-amber-200'
                                : 'text-[#1F7A5C] bg-white border-[#1F7A5C]/20'
                              : 'text-[#5C6169] bg-white border-[#E2E4E1]'
                          }`}
                          style={mono}
                        >
                          {isCancelled ? 'Cancels at Cycle End' : isPaid ? 'Active' : 'Free Plan'}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6169] mt-1">
                        {isPro
                          ? '₹199 / month · Full studio suite & max limits'
                          : isStandard
                          ? '₹99 / month · Active multi-source research'
                          : '₹0 / month · 3 workspaces with foundational features'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
                        style={{ background: colors.verified }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isPro ? 'Change Plan' : isStandard ? 'Upgrade to Pro' : 'Upgrade Plan'}</span>
                      </button>
                    </div>
                  </div>

                  {cancelMessage && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cancelMessage}</span>
                    </div>
                  )}

                  {/* Renewal Date & Cancel Notice */}
                  {isPaid && (
                    <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E2E4E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2.5">
                        <Calendar className="w-4 h-4 text-[#5C6169]" />
                        <span>
                          {isCancelled ? 'Access expires on: ' : 'Next renewal date: '}
                          <strong>{formattedEndDate || 'Active cycle'}</strong>
                        </span>
                      </div>

                      {!isCancelled && (
                        <div>
                          {confirmCancel ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={handleCancelSub}
                                disabled={isCancelling}
                                className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                              >
                                {isCancelling ? 'Cancelling...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setConfirmCancel(false)}
                                className="px-2 py-1 text-xs text-[#5C6169] hover:underline cursor-pointer"
                              >
                                Back
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancel(true)}
                              className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
                            >
                              Cancel Subscription
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {isCancelled && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Cancellation Scheduled:</strong> You have full paid access until{' '}
                        <strong>{formattedEndDate}</strong>. Your card will not be charged again.
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Quota & Usage Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#14171A]" style={serif}>
                        Live Quotas & Usage Meter
                      </h3>
                      <p className="text-xs text-[#5C6169]">
                        Account-wide counters for your current monthly billing period.
                      </p>
                    </div>
                    <span className="text-[11px] text-[#5C6169]" style={mono}>
                      Resets {formattedEndDate ? `on ${formattedEndDate}` : 'monthly'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* AI Queries (Monthly & Daily) */}
                    {renderQuotaItem(
                      'AI Queries (Monthly)',
                      usage.monthlyQueries || 0,
                      entitlements.aiQueriesPerMonth ?? 500,
                      <MessageSquare className="w-4 h-4" />,
                      'queries'
                    )}

                    {renderQuotaItem(
                      'AI Queries (Daily Burst)',
                      usage.dailyQueries?.count || 0,
                      entitlements.aiQueriesPerDay ?? 30,
                      <Zap className="w-4 h-4" />,
                      'today'
                    )}

                    {/* Workspaces & Documents with Progress Bars */}
                    {renderQuotaItem(
                      'Workspaces Created',
                      currentWorkspaceCount,
                      entitlements.maxWorkspaces ?? 3,
                      <Layers className="w-4 h-4" />,
                      'workspaces'
                    )}

                    {renderQuotaItem(
                      `Documents Uploaded (Max ${entitlements.maxDocumentsPerWorkspace ?? 3}/ws)`,
                      totalSourcesUploaded,
                      maxTotalSources,
                      <FileText className="w-4 h-4" />,
                      'sources'
                    )}

                    {/* Studio Artifacts */}
                    {renderQuotaItem(
                      'Study Guides',
                      usage.studyGuides || 0,
                      entitlements.studyGuidesPerMonth ?? 8,
                      <BookOpen className="w-4 h-4" />,
                      'guides'
                    )}

                    {renderQuotaItem(
                      'Flashcards Decks',
                      usage.flashcards || 0,
                      entitlements.flashcardsPerMonth ?? 8,
                      <FileText className="w-4 h-4" />,
                      'decks'
                    )}

                    {renderQuotaItem(
                      'Interactive Quizzes',
                      usage.quizzes || 0,
                      entitlements.quizzesPerMonth,
                      <HelpCircle className="w-4 h-4" />,
                      'quizzes',
                      (entitlements.quizzesPerMonth ?? 0) === 0
                    )}

                    {renderQuotaItem(
                      'Mind Maps',
                      usage.mindmaps || 0,
                      entitlements.mindmapsPerMonth,
                      <Network className="w-4 h-4" />,
                      'maps',
                      (entitlements.mindmapsPerMonth ?? 0) === 0
                    )}

                    {renderQuotaItem(
                      'Audio Overview Podcasts',
                      usage.audioOverviews || 0,
                      entitlements.audioOverviewsPerMonth,
                      <Radio className="w-4 h-4" />,
                      'episodes',
                      (entitlements.audioOverviewsPerMonth ?? 0) === 0
                    )}

                    {renderQuotaItem(
                      'Web Scraping Ingests',
                      usage.webScrapes || 0,
                      entitlements.webScrapesPerMonth ?? 3,
                      <Globe className="w-4 h-4" />,
                      'scrapes'
                    )}
                  </div>
                </div>

                {/* ----------------- INVOICES & BILLING HISTORY CARD ----------------- */}
                <div className="p-6 rounded-2xl bg-white border border-[#E2E4E1] shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E4E1] pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F1EE] flex items-center justify-center text-[#1F7A5C]">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#14171A]" style={serif}>
                          Invoices & Payment History
                        </h3>
                        <p className="text-xs text-[#5C6169]">
                          Download official tax receipts and subscription payment records.
                        </p>
                      </div>
                    </div>

                    {invoicesData?.totalCount !== undefined && invoicesData.totalCount > 0 && (
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FAFBF9] border border-[#E2E4E1] text-[#5C6169] self-start sm:self-auto"
                        style={mono}
                      >
                        {invoicesData.totalCount} {invoicesData.totalCount === 1 ? 'Invoice' : 'Invoices'}
                      </span>
                    )}
                  </div>

                  {isLoadingInvoices ? (
                    <div className="py-8 flex flex-col items-center justify-center space-y-2 text-[#5C6169]">
                      <Loader2 className="w-5 h-5 animate-spin text-[#1F7A5C]" />
                      <span className="text-xs">Fetching payment history & invoices...</span>
                    </div>
                  ) : !invoicesData?.invoices || invoicesData.invoices.length === 0 ? (
                    <div className="py-10 px-4 text-center rounded-xl bg-[#FAFBF9] border border-dashed border-[#E2E4E1] space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-white border border-[#E2E4E1] flex items-center justify-center text-[#5C6169]">
                        <Receipt className="w-5 h-5 opacity-50" />
                      </div>
                      <p className="text-xs font-semibold text-[#14171A]">No invoices found yet</p>
                      <p className="text-[11px] text-[#5C6169] max-w-sm mx-auto">
                        Once your subscription or one-time payment is processed by Razorpay, official tax receipts will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#E2E4E1] text-[#5C6169] text-[10px] uppercase tracking-wider" style={mono}>
                            <th className="pb-3 font-bold">Date</th>
                            <th className="pb-3 font-bold">Invoice / Ref</th>
                            <th className="pb-3 font-bold">Plan</th>
                            <th className="pb-3 font-bold">Amount</th>
                            <th className="pb-3 font-bold">Status</th>
                            <th className="pb-3 font-bold text-right">Receipt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F1EE]">
                          {invoicesData.invoices.map((inv) => {
                            const formattedDate = inv.date
                              ? new Date(inv.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : '—';

                            const isPaidStatus = inv.status === 'paid';
                            const isIssued = inv.status === 'issued';

                            return (
                              <tr key={inv.id} className="hover:bg-[#FAFBF9] transition-colors group">
                                <td className="py-3.5 pr-3 text-[#14171A] font-medium whitespace-nowrap">
                                  {formattedDate}
                                </td>
                                <td className="py-3.5 pr-3 whitespace-nowrap">
                                  <span className="font-mono text-[11px] text-[#5C6169] group-hover:text-[#14171A] transition-colors">
                                    {inv.invoiceNumber || inv.id}
                                  </span>
                                </td>
                                <td className="py-3.5 pr-3 whitespace-nowrap">
                                  <span className="text-[#14171A] font-semibold">
                                    {inv.planName}
                                  </span>
                                </td>
                                <td className="py-3.5 pr-3 font-bold whitespace-nowrap" style={mono}>
                                  {inv.amountFormatted}
                                </td>
                                <td className="py-3.5 pr-3 whitespace-nowrap">
                                  <span
                                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                      isPaidStatus
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : isIssued
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                    }`}
                                    style={mono}
                                  >
                                    {inv.status}
                                  </span>
                                </td>
                                <td className="py-3.5 text-right whitespace-nowrap">
                                  {inv.shortUrl || inv.pdfUrl ? (
                                    <a
                                      href={inv.shortUrl || inv.pdfUrl || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#1F7A5C] bg-[#1F7A5C]/5 hover:bg-[#1F7A5C]/15 border border-[#1F7A5C]/20 transition-all cursor-pointer"
                                      title="View and Download Invoice Receipt"
                                    >
                                      <Receipt className="w-3.5 h-3.5" />
                                      <span>View Receipt</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                                    </a>
                                  ) : (
                                    <span className="text-[#CAD1C8] text-[11px]">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
};

export default SettingsPage;
