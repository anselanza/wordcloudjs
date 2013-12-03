function GuiController($scope){
	$scope.gui = {stats:true, helpers:true};

	$scope.$watch('gui.stats', function(value) {
		$('#stats').toggle(value);
	});

	$scope.$watch('gui.helpers', function(value) {
		gridHelper.visible = value;
	});
}