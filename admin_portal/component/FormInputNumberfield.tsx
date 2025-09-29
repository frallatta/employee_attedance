import { InputNumber } from "primereact/inputnumber";
import { Tooltip } from "primereact/tooltip";

const FormInputNumberfield = ({
  labelText = "",
  errorText = [],
  className = "",
  labelClassName = "",
  helperText = "",
  isCurrency = false,
  required = false,
  ...props
}: {
  labelText: string | undefined;
  errorText: string[] | undefined;
  className?: string | undefined;
  labelClassName?: string | undefined;
  helperText?: string | undefined;
  isCurrency?: boolean;
  required?: boolean;
  [props: string]: any;
}) => (
  <div className="w-full">
    <div className="flex flex-col gap-2">
      <div className="block flex">
        <label
          className={`${
            errorText.length > 0 ? "text-red-600" : "text-black"
          } ${labelClassName}`}
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
      <InputNumber
        {...(isCurrency
          ? {
              mode: "currency",
              currency: "IDR",
              locale: "id-ID",
              minFractionDigits: 0,
              maxFractionDigits: 0,
            }
          : {})}
        // className={`${className} !w-full text-sm !text-gray-800`}
        invalid={errorText.length > 0}
        {...props}
        // pt={{
        //   input: {
        //     root: {
        //       className: "text-sm !text-gray-800",
        //     },
        //   },
        // }}
      />
      {errorText.length > 0 && (
        <p className="text-sm text-red-600">{errorText.join(" ")}</p>
      )}
    </div>
  </div>
);

export default FormInputNumberfield;
