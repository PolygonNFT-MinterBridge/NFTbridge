"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var eth_sig_util_1 = require("eth-sig-util");
var ethereumjs_util_1 = __importDefault(require("ethereumjs-util"));
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.prototype.getOrderHash = function (order) {
        var orderData = Buffer.concat([
            ethereumjs_util_1.default.toBuffer(order.id),
            ethereumjs_util_1.default.toBuffer(order.token),
            ethereumjs_util_1.default.setLengthLeft(order.amount, 32),
        ]);
        return ethereumjs_util_1.default.keccak256(orderData);
    };
    Utils.prototype.getTypedData = function (_a) {
        var token = _a.token, spender = _a.spender, tokenIdOrAmount = _a.tokenIdOrAmount, data = _a.data, expiration = _a.expiration, chainId = _a.chainId;
        return {
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'contract', type: 'address' },
                ],
                TokenTransferOrder: [
                    { name: 'spender', type: 'address' },
                    { name: 'tokenIdOrAmount', type: 'uint256' },
                    { name: 'data', type: 'bytes32' },
                    { name: 'expiration', type: 'uint256' },
                ],
            },
            domain: {
                name: 'Matic Network',
                version: '1',
                chainId: chainId,
                contract: token,
            },
            primaryType: 'TokenTransferOrder',
            message: {
                spender: spender,
                tokenIdOrAmount: tokenIdOrAmount,
                data: data,
                expiration: expiration,
            },
        };
    };
    Utils.prototype.signEIP712TypedData = function (data, privateKey) {
        return eth_sig_util_1.signTypedData(ethereumjs_util_1.default.toBuffer(privateKey), {
            data: data,
        });
    };
    return Utils;
}());
exports.Utils = Utils;
