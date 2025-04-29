import Image from 'next/image';
import Github from '../../public/github.svg';
import { LockIcon } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950">
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
                <Link
                  href="/features"
                  className="transition-colors hover:text-white"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link
                  href="/features"
                  className="transition-colors hover:text-white"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="transition-colors hover:text-white"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://github.com/SaadUmairr/SecureShare/blob/main/README.md"
                  className="transition-colors hover:text-white"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/SaadUmairr/SecureShare"
                  className="transition-colors hover:text-white"
                >
                  Contribute
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/SaadUmairr/SecureShare"
                  className="transition-colors hover:text-white"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/SaadUmairr/SecureShare/issues"
                  className="transition-colors hover:text-white"
                >
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
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} SecureShare. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/SaadUmairr/SecureShare/issues"
              className="transition-colors hover:text-white"
            >
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
