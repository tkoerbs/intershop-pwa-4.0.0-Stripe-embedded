import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Stripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { Subject, takeUntil } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { StripeInfo } from 'ish-core/models/stripe-info/stripe-info.nice.model';

@Component({
  selector: 'ish-payment-stripe-credit-card',
  templateUrl: './payment-stripe-credit-card.component.nice.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStripeCreditCardComponent implements OnInit, OnDestroy {
  clientSecret = '';
  checkout: StripeEmbeddedCheckout;

  private destroy$ = new Subject<void>();
  stripeInfo: StripeInfo;
  @Input() stripe: Stripe;

  constructor(private checkoutFacade: CheckoutFacade) { }

  ngOnInit() {
    this.checkoutFacade.getStripeInfo$.pipe(takeUntil(this.destroy$)).subscribe((stripeInfo: StripeInfo) => {
      this.stripeInfo = stripeInfo;
      if (!stripeInfo) {
        this.checkoutFacade.createStripeSession();
      } else if (this.stripe) {
        this.loadUi();
      }
    });
  }

  async loadUi() {
    const stripeData: any = this.stripeInfo.stripeData;
    this.checkout = await this.stripe.initEmbeddedCheckout({
      clientSecret: stripeData?.client_secret,
    });

    // Mount Checkout
    this.checkout.mount('#checkout');
  }

  ngOnDestroy() {
    this.checkout?.unmount();
    this.checkout?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
