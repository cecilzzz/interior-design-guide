declare interface Window {
  gtag: (
    command: 'event' | 'config' | 'set' | 'js',
    eventName: string,
    eventParams?: {
      [key: string]: any;
    }
  ) => void;
  dataLayer: any[];
} 