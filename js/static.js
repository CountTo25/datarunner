class Static {
    static get messages() {
        return [
            new Message({
                text: 'Spotted weird website',
                highlight: 'website',
                ev: ()=>{
                    let award;
                    award = window.game.incomePerSecond.times(30).times(1+(Math.random()*2));
                    window.game.data.currency =
                        window.game.data.currency.add(award);
                    window.game.UI.log(
                        new Message({
                            text:'You found leaked database, obtained '+award+' data'
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
                return new Decimal(Math.floor(5+(x)*3.3+(x**1.8)));
              },
              unveiler: () => {
                 return true;
              },
            }),
            'db': new Building({
              displayname:'Database',
              id:'db',
              baseIncome: new Decimal(10),
              basePrice: new Decimal(100),
              img: 'db.png',
              description: 'Stores your data',
              priceFormula: (x) => {
                return new Decimal(Math.floor(100+(x)*45+(x**(1.8+x/175))));
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
              baseIncome: new Decimal(100),
              basePrice: new Decimal(1000),
              img: 'algorythm.png',
              description: 'Works with the data',
              priceFormula: (x) => {
                return new Decimal(Math.floor(1000+(x+1)*375+(x**(1.82+x/46))));
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
              baseIncome: new Decimal(500),
              basePrice: new Decimal(6000),
              description: 'Steals data for you from the web',
              img: 'parser.png',
              priceFormula: (x) => {
                return new Decimal(Math.floor(1400+(x+1)*675+(x**(1.85+x/32))));
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
              baseIncome: new Decimal(1500),
              basePrice: new Decimal(10000),
              description: 'Steals data for you from users',
              img: 'network.png',
              priceFormula: (x) => {
                return new Decimal(Math.floor(12000+(x+1)*1235+(x**(1.86+x/20))));
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
                price: new Decimal(400),
                applyTo: 'base',
                effectDescription: 'Adds 1 to base income',
                effect: (x) => {
                    x = x.add(new Decimal(1));
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
                price: new Decimal(500),
                applyTo: 'total',
                effectDescription: 'Doubles income',
                effect: (x) => {
                    x = x.times(2);
                    return x;
                },
                unveiler: () => { //:?Building
                    if (window.game.data.buildings.cpu.amount>=50)
                        return true;
                    else
                        return false;
                },
            }),
            'link': new Upgrade({
                id: 'link',
                displayname: 'Linked tables',
                description: "Connect data with data. Profit!",
                for: 'db',
                img: 'link.png',
                price: new Decimal(1000),
                applyTo: 'base',
                effectDescription: 'Adds 3 to base income',
                effect: (x) => {
                    x = x.add(new Decimal(3));
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
                    if (window.game.data.buildings.db.amount>=50)
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
                price: new Decimal(100000),
                applyTo: 'total',
                effectDescription: 'Multiplies income by 1.1',
                effect: (x) => {
                    x = x.times(1.1);
                    return x;
                },
                unveiler: () => {
                    return (
                        window.game.data.upgrades.rgbcooler.unlocked &&
                        window.game.data.buildings.cpu.amount>=50
                    )
                },
            }),
        };
    }
}
