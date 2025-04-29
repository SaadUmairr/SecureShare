import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  //   const cookie = await cookies();

  return NextResponse.json({
    message: 'Heres the IP ',
    ip: (await headers()).get('x-forwarded-for'),
  });
}
