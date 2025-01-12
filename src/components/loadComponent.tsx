//Spinner component is imported to visually indicate a charge indicator.
import {Spinner} from "@nextui-org/react";

export const Loading = () => {
    return(
        <Spinner color="default" label="Cargando..." labelColor="foreground" />
    )
}