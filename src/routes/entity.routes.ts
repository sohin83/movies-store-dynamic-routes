import express from 'express';
import { auth } from '../middleware/auth';
import { validateObjectId } from '../middleware/validateObjectId';
import { entityPermission } from '../middleware/entityPermission';
import * as controller from '../controllers/entity.controller';

const router = express.Router();

router.get('/:entity', ...auth, entityPermission('read'), controller.getAll);
router.get(
   '/:entity/:id',
   ...auth,
   validateObjectId,
   entityPermission('read'),
   controller.getById
);
router.post('/:entity', ...auth, entityPermission('write'), controller.create);
router.put(
   '/:entity/:id',
   ...auth,
   validateObjectId,
   entityPermission('write'),
   controller.update
);
router.delete(
   '/:entity/:id',
   ...auth,
   validateObjectId,
   entityPermission('delete'),
   controller.remove
);

export default router;
