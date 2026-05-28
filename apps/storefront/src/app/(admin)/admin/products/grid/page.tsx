'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRODUCTS = [
  { id: 1,  name: 'Men Black Slim Fit T-shirt',  category: 'Fashion Men',    price: 100, sale: 80,  rating: 4.5, reviews: 55,  img: 'https://techzaa.in/larkon/admin/assets/images/product/p-1.png',  wishlisted: false },
  { id: 2,  name: 'Olive Green Leather Bag',     category: 'Fashion Women',  price: 150, sale: 136, rating: 4.1, reviews: 143, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-2.png',  wishlisted: true  },
  { id: 3,  name: 'Women Golden Dress',           category: 'Fashion Women',  price: 250, sale: 219, rating: 4.4, reviews: 174, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-3.png',  wishlisted: false },
  { id: 4,  name: 'Gray Cap For Men',             category: 'Fashion Men',    price: 100, sale: 76,  rating: 4.2, reviews: 23,  img: 'https://techzaa.in/larkon/admin/assets/images/product/p-4.png',  wishlisted: false },
  { id: 5,  name: 'Dark Green Cargo Pent',        category: 'Fashion Men',    price: 130, sale: 110, rating: 4.4, reviews: 109, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-5.png',  wishlisted: false },
  { id: 6,  name: 'Orange Headphone',             category: 'Electronics',    price: 250, sale: 231, rating: 4.2, reviews: 200, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-6.png',  wishlisted: true  },
  { id: 7,  name: "Kid's Yellow Shoes",           category: 'Foot Ware',      price: 100, sale: 89,  rating: 4.5, reviews: 321, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-7.png',  wishlisted: false },
  { id: 8,  name: 'Men Dark Brown Wallet',        category: 'Accessories',    price: 150, sale: 132, rating: 4.1, reviews: 190, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-8.png',  wishlisted: false },
  { id: 9,  name: 'Sky Blue Mat Sunglass',        category: 'Eye Ware',       price: 100, sale: 77,  rating: 3.5, reviews: 298, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-9.png',  wishlisted: false },
  { id: 10, name: "Kid's Yellow T-shirt",         category: 'Fashion Kids',   price: 140, sale: 110, rating: 4.1, reviews: 156, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-10.png', wishlisted: false },
  { id: 11, name: 'White Rubber Smart Watch',     category: 'Watches',        price: 110, sale: 77,  rating: 3.4, reviews: 201, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-11.png', wishlisted: false },
  { id: 12, name: 'Men Brown Leather Shoes',      category: 'Foot Ware',      price: 250, sale: 222, rating: 4.1, reviews: 370, img: 'https://techzaa.in/larkon/admin/assets/images/product/p-12.png', wishlisted: false },
];

// ── Collapsible filter section using React state (bypasses Bootstrap JS) ──────
function FilterSection({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={className}>
      <a
        href="#!"
        className="btn-link d-flex align-items-center text-dark bg-light p-2 rounded fw-medium fs-16 mb-0"
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
      >
        {title}
        <i className={`bx bx-chevron-${open ? 'down' : 'up'} ms-auto fs-20`}></i>
      </a>
      <div style={{ display: open ? 'block' : 'none' }}>
        {children}
      </div>
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const [wishlisted, setWishlisted] = useState(product.wishlisted);
  const discount = Math.round(((product.price - product.sale) / product.price) * 100);

  return (
    <div className="card" style={{ position: 'relative' }}>
      <img src={product.img} alt={product.name} className="img-fluid" />
      <div className="card-body bg-light-subtle rounded-bottom">
        <Link href={`/admin/products/${product.id}`} className="text-dark fw-medium fs-16">
          {product.name}
        </Link>
        <div className="my-1">
          <div className="d-flex gap-2 align-items-center">
            <ul className="d-flex text-warning m-0 fs-18 list-unstyled">
              {[1, 2, 3, 4, 5].map((star) => (
                <li key={star}>
                  <i className={`bx ${star <= Math.floor(product.rating) ? 'bxs-star' : star - 0.5 <= product.rating ? 'bxs-star-half' : 'bx-star'}`}></i>
                </li>
              ))}
            </ul>
            <p className="mb-0 fw-medium fs-15 text-dark">
              {product.rating} <span className="text-muted fs-13">({product.reviews} Review)</span>
            </p>
          </div>
        </div>
        <h4 className="fw-semibold text-dark mt-2 d-flex align-items-center gap-2">
          <span className="text-muted text-decoration-line-through">${product.price}</span> ${product.sale}{' '}
          <small className="text-muted">({discount}% Off)</small>
        </h4>
        <div className="mt-3">
          <div className="d-flex gap-2">
            {/* Dropdown uses Bootstrap JS (works fine) */}
            <div className="dropdown">
              <a
                href="#!"
                className="btn btn-soft-primary border border-primary-subtle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bx bx-dots-horizontal-rounded"></i>
              </a>
              <div className="dropdown-menu">
                <Link href={`/admin/products/${product.id}/edit`} className="dropdown-item">Edit</Link>
                <Link href={`/admin/products/${product.id}`} className="dropdown-item">Overview</Link>
                <a href="#!" className="dropdown-item">Delete</a>
              </div>
            </div>
            <Link
              href="/admin/orders/cart"
              className="btn btn-outline-dark border border-secondary-subtle d-flex align-items-center justify-content-center gap-1 w-100"
            >
              <i className="bx bx-cart align-middle"></i> Add To Cart
            </Link>
          </div>
        </div>
      </div>
      <span className="position-absolute top-0 end-0 p-3">
        <button
          type="button"
          onClick={() => setWishlisted(!wishlisted)}
          className="btn btn-soft-danger avatar-sm d-inline-flex align-items-center justify-content-center fs-20 rounded-circle"
        >
          <iconify-icon icon={wishlisted ? 'solar:heart-angle-bold-duotone' : 'solar:heart-broken'}></iconify-icon>
        </button>
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProductGridPage() {
  const [search, setSearch] = useState('');
  const filtered = PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="row">
      {/* ── Left Sidebar ── */}
      <div className="col-lg-3">
        {/* Search bar card */}
        <div className="card bg-light-subtle mb-2">
          <div className="card-header border-0">
            <div className="search-bar me-3 mb-1">
              <span><i className="bx bx-search-alt"></i></span>
              <input
                type="search"
                className="form-control"
                id="search"
                placeholder="Search ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter card */}
        <div className="card">
          <div className="card-body border-light">

            {/* Categories */}
            <FilterSection title="Categories">
              <div className="categories-list d-flex flex-column gap-2 mt-2">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="all-categories" defaultChecked />
                  <label className="form-check-label" htmlFor="all-categories">All Categories</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="fashion-categories" />
                  <label className="form-check-label" htmlFor="fashion-categories">Fashion Men , Women &amp; Kid&apos;s</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="sunglass-categories" />
                  <label className="form-check-label" htmlFor="sunglass-categories">Eye Ware &amp; Sunglass</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="watches-categories" />
                  <label className="form-check-label" htmlFor="watches-categories">Watches</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="electronics-categories" />
                  <label className="form-check-label" htmlFor="electronics-categories">Electronics Items</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="furniture-categories" />
                  <label className="form-check-label" htmlFor="furniture-categories">Furniture</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="headphones-categories" />
                  <label className="form-check-label" htmlFor="headphones-categories">Headphones</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="beauty-categories" />
                  <label className="form-check-label" htmlFor="beauty-categories">Beauty &amp; Health</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="shoes-categories" />
                  <label className="form-check-label" htmlFor="shoes-categories">Foot Ware</label>
                </div>
              </div>
            </FilterSection>

            {/* Product Price */}
            <FilterSection title="Product Price" className="mt-4">
              <div className="categories-list d-flex flex-column gap-2 mt-2">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="all-price" />
                  <label className="form-check-label" htmlFor="all-price">All Price</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="price-1" />
                  <label className="form-check-label" htmlFor="price-1">Below $200 (145)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="price-2" />
                  <label className="form-check-label" htmlFor="price-2">$200 - $500 (1,885)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="price-3" />
                  <label className="form-check-label" htmlFor="price-3">$500 - $800 (2,276)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="price-4" />
                  <label className="form-check-label" htmlFor="price-4">$800 - $1000 (12,676)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="price-5" />
                  <label className="form-check-label" htmlFor="price-5">$1000 - $1100 (13,123)</label>
                </div>
                <h5 className="text-dark fw-medium mt-3">Custom Price Range :</h5>
                <div className="formCost d-flex gap-2 align-items-center mt-2">
                  <input className="form-control form-control-sm text-center" type="text" id="minCost" defaultValue="0" />
                  <span className="fw-semibold text-muted">to</span>
                  <input className="form-control form-control-sm text-center" type="text" id="maxCost" defaultValue="1000" />
                </div>
              </div>
            </FilterSection>

            {/* Gender */}
            <FilterSection title="Gender" className="mt-4">
              <div className="categories-list d-flex flex-column gap-2 mt-2">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="men" />
                  <label className="form-check-label" htmlFor="men">Men (1,834)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="women" />
                  <label className="form-check-label" htmlFor="women">Women (2,890)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="kids" />
                  <label className="form-check-label" htmlFor="kids">Kid&apos;s (1,231)</label>
                </div>
              </div>
            </FilterSection>

            {/* Size & Fit */}
            <FilterSection title="Size & Fit" className="mt-4">
              <p className="text-muted mt-1">&quot;For better results, select gender and category&quot;</p>
              <div className="categories-list d-flex flex-column gap-2 mt-2">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="size-s" />
                  <label className="form-check-label" htmlFor="size-s">S (1,437)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="size-m" />
                  <label className="form-check-label" htmlFor="size-m">M (2,675)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="size-l" />
                  <label className="form-check-label" htmlFor="size-l">L (4,870)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="size-xl" />
                  <label className="form-check-label" htmlFor="size-xl">XL (7,543)</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="size-xxl" />
                  <label className="form-check-label" htmlFor="size-xxl">XXL (1,099)</label>
                </div>
                <a href="#!" className="text-dark fw-medium">More</a>
              </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Rating" className="mt-3">
              <div className="categories-list d-flex flex-column gap-2 mt-2">
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="rating-number" id="rate-1" />
                  <label className="form-check-label" htmlFor="rate-1">1 <i className="bx bxs-star text-warning"></i> &amp; Above (437)</label>
                </div>
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="rating-number" id="rate-2" />
                  <label className="form-check-label" htmlFor="rate-2">2 <i className="bx bxs-star text-warning"></i> &amp; Above (657)</label>
                </div>
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="rating-number" id="rate-3" />
                  <label className="form-check-label" htmlFor="rate-3">3 <i className="bx bxs-star text-warning"></i> &amp; Above (1,897)</label>
                </div>
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="rating-number" id="rate-4" />
                  <label className="form-check-label" htmlFor="rate-4">4 <i className="bx bxs-star text-warning"></i> &amp; Above (3,571)</label>
                </div>
              </div>
            </FilterSection>

          </div>
          <div className="card-footer">
            <a href="#!" className="btn btn-primary w-100">Apply</a>
          </div>
        </div>
      </div>

      {/* ── Right Content ── */}
      <div className="col-lg-9">
        {/* Toolbar */}
        <div className="card bg-light-subtle">
          <div className="card-header border-0">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-6">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item fw-medium"><a href="#!" className="text-dark">Categories</a></li>
                  <li className="breadcrumb-item active">All Product</li>
                </ol>
                <p className="mb-0 text-muted">Showing all <span className="text-dark fw-semibold">5,786</span> items results</p>
              </div>
              <div className="col-lg-6">
                <div className="text-md-end mt-3 mt-md-0">
                  <button type="button" className="btn btn-outline-secondary me-1"><i className="bx bx-cog me-1"></i>More Setting</button>
                  <button type="button" className="btn btn-outline-secondary me-1"><i className="bx bx-filter-alt me-1"></i> Filters</button>
                  <Link href="/admin/products/new" className="btn btn-success me-1"><i className="bx bx-plus"></i> New Product</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="row g-3 mt-1" style={{ rowGap: '1rem' }}>
          {filtered.map((p) => (
            <div key={p.id} className="col-md-6 col-xl-3 mb-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="py-3 border-top">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li className="page-item"><a className="page-link" href="#!">Previous</a></li>
              <li className="page-item active"><a className="page-link" href="#!">1</a></li>
              <li className="page-item"><a className="page-link" href="#!">2</a></li>
              <li className="page-item"><a className="page-link" href="#!">3</a></li>
              <li className="page-item"><a className="page-link" href="#!">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
