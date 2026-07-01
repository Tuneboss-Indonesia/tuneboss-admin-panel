const config = {
  project: "tsconfig.json",
  src: "src",
  ignore: [
    "node_modules",
    ".next"
  ],
  rules: {
    "react-doctor/prefer-dynamic-import": "off",
    "react-doctor/no-giant-component": "off"
  }
};

export default config
