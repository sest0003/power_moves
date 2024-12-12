const axios = require('axios');

async function fetchMemes() {
    try {
        const response = await axios.get('http://localhost:3000/products/all');
        const productData = response?.data?.data?.data?.slice(0, 20) || [];
        console.log('Memes data fetched successfully', productData);
		return productData;
    } catch (error) {
        console.log('Error fetching products:', error);
        return []; 
    }
}

module.exports = { fetchMemes };