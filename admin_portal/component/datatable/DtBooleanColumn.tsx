import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

const booleanList: { name: string; value: boolean | null }[] = [
  {
    name: "All",
    value: null,
  },
  {
    name: "active",
    value: true,
  },
  {
    name: "inactive",
    value: false,
  },
];

const DtBooleanColumn = (booleanValue: boolean) => {
  if (booleanValue) {
    return (
      <div className="flex items-center justify-center">
        <Tag value={"Active"} severity={"success"} />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center">
        <Tag value={"Inactive"} severity={"danger"} />
      </div>
    );
  }
};

const DtBooleanColumnFilter = (options: any) => {
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

export { DtBooleanColumn, DtBooleanColumnFilter };
