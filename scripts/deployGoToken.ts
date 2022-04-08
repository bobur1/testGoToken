import { GoToken } from '../typechain';
import {ethers, run} from 'hardhat';
import {delay} from '../utils';

async function deployCustomToken() {
	const GoToken = await ethers.getContractFactory('GoToken');
	console.log('deploying Go token');
	const token = await GoToken.deploy() as GoToken;
	console.log('GoToken address: ' + token.address);
	await token.deployed();
	console.log('Wait 20 sec...');
	await delay(20000);
	console.log('Verifying token...');
	try {
		await run('verify:verify', {
			address: token!.address,
			contract: 'contracts/GoToken.sol:GoToken',
			constructorArguments: [],
		});
		console.log('verify success')
	} catch (e: any) {
		console.log(e.message)
	}
}

deployCustomToken()
.then(() => process.exit(0))
.catch(error => {
	console.error(error)
	process.exit(1)
})
