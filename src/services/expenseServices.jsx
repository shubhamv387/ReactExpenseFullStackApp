import axios from 'axios';
const baseUrl = import.meta.env.VITE_FIREBASE_DB_LINK;

export const addExpense = async (expense) => {
  return axios.post(`${baseUrl}/expenses.json`, expense);
};

export const getExpenses = () => {
  return axios.get(`${baseUrl}/expenses.json`);
};

export const updateExpense = (id, expense) => {
  return axios.put(`${baseUrl}/expenses/${id}.json`, expense);
};

export const deleteExpense = (name) => {
  return axios.delete(`${baseUrl}/expenses/${name}.json`);
};
