type MapSearchHandler = (query?: string) => void;

let currentHandler: MapSearchHandler | null = null;
let pendingQuery: string | undefined;
let hasPending = false;

export function registerMapSearchHandler(handler: MapSearchHandler) {
  currentHandler = handler;
  if (hasPending) {
    handler(pendingQuery);
    hasPending = false;
    pendingQuery = undefined;
  }
  return () => {
    if (currentHandler === handler) {
      currentHandler = null;
    }
  };
}

export function triggerMapSearch(query?: string) {
  if (currentHandler) {
    currentHandler(query);
  } else {
    pendingQuery = query;
    hasPending = true;
  }
}
