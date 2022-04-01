const switchNetworkBinance = async () => {
  // @ts-expect-error
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x61" }],
  });
};
export default switchNetworkBinance;
