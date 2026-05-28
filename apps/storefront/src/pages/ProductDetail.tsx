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
  ImageIcon } from
'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
export function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [viewMode, setViewMode] = useState<'image' | '360'>('image');
  const [rotation, setRotation] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({
    x: 50,
    y: 50
  });
  const imgWrapRef = useRef<HTMLDivElement>(null);
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

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 relative">
          {/* LEFT COLUMN: Images (col-span-5) */}
          <div className="lg:col-span-5 flex gap-4 h-fit">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-2 w-20 shrink-0">
              <button className="w-full h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
                <ChevronUp className="w-5 h-5" />
              </button>
              {[1, 2, 3, 4].map((i) =>
              <div
                key={i}
                className={`aspect-square bg-white rounded border ${i === 1 ? 'border-[#8B5A3C]' : 'border-gray-200'} overflow-hidden cursor-pointer hover:border-[#8B5A3C] transition-colors`}>
                
                  <img
                  src={product.image}
                  className="w-full h-full object-cover"
                  alt={`${product.name} thumbnail ${i}`} />
                
                </div>
              )}
              <button className="w-full h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-500">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            {/* Main Image Area */}
            <div className="flex-1 min-w-0">
              {/* View Mode Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setViewMode('image')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${viewMode === 'image' ? 'bg-[#8B5A3C] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8B5A3C]'}`}>
                  
                  <ImageIcon className="w-3.5 h-3.5" />
                  Image
                </button>
                <button
                  onClick={() => setViewMode('360')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${viewMode === '360' ? 'bg-[#8B5A3C] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#8B5A3C]'}`}>
                  
                  <div className="w-3.5 h-3.5" />
                  360° View
                </button>
              </div>

              {viewMode === 'image' ?
              <div
                ref={imgWrapRef}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden cursor-zoom-in relative">
                
                  <img
                  src={product.image}
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
                </div> :

              <div className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden relative flex items-center justify-center">
                  <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{
                    transform: `rotate(${rotation * 0.5}deg)`
                  }} />
                
                  <div className="absolute top-3 right-3 bg-[#8B5A3C] text-white rounded-full p-2 shadow-lg pointer-events-none">
                    <div className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-[#D4A574]" />
                  
                    <p className="text-white text-xs font-medium text-center mt-1">
                      Drag to rotate
                    </p>
                  </div>
                </div>
              }
            </div>
          </div>

          {/* MIDDLE COLUMN: Product Info (col-span-4) */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#7A8B68] text-white px-2 py-0.5 rounded text-sm font-bold">
                  {product.rating} <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" /> {product.reviews}
                </span>
              </div>
              <button className="text-[#8B5A3C] text-sm font-medium flex items-center gap-1 hover:underline">
                <Edit3 className="w-4 h-4" /> Write a Review
              </button>
            </div>

            <h1
              className="text-2xl font-bold text-[#3D2817] mb-4"
              style={{
                fontFamily: 'Playfair Display, serif'
              }}>
              
              {product.name}
            </h1>

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

          {/* RIGHT COLUMN: Sticky Pricing Rail (col-span-3) */}
          <div className="lg:col-span-3">
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
                <div className="border border-[#7A8B68]/30 bg-[#7A8B68]/5 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-[#7A8B68]/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#7A8B68]" />
                    <span className="text-sm font-medium text-[#3D2817]">
                      Get Extra 12% Off with Coupons
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                <div className="border border-[#8B5A3C]/30 bg-[#8B5A3C]/5 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-[#8B5A3C]/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#8B5A3C]" />
                    <span className="text-sm font-medium text-[#3D2817]">
                      Extra 10% Off with Bank Offers
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 mb-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-[#3D2817]">500100</span>
                </div>
                <button className="text-[#8B5A3C] text-sm font-medium hover:underline">
                  Change
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 mb-5 pl-1">
                <span className="uppercase font-semibold text-gray-400 text-[10px] tracking-wider">
                  Delivery By
                </span>
                <span className="font-bold text-[#3D2817]">Today 6:47 PM</span>
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
        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200 mb-12 bg-white rounded-xl px-6">
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

        {/* Anchor Link Tab Bar */}
        <div className="sticky top-0 bg-[#FAF6F0] z-30 border-y border-gray-200 py-3 mb-8 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <button
            onClick={() => scrollToSection('description')}
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

        {/* Content Sections */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-12">
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
              <button className="text-[#8B5A3C] font-medium text-sm flex items-center gap-1 hover:underline">
                <Edit3 className="w-4 h-4" /> Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-4xl">
              <div className="col-span-1 border-r border-gray-100 pr-8 text-center flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-[#3D2817] mb-2">
                  {product.rating}
                </div>
                <div className="flex text-[#D4A574] mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="text-sm text-gray-500">
                  {product.reviews} Ratings
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                {[5, 4, 3, 2, 1].map((star) =>
                <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-3 font-medium text-gray-600">
                      {star}
                    </span>
                    <Star className="w-3 h-3 text-gray-400 fill-current" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                      className="h-full bg-[#D4A574]"
                      style={{
                        width:
                        star === 5 ?
                        '78%' :
                        star === 4 ?
                        '15%' :
                        star === 3 ?
                        '5%' :
                        '1%'
                      }}>
                    </div>
                    </div>
                    <span className="w-10 text-right text-gray-500 text-xs">
                      {star === 5 ?
                    '78%' :
                    star === 4 ?
                    '15%' :
                    star === 3 ?
                    '5%' :
                    '1%'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#8B5A3C] font-bold text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#3D2817]">
                        Anonymous
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Posted on Apr 15, 2024
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#7A8B68] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    5 <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Quality is so good. Highly recommend it!
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#8B5A3C] font-bold text-xs">
                      S
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#3D2817]">
                        Sarah M.
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Posted on Apr 08, 2024
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#7A8B68] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    5 <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Beautiful piece, exactly as described.
                </p>
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
    </div>);

}