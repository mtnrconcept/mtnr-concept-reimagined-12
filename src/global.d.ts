
interface Window {
  __videoReady: boolean;
  __videoAssetsPreloaded: boolean;
  __forcePrecacheVideos: () => Promise<void>;
}
