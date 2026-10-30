'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// -- types ------------------------------------------------------------------
interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href?: string;          // leaf link (no children)
  children?: SubItem[];
  matchPrefix?: string;   // highlight parent when pathname starts with this
}

// -- nav tree ---------------------------------------------------------------
const GENERAL_NAV: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-5-bold-duotone',
    href: '/admin',
  },
  {
    key: 'Products',
    label: 'Products',
    icon: 'solar:t-shirt-bold-duotone',
    matchPrefix: '/admin/products',
    children: [
      { label: 'List',   href: '/admin/products' },
      { label: 'Grid',   href: '/admin/products/grid' },
      { label: 'Create', href: '/admin/products/new' },
    ],
  },
  {
    key: 'Category',
    label: 'Category',
    icon: 'solar:clipboard-list-bold-duotone',
    matchPrefix: '/admin/categories',
    children: [
      { label: 'List',   href: '/admin/categories' },
      { label: 'Create', href: '/admin/categories/new' },
      { label: 'Edit',   href: '/admin/categories/1/edit' },
    ],
  },
  {
    key: 'Inventory',
    label: 'Inventory',
    icon: 'solar:box-bold-duotone',
    matchPrefix: '/admin/inventory',
    children: [
      { label: 'Stock List',      href: '/admin/inventory/stock' },
      { label: 'Warehouse',       href: '/admin/inventory/warehouse' },
      { label: 'Received Orders', href: '/admin/inventory/received-orders' },
      { label: 'Stock History',   href: '/admin/inventory/history' },
      { label: 'Reports & Bulk',  href: '/admin/inventory/reports' },
    ],
  },
  {
    key: 'Orders',
    label: 'Orders',
    icon: 'solar:bag-smile-bold-duotone',
    matchPrefix: '/admin/orders',
    children: [
      { label: 'List',     href: '/admin/orders' },
      { label: 'Details',  href: '/admin/orders/details' },
      { label: 'Cart',     href: '/admin/orders/cart' },
      { label: 'Checkout', href: '/admin/orders/checkout' },
    ],
  },
  {
    key: 'Purchases',
    label: 'Purchases',
    icon: 'solar:card-send-bold-duotone',
    matchPrefix: '/admin/purchases',
    children: [
      { label: 'List',   href: '/admin/purchases' },
      { label: 'Order',  href: '/admin/purchases/order' },
      { label: 'Return', href: '/admin/purchases/return' },
    ],
  },
  {
    key: 'Attributes',
    label: 'Attributes',
    icon: 'solar:confetti-minimalistic-bold-duotone',
    matchPrefix: '/admin/attributes',
    children: [
      { label: 'List',   href: '/admin/attributes' },
      { label: 'Edit',   href: '/admin/attributes/edit' },
      { label: 'Create', href: '/admin/attributes/new' },
    ],
  },
  {
    key: 'Finance',
    label: 'Payments & Finance',
    icon: 'solar:wallet-money-bold-duotone',
    matchPrefix: '/admin/finance',
    children: [
      { label: 'Dashboard',    href: '/admin/finance/dashboard' },
      { label: 'Transactions', href: '/admin/finance/transactions' },
      { label: 'Refunds',      href: '/admin/finance/refunds' },
      { label: 'Payouts',      href: '/admin/finance/payouts' },
      { label: 'Gateways',     href: '/admin/finance/gateways' },
      { label: 'Taxes',        href: '/admin/finance/taxes' },
      { label: 'Reports',      href: '/admin/finance/reports' },
      { label: 'Invoices',     href: '/admin/invoices' },
      { label: 'Add Invoice',  href: '/admin/invoices/new' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'solar:settings-bold-duotone',
    href: '/admin/settings',
  },
];

const USERS_NAV: NavItem[] = [
  {
    key: 'profile',
    label: 'Profile',
    icon: 'solar:user-bold-duotone',
    href: '/admin/profile',
  },
  {
    key: 'Staff',
    label: 'Staff',
    icon: 'solar:users-group-rounded-bold-duotone',
    matchPrefix: '/admin/staff',
    href: '/admin/staff',
  },
  {
    key: 'Roles',
    label: 'Roles & Permissions',
    icon: 'solar:user-speak-rounded-bold-duotone',
    href: '/admin/roles',
  },
  {
    key: 'Activity',
    label: 'Activity Log',
    icon: 'solar:history-bold-duotone',
    href: '/admin/activity',
  },
  {
    key: 'Customers',
    label: 'Customers',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    matchPrefix: '/admin/customers',
    children: [
      { label: 'List',    href: '/admin/customers' },
      { label: 'Details', href: '/admin/customers/details' },
    ],
  },
  {
    key: 'Sellers',
    label: 'Sellers',
    icon: 'solar:shop-bold-duotone',
    matchPrefix: '/admin/sellers',
    children: [
      { label: 'List',    href: '/admin/sellers' },
      { label: 'Details', href: '/admin/sellers/details' },
      { label: 'Edit',    href: '/admin/sellers/edit' },
      { label: 'Create',  href: '/admin/sellers/new' },
    ],
  },
];

const APPS_NAV: NavItem[] = [
  {
    key: 'calendar',
    label: 'Calendar',
    icon: 'solar:calendar-bold-duotone',
    href: '/admin/apps/calendar',
  },
  {
    key: 'todo',
    label: 'Todo',
    icon: 'solar:checklist-minimalistic-bold-duotone',
    href: '/admin/apps/todo',
  },
];

const OTHER_NAV: NavItem[] = [
  {
    key: 'Coupons',
    label: 'Coupons',
    icon: 'solar:leaf-bold-duotone',
    matchPrefix: '/admin/coupons',
    children: [
      { label: 'List', href: '/admin/coupons' },
      { label: 'Add',  href: '/admin/coupons/new' },
    ],
  },
  {
    key: 'reviews',
    label: 'Reviews',
    icon: 'solar:chat-square-like-bold-duotone',
    href: '/admin/reviews',
  },
];

const SUPPORT_NAV: NavItem[] = [
  {
    key: 'chat',
    label: 'Helpdesk Chat',
    icon: 'solar:chat-round-line-bold-duotone',
    href: '/admin/support/chat',
  },
  {
    key: 'help-center',
    label: 'Help Center',
    icon: 'solar:help-bold-duotone',
    href: '/admin/support/help-center',
  },
  {
    key: 'faqs',
    label: 'FAQs',
    icon: 'solar:question-circle-bold-duotone',
    href: '/admin/support/faqs',
  },
  {
    key: 'privacy-policy',
    label: 'Privacy Policy',
    icon: 'solar:shield-check-bold-duotone',
    href: '/admin/support/privacy-policy',
  },
];

const COMMUNICATIONS_NAV: NavItem[] = [
  {
    key: 'emails',
    label: 'Emails & Flows',
    icon: 'solar:letter-bold-duotone',
    href: '/admin/communications/emails',
  },
  {
    key: 'sms',
    label: 'SMS Settings',
    icon: 'solar:smartphone-update-bold-duotone',
    href: '/admin/communications/sms',
  },
  {
    key: 'push',
    label: 'Push Notifications',
    icon: 'solar:bell-bing-bold-duotone',
    href: '/admin/communications/push',
  },
];

const CMS_NAV: NavItem[] = [
  {
    key: 'site-builder',
    label: 'Site Builder',
    icon: 'solar:monitor-smartphone-bold-duotone',
    href: '/admin/cms/builder',
  },
  {
    key: 'pages',
    label: 'Pages',
    icon: 'solar:document-text-bold-duotone',
    href: '/admin/cms/pages',
  },
  {
    key: 'blog',
    label: 'Blog',
    icon: 'solar:pen-new-round-bold-duotone',
    href: '/admin/cms/blog',
  },
  {
    key: 'navigation',
    label: 'Navigation',
    icon: 'solar:hamburger-menu-bold-duotone',
    href: '/admin/cms/navigation',
  },
  {
    key: 'seo',
    label: 'Advanced SEO',
    icon: 'solar:global-bold-duotone',
    href: '/admin/cms/seo',
  },
];

// -- sub-component: nav entry ------------------------------------------------
function NavEntry({
  item,
  pathname,
  expandedKey,
  toggle,
  menuSize,
}: {
  item: NavItem;
  pathname: string;
  expandedKey: string | null;
  toggle: (key: string) => void;
  menuSize: string;
}) {
  const isLeaf = !item.children;
  const isParentActive = item.matchPrefix
    ? pathname.startsWith(item.matchPrefix)
    : pathname === item.href;

  const isOpen = expandedKey === item.key;

  if (isLeaf) {
    return (
      <li className="nav-item">
        <Link href={item.href!} className={`nav-link ${isParentActive ? 'active' : ''}`}>
          <span className="nav-icon">
            <iconify-icon icon={item.icon} />
          </span>
          <span className="nav-text">{item.label}</span>
        </Link>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <a
        className={`nav-link menu-arrow ${isParentActive ? 'active' : ''} ${!isOpen ? 'collapsed' : ''}`}
        href="#!"
        onClick={(e) => {
          e.preventDefault();
          toggle(item.key);
        }}
        aria-expanded={isOpen}
      >
        <span className="nav-icon">
          <iconify-icon icon={item.icon} />
        </span>
        <span className="nav-text">{item.label}</span>
      </a>
      <div 
        className={menuSize === 'condensed' || menuSize === 'hidden' ? `collapse ${isOpen ? 'show' : ''}` : ''}
        style={menuSize !== 'condensed' && menuSize !== 'hidden' ? {
          overflow: 'hidden', 
          maxHeight: isOpen ? '500px' : '0px', 
          transition: 'max-height 0.28s cubic-bezier(.4,0,.2,1)',
          display: 'block'
        } : undefined}
      >
        <ul className="nav sub-navbar-nav" style={{ paddingTop: '5px', paddingBottom: '5px' }}>
          {item.children!.map((child) => {
            const childActive = pathname === child.href;
            return (
              <li className="sub-nav-item" key={child.href}>
                <Link 
                  href={child.href} 
                  className={`sub-nav-link ${childActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 20px',
                    opacity: (menuSize !== 'condensed' && menuSize !== 'hidden' && !isOpen) ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: childActive ? '#ff6c2f' : 'currentColor',
                    opacity: childActive ? 1 : 0.4
                  }} />
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

// -- main export ------------------------------------------------------------
export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [menuSize, setMenuSize] = useState('default');

  // Sync menuSize with document.documentElement data-menu-size
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setMenuSize(document.documentElement.getAttribute('data-menu-size') || 'default');
      
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName === 'data-menu-size') {
            setMenuSize(document.documentElement.getAttribute('data-menu-size') || 'default');
          }
        }
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-menu-size'] });
      return () => observer.disconnect();
    }
  }, []);

  // Auto-expand the correct menu on route change
  useEffect(() => {
    // Find which parent owns the current pathname
    const allNavGroups = [
      GENERAL_NAV, CMS_NAV, COMMUNICATIONS_NAV, USERS_NAV, APPS_NAV, OTHER_NAV, SUPPORT_NAV
    ];

    for (const group of allNavGroups) {
      for (const item of group) {
        if (item.children) {
           const isActive = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false;
           if (isActive) {
             setExpandedKey(item.key);
             return;
           }
        }
      }
    }
  }, [pathname]);

  const toggle = (key: string) => {
    setExpandedKey(prev => prev === key ? null : key);
  };

  const renderGroup = (title: string, items: NavItem[]) => (
    <>
      <li className="menu-title">{title}</li>
      {items.map((item) => (
        <NavEntry 
          key={item.key} 
          item={item} 
          pathname={pathname} 
          expandedKey={expandedKey}
          toggle={toggle}
          menuSize={menuSize}
        />
      ))}
    </>
  );

  return (
    <div className="main-nav">
      {/* Logo Box */}
      <div className="logo-box" style={{ paddingTop: '20px', paddingBottom: '10px', height: 'auto', display: 'flex', alignItems: 'center' }}>
        <a href="/admin" className="logo-dark">
          <span className="logo-sm">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <iconify-icon icon="solar:cart-large-4-bold-duotone" style={{ fontSize: '28px', color: '#ff6c2f' }} />
            </span>
          </span>
          <span className="logo-lg">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <iconify-icon icon="solar:cart-large-4-bold-duotone" style={{ fontSize: '28px', color: '#ff6c2f' }} />
              <span className="font-bold text-xl tracking-wide" style={{ fontFamily: 'Outfit, sans-serif', textTransform: 'none', color: '#3d2817' }}>
                Waveron
              </span>
            </span>
          </span>
        </a>
        <a href="/admin" className="logo-light">
          <span className="logo-sm">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <iconify-icon icon="solar:cart-large-4-bold-duotone" style={{ fontSize: '28px', color: '#ff6c2f' }} />
            </span>
          </span>
          <span className="logo-lg">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <iconify-icon icon="solar:cart-large-4-bold-duotone" style={{ fontSize: '28px', color: '#ff6c2f' }} />
              <span className="font-bold text-xl tracking-wide" style={{ fontFamily: 'Outfit, sans-serif', textTransform: 'none', color: '#ffffff' }}>
                Waveron
              </span>
            </span>
          </span>
        </a>
      </div>

      {/* Menu Toggle Button (for hover active mode) */}
      <button type="button" className="button-sm-hover" aria-label="Show Full Sidebar">
        <iconify-icon icon="solar:double-alt-arrow-right-bold-duotone" className="button-sm-hover-icon" />
      </button>

      {/* Scrollable nav */}
      <div className="scrollbar" data-simplebar>
        <ul className="navbar-nav" id="navbar-nav">
          {renderGroup('General', GENERAL_NAV)}
          {renderGroup('Content & SEO', CMS_NAV)}
          {renderGroup('Communications', COMMUNICATIONS_NAV)}
          {renderGroup('Users & Staff', USERS_NAV)}
          {renderGroup('Apps', APPS_NAV)}
          {renderGroup('Other', OTHER_NAV)}
          {renderGroup('Support', SUPPORT_NAV)}
        </ul>
      </div>
    </div>
  );
}
