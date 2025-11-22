import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '.data')
const STORES_FILE = path.join(DATA_DIR, 'stores.json')

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true })
    } catch (error) {
        // Directory might already exist, that's ok
    }
}

// Save all stores to file
export async function saveStores(data: {
    users: Array<[string, any]>
    jobs: Array<[string, any]>
    resumes: Array<[string, any]>
    experts: Array<[string, any]>
    bookings: Array<[string, any]>
    reviews: Array<[string, any]>
    outcomes: Array<[string, any]>
}) {
    try {
        await ensureDataDir()
        
        // Convert dates to ISO strings for JSON serialization
        const serializable = {
            ...data,
            timestamp: new Date().toISOString(),
            version: '1.0'
        }
        
        const jsonData = JSON.stringify(serializable, null, 2)
        
        // Atomic write: write to temp file, then rename
        const tempFile = `${STORES_FILE}.tmp`
        await fs.writeFile(tempFile, jsonData, 'utf-8')
        await fs.rename(tempFile, STORES_FILE)
        
        console.log('✅ Data persisted to disk')
    } catch (error) {
        console.error('❌ Failed to save data:', error)
    }
}

// Load all stores from file
export async function loadStores(): Promise<{
    users: Array<[string, any]>
    jobs: Array<[string, any]>
    resumes: Array<[string, any]>
    experts: Array<[string, any]>
    bookings: Array<[string, any]>
    reviews: Array<[string, any]>
    outcomes: Array<[string, any]>
} | null> {
    try {
        const data = await fs.readFile(STORES_FILE, 'utf-8')
        const parsed = JSON.parse(data)
        
        console.log(`✅ Data loaded from disk (saved: ${parsed.timestamp})`)
        return parsed
    } catch (error) {
        // File doesn't exist yet, that's ok
        if ((error as any).code === 'ENOENT') {
            console.log('ℹ️  No persisted data found, starting fresh')
            return null
        }
        console.error('❌ Failed to load data:', error)
        return null
    }
}

// Auto-save debouncing
let saveTimeout: NodeJS.Timeout | null = null

export function scheduleSave(saveFunc: () => Promise<void>) {
    if (saveTimeout) {
        clearTimeout(saveTimeout)
    }
    
    // Debounce: save 2 seconds after last change
    saveTimeout = setTimeout(() => {
        saveFunc().catch(console.error)
    }, 2000)
}
