import React, { ClassAttributes, InputHTMLAttributes} from "react"

import { FormControl, FormLabel, Input, FormHelperText } from "@chakra-ui/react"
import { FieldConfig, useField } from "formik"

type InputFieldProps = ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement> & FieldConfig<any> & {
    name: string,
    label: string,
    placeholder: string
}

const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, { error }] = useField(props)
    
    return (
        <FormControl id="email" isInvalid={Boolean(error)}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            <Input {...field} id={field.name} placeholder={props.placeholder} />
            <FormHelperText>We'll never share your email.</FormHelperText>
        </FormControl>
    )
}

export default InputField

