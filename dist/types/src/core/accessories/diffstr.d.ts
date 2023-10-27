type DiffStrChange = [1 | -1, string];
export type DiffStr = (DiffStrChange | number)[];
export declare const diffstr: (prev: string, next: string) => (number | DiffStrChange)[];
export {};
