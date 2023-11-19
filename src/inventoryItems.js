const { nanoid } = require('nanoid');
const { resolve } = require('path');

const fs = require('fs');
const filePath = './data/inventoryItems.json';

// Repository layer functions

// Data Access Layer functions
const getItems = () => getItemsFromFile();
const getItem = (id) => { 
    const item = getItems().find((item) => item.id === id);
    return item || null;
};
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
        items[index].priceInCents = newQuantity;
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

const getItemsFromFile = () => {
    try {
       const data = fs.readFileSync(filePath, 'utf8');
       const items = JSON.parse(data);
       console.log('Items from file:', items);
       return items;
    } catch (error) {
       // If the file doesn't exist or there's an error reading, return an empty array
       return [];
    }
 };
 


function saveItemsToFile(items) {
    try{
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    }catch(error){
        console.log("Unable to write to the file system.")
    }
 }

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