//TODO: make this chainable
export function isObject(val) {
  if (val === null) { return false;}
  return ( (typeof val === 'function') || (typeof val === 'object') );
}

//TODO: make this chainable
export function alphaNumSort(a, b) {
 return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'})
}