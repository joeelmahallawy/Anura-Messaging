import { Button } from "@chakra-ui/button";
import {
  FormControl,
  Box,
  Center,
  Modal,
  ModalBody,
  Text,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/textarea";
import React, { useEffect, useRef, useState } from "react";
import { Conversation } from "../interfaces";
import RenderMessages from "./renderMessages";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase";
import CustomizeName from "./customizeName";
import isMyWallet from "../helpers/getOtherUserWallet";
import submitMessage from "../helpers/getAndSendMessages";

const RenderConversations = ({
  state: { wallet, conversations, contract },
}: {
  state: {
    wallet: string;
    conversations: Conversation[];
    contract: any;
  };
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const [message, setMessage] = useState("");
  const [currentModalOpen, setCurrentModalOpen] = useState<number>();
  const messageBox = useRef();

  return (
    <Center flexDir="column" w="100%">
      {/* can also be used as (convos) */}
      {conversations.map((convo, i) => {
        const messageContainer = useRef();
        const [allMessages, setAllMessages] = useState(convo.messages); // all messages to render

        // customize name if it hasn't been given a name already
        const [customName, setCustomName] = useState(
          isMyWallet(wallet, convo.messages[0].receiver) // if I sent the first message
            ? localStorage.getItem(convo.messages[0].sender) || // check if there is already a custom name
                convo.messages[0].sender // if not, just make it the address of the user
            : localStorage.getItem(convo.messages[0].receiver) ||
                convo.messages[0].receiver
        );

        useEffect(() => {
          const convoRef = ref(database, `convos/${convo.tokenID}`);
          onValue(convoRef, (snapshot) => {
            // get messages on load
            const { message } = snapshot.val();
            setTimeout(() => {
              // scroll to bottom
              // @ts-expect-error
              messageContainer?.current?.scrollTop =
                // @ts-expect-error
                messageContainer?.current?.scrollHeight;
            }, 1);
            setAllMessages([...message]); // set messages with what we get from snapshot
          });
        }, []);

        return (
          <Center mt={3} flexDir="column" key={i} w="100%">
            <Button
              _focus={{}}
              p="4%"
              mt={3}
              onClick={() => {
                setCurrentModalOpen(i);
                onOpen();
                setTimeout(() => {
                  // scroll to bottom
                  // @ts-expect-error
                  messageContainer?.current?.scrollTop =
                    // @ts-expect-error
                    messageContainer?.current?.scrollHeight;
                }, 1);
              }}
              w="100%"
              display="flex"
              justifyContent="space-between"
            >
              <Text textAlign="right" fontWeight="500">
                Conversation with{" "}
                <span style={{ fontWeight: "bold" }}>{customName}</span>
              </Text>
              <Box textAlign="right">
                {/* {needsToBeChecked && (
                  <Box color="white" p={1.5} bg="red" borderRadius={20}>
                    {" "}
                    New
                  </Box>
                )} */}
              </Box>
            </Button>
            {currentModalOpen == i && (
              <Modal
                size="4xl"
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent h="85vh">
                  <ModalHeader display="flex" justifyContent="space-between">
                    <span style={{ fontWeight: "bold" }}>{customName}</span>
                    <CustomizeName
                      setName={setCustomName}
                      otherWallet={
                        convo.messages[0].receiver == wallet
                          ? convo.messages[0].sender
                          : convo.messages[0].receiver
                      }
                    />
                  </ModalHeader>
                  <ModalBody>
                    <FormControl
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                      h="100%"
                    >
                      <Flex h="100%" flexDir="column">
                        <Flex
                          position="relative"
                          flexDirection="column-reverse"
                          bottom={0}
                          overflowY="scroll"
                          border="1px solid black"
                          borderRadius={10}
                          h="52.5vh"
                          ref={messageContainer}
                          p={3}
                          gap={3}
                          flexDir="column"
                        >
                          <RenderMessages
                            messages={allMessages}
                            convo={convo}
                            wallet={wallet}
                          />
                        </Flex>
                        <Flex
                          flexDir="column"
                          mt={3}
                          gap={2}
                          justifyContent="flex-end"
                        >
                          <Textarea
                            ref={messageBox}
                            onKeyDown={async (e) => {
                              if (
                                e.key === "Enter" && // if user presses enter
                                message && // if message isn't empty
                                message.trim() // message trim isn't empty
                              ) {
                                submitMessage(
                                  message,
                                  wallet,
                                  convo,
                                  setAllMessages,
                                  allMessages,
                                  setMessage,
                                  messageContainer,
                                  messageBox
                                );
                              }
                              setMessage(e.currentTarget.value);
                            }}
                            onChange={(e) => {
                              setMessage(e.currentTarget.value);
                            }}
                          />
                          <Center justifyContent="flex-end" gap={5}>
                            <Button
                              // ml="auto"
                              colorScheme="linkedin"
                              onClick={async () => {
                                if (
                                  message && // if message isn't empty
                                  message.trim()
                                ) {
                                  submitMessage(
                                    message,
                                    wallet,
                                    convo,
                                    setAllMessages,
                                    allMessages,
                                    setMessage,
                                    messageContainer,
                                    messageBox
                                  );
                                }
                              }}
                            >
                              Send
                            </Button>
                          </Center>
                        </Flex>
                      </Flex>
                    </FormControl>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </Center>
        );
      })}
    </Center>
  );
};
export default RenderConversations;

// BLOCK USER TODO:
{
  /* <Button
      ml="auto"
      colorScheme="red"
      onClick={async () => {
        await contract.methods
          .blockUser(convo.messages[0].receiver, convo.tokenID)
          .send({ from: wallet })
          .then((res) => {
            console.log(res);
            return toast({
              title: "User blocked!", // prompt success message
              description: `Tx hash: ${res.transactionHash}`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          });
      }}
    >
    Block
  </Button> */
}
