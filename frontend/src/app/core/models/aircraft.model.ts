export interface Aircraft {
  id: number;
  aircraftId: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  yearManufactured: number;
  totalFlightHours: number;
  status: string;
  airline: string;
  lastMaintenance: string;
  createdAt: string;
}
