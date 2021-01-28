import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/inputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

interface registerProps {}

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">

            <Formik 
                initialValues={{usernameOrEmail: "", password: ""}} 
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors)); // FIX THISSSS!!!!!!!!!!!!!!!!!
                    }
                    else if (response.data?.login.user) {
                        // if function worked
                        router.push("/"); // specify that we want to go back to homepage
                    }
                }}
            >

                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="usernameOrEmail" placeholder="Username or email" label="Username or Email"/>

                        <Box mt={4}>
                            <InputField name="password" placeholder="password" label="Password" type="password"/>
                        </Box>

                        <Button mt={4} type="submit" variantColor="teal" isLoading={isSubmitting}>Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    ); 
};

export default withUrqlClient(createUrqlClient)(Login); // SSR is off bc page is static + not important for SEO