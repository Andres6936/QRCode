import assert from "assert";
import * as wasm from "../index.js";

assert.strictEqual(wasm.default.add(1, 2), 3);
console.log("ok");
