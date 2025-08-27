import React from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { VStack } from "../ui/vstack";
import { FormFieldProps } from "@/interfaces/IForm";



export function FormField<T extends FieldValues>({ name, render }: FormFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <VStack space="xs">
          {render({
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
          })}
        </VStack>
      )}
    />
  );
}