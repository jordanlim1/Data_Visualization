import { render, screen } from "@testing-library/react";
import Chart from "./Chart";
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

describe("Chart", () => {
  it("renders the loading spinner when isLoading is true", () => {
    render(
      <Chart
        data={mockData}
        startDate={dayjs("2020-01-01")}
        endDate={dayjs("2020-01-07")}
        display={"downloads"}
        isChartLoading={true} // Simulate loading state
        setIsChartLoading={jest.fn()}
        setIsTableLoading={jest.fn()}
      />,
    );

    // Expect the CircularProgress to be rendered
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders a chart", () => {
    render(
      <Chart
        data={mockData}
        startDate={dayjs("2020-01-01")}
        endDate={dayjs("2020-01-07")}
        display={"downloads"}
        isChartLoading={false}
        setIsChartLoading={jest.fn()}
        setIsTableLoading={jest.fn()}
      />,
    );

    //HighCharts renders the text as an SVG so getByText will not work
    expect(
      screen.getByRole("img", { name: /Downloads by App/i }),
    ).toBeInTheDocument();
  });

  it("renders the title and subtitle", () => {
    render(
      <Chart
        data={mockData}
        startDate={dayjs("2020-01-01")}
        endDate={dayjs("2020-01-07")}
        display={"downloads"}
        isChartLoading={false}
        setIsChartLoading={jest.fn()}
        setIsTableLoading={jest.fn()}
      />,
    );
    expect(screen.getByText("Downloads by App")).toBeInTheDocument();
    //TODO should be removed after finishing assessment?
    // expect(screen.getByText("TODO")).toBeInTheDocument();
  });

  it("renders a chart with Revenue", () => {
    render(
      <Chart
        data={mockData}
        startDate={dayjs("2020-01-01")}
        endDate={dayjs("2020-01-07")}
        display={"revenue"}
        isChartLoading={false}
        setIsChartLoading={jest.fn()}
        setIsTableLoading={jest.fn()}
      />,
    );
    expect(screen.getByText("Revenue by App")).toBeInTheDocument();
  });

  it("renders the correct date range in the subtitle", () => {
    render(
      <Chart
        data={mockData}
        startDate={dayjs("2023-01-01")}
        endDate={dayjs("2023-01-07")}
        display={"downloads"}
        isChartLoading={false}
        setIsChartLoading={jest.fn()}
        setIsTableLoading={jest.fn()}
      />,
    );
    expect(screen.getByText("Jan 01, 2023 - Jan 07, 2023")).toBeInTheDocument();
  });

  it("does not render a chart if data is empty", () => {
    render(
      <Chart
        data={[]}
        startDate={dayjs("2020-01-01")}
        endDate={dayjs("2020-01-07")}
        display={"downloads"}
        isChartLoading={false}
        setIsChartLoading={jest.fn()}
        setIsTableLoading={jest.fn()}
      />,
    );
    expect(screen.queryByText("Downloads")).not.toBeInTheDocument();
  });
});
