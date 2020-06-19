interface ICategory {
  Id: number,
  Title: string,
}

interface ICourse {
  Id?: number,
  Title: string | null,
  Description: string | null,
  Category?: ICategory | null,
  Requirements?: ICourse[],
  Created?: Date,
  Modified?: Date,
  [key: string]: any,
}

export {
  ICategory,
  ICourse,
};
