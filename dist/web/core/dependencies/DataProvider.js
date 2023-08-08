"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDataProvider = void 0;
var ts_object_utils_1 = require("ts-object-utils");
/***
 * You can create a new instance or inherit and override default methods
 * Allows access to data and size. Clone with rows creates a new data provider and let listview know where to calculate row layout from.
 */
var BaseDataProvider = /** @class */ (function () {
    function BaseDataProvider(rowHasChanged, getStableId) {
        this._firstIndexToProcess = 0;
        this._lastIndexToProcess = 0;
        this._size = 0;
        this._data = [];
        this._hasStableIds = false;
        this._requiresDataChangeHandling = false;
        this.rowHasChanged = rowHasChanged;
        if (getStableId) {
            this.getStableId = getStableId;
            this._hasStableIds = true;
        }
        else {
            this.getStableId = function (index) { return index.toString(); };
        }
    }
    BaseDataProvider.prototype.getDataForIndex = function (index) {
        return this._data[index];
    };
    BaseDataProvider.prototype.getAllData = function () {
        return this._data;
    };
    BaseDataProvider.prototype.getSize = function () {
        return this._size;
    };
    BaseDataProvider.prototype.hasStableIds = function () {
        return this._hasStableIds;
    };
    BaseDataProvider.prototype.requiresDataChangeHandling = function () {
        return this._requiresDataChangeHandling;
    };
    BaseDataProvider.prototype.getFirstIndexToProcessInternal = function () {
        return this._firstIndexToProcess;
    };
    BaseDataProvider.prototype.getLastIndexToProcessInternal = function () {
        return this._lastIndexToProcess;
    };
    //No need to override this one`
    //If you already know the first row where rowHasChanged will be false pass it upfront to avoid loop
    BaseDataProvider.prototype.cloneWithRows = function (newData, firstModifiedIndex, lastModifiedIndex) {
        if (firstModifiedIndex === void 0) { firstModifiedIndex = 0; }
        var dp = this.newInstance(this.rowHasChanged, this.getStableId);
        var newSize = newData.length;
        var iterCount = Math.min(this._size, newSize);
        if (!ts_object_utils_1.ObjectUtil.isNullOrUndefined(firstModifiedIndex) && !ts_object_utils_1.ObjectUtil.isNullOrUndefined(lastModifiedIndex)) {
            dp._firstIndexToProcess = Math.max(Math.min(firstModifiedIndex, this._data.length), 0);
            dp._lastIndexToProcess = Math.min(Math.max(firstModifiedIndex, lastModifiedIndex), this._data.length);
        }
        else if (ts_object_utils_1.ObjectUtil.isNullOrUndefined(firstModifiedIndex)) {
            var endIndex = lastModifiedIndex || iterCount;
            for (var i = 0; i < endIndex; i++) {
                if (this.rowHasChanged(this._data[i], newData[i])) {
                    break;
                }
                dp._firstIndexToProcess = i;
            }
            dp._lastIndexToProcess = endIndex;
        }
        else if (ts_object_utils_1.ObjectUtil.isNullOrUndefined(lastModifiedIndex)) {
            for (var i = iterCount; i > firstModifiedIndex; i--) {
                if (this.rowHasChanged(this._data[i], newData[i])) {
                    break;
                }
                dp._lastIndexToProcess = i;
            }
            dp._firstIndexToProcess = firstModifiedIndex;
        }
        else {
            var firstIndexToProcess = 0;
            var isFirstIndexFound = false;
            var lastIndexToProcess = newSize;
            for (var i = 0; i < iterCount; i++) {
                var rowHasChanged = this.rowHasChanged(this._data[i], newData[i]);
                if (!isFirstIndexFound && rowHasChanged) {
                    firstIndexToProcess = i;
                    isFirstIndexFound = true;
                }
                if (isFirstIndexFound && !rowHasChanged) {
                    lastIndexToProcess = i;
                    break;
                }
            }
            dp._firstIndexToProcess = firstIndexToProcess;
            dp._lastIndexToProcess = lastIndexToProcess;
        }
        if (dp._firstIndexToProcess !== this._data.length || dp._lastIndexToProcess !== 0) {
            dp._requiresDataChangeHandling = true;
        }
        dp._data = newData;
        dp._size = newSize;
        return dp;
    };
    return BaseDataProvider;
}());
exports.BaseDataProvider = BaseDataProvider;
var DataProvider = /** @class */ (function (_super) {
    __extends(DataProvider, _super);
    function DataProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataProvider.prototype.newInstance = function (rowHasChanged, getStableId) {
        return new DataProvider(rowHasChanged, getStableId);
    };
    return DataProvider;
}(BaseDataProvider));
exports.default = DataProvider;
//# sourceMappingURL=DataProvider.js.map