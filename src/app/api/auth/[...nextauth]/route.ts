import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createClient } from '@supabase/supabase-js'
import type { User, Account, Profile } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null; profile?: Profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Initialize Supabase client
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )

          // Check if user exists in our database
          const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (selectError && selectError.code !== 'PGRST116') {
            console.error('Database error:', selectError)
            return false
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                email: user.email,
                name: user.name,
                avatar_url: user.image,
                provider: 'google',
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (insertError) {
              console.error('Error creating user:', insertError)
              return false
            }
          } else {
            // Update existing user's info
            const { error: updateError } = await supabase
              .from('users')
              .update({
                name: user.name,
                avatar_url: user.image,
                updated_at: new Date().toISOString()
              })
              .eq('email', user.email)

            if (updateError) {
              console.error('Error updating user:', updateError)
            }
          }

          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return true
    },
    async session({ session }: { session: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (session.user?.email) {
        try {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )

          const { data: user } = await supabase
            .from('users')
            .select('id, role')
            .eq('email', session.user.email)
            .single()

          if (user && session.user) {
            session.user.id = user.id
            session.user.role = user.role
          }
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      return session
    },
    async jwt({ token, account, user }: { token: JWT; account?: Account | null; user?: User }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (user) {
        token.role = 'user'
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt' as const
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
