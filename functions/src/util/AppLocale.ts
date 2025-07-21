import * as path from "path";
import { Request } from "express";

const { I18n } = require("i18n");

const i18n = new I18n({
  locales: ["en", "ar"],
  objectNotation: true,
  directory: path.join(process.cwd(), "src", "locales"),
});

export class AppLocale {
  static translate(key: string, locale = "ar", replace: any = null) {
    return i18n.__({ phrase: key, locale: locale }, replace);
  }

  static translateBasedOnReqHeader(key: string, req: Request) {
    const locale = req.header("accept-language") || "ar";
    return AppLocale.translate(key, locale);
  }

  static translateWithLocales(
    key: string,
    locales: string[] = [],
    replace: any = null
  ) {
    const translations = [];
    for (const locale of locales) {
      translations.push({
        locale,
        value: i18n.__({ phrase: key, locale: locale }, replace),
      });
    }
    return translations;
  }
}
