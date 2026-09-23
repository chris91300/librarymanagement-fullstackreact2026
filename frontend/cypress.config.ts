import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    watchForFileChanges: false,// ajouter cette ligne
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
