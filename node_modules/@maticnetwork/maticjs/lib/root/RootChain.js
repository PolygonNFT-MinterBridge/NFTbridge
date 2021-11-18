"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ContractsBase_1 = __importDefault(require("../common/ContractsBase"));
var bn_js_1 = __importDefault(require("bn.js"));
var logger = {
    info: require('debug')('maticjs:Web3Client'),
    debug: require('debug')('maticjs:debug:Web3Client'),
};
var RootChain = /** @class */ (function (_super) {
    __extends(RootChain, _super);
    function RootChain(options, web3Client) {
        var _this = _super.call(this, web3Client, options.network) || this;
        _this.rootChain = new _this.web3Client.parentWeb3.eth.Contract(options.network.abi('RootChain'), options.rootChain);
        return _this;
    }
    RootChain.prototype.getLastChildBlock = function () {
        return this.web3Client.call(this.rootChain.methods.getLastChildBlock());
    };
    RootChain.prototype.getCheckpointInclusion = function (burnTxHash) {
        return __awaiter(this, void 0, void 0, function () {
            var lastChildBlock, burnTx, headerBlockNumber, headerBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLastChildBlock()];
                    case 1:
                        lastChildBlock = _a.sent();
                        return [4 /*yield*/, this.web3Client.getMaticWeb3().eth.getTransaction(burnTxHash)];
                    case 2:
                        burnTx = _a.sent();
                        if (new bn_js_1.default(lastChildBlock).lt(new bn_js_1.default(burnTx.blockNumber))) {
                            return [2 /*return*/, 'Burn transaction has not been checkpointed as yet'];
                        }
                        return [4 /*yield*/, this.findHeaderBlockNumber(burnTx.blockNumber)];
                    case 3:
                        headerBlockNumber = _a.sent();
                        return [4 /*yield*/, this.web3Client.call(this.rootChain.methods.headerBlocks(this.encode(headerBlockNumber)))];
                    case 4:
                        headerBlock = _a.sent();
                        return [2 /*return*/, headerBlock];
                }
            });
        });
    };
    RootChain.prototype.findHeaderBlockNumber = function (childBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var start, end, _a, ans, mid, headerBlock, headerStart, headerEnd;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        childBlockNumber = new bn_js_1.default(childBlockNumber);
                        start = RootChain.BIG_ONE;
                        _a = bn_js_1.default.bind;
                        return [4 /*yield*/, this.web3Client.call(this.rootChain.methods.currentHeaderBlock())];
                    case 1:
                        end = new (_a.apply(bn_js_1.default, [void 0, _b.sent()]))().div(RootChain.CHECKPOINT_ID_INTERVAL);
                        _b.label = 2;
                    case 2:
                        if (!start.lte(end)) return [3 /*break*/, 4];
                        if (start.eq(end)) {
                            ans = start;
                            return [3 /*break*/, 4];
                        }
                        mid = start.add(end).div(RootChain.BIG_TWO);
                        logger.debug({ start: start.toString(), mid: mid.toString(), end: end.toString() }); // eslint-disable-line
                        return [4 /*yield*/, this.web3Client.call(this.rootChain.methods.headerBlocks(mid.mul(RootChain.CHECKPOINT_ID_INTERVAL).toString()))];
                    case 3:
                        headerBlock = _b.sent();
                        headerStart = new bn_js_1.default(headerBlock.start);
                        headerEnd = new bn_js_1.default(headerBlock.end);
                        if (headerStart.lte(childBlockNumber) && childBlockNumber.lte(headerEnd)) {
                            // if childBlockNumber is between the upper and lower bounds of the headerBlock, we found our answer
                            ans = mid;
                            return [3 /*break*/, 4];
                        }
                        else if (headerStart.gt(childBlockNumber)) {
                            // childBlockNumber was checkpointed before this header
                            end = mid.sub(RootChain.BIG_ONE);
                        }
                        else if (headerEnd.lt(childBlockNumber)) {
                            // childBlockNumber was checkpointed after this header
                            start = mid.add(RootChain.BIG_ONE);
                        }
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, ans.mul(RootChain.CHECKPOINT_ID_INTERVAL)];
                }
            });
        });
    };
    RootChain.BIG_ONE = new bn_js_1.default(1);
    RootChain.BIG_TWO = new bn_js_1.default(2);
    RootChain.CHECKPOINT_ID_INTERVAL = new bn_js_1.default(10000);
    return RootChain;
}(ContractsBase_1.default));
exports.default = RootChain;
