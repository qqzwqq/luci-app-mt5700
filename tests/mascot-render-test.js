#!/usr/bin/env node
/*
 * 看板娘移除回归测试。
 * LuCI 页面不再创建/同步头像；保留 Hero 标题卡和普通/极简模式切换。
 * docs/index.html 的项目展示素材不属于 LuCI 页面，不在本测试范围内。
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'htdocs/luci-static/resources/mt5700d/mt5700.js');
const js = fs.readFileSync(file, 'utf8');

assert.doesNotMatch(js, /syncMascots|api\.mascot|mt-mascot-(?:speech-wrap|avatar|img)|mascot\.png|mt5700-hero-art/,
	'LuCI 页面不得包含看板娘创建、同步或头像资源引用');
assert.match(js, /function buildHero\(args\)/, '必须保留 Hero 标题卡构建函数');
assert.match(js, /mt5700-hero-title/, '必须保留 Hero 标题');
assert.match(js, /function syncHero\(page\)/, '必须保留 Hero 模式同步');
assert.match(js, /function bindMode\(\)/, '必须保留普通/极简模式切换监听');

const pageIdx = js.indexOf('api.page = function');
assert.ok(pageIdx >= 0, 'api.page 必须存在');
const pageBody = js.slice(pageIdx, pageIdx + 2000);
assert.match(pageBody, /syncHero\(node\);/, 'api.page 必须初始化 Hero 标题卡');
assert.doesNotMatch(pageBody, /syncMascots|api\.mascot/, 'api.page 不得初始化头像');

const modeIdx = js.indexOf('function bindMode()');
const modeBody = js.slice(modeIdx, modeIdx + 1200);
assert.match(modeBody, /syncHero\(pages\[i\]\)/, '模式切换时必须继续同步 Hero 标题卡');
assert.doesNotMatch(modeBody, /syncMascots|api\.mascot/, '模式切换监听不得同步头像');
console.log('头像移除回归检查通过：LuCI 无头像节点，Hero 标题与模式切换保留。');
