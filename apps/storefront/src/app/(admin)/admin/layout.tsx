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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const SIDEBAR_W = 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

      {/* ── Sidebar ─────────────────────────────── */}
      <AdminSidebar isMenuOpen={sidebarOpen} />

      {/* ── Content column ──────────────────────── */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? `${SIDEBAR_W}px` : '0px',
        transition: 'margin-left 0.28s cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>

        {/* ── Topbar ──────────────────────────── */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          gap: '16px',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', fontSize: '22px',
                display: 'flex', alignItems: 'center',
                padding: '6px', borderRadius: '8px',
                transition: 'background 0.15s',
              }}
              title="Toggle sidebar"
            >
              <iconify-icon icon="solar:hamburger-menu-broken" />
            </button>
            <h1 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}>
              {getTitle(pathname)}
            </h1>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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

            {/* Icon buttons */}
            {([
              { icon: 'solar:moon-bold-duotone' },
              { icon: 'solar:bell-bing-bold-duotone', badge: true },
              { icon: 'solar:settings-bold-duotone' },
            ] as { icon: string; badge?: boolean }[]).map(({ icon, badge }) => (
              <button
                key={icon}
                style={{
                  position: 'relative', background: 'none', border: 'none',
                  cursor: 'pointer', color: '#64748b', fontSize: '20px',
                  display: 'flex', alignItems: 'center',
                  padding: '8px', borderRadius: '8px',
                }}
              >
                <iconify-icon icon={icon} />
                {badge && (
                  <span style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '7px', height: '7px',
                    background: '#ef4444', borderRadius: '50%',
                    border: '1.5px solid #fff',
                  }} />
                )}
              </button>
            ))}

            {/* Avatar */}
            <img
              src="https://techzaa.in/larkon/admin/assets/images/users/avatar-1.jpg"
              alt="avatar"
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                cursor: 'pointer', border: '2px solid #e2e8f0', marginLeft: '6px',
                objectFit: 'cover',
              }}
            />
          </div>
        </header>

        {/* ── Page body ────────────────────────── */}
        <main style={{ flex: 1, padding: '20px' }}>
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
        </main>

      </div>
    </div>
  );
}
