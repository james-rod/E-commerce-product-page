import { apiFetch } from './api.js';

let stripe = null;
let elements = null;
let paymentElement = null;
let onSuccess = null;

export async function initPayment(onPaymentSuccess) {
  onSuccess = onPaymentSuccess;
  const { publishableKey } = await apiFetch('/config');
  stripe = Stripe(publishableKey);
  document.getElementById('payment-modal-close').addEventListener('click', closePaymentModal);
  document.getElementById('payment-submit').addEventListener('click', submitPayment);
}

export async function openPaymentModal(clientSecret, totalCents) {
  document.getElementById('payment-amount').textContent =
    `Total: $${(totalCents / 100).toFixed(2)}`;

  elements = stripe.elements({ clientSecret });
  paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  document.getElementById('payment-modal').classList.remove('invisible');
  document.getElementById('payment-error').classList.add('hidden');
}

function closePaymentModal() {
  document.getElementById('payment-modal').classList.add('invisible');
  if (paymentElement) {
    paymentElement.unmount();
    paymentElement = null;
    elements = null;
  }
}

async function submitPayment() {
  const btn = document.getElementById('payment-submit');
  const errorEl = document.getElementById('payment-error');
  btn.disabled = true;
  btn.textContent = 'Processing...';
  errorEl.classList.add('hidden');

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: window.location.href },
    redirect: 'if_required',
  });

  if (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove('hidden');
    btn.disabled = false;
    btn.textContent = 'Pay Now';
    return;
  }

  closePaymentModal();
  if (onSuccess) await onSuccess();
  alert('Payment successful! Your order has been placed.');
}
