import { endpoints, ValorantEndpoint } from "npm:valorant-api-types";

export const getAllEndpoints = () => Object.values(endpoints);

export const getLocalEdpoints = () => {
	const endpoints = getAllEndpoints();
	return endpoints.filter((v) => v.type === "local");
};

const filterSens = (v: ValorantEndpoint) => {
	const isLocal = v.type === "local";
	const isAuth = v.suffix.includes("auth");
	const isConfig = v.name === "Config";
	return !(isLocal || isAuth || isConfig);
};

export const getSensibleEndpoints = () => {
	const endpoints = getAllEndpoints();
	return endpoints.filter(filterSens);
};
