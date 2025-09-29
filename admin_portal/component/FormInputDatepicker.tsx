import { Calendar } from "primereact/calendar";
import { Tooltip } from "primereact/tooltip";


// const TRANSITIONS = {
//   overlay: {
//       timeout: 150,
//       classNames: {
//           enter: 'opacity-0 scale-50',
//           enterActive: 'opacity-100 !scale-100 transition-transform transition-opacity duration-150 ease-in',
//           exit: 'opacity-100',
//           exitActive: '!opacity-0 transition-opacity duration-150 ease-linear'
//       }
//   }
// };

const FormInputDatepicker = ({
  labelText = "",
  errorText = [],
  className = "",
  helperText = "",
  required = false,
  ...props
}:{
  labelText: string | undefined;
  errorText: string[] | undefined;
  className?: string;
  helperText?: string;
  required?: boolean;
  [props: string]: any
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
      <Calendar
        className={`${className} w-full`}
        // pt={{
        //   input: {
        //     root: {
        //       className: "text-sm",
        //     },
        //   },
        //   table: {
        //     className: "table-fixed"
        //   },
        //   transition:TRANSITIONS.overlay
        // }}
        invalid={errorText.length > 0}
        dateFormat="d MM yy"
        {...props}
      />
      {errorText.length > 0 && (
        <p className="text-sm text-red-600">{errorText.join(" ")}</p>
      )}
    </div>
  </div>
);

export default FormInputDatepicker;
