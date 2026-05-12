export const locales = ["en", "th", "zh", "vi", "km", "lo", "my"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, { native: string; english: string; flag: string }> = {
  en: { native: "English", english: "English", flag: "🇬🇧" },
  th: { native: "ไทย", english: "Thai", flag: "🇹🇭" },
  zh: { native: "中文", english: "Chinese", flag: "🇨🇳" },
  vi: { native: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
  km: { native: "ខ្មែរ", english: "Khmer", flag: "🇰🇭" },
  lo: { native: "ລາວ", english: "Lao", flag: "🇱🇦" },
  my: { native: "မြန်မာ", english: "Burmese", flag: "🇲🇲" },
};
