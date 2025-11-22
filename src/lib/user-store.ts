import { hash, compare } from 'bcryptjs'

// In-memory user storage (singleton pattern)
// TODO: Replace with Supabase database storage
class UserStore {
    private users: Array<{
        id: string
        name: string
        email: string
        password: string
    }> = []

    async createUser(name: string, email: string, password: string) {
        // Check if user already exists
        const existingUser = this.users.find((u) => u.email === email)
        if (existingUser) {
            throw new Error('User already exists with this email')
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Create user
        const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            password: hashedPassword,
        }

        this.users.push(newUser)
        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        }
    }

    async getUser(email: string) {
        return this.users.find((u) => u.email === email)
    }

    async verifyPassword(email: string, password: string) {
        const user = await this.getUser(email)
        if (!user) return null

        const passwordsMatch = await compare(password, user.password)
        if (passwordsMatch) {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
        return null
    }
}

// Export singleton instance
export const userStore = new UserStore()
