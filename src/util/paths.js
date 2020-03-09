import fs from 'fs';
import path from 'path';

import { contentPath as defaultContentPath } from 'settings'
import { fileType as defaultFileType } from 'settings'
import { alphaNumSort } from "./misc.js"

// Based on getShallowPosts in "posts.js"

/*
  Returns list of relative paths from sourced content directory idea
  is to fetch list of all known files or directories branching from
  root path e.g. website_root/<PATH> useful for dynamically creating
  nav elements
*/

// Arguments:   [Optional] Source directory for generated content (string), [Optional] accepted file type or list of file types (can be "") (string or array of strings)
// Returns:     [Array of Strings] root paths
export function getRootPaths (contentPath = defaultContentPath, fileType = defaultFileType) {
  return fs.readdirSync(contentPath, { withFileTypes: true })
  .filter(file => file.isFile() && isOfFileType(file.name, fileType))
  .map(({ name }) => name.split('.', 1)[0])
}


//FIXME: when folder is empty ignore it, currently breaks
// Arguments:   [Optional] Source directory for generated content (string), [Optional] accepted file type or list of file types (can be "") (string or array of strings)
// Returns:     [Object] { rootName: name_of_nested_folder, path: path_to_first_file } (only first nested file sorted alphanumerically)
export function getSmartNestedPaths (contentPath = defaultContentPath, fileType = defaultFileType) {

  const slugs = fs.readdirSync(contentPath, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .map(({ name: directory }) => {
    const firstFile = fs.readdirSync(`${contentPath}/${directory}`, { withFileTypes: true })
    .filter(file => file.isFile() && isOfFileType(file.name, fileType))
    .sort(({ name: a }, { name: b }) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}))
    [0].name.split('.', 1)[0]

    return { rootName: directory, path: `${directory}/${firstFile}`}
  })

  return [...slugs].sort(({ rootName: a }, { rootName: b }) => alphaNumSort(a, b))
}

// Arguments:   [Optional] Source directory for generated content (string), [Optional] accepted file type or list of file types (can be "") (string or array of strings)
// Returns:     [Object] { name_of_nested_folder, path_to_first_file } (for every nested file sorted alphanumerically)
export function getNestedPaths(contentPath = defaultContentPath, fileType = defaultFileType) {
  const slugs = fs.readdirSync(contentPath, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .flatMap(({ name: directory }) => (
    fs.readdirSync(`${contentPath}/${directory}`, { withFileTypes: true })
    .filter(file => file.isFile() && isOfFileType(file.name, fileType))
    .map(({ name }) => name.split('.', 1)[0])
  ))

  return [...slugs].sort(({ rootName: a }, { rootName: b }) => alphaNumSort(a, b))
}

//TODO: make this function chainable fileName.isOfFileType(fileType)
// Arguments: files full and extension (string) file type(s) (string or array of strings)
// Returns:   [Boolean] (true) if it is one of the accepted types, (false) otherwise
function isOfFileType(fileName, fileType) {
  if(!fileType) return false

  let filterFlag = false
  if(Array.isArray(fileType)) {
    filterFlag = fileType
    .forEach(ext => {
      if(path.extname(fileName) === ext)
        return true
    })
  } else if(path.extname(fileName) === fileType) {
    filterFlag = true
  }
  return filterFlag
}