import NextAuth from "next-auth"
// import LinkedIn from "next-auth/providers/linkedin" // Disabled until credentials configured
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { userStore } from "@/lib/user-store"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // LinkedIn OAuth is disabled until client ID and secret are configured
        // Uncomment and configure in .env.local when ready:
        // LinkedIn({
        //     clientId: process.env.LINKEDIN_CLIENT_ID!,
        //     clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        // }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data

                    const user = await userStore.verifyPassword(email, password)
                    if (user) {
                        return user
                    }
                }

                console.log("Invalid credentials")
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
    },
})
