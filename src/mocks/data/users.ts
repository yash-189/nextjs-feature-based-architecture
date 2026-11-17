import { DEMO_CREDENTIALS } from "../constants";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const users: MockUser[] = [
  {
    id: "usr_demo",
    name: "Demo User",
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
  },
];
