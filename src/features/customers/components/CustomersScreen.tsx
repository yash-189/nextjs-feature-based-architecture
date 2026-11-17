"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/ui/components/feedback/EmptyState";
import { ErrorState } from "@/ui/components/feedback/ErrorState";
import { Pagination } from "@/ui/components/navigation/Pagination";
import { Button } from "@/ui/primitives/button";
import { useCustomerFilters } from "../hooks/useCustomerFilters";
import { useCustomers } from "../hooks/useCustomers";
import type { Customer } from "../types";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { CustomerTable, CustomerTableSkeleton } from "./CustomerTable";
import { CustomerToolbar } from "./CustomerToolbar";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";

type FormState = { open: false } | { open: true; customer?: Customer };

export function CustomersScreen() {
  const { filters, setFilters } = useCustomerFilters();
  const { data, isPending, isError, refetch } = useCustomers(filters);
  const [form, setForm] = useState<FormState>({ open: false });
  const [deleting, setDeleting] = useState<Customer>();

  const hasFilters = filters.search !== "" || filters.status !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm">
            Everyone you sell to, in one place.
          </p>
        </div>
        <Button onClick={() => setForm({ open: true })}>
          <PlusIcon />
          Add customer
        </Button>
      </div>

      <CustomerToolbar filters={filters} onChange={setFilters} />

      {isPending ? (
        <CustomerTableSkeleton />
      ) : isError ? (
        <ErrorState
          title="Couldn't load customers"
          description="Check your connection and try again."
          onRetry={() => refetch()}
        />
      ) : data.items.length === 0 ? (
        hasFilters ? (
          <EmptyState
            title="No matching customers"
            description="Try a different search or status."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ search: "", status: "all" })}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No customers yet"
            description="Add your first customer to get started."
          />
        )
      ) : (
        <>
          <CustomerTable
            customers={data.items}
            onEdit={(customer) => setForm({ open: true, customer })}
            onDelete={setDeleting}
          />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            onPageChange={(page) => setFilters({ ...filters, page })}
            itemLabel={{ one: "customer", other: "customers" }}
          />
        </>
      )}

      <CustomerFormDialog
        open={form.open}
        customer={form.open ? form.customer : undefined}
        onOpenChange={(open) => {
          if (!open) setForm({ open: false });
        }}
      />
      <DeleteCustomerDialog
        customer={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(undefined);
        }}
      />
    </div>
  );
}
