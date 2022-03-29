import { NextApiRequest, NextApiResponse } from "next";
import previousConversations from "../../conversations.json";
import fs from "fs";

const getConversation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { q } = req.query;

    // read json
    const data = fs.readFileSync(`./conversations.json`);

    // turn to string
    // const first = data.toString();
    // parse and grab key
    // res.json(data);
    // @ts-expect-error
    res.json(JSON.parse(data)[q]);
  } catch (err) {
    res.status(err.status).json({ err: err.message });
  }
};
export default getConversation;
