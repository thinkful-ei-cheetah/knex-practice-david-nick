'use strict';

const shoppingListService = {

  getAllItems(knex) {
    return knex
      .select('*')
      .from('shopping_list');
  },

  getItemsById(knex, id) {
    return knex
      .select('*')
      .from('shopping_list')
      .where('id', id)
      .first();
  },

  insertNewItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      });
  },
  updateItem(knex, id, newItemFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newItemFields);
  },
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .del();
  }

};


module.exports = shoppingListService;