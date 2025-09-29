import { Password } from "primereact/password";
import { Tooltip } from "primereact/tooltip";

const FormInputPassword = ({
  labelText = "",
  errorText = [],
  className = "",
  labelClassName = "",
  helperText = "",
  required = false,
  ...props
}:{
    labelText: string |undefined;
    errorText: string[] | undefined;
    className?: string | undefined;
    labelClassName?: string | undefined;
    helperText?: string | undefined;
    required?: boolean;
    [props:string]: any
}) => (
  <div className="w-full">
    <div className="flex flex-col gap-2">
        <div className="block flex">
        <label
          className={`${errorText.length > 0 ? "text-red-600" : "text-black"} ${labelClassName}`}
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
        <Password
          className={`${className} !w-full`}
          invalid={errorText.length > 0}
          {...props}
          pt={{
            root: { className: "!w-full" },
            input: { className: "!w-full" },
            iconField: {
              root: {
                className: "w-full",
              },
            },
          }}
        />
        {errorText.length > 0 && (
          <p className="text-sm text-red-600">{errorText.join(" ")}</p>
        )}
    </div>
  </div>
);

export default FormInputPassword;
