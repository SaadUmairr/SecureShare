import { Code, LockIcon, ShieldIcon, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import GithubIcon from '../../public/github.svg';
import { Footer } from './footer';
import { Navbar } from './navbar';
import { Button } from './ui/button';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      {/* Header section */}
      <div className="bg-indigo-600 py-16 text-white dark:bg-indigo-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">About SecureShare</h1>
          <p className="mx-auto max-w-2xl text-xl">
            Not just a project — a mission, a community, and a tool for
            everyone.
          </p>
        </div>
      </div>

      {/* Main content section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xl leading-relaxed text-slate-700 dark:text-slate-300">
            SecureShare isn&apos;t a product — it&apos;s a mission, a community,
            and a tool we&apos;re building together to make private, secure file
            sharing available to everyone.
          </p>
          <p className="mb-10 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            We believe privacy isn&apos;t a luxury — it&apos;s a right. And
            sharing your files shouldn&apos;t mean giving up your secrets to
            companies, servers, or middlemen. That&apos;s why we built
            SecureShare.
          </p>

          <h2 className="mb-6 text-2xl font-bold dark:text-white">
            A quick peek at what we&apos;re about:
          </h2>

          {/* Core values cards */}
          <div className="mb-12 space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                  <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">
                  Open-source always
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                You can see, audit, or even fork our entire codebase. We&apos;re
                not hiding anything. Ever.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                  <LockIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">
                  End-to-end encryption
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                Your files and messages are encrypted on your device before
                they&apos;re shared. Only the intended recipient can open them —
                not us, not anyone else.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/50">
                  <ShieldIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">
                  Zero-knowledge at the core
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                We designed SecureShare so we can&apos;t read or access your
                files. We don&apos;t want to — and we couldn&apos;t even if we
                tried.
              </p>
            </div>
          </div>

          {/* Key storage section */}
          <div className="mb-12 rounded-lg bg-amber-50 p-6 dark:bg-amber-950/30">
            <h2 className="mb-4 text-2xl font-bold text-amber-800 dark:text-amber-400">
              But wait — what about keys?
            </h2>
            <p className="mb-4 text-amber-800 dark:text-amber-300">
              Yes, we do store user keys (for now), but they are
              <span className="font-bold">
                encrypted before they even leave your device
              </span>
              . This means:
            </p>
            <ul className="mb-4 space-y-2 pl-6 text-amber-800 dark:text-amber-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-amber-600 dark:text-amber-400">
                  •
                </span>
                Your keys never touch our servers in raw form.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-amber-600 dark:text-amber-400">
                  •
                </span>
                We can&apos;t decrypt your data.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-amber-600 dark:text-amber-400">
                  •
                </span>
                You stay in control.
              </li>
            </ul>
            <p className="text-amber-800 dark:text-amber-300">
              We&apos;re always looking for better ways to balance convenience
              with privacy — and we&apos;ll keep evolving based on your
              feedback.
            </p>
          </div>

          {/* Community section */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold dark:text-white">
              It&apos;s not just tech. It&apos;s people.
            </h2>
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              SecureShare is shaped by its community. From testers to
              developers, designers to documentarians — everyone is welcome to
              contribute. We&apos;re here to build something meaningful
              together.
            </p>
            <div className="flex flex-col items-center rounded-lg bg-indigo-50 p-6 text-center dark:bg-indigo-900/30">
              <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-indigo-100 p-4 dark:bg-indigo-800">
                  <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="mb-6 text-lg font-medium text-indigo-800 dark:text-indigo-300">
                SecureShare is for everyone who believes privacy shouldn&apos;t
                be complicated — and we&apos;re glad you&apos;re here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="bg-indigo-50 py-16 dark:bg-indigo-950/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold dark:text-white">
            Want to help?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-700 dark:text-slate-300">
            Join our growing community of privacy advocates and contributors.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/community">
              <Button className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                Join the Community
              </Button>
            </Link>
            <Link
              href="https://github.com/SaadUmairr/SecureShare"
              className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-900 dark:border-slate-600"
            >
              <Image src={GithubIcon} alt="Github" height={20} width={20} />
              Contribute on GitHub
            </Link>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}

// Make sure to import ShieldIcon at the top:
// import { ShieldIcon } from 'lucide-react';
