import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Hero from "../components/Hero";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import OTMarket from "../artifacts/contracts/OTMarket.sol/OTMarket.json";

export default function Home() {
  const [nfts, setNFTs] = useState([]);
  const [purchasing, setPurchasing] = useState(false);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // what we want to load
    // provider, tokenContract, marketContract, data for our marketplace
    const prov="https://ropsten.infura.io/v3/062197f90459457391338d91602a518b"
    const provider = new ethers.providers.JsonRpcProvider(
      prov
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      OTMarket.abi,
      provider
    );
    const data = await marketContract.fetchMarketTokens();

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

    setNFTs(items);
    setLoadingState("loaded");
  }
  // function to buy NFTs for market
  async function buyNFT(nft) {
    setPurchasing(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftmarketaddress,
      OTMarket.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    setPurchasing(false);
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <>
        <Hero />
        <h1 className="relative text-white text-[46px] font-semibold text-center p-4">
          Collections
        </h1>
        <h1 className="text-white px-20 py-7 text-4xl">
          No NFTs in marketplace
        </h1>
      </>
    );

  return (
    <>
      <Hero />
      <h1 className="relative text-white text-[46px] font-semibold text-center p-4">
        Collections
      </h1>
      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
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
                  <button
                    className={`w-full ${
                      purchasing ? "bg-gray-700" : "bg-[#2081E2]"
                    } text-white font-bold py-3 px-12 rounded`}
                    disabled={purchasing}
                    onClick={() => buyNFT(nft)}
                  >
                    {purchasing && <i
                  className="fa fa-refresh fa-spin"
                  style={{ marginRight: "5px" }}
                />}
                    {purchasing ? "Transaction in Progress ..." : "Buy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
