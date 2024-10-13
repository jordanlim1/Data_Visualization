import Chart from "./Chart";
import Table from "./Table";
import useData from "./useData";
import "./App.css";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";

const App = () => {
  const data = useData();
  const [startDate, setStartDate] = useState<Dayjs>(dayjs("2020-01-01"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs("2020-01-07"));
  const [display, setDisplay] = useState("downloads");
  const [isLoading, setIsLoading] = useState(false);

  function handleDisplay(event: React.MouseEvent<HTMLButtonElement>) {
    setIsLoading(true);
    setDisplay(event.currentTarget.value);
  }

  return (
    <div className="container">
      <div
        className="start_date"
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <p style={{ marginRight: "20px" }}>Start Date:</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={startDate}
            disableFuture
            maxDate={endDate.subtract(1, "day")}
            slotProps={{ textField: { size: "small" } }}
            onChange={(event: Dayjs | null) => {
              setStartDate(event!);
              setIsLoading(true);
            }}
          />
        </LocalizationProvider>
      </div>

      <div
        className="end_date"
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <p style={{ marginRight: "20px" }}>End Date:</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={endDate}
            disableFuture
            minDate={startDate.add(1, "day")}
            slotProps={{ textField: { size: "small" } }}
            onChange={(event: Dayjs | null) => {
              setEndDate(event!);
              setIsLoading(true);
            }}
          />
        </LocalizationProvider>
      </div>

      <div className="display_buttons">
        <Button
          value="downloads"
          variant={display === "downloads" ? "contained" : "outlined"}
          onClick={handleDisplay}
          style={{ marginRight: "20px" }}
        >
          Downloads
        </Button>
        <Button
          value="revenue"
          variant={display === "revenue" ? "contained" : "outlined"}
          onClick={handleDisplay}
        >
          Revenue
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Chart
          data={data}
          startDate={startDate}
          endDate={endDate}
          display={display}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <Table
          data={data}
          startDate={startDate}
          endDate={endDate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default App;
