# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
# Airdrop and GauntletNFT Contracts

This project includes three Solidity smart contracts that implement an Airdrop system and an ERC-721 token named GauntletNFT on the Ethereum blockchain.

## 1. Airdrop Contract

### Smart Contract Details

- **Name**: Airdrop
- **SPDX-License-Identifier**: MIT
- **Dependencies**: OpenZeppelin's MerkleProof, IERC721

### Functions

- constructor(address _token, bytes32 _merkleRoot)
- claim(bytes32[] calldata merkleProof) external
- canClaim(address claimer, bytes32[] calldata merkleProof) public view returns (bool)

### Usage
- Deploy the **Airdrop contract**, providing the address of the airdrop NFT token and the merkle root.
- Candidates can claim their airdrop by calling the claim function with a valid merkle proof.
  
## 2. GauntletNFT Contract

### Smart Contract Details
- **Name:** GauntletNFT
- **SPDX-License-Identifier:** MIT
- **Dependencies:** OpenZeppelin's ERC721, ERC721URIStorage, AccessControl, Counters
  
### Functions

- constructor()
- safeMint(address to, string memory uri) public onlyRole(MINTER_ROLE)

## Usage
- Deploy the GauntletNFT contract.
- Mint new NFTs by calling the safeMint function, which can only be called by addresses with the MINTER_ROLE.
  
##3. IERC721 Interface

###Smart Contract Details
**Name:** IERC721
SPDX-License-Identifier: MIT
### Functions
- safeMint(addres to) external;

## Usage
- Implement this interface in contracts that should be able to mint NFTs.

