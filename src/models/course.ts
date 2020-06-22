/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SPRest } from '@pnp/sp';
import '@pnp/sp/presets/core';
import '@pnp/sp/items';
import { ICourseCategory, Mapper as defaultCategoryMappper } from './category';

export interface ICourse {
  Id: number,
  Title: string | null,
  Description: string | null,
  Category?: ICourseCategory | null,
  Requirements: ICourse[],
  Created?: Date,
  Modified?: Date,
  [key: string]: any,
}

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

export const Mapper = new CourseMapper(defaultCategoryMappper);

export async function getCourseRequirementsById(sp: SPRest, id: number): Promise<ICourse[]> {
  const requirementsIds: number[] = (await sp.web
    .lists.getByTitle('CoursesDependencies')
    .items.filter(`ChildId eq ${id}`)
    .select('ParentId').getAll()
  ).map((req) => req.ParentId);

  if (requirementsIds.length > 0) {
    const requirements = await sp.web
      .lists.getByTitle('Courses')
      .items.filter(requirementsIds.map((rId) => `Id eq ${rId}`).join(' or '))
      .expand('Category')
      .select('*', 'Category/Id', 'Category/Title', 'Category/Created', 'Category/Modified')
      .get();

    return Mapper.mapAll(requirements);
  }

  return [];
}

export async function getCourseById(sp: SPRest, id: number): Promise<ICourse | null> {
  const courseRequest = sp.web
    .lists.getByTitle('Courses')
    .items.getById(id)
    .expand('Category')
    .select('*', 'Category/Id', 'Category/Title', 'Category/Created', 'Category/Modified')
    .get();

  const requirementsRequest = getCourseRequirementsById(sp, id);

  const course = Mapper.map(await courseRequest);
  if (course !== null) {
    course.Requirements = await requirementsRequest;
  }

  return course;
}

export async function addCourse(sp: SPRest, course: ICourse): Promise<void> {
  const courseItem: any = {
    Title: course.Title,
    Description: course.Description,
  };

  if (course.Category) {
    courseItem.CategoryId = course.Category.Id;
  }

  const result = await sp.web.lists.getByTitle('Courses').items.add(courseItem);

  // eslint-disable-next-line no-param-reassign
  course.Id = result.data.Id;

  if (course.Requirements.length > 0) {
    const batch = sp.web.createBatch();
    const list = sp.web.lists.getByTitle('CoursesDependencies');
    const type = await list.getListItemEntityTypeFullName();

    // eslint-disable-next-line no-restricted-syntax
    for (const requirement of course.Requirements) {
      list.items.inBatch(batch).add({
        ChildId: course.Id,
        ParentId: requirement.Id,
      }, type);
    }

    await batch.execute();
  }
}

export async function updateCourse(sp: SPRest, course: ICourse): Promise<void> {
  const courseItem: any = {
    Title: course.Title,
    Description: course.Description,
    CategoryId: course.Category?.Id || null,
  };

  const list = sp.web.lists.getByTitle('CoursesDependencies');

  const requirementsRequest = list
    .items.filter(`ChildId eq ${course.Id}`)
    .select('Id', 'ParentId')
    .get();

  const requirementsIds = course.Requirements.map((r) => r.Id);
  await sp.web.lists.getByTitle('Courses').items.getById(course.Id).update(courseItem);
  const oldRequirements = await requirementsRequest;

  if (requirementsIds.length === oldRequirements.length
    && requirementsIds.every((cId) => oldRequirements.some((r) => cId === r.ParentId))
  ) {
    return;
  }

  const detachables = oldRequirements.filter(
    (r) => requirementsIds.every((cId) => cId !== r.ParentId),
  ).map((r) => r.Id);
  const attachables = requirementsIds.filter(
    (cId) => oldRequirements.every((r) => cId !== r.ParentId),
  ).map((id) => id);

  const batch = sp.web.createBatch();

  if (detachables.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const id of detachables) {
      list.items.inBatch(batch).getById(id).delete();
    }
  }

  if (attachables.length > 0) {
    const type = await list.getListItemEntityTypeFullName();

    // eslint-disable-next-line no-restricted-syntax
    for (const id of attachables) {
      list.items.inBatch(batch).add({
        ChildId: course.Id,
        ParentId: id,
      }, type);
    }
  }

  await batch.execute();
}
