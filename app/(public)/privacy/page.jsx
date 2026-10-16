export default function Privacy() {
  return (
    <div style={{ maxWidth: '1250px' }} className="mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6">
        <strong>Effective Date:</strong> January 2026
      </p>

      <p className="mb-6">
        At <strong>Thessah.ae</strong>, we are committed to protecting your privacy and ensuring 
        you have a positive experience on our website. This Privacy Policy explains how we collect, 
        use, disclose, and safeguard your information when you visit our platform, including any 
        related applications, and purchase jewelry or gold products.
      </p>

      {/* 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        1. Information We Collect
      </h2>
      <p className="mb-4">We collect information in the following ways:</p>

      <h3 className="text-lg font-semibold mt-4 mb-2">1.1 Information You Provide Directly</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Account Registration:</strong> Name, email address, phone number, password</li>
        <li><strong>Shipping & Billing:</strong> Full address, emirate, postal code, phone number</li>
        <li><strong>Payment Information:</strong> Credit/debit card details (processed securely via payment gateways; we do not store full card numbers)</li>
        <li><strong>Communication:</strong> Messages, inquiries, feedback, and product reviews</li>
        <li><strong>KYC/AML Verification:</strong> Identity documents (passport/Emirates ID), proof of address for high-value gold purchases</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">1.2 Information Collected Automatically</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
        <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, search queries</li>
        <li><strong>IP Address & Location:</strong> General location (city/emirate level, not exact coordinates)</li>
        <li><strong>Cookies & Tracking:</strong> Session cookies, persistent cookies, pixels (see Cookies section below)</li>
        <li><strong>Analytics:</strong> Google Analytics, heatmaps, conversion tracking</li>
      </ul>

      <h3 className="text-lg font-semibold mt-4 mb-2">1.3 Information from Third Parties</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Payment processors (to verify transactions)</li>
        <li>Shipping & logistics partners (for delivery tracking)</li>
        <li>Fraud detection services</li>
        <li>Social media platforms (if you link your accounts)</li>
      </ul>

      {/* 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Order Processing:</strong> Fulfilling purchases, calculating shipping, processing refunds</li>
        <li><strong>Customer Service:</strong> Responding to inquiries, resolving complaints, managing returns</li>
        <li><strong>Payment Processing:</strong> Securely processing transactions with PCI-DSS compliant processors</li>
        <li><strong>KYC/AML Compliance:</strong> Verifying customer identity and preventing money laundering per UAE regulations</li>
        <li><strong>Marketing & Communications:</strong> Sending newsletters, promotional offers, product updates (with your consent)</li>
        <li><strong>Website Improvement:</strong> Analyzing user behavior, personalizing content, enhancing user experience</li>
        <li><strong>Fraud Prevention:</strong> Detecting and preventing unauthorized transactions and account abuse</li>
        <li><strong>Legal Compliance:</strong> Meeting UAE legal obligations, responding to government requests</li>
        <li><strong>Gold Rate Updates:</strong> Notifying you of price changes and market alerts</li>
      </ul>

      {/* 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        3. How We Share Your Information
      </h2>
      <p className="mb-4">
        <strong>We DO NOT sell your personal data to third parties.</strong> However, we share information in these cases:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Service Providers:</strong> Payment processors, shipping companies, email providers (under confidentiality agreements)</li>
        <li><strong>Legal Compliance:</strong> UAE authorities when required by law or court order</li>
        <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets (with notice)</li>
        <li><strong>Fraud Prevention:</strong> Fraud detection and prevention services</li>
        <li><strong>Your Consent:</strong> When you explicitly agree to share information</li>
      </ul>

      {/* 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        4. Data Retention
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Account Information:</strong> Retained for the duration of your account and 3 years after closure (for legal/tax purposes)</li>
        <li><strong>Transaction Records:</strong> Retained for 7 years per UAE tax regulations</li>
        <li><strong>KYC/AML Documents:</strong> Retained for 5 years per UAE AML regulations</li>
        <li><strong>Marketing Data:</strong> Retained until you unsubscribe</li>
        <li><strong>Cookies:</strong> Session cookies deleted when you close your browser; persistent cookies last up to 1 year</li>
      </ul>

      {/* 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        5. Cookies & Tracking Technologies
      </h2>
      <p className="mb-4">
        We use cookies and similar technologies to enhance your experience:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Essential Cookies:</strong> Required for website functionality (login, cart, checkout)</li>
        <li><strong>Performance Cookies:</strong> Analytics to measure website performance and user engagement (Google Analytics)</li>
        <li><strong>Marketing Cookies:</strong> Retargeting ads on social media and other platforms (Facebook Pixel, Google Ads)</li>
        <li><strong>Personalization Cookies:</strong> Remembering preferences, recently viewed items, wishlist</li>
      </ul>
      <p className="mb-4">
        <strong>You can disable cookies in your browser settings,</strong> but some functionality may be limited.
      </p>

      {/* 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        6. Data Security
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>SSL Encryption:</strong> All data transmitted over HTTPS with 256-bit encryption</li>
        <li><strong>PCI DSS Compliance:</strong> Payment processing meets international security standards</li>
        <li><strong>Secure Servers:</strong> Data stored on secured, firewalled servers with access controls</li>
        <li><strong>Employee Training:</strong> Staff trained on data protection and confidentiality</li>
        <li><strong>Regular Audits:</strong> Security assessments and penetration testing conducted regularly</li>
      </ul>
      <p className="mb-4">
        <strong>Note:</strong> While we implement strong security measures, no system is 100% secure. 
        We cannot guarantee absolute protection against unauthorized access.
      </p>

      {/* 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        7. Your Privacy Rights & Choices
      </h2>
      <p className="mb-4">Under UAE personal data protection laws, you have the right to:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Access:</strong> Request a copy of your personal data</li>
        <li><strong>Correction:</strong> Update or correct inaccurate information</li>
        <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
        <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails at any time</li>
        <li><strong>Data Portability:</strong> Request your data in a portable format</li>
        <li><strong>Restrict Processing:</strong> Request limitation of how your data is used</li>
      </ul>
      <p className="mb-4">
        To exercise these rights, contact us at <strong>support@thessah.ae</strong> with your request and proof of identity.
      </p>

      {/* 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        8. Automated Decision-Making & Profiling
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Fraud Detection:</strong> We use automated systems to detect suspicious transactions and prevent fraud</li>
        <li><strong>Personalization:</strong> Algorithms recommend products based on your browsing and purchase history</li>
        <li><strong>AML Screening:</strong> Automated checks against sanctions lists and AML watchlists</li>
      </ul>
      <p className="mb-4">
        You have the right to request human review of automated decisions. Contact us for details.
      </p>

      {/* 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        9. Third-Party Links & Services
      </h2>
      <p className="mb-4">
        Our website may contain links to third-party websites and integrations (social media, payment gateways). 
        <strong> We are not responsible for their privacy practices.</strong> Please review their privacy policies before 
        providing personal information.
      </p>

      {/* 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        10. Children's Privacy
      </h2>
      <p className="mb-4">
        Thessah.ae is not intended for individuals under 18 years old. We do not knowingly collect 
        data from children. If we become aware of data from a minor, we will delete it promptly. 
        Parents/guardians concerned about their child's data should contact us immediately.
      </p>

      {/* 11 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        11. International Data Transfers
      </h2>
      <p className="mb-4">
        Your data is primarily stored in the UAE. If we transfer data internationally (e.g., to payment processors 
        or cloud providers), we ensure adequate safeguards and compliance with UAE data protection regulations.
      </p>

      {/* 12 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        12. Anti-Money Laundering (AML) & Know Your Customer (KYC)
      </h2>
      <p className="mb-4">
        Thessah.ae complies with UAE AML/CFT regulations and Central Bank of UAE requirements. We may:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Request identity verification for high-value transactions (gold purchases over AED 50,000)</li>
        <li>Conduct customer due diligence and ongoing transaction monitoring</li>
        <li>Screen customers against international sanctions lists</li>
        <li>Report suspicious transactions to financial intelligence units as legally required</li>
        <li>Retain KYC documents for 5 years after transaction completion</li>
      </ul>

      {/* 13 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        13. Email & Marketing Communications
      </h2>
      <p className="mb-4">
        <strong>Opt-In Model:</strong> We send promotional emails only if you have opted in. Each email includes an "Unsubscribe" link.
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Newsletter: Weekly/monthly updates on new jewelry, gold rates, and special offers</li>
        <li>Transactional Emails: Order confirmations, shipping updates, invoices (required for order fulfillment)</li>
        <li>Abandoned Cart: Reminders if you leave items in your cart (only if opted in)</li>
        <li>Personalized Recommendations: Products based on your browsing history</li>
      </ul>

      {/* 14 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        14. Social Media & Retargeting Ads
      </h2>
      <p className="mb-4">
        We may use retargeting pixels from platforms like Facebook, Instagram, and Google to show you 
        relevant jewelry ads. You can opt out of targeted advertising in your platform settings:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Facebook: Settings → Ads → Ad Preferences</li>
        <li>Google: Google Account → Data & Privacy → Ad Settings</li>
        <li>Instagram: Settings → Ads → Ad Preferences</li>
      </ul>

      {/* 15 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        15. Policy Updates & Changes
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy to reflect changes in technology, law, or our practices. 
        Major changes will be announced via email or website notification. Continued use of the website 
        indicates acceptance of the updated policy.
      </p>

      {/* 16 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        16. Data Protection Officer & Complaints
      </h2>
      <p className="mb-4">
        If you have concerns about how we handle your data or wish to file a complaint:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Contact us first: <strong>support@thessah.ae</strong></li>
        <li>We will respond within 30 days</li>
        <li>If unresolved, you may lodge a complaint with the UAE authorities</li>
      </ul>

      {/* 17 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        17. Contact Us
      </h2>
      <p className="mb-4">
        For privacy-related inquiries, data access requests, or concerns:
      </p>

      <p className="font-semibold">Business Name: Thessah</p>
      <p className="font-semibold">Website: https://www.thessah.ae</p>
      <p className="font-semibold">Email: support@thessah.ae</p>
      <p className="font-semibold">Customer Support (UAE): +971</p>

      <p className="text-sm text-gray-600 mt-10 pt-6 border-t border-gray-300">
        <strong>Last Updated:</strong> January 2026
      </p>
    </div>
  );
}
