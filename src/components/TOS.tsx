import Link from "next/link"

import { Footer } from "./footer"
import { Navbar } from "./navbar"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      {/* Header */}
      <div className="bg-slate-800 py-12 text-white dark:bg-slate-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-slate-300 dark:text-slate-200">
            Last updated: April 23, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm dark:bg-slate-800 dark:text-white">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="mt-0 text-2xl font-bold text-slate-900 dark:text-white">
              1. Hey, Welcome 👋
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Thanks for checking out SecureShare! Before you dive in, we just
              need to go over a few important things. These Terms of Service
              (&quot;Terms&quot;) lay out how our service works and what&apos;s
              cool (and not cool) when using it. By using SecureShare, you agree
              to these Terms — so give it a quick read.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              2. Who Can Use SecureShare
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                a. Age Check.
              </strong>
              You need to be 16 or older to use SecureShare. If you&apos;re
              under that, unfortunately, this isn&apos;t the right place for
              you.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                b. Your Account.
              </strong>
              Some features need an account (like uploading files). You&apos;re
              in charge of your account info, including keeping your password
              safe.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                c. Your Keys, Your Data.
              </strong>
              We don&apos;t store or have access to your passphrases. That
              means: if you lose it, we can&apos;t help you get your files back.
            </p>

            <div className="my-6 border-l-4 border-yellow-600 bg-yellow-50 p-4 dark:border-yellow-500 dark:bg-slate-700">
              <h3 className="mt-0 text-lg font-bold text-slate-900 dark:text-white">
                Important Note
              </h3>
              <p className="mb-0 text-slate-700 dark:text-slate-300">
                Please save your passphrase somewhere safe. We have zero access
                to it — and we like it that way.
              </p>
            </div>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              3. What Not to Do
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              SecureShare is built for privacy and security — please don&apos;t
              misuse it. You agree not to:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li>Break the law while using our service</li>
              <li>Share stuff that doesn&apos;t belong to you</li>
              <li>Upload viruses, malware, or anything shady</li>
              <li>
                Hack or try to gain unauthorized access to anyone&apos;s files
              </li>
              <li>Use SecureShare to store or distribute illegal content</li>
              <li>Mess with the site or other users</li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              4. Your Privacy + Security
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              We take privacy seriously. Check out our Privacy Policy to see how
              we handle your data. Spoiler: we keep it minimal.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              That said, no system is 100% bulletproof. By using SecureShare,
              you acknowledge the risks of putting any data online.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              5. Ownership Stuff
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                a. Our Stuff.
              </strong>
              &nbsp; We built SecureShare, and all the design/code/features
              belong to us. You can&apos;t use our branding, copy our product,
              or build a clone.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                b. Open Source Bits.
              </strong>
              &nbsp; We love open source and use some great tools that are
              licensed under Apache 2.0. That means you&apos;re free to use,
              modify, and share those parts — just keep the license notices and
              don&apos;t use our name or branding.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                c. Your Stuff.
              </strong>
              &nbsp; Any files or content you upload? They&apos;re 100% yours.
              We don&apos;t see them, own them, or touch them.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              6. Shutting It Down
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              We reserve the right to suspend or terminate accounts that violate
              these Terms or abuse the service. You can delete your account
              anytime, too.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Some parts of these Terms (like how we handle your content or
              limit liability) still apply after you leave.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              7. Liability — The Not-So-Fun Part
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              We do our best to keep things smooth, but if something goes wrong,
              we can&apos;t be held responsible for:
            </p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li>Lost profits</li>
              <li>Data loss (especially if you lose your keys)</li>
              <li>
                Anything beyond the fees you paid us (if any) in the last 12
                months
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              8. No Fancy Promises
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              SecureShare is provided &quot;as is.&quot; That means we
              don&apos;t offer guarantees or warranties — implied or otherwise —
              around things like performance, availability, or fit for your
              particular use case.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              9. If We Update These Terms
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Sometimes we&apos;ll update these Terms. If it&apos;s a major
              change, we&apos;ll give you a heads-up via the site or email. Keep
              using SecureShare after that? It means you&apos;re okay with the
              new version.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              10. Legal Details
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              These Terms are governed by the laws of India. Any disputes or
              legal issues arising out of these Terms or your use of our
              Services shall be subject to the exclusive jurisdiction of the
              courts located in Delhi, India.
            </p>

            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              11. Need Help?
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              If you&apos;ve got any questions about this document or anything
              else legal-ish:
              <br />
              Email:
              <Link
                href="mailto:legal@secureshare.example.com"
                className="text-blue-600 dark:text-blue-400"
              >
                legal@secureshare.example.com
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  )
}
