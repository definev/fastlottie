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
if(a[b]!==s){A.pB(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.f(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.k9(b)
return new s(c,this)}:function(){if(s===null)s=A.k9(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.k9(a).prototype
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
kd(a,b,c,d){return{i:a,p:b,e:c,x:d}},
iN(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.kb==null){A.pj()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.h(A.kZ("Return interceptor for "+A.z(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.hR
if(o==null)o=$.hR=A.iM(n)
p=q[o]}if(p!=null)return p
p=A.pn(a)
if(p!=null)return p
if(typeof a=="function")return B.a6
s=Object.getPrototypeOf(a)
if(s==null)return B.F
if(s===Object.prototype)return B.F
if(typeof q=="function"){o=$.hR
if(o==null)o=$.hR=A.iM(n)
Object.defineProperty(q,o,{value:B.w,enumerable:false,writable:true,configurable:true})
return B.w}return B.w},
mM(a,b){if(a<0||a>4294967295)throw A.h(A.as(a,0,4294967295,"length",null))
return J.mO(new Array(a),b)},
mN(a,b){if(a<0)throw A.h(A.ay("Length must be a non-negative integer: "+a,null))
return A.f(new Array(a),b.i("x<0>"))},
mO(a,b){var s=A.f(a,b.i("x<0>"))
s.$flags=1
return s},
mP(a,b){var s=t.e8
return J.mq(s.a(a),s.a(b))},
kD(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
mQ(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.kD(r))break;++b}return b},
mR(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.kD(q))break}return b},
aH(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cR.prototype
return J.dX.prototype}if(typeof a=="string")return J.bN.prototype
if(a==null)return J.cS.prototype
if(typeof a=="boolean")return J.cQ.prototype
if(Array.isArray(a))return J.x.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aB.prototype
if(typeof a=="symbol")return J.bP.prototype
if(typeof a=="bigint")return J.bO.prototype
return a}if(a instanceof A.e)return a
return J.iN(a)},
W(a){if(typeof a=="string")return J.bN.prototype
if(a==null)return a
if(Array.isArray(a))return J.x.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aB.prototype
if(typeof a=="symbol")return J.bP.prototype
if(typeof a=="bigint")return J.bO.prototype
return a}if(a instanceof A.e)return a
return J.iN(a)},
bI(a){if(a==null)return a
if(Array.isArray(a))return J.x.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aB.prototype
if(typeof a=="symbol")return J.bP.prototype
if(typeof a=="bigint")return J.bO.prototype
return a}if(a instanceof A.e)return a
return J.iN(a)},
pg(a){if(typeof a=="number")return J.ch.prototype
if(typeof a=="string")return J.bN.prototype
if(a==null)return a
if(!(a instanceof A.e))return J.cp.prototype
return a},
dJ(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.aB.prototype
if(typeof a=="symbol")return J.bP.prototype
if(typeof a=="bigint")return J.bO.prototype
return a}if(a instanceof A.e)return a
return J.iN(a)},
l(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aH(a).H(a,b)},
ap(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.pm(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.W(a).h(a,b)},
mn(a,b){return J.bI(a).az(a,b)},
ko(a,b,c){return J.dJ(a).dW(a,b,c)},
mo(a,b,c){return J.dJ(a).dX(a,b,c)},
mp(a){return J.dJ(a).dY(a)},
cd(a,b,c){return J.dJ(a).bD(a,b,c)},
mq(a,b){return J.pg(a).a6(a,b)},
mr(a,b){return J.bI(a).aN(a,b)},
kp(a){return J.dJ(a).gan(a)},
ms(a){return J.bI(a).ga7(a)},
ax(a){return J.aH(a).gZ(a)},
eT(a){return J.W(a).gP(a)},
ce(a){return J.bI(a).gE(a)},
aI(a){return J.W(a).gm(a)},
mt(a){return J.aH(a).ga_(a)},
kq(a){return J.bI(a).gai(a)},
kr(a,b,c,d,e){return J.dJ(a).O(a,b,c,d,e)},
bK(a){return J.aH(a).v(a)},
C:function C(){},
cQ:function cQ(){},
cS:function cS(){},
U:function U(){},
bw:function bw(){},
e7:function e7(){},
cp:function cp(){},
aB:function aB(){},
bO:function bO(){},
bP:function bP(){},
x:function x(a){this.$ti=a},
dW:function dW(){},
f7:function f7(a){this.$ti=a},
bL:function bL(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
ch:function ch(){},
cR:function cR(){},
dX:function dX(){},
bN:function bN(){}},A={jv:function jv(){},
kF(a){return new A.b8("Field '"+a+"' has been assigned during initialization.")},
mT(a){return new A.b8("Field '"+a+"' has not been initialized.")},
ar(a){return new A.b8("Local '"+a+"' has not been initialized.")},
fc(a){return new A.b8("Local '"+a+"' has already been initialized.")},
bf(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
fJ(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
k8(a,b,c){return a},
kc(a){var s,r
for(s=$.aG.length,r=0;r<s;++r)if(a===$.aG[r])return!0
return!1},
mZ(a,b,c,d){if(t.gw.b(a))return new A.cN(a,b,c.i("@<0>").V(d).i("cN<1,2>"))
return new A.bT(a,b,c.i("@<0>").V(d).i("bT<1,2>"))},
af(){return new A.bA("No element")},
jt(){return new A.bA("Too many elements")},
b8:function b8(a){this.a=a},
iX:function iX(){},
fB:function fB(){},
r:function r(){},
ab:function ab(){},
bS:function bS(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bT:function bT(a,b,c){this.a=a
this.b=b
this.$ti=c},
cN:function cN(a,b,c){this.a=a
this.b=b
this.$ti=c},
cU:function cU(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
a_:function a_(a,b,c){this.a=a
this.b=b
this.$ti=c},
bX:function bX(a,b,c){this.a=a
this.b=b
this.$ti=c},
dc:function dc(a,b,c){this.a=a
this.b=b
this.$ti=c},
T:function T(){},
mF(){throw A.h(A.bB("Cannot modify constant Set"))},
lV(a){var s=A.lU(a)
if(s!=null)return s
return"minified:"+a},
pm(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
z(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bK(a)
return s},
d5(a){var s,r=$.kM
if(r==null)r=$.kM=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
n7(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b==null){if(s!=null)return parseInt(a,10)
if(m[2]!=null)return parseInt(a,16)
return n}if(b<2||b>36)throw A.h(A.as(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
jB(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.p.i2(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
e8(a){var s,r,q,p
if(a instanceof A.e)return A.ao(A.br(a),null)
s=J.aH(a)
if(s===B.a5||s===B.a7||t.ak.b(a)){r=B.x(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.ao(A.br(a),null)},
kN(a){var s,r,q
if(a==null||typeof a=="number"||A.aX(a))return J.bK(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bt)return a.v(0)
if(a instanceof A.K)return a.dL(!0)
s=$.ml()
for(r=0;r<1;++r){q=s[r].i5(a)
if(q!=null)return q}return"Instance of '"+A.e8(a)+"'"},
n4(){return Date.now()},
n6(){var s,r
if($.fu!==0)return
$.fu=1000
if(typeof window=="undefined")return
s=window
if(s==null)return
if(!!s.dartUseDateNowForTicks)return
r=s.performance
if(r==null)return
if(typeof r.now!="function")return
$.fu=1e6
$.jC=new A.ft(r)},
n8(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
d6(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.b.I(s,10)|55296)>>>0,s&1023|56320)}throw A.h(A.as(a,0,1114111,null,null))},
n5(a){var s=a.$thrownJsError
if(s==null)return null
return A.bq(s)},
n9(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.a1(a,s)
a.$thrownJsError=s
s.stack=""}},
ai(a){throw A.h(A.iK(a))},
a(a,b){if(a==null)J.aI(a)
throw A.h(A.eQ(a,b))},
eQ(a,b){var s,r="index"
if(!A.o(b))return new A.aZ(!0,b,r,null)
s=A.j(J.aI(a))
if(b<0||b>=s)return A.kC(b,s,a,r)
return A.nb(b,r)},
iK(a){return new A.aZ(!0,a,null,null)},
lL(a){return a},
h(a){return A.a1(a,new Error())},
a1(a,b){var s
if(a==null)a=new A.bg()
b.dartException=a
s=A.pC
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
pC(){return J.bK(this.dartException)},
v(a,b){throw A.a1(a,b==null?new Error():b)},
c(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.v(A.oc(a,b,c),s)},
oc(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.db("'"+s+"': Cannot "+o+" "+l+k+n)},
Z(a){throw A.h(A.aJ(a))},
bh(a){var s,r,q,p,o,n
a=A.pv(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.f([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.fN(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
fO(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
kY(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
jw(a,b){var s=b==null,r=s?null:b.method
return new A.dZ(a,r,s?null:b.receiver)},
am(a){var s
if(a==null)return new A.fq(a)
if(a instanceof A.cO){s=a.a
return A.bJ(a,s==null?A.aW(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bJ(a,a.dartException)
return A.oZ(a)},
bJ(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
oZ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.b.I(r,16)&8191)===10)switch(q){case 438:return A.bJ(a,A.jw(A.z(s)+" (Error "+q+")",null))
case 445:case 5007:A.z(s)
return A.bJ(a,new A.d4())}}if(a instanceof TypeError){p=$.m4()
o=$.m5()
n=$.m6()
m=$.m7()
l=$.ma()
k=$.mb()
j=$.m9()
$.m8()
i=$.md()
h=$.mc()
g=p.ap(s)
if(g!=null)return A.bJ(a,A.jw(A.D(s),g))
else{g=o.ap(s)
if(g!=null){g.method="call"
return A.bJ(a,A.jw(A.D(s),g))}else if(n.ap(s)!=null||m.ap(s)!=null||l.ap(s)!=null||k.ap(s)!=null||j.ap(s)!=null||m.ap(s)!=null||i.ap(s)!=null||h.ap(s)!=null){A.D(s)
return A.bJ(a,new A.d4())}}return A.bJ(a,new A.el(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.d9()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bJ(a,new A.aZ(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.d9()
return a},
bq(a){var s
if(a instanceof A.cO)return a.b
if(a==null)return new A.dx(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.dx(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
iY(a){if(a==null)return J.ax(a)
if(typeof a=="object")return A.d5(a)
return J.ax(a)},
pe(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.n(0,a[s],a[r])}return b},
ot(a,b,c,d,e,f){t.Z.a(a)
switch(A.j(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.h(new A.hg("Unsupported number of arguments for wrapped closure"))},
cH(a,b){var s=a.$identity
if(!!s)return s
s=A.p7(a,b)
a.$identity=s
return s},
p7(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.ot)},
mE(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.ed().constructor.prototype):Object.create(new A.cg(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.kA(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.mA(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.kA(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
mA(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.h("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.mx)}throw A.h("Error in functionType of tearoff")},
mB(a,b,c,d){var s=A.kz
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
kA(a,b,c,d){if(c)return A.mD(a,b,d)
return A.mB(b.length,d,a,b)},
mC(a,b,c,d){var s=A.kz,r=A.my
switch(b?-1:a){case 0:throw A.h(new A.eb("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
mD(a,b,c){var s,r
if($.kx==null)$.kx=A.kw("interceptor")
if($.ky==null)$.ky=A.kw("receiver")
s=b.length
r=A.mC(s,c,a,b)
return r},
k9(a){return A.mE(a)},
mx(a,b){return A.dE(v.typeUniverse,A.br(a.a),b)},
kz(a){return a.a},
my(a){return a.b},
kw(a){var s,r,q,p=new A.cg("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.h(A.ay("Field name "+a+" not found.",null))},
iM(a){return v.getIsolateTag(a)},
N(){throw A.h(new A.eG(null))},
qq(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
pn(a){var s,r,q,p,o,n=A.D($.lO.$1(a)),m=$.iL[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iT[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.ii($.lJ.$2(a,n))
if(q!=null){m=$.iL[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iT[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.iW(s)
$.iL[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.iT[n]=s
return s}if(p==="-"){o=A.iW(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.lS(a,s)
if(p==="*")throw A.h(A.kZ(n))
if(v.leafTags[n]===true){o=A.iW(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.lS(a,s)},
lS(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.kd(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
iW(a){return J.kd(a,!1,null,!!a.$iaC)},
pp(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.iW(s)
else return J.kd(s,c,null,null)},
pj(){if(!0===$.kb)return
$.kb=!0
A.pk()},
pk(){var s,r,q,p,o,n,m,l
$.iL=Object.create(null)
$.iT=Object.create(null)
A.pi()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.lT.$1(o)
if(n!=null){m=A.pp(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
pi(){var s,r,q,p,o,n,m=B.J()
m=A.cG(B.K,A.cG(B.L,A.cG(B.y,A.cG(B.y,A.cG(B.M,A.cG(B.N,A.cG(B.O(B.x),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.lO=new A.iP(p)
$.lJ=new A.iQ(o)
$.lT=new A.iR(n)},
cG(a,b){return a(b)||b},
nG(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.l(r,b[s]))return!1}return!0},
p8(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
kE(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.h(A.P("Illegal RegExp pattern ("+String(o)+")",a,null))},
pv(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
dl:function dl(a){this.a=a},
cw:function cw(a){this.a=a},
dm:function dm(a){this.a=a},
dn:function dn(a){this.a=a},
cx:function cx(a){this.a=a},
dp:function dp(a){this.a=a},
A:function A(a,b){this.a=a
this.b=b},
cy:function cy(a,b){this.a=a
this.b=b},
dq:function dq(a,b){this.a=a
this.b=b},
aM:function aM(a,b,c){this.a=a
this.b=b
this.c=c},
dr:function dr(a,b,c){this.a=a
this.b=b
this.c=c},
cz:function cz(a,b,c){this.a=a
this.b=b
this.c=c},
c3:function c3(a,b,c){this.a=a
this.b=b
this.c=c},
cA:function cA(a,b,c){this.a=a
this.b=b
this.c=c},
aN:function aN(a){this.a=a},
ds:function ds(a){this.a=a},
dt:function dt(a){this.a=a},
cB:function cB(a){this.a=a},
du:function du(a){this.a=a},
bF:function bF(a){this.a=a},
df:function df(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cM:function cM(){},
S:function S(a,b,c){this.a=a
this.b=b
this.$ti=c},
ft:function ft(a){this.a=a},
d8:function d8(){},
fN:function fN(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
d4:function d4(){},
dZ:function dZ(a,b,c){this.a=a
this.b=b
this.c=c},
el:function el(a){this.a=a},
fq:function fq(a){this.a=a},
cO:function cO(a,b){this.a=a
this.b=b},
dx:function dx(a){this.a=a
this.b=null},
bt:function bt(){},
dM:function dM(){},
dN:function dN(){},
eh:function eh(){},
ed:function ed(){},
cg:function cg(a,b){this.a=a
this.b=b},
eb:function eb(a){this.a=a},
eG:function eG(a){this.a=a},
b7:function b7(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
f8:function f8(a){this.a=a},
fd:function fd(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
I:function I(a,b){this.a=a
this.$ti=b},
bQ:function bQ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bR:function bR(a,b){this.a=a
this.$ti=b},
aD:function aD(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
b9:function b9(a,b){this.a=a
this.$ti=b},
cT:function cT(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
an:function an(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
iP:function iP(a){this.a=a},
iQ:function iQ(a){this.a=a},
iR:function iR(a){this.a=a},
K:function K(){},
bE:function bE(){},
cv:function cv(){},
b3:function b3(){},
al:function al(){},
dY:function dY(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
dg:function dg(a){this.b=a},
en:function en(a,b,c){this.a=a
this.b=b
this.c=c},
cq:function cq(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
pB(a){throw A.a1(A.kF(a),new Error())},
H(){throw A.a1(A.mT(""),new Error())},
R(){throw A.a1(A.kF(""),new Error())},
er(){var s=new A.h_()
return s.b=s},
h_:function h_(){this.b=null},
c5(a,b,c){},
ae(a){return a},
n_(a,b,c){A.c5(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
fn(a){return new Float32Array(a)},
e2(a){return new Float32Array(A.ae(a))},
kJ(a,b,c){A.c5(a,b,c)
if(c==null)c=B.b.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
n2(a){return new Int32Array(a)},
cY(a,b,c){A.c5(a,b,c)
if(c==null)c=B.b.J(a.byteLength-b,4)
return new Int32Array(a,b,c)},
kK(a){return new Uint32Array(a)},
jy(a,b,c){A.c5(a,b,c)
if(c==null)c=B.b.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
kL(a){return new Uint8Array(a)},
jz(a,b,c){A.c5(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
bp(a,b,c){if(a>>>0!==a||a>=c)throw A.h(A.eQ(b,a))},
bx:function bx(){},
ci:function ci(){},
d1:function d1(){},
ib:function ib(a){this.a=a},
e1:function e1(){},
ag:function ag(){},
d_:function d_(){},
d0:function d0(){},
cj:function cj(){},
cW:function cW(){},
e3:function e3(){},
cX:function cX(){},
cZ:function cZ(){},
e4:function e4(){},
d2:function d2(){},
d3:function d3(){},
bU:function bU(){},
ck:function ck(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
dh:function dh(){},
di:function di(){},
dj:function dj(){},
dk:function dk(){},
jE(a,b){var s=b.c
return s==null?b.c=A.dC(a,"aA",[b.x]):s},
kO(a){var s=a.w
if(s===6||s===7)return A.kO(a.x)
return s===11||s===12},
nd(a){return a.as},
b5(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
eR(a){return A.ia(v.typeUniverse,a,!1)},
c8(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.c8(a1,s,a3,a4)
if(r===s)return a2
return A.la(a1,r,!0)
case 7:s=a2.x
r=A.c8(a1,s,a3,a4)
if(r===s)return a2
return A.l9(a1,r,!0)
case 8:q=a2.y
p=A.cE(a1,q,a3,a4)
if(p===q)return a2
return A.dC(a1,a2.x,p)
case 9:o=a2.x
n=A.c8(a1,o,a3,a4)
m=a2.y
l=A.cE(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.jT(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.cE(a1,j,a3,a4)
if(i===j)return a2
return A.lb(a1,k,i)
case 11:h=a2.x
g=A.c8(a1,h,a3,a4)
f=a2.y
e=A.oW(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.l8(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.cE(a1,d,a3,a4)
o=a2.x
n=A.c8(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.jU(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.h(A.dL("Attempted to substitute unexpected RTI kind "+a0))}},
cE(a,b,c,d){var s,r,q,p,o=b.length,n=A.ie(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.c8(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
oX(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.ie(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.c8(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
oW(a,b,c,d){var s,r=b.a,q=A.cE(a,r,c,d),p=b.b,o=A.cE(a,p,c,d),n=b.c,m=A.oX(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.ex()
s.a=q
s.b=o
s.c=m
return s},
f(a,b){a[v.arrayRti]=b
return a},
lM(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.ph(s)
return a.$S()}return null},
pl(a,b){var s
if(A.kO(b))if(a instanceof A.bt){s=A.lM(a)
if(s!=null)return s}return A.br(a)},
br(a){if(a instanceof A.e)return A.n(a)
if(Array.isArray(a))return A.a4(a)
return A.jX(J.aH(a))},
a4(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
n(a){var s=a.$ti
return s!=null?s:A.jX(a)},
jX(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.oq(a,s)},
oq(a,b){var s=a instanceof A.bt?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.nR(v.typeUniverse,s.name)
b.$ccache=r
return r},
ph(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.ia(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
iO(a){return A.ca(A.n(a))},
k6(a){var s
if(a instanceof A.K)return A.pd(a.$r,a.b3())
s=a instanceof A.bt?A.lM(a):null
if(s!=null)return s
if(t.dm.b(a))return J.mt(a).a
if(Array.isArray(a))return A.a4(a)
return A.br(a)},
ca(a){var s=a.r
return s==null?a.r=new A.i9(a):s},
pd(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.dE(v.typeUniverse,A.k6(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.ld(v.typeUniverse,s,A.k6(q[r]))}return A.dE(v.typeUniverse,s,a)},
aY(a){return A.ca(A.ia(v.typeUniverse,a,!1))},
op(a){var s=this
s.b=A.oT(s)
return s.b(a)},
oT(a){var s,r,q,p,o
if(a===t.K)return A.oz
if(A.cb(a))return A.oD
s=a.w
if(s===6)return A.ol
if(s===1)return A.ly
if(s===7)return A.ou
r=A.oR(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.cb)){a.f="$i"+q
if(q==="w")return A.ox
if(a===t.m)return A.ow
return A.oC}}else if(s===10){p=A.p8(a.x,a.y)
o=p==null?A.ly:p
return o==null?A.aW(o):o}return A.oj},
oR(a){if(a.w===8){if(a===t.S)return A.o
if(a===t.i||a===t.q)return A.oy
if(a===t.N)return A.oB
if(a===t.y)return A.aX}return null},
oo(a){var s=this,r=A.oi
if(A.cb(s))r=A.o1
else if(s===t.K)r=A.aW
else if(A.cI(s)){r=A.ok
if(s===t.gs)r=A.o_
else if(s===t.dk)r=A.ii
else if(s===t.fQ)r=A.nY
else if(s===t.cg)r=A.li
else if(s===t.cD)r=A.nZ
else if(s===t.an)r=A.o0}else if(s===t.S)r=A.j
else if(s===t.N)r=A.D
else if(s===t.y)r=A.aP
else if(s===t.q)r=A.dF
else if(s===t.i)r=A.a0
else if(s===t.m)r=A.u
s.a=r
return s.a(a)},
oj(a){var s=this
if(a==null)return A.cI(s)
return A.lR(v.typeUniverse,A.pl(a,s),s)},
ol(a){if(a==null)return!0
return this.x.b(a)},
oC(a){var s,r=this
if(a==null)return A.cI(r)
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aH(a)[s]},
ox(a){var s,r=this
if(a==null)return A.cI(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aH(a)[s]},
ow(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.e)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
lx(a){if(typeof a=="object"){if(a instanceof A.e)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
oi(a){var s=this
if(a==null){if(A.cI(s))return a}else if(s.b(a))return a
throw A.a1(A.lm(a,s),new Error())},
ok(a){var s=this
if(a==null||s.b(a))return a
throw A.a1(A.lm(a,s),new Error())},
lm(a,b){return new A.cC("TypeError: "+A.l0(a,A.ao(b,null)))},
p6(a,b,c,d){if(A.lR(v.typeUniverse,a,b))return a
throw A.a1(A.nJ("The type argument '"+A.ao(a,null)+"' is not a subtype of the type variable bound '"+A.ao(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
l0(a,b){return A.eZ(a)+": type '"+A.ao(A.k6(a),null)+"' is not a subtype of type '"+b+"'"},
nJ(a){return new A.cC("TypeError: "+a)},
aO(a,b){return new A.cC("TypeError: "+A.l0(a,b))},
ou(a){var s=this
return s.x.b(a)||A.jE(v.typeUniverse,s).b(a)},
oz(a){return a!=null},
aW(a){if(a!=null)return a
throw A.a1(A.aO(a,"Object"),new Error())},
oD(a){return!0},
o1(a){return a},
ly(a){return!1},
aX(a){return!0===a||!1===a},
aP(a){if(!0===a)return!0
if(!1===a)return!1
throw A.a1(A.aO(a,"bool"),new Error())},
nY(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.a1(A.aO(a,"bool?"),new Error())},
a0(a){if(typeof a=="number")return a
throw A.a1(A.aO(a,"double"),new Error())},
nZ(a){if(typeof a=="number")return a
if(a==null)return a
throw A.a1(A.aO(a,"double?"),new Error())},
o(a){return typeof a=="number"&&Math.floor(a)===a},
j(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.a1(A.aO(a,"int"),new Error())},
o_(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.a1(A.aO(a,"int?"),new Error())},
oy(a){return typeof a=="number"},
dF(a){if(typeof a=="number")return a
throw A.a1(A.aO(a,"num"),new Error())},
li(a){if(typeof a=="number")return a
if(a==null)return a
throw A.a1(A.aO(a,"num?"),new Error())},
oB(a){return typeof a=="string"},
D(a){if(typeof a=="string")return a
throw A.a1(A.aO(a,"String"),new Error())},
ii(a){if(typeof a=="string")return a
if(a==null)return a
throw A.a1(A.aO(a,"String?"),new Error())},
u(a){if(A.lx(a))return a
throw A.a1(A.aO(a,"JSObject"),new Error())},
o0(a){if(a==null)return a
if(A.lx(a))return a
throw A.a1(A.aO(a,"JSObject?"),new Error())},
lF(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.ao(a[q],b)
return s},
oM(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.lF(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.ao(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
ls(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.f([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.a.k(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.ao(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.ao(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.ao(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.ao(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.ao(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
ao(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.ao(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.ao(a.x,b)+">"
if(l===8){p=A.oY(a.x)
o=a.y
return o.length>0?p+("<"+A.lF(o,b)+">"):p}if(l===10)return A.oM(a,b)
if(l===11)return A.ls(a,b,null)
if(l===12)return A.ls(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
oY(a){var s=A.lU(a)
if(s!=null)return s
return"minified:"+a},
nS(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
nR(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.ia(a,b,!1)
else if(typeof m=="number"){s=m
r=A.dD(a,5,"#")
q=A.ie(s)
for(p=0;p<s;++p)q[p]=r
o=A.dC(a,b,q)
n[b]=o
return o}else return m},
nQ(a,b){return A.lf(a.tR,b)},
nP(a,b){return A.lf(a.eT,b)},
ia(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.lc(a,null,b,!1)
r.set(b,s)
return s},
dE(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.lc(a,b,c,!0)
q.set(c,r)
return r},
ld(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.jT(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
lc(a,b,c,d){return A.nE(A.ny(a,b,c,d))},
bH(a,b){b.a=A.oo
b.b=A.op
return b},
dD(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aQ(null,null)
s.w=b
s.as=c
r=A.bH(a,s)
a.eC.set(c,r)
return r},
la(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.nN(a,b,r,c)
a.eC.set(r,s)
return s},
nN(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.cb(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.cI(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aQ(null,null)
q.w=6
q.x=b
q.as=c
return A.bH(a,q)},
l9(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.nL(a,b,r,c)
a.eC.set(r,s)
return s},
nL(a,b,c,d){var s,r
if(d){s=b.w
if(A.cb(b)||b===t.K)return b
else if(s===1)return A.dC(a,"aA",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aQ(null,null)
r.w=7
r.x=b
r.as=c
return A.bH(a,r)},
nO(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aQ(null,null)
s.w=13
s.x=b
s.as=q
r=A.bH(a,s)
a.eC.set(q,r)
return r},
dB(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
nK(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
dC(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.dB(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aQ(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bH(a,r)
a.eC.set(p,q)
return q},
jT(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.dB(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aQ(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bH(a,o)
a.eC.set(q,n)
return n},
lb(a,b,c){var s,r,q="+"+(b+"("+A.dB(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aQ(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bH(a,s)
a.eC.set(q,r)
return r},
l8(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.dB(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.dB(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.nK(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aQ(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bH(a,p)
a.eC.set(r,o)
return o},
jU(a,b,c,d){var s,r=b.as+("<"+A.dB(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.nM(a,b,c,r,d)
a.eC.set(r,s)
return s},
nM(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.ie(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.c8(a,b,r,0)
m=A.cE(a,c,r,0)
return A.jU(a,n,m,c!==m)}}l=new A.aQ(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bH(a,l)},
ny(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
nE(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.nA(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.l5(a,r,l,k,!1)
else if(q===46)r=A.l5(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.c2(a.u,a.e,k.pop()))
break
case 94:k.push(A.nO(a.u,k.pop()))
break
case 35:k.push(A.dD(a.u,5,"#"))
break
case 64:k.push(A.dD(a.u,2,"@"))
break
case 126:k.push(A.dD(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.nC(a,k)
break
case 38:A.nB(a,k)
break
case 63:p=a.u
k.push(A.la(p,A.c2(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.l9(p,A.c2(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.nz(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.l6(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.nF(a.u,a.e,o)
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
return A.c2(a.u,a.e,m)},
nA(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
l5(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.nS(s,o.x)[p]
if(n==null)A.v('No "'+p+'" in "'+A.nd(o)+'"')
d.push(A.dE(s,o,n))}else d.push(p)
return m},
nC(a,b){var s,r=a.u,q=A.l4(a,b),p=b.pop()
if(typeof p=="string")b.push(A.dC(r,p,q))
else{s=A.c2(r,a.e,p)
switch(s.w){case 11:b.push(A.jU(r,s,q,a.n))
break
default:b.push(A.jT(r,s,q))
break}}},
nz(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.l4(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.c2(p,a.e,o)
q=new A.ex()
q.a=s
q.b=n
q.c=m
b.push(A.l8(p,r,q))
return
case-4:b.push(A.lb(p,b.pop(),s))
return
default:throw A.h(A.dL("Unexpected state under `()`: "+A.z(o)))}},
nB(a,b){var s=b.pop()
if(0===s){b.push(A.dD(a.u,1,"0&"))
return}if(1===s){b.push(A.dD(a.u,4,"1&"))
return}throw A.h(A.dL("Unexpected extended operation "+A.z(s)))},
l4(a,b){var s=b.splice(a.p)
A.l6(a.u,a.e,s)
a.p=b.pop()
return s},
c2(a,b,c){if(typeof c=="string")return A.dC(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.nD(a,b,c)}else return c},
l6(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.c2(a,b,c[s])},
nF(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.c2(a,b,c[s])},
nD(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.h(A.dL("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.h(A.dL("Bad index "+c+" for "+b.v(0)))},
lR(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.a5(a,b,null,c,null)
r.set(c,s)}return s},
a5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.cb(d))return!0
s=b.w
if(s===4)return!0
if(A.cb(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.a5(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.a5(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.a5(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.a5(a,b.x,c,d,e))return!1
return A.a5(a,A.jE(a,b),c,d,e)}if(s===6)return A.a5(a,p,c,d,e)&&A.a5(a,b.x,c,d,e)
if(q===7){if(A.a5(a,b,c,d.x,e))return!0
return A.a5(a,b,c,A.jE(a,d),e)}if(q===6)return A.a5(a,b,c,p,e)||A.a5(a,b,c,d.x,e)
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
if(!A.a5(a,j,c,i,e)||!A.a5(a,i,e,j,c))return!1}return A.lw(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.lw(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.ov(a,b,c,d,e)}if(o&&q===10)return A.oA(a,b,c,d,e)
return!1},
lw(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.a5(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.a5(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.a5(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.a5(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.a5(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
ov(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.dE(a,b,r[o])
return A.lh(a,p,null,c,d.y,e)}return A.lh(a,b.y,null,c,d.y,e)},
lh(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.a5(a,b[s],d,e[s],f))return!1
return!0},
oA(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.a5(a,r[s],c,q[s],e))return!1
return!0},
cI(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.cb(a))if(s!==6)r=s===7&&A.cI(a.x)
return r},
cb(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
lf(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
ie(a){return a>0?new Array(a):v.typeUniverse.sEA},
aQ:function aQ(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
ex:function ex(){this.c=this.b=this.a=null},
i9:function i9(a){this.a=a},
eu:function eu(){},
cC:function cC(a){this.a=a},
nq(){var s,r,q
if(self.scheduleImmediate!=null)return A.p_()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.cH(new A.fW(s),1)).observe(r,{childList:true})
return new A.fV(s,r,q)}else if(self.setImmediate!=null)return A.p0()
return A.p1()},
nr(a){self.scheduleImmediate(A.cH(new A.fX(t.O.a(a)),0))},
ns(a){self.setImmediate(A.cH(new A.fY(t.O.a(a)),0))},
nt(a){t.O.a(a)
A.nH(0,a)},
nH(a,b){var s=new A.i6()
s.eM(a,b)
return s},
lz(a){return new A.eo(new A.M($.G,a.i("M<0>")),a.i("eo<0>"))},
ll(a,b){a.$2(0,null)
b.b=!0
return b.a},
ij(a,b){A.o2(a,b)},
lk(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("aA<1>").b(a))s.cV(a)
else s.cZ(a)},
lj(a,b){var s=A.am(a),r=A.bq(a),q=A.lv(s,r)
s=new A.az(s,r)
r=b.b
q=b.a
if(r)q.bp(s)
else q.bn(s)},
o2(a,b){var s,r,q=new A.ik(b),p=new A.il(b)
if(a instanceof A.M)a.dJ(q,p,t.z)
else{s=t.z
if(a instanceof A.M)a.cB(q,p,s)
else{r=new A.M($.G,t._)
r.a=8
r.c=a
r.dJ(q,p,s)}}},
lI(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.G
return r.c7(r,t.as.a(new A.iJ(s)),t.H,t.S,t.z)},
jl(a){var s
if(t.R.b(a)){s=a.gb2()
if(s!=null)return s}return B.q},
lv(a,b){var s=$.G
if(s===B.i)return null
s.ff(s,a,b)
return null},
or(a,b){if($.G!==B.i)A.lv(a,b)
if(t.R.b(a)){b=a.gb2()
if(b==null){A.n9(a,B.q)
b=B.q}}else b=B.q
return new A.az(a,b)},
jN(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.ne()
b.bn(new A.az(new A.aZ(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.dr(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.b5()
b.bo(n.a)
A.c0(b,p)
return}b.a^=2
o=b.b
o.b6(o,new A.hC(n,b))},
c0(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.b4(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.c0(e.a,d)
q.a=l
k=l.a}j=e.a.c
q.b=n
q.c=j
if(o){p=d.c
p=(p&1)!==0||(p&15)===8}else p=!0
if(p){i=d.b.b
h=$.G
if(h!==i)$.G=i
else h=null
d=d.c
if((d&15)===8)new A.hG(q,e,n).$0()
else if(o){if((d&1)!==0)new A.hF(q,j).$0()}else if((d&2)!==0)new A.hE(e,q).$0()
if(h!=null)$.G=h
d=q.c
if(d instanceof A.M){p=q.a.$ti
p=p.i("aA<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bA(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.jN(d,g,!0)
return}}g=q.a.b
f=r.a(g.c)
g.c=null
b=g.bA(f)
d=q.b
p=q.c
if(!d){g.$ti.c.a(p)
g.a=8
g.c=p}else{s.a(p)
g.a=g.a&1|16
g.c=p}e.a=g
d=g}},
oN(a,b){var s=t.C
if(s.b(a))return b.c7(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.bz(b,s.a(a),t.z,t.K)
throw A.h(A.ks(a,"onError",u.c))},
oG(){var s,r
for(s=$.cD;s!=null;s=$.cD){$.dI=null
r=s.b
$.cD=r
if(r==null)$.dH=null
s.a.$0()}},
oV(){$.jZ=!0
try{A.oG()}finally{$.dI=null
$.jZ=!1
if($.cD!=null)$.kk().$1(A.lK())}},
lG(a){var s=new A.ep(a),r=$.dH
if(r==null){$.cD=$.dH=s
if(!$.jZ)$.kk().$1(A.lK())}else $.dH=r.b=s},
oQ(a){var s,r,q,p=$.cD
if(p==null){A.lG(a)
$.dI=$.dH
return}s=new A.ep(a)
r=$.dI
if(r==null){s.b=p
$.cD=$.dI=s}else{q=r.b
s.b=q
$.dI=r.b=s
if(q==null)$.dH=s}},
px(a){var s=$.G
if(B.i===s){A.k2(B.i,a)
return}A.k2(s,s.by(s,a,t.H))
return},
pT(a,b){A.k8(a,"stream",t.K)
return new A.eD(b.i("eD<0>"))},
k3(a){return},
nu(a,b){if(b==null)b=A.p3()
if(t.da.b(b))return a.c7(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.bz(a,t.w.a(b),t.z,t.K)
throw A.h(A.ay("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
oI(a,b){var s=$.G
s.b4(s,a,b)},
oH(){},
oP(a,b){A.oQ(new A.iw(a,b))},
k2(a,b){if(B.i!==a)b=a.he(b,t.H)
A.lG(b)},
fW:function fW(a){this.a=a},
fV:function fV(a,b,c){this.a=a
this.b=b
this.c=c},
fX:function fX(a){this.a=a},
fY:function fY(a){this.a=a},
i6:function i6(){},
i7:function i7(a,b){this.a=a
this.b=b},
eo:function eo(a,b){this.a=a
this.b=!1
this.$ti=b},
ik:function ik(a){this.a=a},
il:function il(a){this.a=a},
iJ:function iJ(a){this.a=a},
az:function az(a,b){this.a=a
this.b=b},
es:function es(){},
dd:function dd(a,b){this.a=a
this.$ti=b},
bi:function bi(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
M:function M(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
hz:function hz(a,b){this.a=a
this.b=b},
hD:function hD(a,b){this.a=a
this.b=b},
hC:function hC(a,b){this.a=a
this.b=b},
hB:function hB(a,b){this.a=a
this.b=b},
hA:function hA(a,b){this.a=a
this.b=b},
hG:function hG(a,b,c){this.a=a
this.b=b
this.c=c},
hH:function hH(a,b){this.a=a
this.b=b},
hI:function hI(a){this.a=a},
hF:function hF(a,b){this.a=a
this.b=b},
hE:function hE(a,b){this.a=a
this.b=b},
ep:function ep(a){this.a=a
this.b=null},
da:function da(){},
fE:function fE(a,b){this.a=a
this.b=b},
fF:function fF(a,b){this.a=a
this.b=b},
dy:function dy(){},
i3:function i3(a){this.a=a},
i2:function i2(a){this.a=a},
eq:function eq(){},
cr:function cr(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
cs:function cs(a,b){this.a=a
this.$ti=b},
ct:function ct(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
de:function de(){},
fZ:function fZ(a){this.a=a},
dA:function dA(){},
bD:function bD(){},
bZ:function bZ(a,b){this.b=a
this.a=null
this.$ti=b},
et:function et(){},
aT:function aT(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
i_:function i_(a,b){this.a=a
this.b=b},
eD:function eD(a){this.$ti=a},
fT:function fT(){},
fU:function fU(a,b,c){this.a=a
this.b=b
this.c=c},
iw:function iw(a,b){this.a=a
this.b=b},
mU(a,b,c){return b.i("@<0>").V(c).i("jx<1,2>").a(A.pe(a,new A.b7(b.i("@<0>").V(c).i("b7<1,2>"))))},
V(a,b){return new A.b7(a.i("@<0>").V(b).i("b7<1,2>"))},
mV(a){return new A.bk(a.i("bk<0>"))},
fe(a){return new A.bk(a.i("bk<0>"))},
jP(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
kI(a){var s,r
if(A.kc(a))return"{...}"
s=new A.co("")
try{r={}
B.a.k($.aG,a)
s.a+="{"
r.a=!0
a.aQ(0,new A.fi(r,s))
s.a+="}"}finally{if(0>=$.aG.length)return A.a($.aG,-1)
$.aG.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
bk:function bk(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
c1:function c1(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
eB:function eB(a){this.a=a
this.c=this.b=null},
bl:function bl(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
J:function J(){},
y:function y(){},
fg:function fg(a){this.a=a},
fh:function fh(a){this.a=a},
fi:function fi(a,b){this.a=a
this.b=b},
bd:function bd(){},
dv:function dv(){},
oJ(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.am(r)
q=A.P(String(s),null,null)
throw A.h(q)}q=A.io(p)
return q},
io(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.ez(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.io(a[s])
return a},
nU(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.mj()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
nT(a,b,c,d){var s=a?$.mi():$.mh()
if(s==null)return null
if(0===c&&d===b.length)return A.le(s,b)
return A.le(s,b.subarray(c,d))},
le(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
nV(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
ez:function ez(a,b){this.a=a
this.b=b
this.c=null},
hS:function hS(a){this.a=a},
eA:function eA(a){this.a=a},
id:function id(){},
ic:function ic(){},
dO:function dO(){},
dQ:function dQ(){},
e_:function e_(){},
f9:function f9(a){this.a=a},
eH:function eH(a){this.a=a
this.b=16
this.c=0},
lQ(a,b){var s=A.n7(a,b)
if(s!=null)return s
throw A.h(A.P(a,null,null))},
pb(a){var s=A.jB(a)
if(s!=null)return s
throw A.h(A.P("Invalid double",a,null))},
mG(a,b){a=A.a1(a,new Error())
if(a==null)a=A.aW(a)
a.stack=b.v(0)
throw a},
kG(a,b,c,d){var s,r=c?J.mN(a,d):J.mM(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
mW(a,b,c){var s,r,q=A.f([],c.i("x<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.Z)(a),++r)B.a.k(q,c.a(a[r]))
q.$flags=1
return q},
ba(a,b){var s,r
if(Array.isArray(a))return A.f(a.slice(0),b.i("x<0>"))
s=A.f([],b.i("x<0>"))
for(r=J.ce(a);r.t();)B.a.k(s,r.gC())
return s},
ef(a,b,c){var s,r
A.jD(b,"start")
s=c-b
if(s<0)throw A.h(A.as(c,b,null,"end",null))
if(s===0)return""
r=A.nf(a,b,c)
return r},
nf(a,b,c){var s=a.length
if(b>=s)return""
return A.n8(a,b,c==null||c>s?s:c)},
ea(a){return new A.dY(a,A.kE(a,!1,!0,!1,!1,""))},
kQ(a,b,c){var s=J.ce(b)
if(!s.t())return a
if(c.length===0){do a+=A.z(s.gC())
while(s.t())}else{a+=A.z(s.gC())
while(s.t())a=a+c+A.z(s.gC())}return a},
ne(){return A.bq(new Error())},
eZ(a){if(typeof a=="number"||A.aX(a)||a==null)return J.bK(a)
if(typeof a=="string")return JSON.stringify(a)
return A.kN(a)},
mH(a,b){A.k8(a,"error",t.K)
A.k8(b,"stackTrace",t.l)
A.mG(a,b)},
dL(a){return new A.cK(a)},
ay(a,b){return new A.aZ(!1,null,b,a)},
ks(a,b,c){return new A.aZ(!0,a,b,c)},
na(a){var s=null
return new A.bc(s,s,!1,s,s,a)},
nb(a,b){return new A.bc(null,null,!0,a,b,"Value not in range")},
as(a,b,c,d,e){return new A.bc(b,c,!0,a,d,"Invalid value")},
bz(a,b,c){if(0>a||a>c)throw A.h(A.as(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.h(A.as(b,a,c,"end",null))
return b}return c},
jD(a,b){if(a<0)throw A.h(A.as(a,0,null,b,null))
return a},
kC(a,b,c,d){return new A.dS(b,!0,a,d,"Index out of range")},
bB(a){return new A.db(a)},
kZ(a){return new A.ek(a)},
au(a){return new A.bA(a)},
aJ(a){return new A.dP(a)},
P(a,b,c){return new A.a2(a,b,c)},
mL(a,b,c){var s,r
if(A.kc(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.f([],t.s)
B.a.k($.aG,a)
try{A.oE(a,s)}finally{if(0>=$.aG.length)return A.a($.aG,-1)
$.aG.pop()}r=A.kQ(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
ju(a,b,c){var s,r
if(A.kc(a))return b+"..."+c
s=new A.co(b)
B.a.k($.aG,a)
try{r=s
r.a=A.kQ(r.a,a,", ")}finally{if(0>=$.aG.length)return A.a($.aG,-1)
$.aG.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
oE(a,b){var s,r,q,p,o,n,m,l=a.gE(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.t())return
s=A.z(l.gC())
B.a.k(b,s)
k+=s.length+2;++j}if(!l.t()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gC();++j
if(!l.t()){if(j<=4){B.a.k(b,A.z(p))
return}r=A.z(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gC();++j
for(;l.t();p=o,o=n){n=l.gC();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.a.k(b,"...")
return}}q=A.z(p)
r=A.z(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.a.k(b,m)
B.a.k(b,q)
B.a.k(b,r)},
e5(a,b,c,d){var s
if(B.m===c){s=J.ax(a)
b=J.ax(b)
return A.fJ(A.bf(A.bf($.eS(),s),b))}if(B.m===d){s=J.ax(a)
b=J.ax(b)
c=J.ax(c)
return A.fJ(A.bf(A.bf(A.bf($.eS(),s),b),c))}s=J.ax(a)
b=J.ax(b)
c=J.ax(c)
d=J.ax(d)
d=A.fJ(A.bf(A.bf(A.bf(A.bf($.eS(),s),b),c),d))
return d},
n3(a){var s,r,q=$.eS()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.Z)(a),++r)q=A.bf(q,J.ax(a[r]))
return A.fJ(q)},
hf:function hf(){},
O:function O(){},
cK:function cK(a){this.a=a},
bg:function bg(){},
aZ:function aZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
bc:function bc(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
dS:function dS(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
db:function db(a){this.a=a},
ek:function ek(a){this.a=a},
bA:function bA(a){this.a=a},
dP:function dP(a){this.a=a},
e6:function e6(){},
d9:function d9(){},
hg:function hg(a){this.a=a},
a2:function a2(a,b,c){this.a=a
this.b=b
this.c=c},
m:function m(){},
aK:function aK(a,b,c){this.a=a
this.b=b
this.$ti=c},
a3:function a3(){},
e:function e(){},
eE:function eE(){},
fD:function fD(){this.b=this.a=0},
co:function co(a){this.a=a},
oa(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.z(a)
r=A.p5(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.v("Attempting to box non-Dart object.")
q={}
q[$.mk()]=a
r.error=q
r.stack=b.v(0)
return r},
mJ(a,b){var s,r=v.G.Promise,q=new A.f3(a)
if(typeof q=="function")A.v(A.ay("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.o5,q)
s[$.jc()]=q
return A.u(new r(s))},
fp:function fp(a){this.a=a},
f3:function f3(a){this.a=a},
f1:function f1(a){this.a=a},
f2:function f2(a){this.a=a},
o4(a,b,c){t.Z.a(a)
if(A.j(c)>=1)return a.$1(b)
return a.$0()},
o5(a,b,c,d){t.Z.a(a)
A.j(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
c9(a,b,c,d){return d.a(a[b].apply(a,c))},
p5(a,b,c){var s,r
if(b==null)return c.a(new a())
if(b instanceof Array)switch(b.length){case 0:return c.a(new a())
case 1:return c.a(new a(b[0]))
case 2:return c.a(new a(b[0],b[1]))
case 3:return c.a(new a(b[0],b[1],b[2]))
case 4:return c.a(new a(b[0],b[1],b[2],b[3]))}s=[null]
B.a.a4(s,b)
r=a.bind.apply(a,s)
String(r)
return c.a(new r())},
ke(a,b){var s=new A.M($.G,b.i("M<0>")),r=new A.dd(s,b.i("dd<0>"))
a.then(A.cH(new A.iZ(r,b),1),A.cH(new A.j_(r),1))
return s},
iZ:function iZ(a,b){this.a=a
this.b=b},
j_:function j_(a){this.a=a},
f4:function f4(){},
f5:function f5(a,b,c){this.a=a
this.b=b
this.c=c},
hJ:function hJ(){},
hL:function hL(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
hK:function hK(a){this.a=a},
jp(a,b){var s=new A.f6()
s.eK(a,b)
return s},
f6:function f6(){this.a=$
this.b=0
this.c=2147483647},
fS:function fS(){},
ig:function ig(){},
ih:function ih(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
em:function em(a){this.a=a
this.c=this.b=0},
dT:function dT(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
p9(a,b,c){var s,r="The decoded data is larger than the ",q=new A.e0(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.h(A.jk(r+b+" bytes allowed"))
throw s}if(q.e)throw A.h(A.jk(r+b+" bytes allowed"))
return p},
e0:function e0(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
jj(a){return new A.cf(a,null,null)},
ji(a){return new A.cJ(a,null,null)},
jk(a){return new A.dK(a,null,null)},
cf:function cf(a,b,c){this.a=a
this.b=b
this.c=c},
cJ:function cJ(a,b,c){this.a=a
this.b=b
this.c=c},
dK:function dK(a,b,c){this.a=a
this.b=b
this.c=c},
cL:function cL(a,b){this.a=a
this.b=b},
ec:function ec(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
lP(a,b,c,d){var s,r,q,p=c,o=new A.hd($.jV)
$.jV=o
try{if(d.$0())return!0
if(p){r=A.jj("Invalid "+a+" data")
throw A.h(r)}return!1}catch(q){s=A.am(q)
r=s
if(!(r instanceof A.cf||r instanceof A.cJ||r instanceof A.a2||t.b8.b(r)||t.k.b(r)))throw q
r=s instanceof A.dK
if(r)throw q
if(s instanceof A.cJ){if(b&&c)throw q
if(c){r=A.jj(s.a)
throw A.h(r)}return!1}if(s instanceof A.cf){if(p)throw q
return!1}if(p){r=A.jj("Invalid "+a+" data: "+A.z(s))
throw A.h(r)}return!1}finally{$.jV=o.a}},
hd:function hd(a){this.a=a},
jq(a,b,c,d){var s,r,q,p,o=new A.dU(b)
if(d==null)d=0
A.jD(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.ae(a))
p=J.cd(B.d.gan(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
dU:function dU(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
dV:function dV(){},
jA(a){var s=a==null?32768:a
return new A.bV(new Uint8Array(s),B.o)},
bV:function bV(a,b){this.b=0
this.c=a
this.a=b},
by:function by(){},
mv(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
mu(a){var s,r,q,p,o=new Uint32Array(2048)
B.l.B(o,0,256,a)
for(s=0;s<256;++s){r=a[s]
for(q=1;q<8;++q){r=(a[r&255]^r>>>8)>>>0
p=(q<<8|s)>>>0
if(!(p<2048))return A.a(o,p)
o[p]=r}}return o},
ku(a,b,c){var s,r,q,p,o,n,m,l,k=$.lW(),j=b+c,i=4294967295
if(c>=16){s=A.jn(a,b,j)
r=(c&4294967288)>>>0
for(q=0;q<r;){p=s.getUint32(q,!0)^i
o=s.getUint32(q+4,!0)
i=k[1792+(p&255)]^k[1536+(p>>>8&255)]^k[1280+(p>>>16&255)]^k[1024+(p>>>24&255)]^k[768+(o&255)]^k[512+(o>>>8&255)]^k[256+(o>>>16&255)]^k[o>>>24&255]
q+=8}n=b+q}else n=b
for(m=a.length;n<j;n=l){l=n+1
if(!(n<m))return A.a(a,n)
i=k[(i^a[n])&255]^i>>>8}return(i^4294967295)&2147483647},
aq(a,b){return(a&65535)*b+(((a>>>16)*b&65535)<<16>>>0)>>>0},
kt(a,b){return(B.b.dA(a,b)|B.b.eC(a,32-b))>>>0},
mw(a,b,c,d){var s,r,q,p,o,n,m,l=3266489917,k=d?1367130551:0,j=(2654435761^c^k)>>>0,i=b+c,h=(c&4294967292)>>>0
if(c>=16){s=A.jn(a,b,i)
for(r=0;r<h;){k=j+A.aq(s.getUint32(r,!0),l)>>>0
j=A.aq((k<<17|k>>>15)>>>0,668265263)
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
m=j+A.aq((p|o<<8|n<<16|a[m]<<24)>>>0,l)>>>0
j=A.aq((m<<17|m>>>15)>>>0,668265263)
q+=4}}for(k=a.length;q<i;){if(!(q<k))return A.a(a,q)
p=j+A.aq(a[q],374761393)>>>0
j=A.aq((p<<11|p>>>21)>>>0,2654435761);++q}j=A.aq((j^j>>>15)>>>0,2246822519)
j=A.aq((j^j>>>13)>>>0,l)
return(j^j>>>16)>>>0},
jm(a,b,c,d,e){var s=e?2147483648:0,r=(a&2147483647|s)>>>0,q=A.mw(b,c,d,e)
return new A.A(r,r===0&&q===0?1:q)},
kv(a,b,c,d){var s=A.kt(A.aq((a^c)>>>0,2246822519),13),r=A.kt(A.aq((b^d)>>>0,3266489917),17)
s=A.aq(s+r>>>0,668265263)
return new A.A(s,A.aq((r^s>>>16)>>>0,374761393))},
eC:function eC(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eU:function eU(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
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
eY:function eY(a,b,c){this.a=a
this.b=b
this.c=c},
eX:function eX(a,b){this.a=a
this.b=b},
eV:function eV(a){this.a=a},
eW:function eW(a){this.a=a},
kH(a,b,c){var s,r,q
for(s=b;s<c;s=r){r=s+65536
q=r<c?r:c
B.d.B(a,s,q,$.m0())}},
mX(b5,b6,b7,b8,b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
if(b6<0||b6>b5.length)throw A.h(A.as(b6,0,b5.length,"srcLength",null))
if(b6===0)return 0
s=b9>=0?b9:b7.length
r=0
q=0
if(b6>=13){B.f.B(b8,0,16384,$.m_())
p=A.jn(b5,0,b6)
o=b6-12
n=b6-5
m=n-4
l=p.getUint32(0,!0)*2654435761>>>0>>>18
b8.$flags&2&&A.c(b8)
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
if(a3+B.b.J(a2,255)+1+a2+2>s)return-1
a0=a2>=15
a4=(a0?15:a2)<<4
if(a0){a5=a2-15
for(;a5>=255;a3=a6){a6=a3+1
i&2&&A.c(b7)
if(!(a3>=0&&a3<b7.length))return A.a(b7,a3)
b7[a3]=255
a5-=255}a6=a3+1
i&2&&A.c(b7)
if(!(a3>=0&&a3<b7.length))return A.a(b7,a3)
b7[a3]=a5
a3=a6}if(a2>=8){a6=a3+a2
B.d.O(b7,a3,a6,b5,q)
a3=a6}else for(a7=0;a7<a2;++a7,a3=a6){a6=a3+1
a0=q+a7
if(!(a0>=0&&a0<l))return A.a(b5,a0)
a0=b5[a0]
i&2&&A.c(b7)
if(!(a3>=0&&a3<b7.length))return A.a(b7,a3)
b7[a3]=a0}a8=h-a
a6=a3+1
i&2&&A.c(b7)
a0=b7.length
if(!(a3>=0&&a3<a0))return A.a(b7,a3)
b7[a3]=a8&255
a3=a6+1
a1=B.b.I(a8,8)
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
if(a3+(B.b.J(a5,255)+1)>=s)return-1
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
i=r+(1+(l?B.b.J(b4-15,255)+1:0)+b4)
if(i>s||i>b7.length)return-1
a3=r+1
i=b7.$flags|0
if(l){i&2&&A.c(b7)
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
r=a3}else{i&2&&A.c(b7)
if(!(r>=0&&r<b7.length))return A.a(b7,r)
b7[r]=b4<<4>>>0
r=a3}l=r+b4
B.d.O(b7,r,l,b5,q)
return l},
mY(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0
if(b3<0||b2+b3>b1.length||b5<0||b5>b4.length)throw A.h(A.na("Invalid LZ4 slice bounds"))
if(b3===0){if(b5!==0)throw A.h(B.X)
return 0}s=b2+b3
for(r=b4.length,q=b4.$flags|0,p=b1.length,o=b2,n=0;o<s;){m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
l=b1[o]
k=l>>>4
if(k===15)for(o=m;;o=m){if(o>=s)throw A.h(B.Y)
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
j=b1[o]
k+=j
if(j!==255){o=m
break}}else o=m
m=o+k
if(m>s||n+k>b5)throw A.h(B.W)
i=n+k
if(k>=8){B.d.O(b4,n,i,b1,o)
n=i
o=m}else for(;n<i;n=h,o=m){h=n+1
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
g=b1[o]
q&2&&A.c(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}if(o>=s)break
m=o+2
if(m>s)throw A.h(B.S)
if(!(o>=0&&o<p))return A.a(b1,o)
g=b1[o]
f=o+1
if(!(f<p))return A.a(b1,f)
e=(g|b1[f]<<8)>>>0
if(e<=0||e>n)throw A.h(B.U)
g=l&15
d=g+4
if(g===15)for(o=m;;o=m){if(o>=s)throw A.h(B.Z)
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
j=b1[o]
d+=j
if(j!==255){o=m
break}}else o=m
i=n+d
if(i>b5)throw A.h(B.a0)
c=n-e
if(e>=d){if(d>=8)B.d.O(b4,n,i,b4,c)
else for(b=0;b<d;++b){g=n+b
f=c+b
if(!(f>=0&&f<r))return A.a(b4,f)
f=b4[f]
q&2&&A.c(b4)
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
if((a|a0|a1|a2)===0){A.kH(b4,n,i)
n=i}else if(d<=32){a3=n+((d&4294967292)>>>0)
while(n<a3){q&2&&A.c(b4)
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
q&2&&A.c(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}}else{for(b=0;b<16;b+=4){g=n+b
q&2&&A.c(b4)
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
B.d.O(b4,g,g+a7,b4,n)
a5+=a7}n=i}}else if(e===1){if(!(c>=0&&c<r))return A.a(b4,c)
a8=b4[c]
if(a8===0){A.kH(b4,n,i)
n=i}else if(d<=32)for(;n<i;n=h){h=n+1
q&2&&A.c(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=a8}else{for(b=0;b<16;++b){g=n+b
q&2&&A.c(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=a8}for(a5=16;a5<d;){a6=d-a5
a7=a5<a6?a5:a6
g=n+a5
B.d.O(b4,g,g+a7,b4,n)
a5+=a7}n=i}}else if(d>32){a9=e>=16?e:B.b.a0(16+e-1,e)*e
b0=a9<d?a9:d
for(a5=0;a5<b0;){g=n+a5
f=c+a5
if(!(f>=0&&f<r))return A.a(b4,f)
f=b4[f]
q&2&&A.c(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=f;++a5}while(a5<d){a6=d-a5
a7=a5<a6?a5:a6
g=n+a5
B.d.O(b4,g,g+a7,b4,n)
a5+=a7}n=i}else for(;n<i;c=a4,n=h){h=n+1
a4=c+1
if(!(c>=0&&c<r))return A.a(b4,c)
g=b4[c]
q&2&&A.c(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}}if(n!==b5)throw A.h(A.P("LZ4 decoded "+n+" bytes, expected "+b5,null,null))
return n},
ff:function ff(a,b){this.a=a
this.b=b
this.c=0},
nl(c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5=null,c6=d5*d1,c7=c9.length
if(d5<=0||d1<=0||c6>147456||c7<2||c7>4||d4.length<c6*4)return c5
s=B.b.J(d5+16-1,16)
r=s*B.b.J(d1+16-1,16)
q=c7*r
p=new Uint16Array(q)
o=new Uint8Array(4)
B.d.ag(o,0,4,255)
n=new Uint32Array(4)
m=new Uint32Array(4)
l=c6*4
if((d4.byteOffset&3)===0){k=A.jL(d4,0,l)
j=c5}else{j=new Uint8Array(l)
k=A.jL(j,0,l)}i=A.f([],t.a1)
h=A.V(t.h6,t.L)
g=128+p.byteLength
for(f=k.length,e=j!=null,d=0,c=0;c<c7;++c){if(!(c<c9.length))return A.a(c9,c)
b=c9[c]
a=b-c8
a0=!0
if(a>=0)if(a<4){if(!(a>=0&&a<4))return A.a(o,a)
a0=o[a]!==255||!d3.$2(b,d4)}if(a0)return c5
if(e)B.d.B(j,0,l,d4)
if(!(a>=0&&a<4))return A.a(o,a)
o[a]=c
a1=d0.$1(b)
if(a1==null)a1=B.v
if(!(c<4))return A.a(n,c)
n[c]=a1.a
m[c]=a1.b
for(a0=c>0,a2=c*r,a3=(c-1)*r,a4=0;a4<r;++a4){a5=B.b.N(a4,s)*16
a6=B.b.a0(a4,s)*16
a7=Math.min(16,d5-a5)
a8=Math.min(16,d1-a6)
for(a9=2166136261,b0=0;b0<a8;++b0){b1=(a6+b0)*d5+a5
for(b2=0;b2<a7;++b2){b3=b1+b2
if(!(b3>=0&&b3<f))return A.a(k,b3)
a9=((a9^k[b3])>>>0)*16777619>>>0}}b4=h.en(new A.aM(a7,a8,a9),new A.fL())
b3=J.bI(b4)
b6=b3.gE(b4)
for(;;){if(!b6.t()){b5=-1
break}b5=b6.gC()
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
B.l.O(b7,b0*a7,c3*a7,k,(a6+b0)*d5+a5)}b5=i.length
b3.k(b4,b5)
B.a.k(i,b7)}b3=a2+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
p[b3]=b5
if(a0){b3=a3+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
b3=p[b3]!==b5}else b3=!1
if(b3)++d}}if(d*3>(c7-1)*r)return c5
q=A.f([],t.gN)
for(l=i.length,c4=0;c4<i.length;i.length===l||(0,A.Z)(i),++c4)q.push(J.mp(B.l.gan(i[c4])))
return new A.ei(d5,d1,c8,o,p,q,new A.e(),g,n,m)},
fK:function fK(){this.a=null
this.b=-1},
ei:function ei(a,b,c,d,e,f,g,h,i,j){var _=this
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
fL:function fL(){},
aE:function aE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
o6(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.l.B(a,0,b,$.kn())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.l.B(a,s,q,$.kn())}},
iS(a){var s=0,r=A.lz(t.H),q,p,o,n,m
var $async$iS=A.lI(function(b,c){if(b===1)return A.lj(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.ij(A.ke(A.u(v.G.WebAssembly.instantiate(a)),t.m),$async$iS)
case 2:o=n.u(m.u(c.instance).exports)
for(q=0;q<13;++q){p=B.a9[q]
if(!(typeof o[p]==="function"))throw A.h(A.au("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.u(o.memory).buffer).byteLength===0)throw A.h(A.au("FastLottie Wasm memory is empty"))
$.lt=typeof o.fastlottie_composite_matte==="function"
$.lu=typeof o.fl_dense_raster_solid==="function"
$.k=o
return A.lk(null,r)}})
return A.ll($async$iS,r)},
aV(a){var s,r,q=$.k
q.toString
s=a===0?1:a
r=A.j(q.malloc(s))>>>0
if(r===0)throw A.h(A.au("Could not allocate "+a+" Wasm bytes"))
B.d.ag(A.jz(t.a.a(A.u($.k.memory).buffer),r,a),0,a,0)
return r},
fo(a){var s=new A.b_(!0,a,null,null),r=$.k!=null
if(r)s.c=A.aV(a*4)
else s.d=new Uint32Array(a)
return s},
cc(a,b){var s
if(b<=0)return
s=a.b
if(b>s)throw A.h(A.as(b,0,s,"count",null))
s=a.c
if(s!=null){$.a6=$.a6+1
$.k.fastlottie_clear_pixels(s,b)}else A.o6(a.gA(),b)},
py(a,b,c,d,e,f,g){var s,r,q,p=a.c
if(p!=null&&e.b!=null&&d>0&&f>=0&&f*2<=e.a){if(f===0)return!0
$.a6=$.a6+1
s=$.k
s.toString
r=a.b
q=e.b
q.toString
A.c9(s,"fastlottie_fill_solid_spans_v2",[p,r,b,c,d,q,f,g],t.H)
return!0}return!1},
pq(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null||e<=0||f<=0||c<=0||b<0||d.b<e*f||b+(f-1)*c+e>a.b)return!1
try{$.a6=$.a6+1
s=$.k
s.toString
A.c9(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
pr(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null||d<=0||f<0||f*2>e.a)return!1
if(f===0)return!0
try{$.a6=$.a6+1
s=$.k
s.toString
A.c9(s,"fastlottie_blend_solid_v2",[q,a.b,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
pu(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null||e<=0||f<=0||i<=0||j<=0||c<=0||b<0||g<0||h<0||g+i>e||h+j>f||d.b<e*f||b+(j-1)*c+i>a.b)return!1
try{$.a6=$.a6+1
s=$.k
s.toString
A.c9(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
pt(a,b,c,d,e,f,g,h,i,j,k,l,m,n,a0,a1,a2,a3,a4,a5){var s,r,q,p,o=a.c
if(o==null||e.b==null||g.c==null||d<=0||f<0||f*2>e.a||g.b<1024)return!1
if(f===0)return!0
$.a6=$.a6+1
s=$.k
s.toString
r=a.b
q=e.b
q.toString
p=g.c
p.toString
A.c9(s,"fastlottie_gradient_spans_v2",[o,r,b,c,d,q,f,p,h,i,j?1:0,k,l,m,n,a0,a1,a2,a3,a4,a5],t.H)
return!0},
ps(a,b,c,d,e,f,g,h,i,j,k,a0){var s,r,q,p,o,n,m,l=$.lt
if(!l)return!1
s=a.c
r=e.c
q=f.c
l=!0
if(s!=null)if(r!=null)if(q!=null)if(g>0)if(h>0)if(d>0)if(i>=b)if(j>=c){l=g*h
l=e.b<l||f.b<l}if(l)return!1
l=i-b
if((j-c)*d+l<0||(j+h-1-c)*d+l+g>a.b)return!1
try{$.a6=$.a6+1
l=$.k
l.toString
p=a.b
o=k?1:0
n=a0?1:0
A.c9(l,"fastlottie_composite_matte",[s,p,b,c,d,r,q,g,h,i,j,o,n],t.H)
return!0}catch(m){return!1}},
n1(){var s,r,q=$.k==null
if(q)return null
try{s=A.j($.k.fl_dense_new())
if(!J.l(s,0)){q=A.aV(16)
return new A.fj(s,q)}}catch(r){}return null},
n0(){var s,r=$.fk
if(r!=null){$.cV=$.cV+1
return r}s=A.n1()
if(s==null)return null
$.fk=s
$.cV=1
return s},
bb:function bb(a){this.a=a
this.c=this.b=null},
b_:function b_(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fj:function fj(a,b){var _=this
_.a=a
_.b=b
_.y=_.x=_.w=_.r=_.f=_.e=_.d=_.c=0},
fm:function fm(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
fl:function fl(a,b,c,d,e,f,g,h,i,j,k,l,m){var _=this
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
_.as=m},
bo(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
while(a instanceof A.Y)a=a.a
if(a instanceof A.a8){s=a.c
if(!s.gaH()){r=a5.d8(a7)
A.eJ(s,b,c,d,e,a0,a1,a2,r)
q=r[0]
p=r[1]
o=r[2]
n=r[3]
m=r[4]
l=r[5]}else{l=a2
m=a1
n=a0
o=e
p=d
q=c}for(s=a.a,k=s.length-1,j=a7+1;k>=0;--k){if(!(k<s.length))return A.a(s,k)
A.bo(s[k],b,q,p,o,n,m,l,a3,a4,a5,a6,j)}return}if(a instanceof A.bn){i=A.of(a.a,a.b,b,A.k_(c,d,e,a0,a3),a5,a6,a7)
if(i!=null&&i.r>0)a4.ae(i,c,d,e,a0,a1,a2)
return}if(a instanceof A.aS){s=a.a
j=s.length
if(j===0)return
h=a.b
if(h===1){for(k=0;k<s.length;++k)A.bo(s[k],b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7)
return}if(j===1){if(h===3||h===4)return
if(0>=j)return A.a(s,0)
A.bo(s[0],b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7)
return}if(a.ga8())g=a5.h3(a,b,a6,a7)
else{g=a5.eS(a7)
A.lg(a,b,A.k_(c,d,e,a0,a3),g,a5,a6,a7)}if(g.r>0)a4.ae(g,c,d,e,a0,a1,a2)
return}if(a.ga8()){a4.ae(a5.dD(a,b),c,d,e,a0,a1,a2)
return}if(c===1&&d===0&&e===0&&a0===1&&a1===0&&a2===0)A.iq(a,b,a3,a4)
else{f=a5.fx
f.j(0)
A.iq(a,b,A.k_(c,d,e,a0,a3),f)
a4.ae(f,c,d,e,a0,a1,a2)}},
k_(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
lr(c2,c3,c4,c5,c6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8=c2.e,b9=b8.q(c3),c0=b9.length,c1=c0/6|0
if(c1===0)return
s=c2.f
r=c2.r
if(r.length!==0){q=b8.b.a
if(c3<=B.e.ga7(q)){p=B.a.ga7(r).a
s=p}else if(c3>=B.e.gaA(q)){p=B.a.gaA(r).a
s=p}else{b8=b8.r
if(!(b8<r.length))return A.a(r,b8)
o=r[b8]
n=o.a
m=o.b
p=n&&m
s=n}}else p=s
c5.a5(s)
l=c2.w
b8=!l
if(b8)for(;;)break
k=p?c1:c1-1
j=l&&!p?c1-1:0
i=l?2:4
h=l?4:2
r=j*6
if(c6!=null){q=c6.a
g=q[0]
f=q[1]
e=q[2]
d=q[3]
c=q[4]
b=q[5]
if(!(r>=0&&r<c0))return A.a(b9,r)
a=b9[r];++r
if(!(r<c0))return A.a(b9,r)
a0=b9[r]
c5.p(g*a+e*a0+c,f*a+d*a0+b)
for(a1=1;a1<=k;++a1,a0=b2,a=b1){if(b8){a2=a1-1
a3=a1===c1?0:a1}else{a2=c1-a1
if(p){a4=B.b.N(a2+1,c1)
a3=B.b.N(a2,c1)
a2=a4}else a3=a2-1}a5=a2*6
a6=a3*6
r=a5+i
if(!(r>=0&&r<c0))return A.a(b9,r)
a7=b9[r];++r
if(!(r<c0))return A.a(b9,r)
a8=b9[r]
r=a6+h
if(!(r>=0&&r<c0))return A.a(b9,r)
a9=b9[r];++r
if(!(r<c0))return A.a(b9,r)
b0=b9[r]
if(!(a6>=0&&a6<c0))return A.a(b9,a6)
b1=b9[a6]
r=a6+1
if(!(r<c0))return A.a(b9,r)
b2=b9[r]
r=Math.abs(a7)<=0.0001&&Math.abs(a8)<=0.0001&&Math.abs(a9)<=0.0001&&Math.abs(b0)<=0.0001
q=g*b1+e*b2
b3=f*b1+d*b2
if(r)c5.p(q+c,b3+b)
else{if(!(a5>=0&&a5<c0))return A.a(b9,a5)
b4=b9[a5]+a7
r=a5+1
if(!(r<c0))return A.a(b9,r)
b5=b9[r]+a8
b6=b1+a9
b7=b2+b0
c5.X(g*a+e*a0+c,f*a+d*a0+b,g*b4+e*b5+c,f*b4+d*b5+b,g*b6+e*b7+c,f*b6+d*b7+b,q+c,b3+b,c4)}}}else{if(!(r>=0&&r<c0))return A.a(b9,r)
a=b9[r];++r
if(!(r<c0))return A.a(b9,r)
a0=b9[r]
c5.p(a,a0)
for(a1=1;a1<=k;++a1,a0=b2,a=b1){if(b8){a2=a1-1
a3=a1===c1?0:a1}else{a2=c1-a1
if(p){a4=B.b.N(a2+1,c1)
a3=B.b.N(a2,c1)
a2=a4}else a3=a2-1}a5=a2*6
a6=a3*6
r=a5+i
if(!(r>=0&&r<c0))return A.a(b9,r)
a7=b9[r];++r
if(!(r<c0))return A.a(b9,r)
a8=b9[r]
r=a6+h
if(!(r>=0&&r<c0))return A.a(b9,r)
a9=b9[r];++r
if(!(r<c0))return A.a(b9,r)
b0=b9[r]
if(!(a6>=0&&a6<c0))return A.a(b9,a6)
b1=b9[a6]
r=a6+1
if(!(r<c0))return A.a(b9,r)
b2=b9[r]
if(Math.abs(a7)<=0.0001&&Math.abs(a8)<=0.0001&&Math.abs(a9)<=0.0001&&Math.abs(b0)<=0.0001)c5.p(b1,b2)
else{if(!(a5>=0&&a5<c0))return A.a(b9,a5)
r=b9[a5]
q=a5+1
if(!(q<c0))return A.a(b9,q)
c5.X(a,a0,r+a7,b9[q]+a8,b1+a9,b2+b0,b1,b2,c4)}}}c5.a3()},
lg(a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0
a4.j(0)
s=a1.a
r=s.length
if(r===0)return
if(0>=r)return A.a(s,0)
r=a7+1
A.bo(s[0],a2,1,0,0,1,0,0,a3,a4,a5,a6,r)
if(s.length===1){s=a1.b
if(s===3||s===4)a4.j(0)
return}q=a5.eT(a7)
p=a5.eU(a7)
o=a5.k3
if(o==null){n=new Float64Array(256)
m=new Float64Array(256)
l=new Float64Array(256)
k=new Float64Array(256)
j=new Float64Array(256)
i=new Float64Array(256)
h=new Float64Array(256)
g=new Float64Array(256)
f=new Int8Array(256)
e=new Uint8Array(256)
d=t.t
c=t.n
b=t.S
a=t.L
o=a5.k3=new A.fs(n,m,l,k,j,i,h,g,f,e,new Int32Array(256),A.f([],d),A.f([],t.gy),A.f([],c),A.f([],c),A.f([],c),A.V(b,a),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.V(b,a),A.f([],d),A.f([],d),A.f([],d),A.V(b,a),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],t.f7),A.f([],t.gL),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],d),A.f([],c),A.f([],c),A.f([],c),A.f([],d))}for(n=a1.b,m=n!==3,l=n===4,k=n!==2,j=n===5,a0=1;a0<s.length;++a0){if(a4.r===0)i=!m||l
else i=!1
if(i)break
q.w=q.r=q.f=0
q.x=!1
A.bo(s[a0],a2,1,0,0,1,0,0,a3,q,a5,a6,r)
p.w=p.r=p.f=0
p.x=!1
if(!A.p4(a4,q,n,p,o)){if(!k||j)a4.ae(q,1,0,0,1,0,0)
continue}a4.w=a4.r=a4.f=0
a4.x=!1
a4.ae(p,1,0,0,1,0,0)}},
iq(a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(a3 instanceof A.av){A.lr(a3,a4,a5,a6,null)
return}if(a3 instanceof A.b2){a6.a5(!0)
s=a6.ghc()
a3.fm(a4,s,s,new A.ir(a6,a5),a6.ght())
return}if(a3 instanceof A.aU){r=a3.r.q(a4)
q=a3.w.q(a4)
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
a6.a5(!0)
s=o-m
a6.p(p,s)
j=p+l
i=p+n
h=o-k
g=o+k
f=o+m
e=p-l
d=p-n
if(!a3.f){a6.X(p,s,j,s,i,h,i,o,a5)
a6.X(i,o,i,g,j,f,p,f,a5)
a6.X(p,f,e,f,d,g,d,o,a5)
a6.X(d,o,d,h,e,s,p,s,a5)}else{a6.X(p,s,e,s,d,h,d,o,a5)
a6.X(d,o,d,g,e,f,p,f,a5)
a6.X(p,f,j,f,i,g,i,o,a5)
a6.X(i,o,i,h,j,s,p,s,a5)}a6.a3()
return}s=a3.x.q(a4)
if(0>=s.length)return A.a(s,0)
c=B.c.D(s[0],0,Math.min(Math.abs(n),Math.abs(m)))
if(c<=0.0001){a6.a5(!0)
s=p+n
j=o-m
a6.p(s,j)
i=o+m
h=p-n
if(!a3.f){a6.p(s,i)
a6.p(h,i)
a6.p(h,j)}else{a6.p(h,j)
a6.p(h,i)
a6.p(s,i)}a6.a3()
return}b=c*0.5522847498307936
a6.a5(!0)
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
a6.X(s,d,s,a1,a,h,g,h,a5)
a6.p(a0,h)
a2=a0-b
a6.X(a0,h,a2,h,f,a1,f,d,a5)
a6.p(f,i)
a6.X(f,i,f,e,a2,j,a0,j,a5)
a6.p(g,j)
a6.X(g,j,a,j,s,e,s,i,a5)}else{a6.X(s,i,s,e,a,j,g,j,a5)
a6.p(a0,j)
a1=a0-b
a6.X(a0,j,a1,j,f,e,f,i,a5)
a6.p(f,d)
i=d+b
a6.X(f,d,f,i,a1,h,a0,h,a5)
a6.p(g,h)
a6.X(g,h,a,h,s,i,s,d,a5)}a6.a3()}},
of(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=a.a,b=c.length
if(a0>=b)return null
s=a.b.q(a1)
if(0>=s.length)return A.a(s,0)
r=B.c.D(s[0],0,100)/100
s=a.c.q(a1)
if(0>=s.length)return A.a(s,0)
q=B.c.D(s[0],0,100)/100
p=Math.abs(q-r)
if(p<0.000001)return null
if(!(a0<c.length))return A.a(c,a0)
o=c[a0]
n=a3.eX(a4)
s=a4+1
A.bo(o,a1,1,0,0,1,0,0,a2,n,a3,s,a5)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a.d.q(a1)
if(0>=l.length)return A.a(l,0)
k=B.c.N(m+l[0]/360,1)
j=k+p
if(!a.e){i=A.lA(o,a1,a2,a3,n,s,a5)
h=0}else{g=a3.fn(a4,a,a1,a2)
if(g==null){g=a3.eV(a4,b+1)
g.$flags&2&&A.c(g)
m=g.length
if(0>=m)return A.a(g,0)
g[0]=0
for(f=0,e=0;e<b;){if(!(e<c.length))return A.a(c,e)
l=c[e]
f+=A.lA(l,a1,a2,a3,e===a0?n:null,s,a5);++e
if(!(e<m))return A.a(g,e)
g[e]=f}a3.fN(a4,a,a1,a2)}c=g.length
if(!(b<c))return A.a(g,b)
i=g[b]
if(!(a0<c))return A.a(g,a0)
h=g[a0]}d=a3.eW(a4)
c=a3.RG
A.lp(n,k*i-h,Math.min(j,1)*i-h,d,c)
if(j>1)A.lp(n,-h,(j-1)*i-h,d,c)
return d},
lA(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga8()){s=d.fo(a)
if(s!=null)return s}r=A.er()
if(e!=null)r.sea(e)
else{r.sea(d.eR(f))
A.bo(a,b,1,0,0,1,0,0,c,r.aw(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.v(A.ar(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.v(A.ar(""))
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
if(o===r)A.v(A.ar(""))
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
q+=Math.sqrt(n*n+o*o)}}++p}if(a.ga8()){o=d.bG
o.u(0,a)
if(o.a>=256)o.u(0,new A.I(o,o.$ti.i("I<1>")).ga7(0))
n=d.ay
n.toString
o.n(0,a,new A.ad(n,q,t.b_))}return q},
lp(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
k=a7.aO(l+1)
k.$flags&2&&A.c(k)
q=k.length
if(0>=q)return A.a(k,0)
k[0]=0
for(j=0;j<l;j=h){i=p+j
h=j+1
g=p+B.b.N(h,n)
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
k.$flags&2&&A.c(k)
if(!(h<q))return A.a(k,h)
k[h]=f+c}if(!(l<q))return A.a(k,l)
a=k[l]
a0=Math.max(0,a4-s)
a1=Math.min(a,a5-s)
if(a1>a0+1e-7)if(m&&a0<=1e-7&&a1>=a-1e-7){a6.a5(!0)
for(a2=p;a2<o;++a2){q=a3.a
if(!(a2>=0&&a2<q.length))return A.a(q,a2)
q=q[a2]
f=a3.b
if(!(a2<f.length))return A.a(f,a2)
a6.p(q,f[a2])}a6.a3()}else A.lo(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
lo(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.b.I(r+a,1)
p=q+1
if(!(p<s))return A.a(a4,p)
if(a4[p]<=a6)r=p
else a=q}a8.a5(!1)
o=a1+r
p=r+1
n=a1+B.b.N(p,a2)
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
c=a1+B.b.N(f,a2)
if(a7<=e+1e-9){if(!(g<s))return A.a(a4,g)
p=a4[g]
b=e-p
s=b<=1e-12?0:B.c.D((a7-p)/b,0,1)
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
a8.p(p,m[c])}a8.a3()},
nX(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
for(s=0,r=0;r<a9;++r){q=(r&1)===0?0.01:0.1
if(!(r<a8.length))return A.a(a8,r)
p=a8[r].q(b3)
if(0>=p.length)return A.a(p,0)
o=Math.max(q,p[0])
b0.$flags&2&&A.c(b0)
if(!(r<b0.length))return A.a(b0,r)
b0[r]=o
s+=o}if(s<=0)return
a8=b2.b.q(b3)
if(0>=a8.length)return A.a(a8,0)
n=B.c.N(a8[0],s)
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
f=b5.aO(g+1)
f.$flags&2&&A.c(f)
q=f.length
if(0>=q)return A.a(f,0)
f[0]=0
for(e=0;e<g;e=c){d=j+e
c=e+1
b=j+B.b.N(c,i)
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
f.$flags&2&&A.c(f)
if(!(c<q))return A.a(f,c)
f[c]=p+a1}if(!(g<q))return A.a(f,g)
a3=f[g]
if(a3<=1e-7)continue
a4=b0[l]-m
for(q=a3-1e-7,a5=l,a6=0;a6<q;a6=a7){a7=Math.min(a3,a6+a4)
if((a5&1)===0&&a7>a6+1e-7)A.lo(b1,j,i,h,f,g,a6,a7,b4)
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
k5(a,b,c,d,e,f,g,h,i){A.b4(a,b,c,d,e,f,g,h,i,0)
a.p(d+b*h,e+b*i)},
iI(a,b,c,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a8?-1:1,d=b.length
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
return}if(k>=0)d=!(k<0.0001&&l<-0.999)
else d=!1
if(d){a.p(j,i)
a.p(a6,a7)
a.p(h,g)
return}if(a3===1){d=1+l
d=d>0.000001&&2<=a1*d}else d=!1
if(d){f=a0/(1+l)
a.p(a6+(n+m)*f,a7+(s+p)*f)}else if(a3===2){a.p(j,i)
if(l<-0.999){A.k5(a,a0,a2,a6,a7,n,s,s,q)
A.k5(a,a0,a2,a6,a7,s,q,m,p)}else A.k5(a,a0,a2,a6,a7,n,s,m,p)}else{a.p(j,i)
a.p(h,g)}},
ln(e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5
if(e7<=0)return
if(f3.a&&f3.hx(e6,e7,e8,e9,f0,f1,f2))return
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
c=m.aO(e)
b=l.aO(e)
for(h=e6.a,a=h.length,a0=e6.b,a1=a0.length,a2=c.length,a3=b.length,a4=c.$flags|0,a5=b.$flags|0,a6=g,a7=0;a6<f;++a6){if(!(a6>=0&&a6<a))return A.a(h,a6)
a8=h[a6]
if(!(a6<a1))return A.a(a0,a6)
a9=a0[a6]
if(a7!==0){b0=a7-1
if(!(b0>=0&&b0<a2))return A.a(c,b0)
b1=c[b0]
if(!(b0<a3))return A.a(b,b0)
b0=Math.abs(a8-b1)+Math.abs(a9-b[b0])>=0.000001}else b0=!0
if(b0){a4&2&&A.c(c)
if(!(a7<a2))return A.a(c,a7)
c[a7]=a8
b2=a7+1
a5&2&&A.c(b)
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
if(q){f2.a5(!0)
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
f2.a3()}else if(p){f2.a5(!0)
h=b3-e7
a=b4-e7
f2.p(h,a)
a0=b3+e7
f2.p(a0,a)
a=b4+e7
f2.p(a0,a)
f2.p(h,a)
f2.a3()}continue}b5=d?a7:a7-1
b6=o.aO(b5)
b7=n.aO(b5)
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
if(c3>1e-9){h&2&&A.c(b6)
if(!(b8<b6.length))return A.a(b6,b8)
b6[b8]=c1/c3
a&2&&A.c(b7)
if(!(b8<b7.length))return A.a(b7,b8)
b7[b8]=c2/c3}else{h&2&&A.c(b6)
if(!(b8<b6.length))return A.a(b6,b8)
b6[b8]=0
a&2&&A.c(b7)
if(!(b8<b7.length))return A.a(b7,b8)
b7[b8]=0}}if(d){f2.a5(!0)
for(c4=b5-1,c5=0;c5<a7;++c5){c6=c5===0?c4:c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.iI(f2,b6,b7,e7,s,r,e9,c6,c5,h,b[c5],!1)}f2.a3()
f2.a5(!0)
for(c5=a7-1;c5>=0;--c5){c7=c5===0?c4:c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.iI(f2,b6,b7,e7,s,r,e9,c5,c7,h,b[c5],!0)}f2.a3()}else{f2.a5(!0)
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
A.iI(f2,b6,b7,e7,s,r,e9,c5-1,c5,a0,b[c5],!1)}d0=b5-1
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
A.iI(f2,b6,b7,e7,s,r,e9,c5,d9,h,b[c5],!0)}e0=c[0]
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
f2.a3()}}},
p4(a,b,c,d,e){var s,r,q,p,o
d.j(0)
if(c===1){d.ae(a,1,0,0,1,0,0)
d.ae(b,1,0,0,1,0,0)
return!0}s=A.lC(a)
r=s==null
if(!r&&!isFinite(s.a[0]))return!1
q=A.lC(b)
p=q==null
if(!p&&!isFinite(q.a[0]))return!1
if(r){if(c===3||c===4||p)return!0
return A.k4(a,b,c,d,e)}if(p){if(c===4)return!0
return A.k4(a,b,c,d,e)}r=s.a
p=r[2]
o=q.a
if((p<o[0]-0.000006||o[2]<r[0]-0.000006||r[3]<o[1]-0.000006||o[3]<r[1]-0.000006)&&c===4)return!0
return A.k4(a,b,c,d,e)},
lC(a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0
for(s=a1.r,r=a1.a,q=r.length,p=a1.b,o=p.length,n=a1.c,m=n.length,l=a1.d,k=l.length,j=1/0,i=1/0,h=-1/0,g=-1/0,f=0,e=0;e<s;++e){if(!(e<m))return A.a(n,e)
d=n[e]
if(!(e<k))return A.a(l,e)
c=l[e]
if(c-d<3)continue;++f
for(b=d;b<c;++b){if(!(b>=0&&b<q))return A.a(r,b)
a=r[b]
if(!(b<o))return A.a(p,b)
a0=p[b]
if(!isFinite(a)||!isFinite(a0)||Math.abs(a)>1e7||Math.abs(a0)>1e7)return B.aM
if(a<j)j=a
if(a0<i)i=a0
if(a>h)h=a
if(a0>g)g=a0}}if(f===0||!isFinite(j))return null
return new A.aN([j,i,h,g])},
k4(p3,p4,p5,p6,p7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8,k9,l0,l1,l2,l3,l4,l5,l6,l7,l8,l9,m0,m1,m2,m3,m4,m5,m6,m7,m8,m9,n0,n1,n2,n3,n4,n5,n6,n7,n8,n9,o0,o1,o2,o3,o4,o5,o6,o7,o8,o9,p0,p1,p2={}
p2.a=p2.b=0
s=new A.iy(p2,p7)
if(!s.$2(p3,1)||!s.$2(p4,0))return!1
r=p2.b
if(r===0)return!0
q=p7.z
A.oS(q,p7.a,p7.b,r)
p=p7.Q
B.a.j(p)
for(r=p7.as,o=q.length,n=0,m=0;m<p2.b;++m){if(!(m<o))return A.a(q,m)
l=q[m]
k=p7.a
if(!(l>=0&&l<k.length))return A.a(k,l)
j=k[l]
k=p7.b
if(!(l<k.length))return A.a(k,l)
i=k[l]
k=p7.c
if(!(l<k.length))return A.a(k,l)
h=k[l]
k=p7.d
if(!(l<k.length))return A.a(k,l)
g=k[l]
k=p7.e
if(!(l<k.length))return A.a(k,l)
f=k[l]
k=p7.f
if(!(l<k.length))return A.a(k,l)
e=k[l]
d=h-j
c=g-i
b=d*d+c*c
a=1/Math.sqrt(b)
a0=B.c.D(0.0000025*a,1e-12,0.49)
for(a1=0.000006*a,k=f-0.000006,a2=j-0.000006,a3=1/b,a4=1-a0,a5=1+a1,a6=0,a7=0;a8=p.length,a7<a8;++a7){a9=p[a7]
b0=p7.c
if(a9>>>0!==a9||a9>=b0.length)return A.a(b0,a9)
b1=b0[a9]
if(b1<a2)continue
b2=a6+1
if(!(a6<a8))return A.a(p,a6)
p[a6]=a9
a8=p7.f
if(a9>>>0!==a9||a9>=a8.length)return A.a(a8,a9)
b3=a8[a9]
a8=p7.e
if(a9>>>0!==a9||a9>=a8.length)return A.a(a8,a9)
b4=a8[a9]
if(b3<k||e<b4-0.000006){a6=b2
continue}a8=p7.a
if(a9>>>0!==a9||a9>=a8.length)return A.a(a8,a9)
b5=a8[a9]
a8=p7.b
if(a9>>>0!==a9||a9>=a8.length)return A.a(a8,a9)
b6=a8[a9]
a8=p7.d
if(a9>>>0!==a9||a9>=a8.length)return A.a(a8,a9)
b7=a8[a9]
b8=b1-b5
b9=b7-b6
c0=b8*b8+b9*b9
c1=1/Math.sqrt(c0)
c2=B.c.D(0.0000025*c1,1e-12,0.49)
c3=d*b9-c*b8
a8=Math.abs(c3*a*c1)
if(a8<=0.000001){b0=b5-j
c4=b6-i
c5=b1-j
c6=b7-i
c7=Math.abs(c5*c-c6*d)*a
c8=j-b5
c9=i-b6
d0=Math.abs(c8*b9-c9*b8)*c1
d1=h-b5
d2=g-b6
d3=Math.abs(d1*b9-d2*b8)*c1
d4=Math.abs(b0*c-c4*d)*a<=0.000006
if(d4||c7<=0.000006||d0<=0.000006||d3<=0.000006){d5=1/c0
if(d4){d6=(b0*d+c4*c)*a3
if(d6>a0&&d6<a4){++n
if(n>32768)return!1
if(!(l<r.length))return A.a(r,l)
B.a.k(r[l],d6)}}if(c7<=0.000006){d6=(c5*d+c6*c)*a3
if(d6>a0&&d6<a4){++n
if(n>32768)return!1
if(!(l<r.length))return A.a(r,l)
B.a.k(r[l],d6)}}if(d0<=0.000006){d7=(c8*b8+c9*b9)*d5
if(d7>c2&&d7<1-c2){++n
if(n>32768)return!1
if(a9>>>0!==a9||a9>=r.length)return A.a(r,a9)
B.a.k(r[a9],d7)}}if(d3<=0.000006){d7=(d1*b8+d2*b9)*d5
if(d7>c2&&d7<1-c2){++n
if(n>32768)return!1
if(a9>>>0!==a9||a9>=r.length)return A.a(r,a9)
B.a.k(r[a9],d7)}}}if(!(d4&&c7<=0.000006))d8=d0<=0.000006&&d3<=0.000006
else d8=!0
if(d8||a8<=1e-13){a6=b2
continue}}d9=b5-j
e0=b6-i
e1=1/c3
d6=(d9*b9-e0*b8)*e1
d7=(d9*c-e0*d)*e1
e2=0.000006*c1
if(d6>=-a1&&d6<=a5&&d7>=-e2&&d7<=1+e2){e3=B.c.D(d6,0,1)
e4=B.c.D(d7,0,1)
a8=j+e3*d-(b5+e4*b8)
b0=i+e3*c-(b6+e4*b9)
if(a8*a8+b0*b0<=14400000000000002e-26){if(e3>a0&&e3<a4){++n
if(n>32768)return!1
if(!(l<r.length))return A.a(r,l)
B.a.k(r[l],e3)}if(e4>c2&&e4<1-c2){++n
if(n>32768)return!1
if(a9>>>0!==a9||a9>=r.length)return A.a(r,a9)
B.a.k(r[a9],e4)}}}a6=b2}B.a.sm(p,a6)
B.a.k(p,l)}e5=p7.at
B.a.j(e5)
e6=p7.ax
B.a.j(e6)
e7=p7.ay
B.a.j(e7)
e8=p7.ch
e8.j(0)
e9=new A.iE(e8,e5,e6,e7)
f0=p7.CW
B.a.j(f0)
f1=p7.cx
B.a.j(f1)
f2=p7.cy
B.a.j(f2)
f3=p7.db
B.a.j(f3)
f4=p7.id
f4.j(0)
for(l=0;l<p2.b;++l){o=p7.a
if(!(l<o.length))return A.a(o,l)
f5=o[l]
o=p7.b
if(!(l<o.length))return A.a(o,l)
f6=o[l]
o=p7.c
if(!(l<o.length))return A.a(o,l)
f7=o[l]
o=p7.d
if(!(l<o.length))return A.a(o,l)
f8=o[l]
o=p7.x
if(!(l<o.length))return A.a(o,l)
f9=o[l]
o=p7.r
if(!(l<o.length))return A.a(o,l)
g0=o[l]
o=p7.w
if(!(l<o.length))return A.a(o,l)
g1=o[l]
o=f9===1
g2=o?g0:g1
g3=o?g1:g0
k=p7.y
if(!(l<k.length))return A.a(k,l)
g4=k[l]!==0
if(!(l<r.length))return A.a(r,l)
g5=r[l]
g6=e9.$3(f5,f6,g2)
if(g5.length!==0){B.a.eE(g5)
for(k=f7-f5,a2=f8-f6,g7=0,g8=0;g8<g5.length;++g8){d6=g5[g8]
if(d6-g7<=1e-9||1-d6<=1e-9)continue
g9=o?d6:1-d6
h0=e9.$3(f5+k*d6,f6+a2*d6,g0+g9)
if(h0!==g6){a4=g4?f9:0
if(!A.eI(g6,h0,a4,g4?0:f9,e5,e6,f0,f1,f2,f3,f4))return!1
g7=d6
g6=h0}}}h1=e9.$3(f7,f8,g3)
if(h1!==g6){o=g4?f9:0
if(!A.eI(g6,h1,o,g4?0:f9,e5,e6,f0,f1,f2,f3,f4))return!1}}if(f0.length!==0&&!A.oU(e5,e6,f0,f1,f2,f3,f4,p7))return!1
h2=f0.length
if(h2===0)return!0
h3=p7.dx
B.a.j(h3)
h4=p7.dy
B.a.j(h4)
h5=p7.fr
B.a.j(h5)
h6=p7.fx
B.a.j(h6)
for(h7=0;h7<h2;++h7){if(!(h7<f2.length))return A.a(f2,h7)
if(f2[h7]===0){if(!(h7<f3.length))return A.a(f3,h7)
r=f3[h7]===0}else r=!1
if(r)continue
if(!(h7<f0.length))return A.a(f0,h7)
d7=f0[h7]
if(!(h7<f1.length))return A.a(f1,h7)
h8=f1[h7]
r=e5.length
if(!(h8>=0&&h8<r))return A.a(e5,h8)
o=e5[h8]
if(!(d7>=0&&d7<r))return A.a(e5,d7)
h9=o-e5[d7]
o=e6.length
if(!(h8<o))return A.a(e6,h8)
r=e6[h8]
if(!(d7<o))return A.a(e6,d7)
if(h9>=Math.abs(r-e6[d7]))B.a.k(h5,h7)
else B.a.k(h6,h7)
if(h9>0)B.a.k(h3,h7)
r=e6.length
if(!(d7<r))return A.a(e6,d7)
o=e6[d7]
if(!(h8<r))return A.a(e6,h8)
if(o!==e6[h8])B.a.k(h4,h7)}if(h5.length===0&&h6.length===0)return!0
B.a.au(h3,new A.iz(e5,f0))
B.a.au(h5,new A.iA(e5,f0,f1))
B.a.au(h4,new A.iB(e6,f0,f1))
B.a.au(h6,new A.iC(e6,f0,f1))
i0=p7.p4
B.a.j(i0)
i1=p7.R8
B.a.j(i1)
i2=p7.RG
B.a.j(i2)
i3=p7.rx
for(r=t.t;i3.length<e5.length;)B.a.k(i3,A.f([],r))
for(l=0;l<e5.length;++l){if(!(l<i3.length))return A.a(i3,l)
B.a.j(i3[l])}i4=new A.ix(i0,i1,i2,i3)
i5=p7.fy
B.a.j(i5)
i6=h3.length
for(i7=0,m=0;m<h5.length;++m){h7=h5[m]
if(!(h7<f0.length))return A.a(f0,h7)
d7=f0[h7]
if(!(h7<f1.length))return A.a(f1,h7)
h8=f1[h7]
r=e5.length
if(!(d7>=0&&d7<r))return A.a(e5,d7)
i8=e5[d7]
if(!(h8>=0&&h8<r))return A.a(e5,h8)
d9=e5[h8]
r=e6.length
if(!(d7<r))return A.a(e6,d7)
i9=e6[d7]
if(!(h8<r))return A.a(e6,h8)
j0=0.5*(i8+d9)
j1=0.5*(i9+e6[h8])
while(i7<i6){if(!(i7>=0&&i7<h3.length))return A.a(h3,i7)
j2=h3[i7]
if(!(j2<f0.length))return A.a(f0,j2)
r=f0[j2]
if(!(r>=0&&r<e5.length))return A.a(e5,r)
if(e5[r]>j0)break
B.a.k(i5,j2);++i7}for(j3=0,j4=0,a6=0,a7=0;a7<i5.length;++a7){j5=i5[a7]
r=B.a.h(f0,j5)
if(!(r>=0&&r<e5.length))return A.a(e5,r)
j6=e5[r]
r=B.a.h(f1,j5)
if(!(r>=0&&r<e5.length))return A.a(e5,r)
j7=e5[r]
if(j7<=j0)continue
b2=a6+1
if(!(a6<i5.length))return A.a(i5,a6)
i5[a6]=j5
if(j5===h7){a6=b2
continue}r=B.a.h(f0,j5)
if(!(r>=0&&r<e6.length))return A.a(e6,r)
j8=e6[r]
r=B.a.h(f1,j5)
if(!(r>=0&&r<e6.length))return A.a(e6,r)
if((j0-j6)*(e6[r]-j8)<(j1-j8)*(j7-j6)){j3+=B.a.h(f2,j5)
j4+=B.a.h(f3,j5)}a6=b2}B.a.sm(i5,a6)
if(!(h7<f2.length))return A.a(f2,h7)
r=f2[h7]
if(!(h7<f3.length))return A.a(f3,h7)
o=f3[h7]
j9=A.ip(j3!==0,j4!==0,p5)
k0=A.ip(j3+r!==0,j4+o!==0,p5)
if(j9===k0)continue
if(k0)i4.$2(d7,h8)
else i4.$2(h8,d7)}k1=p7.go
B.a.j(k1)
k2=h4.length
for(k3=0,m=0;m<h6.length;++m){h7=h6[m]
if(!(h7<f0.length))return A.a(f0,h7)
d7=f0[h7]
if(!(h7<f1.length))return A.a(f1,h7)
h8=f1[h7]
r=e5.length
if(!(d7>=0&&d7<r))return A.a(e5,d7)
i8=e5[d7]
if(!(h8>=0&&h8<r))return A.a(e5,h8)
d9=e5[h8]
r=e6.length
if(!(d7<r))return A.a(e6,d7)
i9=e6[d7]
if(!(h8<r))return A.a(e6,h8)
e0=e6[h8]
j0=0.5*(i8+d9)
j1=0.5*(i9+e0)
while(k3<k2){if(!(k3>=0&&k3<h4.length))return A.a(h4,k3)
j2=h4[k3]
if(!(j2<f0.length))return A.a(f0,j2)
k4=f0[j2]
if(!(j2<f1.length))return A.a(f1,j2)
k5=f1[j2]
r=e6.length
if(!(k4>=0&&k4<r))return A.a(e6,k4)
o=e6[k4]
if(!(k5>=0&&k5<r))return A.a(e6,k5)
if(Math.min(o,e6[k5])>j1)break
B.a.k(k1,j2);++k3}for(k6=0,k7=0,a6=0,a7=0;a7<k1.length;++a7){j5=k1[a7]
k8=B.a.h(f0,j5)
k9=B.a.h(f1,j5)
r=e6.length
if(!(k8>=0&&k8<r))return A.a(e6,k8)
j8=e6[k8]
if(!(k9>=0&&k9<r))return A.a(e6,k9)
l0=e6[k9]
if((j8>l0?j8:l0)<=j1)continue
b2=a6+1
if(!(a6<k1.length))return A.a(k1,a6)
k1[a6]=j5
if(j5===h7){a6=b2
continue}r=e5.length
if(!(k8<r))return A.a(e5,k8)
j6=e5[k8]
if(!(k9<r))return A.a(e5,k9)
j7=e5[k9]
l1=j8<l0?1:-1
l2=(j1-j8)*(j7-j6)
l3=(j0-j6)*(l0-j8)
if(l1===1?l2<l3:l2>l3){k6-=B.a.h(f2,j5)*l1
k7-=B.a.h(f3,j5)*l1}a6=b2}B.a.sm(k1,a6)
l4=i9<e0?1:-1
if(!(h7<f2.length))return A.a(f2,h7)
r=f2[h7]
if(!(h7<f3.length))return A.a(f3,h7)
o=f3[h7]
l5=A.ip(k6!==0,k7!==0,p5)
if(l5===A.ip(k6-r*l4!==0,k7-o*l4!==0,p5))continue
if(l5===(l4===1))i4.$2(d7,h8)
else i4.$2(h8,d7)}l6=i0.length
l7=p7.ry
l8=p7.to
B.a.j(l8)
l9=p7.x1
B.a.j(l9)
m0=p7.x2
B.a.j(m0)
m1=p7.xr
B.a.j(m1)
m2=p7.y1
B.a.j(m2)
m3=p7.y2
B.a.j(m3)
m4=p7.aG
B.a.j(m4)
m5=p7.aP
B.a.j(m5)
for(m6=l6+1,m7=0;m7<l6;++m7){if(!(m7<i2.length))return A.a(i2,m7)
if(i2[m7])continue
B.a.j(l7)
if(!(m7<i0.length))return A.a(i0,m7)
m8=i0[m7]
for(m9=m6,n0=m7;n1=m9-1,n2=!1,m9>0;m9=n1,n0=n4){B.a.n(i2,n0,!0)
if(!(n0>=0&&n0<i0.length))return A.a(i0,n0)
d7=i0[n0]
if(!(n0<i1.length))return A.a(i1,n0)
h8=i1[n0]
B.a.k(l7,d7)
if(h8===m8){n2=!0
break}if(!(h8>=0&&h8<i3.length))return A.a(i3,h8)
n3=i3[h8]
for(r=n3.length,o=i2.length,n4=-1,n5=0,n6=0;n6<r;++n6){j2=n3[n6]
if(!(j2>=0&&j2<o))return A.a(i2,j2)
if(!i2[j2]){++n5
n4=j2}}if(n5===0)break
if(n5>1){r=e6.length
if(!(d7>=0&&d7<r))return A.a(e6,d7)
o=e6[d7]
if(!(h8<r))return A.a(e6,h8)
r=e6[h8]
k=e5.length
if(!(d7<k))return A.a(e5,d7)
a2=e5[d7]
if(!(h8<k))return A.a(e5,h8)
n7=Math.atan2(o-r,a2-e5[h8])
for(n8=1/0,n6=0;n6<n3.length;++n6){j2=n3[n6]
if(!(j2>=0&&j2<i2.length))return A.a(i2,j2)
if(i2[j2])continue
if(!(j2<i1.length))return A.a(i1,j2)
n9=i1[j2]
r=e6.length
if(!(n9>=0&&n9<r))return A.a(e6,n9)
o=e6[n9]
if(!(h8<r))return A.a(e6,h8)
r=e6[h8]
k=e5.length
if(!(n9<k))return A.a(e5,n9)
a2=e5[n9]
if(!(h8<k))return A.a(e5,h8)
o0=n7-Math.atan2(o-r,a2-e5[h8])
while(o0<=0)o0+=6.283185307179586
if(o0<n8){n8=o0
n4=j2}}}}if(!n2||l7.length<3){p6.w=p6.r=p6.f=0
return p6.x=!1}o1=l7.length
if(0>=o1)return A.a(l7,0)
r=l7[0]
o=e7.length
if(!(r>=0&&r<o))return A.a(e7,r)
o2=e7[r]
k=e5.length
if(!(r<k))return A.a(e5,r)
o3=e5[r]
a2=e6.length
if(!(r<a2))return A.a(e6,r)
o4=e6[r]
for(o5=0,l=1;l<o1;++l){o6=l7[l]
if(!(o6>=0&&o6<o))return A.a(e7,o6)
o7=e7[o6]
if(!(o6<k))return A.a(e5,o6)
o8=e5[o6]
if(!(o6<a2))return A.a(e6,o6)
o9=e6[o6]
r=!0
if(!(o7<o2))if(o7===o2){if(!(o9<o4))r=o9===o4&&o8<o3}else r=!1
if(r){o4=o9
o3=o8
o2=o7
o5=l}}B.a.k(m5,m5.length)
B.a.k(l9,l8.length)
B.a.a4(l8,l7)
B.a.k(m0,l8.length)
B.a.k(m1,o5)
B.a.k(m2,o2)
B.a.k(m3,o3)
B.a.k(m4,o4)}B.a.au(m5,new A.iD(m2,m4,m3))
for(p0=0;p0<m5.length;++p0){p1=m5[p0]
if(!(p1<l9.length))return A.a(l9,p1)
r=l9[p1]
if(!(p1<m0.length))return A.a(m0,p1)
o=m0[p1]
if(!(p1<m1.length))return A.a(m1,p1)
A.od(l8,r,o,m1[p1],e5,e6,p6)}return!0},
ip(a,b,c){var s
switch(c){case 2:s=a||b
break
case 3:s=a&&!b
break
case 4:s=a&&b
break
case 5:s=a!==b
break
default:s=a||b
break}return s},
lB(a,b){return(a&65535)*b+(((a>>>16)*b&65535)<<16>>>0)>>>0},
jW(a,b){var s=4294967296,r=B.b.J(a,s),q=B.b.J(b,s)
return(A.lB((a>>>0^r>>>0)>>>0,73856093)^A.lB((b>>>0^q>>>0)>>>0,19349663))&2147483647},
oU(c5,c6,c7,c8,c9,d0,d1,d2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3=c7.length,c4=d2.k2
B.a.j(c4)
for(s=0;s<c3;++s){if(!(s<c9.length))return A.a(c9,s)
if(c9[s]===0){if(!(s<d0.length))return A.a(d0,s)
r=d0[s]!==0}else r=!0
if(r)B.a.k(c4,s)}if(c4.length===0)return!0
B.a.au(c4,new A.iF(c5,c7))
q=c5.length
p=d2.k1
B.a.j(p)
for(o=0;o<q;++o)B.a.k(p,o)
B.a.au(p,new A.iG(c5))
n=d2.k3
B.a.j(n)
m=d2.k4
m.j(0)
l=c4.length
for(r=t.t,k=0,j=0;j<q;++j){if(!(j<p.length))return A.a(p,j)
i=p[j]
if(!(i<c5.length))return A.a(c5,i)
h=c5[i]
if(!(i<c6.length))return A.a(c6,i)
g=c6[i]
for(f=h+0.0000025;k<l;){if(!(k>=0&&k<c4.length))return A.a(c4,k)
e=c4[k]
if(!(e<c7.length))return A.a(c7,e)
d=c7[e]
if(!(d>=0&&d<c5.length))return A.a(c5,d)
if(c5[d]>f)break
B.a.k(n,e);++k}for(f=h-0.0000025,c=0,b=0;b<n.length;++b){s=n[b]
a=B.a.h(c7,s)
o=B.a.h(c8,s)
d=c5.length
if(!(o>=0&&o<d))return A.a(c5,o)
a0=c5[o]
if(a0<f)continue
a1=c+1
if(!(c<n.length))return A.a(n,c)
n[c]=s
if(i===a||i===o){c=a1
continue}a2=c6.length
if(!(a>=0&&a<a2))return A.a(c6,a)
a3=c6[a]
if(!(o<a2))return A.a(c6,o)
a4=c6[o]
a5=a3<a4?a3:a4
a6=a3>a4?a3:a4
if(g<a5-0.0000025||g>a6+0.0000025){c=a1
continue}if(!(a<d))return A.a(c5,a)
a7=c5[a]
a8=a0-a7
a9=a4-a3
b0=a8*a8+a9*a9
if(b0<=1e-24){c=a1
continue}d=h-a7
a2=g-a3
b1=d*a8+a2*a9
if(b1<=0||b1>=b0){c=a1
continue}b2=d*a9-a2*a8
if(b2*b2<=6250000000000001e-27*b0){d=m.h(0,s)
if(d==null){d=A.f([],r)
m.n(0,s,d)}B.a.k(d,i)}c=a1}B.a.sm(n,c)}if(m.a===0)return!0
b3=d2.ok
B.a.j(b3)
B.a.a4(b3,c7)
b4=d2.p1
B.a.j(b4)
B.a.a4(b4,c8)
b5=d2.p2
B.a.j(b5)
B.a.a4(b5,c9)
b6=d2.p3
B.a.j(b6)
B.a.a4(b6,d0)
B.a.j(c7)
B.a.j(c8)
B.a.j(c9)
B.a.j(d0)
d1.j(0)
for(s=0;s<c3;++s){if(!(s<b5.length))return A.a(b5,s)
b7=b5[s]
if(!(s<b6.length))return A.a(b6,s)
b8=b6[s]
if(b7===0&&b8===0)continue
if(!(s<b3.length))return A.a(b3,s)
a=b3[s]
if(!(s<b4.length))return A.a(b4,s)
o=b4[s]
b9=m.h(0,s)
if(b9==null){if(!A.eI(a,o,b7,b8,c5,c6,c7,c8,c9,d0,d1))return!1
continue}r=c5.length
if(!(a>=0&&a<r))return A.a(c5,a)
a7=c5[a]
f=c6.length
if(!(a<f))return A.a(c6,a)
a3=c6[a]
if(!(o>=0&&o<r))return A.a(c5,o)
r=c5[o]
if(!(o<f))return A.a(c6,o)
f=c6[o]
if(b9.length>1)B.a.au(b9,new A.iH(c5,a7,r-a7,c6,a3,f-a3))
for(c0=a,c1=0;c1<b9.length;++c1){c2=b9[c1]
if(c2===c0||c2===o)continue
if(!A.eI(c0,c2,b7,b8,c5,c6,c7,c8,c9,d0,d1))return!1
c0=c2}if(c0!==o)if(!A.eI(c0,o,b7,b8,c5,c6,c7,c8,c9,d0,d1))return!1}return!0},
eI(a,b,c,a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=a1.length
if(!(a>=0&&a<d))return A.a(a1,a)
s=a1[a]
r=a2.length
if(!(a<r))return A.a(a2,a)
q=a2[a]
if(!(b>=0&&b<d))return A.a(a1,b)
p=a1[b]
if(!(b<r))return A.a(a2,b)
o=a2[b]
if(!(s<p))d=s===p&&q<o
else d=!0
if(d){n=a0
m=c
l=b
k=a}else{m=-c
n=-a0
l=a
k=b}j=A.jW(k,l)
i=a7.h(0,j)
if(i!=null)for(d=i.length,r=a3.length,h=a4.length,g=0;g<d;++g){f=i[g]
if(!(f>=0&&f<r))return A.a(a3,f)
if(a3[f]===k){if(!(f<h))return A.a(a4,f)
e=a4[f]===l}else e=!1
if(e){if(!(f<a5.length))return A.a(a5,f)
B.a.n(a5,f,a5[f]+m)
if(!(f<a6.length))return A.a(a6,f)
B.a.n(a6,f,a6[f]+n)
return!0}}d=a3.length
if(d>=32768)return!1
B.a.k(a3,k)
B.a.k(a4,l)
B.a.k(a5,m)
B.a.k(a6,n)
r=a7.h(0,j)
if(r==null){r=A.f([],t.t)
a7.n(0,j,r)}B.a.k(r,d)
return!0},
od(a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=a4-a3
a8.a5(!0)
for(s=0,r=0,q=0,p=0;p<a1;++p){o=a5+p
n=a3+B.b.N(o,a1)
m=a2.length
if(!(n<m))return A.a(a2,n)
l=a2[n]
n=a6.length
if(!(l>=0&&l<n))return A.a(a6,l)
k=a6[l]
j=a7.length
if(!(l<j))return A.a(a7,l)
i=a7[l]
o=a3+B.b.N(o+1,a1)
if(!(o<m))return A.a(a2,o)
h=a2[o]
if(!(h>=0&&h<n))return A.a(a6,h)
g=a6[h]
if(!(h<j))return A.a(a7,h)
f=a7[h]
if(q>0){e=k-s
d=i-r
c=g-k
b=f-i
a=Math.sqrt(e*e+d*d)
a0=Math.sqrt(c*c+b*b)
if(a>0&&a0>0){o=a*a0
if((e*c+d*b)/o>0.999999&&Math.abs(e*b-d*c)/o<=0.000001)continue}}a8.p(k,i);++q
r=i
s=k}a8.a3()},
oS(a,b,c,d){var s,r
if(d<=1)return
for(s=d,r=0;s>1;s=s>>>1)r+=2
A.jY(a,b,c,0,d-1,r)},
c6(a,b,c,d){var s,r,q,p,o=c.length
if(!(a>=0&&a<o))return A.a(c,a)
s=c[a]
if(!(b>=0&&b<o))return A.a(c,b)
r=c[b]
if(s!==r)return s<r
o=d.length
if(!(a<o))return A.a(d,a)
q=d[a]
if(!(b<o))return A.a(d,b)
p=d[b]
if(q!==p)return q<p
return a<b},
on(a,b,c,d,e){var s,r,q,p,o,n,m
for(s=d+1,r=a.$flags|0,q=a.length;s<=e;++s){if(!(s>=0&&s<q))return A.a(a,s)
p=a[s]
o=s-1
for(;;){if(o>=d){if(!(o>=0&&o<q))return A.a(a,o)
n=A.c6(p,a[o],b,c)}else n=!1
if(!n)break
n=o+1
if(!(o>=0&&o<q))return A.a(a,o)
m=a[o]
r&2&&A.c(a)
if(!(n>=0&&n<q))return A.a(a,n)
a[n]=m;--o}n=o+1
r&2&&A.c(a)
if(!(n>=0&&n<q))return A.a(a,n)
a[n]=p}},
om(a,b,c,d,e){var s,r,q,p,o,n,m,l=e-d+1,k=new A.is(a,d,b,c)
for(s=B.b.I(l-2,1),r=l-1;s>=0;--s)k.$2(s,r)
for(q=a.length,p=a.$flags|0;r>0;){o=d+r
if(!(o>=0&&o<q))return A.a(a,o)
n=a[o]
if(!(d>=0&&d<q))return A.a(a,d)
m=a[d]
p&2&&A.c(a)
a[o]=m
a[d]=n;--r
k.$2(0,r)}},
jY(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k
for(s=a.length,r=a.$flags|0;q=e-d,q>16;){if(f===0){A.om(a,b,c,d,e)
return}--f
p=d+B.b.I(q,1)
if(!(p>=0&&p<s))return A.a(a,p)
q=a[p]
if(!(d>=0&&d<s))return A.a(a,d)
if(A.c6(q,a[d],b,c)){o=a[d]
q=a[p]
r&2&&A.c(a)
a[d]=q
a[p]=o}if(!(e>=0&&e<s))return A.a(a,e)
if(A.c6(a[e],a[d],b,c)){o=a[d]
q=a[e]
r&2&&A.c(a)
a[d]=q
a[e]=o}if(A.c6(a[e],a[p],b,c)){o=a[p]
q=a[e]
r&2&&A.c(a)
a[p]=q
a[e]=o}n=a[p]
m=d-1
l=e+1
for(;;){do{++m
if(!(m>=0&&m<s))return A.a(a,m)}while(A.c6(a[m],n,b,c))
do{--l
if(!(l>=0&&l<s))return A.a(a,l)}while(A.c6(n,a[l],b,c))
if(m>=l)break
o=a[m]
q=a[l]
r&2&&A.c(a)
a[m]=q
a[l]=o}k=l+1
if(l-d<e-l){A.jY(a,b,c,d,l,f)
d=k}else{A.jY(a,b,c,k,e,f)
e=l}}A.on(a,b,c,d,e)},
lE(a,b,c,d,e,f,a0){var s,r,q,p,o,n,m,l,k,j,i,h=null,g="Raster output is too small"
if(d<0||e<0||d>65535||e>65535)throw A.h(A.ay("Raster dimensions "+d+"x"+e+" must be in 0..65535",h))
s=d
r=d*e
n=s
if(typeof n!=="number")return n.cH()
if(!(n<d))if(e>0){n=s
m=B.b.a0(c.gA().length,e)
if(typeof n!=="number")return n.cG()
m=n>m
n=m}else n=!1
else n=!0
if(n)throw A.h(A.ay(g,h))
n=s
if(typeof n!=="number")return n.ac()
l=n*e
if(l>c.gA().length)throw A.h(A.ay(g,h))
n=f.b
if(n)A.cc(c,l)
else A.bW(c.gA(),l)
m=!0
if(d>0)if(e>0){k=a.b
k===$&&A.H()
if(!(k<=0)){m=a.c
m===$&&A.H()
m=m<=0}}if(m)return
m=a.b
m===$&&A.H()
q=d/m
m=a.c
m===$&&A.H()
p=e/m
o=f.ay
f.ay=a
try{A.k1(a,b,255,c,0,0,s,0,0,d,e,q,0,0,p,0,0,h,f,0,!0,n)
j=Math.max(A.j(r),f.aG)
f.aG=0
i=j<=65536&&!f.as
f.as=!1
if(i){if(++f.aP>=16){f.aP=0
f.i4()}}else f.aP=0}finally{f.sfW(o)}},
k1(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9=null
if(d7>=d9||d8>=e0||d2<=0)return
s=f1?d3:c9
r=d0.w
for(q=r.length-1,p=e9+1,o=e9*3,n=o+1,m=e4>=0,l=e2>=0,k=e3>=0,j=e1>=0,i=t.a,h=s!=null,g=o+2;q>=0;--q){if(!(q<r.length))return A.a(r,q)
f=r[q]
if(!f.ch){if(!f.e)e=(f.b!=null||f.f!=null)&&d1>=f.c&&d1<f.d
else e=!1
e=!e}else e=!0
if(e)continue
e=f.a.e.q(d1)
if(0>=e.length)return A.a(e,0)
if(B.c.F(B.b.D(B.c.L(d2*B.c.F(e[0])/100),0,255)*f.b1(d1)/255)===0)continue
d=f.ay
c=f.Q
e=f.y
b=e===2||e===4
a=f.ax?255:d2
a0=d!=null
a1=!1
if(a0){if(!d.e)a2=(d.b!=null||d.f!=null)&&d1>=d.c&&d1<d.d
else a2=!1
if(a2){a2=d.a.e.q(d1)
if(0>=a2.length)return A.a(a2,0)
a2=B.c.F(B.b.D(B.c.L(a*B.c.F(a2[0])/100),0,255)*d.b1(d1)/255)>0
a1=a2}}if(a0&&!a1&&!b)continue
if(!a1){if(c===0)A.c7(f,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,0,!0,!1,!1,!1,!0)
else{a3=f.aC(d1)
if(a3!=null){e=j?a3.a:a3.c
a0=k?a3.b:a3.d
a4=B.c.U(e1*e+e3*a0+e5)-1
e=l?a3.a:a3.c
a0=m?a3.b:a3.d
a5=B.c.U(e2*e+e4*a0+e6)-1
e=j?a3.c:a3.a
a0=k?a3.d:a3.b
a6=B.c.Y(e1*e+e3*a0+e5)+1
e=l?a3.c:a3.a
a0=m?a3.d:a3.b
a7=B.c.Y(e2*e+e4*a0+e6)+1
if(a4<d7)a4=d7
if(a5<d8)a5=d8
if(a6>d9)a6=d9
if(a7>e0)a7=e0
a8=a6-a4
a9=a7-a5
if(a8>0&&a9>0){if(f.f==null){e=f.b
b0=e==null?c9:e.gcK()}else b0=c9
e=!1
if(b0!=null){a0=b0.y
if(a0!=null){if(h){a2=$.k
if(a2!=null){a2=!0
if(c!==6)if(c!==7)if(c!==9)a2=c>=12&&c<=15
a2
e=!1
if(a0.w){a0=a0.f
if(a0!=null)if(a0.a!=null){e=a0.q(0)
if(0>=e.length)return A.a(e,0)
e=e[0]!==0}else e=!0}e=!e}}}else e=!0}if(e){A.c7(f,d1,d2,d3,d4,d5,d6,a4,a5,a6,a7,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,c,!0,!1,!1,!1,!0)
continue}e=a8*a9
b1=e8.aJ(g,e)
if(f1)A.cc(b1,e)
else{a0=b1.c
if(a0!=null){a2=i.a(A.u($.k.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.bW(a0,e)}A.c7(f,d1,d2,b1,a4,a5,a8,a4,a5,a6,a7,e1,e2,e3,e4,e5,e6,e7,e8,p,f0,f1,0,!0,!0,!1,!1,!0)
if(h){e=!0
if(c!==6)if(c!==7)if(c!==9)e=c>=12&&c<=15
if(e)e=$.k!=null
else e=!0
b3=e&&A.pq(s,(a5-d5)*d6+a4-d4,d6,b1,a8,a9,c)}else b3=!1
if(!b3){e=d3.c
if(e!=null){a0=i.a(A.u($.k.memory).buffer)
b2=d3.b
e=new Uint32Array(a0,e,b2)}else{e=d3.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.u($.k.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.ni(e,a4-d4,a5-d5,d6,a0,0,0,a8,a8,a9,c)}}}}continue}b4=e===3||e===4
b5=f.aC(d1)
if(b5==null)continue
e=j?b5.a:b5.c
a0=k?b5.b:b5.d
b6=B.c.U(e1*e+e3*a0+e5)-1
e=l?b5.a:b5.c
a0=m?b5.b:b5.d
b7=B.c.U(e2*e+e4*a0+e6)-1
e=j?b5.c:b5.a
a0=k?b5.d:b5.b
b8=B.c.Y(e1*e+e3*a0+e5)+1
e=l?b5.c:b5.a
a0=m?b5.d:b5.b
b9=B.c.Y(e2*e+e4*a0+e6)+1
if(b6<d7)b6=d7
if(b7<d8)b7=d8
if(b8>d9)b8=d9
if(b9>e0)b9=e0
if(b6>=b8||b7>=b9)continue
c0=d.aC(d1)
if(c0!=null){e=j?c0.a:c0.c
a0=k?c0.b:c0.d
c1=Math.max(b6,B.c.U(e1*e+e3*a0+e5)-1)
e=l?c0.a:c0.c
a0=m?c0.b:c0.d
c2=Math.max(b7,B.c.U(e2*e+e4*a0+e6)-1)
e=j?c0.c:c0.a
a0=k?c0.d:c0.b
c3=Math.min(b8,B.c.Y(e1*e+e3*a0+e5)+1)
e=l?c0.c:c0.a
a0=m?c0.d:c0.b
c4=Math.min(b9,B.c.Y(e2*e+e4*a0+e6)+1)}else{c4=d8
c3=d7
c2=c4
c1=c3}c5=c1<c3&&c2<c4
if(!b&&!c5)continue
if(b&&!c5&&c===0&&e7==null){A.c7(f,d1,d2,d3,d4,d5,d6,b6,b7,b8,b9,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,0,!0,!1,!1,!1,!0)
continue}a4=b?b6:c1
a5=b?b7:c2
a6=b?b8:c3
a7=b?b9:c4
a8=a6-a4
a9=a7-a5
c6=a8*a9
b1=e8.aJ(o,c6)
if(f1)A.cc(b1,c6)
else{e=b1.c
if(e!=null){a0=i.a(A.u($.k.memory).buffer)
b2=b1.b
e=new Uint32Array(a0,e,b2)}else{e=b1.d
e.toString}A.bW(e,c6)}A.c7(f,d1,d2,b1,a4,a5,a8,a4,a5,a6,a7,e1,e2,e3,e4,e5,e6,c9,e8,p,f0,f1,0,!0,!0,!1,!1,!0)
c7=e8.aJ(n,c6)
if(f1)A.cc(c7,c6)
else{e=c7.c
if(e!=null){a0=i.a(A.u($.k.memory).buffer)
b2=c7.b
e=new Uint32Array(a0,e,b2)}else{e=c7.d
e.toString}A.bW(e,c6)}if(c5)A.c7(d,d1,a,c7,a4,a5,a8,c1,c2,c3,c4,e1,e2,e3,e4,e5,e6,c9,e8,p,f0,f1,0,!0,!0,!b4,!1,!0)
if(e7!=null){e=d3.c
if(e!=null){a0=i.a(A.u($.k.memory).buffer)
b2=d3.b
e=new Uint32Array(a0,e,b2)}else{e=d3.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.u($.k.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}a2=c7.c
if(a2!=null){c8=i.a(A.u($.k.memory).buffer)
b2=c7.b
a2=new Uint32Array(c8,a2,b2)}else{a2=c7.d
a2.toString}A.o9(e,d4,d5,d6,a0,a2,a8,a9,a4,a5,b,b4,c,e7)
continue}if(c===0&&f1&&A.ps(d3,d4,d5,d6,b1,c7,a8,a9,a4,a5,b,b4)){++e8.y
continue}e=d3.c
if(e!=null){a0=i.a(A.u($.k.memory).buffer)
b2=d3.b
e=new Uint32Array(a0,e,b2)}else{e=d3.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.u($.k.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}a2=c7.c
if(a2!=null){c8=i.a(A.u($.k.memory).buffer)
b2=c7.b
a2=new Uint32Array(c8,a2,b2)}else{a2=c7.d
a2.toString}A.o8(e,d4,d5,d6,a0,a2,a8,a9,a4,a5,b,b4,c)}},
o9(b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=c0+b8,a9=c1+b9,b0=c5.a.gA(),b1=c5.b*2
for(s=b2.length,r=c4===0,q=!c3,p=b7.length,o=b6.length,n=b0.length,m=0;m<b1;m+=2){if(!(m<n))return A.a(b0,m)
l=b0[m]
k=l>>>16
if(k<c1)continue
if(k>=a9)break
j=m+1
if(!(j<n))return A.a(b0,j)
i=b0[j]
h=l&65535
g=h<c0?c0:h
f=h+(i>>>8)
if(f>a8)f=a8
if(g>=f)continue
e=(i&255)+1
d=(k-c1)*b8-c0
c=(k-b4)*b5-b3
for(j=e!==256,b=g;b<f;++b){a=d+b
if(!(a>=0&&a<o))return A.a(b6,a)
a0=b6[a]
if(a0===0)continue
if(!(a<p))return A.a(b7,a)
a1=b7[a]
if(q){a2=a1>>>24
a3=c2?255-a2:a2}else{a4=19595*(a1>>>16&255)+38470*(a1>>>8&255)+7471*(a1&255)+32768>>>16
a5=a4>255?255:a4
a3=c2?255-a5:a5}if(a3===0)continue
a6=a3===255?a0:A.Q(a0,a3)
if(j)a6=A.ah(a6,e)
if(a6===0)continue
a7=c+b
if(r){if(!(a7>=0&&a7<s))return A.a(b2,a7)
a=A.t(a6,b2[a7])}else{if(!(a7>=0&&a7<s))return A.a(b2,a7)
a=A.be(a6,b2[a7],c4)}b2.$flags&2&&A.c(b2)
if(!(a7>=0&&a7<s))return A.a(b2,a7)
b2[a7]=a}}},
o8(b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7=c7-c0,b8=!d0
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
if((d&c&b&a)>>>0>=4278190080){if((k&i&g&e)>>>0>=4278190080){b9.$flags&2&&A.c(b9)
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
j=A.t(k,b9[a0])
b9.$flags&2&&A.c(b9)
b9[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
i=A.t(i,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
g=A.t(g,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
e=A.t(e,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=e}}m+=4
continue}a1=d>>>24
if(k!==0&&a1!==0){a2=a1===255?k:A.Q(k,a1)
if(!(a0>=0&&a0<r))return A.a(b9,a0)
j=A.t(a2,b9[a0])
b9.$flags&2&&A.c(b9)
b9[a0]=j}a3=c>>>24
if(i!==0&&a3!==0){a2=a3===255?i:A.Q(i,a3)
j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.t(a2,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=h}a4=b>>>24
if(g!==0&&a4!==0){a2=a4===255?g:A.Q(g,a4)
j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.t(a2,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=h}a5=a>>>24
if(e!==0&&a5!==0){a2=a5===255?e:A.Q(e,a5)
j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.t(a2,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=h}m+=4}while(m<c5){j=o+m
if(!(j>=0&&j<b8))return A.a(c3,j)
a6=c3[j]
if(a6!==0){if(!(j<s))return A.a(c4,j)
a7=c4[j]>>>24
if(a7!==0){a2=a7===255?a6:A.Q(a6,a7)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(b9,a8)
j=A.t(a2,b9[a8])
b9.$flags&2&&A.c(b9)
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
if(((d|c|b|a)&4278190080)>>>0===0){if((k&i&g&e)>>>0>=4278190080){b9.$flags&2&&A.c(b9)
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
j=A.t(k,b9[a0])
b9.$flags&2&&A.c(b9)
b9[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
i=A.t(i,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
g=A.t(g,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
e=A.t(e,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=e}}m+=4
continue}a9=255-(d>>>24)
if(k!==0&&a9!==0){a2=a9===255?k:A.Q(k,a9)
if(!(a0>=0&&a0<r))return A.a(b9,a0)
j=A.t(a2,b9[a0])
b9.$flags&2&&A.c(b9)
b9[a0]=j}b0=255-(c>>>24)
if(i!==0&&b0!==0){a2=b0===255?i:A.Q(i,b0)
j=a0+1
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.t(a2,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=h}b1=255-(b>>>24)
if(g!==0&&b1!==0){a2=b1===255?g:A.Q(g,b1)
j=a0+2
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.t(a2,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=h}b2=255-(a>>>24)
if(e!==0&&b2!==0){a2=b2===255?e:A.Q(e,b2)
j=a0+3
if(!(j>=0&&j<r))return A.a(b9,j)
h=A.t(a2,b9[j])
b9.$flags&2&&A.c(b9)
b9[j]=h}m+=4}while(m<c5){j=o+m
if(!(j>=0&&j<b8))return A.a(c3,j)
a6=c3[j]
if(a6!==0){if(!(j<s))return A.a(c4,j)
b3=255-(c4[j]>>>24)
if(b3!==0){a2=b3===255?a6:A.Q(a6,b3)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(b9,a8)
j=A.t(a2,b9[a8])
b9.$flags&2&&A.c(b9)
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
a2=b3===255?a6:A.Q(a6,b3)
a8=n+m
if(r){if(!(a8>=0&&a8<s))return A.a(b9,a8)
f=A.t(a2,b9[a8])}else{if(!(a8>=0&&a8<s))return A.a(b9,a8)
f=A.be(a2,b9[a8],d1)}b9.$flags&2&&A.c(b9)
if(!(a8>=0&&a8<s))return A.a(b9,a8)
b9[a8]=f}}},
eN(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eL(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eO(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eM(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eJ(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaH()){i.$flags&2&&A.c(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gcw()){a.d4(b)
s=a.z
r=a.Q
i.$flags&2&&A.c(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.ek(b)
p=q[0]
o=q[1]
n=q[4]
m=q[5]
l=q[12]
k=q[13]
i.$flags&2&&A.c(i)
i[0]=c*p+e*o
i[1]=d*p+f*o
i[2]=c*n+e*m
i[3]=d*n+f*m
i[4]=c*l+e*k+g
i[5]=d*l+f*k+h},
c7(k5,k6,k7,k8,k9,l0,l1,l2,l3,l4,l5,l6,l7,l8,l9,m0,m1,m2,m3,m4,m5,m6,m7,m8,m9,n0,n1,n2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4=null
if(!k5.ev(k6))return
s=m6?k8:k4
r=n1?255:k5.hK(k6,k7)
q=m8?k5.b1(k6):255
if(r===0||q===0)return
if(!n1)p=n0&&r===255&&q===255
else p=!0
o=p?k4:k5.as
if(o!=null){n=k5.aC(k6)
if(n==null)return
m=B.c.U(A.eN(n,l6,l8,m0))-1
l=B.c.U(A.eO(n,l7,l9,m1))-1
k=B.c.Y(A.eL(n,l6,l8,m0))+1
j=B.c.Y(A.eM(n,l7,l9,m1))+1
i=Math.max(m,l2)
h=Math.max(l,l3)
g=Math.min(k,l4)
f=Math.min(j,l5)
if(i>=g||h>=f)return
p=o.a
e=o.b
d=l6*p+l8*e
c=l7*p+l9*e
b=isFinite(d)?B.c.D(d,-65537,65537):0
a=isFinite(c)?B.c.D(c,-65537,65537):0
a0=B.c.F(b*256)
a1=B.c.F(a*256)
p=-a0
a2=B.b.aT(B.b.I(p,8),32)
e=-a1
a3=B.b.aT(B.b.I(e,8),32)
a4=p&255
a5=e&255
a6=Math.min(i,i+a2)
a7=Math.min(h,h+a3)
p=a4===0?0:1
a8=Math.max(g,g+a2+p)
p=a5===0?0:1
a9=Math.max(f,f+a3+p)
b0=Math.min(i,Math.max(m,a6))
b1=Math.min(h,Math.max(l,a7))
b2=Math.max(g,Math.min(k,a8))
b3=Math.max(f,Math.min(j,a9))
if(b2-b0>65535){b0=Math.max(b0,g-65535)
b2=Math.min(b2,b0+65535)}if(b3-b1>65535){b1=Math.max(b1,f-65535)
b3=Math.min(b3,b1+65535)}if(b0>=0&&b2>65535)b2=65535
if(b1>=0&&b3>65535)b3=65535
if((b2-b0)*(b3-b1)>16777216){b3=f
b2=g
b1=h
b0=i}b4=b0<0?-b0:0
b5=b1<0?-b1:0
b6=b0+b4
b7=b1+b5
b8=b2+b4
b9=b3+b5
c0=m9&&m2==null&&b4===0&&b5===0&&b0===i&&b1===h&&b2===g&&b3===f
c1=b8-b6
c2=b9-b7
c3=c0?k8:m3.aJ(m4*3+2,c1*c2)
c4=c0?k9:b6
c5=c0?l0:b7
c6=c0?k9:b0
c7=c0?l0:b1
c8=c0?l1:c1
if(!c0){p=c1*c2
if(m3.b)A.cc(c3,p)
else A.bW(c3.gA(),p)}p=c0?m4:m4+1
e=c0?m6:m3.b
A.c7(k5,k6,255,c3,c4,c5,c8,b6,b7,b8,b9,l6,l7,l8,l9,m0+b4,m1+b5,k4,m3,p,m5,e,0,!1,!1,!1,!0,!0)
c9=A.ak(r*q)
if(!n0)d0=a0===0&&a1===0
else d0=!0
p=!1
if(!d0)if(m2==null)if(m7===0)if(s!=null)if(c8===c1)if(c6===b0)if(c7===b1)p=(!c0||c9===255)&&A.pu(s,(h-l0)*l1+i-k9,l1,c3,c1,c2,i-b0,h-b1,g-i,f-h,a2,a3,a4,a5,(255-o.aY(16)<<16|255-o.aY(8)<<8|255-o.aY(0))>>>0,c9)
if(p)return
A.o7(o,c9,m7,c3.gA(),c6,c7,c8,new A.aN([b0,b1,b2,b3]),k8.gA(),k9,l0,l1,new A.aN([i,h,g,f]),a2,a3,a4,a5,c0,d0,m2)
return}d1=n2?k5.at:k4
d2=d1==null?k4:d1.hd(k6)
d3=n0&&d2!=null&&d2>>>24===255?k4:d2
if(q!==255||d3!=null){p=d3==null
c9=p?q:A.ak((d3>>>24)*q)
if(c9===0)return
n=k5.aC(k6)
if(n==null)return
i=Math.max(l2,B.c.U(A.eN(n,l6,l8,m0))-1)
h=Math.max(l3,B.c.U(A.eO(n,l7,l9,m1))-1)
g=Math.min(l4,B.c.Y(A.eL(n,l6,l8,m0))+1)
f=Math.min(l5,B.c.Y(A.eM(n,l7,l9,m1))+1)
c1=g-i
c2=f-h
if(c1<=0||c2<=0)return
e=c1*c2
c3=m3.aJ(m4*3+2,e)
if(m6)A.cc(c3,e)
else A.bW(c3.gA(),e)
A.c7(k5,k6,k7,c3,i,h,c1,i,h,g,f,l6,l7,l8,l9,m0,m1,m2,m3,m4+1,m5,m6,0,!1,!1,n0,!1,!1)
d4=c3.gA()
d5=k8.gA()
d6=(h-l0)*l1+i-k9
for(e=d5.length,d7=m7===0,d8=d4.length,d9=d5.$flags|0,e0=0;e0<c2;++e0,d6+=l1)for(e1=e0*c1,e2=0;e2<c1;++e2){e3=e1+e2
if(!(e3>=0&&e3<d8))return A.a(d4,e3)
e4=d4[e3]
if(e4===0)continue
if(p)e5=A.Q(e4,c9)
else{e6=(e4>>>24)*c9+128
e5=A.Q((d3&16777215|4278190080)>>>0,B.b.I(e6+B.b.I(e6,8),8))}e7=d6+e2
if(d7){if(!(e7>=0&&e7<e))return A.a(d5,e7)
e3=A.t(e5,d5[e7])}else{if(!(e7>=0&&e7<e))return A.a(d5,e7)
e3=A.be(e5,d5[e7],m7)}d9&2&&A.c(d5)
if(!(e7>=0&&e7<e))return A.a(d5,e7)
d5[e7]=e3}return}if(k5.gef()){for(e4=k5,e8=0;e4!=null;e4=e4.cy)++e8
if(e8===1){e9=m3.cc(m4)
A.eJ(k5.a,k6,l6,l7,l8,l9,m0,m1,e9)
f0=e9[0]
f1=e9[1]
f2=e9[2]
f3=e9[3]
f4=e9[4]
f5=e9[5]}else{f6=m3.p1
while(f6.length<e8)B.a.k(f6,k4)
f7=e8-1
for(e4=k5;e4!=null;e4=e4.cy,f7=f8){f8=f7-1
B.a.n(f6,f7,e4)}e9=m3.cc(m4)
for(f5=m1,f4=m0,f3=l9,f2=l8,f1=l7,f0=l6,e7=0;e7<e8;++e7){if(!(e7<f6.length))return A.a(f6,e7)
A.eJ(f6[e7].a,k6,f0,f1,f2,f3,f4,f5,e9)
B.a.n(f6,e7,k4)
f0=e9[0]
f1=e9[1]
f2=e9[2]
f3=e9[3]
f4=e9[4]
f5=e9[5]}}}else{f5=m1
f4=m0
f3=l9
f2=l8
f1=l7
f0=l6}f9=m5&&k5.geh()
g0=k5.z
p=g0!=null
if(p&&k5.ged()){g1=f9&&k5.ghD()?new A.cw([f0,f1,f2,f3,f4,f5,l2,l3,l4,l5]):k4
e=g1==null
g2=e?k4:m3.dv(k5,g1)
if(g2==null){g3=m3.cR(m4)
g3.j(0)
A.oL(g0,k6,f0,f1,f2,f3,f4,f5,l2,l3,l4,l5,g3,m3,m4)
if(!e)m3.c8(k5,g1,g3)}else if(m2==null&&g2.b!==0){g3=m3.cR(m4)
g3.e5(g2)}else g3=g2
if(g3.b===0)return
if(m2!=null){g4=m3.eO(m4)
A.fA(g3,m2,g4)
if(g4.b===0)return
g5=g4}else g5=g3
g6=Math.max(l2,g5.c)
g7=Math.max(l3,g5.d)
g8=Math.min(l4,g5.e)
g9=Math.min(l5,g5.f)
if(g6>=g8||g7>=g9)return}else{g9=l5
g8=l4
g7=l3
g6=l2
g5=m2}h0=k5.b
h1=k5.f
e=h0==null
h2=!1
if(e)if(h1!=null){d7=!(Math.abs(f1)<1e-9&&Math.abs(f2)<1e-9)
h2=d7}h3=!h2&&g5!=null&&p&&k5.ged()&&k5.fs(k6)
if(h3){c1=g8-g6
p=c1*(g9-g7)
h4=m3.aJ(m4*3+2,p)
if(m6)A.cc(h4,p)
else A.bW(h4.gA(),p)
h5=k4
h6=c1
c5=g7
c4=g6
h7=0}else{h5=g5
h7=m7
h6=l1
c5=l0
c4=k9
h4=k8}if(!e)A.lD(h0,k6,r,h4,c4,c5,h6,g6,g7,g8,g9,f0,f1,f2,f3,f4,f5,h5,m3,m4+1,f9,m6,h7)
if(h1!=null){h8=k5.e0(k6)
p=h1.b
p===$&&A.H()
e=h1.c
e===$&&A.H()
if(Math.abs(f1)<1e-9&&Math.abs(f2)<1e-9){d7=f0>=0
i=B.c.U(f4+(d7?0:f0*p))
g=B.c.Y(f4+(d7?f0*p:0))
p=f3>=0
h=B.c.U(f5+(p?0:f3*e))
f=B.c.Y(f5+(p?f3*e:0))
h9=Math.max(g6,i)
i0=Math.max(g7,h)
i1=Math.min(g8,g)
i2=Math.min(g9,f)
if(h9<i1&&i0<i2)A.k1(h1,h8,r,h4,c4,c5,h6,h9,i0,i1,i2,f0,f1,f2,f3,f4,f5,h5,m3,m4+1,f9,m6)}else{i3=h1.gdZ()
i4=Math.max(g6,B.c.U(A.eN(i3,f0,f2,f4))-1)
i5=Math.max(g7,B.c.U(A.eO(i3,f1,f3,f5))-1)
i6=Math.min(g8,B.c.Y(A.eL(i3,f0,f2,f4))+1)
i7=Math.min(g9,B.c.Y(A.eM(i3,f1,f3,f5))+1)
if(i4<i6&&i5<i7){i8=i6-i4
i9=h3?m4+1:m4
d7=i8*(i7-i5)
j0=m3.aJ(i9*3+2,d7)
if(m6)A.cc(j0,d7)
else A.bW(j0.gA(),d7)
A.k1(h1,h8,r,j0,i4,i5,i8,i4,i5,i6,i7,f0,f1,f2,f3,f4,f5,k4,m3,i9+1,f9,m6)
d7=m3.db
d7.j(0)
d7.a5(!0)
d7.p(f4,f5)
d8=f0*p
p=f1*p
d7.p(d8+f4,p+f5)
d9=f2*e
e=f3*e
d7.p(d8+d9+f4,p+e+f5)
d7.p(d9+f4,e+f5)
d7.a3()
m3.aW(d7,!1,m3.gbW(),i4,i5,i6,i7)
j1=m3.gbW()
if(h5!=null){A.fA(m3.gbW(),h5,m3.gbx())
j1=m3.gbx()}j2=j1.b*2
j3=j1.a.gA()
j4=j0.gA()
d5=h4.gA()
for(p=j4.length,e=d5.length,d7=h7===0,d8=j3.length,d9=d5.$flags|0,f7=0;f7<j2;f7+=2){if(!(f7<d8))return A.a(j3,f7)
j5=j3[f7]
e1=f7+1
if(!(e1<d8))return A.a(j3,e1)
j6=j3[e1]
e0=j5>>>16
e2=j5&65535
j7=j6>>>8
j8=(j6&255)+1
j9=(e0-i5)*i8+(e2-i4)
k0=(e0-c5)*h6+(e2-c4)
for(e1=j8===256,k1=0;k1<j7;++k1){e3=j9+k1
if(!(e3>=0&&e3<p))return A.a(j4,e3)
e4=j4[e3]
if(e4!==0){k2=e1?e4:A.ah(e4,j8)
e7=k0+k1
if(d7){if(!(e7>=0&&e7<e))return A.a(d5,e7)
e3=A.t(k2,d5[e7])}else{if(!(e7>=0&&e7<e))return A.a(d5,e7)
e3=A.be(k2,d5[e7],h7)}d9&2&&A.c(d5)
if(!(e7>=0&&e7<e))return A.a(d5,e7)
d5[e7]=e3}}}}}}if(h3){j3=g5.a.gA()
j2=g5.b*2
k3=h4.gA()
d5=k8.gA()
for(p=d5.length,e=m7===0,d7=k3.length,d8=j3.length,d9=d5.$flags|0,f7=0;f7<j2;f7+=2){if(!(f7<d8))return A.a(j3,f7)
j5=j3[f7]
e1=f7+1
if(!(e1<d8))return A.a(j3,e1)
j6=j3[e1]
e0=j5>>>16
e2=j5&65535
j7=j6>>>8
j8=(j6&255)+1
j9=(e0-c5)*h6+(e2-c4)
k0=(e0-l0)*l1+(e2-k9)
for(e1=j8===256,k1=0;k1<j7;++k1){e3=j9+k1
if(!(e3>=0&&e3<d7))return A.a(k3,e3)
e4=k3[e3]
if(e4===0)continue
k2=e1?e4:A.ah(e4,j8)
e7=k0+k1
if(e){if(!(e7>=0&&e7<p))return A.a(d5,e7)
e3=A.t(k2,d5[e7])}else{if(!(e7>=0&&e7<p))return A.a(d5,e7)
e3=A.be(k2,d5[e7],m7)}d9&2&&A.c(d5)
if(!(e7>=0&&e7<p))return A.a(d5,e7)
d5[e7]=e3}}}},
o7(b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5=null,b6={}
b6.a=b6.b=null
s=c4.a
b6.b=s[0]
r=s[1]
b6.a=s[2]
q=s[3]
s=c9.a
p=s[0]
o=s[1]
n=s[2]
m=s[3]
l=new A.im(b6,d5,d0,c0,d2,d3,A.pA(),255-b7.aY(16),255-b7.aY(8),255-b7.aY(0))
if(d6!=null){k=d6.a.gA()
j=d6.b*2
for(s=c5.length,i=b9===0,h=b8!==255,g=c0.length,f=k.length,e=0;e<j;e+=2){if(!(e<f))return A.a(k,e)
d=k[e]
c=d>>>16
if(c<o)continue
if(c>=m)break
b=e+1
if(!(b<f))return A.a(k,b)
a=k[b]
a0=d&65535
a1=a0<p?p:a0
a2=a0+(a>>>8)
if(a2>n)a2=n
if(a1>=a2)continue
a3=(a&255)+1
a4=c+d1
a5=a4+1
a6=a4>=r&&a4<q?(a4-c2)*c3-c1:b5
a7=a5>=r&&a5<q?(a5-c2)*c3-c1:b5
a8=(c-c2)*c3-c1
a9=(c-c7)*c8-c6
for(b=a3!==256,b0=a1;b0<a2;++b0){b1=a8+b0
if(!(b1>=0&&b1<g))return A.a(c0,b1)
b2=c0[b1]
if(b2===0)continue
b2=l.$4(b2,b0,a6,a7)
if(h)b2=A.Q(b2,b8)
if(b)b2=A.ah(b2,a3)
if(b2===0)continue
b3=a9+b0
if(i){if(!(b3>=0&&b3<s))return A.a(c5,b3)
b1=A.t(b2,c5[b3])}else{if(!(b3>=0&&b3<s))return A.a(c5,b3)
b1=A.be(b2,c5[b3],b9)}c5.$flags&2&&A.c(c5)
if(!(b3>=0&&b3<s))return A.a(c5,b3)
c5[b3]=b1}}return}for(s=c5.length,i=b9===0,h=b8!==255,g=c0.length,c=o;c<m;++c){a4=c+d1
a5=a4+1
a6=a4>=r&&a4<q?(a4-c2)*c3-c1:b5
a7=a5>=r&&a5<q?(a5-c2)*c3-c1:b5
a8=(c-c2)*c3-c1
a9=(c-c7)*c8-c6
for(b0=p;b0<n;++b0){f=a8+b0
if(!(f>=0&&f<g))return A.a(c0,f)
b2=c0[f]
if(b2===0)continue
b2=l.$4(b2,b0,a6,a7)
b3=a9+b0
if(d4){c5.$flags&2&&A.c(c5)
if(!(b3>=0&&b3<s))return A.a(c5,b3)
c5[b3]=b2}else{if(h)b2=A.Q(b2,b8)
if(i){if(!(b3>=0&&b3<s))return A.a(c5,b3)
f=A.t(b2,c5[b3])}else{if(!(b3>=0&&b3<s))return A.a(c5,b3)
f=A.be(b2,c5[b3],b9)}c5.$flags&2&&A.c(c5)
if(!(b3>=0&&b3<s))return A.a(c5,b3)
c5[b3]=f}}}if(d4&&h)for(c=o;c<m;++c){b4=(c-c7)*c8-c6
for(b0=p;b0<n;++b0){i=b4+b0
if(!(i>=0&&i<s))return A.a(c5,i)
h=A.Q(c5[i],b8)
c5.$flags&2&&A.c(c5)
c5[i]=h}}},
oL(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.eQ(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.D(0.25/e,0.005,1.5),c=new A.iv(b1.eP(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.a.gai(a).gbE())c.$2(B.a.gai(a),b0)
else{s=b1.av(0)
r=b1.av(1)
q=b1.av(2)
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
j=l.c.q(b)
if(0>=j.length)return A.a(j,0)
i=B.b.D(B.c.F(j[0]*2.56),0,256)
if(i!==256)s.eA(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aX(g,a6,o,256)
if(j){s.aU(r)
A.d7(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aU(s)
else if(j)A.d7(q,s,b0,k)
else{b0.aU(r)
A.d7(r,s,b0,k)}n=!0}}},
og(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.c(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.ln(a,Math.abs(b),2,2,4,c,d,e)},
lD(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gct())s=c
else{r=f.e.q(b)
if(0>=r.length)return A.a(r,0)
s=B.b.D(B.c.F(c*B.c.F(r[0])/100),0,255)}if(s===0)return
if(!f.gaH()){q=b3.cc(b4)
A.eJ(f,b,a6,a7,a8,a9,b0,b1,q)
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
p=a6}j=b5&&f.gb_()
i=a.gbh()
for(h=i.length-1,r=b4+1;h>=0;--h){if(!(h<i.length))return A.a(i,h)
g=i[h]
if(g instanceof A.a8)A.lD(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.bm)A.oO(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
oO(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.q(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.b.D(B.c.F(c0*B.c.F(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gcd())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gK()
b7=b7!==!1
r=b7}b8.id!==$&&A.R()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.cw([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.dv(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.a.az(b8.a,A.kf())
b8.fx!==$&&A.R()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.b9(b9)
if(l==null)return
n=[Math.max(c5,B.c.U(A.eN(l,c9,d1,d3))-2),Math.max(c6,B.c.U(A.eO(l,d0,d2,d4))-2),Math.min(c7,B.c.Y(A.eL(l,c9,d1,d3))+2),Math.min(c8,B.c.Y(A.eM(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gb7()
m=b8.a
A.k0(m,0,m.length,b9,new A.bF([c9,d0,d1,d2,d3,d4]),new A.aN(n),b8.f,o,d6,0)}else{l=A.oK(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
f=d5==null&&b8.y==null&&d9===0
if(f&&d8){e=A.k7(b8,b9,s)
if(d6.fP(d6.dy,g,d6.gb7(),k,j,i,h,c1,c2,c3,c4,e)){o=d6.gb7()
if(!b7&&o.b>0)d6.c8(b8,p,o)
return}}else if(f&&!d8&&b7){e=A.k7(b8,b9,s)
n=c1.gA()
m=d6.ch
if(m==null)m=d6.ch=A.kB(256)
if(m.hT(d6.dy,g,k,j,i,h,n,c2,c3,c4,e))return}d6.aW(d6.dy,g,d6.gb7(),k,j,i,h)
o=d6.gb7()}if(!b7&&o.b>0)d6.c8(b8,p,o)}if(d5!=null){A.fA(o,d5,d6.gbx())
o=d6.gbx()}if(o.b===0)return
d=d8?c1:b6
c=b8.y
if(c==null){e=A.k7(b8,b9,s)
if(d9===0)A.kV(c1.gA(),c2,c3,c4,o,e,d)
else A.nh(c1.gA(),c2,c3,c4,o,e,d9,d)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.oe(c,b9,d6)
a7=c.d.q(b9)
a8=c.e.q(b9)
if(c.ghC()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=c.hz(b9,a9,b0)
if(b1!=null){A.oh(c1.gA(),c2,c3,c4,o,a6.gA(),s,d9,new A.bF([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
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
b5=A.pt(d,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
b7=b5}}if(b7)return
b7=a7.length
n=a8.length
if(c.w){m=c1.gA()
b2=a6.gA()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.nk(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gA()
b2=a6.gA()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.nj(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
oh(b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6=c4.a,a7=a6[0],a8=a6[1],a9=a6[2],b0=a6[3],b1=a6[4],b2=a6[5],b3=c8.a,b4=c8.b,b5=1-b3*b3-b4*b4
if(!(b5>1e-12)||!(c7>0)||!isFinite(c7))return
s=a7/c7
r=a8/c7
q=c0.a.gA()
for(a6=b6.length,p=c3===0,o=c2!==255,n=c1.length,m=q.length,l=0;l<c0.b*2;l+=2){if(!(l<m))return A.a(q,l)
k=q[l]
j=l+1
if(!(j<m))return A.a(q,j)
i=q[j]
h=k&65535
g=k>>>16
f=(i&255)+1
j=h+0.5
e=g+0.5
d=(a7*j+a9*e+b1-c5)/c7-b3
c=(a8*j+b0*e+b2-c6)/c7-b4
b=(g-b8)*b9+h-b7
a=b+(i>>>8)
for(j=f!==256,a0=b;a0<a;++a0,d+=s,c+=r){a1=d*b3+c*b4
a2=a1*a1+b5*(d*d+c*c)
a3=(a1+(a2>0?Math.sqrt(a2):0))/b5
if(!(a3>0))a4=0
else a4=a3>=1?1023:B.c.L(a3*1023+0.5)
if(!(a4>=0&&a4<n))return A.a(c1,a4)
a5=c1[a4]
if(o)a5=A.Q(a5,c2)
if(j)a5=A.ah(a5,f)
if(p){if(!(a0>=0&&a0<a6))return A.a(b6,a0)
e=A.t(a5,b6[a0])}else{if(!(a0>=0&&a0<a6))return A.a(b6,a0)
e=A.be(a5,b6[a0],c3)}b6.$flags&2&&A.c(b6)
if(!(a0>=0&&a0<a6))return A.a(b6,a0)
b6[a0]=e}}},
dG(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aS){s=a.c
if(s===$){r=a.b!==1||B.a.az(a.a,A.kf())
a.c!==$&&A.R()
a.c=r
s=r}q=s
break A}if(a instanceof A.a8){s=a.r
if(s===$){r=B.a.az(a.a,A.kf())
a.r!==$&&A.R()
a.r=r
s=r}q=s
break A}if(a instanceof A.Y){q=A.dG(a.a)
break A}q=!1
break A}return q},
k0(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.dG(a[b])}else s=!1
if(s){if(!(b<a.length))return A.a(a,b)
A.eK(a[b],d,e,a0,a1,a2,a3,a4)
return}s=e.a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
n=s[4]
m=s[5]
l=a3.dy
l.j(0)
for(k=b;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dG(j))A.bo(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.j(0)
else{s=a0.a
a3.aW(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dG(j))continue
if(a2.b===0)A.eK(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.av(i)
A.eK(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.av(h)
f.aU(a2)
A.d7(f,g,a2,a1?5:2)}}},
eK(a2,a3,a4,a5,a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1={}
a1.a=a4
A:{s=a2 instanceof A.a8
r=s?a2:null
if(s){s=a4.a
q=s[0]
p=s[1]
o=s[2]
n=s[3]
m=s[4]
l=s[5]
s=r.c
if(!s.gaH()){k=a8.d8(a9)
A.eJ(s,a3,q,p,o,n,m,l,k)
s=a1.a=new A.bF([k[0],k[1],k[2],k[3],k[4],k[5]])}else s=a4
j=r.a
A.k0(j,0,j.length,a3,s,a5,a6,a7,a8,a9+1)
break A}s=a2 instanceof A.Y
i=s?a2:null
if(s){A.eK(i.a,a3,a4,a5,a6,a7,a8,a9+1)
break A}s=a2 instanceof A.aS
h=s?a2:null
if(s){g=h.a
s=h.b
if(s===1){A.k0(g,0,g.length,a3,a4,a5,a6,a7,a8,a9+1)
return}j=g.length
if(j===0){a7.j(0)
return}f=new A.iu(a1,a3,a5,a8,a9)
if(0>=j)return A.a(g,0)
f.$2(g[0],a7)
if(g.length===1){if(s===3||s===4)a7.j(0)
return}e=a9*2
d=a8.av(e)
c=a8.av(e+1)
for(j=s!==3,b=s===4,a=1;a<g.length;++a){if(a7.b===0)a0=!j||b
else a0=!1
if(a0)return
f.$2(g[a],c)
d.aU(a7)
A.d7(d,c,a7,s)}break A}throw A.h(A.au("Expected a boolean path"))}},
oK(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8=a9.e
if(a8){s=a9.d.q(b0)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a7}else r=0
q=a9.b9(b0)
if(q==null)return a7
s=B.c.U(A.eN(q,b5,b7,b9))
p=B.c.U(A.eO(q,b6,b8,c0))
o=B.c.Y(A.eL(q,b5,b7,b9))
n=B.c.Y(A.eM(q,b6,b8,c0))
m=Math.max(b1,s-2)
l=Math.max(b2,p-2)
k=Math.min(b3,o+2)
j=Math.min(b4,n+2)
if(m>=k||l>=j)return a7
i=a9.go
if(i===$){h=a9.fZ()
a9.go!==$&&A.R()
a9.go=h
i=h}if(i!=null){g=c1.dD(i,b0)
if(g.r===0)return a7
a8=c1.dy
a8.j(0)
a8.ae(g,b5,b6,b7,b8,b9,c0)
return new A.aN([m,l,k,j])}if(!a8&&a9.z==null&&a9.a.length===1){f=B.a.gai(a9.a)
while(f instanceof A.Y)f=f.a
if(f instanceof A.av&&!f.gK()){e=c1.dy
e.j(0)
A.lr(f,b0,0.0625,e,new A.bF([b5,b6,b7,b8,b9,c0]));++c1.w
return e.r===0?a7:new A.aN([m,l,k,j])}}d=Math.max(Math.sqrt(b5*b5+b6*b6),Math.sqrt(b7*b7+b8*b8))
c=d<=0.000001?0.25:B.c.D(0.25/d,0.005,1.5)
b=c*c
a=c1.db
a.j(0)
a0=a9.a
for(a1=a0.length-1;a1>=0;--a1){if(!(a1<a0.length))return A.a(a0,a1)
A.bo(a0[a1],b0,1,0,0,1,0,0,b,a,c1,0,0)}if(a.r===0)return a7
a2=a9.z
if(a2!=null){a3=c1.dx
a3.j(0)
A.nX(a,a2,b0,a3,c1.RG)
if(a3.r===0)return a7
a4=a3}else a4=a
if(a8){a5=c1.fr
a5.j(0)
A.ln(a4,r*0.5,a9.r,a9.w,a9.x,c,a5,c1.gdE())
if(a5.r===0)return a7
a4=a5}a6=c1.dy
a6.j(0)
a6.ae(a4,b5,b6,b7,b8,b9,c0)
return new A.aN([m,l,k,j])},
k7(a,b,c){var s,r,q=a.b.q(b),p=q.length
if(0>=p)return A.a(q,0)
s=B.b.D(B.c.F(q[0]*255),0,255)
if(1>=p)return A.a(q,1)
r=B.b.D(B.c.F(q[1]*255),0,255)
if(2>=p)return A.a(q,2)
return A.kW(c,s,r,B.b.D(B.c.F(q[2]*255),0,255))},
oe(a,b,c){var s,r,q,p
if(a.c.a!=null){s=c.cr
r=s.h(0,a)
if(r!=null)return r.b
if(s.a>=256)s.u(0,new A.I(s,s.$ti.i("I<1>")).ga7(0)).b.a1()
q=A.fo(1024)
p=c.ay
p.toString
s.n(0,a,new A.ad(p,q,t.dL))
A.lq(a,b,q.gA())
return q}q=c.aZ
if(q==null)q=c.aZ=A.fo(1024)
A.lq(a,b,q.gA())
return q},
lq(a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=a8.c.q(a9),a5=a8.a,a6=a8.x,a7=a8.y
for(s=a4.length,r=a7.length,q=0;q<a5;++q){p=4*q
o=3*q
n=p+1
if(!(n<s))return A.a(a4,n)
n=A.fM(a4[n])
a6.$flags&2&&A.c(a6)
m=a6.length
if(!(o<m))return A.a(a6,o)
a6[o]=n
n=o+1
l=p+2
if(!(l<s))return A.a(a4,l)
l=A.fM(a4[l])
a6.$flags&2&&A.c(a6)
if(!(n<m))return A.a(a6,n)
a6[n]=l
l=o+2
n=p+3
if(!(n<s))return A.a(a4,n)
n=A.fM(a4[n])
a6.$flags&2&&A.c(a6)
if(!(l<m))return A.a(a6,l)
a6[l]=n
if(!(p<s))return A.a(a4,p)
k=B.c.D(a4[p],0,1)
if(q>0){n=q-1
if(!(n<r))return A.a(a7,n)
n=k<a7[n]}else n=!1
if(n){n=q-1
if(!(n>=0&&n<r))return A.a(a7,n)
n=a7[n]}else n=k
a7.$flags&2&&A.c(a7)
if(!(q<r))return A.a(a7,q)
a7[q]=n}for(s=a6.length,n=a5-1,j=0,i=0;i<1024;++i){h=i/1023
for(;;){if(j<n){m=j+1
if(!(m>=0&&m<r))return A.a(a7,m)
m=a7[m]<=h}else m=!1
if(!m)break;++j}if(!(j>=0&&j<r))return A.a(a7,j)
g=Math.max(0,j-(h<a7[j]?1:0))
f=Math.min(n,g+1)
if(g>>>0!==g||g>=r)return A.a(a7,g)
e=a7[g]
if(f>>>0!==f||f>=r)return A.a(a7,f)
d=a7[f]-e
c=d<=1e-12?0:B.c.D((h-e)/d,0,1)
b=g*3
a=f*3
if(!(b>=0&&b<s))return A.a(a6,b)
m=a6[b]
if(!(a>=0&&a<s))return A.a(a6,a)
l=a6[a]
a0=b+1
if(!(a0<s))return A.a(a6,a0)
a0=a6[a0]
a1=a+1
if(!(a1<s))return A.a(a6,a1)
a1=a6[a1]
a2=b+2
if(!(a2<s))return A.a(a6,a2)
a2=a6[a2]
a3=a+2
if(!(a3<s))return A.a(a6,a3)
a3=a6[a3]
a2=A.kW(B.b.D(B.c.F(a8.f_(a4,h)*255),0,255),B.b.D(B.c.F((m+(l-m)*c)*255),0,255),B.b.D(B.c.F((a0+(a1-a0)*c)*255),0,255),B.b.D(B.c.F((a2+(a3-a2)*c)*255),0,255))
b0.$flags&2&&A.c(b0)
if(!(i<b0.length))return A.a(b0,i)
b0[i]=a2}},
jM(a){return new A.bC(a,A.f([],t.ch))},
l1(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.b.J(b.gbf()-s,2)),q=new Float32Array(a*3),p=new Float64Array(a),o=Math.max(0,B.b.J(b.gbf()-s,2))
new Float64Array(o)
o=Math.max(2,a+Math.max(0,B.b.J(b.gbf()-s,2)))
new Float64Array(o)
s=Math.max(2,a+Math.max(0,B.b.J(b.gbf()-s,2)))
new Uint32Array(s)
return new A.bj(a,r,b,c,d,f,g,e,q,p)},
nI(a,b,c,d,e){return new A.bG(a,b,c,d,e,A.V(t.S,t.W))},
l_(a,b){var s=a.length
return new A.cu(a,b,new Float64Array(s))},
cF(a,b){var s,r,q,p,o
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
return new A.aE(s,r,q,p>o?p:o)},
jR(a,b,c,d,e,f,g,h,i){return new A.c4(a,b,c,d,e,f,g,h,i)},
jS(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
eF(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
nw(a,b,c,d,e){return new A.ac(a,b,c,d,e)},
l2(a,b,c){return new A.hQ(a,b,c)},
l3(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.a9(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
jO(a,b,c){return new A.a8(a,b,c)},
nx(a,b){return new A.aS(a,b)},
it(a,b,c){if(c>0)return new A.A(a,-b)
if(c<0)return new A.A(-a,b)
return B.aE},
jQ(a,b,c,d,e,f,g,h,i,j,k){return new A.bm(a,b,c,d,e,f,g,h,i,k,j)},
ir:function ir(a,b){this.a=a
this.b=b},
i4:function i4(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=null},
fs:function fs(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9){var _=this
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
_.CW=r
_.cx=s
_.cy=a0
_.db=a1
_.dx=a2
_.dy=a3
_.fr=a4
_.fx=a5
_.fy=a6
_.go=a7
_.id=a8
_.k1=a9
_.k2=b0
_.k3=b1
_.k4=b2
_.ok=b3
_.p1=b4
_.p2=b5
_.p3=b6
_.p4=b7
_.R8=b8
_.RG=b9
_.rx=c0
_.ry=c1
_.to=c2
_.x1=c3
_.x2=c4
_.xr=c5
_.y1=c6
_.y2=c7
_.aG=c8
_.aP=c9},
iy:function iy(a,b){this.a=a
this.b=b},
iE:function iE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iz:function iz(a,b){this.a=a
this.b=b},
iA:function iA(a,b,c){this.a=a
this.b=b
this.c=c},
iB:function iB(a,b,c){this.a=a
this.b=b
this.c=c},
iC:function iC(a,b,c){this.a=a
this.b=b
this.c=c},
ix:function ix(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iD:function iD(a,b,c){this.a=a
this.b=b
this.c=c},
iF:function iF(a,b){this.a=a
this.b=b},
iG:function iG(a){this.a=a},
iH:function iH(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
is:function is(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
cn:function cn(a){this.a=a},
fv:function fv(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1){var _=this
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
_.k3=null
_.k4=m
_.ok=n
_.p1=o
_.p2=p
_.p3=q
_.p4=r
_.R8=s
_.RG=a0
_.rx=a1
_.ry=null
_.to=a2
_.x1=a3
_.x2=a4
_.xr=a5
_.y1=a6
_.y2=a7
_.aP=_.aG=0
_.bF=a8
_.bG=a9
_.cr=b0
_.aZ=null
_.e9=b1},
fw:function fw(a,b){this.a=a
this.b=b},
fx:function fx(a){this.a=a},
fy:function fy(a){this.a=a},
fz:function fz(a){this.a=a},
ad:function ad(a,b,c){this.a=a
this.b=b
this.$ti=c},
bY:function bY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
im:function im(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j},
iv:function iv(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
iu:function iu(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
d:function d(a,b){this.a=a
this.b=b},
bC:function bC(a,b){var _=this
_.a=a
_.r=_.f=_.e=_.d=_.c=_.b=$
_.w=b
_.x=1
_.y=!1
_.z=$
_.as=null},
hb:function hb(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
h1:function h1(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
h2:function h2(a,b,c){this.a=a
this.b=b
this.c=c},
h0:function h0(a){this.a=a},
h7:function h7(a,b,c){this.a=a
this.b=b
this.c=c},
h8:function h8(a,b,c){this.a=a
this.b=b
this.c=c},
h9:function h9(a,b,c){this.a=a
this.b=b
this.c=c},
h6:function h6(a,b,c){this.a=a
this.b=b
this.c=c},
h4:function h4(){},
h5:function h5(){},
h3:function h3(a,b){this.a=a
this.b=b},
ha:function ha(){},
hh:function hh(a,b){this.a=a
this.b=b},
i1:function i1(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ew:function ew(a){this.b=a},
hw:function hw(a){this.a=a},
hx:function hx(a,b){this.a=a
this.b=b},
hq:function hq(a,b){this.a=a
this.b=b},
hr:function hr(a,b){this.a=a
this.b=b},
hs:function hs(a,b){this.a=a
this.b=b},
ht:function ht(a,b){this.a=a
this.b=b},
hu:function hu(a,b){this.a=a
this.b=b},
hv:function hv(a,b){this.a=a
this.b=b},
hk:function hk(a,b){this.a=a
this.b=b},
hm:function hm(a,b){this.a=a
this.b=b},
hl:function hl(a,b){this.a=a
this.b=b},
hy:function hy(a,b){this.a=a
this.b=b},
hj:function hj(a,b){this.a=a
this.b=b},
ho:function ho(a,b){this.a=a
this.b=b},
hn:function hn(a,b){this.a=a
this.b=b},
hp:function hp(a,b){this.a=a
this.b=b},
bj:function bj(a,b,c,d,e,f,g,h,i,j){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j},
Y:function Y(a){this.a=a},
bn:function bn(a,b){this.a=a
this.b=b},
bG:function bG(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$
_.as=f},
i8:function i8(){},
cu:function cu(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
hc:function hc(){},
c4:function c4(a,b,c,d,e,f,g,h,i){var _=this
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
ac:function ac(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$},
hQ:function hQ(a,b,c){this.a=a
this.b=b
this.c=c},
ev:function ev(a,b){this.a=a
this.b=b},
hi:function hi(){},
a9:function a9(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
_.go=_.fy=_.fr=_.dy=_.dx=_.db=$
_.k1=null
_.k2=0/0},
hV:function hV(){},
hT:function hT(){},
hU:function hU(){},
hW:function hW(){},
a8:function a8(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.r=_.f=_.e=_.d=$
_.Q=_.z=null
_.at=_.as=0/0
_.ay=_.ax=$},
hM:function hM(){},
hO:function hO(){},
hP:function hP(){},
hN:function hN(){},
aS:function aS(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
hZ:function hZ(){},
hY:function hY(){},
ey:function ey(){},
av:function av(a,b,c,d){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.c=null
_.d=0/0},
aU:function aU(a,b,c,d,e){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.c=null
_.d=0/0},
b2:function b2(a,b,c,d,e,f,g,h,i){var _=this
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
bm:function bm(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
i5:function i5(){},
cm(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.a7(s,r,q,p,new Uint8Array(a))},
bv:function bv(a){this.a=a},
a7:function a7(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
d7(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
if(a9===4){A.fA(a6,a7,a8)
return}a8.j(0)
s=a6.a.gA()
r=a7.a.gA()
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
break}if(a8.aX(f,c,a0-c,l)){l=a6.a
j=l.b
if(j!=null){a3=o.a(A.u($.k.memory).buffer)
a4=l.a
s=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
s=l}l=a7.a
j=l.b
if(j!=null){a3=o.a(A.u($.k.memory).buffer)
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
fA(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
a7.j(0)
s=a5.b
if(s===0||a6.b===0)return
if(!(a5.c<a6.e&&a6.c<a5.e&&a5.d<a6.f&&a6.d<a5.f))return
r=s*2
q=a6.b*2
p=a5.a.gA()
o=a6.a.gA()
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
if(a3>0&&a7.aX(h,a1,a2-a1,a3)){l=a5.a
j=l.b
if(j!=null){d=s.a(A.u($.k.memory).buffer)
a4=l.a
p=new Int32Array(d,j,a4)}else{l=l.c
l.toString
p=l}l=a6.a
j=l.b
if(j!=null){d=s.a(A.u($.k.memory).buffer)
a4=l.a
o=new Int32Array(d,j,a4)}else{l=l.c
l.toString
o=l}}}if(a<=a0)n+=2
if(a0<=a)m+=2}}},
kB(a){var s=new Int32Array(8192),r=new Int32Array(8192),q=new Int32Array(8192),p=new Int32Array(8192),o=new Int32Array(0),n=Math.max(64,a),m=new Int32Array(n)
B.f.ag(m,0,n,-1)
return new A.f0(n,m,s,r,q,p,o)},
cP(a){if(a>=-1048576&&a<=1048576)return B.c.F(a*256)
if(!isFinite(a))return 0
return a>0?268435456:-268435456},
jo(a,b){var s=B.b.aT(B.b.I(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
at:function at(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
f0:function f0(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=0
_.w=g
_.x=null
_.Q=_.z=_.y=0
_.as=!1
_.fx=_.fr=_.dy=_.dx=_.db=_.cy=_.cx=_.CW=_.ch=0
_.fy=-1
_.k4=_.k3=_.k2=_.k1=_.id=_.go=0
_.ok=!1},
bW(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.l.B(a,0,b,$.kj())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.l.B(a,s,q,$.kj())}},
kW(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.b.J(b*a+127,255)<<16|B.b.J(c*a+127,255)<<8|B.b.J(d*a+127,255))>>>0},
ah(a,b){if(b>=256)return a
if(b<=0||a===0)return 0
return((a&16711935)*b+8388736>>>8&16711935|(a>>>8&16711935)*b+8388736&4278255360)>>>0},
t(a,b){var s,r,q,p
if(a===0)return b
s=a>>>24
if(s===255||b===0)return a
r=255-s
q=(b&16711935)*r+8388736
p=(b>>>8&16711935)*r+8388736
return a+((B.b.I(q+(B.b.I(q,8)&16711935),8)&16711935|p+(B.b.I(p,8)&16711935)&4278255360)>>>0)},
Q(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.b.I(s+(B.b.I(s,8)&16711935),8)&16711935|r+(B.b.I(r,8)&16711935)&4278255360)>>>0},
kV(a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(a7===0||a6.b===0)return
if(a8!=null&&A.py(a8,a3,a4,a5,a6.a,a6.b,a7))return
s=a6.b*2
r=a6.a.gA()
for(q=a2.length,p=a7>>>24===255,o=r.length,n=0;n<s;n+=2){if(!(n<o))return A.a(r,n)
m=r[n]
l=n+1
if(!(l<o))return A.a(r,l)
k=r[l]
j=k>>>8
i=(k&255)+1
h=i===256?a7:A.ah(a7,i)
if(h===0)continue
g=h>>>24
f=((m>>>16)-a4)*a5+((m&65535)-a3)
e=f+j
if(g===255){d=e-3
for(l=a2.$flags|0,c=f;c<d;){l&2&&A.c(a2)
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
l&2&&A.c(a2)
if(!(c>=0&&c<q))return A.a(a2,c)
a2[c]=h}}else{a0=255-g
if(p&&j===1){if(!(f>=0&&f<q))return A.a(a2,f)
a1=a2[f]
l=a1===0?h:A.jI(h,a1,a0)
a2.$flags&2&&A.c(a2)
a2[f]=l}else for(c=f;c<e;++c){if(!(c>=0&&c<q))return A.a(a2,c)
a1=a2[c]
l=a1===0?h:A.jI(h,a1,a0)
a2.$flags&2&&A.c(a2)
a2[c]=l}}}},
kT(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
if(f===0||e<=0)return
s=d+e
r=f>>>24
if(r===255){q=s-3
for(p=a.$flags|0,o=d;o<q;){p&2&&A.c(a)
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
p&2&&A.c(a)
if(!(o>=0&&o<a.length))return A.a(a,o)
a[o]=f}}else{k=255-r
for(p=a.length,n=a.$flags|0,o=d;o<s;++o){if(!(o>=0&&o<p))return A.a(a,o)
j=a[o]
m=j===0?f:A.jI(f,j,k)
n&2&&A.c(a)
a[o]=m}}},
jI(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.b.I(s+(B.b.I(s,8)&16711935),8)&16711935|r+(B.b.I(r,8)&16711935)&4278255360)>>>0)},
nj(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8=null,c9=1023
if(d6===0||d4.b===0)return
s=e5-e3
r=e6-e4
q=s*s+r*r
if(q<=1e-12){if(0>=d5.length)return A.a(d5,0)
p=d5[0]
A.kV(d0,d1,d2,d3,d4,d6<255?A.Q(p,d6):p,c8)
return}o=1/q
n=(d7*s+d8*r)*o
m=d4.b*2
l=d4.a.gA()
k=d6>=255
j=d5.length
if(k){if(0>=j)return A.a(d5,0)
i=d5[0]}else{if(0>=j)return A.a(d5,0)
i=A.Q(d5[0],d6)}if(k){if(1023>=j)return A.a(d5,1023)
h=d5[1023]}else{if(1023>=j)return A.a(d5,1023)
h=A.Q(d5[1023],d6)}for(g=d0.length,f=l.length,e=n<=0,d=n>=0,c=d0.$flags|0,b=0;b<m;b+=2){if(!(b<f))return A.a(l,b)
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
if(a8<=0&&e){A.kT(d0,c8,c8,a9,a4,a5===256?i:A.ah(i,a5))
continue}if(a8>=1&&d){A.kT(d0,c8,c8,a9,a4,a5===256?h:A.ah(h,a5))
continue}b0=a9+a4
a0=a5===256
if(a0&&k){b1=b0-3
for(b2=a9;b2<b1;a8=a0){b3=a8+n
b4=b3+n
b5=b4+n
a0=b5+n
b6=a8>0
if(b6&&a8<1&&b5>0&&b5<1){b7=B.c.L(a8*1023+0.5)
b8=B.c.L(b3*1023+0.5)
b9=B.c.L(b4*1023+0.5)
c0=B.c.L(b5*1023+0.5)}else{if(!b6)b7=0
else b7=a8>=1?c9:B.c.L(a8*1023+0.5)
if(!(b3>0))b8=0
else b8=b3>=1?c9:B.c.L(b3*1023+0.5)
if(!(b4>0))b9=0
else b9=b4>=1?c9:B.c.L(b4*1023+0.5)
if(!(b5>0))c0=0
else c0=b5>=1?c9:B.c.L(b5*1023+0.5)}if(!(b7>=0&&b7<j))return A.a(d5,b7)
c1=d5[b7]
if(!(b8>=0&&b8<j))return A.a(d5,b8)
c2=d5[b8]
if(!(b9>=0&&b9<j))return A.a(d5,b9)
c3=d5[b9]
if(!(c0>=0&&c0<j))return A.a(d5,c0)
c4=d5[c0]
b6=b2+1
c5=b2+2
b3=b2+3
if((c1&c2&c3&c4)>>>0>=4278190080){c&2&&A.c(d0)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
d0[b2]=c1
if(!(b6>=0&&b6<g))return A.a(d0,b6)
d0[b6]=c2
if(!(c5>=0&&c5<g))return A.a(d0,c5)
d0[c5]=c3
if(!(b3>=0&&b3<g))return A.a(d0,b3)
d0[b3]=c4}else{if(!(b2>=0&&b2<g))return A.a(d0,b2)
c6=A.t(c1,d0[b2])
c&2&&A.c(d0)
d0[b2]=c6
if(!(b6>=0&&b6<g))return A.a(d0,b6)
d0[b6]=A.t(c2,d0[b6])
if(!(c5>=0&&c5<g))return A.a(d0,c5)
d0[c5]=A.t(c3,d0[c5])
if(!(b3>=0&&b3<g))return A.a(d0,b3)
d0[b3]=A.t(c4,d0[b3])}b2+=4}while(b2<b0){if(!(a8>0))c7=0
else c7=a8>=1?c9:B.c.L(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=d5[c7]
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(a0,d0[b2])
c&2&&A.c(d0)
d0[b2]=a0
a8+=n;++b2}}else if(k)for(b2=a9;b2<b0;){if(!(a8>0))c7=0
else c7=a8>=1?c9:B.c.L(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.ah(d5[c7],a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(a0,d0[b2])
c&2&&A.c(d0)
d0[b2]=a0
a8+=n;++b2}else if(a0)for(b2=a9;b2<b0;){if(!(a8>0))c7=0
else c7=a8>=1?c9:B.c.L(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.Q(d5[c7],d6)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(a0,d0[b2])
c&2&&A.c(d0)
d0[b2]=a0
a8+=n;++b2}else for(b2=a9;b2<b0;){if(!(a8>0))c7=0
else c7=a8>=1?c9:B.c.L(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
p=A.ah(A.Q(d5[c7],d6),a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(p,d0[b2])
c&2&&A.c(d0)
d0[b2]=a0
a8+=n;++b2}}},
nk(d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5=1023
if(e2===0||e0.b===0)return
s=f1-e9
r=f2-f0
q=1/Math.max(0.001,Math.sqrt(s*s+r*r))
p=e3*q
o=e4*q
n=e5*q
m=e6*q
l=(e7-e9)*q
k=(e8-f0)*q
j=e0.b*2
i=e0.a.gA()
h=e2<255
g=e1.length
if(1023>=g)return A.a(e1,1023)
f=e1[1023]
e=f>=4278190080
for(d=d6.length,c=i.length,b=!h,a=f!==0,a0=d6.$flags|0,a1=0;a1<j;a1+=2){if(!(a1<c))return A.a(i,a1)
a2=i[a1]
a3=a1+1
if(!(a3<c))return A.a(i,a3)
a4=i[a3]
a5=a2>>>16
a6=a2&65535
a7=(a4&255)+1
a8=a5+0.5
a9=a6+0.5
b0=p*a9+n*a8+l
b1=o*a9+m*a8+k
b2=(a5-d8)*d9+(a6-d7)
b3=b2+(a4>>>8)
a3=a7===256&&b
b4=b3-3
if(a3){for(b5=b2;b5<b4;){b6=b0*b0+b1*b1
b0+=p
b1+=o
b7=b0*b0+b1*b1
b0+=p
b1+=o
b8=b0*b0+b1*b1
b0+=p
b1+=o
b9=b0*b0+b1*b1
b0+=p
b1+=o
if(b6>=1&&b7>=1&&b8>=1&&b9>=1){if(e){a0&2&&A.c(d6)
if(!(b5>=0&&b5<d))return A.a(d6,b5)
d6[b5]=f
a3=b5+1
if(!(a3<d))return A.a(d6,a3)
d6[a3]=f
a3=b5+2
if(!(a3<d))return A.a(d6,a3)
d6[a3]=f
a3=b5+3
if(!(a3<d))return A.a(d6,a3)
d6[a3]=f}else if(a){if(!(b5>=0&&b5<d))return A.a(d6,b5)
a3=A.t(f,d6[b5])
a0&2&&A.c(d6)
d6[b5]=a3
a3=b5+1
if(!(a3<d))return A.a(d6,a3)
d6[a3]=A.t(f,d6[a3])
a3=b5+2
if(!(a3<d))return A.a(d6,a3)
d6[a3]=A.t(f,d6[a3])
a3=b5+3
if(!(a3<d))return A.a(d6,a3)
d6[a3]=A.t(f,d6[a3])}b5+=4
continue}a3=$.jd()
a3.$flags&2&&A.c(a3)
a3[0]=b6
c0=a3[0]
a3[0]=b7
c1=a3[0]
a3[0]=b8
c2=a3[0]
a3[0]=b9
c3=new A.ck(c0,c1,c2,a3[0]).cM()
c4=c3.a
c2=c3.b
c5=c3.c
c6=c3.d
a3=!(c4<1)?d5:B.c.L(c4*1023+0.5)
if(!(a3>=0&&a3<g))return A.a(e1,a3)
c7=e1[a3]
a3=!(c2<1)?d5:B.c.L(c2*1023+0.5)
if(!(a3>=0&&a3<g))return A.a(e1,a3)
c8=e1[a3]
a3=!(c5<1)?d5:B.c.L(c5*1023+0.5)
if(!(a3>=0&&a3<g))return A.a(e1,a3)
c9=e1[a3]
a3=!(c6<1)?d5:B.c.L(c6*1023+0.5)
if(!(a3>=0&&a3<g))return A.a(e1,a3)
d0=e1[a3]
a3=b5+1
c0=b5+2
c1=b5+3
if((c7&c8&c9&d0)>>>0>=4278190080){a0&2&&A.c(d6)
if(!(b5>=0&&b5<d))return A.a(d6,b5)
d6[b5]=c7
if(!(a3>=0&&a3<d))return A.a(d6,a3)
d6[a3]=c8
if(!(c0>=0&&c0<d))return A.a(d6,c0)
d6[c0]=c9
if(!(c1>=0&&c1<d))return A.a(d6,c1)
d6[c1]=d0}else{if(!(b5>=0&&b5<d))return A.a(d6,b5)
c2=A.t(c7,d6[b5])
a0&2&&A.c(d6)
d6[b5]=c2
if(!(a3>=0&&a3<d))return A.a(d6,a3)
d6[a3]=A.t(c8,d6[a3])
if(!(c0>=0&&c0<d))return A.a(d6,c0)
d6[c0]=A.t(c9,d6[c0])
if(!(c1>=0&&c1<d))return A.a(d6,c1)
d6[c1]=A.t(d0,d6[c1])}b5+=4}while(b5<b3){d1=b0*b0+b1*b1
d2=!(d1<1)?d5:B.c.L(Math.sqrt(d1)*1023+0.5)
if(!(d2>=0&&d2<g))return A.a(e1,d2)
a3=e1[d2]
if(!(b5>=0&&b5<d))return A.a(d6,b5)
a3=A.t(a3,d6[b5])
a0&2&&A.c(d6)
d6[b5]=a3
b0+=p
b1+=o;++b5}}else{for(a3=a7<256,b5=b2;b5<b4;){b6=b0*b0+b1*b1
b0+=p
b1+=o
b7=b0*b0+b1*b1
b0+=p
b1+=o
b8=b0*b0+b1*b1
b0+=p
b1+=o
b9=b0*b0+b1*b1
b0+=p
b1+=o
if(b6>=1&&b7>=1&&b8>=1&&b9>=1){d0=f
c9=d0
c8=c9
c7=c8}else{c0=$.jd()
c0.$flags&2&&A.c(c0)
c0[0]=b6
c1=c0[0]
c0[0]=b7
c2=c0[0]
c0[0]=b8
d3=c0[0]
c0[0]=b9
c3=new A.ck(c1,c2,d3,c0[0]).cM()
c4=c3.a
c2=c3.b
c5=c3.c
c6=c3.d
c0=!(c4<1)?d5:B.c.L(c4*1023+0.5)
if(!(c0>=0&&c0<g))return A.a(e1,c0)
c7=e1[c0]
c0=!(c2<1)?d5:B.c.L(c2*1023+0.5)
if(!(c0>=0&&c0<g))return A.a(e1,c0)
c8=e1[c0]
c0=!(c5<1)?d5:B.c.L(c5*1023+0.5)
if(!(c0>=0&&c0<g))return A.a(e1,c0)
c9=e1[c0]
c0=!(c6<1)?d5:B.c.L(c6*1023+0.5)
if(!(c0>=0&&c0<g))return A.a(e1,c0)
d0=e1[c0]}if(h){c7=A.Q(c7,e2)
c8=A.Q(c8,e2)
c9=A.Q(c9,e2)
d0=A.Q(d0,e2)}if(a3){c7=A.ah(c7,a7)
c8=A.ah(c8,a7)
c9=A.ah(c9,a7)
d0=A.ah(d0,a7)}if(!(b5>=0&&b5<d))return A.a(d6,b5)
c0=A.t(c7,d6[b5])
a0&2&&A.c(d6)
d6[b5]=c0
c0=b5+1
if(!(c0<d))return A.a(d6,c0)
d6[c0]=A.t(c8,d6[c0])
c0=b5+2
if(!(c0<d))return A.a(d6,c0)
d6[c0]=A.t(c9,d6[c0])
c0=b5+3
if(!(c0<d))return A.a(d6,c0)
d6[c0]=A.t(d0,d6[c0])
b5+=4}while(b5<b3){d1=b0*b0+b1*b1
d2=!(d1<1)?d5:B.c.L(Math.sqrt(d1)*1023+0.5)
if(!(d2>=0&&d2<g))return A.a(e1,d2)
d4=e1[d2]
if(h)d4=A.Q(d4,e2)
if(a3)d4=A.ah(d4,a7)
if(!(b5>=0&&b5<d))return A.a(d6,b5)
c0=A.t(d4,d6[b5])
a0&2&&A.c(d6)
d6[b5]=c0
b0+=p
b1+=o;++b5}}}},
ak(a){var s=A.j(a)+128
return B.b.I(s+B.b.I(s,8),8)},
jG(a,b,c,d,e){var s
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
break}return A.ak(a*(255-d)+b*(255-c)+s)},
be(a,b,c){var s,r,q,p,o,n,m,l,k
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
k=s+r-A.ak(s*r)
if(A.kX(c))return A.ng(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.ak(q*p)<<16|o+n-A.ak(o*n)<<8|m+l-A.ak(m*l))>>>0
return(k<<24|A.jG(q,p,s,r,c)<<16|A.jG(o,n,s,r,c)<<8|A.jG(m,l,s,r,c))>>>0},
kX(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
ng(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.aM(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.aM(o,n,m)
switch(j){case 12:s=A.fH(A.kU(p,A.jH(l)),A.eg(l))
break
case 13:s=A.fH(A.kU(l,A.jH(p)),A.eg(l))
break
case 14:s=A.fH(p,A.eg(l))
break
case 15:s=A.fH(l,A.eg(p))
break
default:s=new A.aM(A.jF(o,s,j),A.jF(n,r,j),A.jF(m,q,j))
break}r=new A.fG(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.ab()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.ab()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.ai(s)
return(i<<24|q<<16|o<<8|s)>>>0},
jF(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
eg(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
jH(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
kU(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.jH(a)
if(o===0)return B.aL
return new A.aM((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
fH(a,b){var s=b-A.eg(a),r=a.a,q=a.b,p=a.c,o=new A.fI(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.aM(o.$1(r),o.$1(q),o.$1(p))},
kR(a,b){var s,r,q,p,o,n,m,l,k,j
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
return(s+r-A.ak(s*r)<<24|A.ak(o*p+n*q+o*n)<<16|A.ak(m*p+l*q+m*l)<<8|A.ak(k*p+j*q+k*j))>>>0},
kS(a,b){var s,r,q,p,o,n,m,l
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
return(s+r-A.ak(s*r)<<24|q+p-A.ak(q*p)<<16|o+n-A.ak(o*n)<<8|m+l-A.ak(m*l))>>>0},
nh(a,b,c,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
if(a2===0)return
if(a4!=null){if(A.kX(a3))s=$.k!=null
else s=!0
s=s&&A.pr(a4,b,c,a0,a1.a,a1.b,a2,a3)}else s=!1
if(s)return
r=a1.a.gA()
q=a1.b*2
if(a3===1){for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.ah(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.kR(h,d)
n=d
o=h}a.$flags&2&&A.c(a)
a[e]=m}}return}if(a3===2){for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.ah(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.kS(h,d)
n=d
o=h}a.$flags&2&&A.c(a)
a[e]=m}}return}for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.ah(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.be(h,d,a3)
n=d
o=h}a.$flags&2&&A.c(a)
a[e]=m}}},
ni(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
if(a3===1){for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.c(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.kR(k,j)
p=j
q=k}a.$flags&2&&A.c(a)
a[l]=o}return}if(a3===2){for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.c(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.kS(k,j)
p=j
q=k}a.$flags&2&&A.c(a)
a[l]=o}return}for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.c(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.be(k,j,a3)
p=j
q=k}a.$flags&2&&A.c(a)
a[l]=o}},
fG:function fG(a,b,c){this.a=a
this.b=b
this.c=c},
fI:function fI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
nv(a,b,c){var s,r,q,p,o=null
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
cl:function cl(a,b){this.a=a
this.b=b},
hX:function hX(a,b,c,d){var _=this
_.a=a
_.b=b
_.d=_.c=0
_.e=c
_.f=d},
fQ:function fQ(a,b,c){this.a=a
this.b=b
this.c=c},
dR:function dR(a){this.a=a},
mS(a,b,c,d,e,f,g,h){return new A.fa(a,b,c,d,e,f,g,g==null||b<2?null:A.kG(a.length,null,!1,t.cn),null)},
no(a){var s,r,q,p=a.length
if(p===1){if(0>=p)return A.a(a,0)
s=a[0]
if(s===0)return $.jg()
if(s===100)return $.je()
if(s===1)return $.m3()}else if(p===2){if(0>=p)return A.a(a,0)
r=a[0]
if(1>=p)return A.a(a,1)
q=a[1]
if(r===0&&q===0)return $.jh()
if(r===100&&q===100)return $.jf()}return A.jJ(a)},
jJ(a){return new A.F(new Float32Array(A.ae(a)),null,!1,$.bs(),!1)},
ej(a){return new A.F(a,null,!1,$.bs(),!1)},
nn(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
nm(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
fM(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.U(s)
if(r>=4096)return 1
q=$.m1()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
fa:function fa(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
fb:function fb(){},
F:function F(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
dw:function dw(a,b){this.a=a
this.b=b},
ka(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.Z)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.o(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.aX(o)){n=o
break A}n=A.v(A.ay("Unsupported raster worker field",null))}l.push(n)}return new A.A(l,m)},
pc(e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1=null
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
p=A.o(r)
if(p){A.j(r)
q=b5[2]
n=typeof q=="string"
if(n){A.D(q)
o=b5[7]
b8=t.p
if(b8.b(o)){b8.a(o)
b9=b5[11]
l=A.aX(b9)
if(l){A.aP(b9)
m=b5[1]
j=A.o(m)
if(j){A.j(m)
k=b5[12]
h=A.o(k)
if(h){A.j(k)
i=b5[8]
f=A.o(i)
if(f){A.j(i)
g=b5[6]
d=A.o(g)
if(d){A.j(g)
e=b5[5]
b=A.o(e)
if(b){A.j(e)
c=b5[10]
a0=A.o(c)
if(a0){A.j(c)
a=b5[3]
a2=A.o(a)
if(a2){A.j(a)
a1=b5[4]
b4=A.o(a1)
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
b7=c5}if(A.o(b5)){if(b7)b5=r
else{r=e2.a[10]
b5=r
b7=c5}A.j(b5)
if(p)b8=q
else{q=e2.a[3]
b8=q
p=c6}if(typeof b8=="string"){if(p)b8=q
else{q=e2.a[3]
b8=q
p=c6}A.D(b8)
c8=e2.a
c9=c8[13]
if(A.o(c9)){A.j(c9)
d0=c8[11]
if(A.o(d0)){A.j(d0)
if(n)d1=o
else{o=c8[8]
d1=o
n=!0}d2=t.p
if(d2.b(d1)){a5=d2.a(n?o:c8[8])
d3=c8[16]
if(A.o(d3)){A.j(d3)
d4=c8[1]
if(A.o(d4)){A.j(d4)
if(l)d1=m
else{m=c8[2]
d1=m
l=!0}if(A.o(d1)){a7=A.j(l?m:c8[2])
if(j)d1=k
else{k=c8[17]
d1=k
j=c7}if(A.o(d1)){if(j)d1=k
else{k=c8[17]
d1=k
j=c7}A.j(d1)
d5=c8[14]
if(A.o(d5)){A.j(d5)
d6=c8[12]
if(A.o(d6)){A.j(d6)
if(h)d2=i
else{i=c8[9]
d2=i
h=!0}if(A.o(d2)){a9=A.j(h?i:c8[9])
if(f)d2=g
else{g=c8[7]
d2=g
f=!0}if(A.o(d2)){b0=A.j(f?g:c8[7])
if(d)d2=e
else{e=c8[6]
d2=e
d=!0}if(A.o(d2)){b1=A.j(d?e:c8[6])
if(b)d2=c
else{c=c8[15]
d2=c
b=!0}if(A.o(d2)){b2=A.j(b?c:c8[15])
if(a0)d2=a
else{a=c8[4]
d2=a
a0=!0}if(A.o(d2)){b3=A.j(a0?a:c8[4])
if(a2)b4=a1
else{a1=c8[5]
b4=a1
a2=!0}b4=A.o(b4)}}}}}c4=d6}c3=d5}a8=d1}}c2=d4}a6=d3}}c1=d0}c0=c9}a4=b8}a3=b5}}}if(b4){b4=[4,a3,a4,c0,c1,a5,a6,c2,a7,a8,c3,c4,a9,b0,b1,b2,b3,A.j(a2?a1:e2.a[5])]
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
b7=c5}d8=A.o(b5)
if(d8){if(b7)b5=r
else{r=e2.c
b5=r
b7=c5}A.j(b5)
d7=e2.b
b4=typeof d7=="string"
a3=b5}}}if(b4){b4=[1,a3,A.D(d8?d7:e2.b)]
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
b7=!0}e0=A.o(b5)
if(e0){a3=A.j(b7?r:e2.c)
d9=e2.b
b4=typeof d9=="string"}}}if(b4){b4=[3,a3,A.D(e0?d9:e2.b)]
break A}a4=e1
b4=!1
if(t.dH.b(e2))if(2===(s?b6:e2.a)){if(p)b5=q
else{q=e2.b
b5=q
p=!0}if(typeof b5=="string"){a4=A.D(p?q:e2.b)
if(j)b4=k
else{k=e2.c
b4=k
j=!0}b4=A.o(b4)}}if(b4){b4=[2,a4,A.j(j?k:e2.c)]
break A}b4=A.v(A.ay("Unsupported raster worker reply",e1))}return A.ka(b4)},
fR:function fR(a){this.a=a},
pw(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.b.D(B.c.U(Math.min(a*c,s)),0,s)},
pz(b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b={},a=A.cm(32,512),a0=A.cm(32,512),a1=A.cm(32,512),a2=A.cm(32,512),a3=A.cm(32,512),a4=t.fM,a5=A.f([],a4),a6=A.f([],a4),a7=A.f([],a4),a8=A.f([],a4),a9=A.f([],a4),b0=A.f([],a4),b1=t.dh,b2=A.f([],b1),b3=A.f([],t.cU),b4=A.f([],b1),b5=A.f([],t.by),b6=t.n,b7=A.f([],b6)
b6=A.f([],b6)
s=new Float64Array(256)
r=t.bU
q=A.f([],r)
p=A.f([],a4)
a4=A.f([],a4)
o=A.f([],r)
r=A.f([],r)
n=A.f([],t.a2)
b1=A.f([],b1)
m=$.k!=null
l=new A.fv(m,new A.an(t.el),a,a0,a1,a2,a3,a5,a6,a7,a8,a9,b0,b2,b3,b4,b5,b7,b6,new A.bv(s),!1,q,p,a4,o,r,n,new A.an(t.gS),new A.an(t.fk),new A.an(t.gj),b1)
a=t.N
k=A.V(a,a)
a0=t.x
a1=t.S
a2=new Uint8Array(32)
a3=new Uint8Array(16)
a4=new Uint8Array(65536)
j=new A.eU(null,A.V(a0,t.g2),A.V(a,t.cJ),A.V(a,a1),A.V(a,a1),A.fe(a),A.V(a0,t.gz),A.fe(a0),A.V(a,t.eY),a2,a3,a4)
a0=new Int32Array(16384)
i=new A.ff(a0,new Uint8Array(131072))
h=new A.fK()
g=A.V(a,t.fW)
f=A.V(a,t.ae)
e=A.V(a,a1)
d=new A.fD()
$.ki()
a=$.jC.$0()
d.a=a
d.b=null
c=A.fo(65536)
b.a=0
b.b=new Uint8Array(0)
b.c=new Uint8Array(0)
b.d=null
a=new A.j2(d)
a0=new A.j1(b,c,h)
a1=new A.j3(c)
a2=new A.j4(b,c,h)
a3=new A.j9(g,e,f)
a4=new A.j6(g,f,j,e,l)
a5=new A.j8(k,b8)
a6=b8.a
new A.cs(a6,A.n(a6).i("cs<1>")).hL(new A.j0(b,j,g,f,e,l,c,b8,new A.j5(g,l,f,e,k),k,a3,a0,a1,h,a4,a2,a5,d,a,i,new A.j7(b8,j,h,a0,c,a3,a2,g,a5,d,l,a,i,a1,a4)))},
j2:function j2(a){this.a=a},
j1:function j1(a,b,c){this.a=a
this.b=b
this.c=c},
j3:function j3(a){this.a=a},
j4:function j4(a,b,c){this.a=a
this.b=b
this.c=c},
j9:function j9(a,b,c){this.a=a
this.b=b
this.c=c},
ja:function ja(a,b){this.a=a
this.b=b},
j6:function j6(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
j5:function j5(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
j8:function j8(a,b){this.a=a
this.b=b},
j7:function j7(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
_.ax=o},
j0:function j0(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1){var _=this
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
_.CW=r
_.cx=s
_.cy=a0
_.db=a1},
po(){var s,r,q=null,p={}
p.a=!1
s=A.u(v.G.self)
p=new A.iV(p,new A.he(new A.cr(q,q,q,q,t.co)))
if(typeof p=="function")A.v(A.ay("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.o4,p)
r[$.jc()]=p
s.onmessage=r},
iU:function iU(a,b){this.a=a
this.b=b},
iV:function iV(a,b){this.a=a
this.b=b},
he:function he(a){this.a=a},
jn(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.bz(b,c,B.b.a0(a.byteLength,s))
return J.ko(B.d.gan(a),a.byteOffset+b*s,(c-b)*s)},
b1(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.bz(b,c,B.b.a0(a.byteLength,s))
return J.cd(J.kp(a),a.byteOffset+b*s,(c-b)*s)},
jL(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.bz(b,c,B.b.a0(a.byteLength,s))-b)*s
if(B.b.N(r,4)!==0)throw A.h(A.ay("The number of bytes to view must be a multiple of 4",null))
return J.mo(J.kp(a),a.byteOffset+b*s,B.b.J(r,4))},
lU(a){return v.mangledGlobalNames[a]},
pf(a){var s=A.nW(a,1)
return s},
nW(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b&65535,e=b>>>16,d=a.length
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
e+=f}f=B.b.N(f,65521)
e=B.b.N(e,65521)}return(e<<16|f)>>>0},
lN(a,b){var s,r,q,p=a.length
if(p>=32)return A.ob(a,b)
b^=4294967295
for(s=p,r=0;s>=8;){q=r+1
if(!(r<p))return A.a(a,r)
b=B.j[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.j[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.j[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.j[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.j[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.j[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.j[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.j[(b^a[q])&255]^b>>>8
s-=8}if(s>0)do{q=r+1
if(!(r<p))return A.a(a,r)
b=B.j[(b^a[r])&255]^b>>>8
if(--s,s>0){r=q
continue}else break}while(!0)
return(b^4294967295)>>>0},
o3(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
ob(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.lH
if(c7==null)c7=$.lH=A.o3(B.j)
s=c8.length
r=J.ko(B.d.gan(c8),c8.byteOffset,s)
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
pa(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.I.hi(a,16777216,!0,!0)
if(s>16777216)throw A.h(B.a_)
return a}},B={}
var w=[A,J,B]
var $={}
A.jv.prototype={}
J.C.prototype={
H(a,b){return a===b},
gZ(a){return A.d5(a)},
v(a){return"Instance of '"+A.e8(a)+"'"},
ga_(a){return A.ca(A.jX(this))}}
J.cQ.prototype={
v(a){return String(a)},
bP(a,b){return b||a},
gZ(a){return a?519018:218159},
ga_(a){return A.ca(t.y)},
$iE:1,
$iq:1}
J.cS.prototype={
H(a,b){return null==b},
v(a){return"null"},
gZ(a){return 0},
$iE:1,
$ia3:1}
J.U.prototype={$iL:1}
J.bw.prototype={
gZ(a){return 0},
v(a){return String(a)}}
J.e7.prototype={}
J.cp.prototype={}
J.aB.prototype={
v(a){var s=a[$.lX()]
if(s==null)s=a[$.jc()]
if(s==null)return this.eI(a)
return"JavaScript function for "+J.bK(s)},
$ibM:1}
J.bO.prototype={
gZ(a){return 0},
v(a){return String(a)}}
J.bP.prototype={
gZ(a){return 0},
v(a){return String(a)}}
J.x.prototype={
k(a,b){A.a4(a).c.a(b)
a.$flags&1&&A.c(a,29)
a.push(b)},
a4(a,b){var s
A.a4(a).i("m<1>").a(b)
a.$flags&1&&A.c(a,"addAll",2)
if(Array.isArray(b)){this.eZ(a,b)
return}for(s=J.ce(b);s.t();)a.push(s.gC())},
eZ(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.h(A.aJ(a))
for(r=0;r<s;++r)a.push(b[r])},
j(a){a.$flags&1&&A.c(a,"clear","clear")
a.length=0},
aN(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
eG(a,b,c){var s=a.length
if(b>s)throw A.h(A.as(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.h(A.as(c,b,s,"end",null))
if(b===c)return A.f([],A.a4(a))
return A.f(a.slice(b,c),A.a4(a))},
ga7(a){if(a.length>0)return a[0]
throw A.h(A.af())},
gaA(a){var s=a.length
if(s>0)return a[s-1]
throw A.h(A.af())},
gai(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.h(A.af())
throw A.h(A.jt())},
aS(a,b,c){a.$flags&1&&A.c(a,18)
A.bz(b,c,a.length)
a.splice(b,c-b)},
ag(a,b,c,d){var s
a.$flags&2&&A.c(a,"fillRange")
A.bz(b,c,a.length)
A.a4(a).c.a(d)
for(s=b;s<c;++s)a[s]=d},
az(a,b){var s,r
A.a4(a).i("q(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.h(A.aJ(a))}return!1},
af(a,b){var s,r
A.a4(a).i("q(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.h(A.aJ(a))}return!0},
au(a,b){var s,r,q,p,o,n=A.a4(a)
n.i("b(1,1)?").a(b)
a.$flags&2&&A.c(a,"sort")
s=a.length
if(s<2)return
if(b==null)b=J.os()
if(s===2){r=a[0]
q=a[1]
n=b.$2(r,q)
if(typeof n!=="number")return n.cG()
if(n>0){a[0]=q
a[1]=r}return}p=0
if(n.c.b(null))for(o=0;o<a.length;++o)if(a[o]===void 0){a[o]=null;++p}a.sort(A.cH(b,2))
if(p>0)this.fX(a,p)},
eE(a){return this.au(a,null)},
fX(a,b){var s,r=a.length
for(;s=r-1,r>0;r=s)if(a[s]===null){a[s]=void 0;--b
if(b===0)break}},
gP(a){return a.length===0},
gaR(a){return a.length!==0},
v(a){return A.ju(a,"[","]")},
gE(a){return new J.bL(a,a.length,A.a4(a).i("bL<1>"))},
gZ(a){return A.d5(a)},
gm(a){return a.length},
sm(a,b){a.$flags&1&&A.c(a,"set length","change the length of")
if(b<0)throw A.h(A.as(b,0,null,"newLength",null))
if(b>a.length)A.a4(a).c.a(null)
a.length=b},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.h(A.eQ(a,b))
return a[b]},
n(a,b,c){A.a4(a).c.a(c)
a.$flags&2&&A.c(a)
if(!(b>=0&&b<a.length))throw A.h(A.eQ(a,b))
a[b]=c},
$ir:1,
$im:1,
$iw:1}
J.dW.prototype={
i5(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.e8(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.f7.prototype={}
J.bL.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.Z(q)
throw A.h(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$iaa:1}
J.ch.prototype={
a6(a,b){var s
A.dF(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gcv(b)
if(this.gcv(a)===s)return 0
if(this.gcv(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gcv(a){return a===0?1/a<0:a<0},
L(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.h(A.bB(""+a+".toInt()"))},
Y(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.h(A.bB(""+a+".ceil()"))},
U(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.h(A.bB(""+a+".floor()"))},
F(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.h(A.bB(""+a+".round()"))},
eq(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
D(a,b,c){if(this.a6(b,c)>0)throw A.h(A.iK(b))
if(this.a6(a,b)<0)return b
if(this.a6(a,c)>0)return c
return a},
v(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gZ(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
N(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a0(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dI(a,b)},
J(a,b){return(a|0)===a?a/b|0:this.dI(a,b)},
dI(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.h(A.bB("Result of truncating division is "+A.z(s)+": "+A.z(a)+" ~/ "+b))},
ab(a,b){if(b<0)throw A.h(A.iK(b))
return b>31?0:a<<b>>>0},
dA(a,b){return b>31?0:a<<b>>>0},
I(a,b){var s
if(a>0)s=this.cb(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
cb(a,b){return b>31?0:a>>>b},
eC(a,b){if(b<0)throw A.h(A.iK(b))
return this.dB(a,b)},
dB(a,b){if(b>31)return 0
return a>>>b},
ga_(a){return A.ca(t.q)},
$ib6:1,
$ii:1,
$iaw:1}
J.cR.prototype={
aT(a,b){var s=this.ab(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
ga_(a){return A.ca(t.S)},
$iE:1,
$ib:1}
J.dX.prototype={
ga_(a){return A.ca(t.i)},
$iE:1}
J.bN.prototype={
eF(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bS(a,b,c){return a.substring(b,A.bz(b,c,a.length))},
eH(a,b){return this.bS(a,b,null)},
i2(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.mQ(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.mR(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
ac(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.h(B.P)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
a6(a,b){var s
A.D(b)
if(a===b)s=0
else s=a<b?-1:1
return s},
v(a){return a},
gZ(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
ga_(a){return A.ca(t.N)},
gm(a){return a.length},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.h(A.eQ(a,b))
return a[b]},
$iE:1,
$ib6:1,
$ifr:1,
$ip:1}
A.b8.prototype={
v(a){return"LateInitializationError: "+this.a}}
A.iX.prototype={
$0(){var s=new A.M($.G,t.U)
s.bV(null)
return s},
$S:30}
A.fB.prototype={}
A.r.prototype={}
A.ab.prototype={
gE(a){var s=this
return new A.bS(s,s.gm(s),A.n(s).i("bS<ab.E>"))},
gP(a){return this.gm(this)===0},
ej(a,b,c){var s=A.n(this)
return new A.a_(this,s.V(c).i("1(ab.E)").a(b),s.i("@<ab.E>").V(c).i("a_<1,2>"))}}
A.bS.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s,r=this,q=r.a,p=J.W(q),o=p.gm(q)
if(r.b!==o)throw A.h(A.aJ(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.aN(q,s);++r.c
return!0},
$iaa:1}
A.bT.prototype={
gE(a){return new A.cU(J.ce(this.a),this.b,A.n(this).i("cU<1,2>"))},
gm(a){return J.aI(this.a)},
gP(a){return J.eT(this.a)}}
A.cN.prototype={$ir:1}
A.cU.prototype={
t(){var s=this,r=s.b
if(r.t()){s.a=s.c.$1(r.gC())
return!0}s.a=null
return!1},
gC(){var s=this.a
return s==null?this.$ti.y[1].a(s):s},
$iaa:1}
A.a_.prototype={
gm(a){return J.aI(this.a)},
aN(a,b){return this.b.$1(J.mr(this.a,b))}}
A.bX.prototype={
gE(a){return new A.dc(J.ce(this.a),this.b,this.$ti.i("dc<1>"))}}
A.dc.prototype={
t(){var s,r
for(s=this.a,r=this.b;s.t();)if(r.$1(s.gC()))return!0
return!1},
gC(){return this.a.gC()},
$iaa:1}
A.T.prototype={
dP(a,b){return A.v(A.bB("Cannot "+b+" a fixed-length list"))},
sm(a,b){this.dP(a,"change the length of")},
k(a,b){A.br(a).i("T.E").a(b)
return this.dP(a,"add to")}}
A.dl.prototype={$r:"+(1)",$s:1}
A.cw.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:18}
A.dm.prototype={$r:"+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(1,2,3,4,5,6,7,8,9,10)",$s:19}
A.dn.prototype={$r:"+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(1,2,3,4,5,6,7,8,9,10,11,12)",$s:21}
A.cx.prototype={$r:"+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13)",$s:22}
A.dp.prototype={$r:"+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)",$s:23}
A.A.prototype={$r:"+(1,2)",$s:2}
A.cy.prototype={$r:"+calls,copiedBytes(1,2)",$s:3}
A.dq.prototype={$r:"+lastTouch,requiredFrames(1,2)",$s:4}
A.aM.prototype={$r:"+(1,2,3)",$s:5}
A.dr.prototype={$r:"+contentKey,requestId(1,2,3)",$s:6}
A.cz.prototype={$r:"+entryKey,workerRamBytes(1,2,3)",$s:7}
A.c3.prototype={$r:"+message,requestId(1,2,3)",$s:8}
A.cA.prototype={$r:"+requestId,workerRamBytes(1,2,3)",$s:9}
A.aN.prototype={$r:"+(1,2,3,4)",$s:12}
A.ds.prototype={$r:"+bytes,contentKey,useSimd(1,2,3,4)",$s:13}
A.dt.prototype={$r:"+(1,2,3,4,5)",$s:14}
A.cB.prototype={$r:"+compressedBytes,crc31,entryDiskBytes,fpHi,fpLo(1,2,3,4,5)",$s:16}
A.du.prototype={$r:"+deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes(1,2,3,4,5)",$s:15}
A.bF.prototype={$r:"+(1,2,3,4,5,6)",$s:17}
A.df.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$iaa:1}
A.cM.prototype={
k(a,b){A.n(this).c.a(b)
A.mF()}}
A.S.prototype={
gm(a){return this.b},
gP(a){return this.b===0},
gE(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.df(s,s.length,r.$ti.i("df<1>"))},
ao(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.ft.prototype={
$0(){return B.c.U(1000*this.a.now())},
$S:3}
A.d8.prototype={}
A.fN.prototype={
ap(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.d4.prototype={
v(a){return"Null check operator used on a null value"}}
A.dZ.prototype={
v(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.el.prototype={
v(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.fq.prototype={
v(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cO.prototype={}
A.dx.prototype={
v(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iaF:1}
A.bt.prototype={
v(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.lV(r==null?"unknown":r)+"'"},
$ibM:1,
gi8(){return this},
$C:"$1",
$R:1,
$D:null}
A.dM.prototype={$C:"$0",$R:0}
A.dN.prototype={$C:"$2",$R:2}
A.eh.prototype={}
A.ed.prototype={
v(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.lV(s)+"'"}}
A.cg.prototype={
H(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.cg))return!1
return this.$_target===b.$_target&&this.a===b.a},
gZ(a){return(A.iY(this.a)^A.d5(this.$_target))>>>0},
v(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.e8(this.a)+"'")}}
A.eb.prototype={
v(a){return"RuntimeError: "+this.a}}
A.eG.prototype={
v(a){return"Assertion failed: Reached dead code"}}
A.b7.prototype={
gm(a){return this.a},
gP(a){return this.a===0},
gaR(a){return this.a!==0},
gaj(){return new A.I(this,A.n(this).i("I<1>"))},
ge8(){return new A.b9(this,A.n(this).i("b9<1,2>"))},
aF(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.hF(a)},
hF(a){var s=this.d
if(s==null)return!1
return this.ba(this.d6(s,a),a)>=0},
a4(a,b){A.n(this).i("aj<1,2>").a(b).aQ(0,new A.f8(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hG(b)},
hG(a){var s,r,q=this.d
if(q==null)return null
s=this.d6(q,a)
r=this.ba(s,a)
if(r<0)return null
return s[r].b},
n(a,b,c){var s,r,q,p,o,n,m=this,l=A.n(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cO(s==null?m.b=m.c2():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cO(r==null?m.c=m.c2():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.c2()
p=m.bH(b)
o=q[p]
if(o==null)q[p]=[m.bU(b,c)]
else{n=m.ba(o,b)
if(n>=0)o[n].b=c
else o.push(m.bU(b,c))}}},
en(a,b){var s,r,q=this,p=A.n(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aF(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.n(0,a,r)
return r},
u(a,b){var s=this
if(typeof b=="string")return s.cP(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cP(s.c,b)
else return s.hH(b)},
hH(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bH(a)
r=n[s]
q=o.ba(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.cQ(p)
if(r.length===0)delete n[s]
return p.b},
j(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bT()}},
aQ(a,b){var s,r,q=this
A.n(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.h(A.aJ(q))
s=s.c}},
cO(a,b,c){var s,r=A.n(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bU(b,c)
else s.b=c},
cP(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.cQ(s)
delete a[b]
return s.b},
bT(){this.r=this.r+1&1073741823},
bU(a,b){var s=this,r=A.n(s),q=new A.fd(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bT()
return q},
cQ(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bT()},
bH(a){return J.ax(a)&1073741823},
d6(a,b){return a[this.bH(b)]},
ba(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1},
v(a){return A.kI(this)},
c2(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ijx:1}
A.f8.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.n(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.n(this.a).i("~(1,2)")}}
A.fd.prototype={}
A.I.prototype={
gm(a){return this.a.a},
gP(a){return this.a.a===0},
gE(a){var s=this.a
return new A.bQ(s,s.r,s.e,this.$ti.i("bQ<1>"))}}
A.bQ.prototype={
gC(){return this.d},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.h(A.aJ(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$iaa:1}
A.bR.prototype={
gm(a){return this.a.a},
gP(a){return this.a.a===0},
gE(a){var s=this.a
return new A.aD(s,s.r,s.e,this.$ti.i("aD<1>"))}}
A.aD.prototype={
gC(){return this.d},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.h(A.aJ(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$iaa:1}
A.b9.prototype={
gm(a){return this.a.a},
gP(a){return this.a.a===0},
gE(a){var s=this.a
return new A.cT(s,s.r,s.e,this.$ti.i("cT<1,2>"))}}
A.cT.prototype={
gC(){var s=this.d
s.toString
return s},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.h(A.aJ(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.aK(s.a,s.b,r.$ti.i("aK<1,2>"))
r.c=s.c
return!0}},
$iaa:1}
A.an.prototype={
bH(a){return A.iY(a)&1073741823},
ba(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.iP.prototype={
$1(a){return this.a(a)},
$S:21}
A.iQ.prototype={
$2(a,b){return this.a(a,b)},
$S:71}
A.iR.prototype={
$1(a){return this.a(A.D(a))},
$S:78}
A.K.prototype={
v(a){return this.dL(!1)},
dL(a){var s,r,q,p,o,n=this.fj(),m=this.b3(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.kN(o):l+A.z(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
fj(){var s,r=this.$s
while($.i0.length<=r)B.a.k($.i0,null)
s=$.i0[r]
if(s==null){s=this.f7()
B.a.n($.i0,r,s)}return s},
f7(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.f(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.a.n(k,q,r[s])}}k=A.mW(k,!1,t.K)
k.$flags=3
return k}}
A.bE.prototype={
b3(){return[this.a,this.b]},
H(a,b){if(b==null)return!1
return b instanceof A.bE&&this.$s===b.$s&&J.l(this.a,b.a)&&J.l(this.b,b.b)},
gZ(a){return A.e5(this.$s,this.a,this.b,B.m)}}
A.cv.prototype={
b3(){return[this.a]},
H(a,b){if(b==null)return!1
return b instanceof A.cv&&this.$s===b.$s&&J.l(this.a,b.a)},
gZ(a){return A.e5(this.$s,this.a,B.m,B.m)}}
A.b3.prototype={
b3(){return[this.a,this.b,this.c]},
H(a,b){var s=this
if(b==null)return!1
return b instanceof A.b3&&s.$s===b.$s&&J.l(s.a,b.a)&&J.l(s.b,b.b)&&J.l(s.c,b.c)},
gZ(a){var s=this
return A.e5(s.$s,s.a,s.b,s.c)}}
A.al.prototype={
b3(){return this.a},
H(a,b){if(b==null)return!1
return b instanceof A.al&&this.$s===b.$s&&A.nG(this.a,b.a)},
gZ(a){return A.e5(this.$s,A.n3(this.a),B.m,B.m)}}
A.dY.prototype={
v(a){return"RegExp/"+this.a+"/"+this.b.flags},
gfA(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.kE(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
eb(a){var s=this.b.exec(a)
if(s==null)return null
return new A.dg(s)},
dV(a,b){return new A.en(this,b,0)},
fh(a,b){var s,r=this.gfA()
if(r==null)r=A.aW(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.dg(s)},
$ifr:1,
$inc:1}
A.dg.prototype={
h(a,b){var s
A.j(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$ie9:1}
A.en.prototype={
gE(a){return new A.cq(this.a,this.b,this.c)}}
A.cq.prototype={
gC(){var s=this.d
return s==null?t.d.a(s):s},
t(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.fh(l,s)
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
$iaa:1}
A.h_.prototype={
aw(){var s=this.b
if(s===this)throw A.h(new A.b8("Local '' has not been initialized."))
return s},
sea(a){if(this.b!==this)throw A.h(new A.b8("Local '' has already been initialized."))
this.b=a}}
A.bx.prototype={
ga_(a){return B.b7},
bD(a,b,c){A.c5(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dY(a){return this.bD(a,0,null)},
dX(a,b,c){A.c5(a,b,c)
if(c==null)c=B.b.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dW(a,b,c){A.c5(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iE:1,
$ibx:1}
A.ci.prototype={$ici:1}
A.d1.prototype={
gan(a){if(((a.$flags|0)&2)!==0)return new A.ib(a.buffer)
else return a.buffer},
fv(a,b,c,d){var s=A.as(b,0,c,d,null)
throw A.h(s)},
cW(a,b,c,d){if(b>>>0!==b||b>c)this.fv(a,b,c,d)},
$iX:1}
A.ib.prototype={
bD(a,b,c){var s=A.jz(this.a,b,c)
s.$flags=3
return s},
dY(a){return this.bD(0,0,null)},
dX(a,b,c){var s=A.jy(this.a,b,c)
s.$flags=3
return s},
dW(a,b,c){var s=A.n_(this.a,b,c)
s.$flags=3
return s}}
A.e1.prototype={
ga_(a){return B.b8},
$iE:1}
A.ag.prototype={
gm(a){return a.length},
dz(a,b,c,d,e){var s,r,q=a.length
this.cW(a,b,q,"start")
this.cW(a,c,q,"end")
if(b>c)throw A.h(A.as(b,0,c,null,null))
s=c-b
if(e<0)throw A.h(A.ay(e,null))
r=d.length
if(r-e<s)throw A.h(A.au("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaC:1}
A.d_.prototype={
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
n(a,b,c){A.a0(c)
a.$flags&2&&A.c(a)
A.bp(b,a,a.length)
a[b]=c},
O(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.c(a,5)
this.dz(a,b,c,d,e)
return},
B(a,b,c,d){return this.O(a,b,c,d,0)},
$ir:1,
$im:1,
$iw:1}
A.d0.prototype={
n(a,b,c){A.j(c)
a.$flags&2&&A.c(a)
A.bp(b,a,a.length)
a[b]=c},
O(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.c(a,5)
this.dz(a,b,c,d,e)
return},
B(a,b,c,d){return this.O(a,b,c,d,0)},
$ir:1,
$im:1,
$iw:1}
A.cj.prototype={
ga_(a){return B.b9},
$iE:1,
$icj:1,
$ibu:1}
A.cW.prototype={
ga_(a){return B.ba},
$iE:1,
$if_:1}
A.e3.prototype={
ga_(a){return B.bb},
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
$iE:1}
A.cX.prototype={
ga_(a){return B.bc},
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
$iE:1,
$ijr:1}
A.cZ.prototype={
ga_(a){return B.bd},
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
$iE:1,
$ijs:1}
A.e4.prototype={
ga_(a){return B.bf},
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
$iE:1,
$ijK:1}
A.d2.prototype={
ga_(a){return B.bg},
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
$iE:1,
$ifP:1}
A.d3.prototype={
ga_(a){return B.bh},
gm(a){return a.length},
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
$iE:1}
A.bU.prototype={
ga_(a){return B.bi},
gm(a){return a.length},
h(a,b){A.j(b)
A.bp(b,a,a.length)
return a[b]},
$iE:1,
$ibU:1,
$iaR:1}
A.ck.prototype={
cM(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.jd()
k.$flags&2&&A.c(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.ck(s,r,q,k[0])},
v(a){return"V128"},
$imI:1}
A.dh.prototype={}
A.di.prototype={}
A.dj.prototype={}
A.dk.prototype={}
A.aQ.prototype={
i(a){return A.dE(v.typeUniverse,this,a)},
V(a){return A.ld(v.typeUniverse,this,a)}}
A.ex.prototype={}
A.i9.prototype={
v(a){return A.ao(this.a,null)}}
A.eu.prototype={
v(a){return this.a}}
A.cC.prototype={$ibg:1}
A.fW.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:8}
A.fV.prototype={
$1(a){var s,r
this.a.a=t.O.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:41}
A.fX.prototype={
$0(){this.a.$0()},
$S:9}
A.fY.prototype={
$0(){this.a.$0()},
$S:9}
A.i6.prototype={
eM(a,b){if(self.setTimeout!=null)self.setTimeout(A.cH(new A.i7(this,b),0),a)
else throw A.h(A.bB("`setTimeout()` not found."))}}
A.i7.prototype={
$0(){this.b.$0()},
$S:0}
A.eo.prototype={}
A.ik.prototype={
$1(a){return this.a.$2(0,a)},
$S:6}
A.il.prototype={
$2(a,b){this.a.$2(1,new A.cO(a,t.l.a(b)))},
$S:25}
A.iJ.prototype={
$2(a,b){this.a(A.j(a),b)},
$S:31}
A.az.prototype={
v(a){return A.z(this.a)},
$iO:1,
gb2(){return this.b}}
A.es.prototype={
e4(a){var s=this.a
if((s.a&30)!==0)throw A.h(A.au("Future already completed"))
s.bn(A.or(a,null))}}
A.dd.prototype={}
A.bi.prototype={
hO(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.bB(s,t.al.a(this.d),a.a,t.y,t.K)},
hB(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.h_(l,q,m,a.b,o,n,t.l)
else p=l.bB(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.k.b(A.am(s))){if((r.c&1)!==0)throw A.h(A.ay("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.h(A.ay("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.M.prototype={
cB(a,b,c){var s,r,q,p=this.$ti
p.V(c).i("1/(2)").a(a)
s=$.G
if(s===B.i){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.h(A.ks(b,"onError",u.c))}else{r=p.c
a=s.bz(s,c.i("@<0/>").V(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.oN(b,s)}q=new A.M(s,c.i("M<0>"))
r=b==null?1:3
this.bm(new A.bi(q,r,a,b,p.i("@<1>").V(c).i("bi<1,2>")))
return q},
dJ(a,b,c){var s,r=this.$ti
r.V(c).i("1/(2)").a(a)
s=new A.M($.G,c.i("M<0>"))
this.bm(new A.bi(s,19,a,b,r.i("@<1>").V(c).i("bi<1,2>")))
return s},
cD(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.G
q=new A.M(r,s)
if(r!==B.i)a=r.by(r,a,t.z)
this.bm(new A.bi(q,8,a,null,s.i("bi<1,1>")))
return q},
h0(a){this.a=this.a&1|16
this.c=a},
bo(a){this.a=a.a&30|this.a&1
this.c=a.c},
bm(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.bm(a)
return}r.bo(s)}q=r.b
q.b6(q,new A.hz(r,a))}},
dr(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.dr(a)
return}m.bo(n)}l.a=m.bA(a)
s=m.b
s.b6(s,new A.hD(l,m))}},
b5(){var s=t.F.a(this.c)
this.c=null
return this.bA(s)},
bA(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
cZ(a){var s,r=this
r.$ti.c.a(a)
s=r.b5()
r.a=8
r.c=a
A.c0(r,s)},
f6(a){var s=this.b5()
this.bo(a)
A.c0(this,s)},
bp(a){var s=this.b5()
this.h0(a)
A.c0(this,s)},
f5(a,b){A.aW(a)
t.l.a(b)
this.bp(new A.az(a,b))},
bV(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("aA<1>").b(a)){this.cV(a)
return}this.f1(a)},
f1(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.b6(s,new A.hB(r,a))},
cV(a){A.jN(this.$ti.i("aA<1>").a(a),this,!1)
return},
bn(a){var s
this.a^=2
s=this.b
s.b6(s,new A.hA(this,a))},
$iaA:1}
A.hz.prototype={
$0(){A.c0(this.a,this.b)},
$S:0}
A.hD.prototype={
$0(){A.c0(this.b,this.a.a)},
$S:0}
A.hC.prototype={
$0(){A.jN(this.a.a,this.b,!0)},
$S:0}
A.hB.prototype={
$0(){this.a.cZ(this.b)},
$S:0}
A.hA.prototype={
$0(){this.a.bp(this.b)},
$S:0}
A.hG.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bC(p,t.fO.a(q.d),t.z)}catch(o){s=A.am(o)
r=A.bq(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.jl(q)
n=k.a
n.c=new A.az(q,p)
q=n}q.b=!0
return}if(j instanceof A.M&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.M){m=k.b.a
l=new A.M(m.b,m.$ti)
j.cB(new A.hH(l,m),new A.hI(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.hH.prototype={
$1(a){this.a.f6(this.b)},
$S:8}
A.hI.prototype={
$2(a,b){A.aW(a)
t.l.a(b)
this.a.bp(new A.az(a,b))},
$S:43}
A.hF.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.bB(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.am(k)
r=A.bq(k)
q=s
p=r
if(p==null)p=A.jl(q)
o=this.a
o.c=new A.az(q,p)
o.b=!0}},
$S:0}
A.hE.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.hO(s)&&p.a.e!=null){p.c=p.a.hB(s)
p.b=!1}}catch(o){r=A.am(o)
q=A.bq(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.jl(p)
m=l.b
m.c=new A.az(p,n)
p=m}p.b=!0}},
$S:0}
A.ep.prototype={}
A.da.prototype={
gm(a){var s={},r=new A.M($.G,t.fJ)
s.a=0
this.ei(new A.fE(s,this),!0,new A.fF(s,r),r.gf4())
return r}}
A.fE.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.fF.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.b5()
r.c.a(q)
s.a=8
s.c=q
A.c0(s,p)},
$S:0}
A.dy.prototype={
gfL(){var s,r=this
if((r.b&8)===0)return A.n(r).i("aT<1>?").a(r.a)
s=A.n(r)
return s.i("aT<1>?").a(s.i("dz<1>").a(r.a).gcj())},
d3(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aT(A.n(q).i("aT<1>"))
return A.n(q).i("aT<1>").a(s)}r=A.n(q)
s=r.i("dz<1>").a(q.a).gcj()
return r.i("aT<1>").a(s)},
gdF(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gcj()
return A.n(this).i("ct<1>").a(s)},
cU(){if((this.b&4)!==0)return new A.bA("Cannot add event after closing")
return new A.bA("Cannot add event while adding a stream")},
d2(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.kg():new A.M($.G,t.U)
return s},
cm(){var s=this,r=s.b
if((r&4)!==0)return s.d2()
if(r>=4)throw A.h(s.cU())
r=s.b=r|4
if((r&1)!==0)s.ca()
else if((r&3)===0)s.d3().k(0,B.A)
return s.d2()},
h4(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.n(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.h(A.au("Stream has already been listened to."))
s=h.c
r=$.G
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.bz(r,t.a7.V(s).i("1(2)").a(a),o,s)
A.nu(r,b)
n=c==null?A.p2():c
m=t.O
l=new A.ct(i,s,r.by(r,m.a(n),o),r,q|p,h.i("ct<1>"))
k=i.gfL()
if(((i.b|=1)&8)!==0){j=h.i("dz<1>").a(i.a)
j.scj(l)
j.hY()}else i.a=l
l.h1(k)
h=m.a(new A.i3(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cX((s&4)!==0)
return l},
fR(a){var s,r,q,p,o,n,m,l,k=this,j=A.n(k)
j.i("ee<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("dz<1>").a(k.a).ic()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.M)s=q}catch(n){p=A.am(n)
o=A.bq(n)
m=new A.M($.G,t.U)
j=A.aW(p)
l=t.l.a(o)
m.bn(new A.az(j,l))
s=m}else s=s.cD(r)
j=new A.i2(k)
if(s!=null)s=s.cD(j)
else j.$0()
return s},
$ikP:1,
$il7:1,
$ic_:1,
$ifC:1}
A.i3.prototype={
$0(){A.k3(this.a.d)},
$S:0}
A.i2.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bV(null)},
$S:0}
A.eq.prototype={
c9(a){var s=this.$ti
s.c.a(a)
this.gdF().cT(new A.bZ(a,s.i("bZ<1>")))},
ca(){this.gdF().cT(B.A)}}
A.cr.prototype={}
A.cs.prototype={
gZ(a){return(A.d5(this.a)^892482866)>>>0},
H(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.cs&&b.a===this.a}}
A.ct.prototype={
dk(){return this.w.fR(this)},
dl(){var s=this.w,r=A.n(s)
r.i("ee<1>").a(this)
if((s.b&8)!==0)r.i("dz<1>").a(s.a).ii()
A.k3(s.e)},
dm(){var s=this.w,r=A.n(s)
r.i("ee<1>").a(this)
if((s.b&8)!==0)r.i("dz<1>").a(s.a).hY()
A.k3(s.f)}}
A.de.prototype={
h1(a){var s=this
A.n(s).i("aT<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bQ(s)}},
dl(){},
dm(){},
dk(){return null},
cT(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aT(A.n(r).i("aT<1>"))
q.k(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bQ(r)}},
c9(a){var s,r=this,q=A.n(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.i_(r.a,a,q)
r.e&=4294967231
r.cX((s&4)!==0)},
ca(){var s,r=this,q=new A.fZ(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.dk()
r.e|=16
if(p!=null&&p!==$.kg())p.cD(q)
else q.$0()},
cX(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=p&4294967167
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p&=4294967291
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=p^64
if(r)q.dl()
else q.dm()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bQ(q)},
$iee:1,
$ic_:1}
A.fZ.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.hZ(s.c)
s.e&=4294967231},
$S:0}
A.dA.prototype={
ei(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.h4(s.i("~(1)?").a(a),d,c,b===!0)},
hL(a){return this.ei(a,null,null,null)}}
A.bD.prototype={
sbc(a){this.a=t.ev.a(a)},
gbc(){return this.a}}
A.bZ.prototype={
el(a){this.$ti.i("c_<1>").a(a).c9(this.b)}}
A.et.prototype={
el(a){a.ca()},
gbc(){return null},
sbc(a){throw A.h(A.au("No events after a done."))},
$ibD:1}
A.aT.prototype={
bQ(a){var s,r=this
r.$ti.i("c_<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.px(new A.i_(r,a))
r.a=1},
k(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sbc(b)
s.c=b}}}
A.i_.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("c_<1>").a(this.b)
r=p.b
q=r.gbc()
p.b=q
if(q==null)p.c=null
r.el(s)},
$S:0}
A.eD.prototype={}
A.fT.prototype={
hZ(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.bC(o,a,t.H)
return q}catch(p){s=A.am(p)
r=A.bq(p)
o.b4(o,s,r)}},
i_(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.bB(o,a,b,t.H,c)
return q}catch(p){s=A.am(p)
r=A.bq(p)
o.b4(o,s,r)}},
he(a,b){return new A.fU(this,this.by(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.gih(null).h(0,b)
return s}return null},
b4(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.oP(b,c)
return}r=s.gcE()
q=r.gib()
p=$.G
try{$.G=q
s.hA(r,r.gc4(),a,b,c)
$.G=p}catch(m){o=A.am(m)
n=A.bq(m)
$.G=p
l=b===o?c:n
q.b4(r,o,l)}},
bC(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.G
if(r===a)return b.$0()
s=r
$.G=a
try{r=b.$0()
return r}finally{$.G=s}q=null.gcE()
return null.ie(q,q.gc4(),a,b)},
bB(a,b,c,d,e){var s,r,q
d.i("@<0>").V(e).i("1(2)").a(b)
e.a(c)
r=$.G
if(r===a)return b.$1(c)
s=r
$.G=a
try{r=b.$1(c)
return r}finally{$.G=s}q=null.gcE()
return null.hA(q,q.gc4(),a,b,c)},
h_(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").V(f).V(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.G
if(r===a)return b.$2(c,d)
s=r
$.G=a
try{r=b.$2(c,d)
return r}finally{$.G=s}q=null.gcE()
return null.ig(q,q.gc4(),a,b,c,d)},
by(a,b,c){c.i("0()").a(b)
return b},
bz(a,b,c,d){c.i("@<0>").V(d).i("1(2)").a(b)
return b},
c7(a,b,c,d,e){c.i("@<0>").V(d).V(e).i("1(2,3)").a(b)
return b},
ff(a,b,c){return null},
b6(a,b){A.k2(a,t.O.a(b))
return}}
A.fU.prototype={
$0(){var s=this.a
return s.bC(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.iw.prototype={
$0(){A.mH(this.a,this.b)},
$S:0}
A.bk.prototype={
gE(a){var s=this,r=new A.bl(s,s.r,A.n(s).i("bl<1>"))
r.c=s.e
return r},
gm(a){return this.a},
gP(a){return this.a===0},
ao(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.f8(b)},
f8(a){var s=this.d
if(s==null)return!1
return this.bw(s[this.bq(a)],a)>=0},
ga7(a){var s=this.e
if(s==null)throw A.h(A.au("No elements"))
return A.n(this).c.a(s.a)},
k(a,b){var s,r,q=this
A.n(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cS(s==null?q.b=A.jP():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cS(r==null?q.c=A.jP():r,b)}else return q.eY(b)},
eY(a){var s,r,q,p=this
A.n(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.jP()
r=p.bq(a)
q=s[r]
if(q==null)s[r]=[p.c3(a)]
else{if(p.bw(q,a)>=0)return!1
q.push(p.c3(a))}return!0},
u(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.dt(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.dt(s.c,b)
else return s.fT(b)},
fT(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bq(a)
r=n[s]
q=o.bw(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dO(p)
return!0},
fk(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("q(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.h(A.aJ(n))
if(!0===o)n.u(0,r)}},
j(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.c1()}},
cS(a,b){A.n(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.c3(b)
return!0},
dt(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dO(s)
delete a[b]
return!0},
c1(){this.r=this.r+1&1073741823},
c3(a){var s,r=this,q=new A.eB(A.n(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.c1()
return q},
dO(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.c1()},
bq(a){return J.ax(a)&1073741823},
bw(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.c1.prototype={
bq(a){return A.iY(a)&1073741823},
bw(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.eB.prototype={}
A.bl.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.h(A.aJ(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$iaa:1}
A.J.prototype={
gE(a){return new A.bS(a,this.gm(a),A.br(a).i("bS<J.E>"))},
aN(a,b){return this.h(a,b)},
gP(a){return this.gm(a)===0},
gaR(a){return!this.gP(a)},
ga7(a){if(this.gm(a)===0)throw A.h(A.af())
return this.h(a,0)},
gaA(a){if(this.gm(a)===0)throw A.h(A.af())
return this.h(a,this.gm(a)-1)},
gai(a){if(this.gm(a)===0)throw A.h(A.af())
if(this.gm(a)>1)throw A.h(A.jt())
return this.h(a,0)},
az(a,b){var s,r
A.br(a).i("q(J.E)").a(b)
s=this.gm(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gm(a))throw A.h(A.aJ(a))}return!1},
k(a,b){var s
A.br(a).i("J.E").a(b)
s=this.gm(a)
this.sm(a,s+1)
this.n(a,s,b)},
ag(a,b,c,d){var s,r,q=A.br(a)
q.i("J.E?").a(d)
s=d==null?q.i("J.E").a(d):d
A.bz(b,c,this.gm(a))
for(r=b;r<c;++r)this.n(a,r,s)},
v(a){return A.ju(a,"[","]")}}
A.y.prototype={
aQ(a,b){var s,r,q,p=A.n(this)
p.i("~(y.K,y.V)").a(b)
for(s=this.gaj(),s=s.gE(s),p=p.i("y.V");s.t();){r=s.gC()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
a4(a,b){A.n(this).i("aj<y.K,y.V>").a(b).aQ(0,new A.fg(this))},
ge8(){return this.gaj().ej(0,new A.fh(this),A.n(this).i("aK<y.K,y.V>"))},
be(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("q(y.K,y.V)").a(b)
s=A.f([],m.i("x<y.K>"))
for(r=n.gaj(),r=r.gE(r),m=m.i("y.V");r.t();){q=r.gC()
p=n.h(0,q)
if(b.$2(q,p==null?m.a(p):p))B.a.k(s,q)}for(m=s.length,o=0;o<s.length;s.length===m||(0,A.Z)(s),++o)n.u(0,s[o])},
gm(a){var s=this.gaj()
return s.gm(s)},
gP(a){var s=this.gaj()
return s.gP(s)},
gaR(a){var s=this.gaj()
return!s.gP(s)},
v(a){return A.kI(this)},
$iaj:1}
A.fg.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.n(0,r.i("y.K").a(a),r.i("y.V").a(b))},
$S(){return A.n(this.a).i("~(y.K,y.V)")}}
A.fh.prototype={
$1(a){var s=this.a,r=A.n(s)
r.i("y.K").a(a)
s=s.h(0,a)
if(s==null)s=r.i("y.V").a(s)
return new A.aK(a,s,r.i("aK<y.K,y.V>"))},
$S(){return A.n(this.a).i("aK<y.K,y.V>(y.K)")}}
A.fi.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.z(a)
r.a=(r.a+=s)+": "
s=A.z(b)
r.a+=s},
$S:47}
A.bd.prototype={
gP(a){return this.gm(this)===0},
a4(a,b){var s
A.n(this).i("m<1>").a(b)
for(s=b.gE(b);s.t();)this.k(0,s.gC())},
v(a){return A.ju(this,"{","}")},
$ir:1,
$im:1,
$ib0:1}
A.dv.prototype={}
A.ez.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fM(b):s}},
gm(a){return this.b==null?this.c.a:this.aV().length},
gP(a){return this.gm(0)===0},
gaR(a){return this.gm(0)>0},
gaj(){if(this.b==null){var s=this.c
return new A.I(s,A.n(s).i("I<1>"))}return new A.eA(this)},
n(a,b,c){var s,r,q=this
A.D(b)
if(q.b==null)q.c.n(0,b,c)
else if(q.aF(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.dQ().n(0,b,c)},
a4(a,b){t.P.a(b).aQ(0,new A.hS(this))},
aF(a){if(this.b==null)return this.c.aF(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
u(a,b){if(this.b!=null&&!this.aF(b))return null
return this.dQ().u(0,b)},
j(a){var s,r=this
if(r.b==null)r.c.j(0)
else{if(r.c!=null)B.a.j(r.aV())
r.a=r.b=null
s=t.z
r.c=A.V(s,s)}},
aQ(a,b){var s,r,q,p,o=this
t.cA.a(b)
if(o.b==null)return o.c.aQ(0,b)
s=o.aV()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.io(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.h(A.aJ(o))}},
aV(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.f(Object.keys(this.a),t.s)
return s},
dQ(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.V(t.N,t.z)
r=n.aV()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.n(0,o,n.h(0,o))}if(p===0)B.a.k(r,"")
else B.a.j(r)
n.a=n.b=null
return n.c=s},
fM(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.io(this.a[a])
return this.b[a]=s}}
A.hS.prototype={
$2(a,b){this.a.n(0,A.D(a),b)},
$S:18}
A.eA.prototype={
gm(a){return this.a.gm(0)},
aN(a,b){var s=this.a
if(s.b==null)s=s.gaj().aN(0,b)
else{s=s.aV()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gE(a){var s=this.a
if(s.b==null){s=s.gaj()
s=s.gE(s)}else{s=s.aV()
s=new J.bL(s,s.length,A.a4(s).i("bL<1>"))}return s}}
A.id.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:11}
A.ic.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:11}
A.dO.prototype={}
A.dQ.prototype={}
A.e_.prototype={
e6(a,b){var s=A.oJ(a,this.ghp().a)
return s},
ghp(){return B.a8}}
A.f9.prototype={}
A.eH.prototype={
d_(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.bz(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.nU(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.nT(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bX(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.nV(o)
l.b=0
throw A.h(A.P(m,a,p+l.c))}return n},
bX(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.b.J(b+c,2)
r=q.bX(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bX(a,s,c,d)}return q.hj(a,b,c,d)},
hj(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.co(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.d6(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.d6(h)
e.a+=p
break
case 65:p=A.d6(h)
e.a+=p;--d
break
default:p=A.d6(h)
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
p=A.d6(a[l])
e.a+=p}else{p=A.ef(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.d6(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.hf.prototype={
v(a){return this.fe()}}
A.O.prototype={
gb2(){return A.n5(this)}}
A.cK.prototype={
v(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.eZ(s)
return"Assertion failed"}}
A.bg.prototype={}
A.aZ.prototype={
gc_(){return"Invalid argument"+(!this.a?"(s)":"")},
gbZ(){return""},
v(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.z(p),n=s.gc_()+q+o
if(!s.a)return n
return n+s.gbZ()+": "+A.eZ(s.gcs())},
gcs(){return this.b}}
A.bc.prototype={
gcs(){return A.li(this.b)},
gc_(){return"RangeError"},
gbZ(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.z(q):""
else if(q==null)s=": Not greater than or equal to "+A.z(r)
else if(q>r)s=": Not in inclusive range "+A.z(r)+".."+A.z(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.z(r)
return s}}
A.dS.prototype={
gcs(){return A.j(this.b)},
gc_(){return"RangeError"},
gbZ(){if(A.j(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ibc:1,
gm(a){return this.f}}
A.db.prototype={
v(a){return"Unsupported operation: "+this.a}}
A.ek.prototype={
v(a){return"UnimplementedError: "+this.a}}
A.bA.prototype={
v(a){return"Bad state: "+this.a}}
A.dP.prototype={
v(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.eZ(s)+"."}}
A.e6.prototype={
v(a){return"Out of Memory"},
gb2(){return null},
$iO:1}
A.d9.prototype={
v(a){return"Stack Overflow"},
gb2(){return null},
$iO:1}
A.hg.prototype={
v(a){return"Exception: "+this.a}}
A.a2.prototype={
v(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.p.bS(e,0,75)+"..."
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
k=""}return g+l+B.p.bS(e,i,j)+k+"\n"+B.p.ac(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.z(f)+")"):g}}
A.m.prototype={
ej(a,b,c){var s=A.n(this)
return A.mZ(this,s.V(c).i("1(m.E)").a(b),s.i("m.E"),c)},
az(a,b){var s
A.n(this).i("q(m.E)").a(b)
for(s=this.gE(this);s.t();)if(b.$1(s.gC()))return!0
return!1},
gm(a){var s,r=this.gE(this)
for(s=0;r.t();)++s
return s},
gP(a){return!this.gE(this).t()},
gaR(a){return!this.gP(this)},
ga7(a){var s=this.gE(this)
if(!s.t())throw A.h(A.af())
return s.gC()},
gaA(a){var s,r=this.gE(this)
if(!r.t())throw A.h(A.af())
do s=r.gC()
while(r.t())
return s},
gai(a){var s,r=this.gE(this)
if(!r.t())throw A.h(A.af())
s=r.gC()
if(r.t())throw A.h(A.jt())
return s},
aN(a,b){var s,r
A.jD(b,"index")
s=this.gE(this)
for(r=b;s.t();){if(r===0)return s.gC();--r}throw A.h(A.kC(b,b-r,this,"index"))},
v(a){return A.mL(this,"(",")")}}
A.aK.prototype={
v(a){return"MapEntry("+A.z(this.a)+": "+A.z(this.b)+")"}}
A.a3.prototype={
gZ(a){return A.e.prototype.gZ.call(this,0)},
v(a){return"null"}}
A.e.prototype={$ie:1,
H(a,b){return this===b},
gZ(a){return A.d5(this)},
v(a){return"Instance of '"+A.e8(this)+"'"},
ga_(a){return A.iO(this)},
toString(){return this.v(this)}}
A.eE.prototype={
v(a){return""},
$iaF:1}
A.fD.prototype={
gcq(){var s,r=this.b
if(r==null)r=$.jC.$0()
s=r-this.a
if($.ki()===1e6)return s
return s*1000}}
A.co.prototype={
gm(a){return this.a.length},
v(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.fp.prototype={
v(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.f3.prototype={
$2(a,b){var s=t.g
this.a.cB(new A.f1(s.a(a)),new A.f2(s.a(b)),t.X)},
$S:80}
A.f1.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:89}
A.f2.prototype={
$2(a,b){var s=A.oa(A.aW(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:19}
A.iZ.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.v(A.au("Future already completed"))
s.bV(r.i("1/").a(a))
return null},
$S:6}
A.j_.prototype={
$1(a){if(a==null)return this.a.e4(new A.fp(a===undefined))
return this.a.e4(a)},
$S:6}
A.f4.prototype={
hi(a,b,c,d){var s
t.L.a(a)
s=A.jA(32768)
this.hn(A.jq(a,B.o,null,null),s,b,!0,!0)
return s.bg()},
hn(a,b,c,d,e){return A.p9(b,c,new A.f5(a,!0,!0))}}
A.f5.prototype={
$1(a){return B.Q.hm(this.a,a,this.c,this.b)},
$S:20}
A.hJ.prototype={
ho(a,b,c,d,e){var s,r,q=d==null?e:d,p=a.a
a.a=B.o
s=e||q
try{r=A.lP("gzip",e,q,new A.hL(this,a,b,e,!1,s))
return r}finally{a.se_(p)}},
hm(a,b,c,d){return this.ho(a,b,!1,c,d)},
fa(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j=0
for(;;){s=a.c
r=a.d
r===$&&A.H()
if(!(s<r))break
r={}
if(!this.fQ(a,e)){if(j!==0)return!1
a.c=s
return B.R.hl(a,b,!1,c)}q=b.gm(b)
s=r.a=0
if(c){p=new A.ec(new A.em(b),new Uint8Array(65536),B.o)
p.si7(new A.hK(r))}else p=null
o=p==null
n=o?b:p
m=new A.dT(a,n,!0)
m.dc()
if(!o)p.bt()
if(!m.f)return!1
o=a.b
if((o==null?s:o.length-a.c)<8)return!1
l=a.bd()
k=a.bd()
b.ec()
if(B.b.N(b.gm(b)-q,4294967296)!==k)return!1
if(c&&r.a!==l)throw A.h(A.ji("Invalid gzip checksum"));++j}return j!==0},
fQ(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gm(0)<10)return!1
s=a.c
if(a.bK()!==35615)return!1
if(a.aq()!==8)return!1
r=a.aq()
if(b&&(r&224)!==0)return!1
a.bd()
a.aq()
a.aq()
if((r&4)!==0){if(a.gm(0)<2)return!1
q=a.bK()
if(a.gm(0)<q)return!1
a.eo(q)}if((r&8)!==0)if(!this.dC(a))return!1
if((r&16)!==0)if(!this.dC(a))return!1
if((r&2)!==0){if(a.gm(0)<2)return!1
if(b){p=a.bK()
o=a.bR(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.H()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bR(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.lN(i.i0(),n)}if((n&65535)!==p)throw A.h(A.ji("Invalid gzip header checksum"))}else a.bK()}return!0},
dC(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.H()
if(!(s<r))break
r=a.b
r.toString
a.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1}}
A.hL.prototype={
$0(){var s=this
return s.a.fa(s.b,s.c,s.d,s.e,s.f)},
$S:12}
A.hK.prototype={
$1(a){var s=this.a
return s.a=A.lN(a,s.a)},
$S:22}
A.f6.prototype={
eK(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
for(s=0;s<a0;++s){r=a1[s]
if(r>a.b)a.b=r
if(r<a.c)a.c=r}r=a.b
if(r>15)throw A.h(B.T)
q=r+1
p=new Uint16Array(q)
for(o=0;o<a0;++o){n=a1[o]
if(n!==0){if(!(n>=0&&n<q))return A.a(p,n)
m=p[n]
if(!(n<q))return A.a(p,n)
p[n]=m+1}}for(l=1,k=1;k<=r;++k){l=(l<<1>>>0)-p[k]
if(l<0)throw A.h(B.a4)}if(l>0)q=r>(a2?0:1)
else q=!1
if(q)throw A.h(B.a2)
j=B.b.ab(1,r)
r=a.a=new Uint32Array(j)
for(q=a.b,m=a1.length,i=1,h=0,g=2;i<=q;){for(f=i<<16,s=0;s<a0;++s){if(!(s<m))return A.a(a1,s)
if(a1[s]===i){for(e=h,d=0,c=0;c<i;++c){d=(d<<1|e&1)>>>0
e=e>>>1}for(b=(f|s)>>>0,c=d;c<j;c+=g){if(!(c>=0&&c<j))return A.a(r,c)
r[c]=b}++h}}++i
h=h<<1>>>0
g=g<<1>>>0}}}
A.fS.prototype={}
A.ig.prototype={
hl(a,b,c,d){var s,r=d,q=a.a
a.a=B.t
try{s=A.lP("zlib",d,r,new A.ih(this,a,b,d,!1))
return s}finally{a.se_(q)}},
eN(a,b,c,d){var s,r,q,p,o,n,m,l=a.c,k=a.d
k===$&&A.H()
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
if(B.b.N(q*256+p,31)!==0)return!1
if((p>>>5&1)!==0){a.bd()
return!1}l=new A.bV(new Uint8Array(32768),B.o)
o=new A.dT(a,l,!0)
o.dc()
n=o.c.bg()
if(!o.f){b.ah(n)
return!1}l=a.b
if((l==null?0:l.length-a.c)<4){b.ah(n)
return!1}m=a.bd()
if(c)if(m!==A.pf(n)){b.ah(n)
throw A.h(A.ji("Invalid zlib checksum"))}break A}if(n!=null)b.ah(n)
return!0}}
A.ih.prototype={
$0(){var s=this
return s.a.eN(s.b,s.c,s.d,s.e)},
$S:12}
A.em.prototype={
k(a,b){t.L.a(b)
this.a.ah(b)
this.b=this.b+b.length},
$ifC:1}
A.dT.prototype={
gam(){var s=this.a
if(s==null)return s
s.d===$&&A.H()
return s},
dc(){var s,r,q,p=this
p.w=p.r=0
if(p.gam()==null)return
s=p.c
if(!(s instanceof A.bV)){p.d=s
p.c=A.jA(32768)}try{for(;;){r=p.gam()
q=r.c
r=r.d
r===$&&A.H()
if(!(q<r))break
if(!p.fC())return
p.dd(32768)}}finally{p.dd(0)
p.c=s
p.d=null}},
dd(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.bg()
o.ah(A.b1(q,0,r))
p=A.jA(2097152)
p.ah(A.b1(q,r,null))
this.c=p},
fC(){var s,r,q,p=this,o=p.gam()
if(o!=null){s=o.c
r=o.d
r===$&&A.H()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.ad(3)
s=(q&1)===0
switch(B.b.I(q,1)){case 0:if(p.fK()===-1)return!1
break
case 1:if(p.d0($.lZ(),$.lY())===-1)return!1
break
case 2:if(p.fD()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
ad(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gam()
r=s.c
s=s.d
s===$&&A.H()
if(r>=s)return-1
s=o.gam()
r=s.b
r.toString
s=s.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
q=r[s]
s=o.r
r=o.w
o.r=(s|B.b.ab(q,r))>>>0
o.w=r+8}r=o.r
p=B.b.dA(1,a)
o.r=B.b.cb(r,a)
o.w=s-a
return(r&p-1)>>>0},
c6(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.H()
s=a.b
while(m.w<s){r=m.gam()
q=r.c
r=r.d
r===$&&A.H()
if(q>=r)break
r=m.gam()
q=r.b
q.toString
r=r.c++
if(!(r>=0&&r<q.length))return A.a(q,r)
p=q[r]
r=m.r
q=m.w
m.r=(r|B.b.ab(p,q))>>>0
m.w=q+8}r=m.r
q=(r&B.b.ab(1,s)-1)>>>0
if(!(q<l.length))return A.a(l,q)
o=l[q]
n=o>>>16
if(n===0||n>m.w)return-1
m.r=B.b.cb(r,n)
m.w-=n
return o&65535},
fK(){var s,r,q=this
q.w=q.r=0
s=q.ad(16)
if(s!==(q.ad(16)^65535)>>>0)return-1
if(s>q.gam().gm(0))return-1
r=q.gam().eo(s)
q.c.bN(r)
return 0},
fD(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.ad(5)
if(f===-1)return-1
f+=257
if(f>286)return-1
s=g.ad(5)
if(s===-1)return-1;++s
if(s>32)return-1
r=g.ad(4)
if(r===-1)return-1
r+=4
if(r>19)return-1
q=new Uint8Array(19)
for(p=0;p<r;++p){o=g.ad(3)
if(o===-1)return-1
n=B.ac[p]
if(!(n<19))return A.a(q,n)
q[n]=o}m=g.dH(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.cd(B.d.gan(l),0,f)
j=J.cd(B.d.gan(l),f,s)
if(g.ft(n,m,l)===-1)return-1
i=g.dG(k)
n=i==null
h=n?null:g.dG(j)
if(n||h==null)return-1
return g.d0(i,h)},
dH(a,b){var s,r
t.L.a(a)
try{s=A.jp(a,b)
return s}catch(r){if(A.am(r) instanceof A.a2)throw r
else throw r}},
dG(a){return this.dH(a,!1)},
d0(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.c6(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bM(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.E,r)
q=j.ad(B.E[r])
if(q<0)return-1
if(!(r<29))return A.a(B.D,r)
p=B.D[r]
o=j.c6(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.B,o)
n=j.ad(B.B[o])
if(n<0)return-1
m=B.ae[o]+n
if(m>=1){l=j.c
l=m>l.gm(l)}else l=!0
if(l)return-1
j.c.bL(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gam()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.H()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
ft(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.c6(b)
if(q===-1)return-1
p=0
switch(q){case 16:if(r===0)return-1
o=k.ad(2)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.c(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=s}break
case 17:o=k.ad(3)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.c(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
case 18:o=k.ad(7)
if(o===-1)return-1
o+=11
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.c(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
default:if(q<0||q>15)return-1
l=r+1
c.$flags&2&&A.c(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=q
r=l
s=q
break}}return 0}}
A.e0.prototype={
bl(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.h(A.jk("The decoded data is larger than the "+s+" bytes allowed"))}},
gm(a){return this.b.b},
ec(){return null},
bM(a){this.bl(1)
this.b.bM(a)},
b0(a,b){t.L.a(a)
this.bl(a.length)
this.b.b0(a,b)},
ah(a){return this.b0(a,null)},
bN(a){this.bl(a.gm(0))
this.b.bN(a)},
bL(a,b){this.bl(b)
this.b.bL(a,b)},
aD(a,b){return this.b.aD(a,b)},
bj(a){return this.aD(a,null)}}
A.cf.prototype={}
A.cJ.prototype={}
A.dK.prototype={}
A.cL.prototype={
fe(){return"ByteOrder."+this.b}}
A.ec.prototype={
gm(a){return this.c},
b0(a,b){var s
t.L.a(a)
s=A.b1(a,0,a.length)
this.bY(s)},
ah(a){return this.b0(a,null)},
bM(a){var s,r,q,p=this
if(p.r!=null)p.bY(new Uint8Array(A.ae(A.f([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.c(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bt()}},
bN(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.H()
if(!(r<q))break
s=a.hV(o,0,J.aI(o))
r=s
if(typeof r!=="number")return r.i9()
if(r<=0)break
this.bY(A.b1(o,0,s))}}finally{a.c=A.j(p)}},
bY(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bt()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.k(0,new Uint8Array(A.ae(A.b1(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.O(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bt()}},
bt(){var s=this,r=s.f
if(r===0)return
s.b.k(0,new Uint8Array(A.ae(A.b1(s.e,0,r))))
s.f=0},
aD(a,b){return A.v(A.bB("a streamed result cannot be read back"))},
bj(a){return this.aD(a,null)},
si7(a){this.r=t.cy.a(a)}}
A.hd.prototype={}
A.dU.prototype={
gm(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.j(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bR(a,b){var s,r=this,q=r.b
if(q==null)return A.jq(A.f([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.H()
a=s-b}return A.jq(q,r.a,a,b)},
aq(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
hV(a,b,c){var s,r,q,p=this.b
if(p==null)return 0
s=p.length
r=this.c
q=s-r
q=c>q?q:c
if(q<=0)return 0
B.d.O(a,b,b+q,p,r)
this.c+=q
return q},
i0(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gm(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.h(A.as(q,0,r,"position",null))
return J.cd(B.d.gan(n),o.b.byteOffset+o.c,s)}}
A.dV.prototype={
bK(){var s=this.aq(),r=this.aq()
if(this.a===B.t)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
bd(){var s=this,r=s.aq(),q=s.aq(),p=s.aq(),o=s.aq()
if(s.a===B.t)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
eo(a){var s=this,r=s.bR(a,s.c)
s.c=s.c+r.gm(0)
return r},
se_(a){this.a=t.fA.a(a)}}
A.bV.prototype={
ec(){},
bg(){return J.cd(B.d.gan(this.c),this.c.byteOffset,this.b)},
bM(a){var s,r,q=this
if(q.b===q.c.length)q.fi()
s=q.c
r=q.b++
s.$flags&2&&A.c(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
b0(a,b){var s,r,q,p,o=this
t.L.a(a)
b=a.length
while(s=o.b,r=s+b,q=o.c,p=q.length,r>p)o.bv(r-p)
B.d.B(q,s,r,a)
o.b+=b},
ah(a){return this.b0(a,null)},
bN(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bv(s+(q?0:r.length-a.c)-n)}if(!q)B.d.O(o,s,s+a.gm(0),r,a.c)
m.b=m.b+a.gm(0)},
bL(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.bv(r-p)
o=s-a
if(a>=b)B.d.O(q,s,r,q,o)
else for(n=q.$flags|0,m=o;s<r;s=l,m=k){l=s+1
k=m+1
if(!(m>=0&&m<p))return A.a(q,m)
j=q[m]
n&2&&A.c(q)
if(!(s>=0))return A.a(q,s)
q[s]=j}i.b+=b},
aD(a,b){var s=this
if(a<0)a=s.b+a
if(b==null)b=s.b
else if(b<0)b=s.b+b
return J.cd(B.d.gan(s.c),s.c.byteOffset+a,b-a)},
bj(a){return this.aD(a,null)},
bv(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.B(s,0,q,r)
this.c=s},
fi(){return this.bv(null)},
gm(a){return this.b}}
A.by.prototype={
bL(a,b){var s,r=this
for(s=-a;b>a;){r.ah(r.bj(s))
b-=a}if(b===a)r.ah(r.bj(s))
else r.ah(r.aD(s,b-a))},
bg(){return this.aD(0,this.gm(this))}}
A.eC.prototype={}
A.eU.prototype={
ee(a,b){var s,r,q,p,o,n,m,l,k
if(b<=0)return!1
s=this.y.h(0,a)
r=s==null
q=!r
if(q&&s.a>=b)return!0
p=this.dx.h(0,a)
if(p!=null)if(!(p.w&&b===1&&p.y>=1))o=p.x&&p.f===b&&p.y>=b
else o=!0
else o=!1
if(o)return!0
n=r?null:s.a
if(n==null)n=0
r=this.ay
if(r.a!==0)for(o=new A.bQ(r,r.r,r.e,A.n(r).i("bQ<1>"));o.t();)if(o.d.a===a)n+=4
if(n<b)return!1
for(m=0,l=0;l<b;++l){if(!(q&&s.ao(0,l))){o=r.h(0,new A.A(a,B.b.J(l,4)))
if(o==null)o=null
else{k=l-o.c
o=k>=0&&k<4&&o.d[k]!==255}o=o===!0}else o=!0
if(o)++m
else break}return m>=b},
eB(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.cn()
this.a=s},
cJ(){this.fy=0
if(this.fx.length>65536)this.fx=new Uint8Array(65536)},
eu(a,b,c,d,e,f,g,a0){var s,r,q,p,o,n,m,l,k,j,i,h=this
h.db=h.cy=0
s=a0*e*4
if(d<0||d>=g||b.length<s)return!1
r=new A.A(c,B.b.J(d,4))
q=h.ay
p=q.u(0,r)
if(p!=null){q.n(0,r,p)
if(p.a===a0&&p.b===e&&p.ao(0,d)){p.z=++h.ax
p.hU(d,b,a)
if(h.r){o=p.hy(d)
h.cy=o.a
h.db=o.b}return!0}}if(a!=null){a.a=null
a.b=-1}n=new A.A(c,d)
q=h.x
m=q.u(0,n)
if(m!=null){m.f=++h.ax
q.n(0,n,m)
q=m.a
l=q.length
k=m.b
if(h.d1(q,0,l,k,b,s)){if(h.r){j=m.d
if(j===0&&m.e===0){i=A.jm(m.c,q,0,l,k)
q=m.d=i.a
m.e=i.b}else q=j
h.cy=q
h.db=m.e}return!0}h.aK(n)}return!1},
i6(a,b,c,d,e,f,g){return this.eu(null,a,b,c,d,e,f,g)},
em(a,b,c,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=a1*c
if(b<0||b>=a0||d>147456||d<256||e.b<=0)return!1
s=B.b.J(b,4)*4
r=Math.min(s+4,a0)
q=r-s
if(q<2)return!1
p=new A.A(a,B.b.J(s,4))
o=e.ay
if(o.aF(p)||e.ch.ao(0,p))return!1
n=A.f([],t.t)
for(m=e.x,l=s,k=0;l<r;++l){j=m.h(0,new A.A(a,l))
if(j!=null){k+=j.a.length
B.a.k(n,l)}}if(n.length<2)return!1
i=d*4
h=e.cx
if(h==null||h.length<i)h=e.cx=new Uint8Array(i)
g=A.nl(s,n,new A.eX(e,a),c,Math.min(B.b.J(e.b,8),k*2),new A.eY(e,a,i),h,a1)
if(g==null){if(n.length===q){q=e.ch
q.k(0,p)
if(q.a>128)q.u(0,q.ga7(0))}return!1}for(q=n.length,f=0;f<n.length;n.length===q||(0,A.Z)(n),++f)e.aK(new A.A(a,n[f]))
q=g.w
e.de(q)
g.z=++e.ax
o.n(0,p,g)
e.CW+=q
return!0},
cN(a,b,c,d,e,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a2*c*4
if(b<0||b>=a1||a0.length<f)return new A.cB([0,0,0,0,0])
s=new A.A(a,B.b.J(b,4))
g.ch.u(0,s)
r=g.ay.h(0,s)
r=r==null?null:r.ao(0,b)
if(r===!0)g.fU(s)
q=f+B.b.J(f,255)+16
p=e.hu(q)
if(f>0)$.jb()
o=A.mX(a0,f,p,e.a,f)
n=o<0||o>=f
if(n){m=f
l=a0}else{m=o
l=p}k=A.ku(l,0,m)
if(g.r){j=A.jm(k,l,0,m,n)
i=j.a
h=j.b}else{i=0
h=0}g.cy=i
g.db=h
g.fO(l,k,i,h,n,m,new A.A(a,b),0,a1)
e.hW(q)
return new A.cB([m,k,0,i,h])},
hq(a){var s,r=this.dx.u(0,a)
if(r!=null)try{r.c.cm()}catch(s){}return!1},
hw(a){var s,r,q,p,o=this,n=o.ay,m=A.n(n).i("I<1>"),l=m.i("bX<m.E>")
m=A.ba(new A.bX(new A.I(n,m),m.i("q(m.E)").a(new A.eV(a)),l),l.i("m.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.Z)(m),++s){r=n.u(0,m[s])
if(r!=null)o.CW=o.CW-r.w}n=o.ch
n.fk(A.n(n).i("q(1)").a(new A.eW(a)),!0)
o.as.u(0,a)
o.Q.u(0,a)
o.z.u(0,a)
q=o.y.u(0,a)
if(q==null)return
for(n=q.gE(q),m=o.x;n.t();){p=m.u(0,new A.A(a,n.gC()))
if(p!=null)o.at=o.at-p.a.length}},
cn(){var s,r,q,p
for(r=this.dx,q=new A.aD(r,r.r,r.e,A.n(r).i("aD<2>"));q.t();){s=q.d
try{s.c.cm()}catch(p){}}r.j(0)},
e1(){var s=this
s.x.j(0)
s.y.j(0)
s.z.j(0)
s.Q.j(0)
s.as.j(0)
s.at=0
s.ay.j(0)
s.ch.j(0)
s.CW=0
s.cx=null
s.cJ()},
fb(a,b,c,d,e,f,g){var s
$.jb()
if(g!=null&&A.ku(a,b,c)!==g)return!1
if(d){if(c!==f)return!1
B.d.O(e,0,f,a,b)
return!0}try{A.mY(a,b,c,e,f)
return!0}catch(s){if(A.am(s) instanceof A.a2)return!1
else throw s}},
d1(a,b,c,d,e,f){return this.fb(a,b,c,d,e,f,null)},
fO(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k=this,j=k.b
if(j<=0||f>j)return
s=g.a
if(i>0)k.Q.n(0,s,i)
k.aK(g)
j=k.y
r=j.h(0,s)
q=r==null?null:r.a
if(q==null)q=0
p=k.z
o=p.h(0,s)
if(o==null)o=0
k.ci(s,q+1,o+f)
if(k.as.ao(0,s)){k.fg(f)
if(k.at+k.CW+f>k.b)return}else k.df(f,s)
n=new Uint8Array(f)
B.d.O(n,0,f,a,h)
k.x.n(0,g,new A.eC(n,e,b,c,d,++k.ax))
m=j.h(0,s)
if(m==null){m=A.fe(t.S)
j.n(0,s,m)}m.k(0,g.b)
k.at+=f
j=p.h(0,s)
l=(j==null?0:j)+f
p.n(0,s,l)
k.ci(s,m.a,l)},
ci(a,b,c){var s,r,q=this,p=q.Q.h(0,a)
if(p==null)p=0
if(p>0&&b>=1&&b<p){s=B.b.a0(c*p,b)
r=q.b
if(s>(b===1?B.b.J(r*5,4):r)){q.as.k(0,a)
return}}q.as.u(0,a)},
fU(a){var s=this.ay.u(0,a)
if(s!=null)this.CW=this.CW-s.w},
fg(a){var s,r,q,p,o,n=this,m=n.y,l=n.as,k=A.n(l),j=k.i("bl<1>")
k=k.c
for(;;){if(!(n.at+n.CW+a>n.b&&l.a!==0))break
r=new A.bl(l,l.r,j)
r.c=l.e
for(;;){if(!r.t()){s=null
break}q=r.d
s=q==null?k.a(q):q
p=m.h(0,s)
if(p!=null&&p.a!==0)break}if(s==null){l.j(0)
break}r=m.h(0,s)
o=r.e
if(o==null)A.v(A.au("No elements"))
n.aK(new A.A(s,A.n(r).c.a(o.a)))}},
df(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
for(s=t.x,r=a3.ay,q=A.n(r),p=q.i("I<1>"),o=a3.x,n=a3.as,m=A.n(n),l=m.i("bl<1>"),k=a3.y,m=m.c,j=A.n(o),i=j.i("I<1>"),q=q.i("bR<2>"),j=j.i("bR<2>");a3.at+a3.CW+a4>a3.b;){h=!1
if(n.a!==0){for(g=new A.bl(n,n.r,l),g.c=n.e,f=null;g.t();){e=g.d
d=e==null?m.a(e):e
c=k.h(0,d)
if(c==null||c.a===0)continue
if(d!==a5){f=d
break}if(f==null)f=d}if(f!=null){c=k.h(0,f)
h=c!=null&&c.a!==0
if(h){b=c.e
if(b==null)A.v(A.au("No elements"))
a3.aK(new A.A(f,A.n(c).c.a(b.a)))}else n.u(0,f)}}if(h)continue
a=o.a!==0
a0=r.a!==0
if(a&&a0){a1=new A.bR(o,j).gE(0)
if(!a1.t())A.v(A.af())
g=a1.gC().f
a1=new A.bR(r,q).gE(0)
if(!a1.t())A.v(A.af())
if(g<=a1.gC().z){a1=new A.I(o,i).gE(0)
if(!a1.t())A.v(A.af())
a3.aK(a1.gC())}else{a1=new A.I(r,p).gE(0)
if(!a1.t())A.v(A.af())
a2=r.u(0,s.a(a1.gC()))
if(a2!=null)a3.CW=a3.CW-a2.w}}else if(a){a1=new A.I(o,i).gE(0)
if(!a1.t())A.v(A.af())
a3.aK(a1.gC())}else if(a0){a1=new A.I(r,p).gE(0)
if(!a1.t())A.v(A.af())
a2=r.u(0,s.a(a1.gC()))
if(a2!=null)a3.CW=a3.CW-a2.w}else break}},
de(a){return this.df(a,null)},
aK(a){var s,r,q,p,o,n,m=this,l=m.x.u(0,a)
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
if(n!=null){n.u(0,a.b)
if(n.a===0){q.u(0,s)
r.u(0,s)
m.as.u(0,s)}else{r.n(0,s,o>0?o:0)
q=n.a
r=r.h(0,s)
r.toString
m.ci(s,q,r)}}else{r.u(0,s)
m.as.u(0,s)}},
shP(a){this.d=A.j(a)},
shg(a){this.r=A.aP(a)}}
A.eY.prototype={
$2(a,b){var s=this.a,r=s.x.h(0,new A.A(this.b,a)),q=r.a
return s.d1(q,0,q.length,r.b,b,this.c)},
$S:23}
A.eX.prototype={
$1(a){var s,r,q=this.a,p=q.x.h(0,new A.A(this.b,a))
if(p==null)return B.v
if(q.r&&p.d===0&&p.e===0){q=p.c
s=p.a
r=A.jm(q,s,0,s.length,p.b)
p.d=r.a
p.e=r.b}return new A.A(p.d,p.e)},
$S:24}
A.eV.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:13}
A.eW.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:13}
A.ff.prototype={
hu(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
hW(a){var s=this,r=s.b
if(r.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.fK.prototype={}
A.ei.prototype={
ao(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
hy(a){var s,r,q=this,p=a-q.c
if(p>=0&&p<4){s=q.d
if(!(p>=0&&p<4))return A.a(s,p)
r=s[p]
if(r!==255){s=q.x
if(!(r<4))return A.a(s,r)
return new A.A(s[r],q.y[r])}}return B.v},
dj(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdK()},
gcY(){var s=this.Q
return s===$?this.Q=B.b.J(this.a+16-1,16):s},
gdK(){var s,r,q=this,p=q.as
if(p===$){s=q.gcY()
r=B.b.J(q.b+16-1,16)
q.as!==$&&A.R()
p=q.as=s*r}return p},
hU(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdK(),b=d.dj(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.dj(a5.b):-1
if(a2===b)return
for(a0=d.a,s=d.b,r=d.f,q=a2>=0,p=d.e,o=p.length,n=0;n<c;++n){m=b+n
if(!(m>=0&&m<o))return A.a(p,m)
l=p[m]
if(q){m=a2+n
if(!(m<o))return A.a(p,m)
m=p[m]===l}else m=!1
if(m)continue
m=d.gcY()
k=B.b.N(n,m)*16
j=B.b.a0(n,m)*16
i=Math.min(16,a0-k)
h=Math.min(16,s-j)
if(!(l<r.length))return A.a(r,l)
g=r[l]
for(m=i*4,f=0;f<h;++f){e=((j+f)*a0+k)*4
B.d.O(a4,e,e+m,g,f*i*4)}}if(!a){a5.a=a1
a5.b=a3}}}
A.fL.prototype={
$0(){return A.f([],t.t)},
$S:26}
A.aE.prototype={
gP(a){var s=this
return s.a>=s.c||s.b>=s.d},
hE(a){var s=this
return new A.aE(s.a-a,s.b-a,s.c+a,s.d+a)},
bI(a){var s=this
return new A.aE(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.bb.prototype={
bk(a){var s=$.k!=null
if(s)this.b=A.aV(a*4)
else this.c=new Int32Array(a)},
gA(){var s=this.b
if(s!=null)s=A.cY(t.a.a(A.u($.k.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
ar(a,b){var s,r,q,p,o=this,n=o.b
if(n!=null){s=A.aV(a*4)
r=A.cY(t.a.a(A.u($.k.memory).buffer),s,a)
if(b>0)B.f.B(r,0,b,o.gA())
n=$.k
n.toString
q=o.b
q.toString
n.free(q)
o.b=s
o.a=a}else{p=new Int32Array(a)
if(b>0){n=o.c
n.toString
B.f.B(p,0,b,n)}o.c=p
o.a=a}},
a1(){var s=this.b
if(s!=null){$.k.free(s)
this.b=null}}}
A.b_.prototype={
gA(){var s=this.c
if(s!=null)s=A.jy(t.a.a(A.u($.k.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
eD(a,b,c){var s,r,q=b+c
A.bz(b,q,this.b)
s=this.c
if(s!=null)return new A.b_(!1,c,s+b*4,null)
r=this.d
r.toString
return new A.b_(!1,c,null,A.jL(r,b,q))},
ar(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.h(A.au("Cannot resize a borrowed pixel buffer"))
s=n.c
if(s!=null){r=A.aV(a*4)
q=A.jy(t.a.a(A.u($.k.memory).buffer),r,a)
if(b>0)B.l.B(q,0,b,n.gA())
s=$.k
s.toString
p=n.c
p.toString
s.free(p)
n.c=r
n.b=a}else{o=new Uint32Array(a)
if(b>0){s=n.d
s.toString
B.l.B(o,0,b,s)}n.d=o
n.b=a}},
a1(){var s,r,q=this
if(q.a&&q.c!=null){s=$.k
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.fj.prototype={
dR(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k=this;++k.f
$.eP=$.eP+(e*16+f*8)
m=k.c
if(e>m){if(m>0){$.k.free(k.r)
$.k.free(k.w)
k.c=k.w=k.r=0}s=e*2
m=s
if(typeof m!=="number")return m.ac()
r=A.aV(m*8)
q=null
try{m=s
if(typeof m!=="number")return m.ac()
q=A.aV(m*8)}catch(l){$.k.free(r)
throw l}k.r=r
k.w=q
k.c=s}m=k.d
if(f>m){if(m>0){$.k.free(k.x)
$.k.free(k.y)
k.d=k.y=k.x=0}p=f*2
m=p
if(typeof m!=="number")return m.ac()
o=A.aV(m*4)
n=null
try{m=p
if(typeof m!=="number")return m.ac()
n=A.aV(m*4)}catch(l){$.k.free(o)
throw l}k.x=o
k.y=n
k.d=p}m=t.a
B.e.B(A.kJ(m.a(A.u($.k.memory).buffer),k.r,k.c),0,e,a)
B.e.B(A.kJ(m.a(A.u($.k.memory).buffer),k.w,k.c),0,e,b)
B.f.B(A.cY(m.a(A.u($.k.memory).buffer),k.x,k.d),0,f,c)
B.f.B(A.cY(m.a(A.u($.k.memory).buffer),k.y,k.d),0,f,d)},
hQ(a,b,c,d,e,f,g,h,i,j,k,l,m){var s,r,q,p=this
if(e<2||f<=0||e>a.length||e>b.length||f>c.length||f>d.length||h<0||i<0||h>=j||i>=k||j>65535||k>65535||l.b==null)return-2
s=(j-h)*(k-i)
if(s>262144)return-2
if(s>p.e)p.e=s
p.dR(a,b,c,d,e,f)
r=new A.fm(p,f,h,i,j,k,g,l)
q=r.$0()
while(q===-1){l.ar(l.a*2,0)
q=r.$0()}return q},
hR(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0,a1){var s,r,q,p=this
if(!$.lu||e<2||f<=0||e>a.length||e>b.length||f>c.length||f>d.length||h<0||i<0||h>=j||i>=k||j>65535||k>65535||l.b==null||m.c==null||a0<=0||a1===0)return-2
s=(j-h)*(k-i)
if(s>262144)return-2
if(s>p.e)p.e=s
p.dR(a,b,c,d,e,f)
r=new A.fl(p,f,h,i,j,k,g,l,m,n,o,a0,a1)
q=r.$0()
while(q===-1){l.ar(l.a*2,0)
q=r.$0()}return q},
hX(){if($.fk!==this){this.a1()
return}var s=$.cV-1
$.cV=s
if(s>0)return
$.cV=0
$.fk=null
this.a1()},
a1(){var s=this,r=s.a
if(r!==0)$.k.fl_dense_free(r)
$.k.free(s.b)
if(s.c>0){$.k.free(s.r)
$.k.free(s.w)
s.w=s.r=s.c=0}if(s.d>0){$.k.free(s.x)
$.k.free(s.y)
s.y=s.x=s.d=0}}}
A.fm.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j=this
$.a6=$.a6+1
s=$.k
s.toString
r=j.a
q=r.r
p=r.w
o=r.x
n=r.y
m=j.r?1:0
l=j.w
k=l.b
k.toString
return A.c9(s,"fl_dense_raster",[r.a,q,p,o,n,j.b,j.c,j.d,j.e,j.f,m,k,B.b.J(l.a,2),r.b],t.S)},
$S:3}
A.fl.prototype={
$0(){var s,r,q,p,o,n,m,l,k,j,i,h=this
$.a6=$.a6+1
s=$.k
s.toString
r=h.a
q=r.r
p=r.w
o=r.x
n=r.y
m=h.r?1:0
l=h.w
k=l.b
k.toString
l=B.b.J(l.a,2)
j=h.x
i=j.c
i.toString
return A.c9(s,"fl_dense_raster_solid",[r.a,q,p,o,n,h.b,h.c,h.d,h.e,h.f,m,k,l,r.b,i,j.b,h.y,h.z,h.Q,h.as],t.S)},
$S:3}
A.ir.prototype={
$8(a,b,c,d,e,f,g,h){this.a.X(g,h,a,b,c,d,e,f,this.b)},
$S:27}
A.i4.prototype={
hx(a,b,c,d,e,f,g){var s,r=!0
if(g.gP(0)){s=a.f
if(s!==0)if(s<=1024){r=a.r
r=r===0||r>128}}if(r)return!1
r=this.f
if(r==null)r=this.f=new A.bv(new Float64Array(256))
r.aO(a.f*4)
g.e7(a.r*2)
for(;;)return!1}}
A.fs.prototype={
fd(a){var s,r,q=this,p=q.a,o=p.length
if(o>=a)return
for(s=o;s<a;)s*=2
r=new Float64Array(s)
B.e.B(r,0,o,p)
q.a=r
p=new Float64Array(s)
r=q.b
B.e.B(p,0,r.length,r)
q.b=p
p=new Float64Array(s)
r=q.c
B.e.B(p,0,r.length,r)
q.c=p
p=new Float64Array(s)
r=q.d
B.e.B(p,0,r.length,r)
q.d=p
p=new Float64Array(s)
r=q.e
B.e.B(p,0,r.length,r)
q.e=p
p=new Float64Array(s)
r=q.f
B.e.B(p,0,r.length,r)
q.f=p
p=new Float64Array(s)
r=q.r
B.e.B(p,0,r.length,r)
q.r=p
p=new Float64Array(s)
r=q.w
B.e.B(p,0,r.length,r)
q.w=p
p=new Int8Array(s)
r=q.x
B.ag.B(p,0,r.length,r)
q.x=p
p=new Uint8Array(s)
r=q.y
B.d.B(p,0,r.length,r)
q.y=p
p=new Int32Array(s)
r=q.z
B.f.B(p,0,r.length,r)
q.z=p},
S(a){var s,r,q,p,o=this
B.a.j(o.Q)
B.a.j(o.at)
B.a.j(o.ax)
B.a.j(o.ay)
o.ch.j(0)
B.a.j(o.CW)
B.a.j(o.cx)
B.a.j(o.cy)
B.a.j(o.db)
B.a.j(o.dx)
B.a.j(o.dy)
B.a.j(o.fr)
B.a.j(o.fx)
B.a.j(o.fy)
B.a.j(o.go)
o.id.j(0)
B.a.j(o.k1)
B.a.j(o.k2)
B.a.j(o.k3)
o.k4.j(0)
B.a.j(o.ok)
B.a.j(o.p1)
B.a.j(o.p2)
B.a.j(o.p3)
B.a.j(o.p4)
B.a.j(o.R8)
B.a.j(o.RG)
B.a.j(o.ry)
B.a.j(o.to)
B.a.j(o.x1)
B.a.j(o.x2)
B.a.j(o.xr)
B.a.j(o.y1)
B.a.j(o.y2)
B.a.j(o.aG)
B.a.j(o.aP)
s=!a
if(!s||o.a.length>2048){o.a=new Float64Array(256)
o.b=new Float64Array(256)
o.c=new Float64Array(256)
o.d=new Float64Array(256)
o.e=new Float64Array(256)
o.f=new Float64Array(256)
o.r=new Float64Array(256)
o.w=new Float64Array(256)
o.x=new Int8Array(256)
o.y=new Uint8Array(256)
o.z=new Int32Array(256)
B.a.j(o.as)}else for(r=o.as,q=r.length,p=0;p<r.length;r.length===q||(0,A.Z)(r),++p)B.a.j(r[p])
if(!s||o.rx.length>2048)B.a.j(o.rx)
else for(s=o.rx,r=s.length,p=0;p<s.length;s.length===r||(0,A.Z)(s),++p)B.a.j(s[p])}}
A.iy.prototype={
$2(b5,b6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
for(s=this.a,r=this.b,q=r.as,p=t.n,o=0;o<b5.r;++o){n=b5.c
if(!(o<n.length))return A.a(n,o)
m=n[o]
n=b5.d
if(!(o<n.length))return A.a(n,o)
l=n[o]
k=l-m
if(k<3)continue
for(n=b5.a,j=n.length,i=b5.b,h=i.length,g=m;g<l;++g){if(!(g>=0&&g<j))return A.a(n,g)
f=n[g]
if(!(g<h))return A.a(i,g)
e=i[g]
if(!isFinite(f)||!isFinite(e)||Math.abs(f)>1e7||Math.abs(e)>1e7)return!1}d=s.b
c=s.a
for(b=0,g=0;g<k;){a=m+g;++g
a0=m+B.b.N(g,k)
n=b5.a
j=n.length
if(!(a>=0&&a<j))return A.a(n,a)
a1=n[a]
i=b5.b
h=i.length
if(!(a<h))return A.a(i,a)
a2=i[a]
if(!(a0>=0&&a0<j))return A.a(n,a0)
a3=n[a0]
if(!(a0<h))return A.a(i,a0)
a4=i[a0]
a5=a3-a1
a6=a4-a2
if(a5*a5+a6*a6<=1e-14)continue
n=s.b
if(n>=8192)return!1
r.fd(n+1)
if(!(a1<a3))a7=a1===a3&&a2<a4
else a7=!0
n=s.b
j=r.a
i=r.b
h=r.c
a8=r.d
a9=r.x
b0=j.$flags|0
b1=i.$flags|0
b2=h.$flags|0
b3=a8.$flags|0
b4=a9.$flags|0
if(a7){b0&2&&A.c(j)
if(!(n<j.length))return A.a(j,n)
j[n]=a1
b1&2&&A.c(i)
if(!(n<i.length))return A.a(i,n)
i[n]=a2
b2&2&&A.c(h)
if(!(n<h.length))return A.a(h,n)
h[n]=a3
b3&2&&A.c(a8)
if(!(n<a8.length))return A.a(a8,n)
a8[n]=a4
b4&2&&A.c(a9)
if(!(n<a9.length))return A.a(a9,n)
a9[n]=1}else{b0&2&&A.c(j)
if(!(n<j.length))return A.a(j,n)
j[n]=a3
b1&2&&A.c(i)
if(!(n<i.length))return A.a(i,n)
i[n]=a4
b2&2&&A.c(h)
if(!(n<h.length))return A.a(h,n)
h[n]=a1
b3&2&&A.c(a8)
if(!(n<a8.length))return A.a(a8,n)
a8[n]=a2
b4&2&&A.c(a9)
if(!(n<a9.length))return A.a(a9,n)
a9[n]=-1}j=r.e
i=a2<a4?a2:a4
j.$flags&2&&A.c(j)
if(!(n<j.length))return A.a(j,n)
j[n]=i
i=r.f
j=a2>a4?a2:a4
i.$flags&2&&A.c(i)
if(!(n<i.length))return A.a(i,n)
i[n]=j
j=r.r
i=c+b
j.$flags&2&&A.c(j)
if(!(n<j.length))return A.a(j,n)
j[n]=i
j=r.w
j.$flags&2&&A.c(j)
if(!(n<j.length))return A.a(j,n)
j[n]=i+1;++b
i=r.y
i.$flags&2&&A.c(i)
if(!(n<i.length))return A.a(i,n)
i[n]=b6
if(q.length<=n)B.a.k(q,A.f([],p))
else B.a.j(q[n])
n=r.z
j=s.b
n.$flags&2&&A.c(n)
if(!(j<n.length))return A.a(n,j)
n[j]=j
s.b=j+1}n=s.b
if(n>d){j=r.w;--n
j.$flags&2&&A.c(j)
if(!(n<j.length))return A.a(j,n)
j[n]=c
s.a=s.a+(b+1)}}return!0},
$S:28}
A.iE.prototype={
$3(a,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=B.c.F(a*399999.99999999994),b=B.c.F(a0*399999.99999999994)
for(s=d.b,r=d.c,q=d.a,p=-1;p<=1;++p){o=c+p
for(n=-1;n<=1;++n){m=q.h(0,A.jW(o,b+n))
if(m==null)continue
for(l=m.length,k=s.length,j=r.length,i=0;i<l;++i){h=m[i]
if(!(h>=0&&h<k))return A.a(s,h)
g=s[h]-a
if(!(h<j))return A.a(r,h)
f=r[h]-a0
if(g*g+f*f<=6250000000000001e-27){s=d.d
if(!(h<s.length))return A.a(s,h)
if(a1<s[h])B.a.n(s,h,a1)
return h}}}}h=s.length
B.a.k(s,a)
B.a.k(r,a0)
B.a.k(d.d,a1)
e=A.jW(c,b)
s=q.h(0,e)
if(s==null){s=A.f([],t.t)
q.n(0,e,s)}B.a.k(s,h)
return h},
$S:29}
A.iz.prototype={
$2(a,b){var s,r,q,p,o
A.j(a)
A.j(b)
s=this.a
r=this.b
q=r.length
if(!(a>=0&&a<q))return A.a(r,a)
p=r[a]
o=s.length
if(!(p>=0&&p<o))return A.a(s,p)
p=s[p]
if(!(b>=0&&b<q))return A.a(r,b)
r=r[b]
if(!(r>=0&&r<o))return A.a(s,r)
return B.c.a6(p,s[r])},
$S:2}
A.iA.prototype={
$2(a,b){var s,r,q,p,o,n,m,l
A.j(a)
A.j(b)
s=this.a
r=this.b
q=r.length
if(!(a>=0&&a<q))return A.a(r,a)
p=r[a]
o=s.length
if(!(p>=0&&p<o))return A.a(s,p)
p=s[p]
n=this.c
m=n.length
if(!(a<m))return A.a(n,a)
l=n[a]
if(!(l>=0&&l<o))return A.a(s,l)
l=s[l]
if(!(b>=0&&b<q))return A.a(r,b)
r=r[b]
if(!(r>=0&&r<o))return A.a(s,r)
r=s[r]
if(!(b<m))return A.a(n,b)
n=n[b]
if(!(n>=0&&n<o))return A.a(s,n)
return B.c.a6(p+l,r+s[n])},
$S:2}
A.iB.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k
A.j(a)
A.j(b)
s=this.a
r=this.b
q=r.length
if(!(a>=0&&a<q))return A.a(r,a)
p=r[a]
o=s.length
if(!(p>=0&&p<o))return A.a(s,p)
p=s[p]
n=this.c
m=n.length
if(!(a<m))return A.a(n,a)
l=n[a]
if(!(l>=0&&l<o))return A.a(s,l)
k=Math.min(p,s[l])
if(!(b>=0&&b<q))return A.a(r,b)
r=r[b]
if(!(r>=0&&r<o))return A.a(s,r)
r=s[r]
if(!(b<m))return A.a(n,b)
n=n[b]
if(!(n>=0&&n<o))return A.a(s,n)
return B.c.a6(k,Math.min(r,s[n]))},
$S:2}
A.iC.prototype={
$2(a,b){var s,r,q,p,o,n,m,l
A.j(a)
A.j(b)
s=this.a
r=this.b
q=r.length
if(!(a>=0&&a<q))return A.a(r,a)
p=r[a]
o=s.length
if(!(p>=0&&p<o))return A.a(s,p)
p=s[p]
n=this.c
m=n.length
if(!(a<m))return A.a(n,a)
l=n[a]
if(!(l>=0&&l<o))return A.a(s,l)
l=s[l]
if(!(b>=0&&b<q))return A.a(r,b)
r=r[b]
if(!(r>=0&&r<o))return A.a(s,r)
r=s[r]
if(!(b<m))return A.a(n,b)
n=n[b]
if(!(n>=0&&n<o))return A.a(s,n)
return B.c.a6(p+l,r+s[n])},
$S:2}
A.ix.prototype={
$2(a,b){var s=this,r=s.a,q=r.length
B.a.k(r,a)
B.a.k(s.b,b)
B.a.k(s.c,!1)
r=s.d
if(!(a>=0&&a<r.length))return A.a(r,a)
B.a.k(r[a],q)},
$S:7}
A.iD.prototype={
$2(a,b){var s,r,q,p,o
A.j(a)
A.j(b)
s=this.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(!(b>=0&&b<r))return A.a(s,b)
p=B.c.a6(q,s[b])
if(p!==0)return p
s=this.b
r=s.length
if(!(a<r))return A.a(s,a)
q=s[a]
if(!(b<r))return A.a(s,b)
o=B.c.a6(q,s[b])
if(o!==0)return o
s=this.c
r=s.length
if(!(a<r))return A.a(s,a)
q=s[a]
if(!(b<r))return A.a(s,b)
return B.c.a6(q,s[b])},
$S:2}
A.iF.prototype={
$2(a,b){var s,r,q,p,o
A.j(a)
A.j(b)
s=this.a
r=this.b
q=r.length
if(!(a>=0&&a<q))return A.a(r,a)
p=r[a]
o=s.length
if(!(p>=0&&p<o))return A.a(s,p)
p=s[p]
if(!(b>=0&&b<q))return A.a(r,b)
r=r[b]
if(!(r>=0&&r<o))return A.a(s,r)
return B.c.a6(p,s[r])},
$S:2}
A.iG.prototype={
$2(a,b){var s,r,q
A.j(a)
A.j(b)
s=this.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
if(!(b>=0&&b<r))return A.a(s,b)
return B.c.a6(q,s[b])},
$S:2}
A.iH.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
A.j(a)
A.j(b)
s=i.a
r=s.length
if(!(a>=0&&a<r))return A.a(s,a)
q=s[a]
p=i.b
o=i.c
n=i.d
m=n.length
if(!(a<m))return A.a(n,a)
l=n[a]
k=i.e
j=i.f
if(!(b>=0&&b<r))return A.a(s,b)
s=s[b]
if(!(b<m))return A.a(n,b)
return B.c.a6((q-p)*o+(l-k)*j,(s-p)*o+(n[b]-k)*j)},
$S:2}
A.is.prototype={
$2(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this
for(s=e.a,r=e.b,q=s.length,p=s.$flags|0,o=e.c,n=e.d,m=a;;m=h){l=(m<<1>>>0)+1
if(l>b)break
k=r+m
if(!(k>=0&&k<q))return A.a(s,k)
j=s[k]
i=r+l
if(!(i>=0&&i<q))return A.a(s,i)
h=A.c6(j,s[i],o,n)?l:m
g=l+1
if(g<=b){j=r+h
if(!(j>=0&&j<q))return A.a(s,j)
j=s[j];++i
if(!(i<q))return A.a(s,i)
i=A.c6(j,s[i],o,n)
j=i}else j=!1
if(j)h=g
if(h===m)break
f=s[k]
j=r+h
if(!(j>=0&&j<q))return A.a(s,j)
i=s[j]
p&2&&A.c(s)
s[k]=i
s[j]=f}},
$S:7}
A.cn.prototype={
gf3(){var s=this.a
return s}}
A.fv.prototype={
gdi(){var s=this
if(!s.Q&&s.b){s.Q=!0
s.z=A.n0()}return s.z},
aW(a,b,c,d,e,f,g){var s,r,q,p,o=this,n=o.gdi()
if(n!=null){s=a.f
if(s>4096||a.r>256)o.as=!0
r=n.f
q=n.hQ(a.a,a.b,a.c,a.d,s,a.r,b,d,e,f,g,c.a,!0)
o.r=o.r+(n.f-r)
if(q>=0){p=A.cY(t.a.a(A.u($.k.memory).buffer),n.b,4)
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
return}}s=o.ch;(s==null?o.ch=A.kB(256):s).hS(a,b,c,d,e,f,g)},
fP(a,b,c,d,e,f,g,h,i,j,k,l){var s,r,q,p,o=this,n=o.gdi()
if(n!=null)s=l===0
else s=!0
if(s)return!1
s=a.f
if(s>4096||a.r>256)o.as=!0
r=n.f
q=n.hR(a.a,a.b,a.c,a.d,s,a.r,b,d,e,f,g,c.a,h,i,j,k,l)
o.r=o.r+(n.f-r)
if(q<0)return!1
p=A.cY(t.a.a(A.u($.k.memory).buffer),n.b,4)
c.b=q
s=p.length
if(0>=s)return A.a(p,0)
c.c=p[0]
if(1>=s)return A.a(p,1)
c.d=p[1]
if(2>=s)return A.a(p,2)
c.e=p[2]
if(3>=s)return A.a(p,3)
c.f=p[3];++o.x
return!0},
dv(a,b){var s=this.at,r=s.u(0,a)
if(r==null)return null
if(r.b.H(0,b)){s.n(0,a,r)
return r.c}this.ax=this.ax-r.d
r.c.a.a1()
return null},
c8(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.at
r=s.$ti.i("I<1>")
for(;;){if(!(m.ax+l>1048576||s.a>=256))break
q=new A.I(s,r).gE(0)
if(!q.t())A.v(A.af())
p=s.u(0,q.gC())
m.ax=m.ax-p.d
o=p.c.a
n=o.b
if(n!=null){$.k.free(n)
o.b=null}}r=m.ay
r.toString
o=Math.max(1,c.b)*2
n=new A.bb(o)
n.bk(o)
n=new A.at(n)
n.e5(c)
s.n(0,a,new A.bY(r,b,n,l))
m.ax+=l},
dD(a,b){var s,r,q,p=this.bF,o=p.u(0,a)
if(o!=null){p.n(0,a,o)
return o.b}if(p.a>=512)p.u(0,new A.I(p,p.$ti.i("I<1>")).ga7(0))
s=this.fx
s.j(0)
A.iq(a,b,0.01,s)
r=s.e2()
q=this.ay
q.toString
p.n(0,a,new A.ad(q,r,t.e))
return r},
h3(a,b,c,d){var s,r,q,p,o=this.bF,n=o.u(0,a)
if(n!=null){o.n(0,a,n)
return n.b}s=A.cm(32,512)
A.lg(a,b,0.01,s,this,c,d)
r=s.e2()
for(q=o.$ti.i("I<1>");o.a>=512;){p=new A.I(o,q).gE(0)
if(!p.t())A.v(A.af())
o.u(0,p.gC())}q=this.ay
q.toString
o.n(0,a,new A.ad(q,r,t.e))
return r},
fo(a){var s=this.bG,r=s.u(0,a)
if(r==null)return null
s.n(0,a,r)
return r.b},
gb7(){var s=this.CW
if(s==null){s=new A.bb(2048)
s.bk(2048)
s=this.CW=new A.at(s)}return s},
gbW(){var s=this.cx
if(s==null){s=new A.bb(2048)
s.bk(2048)
s=this.cx=new A.at(s)}return s},
gbx(){var s=this.cy
if(s==null){s=new A.bb(2048)
s.bk(2048)
s=this.cy=new A.at(s)}return s},
gdE(){var s,r,q=this.ry
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.ry=new A.i4(this.rx,new A.bv(q),new A.bv(s),new A.bv(r),new A.bv(new Float64Array(256)))}return q},
fn(a,b,c,d){var s=this,r=s.p3,q=!1
if(a<r.length)if(r[a]===b){r=s.p4
if(!(a<r.length))return A.a(r,a)
if(r[a]===c){r=s.R8
if(!(a<r.length))return A.a(r,a)
r=r[a]===d}else r=q}else r=q
else r=q
if(r){r=s.p2
if(!(a<r.length))return A.a(r,a)
return r[a]}return null},
fN(a,b,c,d){var s,r,q
for(s=this.p3,r=this.p4,q=this.R8;s.length<=a;){B.a.k(s,null)
B.a.k(r,0/0)
B.a.k(q,0/0)}B.a.n(s,a,b)
B.a.n(r,a,c)
B.a.n(q,a,d)},
eV(a,b){var s,r,q,p
for(s=this.p2;s.length<=a;){r=Math.max(16,b)
B.a.k(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.a.n(s,a,q)}return q},
eX(a){var s,r,q,p,o
for(s=this.fy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
eW(a){var s,r,q,p,o
for(s=this.go;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
av(a){var s,r,q
for(s=this.to;s.length<=a;){r=new A.bb(2048)
q=$.k!=null
if(q)r.b=A.aV(8192)
else r.c=new Int32Array(2048)
B.a.k(s,new A.at(r))}s=s[a]
s.j(0)
return s},
eT(a){var s,r,q,p,o
for(s=this.id;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
eS(a){var s,r,q,p,o
for(s=this.k1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
eU(a){var s,r,q,p,o
for(s=this.k2;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
eR(a){var s,r,q,p,o
for(s=this.k4;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
d8(a){var s
for(s=this.ok;s.length<=a;)B.a.k(s,new Float64Array(6))
return s[a]},
eQ(a){var s,r,q,p,o
for(s=this.x1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
eP(a){var s,r,q,p,o
for(s=this.x2;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.a.k(s,new A.a7(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.j(0)
return s},
cR(a){var s,r,q
for(s=this.xr;s.length<=a;){r=new A.bb(2048)
q=$.k!=null
if(q)r.b=A.aV(8192)
else r.c=new Int32Array(2048)
B.a.k(s,new A.at(r))}return s[a]},
eO(a){var s,r,q
for(s=this.y1;s.length<=a;){r=new A.bb(2048)
q=$.k!=null
if(q)r.b=A.aV(8192)
else r.c=new Int32Array(2048)
B.a.k(s,new A.at(r))}return s[a]},
fS(){var s,r,q,p,o
for(s=this.cr,r=new A.aD(s,s.r,s.e,s.$ti.i("aD<2>"));r.t();){q=r.d.b
if(q.a&&q.c!=null){p=$.k
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.j(0)},
cA(a){var s=this,r=a.a,q=s.p3
B.a.ag(q,0,q.length,null)
s.at.be(0,new A.fw(s,r))
s.bF.be(0,new A.fx(r))
s.bG.be(0,new A.fy(r))
s.cr.be(0,new A.fz(r))},
ep(){var s,r,q,p=this,o=p.p3
B.a.ag(o,0,o.length,null)
for(o=p.at,s=new A.aD(o,o.r,o.e,o.$ti.i("aD<2>"));s.t();){r=s.d.c.a
q=r.b
if(q!=null){$.k.free(q)
r.b=null}}o.j(0)
p.ax=0
p.bF.j(0)
p.bG.j(0)
p.fS()},
a1(){var s,r,q,p,o,n,m=this
m.ep()
s=m.aZ
if(s!=null)s.a1()
m.aZ=null
s=m.z
if(s!=null)s.hX()
m.z=null
s=m.CW
if(s!=null)s.a.a1()
s=m.cx
if(s!=null)s.a.a1()
s=m.cy
if(s!=null)s.a.a1()
m.CW=m.cx=m.cy=null
for(s=m.xr,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.k.free(o)
p.b=null}}for(r=m.y1,p=r.length,q=0;q<r.length;r.length===p||(0,A.Z)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.k.free(n)
o.b=null}}B.a.j(s)
B.a.j(r)
B.a.j(m.x1)
B.a.j(m.x2)
for(s=m.to,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.k.free(o)
p.b=null}}B.a.j(s)
m.ds()
m.ch=null},
es(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.aG=0
if(a){i.aP=0
i.as=!1}s=i.z
if(s!=null)r=a||s.e>65536||s.c>8192||s.d>512
else r=!1
if(r){if(s.e>65536){$.k.fl_dense_trim(s.a,65536)
s.e=0}if(s.c>8192){$.k.free(s.r)
$.k.free(s.w)
s.w=s.r=s.c=0}if(s.d>512){$.k.free(s.x)
$.k.free(s.y)
s.y=s.x=s.d=0}}if(a){r=i.aZ
if(r!=null)r.a1()
i.aZ=null
i.ds()
B.a.j(i.fy)
B.a.j(i.go)
B.a.j(i.id)
B.a.j(i.k1)
B.a.j(i.k2)
r=i.k3
if(r!=null)r.S(!0)
B.a.j(i.k4)
B.a.j(i.p2)
B.a.j(i.p3)
B.a.j(i.p4)
B.a.j(i.R8)
B.a.j(i.ok)
B.a.j(i.p1)
B.a.j(i.e9)
i.ry=null}else{for(r=i.y2,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
if(n!=null)if(p<5){o=n.c
if(o!=null){m=q.a(A.u($.k.memory).buffer)
l=n.b
o=new Uint32Array(m,o,l)}else{o=n.d
o.toString}o=o.length>262144}else o=!0
else o=!1
if(o){if(n.a&&n.c!=null){o=$.k
o.toString
m=n.c
m.toString
o.free(m)
n.c=null}B.a.n(r,p,null)}}if(o>5)B.a.sm(r,5)
r=i.fy
q=r.length
B.a.aS(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ak()
r=i.go
q=r.length
B.a.aS(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ak()
r=i.id
q=r.length
B.a.aS(r,Math.min(2,q),q)
q=i.k1
r=q.length
B.a.aS(q,Math.min(2,r),r)
r=i.k2
q=r.length
B.a.aS(r,Math.min(2,q),q)
q=i.k3
if(q!=null)q.S(!1)
r=i.k4
q=r.length
B.a.aS(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ak()
r=i.p2
q=r.length
B.a.aS(r,Math.min(2,q),q)
q=i.p3
B.a.ag(q,0,q.length,null)
for(p=0;p<r.length;++p)if(r[p].length>4096)B.a.n(r,p,new Float64Array(64))
r=i.ry
if(r!=null){r.b.ak()
r.c.ak()
r.d.ak()
r.e.ak()
r=r.f
if(r!=null)r.ak()}}i.db.S(a)
i.dx.S(a)
i.dy.S(a)
i.fr.S(a)
i.fx.S(a)
for(r=i.id,p=0;p<r.length;++p)r[p].S(a)
for(r=i.k1,p=0;p<r.length;++p)r[p].S(a)
for(r=i.k2,p=0;p<r.length;++p)r[p].S(a)
if(a){for(r=i.to,q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.k.free(m)
o.b=null}}B.a.j(r)}else for(r=i.to,q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ak()
r=i.CW
if(r!=null)r.S(a)
r=i.cx
if(r!=null)r.S(a)
r=i.cy
if(r!=null)r.S(a)
for(r=i.x1,p=0;p<r.length;++p)r[p].S(a)
for(r=i.x2,p=0;p<r.length;++p)r[p].S(a)
for(r=i.xr,p=0;p<r.length;++p)r[p].S(a)
for(r=i.y1,p=0;p<r.length;++p)r[p].S(a)
if(a)i.ch=null
else{r=i.ch
if(r!=null){r.r=0
r.ok=!1
r.fy=-1
r.fx=0
q=r.a
j=Math.max(q,2048)
if(r.b.length>j){o=new Int32Array(q)
B.f.ag(o,0,q,-1)
r.b=o}if(r.c.length>32768){r.c=new Int32Array(8192)
r.d=new Int32Array(8192)
r.e=new Int32Array(8192)
r.f=new Int32Array(8192)}if(r.w.length>131072){r.w=new Int32Array(0)
r.x=null
r.Q=0
r.as=!1}}}i.RG.S(a)},
i4(){return this.es(!1)},
ds(){var s,r,q,p,o,n
for(s=this.y2,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q]
if(p!=null)if(p.a&&p.c!=null){o=$.k
o.toString
n=p.c
n.toString
o.free(n)
p.c=null}}B.a.j(s)},
aJ(a,b){var s,r,q
if(b>this.aG)this.aG=b
s=this.y2
if(s.length<=a)B.a.sm(s,a+1)
if(!(a<s.length))return A.a(s,a)
r=s[a]
if(r==null){q=A.fo(b)
B.a.n(s,a,q)
return q}if(r.gA().length<b)r.ar(b,0)
return r},
cc(a){var s
for(s=this.e9;s.length<=a;)B.a.k(s,new Float64Array(6))
return s[a]},
sfW(a){this.ay=t.g_.a(a)}}
A.fw.prototype={
$2(a,b){var s
A.aW(a)
t.az.a(b)
if(b.a!==this.b)return!1
s=this.a
s.ax=s.ax-b.d
b.c.a.a1()
return!0},
$S:32}
A.fx.prototype={
$2(a,b){A.aW(a)
return t.e.a(b).a===this.a},
$S:33}
A.fy.prototype={
$2(a,b){A.aW(a)
return t.b_.a(b).a===this.a},
$S:34}
A.fz.prototype={
$2(a,b){t.cK.a(a)
t.dL.a(b)
if(b.a!==this.a)return!1
b.b.a1()
return!0},
$S:35}
A.ad.prototype={}
A.bY.prototype={}
A.im.prototype={
$4(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
if(f.b)return a
s=b+f.c
r=s+1
q=f.a
p=q.b
o=s>=p&&s<q.a
n=r>=p&&r<q.a
q=c!=null
if(q&&o){p=f.d
m=c+s
if(!(m>=0&&m<p.length))return A.a(p,m)
l=p[m]>>>24}else l=0
if(q&&n){q=f.d
p=c+r
if(!(p>=0&&p<q.length))return A.a(q,p)
k=q[p]>>>24}else k=0
q=d!=null
if(q&&o){p=f.d
m=d+s
if(!(m>=0&&m<p.length))return A.a(p,m)
j=p[m]>>>24}else j=0
if(q&&n){q=f.d
p=d+r
if(!(p>=0&&p<q.length))return A.a(q,p)
i=q[p]>>>24}else i=0
if((l&k&j&i)>>>0===255)q=255
else{q=f.e
p=256-q
m=f.f
m=(l*p+k*q)*(256-m)+(j*p+i*q)*m+32768>>>16
q=m}h=255-q
if(h===0)return a
q=f.r
p=q.$1(f.w*h)
if(typeof p!=="number")return A.ai(p)
p=q.$1((a>>>16&255)*(255-p))
if(typeof p!=="number")return p.ab()
m=q.$1(f.x*h)
if(typeof m!=="number")return A.ai(m)
m=q.$1((a>>>8&255)*(255-m))
if(typeof m!=="number")return m.ab()
g=q.$1(f.y*h)
if(typeof g!=="number")return A.ai(g)
g=q.$1((a&255)*(255-g))
if(typeof g!=="number")return A.ai(g)
return(a&4278190080|p<<16|m<<8|g)>>>0},
$S:36}
A.iv.prototype={
$2(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.a
a0.j(0)
s=a.b
s.j(0)
r=a.c
A.iq(a1.a,r,a.d,a0)
q=a.e
p=a.f
o=a.r
n=a.w
m=a.x
l=a.y
s.ae(a0,q,p,o,n,m,l)
k=a.z
j=a.Q
i=a.as
h=a.at
g=a.ax
k.aW(s,!1,a2,j,i,h,g)
f=a1.e
if(f==null)e=null
else{r=f.q(r)
if(0>=r.length)return A.a(r,0)
r=r[0]
e=r}if(e==null)e=0
if(e!==0)r=a2.b===0&&e<0
else r=!0
if(r)return
d=k.fr
d.j(0)
A.og(a0,e,a.ay,d,k.gdE())
s.j(0)
s.ae(d,q,p,o,n,m,l)
c=k.av(3)
b=k.av(4)
k.aW(s,!1,c,j,i,h,g)
a2.aU(b)
A.d7(b,c,a2,e>0?2:3)},
$S:37}
A.iu.prototype={
$2(a,b){var s,r,q,p,o,n,m,l=this,k=A.dG(a),j=l.d,i=l.b,h=l.c,g=l.a.a
if(k)A.eK(a,i,g,h,!1,b,j,l.e+1)
else{k=g.a
s=k[0]
r=k[1]
q=k[2]
p=k[3]
o=k[4]
n=k[5]
m=j.dy
m.j(0)
A.bo(a,i,s,r,q,p,o,n,0.0625,m,j,0,0)
h=h.a
j.aW(m,!1,b,h[0],h[1],h[2],h[3])}},
$S:38}
A.d.prototype={
dT(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.dT(a)
s=this.b
if(A.o(s))a.a+="["+A.z(s)+"]"
else{r="."+A.z(s)
a.a+=r}},
v(a){var s,r=new A.co("")
this.dT(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bC.prototype={
gdZ(){var s,r,q=this,p=q.r
if(p===$){s=q.b
s===$&&A.H()
r=q.c
r===$&&A.H()
p=q.r=new A.aE(0,0,0+s,0+r)}return p},
gK(){var s,r,q,p=this,o=p.z
if(o===$){s=p.d
s===$&&A.H()
r=p.e
r===$&&A.H()
q=p.hI(s,r)
p.z!==$&&A.R()
p.z=q
o=q}return o},
bb(a,b,c,d){return B.a.af(this.w,new A.hb(a,b,d,c))},
hI(a,b){return this.bb(a,b,!1,!0)},
a9(a,b){var s=this,r="Composition exceeds command budget (200000)",q=s.x+=a,p=s.as
if(p!=null){B.a.n(p,0,p[0]+a)
if(p[0]>2e5)s.l(b,r)}else if(q>2e5)s.l(b,r)},
l(a,b){return A.v(new A.fQ(b+" at "+a.v(0),null,null))},
aB(a,b,c){if(!t.P.b(b))this.l(c,"Expected object")
return b},
bJ(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.o(c)){s=new A.d(b,c)
break A}if(typeof c=="string"){s=new A.d(b,c)
break A}s=b
break A}this.l(s,"Expected finite number")}return a},
R(a,b){return this.bJ(a,b,null)},
T(a,b,c){var s,r
t.P.a(a)
t.Y.a(c)
for(s=a.gaj(),s=s.gE(s);s.t();){r=s.gC()
if(!c.ao(0,r))this.l(new A.d(b,r),"Unsupported field")}},
ew(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.l(a.h(0,b),0)&&!J.l(a.h(0,b),!1))this.l(new A.d(c,b),"Unsupported nonzero "+b)},
e3(g3,g4,g5,g6,g7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8=this,e9=null,f0="ip",f1="op",f2="fr",f3="Expected object",f4="layers",f5="hasMask",f6="tp",f7="td",f8="masksProperties",f9="shapes",g0="refId",g1="parent",g2=t.P
g2.a(g3)
t.cq.a(g4)
t.Y.a(g6)
t.g7.a(g7)
t.eg.a(g5)
e8.as=g5==null?A.f([1],t.t):g5
e8.T(g3,B.h,B.aU)
e8.ew(g3,"ddd",B.h)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=g3.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.eT(n)))m=!(n instanceof A.y&&n.gP(n))
if(m)e8.l(new A.d(B.h,o),"Unsupported "+o)}e8.b=e8.R(g3.h(0,"w"),new A.d(B.h,"w"))
e8.c=e8.R(g3.h(0,"h"),new A.d(B.h,"h"))
e8.d=e8.R(g3.h(0,f0),new A.d(B.h,f0))
e8.e=e8.R(g3.h(0,f1),new A.d(B.h,f1))
s=e8.f=e8.R(g3.h(0,f2),new A.d(B.h,f2))
l=e8.e-e8.d
if(e8.b<=0||e8.c<=0||s<0.001||s>1e4||l<=0||l>36e3)e8.l(B.h,"Invalid bounds/timing")
s=g4==null
k=s?A.V(t.N,g2):g4
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){j=s[p]
i=g3.h(0,j)
if(i==null)i=[]
if(!q.b(i))e8.l(new A.d(B.h,j),"Expected asset definitions")
for(m=J.ce(i);m.t();){h=m.gC()
if(!g2.b(h))e8.l(new A.d(B.h,j),f3)
g=h.h(0,"id")
if(typeof g!="string")e8.l(new A.d(B.h,j),"Expected asset id")
k.n(0,g,h)}}f=g3.h(0,f4)
if(!q.b(f))e8.l(B.n,"Expected layers")
e=g7==null?A.V(t.gi,t.G):g7
d=new A.i1(e8,f,new A.an(t.gt),new A.c1(t.ai))
s=t.S
r=t.D
c=A.V(s,r)
b=A.V(r,s)
s=A.f([],t.f)
a=new A.hh(e8,s)
a0=A.V(r,t.eG)
for(r=J.W(f),m=e8.w,a1=t.n,a2=t.r,a3=t.V,a4=t.c2,a5=e8.a,a6=t.N,a7=t.z,a8=0;a8<r.gm(f);++a8){a9=new A.d(B.n,a8)
e8.a9(1,a9)
b0=r.h(f,a8)
if(!g2.b(b0))e8.l(a9,f3)
e8.T(b0,a9,B.aT)
b1=b0.h(0,"bm")
if(b1==null)b1=0
if(!A.o(b1)||b1<0||b1>16)e8.l(new A.d(a9,"bm"),"Blend mode "+A.z(b1))
for(b2=["ddd","ao"],b3=b2.length,p=0;p<b3;++p)e8.ew(b0,b2[p],a9)
if(b0.h(0,f5)!=null&&!A.aX(b0.h(0,f5))&&!J.l(b0.h(0,f5),0)&&!J.l(b0.h(0,f5),1))e8.l(new A.d(a9,f5),"Expected boolean hasMask")
b4=b0.h(0,"tt")
if(b4==null)b4=0
if(!A.o(b4)||b4<0||b4>4)e8.l(new A.d(a9,"tt"),"Matte type")
if(b0.h(0,f6)!=null&&!J.l(b0.h(0,f6),0)){b2=!0
if(b4!==0)if(a8!==0){b2=b0.h(0,f6)
b3=a8-1
b5=J.ap(r.h(f,b3),"ind")
b2=!J.l(b2,b5==null?b3:b5)}if(b2)e8.l(new A.d(a9,f6),"Unsupported nonzero tp")}if(b0.h(0,f7)!=null&&!J.l(b0.h(0,f7),0)&&!J.l(b0.h(0,f7),1))e8.l(new A.d(a9,f7),"Matte source flag")
b6=e8.f2(b0.h(0,f8),new A.d(a9,f8))
g2.a(b0)
a.hb(b0,q.a(q.b(b0.h(0,f9))?b0.h(0,f9):B.C),a9,s)
b2=b0.h(0,"sr")
if(b2==null)b2=1
b7=e8.R(b2,new A.d(a9,"sr"))
if(b7===0)e8.l(new A.d(a9,"sr"),"Invalid zero time stretch")
b8=b0.h(0,"ty")
b2=J.aH(b8)
if(!b2.H(b8,4)&&!b2.H(b8,3)&&!b2.H(b8,0)&&!b2.H(b8,1))e8.l(new A.d(a9,"ty"),"Layer type "+A.z(b8))
b9=e8.fc(b0.h(0,"ef"),new A.d(a9,"ef"),f)
c0=b9.a
c1=b9.b
c2=e8.fu(b0.h(0,"sy"),new A.d(a9,"sy"))
if(c2!=null&&c0!=null)e8.l(new A.d(a9,"ef"),"Fill with Inner Shadow")
b3=c1==null
b5=!b3
if(b5)c3=!b2.H(b8,4)||b4!==0||b1!==0
else c3=!1
if(c3)e8.l(c1.b,"Set Matte requires a normal shape layer without a track matte")
c4=e8.dN(b0.h(0,"ks"),new A.d(a9,"ks"))
if(b2.H(b8,4))c5=e8.fq(b0.h(0,f9),new A.d(a9,f9),d)
else if(b2.H(b8,1)){c3=b0.h(0,"sw")
if(c3==null)c3=0
c6=e8.R(c3,new A.d(a9,"sw"))
c3=b0.h(0,"sh")
if(c3==null)c3=0
c7=e8.R(c3,new A.d(a9,"sh"))
c8=b0.h(0,"sc")
if(typeof c8!="string"||!B.p.eF(c8,"#"))e8.l(new A.d(a9,"sc"),"Invalid solid color")
c9=A.lQ(B.p.eH(c8,1),16)
c3=B.b.I(c9,16)
d0=B.b.I(c9,8)
d1=new Float32Array(A.ae(A.f([c6*0.5,c7*0.5],a1)))
d2=$.bs()
d3=new A.Y(new A.aU(!1,!1,new A.F(d1,e9,!1,d2,!1),new A.F(new Float32Array(A.ae(A.f([c6,c7],a1))),e9,!1,d2,!1),new A.F(new Float32Array(A.ae(A.f([0],a1))),e9,!1,d2,!1)))
d4=new A.F(new Float32Array(A.ae(A.f([(c3&255)/255,(d0&255)/255,(c9&255)/255],a1))),e9,!1,d2,!1)
d4.f=!0
d0=new Float32Array(A.ae(A.f([100],a1)))
c3=new Float32Array(A.ae(A.f([1],a1)))
d5=A.jQ(A.f([d3],a2),d4,new A.F(d0,e9,!1,d2,!1),new A.F(c3,e9,!1,d2,!1),!1,!1,1,1,4,e9,e9)
d2=A.f([d3],a2)
c3=A.f([d5],a3)
d0=$.jh()
c5=A.jO(d2,c3,new A.c4(d0,d0,$.jf(),$.jg(),$.je(),e9,e9,e9,e9))}else c5=e9
if(b2.H(b8,0)){g=b0.h(0,g0)
d6=k.h(0,g)
if(typeof g!="string"||d6==null||!q.b(d6.h(0,f4)))e8.l(new A.d(a9,g0),"Missing precomposition")
if(g6.ao(0,g))e8.l(new A.d(a9,g0),"Cyclic precomposition")
b2=b0.h(0,"w")
if(b2==null)b2=e8.b
d7=e8.R(b2,new A.d(a9,"w"))
b2=b0.h(0,"h")
if(b2==null)b2=e8.c
d8=e8.R(b2,new A.d(a9,"h"))
d9=d6.h(0,f0)!=null?e8.R(d6.h(0,f0),new A.d(a9,g0)):0
e0=d6.h(0,f1)!=null?e8.R(d6.h(0,f1),new A.d(a9,g0)):d9+(e8.e-e8.d)
e1=e0>d9?e0:d9+(e8.e-e8.d)
e2=d6.h(0,f2)!=null?e8.R(d6.h(0,f2),new A.d(a9,g0)):e8.f
if(e2<0.001||e2>1e4)e8.l(new A.d(a9,g0),"Invalid precomp frame rate")
e3=new A.dt([g,d7,d8,d9,e1])
e4=e.h(0,e3)
if(e4==null){e4=A.jM(a5)
b2=A.mU(["w",d7,"h",d8,"ip",d9,"op",e1,"fr",e8.f,"layers",d6.h(0,f4)],a6,a7)
c3=A.mV(a6)
c3.a4(0,g6)
c3.k(0,g)
e4.e3(b2,k,e8.as,c3,e)
e.n(0,e3,e4)
e8.x=e8.x+e4.x
e5=e4}else{e8.a9(e4.x,new A.d(a9,g0))
e5=new A.ew(new A.an(a4)).cI(e4)}e8.y=B.u.bP(e8.y,e5.y)}else e5=e9
e6=b0.h(0,"tm")!=null?e8.M(b0.h(0,"tm"),new A.d(a9,"tm"),1,A.f([0],a1)):e9
b2=b0.h(0,f0)
if(b2==null)b2=e8.d
b2=e8.R(b2,new A.d(a9,f0))
c3=b0.h(0,f1)
if(c3==null)c3=e8.e
c3=e8.R(c3,new A.d(a9,f1))
d0=J.l(b0.h(0,"hd"),!0)
d1=b0.h(0,"st")
if(d1==null)d1=0
d1=e8.R(d1,new A.d(a9,"st"))
e7=A.l3(c4,c5,b2,c3,d0,b1,e5,c0,c2,b6,b3?b4:1,d1,b7,e6,b5)
if(b5)a0.n(0,e7,c1)
B.a.k(m,e7)
g=b0.h(0,"ind")
if(g==null)g=a8
if(!A.o(g)||c.aF(g))e8.l(new A.d(a9,"ind"),"Invalid/duplicate layer id")
c.n(0,g,e7)
if(b0.h(0,g1)!=null){if(!A.o(b0.h(0,g1)))e8.l(new A.d(a9,g1),"Invalid parent id")
b.n(0,e7,A.j(b0.h(0,g1)))}}e8.fw(f,c,a0)
e8.fz(c,b)},
hf(a){return this.e3(a,null,null,B.aZ,null)},
f2(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null,f="pt"
if(a==null)return g
if(!t.j.b(a))h.l(b,"Expected list")
s=J.W(a)
if(s.gP(a))return g
r=A.f([],t.bE)
for(q=t.n,p=t.P,o=0;o<s.gm(a);++o){n=new A.d(b,o)
m=s.h(a,o)
if(!p.b(m))h.l(n,"Expected object")
h.T(m,n,B.aS)
l=J.l(m.h(0,"inv"),!0)
k=A.ii(m.h(0,"mode"))
if(k==null)k="a"
if(!B.b_.ao(0,k))h.l(new A.d(n,"mode"),"Unsupported mask mode "+k)
if(m.h(0,f)==null)h.l(new A.d(n,f),"Missing mask path")
j=h.dn(m.h(0,f),new A.d(n,f))
i=m.h(0,"o")!=null?h.M(m.h(0,"o"),new A.d(n,"o"),1,A.f([100],q)):new A.F(new Float32Array(A.ae(A.f([100],q))),g,!1,$.bs(),!1)
B.a.k(r,new A.ac(j,k,i,l,m.h(0,"x")!=null?h.M(m.h(0,"x"),new A.d(n,"x"),1,A.f([0],q)):g))}return r},
fw(a,b,c){var s,r,q,p,o,n,m,l,k,j,i=this
t.j.a(a)
t.B.a(b)
t.aj.a(c)
for(s=i.w,r=0;r<s.length;++r){q=s[r]
if(q.y!==0&&!q.ax){if(r===0)i.l(new A.d(new A.d(B.n,r),"tt"),"Missing preceding matte source")
p=r-1
if(!(p>=0&&p<s.length))return A.a(s,p)
o=s[p]
if(o.y!==0)i.l(new A.d(new A.d(B.n,r),"tt"),"Chained matte")
q.ay=o
o.ch=!0
i.a9(4,new A.d(new A.d(B.n,r),"tt"))}}for(p=new A.b9(c,A.n(c).i("b9<1,2>")).gE(0);p.t();){n=p.d
m=n.a
l=n.b
k=l.b
o=b.h(0,l.a)
j=!0
if(o!=null)if(o.b!=null)if(!o.e)j=o!==m&&o.y!==0
if(j)i.l(k,"Set Matte requires a visible shape source without its own matte")
m.ay=o
i.a9(4,k)}for(p=J.W(a),r=0;r<s.length;++r){if(J.l(J.ap(p.h(a,r),"td"),1)){if(!(r<s.length))return A.a(s,r)
j=!s[r].ch}else j=!1
if(j)i.l(new A.d(new A.d(B.n,r),"td"),"Unpaired matte source")}},
fz(a,b){var s,r,q,p,o,n,m,l,k
t.B.a(a)
t.gq.a(b)
for(s=new A.b9(b,A.n(b).i("b9<1,2>")).gE(0);s.t();){r=s.d
q=r.b
p=a.h(0,q)
if(p==null)this.l(B.n,"Missing parent "+q)
r.a.cy=p}for(s=this.w,q=s.length,o=t.D,n=0;n<s.length;s.length===q||(0,A.Z)(s),++n){m=s[n]
l=A.fe(o)
for(k=m;k!=null;k=k.cy)if(!l.k(0,k))this.l(B.n,"Cyclic parenting")}},
aC(a){var s,r,q,p,o,n,m,l,k,j,i
for(s=this.w,r=s.length-1,q=null;r>=0;--r){if(!(r<s.length))return A.a(s,r)
p=s[r]
if(!p.ch){if(!p.e)o=(p.b!=null||p.f!=null)&&a>=p.c&&a<p.d
else o=!1
o=!o}else o=!0
if(o)continue
o=p.a.e.q(a)
if(0>=o.length)return A.a(o,0)
if(B.c.F(B.b.D(B.c.L(255*B.c.F(o[0])/100),0,255)*p.b1(a)/255)===0)continue
n=p.ay
m=p.aC(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.q(a)
if(0>=o.length)return A.a(o,0)
k=B.c.F(B.b.D(B.c.L(255*B.c.F(o[0])/100),0,255)*n.b1(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.aC(a)
if(j==null)continue
m=m.bI(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.cF(q,m)}if(q==null)return null
i=q.bI(this.gdZ())
return i.gP(0)?null:i},
dN(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.V(t.N,t.z):i.aB(0,a,b)
i.T(g,b,B.b5)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.l(new A.d(b,p),"3D transform")}s=t.n
o=i.M(g.h(0,"sk"),new A.d(b,"sk"),1,A.f([0],s))
n=i.M(g.h(0,"sa"),new A.d(b,"sa"),1,A.f([0],s))
m=g.h(0,h)
if(m instanceof A.y&&J.l(m.h(0,"s"),!0)){l=i.aB(0,m,new A.d(b,h))
i.T(l,new A.d(b,h),B.aW)
k=i.M(l.h(0,"x"),new A.d(new A.d(b,h),"x"),1,A.f([0],s))
j=i.M(l.h(0,"y"),new A.d(new A.d(b,h),"y"),1,A.f([0],s))
m=null}else{k=null
j=null}return A.jR(i.aM(g.h(0,"a"),new A.d(b,"a"),2,A.f([0,0],s),!0),i.aM(m,new A.d(b,h),2,A.f([0,0],s),!0),i.h8(g.h(0,"s"),new A.d(b,"s"),2,A.f([100,100],s),100),i.M(g.h(0,"r"),new A.d(b,"r"),1,A.f([0],s)),i.M(g.h(0,"o"),new A.d(b,"o"),1,A.f([100],s)),k,j,o,n)},
fc(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aK
if(!b0.b(b1))a4.l(b2,"Expected effects array")
for(s=J.bI(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.W(b1),n<m.gm(b1);++n){l=new A.d(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.l(new A.d(b2,n),a5)
a4.T(m,l,B.b1)
k=J.l(m.h(0,a6),21)&&J.l(m.h(0,a7),"ADBE Fill")
j=J.l(m.h(0,a6),28)&&J.l(m.h(0,a7),"ADBE Set Matte3")
i=J.l(m.h(0,a6),5)&&J.l(m.h(0,a7),"ADBE Layer Control")
h=!k
if(h&&!j&&!i)a4.l(l,"Unsupported visual effect")
if(J.l(m.h(0,a8),0)||J.l(m.h(0,a8),!1))continue
if(m.h(0,a8)!=null&&!J.l(m.h(0,a8),1)&&!J.l(m.h(0,a8),!0))a4.l(new A.d(l,a8),"Invalid effect enabled flag")
if(!h||j){if(p!=null||o!=null)a4.l(l,"Multiple visual effects")
g=k?B.aa:B.ad
f=m.h(0,a9)
if(!b0.b(f)||J.aI(f)!==g.length)a4.l(new A.d(l,a9),"Invalid effect parameters")
e=new A.h1(a4,l,f,g)
d=new A.h2(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.ev(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aF,B.aG,B.aH,B.aI,B.aJ],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.q(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.d(new A.d(new A.d(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.eq(a0))a4.l(a1,"Expected a static layer index")
o=new A.A(B.c.L(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.aI(a2)!==1)a4.l(l,"Invalid layer control")
m=J.kq(a2)
if(!q.b(m))a4.l(new A.d(new A.d(l,a9),0),a5)
a4.T(m,new A.d(new A.d(l,a9),0),B.G)
if(!J.l(m.h(0,a6),10)||!J.l(m.h(0,a7),"ADBE Layer Control-0001"))a4.l(l,"Unsupported effect control")
a=a4.M(m.h(0,"v"),new A.d(new A.d(new A.d(l,a9),0),"v"),1,A.f([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.eq(a0))h=a0!==0&&!s.az(b3,new A.h0(a0))
else h=!0
if(h)a4.l(l,"Missing layer control target")}}return new A.A(p,o)},
fu(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.eT(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.aI(a)!==1)d.l(b,"Expected one Inner Shadow style")
r=new A.d(b,0)
q=d.aB(0,J.kq(a),r)
if(!J.l(q.h(0,"ty"),2))d.l(new A.d(r,"ty"),"Unsupported layer style")
d.T(q,r,B.aQ)
p=new A.h7(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.l(p.$2(m,0),0))d.l(new A.d(r,m),"Unsupported Inner Shadow parameter")}if(!J.l(p.$2("bm",1),1))d.l(new A.d(r,"bm"),"Inner Shadow requires Multiply")
l=d.M(q.h(0,"c"),new A.d(r,"c"),3,A.f([0,0,0],t.n))
if(l.a==null)d.l(new A.d(r,"c"),"Animated Inner Shadow")
k=l.q(0)
s=p.$2("o",100)
if(typeof s!=="number")return s.ac()
j=B.b.D(B.c.F(s*255/100),0,255)
s=p.$2("a",0)
if(typeof s!=="number")return s.N()
i=B.c.N(s,360)*3.141592653589793/180
h=p.$2("d",0)
if(h<0)d.l(new A.d(r,"d"),"Negative Inner Shadow distance")
if(h===0||j===0)return null
s=Math.cos(i)
o=Math.sin(i)
g=k.length
if(0>=g)return A.a(k,0)
f=B.b.D(B.c.F(k[0]*255),0,255)
if(1>=g)return A.a(k,1)
e=B.b.D(B.c.F(k[1]*255),0,255)
if(2>=g)return A.a(k,2)
return A.l2(-s*h,o*h,(j<<24|f<<16|e<<8|B.b.D(B.c.F(k[2]*255),0,255))>>>0)},
dn(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c={}
c.a=c.b=null
c.c=!1
s=this.dM(a,b,-1,A.f([],t.n),new A.h8(c,this,a))
r=A.f([],t.hg)
q=s.b
if(q!=null&&c.c){p=c.a
p.toString
o=q.a.length
n=A.kG(o,!1,!1,t.y)
m=c.b
m.toString
for(l=p.length,k=m,j=0;j<o;++j){m=j*2
i=m<l
h=i?p[m]:0
if(i){++m
if(!(m<l))return A.a(p,m)
g=p[m]}else g=0
B.a.n(n,j,h===0?k:h===1)
k=g===0?n[j]:g===1}for(m=o-1,i=q.d,f=i.length,j=0;j<o;++j){e=j*2
if(e<l){++e
if(!(e<l))return A.a(p,e)
g=p[e]}else g=0
e=n[j]
if(!(j<f))return A.a(i,j)
if((i[j]&1)!==0)d=e
else d=g!==0?g===1:B.a.h(n,Math.min(j+1,m))
B.a.k(r,new A.A(e,d))}}this.a9(s.gbf()/6|0,b)
p=c.b
return new A.av(s,p!==!1,r,!1)},
d7(e4,e5,e6,e7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8=this,d9=null,e0="d",e1="Path direction",e2="ks",e3="r"
if(e7>64)d8.l(e5,"Shape group nesting exceeds 64")
if(!t.j.b(e4))d8.l(e5,"Expected shape list")
s=t.r
r=A.f([],s)
q=A.f([],t.V)
for(p=t.P,o=t.aT,n=t.eU,m=n.i("m.E"),l=t.n,k=t.u,j=t.S,i=t.W,h=t.fq,g=t.bs,f=t.fP,e=e7+1,d=d9,c=0;b=J.W(e4),c<b.gm(e4);++c){a=new A.d(e5,c)
d8.a9(1,a)
a0=b.h(e4,c)
if(!p.b(a0))d8.l(a,"Expected object")
a1=a0.h(0,"ty")
a2=a0.h(0,"bm")
if(a2==null)a2=0
if(!A.o(a2)||a2<0||a2>16)d8.l(new A.d(a,"bm"),"Blend mode "+A.z(a2))
a3=J.l(a0.h(0,"hd"),!0)
switch(a1){case"tr":if(d!=null||c!==b.gm(e4)-1)d8.l(a,"Transform must be last and unique")
d=d8.dN(a0,a)
break
case"gr":d8.T(a0,a,B.aV)
a4=d8.d7(a0.h(0,"it"),new A.d(a,"it"),e6,e)
if(!a3){B.a.k(r,a4)
B.a.k(q,a4)}break
case"sh":d8.T(a0,a,B.aX)
if(a0.h(0,e0)!=null&&!J.l(a0.h(0,e0),1)&&!J.l(a0.h(0,e0),2)&&!J.l(a0.h(0,e0),3))d8.l(new A.d(a,e0),e1)
if(a0.h(0,e2)==null)d8.l(new A.d(a,e2),"Missing path data")
a5=e6.cF(a0.h(0,e2),new A.d(a,e2))
if(J.l(a0.h(0,e0),3)&&!a5.w)a5=new A.av(a5.e,a5.f,a5.r,!0)
if(!a3)B.a.k(r,new A.Y(a5))
break
case"rc":case"el":d8.T(a0,a,B.b2)
if(a0.h(0,e0)!=null&&!J.l(a0.h(0,e0),1)&&!J.l(a0.h(0,e0),2)&&!J.l(a0.h(0,e0),3))d8.l(new A.d(a,e0),e1)
a6=d8.aM(a0.h(0,"p"),new A.d(a,"p"),2,A.f([0,0],l),!0)
a7=d8.aM(a0.h(0,"s"),new A.d(a,"s"),2,A.f([0,0],l),!0)
a8=d8.M(a0.h(0,e3),new A.d(a,e3),1,A.f([0],l))
d8.a9(8,a)
if(!a3)B.a.k(r,new A.Y(new A.aU(J.l(a1,"el"),J.l(a0.h(0,e0),3),a6,a7,a8)))
break
case"sr":d8.T(a0,a,B.b0)
a9=a0.h(0,"sy")
if(a9==null)a9=1
b=J.aH(a9)
if(!b.H(a9,1)&&!b.H(a9,2))d8.l(new A.d(a,"sy"),"PolyStar type "+A.z(a9))
if(a0.h(0,e0)!=null&&!J.l(a0.h(0,e0),1)&&!J.l(a0.h(0,e0),2)&&!J.l(a0.h(0,e0),3))d8.l(new A.d(a,e0),e1)
b0=d8.M(a0.h(0,"pt"),new A.d(a,"pt"),1,A.f([5],l))
a6=d8.aM(a0.h(0,"p"),new A.d(a,"p"),2,A.f([0,0],l),!0)
b1=d8.M(a0.h(0,e3),new A.d(a,e3),1,A.f([0],l))
b2=d8.M(a0.h(0,"or"),new A.d(a,"or"),1,A.f([0],l))
b3=d8.M(a0.h(0,"os"),new A.d(a,"os"),1,A.f([0],l))
if(b.H(a9,1))b4=a0.h(0,"ir")!=null?d8.M(a0.h(0,"ir"),new A.d(a,"ir"),1,A.f([0],l)):new A.F(new Float32Array(A.ae(A.f([0],l))),d9,!1,$.bs(),!1)
else b4=d9
if(b.H(a9,1))b5=a0.h(0,"is")!=null?d8.M(a0.h(0,"is"),new A.d(a,"is"),1,A.f([0],l)):new A.F(new Float32Array(A.ae(A.f([0],l))),d9,!1,$.bs(),!1)
else b5=d9
d8.a9(12,a)
if(!a3)B.a.k(r,new A.Y(new A.b2(b.H(a9,1),J.l(a0.h(0,e0),3),b0,a6,b1,b2,b3,b4,b5)))
break
case"tm":d8.T(a0,a,B.b4)
b6=a0.h(0,"m")
if(b6==null)b6=1
b=J.aH(b6)
if(!b.H(b6,1)&&!b.H(b6,2))d8.l(new A.d(a,"m"),"Trim mode")
b7=A.f([],s)
b8=new A.bG(b7,d8.M(a0.h(0,"s"),new A.d(a,"s"),1,A.f([0],l)),d8.M(a0.h(0,"e"),new A.d(a,"e"),1,A.f([100],l)),d8.M(a0.h(0,"o"),new A.d(a,"o"),1,A.f([0],l)),b.H(b6,2),A.V(j,i))
if(!a3){b9=A.f([],h)
new A.h6(d8,a,b9).$1(r)
B.a.a4(b7,new A.a_(b9,g.a(new A.h4()),f))
for(c0=0;c0<b9.length;++c0)b9[c0].a=new A.bn(b8,c0)}d8.a9(1,a)
break
case"fl":case"st":case"gf":case"gs":d8.T(a0,a,B.aO)
b=J.aH(a1)
c1=b.H(a1,"st")||b.H(a1,"gs")
if(c1)d8.y=!0
c2=c1?d8.f9(a0.h(0,e0),new A.d(a,e0)):d9
c3=a0.h(0,e3)
if(c3==null)c3=1
b7=J.aH(c3)
if(!b7.H(c3,1)&&!b7.H(c3,2))d8.l(new A.d(a,e3),"Fill rule")
c4=a0.h(0,"lc")
if(c4==null)c4=1
c5=a0.h(0,"lj")
if(c5==null)c5=1
if(!A.o(c4)||c4<1||c4>3||!A.o(c5)||c5<1||c5>3)d8.l(a,"Stroke cap/join")
c6=d8.h7(a0.h(0,"c"),new A.d(a,"c"),3,A.f([0,0,0],l),!1)
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
c9&2&&A.c(c7)
c7[d1]=d2/255}}d4=d8.M(a0.h(0,"o"),new A.d(a,"o"),1,A.f([100],l))
d5=d8.M(a0.h(0,"w"),new A.d(a,"w"),1,A.f([1],l))
if(!a3){d8.a9(r.length+2,a)
c8=A.ba(r,k)
b7=b7.H(c3,2)
c9=a0.h(0,"ml")
if(c9==null)c9=4
c9=d8.R(c9,new A.d(a,"ml"))
B.a.k(q,A.jQ(c8,c6,d4,d5,c1,b7,c4,c5,c9,c2,b.H(a1,"gf")||b.H(a1,"gs")?d8.fp(a0,a):d9))}else d8.a9(2,a)
break
case"mm":d8.T(a0,a,B.aY)
b6=a0.h(0,"mm")
if(b6==null)b6=1
if(!A.o(b6)||b6<1||b6>5)d8.l(new A.d(a,"mm"),"Shape op mm mode "+A.z(b6))
if(!a3&&r.length!==0){d8.a9(r.length+1,a)
d6=A.ba(new A.bX(r,o.a(new A.h5()),n),m)
if(d6.length===1)d7=b6===4||r.length>1
else d7=!1
B.a.j(r)
if(d6.length!==0)B.a.k(r,d7?B.a.gai(d6):new A.Y(new A.aS(d6,b6)))}else{if(a3)B.a.j(r)
d8.a9(1,a)}break
default:d8.l(new A.d(a,"ty"),"Shape op "+A.z(a1))}}if(d==null){s=$.jh()
s=A.jR(s,s,$.jf(),$.jg(),$.je(),d9,d9,d9,d9)}else s=d
return A.jO(r,q,s)},
fq(a,b,c){return this.d7(a,b,c,0)},
f9(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.l(b,"Expected dash array")
s=A.f([],t.gC)
for(r=t.n,q=t.P,p=null,o=0;n=J.W(a),o<n.gm(a);++o){m=new A.d(b,o)
n=n.h(a,o)
if(!q.b(n))j.l(new A.d(b,o),"Expected object")
j.T(n,m,B.b3)
l=j.M(n.h(0,"v"),new A.d(m,"v"),1,A.f([0],r))
k=n.h(0,"n")
n=J.aH(k)
if(n.H(k,"o")){if(p!=null)j.l(m,"Duplicate dash offset")
p=l}else if(n.H(k,(s.length&1)===0?"d":"g"))B.a.k(s,l)
else j.l(new A.d(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.a.k(s,B.a.gaA(s))
return A.l_(s,p==null?A.jJ(A.f([0],r)):p)},
fp(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.aB(0,a.h(0,"g"),new A.d(b,"g"))
k.T(s,new A.d(b,"g"),B.b6)
r=s.h(0,"p")
if(!A.o(r)||r<=0)k.l(new A.d(new A.d(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dM(s.h(0,"k"),new A.d(new A.d(b,"g"),"k"),-1,A.f([],q),new A.h3(k,r))
if(!J.l(a.h(0,"t"),1)&&!J.l(a.h(0,"t"),2))k.l(new A.d(b,"t"),"Gradient type")
o=k.aM(a.h(0,"s"),new A.d(b,"s"),2,A.f([0,0],q),!0)
n=k.aM(a.h(0,"e"),new A.d(b,"e"),2,A.f([0,0],q),!0)
m=J.l(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.M(a.h(0,"h"),new A.d(b,"h"),1,A.f([0],q))
return A.l1(r,p,o,n,m,l,a.h(0,"a")==null?null:k.M(a.h(0,"a"),new A.d(b,"a"),1,A.f([0],q)))},
b8(a,b,c,d,e,f,g,h){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return g?A.no(d):A.jJ(d)
s=o.aB(0,a,b)
o.T(s,b,B.H)
if(s.h(0,"a")!=null&&!J.l(s.h(0,"a"),0)&&!J.l(s.h(0,"a"),1))o.l(new A.d(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.l(s.h(0,"x"),""))o.l(new A.d(b,"x"),"Expressions")
r=new A.d(b,"k")
q=s.h(0,"k")
if(!J.l(s.h(0,"a"),1)){if(t.j.b(q)){p=J.W(q)
p=p.gaR(q)&&p.ga7(q) instanceof A.y&&J.ap(p.ga7(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p)return new A.F(o.bs(q,r,c,h,e,null,0,0),null,!1,$.bs(),!1)
if(!t.j.b(q)||J.eT(q))o.l(r,"Expected keyframes")
return o.f0(q,r,c,h,f,e)},
M(a,b,c,d){return this.b8(a,b,c,d,null,!1,!0,0)},
aM(a,b,c,d,e){return this.b8(a,b,c,d,null,e,!0,0)},
h7(a,b,c,d,e){return this.b8(a,b,c,d,null,!1,e,0)},
dM(a,b,c,d,e){return this.b8(a,b,c,d,e,!1,!0,0)},
h8(a,b,c,d,e){return this.b8(a,b,c,d,null,!1,!0,e)},
ce(a,b,c,d){var s
A.j(c)
if(b==null)return new Float32Array(c)
if(c!==d){s=a.a
s.toString
this.l(s,"Morph topology/component count changes")}return b},
bs(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this
t.c.a(e)
if(e!=null)return e.$5(a,b,f,g,h)
if(f==null)s=new Float32Array(c)
else s=f
if(t.j.b(a)){r=J.W(a)
if(r.gm(a)<c)n.l(b,"Expected "+c+" components")
for(q=0;q<c;++q){p=g+q
o=n.bJ(r.h(a,q),b,q)
s.$flags&2&&A.c(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gm(a)>2&&n.R(r.h(a,2),b)!==d)n.l(b,"Non-planar component")}else{if(c!==1)n.l(b,"Expected "+c+" components")
r=n.bJ(a,b,0)
s.$flags&2&&A.c(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
f0(e5,e6,e7,e8,e9,f0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1=this,e2=null,e3="Expected object",e4=t.j
e4.a(e5)
t.c.a(f0)
s=J.bI(e5)
r=s.gaA(e5)
q=t.P
p=q.b(r)
o=p?r.h(0,"t"):e2
n=!1
if(p)if(r.h(0,"e")!=null){if(!J.l(r.h(0,"h"),1))if(typeof o=="number"){p=e1.e
p===$&&A.H()
p=o<p}else p=n
else p=n
n=p}p=s.gm(e5)
m=p+(n?1:0)
l=new Float64Array(m)
p=m*3
k=new Int32Array(p)
for(j=s.gE(e5),i=0,h=0,g=!1;j.t();){f=j.gC()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.l(f.h(0,"h"),1))++h
g=B.u.bP(g,f.h(0,"to")!=null)}j=h*(e9?8:4)
e=new Float64Array(j)
if(g)d=new Float32Array(m*4)
else d=e2
c=A.er()
b=A.er()
a=A.er()
a0=A.er()
for(a1=2*m,a2=m-1,a3=m+i,a4=e1.a.a,a5=e7===2,a6=m,a7=0,a8=0,a9=0;a9<s.gm(e5);++a9){b0=new A.d(e6,a9)
b1=s.h(e5,a9)
if(!q.b(b1))e1.l(b0,e3)
e1.T(b1,b0,B.aR)
b2=b1.h(0,"to")
b3=b1.h(0,"ti")
b4=b2==null
b5=!b4
if(b5)e1.dU(b2,"to",e7,b0,d,a9*4)
b6=b3==null
if(!b6)e1.dU(b3,"ti",e7,b0,d,a9*4+2)
if(b4!==b6)e1.l(b0,"Incomplete spatial tangents")
b7=e1.bJ(b1.h(0,"t"),b0,"t")
b4=a9===0
if(!b4){b6=a9-1
if(!(b6>=0&&b6<m))return A.a(l,b6)
b6=b7<=l[b6]}else b6=!1
if(b6)e1.l(b0,"Keyframe times must increase")
if(!(a9<m))return A.a(l,a9)
l[a9]=b7
b8=b1.h(0,"s")
b9=b1.h(0,"e")
if(b4){if(b8==null)e1.l(b0,"Missing initial keyframe value")
c0=e1.bs(b8,new A.d(b0,"s"),e7,e8,f0,e2,0,0)
if(b.b!==b)A.v(A.fc(""))
b.b=c0
if(a.b!==a)A.v(A.fc(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.v(A.fc(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.v(A.fc(""))
c.b=b4
b6=a.b
if(b6===a)A.v(A.ar(""))
B.k.B(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.v(A.ar(""))
if(typeof b4!=="number")return A.ai(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.v(A.ar(""))
b6=a.b
if(b6===a)A.v(A.ar(""))
if(typeof b6!=="number")return A.ai(b6)
J.kr(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.v(A.ar(""))
b6=a.b
if(b6===a)A.v(A.ar(""))
e1.bs(b8,new A.d(b0,"s"),e7,e8,f0,b4,c1,b6)}}c2=J.l(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.v(A.ar(""))
if(typeof b4!=="number")return A.ai(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.v(A.ar(""))
b5=a.b
if(b5===a)A.v(A.ar(""))
e1.bs(b9,new A.d(b0,"e"),e7,e8,f0,b4,c1,b5)
b4=m+a9
k.$flags&2&&A.c(k)
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=c1
c3=(c3|2)>>>0
a8=c1
a6=c4}else{b5=Math.min(a9+1,a2)
B.f.n(k,m+a9,b5*b4)}b4=a1+a9
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=a7
if(!c2&&b1.h(0,"o")!=null&&b1.h(0,"i")!=null){b4=b1.h(0,"o")
if(!q.b(b4))e1.l(new A.d(b0,"o"),e3)
b1=b1.h(0,"i")
if(!q.b(b1))e1.l(new A.d(b0,"i"),e3)
c5=b4.h(0,"x")
c6=b4.h(0,"y")
c7=b1.h(0,"x")
c8=b1.h(0,"y")
c9=e1.bu(c5,b0)
d0=e1.bu(c6,b0)
d1=e1.bu(c7,b0)
d2=e1.bu(c8,b0)
d3=Math.max(Math.max(c9,d0),Math.max(d1,d2))
b1=!1
if(d3!==1){b4=a.b
if(b4===a)A.v(A.ar(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e1.l(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e1.l(b0,"Easing component mismatch")
if(e9){b1=a.b
if(b1===a)A.v(A.ar(""))}else{b1=a.b
if(b1===a)A.v(A.ar(""))
b1=Math.min(A.lL(b1),1)}d4=Math.min(A.lL(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e4.b(c8),b4=e4.b(c7),b5=e4.b(c6),b6=e4.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.W(c5)
d6=d6.h(c5,d6.gm(c5)===1?0:d5)}else d6=c5
d7=B.c.D(A.dF(d6),0,1)
if(b5){d6=J.W(c6)
d6=d6.h(c6,d6.gm(c6)===1?0:d5)}else d6=c6
A.dF(d6)
if(b4){d8=J.W(c7)
d8=d8.h(c7,d8.gm(c7)===1?0:d5)}else d8=c7
d9=B.c.D(A.dF(d8),0,1)
if(b1){d8=J.W(c8)
d8=d8.h(c8,d8.gm(c8)===1?0:d5)}else d8=c8
A.dF(d8)
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
k[a9]=c3}if(m===1)return new A.F(b.aw(),e2,!1,$.bs(),!1)
if(n){e4=a0.aw()
if(typeof e4!=="number")return A.ai(e4)
c1=a2*e4
e4=e1.e
e4===$&&A.H()
if(!(a2>=0))return A.a(l,a2)
l[a2]=e4
e4=c.aw()
s=a.aw()
if(typeof s!=="number")return A.ai(s)
J.kr(e4,c1,c1+s,c.aw(),a8)
if(!(a2<p))return A.a(k,a2)
k[a2]=8
s=m+a2
k.$flags&2&&A.c(k)
if(!(s>=0&&s<p))return A.a(k,s)
k[s]=c1
a2=a1+a2
if(!(a2>=0&&a2<p))return A.a(k,a2)
k[a2]=a7}e4=a.aw()
s=a0.aw()
q=c.aw()
if(a7===j)p=e
else{p=new Float64Array(a7)
B.e.B(p,0,a7,e)}p=A.mS(l,e4,s,k,q,p,d,a4)
return new A.F(e2,p,a4,new Float32Array(p.b),!1)},
dU(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.aI(a)<2)o.l(new A.d(d,b),"Invalid spatial tangent")
if(c!==2&&J.mn(a,new A.ha()))o.l(new A.d(d,b),"Spatial tangent on non-position")
s=J.W(a)
r=o.R(s.h(a,0),d)
q=o.R(s.h(a,1),d)
if(e!=null){e.$flags&2&&A.c(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=r
p=f+1
if(!(p<s))return A.a(e,p)
e[p]=q}},
bu(a,b){var s,r
if(!t.j.b(a)){this.R(a,b)
return 1}for(s=J.bI(a),r=s.gE(a);r.t();)this.R(r.gC(),b)
return s.gm(a)}}
A.hb.prototype={
$1(a){var s=this
return t.D.a(a).bb(s.a,s.b,s.d,s.c)},
$S:39}
A.h1.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.d(new A.d(q.b,"ef"),a),o=q.a,n=o.aB(0,J.ap(q.c,a),p)
o.T(n,p,B.G)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.l(s,r[a])||n.h(0,"v")==null)o.l(p,"Invalid effect parameter")
return o.M(n.h(0,"v"),new A.d(p,"v"),b,A.f([],t.n))},
$1(a){return this.$2$dimensions(a,1)},
$S:40}
A.h2.prototype={
$2(a,b){var s,r=this.b.$1(a)
if(r.a!=null){s=r.q(0)
if(0>=s.length)return A.a(s,0)
s=s[0]!==b}else s=!0
if(s)this.a.l(new A.d(new A.d(new A.d(this.c,"ef"),a),"v"),"Unsupported effect parameter value")},
$S:7}
A.h0.prototype={
$1(a){return J.l(J.ap(a,"ind"),this.a)},
$S:14}
A.h7.prototype={
$2(a,b){var s=this.a,r=this.c,q=s.M(this.b.h(0,a),new A.d(r,a),1,A.f([b],t.n))
if(q.a==null)s.l(new A.d(r,a),"Animated Inner Shadow")
s=q.q(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:42}
A.h8.prototype={
$5(a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4="Invalid path topology",a5=t.j
if(a5.b(a6)){s=J.W(a6)
s=s.gm(a6)===1&&s.ga7(a6) instanceof A.y}else s=!1
if(s)a6=J.ms(a6)
s=this.b
r=s.aB(0,a6,a7)
s.T(r,a7,B.aP)
q=r.h(0,"c")
if(!A.aX(q))s.l(new A.d(a7,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.u.bP(p.c,q!==o)
o=a7.a
n=o==null?null:o.b
if(A.o(n)){m=p.a
if(m==null){o=J.aI(a5.a(J.ap(this.c,"k")))
m=p.a=new Uint8Array(o*2)}p=a7.b==="e"?1:0
p=n*2+p
o=q?1:2
m.$flags&2&&A.c(m)
if(!(p>=0&&p<m.length))return A.a(m,p)
m[p]=o}l=r.h(0,"v")
k=r.h(0,"i")
j=r.h(0,"o")
if(l instanceof A.cl&&k instanceof A.cl&&j instanceof A.cl){i=l.b
if(i!==k.b||i!==j.b)s.l(a7,a4)
h=s.ce(a7,a8,i*6,b0)
g=l.a
f=k.a
e=j.a
for(a5=g.length,s=h.$flags|0,p=f.length,o=e.length,d=0;d<i;++d){c=d*2
b=a9+d*6
if(!(c<a5))return A.a(g,c)
a=g[c]
s&2&&A.c(h)
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
if(a5.b(l))if(a5.b(k))if(a5.b(j)){a5=J.W(l)
a5=a5.gm(l)!==J.aI(k)||a5.gm(l)!==J.aI(j)}else a5=p
else a5=p
else a5=p
if(a5)s.l(a7,a4)
a5=J.W(l)
h=s.ce(a7,a8,a5.gm(l)*6,b0)
a3=new A.h9(s,a7,h)
for(d=0;d<a5.gm(l);++d){b=a9+d*6
a3.$2(a5.h(l,d),b)
a3.$2(J.ap(k,d),b+2)
a3.$2(J.ap(j,d),b+4)}return h},
$S:15}
A.h9.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.aI(a)!==2)m.a.l(m.b,"Expected 2D path point")
s=m.c
r=m.a
q=J.W(a)
p=m.b
o=r.R(q.h(a,0),p)
s.$flags&2&&A.c(s)
n=s.length
if(!(b>=0&&b<n))return A.a(s,b)
s[b]=o
o=b+1
p=r.R(q.h(a,1),p)
if(!(o<n))return A.a(s,o)
s[o]=p},
$S:44}
A.h6.prototype={
$1(a){var s,r,q,p,o,n,m=this
t.cH.a(a)
for(s=a.length,r=m.a,q=m.b,p=m.c,o=0;o<a.length;a.length===s||(0,A.Z)(a),++o){n=a[o]
r.a9(1,q)
if(n instanceof A.Y)B.a.k(p,n)
if(n instanceof A.a8)m.$1(n.a)}},
$S:45}
A.h4.prototype={
$1(a){return t.bD.a(a).a},
$S:46}
A.h5.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a8)||a.geg()},
$S:1}
A.h3.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.W(a)
r=k.b*4
s=s.gm(a)<r||(s.gm(a)-r&1)===1}else s=!0
if(s)k.a.l(b,"Invalid gradient stops")
s=k.a
r=J.W(a)
q=s.ce(b,c,r.gm(a),e)
for(p=k.b,o=0;o<r.gm(a);++o){n=s.R(r.h(a,o),b)
if(o<p*4&&B.b.N(o,4)!==0){m=B.b.D(B.c.F(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.c(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:15}
A.ha.prototype={
$1(a){return!J.l(a,0)},
$S:14}
A.hh.prototype={
ck(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i,h
t.ew.a(d)
t.be.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.kl()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.o(n)?new A.d(p,n):new A.d(p,A.D(n))}if(this.fY(a,r,b,p,e==null?new A.c1(t.ao):e))return}for(q=a.gaj(),q=q.gE(q),m=t.j,l=t.h;q.t();){k=q.gC()
if(k==="k")continue
j=a.h(0,k)
if(!s.b(j))i=!m.b(j)||l.b(j)
else i=!1
if(i)continue
B.a.k(d,k)
this.ck(j,b,c,d,e,k==="ks"&&J.l(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a)&&!t.h.b(a))for(m=J.W(a),l=t.h,h=0;h<m.gm(a);++h){j=m.h(a,h)
if(!s.b(j))k=!q.b(j)||l.b(j)
else k=!1
if(k)continue
B.a.k(d,h)
this.dS(j,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
hb(a,b,c,d){return this.ck(a,b,c,d,null,!1)},
dS(a,b,c,d,e){return this.ck(a,b,c,d,e,!1)},
fY(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null
t.P.a(a0)
t.bC.a(a4)
if(!a4.k(0,a0))b.a.l(a3,"Cyclic expression reference")
try{i=$.mg()
if(i.b.test(a1)){a0.u(0,"x")
return!0}s=new A.d(a3,"x")
r=$.me().eb(a1)
if(r==null)b.a.l(s,"Unsupported expression syntax")
q=a2
p=null
i=$.km()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dV(0,h)
h=new A.cq(h.a,h.b,h.c)
i=t.j
g=t.d
f=b.a
while(h.t()){e=h.d
o=e==null?g.a(e):e
d=o.b
if(1>=d.length)return A.a(d,1)
d=d[1]
d.toString
n=d
d=$.mf()
c=A.D(n)
m=d.b.test(c)?B.z.e6('"'+A.z(n)+'"',a):n
p=b.cg(q,"nm",A.D(m))
if(p==null)f.l(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.C)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=b.cg(q,"ty","tr")
l=i==null?a:i.h(0,"s")
break
case"transform.rotation":i=b.cg(q,"ty","tr")
l=i==null?a:i.h(0,"r")
break
default:i=p
l=i==null?a:J.ap(i,"o")
break}k=l
j=f.aB(0,k,s)
if(j===a0){a0.u(0,"x")
return!0}b.dS(j,a2,s,A.f([],t.f),a4)
a0.j(0)
a0.a4(0,j)
return!1}finally{a4.u(0,a0)}},
cg(a,b,c){var s,r,q,p
for(s=J.ce(a),r=t.P,q=null;s.t();){p=s.gC()
if(!r.b(p)||!J.l(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q}}
A.i1.prototype={
cF(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.aB(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.ap(j,"x")
s=typeof n=="string"?$.kl().eb(n):null
if(s==null){k=k.dn(j,b)
i.n(0,j,k)
return k}r=new A.d(b,"x")
k.T(j,b,B.H)
if(J.ap(j,"a")!=null&&!J.l(J.ap(j,"a"),0)&&!J.l(J.ap(j,"a"),1))k.l(new A.d(b,"a"),"Invalid animated flag")
m=l.d
if(!m.k(0,j))k.l(r,"Cyclic path reference")
try{q=null
p=null
o=l.h6(s,r)
q=o.a
p=o.b
k=l.cF(q,p)
i.n(0,j,k)
return k}finally{m.u(0,j)}},
h6(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.dh(j.b,s,B.n,b,"layer")
q=r.a
if(!J.l(q.h(0,"ty"),4))j.a.l(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.d(r.b,"shapes")
s=$.km()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dV(0,i)
i=new A.cq(i.a,i.b,i.c)
s=t.d
while(i.t()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.dh(p,m,o,b,"content")
q=l.a
o=l.b
p=J.l(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.d(o,"it")}k=q.h(0,"ks")
if(!J.l(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.l(b,"Path reference needs a B\xe9zier path")
return new A.A(k,new A.d(o,"ks"))},
dh(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.W(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gm(a);++m){l=s.h(a,m)
if(r.b(l)&&J.l(l.h(0,"nm"),b)){if(o!=null)q.l(d,p)
n=m
o=l}}if(o!=null)return new A.A(o,new A.d(c,n))}this.a.l(d,"Missing "+e+" reference: "+b)}}
A.ew.prototype={
a2(a,b,c){var s
A.p6(c,t.K,"T","_copy")
s=c.a(this.b.en(c.a(a),c.i("0()").a(b)))
return s},
G(a){var s=t.A
s.a(a)
if(a.a!=null)return a
return this.a2(a,new A.hw(a),s)},
er(a){return this.a2(a,new A.hx(this,a),t.d1)},
cL(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.a8)return s.bO(a)
if(a instanceof A.Y)return s.a2(a,new A.hq(s,a),r)
if(a instanceof A.bn)return s.a2(a,new A.hr(s,a),r)
if(a instanceof A.aS)return s.a2(a,new A.hs(s,a),r)
if(a instanceof A.av)return s.a2(a,new A.ht(s,a),r)
if(a instanceof A.aU)return s.a2(a,new A.hu(s,a),r)
if(a instanceof A.b2)return s.a2(a,new A.hv(s,a),r)
throw A.h(A.au("Unknown compiled geometry"))},
hs(a){var s=t.I
s.a(a)
if(a instanceof A.a8)return this.bO(a)
if(a instanceof A.bm)return this.a2(a,new A.hk(this,a),s)
throw A.h(A.au("Unknown compiled paint"))},
bO(a){return this.a2(a,new A.hm(this,a),t.eV)},
ey(a){return this.a2(a,new A.hl(this,a),t.cK)},
i3(a,b){return this.a2(b,new A.hy(this,b),t.e_)},
hh(a){return this.a2(a,new A.hj(this,a),t.bo)},
hN(a){var s=t.J
s.a(a)
return this.a2(a,new A.ho(this,a),s)},
cz(a){var s=t.D
s.a(a)
return this.a2(a,new A.hn(this,a),s)},
cI(a){return this.a2(a,new A.hp(this,a),t.G)}}
A.hw.prototype={
$0(){var s=this.a,r=s.d.length
if(r===0)r=$.bs()
else r=new Float32Array(r)
return new A.F(s.a,s.b,s.c,r,s.f)},
$S:53}
A.hx.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.G(o.a),m=p.G(o.b),l=p.G(o.c),k=p.G(o.d),j=p.G(o.e),i=o.f
i=i==null?q:p.G(i)
s=o.r
s=s==null?q:p.G(s)
r=o.w
r=r==null?q:p.G(r)
o=o.x
return A.jR(n,m,l,k,j,i,s,r,o==null?q:p.G(o))},
$S:54}
A.hq.prototype={
$0(){return new A.Y(this.a.cL(this.b.a))},
$S:55}
A.hr.prototype={
$0(){var s=this.b
return new A.bn(this.a.i3(0,s.a),s.b)},
$S:56}
A.hs.prototype={
$0(){var s=this.b,r=s.a,q=A.a4(r),p=q.i("a_<1,B>")
r=A.ba(new A.a_(r,q.i("B(1)").a(this.a.gbi()),p),p.i("ab.E"))
r.$flags=1
return A.nx(r,s.b)},
$S:57}
A.ht.prototype={
$0(){var s=this.b
return new A.av(this.a.G(s.e),s.f,s.r,s.w)},
$S:58}
A.hu.prototype={
$0(){var s=this.b,r=this.a
return new A.aU(s.e,s.f,r.G(s.r),r.G(s.w),r.G(s.x))},
$S:59}
A.hv.prototype={
$0(){var s,r=this.b,q=this.a,p=q.G(r.r),o=q.G(r.w),n=q.G(r.x),m=q.G(r.y),l=q.G(r.z),k=r.Q
k=k==null?null:q.G(k)
s=r.as
q=s==null?null:q.G(s)
return new A.b2(r.e,r.f,p,o,n,m,l,k,q)},
$S:90}
A.hk.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a4(o),l=m.i("a_<1,B>")
o=A.ba(new A.a_(o,m.i("B(1)").a(n.gbi()),l),l.i("ab.E"))
o.$flags=1
m=n.G(p.b)
l=n.G(p.c)
s=n.G(p.d)
r=p.y
r=r==null?null:n.ey(r)
q=p.z
n=q==null?null:n.hh(q)
return A.jQ(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:61}
A.hm.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a4(q),n=o.i("a_<1,B>")
q=A.ba(new A.a_(q,o.i("B(1)").a(p.gbi()),n),n.i("ab.E"))
q.$flags=1
o=r.b
n=A.a4(o)
s=n.i("a_<1,aL>")
o=A.ba(new A.a_(o,n.i("aL(1)").a(p.ghr()),s),s.i("ab.E"))
o.$flags=1
return A.jO(q,o,p.er(r.c))},
$S:62}
A.hl.prototype={
$0(){var s,r=this.b,q=this.a,p=q.G(r.c),o=q.G(r.d),n=q.G(r.e),m=r.f
m=m==null?null:q.G(m)
s=r.r
q=s==null?null:q.G(s)
return A.l1(r.a,p,o,n,r.w,m,q)},
$S:63}
A.hy.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a4(r),o=p.i("a_<1,B>")
r=A.ba(new A.a_(r,p.i("B(1)").a(q.gbi()),o),o.i("ab.E"))
return A.nI(r,q.G(s.b),q.G(s.c),q.G(s.d),s.e)},
$S:64}
A.hj.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a4(r),o=p.i("a_<1,F>")
r=A.ba(new A.a_(r,p.i("F(1)").a(q.gi1()),o),o.i("ab.E"))
return A.l_(r,q.G(s.b))},
$S:65}
A.ho.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.G(q.e),o=s.G(r.c),n=r.e
s=n==null?null:s.G(n)
return A.nw(new A.av(p,q.f,q.r,q.w),r.b,o,r.d,s)},
$S:66}
A.hn.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.er(l.a),j=l.b
j=j==null?n:m.bO(j)
s=l.f
s=s==null?n:m.cI(s)
r=l.x
r=r==null?n:m.G(r)
q=l.z
if(q==null)q=n
else{p=A.a4(q)
o=p.i("a_<1,ac>")
q=A.ba(new A.a_(q,p.i("ac(1)").a(m.ghM()),o),o.i("ab.E"))}p=l.at
p=p==null?n:new A.ev(m.G(p.a),m.G(p.b))
o=l.as
o=o==null?n:A.l2(o.a,o.b,o.c)
r=A.l3(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.cz(k)
r.ch=l.ch
return r},
$S:67}
A.hp.prototype={
$0(){var s,r,q,p,o=this.b,n=A.jM(o.a),m=o.b
m===$&&A.H()
n.b=m
m=o.c
m===$&&A.H()
n.c=m
m=o.d
m===$&&A.H()
n.d=m
m=o.e
m===$&&A.H()
n.e=m
m=o.f
m===$&&A.H()
n.f=m
n.x=o.x
n.y=o.y
m=n.w
o=o.w
s=this.a
r=A.a4(o)
B.a.a4(m,new A.a_(o,r.i("a9(1)").a(s.ghJ()),r.i("a_<1,a9>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.cz(p)}}return n},
$S:68}
A.bj.prototype={
ghC(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.q(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
hz(a,b,c){var s,r,q,p,o=this.f
if(o==null)o=null
else{o=o.q(a)
if(0>=o.length)return A.a(o,0)
o=o[0]}s=(o==null?0:o)*0.01
if(s===0)return null
if(s<=-1)r=-0.99
else r=s>=1?0.99:s
o=Math.atan2(c,b)
q=this.r
if(q==null)q=null
else{q=q.q(a)
if(0>=q.length)return A.a(q,0)
q=q[0]}p=o+(q==null?0:q)*3.141592653589793/180
return new A.A(Math.cos(p)*r,Math.sin(p)*r)},
f_(a,b){var s,r,q,p,o,n,m
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
return q+(a[o]-q)*m}}return B.k.gaA(a)}}
A.Y.prototype={
gK(){return this.a.gK()},
ga8(){return this.a.ga8()},
aa(a){return this.a.aa(a)},
$iB:1}
A.bn.prototype={
gK(){return this.a.gK()},
ga8(){return this.a.gK()},
aa(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].aa(a)},
$iB:1}
A.bG.prototype={
gK(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.a.af(r.a,new A.i8())
r.f!==$&&A.R()
q=r.f=s}return q}}
A.i8.prototype={
$1(a){return t.u.a(a).ga8()},
$S:1}
A.cu.prototype={
gK(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.a.af(r.a,new A.hc())
r.e!==$&&A.R()
q=r.e=s}return q}}
A.hc.prototype={
$1(a){return t.A.a(a).a!=null},
$S:69}
A.c4.prototype={
gdg(){var s=this.y
if(s==null){s=new Float64Array(16)
s[10]=1
s[15]=1
this.y=s}return s},
gb_(){var s,r,q=this,p=null,o=q.at
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
gcw(){var s,r=this,q=r.ax
if(q===$){s=A.jS(r.c,100,100)&&A.eF(r.d,0)&&A.eF(r.w,0)
r.ax!==$&&A.R()
q=r.ax=s}return q},
gaH(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gcw())if(A.jS(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.jS(q.b,0,0)
else r=A.eF(r,0)&&A.eF(q.r,0)
s=r}q.ay!==$&&A.R()
p=q.ay=s}return p},
gK(){var s,r=this,q=r.ch
if(q===$){s=r.gb_()&&r.e.a!=null
r.ch!==$&&A.R()
q=r.ch=s}return q},
gct(){var s,r=this,q=r.CW
if(q===$){s=A.eF(r.e,100)
r.CW!==$&&A.R()
r.CW=s
q=s}return q},
d4(a){var s,r,q,p,o=this
if(o.as!==a)s=o.gb_()&&!isNaN(o.as)
else s=!0
if(s)return
o.as=a
r=o.a.q(a)
s=o.f
q=s==null
p=q||o.r==null?o.b.q(a):null
if(q)s=null
else{s=s.q(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(0>=p.length)return A.a(p,0)
s=p[0]}q=r.length
if(0>=q)return A.a(r,0)
o.z=s-r[0]
s=o.r
if(s==null)s=null
else{s=s.q(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(1>=p.length)return A.a(p,1)
s=p[1]}if(1>=q)return A.a(r,1)
o.Q=s-r[1]},
ek(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gb_()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gdg()
a4.as=a6
r=a4.gdg()
q=a4.a.q(a6)
p=a4.b.q(a6)
o=a4.c.q(a6)
s=a4.d.q(a6)
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
r.$flags&2&&A.c(r)
r[0]=m*k
r[1]=l*k
r[4]=-l*j
r[5]=m*j
s=a4.w
if(s==null)i=a5
else{s=s.q(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]
i=s}if(i==null)i=0
if(i!==0){s=a4.x
if(s==null)s=a5
else{s=s.q(a6)
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
else{s=s.q(a6)
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
else{s=a3.q(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(1>=p.length)return A.a(p,1)
s=p[1]}r[13]=s-r[1]*q[0]-r[5]*q[1]
return r},
cC(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaH())return a
if(b.gcw()){b.d4(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.aE(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.ek(a0)
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
return new A.aE(f-d,e-c,f+d,e+c)}}
A.ac.prototype={
gK(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gbE(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.hQ.prototype={
aY(a){var s=this.c
return 255-A.ak((255-(B.b.dB(s,a)&255))*(s>>>24))}}
A.ev.prototype={
hd(a){var s,r,q,p=this.a.q(a),o=new A.hi(),n=this.b.q(a)
if(0>=n.length)return A.a(n,0)
n=o.$1(n[0])
if(typeof n!=="number")return n.ab()
s=p.length
if(0>=s)return A.a(p,0)
r=o.$1(p[0])
if(typeof r!=="number")return r.ab()
if(1>=s)return A.a(p,1)
q=o.$1(p[1])
if(typeof q!=="number")return q.ab()
if(2>=s)return A.a(p,2)
o=o.$1(p[2])
if(typeof o!=="number")return A.ai(o)
return(n<<24|r<<16|q<<8|o)>>>0}}
A.hi.prototype={
$1(a){return B.c.F(B.c.D(a,0,1)*255)},
$S:70}
A.a9.prototype={
gcu(){var s,r,q=this,p=null,o=q.db
if(o===$){s=!1
if(q.a.gK()){r=q.x
r=r==null?p:r.a!=null
if(r!==!1){r=q.b
r=r==null?p:r.gK()
if(r!==!1){r=q.at
if(r==null)r=p
else r=r.a.a!=null&&r.b.a!=null
if(r!==!1){r=q.cy
r=r==null?p:r.gcu()
if(r!==!1){r=q.z
r=r==null?p:B.a.af(r,new A.hV())
r=r!==!1}else r=s}else r=s}else r=s
s=r}}q.db!==$&&A.R()
o=q.db=s}return o},
gK(){var s,r,q=this,p=q.dx
if(p===$){if(q.gcu()){s=q.f
s=s==null?null:s.gK()
r=s!==!1}else r=!1
q.dx!==$&&A.R()
p=q.dx=r}return p},
e0(a){var s,r=this,q=r.x
if(q!=null){q=q.q(a)
if(0>=q.length)return A.a(q,0)
q=q[0]
s=r.f.f
s===$&&A.H()
s=q*s
q=s}else q=(a-r.r)/r.w
return q},
bb(a,b,c,d){var s,r,q,p,o,n=this
if(!n.e)s=n.b==null&&n.f==null
else s=!0
if(s)return!0
if(a>=b)return!0
s=n.d
if(!(a>=s)){r=n.c
q=c?b<r:b<=r}else q=!0
if(q)return!0
if(a>=n.c)p=c?b<s:b<=s
else p=!1
if(!p)return!1
if(!n.gcu())return!1
s=n.f
if(s!=null){r=n.x
if(r!=null)return r.a!=null
r=n.w
if(r>0){o=n.r
return s.bb((a-o)/r,(b-o)/r,c,d)}o=n.r
return s.bb((b-o)/r,(a-o)/r,d,c)}return!0},
ged(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.a.az(s,new A.hT())
r.dy!==$&&A.R()
q=r.dy=s===!0}return q},
ghD(){var s,r=this,q=r.fr
if(q===$){s=r.z
s=s==null?null:B.a.af(s,new A.hU())
r.fr!==$&&A.R()
q=r.fr=s===!0}return q},
geh(){var s,r,q=this,p=q.fy
if(p===$){if(q.a.gb_()){s=q.cy
s=s==null?null:s.geh()
r=s!==!1}else r=!1
q.fy!==$&&A.R()
p=q.fy=r}return p},
gef(){var s,r,q=this,p=q.go
if(p===$){if(q.a.gaH()){s=q.cy
s=s==null?null:s.gef()
r=s===!0}else r=!0
q.go!==$&&A.R()
p=q.go=r}return p},
aC(a){var s,r,q,p,o,n,m,l,k,j=this,i=null
if(!j.ev(a))return i
s=j.f
r=s==null
if(r&&j.gK()&&!isNaN(j.k2))return j.k1
if(j.k2===a)return j.k1
j.k2=a
q=j.b
p=q==null?i:q.b9(a)
if(!r)p=A.cF(p,s.aC(j.e0(a)))
if(p==null)return j.k1=null
s=j.z
if(s!=null)r=s.length===1&&B.a.gai(s).gbE()||B.a.af(s,new A.hW())
else r=!1
if(r){for(o=i,n=0;n<s.length;++n){m=s[n]
if(!m.d){r=m.b
r=r==="a"||r==="i"||r==="f"}else r=!1
if(r){r=m.a.aa(a)
if(r==null)l=i
else{q=m.e
if(q==null)q=i
else{q=q.q(a)
if(0>=q.length)return A.a(q,0)
q=q[0]}if(q==null)q=0
q=Math.max(0,q)
l=new A.aE(r.a-q,r.b-q,r.c+q,r.d+q)}if(l!=null)o=A.cF(o,l)}}if(o!=null){p=p.bI(o)
if(p.gP(0))return j.k1=null}}for(k=j;k!=null;k=k.cy)p=k.a.cC(p,a)
return j.k1=p},
ev(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
hK(a,b){var s=this.a.e.q(a)
if(0>=s.length)return A.a(s,0)
return B.b.D(B.c.L(b*B.c.F(s[0])/100),0,255)},
b1(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gbE()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.q(a)
if(0>=q.length)return A.a(q,0)
return B.b.D(B.c.F(q[0]*255/100),0,255)}return 255},
fs(a){var s,r,q,p=this.z
if(p==null||p.length===0)return!1
s=p.length
if(s===1){if(0>=s)return A.a(p,0)
s=p[0].gbE()}else s=!1
if(s)return!1
for(r=0;r<p.length;++r){q=p[r]
if(q.b==="n")continue
s=q.c.q(a)
if(0>=s.length)return A.a(s,0)
if(B.b.D(B.c.F(s[0]),0,100)<100)return!0}return!1}}
A.hV.prototype={
$1(a){return t.J.a(a).gK()},
$S:4}
A.hT.prototype={
$1(a){return t.J.a(a).b!=="n"},
$S:4}
A.hU.prototype={
$1(a){t.J.a(a)
return a.b==="n"||a.gK()},
$S:4}
A.hW.prototype={
$1(a){t.J.a(a)
return a.b==="a"&&!a.d},
$S:4}
A.a8.prototype={
geg(){var s,r=this,q=r.d
if(q===$){s=B.a.az(r.a,new A.hM())
r.d!==$&&A.R()
r.d=s
q=s}return q},
gbh(){var s,r=this,q=r.e
if(q===$){s=r.fl()
r.e!==$&&A.R()
r.e=s
q=s}return q},
fl(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.a.gai(n)
if(s instanceof A.a8){r=s.c
r=r.gaH()&&r.gct()}else r=!1
return r?s.gbh():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.a8){r=o.c
r=r.gaH()&&r.gct()}else r=!1
if(r){if(q==null)q=B.a.eG(n,0,p)
B.a.a4(q,o.gbh())}else if(q!=null)B.a.k(q,o)}return q==null?n:q},
gcK(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gbh()
r=null
if(!(s.length!==1)){q=B.a.gai(s)
A:{if(q instanceof A.bm){s=q
break A}if(q instanceof A.a8){s=q.gcK()
break A}s=r
break A}r=s}p.f!==$&&A.R()
o=p.f=r}return o},
gK(){var s,r=this,q=r.ax
if(q===$){s=r.c.gK()&&B.a.af(r.a,new A.hO())&&B.a.af(r.b,new A.hP())
r.ax!==$&&A.R()
q=r.ax=s}return q},
ga8(){var s,r=this,q=r.ay
if(q===$){s=r.c.gb_()&&B.a.af(r.a,new A.hN())
r.ay!==$&&A.R()
q=r.ay=s}return q},
aa(a){var s,r,q,p,o=this
if(o.ga8()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.Z)(s),++p)q=A.cF(q,s[p].aa(a))
if(q==null)return o.z=null
return o.z=o.c.cC(q,a)},
b9(a){var s,r,q,p,o,n=this
if(n.gK()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.q(a)
if(0>=r.length)return A.a(r,0)
if(B.c.F(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.Z)(r),++o)p=A.cF(p,r[o].b9(a))
if(p==null)return n.Q=null
return n.Q=s.cC(p,a)},
$iaL:1,
$iB:1}
A.hM.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a8)||a.geg()},
$S:1}
A.hO.prototype={
$1(a){return t.u.a(a).gK()},
$S:1}
A.hP.prototype={
$1(a){return t.I.a(a).gK()},
$S:72}
A.hN.prototype={
$1(a){return t.u.a(a).ga8()},
$S:1}
A.aS.prototype={
gK(){var s,r=this,q=r.d
if(q===$){s=B.a.af(r.a,new A.hZ())
r.d!==$&&A.R()
r.d=s
q=s}return q},
ga8(){var s,r=this,q=r.e
if(q===$){s=B.a.af(r.a,new A.hY())
r.e!==$&&A.R()
r.e=s
q=s}return q},
aa(a){var s,r,q,p,o,n,m,l=this
if(l.ga8()&&!isNaN(l.x))return l.w
if(l.x===a)return l.w
l.x=a
s=l.a
r=s.length
if(r===0)return l.w=null
if(r===1){q=l.b
if(q===3||q===4)s=null
else{if(0>=r)return A.a(s,0)
s=s[0].aa(a)}return l.w=s}q=l.b
if(q===3){if(0>=r)return A.a(s,0)
return l.w=s[0].aa(a)}if(q===4){if(0>=r)return A.a(s,0)
p=s[0].aa(a)
if(p==null)return l.w=null
for(o=1;o<s.length;++o){n=s[o].aa(a)
if(n==null)return l.w=null
p=p.bI(n)
if(p.a>=p.c||p.b>=p.d)return l.w=null}return l.w=p}for(m=null,o=0;o<s.length;++o)m=A.cF(m,s[o].aa(a))
return l.w=m},
$iB:1}
A.hZ.prototype={
$1(a){return t.u.a(a).gK()},
$S:1}
A.hY.prototype={
$1(a){return t.u.a(a).ga8()},
$S:1}
A.ey.prototype={
ga8(){return this.gK()},
aa(a){var s=this
if(s.gK()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.co(a)},
$iB:1}
A.av.prototype={
gK(){return this.e.a!=null},
co(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.q(a),f=g.length
if(f===0)return B.aN
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
if(h>q)q=h}return new A.aE(s,r,p,q)}}
A.aU.prototype={
gK(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
co(a){var s,r,q,p=this.r.q(a),o=this.w.q(a),n=o.length
if(0>=n)return A.a(o,0)
s=Math.abs(o[0]*0.5)
if(1>=n)return A.a(o,1)
r=Math.abs(o[1]*0.5)
n=p.length
if(0>=n)return A.a(p,0)
q=p[0]
if(1>=n)return A.a(p,1)
n=p[1]
return new A.aE(q-s,n-r,q+s,n+r)}}
A.b2.prototype={
gK(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
co(a){var s,r,q,p=this,o=p.w.q(a),n=p.y.q(a)
if(0>=n.length)return A.a(n,0)
n=n[0]
s=p.z.q(a)
if(0>=s.length)return A.a(s,0)
r=Math.abs(n)*(1+Math.abs(s[0]*0.01)*0.5)
if(p.e){n=p.Q
if(n==null)n=null
else{n=n.q(a)
if(0>=n.length)return A.a(n,0)
n=n[0]}if(n==null)n=0
s=p.as
if(s==null)s=null
else{s=s.q(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null)s=0
q=Math.abs(n)*(1+Math.abs(s)*0.01*0.5)
if(q>r)r=q}n=o.length
if(0>=n)return A.a(o,0)
s=o[0]
if(1>=n)return A.a(o,1)
n=o[1]
return new A.aE(s-r,n-r,s+r,n+r)},
fm(d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=this,d4=t.bp
d4.a(d6)
d4.a(d7)
t.fi.a(d8)
t.O.a(d9)
s=d3.w.q(d5)
d4=s.length
if(0>=d4)return A.a(s,0)
r=s[0]
if(1>=d4)return A.a(s,1)
q=s[1]
d4=d3.x.q(d5)
if(0>=d4.length)return A.a(d4,0)
p=d4[0]
d4=d3.y.q(d5)
if(0>=d4.length)return A.a(d4,0)
o=d4[0]
d4=d3.z.q(d5)
if(0>=d4.length)return A.a(d4,0)
n=d4[0]
d4=d3.r.q(d5)
if(0>=d4.length)return A.a(d4,0)
m=d4[0]
if(d3.e){l=Math.max(1,m)
d4=d3.Q
if(d4==null)k=null
else{d4=d4.q(d5)
if(0>=d4.length)return A.a(d4,0)
d4=d4[0]
k=d4}if(k==null)k=0
d4=d3.as
if(d4==null)j=null
else{d4=d4.q(d5)
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
a5=B.c.Y(l)*2
for(d4=Math.abs(c)<=0.0001,a6=a1!==0,a7=a5-2,a8=h*e/2,a9=a5-1,b0=Math.abs(b)<=0.0001,b1=!1,b2=0;b2<a5;++b2,a4=b3,a0=b6,a=b5,a3=b8,a2=b7){b3=b1?o:k
b4=a6&&b2===a7?a8:g
if(a6&&b2===a9)b3=a1
b5=Math.sin(i)
b6=Math.cos(i)
b7=r+b3*b6
b8=q+b3*b5
if(d4&&b0)d7.$2(b7,b8)
else{b9=A.it(a,a0,a4)
c0=A.it(b5,b6,b3)
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
b1=!b1}d9.$0()}else{l=Math.max(1,B.c.U(m))
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
if(d4){d1=A.it(a,a0,o)
d2=A.it(b5,b6,o)
d8.$8(a2-d*d1.a,a3-d*d1.b,b7+d*d2.a,b8+d*d2.b,b7,b8,a2,a3)}else d7.$2(b7,b8)
i+=h}d9.$0()}}}
A.bm.prototype={
gcd(){var s,r=this,q=r.fr
if(q===$){s=B.a.af(r.a,new A.i5())
r.fr!==$&&A.R()
r.fr=s
q=s}return q},
fZ(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.a.gai(r.a)
while(s instanceof A.Y)s=s.a
if((s instanceof A.aU||s instanceof A.av||s instanceof A.b2)&&s.gK())return s
return null},
d5(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.Z)(s),++p)q=A.cF(q,s[p].aa(a))
return q},
gK(){var s,r,q,p=this,o=null,n=!1
if(p.gcd())if(p.b.a!=null)if(p.c.a!=null)if(p.d.a!=null){s=p.y
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
n=n==null?o:n.gK()
n=n!==!1}}return n},
b9(a){var s,r,q,p,o,n,m=this,l=m.c.q(a)
if(0>=l.length)return A.a(l,0)
if(B.c.F(l[0])<=0)return null
if(m.e){l=m.d.q(a)
if(0>=l.length)return A.a(l,0)
s=l[0]
if(s<=0)return null
r=m.w===1?Math.max(1.42,m.x):1.42
q=s*0.5*r+1}else q=0
if(m.gcd()){p=m.fy
if(p===$){o=m.d5(0)
m.fy!==$&&A.R()
m.fy=o
p=o}n=p}else n=m.d5(a)
if(n==null)return null
return q===0?n:n.hE(q)},
$iaL:1}
A.i5.prototype={
$1(a){return t.u.a(a).ga8()},
$S:1}
A.bv.prototype={
aO(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
S(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
ak(){return this.S(!1)}}
A.a7.prototype={
gP(a){return this.f===0&&this.r===0&&!this.x},
j(a){var s=this
s.w=s.r=s.f=0
s.x=!1},
S(a){var s,r,q=this
q.j(0)
s=a?512:8192
if(q.a.length>s){q.a=new Float64Array(512)
q.b=new Float64Array(512)}r=a?32:512
if(q.c.length>r){q.c=new Int32Array(32)
q.d=new Int32Array(32)
q.e=new Uint8Array(32)}},
ak(){return this.S(!1)},
e2(){var s=this,r=Math.max(1,s.f),q=A.cm(Math.max(1,s.r),r)
B.e.B(q.a,0,s.f,s.a)
B.e.B(q.b,0,s.f,s.b)
B.f.B(q.c,0,s.r,s.c)
B.f.B(q.d,0,s.r,s.d)
B.d.B(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
return q},
hv(a){while(this.a.length<a)this.da()},
da(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.e.B(o,0,r.f,q)
s=new Float64Array(p)
B.e.B(s,0,r.f,r.b)
r.a=o
r.b=s},
e7(a){while(this.c.length<a)this.d9()},
d9(){var s=this,r=s.c,q=r.length*2,p=new Int32Array(q)
B.f.B(p,0,s.r,r)
s.c=p
r=new Int32Array(q)
B.f.B(r,0,s.r,s.d)
s.d=r
r=new Uint8Array(q)
B.d.B(r,0,s.r,s.e)
s.e=r},
a5(a){var s,r,q,p=this
if(p.x)p.a3()
p.x=!0
p.w=p.f
if(p.r===p.c.length)p.d9()
s=p.c
r=p.r
q=p.w
s.$flags&2&&A.c(s)
if(!(r<s.length))return A.a(s,r)
s[r]=q
q=p.e
s=a?1:0
q.$flags&2&&A.c(q)
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
if(Math.abs(a-p)+Math.abs(b-r[q])<1e-7)return}if(s===o.a.length)o.da()
s=o.a
r=o.f
s.$flags&2&&A.c(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a
s=o.b
s.$flags&2&&A.c(s)
if(!(r<s.length))return A.a(s,r)
s[r]=b
o.f=r+1},
cl(a1,a2,a3,a4,a5,a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=this
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
a0.cl(a1,a2,m,l,g,f,c,b,a9,a)
a0.cl(c,b,e,d,i,h,a7,a8,a9,a)},
X(a,b,c,d,e,f,g,h,i){return this.cl(a,b,c,d,e,f,g,h,i,0)},
a3(){var s,r,q,p,o,n,m,l,k,j,i=this
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
s.$flags&2&&A.c(s)
if(!(p<s.length))return A.a(s,p)
s[p]=r
i.r=p+1},
ae(a9,b0,b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=this,a8=a9.r
if(a8===0||a9.f===0)return
a7.hv(a7.f+a9.f)
a7.e7(a7.r+a8)
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
a7.a5(m[e]===1)
a=a7.f
if(k){a0=a+b
B.e.O(s,a,a0,q,d)
B.e.O(r,a,a0,p,d)
a=a0}else if(l)for(a1=s.$flags|0,a2=r.$flags|0,a3=d;a3<c;++a3){if(!(a3>=0&&a3<j))return A.a(q,a3)
a4=q[a3]
a1&2&&A.c(s)
if(!(a>=0&&a<s.length))return A.a(s,a)
s[a]=b0*a4+b4
if(!(a3<i))return A.a(p,a3)
a4=p[a3]
a2&2&&A.c(r)
if(!(a<r.length))return A.a(r,a)
r[a]=b3*a4+b5;++a}else for(a1=s.$flags|0,a2=r.$flags|0,a3=d;a3<c;++a3){if(!(a3>=0&&a3<j))return A.a(q,a3)
a5=q[a3]
if(!(a3<i))return A.a(p,a3)
a6=p[a3]
a1&2&&A.c(s)
if(!(a>=0&&a<s.length))return A.a(s,a)
s[a]=b0*a5+b2*a6+b4
a2&2&&A.c(r)
if(!(a<r.length))return A.a(r,a)
r[a]=b1*a5+b3*a6+b5;++a}a7.f=a
a7.a3()}}}
A.at.prototype={
j(a){var s=this
s.b=0
s.d=s.c=2147483647
s.f=s.e=0},
aU(a){var s=this,r=[s.a,s.b,s.c,s.d,s.e,s.f],q=r[0],p=r[1],o=r[2],n=r[3],m=r[4],l=r[5]
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
S(a){var s
this.j(0)
s=a?1024:16384
if(this.a.gA().length>s*2)this.a.ar(2048,0)},
ak(){return this.S(!1)},
e5(a){var s=this,r=a.b*2
if(s.a.gA().length<r)s.a.ar(r,0)
B.f.B(s.a.gA(),0,r,a.a.gA())
s.b=a.b
s.c=a.c
s.d=a.d
s.e=a.e
s.f=a.f},
aX(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
if(c<=0||d<=0)return!1
s=(d>256?256:d)-1
r=f.a.gA()
q=f.b
if(q>0){p=(q-1)*2
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
n=r[p]
if(n>>>16===a){m=p+1
if(!(m<o))return A.a(r,m)
l=r[m]
if((l&255)===s){k=l>>>8
if((n&65535)+k===b){r.$flags&2&&A.c(r)
r[m]=(k+c<<8|s)>>>0
j=b+c
if(j>f.e)f.e=j
return!1}}}}i=q*2
h=i+2>r.length
if(h){q=f.a
q.ar(q.gA().length*2,f.b*2)}g=f.a.gA()
g.$flags&2&&A.c(g)
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
eA(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a===0){i.j(0)
return}s=i.a.gA()
for(r=i.b*2,q=s.length,p=s.$flags|0,o=0,n=0;n<r;n+=2){m=n+1
if(!(m<q))return A.a(s,m)
l=s[m]
k=B.b.I(((l&255)+1)*a+128,8)
if(k===0)continue
j=o+1
if(!(n<q))return A.a(s,n)
m=s[n]
p&2&&A.c(s)
if(!(o<q))return A.a(s,o)
s[o]=m
o=j+1
s.$flags&2&&A.c(s)
if(!(j<q))return A.a(s,j)
s[j]=(l&4294967040|k-1)>>>0}i.b=B.b.J(o,2)}}
A.f0.prototype={
hS(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
c.j(0)
if(a0>=a2||a1>=a3||a.r===0)return
s=d.b
r=s.length
if(a3>r){q=Math.max(a3,r*2)
s=new Int32Array(q)
B.f.ag(s,0,q,-1)
d.b=s}else{p=d.fy
o=d.fx
if(p>=o){n=Math.max(0,o)
m=Math.min(r,p+1)
if(m>n)B.f.ag(s,n,m,-1)}}d.ch=a0
d.CW=a1
d.cx=a2
d.cy=a3
d.db=a0*256
d.dx=a1*256
d.dy=a2*256
d.fr=a3*256
d.fx=a3
d.fy=a1-1
d.r=0
d.ok=!1
l=d.id=d.go=0
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
d.c0()
d.go=A.cP(g)
d.id=A.cP(f)
for(e=i+1;e<h;++e){if(!(e<s))return A.a(k,e)
p=k[e]
if(!(e<r))return A.a(j,e)
o=j[e]
d.du(A.cP(p),A.cP(o))}d.du(A.cP(g),A.cP(f))}d.eJ(b,c)},
hT(a,b,c,d,e,f,g,h,i,j,k){if(k===0||c>=e||d>=f||a.r===0)return!0
return!1},
c0(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(!d.ok)return
d.ok=!1
s=d.k3
r=d.k4
q=s===0
if(q&&r===0)return
p=d.k2
if(p<d.CW||p>=d.cy)return
o=d.k1
n=d.ch
if(o<n){if(q)return
o=n
m=0}else{if(o>=d.cx)return
m=r}if(p<d.fx)d.fx=p
if(p>d.fy)d.fy=p
q=d.b
if(!(p>=0&&p<q.length))return A.a(q,p)
l=q[p]
for(q=d.f,k=q.length,j=d.c,i=j.length,h=-1;l!==-1;h=l,l=f){if(!(l>=0&&l<i))return A.a(j,l)
g=j[l]
if(g===o){q=d.d
if(!(l<q.length))return A.a(q,l)
k=q[l]
q.$flags&2&&A.c(q)
q[l]=k+s
k=d.e
if(!(l<k.length))return A.a(k,l)
q=k[l]
k.$flags&2&&A.c(k)
k[l]=q+m
return}if(g>o)break
if(!(l<k))return A.a(q,l)
f=q[l]}q=d.r
if(q===i){e=i*2
k=new Int32Array(e)
B.f.B(k,0,q,j)
d.c=k
q=new Int32Array(e)
B.f.B(q,0,d.r,d.d)
d.d=q
q=new Int32Array(e)
B.f.B(q,0,d.r,d.e)
d.e=q
q=new Int32Array(e)
B.f.B(q,0,d.r,d.f)
d.f=q}q=d.r++
k=d.c
k.$flags&2&&A.c(k)
if(!(q<k.length))return A.a(k,q)
k[q]=o
k=d.d
k.$flags&2&&A.c(k)
if(!(q<k.length))return A.a(k,q)
k[q]=s
k=d.e
k.$flags&2&&A.c(k)
if(!(q<k.length))return A.a(k,q)
k[q]=m
k=d.f
k.$flags&2&&A.c(k)
j=k.length
if(!(q<j))return A.a(k,q)
k[q]=l
if(h===-1){k=d.b
k.$flags&2&&A.c(k)
if(!(p<k.length))return A.a(k,p)
k[p]=q}else{if(!(h>=0&&h<j))return A.a(k,h)
k[h]=q}},
dw(a,b){var s=this
if(s.ok){if(s.k1===a&&s.k2===b)return
s.c0()}s.k1=a
s.k2=b
s.k4=s.k3=0
s.ok=!0},
aE(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.ch
if(b<s){r.dw(s,a)
r.k3+=e
return}if(b>=r.cx)return
r.dw(b,a)
r.k3+=e
r.k4=r.k4+(c+d)*e},
aL(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.CW||a>=g.cy)return
s=B.b.aT(B.b.I(b,8),32)
r=B.b.aT(B.b.I(d,8),32)
q=s*256
p=r*256
if(s===r){g.aE(a,s,b-q,d-q,f)
return}o=d-b
n=b-q
if(d>b){m=g.ch
if(s<m){if(r<m){g.aE(a,m,0,0,f)
return}l=c+B.b.a0((g.db-b)*f,o)
g.aE(a,m,0,0,l-c)
s=g.ch
k=l
n=0}else k=c
for(;;){if(!(s<r&&s<g.cx))break
j=s+1
i=c+B.b.a0((j*256-b)*f,o)
g.aE(a,s,n,256,i-k)
k=i
s=j
n=0}if(s<g.cx)g.aE(a,s,n,d-p,e-k)}else{m=g.cx
if(s>=m){if(r>=m)return
l=c+B.b.a0((g.dy-b)*f,o)
s=m-1
k=l
n=256}else k=c
for(;;){if(!(s>r&&s>=g.ch))break
i=c+B.b.a0((s*256-b)*f,o)
g.aE(a,s,n,0,i-k);--s
k=i
n=256}m=g.ch
h=e-k
if(s<m)g.aE(a,m,0,0,h)
else g.aE(a,s,n,d-p,h)}},
du(a,b){this.fV(a,b)
return},
fV(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.go,b=d.id
d.go=a
d.id=a0
s=a0-b
if(s===0)return
r=B.b.aT(B.b.I(b,8),32)
q=B.b.aT(B.b.I(a0,8),32)
p=d.CW
o=r<p
if(o&&q<p)return
n=d.cy
m=r>=n
if(m&&q>=n)return
if(r===q){l=r*256
d.aL(r,c,b-l,a,a0-l)
return}k=a-c
if(s>0){if(o){j=d.dx
i=c+B.b.a0((j-b)*k,s)
r=p}else{j=b
i=c}for(;;){if(!(r<q&&r<d.cy))break
p=r+1
h=p*256
g=c+B.b.a0((h-b)*k,s)
d.aL(r,i,j-r*256,g,256)
j=h
i=g
r=p}if(r<d.cy){o=r*256
d.aL(r,i,j-o,a,a0-o)}}else{if(m){j=d.fr
i=c+B.b.a0((j-b)*k,s)
r=n-1}else{j=b
i=c}if(r===q){if(r>=p){l=r*256
d.aL(r,i,j-l,a,a0-l)}return}f=r*256
e=c+B.b.a0((f-b)*k,s)
if(r>=p)d.aL(r,i,j-f,e,0);--r
i=e
for(;;){if(!(r>q&&r>=d.CW))break
g=c+B.b.a0((r*256-b)*k,s)
d.aL(r,i,256,g,0);--r
i=g}if(r>=d.CW)d.aL(r,i,256,a,a0-r*256)}},
eJ(a,b){this.h5(a,b)
return},
h5(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.c0()
s=i.fy
r=i.fx
if(s<r)return
q=Math.max(i.CW,r)
p=Math.min(i.cy-1,s)
for(o=q;o<=p;++o){s=i.b
if(!(o>=0&&o<s.length))return A.a(s,o)
n=s[o]
s.$flags&2&&A.c(s)
s[o]=-1
if(n===-1)continue
m=i.ch
for(l=0;n!==-1;){s=i.c
if(!(n>=0&&n<s.length))return A.a(s,n)
k=s[n]
if(k>m&&l!==0){j=A.jo(l*512,a)
if(j>0)b.aX(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.jo(l*512-s[n],a)
if(j>0)b.aX(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.cx){j=A.jo(l*512,a)
if(j>0)b.aX(o,m,i.cx-m,j)}}i.fy=i.CW-1
i.fx=i.cy}}
A.fG.prototype={
$3(a,b,c){var s=this.a,r=this.b
return B.b.D(B.c.F((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
$S:74}
A.fI.prototype={
$1(a){var s,r,q=this
a+=q.a
s=q.b
if(s<0){r=q.c
a=r+(a-r)*r/(r-s)}s=q.d
if(s>1){r=q.c
a=r+(a-r)*(1-r)/(s-r)}return a},
$S:75}
A.cl.prototype={
gm(a){return this.b}}
A.hX.prototype={
W(){var s,r,q=this,p=q.a,o=q.b,n=q.c
for(s=p.length;n<o;){if(!(n>=0&&n<s))return A.a(p,n)
r=p[n]
if(r!==32&&r!==9&&r!==10&&r!==13)break;++n}q.c=n},
c5(a){var s,r,q=this,p=null,o=q.c
if(o>=q.b)throw A.h(A.P("Unexpected end of JSON at "+o,p,p))
s=q.a
if(!(o>=0&&o<s.length))return A.a(s,o)
r=s[o]
if(r===123)return q.fI()
if(r===91)return q.fB(a)
if(r===34)return q.dq(!1)
if(r===116){q.fJ()
return!0}if(r===102){q.fF()
return!1}if(r===110)return q.fG()
if(r>=48&&r<=57||r===45)return q.fH()
throw A.h(A.P("Unexpected byte "+r+" at "+o,p,p))},
fI(){var s,r,q,p,o,n,m,l,k=this,j=null
if(++k.d>256)throw A.h(A.P("JSON nesting depth exceeds 256 at "+k.c,j,j));++k.c
k.W()
s=A.V(t.N,t.z)
r=k.c
q=k.b
if(r<q){p=k.a
if(!(r>=0&&r<p.length))return A.a(p,r)
p=p[r]===125}else p=!1
if(p){k.c=r+1;--k.d
return s}for(r=k.a,p=r.length;;){o=k.c
if(o<q){if(!(o>=0&&o<p))return A.a(r,o)
n=r[o]!==34}else n=!0
if(n)throw A.h(A.P("Expected object key at "+o,j,j))
m=k.dq(!0)
k.W()
o=k.c
if(o<q){if(!(o>=0&&o<p))return A.a(r,o)
n=r[o]!==58}else n=!0
if(n)throw A.h(A.P('Expected ":" at '+o,j,j))
k.c=o+1
k.W()
s.n(0,m,k.c5(m))
k.W()
o=k.c
if(o>=q)throw A.h(A.P("Unterminated object at "+o,j,j))
if(!(o>=0&&o<p))return A.a(r,o)
l=r[o]
if(l===44){k.c=o+1
k.W()
continue}if(l===125){k.c=o+1;--k.d
return s}throw A.h(A.P('Expected "," or "}" at '+o,j,j))}},
fB(a){var s,r,q,p,o,n,m,l,k,j,i=this,h=null
if(++i.d>256)throw A.h(A.P("JSON nesting depth exceeds 256 at "+i.c,h,h))
s=++i.c
i.W()
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
if(r){n=i.ha()
if(n!=null){--i.d
return n}i.c=s
i.W()}r=i.c
if(r<q){p=i.a
if(!(r>=0&&r<p.length))return A.a(p,r)
m=p[r]}else m=0
if(m>=48&&m<=57||m===45){l=i.h9(a==="k"||a==="s"||a==="e"||a==="to"||a==="ti")
if(l!=null){--i.d
return l}i.c=s
i.W()}k=[]
for(s=i.a,r=s.length;;){k.push(i.c5(h))
i.W()
p=i.c
if(p>=q)throw A.h(A.P("Unterminated array at "+p,h,h))
if(!(p>=0&&p<r))return A.a(s,p)
j=s[p]
if(j===44){i.c=p+1
i.W()
continue}if(j===93){i.c=p+1;--i.d
return k}throw A.h(A.P('Expected "," or "]" at '+p,h,h))}},
ha(){var s,r,q,p,o,n,m,l,k,j,i=this,h=null,g=i.e,f=i.a,e=i.b
for(s=f.length,r=0;;){q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==91}else p=!0
if(p)return h
i.c=q+1
i.W()
o=i.cf()
if(o==null)return h
i.W()
q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==44}else p=!0
if(p)return h
i.c=q+1
i.W()
n=i.cf()
if(n==null)return h
i.W()
q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==93}else p=!0
if(p)return h
i.c=q+1
m=r*2
q=g.length
if(m+2>q){l=new Float32Array(q*2)
B.k.B(l,0,m,g)
i.e=l
g=l}g.$flags&2&&A.c(g)
q=g.length
if(!(m<q))return A.a(g,m)
g[m]=o
p=m+1
if(!(p<q))return A.a(g,p)
g[p]=n;++r
i.W()
q=i.c
if(q>=e)return h
if(!(q>=0&&q<s))return A.a(f,q)
k=f[q]
if(k===44){i.c=q+1
i.W()
continue}if(k===93){i.c=q+1
s=r*2
j=new Float32Array(s)
B.k.B(j,0,s,g)
return new A.cl(j,r)}return h}},
h9(a){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.f,g=i.a,f=i.b
for(s=g.length,r=0;;r=n){q=i.cf()
if(q==null)return null
p=h.length
if(r>=p){o=new Float64Array(p*2)
B.e.B(o,0,r,h)
i.f=o
h=o}n=r+1
h.$flags&2&&A.c(h)
p=h.length
if(!(r<p))return A.a(h,r)
h[r]=q
i.W()
m=i.c
if(m>=f)return null
if(!(m>=0&&m<s))return A.a(g,m)
l=g[m]
if(l===44){i.c=m+1
i.W()
continue}if(l===93){i.c=m+1
if(a&&n>=4){k=new Float32Array(n)
for(j=0;j<n;++j){if(!(j<p))return A.a(h,j)
s=h[j]
if(!(j<n))return A.a(k,j)
k[j]=s}return k}k=new Float64Array(n)
B.e.B(k,0,n,h)
return k}return null}},
cf(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e=g.a,d=g.b,c=g.c
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
return A.jB(A.ef(e,c,i))}g.c=q
if(k)return A.jB(A.ef(e,c,q))
if(j===0)h=o
else{if(!(j<16))return A.a(B.r,j)
h=o/B.r[j]}return r?-h:h},
fH(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e="Invalid number at ",d=null,c=f.a,b=f.b,a=f.c,a0=c.length
if(!(a>=0&&a<a0))return A.a(c,a)
s=c[a]===45
if(s){r=a+1
if(r>=b)throw A.h(A.P(e+a,d,d))}else r=a
if(!(r<a0))return A.a(c,r)
q=c[r]
if(q<48||q>57)throw A.h(A.P(e+a,d,d))
p=0
o=0
if(q===48){++r
if(r<b){if(!(r<a0))return A.a(c,r)
n=c[r]
n=n>=48&&n<=57}else n=!1
if(n)throw A.h(A.P("Leading zero in number at "+a,d,d))}else while(r<b){if(!(r<a0))return A.a(c,r)
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
if(o<15){p=p*10+m;++j}else l=!0;++o;++i}if(i===r)throw A.h(A.P("Invalid fraction at "+a,d,d))
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
if(!n)break;++i}if(i===r)throw A.h(A.P("Invalid exponent at "+a,d,d))
r=i
k=!0
l=!0}f.c=r
if(!k&&!l){if(s&&p===0)return-0.0
return s?-p:p}if(l){h=A.ef(c,a,r)
return k?A.pb(h):A.lQ(h,d)}if(j===0)g=p
else{if(!(j<16))return A.a(B.r,j)
g=p/B.r[j]}return s?-g:g},
dq(a){var s,r,q,p,o,n,m=this,l=null,k=m.a,j=m.b,i=++m.c
for(s=k.length,r=i,q=!0;r<j;){if(!(r>=0&&r<s))return A.a(k,r)
p=k[r]
if(p===34){m.c=r+1
o=r-i
if(o===0)return""
if(a&&q){n=A.nv(k,i,o)
if(n!=null)return n}if(q)return A.ef(k,i,r)
s=t.L.a(A.b1(k,i,r))
return new A.eH(!1).d_(s,0,l,!0)}if(p===92)return m.fE(i-1)
if(p<32)throw A.h(A.P("Unescaped control character in string at "+r,l,l))
if(p>=128)q=!1;++r}throw A.h(A.P("Unterminated string at "+i,l,l))},
fE(a){var s,r,q=null,p=this.a,o=this.b,n=a+1
for(s=p.length;n<o;){if(!(n>=0&&n<s))return A.a(p,n)
r=p[n]
if(r===92){n+=2
continue}if(r===34){s=n+1
this.c=s
s=t.L.a(A.b1(p,a,s))
return A.D(B.z.e6(new A.eH(!1).d_(s,0,q,!0),q))}++n}throw A.h(A.P("Unterminated escaped string at "+a,q,q))},
fJ(){var s,r,q,p=this,o=p.c,n=o+4,m=!1
if(n<=p.b){s=p.a
r=o+1
q=s.length
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===114){r=o+2
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===117){m=o+3
if(!(m>=0&&m<q))return A.a(s,m)
m=s[m]===101}}}if(m){p.c=n
return!0}throw A.h(A.P("Invalid token at "+o,null,null))},
fF(){var s,r,q,p=this,o=p.c,n=o+5,m=!1
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
return!1}throw A.h(A.P("Invalid token at "+o,null,null))},
fG(){var s,r,q,p=this,o=p.c,n=o+4,m=!1
if(n<=p.b){s=p.a
r=o+1
q=s.length
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===117){r=o+2
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===108){m=o+3
if(!(m>=0&&m<q))return A.a(s,m)
m=s[m]===108}}}if(m){p.c=n
return null}throw A.h(A.P("Invalid token at "+o,null,null))}}
A.fQ.prototype={}
A.dR.prototype={
H(a,b){var s
if(b==null)return!1
if(this!==b)s=b instanceof A.dR&&A.iO(b)===A.iO(this)&&b.a===this.a
else s=!0
return s},
gZ(a){return A.e5(A.iO(this),this.a,B.m,B.m)}}
A.fa.prototype={
h2(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=null,b=d.w
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
if(p){B.a.n(b,a,$.kh())
return c}o=a*d.c
p=d.d
q+=a
if(!(q<p.length))return A.a(p,q)
n=p[q]
m=a*4
q=r.length
if(!(m<q))return A.a(r,m)
p=r[m]
l=!0
if(p===0){k=m+1
if(!(k<q))return A.a(r,k)
if(r[k]===0){k=m+2
if(!(k<q))return A.a(r,k)
if(r[k]===0){l=m+3
if(!(l<q))return A.a(r,l)
l=r[l]!==0}}}if(l){l=d.e
k=l.length
if(!(o<k))return A.a(l,o)
j=l[o]
i=o+1
if(!(i<k))return A.a(l,i)
i=l[i]
h=m+1
if(!(h<q))return A.a(r,h)
h=r[h]
if(!(n>=0&&n<k))return A.a(l,n)
g=l[n]
f=m+2
if(!(f<q))return A.a(r,f)
f=r[f]
e=n+1
if(!(e<k))return A.a(l,e)
e=l[e]
k=m+3
if(!(k<q))return A.a(r,k)
e=new Float32Array(A.ae(A.f([j,i,j+p,i+h,g+f,e+r[k],g,e],t.n)))
q=new A.dw(e,new Float32Array(129))
q.eL(l,o,n,r,m)
B.a.n(b,a,q)
return q}B.a.n(b,a,$.kh())
return c},
cp(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
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
l=new A.fb()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.ia()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.fb.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:76}
A.F.prototype={
gbf(){var s=this.a
s=s==null?null:s.length
return s==null?this.d.length:s},
q(c3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=this,c2=c1.a
if(c2!=null)return c2
if(c3===c1.w)return c1.d
c1.w=c3
s=c1.b
r=s.a
q=s.e
p=s.c
c2=c1.d
o=c2.length
if(c3<B.e.ga7(r)){B.k.B(c2,0,o,q)
return c2}if(c3>=B.e.gaA(r)){B.k.O(c2,0,o,q,(r.length-1)*p)
return c2}n=c1.r
m=r.length
l=m-1
k=!0
if(n<l){if(!(n<m))return A.a(r,n)
if(!(c3<r[n])){k=n+1
if(!(k<m))return A.a(r,k)
k=c3>=r[k]}}if(k){for(j=0;j+1<l;){i=B.b.I(j+l,1)
if(!(i<m))return A.a(r,i)
if(r[i]<=c3)j=i
else l=i}c1.r=j
n=j}h=n*p
k=s.d
g=k.length
if(!(n>=0&&n<g))return A.a(k,n)
f=k[n]
if((f&1)!==0){B.k.O(c2,0,o,q,h)
return c2}e=m+n
if(!(e<g))return A.a(k,e)
d=k[e]
e=n+1
if(!(e<m))return A.a(r,e)
e=r[e]
if(!(n<m))return A.a(r,n)
c=r[n]
b=e-c
a=b<=0?0:B.c.D((c3-c)/b,0,1)
m=2*m+n
if(!(m<g))return A.a(k,m)
a0=k[m]
a1=B.b.I(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.cp(a0,a)
a4=s.h2(n)
if(a4!=null)a4.ez(B.c.D(a3,0,1),c2)
else if(c1.f)for(n=q.length,k=c2.$flags|0,g=a1>1,a5=0;a5<o;++a5){a6=g&&m?s.cp(a0+4*B.b.N(a5,a1),a):a3
e=h+a5
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.m2()
e=B.b.D(B.c.F(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
a7=c[e]
e=d+a5
if(!(e>=0&&e<n))return A.a(q,e)
e=B.b.D(B.c.F(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.fM(a7+(c[e]-a7)*B.c.D(a6,0,1))
k&2&&A.c(c2)
c2[a5]=e}else if(a1<=1||a2)if(a3<=0)B.k.O(c2,0,o,q,h)
else if(a3>=1)B.k.O(c2,0,o,q,d)
else{a8=o-3
for(n=q.length,m=c2.$flags|0,a9=d,b0=h,a5=0;a5<a8;){if(!(b0<n))return A.a(q,b0)
b1=q[b0]
if(!(a9>=0&&a9<n))return A.a(q,a9)
b2=q[a9]
k=b1===b2?b1:b1+(b2-b1)*a3
m&2&&A.c(c2)
c2[a5]=k
k=b0+1
if(!(k<n))return A.a(q,k)
b3=q[k]
k=a9+1
if(!(k<n))return A.a(q,k)
b4=q[k]
k=b3===b4?b3:b3+(b4-b3)*a3
c2[a5+1]=k
k=b0+2
if(!(k<n))return A.a(q,k)
b5=q[k]
k=a9+2
if(!(k<n))return A.a(q,k)
b6=q[k]
k=b5===b6?b5:b5+(b6-b5)*a3
c2[a5+2]=k
k=b0+3
if(!(k<n))return A.a(q,k)
b7=q[k]
k=a9+3
if(!(k<n))return A.a(q,k)
b8=q[k]
k=b7===b8?b7:b7+(b8-b7)*a3
c2[a5+3]=k
a5+=4
b0+=4
a9+=4}for(;a5<o;++a5,++b0,++a9){if(!(b0<n))return A.a(q,b0)
b9=q[b0]
if(!(a9>=0&&a9<n))return A.a(q,a9)
c0=q[a9]
k=b9===c0?b9:b9+(c0-b9)*a3
m&2&&A.c(c2)
c2[a5]=k}}else for(n=q.length,m=c2.$flags|0,a5=0;a5<o;++a5){a6=s.cp(a0+4*B.b.N(a5,a1),a)
k=h+a5
if(!(k<n))return A.a(q,k)
b9=q[k]
k=d+a5
if(!(k>=0&&k<n))return A.a(q,k)
c0=q[k]
if(a6<=0)k=b9
else if(a6>=1)k=c0
else k=b9===c0?b9:b9+(c0-b9)*a6
m&2&&A.c(c2)
c2[a5]=k}return c2}}
A.dw.prototype={
eL(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.a,g=h.length
if(0>=g)return A.a(h,0)
s=h[0]
if(1>=g)return A.a(h,1)
r=h[1]
for(h=i.b,g=h.length,q=g-1,p=h.$flags|0,o=1;o<g;++o,r=m,s=n){e=o/q
n=i.br(e,0)
m=i.br(e,1)
l=h[o-1]
k=n-s
j=m-r
j=Math.sqrt(k*k+j*j)
p&2&&A.c(h)
h[o]=l+j}},
br(a,b){var s,r,q,p,o,n=1-a,m=this.a,l=m.length
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
ez(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this
if(a<=0){s=h.a
r=s.length
if(0>=r)return A.a(s,0)
q=s[0]
b.$flags&2&&A.c(b)
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
b.$flags&2&&A.c(b)
p=b.length
if(0>=p)return A.a(b,0)
b[0]=q
if(7>=r)return A.a(s,7)
s=s[7]
if(1>=p)return A.a(b,1)
b[1]=s
return}s=h.b
o=B.k.gaA(s)*a
r=s.length
n=r-1
for(m=n,l=0;l+1<m;){k=B.b.I(l+m,1)
if(!(k<r))return A.a(s,k)
if(s[k]<=o)l=k
else m=k}if(!(m>=0&&m<r))return A.a(s,m)
q=s[m]
if(!(l>=0&&l<r))return A.a(s,l)
s=s[l]
j=q-s
i=(l+(j===0?0:(o-s)/j))/n
s=h.br(i,0)
b.$flags&2&&A.c(b)
r=b.length
if(0>=r)return A.a(b,0)
b[0]=s
s=h.br(i,1)
b.$flags&2&&A.c(b)
if(1>=r)return A.a(b,1)
b[1]=s}}
A.fR.prototype={
hk(){var s,r,q,p,o,n,m,l,k,j,i=this.a,h=J.W(i)
switch(A.j(A.a0(h.h(i,0)))){case 0:s=h.h(i,1)==null?null:A.D(h.h(i,1))
r=A.j(A.a0(h.h(i,2)))
i=new A.du([0,h.gm(i)<=3||A.aP(h.h(i,3)),s,0,r])
break
case 1:s=A.D(h.h(i,1))
i=new A.ds([1,t.bm.a(h.h(i,2)),s,A.aP(h.h(i,3))])
break
case 2:s=A.j(A.a0(h.h(i,1)))
r=A.D(h.h(i,2))
q=A.D(h.h(i,3))
p=A.a0(h.h(i,4))
o=A.j(A.a0(h.h(i,5)))
n=A.j(A.a0(h.h(i,6)))
m=A.j(A.a0(h.h(i,7)))
l=A.j(A.a0(h.h(i,8)))
n=new A.dm([2,q,r,p,o,m,A.aP(h.h(i,9)),s,l,n])
i=n
break
case 5:s=A.j(A.a0(h.h(i,1)))
r=A.D(h.h(i,2))
q=A.D(h.h(i,3))
p=A.j(A.a0(h.h(i,4)))
o=A.j(A.a0(h.h(i,5)))
n=A.a0(h.h(i,6))
m=A.a0(h.h(i,7))
l=A.j(A.a0(h.h(i,8)))
k=A.j(A.a0(h.h(i,9)))
j=A.j(A.a0(h.h(i,10)))
l=new A.dn([5,q,r,m,k,A.aP(h.h(i,11)),s,n,o,p,j,l])
i=l
break
case 4:i=B.aD
break
default:i=A.v(B.a1)}return i}}
A.j2.prototype={
$3(a,b,c){var s=$.a6,r=$.eP
return new A.aM(this.a.gcq()-a,s-b.a-c,r-b.b)},
$S:77}
A.j1.prototype={
$1(a){var s,r,q=this.b
if(q.gA().length<a){s=Math.max(65536,q.gA().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.ar(s,0)}},
$S:16}
A.j3.prototype={
$1(a){return A.b1(this.a.gA(),0,a)},
$S:79}
A.j4.prototype={
$1(a){var s=this,r=s.b,q=r.gA()
if(q.length<=262144){s.a.a=0
return}if(a<=65536){q=s.a
if(++q.a>=16){q.a=0
q=s.c
q.a=null
q.b=-1
r.ar(65536,0)}}else s.a.a=0},
$S:16}
A.j9.prototype={
$4$poster(a,b,c,d){var s,r,q,p,o,n=this.a,m=n.u(0,a)
if(m==null)return
n.n(0,a,m)
n=this.b
s=n.h(0,a)
r=(s==null?0:s)+1
n.n(0,a,r)
n=this.c
q=n.h(0,a)
if(q==null){q=A.V(t.N,t.E)
n.n(0,a,q)}p=d?1:c
o=q.h(0,b)
q.n(0,b,new A.dq(r,o==null?p:Math.max(o.b,p)))
if(q.gm(q)>1)q.be(0,new A.ja(b,r))},
$S:17}
A.ja.prototype={
$2(a,b){A.D(a)
t.E.a(b)
return a!==this.a&&this.b-b.a>32},
$S:81}
A.j6.prototype={
$4$poster(a,b,c,d){var s,r,q,p,o,n,m=this,l=m.a
if(!l.aF(a))return
s=m.b
r=s.h(0,a)
if(r!=null&&r.gaR(r))for(q=r.ge8(),q=q.gE(q),p=m.c;q.t();){o=q.gC()
if(!p.ee(o.a,o.b.b))return}else{q=d?1:c
if(!m.c.ee(b,q))return}s.u(0,a)
m.d.u(0,a)
n=l.u(0,a)
if(n==null)return
m.e.cA(n)},
$S:17}
A.j5.prototype={
$2(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.u(0,a)
if(j!=null)l.b.cA(j)
s=l.c
s.u(0,a)
r=l.d
r.u(0,a)
l.e.u(0,a)
for(q=l.b,p=A.n(k).i("I<1>");k.a>=24;){o=new A.I(k,p).gE(0)
if(!o.t())A.v(A.af())
n=o.gC()
m=k.u(0,n)
m.toString
s.u(0,n)
r.u(0,n)
q.cA(m)}k.n(0,a,b)},
$S:82}
A.j8.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.dr(3,b,a):new A.c3(1,s,a)
this.b.al(r)},
$S:83}
A.j7.prototype={
$13$cancelSlot$cancelToken$contentKey$entryKey$frameStep$height$poster$reqId$startFrame$stripCount$stripStart$totalFrames$width(f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1=this
try{d3=f2>=0
if(d3&&0!==f3){b1=f1.b
f1.a.al(new A.cA(5,f9,b1.at+b1.CW))
return}d4=f1.c
d4.a=null
d4.b=-1
s=g1>1?1:0
d4=s
if(typeof d4!=="number")return A.ai(d4)
r=g1*f7+(g1-1)*d4
d4=r
if(typeof d4!=="number")return A.ai(d4)
q=g4*d4
p=g4*f7
o=null
n=null
o=null
n=null
f1.d.$1(q)
d4=s
if(typeof d4!=="number")return d4.cG()
if(d4>0){m=1
d4=f1.e
d5=t.a
for(;;){d6=m
if(typeof d6!=="number")return d6.cH()
if(!(d6<g1))break
d6=m
d7=s
if(typeof d7!=="number")return A.ai(d7)
if(typeof d6!=="number")return d6.ac()
l=(d6*(f7+d7)-1)*g4
d6=d4.c
if(d6!=null){d7=d5.a(A.u($.k.memory).buffer)
d8=d4.b
d6=new Uint32Array(d7,d6,d8)}else{d6=d4.d
d6.toString}d7=l
if(typeof d7!=="number")return d7.aI()
B.l.ag(d6,l,d7+g4,0)
d6=m
if(typeof d6!=="number")return d6.aI()
m=d6+1}}k=0
j=0
i=-1
h=0
g=0
f=0
d4=f1.b
e=d4.r
d=2654435769
c=2246822507
b=null
a=null
f1.f.$4$poster(f4,f5,g3,f8)
a0=0
d5=f1.as
d6=f1.Q
d7=f1.w
d9=f1.y
e0=f1.z
e1=f1.e
e2=0!==f3
e3=t.a
e4=g1===1
for(;;){e5=a0
if(typeof e5!=="number")return e5.cH()
if(!(e5<g1))break
A:{if(d3&&e2){f1.a.al(new A.cA(5,f9,d4.at+d4.CW))
f1.r.$1(q)
return}e5=a0
if(typeof e5!=="number")return A.ai(e5)
a1=A.pw(g2+e5,g3,f6)
e5=a1
if(typeof e5!=="number")return A.ai(e5)
a2=g0+e5
e5=a0
e6=s
if(typeof e6!=="number")return A.ai(e6)
if(typeof e5!=="number")return e5.ac()
a3=e5*(f7+e6)
e6=a3
if(typeof e6!=="number")return e6.ac()
a4=e6*g4
a5=e1.eD(0,a4,p)
e6=a5
e5=e6.c
if(e5!=null){e7=e3.a(A.u($.k.memory).buffer)
d8=e6.b
e5=new Uint32Array(e7,e5,d8)}else{e5=e6.d
e5.toString}a6=A.b1(e5,0,null)
a7=d4.i6(a6,f5,a1,f7,f8,g3,g4)
if(a7){e5=j
if(typeof e5!=="number")return e5.aI()
j=e5+1
if(b==null)b=a1
if(e){a8=d4.cy
a9=d4.db
if(e4){d=a8
c=a9}else if(J.l(a8,0)&&J.l(a9,0))e=!1
else{b0=A.kv(d,c,a8,a9)
b1=null
b2=null
b1=b0.a
b2=b0.b
d=b1
c=b2}}break A}if(a==null)a=d7.u(0,f4)
if(a==null){f1.x.$2(f9,f4)
return}d7.n(0,f4,a)
e5=a5
e5.toString
b3=e5
b4=d9.gcq()
b5=new A.cy($.a6,$.eP)
b6=0
e5=a.a
A.lE(e5,a2,b3,g4,f7,e0,null)
b7=d6.$3(b4,b5,b6)
e5=h
e6=b7.a
if(typeof e5!=="number")return e5.aI()
h=e5+e6
e6=g
e5=b7.b
if(typeof e6!=="number")return e6.aI()
g=e6+e5
e5=f
e6=b7.c
if(typeof e5!=="number")return e5.aI()
f=e5+e6
e6=k
if(typeof e6!=="number")return e6.aI()
k=e6+1
b8=null
e6=a5
e5=e6.c
if(e5!=null){e7=e3.a(A.u($.k.memory).buffer)
d8=e6.b
e5=new Uint32Array(e7,e5,d8)}else{e5=e6.d
e5.toString}b8=A.b1(e5,0,null)
b9=d4.cN(f5,a1,f7,f8,d5,b8,g3,g4)
if(b9.a[2]>0)i=b9.a[2]
if(e){c0=b9.a[3]
c1=b9.a[4]
if(e4){d=c0
c=c1}else if(J.l(c0,0)&&J.l(c1,0))e=!1
else{c2=A.kv(d,c,c0,c1)
c3=null
c4=null
c3=c2.a
c4=c2.b
d=c3
c=c4}}}e5=a0
if(typeof e5!=="number")return e5.aI()
a0=e5+1}c5=null
c6=f1.at.$1(q)
c5=new Uint8Array(A.ae(c6))
c7=null
c8=null
if(!e){c7=0
c8=0}else if(e4){c7=d
c8=c}else{e8=d^g1
e9=c+A.aq(g1,2654435761)>>>0
e8=A.aq((e8^e8>>>15)>>>0,2246822519)
e8=(e8^e8>>>13)>>>0
e9=A.aq((e9^e9>>>16)>>>0,3266489917)
e9=(e9^e9>>>15)>>>0
c9=new A.A(e8,e8===0&&e9===0?1:e9)
d0=null
d1=null
d0=c9.a
d1=c9.b
c7=d0
c8=d1}b1=k
b2=j
c3=i
c4=d4.at
d0=d4.CW
d1=h
d3=g
d5=f
d6=q
if(typeof d6!=="number")return d6.ac()
f1.a.al(new A.dp([4,b2,c3,f5,c7,c8,d5,d3,c5,d1,f9,g1,r,g2,g4,d6*4,b1,c4+d0]))
f1.r.$1(q)
f1.ax.$4$poster(f4,f5,g3,f8)
if(!f8&&b!=null)d4.em(f5,b,f7,g3,g4)}catch(f0){d2=A.am(f0)
f1.a.al(new A.c3(1,J.bK(d2),f9))}},
$S:84}
A.j0.prototype={
$1(h1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9=this,h0=null
A:{if(h1==null){a8=g9.b
a8.cn()
a8.e1()
g9.c.j(0)
g9.d.j(0)
g9.e.j(0)
g9.f.a1()
g9.r.a1()
a8=g9.a
a9=a8.d
if(a9!=null)a9.a1()
a8.d=null
g9.w.a.cm()
A.u(v.G.self).close()
return}b0=t.am.b(h1)
b1=h0
b2=h0
b3=h0
b4=h0
a8=!1
if(b0){a9=h1.a
b5=a9[0]
if(0===b5){b6=a9[2]
if(t.dk.b(b6)){A.ii(b6)
b7=a9[3]
if(A.o(b7)){A.j(b7)
b8=a9[4]
if(A.o(b8)){A.j(b8)
b9=a9[1]
a8=A.aX(b9)
if(a8){A.aP(b9)
b4=b9}b3=b8}b2=b7}b1=b6}}}else b5=h0
if(a8){a8=g9.b
a8.b=A.j(b3)
a8.de(0)
a8.shP(b2)
a8.shg(b4)
a8.eB(b1)
break A}c0=t.hh.b(h1)
c1=h0
c2=h0
c3=!1
if(c0){if(b0)a8=b5
else{b5=A.N()
a8=b5
b0=!0}c1=1===a8
a8=c1
if(a8){c2=A.N()
c3=!0}}s=null
r=null
q=null
a8=!1
if(t.cm.b(h1)){c4=!0
if(c0)a9=c1
else{if(b0)a9=b5
else{b5=h1.a[0]
a9=b5
b0=!0}c1=1===a9
a9=c1}if(a9){if(c3)a9=c2
else{c2=h1.a[2]
a9=c2
c3=c4}if(typeof a9=="string"){if(c3)a9=c2
else{c2=h1.a[2]
a9=c2
c3=c4}s=A.D(a9)
a9=h1.a
c5=a9[1]
c6=t.p
if(c6.b(c5)){r=c6.a(c5)
c7=a9[3]
a8=A.aX(c7)
if(a8)q=A.aP(c7)}}}}if(a8){try{a8=s
a9=A.pa(r)
c6=A.jM(new A.dR(q))
c8=new Float32Array(256)
c9=a9.length
d0=new A.hX(a9,c9,c8,new Float64Array(64))
if(c9>=3&&a9[0]===239&&a9[1]===187&&a9[2]===191)d0.c=3
d0.W()
d1=d0.c5(h0)
d0.W()
a9=d0.c
if(a9!==c9)A.v(A.P("Unexpected trailing character at "+a9,h0,h0))
if(!t.P.b(d1))A.v(B.a3)
c6.hf(d1)
g9.x.$2(a8,new A.cn(c6))}catch(d2){p=A.am(d2)
a8=g9.y
if(a8.a>=24)a8.u(0,new A.I(a8,A.n(a8).i("I<1>")).ga7(0))
a8.n(0,s,J.bK(p))}break A}o=null
n=null
m=null
l=null
k=null
j=null
i=null
h=null
g=null
d3=h0
d4=h0
d5=!1
d6=h0
d7=!1
d8=h0
d9=!1
e0=h0
e1=!1
e2=h0
e3=!1
a8=!1
if(t.eS.b(h1)){c4=!0
if(b0)a9=b5
else{b5=h1.a[0]
a9=b5
b0=!0}e4=2===a9
if(e4){a9=h1.a
d3=a9[7]
d5=A.o(d3)
if(d5){A.j(d3)
o=d3
d4=a9[2]
if(typeof d4=="string"){A.D(d4)
n=d4
if(c3)c6=c2
else{c2=a9[1]
c6=c2
c3=c4}if(typeof c6=="string"){if(c3)c6=c2
else{c2=a9[1]
c6=c2
c3=c4}m=A.D(c6)
e5=a9[3]
if(typeof e5=="number"){l=A.a0(e5)
e6=a9[4]
d7=A.o(e6)
if(d7){k=A.j(e6)
d6=a9[9]
d9=A.o(d6)
if(d9){A.j(d6)
j=d6
d8=a9[5]
e1=A.o(d8)
if(e1){A.j(d8)
i=d8
e0=a9[8]
e3=A.o(e0)
if(e3){A.j(e0)
h=e0
e2=a9[6]
a8=A.aX(e2)
if(a8){A.aP(e2)
g=e2}}}}}}}}}}}else e4=!1
if(a8){try{g9.z.$4$poster(m,n,h,g)
a8=j
a9=i
if(typeof a8!=="number")return a8.ac()
if(typeof a9!=="number")return A.ai(a9)
f=a8*a9
a9=f
if(typeof a9!=="number")return a9.ab()
e=a9<<2>>>0
d=null
g9.Q.$1(f)
a9=g9.as
d=a9.$1(f)
a8=g9.b
c6=n
c8=j
c9=i
e7=h
e8=g
e9=k
f0=g9.at
c=a8.eu(f0,d,c6,e9,c9,e8,e7,c8)
if(c){g9.ax.$4$poster(m,n,h,g)
b=new Uint8Array(A.ae(d))
a9=a8.at
c6=a8.CW
c8=a8.cy
g9.w.al(new A.cx([0,-1,n,c8,a8.db,0,0,b,0,o,e,!1,a9+c6]))
g9.ay.$1(f)
if(!g){a9=n
c6=j
c8=i
c9=h
a8.em(a9,k,c8,c9,c6)}return}c6=g9.c
a=c6.u(0,m)
if(a==null){g9.ch.$2(o,m)
return}c6.n(0,m,a)
f0.a=null
f0.b=-1
a0=g9.CW.gcq()
a1=new A.cy($.a6,$.eP)
a2=0
c6=l
c8=j
c9=i
A.lE(a.gf3(),c6,g9.r,c8,c9,g9.f,h0)
a3=g9.cx.$3(a0,a1,a2)
a4=null
a4=a9.$1(f)
a9=n
c9=j
c8=i
c6=h
e7=g
a5=a8.cN(a9,k,c8,e7,g9.cy,a4,c6,c9)
a6=new Uint8Array(A.ae(a4))
c9=a5.a[2]
c6=a8.at
a8=a8.CW
e7=a3.a
c8=a3.b
a9=a3.c
e8=a5.a[3]
g9.w.al(new A.cx([0,c9,n,e8,a5.a[4],a9,c8,a6,e7,o,e,!0,c6+a8]))
g9.ay.$1(f)
g9.ax.$4$poster(m,n,h,g)}catch(d2){a7=A.am(d2)
g9.w.al(new A.c3(1,J.bK(a7),o))}break A}f1=h0
f2=!1
f3=h0
f4=!1
f5=h0
f6=!1
f7=h0
f8=!1
o=h0
n=h0
s=h0
f9=h0
g0=h0
g1=h0
g2=h0
j=h0
i=h0
h=h0
g=h0
a8=!1
if(t.a8.b(h1)){c4=!0
g3=!0
g4=!0
g5=!0
g6=!0
g7=!0
g8=!0
if(b0)a9=b5
else{b5=h1.a[0]
a9=b5
b0=!0}if(5===a9){if(e4)a9=d3
else{d3=h1.a[6]
a9=d3
e4=g3}if(A.o(a9)){if(e4)a9=d3
else{d3=h1.a[6]
a9=d3
e4=g3}A.j(a9)
if(d5)c6=d4
else{d4=h1.a[2]
c6=d4
d5=g4}if(typeof c6=="string"){if(d5)c6=d4
else{d4=h1.a[2]
c6=d4
d5=g4}A.D(c6)
if(c3)c8=c2
else{c2=h1.a[1]
c8=c2
c3=c4}f2=typeof c8=="string"
if(f2){if(c3)c8=c2
else{c2=h1.a[1]
c8=c2
c3=c4}A.D(c8)
c9=h1.a
f1=c9[9]
f4=A.o(f1)
if(f4){A.j(f1)
f3=c9[8]
f6=A.o(f3)
if(f6){A.j(f3)
f5=c9[7]
f8=typeof f5=="number"
if(f8){A.a0(f5)
f7=c9[3]
if(typeof f7=="number"){A.a0(f7)
if(d7)e7=d6
else{d6=c9[11]
e7=d6
d7=g5}if(A.o(e7)){if(d7)e7=d6
else{d6=c9[11]
e7=d6
d7=g5}A.j(e7)
if(d9)e8=d8
else{d8=c9[4]
e8=d8
d9=g6}if(A.o(e8)){if(d9)e8=d8
else{d8=c9[4]
e8=d8
d9=g6}A.j(e8)
if(e1)e9=e0
else{e0=c9[10]
e9=e0
e1=g7}if(A.o(e9)){if(e1)e9=e0
else{e0=c9[10]
e9=e0
e1=g7}A.j(e9)
if(e3)a8=e2
else{e2=c9[5]
a8=e2
e3=g8}a8=A.aX(a8)
if(a8){if(e3)c9=e2
else{e2=c9[5]
c9=e2
e3=g8}A.aP(c9)
g=c9}h=e9}i=e8}j=e7}g2=f7}g1=f5}g0=f3}f9=f1}s=c8}n=c6}o=a9}}}if(a8){g9.db.$13$cancelSlot$cancelToken$contentKey$entryKey$frameStep$height$poster$reqId$startFrame$stripCount$stripStart$totalFrames$width(-1,0,s,n,g2,i,g,o,g1,g0,f9,h,j)
break A}if(t.bx.b(h1)){g4=!0
if(b0)a8=b5
else{b5=A.N()
a8=b5
b0=!0}if(6===a8){if(e4)a8=d3
else{d3=A.N()
a8=d3
e4=!0}if(A.o(a8)){A.j(e4?d3:A.N())
if(d5)a8=d4
else{d4=A.N()
a8=d4
d5=g4}if(typeof a8=="string"){if(d5)a8=d4
else{d4=A.N()
a8=d4
d5=g4}A.D(a8)
if(c3)a8=c2
else{c2=A.N()
a8=c2
c3=!0}if(typeof a8=="string"){A.D(c3?c2:A.N())
if(f2)a8=f1
else{f1=A.N()
a8=f1
f2=!0}if(A.o(a8)){A.j(f2?f1:A.N())
if(f4)a8=f3
else{f3=A.N()
a8=f3
f4=!0}if(A.o(a8)){A.j(f4?f3:A.N())
if(f6)a8=f5
else{f5=A.N()
a8=f5
f6=!0}if(typeof a8=="number"){A.a0(f6?f5:A.N())
if(f8)a8=f7
else{f7=A.N()
a8=f7
f8=!0}if(typeof a8=="number"){A.a0(f8?f7:A.N())
if(d7)a8=d6
else{d6=A.N()
a8=d6
d7=!0}if(A.o(a8)){A.j(d7?d6:A.N())
if(d9)a8=d8
else{d8=A.N()
a8=d8
d9=!0}if(A.o(a8)){A.j(d9?d8:A.N())
if(e1)a8=e0
else{e0=A.N()
a8=e0
e1=!0}if(A.o(a8)){A.j(e1?e0:A.N())
if(e3)a8=e2
else{e2=A.N()
a8=e2
e3=!0}if(A.aX(a8)){A.aP(e3?e2:A.N())
A.N()}}}}}}}}}}}}}n=h0
a8=!1
if(t.bn.b(h1)){if(b0)a9=b5
else{b5=A.N()
a9=b5
b0=!0}if(3===a9){if(d5)a8=d4
else{d4=A.N()
a8=d4
d5=!0}a8=typeof a8=="string"
if(a8)n=A.D(d5?d4:A.N())}}if(a8){a8=g9.b
a8.hq(n)
a8.hw(n)
for(a9=g9.d,a9=new A.aD(a9,a9.r,a9.e,A.n(a9).i("aD<2>"));a9.t();)a9.d.u(0,n)
g9.w.al(new A.cz(2,n,a8.at+a8.CW))
break A}if(t.dn.b(h1))a8=4===(b0?b5:h1.a)
else a8=!1
if(a8){a8=g9.at
a8.a=null
a8.b=-1
a8=g9.b
a8.e1()
a8.cn()
a8.cJ()
g9.c.j(0)
g9.d.j(0)
g9.e.j(0)
g9.y.j(0)
a9=g9.f
a9.ep()
a9.es(!0)
a9=g9.cy
a9.c=0
if(a9.b.length>131072)a9.b=new Uint8Array(131072)
g9.a.a=0
a9=g9.r
if(a9.gA().length>65536)a9.ar(65536,0)
g9.w.al(new A.cz(2,"",a8.at+a8.CW))}}},
$S:85}
A.iU.prototype={
$1(a){return this.ex(a)},
ex(a5){var s=0,r=A.lz(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.lI(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.fR(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.j(A.a0(J.ap(n.a,0)))!==-1)throw A.h(B.V)
q=10
s=13
return A.ij(A.ke(A.u(A.u(v.G.self).fetch(A.D(J.ap(n.a,1)))),t.m),$async$$1)
case 13:m=a7
s=A.aP(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.ij(A.ke(A.u(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.ij(a3.iS(a4.jz(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.pz(o.b)
d.a=!0
l=null
k=null
d=$.k
j=A.ka([-2,d!=null])
l=j.a
k=j.b
A.u(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.n(d)
a=b.c.a(n.hk())
a0=d.b
if(a0>=4)A.v(d.cU())
if((a0&1)!==0)d.c9(a)
else if((a0&3)===0)d.d3().k(0,new A.bZ(a,b.i("bZ<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.am(a2)
h=null
g=null
f=A.ka([-3,A.z(i)])
h=f.a
g=f.b
A.u(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.lk(null,r)
case 1:return A.lj(p.at(-1),r)}})
return A.ll($async$$1,r)},
$S:86}
A.iV.prototype={
$1(a){return A.mJ(new A.iU(this.a,this.b).$1(A.u(a)),t.b)},
$S:87}
A.he.prototype={
al(a){var s=A.pc(a)
A.u(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bw.prototype
s.eI=s.v})();(function installTearOffs(){var s=hunkHelpers._static_2,r=hunkHelpers._static_0,q=hunkHelpers._static_1,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(J,"os","mP",88)
r(A,"oF","n4",3)
q(A,"p_","nr",5)
q(A,"p0","ns",5)
q(A,"p1","nt",5)
r(A,"lK","oV",0)
s(A,"p3","oI",10)
r(A,"p2","oH",0)
p(A.M.prototype,"gf4","f5",10)
q(A,"kf","dG",1)
var m
o(m=A.ew.prototype,"gi1","G",48)
o(m,"gbi","cL",49)
o(m,"ghr","hs",50)
o(m,"ghM","hN",51)
o(m,"ghJ","cz",52)
p(m=A.a7.prototype,"ghc","p",73)
n(m,"ght","a3",0)
q(A,"pA","ak",60)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.e,null)
q(A.e,[A.jv,J.C,A.d8,J.bL,A.O,A.bt,A.fB,A.m,A.bS,A.cU,A.dc,A.T,A.K,A.df,A.bd,A.fN,A.fq,A.cO,A.dx,A.y,A.fd,A.bQ,A.aD,A.cT,A.dY,A.dg,A.cq,A.h_,A.ib,A.ck,A.aQ,A.ex,A.i9,A.i6,A.eo,A.az,A.es,A.bi,A.M,A.ep,A.da,A.dy,A.eq,A.de,A.bD,A.et,A.aT,A.eD,A.fT,A.eB,A.bl,A.J,A.dO,A.dQ,A.eH,A.hf,A.e6,A.d9,A.hg,A.a2,A.aK,A.a3,A.eE,A.fD,A.co,A.fp,A.f4,A.fS,A.f6,A.em,A.dT,A.by,A.hd,A.dV,A.eC,A.eU,A.ff,A.fK,A.ei,A.aE,A.bb,A.b_,A.fj,A.i4,A.fs,A.cn,A.fv,A.ad,A.bY,A.d,A.bC,A.hh,A.i1,A.ew,A.bj,A.Y,A.bn,A.bG,A.cu,A.c4,A.ac,A.hQ,A.ev,A.a9,A.a8,A.aS,A.ey,A.bm,A.bv,A.a7,A.at,A.f0,A.cl,A.hX,A.dR,A.fa,A.F,A.dw,A.fR,A.he])
q(J.C,[J.cQ,J.cS,J.U,J.bO,J.bP,J.ch,J.bN])
q(J.U,[J.bw,J.x,A.bx,A.d1])
q(J.bw,[J.e7,J.cp,J.aB])
r(J.dW,A.d8)
r(J.f7,J.x)
q(J.ch,[J.cR,J.dX])
q(A.O,[A.b8,A.bg,A.dZ,A.el,A.eb,A.cK,A.eu,A.aZ,A.db,A.ek,A.bA,A.dP])
q(A.bt,[A.dM,A.dN,A.eh,A.iP,A.iR,A.fW,A.fV,A.ik,A.hH,A.fE,A.fh,A.f1,A.iZ,A.j_,A.f5,A.hK,A.eX,A.eV,A.eW,A.ir,A.iE,A.im,A.hb,A.h1,A.h0,A.h8,A.h6,A.h4,A.h5,A.h3,A.ha,A.i8,A.hc,A.hi,A.hV,A.hT,A.hU,A.hW,A.hM,A.hO,A.hP,A.hN,A.hZ,A.hY,A.i5,A.fG,A.fI,A.fb,A.j2,A.j1,A.j3,A.j4,A.j9,A.j6,A.j7,A.j0,A.iU,A.iV])
q(A.dM,[A.iX,A.ft,A.fX,A.fY,A.i7,A.hz,A.hD,A.hC,A.hB,A.hA,A.hG,A.hF,A.hE,A.fF,A.i3,A.i2,A.fZ,A.i_,A.fU,A.iw,A.id,A.ic,A.hL,A.ih,A.fL,A.fm,A.fl,A.hw,A.hx,A.hq,A.hr,A.hs,A.ht,A.hu,A.hv,A.hk,A.hm,A.hl,A.hy,A.hj,A.ho,A.hn,A.hp])
q(A.m,[A.r,A.bT,A.bX,A.en])
q(A.r,[A.ab,A.I,A.bR,A.b9])
r(A.cN,A.bT)
q(A.ab,[A.a_,A.eA])
q(A.K,[A.cv,A.al,A.bE,A.b3])
r(A.dl,A.cv)
q(A.al,[A.cw,A.dm,A.dn,A.cx,A.dp,A.aN,A.ds,A.dt,A.cB,A.du,A.bF])
q(A.bE,[A.A,A.cy,A.dq])
q(A.b3,[A.aM,A.dr,A.cz,A.c3,A.cA])
q(A.bd,[A.cM,A.dv])
r(A.S,A.cM)
r(A.d4,A.bg)
q(A.eh,[A.ed,A.cg])
r(A.eG,A.cK)
q(A.y,[A.b7,A.ez])
q(A.dN,[A.f8,A.iQ,A.il,A.iJ,A.hI,A.fg,A.fi,A.hS,A.f3,A.f2,A.eY,A.iy,A.iz,A.iA,A.iB,A.iC,A.ix,A.iD,A.iF,A.iG,A.iH,A.is,A.fw,A.fx,A.fy,A.fz,A.iv,A.iu,A.h2,A.h7,A.h9,A.ja,A.j5,A.j8])
r(A.an,A.b7)
r(A.ci,A.bx)
q(A.d1,[A.e1,A.ag])
q(A.ag,[A.dh,A.dj])
r(A.di,A.dh)
r(A.d_,A.di)
r(A.dk,A.dj)
r(A.d0,A.dk)
q(A.d_,[A.cj,A.cW])
q(A.d0,[A.e3,A.cX,A.cZ,A.e4,A.d2,A.d3,A.bU])
r(A.cC,A.eu)
r(A.dd,A.es)
r(A.cr,A.dy)
r(A.dA,A.da)
r(A.cs,A.dA)
r(A.ct,A.de)
r(A.bZ,A.bD)
r(A.bk,A.dv)
r(A.c1,A.bk)
r(A.e_,A.dO)
r(A.f9,A.dQ)
q(A.aZ,[A.bc,A.dS])
q(A.fS,[A.hJ,A.ig])
q(A.by,[A.e0,A.ec,A.bV])
q(A.a2,[A.cf,A.fQ])
q(A.cf,[A.cJ,A.dK])
r(A.cL,A.hf)
r(A.dU,A.dV)
q(A.ey,[A.av,A.aU,A.b2])
s(A.dh,A.J)
s(A.di,A.T)
s(A.dj,A.J)
s(A.dk,A.T)
s(A.cr,A.eq)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",i:"double",aw:"num",p:"String",q:"bool",a3:"Null",w:"List",e:"Object",aj:"Map",L:"JSObject"},mangledNames:{},types:["~()","q(B)","b(b,b)","b()","q(ac)","~(~())","~(@)","~(b,b)","a3(@)","a3()","~(e,aF)","@()","q()","q(+(p,b))","q(@)","bu(@,d,bu?,b,b)","~(b)","~(p,p,b{poster!q})","~(p,@)","e(e,aF)","q(by)","@(@)","~(aR)","q(b,aR)","+(b,b)(b)","a3(@,aF)","w<b>()","~(i,i,i,i,i,i,i,i)","q(a7,b)","b(i,i,i)","aA<~>()","~(b,@)","q(e,bY)","q(e,ad<a7>)","q(e,ad<i>)","q(bj,ad<b_>)","b(b,b,b?,b?)","~(ac,at)","~(B,at)","q(a9)","F(b{dimensions:b})","a3(~())","i(p,i)","a3(e,aF)","~(@,b)","~(w<B>)","B(Y)","~(e?,e?)","F(F)","B(B)","aL(aL)","ac(ac)","a9(a9)","F()","c4()","Y()","bn()","aS()","av()","aU()","b(b)","bm()","a8()","bj()","bG()","cu()","ac()","a9()","bC()","q(F)","b(i)","@(@,p)","q(aL)","~(i,i)","b(b,b,i)","i(i)","i(i,i,i)","+(b,b,b)(b,+calls,copiedBytes(b,b),b)","@(p)","aR(b)","a3(aB,aB)","q(p,+lastTouch,requiredFrames(b,b))","~(p,cn)","~(b,p)","~({cancelSlot!b,cancelToken!b,contentKey!p,entryKey!p,frameStep!i,height!b,poster!q,reqId!b,startFrame!i,stripCount!b,stripStart!b,totalFrames!b,width!b})","~(e?)","aA<a3>(L)","L(L)","b(@,@)","e?(e?)","b2()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.dl&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.A&&a.b(c.a)&&b.b(c.b),"2;calls,copiedBytes":(a,b)=>c=>c instanceof A.cy&&a.b(c.a)&&b.b(c.b),"2;lastTouch,requiredFrames":(a,b)=>c=>c instanceof A.dq&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.aM&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;contentKey,requestId":(a,b,c)=>d=>d instanceof A.dr&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;entryKey,workerRamBytes":(a,b,c)=>d=>d instanceof A.cz&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;message,requestId":(a,b,c)=>d=>d instanceof A.c3&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;requestId,workerRamBytes":(a,b,c)=>d=>d instanceof A.cA&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.aN&&A.b5(a,b.a),"4;bytes,contentKey,useSimd":a=>b=>b instanceof A.ds&&A.b5(a,b.a),"5;":a=>b=>b instanceof A.dt&&A.b5(a,b.a),"5;deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes":a=>b=>b instanceof A.du&&A.b5(a,b.a),"5;compressedBytes,crc31,entryDiskBytes,fpHi,fpLo":a=>b=>b instanceof A.cB&&A.b5(a,b.a),"6;":a=>b=>b instanceof A.bF&&A.b5(a,b.a),"10;":a=>b=>b instanceof A.cw&&A.b5(a,b.a),"10;contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width":a=>b=>b instanceof A.dm&&A.b5(a,b.a),"12;contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width":a=>b=>b instanceof A.dn&&A.b5(a,b.a),"13;entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes":a=>b=>b instanceof A.cx&&A.b5(a,b.a),"18;compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes":a=>b=>b instanceof A.dp&&A.b5(a,b.a)}}
A.nQ(v.typeUniverse,JSON.parse('{"aB":"bw","e7":"bw","cp":"bw","pP":"bx","cQ":{"C":[],"q":[],"E":[]},"cS":{"C":[],"a3":[],"E":[]},"U":{"C":[],"L":[]},"bw":{"U":[],"C":[],"L":[]},"bO":{"C":[]},"bP":{"C":[]},"x":{"w":["1"],"U":[],"r":["1"],"C":[],"L":[],"m":["1"]},"dW":{"d8":[]},"f7":{"x":["1"],"w":["1"],"U":[],"r":["1"],"C":[],"L":[],"m":["1"]},"bL":{"aa":["1"]},"ch":{"i":[],"aw":[],"C":[],"b6":["aw"]},"cR":{"i":[],"b":[],"aw":[],"C":[],"b6":["aw"],"E":[]},"dX":{"i":[],"aw":[],"C":[],"b6":["aw"],"E":[]},"bN":{"p":[],"C":[],"b6":["p"],"fr":[],"E":[]},"b8":{"O":[]},"r":{"m":["1"]},"ab":{"r":["1"],"m":["1"]},"bS":{"aa":["1"]},"bT":{"m":["2"],"m.E":"2"},"cN":{"bT":["1","2"],"r":["2"],"m":["2"],"m.E":"2"},"cU":{"aa":["2"]},"a_":{"ab":["2"],"r":["2"],"m":["2"],"ab.E":"2","m.E":"2"},"bX":{"m":["1"],"m.E":"1"},"dc":{"aa":["1"]},"dl":{"cv":[],"K":[]},"cw":{"al":[],"K":[]},"dm":{"al":[],"K":[]},"dn":{"al":[],"K":[]},"cx":{"al":[],"K":[]},"dp":{"al":[],"K":[]},"A":{"bE":[],"K":[]},"cy":{"bE":[],"K":[]},"dq":{"bE":[],"K":[]},"aM":{"b3":[],"K":[]},"dr":{"b3":[],"K":[]},"cz":{"b3":[],"K":[]},"c3":{"b3":[],"K":[]},"cA":{"b3":[],"K":[]},"aN":{"al":[],"K":[]},"ds":{"al":[],"K":[]},"dt":{"al":[],"K":[]},"cB":{"al":[],"K":[]},"du":{"al":[],"K":[]},"bF":{"al":[],"K":[]},"df":{"aa":["1"]},"cM":{"bd":["1"],"b0":["1"],"r":["1"],"m":["1"]},"S":{"cM":["1"],"bd":["1"],"b0":["1"],"r":["1"],"m":["1"]},"d4":{"bg":[],"O":[]},"dZ":{"O":[]},"el":{"O":[]},"dx":{"aF":[]},"bt":{"bM":[]},"dM":{"bM":[]},"dN":{"bM":[]},"eh":{"bM":[]},"ed":{"bM":[]},"cg":{"bM":[]},"eb":{"O":[]},"eG":{"O":[]},"b7":{"y":["1","2"],"jx":["1","2"],"aj":["1","2"],"y.K":"1","y.V":"2"},"I":{"r":["1"],"m":["1"],"m.E":"1"},"bQ":{"aa":["1"]},"bR":{"r":["1"],"m":["1"],"m.E":"1"},"aD":{"aa":["1"]},"b9":{"r":["aK<1,2>"],"m":["aK<1,2>"],"m.E":"aK<1,2>"},"cT":{"aa":["aK<1,2>"]},"an":{"b7":["1","2"],"y":["1","2"],"jx":["1","2"],"aj":["1","2"],"y.K":"1","y.V":"2"},"bE":{"K":[]},"cv":{"K":[]},"b3":{"K":[]},"al":{"K":[]},"dY":{"nc":[],"fr":[]},"dg":{"e9":[]},"en":{"m":["e9"],"m.E":"e9"},"cq":{"aa":["e9"]},"ci":{"bx":[],"U":[],"C":[],"L":[],"E":[]},"bx":{"U":[],"C":[],"L":[],"E":[]},"d1":{"U":[],"C":[],"L":[],"X":[]},"e1":{"U":[],"C":[],"L":[],"X":[],"E":[]},"ag":{"aC":["1"],"U":[],"C":[],"L":[],"X":[]},"d_":{"J":["i"],"ag":["i"],"w":["i"],"aC":["i"],"U":[],"r":["i"],"C":[],"L":[],"X":[],"m":["i"],"T":["i"]},"d0":{"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"]},"cj":{"bu":[],"J":["i"],"ag":["i"],"w":["i"],"aC":["i"],"U":[],"r":["i"],"C":[],"L":[],"X":[],"m":["i"],"T":["i"],"E":[],"J.E":"i","T.E":"i"},"cW":{"f_":[],"J":["i"],"ag":["i"],"w":["i"],"aC":["i"],"U":[],"r":["i"],"C":[],"L":[],"X":[],"m":["i"],"T":["i"],"E":[],"J.E":"i","T.E":"i"},"e3":{"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"],"E":[],"J.E":"b","T.E":"b"},"cX":{"jr":[],"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"],"E":[],"J.E":"b","T.E":"b"},"cZ":{"js":[],"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"],"E":[],"J.E":"b","T.E":"b"},"e4":{"jK":[],"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"],"E":[],"J.E":"b","T.E":"b"},"d2":{"fP":[],"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"],"E":[],"J.E":"b","T.E":"b"},"d3":{"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"],"E":[],"J.E":"b","T.E":"b"},"bU":{"aR":[],"J":["b"],"ag":["b"],"w":["b"],"aC":["b"],"U":[],"r":["b"],"C":[],"L":[],"X":[],"m":["b"],"T":["b"],"E":[],"J.E":"b","T.E":"b"},"ck":{"mI":[]},"eu":{"O":[]},"cC":{"bg":[],"O":[]},"az":{"O":[]},"dd":{"es":["1"]},"M":{"aA":["1"]},"dy":{"kP":["1"],"fC":["1"],"l7":["1"],"c_":["1"]},"cr":{"eq":["1"],"dy":["1"],"kP":["1"],"fC":["1"],"l7":["1"],"c_":["1"]},"cs":{"dA":["1"],"da":["1"]},"ct":{"de":["1"],"ee":["1"],"c_":["1"]},"de":{"ee":["1"],"c_":["1"]},"dA":{"da":["1"]},"bZ":{"bD":["1"]},"et":{"bD":["@"]},"bk":{"bd":["1"],"b0":["1"],"r":["1"],"m":["1"]},"c1":{"bk":["1"],"bd":["1"],"b0":["1"],"r":["1"],"m":["1"]},"bl":{"aa":["1"]},"y":{"aj":["1","2"]},"bd":{"b0":["1"],"r":["1"],"m":["1"]},"dv":{"bd":["1"],"b0":["1"],"r":["1"],"m":["1"]},"ez":{"y":["p","@"],"aj":["p","@"],"y.K":"p","y.V":"@"},"eA":{"ab":["p"],"r":["p"],"m":["p"],"ab.E":"p","m.E":"p"},"e_":{"dO":["e?","p"]},"i":{"aw":[],"b6":["aw"]},"b":{"aw":[],"b6":["aw"]},"w":{"r":["1"],"m":["1"]},"aw":{"b6":["aw"]},"b0":{"r":["1"],"m":["1"]},"p":{"b6":["p"],"fr":[]},"cK":{"O":[]},"bg":{"O":[]},"aZ":{"O":[]},"bc":{"O":[]},"dS":{"bc":[],"O":[]},"db":{"O":[]},"ek":{"O":[]},"bA":{"O":[]},"dP":{"O":[]},"e6":{"O":[]},"d9":{"O":[]},"eE":{"aF":[]},"em":{"fC":["w<b>"]},"e0":{"by":[]},"ec":{"by":[]},"dU":{"dV":[]},"bV":{"by":[]},"Y":{"B":[]},"bn":{"B":[]},"a8":{"B":[],"aL":[]},"aS":{"B":[]},"av":{"B":[]},"aU":{"B":[]},"b2":{"B":[]},"bm":{"aL":[]},"ey":{"B":[]},"mz":{"X":[]},"js":{"w":["b"],"r":["b"],"X":[],"m":["b"]},"aR":{"w":["b"],"r":["b"],"X":[],"m":["b"]},"np":{"w":["b"],"r":["b"],"X":[],"m":["b"]},"mK":{"w":["b"],"r":["b"],"X":[],"m":["b"]},"jK":{"w":["b"],"r":["b"],"X":[],"m":["b"]},"jr":{"w":["b"],"r":["b"],"X":[],"m":["b"]},"fP":{"w":["b"],"r":["b"],"X":[],"m":["b"]},"bu":{"w":["i"],"r":["i"],"X":[],"m":["i"]},"f_":{"w":["i"],"r":["i"],"X":[],"m":["i"]}}'))
A.nP(v.typeUniverse,JSON.parse('{"ag":1,"bD":1,"dv":1,"dQ":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.eR
return{a7:s("@<~>"),v:s("az"),fA:s("cL"),e8:s("b6<@>"),M:s("S<p>"),gw:s("r<@>"),R:s("O"),Z:s("bM"),gd:s("C"),bM:s("m<i>"),hf:s("m<@>"),hb:s("m<b>"),dh:s("x<f_>"),gy:s("x<w<i>>"),gL:s("x<w<b>>"),f:s("x<e>"),fM:s("x<a7>"),hg:s("x<+(q,q)>"),bU:s("x<at>"),s:s("x<p>"),gC:s("x<F>"),a1:s("x<fP>"),gN:s("x<aR>"),V:s("x<aL>"),ch:s("x<a9>"),bE:s("x<ac>"),r:s("x<B>"),fq:s("x<Y>"),f7:s("x<q>"),n:s("x<i>"),o:s("x<@>"),t:s("x<b>"),a2:s("x<b_?>"),a6:s("x<e?>"),cU:s("x<a9?>"),by:s("x<bG?>"),T:s("cS"),m:s("L"),g:s("aB"),aU:s("aC<@>"),aX:s("U"),c2:s("an<e,e>"),el:s("an<e,bY>"),gt:s("an<aj<p,@>,av>"),gS:s("an<e,ad<a7>>"),fk:s("an<e,ad<i>>"),gj:s("an<bj,ad<b_>>"),ew:s("w<e>"),W:s("w<pQ>"),cH:s("w<B>"),dg:s("w<i>"),j:s("w<@>"),L:s("w<b>"),P:s("aj<p,@>"),gq:s("aj<a9,b>"),B:s("aj<b,a9>"),ae:s("aj<p,+lastTouch,requiredFrames(b,b)>"),aj:s("aj<a9,+(b,d)>"),fP:s("a_<Y,B>"),a:s("ci"),bm:s("bU"),b:s("a3"),K:s("e"),bl:s("bV"),b8:s("bc"),fW:s("cn"),gT:s("pR"),bQ:s("+()"),eS:s("+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),a8:s("+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),e6:s("+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),bx:s("+cancelSlot,cancelToken,contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),f2:s("+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),dn:s("+(e?)"),x:s("+(p,b)"),eG:s("+(b,d)"),E:s("+lastTouch,requiredFrames(b,b)"),bn:s("+entryKey(e?,e?)"),h6:s("+(b,b,b)"),ca:s("+contentKey,requestId(e?,e?,e?)"),hh:s("+contentKey,scene(e?,e?,e?)"),dH:s("+entryKey,workerRamBytes(e?,e?,e?)"),bA:s("+message,requestId(e?,e?,e?)"),cm:s("+bytes,contentKey,useSimd(e?,e?,e?,e?)"),gi:s("+(p,i,i,i,i)"),am:s("+deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes(e?,e?,e?,e?,e?)"),d:s("e9"),bC:s("b0<e>"),Y:s("b0<p>"),cJ:s("b0<b>"),l:s("aF"),N:s("p"),gz:s("ei"),A:s("F"),dm:s("E"),k:s("bg"),h:s("X"),p:s("aR"),ak:s("cp"),eU:s("bX<B>"),co:s("cr<e?>"),G:s("bC"),az:s("bY"),bo:s("cu"),I:s("aL"),_:s("M<@>"),fJ:s("M<b>"),U:s("M<~>"),cK:s("bj"),eV:s("a8"),D:s("a9"),ai:s("c1<aj<p,@>>"),ao:s("c1<e>"),J:s("ac"),eY:s("qg"),u:s("B"),bs:s("B(Y)"),g2:s("eC"),dL:s("ad<b_>"),e:s("ad<a7>"),b_:s("ad<i>"),bD:s("Y"),fv:s("dz<e?>"),d1:s("c4"),e_:s("bG"),y:s("q"),al:s("q(e)"),aT:s("q(B)"),i:s("i"),z:s("@"),fO:s("@()"),w:s("@(e)"),C:s("@(e,aF)"),S:s("b"),c:s("bu(@,d,bu?,b,b)?"),eH:s("aA<a3>?"),an:s("L?"),bF:s("w<@>?"),eg:s("w<b>?"),g7:s("aj<+(p,i,i,i,i),bC>?"),cq:s("aj<p,aj<p,@>>?"),X:s("e?"),be:s("b0<e>?"),dk:s("p?"),g_:s("bC?"),ev:s("bD<@>?"),F:s("bi<@,@>?"),Q:s("eB?"),cn:s("dw?"),fQ:s("q?"),cD:s("i?"),gs:s("b?"),cg:s("aw?"),g5:s("~()?"),cy:s("~(aR)?"),q:s("aw"),H:s("~"),O:s("~()"),d5:s("~(e)"),da:s("~(e,aF)"),cA:s("~(p,@)"),bp:s("~(i,i)"),fi:s("~(i,i,i,i,i,i,i,i)"),as:s("~(b,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a5=J.C.prototype
B.a=J.x.prototype
B.u=J.cQ.prototype
B.b=J.cR.prototype
B.c=J.ch.prototype
B.p=J.bN.prototype
B.a6=J.aB.prototype
B.a7=J.U.prototype
B.k=A.cj.prototype
B.e=A.cW.prototype
B.f=A.cX.prototype
B.ag=A.cZ.prototype
B.l=A.d2.prototype
B.d=A.bU.prototype
B.F=J.e7.prototype
B.w=J.cp.prototype
B.o=new A.cL(0,"littleEndian")
B.t=new A.cL(1,"bigEndian")
B.I=new A.f4()
B.x=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.J=function() {
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
B.O=function(getTagFallback) {
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
B.K=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.N=function(hooks) {
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
B.M=function(hooks) {
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
B.L=function(hooks) {
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

B.z=new A.e_()
B.P=new A.e6()
B.m=new A.fB()
B.i=new A.fT()
B.A=new A.et()
B.Q=new A.hJ()
B.q=new A.eE()
B.R=new A.ig()
B.S=new A.a2("Truncated LZ4 match offset",null,null)
B.T=new A.a2("Invalid Huffman code length",null,null)
B.U=new A.a2("Invalid LZ4 match offset",null,null)
B.V=new A.a2("Incompatible FastLottie worker host",null,null)
B.W=new A.a2("LZ4 literal out of bounds",null,null)
B.X=new A.a2("Empty LZ4 block",null,null)
B.Y=new A.a2("Truncated LZ4 literal len",null,null)
B.Z=new A.a2("Truncated LZ4 match len",null,null)
B.a_=new A.a2("Lottie JSON exceeds decode budget",null,null)
B.a0=new A.a2("LZ4 match out of output bounds",null,null)
B.a1=new A.a2("Invalid raster worker request",null,null)
B.a2=new A.a2("Incomplete Huffman table",null,null)
B.a3=new A.a2("Expected JSON object at root",null,null)
B.a4=new A.a2("Oversubscribed Huffman table",null,null)
B.a8=new A.f9(null)
B.a9=s(["_initialize","malloc","free","fastlottie_clear_pixels","fastlottie_fill_solid_spans_v2","fastlottie_blend_rect","fastlottie_blend_solid_v2","fastlottie_inner_shadow","fastlottie_gradient_spans_v2","fl_dense_new","fl_dense_free","fl_dense_trim","fl_dense_raster"],t.s)
B.B=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.aa=s([10,7,2,7,0,0,0],t.t)
B.C=s([],t.o)
B.ab=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.j=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.ac=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.ad=s([10,7,7,7,7,7],t.t)
B.D=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.ae=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.r=s([1,10,100,1000,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13,1e14,1e15],t.n)
B.af=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.E=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.aD=new A.dl(4)
B.v=new A.A(0,0)
B.aE=new A.A(0,-1)
B.aF=new A.A(1,4)
B.aG=new A.A(2,0)
B.aH=new A.A(3,1)
B.aI=new A.A(4,1)
B.aJ=new A.A(5,1)
B.aK=new A.A(null,null)
B.aL=new A.aM(0,0,0)
B.aM=new A.aN([0/0,0/0,0/0,0/0])
B.aN=new A.aE(0,0,0,0)
B.au={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aO=new A.S(B.au,21,t.M)
B.ai={v:0,i:1,o:2,c:3}
B.aP=new A.S(B.ai,4,t.M)
B.aw={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aQ=new A.S(B.aw,11,t.M)
B.an={ty:0,nm:1,mn:2,ix:3,v:4}
B.G=new A.S(B.an,5,t.M)
B.az={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aR=new A.S(B.az,9,t.M)
B.aq={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aS=new A.S(B.aq,6,t.M)
B.ax={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aT=new A.S(B.ax,31,t.M)
B.at={a:0,k:1,ix:2,x:3,l:4}
B.H=new A.S(B.at,5,t.M)
B.aC={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aU=new A.S(B.aC,19,t.M)
B.aA={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aV=new A.S(B.aA,10,t.M)
B.am={s:0,x:1,y:2,ix:3}
B.aW=new A.S(B.am,4,t.M)
B.ak={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aX=new A.S(B.ak,9,t.M)
B.ao={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aY=new A.S(B.ao,8,t.M)
B.av={}
B.aZ=new A.S(B.av,0,t.M)
B.al={a:0,s:1,i:2,f:3,n:4}
B.b_=new A.S(B.al,5,t.M)
B.aB={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.b0=new A.S(B.aB,15,t.M)
B.ah={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.b1=new A.S(B.ah,7,t.M)
B.aj={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.b2=new A.S(B.aj,10,t.M)
B.as={n:0,nm:1,v:2}
B.b3=new A.S(B.as,3,t.M)
B.ar={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b4=new A.S(B.ar,10,t.M)
B.ap={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b5=new A.S(B.ap,16,t.M)
B.ay={p:0,k:1}
B.b6=new A.S(B.ay,2,t.M)
B.b7=A.aY("pF")
B.b8=A.aY("mz")
B.b9=A.aY("bu")
B.ba=A.aY("f_")
B.bb=A.aY("mK")
B.bc=A.aY("jr")
B.bd=A.aY("js")
B.be=A.aY("e")
B.bf=A.aY("jK")
B.bg=A.aY("fP")
B.bh=A.aY("np")
B.bi=A.aY("aR")
B.h=new A.d(null,null)
B.n=new A.d(B.h,"layers")})();(function staticFields(){$.hR=null
$.aG=A.f([],t.f)
$.kM=null
$.fu=0
$.jC=A.oF()
$.ky=null
$.kx=null
$.lO=null
$.lJ=null
$.lT=null
$.iL=null
$.iT=null
$.kb=null
$.i0=A.f([],A.eR("x<w<e>?>"))
$.cD=null
$.dH=null
$.dI=null
$.jZ=!1
$.G=B.i
$.lH=null
$.jV=null
$.k=null
$.lt=!1
$.lu=!1
$.a6=0
$.eP=0
$.fk=null
$.cV=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"pH","lX",()=>A.iM("_$dart_dartClosure"))
s($,"pG","jc",()=>A.iM("_$dart_dartClosure_dartJSInterop"))
s($,"qr","mm",()=>B.i.bC(B.i,A.eR("aA<~>()").a(new A.iX()),A.eR("aA<~>")))
s($,"qo","ml",()=>A.f([new J.dW()],A.eR("x<d8>")))
s($,"q2","m4",()=>A.bh(A.fO({
toString:function(){return"$receiver$"}})))
s($,"q3","m5",()=>A.bh(A.fO({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"q4","m6",()=>A.bh(A.fO(null)))
s($,"q5","m7",()=>A.bh(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"q8","ma",()=>A.bh(A.fO(void 0)))
s($,"q9","mb",()=>A.bh(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"q7","m9",()=>A.bh(A.kY(null)))
s($,"q6","m8",()=>A.bh(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"qb","md",()=>A.bh(A.kY(void 0)))
s($,"qa","mc",()=>A.bh(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"pO","jd",()=>A.fn(4))
s($,"qc","kk",()=>A.nq())
s($,"pI","kg",()=>$.mm())
s($,"qk","mj",()=>A.kL(4096))
s($,"qi","mh",()=>new A.id().$0())
s($,"qj","mi",()=>new A.ic().$0())
s($,"qm","eS",()=>A.iY(B.be))
s($,"pS","ki",()=>{A.n6()
return $.fu})
s($,"qn","mk",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"pK","lZ",()=>A.jp(B.af,!1))
s($,"pJ","lY",()=>A.jp(B.ab,!1))
s($,"pE","jb",()=>A.mv())
s($,"pD","lW",()=>A.mu($.jb()))
s($,"pN","m0",()=>A.kL(65536))
s($,"pM","m_",()=>{var r=A.n2(16384)
B.f.ag(r,0,16384,-1)
return r})
s($,"qp","kn",()=>A.kK(16384))
s($,"ql","km",()=>A.ea("content\\('([^']*)'\\)"))
s($,"qf","mg",()=>A.ea("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"qd","me",()=>A.ea("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"qe","mf",()=>A.ea('[\\\\"\\x00-\\x1f]'))
s($,"qh","kl",()=>A.ea("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"pU","kj",()=>A.kK(16384))
s($,"pL","kh",()=>new A.dw(A.fn(0),A.fn(0)))
s($,"pV","bs",()=>A.fn(0))
s($,"q0","jg",()=>A.ej(A.e2(A.f([0],t.n))))
s($,"q_","m3",()=>A.ej(A.e2(A.f([1],t.n))))
s($,"pY","je",()=>A.ej(A.e2(A.f([100],t.n))))
s($,"q1","jh",()=>A.ej(A.e2(A.f([0,0],t.n))))
s($,"pZ","jf",()=>A.ej(A.e2(A.f([100,100],t.n))))
s($,"pX","m2",()=>A.nn())
s($,"pW","m1",()=>A.nm())})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bx,ArrayBuffer:A.ci,ArrayBufferView:A.d1,DataView:A.e1,Float32Array:A.cj,Float64Array:A.cW,Int16Array:A.e3,Int32Array:A.cX,Int8Array:A.cZ,Uint16Array:A.e4,Uint32Array:A.d2,Uint8ClampedArray:A.d3,CanvasPixelArray:A.d3,Uint8Array:A.bU})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ag.$nativeSuperclassTag="ArrayBufferView"
A.dh.$nativeSuperclassTag="ArrayBufferView"
A.di.$nativeSuperclassTag="ArrayBufferView"
A.d_.$nativeSuperclassTag="ArrayBufferView"
A.dj.$nativeSuperclassTag="ArrayBufferView"
A.dk.$nativeSuperclassTag="ArrayBufferView"
A.d0.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
Function.prototype.$5=function(a,b,c,d,e){return this(a,b,c,d,e)}
Function.prototype.$6=function(a,b,c,d,e,f){return this(a,b,c,d,e,f)}
Function.prototype.$9=function(a,b,c,d,e,f,g,h,i){return this(a,b,c,d,e,f,g,h,i)}
Function.prototype.$8=function(a,b,c,d,e,f,g,h){return this(a,b,c,d,e,f,g,h)}
Function.prototype.$1$1=function(a){return this(a)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.po
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()