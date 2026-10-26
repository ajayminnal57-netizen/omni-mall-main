import axios from 'axios';
export const fetchProducts = async () => {

// Reusable async function to fetch data
  try {
    const response = await axios.get('https://dummyjson.com/products');
    return response.data.products; // Return the data to the calling component
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Rethrow so the component can handle the error state
  }
};
