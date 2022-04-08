import { task } from 'hardhat/config';
import { BigNumber} from 'ethers';

task('getBalance', 'Get balance of user by token and user addresses')
	.addParam('token', 'Token address')
	.addParam('user', 'User address')
	.setAction(async ({ token, user}, { ethers }) => {
		const contract = await ethers.getContractAt('GoToken', token);
		const balance = (await contract.balanceOf(user)).toString();
		console.log(`Balance: ${balance}`);
	});
