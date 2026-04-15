import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "most_used": "Most Used",
      "recent_calls": "Recent Calls",
      "weather_digest": "Today is {{temp}}°C with {{condition}}. Tomorrow will be {{tomorrowTemp}}°C and the day after {{dayAfterTemp}}°C.",
      "ai_assistant": "AI Assistant",
      "light_mode": "Light Mode",
      "dark_mode": "Dark Mode",
      "system_theme": "System Theme",
      "settings": "Settings",
      "call": "Call {{name}}",
      "weather_title": "Weather",
      "forecast": "3-Day Forecast",
      "Mom": "Mom",
      "Dad": "Dad",
      "Sarah": "Sarah",
      "Work": "Work",
      "John Doe": "John Doe",
      "Spam Risk": "Spam Risk",
      "Pizza Hut": "Pizza Hut",
      "Dentist": "Dentist",
      "London": "London, UK"
    }
  },
  es: {
    translation: {
      "most_used": "Más Usados",
      "recent_calls": "Llamadas Recientes",
      "weather_digest": "Hoy hace {{temp}}°C con {{condition}}. Mañana hará {{tomorrowTemp}}°C y el día siguiente {{dayAfterTemp}}°C.",
      "ai_assistant": "Asistente AI",
      "light_mode": "Modo Claro",
      "dark_mode": "Modo Oscuro",
      "system_theme": "Tema del Sistema",
      "settings": "Ajustes",
      "call": "Llamar a {{name}}",
      "weather_title": "Clima",
      "forecast": "Pronóstico de 3 días",
      "Mom": "Mamá",
      "Dad": "Papá",
      "Sarah": "Sarah",
      "Work": "Trabajo",
      "John Doe": "Juan Pérez",
      "Spam Risk": "Riesgo de Spam",
      "Pizza Hut": "Pizza Hut",
      "Dentist": "Dentista",
      "London": "Londres, RU"
    }
  },
  fr: {
    translation: {
      "most_used": "Plus Utilisés",
      "recent_calls": "Appels Récents",
      "weather_digest": "Aujourd'hui il fait {{temp}}°C avec {{condition}}. Demain il fera {{tomorrowTemp}}°C et le jour suivant {{dayAfterTemp}}°C.",
      "ai_assistant": "Assistant IA",
      "light_mode": "Mode Clair",
      "dark_mode": "Mode Sombre",
      "system_theme": "Thème Système",
      "settings": "Paramètres",
      "call": "Appeler {{name}}",
      "weather_title": "Météo",
      "forecast": "Prévisions sur 3 jours",
      "Mom": "Maman",
      "Dad": "Papa",
      "Sarah": "Sarah",
      "Work": "Travail",
      "John Doe": "Jean Dupont",
      "Spam Risk": "Risque de Spam",
      "Pizza Hut": "Pizza Hut",
      "Dentist": "Dentiste",
      "London": "Londres, RU"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
