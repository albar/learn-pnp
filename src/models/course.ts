import { ICourseCategory } from './category';

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
