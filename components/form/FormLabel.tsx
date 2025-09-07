import { FormLabelProps } from "@/interfaces/IForm"
import { Text } from "../ui/text"
import React from "react"


export function FormLabel({children, className, style}: FormLabelProps){
    return (
        <Text size="sm" style={style} className={className} bold>
            {children}
        </Text>
    )
}