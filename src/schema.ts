export const req2py = async (data: Record<string, string>) => {
	const cmd = new Deno.Command("./json2pyi", {
		args: ["All", "--mult"],
		stdin: "piped",
		stdout: "piped",
	});
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	const proc = cmd.spawn();
	const writer = proc.stdin.getWriter();
	const buff = encoder.encode(JSON.stringify(data));
	await writer.write(buff);
	await writer.close();
	const out = await proc.output();
	const stdout = decoder.decode(out.stdout);
	return stdout;
};
