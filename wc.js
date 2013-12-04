var WC = {
	Word: function(params) {
		this.text = params.text;
		console.log("Created Word object for "+this.text);

		this.particle = physics.makeParticle();
		var range = DEFAULT_CAM_Z * 0.75;
		this.particle.position.set(Math.random()*range - range/2, Math.random()*range - range/2, 0);

		// Create Object3D for this Word...
		var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var size = 20;
        var scale = 0.1;

        canvas.width = size*7.5;
        canvas.height = size;
        context = canvas.getContext("2d");

        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillStyle = "white";
        context.font = (size/1.8)+"pt Arial";
        context.fillText(this.text, canvas.width/2-size, canvas.height/2);

        this.textTexture = new THREE.Texture(canvas);
        this.textTexture.needsUpdate = true;

        this.textMaterial = new THREE.MeshBasicMaterial({
            map : this.textTexture,
            transparent : true
        });

        this.textMesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), this.textMaterial);

        this.textMesh.scale.set(scale, scale, scale);

        scene.add(this.textMesh);

	}
};

WC.Word.prototype = {
	draw: function() {
		var x = this.particle.position.x;
		var y = this.particle.position.y;
		var z = this.particle.position.z;

		this.textMesh.position.set(x,y,z);
	}
};