import { NextApiRequest, NextApiResponse } from "next";
import previousConversations from "../../conversations.json";
import fs from "fs";

const getConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const { query } = req;

    // write to json file
    const data = fs.readFileSync(`./conversations.json`);
    // const someData = await fetch("./conversations.json");
    // const data = await someData.json();

    // return size in MB
    res.json(data);
  } catch (err) {
    res.status(err.status).json({ err: err.message });
  }
};
export default getConversation;

// fs.writeFile(`./conversations.json`, jsonString, (err) => {
//     if (err) {
//       console.log("Error writing file", err);
//     } else {
//       console.log("Successfully wrote file");
//     }
//   });
