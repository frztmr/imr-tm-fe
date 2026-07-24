export type City = 'toronto' | 'vancouver' | 'calgary';

export type CustomerType = 'event' | 'online' | 'distributor';
  
export interface TransactionType {
  id: number;
  type: string;
  desc: string;
  detail: string;
}
 

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  address: string;
  contact: string;
}
  

export interface Transaction {
  id: string;
  type: TransactionType;
  productId: string;
  warehouseId: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  customerId?: string;
  quantity: number;
  unit: 'carton' | 'piece';
  poNumber: string;
  date: string;
  notes?: string;
}

export interface TransactionState {
  transaction: [
    {
      product_sku: string;
      product_name: string;
      product_code: number;
      container_number: string;
      expired_date: string;
      batch_code: string;
      qty: number;
      pack: number;
      remarks: string;
      matcode: number;
      cust_id: number;
    }
  ],
  warehouse: {
    po_number: string;
    cust_id: number;
    wh_id: number;
    location_id: number;
    wh_name: string
    trans_type_id: number;
    trans_type_name: string;
    invoice_id: string;
  };
  transferInventory: boolean;
  shouldReset: boolean;
}