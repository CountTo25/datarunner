class Game {
  constructor() {
    //dummy for new game
    let skeleton = {
        'currency' : new Decimal(5),
        'updateInterval' : 33, //144
        'buildings': {},
        'upgrades': {},
        'buildingBuyAmount' : 1,
        'eventTimer': 0,
    }

    let load = {

    }

    this.data = {
      ...skeleton,
      ...load
    };



    window.game = this;
    this.UI = new UI();

    game.load();

    this.buildings = initBuildings();
    this.upgrades  = initUpgrades();
    this.messages = Static.messages;

    this.UI.unveilUpgrades();
    this.UI.unveilBuildings();

    this.UI.update('call');

    this.UI.log(new Message({text:'System loaded'}));

    this.currencyInterval = setInterval(
      this.gainIncome.bind(this),
      this.data.updateInterval,
    );
    this.saveInterval = setInterval(
        this.save.bind(this),
        10000,
    );

    this.slowInterval = setInterval(
        this.UI.unveilBuildings.bind(this),
        1000
    );

    this.eventInterval = setInterval(
        this.randomEvent.bind(this),
        1000
    );
  }

  get incomePerSecond() {
    let allBuildings = this.data.buildings;
    let total = new Decimal(0);
    let base = this;
    Object.entries(allBuildings).forEach(([key, value]) => {
      total = total.add(
        base.buildings[key].income.times(value.amount)
      );
    });
    return total;
  }

  gainIncome() {
    this.data.currency =
      this.data.currency.add(
        this.incomePerSecond.times(this.data.updateInterval/1000)
      )
  }

  click() {
    this.data.currency = Decimal.add(this.data.currency, new Decimal(1));
  }

  cheat() {
    this.data.currency = new Decimal(100000000);
  }

  save() {
    let json = JSON.stringify(this.data);
    let encoded = window.btoa(json);
    localStorage.save = encoded;
  }

  load() {
    if (!localStorage.save)
        return null;
    let encoded = localStorage.save;
    let unpacked = JSON.parse(window.atob(encoded));
    this.data = {
        ...this.data,
        ...unpacked
    };
    this.data.currency = new Decimal().fromObject(unpacked.currency);
    this.UI.update('call');
  }

  randomEvent() {
    //static for now?
    //

    let maxChanceTimer = 200;
    let minTimer = 50;
    this.data.eventTimer++;
    if (this.data.eventTimer<=minTimer)
        return;
    if (Math.floor(Math.random()*maxChanceTimer) <= this.data.eventTimer) {
        this.throwEvent();
        this.data.eventTimer = 0;
    }
  }

  throwEvent() {
    let eventPool = [];
    this.messages.forEach((msg) => {
          if (msg.canAppear())
              eventPool.push(msg);
    });
    console.log(eventPool);
    let toFire = eventPool[Math.floor(Math.random() * eventPool.length)];
    this.UI.log(toFire);
  }
}



var data = {
  'currency': new Decimal(0),
}
