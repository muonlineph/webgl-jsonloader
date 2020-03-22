# webgl-jsonloader

> Three.js model loader for 3d object (**.obj**) files.  



### Prerequisites

1. NodeJS
	- node version 10.16.3
	- npm version 6.9.0
2. Windows OS 64 bit
3. Web browser
	- Chrome version 80.0.3987.149 (Official Build) (64-bit)
4. Three.js
	- version r114


### Demo

[https://muonlineph.github.io/webgl-jsonloader/](https://muonlineph.github.io/webgl-jsonloader/)


## Installation

1. Clone this repository.  
`https://github.com/muonlineph/webgl-jsonloader.git`

2. Install dependencies.  
`npm install`

3. Run the local web server.  
`npm run start`

4. Load the webgl json loader from  
`http://localhost:3000`



## Usage

1. Initialize a ThreeJS scene, camera and renderer. See `public/main.js` **init()** for more information.
2. Load ojbect model file(s) (.obj) and add to the ThreeJS scene.  

		let staff = await loadModel('objects/staffofkundun/', 'kundun-OBJ.mtl', 'kundun-OBJ.obj', {
		  position: { y:10 },
		  rotation: { x:-Math.PI/2, y:-Math.PI/3*2, z:-Math.PI/2 }
		})

		scene.add(staff)

	- see `public/loader.js` for more loading options
	- any number of object files can be loaded and added to the `scene`.



@weaponsforge  
20200320