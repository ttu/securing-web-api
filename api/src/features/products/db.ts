import { Product, ProductPrice } from './types';
import pool from '../../db';
import { sleep } from '../../utils';

export const getProducts = async (): Promise<Product[]> => {
  console.log('DB - Querying products with slow query');
  await sleep();

  const res = await pool.query('SELECT * FROM products');
  const products: Product[] = res.rows.map((row) => ({
    id: row.id,
    name: row.name,
    manufacturer: row.manufacturer,
  }));
  return products;
};

export const getPrices = async (): Promise<ProductPrice[]> => {
  console.log('DB - Querying prices with slow query');
  await sleep();

  const res = await pool.query('SELECT * FROM product_prices');
  const productPrices: ProductPrice[] = res.rows.map((row) => ({
    productId: row.productid,
    price: row.price,
    country: row.country,
    startDate: row.startdate,
  }));
  return productPrices;
};

export const insertPrices = async (prices: ProductPrice[]): Promise<boolean> => {
  console.log('DB - Insert new prices with slow query');
  // await sleep(2000);

  try {
    await pool.query('BEGIN'); // Start a transaction

    // Construct placeholders for the SQL query
    const placeholders = prices
      .map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`)
      .join(', ');

    // SQL query for inserting multiple rows
    const queryText = `
      INSERT INTO product_prices (productId, price, country, startDate)
      VALUES ${placeholders}
    `;

    // Flatten the prices array into a single array of parameters
    const queryParams = prices.flatMap((price) => [price.productId, price.price, price.country, price.startDate]);

    const res = await pool.query(queryText, queryParams);

    await pool.query('COMMIT');
    console.log(`Inserted ${res.rowCount} new rows into product_prices table.`);
    return true;
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error inserting prices:', error);
    return false;
  }
};
