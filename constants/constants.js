export const POULTRY_TYPES = {
  BROILER: "Broiler",
  LAYER: "Layer",
  HEN: "Hen",
  BIRDS: "Birds"
};

export const EXPENSE_CATEGORIES = [
  "Feed",
  "Medicine",
  "Vaccination",
  "Labor",
  "Equipment",
  "Utilities",
  "Transport",
  "Other",
];

export const Units = [
"KG",
"GRAMS",
"LITTERS",
"BOX",
"NUMBERS",
]

export const formatCurrency = (amount) => {
  return `${parseFloat(amount || 0).toFixed(2)}/RS`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN");
};

export const calculateAge = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
};
