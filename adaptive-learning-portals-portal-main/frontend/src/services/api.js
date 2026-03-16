import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const topicsAPI = {
  getAll: () => axios.get(`${API}/topics`),
  getById: (id) => axios.get(`${API}/topics/${id}`),
};

export const questionsAPI = {
  getByTopic: (topicId, difficulty) => {
    const params = difficulty ? `?difficulty=${difficulty}` : '';
    return axios.get(`${API}/questions/${topicId}${params}`);
  },
  getAdaptive: (topicId, difficulty) => 
    axios.get(`${API}/questions/adaptive/${topicId}/${difficulty}`)
};

export const examAPI = {
  submit: (data) => axios.post(`${API}/exam/submit`, data, { headers: getAuthHeader() })
};

export const analysisAPI = {
  get: (attemptId) => axios.get(`${API}/analysis/${attemptId}`, { headers: getAuthHeader() })
};

export const dashboardAPI = {
  getStats: () => axios.get(`${API}/dashboard/stats`, { headers: getAuthHeader() })
};

export const adminAPI = {
  getAnalytics: () => axios.get(`${API}/admin/analytics`, { headers: getAuthHeader() }),
  createQuestion: (data) => axios.post(`${API}/questions`, data, { headers: getAuthHeader() })
};
