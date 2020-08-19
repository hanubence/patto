const image = document.querySelector("#image");
const div = document.querySelector(".img");
const counter = document.querySelector("#pats");

const socket = io(window.location.origin);

let globalPats = 0;

socket.on("pats", (pats) => {
	globalPats = pats.value;
	counter.innerHTML = `${globalPats} pats`;
});

let localPats = 0;
let left = false,
	right = false;

const mouseHandler = function (e) {
	const x = e.pageX - this.offsetLeft;
	image.style.setProperty("left", `${round((x - 480) * 86) + 480}px`);
	if (x < 70) {
		left = true;
	} else if (x > 410) {
		right = true;
	} else if (right && left) {
		addPat();
	}
};

const round = function (n) {
	if (n > 0) return Math.ceil(n / 480.0) * 480;
	else if (0 > n) return Math.floor(n / 480.0) * 480;
	else return 480;
};

const touchHandler = function (e) {
	const x =
		e.targetTouches[event.targetTouches.length - 1].clientX - this.offsetLeft;
	const value = round((x - 480) * 86) + 480;
	if (value > -41280 && 0 >= value)
		image.style.setProperty("left", `${value}px`);
	if (x < 70) {
		left = true;
	} else if (x > 410) {
		right = true;
	} else if (right && left) {
		addPat();
	}
};

const addPat = () => {
	left = false;
	right = false;
	localPats += 1;
	counter.innerHTML = `${localPats + globalPats} pats`;
};

const updatePats = () => {
	socket.emit("pats", { value: localPats });
	globalPats = localPats + globalPats;
	localPats = 0;
};

setInterval(updatePats, 500);

div.addEventListener("touchmove", touchHandler);
div.addEventListener("mousemove", mouseHandler);
