import{r as h}from"./index-wSCK2UMg.js";import{j as Z}from"./jsx-runtime-B6V7T9My.js";import{w as S,e as f,u as $e}from"./index-ZFvsOP-T.js";function Ge(e){var t,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var a=e.length;for(t=0;t<a;t++)e[t]&&(n=Ge(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function Ue(){for(var e,t,n=0,r="",a=arguments.length;n<a;n++)(e=arguments[n])&&(t=Ge(e))&&(r&&(r+=" "),r+=t);return r}const ne="-",Fe=e=>{const t=Je(e),{conflictingClassGroups:n,conflictingClassGroupModifiers:r}=e;return{getClassGroupId:i=>{const s=i.split(ne);return s[0]===""&&s.length!==1&&s.shift(),Pe(s,t)||Ze(i)},getConflictingClassGroupIds:(i,s)=>{const d=n[i]||[];return s&&r[i]?[...d,...r[i]]:d}}},Pe=(e,t)=>{var i;if(e.length===0)return t.classGroupId;const n=e[0],r=t.nextPart.get(n),a=r?Pe(e.slice(1),r):void 0;if(a)return a;if(t.validators.length===0)return;const o=e.join(ne);return(i=t.validators.find(({validator:s})=>s(o)))==null?void 0:i.classGroupId},de=/^\[(.+)\]$/,Ze=e=>{if(de.test(e)){const t=de.exec(e)[1],n=t==null?void 0:t.substring(0,t.indexOf(":"));if(n)return"arbitrary.."+n}},Je=e=>{const{theme:t,prefix:n}=e,r={nextPart:new Map,validators:[]};return Xe(Object.entries(e.classGroups),n).forEach(([o,i])=>{ee(i,r,o,t)}),r},ee=(e,t,n,r)=>{e.forEach(a=>{if(typeof a=="string"){const o=a===""?t:ue(t,a);o.classGroupId=n;return}if(typeof a=="function"){if(Ke(a)){ee(a(r),t,n,r);return}t.validators.push({validator:a,classGroupId:n});return}Object.entries(a).forEach(([o,i])=>{ee(i,ue(t,o),n,r)})})},ue=(e,t)=>{let n=e;return t.split(ne).forEach(r=>{n.nextPart.has(r)||n.nextPart.set(r,{nextPart:new Map,validators:[]}),n=n.nextPart.get(r)}),n},Ke=e=>e.isThemeGetter,Xe=(e,t)=>t?e.map(([n,r])=>{const a=r.map(o=>typeof o=="string"?t+o:typeof o=="object"?Object.fromEntries(Object.entries(o).map(([i,s])=>[t+i,s])):o);return[n,a]}):e,Qe=e=>{if(e<1)return{get:()=>{},set:()=>{}};let t=0,n=new Map,r=new Map;const a=(o,i)=>{n.set(o,i),t++,t>e&&(t=0,r=n,n=new Map)};return{get(o){let i=n.get(o);if(i!==void 0)return i;if((i=r.get(o))!==void 0)return a(o,i),i},set(o,i){n.has(o)?n.set(o,i):a(o,i)}}},je="!",Ye=e=>{const{separator:t,experimentalParseClassName:n}=e,r=t.length===1,a=t[0],o=t.length,i=s=>{const d=[];let c=0,m=0,x;for(let u=0;u<s.length;u++){let w=s[u];if(c===0){if(w===a&&(r||s.slice(u,u+o)===t)){d.push(s.slice(m,u)),m=u+o;continue}if(w==="/"){x=u;continue}}w==="["?c++:w==="]"&&c--}const v=d.length===0?s:s.substring(m),C=v.startsWith(je),B=C?v.substring(1):v,b=x&&x>m?x-m:void 0;return{modifiers:d,hasImportantModifier:C,baseClassName:B,maybePostfixModifierPosition:b}};return n?s=>n({className:s,parseClassName:i}):i},et=e=>{if(e.length<=1)return e;const t=[];let n=[];return e.forEach(r=>{r[0]==="["?(t.push(...n.sort(),r),n=[]):n.push(r)}),t.push(...n.sort()),t},tt=e=>({cache:Qe(e.cacheSize),parseClassName:Ye(e),...Fe(e)}),nt=/\s+/,rt=(e,t)=>{const{parseClassName:n,getClassGroupId:r,getConflictingClassGroupIds:a}=t,o=[],i=e.trim().split(nt);let s="";for(let d=i.length-1;d>=0;d-=1){const c=i[d],{modifiers:m,hasImportantModifier:x,baseClassName:v,maybePostfixModifierPosition:C}=n(c);let B=!!C,b=r(B?v.substring(0,C):v);if(!b){if(!B){s=c+(s.length>0?" "+s:s);continue}if(b=r(v),!b){s=c+(s.length>0?" "+s:s);continue}B=!1}const u=et(m).join(":"),w=x?u+je:u,k=w+b;if(o.includes(k))continue;o.push(k);const A=a(b,B);for(let I=0;I<A.length;++I){const M=A[I];o.push(w+M)}s=c+(s.length>0?" "+s:s)}return s};function ot(){let e=0,t,n,r="";for(;e<arguments.length;)(t=arguments[e++])&&(n=Me(t))&&(r&&(r+=" "),r+=n);return r}const Me=e=>{if(typeof e=="string")return e;let t,n="";for(let r=0;r<e.length;r++)e[r]&&(t=Me(e[r]))&&(n&&(n+=" "),n+=t);return n};function at(e,...t){let n,r,a,o=i;function i(d){const c=t.reduce((m,x)=>x(m),e());return n=tt(c),r=n.cache.get,a=n.cache.set,o=s,s(d)}function s(d){const c=r(d);if(c)return c;const m=rt(d,n);return a(d,m),m}return function(){return o(ot.apply(null,arguments))}}const p=e=>{const t=n=>n[e]||[];return t.isThemeGetter=!0,t},Ve=/^\[(?:([a-z-]+):)?(.+)\]$/i,st=/^\d+\/\d+$/,it=new Set(["px","full","screen"]),lt=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,ct=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,dt=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,ut=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,pt=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,E=e=>z(e)||it.has(e)||st.test(e),L=e=>D(e,"length",xt),z=e=>!!e&&!Number.isNaN(Number(e)),Y=e=>D(e,"number",z),G=e=>!!e&&Number.isInteger(Number(e)),gt=e=>e.endsWith("%")&&z(e.slice(0,-1)),l=e=>Ve.test(e),R=e=>lt.test(e),mt=new Set(["length","size","percentage"]),ft=e=>D(e,mt,Oe),bt=e=>D(e,"position",Oe),ht=new Set(["image","url"]),yt=e=>D(e,ht,Bt),vt=e=>D(e,"",wt),P=()=>!0,D=(e,t,n)=>{const r=Ve.exec(e);return r?r[1]?typeof t=="string"?r[1]===t:t.has(r[1]):n(r[2]):!1},xt=e=>ct.test(e)&&!dt.test(e),Oe=()=>!1,wt=e=>ut.test(e),Bt=e=>pt.test(e),kt=()=>{const e=p("colors"),t=p("spacing"),n=p("blur"),r=p("brightness"),a=p("borderColor"),o=p("borderRadius"),i=p("borderSpacing"),s=p("borderWidth"),d=p("contrast"),c=p("grayscale"),m=p("hueRotate"),x=p("invert"),v=p("gap"),C=p("gradientColorStops"),B=p("gradientColorStopPositions"),b=p("inset"),u=p("margin"),w=p("opacity"),k=p("padding"),A=p("saturate"),I=p("scale"),M=p("sepia"),re=p("skew"),oe=p("space"),ae=p("translate"),J=()=>["auto","contain","none"],K=()=>["auto","hidden","clip","visible","scroll"],X=()=>["auto",l,t],g=()=>[l,t],se=()=>["",E,L],V=()=>["auto",z,l],ie=()=>["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top"],O=()=>["solid","dashed","dotted","double","none"],le=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],Q=()=>["start","end","center","between","around","evenly","stretch"],N=()=>["","0",l],ce=()=>["auto","avoid","all","avoid-page","page","left","right","column"],T=()=>[z,l];return{cacheSize:500,separator:":",theme:{colors:[P],spacing:[E,L],blur:["none","",R,l],brightness:T(),borderColor:[e],borderRadius:["none","","full",R,l],borderSpacing:g(),borderWidth:se(),contrast:T(),grayscale:N(),hueRotate:T(),invert:N(),gap:g(),gradientColorStops:[e],gradientColorStopPositions:[gt,L],inset:X(),margin:X(),opacity:T(),padding:g(),saturate:T(),scale:T(),sepia:N(),skew:T(),space:g(),translate:g()},classGroups:{aspect:[{aspect:["auto","square","video",l]}],container:["container"],columns:[{columns:[R]}],"break-after":[{"break-after":ce()}],"break-before":[{"break-before":ce()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:[...ie(),l]}],overflow:[{overflow:K()}],"overflow-x":[{"overflow-x":K()}],"overflow-y":[{"overflow-y":K()}],overscroll:[{overscroll:J()}],"overscroll-x":[{"overscroll-x":J()}],"overscroll-y":[{"overscroll-y":J()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:[b]}],"inset-x":[{"inset-x":[b]}],"inset-y":[{"inset-y":[b]}],start:[{start:[b]}],end:[{end:[b]}],top:[{top:[b]}],right:[{right:[b]}],bottom:[{bottom:[b]}],left:[{left:[b]}],visibility:["visible","invisible","collapse"],z:[{z:["auto",G,l]}],basis:[{basis:X()}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["wrap","wrap-reverse","nowrap"]}],flex:[{flex:["1","auto","initial","none",l]}],grow:[{grow:N()}],shrink:[{shrink:N()}],order:[{order:["first","last","none",G,l]}],"grid-cols":[{"grid-cols":[P]}],"col-start-end":[{col:["auto",{span:["full",G,l]},l]}],"col-start":[{"col-start":V()}],"col-end":[{"col-end":V()}],"grid-rows":[{"grid-rows":[P]}],"row-start-end":[{row:["auto",{span:[G,l]},l]}],"row-start":[{"row-start":V()}],"row-end":[{"row-end":V()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":["auto","min","max","fr",l]}],"auto-rows":[{"auto-rows":["auto","min","max","fr",l]}],gap:[{gap:[v]}],"gap-x":[{"gap-x":[v]}],"gap-y":[{"gap-y":[v]}],"justify-content":[{justify:["normal",...Q()]}],"justify-items":[{"justify-items":["start","end","center","stretch"]}],"justify-self":[{"justify-self":["auto","start","end","center","stretch"]}],"align-content":[{content:["normal",...Q(),"baseline"]}],"align-items":[{items:["start","end","center","baseline","stretch"]}],"align-self":[{self:["auto","start","end","center","stretch","baseline"]}],"place-content":[{"place-content":[...Q(),"baseline"]}],"place-items":[{"place-items":["start","end","center","baseline","stretch"]}],"place-self":[{"place-self":["auto","start","end","center","stretch"]}],p:[{p:[k]}],px:[{px:[k]}],py:[{py:[k]}],ps:[{ps:[k]}],pe:[{pe:[k]}],pt:[{pt:[k]}],pr:[{pr:[k]}],pb:[{pb:[k]}],pl:[{pl:[k]}],m:[{m:[u]}],mx:[{mx:[u]}],my:[{my:[u]}],ms:[{ms:[u]}],me:[{me:[u]}],mt:[{mt:[u]}],mr:[{mr:[u]}],mb:[{mb:[u]}],ml:[{ml:[u]}],"space-x":[{"space-x":[oe]}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":[oe]}],"space-y-reverse":["space-y-reverse"],w:[{w:["auto","min","max","fit","svw","lvw","dvw",l,t]}],"min-w":[{"min-w":[l,t,"min","max","fit"]}],"max-w":[{"max-w":[l,t,"none","full","min","max","fit","prose",{screen:[R]},R]}],h:[{h:[l,t,"auto","min","max","fit","svh","lvh","dvh"]}],"min-h":[{"min-h":[l,t,"min","max","fit","svh","lvh","dvh"]}],"max-h":[{"max-h":[l,t,"min","max","fit","svh","lvh","dvh"]}],size:[{size:[l,t,"auto","min","max","fit"]}],"font-size":[{text:["base",R,L]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:["thin","extralight","light","normal","medium","semibold","bold","extrabold","black",Y]}],"font-family":[{font:[P]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractons"],tracking:[{tracking:["tighter","tight","normal","wide","wider","widest",l]}],"line-clamp":[{"line-clamp":["none",z,Y]}],leading:[{leading:["none","tight","snug","normal","relaxed","loose",E,l]}],"list-image":[{"list-image":["none",l]}],"list-style-type":[{list:["none","disc","decimal",l]}],"list-style-position":[{list:["inside","outside"]}],"placeholder-color":[{placeholder:[e]}],"placeholder-opacity":[{"placeholder-opacity":[w]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"text-color":[{text:[e]}],"text-opacity":[{"text-opacity":[w]}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...O(),"wavy"]}],"text-decoration-thickness":[{decoration:["auto","from-font",E,L]}],"underline-offset":[{"underline-offset":["auto",E,l]}],"text-decoration-color":[{decoration:[e]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:g()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",l]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",l]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-opacity":[{"bg-opacity":[w]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:[...ie(),bt]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","round","space"]}]}],"bg-size":[{bg:["auto","cover","contain",ft]}],"bg-image":[{bg:["none",{"gradient-to":["t","tr","r","br","b","bl","l","tl"]},yt]}],"bg-color":[{bg:[e]}],"gradient-from-pos":[{from:[B]}],"gradient-via-pos":[{via:[B]}],"gradient-to-pos":[{to:[B]}],"gradient-from":[{from:[C]}],"gradient-via":[{via:[C]}],"gradient-to":[{to:[C]}],rounded:[{rounded:[o]}],"rounded-s":[{"rounded-s":[o]}],"rounded-e":[{"rounded-e":[o]}],"rounded-t":[{"rounded-t":[o]}],"rounded-r":[{"rounded-r":[o]}],"rounded-b":[{"rounded-b":[o]}],"rounded-l":[{"rounded-l":[o]}],"rounded-ss":[{"rounded-ss":[o]}],"rounded-se":[{"rounded-se":[o]}],"rounded-ee":[{"rounded-ee":[o]}],"rounded-es":[{"rounded-es":[o]}],"rounded-tl":[{"rounded-tl":[o]}],"rounded-tr":[{"rounded-tr":[o]}],"rounded-br":[{"rounded-br":[o]}],"rounded-bl":[{"rounded-bl":[o]}],"border-w":[{border:[s]}],"border-w-x":[{"border-x":[s]}],"border-w-y":[{"border-y":[s]}],"border-w-s":[{"border-s":[s]}],"border-w-e":[{"border-e":[s]}],"border-w-t":[{"border-t":[s]}],"border-w-r":[{"border-r":[s]}],"border-w-b":[{"border-b":[s]}],"border-w-l":[{"border-l":[s]}],"border-opacity":[{"border-opacity":[w]}],"border-style":[{border:[...O(),"hidden"]}],"divide-x":[{"divide-x":[s]}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":[s]}],"divide-y-reverse":["divide-y-reverse"],"divide-opacity":[{"divide-opacity":[w]}],"divide-style":[{divide:O()}],"border-color":[{border:[a]}],"border-color-x":[{"border-x":[a]}],"border-color-y":[{"border-y":[a]}],"border-color-s":[{"border-s":[a]}],"border-color-e":[{"border-e":[a]}],"border-color-t":[{"border-t":[a]}],"border-color-r":[{"border-r":[a]}],"border-color-b":[{"border-b":[a]}],"border-color-l":[{"border-l":[a]}],"divide-color":[{divide:[a]}],"outline-style":[{outline:["",...O()]}],"outline-offset":[{"outline-offset":[E,l]}],"outline-w":[{outline:[E,L]}],"outline-color":[{outline:[e]}],"ring-w":[{ring:se()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:[e]}],"ring-opacity":[{"ring-opacity":[w]}],"ring-offset-w":[{"ring-offset":[E,L]}],"ring-offset-color":[{"ring-offset":[e]}],shadow:[{shadow:["","inner","none",R,vt]}],"shadow-color":[{shadow:[P]}],opacity:[{opacity:[w]}],"mix-blend":[{"mix-blend":[...le(),"plus-lighter","plus-darker"]}],"bg-blend":[{"bg-blend":le()}],filter:[{filter:["","none"]}],blur:[{blur:[n]}],brightness:[{brightness:[r]}],contrast:[{contrast:[d]}],"drop-shadow":[{"drop-shadow":["","none",R,l]}],grayscale:[{grayscale:[c]}],"hue-rotate":[{"hue-rotate":[m]}],invert:[{invert:[x]}],saturate:[{saturate:[A]}],sepia:[{sepia:[M]}],"backdrop-filter":[{"backdrop-filter":["","none"]}],"backdrop-blur":[{"backdrop-blur":[n]}],"backdrop-brightness":[{"backdrop-brightness":[r]}],"backdrop-contrast":[{"backdrop-contrast":[d]}],"backdrop-grayscale":[{"backdrop-grayscale":[c]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[m]}],"backdrop-invert":[{"backdrop-invert":[x]}],"backdrop-opacity":[{"backdrop-opacity":[w]}],"backdrop-saturate":[{"backdrop-saturate":[A]}],"backdrop-sepia":[{"backdrop-sepia":[M]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":[i]}],"border-spacing-x":[{"border-spacing-x":[i]}],"border-spacing-y":[{"border-spacing-y":[i]}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["none","all","","colors","opacity","shadow","transform",l]}],duration:[{duration:T()}],ease:[{ease:["linear","in","out","in-out",l]}],delay:[{delay:T()}],animate:[{animate:["none","spin","ping","pulse","bounce",l]}],transform:[{transform:["","gpu","none"]}],scale:[{scale:[I]}],"scale-x":[{"scale-x":[I]}],"scale-y":[{"scale-y":[I]}],rotate:[{rotate:[G,l]}],"translate-x":[{"translate-x":[ae]}],"translate-y":[{"translate-y":[ae]}],"skew-x":[{"skew-x":[re]}],"skew-y":[{"skew-y":[re]}],"transform-origin":[{origin:["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",l]}],accent:[{accent:["auto",e]}],appearance:[{appearance:["none","auto"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",l]}],"caret-color":[{caret:[e]}],"pointer-events":[{"pointer-events":["none","auto"]}],resize:[{resize:["none","y","x",""]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":g()}],"scroll-mx":[{"scroll-mx":g()}],"scroll-my":[{"scroll-my":g()}],"scroll-ms":[{"scroll-ms":g()}],"scroll-me":[{"scroll-me":g()}],"scroll-mt":[{"scroll-mt":g()}],"scroll-mr":[{"scroll-mr":g()}],"scroll-mb":[{"scroll-mb":g()}],"scroll-ml":[{"scroll-ml":g()}],"scroll-p":[{"scroll-p":g()}],"scroll-px":[{"scroll-px":g()}],"scroll-py":[{"scroll-py":g()}],"scroll-ps":[{"scroll-ps":g()}],"scroll-pe":[{"scroll-pe":g()}],"scroll-pt":[{"scroll-pt":g()}],"scroll-pr":[{"scroll-pr":g()}],"scroll-pb":[{"scroll-pb":g()}],"scroll-pl":[{"scroll-pl":g()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",l]}],fill:[{fill:[e,"none"]}],"stroke-w":[{stroke:[E,L,Y]}],stroke:[{stroke:[e,"none"]}],sr:["sr-only","not-sr-only"],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]}}},Ct=at(kt);function j(...e){return Ct(Ue(e))}const We=h.forwardRef(({className:e,...t},n)=>React.createElement("svg",{ref:n,...t,viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",fill:"currentColor",className:j(e)},React.createElement("g",{className:"animated-spinner"},React.createElement("rect",{x:"11",y:"1",width:"2",height:"5",opacity:".14"}),React.createElement("rect",{x:"11",y:"1",width:"2",height:"5",transform:"rotate(30 12 12)",opacity:".29"}),React.createElement("rect",{x:"11",y:"1",width:"2",height:"5",transform:"rotate(60 12 12)",opacity:".43"}),React.createElement("rect",{x:"11",y:"1",width:"2",height:"5",transform:"rotate(90 12 12)",opacity:".57"}),React.createElement("rect",{x:"11",y:"1",width:"2",height:"5",transform:"rotate(120 12 12)",opacity:".71"}),React.createElement("rect",{x:"11",y:"1",width:"2",height:"5",transform:"rotate(150 12 12)",opacity:".86"}),React.createElement("rect",{x:"11",y:"1",width:"2",height:"5",transform:"rotate(180 12 12)"}))));We.displayName="AnimatedSpinner";const Tt=h.forwardRef(({className:e,...t},n)=>React.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",ref:n,...t,viewBox:"0 0 24 24",className:j(e),fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("rect",{x:"2",y:"5",width:"20",height:"14",rx:"2"}),React.createElement("line",{x1:"2",y1:"10",x2:"22",y2:"10"})));Tt.displayName="CreditCard";function Et(e,t){typeof e=="function"?e(t):e!=null&&(e.current=t)}function Lt(...e){return t=>e.forEach(n=>Et(n,t))}var qe=h.forwardRef((e,t)=>{const{children:n,...r}=e,a=h.Children.toArray(n),o=a.find(It);if(o){const i=o.props.children,s=a.map(d=>d===o?h.Children.count(i)>1?h.Children.only(null):h.isValidElement(i)?i.props.children:null:d);return Z.jsx(te,{...r,ref:t,children:h.isValidElement(i)?h.cloneElement(i,void 0,s):null})}return Z.jsx(te,{...r,ref:t,children:n})});qe.displayName="Slot";var te=h.forwardRef((e,t)=>{const{children:n,...r}=e;if(h.isValidElement(n)){const a=zt(n);return h.cloneElement(n,{...St(r,n.props),ref:t?Lt(t,a):a})}return h.Children.count(n)>1?h.Children.only(null):null});te.displayName="SlotClone";var Rt=({children:e})=>Z.jsx(Z.Fragment,{children:e});function It(e){return h.isValidElement(e)&&e.type===Rt}function St(e,t){const n={...t};for(const r in t){const a=e[r],o=t[r];/^on[A-Z]/.test(r)?a&&o?n[r]=(...s)=>{o(...s),a(...s)}:a&&(n[r]=a):r==="style"?n[r]={...a,...o}:r==="className"&&(n[r]=[a,o].filter(Boolean).join(" "))}return{...e,...n}}function zt(e){var r,a;let t=(r=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(a=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:a.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}function He(e){var t,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=He(e[t]))&&(r&&(r+=" "),r+=n);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function Dt(){for(var e,t,n=0,r="";n<arguments.length;)(e=arguments[n++])&&(t=He(e))&&(r&&(r+=" "),r+=t);return r}const pe=e=>typeof e=="boolean"?"".concat(e):e===0?"0":e,ge=Dt,At=(e,t)=>n=>{var r;if((t==null?void 0:t.variants)==null)return ge(e,n==null?void 0:n.class,n==null?void 0:n.className);const{variants:a,defaultVariants:o}=t,i=Object.keys(a).map(c=>{const m=n==null?void 0:n[c],x=o==null?void 0:o[c];if(m===null)return null;const v=pe(m)||pe(x);return a[c][v]}),s=n&&Object.entries(n).reduce((c,m)=>{let[x,v]=m;return v===void 0||(c[x]=v),c},{}),d=t==null||(r=t.compoundVariants)===null||r===void 0?void 0:r.reduce((c,m)=>{let{class:x,className:v,...C}=m;return Object.entries(C).every(B=>{let[b,u]=B;return Array.isArray(u)?u.includes({...o,...s}[b]):{...o,...s}[b]===u})?[...c,x,v]:c},[]);return ge(e,i,d,n==null?void 0:n.class,n==null?void 0:n.className)},Nt=At("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),_e=h.forwardRef(({className:e,variant:t,size:n,asChild:r=!1,...a},o)=>{const i=r?qe:"button";return h.createElement(i,{className:j(Nt({variant:t,size:n,className:e})),ref:o,...a})});_e.displayName="Button";const y=h.forwardRef(({loading:e=!1,className:t,children:n,...r},a)=>React.createElement(_e,{ref:a,...r,disabled:r.disabled?r.disabled:e,className:j(t,"relative")},React.createElement("span",{className:j(e?"opacity-0":"")},n),e?React.createElement("div",{className:"absolute inset-0 grid place-items-center"},React.createElement(We,{className:"h-6 w-6"})):null));y.displayName="LoadingButton";const Mt={title:"Components/LoadingButton",component:y,tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","destructive","outline","secondary","ghost","link"]},size:{control:"select",options:["lg","default","sm","icon"]},loading:{control:"boolean"},disabled:{control:"boolean"}}},W={args:{children:"Click me",loading:!1},play:async({canvasElement:e})=>{const t=S(e),n=t.getByText("Click me");await f(n).toBeInTheDocument(),await f(t.queryByTestId("spinner")).not.toBeInTheDocument()}},q={args:{children:"Loading...",loading:!0},play:async({canvasElement:e})=>{const t=S(e),n=t.getByText("Loading...");await f(n).toHaveClass("opacity-0"),await f(t.getByTestId("spinner")).toBeInTheDocument()}},H={render:()=>React.createElement("div",{className:"flex flex-wrap gap-4"},React.createElement(y,{variant:"default"},"Default"),React.createElement(y,{variant:"destructive"},"Destructive"),React.createElement(y,{variant:"outline"},"Outline"),React.createElement(y,{variant:"secondary"},"Secondary"),React.createElement(y,{variant:"ghost"},"Ghost"),React.createElement(y,{variant:"link"},"Link")),play:async({canvasElement:e})=>{const t=S(e),n=["Default","Destructive","Outline","Secondary","Ghost","Link"];for(const r of n)await f(t.getByText(r)).toBeInTheDocument()}},_={render:()=>React.createElement("div",{className:"flex flex-wrap items-center gap-4"},React.createElement(y,{size:"lg"},"Large"),React.createElement(y,{size:"default"},"Default"),React.createElement(y,{size:"sm"},"Small"),React.createElement(y,{size:"icon"},React.createElement("span",null,"★"))),play:async({canvasElement:e})=>{const t=S(e);await f(t.getByText("Large")).toBeInTheDocument(),await f(t.getByText("Default")).toBeInTheDocument(),await f(t.getByText("Small")).toBeInTheDocument(),await f(t.getByText("★")).toBeInTheDocument()}},$={render:function(){const[t,n]=h.useState(!1),r=()=>{n(!0),setTimeout(()=>n(!1),2e3)};return React.createElement(y,{loading:t,onClick:r,disabled:t},t?"Processing...":"Click to load")},play:async({canvasElement:e})=>{const t=S(e),n=t.getByText("Click to load");await f(n).toBeInTheDocument(),await f(t.queryByTestId("spinner")).not.toBeInTheDocument(),await $e.click(n);const r=t.getByText("Processing...");await f(r).toHaveClass("opacity-0"),await f(t.getByTestId("spinner")).toBeInTheDocument(),await new Promise(a=>setTimeout(a,2e3)),await f(t.getByText("Click to load")).toBeInTheDocument(),await f(t.queryByTestId("spinner")).not.toBeInTheDocument()}},U={args:{children:"Disabled Button",disabled:!0},play:async({canvasElement:e})=>{const n=S(e).getByText("Disabled Button");await f(n).toBeInTheDocument(),await f(n.closest("button")).toBeDisabled()}},F={render:()=>React.createElement("div",{className:"flex flex-wrap gap-4"},React.createElement(y,{loading:!0,variant:"default"},"Default"),React.createElement(y,{loading:!0,variant:"destructive"},"Destructive"),React.createElement(y,{loading:!0,variant:"outline"},"Outline"),React.createElement(y,{loading:!0,variant:"secondary"},"Secondary"),React.createElement(y,{loading:!0,variant:"ghost"},"Ghost"),React.createElement(y,{loading:!0,variant:"link"},"Link")),play:async({canvasElement:e})=>{const t=S(e),n=["Default","Destructive","Outline","Secondary","Ghost","Link"];for(const a of n){const o=t.getByText(a);await f(o).toBeInTheDocument(),await f(o).toHaveClass("opacity-0"),await f(o.closest("button")).toBeDisabled()}const r=t.queryAllByTestId("spinner");await f(r).toHaveLength(n.length)}};var me,fe,be;W.parameters={...W.parameters,docs:{...(me=W.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    children: 'Click me',
    loading: false
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Click me');
    await expect(button).toBeInTheDocument();
    await expect(canvas.queryByTestId('spinner')).not.toBeInTheDocument();
  }
}`,...(be=(fe=W.parameters)==null?void 0:fe.docs)==null?void 0:be.source}}};var he,ye,ve;q.parameters={...q.parameters,docs:{...(he=q.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    children: 'Loading...',
    loading: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText('Loading...');
    await expect(text).toHaveClass('opacity-0');
    await expect(canvas.getByTestId('spinner')).toBeInTheDocument();
  }
}`,...(ve=(ye=q.parameters)==null?void 0:ye.docs)==null?void 0:ve.source}}};var xe,we,Be;H.parameters={...H.parameters,docs:{...(xe=H.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4">
      <LoadingButton variant="default">Default</LoadingButton>
      <LoadingButton variant="destructive">Destructive</LoadingButton>
      <LoadingButton variant="outline">Outline</LoadingButton>
      <LoadingButton variant="secondary">Secondary</LoadingButton>
      <LoadingButton variant="ghost">Ghost</LoadingButton>
      <LoadingButton variant="link">Link</LoadingButton>
    </div>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const variants = ['Default', 'Destructive', 'Outline', 'Secondary', 'Ghost', 'Link'];
    for (const variant of variants) {
      await expect(canvas.getByText(variant)).toBeInTheDocument();
    }
  }
}`,...(Be=(we=H.parameters)==null?void 0:we.docs)==null?void 0:Be.source}}};var ke,Ce,Te;_.parameters={..._.parameters,docs:{...(ke=_.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-4">
      <LoadingButton size="lg">Large</LoadingButton>
      <LoadingButton size="default">Default</LoadingButton>
      <LoadingButton size="sm">Small</LoadingButton>
      <LoadingButton size="icon">
        <span>★</span>
      </LoadingButton>
    </div>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Large')).toBeInTheDocument();
    await expect(canvas.getByText('Default')).toBeInTheDocument();
    await expect(canvas.getByText('Small')).toBeInTheDocument();
    await expect(canvas.getByText('★')).toBeInTheDocument();
  }
}`,...(Te=(Ce=_.parameters)==null?void 0:Ce.docs)==null?void 0:Te.source}}};var Ee,Le,Re;$.parameters={...$.parameters,docs:{...(Ee=$.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  render: function Render() {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };
    return <LoadingButton loading={isLoading} onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Click to load'}
      </LoadingButton>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Initial state
    const button = canvas.getByText('Click to load');
    await expect(button).toBeInTheDocument();
    await expect(canvas.queryByTestId('spinner')).not.toBeInTheDocument();

    // Click and check loading state
    await userEvent.click(button);
    const processingText = canvas.getByText('Processing...');
    await expect(processingText).toHaveClass('opacity-0');
    await expect(canvas.getByTestId('spinner')).toBeInTheDocument();

    // Wait for loading to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    await expect(canvas.getByText('Click to load')).toBeInTheDocument();
    await expect(canvas.queryByTestId('spinner')).not.toBeInTheDocument();
  }
}`,...(Re=(Le=$.parameters)==null?void 0:Le.docs)==null?void 0:Re.source}}};var Ie,Se,ze;U.parameters={...U.parameters,docs:{...(Ie=U.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    children: 'Disabled Button',
    disabled: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText('Disabled Button');
    await expect(button).toBeInTheDocument();
    await expect(button.closest('button')).toBeDisabled();
  }
}`,...(ze=(Se=U.parameters)==null?void 0:Se.docs)==null?void 0:ze.source}}};var De,Ae,Ne;F.parameters={...F.parameters,docs:{...(De=F.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4">
      <LoadingButton loading variant="default">
        Default
      </LoadingButton>
      <LoadingButton loading variant="destructive">
        Destructive
      </LoadingButton>
      <LoadingButton loading variant="outline">
        Outline
      </LoadingButton>
      <LoadingButton loading variant="secondary">
        Secondary
      </LoadingButton>
      <LoadingButton loading variant="ghost">
        Ghost
      </LoadingButton>
      <LoadingButton loading variant="link">
        Link
      </LoadingButton>
    </div>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const variants = ['Default', 'Destructive', 'Outline', 'Secondary', 'Ghost', 'Link'];
    for (const variant of variants) {
      const button = canvas.getByText(variant);
      await expect(button).toBeInTheDocument();
      await expect(button).toHaveClass('opacity-0');
      await expect(button.closest('button')).toBeDisabled();
    }

    // Check spinners
    const spinners = canvas.queryAllByTestId('spinner');
    await expect(spinners).toHaveLength(variants.length);
  }
}`,...(Ne=(Ae=F.parameters)==null?void 0:Ae.docs)==null?void 0:Ne.source}}};const Vt=["Default","Loading","Variants","Sizes","Interactive","Disabled","LoadingVariants"];export{W as Default,U as Disabled,$ as Interactive,q as Loading,F as LoadingVariants,_ as Sizes,H as Variants,Vt as __namedExportsOrder,Mt as default};
