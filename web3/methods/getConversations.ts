import { Conversation } from "../../interfaces";
import conversations from "../../conversations.json";
import getMessagesFromJSON from "../../helpers/getConvosFromJSON";

const getConversations = async (contract, wallet, ipfs?) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet[0])
    .call({ from: wallet[0] });

  const allConversations = [];

  for (let i = 0; i < activeConversations.length; i++) {
    const messages = await getMessagesFromJSON(activeConversations[i].tokenID);
    // const messages = conversations[activeConversations[i].tokenID];

    allConversations.push({
      // push our data so we can use it
      secretHash: activeConversations[i].secretHash,
      tokenID: activeConversations[i].tokenID,
      IPFSendpoint: activeConversations[i].IPFSendpoint,
      messages,
    });
  }

  return allConversations;
};
export default getConversations;
