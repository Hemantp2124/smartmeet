'use client';

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="glass p-8 rounded-2xl space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-400 mb-4">
              By accessing or using the SupersmartX platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-gray-400 mb-4">
              SupersmartX provides an AI-powered meeting assistant that helps users transcribe, summarize, and extract insights from their meetings. The Service includes various features such as automated note-taking, action item tracking, and meeting analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p className="text-gray-400 mb-4">
              To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>
            <p className="text-gray-400 mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 mb-4">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Upload or share any content that is unlawful, harmful, or infringes on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service or its related systems</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Use the Service to create a competing product or service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-400 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of SupersmartX and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of SupersmartX.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Subscription and Payments</h2>
            <p className="text-gray-400 mb-2">
              Certain features of the Service may require payment. By selecting a subscription plan, you agree to pay the specified fees. We use third-party payment processors and your payment information is subject to their privacy policies and terms of service.
            </p>
            <p className="text-gray-400">
              Subscriptions automatically renew unless canceled before the end of the current billing period. You may cancel your subscription at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
            <p className="text-gray-400 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-400 mb-4">
              In no event shall SupersmartX, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-400 mb-4">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="text-gray-400">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-400 mt-2">
              Email: <a href="mailto:legal@supersmartx.com" className="text-purple-400 hover:underline">legal@supersmartx.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
