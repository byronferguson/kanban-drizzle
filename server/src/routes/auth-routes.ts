import { Request, Response, Router } from 'express';
import { UserService } from '../services/user.service.js';
import { signToken, verifyPassword } from '../utils/auth.js';

const router = Router();

// POST /login - Login a user
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const [user] = await UserService.find({ username }, true);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const passwordIsValid = await verifyPassword(password, user.password!);

  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const token = signToken(user.username);
  return res.json({ token });
});

export default router;
