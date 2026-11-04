import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, User, Shield, Ruler } from 'lucide-react';

interface PromoCardsProps {
  card1Title?: string;
  card1Subtitle?: string;
  card1Link?: string;
  card1Badge?: string;
  card1Bg?: string;
  card2Title?: string;
  card2Subtitle?: string;
  card2Link?: string;
  card2Badge?: string;
  card2Bg?: string;
  card3Title?: string;
  card3Subtitle?: string;
  card3Link?: string;
  card3Badge?: string;
  card3Bg?: string;
  card4Title?: string;
  card4Subtitle?: string;
  card4Link?: string;
  card4Badge?: string;
  card4Bg?: string;
}

export function PromoCards(props: PromoCardsProps) {
  const promos = [
    {
      icon: Sparkles,
      title: props.card1Title || 'Fast Express Delivery',
      subtitle: props.card1Subtitle || 'ON ALL ORDERS',
      link: props.card1Link || '/products',
      bg: props.card1Bg || 'bg-[#EFF6FF]',
      textColor: 'text-blue-700',
      badge: props.card1Badge
    },
    {
      icon: User,
      title: props.card2Title || 'Customer Support 24/7',
      subtitle: props.card2Subtitle || 'EXPERT HELP',
      link: props.card2Link || '/about',
      bg: props.card2Bg || 'bg-[#F0FDF4]',
      textColor: 'text-emerald-700',
      badge: props.card2Badge
    },
    {
      icon: Shield,
      title: props.card3Title || 'Quality Guarantee',
      subtitle: props.card3Subtitle || 'CERTIFIED GENUINE',
      link: props.card3Link || '/products',
      bg: props.card3Bg || 'bg-[#FEF3C7]',
      textColor: 'text-amber-800',
      badge: props.card3Badge || 'Verified'
    },
    {
      icon: Ruler,
      title: props.card4Title || 'Easy 30-Day Returns',
      subtitle: props.card4Subtitle || 'HASSLE FREE',
      link: props.card4Link || '/about',
      bg: props.card4Bg || 'bg-[#F1F5F9]',
      textColor: 'text-slate-700',
      badge: props.card4Badge
    }
  ];

  return (
    <div className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promos.map((promo, index) => (
            <Link
              key={index}
              href={promo.link}
              className={`${promo.bg} rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md hover:border-[#8B5A3C] transition-all group`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <promo.icon className={`w-5 h-5 ${promo.textColor}`} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#3D2817] text-sm flex items-center gap-2">
                    {promo.title}
                    {promo.badge && (
                      <span className="px-1.5 py-0.5 bg-[#D4A574] text-[#3D2817] font-bold text-[10px] rounded">
                        {promo.badge}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-bold ${promo.textColor}`}>
                    {promo.subtitle}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#8B5A3C] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}