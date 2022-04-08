import { task } from 'hardhat/config';
import { BigNumber} from 'ethers';

task('getAllowance', 'Get allowance of spender by token, spender and owner addresses')
	.addParam('token', 'Token address')
	.addParam('owner', 'Token owner address')
	.addParam('spender', 'Token spender address')
	.setAction(async ({ token, owner, spender }, { ethers }) => {
		const contract = await ethers.getContractAt('GoToken', token);
		const allowance = (await contract.allowance(owner, spender)).toString();
		console.log(`Allowance: ${allowance}`);
	});
