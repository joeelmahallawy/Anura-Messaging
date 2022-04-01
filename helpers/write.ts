import { ref, set } from "firebase/database";
import { database } from "../firebase";

const write = (tokenID, message) => {
  set(ref(database, `convos/${tokenID}`), { message });
};
export default write;
