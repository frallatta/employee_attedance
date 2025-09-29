import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";

const booleanList: { name: string; value: boolean | null }[] = [
  {
    name: "ALL",
    value: null,
  },
  {
    name: "TRUE",
    value: true,
  },
  {
    name: "FALSE",
    value: false,
  },
];

const DtCheckboxColumn = (booleanValue: boolean) => {
  if (booleanValue) {
    return (
      <div className="flex items-center justify-center">
        <Checkbox  checked={booleanValue} disabled></Checkbox>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center">
        <Checkbox  checked={false} disabled></Checkbox>
      </div>
    );
  }
};

const DtCheckboxColumnFilter = (options: any) => {
  const statusItemTemplate = (option: any) => {
    const data = booleanList.find((item) => item.value === option.value);
    if (data) {
      if (data.value === true) {
        return <Tag value={data.name} severity={"success"} />;
      } else if (data.value === false) {
        return <Tag value={data.name} severity={"danger"} />;
      } else {
        return <Tag value={data.name} severity={null} />;
      }
    } else {
      return <Tag value={"All"} severity={null} />;
    }
  };

  const statusSelectedItemTemplate = (option: any, props: any) => {
    if (option) {
      const data = booleanList.find((item) => item.value === option.value);
      if (data) {
        if (data.value === true) {
          return <Tag value={data.name} severity={"success"} />;
        } else if (data.value === false) {
          return <Tag value={data.name} severity={"danger"} />;
        } else {
          return <Tag value={data.name} severity={null} />;
        }
      } else {
        return <Tag value={"All"} severity={null} />;
      }
    }

    return <span>{props.placeholder}</span>;
  };

  return (
    <Dropdown
      value={options.value}
      options={booleanList}
      onChange={(e) => options.filterApplyCallback(e.value, options.index)}
      itemTemplate={statusItemTemplate}
      valueTemplate={statusSelectedItemTemplate}
      optionValue="value"
      placeholder="Select One"
      className="p-column-filter"
      showClear
      style={{ minWidth: "12rem" }}
    />
  );
};

export { DtCheckboxColumn, DtCheckboxColumnFilter };
