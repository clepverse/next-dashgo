import { forwardRef, RefObject } from 'react';
import {
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isCentered?: boolean;
};

type ModalHeaderProps = {
  children: React.ReactNode;
  closeButton?: boolean;
};

type ModalBodyProps = {
  children: React.ReactNode;
};

const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const { children, isOpen, onClose, isCentered = true, ...rest } = props;
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={ref as RefObject<HTMLDivElement>}
      onClose={onClose}
      isOpen={isOpen}
      isCentered={isCentered}
      {...rest}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
});

const ModalHeader = (props: ModalHeaderProps) => {
  const { children, closeButton, ...rest } = props;

  return (
    <>
      <AlertDialogHeader
        // fontSize='lg'
        // fontWeight='bold'
        backgroundColor="gray.900"
        {...rest}
      >
        {children}
      </AlertDialogHeader>
      {closeButton && <AlertDialogCloseButton />}
    </>
  )
};

const ModalBody = (props: ModalBodyProps) => {
  const { children, ...rest } = props;

  return (
    <AlertDialogBody
      backgroundColor="gray.900"
      {...rest}
    >
      <Divider borderColor="gray.600" mb={4} />
      {children}
      <Divider borderColor="gray.600" mt={4} />
    </AlertDialogBody>
  )
};

const ModalFooter = (props: ModalBodyProps) => {
  const { children, ...rest } = props;

  return (
    <AlertDialogFooter
      backgroundColor="gray.900"
      {...rest}
    >
      {children}
    </AlertDialogFooter>
  )
};

export { Modal, ModalHeader, ModalBody, ModalFooter };