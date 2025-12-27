import { Model } from 'mongoose';

export class EntityService {
   constructor(
      private model: Model<any>,
      private softDelete: boolean
   ) {}

   findAll() {
      const filter = this.softDelete ? { deletedAt: null } : {};
      return this.model.find(filter).select('-__v');
   }

   findById(id: string) {
      const filter = this.softDelete
         ? { _id: id, deletedAt: null }
         : { _id: id };
      return this.model.findOne(filter).select('-__v');
   }

   create(data: any) {
      return this.model.create(data) as Promise<any>;
   }

   update(id: string, data: any) {
      return this.model.findByIdAndUpdate(id, data, { new: true });
   }

   delete(id: string) {
      if (this.softDelete) {
         return this.model.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
         );
      }
      return this.model.findByIdAndDelete(id);
   }
}
