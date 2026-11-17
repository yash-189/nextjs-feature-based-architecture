import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { updateCustomer } from "../api";
import { customerKeys } from "../queries";
import type { CustomerFormValues } from "../schemas";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CustomerFormValues }) =>
      updateCustomer(clientHttp, id, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() }),
  });
}
