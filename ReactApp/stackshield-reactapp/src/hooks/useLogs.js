import { useMutation } from 'react-query';
import axios from 'axios';

const postLogs = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post('http://localhost:8080/api/logs/analyzeFile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then(res => res.data);  // Important: return only res.data
};

export const useLogs = () => {
  return useMutation(postLogs);
};
