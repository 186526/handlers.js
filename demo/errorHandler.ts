// From https://gist.github.com/186526/82b7372619fb4b029568040ee4a4aa44, Open source with MIT license

import { response, request } from "..";
import { defaultHeaders } from "../src/interface/response";

function uuid(): string {
	const s: any[] = [];
	const hexDigits = "0123456789abcdef";

	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}

	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	const uuid = s.join("");

	return uuid;
}
const codeAlternative = {
	100: "Continue",
	101: "Switching Protocols",
	102: "Processing",
	103: "Early Hints",
	200: "OK",
	201: "Created",
	202: "Accepted",
	203: "Non-Authoritative Information",
	204: "No Content",
	205: "Reset Content",
	206: "Partial Content",
	207: "Multi Status",
	208: "Already Reported",
	226: "IM Used",
	300: "Multiple Choices",
	301: "Moved Permanently",
	302: "Found",
	303: "See Other",
	304: "Not Modified",
	305: "Use Proxy",
	306: "Switch Proxy",
	307: "Temporary Redirect",
	308: "Permanent Redirect",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Time-out",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Request Entity Too Large",
	414: "Request-URI Too Large",
	415: "Unsupported Media Type",
	416: "Requested Range not Satisfiable",
	417: "Expectation Failed",
	418: "I'm a teapot",
	421: "Misdirected Request",
	422: "Unprocessable Entity",
	423: "Locked",
	424: "Failed Dependency",
	426: "Upgrade Required",
	428: "Precondition Required", // RFC 6585
	429: "Too Many Requests",
	431: "Request Header Fields Too Large", // RFC 6585
	451: "Unavailable For Legal Reasons",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Time-out",
	505: "HTTP Version not Supported",
	506: "Variant Also Negotiates",
	507: "Insufficient Storage",
	508: "Loop Detected",
	510: "Not Extended",
	511: "Network Authentication Required",
};

const template: string =
	'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /><meta name="renderer" content="webkit" /><meta name="force-rendering" content="webkit" /><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Google+Sans&family=Fira+Mono&family=Ubuntu&display=swap" rel="stylesheet"><title>${statusCode} | ${codeAlternative}</title><link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet"><style type="text/css">:root{ --background-color: #fff; --font-color: #000; --font-color-lighter: rgb(87, 89, 88); --font-size-main: 3.545rem; --font-size-description: 1.245rem; --box-color: #F2F2F2; --working-color: #137333; --working-color-background: #e6f4ea; --error-color-background: #fce8e6; --error-color: #c5221f; --working-with-error-color: #b05a00; --working-with-error-color-background: #fef7e0; --icon-size: 48px;} body{ margin: 2rem 2rem; font-family: Google Sans, Ubuntu, Roboto, Noto Sans SC, sans-serif; color: var(--font-color); background-color: var(--background-color);} nav{ margin-left: 1rem;} nav description{ font-family: Ubuntu, Roboto, Noto Sans SC, sans-serif; font-size: var(--font-size-description); line-height: var(--fonr-size-description); color: var(--font-color-lighter);} nav main{ font-size: var(--font-size-main); line-height: var(--font-size-main); font-family: Fira Mono, Ubuntu, monospace;} code{ font-family: Fira Mono, monospace;} status{ margin-top: 2.5rem; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center;} status block.status-block{ background-color: var(--box-color); padding: 2rem; margin: 1rem 1rem; min-height: 3rem; border-radius: 9px; flex-grow: 1;} status block.status-block.working-block{ background-color: var(--working-color-background);} status block.status-block.error-block{ background-color: var(--error-color-background);} status block.status-block.working-with-error-block{ background-color: var(--working-with-error-color-background);} .status-block main{ font-size: calc(var(--font-size-description) + 0.1rem);} .status-working{ color: var(--working-color);} .status-error{ color: var(--error-color);} .status-working-with-error{ color: var(--working-with-error-color);} icon{ font-size: var(--icon-size) !important;} a{ text-decoration: none; color: #1967d2;} reason{ display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-items: center;} reason>*{ display: block; margin: 1rem; flex-grow: 1; max-width: 40%;} reason main{ font-size: calc(var(--font-size-description) + 0.2rem); font-weight: 550;} footer{ margin: 1rem; color: var(--font-color-lighter); font-size: calc(var(--font-size-description) - 0.4rem);} footer>request-status{ font-size: calc(var(--font-size-description) - 0.6rem);} footer>*{ display: block;} @media screen and (max-width:480px){ body{ margin: 6rem 2rem;} :root{ --font-size-main: 3.0rem; --font-size-description: 1.045rem;} reason>*{ max-width: 100%;} footer{ font-size: calc(var(--font-size-description) - 0.2rem);} footer>request-status{ font-size: calc(var(--font-size-description) - 0.4rem);}} @media screen and (min-width: 768px){ body{ margin: 8% 10%;} nav *{ display: inline-block; margin-left: 1%;}} @media (prefers-color-scheme: dark){ :root{ --font-color: rgba(255, 255, 255, 0.86); --font-color-lighter: rgba(255, 255, 255, 0.4); --background-color: rgb(0, 0, 0); --box-color: rgb(40 40 40 / 73%); --working-color-background: #07220f; --error-color-background: #270501; --working-with-error-color-background: #392605;}} </style></head><body><nav><main>${statusCode}</main><description>${codeAlternative}</description></nav><status><block class="status-block ${clientStatusShort}-block" id="client-status-block"><icon class="material-icons-outlined status-${clientStatusShort}">web</icon><main>Your Client</main><status-text class="status-${clientStatusShort}">${clientStatus}</status-text></block><block class="status-block working-block" id="edge-status-block"><icon class="material-icons-outlined status-working">alt_route</icon><main>Handlers.JS</main><status-text class="status-working">Working </block><block class="status-block ${ServerStatusLowerCase}-block" id="website-status-block"><icon class="material-icons-outlined status-${ServerStatusLowerCase}">widgets</icon><main>Route</main><status-text class="status-${ServerStatusLowerCase}">${ServerStatus}</status-text></block></status><reason><explain><main>${codeAlternative}</main><p>${explain} </p></explain><howto><main>What can I do?</main><p>${howto} </p></howto></reason><footer><provider>Running with <a href="https://git.186526.xyz/186526/handlers.js">Handlers.JS</a>.</provider><br><request-status>Your IP is <code>${ip}</code><br>Request ID is <code>${id}</code></request-status></footer></body></html>';

export default (
		errorCode: number,
		errorMessage: string = `The route you are trying access is error.`
	) =>
	async (request: request<any>) => {
		return new response(
			template
				.replaceAll("${statusCode}", errorCode.toString())
				.replaceAll("${codeAlternative}", codeAlternative[errorCode])
				.replaceAll("${explain}", errorMessage)
				.replaceAll(
					"${howto}",
					`You can go to the <a href="/">homepage</a> of the website.`
				)
				.replaceAll("${id}", uuid())
				.replaceAll(
					"${ServerStatus}",
					errorCode >= 500
						? "Error"
						: errorCode <= 500 && errorCode >= 400
						? `Working but ${codeAlternative[errorCode]}`
						: "Working"
				)
				.replaceAll(
					"${ServerStatusLowerCase}",
					errorCode >= 500
						? "error"
						: errorCode <= 500 && errorCode >= 400
						? `working-with-error`
						: "working"
				)
				.replaceAll("${ip}", request.ip)
				.replaceAll(
					"${clientStatus}",
					errorCode <= 500 && errorCode >= 400
						? `Working but receive ${codeAlternative[errorCode]}`
						: "Working"
				)
				.replaceAll(
					"${clientStatusShort}",
					errorCode <= 500 && errorCode >= 400
						? `working-with-error`
						: "working"
				),
			errorCode,
			(() => {
				const Headers = new defaultHeaders();
				Headers.set("Content-Type", "text/html; charset=utf-8");
				return Headers;
			})()
		);
	};
