interface ICategory {
  Id: number,
  Title: string,
}

interface ICourse {
  Id: number,
  Title: string,
  Description: string,
  Category?: ICategory,
  DependsOn?: ICourse[],
  Created: Date,
  Modified: Date,
  [key: string]: any,
}

export {
  ICategory,
  ICourse,
};
