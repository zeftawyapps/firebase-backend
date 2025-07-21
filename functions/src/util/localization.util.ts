const translation = require("../../lang/translation.json");

export default class LocalizationUtil {
  static localize(
    key: string,
    replacements: object | null = null,
    lang = "ar"
  ): string {
    let translatedValue: string = translation[lang][key];
    if (replacements) {
      for (const [key, value] of Object.entries(replacements)) {
        translatedValue = translatedValue.replace(key, value);
      }
    }
    return translatedValue;
  }
}
