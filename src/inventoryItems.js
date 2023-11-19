const fs = require('fs');
const nanoid = require('nanoid');
const { resolve } = require('path');

const dataFilePath = resolve(__dirname, './data/inventoryItems.json');

// Repository layer functions
const getItemsFromFile = () => {
    try {
       const data = fs.readFileSync(dataFilePath, 'utf8');
       return JSON.parse(data);
    } catch (error) {
       // If the file doesn't exist or there's an error reading, return an empty array
       return [];
    }
   };
   
   const saveItemsToFile = (items) => {
    const data = JSON.stringify(items, null, 2);
    fs.writeFileSync(dataFilePath, data, 'utf8');
   };
   
   // Data Access Layer functions
const getItems = () => getItemsFromFile();
const getItem = (id) => getItems().find((item) => item.id === id);
const createItem = (item) => {
const items = getItems();
 item.id = nanoid();
 items.push(item);
 saveItemsToFile(items);
};

// Data Access Layer functions
const viewItems = () => getItemsFromFile();

const viewItem = (itemId) => {
  const items = getItemsFromFile();
  return items.find(item => item.id === itemId) || null;
};

const updateItem = (itemId, newQuantity) => {
  const items = getItemsFromFile();
  const index = items.findIndex(item => item.id === itemId);

  if (index !== -1) {
    items[index].inStock = newQuantity;
    saveItemsToFile(items);
    return items[index];
  } else {
    return null;
  }
};
const deleteItem = (itemId) => {
  const items = getItemsFromFile();
  const index = items.findIndex(item => item.id === itemId);

  if (index !== -1) {
    const deletedItem = items.splice(index, 1)[0];
    saveItemsToFile(items);
    return deletedItem;
  } else {
    return null;
  }
};


module.exports = {
    getItems,
    getItem,
    createItem,
    viewItems,
    viewItem,
    updateItem,
    deleteItem,
    getItemsFromFile,
    saveItemsToFile,
};