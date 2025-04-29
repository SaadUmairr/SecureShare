'use client';
import { LockIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import GithubIcon from '../../public/github.svg';
import ThemeToggler from './theme-toggle';
import { Button } from './ui/button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-sm dark:bg-slate-800 dark:text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <LockIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <Link href="/">
            <span className="text-xl font-bold">SecureShare</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {/* <Button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full dark:bg-slate-950 bg-slate-200 px-3 py-1 text-sm font-medium dark:text-white backdrop-blur-3xl text-black">
              SHARE FILES NOW
            </span>
          </Button> */}

          <ThemeToggler />
          <Link
            href="https://github.com/SaadUmairr/SecureShare"
            className="text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            target="_blank"
          >
            <Button
              variant={theme === 'dark' ? 'ghost' : 'default'}
              className={`${theme === 'light' ? 'rounded-full bg-slate-800' : ''}`}
            >
              <Image src={GithubIcon} width={20} height={20} alt="Github" />
            </Button>
          </Link>
          <Link
            href="features"
            className="text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Features
          </Link>
          <Link
            href="about"
            className="text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            About
          </Link>
          <Link href="/login">
            <Button className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
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
        <div className="border-t border-slate-200 bg-white py-4 md:hidden dark:border-slate-700 dark:bg-slate-800">
          <div className="container mx-auto flex flex-col gap-4 px-4">
            <div className="flex items-center gap-x-4 text-sm font-medium">
              <Button asChild className="hidden">
                <ThemeToggler />
              </Button>
              <span>Toggle Theme</span>
            </div>
            <Link
              href="/features"
              className="text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              About
            </Link>
            <Link href="/login">
              <Button className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
