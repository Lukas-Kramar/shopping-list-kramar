import axios from 'axios';

// Define the enableMocking function
export const getShoppingLists = async () => {
    try {
        const response = await axios.get('http://localhost:3000/shopping-lists');
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}

export const createShoppingList = async (newList) => {
    try {
        const response = await axios.post('http://localhost:3000/create-list', newList, {
            headers: {
                'Content-Type': 'application/json',
            },
        });


        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error creating shopping list:', error.message);
        throw error; // Rethrow the error
    }
};

export const updateShoppingList = async (updatedList) => {
    try {
        const response = await axios.post('http://localhost:3000/update-list', updatedList, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating shopping list:', error.message);
        throw error; // Rethrow the error
    }
};

export const deleteShoppingList = async (listId) => {
    try {
        const response = await axios.post('http://localhost:3000/delete-list', { listId }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting shopping list:', error.message);
        throw error; // Rethrow the error
    }
};