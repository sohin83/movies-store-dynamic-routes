import { Request, Response, NextFunction } from 'express';
import { entityRegistry, EntityName } from '../entities/entity.registry';
import { AppError } from '../utils/AppError';

export const entityPermission =
   (action: 'read' | 'write' | 'delete') =>
   (req: Request, _res: Response, next: NextFunction) => {
      const entity = req.params.entity as EntityName;
      const config = entityRegistry[entity];

      if (!config) {
         throw new AppError('Invalid entity', 404);
      }

      const userRole = req.user?.role;
      if (
         !userRole ||
         !(config.permissions[action] as readonly string[]).includes(userRole)
      ) {
         throw new AppError('Forbidden', 403);
      }

      next();
   };
