'use strict';

require('dotenv').config();
const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Shopping-List service object`, function () {
  let db;

  let testItems = [
    {
      id: 1,
      name: 'Fish tricks',
      price: '13.10', 
      category: 'Main',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      name: 'Not Dogs',
      price: '4.99',
      category: 'Snack',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      id: 3,
      name: 'Buffalo wings',
      price: '5.55',
      category: 'Snack',
      checked: false,
      date_added: new Date('2029-01-22T16:28:32.615Z')
    }        
  ];

  context(`Given 'shopping_list' has data`, () => {
    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL
      });
    });

    before(() => db('shopping_list').truncate());

    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });

    afterEach(() => db('shopping_list').truncate()); 

    after(() => db.destroy());

    it(`insertNewItem() inserts an item and resolves the item with an 'id'`, () => {
      const newItem = {
        id: 4,
        name: 'Test Item',
        price: '130.11',
        category: 'Main',
        checked: false,
        date_added: new Date('2029-01-22T16:28:32.615Z')
      };
      
      return ShoppingListService.insertNewItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 4,
            name: newItem.name,
            price: newItem.price,
            category: newItem.category,
            checked: false,
            date_added: newItem.date_added
          });
        });
    });
    
    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
        return ShoppingListService.getItemsById(db, thirdId)
          .then(actual => {
            expect(actual).to.eql({
              id: thirdId,
              name: thirdTestItem.name,
              price: thirdTestItem.price.toString(),
              category: thirdTestItem.category,
              checked: thirdTestItem.checked,
              date_added: thirdTestItem.date_added
            });
          });
    });

    it(`deleteArticle() removes an article by id from 'shopping_list' table`, () => {
      const itemId = 3;
      
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateArticle() updates an article from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'Update Test',
        price: '13.10',
        category: 'Main',
        checked: false,
        date_added: new Date('2029-01-22T16:28:32.615Z')
      }
      
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getItemsById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          })
        })
    })
  });
});