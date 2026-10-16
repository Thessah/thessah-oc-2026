'use client'

import { CreditCard, Lock, Shield, DollarSign, Smartphone, Truck } from 'lucide-react';

export default function PaymentOptions() {
  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit & Debit Cards',
      icon: CreditCard,
      description: 'Visa, Mastercard, and other major card networks',
      details: [
        'Visa & Mastercard (all banks)',
        'Emirates NBD, FAB, DIB, RAK Bank, etc.',
        'International cards accepted',
        'Instant payment processing',
        'Secure 3D verification'
      ]
    },
    {
      id: 'bank',
      title: 'Online Banking',
      icon: Smartphone,
      description: 'Direct transfer from your UAE bank account',
      details: [
        'All major UAE banks supported',
        'Real-time transaction confirmation',
        'Lower transaction fees',
        'Enhanced security via bank portal',
        'Account statement integration'
      ]
    },
    {
      id: 'wallet',
      title: 'Digital Wallets',
      icon: Smartphone,
      description: 'Quick checkout with saved payment methods',
      details: [
        'Apple Pay',
        'Google Pay',
        'Samsung Pay',
        'UAE digital wallets (coming soon)',
        'One-click checkout'
      ]
    },
    {
      id: 'cod',
      title: 'Cash on Delivery (COD)',
      icon: DollarSign,
      description: 'Pay when your jewelry arrives',
      details: [
        'Available for orders under AED 10,000',
        'Within UAE mainland only',
        'No hidden charges',
        'Secure delivery with signature',
        'Insured shipment included'
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1250px' }} className="mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Payment Options</h1>
      <p className="text-gray-600 mb-8">Multiple secure payment methods for your jewelry purchases</p>

      {/* Security Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-start gap-4">
        <Shield className="text-green-600 flex-shrink-0 mt-1" size={24} />
        <div>
          <h3 className="font-semibold text-green-900 mb-2">Your Payment is Secure</h3>
          <p className="text-sm text-green-800">
            All transactions are encrypted with 256-bit SSL technology and processed through 
            PCI-DSS compliant payment gateways. Your card details are never stored on our servers.
          </p>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div key={method.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {method.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Payment Process */}
      <h2 className="text-2xl font-semibold mb-6">How Checkout Works</h2>
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        {[
          { step: 1, title: 'Review Order', desc: 'Confirm jewelry details & price' },
          { step: 2, title: 'Choose Payment', desc: 'Select your preferred method' },
          { step: 3, title: 'Complete Payment', desc: 'Secure transaction processing' },
          { step: 4, title: 'Order Confirmed', desc: 'Get invoice & tracking' }
        ].map((item) => (
          <div key={item.step} className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
              {item.step}
            </div>
            <h4 className="font-semibold mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Card Payment Details */}
      <h2 className="text-2xl font-semibold mb-6">Credit & Debit Card Payment</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">What We Accept</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-600 mb-3">International Cards</h4>
            <ul className="space-y-2 text-sm">
              <li>✓ Visa (all variants)</li>
              <li>✓ Mastercard (all variants)</li>
              <li>✓ American Express</li>
              <li>✓ Diners Club</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-3">Card Features</h4>
            <ul className="space-y-2 text-sm">
              <li>✓ Credit Cards & Debit Cards</li>
              <li>✓ Prepaid Cards</li>
              <li>✓ Virtual Cards</li>
              <li>✓ Islamic Banking Cards</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold mb-3">Security Features During Card Payment</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Lock size={16} className="text-green-600" />
              <strong>3D Secure Authentication:</strong> OTP or password verification by your bank
            </li>
            <li className="flex items-center gap-2">
              <Lock size={16} className="text-green-600" />
              <strong>SSL Encryption:</strong> 256-bit encryption protects your data in transit
            </li>
            <li className="flex items-center gap-2">
              <Lock size={16} className="text-green-600" />
              <strong>Tokenization:</strong> Card data is encrypted; we only store secure tokens
            </li>
            <li className="flex items-center gap-2">
              <Lock size={16} className="text-green-600" />
              <strong>PCI-DSS Compliance:</strong> Payment processing meets global security standards
            </li>
            <li className="flex items-center gap-2">
              <Lock size={16} className="text-green-600" />
              <strong>Fraud Detection:</strong> AI monitors transactions for suspicious activity
            </li>
          </ul>
        </div>
      </div>

      {/* Bank Transfer */}
      <h2 className="text-2xl font-semibold mb-6">Bank Transfer / Online Banking</h2>
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">UAE Banks Supported</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            'Emirates NBD',
            'FAB (First Abu Dhabi Bank)',
            'DIB (Dubai Islamic Bank)',
            'RAK Bank',
            'Mashreq Bank',
            'ADIB (Abu Dhabi Islamic Bank)',
            'Ajman Bank',
            'Sharjah Islamic Bank',
            'Union Coop Bank'
          ].map((bank, idx) => (
            <div key={idx} className="bg-white p-3 rounded border border-blue-200 text-center text-sm font-medium">
              {bank}
            </div>
          ))}
        </div>

        <h3 className="font-semibold mb-3 pt-4 border-t border-blue-200">Advantages</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ Pay directly from your bank account via online banking portal</li>
          <li>✓ Lower transaction fees (no credit card fees)</li>
          <li>✓ Instant fund transfer & confirmation</li>
          <li>✓ Enhanced security through bank authentication</li>
          <li>✓ Automatic receipt in your bank statement</li>
        </ul>
      </div>

      {/* Digital Wallets */}
      <h2 className="text-2xl font-semibold mb-6">Digital Wallets</h2>
      <div className="bg-purple-50 rounded-lg p-6 mb-8">
        <p className="text-sm mb-4">Fast checkout using saved card details in your digital wallet:</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {['Apple Pay', 'Google Pay', 'Samsung Pay'].map((wallet, idx) => (
            <div key={idx} className="bg-white p-4 rounded border border-purple-200 text-center">
              <Smartphone className="mx-auto mb-2 text-purple-600" size={24} />
              <p className="font-semibold text-sm">{wallet}</p>
              <p className="text-xs text-gray-600 mt-1">One-click checkout</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-700">
          Digital wallets use tokenization to keep your card details secure. Your payment credentials 
          are never shared with Thessah.ae.
        </p>
      </div>

      {/* Cash on Delivery */}
      <h2 className="text-2xl font-semibold mb-6">Cash on Delivery (COD)</h2>
      <div className="bg-amber-50 rounded-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">How It Works</h3>
            <ol className="space-y-2 text-sm">
              <li><strong>1.</strong> Place your jewelry order</li>
              <li><strong>2.</strong> Select "Cash on Delivery" at checkout</li>
              <li><strong>3.</strong> Your item is prepared & insured</li>
              <li><strong>4.</strong> Courier delivers to your address</li>
              <li><strong>5.</strong> Pay with cash upon receipt (signature required)</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Limitations & Details</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Orders under <strong>AED 10,000</strong> only</li>
              <li>✓ Available within <strong>UAE mainland</strong></li>
              <li>✓ Free delivery with insurance included</li>
              <li>✓ Signature required on delivery</li>
              <li>✓ No hidden charges or convenience fees</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Transparency */}
      <h2 className="text-2xl font-semibold mb-6">Pricing Breakdown at Checkout</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <p className="text-sm mb-4">Your final price includes:</p>
        <div className="space-y-3">
          {[
            { item: 'Gold Cost', desc: '(Current gold rate × weight)' },
            { item: 'Craftsmanship Charge', desc: '(Labor & artistry)' },
            { item: 'Gemstone Cost', desc: '(If applicable)' },
            { item: 'UAE VAT (5%)', desc: '(Where applicable)' },
            { item: 'Shipping & Insurance', desc: '(Domestic or International)' },
            { item: 'Service Fee', desc: '(Platform fee, if any)' }
          ].map((line, idx) => (
            <div key={idx} className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span>
                <strong>{line.item}</strong>
                <span className="text-gray-600 ml-2 text-xs">{line.desc}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-700 mt-4">
          <strong>Note:</strong> Your order price is locked at the time of payment confirmation. 
          Any future gold price changes will not affect your order.
        </p>
      </div>

      {/* Payment Security FAQs */}
      <h2 className="text-2xl font-semibold mb-6">Payment Security FAQs</h2>
      <div className="space-y-4">
        {[
          {
            q: 'Is my card information safe?',
            a: 'Yes. We use PCI-DSS Level 1 compliance, 256-bit SSL encryption, and tokenization. Your full card details are never stored on our servers.'
          },
          {
            q: 'What if I don\'t receive my jewelry after payment?',
            a: 'All jewelry orders are insured and tracked. If an item is lost or damaged, we will issue a full refund or replacement. Your payment is protected.'
          },
          {
            q: 'Can I pay in installments?',
            a: 'Coming soon! We are adding support for Tamara and Tabby installment plans for orders above AED 500.'
          },
          {
            q: 'Do you accept cryptocurrency?',
            a: 'Currently, we accept traditional payment methods only. Cryptocurrency payments may be added in the future.'
          },
          {
            q: 'What is your refund policy for payments?',
            a: 'Refunds are issued to the original payment method within 7-10 business days of approval. For COD, cash is refunded in person or via bank transfer.'
          },
          {
            q: 'Why was my payment declined?',
            a: 'Common reasons: insufficient funds, incorrect card details, international card restrictions, or bank fraud detection. Contact your bank or try another payment method.'
          },
          {
            q: 'Is there a transaction fee?',
            a: 'Card payments: 2-3% fee (usually absorbed by us). Bank transfer: No fee. COD: No fee (free delivery).'
          },
          {
            q: 'How long does payment processing take?',
            a: 'Card & digital wallet: Instant. Bank transfer: 30 minutes - 2 hours. COD: No payment until delivery.'
          }
        ].map((faq, idx) => (
          <details key={idx} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
            <summary className="font-semibold flex justify-between items-center">
              {faq.q}
              <span className="text-gray-400">▼</span>
            </summary>
            <p className="text-sm text-gray-700 mt-3">{faq.a}</p>
          </details>
        ))}
      </div>

      {/* Contact for Payment Issues */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Payment Issues or Disputes?</h3>
        <p className="text-sm text-gray-700 mb-4">
          If you encounter any issues with payment, contact our support team within 48 hours of the transaction:
        </p>
        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> support@thessah.ae</p>
          <p><strong>Phone:</strong> +971 (UAE)</p>
          <p><strong>Hours:</strong> Saturday - Thursday, 9 AM - 6 PM UAE Time</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-10 pt-6 border-t border-gray-300">
        <strong>Last Updated:</strong> January 2026
      </p>
    </div>
  );
}
