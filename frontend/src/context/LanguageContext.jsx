import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Load language from localStorage or default to 'en'
    const [lang, setLangState] = useState(localStorage.getItem('mandiLang') || 'en');

    const setLang = (newLang) => {
        setLangState(newLang);
        localStorage.setItem('mandiLang', newLang);
    };

    /**
     * Helper to get translated strings.
     * Supports nested keys like 'landing.heroTitle'
     */
    const t = useCallback((key) => {
        const keys = key.split('.');
        let translation = TRANSLATIONS[lang];

        for (const k of keys) {
            if (translation && translation[k] !== undefined) {
                translation = translation[k];
            } else {
                // Fallback to English if key doesn't exist in current language
                let fallback = TRANSLATIONS['en'];
                for (const fk of keys) {
                    if (fallback && fallback[fk] !== undefined) {
                        fallback = fallback[fk];
                    } else {
                        return key; // Return key itself if not found in English either
                    }
                }
                return fallback;
            }
        }
        return translation;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};