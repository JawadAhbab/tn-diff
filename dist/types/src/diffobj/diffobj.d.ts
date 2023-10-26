import { AnyObject } from 'tn-typescript';
type Path = (string | number)[];
type DiffObj = [DiffObjAdds[], DiffObjRems[], DiffObjUpds[]];
type DiffObjAdds = [Path, any];
type DiffObjRems = Path[];
type DiffObjUpds = [Path, any, any];
export declare const diffobj: (prev: AnyObject, next: AnyObject, path?: Path) => DiffObj;
export {};
