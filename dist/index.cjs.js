'use strict';

var tnCloneobj = require('tn-cloneobj');
var tnValidate = require('tn-validate');
var diff$1 = require('diff');
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
exports.DiffKind = void 0;
(function (DiffKind) {
  DiffKind[DiffKind["IDENTICAL"] = 0] = "IDENTICAL";
  DiffKind[DiffKind["STRING"] = 1] = "STRING";
  DiffKind[DiffKind["OBJECT"] = 2] = "OBJECT";
  DiffKind[DiffKind["STATIC"] = 3] = "STATIC";
})(exports.DiffKind || (exports.DiffKind = {}));
const diff = (prev, next) => {
  const diffstring = () => {
    const diff = diffstr(prev, next);
    const identical = diff.length <= 1;
    return identical ? [exports.DiffKind.IDENTICAL] : [exports.DiffKind.STRING, diff];
  };
  const diffobject = () => {
    const diff = diffobj(prev, next);
    const identical = !diff[0].length && !diff[1].length && !diff[2].length;
    return identical ? [exports.DiffKind.IDENTICAL] : [exports.DiffKind.OBJECT, diff];
  };
  let diff;
  if (tnValidate.isString(next)) diff = tnValidate.isString(prev) ? diffstring() : [exports.DiffKind.STATIC, prev, next];else if (tnValidate.isObject(next)) diff = tnValidate.isObject(prev) ? diffobject() : [exports.DiffKind.STATIC, prev, next];else if (tnValidate.isArray(next)) diff = tnValidate.isArray(prev) ? diffobject() : [exports.DiffKind.STATIC, prev, next];else diff = prev === next ? [exports.DiffKind.IDENTICAL] : [exports.DiffKind.STATIC, prev, next];
  return tnCloneobj.cloneobj(diff);
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
  if (kind === exports.DiffKind.STRING) {
    const [, strdiff] = diff;
    return strdist(strdiff);
  } else if (kind === exports.DiffKind.OBJECT) {
    let dist = 0;
    const [, [adds, rems, upds]] = diff;
    dist += adds.length * 10;
    dist += rems.length * 10;
    upds.forEach(u => dist += u.length === 2 ? strdist(u[1]) : staticdist(u[1], u[2]));
    return dist;
  } else if (kind === exports.DiffKind.STATIC) {
    const [, v1, v2] = diff;
    return staticdist(v1, v2);
  }
  return 0;
};
const undostr = (curr, diff) => {
  const currstr = curr;
  const prev = [];
  const currarr = currstr.split('');
  diff.forEach(df => {
    if (tnValidate.isNumber(df)) return prev.push(...currarr.splice(0, df));
    const [change, string] = df;
    if (change === -1) return prev.push(string);
    currarr.splice(0, string.length);
  });
  return prev.join('');
};
const undoobj = (curr, diff) => {
  const currobj = curr;
  const [adds, rems, upds] = diff;
  const dels = [...adds].reverse();
  dels.forEach(_ref => {
    let [path] = _ref;
    return tnDeepobj.deepobj.delete(currobj, path);
  });
  rems.forEach(_ref2 => {
    let [path, value] = _ref2;
    return tnDeepobj.deepobj.set(currobj, path, value);
  });
  upds.forEach(upd => {
    const [path] = upd;
    if (upd.length === 2) {
      const diff = upd[1];
      const nextval = undostr(tnDeepobj.deepobj.get(currobj, path), diff);
      tnDeepobj.deepobj.set(currobj, path, nextval);
    } else {
      const preval = upd[1];
      tnDeepobj.deepobj.set(currobj, path, preval);
    }
  });
  return currobj;
};
const undo = (curr, diff) => {
  const [kind] = diff;
  const currval = tnCloneobj.cloneobj(curr, true, false);
  let undoval;
  if (kind === exports.DiffKind.STATIC) undoval = diff[1];else if (kind === exports.DiffKind.STRING) undoval = undostr(currval, diff[1]);else if (kind === exports.DiffKind.OBJECT) undoval = undoobj(currval, diff[1]);else return currval;
  return tnCloneobj.cloneobj(undoval, true, false);
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
  const currstr = curr;
  const prev = [];
  const currarr = currstr.split('');
  diff.forEach(df => {
    if (tnValidate.isNumber(df)) return prev.push(...currarr.splice(0, df));
    const [change, string] = df;
    if (change === 1) return prev.push(string);
    currarr.splice(0, string.length);
  });
  return prev.join('');
};
const redoobj = (curr, diff) => {
  const currobj = curr;
  const [adds, rems, upds] = diff;
  const dels = [...rems].reverse();
  dels.forEach(_ref3 => {
    let [path] = _ref3;
    return tnDeepobj.deepobj.delete(currobj, path);
  });
  adds.forEach(_ref4 => {
    let [path, value] = _ref4;
    return tnDeepobj.deepobj.set(currobj, path, value);
  });
  upds.forEach(upd => {
    const [path] = upd;
    if (upd.length === 2) {
      const diff = upd[1];
      const nextval = redostr(tnDeepobj.deepobj.get(currobj, path), diff);
      tnDeepobj.deepobj.set(currobj, path, nextval);
    } else {
      const preval = upd[2];
      tnDeepobj.deepobj.set(currobj, path, preval);
    }
  });
  return currobj;
};
const redo = (curr, diff) => {
  const [kind] = diff;
  const currval = tnCloneobj.cloneobj(curr, true, false);
  let redoval;
  if (kind === exports.DiffKind.STATIC) redoval = diff[2];else if (kind === exports.DiffKind.STRING) redoval = redostr(currval, diff[1]);else if (kind === exports.DiffKind.OBJECT) redoval = redoobj(currval, diff[1]);else redoval = currval;
  return tnCloneobj.cloneobj(redoval, true, false);
};
exports.diff = diff;
exports.distance = distance;
exports.merge = merge;
exports.mergeable = mergeable;
exports.redo = redo;
exports.undo = undo;
