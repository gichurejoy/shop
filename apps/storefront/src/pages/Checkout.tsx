"use client";

import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Check,
  CreditCard,
  Smartphone,
  Banknote,
  Lock,
  MapPin,
  Package,
  Gift,
  Edit2 } from
'lucide-react';
interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
const savedAddresses: Address[] = [
{
  id: '1',
  label: 'Home',
  name: 'Sarah Johnson',
  phone: '+1 (555) 123-4567',
  line1: '123 Maple Street',
  city: 'Portland',
  state: 'OR',
  zip: '97201',
  country: 'United States'
},
{
  id: '2',
  label: 'Work',
  name: 'Sarah Johnson',
  phone: '+1 (555) 123-4567',
  line1: '456 Oak Avenue, Suite 200',
  city: 'Portland',
  state: 'OR',
  zip: '97204',
  country: 'United States'
}];

const cartItems = [
{
  id: 1,
  name: 'Cashmere Cable Knit Sweater',
  price: 189,
  qty: 1,
  image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
},
{
  id: 2,
  name: 'Gold Layered Necklace Set',
  price: 129,
  qty: 1,
  image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'
}];

export function Checkout() {
  const navigate = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [differentShipping, setDifferentShipping] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftWrapDesign, setGiftWrapDesign] = useState('gold');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('mpesa');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const steps = [
  {
    number: 1,
    label: 'Address',
    completed: currentStep > 1
  },
  {
    number: 2,
    label: 'Shipping',
    completed: currentStep > 2
  },
  {
    number: 3,
    label: 'Payment',
    completed: currentStep > 3
  },
  {
    number: 4,
    label: 'Review',
    completed: false
  }];

  const shippingOptions = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    eta: '5-7 business days',
    price: 0
  },
  {
    id: 'express',
    name: 'Express Delivery',
    eta: '2-3 business days',
    price: 9.99
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    eta: 'Next business day',
    price: 24.99
  }];

  const giftWrapDesigns = [
  {
    id: 'gold',
    name: 'Warm Gold',
    color: '#D4A574'
  },
  {
    id: 'midnight',
    name: 'Midnight Luxury',
    color: '#1a1a2e'
  },
  {
    id: 'blush',
    name: 'Soft Blush',
    color: '#f8e6e6'
  },
  {
    id: 'winter',
    name: 'Winter Knit',
    color: '#7A8B68'
  }];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const shipping =
  shippingOptions.find((s) => s.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.08;
  const giftWrapFee = giftWrap ? 5 : 0;
  const total = subtotal + shipping + tax + giftWrapFee;
  const handlePlaceOrder = () => {
    if (!agreedToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    const orderId = 'LK-2024-' + Math.floor(10000 + Math.random() * 90000);
    navigate(`/order-confirmation/${orderId}`);
  };
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            {steps.map((step, index) =>
            <Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step.completed ? 'bg-[#8B5A3C] text-white' : step.number === currentStep ? 'bg-[#8B5A3C] text-white ring-4 ring-[#D4A574]' : 'bg-gray-200 text-gray-500'}`}>
                  
                    {step.completed ?
                  <Check className="w-6 h-6" /> :

                  step.number
                  }
                  </div>
                  <span
                  className={`mt-2 text-sm font-medium ${step.number === currentStep ? 'text-[#3D2817]' : 'text-gray-500'}`}>
                  
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 &&
              <div
                className={`w-16 md:w-24 h-1 mx-2 md:mx-4 mb-8 ${step.completed ? 'bg-[#8B5A3C]' : 'bg-gray-200'}`} />

              }
              </Fragment>
            )}
          </div>
          <h1 className="text-3xl font-bold text-center text-[#3D2817] font-['Playfair_Display']">
            {steps[currentStep - 1].label}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* STEP 1 - ADDRESS */}
            {currentStep === 1 &&
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#3D2817] mb-4">
                    Select Delivery Address
                  </h2>
                  <div className="space-y-3 mb-4">
                    {savedAddresses.map((addr) =>
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedAddress === addr.id ? 'border-[#8B5A3C] bg-[#FAF6F0]' : 'border-gray-200 hover:border-[#D4A574]'}`}>
                    
                        <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="sr-only" />
                    
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-[#D4A574] text-[#3D2817] text-xs font-bold rounded">
                                {addr.label}
                              </span>
                            </div>
                            <p className="font-semibold text-[#3D2817]">
                              {addr.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.phone}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.line1}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} {addr.zip}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.country}
                            </p>
                          </div>
                        </div>
                      </label>
                  )}
                  </div>

                  <button
                  onClick={() => setShowNewAddress(!showNewAddress)}
                  className="text-[#8B5A3C] font-semibold hover:text-[#6F4630] transition-colors">
                  
                    + Add New Address
                  </button>

                  {showNewAddress &&
                <div className="mt-6 p-6 bg-[#FAF6F0] rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                            Full Name *
                          </label>
                          <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                      
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                            Phone Number *
                          </label>
                          <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                      
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                          Address Line 1 *
                        </label>
                        <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                    
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                    
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                            City *
                          </label>
                          <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                      
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                            State *
                          </label>
                          <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                      
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                            ZIP Code *
                          </label>
                          <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                      
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                          Country *
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]">
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                          Email *
                        </label>
                        <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                    
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                      type="checkbox"
                      className="w-4 h-4 text-[#8B5A3C] rounded" />
                    
                        <span className="text-sm text-gray-700">
                          Save this address for future orders
                        </span>
                      </label>
                    </div>
                }
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <label className="flex items-center gap-3">
                    <input
                    type="checkbox"
                    checked={differentShipping}
                    onChange={(e) => setDifferentShipping(e.target.checked)}
                    className="w-5 h-5 text-[#8B5A3C] rounded" />
                  
                    <span className="font-semibold text-[#3D2817]">
                      Ship to different address than billing
                    </span>
                  </label>
                  {differentShipping &&
                <div className="mt-4 text-sm text-gray-600">
                      (Second address form would appear here)
                    </div>
                }
                </div>

                <div className="flex justify-end">
                  <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors flex items-center gap-2">
                  
                    Continue to Shipping
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            }

            {/* STEP 2 - SHIPPING */}
            {currentStep === 2 &&
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#3D2817] mb-4">
                    Select Shipping Method
                  </h2>
                  <div className="space-y-3">
                    {shippingOptions.map((option) =>
                  <label
                    key={option.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${shippingMethod === option.id ? 'border-[#8B5A3C] bg-[#FAF6F0]' : 'border-gray-200 hover:border-[#D4A574]'}`}>
                    
                        <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={shippingMethod === option.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="sr-only" />
                    
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Package className="w-6 h-6 text-[#8B5A3C]" />
                            <div>
                              <p className="font-semibold text-[#3D2817]">
                                {option.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {option.eta}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-[#3D2817]">
                            {option.price === 0 ?
                        'FREE' :
                        `$${option.price.toFixed(2)}`}
                          </p>
                        </div>
                      </label>
                  )}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions for delivery?"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <label className="flex items-center gap-3 mb-4">
                    <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="w-5 h-5 text-[#8B5A3C] rounded" />
                  
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-[#8B5A3C]" />
                      <span className="font-semibold text-[#3D2817]">
                        Add Gift Wrapping (+$5.00)
                      </span>
                    </div>
                  </label>
                  {giftWrap &&
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {giftWrapDesigns.map((design) =>
                  <button
                    key={design.id}
                    onClick={() => setGiftWrapDesign(design.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${giftWrapDesign === design.id ? 'border-[#8B5A3C]' : 'border-gray-200 hover:border-[#D4A574]'}`}
                    style={{
                      backgroundColor: design.color
                    }}>
                    
                          <p className="text-xs font-semibold text-center mt-2 text-[#3D2817]">
                            {design.name}
                          </p>
                        </button>
                  )}
                    </div>
                }
                </div>

                <div className="flex justify-between">
                  <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-[#FAF6F0] transition-colors">
                  
                    Back
                  </button>
                  <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors flex items-center gap-2">
                  
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            }

            {/* STEP 3 - PAYMENT */}
            {currentStep === 3 &&
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#3D2817] mb-4">
                    Payment Method
                  </h2>
                  <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                    <button
                    onClick={() => setPaymentMethod('card')}
                    className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${paymentMethod === 'card' ? 'text-[#8B5A3C] border-b-2 border-[#8B5A3C]' : 'text-gray-500 hover:text-[#3D2817]'}`}>
                    
                      <CreditCard className="w-5 h-5 inline mr-2" />
                      Credit/Debit Card
                    </button>
                    <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${paymentMethod === 'mobile' ? 'text-[#8B5A3C] border-b-2 border-[#8B5A3C]' : 'text-gray-500 hover:text-[#3D2817]'}`}>
                    
                      <Smartphone className="w-5 h-5 inline mr-2" />
                      Mobile Money
                    </button>
                    <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${paymentMethod === 'cod' ? 'text-[#8B5A3C] border-b-2 border-[#8B5A3C]' : 'text-gray-500 hover:text-[#3D2817]'}`}>
                    
                      <Banknote className="w-5 h-5 inline mr-2" />
                      Cash on Delivery
                    </button>
                  </div>

                  {paymentMethod === 'card' &&
                <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                          Card Number *
                        </label>
                        <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                    
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                            Expiry Date *
                          </label>
                          <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                      
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                            CVV *
                          </label>
                          <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                      
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                          Name on Card *
                        </label>
                        <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                    
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                      type="checkbox"
                      className="w-4 h-4 text-[#8B5A3C] rounded" />
                    
                        <span className="text-sm text-gray-700">
                          Save card for future purchases
                        </span>
                      </label>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                        <Lock className="w-4 h-4" />
                        <span>Secure payment via Stripe</span>
                      </div>
                    </div>
                }

                  {paymentMethod === 'mobile' &&
                <div className="space-y-4">
                      <div className="flex gap-2 mb-4">
                        {['mpesa', 'mtn', 'airtel'].map((provider) =>
                    <button
                      key={provider}
                      onClick={() => setMobileMoneyProvider(provider)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mobileMoneyProvider === provider ? 'bg-[#8B5A3C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      
                            {provider.toUpperCase()}
                          </button>
                    )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                          Phone Number *
                        </label>
                        <input
                      type="tel"
                      placeholder="+254 712 345 678"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A3C]" />
                    
                      </div>
                      <button className="w-full px-6 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors">
                        Send STK Push
                      </button>
                    </div>
                }

                  {paymentMethod === 'cod' &&
                <div className="p-4 bg-[#FAF6F0] rounded-lg">
                      <p className="text-sm text-gray-700">
                        Pay with cash when your order arrives. A $2.00 COD
                        processing fee will be added to your order total.
                      </p>
                    </div>
                }
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#3D2817] mb-3">
                    Billing Address
                  </h3>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="w-4 h-4 text-[#8B5A3C] rounded" />
                  
                    <span className="text-sm text-gray-700">
                      Same as shipping address
                    </span>
                  </label>
                  {!sameAsBilling &&
                <p className="text-sm text-gray-600">
                      (Billing address form would appear here)
                    </p>
                }
                </div>

                <div className="flex justify-between">
                  <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-[#FAF6F0] transition-colors">
                  
                    Back
                  </button>
                  <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors flex items-center gap-2">
                  
                    Review Order
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            }

            {/* STEP 4 - REVIEW */}
            {currentStep === 4 &&
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#3D2817] mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    {cartItems.map((item) =>
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    
                        <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg" />
                    
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#3D2817]">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Qty: {item.qty}
                          </p>
                          <p className="font-bold text-[#8B5A3C] mt-1">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                  )}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-[#8B5A3C]" />
                        <h3 className="font-bold text-[#3D2817]">
                          Shipping Address
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        {savedAddresses[0].name}
                        <br />
                        {savedAddresses[0].line1}
                        <br />
                        {savedAddresses[0].city}, {savedAddresses[0].state}{' '}
                        {savedAddresses[0].zip}
                      </p>
                    </div>
                    <button
                    onClick={() => setCurrentStep(1)}
                    className="text-[#8B5A3C] text-sm font-semibold hover:text-[#6F4630] flex items-center gap-1">
                    
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-[#8B5A3C]" />
                        <h3 className="font-bold text-[#3D2817]">
                          Shipping Method
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        {
                      shippingOptions.find((s) => s.id === shippingMethod)?.
                      name
                      }
                      </p>
                    </div>
                    <button
                    onClick={() => setCurrentStep(2)}
                    className="text-[#8B5A3C] text-sm font-semibold hover:text-[#6F4630] flex items-center gap-1">
                    
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-[#8B5A3C]" />
                        <h3 className="font-bold text-[#3D2817]">
                          Payment Method
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        {paymentMethod === 'card' ?
                      'Credit/Debit Card' :
                      paymentMethod === 'mobile' ?
                      'Mobile Money' :
                      'Cash on Delivery'}
                      </p>
                    </div>
                    <button
                    onClick={() => setCurrentStep(3)}
                    className="text-[#8B5A3C] text-sm font-semibold hover:text-[#6F4630] flex items-center gap-1">
                    
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  {giftWrap &&
                <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Gift className="w-4 h-4 text-[#8B5A3C]" />
                      <span>Gift wrapping included</span>
                    </div>
                }

                  {orderNotes &&
                <div className="text-sm">
                      <span className="font-semibold text-[#3D2817]">
                        Order Notes:
                      </span>
                      <p className="text-gray-700 mt-1">{orderNotes}</p>
                    </div>
                }
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <label className="flex items-start gap-3">
                    <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 text-[#8B5A3C] rounded mt-0.5" />
                  
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link
                      href="/terms"
                      className="text-[#8B5A3C] font-semibold hover:underline">
                      
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link
                      href="/privacy"
                      className="text-[#8B5A3C] font-semibold hover:underline">
                      
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 border-2 border-[#8B5A3C] text-[#8B5A3C] font-semibold rounded-lg hover:bg-[#FAF6F0] transition-colors">
                  
                    Back
                  </button>
                  <button
                  onClick={handlePlaceOrder}
                  className="px-8 py-3 bg-[#8B5A3C] text-white font-semibold rounded-lg hover:bg-[#6F4630] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!agreedToTerms}>
                  
                    Place Order
                  </button>
                </div>
              </div>
            }
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h3 className="text-lg font-bold text-[#3D2817] mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {cartItems.map((item) =>
                <div key={item.id} className="flex gap-3">
                    <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg" />
                  
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#3D2817] line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                      <p className="text-sm font-bold text-[#8B5A3C]">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-[#3D2817]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-[#3D2817]">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-[#3D2817]">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                {giftWrap &&
                <div className="flex justify-between">
                    <span className="text-gray-600">Gift Wrap</span>
                    <span className="font-semibold text-[#3D2817]">
                      ${giftWrapFee.toFixed(2)}
                    </span>
                  </div>
                }
                <div className="flex justify-between pt-3 border-t border-gray-200 text-base">
                  <span className="font-bold text-[#3D2817]">Total</span>
                  <span className="font-bold text-[#8B5A3C] text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}