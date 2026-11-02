import '../../index.css';
import Script from 'next/script';

export const metadata = {
  title: 'Dashboard | Waveron - Responsive Admin Dashboard Template',
  description: 'A fully responsive premium admin dashboard template',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-bs-theme="light" data-topbar-color="light" data-menu-color="light" data-menu-size="sm-hover-active">
      <head>
        {/* Immediate Theme Restoration from localStorage before render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cfg = localStorage.getItem('__LARKON_CONFIG__') || sessionStorage.getItem('__LARKON_CONFIG__');
                  if (cfg) {
                    var parsed = JSON.parse(cfg);
                    if (parsed.theme) document.documentElement.setAttribute('data-bs-theme', parsed.theme);
                    if (parsed.topbar && parsed.topbar.color) document.documentElement.setAttribute('data-topbar-color', parsed.topbar.color);
                    else if (parsed.theme) document.documentElement.setAttribute('data-topbar-color', parsed.theme);
                    if (parsed.menu && parsed.menu.color) document.documentElement.setAttribute('data-menu-color', parsed.menu.color);
                    else if (parsed.theme) document.documentElement.setAttribute('data-menu-color', parsed.theme);
                    if (parsed.menu && parsed.menu.size) document.documentElement.setAttribute('data-menu-size', parsed.menu.size);
                  } else {
                    document.documentElement.setAttribute('data-bs-theme', 'light');
                    document.documentElement.setAttribute('data-topbar-color', 'light');
                    document.documentElement.setAttribute('data-menu-color', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Larkon Core CSS (Self-Hosted) */}
        <link href="/admin/css/vendor.min.css" rel="stylesheet" type="text/css" />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" type="text/css" />
        <link href="/admin/css/icons.min.css" rel="stylesheet" type="text/css" />
        <link href="/admin/css/app.min.css" rel="stylesheet" type="text/css" />
        {/* Larkon Theme Config - must be before Bootstrap JS */}
        <script src="/admin/js/config.js" />
      </head>
        
      <body>
        {children}
        {/* Iconify Icon */}
        <Script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js" strategy="afterInteractive" />
        {/* Bootstrap Bundle JS (includes Popper) - required for dropdowns, collapse, tooltips */}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        {/* Larkon App JS (Self-Hosted) */}
        <Script src="/admin/js/app.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
