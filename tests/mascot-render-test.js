#!/usr/bin/env node
/*
 * 标题栏头像移除回归测试。
 *
 * 需求：所有 UI 模式下都不显示标题栏角色头像。
 * 旧版 syncMascots() 会在普通模式主动插入 mascot.png，导致头像重新出现；
 * 因此这里约束公共页面组件不再创建 hero-art 容器，也不再注册头像同步逻辑。
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const file = path.join(root, 'htdocs/luci-static/resources/mt5700d/mt5700.js');
const js = fs.readFileSync(file, 'utf8');

assert.doesNotMatch(js, /function syncMascots\(/,
	'公共组件不得再定义会重新插入头像的 syncMascots');
assert.doesNotMatch(js, /syncMascots\(/,
	'页面创建和 UI 模式切换不得再调用头像同步逻辑');
assert.doesNotMatch(js, /mt5700-hero-art/,
	'标题栏不得再创建头像专用容器');

const heroIdx = js.indexOf('function buildHero');
assert.ok(heroIdx >= 0, 'buildHero 必须存在');
const heroBody = js.slice(heroIdx, heroIdx + 1800);
assert.match(heroBody, /mt5700-hero-content/,
	'移除头像后仍须保留标题栏文字内容');
assert.doesNotMatch(heroBody, /mascot|hero-art/,
	'标题栏不得再引用头像或插画容器');

const pageIdx = js.indexOf('api.page = function');
assert.ok(pageIdx >= 0, 'api.page 必须存在');
const pageBody = js.slice(pageIdx, pageIdx + 2000);
assert.match(pageBody, /syncHero\(node\)/,
	'页面标题栏仍须按 UI 模式正常创建');

console.log('标题栏头像移除回归检查通过：所有 UI 模式均不会创建或重新插入头像。');
