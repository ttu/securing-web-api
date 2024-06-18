import { UserInfo } from './types';
import * as db from './db';
import * as cache from './cache';

const cacheWrapper = async <T>(cacheKey: string, getData: () => Promise<T>) => {
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return cached;
  }

  const data = await getData();
  cache.add(cacheKey, data);
  return data;
};

export const getUsers = async (): Promise<UserInfo[]> => {
  // const users = await db.getUsers();
  const users = await cacheWrapper('users', () => db.getUsers());
  return users;
};

export const getUser = async (id: number): Promise<UserInfo | undefined> => {
  // const user = await db.getUser(id);
  const user = await cacheWrapper(`user_${id}`, () => db.getUser(id));
  return user;
};

export const getUserWithoutCacheWrapper = async (id: number): Promise<UserInfo | undefined> => {
  const cacheKey = `user_${id}`;
  const cachedUser = cache.get<UserInfo>(cacheKey);
  if (cachedUser) {
    console.log('Cache hit');
    return cachedUser;
  }
  const user = await db.getUser(id);
  cache.add(cacheKey, user);
  return user;
};
