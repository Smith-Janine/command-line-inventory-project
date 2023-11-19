const fs = require('fs');
const { nanoid } = require('nanoid');

// Path to the JSON file
const dataFilePath = './data/inventoryItems.json';
const cartFilePath = './data/shoppingCart.json';

// Load existing inventory items from the JSON file
function loadItemsFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or there's an error reading, return an empty array
    return [];
  }
}

// Save inventory items to the JSON file
function saveItemsToFile(items) {
  const data = JSON.stringify(items, null, 2);
  fs.writeFileSync(dataFilePath, data, 'utf8');
}

// Load shopping cart from the JSON file
function loadCartFromFile() {
  try {
    const data = fs.readFileSync(cartFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or there's an error reading, return an empty object
    return {};
  }
}

// Save shopping cart to the JSON file
function saveCartToFile(cart) {
  const data = JSON.stringify(cart, null, 2);
  fs.writeFileSync(cartFilePath, data, 'utf8');
}

// In-memory data store
let inventoryItems = loadItemsFromFile();
let shoppingCart = loadCartFromFile();

// Function to generate a unique item ID using nanoid
function generateItemId() {
  return nanoid();
}

// Function to create an inventory item
function createItem(name, priceInCents, category) {
  const itemId = generateItemId();
  const item = { id: itemId, name, priceInCents, category };
  inventoryItems.push(item);
  saveItemsToFile(inventoryItems);
  return item;
}

// Function to view all inventory items
function viewItems() {
  return inventoryItems;
}

// Function to view details of one item
function viewItem(itemId) {
  return inventoryItems.find(item => item.id === itemId);
}

// Function to update an inventory item
function updateItem(id, newQuantity) {
  const itemToUpdate = inventoryItems.find(item => item.id === id);
  if (itemToUpdate) {
    itemToUpdate.inStock = newQuantity;
    saveItemsToFile(inventoryItems); // Save items after updating
    return itemToUpdate;
  } else {
    return null; // Item not found
  }
}

// Function to delete an inventory item
function deleteItem(id) {
  const index = inventoryItems.findIndex(item => item.id === id);
  if (index !== -1) {
    const deletedItem = inventoryItems.splice(index, 1)[0];
    saveItemsToFile(inventoryItems); // Save items after deleting
    return deletedItem;
  } else {
    return null; // Item not found
  }
}

// Function to add an item to the shopping cart
function addToCart(itemId, quantity) {
  const item = inventoryItems.find(item => item.id === itemId);
  if (item && item.inStock >= quantity) {
    if (!shoppingCart[itemId]) {
      shoppingCart[itemId] = { item, quantity };
    } else {
      shoppingCart[itemId].quantity += quantity;
    }
    saveCartToFile(shoppingCart); // Save cart after adding an item
    return shoppingCart[itemId];
  } else {
    return null; // Item not found or insufficient stock
  }
}

// Function to view the shopping cart
function viewCart() {
  return shoppingCart;
}

// Function to clear the shopping cart
function clearCart() {
  shoppingCart = {};
  saveCartToFile(shoppingCart); // Save an empty cart
}

// Exporting functions for use in the app
module.exports = {
  createItem,
  viewItems,
  viewItem,
  updateItem,
  deleteItem,
  addToCart,
  viewCart,
  clearCart,
};