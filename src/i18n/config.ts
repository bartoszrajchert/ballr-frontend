import translation from '@/i18n/pl/translation.json';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  pl: {
    translation,
  },
};

i18next.use(initReactI18next).init({
  lng: 'pl', // if you're using a language detector, do not define the lng option
  debug: true,
  resources,
});
