export const useDateOptions = () => {
  const days = Array.from({length: 31},
    (_, i) =>
      (i + 1).toString().padStart(2,
        "0"));
  const months = Array.from({length: 12},
    (_, i) =>
      (i + 1).toString().padStart(2,
        "0"));
  const years = Array.from(
    {length: 100},
    (_, i) => new Date().getFullYear() - i
  );

  return {days, months, years};
};