#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'htdocs/luci-static/resources/at-webserver/mt5700.js'), 'utf8');
assert.match(js, /function trText\(s\)/, '共享文案翻译入口必须使用 trText');
assert.match(js, /api\.tr = trText/, '翻译入口应公开给视图复用');
assert.match(js, /return \(h == null\) \? '' : trText\(String\(h\)\)/, '表格 data-label 文案必须走 trText');
assert.match(js, /typeof h === 'string' \? trText\(h\) : h/, '表格表头字符串必须走 trText');
assert.match(js, /trText\('暂无数据'\)/, '表格空态文案必须走 trText');
assert.match(js, /E\('button',[\s\S]{0,140}trText\(label\)/, '共享按钮文案必须走 trText');
assert.match(js, /E\('option',[\s\S]{0,100}trText\(opt\.label\)/, '下拉选项文案必须走 trText');
console.log('trText 回归检查通过：共享组件翻译入口与表格遮蔽风险均已覆盖。');
