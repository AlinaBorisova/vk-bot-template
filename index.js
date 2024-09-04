const VkBot = require('node-vk-bot-api');
const Markup = require('node-vk-bot-api/lib/markup')
const Scene = require('node-vk-bot-api/lib/scene');
// const Session = require('node-vk-bot-api/lib/session');
// const Stage = require('node-vk-bot-api/lib/stage');
// token SmartConversion
// const token = 'vk1.a.3NOsk6ecXQi6zkDHhcLVA262UKfvYhCzXSQT8Yyk36SEzrPYhDbcsKlf6Oq3fQlTvoL028BNTteO_BCbOPtBcBIfyFNGPE0u5pdPzXtZ2vHflrQSZp_15h1s5dcUV4IC2NPTAXcm_8f0H1OPaaQPNQ9SOmaMJ8SaxwR1ofiGTO5GX5zvjGUjYMh3qvTonx66U4HbgRYjFjYkWctwVL8NEA';
// token Test for bot
const token = 'vk1.a.AseEkEtdrvBX8f1vYCuCSi19tCdAcGxCo6Mp3BZy0E25EFw8ley0Zuljid1j1md9JD-sI4byEYJi62tT0lljNoAOZWnooC7j4FEib0DkNew9wDamozG1hqMMIigkJruudoOaHb11Rjhb5YRWSyq2hojFTey-AEqsUjIas8sNVhY3MM_q8ALWLhGEPwwoEEVpZYMsSOXErnWX-4KSfAlJNA';


const bot = new VkBot(token);

const keyboard = Markup.keyboard([
  [
    Markup.button({
      action: {
        type: 'open_link',
        link: 'https://smart-conversion.ru',
        label: 'Перейти на сайт',
        payload: JSON.stringify({
          url: 'https://smart-conversion.ru',
        }),
      },
    }),
  ],
  [
    Markup.button({
      action: {
        type: 'open_link',
        link: 'https://smart-conversion.ru/#projects',
        label: 'Выполненные проекты',
        payload: JSON.stringify({
          url: 'https://smart-conversion.ru/#projects',
        }),
      },
    }),
  ],
  [
    Markup.button({
      action: {
        type: 'text',
        label: 'Связаться со мной',
      },
    }),
  ]
], { columns: 2 });
const keyboardSubscribe = Markup.keyboard([
  [
    Markup.button({
      action: {
        type: 'text',
        label: 'Подписался',
      },
    }),
  ],
]).inline();
const keyboardGifts = Markup.keyboard([
  [
    Markup.button({
      action: {
        type: 'open_link',
        link: 'https://disk.yandex.ru/d/oCLmDTCKr5EJ1Q',
        label: 'Забрать подарок',
        payload: JSON.stringify({
          url: 'https://disk.yandex.ru/d/oCLmDTCKr5EJ1Q',
        }),
      },
    }),
  ],
]).inline();

const scene = new Scene('meet',
  (ctx) => {
    const user_id = ctx.message.from_id;
    ctx.scene.next();
    bot.sendMessage(user_id, 'Как к Вам обращаться?');
  },
  (ctx) => {
    const user_id = ctx.message.from_id;
    ctx.session.name = ctx.message.text;

    ctx.scene.next();
    bot.sendMessage(user_id, 'Укажите Ваш номер телефона');
  },
  (ctx) => {
    const user_id = ctx.message.from_id;
    ctx.session.phone = +ctx.message.text;
    ctx.scene.leave();
    bot.sendMessage(user_id, `${ctx.session.name}, наш менеджер свяжется с вами по телефону ${ctx.session.phone}.
А пока можете посмотреть наши выполненные проекты`, null, keyboard);
  },
);

// const session = new Session();
// const stage = new Stage(scene);
//
// bot.use(session.middleware());
// bot.use(stage.middleware());




const start = () => {

  bot.command('Начать', async (ctx) => {
    try {
      const user_id = ctx.message.from_id;
      const response = await bot.execute('users.get', {
        user_ids: user_id,
      });

      await ctx.reply(`${response[0].first_name}🤘 Давайте знакомиться! 

Меня зовут Андрей:


Здесь вы получите доступ к полезным материалам от меня и моей команды. Предприниматели и эксперты выстроят непрерывный поток прогретых клиентов, маркетологи освоят новые практические инструменты и получат возможность зарабатывать больше!

Условия получения доступа — подписка на группу https://vk.com/smartconversion 
В ней я делюсь личным опытом построения маркетинга. 

Подписывайся и забирай доступы 🚀`,
        null, keyboardSubscribe);

    } catch (e) {
      console.error(e);
    }
  });


  bot.command('Подписался', async (ctx) => {
    const user_id = ctx.message.from_id;
    const group_id = ctx.bot.settings.group_id;

    try {
      const checkMember = await bot.execute('groups.isMember', {
        group_id: group_id,
        user_ids: user_id,
        extended: 0,
      });
      if (checkMember[0].member === 1) {
        await ctx.reply(`Отлично! Увидели подписку 😎

Обещанные доступы к полезным материалам по клику ниже.

А пока хочу вас приятно удивить. В этом боте вы получите гораздо больше, чем доступ к онлайн-практикуму 🔥

Здесь собрано более 30 полезных материалов, дающих результат на всех уровнях маркетинга: мышление, стратегия, воронки, охваты, трафик, продажи. Решения, представленные в боте, проверены более чем на 200 компаниях в РФ, Европе и США 🤘

Каждую неделю вы будете получать новые полезные материалы. Закрепите бот, чтобы не пропустить их 📌`, null, keyboardGifts);
        await ctx.reply( `Посмотрите меню, может, там есть что-то интересное.`, null, keyboard);
      } else {
        await ctx.reply( `Не увидели подписку`, null, keyboard)
      }
    } catch (e) {
      console.error(e);
    }
  });

  // bot.command('Связаться со мной', async (ctx) => {
  //   try {
  //     ctx.scene.enter('meet');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });


  bot.startPolling((err) => {
    if (err) {
      console.error(err);
    }
  });
};

start();


