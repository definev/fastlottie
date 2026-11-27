(function dartProgram(){function copyProperties(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
b[q]=a[q]}}function mixinPropertiesHard(a,b){var s=Object.keys(a)
for(var r=0;r<s.length;r++){var q=s[r]
if(!b.hasOwnProperty(q)){b[q]=a[q]}}}function mixinPropertiesEasy(a,b){Object.assign(b,a)}var z=function(){var s=function(){}
s.prototype={p:{}}
var r=new s()
if(!(Object.getPrototypeOf(r)&&Object.getPrototypeOf(r).p===s.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var q=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(q))return true}}catch(p){}return false}()
function inherit(a,b){a.prototype.constructor=a
a.prototype["$i"+a.name]=a
if(b!=null){if(z){Object.setPrototypeOf(a.prototype,b.prototype)
return}var s=Object.create(b.prototype)
copyProperties(a.prototype,s)
a.prototype=s}}function inheritMany(a,b){for(var s=0;s<b.length;s++){inherit(b[s],a)}}function mixinEasy(a,b){mixinPropertiesEasy(b.prototype,a.prototype)
a.prototype.constructor=a}function mixinHard(a,b){mixinPropertiesHard(b.prototype,a.prototype)
a.prototype.constructor=a}function lazy(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){a[b]=d()}a[c]=function(){return this[b]}
return a[b]}}function lazyFinal(a,b,c,d){var s=a
a[b]=s
a[c]=function(){if(a[b]===s){var r=d()
if(a[b]!==s){A.oW(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.h(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.jL(b)
return new s(c,this)}:function(){if(s===null)s=A.jL(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.jL(a).prototype
return s}}var x=0
function tearOffParameters(a,b,c,d,e,f,g,h,i,j){if(typeof h=="number"){h+=x}return{co:a,iS:b,iI:c,rC:d,dV:e,cs:f,fs:g,fT:h,aI:i||0,nDA:j}}function installStaticTearOff(a,b,c,d,e,f,g,h){var s=tearOffParameters(a,true,false,c,d,e,f,g,h,false)
var r=staticTearOffGetter(s)
a[b]=r}function installInstanceTearOff(a,b,c,d,e,f,g,h,i,j){c=!!c
var s=tearOffParameters(a,false,c,d,e,f,g,h,i,!!j)
var r=instanceTearOffGetter(c,s)
a[b]=r}function setOrUpdateInterceptorsByTag(a){var s=v.interceptorsByTag
if(!s){v.interceptorsByTag=a
return}copyProperties(a,s)}function setOrUpdateLeafTags(a){var s=v.leafTags
if(!s){v.leafTags=a
return}copyProperties(a,s)}function updateTypes(a){var s=v.types
var r=s.length
s.push.apply(s,a)
return r}function updateHolder(a,b){copyProperties(b,a)
return a}var hunkHelpers=function(){var s=function(a,b,c,d,e){return function(f,g,h,i){return installInstanceTearOff(f,g,a,b,c,d,[h],i,e,false)}},r=function(a,b,c,d){return function(e,f,g,h){return installStaticTearOff(e,f,a,b,c,[g],h,d)}}
return{inherit:inherit,inheritMany:inheritMany,mixin:mixinEasy,mixinHard:mixinHard,installStaticTearOff:installStaticTearOff,installInstanceTearOff:installInstanceTearOff,_instance_0u:s(0,0,null,["$0"],0),_instance_1u:s(0,1,null,["$1"],0),_instance_2u:s(0,2,null,["$2"],0),_instance_0i:s(1,0,null,["$0"],0),_instance_1i:s(1,1,null,["$1"],0),_instance_2i:s(1,2,null,["$2"],0),_static_0:r(0,null,["$0"],0),_static_1:r(1,null,["$1"],0),_static_2:r(2,null,["$2"],0),makeConstList:makeConstList,lazy:lazy,lazyFinal:lazyFinal,updateHolder:updateHolder,convertToFastObject:convertToFastObject,updateTypes:updateTypes,setOrUpdateInterceptorsByTag:setOrUpdateInterceptorsByTag,setOrUpdateLeafTags:setOrUpdateLeafTags}}()
function initializeDeferredHunk(a){x=v.types.length
a(hunkHelpers,v,w,$)}var J={
jP(a,b,c,d){return{i:a,p:b,e:c,x:d}},
iu(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.jN==null){A.oG()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.f(A.kA("Return interceptor for "+A.w(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.hM
if(o==null)o=$.hM=A.it(n)
p=q[o]}if(p!=null)return p
p=A.oK(a)
if(p!=null)return p
if(typeof a=="function")return B.a7
s=Object.getPrototypeOf(a)
if(s==null)return B.F
if(s===Object.prototype)return B.F
if(typeof q=="function"){o=$.hM
if(o==null)o=$.hM=A.it(n)
Object.defineProperty(q,o,{value:B.w,enumerable:false,writable:true,configurable:true})
return B.w}return B.w},
mj(a,b){if(a<0||a>4294967295)throw A.f(A.ar(a,0,4294967295,"length",null))
return J.ml(new Array(a),b)},
mk(a,b){if(a<0)throw A.f(A.ao("Length must be a non-negative integer: "+a,null))
return A.h(new Array(a),b.i("y<0>"))},
ml(a,b){var s=A.h(a,b.i("y<0>"))
s.$flags=1
return s},
ke(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
mm(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.ke(r))break;++b}return b},
mn(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.ke(q))break}return b},
aE(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cI.prototype
return J.dP.prototype}if(typeof a=="string")return J.cc.prototype
if(a==null)return J.cJ.prototype
if(typeof a=="boolean")return J.cH.prototype
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ax.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iu(a)},
V(a){if(typeof a=="string")return J.cc.prototype
if(a==null)return a
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ax.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iu(a)},
bF(a){if(a==null)return a
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ax.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iu(a)},
c6(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.ax.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iu(a)},
l(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aE(a).G(a,b)},
ai(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.oJ(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.V(a).h(a,b)},
lV(a,b){return J.bF(a).aq(a,b)},
k_(a,b,c){return J.c6(a).dP(a,b,c)},
iX(a,b,c){return J.c6(a).dQ(a,b,c)},
lW(a,b,c){return J.c6(a).dR(a,b,c)},
lX(a,b,c){return J.c6(a).dS(a,b,c)},
lY(a){return J.c6(a).dT(a)},
c9(a,b,c){return J.c6(a).bv(a,b,c)},
lZ(a,b){return J.bF(a).aH(a,b)},
k0(a){return J.c6(a).ga7(a)},
m_(a){return J.bF(a).ga5(a)},
au(a){return J.aE(a).gX(a)},
iY(a){return J.V(a).gS(a)},
cA(a){return J.bF(a).gD(a)},
aL(a){return J.V(a).gk(a)},
m0(a){return J.aE(a).gY(a)},
k1(a){return J.bF(a).gaf(a)},
k2(a,b,c,d,e){return J.c6(a).N(a,b,c,d,e)},
bH(a){return J.aE(a).t(a)},
C:function C(){},
cH:function cH(){},
cJ:function cJ(){},
T:function T(){},
bu:function bu(){},
e1:function e1(){},
d2:function d2(){},
ax:function ax(){},
bK:function bK(){},
bL:function bL(){},
y:function y(a){this.$ti=a},
dO:function dO(){},
f5:function f5(a){this.$ti=a},
bI:function bI(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cK:function cK(){},
cI:function cI(){},
dP:function dP(){},
cc:function cc(){}},A={ja:function ja(){},
kg(a){return new A.b6("Field '"+a+"' has been assigned during initialization.")},
mp(a){return new A.b6("Field '"+a+"' has not been initialized.")},
aq(a){return new A.b6("Local '"+a+"' has not been initialized.")},
fa(a){return new A.b6("Local '"+a+"' has already been initialized.")},
bd(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
fE(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
jK(a,b,c){return a},
jO(a){var s,r
for(s=$.aD.length,r=0;r<s;++r)if(a===$.aD[r])return!0
return!1},
ae(){return new A.by("No element")},
j8(){return new A.by("Too many elements")},
b6:function b6(a){this.a=a},
iE:function iE(){},
fw:function fw(){},
aZ:function aZ(){},
ag:function ag(){},
bP:function bP(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
a0:function a0(a,b,c){this.a=a
this.b=b
this.$ti=c},
bT:function bT(a,b,c){this.a=a
this.b=b
this.$ti=c},
d4:function d4(a,b,c){this.a=a
this.b=b
this.$ti=c},
H:function H(){},
bS:function bS(){},
mc(){throw A.f(A.aQ("Cannot modify constant Set"))},
ls(a){var s=A.lr(a)
if(s!=null)return s
return"minified:"+a},
oJ(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
w(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bH(a)
return s},
cX(a){var s,r=$.km
if(r==null)r=$.km=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
mE(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b==null){if(s!=null)return parseInt(a,10)
if(m[2]!=null)return parseInt(a,16)
return n}if(b<2||b>36)throw A.f(A.ar(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
jh(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.p.hL(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
e2(a){var s,r,q,p
if(a instanceof A.e)return A.an(A.bo(a),null)
s=J.aE(a)
if(s===B.a6||s===B.a8||t.ak.b(a)){r=B.x(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.an(A.bo(a),null)},
kn(a){var s,r,q
if(a==null||typeof a=="number"||A.aX(a))return J.bH(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.br)return a.t(0)
if(a instanceof A.Q)return a.dF(!0)
s=$.lT()
for(r=0;r<1;++r){q=s[r].hO(a)
if(q!=null)return q}return"Instance of '"+A.e2(a)+"'"},
mB(){return Date.now()},
mD(){var s,r
if($.fp!==0)return
$.fp=1000
if(typeof window=="undefined")return
s=window
if(s==null)return
if(!!s.dartUseDateNowForTicks)return
r=s.performance
if(r==null)return
if(typeof r.now!="function")return
$.fp=1e6
$.ji=new A.fo(r)},
mF(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
cY(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.K(s,10)|55296)>>>0,s&1023|56320)}throw A.f(A.ar(a,0,1114111,null,null))},
mC(a){var s=a.$thrownJsError
if(s==null)return null
return A.bn(s)},
mG(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.Y(a,s)
a.$thrownJsError=s
s.stack=""}},
ad(a){throw A.f(A.ir(a))},
a(a,b){if(a==null)J.aL(a)
throw A.f(A.eO(a,b))},
eO(a,b){var s,r="index"
if(!A.n(b))return new A.aY(!0,b,r,null)
s=A.j(J.aL(a))
if(b<0||b>=s)return A.kd(b,s,a,r)
return A.mH(b,r)},
ir(a){return new A.aY(!0,a,null,null)},
li(a){return a},
f(a){return A.Y(a,new Error())},
Y(a,b){var s
if(a==null)a=new A.be()
b.dartException=a
s=A.oX
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
oX(){return J.bH(this.dartException)},
r(a,b){throw A.Y(a,b==null?new Error():b)},
d(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.r(A.nH(a,b,c),s)},
nH(a,b,c){var s,r,q,p,o,n,m,l,k
if(typeof b=="string")s=b
else{r="[]=;add;removeWhere;retainWhere;removeRange;setRange;setInt8;setInt16;setInt32;setUint8;setUint16;setUint32;setFloat32;setFloat64".split(";")
q=r.length
p=b
if(p>q){c=p/q|0
p%=q}s=r[p]}o=typeof c=="string"?c:"modify;remove from;add to".split(";")[c]
n=t.j.b(a)?"list":"ByteData"
m=a.$flags|0
l="a "
if((m&4)!==0)k="constant "
else if((m&2)!==0){k="unmodifiable "
l="an "}else k=(m&1)!==0?"fixed-length ":""
return new A.d3("'"+s+"': Cannot "+o+" "+l+k+n)},
Z(a){throw A.f(A.aF(a))},
bf(a){var s,r,q,p,o,n
a=A.oR(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.h([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.fI(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
fJ(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
kz(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
jb(a,b){var s=b==null,r=s?null:b.method
return new A.dR(a,r,s?null:b.receiver)},
ah(a){var s
if(a==null)return new A.fm(a)
if(a instanceof A.cF){s=a.a
return A.bG(a,s==null?A.aV(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bG(a,a.dartException)
return A.on(a)},
bG(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
on(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.K(r,16)&8191)===10)switch(q){case 438:return A.bG(a,A.jb(A.w(s)+" (Error "+q+")",null))
case 445:case 5007:A.w(s)
return A.bG(a,new A.cV())}}if(a instanceof TypeError){p=$.lC()
o=$.lD()
n=$.lE()
m=$.lF()
l=$.lI()
k=$.lJ()
j=$.lH()
$.lG()
i=$.lL()
h=$.lK()
g=p.am(s)
if(g!=null)return A.bG(a,A.jb(A.G(s),g))
else{g=o.am(s)
if(g!=null){g.method="call"
return A.bG(a,A.jb(A.G(s),g))}else if(n.am(s)!=null||m.am(s)!=null||l.am(s)!=null||k.am(s)!=null||j.am(s)!=null||m.am(s)!=null||i.am(s)!=null||h.am(s)!=null){A.G(s)
return A.bG(a,new A.cV())}}return A.bG(a,new A.eg(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.d0()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bG(a,new A.aY(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.d0()
return a},
bn(a){var s
if(a instanceof A.cF)return a.b
if(a==null)return new A.dn(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.dn(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
iF(a){if(a==null)return J.au(a)
if(typeof a=="object")return A.cX(a)
return J.au(a)},
oC(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.q(0,a[s],a[r])}return b},
nU(a,b,c,d,e,f){t.Z.a(a)
switch(A.j(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.f(new A.hb("Unsupported number of arguments for wrapped closure"))},
dA(a,b){var s=a.$identity
if(!!s)return s
s=A.ov(a,b)
a.$identity=s
return s},
ov(a,b){var s
switch(b){case 0:s=a.$0
break
case 1:s=a.$1
break
case 2:s=a.$2
break
case 3:s=a.$3
break
case 4:s=a.$4
break
default:s=null}if(s!=null)return s.bind(a)
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.nU)},
mb(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.e7().constructor.prototype):Object.create(new A.cb(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.kb(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.m7(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.kb(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
m7(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.f("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.m4)}throw A.f("Error in functionType of tearoff")},
m8(a,b,c,d){var s=A.ka
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
kb(a,b,c,d){if(c)return A.ma(a,b,d)
return A.m8(b.length,d,a,b)},
m9(a,b,c,d){var s=A.ka,r=A.m5
switch(b?-1:a){case 0:throw A.f(new A.e5("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
ma(a,b,c){var s,r
if($.k8==null)$.k8=A.k7("interceptor")
if($.k9==null)$.k9=A.k7("receiver")
s=b.length
r=A.m9(s,c,a,b)
return r},
jL(a){return A.mb(a)},
m4(a,b){return A.dv(v.typeUniverse,A.bo(a.a),b)},
ka(a){return a.a},
m5(a){return a.b},
k7(a){var s,r,q,p=new A.cb("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.f(A.ao("Field name "+a+" not found.",null))},
it(a){return v.getIsolateTag(a)},
M(){throw A.f(new A.eE(null))},
pL(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
oK(a){var s,r,q,p,o,n=A.G($.ll.$1(a)),m=$.is[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iA[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.ic($.lg.$2(a,n))
if(q!=null){m=$.is[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iA[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.iD(s)
$.is[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.iA[n]=s
return s}if(p==="-"){o=A.iD(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.lp(a,s)
if(p==="*")throw A.f(A.kA(n))
if(v.leafTags[n]===true){o=A.iD(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.lp(a,s)},
lp(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.jP(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
iD(a){return J.jP(a,!1,null,!!a.$iay)},
oM(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.iD(s)
else return J.jP(s,c,null,null)},
oG(){if(!0===$.jN)return
$.jN=!0
A.oH()},
oH(){var s,r,q,p,o,n,m,l
$.is=Object.create(null)
$.iA=Object.create(null)
A.oF()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.lq.$1(o)
if(n!=null){m=A.oM(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
oF(){var s,r,q,p,o,n,m=B.K()
m=A.cx(B.L,A.cx(B.M,A.cx(B.y,A.cx(B.y,A.cx(B.N,A.cx(B.O,A.cx(B.P(B.x),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.ll=new A.iw(p)
$.lg=new A.ix(o)
$.lq=new A.iy(n)},
cx(a,b){return a(b)||b},
nb(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.l(r,b[s]))return!1}return!0},
ow(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
kf(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.f(A.O("Illegal RegExp pattern ("+String(o)+")",a,null))},
oR(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
dd:function dd(a){this.a=a},
cp:function cp(a){this.a=a},
de:function de(a){this.a=a},
df:function df(a){this.a=a},
cq:function cq(a){this.a=a},
dg:function dg(a){this.a=a},
x:function x(a,b){this.a=a
this.b=b},
dh:function dh(a,b){this.a=a
this.b=b},
aC:function aC(a,b,c){this.a=a
this.b=b
this.c=c},
di:function di(a,b,c){this.a=a
this.b=b
this.c=c},
cr:function cr(a,b,c){this.a=a
this.b=b
this.c=c},
c0:function c0(a,b,c){this.a=a
this.b=b
this.c=c},
cs:function cs(a,b,c){this.a=a
this.b=b
this.c=c},
b3:function b3(a){this.a=a},
dj:function dj(a){this.a=a},
ct:function ct(a){this.a=a},
dk:function dk(a){this.a=a},
bB:function bB(a){this.a=a},
d7:function d7(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cE:function cE(){},
R:function R(a,b,c){this.a=a
this.b=b
this.$ti=c},
fo:function fo(a){this.a=a},
d_:function d_(){},
fI:function fI(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
cV:function cV(){},
dR:function dR(a,b,c){this.a=a
this.b=b
this.c=c},
eg:function eg(a){this.a=a},
fm:function fm(a){this.a=a},
cF:function cF(a,b){this.a=a
this.b=b},
dn:function dn(a){this.a=a
this.b=null},
br:function br(){},
dE:function dE(){},
dF:function dF(){},
ec:function ec(){},
e7:function e7(){},
cb:function cb(a,b){this.a=a
this.b=b},
e5:function e5(a){this.a=a},
eE:function eE(a){this.a=a},
b5:function b5(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
f6:function f6(a){this.a=a},
fb:function fb(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
P:function P(a,b){this.a=a
this.$ti=b},
bN:function bN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bO:function bO(a,b){this.a=a
this.$ti=b},
aM:function aM(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bM:function bM(a,b){this.a=a
this.$ti=b},
cL:function cL(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
aj:function aj(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
iw:function iw(a){this.a=a},
ix:function ix(a){this.a=a},
iy:function iy(a){this.a=a},
Q:function Q(){},
c_:function c_(){},
co:function co(){},
b2:function b2(){},
am:function am(){},
dQ:function dQ(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
d8:function d8(a){this.b=a},
ei:function ei(a,b,c){this.a=a
this.b=b
this.c=c},
cj:function cj(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
oW(a){throw A.Y(A.kg(a),new Error())},
D(){throw A.Y(A.mp(""),new Error())},
S(){throw A.Y(A.kg(""),new Error())},
em(){var s=new A.fV()
return s.b=s},
fV:function fV(){this.b=null},
bm(a,b,c){},
a9(a){return a},
mv(a,b,c){A.bm(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
fj(a){return new Float32Array(a)},
dV(a){return new Float32Array(A.a9(a))},
my(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Float32Array(a,b,c)},
jd(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
mz(a){return new Int32Array(a)},
dX(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Int32Array(a,b,c)},
kk(a){return new Uint32Array(a)},
je(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
kl(a){return new Uint8Array(a)},
jf(a,b,c){A.bm(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
aW(a,b,c){if(a>>>0!==a||a>=c)throw A.f(A.eO(b,a))},
bw:function bw(){},
cd:function cd(){},
cN:function cN(a){this.a=a},
eD:function eD(a){this.a=a},
cS:function cS(){},
i6:function i6(a){this.a=a},
dU:function dU(){},
ab:function ab(){},
cQ:function cQ(){},
cR:function cR(){},
ce:function ce(){},
cO:function cO(){},
dW:function dW(){},
cP:function cP(){},
dY:function dY(){},
dZ:function dZ(){},
cT:function cT(){},
cU:function cU(){},
bQ:function bQ(){},
aN:function aN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ex:function ex(){},
ey:function ey(){},
d9:function d9(){},
da:function da(){},
db:function db(){},
dc:function dc(){},
eG:function eG(){},
jk(a,b){var s=b.c
return s==null?b.c=A.dt(a,"aw",[b.x]):s},
kp(a){var s=a.w
if(s===6||s===7)return A.kp(a.x)
return s===11||s===12},
mJ(a){return a.as},
bp(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
eP(a){return A.i5(v.typeUniverse,a,!1)},
c3(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.c3(a1,s,a3,a4)
if(r===s)return a2
return A.kM(a1,r,!0)
case 7:s=a2.x
r=A.c3(a1,s,a3,a4)
if(r===s)return a2
return A.kL(a1,r,!0)
case 8:q=a2.y
p=A.cw(a1,q,a3,a4)
if(p===q)return a2
return A.dt(a1,a2.x,p)
case 9:o=a2.x
n=A.c3(a1,o,a3,a4)
m=a2.y
l=A.cw(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.jz(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.cw(a1,j,a3,a4)
if(i===j)return a2
return A.kN(a1,k,i)
case 11:h=a2.x
g=A.c3(a1,h,a3,a4)
f=a2.y
e=A.ok(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.kK(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.cw(a1,d,a3,a4)
o=a2.x
n=A.c3(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.jA(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.f(A.dD("Attempted to substitute unexpected RTI kind "+a0))}},
cw(a,b,c,d){var s,r,q,p,o=b.length,n=A.i9(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.c3(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
ol(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.i9(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.c3(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
ok(a,b,c,d){var s,r=b.a,q=A.cw(a,r,c,d),p=b.b,o=A.cw(a,p,c,d),n=b.c,m=A.ol(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.es()
s.a=q
s.b=o
s.c=m
return s},
h(a,b){a[v.arrayRti]=b
return a},
lj(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.oE(s)
return a.$S()}return null},
oI(a,b){var s
if(A.kp(b))if(a instanceof A.br){s=A.lj(a)
if(s!=null)return s}return A.bo(a)},
bo(a){if(a instanceof A.e)return A.o(a)
if(Array.isArray(a))return A.a3(a)
return A.jC(J.aE(a))},
a3(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
o(a){var s=a.$ti
return s!=null?s:A.jC(a)},
jC(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.nS(a,s)},
nS(a,b){var s=a instanceof A.br?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.nm(v.typeUniverse,s.name)
b.$ccache=r
return r},
oE(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.i5(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
iv(a){return A.c5(A.o(a))},
jI(a){var s
if(a instanceof A.Q)return A.oB(a.$r,a.aW())
s=a instanceof A.br?A.lj(a):null
if(s!=null)return s
if(t.dm.b(a))return J.m0(a).a
if(Array.isArray(a))return A.a3(a)
return A.bo(a)},
c5(a){var s=a.r
return s==null?a.r=new A.i4(a):s},
oB(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.dv(v.typeUniverse,A.jI(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.kP(v.typeUniverse,s,A.jI(q[r]))}return A.dv(v.typeUniverse,s,a)},
aK(a){return A.c5(A.i5(v.typeUniverse,a,!1))},
nR(a){var s=this
s.b=A.oi(s)
return s.b(a)},
oi(a){var s,r,q,p,o
if(a===t.K)return A.o_
if(A.c7(a))return A.o3
s=a.w
if(s===6)return A.nP
if(s===1)return A.l6
if(s===7)return A.nV
r=A.oh(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.c7)){a.f="$i"+q
if(q==="t")return A.nY
if(a===t.m)return A.nX
return A.o2}}else if(s===10){p=A.ow(a.x,a.y)
o=p==null?A.l6:p
return o==null?A.aV(o):o}return A.nN},
oh(a){if(a.w===8){if(a===t.S)return A.n
if(a===t.i||a===t.q)return A.nZ
if(a===t.N)return A.o1
if(a===t.y)return A.aX}return null},
nQ(a){var s=this,r=A.nM
if(A.c7(s))r=A.nx
else if(s===t.K)r=A.aV
else if(A.cy(s)){r=A.nO
if(s===t.gs)r=A.nv
else if(s===t.dk)r=A.ic
else if(s===t.fQ)r=A.nt
else if(s===t.cg)r=A.kT
else if(s===t.cD)r=A.nu
else if(s===t.an)r=A.nw}else if(s===t.S)r=A.j
else if(s===t.N)r=A.G
else if(s===t.y)r=A.aJ
else if(s===t.q)r=A.eH
else if(s===t.i)r=A.W
else if(s===t.m)r=A.v
s.a=r
return s.a(a)},
nN(a){var s=this
if(a==null)return A.cy(s)
return A.lo(v.typeUniverse,A.oI(a,s),s)},
nP(a){if(a==null)return!0
return this.x.b(a)},
o2(a){var s,r=this
if(a==null)return A.cy(r)
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aE(a)[s]},
nY(a){var s,r=this
if(a==null)return A.cy(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aE(a)[s]},
nX(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.e)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
l5(a){if(typeof a=="object"){if(a instanceof A.e)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
nM(a){var s=this
if(a==null){if(A.cy(s))return a}else if(s.b(a))return a
throw A.Y(A.kX(a,s),new Error())},
nO(a){var s=this
if(a==null||s.b(a))return a
throw A.Y(A.kX(a,s),new Error())},
kX(a,b){return new A.cu("TypeError: "+A.kC(a,A.an(b,null)))},
ou(a,b,c,d){if(A.lo(v.typeUniverse,a,b))return a
throw A.Y(A.ne("The type argument '"+A.an(a,null)+"' is not a subtype of the type variable bound '"+A.an(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
kC(a,b){return A.eW(a)+": type '"+A.an(A.jI(a),null)+"' is not a subtype of type '"+b+"'"},
ne(a){return new A.cu("TypeError: "+a)},
aI(a,b){return new A.cu("TypeError: "+A.kC(a,b))},
nV(a){var s=this
return s.x.b(a)||A.jk(v.typeUniverse,s).b(a)},
o_(a){return a!=null},
aV(a){if(a!=null)return a
throw A.Y(A.aI(a,"Object"),new Error())},
o3(a){return!0},
nx(a){return a},
l6(a){return!1},
aX(a){return!0===a||!1===a},
aJ(a){if(!0===a)return!0
if(!1===a)return!1
throw A.Y(A.aI(a,"bool"),new Error())},
nt(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.Y(A.aI(a,"bool?"),new Error())},
W(a){if(typeof a=="number")return a
throw A.Y(A.aI(a,"double"),new Error())},
nu(a){if(typeof a=="number")return a
if(a==null)return a
throw A.Y(A.aI(a,"double?"),new Error())},
n(a){return typeof a=="number"&&Math.floor(a)===a},
j(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.Y(A.aI(a,"int"),new Error())},
nv(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.Y(A.aI(a,"int?"),new Error())},
nZ(a){return typeof a=="number"},
eH(a){if(typeof a=="number")return a
throw A.Y(A.aI(a,"num"),new Error())},
kT(a){if(typeof a=="number")return a
if(a==null)return a
throw A.Y(A.aI(a,"num?"),new Error())},
o1(a){return typeof a=="string"},
G(a){if(typeof a=="string")return a
throw A.Y(A.aI(a,"String"),new Error())},
ic(a){if(typeof a=="string")return a
if(a==null)return a
throw A.Y(A.aI(a,"String?"),new Error())},
v(a){if(A.l5(a))return a
throw A.Y(A.aI(a,"JSObject"),new Error())},
nw(a){if(a==null)return a
if(A.l5(a))return a
throw A.Y(A.aI(a,"JSObject?"),new Error())},
lc(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.an(a[q],b)
return s},
oc(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.lc(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.an(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
l2(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.h([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.b.m(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.an(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.an(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.an(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.an(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.an(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
an(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.an(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.an(a.x,b)+">"
if(l===8){p=A.om(a.x)
o=a.y
return o.length>0?p+("<"+A.lc(o,b)+">"):p}if(l===10)return A.oc(a,b)
if(l===11)return A.l2(a,b,null)
if(l===12)return A.l2(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
om(a){var s=A.lr(a)
if(s!=null)return s
return"minified:"+a},
nn(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
nm(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.i5(a,b,!1)
else if(typeof m=="number"){s=m
r=A.du(a,5,"#")
q=A.i9(s)
for(p=0;p<s;++p)q[p]=r
o=A.dt(a,b,q)
n[b]=o
return o}else return m},
nl(a,b){return A.kR(a.tR,b)},
nk(a,b){return A.kR(a.eT,b)},
i5(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.kO(a,null,b,!1)
r.set(b,s)
return s},
dv(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.kO(a,b,c,!0)
q.set(c,r)
return r},
kP(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.jz(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
kO(a,b,c,d){return A.n9(A.n3(a,b,c,d))},
bD(a,b){b.a=A.nQ
b.b=A.nR
return b},
du(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aO(null,null)
s.w=b
s.as=c
r=A.bD(a,s)
a.eC.set(c,r)
return r},
kM(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.ni(a,b,r,c)
a.eC.set(r,s)
return s},
ni(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.c7(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.cy(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aO(null,null)
q.w=6
q.x=b
q.as=c
return A.bD(a,q)},
kL(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.ng(a,b,r,c)
a.eC.set(r,s)
return s},
ng(a,b,c,d){var s,r
if(d){s=b.w
if(A.c7(b)||b===t.K)return b
else if(s===1)return A.dt(a,"aw",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aO(null,null)
r.w=7
r.x=b
r.as=c
return A.bD(a,r)},
nj(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aO(null,null)
s.w=13
s.x=b
s.as=q
r=A.bD(a,s)
a.eC.set(q,r)
return r},
ds(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
nf(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
dt(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.ds(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aO(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bD(a,r)
a.eC.set(p,q)
return q},
jz(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.ds(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aO(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bD(a,o)
a.eC.set(q,n)
return n},
kN(a,b,c){var s,r,q="+"+(b+"("+A.ds(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aO(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bD(a,s)
a.eC.set(q,r)
return r},
kK(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.ds(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.ds(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.nf(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aO(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bD(a,p)
a.eC.set(r,o)
return o},
jA(a,b,c,d){var s,r=b.as+("<"+A.ds(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.nh(a,b,c,r,d)
a.eC.set(r,s)
return s},
nh(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.i9(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.c3(a,b,r,0)
m=A.cw(a,c,r,0)
return A.jA(a,n,m,c!==m)}}l=new A.aO(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bD(a,l)},
n3(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
n9(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.n5(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.kH(a,r,l,k,!1)
else if(q===46)r=A.kH(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.bZ(a.u,a.e,k.pop()))
break
case 94:k.push(A.nj(a.u,k.pop()))
break
case 35:k.push(A.du(a.u,5,"#"))
break
case 64:k.push(A.du(a.u,2,"@"))
break
case 126:k.push(A.du(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.n7(a,k)
break
case 38:A.n6(a,k)
break
case 63:p=a.u
k.push(A.kM(p,A.bZ(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.kL(p,A.bZ(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.n4(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.kI(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.na(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-2)
break
case 43:n=l.indexOf("(",r)
k.push(l.substring(r,n))
k.push(-4)
k.push(a.p)
a.p=k.length
r=n+1
break
default:throw"Bad character "+q}}}m=k.pop()
return A.bZ(a.u,a.e,m)},
n5(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
kH(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.nn(s,o.x)[p]
if(n==null)A.r('No "'+p+'" in "'+A.mJ(o)+'"')
d.push(A.dv(s,o,n))}else d.push(p)
return m},
n7(a,b){var s,r=a.u,q=A.kG(a,b),p=b.pop()
if(typeof p=="string")b.push(A.dt(r,p,q))
else{s=A.bZ(r,a.e,p)
switch(s.w){case 11:b.push(A.jA(r,s,q,a.n))
break
default:b.push(A.jz(r,s,q))
break}}},
n4(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.kG(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.bZ(p,a.e,o)
q=new A.es()
q.a=s
q.b=n
q.c=m
b.push(A.kK(p,r,q))
return
case-4:b.push(A.kN(p,b.pop(),s))
return
default:throw A.f(A.dD("Unexpected state under `()`: "+A.w(o)))}},
n6(a,b){var s=b.pop()
if(0===s){b.push(A.du(a.u,1,"0&"))
return}if(1===s){b.push(A.du(a.u,4,"1&"))
return}throw A.f(A.dD("Unexpected extended operation "+A.w(s)))},
kG(a,b){var s=b.splice(a.p)
A.kI(a.u,a.e,s)
a.p=b.pop()
return s},
bZ(a,b,c){if(typeof c=="string")return A.dt(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.n8(a,b,c)}else return c},
kI(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.bZ(a,b,c[s])},
na(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.bZ(a,b,c[s])},
n8(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.f(A.dD("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.f(A.dD("Bad index "+c+" for "+b.t(0)))},
lo(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.a4(a,b,null,c,null)
r.set(c,s)}return s},
a4(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.c7(d))return!0
s=b.w
if(s===4)return!0
if(A.c7(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.a4(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.a4(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.a4(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.a4(a,b.x,c,d,e))return!1
return A.a4(a,A.jk(a,b),c,d,e)}if(s===6)return A.a4(a,p,c,d,e)&&A.a4(a,b.x,c,d,e)
if(q===7){if(A.a4(a,b,c,d.x,e))return!0
return A.a4(a,b,c,A.jk(a,d),e)}if(q===6)return A.a4(a,b,c,p,e)||A.a4(a,b,c,d.x,e)
if(r)return!1
p=s!==11
if((!p||s===12)&&d===t.Z)return!0
o=s===10
if(o&&d===t.gT)return!0
if(q===12){if(b===t.g)return!0
if(s!==12)return!1
n=b.y
m=d.y
l=n.length
if(l!==m.length)return!1
c=c==null?n:n.concat(c)
e=e==null?m:m.concat(e)
for(k=0;k<l;++k){j=n[k]
i=m[k]
if(!A.a4(a,j,c,i,e)||!A.a4(a,i,e,j,c))return!1}return A.l4(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.l4(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.nW(a,b,c,d,e)}if(o&&q===10)return A.o0(a,b,c,d,e)
return!1},
l4(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.a4(a3,a4.x,a5,a6.x,a7))return!1
s=a4.y
r=a6.y
q=s.a
p=r.a
o=q.length
n=p.length
if(o>n)return!1
m=n-o
l=s.b
k=r.b
j=l.length
i=k.length
if(o+j<n+i)return!1
for(h=0;h<o;++h){g=q[h]
if(!A.a4(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.a4(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.a4(a3,k[h],a7,g,a5))return!1}f=s.c
e=r.c
d=f.length
c=e.length
for(b=0,a=0;a<c;a+=3){a0=e[a]
for(;;){if(b>=d)return!1
a1=f[b]
b+=3
if(a0<a1)return!1
a2=f[b-2]
if(a1<a0){if(a2)return!1
continue}g=e[a+1]
if(a2&&!g)return!1
g=f[b-1]
if(!A.a4(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
nW(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.dv(a,b,r[o])
return A.kS(a,p,null,c,d.y,e)}return A.kS(a,b.y,null,c,d.y,e)},
kS(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.a4(a,b[s],d,e[s],f))return!1
return!0},
o0(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.a4(a,r[s],c,q[s],e))return!1
return!0},
cy(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.c7(a))if(s!==6)r=s===7&&A.cy(a.x)
return r},
c7(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
kR(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
i9(a){return a>0?new Array(a):v.typeUniverse.sEA},
aO:function aO(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
es:function es(){this.c=this.b=this.a=null},
i4:function i4(a){this.a=a},
ep:function ep(){},
cu:function cu(a){this.a=a},
mW(){var s,r,q
if(self.scheduleImmediate!=null)return A.oo()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dA(new A.fR(s),1)).observe(r,{childList:true})
return new A.fQ(s,r,q)}else if(self.setImmediate!=null)return A.op()
return A.oq()},
mX(a){self.scheduleImmediate(A.dA(new A.fS(t.O.a(a)),0))},
mY(a){self.setImmediate(A.dA(new A.fT(t.O.a(a)),0))},
mZ(a){t.O.a(a)
A.nc(0,a)},
nc(a,b){var s=new A.i1()
s.eA(a,b)
return s},
l8(a){return new A.ej(new A.L($.F,a.i("L<0>")),a.i("ej<0>"))},
kW(a,b){a.$2(0,null)
b.b=!0
return b.a},
id(a,b){A.ny(a,b)},
kV(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("aw<1>").b(a))s.cP(a)
else s.cT(a)},
kU(a,b){var s=A.ah(a),r=A.bn(a),q=A.l3(s,r)
s=new A.av(s,r)
r=b.b
q=b.a
if(r)q.bh(s)
else q.be(s)},
ny(a,b){var s,r,q=new A.ie(b),p=new A.ig(b)
if(a instanceof A.L)a.dD(q,p,t.z)
else{s=t.z
if(a instanceof A.L)a.ct(q,p,s)
else{r=new A.L($.F,t._)
r.a=8
r.c=a
r.dD(q,p,s)}}},
lf(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.F
return r.bZ(r,t.as.a(new A.iq(s)),t.H,t.S,t.z)},
j1(a){var s
if(t.R.b(a)){s=a.gaU()
if(s!=null)return s}return B.q},
l3(a,b){var s=$.F
if(s===B.j)return null
s.f0(s,a,b)
return null},
nT(a,b){if($.F!==B.j)A.l3(a,b)
if(t.R.b(a)){b=a.gaU()
if(b==null){A.mG(a,B.q)
b=B.q}}else b=B.q
return new A.av(a,b)},
jt(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.mK()
b.be(new A.av(new A.aY(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.dj(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.aY()
b.bg(n.a)
A.bX(b,p)
return}b.a^=2
o=b.b
o.aZ(o,new A.hx(n,b))},
bX(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.aX(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.bX(e.a,d)
q.a=l
k=l.a}j=e.a.c
q.b=n
q.c=j
if(o){p=d.c
p=(p&1)!==0||(p&15)===8}else p=!0
if(p){i=d.b.b
h=$.F
if(h!==i)$.F=i
else h=null
d=d.c
if((d&15)===8)new A.hB(q,e,n).$0()
else if(o){if((d&1)!==0)new A.hA(q,j).$0()}else if((d&2)!==0)new A.hz(e,q).$0()
if(h!=null)$.F=h
d=q.c
if(d instanceof A.L){p=q.a.$ti
p=p.i("aw<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bs(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.jt(d,g,!0)
return}}g=q.a.b
f=r.a(g.c)
g.c=null
b=g.bs(f)
d=q.b
p=q.c
if(!d){g.$ti.c.a(p)
g.a=8
g.c=p}else{s.a(p)
g.a=g.a&1|16
g.c=p}e.a=g
d=g}},
od(a,b){var s=t.C
if(s.b(a))return b.bZ(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.br(b,s.a(a),t.z,t.K)
throw A.f(A.k3(a,"onError",u.c))},
o6(){var s,r
for(s=$.cv;s!=null;s=$.cv){$.dy=null
r=s.b
$.cv=r
if(r==null)$.dx=null
s.a.$0()}},
oj(){$.jD=!0
try{A.o6()}finally{$.dy=null
$.jD=!1
if($.cv!=null)$.jW().$1(A.lh())}},
ld(a){var s=new A.ek(a),r=$.dx
if(r==null){$.cv=$.dx=s
if(!$.jD)$.jW().$1(A.lh())}else $.dx=r.b=s},
og(a){var s,r,q,p=$.cv
if(p==null){A.ld(a)
$.dy=$.dx
return}s=new A.ek(a)
r=$.dy
if(r==null){s.b=p
$.cv=$.dy=s}else{q=r.b
s.b=q
$.dy=r.b=s
if(q==null)$.dx=s}},
oT(a){var s=$.F
if(B.j===s){A.jF(B.j,a)
return}A.jF(s,s.bq(s,a,t.H))
return},
pd(a,b){A.jK(a,"stream",t.K)
return new A.eA(b.i("eA<0>"))},
jG(a){return},
n_(a,b){if(b==null)b=A.os()
if(t.da.b(b))return a.bZ(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.br(a,t.w.a(b),t.z,t.K)
throw A.f(A.ao("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
o8(a,b){var s=$.F
s.aX(s,a,b)},
o7(){},
of(a,b){A.og(new A.io(a,b))},
jF(a,b){if(B.j!==a)b=a.fY(b,t.H)
A.ld(b)},
fR:function fR(a){this.a=a},
fQ:function fQ(a,b,c){this.a=a
this.b=b
this.c=c},
fS:function fS(a){this.a=a},
fT:function fT(a){this.a=a},
i1:function i1(){},
i2:function i2(a,b){this.a=a
this.b=b},
ej:function ej(a,b){this.a=a
this.b=!1
this.$ti=b},
ie:function ie(a){this.a=a},
ig:function ig(a){this.a=a},
iq:function iq(a){this.a=a},
av:function av(a,b){this.a=a
this.b=b},
en:function en(){},
d5:function d5(a,b){this.a=a
this.$ti=b},
bg:function bg(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
L:function L(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
hu:function hu(a,b){this.a=a
this.b=b},
hy:function hy(a,b){this.a=a
this.b=b},
hx:function hx(a,b){this.a=a
this.b=b},
hw:function hw(a,b){this.a=a
this.b=b},
hv:function hv(a,b){this.a=a
this.b=b},
hB:function hB(a,b,c){this.a=a
this.b=b
this.c=c},
hC:function hC(a,b){this.a=a
this.b=b},
hD:function hD(a){this.a=a},
hA:function hA(a,b){this.a=a
this.b=b},
hz:function hz(a,b){this.a=a
this.b=b},
ek:function ek(a){this.a=a
this.b=null},
d1:function d1(){},
fz:function fz(a,b){this.a=a
this.b=b},
fA:function fA(a,b){this.a=a
this.b=b},
dp:function dp(){},
hZ:function hZ(a){this.a=a},
hY:function hY(a){this.a=a},
el:function el(){},
ck:function ck(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
cl:function cl(a,b){this.a=a
this.$ti=b},
cm:function cm(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
d6:function d6(){},
fU:function fU(a){this.a=a},
dr:function dr(){},
bA:function bA(){},
bV:function bV(a,b){this.b=a
this.a=null
this.$ti=b},
eo:function eo(){},
aS:function aS(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
hV:function hV(a,b){this.a=a
this.b=b},
eA:function eA(a){this.$ti=a},
fO:function fO(){},
fP:function fP(a,b,c){this.a=a
this.b=b
this.c=c},
io:function io(a,b){this.a=a
this.b=b},
mq(a,b,c){return b.i("@<0>").a3(c).i("jc<1,2>").a(A.oC(a,new A.b5(b.i("@<0>").a3(c).i("b5<1,2>"))))},
a5(a,b){return new A.b5(a.i("@<0>").a3(b).i("b5<1,2>"))},
mr(a){return new A.bi(a.i("bi<0>"))},
fc(a){return new A.bi(a.i("bi<0>"))},
jv(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
kj(a){var s,r
if(A.jO(a))return"{...}"
s=new A.ch("")
try{r={}
B.b.m($.aD,a)
s.a+="{"
r.a=!0
a.aJ(0,new A.ff(r,s))
s.a+="}"}finally{if(0>=$.aD.length)return A.a($.aD,-1)
$.aD.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
bi:function bi(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
bY:function bY(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
ew:function ew(a){this.a=a
this.c=this.b=null},
bj:function bj(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
B:function B(){},
I:function I(){},
fe:function fe(a){this.a=a},
ff:function ff(a,b){this.a=a
this.b=b},
bc:function bc(){},
dl:function dl(){},
o9(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ah(r)
q=A.O(String(s),null,null)
throw A.f(q)}q=A.ih(p)
return q},
ih(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.eu(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.ih(a[s])
return a},
np(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.lR()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
no(a,b,c,d){var s=a?$.lQ():$.lP()
if(s==null)return null
if(0===c&&d===b.length)return A.kQ(s,b)
return A.kQ(s,b.subarray(c,d))},
kQ(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
nq(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
eu:function eu(a,b){this.a=a
this.b=b
this.c=null},
hN:function hN(a){this.a=a},
ev:function ev(a){this.a=a},
i8:function i8(){},
i7:function i7(){},
dG:function dG(){},
dI:function dI(){},
dS:function dS(){},
f7:function f7(a){this.a=a},
eF:function eF(a){this.a=a
this.b=16
this.c=0},
ln(a,b){var s=A.mE(a,b)
if(s!=null)return s
throw A.f(A.O(a,null,null))},
oz(a){var s=A.jh(a)
if(s!=null)return s
throw A.f(A.O("Invalid double",a,null))},
md(a,b){a=A.Y(a,new Error())
if(a==null)a=A.aV(a)
a.stack=b.t(0)
throw a},
kh(a,b,c,d){var s,r=c?J.mk(a,d):J.mj(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
ms(a,b,c){var s,r,q=A.h([],c.i("y<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.Z)(a),++r)B.b.m(q,c.a(a[r]))
q.$flags=1
return q},
b7(a,b){var s,r
if(Array.isArray(a))return A.h(a.slice(0),b.i("y<0>"))
s=A.h([],b.i("y<0>"))
for(r=J.cA(a);r.u();)B.b.m(s,r.gB())
return s},
e9(a,b,c){var s,r
A.jj(b,"start")
s=c-b
if(s<0)throw A.f(A.ar(c,b,null,"end",null))
if(s===0)return""
r=A.mL(a,b,c)
return r},
mL(a,b,c){var s=a.length
if(b>=s)return""
return A.mF(a,b,c==null||c>s?s:c)},
e4(a){return new A.dQ(a,A.kf(a,!1,!0,!1,!1,""))},
kr(a,b,c){var s=J.cA(b)
if(!s.u())return a
if(c.length===0){do a+=A.w(s.gB())
while(s.u())}else{a+=A.w(s.gB())
while(s.u())a=a+c+A.w(s.gB())}return a},
mK(){return A.bn(new Error())},
eW(a){if(typeof a=="number"||A.aX(a)||a==null)return J.bH(a)
if(typeof a=="string")return JSON.stringify(a)
return A.kn(a)},
me(a,b){A.jK(a,"error",t.K)
A.jK(b,"stackTrace",t.l)
A.md(a,b)},
dD(a){return new A.cC(a)},
ao(a,b){return new A.aY(!1,null,b,a)},
k3(a,b,c){return new A.aY(!0,a,b,c)},
ko(a){var s=null
return new A.ba(s,s,!1,s,s,a)},
mH(a,b){return new A.ba(null,null,!0,a,b,"Value not in range")},
ar(a,b,c,d,e){return new A.ba(b,c,!0,a,d,"Invalid value")},
bb(a,b,c){if(0>a||a>c)throw A.f(A.ar(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.f(A.ar(b,a,c,"end",null))
return b}return c},
jj(a,b){if(a<0)throw A.f(A.ar(a,0,null,b,null))
return a},
kd(a,b,c,d){return new A.dK(b,!0,a,d,"Index out of range")},
aQ(a){return new A.d3(a)},
kA(a){return new A.ef(a)},
as(a){return new A.by(a)},
aF(a){return new A.dH(a)},
O(a,b,c){return new A.a_(a,b,c)},
mi(a,b,c){var s,r
if(A.jO(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.h([],t.s)
B.b.m($.aD,a)
try{A.o4(a,s)}finally{if(0>=$.aD.length)return A.a($.aD,-1)
$.aD.pop()}r=A.kr(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
j9(a,b,c){var s,r
if(A.jO(a))return b+"..."+c
s=new A.ch(b)
B.b.m($.aD,a)
try{r=s
r.a=A.kr(r.a,a,", ")}finally{if(0>=$.aD.length)return A.a($.aD,-1)
$.aD.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
o4(a,b){var s,r,q,p,o,n,m,l=a.gD(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.u())return
s=A.w(l.gB())
B.b.m(b,s)
k+=s.length+2;++j}if(!l.u()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gB();++j
if(!l.u()){if(j<=4){B.b.m(b,A.w(p))
return}r=A.w(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gB();++j
for(;l.u();p=o,o=n){n=l.gB();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.b.m(b,"...")
return}}q=A.w(p)
r=A.w(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.b.m(b,m)
B.b.m(b,q)
B.b.m(b,r)},
e_(a,b,c,d){var s
if(B.m===c){s=J.au(a)
b=J.au(b)
return A.fE(A.bd(A.bd($.eQ(),s),b))}if(B.m===d){s=J.au(a)
b=J.au(b)
c=J.au(c)
return A.fE(A.bd(A.bd(A.bd($.eQ(),s),b),c))}s=J.au(a)
b=J.au(b)
c=J.au(c)
d=J.au(d)
d=A.fE(A.bd(A.bd(A.bd(A.bd($.eQ(),s),b),c),d))
return d},
mA(a){var s,r,q=$.eQ()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.Z)(a),++r)q=A.bd(q,J.au(a[r]))
return A.fE(q)},
ha:function ha(){},
N:function N(){},
cC:function cC(a){this.a=a},
be:function be(){},
aY:function aY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ba:function ba(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
dK:function dK(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
d3:function d3(a){this.a=a},
ef:function ef(a){this.a=a},
by:function by(a){this.a=a},
dH:function dH(a){this.a=a},
e0:function e0(){},
d0:function d0(){},
hb:function hb(a){this.a=a},
a_:function a_(a,b,c){this.a=a
this.b=b
this.c=c},
m:function m(){},
bv:function bv(a,b,c){this.a=a
this.b=b
this.$ti=c},
a1:function a1(){},
e:function e(){},
eB:function eB(){},
fy:function fy(){this.b=this.a=0},
ch:function ch(a){this.a=a},
nF(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.w(a)
r=A.ot(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.r("Attempting to box non-Dart object.")
q={}
q[$.lS()]=a
r.error=q
r.stack=b.t(0)
return r},
mf(a,b){var s,r=v.G.Promise,q=new A.f1(a)
if(typeof q=="function")A.r(A.ao("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.nB,q)
s[$.iS()]=q
return A.v(new r(s))},
fl:function fl(a){this.a=a},
f1:function f1(a){this.a=a},
f_:function f_(a){this.a=a},
f0:function f0(a){this.a=a},
nA(a,b,c){t.Z.a(a)
if(A.j(c)>=1)return a.$1(b)
return a.$0()},
nB(a,b,c,d){t.Z.a(a)
A.j(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
dz(a,b,c,d){return d.a(a[b].apply(a,c))},
ot(a,b,c){var s,r
if(b==null)return c.a(new a())
if(b instanceof Array)switch(b.length){case 0:return c.a(new a())
case 1:return c.a(new a(b[0]))
case 2:return c.a(new a(b[0],b[1]))
case 3:return c.a(new a(b[0],b[1],b[2]))
case 4:return c.a(new a(b[0],b[1],b[2],b[3]))}s=[null]
B.b.ak(s,b)
r=a.bind.apply(a,s)
String(r)
return c.a(new r())},
jQ(a,b){var s=new A.L($.F,b.i("L<0>")),r=new A.d5(s,b.i("d5<0>"))
a.then(A.dA(new A.iG(r,b),1),A.dA(new A.iH(r),1))
return s},
iG:function iG(a,b){this.a=a
this.b=b},
iH:function iH(a){this.a=a},
f2:function f2(){},
f3:function f3(a,b,c){this.a=a
this.b=b
this.c=c},
hE:function hE(){},
hG:function hG(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
hF:function hF(a){this.a=a},
j5(a,b){var s=new A.f4()
s.ey(a,b)
return s},
f4:function f4(){this.a=$
this.b=0
this.c=2147483647},
fN:function fN(){},
ia:function ia(){},
ib:function ib(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
eh:function eh(a){this.a=a
this.c=this.b=0},
dL:function dL(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
ox(a,b,c){var s,r="The decoded data is larger than the ",q=new A.dT(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.f(A.j0(r+b+" bytes allowed"))
throw s}if(q.e)throw A.f(A.j0(r+b+" bytes allowed"))
return p},
dT:function dT(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
j_(a){return new A.ca(a,null,null)},
iZ(a){return new A.cB(a,null,null)},
j0(a){return new A.dC(a,null,null)},
ca:function ca(a,b,c){this.a=a
this.b=b
this.c=c},
cB:function cB(a,b,c){this.a=a
this.b=b
this.c=c},
dC:function dC(a,b,c){this.a=a
this.b=b
this.c=c},
cD:function cD(a,b){this.a=a
this.b=b},
e6:function e6(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
lm(a,b,c,d){var s,r,q,p=c,o=new A.h8($.jB)
$.jB=o
try{if(d.$0())return!0
if(p){r=A.j_("Invalid "+a+" data")
throw A.f(r)}return!1}catch(q){s=A.ah(q)
r=s
if(!(r instanceof A.ca||r instanceof A.cB||r instanceof A.a_||t.b8.b(r)||t.E.b(r)))throw q
r=s instanceof A.dC
if(r)throw q
if(s instanceof A.cB){if(b&&c)throw q
if(c){r=A.j_(s.a)
throw A.f(r)}return!1}if(s instanceof A.ca){if(p)throw q
return!1}if(p){r=A.j_("Invalid "+a+" data: "+A.w(s))
throw A.f(r)}return!1}finally{$.jB=o.a}},
h8:function h8(a){this.a=a},
j6(a,b,c,d){var s,r,q,p,o=new A.dM(b)
if(d==null)d=0
A.jj(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.a9(a))
p=J.c9(B.d.ga7(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
dM:function dM(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
dN:function dN(){},
jg(a){var s=a==null?32768:a
return new A.bR(new Uint8Array(s),B.o)},
bR:function bR(a,b){this.b=0
this.c=a
this.a=b},
bx:function bx(){},
m2(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
m1(a){var s,r,q,p,o=new Uint32Array(2048)
B.l.C(o,0,256,a)
for(s=0;s<256;++s){r=a[s]
for(q=1;q<8;++q){r=(a[r&255]^r>>>8)>>>0
p=(q<<8|s)>>>0
if(!(p<2048))return A.a(o,p)
o[p]=r}}return o},
k5(a,b,c){var s,r,q,p,o,n,m,l,k=$.lt(),j=b+c,i=4294967295
if(c>=16){s=A.j3(a,b,j)
r=(c&4294967288)>>>0
for(q=0;q<r;){p=s.getUint32(q,!0)^i
o=s.getUint32(q+4,!0)
i=k[1792+(p&255)]^k[1536+(p>>>8&255)]^k[1280+(p>>>16&255)]^k[1024+(p>>>24&255)]^k[768+(o&255)]^k[512+(o>>>8&255)]^k[256+(o>>>16&255)]^k[o>>>24&255]
q+=8}n=b+q}else n=b
for(m=a.length;n<j;n=l){l=n+1
if(!(n<m))return A.a(a,n)
i=k[(i^a[n])&255]^i>>>8}return(i^4294967295)&2147483647},
ap(a,b){return(a&65535)*b+(((a>>>16)*b&65535)<<16>>>0)>>>0},
k4(a,b){return(B.a.ds(a,b)|B.a.er(a,32-b))>>>0},
m3(a,b,c,d){var s,r,q,p,o,n,m,l=3266489917,k=d?1367130551:0,j=(2654435761^c^k)>>>0,i=b+c,h=(c&4294967292)>>>0
if(c>=16){s=A.j3(a,b,i)
for(r=0;r<h;){k=j+A.ap(s.getUint32(r,!0),l)>>>0
j=A.ap((k<<17|k>>>15)>>>0,668265263)
r+=4}q=b+r}else{h=b+h
for(k=a.length,q=b;q<h;){if(!(q<k))return A.a(a,q)
p=a[q]
o=q+1
if(!(o<k))return A.a(a,o)
o=a[o]
n=q+2
if(!(n<k))return A.a(a,n)
n=a[n]
m=q+3
if(!(m<k))return A.a(a,m)
m=j+A.ap((p|o<<8|n<<16|a[m]<<24)>>>0,l)>>>0
j=A.ap((m<<17|m>>>15)>>>0,668265263)
q+=4}}for(k=a.length;q<i;){if(!(q<k))return A.a(a,q)
p=j+A.ap(a[q],374761393)>>>0
j=A.ap((p<<11|p>>>21)>>>0,2654435761);++q}j=A.ap((j^j>>>15)>>>0,2246822519)
j=A.ap((j^j>>>13)>>>0,l)
return(j^j>>>16)>>>0},
j2(a,b,c,d,e){var s=e?2147483648:0,r=(a&2147483647|s)>>>0,q=A.m3(b,c,d,e)
return new A.x(r,r===0&&q===0?1:q)},
k6(a,b,c,d){var s=A.k4(A.ap((a^c)>>>0,2246822519),13),r=A.k4(A.ap((b^d)>>>0,3266489917),17)
s=A.ap(s+r>>>0,668265263)
return new A.x(s,A.ap((r^s>>>16)>>>0,374761393))},
ez:function ez(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eR:function eR(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
_.a=a
_.b=4194304
_.d=134217728
_.r=!0
_.x=b
_.y=c
_.z=d
_.Q=e
_.as=f
_.ax=_.at=0
_.ay=g
_.ch=h
_.CW=0
_.cx=null
_.db=_.cy=0
_.dx=i
_.dy=j
_.fr=k
_.fx=l
_.go=_.fy=0},
eV:function eV(a,b,c){this.a=a
this.b=b
this.c=c},
eU:function eU(a,b){this.a=a
this.b=b},
eS:function eS(a){this.a=a},
eT:function eT(a){this.a=a},
ki(a,b,c){var s,r,q
for(s=b;s<c;s=r){r=s+65536
q=r<c?r:c
B.d.C(a,s,q,$.ly())}},
mt(b5,b6,b7,b8,b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
if(b6<0||b6>b5.length)throw A.f(A.ar(b6,0,b5.length,"srcLength",null))
if(b6===0)return 0
s=b9>=0?b9:b7.length
r=0
q=0
if(b6>=13){B.e.C(b8,0,16384,$.lx())
p=A.j3(b5,0,b6)
o=b6-12
n=b6-5
m=n-4
l=p.getUint32(0,!0)*2654435761>>>0>>>18
b8.$flags&2&&A.d(b8)
if(!(l<16384))return A.a(b8,l)
b8[l]=0
k=p.getUint32(1,!0)
j=k*2654435761>>>0>>>18
A:for(l=b5.length,i=b7.$flags|0,h=1;;){g=h
f=1
e=64
do{d=g+f
f=e>>>6;++e
if(d>o)break A
c=p.getUint32(d,!0)
b=c*2654435761>>>0>>>18
if(!(j>=0&&j<16384))return A.a(b8,j)
a=b8[j]
b8[j]=g
if(a<0||g-a>65535||p.getUint32(a,!0)!==k){g=d
j=b
k=c
continue}else break}while(!0)
h=g
for(;;){a0=!1
if(h>q)if(a>0){a0=h-1
if(!(a0>=0&&a0<l))return A.a(b5,a0)
a0=b5[a0]
a1=a-1
if(!(a1<l))return A.a(b5,a1)
a1=a0===b5[a1]
a0=a1}if(!a0)break;--h;--a}for(;;){if(!!0){j=b
k=c
break}a2=h-q
a3=r+1
if(a3+B.a.J(a2,255)+1+a2+2>s)return-1
a0=a2>=15
a4=(a0?15:a2)<<4
if(a0){a5=a2-15
for(;a5>=255;a3=a6){a6=a3+1
i&2&&A.d(b7)
if(!(a3>=0&&a3<b7.length))return A.a(b7,a3)
b7[a3]=255
a5-=255}a6=a3+1
i&2&&A.d(b7)
if(!(a3>=0&&a3<b7.length))return A.a(b7,a3)
b7[a3]=a5
a3=a6}if(a2>=8){a6=a3+a2
B.d.N(b7,a3,a6,b5,q)
a3=a6}else for(a7=0;a7<a2;++a7,a3=a6){a6=a3+1
a0=q+a7
if(!(a0>=0&&a0<l))return A.a(b5,a0)
a0=b5[a0]
i&2&&A.d(b7)
if(!(a3>=0&&a3<b7.length))return A.a(b7,a3)
b7[a3]=a0}a8=h-a
a6=a3+1
i&2&&A.d(b7)
a0=b7.length
if(!(a3>=0&&a3<a0))return A.a(b7,a3)
b7[a3]=a8&255
a3=a6+1
a1=B.a.K(a8,8)
if(!(a6>=0&&a6<a0))return A.a(b7,a6)
b7[a6]=a1&255
a9=a+4
b0=h+4
for(;;){if(!(b0<=m&&p.getUint32(b0,!0)===p.getUint32(a9,!0)))break
b0+=4
a9+=4}for(;;){if(b0<n){if(!(b0>=0&&b0<l))return A.a(b5,b0)
a1=b5[b0]
if(!(a9>=0&&a9<l))return A.a(b5,a9)
a1=a1===b5[a9]}else a1=!1
if(!a1)break;++b0;++a9}b1=b0-h-4
if(b1>=15){a4=(a4|15)>>>0
a5=b1-15
if(a3+(B.a.J(a5,255)+1)>=s)return-1
for(;a5>=255;a3=a6){a6=a3+1
if(!(a3>=0&&a3<a0))return A.a(b7,a3)
b7[a3]=255
a5-=255}a6=a3+1
if(!(a3>=0&&a3<a0))return A.a(b7,a3)
b7[a3]=a5
a3=a6}else a4=(a4|b1)>>>0
if(!(r>=0&&r<a0))return A.a(b7,r)
b7[r]=a4
if(b0>o){q=b0
r=a3
break A}a0=b0-2
a1=p.getUint32(a0,!0)*2654435761>>>0>>>18
if(!(a1<16384))return A.a(b8,a1)
b8[a1]=a0
b2=p.getUint32(b0,!0)
b3=b2*2654435761>>>0>>>18
if(!(b3<16384))return A.a(b8,b3)
a=b8[b3]
b8[b3]=b0
if(a<0||b0-a>65535||p.getUint32(a,!0)!==b2){h=b0+1
k=p.getUint32(h,!0)
j=k*2654435761>>>0>>>18
q=b0
r=a3
break}h=b0
q=h
r=a3}}}b4=b6-q
l=b4>=15
i=r+(1+(l?B.a.J(b4-15,255)+1:0)+b4)
if(i>s||i>b7.length)return-1
a3=r+1
i=b7.$flags|0
if(l){i&2&&A.d(b7)
l=b7.length
if(!(r>=0&&r<l))return A.a(b7,r)
b7[r]=240
a5=b4-15
for(r=a3;a5>=255;r=a3){a3=r+1
if(!(r>=0&&r<l))return A.a(b7,r)
b7[r]=255
a5-=255}a3=r+1
if(!(r>=0&&r<l))return A.a(b7,r)
b7[r]=a5
r=a3}else{i&2&&A.d(b7)
if(!(r>=0&&r<b7.length))return A.a(b7,r)
b7[r]=b4<<4>>>0
r=a3}l=r+b4
B.d.N(b7,r,l,b5,q)
return l},
mu(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0
if(b3<0||b2+b3>b1.length||b5<0||b5>b4.length)throw A.f(A.ko("Invalid LZ4 slice bounds"))
if(b3===0){if(b5!==0)throw A.f(B.Y)
return 0}s=b2+b3
for(r=b4.length,q=b4.$flags|0,p=b1.length,o=b2,n=0;o<s;){m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
l=b1[o]
k=l>>>4
if(k===15)for(o=m;;o=m){if(o>=s)throw A.f(B.Z)
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
j=b1[o]
k+=j
if(j!==255){o=m
break}}else o=m
m=o+k
if(m>s||n+k>b5)throw A.f(B.X)
i=n+k
if(k>=8){B.d.N(b4,n,i,b1,o)
n=i
o=m}else for(;n<i;n=h,o=m){h=n+1
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
g=b1[o]
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}if(o>=s)break
m=o+2
if(m>s)throw A.f(B.T)
if(!(o>=0&&o<p))return A.a(b1,o)
g=b1[o]
f=o+1
if(!(f<p))return A.a(b1,f)
e=(g|b1[f]<<8)>>>0
if(e<=0||e>n)throw A.f(B.V)
g=l&15
d=g+4
if(g===15)for(o=m;;o=m){if(o>=s)throw A.f(B.a_)
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
j=b1[o]
d+=j
if(j!==255){o=m
break}}else o=m
i=n+d
if(i>b5)throw A.f(B.a1)
c=n-e
if(e>=d){if(d>=8)B.d.N(b4,n,i,b4,c)
else for(b=0;b<d;++b){g=n+b
f=c+b
if(!(f>=0&&f<r))return A.a(b4,f)
f=b4[f]
q&2&&A.d(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=f}n=i}else if(e===4){if(!(c>=0&&c<r))return A.a(b4,c)
a=b4[c]
g=c+1
if(!(g<r))return A.a(b4,g)
a0=b4[g]
g=c+2
if(!(g<r))return A.a(b4,g)
a1=b4[g]
g=c+3
if(!(g<r))return A.a(b4,g)
a2=b4[g]
if((a|a0|a1|a2)===0){A.ki(b4,n,i)
n=i}else if(d<=32){a3=n+((d&4294967292)>>>0)
while(n<a3){q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=a
g=n+1
if(!(g<r))return A.a(b4,g)
b4[g]=a0
g=n+2
if(!(g<r))return A.a(b4,g)
b4[g]=a1
g=n+3
if(!(g<r))return A.a(b4,g)
b4[g]=a2
n+=4}for(;n<i;c=a4,n=h){h=n+1
a4=c+1
if(!(c<r))return A.a(b4,c)
g=b4[c]
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}}else{for(b=0;b<16;b+=4){g=n+b
q&2&&A.d(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=a
f=g+1
if(!(f<r))return A.a(b4,f)
b4[f]=a0
f=g+2
if(!(f<r))return A.a(b4,f)
b4[f]=a1
g+=3
if(!(g<r))return A.a(b4,g)
b4[g]=a2}for(a5=16;a5<d;){a6=d-a5
a7=a5<a6?a5:a6
g=n+a5
B.d.N(b4,g,g+a7,b4,n)
a5+=a7}n=i}}else if(e===1){if(!(c>=0&&c<r))return A.a(b4,c)
a8=b4[c]
if(a8===0){A.ki(b4,n,i)
n=i}else if(d<=32)for(;n<i;n=h){h=n+1
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=a8}else{for(b=0;b<16;++b){g=n+b
q&2&&A.d(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=a8}for(a5=16;a5<d;){a6=d-a5
a7=a5<a6?a5:a6
g=n+a5
B.d.N(b4,g,g+a7,b4,n)
a5+=a7}n=i}}else if(d>32){a9=e>=16?e:B.a.a_(16+e-1,e)*e
b0=a9<d?a9:d
for(a5=0;a5<b0;){g=n+a5
f=c+a5
if(!(f>=0&&f<r))return A.a(b4,f)
f=b4[f]
q&2&&A.d(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=f;++a5}while(a5<d){a6=d-a5
a7=a5<a6?a5:a6
g=n+a5
B.d.N(b4,g,g+a7,b4,n)
a5+=a7}n=i}else for(;n<i;c=a4,n=h){h=n+1
a4=c+1
if(!(c>=0&&c<r))return A.a(b4,c)
g=b4[c]
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}}if(n!==b5)throw A.f(A.O("LZ4 decoded "+n+" bytes, expected "+b5,null,null))
return n},
fd:function fd(a,b){this.a=a
this.b=b
this.c=0},
mR(c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5=null,c6=d5*d1,c7=c9.length
if(d5<=0||d1<=0||c6>147456||c7<2||c7>4||d4.length<c6*4)return c5
s=B.a.J(d5+16-1,16)
r=s*B.a.J(d1+16-1,16)
q=c7*r
p=new Uint16Array(q)
o=new Uint8Array(4)
B.d.ac(o,0,4,255)
n=new Uint32Array(4)
m=new Uint32Array(4)
l=c6*4
if((d4.byteOffset&3)===0){k=A.jr(d4,0,l)
j=c5}else{j=new Uint8Array(l)
k=A.jr(j,0,l)}i=A.h([],t.a1)
h=A.a5(t.h6,t.L)
g=128+p.byteLength
for(f=k.length,e=j!=null,d=0,c=0;c<c7;++c){if(!(c<c9.length))return A.a(c9,c)
b=c9[c]
a=b-c8
a0=!0
if(a>=0)if(a<4){if(!(a>=0&&a<4))return A.a(o,a)
a0=o[a]!==255||!d3.$2(b,d4)}if(a0)return c5
if(e)B.d.C(j,0,l,d4)
if(!(a>=0&&a<4))return A.a(o,a)
o[a]=c
a1=d0.$1(b)
if(a1==null)a1=B.v
if(!(c<4))return A.a(n,c)
n[c]=a1.a
m[c]=a1.b
for(a0=c>0,a2=c*r,a3=(c-1)*r,a4=0;a4<r;++a4){a5=B.a.T(a4,s)*16
a6=B.a.a_(a4,s)*16
a7=Math.min(16,d5-a5)
a8=Math.min(16,d1-a6)
for(a9=2166136261,b0=0;b0<a8;++b0){b1=(a6+b0)*d5+a5
for(b2=0;b2<a7;++b2){b3=b1+b2
if(!(b3>=0&&b3<f))return A.a(k,b3)
a9=((a9^k[b3])>>>0)*16777619>>>0}}b4=h.ec(new A.aC(a7,a8,a9),new A.fG())
b3=J.bF(b4)
b6=b3.gD(b4)
for(;;){if(!b6.u()){b5=-1
break}b5=b6.gB()
if(b5>>>0!==b5||b5>=i.length)return A.a(i,b5)
b7=i[b5]
b8=b7.length
b9=!0
b0=0
for(;;){if(!(b0<a8&&b9))break
b1=(a6+b0)*d5+a5
for(c0=b0*a7,b2=0;b2<a7;++b2){c1=c0+b2
if(!(c1>=0&&c1<b8))return A.a(b7,c1)
c1=b7[c1]
c2=b1+b2
if(!(c2>=0&&c2<f))return A.a(k,c2)
if(c1!==k[c2]){b9=!1
break}}++b0}if(b9)break}if(b5<0){b6=a7*a8
g+=b6*4+48
if(g>d2)return c5
b7=new Uint32Array(b6)
for(b0=0;b0<a8;b0=c3){c3=b0+1
B.l.N(b7,b0*a7,c3*a7,k,(a6+b0)*d5+a5)}b5=i.length
b3.m(b4,b5)
B.b.m(i,b7)}b3=a2+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
p[b3]=b5
if(a0){b3=a3+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
b3=p[b3]!==b5}else b3=!1
if(b3)++d}}if(d*3>(c7-1)*r)return c5
q=A.h([],t.gN)
for(l=i.length,c4=0;c4<i.length;i.length===l||(0,A.Z)(i),++c4)q.push(J.lY(B.l.ga7(i[c4])))
return new A.ed(d5,d1,c8,o,p,q,new A.e(),g,n,m)},
fF:function fF(){this.a=null
this.b=-1},
ed:function ed(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=0
_.as=_.Q=$},
fG:function fG(){},
az:function az(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nC(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.l.C(a,0,b,$.jZ())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.l.C(a,s,q,$.jZ())}},
iz(a){var s=0,r=A.l8(t.H),q,p,o,n,m
var $async$iz=A.lf(function(b,c){if(b===1)return A.kU(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.id(A.jQ(A.v(v.G.WebAssembly.instantiate(a)),t.m),$async$iz)
case 2:o=n.v(m.v(c.instance).exports)
for(q=0;q<13;++q){p=B.af[q]
if(!(typeof o[p]==="function"))throw A.f(A.as("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.v(o.memory).buffer).byteLength===0)throw A.f(A.as("FastLottie Wasm memory is empty"))
$.k=o
return A.kV(null,r)}})
return A.kW($async$iz,r)},
aU(a){var s,r,q=$.k
q.toString
s=a===0?1:a
r=A.j(q.malloc(s))>>>0
if(r===0)throw A.f(A.as("Could not allocate "+a+" Wasm bytes"))
B.d.ac(A.jf(t.a.a(A.v($.k.memory).buffer),r,a),0,a,0)
return r},
fk(a){var s=new A.b8(!0,a,null,null),r=$.k!=null
if(r)s.c=A.aU(a*4)
else s.d=new Uint32Array(a)
return s},
cz(a,b){var s
if(b<=0)return
s=a.b
if(b>s)throw A.f(A.ar(b,0,s,"count",null))
s=a.c
if(s!=null)$.k.fastlottie_clear_pixels(s,b)
else A.nC(a.gv(),b)},
oU(a,b,c,d,e,f,g){var s,r,q,p=a.c
if(p!=null&&e.b!=null&&d>0&&f>=0&&f*2<=e.a){if(f===0)return!0
s=$.k
s.toString
r=a.b
q=e.b
q.toString
A.dz(s,"fastlottie_fill_solid_spans",[p,r,b,c,d,q,f,g],t.H)
return!0}return!1},
oN(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null||e<=0||f<=0||c<=0||b<0||d.b<e*f||b+(f-1)*c+e>a.b)return!1
try{s=$.k
s.toString
A.dz(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
oO(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null||d<=0||f<0||f*2>e.a)return!1
if(f===0)return!0
try{s=$.k
s.toString
A.dz(s,"fastlottie_blend_solid",[q,a.b,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
oQ(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null||e<=0||f<=0||i<=0||j<=0||c<=0||b<0||g<0||h<0||g+i>e||h+j>f||d.b<e*f||b+(j-1)*c+i>a.b)return!1
try{s=$.k
s.toString
A.dz(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
oP(a,b,c,d,e,f,g,h,i,j,k,l,m,n,a0,a1,a2,a3,a4,a5){var s,r,q,p,o=a.c
if(o==null||e.b==null||g.c==null||d<=0||f<0||f*2>e.a||g.b<1024)return!1
if(f===0)return!0
s=$.k
s.toString
r=a.b
q=e.b
q.toString
p=g.c
p.toString
A.dz(s,"fastlottie_gradient_spans",[o,r,b,c,d,q,f,p,h,i,j?1:0,k,l,m,n,a0,a1,a2,a3,a4,a5],t.H)
return!0},
mx(){var s,r,q=$.k==null
if(q)return null
try{s=A.j($.k.fl_dense_new())
if(!J.l(s,0)){q=A.aU(16)
return new A.fg(s,q)}}catch(r){}return null},
mw(){var s,r=$.fh
if(r!=null){$.cM=$.cM+1
return r}s=A.mx()
if(s==null)return null
$.fh=s
$.cM=1
return s},
b9:function b9(a){this.a=a
this.c=this.b=null},
b8:function b8(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fg:function fg(a,b){var _=this
_.a=a
_.b=b
_.y=_.x=_.w=_.r=_.f=_.e=_.d=_.c=0},
fi:function fi(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
bE(a,b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g
while(a instanceof A.X)a=a.a
if(a instanceof A.a6){s=a.c
if(!s.gaB()){r=a4.d2(a6)
A.eI(s,b,c,d,e,f,a0,a1,r)
q=r[0]
p=r[1]
o=r[2]
n=r[3]
m=r[4]
l=r[5]}else{l=a1
m=a0
n=f
o=e
p=d
q=c}for(s=a.a,k=s.length-1,j=a6+1;k>=0;--k){if(!(k<s.length))return A.a(s,k)
A.bE(s[k],b,q,p,o,n,m,l,a2,a3,a4,a5,j)}return}if(a instanceof A.bl){i=A.nJ(a.a,a.b,b,A.l7(c,d,e,f,a2),a4,a5,a6)
if(i!=null&&i.r>0)a3.aF(i,c,d,e,f,a0,a1)
return}if(a instanceof A.aR){if(a.b===3&&a.a.length>=2){for(s=a.a,k=0;k<s.length-1;++k)A.bE(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
h=a4.eG(a6)
A.bE(B.b.gad(s),b,c,d,e,f,a0,a1,a2,h,a4,a5,a6+1)
a3.fW(h)
return}for(s=a.a,k=0;k<s.length;++k)A.bE(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
return}if(a.ga6()){a3.aF(a4.dv(a,b),c,d,e,f,a0,a1)
return}if(c===1&&d===0&&e===0&&f===1&&a0===0&&a1===0)A.ii(a,b,a2,a3)
else{g=a4.fx
g.l(0)
A.ii(a,b,A.l7(c,d,e,f,a2),g)
a3.aF(g,c,d,e,f,a0,a1)}},
l7(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
l1(b4,b5,b6,b7,b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0=b4.e,b1=b0.n(b5),b2=b1.length,b3=b2/6|0
if(b3===0)return
s=b4.f
r=b4.r
if(r.length!==0){q=b0.b.a
if(b5<=B.f.ga5(q)){p=B.b.ga5(r).a
s=p}else if(b5>=B.f.gad(q)){p=B.b.gad(r).a
s=p}else{b0=b0.r
if(!(b0<r.length))return A.a(r,b0)
o=r[b0]
n=o.a
m=o.b
p=n&&m
s=n}}else p=s
b7.a4(s)
for(;;)break
l=p?b3:b3-1
if(b8!=null){b0=b8.a
k=b0[0]
j=b0[1]
i=b0[2]
h=b0[3]
g=b0[4]
f=b0[5]
if(0>=b2)return A.a(b1,0)
e=b1[0]
if(1>=b2)return A.a(b1,1)
d=b1[1]
b7.p(k*e+i*d+g,j*e+h*d+f)
for(c=1;c<=l;++c,d=a5,e=a4){b=(c-1)*6
a=(c===b3?0:c)*6
b0=b+4
if(!(b0>=0&&b0<b2))return A.a(b1,b0)
a0=b1[b0]
b0=b+5
if(!(b0>=0&&b0<b2))return A.a(b1,b0)
a1=b1[b0]
b0=a+2
if(!(b0<b2))return A.a(b1,b0)
a2=b1[b0]
b0=a+3
if(!(b0<b2))return A.a(b1,b0)
a3=b1[b0]
if(!(a<b2))return A.a(b1,a)
a4=b1[a]
b0=a+1
if(!(b0<b2))return A.a(b1,b0)
a5=b1[b0]
b0=Math.abs(a0)<=0.0001&&Math.abs(a1)<=0.0001&&Math.abs(a2)<=0.0001&&Math.abs(a3)<=0.0001
r=k*a4+i*a5
q=j*a4+h*a5
if(b0)b7.p(r+g,q+f)
else{if(!(b>=0&&b<b2))return A.a(b1,b)
a6=b1[b]+a0
b0=b+1
if(!(b0<b2))return A.a(b1,b0)
a7=b1[b0]+a1
a8=a4+a2
a9=a5+a3
b7.V(k*e+i*d+g,j*e+h*d+f,k*a6+i*a7+g,j*a6+h*a7+f,k*a8+i*a9+g,j*a8+h*a9+f,r+g,q+f,b6)}}}else{if(0>=b2)return A.a(b1,0)
e=b1[0]
if(1>=b2)return A.a(b1,1)
d=b1[1]
b7.p(e,d)
for(c=1;c<=l;++c,d=a5,e=a4){b=(c-1)*6
a=(c===b3?0:c)*6
b0=b+4
if(!(b0>=0&&b0<b2))return A.a(b1,b0)
a0=b1[b0]
b0=b+5
if(!(b0>=0&&b0<b2))return A.a(b1,b0)
a1=b1[b0]
b0=a+2
if(!(b0<b2))return A.a(b1,b0)
a2=b1[b0]
b0=a+3
if(!(b0<b2))return A.a(b1,b0)
a3=b1[b0]
if(!(a<b2))return A.a(b1,a)
a4=b1[a]
b0=a+1
if(!(b0<b2))return A.a(b1,b0)
a5=b1[b0]
if(Math.abs(a0)<=0.0001&&Math.abs(a1)<=0.0001&&Math.abs(a2)<=0.0001&&Math.abs(a3)<=0.0001)b7.p(a4,a5)
else{if(!(b>=0&&b<b2))return A.a(b1,b)
b0=b1[b]
r=b+1
if(!(r<b2))return A.a(b1,r)
b7.V(e,d,b0+a0,b1[r]+a1,a4+a2,a5+a3,a4,a5,b6)}}}b7.a2()},
ii(a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(a3 instanceof A.aB){A.l1(a3,a4,a5,a6,null)
return}if(a3 instanceof A.b1){a6.a4(!0)
s=a6.gfV()
a3.f7(a4,s,s,new A.ij(a6,a5),a6.ghc())
return}if(a3 instanceof A.aT){r=a3.r.n(a4)
q=a3.w.n(a4)
s=r.length
if(0>=s)return A.a(r,0)
p=r[0]
if(1>=s)return A.a(r,1)
o=r[1]
s=q.length
if(0>=s)return A.a(q,0)
n=q[0]*0.5
if(1>=s)return A.a(q,1)
m=q[1]*0.5
if(a3.e){l=n*0.5522847498307936
k=m*0.5522847498307936
a6.a4(!0)
s=o-m
a6.p(p,s)
j=p+l
i=p+n
h=o-k
g=o+k
f=o+m
e=p-l
d=p-n
if(!a3.f){a6.V(p,s,j,s,i,h,i,o,a5)
a6.V(i,o,i,g,j,f,p,f,a5)
a6.V(p,f,e,f,d,g,d,o,a5)
a6.V(d,o,d,h,e,s,p,s,a5)}else{a6.V(p,s,e,s,d,h,d,o,a5)
a6.V(d,o,d,g,e,f,p,f,a5)
a6.V(p,f,j,f,i,g,i,o,a5)
a6.V(i,o,i,h,j,s,p,s,a5)}a6.a2()
return}s=a3.x.n(a4)
if(0>=s.length)return A.a(s,0)
c=B.c.F(s[0],0,Math.min(Math.abs(n),Math.abs(m)))
if(c<=0.0001){a6.a4(!0)
s=p+n
j=o-m
a6.p(s,j)
i=o+m
h=p-n
if(!a3.f){a6.p(s,i)
a6.p(h,i)
a6.p(h,j)}else{a6.p(h,j)
a6.p(h,i)
a6.p(s,i)}a6.a2()
return}b=c*0.5522847498307936
a6.a4(!0)
s=p+n
j=o-m
i=j+c
a6.p(s,i)
h=o+m
g=s-c
f=p-n
e=i-b
d=h-c
a=g+b
a0=f+c
if(!a3.f){a6.p(s,d)
a1=d+b
a6.V(s,d,s,a1,a,h,g,h,a5)
a6.p(a0,h)
a2=a0-b
a6.V(a0,h,a2,h,f,a1,f,d,a5)
a6.p(f,i)
a6.V(f,i,f,e,a2,j,a0,j,a5)
a6.p(g,j)
a6.V(g,j,a,j,s,e,s,i,a5)}else{a6.V(s,i,s,e,a,j,g,j,a5)
a6.p(a0,j)
a1=a0-b
a6.V(a0,j,a1,j,f,e,f,i,a5)
a6.p(f,d)
i=d+b
a6.V(f,d,f,i,a1,h,a0,h,a5)
a6.p(g,h)
a6.V(g,h,a,h,s,i,s,d,a5)}a6.a2()}},
nJ(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=a.a,b=c.length
if(a0>=b)return null
s=a.b.n(a1)
if(0>=s.length)return A.a(s,0)
r=B.c.F(s[0],0,100)/100
s=a.c.n(a1)
if(0>=s.length)return A.a(s,0)
q=B.c.F(s[0],0,100)/100
p=Math.abs(q-r)
if(p<0.000001)return null
if(!(a0<c.length))return A.a(c,a0)
o=c[a0]
n=a3.eJ(a4)
s=a4+1
A.bE(o,a1,1,0,0,1,0,0,a2,n,a3,s,a5)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a.d.n(a1)
if(0>=l.length)return A.a(l,0)
k=B.c.T(m+l[0]/360,1)
j=k+p
if(!a.e){i=A.l9(o,a1,a2,a3,n,s,a5)
h=0}else{g=a3.f8(a4,a,a1,a2)
if(g==null){g=a3.eH(a4,b+1)
g.$flags&2&&A.d(g)
m=g.length
if(0>=m)return A.a(g,0)
g[0]=0
for(f=0,e=0;e<b;){if(!(e<c.length))return A.a(c,e)
l=c[e]
f+=A.l9(l,a1,a2,a3,e===a0?n:null,s,a5);++e
if(!(e<m))return A.a(g,e)
g[e]=f}a3.fv(a4,a,a1,a2)}c=g.length
if(!(b<c))return A.a(g,b)
i=g[b]
if(!(a0<c))return A.a(g,a0)
h=g[a0]}d=a3.eI(a4)
c=a3.p3
A.l_(n,k*i-h,Math.min(j,1)*i-h,d,c)
if(j>1)A.l_(n,-h,(j-1)*i-h,d,c)
return d},
l9(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga6()){s=d.f9(a)
if(s!=null)return s}r=A.em()
if(e!=null)r.se2(e)
else{r.se2(d.eF(f))
A.bE(a,b,1,0,0,1,0,0,c,r.ap(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.r(A.aq(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.r(A.aq(""))
n=o.a
j=n.length
if(!(k>=0&&k<j))return A.a(n,k)
i=n[k]
h=k-1
if(!(h>=0&&h<j))return A.a(n,h)
n=i-n[h]
o=o.b
j=o.length
if(!(k<j))return A.a(o,k)
i=o[k]
if(!(h<j))return A.a(o,h)
o=i-o[h]
q+=Math.sqrt(n*n+o*o)}o=r.b
if(o===r)A.r(A.aq(""))
n=o.e
if(!(p<n.length))return A.a(n,p)
if(n[p]===1){n=o.a
j=n.length
if(!(m>=0&&m<j))return A.a(n,m)
i=n[m]
h=l-1
if(!(h>=0&&h<j))return A.a(n,h)
n=i-n[h]
o=o.b
j=o.length
if(!(m<j))return A.a(o,m)
i=o[m]
if(!(h<j))return A.a(o,h)
o=i-o[h]
q+=Math.sqrt(n*n+o*o)}}++p}if(a.ga6()){o=d.bw
o.A(0,a)
if(o.a>=256)o.A(0,new A.P(o,o.$ti.i("P<1>")).ga5(0))
n=d.ay
n.toString
o.q(0,a,new A.ac(n,q,t.e))}return q},
l_(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
for(s=0,r=0;r<a3.r;++r){q=a3.c
if(!(r<q.length))return A.a(q,r)
p=q[r]
q=a3.d
if(!(r<q.length))return A.a(q,r)
o=q[r]
n=o-p
if(n<2)continue
q=a3.e
if(!(r<q.length))return A.a(q,r)
m=q[r]===1
l=m?n:n-1
k=a7.aI(l+1)
k.$flags&2&&A.d(k)
q=k.length
if(0>=q)return A.a(k,0)
k[0]=0
for(j=0;j<l;j=h){i=p+j
h=j+1
g=p+B.a.T(h,n)
if(!(j<q))return A.a(k,j)
f=k[j]
e=a3.a
d=e.length
if(!(g>=0&&g<d))return A.a(e,g)
c=e[g]
if(!(i>=0&&i<d))return A.a(e,i)
e=c-e[i]
c=a3.b
d=c.length
if(!(g<d))return A.a(c,g)
b=c[g]
if(!(i<d))return A.a(c,i)
c=b-c[i]
c=Math.sqrt(e*e+c*c)
k.$flags&2&&A.d(k)
if(!(h<q))return A.a(k,h)
k[h]=f+c}if(!(l<q))return A.a(k,l)
a=k[l]
a0=Math.max(0,a4-s)
a1=Math.min(a,a5-s)
if(a1>a0+1e-7)if(m&&a0<=1e-7&&a1>=a-1e-7){a6.a4(!0)
for(a2=p;a2<o;++a2){q=a3.a
if(!(a2>=0&&a2<q.length))return A.a(q,a2)
q=q[a2]
f=a3.b
if(!(a2<f.length))return A.a(f,a2)
a6.p(q,f[a2])}a6.a2()}else A.kZ(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
kZ(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.a.K(r+a,1)
p=q+1
if(!(p<s))return A.a(a4,p)
if(a4[p]<=a6)r=p
else a=q}a8.a4(!1)
o=a1+r
p=r+1
n=a1+B.a.T(p,a2)
if(!(p>=0&&p<s))return A.a(a4,p)
p=a4[p]
if(!(r>=0&&r<s))return A.a(a4,r)
m=a4[r]
l=p-m
k=l<=1e-12?0:(a6-m)/l
p=a0.a
m=p.length
if(!(o>=0&&o<m))return A.a(p,o)
j=p[o]
if(!(n>=0&&n<m))return A.a(p,n)
p=p[n]
m=a0.b
i=m.length
if(!(o<i))return A.a(m,o)
h=m[o]
if(!(n<i))return A.a(m,n)
a8.p(j+(p-j)*k,h+(m[n]-h)*k)
for(g=r;g<a5;g=f){f=g+1
if(!(f<s))return A.a(a4,f)
e=a4[f]
d=a1+g
c=a1+B.a.T(f,a2)
if(a7<=e+1e-9){if(!(g<s))return A.a(a4,g)
p=a4[g]
b=e-p
s=b<=1e-12?0:B.c.F((a7-p)/b,0,1)
p=a0.a
m=p.length
if(!(d>=0&&d<m))return A.a(p,d)
j=p[d]
if(!(c>=0&&c<m))return A.a(p,c)
p=p[c]
m=a0.b
i=m.length
if(!(d<i))return A.a(m,d)
h=m[d]
if(!(c<i))return A.a(m,c)
a8.p(j+(p-j)*s,h+(m[c]-h)*s)
break}p=a0.a
if(!(c>=0&&c<p.length))return A.a(p,c)
p=p[c]
m=a0.b
if(!(c<m.length))return A.a(m,c)
a8.p(p,m[c])}a8.a2()},
ns(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
for(s=0,r=0;r<a9;++r){q=(r&1)===0?1:0.1
if(!(r<a8.length))return A.a(a8,r)
p=a8[r].n(b3)
if(0>=p.length)return A.a(p,0)
o=Math.max(q,p[0])
b0.$flags&2&&A.d(b0)
if(!(r<b0.length))return A.a(b0,r)
b0[r]=o
s+=o}if(s<=0)return
a8=b2.b.n(b3)
if(0>=a8.length)return A.a(a8,0)
n=B.c.T(a8[0],s)
a8=b0.length
q=a9-1
m=n
l=0
for(;;){if(!(l<a8))return A.a(b0,l)
p=b0[l]
if(!(m>=p&&l<q))break;++l
m-=p}for(k=0;k<b1.r;++k){q=b1.c
if(!(k<q.length))return A.a(q,k)
j=q[k]
q=b1.d
if(!(k<q.length))return A.a(q,k)
i=q[k]-j
if(i<2)continue
q=b1.e
if(!(k<q.length))return A.a(q,k)
h=q[k]===1
g=h?i:i-1
f=b5.aI(g+1)
f.$flags&2&&A.d(f)
q=f.length
if(0>=q)return A.a(f,0)
f[0]=0
for(e=0;e<g;e=c){d=j+e
c=e+1
b=j+B.a.T(c,i)
if(!(e<q))return A.a(f,e)
p=f[e]
a=b1.a
a0=a.length
if(!(b>=0&&b<a0))return A.a(a,b)
a1=a[b]
if(!(d>=0&&d<a0))return A.a(a,d)
a=a1-a[d]
a1=b1.b
a0=a1.length
if(!(b<a0))return A.a(a1,b)
a2=a1[b]
if(!(d<a0))return A.a(a1,d)
a1=a2-a1[d]
a1=Math.sqrt(a*a+a1*a1)
f.$flags&2&&A.d(f)
if(!(c<q))return A.a(f,c)
f[c]=p+a1}if(!(g<q))return A.a(f,g)
a3=f[g]
if(a3<=1e-7)continue
a4=b0[l]-m
for(q=a3-1e-7,a5=l,a6=0;a6<q;a6=a7){a7=Math.min(a3,a6+a4)
if((a5&1)===0&&a7>a6+1e-7)A.kZ(b1,j,i,h,f,g,a6,a7,b4)
a5=(a5+1)%a9
if(!(a5<a8))return A.a(b0,a5)
a4=b0[a5]}}},
b4(a,b,c,d,e,f,g,h,i,j){var s,r,q=f+h,p=g+i,o=q*q+p*p
if(o>1e-12&&j<5){s=1/Math.sqrt(o)
q*=s
p*=s
if(j<2||b*(1-(f*q+g*p))>c){r=j+1
A.b4(a,b,c,d,e,f,g,q,p,r)
a.p(d+b*q,e+b*p)
A.b4(a,b,c,d,e,q,p,h,i,r)
return}}if(j===0)a.p(d+b*h,e+b*i)},
jH(a,b,c,d,e,f,g,h,i){A.b4(a,b,c,d,e,f,g,h,i,0)
a.p(d+b*h,e+b*i)},
ip(a,b,c,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a8?-1:1,d=b.length
if(!(a4>=0&&a4<d))return A.a(b,a4)
s=b[a4]*e
r=c.length
if(!(a4<r))return A.a(c,a4)
q=c[a4]*e
if(!(a5>=0&&a5<d))return A.a(b,a5)
p=b[a5]*e
if(!(a5<r))return A.a(c,a5)
o=c[a5]*e
n=-q
m=-o
l=s*p+q*o
k=s*o-q*p
j=a6+a0*n
i=a7+a0*s
h=a6+a0*m
g=a7+a0*p
if(Math.abs(k)<0.0001&&l>0){a.p((j+h)*0.5,(i+g)*0.5)
return}if(k>=0){a.p(j,i)
a.p(a6,a7)
a.p(h,g)
return}if(a3===1){d=1+l
d=d>0.000001&&2<=a1*d}else d=!1
if(d){f=a0/(1+l)
a.p(a6+(n+m)*f,a7+(s+p)*f)}else if(a3===2){a.p(j,i)
if(l<-0.999){A.jH(a,a0,a2,a6,a7,n,s,s,q)
A.jH(a,a0,a2,a6,a7,s,q,m,p)}else A.jH(a,a0,a2,a6,a7,n,s,m,p)}else{a.p(j,i)
a.p(h,g)}},
kY(e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5
if(e7<=0)return
if(f3.a&&f3.hf(e6,e7,e8,e9,f0,f1,f2))return
s=f0*f0
r=Math.max(0.12,f1*0.5)
for(q=e8===2,p=e8===3,o=f3.d,n=f3.e,m=f3.b,l=f3.c,k=e7*0,j=e7*-1,i=0;i<e6.r;++i){h=e6.c
if(!(i<h.length))return A.a(h,i)
g=h[i]
h=e6.d
if(!(i<h.length))return A.a(h,i)
f=h[i]
e=f-g
if(e<=0)continue
h=e6.e
if(!(i<h.length))return A.a(h,i)
d=h[i]===1
c=m.aI(e)
b=l.aI(e)
for(h=e6.a,a=h.length,a0=e6.b,a1=a0.length,a2=c.length,a3=b.length,a4=c.$flags|0,a5=b.$flags|0,a6=g,a7=0;a6<f;++a6){if(!(a6>=0&&a6<a))return A.a(h,a6)
a8=h[a6]
if(!(a6<a1))return A.a(a0,a6)
a9=a0[a6]
if(a7!==0){b0=a7-1
if(!(b0>=0&&b0<a2))return A.a(c,b0)
b1=c[b0]
if(!(b0<a3))return A.a(b,b0)
b0=Math.abs(a8-b1)+Math.abs(a9-b[b0])>=0.000001}else b0=!0
if(b0){a4&2&&A.d(c)
if(!(a7<a2))return A.a(c,a7)
c[a7]=a8
b2=a7+1
a5&2&&A.d(b)
if(!(a7<a3))return A.a(b,a7)
b[a7]=a9
a7=b2}}h=!1
if(d)if(a7>1){if(0>=a2)return A.a(c,0)
h=c[0]
a=a7-1
if(!(a<a2))return A.a(c,a)
a0=c[a]
if(0>=a3)return A.a(b,0)
a1=b[0]
if(!(a<a3))return A.a(b,a)
a=Math.abs(h-a0)+Math.abs(a1-b[a])<0.000001
h=a}if(h)--a7
if(a7===0)continue
if(a7===1){if(0>=a2)return A.a(c,0)
b3=c[0]
if(0>=a3)return A.a(b,0)
b4=b[0]
if(q){f2.a4(!0)
h=b3+e7
f2.p(h,b4)
A.b4(f2,e7,r,b3,b4,1,0,0,1,0)
a=b3+k
f2.p(a,b4+e7)
A.b4(f2,e7,r,b3,b4,0,1,-1,0,0)
a0=b4+k
f2.p(b3+j,a0)
A.b4(f2,e7,r,b3,b4,-1,0,0,-1,0)
f2.p(a,b4+j)
A.b4(f2,e7,r,b3,b4,0,-1,1,0,0)
f2.p(h,a0)
f2.a2()}else if(p){f2.a4(!0)
h=b3-e7
a=b4-e7
f2.p(h,a)
a0=b3+e7
f2.p(a0,a)
a=b4+e7
f2.p(a0,a)
f2.p(h,a)
f2.a2()}continue}b5=d?a7:a7-1
b6=o.aI(b5)
b7=n.aI(b5)
for(h=b6.$flags|0,a=b7.$flags|0,b8=0;b8<b5;b8=b9){b9=b8+1
c0=b9===a7?0:b9
if(!(c0<a2))return A.a(c,c0)
a0=c[c0]
if(!(b8<a2))return A.a(c,b8)
c1=a0-c[b8]
if(!(c0<a3))return A.a(b,c0)
a0=b[c0]
if(!(b8<a3))return A.a(b,b8)
c2=a0-b[b8]
c3=Math.sqrt(c1*c1+c2*c2)
if(c3>1e-9){h&2&&A.d(b6)
if(!(b8<b6.length))return A.a(b6,b8)
b6[b8]=c1/c3
a&2&&A.d(b7)
if(!(b8<b7.length))return A.a(b7,b8)
b7[b8]=c2/c3}else{h&2&&A.d(b6)
if(!(b8<b6.length))return A.a(b6,b8)
b6[b8]=0
a&2&&A.d(b7)
if(!(b8<b7.length))return A.a(b7,b8)
b7[b8]=0}}if(d){f2.a4(!0)
for(c4=b5-1,c5=0;c5<a7;++c5){c6=c5===0?c4:c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.ip(f2,b6,b7,e7,s,r,e9,c6,c5,h,b[c5],!1)}f2.a2()
f2.a4(!0)
for(c5=a7-1;c5>=0;--c5){c7=c5===0?c4:c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.ip(f2,b6,b7,e7,s,r,e9,c5,c7,h,b[c5],!0)}f2.a2()}else{f2.a4(!0)
if(0>=a2)return A.a(c,0)
h=c[0]
a=b7.length
if(0>=a)return A.a(b7,0)
a0=b7[0]
c8=h+e7*-a0
if(0>=a3)return A.a(b,0)
h=b[0]
a1=b6.length
if(0>=a1)return A.a(b6,0)
a4=e7*b6[0]
c9=h+a4
if(p)f2.p(c8-a4,c9-e7*a0)
else f2.p(c8,c9)
for(h=a7-1,c5=1;c5<h;++c5){if(!(c5<a2))return A.a(c,c5)
a0=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.ip(f2,b6,b7,e7,s,r,e9,c5-1,c5,a0,b[c5],!1)}d0=b5-1
if(!(h>=0&&h<a2))return A.a(c,h)
d1=c[h]
if(!(h<a3))return A.a(b,h)
d2=b[h]
if(!(d0>=0&&d0<a1))return A.a(b6,d0)
d3=b6[d0]
if(!(d0<a))return A.a(b7,d0)
d4=b7[d0]
h=-d4
a=e7*h
d5=d1+a
a0=e7*d3
d6=d2+a0
d7=d1-a
d8=d2-a0
if(p){h=e7*d4
f2.p(d5+a0,d6+h)
f2.p(d7+a0,d8+h)}else if(q){f2.p(d5,d6)
A.b4(f2,e7,r,d1,d2,h,d3,d3,d4,0)
h=e7*d4
f2.p(d1+a0,d2+h)
a0=-d3
A.b4(f2,e7,r,d1,d2,d3,d4,d4,a0,0)
f2.p(d1+h,d2+e7*a0)}else{f2.p(d5,d6)
f2.p(d7,d8)}for(c5=a7-2;c5>=1;c5=d9){d9=c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.ip(f2,b6,b7,e7,s,r,e9,c5,d9,h,b[c5],!0)}e0=c[0]
e1=b[0]
e2=b6[0]
e3=b7[0]
h=-e3
a=e7*h
e4=e0-a
a0=e7*e2
e5=e1-a0
if(p)f2.p(e4-a0,e5-e7*e3)
else if(q){f2.p(e4,e5)
a1=-e2
A.b4(f2,e7,r,e0,e1,e3,a1,a1,h,0)
f2.p(e0+e7*a1,e1+a)
A.b4(f2,e7,r,e0,e1,a1,h,h,e2,0)
f2.p(e0+a,e1+a0)}else f2.p(e4,e5)
f2.a2()}}},
lb(a,b,c,d,e,f,a0){var s,r,q,p,o,n,m,l,k,j,i,h=null,g="Raster output is too small"
if(d<0||e<0||d>65535||e>65535)throw A.f(A.ao("Raster dimensions "+d+"x"+e+" must be in 0..65535",h))
s=d
r=d*e
n=s
if(typeof n!=="number")return n.cB()
if(!(n<d))if(e>0){n=s
m=B.a.a_(c.gv().length,e)
if(typeof n!=="number")return n.en()
m=n>m
n=m}else n=!1
else n=!0
if(n)throw A.f(A.ao(g,h))
n=s
if(typeof n!=="number")return n.ah()
l=n*e
if(l>c.gv().length)throw A.f(A.ao(g,h))
n=f.b
if(n)A.cz(c,l)
else A.ci(c.gv(),l)
m=!0
if(d>0)if(e>0){k=a.b
k===$&&A.D()
if(!(k<=0)){m=a.c
m===$&&A.D()
m=m<=0}}if(m)return
m=a.b
m===$&&A.D()
q=d/m
m=a.c
m===$&&A.D()
p=e/m
o=f.ay
f.ay=a
try{A.jE(a,b,255,c,0,0,s,0,0,d,e,q,0,0,p,0,0,h,f,0,!0,n)
j=Math.max(A.j(r),f.xr)
f.xr=0
i=j<=65536&&!f.as
f.as=!1
if(i){if(++f.y1>=16){f.y1=0
f.hN()}}else f.y1=0}finally{f.sfG(o)}},
jE(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9=null
if(d7>=d9||d8>=e0||d2<=0)return
s=f1?d3:c9
r=d0.w
for(q=r.length-1,p=e9+1,o=e9*3,n=o+1,m=e4>=0,l=e2>=0,k=e3>=0,j=e1>=0,i=t.a,h=s!=null,g=o+2;q>=0;--q){if(!(q<r.length))return A.a(r,q)
f=r[q]
if(!f.ch){if(!f.e)e=(f.b!=null||f.f!=null)&&d1>=f.c&&d1<f.d
else e=!1
e=!e}else e=!0
if(e)continue
e=f.a.e.n(d1)
if(0>=e.length)return A.a(e,0)
if(B.c.H(B.a.F(B.c.M(d2*B.c.H(e[0])/100),0,255)*f.aT(d1)/255)===0)continue
d=f.ay
c=f.Q
e=f.y
b=e===2||e===4
a=f.ax?255:d2
a0=d!=null
a1=!1
if(a0){if(!d.e)a2=(d.b!=null||d.f!=null)&&d1>=d.c&&d1<d.d
else a2=!1
if(a2){a2=d.a.e.n(d1)
if(0>=a2.length)return A.a(a2,0)
a2=B.c.H(B.a.F(B.c.M(a*B.c.H(a2[0])/100),0,255)*d.aT(d1)/255)>0
a1=a2}}if(a0&&!a1&&!b)continue
if(!a1){if(c===0)A.c2(f,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,0,!0,!1,!1,!1,!0)
else{a3=f.aw(d1)
if(a3!=null){e=j?a3.a:a3.c
a0=k?a3.b:a3.d
a4=B.c.P(e1*e+e3*a0+e5)-1
e=l?a3.a:a3.c
a0=m?a3.b:a3.d
a5=B.c.P(e2*e+e4*a0+e6)-1
e=j?a3.c:a3.a
a0=k?a3.d:a3.b
a6=B.c.W(e1*e+e3*a0+e5)+1
e=l?a3.c:a3.a
a0=m?a3.d:a3.b
a7=B.c.W(e2*e+e4*a0+e6)+1
if(a4<d7)a4=d7
if(a5<d8)a5=d8
if(a6>d9)a6=d9
if(a7>e0)a7=e0
a8=a6-a4
a9=a7-a5
if(a8>0&&a9>0){if(f.f==null){e=f.b
b0=e==null?c9:e.gcE()}else b0=c9
e=!1
if(b0!=null){a0=b0.y
if(a0!=null){if(h){a2=$.k
if(a2!=null){a2=!0
if(c!==6)if(c!==7)if(c!==9)a2=c>=12&&c<=15
if(!a2){e=!1
if(a0.w){a0=a0.f
if(a0!=null)if(a0.a!=null){e=a0.n(0)
if(0>=e.length)return A.a(e,0)
e=e[0]!==0}else e=!0}e=!e}}}}else e=!0}if(e){A.c2(f,d1,d2,d3,d4,d5,d6,a4,a5,a6,a7,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,c,!0,!1,!1,!1,!0)
continue}e=a8*a9
b1=e8.aL(g,e)
if(f1)A.cz(b1,e)
else{a0=b1.c
if(a0!=null){a2=i.a(A.v($.k.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.ci(a0,e)}A.c2(f,d1,d2,b1,a4,a5,a8,a4,a5,a6,a7,e1,e2,e3,e4,e5,e6,e7,e8,p,f0,f1,0,!0,!0,!1,!1,!0)
if(h){e=!0
if(c!==6)if(c!==7)if(c!==9)e=c>=12&&c<=15
b3=!e&&A.oN(s,(a5-d5)*d6+a4-d4,d6,b1,a8,a9,c)}else b3=!1
if(!b3){e=d3.c
if(e!=null){a0=i.a(A.v($.k.memory).buffer)
b2=d3.b
e=new Uint32Array(a0,e,b2)}else{e=d3.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.v($.k.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.mO(e,a4-d4,a5-d5,d6,a0,0,0,a8,a8,a9,c)}}}}continue}b4=e===3||e===4
b5=f.aw(d1)
if(b5==null)continue
e=j?b5.a:b5.c
a0=k?b5.b:b5.d
b6=B.c.P(e1*e+e3*a0+e5)-1
e=l?b5.a:b5.c
a0=m?b5.b:b5.d
b7=B.c.P(e2*e+e4*a0+e6)-1
e=j?b5.c:b5.a
a0=k?b5.d:b5.b
b8=B.c.W(e1*e+e3*a0+e5)+1
e=l?b5.c:b5.a
a0=m?b5.d:b5.b
b9=B.c.W(e2*e+e4*a0+e6)+1
if(b6<d7)b6=d7
if(b7<d8)b7=d8
if(b8>d9)b8=d9
if(b9>e0)b9=e0
if(b6>=b8||b7>=b9)continue
c0=d.aw(d1)
if(c0!=null){e=j?c0.a:c0.c
a0=k?c0.b:c0.d
c1=Math.max(b6,B.c.P(e1*e+e3*a0+e5)-1)
e=l?c0.a:c0.c
a0=m?c0.b:c0.d
c2=Math.max(b7,B.c.P(e2*e+e4*a0+e6)-1)
e=j?c0.c:c0.a
a0=k?c0.d:c0.b
c3=Math.min(b8,B.c.W(e1*e+e3*a0+e5)+1)
e=l?c0.c:c0.a
a0=m?c0.d:c0.b
c4=Math.min(b9,B.c.W(e2*e+e4*a0+e6)+1)}else{c4=d8
c3=d7
c2=c4
c1=c3}c5=c1<c3&&c2<c4
if(!b&&!c5)continue
if(b&&!c5&&c===0){A.c2(f,d1,d2,d3,d4,d5,d6,b6,b7,b8,b9,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,0,!0,!1,!1,!1,!0)
continue}a4=b?b6:c1
a5=b?b7:c2
a6=b?b8:c3
a7=b?b9:c4
a8=a6-a4
a9=a7-a5
c6=a8*a9
b1=e8.aL(o,c6)
if(f1)A.cz(b1,c6)
else{e=b1.c
if(e!=null){a0=i.a(A.v($.k.memory).buffer)
b2=b1.b
e=new Uint32Array(a0,e,b2)}else{e=b1.d
e.toString}A.ci(e,c6)}A.c2(f,d1,d2,b1,a4,a5,a8,a4,a5,a6,a7,e1,e2,e3,e4,e5,e6,c9,e8,p,f0,f1,0,!0,!0,!1,!1,!0)
c7=e8.aL(n,c6)
if(f1)A.cz(c7,c6)
else{e=c7.c
if(e!=null){a0=i.a(A.v($.k.memory).buffer)
b2=c7.b
e=new Uint32Array(a0,e,b2)}else{e=c7.d
e.toString}A.ci(e,c6)}if(c5)A.c2(d,d1,a,c7,a4,a5,a8,c1,c2,c3,c4,e1,e2,e3,e4,e5,e6,c9,e8,p,f0,f1,0,!0,!0,!b4,!1,!0)
e=d3.c
if(e!=null){a0=i.a(A.v($.k.memory).buffer)
b2=d3.b
e=new Uint32Array(a0,e,b2)}else{e=d3.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.v($.k.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}a2=c7.c
if(a2!=null){c8=i.a(A.v($.k.memory).buffer)
b2=c7.b
a2=new Uint32Array(c8,a2,b2)}else{a2=c7.d
a2.toString}A.nE(e,d4,d5,d6,a0,a2,a8,a9,a4,a5,b,b4,c)}},
nE(b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7=c7-c0,b8=!d0
if(b8&&d1===0){if(!c9){for(b8=c3.length,s=c4.length,r=b9.length,q=c5-3,p=0;p<c6;++p){o=p*c5
n=(c8+p-c1)*c2+b7
for(m=0;m<q;){l=o+m
if(!(l>=0&&l<b8))return A.a(c3,l)
k=c3[l]
j=l+1
if(!(j<b8))return A.a(c3,j)
i=c3[j]
h=l+2
if(!(h<b8))return A.a(c3,h)
g=c3[h]
f=l+3
if(!(f<b8))return A.a(c3,f)
e=c3[f]
if((k|i|g|e)>>>0===0){m+=4
continue}if(!(l<s))return A.a(c4,l)
d=c4[l]
if(!(j<s))return A.a(c4,j)
c=c4[j]
if(!(h<s))return A.a(c4,h)
b=c4[h]
if(!(f<s))return A.a(c4,f)
a=c4[f]
if(((d|c|b|a)&4278190080)>>>0===0){m+=4
continue}a0=n+m
if((d&c&b&a)>>>0>=4278190080){if((k&i&g&e)>>>0>=4278190080){b9.$flags&2&&A.d(b9)
if(!(a0>=0&&a0<r))return A.a(b9,a0)
b9[a0]=k
j=a0+1
if(!(j<r))return A.a(b9,j)
b9[j]=i
i=a0+2
if(!(i<r))return A.a(b9,i)
b9[i]=g
g=a0+3
if(!(g<r))return A.a(b9,g)
b9[g]=e}else{if(k!==0){if(!(a0>=0&&a0<r))return A.a(b9,a0)
j=A.u(k,b9[a0])
b9.$flags&2&&A.d(b9)
b9[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
i=A.u(i,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
g=A.u(g,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
e=A.u(e,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=e}}m+=4
continue}a1=d>>>24
if(k!==0&&a1!==0){a2=a1===255?k:A.U(k,a1)
if(!(a0>=0&&a0<r))return A.a(b9,a0)
j=A.u(a2,b9[a0])
b9.$flags&2&&A.d(b9)
b9[a0]=j}a3=c>>>24
if(i!==0&&a3!==0){a2=a3===255?i:A.U(i,a3)
j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.u(a2,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=h}a4=b>>>24
if(g!==0&&a4!==0){a2=a4===255?g:A.U(g,a4)
j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.u(a2,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=h}a5=a>>>24
if(e!==0&&a5!==0){a2=a5===255?e:A.U(e,a5)
j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.u(a2,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=h}m+=4}while(m<c5){j=o+m
if(!(j>=0&&j<b8))return A.a(c3,j)
a6=c3[j]
if(a6!==0){if(!(j<s))return A.a(c4,j)
a7=c4[j]>>>24
if(a7!==0){a2=a7===255?a6:A.U(a6,a7)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(b9,a8)
j=A.u(a2,b9[a8])
b9.$flags&2&&A.d(b9)
b9[a8]=j}}++m}}return}for(b8=c3.length,s=c4.length,r=b9.length,q=c5-3,p=0;p<c6;++p){o=p*c5
n=(c8+p-c1)*c2+b7
for(m=0;m<q;){l=o+m
if(!(l>=0&&l<b8))return A.a(c3,l)
k=c3[l]
j=l+1
if(!(j<b8))return A.a(c3,j)
i=c3[j]
h=l+2
if(!(h<b8))return A.a(c3,h)
g=c3[h]
f=l+3
if(!(f<b8))return A.a(c3,f)
e=c3[f]
if((k|i|g|e)>>>0===0){m+=4
continue}if(!(l<s))return A.a(c4,l)
d=c4[l]
if(!(j<s))return A.a(c4,j)
c=c4[j]
if(!(h<s))return A.a(c4,h)
b=c4[h]
if(!(f<s))return A.a(c4,f)
a=c4[f]
if((d&c&b&a)>>>0>=4278190080){m+=4
continue}a0=n+m
if(((d|c|b|a)&4278190080)>>>0===0){if((k&i&g&e)>>>0>=4278190080){b9.$flags&2&&A.d(b9)
if(!(a0>=0&&a0<r))return A.a(b9,a0)
b9[a0]=k
j=a0+1
if(!(j<r))return A.a(b9,j)
b9[j]=i
i=a0+2
if(!(i<r))return A.a(b9,i)
b9[i]=g
g=a0+3
if(!(g<r))return A.a(b9,g)
b9[g]=e}else{if(k!==0){if(!(a0>=0&&a0<r))return A.a(b9,a0)
j=A.u(k,b9[a0])
b9.$flags&2&&A.d(b9)
b9[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
i=A.u(i,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
g=A.u(g,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
e=A.u(e,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=e}}m+=4
continue}a9=255-(d>>>24)
if(k!==0&&a9!==0){a2=a9===255?k:A.U(k,a9)
if(!(a0>=0&&a0<r))return A.a(b9,a0)
j=A.u(a2,b9[a0])
b9.$flags&2&&A.d(b9)
b9[a0]=j}b0=255-(c>>>24)
if(i!==0&&b0!==0){a2=b0===255?i:A.U(i,b0)
j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.u(a2,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=h}b1=255-(b>>>24)
if(g!==0&&b1!==0){a2=b1===255?g:A.U(g,b1)
j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.u(a2,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=h}b2=255-(a>>>24)
if(e!==0&&b2!==0){a2=b2===255?e:A.U(e,b2)
j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.u(a2,b9[j])
b9.$flags&2&&A.d(b9)
b9[j]=h}m+=4}while(m<c5){j=o+m
if(!(j>=0&&j<b8))return A.a(c3,j)
a6=c3[j]
if(a6!==0){if(!(j<s))return A.a(c4,j)
b3=255-(c4[j]>>>24)
if(b3!==0){a2=b3===255?a6:A.U(a6,b3)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(b9,a8)
j=A.u(a2,b9[a8])
b9.$flags&2&&A.d(b9)
b9[a8]=j}}++m}}return}for(s=b9.length,r=d1===0,j=c4.length,h=c3.length,p=0;p<c6;++p){o=p*c5
n=(c8+p-c1)*c2+b7
for(m=0;m<c5;++m){f=o+m
if(!(f>=0&&f<h))return A.a(c3,f)
a6=c3[f]
if(a6===0)continue
if(!(f<j))return A.a(c4,f)
b4=c4[f]
if(b8){a7=b4>>>24
b3=c9?255-a7:a7}else{b5=19595*(b4>>>16&255)+38470*(b4>>>8&255)+7471*(b4&255)+32768>>>16
b6=b5>255?255:b5
b3=c9?255-b6:b6}if(b3===0)continue
a2=b3===255?a6:A.U(a6,b3)
a8=n+m
if(r){if(!(a8>=0&&a8<s))return A.a(b9,a8)
f=A.u(a2,b9[a8])}else{if(!(a8>=0&&a8<s))return A.a(b9,a8)
f=A.eb(a2,b9[a8],d1)}b9.$flags&2&&A.d(b9)
if(!(a8>=0&&a8<s))return A.a(b9,a8)
b9[a8]=f}}},
eM(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eK(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eN(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eL(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eI(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaB()){i.$flags&2&&A.d(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gcq()){a.cZ(b)
s=a.z
r=a.Q
i.$flags&2&&A.d(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.e9(b)
p=q[0]
o=q[1]
n=q[4]
m=q[5]
l=q[12]
k=q[13]
i.$flags&2&&A.d(i)
i[0]=c*p+e*o
i[1]=d*p+f*o
i[2]=c*n+e*m
i[3]=d*n+f*m
i[4]=c*l+e*k+g
i[5]=d*l+f*k+h},
c2(i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0=null
if(!i1.ej(i2))return
s=k2?i4:i0
r=k7?255:i1.ht(i2,i3)
q=k4?i1.aT(i2):255
if(r===0||q===0)return
if(!k7)p=k6&&r===255&&q===255
else p=!0
o=p?i0:i1.as
if(o!=null){n=i1.aw(i2)
if(n==null)return
m=B.c.P(A.eM(n,j2,j4,j6))-1
l=B.c.P(A.eN(n,j3,j5,j7))-1
k=B.c.W(A.eK(n,j2,j4,j6))+1
j=B.c.W(A.eL(n,j3,j5,j7))+1
i=Math.max(m,i8)
h=Math.max(l,i9)
g=Math.min(k,j0)
f=Math.min(j,j1)
if(i>=g||h>=f)return
p=o.a
e=o.b
d=B.c.H((j2*p+j4*e)*256)
c=B.c.H((j3*p+j5*e)*256)
e=-d
b=B.a.aK(B.a.K(e,8),32)
p=-c
a=B.a.aK(B.a.K(p,8),32)
a0=e&255
a1=p&255
a2=Math.max(0,Math.max(m,Math.min(i,i+b)))
a3=Math.max(0,Math.max(l,Math.min(h,h+a)))
p=a0===0?0:1
a4=Math.min(65535,Math.min(k,Math.max(g,g+b+p)))
p=a1===0?0:1
a5=Math.min(65535,Math.min(j,Math.max(f,f+a+p)))
a6=k5&&a2===i&&a3===h&&a4===g&&a5===f
a7=a4-a2
a8=a5-a3
a9=a6?i4:j9.aL(k0*3+2,a7*a8)
b0=a6?i5:a2
b1=a6?i6:a3
b2=a6?i7:a7
if(!a6){p=a7*a8
if(j9.b)A.cz(a9,p)
else A.ci(a9.gv(),p)}p=a6?k0:k0+1
A.c2(i1,i2,255,a9,b0,b1,b2,a2,a3,a4,a5,j2,j3,j4,j5,j6,j7,j8,j9,p,k1,a6?k2:j9.b,0,!1,!1,!1,!0,!0)
b3=A.a2(r*q)
if(!k6)b4=d===0&&c===0
else b4=!0
p=!1
if(!b4)if(k3===0)if(s!=null)if(b2===a7)if(b0===a2)if(b1===a3)p=(!a6||b3===255)&&A.oQ(s,(h-i6)*i7+i-i5,i7,a9,a7,a8,i-a2,h-a3,g-i,f-h,b,a,a0,a1,(255-o.aP(16)<<16|255-o.aP(8)<<8|255-o.aP(0))>>>0,b3)
if(p)return
A.nD(o,b3,k3,a9.gv(),b0,b1,b2,new A.b3([a2,a3,a4,a5]),i4.gv(),i5,i6,i7,new A.b3([i,h,g,f]),b,a,a0,a1,a6,b4)
return}b5=k8?i1.at:i0
b6=b5==null?i0:b5.fX(i2)
b7=k6&&b6!=null&&b6>>>24===255?i0:b6
if(q!==255||b7!=null){p=b7==null
b3=p?q:A.a2((b7>>>24)*q)
if(b3===0)return
n=i1.aw(i2)
if(n==null)return
i=Math.max(i8,B.c.P(A.eM(n,j2,j4,j6))-1)
h=Math.max(i9,B.c.P(A.eN(n,j3,j5,j7))-1)
g=Math.min(j0,B.c.W(A.eK(n,j2,j4,j6))+1)
f=Math.min(j1,B.c.W(A.eL(n,j3,j5,j7))+1)
a7=g-i
a8=f-h
if(a7<=0||a8<=0)return
e=a7*a8
a9=j9.aL(k0*3+2,e)
if(k2)A.cz(a9,e)
else A.ci(a9.gv(),e)
A.c2(i1,i2,i3,a9,i,h,a7,i,h,g,f,j2,j3,j4,j5,j6,j7,j8,j9,k0+1,k1,k2,0,!1,!1,k6,!1,!1)
b8=a9.gv()
b9=i4.gv()
c0=(h-i6)*i7+i-i5
for(e=b9.length,c1=k3===0,c2=b8.length,c3=b9.$flags|0,c4=0;c4<a8;++c4,c0+=i7)for(c5=c4*a7,c6=0;c6<a7;++c6){c7=c5+c6
if(!(c7>=0&&c7<c2))return A.a(b8,c7)
c8=b8[c7]
if(c8===0)continue
if(p)c9=A.U(c8,b3)
else{d0=(c8>>>24)*b3+128
c9=A.U((b7&16777215|4278190080)>>>0,B.a.K(d0+B.a.K(d0,8),8))}d1=c0+c6
if(c1){if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.u(c9,b9[d1])}else{if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.eb(c9,b9[d1],k3)}c3&2&&A.d(b9)
if(!(d1>=0&&d1<e))return A.a(b9,d1)
b9[d1]=c7}return}if(i1.ge5()){for(c8=i1,d2=0;c8!=null;c8=c8.cy)++d2
if(d2===1){d3=j9.c3(k0)
A.eI(i1.a,i2,j2,j3,j4,j5,j6,j7,d3)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}else{e0=j9.k3
while(e0.length<d2)B.b.m(e0,i0)
e1=d2-1
for(c8=i1;c8!=null;c8=c8.cy,e1=e2){e2=e1-1
B.b.q(e0,e1,c8)}d3=j9.c3(k0)
for(d9=j7,d8=j6,d7=j5,d6=j4,d5=j3,d4=j2,d1=0;d1<d2;++d1){if(!(d1<e0.length))return A.a(e0,d1)
A.eI(e0[d1].a,i2,d4,d5,d6,d7,d8,d9,d3)
B.b.q(e0,d1,i0)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}}}else{d9=j7
d8=j6
d7=j5
d6=j4
d5=j3
d4=j2}e3=k1&&i1.ge7()
e4=i1.z
if(e4!=null&&i1.ghk()){e5=e3&&i1.ghn()?new A.cp([d4,d5,d6,d7,d8,d9,i8,i9,j0,j1]):i0
p=e5==null
e6=p?i0:j9.dn(i1,e5)
if(e6==null){e7=j9.cL(k0)
e7.l(0)
A.ob(e4,i2,d4,d5,d6,d7,d8,d9,i8,i9,j0,j1,e7,j9,k0)
if(!p)j9.c_(i1,e5,e7)}else if(j8==null&&e6.b!==0){e7=j9.cL(k0)
e7.dZ(e6)}else e7=e6
if(e7.b===0)return
if(j8!=null){e8=j9.eC(k0)
A.fv(e7,j8,e8)
if(e8.b===0)return
e9=e8}else e9=e7
f0=Math.max(i8,e9.c)
f1=Math.max(i9,e9.d)
f2=Math.min(j0,e9.e)
f3=Math.min(j1,e9.f)
if(f0>=f2||f1>=f3)return}else{f3=j1
f2=j0
f1=i9
f0=i8
e9=j8}f4=i1.b
if(f4!=null)A.la(f4,i2,r,i4,i5,i6,i7,f0,f1,f2,f3,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2,k3)
f5=i1.f
if(f5!=null){p=i1.x
if(p!=null){p=p.n(i2)
if(0>=p.length)return A.a(p,0)
p=p[0]
e=f5.f
e===$&&A.D()
c1=f5.d
c1===$&&A.D()
f6=p*e-c1}else f6=(i2-i1.r)/i1.w
p=f5.b
p===$&&A.D()
e=f5.c
e===$&&A.D()
if(Math.abs(d5)<1e-9&&Math.abs(d6)<1e-9){c1=d4>=0
i=B.c.P(d8+(c1?0:d4*p))
g=B.c.W(d8+(c1?d4*p:0))
p=d7>=0
h=B.c.P(d9+(p?0:d7*e))
f=B.c.W(d9+(p?d7*e:0))
f7=Math.max(f0,i)
f8=Math.max(f1,h)
f9=Math.min(f2,g)
g0=Math.min(f3,f)
if(f7<f9&&f8<g0)A.jE(f5,f6,r,i4,i5,i6,i7,f7,f8,f9,g0,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2)}else{g1=f5.gdU()
g2=Math.max(f0,B.c.P(A.eM(g1,d4,d6,d8))-1)
g3=Math.max(f1,B.c.P(A.eN(g1,d5,d7,d9))-1)
g4=Math.min(f2,B.c.W(A.eK(g1,d4,d6,d8))+1)
g5=Math.min(f3,B.c.W(A.eL(g1,d5,d7,d9))+1)
if(g2<g4&&g3<g5){g6=g4-g2
c1=g6*(g5-g3)
g7=j9.aL(k0*3+2,c1)
if(k2)A.cz(g7,c1)
else A.ci(g7.gv(),c1)
A.jE(f5,f6,r,g7,g2,g3,g6,g2,g3,g4,g5,d4,d5,d6,d7,d8,d9,i0,j9,k0+1,e3,k2)
c1=j9.db
c1.l(0)
c1.a4(!0)
c1.p(d8,d9)
c2=d4*p
p=d5*p
c1.p(c2+d8,p+d9)
c3=d6*e
e=d7*e
c1.p(c2+c3+d8,p+e+d9)
c1.p(c3+d8,e+d9)
c1.a2()
j9.aN(c1,!1,j9.gbN(),g2,g3,g4,g5)
g8=j9.gbN()
if(e9!=null){A.fv(j9.gbN(),e9,j9.gbp())
g8=j9.gbp()}g9=g8.b*2
h0=g8.a.gv()
h1=g7.gv()
b9=i4.gv()
for(p=h1.length,e=b9.length,c1=h0.length,c2=b9.$flags|0,e1=0;e1<g9;e1+=2){if(!(e1<c1))return A.a(h0,e1)
h2=h0[e1]
c3=e1+1
if(!(c3<c1))return A.a(h0,c3)
h3=h0[c3]
c4=h2>>>16
c6=h2&65535
h4=h3>>>8
h5=(h3&255)+1
h6=(c4-g3)*g6+(c6-g2)
h7=(c4-i6)*i7+(c6-i5)
for(c3=h5===256,h8=0;h8<h4;++h8){c5=h6+h8
if(!(c5>=0&&c5<p))return A.a(h1,c5)
c8=h1[c5]
if(c8!==0){h9=c3?c8:A.at(c8,h5)
c5=h7+h8
if(!(c5>=0&&c5<e))return A.a(b9,c5)
c7=A.u(h9,b9[c5])
c2&2&&A.d(b9)
b9[c5]=c7}}}}}}},
nD(c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=d1.a,c0=b9[0],c1=b9[1],c2=b9[2],c3=b9[3]
b9=d6.a
s=b9[0]
r=b9[1]
q=b9[2]
p=b9[3]
o=255-c4.aP(16)
n=255-c4.aP(8)
m=255-c4.aP(0)
for(b9=d2.length,l=c6===0,k=c5!==255,j=!e2,i=c7.length,h=256-d9,g=256-e0,f=r;f<p;++f){e=f+d8
d=e+1
c=e>=c1&&e<c3?(e-c9)*d0-c8:null
b=d>=c1&&d<c3?(d-c9)*d0-c8:null
a=(f-c9)*d0-c8
a0=(f-d4)*d5-d3
for(a1=b!=null,a2=c!=null,a3=s;a3<q;++a3){a4=a+a3
if(!(a4>=0&&a4<i))return A.a(c7,a4)
a5=c7[a4]
if(a5===0)continue
if(j){a6=a3+d7
a7=a6+1
a8=a6>=c0&&a6<c2
a9=a7>=c0&&a7<c2
if(a2&&a8){a4=c+a6
if(!(a4>=0&&a4<i))return A.a(c7,a4)
b0=c7[a4]>>>24}else b0=0
if(a2&&a9){a4=c+a7
if(!(a4>=0&&a4<i))return A.a(c7,a4)
b1=c7[a4]>>>24}else b1=0
if(a1&&a8){a4=b+a6
if(!(a4>=0&&a4<i))return A.a(c7,a4)
b2=c7[a4]>>>24}else b2=0
if(a1&&a9){a4=b+a7
if(!(a4>=0&&a4<i))return A.a(c7,a4)
b3=c7[a4]>>>24}else b3=0
b4=255-((b0&b1&b2&b3)>>>0===255?255:(b0*h+b1*d9)*g+(b2*h+b3*d9)*e0+32768>>>16)
if(b4!==0){a4=A.a2(o*b4)
if(typeof a4!=="number")return A.ad(a4)
a4=A.a2((a5>>>16&255)*(255-a4))
if(typeof a4!=="number")return a4.a9()
b5=A.a2(n*b4)
if(typeof b5!=="number")return A.ad(b5)
b5=A.a2((a5>>>8&255)*(255-b5))
if(typeof b5!=="number")return b5.a9()
b6=A.a2(m*b4)
if(typeof b6!=="number")return A.ad(b6)
b6=A.a2((a5&255)*(255-b6))
if(typeof b6!=="number")return A.ad(b6)
a5=(a5&4278190080|a4<<16|b5<<8|b6)>>>0}}b7=a0+a3
if(e1){d2.$flags&2&&A.d(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a5}else{if(k)a5=A.U(a5,c5)
if(l){if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.u(a5,d2[b7])}else{if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.eb(a5,d2[b7],c6)}d2.$flags&2&&A.d(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a4}}}if(e1&&k)for(f=r;f<p;++f){b8=(f-d4)*d5-d3
for(a3=s;a3<q;++a3){l=b8+a3
if(!(l>=0&&l<b9))return A.a(d2,l)
k=A.U(d2[l],c5)
d2.$flags&2&&A.d(d2)
d2[l]=k}}},
ob(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.eE(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.F(0.25/e,0.005,1.5),c=new A.im(b1.eD(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.b.gaf(a).gcc())c.$2(B.b.gaf(a),b0)
else{s=b1.ao(0)
r=b1.ao(1)
q=b1.ao(2)
for(p=a.length,o=a8-a6,n=!1,m=0;m<a.length;a.length===p||(0,A.Z)(a),++m){l=a[m]
k=l.b
if(k==="n")continue
switch(k){case"s":k=3
break
case"i":k=4
break
case"f":k=5
break
default:k=2
break}c.$2(l,s)
j=l.c.n(b)
if(0>=j.length)return A.a(j,0)
i=B.a.F(B.c.H(j[0]*2.56),0,256)
if(i!==256)s.ep(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aO(g,a6,o,256)
if(j){s.aV(r)
A.cZ(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aV(s)
else if(j)A.cZ(q,s,b0,k)
else{b0.aV(r)
A.cZ(r,s,b0,k)}n=!0}}},
nK(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.d(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.kY(a,Math.abs(b),2,2,4,c,d,e)},
la(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gcn())s=c
else{r=f.e.n(b)
if(0>=r.length)return A.a(r,0)
s=B.a.F(B.c.H(c*B.c.H(r[0])/100),0,255)}if(s===0)return
if(!f.gaB()){q=b3.c3(b4)
A.eI(f,b,a6,a7,a8,a9,b0,b1,q)
p=q[0]
o=q[1]
n=q[2]
m=q[3]
l=q[4]
k=q[5]}else{k=b1
l=b0
m=a9
n=a8
o=a7
p=a6}j=b5&&f.gaR()
i=a.gb8()
for(h=i.length-1,r=b4+1;h>=0;--h){if(!(h<i.length))return A.a(i,h)
g=i[h]
if(g instanceof A.a6)A.la(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.bk)A.oe(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
oe(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.n(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.a.F(B.c.H(c0*B.c.H(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gc4())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gI()
b7=b7!==!1
r=b7}b8.id!==$&&A.S()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.cp([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.dn(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.b.aq(b8.a,A.jR())
b8.fx!==$&&A.S()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.b2(b9)
if(l==null)return
n=[Math.max(c5,B.c.P(A.eM(l,c9,d1,d3))-2),Math.max(c6,B.c.P(A.eN(l,d0,d2,d4))-2),Math.min(c7,B.c.W(A.eK(l,c9,d1,d3))+2),Math.min(c8,B.c.W(A.eL(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gb_()
m=b8.a
A.il(m,0,m.length,b9,new A.bB([c9,d0,d1,d2,d3,d4]),new A.b3(n),b8.f,o,d6,0)}else{l=A.oa(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
f=d5==null&&b8.y==null&&d9===0
if(f&&d8){e=A.jJ(b8,b9,s)
if(d6.fz(d6.dy,g,d6.gb_(),k,j,i,h,c1,c2,c3,c4,e)){o=d6.gb_()
if(!b7&&o.b>0)d6.c_(b8,p,o)
return}}else if(f&&!d8&&b7){e=A.jJ(b8,b9,s)
n=c1.gv()
m=d6.ch
if(m==null)m=d6.ch=A.kc(256)
if(m.hB(d6.dy,g,k,j,i,h,n,c2,c3,c4,e))return}d6.aN(d6.dy,g,d6.gb_(),k,j,i,h)
o=d6.gb_()}if(!b7&&o.b>0)d6.c_(b8,p,o)}if(d5!=null){A.fv(o,d5,d6.gbp())
o=d6.gbp()}if(o.b===0)return
d=d8?c1:b6
c=b8.y
if(c==null){e=A.jJ(b8,b9,s)
if(d9===0)A.kw(c1.gv(),c2,c3,c4,o,e,d)
else A.mN(c1.gv(),c2,c3,c4,o,e,d9,d)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.nI(c,b9,d6)
a7=c.d.n(b9)
a8=c.e.n(b9)
if(c.ghm()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=c.hh(b9,a9,b0)
if(b1!=null){A.nL(c1.gv(),c2,c3,c4,o,a6.gv(),s,new A.bB([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
return}}b7=!1
if(d!=null){n=$.k
if(n!=null){b7=o.a
n=o.b
m=c.w
b2=a7.length
if(0>=b2)return A.a(a7,0)
b3=a7[0]
if(1>=b2)return A.a(a7,1)
b2=a7[1]
b4=a8.length
if(0>=b4)return A.a(a8,0)
b5=a8[0]
if(1>=b4)return A.a(a8,1)
b5=A.oP(d,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
b7=b5}}if(b7)return
b7=a7.length
n=a8.length
if(c.w){m=c1.gv()
b2=a6.gv()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.mQ(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gv()
b2=a6.gv()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.mP(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
nL(b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=c0.a,a1=a0[0],a2=a0[1],a3=a0[2],a4=a0[3],a5=a0[4],a6=a0[5],a7=c4.a,a8=c4.b,a9=1-a7*a7-a8*a8,b0=a1/c3,b1=a2/c3,b2=b7.a.gv()
for(a0=b3.length,s=b9!==255,r=b8.length,q=b2.length,p=0;p<b7.b*2;p+=2){if(!(p<q))return A.a(b2,p)
o=b2[p]
n=p+1
if(!(n<q))return A.a(b2,n)
m=b2[n]
l=o&65535
k=o>>>16
j=(m&255)+1
n=l+0.5
i=k+0.5
h=(a1*n+a3*i+a5-c1)/c3-a7
g=(a2*n+a4*i+a6-c2)/c3-a8
f=(k-b5)*b6+l-b4
e=f+(m>>>8)
for(n=j!==256,d=f;d<e;++d,h+=b0,g+=b1){c=h*a7+g*a8
b=(c+Math.sqrt(c*c+a9*(h*h+g*g)))/a9
i=b>=1?1023:B.c.M(b*1023+0.5)
if(!(i>=0&&i<r))return A.a(b8,i)
a=b8[i]
if(s)a=A.U(a,b9)
if(n)a=A.at(a,j)
if(!(d>=0&&d<a0))return A.a(b3,d)
i=A.u(a,b3[d])
b3.$flags&2&&A.d(b3)
b3[d]=i}}},
dw(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aR){s=a.c
if(s===$){r=a.b!==1||B.b.aq(a.a,A.jR())
a.c!==$&&A.S()
a.c=r
s=r}q=s
break A}if(a instanceof A.a6){s=a.r
if(s===$){r=B.b.aq(a.a,A.jR())
a.r!==$&&A.S()
a.r=r
s=r}q=s
break A}if(a instanceof A.X){q=A.dw(a.a)
break A}q=!1
break A}return q},
il(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.dw(a[b])}else s=!1
if(s){if(!(b<a.length))return A.a(a,b)
A.eJ(a[b],d,e,a0,a1,a2,a3,a4)
return}s=e.a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
n=s[4]
m=s[5]
l=a3.dy
l.l(0)
for(k=b;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dw(j))A.bE(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.l(0)
else{s=a0.a
a3.aN(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dw(j))continue
if(a2.b===0)A.eJ(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.ao(i)
A.eJ(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.ao(h)
f.aV(a2)
A.cZ(f,g,a2,a1?5:2)}}},
eJ(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
A:{s=a0 instanceof A.a6
r=s?a0:null
if(s){s=a2.a
q=s[0]
p=s[1]
o=s[2]
n=s[3]
m=s[4]
l=s[5]
s=r.c
if(!s.gaB()){k=a6.d2(a7)
A.eI(s,a1,q,p,o,n,m,l,k)
a2=new A.bB([k[0],k[1],k[2],k[3],k[4],k[5]])}s=r.a
A.il(s,0,s.length,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.X
j=s?a0:null
if(s){A.eJ(j.a,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.aR
i=s?a0:null
if(s){h=i.a
s=i.b
if(s===1){A.il(h,0,h.length,a1,a2,a3,a4,a5,a6,a7+1)
return}g=a7*2
f=a6.ao(g)
e=a6.ao(g+1)
d=a7+1
A.il(h,0,h.length-1,a1,a2,a3,!1,f,a6,d)
if(f.b===0)c=s===3||s===4
else c=!1
if(c){a5.l(0)
return}b=B.b.gad(h)
if(A.dw(b))A.eJ(b,a1,a2,a3,!1,e,a6,d)
else{d=a2.a
q=d[0]
p=d[1]
o=d[2]
n=d[3]
m=d[4]
l=d[5]
a=a6.dy
a.l(0)
A.bE(b,a1,q,p,o,n,m,l,0.0625,a,a6,0,0)
d=a3.a
a6.aN(a,!1,e,d[0],d[1],d[2],d[3])}A.cZ(f,e,a5,s)
break A}throw A.f(A.as("Expected a boolean path"))}},
oa(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8=a9.e
if(a8){s=a9.d.n(b0)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a7}else r=0
q=a9.b2(b0)
if(q==null)return a7
s=B.c.P(A.eM(q,b5,b7,b9))
p=B.c.P(A.eN(q,b6,b8,c0))
o=B.c.W(A.eK(q,b5,b7,b9))
n=B.c.W(A.eL(q,b6,b8,c0))
m=Math.max(b1,s-2)
l=Math.max(b2,p-2)
k=Math.min(b3,o+2)
j=Math.min(b4,n+2)
if(m>=k||l>=j)return a7
i=a9.go
if(i===$){h=a9.fI()
a9.go!==$&&A.S()
a9.go=h
i=h}if(i!=null){g=c1.dv(i,b0)
if(g.r===0)return a7
a8=c1.dy
a8.l(0)
a8.aF(g,b5,b6,b7,b8,b9,c0)
return new A.b3([m,l,k,j])}if(!a8&&a9.z==null&&a9.a.length===1){f=B.b.gaf(a9.a)
while(f instanceof A.X)f=f.a
if(f instanceof A.aB&&!f.gI()){e=c1.dy
e.l(0)
A.l1(f,b0,0.0625,e,new A.bB([b5,b6,b7,b8,b9,c0]));++c1.w
return e.r===0?a7:new A.b3([m,l,k,j])}}d=Math.max(Math.sqrt(b5*b5+b6*b6),Math.sqrt(b7*b7+b8*b8))
c=d<=0.000001?0.25:B.c.F(0.25/d,0.005,1.5)
b=c*c
a=c1.db
a.l(0)
a0=a9.a
for(a1=a0.length-1;a1>=0;--a1){if(!(a1<a0.length))return A.a(a0,a1)
A.bE(a0[a1],b0,1,0,0,1,0,0,b,a,c1,0,0)}if(a.r===0)return a7
a2=a9.z
if(a2!=null){a3=c1.dx
a3.l(0)
A.ns(a,a2,b0,a3,c1.p3)
if(a3.r===0)return a7
a4=a3}else a4=a
if(a8){a5=c1.fr
a5.l(0)
A.kY(a4,r*0.5,a9.r,a9.w,a9.x,c,a5,c1.gdw())
if(a5.r===0)return a7
a4=a5}a6=c1.dy
a6.l(0)
a6.aF(a4,b5,b6,b7,b8,b9,c0)
return new A.b3([m,l,k,j])},
jJ(a,b,c){var s,r,q=a.b.n(b),p=q.length
if(0>=p)return A.a(q,0)
s=B.a.F(B.c.H(q[0]*255),0,255)
if(1>=p)return A.a(q,1)
r=B.a.F(B.c.H(q[1]*255),0,255)
if(2>=p)return A.a(q,2)
return A.kx(c,s,r,B.a.F(B.c.H(q[2]*255),0,255))},
nI(a,b,c){var s,r,q,p
if(a.c.a!=null){s=c.cl
r=s.h(0,a)
if(r!=null)return r.b
if(s.a>=256)s.A(0,new A.P(s,s.$ti.i("P<1>")).ga5(0)).b.a1()
q=A.fk(1024)
p=c.ay
p.toString
s.q(0,a,new A.ac(p,q,t.dL))
A.l0(a,b,q.gv())
return q}q=c.aQ
if(q==null)q=c.aQ=A.fk(1024)
A.l0(a,b,q.gv())
return q},
l0(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a6.c.n(a7),a4=a6.a,a5=a6.x
for(s=a3.length,r=0;r<a4;++r){q=4*r
p=3*r
o=q+1
if(!(o<s))return A.a(a3,o)
o=A.fH(a3[o])
a5.$flags&2&&A.d(a5)
n=a5.length
if(!(p<n))return A.a(a5,p)
a5[p]=o
o=p+1
m=q+2
if(!(m<s))return A.a(a3,m)
m=A.fH(a3[m])
a5.$flags&2&&A.d(a5)
if(!(o<n))return A.a(a5,o)
a5[o]=m
m=p+2
o=q+3
if(!(o<s))return A.a(a3,o)
o=A.fH(a3[o])
a5.$flags&2&&A.d(a5)
if(!(m<n))return A.a(a5,m)
a5[m]=o}for(o=a5.length,n=a4-1,l=0,k=0;k<1024;++k){j=k/1023
for(;;){if(l<n){m=(l+1)*4
if(!(m<s))return A.a(a3,m)
m=a3[m]<=j}else m=!1
if(!m)break;++l}m=l*4
if(!(m<s))return A.a(a3,m)
i=Math.max(0,l-(j<a3[m]?1:0))
h=Math.min(n,i+1)
g=i*4
if(!(g>=0&&g<s))return A.a(a3,g)
f=a3[g]
g=h*4
if(!(g>=0&&g<s))return A.a(a3,g)
e=a3[g]-f
d=e<=1e-12?0:B.c.F((j-f)/e,0,1)
c=i*3
b=h*3
if(!(c>=0&&c<o))return A.a(a5,c)
m=a5[c]
if(!(b>=0&&b<o))return A.a(a5,b)
g=a5[b]
a=c+1
if(!(a<o))return A.a(a5,a)
a=a5[a]
a0=b+1
if(!(a0<o))return A.a(a5,a0)
a0=a5[a0]
a1=c+2
if(!(a1<o))return A.a(a5,a1)
a1=a5[a1]
a2=b+2
if(!(a2<o))return A.a(a5,a2)
a2=a5[a2]
a1=A.kx(B.a.F(B.c.H(a6.eM(a3,j)*255),0,255),B.a.F(B.c.H((m+(g-m)*d)*255),0,255),B.a.F(B.c.H((a+(a0-a)*d)*255),0,255),B.a.F(B.c.H((a1+(a2-a1)*d)*255),0,255))
a8.$flags&2&&A.d(a8)
if(!(k<a8.length))return A.a(a8,k)
a8[k]=a1}},
js(a){return new A.bz(a,A.h([],t.ch))},
kD(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.a.J(b.gcv()-s,2)),q=new Float32Array(a*3)
s=Math.max(2,a+Math.max(0,B.a.J(b.gcv()-s,2)))
new Float64Array(s)
return new A.bh(a,r,b,c,d,f,g,e,q)},
nd(a,b,c,d,e){return new A.bC(a,b,c,d,e,A.a5(t.S,t.W))},
kB(a,b){var s=a.length
return new A.cn(a,b,new Float64Array(s))},
c4(a,b){var s,r,q,p,o
if(a==null)return b
if(b==null)return a
s=a.a
r=b.a
s=s<r?s:r
r=a.b
q=b.b
r=r<q?r:q
q=a.c
p=b.c
q=q>p?q:p
p=a.d
o=b.d
return new A.az(s,r,q,p>o?p:o)},
jx(a,b,c,d,e,f,g,h,i){return new A.c1(a,b,c,d,e,f,g,h,i)},
jy(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
eC(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
n1(a,b,c,d,e){return new A.a8(a,b,c,d,e)},
kE(a,b,c){return new A.hL(a,b,c)},
kF(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.a7(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
ju(a,b,c){return new A.a6(a,b,c)},
n2(a,b){return new A.aR(a,b)},
ik(a,b,c){if(c>0)return new A.x(a,-b)
if(c<0)return new A.x(-a,b)
return B.aE},
jw(a,b,c,d,e,f,g,h,i,j,k){return new A.bk(a,b,c,d,e,f,g,h,i,k,j)},
ij:function ij(a,b){this.a=a
this.b=b},
i_:function i_(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=null},
cg:function cg(a){this.a=a},
fq:function fq(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var _=this
_.b=a
_.y=_.x=_.w=_.r=_.f=0
_.z=null
_.as=_.Q=!1
_.at=b
_.ax=0
_.cy=_.cx=_.CW=_.ch=_.ay=null
_.db=c
_.dx=d
_.dy=e
_.fr=f
_.fx=g
_.fy=h
_.go=i
_.id=j
_.k1=k
_.k2=l
_.k3=m
_.k4=n
_.ok=o
_.p1=p
_.p2=q
_.p3=r
_.p4=s
_.R8=null
_.RG=a0
_.rx=a1
_.ry=a2
_.to=a3
_.x1=a4
_.x2=a5
_.y1=_.xr=0
_.y2=a6
_.bw=a7
_.cl=a8
_.aQ=null
_.e1=a9},
fr:function fr(a,b){this.a=a
this.b=b},
fs:function fs(a){this.a=a},
ft:function ft(a){this.a=a},
fu:function fu(a){this.a=a},
ac:function ac(a,b,c){this.a=a
this.b=b
this.$ti=c},
bU:function bU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
im:function im(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p},
c:function c(a,b){this.a=a
this.b=b},
bz:function bz(a,b){var _=this
_.a=a
_.r=_.f=_.e=_.d=_.c=_.b=$
_.w=b
_.x=1
_.y=!1
_.z=$
_.Q=null},
h6:function h6(a){this.a=a},
fX:function fX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fY:function fY(a,b,c){this.a=a
this.b=b
this.c=c},
fW:function fW(a){this.a=a},
h2:function h2(a,b,c){this.a=a
this.b=b
this.c=c},
h3:function h3(a,b,c){this.a=a
this.b=b
this.c=c},
h4:function h4(a,b,c){this.a=a
this.b=b
this.c=c},
h1:function h1(a){this.a=a},
h_:function h_(){},
h0:function h0(){},
fZ:function fZ(a,b){this.a=a
this.b=b},
h5:function h5(){},
hc:function hc(a,b){this.a=a
this.b=b},
hX:function hX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
er:function er(a){this.b=a},
hr:function hr(a){this.a=a},
hs:function hs(a,b){this.a=a
this.b=b},
hl:function hl(a,b){this.a=a
this.b=b},
hm:function hm(a,b){this.a=a
this.b=b},
hn:function hn(a,b){this.a=a
this.b=b},
ho:function ho(a,b){this.a=a
this.b=b},
hp:function hp(a,b){this.a=a
this.b=b},
hq:function hq(a,b){this.a=a
this.b=b},
hf:function hf(a,b){this.a=a
this.b=b},
hh:function hh(a,b){this.a=a
this.b=b},
hg:function hg(a,b){this.a=a
this.b=b},
ht:function ht(a,b){this.a=a
this.b=b},
he:function he(a,b){this.a=a
this.b=b},
hj:function hj(a,b){this.a=a
this.b=b},
hi:function hi(a,b){this.a=a
this.b=b},
hk:function hk(a,b){this.a=a
this.b=b},
bh:function bh(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
X:function X(a){this.a=a},
bl:function bl(a,b){this.a=a
this.b=b},
bC:function bC(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$
_.as=f},
i3:function i3(){},
cn:function cn(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
h7:function h7(){},
c1:function c1(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=null
_.Q=_.z=0
_.as=0/0
_.CW=_.ch=_.ay=_.ax=_.at=$},
a8:function a8(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$},
hL:function hL(a,b,c){this.a=a
this.b=b
this.c=c},
eq:function eq(a,b){this.a=a
this.b=b},
hd:function hd(){},
a7:function a7(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=null
_.ch=!1
_.cy=null
_.fy=_.fx=_.dy=_.dx=_.db=$
_.go=null
_.id=0/0},
hQ:function hQ(){},
hO:function hO(){},
hP:function hP(){},
hR:function hR(){},
a6:function a6(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.r=_.f=_.e=_.d=$
_.Q=_.z=null
_.at=_.as=0/0
_.ay=_.ax=$},
hH:function hH(){},
hJ:function hJ(){},
hK:function hK(){},
hI:function hI(){},
aR:function aR(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
hU:function hU(){},
hT:function hT(){},
et:function et(){},
aB:function aB(a,b,c){var _=this
_.e=a
_.f=b
_.r=c
_.c=null
_.d=0/0},
aT:function aT(a,b,c,d,e){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.c=null
_.d=0/0},
b1:function b1(a,b,c,d,e,f,g,h,i){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.y=f
_.z=g
_.Q=h
_.as=i
_.c=null
_.d=0/0},
bk:function bk(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.id=_.go=_.fy=_.fx=_.fr=$},
i0:function i0(){},
cW(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.al(s,r,q,p,new Uint8Array(a))},
bt:function bt(a){this.a=a},
al:function al(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
cZ(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
if(a9===4){A.fv(a6,a7,a8)
return}a8.l(0)
s=a6.a.gv()
r=a7.a.gv()
q=a6.b*2
p=a7.b*2
o=t.a
n=0
m=0
for(;;){l=n<q
if(!(l||m<p))break
if(l){if(!(n>=0&&n<s.length))return A.a(s,n)
k=s[n]}else k=0
j=m<p
if(j){if(!(m>=0&&m<r.length))return A.a(r,m)
i=r[m]}else i=0
h=l?k>>>16:a5
g=j?i>>>16:a5
f=Math.min(h,g)
e=h===f?k&65535:a5
d=g===f?i&65535:a5
c=Math.min(e,d)
while(c<65536){if(e<=c){l=n+1
if(!(l>=0&&l<s.length))return A.a(s,l)
b=s[l]
a=(b&255)+1
a0=e+(b>>>8)}else{a0=e
a=0}if(d<=c){l=m+1
if(!(l>=0&&l<r.length))return A.a(r,l)
b=r[l]
a1=(b&255)+1
a0=Math.min(a0,d+(b>>>8))}else{a0=Math.min(a0,d)
a1=0}a2=a*a1+128>>>8
switch(a9){case 2:l=a+a1-a2
break
case 3:l=a-a2
break
default:l=a+a1-2*a2
break}if(a8.aO(f,c,a0-c,l)){l=a6.a
j=l.b
if(j!=null){a3=o.a(A.v($.k.memory).buffer)
a4=l.a
s=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
s=l}l=a7.a
j=l.b
if(j!=null){a3=o.a(A.v($.k.memory).buffer)
a4=l.a
r=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
r=l}}l=a===0
if(!l){j=n+1
if(!(j>=0&&j<s.length))return A.a(s,j)
j=e+(s[j]>>>8)===a0}else j=!1
if(j){n+=2
j=n<q
if(j){if(!(n>=0&&n<s.length))return A.a(s,n)
b=s[n]}else b=0
e=j&&b>>>16===f?b&65535:a5}j=a1!==0
if(j){a3=m+1
if(!(a3>=0&&a3<r.length))return A.a(r,a3)
a3=d+(r[a3]>>>8)===a0}else a3=!1
if(a3){m+=2
a3=m<p
if(a3){if(!(m>=0&&m<r.length))return A.a(r,m)
b=r[m]}else b=0
d=a3&&b>>>16===f?b&65535:a5}c=!l||j?a0:Math.min(e,d)
if(e===65536&&d===65536)break}}},
fv(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
a7.l(0)
s=a5.b
if(s===0||a6.b===0)return
if(!(a5.c<a6.e&&a6.c<a5.e&&a5.d<a6.f&&a6.d<a5.f))return
r=s*2
q=a6.b*2
p=a5.a.gv()
o=a6.a.gv()
s=t.a
n=0
m=0
for(;;){if(!(n<r&&m<q))break
A:{l=p.length
if(!(n<l))return A.a(p,n)
k=p[n]
j=o.length
if(!(m<j))return A.a(o,m)
i=o[m]
h=k>>>16
g=i>>>16
if(h<g){n+=2
break A}if(g<h){m+=2
break A}f=k&65535
e=i&65535
d=n+1
if(!(d<l))return A.a(p,d)
c=p[d]
d=m+1
if(!(d<j))return A.a(o,d)
b=o[d]
a=f+(c>>>8)
a0=e+(b>>>8)
a1=f>e?f:e
a2=a<a0?a:a0
if(a2>a1){a3=((c&255)+1)*((b&255)+1)+128>>>8
if(a3>0&&a7.aO(h,a1,a2-a1,a3)){l=a5.a
j=l.b
if(j!=null){d=s.a(A.v($.k.memory).buffer)
a4=l.a
p=new Int32Array(d,j,a4)}else{l=l.c
l.toString
p=l}l=a6.a
j=l.b
if(j!=null){d=s.a(A.v($.k.memory).buffer)
a4=l.a
o=new Int32Array(d,j,a4)}else{l=l.c
l.toString
o=l}}}if(a<=a0)n+=2
if(a0<=a)m+=2}}},
kc(a){var s=new Int32Array(8192),r=new Int32Array(8192),q=new Int32Array(8192),p=new Int32Array(8192),o=new Int32Array(0),n=Math.max(64,a),m=new Int32Array(n)
B.e.ac(m,0,n,-1)
return new A.eZ(n,m,s,r,q,p,o)},
cG(a){if(a>=-1048576&&a<=1048576)return B.c.H(a*256)
if(!isFinite(a))return 0
return a>0?268435456:-268435456},
j4(a,b){var s=B.a.aK(B.a.K(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
aG:function aG(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
eZ:function eZ(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=0
_.w=g
_.x=null
_.z=_.y=0
_.Q=!1
_.fr=_.dy=_.dx=_.db=_.cy=_.cx=_.CW=_.ch=_.ay=0
_.fx=-1
_.k3=_.k2=_.k1=_.id=_.go=_.fy=0
_.k4=!1},
ci(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.l.C(a,0,b,$.jV())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.l.C(a,s,q,$.jV())}},
kx(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.a.J(b*a+127,255)<<16|B.a.J(c*a+127,255)<<8|B.a.J(d*a+127,255))>>>0},
at(a,b){if(b>=256)return a
if(b<=0||a===0)return 0
return((a&16711935)*b+8388736>>>8&16711935|(a>>>8&16711935)*b+8388736&4278255360)>>>0},
u(a,b){var s,r,q,p
if(a===0)return b
s=a>>>24
if(s===255||b===0)return a
r=255-s
q=(b&16711935)*r+8388736
p=(b>>>8&16711935)*r+8388736
return a+((B.a.K(q+(B.a.K(q,8)&16711935),8)&16711935|p+(B.a.K(p,8)&16711935)&4278255360)>>>0)},
U(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.a.K(s+(B.a.K(s,8)&16711935),8)&16711935|r+(B.a.K(r,8)&16711935)&4278255360)>>>0},
kw(a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(a7===0||a6.b===0)return
if(a8!=null&&A.oU(a8,a3,a4,a5,a6.a,a6.b,a7))return
s=a6.b*2
r=a6.a.gv()
for(q=a2.length,p=a7>>>24===255,o=r.length,n=0;n<s;n+=2){if(!(n<o))return A.a(r,n)
m=r[n]
l=n+1
if(!(l<o))return A.a(r,l)
k=r[l]
j=k>>>8
i=(k&255)+1
h=i===256?a7:A.at(a7,i)
if(h===0)continue
g=h>>>24
f=((m>>>16)-a4)*a5+((m&65535)-a3)
e=f+j
if(g===255){d=e-3
for(l=a2.$flags|0,c=f;c<d;){l&2&&A.d(a2)
if(!(c>=0&&c<q))return A.a(a2,c)
a2[c]=h
b=c+1
if(!(b<q))return A.a(a2,b)
a2[b]=h
b=c+2
if(!(b<q))return A.a(a2,b)
a2[b]=h
b=c+3
if(!(b<q))return A.a(a2,b)
a2[b]=h
c+=4}for(;c<e;c=a){a=c+1
l&2&&A.d(a2)
if(!(c>=0&&c<q))return A.a(a2,c)
a2[c]=h}}else{a0=255-g
if(p&&j===1){if(!(f>=0&&f<q))return A.a(a2,f)
a1=a2[f]
l=a1===0?h:A.jo(h,a1,a0)
a2.$flags&2&&A.d(a2)
a2[f]=l}else for(c=f;c<e;++c){if(!(c>=0&&c<q))return A.a(a2,c)
a1=a2[c]
l=a1===0?h:A.jo(h,a1,a0)
a2.$flags&2&&A.d(a2)
a2[c]=l}}}},
ku(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
if(f===0||e<=0)return
s=d+e
r=f>>>24
if(r===255){q=s-3
for(p=a.$flags|0,o=d;o<q;){p&2&&A.d(a)
n=a.length
if(!(o>=0&&o<n))return A.a(a,o)
a[o]=f
m=o+1
if(!(m<n))return A.a(a,m)
a[m]=f
m=o+2
if(!(m<n))return A.a(a,m)
a[m]=f
m=o+3
if(!(m<n))return A.a(a,m)
a[m]=f
o+=4}for(;o<s;o=l){l=o+1
p&2&&A.d(a)
if(!(o>=0&&o<a.length))return A.a(a,o)
a[o]=f}}else{k=255-r
for(p=a.length,n=a.$flags|0,o=d;o<s;++o){if(!(o>=0&&o<p))return A.a(a,o)
j=a[o]
m=j===0?f:A.jo(f,j,k)
n&2&&A.d(a)
a[o]=m}}},
jo(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.a.K(s+(B.a.K(s,8)&16711935),8)&16711935|r+(B.a.K(r,8)&16711935)&4278255360)>>>0)},
mP(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8=null,c9=1023
if(d6===0||d4.b===0)return
s=e5-e3
r=e6-e4
q=s*s+r*r
if(q<=1e-12){if(0>=d5.length)return A.a(d5,0)
p=d5[0]
A.kw(d0,d1,d2,d3,d4,d6<255?A.U(p,d6):p,c8)
return}o=1/q
n=(d7*s+d8*r)*o
m=d4.b*2
l=d4.a.gv()
k=d6>=255
j=d5.length
if(k){if(0>=j)return A.a(d5,0)
i=d5[0]}else{if(0>=j)return A.a(d5,0)
i=A.U(d5[0],d6)}if(k){if(1023>=j)return A.a(d5,1023)
h=d5[1023]}else{if(1023>=j)return A.a(d5,1023)
h=A.U(d5[1023],d6)}for(g=d0.length,f=l.length,e=n<=0,d=n>=0,c=d0.$flags|0,b=0;b<m;b+=2){if(!(b<f))return A.a(l,b)
a=l[b]
a0=b+1
if(!(a0<f))return A.a(l,a0)
a1=l[a0]
a2=a>>>16
a3=a&65535
a4=a1>>>8
a5=(a1&255)+1
a6=a2+0.5
a7=a3+0.5
a8=((d7*a7+d9*a6+e1-e3)*s+(d8*a7+e0*a6+e2-e4)*r)*o
a9=(a2-d2)*d3+(a3-d1)
if(a8<=0&&e){A.ku(d0,c8,c8,a9,a4,a5===256?i:A.at(i,a5))
continue}if(a8>=1&&d){A.ku(d0,c8,c8,a9,a4,a5===256?h:A.at(h,a5))
continue}b0=a9+a4
a0=a5===256
if(a0&&k){b1=b0-3
for(b2=a9;b2<b1;a8=a0){b3=a8+n
b4=b3+n
b5=b4+n
a0=b5+n
if(a8>0&&a8<1&&b5>0&&b5<1){b6=B.c.M(a8*1023+0.5)
b7=B.c.M(b3*1023+0.5)
b8=B.c.M(b4*1023+0.5)
b9=B.c.M(b5*1023+0.5)}else{if(a8<=0)b6=0
else b6=a8>=1?c9:B.c.M(a8*1023+0.5)
if(b3<=0)b7=0
else b7=b3>=1?c9:B.c.M(b3*1023+0.5)
if(b4<=0)b8=0
else b8=b4>=1?c9:B.c.M(b4*1023+0.5)
if(b5<=0)b9=0
else b9=b5>=1?c9:B.c.M(b5*1023+0.5)}if(!(b6>=0&&b6<j))return A.a(d5,b6)
c0=d5[b6]
if(!(b7>=0&&b7<j))return A.a(d5,b7)
c1=d5[b7]
if(!(b8>=0&&b8<j))return A.a(d5,b8)
c2=d5[b8]
if(!(b9>=0&&b9<j))return A.a(d5,b9)
c3=d5[b9]
c4=b2+1
c5=b2+2
b3=b2+3
if((c0&c1&c2&c3)>>>0>=4278190080){c&2&&A.d(d0)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
d0[b2]=c0
if(!(c4>=0&&c4<g))return A.a(d0,c4)
d0[c4]=c1
if(!(c5>=0&&c5<g))return A.a(d0,c5)
d0[c5]=c2
if(!(b3>=0&&b3<g))return A.a(d0,b3)
d0[b3]=c3}else{if(!(b2>=0&&b2<g))return A.a(d0,b2)
c6=A.u(c0,d0[b2])
c&2&&A.d(d0)
d0[b2]=c6
if(!(c4>=0&&c4<g))return A.a(d0,c4)
d0[c4]=A.u(c1,d0[c4])
if(!(c5>=0&&c5<g))return A.a(d0,c5)
d0[c5]=A.u(c2,d0[c5])
if(!(b3>=0&&b3<g))return A.a(d0,b3)
d0[b3]=A.u(c3,d0[b3])}b2+=4}while(b2<b0){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.M(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=d5[c7]
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}}else if(k)for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.M(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.at(d5[c7],a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}else if(a0)for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.M(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.U(d5[c7],d6)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}else for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.M(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
p=A.at(A.U(d5[c7],d6),a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(p,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}}},
mQ(e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9=1023
if(e6===0||e4.b===0)return
s=f5-f3
r=f6-f4
q=1/Math.max(0.001,Math.sqrt(s*s+r*r))
p=e7*q
o=e8*q
n=e9*q
m=f0*q
l=(f1-f3)*q
k=(f2-f4)*q
j=p*p+o*o
i=2*j
h=e4.b*2
g=e4.a.gv()
f=e6<255
e=e5.length
if(1023>=e)return A.a(e5,1023)
d=e5[1023]
c=d>=4278190080
for(b=e0.length,a=g.length,a0=!f,a1=d!==0,a2=e0.$flags|0,a3=0;a3<h;a3+=2){if(!(a3<a))return A.a(g,a3)
a4=g[a3]
a5=a3+1
if(!(a5<a))return A.a(g,a5)
a6=g[a5]
a7=a4>>>16
a8=a4&65535
a9=(a6&255)+1
b0=a7+0.5
b1=a8+0.5
b2=p*b1+n*b0+l
b3=o*b1+m*b0+k
b4=b2*b2+b3*b3
b5=2*(b2*p+b3*o)+j
b6=(a7-e2)*e3+(a8-e1)
b7=b6+(a6>>>8)
a5=a9===256&&a0
b8=b7-3
if(a5){for(b9=b6;b9<b8;){c0=b4>0?b4:0
b4+=b5
b5+=i
c1=b4>0?b4:0
b4+=b5
b5+=i
c2=b4>0?b4:0
b4+=b5
b5+=i
c3=b4>0?b4:0
b4+=b5
b5+=i
if(c0>=1&&c1>=1&&c2>=1&&c3>=1){if(c){a2&2&&A.d(e0)
if(!(b9>=0&&b9<b))return A.a(e0,b9)
e0[b9]=d
a5=b9+1
if(!(a5<b))return A.a(e0,a5)
e0[a5]=d
a5=b9+2
if(!(a5<b))return A.a(e0,a5)
e0[a5]=d
a5=b9+3
if(!(a5<b))return A.a(e0,a5)
e0[a5]=d}else if(a1){if(!(b9>=0&&b9<b))return A.a(e0,b9)
a5=A.u(d,e0[b9])
a2&2&&A.d(e0)
e0[b9]=a5
a5=b9+1
if(!(a5<b))return A.a(e0,a5)
e0[a5]=A.u(d,e0[a5])
a5=b9+2
if(!(a5<b))return A.a(e0,a5)
e0[a5]=A.u(d,e0[a5])
a5=b9+3
if(!(a5<b))return A.a(e0,a5)
e0[a5]=A.u(d,e0[a5])}b9+=4
continue}a5=$.dB()
a5.$flags&2&&A.d(a5)
a5[0]=c0
c4=a5[0]
a5[0]=c1
c5=a5[0]
a5[0]=c2
c6=a5[0]
a5[0]=c3
c7=new A.aN(c4,c5,c6,a5[0]).cG()
c8=c7.a
c6=c7.b
c9=c7.c
d0=c7.d
a5=c8>=1?d9:B.c.M(c8*1023+0.5)
if(!(a5>=0&&a5<e))return A.a(e5,a5)
d1=e5[a5]
a5=c6>=1?d9:B.c.M(c6*1023+0.5)
if(!(a5>=0&&a5<e))return A.a(e5,a5)
d2=e5[a5]
a5=c9>=1?d9:B.c.M(c9*1023+0.5)
if(!(a5>=0&&a5<e))return A.a(e5,a5)
d3=e5[a5]
a5=d0>=1?d9:B.c.M(d0*1023+0.5)
if(!(a5>=0&&a5<e))return A.a(e5,a5)
d4=e5[a5]
a5=b9+1
c4=b9+2
c5=b9+3
if((d1&d2&d3&d4)>>>0>=4278190080){a2&2&&A.d(e0)
if(!(b9>=0&&b9<b))return A.a(e0,b9)
e0[b9]=d1
if(!(a5>=0&&a5<b))return A.a(e0,a5)
e0[a5]=d2
if(!(c4>=0&&c4<b))return A.a(e0,c4)
e0[c4]=d3
if(!(c5>=0&&c5<b))return A.a(e0,c5)
e0[c5]=d4}else{if(!(b9>=0&&b9<b))return A.a(e0,b9)
c6=A.u(d1,e0[b9])
a2&2&&A.d(e0)
e0[b9]=c6
if(!(a5>=0&&a5<b))return A.a(e0,a5)
e0[a5]=A.u(d2,e0[a5])
if(!(c4>=0&&c4<b))return A.a(e0,c4)
e0[c4]=A.u(d3,e0[c4])
if(!(c5>=0&&c5<b))return A.a(e0,c5)
e0[c5]=A.u(d4,e0[c5])}b9+=4}while(b9<b7){d5=b4>0?b4:0
d6=d5>=1?d9:B.c.M(Math.sqrt(d5)*1023+0.5)
if(!(d6>=0&&d6<e))return A.a(e5,d6)
a5=e5[d6]
if(!(b9>=0&&b9<b))return A.a(e0,b9)
a5=A.u(a5,e0[b9])
a2&2&&A.d(e0)
e0[b9]=a5
b4+=b5
b5+=i;++b9}}else{for(a5=a9<256,b9=b6;b9<b8;){c0=b4>0?b4:0
b4+=b5
b5+=i
c1=b4>0?b4:0
b4+=b5
b5+=i
c2=b4>0?b4:0
b4+=b5
b5+=i
c3=b4>0?b4:0
b4+=b5
b5+=i
if(c0>=1&&c1>=1&&c2>=1&&c3>=1){d4=d
d3=d4
d2=d3
d1=d2}else{c4=$.dB()
c4.$flags&2&&A.d(c4)
c4[0]=c0
c5=c4[0]
c4[0]=c1
c6=c4[0]
c4[0]=c2
d7=c4[0]
c4[0]=c3
c7=new A.aN(c5,c6,d7,c4[0]).cG()
c8=c7.a
c6=c7.b
c9=c7.c
d0=c7.d
c4=c8>=1?d9:B.c.M(c8*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d1=e5[c4]
c4=c6>=1?d9:B.c.M(c6*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d2=e5[c4]
c4=c9>=1?d9:B.c.M(c9*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d3=e5[c4]
c4=d0>=1?d9:B.c.M(d0*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d4=e5[c4]}if(f){d1=A.U(d1,e6)
d2=A.U(d2,e6)
d3=A.U(d3,e6)
d4=A.U(d4,e6)}if(a5){d1=A.at(d1,a9)
d2=A.at(d2,a9)
d3=A.at(d3,a9)
d4=A.at(d4,a9)}if(!(b9>=0&&b9<b))return A.a(e0,b9)
c4=A.u(d1,e0[b9])
a2&2&&A.d(e0)
e0[b9]=c4
c4=b9+1
if(!(c4<b))return A.a(e0,c4)
e0[c4]=A.u(d2,e0[c4])
c4=b9+2
if(!(c4<b))return A.a(e0,c4)
e0[c4]=A.u(d3,e0[c4])
c4=b9+3
if(!(c4<b))return A.a(e0,c4)
e0[c4]=A.u(d4,e0[c4])
b9+=4}while(b9<b7){d5=b4>0?b4:0
d6=d5>=1?d9:B.c.M(Math.sqrt(d5)*1023+0.5)
if(!(d6>=0&&d6<e))return A.a(e5,d6)
d8=e5[d6]
if(f)d8=A.U(d8,e6)
if(a5)d8=A.at(d8,a9)
if(!(b9>=0&&b9<b))return A.a(e0,b9)
c4=A.u(d8,e0[b9])
a2&2&&A.d(e0)
e0[b9]=c4
b4+=b5
b5+=i;++b9}}}},
a2(a){var s=A.j(a)+128
return B.a.K(s+B.a.K(s,8),8)},
jm(a,b,c,d,e){var s
switch(e){case 1:s=a*b
break
case 3:s=2*b<=d?2*a*b:c*d-2*(c-a)*(d-b)
break
case 4:s=Math.min(a*d,b*c)
break
case 5:s=Math.max(a*d,b*c)
break
case 8:s=2*a
s=s<=c?s*b:c*d-2*(c-a)*(d-b)
break
case 10:s=Math.abs(a*d-b*c)
break
case 11:s=a*d+b*c-2*a*b
break
default:s=a*d
break}return A.a2(a*(255-d)+b*(255-c)+s)},
eb(a,b,c){var s,r,q,p,o,n,m,l,k
if(a===0)return b
if(b===0)return a
s=a>>>24
r=b>>>24
q=a>>>16&255
p=b>>>16&255
o=a>>>8&255
n=b>>>8&255
m=a&255
l=b&255
if(c===16)return(Math.min(255,s+r)<<24|Math.min(255,q+p)<<16|Math.min(255,o+n)<<8|Math.min(255,m+l))>>>0
k=s+r-A.a2(s*r)
if(A.ky(c))return A.mM(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.a2(q*p)<<16|o+n-A.a2(o*n)<<8|m+l-A.a2(m*l))>>>0
return(k<<24|A.jm(q,p,s,r,c)<<16|A.jm(o,n,s,r,c)<<8|A.jm(m,l,s,r,c))>>>0},
ky(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
mM(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.aC(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.aC(o,n,m)
switch(j){case 12:s=A.fC(A.kv(p,A.jn(l)),A.ea(l))
break
case 13:s=A.fC(A.kv(l,A.jn(p)),A.ea(l))
break
case 14:s=A.fC(p,A.ea(l))
break
case 15:s=A.fC(l,A.ea(p))
break
default:s=new A.aC(A.jl(o,s,j),A.jl(n,r,j),A.jl(m,q,j))
break}r=new A.fB(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.a9()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.a9()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.ad(s)
return(i<<24|q<<16|o<<8|s)>>>0},
jl(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
ea(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
jn(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
kv(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.jn(a)
if(o===0)return B.aL
return new A.aC((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
fC(a,b){var s=b-A.ea(a),r=a.a,q=a.b,p=a.c,o=new A.fD(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.aC(o.$1(r),o.$1(q),o.$1(p))},
ks(a,b){var s,r,q,p,o,n,m,l,k,j
if(a===0)return b
if(b===0)return a
s=a>>>24
r=b>>>24
q=255-s
p=255-r
o=a>>>16&255
n=b>>>16&255
m=a>>>8&255
l=b>>>8&255
k=a&255
j=b&255
return(s+r-A.a2(s*r)<<24|A.a2(o*p+n*q+o*n)<<16|A.a2(m*p+l*q+m*l)<<8|A.a2(k*p+j*q+k*j))>>>0},
kt(a,b){var s,r,q,p,o,n,m,l
if(a===0)return b
if(b===0)return a
s=a>>>24
r=b>>>24
q=a>>>16&255
p=b>>>16&255
o=a>>>8&255
n=b>>>8&255
m=a&255
l=b&255
return(s+r-A.a2(s*r)<<24|q+p-A.a2(q*p)<<16|o+n-A.a2(o*n)<<8|m+l-A.a2(m*l))>>>0},
mN(a,b,c,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
if(a2===0)return
if(a4!=null){s=A.ky(a3)
s=!s&&A.oO(a4,b,c,a0,a1.a,a1.b,a2,a3)}else s=!1
if(s)return
r=a1.a.gv()
q=a1.b*2
if(a3===1){for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.at(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.ks(h,d)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}return}if(a3===2){for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.at(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.kt(h,d)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}return}for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.at(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.eb(h,d,a3)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}},
mO(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
if(a3===1){for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.d(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.ks(k,j)
p=j
q=k}a.$flags&2&&A.d(a)
a[l]=o}return}if(a3===2){for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.d(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.kt(k,j)
p=j
q=k}a.$flags&2&&A.d(a)
a[l]=o}return}for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.d(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.eb(k,j,a3)
p=j
q=k}a.$flags&2&&A.d(a)
a[l]=o}},
fB:function fB(a,b,c){this.a=a
this.b=b
this.c=c},
fD:function fD(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
n0(a,b,c){var s,r,q,p,o=null
if(c===1){if(!(b>=0&&b<a.length))return A.a(a,b)
switch(a[b]){case 118:s="v"
break
case 105:s="i"
break
case 111:s="o"
break
case 99:s="c"
break
case 116:s="t"
break
case 115:s="s"
break
case 101:s="e"
break
case 97:s="a"
break
case 107:s="k"
break
case 120:s="x"
break
case 121:s="y"
break
case 112:s="p"
break
case 114:s="r"
break
case 119:s="w"
break
case 104:s="h"
break
case 100:s="d"
break
case 103:s="g"
break
case 108:s="l"
break
case 110:s="n"
break
case 109:s="m"
break
default:s=o
break}return s}if(c===2){s=a.length
if(!(b>=0&&b<s))return A.a(a,b)
r=a[b]
q=b+1
if(!(q<s))return A.a(a,q)
switch((r<<8|a[q])>>>0){case 29817:s="ty"
break
case 28269:s="nm"
break
case 28014:s="mn"
break
case 27e3:s="ix"
break
case 27507:s="ks"
break
case 26996:s="it"
break
case 29807:s="to"
break
case 29801:s="ti"
break
case 26724:s="hd"
break
case 25197:s="bm"
break
case 29812:s="tt"
break
case 29796:s="td"
break
case 29808:s="tp"
break
case 26992:s="ip"
break
case 28528:s="op"
break
case 26226:s="fr"
break
case 29556:s="st"
break
case 29554:s="sr"
break
case 29805:s="tm"
break
case 25958:s="ef"
break
case 29561:s="sy"
break
case 28788:s="pt"
break
case 27747:s="lc"
break
case 27754:s="lj"
break
case 28012:s="ml"
break
case 28013:s="mm"
break
case 26994:s="ir"
break
case 26995:s="is"
break
case 28530:s="or"
break
case 28531:s="os"
break
case 29559:s="sw"
break
case 29544:s="sh"
break
case 29539:s="sc"
break
case 24943:s="ao"
break
case 25452:s="cl"
break
case 27758:s="ln"
break
case 28272:s="np"
break
case 25966:s="en"
break
case 26980:s="id"
break
case 29547:s="sk"
break
case 29537:s="sa"
break
case 25448:s="ch"
break
case 28271:s="no"
break
default:s=o
break}return s}if(c===3){s=a.length
if(!(b>=0&&b<s))return A.a(a,b)
r=a[b]
q=b+1
if(!(q<s))return A.a(a,q)
q=a[q]
p=b+2
if(!(p<s))return A.a(a,p)
switch((r<<16|q<<8|a[p])>>>0){case 6579300:s="ddd"
break
case 6909540:s="ind"
break
case 6515064:s="cix"
break
case 6909558:s="inv"
break
case 7171122:s="ml2"
break
case 7628659:s="tgs"
break
default:s=o
break}return s}s=c===6
r=!1
if(s){q=a.length
if(!(b>=0&&b<q))return A.a(a,b)
if(a[b]===108){p=b+1
if(!(p<q))return A.a(a,p)
if(a[p]===97){r=b+5
if(!(r<q))return A.a(a,r)
r=a[r]===115}}}if(r){r=b+2
q=a.length
if(!(r>=0&&r<q))return A.a(a,r)
p=!1
if(a[r]===121){r=b+3
if(!(r>=0&&r<q))return A.a(a,r)
if(a[r]===101){r=b+4
if(!(r>=0&&r<q))return A.a(a,r)
r=a[r]===114}else r=p}else r=p
if(r)return"layers"}r=!1
if(s){q=a.length
if(!(b>=0&&b<q))return A.a(a,b)
if(a[b]===115){p=b+1
if(!(p<q))return A.a(a,p)
if(a[p]===104){r=b+5
if(!(r<q))return A.a(a,r)
r=a[r]===115}}}if(r){r=b+2
q=a.length
if(!(r>=0&&r<q))return A.a(a,r)
p=!1
if(a[r]===97){r=b+3
if(!(r>=0&&r<q))return A.a(a,r)
if(a[r]===112){r=b+4
if(!(r>=0&&r<q))return A.a(a,r)
r=a[r]===101}else r=p}else r=p
if(r)return"shapes"}r=!1
if(s){q=a.length
if(!(b>=0&&b<q))return A.a(a,b)
if(a[b]===97){p=b+1
if(!(p<q))return A.a(a,p)
if(a[p]===115){r=b+5
if(!(r<q))return A.a(a,r)
r=a[r]===115}}}if(r){r=b+2
q=a.length
if(!(r>=0&&r<q))return A.a(a,r)
p=!1
if(a[r]===115){r=b+3
if(!(r>=0&&r<q))return A.a(a,r)
if(a[r]===101){r=b+4
if(!(r>=0&&r<q))return A.a(a,r)
r=a[r]===116}else r=p}else r=p
if(r)return"assets"}r=!1
if(s){s=a.length
if(!(b>=0&&b<s))return A.a(a,b)
if(a[b]===112){q=b+1
if(!(q<s))return A.a(a,q)
if(a[q]===97){r=b+5
if(!(r<s))return A.a(a,r)
r=a[r]===116
s=r}else s=r}else s=r}else s=r
if(s){s=b+2
r=a.length
if(!(s>=0&&s<r))return A.a(a,s)
q=!1
if(a[s]===114){s=b+3
if(!(s>=0&&s<r))return A.a(a,s)
if(a[s]===101){s=b+4
if(!(s>=0&&s<r))return A.a(a,s)
s=a[s]===110}else s=q}else s=q
if(s)return"parent"}s=!1
if(c===5){r=a.length
if(!(b>=0&&b<r))return A.a(a,b)
if(a[b]===114){q=b+1
if(!(q<r))return A.a(a,q)
if(a[q]===101){s=b+4
if(!(s<r))return A.a(a,s)
s=a[s]===100}}}if(s){s=b+2
r=a.length
if(!(s>=0&&s<r))return A.a(a,s)
if(a[s]===102){s=b+3
if(!(s>=0&&s<r))return A.a(a,s)
s=a[s]===73}else s=!1
if(s)return"refId"}s=!1
if(c===4){r=a.length
if(!(b>=0&&b<r))return A.a(a,b)
if(a[b]===109){q=b+1
if(!(q<r))return A.a(a,q)
if(a[q]===111){q=b+2
if(!(q<r))return A.a(a,q)
if(a[q]===100){s=b+3
if(!(s<r))return A.a(a,s)
s=a[s]===101}}}}if(s)return"mode"
return o},
cf:function cf(a,b){this.a=a
this.b=b},
hS:function hS(a,b,c,d){var _=this
_.a=a
_.b=b
_.d=_.c=0
_.e=c
_.f=d},
fL:function fL(a,b,c){this.a=a
this.b=b
this.c=c},
dJ:function dJ(a){this.a=a},
mo(a,b,c,d,e,f,g,h){var s=h&&b>=32?J.iX(B.h.ga7(e),e.byteOffset,e.length/4|0):null
return new A.f8(a,b,c,d,e,f,g,g==null||b<2?null:A.kh(a.length,null,!1,t.cn),s)},
mU(a){var s,r,q,p=a.length
if(p===1){if(0>=p)return A.a(a,0)
s=a[0]
if(s===0)return $.iV()
if(s===100)return $.iT()
if(s===1)return $.lB()}else if(p===2){if(0>=p)return A.a(a,0)
r=a[0]
if(1>=p)return A.a(a,1)
q=a[1]
if(r===0&&q===0)return $.iW()
if(r===100&&q===100)return $.iU()}return A.jp(a)},
jp(a){return new A.E(new Float32Array(A.a9(a)),null,!1,$.bq(),!1)},
ee(a){return new A.E(a,null,!1,$.bq(),!1)},
mT(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
mS(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
fH(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.P(s)
if(r>=4096)return 1
q=$.lz()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
f8:function f8(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
f9:function f9(){},
E:function E(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
dm:function dm(a,b){this.a=a
this.b=b},
jM(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.Z)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.n(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.aX(o)){n=o
break A}n=A.r(A.ao("Unsupported raster worker field",null))}l.push(n)}return new A.x(l,m)},
oA(e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1=null
A:{s=t.e6.b(e2)
r=e1
q=e1
p=!1
o=e1
n=!1
m=e1
l=!1
k=e1
j=!1
i=e1
h=!1
g=e1
f=!1
e=e1
d=!1
c=e1
b=!1
a=e1
a0=!1
a1=e1
a2=!1
a3=e1
a4=e1
a5=e1
a6=e1
a7=e1
a8=e1
a9=e1
b0=e1
b1=e1
b2=e1
b3=e1
b4=!1
if(s){b5=e2.a
b6=b5[0]
b7=0===b6
if(b7){r=b5[9]
p=A.n(r)
if(p){A.j(r)
q=b5[2]
n=typeof q=="string"
if(n){A.G(q)
o=b5[7]
b8=t.p
if(b8.b(o)){b8.a(o)
b9=b5[11]
l=A.aX(b9)
if(l){A.aJ(b9)
m=b5[1]
j=A.n(m)
if(j){A.j(m)
k=b5[12]
h=A.n(k)
if(h){A.j(k)
i=b5[8]
f=A.n(i)
if(f){A.j(i)
g=b5[6]
d=A.n(g)
if(d){A.j(g)
e=b5[5]
b=A.n(e)
if(b){A.j(e)
c=b5[10]
a0=A.n(c)
if(a0){A.j(c)
a=b5[3]
a2=A.n(a)
if(a2){A.j(a)
a1=b5[4]
b4=A.n(a1)
b3=a}b2=c}b1=e}b0=g}a9=i}a8=k}a7=m}a6=b9}a5=o}a4=q}a3=r}}}else{b6=e1
b7=!1}if(b4){b4=[0,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,A.j(a2?a1:e2.a[4])]
break A}a3=e1
a4=e1
c0=e1
c1=e1
a5=e1
a6=e1
c2=e1
a7=e1
a8=e1
c3=e1
c4=e1
a9=e1
b0=e1
b1=e1
b2=e1
b3=e1
b4=!1
if(t.f2.b(e2)){c5=!0
c6=!0
c7=!0
if(s)b5=b6
else{b6=e2.a[0]
b5=b6
s=!0}if(4===b5){if(b7)b5=r
else{r=e2.a[10]
b5=r
b7=c5}if(A.n(b5)){if(b7)b5=r
else{r=e2.a[10]
b5=r
b7=c5}A.j(b5)
if(p)b8=q
else{q=e2.a[3]
b8=q
p=c6}if(typeof b8=="string"){if(p)b8=q
else{q=e2.a[3]
b8=q
p=c6}A.G(b8)
c8=e2.a
c9=c8[13]
if(A.n(c9)){A.j(c9)
d0=c8[11]
if(A.n(d0)){A.j(d0)
if(n)d1=o
else{o=c8[8]
d1=o
n=!0}d2=t.p
if(d2.b(d1)){a5=d2.a(n?o:c8[8])
d3=c8[16]
if(A.n(d3)){A.j(d3)
d4=c8[1]
if(A.n(d4)){A.j(d4)
if(l)d1=m
else{m=c8[2]
d1=m
l=!0}if(A.n(d1)){a7=A.j(l?m:c8[2])
if(j)d1=k
else{k=c8[17]
d1=k
j=c7}if(A.n(d1)){if(j)d1=k
else{k=c8[17]
d1=k
j=c7}A.j(d1)
d5=c8[14]
if(A.n(d5)){A.j(d5)
d6=c8[12]
if(A.n(d6)){A.j(d6)
if(h)d2=i
else{i=c8[9]
d2=i
h=!0}if(A.n(d2)){a9=A.j(h?i:c8[9])
if(f)d2=g
else{g=c8[7]
d2=g
f=!0}if(A.n(d2)){b0=A.j(f?g:c8[7])
if(d)d2=e
else{e=c8[6]
d2=e
d=!0}if(A.n(d2)){b1=A.j(d?e:c8[6])
if(b)d2=c
else{c=c8[15]
d2=c
b=!0}if(A.n(d2)){b2=A.j(b?c:c8[15])
if(a0)d2=a
else{a=c8[4]
d2=a
a0=!0}if(A.n(d2)){b3=A.j(a0?a:c8[4])
if(a2)b4=a1
else{a1=c8[5]
b4=a1
a2=!0}b4=A.n(b4)}}}}}c4=d6}c3=d5}a8=d1}}c2=d4}a6=d3}}c1=d0}c0=c9}a4=b8}a3=b5}}}if(b4){b4=[4,a3,a4,c0,c1,a5,a6,c2,a7,a8,c3,c4,a9,b0,b1,b2,b3,A.j(a2?a1:e2.a[5])]
break A}d7=e1
d8=!1
a3=e1
b4=!1
if(t.bA.b(e2)){c5=!0
if(s)b5=b6
else{b6=e2.a
b5=b6
s=!0}if(1===b5){if(b7)b5=r
else{r=e2.c
b5=r
b7=c5}d8=A.n(b5)
if(d8){if(b7)b5=r
else{r=e2.c
b5=r
b7=c5}A.j(b5)
d7=e2.b
b4=typeof d7=="string"
a3=b5}}}if(b4){b4=[1,a3,A.G(d8?d7:e2.b)]
break A}d9=e1
e0=!1
a3=e1
b4=!1
if(t.ca.b(e2)){if(s)b5=b6
else{b6=e2.a
b5=b6
s=!0}if(3===b5){if(b7)b5=r
else{r=e2.c
b5=r
b7=!0}e0=A.n(b5)
if(e0){a3=A.j(b7?r:e2.c)
d9=e2.b
b4=typeof d9=="string"}}}if(b4){b4=[3,a3,A.G(e0?d9:e2.b)]
break A}a4=e1
b4=!1
if(t.dH.b(e2))if(2===(s?b6:e2.a)){if(p)b5=q
else{q=e2.b
b5=q
p=!0}if(typeof b5=="string"){a4=A.G(p?q:e2.b)
if(j)b4=k
else{k=e2.c
b4=k
j=!0}b4=A.n(b4)}}if(b4){b4=[2,a4,A.j(j?k:e2.c)]
break A}b4=A.r(A.ao("Unsupported raster worker reply",e1))}return A.jM(b4)},
fM:function fM(a){this.a=a},
oS(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.a.F(B.c.P(Math.min(a*c,s)),0,s)},
oV(b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d={},c=A.cW(32,512),b=A.cW(32,512),a=A.cW(32,512),a0=A.cW(32,512),a1=A.cW(32,512),a2=t.fM,a3=A.h([],a2),a4=A.h([],a2),a5=A.h([],a2),a6=A.h([],a2),a7=t.dh,a8=A.h([],a7),a9=A.h([],t.cU),b0=A.h([],a7),b1=A.h([],t.by),b2=t.n,b3=A.h([],b2)
b2=A.h([],b2)
s=new Float64Array(256)
r=t.bU
q=A.h([],r)
p=A.h([],a2)
a2=A.h([],a2)
o=A.h([],r)
r=A.h([],r)
n=A.h([],t.a2)
a7=A.h([],a7)
m=$.k!=null
l=new A.fq(m,new A.aj(t.el),c,b,a,a0,a1,a3,a4,a5,a6,a8,a9,b0,b1,b3,b2,new A.bt(s),!1,q,p,a2,o,r,n,new A.aj(t.gS),new A.aj(t.fk),new A.aj(t.gj),a7)
c=t.N
k=A.a5(c,c)
b=t.x
a=t.S
a0=new Uint8Array(32)
a1=new Uint8Array(16)
a2=new Uint8Array(65536)
j=new A.eR(null,A.a5(b,t.g2),A.a5(c,t.cJ),A.a5(c,a),A.a5(c,a),A.fc(c),A.a5(b,t.gz),A.fc(b),A.a5(c,t.eY),a0,a1,a2)
b=new Int32Array(16384)
i=new A.fd(b,new Uint8Array(131072))
h=new A.fF()
g=A.a5(c,t.fW)
f=new A.fy()
$.jU()
c=$.ji.$0()
f.a=c
f.b=null
e=A.fk(65536)
d.a=0
c=new A.iK(f)
b=new A.iJ(d,e,h)
a=new A.iL(e)
a0=new A.iM(d,e,h)
a1=new A.iO(j,g,l)
a2=new A.iQ(k,b4)
a3=b4.a
new A.cl(a3,A.o(a3).i("cl<1>")).hu(new A.iI(d,j,g,l,e,b4,new A.iN(g,l,k),k,b,a,h,a1,a0,a2,f,c,i,new A.iP(b4,j,h,b,e,a0,g,a2,f,l,c,i,a,a1)))},
iK:function iK(a){this.a=a},
iJ:function iJ(a,b,c){this.a=a
this.b=b
this.c=c},
iL:function iL(a){this.a=a},
iM:function iM(a,b,c){this.a=a
this.b=b
this.c=c},
iO:function iO(a,b,c){this.a=a
this.b=b
this.c=c},
iN:function iN(a,b,c){this.a=a
this.b=b
this.c=c},
iQ:function iQ(a,b){this.a=a
this.b=b},
iP:function iP(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n},
iI:function iI(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p
_.ch=q
_.CW=r},
oL(){var s,r,q=null,p={}
p.a=!1
s=A.v(v.G.self)
p=new A.iC(p,new A.h9(new A.ck(q,q,q,q,t.co)))
if(typeof p=="function")A.r(A.ao("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.nA,p)
r[$.iS()]=p
s.onmessage=r},
iB:function iB(a,b){this.a=a
this.b=b},
iC:function iC(a,b){this.a=a
this.b=b},
h9:function h9(a){this.a=a},
j3(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.bb(b,c,B.a.a_(a.byteLength,s))
return J.k_(B.d.ga7(a),a.byteOffset+b*s,(c-b)*s)},
b0(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.bb(b,c,B.a.a_(a.byteLength,s))
return J.c9(J.k0(a),a.byteOffset+b*s,(c-b)*s)},
jr(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.bb(b,c,B.a.a_(a.byteLength,s))-b)*s
if(B.a.T(r,4)!==0)throw A.f(A.ao("The number of bytes to view must be a multiple of 4",null))
return J.lX(J.k0(a),a.byteOffset+b*s,B.a.J(r,4))},
lr(a){return v.mangledGlobalNames[a]},
oD(a){var s=A.nr(a,1)
return s},
nr(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b&65535,e=b>>>16,d=a.length
for(s=d,r=0;s>0;){q=s<3800?s:3800
s-=q
p=r+q
o=p-8
for(;r<=o;f=g){if(!(r>=0&&r<d))return A.a(a,r)
f+=a[r]
n=r+1
if(!(n<d))return A.a(a,n)
m=f+a[n]
n=r+2
if(!(n<d))return A.a(a,n)
l=m+a[n]
n=r+3
if(!(n<d))return A.a(a,n)
k=l+a[n]
n=r+4
if(!(n<d))return A.a(a,n)
j=k+a[n]
n=r+5
if(!(n<d))return A.a(a,n)
i=j+a[n]
n=r+6
if(!(n<d))return A.a(a,n)
h=i+a[n]
n=r+7
if(!(n<d))return A.a(a,n)
g=h+a[n]
e=e+f+m+l+k+j+i+h+g
r+=8}for(;r<p;++r){if(!(r>=0&&r<d))return A.a(a,r)
f+=a[r]
e+=f}f=B.a.T(f,65521)
e=B.a.T(e,65521)}return(e<<16|f)>>>0},
lk(a,b){var s,r,q,p=a.length
if(p>=32)return A.nG(a,b)
b^=4294967295
for(s=p,r=0;s>=8;){q=r+1
if(!(r<p))return A.a(a,r)
b=B.k[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.k[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.k[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.k[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.k[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.k[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.k[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.k[(b^a[q])&255]^b>>>8
s-=8}if(s>0)do{q=r+1
if(!(r<p))return A.a(a,r)
b=B.k[(b^a[r])&255]^b>>>8
if(--s,s>0){r=q
continue}else break}while(!0)
return(b^4294967295)>>>0},
nz(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
nG(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.le
if(c7==null)c7=$.le=A.nz(B.k)
s=c8.length
r=J.k_(B.d.ga7(c8),c8.byteOffset,s)
q=c9^4294967295
p=s-32
for(o=0;o<=p;){n=q^r.getUint32(o,!0)
m=r.getUint32(o+4,!0)
l=r.getUint32(o+8,!0)
k=r.getUint32(o+12,!0)
j=r.getUint32(o+16,!0)
i=r.getUint32(o+20,!0)
h=r.getUint32(o+24,!0)
g=r.getUint32(o+28,!0)
f=c7[7936+(n&255)]
e=c7[7680+(n>>>8&255)]
d=c7[7424+(n>>>16&255)]
c=7168+(n>>>24)
if(!(c<8192))return A.a(c7,c)
c=c7[c]
b=c7[6912+(m&255)]
a=c7[6656+(m>>>8&255)]
a0=c7[6400+(m>>>16&255)]
a1=6144+(m>>>24)
if(!(a1<8192))return A.a(c7,a1)
a1=c7[a1]
a2=c7[5888+(l&255)]
a3=c7[5632+(l>>>8&255)]
a4=c7[5376+(l>>>16&255)]
a5=5120+(l>>>24)
if(!(a5<8192))return A.a(c7,a5)
a5=c7[a5]
a6=c7[4864+(k&255)]
a7=c7[4608+(k>>>8&255)]
a8=c7[4352+(k>>>16&255)]
a9=4096+(k>>>24)
if(!(a9<8192))return A.a(c7,a9)
a9=c7[a9]
b0=c7[3840+(j&255)]
b1=c7[3584+(j>>>8&255)]
b2=c7[3328+(j>>>16&255)]
b3=3072+(j>>>24)
if(!(b3<8192))return A.a(c7,b3)
b3=c7[b3]
b4=c7[2816+(i&255)]
b5=c7[2560+(i>>>8&255)]
b6=c7[2304+(i>>>16&255)]
b7=2048+(i>>>24)
if(!(b7<8192))return A.a(c7,b7)
b7=c7[b7]
b8=c7[1792+(h&255)]
b9=c7[1536+(h>>>8&255)]
c0=c7[1280+(h>>>16&255)]
c1=1024+(h>>>24)
if(!(c1<8192))return A.a(c7,c1)
c1=c7[c1]
c2=c7[768+(g&255)]
c3=c7[512+(g>>>8&255)]
c4=c7[256+(g>>>16&255)]
c5=g>>>24
if(!(c5<8192))return A.a(c7,c5)
q=f^e^d^c^b^a^a0^a1^a2^a3^a4^a5^a6^a7^a8^a9^b0^b1^b2^b3^b4^b5^b6^b7^b8^b9^c0^c1^c2^c3^c4^c7[c5]
o+=32}for(;o<s;o=c6){c6=o+1
q=c7[(q^c8[o])&255]^q>>>8}return(q^4294967295)>>>0},
oy(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.J.h1(a,16777216,!0,!0)
if(s>16777216)throw A.f(B.a0)
return a}},B={}
var w=[A,J,B]
var $={}
A.ja.prototype={}
J.C.prototype={
G(a,b){return a===b},
gX(a){return A.cX(a)},
t(a){return"Instance of '"+A.e2(a)+"'"},
gY(a){return A.c5(A.jC(this))}}
J.cH.prototype={
t(a){return String(a)},
bG(a,b){return b||a},
gX(a){return a?519018:218159},
gY(a){return A.c5(t.y)},
$iA:1,
$iq:1}
J.cJ.prototype={
G(a,b){return null==b},
t(a){return"null"},
gX(a){return 0},
$iA:1,
$ia1:1}
J.T.prototype={$iJ:1}
J.bu.prototype={
gX(a){return 0},
t(a){return String(a)}}
J.e1.prototype={}
J.d2.prototype={}
J.ax.prototype={
t(a){var s=a[$.lu()]
if(s==null)s=a[$.iS()]
if(s==null)return this.ew(a)
return"JavaScript function for "+J.bH(s)},
$ibJ:1}
J.bK.prototype={
gX(a){return 0},
t(a){return String(a)}}
J.bL.prototype={
gX(a){return 0},
t(a){return String(a)}}
J.y.prototype={
m(a,b){A.a3(a).c.a(b)
a.$flags&1&&A.d(a,29)
a.push(b)},
ak(a,b){var s
A.a3(a).i("m<1>").a(b)
a.$flags&1&&A.d(a,"addAll",2)
if(Array.isArray(b)){this.eL(a,b)
return}for(s=J.cA(b);s.u();)a.push(s.gB())},
eL(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.f(A.aF(a))
for(r=0;r<s;++r)a.push(b[r])},
l(a){a.$flags&1&&A.d(a,"clear","clear")
a.length=0},
aH(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
eu(a,b,c){var s=a.length
if(b>s)throw A.f(A.ar(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.f(A.ar(c,b,s,"end",null))
if(b===c)return A.h([],A.a3(a))
return A.h(a.slice(b,c),A.a3(a))},
ga5(a){if(a.length>0)return a[0]
throw A.f(A.ae())},
gad(a){var s=a.length
if(s>0)return a[s-1]
throw A.f(A.ae())},
gaf(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.f(A.ae())
throw A.f(A.j8())},
b6(a,b,c){a.$flags&1&&A.d(a,18)
A.bb(b,c,a.length)
a.splice(b,c-b)},
ac(a,b,c,d){var s
a.$flags&2&&A.d(a,"fillRange")
A.bb(b,c,a.length)
A.a3(a).c.a(d)
for(s=b;s<c;++s)a[s]=d},
aq(a,b){var s,r
A.a3(a).i("q(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.f(A.aF(a))}return!1},
ab(a,b){var s,r
A.a3(a).i("q(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.f(A.aF(a))}return!0},
gS(a){return a.length===0},
gcp(a){return a.length!==0},
t(a){return A.j9(a,"[","]")},
gD(a){return new J.bI(a,a.length,A.a3(a).i("bI<1>"))},
gX(a){return A.cX(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.d(a,"set length","change the length of")
if(b<0)throw A.f(A.ar(b,0,null,"newLength",null))
if(b>a.length)A.a3(a).c.a(null)
a.length=b},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eO(a,b))
return a[b]},
q(a,b,c){A.a3(a).c.a(c)
a.$flags&2&&A.d(a)
if(!(b>=0&&b<a.length))throw A.f(A.eO(a,b))
a[b]=c},
$im:1,
$it:1}
J.dO.prototype={
hO(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.e2(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.f5.prototype={}
J.bI.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.Z(q)
throw A.f(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iaf:1}
J.cK.prototype={
cf(a,b){var s
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gco(b)
if(this.gco(a)===s)return 0
if(this.gco(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gco(a){return a===0?1/a<0:a<0},
M(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.f(A.aQ(""+a+".toInt()"))},
W(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.f(A.aQ(""+a+".ceil()"))},
P(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.f(A.aQ(""+a+".floor()"))},
H(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.f(A.aQ(""+a+".round()"))},
ef(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
F(a,b,c){if(this.cf(b,c)>0)throw A.f(A.ir(b))
if(this.cf(a,b)<0)return b
if(this.cf(a,c)>0)return c
return a},
t(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gX(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
T(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a_(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dC(a,b)},
J(a,b){return(a|0)===a?a/b|0:this.dC(a,b)},
dC(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.f(A.aQ("Result of truncating division is "+A.w(s)+": "+A.w(a)+" ~/ "+b))},
a9(a,b){if(b<0)throw A.f(A.ir(b))
return b>31?0:a<<b>>>0},
ds(a,b){return b>31?0:a<<b>>>0},
K(a,b){var s
if(a>0)s=this.c2(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
c2(a,b){return b>31?0:a>>>b},
er(a,b){if(b<0)throw A.f(A.ir(b))
return this.dt(a,b)},
dt(a,b){if(b>31)return 0
return a>>>b},
gY(a){return A.c5(t.q)},
$ii:1,
$ic8:1}
J.cI.prototype={
aK(a,b){var s=this.a9(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
gY(a){return A.c5(t.S)},
$iA:1,
$ib:1}
J.dP.prototype={
gY(a){return A.c5(t.i)},
$iA:1}
J.cc.prototype={
es(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bJ(a,b,c){return a.substring(b,A.bb(b,c,a.length))},
ev(a,b){return this.bJ(a,b,null)},
hL(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.mm(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.mn(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
ah(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.f(B.Q)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
t(a){return a},
gX(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gY(a){return A.c5(t.N)},
gk(a){return a.length},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eO(a,b))
return a[b]},
$iA:1,
$ifn:1,
$ip:1}
A.b6.prototype={
t(a){return"LateInitializationError: "+this.a}}
A.iE.prototype={
$0(){var s=new A.L($.F,t.U)
s.bM(null)
return s},
$S:28}
A.fw.prototype={}
A.aZ.prototype={}
A.ag.prototype={
gD(a){var s=this
return new A.bP(s,s.gk(s),A.o(s).i("bP<ag.E>"))},
gS(a){return this.gk(this)===0}}
A.bP.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s,r=this,q=r.a,p=J.V(q),o=p.gk(q)
if(r.b!==o)throw A.f(A.aF(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.aH(q,s);++r.c
return!0},
$iaf:1}
A.a0.prototype={
gk(a){return J.aL(this.a)},
aH(a,b){return this.b.$1(J.lZ(this.a,b))}}
A.bT.prototype={
gD(a){return new A.d4(J.cA(this.a),this.b,this.$ti.i("d4<1>"))}}
A.d4.prototype={
u(){var s,r
for(s=this.a,r=this.b;s.u();)if(r.$1(s.gB()))return!0
return!1},
gB(){return this.a.gB()},
$iaf:1}
A.H.prototype={
dJ(a,b){return A.r(A.aQ("Cannot "+b+" a fixed-length list"))},
sk(a,b){this.dJ(a,"change the length of")},
m(a,b){A.bo(a).i("H.E").a(b)
return this.dJ(a,"add to")}}
A.bS.prototype={
q(a,b,c){A.o(this).i("bS.E").a(c)
throw A.f(A.aQ("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.f(A.aQ("Cannot change the length of an unmodifiable list"))},
m(a,b){A.o(this).i("bS.E").a(b)
throw A.f(A.aQ("Cannot add to an unmodifiable list"))}}
A.dd.prototype={$r:"+(1)",$s:1}
A.cp.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:16}
A.de.prototype={$r:"+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(1,2,3,4,5,6,7,8,9,10)",$s:17}
A.df.prototype={$r:"+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(1,2,3,4,5,6,7,8,9,10,11,12)",$s:19}
A.cq.prototype={$r:"+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13)",$s:20}
A.dg.prototype={$r:"+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)",$s:21}
A.x.prototype={$r:"+(1,2)",$s:2}
A.dh.prototype={$r:"+calls,copiedBytes(1,2)",$s:3}
A.aC.prototype={$r:"+(1,2,3)",$s:4}
A.di.prototype={$r:"+contentKey,requestId(1,2,3)",$s:5}
A.cr.prototype={$r:"+entryKey,workerRamBytes(1,2,3)",$s:6}
A.c0.prototype={$r:"+message,requestId(1,2,3)",$s:7}
A.cs.prototype={$r:"+requestId,workerRamBytes(1,2,3)",$s:8}
A.b3.prototype={$r:"+(1,2,3,4)",$s:11}
A.dj.prototype={$r:"+bytes,contentKey,useSimd(1,2,3,4)",$s:12}
A.ct.prototype={$r:"+compressedBytes,crc31,entryDiskBytes,fpHi,fpLo(1,2,3,4,5)",$s:14}
A.dk.prototype={$r:"+deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes(1,2,3,4,5)",$s:13}
A.bB.prototype={$r:"+(1,2,3,4,5,6)",$s:15}
A.d7.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iaf:1}
A.cE.prototype={
m(a,b){A.o(this).c.a(b)
A.mc()}}
A.R.prototype={
gk(a){return this.b},
gD(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.d7(s,s.length,r.$ti.i("d7<1>"))},
al(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.fo.prototype={
$0(){return B.c.P(1000*this.a.now())},
$S:3}
A.d_.prototype={}
A.fI.prototype={
am(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
if(p==null)return null
s=Object.create(null)
r=q.b
if(r!==-1)s.arguments=p[r+1]
r=q.c
if(r!==-1)s.argumentsExpr=p[r+1]
r=q.d
if(r!==-1)s.expr=p[r+1]
r=q.e
if(r!==-1)s.method=p[r+1]
r=q.f
if(r!==-1)s.receiver=p[r+1]
return s}}
A.cV.prototype={
t(a){return"Null check operator used on a null value"}}
A.dR.prototype={
t(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.eg.prototype={
t(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.fm.prototype={
t(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cF.prototype={}
A.dn.prototype={
t(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iaA:1}
A.br.prototype={
t(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.ls(r==null?"unknown":r)+"'"},
$ibJ:1,
ghR(){return this},
$C:"$1",
$R:1,
$D:null}
A.dE.prototype={$C:"$0",$R:0}
A.dF.prototype={$C:"$2",$R:2}
A.ec.prototype={}
A.e7.prototype={
t(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.ls(s)+"'"}}
A.cb.prototype={
G(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.cb))return!1
return this.$_target===b.$_target&&this.a===b.a},
gX(a){return(A.iF(this.a)^A.cX(this.$_target))>>>0},
t(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.e2(this.a)+"'")}}
A.e5.prototype={
t(a){return"RuntimeError: "+this.a}}
A.eE.prototype={
t(a){return"Assertion failed: Reached dead code"}}
A.b5.prototype={
gk(a){return this.a},
gS(a){return this.a===0},
gar(){return new A.P(this,A.o(this).i("P<1>"))},
aG(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.hp(a)},
hp(a){var s=this.d
if(s==null)return!1
return this.b3(this.d0(s,a),a)>=0},
ak(a,b){A.o(this).i("ak<1,2>").a(b).aJ(0,new A.f6(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hq(b)},
hq(a){var s,r,q=this.d
if(q==null)return null
s=this.d0(q,a)
r=this.b3(s,a)
if(r<0)return null
return s[r].b},
q(a,b,c){var s,r,q,p,o,n,m=this,l=A.o(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cI(s==null?m.b=m.bU():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cI(r==null?m.c=m.bU():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.bU()
p=m.bx(b)
o=q[p]
if(o==null)q[p]=[m.bL(b,c)]
else{n=m.b3(o,b)
if(n>=0)o[n].b=c
else o.push(m.bL(b,c))}}},
ec(a,b){var s,r,q=this,p=A.o(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aG(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.q(0,a,r)
return r},
A(a,b){var s=this
if(typeof b=="string")return s.cJ(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cJ(s.c,b)
else return s.hr(b)},
hr(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bx(a)
r=n[s]
q=o.b3(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.cK(p)
if(r.length===0)delete n[s]
return p.b},
l(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bK()}},
aJ(a,b){var s,r,q=this
A.o(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.f(A.aF(q))
s=s.c}},
cI(a,b,c){var s,r=A.o(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bL(b,c)
else s.b=c},
cJ(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.cK(s)
delete a[b]
return s.b},
bK(){this.r=this.r+1&1073741823},
bL(a,b){var s=this,r=A.o(s),q=new A.fb(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bK()
return q},
cK(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bK()},
bx(a){return J.au(a)&1073741823},
d0(a,b){return a[this.bx(b)]},
b3(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1},
t(a){return A.kj(this)},
bU(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ijc:1}
A.f6.prototype={
$2(a,b){var s=this.a,r=A.o(s)
s.q(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.o(this.a).i("~(1,2)")}}
A.fb.prototype={}
A.P.prototype={
gk(a){return this.a.a},
gS(a){return this.a.a===0},
gD(a){var s=this.a
return new A.bN(s,s.r,s.e,this.$ti.i("bN<1>"))}}
A.bN.prototype={
gB(){return this.d},
u(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.aF(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iaf:1}
A.bO.prototype={
gk(a){return this.a.a},
gS(a){return this.a.a===0},
gD(a){var s=this.a
return new A.aM(s,s.r,s.e,this.$ti.i("aM<1>"))}}
A.aM.prototype={
gB(){return this.d},
u(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.aF(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iaf:1}
A.bM.prototype={
gk(a){return this.a.a},
gS(a){return this.a.a===0},
gD(a){var s=this.a
return new A.cL(s,s.r,s.e,this.$ti.i("cL<1,2>"))}}
A.cL.prototype={
gB(){var s=this.d
s.toString
return s},
u(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.aF(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.bv(s.a,s.b,r.$ti.i("bv<1,2>"))
r.c=s.c
return!0}},
$iaf:1}
A.aj.prototype={
bx(a){return A.iF(a)&1073741823},
b3(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.iw.prototype={
$1(a){return this.a(a)},
$S:25}
A.ix.prototype={
$2(a,b){return this.a(a,b)},
$S:16}
A.iy.prototype={
$1(a){return this.a(A.G(a))},
$S:21}
A.Q.prototype={
t(a){return this.dF(!1)},
dF(a){var s,r,q,p,o,n=this.f4(),m=this.aW(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.kn(o):l+A.w(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
f4(){var s,r=this.$s
while($.hW.length<=r)B.b.m($.hW,null)
s=$.hW[r]
if(s==null){s=this.eU()
B.b.q($.hW,r,s)}return s},
eU(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.h(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.b.q(k,q,r[s])}}k=A.ms(k,!1,t.K)
k.$flags=3
return k}}
A.c_.prototype={
aW(){return[this.a,this.b]},
G(a,b){if(b==null)return!1
return b instanceof A.c_&&this.$s===b.$s&&J.l(this.a,b.a)&&J.l(this.b,b.b)},
gX(a){return A.e_(this.$s,this.a,this.b,B.m)}}
A.co.prototype={
aW(){return[this.a]},
G(a,b){if(b==null)return!1
return b instanceof A.co&&this.$s===b.$s&&J.l(this.a,b.a)},
gX(a){return A.e_(this.$s,this.a,B.m,B.m)}}
A.b2.prototype={
aW(){return[this.a,this.b,this.c]},
G(a,b){var s=this
if(b==null)return!1
return b instanceof A.b2&&s.$s===b.$s&&J.l(s.a,b.a)&&J.l(s.b,b.b)&&J.l(s.c,b.c)},
gX(a){var s=this
return A.e_(s.$s,s.a,s.b,s.c)}}
A.am.prototype={
aW(){return this.a},
G(a,b){if(b==null)return!1
return b instanceof A.am&&this.$s===b.$s&&A.nb(this.a,b.a)},
gX(a){return A.e_(this.$s,A.mA(this.a),B.m,B.m)}}
A.dQ.prototype={
t(a){return"RegExp/"+this.a+"/"+this.b.flags},
gfh(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.kf(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
e3(a){var s=this.b.exec(a)
if(s==null)return null
return new A.d8(s)},
dO(a,b){return new A.ei(this,b,0)},
f2(a,b){var s,r=this.gfh()
if(r==null)r=A.aV(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.d8(s)},
$ifn:1,
$imI:1}
A.d8.prototype={
h(a,b){var s
A.j(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$ie3:1}
A.ei.prototype={
gD(a){return new A.cj(this.a,this.b,this.c)}}
A.cj.prototype={
gB(){var s=this.d
return s==null?t.d.a(s):s},
u(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.f2(l,s)
if(p!=null){m.d=p
s=p.b
o=s.index
n=o+s[0].length
if(o===n){s=!1
if(q.b.unicode){q=m.c
o=q+1
if(o<r){if(!(q>=0&&q<r))return A.a(l,q)
q=l.charCodeAt(q)
if(q>=55296&&q<=56319){if(!(o>=0))return A.a(l,o)
s=l.charCodeAt(o)
s=s>=56320&&s<=57343}}}n=(s?n+1:n)+1}m.c=n
return!0}}m.b=m.d=null
return!1},
$iaf:1}
A.fV.prototype={
ap(){var s=this.b
if(s===this)throw A.f(new A.b6("Local '' has not been initialized."))
return s},
se2(a){if(this.b!==this)throw A.f(new A.b6("Local '' has already been initialized."))
this.b=a}}
A.bw.prototype={
gY(a){return B.b6},
bv(a,b,c){A.bm(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dT(a){return this.bv(a,0,null)},
dS(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dR(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dQ(a,b,c){if(B.a.T(b,16)!==0)A.r(A.ko("Offset ("+b+") must be a multiple of BYTES_PER_ELEMENT (16)"))
return new A.cN(A.my(a,b,(c==null?B.a.J(a.byteLength-b,16):c)*4))},
dP(a,b,c){A.bm(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iA:1,
$ibw:1}
A.cd.prototype={$icd:1}
A.cN.prototype={
gY(a){return B.b9},
gk(a){return this.a.length/4|0},
h(a,b){var s,r,q,p,o,n,m
A.j(b)
s=this.a
r=s.length
A.aW(b,this,r/4|0)
q=b*4
if(!(q>=0&&q<r))return A.a(s,q)
p=s[q]
o=q+1
if(!(o<r))return A.a(s,o)
n=s[o]
o=q+2
if(!(o<r))return A.a(s,o)
m=s[o]
q+=3
if(!(q<r))return A.a(s,q)
return new A.aN(p,n,m,s[q])},
q(a,b,c){var s,r,q,p
t.Y.a(c)
s=this.a
r=s.length
A.aW(b,this,r/4|0)
q=b*4
s.$flags&2&&A.d(s)
if(!(q>=0&&q<r))return A.a(s,q)
s[q]=c.a
p=q+1
if(!(p<r))return A.a(s,p)
s[p]=c.b
p=q+2
if(!(p<r))return A.a(s,p)
s[p]=c.c
q+=3
if(!(q<r))return A.a(s,q)
s[q]=c.d},
$iA:1,
$im:1,
$it:1,
$iK:1,
$ieX:1}
A.eD.prototype={}
A.cS.prototype={
ga7(a){if(((a.$flags|0)&2)!==0)return new A.i6(a.buffer)
else return a.buffer},
fe(a,b,c,d){var s=A.ar(b,0,c,d,null)
throw A.f(s)},
cQ(a,b,c,d){if(b>>>0!==b||b>c)this.fe(a,b,c,d)},
$iK:1}
A.i6.prototype={
bv(a,b,c){var s=A.jf(this.a,b,c)
s.$flags=3
return s},
dT(a){return this.bv(0,0,null)},
dS(a,b,c){var s=A.je(this.a,b,c)
s.$flags=3
return s},
dR(a,b,c){var s=A.jd(this.a,b,c)
s.$flags=3
return s},
dQ(a,b,c){return new A.eD(J.iX(this.a,b,c).a)},
dP(a,b,c){var s=A.mv(this.a,b,c)
s.$flags=3
return s}}
A.dU.prototype={
gY(a){return B.b7},
$iA:1}
A.ab.prototype={
gk(a){return a.length},
dr(a,b,c,d,e){var s,r,q=a.length
this.cQ(a,b,q,"start")
this.cQ(a,c,q,"end")
if(b>c)throw A.f(A.ar(b,0,c,null,null))
s=c-b
if(e<0)throw A.f(A.ao(e,null))
r=d.length
if(r-e<s)throw A.f(A.as("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iay:1}
A.cQ.prototype={
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
q(a,b,c){A.W(c)
a.$flags&2&&A.d(a)
A.aW(b,a,a.length)
a[b]=c},
N(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.d(a,5)
this.dr(a,b,c,d,e)
return},
C(a,b,c,d){return this.N(a,b,c,d,0)},
$im:1,
$it:1}
A.cR.prototype={
q(a,b,c){A.j(c)
a.$flags&2&&A.d(a)
A.aW(b,a,a.length)
a[b]=c},
N(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.d(a,5)
this.dr(a,b,c,d,e)
return},
C(a,b,c,d){return this.N(a,b,c,d,0)},
$im:1,
$it:1}
A.ce.prototype={
gY(a){return B.b8},
$iA:1,
$ice:1,
$ibs:1}
A.cO.prototype={
gY(a){return B.ba},
$iA:1,
$ieY:1}
A.dW.prototype={
gY(a){return B.bb},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iA:1}
A.cP.prototype={
gY(a){return B.bc},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iA:1,
$ij7:1}
A.dY.prototype={
gY(a){return B.bd},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iA:1}
A.dZ.prototype={
gY(a){return B.bf},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iA:1,
$ijq:1}
A.cT.prototype={
gY(a){return B.bg},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iA:1,
$ifK:1}
A.cU.prototype={
gY(a){return B.bh},
gk(a){return a.length},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iA:1}
A.bQ.prototype={
gY(a){return B.bi},
gk(a){return a.length},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iA:1,
$ibQ:1,
$iaP:1}
A.aN.prototype={
ah(a,b){var s,r,q,p,o=this
t.Y.a(b)
s=$.dB()
s.$flags&2&&A.d(s)
s[0]=o.a*b.a
r=s[0]
s[0]=o.b*b.b
q=s[0]
s[0]=o.c*b.c
p=s[0]
s[0]=o.d*b.d
return new A.aN(r,q,p,s[0])},
cG(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.dB()
k.$flags&2&&A.d(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.aN(s,r,q,k[0])},
t(a){return"V128"},
$iaa:1}
A.ex.prototype={}
A.ey.prototype={}
A.d9.prototype={}
A.da.prototype={}
A.db.prototype={}
A.dc.prototype={}
A.eG.prototype={}
A.aO.prototype={
i(a){return A.dv(v.typeUniverse,this,a)},
a3(a){return A.kP(v.typeUniverse,this,a)}}
A.es.prototype={}
A.i4.prototype={
t(a){return A.an(this.a,null)}}
A.ep.prototype={
t(a){return this.a}}
A.cu.prototype={$ibe:1}
A.fR.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:7}
A.fQ.prototype={
$1(a){var s,r
this.a.a=t.O.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:42}
A.fS.prototype={
$0(){this.a.$0()},
$S:8}
A.fT.prototype={
$0(){this.a.$0()},
$S:8}
A.i1.prototype={
eA(a,b){if(self.setTimeout!=null)self.setTimeout(A.dA(new A.i2(this,b),0),a)
else throw A.f(A.aQ("`setTimeout()` not found."))}}
A.i2.prototype={
$0(){this.b.$0()},
$S:0}
A.ej.prototype={}
A.ie.prototype={
$1(a){return this.a.$2(0,a)},
$S:4}
A.ig.prototype={
$2(a,b){this.a.$2(1,new A.cF(a,t.l.a(b)))},
$S:36}
A.iq.prototype={
$2(a,b){this.a(A.j(a),b)},
$S:38}
A.av.prototype={
t(a){return A.w(this.a)},
$iN:1,
gaU(){return this.b}}
A.en.prototype={
dY(a){var s=this.a
if((s.a&30)!==0)throw A.f(A.as("Future already completed"))
s.be(A.nT(a,null))}}
A.d5.prototype={}
A.bg.prototype={
hx(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.bt(s,t.al.a(this.d),a.a,t.y,t.K)},
hj(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.fJ(l,q,m,a.b,o,n,t.l)
else p=l.bt(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.E.b(A.ah(s))){if((r.c&1)!==0)throw A.f(A.ao("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.f(A.ao("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.L.prototype={
ct(a,b,c){var s,r,q,p=this.$ti
p.a3(c).i("1/(2)").a(a)
s=$.F
if(s===B.j){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.f(A.k3(b,"onError",u.c))}else{r=p.c
a=s.br(s,c.i("@<0/>").a3(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.od(b,s)}q=new A.L(s,c.i("L<0>"))
r=b==null?1:3
this.bd(new A.bg(q,r,a,b,p.i("@<1>").a3(c).i("bg<1,2>")))
return q},
dD(a,b,c){var s,r=this.$ti
r.a3(c).i("1/(2)").a(a)
s=new A.L($.F,c.i("L<0>"))
this.bd(new A.bg(s,19,a,b,r.i("@<1>").a3(c).i("bg<1,2>")))
return s},
cw(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.F
q=new A.L(r,s)
if(r!==B.j)a=r.bq(r,a,t.z)
this.bd(new A.bg(q,8,a,null,s.i("bg<1,1>")))
return q},
fK(a){this.a=this.a&1|16
this.c=a},
bg(a){this.a=a.a&30|this.a&1
this.c=a.c},
bd(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.bd(a)
return}r.bg(s)}q=r.b
q.aZ(q,new A.hu(r,a))}},
dj(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.dj(a)
return}m.bg(n)}l.a=m.bs(a)
s=m.b
s.aZ(s,new A.hy(l,m))}},
aY(){var s=t.F.a(this.c)
this.c=null
return this.bs(s)},
bs(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
cT(a){var s,r=this
r.$ti.c.a(a)
s=r.aY()
r.a=8
r.c=a
A.bX(r,s)},
eT(a){var s=this.aY()
this.bg(a)
A.bX(this,s)},
bh(a){var s=this.aY()
this.fK(a)
A.bX(this,s)},
eS(a,b){A.aV(a)
t.l.a(b)
this.bh(new A.av(a,b))},
bM(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("aw<1>").b(a)){this.cP(a)
return}this.eO(a)},
eO(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.aZ(s,new A.hw(r,a))},
cP(a){A.jt(this.$ti.i("aw<1>").a(a),this,!1)
return},
be(a){var s
this.a^=2
s=this.b
s.aZ(s,new A.hv(this,a))},
$iaw:1}
A.hu.prototype={
$0(){A.bX(this.a,this.b)},
$S:0}
A.hy.prototype={
$0(){A.bX(this.b,this.a.a)},
$S:0}
A.hx.prototype={
$0(){A.jt(this.a.a,this.b,!0)},
$S:0}
A.hw.prototype={
$0(){this.a.cT(this.b)},
$S:0}
A.hv.prototype={
$0(){this.a.bh(this.b)},
$S:0}
A.hB.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bu(p,t.fO.a(q.d),t.z)}catch(o){s=A.ah(o)
r=A.bn(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.j1(q)
n=k.a
n.c=new A.av(q,p)
q=n}q.b=!0
return}if(j instanceof A.L&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.L){m=k.b.a
l=new A.L(m.b,m.$ti)
j.ct(new A.hC(l,m),new A.hD(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.hC.prototype={
$1(a){this.a.eT(this.b)},
$S:7}
A.hD.prototype={
$2(a,b){A.aV(a)
t.l.a(b)
this.a.bh(new A.av(a,b))},
$S:54}
A.hA.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.bt(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.ah(k)
r=A.bn(k)
q=s
p=r
if(p==null)p=A.j1(q)
o=this.a
o.c=new A.av(q,p)
o.b=!0}},
$S:0}
A.hz.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.hx(s)&&p.a.e!=null){p.c=p.a.hj(s)
p.b=!1}}catch(o){r=A.ah(o)
q=A.bn(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.j1(p)
m=l.b
m.c=new A.av(p,n)
p=m}p.b=!0}},
$S:0}
A.ek.prototype={}
A.d1.prototype={
gk(a){var s={},r=new A.L($.F,t.fJ)
s.a=0
this.e8(new A.fz(s,this),!0,new A.fA(s,r),r.geR())
return r}}
A.fz.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.fA.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.aY()
r.c.a(q)
s.a=8
s.c=q
A.bX(s,p)},
$S:0}
A.dp.prototype={
gft(){var s,r=this
if((r.b&8)===0)return A.o(r).i("aS<1>?").a(r.a)
s=A.o(r)
return s.i("aS<1>?").a(s.i("dq<1>").a(r.a).gc9())},
cY(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aS(A.o(q).i("aS<1>"))
return A.o(q).i("aS<1>").a(s)}r=A.o(q)
s=r.i("dq<1>").a(q.a).gc9()
return r.i("aS<1>").a(s)},
gdz(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gc9()
return A.o(this).i("cm<1>").a(s)},
cO(){if((this.b&4)!==0)return new A.by("Cannot add event after closing")
return new A.by("Cannot add event while adding a stream")},
cX(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.jS():new A.L($.F,t.U)
return s},
cd(){var s=this,r=s.b
if((r&4)!==0)return s.cX()
if(r>=4)throw A.f(s.cO())
r=s.b=r|4
if((r&1)!==0)s.c1()
else if((r&3)===0)s.cY().m(0,B.A)
return s.cX()},
fN(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.o(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.f(A.as("Stream has already been listened to."))
s=h.c
r=$.F
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.br(r,t.a7.a3(s).i("1(2)").a(a),o,s)
A.n_(r,b)
n=c==null?A.or():c
m=t.O
l=new A.cm(i,s,r.bq(r,m.a(n),o),r,q|p,h.i("cm<1>"))
k=i.gft()
if(((i.b|=1)&8)!==0){j=h.i("dq<1>").a(i.a)
j.sc9(l)
j.hG()}else i.a=l
l.fL(k)
h=m.a(new A.hZ(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cR((s&4)!==0)
return l},
fB(a){var s,r,q,p,o,n,m,l,k=this,j=A.o(k)
j.i("e8<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("dq<1>").a(k.a).hV()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.L)s=q}catch(n){p=A.ah(n)
o=A.bn(n)
m=new A.L($.F,t.U)
j=A.aV(p)
l=t.l.a(o)
m.be(new A.av(j,l))
s=m}else s=s.cw(r)
j=new A.hY(k)
if(s!=null)s=s.cw(j)
else j.$0()
return s},
$ikq:1,
$ikJ:1,
$ibW:1,
$ifx:1}
A.hZ.prototype={
$0(){A.jG(this.a.d)},
$S:0}
A.hY.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bM(null)},
$S:0}
A.el.prototype={
c0(a){var s=this.$ti
s.c.a(a)
this.gdz().cN(new A.bV(a,s.i("bV<1>")))},
c1(){this.gdz().cN(B.A)}}
A.ck.prototype={}
A.cl.prototype={
gX(a){return(A.cX(this.a)^892482866)>>>0},
G(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.cl&&b.a===this.a}}
A.cm.prototype={
de(){return this.w.fB(this)},
df(){var s=this.w,r=A.o(s)
r.i("e8<1>").a(this)
if((s.b&8)!==0)r.i("dq<1>").a(s.a).hZ()
A.jG(s.e)},
dg(){var s=this.w,r=A.o(s)
r.i("e8<1>").a(this)
if((s.b&8)!==0)r.i("dq<1>").a(s.a).hG()
A.jG(s.f)}}
A.d6.prototype={
fL(a){var s=this
A.o(s).i("aS<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bH(s)}},
df(){},
dg(){},
de(){return null},
cN(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aS(A.o(r).i("aS<1>"))
q.m(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bH(r)}},
c0(a){var s,r=this,q=A.o(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.hI(r.a,a,q)
r.e&=4294967231
r.cR((s&4)!==0)},
c1(){var s,r=this,q=new A.fU(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.de()
r.e|=16
if(p!=null&&p!==$.jS())p.cw(q)
else q.$0()},
cR(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=p&4294967167
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p&=4294967291
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=p^64
if(r)q.df()
else q.dg()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bH(q)},
$ie8:1,
$ibW:1}
A.fU.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.hH(s.c)
s.e&=4294967231},
$S:0}
A.dr.prototype={
e8(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.fN(s.i("~(1)?").a(a),d,c,b===!0)},
hu(a){return this.e8(a,null,null,null)}}
A.bA.prototype={
sb4(a){this.a=t.ev.a(a)},
gb4(){return this.a}}
A.bV.prototype={
ea(a){this.$ti.i("bW<1>").a(a).c0(this.b)}}
A.eo.prototype={
ea(a){a.c1()},
gb4(){return null},
sb4(a){throw A.f(A.as("No events after a done."))},
$ibA:1}
A.aS.prototype={
bH(a){var s,r=this
r.$ti.i("bW<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.oT(new A.hV(r,a))
r.a=1},
m(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sb4(b)
s.c=b}}}
A.hV.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("bW<1>").a(this.b)
r=p.b
q=r.gb4()
p.b=q
if(q==null)p.c=null
r.ea(s)},
$S:0}
A.eA.prototype={}
A.fO.prototype={
hH(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.bu(o,a,t.H)
return q}catch(p){s=A.ah(p)
r=A.bn(p)
o.aX(o,s,r)}},
hI(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.bt(o,a,b,t.H,c)
return q}catch(p){s=A.ah(p)
r=A.bn(p)
o.aX(o,s,r)}},
fY(a,b){return new A.fP(this,this.bq(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.ghY(null).h(0,b)
return s}return null},
aX(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.of(b,c)
return}r=s.gcz()
q=r.ghU()
p=$.F
try{$.F=q
s.hi(r,r.gbW(),a,b,c)
$.F=p}catch(m){o=A.ah(m)
n=A.bn(m)
$.F=p
l=b===o?c:n
q.aX(r,o,l)}},
bu(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.F
if(r===a)return b.$0()
s=r
$.F=a
try{r=b.$0()
return r}finally{$.F=s}q=null.gcz()
return null.hW(q,q.gbW(),a,b)},
bt(a,b,c,d,e){var s,r,q
d.i("@<0>").a3(e).i("1(2)").a(b)
e.a(c)
r=$.F
if(r===a)return b.$1(c)
s=r
$.F=a
try{r=b.$1(c)
return r}finally{$.F=s}q=null.gcz()
return null.hi(q,q.gbW(),a,b,c)},
fJ(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").a3(f).a3(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.F
if(r===a)return b.$2(c,d)
s=r
$.F=a
try{r=b.$2(c,d)
return r}finally{$.F=s}q=null.gcz()
return null.hX(q,q.gbW(),a,b,c,d)},
bq(a,b,c){c.i("0()").a(b)
return b},
br(a,b,c,d){c.i("@<0>").a3(d).i("1(2)").a(b)
return b},
bZ(a,b,c,d,e){c.i("@<0>").a3(d).a3(e).i("1(2,3)").a(b)
return b},
f0(a,b,c){return null},
aZ(a,b){A.jF(a,t.O.a(b))
return}}
A.fP.prototype={
$0(){var s=this.a
return s.bu(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.io.prototype={
$0(){A.me(this.a,this.b)},
$S:0}
A.bi.prototype={
gD(a){var s=this,r=new A.bj(s,s.r,A.o(s).i("bj<1>"))
r.c=s.e
return r},
gk(a){return this.a},
al(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.eV(b)},
eV(a){var s=this.d
if(s==null)return!1
return this.bo(s[this.bi(a)],a)>=0},
ga5(a){var s=this.e
if(s==null)throw A.f(A.as("No elements"))
return A.o(this).c.a(s.a)},
m(a,b){var s,r,q=this
A.o(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cM(s==null?q.b=A.jv():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cM(r==null?q.c=A.jv():r,b)}else return q.eK(b)},
eK(a){var s,r,q,p=this
A.o(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.jv()
r=p.bi(a)
q=s[r]
if(q==null)s[r]=[p.bV(a)]
else{if(p.bo(q,a)>=0)return!1
q.push(p.bV(a))}return!0},
A(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.dl(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.dl(s.c,b)
else return s.fD(b)},
fD(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bi(a)
r=n[s]
q=o.bo(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dI(p)
return!0},
f5(a,b){var s,r,q,p,o,n=this,m=A.o(n)
m.i("q(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.f(A.aF(n))
if(!0===o)n.A(0,r)}},
l(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bT()}},
cM(a,b){A.o(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.bV(b)
return!0},
dl(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dI(s)
delete a[b]
return!0},
bT(){this.r=this.r+1&1073741823},
bV(a){var s,r=this,q=new A.ew(A.o(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.bT()
return q},
dI(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.bT()},
bi(a){return J.au(a)&1073741823},
bo(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.bY.prototype={
bi(a){return A.iF(a)&1073741823},
bo(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.ew.prototype={}
A.bj.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.f(A.aF(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$iaf:1}
A.B.prototype={
gD(a){return new A.bP(a,this.gk(a),A.bo(a).i("bP<B.E>"))},
aH(a,b){return this.h(a,b)},
gS(a){return this.gk(a)===0},
gcp(a){return!this.gS(a)},
ga5(a){if(this.gk(a)===0)throw A.f(A.ae())
return this.h(a,0)},
gad(a){if(this.gk(a)===0)throw A.f(A.ae())
return this.h(a,this.gk(a)-1)},
gaf(a){if(this.gk(a)===0)throw A.f(A.ae())
if(this.gk(a)>1)throw A.f(A.j8())
return this.h(a,0)},
aq(a,b){var s,r
A.bo(a).i("q(B.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.f(A.aF(a))}return!1},
m(a,b){var s
A.bo(a).i("B.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.q(a,s,b)},
ac(a,b,c,d){var s,r,q=A.bo(a)
q.i("B.E?").a(d)
s=d==null?q.i("B.E").a(d):d
A.bb(b,c,this.gk(a))
for(r=b;r<c;++r)this.q(a,r,s)},
t(a){return A.j9(a,"[","]")}}
A.I.prototype={
aJ(a,b){var s,r,q,p=A.o(this)
p.i("~(I.K,I.V)").a(b)
for(s=this.gar(),s=s.gD(s),p=p.i("I.V");s.u();){r=s.gB()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ak(a,b){A.o(this).i("ak<I.K,I.V>").a(b).aJ(0,new A.fe(this))},
bB(a,b){var s,r,q,p,o,n=this,m=A.o(n)
m.i("q(I.K,I.V)").a(b)
s=A.h([],m.i("y<I.K>"))
for(r=n.gar(),r=r.gD(r),m=m.i("I.V");r.u();){q=r.gB()
p=n.h(0,q)
if(b.$2(q,p==null?m.a(p):p))B.b.m(s,q)}for(m=s.length,o=0;o<s.length;s.length===m||(0,A.Z)(s),++o)n.A(0,s[o])},
gk(a){var s=this.gar()
return s.gk(s)},
gS(a){var s=this.gar()
return s.gS(s)},
t(a){return A.kj(this)},
$iak:1}
A.fe.prototype={
$2(a,b){var s=this.a,r=A.o(s)
s.q(0,r.i("I.K").a(a),r.i("I.V").a(b))},
$S(){return A.o(this.a).i("~(I.K,I.V)")}}
A.ff.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.w(a)
r.a=(r.a+=s)+": "
s=A.w(b)
r.a+=s},
$S:66}
A.bc.prototype={
ak(a,b){var s
A.o(this).i("m<1>").a(b)
for(s=b.gD(b);s.u();)this.m(0,s.gB())},
t(a){return A.j9(this,"{","}")},
$im:1,
$ib_:1}
A.dl.prototype={}
A.eu.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fu(b):s}},
gk(a){return this.b==null?this.c.a:this.aM().length},
gS(a){return this.gk(0)===0},
gar(){if(this.b==null){var s=this.c
return new A.P(s,A.o(s).i("P<1>"))}return new A.ev(this)},
q(a,b,c){var s,r,q=this
A.G(b)
if(q.b==null)q.c.q(0,b,c)
else if(q.aG(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.dK().q(0,b,c)},
ak(a,b){t.P.a(b).aJ(0,new A.hN(this))},
aG(a){if(this.b==null)return this.c.aG(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
A(a,b){if(this.b!=null&&!this.aG(b))return null
return this.dK().A(0,b)},
l(a){var s,r=this
if(r.b==null)r.c.l(0)
else{if(r.c!=null)B.b.l(r.aM())
r.a=r.b=null
s=t.z
r.c=A.a5(s,s)}},
aJ(a,b){var s,r,q,p,o=this
t.cA.a(b)
if(o.b==null)return o.c.aJ(0,b)
s=o.aM()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.ih(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.f(A.aF(o))}},
aM(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.h(Object.keys(this.a),t.s)
return s},
dK(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.a5(t.N,t.z)
r=n.aM()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.q(0,o,n.h(0,o))}if(p===0)B.b.m(r,"")
else B.b.l(r)
n.a=n.b=null
return n.c=s},
fu(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.ih(this.a[a])
return this.b[a]=s}}
A.hN.prototype={
$2(a,b){this.a.q(0,A.G(a),b)},
$S:73}
A.ev.prototype={
gk(a){return this.a.gk(0)},
aH(a,b){var s=this.a
if(s.b==null)s=s.gar().aH(0,b)
else{s=s.aM()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gD(a){var s=this.a
if(s.b==null){s=s.gar()
s=s.gD(s)}else{s=s.aM()
s=new J.bI(s,s.length,A.a3(s).i("bI<1>"))}return s}}
A.i8.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:10}
A.i7.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:10}
A.dG.prototype={}
A.dI.prototype={}
A.dS.prototype={
e_(a,b){var s=A.o9(a,this.gh8().a)
return s},
gh8(){return B.a9}}
A.f7.prototype={}
A.eF.prototype={
cU(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.bb(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.np(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.no(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bO(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.nq(o)
l.b=0
throw A.f(A.O(m,a,p+l.c))}return n},
bO(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.J(b+c,2)
r=q.bO(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bO(a,s,c,d)}return q.h2(a,b,c,d)},
h2(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.ch(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.cY(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.cY(h)
e.a+=p
break
case 65:p=A.cY(h)
e.a+=p;--d
break
default:p=A.cY(h)
e.a=(e.a+=p)+p
break}else{k.b=g
k.c=d-1
return""}g=0}if(d===a0)break A
o=d+1
if(!(d>=0&&d<c))return A.a(a,d)
s=a[d]}o=d+1
if(!(d>=0&&d<c))return A.a(a,d)
s=a[d]
if(s<128){for(;;){if(!(o<a0)){n=a0
break}m=o+1
if(!(o>=0&&o<c))return A.a(a,o)
s=a[o]
if(s>=128){n=m-1
o=m
break}o=m}if(n-d<20)for(l=d;l<n;++l){if(!(l<c))return A.a(a,l)
p=A.cY(a[l])
e.a+=p}else{p=A.e9(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.cY(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.ha.prototype={
t(a){return this.f_()}}
A.N.prototype={
gaU(){return A.mC(this)}}
A.cC.prototype={
t(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.eW(s)
return"Assertion failed"}}
A.be.prototype={}
A.aY.prototype={
gbR(){return"Invalid argument"+(!this.a?"(s)":"")},
gbQ(){return""},
t(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.w(p),n=s.gbR()+q+o
if(!s.a)return n
return n+s.gbQ()+": "+A.eW(s.gcm())},
gcm(){return this.b}}
A.ba.prototype={
gcm(){return A.kT(this.b)},
gbR(){return"RangeError"},
gbQ(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.w(q):""
else if(q==null)s=": Not greater than or equal to "+A.w(r)
else if(q>r)s=": Not in inclusive range "+A.w(r)+".."+A.w(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.w(r)
return s}}
A.dK.prototype={
gcm(){return A.j(this.b)},
gbR(){return"RangeError"},
gbQ(){if(A.j(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$iba:1,
gk(a){return this.f}}
A.d3.prototype={
t(a){return"Unsupported operation: "+this.a}}
A.ef.prototype={
t(a){return"UnimplementedError: "+this.a}}
A.by.prototype={
t(a){return"Bad state: "+this.a}}
A.dH.prototype={
t(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.eW(s)+"."}}
A.e0.prototype={
t(a){return"Out of Memory"},
gaU(){return null},
$iN:1}
A.d0.prototype={
t(a){return"Stack Overflow"},
gaU(){return null},
$iN:1}
A.hb.prototype={
t(a){return"Exception: "+this.a}}
A.a_.prototype={
t(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.p.bJ(e,0,75)+"..."
return g+"\n"+e}for(r=e.length,q=1,p=0,o=!1,n=0;n<f;++n){if(!(n<r))return A.a(e,n)
m=e.charCodeAt(n)
if(m===10){if(p!==n||!o)++q
p=n+1
o=!1}else if(m===13){++q
p=n+1
o=!0}}g=q>1?g+(" (at line "+q+", character "+(f-p+1)+")\n"):g+(" (at character "+(f+1)+")\n")
for(n=f;n<r;++n){if(!(n>=0))return A.a(e,n)
m=e.charCodeAt(n)
if(m===10||m===13){r=n
break}}l=""
if(r-p>78){k="..."
if(f-p<75){j=p+75
i=p}else{if(r-f<75){i=r-75
j=r
k=""}else{i=f-36
j=f+36}l="..."}}else{j=r
i=p
k=""}return g+l+B.p.bJ(e,i,j)+k+"\n"+B.p.ah(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.w(f)+")"):g}}
A.m.prototype={
aq(a,b){var s
A.o(this).i("q(m.E)").a(b)
for(s=this.gD(this);s.u();)if(b.$1(s.gB()))return!0
return!1},
gk(a){var s,r=this.gD(this)
for(s=0;r.u();)++s
return s},
gS(a){return!this.gD(this).u()},
gcp(a){return!this.gS(this)},
ga5(a){var s=this.gD(this)
if(!s.u())throw A.f(A.ae())
return s.gB()},
gad(a){var s,r=this.gD(this)
if(!r.u())throw A.f(A.ae())
do s=r.gB()
while(r.u())
return s},
gaf(a){var s,r=this.gD(this)
if(!r.u())throw A.f(A.ae())
s=r.gB()
if(r.u())throw A.f(A.j8())
return s},
aH(a,b){var s,r
A.jj(b,"index")
s=this.gD(this)
for(r=b;s.u();){if(r===0)return s.gB();--r}throw A.f(A.kd(b,b-r,this,"index"))},
t(a){return A.mi(this,"(",")")}}
A.bv.prototype={
t(a){return"MapEntry("+A.w(this.a)+": "+A.w(this.b)+")"}}
A.a1.prototype={
gX(a){return A.e.prototype.gX.call(this,0)},
t(a){return"null"}}
A.e.prototype={$ie:1,
G(a,b){return this===b},
gX(a){return A.cX(this)},
t(a){return"Instance of '"+A.e2(this)+"'"},
gY(a){return A.iv(this)},
toString(){return this.t(this)}}
A.eB.prototype={
t(a){return""},
$iaA:1}
A.fy.prototype={
gcj(){var s,r=this.b
if(r==null)r=$.ji.$0()
s=r-this.a
if($.jU()===1e6)return s
return s*1000}}
A.ch.prototype={
gk(a){return this.a.length},
t(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.fl.prototype={
t(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.f1.prototype={
$2(a,b){var s=t.g
this.a.ct(new A.f_(s.a(a)),new A.f0(s.a(b)),t.X)},
$S:17}
A.f_.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:18}
A.f0.prototype={
$2(a,b){var s=A.nF(A.aV(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:19}
A.iG.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.r(A.as("Future already completed"))
s.bM(r.i("1/").a(a))
return null},
$S:4}
A.iH.prototype={
$1(a){if(a==null)return this.a.dY(new A.fl(a===undefined))
return this.a.dY(a)},
$S:4}
A.f2.prototype={
h1(a,b,c,d){var s
t.L.a(a)
s=A.jg(32768)
this.h6(A.j6(a,B.o,null,null),s,b,!0,!0)
return s.b7()},
h6(a,b,c,d,e){return A.ox(b,c,new A.f3(a,!0,!0))}}
A.f3.prototype={
$1(a){return B.R.h5(this.a,a,this.c,this.b)},
$S:20}
A.hE.prototype={
h7(a,b,c,d,e){var s,r,q=d==null?e:d,p=a.a
a.a=B.o
s=e||q
try{r=A.lm("gzip",e,q,new A.hG(this,a,b,e,!1,s))
return r}finally{a.sdV(p)}},
h5(a,b,c,d){return this.h7(a,b,!1,c,d)},
eX(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j=0
for(;;){s=a.c
r=a.d
r===$&&A.D()
if(!(s<r))break
r={}
if(!this.fA(a,e)){if(j!==0)return!1
a.c=s
return B.S.h4(a,b,!1,c)}q=b.gk(b)
s=r.a=0
if(c){p=new A.e6(new A.eh(b),new Uint8Array(65536),B.o)
p.shQ(new A.hF(r))}else p=null
o=p==null
n=o?b:p
m=new A.dL(a,n,!0)
m.d5()
if(!o)p.bl()
if(!m.f)return!1
o=a.b
if((o==null?s:o.length-a.c)<8)return!1
l=a.b5()
k=a.b5()
b.e4()
if(B.a.T(b.gk(b)-q,4294967296)!==k)return!1
if(c&&r.a!==l)throw A.f(A.iZ("Invalid gzip checksum"));++j}return j!==0},
fA(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gk(0)<10)return!1
s=a.c
if(a.bA()!==35615)return!1
if(a.an()!==8)return!1
r=a.an()
if(b&&(r&224)!==0)return!1
a.b5()
a.an()
a.an()
if((r&4)!==0){if(a.gk(0)<2)return!1
q=a.bA()
if(a.gk(0)<q)return!1
a.ed(q)}if((r&8)!==0)if(!this.du(a))return!1
if((r&16)!==0)if(!this.du(a))return!1
if((r&2)!==0){if(a.gk(0)<2)return!1
if(b){p=a.bA()
o=a.bI(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.D()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bI(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.lk(i.hJ(),n)}if((n&65535)!==p)throw A.f(A.iZ("Invalid gzip header checksum"))}else a.bA()}return!0},
du(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.D()
if(!(s<r))break
r=a.b
r.toString
a.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1}}
A.hG.prototype={
$0(){var s=this
return s.a.eX(s.b,s.c,s.d,s.e,s.f)},
$S:11}
A.hF.prototype={
$1(a){var s=this.a
return s.a=A.lk(a,s.a)},
$S:22}
A.f4.prototype={
ey(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
for(s=0;s<a0;++s){r=a1[s]
if(r>a.b)a.b=r
if(r<a.c)a.c=r}r=a.b
if(r>15)throw A.f(B.U)
q=r+1
p=new Uint16Array(q)
for(o=0;o<a0;++o){n=a1[o]
if(n!==0){if(!(n>=0&&n<q))return A.a(p,n)
m=p[n]
if(!(n<q))return A.a(p,n)
p[n]=m+1}}for(l=1,k=1;k<=r;++k){l=(l<<1>>>0)-p[k]
if(l<0)throw A.f(B.a5)}if(l>0)q=r>(a2?0:1)
else q=!1
if(q)throw A.f(B.a3)
j=B.a.a9(1,r)
r=a.a=new Uint32Array(j)
for(q=a.b,m=a1.length,i=1,h=0,g=2;i<=q;){for(f=i<<16,s=0;s<a0;++s){if(!(s<m))return A.a(a1,s)
if(a1[s]===i){for(e=h,d=0,c=0;c<i;++c){d=(d<<1|e&1)>>>0
e=e>>>1}for(b=(f|s)>>>0,c=d;c<j;c+=g){if(!(c>=0&&c<j))return A.a(r,c)
r[c]=b}++h}}++i
h=h<<1>>>0
g=g<<1>>>0}}}
A.fN.prototype={}
A.ia.prototype={
h4(a,b,c,d){var s,r=d,q=a.a
a.a=B.t
try{s=A.lm("zlib",d,r,new A.ib(this,a,b,d,!1))
return s}finally{a.sdV(q)}},
eB(a,b,c,d){var s,r,q,p,o,n,m,l=a.c,k=a.d
k===$&&A.D()
if(l>=k)return!1
A:{k=a.b
if((k==null?0:k.length-l)<2)return!1
k.toString
s=a.c=l+1
r=k.length
if(!(l>=0&&l<r))return A.a(k,l)
q=k[l]
a.c=s+1
if(!(s>=0&&s<r))return A.a(k,s)
p=k[s]
if((q&15)!==8)return!1
if(q>>>4>7)return!1
if(B.a.T(q*256+p,31)!==0)return!1
if((p>>>5&1)!==0){a.b5()
return!1}l=new A.bR(new Uint8Array(32768),B.o)
o=new A.dL(a,l,!0)
o.d5()
n=o.c.b7()
if(!o.f){b.ae(n)
return!1}l=a.b
if((l==null?0:l.length-a.c)<4){b.ae(n)
return!1}m=a.b5()
if(c)if(m!==A.oD(n)){b.ae(n)
throw A.f(A.iZ("Invalid zlib checksum"))}break A}if(n!=null)b.ae(n)
return!0}}
A.ib.prototype={
$0(){var s=this
return s.a.eB(s.b,s.c,s.d,s.e)},
$S:11}
A.eh.prototype={
m(a,b){t.L.a(b)
this.a.ae(b)
this.b=this.b+b.length},
$ifx:1}
A.dL.prototype={
gaj(){var s=this.a
if(s==null)return s
s.d===$&&A.D()
return s},
d5(){var s,r,q,p=this
p.w=p.r=0
if(p.gaj()==null)return
s=p.c
if(!(s instanceof A.bR)){p.d=s
p.c=A.jg(32768)}try{for(;;){r=p.gaj()
q=r.c
r=r.d
r===$&&A.D()
if(!(q<r))break
if(!p.fj())return
p.d6(32768)}}finally{p.d6(0)
p.c=s
p.d=null}},
d6(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.b7()
o.ae(A.b0(q,0,r))
p=A.jg(2097152)
p.ae(A.b0(q,r,null))
this.c=p},
fj(){var s,r,q,p=this,o=p.gaj()
if(o!=null){s=o.c
r=o.d
r===$&&A.D()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.aa(3)
s=(q&1)===0
switch(B.a.K(q,1)){case 0:if(p.fs()===-1)return!1
break
case 1:if(p.cV($.lw(),$.lv())===-1)return!1
break
case 2:if(p.fk()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
aa(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gaj()
r=s.c
s=s.d
s===$&&A.D()
if(r>=s)return-1
s=o.gaj()
r=s.b
r.toString
s=s.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
q=r[s]
s=o.r
r=o.w
o.r=(s|B.a.a9(q,r))>>>0
o.w=r+8}r=o.r
p=B.a.ds(1,a)
o.r=B.a.c2(r,a)
o.w=s-a
return(r&p-1)>>>0},
bY(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.D()
s=a.b
while(m.w<s){r=m.gaj()
q=r.c
r=r.d
r===$&&A.D()
if(q>=r)break
r=m.gaj()
q=r.b
q.toString
r=r.c++
if(!(r>=0&&r<q.length))return A.a(q,r)
p=q[r]
r=m.r
q=m.w
m.r=(r|B.a.a9(p,q))>>>0
m.w=q+8}r=m.r
q=(r&B.a.a9(1,s)-1)>>>0
if(!(q<l.length))return A.a(l,q)
o=l[q]
n=o>>>16
if(n===0||n>m.w)return-1
m.r=B.a.c2(r,n)
m.w-=n
return o&65535},
fs(){var s,r,q=this
q.w=q.r=0
s=q.aa(16)
if(s!==(q.aa(16)^65535)>>>0)return-1
if(s>q.gaj().gk(0))return-1
r=q.gaj().ed(s)
q.c.bE(r)
return 0},
fk(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.aa(5)
if(f===-1)return-1
f+=257
if(f>286)return-1
s=g.aa(5)
if(s===-1)return-1;++s
if(s>32)return-1
r=g.aa(4)
if(r===-1)return-1
r+=4
if(r>19)return-1
q=new Uint8Array(19)
for(p=0;p<r;++p){o=g.aa(3)
if(o===-1)return-1
n=B.ac[p]
if(!(n<19))return A.a(q,n)
q[n]=o}m=g.dB(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.c9(B.d.ga7(l),0,f)
j=J.c9(B.d.ga7(l),f,s)
if(g.fc(n,m,l)===-1)return-1
i=g.dA(k)
n=i==null
h=n?null:g.dA(j)
if(n||h==null)return-1
return g.cV(i,h)},
dB(a,b){var s,r
t.L.a(a)
try{s=A.j5(a,b)
return s}catch(r){if(A.ah(r) instanceof A.a_)throw r
else throw r}},
dA(a){return this.dB(a,!1)},
cV(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.bY(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bD(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.E,r)
q=j.aa(B.E[r])
if(q<0)return-1
if(!(r<29))return A.a(B.D,r)
p=B.D[r]
o=j.bY(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.B,o)
n=j.aa(B.B[o])
if(n<0)return-1
m=B.ae[o]+n
if(m>=1){l=j.c
l=m>l.gk(l)}else l=!0
if(l)return-1
j.c.bC(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gaj()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.D()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
fc(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.bY(b)
if(q===-1)return-1
p=0
switch(q){case 16:if(r===0)return-1
o=k.aa(2)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.d(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=s}break
case 17:o=k.aa(3)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.d(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
case 18:o=k.aa(7)
if(o===-1)return-1
o+=11
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.d(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
default:if(q<0||q>15)return-1
l=r+1
c.$flags&2&&A.d(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=q
r=l
s=q
break}}return 0}}
A.dT.prototype={
bc(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.f(A.j0("The decoded data is larger than the "+s+" bytes allowed"))}},
gk(a){return this.b.b},
e4(){return null},
bD(a){this.bc(1)
this.b.bD(a)},
aS(a,b){t.L.a(a)
this.bc(a.length)
this.b.aS(a,b)},
ae(a){return this.aS(a,null)},
bE(a){this.bc(a.gk(0))
this.b.bE(a)},
bC(a,b){this.bc(b)
this.b.bC(a,b)},
az(a,b){return this.b.az(a,b)},
ba(a){return this.az(a,null)}}
A.ca.prototype={}
A.cB.prototype={}
A.dC.prototype={}
A.cD.prototype={
f_(){return"ByteOrder."+this.b}}
A.e6.prototype={
gk(a){return this.c},
aS(a,b){var s
t.L.a(a)
s=A.b0(a,0,a.length)
this.bP(s)},
ae(a){return this.aS(a,null)},
bD(a){var s,r,q,p=this
if(p.r!=null)p.bP(new Uint8Array(A.a9(A.h([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.d(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bl()}},
bE(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.D()
if(!(r<q))break
s=a.hD(o,0,J.aL(o))
r=s
if(typeof r!=="number")return r.hS()
if(r<=0)break
this.bP(A.b0(o,0,s))}}finally{a.c=A.j(p)}},
bP(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bl()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.m(0,new Uint8Array(A.a9(A.b0(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.N(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bl()}},
bl(){var s=this,r=s.f
if(r===0)return
s.b.m(0,new Uint8Array(A.a9(A.b0(s.e,0,r))))
s.f=0},
az(a,b){return A.r(A.aQ("a streamed result cannot be read back"))},
ba(a){return this.az(a,null)},
shQ(a){this.r=t.cy.a(a)}}
A.h8.prototype={}
A.dM.prototype={
gk(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.j(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){var s,r=this,q=r.b
if(q==null)return A.j6(A.h([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.D()
a=s-b}return A.j6(q,r.a,a,b)},
an(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
hD(a,b,c){var s,r,q,p=this.b
if(p==null)return 0
s=p.length
r=this.c
q=s-r
q=c>q?q:c
if(q<=0)return 0
B.d.N(a,b,b+q,p,r)
this.c+=q
return q},
hJ(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gk(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.f(A.ar(q,0,r,"position",null))
return J.c9(B.d.ga7(n),o.b.byteOffset+o.c,s)}}
A.dN.prototype={
bA(){var s=this.an(),r=this.an()
if(this.a===B.t)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
b5(){var s=this,r=s.an(),q=s.an(),p=s.an(),o=s.an()
if(s.a===B.t)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
ed(a){var s=this,r=s.bI(a,s.c)
s.c=s.c+r.gk(0)
return r},
sdV(a){this.a=t.fA.a(a)}}
A.bR.prototype={
e4(){},
b7(){return J.c9(B.d.ga7(this.c),this.c.byteOffset,this.b)},
bD(a){var s,r,q=this
if(q.b===q.c.length)q.f3()
s=q.c
r=q.b++
s.$flags&2&&A.d(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
aS(a,b){var s,r,q,p,o=this
t.L.a(a)
b=a.length
while(s=o.b,r=s+b,q=o.c,p=q.length,r>p)o.bn(r-p)
B.d.C(q,s,r,a)
o.b+=b},
ae(a){return this.aS(a,null)},
bE(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bn(s+(q?0:r.length-a.c)-n)}if(!q)B.d.N(o,s,s+a.gk(0),r,a.c)
m.b=m.b+a.gk(0)},
bC(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.bn(r-p)
o=s-a
if(a>=b)B.d.N(q,s,r,q,o)
else for(n=q.$flags|0,m=o;s<r;s=l,m=k){l=s+1
k=m+1
if(!(m>=0&&m<p))return A.a(q,m)
j=q[m]
n&2&&A.d(q)
if(!(s>=0))return A.a(q,s)
q[s]=j}i.b+=b},
az(a,b){var s=this
if(a<0)a=s.b+a
if(b==null)b=s.b
else if(b<0)b=s.b+b
return J.c9(B.d.ga7(s.c),s.c.byteOffset+a,b-a)},
ba(a){return this.az(a,null)},
bn(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.C(s,0,q,r)
this.c=s},
f3(){return this.bn(null)},
gk(a){return this.b}}
A.bx.prototype={
bC(a,b){var s,r=this
for(s=-a;b>a;){r.ae(r.ba(s))
b-=a}if(b===a)r.ae(r.ba(s))
else r.ae(r.az(s,b-a))},
b7(){return this.az(0,this.gk(this))}}
A.ez.prototype={}
A.eR.prototype={
hl(a,b){var s,r,q,p,o,n,m,l,k
if(b<=0)return!1
s=this.y.h(0,a)
r=s==null
q=!r
if(q&&s.a>=b)return!0
p=this.dx.h(0,a)
if(p!=null&&p.x&&p.f===b&&p.y>=b)return!0
o=r?null:s.a
if(o==null)o=0
r=this.ay
if(r.a!==0)for(n=new A.bN(r,r.r,r.e,A.o(r).i("bN<1>"));n.u();)if(n.d.a===a)o+=4
if(o<b)return!1
for(m=0,l=0;l<b;++l){if(!(q&&s.al(0,l))){n=r.h(0,new A.x(a,B.a.J(l,4)))
if(n==null)n=null
else{k=l-n.c
n=k>=0&&k<4&&n.d[k]!==255}n=n===!0}else n=!0
if(n)++m
else break}return m>=b},
eq(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.ce()
this.a=s},
cD(){this.fy=0
if(this.fx.length>65536)this.fx=new Uint8Array(65536)},
ei(a,b,c,d,e,f,g,a0){var s,r,q,p,o,n,m,l,k,j,i,h=this
h.db=h.cy=0
s=a0*e*4
if(d<0||d>=g||b.length<s)return!1
r=new A.x(c,B.a.J(d,4))
q=h.ay
p=q.A(0,r)
if(p!=null){q.q(0,r,p)
if(p.a===a0&&p.b===e&&p.al(0,d)){p.z=++h.ax
p.hC(d,b,a)
if(h.r){o=p.hg(d)
h.cy=o.a
h.db=o.b}return!0}}if(a!=null){a.a=null
a.b=-1}n=new A.x(c,d)
q=h.x
m=q.A(0,n)
if(m!=null){m.f=++h.ax
q.q(0,n,m)
q=m.a
l=q.length
k=m.b
if(h.cW(q,0,l,k,b,s)){if(h.r){j=m.d
if(j===0&&m.e===0){i=A.j2(m.c,q,0,l,k)
q=m.d=i.a
m.e=i.b}else q=j
h.cy=q
h.db=m.e}return!0}h.aD(n)}return!1},
hP(a,b,c,d,e,f,g){return this.ei(null,a,b,c,d,e,f,g)},
eb(a,b,c,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=a1*c
if(b<0||b>=a0||d>147456||d<256||e.b<=0)return!1
s=B.a.J(b,4)*4
r=Math.min(s+4,a0)
q=r-s
if(q<2)return!1
p=new A.x(a,B.a.J(s,4))
o=e.ay
if(o.aG(p)||e.ch.al(0,p))return!1
n=A.h([],t.t)
for(m=e.x,l=s,k=0;l<r;++l){j=m.h(0,new A.x(a,l))
if(j!=null){k+=j.a.length
B.b.m(n,l)}}if(n.length<2)return!1
i=d*4
h=e.cx
if(h==null||h.length<i)h=e.cx=new Uint8Array(i)
g=A.mR(s,n,new A.eU(e,a),c,Math.min(B.a.J(e.b,8),k*2),new A.eV(e,a,i),h,a1)
if(g==null){if(n.length===q){q=e.ch
q.m(0,p)
if(q.a>128)q.A(0,q.ga5(0))}return!1}for(q=n.length,f=0;f<n.length;n.length===q||(0,A.Z)(n),++f)e.aD(new A.x(a,n[f]))
q=g.w
e.d7(q)
g.z=++e.ax
o.q(0,p,g)
e.CW+=q
return!0},
cH(a,b,c,d,e,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a2*c*4
if(b<0||b>=a1||a0.length<f)return new A.ct([0,0,0,0,0])
s=new A.x(a,B.a.J(b,4))
g.ch.A(0,s)
r=g.ay.h(0,s)
r=r==null?null:r.al(0,b)
if(r===!0)g.fE(s)
q=f+B.a.J(f,255)+16
p=e.hd(q)
if(f>0)$.iR()
o=A.mt(a0,f,p,e.a,f)
n=o<0||o>=f
if(n){m=f
l=a0}else{m=o
l=p}k=A.k5(l,0,m)
if(g.r){j=A.j2(k,l,0,m,n)
i=j.a
h=j.b}else{i=0
h=0}g.cy=i
g.db=h
g.fw(l,k,i,h,n,m,new A.x(a,b),0,a1)
e.hE(q)
return new A.ct([m,k,0,i,h])},
h9(a){var s,r=this.dx.A(0,a)
if(r!=null)try{r.c.cd()}catch(s){}return!1},
he(a){var s,r,q,p,o=this,n=o.ay,m=A.o(n).i("P<1>"),l=m.i("bT<m.E>")
m=A.b7(new A.bT(new A.P(n,m),m.i("q(m.E)").a(new A.eS(a)),l),l.i("m.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.Z)(m),++s){r=n.A(0,m[s])
if(r!=null)o.CW=o.CW-r.w}n=o.ch
n.f5(A.o(n).i("q(1)").a(new A.eT(a)),!0)
o.as.A(0,a)
o.Q.A(0,a)
o.z.A(0,a)
q=o.y.A(0,a)
if(q==null)return
for(n=q.gD(q),m=o.x;n.u();){p=m.A(0,new A.x(a,n.gB()))
if(p!=null)o.at=o.at-p.a.length}},
ce(){var s,r,q,p
for(r=this.dx,q=new A.aM(r,r.r,r.e,A.o(r).i("aM<2>"));q.u();){s=q.d
try{s.c.cd()}catch(p){}}r.l(0)},
dW(){var s=this
s.x.l(0)
s.y.l(0)
s.z.l(0)
s.Q.l(0)
s.as.l(0)
s.at=0
s.ay.l(0)
s.ch.l(0)
s.CW=0
s.cx=null
s.cD()},
eY(a,b,c,d,e,f,g){var s
$.iR()
if(g!=null&&A.k5(a,b,c)!==g)return!1
if(d){if(c!==f)return!1
B.d.N(e,0,f,a,b)
return!0}try{A.mu(a,b,c,e,f)
return!0}catch(s){if(A.ah(s) instanceof A.a_)return!1
else throw s}},
cW(a,b,c,d,e,f){return this.eY(a,b,c,d,e,f,null)},
fw(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k=this,j=k.b
if(j<=0||f>j)return
s=g.a
if(i>0)k.Q.q(0,s,i)
k.aD(g)
j=k.y
r=j.h(0,s)
q=r==null?null:r.a
if(q==null)q=0
p=k.z
o=p.h(0,s)
if(o==null)o=0
k.c8(s,q+1,o+f)
if(k.as.al(0,s)){k.f1(f)
if(k.at+k.CW+f>k.b)return}else k.d8(f,s)
n=new Uint8Array(f)
B.d.N(n,0,f,a,h)
k.x.q(0,g,new A.ez(n,e,b,c,d,++k.ax))
m=j.h(0,s)
if(m==null){m=A.fc(t.S)
j.q(0,s,m)}m.m(0,g.b)
k.at+=f
j=p.h(0,s)
l=(j==null?0:j)+f
p.q(0,s,l)
k.c8(s,m.a,l)},
c8(a,b,c){var s,r,q=this,p=q.Q.h(0,a)
if(p==null)p=0
if(p>0&&b>=1&&b<p){s=B.a.a_(c*p,b)
r=q.b
if(s>(b===1?B.a.J(r*5,4):r)){q.as.m(0,a)
return}}q.as.A(0,a)},
fE(a){var s=this.ay.A(0,a)
if(s!=null)this.CW=this.CW-s.w},
f1(a){var s,r,q,p,o,n=this,m=n.y,l=n.as,k=A.o(l),j=k.i("bj<1>")
k=k.c
for(;;){if(!(n.at+n.CW+a>n.b&&l.a!==0))break
r=new A.bj(l,l.r,j)
r.c=l.e
for(;;){if(!r.u()){s=null
break}q=r.d
s=q==null?k.a(q):q
p=m.h(0,s)
if(p!=null&&p.a!==0)break}if(s==null){l.l(0)
break}r=m.h(0,s)
o=r.e
if(o==null)A.r(A.as("No elements"))
n.aD(new A.x(s,A.o(r).c.a(o.a)))}},
d8(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
for(s=t.x,r=a3.ay,q=A.o(r),p=q.i("P<1>"),o=a3.x,n=a3.as,m=A.o(n),l=m.i("bj<1>"),k=a3.y,m=m.c,j=A.o(o),i=j.i("P<1>"),q=q.i("bO<2>"),j=j.i("bO<2>");a3.at+a3.CW+a4>a3.b;){h=!1
if(n.a!==0){for(g=new A.bj(n,n.r,l),g.c=n.e,f=null;g.u();){e=g.d
d=e==null?m.a(e):e
c=k.h(0,d)
if(c==null||c.a===0)continue
if(d!==a5){f=d
break}if(f==null)f=d}if(f!=null){c=k.h(0,f)
h=c!=null&&c.a!==0
if(h){b=c.e
if(b==null)A.r(A.as("No elements"))
a3.aD(new A.x(f,A.o(c).c.a(b.a)))}else n.A(0,f)}}if(h)continue
a=o.a!==0
a0=r.a!==0
if(a&&a0){a1=new A.bO(o,j).gD(0)
if(!a1.u())A.r(A.ae())
g=a1.gB().f
a1=new A.bO(r,q).gD(0)
if(!a1.u())A.r(A.ae())
if(g<=a1.gB().z){a1=new A.P(o,i).gD(0)
if(!a1.u())A.r(A.ae())
a3.aD(a1.gB())}else{a1=new A.P(r,p).gD(0)
if(!a1.u())A.r(A.ae())
a2=r.A(0,s.a(a1.gB()))
if(a2!=null)a3.CW=a3.CW-a2.w}}else if(a){a1=new A.P(o,i).gD(0)
if(!a1.u())A.r(A.ae())
a3.aD(a1.gB())}else if(a0){a1=new A.P(r,p).gD(0)
if(!a1.u())A.r(A.ae())
a2=r.A(0,s.a(a1.gB()))
if(a2!=null)a3.CW=a3.CW-a2.w}else break}},
d7(a){return this.d8(a,null)},
aD(a){var s,r,q,p,o,n,m=this,l=m.x.A(0,a)
if(l==null)return
s=a.a
r=m.at
q=l.a.length
m.at=r-q
r=m.z
p=r.h(0,s)
o=(p==null?0:p)-q
q=m.y
n=q.h(0,s)
if(n!=null){n.A(0,a.b)
if(n.a===0){q.A(0,s)
r.A(0,s)
m.as.A(0,s)}else{r.q(0,s,o>0?o:0)
q=n.a
r=r.h(0,s)
r.toString
m.c8(s,q,r)}}else{r.A(0,s)
m.as.A(0,s)}},
shy(a){this.d=A.j(a)},
sh_(a){this.r=A.aJ(a)}}
A.eV.prototype={
$2(a,b){var s=this.a,r=s.x.h(0,new A.x(this.b,a)),q=r.a
return s.cW(q,0,q.length,r.b,b,this.c)},
$S:23}
A.eU.prototype={
$1(a){var s,r,q=this.a,p=q.x.h(0,new A.x(this.b,a))
if(p==null)return B.v
if(q.r&&p.d===0&&p.e===0){q=p.c
s=p.a
r=A.j2(q,s,0,s.length,p.b)
p.d=r.a
p.e=r.b}return new A.x(p.d,p.e)},
$S:24}
A.eS.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.eT.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.fd.prototype={
hd(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
hE(a){var s=this
if(s.b.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.fF.prototype={}
A.ed.prototype={
al(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
hg(a){var s,r,q=this,p=a-q.c
if(p>=0&&p<4){s=q.d
if(!(p>=0&&p<4))return A.a(s,p)
r=s[p]
if(r!==255){s=q.x
if(!(r<4))return A.a(s,r)
return new A.x(s[r],q.y[r])}}return B.v},
dd(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdE()},
gcS(){var s=this.Q
return s===$?this.Q=B.a.J(this.a+16-1,16):s},
gdE(){var s,r,q=this,p=q.as
if(p===$){s=q.gcS()
r=B.a.J(q.b+16-1,16)
q.as!==$&&A.S()
p=q.as=s*r}return p},
hC(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdE(),b=d.dd(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.dd(a5.b):-1
if(a2===b)return
for(a0=d.a,s=d.b,r=d.f,q=a2>=0,p=d.e,o=p.length,n=0;n<c;++n){m=b+n
if(!(m>=0&&m<o))return A.a(p,m)
l=p[m]
if(q){m=a2+n
if(!(m<o))return A.a(p,m)
m=p[m]===l}else m=!1
if(m)continue
m=d.gcS()
k=B.a.T(n,m)*16
j=B.a.a_(n,m)*16
i=Math.min(16,a0-k)
h=Math.min(16,s-j)
if(!(l<r.length))return A.a(r,l)
g=r[l]
for(m=i*4,f=0;f<h;++f){e=((j+f)*a0+k)*4
B.d.N(a4,e,e+m,g,f*i*4)}}if(!a){a5.a=a1
a5.b=a3}}}
A.fG.prototype={
$0(){return A.h([],t.t)},
$S:26}
A.az.prototype={
gS(a){var s=this
return s.a>=s.c||s.b>=s.d},
ho(a){var s=this
return new A.az(s.a-a,s.b-a,s.c+a,s.d+a)},
by(a){var s=this
return new A.az(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.b9.prototype={
bb(a){var s=$.k!=null
if(s)this.b=A.aU(a*4)
else this.c=new Int32Array(a)},
gv(){var s=this.b
if(s!=null)s=A.dX(t.a.a(A.v($.k.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
av(a,b){var s,r,q,p,o=this,n=o.b
if(n!=null){s=A.aU(a*4)
r=A.dX(t.a.a(A.v($.k.memory).buffer),s,a)
if(b>0)B.e.C(r,0,b,o.gv())
n=$.k
n.toString
q=o.b
q.toString
n.free(q)
o.b=s
o.a=a}else{p=new Int32Array(a)
if(b>0){n=o.c
n.toString
B.e.C(p,0,b,n)}o.c=p
o.a=a}},
a1(){var s=this.b
if(s!=null){$.k.free(s)
this.b=null}}}
A.b8.prototype={
gv(){var s=this.c
if(s!=null)s=A.je(t.a.a(A.v($.k.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
av(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.f(A.as("Cannot resize a borrowed pixel buffer"))
s=n.c
if(s!=null){r=A.aU(a*4)
q=A.je(t.a.a(A.v($.k.memory).buffer),r,a)
if(b>0)B.l.C(q,0,b,n.gv())
s=$.k
s.toString
p=n.c
p.toString
s.free(p)
n.c=r
n.b=a}else{o=new Uint32Array(a)
if(b>0){s=n.d
s.toString
B.l.C(o,0,b,s)}n.d=o
n.b=a}},
a1(){var s,r,q=this
if(q.a&&q.c!=null){s=$.k
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.fg.prototype={
hz(a,b,c,d,e,f,g,h,i,j,k,a0,a1){var s,r,q,p,o,n,m,l=this
if(e<2||f<=0||e>a.length||e>b.length||f>c.length||f>d.length||h<0||i<0||h>=j||i>=k||j>65535||k>65535||a0.b==null)return-2
s=(j-h)*(k-i)
if(s>262144)return-2;++l.f
if(s>l.e)l.e=s
r=l.c
if(e>r){if(r>0){$.k.free(l.r)
$.k.free(l.w)}r=e*2
l.c=r
l.r=A.aU(r*8)
l.w=A.aU(l.c*8)}r=l.d
if(f>r){if(r>0){$.k.free(l.x)
$.k.free(l.y)}r=f*2
l.d=r
l.x=A.aU(r*4)
l.y=A.aU(l.d*4)}r=t.a
B.f.C(A.jd(r.a(A.v($.k.memory).buffer),l.r,l.c),0,e,a)
B.f.C(A.jd(r.a(A.v($.k.memory).buffer),l.w,l.c),0,e,b)
B.e.C(A.dX(r.a(A.v($.k.memory).buffer),l.x,l.d),0,f,c)
B.e.C(A.dX(r.a(A.v($.k.memory).buffer),l.y,l.d),0,f,d)
q=new A.fi(l,f,h,i,j,k,g,a0)
p=q.$0()
while(p===-1){o=a0.b
if(o!=null){n=r.a(A.v($.k.memory).buffer)
m=a0.a
o=new Int32Array(n,o,m)}else{o=a0.c
o.toString}a0.av(o.length*2,0)
p=q.$0()}return p},
hF(){if($.fh!==this){this.a1()
return}var s=$.cM-1
$.cM=s
if(s>0)return
$.cM=0
$.fh=null
this.a1()},
a1(){var s=this,r=s.a
if(r!==0)$.k.fl_dense_free(r)
$.k.free(s.b)
if(s.c>0){$.k.free(s.r)
$.k.free(s.w)
s.w=s.r=s.c=0}if(s.d>0){$.k.free(s.x)
$.k.free(s.y)
s.y=s.x=s.d=0}}}
A.fi.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=$.k
j.toString
s=k.a
r=s.r
q=s.w
p=s.x
o=s.y
n=k.r?1:0
m=k.w
l=m.b
l.toString
return A.dz(j,"fl_dense_raster",[s.a,r,q,p,o,k.b,k.c,k.d,k.e,k.f,n,l,m.gv().length/2|0,s.b],t.S)},
$S:3}
A.ij.prototype={
$8(a,b,c,d,e,f,g,h){this.a.V(g,h,a,b,c,d,e,f,this.b)},
$S:27}
A.i_.prototype={
hf(a,b,c,d,e,f,g){var s,r=!0
if(g.gS(0)){s=a.f
if(s!==0)if(s<=1024){r=a.r
r=r===0||r>128}}if(r)return!1
r=this.f
if(r==null)r=this.f=new A.bt(new Float64Array(256))
r.aI(a.f*4)
g.ck(a.r*2)
for(;;)return!1}}
A.cg.prototype={
geQ(){var s=this.a
return s}}
A.fq.prototype={
gdc(){var s=this
if(!s.Q&&s.b){s.Q=!0
s.z=A.mw()}return s.z},
aN(a,b,c,d,e,f,g){var s,r,q,p,o=this,n=o.gdc()
if(n!=null){s=a.f
if(s>4096||a.r>256)o.as=!0
r=n.f
q=n.hz(a.a,a.b,a.c,a.d,s,a.r,b,d,e,f,g,c.a,!0)
o.r=o.r+(n.f-r)
if(q>=0){p=A.dX(t.a.a(A.v($.k.memory).buffer),n.b,4)
c.b=q
s=p.length
if(0>=s)return A.a(p,0)
c.c=p[0]
if(1>=s)return A.a(p,1)
c.d=p[1]
if(2>=s)return A.a(p,2)
c.e=p[2]
if(3>=s)return A.a(p,3)
c.f=p[3]
return}}s=o.ch;(s==null?o.ch=A.kc(256):s).hA(a,b,c,d,e,f,g)},
fz(a,b,c,d,e,f,g,h,i,j,k,l){var s
if(this.gdc()!=null)s=l===0
else s=!0
if(s)return!1
return!1},
dn(a,b){var s=this.at,r=s.A(0,a)
if(r==null)return null
if(r.b.G(0,b)){s.q(0,a,r)
return r.c}this.ax=this.ax-r.d
r.c.a.a1()
return null},
c_(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.at
r=s.$ti.i("P<1>")
for(;;){if(!(m.ax+l>1048576||s.a>=256))break
q=new A.P(s,r).gD(0)
if(!q.u())A.r(A.ae())
p=s.A(0,q.gB())
m.ax=m.ax-p.d
o=p.c.a
n=o.b
if(n!=null){$.k.free(n)
o.b=null}}r=m.ay
r.toString
o=Math.max(1,c.b)*2
n=new A.b9(o)
n.bb(o)
n=new A.aG(n)
n.dZ(c)
s.q(0,a,new A.bU(r,b,n,l))
m.ax+=l},
dv(a,b){var s,r,q,p=this.y2,o=p.A(0,a)
if(o!=null){p.q(0,a,o)
return o.b}if(p.a>=512)p.A(0,new A.P(p,p.$ti.i("P<1>")).ga5(0))
s=this.fx
s.l(0)
A.ii(a,b,0.01,s)
r=Math.max(1,s.f)
q=A.cW(Math.max(1,s.r),r)
B.f.C(q.a,0,s.f,s.a)
B.f.C(q.b,0,s.f,s.b)
B.e.C(q.c,0,s.r,s.c)
B.e.C(q.d,0,s.r,s.d)
B.d.C(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
r=this.ay
r.toString
p.q(0,a,new A.ac(r,q,t.b3))
return q},
f9(a){var s=this.bw,r=s.A(0,a)
if(r==null)return null
s.q(0,a,r)
return r.b},
gb_(){var s=this.CW
if(s==null){s=new A.b9(2048)
s.bb(2048)
s=this.CW=new A.aG(s)}return s},
gbN(){var s=this.cx
if(s==null){s=new A.b9(2048)
s.bb(2048)
s=this.cx=new A.aG(s)}return s},
gbp(){var s=this.cy
if(s==null){s=new A.b9(2048)
s.bb(2048)
s=this.cy=new A.aG(s)}return s},
gdw(){var s,r,q=this.R8
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.R8=new A.i_(this.p4,new A.bt(q),new A.bt(s),new A.bt(r),new A.bt(new Float64Array(256)))}return q},
f8(a,b,c,d){var s=this,r=s.ok,q=!1
if(a<r.length)if(r[a]===b){r=s.p1
if(!(a<r.length))return A.a(r,a)
if(r[a]===c){r=s.p2
if(!(a<r.length))return A.a(r,a)
r=r[a]===d}else r=q}else r=q
else r=q
if(r){r=s.k4
if(!(a<r.length))return A.a(r,a)
return r[a]}return null},
fv(a,b,c,d){var s,r,q
for(s=this.ok,r=this.p1,q=this.p2;s.length<=a;){B.b.m(s,null)
B.b.m(r,0/0)
B.b.m(q,0/0)}B.b.q(s,a,b)
B.b.q(r,a,c)
B.b.q(q,a,d)},
eH(a,b){var s,r,q,p
for(s=this.k4;s.length<=a;){r=Math.max(16,b)
B.b.m(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.b.q(s,a,q)}return q},
eJ(a){var s,r,q,p,o
for(s=this.fy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.al(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eI(a){var s,r,q,p,o
for(s=this.go;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.al(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
ao(a){var s,r,q
for(s=this.RG;s.length<=a;){r=new A.b9(2048)
q=$.k!=null
if(q)r.b=A.aU(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aG(r))}s=s[a]
s.l(0)
return s},
eG(a){var s,r,q,p,o
for(s=this.id;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.al(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eF(a){var s,r,q,p,o
for(s=this.k1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.al(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
d2(a){var s
for(s=this.k2;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
eE(a){var s,r,q,p,o
for(s=this.rx;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.al(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eD(a){var s,r,q,p,o
for(s=this.ry;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.al(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cL(a){var s,r,q
for(s=this.to;s.length<=a;){r=new A.b9(2048)
q=$.k!=null
if(q)r.b=A.aU(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aG(r))}return s[a]},
eC(a){var s,r,q
for(s=this.x1;s.length<=a;){r=new A.b9(2048)
q=$.k!=null
if(q)r.b=A.aU(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aG(r))}return s[a]},
fC(){var s,r,q,p,o
for(s=this.cl,r=new A.aM(s,s.r,s.e,s.$ti.i("aM<2>"));r.u();){q=r.d.b
if(q.a&&q.c!=null){p=$.k
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.l(0)},
cs(a){var s=this,r=a.a,q=s.ok
B.b.ac(q,0,q.length,null)
s.at.bB(0,new A.fr(s,r))
s.y2.bB(0,new A.fs(r))
s.bw.bB(0,new A.ft(r))
s.cl.bB(0,new A.fu(r))},
ee(){var s,r,q,p=this,o=p.ok
B.b.ac(o,0,o.length,null)
for(o=p.at,s=new A.aM(o,o.r,o.e,o.$ti.i("aM<2>"));s.u();){r=s.d.c.a
q=r.b
if(q!=null){$.k.free(q)
r.b=null}}o.l(0)
p.ax=0
p.y2.l(0)
p.bw.l(0)
p.fC()},
a1(){var s,r,q,p,o,n,m=this
m.ee()
s=m.aQ
if(s!=null)s.a1()
m.aQ=null
s=m.z
if(s!=null)s.hF()
m.z=null
s=m.CW
if(s!=null)s.a.a1()
s=m.cx
if(s!=null)s.a.a1()
s=m.cy
if(s!=null)s.a.a1()
m.CW=m.cx=m.cy=null
for(s=m.to,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.k.free(o)
p.b=null}}for(r=m.x1,p=r.length,q=0;q<r.length;r.length===p||(0,A.Z)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.k.free(n)
o.b=null}}B.b.l(s)
B.b.l(r)
B.b.l(m.rx)
B.b.l(m.ry)
for(s=m.RG,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.k.free(o)
p.b=null}}B.b.l(s)
m.dk()
m.ch=null},
eh(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.xr=0
if(a){i.y1=0
i.as=!1}s=i.z
if(s!=null)r=a||s.e>65536||s.c>8192||s.d>512
else r=!1
if(r){if(s.e>65536){$.k.fl_dense_trim(s.a,65536)
s.e=0}if(s.c>8192){$.k.free(s.r)
$.k.free(s.w)
s.w=s.r=s.c=0}if(s.d>512){$.k.free(s.x)
$.k.free(s.y)
s.y=s.x=s.d=0}}if(a){r=i.aQ
if(r!=null)r.a1()
i.aQ=null
i.dk()
B.b.l(i.fy)
B.b.l(i.go)
B.b.l(i.id)
B.b.l(i.k1)
B.b.l(i.k4)
B.b.l(i.ok)
B.b.l(i.p1)
B.b.l(i.p2)
B.b.l(i.k2)
B.b.l(i.k3)
B.b.l(i.e1)
i.R8=null}else{for(r=i.x2,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
if(n!=null)if(p<5){o=n.c
if(o!=null){m=q.a(A.v($.k.memory).buffer)
l=n.b
o=new Uint32Array(m,o,l)}else{o=n.d
o.toString}o=o.length>262144}else o=!0
else o=!1
if(o){if(n.a&&n.c!=null){o=$.k
o.toString
m=n.c
m.toString
o.free(m)
n.c=null}B.b.q(r,p,null)}}if(o>5)B.b.sk(r,5)
r=i.fy
q=r.length
B.b.b6(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ag()
r=i.go
q=r.length
B.b.b6(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ag()
r=i.id
q=r.length
B.b.b6(r,Math.min(2,q),q)
q=i.k1
r=q.length
B.b.b6(q,Math.min(2,r),r)
for(r=q.length,k=0;k<q.length;q.length===r||(0,A.Z)(q),++k)q[k].ag()
r=i.k4
q=r.length
B.b.b6(r,Math.min(2,q),q)
q=i.ok
B.b.ac(q,0,q.length,null)
for(p=0;p<r.length;++p)if(r[p].length>4096)B.b.q(r,p,new Float64Array(64))
r=i.R8
if(r!=null){r.b.ag()
r.c.ag()
r.d.ag()
r.e.ag()
r=r.f
if(r!=null)r.ag()}}i.db.Z(a)
i.dx.Z(a)
i.dy.Z(a)
i.fr.Z(a)
i.fx.Z(a)
for(r=i.id,p=0;p<r.length;++p)r[p].Z(a)
if(a){for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.k.free(m)
o.b=null}}B.b.l(r)}else for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ag()
r=i.CW
if(r!=null)r.Z(a)
r=i.cx
if(r!=null)r.Z(a)
r=i.cy
if(r!=null)r.Z(a)
for(r=i.rx,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.ry,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.to,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.x1,p=0;p<r.length;++p)r[p].Z(a)
if(a)i.ch=null
else{r=i.ch
if(r!=null){r.r=0
r.k4=!1
r.fx=-1
r.fr=0
q=r.a
j=Math.max(q,2048)
if(r.b.length>j){o=new Int32Array(q)
B.e.ac(o,0,q,-1)
r.b=o}if(r.c.length>32768){r.c=new Int32Array(8192)
r.d=new Int32Array(8192)
r.e=new Int32Array(8192)
r.f=new Int32Array(8192)}if(r.w.length>131072){r.w=new Int32Array(0)
r.x=null
r.Q=!1}}}i.p3.Z(a)},
hN(){return this.eh(!1)},
dk(){var s,r,q,p,o,n
for(s=this.x2,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q]
if(p!=null)if(p.a&&p.c!=null){o=$.k
o.toString
n=p.c
n.toString
o.free(n)
p.c=null}}B.b.l(s)},
aL(a,b){var s,r,q
if(b>this.xr)this.xr=b
s=this.x2
if(s.length<=a)B.b.sk(s,a+1)
if(!(a<s.length))return A.a(s,a)
r=s[a]
if(r==null){q=A.fk(b)
B.b.q(s,a,q)
return q}if(r.gv().length<b)r.av(b,0)
return r},
c3(a){var s
for(s=this.e1;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
sfG(a){this.ay=t.g_.a(a)}}
A.fr.prototype={
$2(a,b){var s
A.aV(a)
t.az.a(b)
if(b.a!==this.b)return!1
s=this.a
s.ax=s.ax-b.d
b.c.a.a1()
return!0},
$S:15}
A.fs.prototype={
$2(a,b){A.aV(a)
return t.b3.a(b).a===this.a},
$S:29}
A.ft.prototype={
$2(a,b){A.aV(a)
return t.e.a(b).a===this.a},
$S:30}
A.fu.prototype={
$2(a,b){t.cK.a(a)
t.dL.a(b)
if(b.a!==this.a)return!1
b.b.a1()
return!0},
$S:31}
A.ac.prototype={}
A.bU.prototype={}
A.im.prototype={
$2(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.a
a0.l(0)
s=a.b
s.l(0)
r=a.c
A.ii(a1.a,r,a.d,a0)
q=a.e
p=a.f
o=a.r
n=a.w
m=a.x
l=a.y
s.aF(a0,q,p,o,n,m,l)
k=a.z
j=a.Q
i=a.as
h=a.at
g=a.ax
k.aN(s,!1,a2,j,i,h,g)
f=a1.e
if(f==null)e=null
else{r=f.n(r)
if(0>=r.length)return A.a(r,0)
r=r[0]
e=r}if(e==null)e=0
if(e!==0)r=a2.b===0&&e<0
else r=!0
if(r)return
d=k.fr
d.l(0)
A.nK(a0,e,a.ay,d,k.gdw())
s.l(0)
s.aF(d,q,p,o,n,m,l)
c=k.ao(3)
b=k.ao(4)
k.aN(s,!1,c,j,i,h,g)
a2.aV(b)
A.cZ(b,c,a2,e>0?2:3)},
$S:32}
A.c.prototype={
dM(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.dM(a)
s=this.b
if(A.n(s))a.a+="["+A.w(s)+"]"
else{r="."+A.w(s)
a.a+=r}},
t(a){var s,r=new A.ch("")
this.dM(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bz.prototype={
gdU(){var s,r,q=this,p=q.r
if(p===$){s=q.b
s===$&&A.D()
r=q.c
r===$&&A.D()
p=q.r=new A.az(0,0,0+s,0+r)}return p},
gI(){var s,r=this,q=r.z
if(q===$){s=B.b.ab(r.w,new A.h6(r))
r.z!==$&&A.S()
r.z=s
q=s}return q},
bf(a,b){var s=this,r="Composition exceeds command budget (200000)",q=s.x+=a,p=s.Q
if(p!=null){B.b.q(p,0,p[0]+a)
if(p[0]>2e5)s.j(b,r)}else if(q>2e5)s.j(b,r)},
j(a,b){return A.r(new A.fL(b+" at "+a.t(0),null,null))},
au(a,b,c){if(!t.P.b(b))this.j(c,"Expected object")
return b},
bz(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.n(c)){s=new A.c(b,c)
break A}if(typeof c=="string"){s=new A.c(b,c)
break A}s=b
break A}this.j(s,"Expected finite number")}return a},
R(a,b){return this.bz(a,b,null)},
O(a,b,c){var s,r
t.P.a(a)
t.k.a(c)
for(s=a.gar(),s=s.gD(s);s.u();){r=s.gB()
if(!c.al(0,r))this.j(new A.c(b,r),"Unsupported field")}},
ek(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.l(a.h(0,b),0)&&!J.l(a.h(0,b),!1))this.j(new A.c(c,b),"Unsupported nonzero "+b)},
dX(f8,f9,g0,g1,g2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4=this,e5=null,e6="ip",e7="op",e8="Expected object",e9="layers",f0="hasMask",f1="tp",f2="td",f3="masksProperties",f4="shapes",f5="refId",f6="parent",f7=t.P
f7.a(f8)
t.cq.a(f9)
t.k.a(g1)
t.aM.a(g2)
t.eg.a(g0)
e4.Q=g0==null?A.h([1],t.t):g0
e4.O(f8,B.i,B.aT)
e4.ek(f8,"ddd",B.i)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=f8.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.iY(n)))m=!(n instanceof A.I&&n.gS(n))
if(m)e4.j(new A.c(B.i,o),"Unsupported "+o)}e4.b=e4.R(f8.h(0,"w"),new A.c(B.i,"w"))
e4.c=e4.R(f8.h(0,"h"),new A.c(B.i,"h"))
e4.d=e4.R(f8.h(0,e6),new A.c(B.i,e6))
e4.e=e4.R(f8.h(0,e7),new A.c(B.i,e7))
s=e4.f=e4.R(f8.h(0,"fr"),new A.c(B.i,"fr"))
l=e4.e-e4.d
if(e4.b<=0||e4.c<=0||s<0.001||s>1e4||l<=0||l>36e3)e4.j(B.i,"Invalid bounds/timing")
s=f9==null
k=s?A.a5(t.N,f7):f9
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){j=s[p]
i=f8.h(0,j)
if(i==null)i=[]
if(!q.b(i))e4.j(new A.c(B.i,j),"Expected asset definitions")
for(m=J.cA(i);m.u();){h=m.gB()
if(!f7.b(h))e4.j(new A.c(B.i,j),e8)
g=h.h(0,"id")
if(typeof g!="string")e4.j(new A.c(B.i,j),"Expected asset id")
k.q(0,g,h)}}f=f8.h(0,e9)
if(!q.b(f))e4.j(B.n,"Expected layers")
e=g2==null?A.a5(t.bP,t.G):g2
d=new A.hX(e4,f,new A.aj(t.gt),new A.bY(t.ai))
s=t.S
r=t.D
c=A.a5(s,r)
b=A.a5(r,s)
s=A.h([],t.f)
a=new A.hc(e4,s)
a0=A.a5(r,t.eG)
for(r=J.V(f),m=e4.w,a1=t.n,a2=t.r,a3=t.V,a4=t.c2,a5=e4.a,a6=t.N,a7=t.z,a8=0;a8<r.gk(f);++a8){a9=new A.c(B.n,a8)
e4.bf(1,a9)
b0=r.h(f,a8)
if(!f7.b(b0))e4.j(a9,e8)
e4.O(b0,a9,B.aS)
b1=b0.h(0,"bm")
if(b1==null)b1=0
if(!A.n(b1)||b1<0||b1>16)e4.j(new A.c(a9,"bm"),"Blend mode "+A.w(b1))
for(b2=["ddd","ao"],b3=b2.length,p=0;p<b3;++p)e4.ek(b0,b2[p],a9)
if(b0.h(0,f0)!=null&&!A.aX(b0.h(0,f0))&&!J.l(b0.h(0,f0),0)&&!J.l(b0.h(0,f0),1))e4.j(new A.c(a9,f0),"Expected boolean hasMask")
b4=b0.h(0,"tt")
if(b4==null)b4=0
if(!A.n(b4)||b4<0||b4>4)e4.j(new A.c(a9,"tt"),"Matte type")
if(b0.h(0,f1)!=null&&!J.l(b0.h(0,f1),0)){b2=!0
if(b4!==0)if(a8!==0){b2=b0.h(0,f1)
b3=a8-1
b5=J.ai(r.h(f,b3),"ind")
b2=!J.l(b2,b5==null?b3:b5)}if(b2)e4.j(new A.c(a9,f1),"Unsupported nonzero tp")}if(b0.h(0,f2)!=null&&!J.l(b0.h(0,f2),0)&&!J.l(b0.h(0,f2),1))e4.j(new A.c(a9,f2),"Matte source flag")
b6=e4.eP(b0.h(0,f3),new A.c(a9,f3))
f7.a(b0)
a.fU(b0,q.a(q.b(b0.h(0,f4))?b0.h(0,f4):B.C),a9,s)
b2=b0.h(0,"sr")
if(b2==null)b2=1
b7=e4.R(b2,new A.c(a9,"sr"))
if(b7===0)e4.j(new A.c(a9,"sr"),"Invalid zero time stretch")
b8=b0.h(0,"ty")
b2=J.aE(b8)
if(!b2.G(b8,4)&&!b2.G(b8,3)&&!b2.G(b8,0)&&!b2.G(b8,1))e4.j(new A.c(a9,"ty"),"Layer type "+A.w(b8))
b9=e4.eZ(b0.h(0,"ef"),new A.c(a9,"ef"),f)
c0=b9.a
c1=b9.b
c2=e4.fd(b0.h(0,"sy"),new A.c(a9,"sy"))
if(c2!=null&&c0!=null)e4.j(new A.c(a9,"ef"),"Fill with Inner Shadow")
b3=c1==null
b5=!b3
if(b5)c3=!b2.G(b8,4)||b4!==0||b1!==0
else c3=!1
if(c3)e4.j(c1.b,"Set Matte requires a normal shape layer without a track matte")
c4=e4.dH(b0.h(0,"ks"),new A.c(a9,"ks"))
if(b2.G(b8,4))c5=e4.fb(b0.h(0,f4),new A.c(a9,f4),d)
else if(b2.G(b8,1)){c3=b0.h(0,"sw")
if(c3==null)c3=0
c6=e4.R(c3,new A.c(a9,"sw"))
c3=b0.h(0,"sh")
if(c3==null)c3=0
c7=e4.R(c3,new A.c(a9,"sh"))
c8=b0.h(0,"sc")
if(typeof c8!="string"||!B.p.es(c8,"#"))e4.j(new A.c(a9,"sc"),"Invalid solid color")
c9=A.ln(B.p.ev(c8,1),16)
c3=B.a.K(c9,16)
d0=B.a.K(c9,8)
d1=new Float32Array(A.a9(A.h([c6*0.5,c7*0.5],a1)))
d2=$.bq()
d3=new A.X(new A.aT(!1,!1,new A.E(d1,e5,!1,d2,!1),new A.E(new Float32Array(A.a9(A.h([c6,c7],a1))),e5,!1,d2,!1),new A.E(new Float32Array(A.a9(A.h([0],a1))),e5,!1,d2,!1)))
d4=new A.E(new Float32Array(A.a9(A.h([(c3&255)/255,(d0&255)/255,(c9&255)/255],a1))),e5,!1,d2,!1)
d4.f=!0
d0=new Float32Array(A.a9(A.h([100],a1)))
c3=new Float32Array(A.a9(A.h([1],a1)))
d5=A.jw(A.h([d3],a2),d4,new A.E(d0,e5,!1,d2,!1),new A.E(c3,e5,!1,d2,!1),!1,!1,1,1,4,e5,e5)
d2=A.h([d3],a2)
c3=A.h([d5],a3)
d0=$.iW()
c5=A.ju(d2,c3,new A.c1(d0,d0,$.iU(),$.iV(),$.iT(),e5,e5,e5,e5))}else c5=e5
if(b2.G(b8,0)){g=b0.h(0,f5)
d6=k.h(0,g)
if(typeof g!="string"||d6==null||!q.b(d6.h(0,e9)))e4.j(new A.c(a9,f5),"Missing precomposition")
if(g1.al(0,g))e4.j(new A.c(a9,f5),"Cyclic precomposition")
b2=b0.h(0,"w")
if(b2==null)b2=e4.b
d7=e4.R(b2,new A.c(a9,"w"))
b2=b0.h(0,"h")
if(b2==null)b2=e4.c
d8=e4.R(b2,new A.c(a9,"h"))
d9=new A.aC(g,d7,d8)
e0=e.h(0,d9)
if(e0==null){e0=A.js(a5)
b2=A.mq(["w",d7,"h",d8,"ip",0,"op",e4.e-e4.d,"fr",e4.f,"layers",d6.h(0,e9)],a6,a7)
c3=A.mr(a6)
c3.ak(0,g1)
c3.m(0,g)
e0.dX(b2,k,e4.Q,c3,e)
e.q(0,d9,e0)
e4.x=e4.x+e0.x
e1=e0}else{e4.bf(e0.x,new A.c(a9,f5))
e1=new A.er(new A.aj(a4)).cC(e0)}e4.y=B.u.bG(e4.y,e1.y)}else e1=e5
e2=b0.h(0,"tm")!=null?e4.L(b0.h(0,"tm"),new A.c(a9,"tm"),1,A.h([0],a1)):e5
b2=b0.h(0,e6)
if(b2==null)b2=e4.d
b2=e4.R(b2,new A.c(a9,e6))
c3=b0.h(0,e7)
if(c3==null)c3=e4.e
c3=e4.R(c3,new A.c(a9,e7))
d0=J.l(b0.h(0,"hd"),!0)
d1=b0.h(0,"st")
if(d1==null)d1=0
d1=e4.R(d1,new A.c(a9,"st"))
e3=A.kF(c4,c5,b2,c3,d0,b1,e1,c0,c2,b6,b3?b4:1,d1,b7,e2,b5)
if(b5)a0.q(0,e3,c1)
B.b.m(m,e3)
g=b0.h(0,"ind")
if(g==null)g=a8
if(!A.n(g)||c.aG(g))e4.j(new A.c(a9,"ind"),"Invalid/duplicate layer id")
c.q(0,g,e3)
if(b0.h(0,f6)!=null){if(!A.n(b0.h(0,f6)))e4.j(new A.c(a9,f6),"Invalid parent id")
b.q(0,e3,A.j(b0.h(0,f6)))}}e4.ff(f,c,a0)
e4.fg(c,b)},
fZ(a){return this.dX(a,null,null,B.aY,null)},
eP(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null,f="pt"
if(a==null)return g
if(!t.j.b(a))h.j(b,"Expected list")
s=J.V(a)
if(s.gS(a))return g
r=A.h([],t.bE)
for(q=t.n,p=t.P,o=0;o<s.gk(a);++o){n=new A.c(b,o)
m=s.h(a,o)
if(!p.b(m))h.j(n,"Expected object")
h.O(m,n,B.aR)
l=J.l(m.h(0,"inv"),!0)
k=A.ic(m.h(0,"mode"))
if(k==null)k="a"
if(!B.aZ.al(0,k))h.j(new A.c(n,"mode"),"Unsupported mask mode "+k)
if(m.h(0,f)==null)h.j(new A.c(n,f),"Missing mask path")
j=h.dh(m.h(0,f),new A.c(n,f))
i=m.h(0,"o")!=null?h.L(m.h(0,"o"),new A.c(n,"o"),1,A.h([100],q)):new A.E(new Float32Array(A.a9(A.h([100],q))),g,!1,$.bq(),!1)
B.b.m(r,new A.a8(j,k,i,l,m.h(0,"x")!=null?h.L(m.h(0,"x"),new A.c(n,"x"),1,A.h([0],q)):g))}return r},
ff(a,b,c){var s,r,q,p,o,n,m,l,k,j=this
t.j.a(a)
t.B.a(b)
t.aj.a(c)
for(s=j.w,r=0;r<s.length;++r){q=s[r]
if(q.y!==0&&!q.ax){if(r===0)j.j(new A.c(new A.c(B.n,r),"tt"),"Missing preceding matte source")
p=r-1
if(!(p>=0&&p<s.length))return A.a(s,p)
o=s[p]
if(o.y!==0)j.j(new A.c(new A.c(B.n,r),"tt"),"Chained matte")
q.ay=o
o.ch=!0
j.x+=4}}for(p=new A.bM(c,A.o(c).i("bM<1,2>")).gD(0);p.u();){n=p.d
m=n.a
l=n.b
o=b.h(0,l.a)
k=!0
if(o!=null)if(o.b!=null)if(!o.e)k=o!==m&&o.y!==0
if(k)j.j(l.b,"Set Matte requires a visible shape source without its own matte")
m.ay=o
j.x+=4}for(p=J.V(a),r=0;r<s.length;++r){if(J.l(J.ai(p.h(a,r),"td"),1)){if(!(r<s.length))return A.a(s,r)
k=!s[r].ch}else k=!1
if(k)j.j(new A.c(new A.c(B.n,r),"td"),"Unpaired matte source")}},
fg(a,b){var s,r,q,p,o,n,m,l,k
t.B.a(a)
t.gq.a(b)
for(s=new A.bM(b,A.o(b).i("bM<1,2>")).gD(0);s.u();){r=s.d
q=r.b
p=a.h(0,q)
if(p==null)this.j(B.n,"Missing parent "+q)
r.a.cy=p}for(s=this.w,q=s.length,o=t.D,n=0;n<s.length;s.length===q||(0,A.Z)(s),++n){m=s[n]
l=A.fc(o)
for(k=m;k!=null;k=k.cy)if(!l.m(0,k))this.j(B.n,"Cyclic parenting")}},
aw(a){var s,r,q,p,o,n,m,l,k,j,i
for(s=this.w,r=s.length-1,q=null;r>=0;--r){if(!(r<s.length))return A.a(s,r)
p=s[r]
if(!p.ch){if(!p.e)o=(p.b!=null||p.f!=null)&&a>=p.c&&a<p.d
else o=!1
o=!o}else o=!0
if(o)continue
o=p.a.e.n(a)
if(0>=o.length)return A.a(o,0)
if(B.c.H(B.a.F(B.c.M(255*B.c.H(o[0])/100),0,255)*p.aT(a)/255)===0)continue
n=p.ay
m=p.aw(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.n(a)
if(0>=o.length)return A.a(o,0)
k=B.c.H(B.a.F(B.c.M(255*B.c.H(o[0])/100),0,255)*n.aT(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.aw(a)
if(j==null)continue
m=m.by(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.c4(q,m)}if(q==null)return null
i=q.by(this.gdU())
return i.gS(0)?null:i},
dH(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.a5(t.N,t.z):i.au(0,a,b)
i.O(g,b,B.b4)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.j(new A.c(b,p),"3D transform")}s=t.n
o=i.L(g.h(0,"sk"),new A.c(b,"sk"),1,A.h([0],s))
n=i.L(g.h(0,"sa"),new A.c(b,"sa"),1,A.h([0],s))
m=g.h(0,h)
if(m instanceof A.I&&J.l(m.h(0,"s"),!0)){l=i.au(0,m,new A.c(b,h))
i.O(l,new A.c(b,h),B.aV)
k=i.L(l.h(0,"x"),new A.c(new A.c(b,h),"x"),1,A.h([0],s))
j=i.L(l.h(0,"y"),new A.c(new A.c(b,h),"y"),1,A.h([0],s))
m=null}else{k=null
j=null}return A.jx(i.L(g.h(0,"a"),new A.c(b,"a"),2,A.h([0,0],s)),i.L(m,new A.c(b,h),2,A.h([0,0],s)),i.fR(g.h(0,"s"),new A.c(b,"s"),2,A.h([100,100],s),100),i.L(g.h(0,"r"),new A.c(b,"r"),1,A.h([0],s)),i.L(g.h(0,"o"),new A.c(b,"o"),1,A.h([100],s)),k,j,o,n)},
eZ(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aK
if(!b0.b(b1))a4.j(b2,"Expected effects array")
for(s=J.bF(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.V(b1),n<m.gk(b1);++n){l=new A.c(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.j(new A.c(b2,n),a5)
a4.O(m,l,B.b0)
k=J.l(m.h(0,a6),21)&&J.l(m.h(0,a7),"ADBE Fill")
j=J.l(m.h(0,a6),28)&&J.l(m.h(0,a7),"ADBE Set Matte3")
i=J.l(m.h(0,a6),5)&&J.l(m.h(0,a7),"ADBE Layer Control")
h=!k
if(h&&!j&&!i)a4.j(l,"Unsupported visual effect")
if(J.l(m.h(0,a8),0)||J.l(m.h(0,a8),!1))continue
if(m.h(0,a8)!=null&&!J.l(m.h(0,a8),1)&&!J.l(m.h(0,a8),!0))a4.j(new A.c(l,a8),"Invalid effect enabled flag")
if(!h||j){if(p!=null||o!=null)a4.j(l,"Multiple visual effects")
g=k?B.aa:B.ad
f=m.h(0,a9)
if(!b0.b(f)||J.aL(f)!==g.length)a4.j(new A.c(l,a9),"Invalid effect parameters")
e=new A.fX(a4,l,f,g)
d=new A.fY(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.eq(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aF,B.aG,B.aH,B.aI,B.aJ],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.n(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.c(new A.c(new A.c(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.ef(a0))a4.j(a1,"Expected a static layer index")
o=new A.x(B.c.M(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.aL(a2)!==1)a4.j(l,"Invalid layer control")
m=J.k1(a2)
if(!q.b(m))a4.j(new A.c(new A.c(l,a9),0),a5)
a4.O(m,new A.c(new A.c(l,a9),0),B.H)
if(!J.l(m.h(0,a6),10)||!J.l(m.h(0,a7),"ADBE Layer Control-0001"))a4.j(l,"Unsupported effect control")
a=a4.L(m.h(0,"v"),new A.c(new A.c(new A.c(l,a9),0),"v"),1,A.h([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.ef(a0))h=a0!==0&&!s.aq(b3,new A.fW(a0))
else h=!0
if(h)a4.j(l,"Missing layer control target")}}return new A.x(p,o)},
fd(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.iY(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.aL(a)!==1)d.j(b,"Expected one Inner Shadow style")
r=new A.c(b,0)
q=d.au(0,J.k1(a),r)
if(!J.l(q.h(0,"ty"),2))d.j(new A.c(r,"ty"),"Unsupported layer style")
d.O(q,r,B.aP)
p=new A.h2(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.l(p.$2(m,0),0))d.j(new A.c(r,m),"Unsupported Inner Shadow parameter")}if(!J.l(p.$2("bm",1),1))d.j(new A.c(r,"bm"),"Inner Shadow requires Multiply")
l=d.L(q.h(0,"c"),new A.c(r,"c"),3,A.h([0,0,0],t.n))
if(l.a==null)d.j(new A.c(r,"c"),"Animated Inner Shadow")
k=l.n(0)
s=p.$2("o",100)
if(typeof s!=="number")return s.ah()
j=B.a.F(B.c.H(s*255/100),0,255)
s=p.$2("a",0)
if(typeof s!=="number")return s.T()
i=B.c.T(s,360)*3.141592653589793/180
h=p.$2("d",0)
if(h<0)d.j(new A.c(r,"d"),"Negative Inner Shadow distance")
if(h===0||j===0)return null
s=Math.cos(i)
o=Math.sin(i)
g=k.length
if(0>=g)return A.a(k,0)
f=B.a.F(B.c.H(k[0]*255),0,255)
if(1>=g)return A.a(k,1)
e=B.a.F(B.c.H(k[1]*255),0,255)
if(2>=g)return A.a(k,2)
return A.kE(-s*h,o*h,(j<<24|f<<16|e<<8|B.a.F(B.c.H(k[2]*255),0,255))>>>0)},
dh(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c={}
c.a=c.b=null
c.c=!1
s=this.dG(a,b,-1,A.h([],t.n),new A.h3(c,this,a))
r=A.h([],t.hg)
q=s.b
if(q!=null&&c.c){p=c.a
p.toString
o=q.a.length
n=A.kh(o,!1,!1,t.y)
m=c.b
m.toString
for(l=p.length,k=m,j=0;j<o;++j){m=j*2
i=m<l
h=i?p[m]:0
if(i){++m
if(!(m<l))return A.a(p,m)
g=p[m]}else g=0
B.b.q(n,j,h===0?k:h===1)
k=g===0?n[j]:g===1}for(m=o-1,i=q.d,f=i.length,j=0;j<o;++j){e=j*2
if(e<l){++e
if(!(e<l))return A.a(p,e)
g=p[e]}else g=0
e=n[j]
if(!(j<f))return A.a(i,j)
if((i[j]&1)!==0)d=e
else d=g!==0?g===1:B.b.h(n,Math.min(j+1,m))
B.b.m(r,new A.x(e,d))}}this.bf(s.gcv()/6|0,b)
p=c.b
return new A.aB(s,p!==!1,r)},
d1(e4,e5,e6,e7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8=this,d9=null,e0="ks",e1="d",e2="Path direction",e3="r"
if(e7>64)d8.j(e5,"Shape group nesting exceeds 64")
if(!t.j.b(e4))d8.j(e5,"Expected shape list")
s=t.r
r=A.h([],s)
q=A.h([],t.V)
for(p=t.P,o=t.aT,n=t.eU,m=n.i("m.E"),l=t.n,k=t.u,j=t.S,i=t.W,h=t.fq,g=t.bs,f=t.fP,e=e7+1,d=d9,c=0;b=J.V(e4),c<b.gk(e4);++c){a=new A.c(e5,c)
d8.bf(1,a)
a0=b.h(e4,c)
if(!p.b(a0))d8.j(a,"Expected object")
a1=a0.h(0,"ty")
a2=a0.h(0,"bm")
if(a2==null)a2=0
if(!A.n(a2)||a2<0||a2>16)d8.j(new A.c(a,"bm"),"Blend mode "+A.w(a2))
a3=J.l(a0.h(0,"hd"),!0)
switch(a1){case"tr":if(d!=null||c!==b.gk(e4)-1)d8.j(a,"Transform must be last and unique")
d=d8.dH(a0,a)
break
case"gr":d8.O(a0,a,B.aU)
a4=d8.d1(a0.h(0,"it"),new A.c(a,"it"),e6,e)
if(!a3){B.b.m(r,a4)
B.b.m(q,a4)}break
case"sh":d8.O(a0,a,B.aW)
if(a0.h(0,e0)==null)d8.j(new A.c(a,e0),"Missing path data")
a5=e6.cA(a0.h(0,e0),new A.c(a,e0))
if(!a3)B.b.m(r,new A.X(a5))
break
case"rc":case"el":d8.O(a0,a,B.b1)
if(a0.h(0,e1)!=null&&!J.l(a0.h(0,e1),1)&&!J.l(a0.h(0,e1),2)&&!J.l(a0.h(0,e1),3))d8.j(new A.c(a,e1),e2)
a6=d8.b0(a0.h(0,"p"),new A.c(a,"p"),2,A.h([0,0],l),!0)
a7=d8.b0(a0.h(0,"s"),new A.c(a,"s"),2,A.h([0,0],l),!0)
a8=d8.L(a0.h(0,e3),new A.c(a,e3),1,A.h([0],l))
d8.x+=8
if(!a3)B.b.m(r,new A.X(new A.aT(J.l(a1,"el"),J.l(a0.h(0,e1),3),a6,a7,a8)))
break
case"sr":d8.O(a0,a,B.b_)
a9=a0.h(0,"sy")
if(a9==null)a9=1
b=J.aE(a9)
if(!b.G(a9,1)&&!b.G(a9,2))d8.j(new A.c(a,"sy"),"PolyStar type "+A.w(a9))
if(a0.h(0,e1)!=null&&!J.l(a0.h(0,e1),1)&&!J.l(a0.h(0,e1),2)&&!J.l(a0.h(0,e1),3))d8.j(new A.c(a,e1),e2)
b0=d8.L(a0.h(0,"pt"),new A.c(a,"pt"),1,A.h([5],l))
a6=d8.b0(a0.h(0,"p"),new A.c(a,"p"),2,A.h([0,0],l),!0)
b1=d8.L(a0.h(0,e3),new A.c(a,e3),1,A.h([0],l))
b2=d8.L(a0.h(0,"or"),new A.c(a,"or"),1,A.h([0],l))
b3=d8.L(a0.h(0,"os"),new A.c(a,"os"),1,A.h([0],l))
if(b.G(a9,1))b4=a0.h(0,"ir")!=null?d8.L(a0.h(0,"ir"),new A.c(a,"ir"),1,A.h([0],l)):new A.E(new Float32Array(A.a9(A.h([0],l))),d9,!1,$.bq(),!1)
else b4=d9
if(b.G(a9,1))b5=a0.h(0,"is")!=null?d8.L(a0.h(0,"is"),new A.c(a,"is"),1,A.h([0],l)):new A.E(new Float32Array(A.a9(A.h([0],l))),d9,!1,$.bq(),!1)
else b5=d9
d8.x+=12
if(!a3)B.b.m(r,new A.X(new A.b1(b.G(a9,1),J.l(a0.h(0,e1),3),b0,a6,b1,b2,b3,b4,b5)))
break
case"tm":d8.O(a0,a,B.b3)
b6=a0.h(0,"m")
if(b6==null)b6=1
b=J.aE(b6)
if(!b.G(b6,1)&&!b.G(b6,2))d8.j(new A.c(a,"m"),"Trim mode")
b7=A.h([],s)
b8=new A.bC(b7,d8.L(a0.h(0,"s"),new A.c(a,"s"),1,A.h([0],l)),d8.L(a0.h(0,"e"),new A.c(a,"e"),1,A.h([100],l)),d8.L(a0.h(0,"o"),new A.c(a,"o"),1,A.h([0],l)),b.G(b6,2),A.a5(j,i))
if(!a3){b9=A.h([],h)
new A.h1(b9).$1(r)
B.b.ak(b7,new A.a0(b9,g.a(new A.h_()),f))
for(c0=0;c0<b9.length;++c0)b9[c0].a=new A.bl(b8,c0)}++d8.x
break
case"fl":case"st":case"gf":case"gs":d8.O(a0,a,B.aN)
b=J.aE(a1)
c1=b.G(a1,"st")||b.G(a1,"gs")
if(c1)d8.y=!0
c2=c1?d8.eW(a0.h(0,e1),new A.c(a,e1)):d9
c3=a0.h(0,e3)
if(c3==null)c3=1
b7=J.aE(c3)
if(!b7.G(c3,1)&&!b7.G(c3,2))d8.j(new A.c(a,e3),"Fill rule")
c4=a0.h(0,"lc")
if(c4==null)c4=1
c5=a0.h(0,"lj")
if(c5==null)c5=1
if(!A.n(c4)||c4<1||c4>3||!A.n(c5)||c5<1||c5>3)d8.j(a,"Stroke cap/join")
c6=d8.fQ(a0.h(0,"c"),new A.c(a,"c"),3,A.h([0,0,0],l),!1)
c6.f=!0
c7=c6.a
if(c7==null)c7=c6.b.e
for(c8=c7.length,c9=c7.$flags|0,d0=0;d0<c8;d0+=3){d1=!0
if(!(c7[d0]>1)){d2=d0+1
if(!(d2<c8))return A.a(c7,d2)
if(!(c7[d2]>1)){d1=d0+2
if(!(d1<c8))return A.a(c7,d1)
d1=c7[d1]>1}}if(d1)for(d3=0;d3<3;++d3){d1=d0+d3
if(!(d1<c8))return A.a(c7,d1)
d2=c7[d1]
c9&2&&A.d(c7)
c7[d1]=d2/255}}d4=d8.L(a0.h(0,"o"),new A.c(a,"o"),1,A.h([100],l))
d5=d8.L(a0.h(0,"w"),new A.c(a,"w"),1,A.h([1],l))
if(!a3){c8=A.b7(r,k)
b7=b7.G(c3,2)
c9=a0.h(0,"ml")
if(c9==null)c9=4
c9=d8.R(c9,new A.c(a,"ml"))
B.b.m(q,A.jw(c8,c6,d4,d5,c1,b7,c4,c5,c9,c2,b.G(a1,"gf")||b.G(a1,"gs")?d8.fa(a0,a):d9))}d8.x+=2
break
case"mm":d8.O(a0,a,B.aX)
b6=a0.h(0,"mm")
if(b6==null)b6=1
if(!A.n(b6)||b6<1||b6>5)d8.j(new A.c(a,"mm"),"Shape op mm mode "+A.w(b6))
if(!a3&&r.length!==0){d6=A.b7(new A.bT(r,o.a(new A.h0()),n),m)
if(d6.length===1)d7=b6===4||r.length>1
else d7=!1
B.b.l(r)
if(d6.length!==0)B.b.m(r,d7?B.b.gaf(d6):new A.aR(d6,b6))}else if(a3)B.b.l(r);++d8.x
break
default:d8.j(new A.c(a,"ty"),"Shape op "+A.w(a1))}}if(d==null){s=$.iW()
s=A.jx(s,s,$.iU(),$.iV(),$.iT(),d9,d9,d9,d9)}else s=d
return A.ju(r,q,s)},
fb(a,b,c){return this.d1(a,b,c,0)},
eW(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.j(b,"Expected dash array")
s=A.h([],t.gC)
for(r=t.n,q=t.P,p=null,o=0;n=J.V(a),o<n.gk(a);++o){m=new A.c(b,o)
n=n.h(a,o)
if(!q.b(n))j.j(new A.c(b,o),"Expected object")
j.O(n,m,B.b2)
l=j.L(n.h(0,"v"),new A.c(m,"v"),1,A.h([0],r))
k=n.h(0,"n")
n=J.aE(k)
if(n.G(k,"o")){if(p!=null)j.j(m,"Duplicate dash offset")
p=l}else if(n.G(k,(s.length&1)===0?"d":"g"))B.b.m(s,l)
else j.j(new A.c(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.b.m(s,B.b.gad(s))
return A.kB(s,p==null?A.jp(A.h([0],r)):p)},
fa(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.au(0,a.h(0,"g"),new A.c(b,"g"))
k.O(s,new A.c(b,"g"),B.b5)
r=s.h(0,"p")
if(!A.n(r)||r<=0)k.j(new A.c(new A.c(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dG(s.h(0,"k"),new A.c(new A.c(b,"g"),"k"),-1,A.h([],q),new A.fZ(k,r))
if(!J.l(a.h(0,"t"),1)&&!J.l(a.h(0,"t"),2))k.j(new A.c(b,"t"),"Gradient type")
o=k.b0(a.h(0,"s"),new A.c(b,"s"),2,A.h([0,0],q),!0)
n=k.b0(a.h(0,"e"),new A.c(b,"e"),2,A.h([0,0],q),!0)
m=J.l(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.L(a.h(0,"h"),new A.c(b,"h"),1,A.h([0],q))
return A.kD(r,p,o,n,m,l,a.h(0,"a")==null?null:k.L(a.h(0,"a"),new A.c(b,"a"),1,A.h([0],q)))},
b1(a,b,c,d,e,f,g,h){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return g?A.mU(d):A.jp(d)
s=o.au(0,a,b)
o.O(s,b,B.I)
if(s.h(0,"a")!=null&&!J.l(s.h(0,"a"),0)&&!J.l(s.h(0,"a"),1))o.j(new A.c(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.l(s.h(0,"x"),""))o.j(new A.c(b,"x"),"Expressions")
r=new A.c(b,"k")
q=s.h(0,"k")
if(!J.l(s.h(0,"a"),1)){if(t.j.b(q)){p=J.V(q)
p=p.gcp(q)&&p.ga5(q) instanceof A.I&&J.ai(p.ga5(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p)return new A.E(o.bk(q,r,c,h,e,null,0,0),null,!1,$.bq(),!1)
if(!t.j.b(q)||J.iY(q))o.j(r,"Expected keyframes")
return o.eN(q,r,c,h,f,e)},
L(a,b,c,d){return this.b1(a,b,c,d,null,!1,!0,0)},
b0(a,b,c,d,e){return this.b1(a,b,c,d,null,e,!0,0)},
fQ(a,b,c,d,e){return this.b1(a,b,c,d,null,!1,e,0)},
dG(a,b,c,d,e){return this.b1(a,b,c,d,e,!1,!0,0)},
fR(a,b,c,d,e){return this.b1(a,b,c,d,null,!1,!0,e)},
c5(a,b,c,d){var s
A.j(c)
if(b==null)return new Float32Array(c)
if(c!==d){s=a.a
s.toString
this.j(s,"Morph topology/component count changes")}return b},
bk(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this
t.c.a(e)
if(e!=null)return e.$5(a,b,f,g,h)
if(f==null)s=new Float32Array(c)
else s=f
if(t.j.b(a)){r=J.V(a)
if(r.gk(a)<c)n.j(b,"Expected "+c+" components")
for(q=0;q<c;++q){p=g+q
o=n.bz(r.h(a,q),b,q)
s.$flags&2&&A.d(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gk(a)>2&&n.R(r.h(a,2),b)!==d)n.j(b,"Non-planar component")}else{if(c!==1)n.j(b,"Expected "+c+" components")
r=n.bz(a,b,0)
s.$flags&2&&A.d(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
eN(e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3=this,e4=null,e5="Expected object",e6=t.j
e6.a(e7)
t.c.a(f2)
s=J.bF(e7)
r=s.gad(e7)
q=t.P
p=q.b(r)
o=p?r.h(0,"t"):e4
n=!1
if(p)if(r.h(0,"e")!=null){if(!J.l(r.h(0,"h"),1))if(typeof o=="number"){p=e3.e
p===$&&A.D()
p=o<p}else p=n
else p=n
n=p}p=s.gk(e7)
m=p+(n?1:0)
l=new Float64Array(m)
p=m*3
k=new Int32Array(p)
for(j=s.gD(e7),i=0,h=0,g=!1;j.u();){f=j.gB()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.l(f.h(0,"h"),1))++h
g=B.u.bG(g,f.h(0,"to")!=null)}j=h*(f1?8:4)
e=new Float64Array(j)
if(g)d=new Float32Array(m*4)
else d=e4
c=A.em()
b=A.em()
a=A.em()
a0=A.em()
for(a1=2*m,a2=m-1,a3=m+i,a4=e3.a.a,a5=e9===2,a6=m,a7=0,a8=0,a9=0;a9<s.gk(e7);++a9){b0=new A.c(e8,a9)
b1=s.h(e7,a9)
if(!q.b(b1))e3.j(b0,e5)
e3.O(b1,b0,B.aQ)
b2=b1.h(0,"to")
b3=b1.h(0,"ti")
b4=b2==null
b5=!b4
if(b5)e3.dN(b2,"to",e9,b0,d,a9*4)
b6=b3==null
if(!b6)e3.dN(b3,"ti",e9,b0,d,a9*4+2)
if(b4!==b6)e3.j(b0,"Incomplete spatial tangents")
b7=e3.bz(b1.h(0,"t"),b0,"t")
b4=a9===0
if(!b4){b6=a9-1
if(!(b6>=0&&b6<m))return A.a(l,b6)
b6=b7<=l[b6]}else b6=!1
if(b6)e3.j(b0,"Keyframe times must increase")
if(!(a9<m))return A.a(l,a9)
l[a9]=b7
b8=b1.h(0,"s")
b9=b1.h(0,"e")
if(b4){if(b8==null)e3.j(b0,"Missing initial keyframe value")
c0=e3.bk(b8,new A.c(b0,"s"),e9,f0,f2,e4,0,0)
if(b.b!==b)A.r(A.fa(""))
b.b=c0
if(a.b!==a)A.r(A.fa(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.r(A.fa(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.r(A.fa(""))
c.b=b4
b6=a.b
if(b6===a)A.r(A.aq(""))
B.h.C(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.r(A.aq(""))
if(typeof b4!=="number")return A.ad(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.r(A.aq(""))
b6=a.b
if(b6===a)A.r(A.aq(""))
if(typeof b6!=="number")return A.ad(b6)
J.k2(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.r(A.aq(""))
b6=a.b
if(b6===a)A.r(A.aq(""))
e3.bk(b8,new A.c(b0,"s"),e9,f0,f2,b4,c1,b6)}}c2=J.l(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.r(A.aq(""))
if(typeof b4!=="number")return A.ad(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.r(A.aq(""))
b5=a.b
if(b5===a)A.r(A.aq(""))
e3.bk(b9,new A.c(b0,"e"),e9,f0,f2,b4,c1,b5)
b4=m+a9
k.$flags&2&&A.d(k)
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=c1
c3=(c3|2)>>>0
a8=c1
a6=c4}else{b5=Math.min(a9+1,a2)
B.e.q(k,m+a9,b5*b4)}b4=a1+a9
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=a7
if(!c2&&b1.h(0,"o")!=null&&b1.h(0,"i")!=null){b4=b1.h(0,"o")
if(!q.b(b4))e3.j(new A.c(b0,"o"),e5)
b1=b1.h(0,"i")
if(!q.b(b1))e3.j(new A.c(b0,"i"),e5)
c5=b4.h(0,"x")
c6=b4.h(0,"y")
c7=b1.h(0,"x")
c8=b1.h(0,"y")
c9=e3.bm(c5,b0)
d0=e3.bm(c6,b0)
d1=e3.bm(c7,b0)
d2=e3.bm(c8,b0)
d3=Math.max(Math.max(c9,d0),Math.max(d1,d2))
b1=!1
if(d3!==1){b4=a.b
if(b4===a)A.r(A.aq(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e3.j(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e3.j(b0,"Easing component mismatch")
if(f1){b1=a.b
if(b1===a)A.r(A.aq(""))}else{b1=a.b
if(b1===a)A.r(A.aq(""))
b1=Math.min(A.li(b1),1)}d4=Math.min(A.li(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e6.b(c8),b4=e6.b(c7),b5=e6.b(c6),b6=e6.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.V(c5)
d6=d6.h(c5,d6.gk(c5)===1?0:d5)}else d6=c5
d7=B.c.F(A.eH(d6),0,1)
if(b5){d6=J.V(c6)
d6=d6.h(c6,d6.gk(c6)===1?0:d5)}else d6=c6
A.eH(d6)
if(b4){d8=J.V(c7)
d8=d8.h(c7,d8.gk(c7)===1?0:d5)}else d8=c7
d9=B.c.F(A.eH(d8),0,1)
if(b1){d8=J.V(c8)
d8=d8.h(c8,d8.gk(c8)===1?0:d5)}else d8=c8
A.eH(d8)
e0=a7+1
if(!(a7>=0&&a7<j))return A.a(e,a7)
e[a7]=d7
a7=e0+1
if(!(e0>=0&&e0<j))return A.a(e,e0)
e[e0]=d6
e0=a7+1
if(!(a7>=0&&a7<j))return A.a(e,a7)
e[a7]=d9
a7=e0+1
if(!(e0>=0&&e0<j))return A.a(e,e0)
e[e0]=d8
if(d7!==d6||d9!==d8)c3=(c3&4294967287)>>>0}}if(!(a9<p))return A.a(k,a9)
k[a9]=c3}if(m===1)return new A.E(b.ap(),e4,!1,$.bq(),!1)
if(n){e6=a0.ap()
if(typeof e6!=="number")return A.ad(e6)
c1=a2*e6
e6=e3.e
e6===$&&A.D()
if(!(a2>=0))return A.a(l,a2)
l[a2]=e6
e6=c.ap()
s=a.ap()
if(typeof s!=="number")return A.ad(s)
J.k2(e6,c1,c1+s,c.ap(),a8)
if(!(a2<p))return A.a(k,a2)
k[a2]=8
s=m+a2
k.$flags&2&&A.d(k)
if(!(s>=0&&s<p))return A.a(k,s)
k[s]=c1
a2=a1+a2
if(!(a2>=0&&a2<p))return A.a(k,a2)
k[a2]=a7}e6=a.ap()
s=a0.ap()
q=c.ap()
if(a7===j)p=e
else{e1=e.BYTES_PER_ELEMENT
e2=A.bb(0,a7,B.a.a_(e.byteLength,e1))*e1
if(B.a.T(e2,8)!==0)A.r(A.ao("The number of bytes to view must be a multiple of 8",e4))
p=J.lW(B.f.ga7(e),e.byteOffset+0*e1,B.a.J(e2,8))}p=A.mo(l,e6,s,k,q,p,d,a4)
return new A.E(e4,p,a4,new Float32Array(p.b),!1)},
dN(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.aL(a)<2)o.j(new A.c(d,b),"Invalid spatial tangent")
if(c!==2&&J.lV(a,new A.h5()))o.j(new A.c(d,b),"Spatial tangent on non-position")
s=J.V(a)
r=o.R(s.h(a,0),d)
q=o.R(s.h(a,1),d)
if(e!=null){e.$flags&2&&A.d(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=r
p=f+1
if(!(p<s))return A.a(e,p)
e[p]=q}},
bm(a,b){var s,r
if(!t.j.b(a)){this.R(a,b)
return 1}for(s=J.bF(a),r=s.gD(a);r.u();)this.R(r.gB(),b)
return s.gk(a)}}
A.h6.prototype={
$1(a){var s,r,q
t.D.a(a)
s=!1
if(a.gI()){r=this.a
q=r.d
q===$&&A.D()
if(a.c<=q){s=r.e
s===$&&A.D()
s=a.d>=s}}return s},
$S:33}
A.fX.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.c(new A.c(q.b,"ef"),a),o=q.a,n=o.au(0,J.ai(q.c,a),p)
o.O(n,p,B.H)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.l(s,r[a])||n.h(0,"v")==null)o.j(p,"Invalid effect parameter")
return o.L(n.h(0,"v"),new A.c(p,"v"),b,A.h([],t.n))},
$1(a){return this.$2$dimensions(a,1)},
$S:34}
A.fY.prototype={
$2(a,b){var s,r=this.b.$1(a)
if(r.a!=null){s=r.n(0)
if(0>=s.length)return A.a(s,0)
s=s[0]!==b}else s=!0
if(s)this.a.j(new A.c(new A.c(new A.c(this.c,"ef"),a),"v"),"Unsupported effect parameter value")},
$S:35}
A.fW.prototype={
$1(a){return J.l(J.ai(a,"ind"),this.a)},
$S:13}
A.h2.prototype={
$2(a,b){var s=this.a,r=this.c,q=s.L(this.b.h(0,a),new A.c(r,a),1,A.h([b],t.n))
if(q.a==null)s.j(new A.c(r,a),"Animated Inner Shadow")
s=q.n(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:37}
A.h3.prototype={
$5(a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4="Invalid path topology",a5=t.j
if(a5.b(a6)){s=J.V(a6)
s=s.gk(a6)===1&&s.ga5(a6) instanceof A.I}else s=!1
if(s)a6=J.m_(a6)
s=this.b
r=s.au(0,a6,a7)
s.O(r,a7,B.aO)
q=r.h(0,"c")
if(!A.aX(q))s.j(new A.c(a7,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.u.bG(p.c,q!==o)
o=a7.a
n=o==null?null:o.b
if(A.n(n)){m=p.a
if(m==null){o=J.aL(a5.a(J.ai(this.c,"k")))
m=p.a=new Uint8Array(o*2)}p=a7.b==="e"?1:0
p=n*2+p
o=q?1:2
m.$flags&2&&A.d(m)
if(!(p>=0&&p<m.length))return A.a(m,p)
m[p]=o}l=r.h(0,"v")
k=r.h(0,"i")
j=r.h(0,"o")
if(l instanceof A.cf&&k instanceof A.cf&&j instanceof A.cf){i=l.b
if(i!==k.b||i!==j.b)s.j(a7,a4)
h=s.c5(a7,a8,i*6,b0)
g=l.a
f=k.a
e=j.a
for(a5=g.length,s=h.$flags|0,p=f.length,o=e.length,d=0;d<i;++d){c=d*2
b=a9+d*6
if(!(c<a5))return A.a(g,c)
a=g[c]
s&2&&A.d(h)
a0=h.length
if(!(b>=0&&b<a0))return A.a(h,b)
h[b]=a
a=b+1
a1=c+1
if(!(a1<a5))return A.a(g,a1)
a2=g[a1]
if(!(a<a0))return A.a(h,a)
h[a]=a2
a2=b+2
if(!(c<p))return A.a(f,c)
a=f[c]
if(!(a2<a0))return A.a(h,a2)
h[a2]=a
a=b+3
if(!(a1<p))return A.a(f,a1)
a2=f[a1]
if(!(a<a0))return A.a(h,a)
h[a]=a2
a2=b+4
if(!(c<o))return A.a(e,c)
a=e[c]
if(!(a2<a0))return A.a(h,a2)
h[a2]=a
a=b+5
if(!(a1<o))return A.a(e,a1)
a1=e[a1]
if(!(a<a0))return A.a(h,a)
h[a]=a1}return h}p=!0
if(a5.b(l))if(a5.b(k))if(a5.b(j)){a5=J.V(l)
a5=a5.gk(l)!==J.aL(k)||a5.gk(l)!==J.aL(j)}else a5=p
else a5=p
else a5=p
if(a5)s.j(a7,a4)
a5=J.V(l)
h=s.c5(a7,a8,a5.gk(l)*6,b0)
a3=new A.h4(s,a7,h)
for(d=0;d<a5.gk(l);++d){b=a9+d*6
a3.$2(a5.h(l,d),b)
a3.$2(J.ai(k,d),b+2)
a3.$2(J.ai(j,d),b+4)}return h},
$S:14}
A.h4.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.aL(a)!==2)m.a.j(m.b,"Expected 2D path point")
s=m.c
r=m.a
q=J.V(a)
p=m.b
o=r.R(q.h(a,0),p)
s.$flags&2&&A.d(s)
n=s.length
if(!(b>=0&&b<n))return A.a(s,b)
s[b]=o
o=b+1
p=r.R(q.h(a,1),p)
if(!(o<n))return A.a(s,o)
s[o]=p},
$S:39}
A.h1.prototype={
$1(a){var s,r,q,p
t.cH.a(a)
for(s=a.length,r=this.a,q=0;q<a.length;a.length===s||(0,A.Z)(a),++q){p=a[q]
if(p instanceof A.X)B.b.m(r,p)
if(p instanceof A.a6)this.$1(p.a)}},
$S:40}
A.h_.prototype={
$1(a){return t.bD.a(a).a},
$S:41}
A.h0.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a6)||a.ge6()},
$S:1}
A.fZ.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.V(a)
r=k.b*4
s=s.gk(a)<r||(s.gk(a)-r&1)===1}else s=!0
if(s)k.a.j(b,"Invalid gradient stops")
s=k.a
r=J.V(a)
q=s.c5(b,c,r.gk(a),e)
for(p=k.b,o=0;o<r.gk(a);++o){n=s.R(r.h(a,o),b)
if(o<p*4&&B.a.T(o,4)!==0){m=B.a.F(B.c.H(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.d(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:14}
A.h5.prototype={
$1(a){return!J.l(a,0)},
$S:13}
A.hc.prototype={
ca(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i,h
t.ew.a(d)
t.ae.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.jX()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.n(n)?new A.c(p,n):new A.c(p,A.G(n))}if(this.fH(a,r,b,p,e==null?new A.bY(t.ao):e))return}for(q=a.gar(),q=q.gD(q),m=t.j,l=t.h;q.u();){k=q.gB()
if(k==="k")continue
j=a.h(0,k)
if(!s.b(j))i=!m.b(j)||l.b(j)
else i=!1
if(i)continue
B.b.m(d,k)
this.ca(j,b,c,d,e,k==="ks"&&J.l(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a)&&!t.h.b(a))for(m=J.V(a),l=t.h,h=0;h<m.gk(a);++h){j=m.h(a,h)
if(!s.b(j))k=!q.b(j)||l.b(j)
else k=!1
if(k)continue
B.b.m(d,h)
this.dL(j,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
fU(a,b,c,d){return this.ca(a,b,c,d,null,!1)},
dL(a,b,c,d,e){return this.ca(a,b,c,d,e,!1)},
fH(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null
t.P.a(a0)
t.bC.a(a4)
if(!a4.m(0,a0))b.a.j(a3,"Cyclic expression reference")
try{i=$.lO()
if(i.b.test(a1)){a0.A(0,"x")
return!0}s=new A.c(a3,"x")
r=$.lM().e3(a1)
if(r==null)b.a.j(s,"Unsupported expression syntax")
q=a2
p=null
i=$.jY()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dO(0,h)
h=new A.cj(h.a,h.b,h.c)
i=t.j
g=t.d
f=b.a
while(h.u()){e=h.d
o=e==null?g.a(e):e
d=o.b
if(1>=d.length)return A.a(d,1)
d=d[1]
d.toString
n=d
d=$.lN()
c=A.G(n)
m=d.b.test(c)?B.z.e_('"'+A.w(n)+'"',a):n
p=b.c7(q,"nm",A.G(m))
if(p==null)f.j(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.C)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=b.c7(q,"ty","tr")
l=i==null?a:i.h(0,"s")
break
case"transform.rotation":i=b.c7(q,"ty","tr")
l=i==null?a:i.h(0,"r")
break
default:i=p
l=i==null?a:J.ai(i,"o")
break}k=l
j=f.au(0,k,s)
if(j===a0){a0.A(0,"x")
return!0}b.dL(j,a2,s,A.h([],t.f),a4)
a0.l(0)
a0.ak(0,j)
return!1}finally{a4.A(0,a0)}},
c7(a,b,c){var s,r,q,p
for(s=J.cA(a),r=t.P,q=null;s.u();){p=s.gB()
if(!r.b(p)||!J.l(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q}}
A.hX.prototype={
cA(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.au(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.ai(j,"x")
s=typeof n=="string"?$.jX().e3(n):null
if(s==null){k=k.dh(j,b)
i.q(0,j,k)
return k}r=new A.c(b,"x")
k.O(j,b,B.I)
if(J.ai(j,"a")!=null&&!J.l(J.ai(j,"a"),0)&&!J.l(J.ai(j,"a"),1))k.j(new A.c(b,"a"),"Invalid animated flag")
m=l.d
if(!m.m(0,j))k.j(r,"Cyclic path reference")
try{q=null
p=null
o=l.fP(s,r)
q=o.a
p=o.b
k=l.cA(q,p)
i.q(0,j,k)
return k}finally{m.A(0,j)}},
fP(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.da(j.b,s,B.n,b,"layer")
q=r.a
if(!J.l(q.h(0,"ty"),4))j.a.j(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.c(r.b,"shapes")
s=$.jY()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dO(0,i)
i=new A.cj(i.a,i.b,i.c)
s=t.d
while(i.u()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.da(p,m,o,b,"content")
q=l.a
o=l.b
p=J.l(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.c(o,"it")}k=q.h(0,"ks")
if(!J.l(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.j(b,"Path reference needs a B\xe9zier path")
return new A.x(k,new A.c(o,"ks"))},
da(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.V(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gk(a);++m){l=s.h(a,m)
if(r.b(l)&&J.l(l.h(0,"nm"),b)){if(o!=null)q.j(d,p)
n=m
o=l}}if(o!=null)return new A.x(o,new A.c(c,n))}this.a.j(d,"Missing "+e+" reference: "+b)}}
A.er.prototype={
a0(a,b,c){var s
A.ou(c,t.K,"T","_copy")
s=c.a(this.b.ec(c.a(a),c.i("0()").a(b)))
return s},
E(a){var s=t.A
s.a(a)
if(a.a!=null)return a
return this.a0(a,new A.hr(a),s)},
eg(a){return this.a0(a,new A.hs(this,a),t.d1)},
cF(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.a6)return s.bF(a)
if(a instanceof A.X)return s.a0(a,new A.hl(s,a),r)
if(a instanceof A.bl)return s.a0(a,new A.hm(s,a),r)
if(a instanceof A.aR)return s.a0(a,new A.hn(s,a),r)
if(a instanceof A.aB)return s.a0(a,new A.ho(s,a),r)
if(a instanceof A.aT)return s.a0(a,new A.hp(s,a),r)
if(a instanceof A.b1)return s.a0(a,new A.hq(s,a),r)
throw A.f(A.as("Unknown compiled geometry"))},
hb(a){var s=t.I
s.a(a)
if(a instanceof A.a6)return this.bF(a)
if(a instanceof A.bk)return this.a0(a,new A.hf(this,a),s)
throw A.f(A.as("Unknown compiled paint"))},
bF(a){return this.a0(a,new A.hh(this,a),t.eV)},
em(a){return this.a0(a,new A.hg(this,a),t.cK)},
hM(a,b){return this.a0(b,new A.ht(this,b),t.e_)},
h0(a){return this.a0(a,new A.he(this,a),t.bo)},
hw(a){var s=t.J
s.a(a)
return this.a0(a,new A.hj(this,a),s)},
cr(a){var s=t.D
s.a(a)
return this.a0(a,new A.hi(this,a),s)},
cC(a){return this.a0(a,new A.hk(this,a),t.G)}}
A.hr.prototype={
$0(){var s=this.a,r=s.d.length
if(r===0)r=$.bq()
else r=new Float32Array(r)
return new A.E(s.a,s.b,s.c,r,s.f)},
$S:48}
A.hs.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.E(o.a),m=p.E(o.b),l=p.E(o.c),k=p.E(o.d),j=p.E(o.e),i=o.f
i=i==null?q:p.E(i)
s=o.r
s=s==null?q:p.E(s)
r=o.w
r=r==null?q:p.E(r)
o=o.x
return A.jx(n,m,l,k,j,i,s,r,o==null?q:p.E(o))},
$S:49}
A.hl.prototype={
$0(){return new A.X(this.a.cF(this.b.a))},
$S:50}
A.hm.prototype={
$0(){var s=this.b
return new A.bl(this.a.hM(0,s.a),s.b)},
$S:51}
A.hn.prototype={
$0(){var s=this.b,r=s.a,q=A.a3(r),p=q.i("a0<1,z>")
r=A.b7(new A.a0(r,q.i("z(1)").a(this.a.gb9()),p),p.i("ag.E"))
r.$flags=1
return A.n2(r,s.b)},
$S:52}
A.ho.prototype={
$0(){var s=this.b
return new A.aB(this.a.E(s.e),s.f,s.r)},
$S:53}
A.hp.prototype={
$0(){var s=this.b,r=this.a
return new A.aT(s.e,s.f,r.E(s.r),r.E(s.w),r.E(s.x))},
$S:82}
A.hq.prototype={
$0(){var s,r=this.b,q=this.a,p=q.E(r.r),o=q.E(r.w),n=q.E(r.x),m=q.E(r.y),l=q.E(r.z),k=r.Q
k=k==null?null:q.E(k)
s=r.as
q=s==null?null:q.E(s)
return new A.b1(r.e,r.f,p,o,n,m,l,k,q)},
$S:55}
A.hf.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a3(o),l=m.i("a0<1,z>")
o=A.b7(new A.a0(o,m.i("z(1)").a(n.gb9()),l),l.i("ag.E"))
o.$flags=1
m=n.E(p.b)
l=n.E(p.c)
s=n.E(p.d)
r=p.y
r=r==null?null:n.em(r)
q=p.z
n=q==null?null:n.h0(q)
return A.jw(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:56}
A.hh.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a3(q),n=o.i("a0<1,z>")
q=A.b7(new A.a0(q,o.i("z(1)").a(p.gb9()),n),n.i("ag.E"))
q.$flags=1
o=r.b
n=A.a3(o)
s=n.i("a0<1,aH>")
o=A.b7(new A.a0(o,n.i("aH(1)").a(p.gha()),s),s.i("ag.E"))
o.$flags=1
return A.ju(q,o,p.eg(r.c))},
$S:57}
A.hg.prototype={
$0(){var s,r=this.b,q=this.a,p=q.E(r.c),o=q.E(r.d),n=q.E(r.e),m=r.f
m=m==null?null:q.E(m)
s=r.r
q=s==null?null:q.E(s)
return A.kD(r.a,p,o,n,r.w,m,q)},
$S:58}
A.ht.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a3(r),o=p.i("a0<1,z>")
r=A.b7(new A.a0(r,p.i("z(1)").a(q.gb9()),o),o.i("ag.E"))
return A.nd(r,q.E(s.b),q.E(s.c),q.E(s.d),s.e)},
$S:59}
A.he.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a3(r),o=p.i("a0<1,E>")
r=A.b7(new A.a0(r,p.i("E(1)").a(q.ghK()),o),o.i("ag.E"))
return A.kB(r,q.E(s.b))},
$S:60}
A.hj.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.E(q.e),o=s.E(r.c),n=r.e
s=n==null?null:s.E(n)
return A.n1(new A.aB(p,q.f,q.r),r.b,o,r.d,s)},
$S:61}
A.hi.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.eg(l.a),j=l.b
j=j==null?n:m.bF(j)
s=l.f
s=s==null?n:m.cC(s)
r=l.x
r=r==null?n:m.E(r)
q=l.z
if(q==null)q=n
else{p=A.a3(q)
o=p.i("a0<1,a8>")
q=A.b7(new A.a0(q,p.i("a8(1)").a(m.ghv()),o),o.i("ag.E"))}p=l.at
p=p==null?n:new A.eq(m.E(p.a),m.E(p.b))
o=l.as
o=o==null?n:A.kE(o.a,o.b,o.c)
r=A.kF(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.cr(k)
r.ch=l.ch
return r},
$S:62}
A.hk.prototype={
$0(){var s,r,q,p,o=this.b,n=A.js(o.a),m=o.b
m===$&&A.D()
n.b=m
m=o.c
m===$&&A.D()
n.c=m
m=o.d
m===$&&A.D()
n.d=m
m=o.e
m===$&&A.D()
n.e=m
m=o.f
m===$&&A.D()
n.f=m
n.x=o.x
n.y=o.y
m=n.w
o=o.w
s=this.a
r=A.a3(o)
B.b.ak(m,new A.a0(o,r.i("a7(1)").a(s.ghs()),r.i("a0<1,a7>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.cr(p)}}return n},
$S:63}
A.bh.prototype={
ghm(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.n(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
hh(a,b,c){var s,r,q,p,o=this.f
if(o==null)o=null
else{o=o.n(a)
if(0>=o.length)return A.a(o,0)
o=o[0]}s=(o==null?0:o)*0.01
if(s===0)return null
if(s<=-1)r=-0.99
else r=s>=1?0.99:s
o=Math.atan2(c,b)
q=this.r
if(q==null)q=null
else{q=q.n(a)
if(0>=q.length)return A.a(q,0)
q=q[0]}p=o+(q==null?0:q)*3.141592653589793/180
return new A.x(Math.cos(p)*r,Math.sin(p)*r)},
eM(a,b){var s,r,q,p,o,n,m
if(this.b===0)return 1
s=this.a*4
r=a.length
if(!(s>=0&&s<r))return A.a(a,s)
if(b<=a[s]){q=s+1
if(!(q<r))return A.a(a,q)
return a[q]}for(p=s+2;p<r;p+=2){q=a[p]
if(b<=q){o=a[p-2]
n=q-o
m=n===0?0:(b-o)/n
q=a[p-1]
o=p+1
if(!(o<r))return A.a(a,o)
return q+(a[o]-q)*m}}return B.h.gad(a)}}
A.X.prototype={
gI(){return this.a.gI()},
ga6(){return this.a.ga6()},
a8(a){return this.a.a8(a)},
$iz:1}
A.bl.prototype={
gI(){return this.a.gI()},
ga6(){return this.a.gI()},
a8(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].a8(a)},
$iz:1}
A.bC.prototype={
gI(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.b.ab(r.a,new A.i3())
r.f!==$&&A.S()
q=r.f=s}return q}}
A.i3.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.cn.prototype={
gI(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.b.ab(r.a,new A.h7())
r.e!==$&&A.S()
q=r.e=s}return q}}
A.h7.prototype={
$1(a){return t.A.a(a).a!=null},
$S:64}
A.c1.prototype={
gd9(){var s=this.y
if(s==null){s=new Float64Array(16)
s[10]=1
s[15]=1
this.y=s}return s},
gaR(){var s,r,q=this,p=null,o=q.at
if(o===$){s=!1
if(q.a.a!=null)if(q.b.a!=null){if(q.c.a!=null)if(q.d.a!=null){r=q.w
r=r==null?p:r.a!=null
if(r!==!1){r=q.x
r=r==null?p:r.a!=null
if(r!==!1){r=q.f
r=r==null?p:r.a!=null
if(r!==!1){r=q.r
r=r==null?p:r.a!=null
r=r!==!1}else r=s}else r=s}else r=s}else r=s
else r=s
s=r}o=q.at=s}return o},
gcq(){var s,r=this,q=r.ax
if(q===$){s=A.jy(r.c,100,100)&&A.eC(r.d,0)&&A.eC(r.w,0)
r.ax!==$&&A.S()
q=r.ax=s}return q},
gaB(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gcq())if(A.jy(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.jy(q.b,0,0)
else r=A.eC(r,0)&&A.eC(q.r,0)
s=r}q.ay!==$&&A.S()
p=q.ay=s}return p},
gI(){var s,r=this,q=r.ch
if(q===$){s=r.gaR()&&r.e.a!=null
r.ch!==$&&A.S()
q=r.ch=s}return q},
gcn(){var s,r=this,q=r.CW
if(q===$){s=A.eC(r.e,100)
r.CW!==$&&A.S()
r.CW=s
q=s}return q},
cZ(a){var s,r,q,p,o=this
if(o.as!==a)s=o.gaR()&&!isNaN(o.as)
else s=!0
if(s)return
o.as=a
r=o.a.n(a)
s=o.f
q=s==null
p=q||o.r==null?o.b.n(a):null
if(q)s=null
else{s=s.n(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(0>=p.length)return A.a(p,0)
s=p[0]}q=r.length
if(0>=q)return A.a(r,0)
o.z=s-r[0]
s=o.r
if(s==null)s=null
else{s=s.n(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(1>=p.length)return A.a(p,1)
s=p[1]}if(1>=q)return A.a(r,1)
o.Q=s-r[1]},
e9(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gaR()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gd9()
a4.as=a6
r=a4.gd9()
q=a4.a.n(a6)
p=a4.b.n(a6)
o=a4.c.n(a6)
s=a4.d.n(a6)
if(0>=s.length)return A.a(s,0)
n=s[0]
s=Math.abs(n)<0.00001
m=s?1:Math.cos(n*3.141592653589793/180)
l=s?0:Math.sin(n*3.141592653589793/180)
s=o.length
if(0>=s)return A.a(o,0)
k=o[0]/100
if(1>=s)return A.a(o,1)
j=o[1]/100
r.$flags&2&&A.d(r)
r[0]=m*k
r[1]=l*k
r[4]=-l*j
r[5]=m*j
s=a4.w
if(s==null)i=a5
else{s=s.n(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]
i=s}if(i==null)i=0
if(i!==0){s=a4.x
if(s==null)s=a5
else{s=s.n(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]}h=(90-(s==null?0:s))*3.141592653589793/180
g=Math.cos(h)
f=Math.sin(h)
e=Math.tan(i*3.141592653589793/180)
s=e*g
d=s*f
c=1+d
b=-e*f*f
a=s*g
a0=1-d
r[0]=(m*c-l*b)*k
r[1]=(l*c+m*b)*k
r[4]=(m*a-l*a0)*j
r[5]=(l*a+m*a0)*j}s=a4.f
if(s==null)s=a5
else{s=s.n(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(0>=p.length)return A.a(p,0)
s=p[0]}d=r[0]
a1=q.length
if(0>=a1)return A.a(q,0)
a2=q[0]
a3=r[4]
if(1>=a1)return A.a(q,1)
r[12]=s-d*a2-a3*q[1]
a3=a4.r
if(a3==null)s=a5
else{s=a3.n(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(1>=p.length)return A.a(p,1)
s=p[1]}r[13]=s-r[1]*q[0]-r[5]*q[1]
return r},
cu(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaB())return a
if(b.gcq()){b.cZ(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.az(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.e9(a0)
p=q[0]
o=q[1]
n=q[4]
m=q[5]
s=a.a
r=a.c
l=(s+r)*0.5
k=a.b
j=a.d
i=(k+j)*0.5
h=(r-s)*0.5
g=(j-k)*0.5
f=p*l+n*i+q[12]
e=o*l+m*i+q[13]
d=Math.abs(p)*h+Math.abs(n)*g
c=Math.abs(o)*h+Math.abs(m)*g
return new A.az(f-d,e-c,f+d,e+c)}}
A.a8.prototype={
gI(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gcc(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.hL.prototype={
aP(a){var s=this.c
return 255-A.a2((255-(B.a.dt(s,a)&255))*(s>>>24))}}
A.eq.prototype={
fX(a){var s,r,q,p=this.a.n(a),o=new A.hd(),n=this.b.n(a)
if(0>=n.length)return A.a(n,0)
n=o.$1(n[0])
if(typeof n!=="number")return n.a9()
s=p.length
if(0>=s)return A.a(p,0)
r=o.$1(p[0])
if(typeof r!=="number")return r.a9()
if(1>=s)return A.a(p,1)
q=o.$1(p[1])
if(typeof q!=="number")return q.a9()
if(2>=s)return A.a(p,2)
o=o.$1(p[2])
if(typeof o!=="number")return A.ad(o)
return(n<<24|r<<16|q<<8|o)>>>0}}
A.hd.prototype={
$1(a){return B.c.H(B.c.F(a,0,1)*255)},
$S:65}
A.a7.prototype={
gI(){var s,r,q=this,p=null,o=q.db
if(o===$){s=!1
if(q.a.gI()){r=q.x
r=r==null?p:r.a!=null
if(r!==!1){r=q.b
r=r==null?p:r.gI()
if(r!==!1){r=q.f
r=r==null?p:r.gI()
if(r!==!1){r=q.at
if(r==null)r=p
else r=r.a.a!=null&&r.b.a!=null
if(r!==!1){r=q.cy
r=r==null?p:r.gI()
if(r!==!1){r=q.z
r=r==null?p:B.b.ab(r,new A.hQ())
r=r!==!1}else r=s}else r=s}else r=s}else r=s
s=r}}q.db!==$&&A.S()
o=q.db=s}return o},
ghk(){var s,r=this,q=r.dx
if(q===$){s=r.z
s=s==null?null:B.b.aq(s,new A.hO())
r.dx!==$&&A.S()
q=r.dx=s===!0}return q},
ghn(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.b.ab(s,new A.hP())
r.dy!==$&&A.S()
q=r.dy=s===!0}return q},
ge7(){var s,r,q=this,p=q.fx
if(p===$){if(q.a.gaR()){s=q.cy
s=s==null?null:s.ge7()
r=s!==!1}else r=!1
q.fx!==$&&A.S()
p=q.fx=r}return p},
ge5(){var s,r,q=this,p=q.fy
if(p===$){if(q.a.gaB()){s=q.cy
s=s==null?null:s.ge5()
r=s===!0}else r=!0
q.fy!==$&&A.S()
p=q.fy=r}return p},
aw(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null
if(!h.ej(a))return g
s=h.f
r=s==null
if(r&&h.gI()&&!isNaN(h.id))return h.go
if(h.id===a)return h.go
h.id=a
q=h.b
p=q==null?g:q.b2(a)
if(!r){r=h.x
if(r!=null){r=r.n(a)
if(0>=r.length)return A.a(r,0)
r=r[0]
q=s.f
q===$&&A.D()
o=s.d
o===$&&A.D()
n=r*q-o}else n=(a-h.r)/h.w
p=A.c4(p,s.aw(n))}if(p==null)return h.go=null
s=h.z
if(s!=null)r=s.length===1&&B.b.gaf(s).gcc()||B.b.ab(s,new A.hR())
else r=!1
if(r){for(m=g,l=0;l<s.length;++l){k=s[l]
if(!k.d){r=k.b
r=r==="a"||r==="i"||r==="f"}else r=!1
if(r){r=k.a.a8(a)
if(r==null)j=g
else{q=k.e
if(q==null)q=g
else{q=q.n(a)
if(0>=q.length)return A.a(q,0)
q=q[0]}if(q==null)q=0
q=Math.max(0,q)
j=new A.az(r.a-q,r.b-q,r.c+q,r.d+q)}if(j!=null)m=A.c4(m,j)}}if(m!=null){p=p.by(m)
if(p.gS(0))return h.go=null}}for(i=h;i!=null;i=i.cy)p=i.a.cu(p,a)
return h.go=p},
ej(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
ht(a,b){var s=this.a.e.n(a)
if(0>=s.length)return A.a(s,0)
return B.a.F(B.c.M(b*B.c.H(s[0])/100),0,255)},
aT(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gcc()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.n(a)
if(0>=q.length)return A.a(q,0)
return B.a.F(B.c.H(q[0]*255/100),0,255)}return 255}}
A.hQ.prototype={
$1(a){return t.J.a(a).gI()},
$S:2}
A.hO.prototype={
$1(a){return t.J.a(a).b!=="n"},
$S:2}
A.hP.prototype={
$1(a){t.J.a(a)
return a.b==="n"||a.gI()},
$S:2}
A.hR.prototype={
$1(a){t.J.a(a)
return a.b==="a"&&!a.d},
$S:2}
A.a6.prototype={
ge6(){var s,r=this,q=r.d
if(q===$){s=B.b.aq(r.a,new A.hH())
r.d!==$&&A.S()
r.d=s
q=s}return q},
gb8(){var s,r=this,q=r.e
if(q===$){s=r.f6()
r.e!==$&&A.S()
r.e=s
q=s}return q},
f6(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.b.gaf(n)
if(s instanceof A.a6){r=s.c
r=r.gaB()&&r.gcn()}else r=!1
return r?s.gb8():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.a6){r=o.c
r=r.gaB()&&r.gcn()}else r=!1
if(r){if(q==null)q=B.b.eu(n,0,p)
B.b.ak(q,o.gb8())}else if(q!=null)B.b.m(q,o)}return q==null?n:q},
gcE(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gb8()
r=null
if(!(s.length!==1)){q=B.b.gaf(s)
A:{if(q instanceof A.bk){s=q
break A}if(q instanceof A.a6){s=q.gcE()
break A}s=r
break A}r=s}p.f!==$&&A.S()
o=p.f=r}return o},
gI(){var s,r=this,q=r.ax
if(q===$){s=r.c.gI()&&B.b.ab(r.a,new A.hJ())&&B.b.ab(r.b,new A.hK())
r.ax!==$&&A.S()
q=r.ax=s}return q},
ga6(){var s,r=this,q=r.ay
if(q===$){s=r.c.gaR()&&B.b.ab(r.a,new A.hI())
r.ay!==$&&A.S()
q=r.ay=s}return q},
a8(a){var s,r,q,p,o=this
if(o.ga6()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.Z)(s),++p)q=A.c4(q,s[p].a8(a))
if(q==null)return o.z=null
return o.z=o.c.cu(q,a)},
b2(a){var s,r,q,p,o,n=this
if(n.gI()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.n(a)
if(0>=r.length)return A.a(r,0)
if(B.c.H(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.Z)(r),++o)p=A.c4(p,r[o].b2(a))
if(p==null)return n.Q=null
return n.Q=s.cu(p,a)},
$iaH:1,
$iz:1}
A.hH.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a6)||a.ge6()},
$S:1}
A.hJ.prototype={
$1(a){return t.u.a(a).gI()},
$S:1}
A.hK.prototype={
$1(a){return t.I.a(a).gI()},
$S:67}
A.hI.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.aR.prototype={
gI(){var s,r=this,q=r.d
if(q===$){s=B.b.ab(r.a,new A.hU())
r.d!==$&&A.S()
r.d=s
q=s}return q},
ga6(){var s,r=this,q=r.e
if(q===$){s=B.b.ab(r.a,new A.hT())
r.e!==$&&A.S()
r.e=s
q=s}return q},
a8(a){var s,r,q,p,o,n,m,l,k=this,j=null
if(k.ga6()&&!isNaN(k.x))return k.w
if(k.x===a)return k.w
k.x=a
s=k.a
r=s.length
if(r===0)return k.w=null
if(r===1){q=k.b
if(q===3||q===4)s=j
else{if(0>=r)return A.a(s,0)
s=s[0].a8(a)}return k.w=s}q=k.b
if(q===4){p=B.b.gad(s).a8(a)
if(p==null)return k.w=null
for(o=j,n=0;n<s.length-1;++n)o=A.c4(o,s[n].a8(a))
if(o==null)return k.w=null
m=p.by(o)
return k.w=m.gS(0)?j:m}if(q===3)--r
for(l=j,n=0;n<r;++n){if(!(n<s.length))return A.a(s,n)
l=A.c4(l,s[n].a8(a))}return k.w=l},
$iz:1}
A.hU.prototype={
$1(a){return t.u.a(a).gI()},
$S:1}
A.hT.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.et.prototype={
ga6(){return this.gI()},
a8(a){var s=this
if(s.gI()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.cg(a)},
$iz:1}
A.aB.prototype={
gI(){return this.e.a!=null},
cg(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.n(a),f=g.length
if(f===0)return B.aM
if(0>=f)return A.a(g,0)
s=g[0]
if(1>=f)return A.a(g,1)
r=g[1]
for(q=r,p=s,o=0;o<f;o+=6){n=g[o]
m=o+1
if(!(m<f))return A.a(g,m)
l=g[m]
m=o+2
if(!(m<f))return A.a(g,m)
k=n+g[m]
m=o+3
if(!(m<f))return A.a(g,m)
j=l+g[m]
m=o+4
if(!(m<f))return A.a(g,m)
i=n+g[m]
m=o+5
if(!(m<f))return A.a(g,m)
h=l+g[m]
if(n<s)s=n
if(n>p)p=n
if(l<r)r=l
if(l>q)q=l
if(k<s)s=k
if(k>p)p=k
if(j<r)r=j
if(j>q)q=j
if(i<s)s=i
if(i>p)p=i
if(h<r)r=h
if(h>q)q=h}return new A.az(s,r,p,q)}}
A.aT.prototype={
gI(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
cg(a){var s,r,q,p=this.r.n(a),o=this.w.n(a),n=o.length
if(0>=n)return A.a(o,0)
s=Math.abs(o[0]*0.5)
if(1>=n)return A.a(o,1)
r=Math.abs(o[1]*0.5)
n=p.length
if(0>=n)return A.a(p,0)
q=p[0]
if(1>=n)return A.a(p,1)
n=p[1]
return new A.az(q-s,n-r,q+s,n+r)}}
A.b1.prototype={
gI(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
cg(a){var s,r,q,p=this,o=p.w.n(a),n=p.y.n(a)
if(0>=n.length)return A.a(n,0)
n=n[0]
s=p.z.n(a)
if(0>=s.length)return A.a(s,0)
r=Math.abs(n)*(1+Math.abs(s[0]*0.01)*0.5)
if(p.e){n=p.Q
if(n==null)n=null
else{n=n.n(a)
if(0>=n.length)return A.a(n,0)
n=n[0]}if(n==null)n=0
s=p.as
if(s==null)s=null
else{s=s.n(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null)s=0
q=Math.abs(n)*(1+Math.abs(s)*0.01*0.5)
if(q>r)r=q}n=o.length
if(0>=n)return A.a(o,0)
s=o[0]
if(1>=n)return A.a(o,1)
n=o[1]
return new A.az(s-r,n-r,s+r,n+r)},
f7(d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=this,d4=t.bp
d4.a(d6)
d4.a(d7)
t.fi.a(d8)
t.O.a(d9)
s=d3.w.n(d5)
d4=s.length
if(0>=d4)return A.a(s,0)
r=s[0]
if(1>=d4)return A.a(s,1)
q=s[1]
d4=d3.x.n(d5)
if(0>=d4.length)return A.a(d4,0)
p=d4[0]
d4=d3.y.n(d5)
if(0>=d4.length)return A.a(d4,0)
o=d4[0]
d4=d3.z.n(d5)
if(0>=d4.length)return A.a(d4,0)
n=d4[0]
d4=d3.r.n(d5)
if(0>=d4.length)return A.a(d4,0)
m=d4[0]
if(d3.e){l=Math.max(1,m)
d4=d3.Q
if(d4==null)k=null
else{d4=d4.n(d5)
if(0>=d4.length)return A.a(d4,0)
d4=d4[0]
k=d4}if(k==null)k=0
d4=d3.as
if(d4==null)j=null
else{d4=d4.n(d5)
if(0>=d4.length)return A.a(d4,0)
d4=d4[0]
j=d4}if(j==null)j=0
i=(p-90)*3.141592653589793/180
h=6.283185307179586/l
if(d3.f)h*=-1
g=h/2
f=l-Math.floor(l)
e=f<0.0001||f>0.9999?0:f
d4=e===0
d=!d4
if(d)i+=g*(1-e)
c=j/100
b=n/100
a=Math.sin(i)
a0=Math.cos(i)
if(d){a1=k+e*(o-k)
a2=r+a1*a0
a3=q+a1*a
d6.$2(a2,a3)
i+=h*e/2}else{a2=r+o*a0
a3=q+o*a
d6.$2(a2,a3)
i+=g
a1=0}a4=d4?o:a1
a5=B.c.W(l)*2
for(d4=Math.abs(c)<=0.0001,a6=a1!==0,a7=a5-2,a8=h*e/2,a9=a5-1,b0=Math.abs(b)<=0.0001,b1=!1,b2=0;b2<a5;++b2,a4=b3,a0=b6,a=b5,a3=b8,a2=b7){b3=b1?o:k
b4=a6&&b2===a7?a8:g
if(a6&&b2===a9)b3=a1
b5=Math.sin(i)
b6=Math.cos(i)
b7=r+b3*b6
b8=q+b3*b5
if(d4&&b0)d7.$2(b7,b8)
else{b9=A.ik(a,a0,a4)
c0=A.ik(b5,b6,b3)
c1=b1?c:b
c2=b1?b:c
c3=b1?k:o
c4=b1?o:k
c5=c3*c1*0.47829
c6=c5*b9.a
c7=c5*b9.b
c5=c4*c2*0.47829
c8=c5*c0.a
c9=c5*c0.b
if(d)if(b2===0){c6*=e
c7*=e}else if(b2===a9){c8*=e
c9*=e}d8.$8(a2-c6,a3-c7,b7+c8,b8+c9,b7,b8,a2,a3)}i+=b4
b1=!b1}d9.$0()}else{l=Math.max(1,B.c.P(m))
i=(p-90)*3.141592653589793/180
h=6.283185307179586/l
if(d3.f)h*=-1
d0=n/100
a=Math.sin(i)
a0=Math.cos(i)
a2=r+o*a0
a3=q+o*a
d6.$2(a2,a3)
i+=h
for(d4=Math.abs(d0)>0.0001,d=o*d0*0.25,b2=0;b2<l;++b2,a3=b8,a2=b7,a0=b6,a=b5){b5=Math.sin(i)
b6=Math.cos(i)
b7=r+o*b6
b8=q+o*b5
if(d4){d1=A.ik(a,a0,o)
d2=A.ik(b5,b6,o)
d8.$8(a2-d*d1.a,a3-d*d1.b,b7+d*d2.a,b8+d*d2.b,b7,b8,a2,a3)}else d7.$2(b7,b8)
i+=h}d9.$0()}}}
A.bk.prototype={
gc4(){var s,r=this,q=r.fr
if(q===$){s=B.b.ab(r.a,new A.i0())
r.fr!==$&&A.S()
r.fr=s
q=s}return q},
fI(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.b.gaf(r.a)
while(s instanceof A.X)s=s.a
if((s instanceof A.aT||s instanceof A.aB||s instanceof A.b1)&&s.gI())return s
return null},
d_(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.Z)(s),++p)q=A.c4(q,s[p].a8(a))
return q},
gI(){var s,r,q,p=this,o=null,n=!1
if(p.gc4())if(p.b.a!=null)if(p.c.a!=null)if(p.d.a!=null){s=p.y
if(s==null)s=o
else{r=!1
if(s.c.a!=null)if(s.d.a!=null)if(s.e.a!=null)if(s.w){q=s.f
q=q==null?o:q.a!=null
if(q!==!1){s=s.r
s=s==null?o:s.a!=null
s=s!==!1}else s=r}else s=!0
else s=r
else s=r
else s=r}if(s!==!1){n=p.z
n=n==null?o:n.gI()
n=n!==!1}}return n},
b2(a){var s,r,q,p,o,n,m=this,l=m.c.n(a)
if(0>=l.length)return A.a(l,0)
if(B.c.H(l[0])<=0)return null
if(m.e){l=m.d.n(a)
if(0>=l.length)return A.a(l,0)
s=l[0]
if(s<=0)return null
r=m.w===1?Math.max(1.42,m.x):1.42
q=s*0.5*r+1}else q=0
if(m.gc4()){p=m.fy
if(p===$){o=m.d_(0)
m.fy!==$&&A.S()
m.fy=o
p=o}n=p}else n=m.d_(a)
if(n==null)return null
return q===0?n:n.ho(q)},
$iaH:1}
A.i0.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.bt.prototype={
aI(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
Z(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
ag(){return this.Z(!1)}}
A.al.prototype={
gS(a){return this.f===0&&this.r===0&&!this.x},
l(a){var s=this
s.w=s.r=s.f=0
s.x=!1},
Z(a){var s,r,q=this
q.l(0)
s=a?512:8192
if(q.a.length>s){q.a=new Float64Array(512)
q.b=new Float64Array(512)}r=a?32:512
if(q.c.length>r){q.c=new Int32Array(32)
q.d=new Int32Array(32)
q.e=new Uint8Array(32)}},
ag(){return this.Z(!1)},
e0(a){while(this.a.length<a)this.d4()},
d4(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.f.C(o,0,r.f,q)
s=new Float64Array(p)
B.f.C(s,0,r.f,r.b)
r.a=o
r.b=s},
ck(a){while(this.c.length<a)this.d3()},
d3(){var s=this,r=s.c,q=r.length*2,p=new Int32Array(q)
B.e.C(p,0,s.r,r)
s.c=p
r=new Int32Array(q)
B.e.C(r,0,s.r,s.d)
s.d=r
r=new Uint8Array(q)
B.d.C(r,0,s.r,s.e)
s.e=r},
a4(a){var s,r,q,p=this
if(p.x)p.a2()
p.x=!0
p.w=p.f
if(p.r===p.c.length)p.d3()
s=p.c
r=p.r
q=p.w
s.$flags&2&&A.d(s)
if(!(r<s.length))return A.a(s,r)
s[r]=q
q=p.e
s=a?1:0
q.$flags&2&&A.d(q)
if(!(r<q.length))return A.a(q,r)
q[r]=s},
p(a,b){var s,r,q,p,o=this
if(!(isFinite(a)&&isFinite(b)))return
s=o.f
if(s>o.w){r=o.a
q=s-1
if(!(q>=0&&q<r.length))return A.a(r,q)
p=r[q]
r=o.b
if(!(q<r.length))return A.a(r,q)
if(Math.abs(a-p)+Math.abs(b-r[q])<1e-7)return}if(s===o.a.length)o.d4()
s=o.a
r=o.f
s.$flags&2&&A.d(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a
s=o.b
s.$flags&2&&A.d(s)
if(!(r<s.length))return A.a(s,r)
s[r]=b
o.f=r+1},
cb(a1,a2,a3,a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
if(b0>=10){if(isFinite(a7)&&isFinite(a8))a0.p(a7,a8)
return}s=3*a3-(2*a1+a7)
r=3*a4-(2*a2+a8)
q=3*a5-(a1+2*a7)
p=3*a6-(a2+2*a8)
o=s*s+r*r
n=q*q+p*p
if(!(isFinite(o)&&isFinite(n))){if(isFinite(a7)&&isFinite(a8))a0.p(a7,a8)
return}if(o*0.0625<=a9&&n*0.0625<=a9){a0.p(a7,a8)
return}m=(a1+a3)*0.5
l=(a2+a4)*0.5
k=(a3+a5)*0.5
j=(a4+a6)*0.5
i=(a5+a7)*0.5
h=(a6+a8)*0.5
g=(m+k)*0.5
f=(l+j)*0.5
e=(k+i)*0.5
d=(j+h)*0.5
c=(g+e)*0.5
b=(f+d)*0.5
a=b0+1
a0.cb(a1,a2,m,l,g,f,c,b,a9,a)
a0.cb(c,b,e,d,i,h,a7,a8,a9,a)},
V(a,b,c,d,e,f,g,h,i){return this.cb(a,b,c,d,e,f,g,h,i,0)},
a2(){var s,r,q,p,o,n,m,l,k,j,i=this
if(!i.x)return
s=i.x=!1
r=i.f
q=i.e
p=i.r
if(!(p<q.length))return A.a(q,p)
if(q[p]===1?r-i.w>1:s){s=i.a
q=i.w
o=s.length
if(!(q>=0&&q<o))return A.a(s,q)
n=s[q]
m=i.b
l=m.length
if(!(q<l))return A.a(m,q)
k=m[q]
q=r-1
if(!(q>=0&&q<o))return A.a(s,q)
j=s[q]
if(!(q<l))return A.a(m,q)
if(Math.abs(j-n)+Math.abs(m[q]-k)<1e-7){i.f=q
r=q}}if(r<=i.w)return
s=i.d
s.$flags&2&&A.d(s)
if(!(p<s.length))return A.a(s,p)
s[p]=r
i.r=p+1},
aF(a9,b0,b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=this,a8=a9.r
if(a8===0||a9.f===0)return
a7.e0(a7.f+a9.f)
a7.ck(a7.r+a8)
s=a7.a
r=a7.b
q=a9.a
p=a9.b
o=a9.c
n=a9.d
m=a9.e
l=b1===0&&b2===0
k=l&&b0===1&&b3===1&&b4===0&&b5===0
for(j=q.length,i=p.length,h=m.length,g=o.length,f=n.length,e=0;e<a8;++e){if(!(e<g))return A.a(o,e)
d=o[e]
if(!(e<f))return A.a(n,e)
c=n[e]
b=c-d
if(b<=0)continue
if(!(e<h))return A.a(m,e)
a7.a4(m[e]===1)
a=a7.f
if(k){a0=a+b
B.f.N(s,a,a0,q,d)
B.f.N(r,a,a0,p,d)
a=a0}else if(l)for(a1=s.$flags|0,a2=r.$flags|0,a3=d;a3<c;++a3){if(!(a3>=0&&a3<j))return A.a(q,a3)
a4=q[a3]
a1&2&&A.d(s)
if(!(a>=0&&a<s.length))return A.a(s,a)
s[a]=b0*a4+b4
if(!(a3<i))return A.a(p,a3)
a4=p[a3]
a2&2&&A.d(r)
if(!(a<r.length))return A.a(r,a)
r[a]=b3*a4+b5;++a}else for(a1=s.$flags|0,a2=r.$flags|0,a3=d;a3<c;++a3){if(!(a3>=0&&a3<j))return A.a(q,a3)
a5=q[a3]
if(!(a3<i))return A.a(p,a3)
a6=p[a3]
a1&2&&A.d(s)
if(!(a>=0&&a<s.length))return A.a(s,a)
s[a]=b0*a5+b2*a6+b4
a2&2&&A.d(r)
if(!(a<r.length))return A.a(r,a)
r[a]=b1*a5+b3*a6+b5;++a}a7.f=a
a7.a2()}},
fW(a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=a3.r
if(a2===0||a3.f===0)return
a1.e0(a1.f+a3.f)
a1.ck(a1.r+a2)
s=a1.a
r=a1.b
q=a3.a
p=a3.b
o=a3.c
n=a3.d
m=a3.e
for(l=q.length,k=p.length,j=m.length,i=o.length,h=n.length,g=0;g<a2;++g){if(!(g<i))return A.a(o,g)
f=o[g]
if(!(g<h))return A.a(n,g)
e=n[g]
if(e<=f)continue
if(!(g<j))return A.a(m,g)
a1.a4(m[g]===1)
d=a1.f
for(c=e-1,b=s.$flags|0,a=r.$flags|0;c>=f;--c){if(!(c>=0&&c<l))return A.a(q,c)
a0=q[c]
b&2&&A.d(s)
if(!(d>=0&&d<s.length))return A.a(s,d)
s[d]=a0
if(!(c<k))return A.a(p,c)
a0=p[c]
a&2&&A.d(r)
if(!(d<r.length))return A.a(r,d)
r[d]=a0;++d}a1.f=d
a1.a2()}}}
A.aG.prototype={
l(a){var s=this
s.b=0
s.d=s.c=2147483647
s.f=s.e=0},
aV(a){var s=this,r=[s.a,s.b,s.c,s.d,s.e,s.f],q=r[0],p=r[1],o=r[2],n=r[3],m=r[4],l=r[5]
s.a=a.a
a.a=q
s.b=a.b
a.b=p
s.c=a.c
a.c=o
s.d=a.d
a.d=n
s.e=a.e
a.e=m
s.f=a.f
a.f=l},
Z(a){var s
this.l(0)
s=a?1024:16384
if(this.a.gv().length>s*2)this.a.av(2048,0)},
ag(){return this.Z(!1)},
dZ(a){var s=this,r=a.b*2
if(s.a.gv().length<r)s.a.av(r,0)
B.e.C(s.a.gv(),0,r,a.a.gv())
s.b=a.b
s.c=a.c
s.d=a.d
s.e=a.e
s.f=a.f},
aO(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
if(c<=0||d<=0)return!1
s=(d>256?256:d)-1
r=f.a.gv()
q=f.b
if(q>0){p=(q-1)*2
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
n=r[p]
if(n>>>16===a){m=p+1
if(!(m<o))return A.a(r,m)
l=r[m]
if((l&255)===s){k=l>>>8
if((n&65535)+k===b){r.$flags&2&&A.d(r)
r[m]=(k+c<<8|s)>>>0
j=b+c
if(j>f.e)f.e=j
return!1}}}}i=q*2
h=i+2>r.length
if(h){q=f.a
q.av(q.gv().length*2,f.b*2)}g=f.a.gv()
g.$flags&2&&A.d(g)
q=g.length
if(!(i>=0&&i<q))return A.a(g,i)
g[i]=(a<<16|b&65535)>>>0
o=i+1
if(!(o<q))return A.a(g,o)
g[o]=(c<<8|s)>>>0;++f.b
if(b<f.c)f.c=b
q=b+c
if(q>f.e)f.e=q
if(a<f.d)f.d=a
q=a+1
if(q>f.f)f.f=q
return h},
ep(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a===0){i.l(0)
return}s=i.a.gv()
for(r=i.b*2,q=s.length,p=s.$flags|0,o=0,n=0;n<r;n+=2){m=n+1
if(!(m<q))return A.a(s,m)
l=s[m]
k=B.a.K(((l&255)+1)*a+128,8)
if(k===0)continue
j=o+1
if(!(n<q))return A.a(s,n)
m=s[n]
p&2&&A.d(s)
if(!(o<q))return A.a(s,o)
s[o]=m
o=j+1
s.$flags&2&&A.d(s)
if(!(j<q))return A.a(s,j)
s[j]=(l&4294967040|k-1)>>>0}i.b=B.a.J(o,2)}}
A.eZ.prototype={
hA(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
c.l(0)
if(a0>=a2||a1>=a3||a.r===0)return
s=d.b
r=s.length
if(a3>r){q=Math.max(a3,r*2)
s=new Int32Array(q)
B.e.ac(s,0,q,-1)
d.b=s}else{p=d.fx
o=d.fr
if(p>=o){n=Math.max(0,o)
m=Math.min(r,p+1)
if(m>n)B.e.ac(s,n,m,-1)}}d.ay=a0
d.ch=a1
d.CW=a2
d.cx=a3
d.cy=a0*256
d.db=a1*256
d.dx=a2*256
d.dy=a3*256
d.fr=a3
d.fx=a1-1
d.r=0
d.k4=!1
l=d.go=d.fy=0
k=a.a
j=a.b
for(s=k.length,r=j.length;l<a.r;++l){p=a.c
if(!(l<p.length))return A.a(p,l)
i=p[l]
p=a.d
if(!(l<p.length))return A.a(p,l)
h=p[l]
if(h-i<2)continue
if(!(i>=0&&i<s))return A.a(k,i)
g=k[i]
if(!(i<r))return A.a(j,i)
f=j[i]
d.bS()
d.fy=A.cG(g)
d.go=A.cG(f)
for(e=i+1;e<h;++e){if(!(e<s))return A.a(k,e)
p=k[e]
if(!(e<r))return A.a(j,e)
o=j[e]
d.dm(A.cG(p),A.cG(o))}d.dm(A.cG(g),A.cG(f))}d.ex(b,c)},
hB(a,b,c,d,e,f,g,h,i,j,k){if(k===0||c>=e||d>=f||a.r===0)return!0
return!1},
bS(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(!d.k4)return
d.k4=!1
s=d.k2
r=d.k3
q=s===0
if(q&&r===0)return
p=d.k1
if(p<d.ch||p>=d.cx)return
o=d.id
n=d.ay
if(o<n){if(q)return
o=n
m=0}else{if(o>=d.CW)return
m=r}if(p<d.fr)d.fr=p
if(p>d.fx)d.fx=p
q=d.b
if(!(p>=0&&p<q.length))return A.a(q,p)
l=q[p]
for(q=d.f,k=q.length,j=d.c,i=j.length,h=-1;l!==-1;h=l,l=f){if(!(l>=0&&l<i))return A.a(j,l)
g=j[l]
if(g===o){q=d.d
if(!(l<q.length))return A.a(q,l)
k=q[l]
q.$flags&2&&A.d(q)
q[l]=k+s
k=d.e
if(!(l<k.length))return A.a(k,l)
q=k[l]
k.$flags&2&&A.d(k)
k[l]=q+m
return}if(g>o)break
if(!(l<k))return A.a(q,l)
f=q[l]}q=d.r
if(q===i){e=i*2
k=new Int32Array(e)
B.e.C(k,0,q,j)
d.c=k
q=new Int32Array(e)
B.e.C(q,0,d.r,d.d)
d.d=q
q=new Int32Array(e)
B.e.C(q,0,d.r,d.e)
d.e=q
q=new Int32Array(e)
B.e.C(q,0,d.r,d.f)
d.f=q}q=d.r++
k=d.c
k.$flags&2&&A.d(k)
if(!(q<k.length))return A.a(k,q)
k[q]=o
k=d.d
k.$flags&2&&A.d(k)
if(!(q<k.length))return A.a(k,q)
k[q]=s
k=d.e
k.$flags&2&&A.d(k)
if(!(q<k.length))return A.a(k,q)
k[q]=m
k=d.f
k.$flags&2&&A.d(k)
j=k.length
if(!(q<j))return A.a(k,q)
k[q]=l
if(h===-1){k=d.b
k.$flags&2&&A.d(k)
if(!(p<k.length))return A.a(k,p)
k[p]=q}else{if(!(h>=0&&h<j))return A.a(k,h)
k[h]=q}},
dq(a,b){var s=this
if(s.k4){if(s.id===a&&s.k1===b)return
s.bS()}s.id=a
s.k1=b
s.k3=s.k2=0
s.k4=!0},
aA(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.ay
if(b<s){r.dq(s,a)
r.k2+=e
return}if(b>=r.CW)return
r.dq(b,a)
r.k2+=e
r.k3=r.k3+(c+d)*e},
aE(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.ch||a>=g.cx)return
s=B.a.aK(B.a.K(b,8),32)
r=B.a.aK(B.a.K(d,8),32)
q=s*256
p=r*256
if(s===r){g.aA(a,s,b-q,d-q,f)
return}o=d-b
n=b-q
if(d>b){m=g.ay
if(s<m){if(r<m){g.aA(a,m,0,0,f)
return}l=c+B.a.a_((g.cy-b)*f,o)
g.aA(a,m,0,0,l-c)
s=g.ay
k=l
n=0}else k=c
for(;;){if(!(s<r&&s<g.CW))break
j=s+1
i=c+B.a.a_((j*256-b)*f,o)
g.aA(a,s,n,256,i-k)
k=i
s=j
n=0}if(s<g.CW)g.aA(a,s,n,d-p,e-k)}else{m=g.CW
if(s>=m){if(r>=m)return
l=c+B.a.a_((g.dx-b)*f,o)
s=m-1
k=l
n=256}else k=c
for(;;){if(!(s>r&&s>=g.ay))break
i=c+B.a.a_((s*256-b)*f,o)
g.aA(a,s,n,0,i-k);--s
k=i
n=256}m=g.ay
h=e-k
if(s<m)g.aA(a,m,0,0,h)
else g.aA(a,s,n,d-p,h)}},
dm(a,b){this.fF(a,b)
return},
fF(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.fy,b=d.go
d.fy=a
d.go=a0
s=a0-b
if(s===0)return
r=B.a.aK(B.a.K(b,8),32)
q=B.a.aK(B.a.K(a0,8),32)
p=d.ch
o=r<p
if(o&&q<p)return
n=d.cx
m=r>=n
if(m&&q>=n)return
if(r===q){l=r*256
d.aE(r,c,b-l,a,a0-l)
return}k=a-c
if(s>0){if(o){j=d.db
i=c+B.a.a_((j-b)*k,s)
r=p}else{j=b
i=c}for(;;){if(!(r<q&&r<d.cx))break
p=r+1
h=p*256
g=c+B.a.a_((h-b)*k,s)
d.aE(r,i,j-r*256,g,256)
j=h
i=g
r=p}if(r<d.cx){o=r*256
d.aE(r,i,j-o,a,a0-o)}}else{if(m){j=d.dy
i=c+B.a.a_((j-b)*k,s)
r=n-1}else{j=b
i=c}if(r===q){if(r>=p){l=r*256
d.aE(r,i,j-l,a,a0-l)}return}f=r*256
e=c+B.a.a_((f-b)*k,s)
if(r>=p)d.aE(r,i,j-f,e,0);--r
i=e
for(;;){if(!(r>q&&r>=d.ch))break
g=c+B.a.a_((r*256-b)*k,s)
d.aE(r,i,256,g,0);--r
i=g}if(r>=d.ch)d.aE(r,i,256,a,a0-r*256)}},
ex(a,b){this.fO(a,b)
return},
fO(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.bS()
s=i.fx
r=i.fr
if(s<r)return
q=Math.max(i.ch,r)
p=Math.min(i.cx-1,s)
for(o=q;o<=p;++o){s=i.b
if(!(o>=0&&o<s.length))return A.a(s,o)
n=s[o]
s.$flags&2&&A.d(s)
s[o]=-1
if(n===-1)continue
m=i.ay
for(l=0;n!==-1;){s=i.c
if(!(n>=0&&n<s.length))return A.a(s,n)
k=s[n]
if(k>m&&l!==0){j=A.j4(l*512,a)
if(j>0)b.aO(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.j4(l*512-s[n],a)
if(j>0)b.aO(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.CW){j=A.j4(l*512,a)
if(j>0)b.aO(o,m,i.CW-m,j)}}i.fx=i.ch-1
i.fr=i.cx}}
A.fB.prototype={
$3(a,b,c){var s=this.a,r=this.b
return B.a.F(B.c.H((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
$S:69}
A.fD.prototype={
$1(a){var s,r,q=this
a+=q.a
s=q.b
if(s<0){r=q.c
a=r+(a-r)*r/(r-s)}s=q.d
if(s>1){r=q.c
a=r+(a-r)*(1-r)/(s-r)}return a},
$S:70}
A.cf.prototype={
gk(a){return this.b}}
A.hS.prototype={
U(){var s,r,q=this,p=q.a,o=q.b,n=q.c
for(s=p.length;n<o;){if(!(n>=0&&n<s))return A.a(p,n)
r=p[n]
if(r!==32&&r!==9&&r!==10&&r!==13)break;++n}q.c=n},
bX(a){var s,r,q=this,p=null,o=q.c
if(o>=q.b)throw A.f(A.O("Unexpected end of JSON at "+o,p,p))
s=q.a
if(!(o>=0&&o<s.length))return A.a(s,o)
r=s[o]
if(r===123)return q.fp()
if(r===91)return q.fi(a)
if(r===34)return q.di(!1)
if(r===116){q.fq()
return!0}if(r===102){q.fm()
return!1}if(r===110)return q.fn()
if(r>=48&&r<=57||r===45)return q.fo()
throw A.f(A.O("Unexpected byte "+r+" at "+o,p,p))},
fp(){var s,r,q,p,o,n,m,l,k=this,j=null
if(++k.d>256)throw A.f(A.O("JSON nesting depth exceeds 256 at "+k.c,j,j));++k.c
k.U()
s=A.a5(t.N,t.z)
r=k.c
q=k.b
if(r<q){p=k.a
if(!(r>=0&&r<p.length))return A.a(p,r)
p=p[r]===125}else p=!1
if(p){k.c=r+1;--k.d
return s}for(r=k.a,p=r.length;;){o=k.c
if(o<q){if(!(o>=0&&o<p))return A.a(r,o)
n=r[o]!==34}else n=!0
if(n)throw A.f(A.O("Expected object key at "+o,j,j))
m=k.di(!0)
k.U()
o=k.c
if(o<q){if(!(o>=0&&o<p))return A.a(r,o)
n=r[o]!==58}else n=!0
if(n)throw A.f(A.O('Expected ":" at '+o,j,j))
k.c=o+1
k.U()
s.q(0,m,k.bX(m))
k.U()
o=k.c
if(o>=q)throw A.f(A.O("Unterminated object at "+o,j,j))
if(!(o>=0&&o<p))return A.a(r,o)
l=r[o]
if(l===44){k.c=o+1
k.U()
continue}if(l===125){k.c=o+1;--k.d
return s}throw A.f(A.O('Expected "," or "}" at '+o,j,j))}},
fi(a){var s,r,q,p,o,n,m,l,k,j,i=this,h=null
if(++i.d>256)throw A.f(A.O("JSON nesting depth exceeds 256 at "+i.c,h,h))
s=++i.c
i.U()
r=i.c
q=i.b
p=r<q
if(p){o=i.a
if(!(r>=0&&r<o.length))return A.a(o,r)
o=o[r]===93}else o=!1
if(o){i.c=r+1;--i.d
return[]}o=!1
if(a==="v"||a==="i"||a==="o")if(p){p=i.a
if(!(r>=0&&r<p.length))return A.a(p,r)
r=p[r]===91}else r=o
else r=o
if(r){n=i.fT()
if(n!=null){--i.d
return n}i.c=s
i.U()}r=i.c
if(r<q){p=i.a
if(!(r>=0&&r<p.length))return A.a(p,r)
m=p[r]}else m=0
if(m>=48&&m<=57||m===45){l=i.fS(a==="k"||a==="s"||a==="e"||a==="to"||a==="ti")
if(l!=null){--i.d
return l}i.c=s
i.U()}k=[]
for(s=i.a,r=s.length;;){k.push(i.bX(h))
i.U()
p=i.c
if(p>=q)throw A.f(A.O("Unterminated array at "+p,h,h))
if(!(p>=0&&p<r))return A.a(s,p)
j=s[p]
if(j===44){i.c=p+1
i.U()
continue}if(j===93){i.c=p+1;--i.d
return k}throw A.f(A.O('Expected "," or "]" at '+p,h,h))}},
fT(){var s,r,q,p,o,n,m,l,k,j,i=this,h=null,g=i.e,f=i.a,e=i.b
for(s=f.length,r=0;;){q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==91}else p=!0
if(p)return h
i.c=q+1
i.U()
o=i.c6()
if(o==null)return h
i.U()
q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==44}else p=!0
if(p)return h
i.c=q+1
i.U()
n=i.c6()
if(n==null)return h
i.U()
q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==93}else p=!0
if(p)return h
i.c=q+1
m=r*2
q=g.length
if(m+2>q){l=new Float32Array(q*2)
B.h.C(l,0,m,g)
i.e=l
g=l}g.$flags&2&&A.d(g)
q=g.length
if(!(m<q))return A.a(g,m)
g[m]=o
p=m+1
if(!(p<q))return A.a(g,p)
g[p]=n;++r
i.U()
q=i.c
if(q>=e)return h
if(!(q>=0&&q<s))return A.a(f,q)
k=f[q]
if(k===44){i.c=q+1
i.U()
continue}if(k===93){i.c=q+1
s=r*2
j=new Float32Array(s)
B.h.C(j,0,s,g)
return new A.cf(j,r)}return h}},
fS(a){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.f,g=i.a,f=i.b
for(s=g.length,r=0;;r=n){q=i.c6()
if(q==null)return null
p=h.length
if(r>=p){o=new Float64Array(p*2)
B.f.C(o,0,r,h)
i.f=o
h=o}n=r+1
h.$flags&2&&A.d(h)
p=h.length
if(!(r<p))return A.a(h,r)
h[r]=q
i.U()
m=i.c
if(m>=f)return null
if(!(m>=0&&m<s))return A.a(g,m)
l=g[m]
if(l===44){i.c=m+1
i.U()
continue}if(l===93){i.c=m+1
if(a&&n>=4){k=new Float32Array(n)
for(j=0;j<n;++j){if(!(j<p))return A.a(h,j)
s=h[j]
if(!(j<n))return A.a(k,j)
k[j]=s}return k}k=new Float64Array(n)
B.f.C(k,0,n,h)
return k}return null}},
c6(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e=g.a,d=g.b,c=g.c
if(c>=d)return f
s=e.length
if(!(c>=0&&c<s))return A.a(e,c)
r=e[c]===45
if(r){q=c+1
if(q>=d)return f}else q=c
if(!(q<s))return A.a(e,q)
p=e[q]
if(p<48||p>57)return f
o=0
n=0
if(p===48){++q
if(q<d){if(!(q<s))return A.a(e,q)
m=e[q]
m=m>=48&&m<=57}else m=!1
if(m)return f}else while(q<d){if(!(q<s))return A.a(e,q)
l=e[q]-48
if(l<0||l>9)break
if(n<15)o=o*10+l;++n;++q}k=n>15
if(q<d){if(!(q<s))return A.a(e,q)
m=e[q]===46}else m=!1
j=0
if(m){++q
for(i=q;i<d;){if(!(i<s))return A.a(e,i)
l=e[i]-48
if(l<0||l>9)break
if(n<15){o=o*10+l;++j}else k=!0;++n;++i}if(i===q)return f
q=i}if(q<d){if(!(q<s))return A.a(e,q)
m=e[q]
m=m===101||m===69}else m=!1
if(m){++q
if(q<d){if(!(q<s))return A.a(e,q)
m=e[q]
m=m===43||m===45}else m=!1
if(m)++q
i=q
for(;;){if(i<d){if(!(i<s))return A.a(e,i)
m=e[i]
m=m>=48&&m<=57}else m=!1
if(!m)break;++i}if(i===q)return f
g.c=i
return A.jh(A.e9(e,c,i))}g.c=q
if(k)return A.jh(A.e9(e,c,q))
if(j===0)h=o
else{if(!(j<16))return A.a(B.r,j)
h=o/B.r[j]}return r?-h:h},
fo(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e="Invalid number at ",d=null,c=f.a,b=f.b,a=f.c,a0=c.length
if(!(a>=0&&a<a0))return A.a(c,a)
s=c[a]===45
if(s){r=a+1
if(r>=b)throw A.f(A.O(e+a,d,d))}else r=a
if(!(r<a0))return A.a(c,r)
q=c[r]
if(q<48||q>57)throw A.f(A.O(e+a,d,d))
p=0
o=0
if(q===48){++r
if(r<b){if(!(r<a0))return A.a(c,r)
n=c[r]
n=n>=48&&n<=57}else n=!1
if(n)throw A.f(A.O("Leading zero in number at "+a,d,d))}else while(r<b){if(!(r<a0))return A.a(c,r)
m=c[r]-48
if(m<0||m>9)break
if(o<15)p=p*10+m;++o;++r}l=o>15
if(r<b){if(!(r<a0))return A.a(c,r)
k=c[r]===46}else k=!1
j=0
if(k){++r
for(i=r;i<b;){if(!(i<a0))return A.a(c,i)
m=c[i]-48
if(m<0||m>9)break
if(o<15){p=p*10+m;++j}else l=!0;++o;++i}if(i===r)throw A.f(A.O("Invalid fraction at "+a,d,d))
r=i}if(r<b){if(!(r<a0))return A.a(c,r)
n=c[r]
n=n===101||n===69}else n=!1
if(n){++r
if(r<b){if(!(r<a0))return A.a(c,r)
n=c[r]
n=n===43||n===45}else n=!1
if(n)++r
i=r
for(;;){if(i<b){if(!(i<a0))return A.a(c,i)
n=c[i]
n=n>=48&&n<=57}else n=!1
if(!n)break;++i}if(i===r)throw A.f(A.O("Invalid exponent at "+a,d,d))
r=i
k=!0
l=!0}f.c=r
if(!k&&!l){if(s&&p===0)return-0.0
return s?-p:p}if(l){h=A.e9(c,a,r)
return k?A.oz(h):A.ln(h,d)}if(j===0)g=p
else{if(!(j<16))return A.a(B.r,j)
g=p/B.r[j]}return s?-g:g},
di(a){var s,r,q,p,o,n,m=this,l=null,k=m.a,j=m.b,i=++m.c
for(s=k.length,r=i,q=!0;r<j;){if(!(r>=0&&r<s))return A.a(k,r)
p=k[r]
if(p===34){m.c=r+1
o=r-i
if(o===0)return""
if(a&&q){n=A.n0(k,i,o)
if(n!=null)return n}if(q)return A.e9(k,i,r)
s=t.L.a(A.b0(k,i,r))
return new A.eF(!1).cU(s,0,l,!0)}if(p===92)return m.fl(i-1)
if(p<32)throw A.f(A.O("Unescaped control character in string at "+r,l,l))
if(p>=128)q=!1;++r}throw A.f(A.O("Unterminated string at "+i,l,l))},
fl(a){var s,r,q=null,p=this.a,o=this.b,n=a+1
for(s=p.length;n<o;){if(!(n>=0&&n<s))return A.a(p,n)
r=p[n]
if(r===92){n+=2
continue}if(r===34){s=n+1
this.c=s
s=t.L.a(A.b0(p,a,s))
return A.G(B.z.e_(new A.eF(!1).cU(s,0,q,!0),q))}++n}throw A.f(A.O("Unterminated escaped string at "+a,q,q))},
fq(){var s,r,q,p=this,o=p.c,n=o+4,m=!1
if(n<=p.b){s=p.a
r=o+1
q=s.length
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===114){r=o+2
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===117){m=o+3
if(!(m>=0&&m<q))return A.a(s,m)
m=s[m]===101}}}if(m){p.c=n
return!0}throw A.f(A.O("Invalid token at "+o,null,null))},
fm(){var s,r,q,p=this,o=p.c,n=o+5,m=!1
if(n<=p.b){s=p.a
r=o+1
q=s.length
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===97){r=o+2
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===108){r=o+3
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===115){m=o+4
if(!(m>=0&&m<q))return A.a(s,m)
m=s[m]===101}}}}if(m){p.c=n
return!1}throw A.f(A.O("Invalid token at "+o,null,null))},
fn(){var s,r,q,p=this,o=p.c,n=o+4,m=!1
if(n<=p.b){s=p.a
r=o+1
q=s.length
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===117){r=o+2
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===108){m=o+3
if(!(m>=0&&m<q))return A.a(s,m)
m=s[m]===108}}}if(m){p.c=n
return null}throw A.f(A.O("Invalid token at "+o,null,null))}}
A.fL.prototype={}
A.dJ.prototype={
G(a,b){var s
if(b==null)return!1
if(this!==b)s=b instanceof A.dJ&&A.iv(b)===A.iv(this)&&b.a===this.a
else s=!0
return s},
gX(a){return A.e_(A.iv(this),this.a,B.m,B.m)}}
A.f8.prototype={
fM(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=null,b=d.w
if(b==null)return c
if(!(a<b.length))return A.a(b,a)
s=b[a]
if(s!=null)return s.b.length===0?c:s
r=d.r
r.toString
q=d.a.length
if(a<q-1){p=d.d
if(!(a<p.length))return A.a(p,a)
p=p[a]
p=(p&1)!==0||(p&4)===0}else p=!0
if(p){B.b.q(b,a,$.jT())
return c}o=a*d.c
p=d.d
q+=a
if(!(q<p.length))return A.a(p,q)
n=p[q]
m=a*4
q=d.e
p=q.length
if(!(o<p))return A.a(q,o)
l=q[o]
if(!(n>=0&&n<p))return A.a(q,n)
k=q[n]
if(l===k){j=o+1
if(!(j<p))return A.a(q,j)
j=q[j]
i=n+1
if(!(i<p))return A.a(q,i)
i=j!==q[i]
j=i}else j=!0
if(j){j=r.length
if(!(m<j))return A.a(r,m)
i=!0
if(r[m]===0){h=m+1
if(!(h<j))return A.a(r,h)
if(r[h]===0){h=m+2
if(!(h<j))return A.a(r,h)
if(r[h]===0){i=m+3
if(!(i<j))return A.a(r,i)
i=r[i]!==0
j=i}else j=i}else j=i}else j=i}else j=!1
if(j){j=o+1
if(!(j<p))return A.a(q,j)
j=q[j]
i=r.length
if(!(m<i))return A.a(r,m)
h=r[m]
g=m+1
if(!(g<i))return A.a(r,g)
g=r[g]
f=m+2
if(!(f<i))return A.a(r,f)
f=r[f]
e=n+1
if(!(e<p))return A.a(q,e)
e=q[e]
p=m+3
if(!(p<i))return A.a(r,p)
e=new Float32Array(A.a9(A.h([l,j,l+h,j+g,k+f,e+r[p],k,e],t.n)))
p=new A.dm(e,new Float32Array(129))
p.ez(q,o,n,r,m)
B.b.q(b,a,p)
return p}B.b.q(b,a,$.jT())
return c},
ci(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
if(b<=0)return 0
if(b>=1)return 1
s=this.f
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
p=a+1
if(!(p<r))return A.a(s,p)
o=s[p]
p=a+2
if(!(p<r))return A.a(s,p)
n=s[p]
p=a+3
if(!(p<r))return A.a(s,p)
m=s[p]
if(q===o&&n===m)return b
l=new A.f9()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.hT()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.f9.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:71}
A.E.prototype={
gcv(){var s=this.a
s=s==null?null:s.length
return s==null?this.d.length:s},
n(c2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0=this,c1=c0.a
if(c1!=null)return c1
if(c2===c0.w)return c0.d
c0.w=c2
s=c0.b
r=s.a
q=s.e
p=s.c
c1=c0.d
o=c1.length
if(c2<B.f.ga5(r)){B.h.C(c1,0,o,q)
return c1}if(c2>=B.f.gad(r)){B.h.N(c1,0,o,q,(r.length-1)*p)
return c1}n=c0.r
m=r.length
l=m-1
k=!0
if(n<l){if(!(n<m))return A.a(r,n)
if(!(c2<r[n])){k=n+1
if(!(k<m))return A.a(r,k)
k=c2>=r[k]}}if(k){for(j=0;j+1<l;){i=B.a.K(j+l,1)
if(!(i<m))return A.a(r,i)
if(r[i]<=c2)j=i
else l=i}c0.r=j
n=j}h=n*p
k=s.d
g=k.length
if(!(n>=0&&n<g))return A.a(k,n)
f=k[n]
if((f&1)!==0){B.h.N(c1,0,o,q,h)
return c1}e=m+n
if(!(e<g))return A.a(k,e)
d=k[e]
e=n+1
if(!(e<m))return A.a(r,e)
e=r[e]
if(!(n<m))return A.a(r,n)
c=r[n]
b=e-c
a=b<=0?0:B.c.F((c2-c)/b,0,1)
m=2*m+n
if(!(m<g))return A.a(k,m)
a0=k[m]
a1=B.a.K(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.ci(a0,a)
a4=s.fM(n)
if(a4!=null)a4.eo(B.c.F(a3,0,1),c1)
else if(c0.c&&o>=32&&a1<=1)if(a3<=0)B.h.N(c1,0,o,q,h)
else if(a3>=1)B.h.N(c1,0,o,q,d)
else{n=$.dB()
n.$flags&2&&A.d(n)
n[0]=a3
m=n[0]
n[0]=a3
k=n[0]
n[0]=a3
g=n[0]
n[0]=a3
a5=new A.aN(m,k,g,n[0])
g=s.x
g.toString
a6=B.a.J(h,4)
a7=B.a.J(d,4)
a8=c0.e
if(a8==null)a8=c0.e=J.iX(B.h.ga7(c1),0,o/4|0)
for(k=a8.a.length/4|0,a9=0;a9<k;++a9){e=a6+a9
c=g.h(0,e)
b0=g.h(0,a7+a9)
e=g.h(0,e)
n[0]=b0.a-e.a
b1=n[0]
n[0]=b0.b-e.b
b2=n[0]
n[0]=b0.c-e.c
b3=n[0]
n[0]=b0.d-e.d
b3=new A.aN(b1,b2,b3,n[0]).ah(0,a5)
n[0]=c.a+b3.a
b2=n[0]
n[0]=c.b+b3.b
b1=n[0]
n[0]=c.c+b3.c
e=n[0]
n[0]=c.d+b3.d
a8.q(0,a9,new A.aN(b2,b1,e,n[0]))}for(a9=k*4,n=q.length,k=c1.$flags|0;a9<o;++a9){g=h+a9
if(!(g<n))return A.a(q,g)
g=q[g]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=q[e]
k&2&&A.d(c1)
c1[a9]=g+(e-g)*m}}else if(c0.f)for(n=q.length,k=c1.$flags|0,g=a1>1,a9=0;a9<o;++a9){b4=g&&m?s.ci(a0+4*B.a.T(a9,a1),a):a3
e=h+a9
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.lA()
e=B.a.F(B.c.H(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
b5=c[e]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=B.a.F(B.c.H(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.fH(b5+(c[e]-b5)*B.c.F(b4,0,1))
k&2&&A.d(c1)
c1[a9]=e}else if(a1<=1||a2)if(a3<=0)B.h.N(c1,0,o,q,h)
else if(a3>=1)B.h.N(c1,0,o,q,d)
else for(n=q.length,m=c1.$flags|0,b6=d,b7=h,a9=0;a9<o;++a9,++b7,++b6){if(!(b7<n))return A.a(q,b7)
b8=q[b7]
if(!(b6>=0&&b6<n))return A.a(q,b6)
b9=q[b6]
k=b8===b9?b8:b8+(b9-b8)*a3
m&2&&A.d(c1)
c1[a9]=k}else for(n=q.length,m=c1.$flags|0,a9=0;a9<o;++a9){b4=s.ci(a0+4*B.a.T(a9,a1),a)
k=h+a9
if(!(k<n))return A.a(q,k)
b8=q[k]
k=d+a9
if(!(k>=0&&k<n))return A.a(q,k)
b9=q[k]
if(b4<=0)k=b8
else if(b4>=1)k=b9
else k=b8===b9?b8:b8+(b9-b8)*b4
m&2&&A.d(c1)
c1[a9]=k}return c1}}
A.dm.prototype={
ez(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.a,g=h.length
if(0>=g)return A.a(h,0)
s=h[0]
if(1>=g)return A.a(h,1)
r=h[1]
for(h=i.b,g=h.length,q=g-1,p=h.$flags|0,o=1;o<g;++o,r=m,s=n){e=o/q
n=i.bj(e,0)
m=i.bj(e,1)
l=h[o-1]
k=n-s
j=m-r
j=Math.sqrt(k*k+j*j)
p&2&&A.d(h)
h[o]=l+j}},
bj(a,b){var s,r,q,p,o,n=1-a,m=this.a,l=m.length
if(!(b<l))return A.a(m,b)
s=m[b]
r=3*n
q=2+b
if(!(q<l))return A.a(m,q)
q=m[q]
p=4+b
if(!(p<l))return A.a(m,p)
p=m[p]
o=6+b
if(!(o<l))return A.a(m,o)
return n*n*n*s+r*n*a*q+r*a*a*p+a*a*a*m[o]},
eo(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this
if(a<=0){s=h.a
r=s.length
if(0>=r)return A.a(s,0)
q=s[0]
b.$flags&2&&A.d(b)
p=b.length
if(0>=p)return A.a(b,0)
b[0]=q
if(1>=r)return A.a(s,1)
s=s[1]
if(1>=p)return A.a(b,1)
b[1]=s
return}if(a>=1){s=h.a
r=s.length
if(6>=r)return A.a(s,6)
q=s[6]
b.$flags&2&&A.d(b)
p=b.length
if(0>=p)return A.a(b,0)
b[0]=q
if(7>=r)return A.a(s,7)
s=s[7]
if(1>=p)return A.a(b,1)
b[1]=s
return}s=h.b
o=B.h.gad(s)*a
r=s.length
n=r-1
for(m=n,l=0;l+1<m;){k=B.a.K(l+m,1)
if(!(k<r))return A.a(s,k)
if(s[k]<=o)l=k
else m=k}if(!(m>=0&&m<r))return A.a(s,m)
q=s[m]
if(!(l>=0&&l<r))return A.a(s,l)
s=s[l]
j=q-s
i=(l+(j===0?0:(o-s)/j))/n
s=h.bj(i,0)
b.$flags&2&&A.d(b)
r=b.length
if(0>=r)return A.a(b,0)
b[0]=s
s=h.bj(i,1)
b.$flags&2&&A.d(b)
if(1>=r)return A.a(b,1)
b[1]=s}}
A.fM.prototype={
h3(){var s,r,q,p,o,n,m,l,k,j,i=this.a,h=J.V(i)
switch(A.j(A.W(h.h(i,0)))){case 0:s=h.h(i,1)==null?null:A.G(h.h(i,1))
r=A.j(A.W(h.h(i,2)))
i=new A.dk([0,h.gk(i)<=3||A.aJ(h.h(i,3)),s,0,r])
break
case 1:s=A.G(h.h(i,1))
i=new A.dj([1,t.bm.a(h.h(i,2)),s,A.aJ(h.h(i,3))])
break
case 2:s=A.j(A.W(h.h(i,1)))
r=A.G(h.h(i,2))
q=A.G(h.h(i,3))
p=A.W(h.h(i,4))
o=A.j(A.W(h.h(i,5)))
n=A.j(A.W(h.h(i,6)))
m=A.j(A.W(h.h(i,7)))
l=A.j(A.W(h.h(i,8)))
n=new A.de([2,q,r,p,o,m,A.aJ(h.h(i,9)),s,l,n])
i=n
break
case 5:s=A.j(A.W(h.h(i,1)))
r=A.G(h.h(i,2))
q=A.G(h.h(i,3))
p=A.j(A.W(h.h(i,4)))
o=A.j(A.W(h.h(i,5)))
n=A.W(h.h(i,6))
m=A.W(h.h(i,7))
l=A.j(A.W(h.h(i,8)))
k=A.j(A.W(h.h(i,9)))
j=A.j(A.W(h.h(i,10)))
l=new A.df([5,q,r,m,k,A.aJ(h.h(i,11)),s,n,o,p,j,l])
i=l
break
case 4:i=B.aD
break
default:i=A.r(B.a2)}return i}}
A.iK.prototype={
$3(a,b,c){return new A.aC(this.a.gcj()-a,0-b.a-c,0-b.b)},
$S:72}
A.iJ.prototype={
$1(a){var s,r,q=this.b
if(q.gv().length<a){s=Math.max(65536,q.gv().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.av(s,0)}},
$S:6}
A.iL.prototype={
$1(a){return A.b0(this.a.gv(),0,a)},
$S:74}
A.iM.prototype={
$1(a){var s,r=this,q=r.b
if(q.gv().length<=262144){r.a.a=0
return}if(a<=65536){s=r.a
if(++s.a>=16){s.a=0
s=r.c
s.a=null
s.b=-1
q.av(65536,0)}}else r.a.a=0},
$S:6}
A.iO.prototype={
$3(a,b,c){var s
if(!this.a.hl(b,c))return
s=this.b.A(0,a)
if(s==null)return
this.c.cs(s)},
$S:75}
A.iN.prototype={
$2(a,b){var s,r,q,p,o=this,n=o.a,m=n.A(0,a)
if(m!=null)o.b.cs(m)
o.c.A(0,a)
for(s=o.b,r=A.o(n).i("P<1>");n.a>=24;){q=new A.P(n,r).gD(0)
if(!q.u())A.r(A.ae())
p=n.A(0,q.gB())
p.toString
s.cs(p)}n.q(0,a,b)},
$S:76}
A.iQ.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.di(3,b,a):new A.c0(1,s,a)
this.b.ai(r)},
$S:77}
A.iP.prototype={
$13$cancelSlot$cancelToken$contentKey$entryKey$frameStep$height$poster$reqId$startFrame$stripCount$stripStart$totalFrames$width(f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9=this,f0=null
try{c8=f1>=0
if(c8&&0!==f2){a8=e9.b
e9.a.ai(new A.cs(5,f8,a8.at+a8.CW))
return}c9=e9.c
c9.a=null
c9.b=-1
s=g0>1?1:0
c9=s
if(typeof c9!=="number")return A.ad(c9)
r=g0*f6+(g0-1)*c9
c9=r
if(typeof c9!=="number")return A.ad(c9)
q=g3*c9
e9.d.$1(q)
c9=s
if(typeof c9!=="number")return c9.en()
if(c9>0){p=1
c9=e9.e
d0=t.a
for(;;){d1=p
if(typeof d1!=="number")return d1.cB()
if(!(d1<g0))break
d1=p
d2=s
if(typeof d2!=="number")return A.ad(d2)
if(typeof d1!=="number")return d1.ah()
o=(d1*(f6+d2)-1)*g3
d1=c9.c
if(d1!=null){d2=d0.a(A.v($.k.memory).buffer)
d3=c9.b
d1=new Uint32Array(d2,d1,d3)}else{d1=c9.d
d1.toString}d2=o
if(typeof d2!=="number")return d2.aC()
B.l.ac(d1,o,d2+g3,0)
d1=p
if(typeof d1!=="number")return d1.aC()
p=d1+1}}n=g3*f6
m=0
l=0
k=-1
j=0
i=0
h=0
c9=e9.b
g=c9.r
f=2654435769
e=2246822507
d=null
c=null
b=0
d0=e9.Q
d1=e9.z
d2=e9.r
d4=e9.x
d5=e9.y
d6=e9.e
d7=0!==f2
d8=t.a
d9=g0===1
for(;;){e0=b
if(typeof e0!=="number")return e0.cB()
if(!(e0<g0))break
A:{if(c8&&d7){e9.a.ai(new A.cs(5,f8,c9.at+c9.CW))
e9.f.$1(q)
return}e0=b
if(typeof e0!=="number")return A.ad(e0)
a=A.oS(g1+e0,g2,f5)
e0=a
if(typeof e0!=="number")return A.ad(e0)
a0=f9+e0
e0=b
e1=s
if(typeof e1!=="number")return A.ad(e1)
if(typeof e0!=="number")return e0.ah()
a1=e0*(f6+e1)
e1=a1
if(typeof e1!=="number")return e1.ah()
a2=e1*g3
e1=A.j(a2)
e0=A.j(n)
e2=e1+e0
A.bb(e1,e2,d6.b)
e3=d6.c
e4=e3==null
e5=e4?f0:e3+e1*4
if(e4){e4=d6.d
e4.toString
e2=A.jr(e4,e1,e2)
e1=e2}else e1=f0
a3=new A.b8(!1,e0,e5,e1)
e1=a3
e0=e1.c
if(e0!=null){e2=d8.a(A.v($.k.memory).buffer)
d3=e1.b
e0=new Uint32Array(e2,e0,d3)}else{e0=e1.d
e0.toString}a4=c9.hP(A.b0(e0,0,f0),f4,a,f6,f7,g2,g3)
if(a4){e0=l
if(typeof e0!=="number")return e0.aC()
l=e0+1
if(d==null)d=a
if(g){a5=c9.cy
a6=c9.db
if(d9){f=a5
e=a6}else if(J.l(a5,0)&&J.l(a6,0))g=!1
else{a7=A.k6(f,e,a5,a6)
a8=null
a9=null
a8=a7.a
a9=a7.b
f=a8
e=a9}}break A}if(c==null)c=d2.A(0,f3)
if(c==null){e9.w.$2(f8,f3)
return}d2.q(0,f3,c)
b0=d4.gcj()
b1=B.G
b2=0
e0=c.a
A.lb(e0,a0,a3,g3,f6,d5,f0)
b3=d1.$3(b0,b1,b2)
e0=j
e1=b3.a
if(typeof e0!=="number")return e0.aC()
j=e0+e1
e1=i
e0=b3.b
if(typeof e1!=="number")return e1.aC()
i=e1+e0
e0=h
e1=b3.c
if(typeof e0!=="number")return e0.aC()
h=e0+e1
e1=m
if(typeof e1!=="number")return e1.aC()
m=e1+1
e1=a3
e0=e1.c
if(e0!=null){e2=d8.a(A.v($.k.memory).buffer)
d3=e1.b
e0=new Uint32Array(e2,e0,d3)}else{e0=e1.d
e0.toString}b4=c9.cH(f4,a,f6,f7,d0,A.b0(e0,0,f0),g2,g3)
if(b4.a[2]>0)k=b4.a[2]
if(g){b5=b4.a[3]
b6=b4.a[4]
if(d9){f=b5
e=b6}else if(J.l(b5,0)&&J.l(b6,0))g=!1
else{b7=A.k6(f,e,b5,b6)
b8=null
b9=null
b8=b7.a
b9=b7.b
f=b8
e=b9}}}e0=b
if(typeof e0!=="number")return e0.aC()
b=e0+1}c0=e9.as.$1(q)
c1=new Uint8Array(A.a9(c0))
c2=null
c3=null
if(!g){c2=0
c3=0}else if(d9){c2=f
c3=e}else{e6=f^g0
e7=e+A.ap(g0,2654435761)>>>0
e6=A.ap((e6^e6>>>15)>>>0,2246822519)
e6=(e6^e6>>>13)>>>0
e7=A.ap((e7^e7>>>16)>>>0,3266489917)
e7=(e7^e7>>>15)>>>0
c4=new A.x(e6,e6===0&&e7===0?1:e7)
c5=null
c6=null
c5=c4.a
c6=c4.b
c2=c5
c3=c6}a8=m
a9=l
b8=k
b9=c9.at
c5=c9.CW
c6=j
c8=i
d0=h
d1=q
if(typeof d1!=="number")return d1.ah()
e9.a.ai(new A.dg([4,a9,b8,f4,c2,c3,d0,c8,c1,c6,f8,g0,r,g1,g3,d1*4,a8,b9+c5]))
e9.f.$1(q)
e9.at.$3(f3,f4,g2)
if(!f7&&d!=null)c9.eb(f4,d,f6,g2,g3)}catch(e8){c7=A.ah(e8)
e9.a.ai(new A.c0(1,J.bH(c7),f8))}},
$S:78}
A.iI.prototype={
$1(g9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7=this,g8=null
A:{if(g9==null){a7=g7.b
a7.ce()
a7.dW()
g7.c.l(0)
g7.d.a1()
g7.e.a1()
g7.f.a.cd()
A.v(v.G.self).close()
return}a8=t.am.b(g9)
a9=g8
b0=g8
b1=g8
b2=g8
a7=!1
if(a8){b3=g9.a
b4=b3[0]
if(0===b4){b5=b3[2]
if(t.dk.b(b5)){A.ic(b5)
b6=b3[3]
if(A.n(b6)){A.j(b6)
b7=b3[4]
if(A.n(b7)){A.j(b7)
b8=b3[1]
a7=A.aX(b8)
if(a7){A.aJ(b8)
b2=b8}b1=b7}b0=b6}a9=b5}}}else b4=g8
if(a7){a7=g7.b
a7.b=A.j(b1)
a7.d7(0)
a7.shy(b0)
a7.sh_(b2)
a7.eq(a9)
break A}b9=t.hh.b(g9)
c0=g8
c1=g8
c2=!1
if(b9){if(a8)a7=b4
else{b4=A.M()
a7=b4
a8=!0}c0=1===a7
a7=c0
if(a7){c1=A.M()
c2=!0}}s=null
r=null
q=null
a7=!1
if(t.cm.b(g9)){c3=!0
if(b9)b3=c0
else{if(a8)b3=b4
else{b4=g9.a[0]
b3=b4
a8=!0}c0=1===b3
b3=c0}if(b3){if(c2)b3=c1
else{c1=g9.a[2]
b3=c1
c2=c3}if(typeof b3=="string"){if(c2)b3=c1
else{c1=g9.a[2]
b3=c1
c2=c3}s=A.G(b3)
b3=g9.a
c4=b3[1]
c5=t.p
if(c5.b(c4)){r=c5.a(c4)
c6=b3[3]
a7=A.aX(c6)
if(a7)q=A.aJ(c6)}}}}if(a7){try{a7=s
b3=A.oy(r)
c5=A.js(new A.dJ(q))
c7=new Float32Array(256)
c8=b3.length
c9=new A.hS(b3,c8,c7,new Float64Array(64))
if(c8>=3&&b3[0]===239&&b3[1]===187&&b3[2]===191)c9.c=3
c9.U()
d0=c9.bX(g8)
c9.U()
b3=c9.c
if(b3!==c8)A.r(A.O("Unexpected trailing character at "+b3,g8,g8))
if(!t.P.b(d0))A.r(B.a4)
c5.fZ(d0)
g7.r.$2(a7,new A.cg(c5))}catch(d1){p=A.ah(d1)
a7=g7.w
if(a7.a>=24)a7.A(0,new A.P(a7,A.o(a7).i("P<1>")).ga5(0))
a7.q(0,s,J.bH(p))}break A}o=null
n=null
m=null
l=null
k=null
j=null
i=null
h=null
g=null
d2=g8
d3=g8
d4=!1
d5=g8
d6=!1
d7=g8
d8=!1
d9=g8
e0=!1
e1=g8
e2=!1
a7=!1
if(t.eS.b(g9)){c3=!0
if(a8)b3=b4
else{b4=g9.a[0]
b3=b4
a8=!0}e3=2===b3
if(e3){b3=g9.a
d2=b3[7]
d4=A.n(d2)
if(d4){A.j(d2)
o=d2
d3=b3[2]
if(typeof d3=="string"){A.G(d3)
n=d3
if(c2)c5=c1
else{c1=b3[1]
c5=c1
c2=c3}if(typeof c5=="string"){if(c2)c5=c1
else{c1=b3[1]
c5=c1
c2=c3}m=A.G(c5)
e4=b3[3]
if(typeof e4=="number"){l=A.W(e4)
e5=b3[4]
d6=A.n(e5)
if(d6){k=A.j(e5)
d5=b3[9]
d8=A.n(d5)
if(d8){A.j(d5)
j=d5
d7=b3[5]
e0=A.n(d7)
if(e0){A.j(d7)
i=d7
d9=b3[8]
e2=A.n(d9)
if(e2){A.j(d9)
h=d9
e1=b3[6]
a7=A.aX(e1)
if(a7){A.aJ(e1)
g=e1}}}}}}}}}}}else e3=!1
if(a7){try{a7=j
b3=i
if(typeof a7!=="number")return a7.ah()
if(typeof b3!=="number")return A.ad(b3)
f=a7*b3
g7.x.$1(f)
b3=g7.y
e=b3.$1(f)
a7=g7.b
c5=n
c7=j
c8=i
e6=h
e7=g
e8=g7.z
d=a7.ei(e8,e,c5,k,c8,e7,e6,c7)
if(d){g7.Q.$3(m,n,h)
c=new Uint8Array(A.a9(e))
b3=a7.at
c5=a7.CW
c7=e.byteLength
c8=a7.cy
g7.f.ai(new A.cq([0,-1,n,c8,a7.db,0,0,c,0,o,c7,!1,b3+c5]))
g7.as.$1(f)
if(!g){b3=n
c5=j
c7=i
c8=h
a7.eb(b3,k,c7,c8,c5)}return}c5=g7.c
b=c5.A(0,m)
if(b==null){g7.at.$2(o,m)
return}c5.q(0,m,b)
e8.a=null
e8.b=-1
a=g7.ax.gcj()
a0=B.G
a1=0
c5=l
c7=j
c8=i
A.lb(b.geQ(),c5,g7.e,c7,c8,g7.d,g8)
a2=g7.ay.$3(a,a0,a1)
a3=b3.$1(f)
b3=n
c8=j
c7=i
c5=h
e6=g
a4=a7.cH(b3,k,c7,e6,g7.ch,a3,c5,c8)
a5=new Uint8Array(A.a9(a3))
c8=a4.a[2]
c5=a7.at
a7=a7.CW
e6=a2.a
c7=a2.b
b3=a2.c
e7=a3.byteLength
e8=a4.a[3]
g7.f.ai(new A.cq([0,c8,n,e8,a4.a[4],b3,c7,a5,e6,o,e7,!0,c5+a7]))
g7.as.$1(f)
g7.Q.$3(m,n,h)}catch(d1){a6=A.ah(d1)
g7.f.ai(new A.c0(1,J.bH(a6),o))}break A}e9=g8
f0=!1
f1=g8
f2=!1
f3=g8
f4=!1
f5=g8
f6=!1
o=g8
n=g8
s=g8
f7=g8
f8=g8
f9=g8
g0=g8
j=g8
i=g8
h=g8
g=g8
a7=!1
if(t.a8.b(g9)){c3=!0
g1=!0
g2=!0
g3=!0
g4=!0
g5=!0
g6=!0
if(a8)b3=b4
else{b4=g9.a[0]
b3=b4
a8=!0}if(5===b3){if(e3)b3=d2
else{d2=g9.a[6]
b3=d2
e3=g1}if(A.n(b3)){if(e3)b3=d2
else{d2=g9.a[6]
b3=d2
e3=g1}A.j(b3)
if(d4)c5=d3
else{d3=g9.a[2]
c5=d3
d4=g2}if(typeof c5=="string"){if(d4)c5=d3
else{d3=g9.a[2]
c5=d3
d4=g2}A.G(c5)
if(c2)c7=c1
else{c1=g9.a[1]
c7=c1
c2=c3}f0=typeof c7=="string"
if(f0){if(c2)c7=c1
else{c1=g9.a[1]
c7=c1
c2=c3}A.G(c7)
c8=g9.a
e9=c8[9]
f2=A.n(e9)
if(f2){A.j(e9)
f1=c8[8]
f4=A.n(f1)
if(f4){A.j(f1)
f3=c8[7]
f6=typeof f3=="number"
if(f6){A.W(f3)
f5=c8[3]
if(typeof f5=="number"){A.W(f5)
if(d6)e6=d5
else{d5=c8[11]
e6=d5
d6=g3}if(A.n(e6)){if(d6)e6=d5
else{d5=c8[11]
e6=d5
d6=g3}A.j(e6)
if(d8)e7=d7
else{d7=c8[4]
e7=d7
d8=g4}if(A.n(e7)){if(d8)e7=d7
else{d7=c8[4]
e7=d7
d8=g4}A.j(e7)
if(e0)e8=d9
else{d9=c8[10]
e8=d9
e0=g5}if(A.n(e8)){if(e0)e8=d9
else{d9=c8[10]
e8=d9
e0=g5}A.j(e8)
if(e2)a7=e1
else{e1=c8[5]
a7=e1
e2=g6}a7=A.aX(a7)
if(a7){if(e2)c8=e1
else{e1=c8[5]
c8=e1
e2=g6}A.aJ(c8)
g=c8}h=e8}i=e7}j=e6}g0=f5}f9=f3}f8=f1}f7=e9}s=c7}n=c5}o=b3}}}if(a7){g7.CW.$13$cancelSlot$cancelToken$contentKey$entryKey$frameStep$height$poster$reqId$startFrame$stripCount$stripStart$totalFrames$width(-1,0,s,n,g0,i,g,o,f9,f8,f7,h,j)
break A}if(t.bx.b(g9)){g2=!0
if(a8)a7=b4
else{b4=A.M()
a7=b4
a8=!0}if(6===a7){if(e3)a7=d2
else{d2=A.M()
a7=d2
e3=!0}if(A.n(a7)){A.j(e3?d2:A.M())
if(d4)a7=d3
else{d3=A.M()
a7=d3
d4=g2}if(typeof a7=="string"){if(d4)a7=d3
else{d3=A.M()
a7=d3
d4=g2}A.G(a7)
if(c2)a7=c1
else{c1=A.M()
a7=c1
c2=!0}if(typeof a7=="string"){A.G(c2?c1:A.M())
if(f0)a7=e9
else{e9=A.M()
a7=e9
f0=!0}if(A.n(a7)){A.j(f0?e9:A.M())
if(f2)a7=f1
else{f1=A.M()
a7=f1
f2=!0}if(A.n(a7)){A.j(f2?f1:A.M())
if(f4)a7=f3
else{f3=A.M()
a7=f3
f4=!0}if(typeof a7=="number"){A.W(f4?f3:A.M())
if(f6)a7=f5
else{f5=A.M()
a7=f5
f6=!0}if(typeof a7=="number"){A.W(f6?f5:A.M())
if(d6)a7=d5
else{d5=A.M()
a7=d5
d6=!0}if(A.n(a7)){A.j(d6?d5:A.M())
if(d8)a7=d7
else{d7=A.M()
a7=d7
d8=!0}if(A.n(a7)){A.j(d8?d7:A.M())
if(e0)a7=d9
else{d9=A.M()
a7=d9
e0=!0}if(A.n(a7)){A.j(e0?d9:A.M())
if(e2)a7=e1
else{e1=A.M()
a7=e1
e2=!0}if(A.aX(a7)){A.aJ(e2?e1:A.M())
A.M()}}}}}}}}}}}}}n=g8
a7=!1
if(t.bn.b(g9)){if(a8)b3=b4
else{b4=A.M()
b3=b4
a8=!0}if(3===b3){if(d4)a7=d3
else{d3=A.M()
a7=d3
d4=!0}a7=typeof a7=="string"
if(a7)n=A.G(d4?d3:A.M())}}if(a7){a7=g7.b
a7.h9(n)
a7.he(n)
g7.f.ai(new A.cr(2,n,a7.at+a7.CW))
break A}if(t.dn.b(g9))a7=4===(a8?b4:g9.a)
else a7=!1
if(a7){a7=g7.z
a7.a=null
a7.b=-1
a7=g7.b
a7.dW()
a7.ce()
a7.cD()
g7.c.l(0)
g7.w.l(0)
b3=g7.d
b3.ee()
b3.eh(!0)
b3=g7.ch
b3.c=0
if(b3.b.length>131072)b3.b=new Uint8Array(131072)
g7.a.a=0
b3=g7.e
if(b3.gv().length>65536)b3.av(65536,0)
g7.f.ai(new A.cr(2,"",a7.at+a7.CW))}}},
$S:79}
A.iB.prototype={
$1(a){return this.el(a)},
el(a5){var s=0,r=A.l8(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.lf(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.fM(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.j(A.W(J.ai(n.a,0)))!==-1||A.j(A.W(J.ai(n.a,1)))!==4)throw A.f(B.W)
q=10
s=13
return A.id(A.jQ(A.v(A.v(v.G.self).fetch(A.G(J.ai(n.a,2)))),t.m),$async$$1)
case 13:m=a7
s=A.aJ(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.id(A.jQ(A.v(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.id(a3.iz(a4.jf(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.oV(o.b)
d.a=!0
l=null
k=null
d=$.k
j=A.jM([-2,4,d!=null])
l=j.a
k=j.b
A.v(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.o(d)
a=b.c.a(n.h3())
a0=d.b
if(a0>=4)A.r(d.cO())
if((a0&1)!==0)d.c0(a)
else if((a0&3)===0)d.cY().m(0,new A.bV(a,b.i("bV<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.ah(a2)
h=null
g=null
f=A.jM([-3,A.w(i)])
h=f.a
g=f.b
A.v(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.kV(null,r)
case 1:return A.kU(p.at(-1),r)}})
return A.kW($async$$1,r)},
$S:80}
A.iC.prototype={
$1(a){return A.mf(new A.iB(this.a,this.b).$1(A.v(a)),t.b)},
$S:81}
A.h9.prototype={
ai(a){var s=A.oA(a)
A.v(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bu.prototype
s.ew=s.t})();(function installTearOffs(){var s=hunkHelpers._static_0,r=hunkHelpers._static_1,q=hunkHelpers._static_2,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(A,"o5","mB",3)
r(A,"oo","mX",5)
r(A,"op","mY",5)
r(A,"oq","mZ",5)
s(A,"lh","oj",0)
q(A,"os","o8",9)
s(A,"or","o7",0)
p(A.L.prototype,"geR","eS",9)
r(A,"jR","dw",1)
var m
o(m=A.er.prototype,"ghK","E",43)
o(m,"gb9","cF",44)
o(m,"gha","hb",45)
o(m,"ghv","hw",46)
o(m,"ghs","cr",47)
p(m=A.al.prototype,"gfV","p",68)
n(m,"ghc","a2",0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.e,null)
q(A.e,[A.ja,J.C,A.d_,J.bI,A.N,A.br,A.fw,A.m,A.bP,A.d4,A.H,A.bS,A.Q,A.d7,A.bc,A.fI,A.fm,A.cF,A.dn,A.I,A.fb,A.bN,A.aM,A.cL,A.dQ,A.d8,A.cj,A.fV,A.ex,A.i6,A.aN,A.aO,A.es,A.i4,A.i1,A.ej,A.av,A.en,A.bg,A.L,A.ek,A.d1,A.dp,A.el,A.d6,A.bA,A.eo,A.aS,A.eA,A.fO,A.ew,A.bj,A.B,A.dG,A.dI,A.eF,A.ha,A.e0,A.d0,A.hb,A.a_,A.bv,A.a1,A.eB,A.fy,A.ch,A.fl,A.f2,A.fN,A.f4,A.eh,A.dL,A.bx,A.h8,A.dN,A.ez,A.eR,A.fd,A.fF,A.ed,A.az,A.b9,A.b8,A.fg,A.i_,A.cg,A.fq,A.ac,A.bU,A.c,A.bz,A.hc,A.hX,A.er,A.bh,A.X,A.bl,A.bC,A.cn,A.c1,A.a8,A.hL,A.eq,A.a7,A.a6,A.aR,A.et,A.bk,A.bt,A.al,A.aG,A.eZ,A.cf,A.hS,A.dJ,A.f8,A.E,A.dm,A.fM,A.h9])
q(J.C,[J.cH,J.cJ,J.T,J.bK,J.bL,J.cK,J.cc])
q(J.T,[J.bu,J.y,A.bw,A.cS])
q(J.bu,[J.e1,J.d2,J.ax])
r(J.dO,A.d_)
r(J.f5,J.y)
q(J.cK,[J.cI,J.dP])
q(A.N,[A.b6,A.be,A.dR,A.eg,A.e5,A.cC,A.ep,A.aY,A.d3,A.ef,A.by,A.dH])
q(A.br,[A.dE,A.dF,A.ec,A.iw,A.iy,A.fR,A.fQ,A.ie,A.hC,A.fz,A.f_,A.iG,A.iH,A.f3,A.hF,A.eU,A.eS,A.eT,A.ij,A.h6,A.fX,A.fW,A.h3,A.h1,A.h_,A.h0,A.fZ,A.h5,A.i3,A.h7,A.hd,A.hQ,A.hO,A.hP,A.hR,A.hH,A.hJ,A.hK,A.hI,A.hU,A.hT,A.i0,A.fB,A.fD,A.f9,A.iK,A.iJ,A.iL,A.iM,A.iO,A.iP,A.iI,A.iB,A.iC])
q(A.dE,[A.iE,A.fo,A.fS,A.fT,A.i2,A.hu,A.hy,A.hx,A.hw,A.hv,A.hB,A.hA,A.hz,A.fA,A.hZ,A.hY,A.fU,A.hV,A.fP,A.io,A.i8,A.i7,A.hG,A.ib,A.fG,A.fi,A.hr,A.hs,A.hl,A.hm,A.hn,A.ho,A.hp,A.hq,A.hf,A.hh,A.hg,A.ht,A.he,A.hj,A.hi,A.hk])
q(A.m,[A.aZ,A.bT,A.ei])
q(A.aZ,[A.ag,A.P,A.bO,A.bM])
q(A.ag,[A.a0,A.ev])
q(A.Q,[A.co,A.am,A.c_,A.b2])
r(A.dd,A.co)
q(A.am,[A.cp,A.de,A.df,A.cq,A.dg,A.b3,A.dj,A.ct,A.dk,A.bB])
q(A.c_,[A.x,A.dh])
q(A.b2,[A.aC,A.di,A.cr,A.c0,A.cs])
q(A.bc,[A.cE,A.dl])
r(A.R,A.cE)
r(A.cV,A.be)
q(A.ec,[A.e7,A.cb])
r(A.eE,A.cC)
q(A.I,[A.b5,A.eu])
q(A.dF,[A.f6,A.ix,A.ig,A.iq,A.hD,A.fe,A.ff,A.hN,A.f1,A.f0,A.eV,A.fr,A.fs,A.ft,A.fu,A.im,A.fY,A.h2,A.h4,A.iN,A.iQ])
r(A.aj,A.b5)
r(A.cd,A.bw)
r(A.ey,A.ex)
r(A.cN,A.ey)
r(A.eG,A.cN)
r(A.eD,A.eG)
q(A.cS,[A.dU,A.ab])
q(A.ab,[A.d9,A.db])
r(A.da,A.d9)
r(A.cQ,A.da)
r(A.dc,A.db)
r(A.cR,A.dc)
q(A.cQ,[A.ce,A.cO])
q(A.cR,[A.dW,A.cP,A.dY,A.dZ,A.cT,A.cU,A.bQ])
r(A.cu,A.ep)
r(A.d5,A.en)
r(A.ck,A.dp)
r(A.dr,A.d1)
r(A.cl,A.dr)
r(A.cm,A.d6)
r(A.bV,A.bA)
r(A.bi,A.dl)
r(A.bY,A.bi)
r(A.dS,A.dG)
r(A.f7,A.dI)
q(A.aY,[A.ba,A.dK])
q(A.fN,[A.hE,A.ia])
q(A.bx,[A.dT,A.e6,A.bR])
q(A.a_,[A.ca,A.fL])
q(A.ca,[A.cB,A.dC])
r(A.cD,A.ha)
r(A.dM,A.dN)
q(A.et,[A.aB,A.aT,A.b1])
s(A.ex,A.B)
s(A.ey,A.H)
s(A.d9,A.B)
s(A.da,A.H)
s(A.db,A.B)
s(A.dc,A.H)
s(A.eG,A.bS)
s(A.ck,A.el)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",i:"double",c8:"num",p:"String",q:"bool",a1:"Null",t:"List",e:"Object",ak:"Map",J:"JSObject"},mangledNames:{},types:["~()","q(z)","q(a8)","b()","~(@)","~(~())","~(b)","a1(@)","a1()","~(e,aA)","@()","q()","q(+(p,b))","q(@)","bs(@,c,bs?,b,b)","q(e,bU)","@(@,p)","a1(ax,ax)","e?(e?)","e(e,aA)","q(bx)","@(p)","~(aP)","q(b,aP)","+(b,b)(b)","@(@)","t<b>()","~(i,i,i,i,i,i,i,i)","aw<~>()","q(e,ac<al>)","q(e,ac<i>)","q(bh,ac<b8>)","~(a8,aG)","q(a7)","E(b{dimensions:b})","~(b,b)","a1(@,aA)","i(p,i)","~(b,@)","~(@,b)","~(t<z>)","z(X)","a1(~())","E(E)","z(z)","aH(aH)","a8(a8)","a7(a7)","E()","c1()","X()","bl()","aR()","aB()","a1(e,aA)","b1()","bk()","a6()","bh()","bC()","cn()","a8()","a7()","bz()","q(E)","b(i)","~(e?,e?)","q(aH)","~(i,i)","b(b,b,i)","i(i)","i(i,i,i)","+(b,b,b)(b,+calls,copiedBytes(b,b),b)","~(p,@)","aP(b)","~(p,p,b)","~(p,cg)","~(b,p)","~({cancelSlot!b,cancelToken!b,contentKey!p,entryKey!p,frameStep!i,height!b,poster!q,reqId!b,startFrame!i,stripCount!b,stripStart!b,totalFrames!b,width!b})","~(e?)","aw<a1>(J)","J(J)","aT()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.dd&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.x&&a.b(c.a)&&b.b(c.b),"2;calls,copiedBytes":(a,b)=>c=>c instanceof A.dh&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.aC&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;contentKey,requestId":(a,b,c)=>d=>d instanceof A.di&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;entryKey,workerRamBytes":(a,b,c)=>d=>d instanceof A.cr&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;message,requestId":(a,b,c)=>d=>d instanceof A.c0&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;requestId,workerRamBytes":(a,b,c)=>d=>d instanceof A.cs&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.b3&&A.bp(a,b.a),"4;bytes,contentKey,useSimd":a=>b=>b instanceof A.dj&&A.bp(a,b.a),"5;deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes":a=>b=>b instanceof A.dk&&A.bp(a,b.a),"5;compressedBytes,crc31,entryDiskBytes,fpHi,fpLo":a=>b=>b instanceof A.ct&&A.bp(a,b.a),"6;":a=>b=>b instanceof A.bB&&A.bp(a,b.a),"10;":a=>b=>b instanceof A.cp&&A.bp(a,b.a),"10;contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width":a=>b=>b instanceof A.de&&A.bp(a,b.a),"12;contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width":a=>b=>b instanceof A.df&&A.bp(a,b.a),"13;entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes":a=>b=>b instanceof A.cq&&A.bp(a,b.a),"18;compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes":a=>b=>b instanceof A.dg&&A.bp(a,b.a)}}
A.nl(v.typeUniverse,JSON.parse('{"ax":"bu","e1":"bu","d2":"bu","p9":"bw","cH":{"C":[],"q":[],"A":[]},"cJ":{"C":[],"a1":[],"A":[]},"T":{"C":[],"J":[]},"bu":{"T":[],"C":[],"J":[]},"bK":{"C":[]},"bL":{"C":[]},"y":{"t":["1"],"T":[],"C":[],"J":[],"m":["1"]},"dO":{"d_":[]},"f5":{"y":["1"],"t":["1"],"T":[],"C":[],"J":[],"m":["1"]},"bI":{"af":["1"]},"cK":{"i":[],"c8":[],"C":[]},"cI":{"i":[],"b":[],"c8":[],"C":[],"A":[]},"dP":{"i":[],"c8":[],"C":[],"A":[]},"cc":{"p":[],"C":[],"fn":[],"A":[]},"b6":{"N":[]},"aZ":{"m":["1"]},"ag":{"aZ":["1"],"m":["1"]},"bP":{"af":["1"]},"a0":{"ag":["2"],"aZ":["2"],"m":["2"],"ag.E":"2","m.E":"2"},"bT":{"m":["1"],"m.E":"1"},"d4":{"af":["1"]},"dd":{"co":[],"Q":[]},"cp":{"am":[],"Q":[]},"de":{"am":[],"Q":[]},"df":{"am":[],"Q":[]},"cq":{"am":[],"Q":[]},"dg":{"am":[],"Q":[]},"x":{"c_":[],"Q":[]},"dh":{"c_":[],"Q":[]},"aC":{"b2":[],"Q":[]},"di":{"b2":[],"Q":[]},"cr":{"b2":[],"Q":[]},"c0":{"b2":[],"Q":[]},"cs":{"b2":[],"Q":[]},"b3":{"am":[],"Q":[]},"dj":{"am":[],"Q":[]},"ct":{"am":[],"Q":[]},"dk":{"am":[],"Q":[]},"bB":{"am":[],"Q":[]},"d7":{"af":["1"]},"cE":{"bc":["1"],"b_":["1"],"m":["1"]},"R":{"cE":["1"],"bc":["1"],"b_":["1"],"m":["1"]},"cV":{"be":[],"N":[]},"dR":{"N":[]},"eg":{"N":[]},"dn":{"aA":[]},"br":{"bJ":[]},"dE":{"bJ":[]},"dF":{"bJ":[]},"ec":{"bJ":[]},"e7":{"bJ":[]},"cb":{"bJ":[]},"e5":{"N":[]},"eE":{"N":[]},"b5":{"I":["1","2"],"jc":["1","2"],"ak":["1","2"],"I.K":"1","I.V":"2"},"P":{"aZ":["1"],"m":["1"],"m.E":"1"},"bN":{"af":["1"]},"bO":{"aZ":["1"],"m":["1"],"m.E":"1"},"aM":{"af":["1"]},"bM":{"aZ":["bv<1,2>"],"m":["bv<1,2>"],"m.E":"bv<1,2>"},"cL":{"af":["bv<1,2>"]},"aj":{"b5":["1","2"],"I":["1","2"],"jc":["1","2"],"ak":["1","2"],"I.K":"1","I.V":"2"},"c_":{"Q":[]},"co":{"Q":[]},"b2":{"Q":[]},"am":{"Q":[]},"dQ":{"mI":[],"fn":[]},"d8":{"e3":[]},"ei":{"m":["e3"],"m.E":"e3"},"cj":{"af":["e3"]},"cd":{"bw":[],"T":[],"C":[],"J":[],"A":[]},"bw":{"T":[],"C":[],"J":[],"A":[]},"cN":{"eX":[],"B":["aa"],"t":["aa"],"m":["aa"],"H":["aa"],"K":[],"A":[],"B.E":"aa","H.E":"aa"},"eD":{"eX":[],"B":["aa"],"bS":["aa"],"t":["aa"],"m":["aa"],"H":["aa"],"K":[],"A":[],"B.E":"aa","bS.E":"aa","H.E":"aa"},"cS":{"T":[],"C":[],"J":[],"K":[]},"dU":{"T":[],"C":[],"J":[],"K":[],"A":[]},"ab":{"ay":["1"],"T":[],"C":[],"J":[],"K":[]},"cQ":{"B":["i"],"ab":["i"],"t":["i"],"ay":["i"],"T":[],"C":[],"J":[],"K":[],"m":["i"],"H":["i"]},"cR":{"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"]},"ce":{"bs":[],"B":["i"],"ab":["i"],"t":["i"],"ay":["i"],"T":[],"C":[],"J":[],"K":[],"m":["i"],"H":["i"],"A":[],"B.E":"i","H.E":"i"},"cO":{"eY":[],"B":["i"],"ab":["i"],"t":["i"],"ay":["i"],"T":[],"C":[],"J":[],"K":[],"m":["i"],"H":["i"],"A":[],"B.E":"i","H.E":"i"},"dW":{"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"],"A":[],"B.E":"b","H.E":"b"},"cP":{"j7":[],"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"],"A":[],"B.E":"b","H.E":"b"},"dY":{"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"],"A":[],"B.E":"b","H.E":"b"},"dZ":{"jq":[],"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"],"A":[],"B.E":"b","H.E":"b"},"cT":{"fK":[],"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"],"A":[],"B.E":"b","H.E":"b"},"cU":{"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"],"A":[],"B.E":"b","H.E":"b"},"bQ":{"aP":[],"B":["b"],"ab":["b"],"t":["b"],"ay":["b"],"T":[],"C":[],"J":[],"K":[],"m":["b"],"H":["b"],"A":[],"B.E":"b","H.E":"b"},"aN":{"aa":[]},"ep":{"N":[]},"cu":{"be":[],"N":[]},"av":{"N":[]},"d5":{"en":["1"]},"L":{"aw":["1"]},"dp":{"kq":["1"],"fx":["1"],"kJ":["1"],"bW":["1"]},"ck":{"el":["1"],"dp":["1"],"kq":["1"],"fx":["1"],"kJ":["1"],"bW":["1"]},"cl":{"dr":["1"],"d1":["1"]},"cm":{"d6":["1"],"e8":["1"],"bW":["1"]},"d6":{"e8":["1"],"bW":["1"]},"dr":{"d1":["1"]},"bV":{"bA":["1"]},"eo":{"bA":["@"]},"bi":{"bc":["1"],"b_":["1"],"m":["1"]},"bY":{"bi":["1"],"bc":["1"],"b_":["1"],"m":["1"]},"bj":{"af":["1"]},"I":{"ak":["1","2"]},"bc":{"b_":["1"],"m":["1"]},"dl":{"bc":["1"],"b_":["1"],"m":["1"]},"eu":{"I":["p","@"],"ak":["p","@"],"I.K":"p","I.V":"@"},"ev":{"ag":["p"],"aZ":["p"],"m":["p"],"ag.E":"p","m.E":"p"},"dS":{"dG":["e?","p"]},"i":{"c8":[]},"b":{"c8":[]},"t":{"m":["1"]},"b_":{"m":["1"]},"p":{"fn":[]},"cC":{"N":[]},"be":{"N":[]},"aY":{"N":[]},"ba":{"N":[]},"dK":{"ba":[],"N":[]},"d3":{"N":[]},"ef":{"N":[]},"by":{"N":[]},"dH":{"N":[]},"e0":{"N":[]},"d0":{"N":[]},"eB":{"aA":[]},"eh":{"fx":["t<b>"]},"dT":{"bx":[]},"e6":{"bx":[]},"dM":{"dN":[]},"bR":{"bx":[]},"X":{"z":[]},"bl":{"z":[]},"a6":{"z":[],"aH":[]},"aR":{"z":[]},"aB":{"z":[]},"aT":{"z":[]},"b1":{"z":[]},"bk":{"aH":[]},"et":{"z":[]},"m6":{"K":[]},"mh":{"t":["b"],"K":[],"m":["b"]},"aP":{"t":["b"],"K":[],"m":["b"]},"mV":{"t":["b"],"K":[],"m":["b"]},"mg":{"t":["b"],"K":[],"m":["b"]},"jq":{"t":["b"],"K":[],"m":["b"]},"j7":{"t":["b"],"K":[],"m":["b"]},"fK":{"t":["b"],"K":[],"m":["b"]},"bs":{"t":["i"],"K":[],"m":["i"]},"eY":{"t":["i"],"K":[],"m":["i"]},"eX":{"t":["aa"],"K":[],"m":["aa"]}}'))
A.nk(v.typeUniverse,JSON.parse('{"ab":1,"bA":1,"dl":1,"dI":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.eP
return{a7:s("@<~>"),v:s("av"),fA:s("cD"),M:s("R<p>"),R:s("N"),Y:s("aa"),Z:s("bJ"),gd:s("C"),bM:s("m<i>"),hf:s("m<@>"),hb:s("m<b>"),dh:s("y<eY>"),f:s("y<e>"),fM:s("y<al>"),hg:s("y<+(q,q)>"),bU:s("y<aG>"),s:s("y<p>"),gC:s("y<E>"),a1:s("y<fK>"),gN:s("y<aP>"),V:s("y<aH>"),ch:s("y<a7>"),bE:s("y<a8>"),r:s("y<z>"),fq:s("y<X>"),n:s("y<i>"),o:s("y<@>"),t:s("y<b>"),a2:s("y<b8?>"),a6:s("y<e?>"),cU:s("y<a7?>"),by:s("y<bC?>"),T:s("cJ"),m:s("J"),g:s("ax"),aU:s("ay<@>"),aX:s("T"),c2:s("aj<e,e>"),el:s("aj<e,bU>"),gt:s("aj<ak<p,@>,aB>"),gS:s("aj<e,ac<al>>"),fk:s("aj<e,ac<i>>"),gj:s("aj<bh,ac<b8>>"),ew:s("t<e>"),W:s("t<pa>"),cH:s("t<z>"),dg:s("t<i>"),j:s("t<@>"),L:s("t<b>"),P:s("ak<p,@>"),gq:s("ak<a7,b>"),B:s("ak<b,a7>"),aj:s("ak<a7,+(b,c)>"),fP:s("a0<X,z>"),a:s("cd"),bm:s("bQ"),b:s("a1"),K:s("e"),bl:s("bR"),b8:s("ba"),fW:s("cg"),gT:s("pb"),bQ:s("+()"),eS:s("+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),a8:s("+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),e6:s("+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),bx:s("+cancelSlot,cancelToken,contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),f2:s("+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),dn:s("+(e?)"),x:s("+(p,b)"),eG:s("+(b,c)"),bn:s("+entryKey(e?,e?)"),bP:s("+(p,i,i)"),h6:s("+(b,b,b)"),ca:s("+contentKey,requestId(e?,e?,e?)"),hh:s("+contentKey,scene(e?,e?,e?)"),dH:s("+entryKey,workerRamBytes(e?,e?,e?)"),bA:s("+message,requestId(e?,e?,e?)"),cm:s("+bytes,contentKey,useSimd(e?,e?,e?,e?)"),am:s("+deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes(e?,e?,e?,e?,e?)"),d:s("e3"),bC:s("b_<e>"),k:s("b_<p>"),cJ:s("b_<b>"),l:s("aA"),N:s("p"),gz:s("ed"),A:s("E"),dm:s("A"),E:s("be"),h:s("K"),p:s("aP"),ak:s("d2"),eU:s("bT<z>"),co:s("ck<e?>"),G:s("bz"),az:s("bU"),bo:s("cn"),I:s("aH"),_:s("L<@>"),fJ:s("L<b>"),U:s("L<~>"),cK:s("bh"),eV:s("a6"),D:s("a7"),ai:s("bY<ak<p,@>>"),ao:s("bY<e>"),J:s("a8"),eY:s("pB"),u:s("z"),bs:s("z(X)"),g2:s("ez"),dL:s("ac<b8>"),b3:s("ac<al>"),e:s("ac<i>"),bD:s("X"),fv:s("dq<e?>"),d1:s("c1"),e_:s("bC"),y:s("q"),al:s("q(e)"),aT:s("q(z)"),i:s("i"),z:s("@"),fO:s("@()"),w:s("@(e)"),C:s("@(e,aA)"),S:s("b"),c:s("bs(@,c,bs?,b,b)?"),eH:s("aw<a1>?"),an:s("J?"),bF:s("t<@>?"),eg:s("t<b>?"),aM:s("ak<+(p,i,i),bz>?"),cq:s("ak<p,ak<p,@>>?"),X:s("e?"),ae:s("b_<e>?"),dk:s("p?"),g_:s("bz?"),ev:s("bA<@>?"),F:s("bg<@,@>?"),Q:s("ew?"),cn:s("dm?"),fQ:s("q?"),cD:s("i?"),gs:s("b?"),cg:s("c8?"),g5:s("~()?"),cy:s("~(aP)?"),q:s("c8"),H:s("~"),O:s("~()"),d5:s("~(e)"),da:s("~(e,aA)"),cA:s("~(p,@)"),bp:s("~(i,i)"),fi:s("~(i,i,i,i,i,i,i,i)"),as:s("~(b,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a6=J.C.prototype
B.b=J.y.prototype
B.u=J.cH.prototype
B.a=J.cI.prototype
B.c=J.cK.prototype
B.p=J.cc.prototype
B.a7=J.ax.prototype
B.a8=J.T.prototype
B.h=A.ce.prototype
B.f=A.cO.prototype
B.e=A.cP.prototype
B.l=A.cT.prototype
B.d=A.bQ.prototype
B.F=J.e1.prototype
B.w=J.d2.prototype
B.o=new A.cD(0,"littleEndian")
B.t=new A.cD(1,"bigEndian")
B.J=new A.f2()
B.x=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.K=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof HTMLElement == "function";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
B.P=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var userAgent = navigator.userAgent;
    if (typeof userAgent != "string") return hooks;
    if (userAgent.indexOf("DumpRenderTree") >= 0) return hooks;
    if (userAgent.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
B.L=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.O=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
B.N=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
B.M=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
B.y=function(hooks) { return hooks; }

B.z=new A.dS()
B.Q=new A.e0()
B.m=new A.fw()
B.j=new A.fO()
B.A=new A.eo()
B.R=new A.hE()
B.q=new A.eB()
B.S=new A.ia()
B.T=new A.a_("Truncated LZ4 match offset",null,null)
B.U=new A.a_("Invalid Huffman code length",null,null)
B.V=new A.a_("Invalid LZ4 match offset",null,null)
B.W=new A.a_("Incompatible FastLottie worker host",null,null)
B.X=new A.a_("LZ4 literal out of bounds",null,null)
B.Y=new A.a_("Empty LZ4 block",null,null)
B.Z=new A.a_("Truncated LZ4 literal len",null,null)
B.a_=new A.a_("Truncated LZ4 match len",null,null)
B.a0=new A.a_("Lottie JSON exceeds decode budget",null,null)
B.a1=new A.a_("LZ4 match out of output bounds",null,null)
B.a2=new A.a_("Invalid raster worker request",null,null)
B.a3=new A.a_("Incomplete Huffman table",null,null)
B.a4=new A.a_("Expected JSON object at root",null,null)
B.a5=new A.a_("Oversubscribed Huffman table",null,null)
B.a9=new A.f7(null)
B.B=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.aa=s([10,7,2,7,0,0,0],t.t)
B.C=s([],t.o)
B.ab=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.k=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.ac=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.ad=s([10,7,7,7,7,7],t.t)
B.D=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.ae=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.af=s(["_initialize","malloc","free","fastlottie_clear_pixels","fastlottie_fill_solid_spans","fastlottie_blend_rect","fastlottie_blend_solid","fastlottie_inner_shadow","fastlottie_gradient_spans","fl_dense_new","fl_dense_free","fl_dense_trim","fl_dense_raster"],t.s)
B.r=s([1,10,100,1000,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13,1e14,1e15],t.n)
B.ag=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.E=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.aD=new A.dd(4)
B.v=new A.x(0,0)
B.aE=new A.x(0,-1)
B.aF=new A.x(1,4)
B.aG=new A.x(2,0)
B.aH=new A.x(3,1)
B.aI=new A.x(4,1)
B.aJ=new A.x(5,1)
B.G=new A.dh(0,0)
B.aK=new A.x(null,null)
B.aL=new A.aC(0,0,0)
B.aM=new A.az(0,0,0,0)
B.au={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aN=new A.R(B.au,21,t.M)
B.ai={v:0,i:1,o:2,c:3}
B.aO=new A.R(B.ai,4,t.M)
B.aw={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aP=new A.R(B.aw,11,t.M)
B.an={ty:0,nm:1,mn:2,ix:3,v:4}
B.H=new A.R(B.an,5,t.M)
B.az={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aQ=new A.R(B.az,9,t.M)
B.aq={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aR=new A.R(B.aq,6,t.M)
B.ax={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aS=new A.R(B.ax,31,t.M)
B.at={a:0,k:1,ix:2,x:3,l:4}
B.I=new A.R(B.at,5,t.M)
B.aC={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aT=new A.R(B.aC,19,t.M)
B.aA={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aU=new A.R(B.aA,10,t.M)
B.am={s:0,x:1,y:2,ix:3}
B.aV=new A.R(B.am,4,t.M)
B.ak={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aW=new A.R(B.ak,9,t.M)
B.ao={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aX=new A.R(B.ao,8,t.M)
B.av={}
B.aY=new A.R(B.av,0,t.M)
B.al={a:0,s:1,i:2,f:3,n:4}
B.aZ=new A.R(B.al,5,t.M)
B.aB={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.b_=new A.R(B.aB,15,t.M)
B.ah={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.b0=new A.R(B.ah,7,t.M)
B.aj={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.b1=new A.R(B.aj,10,t.M)
B.as={n:0,nm:1,v:2}
B.b2=new A.R(B.as,3,t.M)
B.ar={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b3=new A.R(B.ar,10,t.M)
B.ap={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b4=new A.R(B.ap,16,t.M)
B.ay={p:0,k:1}
B.b5=new A.R(B.ay,2,t.M)
B.b6=A.aK("p_")
B.b7=A.aK("m6")
B.b8=A.aK("bs")
B.b9=A.aK("eX")
B.ba=A.aK("eY")
B.bb=A.aK("mg")
B.bc=A.aK("j7")
B.bd=A.aK("mh")
B.be=A.aK("e")
B.bf=A.aK("jq")
B.bg=A.aK("fK")
B.bh=A.aK("mV")
B.bi=A.aK("aP")
B.i=new A.c(null,null)
B.n=new A.c(B.i,"layers")})();(function staticFields(){$.hM=null
$.aD=A.h([],t.f)
$.km=null
$.fp=0
$.ji=A.o5()
$.k9=null
$.k8=null
$.ll=null
$.lg=null
$.lq=null
$.is=null
$.iA=null
$.jN=null
$.hW=A.h([],A.eP("y<t<e>?>"))
$.cv=null
$.dx=null
$.dy=null
$.jD=!1
$.F=B.j
$.le=null
$.jB=null
$.k=null
$.fh=null
$.cM=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"p1","lu",()=>A.it("_$dart_dartClosure"))
s($,"p0","iS",()=>A.it("_$dart_dartClosure_dartJSInterop"))
s($,"pM","lU",()=>B.j.bu(B.j,A.eP("aw<~>()").a(new A.iE()),A.eP("aw<~>")))
s($,"pJ","lT",()=>A.h([new J.dO()],A.eP("y<d_>")))
s($,"pn","lC",()=>A.bf(A.fJ({
toString:function(){return"$receiver$"}})))
s($,"po","lD",()=>A.bf(A.fJ({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"pp","lE",()=>A.bf(A.fJ(null)))
s($,"pq","lF",()=>A.bf(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"pt","lI",()=>A.bf(A.fJ(void 0)))
s($,"pu","lJ",()=>A.bf(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"ps","lH",()=>A.bf(A.kz(null)))
s($,"pr","lG",()=>A.bf(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"pw","lL",()=>A.bf(A.kz(void 0)))
s($,"pv","lK",()=>A.bf(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"p8","dB",()=>A.fj(4))
s($,"px","jW",()=>A.mW())
s($,"p2","jS",()=>$.lU())
s($,"pF","lR",()=>A.kl(4096))
s($,"pD","lP",()=>new A.i8().$0())
s($,"pE","lQ",()=>new A.i7().$0())
s($,"pH","eQ",()=>A.iF(B.be))
s($,"pc","jU",()=>{A.mD()
return $.fp})
s($,"pI","lS",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"p4","lw",()=>A.j5(B.ag,!1))
s($,"p3","lv",()=>A.j5(B.ab,!1))
s($,"oZ","iR",()=>A.m2())
s($,"oY","lt",()=>A.m1($.iR()))
s($,"p7","ly",()=>A.kl(65536))
s($,"p6","lx",()=>{var r=A.mz(16384)
B.e.ac(r,0,16384,-1)
return r})
s($,"pK","jZ",()=>A.kk(16384))
s($,"pG","jY",()=>A.e4("content\\('([^']*)'\\)"))
s($,"pA","lO",()=>A.e4("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"py","lM",()=>A.e4("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"pz","lN",()=>A.e4('[\\\\"\\x00-\\x1f]'))
s($,"pC","jX",()=>A.e4("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"pe","jV",()=>A.kk(16384))
s($,"p5","jT",()=>new A.dm(A.fj(0),A.fj(0)))
s($,"pf","bq",()=>A.fj(0))
s($,"pl","iV",()=>A.ee(A.dV(A.h([0],t.n))))
s($,"pk","lB",()=>A.ee(A.dV(A.h([1],t.n))))
s($,"pi","iT",()=>A.ee(A.dV(A.h([100],t.n))))
s($,"pm","iW",()=>A.ee(A.dV(A.h([0,0],t.n))))
s($,"pj","iU",()=>A.ee(A.dV(A.h([100,100],t.n))))
s($,"ph","lA",()=>A.mT())
s($,"pg","lz",()=>A.mS())})();(function nativeSupport(){!function(){var s=function(a){var m={}
m[a]=1
return Object.keys(hunkHelpers.convertToFastObject(m))[0]}
v.getIsolateTag=function(a){return s("___dart_"+a+v.isolateTag)}
var r="___dart_isolate_tags_"
var q=Object[r]||(Object[r]=Object.create(null))
var p="_ZxYxX"
for(var o=0;;o++){var n=s(p+"_"+o+"_")
if(!(n in q)){q[n]=1
v.isolateTag=n
break}}v.dispatchPropertyName=v.getIsolateTag("dispatch_record")}()
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bw,ArrayBuffer:A.cd,ArrayBufferView:A.cS,DataView:A.dU,Float32Array:A.ce,Float64Array:A.cO,Int16Array:A.dW,Int32Array:A.cP,Int8Array:A.dY,Uint16Array:A.dZ,Uint32Array:A.cT,Uint8ClampedArray:A.cU,CanvasPixelArray:A.cU,Uint8Array:A.bQ})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ab.$nativeSuperclassTag="ArrayBufferView"
A.d9.$nativeSuperclassTag="ArrayBufferView"
A.da.$nativeSuperclassTag="ArrayBufferView"
A.cQ.$nativeSuperclassTag="ArrayBufferView"
A.db.$nativeSuperclassTag="ArrayBufferView"
A.dc.$nativeSuperclassTag="ArrayBufferView"
A.cR.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
Function.prototype.$5=function(a,b,c,d,e){return this(a,b,c,d,e)}
Function.prototype.$6=function(a,b,c,d,e,f){return this(a,b,c,d,e,f)}
Function.prototype.$9=function(a,b,c,d,e,f,g,h,i){return this(a,b,c,d,e,f,g,h,i)}
Function.prototype.$8=function(a,b,c,d,e,f,g,h){return this(a,b,c,d,e,f,g,h)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.oL
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()