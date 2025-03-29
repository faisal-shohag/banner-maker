
export interface Template {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  defaultText: string;
  defaultTextColor: string;
  defaultFont: string;
  defaultFontSize: number;
  textPosition: { x: number; y: number };
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
  category: 'eid-al-fitr' | 'eid-al-adha' | 'general';
  // Optional greeting details
  greetingDetails?: {
    text: string;
    color: string;
    font: string;
    fontSize: number;
    position: { x: number; y: number };
  };
}

const templates: Template[] = [
  {
    id: "template-1",
    name: "Ocean Eid",
    imageUrl: "https://i.postimg.cc/B6F0y0Ck/image.png",
    width: 1200,
    height: 1200,
    defaultText: "Eid Mubarak!",
    defaultTextColor: "#FFFFFF",
    defaultFont: "Montserrat",
    defaultFontSize: 50,
    textPosition: { x: 0.37, y: 0.2},
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
    },
    category: 'eid-al-fitr',
    greetingDetails: {
      text: "Wishing you peace and joy!",
      color: "#FFFFFF",
      font: "Montserrat",
      fontSize: 24,
      position: { x: 0.37, y: 0.3 },
    },
  },
  {
    id: "template-4",
    name: "Brown Laterns",
    imageUrl: "https://i.postimg.cc/XJL4b0hv/brown.png",
    width: 1200,
    height: 1200,
    defaultText: "Eid Mubarak!",
    defaultTextColor: "#0A866A",
    defaultFont: "Berkshire Swash",
    defaultFontSize: 60,
    textPosition: { x: 0.1, y: 0.35},
    filters: {
      brightness: 95,
      contrast: 110,
      saturation: 95,
    },
    category: 'eid-al-fitr',
    greetingDetails: {
      text: "Wishing you and your family a joyous Eid filled with blessings, peace, and happiness. Eid Mubarak!",
      color: "#FFFFFF",
      font: "Scheherazade New",
      fontSize: 24,
      position: { x: 0.1, y: 0.45 },
    },
  },

  {
    id: "template-palestine",
    name: "Palestine",
    imageUrl: "https://i.postimg.cc/Hsqw5GZn/palestine.png",
    width: 1200,
    height: 1200,
    defaultText: "Eid Mubarak Palestine!",
    defaultTextColor: "#cc2121",
    defaultFont: "Berkshire Swash",
    defaultFontSize: 60,
    textPosition: { x: 0.1, y: 0.12},
    filters: {
      brightness: 95,
      contrast: 110,
      saturation: 95,
    },
    category: 'eid-al-fitr',
    greetingDetails: {
      text: "Your Lord has not taken leave of you, nor has He detested [you]. - (Quran - 93:3)",
      color: "#ebfdfb",
      font: "Scheherazade New",
      fontSize: 24,
      position: { x: 0.1, y: 0.23 },
    },
  },

  

];

export default templates;
