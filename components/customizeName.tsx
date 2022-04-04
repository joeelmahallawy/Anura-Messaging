import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

const CustomizeName = ({ otherWallet, setName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customName, SetcustomName] = useState<string>();
  const initialRef = React.useRef();

  return (
    <>
      <Button onClick={onOpen} _focus={{}} colorScheme="teal">
        Edit name
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              localStorage.setItem(otherWallet, customName);
              setName(customName);
              onClose();
              //   console.log(customName);
            }}
          >
            <ModalHeader>Customize name</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  onChange={(e) => {
                    SetcustomName(e.currentTarget.value);
                  }}
                  ref={initialRef}
                  placeholder="John Doe"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CustomizeName;
