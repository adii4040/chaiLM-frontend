import { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../modules/auth/mutation/useSignup';
import { User as UserIcon, Mail, KeyRound, Eye, EyeOff, Cpu, ArrowRight } from 'lucide-react';

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
        errors.fullname = 'Full Name is required';
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
    <div className="flex min-h-screen items-center justify-center bg-chailm-bg text-chailm-textMain font-sans px-4 py-12 selection:bg-chailm-accentBlue/20 selection:text-white">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-chailm-border bg-chailm-panel p-8 shadow-2xl relative overflow-hidden text-left shadow-[0_0_32px_-4px_rgba(168,199,250,0.12)]">
        {/* Brand Top Gradient Bar */}
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        {/* Logo and Header Title */}
        <div className="flex flex-col items-center mb-4 text-center">
          <Link
            to="/"
            className="w-12 h-12 rounded-2xl bg-chailm-card border border-chailm-border flex items-center justify-center mb-3 text-chailm-accentBlue hover:border-chailm-accentBlue/40 transition-all"
          >
            <Cpu className="w-6 h-6 animate-pulse" />
          </Link>
          <h1 className="text-xl font-normal text-chailm-textMain tracking-tight">
            Create Agent Account
          </h1>
          <p className="text-xs text-chailm-textMuted mt-1">
            Register your credentials to access workspace intelligence
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="flex flex-col gap-3.5 relative z-10 text-xs"
        >
          {/* Full Name Field */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-chailm-textMuted uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-chailm-textMuted" />
              <input
                name="fullname"
                type="text"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Alex Morgan"
                className={`w-full rounded-xl border bg-chailm-bg pl-10 pr-4 py-2.5 text-chailm-textMain placeholder:text-chailm-textMuted outline-none transition-all
                  ${
                    formik.touched.fullname && formik.errors.fullname
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-chailm-border focus:border-chailm-accentBlue'
                  }`}
              />
            </div>
            {formik.touched.fullname && formik.errors.fullname && (
              <span className="text-rose-400 text-[10px]">{formik.errors.fullname}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-chailm-textMuted uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-chailm-textMuted" />
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@chailm.com"
                className={`w-full rounded-xl border bg-chailm-bg pl-10 pr-4 py-2.5 text-chailm-textMain placeholder:text-chailm-textMuted outline-none transition-all
                  ${
                    formik.touched.email && formik.errors.email
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-chailm-border focus:border-chailm-accentBlue'
                  }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <span className="text-rose-400 text-[10px]">{formik.errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-chailm-textMuted uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-chailm-textMuted" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••••••"
                className={`w-full rounded-xl border bg-chailm-bg pl-10 pr-10 py-2.5 text-chailm-textMain placeholder:text-chailm-textMuted outline-none transition-all
                  ${
                    formik.touched.password && formik.errors.password
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-chailm-border focus:border-chailm-accentBlue'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chailm-textMuted hover:text-chailm-textMain transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <span className="text-rose-400 text-[10px]">{formik.errors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-chailm-textMuted uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-chailm-textMuted" />
              <input
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••••••"
                className={`w-full rounded-xl border bg-chailm-bg pl-10 pr-4 py-2.5 text-chailm-textMain placeholder:text-chailm-textMuted outline-none transition-all
                  ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-chailm-border focus:border-chailm-accentBlue'
                  }`}
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className="text-rose-400 text-[10px]">{formik.errors.confirmPassword}</span>
            )}
          </div>

          {/* Error Banner */}
          {formik.status && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-[11px] font-medium text-rose-300 animate-in fade-in"
            >
              {formik.status}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSignupPending}
            className="w-full rounded-full bg-chailm-accentBlue/15 hover:bg-chailm-accentBlue/25 text-chailm-accentBlue border border-chailm-accentBlue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 text-xs font-medium cursor-pointer flex items-center justify-center space-x-2 mt-2 shadow-lg"
          >
            <span>{isSignupPending ? 'REGISTERING AGENT...' : 'CREATE ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer link */}
        <div className="pt-4 border-t border-chailm-border text-center text-xs text-chailm-textMuted">
          <p>
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-chailm-accentBlue font-medium hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
