"use client";

import { toast } from "sonner";
import { Button } from "@/ui/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/primitives/dialog";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
import type { Customer } from "../types";

interface DeleteCustomerDialogProps {
  customer?: Customer;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCustomerDialog({
  customer,
  onOpenChange,
}: DeleteCustomerDialogProps) {
  const deleteCustomer = useDeleteCustomer();

  return (
    <Dialog open={!!customer} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete customer?</DialogTitle>
          <DialogDescription>
            {customer?.name} will be removed. This can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteCustomer.isPending}
            onClick={() => {
              if (!customer) return;
              deleteCustomer.mutate(customer.id, {
                onSuccess: () => {
                  toast.success("Customer deleted");
                  onOpenChange(false);
                },
              });
            }}
          >
            {deleteCustomer.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
