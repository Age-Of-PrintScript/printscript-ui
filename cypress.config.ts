import 'dotenv/config'
import { defineConfig } from "cypress";
import {FRONTEND_URL} from "./src/utils/constants";

export default defineConfig({
  e2e: {
    setupNodeEvents(_, config) {
      config.env = process.env
      return config
    },
    experimentalStudio: true,
    baseUrl: FRONTEND_URL,
  },
});
