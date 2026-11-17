import { Badge } from "@/ui/primitives/badge";
import type { CustomerStatus } from "../types";

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <Badge variant={status === "active" ? "secondary" : "outline"}>
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  );
}
