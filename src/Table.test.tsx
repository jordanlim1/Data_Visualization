import { render, screen, within } from "@testing-library/react";
import Table from "./Table";
import type { Response } from "./types";
import dayjs from "dayjs";

const mockData: Response = [
  {
    id: 1,
    name: "App 1",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 100, 200],
      ["2023-01-02", 200, 300],
    ],
  },
  {
    id: 2,
    name: "App 2",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 150, 250],
      ["2023-01-02", 250, 350],
    ],
  },
];

describe("Table", () => {
  it("renders a table", () => {
    render(
      <Table
        data={mockData}
        startDate={dayjs("2020-01-07")}
        endDate={dayjs("2020-01-07")}
        isLoading={false}
        setIsLoading={jest.fn()}
      />,
    );

    expect(screen.getByText("App Name")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("RPD")).toBeInTheDocument();
  });

  it("renders the loading spinner when isLoading is true", () => {
    render(
      <Table
        data={mockData}
        startDate={dayjs("2023-01-01")}
        endDate={dayjs("2023-01-02")}
        isLoading={true} // Simulate loading state
        setIsLoading={jest.fn()}
      />,
    );

    // Check if the Loading spinner is rendered
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not render a table if data is empty", () => {
    render(
      <Table
        data={[]}
        startDate={dayjs("2020-01-07")}
        endDate={dayjs("2020-01-07")}
        isLoading={false}
        setIsLoading={jest.fn()}
      />,
    );

    expect(screen.queryByText("App Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Downloads")).not.toBeInTheDocument();
  });

  it("formats downloads, revenue, and RPD correctly", () => {
    render(
      <Table
        data={mockData}
        startDate={dayjs("2023-01-01")}
        endDate={dayjs("2023-01-02")}
        isLoading={false}
        setIsLoading={jest.fn()}
      />,
    );

    const rows = screen.getAllByRole("row"); // Get all rows
    const firstRow = within(rows[1]); // First row with data, since row[0] might be headers

    expect(firstRow.getByText("300")).toBeInTheDocument(); // Total downloads for App 2
    expect(firstRow.getByText("$5.00")).toBeInTheDocument(); // Total revenue for App 2
    expect(firstRow.getByText("$0.02")).toBeInTheDocument(); // RPD for App 2
  });

  it("renders the image icons in the table", () => {
    render(
      <Table
        data={mockData}
        startDate={dayjs("2023-01-01")}
        endDate={dayjs("2023-01-02")}
        isLoading={false}
        setIsLoading={jest.fn()}
      />,
    );

    const app1Image = screen.getByAltText("App 1");
    expect(app1Image).toBeInTheDocument();
    expect(app1Image).toHaveAttribute("src", "https://example.com/icon.png");

    const app2Image = screen.getByAltText("App 2");
    expect(app2Image).toBeInTheDocument();
    expect(app2Image).toHaveAttribute("src", "https://example.com/icon.png");
  });
});
