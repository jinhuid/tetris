var N=Object.defineProperty;var S=(i,t,e)=>t in i?N(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var h=(i,t,e)=>(S(i,typeof t!="symbol"?t+"":t,e),e);import{gameParam as c}from"./gameConfig-n0tYIkE6.js";import G from"./CanvasWithMapCtx-DY0prO4Z.js";import{s as A}from"./index-pr7NEbid.js";const b={o:{color:"#FADADD",struct:["11","11"]},i:{color:"#F7E9D4",struct:["0000","1111","0000","0000"]},s:{color:"#C8E6C9",struct:["011","110","000"]},z:{color:"#B3E5FC",struct:["110","011","000"]},l:{color:"#FFCC80",struct:["001","111","000"]},j:{color:"#FFEE58",struct:["100","111","000"]},t:{color:"#CE93D8",struct:["000","111","010"]},".":{color:"green",struct:["1"]}},H=i=>{const t=i.findLastIndex(e=>e!==0);return t===-1?-i.length:-t-1},L=i=>i.map(t=>parseInt(t,2)),T=2**c.column-1,w=class w{constructor(t,e=performance.now()){h(this,"color");h(this,"width");h(this,"height");h(this,"structure");h(this,"point");h(this,"landingPoint");h(this,"isRecycle",!1);this.letter=t,this.lastTime=e,this.color=b[this.letter].color,this.width=w.width,this.height=w.height,this.structure=L(b[this.letter].struct),this.point={x:Math.floor(c.column/2)-Math.floor(this.structure.length/2),y:H(this.structure)}}computeLandingPoint(t){let e=this.point.y;for(;!this.isOverlap(t,this.getBinary(),this.point.x,e+1);)e++;this.landingPoint={x:this.point.x,y:e}}update(t,e){return t-this.lastTime>=1e3/c.speed?(this.lastTime=t-(t-this.lastTime)%(1e3/c.speed),this.isOverlap(e,this.getBinary(),this.point.x,this.point.y+1)?!0:(this.point.y++,!1)):!1}left(t){this.isAtBorder("left")||this.isOverlap(t,this.getBinary(),this.point.x-1)||(this.point.x--,this.computeLandingPoint(t))}right(t){this.isAtBorder("right")||this.isOverlap(t,this.getBinary(),this.point.x+1)||(this.point.x++,this.computeLandingPoint(t))}downOne(t){return this.isOverlap(t,this.getBinary(),this.point.x,this.point.y+1)?!0:(this.point.y++,!1)}downToBottom(t){for(;!this.isOverlap(t,this.getBinary(),this.point.x,this.point.y+1);)this.point.y++;return!0}rotate(t){const e=this.structure.length,s=new Array(e).fill(0);let a=0,r=0;for(;a<e;){if(this.structure[a]&1<<e-1-r){const n=a,o=e-1-r;if(n+this.point.x>=c.column||n+this.point.x<0||o+this.point.y>=c.row)return;s[o]+=1<<e-1-n}r++,r===e&&(a++,r=0)}this.isOverlap(t,this.getBinary(s))||(this.structure=s,this.computeLandingPoint(t))}getBinary(t=this.structure,e=this.point.x){const s=c.column-e-t.length;return t.map(a=>s>=0?a<<s:a>>-s)}correctLastTime(t){this.lastTime=t}isOverlap(t,e,s=this.point.x,a=this.point.y){if(s!==this.point.x){const r=s-this.point.x;r>0?e=e.map(n=>n>>r):e=e.map(n=>n<<-r)}return e.some((r,n)=>{if(a+n<0)return!1;if(r&(t[a+n]??T))return!0})}isAtBorder(t){const e=this.getBinary(),s=t==="left"?(T+1)/2:1;return e.some(a=>a&s)}};h(w,"height",c.brickHeight),h(w,"width",c.brickWidth);let f=w;const E=(i,{point:t,width:e,height:s,color:a})=>{const{x:r,y:n}=t,o=s/10*c.devicePixelRatio,l=s/25*c.devicePixelRatio;i.fillStyle=a,i.beginPath(),i.moveTo(r+o,n),i.lineTo(r+e-o,n),i.arcTo(r+e,n,r+e,n+o,o),i.lineTo(r+e,n+s-o),i.arcTo(r+e,n+s,r+e-o,n+s,o),i.lineTo(r+o,n+s),i.arcTo(r,n+s,r,n+s-o,o),i.lineTo(r,n+o),i.arcTo(r,n,r+o,n,o),i.fill();const p=r+l/2,u=n+l/2,m=e-l,y=s-l;i.strokeStyle="#000000",i.lineWidth=l,i.beginPath(),i.moveTo(p+o,u),i.lineTo(p+m-o,u),i.arcTo(p+m,u,p+m,u+o,o),i.lineTo(p+m,u+y-o),i.arcTo(p+m,u+y,p+m-o,u+y,o),i.lineTo(p+o,u+y),i.arcTo(p,u+y,p,u+y-o,o),i.lineTo(p,u+o),i.arcTo(p,u,p+o,u,o),i.stroke(),i.closePath()},k=document.createElement("canvas"),j=k.getContext("2d");k.height=c.brickHeight*20;k.width=c.brickWidth;let C=0;const v={},_=(i,{point:t,width:e,height:s,color:a},r=1)=>{if(a in v){i.globalAlpha=r,i.drawImage(k,0,s*v[a],e,s,t.x,t.y,e,s),i.globalAlpha=1;return}E(j,{point:{x:0,y:C*s},width:e,height:s,color:a}),v[a]=C++,i.drawImage(k,0,s*v[a],e,s,t.x,t.y,e,s)},F=(i,{point:t,width:e,height:s,color:a,structure:r},n)=>{let o=0,l=0;for(;o<r.length;)r[o]&1<<r.length-1-l&&_(i,{point:{x:(t.x+l)*e,y:(t.y+o)*s},width:e,height:s,color:a},n),l++,l===r.length&&(l=0,o++)},D=(i,t)=>{if(t&&(!Number.isInteger(t)||t<=0))throw new TypeError("fps 应该是一个正整数");let e;function s(...r){const n=(()=>{if(t){const l=1e3/t;let p=0;return u=>{const m=u-p;m>=l&&(i.apply(this,[u,...r]),p=u-m%l)}}return l=>{i.apply(this,[l,...r])}})(),o=l=>{e=requestAnimationFrame(o),n(l)};a(),o(0)}function a(){cancelAnimationFrame(e)}return[s,a]};function R(i){let t;const e=new Proxy(i,{construct(s,a){return t||(t=Reflect.construct(s,a)),t}});return i.prototype.constructor=e,e}class K{constructor(){h(this,"eliminateTarget",2**c.column-1)}getRandomLetter(){const t=Object.keys(b);return t[Math.random()*t.length>>0]}record(t,e,s){if(this.isGameOver(s))return!1;const a=s.getBinary();for(let r=a.length-1;r>=0;r--)if(a[r]!==0){t[s.point.y+r]|=a[r];for(let n=c.column-1,o=a[r];o!==0;n--,o>>=1)o&1&&(e[s.point.y+r][n]=s.color)}return!0}eliminate(t,e,s,a){let r=0;for(;s<a;){if(t[s]===this.eliminateTarget){t.splice(s,1),t.unshift(0),e.splice(s,1),e.unshift(new Array(e[0].length)),r++;continue}s++}return r}isGameOver(t){const e=t.structure.length;for(let s=0;s<e;s++)if(t.point.y+s<0)return!0;return!1}drawBg(t,e,s,a){t.clearRect(0,0,t.canvas.width,t.canvas.height);for(let r=0;r<e.length;r++)for(let n=0;n<e[r].length;n++)e[r][n]!==void 0&&_(t,{point:{x:n*s,y:r*a},width:s,height:a,color:e[r][n]})}drawBrick(t,e,s=1){F(t,e,s)}drawNextBrick(t,e){t.clearRect(0,0,t.canvas.width,t.canvas.height),this.drawBrick(t,{...e,point:{x:0,y:0}})}computeScore(t){switch(t){case 0:return 20;case 1:return 120;case 2:return 320;case 3:return 720;case 4:return 1520;default:return 20}}}const I=R(K),M=new I,g={operate:{left:["a","ArrowLeft"],right:["d","ArrowRight"],up:["w","ArrowUp"],down:["s","ArrowDown"],bottom:[" "]},onceKey:["up","bottom"],speedUpKey:["down"],speedUpRate:2,pause:["Enter","p"]},B={left:!1,right:!1,up:!1,down:!1,bottom:!1};let d=null;window.onkeydown=i=>{switch(document.activeElement===i.target&&i.preventDefault(),!0){case g.pause.some(t=>t===i.key):d=i.key;break;case Object.values(g.operate).flat(1).some(t=>t===i.key):d=i.key}};window.onkeyup=i=>{switch(!0){case d===i.key:d=null;default:let t;(t=O(i.key))&&(B[t]=!1)}};function O(i){if(g.pause.some(t=>t===i))return"pause";for(const[t,e]of Object.entries(g.operate))if(e.some(s=>s===i))return t}const U=i=>{let t=1e3/c.keySpeed;return g.speedUpKey.some(e=>e===i)&&(t=1e3/g.speedUpRate/c.keySpeed),t},P=function(){const i={left:"left",right:"right",down:"downOne",bottom:"downToBottom",up:"rotate"};return(t,e)=>g.onceKey.some(s=>s===e)&&B[e]?null:t[i[e]].bind(t)}(),Y=i=>g.pause.some(t=>t===i);let x=0;const q=function(i,t,e){if(d===null||t)return;if(Y(d)){e.pauseGame(),d=null;return}if(i)return;let s=Date.now();const a=O(d);if(!B[a]){x=s;let n=P(e,a);n==null||n(),B[a]=!0;return}let r=U(a);if(s-x>=r){x=s-(s-x)%r;let n=P(e,a);n==null||n()}};class z{constructor(t,e,s,a){this.game=t,this.canvasWithMapCtx=e,this.brick=s,this.Player=a}takeTurns(t){this.brick=t}left(){this.brick.left(this.canvasWithMapCtx.mapBinary)}right(){this.brick.right(this.canvasWithMapCtx.mapBinary)}downOne(){this.brick.downOne(this.canvasWithMapCtx.mapBinary)&&(this.brick.isRecycle=!0)}downToBottom(){this.brick.downToBottom(this.canvasWithMapCtx.mapBinary)&&(this.brick.isRecycle=!0)}rotate(){this.brick.rotate(this.canvasWithMapCtx.mapBinary)}pauseGame(){this.game.state.pause?this.Player.playGame():this.Player.pauseGame()}}class W{constructor(t){h(this,"operation");h(this,"gameHelper");h(this,"lastTime",0);h(this,"pauseTime",0);h(this,"game");h(this,"over",!1);h(this,"pause",!1);h(this,"_brick");h(this,"_nextBrick");h(this,"_canvasWithMapCtx");this.gameHelper=M,this.game=t,this._brick=new f(this.gameHelper.getRandomLetter()),this._nextBrick=new f(this.gameHelper.getRandomLetter()),this._canvasWithMapCtx=new G,this.operation=new z(this.game,this._canvasWithMapCtx,this.brick,{playGame:this.playGame.bind(this),pauseGame:this.pauseGame.bind(this),togglePause:this.togglePause.bind(this)})}get canvasWithMapCtx(){return this._canvasWithMapCtx}get brick(){return this._brick}get nextBrick(){return this._nextBrick}render(t){if(this.userActions(),this.pause){this.cachePauseTime(t);return}this.over||(this.clearCanvas(this.canvasWithMapCtx.brickCtx),this.lastTime=t,this.draw(),this.update(t-this.pauseTime),this.checkBrickState(t-this.pauseTime))}clearCanvas(t){t.clearRect(0,0,t.canvas.width,t.canvas.height)}draw(){c.showLandingPoint?this.draw=this.drawWithLandingPoint:this.draw=this.drawWithoutLandingPoint,this.draw()}drawWithLandingPoint(){this.brick.landingPoint||this.brick.computeLandingPoint(this.canvasWithMapCtx.mapBinary),this.gameHelper.drawBrick(this.canvasWithMapCtx.brickCtx,this.brick),this.gameHelper.drawBrick(this.canvasWithMapCtx.brickCtx,{...this.brick,point:this.brick.landingPoint},.3)}drawWithoutLandingPoint(){this.gameHelper.drawBrick(this.canvasWithMapCtx.brickCtx,this.brick)}update(t){this.operation.brick.update(t,this.canvasWithMapCtx.mapBinary)&&(this.operation.brick.isRecycle=!0)}checkBrickState(t){this.operation.brick.isRecycle&&this.replaceNextOne(t)}replaceNextOne(t){if(!this.gameHelper.record(this.canvasWithMapCtx.mapBinary,this.canvasWithMapCtx.bg,this.brick)){this.over=!0,this.game.state.setOver();return}const s=this.gameHelper.eliminate(this.canvasWithMapCtx.mapBinary,this.canvasWithMapCtx.bg,this.brick.point.y,Math.min(this.brick.point.y+this.brick.structure.length,this.canvasWithMapCtx.mapBinary.length));console.time("drawBg"),this.gameHelper.drawBg(this.canvasWithMapCtx.bgCtx,this.canvasWithMapCtx.bg,f.width,f.height),console.timeEnd("drawBg");const a=this.gameHelper.computeScore(s);this._brick=this.nextBrick,this._nextBrick=new f(this.gameHelper.getRandomLetter(),t),this.brick.correctLastTime(t),this.operation.takeTurns(this.brick),this.game.state.setNextBrick(this.nextBrick,this),this.game.state.setScore(a+this.game.state.score),this.game.state.setEliminateNum(s+this.game.state.eliminateNum)}cachePauseTime(t){this.pauseTime+=t-this.lastTime,this.lastTime=t}playGame(){this.game.state.setPause(!1),this.pause=!1}pauseGame(){this.game.state.setPause(!0),this.pause=!0}togglePause(){this.game.state.setPause(!this.game.state.pause),this.pause=!this.pause}userActions(){q(this.pause,this.over,this.operation)}}class V{constructor(){h(this,"_nextBrick");h(this,"_over");h(this,"_pause");h(this,"_score");h(this,"_eliminateNum");h(this,"_playing");this.initState()}initState(){this._nextBrick=null,this._over=!1,this._pause=!1,this._score=0,this._eliminateNum=0,this._playing=!1}get nextBrick(){return this._nextBrick}get over(){return this._over}get pause(){return this._pause}get score(){return this._score}get eliminateNum(){return this._eliminateNum}get playing(){return this._playing}setNextBrick(t,e){this._nextBrick=t,t&&M.drawNextBrick(e.canvasWithMapCtx.nextBrickCtx,t)}setOver(){this.setPlaying(!1),this._over=!0}setPause(t){this._pause=t}setScore(t){this._score=t}setPlaying(t){this._playing=t}setEliminateNum(t){this._eliminateNum=t}}const X=R(V),$=A(new X),J=$;class it{constructor(){h(this,"renderer");h(this,"_state");h(this,"startWithEnd");h(this,"startRaf");h(this,"cancelRaf");this.renderer=new W(this),this._state=J,this.defineRaf(this.renderer)}get state(){return this._state}defineRaf(t){this.startWithEnd=D((e=performance.now())=>{t.render(e)},c.FPS),this.startRaf=this.startWithEnd[0],this.cancelRaf=this.startWithEnd[1]}startGame(){this.startRaf(),this.state.setPlaying(!0),this.state.setNextBrick(this.renderer.nextBrick,this.renderer)}cancelGame(){this.cancelRaf()}restartGame(){this.cancelRaf(),this.state.initState(),this.renderer=new W(this),this.defineRaf(this.renderer),this.startRaf(),this.state.setPlaying(!0),this.state.setNextBrick(this.renderer.nextBrick,this.renderer)}playGame(){this.renderer.playGame()}pauseGame(){this.renderer.pauseGame()}togglePause(){this.renderer.togglePause()}}export{it as default};
