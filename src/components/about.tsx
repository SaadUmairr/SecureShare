import { Code, Heart, LockIcon, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Github from '../../public/github.svg';
import { Footer, Navbar } from './homepage';
import { Button } from './ui/button';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Header section */}
      <div className="bg-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">About SecureShare</h1>
          <p className="mx-auto max-w-2xl text-xl">
            We&apos;re on a mission to make privacy-focused file sharing
            accessible to everyone.
          </p>
        </div>
      </div>

      {/* Our Story section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold">Our Story</h2>
          <p className="mb-4 text-slate-700">
            SecureShare began with a simple question: Why isn&apos;t truly
            private file sharing more accessible? In a world where data breaches
            and privacy violations are common, we believed that everyone
            deserves access to tools that protect their digital privacy.
          </p>
          <p className="mb-4 text-slate-700">
            Founded in 2025, we set out to create a file-sharing platform that
            puts users in complete control of their data. By implementing
            end-to-end encryption where keys never leave the user&apos;s device
            unencrypted, we&apos;ve created a solution where even we cannot
            access your files.
          </p>
          <p className="text-slate-700">
            Today, SecureShare is used by individuals and organizations who
            value privacy and security. We remain committed to our founding
            principles: privacy by design, transparency in our operations, and
            keeping our code open source for community review.
          </p>
        </div>
      </div>

      {/* Open Source section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <Code className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="mb-6 text-3xl font-bold">
              Open Source & Transparent
            </h2>
            <p className="mb-6 text-slate-700">
              We believe security and privacy tools should be transparent.
              That&apos;s why SecureShare is completely open source. Anyone can
              inspect our code, verify our security claims, and contribute
              improvements.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-6 py-3 font-medium text-white transition-colors"
            >
              <Image src={Github} alt="Github" height={20} width={20} />
              View Our GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Team Values section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-indigo-100 p-4">
                <LockIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-bold">Privacy First</h3>
            <p className="text-slate-700">
              We design every feature with privacy as the foundation. No
              exceptions, no compromises.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-indigo-100 p-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-bold">Community Driven</h3>
            <p className="text-slate-700">
              We believe in the power of community to build better, more secure
              software through collaboration.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-indigo-100 p-4">
                <Heart className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-bold">Ethical Technology</h3>
            <p className="text-slate-700">
              We&apos;re committed to building technology that respects human
              rights and empowers users through privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Join Our Mission</h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-700">
            Whether you&apos;re a user, contributor, or supporter, you can help
            us make secure file sharing accessible to everyone.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button className="rounded-md bg-indigo-600 p-6 font-medium text-white transition-colors hover:bg-indigo-700">
                Get Started
              </Button>
            </Link>
            <Link
              href="#"
              className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-black px-6 py-3 font-medium text-white transition-colors"
            >
              <Image src={Github} alt="Github" height={20} width={20} />
              Contribute
            </Link>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
