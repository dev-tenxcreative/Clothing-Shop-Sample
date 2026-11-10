import type { CategorySlug } from "./types";

export type SizeRow = { size: string; uk: string; eu: string; bust?: string; waist: string; hip: string; length?: string };

const base: SizeRow[] = [
  { size: "XS", uk: "6", eu: "34", bust: "80–83", waist: "62–65", hip: "87–90" },
  { size: "S", uk: "8", eu: "36", bust: "84–87", waist: "66–69", hip: "91–94" },
  { size: "M", uk: "10", eu: "38", bust: "88–92", waist: "70–74", hip: "95–99" },
  { size: "L", uk: "12", eu: "40", bust: "93–97", waist: "75–79", hip: "100–104" },
  { size: "XL", uk: "14", eu: "42", bust: "98–103", waist: "80–85", hip: "105–110" },
  { size: "XXL", uk: "16", eu: "44", bust: "104–110", waist: "86–92", hip: "111–117" },
];

const withLength = (lengths: string[]) => base.map((r, i) => ({ ...r, length: lengths[i] }));

export const sizeTables: Record<CategorySlug, { title: string; note: string; rows: SizeRow[]; columns: (keyof SizeRow)[] }> = {
  frocks: {
    title: "Frocks",
    note: "Midi length measured from the high point of the shoulder.",
    rows: withLength(["108", "110", "112", "114", "116", "118"]),
    columns: ["size", "uk", "eu", "bust", "waist", "hip", "length"],
  },
  dresses: {
    title: "Dresses",
    note: "Maxi length measured from the high point of the shoulder.",
    rows: withLength(["140", "142", "144", "146", "148", "150"]),
    columns: ["size", "uk", "eu", "bust", "waist", "hip", "length"],
  },
  blouses: {
    title: "Blouses",
    note: "Relaxed fits are designed with 8–12cm of ease at the bust.",
    rows: withLength(["60", "62", "64", "66", "68", "70"]),
    columns: ["size", "uk", "eu", "bust", "waist", "length"],
  },
  skirts: {
    title: "Skirts",
    note: "Midi skirt length measured from the waistband.",
    rows: withLength(["76", "78", "80", "82", "84", "86"]),
    columns: ["size", "uk", "eu", "waist", "hip", "length"],
  },
  pants: {
    title: "Pants",
    note: "Inside leg measured from crotch seam to hem.",
    rows: withLength(["76", "77", "78", "79", "80", "81"]).map((r) => ({ ...r })),
    columns: ["size", "uk", "eu", "waist", "hip", "length"],
  },
};

export const columnLabels: Record<keyof SizeRow, string> = {
  size: "Size",
  uk: "UK",
  eu: "EU",
  bust: "Bust (cm)",
  waist: "Waist (cm)",
  hip: "Hip (cm)",
  length: "Length (cm)",
};

export const measureGuide = [
  { title: "Bust", body: "Measure around the fullest part of your bust, keeping the tape parallel to the floor." },
  { title: "Waist", body: "Measure around the narrowest part of your natural waistline, usually just above the navel." },
  { title: "Hip", body: "Stand with feet together and measure around the fullest part of your hips." },
  { title: "Length", body: "For tops and dresses, measure from the high point of the shoulder down to the hem." },
];
