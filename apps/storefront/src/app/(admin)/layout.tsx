import '../../index.css';
import Script from 'next/script';

export const metadata = {
  title: 'Dashboard | Larkon - Responsive Admin Dashboard Template',
  description: 'A fully responsive premium admin dashboard template',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-bs-theme="light" data-topbar-color="light" data-menu-color="dark" data-menu-size="sm-hover-active">
      <head>
        {/* Larkon Core CSS */}
        <link href="https://techzaa.in/larkon/admin/assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" type="text/css" />
        <link href="https://techzaa.in/larkon/admin/assets/css/icons.min.css" rel="stylesheet" type="text/css" />
        <link href="https://techzaa.in/larkon/admin/assets/css/app.min.css" rel="stylesheet" type="text/css" />
        {/* Larkon Theme Config - must be before Bootstrap JS */}
        <script src="https://techzaa.in/larkon/admin/assets/js/config.js" />
      </head>
        
      <body>
        {children}
        {/* Iconify Icon */}
        <Script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js" strategy="afterInteractive" />
        {/* Bootstrap Bundle JS (includes Popper) - required for dropdowns, collapse, tooltips */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        {/* Larkon App JS */}
        <Script src="https://techzaa.in/larkon/admin/assets/js/app.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
