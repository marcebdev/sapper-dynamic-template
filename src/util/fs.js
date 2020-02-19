// Recursive readdirSync Implementation
export function readdirSyncRec(dir, fileList=[], base = true) {

	fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
		const fullPath = path.join(dir, file.name)
		file.isDirectory() ? readdirSyncRec(fullPath, fileList, false) : fileList.push(fullPath)
	})

	return base ? fileList : null
}