import { useEffect, useLayoutEffect, useState } from 'react';

import { deleteTicket, retrieveTickets } from '../api/ticketAPI';
import Swimlane from '../components/Swimlane';
import { ApiMessage } from '../interfaces/ApiMessage';
import { TicketData } from '../interfaces/TicketData';
import ErrorPage from './ErrorPage';

import auth from '../utils/auth';

const boardStates = ['todo', 'in-progress', 'done'];

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    }
  };

  const deleteIndvTicket = async (ticketId: number): Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (loginCheck) {
      fetchTickets();
    }
  }, [loginCheck]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      {!loginCheck ? (
        <div className="login-notice">
          <h1>Login to create & view tickets</h1>
        </div>
      ) : (
        <div className="board">
          <div className="board-display">
            {boardStates.map((status) => {
              const filteredTickets = tickets.filter(
                (ticket) => ticket.status === status,
              );
              return (
                <Swimlane
                  title={status.toUpperCase()}
                  key={status}
                  tickets={filteredTickets}
                  deleteTicket={deleteIndvTicket}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Board;