import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import OTMarket from "../artifacts/contracts/OTMarket.sol/OTMarket.json";

export default function Dashboard() {
  // array of nfts
  const [nfts, setNFTs] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // what we want to load
    // we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      OTMarket.abi,
      signer
    );
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    // create a filtered array of items that have been sold
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNFTs(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="relative text-white text-[46px] font-semibold text-center ">
        You have not minted any NFTs yet
      </h1>
    );

  return (
    <>
      <div className="p-4">
        <h1 className="relative text-white text-[46px] font-semibold text-center ">
          Tokens Minted
        </h1>
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-x1 overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p
                    style={{ height: "64px" }}
                    className="text-white text-3xl font-semibold"
                  >
                    {nft.name}
                  </p>
                  <div style={{ heigh: "72px", overflow: "hidden" }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-3x-l mb-4 font-bold text-black">
                    <img
                      className="eth-logo"
                      src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg"
                    />
                    {nft.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
