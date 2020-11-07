import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/inputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const [,register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
            <Formik initialValues={{username: "", password: ""}} onSubmit={async (values, { setErrors }) => {
                const response = await register(values);
                if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                }
            }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" placeholder="username" label="Username"/>
                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="Password" type="password"/>
                        </Box>
                        <Button mt={4} type="submit" variantColor="teal" isLoading={isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    ); 
};

export default Register