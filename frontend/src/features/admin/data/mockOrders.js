export const mockOrders = [
  {
    id: "ORD-1082",
    customerName: "Rekha Sharma",
    customerPhone: "+91 98260 12345",
    address: "123, Nayapura Main Road, Indore",
    items: [
      { name: "Full Cream Doodh", qty: 2, price: 32 },
      { name: "Taaza Dahi", qty: 1, price: 28 }
    ],
    subtotal: 92,
    deliveryFee: 0,
    totalPayable: 92,
    zone: "Nazdeek Area (0-1 km)",
    status: "pending",
    deliveryTime: null,
    rejectReason: null,
    placedAt: "2026-07-31T08:12:00"
  },
  {
    id: "ORD-1081",
    customerName: "Suresh Patel",
    customerPhone: "+91 94250 67890",
    address: "45, Scheme No 54, Vijay Nagar, Indore",
    items: [
      { name: "Shuddh Desi Ghee (500ml)", qty: 1, price: 340 },
      { name: "Taaza Paneer (250g)", qty: 1, price: 90 }
    ],
    subtotal: 430,
    deliveryFee: 15,
    totalPayable: 445,
    zone: "Madhyam Doori (1-2 km)",
    status: "accepted",
    deliveryTime: "45 minutes me",
    rejectReason: null,
    placedAt: "2026-07-31T07:50:00"
  },
  {
    id: "ORD-1080",
    customerName: "Meena Verma",
    customerPhone: "+91 98930 11223",
    address: "Village Palasia, Main Chowk, Indore",
    items: [
      { name: "Toned Doodh", qty: 4, price: 26 },
      { name: "Fresh Makhan (100g)", qty: 2, price: 55 }
    ],
    subtotal: 214,
    deliveryFee: 25,
    totalPayable: 239,
    zone: "Door Ke Gaon (2 km+)",
    status: "out-for-delivery",
    deliveryTime: "6:30 PM tak",
    rejectReason: null,
    placedAt: "2026-07-30T18:20:00"
  },
  {
    id: "ORD-1079",
    customerName: "Anil Kumar",
    customerPhone: "+91 97550 44332",
    address: "78, Tilak Nagar, Indore",
    items: [
      { name: "Full Cream Doodh", qty: 1, price: 32 }
    ],
    subtotal: 32,
    deliveryFee: 0,
    totalPayable: 32,
    zone: "Nazdeek Area (0-1 km)",
    status: "rejected",
    deliveryTime: null,
    rejectReason: "Delivery Area Se Bahar",
    placedAt: "2026-07-30T09:05:00"
  },
  {
    id: "ORD-1078",
    customerName: "Pooja Gupta",
    customerPhone: "+91 93000 88776",
    address: "12, Saket Nagar, Indore",
    items: [
      { name: "Taaza Dahi (500g)", qty: 2, price: 50 },
      { name: "Full Cream Doodh", qty: 2, price: 32 }
    ],
    subtotal: 164,
    deliveryFee: 15,
    totalPayable: 179,
    zone: "Madhyam Doori (1-2 km)",
    status: "delivered",
    deliveryTime: "Delivered at 09:30 AM",
    rejectReason: null,
    placedAt: "2026-07-30T08:15:00"
  },
  {
    id: "ORD-1077",
    customerName: "Vikram Singh",
    customerPhone: "+91 98270 55443",
    address: "89, Old Palasia, Indore",
    items: [
      { name: "Desi Gaay Ka Doodh", qty: 2, price: 35 }
    ],
    subtotal: 70,
    deliveryFee: 0,
    totalPayable: 70,
    zone: "Nazdeek Area (0-1 km)",
    status: "pending",
    deliveryTime: null,
    rejectReason: null,
    placedAt: "2026-07-30T07:30:00"
  }
];

export default mockOrders;
