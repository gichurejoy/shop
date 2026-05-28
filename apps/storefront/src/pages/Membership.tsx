import React from 'react';
import {
  Star,
  Gift,
  Truck,
  Clock,
  RefreshCw,
  Zap,
  Check,
  ChevronDown } from
'lucide-react';
export function Membership() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero Section */}
      <div className="bg-[#5C3A24] text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-['Playfair_Display']">
          Lumière & Knit Membership
        </h1>
        <p className="text-xl text-[#D4A574] max-w-2xl mx-auto font-light">
          More than a loyalty program — a lifestyle upgrade.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {/* Silver Tier */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#3D2817] mb-2 font-['Playfair_Display']">
                Silver
              </h3>
              <p className="text-gray-500 mb-4">Free to join</p>
              <div className="text-3xl font-bold text-[#3D2817]">
                $0<span className="text-lg text-gray-500 font-normal">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Earn 1 point per $1 spent</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Birthday gift (500 points)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Standard free shipping over $150</span>
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-[#8B5A3C] text-[#8B5A3C] font-bold rounded-xl hover:bg-[#FAF6F0] transition-colors">
              Join for Free
            </button>
          </div>

          {/* Gold Tier */}
          <div className="bg-[#3D2817] rounded-3xl p-8 shadow-xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4A574] text-[#3D2817] px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 font-['Playfair_Display']">
                Gold
              </h3>
              <p className="text-[#D4A574] mb-4">Elevated experience</p>
              <div className="text-3xl font-bold text-white">
                $9.99
                <span className="text-lg text-gray-400 font-normal">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-gray-300">
                <Check className="w-5 h-5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                <span className="text-white">Earn 2 points per $1 spent</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <Check className="w-5 h-5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                <span className="text-white">Birthday gift (1000 points)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <Check className="w-5 h-5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                <span className="text-white">
                  Free standard shipping on ALL orders
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <Check className="w-5 h-5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                <span className="text-white">Early access to sales (24h)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <Check className="w-5 h-5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                <span className="text-white">Free returns</span>
              </li>
            </ul>
            <button className="w-full py-4 bg-[#D4A574] text-[#3D2817] font-bold rounded-xl hover:bg-white transition-colors">
              Join Gold
            </button>
          </div>

          {/* Diamond Tier */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#3D2817] mb-2 font-['Playfair_Display']">
                Diamond
              </h3>
              <p className="text-gray-500 mb-4">Ultimate luxury</p>
              <div className="text-3xl font-bold text-[#3D2817]">
                $24.99
                <span className="text-lg text-gray-500 font-normal">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Earn 3 points per $1 spent</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Birthday gift (2000 points)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Free EXPRESS shipping on ALL orders</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Early access to sales (48h)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Dedicated personal stylist</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Check className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                <span>Annual exclusive member gift</span>
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-[#8B5A3C] text-[#8B5A3C] font-bold rounded-xl hover:bg-[#FAF6F0] transition-colors">
              Explore Diamond
            </button>
          </div>
        </div>

        {/* How Points Work */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-[#3D2817] mb-8 text-center font-['Playfair_Display']">
            How Points Work
          </h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-3xl mx-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-gray-200">
                  <th className="p-6 font-bold text-[#3D2817]">Action</th>
                  <th className="p-6 font-bold text-[#3D2817] text-right">
                    Points Earned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 text-gray-600">Every $1 spent</td>
                  <td className="p-6 font-bold text-[#8B5A3C] text-right">
                    1-3 Points
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 text-gray-600">Write a product review</td>
                  <td className="p-6 font-bold text-[#8B5A3C] text-right">
                    50 Points
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 text-gray-600">
                    Refer a friend (when they purchase)
                  </td>
                  <td className="p-6 font-bold text-[#8B5A3C] text-right">
                    500 Points
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 text-gray-600">Celebrate your birthday</td>
                  <td className="p-6 font-bold text-[#8B5A3C] text-right">
                    500-2000 Points
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 text-gray-600">Follow us on Instagram</td>
                  <td className="p-6 font-bold text-[#8B5A3C] text-right">
                    25 Points
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 text-gray-600">Complete your profile</td>
                  <td className="p-6 font-bold text-[#8B5A3C] text-right">
                    100 Points
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="bg-[#FAF6F0] p-6 text-center border-t border-gray-200">
              <p className="font-bold text-[#3D2817]">
                Redemption: 100 points = $1 off your next purchase
              </p>
            </div>
          </div>
        </div>

        {/* Member Benefits Highlights */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-[#3D2817] mb-12 text-center font-['Playfair_Display']">
            Member Benefits Highlights
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3">
                Exclusive Rewards
              </h3>
              <p className="text-gray-600 text-sm">
                Turn your purchases into points and redeem them for discounts on
                future orders.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3">
                Birthday Surprises
              </h3>
              <p className="text-gray-600 text-sm">
                Celebrate your special day with bonus points deposited directly
                into your account.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3">
                Shipping Perks
              </h3>
              <p className="text-gray-600 text-sm">
                Enjoy free standard or express shipping depending on your
                membership tier.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3">
                Early Access
              </h3>
              <p className="text-gray-600 text-sm">
                Shop our new collections and seasonal sales before anyone else.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3">
                Hassle-Free Returns
              </h3>
              <p className="text-gray-600 text-sm">
                Gold and Diamond members enjoy complimentary return shipping on
                all orders.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3">
                Personal Styling
              </h3>
              <p className="text-gray-600 text-sm">
                Diamond members get one-on-one sessions with our expert
                stylists.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-[#3D2817] mb-8 text-center font-['Playfair_Display']">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group bg-white rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer">
                <h3 className="font-bold text-[#3D2817]">
                  Can I cancel my paid membership at any time?
                </h3>
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                Yes, you can cancel your Gold or Diamond membership at any time
                from your account dashboard. Your benefits will continue until
                the end of your current billing cycle, after which you will be
                downgraded to the free Silver tier.
              </div>
            </details>
            <details className="group bg-white rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer">
                <h3 className="font-bold text-[#3D2817]">
                  Do my points expire?
                </h3>
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                Points expire after 12 months of account inactivity. As long as
                you make a purchase or earn points through other actions within
                a 12-month period, your entire points balance will remain
                active.
              </div>
            </details>
            <details className="group bg-white rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer">
                <h3 className="font-bold text-[#3D2817]">
                  How do I upgrade my tier?
                </h3>
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                You can upgrade from Silver to Gold or Diamond at any time by
                visiting your account settings and selecting a new subscription
                plan. The new benefits will be applied to your account
                immediately.
              </div>
            </details>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#8B5A3C] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-8 font-['Playfair_Display']">
            Ready to join?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-[#D4A574] text-[#3D2817] font-bold rounded-xl hover:bg-white transition-colors">
              Join Gold
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#8B5A3C] transition-colors">
              Explore Diamond
            </button>
          </div>
        </div>
      </div>
    </div>);

}