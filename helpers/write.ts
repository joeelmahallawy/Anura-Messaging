import { ref, set } from "firebase/database";
import { database } from "../firebase";
const write = (tokenID, message) => {
  set(ref(database, `convos/${String(tokenID)}`), { message });
};
export default write;
// FIXME: BUG WITH SYNC OF FIREBASE
