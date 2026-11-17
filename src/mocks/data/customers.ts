export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive";
  createdAt: string;
}

const people = [
  ["Ava Thompson", "Northwind Traders"],
  ["Liam Carter", "Globex"],
  ["Sophia Nguyen", "Initech"],
  ["Noah Patel", "Umbrella Health"],
  ["Mia Rossi", "Stark Logistics"],
  ["Ethan Brooks", "Wayne Foods"],
  ["Isabella Silva", "Acme Corp"],
  ["Lucas Meyer", "Hooli"],
  ["Amelia Khan", "Vandelay Imports"],
  ["Oliver Chen", "Soylent Labs"],
  ["Harper Diaz", "Cyberdyne"],
  ["Elijah Novak", "Tyrell Systems"],
  ["Charlotte Park", "Massive Dynamic"],
  ["James O'Neil", "Pied Piper"],
  ["Evelyn Sato", "Aperture Science"],
  ["Benjamin Ali", "Oscorp"],
  ["Abigail Moreau", "Wonka Industries"],
  ["Henry Kowalski", "Blue Sun"],
  ["Emily Fischer", "Gringotts Bank"],
  ["Alexander Ito", "Monarch Solutions"],
  ["Ella Johansson", "Dunder Mifflin"],
  ["Daniel Okafor", "Prestige Worldwide"],
  ["Grace Lindqvist", "Sterling Cooper"],
  ["Jack Romero", "Bluth Company"],
  ["Chloe Dubois", "Los Pollos Hermanos"],
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const SEED_DATE = Date.UTC(2026, 9, 1);

export const customers: MockCustomer[] = people.map(([name, company], i) => ({
  id: `cus_${String(i + 1).padStart(3, "0")}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
  company,
  status: i % 5 === 4 ? "inactive" : "active",
  createdAt: new Date(SEED_DATE - i * 3 * DAY_MS).toISOString(),
}));
