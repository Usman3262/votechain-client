const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VoteChain Contract", function () {
  let voteChain;
  let owner;
  let admin;
  let voter1;
  let voter2;
  let relayer;

  beforeEach(async function () {
    [owner, admin, voter1, voter2, relayer] = await ethers.getSigners();

    const VoteChain = await ethers.getContractFactory("VoteChain");
    voteChain = await VoteChain.deploy();
    await voteChain.waitForDeployment();

    // Add admin
    await voteChain.connect(owner).addAdmin(admin.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await voteChain.owner()).to.equal(owner.address);
    });

    it("Should set admin correctly", async function () {
      expect(await voteChain.admins(admin.address)).to.be.true;
    });
  });

  describe("Election Management", function () {
    it("Should create an election", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 100; // 100 seconds from now
      const endTime = startTime + 1000; // 1000 seconds after start

      const tx = await voteChain
        .connect(admin)
        .createElection("Test Election", startTime, endTime);
      
      await expect(tx)
        .to.emit(voteChain, "ElectionCreated")
        .withArgs(1, "Test Election", startTime, endTime);

      const election = await voteChain.elections(1);
      expect(election.title).to.equal("Test Election");
      expect(election.startTime).to.equal(startTime);
      expect(election.endTime).to.equal(endTime);
      expect(election.isActive).to.be.false;
    });

    it("Should add candidates to election", async function () {
      // First create an election
      const startTime = Math.floor(Date.now() / 1000) + 100;
      const endTime = startTime + 1000;
      await voteChain.connect(admin).createElection("Test Election", startTime, endTime);

      const tx = await voteChain.connect(admin).addCandidate(1, "Candidate 1");
      
      await expect(tx)
        .to.emit(voteChain, "CandidateAdded")
        .withArgs(1, 1, "Candidate 1");

      const candidate = await voteChain.candidates(1, 1);
      expect(candidate.name).to.equal("Candidate 1");
      expect(candidate.voteCount).to.equal(0);
    });

    it("Should start an election", async function () {
      // Create election
      const startTime = Math.floor(Date.now() / 1000) + 100;
      const endTime = startTime + 1000;
      await voteChain.connect(admin).createElection("Test Election", startTime, endTime);

      // Add candidate
      await voteChain.connect(admin).addCandidate(1, "Candidate 1");

      // Fast forward to election start time
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTime]);
      
      const tx = await voteChain.connect(admin).startElection(1);
      
      await expect(tx)
        .to.emit(voteChain, "ElectionStarted")
        .withArgs(1);

      const election = await voteChain.elections(1);
      expect(election.isActive).to.be.true;
    });
  });

  describe("Voting", function () {
    let electionId;
    let candidateId1;
    let candidateId2;

    beforeEach(async function () {
      // Create election
      const startTime = Math.floor(Date.now() / 1000) + 100;
      const endTime = startTime + 1000;
      const tx = await voteChain.connect(admin).createElection("Test Election", startTime, endTime);
      await tx.wait();
      electionId = 1;

      // Add candidates
      await voteChain.connect(admin).addCandidate(electionId, "Candidate 1");
      candidateId1 = 1;
      await voteChain.connect(admin).addCandidate(electionId, "Candidate 2");
      candidateId2 = 2;

      // Fast forward to election start time
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTime]);

      // Start election
      await voteChain.connect(admin).startElection(electionId);
    });

    it("Should allow voting", async function () {
      const nullifierHash = ethers.keccak256(ethers.toUtf8Bytes("signature1"));
      
      const tx = await voteChain.connect(relayer).vote(candidateId1, nullifierHash);
      await expect(tx)
        .to.emit(voteChain, "VoteCast")
        .withArgs(electionId, candidateId1, nullifierHash);

      // Check vote counts
      const candidate = await voteChain.candidates(electionId, candidateId1);
      expect(candidate.voteCount).to.equal(1);

      const electionCounts = await voteChain.getElectionCounts(electionId);
      expect(electionCounts[0]).to.equal(1); // First candidate has 1 vote
      expect(electionCounts[1]).to.equal(0); // Second candidate has 0 votes
    });

    it("Should prevent double voting with same nullifier", async function () {
      const nullifierHash = ethers.keccak256(ethers.toUtf8Bytes("signature1"));
      
      // First vote should succeed
      await voteChain.connect(relayer).vote(candidateId1, nullifierHash);
      
      // Second vote with same nullifier should fail
      await expect(
        voteChain.connect(relayer).vote(candidateId2, nullifierHash)
      ).to.be.revertedWith("Vote already cast with this signature");

      // Check vote counts - should still be 1 for first candidate
      const candidate = await voteChain.candidates(electionId, candidateId1);
      expect(candidate.voteCount).to.equal(1);
    });

    it("Should return correct election counts", async function () {
      const nullifier1 = ethers.keccak256(ethers.toUtf8Bytes("signature1"));
      const nullifier2 = ethers.keccak256(ethers.toUtf8Bytes("signature2"));
      
      await voteChain.connect(relayer).vote(candidateId1, nullifier1);
      await voteChain.connect(relayer).vote(candidateId2, nullifier2);

      const counts = await voteChain.getElectionCounts(electionId);
      expect(counts.length).to.equal(2);
      expect(counts[0]).to.equal(1); // First candidate
      expect(counts[1]).to.equal(1); // Second candidate
    });
  });

  describe("Admin Functions", function () {
    it("Should add and remove admins", async function () {
      expect(await voteChain.admins(voter1.address)).to.be.false;
      
      await voteChain.connect(owner).addAdmin(voter1.address);
      expect(await voteChain.admins(voter1.address)).to.be.true;
      
      await voteChain.connect(owner).removeAdmin(voter1.address);
      expect(await voteChain.admins(voter1.address)).to.be.false;
    });

    it("Should transfer ownership", async function () {
      expect(await voteChain.owner()).to.equal(owner.address);
      
      await voteChain.connect(owner).transferOwnership(voter1.address);
      expect(await voteChain.owner()).to.equal(voter1.address);
    });
  });

  describe("Nullifier Check", function () {
    it("Should correctly report used nullifiers", async function () {
      const nullifier = ethers.keccak256(ethers.toUtf8Bytes("signature1"));
      
      expect(await voteChain.isNullifierUsed(nullifier)).to.be.false;
      
      await voteChain.connect(relayer).vote(1, nullifier);
      
      expect(await voteChain.isNullifierUsed(nullifier)).to.be.true;
    });
  });
});