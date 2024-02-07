import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
} from '@chakra-ui/react';

import { forwardRef, ForwardRefRenderFunction } from 'react';

import { FieldError } from 'react-hook-form';

interface CheckboxProps extends ChakraCheckboxProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const CheckboxBase: ForwardRefRenderFunction<HTMLInputElement, CheckboxProps> = (
  { name, label, error = null, ...rest },
  ref,
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraCheckbox
        name={name}
        id={name}
        bgColor="gray.900"
        // focusBorderColor="pink.500"
        // variant="filled"
        // _hover={{
        //   bgColor: 'gray.900',
        // }}
        // size="lg"
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Checkbox = forwardRef(CheckboxBase);
