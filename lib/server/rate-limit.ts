export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

interface Bucket {
  count: number
  firstAttemptAt: number
  blockedUntil: number | null
}

const buckets = new Map<string, Bucket>()

export function consumeRateLimit(input: {
  key: string
  windowMs: number
  maxAttempts: number
  blockMs: number
}): RateLimitResult {
  const now = Date.now()
  const { key, windowMs, maxAttempts, blockMs } = input

  const current = buckets.get(key)
  const fresh: Bucket = { count: 0, firstAttemptAt: now, blockedUntil: null }
  const bucket = current ?? fresh

  if (bucket.blockedUntil && now < bucket.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.blockedUntil - now) / 1000)),
    }
  }

  if (now - bucket.firstAttemptAt > windowMs) {
    bucket.count = 0
    bucket.firstAttemptAt = now
    bucket.blockedUntil = null
  }

  bucket.count += 1

  if (bucket.count > maxAttempts) {
    bucket.blockedUntil = now + blockMs
    buckets.set(key, bucket)
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(blockMs / 1000)),
    }
  }

  buckets.set(key, bucket)

  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - bucket.count),
    retryAfterSeconds: 0,
  }
}

export function getClientIpFromRequest(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  return headers.get("x-real-ip")?.trim() || "unknown"
}
