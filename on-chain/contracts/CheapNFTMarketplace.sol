// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CheapNFTMarketplace {
    using Counters for Counters.Counter;
    Counters.Counter private transactionCounter;//start from 1

    event TransactionExecuted (
        uint256 indexed id,
        address ownerAddr,
        address bidderAddr,
        address indexed nftContractAddr,
        uint256 indexed tokenId,
        address erc20ContractAddr,
        uint256 erc20amount,
        bytes ownerSignature,
        bytes bidderSignature
    );

    function executeTransaction(
        address ownerAddr,
        address bidderAddr,
        address nftContractAddr,
        uint256 tokenId,
        address erc20ContractAddr,
        uint256 erc20amount,
        bytes memory ownerSignature,
        bytes memory bidderSignature
    ) public {
        IERC721 nftContract = IERC721(nftContractAddr);
        IERC20 erc20Contract = IERC20(erc20ContractAddr);

        require(nftContract.ownerOf(tokenId) == ownerAddr, "NFT is not owned by the ownerAddr");
        require(nftContract.getApproved(tokenId) == address(this), "NFT must be approved to market");
        require(erc20Contract.allowance(bidderAddr, address(this)) >= erc20amount, "Bidder must be approved at least the bid amount");
        
        bytes32 messageHash = getMessageHash(ownerAddr, bidderAddr, nftContractAddr, tokenId, erc20ContractAddr, erc20amount);

        require(getAddr(messageHash, ownerSignature) == ownerAddr, "Message it's not properly signed by the owner");
        require(getAddr(messageHash, bidderSignature) == bidderAddr, "Message it's not properly signed by the bidder");

        nftContract.safeTransferFrom(ownerAddr, bidderAddr, tokenId);
        erc20Contract.transferFrom(bidderAddr, ownerAddr, erc20amount);

        uint256 id = transactionCounter.current();
        transactionCounter.increment();

        emit TransactionExecuted(
            id,
            ownerAddr,
            bidderAddr,
            nftContractAddr,
            tokenId,
            erc20ContractAddr,
            erc20amount,
            ownerSignature,
            bidderSignature
        );
    }

    function getMessageHash(
        address ownerAddr,
        address bidderAddr,
        address nftContractAddr,
        uint256 tokenId,
        address erc20ContractAddr,
        uint256 erc20amount
    ) public pure returns(bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(ownerAddr, bidderAddr, nftContractAddr, tokenId, erc20ContractAddr, erc20amount));
        
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function getAddr(
        bytes32 messageHash, 
        bytes memory signature
    ) public pure returns(address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        
        return ecrecover(messageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

}