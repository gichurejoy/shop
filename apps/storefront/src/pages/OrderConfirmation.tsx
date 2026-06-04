"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle, Package, Mail, Calendar, ArrowRight } from 'lucide-react';
export function OrderConfirmation() {
  const { orderId } = useParams();
  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#7A8B68] rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#3D2817] mb-3 font-['Playfair_Display']">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-[#FAF6F0] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Package className="w-6 h-6 text-[#8B5A3C]" />
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Order Number
              </span>
            </div>
            <p className="text-3xl font-bold text-[#3D2817] font-mono">
              {orderId}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-[#FAF6F0] rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-[#8B5A3C]" />
                <h3 className="font-bold text-[#3D2817]">Confirmation Email</h3>
              </div>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to your registered email
                address with order details and tracking information.
              </p>
            </div>

            <div className="p-6 bg-[#FAF6F0] rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-[#8B5A3C]" />
                <h3 className="font-bold text-[#3D2817]">Estimated Delivery</h3>
              </div>
              <p className="text-sm text-gray-600">Your order will arrive by</p>
              <p className="text-lg font-bold text-[#8B5A3C] mt-1">
                Thursday, December 12, 2024
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href={`/tracking/${orderId}`}
              className="px-8 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors flex items-center justify-center gap-2">
              
              Track Your Order
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-[#FAF6F0] transition-colors">
              
              Continue Shopping
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Need help with your order?
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
              <span className="hidden sm:inline text-gray-400">•</span>
              <button className="text-[#8B5A3C] font-semibold hover:underline">
                Live Chat
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#3D2817] mb-4 font-['Playfair_Display']">
            What Happens Next?
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#8B5A3C] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[#3D2817] mb-1">
                  Order Confirmation
                </h3>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation with your order details
                  within the next few minutes.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#8B5A3C] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[#3D2817] mb-1">
                  Order Processing
                </h3>
                <p className="text-sm text-gray-600">
                  Our team will carefully pack your items with love and
                  attention to detail.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#8B5A3C] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[#3D2817] mb-1">
                  Shipping Notification
                </h3>
                <p className="text-sm text-gray-600">
                  Once shipped, you'll receive a tracking number to follow your
                  package's journey.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#8B5A3C] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-[#3D2817] mb-1">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your beautiful pieces will arrive at your doorstep, ready to
                  be enjoyed!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
export default OrderConfirmation;
