class Upgrade {
    constructor(data) {
        this.id = data.id;
        this.displayname = data.displayname;
        this.description = data.description;
        this.for = data.for;
        this.img = data.img;
        this.owned = false;
        this.unveiledBy = data.unveiler;
        this.price = data.price;
        this.applyTo = data.applyTo;
        this.effect = data.effect;
        this.effectDescription = data.effectDescription;
        console.log('construct?');

        if (!window.game.data.upgrades[this.id])
            window.game.data.upgrades[this.id] = {owned: false};
        window.game.UI.constructUpgrade(this);
        this.modifyUI();

    }

    get displayFor() {
        return window.game.buildings[this.for].displayname;
    }

    tryUnveil() {
        if (window.game.data.upgrades[this.id].owned) {
            $('#upgrade_'+this.id).removeClass('hidden');
            return false;
        }
        if (window.game.data.upgrades[this.id].unveiled) {
            $('#upgrade_'+this.id).removeClass('hidden');
            return true;
        }

        if (this.unveiledBy()) {
            let u = $('#upgrade_'+this.id)
            u.removeClass('hidden');
            u.addClass('transform');
            setTimeout(function() {
                u.removeClass('transform');
            }, 100);
            window.game.data.upgrades[this.id].unveiled = true;
            return true;
        } else {
            return false;
        }
    }

    modifyUI() {
        let node = $('#upgrade_'+this.id);
        if (window.game.data.upgrades[this.id].owned) {
            node.detach();
            node.appendTo('#upgrades_owned');
            node.find('.price').hide();
        }
    }

    purchase() {
        if (window.game.data.upgrades[this.id].owned)
            return false;
        let enoughData =
            !window.game.data.currency.lt(this.price);
        if (enoughData) {
            window.game.data.currency =
                window.game.data.currency.minus(this.price);
            window.game.data.upgrades[this.id].owned = true;
            window.game.UI.unveilUpgrades();
            window.game.UI.unveilBuildings();
            this.modifyUI();
            window.game.UI.update('call');
      }
    }
}


function initUpgrades() {
    return Static.upgrades;
}
