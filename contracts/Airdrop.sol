// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./IERC721.sol";

contract Airdrop {
    address public immutable token; // Address of the airdrop nft token
    bytes32 public immutable merkleRoot; // Root merkle tree where airdrop candidates are contained

    mapping(address => bool) public claimed; // If address minted the nft then: true

    event Claim(address indexed claimer); // for offchain monitoring who minted the air drop

    constructor(address _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }


    // Here we do not use the claimer because the claimer will be the person who calls this function(msg.sender)
    function claim(bytes32[] calldata merkleProof) external {
        require(
            canClaim(msg.sender, merkleProof),
            "Airdrop: Address is not a candidate for claim"
        );

        claimed[msg.sender] = true;

        IERC721(token).safeMint(msg.sender);

        emit Claim(msg.sender);
    }
    
    // This function shows whether the minter can mint our nft airdrop with the given proof
    function canClaim(address claimer, bytes32[] calldata merkleProof)
        public
        view
        returns (bool) 
    {
        return 
            !claimed[claimer] && // Check that the address has not yet minted the nft
            MerkleProof.verify( // Check that the minter is really in the tree with this proof
                merkleProof,
                merkleRoot,
                keccak256(abi.encodePacked(claimer))
            );
    }
}
