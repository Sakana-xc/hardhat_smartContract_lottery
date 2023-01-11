const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { resolveConfig } = require("prettier")
const { developmentChains, networkConfig } = require("../../helper-hardhat.config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Uint Test", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with liveChainlink keepers and VRF, we get a random winner", async function () {
                  //enter the raffle, else should be executed automatically
                  const startingTimeStamp = await raffle.getLatestTimeStamp()
                  const accounts = await ethers.getSigners()
                  // set up the listener before we enter the raffle
                  await new Promise(async function (reslove, reject) {
                      console.log("WinnerPicked event fired !")
                      reslove()
                      try {
                          const recentWinner = await raffle.getWinner()
                          const raffleState = await raffle.getRaffleState()
                          const winnerEndingBalance = await accounts[0].getBalance()
                          const endingTimeStamp = await raffle.getLatestTimeStamp()

                          await expected(raffle.getPlayer(0)).to.be.reverted
                          assert.equal(recentWinner.toString, accounts[0])
                          assert.equal(raffleState.toString(), "0")
                          assert.equal(
                              winnerEndingBalance.toString(),
                              winnerStartingBalance.add(raffleEntranceFee).toString()
                          )
                          assert(endingTimeStamp > startingTimeStamp)
                          reslove()
                      } catch (e) {
                          reject(e)
                      }
                  })
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const winnerStartingBalance = await accounts[0].getBalance()
              })
          })
      })
