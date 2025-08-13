import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // The API router is scoped under the `/api` prefix.  All endpoint handlers
  // interact with the `storage` instance defined in storage.ts.  Since the
  // storage interface is asynchronous, each handler uses async/await and
  // forwards any errors to Express' error handling middleware.
  const router = express.Router();

  /**
   * GET /api/users
   * Returns a list of all users.  In a production system this endpoint
   * would likely be restricted to administrators.
   */
  router.get("/users", async (_req, res, next) => {
    try {
      const users = await storage.listUsers();
      res.json({ users });
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /api/users/:id
   * Fetch a single user by id.  Responds with 404 if the user is not found.
   */
  router.get("/users/:id", async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ user });
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /api/users/username/:username
   * Fetch a user by their username.  Responds with 404 if not found.
   */
  router.get("/users/username/:username", async (req, res, next) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ user });
    } catch (err) {
      next(err);
    }
  });

  /**
   * POST /api/users
   * Create a new user.  The request body must conform to the InsertUser
   * schema defined in shared/schema.ts.  Returns the newly created user.
   */
  router.post("/users", async (req, res, next) => {
    try {
      const parseResult = insertUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        // Flatten Zod validation errors into a simple array of messages
        const issues = parseResult.error.errors.map((e) => e.message);
        res.status(400).json({ message: "Invalid request body", issues });
        return;
      }
      const newUser = await storage.createUser(parseResult.data);
      res.status(201).json({ user: newUser });
    } catch (err) {
      next(err);
    }
  });

  /**
   * DELETE /api/users/:id
   * Remove a user by id.  Responds with 204 No Content if successful or
   * 404 Not Found if the user did not exist.  Note that in-memory storage
   * will not persist deletions across restarts.
   */
  router.delete("/users/:id", async (req, res, next) => {
    try {
      const userId = req.params.id;
      const removed = await storage.deleteUser(userId);
      if (!removed) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  // Mount the router under the /api prefix
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
