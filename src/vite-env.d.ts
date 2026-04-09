/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaletteColorOptions, PaletteColor } from '@mui/material/styles';

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
