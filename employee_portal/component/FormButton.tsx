import { Button } from "primereact/button";

const FormButton = ({
  labelText = "",
  classNames = "",
  ...props
}: {
  labelText: string;
  classNames?: string;
  [props: string]: any;
}) => <Button label={labelText} className={`${classNames} `} {...props} />;

export default FormButton;
