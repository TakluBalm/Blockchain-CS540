// SPDX-License-Identifier: MIT
// Name: Jugal Chapatwala
// Entry Number: 2020CSB1082


pragma solidity ^0.8.0;

contract DataBackup {

    struct File {
        bytes name;
        bytes data;
    }

    mapping(uint32 => uint32) snapshot;
    mapping(address => uint32) ids;
    uint32 next_id = 1;
    event DataUpload(uint32 indexed, uint32 indexed, bytes name, bytes data);

    modifier FirstTime {
        require(ids[msg.sender] == 0, "Already assigned System id (Use getSystemId call to retrieve it)");
        _;
    }

    modifier Exists {
        require(ids[msg.sender] != 0, "Need to register before fetching Id (Use generateSystemId to register)");
        _;
    }

    function uploadFile(File calldata file) public {
        uint32 id = ids[msg.sender];
        emit DataUpload(id, snapshot[id], file.name, file.data);
    }

    function register() public FirstTime returns(uint32) {
        ids[msg.sender] = next_id;
        return next_id++;
    }

    function getSystemId() public view Exists returns(uint32) {
        return ids[msg.sender];
    }

    function startNewSnapshot() public Exists {
        snapshot[ids[msg.sender]]++;
    }

    function snapshotId() public view Exists returns(uint32) {
        return snapshot[ids[msg.sender]];
    }

}

contract RansomWare {
    event Entry(uint32 indexed, int64[] features);
    uint32 id = 0;

    function addEntry(int64[] calldata entry) public  {
        emit Entry(id++, entry);
    }

}