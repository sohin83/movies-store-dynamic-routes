import { Movie } from '../models/movie';
import { Genre } from '../models/genre';
import { movieZodSchema } from '../models/movie';
import { genreZodSchema } from '../models/genre';
import { AppError } from '../utils/AppError';

export const entityRegistry = {
   movies: {
      model: Movie,
      schema: movieZodSchema,
      permissions: {
         read: ['admin', 'user'],
         write: ['admin'],
         delete: ['admin'],
      },
      fields: {
         allowed: ['title', 'genre', 'numberInStock', 'dailyRentalRate'],
      },
      softDelete: true,
      readOnly: false,

      transform: async (data: any) => {
         if (!data.genreId) {
            throw new AppError('genreId is required', 400);
         }

         const genre = await Genre.findById(data.genreId);
         if (!genre) {
            throw new AppError('Invalid genre.', 400);
         }

         return {
            title: data.title,
            genre: {
               _id: genre._id,
               name: genre.name,
            },
            numberInStock: data.numberInStock,
            dailyRentalRate: data.dailyRentalRate,
         };
      },
   },

   genres: {
      model: Genre,
      schema: genreZodSchema,
      permissions: {
         read: ['admin', 'user'],
         write: ['admin'],
         delete: ['admin'],
      },
      fields: {
         allowed: ['name'],
      },
      softDelete: false,
      readOnly: false,
      transform: undefined,
   },
} as const;

export type EntityName = keyof typeof entityRegistry;
