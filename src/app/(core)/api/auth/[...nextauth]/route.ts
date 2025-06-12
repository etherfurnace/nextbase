import NextAuth, { AuthOptions } from 'next-auth';
import { supabase } from '@/utils/supabaseClient';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          console.error('Invalid credentials provided.');
          throw new Error('Invalid credentials');
        }

        try {
          console.log('Attempting to sign in with credentials:', credentials);
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });
          if (error) {
            console.error('Supabase sign in error:', error);
            throw new Error(error.message);
          }

          console.log('Sign in successful. User data:', data.user);
          return {
            id: data.user.id,
            email: data.user.email,
            access_token: data?.session.access_token,
            refresh_token: data?.session.refresh_token
          } as {
            id: string;
            email: string;
            access_token: string;
            refresh_token: string;
          } | null;
        } catch (error) {
          console.error('Authorize function error:', error);
          throw error;
        }
      }
    }),
    // // 第三方登录示例：Google
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // })
  ],
  pages: {
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.supabase = {
        access_token: token.access_token as string,
        refresh_token: token.refresh_token as string,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/';
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };