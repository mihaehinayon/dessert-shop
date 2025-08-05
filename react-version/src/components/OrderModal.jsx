import { useEffect } from 'react'

function OrderModal({ cart, totalAmount, onStartNewOrder }) {
  // Handle escape key and background click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onStartNewOrder()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onStartNewOrder])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onStartNewOrder()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <img src="/assets/images/icon-order-confirmed.svg" alt="Order confirmed" />
          <h2>Order Confirmed</h2>
          <p>We hope you enjoy your food!</p>
        </div>
        
        <div className="modal-content">
          <div className="order-summary">
            {cart.map(item => (
              <div key={item.productIndex} className="order-item">
                <div className="order-item-image">
                  <img src={item.thumbnail} alt={item.name} />
                </div>
                <div className="order-item-info">
                  <h4>{item.name}</h4>
                  <div className="order-item-details">
                    <span className="order-quantity">{item.quantity}x</span>
                    <span className="order-price">@ ${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="order-item-total">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="modal-total">
            <span>Order Total</span>
            <span className="modal-total-price">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <button className="new-order-btn" onClick={onStartNewOrder}>
          Start New Order
        </button>
      </div>
    </div>
  )
}

export default OrderModal