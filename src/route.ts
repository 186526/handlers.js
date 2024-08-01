import { path } from './interface';
import handler from './handler';
import { pathToRegexp } from 'path-to-regexp';

interface matchedStatus {
    matched: boolean;
    attributes: {
        name: string;
        value: string | undefined;
    }[];
}

interface regExpKey {
    name: string;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
}

export class route {
    private paths: path[];
    public handlers: handler<any, any>[];
    private regExps: { regExp: RegExp; keys: regExpKey[] }[] = [];

    constructor(paths: path[], handlers: handler<any, any>[]) {
        this.paths = paths;
        this.handlers = handlers;

        this.paths.forEach((path) => {
            const keys: regExpKey[] = [];
            this.regExps.push({ regExp: pathToRegexp(path, keys), keys });
        });
    }
    async exec(path: string): Promise<matchedStatus> {
        let Answer = await Promise.all<Promise<matchedStatus>>(
            this.regExps.map(async (it) => {
                const answer = it.regExp.exec(path);
                if (answer === null)
                    return {
                        matched: false,
                        attributes: [],
                    };

                const attributes: matchedStatus['attributes'] = [];

                it.keys.forEach((key, index) => {
                    attributes.push({
                        name: key.name,
                        value: answer[index + 1],
                    });
                });

                return {
                    matched: true,
                    attributes: attributes,
                };
            }),
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
