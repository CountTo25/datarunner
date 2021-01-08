class Helpers {
    static getUpgradesForMe(owner, type) { // :array
        let tag = owner.id;
        let toReturn = [];
        Object.entries(window.game.data.upgrades).forEach(([key, value]) => {
            if (
                value.owned &&
                window.game.upgrades[key].for === owner &&
                window.game.upgrades[key].applyTo == type
            ) {
                toReturn.push(window.game.upgrades[key]);
            }
        });
        return toReturn;
    }
}
