function Vector(){var e=arguments.length;if(e===3){this.x=arguments[0];this.y=arguments[1];this.z=arguments[2]}else if(e===1){this.x=arguments[0].x;this.y=arguments[0].y;this.z=arguments[0].z}else{this.x=0;this.y=0;this.z=0}}function Particle(e){this.position=new Vector;this.velocity=new Vector;this.force=new Vector;this.mass=e;this.fixed=false;this.age=0;this.dead=false}function Spring(e,t,n,r,i){this.constant=n;this.damping=r;this.length=i;this.a=e;this.b=t;this.on=true}function Attraction(e,t,n,r){this.a=e;this.b=t;this.constant=n;this.on=true;this.distanceMin=r;this.distanceMinSquared=r*r}function RungeKuttaIntegrator(e){this.s=e;this.originalPositions=[];this.originalVelocities=[];this.k1Forces=[];this.k1Velocities=[];this.k2Forces=[];this.k2Velocities=[];this.k3Forces=[];this.k3Velocities=[];this.k4Forces=[];this.k4Velocities=[]}function ParticleSystem(){this.particles=[];this.springs=[];this.attractions=[];this.forces=[];this.integrator=new RungeKuttaIntegrator(this);this.hasDeadParticles=false;var e=arguments.length;if(e===2){this.gravity=new Vector(0,arguments[0],0);this.drag=arguments[1]}else if(e===4){this.gravity=new Vector(arguments[0],arguments[1],arguments[2]);this.drag=arguments[3]}else{this.gravity=new Vector(0,ParticleSystem.DEFAULT_GRAVITY,0);this.drag=ParticleSystem.DEFAULT_DRAG}}Vector.prototype.set=function(){var e=arguments.length;if(e===3){this.x=arguments[0];this.y=arguments[1];this.z=arguments[2]}else if(e===1){this.x=arguments[0].x;this.y=arguments[0].y;this.z=arguments[0].z}};Vector.prototype.add=function(e){var t=arguments.length;if(t===3){this.x+=arguments[0];this.y+=arguments[1];this.z+=arguments[2]}else if(t===1){this.x+=arguments[0].x;this.y+=arguments[0].y;this.z+=arguments[0].z}};Vector.prototype.substract=function(e){var t=arguments.length;if(t===3){this.x-=arguments[0];this.y-=arguments[1];this.z-=arguments[2]}else if(t===1){this.x-=arguments[0].x;this.y-=arguments[0].y;this.z-=arguments[0].z}};Vector.prototype.scale=function(e){this.x*=e;this.y*=e;this.z*=e};Vector.prototype.distanceTo=function(){var e=arguments.length;if(e===3){var t=this.x-arguments[0];var n=this.y-arguments[1];var r=this.z-arguments[2];return Math.sqrt(t*t+n*n+r*r)}else if(e===1){return Math.sqrt(this.distanceSquaredTo(arguments[0]))}};Vector.prototype.distanceSquaredTo=function(e){var t=this.x-e.x;var n=this.y-e.y;var r=this.z-e.z;return t*t+n*n+r*r};Vector.prototype.dot=function(e){return this.x*e.x+this.y*e.y+this.z*e.z};Vector.prototype.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)};Vector.prototype.lengthSquared=function(){return this.x*this.x+this.y*this.y+this.z*this.z};Vector.prototype.clear=function(){this.x=0;this.y=0;this.z=0};Vector.prototype.toString=function(){return"("+this.x+","+this.y+","+this.z+")"};Vector.prototype.cross=function(e){return new Vector(this.y*e.z-this.z*e.y,this.x*e.z-this.z*e.x,this.x*e.y-this.y*e.x)};Vector.prototype.isZero=function(){return this.x===0&&this.y===0&&this.z===0};Particle.prototype.distanceTo=function(e){return this.position.distanceTo(e.position)};Particle.prototype.makeFixed=function(){this.fixed=true;this.velocity.clear()};Particle.prototype.reset=function(){this.age=0;this.dead=false;this.position.clear();this.velocity.clear();this.force.clear();this.mass=1};Spring.prototype.currentLength=function(){return this.a.position.distanceTo(this.b.position)};Spring.prototype.apply=function(){var e=this.a;var t=this.b;if(!(this.on&&(!e.fixed||!t.fixed))){return}var n=e.position.x-t.position.x;var r=e.position.y-t.position.y;var i=e.position.z-t.position.z;var s=Math.sqrt(n*n+r*r+i*i);if(s===0){n=0;r=0;i=0}else{n/=s;r/=s;i/=s}var o=-1*(s-this.length)*this.constant;var u=e.velocity.x-t.velocity.x;var a=e.velocity.y-t.velocity.y;var f=e.velocity.z-t.velocity.z;var l=-1*this.damping*(n*u+r*a+i*f);var c=o+l;n*=c;r*=c;i*=c;if(!e.fixed){e.force.add(n,r,i)}if(!t.fixed){t.force.add(-1*n,-1*r,-1*i)}};Attraction.prototype.apply=function(){var e=this.a,t=this.b;if(!this.on||e.fixed&&t.fixed){return}var n=e.position.x-t.position.x;var r=e.position.y-t.position.y;var i=e.position.z-t.position.z;var s=Math.max(n*n+r*r+i*i,this.distanceMinSquared);var o=this.constant*e.mass*t.mass/s;var u=Math.sqrt(s);if(o===0||u===0){n=0;r=0;i=0}else{n/=u;r/=u;i/=u;n*=o;r*=o;i*=o}if(!e.fixed){e.force.add(-n,-r,-i)}if(!t.fixed){t.force.add(n,r,i)}};RungeKuttaIntegrator.prototype.allocateParticles=function(){while(this.s.particles.length>this.originalPositions.length){this.originalPositions.push(new Vector);this.originalVelocities.push(new Vector);this.k1Forces.push(new Vector);this.k1Velocities.push(new Vector);this.k2Forces.push(new Vector);this.k2Velocities.push(new Vector);this.k3Forces.push(new Vector);this.k3Velocities.push(new Vector);this.k4Forces.push(new Vector);this.k4Velocities.push(new Vector)}};RungeKuttaIntegrator.prototype.step=function(e){var t,n,r,i,s,o,u,a,f,l,c,h,p=this.s;this.allocateParticles();for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){this.originalPositions[n].set(t.position);this.originalVelocities[n].set(t.velocity)}t.force.clear()}p.applyForces();for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){this.k1Forces[n].set(t.force);this.k1Velocities[n].set(t.velocity)}t.force.clear()}for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){r=this.originalPositions[n];s=this.k1Velocities[n];t.position.x=r.x+s.x*.5*e;t.position.y=r.y+s.y*.5*e;t.position.z=r.z+s.z*.5*e;i=this.originalVelocities[n];f=this.k1Forces[n];t.velocity.x=i.x+f.x*.5*e/t.mass;t.velocity.y=i.y+f.y*.5*e/t.mass;t.velocity.z=i.z+f.z*.5*e/t.mass}}p.applyForces();for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){this.k2Forces[n].set(t.force);this.k2Velocities[n].set(t.velocity)}t.force.clear()}for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){r=this.originalPositions[n];o=this.k2Velocities[n];t.position.x=r.x+o.x*.5*e;t.position.y=r.y+o.y*.5*e;t.position.z=r.z+o.z*.5*e;i=this.originalVelocities[n];l=this.k2Forces[n];t.velocity.x=i.x+l.x*.5*e/t.mass;t.velocity.y=i.y+l.y*.5*e/t.mass;t.velocity.z=i.z+l.z*.5*e/t.mass}}p.applyForces();for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){this.k3Forces[n].set(t.force);this.k3Velocities[n].set(t.velocity)}t.force.clear()}for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){r=this.originalPositions[n];u=this.k3Velocities[n];t.position.x=r.x+u.x*e;t.position.y=r.y+u.y*e;t.position.z=r.z+u.z*e;i=this.originalVelocities[n];c=this.k3Forces[n];t.velocity.x=i.x+c.x*e/t.mass;t.velocity.y=i.y+c.y*e/t.mass;t.velocity.z=i.z+c.z*e/t.mass}}p.applyForces();for(n=0;n<p.particles.length;n++){t=p.particles[n];if(!t.fixed){this.k4Forces[n].set(t.force);this.k4Velocities[n].set(t.velocity)}}for(n=0;n<p.particles.length;n++){t=p.particles[n];t.age+=e;if(t.fixed){continue}r=this.originalPositions[n];s=this.k1Velocities[n];o=this.k2Velocities[n];u=this.k3Velocities[n];a=this.k4Velocities[n];t.position.x=r.x+e/6*(s.x+2*o.x+2*u.x+a.x);t.position.y=r.y+e/6*(s.y+2*o.y+2*u.y+a.y);t.position.z=r.z+e/6*(s.z+2*o.z+2*u.z+a.z);i=this.originalVelocities[n];f=this.k1Forces[n];l=this.k2Forces[n];c=this.k3Forces[n];h=this.k4Forces[n];t.velocity.x=i.x+e/(6*t.mass)*(f.x+2*l.x+2*c.x+h.x);t.velocity.y=i.y+e/(6*t.mass)*(f.y+2*l.y+2*c.y+h.y);t.velocity.z=i.z+e/(6*t.mass)*(f.z+2*l.z+2*c.z+h.z)}};ParticleSystem.DEFAULT_GRAVITY=0;ParticleSystem.DEFAULT_DRAG=.001;ParticleSystem.prototype.setGravity=function(){var e=arguments.length;if(e===1){this.gravity.set(0,arguments[0],0)}else if(e===3){this.gravity.set(arguments[0],arguments[1],arguments[2])}};ParticleSystem.prototype.tick=function(){this.integrator.step(arguments.length===0?1:arguments[0])};ParticleSystem.prototype.makeParticle=function(){var e=1;var t=0;var n=0;var r=0;if(arguments.length===4){e=arguments[0];t=arguments[1];n=arguments[2];r=arguments[3]}var i=new Particle(e);i.position.set(t,n,r);this.particles.push(i);return i};ParticleSystem.prototype.makeSpring=function(e,t,n,r,i){var s=new Spring(e,t,n,r,i);this.springs.push(s);return s};ParticleSystem.prototype.makeAttraction=function(e,t,n,r){var i=new Attraction(e,t,n,r);this.attractions.push(i);return i};ParticleSystem.prototype.clear=function(){this.particles.clear();this.springs.clear();this.attractions.clear()};ParticleSystem.prototype.applyForces=function(){var e,t;if(!this.gravity.isZero()){for(t=0;t<this.particles.length;t++){e=this.particles[t];e.force.add(this.gravity)}}for(t=0;t<this.particles.length;t++){e=this.particles[t];e.force.add(e.velocity.x*-1*this.drag,e.velocity.y*-1*this.drag,e.velocity.z*-1*this.drag)}for(t=0;t<this.springs.length;t++){e=this.springs[t];e.apply()}for(t=0;t<this.attractions.length;t++){e=this.attractions[t];e.apply()}for(t=0;t<this.forces.length;t++){e=this.forces[t];e.apply()}};ParticleSystem.prototype.clearForces=function(){var e;for(e=0;e<this.particles.length;e++){this.particles[e].clear()}};Array.prototype.remove=function(e){var t;if(typeof e==="number"){this.splice(e,1)}else{for(t=0;t<this.length;t++){if(this[t]===e){this.remove(t);t--}}}}