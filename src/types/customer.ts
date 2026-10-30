import { IShippingAddress } from './order';

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: IShippingAddress[];
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}
