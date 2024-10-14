import { Dayjs } from "dayjs";
import { SetStateAction } from "react";

export type Response = {
  id: number;
  name: string;
  icon: string;
  data: [date: string, downloads: number, revenue: number][];
}[];

export type ChartProps = {
  data: Response;
  startDate: Dayjs;
  endDate: Dayjs;
  display: string;
  isChartLoading: boolean;
  setIsChartLoading: React.Dispatch<SetStateAction<boolean>>;
  setIsTableLoading: React.Dispatch<SetStateAction<boolean>>;
};

export type TableProps = {
  data: Response;
  startDate: Dayjs;
  endDate: Dayjs;
  isTableLoading: boolean;
};

export type RowProps = {
  id: number;
  appName: { appName: string; src: string };
  downloads: string;
  revenue: string;
  RPD: string;
};
