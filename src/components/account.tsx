'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, MailIcon, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';

interface AccountInfoProp {
  username: string;
  email: string;
  avatarUrl: string;
}

export function Account({ username, email, avatarUrl }: AccountInfoProp) {
  const accountDeleteHandler = async () => {
    // TODO: MAKE ACCOUNT DELETE OPERATIONS
    console.log('ACCOUNT DELETE ACTION');
  };
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium text-gray-800 dark:text-gray-300">
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* User info section */}
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-base font-medium">{username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MailIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{email}</p>
                </div>
              </div>
            </div>

            {/* Avatar section */}
            <div className="flex flex-col items-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm dark:border-gray-100">
                <Image
                  src={avatarUrl}
                  alt="Profile Photo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <div className="mt-8">
        <h3 className="mb-3 text-base font-medium text-red-600">Danger Zone</h3>
        <div className="rounded-lg border border-dashed border-red-300 bg-red-50 p-4 dark:border-red-600 dark:bg-slate-900">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm">
              <h4 className="font-medium text-gray-800 dark:text-slate-400">
                Delete Account
              </h4>
              <p className="mt-1 text-gray-600 dark:text-slate-400">
                This will permanently delete your account and all associated
                data.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled>
                  DELETE MY ACCOUNT
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Are you absolutely sure?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Your account and associated
                    data will be permanently deleted.
                  </DialogDescription>
                </DialogHeader>
                <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-600">
                  <li>Your encryption keypair will be permanently deleted.</li>
                  <li>
                    Any uploaded files will remain encrypted and unrecoverable —
                    even by us.
                  </li>
                  <li>
                    Files will still be stored until their expiration time,
                    after which they will be deleted from our servers.
                  </li>
                  <li>
                    You can create a new account later, but previously uploaded
                    files will not be accessible.
                  </li>
                  <li>
                    Shared file links will also stop working once their files
                    expire.
                  </li>
                  <li>
                    This process cannot be reversed. Please make sure
                    you&apos;ve downloaded anything important.
                  </li>
                </ul>
                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={accountDeleteHandler}>
                    DELETE MY ACCOUNT
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
