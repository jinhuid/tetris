let i,t;const h=(e,o)=>{i=e,t=o},n={column:10,row:20,FPS:null,speed:2,keySpeed:10,devicePixelRatio:window.devicePixelRatio,get brickWidth(){return Math.round(i*this.devicePixelRatio/this.column)},get brickHeight(){return Math.round(t*this.devicePixelRatio/this.row)},get windowWidth(){return this.brickWidth*this.column},get windowHeight(){return this.brickHeight*this.row},showLandingPoint:!0};export{n as gameParam,h as initConfig};