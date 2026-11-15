(()=>{'use strict';
const boot=()=>{
 const root=document.querySelector('[data-home-motion]');if(!root)return;
 const steps=[...root.querySelectorAll('.motion-step')],svg=root.querySelector('.motion-svg');
 const triangle=svg?.querySelector('.shape-triangle'),square=svg?.querySelector('.shape-square'),cross=svg?.querySelector('.shape-cross'),pad=svg?.querySelector('.shape-controller');
 const counter=root.querySelector('.motion-counter'),bar=root.querySelector('.motion-progress-track i'),footer=document.querySelector('[data-home-footer]');
 if(!svg||steps.length!==7||!triangle||!square||!cross||!pad)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const activate=(index)=>{steps.forEach((s,i)=>s.classList.toggle('is-active',i===index));if(counter)counter.textContent=String(index).padStart(2,'0')+' / 06'};
 if(window.gsap&&window.ScrollTrigger&&!reduce){
  const gsap=window.gsap,ST=window.ScrollTrigger;gsap.registerPlugin(ST);
  const shapes=[triangle,square,cross,pad];gsap.set(shapes,{transformOrigin:'50% 50%',force3D:true});
  gsap.set(triangle,{x:-innerWidth*.28,y:-105,rotation:-35,scale:.55,autoAlpha:0});
  gsap.set(square,{x:innerWidth*.3,y:105,rotation:-40,scale:.45,autoAlpha:0});
  gsap.set(cross,{x:-innerWidth*.26,y:-55,rotation:90,scale:.5,autoAlpha:0});
  gsap.set(pad,{y:140,rotationX:45,scale:.55,autoAlpha:0});
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:root,start:'top top',end:()=>'+='+Math.round(innerHeight*5.4),scrub:1.1,invalidateOnRefresh:true}});
  tl.to(triangle,{x:0,y:0,rotation:0,scale:1,autoAlpha:1,duration:1.1})
    .to(triangle,{x:-innerWidth*.13,y:innerHeight*.12,rotation:180,scale:.62,duration:.65})
    .to(square,{x:0,y:0,rotation:360,scale:1,autoAlpha:1,duration:1},'<')
    .to([triangle,square],{rotationY:180,rotation:540,duration:.6})
    .to(cross,{x:0,y:0,rotation:450,scale:1,autoAlpha:1,duration:1},'<')
    .to([triangle,square,cross],{x:0,y:-25,rotation:720,scale:.42,autoAlpha:.0,duration:.65})
    .to(pad,{y:0,rotationX:0,rotationY:0,rotation:0,scale:1,autoAlpha:1,duration:1.1},'<')
    .to(pad,{scale:.9,autoAlpha:.15,duration:.45})
    .to('.welcome-copy',{scale:1.04,filter:'brightness(1.7)',duration:1.1},'<');
  steps.forEach((step,index)=>ST.create({trigger:step,start:'top 58%',end:'bottom 42%',onEnter:()=>activate(index),onEnterBack:()=>activate(index)}));
  ST.create({trigger:footer||steps[6],start:'bottom bottom',onEnter:()=>{if(bar)bar.style.width='100%'}});
  const progress=()=>{if(!bar)return;const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%'};addEventListener('scroll',progress,{passive:true});progress();
  const welcome=steps[5],welcomeText=welcome.querySelector('h2');
  gsap.fromTo(welcomeText,{z:-300,scale:.5,autoAlpha:.15,filter:'brightness(.45)'},{z:0,scale:1,autoAlpha:1,filter:'brightness(1.7)',ease:'power3.out',scrollTrigger:{trigger:welcome,start:'top 70%',end:'center center',scrub:1}});
  ST.refresh();
 }else{
  // Native fallback remains functional if a CDN is blocked or reduced motion is enabled.
  const showAll=reduce;steps.forEach((s,i)=>{if(showAll)s.classList.add('is-active')});
  const update=()=>{const y=scrollY+innerHeight*.5;let active=0;steps.forEach((s,i)=>{if(y>=s.offsetTop)active=i});activate(active);const p=Math.max(0,Math.min(1,scrollY/(document.documentElement.scrollHeight-innerHeight)));if(bar)bar.style.width=(p*100)+'%';const w=innerWidth;
   const place=(el,x,y,r,s,o)=>{el.style.opacity=String(o);el.style.transform='translate('+x+'px,'+y+'px) rotate('+r+'deg) scale('+s+')'};
   const t=Math.max(0,Math.min(1,(y-steps[1].offsetTop)/innerHeight)),q=Math.max(0,Math.min(1,(y-steps[2].offsetTop)/innerHeight)),c=Math.max(0,Math.min(1,(y-steps[3].offsetTop)/innerHeight)),p2=Math.max(0,Math.min(1,(y-steps[4].offsetTop)/innerHeight));
   const sm=v=>v*v*(3-2*v);place(triangle,(1-sm(t))*-w*.25,0,360*t,1,reduce?0:1-p2);place(square,(1-sm(q))*w*.25,0,360*q,1,q*(1-p2));place(cross,(1-sm(c))*-w*.2,0,450*c,1,c*(1-p2));place(pad,0,(1-sm(p2))*100,0,1,p2);
  };addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
 }
 // Footer remains the normal shared PPSX33 footer. Redirect only after the visitor has
 // reached and continued past it, rather than cutting off the page before its details.
 let leaving=false;const redirectAtEnd=()=>{if(reduce||leaving||!footer)return;const remaining=document.documentElement.scrollHeight-(scrollY+innerHeight);if(remaining<24&&scrollY>steps[5].offsetTop){leaving=true;location.assign('/About/')}};addEventListener('scroll',redirectAtEnd,{passive:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();