import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Plus, Check } from 'lucide-react';
import { useStorefront, Address } from '../context/StorefrontContext';

export function AddressDrawer() {
  const {
    isAddressDrawerOpen,
    setIsAddressDrawerOpen,
    savedAddresses,
    activeAddress,
    setActiveAddress,
    addAddress
  } = useStorefront();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newZip, setNewZip] = useState('');

  if (!isAddressDrawerOpen) return null;

  const handleSelect = (addrStr: string) => {
    setActiveAddress(addrStr);
    setIsAddressDrawerOpen(false);
  };

  const handleUseCurrentLocation = () => {
    handleSelect('Rangareddy 500101');
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine || !newCity) return;
    addAddress({
      label: newLabel,
      addressLine: newAddressLine,
      city: newCity,
      zipCode: newZip
    });
    handleSelect(`${newLabel}: ${newAddressLine}, ${newCity}`);
    setIsAddingNew(false);
    setNewAddressLine('');
    setNewCity('');
    setNewZip('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={() => setIsAddressDrawerOpen(false)}
      />

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full transform transition-transform duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
            <button 
              onClick={() => setIsAddressDrawerOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-bold text-[#3D2817]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Deliver to
            </h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {!isAddingNew ? (
              <>
                {/* Current Location Button */}
                <button
                  onClick={handleUseCurrentLocation}
                  className="w-full bg-[#136363] hover:bg-[#0B4A4A] text-white py-3.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm"
                >
                  <Navigation className="w-5 h-5 fill-white text-[#136363]" />
                  Current Location
                </button>

                {/* Separator OR */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 tracking-wider">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Choose different location button */}
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full border border-gray-200 hover:border-[#136363] bg-white text-[#136363] py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2.5 transition-all"
                >
                  <MapPin className="w-5 h-5 text-[#136363]" />
                  Choose a different location
                </button>

                {/* Saved Addresses List */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                    Saved Addresses
                  </h3>
                  
                  {savedAddresses.map((addr) => {
                    const addrStr = `${addr.label}: ${addr.addressLine}, ${addr.city}`;
                    const isActive = activeAddress === addrStr;
                    return (
                      <div 
                        key={addr.id}
                        onClick={() => handleSelect(addrStr)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start justify-between group ${
                          isActive 
                            ? 'border-[#136363] bg-[#F5F9F9]' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex gap-3">
                          <MapPin className={`w-5 h-5 mt-0.5 ${isActive ? 'text-[#136363]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                          <div>
                            <h4 className="font-bold text-sm text-[#3D2817]">{addr.label}</h4>
                            <p className="text-xs text-gray-500 mt-1">{addr.addressLine}</p>
                            <p className="text-xs text-gray-500">{addr.city}, {addr.zipCode}</p>
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-5 h-5 rounded-full bg-[#136363] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Add New Address View */
              <form onSubmit={handleSaveNewAddress} className="space-y-4">
                <h3 className="text-sm font-bold text-[#3D2817] mb-2">Add New Location</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                  <select 
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#136363]"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Address Line</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Street address, P.O. box, suite"
                    value={newAddressLine}
                    onChange={e => setNewAddressLine(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#136363]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Los Angeles"
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#136363]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Zip Code</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 90001"
                      value={newZip}
                      onChange={e => setNewZip(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#136363]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-[#136363] hover:bg-[#0B4A4A] text-white rounded-lg text-sm font-bold shadow-sm"
                  >
                    Save & Use
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
