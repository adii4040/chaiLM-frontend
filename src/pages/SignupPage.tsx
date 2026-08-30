import { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSignup } from '../modules/auth/mutation/useSignup';
import { User as UserIcon, Mail, KeyRound, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { colors, serif, mono, EASE, spotlightMove } from '../components/landing/tokens';

type SignupFormValues = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialValues: SignupFormValues = {
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { mutateAsync: signupMutation, isPending: isSignupPending } = useSignup();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors: Partial<Record<keyof SignupFormValues, string>> = {};

      if (!values.fullname.trim()) {
        errors.fullname = 'Full name is required';
      }

      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Enter a valid email address';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm password';
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      return errors;
    },
    onSubmit: async (values, { setStatus, resetForm }) => {
      setStatus(undefined);
      try {
        await signupMutation({
          fullname: values.fullname,
          email: values.email,
          password: values.password,
        });
        resetForm();
        navigate('/login');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to register account';
        setStatus(message);
      }
    },
  });

  return (
    <div
      className="min-h-screen flex flex-col justify-between px-4 py-8 relative overflow-hidden"
      style={{ background: colors.paper, color: colors.ink }}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(circle, #1E2A5E 0%, #1F7A5C 50%, transparent 70%)',
        }}
      />

      {/* Top Navigation */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 px-2">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" style={serif}>
          chai<span style={{ color: colors.verified }}>LM</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C6169] hover:text-[#14171A] transition-colors"
          style={mono}
        >
          <ArrowLeft size={13} /> Back to Overview
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="w-full flex items-center justify-center my-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          onMouseMove={spotlightMove}
          className="w-full max-w-[440px] rounded-2xl spotlight-card relative overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: `1px solid ${colors.hairlineStrong}`,
            boxShadow: '0 20px 50px -12px rgba(20,23,26,0.08), 0 2px 8px rgba(20,23,26,0.03)',
          }}
        >
          {/* Flush, perfectly clipped top accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${colors.verified} 0%, ${colors.cobalt} 100%)` }}
          />

          <div className="p-7 md:p-9">
            {/* Header Title */}
            <div className="flex flex-col items-center mb-6 text-center">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
                style={{
                  background: colors.cobaltSoft,
                  color: colors.cobalt,
                  border: `1px solid ${colors.hairlineStrong}`,
                  ...mono,
                }}
              >
                <Sparkles size={13} />
                <span>START RESEARCHING</span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-medium tracking-tight mb-2"
                style={{ ...serif, color: colors.ink }}
              >
                Create Agent Account
              </h1>
              <p className="text-xs leading-relaxed text-[#5C6169] max-w-xs">
                Register your credentials to access workspace intelligence
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-3 text-xs">
              {/* Full Name Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold uppercase tracking-wider text-[#5C6169]"
                  style={mono}
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93968F]" />
                  <input
                    name="fullname"
                    type="text"
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-[#14171A] placeholder:text-[#93968F] outline-none transition-all focus:ring-2 focus:ring-[#1F7A5C]/10"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${formik.touched.fullname && formik.errors.fullname ? '#E53E3E' : colors.hairlineStrong
                        }`,
                    }}
                  />
                </div>
                {formik.touched.fullname && formik.errors.fullname && (
                  <span className="text-red-500 text-[10px] font-medium">{formik.errors.fullname}</span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold uppercase tracking-wider text-[#5C6169]"
                  style={mono}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93968F]" />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@chailm.com"
                    className="w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-[#14171A] placeholder:text-[#93968F] outline-none transition-all focus:ring-2 focus:ring-[#1F7A5C]/10"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${formik.touched.email && formik.errors.email ? '#E53E3E' : colors.hairlineStrong
                        }`,
                    }}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <span className="text-red-500 text-[10px] font-medium">{formik.errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold uppercase tracking-wider text-[#5C6169]"
                  style={mono}
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93968F]" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border pl-10 pr-10 py-2.5 text-xs text-[#14171A] placeholder:text-[#93968F] outline-none transition-all focus:ring-2 focus:ring-[#1F7A5C]/10"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${formik.touched.password && formik.errors.password ? '#E53E3E' : colors.hairlineStrong
                        }`,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#93968F] hover:text-[#14171A] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <span className="text-red-500 text-[10px] font-medium">{formik.errors.password}</span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold uppercase tracking-wider text-[#5C6169]"
                  style={mono}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93968F]" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-[#14171A] placeholder:text-[#93968F] outline-none transition-all focus:ring-2 focus:ring-[#1F7A5C]/10"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${formik.touched.confirmPassword && formik.errors.confirmPassword
                          ? '#E53E3E'
                          : colors.hairlineStrong
                        }`,
                    }}
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <span className="text-red-500 text-[10px] font-medium">
                    {formik.errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Error Banner */}
              {formik.status && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 animate-in fade-in"
                >
                  {formik.status}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSignupPending}
                className="w-full rounded-full text-white font-medium py-3 px-6 text-xs cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: colors.verified }}
              >
                <span>{isSignupPending ? 'REGISTERING AGENT...' : 'Create Account'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Switch to Login link */}
            <div className="pt-5 mt-5 border-t border-[#E2E4E1] text-center text-xs text-[#5C6169]">
              <p>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold transition-colors hover:underline"
                  style={{ color: colors.cobalt }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-center gap-4 text-[11px] text-[#93968F] z-10" style={mono}>
        <span className="flex items-center gap-1">
          <CheckCircle2 size={12} className="text-[#1F7A5C]" /> Source-Grounded
        </span>
        <span>•</span>
        <span>Qdrant Vector Isolation</span>
        <span>•</span>
        <span>Cohere v3.5 Verified</span>
      </div>
    </div>
  );
}
