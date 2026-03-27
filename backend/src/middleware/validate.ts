import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
import { ValidationError } from './errorHandler';

type Target = 'body' | 'params' | 'query';

export function validate(schema: ZodType, target: Target = 'body') {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target])

        if (!result.success) {
            const fields = result.error.flatten(issue => issue.message).fieldErrors;
            next(new ValidationError(fields));
            return;
        }

        if (target !== 'query') {
            req[target] = result.data
        }
        next();
    };
}
