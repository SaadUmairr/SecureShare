'use client';
import { ExternalLink, KeyIcon, KeySquareIcon, LockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Github from '../../public/github.svg';
import { Footer } from './footer';
import { Navbar } from './navbar';
import { Button } from './ui/button';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Hero Content */}
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              <span className="mb-2 block">YOUR FILES.</span>
              <span className="mb-2 block text-indigo-600 dark:text-indigo-400">
                FULLY ENCRYPTED.
              </span>
              <span className="block">COMPLETELY PRIVATE.</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              End-to-end encryption in your browser - Your keys never leave your
              device unencrypted. Share files with confidence knowing your
              privacy is protected.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
                  Start Sharing Securely
                </Button>
              </Link>
              <Link href="https://github.com/SaadUmairr/SecureShare">
                <Button className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-black px-6 py-3 font-medium text-white transition-colors dark:border-slate-700">
                  <Image src={Github} alt="Github" height={20} width={20} />
                  View on GitHub
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mb-24 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-md bg-indigo-100 p-2 dark:bg-indigo-900">
                  <LockIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold">Zero Knowledge Storage</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                We never see your keys or data. Everything encrypts and decrypts
                on your machine only, ensuring complete privacy.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-md bg-indigo-100 p-2 dark:bg-indigo-900">
                  <KeyIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold">Secure Sharing</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Share files via short links protected by unique passphrases. No
                server-side backdoors, just secure person-to-person sharing.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-md bg-indigo-100 p-2 dark:bg-indigo-900">
                  <KeySquareIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold">
                  Client-Side Key Management
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                You generate, store and protect your keys locally, giving you
                complete control over your data security.
              </p>
            </div>
          </div>

          {/* Open Source Section */}
          <div className="mb-16 rounded-xl bg-indigo-50 p-8 text-center dark:bg-indigo-900/30">
            <h2 className="mb-4 text-2xl font-bold">100% Open Source</h2>
            <p className="mx-auto mb-6 max-w-2xl text-slate-700 dark:text-slate-300">
              This project is completely open source. Check how things actually
              work, contribute improvements, or audit the code yourself.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="https://github.com/SaadUmairr/SecureShare"
                className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-black px-6 py-3 font-medium text-white transition-colors dark:border-slate-700"
              >
                <Image src={Github} alt="Github" height={20} width={20} />
                View Source Code
              </Link>
              <Link
                href="https://github.com/SaadUmairr/SecureShare/blob/main/README.md"
                className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <ExternalLink size={18} />
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
