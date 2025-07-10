import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (session?.user && token) {
        session.user.id = token.sub
        session.user.role = 'user' // Default role for Google users
      }
      return session
    },
    async jwt({ token, user }: { token: any; user?: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (user) {
        token.role = 'user'
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
