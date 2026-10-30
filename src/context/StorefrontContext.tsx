import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Address {
  id: string;
  label: string;
  addressLine: string;
  city: string;
  zipCode: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  tier: string;
}

interface StorefrontContextType {
  user: User | null;
  isLoggedIn: boolean;
  activeAddress: string;
  savedAddresses: Address[];
  isAddressDrawerOpen: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string) => Promise<boolean>;
  setActiveAddress: (address: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  editAddress: (id: string, address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setIsAddressDrawerOpen: (isOpen: boolean) => void;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(undefined);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeAddress, setActiveAddressState] = useState<string>('Select Address');
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    { id: '1', label: 'Home', addressLine: '123 Luxury Lane', city: 'Beverly Hills', zipCode: '90210' },
    { id: '2', label: 'Work', addressLine: '456 Business Blvd Suite 100', city: 'Los Angeles', zipCode: '90001' }
  ]);

  // Load from local storage on mount (optional but nice)
  useEffect(() => {
    const savedUser = localStorage.getItem('storefront_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedAddr = localStorage.getItem('storefront_active_address');
    if (savedAddr) {
      setActiveAddressState(savedAddr);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Simulating API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          name: 'Jane Doe',
          email: email,
          phone: '+1 (555) 123-4567',
          loyaltyPoints: 350,
          tier: 'Gold Member'
        };
        setUser(mockUser);
        localStorage.setItem('storefront_user', JSON.stringify(mockUser));
        resolve(true);
      }, 500);
    });
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          name,
          email,
          phone,
          loyaltyPoints: 100, // Welcome points
          tier: 'Silver Member'
        };
        setUser(mockUser);
        localStorage.setItem('storefront_user', JSON.stringify(mockUser));
        resolve(true);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('storefront_user');
  };

  const setActiveAddress = (address: string) => {
    setActiveAddressState(address);
    localStorage.setItem('storefront_active_address', address);
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = { ...address, id: Math.random().toString() };
    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
  };

  const editAddress = (id: string, address: Omit<Address, 'id'>) => {
    const updated = savedAddresses.map(a => a.id === id ? { ...address, id } : a);
    setSavedAddresses(updated);
  };

  const removeAddress = (id: string) => {
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
  };

  return (
    <StorefrontContext.Provider value={{
      user,
      isLoggedIn: !!user,
      activeAddress,
      savedAddresses,
      isAddressDrawerOpen,
      login,
      logout,
      register,
      setActiveAddress,
      addAddress,
      editAddress,
      removeAddress,
      setIsAddressDrawerOpen
    }}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used within a StorefrontProvider');
  }
  return context;
}
