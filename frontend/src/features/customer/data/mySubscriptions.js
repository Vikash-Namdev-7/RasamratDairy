const getTomorrowStr = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const mySubscriptions = [
  {
    id: "sub-1",
    customerName: "Rekha Sharma",
    customerPhone: "+91 98260 12345",
    address: "123, Nayapura Main Road, Indore",
    milkTypeId: "milk-full-cream",
    milkTypeName: "Full Cream Doodh",
    litres: 1.5,
    slot: "morning",
    status: "active",
    pausedDates: [],
    startDate: "2026-07-01",
  },
  {
    id: "sub-2",
    customerName: "Suresh Patel",
    customerPhone: "+91 94250 67890",
    address: "45, Scheme No 54, Vijay Nagar, Indore",
    milkTypeId: "milk-toned",
    milkTypeName: "Toned Doodh",
    litres: 1,
    slot: "morning",
    status: "active",
    pausedDates: [],
    startDate: "2026-07-10",
  },
  {
    id: "sub-3",
    customerName: "Meena Verma",
    customerPhone: "+91 98930 11223",
    address: "Village Palasia, Main Chowk, Indore",
    milkTypeId: "milk-cow",
    milkTypeName: "Desi Gaay Ka Doodh",
    litres: 2,
    slot: "evening",
    status: "active",
    pausedDates: [],
    startDate: "2026-07-15",
  },
  {
    id: "sub-4",
    customerName: "Anil Kumar",
    customerPhone: "+91 97550 44332",
    address: "78, Tilak Nagar, Indore",
    milkTypeId: "milk-full-cream",
    milkTypeName: "Full Cream Doodh",
    litres: 1,
    slot: "evening",
    status: "paused",
    pausedDates: [],
    startDate: "2026-06-20",
  },
  {
    id: "sub-5",
    customerName: "Pooja Gupta",
    customerPhone: "+91 93000 88776",
    address: "12, Saket Nagar, Indore",
    milkTypeId: "milk-cow",
    milkTypeName: "Desi Gaay Ka Doodh",
    litres: 1,
    slot: "morning",
    status: "active",
    pausedDates: [getTomorrowStr()], // Dynamic Tomorrow Date Skipped
    startDate: "2026-07-05",
  }
];

export default mySubscriptions;
