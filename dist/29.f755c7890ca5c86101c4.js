(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{d4kT:function(t,i,s){"use strict";s.r(i);i.default=class{constructor(t,i){this.renderCtx=t,this.isBlink=!!i.isBlink,this.isMeteor=!!i.isMeteor;let{x:s,y:a}=this.createPoint();this.x=s,this.y=a,this.radius=this.isMeteor?this.random(3,8):this.random(1,3),this.alpha=this.isMeteor?1:this.random(0,1),this.initCanvas()}initCanvas(){let t=this.radius,i=document.createElement("canvas");i.width=2*t,i.height=2*t;let s=i.getContext("2d"),a=s.createRadialGradient(t,t,0,t,t,t);a.addColorStop(.25,"#fff"),a.addColorStop(.4,"#ccc"),a.addColorStop(.9,"hsl(217, 61%, 33%)"),a.addColorStop(1,"transparent"),s.fillStyle=a,s.beginPath(),s.arc(t,t,t,0,2*Math.PI),s.fill(),this.canvas=i}random(t,i){return Math.floor(Math.random()*(i-t+1))+t}createPoint(){let{renderCtx:t,isMeteor:i,radius:s}=this,{width:a,height:e}=t.canvas;return{x:this.random(0,i?2*a:a),y:i?-3:this.random(0,e)}}blink(){this.isBlink&&(this.alpha<0?this.alpha+=.01:this.alpha-=.01)}meteor(){let{renderCtx:t}=this,{width:i,height:s}=t.canvas;if(this.x<0||this.y>s){let{x:t,y:i}=this.createPoint();this.x=t,this.y=i}this.x-=1*this.radius/10,this.y+=2*this.radius/10}render(){let{renderCtx:t,canvas:i,isMeteor:s,isBlink:a}=this;return a&&this.blink(),s&&this.meteor(),t.save(),t.globalAlpha=this.alpha,t.drawImage(i,this.x,this.y,this.radius,this.radius),t.restore(),this}}}}]);