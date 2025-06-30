import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Terms and Conditions</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing and using EventMaster Pro ("the Service"), you agree to be bound by these Terms and Conditions ("Terms"), all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Use License</h2>
          <p className="text-gray-600 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on EventMaster Pro's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed ml-4">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>Attempt to decompile or reverse engineer any software contained on EventMaster Pro's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by EventMaster Pro at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Disclaimer</h2>
          <p className="text-gray-600 leading-relaxed">
            The materials on EventMaster Pro's website are provided on an 'as is' basis. EventMaster Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Further, EventMaster Pro does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Limitations</h2>
          <p className="text-gray-600 leading-relaxed">
            In no event shall EventMaster Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EventMaster Pro's website, even if EventMaster Pro or a EventMaster Pro authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Accuracy of Materials</h2>
          <p className="text-gray-600 leading-relaxed">
            The materials appearing on EventMaster Pro's website could include technical, typographical, or photographic errors. EventMaster Pro does not warrant that any of the materials on its website are accurate, complete or current. EventMaster Pro may make changes to the materials contained on its website at any time without notice. However EventMaster Pro does not make any commitment to update the materials.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">6. Links</h2>
          <p className="text-gray-600 leading-relaxed">
            EventMaster Pro has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EventMaster Pro of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">7. Modifications</h2>
          <p className="text-gray-600 leading-relaxed">
            EventMaster Pro may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">8. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
