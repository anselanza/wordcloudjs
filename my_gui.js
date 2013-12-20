function GuiController($scope){
	$scope.gui = {stats:true, helpers:true};

	$scope.$watch('gui.stats', function(value) {
		$('#stats').toggle(value);
	});

	$scope.$watch('gui.helpers', function(value) {
		gridHelper.visible = value;
	});
}

function TrackingGuiController ($scope){
	$scope.tgui = {sensitivity:30, scale: 1};

	$scope.$watch('tgui.sensitivity', function(value) {
		$('#sensitivitySlider').val(value);
		sensitivity = value;
	});

	$scope.$watch('tgui.scale', function(value) {
		$('#scaleSlider').val(value);
		scale = value;
	});
}