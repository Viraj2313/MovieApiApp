export const useOpenLink = () => {
  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return openLink;
};
