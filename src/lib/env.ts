import { z } from 'zod'

// Check if we're in build time
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_URL

// Environment validation schema - all optional during build
const envSchema = z.object({
    // Required for production runtime (optional during build)
    NEXTAUTH_URL: isBuildTime ? z.string().optional() : z.string().url(),
    NEXTAUTH_SECRET: isBuildTime ? z.string().optional() : z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
    AUTH_SECRET: isBuildTime ? z.string().optional() : z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
    OPENAI_API_KEY: isBuildTime ? z.string().optional() : z.string()
        .min(1, 'OPENAI_API_KEY is required for AI features')
        .refine(
            (key) => key.startsWith('sk-') && key !== 'your-openai-api-key-here',
            'OPENAI_API_KEY must be a valid OpenAI key (starts with sk-) and not a placeholder'
        ),

    // Optional - Supabase (only validate if provided)
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal('')),

    // Optional - OAuth
    LINKEDIN_CLIENT_ID: z.string().optional().or(z.literal('')),
    LINKEDIN_CLIENT_SECRET: z.string().optional().or(z.literal('')),

    // Optional - Payments & Video
    STRIPE_SECRET_KEY: z.string().optional().or(z.literal('')),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional().or(z.literal('')),
    STRIPE_WEBHOOK_SECRET: z.string().optional().or(z.literal('')),
    DAILY_API_KEY: z.string().optional().or(z.literal('')),

    // Optional - Collaboration
    NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY: z.string().optional().or(z.literal('')),
    LIVEBLOCKS_SECRET_KEY: z.string().optional().or(z.literal('')),

    // Optional - Scheduling
    CALENDLY_API_TOKEN: z.string().optional().or(z.literal('')),

    // Optional - Analytics
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional().or(z.literal('')),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional().or(z.literal('')),
})

// Validate environment variables
function validateEnv() {
    try {
        const parsed = envSchema.parse(process.env)
        return { success: true as const, data: parsed }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.issues.map(err => {
                const path = err.path.join('.')
                return `  ❌ ${path}: ${err.message}`
            }).join('\n')

            console.error('\n❌ Environment validation failed:\n')
            console.error(errors)
            console.error('\n💡 Please check your .env.local file and ensure all required variables are set correctly.\n')
            console.error('📘 See SETUP.md for configuration instructions.\n')

            return {
                success: false as const,
                error: `Environment validation failed:\n${errors}`
            }
        }
        return {
            success: false as const,
            error: 'Unknown environment validation error'
        }
    }
}

// Export validated env
const result = validateEnv()

if (!result.success && !isBuildTime) {
    // In development, show warning but continue
    if (process.env.NODE_ENV === 'development') {
        console.warn('\n⚠️  WARNING: Environment validation failed in development mode.')
        console.warn('⚠️  The app may not work correctly. Please fix the errors above.\n')
    }
    // Don't throw errors - just log and continue
}

export const env = result.success ? result.data : ({} as z.infer<typeof envSchema>)

// Helper to check if a service is configured
export const isConfigured = {
    supabase: !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    linkedin: !!(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET),
    stripe: !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    daily: !!env.DAILY_API_KEY,
    liveblocks: !!(env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY && env.LIVEBLOCKS_SECRET_KEY),
    calendly: !!env.CALENDLY_API_TOKEN,
    posthog: !!(env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST),
}
