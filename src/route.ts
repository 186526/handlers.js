import { path } from "./interface";
import handler from "./handler";
import { pathToRegexp } from "path-to-regexp";

interface matchedStatus {
	matched: boolean;
	attributes: {
		name: string;
		value: string | undefined;
	}[];
}

export class route {
	public paths: path[];
	public handlers: handler<any, any>[];

	constructor(paths: path[], handlers: handler<any, any>[]) {
		this.paths = paths;
		this.handlers = handlers;
	}
	async exec(path: string): Promise<matchedStatus> {
		let Answer = await Promise.all<Promise<matchedStatus>>(
			this.paths.map(async (it) => {
				const keys: {
					name: string;
					prefix: string;
					suffix: string;
					pattern: string;
					modifier: string;
				}[] = [];
				const regExp = pathToRegexp(it, keys);
				const answer = regExp.exec(path);
				if (answer === null)
					return {
						matched: false,
						attributes: [],
					};

				let attributes: matchedStatus["attributes"] = [];

				keys.forEach((key, index) => {
					attributes.push({
						name: key.name,
						value: answer[index + 1],
					});
				});

				return {
					matched: true,
					attributes: attributes,
				};
			})
		);
		Answer = Answer.filter((it) => it.matched);
		if (Answer.length === 0)
			return {
				matched: false,
				attributes: [],
			};
		else return Answer[0];
	}
}

export default route;
