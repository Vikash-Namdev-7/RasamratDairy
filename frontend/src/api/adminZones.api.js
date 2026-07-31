import axiosClient from './axiosClient';

export const adminZonesApi = {
  getZones: () => axiosClient.get('/admin/zones?includeInactive=true'),
  createZone: (data) => axiosClient.post('/admin/zones', data),
  updateZone: (id, data) => axiosClient.put(`/admin/zones/${id}`, data),
  deleteZone: (id) => axiosClient.delete(`/admin/zones/${id}`)
};

export default adminZonesApi;
