import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

// Storage interface for performing CRUD operations on users.  In addition to
// retrieving a user by id or username and creating a new user, implementations
// should be able to list all users and remove users.  Additional methods can
// be added here as your application grows.
export interface IStorage {
  /**
   * Lookup a user by their unique identifier.
   * @param id The user id
   */
  getUser(id: string): Promise<User | undefined>;

  /**
   * Lookup a user by their username.  Usernames are expected to be unique.
   * @param username The username to search for
   */
  getUserByUsername(username: string): Promise<User | undefined>;

  /**
   * Persist a new user and return the full User object.  The storage
   * implementation is responsible for generating a unique id.
   * @param user The user payload without an id
   */
  createUser(user: InsertUser): Promise<User>;

  /**
   * Return an array containing all users stored.  Useful for admin
   * operations or debugging.  Returns an empty array if no users are stored.
   */
  listUsers(): Promise<User[]>;

  /**
   * Remove a user from storage.  Returns true if the user existed and was
   * removed, false otherwise.
   * @param id The id of the user to delete
   */
  deleteUser(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  /**
   * Return all users as an array.  The order of users is not guaranteed.
   */
  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  /**
   * Delete a user by id.  Returns true if the user was removed.
   */
  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

export const storage = new MemStorage();
