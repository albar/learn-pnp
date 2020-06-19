interface ICourseCategory {
  Id: number,
  Title: string,
}

interface ICourse {
  Id?: number,
  Title: string | null,
  Description: string | null,
  Category?: ICourseCategory | null,
  Requirements?: ICourse[],
  Created?: Date,
  Modified?: Date,
  [key: string]: any,
}

export {
  ICourseCategory,
  ICourse,
};
