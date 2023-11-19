const fs = require('fs');
 const { nanoid } = require('nanoid');
// const { resolve } = require('path');
const {
  getItems,
  getItem,
  createItem,
  viewItems,
  viewItem,
  updateItem,
  deleteItem,
  getItemsFromFile,
  saveItemsToFile,
} = require('../src/inventoryItems');

jest.mock('fs');

describe('Inventory Items Functions', () => {
  const mockItems = [
    {
      "id": "arbitrary-unique-id-1",
      "name": "Book of Positive Affirmations",
      "priceInCents": 1299,
      "category": "Affirmation Book"
    },
    {
      "id": "arbitrary-unique-id-2",
      "name": "Mindful Cooking: Recipes for Joy",
      "priceInCents": 1499,
      "category": "Recipe Book"
    },
    {
      "id": "arbitrary-unique-id-3",
      "name": "Gratitude Journal",
      "priceInCents": 999,
      "category": "Journal Book"
    },
    {
      "id": "arbitrary-unique-id-4",
      "name": "You Got This!",
      "priceInCents": 1199,
      "category": "Self-Help Book"
    },
    {
      "id": "arbitrary-unique-id-5",
      "name": "Cookbook Tips, Trick and Techniques",
      "priceInCents": 1699,
      "category": "Recipe Book"
    },
    {
      "id": "arbitrary-unique-id-6",
      "name": "Reflections Journal",
      "priceInCents": 899,
      "category": " Travel Journal Book"
    },
    {
      "id": "arbitrary-unique-id-7",
      "name": "Mind Body Connection",
      "priceInCents": 1399,
      "type": "Mindfulness Book"
    }
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getItems', () => {
    it('should return an empty array initially', () => {
      fs.readFileSync.mockReturnValueOnce('[]');
      const items = getItems();
      expect(items).toEqual([]);
    });

    it('should return items after adding items', () => {
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockItems));
      const items = getItems();
      expect(items).toEqual(mockItems);
    });
  });

  describe('getItem', () => {
    it('should return null for non-existing item', () => {
      fs.readFileSync.mockReturnValueOnce('[]');
      const item = getItem('non-existing-id');
      expect(item).toBeNull();
    });

    it('should return the correct item after adding it', () => {
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockItems));
      const item = getItem(mockItems[0].id);
      expect(item).toEqual(mockItems[0]);
    });
  });

  describe('createItem', () => {
    it('should add a new item to the inventory', () => {
      fs.readFileSync.mockReturnValueOnce('[]');
      fs.writeFileSync.mockImplementationOnce(() => {});
      const newItem = {
        "name": "New Book",
        "priceInCents": 1999,
        "category": "New Category"
      };

      createItem(newItem);
      const items = getItems();
      expect(items).toEqual([...mockItems, { ...newItem, id: expect.any(String) }]);
    });

    it('should generate a unique ID for the new item', () => {
      fs.readFileSync.mockReturnValueOnce('[]');
      fs.writeFileSync.mockImplementationOnce(() => {});
      const newItem = {
        "name": "New Book",
        "priceInCents": 1999,
        "category": "New Category"
      };

      createItem(newItem);
      const items = getItems();
      expect(items[0].id).toBeDefined();
    });
  });

  describe('viewItems', () => {
    it('should return all inventory items', () => {
      const items = viewItems();
      expect(items).toHaveLength(7);
    });
  });

  describe('viewItem', () => {
    it('should return details of a specific item', () => {
      const itemId = 'arbitrary-unique-id-1';
      const item = viewItem(itemId);
      expect(item).toEqual({
        "id": itemId,
        "name": "Book of Positive Affirmations",
        "priceInCents": 1299,
        "category": "Affirmation Book",
      });
    });

    it('should return null if the item is not found', () => {
      const itemId = 'nonexistent-id';
      const item = viewItem(itemId);
      expect(item).toBeNull();
    });
  });

  describe('updateItem', () => {
    it('should update the quantity of an item and save it to the file', () => {
      const itemId = 'arbitrary-unique-id-1';
      const updatedItem = updateItem(itemId, 5);
      const items = viewItems();

      expect(updatedItem).toEqual({
        "id": itemId,
        "name": "Book of Positive Affirmations",
        "priceInCents": 1299,
        "category": "Affirmation Book",
      });
      expect(items.find(item => item.id === itemId).inStock).toEqual(5);
    });

    it('should return null if the item is not found', () => {
      const itemId = 'nonexistent-id';
      const updatedItem = updateItem(itemId, 5);
      expect(updatedItem).toBeNull();
    });
  });

  describe('deleteItem', () => {
    it('should delete an item and save the updated list to the file', () => {
      const itemId = 'arbitrary-unique-id-1';
      const deletedItem = deleteItem(itemId);
      const items = viewItems();

      expect(deletedItem).toEqual({
        "id": itemId,
        "name": "Book of Positive Affirmations",
        "priceInCents": 1299,
        "category": "Affirmation Book",
      });
      expect(items.find(item => item.id === itemId)).toBeUndefined();
    });

    it('should return null if the item is not found', () => {
      const itemId = 'nonexistent-id';
      const deletedItem = deleteItem(itemId);
      expect(deletedItem).toBeNull();
    });
  });
});
  describe('getItemsFromFile', () => {
    it('should return an empty array if the file is empty', () => {
      fs.readFileSync.mockReturnValueOnce('[]');
      const items = getItemsFromFile();
      expect(items).toEqual([]);
    });

    it('should return items from the file', () => {
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockItems));
      const items = getItemsFromFile();
      expect(items).toEqual(mockItems);
    });

    it('should return an empty array if there is an error reading the file', () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error('File read error');
      });
      const items = getItemsFromFile();
      expect(items).toEqual([]);
    });
  });

  describe('saveItemsToFile', () => {
    it('should save items to the file', () => {
      fs.writeFileSync.mockImplementationOnce(() => {});
      saveItemsToFile(mockItems);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(mockItems, null, 2),
        'utf8'
      );
    });

    it('should handle errors when saving to the file', () => {
      fs.writeFileSync.mockImplementationOnce(() => {
        throw new Error('File write error');
      });
      expect(() => saveItemsToFile(mockItems)).not.toThrow();
    });
  });

















// const {
//   getItems,
//   getItem,
//   createItem,
//  } = require('../src/inventoryItems');

// const fs = require('fs');
// const { resolve } = require('path');

// const dataFilePath = resolve(__dirname, '../data/inventoryItems.json');

// // Repository layer function
// const getItemsFromFile = () => {
//   try {
//     const data = fs.readFileSync(dataFilePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     // If the file doesn't exist or there's an error reading, return an empty array
//     return [];
//   }
// };

// describe('getItemsFromFile', () => {
//   // Test case 1: When the file exists
//   test('should return an array of items when the file exists', () => {
//     // Prepare a sample content for the file
//     const sampleContent = JSON.stringify([
//       { id: 'arbitrary-unique-id-1', name: 'Book of Positive Affirmations', priceInCents: 1299, category: 'Affirmation Book' },
//     ]);

//     // Mock fs.readFileSync to return the sample content
//     jest.spyOn(fs, 'readFileSync').mockReturnValue(sampleContent);

//     // Call the function
//     const result = getItemsFromFile();

//     // Assert the result
//     expect(result).toEqual([
//       { id: 'arbitrary-unique-id-1', name: 'Book of Positive Affirmations', priceInCents: 1299, category: 'Affirmation Book' },
//     ]);

//     // Restore the original function to avoid side effects in other tests
//     jest.restoreAllMocks();
//   });

//   // Test case 2: When the file doesn't exist
//   test('should return an empty array when the file does not exist', () => {
//     // Mock fs.readFileSync to throw an error (simulating the file not existing)
//     jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
//       throw new Error('File not found');
//     });

//     // Call the function
//     const result = getItemsFromFile();

//     // Assert the result
//     expect(result).toEqual([]);

//     // Restore the original function to avoid side effects in other tests
//     jest.restoreAllMocks();
//   });
// });










// const { 
//   createItem,
//   viewItems,
//   viewItem,
//   updateItem,
//   deleteItem,
//   addToCart,
//   viewCart,
//   clearCart,
// } = require('../index');

   
// const fs = require('fs');
// const inventoryItems = require('../data/inventoryItems');
// const { nanoid } = require('nanoid');
// const uuid =  nanoid();

// describe('createPurchase', () => {
//   it('should create a new purchase', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//       createPurchase(uuid, 'test purchase', 100);
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('New purchase created: test purchase'));
//   });
// });

// describe('indexOfPurchases', () => {
//   it('should return an index of all purchases', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//      indexOfPurchases();
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Index of all purchases:'));
//   });
// });

// describe('showPurchase', () => {
//   it('should show the details of a specific purchase', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//       showPurchase(uuid);
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Purchase details for ID: ${uuid}`));
//   });
// });

// describe('showPurchase', () => {
//   it('should fail to show the details of a specific purchase', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//       showPurchase("1234344343fsdaf");
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No purchase found with that ID.'));
//   });
// });

// describe('updatePurchase', () => {
//   it('should update the details of a specific purchase', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//       updatePurchase(uuid, 'updated purchase', 200);
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Purchase details updated for ID: ${uuid}`));
//   });
// });

// describe('updatePurchase', () => {
//   it('should fail update the details of a specific purchase', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//       updatePurchase('Not a vallid Id', 'updated purchase', 200);
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No purchase found with that ID.'));
//   });
// });

// describe('deletePurchase', () => {
//   it('should delete a specific purchase', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//       const data = [
//           {
//               "id": uuid,
//               "name": "Item 2",
//               "amount": 200,
//               "donation": 24
//             },
//             {
//               "id": "QX0lcuOCr5ahlqT2KWJf8",
//               "name": "test purchase",
//               "amount": 100,
//               "donation": 0.2
//             },
//       ];
//       deletePurchase(uuid, []);
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Purchase deleted for ID: ${uuid}`));
//   });
// });

// describe('totalDonation', () => {
//   it('should calculate the total donation', () => {
//       const consoleSpy = jest.spyOn(console, 'log');
//      const total = totalDonation();
//       expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Total amount of money for donation: $${total.toFixed(2)}`));
//   });
// });

