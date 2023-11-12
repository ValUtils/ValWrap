import type { ValorantEndpoint } from "npm:valorant-api-types";

import { PythonRequest } from "./structs.ts";
import { genSchema, someKeyIncludes } from "./helper.ts";

const replacementRegex = /{(.*?)}/g;

const replaceSuffix = (suffix: string) =>
	suffix.replaceAll(/({.*) (.*})/g, "$1_$2");

function endpointToURL(endpoint: ValorantEndpoint): string {
	const { type, suffix } = endpoint;
	const cleanSuffix = replaceSuffix(suffix);
	const rg = {
		pd: "https://pd.{shard}.a.pvp.net/",
		glz: "https://glz-{region}-1.{shard}.a.pvp.net/",
		shared: "https://shared.{shard}.a.pvp.net/",
		local: "https://127.0.0.1:{port}/",
		other: "",
	} as const;
	const url = rg[type] + cleanSuffix;
	return replacer(url);
}

const replacer = (data: string) => {
	data = data.replaceAll(" ", "_");
	const empty = ["pre-game_", "current_game_"];
	empty.forEach((v) => {
		data = data.replace(v, "");
	});
	return data;
};

const getArgs = (url: string) => {
	const matchs = url.matchAll(replacementRegex);
	const args = [];
	for (const match of matchs) {
		args.push(replacer(match[1]));
	}
	return args;
};

const getAuth = (
	v: ValorantEndpoint,
	replace: string[]
): "Auth" | "ExtraAuth" | "LockFile" | undefined => {
	if (v.type === "local") {
		return "LockFile";
	}
	if (replace.some((v) => ["shard", "region"].includes(v))) {
		return "ExtraAuth";
	}
	if (someKeyIncludes(v.riotRequirements, ["token", "entitlement"])) {
		return "Auth";
	}
};

const genName = (name: string) => {
	return name.replace("Pre-Game", "PreGame");
};

const getResponses = (v: ValorantEndpoint) => {
	if (!v.responses) {
		return;
	}
	const responses: Record<string, object> = {};
	for (const [key, value] of Object.entries(v.responses)) {
		responses[key] = genSchema(value);
	}
	return responses;
};

const getOk = (v: ValorantEndpoint) => {
	if (!v.responses) {
		return;
	}
	if ("200" in v.responses) {
		return genSchema(v.responses["200"]);
	}
	const keys = Object.keys(v.responses);
	const okKey = keys.find((v) => v.startsWith("2"));
	if (!okKey) {
		return;
	}
	return genSchema(v.responses[okKey]);
};

export const genRequest = (v: ValorantEndpoint): PythonRequest => {
	const req: PythonRequest = {
		name: genName(v.name),
		description: v.description,
		url: endpointToURL(v),
		method: v.method ?? "GET",
		urlReplace: [],
	};

	req.responses = getResponses(v);
	req.ok = getOk(v);
	req.urlReplace = getArgs(req.url);
	req.auth = getAuth(v, req.urlReplace);
	if (v.body) {
		req.body = genSchema(v.body);
	}

	return req;
};
