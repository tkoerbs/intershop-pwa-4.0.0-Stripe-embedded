/**
 * available, ordered checkout steps
 */
export enum CheckoutStepType {
  BeforeCheckout,
  Addresses,
  Shipping,
  // Payment,  //Nice update
  Review,
  Payment,
  Receipt,
}
