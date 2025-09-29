import { DataTable } from "primereact/datatable";
import { classNames } from "primereact/utils";

const FormDatatable = ({
  data,
  children,
  ...props
}: {
  data: any;
  children: React.ReactNode;
  [props: string]: any;
}) => (
  <div>
    <DataTable
      showGridlines
      value={data}
      cellMemo={false}
      {...props}
      pt={{
        table: { className: "min-w-[50rem] rounded-md" },
        column: {
          bodyCell: () => ({
            className: classNames("!p-2"),
          }),
        },
      }}
    >
      {children}
    </DataTable>
  </div>
);

export default FormDatatable;
