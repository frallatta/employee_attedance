import { Dialog } from "primereact/dialog";
import { Dispatch, SetStateAction } from "react";
const LoadingDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => (
  <Dialog
    baseZIndex={4000}
    visible={visible}
    onHide={() => {
      if (!visible) return;
      setVisible(false);
    }}
    modal
    content={({}) => (
      <div className="flex flex-col align-center justify-center px-8 py-8 bg-white rounded-xl">
        <p className="text-center">
          <i className="pi pi-spin pi-cog" style={{ fontSize: "4rem" }}></i>
        </p>
        {/* <p className="text-2xl font-semibold">Loading</p> */}
      </div>
    )}
  ></Dialog>
);

export default LoadingDialog;
