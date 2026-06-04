"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  TrendingUp,
  Users,
  Edit3,
  Tag,
  CreditCard,
  MapPin,
  Share2,
  X } from
'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
const PRODUCT_GALLERIES: Record<string, string[]> = {
  '1': [ // Classic Gold Band Ring
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop'
  ],
  '2': [ // Diamond Stud Earrings
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'
  ],
  '3': [ // Cashmere Turtleneck Sweater
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop'
  ],
  '4': [ // Pearl Strand Necklace
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=600&h=600&fit=crop'
  ],
  '5': [ // Cable Knit Cardigan
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'
  ]
};

const getGallery = (product: any): string[] => {
  const custom = PRODUCT_GALLERIES[product.id];
  if (custom) return custom;
  const isJewelry = product.category === 'jewelry';
  const defaults = isJewelry ? [
    product.image,
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop'
  ] : [
    product.image,
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop'
  ];
  return defaults;
};

export function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({
    x: 50,
    y: 50
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Coupons & Bank Offers toggles & copy actions
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [isBankOffersOpen, setIsBankOffersOpen] = useState(false);
  const [copiedBankOffer, setCopiedBankOffer] = useState<string | null>(null);

  // Delivery checker and pincode states
  const [pincode, setPincode] = useState("500100");
  const [isEditingPincode, setIsEditingPincode] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("500100");
  const [deliveryEstimate, setDeliveryEstimate] = useState("Today 6:47 PM");

  // Dynamic session customer reviews state
  const [localReviews, setLocalReviews] = useState([
    {
      author: 'Anonymous',
      date: 'Posted on Apr 15, 2024',
      rating: 5,
      comment: 'Quality is so good. Highly recommend it!'
    },
    {
      author: 'Sarah M.',
      date: 'Posted on Apr 08, 2024',
      rating: 5,
      comment: 'Beautiful piece, exactly as described.'
    }
  ]);

  // Write a Review modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");

  // Dynamically computed rating summaries
  const initialReviewsCount = Number(product.reviews) || 234;
  const currentReviewsCount = initialReviewsCount + (localReviews.length - 2);
  const initialSum = (Number(product.rating) || 4.8) * initialReviewsCount;
  const newRatingsSum = localReviews.slice(0, localReviews.length - 2).reduce((acc, r) => acc + r.rating, 0);
  const currentAverageRating = ((initialSum + newRatingsSum) / currentReviewsCount).toFixed(1);

  const imgWrapRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgWrapRef.current) return;
    const rect = imgWrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setZoomPos({
      x,
      y
    });
  };

  const scrollThumbnails = (direction: 'up' | 'down') => {
    if (!thumbnailContainerRef.current) return;
    const container = thumbnailContainerRef.current;
    const scrollAmount = 88;
    container.scrollBy({
      top: direction === 'up' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const isJewelry = product.category === 'jewelry';
  const sizes = isJewelry ?
  ['5', '6', '7', '8', '9'] :
  ['XS', 'S', 'M', 'L', 'XL'];
  const faqs = [
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return policy for all unworn items in their original packaging.'
  },
  {
    q: 'How do I care for this item?',
    a: isJewelry ?
    'Clean with a soft cloth and mild soap. Avoid harsh chemicals.' :
    'Hand wash cold, lay flat to dry. Do not bleach.'
  },
  {
    q: 'Is this item authentic?',
    a: 'Yes, all our products are 100% authentic and come with a certificate of authenticity.'
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, we ship worldwide. Shipping costs are calculated at checkout.'
  }];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const gallery = getGallery(product);

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Trend Row */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <nav className="flex text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-[#8B5A3C]">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/" className="hover:text-[#8B5A3C] capitalize">
              {product.category}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-[#3D2817] font-medium truncate">
              {product.name}
            </span>
          </nav>
          <div className="flex items-center gap-2 text-[#8B5A3C] text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            427 people bought in last 7 days
          </div>
        </div>

        {/* Main 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8 mb-12 relative">
          {/* LEFT COLUMN: Images (col-span-5) */}
          <div className="lg:col-span-5 flex gap-4 h-fit">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-2 w-20 shrink-0 select-none">
              <button 
                onClick={() => scrollThumbnails('up')}
                className="w-full h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-[#8B5A3C] hover:border-[#8B5A3C] transition-all shrink-0 shadow-sm"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              
              <div 
                ref={thumbnailContainerRef}
                className="flex flex-col gap-2 max-h-[360px] overflow-y-auto scrollbar-none snap-y py-1 px-0.5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {gallery.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveImageIdx(i);
                    }}
                    className={`aspect-square bg-white rounded-xl border-2 snap-start shrink-0 overflow-hidden cursor-pointer transition-all duration-200 ${
                      activeImageIdx === i 
                        ? 'border-[#8B5A3C] shadow-md scale-95' 
                        : 'border-gray-200 hover:border-[#8B5A3C]/60 hover:scale-95'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      className="w-full h-full object-cover pointer-events-none"
                      alt={`${product.name} thumbnail ${i + 1}`} 
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => scrollThumbnails('down')}
                className="w-full h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-[#8B5A3C] hover:border-[#8B5A3C] transition-all shrink-0 shadow-sm"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            {/* Main Image Area */}
            <div className="flex-1 min-w-0">
              <div
                ref={imgWrapRef}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden cursor-zoom-in relative">
                
                  <img
                  src={gallery[activeImageIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-150 ease-out"
                  style={{
                    transform: isZooming ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                  }} />
                
                  {isZooming &&
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none">
                      Hover to zoom
                    </div>
                }
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Product Info (col-span-4) */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#7A8B68] text-white px-2 py-0.5 rounded text-sm font-bold animate-in fade-in duration-200">
                  {currentAverageRating} <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" /> {currentReviewsCount} Ratings
                </span>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="text-[#8B5A3C] text-sm font-medium flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-4 h-4" /> Write a Review
              </button>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4">
              <h1
                className="text-2xl font-bold text-[#3D2817]"
                style={{
                  fontFamily: 'Playfair Display, serif'
                }}>
                {product.name}
              </h1>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="w-11 h-11 shrink-0 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-[#8B5A3C] transition-all shadow-sm"
                title="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="inline-block bg-[#8B5A3C]/10 text-[#8B5A3C] px-3 py-1 rounded-md text-xs font-bold mb-6">
              Buy 1 Get 1
            </div>

            <div className="space-y-5 text-sm border-t border-gray-100 pt-5">
              <div>
                <h3 className="font-bold text-[#3D2817] mb-1">
                  Manufacturer/Brand
                </h3>
                <p className="text-[#8B5A3C] hover:underline cursor-pointer font-medium">
                  Lumière Atelier
                </p>
              </div>
              <div>
                <h3 className="font-bold text-[#3D2817] mb-1">Material</h3>
                <p className="text-gray-600">
                  {isJewelry ? '18k Solid Gold' : '100% Mongolian Cashmere'}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-[#3D2817] mb-1">Care</h3>
                <p className="text-gray-600">
                  {isJewelry ?
                  'Professional clean recommended' :
                  'Hand wash cold, lay flat to dry'}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-[#3D2817] mb-1">Return Policy</h3>
                <p className="text-[#8B5A3C] hover:underline cursor-pointer font-medium">
                  Easy 30-day returns
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Pricing Rail (lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-4) */}
          <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4 shadow-sm">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-[#3D2817]">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  MRP ${product.mrp}
                </span>
                <span className="text-[#7A8B68] font-bold text-sm">
                  {product.discount}% off
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Inclusive of all taxes
              </p>

              <div className="flex items-center justify-between text-sm mb-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">Get</span>
                  <span className="text-[#8B5A3C] font-bold flex items-center gap-1">
                    <Truck className="w-4 h-4" /> FREE delivery
                  </span>
                </div>
                <button className="text-[#8B5A3C] font-medium hover:underline text-xs">
                  Join Circle
                </button>
              </div>

              <div className="space-y-2 mb-5">
                <div 
                  onClick={() => setIsCouponsOpen(!isCouponsOpen)}
                  className="border border-[#7A8B68]/30 bg-[#7A8B68]/5 rounded-lg p-3 cursor-pointer hover:bg-[#7A8B68]/10 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#7A8B68]" />
                      <span className="text-sm font-medium text-[#3D2817]">
                        Get Extra 12% Off with Coupons
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCouponsOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isCouponsOpen && (
                    <div className="mt-2 pl-6 pr-2 pb-1 space-y-2 border-t border-[#7A8B68]/20 pt-2 text-xs animate-in slide-in-from-top-1 duration-200">
                      <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                        <div>
                          <p className="font-bold text-gray-800">LUMIERE12</p>
                          <p className="text-gray-500 text-[10px]">Get extra 12% off on orders above $150</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText("LUMIERE12");
                            setCopiedCoupon("LUMIERE12");
                            setTimeout(() => setCopiedCoupon(null), 1500);
                          }}
                          className="text-[#8B5A3C] hover:text-[#6F4630] font-bold uppercase text-[10px] px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copiedCoupon === "LUMIERE12" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  onClick={() => setIsBankOffersOpen(!isBankOffersOpen)}
                  className="border border-[#8B5A3C]/30 bg-[#8B5A3C]/5 rounded-lg p-3 cursor-pointer hover:bg-[#8B5A3C]/10 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#8B5A3C]" />
                      <span className="text-sm font-medium text-[#3D2817]">
                        Extra 10% Off with Bank Offers
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isBankOffersOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isBankOffersOpen && (
                    <div className="mt-2 pl-6 pr-2 pb-1 space-y-2 border-t border-[#8B5A3C]/20 pt-2 text-xs animate-in slide-in-from-top-1 duration-200">
                      <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                        <div>
                          <p className="font-bold text-gray-800">HDFC10</p>
                          <p className="text-gray-500 text-[10px]">10% instant discount on HDFC credit card EMI</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText("HDFC10");
                            setCopiedBankOffer("HDFC10");
                            setTimeout(() => setCopiedBankOffer(null), 1500);
                          }}
                          className="text-[#8B5A3C] hover:text-[#6F4630] font-bold uppercase text-[10px] px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copiedBankOffer === "HDFC10" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 mb-3 flex justify-between items-center min-h-[48px]">
                {isEditingPincode ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (/^\d{6}$/.test(pincodeInput)) {
                        setPincode(pincodeInput);
                        setIsEditingPincode(false);
                        const randomDay = Number(pincodeInput) % 2 === 0 ? "Today 6:47 PM" : "Tomorrow 11:30 AM";
                        setDeliveryEstimate(randomDay);
                      } else {
                        alert("Please enter a valid 6-digit pincode.");
                      }
                    }}
                    className="w-full flex items-center gap-2"
                  >
                    <input 
                      type="text" 
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter Pincode"
                      className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none focus:border-[#8B5A3C]"
                      autoFocus
                    />
                    <button type="submit" className="bg-[#8B5A3C] text-white px-2 py-0.5 rounded text-[10px] font-bold hover:bg-[#6F4630]">
                      Apply
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setPincodeInput(pincode);
                        setIsEditingPincode(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-[#3D2817] pincode-display">{pincode}</span>
                    </div>
                    <button 
                      onClick={() => setIsEditingPincode(true)}
                      className="text-[#8B5A3C] text-sm font-medium hover:underline change-pincode-btn"
                    >
                      Change
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 mb-5 pl-1">
                <span className="uppercase font-semibold text-gray-400 text-[10px] tracking-wider">
                  Delivery By
                </span>
                <span className="font-bold text-[#3D2817] delivery-estimate-display">{deliveryEstimate}</span>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium text-[#3D2817] focus:outline-none focus:border-[#8B5A3C] appearance-none bg-white cursor-pointer">
                    
                    {sizes.map((s) =>
                    <option key={s} value={s}>
                        1 Pack · Size {s}
                      </option>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between border border-gray-200 rounded-lg h-12 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C]">
                    
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-[#3D2817]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#8B5A3C]">
                    
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button className="w-full bg-[#8B5A3C] text-white py-3.5 rounded-xl font-bold hover:bg-[#6F4630] transition-colors shadow-md shadow-[#8B5A3C]/20">
                Add to Cart
              </button>
            </div>
          </div>

          {/* Trust Badges Strip (lg:col-span-9 lg:col-start-1) */}
          <div className="lg:col-span-9 lg:col-start-1 grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200 bg-white rounded-xl px-6">
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#8B5A3C]" />
            </div>
            <span className="text-xs font-bold text-[#3D2817]">
              Free Shipping
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-[#8B5A3C]" />
            </div>
            <span className="text-xs font-bold text-[#3D2817]">
              Easy Returns
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-[#8B5A3C]" />
            </div>
            <span className="text-xs font-bold text-[#3D2817]">
              100% Authentic
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 bg-[#FAF6F0] rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#8B5A3C]" />
            </div>
            <span className="text-xs font-bold text-[#3D2817]">
              Secure Payment
            </span>
          </div>
        </div>

        {/* Anchor Link Tab Bar (lg:col-span-9 lg:col-start-1) */}
        <div className="lg:col-span-9 lg:col-start-1 sticky top-0 bg-[#FAF6F0] z-30 border-y border-gray-200 py-3 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <button
            onClick={() => scrollToSection('key-details')}
            className="hover:text-[#8B5A3C] transition-colors">
            
            Key Details
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => scrollToSection('description')}
            className="hover:text-[#8B5A3C] transition-colors">
            
            Product Information
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => scrollToSection('specs')}
            className="hover:text-[#8B5A3C] transition-colors">
            
            Care & Use
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => scrollToSection('specs')}
            className="hover:text-[#8B5A3C] transition-colors">
            
            Material Benefits
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => scrollToSection('faqs')}
            className="hover:text-[#8B5A3C] transition-colors">
            
            FAQs
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => scrollToSection('reviews')}
            className="hover:text-[#8B5A3C] transition-colors">
            
            Customers Also Bought
          </button>
        </div>

        {/* Content Sections (lg:col-span-9 lg:col-start-1) */}
        <div className="lg:col-span-9 lg:col-start-1 bg-white rounded-2xl p-8 border border-gray-200">
          {/* Key Details Section */}
          <div id="key-details" className="mb-10">
            <h3
              className="text-xl font-bold text-[#3D2817] mb-4"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              Key Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Manufacturer/Brand
                </span>
                <span className="w-2/3 text-sm text-[#8B5A3C] hover:underline cursor-pointer font-medium">
                  Lumière Atelier
                </span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Material
                </span>
                <span className="w-2/3 text-sm text-gray-600">
                  {isJewelry ? '18k Solid Gold' : '100% Mongolian Cashmere'}
                </span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Care
                </span>
                <span className="w-2/3 text-sm text-gray-600">
                  {isJewelry ? 'Professional clean recommended' : 'Hand wash cold, lay flat to dry'}
                </span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Return Policy
                </span>
                <span className="w-2/3 text-sm text-[#8B5A3C] hover:underline cursor-pointer font-medium">
                  Easy 30-day returns
                </span>
              </div>
            </div>
          </div>

          <div id="description" className="mb-10">
            <h3
              className="text-xl font-bold text-[#3D2817] mb-4"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Product Description
            </h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed max-w-4xl">
              Experience unparalleled elegance with this exquisite piece from
              our latest collection. Meticulously crafted to perfection, it
              seamlessly blends classic design with modern sensibility. Whether
              you're dressing up for a special occasion or adding a touch of
              sophistication to your everyday look, this versatile item is sure
              to become a cherished favorite.
            </p>

            <h4 className="font-semibold text-[#3D2817] mb-3">Key Features</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-[#8B5A3C] shrink-0 mt-0.5" />
                Premium quality materials sourced responsibly
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-[#8B5A3C] shrink-0 mt-0.5" />
                Expert craftsmanship with attention to detail
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-[#8B5A3C] shrink-0 mt-0.5" />
                Timeless design that transcends seasonal trends
              </li>
            </ul>
          </div>

          <div id="specs" className="mb-10 border-t border-gray-100 pt-10">
            <h3
              className="text-xl font-bold text-[#3D2817] mb-4"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Material
                </span>
                <span className="w-2/3 text-sm text-[#3D2817]">
                  {isJewelry ? '18k Solid Gold' : '100% Cashmere'}
                </span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Weight
                </span>
                <span className="w-2/3 text-sm text-[#3D2817]">
                  {isJewelry ? '4.2g' : '320g'}
                </span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Origin
                </span>
                <span className="w-2/3 text-sm text-[#3D2817]">
                  Made in Italy
                </span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm font-medium text-gray-500">
                  Warranty
                </span>
                <span className="w-2/3 text-sm text-[#3D2817]">
                  1 Year Limited
                </span>
              </div>
            </div>
          </div>

          <div id="faqs" className="mb-10 border-t border-gray-100 pt-10">
            <h3
              className="text-xl font-bold text-[#3D2817] mb-4"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Frequently Asked Questions
            </h3>
            <div className="space-y-3 max-w-4xl">
              {faqs.map((faq, index) =>
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden">
                
                  <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
                  
                    <span className="font-medium text-[#3D2817] text-sm">
                      {faq.q}
                    </span>
                    {openFaq === index ?
                  <ChevronUp className="w-4 h-4 text-gray-500" /> :

                  <ChevronDown className="w-4 h-4 text-gray-500" />
                  }
                  </button>
                  {openFaq === index &&
                <div className="p-4 bg-[#FAF6F0] border-t border-gray-200 text-sm text-gray-600">
                      {faq.a}
                    </div>
                }
                </div>
              )}
            </div>
          </div>

          <div id="reviews" className="border-t border-gray-100 pt-10">
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl font-bold text-[#3D2817]"
                style={{
                  fontFamily: 'Playfair Display, serif'
                }}>
                Customer Reviews
              </h3>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="text-[#8B5A3C] font-medium text-sm flex items-center gap-1 hover:underline write-review-btn"
              >
                <Edit3 className="w-4 h-4" /> Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-4xl">
              <div className="col-span-1 border-r border-gray-100 pr-8 text-center flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-[#3D2817] mb-2">
                  {currentAverageRating}
                </div>
                <div className="flex text-[#D4A574] mb-2 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.round(Number(currentAverageRating)) ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {currentReviewsCount} Ratings
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  // Approximate dynamic percentage calculation
                  const count = localReviews.filter(r => r.rating === star).length;
                  const pct = Math.round((count / localReviews.length) * 100);
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-3 font-medium text-gray-600">
                        {star}
                      </span>
                      <Star className="w-3 h-3 text-gray-400 fill-current" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4A574]"
                          style={{
                            width: `${pct}%`
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-gray-500 text-xs">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              {localReviews.map((r, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#8B5A3C] font-bold text-xs">
                        {r.author ? r.author.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#3D2817]">
                          {r.author}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {r.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#7A8B68] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                      {r.rating} <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Rows */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-[#3D2817]"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Frequently Bought Together
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p) =>
            <ProductCard key={`alt-${p.id}`} product={p} />
            )}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-[#3D2817]"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              Alternative Products
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {products.slice(4, 8).map((p) =>
            <ProductCard key={`bought-${p.id}`} product={p} />
            )}
          </div>
        </div>
      </div>

      {/* Share Modal Dialog Overlay */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          {/* Backdrop Dismiss click */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsShareModalOpen(false)}
          />
          
          <div className="bg-white rounded-2xl w-[440px] max-w-full shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Share</h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Channels Grid Container */}
            <div className="p-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex flex-col items-center gap-2 group focus:outline-none"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold tracking-tight text-center truncate w-full group-hover:text-gray-900">
                    {copied ? "Copied!" : "Copy Link"}
                  </span>
                </button>

                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out this product: " + product.name + " - " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
                    <svg className="w-6.5 h-6.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.905-6.989-1.873-1.873-4.36-2.903-6.977-2.903-5.44 0-9.866 4.418-9.869 9.862-.001 1.77.462 3.5 1.341 5.024l-.993 3.627 3.715-.973zm8.384-5.993c-.3-.15-1.771-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.777.975-.951 1.174-.175.2-.35.225-.65.075-1.041-.519-1.714-.952-2.385-2.102-.18-.31-.18-.507-.03-.657.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C8.908 9.176 8.358 7.8 8.133 7.25c-.218-.527-.44-.456-.6-.464-.15-.008-.325-.01-.5-.01s-.45.067-.686.325c-.236.258-.9 1.05-1.1 2.2s.836 2.25.95 2.4c.114.15 1.647 2.516 3.99 3.53 1.86.8 2.54.88 3.425.75.525-.08 1.77-.72 2.02-1.41.25-.69.25-1.29.175-1.41-.075-.12-.275-.195-.575-.345z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold tracking-tight text-center truncate w-full group-hover:text-gray-900">
                    Whatsapp
                  </span>
                </a>

                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold tracking-tight text-center truncate w-full group-hover:text-gray-900">
                    Facebook
                  </span>
                </a>

                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check this out: " + product.name)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold tracking-tight text-center truncate w-full group-hover:text-gray-900">
                    X
                  </span>
                </a>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-4">
                <a 
                  href={`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent("Check out this product: " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold tracking-tight text-center truncate w-full group-hover:text-gray-900">
                    Email
                  </span>
                </a>

                <a 
                  href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm5.894-17.76c.16.86-.29 3.44-.82 6.06-.23 1.13-.5 2.27-.72 3.01-.22.75-.41.9-.62.92-.45.04-.79-.29-1.22-.58-.68-.45-1.07-.73-1.73-1.18-.76-.52-.27-.81.17-1.26.11-.12 2.09-1.92 2.13-2.1.01-.02.01-.1-.04-.15-.05-.05-.13-.03-.18-.02-.08.02-1.29.82-3.63 2.4-.34.24-.65.35-.93.34-.31 0-.91-.17-1.35-.32-.55-.18-1-.28-.96-.59.02-.16.25-.33.68-.51 2.68-1.17 4.47-1.94 5.37-2.32 2.56-1.07 3.09-1.25 3.44-1.26.08 0 .25.02.36.11.09.08.12.19.13.27z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold tracking-tight text-center truncate w-full group-hover:text-gray-900">
                    Telegram
                  </span>
                </a>

                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shadow-sm">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56V14.9c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93v5.64h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold tracking-tight text-center truncate w-full group-hover:text-gray-900">
                    Linkedin
                  </span>
                </a>
              </div>
            </div>
            
            {/* Copied Toast Banner */}
            {copied && (
              <div className="absolute top-[72px] left-1/2 -translate-x-1/2 bg-[#7A8B68] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md animate-in slide-in-from-top-3 duration-200">
                Link copied to clipboard!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Write a Review Modal Dialog */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsReviewModalOpen(false)}
          />
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const today = new Date();
              const formattedDate = today.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              });
              setLocalReviews([
                {
                  author: newReviewAuthor || "Anonymous User",
                  date: `Posted on ${formattedDate}`,
                  rating: newReviewRating,
                  comment: newReviewComment || "Great product, really liked the design and material quality."
                },
                ...localReviews
              ]);
              // Reset and close
              setNewReviewAuthor("");
              setNewReviewComment("");
              setNewReviewRating(5);
              setIsReviewModalOpen(false);
            }}
            className="bg-white rounded-2xl w-[480px] max-w-full shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
              <button 
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form Fields Container */}
            <div className="p-6 space-y-4">
              {/* Star selector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1.5 text-[#D4A574] star-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`focus:outline-none hover:scale-110 active:scale-95 transition-transform star-btn-${star}`}
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= newReviewRating ? 'fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Author name input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input 
                  type="text" 
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5A3C] transition-colors name-input"
                  required
                />
              </div>

              {/* Comment text area */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Review Details
                </label>
                <textarea 
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Write your review comments here..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5A3C] transition-colors resize-none comment-input"
                  required
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors close-modal-btn"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 text-sm font-bold text-white bg-[#8B5A3C] hover:bg-[#6F4630] rounded-xl transition-colors shadow-sm submit-review-btn"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}