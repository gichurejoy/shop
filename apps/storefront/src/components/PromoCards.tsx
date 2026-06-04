import React from 'react';
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
    title: props.card1Title || 'Get 20%* off on Jewelry',
    subtitle: props.card1Subtitle || 'SHOP NOW',
    bg: props.card1Bg || 'bg-[#E8F0E5]',
    textColor: 'text-[#8B5A3C]',
    badge: props.card1Badge
  },
  {
    icon: User,
    title: props.card2Title || 'Personal Stylist',
    subtitle: props.card2Subtitle || 'BOOK NOW',
    bg: props.card2Bg || 'bg-[#EDE7F3]',
    textColor: 'text-[#8B5A3C]',
    badge: props.card2Badge
  },
  {
    icon: Shield,
    title: props.card3Title || 'Care Plan',
    subtitle: props.card3Subtitle || 'EXPLORE PLANS',
    bg: props.card3Bg || 'bg-[#FCEFE3]',
    textColor: 'text-[#8B5A3C]',
    badge: props.card3Badge || 'New'
  },
  {
    icon: Ruler,
    title: props.card4Title || 'Free Sizing',
    subtitle: props.card4Subtitle || 'AT HOME',
    bg: props.card4Bg || 'bg-[#F8E6E6]',
    textColor: 'text-[#8B5A3C]',
    badge: props.card4Badge
  }];

  return (
    <div className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promos.map((promo, index) =>
          <button
            key={index}
            className={`${promo.bg} rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md hover:border-[#8B5A3C] transition-all group`}>
            
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center">
                  <promo.icon className={`w-5 h-5 ${promo.textColor}`} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#3D2817] text-sm flex items-center gap-2">
                    {promo.title}
                    {promo.badge &&
                  <span className="px-1.5 py-0.5 bg-[#D4A574] text-[#3D2817] font-bold text-[10px] rounded">
                        {promo.badge}
                      </span>
                  }
                  </div>
                  <div className={`text-xs font-bold ${promo.textColor}`}>
                    {promo.subtitle}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#8B5A3C] transition-colors" />
            </button>
          )}
        </div>
      </div>
    </div>);

}