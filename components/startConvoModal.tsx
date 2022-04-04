import {
  useDisclosure,
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
  useToast,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { web3 } from "../web3/loadContract";
import moment from "moment";
import { useRouter } from "next/router";
import write from "../helpers/write";
import { onValue, ref, set } from "firebase/database";
import { database } from "../firebase";
import getConversations from "../web3/methods/getConversations";

const startConvoModal = ({ state }) => {
  const [conversationReceiver, setConversationReceiver] = useState<string>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button ml="auto" mt={3} onClick={onOpen} colorScheme="linkedin">
        Start new conversation
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start a convo!</ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (conversationReceiver.replaceAll(" ", "") != "") {
                setIsLoading(true);
                // if input field isn't empty
                const randomHash = web3.utils.randomHex(64); // generate random hash

                const message = [
                  {
                    sender: state.value?.wallet,
                    receiver: conversationReceiver,
                    // initialize first message
                    message: `Conversation between ${
                      state.value?.wallet
                    } and ${conversationReceiver} started on ${moment().format(
                      "MMMM Do YYYY"
                    )}`,
                  },
                ];

                await state.value?.contract.methods
                  .startConversation(conversationReceiver, `${randomHash}`) // start conversation and pass in conversation ID
                  .send({ from: state.value?.wallet })
                  .then(async (res) => {
                    try {
                      const currentTokenId = await state.value?.contract.methods
                        .getCurrentToken()
                        .call();

                      await write(currentTokenId, message); // write message
                      setIsLoading(false);
                      // router.reload(); // FIXME: possible bug here
                      return toast({
                        title: "Conversation started!", // prompt success message
                        description: `Please refresh to see new conversation`,
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                    } catch (err) {
                      alert(err.message);
                    }
                  })
                  .catch((err) => {
                    setIsLoading(false);
                    alert(err.message);
                  });
              } else {
                alert("Please enter an address");
              }
            }}
          >
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>
                  Wallet address of person you'd like to chat with:
                </FormLabel>
                <Input
                  onChange={(e) =>
                    setConversationReceiver(e.currentTarget.value)
                  }
                  ref={initialRef}
                  placeholder="0xd6C...380f"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isLoading}
                type="submit"
                colorScheme="blue"
                mr={3}
              >
                Start
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
export default startConvoModal;
