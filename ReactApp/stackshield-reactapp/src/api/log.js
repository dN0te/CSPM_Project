// src/api/logs.js
import axios from 'axios';

export const postLogs = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post('http://localhost:8080/api/logs/analyzeFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
