import { TransactionFilters, QueryFiltersTransaction } from '../../interfaces';

export const setFiltersTransactions = ( filters?: TransactionFilters ): QueryFiltersTransaction => {
  const query: QueryFiltersTransaction = {};

  if (!filters) return query;

  //Busca en la descripción y el nombre la palabra a buscar
  if (filters.textSearch) {
    query.$or = [
      { name: { $regex: new RegExp(filters.textSearch, 'i') } },
      { description: { $regex: new RegExp(filters.textSearch, 'i') } }
    ];
  }

  //Busca las categorías
  if (filters.categories) {
    query.categories = { $in: filters.categories };
  }

  //Buscar entre dos fechas
  if (filters.startDate && filters.finishDate) {
    query.date = { $gte: filters.startDate, $lte: filters.finishDate }
  }

  //Buscar por los tipos
  if (filters.type) {
    query.type = filters.type
  }

  //Buscar por el campo isDelete
//   if (filters.isDelete !== null && filters.isDelete !== undefined ) {
//     query.isDelete = filters.isDelete;
//   }

  return query;
}