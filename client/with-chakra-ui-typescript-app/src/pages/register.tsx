import React from "react"

import Wrapper from "../components/Wrapper"
import InputField from "../components/InputField"

import { Formik, Form } from "formik"

import { Box, Button } from "@chakra-ui/react"

import { useMutation } from 'urql'


interface registerProps {}

const RegisterMut = `
    mutation RegisterUser($username: String!, $password: String!) {
        registerUser(loginInfo: {username: $username, password: $password}) {
            errors {
                field
                message
            }
            user {
                id
                createdAt
                updatedAt
                username
            }
        }
    }
`

const Register: React.FC<registerProps> = ({}) => {
    const [result, registerUser] = useMutation(RegisterMut)

    return (
        <Wrapper variant="small">
            <Formik
                initialValues = {{ 
                    username: "",
                    password: ""
                }}
                onSubmit = {async (values) => {
                    const response = await registerUser({ username: values.username, password: values.password })
                    console.log(response.data)
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={3}>
                            <InputField 
                                name="username"
                                label="Username"
                                placeholder="Username"
                            />
                        </Box>
                        <Box mt={3}>
                            <InputField 
                                name="password"
                                label="Password"
                                placeholder="Password"
                                type="password"
                            />
                        </Box>
                        <Box mt={5}>
                            <Button 
                                type="submit" 
                                colorScheme="teal"
                                isLoading={isSubmitting}
                            >Register</Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Register