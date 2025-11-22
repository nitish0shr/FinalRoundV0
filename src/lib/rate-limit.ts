import { LRUCache } from 'lru-cache'

type RateLimitOptions = {
    interval: number  // Time window in milliseconds
    uniqueTokenPerInterval: number  // Max number of unique tokens (IPs) to track
}

// Create rate limiter with LRU cache
export function rateLimit(options: RateLimitOptions) {
    const tokenCache = new LRUCache({
        max: options.uniqueTokenPerInterval,
        ttl: options.interval,
    })

    return {
        check: (limit: number, token: string) => {
            const tokenCount = (tokenCache.get(token) as number[]) || [0]
            
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount)
            }
            
            tokenCount[0] += 1
            
            const currentUsage = tokenCount[0]
            const isRateLimited = currentUsage >= limit
            
            return {
                success: !isRateLimited,
                limit,
                remaining: Math.max(0, limit - currentUsage),
                reset: Date.now() + options.interval,
            }
        },
    }
}

// Pre-configured rate limiters for different endpoints
export const apiLimiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500, // Track up to 500 IPs
})

export const aiLimiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
})

export const authLimiter = rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 500,
})

// Helper to get client IP from request
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    
    if (realIp) {
        return realIp.trim()
    }
    
    return 'unknown'
}
