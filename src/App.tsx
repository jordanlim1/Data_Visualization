import Chart from "./Chart";
import Table from "./Table";
import useData from "./useData";
import "./App.css";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import React, {useState} from "react"
import { dayjsUtc } from "./dayjs";

const App = () => {
  const data = useData();
  const [startDate, setStartDate] = useState<Dayjs>(dayjs('2020-01-01'))
  const [endDate, setEndDate] = useState <Dayjs> (dayjs('2020-01-07'))

  return (
    <div className="container">

      <div className="start_date" style={{display:"flex", alignItems:"center", marginBottom: "20px"}}>
      <p style={{marginRight: "20px"}}>Start Date:</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
      value={startDate} 
      slotProps={{ textField: { size: 'small' } }} 
      onChange={(e: Dayjs | null) => {
      
       if(e?.valueOf()! > endDate.valueOf()){
          alert("Start date cannot be greater than end date")
          return -1;
       }

       setStartDate(dayjs(e))

      }}/>
      </LocalizationProvider>       
      </div>

      <div className="end_date" style={{display:"flex", alignItems:"center", marginBottom: "20px"}}>
      <p style={{marginRight: "20px"}}>End Date:</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={endDate} slotProps={{ textField: { size: 'small' } }} onChange={(e: Dayjs | null) => setEndDate(dayjs(e))}/>
      </LocalizationProvider>   
      </div>

      <Chart data={data} startDate={startDate} endDate= {endDate}/>
      <Table data={data} startDate={startDate} endDate={endDate}/>
    </div>
  );
};

export default App;
