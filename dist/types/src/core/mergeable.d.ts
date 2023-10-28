import { Diff } from './diff';
type R = {
    merged: boolean;
    diff: Diff;
};
export declare const mergeable: (maxdistance: number, currvalue: any, d1: Diff, d2: Diff) => R;
export {};
