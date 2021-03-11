$(function() {
    document.fonts.ready.then(function() {
        console.log('font ready');
        new Game();
        new RPG();
        window.game.UI.doPosition();
        window.game.UI.bindEvents();
        $('#loading').fadeOut();
    });
})




Decimal.prototype.toString = function() {
  if (this.exponent>=6) {
      let mnt = Math.floor(this.mantissa*100)/100;
      let needsTrail = (mnt % 1) == 0;
      if (needsTrail)
        mnt+='.00';
      else
        mnt=mnt.toString().padEnd(4, '0');
      return mnt+'e'+this.exponent
  }
  else
    return Math.floor(this.toNumber()).toString();
}

Decimal.prototype.toJSON = function() {
    return {
        mantissa: this.mantissa,
        exponent: this.exponent,
    }
}

Decimal.prototype.fromObject = function(obj) {
    return new Decimal(obj.mantissa+'e'+obj.exponent)
}
