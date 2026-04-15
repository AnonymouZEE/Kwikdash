/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  MoreVertical, 
  Moon, 
  SunMedium, 
  Mic,
  PhoneIncoming,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// --- Types ---

interface Contact {
  id: string;
  name: string;
  number: string;
  color: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  forecast: { day: string; temp: number; condition: string }[];
}

// --- Mock Data ---

const MOST_USED_CONTACTS: Contact[] = [
  { id: '1', name: 'Mom', number: '555-0101', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { id: '2', name: 'Dad', number: '555-0102', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { id: '3', name: 'Sarah', number: '555-0103', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { id: '4', name: 'Work', number: '555-0104', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
];

const RECENT_CALLS: Contact[] = [
  { id: '5', name: 'John Doe', number: '555-0201', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { id: '6', name: 'Spam Risk', number: '555-9999', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  { id: '7', name: 'Pizza Hut', number: '555-0301', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  { id: '8', name: 'Dentist', number: '555-0401', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' },
];

// --- Components ---

interface ContactButtonProps {
  contact: Contact;
  label?: string;
  onClick: () => void;
  key?: string | number;
}

const ContactButton = ({ contact, label, onClick }: ContactButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center w-full h-[84px] rounded-[24px] p-2 shadow-sm transition-all border border-black/5 bg-card hover:bg-accent/50 shrink-0",
    )}
  >
    <div className={cn(
      "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-1 text-white shrink-0",
      contact.color.split(' ')[0]
    )}>
      {useTranslation().t(contact.name).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </div>
    <span className="text-[12px] font-semibold truncate w-full text-center text-foreground leading-tight px-1">{useTranslation().t(contact.name)}</span>
    {label && <span className="text-[8px] opacity-60 mt-0.5 uppercase tracking-wider font-bold text-muted-foreground leading-none">{useTranslation().t(label)}</span>}
  </motion.button>
);

export default function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- Theme Logic ---
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme]);

  // --- Weather Logic ---
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using Open-Meteo (Free, no key)
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&daily=weathercode,temperature_2m_max&current_weather=true&timezone=auto');
        const data = await res.json();
        
        const conditionMap: Record<number, string> = {
          0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
          45: 'Fog', 48: 'Fog', 51: 'Drizzle', 61: 'Rain', 71: 'Snow', 80: 'Rain Showers', 95: 'Thunderstorm'
        };

        const weatherData: WeatherData = {
          temp: Math.round(data.current_weather.temperature),
          condition: conditionMap[data.current_weather.weathercode] || 'Cloudy',
          forecast: data.daily.time.slice(1, 3).map((date: string, i: number) => ({
            day: new Date(date).toLocaleDateString(i18n.language, { weekday: 'short' }),
            temp: Math.round(data.daily.temperature_2m_max[i + 1]),
            condition: conditionMap[data.daily.weathercode[i + 1]] || 'Cloudy'
          }))
        };
        setWeather(weatherData);
      } catch (err) {
        console.error("Weather fetch failed", err);
      }
    };
    fetchWeather();
  }, [i18n.language]);

  // --- Speech Logic ---
  const speakDigest = useCallback(() => {
    if (!weather || isSpeaking) return;

    const text = t('weather_digest', {
      temp: weather.temp,
      condition: weather.condition,
      tomorrowTemp: weather.forecast[0].temp,
      dayAfterTemp: weather.forecast[1].temp
    });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [weather, t, i18n.language, isSpeaking]);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      case 'rain': 
      case 'drizzle': return <CloudRain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      case 'thunderstorm': return <CloudLightning className="w-6 h-6 sm:w-7 sm:h-7 text-white" />;
      default: return <Cloud className="w-6 h-6 sm:w-7 sm:h-7 text-white/80" />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#202124] flex justify-center items-center overflow-hidden p-1 sm:p-2">
      <div className="w-[340px] h-[720px] bg-background rounded-[32px] relative shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-[6px] border-black p-3 flex flex-col overflow-hidden font-sans transition-all duration-500">
        {/* Header */}
        <header className="flex justify-between items-center mb-2 shrink-0">
          <div className="text-xs font-semibold text-foreground">
            {new Date().toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2 text-xs">
                <SunMedium className="w-3 h-3" /> {t('light_mode')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2 text-xs">
                <Moon className="w-3 h-3" /> {t('dark_mode')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2 text-xs">
                <div className="w-3 h-3 border-2 border-current rounded-full border-t-transparent animate-spin" /> {t('system_theme')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden justify-between py-2">
          
          {/* Section 1: Most Used */}
          <section className="shrink-0">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">
              {t('most_used')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {MOST_USED_CONTACTS.map(contact => (
                <ContactButton 
                  key={contact.id} 
                  contact={contact} 
                  onClick={() => handleCall(contact.number)} 
                />
              ))}
            </div>
          </section>

          {/* Section 2: Weather */}
          <section className="shrink-0 px-1 relative">
            {/* AI Assistant - Center of circle at the border of weather */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[28px] flex flex-col items-center z-20">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-xl border-none ring-4 ring-primary/20"
                onClick={() => alert("Launching AI Assistant...")}
              >
                <img 
                  src="https://img.icons8.com/ios/200/owl.png" 
                  alt="AI Assistant"
                  className="w-full h-full object-cover object-[center_20%]"
                  referrerPolicy="no-referrer"
                />
              </motion.button>
              <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[8px] font-bold shadow-md pointer-events-none uppercase tracking-widest mt-1">
                AI
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <Card 
                className="overflow-hidden border-none bg-primary text-primary-foreground rounded-[24px] cursor-pointer shadow-lg"
                onClick={speakDigest}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[10px] opacity-80 font-medium">{t('London')}</div>
                      <div className="text-2xl font-light tracking-tight">
                        {weather ? `${weather.temp}°C` : '--°C'}
                      </div>
                    </div>
                    {weather ? getWeatherIcon(weather.condition) : <Cloud className="w-8 h-8 animate-pulse opacity-50" />}
                  </div>

                  {/* Forecast */}
                  <div className="flex justify-between pt-3 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-[9px] font-bold uppercase opacity-70">Today</div>
                      <div className="text-[11px] font-medium">{weather?.condition || '...'}</div>
                    </div>
                    {weather?.forecast.map((f, i) => (
                      <div key={i} className="text-center">
                        <div className="text-[9px] font-bold uppercase opacity-70">{f.day}</div>
                        <div className="text-[11px] font-medium">{f.temp}°</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Section 3: Recent Calls */}
          <section className="shrink-0">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">
              {t('recent_calls')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {RECENT_CALLS.map(contact => (
                <ContactButton 
                  key={contact.id} 
                  contact={contact} 
                  onClick={() => handleCall(contact.number)} 
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Speaking Indicator */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  className="w-1 bg-current rounded-full"
                />
              ))}
            </div>
            <span className="text-sm font-bold tracking-wide uppercase">Speaking...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
