import type { NextFunction, Request, Response } from 'express'

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(public readonly fields: Record<string, string[] | undefined>) {
    super(400, 'Validation failed')
    this.name = 'ValidationError'
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message, fields: err.fields })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  if (err instanceof Error) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
    return
  }

  res.status(500).json({ error: 'Internal server error' })
}


