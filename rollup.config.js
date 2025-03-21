import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/bundle.cjs.js",
      format: "cjs", // CommonJS format
      exports: "default",
    },
    {
      file: "dist/bundle.esm.js",
      format: "es", // ES module format
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      },
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          moduleResolution: "node",
          allowSyntheticDefaultImports: true,
          resolveJsonModule: true,
        },
      },
    }),
  ],
};
