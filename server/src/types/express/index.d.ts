declare namespace Express {
  interface Request {
    user?: {
      username: string;
    };
  }
}

type ResponseError = {
  message: string;
};
