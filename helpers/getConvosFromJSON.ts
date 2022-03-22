const getMessagesFromJSON = async (tokenID) => {
  const response = await fetch("/api/getConvo", {
    headers: {
      tokenID,
    },
  });
  const responseData = await response.json();
  return responseData;
};
export default getMessagesFromJSON;
