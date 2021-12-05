import fs from "fs";
import loader from "@assemblyscript/loader";
import {fileURLToPath} from 'url'

// Reference: https://github.com/nodejs/node/issues/37845
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const imports = { /* imports go here */};

const {exports} = loader.instantiateSync(
    fs.readFileSync(__dirname + "build/optimized.wasm"), imports)

export default exports;
//module.exports = wasmModule.exports;
