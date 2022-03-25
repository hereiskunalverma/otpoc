import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import { useRouter } from "next/router";
import OTMarket from "../artifacts/contracts/OTMarket.sol/OTMarket.json";
import "font-awesome/css/font-awesome.min.css";

//in this component we set the ipfs up to host our nft data of file storage

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function MintItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  // set up a function to fireoff when we update files inour form - we can add our NFT images - IPFS

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      setLoading(false);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  }

  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    // upload to IPFS
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // run a function that create sale and passes in the url
      createSale(url);
    } catch (error) {}
  }

  async function createSale(url) {
    setMinting(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // we want to create the token
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.mintToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    // list item for sale on marketplace
    contract = new ethers.Contract(nftmarketaddress, OTMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    setMinting(false);
    router.push("./");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="mt-4" onChange={onChange} />
        {fileUrl && (
          <img className="rounded mt-4" width="350px" src={fileUrl} />
        )}
        <button
          onClick={createMarket}
          disabled={isLoading || minting}
          className={`font-bold mt-4  ${
            isLoading ? "bg-gray-700" : minting ? "bg-gray-700" : "bg-[#2081E2]"
          } text-white rounded p-4 shadow-lg`}
        >
          {isLoading ? (
            <span>Upload fields</span>
          ) : minting ? (
            <span>
              <i
                className="fa fa-refresh fa-spin"
                style={{ marginRight: "5px" }}
              />
              Minting NFT
            </span>
          ) : (
            <span>Mint NFT</span>
          )}
        </button>
      </div>
    </div>
  );
}
