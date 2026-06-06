import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
      status: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
    status: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
    status: string;
  }
}
