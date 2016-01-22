/*jslint ass: true, bitwise: true, browser: true, closure: true, continue: true, couch: true, debug: true, devel: true, eqeq: true, evil: true, forin: true, indent: 4, maxerr: 50, maxlen: 250, newcap: true, node: true, nomen: true, passfail: true, plusplus: true, regexp: true, rhino: true, sloppy: true, stupid: true, sub: true, todo: true, unparam: true, vars: true, white: true */
Fugushima.Game = function (game) {};

Fugushima.Game.prototype = {
    create: function () {
        // Set game speed.
        this.bgSpd = 5;
        this.nextFire = 0;
        // Arrays.
        this.aHookGrp = [];
        this.aWeedGrp = [];
        this.aFoeDead = [];
        this.aSelect = [];
        // Set foe, speed, stamina, stun time, frames.
        this.aEasy = [
            ['eyes', 3000, -10, 5000, 1],
            ['octo', 4000, -8, 3000, 1],
            ['spike', 6500, -12, 4000, 1],
            ['eye', 5000, -9, 3500, 1],
            ['blob', 4500, -11, 2500, 1],
            ['squid', 6000, -15, 4500, 2],
            ['star', 5500, -13, 5500, 1]
        ];
        this.aSelect.push(this.aEasy);
        this.aNormal = [
            ['eyes', 2250, -6, 3000, 1],
            ['octo', 4000, -5, 2000, 1],
            ['spike', 4500, -3, 2500, 1],
            ['eye', 3000, -7, 4500, 1],
            ['blob', 3500, -8, 4500, 1],
            ['squid', 3750, -9, 3500, 2],
            ['star', 2500, -10, 4000, 1]
        ];
        this.aSelect.push(this.aNormal);
        this.aHard = [
            ['eyes', 1500, -2, 3000, 1],
            ['octo', 4000, -4, 2000, 1],
            ['spike', 2500, -3, 6000, 1],
            ['eye', 1000, -5, 1500, 1],
            ['blob', 3000, -6, 2500, 1],
            ['squid', 2000, -5, 3500, 2],
            ['star', 2500, -4, 3000, 1]
        ];
        this.aSelect.push(this.aHard);
        this.aFoeItms = this.aSelect[_level];
        // Top nav icons.
        this.aNavIcn = [
            ['efct1'],
            ['efct2'],
            ['efct3'],
            ['efct4'],
            ['efct5']
        ];
        // Pill effects.
        FXpill = {
            a: {
                once: true,
                del: 4500,
                ndel: 0,
                secs: 1500,
                icn: 0
            },
            b: {
                once: true,
                del: 4000,
                ndel: 0,
                secs: 1000,
                icn: 1
            },
            c: {
                once: true,
                del: 2500,
                ndel: 0,
                secs: 500,
                icn: 2
            },
            d: {
                once: true,
                del: 3000,
                ndel: 0,
                secs: 1000,
                icn: 3
            },
            e: {
                once: true,
                del: 2500,
                ndel: 0,
                secs: 500,
                icn: 4
            },

            pills: function (t, fx) {
                if (fx.once) {
                    fx.once = false;
                    var icon = t.navIcnGrp.getAt(fx.icn);
                    icon.animations.frameName = t.aNavIcn[fx.icn] + '0001';
                    icon.alpha = 0;

                    fx === this.a ? (t.fish.alpha = 0.3, t.fish.see = false) : null;
                    fx === this.a ? t.foeGrp.see = false : null;
                    fx === this.b ? (t.foeGrp.bigbub = true, t.fuguGrp.see = false) : null;
                    fx === this.c ? (t.fuguGrp.alpha = 0.3, t.fuguGrp.see = false) : null;
                    fx === this.e ? t.ammoType = t.ringGrp : null;

                    t.game.time.events.add(fx.del, function () {
                        t.game.add.tween(icon).to({
                            alpha: 0.1
                        }, fx.ndel, Phaser.Easing.Linear.None, true);

                        t.game.time.events.add(fx.ndel, function () {
                            if (t.fish.dead) {
                                return;
                            };
                            fx.once = true;
                            icon.animations.frameName = t.aNavIcn[fx.icn] + '0000';
                            t.game.add.tween(icon).to({
                                alpha: 1
                            }, 1000, Phaser.Easing.Linear.None, true);
                            fx.ndel = fx.del;

                            fx === this.a ? (t.fish.alpha = 1, t.fish.see = true) : null;
                            fx === this.a ? t.foeGrp.see = true : null;
                            fx === this.b ? (t.killFoe(null, true, true), t.foeGrp.bigbub = false, t.fuguGrp.see = true) : null;
                            fx === this.c ? (t.fuguGrp.alpha = 1, t.fuguGrp.see = true) : null;
                            // Step effects.
                            fx === this.c || fx === this.d ? t.bgSpd = 5 : null;
                            fx === this.c || fx === this.e ? t.bubbleGrp.firerate = 250 : null;
                            fx === this.e ? (t.ammoType = t.bubbleGrp, t.ringGrp.firerate = 500) : null;

                        }, this);
                    }, this);
                };
                fx === this.c || fx === this.d ? t.bgSpd += 0.3 : null;
                fx === this.c ? t.bubbleGrp.firerate -= 10 : null;
                fx === this.e ? t.bubbleGrp.firerate += 10 : null;
                t.navIcnGrp.getAt(fx.icn).alpha += 0.1;
                fx.ndel += fx.secs;
            }
        };

        // Pill choices.
        this.aFx = [
            FXpill.a,
            FXpill.b,
            FXpill.c,
            FXpill.d,
            FXpill.e
        ];
        this.aFxr = [];

        // Build emitters.
        Emitte = function (t) {
            this.t = t;
            this.last;
            this.aEm = [];
            var frames;
            var n = 0;
            aE = [ // 0:emitter img, 1:still frames, 2:gravity, 3:max size, 4:min size 5:how many, 6:rotation 7:animation, 8:number of frames.
                ['bubbles0000', null, -90, 1, 0.3, 30, false, false],
                ['bubbles0001', null, -90, 2, 0.5, 30, false, false],
                ['bones000', 5, 90, 1.5, 0.5, 30, true, false],
                ['pill', null, 30, 1, 1, 20, true, true, 3],
                ['worm', null, 30, 1, 1, 50, true, true, 2],
                ['weeblack', null, 30, 1, 1, 50, false, true, 1],
                ['magfly', null, 150, 1.5, 1, 30, false, true, 2],
                ['maggot', null, 30, 1, 1, 30, true, true, 1],
                ['fugusmall0005', null, 70, 0.8, 0.5, 20, true, false],
                ['clouds0001', null, 0, 3.5, 1.5, 10, false, false],
                ['pill0004', null, 30, 1, 1, 20, true, false]
            ];
            for (var i = 0; i < aE.length; i++) {
                this.aEm[i] = t.game.add.emitter(0, 0);
                this.aEm[i].tmr = t.game.time.create(true);
                this.aEm[i].gravity = aE[i][2];
                !aE[i][6] ? this.aEm[i].setRotation(0, 0) : null;
                i === 9 ? (this.aEm[i].setXSpeed(-20, 20), this.aEm[i].setYSpeed(-20, 20)) : null;
                aE[i][1] === null ? frames = null : frames = aE[i][0] + n;

                for (var j = 0; j < aE[i][5]; j++) {
                    em = this.aEm[i].create(0, 0, 'spritesheet', frames, false);
                    em.who = aE[i][0];
                    frames === null && !aE[i][7] ? em.animations.frameName = aE[i][0] : null;
                    em.anchor.setTo(0.5, 0.5);
                    k = t.rand(false, aE[i][3], aE[i][4]);
                    em.scale.setTo(k, k);
                    frames === null ? null : n === aE[i][1] ? (n = 0, frames = aE[i][0] + n) : (n++, frames = aE[i][0] + n);
                    i === 10 ? em.body.setRectangle(10, 10, 0, 0) : null;

                    if (aE[i][7]) {
                        k = t.rand(true, 12, 4);
                        em.body.setRectangle(10, 10, 0, 0);
                        em.animations.add('swim', Phaser.Animation.generateFrameNames(aE[i][0], 0, aE[i][8], '', 4), k, true);
                        em.animations.play('swim');
                        aE[i][0] === 'pill' ? (em.efct, em.fX = Object.create(FXpill)) : null;

                    };
                };
            };
        };

        Emitte.prototype.Start = function (e, pos, time, num) {
            this.aEm[e].x = pos.x;
            this.aEm[e].y = pos.y;
            this.aEm[e].start(true, time, null, num);
        };

        Emitte.prototype.Move = function (e, r, x) { // If on is true move it.
            if (x) {
                this.aEm[e].forEachAlive(function (em) {
                    r ? em.x -= this.t.bgSpd : em.x += this.t.bgSpd;
                }, this);
            } else {
                this.aEm[e].forEachAlive(function (em) {
                    r ? em.y -= this.t.bgSpd : em.y += this.t.bgSpd;
                }, this);
            };
        };

        // Shared emitter and  tween effects.
        fXshared = {
            cloud: function (t, cloud, pos, alpha, size) { // nuk, ring, fish
                var c = t.game.add.sprite(pos.x, pos.y, 'spritesheet');
                c.animations.frameName = cloud;
                c.anchor.setTo(0.5, 0.5);
                c.scale.setTo(0, 0);
                c.alpha = alpha;
                if (pos === t.fish) {
                    c.angle = pos.angle;
                    pos.scale.x < 0 ? size = -Math.abs(size) : null;
                };
                t.game.add.tween(c.scale).to({
                    x: size,
                    y: size
                }, 500, Phaser.Easing.Sinusoidal.InOut, true);

                var fade = t.game.add.tween(c).to({
                    alpha: 0
                }, 250, Phaser.Easing.Sinusoidal.Out, true, 250);
                fade.onComplete.add(function () {
                    c.destroy()
                }, this);
            },

            hooked: function (t, up) {
                var hookup = t.game.add.tween(up).to({
                    y: -600
                }, 3000, Phaser.Easing.Exponential.In, true);
                up.unq === 'fugu' ? hookup.onComplete.add(function () {
                    up.dead = false;
                    up.kill();
                }, this) : null;
            },

            dead: function (t, Y, X, ang, img, spt, q, del) {
                q ? t.fish.dead = true : null;

                spt === null ? (spt = t.game.add.sprite(X, -200, 'spritesheet'), spt.animations.frameName = img) : null;
                spt.anchor.setTo(0.5, 0.5);

                var bone = t.game.add.tween(spt).to({
                    y: Y,
                    angle: ang
                }, 5000, Phaser.Easing.Linear.None, true, del);
                bone.onComplete.add(function () {
                    if (spt.unq === 'fugu') {
                        spt.dead = false;
                        spt.kill();
                        t.fuguGrp.dead = false;
                    } else {
                        q ? t.quitGame() : spt.destroy();
                    };
                }, this);
            }
        };

        // Set world bounds.
        this.game.world.setBounds(-3000, -1000, 6000, 2000);

        // Add the background sprite and resize.
        this.bg = this.game.add.sprite(0, 0, 'spritesheet');
        this.bg.animations.frameName = 'bgsf0000';
        this.bg.width = 1024;
        this.bg.height = 1600;

        // Light rays setup.
        this.rayGrp = this.game.add.group();
        this.rayGrp.x = this.rand(true, 950, 50);
        for (var i = 0; i < 4; i++) {
            var ray = this.rayGrp.create(200, -400, 'spritesheet');
            ray.animations.frameName = 'ray0000';
            ray.height = 2000;
        };
        this.lightRays();

        // Set up and position initial weed sprites and groups.
        for (var i = 0; i < 5; i++) {
            var weedparts = i < 1 ? 12 : 8 * i;
            this.weedGrp = this.game.add.group();
            for (var j = 0; j < weedparts; j++) {
                var weed = this.weedGrp.create(0, 0, 'spritesheet');
                weed.animations.frameName = 'weed0000';
            };
            var inum = i < 1 ? 0.3 : 1 / i;
            this.weedGrp.alpha = inum;
            var k = 0;
            this.weedGrp.forEach(function (weed) {
                weed.scale.x = inum;
                weed.scale.y = inum;
                weed.y = weed.height * k;
                this.weedGrp.hgt = weed.y;
                k++;
            }, this);
            this.weedGrp.x = i < 1 ? 700 : i * this.rand(true, 200, 80);
            this.weedGrp.y = this.bg.height - this.weedGrp.hgt;
            this.aWeedGrp.push(this.weedGrp);
        };

        // Create sprites and add them to sinkGrp group.
        this.sinkGrp = this.game.add.group();
        this.sinkGrp.actv = true;
        for (var i = 0; i < 4; i++) {
            var s = this.sinkGrp.create(this.rand(true, 800, 0), -100, 'spritesheet');
            i === 3 ? (j = 2, s.pill = true) : (j = 0, s.pill = false);
            s.animations.frameName = 'barrel000' + j;
            s.EmFx = new Emitte(this);
            s.fX = Object.create(fXshared);
            s.EmFx.aEm[0].setSize(s.width, s.height);
            s.EmFx.aEm[1].setSize(s.width, s.height);
            //s.EmFx.aEm[3].setSize(s.width, s.height);
            s.body.bounce.setTo(0.8, 0.8);
            s.body.linearDamping = 0.1;
            s.body.minVelocity.setTo(0, 0);
            s.body.velocity.setTo(this.rand(true, 50, 10), this.rand(true, 50, 10));
            s.hitcnt = 0;
            s.n = 0;
            s.anchor.setTo(0.5, 0.5);
            this.reSink(s);
            s.events.onOutOfBounds.add(this.reSink, this);
        };

        //Setup hook and line for newHooks.
        this.hookGrp = this.game.add.group();
        for (var i = 0; i < 5; i++) {
            var line = this.game.add.sprite(0, 0, 'spritesheet');
            line.animations.frameName = 'line0000';

            i === 0 ? k = 1 : k++;
            line.max = (1024 / 6) * k;
            line.min = (1024 / 5) * (k) - 200;
            line.hook = this.hookGrp.create(0, 0, 'spritesheet');
            line.hook.animations.frameName = 'hooks000' + i;
            line.hook.body.setRectangle(20, 60, 0, 0);
            line.up = this.game.add.tween(line).to({
                height: -600
            }, 3000, Phaser.Easing.Exponential.In, false, 0);
            line.hook.num = i;
            line.hook.once = true;
            line.hook.fX = Object.create(fXshared);
            this.aHookGrp.push(line);
            this.newHooks(this.aHookGrp[i], this.rand(true, line.min, line.max), this.rand(true, 300, 100));
        };

        // Set up ammoType bubbleGrp and ringGrp.
        this.bubbleGrp = this.game.add.group();
        this.bubbleGrp.firerate = 250;
        this.ringGrp = this.game.add.group();
        this.ringGrp.firerate = 500;
        this.ringGrp.grow = false;
        this.ammoType = this.bubbleGrp;
        for (var i = 0; i < 30; i++) {
            var bub = this.bubbleGrp.create(0, 0, 'spritesheet', null, false);
            bub.animations.frameName = 'bubbles0001';
            bub.ammo = 'Bubble';
            bub.body.setRectangle(15, 15, 0, 0);
            bub.anchor.setTo(0.5, 0.5);
            bub.outOfBoundsKill = true;

            var rng = this.ringGrp.create(0, 0, 'spritesheet', null, false);
            rng.animations.frameName = 'clouds0000';
            rng.ammo = 'Ring';
            rng.anchor.setTo(0.5, 0.5);
            rng.outOfBoundsKill = true;
        };

        // Fugu fish group setup.
        j = 2;
        var spaceX = 100;
        var spaceY = 70;
        this.fuguGrp = this.game.add.group();
        this.fuguGrp.dead = false;
        this.fuguGrp.see = true;
        this.fuguGrp.sheld = false;
        var fugutrk = 0;
        for (var posY = 0; posY < 3; posY++) {
            for (var posX = j; posX < 5 - j; posX++) {
                var fu = this.fuguGrp.create(posX * spaceX + 300, posY * spaceY + 550, 'spritesheet', null, false);
                fu.fX = Object.create(fXshared);
                k = this.rand(true, 8, 5);
                fu.animations.add('dead', Phaser.Animation.generateFrameNames('fugusmall', 2, 4, '', 4));
                fu.animations.add('swim', Phaser.Animation.generateFrameNames('fugusmall', 0, 3, '', 4), k, true);
                fu.animations.add('still', Phaser.Animation.generateFrameNames('fugusmall', 2, 3, '', 4), k, true);
                fu.sheld = this.game.add.sprite(0, 0, 'spritesheet');
                fu.sheld.animations.frameName = 'clouds0005';
                fu.sheld.scale.setTo(1.5, 1.5);
                k = this.rand(false, 1.2, 0.8);
                fu.scale.setTo(k, k);
                fu.sheld.kill();
                fu.trk = fugutrk;
                fu.dead = false;
                fu.unq = 'fugu';
                fu.restX = fu.x;
                fu.restY = fu.y;
                fu.anchor.setTo(0.5, 0.5);
                fu.sheld.anchor.setTo(0.5, 0.5);
                fu.body.gravity.y = 0;
                fu.body.immovable = true;
                fu.body.setRectangle(90, 60, 11, 25);
                //fugutrk === 8 ? this.makeFugu(fu) : null;
                fugutrk++;
            };
            j--
        };
        // Main fish setup.
        this.fish = this.game.add.sprite(512, 400, 'spritesheet');
        this.fish.animations.add('swim', Phaser.Animation.generateFrameNames('fish', 1, 3, '', 4), 8, true);
        this.fish.animations.add('still', Phaser.Animation.generateFrameNames('fish', 0, 1, '', 4), 5, true);
        this.fish.body.setRectangle(120, 80, 30, 50);
        this.fish.anchor.setTo(0.5, 0.5);
        //this.fish.body.gravity.y = 0;
        this.fish.body.immovable = true;
        this.fish.fX = Object.create(fXshared);
        this.fish.EmFx = new Emitte(this);
        this.fish.EmFx.aEm[3].setSize(s.width, s.height);
        this.fish.EmFx.aEm[4].setSize(50, 60);
        this.fish.EmFx.aEm[5].setSize(50, 60);
        this.fish.EmFx.aEm[8].setSize(150, 150);
        this.fish.EmFx.aEm[9].setSize(150, 150);
        this.fish.bones = this.game.add.sprite(500, 400, 'spritesheet');
        this.fish.bones.animations.frameName = 'fish0004';
        this.fish.bones.anchor.setTo(0.5, 0.5);
        this.fish.bones.kill();
        this.fish.dead = false;
        this.fish.see = true;
        this.fish.tmr = 0;
        this.fish.unq = 'fish';

        // Setup foe speed and group.
        this.foeGrp = this.game.add.group();
        this.foeGrp.bigbub = false;
        this.foeGrp.see = true;
        this.inkGrp = this.game.add.group();
        this.eggGrp = this.game.add.group();
        for (var i = 0; i < this.aFoeItms.length; i++) {
            var f = this.foeGrp.create(0, 0, 'spritesheet', null, false);
            f.animations.add('swim', Phaser.Animation.generateFrameNames(this.aFoeItms[i][0], 0, this.aFoeItms[i][4], '', 4), 8 - i, true);
            // Classes
            f.fX = Object.create(fXshared);
            f.EmFx = new Emitte(this);
            f.EmFx.aEm[0].setSize(f.width, f.height);
            f.EmFx.aEm[1].setSize(f.width, f.height);
            f.EmFx.aEm[2].setSize(f.width, f.height);
            // Collision phisics
            f.body.bounce.setTo(0.8, 0.8);
            f.body.linearDamping = 0.1;
            f.body.minVelocity.setTo(0, 0);
            f.body.velocity.setTo(this.rand(true, 50, 10), this.rand(true, 50, 10));
            f.body.setRectangle(100, 100, 0, 0);
            f.anchor.setTo(.5, .5);
            // Eyes props
            i === 0 ? f.mfly = true : f.mfly = false;
            // octo destroys meds and eggs
            if (i === 1) {
                f.octo = true;
                f.octon = true;
                f.octoray = this.game.add.sprite(0, 0, 'spritesheet');
                f.octoray.animations.frameName = 'raygrn0000';
                f.octoray.anchor.setTo(0, .5);
                f.octoray.kill();
            } else {
                f.octo = false;
            };
            // Electric shock
            if (i === 2) {
                f.elcshk = true;
                f.elec = this.game.add.sprite(0, 0, 'spritesheet');
                f.elec.animations.add('shock', Phaser.Animation.generateFrameNames('elecbub', 0, 3, '', 4), 15, false);
                f.elec.anchor.setTo(0, .5);
                f.elec.kill();
            } else {
                f.elcshk = false;
            };
            // Eye goes for the eggs.
            i === 3 ? (f.eye = true, f.eyeon = true) : f.eye = false;
            // Blob props
            i === 4 ? (f.cld = true, f.cldalph = false) : f.cld = false;
            // Squid props
            if (i === 5) {
                f.squid = true;
                f.actv = false;
                f.body.setRectangle(180, 80, 0, 0);

                for (var j = 0; j < 9; j++) {
                    var ic = this.inkGrp.create(0, 0, 'spritesheet', null, false);
                    ic.animations.frameName = 'clouds0002';
                    ic.anchor.setTo(.5, .5);
                    ic.scale.setTo(0, 0);
                    ic.pos = f;

                    r = this.rand(true, 610, 438);
                    k = this.rand(true, 450, 350);
                    ic.txy = this.game.add.tween(ic).to({
                        x: r,
                        y: k
                    }, 250, Phaser.Easing.Sinusoidal.Out, false, j * 25);
                    k = this.rand(true, 5, 1);
                    ic.tscl = this.game.add.tween(ic.scale).to({
                        x: k,
                        y: k
                    }, 2000, Phaser.Easing.Sinusoidal.Out, false, j * 50);
                    ic.tfade = this.game.add.tween(ic).to({
                        alpha: 0
                    }, 3000, Phaser.Easing.Sinusoidal.Out, false, j * 175);
                };
            } else {
                f.squid = false;
            };
            // Star props
            if (i === 6) {
                f.star = this.game.add.sprite(0, 0, 'spritesheet');
                f.star.animations.frameName = 'fugusmall0004';
                f.star.body.setRectangle(90, 60, 0, 0);
                f.star.anchor.setTo(.5, .5);
                f.staractv = true;
                f.startmr = true;
                f.star.kill();
            } else {
                f.staractv = false;
            };
            // Egg props
            f.egg = this.eggGrp.create(0, 0, 'spritesheet', null, false);
            f.egg.animations.frameName = 'egg0000';
            f.egg.tmr = this.game.time.create(false);
            f.egg.body.bounce.setTo(0.8, 0.8);
            f.egg.body.linearDamping = 0.1;
            f.egg.body.minVelocity.setTo(0, 0);
            f.egg.body.velocity.setTo(this.rand(true, 50, 10), this.rand(true, 50, 10));
            f.egg.body.setRectangle(50, 50, 0, 0);
            f.egg.anchor.setTo(.5, .5);
            f.egg.hitcnt = 0;
            f.egg.num = i;
            f.eggbg = this.game.add.sprite(0, 0, 'spritesheet');
            f.eggbg.animations.frameName = 'clouds0003';
            f.eggbg.anchor.setTo(.5, .5);
            f.eggbg.kill();
            // Big bubble
            f.bigbub = this.game.add.sprite(0, 0, 'spritesheet');
            f.bigbub.animations.frameName = 'elecbub0004';
            f.bigbub.anchor.setTo(.5, .5);
            f.anchor.setTo(.5, .5);
            f.bubactv = false;
            f.bigbub.kill();
            // Various shared
            f.spd = this.aFoeItms[i][1];
            f.respd = f.spd;
            f.stam = this.aFoeItms[i][2];
            f.stuntmr = this.aFoeItms[i][3];
            f.stun = false;
            f.movto = this.fish;
            f.dead = i;
            f.unq = 'foe';
            this.aFoeDead.push(i);
            // Health bar
            f.navGrp = this.game.add.group();
            f.navGrp.bg = f.navGrp.create(0, 0, 'spritesheet', null, false);
            f.navGrp.bg.animations.frameName = 'foebgbar0000';
            f.navGrp.bar = f.navGrp.create(5, 2, 'spritesheet', null, false);
            f.navGrp.bar.animations.frameName = 'foebar0000';
        };

        // Create non repeating numbers for pill fx.
        for (var i = 0; i < 5; i++) {
            this.aFxr.push(i);
        };

        // Set up  groups for bottom tank garbage scroll.
        this.garbGrp1 = this.game.add.group();
        this.garbGrp2 = this.game.add.group();
        this.garbGrp1.y = 918;
        this.garbGrp2.y = 918;
        for (var i = 0; i < 15; i++) {
            var garb1 = this.garbGrp1.create(73 * i, 50, 'spritesheet');
            garb1.animations.frameName = 'barrel000' + this.rand(true, 2, 0);
            var garb2 = this.garbGrp2.create(73 * i, 50, 'spritesheet');
            garb2.animations.frameName = 'barrel000' + this.rand(true, 2, 0);
            garb1.anchor.setTo(.5, .5);
            garb2.anchor.setTo(.5, .5);
            garb1.rotation = this.rand(true, 360, -360);
            garb2.rotation = this.rand(true, 360, -360);
        };
        var b1 = this.garbGrp1.create(0, 25, 'spritesheet');
        b1.animations.frameName = 'grad0000';
        var b2 = this.garbGrp1.create(0, 25, 'spritesheet');
        b2.animations.frameName = 'grad0000';
        b1.width = 1024;
        b2.width = 1024;
        this.garbGrp2.x = 1024;

        // Player health setup.
        this.navGrp = this.game.add.group();
        this.navGrp.bg = this.navGrp.create(0, 0, 'spritesheet');
        this.navGrp.bg.frameName = 'efctbg0000';
        this.navGrp.bgbar = this.navGrp.create(10, 71, 'spritesheet');
        this.navGrp.bgbar.animations.frameName = 'efctbgbar0000';
        this.navGrp.bar = this.navGrp.create(15, 71, 'spritesheet');
        this.navGrp.bar.animations.frameName = 'efctbar0000';
        this.navGrp.x = 256;
        this.navGrp.y = 10;

        this.navIcnGrp = this.game.add.group();
        for (var i = 0; i < this.aNavIcn.length; i++) {
            var X = i === 0 ? X = 0 : X = 71 * i;
            var navicn = this.navIcnGrp.create(X, 0, 'spritesheet');
            navicn.animations.frameName = this.aNavIcn[i] + '0000';
        };
        this.navGrp.add(this.navIcnGrp);
        this.navIcnGrp.x = 15;
        this.navIcnGrp.y = 5;
        j = 2;
        var X = 30;
        var Y = 30;
        this.navFuguGrp = this.game.add.group();
        for (var posY = 0; posY < 3; posY++) {
            for (var posX = j; posX < 5 - j; posX++) {
                var babynav = this.navFuguGrp.create(posX * X, posY * Y, 'spritesheet');
                babynav.animations.frameName = 'efct60000';
            };
            j--
        };
        this.navGrp.add(this.navFuguGrp);
        this.navFuguGrp.x = 360;
        this.navFuguGrp.y = 10;

        // Background gradient.
        this.bggradGrp = this.game.add.group();
        for (var i = 0; i < 4; i++) {
            var X = i === 0 || i === 2 ? X = 0 : i === 1 || i === 3 ? X = 1024 : null;
            var Y = i > 1 ? Y = 768 : Y = 0;
            var b = this.bggradGrp.create(X, Y, 'spritesheet');
            b.animations.frameName = 'blackgrad0000';
            i === 1 ? b.scale.x = -1 : i === 2 ? b.scale.y = -1 : i === 3 ? (b.scale.x = -1, b.scale.y = -1) : null;

        };

        // Various element init.
        this.game.camera.bounds = null;

        // keys on-down etc.
        this.keyboard = this.input.keyboard;
        this.cursors = this.keyboard.createCursorKeys();
        this.keyboard.addCallbacks(this, this.onDown, this.onUp);
        this.bubbleBtn = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: function () {
        if (!this.fish.dead) {
            if (this.cursors.left.isDown || this.cursors.right.isDown) {
                this.fishCntl(1, this.fish);
                this.fuguCntl(1);
                this.bgX();
            };
            if (this.cursors.up.isDown || this.cursors.down.isDown) {
                this.fishCntl(1, this.fish);
                this.fuguCntl(1);
                this.bgY();
            };
            if (this.bubbleBtn.isDown) {
                this.fireAmmo(this.ammoType);
                this.bubbleHit();
            };
            if (this.keyboard.justReleased(Phaser.Keyboard.SPACEBAR, 2000)) {
                this.bubbleHit();
            };
        };
        //  Start foe group updates.
        if (this.foeGrp.countLiving() > 0) {
            this.foeGrp.forEachAlive(function (f) {
                if (!f.stun && this.foeGrp.see) {
                    this.game.physics.moveToObject(f, f.movto, false, f.spd);
                } else if (this.foeGrp.see) {
                    this.game.physics.moveToXY(f, f.randx, f.randy, false, f.spd * 1.2);
                } else {
                    this.game.physics.moveToXY(f, f.randx, f.randy, false, f.spd * 3);
                };

                f.navGrp.x = f.x - f.navGrp.bg.width / 2;
                f.navGrp.y = f.y - 80;

                if (this.foeGrp.bigbub) {
                    f.bigbub.x = f.x;
                    f.bigbub.y = f.y;
                };
                // Eye on the eggs.
                if (f.eye) {
                    if (this.eggGrp.countLiving() > 0) {
                        f.movto = this.eggGrp.getFirstAlive();
                        if (this.game.physics.overlap(f, f.movto)) {
                            f.fX.cloud(this, 'clouds0004', f.movto, 0.5, 5);
                            this.fish.EmFx.Start(9, f.movto, 5000, 5);
                            this.smashEgg(null, f.movto);
                            f.movto = this.fish;
                            var egg = this.game.add.tween(this.fish.EmFx.aEm[9]).to({
                                alpha: 0.1
                            }, 5000, Phaser.Easing.Linear.None, true);
                            egg.onComplete.add(function () {
                                this.fish.EmFx.aEm[9].alpha = 1;
                            }, this);
                        };
                    };
                };
                // Foe that destroy meds.
                if (f.octo) {
                    if (this.game.physics.distanceBetween(f, this.sinkGrp.getAt(3)) < 400) {
                        if (f.octon) {
                            f.octon = false;
                            f.octoray.reset(f.x, f.y);
                            var odb;
                            this.game.time.events.add(1500, function () {
                                this.fish.EmFx.Start(10, this.sinkGrp.getAt(3), 5000, 12);
                                f.fX.cloud(this, 'clouds0004', this.sinkGrp.getAt(3), 0.5, 5);
                                f.octon = true;
                                this.reSink(this.sinkGrp.getAt(3));
                                f.octoray.kill();
                            }, this);
                        };
                    };
                    if (f.octoray.alive) {
                        odb = this.game.physics.distanceBetween(f, this.sinkGrp.getAt(3));
                        f.octoray.scale.setTo(odb / 200, 1);
                        f.octoray.x = f.x;
                        f.octoray.y = f.y;
                        f.octoray.rotation = this.game.physics.angleBetween(f, this.sinkGrp.getAt(3));
                    };

                };
                // Foe fish impact effects.
                if (this.foeGrp.see) {
                    if (f.mfly) {
                        if (f.x > 400 && f.x < 600 && f.y > 0 && f.y < 300) {
                            f.mfly = false;
                            this.fish.EmFx.Start(6, f, 5000, 12);
                            this.game.time.events.add(5000, function () {
                                f.mfly = true;
                            }, this);
                        };
                    } else if (f.cld) {
                        if (!f.cldalph && f.navGrp.bar.width > 15 && this.game.physics.distanceBetween(f, this.fish) < 250) {
                            f.cldalph = true;

                            this.fish.EmFx.Start(8, this.fish, 5000, 5);
                            this.fish.EmFx.Start(9, this.fish, 5000, 5);
                            var cld = this.game.add.tween(this.fish.EmFx.aEm[9]).to({
                                alpha: 0.1
                            }, 5000, Phaser.Easing.Linear.None, true);
                            cld.onComplete.add(function () {
                                f.cldalph = false;
                                this.fish.EmFx.aEm[9].alpha = 1;
                            }, this);
                        };
                    } else if (f.squid) {
                        f.rotation = this.game.physics.angleBetween(f, this.fish);
                        if (this.game.physics.distanceBetween(f, this.fish) < 250) {
                            if (!f.actv) {
                                f.actv = true;
                                this.inkGrp.actv = true;
                                this.squid(f);
                            };
                        };
                    } else if (f.elcshk) {
                        if (this.game.physics.distanceBetween(f, this.fish) < 250) {
                            f.elcshk = false;
                            var edb = this.game.physics.distanceBetween(f, this.fish);
                            f.elec.reset(f.x, f.y);
                            f.elec.animations.play('shock');
                            f.elec.scale.setTo(edb / 300, edb / 300)
                            f.elec.rotation = this.game.physics.angleBetween(f, this.fish);
                            this.fish.bones.reset(this.fish.x, this.fish.y);
                            this.fish.bones.scale.x = this.fish.scale.x;
                            this.fish.bones.angle = this.fish.angle;
                            this.fish.bones.alpha = 0.5
                            this.fish.alpha = 0.1;
                            f.stun ? null : this.stunFoe(2000, f);
                            this.fishFoe(this.fish, f, -10);
                            this.game.time.events.add(100, function () {
                                f.elcshk = true;
                                this.fish.alpha = 1;
                                this.fish.bones.kill();
                                f.elec.kill();
                            }, this);
                        };
                    } else if (f.staractv) {
                        if (f.startmr && f.navGrp.bar.width > 15) {
                            f.startmr ? this.game.time.events.add(this.rand(true, 1000, 3000), function () {
                                f.startmr = true;
                                f.star.reset(f.x, f.y);
                                var r = this.rand(false, 1, 0.8);
                                f.star.scale.setTo(r, r);
                                this.game.physics.moveToObject(f.star, this.fish, 500);
                            }, this) : null;
                            f.startmr = false;
                        } else if (!f.startmr) {
                            this.game.physics.overlap(this.ammoType, f.star, this.starBubble, null, this);
                            if (this.game.physics.overlap(f.star, this.fish)) {
                                f.fX.cloud(this, 'clouds0004', f.star, 0.3, 3);
                                f.EmFx.Start(8, f.star, 3000, 1);
                                f.star.kill();
                                this.fishFoe(f, null, -15);
                            }
                            f.star.angle += 5;
                            f.star.x < 0 || f.star.x > 1024 || f.star.y < 0 || f.star > 768 ? f.star.kill() : null;
                        };
                        f.angle++;
                    };
                };
            }, this);
            // Fish foe overlap.
            this.fish.see ? this.game.physics.overlap(this.foeGrp, this.fish, this.fishFoe, null, this) : null;
            // Fugu foe overlap.
            this.fuguGrp.see || this.fuguGrp.sheld ? this.game.physics.overlap(this.foeGrp, this.fuguGrp, this.foeFugu, null, this) : null;
        };
        // Detect overlap with emitter items and fish.
        this.game.physics.overlap(this.fish.EmFx.aEm[3], this.fish, this.fishPill, null, this);
        this.game.physics.overlap(this.fish.EmFx.aEm[4], this.fish, this.fishEgg, null, this);
        this.game.physics.overlap(this.fish.EmFx.aEm[5], this.fish, this.fishEgg, null, this);
        this.game.physics.overlap(this.fish.EmFx.aEm[6], this.fish, this.fishMfly, null, this);
        this.game.physics.overlap(this.fish.EmFx.aEm[7], this.fish, this.fishEgg, null, this);
        this.game.physics.overlap(this.fish.EmFx.aEm[9], this.fish, this.fishGrn, null, this);
        this.game.physics.overlap(this.fish.EmFx.aEm[10], this.fish, this.grnPill, null, this);
        // Fugu sheld follow and rotate.
        this.fuguGrp.forEachAlive(function (fu) {
            if (fu.sheld.alive) {
                fu.sheld.x = fu.x;
                fu.sheld.y = fu.y;
                fu.sheld.rotation++;
            };
        }, this);
    },
    quitGame: function () {
        /* this.bg.destroy();
        this.fish.destroy();
        for(var i = 0; i < this.aWeedGrp.length; i++)
        {
            this.aWeedGrp[i].destroy();
        };
        for(var i = 0; i < this.aHookGrp.length; i++)
        {
            this.aHookGrp[i].destroy();
        };
        this.sinkGrp.destroy();
        this.bubbleGrp.destroy();
        this.fuguGrp.destroy();
        this.garbGrp1.destroy(); 
        this.garbGrp2.destroy(); 
        this.ringGrp.destroy();
        this.rayGrp.destroy();
        this.navGrp.destroy();
        this.bggradGrp.destroy();
        this.foeGrp.destroy();
        this.inkGrp.destroy();
        this.eggGrp.destroy();*/

        this.game.state.start('MainMenu');
    },
    //Fugu mum end scene.
    endScene: function () {
        var bigfugu = this.game.add.sprite(-500, -400, 'spritesheet');
        bigfugu.animations.add('swim', Phaser.Animation.generateFrameNames('fugu', 0, 1, '', 4), 5, true);
        bigfugu.animations.play('swim');
        bigfugu.anchor.setTo(0.5, 0.5);
        bigfugu.angle = 30;

        this.game.add.tween(bigfugu).to({
            x: 280,
            y: 282,
            angle: 11
        }, 3000, Phaser.Easing.Exponential.Out, true, 0)
            .to({
                x: 1300,
                y: 0,
                angle: -30
            }, 3000, Phaser.Easing.Exponential.InOut, true, 6000);

        this.game.time.events.add(3000, function () {
            this.game.time.events.add(10000, function () {
                this.quitGame();
                bigfugu.destroy();
            }, this);

            this.fuguGrp.forEachAlive(function (fu) {
                fu.scale.x = -1;
                fu.angle = 0;
                fu.alpha = 1;
                fu.twn.stop();
                fu.sheld.kill();

                var fuY = this.rand(true, 500, 250);
                var fuX = this.rand(true, 1000, 700);
                var fuT = this.rand(true, 3000, 1500);

                this.game.add.tween(fu).to({
                    x: fuX,
                    y: fuY
                }, fuT, Phaser.Easing.Linear.None, true, 0)
                    .to({
                        x: 400,
                        y: 310
                    }, fuT, Phaser.Easing.Linear.None);

                var bigger = this.game.add.tween(fu).to({
                    alpha: 0
                }, 10, Phaser.Easing.Linear.None, true, fuT * 2);
                bigger.onComplete.add(function () {
                    bigfugu.scale.x += 0.05;
                    bigfugu.scale.y += 0.05;
                }, this);

                this.game.add.tween(fu.scale).to({
                    x: 1
                }, 350, Phaser.Easing.Linear.None, true, fuT);
            }, this);

        }, this);
    },
    // Reposition foes, fugu, bubbleEmmiter, pillEmmiter, barrels, hooks, weed and floor .x.
    bgX: function () {
        // KEY RIGHT IS DOWN.
        if (this.cursors.right.isDown) { // Move light rays.
            this.rayGrp.x > -200 ? this.rayGrp.x -= this.bgSpd : (this.rayGrp.x = 1200, this.lightRays());

            // Move group items and emitter items.
            this.emMove(this.foeGrp, 0, true, false, true, true);
            this.emMove(this.sinkGrp, 1, true, false, true, true);

            // Move alive fugu items x right.
            this.fuguGrp.forEachAlive(function (fu) {
                if (fu.x > this.rand(true, 400, 300) || fu.dead) {
                    fu.x -= this.bgSpd;
                } else if (!this.game.tweens.isTweening(fu) && !fu.dead) {
                    fu.twn.start();
                };
            }, this);
            // Hook groups right.
            for (var i = 0; i < this.aHookGrp.length; i++) {
                this.aHookGrp[i].x -= this.bgSpd;
                this.aHookGrp[i].hook.x -= this.bgSpd;
                if (this.aHookGrp[i].x < -250) {
                    this.newHooks(this.aHookGrp[i], this.rand(true, this.aHookGrp[i].min + 1024, this.aHookGrp[i].max + 1024), this.rand(true, 600, 400));
                };
            };
            // Weed groups right.
            for (var i = 0; i < this.aWeedGrp.length; i++) {
                this.aWeedGrp[i].x -= i < 1 ? 1 : this.bgSpd / i;
                if (this.aWeedGrp[i].x < -150) {
                    this.aWeedGrp[i].x = this.rand(true, 1300, 1024);
                    this.aWeedGrp[i].angle = this.rand(true, 3, -3);
                };
            };
            // Move bottom barrels.
            if (this.bg.height < 918) {
                if (this.garbGrp1.x <= 0 && this.garbGrp2.x <= 0) {
                    this.garbGrp1.x = 1062;
                } else if (this.garbGrp1.x >= 0 && this.garbGrp2.x <= -1022) {
                    this.garbGrp2.x = 1062;
                };
                this.garbGrp1.x -= this.bgSpd;
                this.garbGrp2.x -= this.bgSpd;
            };
        } // KEY LEFT IS DOWN.
        else if (this.cursors.left.isDown) { //Move light rays
            this.rayGrp.x < 1200 ? this.rayGrp.x += this.bgSpd : (this.rayGrp.x = -150, this.lightRays());

            // Move group items and emitter items.
            this.emMove(this.foeGrp, 0, true, true, false, true);
            this.emMove(this.sinkGrp, 1, true, true, false, true);

            // Move fugu.
            this.fuguGrp.forEachAlive(function (fu) {
                if (fu.x < this.rand(true, 800, 600) || fu.dead) {
                    fu.x += this.bgSpd;
                } else if (!this.game.tweens.isTweening(fu) && !fu.dead) {
                    fu.twn.start();
                };
            }, this);
            // Hook groups left.
            for (var i = 0; i < this.aHookGrp.length; i++) {
                this.aHookGrp[i].x += this.bgSpd;
                this.aHookGrp[i].hook.x += this.bgSpd;
                if (this.aHookGrp[i].x > 1250) {
                    this.newHooks(this.aHookGrp[i], this.rand(true, this.aHookGrp[i].min - 1024, this.aHookGrp[i].max - 1024), this.rand(true, 600, 400));
                };
            };
            // Weed groups left.
            for (var i = 0; i < this.aWeedGrp.length; i++) {
                this.aWeedGrp[i].x += i < 1 ? 1 : this.bgSpd / i;
                if (this.aWeedGrp[i].x > 1124) {
                    this.aWeedGrp[i].x = this.rand(true, -250, -50);
                    this.aWeedGrp[i].angle = this.rand(true, 3, -3);
                };
            };
            // Move bottom barrels.
            if (this.bg.height < 918) {
                if (this.garbGrp1.x <= 1022 && this.garbGrp2.x >= 1022) {
                    this.garbGrp2.x = -1062;
                } else if (this.garbGrp1.x >= 1022 && this.garbGrp2.x <= 1022) {
                    this.garbGrp1.x = -1062;
                };
                this.garbGrp1.x += this.bgSpd;
                this.garbGrp2.x += this.bgSpd;
            };
        };
    },
    // Scale bg image, move weed groups on .y, move and set bottom garbage img in accordance.
    bgY: function () {
        //KEY IS UP, BG STOPS AT 2000.
        if (this.cursors.up.isDown && this.bg.height < 2000) {
            this.bg.height += this.bgSpd;
            this.rayGrp.y += this.bgSpd;

            // Move group and emitter items.
            this.emMove(this.foeGrp, 0, false, true, false, false);
            this.emMove(this.sinkGrp, 1, false, true, false, false);

            // Move alive fugu items y position 2000.
            this.fuguGrp.forEachAlive(function (fu) {
                if (fu.y < this.rand(true, 600, 568) && !fu.dead) {
                    fu.y += this.bgSpd;
                } else if (!this.game.tweens.isTweening(fu) && !fu.dead) {
                    fu.twn.start();
                };
            }, this);

            // Move weedGrps items y position 2000.
            for (var i = 0; i < this.aWeedGrp.length; i++) {
                this.aWeedGrp[i].y += this.bgSpd;
            };

            // Move hookGrps y position 2000.
            for (var i = 0; i < this.aHookGrp.length; i++) {
                if (!this.game.tweens.isTweening(this.aHookGrp[i])) {
                    this.hookGrp.depth += this.bgSpd;
                    this.aHookGrp[i].height += this.bgSpd;
                    this.aHookGrp[i].hook.y = this.aHookGrp[i].height;
                };
            };

            //  Move floor groups y position.
            if (this.bg.height >= 768 && this.bg.height <= 918) {
                this.garbGrp1.y = this.bg.height - 100;
                this.garbGrp2.y = this.bg.height - 100;
            };
        }
        // KEY IS DOWN, BG STOPS AT 768.
        else if (this.cursors.down.isDown && this.bg.height > 768) {
            this.bg.height -= this.bgSpd;
            this.rayGrp.y -= this.bgSpd;

            // Move group and emitter items.
            this.emMove(this.foeGrp, 0, false, false, true, false);
            this.emMove(this.sinkGrp, 1, false, false, true, false);

            // Move alive fugu items y position 768.
            this.fuguGrp.forEachAlive(function (fu) {
                if (fu.y > this.rand(true, 300, 200) && !fu.dead) {
                    fu.y -= this.bgSpd;
                } else if (!this.game.tweens.isTweening(fu) && !fu.dead) {
                    fu.twn.start();
                };
            }, this);


            // Move weedGrp items y position 768.
            for (var i = 0; i < this.aWeedGrp.length; i++) {
                this.aWeedGrp[i].y -= this.bgSpd;
            };

            // Move hook groups y position 768.
            for (var i = 0; i < this.aHookGrp.length; i++) {
                if (!this.game.tweens.isTweening(this.aHookGrp[i])) {
                    this.hookGrp.depth -= this.bgSpd;
                    this.aHookGrp[i].height -= this.bgSpd;
                    this.aHookGrp[i].hook.y = this.aHookGrp[i].height;
                }
            };
            //  Move floor groups y position.
            if (this.bg.height <= 918 && this.bg.height >= 768) {
                this.garbGrp1.y = this.bg.height - 100;
                this.garbGrp2.y = this.bg.height - 100;
            };
        };
    },
    // Move foe, sink and all emitter items.
    emMove: function (grp, itm, xy, dirXY, tf, ft) {
        grp.forEach(function (z) { // Move foe and barrels.
            if (z.alive) {
                if (xy) {
                    dirXY ? z.x += this.bgSpd : z.x -= this.bgSpd;
                } else {
                    dirXY ? z.y += this.bgSpd : z.y -= this.bgSpd;
                };
            };
            // Move eggs, background and starfish.
            if (itm === 0 && xy) {
                if (z.egg.alive) {
                    dirXY ? z.egg.x += this.bgSpd : z.egg.x -= this.bgSpd;
                    z.eggbg.x = z.egg.x;
                };
                if (z.staractv) {
                    dirXY ? z.star.x += this.bgSpd : z.star.x -= this.bgSpd;
                };
            } else if (itm === 0) {
                if (z.egg.alive) {
                    dirXY ? z.egg.y += this.bgSpd : z.egg.y -= this.bgSpd;
                    z.eggbg.y = z.egg.y;
                };
                if (z.staractv) {
                    dirXY ? z.star.y += this.bgSpd : z.star.y -= this.bgSpd;
                };
            };
            // Move emitters without overlap, on foe and sink items.
            z.EmFx.Move(0, tf, ft);
            z.EmFx.Move(1, tf, ft);
            itm === 0 ? z.EmFx.Move(2, tf, ft) : null;
            // If sink items move out of range.
            itm === 1 && z.x < 1300 || z.x > -200 ? null : this.reSink(z);
            itm === 0 && z.egg.alive ? this.game.physics.collide(this.fish, this.eggGrp) : null;
        }, this);
        // Less used emitters with overlap attached to this.fish.
        itm === 1 ? this.fish.EmFx.Move(3, tf, ft) : null;
        itm === 0 ? this.fish.EmFx.Move(4, tf, ft) : null;
        itm === 0 ? this.fish.EmFx.Move(5, tf, ft) : null;
        itm === 0 ? this.fish.EmFx.Move(6, tf, ft) : null;
        itm === 0 ? this.fish.EmFx.Move(7, tf, ft) : null;
        itm === 0 ? this.fish.EmFx.Move(8, tf, ft) : null;
        itm === 0 ? this.fish.EmFx.Move(9, tf, ft) : null;
        itm === 0 ? this.fish.EmFx.Move(10, tf, ft) : null;
        // Sink items collide with fish.
        this.game.physics.collide(this.sinkGrp, this.foeGrp);
        this.game.physics.collide(this.fish, this.sinkGrp);
    },
    // Move and reset light rays.
    lightRays: function () {
        this.rayGrp.angle = this.rand(true, 20, -20);
        this.rayGrp.alpha = this.rand(false, 1, 0.3);
        this.rayGrp.forEach(function (ray) {
            ray.x = this.rand(true, 50, 25);
            ray.y = this.rand(true, -1, -500);
            ray.scale.x = this.rand(false, 1.5, 0.5);
            ray.alpha = this.rand(false, 0.7, 0.2);
            this.game.add.tween(ray).to({
                angle: this.rand(true, 3, -3)
            }, this.rand(true, 5000, 2000), Phaser.Easing.Sinusoidal.InOut, true, null, 50);
        }, this);
    },
    // Create new line and hook.
    newHooks: function (line, randX, randY) {
        !line.hook.alive ? line.hook.revive() : line.hook.once = true;
        this.bg.height < 900 ? randY = randY - 50 : null;
        line.height = randY;
        line.hook.y = line.height;
        line.x = randX;
        line.hook.x = randX;
    },
    // Fish, fugu, foe swim too close to hook.
    hooked: function (f, h) {
        if (h.once) {
            h.once = false;
            if (f.unq === 'fugu') {
                f.dead = true;
                f.twn.stop();
                f.scale.x > 0 ? f.angle = 90 : f.angle = -90;
                f.x = h.x;
                f.y += 15;
                f.fX.hooked(this, f);
                f.fX.cloud(this, 'clouds0000', h, 0.5, 5);
                f.fX.dead(this, 868, f.x, 360, 'fugusmall0005', null, false, 3000);
                this.navFuguGrp.getAt(f.trk).animations.frameName = 'efct60000';
            } else if (f.unq === 'fish') {
                f.scale.x > 0 ? f.angle = 90 : f.angle = -90;
                f.x = h.x;
                f.y += 50;
                f.fX.hooked(this, f);
                f.fX.cloud(this, 'clouds0000', h, 0.5, 5);
                f.fX.dead(this, 968, f.x, 360, 'fish0004', null, true, 3000);
            } else if (f.unq === 'foe') {
                f.spd = 0;
                f.x = h.x;
                f.y = h.y + 50;
                f.fX.hooked(this, f);
                f.fX.cloud(this, 'clouds0000', h, 0.5, 5);
                f.EmFx.Start(0, f, 3000, 10);
                this.game.time.events.add(5000, function () {
                    f.spd = f.respd;
                    this.health(f, -20, 70)
                    f.navGrp.bar.width < 10 ? this.killFoe(f, false, false) : null;
                }, this);
            };
            this.aHookGrp[h.num].up.start();
            h.fX.hooked(this, h);
        };
    },
    // Resink barrels if babys not all alive.
    reSink: function (item) {
        item.kill();
        if (this.sinkGrp.actv) {
            item.hitcnt = 0;
            item.key === 'pillcont' ? item.reset(this.rand(true, 950, 50), -600) : item.reset(this.rand(true, 950, 50), -100);

            item.key === 'pillcont' ? item.body.gravity.y = this.rand(true, 10, 5) : item.body.gravity.y = this.rand(true, 40, 10);

            if (!this.game.tweens.isTweening(item)) {
                this.game.add.tween(item).to({
                    angle: this.rand(true, 360, -360)
                }, this.rand(true, 8000, 5000), Phaser.Easing.Exponential.InOut, true, 0, 10, true);
            };
        };
    },
    // Move fugu fish x, y scale and rotation.
    fuguCntl: function (onoff) {
        this.fuguGrp.forEachAlive(function (b) {
            this.fishCntl(onoff, b);
        }, this);
    },
    // Move fish x, y scale and rotation.
    fishCntl: function (pressed, f) {
        if (pressed) {
            !f.dead ? f.animations.play('swim') : null;
            this.cursors.up.isDown && f.body.rotation < 60 && f.scale.x === 1 ? f.body.rotation += 5 : null;
            this.cursors.up.isDown && f.body.rotation > -60 && f.scale.x === -1 ? f.body.rotation -= 5 : null;

            this.cursors.down.isDown && f.body.rotation > -60 && f.scale.x === 1 ? f.body.rotation -= 5 : null;
            this.cursors.down.isDown && f.body.rotation < 60 && f.scale.x === -1 ? f.body.rotation += 5 : null;

            if (!this.cursors.down.isDown && !this.cursors.up.isDown) {
                if (this.cursors.left.isDown && f.scale.x === 1) {
                    f.body.rotation < 0 ? f.body.rotation += 5 : null;
                    f.body.rotation > 0 ? f.body.rotation -= 5 : null;
                } else if (this.cursors.right.isDown && f.scale.x === -1) {
                    f.body.rotation > 0 ? f.body.rotation -= 5 : null;
                    f.body.rotation < 0 ? f.body.rotation += 5 : null;
                };
            };
            // 0.2 ???? dont change needs testing.
            this.cursors.left.isDown && f.scale.x === -1 ? f.scale.x = 1 : null;
            this.cursors.right.isDown && f.scale.x === 1 ? f.scale.x = -1 : null;
        } else {
            !f.dead ? f.animations.play('still') : null;
            f.scale.x >= 0 ? f.scale.x = 1 : f.scale.x <= 0 ? f.scale.x = -1 : null;
        };
    },
    // Anykey press trigger hooks on fish, fugu and foe. Foe fugu overlap.
    onDown: function () {
        if (!this.fish.dead) {
            this.fish.see ? this.game.physics.overlap(this.fish, this.hookGrp, this.hooked, null, this) : null;
            this.fuguGrp.see ? this.game.physics.overlap(this.fuguGrp, this.hookGrp, this.hooked, null, this) : null;
            this.game.physics.overlap(this.foeGrp, this.hookGrp, this.hooked, null, this);
        };
    },
    onUp: function () {
        this.fishCntl(false, this.fish);
        this.fuguCntl(false);
    },
    // Setup bubbleGrp and ringGrp for fire and angle, shoot.
    fireAmmo: function (ammoTyp) {
        if (this.game.time.now > this.nextFire && ammoTyp.countDead() > 0) {
            var ammo = ammoTyp.getFirstDead();
            var fr = ammoTyp.firerate;
            this.navGrp.bar.width <= 30 ? ammoTyp.firerate = 1000 : ammoTyp.firerate;
            this.nextFire = this.game.time.now + ammoTyp.firerate;
            ammoTyp.firerate = fr;
            ammo.reset(this.fish.x, this.fish.y);
            var ammospd = this.rand(true, 800, 300);
            this.health(this, -2, 325);

            if (this.fish.scale.x === 1) {
                this.game.physics.velocityFromAngle(this.fish.angle, -ammospd, ammo.body.velocity);
                ammo.x -= 80;
                ammo.y -= this.fish.angle * 2;
            } else {
                this.game.physics.velocityFromAngle(this.fish.angle, ammospd, ammo.body.velocity);
                ammo.x += 80;
                ammo.y += this.fish.angle * 2;
            };

            if (ammo.ammo === 'Ring') {
                ammo.scale.setTo(.1, .3);
                ammo.angle = this.fish.angle;
                this.ringGrp.grow = true;
            } else {
                this.ringGrp.grow = false;
                var ammoscale = this.rand(false, 1.5, 0.5);
                ammo.scale.setTo(ammoscale, ammoscale);
            };
        };
    },
    // Do squid things, foe with a difference.
    squid: function (f) {
        this.bgSpd = 3;
        this.bubbleGrp.firerate = 800;
        this.fishFoe(this.fish, f, -10);
        this.inkGrp.forEachDead(function (ic) {
            ic.reset(ic.pos.x, ic.pos.y);
            ic.txy.start();
            ic.tscl.start();
            ic.tfade.start();

        }, this);

        this.game.time.events.add(5000, function () {
            this.bgSpd = 5;
            this.bubbleGrp.firerate = 250;
            //f.animations.play('move');
            f.actv = false;

            this.inkGrp.forEachAlive(function (ic) {
                ic.alpha = 1;
                ic.scale.setTo(0, 0);
                ic.kill();
            }, this);
        }, this);
    },
    // Shoot the barrel, reset a foe.
    makeFoe: function (x, y) {
        var deadcnt = Math.floor(Math.random() * this.aFoeDead.length - 1);
        deadcnt === -1 ? deadcnt = 0 : null;
        // Make foe providing foe array is not empty.
        if (this.aFoeDead.length > 0) {
            var foe = this.foeGrp.getAt(this.aFoeDead[deadcnt]);
            //var foe = this.foeGrp.getAt(3);
            this.aFoeDead.splice(deadcnt, 1);
            foe.reset(x, y);
            foe.navGrp.bg.reset(0, 0);
            foe.navGrp.bar.reset(5, 2);
            foe.navGrp.bar.width = 70;
            foe.animations.play('swim');
        } else {
            this.sinkGrp.actv = false;
        };
    },
    // Foe, big bubble kill control.
    killFoe: function (foe, bigbub, all) {
        // Start barrels sinking if foe array is > 0.
        if (!this.sinkGrp.actv) {
            this.sinkGrp.actv = true;
            this.sinkGrp.forEachDead(function (s) {
                this.reSink(s);
            }, this);
        };
        // Kill one foe only.
        if (!all) {
            this.aFoeDead.push(foe.dead);
            foe.animations.stop('swim');
            this.eggFuku(foe);
            foe.navGrp.bg.kill();
            foe.navGrp.bar.kill();
            foe.kill();
            foe.bubactv ? foe.bigbub.kill() : null;
        }
        // Kill foes left in big bubble after effect wares off.
        else if (bigbub) {
            this.foeGrp.forEachAlive(function (f) {
                if (f.bubactv) {
                    this.aFoeDead.push(f.dead);
                    this.health(this, 10, 325);
                    this.fish.see = true;
                    this.fuguGrp.see = true;
                    this.eggFuku(f);
                    f.EmFx.Start(1, f, 5000, 15);
                    f.EmFx.Start(2, f, 5000, 7);
                    f.bigbub.scale.setTo(1, 1);
                    f.animations.stop('swim');
                    f.bubactv = false;
                    f.spd = f.respd;
                    f.navGrp.bg.kill();
                    f.navGrp.bar.kill();
                    f.bigbub.kill();
                    f.kill();

                };
            }, this);
        }
        // Kill all foes.
        else {
            this.foeGrp.forEachAlive(function (f) {
                f.EmFx.Start(0, f, 5000, 15);
                f.EmFx.Start(2, f, 5000, 7);
                f.navGrp.bg.kill();
                f.navGrp.bar.kill();
                f.kill();
            }, this);
        };
    },
    // Foe stun timer and particulars.
    stunFoe: function (s, f) {
        f.stun = true;
        this.fish.scale.x > 0 ? f.randx = f.x - 250 : f.randx = f.x + 250;
        var r = this.rand(true, 1000, 0);
        r < 500 ? f.randy = 0 : f.randy = 1000;
        this.game.time.events.add(s, function () {
            f.stun = false;
        }, this);
    },
    // Fish and foe overlap.
    fishFoe: function (fish, f, hit) {
        _level === 0 ? hit = hit / 3 : _level === 1 ? hit = hit / 2 : null;
        hit === undefined ? hit = -1 : null;
        this.health(this, hit, 325);
        //f === null ? null : this.health(f, 1, 70);
        this.navGrp.bar.width < 5 ? fish.fX.dead(this, 968, null, 360, null, fish, true, 0) : null;
    },
    // Reset fugu unless all are alive, then you WIN!
    makeFugu: function (f) {
        if (this.fuguGrp.countLiving() < this.fuguGrp.length) {
            var fugu = this.fuguGrp.getFirstDead();
            fugu.reset(f.x, f.y);
            this.fuguGrp.sheld ? fugu.sheld.reset(fugu.x, fugu.y) : null;
            fugu.twn = this.game.add.tween(fugu);
            fugu.twn.to({
                x: fugu.restX,
                y: fugu.restY
            }, this.rand(true, 1000, 500), Phaser.Easing.Exponential.InOut, false);
            fugu.twn.start();
            fugu.animations.play('swim');
            this.navFuguGrp.getAt(fugu.trk).animations.frameName = 'efct60001';
        };
        // End it if all fugu alive.
        if (this.fuguGrp.countLiving() === this.fuguGrp.length && !this.fuguGrp.dead) {
            this.killFoe(null, false, true);
            this.fish.dead = true;
            this.sinkGrp.actv = false;
            this.fish.EmFx.Start(1, this.fish, 10000, 25)
            this.fuguGrp.forEachAlive(function (fu) {
                fu.twn.start();
            }, this);
            this.fish.scale.x = -1;
            this.fish.angle = 0;
            this.fish.alpha = 1;
            this.game.time.events.add(3000, function () {
                this.endScene();
            }, this);
        };
    },
    // Baby and foe overlap.
    foeFugu: function (f, fugu) {
        if (!fugu.dead && !fugu.sheld.alive) {
            fugu.dead = true;
            this.fuguGrp.dead = true;
            fugu.animations.play('dead', 2);
            this.navFuguGrp.getAt(fugu.trk).animations.frameName = 'efct60000';
            fugu.twn.stop();
            fugu.fX.dead(this, 868, null, 360, null, fugu, false, 0);
            this.health(f, 10, 70);
            f.fX.cloud(this, 'clouds0004', f, 0.1, 7);
            f.EmFx.Start(0, f, 2000, 5);
        } else if (fugu.sheld.alive) {
            this.health(f, -1, 70);

            if (f.navGrp.bar.width <= 5) {
                this.killFoe(f, false, false);
                f.EmFx.Start(2, f, 4000, 1);
                f.fX.cloud(this, 'clouds0004', f, 0.1, 7);
            } else {
                f.EmFx.Start(2, f, 4000, 1);
                f.EmFx.Start(0, f, 2000, 5);
            };
        };
    },
    //Deal with bubble collisions spacebar down and up for 2sec.
    bubbleHit: function () {
        this.game.physics.overlap(this.ammoType, this.sinkGrp, this.bubbleSink, null, this);
        this.game.physics.overlap(this.ammoType, this.hookGrp, this.bubbleHook, null, this);
        this.game.physics.overlap(this.ammoType, this.foeGrp, this.bubbleFoe, null, this);
        this.game.physics.overlap(this.ammoType, this.eggGrp, this.smashEgg, null, this);
        // Shoot rings make them grow.
        if (this.ringGrp.grow) {
            this.ringGrp.forEachAlive(function (r) {
                r.scale.x += 0.05;
                r.scale.y += 0.05;
            }, this);
        };
    },
    // Bubble meets barrel.
    bubbleSink: function (b, s) {
        s.hitcnt++;
        if (this.fuguGrp.countLiving() < this.fuguGrp.length && s.hitcnt === 5) {
            if (s.pill) {
                // Resort numbers.
                s.n === this.aFxr.length || s.n === 0 ? this.aFxr.sort(function () {
                    return Math.random() - 0.5;
                }) : null;
                s.n >= this.aFxr.length ? s.n = 0 : null;

                // Call effect.
                var effect = this.aFx[this.aFxr[s.n]];
                this.fish.EmFx.aEm[3].alpha = 1;
                this.fish.EmFx.aEm[3].forEachDead(function (em) {
                    em.efct = effect;
                }, this);
                s.n++;
                this.game.add.tween(this.fish.EmFx.aEm[3]).to({
                    alpha: 0
                }, effect.del, Phaser.Easing.Exponential.In, true)
                this.fish.EmFx.Start(3, s, effect.del, 15);
            } else {
                this.makeFoe(s.x, s.y, false);
            };
            s.fX.cloud(this, 'clouds0004', s, 0.1, 7);
            this.reSink(s);
            this.health(this, 15, 325);
        };
        s.pill ? s.EmFx.Start(1, s, 3000, 7) : s.EmFx.Start(0, s, 2000, 15);
        b.ammo === 'Bubble' ? b.kill() : null;
    },
    //Shot hooks get health.
    bubbleHook: function (b, h) {
        this.aHookGrp[h.num].up.start();
        h.fX.cloud(this, 'clouds0000', h, 0.5, 5);
        h.kill();
        b.ammo === 'Bubble' ? b.kill() : null;
        this.health(this, 15, 325);
    },
    // When bubble meets foe.
    bubbleFoe: function (b, f) {
        f.navGrp.bar.width = Math.floor(f.navGrp.bar.width);

        if (this.foeGrp.bigbub) {
            this.bigBubble(f);
        } else if (f.navGrp.bar.width >= 10) {
            this.health(f, f.stam, 70);
            this.stunFoe(f.stuntmr, f);
            f.EmFx.Start(0, f, 2000, 5);
            f.EmFx.Start(2, f, 6000, 1);
            f.scale.setTo(this.rand(false, 1, 0.7), this.rand(false, 1, 0.7));
            this.game.time.events.add(100, function () {
                f.scale.setTo(1, 1);
            }, this);
        } else {
            f.EmFx.Start(2, f, 6000, 7);
            f.fX.cloud(this, 'clouds0004', f, 0.1, 7);
            this.killFoe(f, false, false);
            this.health(this, 25, 325);
        };
        b.ammo === 'Bubble' ? b.kill() : null;
    },
    // Blow big bubbles.
    bigBubble: function (f) {
        if (!f.bubactv) {
            f.bubactv = true;
            f.bigbub.reset(f.x, f.y);
            f.spd = 8000;
        };
        f.bigbub.scale.x += 0.2;
        f.bigbub.scale.y += 0.2;
        f.EmFx.Start(1, f, 2000, 5);
        if (f.bigbub.scale.x > 2) {
            f.bigbub.scale.setTo(1, 1);
            f.bubactv = false;
            f.spd = f.respd;
            f.navGrp.bar.width = 0;
            f.bigbub.kill();
            this.killFoe(f, false, false);
            f.EmFx.Start(1, f, 2000, 5);
        };
    },
    // Shooting star.
    starBubble: function (s, b) {
        this.fish.fX.cloud(this, 'clouds0004', s, 0.1, 3);
        this.fish.EmFx.Start(8, s, 3000, 1);
        //this.fishFoe(f, null, 5);
        b.kill();
        s.kill();
    },
    // Deal with bubble or eye foe and egg overlap.
    smashEgg: function (b, e) {
        if (e.hitcnt === 3) {
            var r = b === null ? 7 : Math.floor((Math.random() * 2) + 4);
            var f = this.foeGrp.getAt(e.num);
            this.fish.EmFx.Start(r, f.egg, 10000, 30);
            this.game.time.events.remove(e.tmr);
            e.hitcnt = 0;
            e.animations.frameName = 'egg000' + e.hitcnt;
            f.eggbg.kill()
            e.kill();
        } else {
            e.hitcnt++;
            e.animations.frameName = 'egg000' + e.hitcnt;
        };
        b !== null && b.ammo === 'Bubble' ? b.kill() : null;
    },
    // Create an egg or a fuku.
    eggFuku: function (f) {
        var r = this.rand(true, 1, 0);
        r === 0 && f.egg.alive ? r = 1 : null;
        r === 0 ? this.makeEgg(f) : this.makeFugu(f);;
    },
    // Make egg.
    makeEgg: function (f) {
        f.egg.reset(f.x, f.y);
        f.eggbg.reset(f.x, f.y);
        this.game.add.tween(f.eggbg.scale).to({
            x: 4,
            y: 4,
            alpha: 0
        }, 1000, Phaser.Easing.Sinusoidal.In, true, 0, 1000);
        f.egg.tmr.add(60000, function () {
            f.egg.kill();
            f.eggbg.kill();
            f.fX.cloud(this, 'clouds0004', f.egg, 0.1, 7);
        }, this);
        f.egg.tmr.start();
    },
    // Deal with fish and worm, bug overlap from egg.
    fishEgg: function (f, em) {
        if (em.who === 'worm') {
            this.health(this, 10, 325);
            f.fX.cloud(this, 'fish0005', f, 0.5, 2);
        } else if (em.who === 'maggot') {
            this.fishFoe(f, null, -5);
            f.fX.cloud(this, 'clouds0004', f, 0.5, 2);
        } else if (em.who === 'weeblack') {
            f.fX.cloud(this, 'fish0005', f, 0.5, 2);
            this.health(this, 7, 325);
            f.tmr += 2000;

            if (!this.fuguGrp.sheld) {
                this.fuguGrp.sheld = true;
                this.fuguGrp.forEachAlive(function (fu) {
                    fu.sheld.reset(fu.x, fu.y);
                    this.game.time.events.add(10000, function () {
                        this.game.time.events.add(f.tmr, function () {
                            f.tmr = 0;
                            fu.sheld.kill();
                            this.fuguGrp.sheld = false;
                        }, this);
                    }, this);
                }, this);
            };
        };
        em.kill();
    },
    // Fish and mfly from foe overlap.
    fishMfly: function (f, mf) {
        f.fX.cloud(this, 'clouds0004', f, 0.8, 2.5);
        this.fishFoe(f, null, -15);
        mf.kill();
    },
    // Fish and green cloud from blob.
    fishGrn: function (f, g) {
        if (this.fuguGrp.countLiving() > 0) {
            var fugu = this.fuguGrp.getFirstAlive();
            fugu.sheld.alive ? fugu.sheld.kill() : null;
            var f = this.foeGrp.getAt(4);
            this.foeFugu(f, fugu);
        };
        this.fishFoe(f, null, -0.2);
    },
    // Green pill and fish overlap.
    grnPill: function (f, p) {
        f.fX.cloud(this, 'clouds0004', f, 0.3, 5);
        this.fishFoe(f, null, -50);
        p.kill();
    },
    // Pill and fish overlap.
    fishPill: function (f, p) {
        p.fX.pills(this, p.efct);
        f.fX.cloud(this, 'fish0005', f, 0.5, 2);
        p.kill();
    },
    // Health bar add to and subtract from.
    health: function (itm, force, bar) {
        if (force + itm.navGrp.bar.width >= 0 && force + itm.navGrp.bar.width <= bar) {
            itm.navGrp.bar.width += force;
        } else if (itm.navGrp.bar.width <= 10) {
            itm.navGrp.bar.width = 0;
        } else if (itm.navGrp.bar.width >= bar) {
            itm.navGrp.bar.width = bar;
        };
    },
    rand: function (whole, max, min) {
        max = max - min;
        if (whole) {
            max = max + 1;
            return Math.floor((Math.random() * max) + min);
        } else {
            var dec = (Math.random() * max) + min;
            return 1.0 / 16 * Math.floor(16 * dec);
        };
    },
};