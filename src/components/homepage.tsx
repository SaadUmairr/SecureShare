'use client';
import { ExternalLink, KeyIcon, KeySquareIcon, LockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Github from '../../public/github.svg';
import { Button } from './ui/button';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 md:py-24">
          {/* Hero Content */}
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              <span className="mb-2 block">YOUR FILES.</span>
              <span className="mb-2 block text-indigo-600">
                FULLY ENCRYPTED.
              </span>
              <span className="block">COMPLETELY PRIVATE.</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
              End-to-end encryption in your browser - Your keys never leave your
              device unencrypted. Share files with confidence knowing your
              privacy is protected.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700">
                  Get Started - It&apos;s Free
                </Button>
              </Link>
              <Button className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-black px-6 py-3 font-medium text-white transition-colors">
                <Image src={Github} alt="Github" height={20} width={20} />
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mb-24 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-md bg-indigo-100 p-2">
                  <LockIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold">Zero Knowledge Storage</h3>
              </div>
              <p className="text-slate-600">
                We never see your keys or data. Everything encrypts and decrypts
                on your machine only, ensuring complete privacy.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-md bg-indigo-100 p-2">
                  <KeyIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold">Secure Sharing</h3>
              </div>
              <p className="text-slate-600">
                Share files via short links protected by unique passphrases. No
                server-side backdoors, just secure person-to-person sharing.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-md bg-indigo-100 p-2">
                  <KeySquareIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold">
                  Client-Side Key Management
                </h3>
              </div>
              <p className="text-slate-600">
                You generate, store and protect your keys locally, giving you
                complete control over your data security.
              </p>
            </div>
          </div>

          {/* Open Source Section */}
          <div className="mb-16 rounded-xl bg-indigo-50 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">100% Open Source</h2>
            <p className="mx-auto mb-6 max-w-2xl text-slate-700">
              This project is completely open source. Check how things actually
              work, contribute improvements, or audit the code yourself.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="#"
                className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-black px-6 py-3 font-medium text-white transition-colors"
              >
                <Image src={Github} alt="Github" height={20} width={20} />
                View Source Code
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 font-medium transition-colors hover:bg-slate-50"
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

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <LockIcon className="h-6 w-6 text-indigo-600" />
          <Link href="/">
            <span className="text-xl font-bold">SecureShare</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="features"
            className="text-sm font-medium transition-colors hover:text-indigo-600"
          >
            Features
          </Link>
          {/* <Link
        href="#how-it-works"
        className="text-sm font-medium transition-colors hover:text-indigo-600"
      >
        How It Works
      </Link> */}
          <Link
            href="about"
            className="text-sm font-medium transition-colors hover:text-indigo-600"
          >
            About
          </Link>
          <Link href="/login">
            <Button className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="p-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-white py-4 md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-indigo-600"
            >
              Features
            </Link>
            {/* <Link
          href="#how-it-works"
          className="text-sm font-medium transition-colors hover:text-indigo-600"
        >
          How It Works
        </Link> */}
            <Link
              href="#about"
              className="text-sm font-medium transition-colors hover:text-indigo-600"
            >
              About
            </Link>
            <Link href="/login">
              <Button className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <LockIcon className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">SecureShare</span>
            </div>
            <p className="text-sm">
              Secure, private, end-to-end encrypted file sharing for everyone.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Features
                </Link>
              </li>

              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Contribute
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Report Issues
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/tos"
                  className="transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Cookie Policy
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} SecureShare. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              <Image src={Github} alt="Github" height={20} width={20} />
            </a>
            <a href="#" className="transition-colors hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#" className="transition-colors hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
