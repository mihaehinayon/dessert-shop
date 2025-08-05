function ProductCard({ product, productIndex, cartItem, onAddToCart, onUpdateQuantity }) {
  const isInCart = !!cartItem

  const handleAddToCart = () => {
    onAddToCart(productIndex)
  }

  const handleIncrement = () => {
    onUpdateQuantity(productIndex, 1)
  }

  const handleDecrement = () => {
    onUpdateQuantity(productIndex, -1)
  }

  return (
    <div className={`product-card ${isInCart ? 'in-cart' : ''}`}>
      <div className="product-image">
        <picture>
          <source media="(min-width: 1024px)" srcSet={product.image.desktop} />
          <source media="(min-width: 768px)" srcSet={product.image.tablet} />
          <img src={product.image.mobile} alt={product.name} loading="lazy" />
        </picture>
        <div className="add-to-cart-container">
          {!isInCart ? (
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <img src="/assets/images/icon-add-to-cart.svg" alt="" />
              Add to Cart
            </button>
          ) : (
            <div className="quantity-controls">
              <button 
                className="quantity-btn decrement" 
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <img src="/assets/images/icon-decrement-quantity.svg" alt="" />
              </button>
              <span className="quantity-display">{cartItem.quantity}</span>
              <button 
                className="quantity-btn increment" 
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <img src="/assets/images/icon-increment-quantity.svg" alt="" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  )
}

export default ProductCard