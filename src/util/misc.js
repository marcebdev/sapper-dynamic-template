//TODO: make functions chainable
export function isObject(val) {
  if (val === null) { return false;}
  return ( (typeof val === 'function') || (typeof val === 'object') );
}

export function alphaNumSort(a, b) {
 return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'})
}

export function capitalize(string) {
  return string && string.charAt(0).toUpperCase() + string.slice(1)
}