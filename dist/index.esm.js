import { isArray, isObject, isString, isNumber } from 'tn-validate';
import { diffWords } from 'diff';
import { cloneobj } from 'tn-cloneobj';
import { deepobj } from 'tn-deepobj';
const diffstr = (prev, next) => {
  return diffWords(prev, next).map(d => {
    if (d.added) return [1, d.value];
    if (d.removed) return [-1, d.value];
    return d.value.length;
  });
};
const diffobj = function (prev, next) {
  let path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const adds = [];
  const rems = [];
  const upds = [];
  const array = isArray(next);
  const prevkeys = array ? Array.from({
    length: prev.length
  }).map((_, i) => i) : Object.keys(prev);
  const nextkeys = array ? Array.from({
    length: next.length
  }).map((_, i) => i) : Object.keys(next);
  let delkeys = prevkeys;
  nextkeys.forEach(nextkey => {
    const currpath = [...path, nextkey];
    if (!prevkeys.includes(nextkey)) return adds.push([currpath, next[nextkey]]);
    delkeys = delkeys.filter(i => i !== nextkey);
    const preval = prev[nextkey];
    const nextval = next[nextkey];
    if (isObject(nextval)) {
      if (!isObject(preval)) return upds.push([currpath, preval, nextval]);
      const [a, r, u] = diffobj(preval, nextval, currpath);
      adds.push(...a);
      rems.push(...r);
      upds.push(...u);
    } else if (isArray(nextval)) {
      if (!isArray(preval)) return upds.push([currpath, preval, nextval]);
      const [a, r, u] = diffobj(preval, nextval, currpath);
      adds.push(...a);
      rems.push(...r);
      upds.push(...u);
    } else if (isString(nextval)) {
      if (!isString(preval)) return upds.push([currpath, preval, nextval]);
      if (preval === nextval) return;
      upds.push([currpath, diffstr(preval, nextval)]);
    } else {
      if (preval === nextval) return;
      upds.push([currpath, preval, nextval]);
    }
  });
  delkeys.forEach(delkey => rems.push([[...path, delkey], prev[delkey]]));
  return [adds, rems, upds];
};
var DiffKind;
(function (DiffKind) {
  DiffKind[DiffKind["IDENTICAL"] = 0] = "IDENTICAL";
  DiffKind[DiffKind["STRING"] = 1] = "STRING";
  DiffKind[DiffKind["OBJECT"] = 2] = "OBJECT";
  DiffKind[DiffKind["STATIC"] = 3] = "STATIC";
})(DiffKind || (DiffKind = {}));
const diff = (prev, next) => {
  if (isString(next)) {
    if (!isString(prev)) return [DiffKind.STATIC, prev, next];
    return [DiffKind.STRING, diffstr(prev, next)];
  } else if (isObject(next)) {
    if (!isObject(prev)) return [DiffKind.STATIC, prev, next];
    return [DiffKind.OBJECT, diffobj(prev, next)];
  } else if (isArray(next)) {
    if (!isArray(prev)) return [DiffKind.STATIC, prev, next];
    return [DiffKind.OBJECT, diffobj(prev, next)];
  } else {
    if (prev === next) return [DiffKind.IDENTICAL];
    return [DiffKind.STATIC, prev, next];
  }
};
const redostr = (curr, diff) => {
  const prev = [];
  const currarr = curr.split('');
  diff.forEach(df => {
    if (isNumber(df)) return prev.push(...currarr.splice(0, df));
    const [change, string] = df;
    if (change === 1) return prev.push(string);
    currarr.splice(0, string.length);
  });
  return prev.join('');
};
const clone$1 = value => cloneobj(value, true, false);
const redoobj = (curr, diff) => {
  const obj = clone$1(curr);
  const [adds, rems, upds] = diff;
  const dels = [...rems].reverse();
  dels.forEach(_ref => {
    let [path] = _ref;
    return deepobj.delete(obj, path);
  });
  adds.forEach(_ref2 => {
    let [path, value] = _ref2;
    return deepobj.set(obj, path, clone$1(value));
  });
  upds.forEach(upd => {
    const [path] = upd;
    if (upd.length === 2) {
      const diff = upd[1];
      const nextval = redostr(deepobj.get(obj, path), diff);
      deepobj.set(obj, path, clone$1(nextval));
    } else {
      const preval = upd[2];
      deepobj.set(obj, path, clone$1(preval));
    }
  });
  return obj;
};
const redo = (curr, diff) => {
  const [kind] = diff;
  if (kind === DiffKind.STATIC) return diff[2];
  if (kind === DiffKind.STRING) return redostr(curr, diff[1]);
  if (kind === DiffKind.OBJECT) return redoobj(curr, diff[1]);
  return curr;
};
const undostr = (curr, diff) => {
  const prev = [];
  const currarr = curr.split('');
  diff.forEach(df => {
    if (isNumber(df)) return prev.push(...currarr.splice(0, df));
    const [change, string] = df;
    if (change === -1) return prev.push(string);
    currarr.splice(0, string.length);
  });
  return prev.join('');
};
const clone = value => cloneobj(value, true, false);
const undoobj = (curr, diff) => {
  const obj = clone(curr);
  const [adds, rems, upds] = diff;
  const dels = [...adds].reverse();
  dels.forEach(_ref3 => {
    let [path] = _ref3;
    return deepobj.delete(obj, path);
  });
  rems.forEach(_ref4 => {
    let [path, value] = _ref4;
    return deepobj.set(obj, path, clone(value));
  });
  upds.forEach(upd => {
    const [path] = upd;
    if (upd.length === 2) {
      const diff = upd[1];
      const nextval = undostr(deepobj.get(obj, path), diff);
      deepobj.set(obj, path, clone(nextval));
    } else {
      const preval = upd[1];
      deepobj.set(obj, path, clone(preval));
    }
  });
  return obj;
};
const undo = (curr, diff) => {
  const [kind] = diff;
  if (kind === DiffKind.STATIC) return diff[1];
  if (kind === DiffKind.STRING) return undostr(curr, diff[1]);
  if (kind === DiffKind.OBJECT) return undoobj(curr, diff[1]);
  return curr;
};
export { diff, redo, undo };
