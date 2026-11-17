"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ApiError } from "@/lib/http";
import { toast } from "@/lib/toast";
import { Button } from "@/ui/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/primitives/dialog";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";
import { type CustomerFormValues, customerFormSchema } from "../schemas";
import type { Customer } from "../types";

const STATUS_ITEMS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const EMPTY_VALUES: CustomerFormValues = {
  name: "",
  email: "",
  company: "",
  status: "active",
};

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
}: CustomerFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit customer" : "New customer"}
          </DialogTitle>
          <DialogDescription>
            {customer
              ? "Update the customer's details."
              : "Add a customer to your workspace."}
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          key={customer?.id ?? "new"}
          customer={customer}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function CustomerForm({
  customer,
  onDone,
}: {
  customer?: Customer;
  onDone: () => void;
}) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isPending = createCustomer.isPending || updateCustomer.isPending;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          email: customer.email,
          company: customer.company,
          status: customer.status,
        }
      : EMPTY_VALUES,
  });
  const { errors } = form.formState;

  const handlers = {
    onSuccess: () => {
      toast.success(customer ? "Customer updated" : "Customer added");
      onDone();
    },
    onError: (error: Error) => {
      if (!(error instanceof ApiError)) return;
      for (const { field, message } of error.fieldErrors) {
        if (field in EMPTY_VALUES) {
          form.setError(field as keyof CustomerFormValues, { message });
        }
      }
    },
  };

  const onSubmit = form.handleSubmit((values) => {
    if (customer) {
      updateCustomer.mutate({ id: customer.id, values }, handlers);
    } else {
      createCustomer.mutate(values, handlers);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field id="name" label="Name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...form.register("name")}
        />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="off"
          aria-invalid={!!errors.email}
          {...form.register("email")}
        />
      </Field>
      <Field id="company" label="Company" error={errors.company?.message}>
        <Input id="company" autoComplete="off" {...form.register("company")} />
      </Field>
      <Field id="status" label="Status">
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Select
              items={STATUS_ITEMS}
              value={field.value}
              onValueChange={(value) => value && field.onChange(value)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
