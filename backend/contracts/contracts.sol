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
    event DataUpload(uint32 indexed system_id, uint32 indexed snapshot_id, bytes name, bytes data);

    modifier FirstTime {
        require(ids[msg.sender] == 0, "Already assigned System id (Use getSystemId call to retrieve it)");
        _;
    }

    modifier Registered {
        require(ids[msg.sender] != 0, "Need to register (Use generateSystemId to register)");
        _;
    }

    function uploadFile(File calldata file) public Registered {
        uint32 id = ids[msg.sender];
        emit DataUpload(id, snapshot[id], file.name, file.data);
    }

    function register() public FirstTime returns(uint32) {
        ids[msg.sender] = next_id;
        return next_id++;
    }

    function getSystemId() public view Registered returns(uint32) {
        return ids[msg.sender];
    }

    function startNewSnapshot() public Registered {
        snapshot[ids[msg.sender]]++;
    }

    function snapshotId() public view Registered returns(uint32) {
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