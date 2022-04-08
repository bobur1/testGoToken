import { task } from 'hardhat/config';
import { BigNumber} from 'ethers';

task('approve', 'Approve to use amount of tokens to spender')
	.addParam('token', 'Token address')
	.addParam('spender', 'Spender address')
	.addParam('amount', 'Amount of tokens')
	.setAction(async ({ token, spender, amount }, { ethers }) => {
		const [owner] = await ethers.getSigners();
		const contract = await ethers.getContractAt('GoToken', token);

		await contract.approve(spender, amount);

		const allowance = (await contract.allowance(owner, spender)).toString();
		console.log(`Current allowance: ${allowance}`);
	});
