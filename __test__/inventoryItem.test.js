const fs = require('fs');
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
} = require('../src/inventoryItems.js');

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
      let mockData = [];
      
      fs.writeFileSync.mockImplementation((path, data) => {
        mockData = JSON.parse(data);
      });
      
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

      const newItem = {
        "name": "New Book",
        "priceInCents": 1999,
        "category": "New Category"
      };
      
      createItem(newItem);
      const items = mockData;
      expect(items.length).toEqual(1);
      expect(items[0].name).toEqual("New Book");
      expect(items[0].priceInCents).toEqual(1999);
    });
  });
  
  describe('viewItems', () => {
    it('should return all inventory items', () => {
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockItems));
      const items = viewItems();
      expect(items).toHaveLength(7);
    });
  });
  
  describe('viewItem', () => {
    it('should return details of a specific item', () => {
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockItems));
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
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockItems));
      const itemId = 'nonexistent-id';
      const item = viewItem(itemId);
      expect(item).toBeNull();
    });
  });
  
  describe('updateItem', () => {
    it('should update the quantity of an item and save it to the file', () => {
      let mockData = [
        {
          "id": "arbitrary-unique-id-1",
          "name": "Book of Positive Affirmations",
          "priceInCents": 1299,
          "category": "Affirmation Book",
        }
      ];
      
      fs.writeFileSync.mockImplementation((path, data) => {
        mockData = JSON.parse(data);
      });
      
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
      const itemId = 'arbitrary-unique-id-1';
      const updatedItem = updateItem(itemId, 5);
      const items = mockData;
      
      expect(updatedItem).toEqual({
        "id": itemId,
        "name": "Book of Positive Affirmations",
        "priceInCents": 5,
        "category": "Affirmation Book",
      });
      expect(items.find(item => item.id === itemId).priceInCents).toEqual(5);
    });
    
    it('should return null if the item is not found', () => {
      const itemId = 'nonexistent-id';
      const updatedItem = updateItem(itemId, 5);
      expect(updatedItem).toBeNull();
    });

  
  describe('deleteItem', () => {
    it('should delete an item and save the updated list to the file', () => {
      let mockData = [
        {
          "id": "arbitrary-unique-id-1",
          "name": "Book of Positive Affirmations",
          "priceInCents": 1299,
          "category": "Affirmation Book",
        }
      ];
      
      fs.writeFileSync.mockImplementation((path, data) => {
        mockData = JSON.parse(data);
      });
      
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

      const itemId = 'arbitrary-unique-id-1';
      const deletedItem = deleteItem(itemId);
      const items = mockData;
      
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
      JSON.stringify(mockItems, null, 2)
      );
    });
    
    it.only('should handle errors when saving to the file', () => {
      fs.writeFileSync.mockImplementationOnce(() => {
        throw new Error('File write error');
      });
      expect(() => saveItemsToFile(mockItems)).not.toThrow();
    });
  });
  
});
  