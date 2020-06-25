import { SPRest } from '@pnp/sp';
import '@pnp/sp/presets/core';
import '@pnp/sp/items';
import { ICourse } from '@/models/course';
import { mapper } from '@/mappers/course';

export async function getCourseRequirementsIdsById(sp: SPRest, id: number): Promise<number[]> {
  const requirements = await sp.web
    .lists.getByTitle('CoursesDependencies')
    .items.filter(`ChildId eq ${id}`)
    .select('ParentId').getAll();

  return requirements.map((requirement) => requirement.ParentId);
}

export async function getCoursesByIds(sp: SPRest, ...ids: number[]) {
  const requirements = await sp.web
    .lists.getByTitle('Courses')
    .items.filter(ids.map((id) => `(Id eq ${id})`).join(' or '))
    .expand('Category')
    .select('*', 'Category/Id', 'Category/Title', 'Category/Created', 'Category/Modified')
    .get();

  return mapper.mapAll(requirements);
}

export async function getCourseRequirementsById(sp: SPRest, id: number): Promise<ICourse[]> {
  const requirementsIds = await getCourseRequirementsIdsById(sp, id);

  if (requirementsIds.length > 0) {
    return getCoursesByIds(sp, ...requirementsIds);
  }

  return [];
}

export async function getCourseById(sp: SPRest, id: number): Promise<ICourse | null> {
  const requirementsIds = await getCourseRequirementsIdsById(sp, id);
  const courses = await getCoursesByIds(sp, id, ...requirementsIds);

  const courseIndex = courses.findIndex((course) => course.Id === id);

  if (courseIndex < 0) {
    return null;
  }

  const course = courses.splice(courseIndex, 1)[0];
  course.Requirements = courses;
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

  // eslint-disable-next-line no-restricted-syntax
  const detachRequest = Promise.all(detachables.map((id) => list.items.getById(id).delete()));

  const batch = sp.web.createBatch();

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

  await Promise.all([batch.execute(), detachRequest]);
}
