import { createSlice } from '@reduxjs/toolkit';

function resolveInitialTheme() {
  const storedTheme = localStorage.getItem('theme');

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveInitialLanguage() {
  const storedLanguage = localStorage.getItem('language');

  if (storedLanguage === 'id' || storedLanguage === 'en') {
    return storedLanguage;
  }

  return navigator.language.toLowerCase().startsWith('id') ? 'id' : 'en';
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: {
    theme: resolveInitialTheme(),
    language: resolveInitialLanguage(),
  },
  reducers: {
    setTheme: (state, action) => ({
      ...state,
      theme: action.payload,
    }),
    setLanguage: (state, action) => ({
      ...state,
      language: action.payload,
    }),
  },
});

export const { setLanguage, setTheme } = preferencesSlice.actions;
export default preferencesSlice.reducer;
