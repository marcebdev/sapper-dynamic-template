import { getRootPaths ,getSmartNestedPaths } from '../util/paths.js';
import { alphaNumSort, isObject } from '../util/misc.js'

export function get(req, res) {
	let contents = JSON.stringify(
    getRootPaths()
    .concat(getSmartNestedPaths())
    .sort((a, b) =>
      alphaNumSort(isObject(a) ? a.rootName : a, isObject(b) ? b.rootName : b)
    )
  )

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(contents);
}