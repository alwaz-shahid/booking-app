import React from 'react';
import * as Yup from 'yup';
import { VStack, Box, useColorMode, Button } from '@chakra-ui/react';

import { DateField, Form, MaskedInputField, SubmitButton, ContactSelectField, InputField, masks, SelectField } from './shared/Form';
import { OptionType } from './types';
import { useRequiredFieldMessage } from './messages';

const options: OptionType[] = [
  {
    value: 'test1',
    label: 'Test 1',
  },
  {
    value: 'test2',
    label: 'Test 2',
  },
  {
    value: 'test3',
    label: 'Test 3',
  },
  {
    value: 'test4',
    label: 'Test 4',
  },
];

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  const requiredMsg = useRequiredFieldMessage();
  const schema = Yup.object().shape({
    test1: Yup.string().required(requiredMsg),
    test2: Yup.string().required(requiredMsg),
    date: Yup.string().required(requiredMsg).nullable(),
    select: Yup.string().required(requiredMsg).nullable(),
    multiSelect: Yup.array().required(requiredMsg).nullable(),
    phone: Yup.string()
      .required(requiredMsg)
      .matches(/^[\W\S_]\d{2} \d{9}$/, 'Invalid format'),
  });

  return (
    <Box maxW='500px' m='0 auto' mt={10}>
      <header>
        <Button mb={6} onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </header>
      <Form
        onSubmit={model => alert(JSON.stringify(model, null, 2))}
        schema={schema}
        defaultValues={{
          test1: '',
          test2: '',
          date: '',
          select: null,
          multiSelect: null,
          phone: '',
        }}
      >
        <VStack>
          <InputField name='test1' label='Test field 1' id='test-field-1' tip='test tip' />
          <InputField name='test2' label='Test field 2' id='test-field-2' />
          <DateField name='date' label='Test date field' id='test-date-field' />
          <ContactSelectField name='select' id='select' label='Contact field' />
          <SelectField options={options} label='Multi select field' name='multiSelect' id='multi-select-field' isMulti={true} />
          <MaskedInputField label='Phone number' name='phone' id='phone' guide mask={masks.phone} />
          <SubmitButton />
        </VStack>
      </Form>
    </Box>
  );
}

export default App;
