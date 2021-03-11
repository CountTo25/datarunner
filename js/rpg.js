//cleanier than main module plox
//refactor one display
class RPG {
    constructor() {
        window.game.rpg = this;
        let skeleton = {
            level: this.level,
            currentexp: new Decimal(0),
            exptolevel: new Decimal(100),
        };

        window.game.data.rpg = {
            ...skeleton,
            ...window.game.data.rpg,
        }

    }

    get datasource() {
        return window.game.data.rpg;
    }

    get currentexp() {
        return this.datasource.currentexp;
    }

    get level() {
        return new Decimal(10);
    }

    get exptolevel() {
        return (this.datasource.level.times(10));
    }

    awardExp(val) {
        window.game.data.rpg.currentexp = window.game.data.rpg.currentexp.add(val);
    }



    get progress() {
        if (!window.game.data.rpg.unlocked)
            return false;
        let percent;
        if (!window.game.data.rpg.currentexp.gt(new Decimal(0))) {
            percent = 0;
        }
        else {
            percent = window.game.data.rpg.currentexp.div(window.game.data.rpg.exptolevel).times(100);
            percent = percent.mantissa * (10**percent.exponent);
        }
        let string = '';
        let count = Math.round(percent/10);
        string = '#'.repeat(count).padEnd(10, '_');

        return percent+'% -> ['+string+']';
    }
}
