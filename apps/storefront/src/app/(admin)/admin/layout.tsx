'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

const PAGE_TITLES: Record<string, string> = {
  '/admin':                        'Dashboard',
  '/admin/products':               'Product List',
  '/admin/products/grid':          'Product Grid',
  '/admin/products/new':           'Add Product',
  '/admin/categories':             'Categories',
  '/admin/categories/new':         'Add Category',
  '/admin/inventory/warehouse':    'Warehouse',
  '/admin/orders':                 'Orders',
  '/admin/purchases':              'Purchases',
  '/admin/invoices':               'Invoices',
  '/admin/invoices/new':           'Add Invoice',
  '/admin/profile':                'Profile',
  '/admin/customers':              'Customers',
  '/admin/sellers':                'Sellers',
  '/admin/coupons':                'Coupons',
  '/admin/coupons/new':            'Add Coupon',
  '/admin/reviews':                'Reviews',
  '/admin/permissions':            'Permissions',
  '/admin/apps/calendar':          'Calendar',
  '/admin/apps/todo':              'Todo',
  '/admin/support/help-center':    'Help Center',
  '/admin/support/faqs':           'FAQs',
  '/admin/support/privacy-policy': 'Privacy Policy',
  '/admin/settings':               'Settings',
  '/admin/attributes':             'Attributes',
};

function getTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes('/edit'))    return 'Edit';
  if (pathname.includes('/new'))     return 'Create';
  if (pathname.includes('/details')) return 'Details';
  if (pathname.match(/\/invoices\/[A-Z]/)) return 'Invoice Details';
  if (pathname.match(/\/products\/\d/))    return 'Product Details';
  if (pathname.match(/\/customers\/\d/))   return 'Customer Details';
  if (pathname.match(/\/orders\/\d/))      return 'Order Details';
  return 'Admin';
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="wrapper">

      {/* Topbar */}
      <header className="topbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <div className="d-flex align-items-center">
              {/* Menu Toggle Button */}
              <div className="topbar-item">
                <button type="button" className="button-toggle-menu me-2">
                  <iconify-icon icon="solar:hamburger-menu-broken" className="fs-24 align-middle"></iconify-icon>
                </button>
              </div>

              {/* Title */}
              <div className="topbar-item">
                <h4 className="fw-bold topbar-button pe-none text-uppercase mb-0">{getTitle(pathname)}</h4>
              </div>
            </div>

          {/* Right */}
          <div className="d-flex align-items-center gap-1">
            {/* Search */}
            <div style={{ position: 'relative', marginRight: '8px' }}>
              <input
                type="search"
                placeholder="Search..."
                style={{
                  padding: '7px 14px 7px 36px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  fontSize: '13px',
                  color: '#1e293b',
                  outline: 'none',
                  width: '200px',
                  fontFamily: 'inherit',
                }}
              />
              <span style={{
                position: 'absolute', left: '10px', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px',
                pointerEvents: 'none', display: 'flex',
              }}>
                <iconify-icon icon="solar:magnifer-linear" />
              </span>
            </div>

            {/* Theme Color (Light/Dark) */}
            <div className="topbar-item">
              <button type="button" className="topbar-button" id="light-dark-mode" onClick={() => {
                 const currentTheme = document.documentElement.getAttribute('data-bs-theme');
                 const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                 document.documentElement.setAttribute('data-bs-theme', newTheme);
                 document.documentElement.setAttribute('data-topbar-color', newTheme);
                 document.documentElement.setAttribute('data-menu-color', newTheme);
                 
                 // Update offcanvas radio buttons if present
                 const themeRadio = document.getElementById(`layout-color-${newTheme}`) as HTMLInputElement;
                 if (themeRadio) themeRadio.checked = true;
                 const topbarRadio = document.getElementById(`topbar-color-${newTheme}`) as HTMLInputElement;
                 if (topbarRadio) topbarRadio.checked = true;
                 const menuRadio = document.getElementById(`menu-color-${newTheme}`) as HTMLInputElement;
                 if (menuRadio) menuRadio.checked = true;
              }}>
                <iconify-icon icon="solar:moon-bold-duotone" className="fs-24 align-middle"></iconify-icon>
              </button>
            </div>

            {/* Notification */}
            <div className="dropdown topbar-item">
              <button type="button" className="topbar-button position-relative" id="page-header-notifications-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <iconify-icon icon="solar:bell-bing-bold-duotone" className="fs-24 align-middle"></iconify-icon>
                <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">3<span className="visually-hidden">unread messages</span></span>
              </button>
              <div className="dropdown-menu py-0 dropdown-lg dropdown-menu-end" aria-labelledby="page-header-notifications-dropdown">
                <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                  <div className="row align-items-center">
                    <div className="col"><h6 className="m-0 fs-16 fw-semibold">Notifications</h6></div>
                    <div className="col-auto"><a href="#!" className="text-dark text-decoration-underline"><small>Clear All</small></a></div>
                  </div>
                </div>
                <div className="p-3 fs-13 text-muted text-center">No new notifications.</div>
              </div>
            </div>

            {/* Theme Setting */}
            <div className="topbar-item d-none d-md-flex">
              <button type="button" className="topbar-button" id="theme-settings-btn" data-bs-toggle="offcanvas" data-bs-target="#theme-settings-offcanvas" aria-controls="theme-settings-offcanvas">
                <iconify-icon icon="solar:settings-bold-duotone" className="fs-24 align-middle"></iconify-icon>
              </button>
            </div>

            {/* User */}
            <div className="dropdown topbar-item">
              <a type="button" className="topbar-button" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="d-flex align-items-center">
                  <img className="rounded-circle" width="32" src="https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg" alt="avatar-3" />
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <h6 className="dropdown-header">Welcome Gaston!</h6>
                <a className="dropdown-item" href="/admin/profile">
                  <i className="bx bx-user-circle text-muted fs-18 align-middle me-1"></i>
                  <span className="align-middle">Profile</span>
                </a>
                <a className="dropdown-item" href="/admin/settings">
                  <i className="bx bx-wallet text-muted fs-18 align-middle me-1"></i>
                  <span className="align-middle">Pricing</span>
                </a>
                <a className="dropdown-item" href="/admin/support/faqs">
                  <i className="bx bx-help-circle text-muted fs-18 align-middle me-1"></i>
                  <span className="align-middle">Help</span>
                </a>
                <div className="dropdown-divider my-1"></div>
                <a className="dropdown-item text-danger" href="/">
                  <i className="bx bx-log-out fs-18 align-middle me-1"></i>
                  <span className="align-middle">Logout</span>
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Page body */}
      <div className="page-content">
        <div className="container-fluid">
          <style>{`
            .card { margin-bottom: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
            .card-body { padding: 18px !important; }
            .card-header { padding: 14px 18px !important; min-height: auto !important; }
            .card-footer { padding: 12px 18px !important; }
            .avatar-md { width: 46px !important; height: 46px !important; }
            .row { row-gap: 16px; }
            .row.g-0, .row.g-1, .row.g-2, .row.g-3, .row.g-4 { row-gap: unset; }
            .table th { font-size: 13px; font-weight: 600; white-space: nowrap; }
            .table td { font-size: 13px; vertical-align: middle; }
            .badge { font-size: 12px; }
            .btn-soft-primary { background: #eff6ff; color: #3b82f6; border: none; }
            .btn-soft-warning { background: #fffbeb; color: #d97706; border: none; }
            .btn-soft-danger  { background: #fef2f2; color: #ef4444; border: none; }
            .btn-soft-success { background: #f0fdf4; color: #16a34a; border: none; }
            .btn-soft-primary:hover { background: #dbeafe; }
            .btn-soft-warning:hover { background: #fef3c7; }
            .btn-soft-danger:hover  { background: #fee2e2; }
            .btn-soft-success:hover { background: #dcfce7; }
          `}</style>
          {children}
        </div>
      </div>
      {/* Theme Settings Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="theme-settings-offcanvas" aria-labelledby="theme-settings-offcanvasLabel">
        <div className="offcanvas-header bg-primary text-white">
          <h5 className="offcanvas-title text-white" id="theme-settings-offcanvasLabel">Theme Settings</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <h6 className="mb-3 text-dark fw-semibold">Color Scheme</h6>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="data-bs-theme" id="layout-color-light" value="light" defaultChecked onChange={(e) => { 
              document.documentElement.setAttribute('data-bs-theme', 'light'); 
              document.documentElement.setAttribute('data-topbar-color', 'light');
              document.documentElement.setAttribute('data-menu-color', 'light');
              const topbarRadio = document.getElementById('topbar-color-light') as HTMLInputElement;
              if (topbarRadio) topbarRadio.checked = true;
              const menuRadio = document.getElementById('menu-color-light') as HTMLInputElement;
              if (menuRadio) menuRadio.checked = true;
            }} />
            <label className="form-check-label" htmlFor="layout-color-light">Light</label>
          </div>
          <div className="form-check mb-4">
            <input className="form-check-input" type="radio" name="data-bs-theme" id="layout-color-dark" value="dark" onChange={(e) => { 
              document.documentElement.setAttribute('data-bs-theme', 'dark'); 
              document.documentElement.setAttribute('data-topbar-color', 'dark');
              document.documentElement.setAttribute('data-menu-color', 'dark');
              const topbarRadio = document.getElementById('topbar-color-dark') as HTMLInputElement;
              if (topbarRadio) topbarRadio.checked = true;
              const menuRadio = document.getElementById('menu-color-dark') as HTMLInputElement;
              if (menuRadio) menuRadio.checked = true;
            }} />
            <label className="form-check-label" htmlFor="layout-color-dark">Dark</label>
          </div>

          <h6 className="mb-3 text-dark fw-semibold">Topbar Color</h6>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="data-topbar-color" id="topbar-color-light" value="light" defaultChecked onChange={(e) => { document.documentElement.setAttribute('data-topbar-color', e.target.value); }} />
            <label className="form-check-label" htmlFor="topbar-color-light">Light</label>
          </div>
          <div className="form-check mb-4">
            <input className="form-check-input" type="radio" name="data-topbar-color" id="topbar-color-dark" value="dark" onChange={(e) => { document.documentElement.setAttribute('data-topbar-color', e.target.value); }} />
            <label className="form-check-label" htmlFor="topbar-color-dark">Dark</label>
          </div>

          <h6 className="mb-3 text-dark fw-semibold">Menu Color</h6>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="data-menu-color" id="menu-color-light" value="light" onChange={(e) => { document.documentElement.setAttribute('data-menu-color', e.target.value); }} />
            <label className="form-check-label" htmlFor="menu-color-light">Light</label>
          </div>
          <div className="form-check mb-4">
            <input className="form-check-input" type="radio" name="data-menu-color" id="menu-color-dark" value="dark" defaultChecked onChange={(e) => { document.documentElement.setAttribute('data-menu-color', e.target.value); }} />
            <label className="form-check-label" htmlFor="menu-color-dark">Dark</label>
          </div>

          <h6 className="mb-3 text-dark fw-semibold">Sidebar Size</h6>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="data-menu-size" id="sidebar-size-default" value="default" onChange={(e) => { document.documentElement.setAttribute('data-menu-size', e.target.value); }} />
            <label className="form-check-label" htmlFor="sidebar-size-default">Default</label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="data-menu-size" id="sidebar-size-condensed" value="condensed" onChange={(e) => { document.documentElement.setAttribute('data-menu-size', e.target.value); }} />
            <label className="form-check-label" htmlFor="sidebar-size-condensed">Condensed</label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="data-menu-size" id="sidebar-size-hidden" value="hidden" onChange={(e) => { document.documentElement.setAttribute('data-menu-size', e.target.value); }} />
            <label className="form-check-label" htmlFor="sidebar-size-hidden">Hidden</label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name="data-menu-size" id="sidebar-size-small-hover-active" value="sm-hover-active" defaultChecked onChange={(e) => { document.documentElement.setAttribute('data-menu-size', e.target.value); }} />
            <label className="form-check-label" htmlFor="sidebar-size-small-hover-active">Small Hover Active</label>
          </div>
          <div className="form-check mb-4">
            <input className="form-check-input" type="radio" name="data-menu-size" id="sidebar-size-small-hover" value="sm-hover" onChange={(e) => { document.documentElement.setAttribute('data-menu-size', e.target.value); }} />
            <label className="form-check-label" htmlFor="sidebar-size-small-hover">Small Hover</label>
          </div>

          <div className="d-grid mt-4">
            <button type="button" className="btn btn-danger" onClick={() => {
              document.documentElement.setAttribute('data-bs-theme', 'light');
              document.documentElement.setAttribute('data-topbar-color', 'light');
              document.documentElement.setAttribute('data-menu-color', 'dark');
              document.documentElement.setAttribute('data-menu-size', 'sm-hover-active');
              // Also update the radio buttons visually
              (document.getElementById('layout-color-light') as HTMLInputElement).checked = true;
              (document.getElementById('topbar-color-light') as HTMLInputElement).checked = true;
              (document.getElementById('menu-color-dark') as HTMLInputElement).checked = true;
              (document.getElementById('sidebar-size-small-hover') as HTMLInputElement).checked = true;
            }}>Reset</button>
          </div>
        </div>
      </div>

    </div>
  );
}
