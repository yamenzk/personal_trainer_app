// src/types/frappe.d.ts
interface FrappeBoot {
    versions: {
      frappe: string;
    };
    sitename?: string;
  }
  
  interface Frappe {
    boot: FrappeBoot;
  }
  
  declare global {
    interface Window {
      frappe?: Frappe;
    }
  }
  
  export {};