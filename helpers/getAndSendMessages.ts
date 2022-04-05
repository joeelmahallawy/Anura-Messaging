import encrypt from "../web3/cryptography/encrypt";
import sendMessage from "./sendMessage";

const submitMessage = async (
  message,
  wallet,
  convo,
  setAllMessages,
  allMessages,
  setMessage,
  messageContainer,
  messageBox
) => {
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
  // @ts-expect-error
  messageContainer?.current?.scrollTop =
    messageContainer?.current?.scrollHeight;
};

export default submitMessage;
