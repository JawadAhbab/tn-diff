import { DiffObj } from './accessories/diffobj';
import { DiffStr } from './accessories/diffstr';
export declare enum DiffKind {
    IDENTICAL = 0,
    STRING = 1,
    OBJECT = 2,
    STATIC = 3
}
export type Diff = [Kind: DiffKind.IDENTICAL] | [Kind: DiffKind.STATIC, Prev: any, Value: any] | [Kind: DiffKind.STRING, DiffStr] | [Kind: DiffKind.OBJECT, DiffObj];
export declare const diff: (prev: any, next: any) => Diff;
