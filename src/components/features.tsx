import {
  CloudIcon,
  KeyIcon,
  LockIcon,
  Share2Icon,
  ShieldIcon,
  ZapIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Footer } from './footer';
import { Navbar } from './navbar';
import { Button } from './ui/button';

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      {/* Header section with title and description */}
      <div className="bg-indigo-600 py-16 text-white dark:bg-indigo-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">How SecureShare Works</h1>
          <p className="mx-auto max-w-2xl text-xl">
            Let&apos;s break it down in plain English — no buzzwords, just
            privacy-first technology that puts you in control.
          </p>
        </div>
      </div>

      {/* Main features grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Feature 1 */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-slate-700/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <LockIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                Everything is encrypted — before anything leaves your device
              </h3>
            </div>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              When you share a file using SecureShare, security starts right on
              your device.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Encryption happens in your browser (or app) using battle-tested
                cryptography
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                You pick who can access it with links and optional passphrases
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                We don&apos;t have the keys — even if our servers were
                compromised, your data stays safe
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-slate-700/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <KeyIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                Keys and Accounts
              </h3>
            </div>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              We&apos;ve designed a system that balances convenience with
              uncompromising security.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                We store your keys — but only after encrypting them client-side
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                We never see your actual key and can&apos;t decrypt your content
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Access your history and share across devices without
                compromising security
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-slate-700/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <Share2Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                &quot;Try it now&quot; — No Account Needed
              </h3>
            </div>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              Coming Soon: Secure sharing without even creating an account.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Just upload, enter a passphrase, and get a secure link
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Your file is encrypted with a passphrase only you know
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                We&apos;ll never see what your file contains — true privacy
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-slate-700/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <ShieldIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                Zero Knowledge Architecture
              </h3>
            </div>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              Our servers never see your unencrypted files or encryption keys,
              providing true privacy.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                No way for us to access your data
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Protected from server breaches
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Your passphrase stays with you — so do your files.
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-slate-700/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <CloudIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Core Values</h3>
            </div>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              We&apos;re building SecureShare with one thing in mind: your
              privacy.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                End-to-end encryption
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Zero-knowledge architecture
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                Open-source and community-driven
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-slate-700/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                <ZapIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                Privacy-First, Always
              </h3>
            </div>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              Tools that do what they say — and nothing more.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                No tracking
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                No ads
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  •
                </span>
                No creepy data collection
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-50 py-16 dark:bg-indigo-950/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold dark:text-white">
            Ready to secure your files?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-700 dark:text-slate-300">
            Start protecting your data with end-to-end encryption today.
            It&apos;s free to get started.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                Try Secure Sharing
              </Button>
            </Link>
            <Link href="https://github.com/SaadUmairr/SecureShare">
              <Button className="rounded-md border border-indigo-600 bg-white px-6 py-3 font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:border-indigo-400 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700">
                Join Our Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
