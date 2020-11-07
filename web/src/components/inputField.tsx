import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

// define props
type inputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    // make name property required
    name: string;
}

const inputField: React.FC<inputFieldProps> = ({label, size: _, ...props}) => {
    const [field, {error}] = useField(props); // this information gets passed to Input 
    return(
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name}/>
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    );
}

export default inputField