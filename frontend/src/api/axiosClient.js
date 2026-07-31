// Native Fetch API Client with Axios-compatible interface
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (endpoint = '', customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  // Leak-proof Token Selector: Admin Token for Admin routes, Customer Token for Customer routes
  const isAdminEndpoint =
    endpoint.startsWith('/auth/admin') ||
    endpoint.startsWith('/admin') ||
    endpoint.includes('/api/auth/admin') ||
    endpoint.includes('/api/admin');

  if (isAdminEndpoint) {
    const adminToken = localStorage.getItem('rasamrat-admin-token');
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
  } else {
    const customerToken = localStorage.getItem('rasamrat-customer-token');
    if (customerToken) {
      headers['Authorization'] = `Bearer ${customerToken}`;
    }
  }
  return headers;
};

const request = async (method, endpoint, body = null, customHeaders = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: getHeaders(endpoint, customHeaders)
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.response = {
      status: response.status,
      data
    };
    throw error;
  }

  return { data, status: response.status };
};

export const axiosClient = {
  get: (endpoint, headers) => request('GET', endpoint, null, headers),
  post: (endpoint, body, headers) => request('POST', endpoint, body, headers),
  put: (endpoint, body, headers) => request('PUT', endpoint, body, headers),
  delete: (endpoint, headers) => request('DELETE', endpoint, null, headers)
};

export default axiosClient;
