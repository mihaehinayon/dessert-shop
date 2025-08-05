import ProductCard from './ProductCard'

function ProductGrid({ products, cart, onAddToCart, onUpdateQuantity }) {
  return (
    <div className="products-grid">
      {products.map((product, index) => (
        <ProductCard 
          key={index}
          product={product}
          productIndex={index}
          cartItem={cart.find(item => item.productIndex === index)}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  )
}

export default ProductGrid