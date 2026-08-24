import { cp, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/client", { recursive: true });
await mkdir("dist/server", { recursive: true });

await Promise.all([
  cp("index.html", "dist/client/index.html"),
  cp("index.css", "dist/client/index.css"),
  cp("index.js", "dist/client/index.js"),
  cp("assets", "dist/client/assets", { recursive: true }),
]);

await writeFile(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`,
);
