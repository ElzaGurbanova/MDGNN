'use strict';
const v71 = { value: true };
const v72 = Object.defineProperty(exports, '__esModule', v71);
v72;
var _extends2 = require('babel-runtime/helpers/extends');
var _extends3 = _interopRequireDefault(_extends2);
var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');
var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
var _createClass2 = require('babel-runtime/helpers/createClass');
var _createClass3 = _interopRequireDefault(_createClass2);
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
var _inherits2 = require('babel-runtime/helpers/inherits');
var _inherits3 = _interopRequireDefault(_inherits2);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _marked = require('marked');
var _marked2 = _interopRequireDefault(_marked);
var _highlight = require('highlight.js');
var _highlight2 = _interopRequireDefault(_highlight);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
const _interopRequireDefault = function (obj) {
    const v73 = obj.__esModule;
    const v74 = obj && v73;
    const v75 = { default: obj };
    let v76;
    if (v74) {
        v76 = obj;
    } else {
        v76 = v75;
    }
    return v76;
};
const v129 = function (_React$Component) {
    const v77 = _inherits3.default;
    const v78 = (0, v77)(MarkdownPreview, _React$Component);
    v78;
    const MarkdownPreview = function (props) {
        const v79 = _classCallCheck3.default;
        const v80 = (0, v79)(this, MarkdownPreview);
        v80;
        const v81 = _possibleConstructorReturn3.default;
        const v82 = MarkdownPreview.__proto__;
        const v83 = _getPrototypeOf2.default;
        const v84 = (0, v83)(MarkdownPreview);
        const v85 = v82 || v84;
        const v86 = v85.call(this, props);
        var _this = (0, v81)(this, v86);
        var options = {};
        const v87 = _this.props;
        const v88 = v87.markedOptions;
        if (v88) {
            const v89 = _this.props;
            options = v89.markedOptions;
        }
        const v90 = _extends3.default;
        const v91 = {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            langPrefix: 'hljs '
        };
        options = (0, v90)(v91, options);
        const v92 = _highlight2.default;
        const v93 = typeof v92;
        const v94 = v93 !== 'undefined';
        if (v94) {
            const v95 = _extends3.default;
            const v96 = {};
            const v105 = function highlight(code, lang) {
                const v97 = _highlight2.default;
                const v98 = v97.getLanguage(lang);
                const v99 = lang && v98;
                const v100 = !v99;
                const v101 = !v100;
                if (v101) {
                    const v102 = _highlight2.default;
                    const v103 = v102.highlight(lang, code);
                    const v104 = v103.value;
                    return v104;
                }
                return code;
            };
            const v106 = { highlight: v105 };
            options = (0, v95)(v96, options, v106);
        }
        const v107 = _marked2.default;
        const v108 = v107.setOptions(options);
        v108;
        return _this;
    };
    const v109 = _createClass3.default;
    const v125 = function render() {
        var _props = this.props;
        var value = _props.value;
        var className = _props.className;
        const v110 = _marked2.default;
        var renderer = new v110.Renderer();
        const v117 = function (href, title, text) {
            const v111 = '<a target="_blank" rel="noopener noreferrer" href="' + href;
            const v112 = v111 + '" title="';
            const v113 = v112 + title;
            const v114 = v113 + '">';
            const v115 = v114 + text;
            const v116 = v115 + '</a>';
            return v116;
        };
        renderer.link = v117;
        const v118 = _marked2.default;
        const v119 = value || '';
        const v120 = { renderer: renderer };
        var html = (0, v118)(v119, v120);
        const v121 = _react2.default;
        const v122 = {};
        v122.__html = html;
        const v123 = {
            dangerouslySetInnerHTML: v122,
            className: className
        };
        const v124 = v121.createElement('div', v123);
        return v124;
    };
    const v126 = {
        key: 'render',
        value: v125
    };
    const v127 = [v126];
    const v128 = (0, v109)(MarkdownPreview, v127);
    v128;
    return MarkdownPreview;
};
const v130 = _react2.default;
const v131 = v130.Component;
var MarkdownPreview = v129(v131);
exports.default = MarkdownPreview;
const v132 = _propTypes2.default;
const v133 = v132.string;
const v134 = v133.isRequired;
const v135 = _propTypes2.default;
const v136 = v135.string;
const v137 = _propTypes2.default;
const v138 = v137.object;
const v139 = {};
v139.value = v134;
v139.className = v136;
v139.markedOptions = v138;
MarkdownPreview.propTypes = v139;
const v140 = {};
v140.value = '';
MarkdownPreview.defaultProps = v140;