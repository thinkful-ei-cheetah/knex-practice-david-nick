'use strict';

require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});
console.log('connection successful');

function searchByProduceName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

searchByProduceName('Fish tricks');

function paginateItems(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log('PAGINATE ITEMS', { page });
      console.log(result);
    });
}

paginateItems(2);

function itemsAddedAfterDate(daysAgo) {
  knexInstance
    .select('id', 'name', 'date_added')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))

    .then(result => {
      console.log(result);
    });
}

itemsAddedAfterDate(9);


function pricePerCategory() {
  knexInstance
    .select('category')
    .sum('price AS total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result);
    });
}

pricePerCategory();