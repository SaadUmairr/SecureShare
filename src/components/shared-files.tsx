'use client';

import { SharedFilesRecord } from '@/actions/file';
import { useUser } from '@/context/user.context';
import { useEffect } from 'react';

export function SharedFiles() {
  const { googleID } = useUser();
  useEffect(() => {
    console.log('GOOGEID: ', googleID);
    const fetchRecord = async () => {
      if (!googleID) return;
      console.log('FETCHING;');
      const records = await SharedFilesRecord(googleID);
      console.log('SHARED RECORDS: ', records);
    };
    fetchRecord();
  }, [googleID]);
  return <></>;
}
