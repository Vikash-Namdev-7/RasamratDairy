export const zones = [
  {
    id: "zone-1",
    name: "Nazdeek Area (0-1 km)",
    distance: "0-1 km",
    minOrderAmount: 100,
    deliveryFee: 0,
    active: true,
    description: "Farm-local fast delivery, minimum order ₹100."
  },
  {
    id: "zone-2",
    name: "Madhyam Doori (1-2 km)",
    distance: "1-2 km",
    minOrderAmount: 150,
    deliveryFee: 15,
    active: true,
    description: "City neighborhood delivery, minimum order ₹150."
  },
  {
    id: "zone-3",
    name: "Door Ke Gaon (2 km+)",
    distance: "2 km+",
    minOrderAmount: 200,
    deliveryFee: 25,
    active: true,
    description: "Extended regional delivery, minimum order ₹200."
  }
];

export const deliveryZones = zones;
export default zones;
