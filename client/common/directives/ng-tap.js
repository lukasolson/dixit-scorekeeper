angular.module("app").directive("ngTap", function () {
	return {
		scope: {
			ngTap: "&"
		},
		link: function (scope, element, attributes) {
			var tapped = false;
			element.bind("click", function () {
				if (!tapped) scope.$apply(scope.ngTap)
			});
			element.bind("touchstart", function () {
				tapped = true;
			});
			element.bind("touchmove", function (e) {
				tapped = false;
				e.stopImmediatePropagation();
			});
			element.bind("touchend", function () {
				if (tapped) scope.$apply(scope.ngTap);
			});
		}
	};
});