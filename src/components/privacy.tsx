import { Footer, Navbar } from './homepage';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Header */}
      <div className="bg-slate-800 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-slate-300">Last updated: April 21, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm">
          <div className="prose max-w-none">
            <h2 className="mt-0 text-2xl font-bold">Overview</h2>
            <p>
              At SecureShare, privacy isn&apos;t just a feature – it&apos;s our
              foundation. This Privacy Policy explains how we handle your
              information when you use our services. Thanks to our end-to-end
              encryption architecture, we have minimal access to your actual
              data.
            </p>

            <h2 className="mt-8 text-2xl font-bold">Information We Collect</h2>
            <p>
              <strong>Account Information:</strong> Email address, username,
              Account Image and unique google account identifier.
            </p>
            <p>
              <strong>Usage Data:</strong> Anonymous analytics about feature
              usage, performance metrics, and error logs that contain no
              personal data or file contents.
            </p>
            {/* <p>
              <strong>Technical Information:</strong> IP address, browser type,
              device information, and cookies for essential functionality.
            </p> */}
            <p>
              <strong>Technical Information:</strong> IP address, browser type,
              device information, and cookies for essential functionality.
            </p>
            <p>
              <strong>File Metadata:</strong> File names, sizes, and encrypted
              file content that we cannot access or view.
            </p>

            <div className="my-6 border-l-4 border-indigo-600 bg-indigo-50 p-4">
              <h3 className="mt-0 text-lg font-bold">
                What We Don&apos;t Have Access To
              </h3>
              <ul className="mb-0 list-disc pl-5">
                <li>
                  Your decryption keys (generated and stored only on your
                  device)
                </li>
                <li>The contents of your files (encrypted before upload)</li>
                <li>Your passphrases in plaintext</li>
                <li>Recipients of your shared files</li>
              </ul>
            </div>

            <h2 className="mt-8 text-2xl font-bold">How We Use Information</h2>
            <p>We use the limited information we collect to:</p>
            <ul className="list-disc pl-5">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send service notifications and updates</li>
              <li>Respond to comments and questions</li>
              <li>Protect against malicious, deceptive, or illegal activity</li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold">
              Data Sharing and Disclosure
            </h2>
            <p>
              We do not sell your personal information. We may share limited
              information with:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Service Providers:</strong> Who help us operate our
                business and provide services (subject to confidentiality
                agreements)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, legal
                process, or governmental request (we have minimal data to
                provide)
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold">Data Retention</h2>
            <p>
              We retain your account information until you delete your account.
              Encrypted files are retained according to your plan settings or
              until you delete them. Usage data is retained for up to 12 months
              in an anonymized format.
            </p>

            <h2 className="mt-8 text-2xl font-bold">Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5">
              <li>Access personal information we have about you</li>
              <li>Correct inaccurate personal information</li>
              <li>Delete your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, contact us at privacy@secureshare.com
            </p>

            <h2 className="mt-8 text-2xl font-bold">Security</h2>
            <p>
              We implement industry-standard security measures to protect your
              information. Our end-to-end encryption architecture means your
              file contents and encryption keys never leave your device in an
              unencrypted form, providing an exceptional level of security.
            </p>

            <h2 className="mt-8 text-2xl font-bold">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of significant changes by posting a notice on our website or
              sending you an email.
            </p>

            <h2 className="mt-8 text-2xl font-bold">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at:
            </p>
            <p>
              Email: privacy@secureshare.com
              <br />
            </p>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
