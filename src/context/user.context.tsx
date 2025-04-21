// 'use client';

// import { getCurrentUserSession, getPassphraseStatus } from '@/actions/user';
// import { loadPassphrase } from '@/utils/idb.util';
// import { useRouter } from 'next/navigation';
// import {
//   createContext,
//   Dispatch,
//   SetStateAction,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';

// interface UserContextProp {
//   googleID: string;
//   setGoogleID: Dispatch<SetStateAction<string>>;
//   name: string;
//   email: string;
//   avatar: string;
//   passphrase: string;
//   setPassphrase: Dispatch<SetStateAction<string>>;
// }

// const UserContext = createContext<UserContextProp | null>(null);

// export function UserContextProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [googleID, setGoogleID] = useState<string>('');
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [avatar, setAvatar] = useState<string>('');
//   const [passphrase, setPassphrase] = useState<string>(''); // initialize with an empty string
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const router = useRouter();

//   // Fetch session details (including googleID) on mount
//   useEffect(() => {
//     async function getUserDetails() {
//       try {
//         const session = await getCurrentUserSession();
//         console.log('SESSION: ', session);
//         if (session?.user) {
//           // Assuming session is extended to include googleID
//           setGoogleID(session.user.googleID || '');
//           setName(session.user.name || '');
//           setEmail(session.user.email || '');
//           setAvatar(session.user.image || '');
//         }
//       } catch (error) {
//         console.error('Error fetching session:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     getUserDetails();
//   }, []);

//   // Once googleID is set, check the passphrase
//   useEffect(() => {
//     async function verifyPassphrase() {
//       if (!googleID) return; // wait until googleID is set
//       // Check the DB to see if the passphrase has been set

//       const storedPass = await loadPassphrase();
//       if (storedPass) {
//         setPassphrase(storedPass);
//         return;
//       }

//       const passExists = await getPassphraseStatus(googleID);

//       console.log('Passphrase status from DB: ', passExists);
//       if (!passExists) {
//         // If passphrase not set at all, route to passphrase setup page
//         router.replace('/passphrase?mode=setup');
//       } else {
//         // If passphrase exists, check if it's stored locally (in IDB or memory)
//         const storedPass = await loadPassphrase();
//         if (storedPass) {
//           setPassphrase(storedPass);
//         } else {
//           // If it's not stored locally, prompt the user to enter it
//           router.replace('/passphrase?mode=enter');
//         }
//       }
//     }
//     verifyPassphrase();
//   }, [googleID, router]);

//   console.log('PASSPHRASE IN CONTEXT: ', passphrase);

//   if (isLoading) {
//     return <></>;
//   }

//   return (
//     <UserContext.Provider
//       value={{
//         googleID,
//         setGoogleID,
//         name,
//         email,
//         avatar,
//         passphrase,
//         setPassphrase,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export const useUser = (): UserContextProp => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserContextProvider');
//   }
//   return context;
// };

'use client';

import { getCurrentUserSession, getPassphraseStatus } from '@/actions/user';
import { loadPassphrase } from '@/utils/idb.util';
import { useRouter } from 'next/navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react';

interface UserContextProp {
  googleID: string;
  setGoogleID: Dispatch<SetStateAction<string>>;
  name: string;
  email: string;
  avatar: string;
  passphrase: string;
  setPassphrase: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProp | null>(null);

// Simple fallback for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500"></div>
  </div>
);

// The actual context provider content
function UserContextContent({ children }: { children: React.ReactNode }) {
  const [googleID, setGoogleID] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  // Fetch session details (including googleID) on mount
  useEffect(() => {
    async function getUserDetails() {
      try {
        const session = await getCurrentUserSession();
        if (session?.user) {
          setGoogleID(session.user.googleID || '');
          setName(session.user.name || '');
          setEmail(session.user.email || '');
          setAvatar(session.user.image || '');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    }
    getUserDetails();
  }, []);

  // Once googleID is set, check the passphrase
  useEffect(() => {
    async function verifyPassphrase() {
      if (!googleID) return;

      const storedPass = await loadPassphrase();
      if (storedPass) {
        setPassphrase(storedPass);
        return;
      }

      const passExists = await getPassphraseStatus(googleID);

      if (!passExists) {
        router.replace('/passphrase?mode=setup');
      } else {
        const storedPass = await loadPassphrase();
        if (storedPass) {
          setPassphrase(storedPass);
        } else {
          router.replace('/passphrase?mode=enter');
        }
      }
    }
    verifyPassphrase();
  }, [googleID, router]);

  return (
    <UserContext.Provider
      value={{
        googleID,
        setGoogleID,
        name,
        email,
        avatar,
        passphrase,
        setPassphrase,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// The main exported provider that wraps content with Suspense
export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UserContextContent>{children}</UserContextContent>
    </Suspense>
  );
}

export const useUser = (): UserContextProp => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};
