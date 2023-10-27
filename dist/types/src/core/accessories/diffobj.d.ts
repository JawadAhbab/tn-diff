import { AnyObject } from 'tn-typescript';
import { DiffStr } from './diffstr';
type Path = (string | number)[];
type DiffObjAdds = [P: Path, Value: any];
type DiffObjRems = [P: Path, Value: any];
type DiffObjUpds = [P: Path, Diff: DiffStr] | [P: Path, Prev: any, Value: any];
export type DiffObj = [DiffObjAdds[], DiffObjRems[], DiffObjUpds[]];
export declare const diffobj: (prev: AnyObject, next: AnyObject, path?: Path) => DiffObj;
export {};
