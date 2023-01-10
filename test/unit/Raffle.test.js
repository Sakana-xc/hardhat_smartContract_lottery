const { assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : ("Raffle Uint Test",
      async function () {
          let raffle, vrfCoordinatorV2Mock
          const chainId = network.config.chainId

          beforeEach(async function () {
              const { deployer } = await getNamedAccounts()
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", async function () {
              it("initialized the raffle correctly", async function () {
                  //ideally 1 assert per it
                  raffleState = await raffle.getRaffleState()
                  interval = await raffle.getInterval()
                  assert.equal(raffleState.toString(), "0")
                  //   assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })
      })
