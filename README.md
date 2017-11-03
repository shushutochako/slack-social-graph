# slack-social-graph

## Description

Display social graphs of a channel from the message's mentions.

## Usage

### install dependencies

To run the project, clone the repo, and run ```npm install``` first.

### setup slack config

```
cp slack-config.json.tplt slack-config.json
```

### edit slack-config.json

```
{
    "token":"${Yout Slack API Token}",
    "channelId":"${Channel Id}"
}
```

### start application

```
npm start
```

Please access http://localhost:3000

## Requirements

- Node.js (v8.0.0+)

