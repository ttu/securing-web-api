import { UserInfo } from './types';
import * as db from './db';
import * as cache from '../../cache/cache';

export const getUsers = async (): Promise<UserInfo[]> => getUsersCache();

export const getUser = async (id: number): Promise<UserInfo | undefined> => getUserCache(id);

const getUsersNoCache = async (): Promise<UserInfo[]> => {
  const users = await db.getUsers();
  return users;
};

const getUserNoCache = async (id: number): Promise<UserInfo | undefined> => {
  const user = await db.getUser(id);
  return user;
};

const getUsersCache = async (): Promise<UserInfo[]> => {
  const users = await cacheWrapper('users', () => db.getUsers());
  return users;
};

const getUserCache = async (id: number): Promise<UserInfo | undefined> => {
  const user = await cacheWrapper(`user_${id}`, () => db.getUser(id));
  return user;
};

const getUsersWithoutCacheWrapper = async (): Promise<UserInfo[]> => {
  const cacheKey = `users`;
  const cachedUsers = await cache.get<UserInfo[]>(cacheKey);
  if (cachedUsers) {
    console.log('Cache hit');
    return cachedUsers;
  }
  const users = await db.getUsers();
  cache.add(cacheKey, users);
  return users;
};

const getUserWithoutCacheWrapper = async (id: number): Promise<UserInfo | undefined> => {
  const cacheKey = `user_${id}`;
  const cachedUser = await cache.get<UserInfo>(cacheKey);
  if (cachedUser) {
    console.log('Cache hit');
    return cachedUser;
  }
  const user = await db.getUser(id);
  cache.add(cacheKey, user);
  return user;
};

const cacheWrapper = async <T>(cacheKey: string, getData: () => Promise<T>) => {
  const cached = await cache.get<T>(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return cached;
  }

  const data = await getData();
  await cache.add(cacheKey, data);
  return data;
};
