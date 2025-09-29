import NextAuth from "next-auth";
import { v4 as uuidv4 } from "uuid";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        var deviceName = uuidv4();
        const formData = {
          email: credentials?.email,
          password: credentials?.password,
          is_login_admin: true,
        };
        try {
          const response = await axios.post("/auth/login", formData);
          const user = await response.data;
          // If no error and we have user data, return it
          if (user) {
            return user;
          }
          // Return null if user data could not be retrieved
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token-3010`,
      options: {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true in production with HTTPS
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url-3010`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token-3010`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },
  jwt: {
    maxAge: 60 * 60 * 12 - 1,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.job_position = user.job_position;
        token.full_name = user.full_name;
      }
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user.full_name = token.full_name;
      session.user.job_position = token.job_position;
      session.user.access_token = token.access_token;
      // session.user.full_name = token.full_name;
      // session.user.job_position = token.job_position;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
