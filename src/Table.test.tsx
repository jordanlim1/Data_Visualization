import { render, screen } from "@testing-library/react";
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

  it("renders the correct rows based on provided data", () => {
    render(
      <Table
        data={mockData}
        startDate={dayjs("2020-01-07")}
        endDate={dayjs("2020-01-07")}
        isLoading={false}
        setIsLoading={jest.fn()}
      />,
    );

    expect(screen.getByText("App 1")).toBeInTheDocument();
    expect(screen.getByText("App 2")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument(); // Downloads for App 1
    expect(screen.getByText("250")).toBeInTheDocument(); // Downloads for App 2
  });
});
