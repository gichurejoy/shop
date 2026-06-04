import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStorefront, Address } from '../context/StorefrontContext';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Award, 
  LogOut, 
  Trash2, 
  Edit2,
  Plus, 
  Check, 
  Calendar, 
  DollarSign, 
  Download,
  X,
  Truck
} from 'lucide-react';

export function Dashboard() {
  const router = useRouter();
  const { user, isLoggedIn, logout, savedAddresses, removeAddress, addAddress, editAddress } = useStorefront();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'rewards'>('profile');

  // Address add/edit state
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newZip, setNewZip] = useState('');

  // Button interactivity states
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<any | null>(null);

  // Profile update state
  const [name, setName] = useState(user?.name || 'Jane Doe');
  const [email, setEmail] = useState(user?.email || 'jane.doe@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 123-4567');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Sync profile details when user is loaded
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center bg-[#FAF6F0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5A3C]"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleStartEdit = (addr: Address) => {
    setEditingAddrId(addr.id);
    setNewLabel(addr.label);
    setNewAddrLine(addr.addressLine);
    setNewCity(addr.city);
    setNewZip(addr.zipCode);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine || !newCity) return;
    
    if (editingAddrId) {
      editAddress(editingAddrId, {
        label: newLabel,
        addressLine: newAddrLine,
        city: newCity,
        zipCode: newZip
      });
      setEditingAddrId(null);
    } else {
      addAddress({
        label: newLabel,
        addressLine: newAddrLine,
        city: newCity,
        zipCode: newZip
      });
      setIsAddingAddr(false);
    }

    setNewAddrLine('');
    setNewCity('');
    setNewZip('');
  };

  const handleApplyCoupon = (code: string) => {
    if (appliedCoupons.includes(code)) return;
    setAppliedCoupons([...appliedCoupons, code]);
  };

  const mockOrders = [
    {
      id: 'ORD-893041',
      date: 'May 28, 2026',
      total: 385.00,
      status: 'Shipped',
      trackingNo: 'USPS94001111',
      items: '1x Eternity Band Gold Ring, 1x Cashmere Cardigan',
      carrier: 'USPS Ground Advantage',
      estDelivery: 'June 4, 2026'
    },
    {
      id: 'ORD-729013',
      date: 'April 14, 2026',
      total: 120.00,
      status: 'Delivered',
      trackingNo: 'UPS1Z999',
      items: '1x Pullover Wool Sweater',
      carrier: 'UPS 2nd Day Air',
      estDelivery: 'April 17, 2026'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF6F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#8B5A3C] text-white flex items-center justify-center font-bold text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-[#3D2817] leading-tight">{user.name}</h3>
              <span className="text-xs text-[#8B5A3C] font-semibold">{user.tier}</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'profile' 
                  ? 'bg-[#FAF6F0] text-[#8B5A3C]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              Profile Details
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'orders' 
                  ? 'bg-[#FAF6F0] text-[#8B5A3C]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Order History
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'addresses' 
                  ? 'bg-[#FAF6F0] text-[#8B5A3C]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Address Book
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'rewards' 
                  ? 'bg-[#FAF6F0] text-[#8B5A3C]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Award className="w-4 h-4" />
              Loyalty Rewards
            </button>

            <div className="border-t border-gray-100 my-3" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[500px]">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#3D2817]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Profile Information
                </h2>
                <p className="text-xs text-gray-500 mt-1">Update your personal account details.</p>
              </div>

              {profileSuccess && (
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8B5A3C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8B5A3C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8B5A3C] focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-[#8B5A3C] hover:bg-[#6F4630] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#3D2817]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order History
                </h2>
                <p className="text-xs text-gray-500 mt-1">Track and manage your past purchases.</p>
              </div>

              <div className="space-y-4">
                {mockOrders.map((ord) => (
                  <div key={ord.id} className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-all flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#3D2817]">{ord.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                          ord.status === 'Shipped' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{ord.items}</p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {ord.date}</span>
                        <span className="flex items-center gap-0.5"><DollarSign className="w-3.5 h-3.5" /> {ord.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:self-center">
                      <button 
                        onClick={() => setViewingInvoiceOrder(ord)}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:border-[#8B5A3C] hover:text-[#8B5A3C] rounded-lg text-xs font-bold text-gray-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Invoice
                      </button>
                      <button 
                        onClick={() => setTrackingOrder(ord)}
                        className="px-4 py-2 bg-[#8B5A3C] hover:bg-[#6F4630] text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Track Shipment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#3D2817]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Address Book
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Manage saved shipping addresses.</p>
                </div>
                {(!isAddingAddr && !editingAddrId) && (
                  <button 
                    onClick={() => setIsAddingAddr(true)}
                    className="flex items-center gap-1 bg-[#8B5A3C] hover:bg-[#6F4630] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New
                  </button>
                )}
              </div>

              {(isAddingAddr || editingAddrId !== null) ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4 max-w-md border border-gray-100 rounded-xl p-5">
                  <h3 className="font-bold text-sm text-[#3D2817]">
                    {editingAddrId ? 'Edit Address Card' : 'New Address Card'}
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                    <select 
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
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
                      placeholder="123 Luxury Lane"
                      value={newAddrLine}
                      onChange={e => setNewAddrLine(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#8B5A3C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Beverly Hills"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Zip Code</label>
                      <input 
                        type="text" 
                        required
                        placeholder="90210"
                        value={newZip}
                        onChange={e => setNewZip(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingAddr(false);
                        setEditingAddrId(null);
                        setNewAddrLine('');
                        setNewCity('');
                        setNewZip('');
                      }}
                      className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2 bg-[#8B5A3C] hover:bg-[#6F4630] text-white rounded-lg text-xs font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className="border border-gray-100 rounded-xl p-5 relative hover:border-gray-200 transition-all flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#3D2817] flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#8B5A3C]" /> {addr.label}
                        </h4>
                        <p className="text-xs text-gray-500 mt-2">{addr.addressLine}</p>
                        <p className="text-xs text-gray-500">{addr.city}, {addr.zipCode}</p>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 mt-4">
                        <button 
                          onClick={() => handleStartEdit(addr)}
                          className="text-[#8B5A3C] hover:text-[#6F4630] p-1.5 hover:bg-amber-50 rounded transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeAddress(addr.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#3D2817]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Loyalty & Rewards
                </h2>
                <p className="text-xs text-gray-500 mt-1">Unlock exclusive experiences with your points.</p>
              </div>

              {/* Progress Card */}
              <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-bold text-[#8B5A3C] uppercase tracking-widest">{user.tier}</span>
                  <h3 className="text-3xl font-extrabold text-[#3D2817]">{user.loyaltyPoints} Points</h3>
                  <p className="text-xs text-gray-500">You are 150 points away from Diamond status!</p>
                </div>
                
                {/* Visual points progress bar */}
                <div className="w-full md:w-64 space-y-2">
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#8B5A3C] h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>Gold (300)</span>
                    <span>Diamond (500)</span>
                  </div>
                </div>
              </div>

              {/* Active Coupons */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Active Coupons</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-dashed border-[#D4A574] bg-[#FDFBF7] rounded-xl p-5 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-[#8B5A3C]">15% OFF</span>
                      <h4 className="font-bold text-sm text-[#3D2817] mt-1">Lumière Birthday Reward</h4>
                      <code className="text-xs text-gray-500 block mt-2 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 w-fit">BDAY15OFF</code>
                    </div>
                    {appliedCoupons.includes('BDAY15OFF') ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 animate-pulse" /> Applied
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleApplyCoupon('BDAY15OFF')}
                        className="bg-[#8B5A3C] hover:bg-[#6F4630] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Apply
                      </button>
                    )}
                  </div>

                  <div className="border border-dashed border-gray-200 rounded-xl p-5 flex justify-between items-center opacity-65">
                    <div>
                      <span className="text-xs font-bold text-gray-500">FREE SHIPPING</span>
                      <h4 className="font-bold text-sm text-gray-700 mt-1">Silver Anniversary Reward</h4>
                      <code className="text-xs text-gray-400 block mt-2 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 w-fit">GOLDSHIP</code>
                    </div>
                    <span className="text-xs font-bold text-gray-500">Unlocked</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Modal Dialog for Tracking Order */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTrackingOrder(null)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setTrackingOrder(null)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8B5A3C]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#3D2817]">Track Shipment</h3>
                <p className="text-xs text-gray-400">Order ID: {trackingOrder.id}</p>
              </div>
            </div>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              <div className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-[#8B5A3C] border-4 border-white flex-shrink-0 z-10" />
                <div>
                  <h4 className="font-bold text-sm text-[#3D2817]">In Transit</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Carrier: {trackingOrder.carrier}</p>
                  <p className="text-xs text-gray-400">Tracking: {trackingOrder.trackingNo}</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-gray-200 border-4 border-white flex-shrink-0 z-10" />
                <div>
                  <h4 className="font-bold text-sm text-gray-400">Estimated Delivery</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{trackingOrder.estDelivery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for Invoice */}
      {viewingInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewingInvoiceOrder(null)} />
          <div className="relative bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingInvoiceOrder(null)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'Playfair Display, serif' }}>Lumière & Knit</h2>
              <p className="text-xs text-gray-400 mt-1">Receipt for Order {viewingInvoiceOrder.id}</p>
              <p className="text-xxs text-gray-400">Date: {viewingInvoiceOrder.date}</p>
            </div>

            <div className="py-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Items</span>
                <span className="text-[#3D2817] font-bold text-right max-w-xs">{viewingInvoiceOrder.items}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-50 pt-4">
                <span className="text-gray-500 font-medium">Delivery Address</span>
                <span className="text-gray-700 font-medium text-right">Saved Address</span>
              </div>
              <div className="flex justify-between text-base border-t border-gray-100 pt-4 font-bold">
                <span className="text-[#3D2817]">Total Paid</span>
                <span className="text-[#8B5A3C]">${viewingInvoiceOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#8B5A3C] hover:bg-[#6F4630] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Print / Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
