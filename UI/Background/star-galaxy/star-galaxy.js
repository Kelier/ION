
var ion = (function() {
    // IE 9+
    var canvas=document.getElementById("canvas") || document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    
    var w=canvas.width=window.innerWidth;//获取屏幕宽度
    var h=canvas.height=window.innerHeight;//获取屏幕高度

    var hue = 217;
    var stars = [];
    var count = 0;
    var maxStars = 1300;//星星数量

    var canvas2 = document.createElement("canvas");
    var ctx2 = canvas2.getContext('2d');
    canvas2.width = 50;
    canvas2.height = 50;
    var half = canvas2.width / 2;
    var gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#CCC');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    // End cache

    function random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }

        if (min > max) {
            var hold = max;
            max = min;
            min = hold;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function maxOrbit(x, y) {
        var max = Math.max(x, y);
        var diameter = Math.round(Math.sqrt(max * max + max * max));
        //星星移动范围，值越大范围越小
        return diameter / 2;
        
    }

    var Star = function() {
        this.orbitRadius = random(maxOrbit(w, h));

        //星星大小
        this.radius = random(60, this.orbitRadius) / 8; 
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);

        //星星移动速度
        this.speed = random(this.orbitRadius) / 50000;
        this.alpha = random(2, 10) / 10;

        count++;
        stars[count] = this;
    }

    Star.prototype.draw = function() {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        var y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        var twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
    };

    for (var i = 0; i < maxStars; i++) {
        new Star();
    }

    function animation() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.5; //尾巴
        ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) {
            stars[i].draw();
        }

        window.requestAnimationFrame(animation);
    }

    var starGalaxy = function() {
        animation();
    };

    return {
        starGalaxy: starGalaxy
    };

})(window);