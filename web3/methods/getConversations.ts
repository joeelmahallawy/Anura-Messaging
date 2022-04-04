import { Conversation } from "../../interfaces";
import { child, get, onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const getConversations = async (contract, wallet, ipfs?) => {
  const activeConversations: Conversation[] = await contract.methods // get all active conversations
    .getMyActiveConversations(wallet[0])
    .call({ from: wallet[0] });

  const allConversations = [];

  for (let i = 0; i < activeConversations.length; i++) {
    const dbRef = ref(database); // get db
    await get(child(dbRef, `convos/${activeConversations[i].tokenID}`)) // read convo from current bucket
      .then((snapshot) => {
        if (snapshot.exists()) {
          // if exists
          const { message } = snapshot.val(); // array of messages in this bucket

          allConversations.push({
            // push all necessary data to conversations array
            secretHash: activeConversations[i].secretHash,
            tokenID: activeConversations[i].tokenID,
            IPFSendpoint: activeConversations[i].IPFSendpoint,
            messages: message,
          });
        } else {
          alert(
            "No conversations available here. If you can see this error, please message MoreThanYourAverageJoe#3911 on Discord to fix it, thanks!"
          );
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return allConversations;
};
export default getConversations;
