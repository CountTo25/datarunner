$(function() {
    document.fonts.ready.then(function() {
        console.log('font ready');
        new Game();
        window.game.UI.doPosition();
        window.game.UI.bindEvents();
        $('#loading').fadeOut();
    });
})




Decimal.prototype.toString = function() {
  if (this.exponent>=6)
    return Math.floor(this.mantissa*100)/100+(this.exponent>0?'e'+this.exponent:'');
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
