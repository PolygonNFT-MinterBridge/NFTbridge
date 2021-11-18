"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bn_js_1 = __importDefault(require("bn.js"));
var ContractsBase = /** @class */ (function () {
    function ContractsBase(web3Client, network) {
        this.web3Client = web3Client;
        this.network = network;
    }
    ContractsBase.prototype.encode = function (number) {
        if (typeof number === 'number') {
            number = new bn_js_1.default(number);
        }
        else if (typeof number === 'string') {
            if (number.slice(0, 2) === '0x')
                return number;
            number = new bn_js_1.default(number);
        }
        if (bn_js_1.default.isBN(number)) {
            return '0x' + number.toString(16);
        }
    };
    ContractsBase.prototype.getERC20TokenContract = function (token, parent) {
        if (parent === void 0) { parent = false; }
        var web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3;
        return new web3.eth.Contract(this.network.abi('ChildERC20'), token);
    };
    ContractsBase.prototype.getERC721TokenContract = function (token, parent) {
        if (parent === void 0) { parent = false; }
        var web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3;
        return new web3.eth.Contract(this.network.abi('ChildERC721'), token);
    };
    ContractsBase.prototype.getChildMaticContract = function () {
        return new this.web3Client.web3.eth.Contract(this.network.abi('MRC20'), ContractsBase.MATIC_CHILD_TOKEN);
    };
    ContractsBase.prototype.getPOSERC20TokenContract = function (token, parent) {
        if (parent === void 0) { parent = false; }
        var web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3;
        return new web3.eth.Contract(this.network.abi('ChildERC20', 'pos'), token);
    };
    ContractsBase.prototype.getPOSERC721TokenContract = function (token, parent) {
        if (parent === void 0) { parent = false; }
        var web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3;
        return new web3.eth.Contract(this.network.abi('ChildERC721', 'pos'), token);
    };
    ContractsBase.prototype.getPOSERC1155TokenContract = function (token, parent) {
        if (parent === void 0) { parent = false; }
        var web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3;
        return new web3.eth.Contract(this.network.abi('ChildERC1155', 'pos'), token);
    };
    ContractsBase.MATIC_CHILD_TOKEN = '0x0000000000000000000000000000000000001010';
    return ContractsBase;
}());
exports.default = ContractsBase;
