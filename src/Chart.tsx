import React, { SetStateAction, useEffect, useRef, useState } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { Response } from "./types";
import { dayjsUtc } from "./dayjs";
import { Dayjs } from "dayjs";
import Loading from "./Loading";
type ChartProps = {
  data: Response;
  startDate: Dayjs;
  endDate: Dayjs;
  display: string;
  isChartLoading: boolean;
  setIsChartLoading: React.Dispatch<SetStateAction<boolean>>;
  setIsTableLoading: React.Dispatch<SetStateAction<boolean>>;
};

const Chart = ({
  data,
  startDate,
  endDate,
  display,
  isChartLoading,
  setIsChartLoading,
  setIsTableLoading,
}: ChartProps) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [seriesData, setSeriesData] = useState<Highcharts.SeriesOptionsType[]>(
    [],
  );
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    //add setTimeout to make sure loading state is visible
    setTimeout(() => {
      const filteredAppData = data.map((app) => ({
        ...app,
        data: app.data.filter(([date]) => {
          const dateMs = dayjsUtc(date).valueOf();
          const startDateMs = dayjsUtc(
            startDate.format("YYYY-MM-DD"),
          ).valueOf();
          const endDateMs = dayjsUtc(endDate.format("YYYY-MM-DD")).valueOf();
          return dateMs >= startDateMs && dateMs <= endDateMs;
        }),
      }));

      const hasData = filteredAppData.some((app) => app.data.length > 0);
      setNoData(!hasData);

      const newSeriesData: Highcharts.SeriesOptionsType[] = filteredAppData.map(
        (series) => ({
          name: series.name,
          type: "line",
          data: series.data.map(([date, downloads, revenue]) => {
            const dateMs = dayjsUtc(date).valueOf(); // convert date string to unix milliseconds

            const yValue = display === "downloads" ? downloads : revenue / 100;

            return {
              x: dateMs,
              y: yValue as number,
            };
          }),
        }),
      );

      setSeriesData(newSeriesData);
      setIsChartLoading(false);
      setIsTableLoading(false);
    }, 500);
  }, [data, startDate, endDate, display]);

  if (!data.length) {
    return (
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          height: 400,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />;
      </div>
    );
  }

  //handle edge case if user selects outside of valid date range
  if (noData && seriesData.length) {
    return (
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          height: 400,
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        <p> No data available for the selected date range </p>
      </div>
    );
  }

  const options: Highcharts.Options = {
    title: {
      text: `${display === "downloads" ? "Downloads" : "Revenue"} by App`,
    },
    subtitle: {
      text: `${startDate.format("MMM DD, YYYY")} - ${endDate.format("MMM DD, YYYY")}`,
    },
    yAxis: {
      title: {
        text: display === "downloads" ? "Downloads" : "Revenue ($)",
      },
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        day: "%b %d, %y", // formats the date as 'Jan 01, 20'
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
    series: seriesData,
  };

  return (
    <div
      data-testid="chart-component"
      style={{
        minHeight: 200,
        alignContent: "center",
      }}
    >
      {isChartLoading ? (
        <Loading />
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />
      )}
    </div>
  );
};

export default Chart;
