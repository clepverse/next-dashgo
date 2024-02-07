import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRef, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Header } from '../../components/Header';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/Modal';
import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { api } from '../../services/api';

import { useForms } from '../../services/hooks/useForms';
import { queryClient } from '../../services/queryClient';
import { Input } from '../../components/Form/Input';
import { Checkbox } from '../../components/Form/Checkbox';

type CreateUserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório.'),
  email: yup.string().required('E-mail obrigatório.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Senha obrigatória.')
    .min(6, 'No mínimo 6 caracteres.'),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais.'),
});


export default function FormList() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
  const cancelRef = useRef(null);
  const { data, isLoading, isFetching, error } = useForms(page);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });


  async function handlePrefetchForm(formId: string) {
    await queryClient.prefetchQuery(
      ['form', formId],
      async () => {
        const response = await api.get(`forms/${formId}`);

        return response.data;
      },
      {
        staleTime: 1000 * 60 * 10,
      },
    );
  };

  const createUser = useMutation(
    async (user: CreateUserFormData) => {
      const response = await api.post('users', {
        user: {
          ...user,
          created_at: new Date(),
        },
      });

      return response.data.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (
    values,
  ) => {
    await createUser.mutateAsync(values);

    router.push('/users');
  };

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Formulários
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            {/* <NextLink href="/forms/create" passHref> */}
            <Button
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="pink"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              onClick={onOpenModal}
            >
              Criar novo formulário
            </Button>
            {/* </NextLink> */}
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos formulários</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={['4', '4', '6']} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Formulários</Th>
                    {/* <Th>Interno do sistema</Th> */}
                    {isWideVersion && <Th>Quantidade de questões</Th>}
                    {isWideVersion && <Th>Data de cadastro</Th>}

                    <Th width="8"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.forms.map((form) => {
                    return (
                      <Tr key={form.id}>
                        <Td px={['4', '4', '6']}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Box>
                            <Link
                              color="purple.400"
                              onMouseEnter={() => handlePrefetchForm(form.id)}
                            >
                              <Text fontWeight="bold">{form.name}</Text>
                            </Link>

                            <Text fontSize="sm" color="gray.300">
                              {form.is_internal ? 'Interno' : 'Externo'}
                            </Text>
                          </Box>
                        </Td>
                        {isWideVersion && <Td>{form.qtd_questions}</Td>}
                        {isWideVersion && <Td>{form.created_at}</Td>}

                        <Td>
                          <Button
                            as="a"
                            size="sm"
                            fontSize="sm"
                            colorScheme="purple"
                            leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                          >
                            {isWideVersion ? 'Editar' : ''}
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={data.totalCount}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </Box>
      </Flex>
      <Modal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        ref={cancelRef}
        isCentered
      >
        <ModalHeader closeButton>
          <Heading size="md" fontWeight="normal">
            Criar formulário
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Box
            as="form"
            flex="1"
            borderRadius={8}
            // bg="gray.800"
            // p={['2', '4']}
            onSubmit={handleSubmit(handleCreateUser)}
          >
            <VStack spacing={['4', '6']}>
              <SimpleGrid minChildWidth="240px" spacing="6" w="100%">
                <Input
                  bgColor="gray.700"
                  _hover={{ bgColor: 'gray.700' }}
                  name="name"
                  label="Nome do formulário"
                  error={errors.name}
                  {...register('name')}
                />

                <Input
                  bgColor="gray.700"
                  _hover={{ bgColor: 'gray.700' }}
                  name="qtd_questions"
                  type="number"
                  label="Quantidade de questões"
                  error={errors.password}
                  {...register('qtd_questions')}
                />

                <Checkbox
                  // bgColor="gray.700"
                  // _hover={{ bgColor: 'gray.700' }}
                  name="is_internal"
                  // type="checkbox"
                  label="Interno do sistema"
                  error={errors.email}
                  {...register('is_internal')}
                />
              </SimpleGrid>
            </VStack>


          </Box>
        </ModalBody>
        <ModalFooter>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <NextLink href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">
                  Cancelar
                </Button>
              </NextLink>

              <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
                Salvar
              </Button>
            </HStack>
          </Flex>
        </ModalFooter>
      </Modal>
    </Box>
  );
}
