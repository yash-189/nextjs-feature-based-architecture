import { z } from "zod";
import { CUSTOMER_STATUSES } from "./constants";

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(80),
  email: z.email("Enter a valid email"),
  company: z.string().trim().max(80),
  status: z.enum(CUSTOMER_STATUSES),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
