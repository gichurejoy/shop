'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// ── types ────────────────────────────────────────────────────────────────────
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

// ── nav tree ─────────────────────────────────────────────────────────────────
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
    key: 'Invoice',
    label: 'Invoices',
    icon: 'solar:bill-list-bold-duotone',
    matchPrefix: '/admin/invoices',
    children: [
      { label: 'List',    href: '/admin/invoices' },
      { label: 'Details', href: '/admin/invoices/details' },
      { label: 'Create',  href: '/admin/invoices/new' },
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
    key: 'Roles',
    label: 'Roles',
    icon: 'solar:user-speak-rounded-bold-duotone',
    matchPrefix: '/admin/roles',
    children: [
      { label: 'List',   href: '/admin/roles' },
      { label: 'Edit',   href: '/admin/roles/edit' },
      { label: 'Create', href: '/admin/roles/new' },
    ],
  },
  {
    key: 'permissions',
    label: 'Permissions',
    icon: 'solar:checklist-minimalistic-bold-duotone',
    href: '/admin/permissions',
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

// ── styles (CSS-in-JS tokens so nothing relies on Larkon) ────────────────────
const S = {
  sidebar: (open: boolean): React.CSSProperties => ({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: open ? '260px' : '0px',
    minWidth: open ? '260px' : '0px',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #1a2035 0%, #1e2746 100%)',
    boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1)',
    zIndex: 1000,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  }),
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px 20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  } as React.CSSProperties,
  logoIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ff6c2f, #ff8f5e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as React.CSSProperties,
  logoText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '18px',
    letterSpacing: '-0.3px',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '12px 0 24px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255,0.08) transparent',
  } as React.CSSProperties,
  sectionTitle: {
    padding: '16px 20px 6px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1.2px',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    userSelect: 'none',
  } as React.CSSProperties,
  navItem: (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    margin: '1px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
    background: active
      ? 'linear-gradient(90deg,rgba(255,108,47,0.25) 0%,rgba(255,108,47,0.08) 100%)'
      : 'transparent',
    borderLeft: active ? '2px solid #ff6c2f' : '2px solid transparent',
    textDecoration: 'none',
    fontSize: '13.5px',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.18s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
  navItemHover: {
    color: '#fff',
    background: 'rgba(255,255,255,0.06)',
  } as React.CSSProperties,
  navIcon: {
    fontSize: '18px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    opacity: 0.85,
  } as React.CSSProperties,
  navLabel: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  chevron: (open: boolean): React.CSSProperties => ({
    fontSize: '14px',
    flexShrink: 0,
    transition: 'transform 0.22s ease',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    color: 'rgba(255,255,255,0.4)',
  }),
  subMenu: (open: boolean): React.CSSProperties => ({
    overflow: 'hidden',
    maxHeight: open ? '400px' : '0px',
    transition: 'max-height 0.28s cubic-bezier(.4,0,.2,1)',
  }),
  subItem: (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px 8px 50px',
    margin: '0 10px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    color: active ? '#ff6c2f' : 'rgba(255,255,255,0.5)',
    fontWeight: active ? 600 : 400,
    background: active ? 'rgba(255,108,47,0.08)' : 'transparent',
    transition: 'all 0.16s ease',
    whiteSpace: 'nowrap',
  }),
  dot: (active: boolean): React.CSSProperties => ({
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    flexShrink: 0,
    background: active ? '#ff6c2f' : 'rgba(255,255,255,0.25)',
    transition: 'background 0.16s',
  }),
};

// ── sub-component: single nav entry ─────────────────────────────────────────
function NavEntry({
  item,
  pathname,
  expandedMenu,
  toggle,
}: {
  item: NavItem;
  pathname: string;
  expandedMenu: string | null;
  toggle: (key: string) => void;
}) {
  const isLeaf = !item.children;
  const isParentActive = item.matchPrefix
    ? pathname.startsWith(item.matchPrefix)
    : pathname === item.href;
  const isOpen = expandedMenu === item.key;

  const [hovered, setHovered] = useState(false);

  if (isLeaf) {
    return (
      <Link
        href={item.href!}
        style={{
          ...S.navItem(isParentActive),
          ...(hovered && !isParentActive ? S.navItemHover : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={S.navIcon}>
          <iconify-icon icon={item.icon} />
        </span>
        <span style={S.navLabel}>{item.label}</span>
      </Link>
    );
  }

  return (
    <>
      <div
        onClick={() => toggle(item.key)}
        style={{
          ...S.navItem(isParentActive),
          ...(hovered && !isParentActive ? S.navItemHover : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        aria-expanded={isOpen}
      >
        <span style={S.navIcon}>
          <iconify-icon icon={item.icon} />
        </span>
        <span style={S.navLabel}>{item.label}</span>
        <span style={S.chevron(isOpen)}>
          <iconify-icon icon="solar:alt-arrow-down-bold" />
        </span>
      </div>

      <div style={S.subMenu(isOpen)}>
        {item.children!.map((child) => {
          const childActive = pathname === child.href;
          return (
            <SubEntry key={child.href} child={child} active={childActive} />
          );
        })}
      </div>
    </>
  );
}

function SubEntry({ child, active }: { child: SubItem; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={child.href}
      style={{
        ...S.subItem(active),
        ...(hovered && !active ? { color: '#fff', background: 'rgba(255,255,255,0.04)' } : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={S.dot(active)} />
      {child.label}
    </Link>
  );
}

// ── main export ──────────────────────────────────────────────────────────────
export default function AdminSidebar({ isMenuOpen }: { isMenuOpen: boolean }) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Products');

  const toggle = (key: string) =>
    setExpandedMenu((prev) => (prev === key ? null : key));

  const renderGroup = (items: NavItem[]) =>
    items.map((item) => (
      <NavEntry
        key={item.key}
        item={item}
        pathname={pathname}
        expandedMenu={expandedMenu}
        toggle={toggle}
      />
    ));

  return (
    <aside style={S.sidebar(isMenuOpen)} aria-label="Sidebar navigation">
      {/* Logo */}
      <div style={S.logoBox}>
        <div style={S.logoIcon}>
          <iconify-icon icon="solar:shop-bold-duotone" style={{ color: '#fff', fontSize: '18px' }} />
        </div>
        <span style={S.logoText}>Larkon</span>
      </div>

      {/* Scrollable nav */}
      <div style={S.scrollArea}>
        <div style={S.sectionTitle}>General</div>
        {renderGroup(GENERAL_NAV)}

        <div style={S.sectionTitle}>Content & SEO</div>
        {renderGroup(CMS_NAV)}

        <div style={S.sectionTitle}>Users</div>
        {renderGroup(USERS_NAV)}

        <div style={S.sectionTitle}>Apps</div>
        {renderGroup(APPS_NAV)}

        <div style={S.sectionTitle}>Other</div>
        {renderGroup(OTHER_NAV)}

        <div style={S.sectionTitle}>Support</div>
        {renderGroup(SUPPORT_NAV)}
      </div>
    </aside>
  );
}
