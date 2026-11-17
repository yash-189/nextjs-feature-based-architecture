import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { updateOrderStatus } from "../api/orders.api";
import { orderKeys } from "../queries/keys";
import type { Order, OrderStatus } from "../types/order.types";

// Optimistic: the new status shows at once and rolls back if the save fails.
export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  const key = orderKeys.detail(id);

  return useMutation({
    mutationFn: (status: OrderStatus) =>
      updateOrderStatus(clientHttp, id, status),
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Order>(key);
      if (previous) queryClient.setQueryData(key, { ...previous, status });
      return { previous };
    },
    onError: (_error, _status, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
