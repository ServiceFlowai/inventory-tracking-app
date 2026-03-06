import axios from 'axios';

export const fetchInventoryItems = async () => {
  try {
    const response = await axios.get('/api/inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

export const createInventoryItem = async (item) => {
  try {
    const response = await axios.post('/api/inventory', item);
    return response.data;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

export const updateInventoryItem = async (sku, item) => {
  try {
    const response = await axios.put(`/api/inventory/${sku}`, item);
    return response.data;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

export const deleteInventoryItem = async (sku) => {
  try {
    const response = await axios.delete(`/api/inventory/${sku}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};