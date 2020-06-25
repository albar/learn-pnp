/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICourseCategory } from '@/models/category';
import { IListItemMapper } from './mapper';

export class CategoryMapper implements IListItemMapper<ICourseCategory> {
  /* eslint-disable-next-line class-methods-use-this */
  map(item: any): ICourseCategory | null {
    if (!item || typeof item !== 'object') return null;

    const category: ICourseCategory = {
      Id: item.Id,
      Title: item.Title,
    };

    if (item.Created) {
      category.Created = new Date(item.Created);
    }
    if (item.Modified) {
      category.Modified = new Date(item.Modified);
    }

    return category;
  }

  mapAll(items: any[]): ICourseCategory[] {
    return items.map(this.map.bind(this)).filter((c) => c) as ICourseCategory[];
  }
}

export const mapper = new CategoryMapper();
