import React from "react"

import Wrapper from "../components/Wrapper"

import { Formik, Form } from "formik"

import { FormControl, FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react'

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    return (
        <Wrapper variant="small">
            <Formik
                initialValues = {{ 
                    username: "username",
                    password: "password"
                }}
                onSubmit = {(values) => {
                    console.log(values)
                }}
            >
                {() => (
                    <Form>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input placeholder="username" />
                        </FormControl>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Register