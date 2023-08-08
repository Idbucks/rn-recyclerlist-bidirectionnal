"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_native_1 = require("react-native");
var rn_recyclerlist_bidirectionnal_1 = require("rn-recyclerlist-bidirectionnal");
var renderImage = function (type, data) {
    console.log('type', type, data);
    return (React.createElement(react_native_1.View, { key: data === null || data === void 0 ? void 0 : data._id, style: { width: '100%' } },
        React.createElement(react_native_1.View, { style: {
                padding: 10,
            } },
            React.createElement(react_native_1.Text, null,
                "Published by ", data === null || data === void 0 ? void 0 :
                data.text)),
        React.createElement(react_native_1.View, { style: {
                backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                height: 450,
            } }),
        React.createElement(react_native_1.View, { style: {
                padding: 10,
                marginBottom: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
            } },
            React.createElement(react_native_1.TouchableOpacity, null,
                React.createElement(react_native_1.Text, null, "Comment")),
            React.createElement(react_native_1.TouchableOpacity, null,
                React.createElement(react_native_1.Text, null, "Like")))));
};
function App() {
    var _this = this;
    var _a = (0, react_1.useState)([
        {
            _id: 1,
            text: 'Guillaume',
        },
        {
            _id: 2,
            text: 'Alex',
        },
        {
            _id: 3,
            text: 'Claire',
        },
        {
            _id: 4,
            text: 'Jordan',
        },
        {
            _id: 5,
            text: 'Marie',
        },
        {
            _id: 6,
            text: 'Nicolas',
        },
    ]), pictures = _a[0], setPictures = _a[1];
    var layoutProvider = (0, react_1.useState)(new rn_recyclerlist_bidirectionnal_1.LayoutProvider(function () { return 1; }, function (_type, dim) {
        var SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
        dim.width = SCREEN_WIDTH; // Remplacez `SCREEN_WIDTH` par la largeur de l'écran.
        dim.height = 800; // Remplacez `ITEM_HEIGHT` par la hauteur réelle de chaque élément.
    }))[0];
    var _b = (0, react_1.useState)(new rn_recyclerlist_bidirectionnal_1.DataProvider(function (r1, r2) {
        return (r1 === null || r1 === void 0 ? void 0 : r1._id) !== (r2 === null || r2 === void 0 ? void 0 : r2._id);
    }).cloneWithRows(pictures)), dataProvider = _b[0], setDataProvider = _b[1];
    // useEffect(() => {
    //   if (pictures.length > 3) {
    //     setDataProvider((p) => p.appendRows(pictures));
    //   }
    // }, [pictures]);
    var onStartReached = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setTimeout(function () {
                console.log('--- 1. onStartReached');
                setDataProvider(function (p) {
                    return p.prependRows([
                        {
                            _id: -4,
                            text: 'Alexis',
                        },
                        {
                            _id: -3,
                            text: 'Maria',
                        },
                        {
                            _id: -2,
                            text: 'Cindy',
                        },
                        {
                            _id: -1,
                            text: 'Manon',
                        },
                        {
                            _id: 0,
                            text: 'Maena',
                        },
                    ]);
                });
            }, 1000);
            return [2 /*return*/];
        });
    }); };
    var onEndReached = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); };
    return (React.createElement(react_native_1.View, { style: styles.container },
        React.createElement(react_native_1.View, { style: { minHeight: 1, width: '100%' } },
            React.createElement(rn_recyclerlist_bidirectionnal_1.RecyclerListView, { layoutProvider: layoutProvider, dataProvider: dataProvider, rowRenderer: function (type, data) { return renderImage(type, data); }, 
                // onStartReached={onStartReached}
                // onStartReachedThreshold={400}
                onEndReached: onEndReached, onEndReachedThreshold: 400, isHorizontal: false, forceNonDeterministicRendering: true, initialRenderIndex: 3, renderAheadOffset: 0, scrollViewProps: {
                    showsVerticalScrollIndicator: false,
                } }))));
}
exports.default = App;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});
//# sourceMappingURL=App.js.map