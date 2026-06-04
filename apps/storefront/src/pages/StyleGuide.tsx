import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Heart,
  Briefcase,
  Calendar } from
'lucide-react';
export function StyleGuide() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Hero Section */}
      <div className="bg-[#5C3A24] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Playfair_Display']">
          Your Personal Style Guide
        </h1>
        <p className="text-lg md:text-xl text-[#D4A574] max-w-2xl mx-auto">
          Master the art of pairing luxurious knitwear with fine jewelry for an
          effortlessly elegant look.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        {/* Section 1: Layer Like a Pro */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
              Layer Like a Pro
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The secret to a curated look is in the layers. Whether you're
              stacking rings or cascading necklaces, here's how to build your
              jewelry wardrobe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3 font-['Playfair_Display']">
                Rings
              </h3>
              <p className="text-gray-600 text-sm">
                Start with a statement piece on your index or middle finger. Add
                delicate bands on adjacent fingers, mixing metals for a modern
                touch. Don't be afraid to stack 2-3 thin bands on a single
                finger.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3 font-['Playfair_Display']">
                Earrings
              </h3>
              <p className="text-gray-600 text-sm">
                The 'earscape' is all about balance. Anchor your look with a
                larger hoop or statement stud in the first lobe piercing, then
                graduate to smaller huggies or delicate studs as you move up the
                ear.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3 font-['Playfair_Display']">
                Bracelets
              </h3>
              <p className="text-gray-600 text-sm">
                Combine textures for visual interest. Pair a chunky chain with a
                delicate tennis bracelet and a solid cuff. Keep the heaviest
                piece closest to your wrist bone to anchor the stack.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#8B5A3C]" />
              </div>
              <h3 className="text-xl font-bold text-[#3D2817] mb-3 font-['Playfair_Display']">
                Necklaces
              </h3>
              <p className="text-gray-600 text-sm">
                The rule of three: start with a choker or short chain (14-16"),
                add a pendant necklace (18-20"), and finish with a longer lariat
                or chain (22-24"). Vary chain styles to prevent tangling.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Knitwear for Every Occasion */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-[#3D2817] mb-12 text-center font-['Playfair_Display']">
            Knitwear for Every Occasion
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"
                alt="Casual Knitwear"
                className="w-full h-80 object-cover rounded-xl" />
              
              <h3 className="text-2xl font-bold text-[#3D2817] font-['Playfair_Display']">
                Casual
              </h3>
              <p className="text-gray-600">
                Oversized silhouettes and chunky cable knits are perfect for
                relaxed days. Pair a slouchy cardigan with vintage denim and
                simple gold hoops for an effortless weekend look.
              </p>
            </div>
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800"
                alt="Smart Casual Knitwear"
                className="w-full h-80 object-cover rounded-xl" />
              
              <h3 className="text-2xl font-bold text-[#3D2817] font-['Playfair_Display']">
                Smart Casual
              </h3>
              <p className="text-gray-600">
                Fine merino wool and fitted cashmere sweaters bridge the gap
                between comfort and professionalism. A sleek turtleneck under a
                blazer creates a polished silhouette.
              </p>
            </div>
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1583846400216-df856648cb82?w=800"
                alt="Evening Knitwear"
                className="w-full h-80 object-cover rounded-xl" />
              
              <h3 className="text-2xl font-bold text-[#3D2817] font-['Playfair_Display']">
                Evening
              </h3>
              <p className="text-gray-600">
                Elevate your evening attire with silk-blend knits or pieces
                featuring subtle metallic threads. A fitted v-neck sweater
                paired with a silk slip skirt and statement earrings offers
                sophisticated glamour.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Perfect Combinations */}
        <section>
          <h2 className="text-3xl font-bold text-[#3D2817] mb-8 text-center font-['Playfair_Display']">
            Perfect Combinations
          </h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-gray-200">
                  <th className="p-6 font-bold text-[#3D2817] w-1/2">
                    Sweater Style
                  </th>
                  <th className="p-6 font-bold text-[#3D2817] w-1/2">
                    Best Jewelry Pairing
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-semibold text-[#3D2817]">
                    Chunky Turtleneck
                  </td>
                  <td className="p-6 text-gray-600">
                    Statement earrings (hoops or drops) and bold rings. Skip the
                    necklace.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-semibold text-[#3D2817]">
                    Deep V-Neck
                  </td>
                  <td className="p-6 text-gray-600">
                    A layered necklace stack or a single striking pendant that
                    mirrors the neckline.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-semibold text-[#3D2817]">
                    Crew Neck
                  </td>
                  <td className="p-6 text-gray-600">
                    A short, chunky chain or collar necklace that sits just
                    above the neckline.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-semibold text-[#3D2817]">
                    Boat Neck
                  </td>
                  <td className="p-6 text-gray-600">
                    Long, layered chains or a lariat necklace to elongate the
                    torso.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-semibold text-[#3D2817]">
                    Cardigan (Open)
                  </td>
                  <td className="p-6 text-gray-600">
                    Delicate layered necklaces and a stack of textured bracelets
                    on the wrist.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Dress for the Moment */}
        <section>
          <h2 className="text-3xl font-bold text-[#3D2817] mb-12 text-center font-['Playfair_Display']">
            Dress for the Moment
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4A574] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Coffee className="w-6 h-6 text-[#8B5A3C]" />
                <h3 className="text-xl font-bold text-[#3D2817] font-['Playfair_Display']">
                  Weekend Brunch
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                An oversized cashmere cardigan, simple white tee, and delicate
                gold huggies. Effortless and chic.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4A574] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-[#8B5A3C]" />
                <h3 className="text-xl font-bold text-[#3D2817] font-['Playfair_Display']">
                  Date Night
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                A fitted ribbed v-neck sweater paired with a sparkling diamond
                pendant and matching drop earrings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4A574] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-[#8B5A3C]" />
                <h3 className="text-xl font-bold text-[#3D2817] font-['Playfair_Display']">
                  WFO (Work From Office)
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                A fine merino wool turtleneck, pearl stud earrings, and a
                classic gold watch for a polished, professional look.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4A574] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#8B5A3C]" />
                <h3 className="text-xl font-bold text-[#3D2817] font-['Playfair_Display']">
                  Winter Wedding
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                A silk-blend wrap sweater over a slip dress, accessorized with
                statement chandelier earrings and a bold cocktail ring.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#D4A574] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Sun className="w-6 h-6 text-[#8B5A3C]" />
                <h3 className="text-xl font-bold text-[#3D2817] font-['Playfair_Display']">
                  Cozy Sunday
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                A chunky cable knit pullover, your favorite leggings, and simple
                gold sleeper hoops. Comfort without compromising style.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#8B5A3C] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4 font-['Playfair_Display']">
            Not sure what suits you?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-[#FAF6F0]">
            Our expert stylists are here to help you build a wardrobe that
            reflects your unique personality and lifestyle.
          </p>
          <button className="px-8 py-4 bg-white text-[#8B5A3C] font-bold rounded-full hover:bg-[#FAF6F0] transition-colors inline-flex items-center gap-2">
            Book a Styling Session
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </div>
    </div>);

}
export default StyleGuide;
