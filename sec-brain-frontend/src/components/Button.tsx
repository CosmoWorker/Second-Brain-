interface ButtonProps{
    variant: "primary" | "secondary";
    size: "sm"|"md"|"lg";
    text: string;
    startIcon?: any;
    endIcon?: any;
    onClick: ()=>void;
}

const variantStyles={
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-400 text-purple-600"
}

const defaultStyles="rounded-md flex"

const sizeStyles={
    "sm": "py-1 px-2 text-sm rounded-sm",
    "md": "py-2 py-4 text-md rounded-md",
    "lg": "py-4 py-6 text-xl rounded-xl"
}

export const Button=(props: ButtonProps)=>{
    return <button className={`${variantStyles[props.variant]} ${defaultStyles} 
        ${sizeStyles}`}>{props.variant}</button>
}

<Button variant="primary" size="md" onClick={()=>{}} text={"asd"}/>
