import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { SideBarDrawerProvider } from '../contexts/SidebarDrawerContext';
import { theme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SideBarDrawerProvider>
        <Component {...pageProps} />
      </SideBarDrawerProvider>
    </ChakraProvider>
  );
}

export default MyApp;
