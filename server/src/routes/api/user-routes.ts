import { RequestHandler, Router } from 'express';
import { NewUser, User } from '../../db/schema.js';
import { UserService } from '../../services/user.service.js';

const router = Router();

// GET /users - Get all users
router.get('/', async function (_req, res) {
  try {
    const users = await UserService.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{}, User[] | ResponseError, {}>);

// POST /users - Create a new user
router.post('/', async function (req, res) {
  try {
    const newUser = await UserService.create(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{}, User | ResponseError, NewUser>);

// GET /users/:id - Get a user by id
router.get('/:id', async function (req, res) {
  try {
    const user = await UserService.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{ id: number }, User | ResponseError, {}>);

// PUT /users/:id - Update a user by id
router.put('/:id', async function (req, res) {
  try {
    const user = await UserService.update(req.params.id, req.body);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{ id: number }, User | ResponseError, {}>);

// DELETE /users/:id - Delete a user by id
router.delete('/:id', async function (req, res) {
  try {
    const user = await UserService.destroy(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{ id: number }, { message: string } | ResponseError, {}>);

export { router as userRouter };
