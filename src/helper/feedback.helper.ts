export function getSortingObject(sortInfo: { [key: string]: string }): { [key: string]: number } {
    const sort: { [key: string]: number } = {};
    if (sortInfo) {
        Object.keys(sortInfo).forEach((key) => {
            sort[key] = sortInfo[key] === 'asc' ? 1 : -1;
        })
    }
    return sort;
}

export function getFilterObject(filter: { [key: string]: string }): { [key: string]: string | { $lte: string } } {
    const query: { [key: string]: string | { $lte: string } } = {};
    if (filter) {
        Object.keys(filter).forEach((key) => {
          if (key === 'rated_at' || key === 'rating') {
            query[key] = {
              $lte: filter[key]
            }
            return;
          }
          query[key] = filter[key];
        })
    }
    return query;
}