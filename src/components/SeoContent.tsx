import React from 'react';

interface SeoContentProps {
  title1?: string;
  body1?: string;
  title2?: string;
  body2?: string;
  title3?: string;
  body3?: string;
}

export function SeoContent({
  title1,
  body1,
  title2,
  body2,
  title3,
  body3
}: SeoContentProps) {
  return (
    <div className="w-full py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-xl font-bold mb-3 text-slate-900">
            {title1 || "Quality You Can Rely On"}
          </h2>
          <p className="mb-5">
            {body1 || "We provide a comprehensive selection of premium goods, equipment, and essentials sourced directly from trusted manufacturers. Every product undergoes strict quality assessment to meet high standards of performance and reliability."}
          </p>

          <h2 className="text-xl font-bold mb-3 mt-6 text-slate-900">
            {title2 || "Fast Shipping & Nationwide Delivery"}
          </h2>
          <div className="mb-5 text-sm">
            {body2 ? (
              <p>{body2}</p>
            ) : (
              <>
                <p className="mb-3">
                  Enjoy reliable handling and trackable delivery right to your door or jobsite. Standard orders are packed and dispatched promptly, with express fulfillment available for time-critical needs.
                </p>
                <p>
                  Bulk and commercial shipments are coordinated with dedicated logistics carriers to ensure secure, on-schedule transport.
                </p>
              </>
            )}
          </div>

          <h2 className="text-xl font-bold mb-3 mt-6 text-slate-900">
            {title3 || "Warranty, Support & Bulk Inquiries"}
          </h2>
          <div className="mb-5 text-sm">
            {body3 ? (
              <p>{body3}</p>
            ) : (
              <>
                <p className="mb-3">
                  All items come with manufacturer warranty protection and dedicated customer support. Inquire with our sales team for commercial pricing, custom specifications, or recurring supply arrangements.
                </p>
                <p>
                  Our responsive customer care desk is available Monday through Saturday to answer technical questions and assist with orders.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}