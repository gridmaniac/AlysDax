const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const Markup = require('telegraf/markup')

const { readdirSync, readFileSync, writeFileSync } = require('fs')
const bot = new Telegraf(process.env.BOT_TOKEN)

const clients = {}

async function getText(name) {
  const text = readFileSync(`${__dirname}/messages/${name}.txt`, 'utf8')
  return text
}

async function loadClients()
{
  const list = await readdirSync(`${__dirname}/clients`)
  for (let x of list)
  {
    const text = await readFileSync(`${__dirname}/clients/${x}`)
    const client = JSON.parse(text)
    clients[x.split('.')[0]] = client
  }
}

async function saveClient(id)
{
  const text = JSON.stringify(clients[id])
  await writeFileSync(`${__dirname}/clients/${id}`, text)
}

async function init()
{
  await loadClients()

  bot.start(async ctx => {
    const msg = await getText('start')
    
    const client = {
      id: ctx.from.id,
      chat_id: ctx.chat_id,
      stage: 0,
      date: new Date(),
      inactivity: 0,
      chain: 0,
      chain_active: false,
      chain_since: null
    }

    clients[client.id] = client
    await saveClient(client.id)
  
    ctx.reply(msg, Markup.inlineKeyboard([
      Markup.callbackButton('Поехали', 'go')
    ]).extra())
  })
  
  bot.action('go', async ctx => {
    const msg = await getText('question')
  
    ctx.reply(msg, Markup.inlineKeyboard([
      Markup.callbackButton('Вы инвестор?', 'investor'),
      Markup.callbackButton('Вы лидер?', 'leader')
    ]).extra())
  })
  
  bot.launch()

  setInterval(() => {
    for (let x of clients)
    {
      // check clients
      // then
      // telegram.sendMessage(chatId, text, Markup.inlineKeyboard([...
    }
    
  }, process.env.LOOP_INTERVAL)
}

init()
