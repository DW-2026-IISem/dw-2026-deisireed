import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/** Estética TazaNorte: crema + café caramelo + espresso, botones redondeados. */
export const TazaNortePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fbf3ec',
      100: '#f3e1d0',
      200: '#e6c2a1',
      300: '#d49e72',
      400: '#b97a4c',
      500: '#8b4a2b',
      600: '#74391f',
      700: '#5e2d18',
      800: '#472213',
      900: '#3b2416',
      950: '#24150c',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fdf8f3',
          100: '#f6ede3',
          200: '#ead9c8',
          300: '#d9c1aa',
          400: '#b9997c',
          500: '#93735a',
          600: '#735640',
          700: '#58402f',
          800: '#3f2c20',
          900: '#2b1d14',
          950: '#1a110b',
        },
      },
    },
  },
  components: {
    button: { root: { borderRadius: '9999px' } },
    card: { root: { borderRadius: '1.5rem' } },
    dialog: { root: { borderRadius: '1.5rem' } },
  },
});
