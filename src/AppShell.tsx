import React, { PropsWithChildren, ReactElement } from 'react';
import { AppHeaderComponent } from "./AppHeaderComponent";
import { Bounce, ToastContainer } from "react-toastify";

export interface AppShellComponentProps {
}

export function AppShellComponent(props: PropsWithChildren<AppShellComponentProps>): ReactElement {

    return (<>
        <AppHeaderComponent/>
        {props.children}
    </>)
}