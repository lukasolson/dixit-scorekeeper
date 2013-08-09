angular.module("app").filter("sum", function () {
	return function (input, attribute) {
		var sum = 0;
		for (var i = 0; i < input.length; i++) {
			sum += input[i][attribute] || input[i];
		}
		return sum;
	};
});