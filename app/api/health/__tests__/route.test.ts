import { describe, it, expect } from "vitest"
import { GET } from "@/app/api/health/route"

describe("GET /api/health", () => {
  it("responde 200 con status ok sin depender del backend", async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe("ok")
    expect(body.service).toBe("somme-ecommerce")
    expect(res.headers.get("cache-control")).toBe("no-store")
  })
})
