var WC = {
	Word: function(params) {
		this.text = params.text;
		console.log("Created Word object for "+this.text);

		this.particle = physics.makeParticle();
		var range = DEFAULT_CAM_Z;
		this.particle.position.set(Math.random()*range - range/2, Math.random()*range - range/2, 0);

		// console.log("My particle at position" + this.particle.position.x+","+this.particle.position.y);

		
		// Create Object3D for this Word...




		this.mapForSprite = THREE.ImageUtils.loadTexture("assets/star.png");
		this.materialForSprite = new THREE.SpriteMaterial ({
			map: this.mapForSprite,
			useScreenCoordinates: false,
			color: 0xffffff });
		this.modelForSprite = new THREE.Sprite (this.materialForSprite);
		this.modelForSprite.scale.set( 1.0, 1.0, 1.0);
		scene.add(this.modelForSprite);


	}
};

WC.Word.prototype = {
	draw: function() {
		var x = this.particle.position.x;
		var y = this.particle.position.y;
		var z = this.particle.position.z;

		this.modelForSprite.position.set(x,y,z);
	}
};