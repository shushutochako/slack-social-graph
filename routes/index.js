const express = require('express');
const router = express.Router();
const SlackClient = require('../logic/slack-client');
const config = require('../slack-config.json');
const colors = ['#6FB1FC','#EDA1ED','#FF425B','#FFC85B','#16C85B'];

/* GET home page. */
router.get('/', function (req, res, next) {

  const client = new SlackClient(config);

  (async function () {
    // user情報の取得
    const users = await client.getUsers().catch((err) => { res.send('err'); });

    // チャンネル参加メンバーの取得
    const channelMembers = await client.getChannelMembers().catch((err) => { res.send('err'); });

    // チャンネル内メッセージの取得
    const channelHistory = await client.getChannelHistory().catch((err) => { res.send('err'); });
    const messages = channelHistory.filter((elm) => {
      return elm.type === 'message' && elm.subtype !== 'file_share'
    });

    // ノード情報の作成
    const nodes =  channelMembers.map((elm) => {
      const node = new Object();
      node.id = elm;
      users.map((user) => {
        if (elm === user.id) {
          node.name = user.name;
        }
      });
      node.weight = 100;
      const colorIndex  = Math.floor(Math.random() * (colors.length - 1));
      node.backGroundColor = colors[colorIndex];
      node.shape = 'ellipse';
      return {
        data: node
      };
    });

    // エッジ情報(矢印)の情報の作成
    const messageObject = new Object();
    const mensionMessages = messages.map((elm) => {
      const text = elm.text;
      const mensions = text.match(/<@(.+?)>/g);
      if (mensions) {
        if (!messageObject[elm.user]) {
          messageObject[elm.user] = new Object();
        }
        mensions.map((_elm) => {
          const replaced = _elm.replace('<@', '').replace('>','');
          if (!messageObject[elm.user][replaced]) {
            messageObject[elm.user][replaced] = 1
          } else {
            messageObject[elm.user][replaced] += 1; 
          }
        });
      }
    });
    const edges = new Array();
    Object.keys(messageObject).forEach((source) => {
      Object.keys(messageObject[source]).forEach((target) => {
        edges.push({
          data: {
            source: source,
            target: target,
            color: '#494747',
            width: messageObject[source][target]
          }
        })
      });
    });

    res.render('index', { elements: { 
      nodes:nodes, 
      edges:edges
    }}); 
  })();

});

module.exports = router;
