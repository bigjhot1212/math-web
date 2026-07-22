const CART_KEY = 'mathprep_cart'
const CART_EVENT = 'cart-updated'

export function getCart(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setCart(ids: string[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event(CART_EVENT))
}

export function addToCart(id: string) {
  const cart = getCart()
  if (!cart.includes(id)) setCart([...cart, id])
}

export function removeFromCart(id: string) {
  setCart(getCart().filter((x) => x !== id))
}

export function clearCart() {
  setCart([])
}

export function onCartChange(callback: () => void) {
  window.addEventListener(CART_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CART_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
