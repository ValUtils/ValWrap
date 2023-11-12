import { PythonDef, PythonRequest } from "./structs.ts";

const genFString = (req: PythonRequest, url?: string) => {
	url ??= req.url;
	if (!req.urlReplace.length) {
		return `"${url}"`;
	}
	return `f"${url}"`;
};

const genURL = (req: PythonRequest) => {
	if (!req.auth) {
		return genFString(req);
	}
	const params = {
		Auth: ["user_id"],
		ExtraAuth: ["region", "shard"],
		LockFile: ["port"],
	} as const;
	let url = req.url;
	const replacements = params[req.auth];
	replacements.forEach((v) => (url = url.replace(v, "auth." + v)));
	if (req.auth) {
		url = url.replace("{puuid}", "{puuid or auth.user_id}");
	}
	return genFString(req, url);
};

const genParams = (req: PythonRequest) => {
	const params: string[] = [];
	const setParams = ["shard", "region", "port", "puuid"];
	if (req.auth) {
		params.push(`auth: ${req.auth}`);
	}
	if (req.body) {
		params.push(`data: ${genTypeName(req) + "BodyType"}`);
	}
	const p = req.urlReplace.filter((v) => !setParams.includes(v));
	p.forEach((v) => params.push(`${v}: str`));
	if (req.urlReplace.includes("puuid")) {
		const type = req.auth ? "Optional[str]" : "str";
		params.push(`puuid: ${type} = None`);
	}
	return params.join(", ");
};

export const genName = (req: PythonRequest) => {
	const members = req.name.toLowerCase().split(" ");
	members.unshift(req.method.toLowerCase());
	return members.join("_");
};

export const genTypeName = (req: PythonRequest) => req.name.split(" ").join("");

const genType = (req: PythonRequest) => {
	if (!req.ok) {
		return "";
	}
	if (Object.keys(req.ok).length <= 2) {
		return ` -> Any`;
	}
	if ("type" in req.ok && req.ok.type === "array") {
		return ` -> List[${genTypeName(req)}Type]`;
	}
	return ` -> ${genTypeName(req)}Type`;
};

const genDef = (req: PythonRequest) => {
	const params = genParams(req);
	const name = genName(req);
	const type = genType(req);
	return `def ${name}(${params})${type}:`;
};

export const genFunction = (req: PythonRequest) => {
	const reqMethod = req.method.toLowerCase();
	const def = genDef(req);
	const url = genURL(req);
	const func = `\
${def}
	api_url = ${url}
	res = ${reqMethod}(api_url, auth${req.body ? ", data" : ""})
	return res
`;
	return func;
};

export const genHeaders = () => `\
from typing import Optional
from ValLib import Auth, ExtraAuth, get, post, put, delete

`;

export const genExtraTypes = () => `\
NameServiceBodyType = List[str]

`;

export const genTypeDef = (req: PythonRequest): PythonDef => {
	const type = genTypeName(req);
	return {
		...req,
		type,
		bodyType: type + "Body",
		dunder: `"${genName(req)}"`,
	};
};

export const genDunderAll = (methodNames: string[]) =>
	`__all__ = [${methodNames.join(",")}]`;
