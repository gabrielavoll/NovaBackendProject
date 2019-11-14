module.exports = {
	tokenGen : () => {
    return Math.random().toString(36).substr(2, 13);
	}
}