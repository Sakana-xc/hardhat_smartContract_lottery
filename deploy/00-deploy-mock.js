const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")

const BASE_FEE = ethers.utils.parseEther("0.25") // cost 0.25 link per request;
//calcutate value based on the gasprice of the chain
const GAS_PRICE_LINK = 1e9

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        log("Mocks deployed")
        log("----------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]