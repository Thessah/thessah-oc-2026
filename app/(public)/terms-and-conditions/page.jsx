export const metadata = {
  title: 'Terms & Conditions - Thessah Jewellery – Where Elegance Meets Craftsmanship',
  description: 'Thessah Jewellery offers beautifully crafted designs made to shine forever. Find luxury jewellery pieces perfect for weddings, gifts, and everyday elegance.',
};

export default function TermsAndConditions() {
  return (
    <div style={{ maxWidth: '1250px' }} className="mx-auto py-12 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions for Jewelry & Gold</h1>

      <p className="mb-6">
        Welcome to <strong>Thessah.ae</strong> (the "Website"), operated by
        <strong> Thessah</strong>. By accessing or using the Website, you agree to
        comply with these Terms & Conditions. These terms apply specifically to the 
        sale of jewelry and gold products. Please read them carefully. If you do not 
        agree with any part of these terms, do not use the Website.
      </p>

      {/* 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        1. General Information
      </h2>
      <p className="mb-4">
        Thessah.ae ("we", "our", "us") is a premium online jewelry and gold trading platform 
        licensed to operate in the United Arab Emirates (UAE). All jewelry and gold products 
        sold through our platform comply with UAE regulations including <strong>Standard 
        Emirates 4652 (Hallmarking)</strong> and International Organization for Standardization (ISO) standards. 
        By using the Website, you confirm that you are at least <strong>18 years old</strong>, 
        or that you are accessing it under the supervision of a parent or legal guardian.
      </p>

      {/* 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        2. Account & Registration
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You may browse the website without creating an account.</li>
        <li>
          If you create an account, you are responsible for maintaining the
          confidentiality of your login credentials.
        </li>
        <li>
          You agree to provide accurate, complete, and updated information during
          registration, including your full name and delivery address within the UAE.
        </li>
        <li>
          All customers purchasing gold or jewelry items are subject to verification 
          as per UAE anti-money laundering regulations.
        </li>
      </ul>

      {/* 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        3. Gold & Jewelry Product Information
      </h2>
      <p className="mb-4">
        All gold jewelry sold on Thessah.ae is certified and hallmarked according to UAE 
        standards (ES 4652 and international standards). Product information includes:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Purity:</strong> All gold is marked with its fineness (e.g., 18K, 21K, 22K, 24K)</li>
        <li><strong>Weight:</strong> Weights are provided in grams and verified through certified scales</li>
        <li><strong>Hallmark & Maker's Mark:</strong> Every item displays official UAE hallmarking</li>
        <li><strong>Gemstone Details:</strong> Where applicable, gemstone origin and treatment are disclosed</li>
        <li><strong>Pricing:</strong> Prices include the current gold rate plus craftsmanship charges</li>
      </ul>
      <p className="mb-4">
        Minor variations in weight (±0.5g) may occur during crafting. We make reasonable efforts 
        to ensure accuracy, but Thessah.ae reserves the right to correct any inaccuracies without prior notice.
      </p>

      {/* 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        4. Gold Pricing & Market Rates
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          All prices are shown in <strong>AED</strong> and include applicable UAE VAT (5%) 
          where applicable. Gold rates are updated daily based on international spot prices.
        </li>
        <li>
          Product pricing comprises: <strong>(Current Gold Rate per gram × Weight) + Craftsmanship Charge</strong>
        </li>
        <li>
          Customers are provided with a detailed breakdown of gold cost and craftsmanship 
          charges at checkout.
        </li>
        <li>
          We reserve the right to update gold rates throughout the day. Prices are locked 
          once an order is confirmed and paid.
        </li>
        <li>
          Shipping fees and taxes are calculated at checkout. International orders may incur 
          additional customs duties in the destination country (customer responsibility).
        </li>
      </ul>

      {/* 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        5. Payment & Order Confirmation
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Accepted payment methods include Credit/Debit Cards, Online Banking, and 
          Cash on Delivery (COD) for select locations within the UAE.
        </li>
        <li>
          All transactions are processed securely. Payment is required before jewelry 
          items are prepared for shipment.
        </li>
        <li>
          An order is considered confirmed only after full payment is received and verified.
        </li>
        <li>
          A detailed invoice including gold purity, weight, hallmark information, and 
          pricing breakdown will be provided with every purchase.
        </li>
      </ul>

      {/* 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        6. Order Acceptance & Cancellation
      </h2>
      <p className="mb-4">
        An order is considered accepted only after confirmation from us. We may
        cancel or refuse an order due to:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Product unavailability or out of stock</li>
        <li>Incorrect pricing or product information</li>
        <li>Suspicious or fraudulent activity</li>
        <li>Invalid or failed payment</li>
        <li>AML/KYC verification failure or documentation issues</li>
      </ul>
      <p className="mb-4">
        Cancellations must be requested within <strong>24 hours of order placement</strong>. 
        After this period, the jewelry item will enter the crafting phase and cancellations 
        may incur a 10% processing fee.
      </p>

      {/* 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        7. Shipping & Delivery
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          All jewelry orders are shipped via <strong>insured courier services</strong> within 
          the UAE and internationally.
        </li>
        <li>
          Delivery timelines: Within UAE typically 2-5 business days; international 
          shipping 7-21 business days depending on destination.
        </li>
        <li>
          High-value jewelry items require signature on delivery. Customers must be present 
          or authorize a representative to receive packages.
        </li>
        <li>
          We are not responsible for delays caused by logistics partners, customs clearance, 
          weather conditions, or other unforeseen circumstances.
        </li>
        <li>
          Customers must provide accurate shipping information. Thessah.ae is not liable 
          for failed deliveries due to incorrect addresses.
        </li>
        <li>
          International shipments may be subject to customs duties, taxes, and import permits 
          in the destination country (customer responsibility).
        </li>
      </ul>

      {/* 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        8. Returns, Refunds & Exchanges
      </h2>
      <p className="mb-4">
        Our return and exchange policy is as follows:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>Return Period:</strong> Jewelry items may be returned within 14 days of 
          delivery for exchange or refund (as per UAE consumer protection law).
        </li>
        <li>
          <strong>Condition Requirements:</strong> Items must be unused, unaltered, in original 
          packaging, and with all hallmarking intact. Signs of wear, resizing, or soldering 
          will result in return rejection.
        </li>
        <li>
          <strong>Refund Processing:</strong> Refunds are issued to the original payment 
          method within 7-10 business days of approval. Return shipping must be paid by the customer.
        </li>
        <li>
          <strong>Gold Refunds:</strong> If the current gold rate has changed between purchase 
          and return, refunds will be calculated at the rate on the return date, not the purchase date.
        </li>
        <li>
          <strong>Exchanges:</strong> Customers may exchange jewelry for items of equal or 
          higher value. If exchanging for lower value, the difference will be refunded minus 10% processing fee.
        </li>
        <li>
          <strong>Custom Orders:</strong> Customized or bespoke jewelry items are non-returnable 
          unless defective.
        </li>
      </ul>

      {/* 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        9. Quality Assurance & Authentication
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Every gold jewelry item is tested for purity using certified assay methods and 
          bears official UAE hallmarking.
        </li>
        <li>
          Gemstones are sourced from reputable suppliers. Where applicable, gemstone authenticity 
          documentation will be provided.
        </li>
        <li>
          Defective items (e.g., broken stones, defective clasps, cracks in metal) may be 
          returned within 48 hours of receipt for replacement.
        </li>
        <li>
          Wear and tear from normal use is not considered a defect and is not eligible for returns.
        </li>
      </ul>

      {/* 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        10. User Conduct
      </h2>
      <p className="mb-4">
        You agree not to:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Use the website for unlawful, fraudulent, or misleading purposes.</li>
        <li>Engage in money laundering, terrorist financing, or sanctions evasion.</li>
        <li>Copy, reproduce, or distribute product images and descriptions without permission.</li>
        <li>Attempt to disrupt website operations using malware or harmful software.</li>
        <li>Resell jewelry items as "new" if they have been worn or altered.</li>
      </ul>

      {/* 11 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        11. Intellectual Property & Product Images
      </h2>
      <p className="mb-4">
        All content on Thessah.ae, including jewelry images, designs, logos, descriptions, 
        and graphics, is the property of <strong>Thessah</strong> and/or its content providers 
        and is protected under applicable intellectual property laws. Product images are for 
        reference only; actual jewelry items may have minor variations in appearance due to 
        lighting, screen resolution, and hand-crafting.
      </p>

      {/* 12 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        12. Limitation of Liability
      </h2>
      <p className="mb-4">
        Thessah shall not be liable for any indirect, incidental, special, or consequential 
        damages arising from the use of the Website, jewelry products, or services. Our 
        liability is limited to the value of the jewelry item purchased.
      </p>

      {/* 13 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        13. Gold Rate Fluctuations & Price Changes
      </h2>
      <p className="mb-4">
        Gold prices fluctuate based on international market conditions. While we strive to 
        provide current rates, prices displayed on the website are subject to change at any 
        time. Your order price is locked at the time of payment confirmation. We are not 
        responsible for losses incurred due to market fluctuations after order placement.
      </p>

      {/* 14 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        14. Third-Party Links
      </h2>
      <p className="mb-4">
        The Website may contain links to third-party websites. We are not responsible for 
        their content, policies, or practices.
      </p>

      {/* 15 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        15. Changes to Terms
      </h2>
      <p className="mb-4">
        We reserve the right to update or modify these Terms & Conditions at any time. 
        Continued use of the Website indicates acceptance of the revised terms. Major 
        changes will be notified via email or website announcement.
      </p>

      {/* 16 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        16. Data Privacy & Anti-Money Laundering
      </h2>
      <p className="mb-4">
        Thessah.ae complies with UAE data protection regulations and anti-money laundering 
        (AML) laws. Customer information is used solely for order processing and customer 
        service. Customers purchasing gold or jewelry items may be required to provide 
        identification and proof of address as per AML/KYC requirements.
      </p>

      {/* 17 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        17. Contact Information
      </h2>
      <p className="mb-2">
        If you have any questions regarding these Terms & Conditions, please
        contact us:
      </p>

      <p className="font-semibold">Business Name: Thessah</p>
      <p className="font-semibold">Website: https://www.thessah.ae</p>
      <p className="font-semibold">Email: support@thessah.ae</p>
      <p className="font-semibold mb-10">Customer Support (UAE): +971</p>

      {/* 18 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">18. Governing Law & Jurisdiction</h2>
      <p className="mb-4">
        These Terms & Conditions are governed by the laws of the United Arab
        Emirates and comply with UAE Code of Civil Procedure, the UAE Consumer Protection Law, and 
        international gold trading standards. Any disputes arising from the purchase of 
        jewelry or gold items shall be subject to the exclusive jurisdiction of the UAE courts 
        and the Dubai International Arbitration Centre (DIAC) if necessary, without prejudice 
        to any mandatory consumer protections under applicable law.
      </p>

      <p className="text-sm text-gray-600 mt-10 pt-6 border-t border-gray-300">
        <strong>Last Updated:</strong> January 2026
      </p>
    </div>
  );
}
