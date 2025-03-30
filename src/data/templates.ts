
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
  textWidth?: number;
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
    textWidth?: number;
  };
}

const templates: Template[] = [
  {
    id: "ph-1",
    name: "PH-001",
    imageUrl: "https://i.postimg.cc/gj7BSJJ9/ph-1.jpg",
    width: 735,
    height: 490,
    defaultText: "ঈদ মোবারক",
    defaultTextColor: "#d8b5f5",
    defaultFont: "Li Sweet Shreyam Unicode",
    defaultFontSize: 60,
    textPosition: { x: -0.1, y: 0.2},
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
    },
    category: 'eid-al-fitr',
    greetingDetails: {
      text: "ঈদের অনাবিল আনন্দে ভরে উঠুক প্রতিটি হৃদয়। আপনার জীবনের প্রতিটি দিন ছেয়ে যাক ঈদের খুশিতে।",
      color: "#b79ac9",
      font: "Kalpurush",
      fontSize: 24,
      textWidth: 55,
      position: { x: 0.03, y: 0.35 },
    },
  },
  {
    id: "ph-2",
    name: "PH-002",
    imageUrl: "https://i.postimg.cc/QCWxnFb1/image.png",
    width: 735,
    height: 690,
    defaultText: "ঈদ মোবারক",
    defaultTextColor: "#d8b5f5",
    defaultFont: "Li Sweet Shreyam Unicode",
    defaultFontSize: 60,
    textPosition: { x: 0.14, y: 0.27},
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
    },
    category: 'eid-al-fitr',
    greetingDetails: {
      text: "ঈদের অনাবিল আনন্দে ভরে উঠুক প্রতিটি হৃদয়। আপনার জীবনের প্রতিটি দিন ছেয়ে যাক ঈদের খুশিতে।",
      color: "#b79ac9",
      font: "Kalpurush",
      fontSize: 24,
      textWidth: 45,
      position: { x: 0.30, y: 0.40 },
    },
  },
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
    width: 800,
    height: 800,
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
    width: 1080,
    height: 1080,
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
