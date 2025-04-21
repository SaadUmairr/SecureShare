import { Footer, Navbar } from './homepage';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Header */}
      <div className="bg-slate-800 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-slate-300">Last updated: April 21, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm">
          <div className="prose max-w-none">
            <h2 className="mt-0 text-2xl font-bold">1. Introduction</h2>
            <p>
              Welcome to SecureShare. By accessing or using our website, mobile
              applications, or services (collectively, the
              &quot;Services&quot;), you agree to be bound by these Terms of
              Service (&quot;Terms&quot;). Please read them carefully.
            </p>
            <p>
              If you do not agree to these Terms, you may not access or use the
              Services. These Terms constitute a legally binding agreement
              between you and SecureShare (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;).
            </p>

            <h2 className="mt-8 text-2xl font-bold">2. Using Our Services</h2>
            <p>
              <strong>a. Eligibility.</strong> You must be at least 16 years old
              to use our Services. By using our Services, you represent that you
              meet this requirement.
            </p>
            <p>
              <strong>b. Account Creation.</strong> To use certain features, you
              may need to create an account. You are responsible for maintaining
              the confidentiality of your account credentials and for all
              activities under your account.
            </p>
            <p>
              <strong>c. Encryption Keys and Data.</strong> You are solely
              responsible for managing and safeguarding your encryption keys and
              passphrases. Due to our zero-knowledge architecture, if you lose
              your encryption keys or passphrases, we cannot recover your data.
            </p>

            <div className="my-6 border-l-4 border-yellow-600 bg-yellow-50 p-4">
              <h3 className="mt-0 text-lg font-bold">Important Notice</h3>
              <p className="mb-0">
                We cannot access, decrypt, or recover your files if you lose
                your encryption keys or passphrases. It is critical that you
                safely store this information.
              </p>
            </div>

            <h2 className="mt-8 text-2xl font-bold">3. Acceptable Use</h2>
            <p>When using our Services, you agree not to:</p>
            <ul className="list-disc pl-5">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Share malicious software or content</li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users&apos; accounts
              </li>
              <li>Use our Services to store or share illegal content</li>
              <li>
                Engage in any activity that interferes with or disrupts our
                Services
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold">4. Privacy and Security</h2>
            <p>
              Our Privacy Policy explains how we handle your information. By
              using our Services, you agree to our collection, use, and sharing
              of information as described in our Privacy Policy.
            </p>
            <p>
              While we implement industry-standard security measures, no system
              is completely secure. You acknowledge that you provide your data
              at your own risk.
            </p>

            <h2 className="mt-8 text-2xl font-bold">
              5. Intellectual Property
            </h2>
            <p>
              <strong>a. Our Content.</strong> The software, graphics, design,
              and other elements of our Services are protected by intellectual
              property rights. You may not copy, modify, or create derivative
              works based on our Services.
            </p>
            <p>
              <strong>b. Open Source.</strong> Some components of our Services
              are offered under open source licenses. Nothing in these Terms
              prevents you from using such components in accordance with their
              respective licenses.
            </p>
            <p>
              <strong>c. Your Content.</strong> You retain all rights to the
              content you upload, store, or share through our Services.
            </p>

            <h2 className="mt-8 text-2xl font-bold">6. Termination</h2>
            <p>
              We may suspend or terminate your access to our Services at any
              time for violations of these Terms or for any other reason at our
              discretion. You may terminate your account at any time.
            </p>
            <p>
              Upon termination, your right to use the Services will cease
              immediately. Any provisions of these Terms that by their nature
              should survive termination shall survive termination.
            </p>

            <h2 className="mt-8 text-2xl font-bold">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages, including lost profits, arising out of or relating to
              your use of or inability to use our Services.
            </p>
            <p>
              Our total liability for any claims relating to these Terms or our
              Services shall not exceed the amount you paid us, if any, for the
              use of our Services during the twelve (12) months preceding the
              claim.
            </p>

            <h2 className="mt-8 text-2xl font-bold">
              8. Disclaimer of Warranties
            </h2>
            <p>
              Our Services are provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied, including, but not limited to, implied warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>

            <h2 className="mt-8 text-2xl font-bold">9. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will provide notice of
              material changes by posting the updated Terms on our website or
              via email. Your continued use of our Services after such changes
              constitutes your acceptance of the new Terms.
            </p>

            <h2 className="mt-8 text-2xl font-bold">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the state of California,
              without regard to its conflict of law principles. Any disputes
              arising from these Terms or our Services shall be resolved
              exclusively in the courts of San Francisco County, California.
            </p>

            <h2 className="mt-8 text-2xl font-bold">11. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
              <br />
              Email: legal@secureshare.example.com
              <br />
              Address: 123 Privacy Ave, Suite 456, Securityville, CA 94321
            </p>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
