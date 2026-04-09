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
    state?: string;
  }
  interface PaletteColorOptions {
    lighter?: string;
    darker?: string;
    state?: string;
  }
  interface Palette {
    neutral: PaletteColor;
    transparent: {
      gray: PaletteColor;
    };
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
    state: string;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    neutral?: PaletteColorOptions;
    transparent?: {
      gray: PaletteColorOptions;
    };
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    state?: string;
  }
  interface PaletteColorOptions {
    lighter?: string;
    darker?: string;
    state?: string;
  }
  interface Palette {
    neutral: PaletteColor;
    transparent: {
      gray: PaletteColor;
    };
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
    state: string;
  }
}
export {};
