import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Response } from "./types";
import { Dayjs } from "dayjs";
import { dayjsUtc } from "./dayjs";

type TableProps = {
  data: Response;
  startDate: Dayjs;
  endDate: Dayjs;
};

type RowProps = {
  id: number;
  appName: {appName: string, src: string};
  downloads: string;
  revenue: string;
  RPD: string
};

const Table = ({ data, startDate, endDate }: TableProps) => {
  if (!data.length) {
    return null;
  }


  const columns: GridColDef<RowProps>[] = [
    { field: "appName", headerName: "App Name", width: 200,     
      renderCell: (params) => {
      return (
        <div style={{display:"flex", alignContent: "center", height: "100%"}}>
        <img src={params.value.src} style={{width: 50, height:"auto", padding: "5px", boxSizing: "border-box", marginRight: "5px"}}/>
        {params.value.appName}
        </div>
      )
      } 
      
    },
    { field: "downloads", headerName: "Downloads", width: 150 },
    // need a sort comparator because MUI data grid not sorting revenue strings as expected
    { field: "revenue", headerName: "Revenue", width: 150, type: "string", sortComparator: (v1, v2) => parseInt(v1.replace(/[$,]/g, '')) - parseInt(v2.replace(/[$,]/g, ''))},
    { field: "RPD", headerName: "RPD", width: 150}
  ];

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2 // Ensure two decimal places
});

  const rows = data.map((appData) => {
    let totalDownloads = 0;
    let totalRevenue = 0;

    appData.data.forEach((value) => {
      const [date, downloads, revenue] = value
      const dateMs = dayjsUtc(date).valueOf()
      const startDateMs = dayjsUtc(startDate.format("YYYY-MM-DD")).valueOf()
      const endDateMs = dayjsUtc(endDate.format("YYYY-MM-DD")).valueOf()
      
      if(dateMs >= startDateMs && dateMs <= endDateMs) {
        totalDownloads += downloads
        totalRevenue += revenue
      }
    })

    let RPD = totalDownloads === 0 || totalRevenue === 0 ? "-" : `$${((totalRevenue / totalDownloads) / 100).toFixed(2)}`;


    const row: RowProps = {
      id: appData.id,
      appName: {appName: appData.name, src: appData.icon},
      downloads: totalDownloads.toLocaleString(),
      revenue: USDollar.format(totalRevenue/100),
      RPD: RPD
    };

    
    return row;
  });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} sx={{'.MuiDataGrid-columnHeaderTitle': { 
       fontWeight: 'bold !important'
    }}} />
    </div>
  );
};

export default Table;
