"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.D3Container = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _lodash = require("lodash");

var _d = require("d3");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function useResize(timeout) {
  const ref = (0, _react.useRef)();
  const [size, setSize] = (0, _react.useState)({
    width: 0,
    height: 0
  });
  (0, _react.useLayoutEffect)(() => {
    if (!ref.current) return; // Sets dimensions state after [timeout] ms.

    const resizeHandler = (0, _lodash.debounce)(() => {
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight
      });
    }, timeout); // Initialize the referenced DOM element's dimensions.

    resizeHandler(); // Add the event listener to the window.

    window.addEventListener('resize', resizeHandler); // Remove the event listener upon unmount.

    return () => window.removeEventListener("resize", resizeHandler);
  }, [ref.current, timeout]);
  return {
    containerRef: ref,
    size
  };
}

const D3Container = /*#__PURE__*/_react.default.forwardRef((_ref, vizRef) => {
  let {
    id,
    viz,
    config = {},
    data,
    containerStyle,
    resizeTimeout = 100
  } = _ref;
  const {
    containerRef,
    size
  } = useResize(resizeTimeout);
  const firstRender = (0, _react.useRef)(true); // Upon first mount, initialize visualization with initial configuration.

  (0, _react.useEffect)(() => {
    config = _objectSpread(_objectSpread({}, config), {}, {
      id,
      data
    }); // Initialize the visualization closure with an optional configuration.

    var chart = viz(config); // Store the reference to the visualization to easily expose getters/setters.

    vizRef.current = chart; // Use selection.call to attach visualization to selected DOM element (the container div).

    (0, _d.select)(containerRef.current).call(chart);
    firstRender.current = false;
  }, []); // Upon a resize event, set the visualization size to the proper dimensions.

  (0, _react.useLayoutEffect)(() => {
    if (!vizRef.current || firstRender.current) return;
    vizRef.current.size(size.width, size.height);
  }, [size]); // Upon a change of data, propagate the updated data down to the visualization.

  (0, _react.useEffect)(() => {
    if (!vizRef.current || firstRender.current) return;
    vizRef.current.data(data);
  }, [data]);
  return /*#__PURE__*/_react.default.createElement("div", {
    id: id,
    ref: containerRef,
    style: _objectSpread({
      height: "100%",
      width: "100%"
    }, containerStyle)
  }, /*#__PURE__*/_react.default.createElement("svg", {
    width: size.width,
    height: size.height
  }));
});

exports.D3Container = D3Container;