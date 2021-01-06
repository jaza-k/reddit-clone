import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/inputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper variant="small">

            <Formik 
                initialValues={{username: "", password: ""}} 
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values);
                    if (response.data?.register.errors) {
                        console.log(response);
                        setErrors(toErrorMap(response.data.register.errors));
                    }
                    else if (response.data?.register.user) {
                        // if function worked
                        router.push("/"); // specify that we want to go back to homepage
                    }
                }}
            >

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

export default withUrqlClient(createUrqlClient)(Register);