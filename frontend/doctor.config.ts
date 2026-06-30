import type { ReactDoctorConfig } from "react-doctor/api";

export default {
  project: "tsconfig.json",
  src: "src",
  ignore: [
    "node_modules",
    ".next"
  ]
} satisfies ReactDoctorConfig;
