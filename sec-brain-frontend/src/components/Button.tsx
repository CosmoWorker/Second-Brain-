import { ReactElement } from "react";

interface ButtonProps{
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick: ()=>void;
}

const variantStyles={
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-200 text-purple-500"
}

const defaultStyles="flex font-normal items-center cursor-pointer px-3.5 py-2 rounded-lg "

export const Button=(props: ButtonProps)=>{
    return <button className={`${variantStyles[props.variant]} ${defaultStyles}`}>
        <div className="pr-2">{props.startIcon}</div>{props.text}</button>
}
