import write from "./write";

const sendMessage = async (convo, messages) => {
  try {
    write(convo.tokenID, messages); // write message to that token's bucket
  } catch (err) {
    alert(err.message);
  }
};
export default sendMessage;
