export const shortenEOAName = (name: string | undefined) => {
  if (!name) return undefined;
  if (name.startsWith('0x')) {
    return `${name.substring(0, 4)}...${name.substring(
      name.length - 4,
      name.length,
    )}`;
  }
  return name;
};
