"use client"

import { useState } from "react"

const DESCRIPTION_CHAR_LIMIT = 220

export function ProductDescriptionText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > DESCRIPTION_CHAR_LIMIT

  return (
    <div>
      <p className={
        isLong && !expanded
          ? "mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground"
          : "mt-3 text-sm leading-6 text-muted-foreground"
      }>
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-xs font-semibold text-primary transition hover:underline"
        >
          {expanded ? "Ver menos" : "Leer más"}
        </button>
      )}
    </div>
  )
}
