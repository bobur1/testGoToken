import { task } from 'hardhat/config';
import { BigNumber} from 'ethers';

task('mint', 'Mint new tokens to the user address')
	.addParam('token', 'Token address')
	.addParam('user', 'User address')
	.addParam('amount', 'Amount of tokens to mint')
	.setAction(async ({ token, user, amount }, { ethers }) => {
		const contract = await ethers.getContractAt('GoToken', token);
		await contract.mint(user, amount);
		const balance = (await contract.balanceOf(user)).toString();
		console.log(`Current balance: ${balance}`);
	});
