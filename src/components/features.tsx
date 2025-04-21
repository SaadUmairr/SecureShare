import {
  CloudIcon,
  KeyIcon,
  LockIcon,
  Share2Icon,
  ShieldIcon,
  ZapIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Footer, Navbar } from './homepage';
import { Button } from './ui/button';

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Header section with title and description */}
      <div className="bg-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Powerful Security Features
          </h1>
          <p className="mx-auto max-w-2xl text-xl">
            SecureShare provides end-to-end encryption with a focus on privacy
            and security. Your data remains yours, always.
          </p>
        </div>
      </div>

      {/* Main features grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Feature 1 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3">
                <LockIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">End-to-End Encryption</h3>
            </div>
            <p className="mb-4 text-slate-600">
              All files are encrypted before they leave your device and can only
              be decrypted by someone with the correct passphrase.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                AES-256 encryption standard
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Client-side encryption/decryption only
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                No plaintext data ever leaves your browser
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3">
                <KeyIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Secure Key Management</h3>
            </div>
            <p className="mb-4 text-slate-600">
              Your encryption keys are generated locally and never shared in
              their raw form.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Keys generated in your browser
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Private keys are encrypted with your passphrase
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Optional key backup with strong encryption
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3">
                <Share2Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Secure File Sharing</h3>
            </div>
            <p className="mb-4 text-slate-600">
              Share files securely using unique links and passphrases that only
              the recipient knows.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Encrypted file links
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Optional expiration dates
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Download limits for added security
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3">
                <ShieldIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Zero Knowledge Architecture</h3>
            </div>
            <p className="mb-4 text-slate-600">
              Our servers never see your unencrypted files or encryption keys,
              providing true privacy.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                No way for us to access your data
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Protected from server breaches
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Immune to legal demands for your data
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3">
                <CloudIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">File Management</h3>
            </div>
            <p className="mb-4 text-slate-600">
              Organize, share, and manage all your encrypted files from a simple
              interface.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Folder organization
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                File version history
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Easy sharing management
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3">
                <ZapIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Fast Performance</h3>
            </div>
            <p className="mb-4 text-slate-600">
              Optimized for speed, even with large files and strong encryption.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Fast file uploads and downloads
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Parallel processing of large files
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                Optimized encryption algorithms
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to secure your files?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-700">
            Start protecting your data with end-to-end encryption today.
            It&apos;s free to get started.
          </p>
          <Link href="/login">
            <Button className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
