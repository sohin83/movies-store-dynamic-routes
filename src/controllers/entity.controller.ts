import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { entityRegistry, EntityName } from '../entities/entity.registry';
import { EntityService } from '../services/entity.service';
import { pickFields } from '../utils/pickFields';
import { auditLog } from '../utils/auditLogger';

function getConfig(entity: EntityName) {
   const config = entityRegistry[entity];
   if (!config) throw new AppError('Invalid entity', 404);
   return config;
}

export const getAll = asyncHandler(async (req: Request, res: Response) => {
   const entity = req.params.entity as EntityName;
   const config = getConfig(entity);

   const service = new EntityService(config.model, config.softDelete);
   const data = await service.findAll();

   res.send(data);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
   const entity = req.params.entity as EntityName;
   const config = getConfig(entity);

   const service = new EntityService(config.model, config.softDelete);
   const item = await service.findById(req.params.id);

   if (!item) throw new AppError('Resource not found', 404);

   res.send(item);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
   const entity = req.params.entity as EntityName;
   const config = getConfig(entity);

   if (config.readOnly) throw new AppError('Entity is read-only', 403);

   const parsed = config.schema.parse(req.body);

   const finalData = config.transform
      ? await config.transform(parsed)
      : pickFields(parsed, config.fields.allowed);

   const service = new EntityService(config.model, config.softDelete);
   const item = await service.create(finalData);

   await auditLog({
      userId: req.user?._id,
      entity,
      action: 'CREATE',
      entityId: item._id.toString(),
   });

   res.status(201).send(item);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
   const entity = req.params.entity as EntityName;
   const config = getConfig(entity);

   if (config.readOnly) throw new AppError('Entity is read-only', 403);

   const parsed = config.schema.parse(req.body);

   const finalData = config.transform
      ? await config.transform(parsed)
      : pickFields(parsed, config.fields.allowed);

   const service = new EntityService(config.model, config.softDelete);
   const item = await service.update(req.params.id, finalData);

   if (!item) throw new AppError('Resource not found', 404);

   await auditLog({
      userId: req.user?._id,
      entity,
      action: 'UPDATE',
      entityId: req.params.id,
   });

   res.send(item);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
   const entity = req.params.entity as EntityName;
   const config = getConfig(entity);

   if (config.readOnly) throw new AppError('Entity is read-only', 403);

   const service = new EntityService(config.model, config.softDelete);
   const item = await service.delete(req.params.id);

   if (!item) throw new AppError('Resource not found', 404);

   await auditLog({
      userId: req.user?._id,
      entity,
      action: 'DELETE',
      entityId: req.params.id,
   });

   res.send(item);
});
