import { ICourse } from '@/models/course';
import { ICourseCategory } from '@/models/category';
import { IListItemMapper } from './mapper';
import { mapper as defaultCategoryMappper } from './category';

export class CourseMapper implements IListItemMapper<ICourse> {
  categoryMapper: IListItemMapper<ICourseCategory>;

  constructor(categoryMapper?: IListItemMapper<ICourseCategory>) {
    if (!categoryMapper) {
      this.categoryMapper = defaultCategoryMappper;
    } else {
      this.categoryMapper = categoryMapper;
    }
  }

  map(item: any): ICourse | null {
    if (!item || typeof item !== 'object') return null;

    const course: ICourse = {
      Id: item.Id,
      Title: item.Title,
      Description: item.Description,
      Category: this.categoryMapper.map(item.Category),
      Requirements: [],
    };

    if (item.Requirements && item.Requirements.length > 0) {
      course.Requirements = (item.Requirements as any[])
        .map(this.map.bind(this))
        .filter((r) => r) as ICourse[];
    }
    if (item.Created) {
      course.Created = new Date(item.Created);
    }
    if (item.Modified) {
      course.Modified = new Date(item.Modified);
    }

    return course;
  }

  mapAll(items: any[]): ICourse[] {
    return items.map(this.map.bind(this)).filter((c) => c !== null) as ICourse[];
  }
}

export const mapper = new CourseMapper(defaultCategoryMappper);
