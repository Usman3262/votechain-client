// src/types/window.d.ts

interface Window {
  ethereum?: {
    isMetaMask?: true;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (data: any) => void) => void;
    removeListener: (event: string, handler: (data: any) => void) => void;
    chainId?: string;
    selectedAddress?: string;
  };
}