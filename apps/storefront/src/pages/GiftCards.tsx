"use client";

import React, { useState } from 'react';
import {
  Gift,
  Mail,
  CreditCard,
  CheckCircle,
  MessageCircle } from
'lucide-react';
export function GiftCards() {
  const [amount, setAmount] = useState<number | 'custom'>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [design, setDesign] = useState('gold');
  const presetAmounts = [
  {
    value: 25,
    label: '$25 Starter'
  },
  {
    value: 50,
    label: '$50 Classic'
  },
  {
    value: 100,
    label: '$100 Premium'
  },
  {
    value: 200,
    label: '$200 Luxury'
  },
  {
    value: 'custom',
    label: 'Custom'
  }];

  const designs = [
  {
    id: 'gold',
    name: 'Warm Gold',
    color: '#D4A574'
  },
  {
    id: 'midnight',
    name: 'Midnight Luxury',
    color: '#3D2817'
  },
  {
    id: 'blush',
    name: 'Soft Blush',
    color: '#F8E6E6'
  },
  {
    id: 'winter',
    name: 'Winter Knit',
    color: '#7A8B68'
  }];

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero Section */}
      <div className="bg-[#5C3A24] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Playfair_Display']">
          Give the Gift of Lumière & Knit
        </h1>
        <p className="text-lg md:text-xl text-[#D4A574] max-w-2xl mx-auto">
          The perfect present for the one who appreciates timeless elegance and
          cozy luxury.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-12">
            {/* Amount Selector */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#3D2817] mb-6 font-['Playfair_Display']">
                1. Select Amount
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {presetAmounts.map((preset) =>
                <button
                  key={preset.value}
                  onClick={() => setAmount(preset.value)}
                  className={`p-4 rounded-xl border-2 font-semibold transition-colors ${amount === preset.value ? 'border-[#8B5A3C] bg-[#FAF6F0] text-[#3D2817]' : 'border-gray-200 text-gray-600 hover:border-[#D4A574]'}`}>
                  
                    {preset.label}
                  </button>
                )}
              </div>
              {amount === 'custom' &&
              <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                    Enter Custom Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      $
                    </span>
                    <input
                    type="number"
                    min="10"
                    max="1000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                    placeholder="Enter amount between $10 and $1000" />
                  
                  </div>
                </div>
              }
            </section>

            {/* Design Options */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#3D2817] mb-6 font-['Playfair_Display']">
                2. Choose a Design
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {designs.map((d) =>
                <button
                  key={d.id}
                  onClick={() => setDesign(d.id)}
                  className={`relative aspect-video rounded-xl border-2 transition-all overflow-hidden ${design === d.id ? 'border-[#8B5A3C] ring-2 ring-[#8B5A3C] ring-offset-2' : 'border-transparent'}`}
                  style={{
                    backgroundColor: d.color
                  }}>
                  
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                      className={`font-['Playfair_Display'] font-bold ${d.id === 'blush' ? 'text-[#3D2817]' : 'text-white'}`}>
                      
                        {d.name}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </section>

            {/* Recipient Form */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#3D2817] mb-6 font-['Playfair_Display']">
                3. Personalize
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                      To (Recipient Name)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                      placeholder="Jane Doe" />
                    
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                      placeholder="jane@example.com" />
                    
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                      From (Your Name)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                      placeholder="John Smith" />
                    
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                    
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]"
                    placeholder="Wishing you a wonderful birthday!">
                  </textarea>
                </div>
              </div>
            </section>

            {/* How It Works & Terms */}
            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#8B5A3C] flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#3D2817]">Choose:</strong> Select
                      your preferred gift card value and a beautiful digital
                      design.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#8B5A3C] flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#3D2817]">Personalize:</strong>{' '}
                      Add the recipient's details and a heartfelt custom
                      message.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#8B5A3C] flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#3D2817]">Deliver:</strong> We'll
                      email the digital gift card instantly or on your chosen
                      date.
                    </p>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                  Terms & Conditions
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 list-disc pl-4">
                  <li>Valid for 5 years from the date of purchase.</li>
                  <li>Redeemable online at lumiereknit.com only.</li>
                  <li>Cannot be exchanged for cash or refunded.</li>
                  <li>
                    Can be used across multiple purchases until the balance is
                    zero.
                  </li>
                  <li>Not applicable for purchasing other gift cards.</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Right Column: Sticky Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#3D2817] mb-4">
                  Preview
                </h3>
                <div
                  className="aspect-[1.6/1] rounded-xl mb-6 flex flex-col justify-between p-6 text-white shadow-md"
                  style={{
                    backgroundColor:
                    designs.find((d) => d.id === design)?.color || '#D4A574'
                  }}>
                  
                  <div className="flex justify-between items-start">
                    <span
                      className={`font-['Playfair_Display'] font-bold text-xl ${design === 'blush' ? 'text-[#3D2817]' : 'text-white'}`}>
                      
                      Lumière & Knit
                    </span>
                    <Gift
                      className={`w-6 h-6 ${design === 'blush' ? 'text-[#3D2817]' : 'text-white'}`} />
                    
                  </div>
                  <div>
                    <p
                      className={`text-sm opacity-80 mb-1 ${design === 'blush' ? 'text-[#3D2817]' : 'text-white'}`}>
                      
                      Gift Card Value
                    </p>
                    <p
                      className={`text-3xl font-bold ${design === 'blush' ? 'text-[#3D2817]' : 'text-white'}`}>
                      
                      ${amount === 'custom' ? customAmount || '0' : amount}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-[#3D2817]">Email</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-xl text-[#8B5A3C]">
                      ${amount === 'custom' ? customAmount || '0' : amount}
                    </span>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#8B5A3C] text-white font-bold rounded-xl hover:bg-[#6F4630] transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* CTA Banner */}
              <div className="bg-[#FAF6F0] border border-[#D4A574] rounded-2xl p-6 text-center">
                <h3 className="font-bold text-[#3D2817] mb-2">
                  Still not sure?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our stylists can help you pick the perfect gift.
                </p>
                <button className="w-full py-2 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat with a Stylist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
export default GiftCards;
