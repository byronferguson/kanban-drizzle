import { Request, RequestHandler, Response, Router } from 'express';
import { NewTicket, Ticket, TicketUpdate } from '../../db/schema.js';
import { TicketService } from '../../services/ticket.service.js';

const router = Router();

// // GET /tickets - Get all tickets
router.get('/', async function (_req: Request, res: Response) {
  try {
    const tickets = await TicketService.find();

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}) as RequestHandler<{}, Ticket[] | ResponseError, {}>;

// GET /tickets/:id - Get a ticket by id
router.get('/:id', async function (req, res) {
  try {
    const ticket = await TicketService.findById(+req.params.id);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{ id: number }, Ticket | ResponseError, {}>);

// POST /tickets - Create a new ticket
router.post('/', async function (req, res) {
  try {
    const newTicket = await TicketService.create(req.body);

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{}, Ticket | ResponseError, NewTicket>);

// PUT /tickets/:id - Update a ticket by id
router.put('/:id', async function (req, res) {
  try {
    const { username, ...ticket } = req.body;

    const updatedTicket = await TicketService.update(req.params.id, ticket);

    if (!updatedTicket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<
  { id: number },
  Ticket | ResponseError,
  TicketUpdate & { username: string } // username is not part of the TicketUpdate type
>);

// DELETE /tickets/:id - Delete a ticket by id
router.delete('/:id', async function (req, res) {
  try {
    const ticket = await TicketService.destroy(req.params.id);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
} as RequestHandler<{ id: number }, Ticket | ResponseError, {}>);

export { router as ticketRouter };
