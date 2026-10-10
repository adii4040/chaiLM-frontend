export interface PlanDto {
  key: string;
  name: string;
  description?: string;
  amount: number; // in paise (e.g. 49900 = ₹499)
  currency: string;
  period: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  entitlements?: Record<string, any>;
}

export interface GetPlansResponseDto {
  success: boolean;
  plans: PlanDto[];
  message: string;
}

export interface CreateSubscriptionRequestDto {
  planKey: string;
}

export interface CreateSubscriptionResponseDto {
  success: boolean;
  subscriptionId: string;
  message: string;
}

export interface VerifySubscriptionRequestDto {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

export interface VerifySubscriptionResponseDto {
  success: boolean;
  message: string;
  plan: string;
  status: string;
  currentEnd?: string;
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

export interface BillingDetailsDto {
  plan: string;
  effectivePlan?: string;
  planName: string;
  amount?: number;
  period?: string;
  status: string;
  currentStart?: string | null;
  currentEnd?: string | null;
  cancelAtCycleEnd?: boolean;
  entitlements?: {
    key?: string;
    name?: string;
    price?: number;
    maxWorkspaces?: number;
    maxDocumentsPerWorkspace?: number;
    maxFileSizeMb?: number;
    aiQueriesPerDay?: number;
    aiQueriesPerMonth?: number;
    studyGuidesPerMonth?: number;
    flashcardsPerMonth?: number;
    quizzesPerMonth?: number;
    mindmapsPerMonth?: number;
    audioOverviewsPerMonth?: number;
    webScrapesPerMonth?: number;
    support?: string;
    [key: string]: any;
  };
  usage?: {
    dailyQueries?: {
      date: string;
      count: number;
    };
    monthlyQueries?: number;
    studyGuides?: number;
    flashcards?: number;
    quizzes?: number;
    mindmaps?: number;
    audioOverviews?: number;
    webScrapes?: number;
    cycleStart?: string;
    cycleEnd?: string;
    [key: string]: any;
  };
}

export interface GetBillingResponseDto {
  success: boolean;
  billing: BillingDetailsDto;
  message?: string;
}

export interface CancelSubscriptionResponseDto {
  success: boolean;
  message: string;
  billing: {
    plan: string;
    status: string;
    currentEnd: string;
    cancelAtCycleEnd: boolean;
  };
}

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  receipt?: string | null;
  orderId?: string | null;
  paymentId?: string | null;
  subscriptionId?: string | null;
  planKey: string;
  planName: string;
  status: 'paid' | 'issued' | 'pending' | 'cancelled' | 'expired' | string;
  amount: number; // in paise
  amountFormatted: string; // e.g. "₹199.00"
  amountPaid: number;
  amountDue: number;
  currency: string;
  date: string | null;
  billingStart?: string | null;
  billingEnd?: string | null;
  shortUrl?: string | null;
  pdfUrl?: string | null;
  downloadUrl?: string | null;
  createdAt?: string | null;
}

export interface GetInvoicesResponseDto {
  success: boolean;
  invoices: InvoiceDto[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  message?: string;
}

export interface GetInvoiceByIdResponseDto {
  success: boolean;
  invoice: InvoiceDto;
  message?: string;
}

export interface CreateOrderRequestDto {
  amount: number; // in paise (e.g. 50000 = ₹500)
  currency?: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export interface CreateOrderResponseDto {
  success: boolean;
  order_id: string;
  id?: string;
  amount: number;
  currency: string;
  receipt?: string;
  key?: string;
  message?: string;
}

export interface VerifyPaymentRequestDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponseDto {
  success: boolean;
  message: string;
  order_id?: string;
  payment_id?: string;
}

export interface RazorpayOrderSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

