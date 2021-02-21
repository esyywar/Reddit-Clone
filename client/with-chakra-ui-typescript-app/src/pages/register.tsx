import React from "react"

import Wrapper from "../components/Wrapper"
import InputField from "../components/InputField"

import { Formik, Form } from "formik"

import { Box, Button } from "@chakra-ui/react"


interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    return (
        <Wrapper variant="small">
            <Formik
                initialValues = {{ 
                    username: "",
                    password: ""
                }}
                onSubmit = {(values) => {
                    console.log(values)
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