import { isEmpty, difference } from 'lodash';

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

export function isEqual(a: any, b: any) {
  const isSame = (arrayOne: any, arrayTwo: any) => {
      if (!arrayOne || !arrayTwo) {
          return false;
      }
      let ac = arrayOne,
          bc = arrayTwo;
   
      if (arrayOne.length <= arrayTwo.length) {
         ac = arrayTwo;
         bc = arrayOne;
         return isEmpty(difference(ac.sort(), bc.sort()));
      } else {
         return false;
      }
  }
  return isSame(a.answers, b.answers);
}

export function getDate(dateString: string): string {
  const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const dateArray = dateString.split(' ');
  const day = dateArray[0];
  const year = dateArray[dateArray.length - 2].replace(',', '');
  const month = monthArray.indexOf(dateArray[1]) + 1;
  const time = dateArray[dateArray.length - 1].split(':');
  const hours = time[0].length < 2  ? `0${time[0]}` : time[0]
  const mins = time[1]
  return new Date(`${year}-${month}-${day}T${hours}:${mins}:00Z`).toISOString();
}