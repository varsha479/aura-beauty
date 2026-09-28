import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { catalogItems } from "../data/catalog"

const CartContext = createContext(null)
const CART_STORAGE_KEY = "aura-cart"
const SHIPPING_FEE = 650

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.slug === product.slug)

      if (existingItem) {
        return currentItems.map((item) =>
          item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          slug: product.slug,
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (slug) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.slug !== slug))
  }

  const updateQuantity = (slug, quantity) => {
    if (quantity <= 0) {
      removeFromCart(slug)
      return
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => (item.slug === slug ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => setCartItems([])

  const lineItems = cartItems
    .map((item) => {
      const product = catalogItems.find((catalogItem) => catalogItem.slug === item.slug) || item

      if (!product) {
        return null
      }

      return {
        ...product,
        quantity: item.quantity,
        lineTotal: product.priceValue * item.quantity,
      }
    })
    .filter(Boolean)

  const subtotal = useMemo(
    () => lineItems.reduce((total, item) => total + item.lineTotal, 0),
    [lineItems],
  )

  const shipping = lineItems.length ? SHIPPING_FEE : 0
  const total = subtotal + shipping
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  const value = {
    cartItems,
    lineItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    shipping,
    total,
    formatMoney,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}