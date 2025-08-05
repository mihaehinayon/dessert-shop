function Cart({ cart, totalItems, totalAmount, onRemoveItem, onConfirmOrder }) {
  const isEmpty = cart.length === 0

  return (
    <aside className="cart-sidebar">
      <div className="cart-header">
        <h2>Your Cart ({totalItems})</h2>
      </div>
      
      <div className="cart-content">
        {isEmpty ? (
          <div className="cart-empty">
            <img src="/assets/images/illustration-empty-cart.svg" alt="Empty cart" className="empty-cart-icon" />
            <p>Your added items will appear here</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.productIndex} className="cart-item">
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-details">
                      <span className="cart-item-quantity">{item.quantity}x</span>
                      <span className="cart-item-price">@ ${item.price.toFixed(2)}</span>
                      <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    className="remove-item-btn" 
                    onClick={() => onRemoveItem(item.productIndex)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <img src="/assets/images/icon-remove-item.svg" alt="" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-total">
              <div className="order-total">
                <span>Order Total</span>
                <span className="total-price">${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="carbon-neutral">
                <img src="/assets/images/icon-carbon-neutral.svg" alt="Carbon neutral delivery" />
                <span>This is a <strong>carbon-neutral</strong> delivery</span>
              </div>
              
              <button className="confirm-order-btn" onClick={onConfirmOrder}>
                Confirm Order
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}

export default Cart