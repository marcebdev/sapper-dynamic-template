import { getAllPosts } from '../_posts';

/*
const contents = JSON.stringify(posts.map(post => {
	return {
		title: post.title,
		slug: post.slug
	};
}));
*/

let contents

export function get(req, res) {
	// TODO: Check production rule
	if (!contents || process.env.NODE_ENV !== 'production') {
		const posts = getAllPosts().map(post => ({
			title: post.metadata.title,
			slug: post.slug,
			image: post.metadata.image
		}));

		contents = JSON.stringify(posts);
	}


	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(contents);
}