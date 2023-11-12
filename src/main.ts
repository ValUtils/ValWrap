import { concat, generateAll } from "./concat.ts";
import { getSensibleEndpoints } from "./filter.ts";

const endpoints = getSensibleEndpoints();
const gen = generateAll(endpoints);
const output = await concat(gen);
console.log(output);
