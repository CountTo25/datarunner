//keep wall of text in separate file duh
//

class Building {
  constructor(data) {
    this.baseIncome = data.baseIncome;
    this.basePrice = data.basePrice;
    this.priceFormula = data.priceFormula; //function
    this.img = data.img;
    this.id = data.id;
    this.displayname = data.displayname;
    this.unveiledBy = data.unveiler;
    this.description = data.description;

    window.game.UI.constructBuilding(this);

    if (!window.game.data.buildings[this.id])
        window.game.data.buildings[this.id] = {amount: 0};

  }

  get nextPrice() {
    let amount = window.game.data.buildings[this.id].amount;
    let total = new Decimal(0);
    for (let i=0; i<window.game.data.buildingBuyAmount; i++) {
        total = total.add(this.priceFormula(amount+i));
    }
    return total;
  }

  get income() {
    let toReturn = this.baseIncome;
    let baseMods = Helpers.getUpgradesForMe(this.id, 'base');
    baseMods.forEach((m)=>{
        toReturn = m.effect(toReturn);
    });

    let totalMods = Helpers.getUpgradesForMe(this.id, 'total');
    totalMods.forEach((m) => {
        toReturn = m.effect(toReturn);
    });

    toReturn = toReturn.add()
    return new Decimal(toReturn);
  }

  get incomestring() {
    let incomeval = this.income.times(window.game.data.buildings[this.id].amount);
    let totalIncome = window.game.incomePerSecond;
    let percent = (incomeval.times(100).div(totalIncome));
    let wholestring = incomeval+'/s ('+percent+'%)';
    return wholestring;
  }

  purchase() {
    console.log(this);
    let enoughData =
        !window.game.data.currency.lt(this.nextPrice);
    //x2
    if (enoughData) {
        window.game.data.currency =
            window.game.data.currency.minus(this.nextPrice);
        window.game.data.buildings[this.id].amount+=
            window.game.data.buildingBuyAmount;
        window.game.UI.unveilUpgrades();
        window.game.UI.unveilBuildings();
        window.game.UI.update('call');
    } else {
        window.game.UI.log(
            new Message({
                text: 'Not enough data for '+this.displayname+' x'+window.game.data.buildingBuyAmount,
            })
        );
    }
  }

  tryUnveil() {
      if (window.game.data.buildings[this.id].amount > 0) {
          $('#building_'+this.id).removeClass('hidden');
          return false;
      }
      if (window.game.data.buildings[this.id].unveiled) {
          $('#building_'+this.id).removeClass('hidden');
          return true;
      }

      if (this.unveiledBy()) {
          let b = $('#building_'+this.id);
          b.removeClass('hidden');
          b.addClass('transform');
          setTimeout(function() {
              b.removeClass('transform');
          }, 100);
          window.game.data.buildings[this.id].unveiled = true;
          return true;
      } else {
          return false;
      }
  }

}



function initBuildings() {
    return Static.buildings;
}
