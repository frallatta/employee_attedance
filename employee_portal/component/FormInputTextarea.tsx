import { InputTextarea } from "primereact/inputtextarea";
import { Tooltip } from "primereact/tooltip";

const FormInputTextarea = ({
  labelText = "",
  rows = 3,
  errorText = [],
  className = "",
  helperText = "",
  required = false,
  ...props
}: {
  labelText: string;
  rows?: number;
  errorText: string[] | undefined;
  className?: string;
  helperText?: string;
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
      <InputTextarea
        rows={rows}
        className={`${className} !w-full !text-gray-800`}
        invalid={errorText.length > 0}
        {...props}
      />
      {errorText.length > 0 && (
        <p className="text-sm text-red-600">{errorText.join(" ")}</p>
      )}
    </div>
  </div>
);

export default FormInputTextarea;
