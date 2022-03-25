//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// openzeppelin ERC721 NFT functionality

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';


contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // counters allows us to keep track of tokenIds
    address contractAddress;

    // OBJ: give the NFT market to transact with tokens or change ownership
    // setApproalForAll allows us to do that with contract address

    // constructor to set up our address
    constructor(address marketplaceAddress) ERC721('OTpoc','OTPOC'){
        contractAddress = marketplaceAddress;
    }

    // function to mint tokens
    function mintToken(string memory tokenURI) public returns(uint){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // set the token URI and id
        _mint(msg.sender,newItemId);
        _setTokenURI(newItemId,tokenURI);
        // give the marketplace the approval to transact between users
        setApprovalForAll(contractAddress,true);
        // mint the token and set it for sell
        return newItemId;
    }
}

