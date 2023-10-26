'use strict';

var diff = require('diff');
var tnValidate = require('tn-validate');
const diffmin = (prev, next) => {
  return diff.diffWords(prev, next).map(d => {
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
  if (tnValidate.isArray(next)) ;else {
    const prevkeys = Object.keys(prev);
    const nextkeys = Object.keys(next);
    nextkeys.forEach(nextkey => {
      const thispath = [...path, nextkey];
      if (!prevkeys.includes(nextkey)) return adds.push([thispath, next[nextkey]]);
    });
  }
  return [adds, rems, upds];
};
exports.diffmin = diffmin;
exports.diffobj = diffobj;
