"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require('ethereumjs-util');
var SafeBuffer = require('safe-buffer').Buffer;
var sha3 = utils.keccak256;
var MerkleTree = /** @class */ (function () {
    function MerkleTree(leaves) {
        if (leaves === void 0) { leaves = []; }
        if (leaves.length < 1) {
            throw new Error('Atleast 1 leaf needed');
        }
        var depth = Math.ceil(Math.log(leaves.length) / Math.log(2));
        if (depth > 20) {
            throw new Error('Depth must be 20 or less');
        }
        this.leaves = leaves.concat(Array.from(Array(Math.pow(2, depth) - leaves.length), function () { return utils.zeros(32); }));
        this.layers = [this.leaves];
        this.createHashes(this.leaves);
    }
    MerkleTree.prototype.createHashes = function (nodes) {
        if (nodes.length === 1) {
            return false;
        }
        var treeLevel = [];
        for (var i = 0; i < nodes.length; i += 2) {
            var left = nodes[i];
            var right = nodes[i + 1];
            var data = SafeBuffer.concat([left, right]);
            treeLevel.push(sha3(data));
        }
        // is odd number of nodes
        if (nodes.length % 2 === 1) {
            treeLevel.push(nodes[nodes.length - 1]);
        }
        this.layers.push(treeLevel);
        this.createHashes(treeLevel);
    };
    MerkleTree.prototype.getLeaves = function () {
        return this.leaves;
    };
    MerkleTree.prototype.getLayers = function () {
        return this.layers;
    };
    MerkleTree.prototype.getRoot = function () {
        return this.layers[this.layers.length - 1][0];
    };
    MerkleTree.prototype.getProof = function (leaf) {
        var index = -1;
        for (var i = 0; i < this.leaves.length; i++) {
            if (SafeBuffer.compare(leaf, this.leaves[i]) === 0) {
                index = i;
            }
        }
        var proof = [];
        if (index <= this.getLeaves().length) {
            var siblingIndex = void 0;
            for (var i = 0; i < this.layers.length - 1; i++) {
                if (index % 2 === 0) {
                    siblingIndex = index + 1;
                }
                else {
                    siblingIndex = index - 1;
                }
                index = Math.floor(index / 2);
                proof.push(this.layers[i][siblingIndex]);
            }
        }
        return proof;
    };
    MerkleTree.prototype.verify = function (value, index, root, proof) {
        if (!Array.isArray(proof) || !value || !root) {
            return false;
        }
        var hash = value;
        for (var i = 0; i < proof.length; i++) {
            var node = proof[i];
            if (index % 2 === 0) {
                hash = sha3(SafeBuffer.concat([hash, node]));
            }
            else {
                hash = sha3(SafeBuffer.concat([node, hash]));
            }
            index = Math.floor(index / 2);
        }
        return SafeBuffer.compare(hash, root) === 0;
    };
    return MerkleTree;
}());
exports.default = MerkleTree;
module.exports = MerkleTree;
