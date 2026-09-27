const { withAndroidManifest } = require("@expo/config-plugins");

const withUpiQueries = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest.queries) {
      manifest.queries = [];
    }

    if (!manifest.queries[0]) {
      manifest.queries[0] = {};
    }

    const queries = manifest.queries[0];

    if (!queries.intent) {
      queries.intent = [];
    }

    const alreadyExists = queries.intent.some((intent) => {
      const action = intent.action?.some(
        (item) =>
          item.$?.["android:name"] === "android.intent.action.VIEW"
      );

      const scheme = intent.data?.some(
        (item) =>
          item.$?.["android:scheme"] === "upi"
      );

      return action && scheme;
    });

    if (!alreadyExists) {
      queries.intent.push({
        action: [
          {
            $: {
              "android:name": "android.intent.action.VIEW",
            },
          },
        ],
        data: [
          {
            $: {
              "android:scheme": "upi",
            },
          },
        ],
      });
    }

    return config;
  });
};

module.exports = withUpiQueries;