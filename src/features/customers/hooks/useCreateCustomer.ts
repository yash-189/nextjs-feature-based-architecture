import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { createCustomer } from "../api";
import { customerKeys } from "../queries";
import type { CustomerFormValues } from "../schemas";

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CustomerFormValues) =>
      createCustomer(clientHttp, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() }),
  });
}
