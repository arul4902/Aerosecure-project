export interface SparePart {
  id: number;
  partId: string;
  name: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  supplier: string;
  unitPrice: number;
  status: string;
  compatibleAircraft: string;
  lastOrdered: string;
  createdAt: string;
}
