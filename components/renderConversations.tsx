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
import encrypt from "../web3/cryptography/encrypt";
import decrypt from "../web3/cryptography/decrypt";
import sendMessage from "../helpers/sendMessage";
import RenderMessages from "./renderMessages";
import conversationsFile from "../conversations.json";
import getMessagesFromJSON from "../helpers/getConvosFromJSON";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase";

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
  const [convos, setconvos] = useState(conversations);

  return (
    <Center flexDir="column" w="100%">
      {/* IF NOT SETTING CONVOS, CHANGE TO conversations.map() */}
      {convos.map((convo, i) => {
        const [hasBeenChecked, sethasBeenChecked] = useState(
          convo.messages.length
            ? convo.messages[convo.messages.length - 1].sender != wallet
            : false
        );
        const [allMessages, setAllMessages] = useState(convo.messages);
        useEffect(() => {
          const convoRef = ref(database, `convos/${convo.tokenID}`);
          onValue(convoRef, (snapshot) => {
            const { message } = snapshot.val();
            console.log("okay so this is when we load:", message);
            setAllMessages([...message]);
          });
        }, []);

        return (
          <Center mt={3} flexDir="column" key={i} w="100%">
            <Button
              p="4%"
              mt={3}
              onClick={() => {
                setCurrentModalOpen(i);
                sethasBeenChecked(true);
                onOpen();
              }}
              w="100%"
              display="flex"
              justifyContent="space-between"
            >
              <Text textAlign="right" fontWeight="500">
                Conversation with{" "}
                <span style={{ fontWeight: "bold" }}>
                  {/* {console.log(convo)} */}
                  {convo.messages[0].receiver == wallet
                    ? convo.messages[0].sender
                    : convo.messages[0].receiver}
                </span>
              </Text>
              <Box textAlign="right">
                {convo.messages[convo.messages.length - 1].sender != wallet &&
                  !hasBeenChecked && (
                    <Box color="white" p={1.5} bg="red" borderRadius={20}>
                      {" "}
                      New
                    </Box>
                  )}
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
                    <span style={{ fontWeight: "bold" }}>
                      {convo.messages[0].receiver}
                    </span>
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
                          overflowY="scroll"
                          border="1px solid black"
                          borderRadius={10}
                          h="52.5vh"
                          // bg="red"
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
                                e.key === "Enter" && // when user presses enter
                                message != "" // and message isn't empty
                              ) {
                                // encrypt message
                                const encryptedMessageToSend = {
                                  sender: wallet,
                                  message: encrypt(convo.secretHash, message),
                                };
                                // add it to the current messages
                                allMessages.push(encryptedMessageToSend);
                                // update array of messages and rerender for instant changes
                                setAllMessages([...allMessages]);
                                // send message
                                sendMessage(convo, allMessages);

                                // @ts-ignore
                                messageBox.current.value = ""; // set message box as empty
                                setMessage("");
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
                                if (message != "") {
                                  // encrypt message
                                  const encryptedMessageToSend = {
                                    sender: wallet,
                                    message: encrypt(convo.secretHash, message),
                                  };
                                  // add it to the current messages
                                  allMessages.push(encryptedMessageToSend);
                                  // update array of messages and rerender for instant changes
                                  setAllMessages([...allMessages]);
                                  // send message
                                  sendMessage(convo, allMessages);
                                  // @ts-ignore
                                  messageBox.current.value = ""; // set message box as empty
                                  setMessage("");
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
