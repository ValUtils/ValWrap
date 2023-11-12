import { zodToJsonSchema } from "npm:zod-to-json-schema@3.21.4";
import { ZodType, ZodTypeDef } from "npm:zod";

export const someKeyIncludes = (obj?: object, arr: unknown[] = []) => {
	if (!obj || arr.length === 0) {
		return false;
	}
	return Object.keys(obj).some((v) => arr.includes(v));
};

// deno-lint-ignore no-explicit-any
export const genSchema = (v: ZodType<any, ZodTypeDef, any>) => {
	return zodToJsonSchema(v, { $refStrategy: "none" });
};
