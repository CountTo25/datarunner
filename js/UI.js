class UI {
  constructor() {
    this.UInode = $('.game');
    this.hookTabs();

    this.UIInterval = setInterval(
      this.update.bind(this),
      window.game.data.updateInterval
    );

    this.update();
    this.doPosition();
  }

  //in case someone decides to poke
  //i really need to pick up typescript btw
  //refresh = expecting to be updated at set framerate
  //call = expecting to be updated by direct call only
  //interact = expecting to be updated after being interacted with
  //i think i re-invented the wheel and Vue stuff is supposed to do that for ya
  //idc
  doPosition() {
      console.log( ($('.header').outerHeight()+10));
      $('.subheader').css('top', ($('.header').innerHeight())+'px');
      let both = ($('.header').innerHeight()) + $('.subheader').innerHeight();
      $('.main').css('margin-top', (both)+'px');

      let gameheight = both+10;
      gameheight+=$('.footer').outerHeight();
      gameheight = $(window).height()-gameheight;
      let rpgheight = gameheight;
      console.log(rpgheight);
      $('#rpg').show();
      $('#rpg').css('overflow-y', 'hidden');
      rpgheight = rpgheight - $('.rpg.top').innerHeight();
      $('#rpg').hide();
      $('.rpg.body').css('height',rpgheight);
      $('.main').css('height', gameheight+'px');
      if (window.game.data.rpg.unlocked)
        $('[tab][key="rpg"]').show();
  }

  bindEvents() {
      $('#building_amount .tab').each(function() {
          $(this).click(function() {
              $('#building_amount .tab').removeClass('active');
              $(this).addClass('active');
              window.game.data.buildingBuyAmount =
                parseInt($(this).attr('buy'));
              window.game.UI.update('call');
          })
      });
      $('#building_amount .tab').removeClass('active');
      $('#building_amount .tab[buy="'+window.game.data.buildingBuyAmount+'"]').addClass('active');
  }

  update(type = 'update') {
    let all = this.UInode.find('[fill][fill-event="'+type+'"]');
    all.each(function(fillable) {
      let memberName = $(this).attr('fill');
      if (!memberName.includes('.')) {
        if (memberName in window.game) {
          $(this).html(window.game[memberName].toString());
        } else {
          console.log('No key "'+memberName+'" found in window.game.data');
        }
      } else {
        //parse
        let chain = memberName.split('.');
        let pointer = window.game;
        chain.forEach((part) => {
          if (part in pointer) {
            pointer = pointer[part];
          }
        });
        $(this).html(pointer.toString());
      }
    });
  }

    hookTabs() {
        let all = this.UInode.find('[tab]');
        let activeClassName = 'active';
        all.each(function(member) {
            $(this).click(function() {
                let group = $(this).attr('group');
                $('[panel][group="'+group+'"]').hide();
                let key = $(this).attr('key');
                $('[panel][group="'+group+'"][key="'+key+'"]').show();
                $('[tab][group="'+group+'"]').removeClass(activeClassName);
                $(this).addClass(activeClassName);
            })
        });
  }

    log(msg) {
        let text = msg.text;
        let highlight = msg.highlight;
        let ev = msg.ev;
        let toReturn = text;
        if (highlight !== null) {
            let baked = '<hl>'+highlight+'</hl>';
            toReturn = toReturn.replace(highlight, baked);
        }
        toReturn = toReturn.randomize();
        let date = new Date();
        let timestamp = date.getHours().toString().padStart(2, '0')
            + ':'+date.getMinutes().toString().padStart(2, '0')
            + ':'+date.getSeconds().toString().padStart(2, '0');
        let jObject = $('<span>['+timestamp+'] '+toReturn+'</span>');

        if (ev !== null) {
            console.log('ev happens?');
            jObject.find('hl').click(ev);
            jObject.find('hl').click(function() {
                console.log('deactivate');
                $(this).off('click');
                $(this).addClass('inactive');
            });
        }

        if($('.console span').length >= 4)
            $('.console span').last().remove();
        jObject.addClass('flash');
        $('.console').prepend(jObject);
        setTimeout(()=>{$(jObject).removeClass('flash')}, 500);
    }



  constructBuilding(building) //:Building i should really try TypeScript
  {
    let newNode = $('.templates .building').clone();
    newNode.find('.amount').attr('fill', 'data.buildings.'+building.id+'.amount');
    newNode.find('.upgradeprice').attr('fill', 'buildings.'+building.id+'.nextPrice');
    newNode.find('.produces')
        .attr('fill', 'buildings.'+building.id+'.incomestring');
    newNode.find('.name').html(building.displayname);
    newNode.find('.description').html(building.description);
    newNode.attr('id', 'building_'+building.id);
    newNode.find('.img')
      .css('background-image', 'url(img/' + building.img + ')');
    newNode.click(building.purchase.bind(building));
    $('#buildings_all').append(newNode);

    this.update('call');
  }

  constructUpgrade(upgrade) // :Upgrade
  {
    let newNode = $('.templates .upgrade').clone();
    newNode.attr('for-upgrade', upgrade.id);
    newNode.find('.name').html(upgrade.displayname);
    newNode.find('.upgradeprice').html(upgrade.price.toString());
    newNode.find('.description').html(upgrade.description);
    if (upgrade.for!='game')
        newNode.find('.for').html('Affects '+upgrade.displayFor);
    else {
        newNode.find('.for').html(' ');
    }
    newNode.find('.modifier').html(upgrade.effectDescription);
    newNode.attr('id', 'upgrade_'+upgrade.id);
    newNode.find('.img')
      .css('background-image', 'url(img/' + upgrade.img + ')');
    let appendTo = '#upgrades_buyable';
    if (window.game.data.upgrades[upgrade.id].owned) {
        appendTo = '#upgrades_owned';
    }
    newNode.click(upgrade.purchase.bind(upgrade));

    $('.content #t1_buildings .upgrades '+appendTo).append(newNode);

  }

  unveilUpgrades() {
    let allUpgrades = window.game.upgrades;
    Object.entries(allUpgrades).forEach(([key, value]) => {
        value.tryUnveil();
    });
  }

  unveilBuildings() {
    let allBuildings = window.game.buildings;
    Object.entries(allBuildings).forEach(([key, value]) => {
        value.tryUnveil();
    });
  }
  updateUI() {
      this.unveilBuildings();
      this.unveilUpgrades();
  }

    rebuildUpgrade(upgrade) { // :Upgrade

    }
}

class LogMessage {
    constructor(data) {
        this.text = data.text;
        this.highlight = data.highlight;
        this.onclick = data.event;
    }

    compose() {
        let toReturn = this.text;
        if (this.highlight) {
            let baked = '<hl>'+this.highlight+'<hl>';
            toReturn = toReturn.replace(this.highlight, baked);
        }
        let date = new Date();
        let timestamp = date.getHours().toString().padStart(2, '0')
            + ':'+date.getMinutes().toString().padStart(2, '0')
            + ':'+date.getSeconds().toString().padStart(2, '0');
        let jObject = $('<span>['+timestamp+'] '+toReturn+'</span>');
        jObject.find('.hl').click(this.onclick);

        if($('.console span').length >= 4)
            $('.console span').last().remove();
        jObject.addClass('flash');
        $('.console').prepend(jObject);
        setTimeout(()=>{$(jObject).removeClass('flash')}, 500);
        return jObject;
    }
}
