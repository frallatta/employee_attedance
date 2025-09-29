import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      full_name?: string;
      email?: string;
      job_position?: string;
      access_token?: string;
    };
  }

  interface User extends DefaultUser {
    full_name: string;
    job_position: string;
    access_token: string;
    // ... other custom properties
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    access_token: string;
    full_name: string;
    job_position: string;
  }

  interface;
}
