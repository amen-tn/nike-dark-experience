
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [intro, setIntro] = useState(
    () => !sessionStorage.getItem('nike-intro')
  )

  const [page, setPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('ALL')

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)

  const [bagItems, setBagItems] = useState([])

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Tunisia',
    city: '',
    address: '',
    postalCode: '',
    payment: 'Cash on Delivery'
  })

  const [orderPlaced, setOrderPlaced] = useState(false)

  // INTRO
  useEffect(() => {
    if (intro) {
      const timer = setTimeout(() => {
        setIntro(false)
        sessionStorage.setItem('nike-intro', 'shown')
      }, 3500)

      return () => clearTimeout(timer)
    }
  }, [intro])

  // PRODUCTS
  const products = [
    {
      name: 'AIR MAX DN',
      type: 'LIFESTYLE',
      price: '$160',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
      description: 'Experience next-level comfort and modern Nike design.'
    },
    {
      name: 'AIR FORCE 1',
      type: 'LIFESTYLE',
      price: '$115',
      image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900',
      description: 'An iconic classic made for everyday style.'
    },
    {
      name: 'RUNNING PRO',
      type: 'RUNNING',
      price: '$140',
      image: 'https://assets.footlocker.com/is/image/FLDM/R1229001_07?%24tile500jpg%24=true&fmt=png-alpha',
      description: 'Designed for movement, speed and performance.'
    }
  ]

  // FILTER PRODUCTS
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      category === 'ALL' || product.type === category

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // BAG COUNT
  const bagCount = bagItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // BAG TOTAL
  const bagTotal = bagItems.reduce(
    (total, item) =>
      total + Number(item.price.replace('$', '')) * item.quantity,
    0
  )

  // OPEN PRODUCT
  function openProduct(product) {
    setSelectedProduct(product)
    setSelectedSize('')
    setAdded(false)
    setPage('product')
  }

  // ADD TO BAG
  function addToBag() {
    if (!selectedSize) return

    setBagItems(items => {
      const existingItem = items.find(
        item =>
          item.name === selectedProduct.name &&
          item.size === selectedSize
      )

      if (existingItem) {
        return items.map(item =>
          item.name === selectedProduct.name &&
          item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...items,
        {
          ...selectedProduct,
          size: selectedSize,
          quantity: 1
        }
      ]
    })

    setAdded(true)
  }

  // UPDATE QUANTITY
  function updateQuantity(name, size, change) {
    setBagItems(items =>
      items
        .map(item =>
          item.name === name && item.size === size
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  // REMOVE ITEM
  function removeItem(name, size) {
    setBagItems(items =>
      items.filter(
        item => !(item.name === name && item.size === size)
      )
    )
  }

  // CUSTOMER INPUTS
  function updateCustomer(field, value) {
    setCustomer(previous => ({
      ...previous,
      [field]: value
    }))
  }

  return (
    <main className="app">

      {/* INTRO */}
      {intro && (
        <div className="intro">
          <div className="nike-logo">NIKE</div>
          <p>JUST DO IT.</p>
        </div>
      )}

      {/* NAVBAR */}
      <header className="navbar">

        <div className="brand" onClick={() => setPage('home')}>
          NIKE
        </div>

        <nav>
          <a href="#home" onClick={() => setPage('home')}>Home</a>
          <a href="#collection" onClick={() => setPage('collection')}>Collection</a>
          <a href="#collection" onClick={() => setPage('collection')}>Men</a>
          <a href="#collection" onClick={() => setPage('collection')}>Women</a>
        </nav>

        <button className="shop-btn" onClick={() => setPage('bag')}>
          BAG ({bagCount})
        </button>

      </header>

      {/* HOME PAGE */}
      {page === 'home' && (
        <>
          <section className="hero-section" id="home">

            <div className="hero-content">
              <p className="subtitle">NIKE COLLECTION 2026</p>

              <h1>
                BE <span>ICONIC.</span>
                <br />
                BE UNSTOPPABLE.
              </h1>

              <p className="description">
                Push your limits. Define your style.
                Discover the next generation of Nike.
              </p>

              <button
                className="discover-btn"
                onClick={() => setPage('collection')}
              >
                DISCOVER NOW ↗
              </button>
            </div>

            <div className="hero-image">
              <img src="/nike-glow.png" alt="Nike luminous logo" />
            </div>

            <div className="vertical-text">
              PERFORMANCE · INNOVATION · STYLE
            </div>

          </section>

          <footer>
            <span>NIKE — JUST DO IT.</span>
            <span>© 2026 NIKE EXPERIENCE</span>
          </footer>
        </>
      )}

      {/* COLLECTION PAGE */}
      {page === 'collection' && (
        <section className="collection-page" id="collection">

          <div className="collection-heading">
            <p className="subtitle">FIND YOUR NEXT ICON</p>
            <h1>THE <span>COLLECTION.</span></h1>
            <p>Discover the shoes that move you forward.</p>
          </div>

          <div className="search-container">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search your favourite sneakers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <span className="search-label">SEARCH</span>
          </div>

          <div className="collection-filters">
            {['ALL', 'LIFESTYLE', 'RUNNING'].map(item => (
              <button
                key={item}
                className={category === item ? 'filter active' : 'filter'}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="products-grid">

            {filteredProducts.map((product, index) => (
              <article
                className="product-card"
                key={product.name}
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => openProduct(product)}
              >

                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-number">
                    0{index + 1}
                  </span>
                </div>

                <div className="product-info">
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.type}</p>
                  </div>

                  <span className="product-price">
                    {product.price}
                  </span>
                </div>

              </article>
            ))}

          </div>

          {filteredProducts.length === 0 && (
            <p className="no-products">NO PRODUCTS FOUND</p>
          )}

          <button className="back-btn" onClick={() => setPage('home')}>
            ← BACK TO HOME
          </button>

          <footer>
            <span>NIKE — JUST DO IT.</span>
            <span>© 2026 NIKE EXPERIENCE</span>
          </footer>

        </section>
      )}

      {/* PRODUCT DETAILS PAGE */}
      {page === 'product' && selectedProduct && (
        <section className="product-details">

          <button
            className="back-btn details-back"
            onClick={() => setPage('collection')}
          >
            ← BACK TO COLLECTION
          </button>

          <div className="details-layout">

            <div className="details-image">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
              <span>NIKE ORIGINAL COLLECTION</span>
            </div>

            <div className="details-content">

              <p className="subtitle">{selectedProduct.type}</p>

              <h1>{selectedProduct.name}</h1>

              <p className="details-price">
                {selectedProduct.price}
              </p>

              <p className="details-description">
                {selectedProduct.description}
              </p>

              <div className="size-heading">
                <span>SELECT SIZE</span>
                <span>EU</span>
              </div>

              <div className="sizes-grid">
                {[39, 40, 41, 42, 43, 44, 45].map(size => (
                  <button
                    key={size}
                    className={
                      selectedSize === size
                        ? 'size-btn selected'
                        : 'size-btn'
                    }
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {!selectedSize && (
                <p className="size-warning">
                  Please select your size first.
                </p>
              )}

              <button
                className="add-bag-btn"
                onClick={addToBag}
                disabled={!selectedSize}
              >
                {added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
              </button>

              <p className="details-note">
                FREE DELIVERY · NIKE EXPERIENCE
              </p>

              {added && (
                <button
                  className="continue-btn"
                  onClick={() => setPage('bag')}
                >
                  VIEW BAG ({bagCount})
                </button>
              )}

            </div>
          </div>

        </section>
      )}

      {/* BAG PAGE */}
      {page === 'bag' && (
        <section className="bag-page">

          <div className="bag-heading">
            <p className="subtitle">YOUR NIKE SELECTION</p>
            <h1>YOUR <span>BAG.</span></h1>
            <p>{bagCount} ITEMS IN YOUR BAG</p>
          </div>

          {bagItems.length === 0 ? (

            <div className="empty-bag">
              <div className="empty-bag-icon">◇</div>
              <h2>YOUR BAG IS EMPTY.</h2>
              <p>Looks like you haven't added anything yet.</p>

              <button
                className="discover-btn"
                onClick={() => setPage('collection')}
              >
                EXPLORE COLLECTION
              </button>
            </div>

          ) : (

            <div className="bag-layout">

              <div className="bag-items">

                {bagItems.map(item => (
                  <article
                    className="bag-item"
                    key={`${item.name}-${item.size}`}
                  >

                    <div className="bag-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="bag-item-info">
                      <h2>{item.name}</h2>
                      <p>{item.type} · SIZE {item.size}</p>

                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.name, item.size, -1)
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.name, item.size, 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => removeItem(item.name, item.size)}
                      >
                        REMOVE
                      </button>
                    </div>

                    <div className="bag-item-price">
                      {item.price}
                    </div>

                  </article>
                ))}

              </div>

              <aside className="bag-summary">

                <h2>ORDER SUMMARY</h2>

                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${bagTotal.toFixed(2)}</span>
                </div>

                <div className="summary-line">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>

                <div className="summary-total">
                  <span>TOTAL</span>
                  <span>${bagTotal.toFixed(2)}</span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => setPage('checkout')}
                >
                  CHECKOUT
                </button>

                <button
                  className="continue-btn"
                  onClick={() => setPage('collection')}
                >
                  CONTINUE SHOPPING
                </button>

              </aside>

            </div>
          )}

          <button
            className="back-btn"
            onClick={() => setPage('collection')}
          >
            ← BACK TO COLLECTION
          </button>

          <footer>
            <span>NIKE — JUST DO IT.</span>
            <span>© 2026 NIKE EXPERIENCE</span>
          </footer>

        </section>
      )}

      {/* CHECKOUT PAGE */}
      {page === 'checkout' && (
        <section className="checkout-page">

          <button
            className="back-btn"
            onClick={() => setPage('bag')}
          >
            ← BACK TO BAG
          </button>

          {orderPlaced ? (

            <div className="order-success">
              <p className="subtitle">NIKE EXPERIENCE</p>
              <h1>ORDER <span>CONFIRMED.</span></h1>
              <p>Thank you for your order, {customer.firstName}.</p>

              <button
                className="discover-btn"
                onClick={() => {
                  setOrderPlaced(false)
                  setBagItems([])
                  setPage('home')
                }}
              >
                BACK TO HOME
              </button>
            </div>

          ) : (

            <>
              <div className="checkout-heading">
                <p className="subtitle">ALMOST THERE</p>
                <h1>CHECK <span>OUT.</span></h1>
                <p>Complete your information to place your order.</p>
              </div>

              <div className="checkout-layout">

                <form
                  className="checkout-form"
                  onSubmit={e => {
                    e.preventDefault()
                    setOrderPlaced(true)
                  }}
                >

                  <h2>CONTACT INFORMATION</h2>

                  <div className="checkout-fields">

                    <input
                      required
                      placeholder="First name"
                      value={customer.firstName}
                      onChange={e => updateCustomer('firstName', e.target.value)}
                    />

                    <input
                      required
                      placeholder="Last name"
                      value={customer.lastName}
                      onChange={e => updateCustomer('lastName', e.target.value)}
                    />

                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      value={customer.email}
                      onChange={e => updateCustomer('email', e.target.value)}
                    />

                    <input
                      required
                      type="tel"
                      placeholder="Phone number"
                      value={customer.phone}
                      onChange={e => updateCustomer('phone', e.target.value)}
                    />

                  </div>

                  <h2>DELIVERY ADDRESS</h2>

                  <div className="checkout-fields">

                    <input
                      required
                      placeholder="Country"
                      value={customer.country}
                      onChange={e => updateCustomer('country', e.target.value)}
                    />

                    <input
                      required
                      placeholder="City"
                      value={customer.city}
                      onChange={e => updateCustomer('city', e.target.value)}
                    />

                    <input
                      required
                      className="full-field"
                      placeholder="Full address"
                      value={customer.address}
                      onChange={e => updateCustomer('address', e.target.value)}
                    />

                    <input
                      required
                      placeholder="Postal code"
                      value={customer.postalCode}
                      onChange={e => updateCustomer('postalCode', e.target.value)}
                    />

                  </div>

                  <h2>PAYMENT METHOD</h2>

                  <select
                    value={customer.payment}
                    onChange={e => updateCustomer('payment', e.target.value)}
                  >
                    <option>Cash on Delivery</option>
                  </select>

                  <button className="checkout-btn" type="submit">
                    CONFIRM ORDER
                  </button>

                </form>

                <aside className="checkout-summary">

                  <h2>YOUR ORDER</h2>

                  {bagItems.map(item => (
                    <div
                      className="checkout-product"
                      key={`${item.name}-${item.size}`}
                    >

                      <img src={item.image} alt={item.name} />

                      <div>
                        <h3>{item.name}</h3>
                        <p>Size: {item.size} · Qty: {item.quantity}</p>
                      </div>

                      <span>
                        ${(Number(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                      </span>

                    </div>
                  ))}

                  <div className="summary-total">
                    <span>TOTAL</span>
                    <span>${bagTotal.toFixed(2)}</span>
                  </div>

                </aside>

              </div>
            </>

          )}

        </section>
      )}

    </main>
  )
}

export default App
