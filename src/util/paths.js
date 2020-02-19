import fs from 'fs';

import { contentPath as defaultContentPath } from 'settings'
import { alphaNumSort } from "./misc.js"

// Based on getShallowPosts in "_posts.js"

/*
  Returns list of relative paths from sourced content directory idea
  is to fetch list of all known files or directories branching from
  root path e.g. website_root/<PATH> useful for dynamically creating
  nav elements
*/

// Argument:  Source directory for generated content (string)
// Returns:   Array of root paths (strings)
export function getRootPaths (contentPath = defaultContentPath) {
  return fs.readdirSync(contentPath, { withFileTypes: true })
  .filter(file => file.isFile())
  .map(({ name }) => name.split('.', 1)[0])
}

// This will also find all paths that do not have a page at
// <site_name>/<nested_path>/index and set the path to return
// the first file (alphanumerically) as the base path
// FIXME: implement correctly currently assumes all dynamic paths don't
//        have an index since indexes aren't allowed (dependent) on how
//        dynamic nested index pages will be handled

// Argument:  Source directory for generated content (string)
// Returns:   Object { rootName: name_of_nested_folder, path: path_to_first_file } (only first nested file sorted alphanumerically)
export function getSmartNestedPaths (contentPath = defaultContentPath) {

  const slugs = fs.readdirSync(contentPath, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .map(({ name: directory }) => {
    const firstFile = fs.readdirSync(`${contentPath}/${directory}`, { withFileTypes: true })
    .filter(file => file.isFile())
    .sort(({ name: a }, { name: b }) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}))
    [0].name.split('.', 1)[0]

    return { rootName: directory, path: `${directory}/${firstFile}`}
  })

  return [...slugs].sort(({ rootName: a }, { rootName: b }) => alphaNumSort(a, b))
}

// Argument:  Source directory for generated content (string)
// Returns:   Object { name_of_nested_folder, path_to_first_file } (for every nested file sorted alphanumerically)
export function getNestedPaths(contentPath = defaultContentPath) {
  const slugs = fs.readdirSync(contentPath, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .flatMap(({ name: directory }) => (
    fs.readdirSync(`${contentPath}/${directory}`, { withFileTypes: true })
    .filter(file => file.isFile())
    .map(({ name }) => name.split('.', 1)[0])
  ))

  return [...slugs].sort(({ rootName: a }, { rootName: b }) => alphaNumSort(a, b))
}