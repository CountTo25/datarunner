class Static {
    static get messages() {
        return [
            new Message({
                text: 'Spotted some {{weird}} website',
                highlight: 'website',
                ev: ()=>{
                    let award;
                    award = window.game.incomePerSecond.times(10).times(1+(Math.random()*2));
                    window.game.data.currency =
                        window.game.data.currency.add(award);
                    window.game.UI.log(
                        new Message({
                            text:'You found leaked database, obtained '+award+' data',
                        })
                    );
                },
                canAppear: () => {
                    return true;
                },
            }),
            new Message({
                text: 'Scrapped data from PC gaming forum',
                highlight: 'data',
                ev: ()=>{
                    window.game.data.upgrades.rgbcooler.unlocked = true;
                    window.game.UI.unveilUpgrades();
                    let toLog = new Message({text:'RGB seems to be all the rage'})
                    window.game.UI.log(toLog);
                },
                canAppear: () => {
                    return(
                        window.game.data.upgrades.cooler.owned     &&
                        window.game.data.buildings.cpu.amount >= 5 &&
                        !window.game.data.upgrades.rgbcooler.unlocked
                    )
                },
            }),
            new Message({
                text: 'Seems like new CPU releases soon',
                highlight: 'new CPU',
                ev: ()=>{
                    window.game.data.upgrades.infooutside.unlocked = true;
                    window.game.UI.unveilUpgrades();
                    let toLog = new Message({text:'Their slogan is "Information Outside". Gonna check it out'})
                    window.game.UI.log(toLog);
                },
                canAppear: () => {
                    return(
                        window.game.data.buildings.cpu.amount >= 30 &&
                        !window.game.data.upgrades.infooutside.unlocked
                    )
                },
            }),
            new Message({
                text: 'Users on your social network discuss forbidden knowledge',
                highlight: 'forbidden knowledge',
                ev: ()=>{
                    window.game.data.upgrades.downloadram.unlocked = true;
                    window.game.UI.unveilUpgrades();
                    let toLog = new Message({text:'Seriously, downloading more RAM? Sounds stupid'})
                    window.game.UI.log(toLog);
                    toLog = new Message({text:'This IS stupid, right? No reason to attempt that'})
                    window.game.UI.log(toLog);
                },
                canAppear: () => {
                    return(
                        window.game.data.buildings.snetwork.amount >= 1 &&
                        !window.game.data.upgrades.downloadram.unlocked
                    )
                },
            }),
        ];
    }

    static get buildings() {
        return {
            'cpu': new Building({
              displayname:'CPU',
              id:'cpu',
              baseIncome: new Decimal(1),
              basePrice: new Decimal(10),
              img: 'cpu.png',
              description: 'Processes the data',
              priceFormula: (x) => {
                 return new Decimal(
                     Math.floor(
                         (5*(1.22**(x)))
                     )
                 );
              },
              unveiler: () => {
                 return true;
              },
            }),
            'ram': new Building({
              displayname:'RAM',
              id:'ram',
              baseIncome: new Decimal(4),
              basePrice: new Decimal(10),
              img: 'ram.png',
              description: 'Stores data for quick access',
              priceFormula: (x) => {
                 return new Decimal(
                     Math.floor(
                         (10*(1.35**(x*2)))
                     )
                 );
              },
              unveiler: () => {
                 return window.game.upgrades.downloadram.owned;
              },
            }),
            'db': new Building({
              displayname:'Database',
              id:'db',
              baseIncome: new Decimal(12),
              basePrice: new Decimal(100),
              img: 'db.png',
              description: 'Stores your data',
              priceFormula: (x) => {
                  return new Decimal(
                      Math.floor(
                           100*(1.2**(x))
                      )
                  );
              },
              unveiler: () => {
                if (
                    window.game.data.buildings.cpu.amount>=5 &&
                    window.game.data.currency.gte(new Decimal(100))
                )
                    return true;
                else
                    return false;
              },
            }),
            'algorithm': new Building({
              displayname:'Algorithm',
              id:'algorithm',
              baseIncome: new Decimal(125),
              basePrice: new Decimal(1000),
              img: 'algorythm.png',
              description: 'Works with the data',
              priceFormula: (x) => {
                  return new Decimal(
                      Math.floor(
                           1000*(1.2**(x*1.1))
                      )
                  );
              },
              unveiler: () => {
                if (
                    window.game.data.buildings.db.amount>=5 &&
                    window.game.data.currency.gte(new Decimal(1000))
                )
                    return true;
                else
                    return false;
              },
            }),
            'parser': new Building({
              displayname:'Parser',
              id:'parser',
              baseIncome: new Decimal(1250),
              basePrice: new Decimal(6000),
              description: 'Steals data for you from the web',
              img: 'parser.png',
              priceFormula: (x) => {
                  return new Decimal(
                      Math.floor(
                           48000*(1.22**(x*1.15))
                      )
                  );
              },
              unveiler: () => {
                if (
                    window.game.data.buildings.algorithm.amount>=5 &&
                    window.game.data.currency.gte(new Decimal(6000))
                )
                    return true;
                else
                    return false;
              },
            }),
            'snetwork': new Building({
              displayname:'Social Network',
              id:'snetwork',
              baseIncome: new Decimal(7800),
              basePrice: new Decimal(10000),
              description: 'Steals data for you from users',
              img: 'network.png',
              priceFormula: (x) => {
                  return new Decimal(
                      Math.floor(
                          160000*(1.24**(x*1.23))
                      )
              );
              },
              unveiler: () => {
                if (
                    window.game.data.buildings.parser.amount>=5 &&
                    window.game.data.currency.gte(new Decimal(10000))
                )
                    return true;
                else
                    return false;
              },
            }),
        };
    }

    static get upgrades() {
        return {
            'tpaste': new Upgrade({
                id: 'tpaste',
                displayname: 'Thermal Paste',
                description: "Not what you've thought. Neither it is milk. Just some paste",
                for: 'cpu',
                img: 'liquid.png',
                price: new Decimal(50),
                applyTo: 'base',
                effectDescription: 'Adds 1 to base income',
                effect: (x) => {
                    x = x.add(new Decimal(1));
                    return x;
                },
                unveiler: () => { //:?Building
                    if (window.game.data.buildings.cpu.amount>=5)
                        return true;
                    else
                        return false;
                },
            }),
            'cooler': new Upgrade({
                id: 'cooler',
                displayname: 'Cooler',
                description: "Apparently CPUs work better when cooled",
                for: 'cpu',
                img: 'fan.png',
                price: new Decimal(700),
                applyTo: 'base',
                effectDescription: 'Adds 2 to base income',
                effect: (x) => {
                    x = x.add(new Decimal(2));
                    return x;
                },
                unveiler: () => { //:?Building
                    if (window.game.data.buildings.cpu.amount>=10)
                        return true;
                    else
                        return false;
                },
            }),
            'dcore': new Upgrade({
                id: 'dcore',
                displayname: 'Dual Core',
                description: "Wow, its like 2 CPUs in one!",
                for: 'cpu',
                img: 'dualcore.png',
                price: new Decimal(100000),
                applyTo: 'total',
                effectDescription: 'Doubles income',
                effect: (x) => {
                    x = x.times(2);
                    return x;
                },
                unveiler: () => { //:?Building
                    if (window.game.data.buildings.cpu.amount>=25)
                        return true;
                    else
                        return false;
                },
            }),
            'infooutside': new Upgrade({
                id: 'infooutside',
                displayname: 'Info Outside',
                description: "Weird slogan, but whatever, it works",
                for: 'cpu',
                img: 'infooutside.png',
                price: new Decimal(350000),
                applyTo: 'total',
                effectDescription: 'Raises income to power of 1.1',
                effect: (x) => {
                    x = x.pow(1.1);
                    return x;
                },
                unveiler: () => { //:?Building
                    return (window.game.data.upgrades.rgbcooler.unlocked);
                },
            }),
            'link': new Upgrade({
                id: 'link',
                displayname: 'Linked tables',
                description: "Connect data with data. Profit!",
                for: 'db',
                img: 'link.png',
                price: new Decimal(450),
                applyTo: 'base',
                effectDescription: 'Adds 4 to base income',
                effect: (x) => {
                    x = x.add(new Decimal(4));
                    return x;
                },
                unveiler: () => { //:?Building
                    if (window.game.data.buildings.db.amount>=5)
                        return true;
                    else
                        return false;
                },
            }),
            'nosql': new Upgrade({
                id: 'nosql',
                displayname: 'NoSQL',
                description: "I have no idea how it helps you collect data, get off me",
                for: 'db',
                img: 'nosql.png',
                price: new Decimal(100000),
                applyTo: 'total',
                effectDescription: 'Doubles income',
                effect: (x) => {
                    x = x.times(2);
                    return x;
                },
                unveiler: () => {
                    if (window.game.data.buildings.db.amount>=25)
                        return true;
                    else
                        return false;
                },
            }),
            'rgbcooler': new Upgrade({
                id: 'rgbcooler',
                displayname: '<span style="color:red">R</span><span style="color:green">G</span><span style="color:blue">B</span> cooler',
                description: "Modern gamer tech for maximum performance",
                for: 'cpu',
                img: 'rgbfan.png',
                price: new Decimal(1000000),
                applyTo: 'total',
                effectDescription: 'Multiplies income by 1.15',
                effect: (x) => {
                    x = x.times(1.15);
                    return x;
                },
                unveiler: () => {
                    return (
                        window.game.data.upgrades.rgbcooler.unlocked &&
                        window.game.data.buildings.cpu.amount>=30
                    )
                },
            }),
            'qmaths': new Upgrade({
                id: 'qmaths',
                displayname: 'Quick maths',
                description: "2+2 is 4, -1 thats 3",
                for: 'algorithm',
                img: 'qmaths.png',
                price: new Decimal(10000),
                applyTo: 'total',
                effectDescription: 'Multiplies income by 2',
                effect: (x) => {
                    x = x.times(2);
                    return x;
                },
                unveiler: () => {
                    return (window.game.data.buildings.algorithm.amount>=5)
                },
            }),
            'downloadram': new Upgrade({
                id: 'downloadram',
                displayname: 'Download RAM',
                description: "That wont work",
                for: 'game',
                img: 'downloadram.png',
                price: new Decimal(4200000),
                applyTo: 'total',
                effectDescription: 'Probably downloads some RAM?',
                onPurchase: (x) => {
                    window.game.UI.log(new Message({text: 'Wow, that actually worked'}));
                    window.game.data.buildings.ram.unveiled = true;
                },
                unveiler: () => {
                    return (
                        window.game.data.upgrades.downloadram.unlocked
                    )
                },
            }),
            'wifi': new Upgrade({
                id: 'wifi',
                displayname: 'Wi-Fi',
                description: "Download RAM on the go",
                for: 'ram',
                img: 'wifi.png',
                price: new Decimal(900000),
                applyTo: 'total',
                effectDescription: 'Triples output',
                effect: (x) => {
                    x = x.times(3);
                    return x;
                },
                unveiler: () => {
                    return (
                        window.game.data.buildings.ram.amount >= 5
                    )
                },
            }),
            'ddr5': new Upgrade({
                id: 'ddr5',
                displayname: 'DDR5',
                description: "Up to modern standards",
                for: 'ram',
                img: 'ddr5.png',
                price: new Decimal(1800000),
                applyTo: 'total',
                effectDescription: 'Raises output to power of 1.25',
                effect: (x) => {
                    x = x.pow(1.25);
                    return x;
                },
                unveiler: () => {
                    return (
                        window.game.data.buildings.ram.amount >= 10 &&
                        window.game.data.buildings.cpu.amount >= 60
                    )
                },
            }),
        };
    }
}
