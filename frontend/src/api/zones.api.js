import axiosClient from './axiosClient';

export const zonesApi = {
  getZones: (params) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return axiosClient.get(`/zones${queryString}`);
  }
};

export default zonesApi;
