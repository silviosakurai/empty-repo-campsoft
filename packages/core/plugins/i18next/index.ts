import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { plugin, LanguageDetector } from "i18next-http-middleware";
import path = require("path");

async function i18nextPlugin(fastify: FastifyInstance) {
  const localesPath = path.join(
    __dirname,
    "locales",
    "{{lng}}",
    "translation.json"
  );

  i18next
    .use(Backend)
    .use(LanguageDetector)
    .init({
      fallbackLng: "pt",
      backend: {
        loadPath: localesPath,
      },
      interpolation: {
        escapeValue: false,
      },
    });

  fastify.register(plugin, {
    i18next,
  });
}

export default fp(i18nextPlugin);
