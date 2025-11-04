import apiClient from './apiClient';

export const aiApi = {
  transcribeVideo: (formData) => apiClient.post('/api/v1/ai/transcribe', formData),
  suggest: (formData) => apiClient.post('/api/v1/ai/suggest', formData),
};

export default aiApi;
