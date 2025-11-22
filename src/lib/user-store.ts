import { hash, compare } from 'bcryptjs'
import { saveStores, loadStores, scheduleSave } from './persistence'

// In-memory user storage (singleton pattern)
// Now with file-based persistence to survive server restarts
class UserStore {
    private users: Array<{
        id: string
        name: string
        email: string
        password: string
    }> = []
    
    private loaded = false

    constructor() {
        // Load persisted data on startup (server-side only)
        if (typeof window === 'undefined') {
            this.loadUsers().catch(console.error)
        }
    }

    private async loadUsers() {
        if (this.loaded) return
        
        const data = await loadStores()
        if (data?.users) {
            this.users = data.users.map((item: any) => item[1] || item)
            console.log(`✅ Loaded ${this.users.length} users from disk`)
        }
        this.loaded = true
    }

    private triggerSave() {
        scheduleSave(() => this.saveUsers())
    }

    private async saveUsers() {
        // Get other stores data
        const data = await loadStores() || {
            users: [],
            jobs: [],
            resumes: [],
            experts: [],
            bookings: [],
            reviews: [],
            outcomes: []
        }

        // Update users
        data.users = this.users.map((user, idx) => [user.id, user])

        await saveStores(data)
    }

    async createUser(name: string, email: string, password: string) {
        // Ensure data is loaded first
        await this.loadUsers()

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
        this.triggerSave()

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        }
    }

    async getUser(email: string) {
        await this.loadUsers()
        return this.users.find((u) => u.email === email)
    }

    async verifyPassword(email: string, password: string) {
        await this.loadUsers()
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
