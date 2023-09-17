import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json'
import vi from '../locales/vi.json'
import LanguageDetector from 'i18next-browser-languagedetector';

export const languageResources = {
    en: {translation: en},
    vi: {translation: vi}
}
const DETECTION_OPTIONS = {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
};

i18next.use(LanguageDetector).use(initReactI18next).init({
    compatibilityJSON: "v3",
    fallbackLng: "vi",
    resources: languageResources,
    detection: DETECTION_OPTIONS,
    interpolation: {
        escapeValue: false,
    },
});
export default i18next;