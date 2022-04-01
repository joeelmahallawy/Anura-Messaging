import {
  Box,
  Button,
  Center,
  Text,
  Heading,
  Input,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import StartConvoModal from "../components/startConvoModal";
import loadContract, { web3 } from "../web3/loadContract";
import getConversations from "../web3/methods/getConversations";
import RenderConversations from "../components/renderConversations";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { database } from "../firebase";
import { onValue, ref, set } from "firebase/database";
import { useRouter } from "next/router";
import switchNetworkBinance from "../web3/switchNetworkBinance";

const BINANCE_TEST_NET_CHAIN_ID = 97;

const IndexPage = () => {
  const router = useRouter();
  const { toggleColorMode, colorMode } = useColorMode();
  const [state, doFetch] = useAsyncFn(async () => {
    if ((await web3.eth.getChainId()) != BINANCE_TEST_NET_CHAIN_ID) {
      // check if we're not on the right chain
      switchNetworkBinance()
        .then(async () => {
          router.reload();
        })
        .catch(async () => {
          try {
            await switchNetworkBinance();
          } catch (err) {
            // if failed, prompt user
            alert(err.message);
          }
        });
    } else {
      // @ts-expect-error
      if (!window.ethereum) alert("Please install Metamask");
      try {
        const contract = await loadContract(); // load contract

        const wallet = await web3.eth.requestAccounts(); // grab wallet from metamask

        const conversations = await getConversations(contract, wallet);

        return {
          contract,
          wallet: wallet[0],
          conversations,
        };
      } catch (err) {
        alert(err.message);
      }
    }
  }, []);

  useEffect(() => {
    doFetch();
  }, []);

  if (!state.value) {
    return (
      <Center h="100vh">
        <Spinner size="xl" speed="1s" />
      </Center>
    );
  }

  return (
    <Box>
      <Center
        p="2.5%"
        flexDir="column"
        bg={colorMode == "light" ? "gray.200" : "gray.900"}
      >
        <Center flexDir="column">
          <Heading>Welcome to Anura's ERC-1155 messaging system!</Heading>
          <Text color="gray">
            The first system that makes it so easy to send cryptographic
            messages
          </Text>

          <Button ml="auto" onClick={toggleColorMode}>
            {colorMode == "dark" ? <BsFillSunFill /> : <BsFillMoonFill />}
          </Button>
        </Center>
      </Center>
      <Center p="1%" borderRadius={10} flexDir="column" w="70%" m="0 auto">
        {state.value?.conversations ? (
          <RenderConversations state={state.value && state.value} />
        ) : (
          <Spinner size="xl" speed="1s" />
        )}

        <StartConvoModal state={state} />
      </Center>
    </Box>
  );
  // return null;
};

export default IndexPage;

// const ipfs = await IPFS.create();

//       const file = {
//         path: "LoganRocks",
//         content: Buffer.from("fuck u logan u don't know how to use ipfs"),
//       };
//       const filesAdded = await ipfs.add(file);
//       // console.log(filesAdded.cid.toString());
//       const publish = await ipfs.name.publish(filesAdded.cid.toString());
//       console.log(publish);

// TODO:TODO:TODO:TODO:TODO:TODO:TODO:
// const ipfsClient = await IPFS.create({
//   config: {
//     Identity: {
//       PrivKey:
//         "CAESQGnUyIpxSRJXKDQjkzVDULU3PJIoklHN5pU9hlWXCJLyDbMWcpIb6EUsq/Pvs1BGSr9Z7NXcIVMxcTMM0CnY+9M=",
//       PeerID: "12D3KooWAjqrYGPWDWHEXdKgCbFevgo6JDUDZHi6AqB4EATDMiYi",
//     },
//   },
//   init: {
//     privateKey: "12D3KooWAjqrYGPWDWHEXdKgCbFevgo6JDUDZHi6AqB4EATDMiYi",
//   },
//   start: true,
//   EXPERIMENTAL: {
//     ipnsPubsub: true,
//   },
// });
// console.log(ipfsClient);
// // @ts-expect-error
// window.ipfs = ipfsClient;
// const addData = await ipfsClient.add("did this work or na");
// // ipfsClient.name.publish('')
// const pin = await ipfsClient.pin.add(addData.cid.toString());

// console.log("test this out:", pin.toString());
