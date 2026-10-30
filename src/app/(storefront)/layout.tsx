import '../../index.css';
import { ClientLayout } from '../../components/ClientLayout';
import { getCmsSeoSettings, getCmsAnnouncementBar, getCmsNavigation } from '../actions';

export async function generateMetadata() {
  const seo = await getCmsSeoSettings();
  return {
    title: {
      template: seo.siteTitleTemplate ? seo.siteTitleTemplate.replace('{page_title}', '%s') : '%s | Waveron Store',
      default: seo.siteTitleTemplate ? seo.siteTitleTemplate.replace('{page_title}', 'Home') : 'Waveron Store',
    },
    description: seo.defaultMetaDescription || 'Your favorite e-commerce store',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcementBar = await getCmsAnnouncementBar();
  const navigation = await getCmsNavigation();

  return (
    <html lang="en">
      <body>
        {announcementBar.visible && (
          <div 
            className="w-full text-center py-2 px-4 text-sm font-medium" 
            style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}
          >
            {announcementBar.link ? (
              <a href={announcementBar.link} className="hover:underline">{announcementBar.message}</a>
            ) : (
              announcementBar.message
            )}
          </div>
        )}
        <ClientLayout navigation={navigation}>{children}</ClientLayout>
      </body>
    </html>
  );
}
