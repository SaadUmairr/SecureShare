'use server';

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/lib/db';

interface SaveUserKeysInDBProps {
  googleID: string;
  passphrase: string;
  publicKey: string;
  privateKey: string;
  iv: string;
}

export async function SaveUserKeysInDB({
  googleID,
  passphrase,
  publicKey,
  privateKey,
  iv,
}: SaveUserKeysInDBProps) {
  console.log('googleID: ', googleID);
  console.log('passphrase: ', passphrase);

  try {
    const dbResponse = await prisma.userKeyPair.create({
      data: {
        googleID,
        passphrase,
        publicKey,
        privateKey,
        iv,
      },
    });
    if (!dbResponse) return null;
    return dbResponse;
  } catch (error) {
    throw new Error(`KEYS ARE NOT APPENDED TO DB: ${(error as Error).message}`);
  }
}

export async function setPassphraseStatus(googleID: string) {
  try {
    const user = await prisma.user.findUnique({ where: { googleID } });
    if (!user) return null;
    const updatedPassphraseStatus = await prisma.user.update({
      where: { googleID },
      data: { isPassphraseSet: true },
    });
    return updatedPassphraseStatus;
  } catch (error) {
    throw new Error(
      `PASSPRHASE STATUS NOT UPDATED IN DB: ${(error as Error).message}`,
    );
  }
}

export async function getPassphraseStatus(googleID: string) {
  try {
    const status = await prisma.user.findFirst({
      where: { googleID },
      select: { isPassphraseSet: true },
    });

    return status?.isPassphraseSet ?? false;
  } catch (error) {
    throw new Error(
      `FAILED TO GET PASSPHRASE STATUS: ${(error as Error).message}`,
    );
  }
}

export async function getUserKeyPair(googleID: string) {
  console.log('GOOGLEID: ', googleID);
  try {
    const keyPair = await prisma.userKeyPair.findUnique({
      where: { googleID },
    });
    return keyPair;
  } catch (error) {
    throw new Error(`ERROR FETCHING RECORD: ${(error as Error).message}`);
  }
}

export async function updatePassphraseHash(hash: string, googleID: string) {
  try {
    const keypair = await prisma.userKeyPair.update({
      where: { googleID },
      data: { passphrase: hash },
    });

    console.log('KEYPAIR: ', keypair);
    return keypair;
  } catch (error) {
    throw new Error(
      `ERROR UPDATING PASSPHRASE HASH: ${(error as Error).message}`,
    );
  }
}

export async function togglePassphraseStatus(googleID: string) {
  try {
    const user = await prisma.user.findUnique({ where: { googleID } });
    if (!user) throw new Error('USER DOES NOT EXIST');
    const updatedUser = await prisma.user.update({
      where: { googleID },
      data: { isPassphraseSet: true },
    });
    return updatedUser;
  } catch (error) {
    throw new Error(
      `ERROR UPDATING PASSPHRASE STATUS: ${(error as Error).message}`,
    );
  }
}

export async function getCurrentUserSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function GoogleLoginHandler() {
  await signIn('google');
}

export async function LogoutHandler() {
  return await signOut({ redirect: false });
}
