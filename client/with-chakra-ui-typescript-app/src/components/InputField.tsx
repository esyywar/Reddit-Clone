import React, { ClassAttributes, InputHTMLAttributes} from "react"

import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react"
import { FieldConfig, useField } from "formik"

type InputFieldProps = ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement> & FieldConfig<any> & {
    name: string,
    label: string,
    placeholder: string,
    type?: string
}

const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, meta] = useField(props)
    
    return (
        <FormControl id="email" isInvalid={Boolean(meta.error)}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            <Input {...field} id={field.name} placeholder={props.placeholder} type={props.type} />
            {(meta.error && meta.touched && <FormErrorMessage>{meta.error}</FormErrorMessage>)}
        </FormControl>
    )
}

export default InputField

