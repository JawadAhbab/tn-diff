type DiffMinChange = [1 | -1, string];
export declare const diffmin: (prev: string, next: string) => (number | DiffMinChange)[];
export {};
