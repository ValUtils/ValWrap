import { ValorantEndpoint } from "npm:valorant-api-types";
import {
	genFunction,
	genHeaders,
	genExtraTypes,
	genTypeDef,
	genDunderAll,
} from "./python.ts";
import { genRequest } from "./valorant.ts";
import { req2py } from "./schema.ts";
import { Generation } from "./structs.ts";

export const generateAll = (endpoints: ValorantEndpoint[]) => {
	const gen: Generation = { arena: {}, methodNames: [], methods: [] };
	for (const value of endpoints) {
		const req = genRequest(value);
		const def = genTypeDef(req);
		gen.methods.push(genFunction(req));
		gen.methodNames.push(def.dunder);
		if (req.ok) {
			gen.arena[def.type] = JSON.stringify(req.ok);
		}
		if (req.body) {
			gen.arena[def.bodyType] = JSON.stringify(req.body);
		}
	}
	return gen;
};

export const concat = async (gen: Generation) => {
	const py = [];
	py.push(await req2py(gen.arena));
	py.push(genExtraTypes());
	py.push(genHeaders());
	py.push(gen.methods.join("\n"));
	py.push(genDunderAll(gen.methodNames));
	return py.join("\n");
};
