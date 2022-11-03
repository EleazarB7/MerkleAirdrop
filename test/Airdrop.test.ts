import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Airdrop__factory, GauntletNFT__factory } from '../../typechain-types'
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'

describe('Airdrop', () => {
    it('Full Cycle',async () => {
        const [signer, guy] = await ethers.getSigners()

        const token = await new GauntletNFT__factory(signer).deploy()

        const whitelistedAddresses = ['0xc5f4cfbcc2389528f8d464ef13237773132383f1', '0xe834717ecfb5e21cd712d5f41c249e36bb422c88', '0xafd01787061442136a8fc3a57bb8a458e8dc983b',
        '0x0b3233fe361955d0fb9796d89eeadc834c21f3fc', '0xa120690093dcd21a987c02eeb5f1e0b851b940a5', '0x275986f4f52a03a24c926616e53165bc27edf65e', '0x9670565d943d1dce25e842e9666da047c55e1bcf'];
            
            
       /**First argument is a list of elements of the given tree. Second argument is the hashing algorithm
        Third argument is to correctly build Merkles tree*/
        const merkleTree = new MerkleTree(
            whitelistedAddresses.concat(signer.address),
            keccak256,
            { hashLeaves: true, sortPairs: true }
        )

        const root = merkleTree.getHexRoot() // Get the root of the tree, bytes32 that we will store in the smartcontract

        // Deploy airdrop contract
        const airdrop = await new Airdrop__factory(signer).deploy(
            token.address,
            root
        )
        
        // Giving the role of minter to the airdrop contract
        await token.grantRole(await token.MINTER_ROLE(), airdrop.address)

        // Generate a proof that our signer is in the merkle tree, we will use it for the claim
        const proof = merkleTree.getHexProof(keccak256(signer.address))

        // Simple checks, the correct work of our smart contracts
        expect(await airdrop.claimed(signer.address)).to.eq(false)

        expect(await airdrop.canClaim(signer.address, proof)).to.eq(true)

        await airdrop.claim(proof)

        expect(await airdrop.claimed(signer.address)).to.eq(true)

        expect(await airdrop.canClaim(signer.address, proof)).to.eq(false)

        expect(await token.ownerOf(0)).to.eq(signer.address)

        await expect(airdrop.claim(proof)).to.be.revertedWith(
            'Airdrop: Address is not a candidate for claim'
        )

        expect(await airdrop.claimed(guy.address)).to.eq(false)

        expect(await airdrop.canClaim(guy.address, proof)).to.eq(false)

        await expect(airdrop.connect(guy).claim(proof)).to.be.revertedWith(
            'Airdrop: Address is not a candidate for claim'
        )

        const badProof = merkleTree.getHexProof(keccak256(guy.address))

        expect(badProof).to.eql([])

        expect(await airdrop.canClaim(guy.address, badProof)).to.eq(false)

        await expect(airdrop.connect(guy).claim(badProof)).to.be.revertedWith(
            'Airdrop: Address is not a candidate for claim'
        )
    })
})
