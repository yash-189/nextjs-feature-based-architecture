import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { deleteCustomer } from "../api";
import { customerKeys } from "../queries";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(clientHttp, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() }),
  });
}
