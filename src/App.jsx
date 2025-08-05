import { useState, useEffect } from 'react'
import './App.css'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'
import OrderModal from './components/OrderModal'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showModal, setShowModal] = useState(false)

  // Load products data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data.json')
        const productsData = await response.json()
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    
    loadProducts()
  }, [])

  // Add item to cart
  const addToCart = (productIndex) => {
    const product = products[productIndex]
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productIndex === productIndex)
      
      if (existingItem) {
        return prevCart.map(item =>
          item.productIndex === productIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, {
          productIndex,
          name: product.name,
          price: product.price,
          quantity: 1,
          thumbnail: product.image.thumbnail
        }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productIndex) => {
    setCart(prevCart => prevCart.filter(item => item.productIndex !== productIndex))
  }

  // Update item quantity
  const updateQuantity = (productIndex, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.productIndex === productIndex) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      }).filter(Boolean)
    })
  }

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Confirm order
  const confirmOrder = () => {
    setShowModal(true)
  }

  // Start new order
  const startNewOrder = () => {
    setCart([])
    setShowModal(false)
  }

  return (
    <div className="container">
      <main className="main-content">
        <h1 className="page-title">Desserts</h1>
        <ProductGrid 
          products={products}
          cart={cart}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
        />
      </main>

      <Cart
        cart={cart}
        totalItems={totalItems}
        totalAmount={totalAmount}
        onRemoveItem={removeFromCart}
        onConfirmOrder={confirmOrder}
      />

      {showModal && (
        <OrderModal
          cart={cart}
          totalAmount={totalAmount}
          onStartNewOrder={startNewOrder}
        />
      )}
    </div>
  )
}

export default App
