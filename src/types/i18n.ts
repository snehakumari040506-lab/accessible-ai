export type SupportedLanguage =
  | "en" // English
  | "hi" // हिन्दी (Hindi)
  | "bn" // বাংলা (Bengali)
  | "te" // తెలుగు (Telugu)
  | "mr" // मराठी (Marathi)
  | "ta" // தமிழ் (Tamil)
  | "gu" // ગુજરાતી (Gujarati)
  | "kn" // ಕನ್ನಡ (Kannada)
  | "ml" // മലയാളം (Malayalam)
  | "pa" // ਪੰਜਾਬੀ (Punjabi)
  | "or" // ଓଡ଼ିଆ (Odia)
  | "as" // অসমীয়া (Assamese)
  | "ur"; // اردو (Urdu)

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  bcp47: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: "en", name: "English", nativeName: "English", bcp47: "en-IN", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", bcp47: "hi-IN", dir: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", bcp47: "bn-IN", dir: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", bcp47: "te-IN", dir: "ltr" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", bcp47: "mr-IN", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", bcp47: "ta-IN", dir: "ltr" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", bcp47: "gu-IN", dir: "ltr" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", bcp47: "kn-IN", dir: "ltr" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", bcp47: "ml-IN", dir: "ltr" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", bcp47: "pa-IN", dir: "ltr" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", bcp47: "or-IN", dir: "ltr" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", bcp47: "as-IN", dir: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", bcp47: "ur-IN", dir: "rtl" },
];

export const LANGUAGE_METAS: Record<SupportedLanguage, LanguageMeta> = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l])
) as Record<SupportedLanguage, LanguageMeta>;

export type TextZoomLevel = "normal" | "large" | "xlarge" | "xxlarge";
