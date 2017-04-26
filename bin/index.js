#!/usr/bin/env node
const superAgent = require('superagent');
const cheerio = require('cheerio');
const readline = require('readline');
const colors = require('colors');

//支持的文字颜色
let colorSupport = [
  'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey, random'
];

let promptMsg = '您正在使用tfy-joke,按下回车查看笑话 >>>\n'.blue + '我们支持以下颜色更换字体哦\n'.cyan +
  colorSupport.join('  ').magenta + '\n \n \n \n \n';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: promptMsg
});
''

let url = 'https://www.qiushibaike.com/text/page/';
let page = 1;

rl.prompt();

let jakeList = [];

let throwError = function (msg) {
  return new Error(msg);
}


let getJoke = function () {
  superAgent
    .get(url + page)
    .end((err, res) => {
      if (err) throwError(err);
      const $ = cheerio.load(res.text);
      const jakeElements = $('.article .content span');
      jakeElements.each(function (index, item) {
        jakeList.push($(this).text());
      })
      page++;
    })
};

let currentColor = 'yellow';
let isRandom = false;

getJoke();
rl.on('line', (line) => {
  if ('tfy' === line) {
    console.log('这是一个菜单哦， 恭喜你，为了支持一下作者，可不可以赏点银子呢 支付宝账号 1315803594@qq.com'.yellow);
  }
  if ('close' === line) {
    console.log('bye bye'.red);
    process.exit(0);
  }
  if (jakeList.length) {
    if ('random' === line || isRandom) {
      if (!isRandom) isRandom = true;
      if (isRandom) console.log(jakeList.shift()[colorSupport[Math.floor((colorSupport.length - 1) * Math.random())]]);
    } else if (colorSupport.includes(line)) {
      currentColor = line;
      console.log(jakeList.shift()[currentColor]);
      isRandom = false;
    } else {
      console.log(jakeList.shift()[currentColor]);
      isRandom = false;
    }
  } else {
    console.log('正在加载中~~~'.green)
  }
  if (jakeList.length < 3) getJoke();
  // rl.prompt();
}).on('close', () => {
  console.log('bye bye'.red);
  process.exit(0);
})