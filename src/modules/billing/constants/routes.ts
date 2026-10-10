export class BillingRoutes {
  public static get GET_PLANS() {
    return '/api/plans';
  }

  public static get CREATE_SUBSCRIPTION() {
    return '/api/subscription/create';
  }

  public static get VERIFY_SUBSCRIPTION() {
    return '/api/subscription/verify';
  }

  public static get GET_MY_BILLING() {
    return '/api/subscription/me';
  }

  public static get CANCEL_SUBSCRIPTION() {
    return '/api/subscription/cancel';
  }

  public static get GET_INVOICES() {
    return '/api/subscription/invoices';
  }

  public static GET_INVOICE_BY_ID(invoiceId: string) {
    return `/api/subscription/invoices/${invoiceId}`;
  }

  public static get CREATE_ORDER() {
    return '/api/create-order';
  }

  public static get VERIFY_PAYMENT() {
    return '/api/verify-payment';
  }
}
