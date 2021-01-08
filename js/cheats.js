//used for dev
//feel free to cheat trough game if you want though
class Cheats {
    static gainData(howMuch) {
        window.game.data.currency =
            window.game.data.currency.add(new Decimal(howMuch));
    }

    static fullReset() {
        window.game.data = null;
        localStorage.clear();
        window.location.reload();
    }

    static msg() {
        window.game.data.eventTimer = 200;
    }
}
