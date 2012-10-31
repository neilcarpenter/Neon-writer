// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik MÃƒÂ¶ller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var NEON = {

	options: {
		lineWidth: 7,
		hue: 350
	},

	animation: null,

	canvas: null,
	context: null,

	winWidth: window.innerWidth,
	winHeight: window.innerHeight,

	mouse: { x: -1000, y: -1000, down: false },
	mousePrev: { x: -1000, y: -1000 },

	canvii: [],

	mousePaths : [],
	mousePathsCounter : 0,

	flickerInit: false,
	timer: null,

	init: function () {
		this.canvas = document.getElementById( 'canvas' );
		this.context = canvas.getContext( '2d' );
		this.canvas.width = this.winWidth;
		this.canvas.height = this.winHeight;

		this.canvas.addEventListener('mousemove', this.mouseMove, false);
		this.canvas.addEventListener('mousedown', this.mouseDown, false);
		this.canvas.addEventListener('mouseup', this.mouseUp, false);
		this.canvas.addEventListener('mouseout', this.mouseOut, false);
		this.canvas.addEventListener('dblclick', this.mouseDbl, false);

		this.draw();

		window.onresize = function () {
			NEON.clearAll();

			NEON.winWidth = window.innerWidth;
			NEON.winHeight = window.innerHeight;
			NEON.canvas.width = NEON.winWidth;
			NEON.canvas.height = NEON.winHeight;
		};
	},

	drawLines: function () {
		if (!this.mouse.down) {
			return;
		}

		var deets = {
				mouseX: this.mouse.x,
				mouseY: this.mouse.y,
				hue: this.options.hue,
				lineWidth: this.options.lineWidth
			};

		// drawing in real-time
		var ctx = this.context;

		ctx.globalCompositeOperation = 'destination-over';

		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = this.options.lineWidth;

		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 10;
		ctx.shadowColor = 'hsla(0, 0%, 0%, 0.7)';

		ctx.beginPath();
		ctx.strokeStyle = 'hsla(' + this.options.hue + ', 100%, 50%, 1)';
		ctx.moveTo(this.mousePrev.x, this.mousePrev.y);
		ctx.lineTo(this.mouse.x, this.mouse.y);
		ctx.stroke();

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 30;
		ctx.shadowColor = 'hsla(' + this.options.hue + ', 100%, 50%, 0.8)';

		ctx.beginPath();
		ctx.moveTo(this.mousePrev.x, this.mousePrev.y);
		ctx.lineTo(this.mouse.x, this.mouse.y);
		ctx.stroke();

		ctx.shadowBlur = 200;
		ctx.shadowColor = 'hsla(' + this.options.hue + ', 80%, 70%, 0.9)';

		ctx.beginPath();
		ctx.moveTo(this.mousePrev.x, this.mousePrev.y);
		ctx.lineTo(this.mouse.x, this.mouse.y);
		ctx.stroke();

		// save mouse co-ords for this line
		this.mousePaths[this.mousePathsCounter].push(deets);
	},

	// this isn't a great way to do anything, too many canvii!
	drawNewCanvas: function (index) {
		var points = this.mousePaths[index],
			pointsLen = points.length,
			c = document.createElement('canvas'),
			ctx = c.getContext('2d');

		c.width = NEON.winWidth;
		c.height = NEON.winHeight;
		c.style.position = 'absolute';
		c.style.top = 0;
		c.style.left = 0;
		c.style.zIndex = 0;
		// c.style.cssText += '-webkit-filter: saturate(1.5)';

		c.dataset.canvas = index;
		c.className = 'dummy';

		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = points[0].lineWidth;
		ctx.globalCompositeOperation = 'destination-over';

		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 10;
		ctx.shadowColor = 'hsla(0, 0%, 0%, 0.7)';
		
		ctx.strokeStyle = 'hsla(' + points[0].hue + ', 100%, 50%, 1)';
		ctx.beginPath();
		for (var i = 0; i < pointsLen; i++) {
			if (i === 0) {
				ctx.moveTo((points[i].mouseX), (points[i].mouseY));
			}
			else {
				ctx.lineTo((points[i].mouseX), (points[i].mouseY));
			}
		}
		ctx.stroke();

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 30;
		ctx.shadowColor = 'hsla(' + points[0].hue + ', 100%, 50%, 0.8)';
		ctx.beginPath();
		for (var i = 0; i < pointsLen; i++) {
			if (i === 0) {
				ctx.moveTo((points[i].mouseX), (points[i].mouseY));
			}
			else {
				ctx.lineTo((points[i].mouseX), (points[i].mouseY));
			}
		}
		ctx.stroke();

		ctx.shadowBlur = 200;
		ctx.shadowColor = 'hsla(' + points[0].hue + ', 80%, 70%, 0.9)';
		ctx.beginPath();
		for (var i = 0; i < pointsLen; i++) {
			if (i === 0) {
				ctx.moveTo((points[i].mouseX), (points[i].mouseY));
			}
			else {
				ctx.lineTo((points[i].mouseX), (points[i].mouseY));
			}
		}
		ctx.stroke();

		document.body.appendChild(c);

		this.canvii.push(c);

	},

	draw: function () {
		this.animation = requestAnimationFrame( function(){ NEON.draw(); } );

		this.drawLines();

		this.mousePrev.x = this.mouse.x;
		this.mousePrev.y = this.mouse.y;
	},

	flicker: function() {
		var wait = NEON.randomFromInterval(0, 2000),
			flickersCount = NEON.randomFromInterval(10, 30),
			canviiLen = NEON.canvii.length,
			randomCanvasIndex = NEON.randomFromInterval(0, (canviiLen - 1)),
			canvas = NEON.canvii[randomCanvasIndex],
			ctx = canvas.getContext('2d'),
			points = NEON.mousePaths[randomCanvasIndex],
			pointsLen = points.length,
			hue = points[0].hue,
			lineWidth = points[0].lineWidth;

		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		if (flickersCount % 2 !== 0) {
			flickersCount -= 1;
		}

		function flick() {
			if (flickersCount === 0) {
				return;
			}
			else if (flickersCount % 2 !== 0) {
				NEON.repaint(ctx, points, pointsLen, hue, lineWidth, false);
			}
			else {
				NEON.repaint(ctx, points, pointsLen, hue, lineWidth, true);
			}
			flickersCount -= 1;
			setTimeout(flick, 20);
		}
		flick();

		NEON.timer = setTimeout(NEON.flicker, wait);
	},

	repaint: function(ctx, points, pointsLen, hue, lineWidth, faded) {
		ctx.clearRect(0, 0, NEON.winWidth, NEON.winHeight);

		ctx.lineWidth = lineWidth;
		ctx.globalCompositeOperation = 'destination-over';

		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
		ctx.shadowBlur = 10;
		ctx.shadowColor = 'hsla(0, 0%, 0%, 0.7)';
		
		if (faded) {
			ctx.strokeStyle = 'hsla(' + hue + ', 10%, 20%, 1)';
		}
		else {
			ctx.strokeStyle = 'hsla(' + hue + ', 100%, 50%, 1)';
		}

		ctx.beginPath();
		for (var i = 0; i < pointsLen; i++) {
			if (i === 0) {
				ctx.moveTo((points[i].mouseX), (points[i].mouseY));
			}
			else {
				ctx.lineTo((points[i].mouseX), (points[i].mouseY));
			}
		}
		ctx.stroke();

		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 30;

		if (faded) {
			ctx.shadowColor = 'hsla(' + hue + ', 10%, 10%, 0.8)';
		}
		else {
			ctx.shadowColor = 'hsla(' + hue + ', 100%, 50%, 0.8)';
		}

		ctx.beginPath();
		for (var i = 0; i < pointsLen; i++) {
			if (i === 0) {
				ctx.moveTo((points[i].mouseX), (points[i].mouseY));
			}
			else {
				ctx.lineTo((points[i].mouseX), (points[i].mouseY));
			}
		}
		ctx.stroke();

		ctx.shadowBlur = 200;

		if (faded) {
			ctx.shadowColor = 'hsla(' + hue + ', 5%, 7%, 0.9)';
		}
		else {
			ctx.shadowColor = 'hsla(' + hue + ', 80%, 70%, 0.9)';
		}

		ctx.beginPath();
		for (var i = 0; i < pointsLen; i++) {
			if (i === 0) {
				ctx.moveTo((points[i].mouseX), (points[i].mouseY));
			}
			else {
				ctx.lineTo((points[i].mouseX), (points[i].mouseY));
			}
		}
		ctx.stroke();
	},

	randomFromInterval: function(from, to) {
		return Math.floor(Math.random()*(to-from+1)+from);
	},

	clearDrawingSurface: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	clearAll: function() {
		for (var i = 0; i < NEON.canvii.length; i++) {
			NEON.canvii[i].parentNode.removeChild(NEON.canvii[i]);
		}
		NEON.canvii.length = 0;
		NEON.mousePathsCounter = 0;
		NEON.flickerInit = false;
		clearTimeout(NEON.timer);
	},

	mouseMove: function (e) {
		NEON.mouse.x = e.offsetX || (e.layerX - NEON.canvas.offsetLeft);
		NEON.mouse.y = e.offsetY || (e.layerY - NEON.canvas.offsetTop);
	},

	mouseDown: function () {
		NEON.mousePaths[NEON.mousePathsCounter] = [];
		NEON.mouse.down = true;
	},

	mouseUp: function () {
		NEON.clearDrawingSurface();
		NEON.drawNewCanvas(NEON.mousePathsCounter);
		NEON.mousePathsCounter += 1;
		NEON.mouse.down = false;

		if (!NEON.flickerInit) {
			setTimeout(NEON.flicker, 2000);
			NEON.flickerInit = true;
		}
	},

	mouseOut: function () {
		NEON.mouse.down = false;
	},

	mouseDbl: function () {
		NEON.clearAll();
	}

};

function eventListenerz() {
	var inputs = document.getElementsByClassName('controller'),
		colorSpan = document.getElementById('color-indicator'),
		resetBtn = document.getElementById('reset');

	colorSpan.style.backgroundColor = 'hsl(' + NEON.options.hue + ', 100%, 50%)';	

	function onChange() {
		var name = this.name,
			value = this.value,
			max = this.getAttribute('max');

		value = +value;

		if (value > max) {
			value = max;
			this.value = max;
		}

		NEON.options[name] = value;

		if (this.name === 'hue') {
			var colorSpan = document.getElementById('color-indicator');
			colorSpan.style.backgroundColor = 'hsl(' + NEON.options.hue + ', 100%, 50%)';
		}

	}

	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('change', onChange, false);
	}

	var controlToggles = document.getElementsByClassName('toggle-controls'),
		controls = document.getElementById('controls');

	function toggleControls(e) {
		e.preventDefault();
		controls.className = controls.className === 'closed' ? '' : 'closed';
	}

	for (var j = 0; j < 2; j++) {
		controlToggles[j].addEventListener('click', toggleControls, false);
	}

	resetBtn.addEventListener('click', NEON.clearAll, false);

}

window.onload = function() {

	NEON.init();

	eventListenerz();

};