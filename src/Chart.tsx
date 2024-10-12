import { useEffect, useRef, useState } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { Response } from "./types";
import { dayjsUtc } from "./dayjs";
import { Dayjs } from "dayjs";

type ChartProps = {
  data: Response;
  startDate: Dayjs;
  endDate: Dayjs;
  display: string;
};

const Chart = ({ data, startDate, endDate, display }: ChartProps) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [seriesData, setSeriesData] = useState<Highcharts.SeriesOptionsType[]>(
    [],
  );

  function updateSeriesData() {
    const newSeriesData: Highcharts.SeriesOptionsType[] = data.map((series) => {
      return {
        name: series.name,
        type: "line",
        data: series.data.map(([date, downloads, revenue]) => {
          const dateMs = dayjsUtc(date).valueOf(); // convert date string to unix milliseconds
          const yValue = display === "downloads" ? downloads : revenue;
          return {
            x: dateMs,
            y: yValue as number,
          };
        }),
      };
    });
    setSeriesData(newSeriesData);
  }

  useEffect(() => {
    updateSeriesData();
  }, [data]);

  if (!seriesData.length) {
    return null;
  }

  const displayText = display === "downloads" ? "Downloads" : "Revenue";

  const options: Highcharts.Options = {
    title: {
      text: `${displayText} by App`,
    },
    subtitle: {
      text: `${startDate.format("MMM DD, YYYY")} - ${endDate.format("MMM DD, YYYY")}`,
    },
    yAxis: {
      title: {
        text: displayText,
      },
    },
    xAxis: {
      type: "datetime",
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
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
    />
  );
};

export default Chart;
