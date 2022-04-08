import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, network } from 'hardhat';
import { expect, assert } from 'chai';
import { BigNumber } from 'ethers';


import Web3 from 'web3';
// @ts-ignore
const web3 = new Web3(network.provider) as Web3;

import { GoToken } from '../typechain';

let goToken: GoToken;

let owner: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;

describe('Contract: CustomToken', () => {
	before(async () => {
		[owner, user1, user2, user3] = await ethers.getSigners();
	});

	beforeEach(async () => {
		let GoToken = await ethers.getContractFactory('GoToken');
		goToken = await GoToken.deploy() as GoToken;
		await goToken.deployed();
	});

	describe('Initial state', () => {
		it('Check name', async () => {
			expect(await goToken.name()).to.equal('GO!');
		});

		it('Check symbol', async () => {
			expect(await goToken.symbol()).to.equal('GO');
		});
	});

	describe('Transactions', () => {
		const oneEther = BigNumber.from(10).pow(18);
		const zeroAddress = ethers.constants.AddressZero;

		beforeEach(async () => {
			await goToken.mint(user1.address, oneEther.mul(10));
			await goToken.connect(user1).approve(user2.address, oneEther.mul(5));
		});

		it('Check mint', async () => {
			expect(await goToken.balanceOf(user1.address)).to.equal(oneEther.mul(10));
			expect(await goToken.totalSupply()).to.equal(oneEther.mul(10));
		});

		it('User cannot mint to zero address', async () => {		
			await expect(goToken.mint(zeroAddress, oneEther))
			.to.revertedWith('ERC20: mint to the zero address');
		});

		it('Transfer 1 ether', async () => {
			await goToken.connect(user1).transfer(user2.address, oneEther);

			expect(await goToken.balanceOf(user1.address)).to.equal(oneEther.mul(9));
			expect(await goToken.balanceOf(user2.address)).to.equal(oneEther);
		});

		it('User cannot transfer more than has', async () => {		
			await expect(goToken.connect(user1).transfer(user2.address, oneEther.mul(11)))
			.to.revertedWith('ERC20: transfer amount exceeds balance');
		});

		it('User cannot transfer to zero address', async () => {		
			await expect(goToken.connect(user1).transfer(zeroAddress, oneEther))
			.to.revertedWith('ERC20: transfer to the zero address');
		});

		it('Cannot approve zero address', async () => {		
			await expect(goToken.connect(user1).approve(zeroAddress, oneEther))
			.to.revertedWith('ERC20: approve to the zero address');
		});

		it('Check allowance', async () => {
			expect(await goToken.allowance(user1.address, user3.address)).to.equal(0);

			await goToken.connect(user1).approve(user3.address, oneEther);
			
			expect(await goToken.allowance(user1.address, user3.address)).to.equal(oneEther);
		});

		it('Check increase allowance', async () => {
			await goToken.connect(user1).increaseAllowance(user2.address, oneEther);
			
			expect(await goToken.allowance(user1.address, user2.address)).to.equal(oneEther.mul(6));
		});

		it('Check decrease allowance', async () => {
			await goToken.connect(user1).decreaseAllowance(user2.address, oneEther);
			
			expect(await goToken.allowance(user1.address, user2.address)).to.equal(oneEther.mul(4));
		});

		it('Cannot decrease allowance below zero', async () => {
			await expect(goToken.connect(user1).decreaseAllowance(user3.address, 1))
			.to.revertedWith('ERC20: decreased allowance below zero');
		});

		it('Transfer by approved user', async () => {		
			await goToken.connect(user2).transferFrom(user1.address, user3.address, oneEther);
			
			expect(await goToken.balanceOf(user1.address)).to.equal(oneEther.mul(9));
			expect(await goToken.balanceOf(user3.address)).to.equal(oneEther);
		});

		it('Approved user cannot exeed approved amount to transfer', async () => {
			await expect(goToken.connect(user2).transferFrom(user1.address, user3.address, oneEther.mul(6)))
			.to.revertedWith('ERC20: transfer amount exceeds allowance');
		});

		it('Approved user cannot transfer more than original owner has', async () => {
			await expect(goToken.connect(user2).transferFrom(user1.address, user3.address, oneEther.mul(11)))
			.to.revertedWith('ERC20: transfer amount exceeds balance');
		});

		it('Approved user cannot transfer to zero address', async () => {
			await expect(goToken.connect(user2).transferFrom(user1.address, zeroAddress, oneEther))
			.to.revertedWith('ERC20: transfer to the zero address');
		});
	});
});
