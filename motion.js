export const dropIn = {
	hidden: {
		y: "-100vh",
		opacity: 0,
	},
	visible: {
		y: "0",
		opacity: 1,
		transition: {
			duration: 1,
			type: "spring",
			damping: 20,
			stiffness: 300,
		},
	},
	exit: {
		y: "100vh",
		opacity: 0,
	},
};

export const navVariants = {
	hidden: {
		opacity: 0,
		y: -50,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 140,
		},
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 80,
			delay: 1,
		},
	},
};

export const slideIn = (direction, type, delay, duration, opacity) => ({
	hidden: {
		x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
		y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
		opacity: opacity ? 0 : 1,
	},
	show: {
		x: 0,
		y: 0,
		opacity: 1,
		transition: {
			type,
			delay,
			duration,
			ease: "easeOut",
			stiffness: 300,
			damping: 30,
		},
	},
	exit: {
		x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
		y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
		opacity: opacity ? 0 : 1,
	},
});

export const fadeIn = (direction, type, delay, duration) => ({
	hidden: {
		x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
		y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
		opacity: 0,
	},
	show: {
		x: 0,
		y: 0,
		opacity: 1,
		transition: {
			type,
			delay,
			duration,
			ease: "easeOut",
			stiffness: 300,
			damping: 30,
		},
	},
	exit: {
		x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
		y: direction === "up" ? -50 : direction === "down" ? 50 : 0,
		opacity: 0,
	},
});
