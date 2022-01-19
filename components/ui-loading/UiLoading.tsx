import { Oval } from "react-loader-spinner";

const UiLoading = () => (<Oval
    arialLabel="loading-indicator"

    strokeWidth={10}
    color="#3730a3"
    secondaryColor="white"
    wrapperClass="m-4 p-4 flex items-center justify-center"
  />
);

export default UiLoading;
