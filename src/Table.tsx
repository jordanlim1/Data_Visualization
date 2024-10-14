import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dayjsUtc } from "./dayjs";
import Loading from "./Loading";
import { TableProps, RowProps } from "./types";

const Table = ({ data, startDate, endDate, isTableLoading }: TableProps) => {
  if (!data.length) {
    return null;
  }

  const columns: GridColDef<RowProps>[] = [
    {
      field: "appName",
      headerName: "App Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", alignContent: "center", height: "100%" }}
          >
            <img
              src={params.value.src}
              alt={params.value.appName}
              style={{
                width: 50,
                height: "auto",
                padding: "5px",
                boxSizing: "border-box",
                marginRight: "5px",
              }}
            />
            {params.value.appName}
          </div>
        );
      },
    },
    { field: "downloads", headerName: "Downloads", width: 150 },
    {
      field: "revenue",
      headerName: "Revenue",
      width: 150,
      type: "string",
      sortComparator: (v1, v2) =>
        parseInt(v1.replace(/[$,]/g, "")) - parseInt(v2.replace(/[$,]/g, "")), // need a sort comparator because MUI data grid not sorting revenue strings as expected
    },
    { field: "RPD", headerName: "RPD", width: 150 },
  ];

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2, // Ensure two decimal places
  });

  const rows = data.map((appData) => {
    let totalDownloads = 0;
    let totalRevenue = 0;

    appData.data.forEach((value) => {
      const [date, downloads, revenue] = value;
      const dateMs = dayjsUtc(date).valueOf();
      const startDateMs = dayjsUtc(startDate.format("YYYY-MM-DD")).valueOf();
      const endDateMs = dayjsUtc(endDate.format("YYYY-MM-DD")).valueOf();

      if (dateMs >= startDateMs && dateMs <= endDateMs) {
        totalDownloads += downloads;
        totalRevenue += revenue;
      }
    });

    let RPD =
      totalDownloads === 0 || totalRevenue === 0
        ? "-"
        : `$${(totalRevenue / totalDownloads / 100).toFixed(2)}`;

    const row: RowProps = {
      id: appData.id,
      appName: { appName: appData.name, src: appData.icon },
      downloads: totalDownloads.toLocaleString(),
      revenue: USDollar.format(totalRevenue / 100),
      RPD: RPD,
    };

    return row;
  });

  return (
    <div
      data-testid="table-component"
      style={{
        height: 400,
        width: "100%",
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isTableLoading ? (
        <Loading />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{
            ".MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold !important",
            },
          }}
        />
      )}
    </div>
  );
};

export default Table;
