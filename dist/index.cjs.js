'use strict';

var tnValidate = require('tn-validate');
var diff$1 = require('diff');
var tnCloneobj = require('tn-cloneobj');
var tnDeepobj = require('tn-deepobj');
const diffstr = (prev, next) => {
  return diff$1.diffChars(prev, next).map(d => {
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
  const array = tnValidate.isArray(next);
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
    if (tnValidate.isObject(nextval)) {
      if (!tnValidate.isObject(preval)) return upds.push([currpath, preval, nextval]);
      const [a, r, u] = diffobj(preval, nextval, currpath);
      adds.push(...a);
      rems.push(...r);
      upds.push(...u);
    } else if (tnValidate.isArray(nextval)) {
      if (!tnValidate.isArray(preval)) return upds.push([currpath, preval, nextval]);
      const [a, r, u] = diffobj(preval, nextval, currpath);
      adds.push(...a);
      rems.push(...r);
      upds.push(...u);
    } else if (tnValidate.isString(nextval)) {
      if (!tnValidate.isString(preval)) return upds.push([currpath, preval, nextval]);
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
  const diffstring = () => {
    const diff = diffstr(prev, next);
    const identical = diff.length <= 1;
    return identical ? [DiffKind.IDENTICAL] : [DiffKind.STRING, diff];
  };
  const diffobject = () => {
    const diff = diffobj(prev, next);
    const identical = !diff[0].length && !diff[1].length && !diff[2].length;
    return identical ? [DiffKind.IDENTICAL] : [DiffKind.OBJECT, diff];
  };
  if (tnValidate.isString(next)) {
    if (!tnValidate.isString(prev)) return [DiffKind.STATIC, prev, next];
    return diffstring();
  } else if (tnValidate.isObject(next)) {
    if (!tnValidate.isObject(prev)) return [DiffKind.STATIC, prev, next];
    return diffobject();
  } else if (tnValidate.isArray(next)) {
    if (!tnValidate.isArray(prev)) return [DiffKind.STATIC, prev, next];
    return diffobject();
  } else {
    if (prev === next) return [DiffKind.IDENTICAL];
    return [DiffKind.STATIC, prev, next];
  }
};
const distance = diff => {
  const strdist = strdiff => {
    const changes = strdiff.reduce((a, b) => a + (tnValidate.isNumber(b) ? 0 : 1), 0);
    return Math.min(changes, 10);
  };
  const staticdist = (v1, v2) => {
    if (tnValidate.isBoolean(v1) && tnValidate.isBoolean(v2)) return 1;
    if (tnValidate.isNumber(v1) && tnValidate.isNumber(v2)) return 1;
    return 10;
  };
  const [kind] = diff;
  if (kind === DiffKind.STRING) {
    const [, strdiff] = diff;
    return strdist(strdiff);
  } else if (kind === DiffKind.OBJECT) {
    let dist = 0;
    const [, [adds, rems, upds]] = diff;
    dist += adds.length * 10;
    dist += rems.length * 10;
    upds.forEach(u => dist += u.length === 2 ? strdist(u[1]) : staticdist(u[1], u[2]));
    return dist;
  } else if (kind === DiffKind.STATIC) {
    const [, v1, v2] = diff;
    return staticdist(v1, v2);
  }
  return 0;
};
const undostr = (curr, diff) => {
  const prev = [];
  const currarr = curr.split('');
  diff.forEach(df => {
    if (tnValidate.isNumber(df)) return prev.push(...currarr.splice(0, df));
    const [change, string] = df;
    if (change === -1) return prev.push(string);
    currarr.splice(0, string.length);
  });
  return prev.join('');
};
const clone$1 = value => tnCloneobj.cloneobj(value, true, false);
const undoobj = (curr, diff) => {
  const obj = clone$1(curr);
  const [adds, rems, upds] = diff;
  const dels = [...adds].reverse();
  dels.forEach(_ref => {
    let [path] = _ref;
    return tnDeepobj.deepobj.delete(obj, path);
  });
  rems.forEach(_ref2 => {
    let [path, value] = _ref2;
    return tnDeepobj.deepobj.set(obj, path, clone$1(value));
  });
  upds.forEach(upd => {
    const [path] = upd;
    if (upd.length === 2) {
      const diff = upd[1];
      const nextval = undostr(tnDeepobj.deepobj.get(obj, path), diff);
      tnDeepobj.deepobj.set(obj, path, clone$1(nextval));
    } else {
      const preval = upd[1];
      tnDeepobj.deepobj.set(obj, path, clone$1(preval));
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
const merge = (currvalue, diffs) => {
  let prevalue = currvalue;
  diffs.reverse().forEach(diff => prevalue = undo(prevalue, diff));
  return diff(prevalue, currvalue);
};
const mergeable = (maxdistance, currvalue, d1, d2) => {
  if (distance(d2) > maxdistance) return {
    merged: false,
    diff: d2
  };
  const dm = merge(currvalue, [d1, d2]);
  if (distance(dm) > maxdistance) return {
    merged: false,
    diff: d2
  };
  return {
    merged: true,
    diff: dm
  };
};
const redostr = (curr, diff) => {
  const prev = [];
  const currarr = curr.split('');
  diff.forEach(df => {
    if (tnValidate.isNumber(df)) return prev.push(...currarr.splice(0, df));
    const [change, string] = df;
    if (change === 1) return prev.push(string);
    currarr.splice(0, string.length);
  });
  return prev.join('');
};
const clone = value => tnCloneobj.cloneobj(value, true, false);
const redoobj = (curr, diff) => {
  const obj = clone(curr);
  const [adds, rems, upds] = diff;
  const dels = [...rems].reverse();
  dels.forEach(_ref3 => {
    let [path] = _ref3;
    return tnDeepobj.deepobj.delete(obj, path);
  });
  adds.forEach(_ref4 => {
    let [path, value] = _ref4;
    return tnDeepobj.deepobj.set(obj, path, clone(value));
  });
  upds.forEach(upd => {
    const [path] = upd;
    if (upd.length === 2) {
      const diff = upd[1];
      const nextval = redostr(tnDeepobj.deepobj.get(obj, path), diff);
      tnDeepobj.deepobj.set(obj, path, clone(nextval));
    } else {
      const preval = upd[2];
      tnDeepobj.deepobj.set(obj, path, clone(preval));
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
exports.diff = diff;
exports.distance = distance;
exports.merge = merge;
exports.mergeable = mergeable;
exports.redo = redo;
exports.undo = undo;
