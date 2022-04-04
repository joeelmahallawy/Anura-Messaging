const switchNetworkHarmony = async () => {
  try {
    // @ts-expect-error
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x89" }],
    });
  } catch (err) {
    if (err.code === 4902) {
      try {
        // @ts-expect-error
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x89",
              chainName: "Polygon Mainnet",
              rpcUrls: ["https://polygon-rpc.com/"],
              nativeCurrency: {
                name: "Matic",
                symbol: "Matic",
                decimals: 18,
              },
              blockExplorerUrls: ["https://polygonscan.com/"],
            },
          ],
        });
      } catch (error) {
        alert(error.message);
      }
    }
  }
};

export default switchNetworkHarmony;
