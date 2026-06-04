"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Bell } from
'lucide-react';
export function OrderTracking() {
  const { orderId: urlOrderId } = useParams();
  const navigate = useRouter();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showTracking, setShowTracking] = useState(!!urlOrderId);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const orderId = urlOrderId || 'LK-2024-12345';
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderIdInput && emailInput) {
      navigate(`/tracking/${orderIdInput}`);
      setShowTracking(true);
    }
  };
  const trackingStages = [
  {
    id: 1,
    label: 'Order Placed',
    completed: true,
    date: 'Dec 8, 2024 10:30 AM',
    description: 'Your order has been received and confirmed'
  },
  {
    id: 2,
    label: 'Confirmed',
    completed: true,
    date: 'Dec 8, 2024 11:15 AM',
    description: 'Payment verified and order confirmed'
  },
  {
    id: 3,
    label: 'Packed',
    completed: true,
    date: 'Dec 9, 2024 2:45 PM',
    description: 'Your items have been carefully packed'
  },
  {
    id: 4,
    label: 'Shipped',
    completed: false,
    current: true,
    date: 'Dec 10, 2024 9:20 AM',
    description: 'Package is on its way to you'
  },
  {
    id: 5,
    label: 'Delivered',
    completed: false,
    date: 'Expected: Dec 12, 2024',
    description: 'Package will be delivered to your address'
  }];

  const orderItems = [
  {
    id: 1,
    name: 'Cashmere Cable Knit Sweater',
    qty: 1,
    price: 189,
    image:
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
  },
  {
    id: 2,
    name: 'Gold Layered Necklace Set',
    qty: 1,
    price: 129,
    image:
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'
  }];

  if (!showTracking) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#8B5A3C] rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[#3D2817] mb-3 font-['Playfair_Display']">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Enter your order details to see real-time tracking information
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                  Order ID *
                </label>
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="LK-2024-12345"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                
                <p className="text-xs text-gray-500 mt-1">
                  Found in your order confirmation email
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                
                <p className="text-xs text-gray-500 mt-1">
                  Email used during checkout
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors">
                
                Track Order
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Need help?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a
                  href="mailto:support@lumiereknit.com"
                  className="text-[#8B5A3C] font-semibold hover:underline">
                  
                  Email Support
                </a>
                <span className="hidden sm:inline text-gray-400">•</span>
                <a
                  href="tel:+15551234567"
                  className="text-[#8B5A3C] font-semibold hover:underline">
                  
                  Call +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#3D2817] mb-2 font-['Playfair_Display']">
                Order #{orderId}
              </h1>
              <p className="text-gray-600">
                Placed on December 8, 2024 • Total: $318.00 • 2 items
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-[#FAF6F0] transition-colors">
                View Invoice
              </button>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-[#7A8B68] bg-opacity-10 rounded-xl p-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#7A8B68] rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Estimated Delivery
              </p>
              <p className="text-2xl font-bold text-[#3D2817]">
                Thursday, December 12
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#3D2817] mb-8 font-['Playfair_Display']">
                Tracking Timeline
              </h2>
              <div className="space-y-6">
                {trackingStages.map((stage, index) =>
                <div key={stage.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${stage.completed ? 'bg-[#8B5A3C] text-white' : stage.current ? 'bg-[#8B5A3C] text-white ring-4 ring-[#D4A574]' : 'bg-gray-200 text-gray-400'}`}>
                      
                        {stage.completed ?
                      <CheckCircle className="w-6 h-6" /> :
                      stage.current ?
                      <Truck className="w-6 h-6" /> :

                      <Package className="w-6 h-6" />
                      }
                      </div>
                      {index < trackingStages.length - 1 &&
                    <div
                      className={`w-1 h-16 ${stage.completed ? 'bg-[#8B5A3C]' : 'bg-gray-200'}`} />

                    }
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-[#3D2817]">
                          {stage.label}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {stage.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Map Tracking */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#3D2817] mb-6 font-['Playfair_Display']">
                Live Location
              </h2>
              <div className="relative aspect-video bg-gradient-to-br from-[#E8F0E5] to-[#FAF6F0] rounded-xl overflow-hidden">
                {/* Simplified map placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8B5A3C] rounded-full mb-4">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-bold text-[#3D2817] mb-1">
                      Your order is on the way!
                    </p>
                    <p className="text-sm text-gray-600">
                      Approximately 12 km away
                    </p>
                  </div>
                </div>
                {/* Decorative map lines */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20"
                  xmlns="http://www.w3.org/2000/svg">
                  
                  <line
                    x1="0"
                    y1="50%"
                    x2="100%"
                    y2="50%"
                    stroke="#8B5A3C"
                    strokeWidth="2" />
                  
                  <line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    stroke="#8B5A3C"
                    strokeWidth="2" />
                  
                  <circle cx="30%" cy="40%" r="8" fill="#8B5A3C" />
                  <circle cx="70%" cy="60%" r="8" fill="#7A8B68" />
                </svg>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#3D2817] mb-6 font-['Playfair_Display']">
                Order Items
              </h2>
              <div className="space-y-4">
                {orderItems.map((item) =>
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  
                    <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg" />
                  
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#3D2817] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.qty}
                      </p>
                      <p className="font-bold text-[#8B5A3C] mt-2">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-[#8B5A3C]" />
                <h3 className="text-lg font-bold text-[#3D2817]">
                  Notifications
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Get notified at each stage of your delivery
              </p>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">SMS Updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="w-5 h-5 text-[#8B5A3C] rounded" />
                  
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Email Updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-5 h-5 text-[#8B5A3C] rounded" />
                  
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      WhatsApp Updates
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappNotifications}
                    onChange={(e) => setWhatsappNotifications(e.target.checked)}
                    className="w-5 h-5 text-[#8B5A3C] rounded" />
                  
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#8B5A3C]" />
                <h3 className="text-lg font-bold text-[#3D2817]">
                  Delivery Address
                </h3>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-[#3D2817] mb-1">
                  Sarah Johnson
                </p>
                <p>123 Maple Street</p>
                <p>Portland, OR 97201</p>
                <p>United States</p>
                <p className="mt-2">+1 (555) 123-4567</p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#3D2817] mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to assist you
              </p>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat
                </button>
                <a
                  href="tel:+15551234567"
                  className="block w-full px-4 py-3 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-[#FAF6F0] transition-colors text-center flex items-center justify-center gap-2">
                  
                  <Phone className="w-5 h-5" />
                  Call Support
                </a>
                <a
                  href="mailto:support@lumiereknit.com"
                  className="block w-full px-4 py-3 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-[#FAF6F0] transition-colors text-center flex items-center justify-center gap-2">
                  
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
export default OrderTracking;
