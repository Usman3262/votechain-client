// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17 <0.9.0;

/**
 * @title VoteChain
 * @author Usman Ali
 * @notice Anonymous Blockchain Voting System with Privacy-Preserving Relayer Model
 * @dev Implements zero-knowledge voting using nullifier hashes to prevent double voting
 *      while preserving voter anonymity
 */
contract VoteChain {
    address public owner;
    mapping(address => bool) public admins;
    
    struct Election {
        string title;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
    }
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
    mapping(uint256 => uint256[]) public electionCandidates;
    mapping(bytes32 => bool) public nullifierUsed; // Privacy: prevents double voting without linking voter to vote
    
    uint256 public electionCount;
    uint256 public candidateCount;
    
    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event ElectionStarted(uint256 indexed electionId);
    event ElectionEnded(uint256 indexed electionId);
    event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, bytes32 indexed nullifierHash);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admins can call this function");
        _;
    }
    
    modifier electionExists(uint256 _electionId) {
        require(elections[_electionId].startTime > 0, "Election does not exist");
        _;
    }
    
    modifier electionActive(uint256 _electionId) {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election is not active");
        require(block.timestamp >= election.startTime, "Election has not started yet");
        require(block.timestamp <= election.endTime, "Election has ended");
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    /**
     * @notice Creates a new election
     * @param _title Election title
     * @param _startTime Unix timestamp for election start
     * @param _endTime Unix timestamp for election end
     */
    function createElection(
        string memory _title,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyAdmin returns (uint256) {
        require(_startTime < _endTime, "Start time must be before end time");
        require(_startTime > block.timestamp, "Start time must be in the future");
        
        electionCount++;
        elections[electionCount] = Election({
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            isActive: false,
            totalVotes: 0
        });
        
        emit ElectionCreated(electionCount, _title, _startTime, _endTime);
        return electionCount;
    }

    /**
     * @notice Adds a candidate to an election
     * @param _electionId ID of election
     * @param _name Candidate name
     */
    function addCandidate(uint256 _electionId, string memory _name) 
        external 
        onlyAdmin 
        electionExists(_electionId) 
        returns (uint256) 
    {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidateCount++;
        candidates[_electionId][candidateCount] = Candidate({
            name: _name,
            voteCount: 0
        });
        
        electionCandidates[_electionId].push(candidateCount);
        
        emit CandidateAdded(_electionId, candidateCount, _name);
        return candidateCount;
    }

    /**
     * @notice Starts an election
     * @param _electionId ID of election to start
     */
    function startElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {
        require(!elections[_electionId].isActive, "Election is already active");
        require(block.timestamp <= elections[_electionId].startTime, "Election start time has passed");
        
        elections[_electionId].isActive = true;
        emit ElectionStarted(_electionId);
    }

    /**
     * @notice Ends an election
     * @param _electionId ID of election to end
     */
    function endElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {
        require(elections[_electionId].isActive, "Election is not active");
        
        elections[_electionId].isActive = false;
        emit ElectionEnded(_electionId);
    }

    /**
     * @notice Casts a vote with privacy preservation using nullifierHash
     * @param _candidateId ID of candidate to vote for
     * @param _nullifierHash Hash of signature to prevent double voting without revealing voter
     */
    function vote(uint256 _candidateId, bytes32 _nullifierHash) 
        external 
        returns (bool) 
    {
        // Verify nullifier has not been used (prevents double voting)
        require(!nullifierUsed[_nullifierHash], "Vote already cast with this signature");
        
        // Find active election for this candidate
        uint256 targetElectionId = 0;
        for (uint256 i = 1; i <= electionCount; i++) {
            if (elections[i].isActive && block.timestamp >= elections[i].startTime && block.timestamp <= elections[i].endTime) {
                // Check if candidate exists in this election
                for (uint256 j = 0; j < electionCandidates[i].length; j++) {
                    if (electionCandidates[i][j] == _candidateId) {
                        targetElectionId = i;
                        break;
                    }
                }
                if (targetElectionId != 0) {
                    break;
                }
            }
        }
        
        require(targetElectionId != 0, "No active election found for this candidate");
        
        // Mark nullifier as used to prevent double voting
        nullifierUsed[_nullifierHash] = true;
        
        // Increment vote count
        candidates[targetElectionId][_candidateId].voteCount++;
        elections[targetElectionId].totalVotes++;
        
        emit VoteCast(targetElectionId, _candidateId, _nullifierHash);
        return true;
    }

    /**
     * @notice Checks if a nullifier hash has been used (for double voting prevention)
     * @param _nullifierHash The hash to check
     * @return bool True if already used, false otherwise
     */
    function isNullifierUsed(bytes32 _nullifierHash) external view returns (bool) {
        return nullifierUsed[_nullifierHash];
    }

    /**
     * @notice Gets all vote counts for an election
     * @param _electionId ID of election
     * @return uint256[] Array of vote counts for each candidate
     */
    function getElectionCounts(uint256 _electionId) external view electionExists(_electionId) returns (uint256[] memory) {
        uint256[] memory counts = new uint256[](electionCandidates[_electionId].length);
        for (uint256 i = 0; i < electionCandidates[_electionId].length; i++) {
            uint256 candidateId = electionCandidates[_electionId][i];
            counts[i] = candidates[_electionId][candidateId].voteCount;
        }
        return counts;
    }

    /**
     * @notice Gets all candidates for an election
     * @param _electionId ID of election
     * @return uint256[] Array of candidate IDs
     */
    function getElectionCandidates(uint256 _electionId) external view electionExists(_electionId) returns (uint256[] memory) {
        return electionCandidates[_electionId];
    }

    /**
     * @notice Gets candidate details
     * @param _electionId ID of election
     * @param _candidateId ID of candidate
     * @return string Candidate name
     * @return uint256 Vote count
     */
    function getCandidateDetails(uint256 _electionId, uint256 _candidateId) 
        external view returns (string memory, uint256) {
        return (candidates[_electionId][_candidateId].name, candidates[_electionId][_candidateId].voteCount);
    }

    /**
     * @notice Transfers ownership of the contract
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Adds an admin address
     * @param adminAddress Address to add as admin
     */
    function addAdmin(address adminAddress) external onlyOwner {
        require(adminAddress != address(0), "Admin address cannot be zero address");
        admins[adminAddress] = true;
    }

    /**
     * @notice Removes an admin address
     * @param adminAddress Address to remove as admin
     */
    function removeAdmin(address adminAddress) external onlyOwner {
        require(adminAddress != owner, "Cannot remove contract owner from admin");
        admins[adminAddress] = false;
    }

    /**
     * @notice Gets current election status
     * @param _electionId ID of election
     * @return bool True if active, false otherwise
     */
    function isElectionActive(uint256 _electionId) external view electionExists(_electionId) returns (bool) {
        Election memory election = elections[_electionId];
        return election.isActive && 
               block.timestamp >= election.startTime && 
               block.timestamp <= election.endTime;
    }
}