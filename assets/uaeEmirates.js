export const uaeEmirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export const isUAECountry = (country = "") => {
  const value = String(country).toLowerCase();
  return value === "uae" || value.includes("united arab emirates");
};
