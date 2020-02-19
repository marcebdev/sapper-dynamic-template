import { getPost } from "../../util/posts.js";

const lookup = new Map();

export function get(req, res, next) {
	const { subroute, slug } = req.params;

	const relFile = `${subroute}/${slug}`

	// TODO: Check production rule
	if (process.env.NODE_ENV !== 'production' || !lookup.has(relFile)) {
		const post = getPost(relFile);
		lookup.set(relFile, JSON.stringify(post));
	}

	if (lookup.has(relFile)) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(lookup.get(relFile));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}
