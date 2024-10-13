import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import useData from "./useData";

jest.mock("./useData");

const mockData = [
  {
    id: 1,
    name: "App 1",
    icon: "https://example.com/icon.png",
    data: [
      ["2023-01-01", 100, 200],
      ["2023-01-02", 200, 300],
    ],
  },
];

beforeEach(() => {
  (useData as jest.Mock).mockReturnValue(mockData);
});

describe("App", () => {
  it("renders start and end date inputs", () => {
    render(<App />);

    expect(screen.getByText(/start date/i)).toBeInTheDocument();
    expect(screen.getByText(/end date/i)).toBeInTheDocument();
  });

  it("renders the Table and Chart components", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("chart-component")).toBeInTheDocument();
      expect(screen.getByTestId("table-component")).toBeInTheDocument();
    });
  });
});
