import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the title, description and action", () => {
    render(
      <EmptyState
        title="No customers yet"
        description="Add your first customer."
        action={<button type="button">Add customer</button>}
      />,
    );
    expect(screen.getByText("No customers yet")).toBeInTheDocument();
    expect(screen.getByText("Add your first customer.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add customer" }),
    ).toBeInTheDocument();
  });

  it("renders only the title when nothing else is given", () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    expect(container).toHaveTextContent(/^Nothing here$/);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
