let showLoader: (() => void) | null = null;
let hideLoader: (() => void) | null = null;

export const registerLoader = (show: () => void, hide: () => void) => {
  showLoader = show;
  hideLoader = hide;
};

export const startLoader = () => {
  showLoader?.();
};

export const stopLoader = () => {
  hideLoader?.();
};