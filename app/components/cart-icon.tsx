'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { getCart, onCartChange } from '@/lib/cart'

export default function CartIcon() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => setCount(getCart().length)
    update()
    return onCartChange(update)
  }, [])

  return (
    <Link
      href="/cart"
      className="relative px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
    >
      <ShoppingCart className="w-4.5 h-4.5" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-cta text-cta-foreground text-[10px] font-semibold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  )
}
