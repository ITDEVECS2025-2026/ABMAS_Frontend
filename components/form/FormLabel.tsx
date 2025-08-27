import { FormLabelProps } from "@/interfaces/IForm"
import { Text } from "../ui/text"
import React from "react"


export function FormLabel({children}: FormLabelProps){
    return (
        <Text size="sm" bold>
            {children}
        </Text>
    )
}