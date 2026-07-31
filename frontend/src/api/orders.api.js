export const ordersApi = {
  createOrder: async (orderData) => {
    return {
      success: true,
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmed',
      ...orderData
    };
  }
};

export default ordersApi;
