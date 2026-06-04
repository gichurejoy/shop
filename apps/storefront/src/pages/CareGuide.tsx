"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Wind,
  Shield,
  Wrench,
  MessageCircle } from
'lucide-react';
export function CareGuide() {
  const [activeTab, setActiveTab] = useState<'jewelry' | 'knitwear'>('jewelry');
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero Section */}
      <div className="bg-[#5C3A24] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Playfair_Display']">
          How to Care for Your Lumière & Knit Pieces
        </h1>
        <p className="text-lg md:text-xl text-[#D4A574] max-w-2xl mx-auto">
          Expert advice to ensure your luxury items last a lifetime.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('jewelry')}
              className={`px-8 py-3 rounded-full font-bold transition-colors ${activeTab === 'jewelry' ? 'bg-[#8B5A3C] text-white' : 'text-gray-600 hover:text-[#3D2817]'}`}>
              
              Jewelry Care
            </button>
            <button
              onClick={() => setActiveTab('knitwear')}
              className={`px-8 py-3 rounded-full font-bold transition-colors ${activeTab === 'knitwear' ? 'bg-[#8B5A3C] text-white' : 'text-gray-600 hover:text-[#3D2817]'}`}>
              
              Knitwear Care
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-16">
          {activeTab === 'jewelry' ?
          <div className="space-y-12 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-2xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                    Solid Gold
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Solid gold is durable but can scratch. Clean regularly with
                    a solution of warm water and mild dish soap. Soak for 15
                    minutes, gently scrub with a soft-bristled toothbrush,
                    rinse, and dry with a lint-free cloth. Avoid wearing gold in
                    chlorinated pools or hot tubs, as chlorine can weaken the
                    metal structure over time.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-2xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                    Sterling Silver
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Silver naturally tarnishes when exposed to air and moisture.
                    The best way to prevent tarnish is to wear your silver
                    often! When not wearing, store in an airtight bag with an
                    anti-tarnish strip. Clean with a specialized silver
                    polishing cloth. Avoid liquid silver cleaners as they can
                    remove intentional antiquing and damage softer stones.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-2xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                    Diamonds & Gemstones
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    While diamonds are the hardest natural substance, they can
                    still chip if struck at the right angle. Clean diamond
                    jewelry with a mixture of ammonia and water (1:6 ratio) and
                    a soft brush. For softer gemstones like emeralds, opals, or
                    turquoise, avoid ultrasonic cleaners and harsh chemicals;
                    stick to mild soap and water only.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-2xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                    Pearls
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pearls are organic and highly sensitive. Always apply the
                    "last on, first off" rule: put pearls on after applying
                    makeup, perfume, and hairspray, and take them off first.
                    Wipe gently with a soft, damp cloth after wearing. Never
                    submerge pearls in water, as it can weaken the silk thread
                    they are strung on. Store flat, separate from other jewelry
                    to prevent scratching.
                  </p>
                </div>
              </div>
            </div> :

          <div className="space-y-12 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                    Cashmere
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Hand wash in cold water using a specialized cashmere shampoo
                    or mild baby shampoo. Gently squeeze suds through the
                    fabric—never wring or twist. Rinse thoroughly in cold water.
                    Lay flat on a clean towel, roll up to absorb excess water,
                    then unroll and reshape to dry flat away from direct heat or
                    sunlight.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                    Merino Wool
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Merino is naturally odor-resistant and requires less
                    frequent washing. When necessary, hand wash or use the
                    delicate cycle on your machine with cold water and a
                    wool-safe detergent. Place in a mesh laundry bag if machine
                    washing. Always dry flat; hanging will stretch the fibers
                    and distort the shape.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
                    Cable Knit
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Heavy cable knits are prone to stretching. Always fold,
                    never hang. Pilling is natural for natural fibers; use a
                    cashmere comb or fabric shaver gently in one direction to
                    remove pills. Avoid wearing heavy bags with abrasive straps
                    that can cause excessive friction and pilling on the
                    shoulders.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-2xl font-bold text-[#3D2817] mb-6 font-['Playfair_Display']">
                  General Knitwear Tips
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Wind className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Air out your sweaters after wearing instead of washing
                      immediately.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Droplets className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Treat stains immediately by spot cleaning with cold water
                      and mild detergent.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#8B5A3C] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Use cedar blocks or lavender sachets to naturally deter
                      moths.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          }

          {/* Storage Guide */}
          <div className="bg-[#3D2817] rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center font-['Playfair_Display']">
              Storage Guide
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-[#D4A574] mb-4">
                  Jewelry
                </h3>
                <ul className="space-y-3 text-gray-300 list-disc pl-4">
                  <li>
                    Store pieces individually in soft pouches or lined
                    compartments to prevent scratching.
                  </li>
                  <li>Keep silver in airtight bags to slow down tarnishing.</li>
                  <li>
                    Fasten necklace clasps before storing to prevent tangling.
                  </li>
                  <li>
                    Store away from direct sunlight and extreme humidity (avoid
                    the bathroom).
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#D4A574] mb-4">
                  Knitwear
                </h3>
                <ul className="space-y-3 text-gray-300 list-disc pl-4">
                  <li>
                    Always fold sweaters; never hang them, as gravity will
                    stretch the shoulders and distort the shape.
                  </li>
                  <li>
                    Store clean. Moths are attracted to body oils and perfume
                    residue, not just the wool itself.
                  </li>
                  <li>
                    For long-term seasonal storage, use breathable cotton or
                    canvas bags, not plastic bins which can trap moisture.
                  </li>
                  <li>
                    Include natural moth repellents like cedar balls, replacing
                    them annually.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Repair & Restoration */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center border border-gray-100">
            <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-8 h-8 text-[#8B5A3C]" />
            </div>
            <h2 className="text-3xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
              Repair & Restoration
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Accidents happen. Whether it's a broken clasp, a lost stone, or a
              snagged sweater, our expert artisans are here to restore your
              Lumière & Knit pieces to their original glory.
            </p>
            <button className="px-8 py-4 bg-[#8B5A3C] text-white font-bold rounded-xl hover:bg-[#6F4630] transition-colors">
              Request a Repair →
            </button>
          </div>

          {/* CTA Banner */}
          <div className="bg-[#FAF6F0] border border-[#D4A574] rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-[#3D2817] mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our care specialists are available to provide personalized advice.
            </p>
            <button className="px-6 py-3 border-2 border-[#8B5A3C] text-[#8B5A3C] font-bold rounded-lg hover:bg-white transition-colors inline-flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat with Us
            </button>
          </div>
        </div>
      </div>
    </div>);

}
export default CareGuide;
