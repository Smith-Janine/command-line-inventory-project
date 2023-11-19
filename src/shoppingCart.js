const fs = require('fs');
const { resolve } = require('path');

const cartFilePath = resolve(__dirname, './data/shoppingCart.json');
   
   const getCartFromFile = () => {
    try {
       const data = fs.readFileSync(cartFilePath, 'utf8');
       return JSON.parse(data);
    } catch (error) {
       // If the file doesn't exist or there's an error reading, return an empty object
       return {};
    }
   };
   
   const saveCartToFile = (cart) => {
    const data = JSON.stringify(cart, null, 2);
    fs.writeFileSync(cartFilePath, data, 'utf8');
   };
   
const getCart = () => getCartFromFile();
const addToCart = (itemId, quantity) => {
 const cart = getCart();
 const item = getItem(itemId);

 if (!cart[itemId]) {
    cart[itemId] = { item, quantity };
 } else {
    cart[itemId].quantity += quantity;
 }

 saveCartToFile(cart);
 return cart[itemId];
};

const clearCart = () => {
 saveCartToFile({});
};



module.exports = {
    getCart,
    addToCart,
    clearCart,
   };