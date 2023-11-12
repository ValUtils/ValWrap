export interface PythonRequest {
	name: string;
	description?: string;
	url: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	ok?: object;
	responses?: Record<string, object>;
	body?: object;
	urlReplace: string[];
	auth?: "Auth" | "ExtraAuth" | "LockFile";
}

export interface PythonDef extends PythonRequest {
	type: string;
	bodyType: string;
	dunder: string;
}

export interface Generation {
	arena: Record<string, string>;
	methods: string[];
	methodNames: string[];
}
