var WC = {
	Word: function(params) {
		this.text = params.text;
		this.myLevel = params.startLevel;
		this.hasLoaded = false;

		console.log("Created Word object for "+this.text);

		this.particle = physics.makeParticle();
		var range = DEFAULT_CAM_Z * 0.75;
		this.particle.position.set(Math.random()*range - range/2, Math.random()*range - range/2, 0);

		// Create Object3D for this Word...
		var canvas = document.createElement("canvas");
        var size = 20;
        var scale = 0.1;

        canvas.width = size*7.5;
        canvas.height = size;
        var context = canvas.getContext("2d");

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

		// get snyonyms...
		var synonyms = [];
		if (this.myLevel < MAX_LEVELS) {
			var APIcall = "http://words.bighugelabs.com/api/2/185bb5ddb325382201efac61e7b7b853/"+this.text+"/json?callback=?";
			$.getJSON(APIcall, function(data){
				// console.log("Success! Raw data: ", data);
				$.each( data.verb.syn, function (i, syn) {
					synonyms.push(new WC.Word({ text:syn, startLevel:this.myLevel+1 }) );
				});
				this.hasLoaded = true;
			});
		}
		this.synonyms = synonyms;
	}
};

WC.Word.prototype = {
	draw: function() {
		var x = this.particle.position.x;
		var y = this.particle.position.y;
		var z = this.particle.position.z;

		this.textMesh.position.set(x,y,z);

		// Recursion: draw all my child words...

		for (var i=0; i<this.synonyms.length; i++) {
			this.synonyms[i].draw();
		}
	}
};