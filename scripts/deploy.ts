mport { ethers, run } from 'hardhat'
import keccak256 from 'keccak256'
import MerkleTree from 'merkletreejs'

import { Airdrop__factory, GauntletNFT__factory } from '../../typechain-types'

async function main() {
  const [signer] = await ethers.getSigners()

  const token = await new GauntletNFT__factory(signer).deploy()

  await token.deployed()

  console.log('NFT deployed to:', token.address)

  // Array of withelisted addresses
  const whitelistedAddresses = ['0xc5f4cfbcc2389528f8d464ef13237773132383f1', '0xe834717ecfb5e21cd712d5f41c249e36bb422c88', '0xafd01787061442136a8fc3a57bb8a458e8dc983b',
  '0x0b3233fe361955d0fb9796d89eeadc834c21f3fc', '0xa120690093dcd21a987c02eeb5f1e0b851b940a5', '0x275986f4f52a03a24c926616e53165bc27edf65e', '0x9670565d943d1dce25e842e9666da047c55e1bcf'];
    

  const merkleTree = new MerkleTree(
    whitelistedAddresses.concat(signer.address),
    keccak256,
    { hashLeaves: true, sortPairs: true }
  )

  const root = merkleTree.getHexRoot()

  const airdrop = await new Airdrop__factory(signer).deploy(token.address, root)

  await airdrop.deployed()

  console.log('Airdrop deployed to:', airdrop.address)

  await (
    await token.grantRole(await token.MINTER_ROLE(), airdrop.address)
  ).wait()

  const proof = merkleTree.getHexProof(keccak256(signer.address))

  console.log('Proof for Claim:', proof)

  // These two functions verify our smart contracts on etherscan
  await run('verify:verify', {
    address: token.address,
    contract: 'contracts/GauntletNFT.sol:GauntletNFT'
  })

  await run('verify:verify', {
    address: airdrop.address,
    contract: 'contracts/Airdrop.sol:Airdrop',
    constructorArguments: [token.address, root]
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})