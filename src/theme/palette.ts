import { PaletteColorOptions } from '@mui/material/styles';
import { gray, darkGray, transparentGray, red, green, blue, yellow, white } from './colors';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    neutral?: PaletteColorOptions;
    transparent?: {
      gray: PaletteColorOptions;
    };
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface Palette {
    neutral: PaletteColor;
    transparent: {
      gray: PaletteColor;
    };
  }
}

// Augmenting PaletteColorOptions type in MUI 5 can be tricky because it's a union type. 
// We just use `any` casting or ignore TS error for `lighter` if we really have to, 
// but extending `SimplePaletteColorOptions` and `PaletteColor` is usually enough.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const palette: any = {
  mode: 'dark',
  neutral: {
    lighter: gray[700],
    light: gray[600],
    main: gray[400],
    darker: gray[200],
  },
  primary: {
    light: blue[300],
    main: blue[500],
    dark: blue[700],
  },
  secondary: {
    light: blue[300],
    main: blue[600],
    dark: blue[800],
  },
  info: {
    lighter: white[100],
    light: white[200],
    main: darkGray[600],   // #141522 — card/surface bg
    dark: darkGray[700],   // #0E0F1D
    darker: darkGray[800], // #0A0A18
  },
  success: {
    light: green[300],
    main: green[500],
    dark: green[700],
  },
  warning: {
    light: yellow[300],
    main: yellow[500],
    dark: yellow[700],
  },
  error: {
    light: red[300],
    main: red[500],
    dark: red[700],
  },
  text: {
    primary: white[300],        // #F5F5F7
    secondary: gray[300],       // #8E92BC
    disabled: gray[400],        // #54577A
  },
  background: {
    default: darkGray[800],     // #0A0A18
    paper: darkGray[600],       // #141522
  },
  divider: gray[800],           // #323449
  transparent: {
    gray: {
      main: transparentGray[500],
    },
  },
};

export default palette;
