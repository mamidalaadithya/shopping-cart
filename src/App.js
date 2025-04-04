import { useState, useEffect } from 'react';
import './App.css';

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [cart, setCart] = useState([]);
  const [showGiftMessage, setShowGiftMessage] = useState(false);
  const [quantities] = useState({
    1: 1, 2: 1, 3: 1, 4: 1
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (subtotal >= THRESHOLD && !cart.some(item => item.id === FREE_GIFT.id)) {
      setCart([...cart, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMessage(true);
      setTimeout(() => setShowGiftMessage(false), 3000);
    } else if (subtotal < THRESHOLD && cart.some(item => item.id === FREE_GIFT.id)) {
      setCart(cart.filter(item => item.id !== FREE_GIFT.id));
    }
  }, [subtotal, cart]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantities[product.id] } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: quantities[product.id] }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const remaining = Math.max(0, THRESHOLD - subtotal);
  const hasFreeGift = cart.some(item => item.id === FREE_GIFT.id);
  const progress = Math.min(100, (subtotal / THRESHOLD) * 100);

  return (
    <div className="shopping-cart">
      <h1>Shopping Cart</h1>
      
      <div className="products-section">
        <h2>Products</h2>
        {PRODUCTS.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-info">
              <strong>{product.name}</strong>
              <span>₹{product.price}</span>
            </div>
            <div className="product-controls">
              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="summary-content">
          <div className="subtotal-row">
            <strong>Subtotal:</strong>
            <span>₹{subtotal}</span>
          </div>
          {hasFreeGift ? (
            <div className={`gift-message ${showGiftMessage ? 'show' : ''}`}>
              You got a free Wireless Mouse!
            </div>
          ) : subtotal > 0 ? (
            <div className="threshold-message">
              Add ₹{remaining} more to get a FREE Wireless Mouse!
            </div>
          ) : null}
        </div>
      </div>

      <div className="divider"></div>

      <div className="cart-items">
        <h2>Cart Items</h2>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <p>Add some products to see them here!</p>
          </div>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <div className="item-main">
                  <div className="item-info">
                    <strong>{item.name}</strong>
                    {item.id === FREE_GIFT.id && <span className="free-tag">FREE GIFT</span>}
                  </div>
                  <div className="item-price">
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </div>
                </div>
                {item.id !== FREE_GIFT.id && (
                  <div className="item-quantity">
                    <button 
                      className="decrease-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="increase-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;