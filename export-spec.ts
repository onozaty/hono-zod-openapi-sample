import yaml from "js-yaml";
import { app } from "./src/app";

const res = await app.request("/spec");
const spec = await res.json();

const flag = process.argv[2];
if (flag === "yaml" || flag === "yml") {
  const specYaml = yaml.dump(spec);
  console.log(specYaml);
} else {
  const specJson = JSON.stringify(spec, null, 2);
  console.log(specJson);
}
