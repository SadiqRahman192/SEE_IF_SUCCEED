import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Privacy Policy</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to Event Planner. We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or household ("personal information"). Personal information we collect includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li><strong>Personal Identifiers:</strong> Name, email address, phone number, and account login information.</li>
            <li><strong>Event Details:</strong> Information related to events you create, including titles, descriptions, dates, locations, and guest lists.</li>
            <li><strong>Usage Data:</strong> Information about how you access and use our services, such as IP address, browser type, pages viewed, and time spent on pages.</li>
            <li><strong>Device Information:</strong> Information about the device you use to access our services, including hardware model, operating system, and unique device identifiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li>To provide, operate, and maintain our services.</li>
            <li>To improve, personalize, and expand our services.</li>
            <li>To understand and analyze how you use our services.</li>
            <li>To develop new products, services, features, and functionality.</li>
            <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the service, and for marketing and promotional purposes.</li>
            <li>To process your transactions and manage your event planning.</li>
            <li>To find and prevent fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Disclosure of Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We may share your information with third parties in the following situations:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li><strong>With Service Providers:</strong> We may share your personal information with third-party service providers to perform functions on our behalf, such as hosting, data analysis, payment processing, and customer service.</li>
            <li><strong>For Business Transfers:</strong> We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
            <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Security of Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">6. Your Data Protection Rights</h2>
          <p className="text-gray-600 leading-relaxed">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li>The right to access, update or to delete the information we have on you.</li>
            <li>The right of rectification.</li>
            <li>The right to object.</li>
            <li>The right of restriction.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            To exercise any of these rights, please contact us using the contact details provided below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">7. Changes to This Privacy Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">8. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li>By email: privacy@eventplanner.com</li>
            <li>By visiting this page on our website: <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
