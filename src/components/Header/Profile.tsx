import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Aldo Barbosa</Text>
          <Text color="gray.300" fontSize="small">
            aldo.dev@gmail.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Aldo Barbosa"
        src="https://github.com/clepverse.png"
      />
    </Flex>
  );
}
