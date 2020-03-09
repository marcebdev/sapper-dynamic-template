import fs from 'fs';
import path from 'path'
import marked from 'marked';

import { contentPath as defaultContentPath } from 'settings'

import { readdirSyncRec } from "./fs.js"

//FIXME: document functions
//FIXME: take this from settings, (has ot support arrays first)
const fileType = ".md"


export function getShallowPosts (contentPath = defaultContentPath) {
	const slugs = fs.readdirSync(contentPath)
		.filter(file => path.extname(file) === fileType)
		.map(file => file.slice(0, -fileType.length));

	// TODO: this is how they are sorted
	return slugs.map(slug => getPost(slug, contentPath)).sort((a, b) => {
		return a.metadata.pubdate < b.metadata.pubdate ? 1 : -1;
	});
}

export function getAllPosts (contentPath = defaultContentPath) {
	const slugs = readdirSyncRec(contentPath)
		.filter(file => path.extname(file) === fileType)
		.map(file => file.substring(contentPath.length + 1).slice(0, -fileType.length))

	return slugs.map(slug => getPost(slug, contentPath)).sort((a, b) => {
		return a.metadata.pubdate < b.metadata.pubdate ? 1 : -1;
	});
}

//TODO: add a getNestedPosts

//TODO: define as MD specific or make generic (may depend on sorting)
export function getPost(slug, contentPath = defaultContentPath) {
	//TODO: should content be combined with slug or does it need to be seperate for internal slug field
	const file = `${contentPath}/${slug}.md`;

	if (!fs.existsSync(file)) return null;

	const markdown = fs.readFileSync(file, 'utf-8');

	const { content, metadata } = process_markdown(markdown);

	//FIXME: This is an organizational hack
	const date = new Date(`${metadata.pubdate} EDT`); // cheeky hack
	metadata.dateString = date.toDateString();

	const html = marked(content);

	return {
		slug,
		metadata,
		html
	};
}

// FIXME: make it so metadata isn't necessary?
// Make metadata directly accessible instead of e.g. post.metadata.title?
function process_markdown(markdown) {
	const match = /---\n([\s\S]+?)\n---/.exec(markdown);
	const frontMatter = match[1];
	const content = markdown.slice(match[0].length);

	const metadata = {};
	frontMatter.split('\n').forEach(pair => {
		const colonIndex = pair.indexOf(':');
		metadata[pair.slice(0, colonIndex).trim()] = pair
			.slice(colonIndex + 1)
			.trim();
	});

	return { metadata, content };
}
