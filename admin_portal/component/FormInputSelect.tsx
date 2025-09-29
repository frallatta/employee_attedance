import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

const FormInputSelect = ({
  labelText = "",
  errorText = [],
  className = "",
  helperText = "",
  options = [],
  optionLabel = "",
  optionValue = "",
  showClear = false,
  required = false,
  ...props
}: {
  labelText: string;
  errorText: string[] | undefined;
  className?: string;
  helperText?: string;
  options: any;
  optionLabel?: string;
  optionValue?: string;
  showClear?: boolean;
  required?: boolean;
  [props: string]: any;
}) => (
  <div className="w-full">
    <div className="flex flex-col gap-2">
      <div className="block flex">
        <label
          className={`${errorText.length > 0 ? "text-red-600" : "text-black"}`}
        >
          {labelText}
        </label>
        {required && <label className={`text-red-600`}>*</label>}
        {helperText && (
          <>
            <Tooltip target=".helper-text" />
            <i
              className="helper-text pl-1 pi pi-question-circle"
              data-pr-tooltip={helperText}
              data-pr-position="right"
              style={{ cursor: "pointer" }}
            ></i>
          </>
        )}
      </div>
      <span className="!w-full text-sm !text-gray-800 p-inputnumber p-component p-inputwrapper p-inputwrapper-filled w-full inline-flex">
        <Dropdown
          className={`${className} !w-full !text-sm`}
          invalid={errorText.length > 0}
          showClear={showClear}
          options={options}
          optionLabel={optionLabel}
          optionValue={optionValue}
          {...props}
          // pt={{
          //   root: { className: "!text-sm" },
          //   input: { className: "!text-sm" },
          //   item: { className: "!text-sm" },
          //   wrapper: { className: "!text-sm" },
          //   itemLabel: { className: "text-sm" },
          //   list: { className: "text-sm" },
          //   select: { className: "text-sm" },
          //   option: { className: "text-sm" },
          //   checkIcon: { className: "text-sm" },
          //   filterContainer: { className: "text-sm" },
          //   filterIcon: { className: "text-sm" },
          //   filterInput: { className: "text-sm" },
          // }}
        />
      </span>
      {errorText.length > 0 && (
        <p className="text-sm text-red-600">{errorText.join(" ")}</p>
      )}
    </div>
  </div>
);

export default FormInputSelect;
