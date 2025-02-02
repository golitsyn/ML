if ('undefined' != typeof self.hax) throw 'abort: hax already installed';
self.hax_installed = false, self.hax = {
  'version': 5,
  'offsets': [[0x0, -0x1], [0x1, 0x0], [0x0, 0x1], [-0x1, 0x0]],
  'pos': l => [myself.x + hax.offsets[l][0x0], myself.y + hax.offsets[l][0x1]],
  'go': () => send({
    'type': 'A'
  }),
  'stop': () => send({
    'type': 'a'
  }),
  'act': function () {
    this.go(), this.stop();
  },
  'sleep': function (l) {
    return new Promise(r => setTimeout(r, l));
  },
  'inv': function (l) {
    return item_data.find(function (r) {
      return r && r.n && l(r);
    });
  },
  'timestamp': function () {
	return ((new Date()).getTime()) / 1000;
  },
  'specialchars': function (text) {
	let e = document.createElement('textarea');
	e.innerHTML = text;
	return e.value;
  },
  'hotkey': null,
  'visible': function(value) {
	if (undefined == value) {
		return (jv.coords_status.visible == true);
	}
	
	// Status
	if (jv && jv.coords_status) jv.coords_status.visible = value;
		
	// Buttons
	for (let i in hax.buttons) {
		hax.buttons[i].visible = value;
	}
  },
  'effect': function (text, x, y, life) {
	if (jv.Effect) {
		let ef = jv.Effect.create();
		let ob = {
			start: function(){
				this.life = life;
				var c = this.text(this.dir,{
					font:'12px Helvetica',
					fill:0xFFFFFF,
					lineJoin:'round',
					stroke:0x222000,
					strokeThickness:2,
				});
				
				c.x -= c.width / 2;
				c.y -= 5;
				c.oy = c.y;
				c.dx = 0;
				c.dy = 0;
				c.life = this.life;
			},
			move: function(p){},
			run: function(){},
		}
		ef.x = x,
		ef.y = y,
		ef.dir = text,
		ef.start = ob.start,
		ef.move = ob.move,
		ef.run = ob.run,
		effects.add(ef);
	}
  },
  'rc4': function (r, j) {
    for (var Y, U = [], M = 0x0, G = '', S = 0x0; S < 0x100; S++) U[S] = S;
    for (S = 0x0; S < 0x100; S++) M = (M + U[S] + r.charCodeAt(S % r.length)) % 0x100, Y = U[S], U[S] = U[M], U[M] = Y;
    S = 0x0, M = 0x0;
    for (var I = 0x0; I < j.length; I++) M = (M + U[S = (S + 0x1) % 0x100]) % 0x100, Y = U[S], U[S] = U[M], U[M] = Y, G += String.fromCharCode(j.charCodeAt(I) ^ U[(U[S] + U[M]) % 0x100]);
    return G;
  },
  'chatListeners': new Set(['hax']),
  'msgListeners': new Set(['hax']),
  'srvListeners': new Set(['hax']),
  'commands': new Set(['/hax', '/g']),
  'plugins': {
    'register': function (l, r) {
      Object.assign(this[l] = {}, {
        'enabled': false
      }, r), r.chatListener && hax.chatListeners.add(l), r.msgListener && hax.msgListeners.add(l), r.srvListener && hax.srvListeners.add(l), r.command && hax.commands.add('/' + l), r.init && this[l].init();
    },
    'toggle': function (l) {
      return this[l].enabled = !this[l].enabled;
    },
    'hax': {
      'chat': false,
      'msg': false,
      'srv': false,
      'command': function (l) {
        if (l[0x1]) {
          if ('s' == l[0x1].charAt(0x0).toLowerCase()) {
            let r = [];
            Object.values(hax.plugins).forEach(function (j) {
              j.hasOwnProperty('status') && r.push(j.status());
            }), r.forEach(j => j && append(j));
          } else 'dev' == l[0x1] && l[0x2] && l[0x2].match(/(chat|msg|srv)/) ? this[l[0x2]] = !this[l[0x2]] : 'g' == l[0x1].charAt(0x0) && hax.go();
        } else {
          append('hax v' + hax.version + ' installed modules:');
          let j = hax.plugins.secret.allowed();
          Object.values(hax.plugins).forEach(Y => j && Y.sdoc ? append('<color:#999999>[S] ' + Y.sdoc) : Y.doc ? append(Y.doc) : null);
        }
      },
      'chatListener': function (l) {
        this.chat && console.log(l);
      },
      'msgListener': function (l) {
        this.msg && console.log(l);
      },
      'srvListener': function (l) {
        this.srv && console.log(l);
      }
    },
    'g': {
      'command': () => hax.go()
    }
  },
  'speedhacking': false,
  'speedhack': function(value) {
	if (undefined === value) {
		this.speedhacking = !this.speedhacking;
		append('Speedhack: ' + (this.speedhacking ? 'ON' : 'OFF'));
	} else {
		this.speedhacking = value;
	}
	
	(function(){
		window.datenow = window.datenow || Date.now;
		let a = null;
		let b = null;
		Date.now = function(){
			const ts = window.datenow();
			return a ? a += (ts - b) * (hax.speedhacking ? 7 : 1) : a = ts, b = ts, Math.floor(a);
		};
	}).call();
  },
  'buttons': {},
  'button': function(index, title, callback) {
		if (!title) title = '#' + index;
		let width = 60;
		let size = 22;
		
		let x = 10;
		let y = jv.game_height - 60 - ((size + 0) * index);
		
		let button = jv.Button.create(x, y, width, title, null, size);
		
		// jv.game_width
		// jv.game_height
		
		//button.button_alpha = 0.5;
		//button.title.style.letterSpacing = -1;
		//button.set_text(title);
		//button.clear_item();
		//button.draw_item(!1);
		if (callback) button.on_click = callback;
		
		if (this.buttons[index]) this.buttons[index].destroy();
		this.buttons[index] = button;
  },
  'init': function () {
    hax_installed || (self.old_append = self.append, self.append = function (l) {
      try {
        hax.chatListeners.forEach(r => hax.plugins[r].chatListener(l));
      } catch (r) {
        if ('spam' == r) return;
        if ('string' != typeof r || '>' != r.charAt(0x0)) throw r;
        l = r.substr(0x1);
      }
      old_append(l);
    }, jv.old_command = jv.command, jv.command = function (l) {
      if (!editing) {
        var r = l.split(' ');
        if (hax.commands.has(r[0x0])) return hax.plugins[r[0x0].substr(0x1)].command(r);
        jv.old_command(l);
      }
    }, self.old_parse = self.parse, self.parse = function (l) {
      try {
        hax.msgListeners.forEach(r => hax.plugins[r].msgListener(l));
      } catch (r) {
        if ('spam' == r) return;
        throw r;
      }
      old_parse(l);
    }, self.old_send = self.send, self.send = function (l) {
      try {
        hax.srvListeners.forEach(r => hax.plugins[r].srvListener(l));
      } catch (r) {
        if ('spam' == r) return;
        if ('object' != typeof r) throw r;
        l = r;
      }
      old_send(l);
    }, self.hax_installed = true, jv.sound_volume = option_dialog.sound_slider.percent / 0x64);
  }
};

hax.register = function(){
	hax.plugins.register('bash', {
	  'doc': '/bash',
	  'stopTimer': null,
	  'hammerSlot': null,
	  'status': () => 'bash ' + (hax.plugins.bash.enabled ? 'ON' : 'OFF'),
	  'command': function () {
		hax.plugins.toggle('bash'), this.enabled && (this.loadHammer(true), null == this.hammerSlot && (this.enabled = false)), append(this.status());
	  },
	  'loadHammer': function (l) {
		let r = hax.inv(j => j.eqp > (l ? -0x1 : 0x0) && j.tpl.match(/_hammer$/));
		r && (this.hammerSlot = parseInt(r.slot)), this.clearStop();
	  },
	  'hammerTime': function () {
		send({
		  'type': 'u',
		  'slot': this.hammerSlot
		});
	  },
	  'needleTime': function () {
		let l = hax.inv(r => [0x2af, 0x2b2].includes(r.spr));
		l && send({
		  'type': 'u',
		  'slot': parseInt(l.slot)
		});
	  },
	  'setStop': function () {
		this.clearStop(), this.stopTimer = setTimeout(() => hax.stop(), 0x7d0);
	  },
	  'clearStop': function () {
		this.stopTimer && (clearTimeout(this.stopTimer), this.stopTimer = null);
	  },
	  'chatListener': function (l) {
		if (this.enabled) {
		  if (l.match(/^You retrieve the /)) throw send({
			'type': 'd',
			'slot': 0x0,
			'amt': 0x1
		  }), this.setStop(), this.hammerTime(), 'spam';
		  if (l.match(/^This arrangement d/) || l.match(/^Try placing your equip/)) throw send({
			'type': 'd',
			'slot': 0x1,
			'amt': 0x1
		  }), this.setStop(), 'spam';
		  if (l.match(/^You prepare (.+) for upgrading/)) throw 'spam';
		  if (l.match(/You hold (a|the)/)) throw 'spam';
		  if (l.match(/^Looking good\!/)) throw 'spam';
		}
	  },
	  'msgListener': function (l) {
		if (this.enabled && 'fx' == l.type && 'notice' == l.tpl) {
		  let r = hax.pos(myself.dir);
		  if (l.x == r[0x0] && l.y == r[0x1]) {
			let j = parseInt(l.d);
			this.setStop(), j && j > 0x20 && (this.loadHammer(), this.needleTime());
		  }
		}
	  }
	}), hax.plugins.register('suitup', {
	  'gear': [],
	  'doc': '/suitup [slot1,slot2,slotn]',
	  'status': function () {
		return 'suitup ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function (l) {
		l[0x1] ? (this.gear = new Set(l[0x1].split(',')), this.save(), this.enabled = true) : hax.plugins.toggle('suitup'), append(this.status());
	  },
	  'save': function () {
		localStorage.setItem('suitup_gear', Array.from(this.gear));
	  },
	  'load': function () {
		localStorage.suitup_gear && localStorage.suitup_gear.length > 0x0 && (this.gear = new Set(localStorage.suitup_gear.split(',')));
	  },
	  'suitup': async function () {
		let l = Array.from(this.gear);
		for (l = l.filter(function (r) {
		  return r = parseInt(r), item_data[r] && !item_data[r].eqp;
		}), i = 0x0; i < l.length; i++) send({
		  'type': 'u',
		  'slot': parseInt(l[i])
		}), await hax.sleep(0x32);
		hax.plugins.eat.cara = true, hax.plugins.eat.enabled = true;
	  },
	  'init': function () {
		this.load(), self.keyBT = jv.keyboard(0xc0), keyBT.press = function () {
		  input_field.hasFocus || editing || -0x1 !== me && hax.plugins.suitup.enabled && hax.plugins.suitup.suitup();
		};
	  }
	}), hax.plugins.register('top', {
	  'doc': '/top',
	  'timer': null,
	  'statusBar': jv.text('', {
		'font': '12px Verdana',
		'fill': 0x88ffff,
		'lineJoin': 'round',
		'stroke': jv.color_dark,
		'strokeThickness': 0x4,
		'align': 'left'
	  }),
	  'command': function () {
		hax.plugins.toggle('top'), this.enabled ? this.enable() : this.disable();
	  },
	  'enable': function () {
		this.disable(), this.statusBar.text = 'Updating..', this.statusBar.visible = true, this.timer = setInterval(this.update, 0x2710), this.update();
	  },
	  'disable': function () {
		this.statusBar.visible = false, this.timer && clearInterval(this.timer);
	  },
	  'update': function () {
		myself && send({
		  'type': 'c',
		  'r': 'rn'
		});
	  },
	  'msgListener': function (l) {
		'reinc' == l.type && (this.statusBar.text = l.obj.skill.replace(/^\w/, r => r.toUpperCase()));
	  },
	  'init': function () {
		this.statusBar.x = 0xdc, this.statusBar.y = 0x1e, this.statusBar.visible = false, ui_container.addChild(this.statusBar);
	  }
	}), hax.plugins.register('eat', {
	  'doc': '/eat [percentage]',
	  'pct': 0x0,
	  'cara': false,
	  'foodfind': /^(Old ){0,1}\w+ (Dish|Stew|Salad|Soup)$|^(Old ){0,1}(Salmonberry|Carrot|Lettuce|Tomato|Potato|Tea)$|^(Old ){0,1}(Cooked .+)$/,
	  'carafind': /^(Old ){0,1}Caraway$/,
	  'slowness': 0xc8,
	  'status': function () {
		return 'eat ' + (this.enabled ? 'ON ' + this.pct + '%' + (this.cara ? ' cara' : '') : 'OFF');
	  },
	  'command': function (l) {
		l[0x1] ? ('cara' == l[0x1] ? this.cara = !this.cara : this.pct = parseInt(l[0x1]), this.enabled = true) : hax.plugins.toggle('eat'), append(this.status());
	  },
	  'eat': function (l) {
		(food = hax.inv(r => r.n.match(l))) && send({
		  'type': 'u',
		  'slot': parseInt(food.slot)
		});
	  },
	  'msgListener': function (l) {
		this.enabled && 's' == l.type && (l.f <= this.pct && this.eat(this.foodfind), this.cara && l.b.find(function (r) {
		  return r.t.match(/^Slowed/);
		}) && this.eat(this.carafind));
	  }
	}), hax.plugins.register('brakes', {
	  'doc': '/brakes [level]',
	  'status': function () {
		return 'Brakes ' + (this.enabled ? 'ON' : 'OFF') + (this.enabled && this.level ? ' target lv' + this.level : '');
	  },
	  'command': function (l) {
		l[0x1] ? (this.level = parseInt(l[0x1]) > 0x0 ? parseInt(l[0x1]) : null, this.enabled = true) : hax.plugins.toggle('brakes'), append(this.status());
	  },
	  'level': null,
	  'levelmsg': function () {
		return this.level && new RegExp('66ffff\'>Your (.+) skill is now level ' + this.level + '!');
	  },
	  'breakmsg': /ff6600\'\>Your (.+) needs to be repaired or it will break/,
	  'chatListener': async function (l) {
		this.enabled && (!l.match(this.levelmsg()) && (!l.match(this.breakmsg) || hax.plugins.switchy && hax.plugins.switchy.enabled) || send({
		  'type': 'a'
		}));
	  }
	}), hax.plugins.register('dropmode', {
	  'doc': '/dropmode',
	  'status': function () {
		return 'Drop mode ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('dropmode'), append(this.status());
	  },
	  'quickKeyPress': function (l) {
		input_field.hasFocus || editing || -0x1 !== me && this.hotButtonClick(l);
	  },
	  'hotButtonClick': function (l) {
		!this.enabled != !keyCtrl.isDown ? send({
		  'type': 'd',
		  'slot': l,
		  'amt': 0x1
		}) : send({
		  'type': 'u',
		  'slot': l
		});
	  },
	  'init': function () {
		self.key0 = jv.keyboard(0x30), self.keyDash = jv.keyboard(0xad), self.keyWinDash = jv.keyboard(0xbd), self.keyEqual = jv.keyboard(0x3d), self.keyWinEqual = jv.keyboard(0xbb), key1.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x0);
		}, key2.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x1);
		}, key3.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x2);
		}, key4.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x3);
		}, key5.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x4);
		}, key6.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x5);
		}, key7.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x6);
		}, key8.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x7);
		}, key9.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x8);
		}, key0.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0x9);
		}, keyDash.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0xa);
		}, keyWinDash.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0xa);
		}, keyEqual.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0xb);
		}, keyWinEqual.press = function () {
		  hax.plugins.dropmode.quickKeyPress(0xb);
		}, jv.hot_button.forEach(function (l, r) {
		  l.on_click = function () {
			hax.plugins.dropmode.hotButtonClick(jv.hot_button[r].slot);
		  };
		});
	  }
	}), hax.plugins.register('spam', {
	  'enabled': true,
	  'doc': '/spam',
	  'status': function () {
		return 'spam block ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('spam'), append(this.status());
	  },
	  'msgs': [
		"<span style='color:#b3ffcc'>You feel better!</span>",
		"<span style='color:#b3ffcc'><em>You tend to your wounds..</em></span>",
		"You feel completely full!",
		"<em>You are slowing down!</em>",
		"<em>Spicy!</em>",
		"Can't till here..", // Hoe
		"Yum!",
		"You drink from the fountain of water.. Your wounds are healed!",
		"You don't have any wool to spin!",
		"Bleh.. Should have cooked it..",
		"Even raw, seems ok!",
		"Not bad.",
		//"",
		'You put the malachite in the bowl.',
		'You put the cassiterite in the bowl.',
		'Yum! That was good meat.',
		'Not too filling..',
	  ],
	  'chatListener': function (l) {
		if (this.enabled) {
		  if (l.match(/(s a little better\.|perfect condition!|is all patched up\.|loose, try again\.\.)$/)) throw 'spam';
		  if (l.match(/^You(.+)(ve cooked up a|add some fuel to the|add some)/)) throw 'spam';
		  if (l.match(/The (cooking pot|clay bowl) sizzles in the fire./)) throw 'spam';
		  if (l.match(/^You drop a plant|^You fill the buck/)) throw 'spam';
		  if (l.match(/^You create a/)) throw 'spam';
		  if (this.msgs.includes(l)) throw 'spam';
		}
	  }
	}), hax.plugins.register('heal', {
	  'doc': '/heal [percentage]',
	  'nextheal': 0x0,
	  'pct': 0x5,
	  'status': function () {
		return 'heal ' + (this.enabled ? 'ON ' + this.pct + '%' : 'OFF');
	  },
	  'command': function (l) {
		l[0x1] ? (this.pct = parseInt(l[0x1]), this.enabled = true) : hax.plugins.toggle('heal'), append(this.status());
	  },
	  'heal': function () {
		(potion = hax.inv(l => 'Healing Potion' == l.n)) && send({
		  'type': 'u',
		  'slot': parseInt(potion.slot)
		});
	  },
	  'chatListener': function (l) {
		this.enabled && l.match(/b3ffcc(.+)You feel better/) && (this.nextheal = Date.now() + 0x3a97);
	  },
	  'msgListener': function (l) {
		this.enabled && Date.now() > this.nextheal && 's' == l.type && l.h <= this.pct && this.heal();
	  }
	}), hax.plugins.register('autocraft', {
	  'doc': '/autocraft [num|stop] [fodder]',
	  'status': function () {
		return 'autocraft ' + (this.crafting ? this.crafting + ' remaining' : 'stopped');
	  },
	  'crafting': 0x0,
	  'fodder': false,
	  'command': function (l) {
		'stop' == l[0x1] ? (this.crafting = 0x0, append(this.status())) : this.crafting < 0x1 && parseInt(l[0x1]) && (this.crafting = parseInt(l[0x1]), this.fodder = 'fodder' == l[0x2], this.start());
	  },
	  'start': async function () {
		do {
		  jv.build_dialog.info.use.do_click(), await hax.sleep(0x320);
		} while (--this.crafting > 0x0);
		this.fodder = false;
	  },
	  'chatListener': function (l) {
		if (this.crafting && l.match(/^\<em\>You create a /)) throw 'spam';
	  }
	}), hax.plugins.register('zoom', {
	  'doc': '/zoom',
	  'command': function () {
		hax.plugins.toggle('zoom'), this.setZoom(this.enabled);
	  },
	  'setZoom': function (active) {
		const x = 372;
		const y = 224;
		if (typeof(active) === 'undefined') {
			if (ui_container) {
				if (ui_container.scale.x == 1) {
					this.setZoom(true);
				} else {
					this.setZoom(false);
				}
			}
		} else {
			let scale = active ? 2 : 1;
			
			if (myself) {
				let container = ((myself.sprite > 0) ? myself.monster_sprite : myself.body_sprite).parent.parent.parent;
				container.scale.x = (1 / scale);
				container.scale.y = (1 / scale);
				container.position.x = (x * (1 - (1 / scale)));
				container.position.y = (y * (1 - (1 / scale)));
			}
			
			if (ui_container) {
				ui_container.scale.x = (1 / (1 / scale));
				ui_container.scale.y = (1 / (1 / scale));
				ui_container.position.x = -(x * (scale - 1));
				ui_container.position.y = -(y * (scale - 1));
				//effect_container.scale.x = (1 / (1 / scale));
				//effect_container.scale.y = (1 / (1 / scale));
				//effect_container.position.x = -(x * (scale - 1));
				//effect_container.position.y = -(y * (scale - 1));
				if (jv && jv.ability && jv.ability[0]) {
					jv.ability[0].parent.setParent(ui_container);
				}
			}
		}
	  },
	  'init': function () {
		this.setZoom(false);
	  }
	}), hax.plugins.register('instafish', {
	  'doc': '/instafish [level|reset]',
	  'enabled': false,
	  'fishspot': 0x0,
	  'stop': false,
	  'x_range': null,
	  'y_range': null,
	  'status': function () {
		return 'Instafish ' + (this.enabled ? 'ON ' : 'OFF') + (this.enabled ? this.fishspot ? 'fish spot mode target lv' + this.fishspot : 'fishfinding mode' : '');
	  },
	  'command': function (l) {
		l[0x1] ? (this.fishspot = parseInt(l[0x1]) > 0x0 ? parseInt(l[0x1]) : null, this.resetSearch(), this.enabled = true) : hax.plugins.toggle('instafish'), append(this.status());
	  },
	  'recast': async function () {
		await hax.sleep(0x5dc), this.enabled && hax.go();
	  },
	  'levelmsg': function () {
		return new RegExp('66ffff\'>Your fishing skill is now level ' + this.fishspot + '!');
	  },
	  'resetSearch': function () {
		this.x_range = [0x0, MAP_WIDTH - 0x1], this.y_range = [0x0, MAP_HEIGHT - 0x1];
	  },
	  'nextSearchSpot': function (l, r) {
		let j = l ? hax.plugins.instafish.x_range : hax.plugins.instafish.y_range,
		  Y = l ? myself.x : myself.y;
		if (Y < j[0x0] || Y > j[0x1]) return append('fishspot moved, resetting'), hax.plugins.instafish.resetSearch(), hax.plugins.instafish.nextSearchSpot(l, r);
		r ? j[0x1] = Y : j[0x0] = Y, append(hax.plugins.instafish.searchSpotText());
	  },
	  'searchSpotText': function () {
		return 'Next search spot: ' + Math.floor((this.x_range[0x0] + this.x_range[0x1]) / 0x2) + ',' + Math.floor((this.y_range[0x0] + this.y_range[0x1]) / 0x2);
	  },
	  'chatListener': function (l) {
		if (this.enabled) {
		  if ('<em>A bite!</em>' == l) hax.act(), this.recast();else {
			if ('Can\'t fish there!' == l) hax.stop();else {
			  if ('[Cast rating' == l.substr(0x3b, 0xc)) {
				let r = l.charAt(0x49);
				throw r.match(/[ABC]/) || 'D' == r && this.fishspot ? (hax.stop(), '>Cast: ' + r) : 'spam';
			  }
			  if (this.fishspot && l.match(this.levelmsg())) this.enabled = false;else {
				if (!this.fishspot && (match = l.match(/lb fish! You suspect more fish to the (\w+)\.\.$/))) {
				  let j = match[0x1];
				  throw this.nextSearchSpot(j.match(/t$/), j.match(/(north|west)/)), 'spam';
				}
			  }
			}
		  }
		}
	  },
	  'init': function () {
		this.resetSearch();
	  }
	}), hax.plugins.register('coords', {
	  'doc': '/coords',
	  'timer': null,
	  'text': '',
	  'command': function () {
		hax.plugins.toggle('coords'), this.enabled ? this.enable() : this.disable();
	  },
	  'enable': function () {
		this.disable(), jv.coords_status.visible = true, this.timer = setInterval(this.update, 0x1f4);
	  },
	  'disable': function () {
		jv.coords_status.visible = false, this.timer && clearInterval(this.timer);
	  },
	  'update': function () {
		  if (myself) {
			  let server = connection.url.split('//')[1].split('.')[0].toUpperCase();
			  hax.plugins.coords.text = myself.x + ',' + myself.y + ' / ' + jv.map_title.text;
			  jv.coords_status.text = server + ' / ' + myself.x + ',' + myself.y + ' / ' + jv.map_title.text;
			  jv.coords_status.tint = jv.map_title.tint;
		  }
	  },
	  'init': function () {
		jv.coords_status = jv.text('Locating..', {
		  'font': '12px Verdana',
		  'fill': 0xCCCCCC,
		  'lineJoin': 'round',
		  'stroke': jv.color_dark,
		  'strokeThickness': 0x4,
		  'align': 'left'
		}), jv.coords_status.x = 10 /*0x190*/, jv.coords_status.y = jv.game_height - 28 /*0x1e*/, jv.coords_status.visible = true, ui_container.addChild(jv.coords_status), this.enabled = true, this.enable();
	  }
	}), hax.plugins.register('fixit', {
	  'sdoc': '/fixit',
	  'enabled': false,
	  'command': function () {
		hax.plugins.secret.allowed() && (this.enabled = !this.enabled, append('fixit ' + (this.enabled ? 'ON' : 'OFF')));
	  },
	  'change': async function () {
		if (!hax.plugins.secret.allowed()) return;
		let l = 0x3 == myself.dir && (hax.inv(r => 0x2cf == r.spr && [0x1, 0x2].includes(r.eqp)) || hax.inv(r => 0x2cf == r.spr));
		send({
		  'type': 'm',
		  'x': myself.x,
		  'y': myself.y,
		  'd': (myself.dir + 0x1) % 0x4
		}), l && (await hax.sleep(0x32), send({
		  'type': 'u',
		  'slot': parseInt(l.slot)
		}));
	  },
	  'msgListener': function (l) {
		if (this.enabled && 'hpo' == l.type) {
		  let r = hax.pos(myself.dir);
		  l.x == r[0x0] && l.y == r[0x1] && (l.n > 0x3e7 || l.o > l.n && l.n < 0x258) && this.change();
		}
	  }
	}), hax.plugins.register('icu', {
	  'doc': '/icu [clear]',
	  'enabled': false,
	  'timer': null,
	  'walls': [],
	  'status': function () {
		return 'ICU ' + (this.enabled ? 'ON ' : 'OFF');
	  },
	  'command': function (l) {
		l[0x1] && 'c' == l[0x1].charAt(0x0).toLowerCase() ? (this.walls = [], this.initWalls(), append('notes cleared')) : (hax.plugins.toggle('icu'), this.enabled && this.show(), append(this.status()));
	  },
	  'show': function () {
		this.initWalls();
		let l = hax.plugins.icu.wall();
		if (!l) return append('Wall object not found, disabling ICU'), void (hax.plugins.icu.enabled = false);
		hax.plugins.icu.walls.forEach(function (r, j) {
		  r && !occupied(j % 0x23, Math.floor(j / 0x23), myself) && old_parse({
			'type': 'o',
			'x': j % 0x23,
			'y': Math.floor(j / 0x23),
			'd': '' + l
		  });
		});
	  },
	  'wall': function () {
		let l = object_dict.findIndex(r => r && '-459b' == r.build);
		return l ? '' + l : null;
	  },
	  'initWalls': function () {
		for (i = 0x0; i < 0x483; i++) x = i % 0x23, y = Math.floor(i / 0x23), (y > 0x12 && y < 0x20 && [0xf, 0x22].includes(x) || 0x12 == y && x >= 0xf && x <= 0x22 && !(x >= 0x18 && x <= 0x1a) || 0x20 == y && x >= 0xf && x <= 0x22 && 0x19 != x) && (this.walls[i] = true);
	  },
	  'addWalls': function (l) {
		if (newjson = {}, Object.assign(newjson, l), wall = this.wall(), wall) return newtiles = newjson.tiles.split(':'), ori = [newjson.x - jv.update_x, newjson.y - jv.update_y], trm = [newjson.x + jv.update_x, newjson.y + jv.update_y], this.walls.forEach(function (r, j) {
		  r && (x = j % 0x23, y = Math.floor(j / 0x23), x >= ori[0x0] && x < trm[0x0] && y >= ori[0x1] && y < trm[0x1] && (tile_i = 0x1a * (x - ori[0x0]) + (y - ori[0x1]), newtiles[tile_i] = newtiles[tile_i].split('_')[0x0] + ('_' + wall)));
		}), newjson.tiles = newtiles.join(':'), newjson;
	  },
	  'msgListener': function (l) {
		if (this.enabled && 'Ancient Labyrinth' == jv.map_title.text) {
		  if ('fx' == l.type && 'shield' == l.tpl) this.walls[0x23 * l.y + l.x] = true, this.wall() && old_parse({
			'type': 'o',
			'x': l.x,
			'y': l.y,
			'd': this.wall()
		  });else {
			if ('map' == l.type) {
			  let r = this.addWalls(l);
			  throw r && old_parse(r), 'spam';
			}
		  }
		}
	  }
	}), hax.plugins.register('gem', {
	  'doc': '/gem [skill]',
	  'lib': '{"damage":"ruby","defence":"emerald","archery":"citrine, garnet, peridot","assassin":"citrine, garnet, topaz","axe":"amethyst, citrine, quartz","chopping":"garnet, quartz, sapphire","clubbing":"garnet, quartz, topaz","construction":"aquamarine, quartz, sapphire","cooking":"amethyst, peridot, sapphire","crafting":"quartz, sapphire, topaz","dagger":"citrine, saphire, topaz","destruction":"citrine, garnet, quartz","digging":"amethyst, aquamarine, quartz","exploration":"amethyst, aquamarine, garnet","farming":"amethyst, aquamarine, peridot","fishing":"aquamarine, garnet, sapphire","foraging":"amethyst, sapphire, topaz","forging":"amethyst, sapphire, topaz","hammer":"aquamarine, citrine, garnet","healing":"amethyst, quartz, topaz","heavy armor":"aquamarine, peridot, topaz","hunting":"amethyst, garnet, topaz","knitting":"citrine, peridot, sapphire","light armor":"aquamarine, citrine, peridot","medium armor":"aquamarine, garnet, peridot","mining":"citrine, quartz, sapphire","pickaxe ":"citrine, quartz, topaz","questing":"amethyst, quartz, saphire","repairing":"peridot, quartz, sapphire","research":"amethyst, aquamarine, sapphire","shield block":"aquamarine, peridot, sapphire","smelting":"peridot, sapphire, topaz","smithing":" garnet, peridot, quartz","spear":"amethyst, citrine, garnet","sword":"sapphire, garnet, topaz","tiling":"amethyst, garnet, quartz","unarmed":"citrine, peridot, topaz","unarmored":"amethyst, aquamarine, topaz"}',
	  'command': function (l) {
		if (l[0x1]) {
		  let r = Object.keys(this.gems).filter(j => j.match(RegExp(l[0x1])) && j);
		  r.length > 0x1 ? append('too many matches: ' + r.join(', ')) : 0x1 == r.length ? append(r[0x0] + ': ' + this.gems[r[0x0]]) : append('no matches');
		} else append('You need to specify a skill to search');
	  },
	  'init': function () {
		hax.plugins.gem.gems = JSON.parse(hax.plugins.gem.lib);
	  }
	}), hax.plugins.register('bookworm', {
	  'doc': '/bookworm [level]',
	  'status': function () {
		return 'bookworm ' + (this.enabled ? 'ON' + (this.target ? ', target: ' + this.target : '') : 'OFF');
	  },
	  'target': null,
	  'current': null,
	  'learned': [],
	  'bookfind': /^(Whirlwind|Healing Rain|Shell|Dash|Disorient|Intimidate|Frostbite)[\sIV]*/,
	  'read': function () {
		let l = hax.inv(r => r.n.match(this.bookfind) && !this.learned.includes(r.n));
		l ? (this.current = l.n, send({
		  'type': 'u',
		  'slot': parseInt(l.slot)
		})) : (this.enabled = false, append('no edible books found, bookworm stopping'));
	  },
	  'reset': function () {
		this.learned = [], this.current = null;
	  },
	  'command': function (l) {
		l[0x1] ? (this.enabled = true, parseInt(l[0x1]) > 0x0 && (this.target = parseInt(l[0x1]))) : hax.plugins.toggle('bookworm'), this.enabled && this.reset(), append(this.status());
	  },
	  'recordLearning': function (l) {
		this.learned = this.learned.filter(function (r) {
		  return r.substr(0x0, 0x3) != l.substr(0x0, 0x3);
		}), this.learned.length == jv.abl.length ? this.learned = [l] : this.learned.push(l);
	  },
	  'chatListener': function (l) {
		if (this.enabled) {
		  if (l.match(RegExp('66ffff\'>Your research skill is now level ' + hax.plugins.bookworm.target + '!'))) this.reset(), this.enabled = false;else {
			if (studying = l.match(/aecc96\>You start studying (.+)\.\./)) {
			  let r = studying[0x1];
			  throw this.current || append('bookworm is eatin\'...'), this.current = r, 'spam';
			}
			if (studying = l.match(/bde59c\>You learn (.+)(?:!| but)/)) throw this.recordLearning(studying[0x1]), this.read(), 'spam';
			if ('<span color:#728c5d>You\'ve already learned this.' == l) throw this.current && this.recordLearning(this.current), this.read(), 'spam';
			if (l.match(/#728c5d\>You fail to learn/)) throw this.read(), 'spam';
		  }
		}
	  }
	}), hax.plugins.register('rentboy', {
	  'doc': '/rentboy [client]',
	  'helptext': 'up|down|left|right|get|hit|clear|select|help',
	  'client': null,
	  'status': function () {
		return 'rentboy ' + (this.enabled ? 'for ' + this.client : 'OFF');
	  },
	  'command': function (l) {
		l[0x1] ? (this.client = l[0x1], this.enabled = true) : (this.client = null, this.enabled = false), append(this.status());
	  },
	  'up': () => myself.move(...hax.pos(0x0)),
	  'right': () => myself.move(...hax.pos(0x1)),
	  'down': () => myself.move(...hax.pos(0x2)),
	  'left': () => myself.move(...hax.pos(0x3)),
	  'hit': () => hax.act(),
	  'get': async function () {
		for (i = 0x0; i < 0xa; i++) send({
		  'type': 'g'
		}), await hax.sleep(0x4b);
	  },
	  'select': function () {
		let l = mobs.items.find(r => r && r.name.match(RegExp(this.client, 'i')));
		if (!l) return send({
		  'type': 'chat',
		  'data': this.client + ' not found'
		});
		(l.monster_sprite || l.body_sprite).do_click();
	  },
	  'clear': () => myself.body_sprite.do_click(),
	  'help': function () {
		send({
		  'type': 'chat',
		  'data': this.helptext
		});
	  },
	  'chatListener': function (l) {
		this.enabled && l.match(RegExp('^' + this.client + ':', 'i')) && (d = l.match(/(up|down|left|right|get|hit|clear|select|help)/)) && this[d[0x1]]();
	  }
	}), hax.plugins.register('dowser', {
	  'doc': '/dowser',
	  'status': function () {
		return 'Dowser mode ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('dowser'), append(this.status());
	  },
	  'msgListener': async function (l) {
		this.enabled && 'tile' == l.type && 0x145 == l.tile && l.x == hax.pos(myself.dir)[0x0] && l.y == hax.pos(myself.dir)[0x1] && hax.stop();
	  },
	  'chatListener': async function (l) {
		this.enabled && 'A hole appears!' == l && hax.stop();
	  }
	}), hax.plugins.register('tutorial', {
	  'enabled': false,
	  'doc': '/tutorial',
	  'status': function () {
		return 'Tutorial ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('tutorial'), append(this.status());
	  },
	  'msgListener': function (l) {
		let text = 'jv.tutorial_window.visible = 1;';
		if (!this.enabled) {
			if (l.tpl && (l.tpl=='run_code')) {
				if ((l.type=='fx_tpl')&&l.code.includes(text)) {
					l.code = l.code.replace(text,'')
					this.hide();
				}
				if ((l.type=='fx')&&l.d.includes(text)) {
					l.d = l.d.replace(text,'')
					this.hide();
				}
			}
		}
	  },
	  'hide': function () {
		if (jv && jv.tutorial_window) jv.tutorial_window.visible = false;
	  }
	}), hax.plugins.register('cooldowns', {
	  'enabled': true,
	  'doc': '/cooldowns',
	  'timer': null,
	  'buttons': {},
	  'status': function () {
		return 'Cooldowns ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('cooldowns'), append(this.status());
	  },
	  'msgListener': function (l) {
		if (l.type == 'message') {
			let source = unescape(l.text);
			
			switch (source) {
				case "<em>Spicy!</em>": {
					// Caraway
					this.buttons[77] = {cooldown:1, timestamp:hax.timestamp()};
					break;
				}
				case "<span style='color:#b3ffcc'><em>You tend to your wounds..</em></span>": {
					// Aloe
					this.buttons[767] = {cooldown:4, timestamp:hax.timestamp()};
					break;
				}
				case "<span style='color:#b3ffcc'>You feel better!</span>": {
					// Healing Potion
					this.buttons[242] = {cooldown:15, timestamp:hax.timestamp()};
					break;
				}
			}
		}
	  },
	  'init': function () {
		this.timer = clearInterval(this.timer);
		this.timer = setInterval(function(){
			if (jv && jv.hot_button) {
				for (let e of jv.hot_button) {
					if (window.item_data[e.slot] && window.item_data[e.slot].tpl) {
						let item = window.item_data[e.slot];
						if (hax.plugins.cooldowns.buttons[item.spr]) {
							let data = hax.plugins.cooldowns.buttons[item.spr];
							let ts = Math.max(0, data.timestamp + data.cooldown - hax.timestamp());
							if (ts > 0) {
								e.set_text(ts.toFixed(1));
								color = 0x18A7B5;
							} else {
								e.set_text('');
							}
							if (e.title.style.fontWeight != 'bold') {
								e.title.style.fontWeight = 'bold';
							}
						}
					}
				}
			}
		},100);
		if (jv && jv.hot_button) {
			for (let e of jv.hot_button) {
				e.set_text('');
			}
		}
	  }
	}), hax.plugins.register('death', {
	  'enabled': true,
	  'doc': '/death',
	  'status': function () {
		return 'Death ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('death'), append(this.status());
	  },
	  'msgListener': function (l) {
		if (l.type == 'fade') {
			l.f = 1;
		}
		if (l.type == 'death') {
			if (hax.plugins.coords.enabled) {
				append('Death: ' + hax.plugins.coords.text);
			}
		}
	  },
	  'init': function () {
		if (game_fade) {
			game_fade.width = 0;
			game_fade.height = 0;
		}
	  }
	}), hax.plugins.register('fishing', {
	  'enabled': true,
	  'doc': '/fishing',
	  'status': function () {
		return 'Fishing ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('fishing'), append(this.status());
	  },
	  'msgListener': function (l) {
		if (l.type == 'message') {
			let source = unescape(l.text);
			if (!l.name) {
				if (['<em>A bite!</em>','It got away..'].includes(source)) {
					if (Object.values(item_data).filter(f=>f&&(f.eqp==2)) == 0) {
						send({'type':'A'});
						send({'type':'a'});
						setTimeout(function(){
							send({'type':'A'});
							send({'type':'a'});
						}, 2000);
					}
				}
			}
		}
	  }
	}), hax.plugins.register('gears', {
	  'enabled': true,
	  'doc': '/gears',
	  'status': function () {
		return 'Check gears ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('gears'), append(this.status());
	  },
	  'msgListener': function (l) {
		  if (self.action && (l.type=='inv')) {
			for (let item of l.data) {
				if (item && (item.eqp == 2) && (item.spr != 719)) {
					send({type:'a'});
					if (sound['sword_equip']) {
						sound['sword_equip'][0].volume(0.5);
						sound['sword_equip'][0].play();
					}
					break;
				}
			}
		  }
	  }
	}), hax.plugins.register('antibot', {
	  'enabled': true,
	  'doc': '/antibot',
	  'status': function () {
		return 'Antibot ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('antibot'), append(this.status());
	  },
	  'srvListener': function (l) {
		if (this.enabled) {
			if ((l.type == 'c') && (l.r == 'mi')) {
				throw 'spam';
			}
			if ((l.v2)) {
				throw 'spam';
			}
		}
	  },
	  'msgListener': function (l) {
		if (this.enabled) {
			if ((l.type == 'fx') && (l.tpl == 'monitor')) {
				throw 'spam';
			}
		}
	  },
	}), hax.plugins.register('notices', {
	  'enabled': true,
	  'doc': '/notices',
	  'status': function () {
		return 'Notices ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('notices'), append(this.status());
	  },
	  'msgListener': function (l) {
		if (l.type=='hpo') {
			hax.effect((l.n / 1000 * 100).toFixed(2), 32 * l.x + 16, 32 * l.y - 4, 250);
		}
		if (l.type=='fx') {
			if ((l.tpl=='notice')&&(l.s==-1)&&(Number.isInteger(l.d))) {
				hax.effect((l.d).toString(), 32 * l.x + 16, 32 * l.y - 16, 500);
			}
		}
	  }
	}), hax.plugins.register('convert', {
	  'enabled': true,
	  'doc': '/convert',
	  'status': function () {
		return 'Convert ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('convert'), append(this.status());
	  },
	  'msgListener': function (l) {
		if (l.type == 'message') {
			let source = unescape(l.text);
			
			if (!l.name) {
				let match = source.replaceAll('<br>',"\n").match(new RegExp("^<span [style=]*['\"]{1}color:#([0-9A-F]+)[';\"]{1,2}>([^<]*)", 'is'));
				if (match) {
					let type = match[1].toUpperCase();
					let text = hax.specialchars(match[2]);
					
					let lines = text.split("\n");
					for (let line of lines) {
						let hp = line.match(new RegExp('^HP: ([0-9]+)/([0-9]+)', 'is'));
						if (hp) {
							let min = Number(hp[1]);
							let max = Number(hp[2]);
							
							let data = 'Total: ' + (min / max * 100).toFixed(2) + '%';
							l.text += data;
						}
						
						let expires = line.match(new RegExp('^Expires: ([0-9]+) mins', 'is'));
						if (expires) {
							let seconds = Number(expires[1]) * 60;
							
							let d=Math.floor(seconds/60/60/24);
							let h=Math.floor(seconds/60/60)%24;
							let m=Math.floor(seconds/60)%60;
							let s=seconds%60;
							
							let data = 'Total: ' +
							d.toString().padStart(0, '0') + ' days, ' +
							h.toString().padStart(2, '0') + ':' +
							m.toString().padStart(2, '0') + ':' +
							s.toString().padStart(2, '0');
							l.text += data;
						}
					}
				}
			}
		}
	  }
	}), hax.plugins.register('ews', {
	  'doc': '/ews [add|rm] [player]',
	  'timer': null,
	  'updating': false,
	  'watchlist': new Set(),
	  'statusBar': jv.text('', {
		'font': '12px Verdana',
		'fill': 0x88ffff,
		'lineJoin': 'round',
		'stroke': jv.color_dark,
		'strokeThickness': 0x4,
		'align': 'left'
	  }),
	  'status': function () {
		return 'EWS ' + (this.enabled ? 'ON ' : 'OFF') + (this.enabled ? Array.from(this.watchlist).toString() : '');
	  },
	  'command': function (l) {
		l[0x1] && l[0x2] ? 'add' == l[0x1] ? this.addPlayer(l[0x2]) : 'rm' == l[0x1] && this.rmPlayer(l[0x2]) : 'clear' == l[0x1] ? this.clear() : hax.plugins.toggle('ews'), this.enabled ? this.enable() : this.disable(), append(this.status());
	  },
	  'enable': function () {
		this.disable(), this.statusBar.text = (hax.plugins.ews.watchlist.size > 0) ? 'EWS started' : '', this.statusBar.visible = true, this.timer = setInterval(this.update, 0x2710), this.update();
	  },
	  'disable': function () {
		this.statusBar.style.fill = 0x88ffff, this.statusBar.style.stroke = jv.color_dark, this.statusBar.visible = false, this.timer && clearInterval(this.timer);
	  },
	  'update': function () {
		myself && (hax.plugins.ews.watchlist.size > 0) && (hax.plugins.ews.updating = true, hax.plugins.ews.statusBar.text = 'Scanning..', send({
		  'type': 'chat',
		  'data': '/who'
		}));
	  },
	  'addPlayer': function (l) {
		this.watchlist.add(l.toLowerCase()), this.save();
	  },
	  'rmPlayer': function (l) {
		this.watchlist.delete(l.toLowerCase()), this.save();
	  },
	  'clear': function () {
		this.watchlist.clear(), this.save();
	  },
	  'save': function () {
		this.watchlist.size > 0 ? localStorage.setItem('ews', Array.from(this.watchlist)) : localStorage.removeItem('ews');
	  },
	  'load': function () {
		localStorage.ews && localStorage.ews.length > 0 && (this.watchlist = new Set(localStorage.ews.split(',')));
	  },
	  'playerFinder': function () {
		return this.watchlist.size > 0 ? new RegExp('((?<=>)(' + Array.from(this.watchlist).join('|') + ')(?=<))', 'gi') : new RegExp(null);
	  },
	  'chatListener': function (l) {
		if (l.match(/^(\d+) players: \</)) {
		  let r = false;
		  if (hax.plugins.ews.watchlist.size > 0) this.statusBar.text = '';
		  throw (found = l.match(this.playerFinder())) ? (this.statusBar.text = found.join(','), this.statusBar.style.fill = '#ff0000', this.statusBar.style.stroke = '#fff', r = true) : (this.statusBar.text = (hax.plugins.ews.watchlist.size > 0) ? 'No players' : '', this.statusBar.style.fill = 0x88ffff, this.statusBar.style.stroke = jv.color_dark), this.enabled && this.updating ? (this.updating = false, 'spam') : (r ? '><color:#ff3333>' : '>') + l;
		}
	  },
	  'init': function () {
		this.statusBar.x = 0x190, this.statusBar.y = 0x2c, this.statusBar.visible = true, ui_container.addChild(this.statusBar), this.load(), this.enabled = true, this.enable();
	  }
	}), hax.plugins.register('secret', {
	  'allowed': function () {
		return true;
	  }
	/*
	  'iv': 0x14cc74e5,
	  'master': 'M}\x83Ó\x9c¤\x94+K\x1auç',
	  'nameKey': 'YW1sdGQyOXliUT',
	  'myName': null,
	  'lock': 0x0,
	  'key': 0x0,
	  'command': function (l) {
		this.master == hax.rc4(this.nameKey, myName) && l[0x1] && this.writeNote(l[0x1]);
	  },
	  'save': function () {
		localStorage.setItem('secret-' + jv.base64_encode(myName), this.key);
	  },
	  'ready': function () {
		this.myName == myName && this.lock && this.key || (this.myName = myName, this.lock = this.iv ^ this.genKey(myName), this.key = parseInt(localStorage.getItem('secret-' + jv.base64_encode(myName)) || 0x0));
	  },
	  'allowed': function () {
		return this.ready(), !(this.iv ^ this.lock ^ this.key);
	  },
	  'checkKey': function (l) {
		let r;
		this.ready(), this.iv ^ this.lock ^ l ? r = 'Eww, it\'s cringey alien erotic fiction with you as the protagonist. You put it down in disgust.' : (localStorage.setItem('secret-' + jv.base64_encode(myName), l), r = 'Suddenly, you feel its alien symbols strike a harmonic in your core. An unnatural power courses through your entire body.'), append('<color:#009999>You read the note. ' + r);
	  },
	  'genKey': l => l.split('').reduce((r, j) => r << 0x7 | j.charCodeAt(0x0), 0x0),
	  'extractKey': l => parseInt(l.split('').map(r => 0x200b == r.charCodeAt(0x0) ? '1' : '0').join(''), 0x2),
	  'keyMsg': function (l) {
		let r = this.genKey(l),
		  j = Array.from('alien symbols, indecipherable except for a name: ' + l + '\u200b\u200b\u200b');
		return (r >>> 0x0).toString(0x2).padStart(0x20, '0').split('').map(Y => parseInt(Y) ? '\u200b' : j.shift()).join('') + j.join('');
	  },
	  'writeNote': function (l) {
		send({
		  'type': 'chat',
		  'data': '/write ' + this.keyMsg(l)
		});
	  },
	  'chatListener': function (l) {
		if (l.match(RegExp('>You read the note:<(.+)' + myName + '\u200b\u200b\u200b'))) throw this.checkKey(this.extractKey(l.substr(0x3d, 0x20))), 'spam';
	  }
	*/
	}), hax.plugins.register('abilityv', {
	  'doc': '/abilityv', // ?
	  'init': function () {
		self.keyV = jv.keyboard(0x56), keyV.press = function () {
		  input_field.hasFocus || editing || -0x1 !== me && jv.ability[0x5] && jv.ability[0x5].do_click();
		};
	  }
	}), hax.plugins.register('trap', {
	  'doc': '/trap',
	  'button': null,
	  'sprite': null,
	  'command': function () {
		this.button.visible = !this.button.visible;
	  },
	  'setTrap': function () {
		this.next_trap && send({
		  'type': 'u',
		  'slot': parseInt(this.next_trap)
		});
	  },
	  'msgListener': function (l) {
		if ('inv' == l.type) {
		  let r = l.data.find(j => j.n.match(/ Trap$/));
		  r ? (this.next_trap = parseInt(r.slot), this.button.graphic.texture = (r.spr <= 0x0 ? tiles : items)[Number(Math.abs(r.spr)) % 0x10][Math.floor(Math.abs(Number(r.spr)) / 0x10)]) : (this.next_trap = null, this.button.graphic.texture = items[0x0][0x0]);
		}
	  },
	  'init': function () {
		this.button = jv.Button.create(0x1ea, 0x12c, 0x3e, null, ui_container, 0x2c), this.button.alpha = 0.8, this.button.visible = false, this.button.graphic.x = 0xf, this.button.graphic.oy = 0x5, this.button.graphic.y = this.button.graphic.oy, this.button.on_press = function () {
		  hax.plugins.trap.setTrap();
		}, self.keyX = jv.keyboard(0x58), keyX.press = function () {
		  hax.plugins.trap.setTrap();
		};
	  }
	}), hax.plugins.register('buildh', {
	  'doc': '/buildh',
	  'status': function () {
		return 'build with H key ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('buildh'), this.button.visible = this.enabled, append(this.status());
	  },
	  'build': function () {
		this.enabled && myself && (jv.build_dialog.visible ? jv.build_dialog.visible = false : (send({
		  'type': 'm',
		  'x': myself.x,
		  'y': myself.y,
		  'd': (myself.dir + 0x2) % 0x4
		}), jv.build_dialog.info.use.do_click()));
	  },
	  'init': function () {
		this.button = jv.Button.create(0x217, 0xf5, 0x3e, null, ui_container, 0x2c), this.button.alpha = 0.6, this.button.graphic.texture = items[0xf][0x1], this.button.graphic.x = 0xf, this.button.graphic.oy = 0x5, this.button.graphic.y = this.button.graphic.oy, this.button.visible = false, this.button.on_press = function () {
		  hax.plugins.buildh.build();
		}, self.keyH = jv.keyboard(0x48), keyH.press = function () {
		  hax.plugins.buildh.build();
		}, jv.build_dialog.info.old_set_info = jv.build_dialog.info.set_info, jv.build_dialog.info.set_info = function (l) {
		  return hax.plugins.buildh.button.graphic.texture = l ? l.texture : items[0xf][0x1], jv.build_dialog.info.old_set_info(l);
		};
	  }
	}), hax.plugins.register('fod', {
	  'doc': '/fod [id|pickup|drop [u|a|g|h|r|s|e]]',
	  'armor': ['ers_gem|_catcher|_signet|_scarf|_amulet|_band|_ring|_stone|_charm|_memento', '_armor|_robe|_tunic|_jacket|_cloak|_garb|_cuirass|mail'],
	  'onehand': ['_buckler|_shield|_targe', 'dagger|_sword|_spear|mace|club|_axe', 'spindle|builder|_kit|bandage'],
	  'twohand': ['_knuckles|_pickaxe|_hammer|_bow', '_needles|_bow|_rod|shears|shovel|hoe'],
	  'invfull': null,
	  'fodder': [],
	  'disable': false,
	  'runeIndex': {},
	  'inspecting': undefined,
	  'get': function () {
		send({
		  'type': 'g'
		});
	  },
	  'equip': function (l) {
		send({
		  'type': 'u',
		  'slot': parseInt(l.slot)
		});
	  },
	  'drop': function (l) {
		send({
		  'type': 'd',
		  'slot': l.slot ? parseInt(l.slot) : l,
		  'amt': 'all'
		});
	  },
	  'isFodder': function (l) {
		return l && l.tpl && l.tpl.match(RegExp('(' + this.armor.concat(this.onehand, this.twohand).join('|') + ')$'));
	  },
	  'resetIndex': function () {
		this.runeIndex = Object.fromEntries(Array.from('AGHRS', l => [l, Array(0xb).fill(null).map(() => [])]));
	  },
	  'command': function (l) {
		if (l[0x1]) {
		  let r = l[0x1].charAt(0x0).toLowerCase();
		  if ('i' == r) this.sort();else {
			if ('p' == r) this.pickup();else {
			  if ('d' == r) {
				if (l[0x2]) {
				  let j = l[0x2].charAt(0x0).toUpperCase();
				  if (Array.from('AGHRSUE').includes(j)) {
					if ('U' == j) {
					  let Y = item_data.slice(0xf).filter(U => this.isFodder(U) && !U.n.match(/\*/));
					  this.doAll(Y, this.drop, () => append('unruned items dropped'));
					} else {
					  if ('E' == j) {
						let U = item_data.filter(M => M && M.slot);
						this.doAll(U, this.drop, () => append('everything dropped'));
					  } else {
						if (!this.runeIndex[j]) return void append('run "/fod id" first to identify items');
						{
						  let M = parseInt(l[0x2].charAt(0x1)),
							G = M ? this.runeIndex[j][M] : this.runeIndex[j].flat(),
							S = j.toLowerCase() + (M || '');
						  G.length ? this.doAll(G, this.drop, () => append(S + ' items dropped')) : append('no ' + S + ' items found');
						}
					  }
					}
				  } else append('unknown drop option');
				} else {
				  let I = item_data.slice(0xf).filter(q => this.isFodder(q));
				  this.doAll(I, this.drop, () => append('all fodder items dropped'));
				}
			  }
			}
		  }
		}
	  },
	  'doAll': async function (l, r, j) {
		for (i = 0x0; i < l.length; i++) r(l[i]), await hax.sleep(0x32);
		j();
	  },
	  'pickup': async function () {
		for (this.invfull = 0x4b == item_data.filter(l => l.tpl).length; !this.invfull && jv.pickup_sprite;) this.get(), await hax.sleep(0x64);
		this.invfull = null, append('pickup complete');
	  },
	  'sort': function () {
		this.enabled = true, this.disable = false, append('fodder ID started, do not touch inventory until complete message...');
		let l = item_data.filter(r => r && r.eqp);
		this.doAll(l, this.equip, () => {
		  this.resetIndex(), this.fodder = item_data.slice(0xf).filter(r => this.isFodder(r)), this.ident();
		});
	  },
	  'ident': function () {
		if (this.inspecting = this.fodder.pop()) this.equip(this.inspecting);else {
		  this.enabled = false, this.disable = true, append('fodder ID complete:');
		  for (let [l, r] of Object.entries(this.runeIndex)) append(l + ': ' + r.slice(0x1).map(j => j.length).join(' '));
		}
	  },
	  'chatListener': function (l) {
		if (this.enabled || this.disable) {
		  if (this.inspecting && l.match(/^\<em\>You (hold|wear|equip)/)) {
			let r = l.match(/((Ancient|Stained|Radiant|Humming|Glowing)\(\w+\))/g);
			throw r && r.forEach(j => {
			  this.runeIndex[j.charAt(0x0)][parseInt(j.match(/\d+/))].push(parseInt(this.inspecting.slot));
			}), this.equip(this.inspecting), this.ident(), 'spam';
		  }
		  if (l.match(/requires level (\d+)\.\<\/span\>$/)) this.ident();else {
			if (l.match(/^\<em\>You unequip/)) throw this.disable && (this.disable = false), 'spam';
		  }
		}
		null != this.invfull && l.match(/^Your inventory is full/) && (this.invfull = true);
	  }
	}), hax.plugins.register('wallhack', {
	  'doc': '/wallhack',
	  'enabled': false,
	  'news': {
		'tiles': 'https://i.imgur.com/BEnoXeR.png',
		'items': 'https://i.imgur.com/eHNXWWm.png'
	  },
	  'olds': {
		'tiles': path + 'data/misc/tile16.png',
		'items': path + 'data/misc/item16.png'
	  },
	  'status': function () {
		return 'Wallhack ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('wallhack'), this.enabled ? this.enable() : this.disable(), append(this.status());
	  },
	  'enable': async function () {
		let l = hax.plugins.wallhack;
		try {
		  if (!myself) throw 'not loaded';
		  if (!l.enabled) return;
		  for (let [r, j] of Object.entries(l.news)) self[r] = jv.spritesheet(j, 0x10, 0x10, 0x2);
		  (floor = object_dict.find(Y => Y && -0x20e == Y.sprite)) && (floor.sprite = -0x1eb);
		} catch (Y) {
		  await hax.sleep(0xc8), l.enable();
		}
	  },
	  'disable': async function () {
		let l = hax.plugins.wallhack;
		try {
		  if (!myself) throw 'not loaded';
		  if (l.enabled) return;
		  for (let [r, j] of Object.entries(this.olds)) self[r] = jv.spritesheet(j, 0x10, 0x10, 0x2);
		  (floor = object_dict.find(Y => Y && -0x1eb == Y.sprite)) && (floor.sprite = -0x20e);
		} catch (Y) {
		  await hax.sleep(0xc8), l.disable();
		}
	  },
	  'init': function () {
		PIXI.loader.add(Object.values(this.news).concat(Object.values(this.olds))).load(this.enable);
	  }
	}), hax.plugins.register('planks', {
	  'doc': '/planks',
	  'enabled': true,
	  'status': function () {
		return 'Planks ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('planks'), append(this.status());
	  },
	  'msgListener': function (l) {
		if ('obj_tpl' === l.type) {
		  this.enabled && 'Wood Planks' == l.name && (l.spr = -0x1eb);
		  var r = {};
		  //throw
		  r.build = l.build, r.name = l.name, r.description = l.desc, r.can_stack = l.stack, r.can_pickup = l.pickup, r.can_block = l.block, r.sprite = l.spr, r.build = l.build, object_dict[l.tpl] = r, objects.process(function (j) {
			j.template == l.tpl && j.cleanup();
		  }); // 'spam';
		}
	  },
	  'init': function () {
		
	  }
	}), hax.plugins.register('towers', {
	  'doc': '/towers',
	  'enabled': true,
	  'status': function () {
		return 'Towers ' + (this.enabled ? 'ON' : 'OFF');
	  },
	  'command': function () {
		hax.plugins.toggle('towers'), append(this.status());
	  },
	  'msgListener': function (l) {
		if ('obj_tpl' === l.type) {
		  this.enabled && 'Arrow Tower' == l.name && (l.build = null);
		  var r = {};
		  //throw
		  r.build = l.build, r.name = l.name, r.description = l.desc, r.can_stack = l.stack, r.can_pickup = l.pickup, r.can_block = l.block, r.sprite = l.spr, r.build = l.build, object_dict[l.tpl] = r, objects.process(function (j) {
			j.template == l.tpl && j.cleanup();
		  }); // 'spam';
		}
	  },
	  'init': function () {
		
	  }
	}), hax.plugins.register('switchy', {
	  'sdoc': '/switchy [max|dummy]',
	  'next_repkit': null,
	  'next_bandage': null,
	  'weapons': /(dagger|_sword|_spear|mace|club|_axe|_knuckles|_pickaxe|_hammer)$/,
	  'other_equipment': /(_buckler|_shield|builder|_bow|_rod|shears|shovel|hoe)$/,
	  'switch_on_wear': function (l) {
		return l.t.match(this.weapons) || l.t.match(this.other_equipment);
	  },
	  'mode': 'm',
	  'repair_timer': null,
	  'status': function () {
		return 'switchy ' + (this.enabled ? 'd' == this.mode ? 'dummy' : 'MAXXED' : 'normal');
	  },
	  'command': function (l) {
		hax.plugins.secret.allowed() && (l[0x1] ? ('d' == l[0x1].charAt(0x0) ? (this.mode = 'd', this.curr_weapon = null) : 'm' == l[0x1].charAt(0x0) && (this.mode = 'm'), this.enabled = true) : hax.plugins.toggle('switchy'), this.load_kits(), append(this.status()));
	  },
	  'load_kits': function () {
		let l = hax.inv(Y => 0x2cf == Y.spr && 0x0 == Y.eqp);
		this.next_repkit = l ? parseInt(l.slot) : null;
		let r = hax.inv(Y => 0x33a == Y.spr && 'O' != Y.n.charAt(0x0) && 0x0 == Y.eqp);
		this.next_bandage = r ? parseInt(r.slot) : null;
		let j = hax.inv(Y => 0x1 == Y.eqp && Y.tpl.match(this.weapons));
		this.curr_weapon = j ? parseInt(j.slot) : null;
	  },
	  'chatListener': async function (l) {
		this.next_repkit && 'The repair kit breaks!' == l ? send({
		  'type': 'u',
		  'slot': this.next_repkit
		}) : this.next_bandage && 'This bandage is all used up!' == l && send({
		  'type': 'u',
		  'slot': this.next_bandage
		});
	  },
	  'msgListener': async function (l) {
		if ('inv' == l.type) {
		  let r = l.data.find(Y => 0x2cf == Y.spr && 0x0 == Y.eqp);
		  this.next_repkit = r ? parseInt(r.slot) : null;
		  let j = l.data.find(Y => 0x33a == Y.spr && 'O' != Y.n.charAt(0x0) && 0x0 == Y.eqp);
		  if (this.next_bandage = j ? parseInt(j.slot) : null, this.enabled) {
			if (!hax.plugins.secret.allowed()) return;
			let Y = l.data.find(U => 0x2 == U.eqp && this.switch_on_wear(U));
			if (Y) {
			  let U = new RegExp(this.switch_on_wear(Y)[0x0] + '$');
			  (next_equip = l.data.find(M => M.t.match(U) && 0x0 == M.eqp && parseInt(M.slot) > parseInt(Y.slot))) ? send({
				'type': 'u',
				'slot': parseInt(next_equip.slot)
			  }) : send({
				'type': 'a'
			  });
			}
		  }
		} else {
		  if (this.enabled && 'd' == this.mode && 'hpo' == l.type) {
			if (!hax.plugins.secret.allowed()) return;
			let M = hax.pos(myself.dir);
			if (l.x == M[0x0] && l.y == M[0x1]) {
			  if (l.o > l.n && l.n < 0x64) {
				if (null != this.next_repkit) {
				  if (this.repair_timer && this.repair_timer > Date.now()) return;
				  this.repair_timer = Date.now() + 0x1388;
				  let G = hax.inv(i => 0x1 == i.eqp && i.tpl.match(this.weapons));
				  this.curr_weapon = G ? parseInt(G.slot) : null, send({
					'type': 'u',
					'slot': this.next_repkit
				  });
				} else send({
				  'type': 'a'
				});
			  } else l.o < l.n && l.n > 0x3e7 && (item_data[this.curr_weapon] ? (0x0 == item_data[this.curr_weapon].eqp && send({
				'type': 'u',
				'slot': this.curr_weapon
			  }), this.curr_weapon = null) : send({
				'type': 'a'
			  }));
			}
		  }
		}
	  }
	}), hax.plugins.register('sinmain', {
	  'sdoc': '/sinmain [wait]',
	  'sleep': 0x6e,
	  'status': function () {
		if (hax.plugins.secret.allowed()) return 'Sinmain ' + (this.enabled ? 'ON' : 'OFF') + ' sleep: ' + this.sleep + 's';
	  },
	  'command': function (l) {
		hax.plugins.secret.allowed() && (l[0x1] ? (this.sleep = parseInt(l[0x1]), this.enabled = true) : hax.plugins.toggle('sinmain'), append(this.status()));
	  },
	  'battleStart': async function () {
		await hax.sleep(0x3e8 * this.sleep), myself.move(...hax.pos(0x1));
	  },
	  'battleReset': async function () {
		await hax.sleep(0x3e8), myself.move(...hax.pos(0x3)), await hax.sleep(0x3e8), myself.move(...hax.pos(0x0)), await hax.sleep(0x3e8), hax.act();
	  },
	  'chatListener': function (l) {
		if (this.enabled && hax.plugins.secret.allowed()) {
		  if ('>FIGHT' == l.substr(0x23, 0x6)) throw this.battleStart(), 'spam';
		  if ('>The battle is over' == l.substr(0x1b, 0x13)) throw this.battleReset(), 'spam';
		  if (l.match(/#(ff6633|cc3300)\'\>(.+)(BATTLE STARTING|Take your|has defeated|)/)) throw 'spam';
		}
	  }
	}), hax.plugins.register('sinalt', {
	  'doc': '/sinalt [mainname]',
	  'status': function () {
		return 'SinAlt mode ' + (this.enabled ? 'ON with main ' + this.mainName : 'OFF');
	  },
	  'mainName': null,
	  'command': function (l) {
		l[0x1] ? (this.mainName = l[0x1], this.enabled = true) : this.mainName ? hax.plugins.toggle('sinalt') : this.enabled = false, append(this.status());
	  },
	  'chatListener': async function (l) {
		this.enabled && l.match(RegExp(this.mainName + ' is preparing for battle', 'i')) && hax.act();
	  }
	}), hax.plugins.register('supergran', {
	  'sdoc': '/supergran [repeat|grind|fatfinger]',
	  'mode': 'r',
	  'next_needles': null,
	  'status': function () {
		if (!hax.plugins.secret.allowed()) return;
		let l = {
		  'f': 'fatfinger',
		  'g': 'grind',
		  'r': 'repeat'
		};
		return 'Supergran ' + (this.enabled ? 'ON ' + l[this.mode] : 'OFF');
	  },
	  'command': function (l) {
		if (hax.plugins.secret.allowed()) {
		  if (l[0x1]) {
			this.enabled = true;
			let r = l[0x1].charAt(0x0).toLowerCase();
			r.match(/[fgr]/) && (this.mode = r);
		  } else hax.plugins.toggle('supergran');
		  this.loadNeedle(), append(this.status());
		}
	  },
	  'loadNeedle': function () {
		let l = hax.inv(r => 0x1 == r.eqp && 'knitting_needles' == r.tpl);
		this.next_needles = l ? hax.inv(r => 'knitting_needles' == r.tpl && parseInt(r.slot) > parseInt(l.slot)) : hax.inv(r => 'knitting_needles' == r.tpl);
	  },
	  'switchNeedle': function () {
		this.next_needles ? send({
		  'type': 'u',
		  'slot': parseInt(this.next_needles.slot)
		}) : send({
		  'type': 'a'
		});
	  },
	  'chatListener': async function (l) {
		if (this.enabled && 'r' == this.mode) {
		  if (!hax.plugins.secret.allowed()) return;
		  if ('Click the Knit button and select a garment.' == l) return send({
			'type': 'a'
		  }), await hax.sleep(0x3e8), jv.build_dialog.info.use.do_click(), void send({
			'type': 'A'
		  });
		}
	  },
	  'msgListener': function (l) {
		if (this.enabled) {
		  if (!hax.plugins.secret.allowed()) return;
		  if ('fx' == l.type && 'notice' == l.tpl && l.x == myself.x && l.y == myself.y - 0x1) {
			if ('g' == this.mode) {
			  let r = l.d.match(/Knit (\d*)%/);
			  r && parseInt(r[0x1]) > 0x2c && this.switchNeedle();
			} else 'f' == this.mode && 'A mistake! Start again..' == l.d && this.switchNeedle();
			return;
		  }
		  if ('inv' == l.type) {
			let j = l.data.find(Y => 0x1 == Y.eqp && 'knitting_needles' == Y.t);
			this.next_needles = j ? l.data.find(Y => 'knitting_needles' == Y.t && parseInt(Y.slot) > parseInt(j.slot)) : l.data.find(Y => 'knitting_needles' == Y.t);
		  }
		}
	  }
	});
}

hax.wait = function(){
	hax.timer = setInterval(function(){
		if (jv && ui_container) {
			hax.timer = clearInterval(hax.timer);
			hax.init();
			hax.register();
			
			// Buttons
			for (let i in hax.buttons) {
				hax.buttons[i].destroy();
			}
			hax.button(3, 'PVP', function(){send({type:'c',r:'pv'})});
			hax.button(2, 'Trade', function(){send({'type':'chat','data':'/trade'})});
			hax.button(1, 'Speed', function(){hax.speedhack()});
			hax.button(0, 'Zoom', function(){hax.plugins.zoom.command()});
			
			// Pad
			if (window.compass) compass.visible = false;
			if (window.compass2) compass2.visible = false;
			if (window.ph_dpad) ph_dpad.visible = false
			
			// Canvas
			if (jv.renderer) jv.renderer.view.style.outline = 'none';
			
			// Reg
			//if (jv.choose_name) jv.choose_name.visible = false;
			
			// Quests
			if (jv.tutorial_window) jv.tutorial_window.visible = false;
			
			// Buff
			if (jv.buff_container) jv.buff_container.x = 88;
			if (jv.buff_container) jv.buff_container.y = jv.game_height - 60;
			
			// Mute
			(function(){
				let mute = function (list) {
					if (!window.sound) return;
					list.forEach(n=>sound[n]&&sound[n].forEach(i=>i._muted = true));
				}
				mute(['cow','chicken','sheep']);
			}).call();
			
			// Dias
			if (window.info_pane) {
				info_pane.set_info_source = info_pane.set_info_source || info_pane.set_info;
				info_pane.set_info = function(e){
					info_pane.set_info_source(e);
					if (e && e.id && player_dict[e.id] && player_dict[e.id].premium) {
						info_pane.heading.text += "\n" + player_dict[e.id].premium + ' dias';
					}
				}
			}
			
			// Quit
			window.quit_ts = 0;
			window.quit_tmr = clearInterval(window.quit_tmr);
			window.quit_tmr = setInterval(function(){
				if (jv.ver_text) {
					if (window.quit_ts > 0) {
						let ts = Math.max(0, Math.ceil(window.quit_ts + 60 - hax.timestamp()));
						if (ts > 0) {
							jv.ver_text.text = ts.toString() + ' sec';
						} else {
							window.quit_ts = 0;
							jv.ver_text.text = 'ready';
						}
					}
				}
			}, 1000);
			if (window.quit_dialog) {
				window.quit_dialog.yes.on_click = function(){
					hax.plugins.zoom.setZoom(false);
					hax.speedhack(false);
					
					send({type:'chat', data:'/quit'});
					window.quit_dialog.hide();
					window.quit_ts = hax.timestamp();
				}
			}
			
			// Spells
			if (static_container) static_container.y = -16;
			
			// Hotkey
			hax.hotkey = jv.keyboard(0x79); // F10
			hax.hotkey.press = function(){
				if (hax.visible()) {
					hax.visible(false);
				} else {
					hax.visible(true);
				}
			}
			
			console.log('Patch:', 'loaded');
		}
	},50);
}

hax.wait();
