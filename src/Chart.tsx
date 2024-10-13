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
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
};

const Chart = ({
  data,
  startDate,
  endDate,
  display,
  isLoading,
  setIsLoading,
}: ChartProps) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [seriesData, setSeriesData] = useState<Highcharts.SeriesOptionsType[]>(
    [],
  );

  useEffect(() => {
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
      setIsLoading(false);
    }, 800);
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
      style={{
        minHeight: 200,
        alignContent: "center",
      }}
    >
      {isLoading ? (
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
