import { NextApiRequest, NextApiResponse } from "next";
import previousConversations from "../../conversations.json";
import fs from "fs";

const getConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const { query } = req;

    // read json
    const data = fs.readFileSync(`./conversations.json`);
    // turn to string
    // const first = data.toString();
    // parse and grab key
    res.json(data);

    // res.json(JSON.parse(first)[query.q]);
  } catch (err) {
    res.status(err.status).json({ err: err.message });
  }
};
export default getConversation;
