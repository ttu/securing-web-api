import { UserInfo } from './types';

const USERS: UserInfo[] = [
  { id: 1, name: 'Alice', age: 23 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 28 },
];

export const getUsers = async () => {
  // const users = await db.query("SELECT * FROM users");
  console.log('DB - Returning users from db');
  // Simulate slow query by sleeping for 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return Promise.resolve(USERS);
};

export const getUser = async (id: number) => {
  // const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  console.log('DB - Returning user from db');
  // Simulate slow query by sleeping for 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const user = USERS.find((user) => user.id === id);
  return Promise.resolve(user);
};
