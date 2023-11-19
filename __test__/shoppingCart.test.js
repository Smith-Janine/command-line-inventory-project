const fs = require('fs');
const shoppingCartModule = require('./data/shoppingCart');

const {
  addToCart,
  viewCart,
  clearCart,
} = require('../data/shoppingCart');

// Path to the JSON files
const dataFilePath = '../data/inventoryItems.json';
const cartFilePath = '../data/shoppingCart.json';

describe('Shopping Cart Functions', () => {
  // Real book items for testing
  const inventoryData = [
    {
      id: 'arbitrary-unique-id-1',
      name: 'Book of Positive Affirmations',
      priceInCents: 1299,
      category: 'Affirmation Book',
    },
    {
      id: 'arbitrary-unique-id-2',
      name: 'Mindful Cooking: Recipes for Joy',
      priceInCents: 1499,
      category: 'Recipe Book',
    },
    // Add more book items as needed
  ];

  beforeEach(() => {
    // Reset inventory and shopping cart data before each test
    fs.writeFileSync(dataFilePath, JSON.stringify(inventoryData, null, 2), 'utf8');
    fs.writeFileSync(cartFilePath, '{}', 'utf8');
  });

  test('Add to Cart - Valid Item', () => {
    const itemId = 'arbitrary-unique-id-1';
    const quantity = 3;
    const addedToCart = addToCart(itemId, quantity);

    expect(addedToCart).toEqual({
      item: inventoryData.find((item) => item.id === itemId),
      quantity,
    });

    const cartData = JSON.parse(fs.readFileSync(cartFilePath, 'utf8'));
    expect(cartData[itemId].quantity).toBe(quantity);
  });

  test('Add to Cart - Item Not Found', () => {
    const itemId = 'non-existent-id';
    const quantity = 3;
    const addedToCart = addToCart(itemId, quantity);

    expect(addedToCart).toBeNull();
  });

  

  // Clean up the data after all tests
  afterAll(() => {
    fs.unlinkSync(dataFilePath);
    fs.unlinkSync(cartFilePath);
  });
});