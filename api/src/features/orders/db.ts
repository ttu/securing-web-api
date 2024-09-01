import { Order, StoredOrder } from './types';
import pool from '../../db';

export const getOrders = async (customerId: number): Promise<StoredOrder[]> => {
  const res = await pool.query(
    `SELECT o.id as order_id, o.total, o.address, o.customerId, o.orderDate,
        p.id as product_id, p.name, p.price, oop.quantity
    FROM orders o
    JOIN order_order_products oop ON o.id = oop.orderId
    JOIN order_products p ON oop.productId = p.id
    WHERE o.customerId = $1`,
    [customerId]
  );

  const orders = res.rows.reduce<StoredOrder[]>((acc, row) => {
    let order = acc.find((o) => o.id === row.order_id);

    if (!order) {
      order = {
        id: row.order_id,
        total: row.total,
        address: row.address,
        customerId: row.customerid,
        orderDate: row.orderdate,
        products: [],
      };
      acc.push(order);
    }

    order.products.push({
      id: row.product_id,
      name: row.name,
      price: row.price,
      quantity: row.quantity,
    });

    return acc;
  }, []);

  return orders;
};

export const createCustomerOrder = async (customerId: number, order: Order) => {
  try {
    await pool.query('BEGIN');

    const res = await pool.query(
      `INSERT INTO orders (total, address, customerId)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [order.total, order.address, customerId]
    );

    const orderId = res.rows[0].id;

    for (const product of order.products) {
      await pool.query(
        `INSERT INTO order_order_products (orderId, productId, quantity)
         VALUES ($1, $2, $3)`,
        [orderId, product.id, product.quantity]
      );
    }

    await pool.query('COMMIT');
    return true;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
};

export const getProductAndPrice = async (productId: number): Promise<[string, number]> => {
  const res = await pool.query(
    `SELECT name, price
     FROM order_products
     WHERE id = $1`,
    [productId]
  );

  if (res.rows.length === 0) {
    throw new Error('Product not found');
  }

  return [res.rows[0].name, res.rows[0].price];
};
