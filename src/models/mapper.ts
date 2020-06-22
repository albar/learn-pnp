interface IListItemMapper<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map(item: any): T|null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapAll(items: any[]): T[];
}
