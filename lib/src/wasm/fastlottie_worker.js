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
if(a[b]!==s){A.p8(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.h(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.jZ(b)
return new s(c,this)}:function(){if(s===null)s=A.jZ(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.jZ(a).prototype
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
k2(a,b,c,d){return{i:a,p:b,e:c,x:d}},
iE(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.k0==null){A.oT()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.f(A.kP("Return interceptor for "+A.x(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.hV
if(o==null)o=$.hV=A.iD(n)
p=q[o]}if(p!=null)return p
p=A.oX(a)
if(p!=null)return p
if(typeof a=="function")return B.a8
s=Object.getPrototypeOf(a)
if(s==null)return B.F
if(s===Object.prototype)return B.F
if(typeof q=="function"){o=$.hV
if(o==null)o=$.hV=A.iD(n)
Object.defineProperty(q,o,{value:B.w,enumerable:false,writable:true,configurable:true})
return B.w}return B.w},
jm(a,b){if(a<0||a>4294967295)throw A.f(A.as(a,0,4294967295,"length",null))
return J.mz(new Array(a),b)},
jn(a,b){if(a<0)throw A.f(A.aI("Length must be a non-negative integer: "+a,null))
return A.h(new Array(a),b.i("z<0>"))},
mz(a,b){var s=A.h(a,b.i("z<0>"))
s.$flags=1
return s},
kt(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
mA(a,b){var s,r
for(s=a.length;b<s;){r=a.charCodeAt(b)
if(r!==32&&r!==13&&!J.kt(r))break;++b}return b},
mB(a,b){var s,r,q
for(s=a.length;b>0;b=r){r=b-1
if(!(r<s))return A.a(a,r)
q=a.charCodeAt(r)
if(q!==32&&q!==13&&!J.kt(q))break}return b},
aH(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cN.prototype
return J.dX.prototype}if(typeof a=="string")return J.cf.prototype
if(a==null)return J.cO.prototype
if(typeof a=="boolean")return J.cM.prototype
if(Array.isArray(a))return J.z.prototype
if(typeof a!="object"){if(typeof a=="function")return J.az.prototype
if(typeof a=="symbol")return J.bQ.prototype
if(typeof a=="bigint")return J.bP.prototype
return a}if(a instanceof A.e)return a
return J.iE(a)},
R(a){if(typeof a=="string")return J.cf.prototype
if(a==null)return a
if(Array.isArray(a))return J.z.prototype
if(typeof a!="object"){if(typeof a=="function")return J.az.prototype
if(typeof a=="symbol")return J.bQ.prototype
if(typeof a=="bigint")return J.bP.prototype
return a}if(a instanceof A.e)return a
return J.iE(a)},
bb(a){if(a==null)return a
if(Array.isArray(a))return J.z.prototype
if(typeof a!="object"){if(typeof a=="function")return J.az.prototype
if(typeof a=="symbol")return J.bQ.prototype
if(typeof a=="bigint")return J.bP.prototype
return a}if(a instanceof A.e)return a
return J.iE(a)},
cB(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.az.prototype
if(typeof a=="symbol")return J.bQ.prototype
if(typeof a=="bigint")return J.bP.prototype
return a}if(a instanceof A.e)return a
return J.iE(a)},
m(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aH(a).G(a,b)},
aj(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.oW(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.R(a).h(a,b)},
m9(a,b){return J.bb(a).au(a,b)},
ke(a,b,c){return J.cB(a).dS(a,b,c)},
j7(a,b,c){return J.cB(a).dT(a,b,c)},
ma(a,b,c){return J.cB(a).dU(a,b,c)},
mb(a,b,c){return J.cB(a).dV(a,b,c)},
mc(a){return J.cB(a).dW(a)},
cb(a,b,c){return J.cB(a).bv(a,b,c)},
kf(a,b){return J.bb(a).am(a,b)},
kg(a){return J.cB(a).ga7(a)},
md(a){return J.bb(a).ga5(a)},
av(a){return J.aH(a).gX(a)},
j8(a){return J.R(a).gR(a)},
cD(a){return J.bb(a).gD(a)},
ap(a){return J.R(a).gk(a)},
me(a){return J.aH(a).gY(a)},
kh(a){return J.bb(a).gaf(a)},
ki(a,b,c,d,e){return J.bb(a).K(a,b,c,d,e)},
mf(a,b){return J.bb(a).ap(a,b)},
bM(a){return J.aH(a).u(a)},
D:function D(){},
cM:function cM(){},
cO:function cO(){},
V:function V(){},
bz:function bz(){},
e9:function e9(){},
d9:function d9(){},
az:function az(){},
bP:function bP(){},
bQ:function bQ(){},
z:function z(a){this.$ti=a},
dW:function dW(){},
fd:function fd(a){this.$ti=a},
bN:function bN(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cP:function cP(){},
cN:function cN(){},
dX:function dX(){},
cf:function cf(){}},A={jo:function jo(){},
kv(a){return new A.bd("Field '"+a+"' has been assigned during initialization.")},
mD(a){return new A.bd("Field '"+a+"' has not been initialized.")},
ar(a){return new A.bd("Local '"+a+"' has not been initialized.")},
fi(a){return new A.bd("Local '"+a+"' has already been initialized.")},
bj(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
fO(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
jY(a,b,c){return a},
k1(a){var s,r
for(s=$.aG.length,r=0;r<s;++r)if(a===$.aG[r])return!0
return!1},
fJ(a,b,c,d){A.aU(b,"start")
if(c!=null){A.aU(c,"end")
if(b>c)A.r(A.as(b,0,c,"start",null))}return new A.d7(a,b,c,d.i("d7<0>"))},
kE(a,b,c){var s="count"
if(t.gw.b(a)){A.eY(b,s,t.S)
A.aU(b,s)
return new A.ce(a,b,c.i("ce<0>"))}A.eY(b,s,t.S)
A.aU(b,s)
return new A.bh(a,b,c.i("bh<0>"))},
ae(){return new A.bi("No element")},
jk(){return new A.bi("Too many elements")},
mx(){return new A.bi("Too few elements")},
bd:function bd(a){this.a=a},
iO:function iO(){},
fE:function fE(){},
p:function p(){},
a9:function a9(){},
d7:function d7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
bT:function bT(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
a1:function a1(a,b,c){this.a=a
this.b=b
this.$ti=c},
bW:function bW(a,b,c){this.a=a
this.b=b
this.$ti=c},
db:function db(a,b,c){this.a=a
this.b=b
this.$ti=c},
bh:function bh(a,b,c){this.a=a
this.b=b
this.$ti=c},
ce:function ce(a,b,c){this.a=a
this.b=b
this.$ti=c},
d4:function d4(a,b,c){this.a=a
this.b=b
this.$ti=c},
cI:function cI(a){this.$ti=a},
cJ:function cJ(a){this.$ti=a},
I:function I(){},
bE:function bE(){},
mr(){throw A.f(A.aK("Cannot modify constant Set"))},
lH(a){var s=A.lG(a)
if(s!=null)return s
return"minified:"+a},
oW(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
x(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bM(a)
return s},
d0(a){var s,r=$.kA
if(r==null)r=$.kA=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
mS(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b==null){if(s!=null)return parseInt(a,10)
if(m[2]!=null)return parseInt(a,16)
return n}if(b<2||b>36)throw A.f(A.as(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
jw(a){var s,r
if(!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(a))return null
s=parseFloat(a)
if(isNaN(s)){r=B.p.hP(a)
if(r==="NaN"||r==="+NaN"||r==="-NaN")return s
return null}return s},
ea(a){var s,r,q,p
if(a instanceof A.e)return A.ao(A.aP(a),null)
s=J.aH(a)
if(s===B.a7||s===B.a9||t.ak.b(a)){r=B.x(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.ao(A.aP(a),null)},
kB(a){var s,r,q
if(a==null||typeof a=="number"||A.b1(a))return J.bM(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bw)return a.u(0)
if(a instanceof A.Q)return a.dI(!0)
s=$.m7()
for(r=0;r<1;++r){q=s[r].hS(a)
if(q!=null)return q}return"Instance of '"+A.ea(a)+"'"},
mP(){return Date.now()},
mR(){var s,r
if($.fx!==0)return
$.fx=1000
if(typeof window=="undefined")return
s=window
if(s==null)return
if(!!s.dartUseDateNowForTicks)return
r=s.performance
if(r==null)return
if(typeof r.now!="function")return
$.fx=1e6
$.jx=new A.fw(r)},
mT(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
d1(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.L(s,10)|55296)>>>0,s&1023|56320)}throw A.f(A.as(a,0,1114111,null,null))},
mQ(a){var s=a.$thrownJsError
if(s==null)return null
return A.bt(s)},
mU(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.Z(a,s)
a.$thrownJsError=s
s.stack=""}},
ah(a){throw A.f(A.iB(a))},
a(a,b){if(a==null)J.ap(a)
throw A.f(A.eW(a,b))},
eW(a,b){var s,r="index"
if(!A.o(b))return new A.b2(!0,b,r,null)
s=A.j(J.ap(a))
if(b<0||b>=s)return A.jh(b,s,a,r)
return A.mV(b,r)},
iB(a){return new A.b2(!0,a,null,null)},
lx(a){return a},
f(a){return A.Z(a,new Error())},
Z(a,b){var s
if(a==null)a=new A.bk()
b.dartException=a
s=A.p9
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
p9(){return J.bM(this.dartException)},
r(a,b){throw A.Z(a,b==null?new Error():b)},
d(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.r(A.nU(a,b,c),s)},
nU(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.da("'"+s+"': Cannot "+o+" "+l+k+n)},
a_(a){throw A.f(A.ax(a))},
bl(a){var s,r,q,p,o,n
a=A.p3(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.h([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.fS(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
fT(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
kO(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
jp(a,b){var s=b==null,r=s?null:b.method
return new A.dZ(a,r,s?null:b.receiver)},
ai(a){var s
if(a==null)return new A.fu(a)
if(a instanceof A.cK){s=a.a
return A.bL(a,s==null?A.b_(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bL(a,a.dartException)
return A.oA(a)},
bL(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
oA(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.L(r,16)&8191)===10)switch(q){case 438:return A.bL(a,A.jp(A.x(s)+" (Error "+q+")",null))
case 445:case 5007:A.x(s)
return A.bL(a,new A.cZ())}}if(a instanceof TypeError){p=$.lR()
o=$.lS()
n=$.lT()
m=$.lU()
l=$.lX()
k=$.lY()
j=$.lW()
$.lV()
i=$.m_()
h=$.lZ()
g=p.an(s)
if(g!=null)return A.bL(a,A.jp(A.H(s),g))
else{g=o.an(s)
if(g!=null){g.method="call"
return A.bL(a,A.jp(A.H(s),g))}else if(n.an(s)!=null||m.an(s)!=null||l.an(s)!=null||k.an(s)!=null||j.an(s)!=null||m.an(s)!=null||i.an(s)!=null||h.an(s)!=null){A.H(s)
return A.bL(a,new A.cZ())}}return A.bL(a,new A.eo(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.d5()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bL(a,new A.b2(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.d5()
return a},
bt(a){var s
if(a instanceof A.cK)return a.b
if(a==null)return new A.dv(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.dv(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
iP(a){if(a==null)return J.av(a)
if(typeof a=="object")return A.d0(a)
return J.av(a)},
oP(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.q(0,a[s],a[r])}return b},
o6(a,b,c,d,e,f){t.Z.a(a)
switch(A.j(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.f(new A.hk("Unsupported number of arguments for wrapped closure"))},
dH(a,b){var s=a.$identity
if(!!s)return s
s=A.oI(a,b)
a.$identity=s
return s},
oI(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.o6)},
mq(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.ef().constructor.prototype):Object.create(new A.cd(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.kr(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.mm(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.kr(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
mm(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.f("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.mj)}throw A.f("Error in functionType of tearoff")},
mn(a,b,c,d){var s=A.kq
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
kr(a,b,c,d){if(c)return A.mp(a,b,d)
return A.mn(b.length,d,a,b)},
mo(a,b,c,d){var s=A.kq,r=A.mk
switch(b?-1:a){case 0:throw A.f(new A.ed("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
mp(a,b,c){var s,r
if($.ko==null)$.ko=A.kn("interceptor")
if($.kp==null)$.kp=A.kn("receiver")
s=b.length
r=A.mo(s,c,a,b)
return r},
jZ(a){return A.mq(a)},
mj(a,b){return A.dC(v.typeUniverse,A.aP(a.a),b)},
kq(a){return a.a},
mk(a){return a.b},
kn(a){var s,r,q,p=new A.cd("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.f(A.aI("Field name "+a+" not found.",null))},
iD(a){return v.getIsolateTag(a)},
N(){throw A.f(new A.eM(null))},
pZ(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
oX(a){var s,r,q,p,o,n=A.H($.lA.$1(a)),m=$.iC[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iK[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.im($.lv.$2(a,n))
if(q!=null){m=$.iC[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iK[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.iN(s)
$.iC[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.iK[n]=s
return s}if(p==="-"){o=A.iN(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.lE(a,s)
if(p==="*")throw A.f(A.kP(n))
if(v.leafTags[n]===true){o=A.iN(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.lE(a,s)},
lE(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.k2(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
iN(a){return J.k2(a,!1,null,!!a.$iaA)},
oZ(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.iN(s)
else return J.k2(s,c,null,null)},
oT(){if(!0===$.k0)return
$.k0=!0
A.oU()},
oU(){var s,r,q,p,o,n,m,l
$.iC=Object.create(null)
$.iK=Object.create(null)
A.oS()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.lF.$1(o)
if(n!=null){m=A.oZ(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
oS(){var s,r,q,p,o,n,m=B.L()
m=A.cA(B.M,A.cA(B.N,A.cA(B.y,A.cA(B.y,A.cA(B.O,A.cA(B.P,A.cA(B.Q(B.x),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.lA=new A.iG(p)
$.lv=new A.iH(o)
$.lF=new A.iI(n)},
cA(a,b){return a(b)||b},
np(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.m(r,b[s]))return!1}return!0},
oJ(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
ku(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.f(A.U("Illegal RegExp pattern ("+String(o)+")",a,null))},
p3(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
dk:function dk(a){this.a=a},
cs:function cs(a){this.a=a},
dl:function dl(a){this.a=a},
dm:function dm(a){this.a=a},
ct:function ct(a){this.a=a},
dn:function dn(a){this.a=a},
y:function y(a,b){this.a=a
this.b=b},
dp:function dp(a,b){this.a=a
this.b=b},
aF:function aF(a,b,c){this.a=a
this.b=b
this.c=c},
dq:function dq(a,b,c){this.a=a
this.b=b
this.c=c},
cu:function cu(a,b,c){this.a=a
this.b=b
this.c=c},
c3:function c3(a,b,c){this.a=a
this.b=b
this.c=c},
cv:function cv(a,b,c){this.a=a
this.b=b
this.c=c},
b9:function b9(a){this.a=a},
dr:function dr(a){this.a=a},
cw:function cw(a){this.a=a},
ds:function ds(a){this.a=a},
bH:function bH(a){this.a=a},
de:function de(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cH:function cH(){},
S:function S(a,b,c){this.a=a
this.b=b
this.$ti=c},
fw:function fw(a){this.a=a},
d3:function d3(){},
fS:function fS(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
cZ:function cZ(){},
dZ:function dZ(a,b,c){this.a=a
this.b=b
this.c=c},
eo:function eo(a){this.a=a},
fu:function fu(a){this.a=a},
cK:function cK(a,b){this.a=a
this.b=b},
dv:function dv(a){this.a=a
this.b=null},
bw:function bw(){},
dM:function dM(){},
dN:function dN(){},
ek:function ek(){},
ef:function ef(){},
cd:function cd(a,b){this.a=a
this.b=b},
ed:function ed(a){this.a=a},
eM:function eM(a){this.a=a},
bc:function bc(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
fe:function fe(a){this.a=a},
fj:function fj(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
P:function P(a,b){this.a=a
this.$ti=b},
cR:function cR(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bS:function bS(a,b){this.a=a
this.$ti=b},
aR:function aR(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bR:function bR(a,b){this.a=a
this.$ti=b},
cQ:function cQ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
ak:function ak(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
iG:function iG(a){this.a=a},
iH:function iH(a){this.a=a},
iI:function iI(a){this.a=a},
Q:function Q(){},
c2:function c2(){},
cr:function cr(){},
b8:function b8(){},
an:function an(){},
dY:function dY(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
df:function df(a){this.b=a},
eq:function eq(a,b,c){this.a=a
this.b=b
this.c=c},
cm:function cm(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
p8(a){throw A.Z(A.kv(a),new Error())},
E(){throw A.Z(A.mD(""),new Error())},
T(){throw A.Z(A.kv(""),new Error())},
eu(){var s=new A.h3()
return s.b=s},
h3:function h3(){this.b=null},
bs(a,b,c){},
ad(a){return a},
mJ(a,b,c){A.bs(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
fr(a){return new Float32Array(a)},
e2(a){return new Float32Array(A.ad(a))},
mM(a,b,c){A.bs(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Float32Array(a,b,c)},
js(a,b,c){A.bs(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
mN(a){return new Int32Array(a)},
e4(a,b,c){A.bs(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Int32Array(a,b,c)},
ky(a){return new Uint32Array(a)},
jt(a,b,c){A.bs(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
kz(a){return new Uint8Array(a)},
ju(a,b,c){A.bs(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
b0(a,b,c){if(a>>>0!==a||a>=c)throw A.f(A.eW(b,a))},
bB:function bB(){},
cg:function cg(){},
cT:function cT(a){this.a=a},
eL:function eL(a){this.a=a},
cW:function cW(){},
ig:function ig(a){this.a=a},
e1:function e1(){},
af:function af(){},
bC:function bC(){},
aB:function aB(){},
ch:function ch(){},
cU:function cU(){},
e3:function e3(){},
cV:function cV(){},
e5:function e5(){},
e6:function e6(){},
cX:function cX(){},
cY:function cY(){},
bU:function bU(){},
aT:function aT(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
eF:function eF(){},
eG:function eG(){},
dg:function dg(){},
dh:function dh(){},
di:function di(){},
dj:function dj(){},
eO:function eO(){},
jy(a,b){var s=b.c
return s==null?b.c=A.dA(a,"ay",[b.x]):s},
kD(a){var s=a.w
if(s===6||s===7)return A.kD(a.x)
return s===11||s===12},
mX(a){return a.as},
bu(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
dI(a){return A.ie(v.typeUniverse,a,!1)},
c6(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.c6(a1,s,a3,a4)
if(r===s)return a2
return A.l0(a1,r,!0)
case 7:s=a2.x
r=A.c6(a1,s,a3,a4)
if(r===s)return a2
return A.l_(a1,r,!0)
case 8:q=a2.y
p=A.cz(a1,q,a3,a4)
if(p===q)return a2
return A.dA(a1,a2.x,p)
case 9:o=a2.x
n=A.c6(a1,o,a3,a4)
m=a2.y
l=A.cz(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.jN(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.cz(a1,j,a3,a4)
if(i===j)return a2
return A.l1(a1,k,i)
case 11:h=a2.x
g=A.c6(a1,h,a3,a4)
f=a2.y
e=A.ox(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.kZ(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.cz(a1,d,a3,a4)
o=a2.x
n=A.c6(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.jO(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.f(A.dL("Attempted to substitute unexpected RTI kind "+a0))}},
cz(a,b,c,d){var s,r,q,p,o=b.length,n=A.ij(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.c6(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
oy(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.ij(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.c6(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
ox(a,b,c,d){var s,r=b.a,q=A.cz(a,r,c,d),p=b.b,o=A.cz(a,p,c,d),n=b.c,m=A.oy(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.eA()
s.a=q
s.b=o
s.c=m
return s},
h(a,b){a[v.arrayRti]=b
return a},
ly(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.oR(s)
return a.$S()}return null},
oV(a,b){var s
if(A.kD(b))if(a instanceof A.bw){s=A.ly(a)
if(s!=null)return s}return A.aP(a)},
aP(a){if(a instanceof A.e)return A.n(a)
if(Array.isArray(a))return A.a4(a)
return A.jQ(J.aH(a))},
a4(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
n(a){var s=a.$ti
return s!=null?s:A.jQ(a)},
jQ(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.o4(a,s)},
o4(a,b){var s=a instanceof A.bw?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.nA(v.typeUniverse,s.name)
b.$ccache=r
return r},
oR(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.ie(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
iF(a){return A.c8(A.n(a))},
jW(a){var s
if(a instanceof A.Q)return A.oO(a.$r,a.aW())
s=a instanceof A.bw?A.ly(a):null
if(s!=null)return s
if(t.dm.b(a))return J.me(a).a
if(Array.isArray(a))return A.a4(a)
return A.aP(a)},
c8(a){var s=a.r
return s==null?a.r=new A.id(a):s},
oO(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.dC(v.typeUniverse,A.jW(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.l3(v.typeUniverse,s,A.jW(q[r]))}return A.dC(v.typeUniverse,s,a)},
aQ(a){return A.c8(A.ie(v.typeUniverse,a,!1))},
o3(a){var s=this
s.b=A.ov(s)
return s.b(a)},
ov(a){var s,r,q,p,o
if(a===t.K)return A.oc
if(A.c9(a))return A.og
s=a.w
if(s===6)return A.o1
if(s===1)return A.ll
if(s===7)return A.o7
r=A.ou(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.c9)){a.f="$i"+q
if(q==="v")return A.oa
if(a===t.m)return A.o9
return A.of}}else if(s===10){p=A.oJ(a.x,a.y)
o=p==null?A.ll:p
return o==null?A.b_(o):o}return A.o_},
ou(a){if(a.w===8){if(a===t.S)return A.o
if(a===t.i||a===t.q)return A.ob
if(a===t.N)return A.oe
if(a===t.y)return A.b1}return null},
o2(a){var s=this,r=A.nZ
if(A.c9(s))r=A.nL
else if(s===t.K)r=A.b_
else if(A.cC(s)){r=A.o0
if(s===t.gs)r=A.nJ
else if(s===t.dk)r=A.im
else if(s===t.fQ)r=A.nH
else if(s===t.cg)r=A.l7
else if(s===t.cD)r=A.nI
else if(s===t.an)r=A.nK}else if(s===t.S)r=A.j
else if(s===t.N)r=A.H
else if(s===t.y)r=A.aO
else if(s===t.q)r=A.eP
else if(s===t.i)r=A.X
else if(s===t.m)r=A.w
s.a=r
return s.a(a)},
o_(a){var s=this
if(a==null)return A.cC(s)
return A.lD(v.typeUniverse,A.oV(a,s),s)},
o1(a){if(a==null)return!0
return this.x.b(a)},
of(a){var s,r=this
if(a==null)return A.cC(r)
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aH(a)[s]},
oa(a){var s,r=this
if(a==null)return A.cC(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aH(a)[s]},
o9(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.e)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
lk(a){if(typeof a=="object"){if(a instanceof A.e)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
nZ(a){var s=this
if(a==null){if(A.cC(s))return a}else if(s.b(a))return a
throw A.Z(A.lb(a,s),new Error())},
o0(a){var s=this
if(a==null||s.b(a))return a
throw A.Z(A.lb(a,s),new Error())},
lb(a,b){return new A.cx("TypeError: "+A.kR(a,A.ao(b,null)))},
oH(a,b,c,d){if(A.lD(v.typeUniverse,a,b))return a
throw A.Z(A.ns("The type argument '"+A.ao(a,null)+"' is not a subtype of the type variable bound '"+A.ao(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
kR(a,b){return A.f3(a)+": type '"+A.ao(A.jW(a),null)+"' is not a subtype of type '"+b+"'"},
ns(a){return new A.cx("TypeError: "+a)},
aM(a,b){return new A.cx("TypeError: "+A.kR(a,b))},
o7(a){var s=this
return s.x.b(a)||A.jy(v.typeUniverse,s).b(a)},
oc(a){return a!=null},
b_(a){if(a!=null)return a
throw A.Z(A.aM(a,"Object"),new Error())},
og(a){return!0},
nL(a){return a},
ll(a){return!1},
b1(a){return!0===a||!1===a},
aO(a){if(!0===a)return!0
if(!1===a)return!1
throw A.Z(A.aM(a,"bool"),new Error())},
nH(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.Z(A.aM(a,"bool?"),new Error())},
X(a){if(typeof a=="number")return a
throw A.Z(A.aM(a,"double"),new Error())},
nI(a){if(typeof a=="number")return a
if(a==null)return a
throw A.Z(A.aM(a,"double?"),new Error())},
o(a){return typeof a=="number"&&Math.floor(a)===a},
j(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.Z(A.aM(a,"int"),new Error())},
nJ(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.Z(A.aM(a,"int?"),new Error())},
ob(a){return typeof a=="number"},
eP(a){if(typeof a=="number")return a
throw A.Z(A.aM(a,"num"),new Error())},
l7(a){if(typeof a=="number")return a
if(a==null)return a
throw A.Z(A.aM(a,"num?"),new Error())},
oe(a){return typeof a=="string"},
H(a){if(typeof a=="string")return a
throw A.Z(A.aM(a,"String"),new Error())},
im(a){if(typeof a=="string")return a
if(a==null)return a
throw A.Z(A.aM(a,"String?"),new Error())},
w(a){if(A.lk(a))return a
throw A.Z(A.aM(a,"JSObject"),new Error())},
nK(a){if(a==null)return a
if(A.lk(a))return a
throw A.Z(A.aM(a,"JSObject?"),new Error())},
lr(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.ao(a[q],b)
return s},
op(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.lr(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.ao(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
lh(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(l===8){p=A.oz(a.x)
o=a.y
return o.length>0?p+("<"+A.lr(o,b)+">"):p}if(l===10)return A.op(a,b)
if(l===11)return A.lh(a,b,null)
if(l===12)return A.lh(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
oz(a){var s=A.lG(a)
if(s!=null)return s
return"minified:"+a},
nB(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
nA(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.ie(a,b,!1)
else if(typeof m=="number"){s=m
r=A.dB(a,5,"#")
q=A.ij(s)
for(p=0;p<s;++p)q[p]=r
o=A.dA(a,b,q)
n[b]=o
return o}else return m},
nz(a,b){return A.l5(a.tR,b)},
ny(a,b){return A.l5(a.eT,b)},
ie(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.l2(a,null,b,!1)
r.set(b,s)
return s},
dC(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.l2(a,b,c,!0)
q.set(c,r)
return r},
l3(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.jN(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
l2(a,b,c,d){return A.nn(A.nh(a,b,c,d))},
bJ(a,b){b.a=A.o2
b.b=A.o3
return b},
dB(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aV(null,null)
s.w=b
s.as=c
r=A.bJ(a,s)
a.eC.set(c,r)
return r},
l0(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.nw(a,b,r,c)
a.eC.set(r,s)
return s},
nw(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.c9(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.cC(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aV(null,null)
q.w=6
q.x=b
q.as=c
return A.bJ(a,q)},
l_(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.nu(a,b,r,c)
a.eC.set(r,s)
return s},
nu(a,b,c,d){var s,r
if(d){s=b.w
if(A.c9(b)||b===t.K)return b
else if(s===1)return A.dA(a,"ay",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aV(null,null)
r.w=7
r.x=b
r.as=c
return A.bJ(a,r)},
nx(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aV(null,null)
s.w=13
s.x=b
s.as=q
r=A.bJ(a,s)
a.eC.set(q,r)
return r},
dz(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
nt(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
dA(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.dz(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aV(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bJ(a,r)
a.eC.set(p,q)
return q},
jN(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.dz(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aV(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bJ(a,o)
a.eC.set(q,n)
return n},
l1(a,b,c){var s,r,q="+"+(b+"("+A.dz(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aV(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bJ(a,s)
a.eC.set(q,r)
return r},
kZ(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.dz(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.dz(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.nt(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aV(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bJ(a,p)
a.eC.set(r,o)
return o},
jO(a,b,c,d){var s,r=b.as+("<"+A.dz(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.nv(a,b,c,r,d)
a.eC.set(r,s)
return s},
nv(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.ij(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.c6(a,b,r,0)
m=A.cz(a,c,r,0)
return A.jO(a,n,m,c!==m)}}l=new A.aV(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bJ(a,l)},
nh(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
nn(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.nj(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.kW(a,r,l,k,!1)
else if(q===46)r=A.kW(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.c1(a.u,a.e,k.pop()))
break
case 94:k.push(A.nx(a.u,k.pop()))
break
case 35:k.push(A.dB(a.u,5,"#"))
break
case 64:k.push(A.dB(a.u,2,"@"))
break
case 126:k.push(A.dB(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.nl(a,k)
break
case 38:A.nk(a,k)
break
case 63:p=a.u
k.push(A.l0(p,A.c1(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.l_(p,A.c1(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.ni(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.kX(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.no(a.u,a.e,o)
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
return A.c1(a.u,a.e,m)},
nj(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
kW(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.nB(s,o.x)[p]
if(n==null)A.r('No "'+p+'" in "'+A.mX(o)+'"')
d.push(A.dC(s,o,n))}else d.push(p)
return m},
nl(a,b){var s,r=a.u,q=A.kV(a,b),p=b.pop()
if(typeof p=="string")b.push(A.dA(r,p,q))
else{s=A.c1(r,a.e,p)
switch(s.w){case 11:b.push(A.jO(r,s,q,a.n))
break
default:b.push(A.jN(r,s,q))
break}}},
ni(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.kV(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.c1(p,a.e,o)
q=new A.eA()
q.a=s
q.b=n
q.c=m
b.push(A.kZ(p,r,q))
return
case-4:b.push(A.l1(p,b.pop(),s))
return
default:throw A.f(A.dL("Unexpected state under `()`: "+A.x(o)))}},
nk(a,b){var s=b.pop()
if(0===s){b.push(A.dB(a.u,1,"0&"))
return}if(1===s){b.push(A.dB(a.u,4,"1&"))
return}throw A.f(A.dL("Unexpected extended operation "+A.x(s)))},
kV(a,b){var s=b.splice(a.p)
A.kX(a.u,a.e,s)
a.p=b.pop()
return s},
c1(a,b,c){if(typeof c=="string")return A.dA(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.nm(a,b,c)}else return c},
kX(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.c1(a,b,c[s])},
no(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.c1(a,b,c[s])},
nm(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.f(A.dL("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.f(A.dL("Bad index "+c+" for "+b.u(0)))},
lD(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.a7(a,b,null,c,null)
r.set(c,s)}return s},
a7(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.c9(d))return!0
s=b.w
if(s===4)return!0
if(A.c9(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.a7(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.a7(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.a7(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.a7(a,b.x,c,d,e))return!1
return A.a7(a,A.jy(a,b),c,d,e)}if(s===6)return A.a7(a,p,c,d,e)&&A.a7(a,b.x,c,d,e)
if(q===7){if(A.a7(a,b,c,d.x,e))return!0
return A.a7(a,b,c,A.jy(a,d),e)}if(q===6)return A.a7(a,b,c,p,e)||A.a7(a,b,c,d.x,e)
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
if(!A.a7(a,j,c,i,e)||!A.a7(a,i,e,j,c))return!1}return A.lj(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.lj(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.o8(a,b,c,d,e)}if(o&&q===10)return A.od(a,b,c,d,e)
return!1},
lj(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.a7(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.a7(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.a7(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.a7(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.a7(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
o8(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.dC(a,b,r[o])
return A.l6(a,p,null,c,d.y,e)}return A.l6(a,b.y,null,c,d.y,e)},
l6(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.a7(a,b[s],d,e[s],f))return!1
return!0},
od(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.a7(a,r[s],c,q[s],e))return!1
return!0},
cC(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.c9(a))if(s!==6)r=s===7&&A.cC(a.x)
return r},
c9(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
l5(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
ij(a){return a>0?new Array(a):v.typeUniverse.sEA},
aV:function aV(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
eA:function eA(){this.c=this.b=this.a=null},
id:function id(a){this.a=a},
ex:function ex(){},
cx:function cx(a){this.a=a},
n9(){var s,r,q
if(self.scheduleImmediate!=null)return A.oB()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dH(new A.h_(s),1)).observe(r,{childList:true})
return new A.fZ(s,r,q)}else if(self.setImmediate!=null)return A.oC()
return A.oD()},
na(a){self.scheduleImmediate(A.dH(new A.h0(t.O.a(a)),0))},
nb(a){self.setImmediate(A.dH(new A.h1(t.O.a(a)),0))},
nc(a){t.O.a(a)
A.nq(0,a)},
nq(a,b){var s=new A.ia()
s.eD(a,b)
return s},
ln(a){return new A.er(new A.M($.G,a.i("M<0>")),a.i("er<0>"))},
la(a,b){a.$2(0,null)
b.b=!0
return b.a},
io(a,b){A.nM(a,b)},
l9(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("ay<1>").b(a))s.cS(a)
else s.cW(a)},
l8(a,b){var s=A.ai(a),r=A.bt(a),q=A.li(s,r)
s=new A.aw(s,r)
r=b.b
q=b.a
if(r)q.bh(s)
else q.bf(s)},
nM(a,b){var s,r,q=new A.ip(b),p=new A.iq(b)
if(a instanceof A.M)a.dG(q,p,t.z)
else{s=t.z
if(a instanceof A.M)a.cu(q,p,s)
else{r=new A.M($.G,t._)
r.a=8
r.c=a
r.dG(q,p,s)}}},
lu(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.G
return r.c_(r,t.as.a(new A.iA(s)),t.H,t.S,t.z)},
jc(a){var s
if(t.R.b(a)){s=a.gaU()
if(s!=null)return s}return B.q},
li(a,b){var s=$.G
if(s===B.k)return null
s.f4(s,a,b)
return null},
o5(a,b){if($.G!==B.k)A.li(a,b)
if(t.R.b(a)){b=a.gaU()
if(b==null){A.mU(a,B.q)
b=B.q}}else b=B.q
return new A.aw(a,b)},
jH(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.mY()
b.bf(new A.aw(new A.b2(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.dm(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.aY()
b.bg(n.a)
A.c_(b,p)
return}b.a^=2
o=b.b
o.aZ(o,new A.hG(n,b))},
c_(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.aX(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.c_(e.a,d)
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
if((d&15)===8)new A.hK(q,e,n).$0()
else if(o){if((d&1)!==0)new A.hJ(q,j).$0()}else if((d&2)!==0)new A.hI(e,q).$0()
if(h!=null)$.G=h
d=q.c
if(d instanceof A.M){p=q.a.$ti
p=p.i("ay<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bs(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.jH(d,g,!0)
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
oq(a,b){var s=t.C
if(s.b(a))return b.c_(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.br(b,s.a(a),t.z,t.K)
throw A.f(A.kj(a,"onError",u.c))},
oj(){var s,r
for(s=$.cy;s!=null;s=$.cy){$.dF=null
r=s.b
$.cy=r
if(r==null)$.dE=null
s.a.$0()}},
ow(){$.jR=!0
try{A.oj()}finally{$.dF=null
$.jR=!1
if($.cy!=null)$.ka().$1(A.lw())}},
ls(a){var s=new A.es(a),r=$.dE
if(r==null){$.cy=$.dE=s
if(!$.jR)$.ka().$1(A.lw())}else $.dE=r.b=s},
ot(a){var s,r,q,p=$.cy
if(p==null){A.ls(a)
$.dF=$.dE
return}s=new A.es(a)
r=$.dF
if(r==null){s.b=p
$.cy=$.dF=s}else{q=r.b
s.b=q
$.dF=r.b=s
if(q==null)$.dE=s}},
p5(a){var s=$.G
if(B.k===s){A.jT(B.k,a)
return}A.jT(s,s.bq(s,a,t.H))
return},
pq(a,b){A.jY(a,"stream",t.K)
return new A.eI(b.i("eI<0>"))},
jU(a){return},
nd(a,b){if(b==null)b=A.oF()
if(t.da.b(b))return a.c_(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.br(a,t.w.a(b),t.z,t.K)
throw A.f(A.aI("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
ol(a,b){var s=$.G
s.aX(s,a,b)},
ok(){},
os(a,b){A.ot(new A.iy(a,b))},
jT(a,b){if(B.k!==a)b=a.h1(b,t.H)
A.ls(b)},
h_:function h_(a){this.a=a},
fZ:function fZ(a,b,c){this.a=a
this.b=b
this.c=c},
h0:function h0(a){this.a=a},
h1:function h1(a){this.a=a},
ia:function ia(){},
ib:function ib(a,b){this.a=a
this.b=b},
er:function er(a,b){this.a=a
this.b=!1
this.$ti=b},
ip:function ip(a){this.a=a},
iq:function iq(a){this.a=a},
iA:function iA(a){this.a=a},
aw:function aw(a,b){this.a=a
this.b=b},
ev:function ev(){},
dc:function dc(a,b){this.a=a
this.$ti=b},
bm:function bm(a,b,c,d,e){var _=this
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
hD:function hD(a,b){this.a=a
this.b=b},
hH:function hH(a,b){this.a=a
this.b=b},
hG:function hG(a,b){this.a=a
this.b=b},
hF:function hF(a,b){this.a=a
this.b=b},
hE:function hE(a,b){this.a=a
this.b=b},
hK:function hK(a,b,c){this.a=a
this.b=b
this.c=c},
hL:function hL(a,b){this.a=a
this.b=b},
hM:function hM(a){this.a=a},
hJ:function hJ(a,b){this.a=a
this.b=b},
hI:function hI(a,b){this.a=a
this.b=b},
es:function es(a){this.a=a
this.b=null},
d6:function d6(){},
fH:function fH(a,b){this.a=a
this.b=b},
fI:function fI(a,b){this.a=a
this.b=b},
dw:function dw(){},
i7:function i7(a){this.a=a},
i6:function i6(a){this.a=a},
et:function et(){},
cn:function cn(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
co:function co(a,b){this.a=a
this.$ti=b},
cp:function cp(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
dd:function dd(){},
h2:function h2(a){this.a=a},
dy:function dy(){},
bG:function bG(){},
bY:function bY(a,b){this.b=a
this.a=null
this.$ti=b},
ew:function ew(){},
aY:function aY(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
i3:function i3(a,b){this.a=a
this.b=b},
eI:function eI(a){this.$ti=a},
fX:function fX(){},
fY:function fY(a,b,c){this.a=a
this.b=b
this.c=c},
iy:function iy(a,b){this.a=a
this.b=b},
mE(a,b,c){return b.i("@<0>").a3(c).i("jq<1,2>").a(A.oP(a,new A.bc(b.i("@<0>").a3(c).i("bc<1,2>"))))},
a8(a,b){return new A.bc(a.i("@<0>").a3(b).i("bc<1,2>"))},
mF(a){return new A.bo(a.i("bo<0>"))},
fk(a){return new A.bo(a.i("bo<0>"))},
jJ(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
kx(a){var s,r
if(A.k1(a))return"{...}"
s=new A.ck("")
try{r={}
B.b.m($.aG,a)
s.a+="{"
r.a=!0
a.aK(0,new A.fn(r,s))
s.a+="}"}finally{if(0>=$.aG.length)return A.a($.aG,-1)
$.aG.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
bo:function bo(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
c0:function c0(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
eE:function eE(a){this.a=a
this.c=this.b=null},
bp:function bp(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
A:function A(){},
J:function J(){},
fm:function fm(a){this.a=a},
fn:function fn(a,b){this.a=a
this.b=b},
bg:function bg(){},
dt:function dt(){},
om(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ai(r)
q=A.U(String(s),null,null)
throw A.f(q)}q=A.is(p)
return q},
is(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.eC(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.is(a[s])
return a},
nD(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.m5()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
nC(a,b,c,d){var s=a?$.m4():$.m3()
if(s==null)return null
if(0===c&&d===b.length)return A.l4(s,b)
return A.l4(s,b.subarray(c,d))},
l4(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
nE(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
eC:function eC(a,b){this.a=a
this.b=b
this.c=null},
hW:function hW(a){this.a=a},
eD:function eD(a){this.a=a},
ii:function ii(){},
ih:function ih(){},
dO:function dO(){},
dQ:function dQ(){},
e_:function e_(){},
ff:function ff(a){this.a=a},
eN:function eN(a){this.a=a
this.b=16
this.c=0},
lC(a,b){var s=A.mS(a,b)
if(s!=null)return s
throw A.f(A.U(a,null,null))},
oM(a){var s=A.jw(a)
if(s!=null)return s
throw A.f(A.U("Invalid double",a,null))},
ms(a,b){a=A.Z(a,new Error())
if(a==null)a=A.b_(a)
a.stack=b.u(0)
throw a},
jr(a,b,c,d){var s,r=c?J.jn(a,d):J.jm(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
mG(a,b,c){var s,r,q=A.h([],c.i("z<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.a_)(a),++r)B.b.m(q,c.a(a[r]))
q.$flags=1
return q},
aS(a,b){var s,r
if(Array.isArray(a))return A.h(a.slice(0),b.i("z<0>"))
s=A.h([],b.i("z<0>"))
for(r=J.cD(a);r.t();)B.b.m(s,r.gB())
return s},
eh(a,b,c){var s,r
A.aU(b,"start")
s=c-b
if(s<0)throw A.f(A.as(c,b,null,"end",null))
if(s===0)return""
r=A.mZ(a,b,c)
return r},
mZ(a,b,c){var s=a.length
if(b>=s)return""
return A.mT(a,b,c==null||c>s?s:c)},
ec(a){return new A.dY(a,A.ku(a,!1,!0,!1,!1,""))},
kG(a,b,c){var s=J.cD(b)
if(!s.t())return a
if(c.length===0){do a+=A.x(s.gB())
while(s.t())}else{a+=A.x(s.gB())
while(s.t())a=a+c+A.x(s.gB())}return a},
mY(){return A.bt(new Error())},
f3(a){if(typeof a=="number"||A.b1(a)||a==null)return J.bM(a)
if(typeof a=="string")return JSON.stringify(a)
return A.kB(a)},
mt(a,b){A.jY(a,"error",t.K)
A.jY(b,"stackTrace",t.l)
A.ms(a,b)},
dL(a){return new A.cF(a)},
aI(a,b){return new A.b2(!1,null,b,a)},
kj(a,b,c){return new A.b2(!0,a,b,c)},
eY(a,b,c){return a},
kC(a){var s=null
return new A.bf(s,s,!1,s,s,a)},
mV(a,b){return new A.bf(null,null,!0,a,b,"Value not in range")},
as(a,b,c,d,e){return new A.bf(b,c,!0,a,d,"Invalid value")},
b4(a,b,c){if(0>a||a>c)throw A.f(A.as(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.f(A.as(b,a,c,"end",null))
return b}return c},
aU(a,b){if(a<0)throw A.f(A.as(a,0,null,b,null))
return a},
jh(a,b,c,d){return new A.dS(b,!0,a,d,"Index out of range")},
aK(a){return new A.da(a)},
kP(a){return new A.en(a)},
at(a){return new A.bi(a)},
ax(a){return new A.dP(a)},
U(a,b,c){return new A.a0(a,b,c)},
my(a,b,c){var s,r
if(A.k1(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.h([],t.s)
B.b.m($.aG,a)
try{A.oh(a,s)}finally{if(0>=$.aG.length)return A.a($.aG,-1)
$.aG.pop()}r=A.kG(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
jl(a,b,c){var s,r
if(A.k1(a))return b+"..."+c
s=new A.ck(b)
B.b.m($.aG,a)
try{r=s
r.a=A.kG(r.a,a,", ")}finally{if(0>=$.aG.length)return A.a($.aG,-1)
$.aG.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
oh(a,b){var s,r,q,p,o,n,m,l=a.gD(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.t())return
s=A.x(l.gB())
B.b.m(b,s)
k+=s.length+2;++j}if(!l.t()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gB();++j
if(!l.t()){if(j<=4){B.b.m(b,A.x(p))
return}r=A.x(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gB();++j
for(;l.t();p=o,o=n){n=l.gB();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.b.m(b,"...")
return}}q=A.x(p)
r=A.x(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.b.m(b,m)
B.b.m(b,q)
B.b.m(b,r)},
e7(a,b,c,d){var s
if(B.m===c){s=J.av(a)
b=J.av(b)
return A.fO(A.bj(A.bj($.eX(),s),b))}if(B.m===d){s=J.av(a)
b=J.av(b)
c=J.av(c)
return A.fO(A.bj(A.bj(A.bj($.eX(),s),b),c))}s=J.av(a)
b=J.av(b)
c=J.av(c)
d=J.av(d)
d=A.fO(A.bj(A.bj(A.bj(A.bj($.eX(),s),b),c),d))
return d},
mO(a){var s,r,q=$.eX()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.a_)(a),++r)q=A.bj(q,J.av(a[r]))
return A.fO(q)},
hj:function hj(){},
O:function O(){},
cF:function cF(a){this.a=a},
bk:function bk(){},
b2:function b2(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
bf:function bf(a,b,c,d,e,f){var _=this
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
da:function da(a){this.a=a},
en:function en(a){this.a=a},
bi:function bi(a){this.a=a},
dP:function dP(a){this.a=a},
e8:function e8(){},
d5:function d5(){},
hk:function hk(a){this.a=a},
a0:function a0(a,b,c){this.a=a
this.b=b
this.c=c},
k:function k(){},
bA:function bA(a,b,c){this.a=a
this.b=b
this.$ti=c},
a2:function a2(){},
e:function e(){},
eJ:function eJ(){},
fG:function fG(){this.b=this.a=0},
ck:function ck(a){this.a=a},
nS(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.x(a)
r=A.oG(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.r("Attempting to box non-Dart object.")
q={}
q[$.m6()]=a
r.error=q
r.stack=b.u(0)
return r},
mu(a,b){var s,r=v.G.Promise,q=new A.f9(a)
if(typeof q=="function")A.r(A.aI("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.nP,q)
s[$.j2()]=q
return A.w(new r(s))},
ft:function ft(a){this.a=a},
f9:function f9(a){this.a=a},
f7:function f7(a){this.a=a},
f8:function f8(a){this.a=a},
nO(a,b,c){t.Z.a(a)
if(A.j(c)>=1)return a.$1(b)
return a.$0()},
nP(a,b,c,d){t.Z.a(a)
A.j(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
dG(a,b,c,d){return d.a(a[b].apply(a,c))},
oG(a,b,c){var s,r
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
k3(a,b){var s=new A.M($.G,b.i("M<0>")),r=new A.dc(s,b.i("dc<0>"))
a.then(A.dH(new A.iQ(r,b),1),A.dH(new A.iR(r),1))
return s},
iQ:function iQ(a,b){this.a=a
this.b=b},
iR:function iR(a){this.a=a},
fa:function fa(){},
fb:function fb(a,b,c){this.a=a
this.b=b
this.c=c},
hN:function hN(){},
hP:function hP(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
hO:function hO(a){this.a=a},
jg(a,b){var s=new A.fc()
s.eB(a,b)
return s},
fc:function fc(){this.a=$
this.b=0
this.c=2147483647},
fW:function fW(){},
ik:function ik(){},
il:function il(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
ep:function ep(a){this.a=a
this.c=this.b=0},
dT:function dT(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
oK(a,b,c){var s,r="The decoded data is larger than the ",q=new A.e0(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.f(A.jb(r+b+" bytes allowed"))
throw s}if(q.e)throw A.f(A.jb(r+b+" bytes allowed"))
return p},
e0:function e0(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
ja(a){return new A.cc(a,null,null)},
j9(a){return new A.cE(a,null,null)},
jb(a){return new A.dK(a,null,null)},
cc:function cc(a,b,c){this.a=a
this.b=b
this.c=c},
cE:function cE(a,b,c){this.a=a
this.b=b
this.c=c},
dK:function dK(a,b,c){this.a=a
this.b=b
this.c=c},
cG:function cG(a,b){this.a=a
this.b=b},
ee:function ee(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
lB(a,b,c,d){var s,r,q,p=c,o=new A.hh($.jP)
$.jP=o
try{if(d.$0())return!0
if(p){r=A.ja("Invalid "+a+" data")
throw A.f(r)}return!1}catch(q){s=A.ai(q)
r=s
if(!(r instanceof A.cc||r instanceof A.cE||r instanceof A.a0||t.b8.b(r)||t.E.b(r)))throw q
r=s instanceof A.dK
if(r)throw q
if(s instanceof A.cE){if(b&&c)throw q
if(c){r=A.ja(s.a)
throw A.f(r)}return!1}if(s instanceof A.cc){if(p)throw q
return!1}if(p){r=A.ja("Invalid "+a+" data: "+A.x(s))
throw A.f(r)}return!1}finally{$.jP=o.a}},
hh:function hh(a){this.a=a},
ji(a,b,c,d){var s,r,q,p,o=new A.dU(b)
if(d==null)d=0
A.aU(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.ad(a))
p=J.cb(B.d.ga7(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
dU:function dU(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
dV:function dV(){},
jv(a){var s=a==null?32768:a
return new A.bV(new Uint8Array(s),B.o)},
bV:function bV(a,b){this.b=0
this.c=a
this.a=b},
bD:function bD(){},
mh(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
mg(a){var s,r,q,p,o=new Uint32Array(2048)
B.j.C(o,0,256,a)
for(s=0;s<256;++s){r=a[s]
for(q=1;q<8;++q){r=(a[r&255]^r>>>8)>>>0
p=(q<<8|s)>>>0
if(!(p<2048))return A.a(o,p)
o[p]=r}}return o},
kl(a,b,c){var s,r,q,p,o,n,m,l,k=$.lI(),j=b+c,i=4294967295
if(c>=16){s=A.je(a,b,j)
r=(c&4294967288)>>>0
for(q=0;q<r;){p=s.getUint32(q,!0)^i
o=s.getUint32(q+4,!0)
i=k[1792+(p&255)]^k[1536+(p>>>8&255)]^k[1280+(p>>>16&255)]^k[1024+(p>>>24&255)]^k[768+(o&255)]^k[512+(o>>>8&255)]^k[256+(o>>>16&255)]^k[o>>>24&255]
q+=8}n=b+q}else n=b
for(m=a.length;n<j;n=l){l=n+1
if(!(n<m))return A.a(a,n)
i=k[(i^a[n])&255]^i>>>8}return(i^4294967295)&2147483647},
aq(a,b){return(a&65535)*b+(((a>>>16)*b&65535)<<16>>>0)>>>0},
kk(a,b){return(B.a.dv(a,b)|B.a.ev(a,32-b))>>>0},
mi(a,b,c,d){var s,r,q,p,o,n,m,l=3266489917,k=d?1367130551:0,j=(2654435761^c^k)>>>0,i=b+c,h=(c&4294967292)>>>0
if(c>=16){s=A.je(a,b,i)
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
jd(a,b,c,d,e){var s=e?2147483648:0,r=(a&2147483647|s)>>>0,q=A.mi(b,c,d,e)
return new A.y(r,r===0&&q===0?1:q)},
km(a,b,c,d){var s=A.kk(A.aq((a^c)>>>0,2246822519),13),r=A.kk(A.aq((b^d)>>>0,3266489917),17)
s=A.aq(s+r>>>0,668265263)
return new A.y(s,A.aq((r^s>>>16)>>>0,374761393))},
eH:function eH(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eZ:function eZ(a,b,c,d,e,f,g,h,i,j,k,l){var _=this
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
f2:function f2(a,b,c){this.a=a
this.b=b
this.c=c},
f1:function f1(a,b){this.a=a
this.b=b},
f_:function f_(a){this.a=a},
f0:function f0(a){this.a=a},
kw(a,b,c){var s,r,q
for(s=b;s<c;s=r){r=s+65536
q=r<c?r:c
B.d.C(a,s,q,$.lN())}},
mH(b5,b6,b7,b8,b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
if(b6<0||b6>b5.length)throw A.f(A.as(b6,0,b5.length,"srcLength",null))
if(b6===0)return 0
s=b9>=0?b9:b7.length
r=0
q=0
if(b6>=13){B.e.C(b8,0,16384,$.lM())
p=A.je(b5,0,b6)
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
B.d.K(b7,a3,a6,b5,q)
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
a1=B.a.L(a8,8)
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
B.d.K(b7,r,l,b5,q)
return l},
mI(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0
if(b3<0||b2+b3>b1.length||b5<0||b5>b4.length)throw A.f(A.kC("Invalid LZ4 slice bounds"))
if(b3===0){if(b5!==0)throw A.f(B.Z)
return 0}s=b2+b3
for(r=b4.length,q=b4.$flags|0,p=b1.length,o=b2,n=0;o<s;){m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
l=b1[o]
k=l>>>4
if(k===15)for(o=m;;o=m){if(o>=s)throw A.f(B.a_)
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
j=b1[o]
k+=j
if(j!==255){o=m
break}}else o=m
m=o+k
if(m>s||n+k>b5)throw A.f(B.Y)
i=n+k
if(k>=8){B.d.K(b4,n,i,b1,o)
n=i
o=m}else for(;n<i;n=h,o=m){h=n+1
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
g=b1[o]
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}if(o>=s)break
m=o+2
if(m>s)throw A.f(B.U)
if(!(o>=0&&o<p))return A.a(b1,o)
g=b1[o]
f=o+1
if(!(f<p))return A.a(b1,f)
e=(g|b1[f]<<8)>>>0
if(e<=0||e>n)throw A.f(B.W)
g=l&15
d=g+4
if(g===15)for(o=m;;o=m){if(o>=s)throw A.f(B.a0)
m=o+1
if(!(o>=0&&o<p))return A.a(b1,o)
j=b1[o]
d+=j
if(j!==255){o=m
break}}else o=m
i=n+d
if(i>b5)throw A.f(B.a2)
c=n-e
if(e>=d){if(d>=8)B.d.K(b4,n,i,b4,c)
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
if((a|a0|a1|a2)===0){A.kw(b4,n,i)
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
B.d.K(b4,g,g+a7,b4,n)
a5+=a7}n=i}}else if(e===1){if(!(c>=0&&c<r))return A.a(b4,c)
a8=b4[c]
if(a8===0){A.kw(b4,n,i)
n=i}else if(d<=32)for(;n<i;n=h){h=n+1
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=a8}else{for(b=0;b<16;++b){g=n+b
q&2&&A.d(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=a8}for(a5=16;a5<d;){a6=d-a5
a7=a5<a6?a5:a6
g=n+a5
B.d.K(b4,g,g+a7,b4,n)
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
B.d.K(b4,g,g+a7,b4,n)
a5+=a7}n=i}else for(;n<i;c=a4,n=h){h=n+1
a4=c+1
if(!(c>=0&&c<r))return A.a(b4,c)
g=b4[c]
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}}if(n!==b5)throw A.f(A.U("LZ4 decoded "+n+" bytes, expected "+b5,null,null))
return n},
fl:function fl(a,b){this.a=a
this.b=b
this.c=0},
n4(c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5=null,c6=d5*d1,c7=c9.length
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
if((d4.byteOffset&3)===0){k=A.jF(d4,0,l)
j=c5}else{j=new Uint8Array(l)
k=A.jF(j,0,l)}i=A.h([],t.a1)
h=A.a8(t.h6,t.L)
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
a9=((a9^k[b3])>>>0)*16777619>>>0}}b4=h.ef(new A.aF(a7,a8,a9),new A.fQ())
b3=J.bb(b4)
b6=b3.gD(b4)
for(;;){if(!b6.t()){b5=-1
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
B.j.K(b7,b0*a7,c3*a7,k,(a6+b0)*d5+a5)}b5=i.length
b3.m(b4,b5)
B.b.m(i,b7)}b3=a2+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
p[b3]=b5
if(a0){b3=a3+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
b3=p[b3]!==b5}else b3=!1
if(b3)++d}}if(d*3>(c7-1)*r)return c5
q=A.h([],t.gN)
for(l=i.length,c4=0;c4<i.length;i.length===l||(0,A.a_)(i),++c4)q.push(J.mc(B.j.ga7(i[c4])))
return new A.el(d5,d1,c8,o,p,q,new A.e(),g,n,m)},
fP:function fP(){this.a=null
this.b=-1},
el:function el(a,b,c,d,e,f,g,h,i,j){var _=this
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
fQ:function fQ(){},
aC:function aC(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ir(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.j.C(a,0,b,$.kd())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.j.C(a,s,q,$.kd())}},
iJ(a){var s=0,r=A.ln(t.H),q,p,o,n,m
var $async$iJ=A.lu(function(b,c){if(b===1)return A.l8(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.io(A.k3(A.w(v.G.WebAssembly.instantiate(a)),t.m),$async$iJ)
case 2:o=n.w(m.w(c.instance).exports)
for(q=0;q<13;++q){p=B.ag[q]
if(!(typeof o[p]==="function"))throw A.f(A.at("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.w(o.memory).buffer).byteLength===0)throw A.f(A.at("FastLottie Wasm memory is empty"))
$.l=o
return A.l9(null,r)}})
return A.la($async$iJ,r)},
aN(a){var s,r,q=$.l
q.toString
s=a===0?1:a
r=A.j(q.malloc(s))
if(r<=0)throw A.f(A.at("Could not allocate "+a+" Wasm bytes"))
B.d.ac(A.ju(t.a.a(A.w($.l.memory).buffer),r,a),0,a,0)
return r},
fs(a){var s=new A.b3(!0,a,null,null),r=$.l!=null
if(r)s.c=A.aN(a*4)
else s.d=new Uint32Array(a)
return s},
iS(a,b){var s=a.c
if(s!=null)$.l.fastlottie_clear_pixels(s,b)
else A.ir(a.gv(),b)},
p6(a,b,c,d,e,f,g){var s,r,q=a.c
if(q!=null&&e.b!=null){s=$.l
s.toString
r=e.b
r.toString
A.dG(s,"fastlottie_fill_solid_spans",[q,b,c,d,r,f,g],t.H)
return!0}return!1},
p_(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dG(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
p0(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dG(s,"fastlottie_blend_solid",[q,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
p2(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dG(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
p1(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0,a1,a2,a3,a4){var s,r,q,p=a.c
if(p==null||e.b==null||g.c==null)return!1
s=$.l
s.toString
r=e.b
r.toString
q=g.c
q.toString
A.dG(s,"fastlottie_gradient_spans",[p,b,c,d,r,f,q,h,i,j?1:0,k,l,m,n,o,a0,a1,a2,a3,a4],t.H)
return!0},
mL(){var s,r,q=$.l==null
if(q)return null
try{s=A.j($.l.fl_dense_new())
if(!J.m(s,0)){q=A.aN(16)
return new A.fo(s,q)}}catch(r){}return null},
mK(){var s,r=$.fp
if(r!=null){$.cS=$.cS+1
return r}s=A.mL()
if(s==null)return null
$.fp=s
$.cS=1
return s},
be:function be(a){this.a=a
this.c=this.b=null},
b3:function b3(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fo:function fo(a,b){var _=this
_.a=a
_.b=b
_.y=_.x=_.w=_.r=_.f=_.e=_.d=_.c=0},
fq:function fq(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
bK(a,b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g
while(a instanceof A.Y)a=a.a
if(a instanceof A.aa){s=a.c
if(!s.gaD()){r=a4.d5(a6)
A.eQ(s,b,c,d,e,f,a0,a1,r)
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
A.bK(s[k],b,q,p,o,n,m,l,a2,a3,a4,a5,j)}return}if(a instanceof A.br){i=A.nW(a.a,a.b,b,A.lm(c,d,e,f,a2),a4,a5,a6)
if(i!=null&&i.r>0)a3.aH(i,c,d,e,f,a0,a1)
return}if(a instanceof A.aX){if(a.b===3&&a.a.length>=2){for(s=a.a,k=0;k<s.length-1;++k)A.bK(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
h=a4.eJ(a6)
A.bK(B.b.gad(s),b,c,d,e,f,a0,a1,a2,h,a4,a5,a6+1)
a3.h_(h)
return}for(s=a.a,k=0;k<s.length;++k)A.bK(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
return}if(a.ga6()){a3.aH(a4.dA(a,b),c,d,e,f,a0,a1)
return}if(c===1&&d===0&&e===0&&f===1&&a0===0&&a1===0)A.it(a,b,a2,a3)
else{g=a4.fx
g.l(0)
A.it(a,b,A.lm(c,d,e,f,a2),g)
a3.aH(g,c,d,e,f,a0,a1)}},
lm(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
lg(b4,b5,b6,b7,b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0=b4.e,b1=b0.n(b5),b2=b1.length,b3=b2/6|0
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
it(a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(a3 instanceof A.aE){A.lg(a3,a4,a5,a6,null)
return}if(a3 instanceof A.b7){a6.a4(!0)
s=a6.gfZ()
a3.fb(a4,s,s,new A.iu(a6,a5),a6.ghg())
return}if(a3 instanceof A.aZ){r=a3.r.n(a4)
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
nW(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=a.a,b=c.length
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
n=a3.eM(a4)
s=a4+1
A.bK(o,a1,1,0,0,1,0,0,a2,n,a3,s,a5)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a.d.n(a1)
if(0>=l.length)return A.a(l,0)
k=B.c.T(m+l[0]/360,1)
j=k+p
if(!a.e){i=A.lo(o,a1,a2,a3,n,s,a5)
h=0}else{g=a3.fc(a4,a,a1,a2)
if(g==null){g=a3.eK(a4,b+1)
g.$flags&2&&A.d(g)
m=g.length
if(0>=m)return A.a(g,0)
g[0]=0
for(f=0,e=0;e<b;){if(!(e<c.length))return A.a(c,e)
l=c[e]
f+=A.lo(l,a1,a2,a3,e===a0?n:null,s,a5);++e
if(!(e<m))return A.a(g,e)
g[e]=f}a3.fA(a4,a,a1,a2)}c=g.length
if(!(b<c))return A.a(g,b)
i=g[b]
if(!(a0<c))return A.a(g,a0)
h=g[a0]}d=a3.eL(a4)
c=a3.p3
A.le(n,k*i-h,Math.min(j,1)*i-h,d,c)
if(j>1)A.le(n,-h,(j-1)*i-h,d,c)
return d},
lo(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga6()){s=d.fd(a)
if(s!=null)return s}r=A.eu()
if(e!=null)r.se5(e)
else{r.se5(d.eI(f))
A.bK(a,b,1,0,0,1,0,0,c,r.ar(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.r(A.ar(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.r(A.ar(""))
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
if(o===r)A.r(A.ar(""))
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
o.q(0,a,new A.ag(n,q,t.e))}return q},
le(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
k=a7.aJ(l+1)
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
a6.p(q,f[a2])}a6.a2()}else A.ld(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
ld(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.a.L(r+a,1)
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
nG(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
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
f=b5.aJ(g+1)
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
if((a5&1)===0&&a7>a6+1e-7)A.ld(b1,j,i,h,f,g,a6,a7,b4)
a5=(a5+1)%a9
if(!(a5<a8))return A.a(b0,a5)
a4=b0[a5]}}},
ba(a,b,c,d,e,f,g,h,i,j){var s,r,q=f+h,p=g+i,o=q*q+p*p
if(o>1e-12&&j<5){s=1/Math.sqrt(o)
q*=s
p*=s
if(j<2||b*(1-(f*q+g*p))>c){r=j+1
A.ba(a,b,c,d,e,f,g,q,p,r)
a.p(d+b*q,e+b*p)
A.ba(a,b,c,d,e,q,p,h,i,r)
return}}if(j===0)a.p(d+b*h,e+b*i)},
jV(a,b,c,d,e,f,g,h,i){A.ba(a,b,c,d,e,f,g,h,i,0)
a.p(d+b*h,e+b*i)},
iz(a,b,c,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a8?-1:1,d=b.length
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
if(l<-0.999){A.jV(a,a0,a2,a6,a7,n,s,s,q)
A.jV(a,a0,a2,a6,a7,s,q,m,p)}else A.jV(a,a0,a2,a6,a7,n,s,m,p)}else{a.p(j,i)
a.p(h,g)}},
lc(e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5
if(e7<=0)return
if(f3.a&&f3.hj(e6,e7,e8,e9,f0,f1,f2))return
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
c=m.aJ(e)
b=l.aJ(e)
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
A.ba(f2,e7,r,b3,b4,1,0,0,1,0)
a=b3+k
f2.p(a,b4+e7)
A.ba(f2,e7,r,b3,b4,0,1,-1,0,0)
a0=b4+k
f2.p(b3+j,a0)
A.ba(f2,e7,r,b3,b4,-1,0,0,-1,0)
f2.p(a,b4+j)
A.ba(f2,e7,r,b3,b4,0,-1,1,0,0)
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
b6=o.aJ(b5)
b7=n.aJ(b5)
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
A.iz(f2,b6,b7,e7,s,r,e9,c6,c5,h,b[c5],!1)}f2.a2()
f2.a4(!0)
for(c5=a7-1;c5>=0;--c5){c7=c5===0?c4:c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.iz(f2,b6,b7,e7,s,r,e9,c5,c7,h,b[c5],!0)}f2.a2()}else{f2.a4(!0)
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
A.iz(f2,b6,b7,e7,s,r,e9,c5-1,c5,a0,b[c5],!1)}d0=b5-1
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
A.ba(f2,e7,r,d1,d2,h,d3,d3,d4,0)
h=e7*d4
f2.p(d1+a0,d2+h)
a0=-d3
A.ba(f2,e7,r,d1,d2,d3,d4,d4,a0,0)
f2.p(d1+h,d2+e7*a0)}else{f2.p(d5,d6)
f2.p(d7,d8)}for(c5=a7-2;c5>=1;c5=d9){d9=c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.iz(f2,b6,b7,e7,s,r,e9,c5,d9,h,b[c5],!0)}e0=c[0]
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
A.ba(f2,e7,r,e0,e1,e3,a1,a1,h,0)
f2.p(e0+e7*a1,e1+a)
A.ba(f2,e7,r,e0,e1,a1,h,h,e2,0)
f2.p(e0+a,e1+a0)}else f2.p(e4,e5)
f2.a2()}}},
lq(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k=d,j=d*e,i=k
if(typeof i!=="number")return i.ah()
p=i*e
i=k
if(typeof i!=="number")return i.cD()
if(i<d||p>c.gv().length)throw A.f(A.aI("Raster output is too small",null))
i=f.b
if(i)A.iS(c,p)
else A.cl(c.gv(),p)
o=!0
if(d>0)if(e>0){n=a.b
n===$&&A.E()
if(!(n<=0)){o=a.c
o===$&&A.E()
o=o<=0}}if(o)return
o=a.b
o===$&&A.E()
s=d/o
o=a.c
o===$&&A.E()
r=e/o
q=f.ay
f.ay=a
try{A.jS(a,b,255,c,0,0,k,0,0,d,e,s,0,0,r,0,0,null,f,0,!0,i)
m=Math.max(A.j(j),f.xr)
f.xr=0
l=m<=65536&&!f.as
f.as=!1
if(l){if(++f.y1>=16){f.y1=0
f.hR()}}else f.y1=0}finally{f.sfJ(q)}},
jS(d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0=null
if(d8>=e0||d9>=e1||d3<=0)return
s=f2?d4:d0
r=d1.w
for(q=r.length-1,p=f0+1,o=f0*3,n=o+1,m=e5>=0,l=e3>=0,k=e4>=0,j=e2>=0,i=t.a,h=s!=null,g=o+2;q>=0;--q){if(!(q<r.length))return A.a(r,q)
f=r[q]
if(!f.ch){if(!f.e)e=(f.b!=null||f.f!=null)&&d2>=f.c&&d2<f.d
else e=!1
e=!e}else e=!0
if(e)continue
e=f.a.e.n(d2)
if(0>=e.length)return A.a(e,0)
if(B.c.H(B.a.F(B.c.N(d3*B.c.H(e[0])/100),0,255)*f.aT(d2)/255)===0)continue
d=f.ay
c=f.Q
e=f.y
b=e===2||e===4
a=f.ax?255:d3
a0=d!=null
a1=!1
if(a0){if(!d.e)a2=(d.b!=null||d.f!=null)&&d2>=d.c&&d2<d.d
else a2=!1
if(a2){a2=d.a.e.n(d2)
if(0>=a2.length)return A.a(a2,0)
a2=B.c.H(B.a.F(B.c.N(a*B.c.H(a2[0])/100),0,255)*d.aT(d2)/255)>0
a1=a2}}if(a0&&!a1&&!b)continue
if(!a1){if(c===0)A.c5(f,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,0,!0,!1,!1,!1,!0)
else{a3=f.aA(d2)
if(a3!=null){e=j?a3.a:a3.c
a0=k?a3.b:a3.d
a4=B.c.P(e2*e+e4*a0+e6)-1
e=l?a3.a:a3.c
a0=m?a3.b:a3.d
a5=B.c.P(e3*e+e5*a0+e7)-1
e=j?a3.c:a3.a
a0=k?a3.d:a3.b
a6=B.c.W(e2*e+e4*a0+e6)+1
e=l?a3.c:a3.a
a0=m?a3.d:a3.b
a7=B.c.W(e3*e+e5*a0+e7)+1
if(a4<d8)a4=d8
if(a5<d9)a5=d9
if(a6>e0)a6=e0
if(a7>e1)a7=e1
a8=a6-a4
a9=a7-a5
if(a8>0&&a9>0){if(f.f==null){e=f.b
b0=e==null?d0:e.gcG()}else b0=d0
e=!1
if(b0!=null){a0=b0.y
if(a0!=null){if(h){a2=$.l
if(a2!=null){a2=!0
if(c!==6)if(c!==7)if(c!==9)a2=c>=12&&c<=15
if(!a2){e=!1
if(a0.w){a0=a0.f
if(a0!=null)if(a0.a!=null){e=a0.n(0)
if(0>=e.length)return A.a(e,0)
e=e[0]!==0}else e=!0}e=!e}}}}else e=!0}if(e){A.c5(f,d2,d3,d4,d5,d6,d7,a4,a5,a6,a7,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,c,!0,!1,!1,!1,!0)
continue}e=a8*a9
b1=e9.aL(g,e)
if(f2){a0=b1.c
if(a0!=null)$.l.fastlottie_clear_pixels(a0,e)
else{a0=b1.d
a0.toString
A.ir(a0,e)}}else{a0=b1.c
if(a0!=null){a2=i.a(A.w($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.cl(a0,e)}A.c5(f,d2,d3,b1,a4,a5,a8,a4,a5,a6,a7,e2,e3,e4,e5,e6,e7,e8,e9,p,f1,f2,0,!0,!0,!1,!1,!0)
if(h){e=!0
if(c!==6)if(c!==7)if(c!==9)e=c>=12&&c<=15
b3=!e&&A.p_(s,(a5-d6)*d7+a4-d5,d7,b1,a8,a9,c)}else b3=!1
if(!b3){e=d4.c
if(e!=null){a0=i.a(A.w($.l.memory).buffer)
b2=d4.b
e=new Uint32Array(a0,e,b2)}else{e=d4.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.w($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.n1(e,a4-d5,a5-d6,d7,a0,0,0,a8,a8,a9,c)}}}}continue}b4=e===3||e===4
b5=f.aA(d2)
if(b5==null)continue
e=j?b5.a:b5.c
a0=k?b5.b:b5.d
b6=B.c.P(e2*e+e4*a0+e6)-1
e=l?b5.a:b5.c
a0=m?b5.b:b5.d
b7=B.c.P(e3*e+e5*a0+e7)-1
e=j?b5.c:b5.a
a0=k?b5.d:b5.b
b8=B.c.W(e2*e+e4*a0+e6)+1
e=l?b5.c:b5.a
a0=m?b5.d:b5.b
b9=B.c.W(e3*e+e5*a0+e7)+1
if(b6<d8)b6=d8
if(b7<d9)b7=d9
if(b8>e0)b8=e0
if(b9>e1)b9=e1
if(b6>=b8||b7>=b9)continue
c0=d.aA(d2)
if(c0!=null){e=j?c0.a:c0.c
a0=k?c0.b:c0.d
c1=Math.max(b6,B.c.P(e2*e+e4*a0+e6)-1)
e=l?c0.a:c0.c
a0=m?c0.b:c0.d
c2=Math.max(b7,B.c.P(e3*e+e5*a0+e7)-1)
e=j?c0.c:c0.a
a0=k?c0.d:c0.b
c3=Math.min(b8,B.c.W(e2*e+e4*a0+e6)+1)
e=l?c0.c:c0.a
a0=m?c0.d:c0.b
c4=Math.min(b9,B.c.W(e3*e+e5*a0+e7)+1)}else{c4=d9
c3=d8
c2=c4
c1=c3}c5=c1<c3&&c2<c4
if(!b&&!c5)continue
if(b&&!c5&&c===0){A.c5(f,d2,d3,d4,d5,d6,d7,b6,b7,b8,b9,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,0,!0,!1,!1,!1,!0)
continue}a4=b?b6:c1
a5=b?b7:c2
a6=b?b8:c3
a7=b?b9:c4
a8=a6-a4
a9=a7-a5
c6=a8*a9
b1=e9.aL(o,c6)
if(f2){e=b1.c
if(e!=null)$.l.fastlottie_clear_pixels(e,c6)
else{e=b1.d
e.toString
A.ir(e,c6)}}else{e=b1.c
if(e!=null){a0=i.a(A.w($.l.memory).buffer)
b2=b1.b
e=new Uint32Array(a0,e,b2)}else{e=b1.d
e.toString}A.cl(e,c6)}A.c5(f,d2,d3,b1,a4,a5,a8,a4,a5,a6,a7,e2,e3,e4,e5,e6,e7,d0,e9,p,f1,f2,0,!0,!0,!1,!1,!0)
c7=e9.aL(n,c6)
if(f2){e=c7.c
if(e!=null)$.l.fastlottie_clear_pixels(e,c6)
else{e=c7.d
e.toString
A.ir(e,c6)}}else{e=c7.c
if(e!=null){a0=i.a(A.w($.l.memory).buffer)
b2=c7.b
e=new Uint32Array(a0,e,b2)}else{e=c7.d
e.toString}A.cl(e,c6)}if(c5)A.c5(d,d2,a,c7,a4,a5,a8,c1,c2,c3,c4,e2,e3,e4,e5,e6,e7,d0,e9,p,f1,f2,0,!0,!0,!b4,!1,!0)
if(c===0)if(f2)if(e9.bx==null){e=$.k8()
a0=e.length
a2=new A.b3(!0,a0,d0,d0)
c8=$.l!=null
if(c8){c8=a2.c=A.aN(a0*4)
c9=d0}else{c8=a2.d=new Uint32Array(a0)
c9=c8
c8=d0}if(c8!=null){c9=i.a(A.w($.l.memory).buffer)
a0=new Uint32Array(c9,c8,a0)}else{c9.toString
a0=c9}B.j.es(a0,0,e)
e9.bx=a2}e=d4.c
if(e!=null){a0=i.a(A.w($.l.memory).buffer)
b2=d4.b
e=new Uint32Array(a0,e,b2)}else{e=d4.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.w($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}a2=c7.c
if(a2!=null){c8=i.a(A.w($.l.memory).buffer)
b2=c7.b
a2=new Uint32Array(c8,a2,b2)}else{a2=c7.d
a2.toString}A.nR(e,d5,d6,d7,a0,a2,a8,a9,a4,a5,b,b4,c)}},
nR(c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=d1-c4,c2=!d4
if(c2&&d5===0){if(!d3){for(c2=c7.length,s=c8.length,r=c3.length,q=c9-3,p=0;p<d0;++p){o=p*c9
n=(d2+p-c5)*c6+c1
for(m=0;m<q;){l=o+m
if(!(l>=0&&l<c2))return A.a(c7,l)
k=c7[l]
j=l+1
if(!(j<c2))return A.a(c7,j)
i=c7[j]
h=l+2
if(!(h<c2))return A.a(c7,h)
g=c7[h]
f=l+3
if(!(f<c2))return A.a(c7,f)
e=c7[f]
if((k|i|g|e)>>>0===0){m+=4
continue}if(!(l<s))return A.a(c8,l)
d=c8[l]
if(!(j<s))return A.a(c8,j)
c=c8[j]
if(!(h<s))return A.a(c8,h)
b=c8[h]
if(!(f<s))return A.a(c8,f)
a=c8[f]
if(((d|c|b|a)&4278190080)>>>0===0){m+=4
continue}a0=n+m
if((d&c&b&a)>>>0>=4278190080){if((k&i&g&e)>>>0>=4278190080){c3.$flags&2&&A.d(c3)
if(!(a0>=0&&a0<r))return A.a(c3,a0)
c3[a0]=k
j=a0+1
if(!(j<r))return A.a(c3,j)
c3[j]=i
i=a0+2
if(!(i<r))return A.a(c3,i)
c3[i]=g
g=a0+3
if(!(g<r))return A.a(c3,g)
c3[g]=e}else{if(k!==0){if(!(a0>=0&&a0<r))return A.a(c3,a0)
j=A.u(k,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
i=A.u(i,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
g=A.u(g,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
e=A.u(e,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=e}}m+=4
continue}a1=d>>>24
if(k!==0&&a1!==0){a2=a1===255?k:A.W(k,a1)
if(!(a0>=0&&a0<r))return A.a(c3,a0)
j=A.u(a2,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}a3=c>>>24
if(i!==0&&a3!==0){a2=a3===255?i:A.W(i,a3)
j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.u(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}a4=b>>>24
if(g!==0&&a4!==0){a2=a4===255?g:A.W(g,a4)
j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.u(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}a5=a>>>24
if(e!==0&&a5!==0){a2=a5===255?e:A.W(e,a5)
j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.u(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}m+=4}while(m<c9){j=o+m
if(!(j>=0&&j<c2))return A.a(c7,j)
a6=c7[j]
if(a6!==0){if(!(j<s))return A.a(c8,j)
a7=c8[j]>>>24
if(a7!==0){a2=a7===255?a6:A.W(a6,a7)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(c3,a8)
j=A.u(a2,c3[a8])
c3.$flags&2&&A.d(c3)
c3[a8]=j}}++m}}return}for(c2=c7.length,s=c8.length,r=c3.length,q=c9-3,p=0;p<d0;++p){o=p*c9
n=(d2+p-c5)*c6+c1
for(m=0;m<q;){l=o+m
if(!(l>=0&&l<c2))return A.a(c7,l)
k=c7[l]
j=l+1
if(!(j<c2))return A.a(c7,j)
i=c7[j]
h=l+2
if(!(h<c2))return A.a(c7,h)
g=c7[h]
f=l+3
if(!(f<c2))return A.a(c7,f)
e=c7[f]
if((k|i|g|e)>>>0===0){m+=4
continue}if(!(l<s))return A.a(c8,l)
d=c8[l]
if(!(j<s))return A.a(c8,j)
c=c8[j]
if(!(h<s))return A.a(c8,h)
b=c8[h]
if(!(f<s))return A.a(c8,f)
a=c8[f]
if((d&c&b&a)>>>0>=4278190080){m+=4
continue}a0=n+m
if(((d|c|b|a)&4278190080)>>>0===0){if((k&i&g&e)>>>0>=4278190080){c3.$flags&2&&A.d(c3)
if(!(a0>=0&&a0<r))return A.a(c3,a0)
c3[a0]=k
j=a0+1
if(!(j<r))return A.a(c3,j)
c3[j]=i
i=a0+2
if(!(i<r))return A.a(c3,i)
c3[i]=g
g=a0+3
if(!(g<r))return A.a(c3,g)
c3[g]=e}else{if(k!==0){if(!(a0>=0&&a0<r))return A.a(c3,a0)
j=A.u(k,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
i=A.u(i,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
g=A.u(g,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
e=A.u(e,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=e}}m+=4
continue}a9=255-(d>>>24)
if(k!==0&&a9!==0){a2=a9===255?k:A.W(k,a9)
if(!(a0>=0&&a0<r))return A.a(c3,a0)
j=A.u(a2,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}b0=255-(c>>>24)
if(i!==0&&b0!==0){a2=b0===255?i:A.W(i,b0)
j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.u(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}b1=255-(b>>>24)
if(g!==0&&b1!==0){a2=b1===255?g:A.W(g,b1)
j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.u(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}b2=255-(a>>>24)
if(e!==0&&b2!==0){a2=b2===255?e:A.W(e,b2)
j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.u(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}m+=4}while(m<c9){j=o+m
if(!(j>=0&&j<c2))return A.a(c7,j)
a6=c7[j]
if(a6!==0){if(!(j<s))return A.a(c8,j)
b3=255-(c8[j]>>>24)
if(b3!==0){a2=b3===255?a6:A.W(a6,b3)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(c3,a8)
j=A.u(a2,c3[a8])
c3.$flags&2&&A.d(c3)
c3[a8]=j}}++m}}return}for(s=c3.length,r=d5===0,j=c8.length,h=c7.length,p=0;p<d0;++p){o=p*c9
n=(d2+p-c5)*c6+c1
for(m=0;m<c9;++m){f=o+m
if(!(f>=0&&f<h))return A.a(c7,f)
a6=c7[f]
if(a6===0)continue
if(!(f<j))return A.a(c8,f)
b4=c8[f]
a7=b4>>>24
if(c2)b3=d3?255-a7:a7
else if(a7===0)b3=d3?255:0
else{b5=b4>>>16&255
b6=b4>>>8&255
b7=b4&255
if(a7!==255){f=$.k8()
if(!(a7<f.length))return A.a(f,a7)
b8=f[a7]
b5=b5*b8>>>16
b6=b6*b8>>>16
b7=b7*b8>>>16}b9=19595*b5+38470*b6+7471*b7>>>16
c0=b9>255?255:b9
b3=d3?255-c0:c0}if(b3===0)continue
a2=b3===255?a6:A.W(a6,b3)
a8=n+m
if(r){if(!(a8>=0&&a8<s))return A.a(c3,a8)
f=A.u(a2,c3[a8])}else{if(!(a8>=0&&a8<s))return A.a(c3,a8)
f=A.ej(a2,c3[a8],d5)}c3.$flags&2&&A.d(c3)
if(!(a8>=0&&a8<s))return A.a(c3,a8)
c3[a8]=f}}},
eU(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eS(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eV(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eT(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eQ(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaD()){i.$flags&2&&A.d(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gcr()){a.d1(b)
s=a.z
r=a.Q
i.$flags&2&&A.d(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.ec(b)
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
c5(i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0=null
if(!i1.em(i2))return
s=k2?i4:i0
r=k7?255:i1.hx(i2,i3)
q=k4?i1.aT(i2):255
if(r===0||q===0)return
if(!k7)p=k6&&r===255&&q===255
else p=!0
o=p?i0:i1.as
if(o!=null){n=i1.aA(i2)
if(n==null)return
m=B.c.P(A.eU(n,j2,j4,j6))-1
l=B.c.P(A.eV(n,j3,j5,j7))-1
k=B.c.W(A.eS(n,j2,j4,j6))+1
j=B.c.W(A.eT(n,j3,j5,j7))+1
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
b=B.a.L(e,8)
p=-c
a=B.a.L(p,8)
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
if(j9.b)A.iS(a9,p)
else A.cl(a9.gv(),p)}p=a6?k0:k0+1
A.c5(i1,i2,255,a9,b0,b1,b2,a2,a3,a4,a5,j2,j3,j4,j5,j6,j7,j8,j9,p,k1,a6?k2:j9.b,0,!1,!1,!1,!0,!0)
b3=A.a3(r*q)
if(!k6)b4=d===0&&c===0
else b4=!0
p=!1
if(!b4)if(k3===0)if(s!=null)if(b2===a7)if(b0===a2)if(b1===a3)p=(!a6||b3===255)&&A.p2(s,(h-i6)*i7+i-i5,i7,a9,a7,a8,i-a2,h-a3,g-i,f-h,b,a,a0,a1,(255-o.aP(16)<<16|255-o.aP(8)<<8|255-o.aP(0))>>>0,b3)
if(p)return
A.nQ(o,b3,k3,a9.gv(),b0,b1,b2,new A.b9([a2,a3,a4,a5]),i4.gv(),i5,i6,i7,new A.b9([i,h,g,f]),b,a,a0,a1,a6,b4)
return}b5=k8?i1.at:i0
b6=b5==null?i0:b5.h0(i2)
b7=k6&&b6!=null&&b6>>>24===255?i0:b6
if(q!==255||b7!=null){p=b7==null
b3=p?q:A.a3((b7>>>24)*q)
if(b3===0)return
n=i1.aA(i2)
if(n==null)return
i=Math.max(i8,B.c.P(A.eU(n,j2,j4,j6))-1)
h=Math.max(i9,B.c.P(A.eV(n,j3,j5,j7))-1)
g=Math.min(j0,B.c.W(A.eS(n,j2,j4,j6))+1)
f=Math.min(j1,B.c.W(A.eT(n,j3,j5,j7))+1)
a7=g-i
a8=f-h
if(a7<=0||a8<=0)return
e=a7*a8
a9=j9.aL(k0*3+2,e)
if(k2)A.iS(a9,e)
else A.cl(a9.gv(),e)
A.c5(i1,i2,i3,a9,i,h,a7,i,h,g,f,j2,j3,j4,j5,j6,j7,j8,j9,k0+1,k1,k2,0,!1,!1,k6,!1,!1)
b8=a9.gv()
b9=i4.gv()
c0=(h-i6)*i7+i-i5
for(e=b9.length,c1=k3===0,c2=b8.length,c3=b9.$flags|0,c4=0;c4<a8;++c4,c0+=i7)for(c5=c4*a7,c6=0;c6<a7;++c6){c7=c5+c6
if(!(c7>=0&&c7<c2))return A.a(b8,c7)
c8=b8[c7]
if(c8===0)continue
if(p)c9=A.W(c8,b3)
else{d0=(c8>>>24)*b3+128
c9=A.W((b7&16777215|4278190080)>>>0,B.a.L(d0+B.a.L(d0,8),8))}d1=c0+c6
if(c1){if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.u(c9,b9[d1])}else{if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ej(c9,b9[d1],k3)}c3&2&&A.d(b9)
if(!(d1>=0&&d1<e))return A.a(b9,d1)
b9[d1]=c7}return}if(i1.ge8()){for(c8=i1,d2=0;c8!=null;c8=c8.cy)++d2
if(d2===1){d3=j9.c4(k0)
A.eQ(i1.a,i2,j2,j3,j4,j5,j6,j7,d3)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}else{e0=j9.k3
while(e0.length<d2)B.b.m(e0,i0)
e1=d2-1
for(c8=i1;c8!=null;c8=c8.cy,e1=e2){e2=e1-1
B.b.q(e0,e1,c8)}d3=j9.c4(k0)
for(d9=j7,d8=j6,d7=j5,d6=j4,d5=j3,d4=j2,d1=0;d1<d2;++d1){if(!(d1<e0.length))return A.a(e0,d1)
A.eQ(e0[d1].a,i2,d4,d5,d6,d7,d8,d9,d3)
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
d4=j2}e3=k1&&i1.gea()
e4=i1.z
if(e4!=null&&i1.gho()){e5=e3&&i1.ghr()?new A.cs([d4,d5,d6,d7,d8,d9,i8,i9,j0,j1]):i0
p=e5==null
e6=p?i0:j9.ds(i1,e5)
if(e6==null){e7=j9.cO(k0)
e7.l(0)
A.oo(e4,i2,d4,d5,d6,d7,d8,d9,i8,i9,j0,j1,e7,j9,k0)
if(!p)j9.c0(i1,e5,e7)}else if(j8==null&&e6.b!==0){e7=j9.cO(k0)
e7.e1(e6)}else e7=e6
if(e7.b===0)return
if(j8!=null){e8=j9.eF(k0)
A.fD(e7,j8,e8)
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
if(f4!=null)A.lp(f4,i2,r,i4,i5,i6,i7,f0,f1,f2,f3,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2,k3)
f5=i1.f
if(f5!=null){p=i1.x
if(p!=null){p=p.n(i2)
if(0>=p.length)return A.a(p,0)
p=p[0]
e=f5.f
e===$&&A.E()
c1=f5.d
c1===$&&A.E()
f6=p*e-c1}else f6=(i2-i1.r)/i1.w
p=f5.b
p===$&&A.E()
e=f5.c
e===$&&A.E()
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
if(f7<f9&&f8<g0)A.jS(f5,f6,r,i4,i5,i6,i7,f7,f8,f9,g0,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2)}else{g1=f5.gdX()
g2=Math.max(f0,B.c.P(A.eU(g1,d4,d6,d8))-1)
g3=Math.max(f1,B.c.P(A.eV(g1,d5,d7,d9))-1)
g4=Math.min(f2,B.c.W(A.eS(g1,d4,d6,d8))+1)
g5=Math.min(f3,B.c.W(A.eT(g1,d5,d7,d9))+1)
if(g2<g4&&g3<g5){g6=g4-g2
c1=g6*(g5-g3)
g7=j9.aL(k0*3+2,c1)
if(k2)A.iS(g7,c1)
else A.cl(g7.gv(),c1)
A.jS(f5,f6,r,g7,g2,g3,g6,g2,g3,g4,g5,d4,d5,d6,d7,d8,d9,i0,j9,k0+1,e3,k2)
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
j9.aN(c1,!1,j9.gbO(),g2,g3,g4,g5)
g8=j9.gbO()
if(e9!=null){A.fD(j9.gbO(),e9,j9.gbp())
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
if(c8!==0){h9=c3?c8:A.au(c8,h5)
c5=h7+h8
if(!(c5>=0&&c5<e))return A.a(b9,c5)
c7=A.u(h9,b9[c5])
c2&2&&A.d(b9)
b9[c5]=c7}}}}}}},
nQ(c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=d1.a,c0=b9[0],c1=b9[1],c2=b9[2],c3=b9[3]
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
if(b4!==0){a4=A.a3(o*b4)
if(typeof a4!=="number")return A.ah(a4)
a4=A.a3((a5>>>16&255)*(255-a4))
if(typeof a4!=="number")return a4.a9()
b5=A.a3(n*b4)
if(typeof b5!=="number")return A.ah(b5)
b5=A.a3((a5>>>8&255)*(255-b5))
if(typeof b5!=="number")return b5.a9()
b6=A.a3(m*b4)
if(typeof b6!=="number")return A.ah(b6)
b6=A.a3((a5&255)*(255-b6))
if(typeof b6!=="number")return A.ah(b6)
a5=(a5&4278190080|a4<<16|b5<<8|b6)>>>0}}b7=a0+a3
if(e1){d2.$flags&2&&A.d(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a5}else{if(k)a5=A.W(a5,c5)
if(l){if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.u(a5,d2[b7])}else{if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ej(a5,d2[b7],c6)}d2.$flags&2&&A.d(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a4}}}if(e1&&k)for(f=r;f<p;++f){b8=(f-d4)*d5-d3
for(a3=s;a3<q;++a3){l=b8+a3
if(!(l>=0&&l<b9))return A.a(d2,l)
k=A.W(d2[l],c5)
d2.$flags&2&&A.d(d2)
d2[l]=k}}},
oo(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.eH(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.F(0.25/e,0.005,1.5),c=new A.ix(b1.eG(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.b.gaf(a).gcd())c.$2(B.b.gaf(a),b0)
else{s=b1.aq(0)
r=b1.aq(1)
q=b1.aq(2)
for(p=a.length,o=a8-a6,n=!1,m=0;m<a.length;a.length===p||(0,A.a_)(a),++m){l=a[m]
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
if(i!==256)s.er(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aO(g,a6,o,256)
if(j){s.aV(r)
A.d2(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aV(s)
else if(j)A.d2(q,s,b0,k)
else{b0.aV(r)
A.d2(r,s,b0,k)}n=!0}}},
nX(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.d(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.lc(a,Math.abs(b),2,2,4,c,d,e)},
lp(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gco())s=c
else{r=f.e.n(b)
if(0>=r.length)return A.a(r,0)
s=B.a.F(B.c.H(c*B.c.H(r[0])/100),0,255)}if(s===0)return
if(!f.gaD()){q=b3.c4(b4)
A.eQ(f,b,a6,a7,a8,a9,b0,b1,q)
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
i=a.gb9()
for(h=i.length-1,r=b4+1;h>=0;--h){if(!(h<i.length))return A.a(i,h)
g=i[h]
if(g instanceof A.aa)A.lp(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.bq)A.or(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
or(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.n(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.a.F(B.c.H(c0*B.c.H(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gc5())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gI()
b7=b7!==!1
r=b7}b8.id!==$&&A.T()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.cs([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.ds(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.b.au(b8.a,A.k4())
b8.fx!==$&&A.T()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.b2(b9)
if(l==null)return
n=[Math.max(c5,B.c.P(A.eU(l,c9,d1,d3))-2),Math.max(c6,B.c.P(A.eV(l,d0,d2,d4))-2),Math.min(c7,B.c.W(A.eS(l,c9,d1,d3))+2),Math.min(c8,B.c.W(A.eT(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gb_()
m=b8.a
A.iw(m,0,m.length,b9,new A.bH([c9,d0,d1,d2,d3,d4]),new A.b9(n),b8.f,o,d6,0)}else{l=A.on(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
f=d5==null&&b8.y==null&&d9===0
if(f&&d8){e=A.jX(b8,b9,s)
if(d6.fC(d6.dy,g,d6.gb_(),k,j,i,h,c1,c2,c3,c4,e)){o=d6.gb_()
if(!b7&&o.b>0)d6.c0(b8,p,o)
return}}else if(f&&!d8&&b7){e=A.jX(b8,b9,s)
n=c1.gv()
m=d6.ch
if(m==null)m=d6.ch=A.ks(256)
if(m.hF(d6.dy,g,k,j,i,h,n,c2,c3,c4,e))return}d6.aN(d6.dy,g,d6.gb_(),k,j,i,h)
o=d6.gb_()}if(!b7&&o.b>0)d6.c0(b8,p,o)}if(d5!=null){A.fD(o,d5,d6.gbp())
o=d6.gbp()}if(o.b===0)return
d=d8?c1:b6
c=b8.y
if(c==null){e=A.jX(b8,b9,s)
if(d9===0)A.kL(c1.gv(),c2,c3,c4,o,e,d)
else A.n0(c1.gv(),c2,c3,c4,o,e,d9,d)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.nV(c,b9,d6)
a7=c.d.n(b9)
a8=c.e.n(b9)
if(c.ghq()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=c.hl(b9,a9,b0)
if(b1!=null){A.nY(c1.gv(),c2,c3,c4,o,a6.gv(),s,new A.bH([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
return}}b7=!1
if(d!=null){n=$.l
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
b5=A.p1(d,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
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
A.n3(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gv()
b2=a6.gv()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.n2(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
nY(b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=c0.a,a1=a0[0],a2=a0[1],a3=a0[2],a4=a0[3],a5=a0[4],a6=a0[5],a7=c4.a,a8=c4.b,a9=1-a7*a7-a8*a8,b0=a1/c3,b1=a2/c3,b2=b7.a.gv()
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
i=b>=1?1023:B.c.N(b*1023+0.5)
if(!(i>=0&&i<r))return A.a(b8,i)
a=b8[i]
if(s)a=A.W(a,b9)
if(n)a=A.au(a,j)
if(!(d>=0&&d<a0))return A.a(b3,d)
i=A.u(a,b3[d])
b3.$flags&2&&A.d(b3)
b3[d]=i}}},
dD(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aX){s=a.c
if(s===$){r=a.b!==1||B.b.au(a.a,A.k4())
a.c!==$&&A.T()
a.c=r
s=r}q=s
break A}if(a instanceof A.aa){s=a.r
if(s===$){r=B.b.au(a.a,A.k4())
a.r!==$&&A.T()
a.r=r
s=r}q=s
break A}if(a instanceof A.Y){q=A.dD(a.a)
break A}q=!1
break A}return q},
iw(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.dD(a[b])}else s=!1
if(s){if(!(b<a.length))return A.a(a,b)
A.eR(a[b],d,e,a0,a1,a2,a3,a4)
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
if(!A.dD(j))A.bK(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.l(0)
else{s=a0.a
a3.aN(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dD(j))continue
if(a2.b===0)A.eR(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.aq(i)
A.eR(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.aq(h)
f.aV(a2)
A.d2(f,g,a2,a1?5:2)}}},
eR(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
A:{s=a0 instanceof A.aa
r=s?a0:null
if(s){s=a2.a
q=s[0]
p=s[1]
o=s[2]
n=s[3]
m=s[4]
l=s[5]
s=r.c
if(!s.gaD()){k=a6.d5(a7)
A.eQ(s,a1,q,p,o,n,m,l,k)
a2=new A.bH([k[0],k[1],k[2],k[3],k[4],k[5]])}s=r.a
A.iw(s,0,s.length,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.Y
j=s?a0:null
if(s){A.eR(j.a,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.aX
i=s?a0:null
if(s){h=i.a
s=i.b
if(s===1){A.iw(h,0,h.length,a1,a2,a3,a4,a5,a6,a7+1)
return}g=a7*2
f=a6.aq(g)
e=a6.aq(g+1)
d=a7+1
A.iw(h,0,h.length-1,a1,a2,a3,!1,f,a6,d)
if(f.b===0)c=s===3||s===4
else c=!1
if(c){a5.l(0)
return}b=B.b.gad(h)
if(A.dD(b))A.eR(b,a1,a2,a3,!1,e,a6,d)
else{d=a2.a
q=d[0]
p=d[1]
o=d[2]
n=d[3]
m=d[4]
l=d[5]
a=a6.dy
a.l(0)
A.bK(b,a1,q,p,o,n,m,l,0.0625,a,a6,0,0)
d=a3.a
a6.aN(a,!1,e,d[0],d[1],d[2],d[3])}A.d2(f,e,a5,s)
break A}throw A.f(A.at("Expected a boolean path"))}},
on(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8=a9.e
if(a8){s=a9.d.n(b0)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a7}else r=0
q=a9.b2(b0)
if(q==null)return a7
s=B.c.P(A.eU(q,b5,b7,b9))
p=B.c.P(A.eV(q,b6,b8,c0))
o=B.c.W(A.eS(q,b5,b7,b9))
n=B.c.W(A.eT(q,b6,b8,c0))
m=Math.max(b1,s-2)
l=Math.max(b2,p-2)
k=Math.min(b3,o+2)
j=Math.min(b4,n+2)
if(m>=k||l>=j)return a7
i=a9.go
if(i===$){h=a9.fL()
a9.go!==$&&A.T()
a9.go=h
i=h}if(i!=null){g=c1.dA(i,b0)
if(g.r===0)return a7
a8=c1.dy
a8.l(0)
a8.aH(g,b5,b6,b7,b8,b9,c0)
return new A.b9([m,l,k,j])}if(!a8&&a9.z==null&&a9.a.length===1){f=B.b.gaf(a9.a)
while(f instanceof A.Y)f=f.a
if(f instanceof A.aE&&!f.gI()){e=c1.dy
e.l(0)
A.lg(f,b0,0.0625,e,new A.bH([b5,b6,b7,b8,b9,c0]));++c1.w
return e.r===0?a7:new A.b9([m,l,k,j])}}d=Math.max(Math.sqrt(b5*b5+b6*b6),Math.sqrt(b7*b7+b8*b8))
c=d<=0.000001?0.25:B.c.F(0.25/d,0.005,1.5)
b=c*c
a=c1.db
a.l(0)
a0=a9.a
for(a1=a0.length-1;a1>=0;--a1){if(!(a1<a0.length))return A.a(a0,a1)
A.bK(a0[a1],b0,1,0,0,1,0,0,b,a,c1,0,0)}if(a.r===0)return a7
a2=a9.z
if(a2!=null){a3=c1.dx
a3.l(0)
A.nG(a,a2,b0,a3,c1.p3)
if(a3.r===0)return a7
a4=a3}else a4=a
if(a8){a5=c1.fr
a5.l(0)
A.lc(a4,r*0.5,a9.r,a9.w,a9.x,c,a5,c1.gdB())
if(a5.r===0)return a7
a4=a5}a6=c1.dy
a6.l(0)
a6.aH(a4,b5,b6,b7,b8,b9,c0)
return new A.b9([m,l,k,j])},
jX(a,b,c){var s,r,q=a.b.n(b),p=q.length
if(0>=p)return A.a(q,0)
s=B.a.F(B.c.H(q[0]*255),0,255)
if(1>=p)return A.a(q,1)
r=B.a.F(B.c.H(q[1]*255),0,255)
if(2>=p)return A.a(q,2)
return A.kM(c,s,r,B.a.F(B.c.H(q[2]*255),0,255))},
nV(a,b,c){var s,r,q,p
if(a.c.a!=null){s=c.cm
r=s.h(0,a)
if(r!=null)return r.b
if(s.a>=256)s.A(0,new A.P(s,s.$ti.i("P<1>")).ga5(0)).b.a0()
q=A.fs(1024)
p=c.ay
p.toString
s.q(0,a,new A.ag(p,q,t.dL))
A.lf(a,b,q.gv())
return q}q=c.aQ
if(q==null)q=c.aQ=A.fs(1024)
A.lf(a,b,q.gv())
return q},
lf(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a6.c.n(a7),a4=a6.a,a5=a6.x
for(s=a3.length,r=0;r<a4;++r){q=4*r
p=3*r
o=q+1
if(!(o<s))return A.a(a3,o)
o=A.fR(a3[o])
a5.$flags&2&&A.d(a5)
n=a5.length
if(!(p<n))return A.a(a5,p)
a5[p]=o
o=p+1
m=q+2
if(!(m<s))return A.a(a3,m)
m=A.fR(a3[m])
a5.$flags&2&&A.d(a5)
if(!(o<n))return A.a(a5,o)
a5[o]=m
m=p+2
o=q+3
if(!(o<s))return A.a(a3,o)
o=A.fR(a3[o])
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
a1=A.kM(B.a.F(B.c.H(a6.eP(a3,j)*255),0,255),B.a.F(B.c.H((m+(g-m)*d)*255),0,255),B.a.F(B.c.H((a+(a0-a)*d)*255),0,255),B.a.F(B.c.H((a1+(a2-a1)*d)*255),0,255))
a8.$flags&2&&A.d(a8)
if(!(k<a8.length))return A.a(a8,k)
a8[k]=a1}},
jG(a){return new A.bF(a,A.h([],t.ch))},
kS(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.a.J(b.gcz()-s,2)),q=new Float32Array(a*3)
s=Math.max(2,a+Math.max(0,B.a.J(b.gcz()-s,2)))
new Float64Array(s)
return new A.bn(a,r,b,c,d,f,g,e,q)},
nr(a,b,c,d,e){return new A.bI(a,b,c,d,e,A.a8(t.S,t.W))},
kQ(a,b){var s=a.length
return new A.cq(a,b,new Float64Array(s))},
c7(a,b){var s,r,q,p,o
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
return new A.aC(s,r,q,p>o?p:o)},
jL(a,b,c,d,e,f,g,h,i){return new A.c4(a,b,c,d,e,f,g,h,i)},
jM(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
eK(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
nf(a,b,c,d,e){return new A.ac(a,b,c,d,e)},
kT(a,b,c){return new A.hU(a,b,c)},
kU(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.ab(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
jI(a,b,c){return new A.aa(a,b,c)},
ng(a,b){return new A.aX(a,b)},
iv(a,b,c){if(c>0)return new A.y(a,-b)
if(c<0)return new A.y(-a,b)
return B.aF},
jK(a,b,c,d,e,f,g,h,i,j,k){return new A.bq(a,b,c,d,e,f,g,h,i,k,j)},
iu:function iu(a,b){this.a=a
this.b=b},
i8:function i8(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=null},
cj:function cj(a){this.a=a},
fy:function fy(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var _=this
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
_.cm=a8
_.bx=_.aQ=null
_.e4=a9},
fz:function fz(a,b){this.a=a
this.b=b},
fA:function fA(a){this.a=a},
fB:function fB(a){this.a=a},
fC:function fC(a){this.a=a},
ag:function ag(a,b,c){this.a=a
this.b=b
this.$ti=c},
bX:function bX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ix:function ix(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
bF:function bF(a,b){var _=this
_.a=a
_.r=_.f=_.e=_.d=_.c=_.b=$
_.w=b
_.x=1
_.y=!1
_.z=$},
hf:function hf(a){this.a=a},
h5:function h5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
h6:function h6(a,b,c){this.a=a
this.b=b
this.c=c},
h4:function h4(a){this.a=a},
hb:function hb(a,b,c){this.a=a
this.b=b
this.c=c},
hc:function hc(a,b,c){this.a=a
this.b=b
this.c=c},
hd:function hd(a,b,c){this.a=a
this.b=b
this.c=c},
ha:function ha(a){this.a=a},
h8:function h8(){},
h9:function h9(){},
h7:function h7(a,b){this.a=a
this.b=b},
he:function he(){},
hl:function hl(a,b){this.a=a
this.b=b},
i5:function i5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ez:function ez(a){this.b=a},
hA:function hA(a){this.a=a},
hB:function hB(a,b){this.a=a
this.b=b},
hu:function hu(a,b){this.a=a
this.b=b},
hv:function hv(a,b){this.a=a
this.b=b},
hw:function hw(a,b){this.a=a
this.b=b},
hx:function hx(a,b){this.a=a
this.b=b},
hy:function hy(a,b){this.a=a
this.b=b},
hz:function hz(a,b){this.a=a
this.b=b},
ho:function ho(a,b){this.a=a
this.b=b},
hq:function hq(a,b){this.a=a
this.b=b},
hp:function hp(a,b){this.a=a
this.b=b},
hC:function hC(a,b){this.a=a
this.b=b},
hn:function hn(a,b){this.a=a
this.b=b},
hs:function hs(a,b){this.a=a
this.b=b},
hr:function hr(a,b){this.a=a
this.b=b},
ht:function ht(a,b){this.a=a
this.b=b},
bn:function bn(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
Y:function Y(a){this.a=a},
br:function br(a,b){this.a=a
this.b=b},
bI:function bI(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$
_.as=f},
ic:function ic(){},
cq:function cq(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
hg:function hg(){},
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
hU:function hU(a,b,c){this.a=a
this.b=b
this.c=c},
ey:function ey(a,b){this.a=a
this.b=b},
hm:function hm(){},
ab:function ab(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
hZ:function hZ(){},
hX:function hX(){},
hY:function hY(){},
i_:function i_(){},
aa:function aa(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.r=_.f=_.e=_.d=$
_.Q=_.z=null
_.at=_.as=0/0
_.ay=_.ax=$},
hQ:function hQ(){},
hS:function hS(){},
hT:function hT(){},
hR:function hR(){},
aX:function aX(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
i2:function i2(){},
i1:function i1(){},
eB:function eB(){},
aE:function aE(a,b,c){var _=this
_.e=a
_.f=b
_.r=c
_.c=null
_.d=0/0},
aZ:function aZ(a,b,c,d,e){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.c=null
_.d=0/0},
b7:function b7(a,b,c,d,e,f,g,h,i){var _=this
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
bq:function bq(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
i9:function i9(){},
d_(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.am(s,r,q,p,new Uint8Array(a))},
by:function by(a){this.a=a},
am:function am(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
d2(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
if(a9===4){A.fD(a6,a7,a8)
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
if(j!=null){a3=o.a(A.w($.l.memory).buffer)
a4=l.a
s=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
s=l}l=a7.a
j=l.b
if(j!=null){a3=o.a(A.w($.l.memory).buffer)
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
fD(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
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
if(j!=null){d=s.a(A.w($.l.memory).buffer)
a4=l.a
p=new Int32Array(d,j,a4)}else{l=l.c
l.toString
p=l}l=a6.a
j=l.b
if(j!=null){d=s.a(A.w($.l.memory).buffer)
a4=l.a
o=new Int32Array(d,j,a4)}else{l=l.c
l.toString
o=l}}}if(a<=a0)n+=2
if(a0<=a)m+=2}}},
ks(a){var s=new Int32Array(8192),r=new Int32Array(8192),q=new Int32Array(8192),p=new Int32Array(8192),o=new Int32Array(0),n=Math.max(64,a),m=new Int32Array(n)
B.e.ac(m,0,n,-1)
return new A.f6(n,m,s,r,q,p,o)},
cL(a){if(a>=-1048576&&a<=1048576)return B.c.H(a*256)
if(!isFinite(a))return 0
return a>0?268435456:-268435456},
jf(a,b){var s=B.a.b7(B.a.L(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
aJ:function aJ(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
f6:function f6(a,b,c,d,e,f,g){var _=this
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
cl(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.j.C(a,0,b,$.k9())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.j.C(a,s,q,$.k9())}},
kM(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.a.J(b*a+127,255)<<16|B.a.J(c*a+127,255)<<8|B.a.J(d*a+127,255))>>>0},
au(a,b){if(b>=256)return a
if(b<=0||a===0)return 0
return((a&16711935)*b+8388736>>>8&16711935|(a>>>8&16711935)*b+8388736&4278255360)>>>0},
u(a,b){var s,r,q,p
if(a===0)return b
s=a>>>24
if(s===255||b===0)return a
r=255-s
q=(b&16711935)*r+8388736
p=(b>>>8&16711935)*r+8388736
return a+((B.a.L(q+(B.a.L(q,8)&16711935),8)&16711935|p+(B.a.L(p,8)&16711935)&4278255360)>>>0)},
W(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.a.L(s+(B.a.L(s,8)&16711935),8)&16711935|r+(B.a.L(r,8)&16711935)&4278255360)>>>0},
kL(a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(a7===0||a6.b===0)return
if(a8!=null&&A.p6(a8,a3,a4,a5,a6.a,a6.b,a7))return
s=a6.b*2
r=a6.a.gv()
for(q=a2.length,p=a7>>>24===255,o=r.length,n=0;n<s;n+=2){if(!(n<o))return A.a(r,n)
m=r[n]
l=n+1
if(!(l<o))return A.a(r,l)
k=r[l]
j=k>>>8
i=(k&255)+1
h=i===256?a7:A.au(a7,i)
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
l=a1===0?h:A.jC(h,a1,a0)
a2.$flags&2&&A.d(a2)
a2[f]=l}else for(c=f;c<e;++c){if(!(c>=0&&c<q))return A.a(a2,c)
a1=a2[c]
l=a1===0?h:A.jC(h,a1,a0)
a2.$flags&2&&A.d(a2)
a2[c]=l}}}},
kJ(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
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
m=j===0?f:A.jC(f,j,k)
n&2&&A.d(a)
a[o]=m}}},
jC(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.a.L(s+(B.a.L(s,8)&16711935),8)&16711935|r+(B.a.L(r,8)&16711935)&4278255360)>>>0)},
n2(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8=null,c9=1023
if(d6===0||d4.b===0)return
s=e5-e3
r=e6-e4
q=s*s+r*r
if(q<=1e-12){if(0>=d5.length)return A.a(d5,0)
p=d5[0]
A.kL(d0,d1,d2,d3,d4,d6<255?A.W(p,d6):p,c8)
return}o=1/q
n=(d7*s+d8*r)*o
m=d4.b*2
l=d4.a.gv()
k=d6>=255
j=d5.length
if(k){if(0>=j)return A.a(d5,0)
i=d5[0]}else{if(0>=j)return A.a(d5,0)
i=A.W(d5[0],d6)}if(k){if(1023>=j)return A.a(d5,1023)
h=d5[1023]}else{if(1023>=j)return A.a(d5,1023)
h=A.W(d5[1023],d6)}for(g=d0.length,f=l.length,e=n<=0,d=n>=0,c=d0.$flags|0,b=0;b<m;b+=2){if(!(b<f))return A.a(l,b)
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
if(a8<=0&&e){A.kJ(d0,c8,c8,a9,a4,a5===256?i:A.au(i,a5))
continue}if(a8>=1&&d){A.kJ(d0,c8,c8,a9,a4,a5===256?h:A.au(h,a5))
continue}b0=a9+a4
a0=a5===256
if(a0&&k){b1=b0-3
for(b2=a9;b2<b1;a8=a0){b3=a8+n
b4=b3+n
b5=b4+n
a0=b5+n
if(a8>0&&a8<1&&b5>0&&b5<1){b6=B.c.N(a8*1023+0.5)
b7=B.c.N(b3*1023+0.5)
b8=B.c.N(b4*1023+0.5)
b9=B.c.N(b5*1023+0.5)}else{if(a8<=0)b6=0
else b6=a8>=1?c9:B.c.N(a8*1023+0.5)
if(b3<=0)b7=0
else b7=b3>=1?c9:B.c.N(b3*1023+0.5)
if(b4<=0)b8=0
else b8=b4>=1?c9:B.c.N(b4*1023+0.5)
if(b5<=0)b9=0
else b9=b5>=1?c9:B.c.N(b5*1023+0.5)}if(!(b6>=0&&b6<j))return A.a(d5,b6)
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
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=d5[c7]
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}}else if(k)for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.au(d5[c7],a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}else if(a0)for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.W(d5[c7],d6)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}else for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
p=A.au(A.W(d5[c7],d6),a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.u(p,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}}},
n3(e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9=1023
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
continue}a5=$.dJ()
a5.$flags&2&&A.d(a5)
a5[0]=c0
c4=a5[0]
a5[0]=c1
c5=a5[0]
a5[0]=c2
c6=a5[0]
a5[0]=c3
c7=new A.aT(c4,c5,c6,a5[0]).cI()
c8=c7.a
c6=c7.b
c9=c7.c
d0=c7.d
a5=c8>=1?d9:B.c.N(c8*1023+0.5)
if(!(a5>=0&&a5<e))return A.a(e5,a5)
d1=e5[a5]
a5=c6>=1?d9:B.c.N(c6*1023+0.5)
if(!(a5>=0&&a5<e))return A.a(e5,a5)
d2=e5[a5]
a5=c9>=1?d9:B.c.N(c9*1023+0.5)
if(!(a5>=0&&a5<e))return A.a(e5,a5)
d3=e5[a5]
a5=d0>=1?d9:B.c.N(d0*1023+0.5)
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
d6=d5>=1?d9:B.c.N(Math.sqrt(d5)*1023+0.5)
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
d1=d2}else{c4=$.dJ()
c4.$flags&2&&A.d(c4)
c4[0]=c0
c5=c4[0]
c4[0]=c1
c6=c4[0]
c4[0]=c2
d7=c4[0]
c4[0]=c3
c7=new A.aT(c5,c6,d7,c4[0]).cI()
c8=c7.a
c6=c7.b
c9=c7.c
d0=c7.d
c4=c8>=1?d9:B.c.N(c8*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d1=e5[c4]
c4=c6>=1?d9:B.c.N(c6*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d2=e5[c4]
c4=c9>=1?d9:B.c.N(c9*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d3=e5[c4]
c4=d0>=1?d9:B.c.N(d0*1023+0.5)
if(!(c4>=0&&c4<e))return A.a(e5,c4)
d4=e5[c4]}if(f){d1=A.W(d1,e6)
d2=A.W(d2,e6)
d3=A.W(d3,e6)
d4=A.W(d4,e6)}if(a5){d1=A.au(d1,a9)
d2=A.au(d2,a9)
d3=A.au(d3,a9)
d4=A.au(d4,a9)}if(!(b9>=0&&b9<b))return A.a(e0,b9)
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
d6=d5>=1?d9:B.c.N(Math.sqrt(d5)*1023+0.5)
if(!(d6>=0&&d6<e))return A.a(e5,d6)
d8=e5[d6]
if(f)d8=A.W(d8,e6)
if(a5)d8=A.au(d8,a9)
if(!(b9>=0&&b9<b))return A.a(e0,b9)
c4=A.u(d8,e0[b9])
a2&2&&A.d(e0)
e0[b9]=c4
b4+=b5
b5+=i;++b9}}}},
a3(a){var s=A.j(a)+128
return B.a.L(s+B.a.L(s,8),8)},
jA(a,b,c,d,e){var s
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
break}return A.a3(a*(255-d)+b*(255-c)+s)},
ej(a,b,c){var s,r,q,p,o,n,m,l,k
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
k=s+r-A.a3(s*r)
if(A.kN(c))return A.n_(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.a3(q*p)<<16|o+n-A.a3(o*n)<<8|m+l-A.a3(m*l))>>>0
return(k<<24|A.jA(q,p,s,r,c)<<16|A.jA(o,n,s,r,c)<<8|A.jA(m,l,s,r,c))>>>0},
kN(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
n_(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.aF(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.aF(o,n,m)
switch(j){case 12:s=A.fM(A.kK(p,A.jB(l)),A.ei(l))
break
case 13:s=A.fM(A.kK(l,A.jB(p)),A.ei(l))
break
case 14:s=A.fM(p,A.ei(l))
break
case 15:s=A.fM(l,A.ei(p))
break
default:s=new A.aF(A.jz(o,s,j),A.jz(n,r,j),A.jz(m,q,j))
break}r=new A.fK(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.a9()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.a9()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.ah(s)
return(i<<24|q<<16|o<<8|s)>>>0},
jz(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
ei(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
jB(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
kK(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.jB(a)
if(o===0)return B.aM
return new A.aF((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
fM(a,b){var s=b-A.ei(a),r=a.a,q=a.b,p=a.c,o=new A.fN(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.aF(o.$1(r),o.$1(q),o.$1(p))},
kH(a,b){var s,r,q,p,o,n,m,l,k,j
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
return(s+r-A.a3(s*r)<<24|A.a3(o*p+n*q+o*n)<<16|A.a3(m*p+l*q+m*l)<<8|A.a3(k*p+j*q+k*j))>>>0},
kI(a,b){var s,r,q,p,o,n,m,l
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
return(s+r-A.a3(s*r)<<24|q+p-A.a3(q*p)<<16|o+n-A.a3(o*n)<<8|m+l-A.a3(m*l))>>>0},
n0(a,b,c,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
if(a2===0)return
if(a4!=null){s=A.kN(a3)
s=!s&&A.p0(a4,b,c,a0,a1.a,a1.b,a2,a3)}else s=!1
if(s)return
r=a1.a.gv()
q=a1.b*2
if(a3===1){for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.au(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.kH(h,d)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}return}if(a3===2){for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.au(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.kI(h,d)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}return}for(s=a.length,p=r.length,o=0,n=0,m=0,l=0;l<q;l+=2){if(!(l<p))return A.a(r,l)
k=r[l]
j=l+1
if(!(j<p))return A.a(r,j)
i=r[j]
h=A.au(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<s))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.ej(h,d,a3)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}},
n1(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
if(a3===1){for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.d(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.kH(k,j)
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
continue}if(k!==q||j!==p){o=A.kI(k,j)
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
continue}if(k!==q||j!==p){o=A.ej(k,j,a3)
p=j
q=k}a.$flags&2&&A.d(a)
a[l]=o}},
fL:function fL(){},
fK:function fK(a,b,c){this.a=a
this.b=b
this.c=c},
fN:function fN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ne(a,b,c){var s,r,q,p,o=null
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
ci:function ci(a,b){this.a=a
this.b=b},
i0:function i0(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=0
_.d=c
_.e=d},
fU:function fU(a,b,c){this.a=a
this.b=b
this.c=c},
dR:function dR(a){this.a=a},
mC(a,b,c,d,e,f,g,h){var s=h&&b>=32?J.j7(B.h.ga7(e),e.byteOffset,e.length/4|0):null
return new A.fg(a,b,c,d,e,f,g,g==null||b<2?null:A.jr(a.length,null,!1,t.cn),s)},
n7(a){var s,r,q,p=a.length
if(p===1){if(0>=p)return A.a(a,0)
s=a[0]
if(s===0)return $.j5()
if(s===100)return $.j3()
if(s===1)return $.lQ()}else if(p===2){if(0>=p)return A.a(a,0)
r=a[0]
if(1>=p)return A.a(a,1)
q=a[1]
if(r===0&&q===0)return $.j6()
if(r===100&&q===100)return $.j4()}return A.jD(a)},
jD(a){return new A.F(new Float32Array(A.ad(a)),null,!1,$.bv(),!1)},
em(a){return new A.F(a,null,!1,$.bv(),!1)},
n6(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
n5(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
fR(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.P(s)
if(r>=4096)return 1
q=$.lO()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
fg:function fg(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
fh:function fh(){},
F:function F(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
du:function du(a,b){this.a=a
this.b=b},
k_(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.a_)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.o(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.b1(o)){n=o
break A}n=A.r(A.aI("Unsupported raster worker field",null))}l.push(n)}return new A.y(l,m)},
oN(e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1=null
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
if(n){A.H(q)
o=b5[7]
b8=t.p
if(b8.b(o)){b8.a(o)
b9=b5[11]
l=A.b1(b9)
if(l){A.aO(b9)
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
p=c6}A.H(b8)
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
a3=b5}}}if(b4){b4=[1,a3,A.H(d8?d7:e2.b)]
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
b4=typeof d9=="string"}}}if(b4){b4=[3,a3,A.H(e0?d9:e2.b)]
break A}a4=e1
b4=!1
if(t.dH.b(e2))if(2===(s?b6:e2.a)){if(p)b5=q
else{q=e2.b
b5=q
p=!0}if(typeof b5=="string"){a4=A.H(p?q:e2.b)
if(j)b4=k
else{k=e2.c
b4=k
j=!0}b4=A.o(b4)}}if(b4){b4=[2,a4,A.j(j?k:e2.c)]
break A}b4=A.r(A.aI("Unsupported raster worker reply",e1))}return A.k_(b4)},
fV:function fV(a){this.a=a},
p4(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.a.F(B.c.P(Math.min(a*c,s)),0,s)},
p7(b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d={},c=A.d_(32,512),b=A.d_(32,512),a=A.d_(32,512),a0=A.d_(32,512),a1=A.d_(32,512),a2=t.fM,a3=A.h([],a2),a4=A.h([],a2),a5=A.h([],a2),a6=A.h([],a2),a7=t.dh,a8=A.h([],a7),a9=A.h([],t.cU),b0=A.h([],a7),b1=A.h([],t.by),b2=t.n,b3=A.h([],b2)
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
m=$.l!=null
l=new A.fy(m,new A.ak(t.el),c,b,a,a0,a1,a3,a4,a5,a6,a8,a9,b0,b1,b3,b2,new A.by(s),!1,q,p,a2,o,r,n,new A.ak(t.gS),new A.ak(t.fk),new A.ak(t.gj),a7)
c=t.N
k=A.a8(c,c)
b=t.x
a=t.S
a0=new Uint8Array(32)
a1=new Uint8Array(16)
a2=new Uint8Array(65536)
j=new A.eZ(null,A.a8(b,t.g2),A.a8(c,t.cJ),A.a8(c,a),A.a8(c,a),A.fk(c),A.a8(b,t.gz),A.fk(b),A.a8(c,t.eY),a0,a1,a2)
b=new Int32Array(16384)
i=new A.fl(b,new Uint8Array(131072))
h=new A.fP()
g=A.a8(c,t.fW)
f=new A.fG()
$.k7()
c=$.jx.$0()
f.a=c
f.b=null
e=A.fs(65536)
d.a=0
c=new A.iV(f)
b=new A.iU(d,e,h)
a=new A.iW(e)
a0=new A.iX(d,e,h)
a1=new A.iZ(j,g,l)
a2=new A.j0(k,b4)
a3=b4.a
new A.co(a3,A.n(a3).i("co<1>")).hy(new A.iT(d,j,g,l,e,b4,new A.iY(g,l,k),k,b,a,h,a1,a0,a2,f,c,i,new A.j_(b4,j,h,b,e,a0,g,a2,f,l,c,i,a,a1)))},
iV:function iV(a){this.a=a},
iU:function iU(a,b,c){this.a=a
this.b=b
this.c=c},
iW:function iW(a){this.a=a},
iX:function iX(a,b,c){this.a=a
this.b=b
this.c=c},
iZ:function iZ(a,b,c){this.a=a
this.b=b
this.c=c},
iY:function iY(a,b,c){this.a=a
this.b=b
this.c=c},
j0:function j0(a,b){this.a=a
this.b=b},
j_:function j_(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var _=this
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
iT:function iT(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){var _=this
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
oY(){var s,r,q=null,p={}
p.a=!1
s=A.w(v.G.self)
p=new A.iM(p,new A.hi(new A.cn(q,q,q,q,t.co)))
if(typeof p=="function")A.r(A.aI("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.nO,p)
r[$.j2()]=p
s.onmessage=r},
iL:function iL(a,b){this.a=a
this.b=b},
iM:function iM(a,b){this.a=a
this.b=b},
hi:function hi(a){this.a=a},
je(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.b4(b,c,B.a.a_(a.byteLength,s))
return J.ke(B.d.ga7(a),a.byteOffset+b*s,(c-b)*s)},
b6(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.b4(b,c,B.a.a_(a.byteLength,s))
return J.cb(J.kg(a),a.byteOffset+b*s,(c-b)*s)},
jF(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.b4(b,c,B.a.a_(a.byteLength,s))-b)*s
if(B.a.T(r,4)!==0)throw A.f(A.aI("The number of bytes to view must be a multiple of 4",null))
return J.mb(J.kg(a),a.byteOffset+b*s,B.a.J(r,4))},
lG(a){return v.mangledGlobalNames[a]},
oQ(a){var s=A.nF(a,1)
return s},
nF(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b&65535,e=b>>>16,d=a.length
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
lz(a,b){var s,r,q,p=a.length
if(p>=32)return A.nT(a,b)
b^=4294967295
for(s=p,r=0;s>=8;){q=r+1
if(!(r<p))return A.a(a,r)
b=B.l[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.l[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.l[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.l[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.l[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.l[(b^a[q])&255]^b>>>8
q=r+1
if(!(r<p))return A.a(a,r)
b=B.l[(b^a[r])&255]^b>>>8
r=q+1
if(!(q<p))return A.a(a,q)
b=B.l[(b^a[q])&255]^b>>>8
s-=8}if(s>0)do{q=r+1
if(!(r<p))return A.a(a,r)
b=B.l[(b^a[r])&255]^b>>>8
if(--s,s>0){r=q
continue}else break}while(!0)
return(b^4294967295)>>>0},
nN(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
nT(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.lt
if(c7==null)c7=$.lt=A.nN(B.l)
s=c8.length
r=J.ke(B.d.ga7(c8),c8.byteOffset,s)
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
oL(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.K.h5(a,16777216,!0,!0)
if(s>16777216)throw A.f(B.a1)
return a}},B={}
var w=[A,J,B]
var $={}
A.jo.prototype={}
J.D.prototype={
G(a,b){return a===b},
gX(a){return A.d0(a)},
u(a){return"Instance of '"+A.ea(a)+"'"},
gY(a){return A.c8(A.jQ(this))}}
J.cM.prototype={
u(a){return String(a)},
bH(a,b){return b||a},
gX(a){return a?519018:218159},
gY(a){return A.c8(t.y)},
$iC:1,
$it:1}
J.cO.prototype={
G(a,b){return null==b},
u(a){return"null"},
gX(a){return 0},
$iC:1,
$ia2:1}
J.V.prototype={$iK:1}
J.bz.prototype={
gX(a){return 0},
u(a){return String(a)}}
J.e9.prototype={}
J.d9.prototype={}
J.az.prototype={
u(a){var s=a[$.lJ()]
if(s==null)s=a[$.j2()]
if(s==null)return this.ez(a)
return"JavaScript function for "+J.bM(s)},
$ibO:1}
J.bP.prototype={
gX(a){return 0},
u(a){return String(a)}}
J.bQ.prototype={
gX(a){return 0},
u(a){return String(a)}}
J.z.prototype={
m(a,b){A.a4(a).c.a(b)
a.$flags&1&&A.d(a,29)
a.push(b)},
ak(a,b){var s
A.a4(a).i("k<1>").a(b)
a.$flags&1&&A.d(a,"addAll",2)
if(Array.isArray(b)){this.eO(a,b)
return}for(s=J.cD(b);s.t();)a.push(s.gB())},
eO(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.f(A.ax(a))
for(r=0;r<s;++r)a.push(b[r])},
l(a){a.$flags&1&&A.d(a,"clear","clear")
a.length=0},
ap(a,b){return A.fJ(a,b,null,A.a4(a).c)},
am(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
ex(a,b,c){var s=a.length
if(b>s)throw A.f(A.as(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.f(A.as(c,b,s,"end",null))
if(b===c)return A.h([],A.a4(a))
return A.h(a.slice(b,c),A.a4(a))},
ga5(a){if(a.length>0)return a[0]
throw A.f(A.ae())},
gad(a){var s=a.length
if(s>0)return a[s-1]
throw A.f(A.ae())},
gaf(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.f(A.ae())
throw A.f(A.jk())},
b6(a,b,c){a.$flags&1&&A.d(a,18)
A.b4(b,c,a.length)
a.splice(b,c-b)},
ac(a,b,c,d){var s
a.$flags&2&&A.d(a,"fillRange")
A.b4(b,c,a.length)
A.a4(a).c.a(d)
for(s=b;s<c;++s)a[s]=d},
au(a,b){var s,r
A.a4(a).i("t(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.f(A.ax(a))}return!1},
ab(a,b){var s,r
A.a4(a).i("t(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.f(A.ax(a))}return!0},
gR(a){return a.length===0},
gcq(a){return a.length!==0},
u(a){return A.jl(a,"[","]")},
gD(a){return new J.bN(a,a.length,A.a4(a).i("bN<1>"))},
gX(a){return A.d0(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.d(a,"set length","change the length of")
if(b<0)throw A.f(A.as(b,0,null,"newLength",null))
if(b>a.length)A.a4(a).c.a(null)
a.length=b},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eW(a,b))
return a[b]},
q(a,b,c){A.a4(a).c.a(c)
a.$flags&2&&A.d(a)
if(!(b>=0&&b<a.length))throw A.f(A.eW(a,b))
a[b]=c},
$ip:1,
$ik:1,
$iv:1}
J.dW.prototype={
hS(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.ea(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.fd.prototype={}
J.bN.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.a_(q)
throw A.f(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$ia6:1}
J.cP.prototype={
cg(a,b){var s
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gcp(b)
if(this.gcp(a)===s)return 0
if(this.gcp(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gcp(a){return a===0?1/a<0:a<0},
N(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.f(A.aK(""+a+".toInt()"))},
W(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.f(A.aK(""+a+".ceil()"))},
P(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.f(A.aK(""+a+".floor()"))},
H(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.f(A.aK(""+a+".round()"))},
ei(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
F(a,b,c){if(this.cg(b,c)>0)throw A.f(A.iB(b))
if(this.cg(a,b)<0)return b
if(this.cg(a,c)>0)return c
return a},
u(a){if(a===0&&1/a<0)return"-0.0"
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
return this.dF(a,b)},
J(a,b){return(a|0)===a?a/b|0:this.dF(a,b)},
dF(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.f(A.aK("Result of truncating division is "+A.x(s)+": "+A.x(a)+" ~/ "+b))},
a9(a,b){if(b<0)throw A.f(A.iB(b))
return b>31?0:a<<b>>>0},
dv(a,b){return b>31?0:a<<b>>>0},
L(a,b){var s
if(a>0)s=this.c3(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
c3(a,b){return b>31?0:a>>>b},
ev(a,b){if(b<0)throw A.f(A.iB(b))
return this.dw(a,b)},
dw(a,b){if(b>31)return 0
return a>>>b},
gY(a){return A.c8(t.q)},
$ii:1,
$ica:1}
J.cN.prototype={
b7(a,b){var s=this.a9(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
gY(a){return A.c8(t.S)},
$iC:1,
$ib:1}
J.dX.prototype={
gY(a){return A.c8(t.i)},
$iC:1}
J.cf.prototype={
ew(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bK(a,b,c){return a.substring(b,A.b4(b,c,a.length))},
ey(a,b){return this.bK(a,b,null)},
hP(a){var s,r,q,p=a.trim(),o=p.length
if(o===0)return p
if(0>=o)return A.a(p,0)
if(p.charCodeAt(0)===133){s=J.mA(p,1)
if(s===o)return""}else s=0
r=o-1
if(!(r>=0))return A.a(p,r)
q=p.charCodeAt(r)===133?J.mB(p,r):o
if(s===0&&q===o)return p
return p.substring(s,q)},
ah(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.f(B.R)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
u(a){return a},
gX(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gY(a){return A.c8(t.N)},
gk(a){return a.length},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eW(a,b))
return a[b]},
$iC:1,
$ifv:1,
$iq:1}
A.bd.prototype={
u(a){return"LateInitializationError: "+this.a}}
A.iO.prototype={
$0(){var s=new A.M($.G,t.U)
s.bN(null)
return s},
$S:27}
A.fE.prototype={}
A.p.prototype={}
A.a9.prototype={
gD(a){var s=this
return new A.bT(s,s.gk(s),A.n(s).i("bT<a9.E>"))},
gR(a){return this.gk(this)===0},
ap(a,b){return A.fJ(this,b,null,A.n(this).i("a9.E"))}}
A.d7.prototype={
gf2(){var s=J.ap(this.a),r=this.c
if(r==null||r>s)return s
return r},
gfQ(){var s=J.ap(this.a),r=this.b
if(r>s)return s
return r},
gk(a){var s,r=J.ap(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
am(a,b){var s=this,r=s.gfQ()+b
if(b<0||r>=s.gf2())throw A.f(A.jh(b,s.gk(0),s,"index"))
return J.kf(s.a,r)},
ap(a,b){var s,r,q=this
A.aU(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.cI(q.$ti.i("cI<1>"))
return A.fJ(q.a,s,r,q.$ti.c)},
cv(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.R(n),l=m.gk(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=p.$ti.c
return b?J.jn(0,n):J.jm(0,n)}r=A.jr(s,m.am(n,o),b,p.$ti.c)
for(q=1;q<s;++q){B.b.q(r,q,m.am(n,o+q))
if(m.gk(n)<l)throw A.f(A.ax(p))}return r}}
A.bT.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s,r=this,q=r.a,p=J.R(q),o=p.gk(q)
if(r.b!==o)throw A.f(A.ax(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.am(q,s);++r.c
return!0},
$ia6:1}
A.a1.prototype={
gk(a){return J.ap(this.a)},
am(a,b){return this.b.$1(J.kf(this.a,b))}}
A.bW.prototype={
gD(a){return new A.db(J.cD(this.a),this.b,this.$ti.i("db<1>"))}}
A.db.prototype={
t(){var s,r
for(s=this.a,r=this.b;s.t();)if(r.$1(s.gB()))return!0
return!1},
gB(){return this.a.gB()},
$ia6:1}
A.bh.prototype={
ap(a,b){A.eY(b,"count",t.S)
A.aU(b,"count")
return new A.bh(this.a,this.b+b,A.n(this).i("bh<1>"))},
gD(a){var s=this.a
return new A.d4(s.gD(s),this.b,A.n(this).i("d4<1>"))}}
A.ce.prototype={
gk(a){var s=this.a,r=s.gk(s)-this.b
if(r>=0)return r
return 0},
ap(a,b){A.eY(b,"count",t.S)
A.aU(b,"count")
return new A.ce(this.a,this.b+b,this.$ti)},
$ip:1}
A.d4.prototype={
t(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.t()
this.b=0
return s.t()},
gB(){return this.a.gB()},
$ia6:1}
A.cI.prototype={
gD(a){return B.J},
gR(a){return!0},
gk(a){return 0},
ap(a,b){A.aU(b,"count")
return this},
cv(a,b){var s=this.$ti.c
return b?J.jn(0,s):J.jm(0,s)}}
A.cJ.prototype={
t(){return!1},
gB(){throw A.f(A.ae())},
$ia6:1}
A.I.prototype={
dM(a,b){return A.r(A.aK("Cannot "+b+" a fixed-length list"))},
sk(a,b){this.dM(a,"change the length of")},
m(a,b){A.aP(a).i("I.E").a(b)
return this.dM(a,"add to")}}
A.bE.prototype={
q(a,b,c){A.n(this).i("bE.E").a(c)
throw A.f(A.aK("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.f(A.aK("Cannot change the length of an unmodifiable list"))},
m(a,b){A.n(this).i("bE.E").a(b)
throw A.f(A.aK("Cannot add to an unmodifiable list"))},
K(a,b,c,d,e){A.n(this).i("k<bE.E>").a(d)
throw A.f(A.aK("Cannot modify an unmodifiable list"))},
C(a,b,c,d){return this.K(0,b,c,d,0)}}
A.dk.prototype={$r:"+(1)",$s:1}
A.cs.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:16}
A.dl.prototype={$r:"+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(1,2,3,4,5,6,7,8,9,10)",$s:17}
A.dm.prototype={$r:"+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(1,2,3,4,5,6,7,8,9,10,11,12)",$s:19}
A.ct.prototype={$r:"+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13)",$s:20}
A.dn.prototype={$r:"+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)",$s:21}
A.y.prototype={$r:"+(1,2)",$s:2}
A.dp.prototype={$r:"+calls,copiedBytes(1,2)",$s:3}
A.aF.prototype={$r:"+(1,2,3)",$s:4}
A.dq.prototype={$r:"+contentKey,requestId(1,2,3)",$s:5}
A.cu.prototype={$r:"+entryKey,workerRamBytes(1,2,3)",$s:6}
A.c3.prototype={$r:"+message,requestId(1,2,3)",$s:7}
A.cv.prototype={$r:"+requestId,workerRamBytes(1,2,3)",$s:8}
A.b9.prototype={$r:"+(1,2,3,4)",$s:11}
A.dr.prototype={$r:"+bytes,contentKey,useSimd(1,2,3,4)",$s:12}
A.cw.prototype={$r:"+compressedBytes,crc31,entryDiskBytes,fpHi,fpLo(1,2,3,4,5)",$s:14}
A.ds.prototype={$r:"+deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes(1,2,3,4,5)",$s:13}
A.bH.prototype={$r:"+(1,2,3,4,5,6)",$s:15}
A.de.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$ia6:1}
A.cH.prototype={
m(a,b){A.n(this).c.a(b)
A.mr()}}
A.S.prototype={
gk(a){return this.b},
gD(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.de(s,s.length,r.$ti.i("de<1>"))},
al(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.fw.prototype={
$0(){return B.c.P(1000*this.a.now())},
$S:3}
A.d3.prototype={}
A.fS.prototype={
an(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.cZ.prototype={
u(a){return"Null check operator used on a null value"}}
A.dZ.prototype={
u(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.eo.prototype={
u(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.fu.prototype={
u(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cK.prototype={}
A.dv.prototype={
u(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iaD:1}
A.bw.prototype={
u(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.lH(r==null?"unknown":r)+"'"},
$ibO:1,
ghV(){return this},
$C:"$1",
$R:1,
$D:null}
A.dM.prototype={$C:"$0",$R:0}
A.dN.prototype={$C:"$2",$R:2}
A.ek.prototype={}
A.ef.prototype={
u(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.lH(s)+"'"}}
A.cd.prototype={
G(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.cd))return!1
return this.$_target===b.$_target&&this.a===b.a},
gX(a){return(A.iP(this.a)^A.d0(this.$_target))>>>0},
u(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.ea(this.a)+"'")}}
A.ed.prototype={
u(a){return"RuntimeError: "+this.a}}
A.eM.prototype={
u(a){return"Assertion failed: Reached dead code"}}
A.bc.prototype={
gk(a){return this.a},
gR(a){return this.a===0},
gav(){return new A.P(this,A.n(this).i("P<1>"))},
aI(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.ht(a)},
ht(a){var s=this.d
if(s==null)return!1
return this.b3(this.d3(s,a),a)>=0},
ak(a,b){A.n(this).i("al<1,2>").a(b).aK(0,new A.fe(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hu(b)},
hu(a){var s,r,q=this.d
if(q==null)return null
s=this.d3(q,a)
r=this.b3(s,a)
if(r<0)return null
return s[r].b},
q(a,b,c){var s,r,q,p,o,n,m=this,l=A.n(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cL(s==null?m.b=m.bV():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cL(r==null?m.c=m.bV():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.bV()
p=m.by(b)
o=q[p]
if(o==null)q[p]=[m.bM(b,c)]
else{n=m.b3(o,b)
if(n>=0)o[n].b=c
else o.push(m.bM(b,c))}}},
ef(a,b){var s,r,q=this,p=A.n(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aI(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.q(0,a,r)
return r},
A(a,b){var s=this
if(typeof b=="string")return s.cM(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cM(s.c,b)
else return s.hv(b)},
hv(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.by(a)
r=n[s]
q=o.b3(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.cN(p)
if(r.length===0)delete n[s]
return p.b},
l(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bL()}},
aK(a,b){var s,r,q=this
A.n(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.f(A.ax(q))
s=s.c}},
cL(a,b,c){var s,r=A.n(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bM(b,c)
else s.b=c},
cM(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.cN(s)
delete a[b]
return s.b},
bL(){this.r=this.r+1&1073741823},
bM(a,b){var s=this,r=A.n(s),q=new A.fj(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bL()
return q},
cN(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bL()},
by(a){return J.av(a)&1073741823},
d3(a,b){return a[this.by(b)]},
b3(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1},
u(a){return A.kx(this)},
bV(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ijq:1}
A.fe.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.q(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.n(this.a).i("~(1,2)")}}
A.fj.prototype={}
A.P.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gD(a){var s=this.a
return new A.cR(s,s.r,s.e,this.$ti.i("cR<1>"))}}
A.cR.prototype={
gB(){return this.d},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.ax(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$ia6:1}
A.bS.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gD(a){var s=this.a
return new A.aR(s,s.r,s.e,this.$ti.i("aR<1>"))}}
A.aR.prototype={
gB(){return this.d},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.ax(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$ia6:1}
A.bR.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gD(a){var s=this.a
return new A.cQ(s,s.r,s.e,this.$ti.i("cQ<1,2>"))}}
A.cQ.prototype={
gB(){var s=this.d
s.toString
return s},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.ax(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.bA(s.a,s.b,r.$ti.i("bA<1,2>"))
r.c=s.c
return!0}},
$ia6:1}
A.ak.prototype={
by(a){return A.iP(a)&1073741823},
b3(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.iG.prototype={
$1(a){return this.a(a)},
$S:25}
A.iH.prototype={
$2(a,b){return this.a(a,b)},
$S:16}
A.iI.prototype={
$1(a){return this.a(A.H(a))},
$S:21}
A.Q.prototype={
u(a){return this.dI(!1)},
dI(a){var s,r,q,p,o,n=this.f8(),m=this.aW(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.kB(o):l+A.x(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
f8(){var s,r=this.$s
while($.i4.length<=r)B.b.m($.i4,null)
s=$.i4[r]
if(s==null){s=this.eX()
B.b.q($.i4,r,s)}return s},
eX(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.h(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.b.q(k,q,r[s])}}k=A.mG(k,!1,t.K)
k.$flags=3
return k}}
A.c2.prototype={
aW(){return[this.a,this.b]},
G(a,b){if(b==null)return!1
return b instanceof A.c2&&this.$s===b.$s&&J.m(this.a,b.a)&&J.m(this.b,b.b)},
gX(a){return A.e7(this.$s,this.a,this.b,B.m)}}
A.cr.prototype={
aW(){return[this.a]},
G(a,b){if(b==null)return!1
return b instanceof A.cr&&this.$s===b.$s&&J.m(this.a,b.a)},
gX(a){return A.e7(this.$s,this.a,B.m,B.m)}}
A.b8.prototype={
aW(){return[this.a,this.b,this.c]},
G(a,b){var s=this
if(b==null)return!1
return b instanceof A.b8&&s.$s===b.$s&&J.m(s.a,b.a)&&J.m(s.b,b.b)&&J.m(s.c,b.c)},
gX(a){var s=this
return A.e7(s.$s,s.a,s.b,s.c)}}
A.an.prototype={
aW(){return this.a},
G(a,b){if(b==null)return!1
return b instanceof A.an&&this.$s===b.$s&&A.np(this.a,b.a)},
gX(a){return A.e7(this.$s,A.mO(this.a),B.m,B.m)}}
A.dY.prototype={
u(a){return"RegExp/"+this.a+"/"+this.b.flags},
gfk(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.ku(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
e6(a){var s=this.b.exec(a)
if(s==null)return null
return new A.df(s)},
dR(a,b){return new A.eq(this,b,0)},
f6(a,b){var s,r=this.gfk()
if(r==null)r=A.b_(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.df(s)},
$ifv:1,
$imW:1}
A.df.prototype={
h(a,b){var s
A.j(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$ieb:1}
A.eq.prototype={
gD(a){return new A.cm(this.a,this.b,this.c)}}
A.cm.prototype={
gB(){var s=this.d
return s==null?t.d.a(s):s},
t(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.f6(l,s)
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
$ia6:1}
A.h3.prototype={
ar(){var s=this.b
if(s===this)throw A.f(new A.bd("Local '' has not been initialized."))
return s},
se5(a){if(this.b!==this)throw A.f(new A.bd("Local '' has already been initialized."))
this.b=a}}
A.bB.prototype={
gY(a){return B.b7},
bv(a,b,c){A.bs(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dW(a){return this.bv(a,0,null)},
dV(a,b,c){A.bs(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dU(a,b,c){A.bs(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dT(a,b,c){if(B.a.T(b,16)!==0)A.r(A.kC("Offset ("+b+") must be a multiple of BYTES_PER_ELEMENT (16)"))
return new A.cT(A.mM(a,b,(c==null?B.a.J(a.byteLength-b,16):c)*4))},
dS(a,b,c){A.bs(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iC:1,
$ibB:1}
A.cg.prototype={$icg:1}
A.cT.prototype={
gY(a){return B.ba},
gk(a){return this.a.length/4|0},
h(a,b){var s,r,q,p,o,n,m
A.j(b)
s=this.a
r=s.length
A.b0(b,this,r/4|0)
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
return new A.aT(p,n,m,s[q])},
q(a,b,c){var s,r,q,p
t.Y.a(c)
s=this.a
r=s.length
A.b0(b,this,r/4|0)
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
$ip:1,
$iC:1,
$ik:1,
$iv:1,
$iL:1,
$if4:1}
A.eL.prototype={}
A.cW.prototype={
ga7(a){if(((a.$flags|0)&2)!==0)return new A.ig(a.buffer)
else return a.buffer},
fh(a,b,c,d){var s=A.as(b,0,c,d,null)
throw A.f(s)},
cT(a,b,c,d){if(b>>>0!==b||b>c)this.fh(a,b,c,d)},
$iL:1}
A.ig.prototype={
bv(a,b,c){var s=A.ju(this.a,b,c)
s.$flags=3
return s},
dW(a){return this.bv(0,0,null)},
dV(a,b,c){var s=A.jt(this.a,b,c)
s.$flags=3
return s},
dU(a,b,c){var s=A.js(this.a,b,c)
s.$flags=3
return s},
dT(a,b,c){return new A.eL(J.j7(this.a,b,c).a)},
dS(a,b,c){var s=A.mJ(this.a,b,c)
s.$flags=3
return s}}
A.e1.prototype={
gY(a){return B.b8},
$iC:1}
A.af.prototype={
gk(a){return a.length},
du(a,b,c,d,e){var s,r,q=a.length
this.cT(a,b,q,"start")
this.cT(a,c,q,"end")
if(b>c)throw A.f(A.as(b,0,c,null,null))
s=c-b
if(e<0)throw A.f(A.aI(e,null))
r=d.length
if(r-e<s)throw A.f(A.at("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaA:1}
A.bC.prototype={
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
q(a,b,c){A.X(c)
a.$flags&2&&A.d(a)
A.b0(b,a,a.length)
a[b]=c},
K(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.d(a,5)
if(t.d4.b(d)){this.du(a,b,c,d,e)
return}this.cK(a,b,c,d,e)},
C(a,b,c,d){return this.K(a,b,c,d,0)},
$ip:1,
$ik:1,
$iv:1}
A.aB.prototype={
q(a,b,c){A.j(c)
a.$flags&2&&A.d(a)
A.b0(b,a,a.length)
a[b]=c},
K(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.d(a,5)
if(t.eB.b(d)){this.du(a,b,c,d,e)
return}this.cK(a,b,c,d,e)},
C(a,b,c,d){return this.K(a,b,c,d,0)},
$ip:1,
$ik:1,
$iv:1}
A.ch.prototype={
gY(a){return B.b9},
$iC:1,
$ich:1,
$ibx:1}
A.cU.prototype={
gY(a){return B.bb},
$iC:1,
$if5:1}
A.e3.prototype={
gY(a){return B.bc},
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
$iC:1}
A.cV.prototype={
gY(a){return B.bd},
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
$iC:1,
$ijj:1}
A.e5.prototype={
gY(a){return B.be},
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
$iC:1}
A.e6.prototype={
gY(a){return B.bg},
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
$iC:1,
$ijE:1}
A.cX.prototype={
gY(a){return B.bh},
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
$iC:1,
$id8:1}
A.cY.prototype={
gY(a){return B.bi},
gk(a){return a.length},
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
$iC:1}
A.bU.prototype={
gY(a){return B.bj},
gk(a){return a.length},
h(a,b){A.j(b)
A.b0(b,a,a.length)
return a[b]},
$iC:1,
$ibU:1,
$iaW:1}
A.aT.prototype={
ah(a,b){var s,r,q,p,o=this
t.Y.a(b)
s=$.dJ()
s.$flags&2&&A.d(s)
s[0]=o.a*b.a
r=s[0]
s[0]=o.b*b.b
q=s[0]
s[0]=o.c*b.c
p=s[0]
s[0]=o.d*b.d
return new A.aT(r,q,p,s[0])},
cI(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.dJ()
k.$flags&2&&A.d(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.aT(s,r,q,k[0])},
u(a){return"V128"},
$ia5:1}
A.eF.prototype={}
A.eG.prototype={}
A.dg.prototype={}
A.dh.prototype={}
A.di.prototype={}
A.dj.prototype={}
A.eO.prototype={}
A.aV.prototype={
i(a){return A.dC(v.typeUniverse,this,a)},
a3(a){return A.l3(v.typeUniverse,this,a)}}
A.eA.prototype={}
A.id.prototype={
u(a){return A.ao(this.a,null)}}
A.ex.prototype={
u(a){return this.a}}
A.cx.prototype={$ibk:1}
A.h_.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:7}
A.fZ.prototype={
$1(a){var s,r
this.a.a=t.O.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:42}
A.h0.prototype={
$0(){this.a.$0()},
$S:8}
A.h1.prototype={
$0(){this.a.$0()},
$S:8}
A.ia.prototype={
eD(a,b){if(self.setTimeout!=null)self.setTimeout(A.dH(new A.ib(this,b),0),a)
else throw A.f(A.aK("`setTimeout()` not found."))}}
A.ib.prototype={
$0(){this.b.$0()},
$S:0}
A.er.prototype={}
A.ip.prototype={
$1(a){return this.a.$2(0,a)},
$S:4}
A.iq.prototype={
$2(a,b){this.a.$2(1,new A.cK(a,t.l.a(b)))},
$S:36}
A.iA.prototype={
$2(a,b){this.a(A.j(a),b)},
$S:38}
A.aw.prototype={
u(a){return A.x(this.a)},
$iO:1,
gaU(){return this.b}}
A.ev.prototype={
e0(a){var s=this.a
if((s.a&30)!==0)throw A.f(A.at("Future already completed"))
s.bf(A.o5(a,null))}}
A.dc.prototype={}
A.bm.prototype={
hB(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.bt(s,t.al.a(this.d),a.a,t.y,t.K)},
hn(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.fM(l,q,m,a.b,o,n,t.l)
else p=l.bt(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.E.b(A.ai(s))){if((r.c&1)!==0)throw A.f(A.aI("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.f(A.aI("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.M.prototype={
cu(a,b,c){var s,r,q,p=this.$ti
p.a3(c).i("1/(2)").a(a)
s=$.G
if(s===B.k){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.f(A.kj(b,"onError",u.c))}else{r=p.c
a=s.br(s,c.i("@<0/>").a3(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.oq(b,s)}q=new A.M(s,c.i("M<0>"))
r=b==null?1:3
this.be(new A.bm(q,r,a,b,p.i("@<1>").a3(c).i("bm<1,2>")))
return q},
dG(a,b,c){var s,r=this.$ti
r.a3(c).i("1/(2)").a(a)
s=new A.M($.G,c.i("M<0>"))
this.be(new A.bm(s,19,a,b,r.i("@<1>").a3(c).i("bm<1,2>")))
return s},
cA(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.G
q=new A.M(r,s)
if(r!==B.k)a=r.bq(r,a,t.z)
this.be(new A.bm(q,8,a,null,s.i("bm<1,1>")))
return q},
fN(a){this.a=this.a&1|16
this.c=a},
bg(a){this.a=a.a&30|this.a&1
this.c=a.c},
be(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.be(a)
return}r.bg(s)}q=r.b
q.aZ(q,new A.hD(r,a))}},
dm(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.dm(a)
return}m.bg(n)}l.a=m.bs(a)
s=m.b
s.aZ(s,new A.hH(l,m))}},
aY(){var s=t.F.a(this.c)
this.c=null
return this.bs(s)},
bs(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
cW(a){var s,r=this
r.$ti.c.a(a)
s=r.aY()
r.a=8
r.c=a
A.c_(r,s)},
eW(a){var s=this.aY()
this.bg(a)
A.c_(this,s)},
bh(a){var s=this.aY()
this.fN(a)
A.c_(this,s)},
eV(a,b){A.b_(a)
t.l.a(b)
this.bh(new A.aw(a,b))},
bN(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("ay<1>").b(a)){this.cS(a)
return}this.eR(a)},
eR(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.aZ(s,new A.hF(r,a))},
cS(a){A.jH(this.$ti.i("ay<1>").a(a),this,!1)
return},
bf(a){var s
this.a^=2
s=this.b
s.aZ(s,new A.hE(this,a))},
$iay:1}
A.hD.prototype={
$0(){A.c_(this.a,this.b)},
$S:0}
A.hH.prototype={
$0(){A.c_(this.b,this.a.a)},
$S:0}
A.hG.prototype={
$0(){A.jH(this.a.a,this.b,!0)},
$S:0}
A.hF.prototype={
$0(){this.a.cW(this.b)},
$S:0}
A.hE.prototype={
$0(){this.a.bh(this.b)},
$S:0}
A.hK.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bu(p,t.fO.a(q.d),t.z)}catch(o){s=A.ai(o)
r=A.bt(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.jc(q)
n=k.a
n.c=new A.aw(q,p)
q=n}q.b=!0
return}if(j instanceof A.M&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.M){m=k.b.a
l=new A.M(m.b,m.$ti)
j.cu(new A.hL(l,m),new A.hM(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.hL.prototype={
$1(a){this.a.eW(this.b)},
$S:7}
A.hM.prototype={
$2(a,b){A.b_(a)
t.l.a(b)
this.a.bh(new A.aw(a,b))},
$S:55}
A.hJ.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.bt(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.ai(k)
r=A.bt(k)
q=s
p=r
if(p==null)p=A.jc(q)
o=this.a
o.c=new A.aw(q,p)
o.b=!0}},
$S:0}
A.hI.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.hB(s)&&p.a.e!=null){p.c=p.a.hn(s)
p.b=!1}}catch(o){r=A.ai(o)
q=A.bt(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.jc(p)
m=l.b
m.c=new A.aw(p,n)
p=m}p.b=!0}},
$S:0}
A.es.prototype={}
A.d6.prototype={
gk(a){var s={},r=new A.M($.G,t.fJ)
s.a=0
this.eb(new A.fH(s,this),!0,new A.fI(s,r),r.geU())
return r}}
A.fH.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.fI.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.aY()
r.c.a(q)
s.a=8
s.c=q
A.c_(s,p)},
$S:0}
A.dw.prototype={
gfw(){var s,r=this
if((r.b&8)===0)return A.n(r).i("aY<1>?").a(r.a)
s=A.n(r)
return s.i("aY<1>?").a(s.i("dx<1>").a(r.a).gca())},
d0(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aY(A.n(q).i("aY<1>"))
return A.n(q).i("aY<1>").a(s)}r=A.n(q)
s=r.i("dx<1>").a(q.a).gca()
return r.i("aY<1>").a(s)},
gdC(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gca()
return A.n(this).i("cp<1>").a(s)},
cR(){if((this.b&4)!==0)return new A.bi("Cannot add event after closing")
return new A.bi("Cannot add event while adding a stream")},
d_(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.k5():new A.M($.G,t.U)
return s},
ce(){var s=this,r=s.b
if((r&4)!==0)return s.d_()
if(r>=4)throw A.f(s.cR())
r=s.b=r|4
if((r&1)!==0)s.c2()
else if((r&3)===0)s.d0().m(0,B.A)
return s.d_()},
fR(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.n(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.f(A.at("Stream has already been listened to."))
s=h.c
r=$.G
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.br(r,t.a7.a3(s).i("1(2)").a(a),o,s)
A.nd(r,b)
n=c==null?A.oE():c
m=t.O
l=new A.cp(i,s,r.bq(r,m.a(n),o),r,q|p,h.i("cp<1>"))
k=i.gfw()
if(((i.b|=1)&8)!==0){j=h.i("dx<1>").a(i.a)
j.sca(l)
j.hK()}else i.a=l
l.fO(k)
h=m.a(new A.i7(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cU((s&4)!==0)
return l},
fE(a){var s,r,q,p,o,n,m,l,k=this,j=A.n(k)
j.i("eg<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("dx<1>").a(k.a).i_()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.M)s=q}catch(n){p=A.ai(n)
o=A.bt(n)
m=new A.M($.G,t.U)
j=A.b_(p)
l=t.l.a(o)
m.bf(new A.aw(j,l))
s=m}else s=s.cA(r)
j=new A.i6(k)
if(s!=null)s=s.cA(j)
else j.$0()
return s},
$ikF:1,
$ikY:1,
$ibZ:1,
$ifF:1}
A.i7.prototype={
$0(){A.jU(this.a.d)},
$S:0}
A.i6.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bN(null)},
$S:0}
A.et.prototype={
c1(a){var s=this.$ti
s.c.a(a)
this.gdC().cQ(new A.bY(a,s.i("bY<1>")))},
c2(){this.gdC().cQ(B.A)}}
A.cn.prototype={}
A.co.prototype={
gX(a){return(A.d0(this.a)^892482866)>>>0},
G(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.co&&b.a===this.a}}
A.cp.prototype={
dh(){return this.w.fE(this)},
di(){var s=this.w,r=A.n(s)
r.i("eg<1>").a(this)
if((s.b&8)!==0)r.i("dx<1>").a(s.a).i3()
A.jU(s.e)},
dj(){var s=this.w,r=A.n(s)
r.i("eg<1>").a(this)
if((s.b&8)!==0)r.i("dx<1>").a(s.a).hK()
A.jU(s.f)}}
A.dd.prototype={
fO(a){var s=this
A.n(s).i("aY<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bI(s)}},
di(){},
dj(){},
dh(){return null},
cQ(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aY(A.n(r).i("aY<1>"))
q.m(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bI(r)}},
c1(a){var s,r=this,q=A.n(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.hM(r.a,a,q)
r.e&=4294967231
r.cU((s&4)!==0)},
c2(){var s,r=this,q=new A.h2(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.dh()
r.e|=16
if(p!=null&&p!==$.k5())p.cA(q)
else q.$0()},
cU(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=p&4294967167
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p&=4294967291
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=p^64
if(r)q.di()
else q.dj()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bI(q)},
$ieg:1,
$ibZ:1}
A.h2.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.hL(s.c)
s.e&=4294967231},
$S:0}
A.dy.prototype={
eb(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.fR(s.i("~(1)?").a(a),d,c,b===!0)},
hy(a){return this.eb(a,null,null,null)}}
A.bG.prototype={
sb4(a){this.a=t.ev.a(a)},
gb4(){return this.a}}
A.bY.prototype={
ed(a){this.$ti.i("bZ<1>").a(a).c1(this.b)}}
A.ew.prototype={
ed(a){a.c2()},
gb4(){return null},
sb4(a){throw A.f(A.at("No events after a done."))},
$ibG:1}
A.aY.prototype={
bI(a){var s,r=this
r.$ti.i("bZ<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.p5(new A.i3(r,a))
r.a=1},
m(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sb4(b)
s.c=b}}}
A.i3.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("bZ<1>").a(this.b)
r=p.b
q=r.gb4()
p.b=q
if(q==null)p.c=null
r.ed(s)},
$S:0}
A.eI.prototype={}
A.fX.prototype={
hL(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.bu(o,a,t.H)
return q}catch(p){s=A.ai(p)
r=A.bt(p)
o.aX(o,s,r)}},
hM(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.bt(o,a,b,t.H,c)
return q}catch(p){s=A.ai(p)
r=A.bt(p)
o.aX(o,s,r)}},
h1(a,b){return new A.fY(this,this.bq(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.gi2(null).h(0,b)
return s}return null},
aX(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.os(b,c)
return}r=s.gcB()
q=r.ghZ()
p=$.G
try{$.G=q
s.hm(r,r.gbX(),a,b,c)
$.G=p}catch(m){o=A.ai(m)
n=A.bt(m)
$.G=p
l=b===o?c:n
q.aX(r,o,l)}},
bu(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.G
if(r===a)return b.$0()
s=r
$.G=a
try{r=b.$0()
return r}finally{$.G=s}q=null.gcB()
return null.i0(q,q.gbX(),a,b)},
bt(a,b,c,d,e){var s,r,q
d.i("@<0>").a3(e).i("1(2)").a(b)
e.a(c)
r=$.G
if(r===a)return b.$1(c)
s=r
$.G=a
try{r=b.$1(c)
return r}finally{$.G=s}q=null.gcB()
return null.hm(q,q.gbX(),a,b,c)},
fM(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").a3(f).a3(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.G
if(r===a)return b.$2(c,d)
s=r
$.G=a
try{r=b.$2(c,d)
return r}finally{$.G=s}q=null.gcB()
return null.i1(q,q.gbX(),a,b,c,d)},
bq(a,b,c){c.i("0()").a(b)
return b},
br(a,b,c,d){c.i("@<0>").a3(d).i("1(2)").a(b)
return b},
c_(a,b,c,d,e){c.i("@<0>").a3(d).a3(e).i("1(2,3)").a(b)
return b},
f4(a,b,c){return null},
aZ(a,b){A.jT(a,t.O.a(b))
return}}
A.fY.prototype={
$0(){var s=this.a
return s.bu(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.iy.prototype={
$0(){A.mt(this.a,this.b)},
$S:0}
A.bo.prototype={
gD(a){var s=this,r=new A.bp(s,s.r,A.n(s).i("bp<1>"))
r.c=s.e
return r},
gk(a){return this.a},
al(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.eY(b)},
eY(a){var s=this.d
if(s==null)return!1
return this.bo(s[this.bi(a)],a)>=0},
ga5(a){var s=this.e
if(s==null)throw A.f(A.at("No elements"))
return A.n(this).c.a(s.a)},
m(a,b){var s,r,q=this
A.n(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cP(s==null?q.b=A.jJ():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cP(r==null?q.c=A.jJ():r,b)}else return q.eN(b)},
eN(a){var s,r,q,p=this
A.n(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.jJ()
r=p.bi(a)
q=s[r]
if(q==null)s[r]=[p.bW(a)]
else{if(p.bo(q,a)>=0)return!1
q.push(p.bW(a))}return!0},
A(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.dq(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.dq(s.c,b)
else return s.fG(b)},
fG(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bi(a)
r=n[s]
q=o.bo(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dL(p)
return!0},
f9(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("t(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.f(A.ax(n))
if(!0===o)n.A(0,r)}},
l(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bU()}},
cP(a,b){A.n(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.bW(b)
return!0},
dq(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dL(s)
delete a[b]
return!0},
bU(){this.r=this.r+1&1073741823},
bW(a){var s,r=this,q=new A.eE(A.n(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.bU()
return q},
dL(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.bU()},
bi(a){return J.av(a)&1073741823},
bo(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1}}
A.c0.prototype={
bi(a){return A.iP(a)&1073741823},
bo(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.eE.prototype={}
A.bp.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.f(A.ax(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$ia6:1}
A.A.prototype={
gD(a){return new A.bT(a,this.gk(a),A.aP(a).i("bT<A.E>"))},
am(a,b){return this.h(a,b)},
gR(a){return this.gk(a)===0},
gcq(a){return!this.gR(a)},
ga5(a){if(this.gk(a)===0)throw A.f(A.ae())
return this.h(a,0)},
gad(a){if(this.gk(a)===0)throw A.f(A.ae())
return this.h(a,this.gk(a)-1)},
gaf(a){if(this.gk(a)===0)throw A.f(A.ae())
if(this.gk(a)>1)throw A.f(A.jk())
return this.h(a,0)},
au(a,b){var s,r
A.aP(a).i("t(A.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.f(A.ax(a))}return!1},
ap(a,b){return A.fJ(a,b,null,A.aP(a).i("A.E"))},
m(a,b){var s
A.aP(a).i("A.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.q(a,s,b)},
ac(a,b,c,d){var s,r,q=A.aP(a)
q.i("A.E?").a(d)
s=d==null?q.i("A.E").a(d):d
A.b4(b,c,this.gk(a))
for(r=b;r<c;++r)this.q(a,r,s)},
K(a,b,c,d,e){var s,r,q,p,o
A.aP(a).i("k<A.E>").a(d)
A.b4(b,c,this.gk(a))
s=c-b
if(s===0)return
A.aU(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.mf(d,e).cv(0,!1)
r=0}p=J.R(q)
if(r+s>p.gk(q))throw A.f(A.mx())
if(r<b)for(o=s-1;o>=0;--o)this.q(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.q(a,b+o,p.h(q,r+o))},
C(a,b,c,d){return this.K(a,b,c,d,0)},
es(a,b,c){A.aP(a).i("k<A.E>").a(c)
this.C(a,b,b+c.length,c)},
u(a){return A.jl(a,"[","]")}}
A.J.prototype={
aK(a,b){var s,r,q,p=A.n(this)
p.i("~(J.K,J.V)").a(b)
for(s=this.gav(),s=s.gD(s),p=p.i("J.V");s.t();){r=s.gB()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ak(a,b){A.n(this).i("al<J.K,J.V>").a(b).aK(0,new A.fm(this))},
bC(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("t(J.K,J.V)").a(b)
s=A.h([],m.i("z<J.K>"))
for(r=n.gav(),r=r.gD(r),m=m.i("J.V");r.t();){q=r.gB()
p=n.h(0,q)
if(b.$2(q,p==null?m.a(p):p))B.b.m(s,q)}for(m=s.length,o=0;o<s.length;s.length===m||(0,A.a_)(s),++o)n.A(0,s[o])},
gk(a){var s=this.gav()
return s.gk(s)},
gR(a){var s=this.gav()
return s.gR(s)},
u(a){return A.kx(this)},
$ial:1}
A.fm.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.q(0,r.i("J.K").a(a),r.i("J.V").a(b))},
$S(){return A.n(this.a).i("~(J.K,J.V)")}}
A.fn.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.x(a)
r.a=(r.a+=s)+": "
s=A.x(b)
r.a+=s},
$S:66}
A.bg.prototype={
ak(a,b){var s
A.n(this).i("k<1>").a(b)
for(s=b.gD(b);s.t();)this.m(0,s.gB())},
u(a){return A.jl(this,"{","}")},
ap(a,b){return A.kE(this,b,A.n(this).c)},
$ip:1,
$ik:1,
$ib5:1}
A.dt.prototype={}
A.eC.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fz(b):s}},
gk(a){return this.b==null?this.c.a:this.aM().length},
gR(a){return this.gk(0)===0},
gav(){if(this.b==null){var s=this.c
return new A.P(s,A.n(s).i("P<1>"))}return new A.eD(this)},
q(a,b,c){var s,r,q=this
A.H(b)
if(q.b==null)q.c.q(0,b,c)
else if(q.aI(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.dN().q(0,b,c)},
ak(a,b){t.P.a(b).aK(0,new A.hW(this))},
aI(a){if(this.b==null)return this.c.aI(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
A(a,b){if(this.b!=null&&!this.aI(b))return null
return this.dN().A(0,b)},
l(a){var s,r=this
if(r.b==null)r.c.l(0)
else{if(r.c!=null)B.b.l(r.aM())
r.a=r.b=null
s=t.z
r.c=A.a8(s,s)}},
aK(a,b){var s,r,q,p,o=this
t.cA.a(b)
if(o.b==null)return o.c.aK(0,b)
s=o.aM()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.is(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.f(A.ax(o))}},
aM(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.h(Object.keys(this.a),t.s)
return s},
dN(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.a8(t.N,t.z)
r=n.aM()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.q(0,o,n.h(0,o))}if(p===0)B.b.m(r,"")
else B.b.l(r)
n.a=n.b=null
return n.c=s},
fz(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.is(this.a[a])
return this.b[a]=s}}
A.hW.prototype={
$2(a,b){this.a.q(0,A.H(a),b)},
$S:74}
A.eD.prototype={
gk(a){return this.a.gk(0)},
am(a,b){var s=this.a
if(s.b==null)s=s.gav().am(0,b)
else{s=s.aM()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gD(a){var s=this.a
if(s.b==null){s=s.gav()
s=s.gD(s)}else{s=s.aM()
s=new J.bN(s,s.length,A.a4(s).i("bN<1>"))}return s}}
A.ii.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:10}
A.ih.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:10}
A.dO.prototype={}
A.dQ.prototype={}
A.e_.prototype={
e2(a,b){var s=A.om(a,this.ghc().a)
return s},
ghc(){return B.aa}}
A.ff.prototype={}
A.eN.prototype={
cX(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.b4(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.nD(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.nC(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bP(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.nE(o)
l.b=0
throw A.f(A.U(m,a,p+l.c))}return n},
bP(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.J(b+c,2)
r=q.bP(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bP(a,s,c,d)}return q.h6(a,b,c,d)},
h6(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.ck(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.d1(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.d1(h)
e.a+=p
break
case 65:p=A.d1(h)
e.a+=p;--d
break
default:p=A.d1(h)
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
p=A.d1(a[l])
e.a+=p}else{p=A.eh(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.d1(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.hj.prototype={
u(a){return this.f3()}}
A.O.prototype={
gaU(){return A.mQ(this)}}
A.cF.prototype={
u(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.f3(s)
return"Assertion failed"}}
A.bk.prototype={}
A.b2.prototype={
gbS(){return"Invalid argument"+(!this.a?"(s)":"")},
gbR(){return""},
u(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.x(p),n=s.gbS()+q+o
if(!s.a)return n
return n+s.gbR()+": "+A.f3(s.gcn())},
gcn(){return this.b}}
A.bf.prototype={
gcn(){return A.l7(this.b)},
gbS(){return"RangeError"},
gbR(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.x(q):""
else if(q==null)s=": Not greater than or equal to "+A.x(r)
else if(q>r)s=": Not in inclusive range "+A.x(r)+".."+A.x(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.x(r)
return s}}
A.dS.prototype={
gcn(){return A.j(this.b)},
gbS(){return"RangeError"},
gbR(){if(A.j(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ibf:1,
gk(a){return this.f}}
A.da.prototype={
u(a){return"Unsupported operation: "+this.a}}
A.en.prototype={
u(a){return"UnimplementedError: "+this.a}}
A.bi.prototype={
u(a){return"Bad state: "+this.a}}
A.dP.prototype={
u(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.f3(s)+"."}}
A.e8.prototype={
u(a){return"Out of Memory"},
gaU(){return null},
$iO:1}
A.d5.prototype={
u(a){return"Stack Overflow"},
gaU(){return null},
$iO:1}
A.hk.prototype={
u(a){return"Exception: "+this.a}}
A.a0.prototype={
u(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.p.bK(e,0,75)+"..."
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
k=""}return g+l+B.p.bK(e,i,j)+k+"\n"+B.p.ah(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.x(f)+")"):g}}
A.k.prototype={
au(a,b){var s
A.n(this).i("t(k.E)").a(b)
for(s=this.gD(this);s.t();)if(b.$1(s.gB()))return!0
return!1},
cv(a,b){var s=A.n(this).i("k.E")
if(b)s=A.aS(this,s)
else{s=A.aS(this,s)
s.$flags=1
s=s}return s},
gk(a){var s,r=this.gD(this)
for(s=0;r.t();)++s
return s},
gR(a){return!this.gD(this).t()},
gcq(a){return!this.gR(this)},
ap(a,b){return A.kE(this,b,A.n(this).i("k.E"))},
ga5(a){var s=this.gD(this)
if(!s.t())throw A.f(A.ae())
return s.gB()},
gad(a){var s,r=this.gD(this)
if(!r.t())throw A.f(A.ae())
do s=r.gB()
while(r.t())
return s},
gaf(a){var s,r=this.gD(this)
if(!r.t())throw A.f(A.ae())
s=r.gB()
if(r.t())throw A.f(A.jk())
return s},
am(a,b){var s,r
A.aU(b,"index")
s=this.gD(this)
for(r=b;s.t();){if(r===0)return s.gB();--r}throw A.f(A.jh(b,b-r,this,"index"))},
u(a){return A.my(this,"(",")")}}
A.bA.prototype={
u(a){return"MapEntry("+A.x(this.a)+": "+A.x(this.b)+")"}}
A.a2.prototype={
gX(a){return A.e.prototype.gX.call(this,0)},
u(a){return"null"}}
A.e.prototype={$ie:1,
G(a,b){return this===b},
gX(a){return A.d0(this)},
u(a){return"Instance of '"+A.ea(this)+"'"},
gY(a){return A.iF(this)},
toString(){return this.u(this)}}
A.eJ.prototype={
u(a){return""},
$iaD:1}
A.fG.prototype={
gck(){var s,r=this.b
if(r==null)r=$.jx.$0()
s=r-this.a
if($.k7()===1e6)return s
return s*1000}}
A.ck.prototype={
gk(a){return this.a.length},
u(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.ft.prototype={
u(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.f9.prototype={
$2(a,b){var s=t.g
this.a.cu(new A.f7(s.a(a)),new A.f8(s.a(b)),t.X)},
$S:17}
A.f7.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:18}
A.f8.prototype={
$2(a,b){var s=A.nS(A.b_(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:19}
A.iQ.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.r(A.at("Future already completed"))
s.bN(r.i("1/").a(a))
return null},
$S:4}
A.iR.prototype={
$1(a){if(a==null)return this.a.e0(new A.ft(a===undefined))
return this.a.e0(a)},
$S:4}
A.fa.prototype={
h5(a,b,c,d){var s
t.L.a(a)
s=A.jv(32768)
this.ha(A.ji(a,B.o,null,null),s,b,!0,!0)
return s.b8()},
ha(a,b,c,d,e){return A.oK(b,c,new A.fb(a,!0,!0))}}
A.fb.prototype={
$1(a){return B.S.h9(this.a,a,this.c,this.b)},
$S:20}
A.hN.prototype={
hb(a,b,c,d,e){var s,r,q=d==null?e:d,p=a.a
a.a=B.o
s=e||q
try{r=A.lB("gzip",e,q,new A.hP(this,a,b,e,!1,s))
return r}finally{a.sdY(p)}},
h9(a,b,c,d){return this.hb(a,b,!1,c,d)},
f_(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j=0
for(;;){s=a.c
r=a.d
r===$&&A.E()
if(!(s<r))break
r={}
if(!this.fD(a,e)){if(j!==0)return!1
a.c=s
return B.T.h8(a,b,!1,c)}q=b.gk(b)
s=r.a=0
if(c){p=new A.ee(new A.ep(b),new Uint8Array(65536),B.o)
p.shU(new A.hO(r))}else p=null
o=p==null
n=o?b:p
m=new A.dT(a,n,!0)
m.d8()
if(!o)p.bl()
if(!m.f)return!1
o=a.b
if((o==null?s:o.length-a.c)<8)return!1
l=a.b5()
k=a.b5()
b.e7()
if(B.a.T(b.gk(b)-q,4294967296)!==k)return!1
if(c&&r.a!==l)throw A.f(A.j9("Invalid gzip checksum"));++j}return j!==0},
fD(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gk(0)<10)return!1
s=a.c
if(a.bB()!==35615)return!1
if(a.ao()!==8)return!1
r=a.ao()
if(b&&(r&224)!==0)return!1
a.b5()
a.ao()
a.ao()
if((r&4)!==0){if(a.gk(0)<2)return!1
q=a.bB()
if(a.gk(0)<q)return!1
a.eg(q)}if((r&8)!==0)if(!this.dz(a))return!1
if((r&16)!==0)if(!this.dz(a))return!1
if((r&2)!==0){if(a.gk(0)<2)return!1
if(b){p=a.bB()
o=a.bJ(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.E()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bJ(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.lz(i.hN(),n)}if((n&65535)!==p)throw A.f(A.j9("Invalid gzip header checksum"))}else a.bB()}return!0},
dz(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.E()
if(!(s<r))break
r=a.b
r.toString
a.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1}}
A.hP.prototype={
$0(){var s=this
return s.a.f_(s.b,s.c,s.d,s.e,s.f)},
$S:11}
A.hO.prototype={
$1(a){var s=this.a
return s.a=A.lz(a,s.a)},
$S:22}
A.fc.prototype={
eB(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
for(s=0;s<a0;++s){r=a1[s]
if(r>a.b)a.b=r
if(r<a.c)a.c=r}r=a.b
if(r>15)throw A.f(B.V)
q=r+1
p=new Uint16Array(q)
for(o=0;o<a0;++o){n=a1[o]
if(n!==0){if(!(n>=0&&n<q))return A.a(p,n)
m=p[n]
if(!(n<q))return A.a(p,n)
p[n]=m+1}}for(l=1,k=1;k<=r;++k){l=(l<<1>>>0)-p[k]
if(l<0)throw A.f(B.a6)}if(l>0)q=r>(a2?0:1)
else q=!1
if(q)throw A.f(B.a4)
j=B.a.a9(1,r)
r=a.a=new Uint32Array(j)
for(q=a.b,m=a1.length,i=1,h=0,g=2;i<=q;){for(f=i<<16,s=0;s<a0;++s){if(!(s<m))return A.a(a1,s)
if(a1[s]===i){for(e=h,d=0,c=0;c<i;++c){d=(d<<1|e&1)>>>0
e=e>>>1}for(b=(f|s)>>>0,c=d;c<j;c+=g){if(!(c>=0&&c<j))return A.a(r,c)
r[c]=b}++h}}++i
h=h<<1>>>0
g=g<<1>>>0}}}
A.fW.prototype={}
A.ik.prototype={
h8(a,b,c,d){var s,r=d,q=a.a
a.a=B.t
try{s=A.lB("zlib",d,r,new A.il(this,a,b,d,!1))
return s}finally{a.sdY(q)}},
eE(a,b,c,d){var s,r,q,p,o,n,m,l=a.c,k=a.d
k===$&&A.E()
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
return!1}l=new A.bV(new Uint8Array(32768),B.o)
o=new A.dT(a,l,!0)
o.d8()
n=o.c.b8()
if(!o.f){b.ae(n)
return!1}l=a.b
if((l==null?0:l.length-a.c)<4){b.ae(n)
return!1}m=a.b5()
if(c)if(m!==A.oQ(n)){b.ae(n)
throw A.f(A.j9("Invalid zlib checksum"))}break A}if(n!=null)b.ae(n)
return!0}}
A.il.prototype={
$0(){var s=this
return s.a.eE(s.b,s.c,s.d,s.e)},
$S:11}
A.ep.prototype={
m(a,b){t.L.a(b)
this.a.ae(b)
this.b=this.b+b.length},
$ifF:1}
A.dT.prototype={
gaj(){var s=this.a
if(s==null)return s
s.d===$&&A.E()
return s},
d8(){var s,r,q,p=this
p.w=p.r=0
if(p.gaj()==null)return
s=p.c
if(!(s instanceof A.bV)){p.d=s
p.c=A.jv(32768)}try{for(;;){r=p.gaj()
q=r.c
r=r.d
r===$&&A.E()
if(!(q<r))break
if(!p.fm())return
p.d9(32768)}}finally{p.d9(0)
p.c=s
p.d=null}},
d9(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.b8()
o.ae(A.b6(q,0,r))
p=A.jv(2097152)
p.ae(A.b6(q,r,null))
this.c=p},
fm(){var s,r,q,p=this,o=p.gaj()
if(o!=null){s=o.c
r=o.d
r===$&&A.E()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.aa(3)
s=(q&1)===0
switch(B.a.L(q,1)){case 0:if(p.fv()===-1)return!1
break
case 1:if(p.cY($.lL(),$.lK())===-1)return!1
break
case 2:if(p.fn()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
aa(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gaj()
r=s.c
s=s.d
s===$&&A.E()
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
p=B.a.dv(1,a)
o.r=B.a.c3(r,a)
o.w=s-a
return(r&p-1)>>>0},
bZ(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.E()
s=a.b
while(m.w<s){r=m.gaj()
q=r.c
r=r.d
r===$&&A.E()
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
m.r=B.a.c3(r,n)
m.w-=n
return o&65535},
fv(){var s,r,q=this
q.w=q.r=0
s=q.aa(16)
if(s!==(q.aa(16)^65535)>>>0)return-1
if(s>q.gaj().gk(0))return-1
r=q.gaj().eg(s)
q.c.bF(r)
return 0},
fn(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.aa(5)
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
n=B.ad[p]
if(!(n<19))return A.a(q,n)
q[n]=o}m=g.dE(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.cb(B.d.ga7(l),0,f)
j=J.cb(B.d.ga7(l),f,s)
if(g.ff(n,m,l)===-1)return-1
i=g.dD(k)
n=i==null
h=n?null:g.dD(j)
if(n||h==null)return-1
return g.cY(i,h)},
dE(a,b){var s,r
t.L.a(a)
try{s=A.jg(a,b)
return s}catch(r){if(A.ai(r) instanceof A.a0)throw r
else throw r}},
dD(a){return this.dE(a,!1)},
cY(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.bZ(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bE(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.E,r)
q=j.aa(B.E[r])
if(q<0)return-1
if(!(r<29))return A.a(B.D,r)
p=B.D[r]
o=j.bZ(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.B,o)
n=j.aa(B.B[o])
if(n<0)return-1
m=B.af[o]+n
if(m>=1){l=j.c
l=m>l.gk(l)}else l=!0
if(l)return-1
j.c.bD(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gaj()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.E()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
ff(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.bZ(b)
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
A.e0.prototype={
bd(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.f(A.jb("The decoded data is larger than the "+s+" bytes allowed"))}},
gk(a){return this.b.b},
e7(){return null},
bE(a){this.bd(1)
this.b.bE(a)},
aS(a,b){t.L.a(a)
this.bd(a.length)
this.b.aS(a,b)},
ae(a){return this.aS(a,null)},
bF(a){this.bd(a.gk(0))
this.b.bF(a)},
bD(a,b){this.bd(b)
this.b.bD(a,b)},
aB(a,b){return this.b.aB(a,b)},
bb(a){return this.aB(a,null)}}
A.cc.prototype={}
A.cE.prototype={}
A.dK.prototype={}
A.cG.prototype={
f3(){return"ByteOrder."+this.b}}
A.ee.prototype={
gk(a){return this.c},
aS(a,b){var s
t.L.a(a)
s=A.b6(a,0,a.length)
this.bQ(s)},
ae(a){return this.aS(a,null)},
bE(a){var s,r,q,p=this
if(p.r!=null)p.bQ(new Uint8Array(A.ad(A.h([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.d(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bl()}},
bF(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.E()
if(!(r<q))break
s=a.hH(o,0,J.ap(o))
r=s
if(typeof r!=="number")return r.hX()
if(r<=0)break
this.bQ(A.b6(o,0,s))}}finally{a.c=A.j(p)}},
bQ(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bl()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.m(0,new Uint8Array(A.ad(A.b6(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.K(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bl()}},
bl(){var s=this,r=s.f
if(r===0)return
s.b.m(0,new Uint8Array(A.ad(A.b6(s.e,0,r))))
s.f=0},
aB(a,b){return A.r(A.aK("a streamed result cannot be read back"))},
bb(a){return this.aB(a,null)},
shU(a){this.r=t.cy.a(a)}}
A.hh.prototype={}
A.dU.prototype={
gk(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.j(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bJ(a,b){var s,r=this,q=r.b
if(q==null)return A.ji(A.h([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.E()
a=s-b}return A.ji(q,r.a,a,b)},
ao(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
hH(a,b,c){var s,r,q,p=this.b
if(p==null)return 0
s=p.length
r=this.c
q=s-r
q=c>q?q:c
if(q<=0)return 0
B.d.K(a,b,b+q,p,r)
this.c+=q
return q},
hN(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gk(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.f(A.as(q,0,r,"position",null))
return J.cb(B.d.ga7(n),o.b.byteOffset+o.c,s)}}
A.dV.prototype={
bB(){var s=this.ao(),r=this.ao()
if(this.a===B.t)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
b5(){var s=this,r=s.ao(),q=s.ao(),p=s.ao(),o=s.ao()
if(s.a===B.t)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
eg(a){var s=this,r=s.bJ(a,s.c)
s.c=s.c+r.gk(0)
return r},
sdY(a){this.a=t.fA.a(a)}}
A.bV.prototype={
e7(){},
b8(){return J.cb(B.d.ga7(this.c),this.c.byteOffset,this.b)},
bE(a){var s,r,q=this
if(q.b===q.c.length)q.f7()
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
bF(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bn(s+(q?0:r.length-a.c)-n)}if(!q)B.d.K(o,s,s+a.gk(0),r,a.c)
m.b=m.b+a.gk(0)},
bD(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.bn(r-p)
o=s-a
if(a>=b)B.d.K(q,s,r,q,o)
else for(n=q.$flags|0,m=o;s<r;s=l,m=k){l=s+1
k=m+1
if(!(m>=0&&m<p))return A.a(q,m)
j=q[m]
n&2&&A.d(q)
if(!(s>=0))return A.a(q,s)
q[s]=j}i.b+=b},
aB(a,b){var s=this
if(a<0)a=s.b+a
if(b==null)b=s.b
else if(b<0)b=s.b+b
return J.cb(B.d.ga7(s.c),s.c.byteOffset+a,b-a)},
bb(a){return this.aB(a,null)},
bn(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.C(s,0,q,r)
this.c=s},
f7(){return this.bn(null)},
gk(a){return this.b}}
A.bD.prototype={
bD(a,b){var s,r=this
for(s=-a;b>a;){r.ae(r.bb(s))
b-=a}if(b===a)r.ae(r.bb(s))
else r.ae(r.aB(s,b-a))},
b8(){return this.aB(0,this.gk(this))}}
A.eH.prototype={}
A.eZ.prototype={
hp(a,b){var s,r,q,p,o,n,m,l
if(b<=0)return!1
s=this.y.h(0,a)
r=s!=null
if(r&&s.a>=b)return!0
q=this.dx.h(0,a)
if(q!=null&&q.x&&q.f===b&&q.y>=b)return!0
for(p=this.ay,o=0,n=0;n<b;++n){if(!(r&&s.al(0,n))){m=p.h(0,new A.y(a,B.a.J(n,4)))
if(m==null)m=null
else{l=n-m.c
m=l>=0&&l<4&&m.d[l]!==255}m=m===!0}else m=!0
if(m)++o
else break}return o>=b},
eu(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.cf()
this.a=s},
cF(){this.fy=0
if(this.fx.length>65536)this.fx=new Uint8Array(65536)},
el(a,b,c,d,e,f,g,a0){var s,r,q,p,o,n,m,l,k,j,i,h=this
h.db=h.cy=0
s=a0*e*4
if(d<0||d>=g||b.length<s)return!1
r=new A.y(c,B.a.J(d,4))
q=h.ay
p=q.A(0,r)
if(p!=null){q.q(0,r,p)
if(p.a===a0&&p.b===e&&p.al(0,d)){p.z=++h.ax
p.hG(d,b,a)
if(h.r){o=p.hk(d)
h.cy=o.a
h.db=o.b}return!0}}if(a!=null){a.a=null
a.b=-1}n=new A.y(c,d)
q=h.x
m=q.A(0,n)
if(m!=null){m.f=++h.ax
q.q(0,n,m)
q=m.a
l=q.length
k=m.b
if(h.cZ(q,0,l,k,b,s)){if(h.r){j=m.d
if(j===0&&m.e===0){i=A.jd(m.c,q,0,l,k)
q=m.d=i.a
m.e=i.b}else q=j
h.cy=q
h.db=m.e}return!0}h.aF(n)}return!1},
hT(a,b,c,d,e,f,g){return this.el(null,a,b,c,d,e,f,g)},
ee(a,b,c,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=a1*c
if(b<0||b>=a0||d>147456||d<256||e.b<=0)return!1
s=B.a.J(b,4)*4
r=Math.min(s+4,a0)
q=r-s
if(q<2)return!1
p=new A.y(a,B.a.J(s,4))
o=e.ay
if(o.aI(p)||e.ch.al(0,p))return!1
n=A.h([],t.t)
for(m=e.x,l=s,k=0;l<r;++l){j=m.h(0,new A.y(a,l))
if(j!=null){k+=j.a.length
B.b.m(n,l)}}if(n.length<2)return!1
i=d*4
h=e.cx
if(h==null||h.length<i)h=e.cx=new Uint8Array(i)
g=A.n4(s,n,new A.f1(e,a),c,Math.min(B.a.J(e.b,8),k*2),new A.f2(e,a,i),h,a1)
if(g==null){if(n.length===q){q=e.ch
q.m(0,p)
if(q.a>128)q.A(0,q.ga5(0))}return!1}for(q=n.length,f=0;f<n.length;n.length===q||(0,A.a_)(n),++f)e.aF(new A.y(a,n[f]))
q=g.w
e.da(q)
g.z=++e.ax
o.q(0,p,g)
e.CW+=q
return!0},
cJ(a,b,c,d,e,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a2*c*4
if(b<0||b>=a1||a0.length<f)return new A.cw([0,0,0,0,0])
s=new A.y(a,B.a.J(b,4))
g.ch.A(0,s)
r=g.ay.h(0,s)
r=r==null?null:r.al(0,b)
if(r===!0)g.fH(s)
q=f+B.a.J(f,255)+16
p=e.hh(q)
if(f>0)$.j1()
o=A.mH(a0,f,p,e.a,f)
n=o<0||o>=f
if(n){m=f
l=a0}else{m=o
l=p}k=A.kl(l,0,m)
if(g.r){j=A.jd(k,l,0,m,n)
i=j.a
h=j.b}else{i=0
h=0}g.cy=i
g.db=h
g.fB(l,k,i,h,n,m,new A.y(a,b),0,a1)
e.hI(q)
return new A.cw([m,k,0,i,h])},
hd(a){var s,r=this.dx.A(0,a)
if(r!=null)try{r.c.ce()}catch(s){}return!1},
hi(a){var s,r,q,p,o=this,n=o.ay,m=A.n(n).i("P<1>"),l=m.i("bW<k.E>")
m=A.aS(new A.bW(new A.P(n,m),m.i("t(k.E)").a(new A.f_(a)),l),l.i("k.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.a_)(m),++s){r=n.A(0,m[s])
if(r!=null)o.CW=o.CW-r.w}n=o.ch
n.f9(A.n(n).i("t(1)").a(new A.f0(a)),!0)
o.as.A(0,a)
o.Q.A(0,a)
o.z.A(0,a)
q=o.y.A(0,a)
if(q==null)return
for(n=q.gD(q),m=o.x;n.t();){p=m.A(0,new A.y(a,n.gB()))
if(p!=null)o.at=o.at-p.a.length}},
cf(){var s,r,q,p
for(r=this.dx,q=new A.aR(r,r.r,r.e,A.n(r).i("aR<2>"));q.t();){s=q.d
try{s.c.ce()}catch(p){}}r.l(0)},
dZ(){var s=this
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
s.cF()},
f0(a,b,c,d,e,f,g){var s
$.j1()
if(g!=null&&A.kl(a,b,c)!==g)return!1
if(d){if(c!==f)return!1
B.d.K(e,0,f,a,b)
return!0}try{A.mI(a,b,c,e,f)
return!0}catch(s){if(A.ai(s) instanceof A.a0)return!1
else throw s}},
cZ(a,b,c,d,e,f){return this.f0(a,b,c,d,e,f,null)},
fB(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k=this,j=k.b
if(j<=0||f>j)return
s=g.a
if(i>0)k.Q.q(0,s,i)
k.aF(g)
j=k.y
r=j.h(0,s)
q=r==null?null:r.a
if(q==null)q=0
p=k.z
o=p.h(0,s)
if(o==null)o=0
k.c9(s,q+1,o+f)
if(k.as.al(0,s)){k.f5(f)
if(k.at+k.CW+f>k.b)return}else k.dc(f,s)
n=new Uint8Array(f)
B.d.K(n,0,f,a,h)
k.x.q(0,g,new A.eH(n,e,b,c,d,++k.ax))
m=j.h(0,s)
if(m==null){m=A.fk(t.S)
j.q(0,s,m)}m.m(0,g.b)
k.at+=f
j=p.h(0,s)
l=(j==null?0:j)+f
p.q(0,s,l)
k.c9(s,m.a,l)},
c9(a,b,c){var s,r,q=this,p=q.Q.h(0,a)
if(p==null)p=0
if(p>0&&b>=1&&b<p){s=B.a.a_(c*p,b)
r=q.b
if(s>(b===1?B.a.J(r*5,4):r)){q.as.m(0,a)
return}}q.as.A(0,a)},
fH(a){var s=this.ay.A(0,a)
if(s!=null)this.CW=this.CW-s.w},
f5(a){var s,r,q,p,o,n=this,m=n.y,l=n.as,k=A.n(l),j=k.i("bp<1>")
k=k.c
for(;;){if(!(n.at+n.CW+a>n.b&&l.a!==0))break
r=new A.bp(l,l.r,j)
r.c=l.e
for(;;){if(!r.t()){s=null
break}q=r.d
s=q==null?k.a(q):q
p=m.h(0,s)
if(p!=null&&p.a!==0)break}if(s==null){l.l(0)
break}r=m.h(0,s)
o=r.e
if(o==null)A.r(A.at("No elements"))
n.aF(new A.y(s,A.n(r).c.a(o.a)))}},
dc(a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this
for(s=t.x,r=a3.ay,q=A.n(r),p=q.i("P<1>"),o=a3.x,n=a3.as,m=A.n(n),l=m.i("bp<1>"),k=a3.y,m=m.c,j=A.n(o),i=j.i("P<1>"),q=q.i("bS<2>"),j=j.i("bS<2>");a3.at+a3.CW+a4>a3.b;){h=!1
if(n.a!==0){for(g=new A.bp(n,n.r,l),g.c=n.e,f=null;g.t();){e=g.d
d=e==null?m.a(e):e
c=k.h(0,d)
if(c==null||c.a===0)continue
if(d!==a5){f=d
break}if(f==null)f=d}if(f!=null){c=k.h(0,f)
h=c!=null&&c.a!==0
if(h){b=c.e
if(b==null)A.r(A.at("No elements"))
a3.aF(new A.y(f,A.n(c).c.a(b.a)))}else n.A(0,f)}}if(h)continue
a=o.a!==0
a0=r.a!==0
if(a&&a0){a1=new A.bS(o,j).gD(0)
if(!a1.t())A.r(A.ae())
g=a1.gB().f
a1=new A.bS(r,q).gD(0)
if(!a1.t())A.r(A.ae())
if(g<=a1.gB().z){a1=new A.P(o,i).gD(0)
if(!a1.t())A.r(A.ae())
a3.aF(a1.gB())}else{a1=new A.P(r,p).gD(0)
if(!a1.t())A.r(A.ae())
a2=r.A(0,s.a(a1.gB()))
if(a2!=null)a3.CW=a3.CW-a2.w}}else if(a){a1=new A.P(o,i).gD(0)
if(!a1.t())A.r(A.ae())
a3.aF(a1.gB())}else if(a0){a1=new A.P(r,p).gD(0)
if(!a1.t())A.r(A.ae())
a2=r.A(0,s.a(a1.gB()))
if(a2!=null)a3.CW=a3.CW-a2.w}else break}},
da(a){return this.dc(a,null)},
aF(a){var s,r,q,p,o,n,m=this,l=m.x.A(0,a)
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
m.c9(s,q,r)}}else{r.A(0,s)
m.as.A(0,s)}},
shC(a){this.d=A.j(a)},
sh3(a){this.r=A.aO(a)}}
A.f2.prototype={
$2(a,b){var s=this.a,r=s.x.h(0,new A.y(this.b,a)),q=r.a
return s.cZ(q,0,q.length,r.b,b,this.c)},
$S:23}
A.f1.prototype={
$1(a){var s,r,q=this.a,p=q.x.h(0,new A.y(this.b,a))
if(p==null)return B.v
if(q.r&&p.d===0&&p.e===0){q=p.c
s=p.a
r=A.jd(q,s,0,s.length,p.b)
p.d=r.a
p.e=r.b}return new A.y(p.d,p.e)},
$S:24}
A.f_.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.f0.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.fl.prototype={
hh(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
hI(a){var s=this
if(s.b.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.fP.prototype={}
A.el.prototype={
al(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
hk(a){var s,r,q=this,p=a-q.c
if(p>=0&&p<4){s=q.d
if(!(p>=0&&p<4))return A.a(s,p)
r=s[p]
if(r!==255){s=q.x
if(!(r<4))return A.a(s,r)
return new A.y(s[r],q.y[r])}}return B.v},
dg(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdH()},
gcV(){var s=this.Q
return s===$?this.Q=B.a.J(this.a+16-1,16):s},
gdH(){var s,r,q=this,p=q.as
if(p===$){s=q.gcV()
r=B.a.J(q.b+16-1,16)
q.as!==$&&A.T()
p=q.as=s*r}return p},
hG(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdH(),b=d.dg(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.dg(a5.b):-1
if(a2===b)return
for(a0=d.a,s=d.b,r=d.f,q=a2>=0,p=d.e,o=p.length,n=0;n<c;++n){m=b+n
if(!(m>=0&&m<o))return A.a(p,m)
l=p[m]
if(q){m=a2+n
if(!(m<o))return A.a(p,m)
m=p[m]===l}else m=!1
if(m)continue
m=d.gcV()
k=B.a.T(n,m)*16
j=B.a.a_(n,m)*16
i=Math.min(16,a0-k)
h=Math.min(16,s-j)
if(!(l<r.length))return A.a(r,l)
g=r[l]
for(m=i*4,f=0;f<h;++f){e=((j+f)*a0+k)*4
B.d.K(a4,e,e+m,g,f*i*4)}}if(!a){a5.a=a1
a5.b=a3}}}
A.fQ.prototype={
$0(){return A.h([],t.t)},
$S:26}
A.aC.prototype={
gR(a){var s=this
return s.a>=s.c||s.b>=s.d},
hs(a){var s=this
return new A.aC(s.a-a,s.b-a,s.c+a,s.d+a)},
bz(a){var s=this
return new A.aC(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.be.prototype={
bc(a){var s=$.l!=null
if(s)this.b=A.aN(a*4)
else this.c=new Int32Array(a)},
gv(){var s=this.b
if(s!=null)s=A.e4(t.a.a(A.w($.l.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
az(a,b){var s,r,q,p,o=this,n=o.b
if(n!=null){s=A.aN(a*4)
r=A.e4(t.a.a(A.w($.l.memory).buffer),s,a)
if(b>0)B.e.C(r,0,b,o.gv())
n=$.l
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
a0(){var s=this.b
if(s!=null){$.l.free(s)
this.b=null}}}
A.b3.prototype={
gv(){var s=this.c
if(s!=null)s=A.jt(t.a.a(A.w($.l.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
az(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.f(A.at("Cannot resize a borrowed pixel buffer"))
s=n.c
if(s!=null){r=A.aN(a*4)
q=A.jt(t.a.a(A.w($.l.memory).buffer),r,a)
if(b>0)B.j.C(q,0,b,n.gv())
s=$.l
s.toString
p=n.c
p.toString
s.free(p)
n.c=r
n.b=a}else{o=new Uint32Array(a)
if(b>0){s=n.d
s.toString
B.j.C(o,0,b,s)}n.d=o
n.b=a}},
a0(){var s,r,q=this
if(q.a&&q.c!=null){s=$.l
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.fo.prototype={
hD(a,b,c,d,e,f,g,h,i,j,k,a0,a1){var s,r,q,p,o,n,m,l=this;++l.f
s=(j-h)*(k-i)
if(e<2||f===0||a0.b==null||s>262144)return-2
if(s>l.e)l.e=s
r=l.c
if(e>r){if(r>0){$.l.free(l.r)
$.l.free(l.w)}r=e*2
l.c=r
l.r=A.aN(r*8)
l.w=A.aN(l.c*8)}r=l.d
if(f>r){if(r>0){$.l.free(l.x)
$.l.free(l.y)}r=f*2
l.d=r
l.x=A.aN(r*4)
l.y=A.aN(l.d*4)}r=t.a
B.f.C(A.js(r.a(A.w($.l.memory).buffer),l.r,l.c),0,e,a)
B.f.C(A.js(r.a(A.w($.l.memory).buffer),l.w,l.c),0,e,b)
B.e.C(A.e4(r.a(A.w($.l.memory).buffer),l.x,l.d),0,f,c)
B.e.C(A.e4(r.a(A.w($.l.memory).buffer),l.y,l.d),0,f,d)
q=new A.fq(l,f,h,i,j,k,g,a0)
p=q.$0()
while(p===-1){o=a0.b
if(o!=null){n=r.a(A.w($.l.memory).buffer)
m=a0.a
o=new Int32Array(n,o,m)}else{o=a0.c
o.toString}a0.az(o.length*2,0)
p=q.$0()}return p},
hJ(){if($.fp!==this){this.a0()
return}var s=$.cS-1
$.cS=s
if(s>0)return
$.cS=0
$.fp=null
this.a0()},
a0(){var s=this,r=s.a
if(r!==0)$.l.fl_dense_free(r)
$.l.free(s.b)
if(s.c>0){$.l.free(s.r)
$.l.free(s.w)
s.w=s.r=s.c=0}if(s.d>0){$.l.free(s.x)
$.l.free(s.y)
s.y=s.x=s.d=0}}}
A.fq.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=$.l
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
return A.dG(j,"fl_dense_raster",[s.a,r,q,p,o,k.b,k.c,k.d,k.e,k.f,n,l,m.gv().length/2|0,s.b],t.S)},
$S:3}
A.iu.prototype={
$8(a,b,c,d,e,f,g,h){this.a.V(g,h,a,b,c,d,e,f,this.b)},
$S:15}
A.i8.prototype={
hj(a,b,c,d,e,f,g){var s,r=!0
if(g.gR(0)){s=a.f
if(s!==0)if(s<=1024){r=a.r
r=r===0||r>128}}if(r)return!1
r=this.f
if(r==null)r=this.f=new A.by(new Float64Array(256))
r.aJ(a.f*4)
g.cl(a.r*2)
for(;;)return!1}}
A.cj.prototype={
geT(){var s=this.a
return s}}
A.fy.prototype={
gdf(){var s=this
if(!s.Q&&s.b){s.Q=!0
s.z=A.mK()}return s.z},
aN(a,b,c,d,e,f,g){var s,r,q,p,o=this,n=o.gdf()
if(n!=null){s=a.f
if(s>4096||a.r>256)o.as=!0
r=n.f
q=n.hD(a.a,a.b,a.c,a.d,s,a.r,b,d,e,f,g,c.a,!0)
o.r=o.r+(n.f-r)
if(q>=0){p=A.e4(t.a.a(A.w($.l.memory).buffer),n.b,4)
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
return}}s=o.ch;(s==null?o.ch=A.ks(256):s).hE(a,b,c,d,e,f,g)},
fC(a,b,c,d,e,f,g,h,i,j,k,l){var s
if(this.gdf()!=null)s=l===0
else s=!0
if(s)return!1
return!1},
ds(a,b){var s=this.at,r=s.A(0,a)
if(r==null)return null
if(r.b.G(0,b)){s.q(0,a,r)
return r.c}this.ax=this.ax-r.d
r.c.a.a0()
return null},
c0(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.at
r=s.$ti.i("P<1>")
for(;;){if(!(m.ax+l>1048576||s.a>=256))break
q=new A.P(s,r).gD(0)
if(!q.t())A.r(A.ae())
p=s.A(0,q.gB())
m.ax=m.ax-p.d
o=p.c.a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}r=m.ay
r.toString
o=Math.max(1,c.b)*2
n=new A.be(o)
n.bc(o)
n=new A.aJ(n)
n.e1(c)
s.q(0,a,new A.bX(r,b,n,l))
m.ax+=l},
dA(a,b){var s,r,q,p=this.y2,o=p.A(0,a)
if(o!=null){p.q(0,a,o)
return o.b}if(p.a>=512)p.A(0,new A.P(p,p.$ti.i("P<1>")).ga5(0))
s=this.fx
s.l(0)
A.it(a,b,0.01,s)
r=Math.max(1,s.f)
q=A.d_(Math.max(1,s.r),r)
B.f.C(q.a,0,s.f,s.a)
B.f.C(q.b,0,s.f,s.b)
B.e.C(q.c,0,s.r,s.c)
B.e.C(q.d,0,s.r,s.d)
B.d.C(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
r=this.ay
r.toString
p.q(0,a,new A.ag(r,q,t.b3))
return q},
fd(a){var s=this.bw,r=s.A(0,a)
if(r==null)return null
s.q(0,a,r)
return r.b},
gb_(){var s=this.CW
if(s==null){s=new A.be(2048)
s.bc(2048)
s=this.CW=new A.aJ(s)}return s},
gbO(){var s=this.cx
if(s==null){s=new A.be(2048)
s.bc(2048)
s=this.cx=new A.aJ(s)}return s},
gbp(){var s=this.cy
if(s==null){s=new A.be(2048)
s.bc(2048)
s=this.cy=new A.aJ(s)}return s},
gdB(){var s,r,q=this.R8
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.R8=new A.i8(this.p4,new A.by(q),new A.by(s),new A.by(r),new A.by(new Float64Array(256)))}return q},
fc(a,b,c,d){var s=this,r=s.ok,q=!1
if(a<r.length)if(r[a]===b){r=s.p1
if(!(a<r.length))return A.a(r,a)
if(r[a]===c){r=s.p2
if(!(a<r.length))return A.a(r,a)
r=r[a]===d}else r=q}else r=q
else r=q
if(r){r=s.k4
if(!(a<r.length))return A.a(r,a)
return r[a]}return null},
fA(a,b,c,d){var s,r,q
for(s=this.ok,r=this.p1,q=this.p2;s.length<=a;){B.b.m(s,null)
B.b.m(r,0/0)
B.b.m(q,0/0)}B.b.q(s,a,b)
B.b.q(r,a,c)
B.b.q(q,a,d)},
eK(a,b){var s,r,q,p
for(s=this.k4;s.length<=a;){r=Math.max(16,b)
B.b.m(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.b.q(s,a,q)}return q},
eM(a){var s,r,q,p,o
for(s=this.fy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.am(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eL(a){var s,r,q,p,o
for(s=this.go;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.am(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
aq(a){var s,r,q
for(s=this.RG;s.length<=a;){r=new A.be(2048)
q=$.l!=null
if(q)r.b=A.aN(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aJ(r))}s=s[a]
s.l(0)
return s},
eJ(a){var s,r,q,p,o
for(s=this.id;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.am(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eI(a){var s,r,q,p,o
for(s=this.k1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.am(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
d5(a){var s
for(s=this.k2;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
eH(a){var s,r,q,p,o
for(s=this.rx;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.am(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eG(a){var s,r,q,p,o
for(s=this.ry;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.am(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cO(a){var s,r,q
for(s=this.to;s.length<=a;){r=new A.be(2048)
q=$.l!=null
if(q)r.b=A.aN(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aJ(r))}return s[a]},
eF(a){var s,r,q
for(s=this.x1;s.length<=a;){r=new A.be(2048)
q=$.l!=null
if(q)r.b=A.aN(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aJ(r))}return s[a]},
fF(){var s,r,q,p,o
for(s=this.cm,r=new A.aR(s,s.r,s.e,s.$ti.i("aR<2>"));r.t();){q=r.d.b
if(q.a&&q.c!=null){p=$.l
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.l(0)},
ct(a){var s=this,r=a.a,q=s.ok
B.b.ac(q,0,q.length,null)
s.at.bC(0,new A.fz(s,r))
s.y2.bC(0,new A.fA(r))
s.bw.bC(0,new A.fB(r))
s.cm.bC(0,new A.fC(r))},
eh(){var s,r,q,p=this,o=p.ok
B.b.ac(o,0,o.length,null)
for(o=p.at,s=new A.aR(o,o.r,o.e,o.$ti.i("aR<2>"));s.t();){r=s.d.c.a
q=r.b
if(q!=null){$.l.free(q)
r.b=null}}o.l(0)
p.ax=0
p.y2.l(0)
p.bw.l(0)
p.fF()},
a0(){var s,r,q,p,o,n,m=this
m.eh()
s=m.aQ
if(s!=null)s.a0()
m.aQ=null
s=m.bx
if(s!=null)s.a0()
m.bx=null
s=m.z
if(s!=null)s.hJ()
m.z=null
s=m.CW
if(s!=null)s.a.a0()
s=m.cx
if(s!=null)s.a.a0()
s=m.cy
if(s!=null)s.a.a0()
m.CW=m.cx=m.cy=null
for(s=m.to,r=s.length,q=0;q<s.length;s.length===r||(0,A.a_)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}for(r=m.x1,p=r.length,q=0;q<r.length;r.length===p||(0,A.a_)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}B.b.l(s)
B.b.l(r)
B.b.l(m.rx)
B.b.l(m.ry)
for(s=m.RG,r=s.length,q=0;q<s.length;s.length===r||(0,A.a_)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}B.b.l(s)
m.dn()
m.ch=null},
ek(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.xr=0
if(a){i.y1=0
i.as=!1}s=i.z
if(s!=null)r=a||s.e>65536||s.c>8192||s.d>512
else r=!1
if(r){if(s.e>65536){$.l.fl_dense_trim(s.a,65536)
s.e=0}if(s.c>8192){$.l.free(s.r)
$.l.free(s.w)
s.w=s.r=s.c=0}if(s.d>512){$.l.free(s.x)
$.l.free(s.y)
s.y=s.x=s.d=0}}if(a){r=i.aQ
if(r!=null)r.a0()
i.aQ=null
i.dn()
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
B.b.l(i.e4)
i.R8=null}else{for(r=i.x2,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
if(n!=null)if(p<5){o=n.c
if(o!=null){m=q.a(A.w($.l.memory).buffer)
l=n.b
o=new Uint32Array(m,o,l)}else{o=n.d
o.toString}o=o.length>262144}else o=!0
else o=!1
if(o){if(n.a&&n.c!=null){o=$.l
o.toString
m=n.c
m.toString
o.free(m)
n.c=null}B.b.q(r,p,null)}}if(o>5)B.b.sk(r,5)
r=i.fy
q=r.length
B.b.b6(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.a_)(r),++k)r[k].ag()
r=i.go
q=r.length
B.b.b6(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.a_)(r),++k)r[k].ag()
r=i.id
q=r.length
B.b.b6(r,Math.min(2,q),q)
q=i.k1
r=q.length
B.b.b6(q,Math.min(2,r),r)
for(r=q.length,k=0;k<q.length;q.length===r||(0,A.a_)(q),++k)q[k].ag()
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
if(a){for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.a_)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.l.free(m)
o.b=null}}B.b.l(r)}else for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.a_)(r),++k)r[k].ag()
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
hR(){return this.ek(!1)},
dn(){var s,r,q,p,o,n
for(s=this.x2,r=s.length,q=0;q<s.length;s.length===r||(0,A.a_)(s),++q){p=s[q]
if(p!=null)if(p.a&&p.c!=null){o=$.l
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
if(r==null){q=A.fs(b)
B.b.q(s,a,q)
return q}if(r.gv().length<b)r.az(b,0)
return r},
c4(a){var s
for(s=this.e4;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
sfJ(a){this.ay=t.g_.a(a)}}
A.fz.prototype={
$2(a,b){var s
A.b_(a)
t.az.a(b)
if(b.a!==this.b)return!1
s=this.a
s.ax=s.ax-b.d
b.c.a.a0()
return!0},
$S:28}
A.fA.prototype={
$2(a,b){A.b_(a)
return t.b3.a(b).a===this.a},
$S:29}
A.fB.prototype={
$2(a,b){A.b_(a)
return t.e.a(b).a===this.a},
$S:30}
A.fC.prototype={
$2(a,b){t.cK.a(a)
t.dL.a(b)
if(b.a!==this.a)return!1
b.b.a0()
return!0},
$S:31}
A.ag.prototype={}
A.bX.prototype={}
A.ix.prototype={
$2(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.a
a0.l(0)
s=a.b
s.l(0)
r=a.c
A.it(a1.a,r,a.d,a0)
q=a.e
p=a.f
o=a.r
n=a.w
m=a.x
l=a.y
s.aH(a0,q,p,o,n,m,l)
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
A.nX(a0,e,a.ay,d,k.gdB())
s.l(0)
s.aH(d,q,p,o,n,m,l)
c=k.aq(3)
b=k.aq(4)
k.aN(s,!1,c,j,i,h,g)
a2.aV(b)
A.d2(b,c,a2,e>0?2:3)},
$S:32}
A.c.prototype={
dP(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.dP(a)
s=this.b
if(A.o(s))a.a+="["+A.x(s)+"]"
else{r="."+A.x(s)
a.a+=r}},
u(a){var s,r=new A.ck("")
this.dP(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bF.prototype={
gdX(){var s,r,q=this,p=q.r
if(p===$){s=q.b
s===$&&A.E()
r=q.c
r===$&&A.E()
p=q.r=new A.aC(0,0,0+s,0+r)}return p},
gI(){var s,r=this,q=r.z
if(q===$){s=B.b.ab(r.w,new A.hf(r))
r.z!==$&&A.T()
r.z=s
q=s}return q},
j(a,b){return A.r(new A.fU(b+" at "+a.u(0),null,null))},
aw(a,b,c){if(!t.P.b(b))this.j(c,"Expected object")
return b},
bA(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.o(c)){s=new A.c(b,c)
break A}if(typeof c=="string"){s=new A.c(b,c)
break A}s=b
break A}this.j(s,"Expected finite number")}return a},
S(a,b){return this.bA(a,b,null)},
O(a,b,c){var s,r
t.P.a(a)
t.k.a(c)
for(s=a.gav(),s=s.gD(s);s.t();){r=s.gB()
if(!c.al(0,r))this.j(new A.c(b,r),"Unsupported field")}},
en(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.m(a.h(0,b),0)&&!J.m(a.h(0,b),!1))this.j(new A.c(c,b),"Unsupported nonzero "+b)},
e_(f8,f9,g0,g1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4=this,e5=null,e6="ip",e7="op",e8="Expected object",e9="layers",f0="hasMask",f1="tp",f2="td",f3="masksProperties",f4="shapes",f5="refId",f6="parent",f7=t.P
f7.a(f8)
t.cq.a(f9)
t.k.a(g0)
t.aM.a(g1)
e4.O(f8,B.i,B.aU)
e4.en(f8,"ddd",B.i)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=f8.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.j8(n)))m=!(n instanceof A.J&&n.gR(n))
if(m)e4.j(new A.c(B.i,o),"Unsupported "+o)}e4.b=e4.S(f8.h(0,"w"),new A.c(B.i,"w"))
e4.c=e4.S(f8.h(0,"h"),new A.c(B.i,"h"))
e4.d=e4.S(f8.h(0,e6),new A.c(B.i,e6))
e4.e=e4.S(f8.h(0,e7),new A.c(B.i,e7))
s=e4.S(f8.h(0,"fr"),new A.c(B.i,"fr"))
e4.f=s
l=e4.e-e4.d
if(e4.b<=0||e4.c<=0||s<=0||l<=0||l>2147483647)e4.j(B.i,"Invalid bounds/timing")
s=f9==null
k=s?A.a8(t.N,f7):f9
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){j=s[p]
i=f8.h(0,j)
if(i==null)i=[]
if(!q.b(i))e4.j(new A.c(B.i,j),"Expected asset definitions")
for(m=J.cD(i);m.t();){h=m.gB()
if(!f7.b(h))e4.j(new A.c(B.i,j),e8)
g=h.h(0,"id")
if(typeof g!="string")e4.j(new A.c(B.i,j),"Expected asset id")
k.q(0,g,h)}}f=f8.h(0,e9)
if(!q.b(f))e4.j(B.n,"Expected layers")
e=g1==null?A.a8(t.bP,t.G):g1
d=new A.i5(e4,f,new A.ak(t.gt),new A.c0(t.ai))
s=t.S
r=t.D
c=A.a8(s,r)
b=A.a8(r,s)
s=A.h([],t.f)
a=new A.hl(e4,s)
a0=A.a8(r,t.eG)
for(r=J.R(f),m=e4.w,a1=t.n,a2=t.r,a3=t.V,a4=t.c2,a5=e4.a,a6=t.N,a7=t.z,a8=0;a8<r.gk(f);++a8){a9=new A.c(B.n,a8)
b0=r.h(f,a8)
if(!f7.b(b0))e4.j(a9,e8)
e4.O(b0,a9,B.aT)
b1=b0.h(0,"bm")
if(b1==null)b1=0
if(!A.o(b1)||b1<0||b1>16)e4.j(new A.c(a9,"bm"),"Blend mode "+A.x(b1))
for(b2=["ddd","ao"],b3=b2.length,p=0;p<b3;++p)e4.en(b0,b2[p],a9)
if(b0.h(0,f0)!=null&&!A.b1(b0.h(0,f0))&&!J.m(b0.h(0,f0),0)&&!J.m(b0.h(0,f0),1))e4.j(new A.c(a9,f0),"Expected boolean hasMask")
b4=b0.h(0,"tt")
if(b4==null)b4=0
if(!A.o(b4)||b4<0||b4>4)e4.j(new A.c(a9,"tt"),"Matte type")
if(b0.h(0,f1)!=null&&!J.m(b0.h(0,f1),0)){b2=!0
if(b4!==0)if(a8!==0){b2=b0.h(0,f1)
b3=a8-1
b5=J.aj(r.h(f,b3),"ind")
b2=!J.m(b2,b5==null?b3:b5)}if(b2)e4.j(new A.c(a9,f1),"Unsupported nonzero tp")}if(b0.h(0,f2)!=null&&!J.m(b0.h(0,f2),0)&&!J.m(b0.h(0,f2),1))e4.j(new A.c(a9,f2),"Matte source flag")
b6=e4.eS(b0.h(0,f3),new A.c(a9,f3))
f7.a(b0)
a.fY(b0,q.a(q.b(b0.h(0,f4))?b0.h(0,f4):B.C),a9,s)
b2=b0.h(0,"sr")
if(b2==null)b2=1
b7=e4.S(b2,new A.c(a9,"sr"))
if(b7===0)e4.j(new A.c(a9,"sr"),"Invalid zero time stretch")
b8=b0.h(0,"ty")
b2=J.aH(b8)
if(!b2.G(b8,4)&&!b2.G(b8,3)&&!b2.G(b8,0)&&!b2.G(b8,1))e4.j(new A.c(a9,"ty"),"Layer type "+A.x(b8))
b9=e4.f1(b0.h(0,"ef"),new A.c(a9,"ef"),f)
c0=b9.a
c1=b9.b
c2=e4.fg(b0.h(0,"sy"),new A.c(a9,"sy"))
if(c2!=null&&c0!=null)e4.j(new A.c(a9,"ef"),"Fill with Inner Shadow")
b3=c1==null
b5=!b3
if(b5)c3=!b2.G(b8,4)||b4!==0||b1!==0
else c3=!1
if(c3)e4.j(c1.b,"Set Matte requires a normal shape layer without a track matte")
c4=e4.dK(b0.h(0,"ks"),new A.c(a9,"ks"))
if(b2.G(b8,4))c5=e4.d4(b0.h(0,f4),new A.c(a9,f4),d)
else if(b2.G(b8,1)){c3=b0.h(0,"sw")
if(c3==null)c3=0
c6=e4.S(c3,new A.c(a9,"sw"))
c3=b0.h(0,"sh")
if(c3==null)c3=0
c7=e4.S(c3,new A.c(a9,"sh"))
c8=b0.h(0,"sc")
if(typeof c8!="string"||!B.p.ew(c8,"#"))e4.j(new A.c(a9,"sc"),"Invalid solid color")
c9=A.lC(B.p.ey(c8,1),16)
c3=B.a.L(c9,16)
d0=B.a.L(c9,8)
d1=new Float32Array(A.ad(A.h([c6*0.5,c7*0.5],a1)))
d2=$.bv()
d3=new A.Y(new A.aZ(!1,!1,new A.F(d1,e5,!1,d2,!1),new A.F(new Float32Array(A.ad(A.h([c6,c7],a1))),e5,!1,d2,!1),new A.F(new Float32Array(A.ad(A.h([0],a1))),e5,!1,d2,!1)))
d4=new A.F(new Float32Array(A.ad(A.h([(c3&255)/255,(d0&255)/255,(c9&255)/255],a1))),e5,!1,d2,!1)
d4.f=!0
d0=new Float32Array(A.ad(A.h([100],a1)))
c3=new Float32Array(A.ad(A.h([1],a1)))
d5=A.jK(A.h([d3],a2),d4,new A.F(d0,e5,!1,d2,!1),new A.F(c3,e5,!1,d2,!1),!1,!1,1,1,4,e5,e5)
d2=A.h([d3],a2)
c3=A.h([d5],a3)
d0=$.j6()
c5=A.jI(d2,c3,new A.c4(d0,d0,$.j4(),$.j5(),$.j3(),e5,e5,e5,e5))}else c5=e5
if(b2.G(b8,0)){g=b0.h(0,f5)
d6=k.h(0,g)
if(typeof g!="string"||d6==null||!q.b(d6.h(0,e9)))e4.j(new A.c(a9,f5),"Missing precomposition")
if(g0.al(0,g))e4.j(new A.c(a9,f5),"Cyclic precomposition")
b2=b0.h(0,"w")
if(b2==null)b2=e4.b
d7=e4.S(b2,new A.c(a9,"w"))
b2=b0.h(0,"h")
if(b2==null)b2=e4.c
d8=e4.S(b2,new A.c(a9,"h"))
d9=new A.aF(g,d7,d8)
e0=e.h(0,d9)
if(e0==null){e0=A.jG(a5)
b2=A.mE(["w",d7,"h",d8,"ip",0,"op",e4.e-e4.d,"fr",e4.f,"layers",d6.h(0,e9)],a6,a7)
c3=A.mF(a6)
c3.ak(0,g0)
c3.m(0,g)
e0.e_(b2,k,c3,e)
e.q(0,d9,e0)
e1=e0}else e1=new A.ez(new A.ak(a4)).cE(e0)
e4.x=e4.x+e1.x
e4.y=B.u.bH(e4.y,e1.y)}else e1=e5
e2=b0.h(0,"tm")!=null?e4.M(b0.h(0,"tm"),new A.c(a9,"tm"),1,A.h([0],a1)):e5
b2=b0.h(0,e6)
if(b2==null)b2=e4.d
b2=e4.S(b2,new A.c(a9,e6))
c3=b0.h(0,e7)
if(c3==null)c3=e4.e
c3=e4.S(c3,new A.c(a9,e7))
d0=J.m(b0.h(0,"hd"),!0)
d1=b0.h(0,"st")
if(d1==null)d1=0
d1=e4.S(d1,new A.c(a9,"st"))
e3=A.kU(c4,c5,b2,c3,d0,b1,e1,c0,c2,b6,b3?b4:1,d1,b7,e2,b5)
if(b5)a0.q(0,e3,c1)
B.b.m(m,e3)
g=b0.h(0,"ind")
if(g==null)g=a8
if(!A.o(g)||c.aI(g))e4.j(new A.c(a9,"ind"),"Invalid/duplicate layer id")
c.q(0,g,e3)
if(b0.h(0,f6)!=null){if(!A.o(b0.h(0,f6)))e4.j(new A.c(a9,f6),"Invalid parent id")
b.q(0,e3,A.j(b0.h(0,f6)))}}e4.fi(f,c,a0)
e4.fj(c,b)},
h2(a){return this.e_(a,null,B.aZ,null)},
eS(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null,f="pt"
if(a==null)return g
if(!t.j.b(a))h.j(b,"Expected list")
s=J.R(a)
if(s.gR(a))return g
r=A.h([],t.bE)
for(q=t.n,p=t.P,o=0;o<s.gk(a);++o){n=new A.c(b,o)
m=s.h(a,o)
if(!p.b(m))h.j(n,"Expected object")
h.O(m,n,B.aS)
l=J.m(m.h(0,"inv"),!0)
k=A.im(m.h(0,"mode"))
if(k==null)k="a"
if(!B.b_.al(0,k))h.j(new A.c(n,"mode"),"Unsupported mask mode "+k)
if(m.h(0,f)==null)h.j(new A.c(n,f),"Missing mask path")
j=h.dk(m.h(0,f),new A.c(n,f))
i=m.h(0,"o")!=null?h.M(m.h(0,"o"),new A.c(n,"o"),1,A.h([100],q)):new A.F(new Float32Array(A.ad(A.h([100],q))),g,!1,$.bv(),!1)
B.b.m(r,new A.ac(j,k,i,l,m.h(0,"x")!=null?h.M(m.h(0,"x"),new A.c(n,"x"),1,A.h([0],q)):g))}return r},
fi(a,b,c){var s,r,q,p,o,n,m,l,k,j=this
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
j.x+=4}}for(p=new A.bR(c,A.n(c).i("bR<1,2>")).gD(0);p.t();){n=p.d
m=n.a
l=n.b
o=b.h(0,l.a)
k=!0
if(o!=null)if(o.b!=null)if(!o.e)k=o!==m&&o.y!==0
if(k)j.j(l.b,"Set Matte requires a visible shape source without its own matte")
m.ay=o
j.x+=4}for(p=J.R(a),r=0;r<s.length;++r){if(J.m(J.aj(p.h(a,r),"td"),1)){if(!(r<s.length))return A.a(s,r)
k=!s[r].ch}else k=!1
if(k)j.j(new A.c(new A.c(B.n,r),"td"),"Unpaired matte source")}},
fj(a,b){var s,r,q,p,o,n,m,l,k
t.B.a(a)
t.gq.a(b)
for(s=new A.bR(b,A.n(b).i("bR<1,2>")).gD(0);s.t();){r=s.d
q=r.b
p=a.h(0,q)
if(p==null)this.j(B.n,"Missing parent "+q)
r.a.cy=p}for(s=this.w,q=s.length,o=t.D,n=0;n<s.length;s.length===q||(0,A.a_)(s),++n){m=s[n]
l=A.fk(o)
for(k=m;k!=null;k=k.cy)if(!l.m(0,k))this.j(B.n,"Cyclic parenting")}},
aA(a){var s,r,q,p,o,n,m,l,k,j,i
for(s=this.w,r=s.length-1,q=null;r>=0;--r){if(!(r<s.length))return A.a(s,r)
p=s[r]
if(!p.ch){if(!p.e)o=(p.b!=null||p.f!=null)&&a>=p.c&&a<p.d
else o=!1
o=!o}else o=!0
if(o)continue
o=p.a.e.n(a)
if(0>=o.length)return A.a(o,0)
if(B.c.H(B.a.F(B.c.N(255*B.c.H(o[0])/100),0,255)*p.aT(a)/255)===0)continue
n=p.ay
m=p.aA(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.n(a)
if(0>=o.length)return A.a(o,0)
k=B.c.H(B.a.F(B.c.N(255*B.c.H(o[0])/100),0,255)*n.aT(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.aA(a)
if(j==null)continue
m=m.bz(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.c7(q,m)}if(q==null)return null
i=q.bz(this.gdX())
return i.gR(0)?null:i},
dK(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.a8(t.N,t.z):i.aw(0,a,b)
i.O(g,b,B.b5)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.j(new A.c(b,p),"3D transform")}s=t.n
o=i.M(g.h(0,"sk"),new A.c(b,"sk"),1,A.h([0],s))
n=i.M(g.h(0,"sa"),new A.c(b,"sa"),1,A.h([0],s))
m=g.h(0,h)
if(m instanceof A.J&&J.m(m.h(0,"s"),!0)){l=i.aw(0,m,new A.c(b,h))
i.O(l,new A.c(b,h),B.aW)
k=i.M(l.h(0,"x"),new A.c(new A.c(b,h),"x"),1,A.h([0],s))
j=i.M(l.h(0,"y"),new A.c(new A.c(b,h),"y"),1,A.h([0],s))
m=null}else{k=null
j=null}return A.jL(i.M(g.h(0,"a"),new A.c(b,"a"),2,A.h([0,0],s)),i.M(m,new A.c(b,h),2,A.h([0,0],s)),i.fV(g.h(0,"s"),new A.c(b,"s"),2,A.h([100,100],s),100),i.M(g.h(0,"r"),new A.c(b,"r"),1,A.h([0],s)),i.M(g.h(0,"o"),new A.c(b,"o"),1,A.h([100],s)),k,j,o,n)},
f1(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aL
if(!b0.b(b1))a4.j(b2,"Expected effects array")
for(s=J.bb(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.R(b1),n<m.gk(b1);++n){l=new A.c(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.j(new A.c(b2,n),a5)
a4.O(m,l,B.b1)
k=J.m(m.h(0,a6),21)&&J.m(m.h(0,a7),"ADBE Fill")
j=J.m(m.h(0,a6),28)&&J.m(m.h(0,a7),"ADBE Set Matte3")
i=J.m(m.h(0,a6),5)&&J.m(m.h(0,a7),"ADBE Layer Control")
h=!k
if(h&&!j&&!i)a4.j(l,"Unsupported visual effect")
if(J.m(m.h(0,a8),0)||J.m(m.h(0,a8),!1))continue
if(m.h(0,a8)!=null&&!J.m(m.h(0,a8),1)&&!J.m(m.h(0,a8),!0))a4.j(new A.c(l,a8),"Invalid effect enabled flag")
if(!h||j){if(p!=null||o!=null)a4.j(l,"Multiple visual effects")
g=k?B.ab:B.ae
f=m.h(0,a9)
if(!b0.b(f)||J.ap(f)!==g.length)a4.j(new A.c(l,a9),"Invalid effect parameters")
e=new A.h5(a4,l,f,g)
d=new A.h6(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.ey(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aG,B.aH,B.aI,B.aJ,B.aK],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.n(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.c(new A.c(new A.c(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.ei(a0))a4.j(a1,"Expected a static layer index")
o=new A.y(B.c.N(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.ap(a2)!==1)a4.j(l,"Invalid layer control")
m=J.kh(a2)
if(!q.b(m))a4.j(new A.c(new A.c(l,a9),0),a5)
a4.O(m,new A.c(new A.c(l,a9),0),B.H)
if(!J.m(m.h(0,a6),10)||!J.m(m.h(0,a7),"ADBE Layer Control-0001"))a4.j(l,"Unsupported effect control")
a=a4.M(m.h(0,"v"),new A.c(new A.c(new A.c(l,a9),0),"v"),1,A.h([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.ei(a0))h=a0!==0&&!s.au(b3,new A.h4(a0))
else h=!0
if(h)a4.j(l,"Missing layer control target")}}return new A.y(p,o)},
fg(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.j8(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.ap(a)!==1)d.j(b,"Expected one Inner Shadow style")
r=new A.c(b,0)
q=d.aw(0,J.kh(a),r)
if(!J.m(q.h(0,"ty"),2))d.j(new A.c(r,"ty"),"Unsupported layer style")
d.O(q,r,B.aQ)
p=new A.hb(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.m(p.$2(m,0),0))d.j(new A.c(r,m),"Unsupported Inner Shadow parameter")}if(!J.m(p.$2("bm",1),1))d.j(new A.c(r,"bm"),"Inner Shadow requires Multiply")
l=d.M(q.h(0,"c"),new A.c(r,"c"),3,A.h([0,0,0],t.n))
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
return A.kT(-s*h,o*h,(j<<24|f<<16|e<<8|B.a.F(B.c.H(k[2]*255),0,255))>>>0)},
dk(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b={}
b.a=b.b=null
b.c=!1
s=c.dJ(a,a0,-1,A.h([],t.n),new A.hc(b,c,a))
r=A.h([],t.hg)
q=s.b
if(q!=null&&b.c){p=b.a
p.toString
o=q.a.length
n=A.jr(o,!1,!1,t.y)
m=b.b
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
B.b.m(r,new A.y(e,d))}}c.x=c.x+(s.gcz()/6|0)
p=b.b
return new A.aE(s,p!==!1,r)},
d4(e3,e4,e5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7=this,d8=null,d9="ks",e0="d",e1="Path direction",e2="r"
if(!t.j.b(e3))d7.j(e4,"Expected shape list")
s=t.r
r=A.h([],s)
q=A.h([],t.V)
for(p=t.P,o=t.aT,n=t.eU,m=n.i("k.E"),l=t.n,k=t.u,j=t.S,i=t.W,h=t.fq,g=t.bs,f=t.fP,e=d8,d=0;c=J.R(e3),d<c.gk(e3);++d){b=new A.c(e4,d)
a=c.h(e3,d)
if(!p.b(a))d7.j(b,"Expected object")
a0=a.h(0,"ty")
a1=a.h(0,"bm")
if(a1==null)a1=0
if(!A.o(a1)||a1<0||a1>16)d7.j(new A.c(b,"bm"),"Blend mode "+A.x(a1))
a2=J.m(a.h(0,"hd"),!0)
switch(a0){case"tr":if(e!=null||d!==c.gk(e3)-1)d7.j(b,"Transform must be last and unique")
e=d7.dK(a,b)
break
case"gr":d7.O(a,b,B.aV)
a3=d7.d4(a.h(0,"it"),new A.c(b,"it"),e5)
if(!a2){B.b.m(r,a3)
B.b.m(q,a3)}break
case"sh":d7.O(a,b,B.aX)
if(a.h(0,d9)==null)d7.j(new A.c(b,d9),"Missing path data")
a4=e5.cC(a.h(0,d9),new A.c(b,d9))
if(!a2)B.b.m(r,new A.Y(a4))
break
case"rc":case"el":d7.O(a,b,B.b2)
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a5=d7.b0(a.h(0,"p"),new A.c(b,"p"),2,A.h([0,0],l),!0)
a6=d7.b0(a.h(0,"s"),new A.c(b,"s"),2,A.h([0,0],l),!0)
a7=d7.M(a.h(0,e2),new A.c(b,e2),1,A.h([0],l))
d7.x+=8
if(!a2)B.b.m(r,new A.Y(new A.aZ(J.m(a0,"el"),J.m(a.h(0,e0),3),a5,a6,a7)))
break
case"sr":d7.O(a,b,B.b0)
a8=a.h(0,"sy")
if(a8==null)a8=1
c=J.aH(a8)
if(!c.G(a8,1)&&!c.G(a8,2))d7.j(new A.c(b,"sy"),"PolyStar type "+A.x(a8))
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a9=d7.M(a.h(0,"pt"),new A.c(b,"pt"),1,A.h([5],l))
a5=d7.b0(a.h(0,"p"),new A.c(b,"p"),2,A.h([0,0],l),!0)
b0=d7.M(a.h(0,e2),new A.c(b,e2),1,A.h([0],l))
b1=d7.M(a.h(0,"or"),new A.c(b,"or"),1,A.h([0],l))
b2=d7.M(a.h(0,"os"),new A.c(b,"os"),1,A.h([0],l))
if(c.G(a8,1))b3=a.h(0,"ir")!=null?d7.M(a.h(0,"ir"),new A.c(b,"ir"),1,A.h([0],l)):new A.F(new Float32Array(A.ad(A.h([0],l))),d8,!1,$.bv(),!1)
else b3=d8
if(c.G(a8,1))b4=a.h(0,"is")!=null?d7.M(a.h(0,"is"),new A.c(b,"is"),1,A.h([0],l)):new A.F(new Float32Array(A.ad(A.h([0],l))),d8,!1,$.bv(),!1)
else b4=d8
d7.x+=12
if(!a2)B.b.m(r,new A.Y(new A.b7(c.G(a8,1),J.m(a.h(0,e0),3),a9,a5,b0,b1,b2,b3,b4)))
break
case"tm":d7.O(a,b,B.b4)
b5=a.h(0,"m")
if(b5==null)b5=1
c=J.aH(b5)
if(!c.G(b5,1)&&!c.G(b5,2))d7.j(new A.c(b,"m"),"Trim mode")
b6=A.h([],s)
b7=new A.bI(b6,d7.M(a.h(0,"s"),new A.c(b,"s"),1,A.h([0],l)),d7.M(a.h(0,"e"),new A.c(b,"e"),1,A.h([100],l)),d7.M(a.h(0,"o"),new A.c(b,"o"),1,A.h([0],l)),c.G(b5,2),A.a8(j,i))
if(!a2){b8=A.h([],h)
new A.ha(b8).$1(r)
B.b.ak(b6,new A.a1(b8,g.a(new A.h8()),f))
for(b9=0;b9<b8.length;++b9)b8[b9].a=new A.br(b7,b9)}++d7.x
break
case"fl":case"st":case"gf":case"gs":d7.O(a,b,B.aO)
c=J.aH(a0)
c0=c.G(a0,"st")||c.G(a0,"gs")
if(c0)d7.y=!0
c1=c0?d7.eZ(a.h(0,e0),new A.c(b,e0)):d8
c2=a.h(0,e2)
if(c2==null)c2=1
b6=J.aH(c2)
if(!b6.G(c2,1)&&!b6.G(c2,2))d7.j(new A.c(b,e2),"Fill rule")
c3=a.h(0,"lc")
if(c3==null)c3=1
c4=a.h(0,"lj")
if(c4==null)c4=1
if(!A.o(c3)||c3<1||c3>3||!A.o(c4)||c4<1||c4>3)d7.j(b,"Stroke cap/join")
c5=d7.fU(a.h(0,"c"),new A.c(b,"c"),3,A.h([0,0,0],l),!1)
c5.f=!0
c6=c5.a
if(c6==null)c6=c5.b.e
for(c7=c6.length,c8=c6.$flags|0,c9=0;c9<c7;c9+=3){d0=!0
if(!(c6[c9]>1)){d1=c9+1
if(!(d1<c7))return A.a(c6,d1)
if(!(c6[d1]>1)){d0=c9+2
if(!(d0<c7))return A.a(c6,d0)
d0=c6[d0]>1}}if(d0)for(d2=0;d2<3;++d2){d0=c9+d2
if(!(d0<c7))return A.a(c6,d0)
d1=c6[d0]
c8&2&&A.d(c6)
c6[d0]=d1/255}}d3=d7.M(a.h(0,"o"),new A.c(b,"o"),1,A.h([100],l))
d4=d7.M(a.h(0,"w"),new A.c(b,"w"),1,A.h([1],l))
if(!a2){c7=A.aS(r,k)
b6=b6.G(c2,2)
c8=a.h(0,"ml")
if(c8==null)c8=4
c8=d7.S(c8,new A.c(b,"ml"))
B.b.m(q,A.jK(c7,c5,d3,d4,c0,b6,c3,c4,c8,c1,c.G(a0,"gf")||c.G(a0,"gs")?d7.fe(a,b):d8))}d7.x+=2
break
case"mm":d7.O(a,b,B.aY)
b5=a.h(0,"mm")
if(b5==null)b5=1
if(!A.o(b5)||b5<1||b5>5)d7.j(new A.c(b,"mm"),"Shape op mm mode "+A.x(b5))
if(!a2&&r.length!==0){d5=A.aS(new A.bW(r,o.a(new A.h9()),n),m)
if(d5.length===1)d6=b5===4||r.length>1
else d6=!1
B.b.l(r)
if(d5.length!==0)B.b.m(r,d6?B.b.gaf(d5):new A.aX(d5,b5))}else if(a2)B.b.l(r);++d7.x
break
default:d7.j(new A.c(b,"ty"),"Shape op "+A.x(a0))}}if(e==null){s=$.j6()
s=A.jL(s,s,$.j4(),$.j5(),$.j3(),d8,d8,d8,d8)}else s=e
return A.jI(r,q,s)},
eZ(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.j(b,"Expected dash array")
s=A.h([],t.gC)
for(r=t.n,q=t.P,p=null,o=0;n=J.R(a),o<n.gk(a);++o){m=new A.c(b,o)
n=n.h(a,o)
if(!q.b(n))j.j(new A.c(b,o),"Expected object")
j.O(n,m,B.b3)
l=j.M(n.h(0,"v"),new A.c(m,"v"),1,A.h([0],r))
k=n.h(0,"n")
n=J.aH(k)
if(n.G(k,"o")){if(p!=null)j.j(m,"Duplicate dash offset")
p=l}else if(n.G(k,(s.length&1)===0?"d":"g"))B.b.m(s,l)
else j.j(new A.c(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.b.m(s,B.b.gad(s))
return A.kQ(s,p==null?A.jD(A.h([0],r)):p)},
fe(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.aw(0,a.h(0,"g"),new A.c(b,"g"))
k.O(s,new A.c(b,"g"),B.b6)
r=s.h(0,"p")
if(!A.o(r)||r<=0)k.j(new A.c(new A.c(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dJ(s.h(0,"k"),new A.c(new A.c(b,"g"),"k"),-1,A.h([],q),new A.h7(k,r))
if(!J.m(a.h(0,"t"),1)&&!J.m(a.h(0,"t"),2))k.j(new A.c(b,"t"),"Gradient type")
o=k.b0(a.h(0,"s"),new A.c(b,"s"),2,A.h([0,0],q),!0)
n=k.b0(a.h(0,"e"),new A.c(b,"e"),2,A.h([0,0],q),!0)
m=J.m(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.M(a.h(0,"h"),new A.c(b,"h"),1,A.h([0],q))
return A.kS(r,p,o,n,m,l,a.h(0,"a")==null?null:k.M(a.h(0,"a"),new A.c(b,"a"),1,A.h([0],q)))},
b1(a,b,c,d,e,f,g,h){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return g?A.n7(d):A.jD(d)
s=o.aw(0,a,b)
o.O(s,b,B.I)
if(s.h(0,"a")!=null&&!J.m(s.h(0,"a"),0)&&!J.m(s.h(0,"a"),1))o.j(new A.c(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.m(s.h(0,"x"),""))o.j(new A.c(b,"x"),"Expressions")
r=new A.c(b,"k")
q=s.h(0,"k")
if(!J.m(s.h(0,"a"),1)){if(t.j.b(q)){p=J.R(q)
p=p.gcq(q)&&p.ga5(q) instanceof A.J&&J.aj(p.ga5(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p)return new A.F(o.bk(q,r,c,h,e,null,0,0),null,!1,$.bv(),!1)
if(!t.j.b(q)||J.j8(q))o.j(r,"Expected keyframes")
return o.eQ(q,r,c,h,f,e)},
M(a,b,c,d){return this.b1(a,b,c,d,null,!1,!0,0)},
b0(a,b,c,d,e){return this.b1(a,b,c,d,null,e,!0,0)},
fU(a,b,c,d,e){return this.b1(a,b,c,d,null,!1,e,0)},
dJ(a,b,c,d,e){return this.b1(a,b,c,d,e,!1,!0,0)},
fV(a,b,c,d,e){return this.b1(a,b,c,d,null,!1,!0,e)},
c6(a,b,c,d){var s
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
if(t.j.b(a)){r=J.R(a)
if(r.gk(a)<c)n.j(b,"Expected "+c+" components")
for(q=0;q<c;++q){p=g+q
o=n.bA(r.h(a,q),b,q)
s.$flags&2&&A.d(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gk(a)>2&&n.S(r.h(a,2),b)!==d)n.j(b,"Non-planar component")}else{if(c!==1)n.j(b,"Expected "+c+" components")
r=n.bA(a,b,0)
s.$flags&2&&A.d(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
eQ(e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3=this,e4=null,e5="Expected object",e6=t.j
e6.a(e7)
t.c.a(f2)
s=J.bb(e7)
r=s.gad(e7)
q=t.P
p=q.b(r)
o=p?r.h(0,"t"):e4
n=!1
if(p)if(r.h(0,"e")!=null){if(!J.m(r.h(0,"h"),1))if(typeof o=="number"){p=e3.e
p===$&&A.E()
p=o<p}else p=n
else p=n
n=p}p=s.gk(e7)
m=p+(n?1:0)
l=new Float64Array(m)
p=m*3
k=new Int32Array(p)
for(j=s.gD(e7),i=0,h=0,g=!1;j.t();){f=j.gB()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.m(f.h(0,"h"),1))++h
g=B.u.bH(g,f.h(0,"to")!=null)}j=h*(f1?8:4)
e=new Float64Array(j)
if(g)d=new Float32Array(m*4)
else d=e4
c=A.eu()
b=A.eu()
a=A.eu()
a0=A.eu()
for(a1=2*m,a2=m-1,a3=m+i,a4=e3.a.a,a5=e9===2,a6=m,a7=0,a8=0,a9=0;a9<s.gk(e7);++a9){b0=new A.c(e8,a9)
b1=s.h(e7,a9)
if(!q.b(b1))e3.j(b0,e5)
e3.O(b1,b0,B.aR)
b2=b1.h(0,"to")
b3=b1.h(0,"ti")
b4=b2==null
b5=!b4
if(b5)e3.dQ(b2,"to",e9,b0,d,a9*4)
b6=b3==null
if(!b6)e3.dQ(b3,"ti",e9,b0,d,a9*4+2)
if(b4!==b6)e3.j(b0,"Incomplete spatial tangents")
b7=e3.bA(b1.h(0,"t"),b0,"t")
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
if(b.b!==b)A.r(A.fi(""))
b.b=c0
if(a.b!==a)A.r(A.fi(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.r(A.fi(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.r(A.fi(""))
c.b=b4
b6=a.b
if(b6===a)A.r(A.ar(""))
B.h.C(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.r(A.ar(""))
if(typeof b4!=="number")return A.ah(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.r(A.ar(""))
b6=a.b
if(b6===a)A.r(A.ar(""))
if(typeof b6!=="number")return A.ah(b6)
J.ki(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.r(A.ar(""))
b6=a.b
if(b6===a)A.r(A.ar(""))
e3.bk(b8,new A.c(b0,"s"),e9,f0,f2,b4,c1,b6)}}c2=J.m(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.r(A.ar(""))
if(typeof b4!=="number")return A.ah(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.r(A.ar(""))
b5=a.b
if(b5===a)A.r(A.ar(""))
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
if(b4===a)A.r(A.ar(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e3.j(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e3.j(b0,"Easing component mismatch")
if(f1){b1=a.b
if(b1===a)A.r(A.ar(""))}else{b1=a.b
if(b1===a)A.r(A.ar(""))
b1=Math.min(A.lx(b1),1)}d4=Math.min(A.lx(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e6.b(c8),b4=e6.b(c7),b5=e6.b(c6),b6=e6.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.R(c5)
d6=d6.h(c5,d6.gk(c5)===1?0:d5)}else d6=c5
d7=B.c.F(A.eP(d6),0,1)
if(b5){d6=J.R(c6)
d6=d6.h(c6,d6.gk(c6)===1?0:d5)}else d6=c6
A.eP(d6)
if(b4){d8=J.R(c7)
d8=d8.h(c7,d8.gk(c7)===1?0:d5)}else d8=c7
d9=B.c.F(A.eP(d8),0,1)
if(b1){d8=J.R(c8)
d8=d8.h(c8,d8.gk(c8)===1?0:d5)}else d8=c8
A.eP(d8)
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
k[a9]=c3}if(m===1)return new A.F(b.ar(),e4,!1,$.bv(),!1)
if(n){e6=a0.ar()
if(typeof e6!=="number")return A.ah(e6)
c1=a2*e6
e6=e3.e
e6===$&&A.E()
if(!(a2>=0))return A.a(l,a2)
l[a2]=e6
e6=c.ar()
s=a.ar()
if(typeof s!=="number")return A.ah(s)
J.ki(e6,c1,c1+s,c.ar(),a8)
if(!(a2<p))return A.a(k,a2)
k[a2]=8
s=m+a2
k.$flags&2&&A.d(k)
if(!(s>=0&&s<p))return A.a(k,s)
k[s]=c1
a2=a1+a2
if(!(a2>=0&&a2<p))return A.a(k,a2)
k[a2]=a7}e6=a.ar()
s=a0.ar()
q=c.ar()
if(a7===j)p=e
else{e1=e.BYTES_PER_ELEMENT
e2=A.b4(0,a7,B.a.a_(e.byteLength,e1))*e1
if(B.a.T(e2,8)!==0)A.r(A.aI("The number of bytes to view must be a multiple of 8",e4))
p=J.ma(B.f.ga7(e),e.byteOffset+0*e1,B.a.J(e2,8))}p=A.mC(l,e6,s,k,q,p,d,a4)
return new A.F(e4,p,a4,new Float32Array(p.b),!1)},
dQ(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.ap(a)<2)o.j(new A.c(d,b),"Invalid spatial tangent")
if(c!==2&&J.m9(a,new A.he()))o.j(new A.c(d,b),"Spatial tangent on non-position")
s=J.R(a)
r=o.S(s.h(a,0),d)
q=o.S(s.h(a,1),d)
if(e!=null){e.$flags&2&&A.d(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=r
p=f+1
if(!(p<s))return A.a(e,p)
e[p]=q}},
bm(a,b){var s,r
if(!t.j.b(a)){this.S(a,b)
return 1}for(s=J.bb(a),r=s.gD(a);r.t();)this.S(r.gB(),b)
return s.gk(a)}}
A.hf.prototype={
$1(a){var s,r,q
t.D.a(a)
s=!1
if(a.gI()){r=this.a
q=r.d
q===$&&A.E()
if(a.c<=q){s=r.e
s===$&&A.E()
s=a.d>=s}}return s},
$S:33}
A.h5.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.c(new A.c(q.b,"ef"),a),o=q.a,n=o.aw(0,J.aj(q.c,a),p)
o.O(n,p,B.H)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.m(s,r[a])||n.h(0,"v")==null)o.j(p,"Invalid effect parameter")
return o.M(n.h(0,"v"),new A.c(p,"v"),b,A.h([],t.n))},
$1(a){return this.$2$dimensions(a,1)},
$S:34}
A.h6.prototype={
$2(a,b){var s,r=this.b.$1(a)
if(r.a!=null){s=r.n(0)
if(0>=s.length)return A.a(s,0)
s=s[0]!==b}else s=!0
if(s)this.a.j(new A.c(new A.c(new A.c(this.c,"ef"),a),"v"),"Unsupported effect parameter value")},
$S:35}
A.h4.prototype={
$1(a){return J.m(J.aj(a,"ind"),this.a)},
$S:13}
A.hb.prototype={
$2(a,b){var s=this.a,r=this.c,q=s.M(this.b.h(0,a),new A.c(r,a),1,A.h([b],t.n))
if(q.a==null)s.j(new A.c(r,a),"Animated Inner Shadow")
s=q.n(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:37}
A.hc.prototype={
$5(a6,a7,a8,a9,b0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4="Invalid path topology",a5=t.j
if(a5.b(a6)){s=J.R(a6)
s=s.gk(a6)===1&&s.ga5(a6) instanceof A.J}else s=!1
if(s)a6=J.md(a6)
s=this.b
r=s.aw(0,a6,a7)
s.O(r,a7,B.aP)
q=r.h(0,"c")
if(!A.b1(q))s.j(new A.c(a7,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.u.bH(p.c,q!==o)
o=a7.a
n=o==null?null:o.b
if(A.o(n)){m=p.a
if(m==null){o=J.ap(a5.a(J.aj(this.c,"k")))
m=p.a=new Uint8Array(o*2)}p=a7.b==="e"?1:0
p=n*2+p
o=q?1:2
m.$flags&2&&A.d(m)
if(!(p>=0&&p<m.length))return A.a(m,p)
m[p]=o}l=r.h(0,"v")
k=r.h(0,"i")
j=r.h(0,"o")
if(l instanceof A.ci&&k instanceof A.ci&&j instanceof A.ci){i=l.b
if(i!==k.b||i!==j.b)s.j(a7,a4)
h=s.c6(a7,a8,i*6,b0)
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
if(a5.b(l))if(a5.b(k))if(a5.b(j)){a5=J.R(l)
a5=a5.gk(l)!==J.ap(k)||a5.gk(l)!==J.ap(j)}else a5=p
else a5=p
else a5=p
if(a5)s.j(a7,a4)
a5=J.R(l)
h=s.c6(a7,a8,a5.gk(l)*6,b0)
a3=new A.hd(s,a7,h)
for(d=0;d<a5.gk(l);++d){b=a9+d*6
a3.$2(a5.h(l,d),b)
a3.$2(J.aj(k,d),b+2)
a3.$2(J.aj(j,d),b+4)}return h},
$S:14}
A.hd.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.ap(a)!==2)m.a.j(m.b,"Expected 2D path point")
s=m.c
r=m.a
q=J.R(a)
p=m.b
o=r.S(q.h(a,0),p)
s.$flags&2&&A.d(s)
n=s.length
if(!(b>=0&&b<n))return A.a(s,b)
s[b]=o
o=b+1
p=r.S(q.h(a,1),p)
if(!(o<n))return A.a(s,o)
s[o]=p},
$S:39}
A.ha.prototype={
$1(a){var s,r,q,p
t.cH.a(a)
for(s=a.length,r=this.a,q=0;q<a.length;a.length===s||(0,A.a_)(a),++q){p=a[q]
if(p instanceof A.Y)B.b.m(r,p)
if(p instanceof A.aa)this.$1(p.a)}},
$S:40}
A.h8.prototype={
$1(a){return t.bD.a(a).a},
$S:41}
A.h9.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.aa)||a.ge9()},
$S:1}
A.h7.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.R(a)
r=k.b*4
s=s.gk(a)<r||(s.gk(a)-r&1)===1}else s=!0
if(s)k.a.j(b,"Invalid gradient stops")
s=k.a
r=J.R(a)
q=s.c6(b,c,r.gk(a),e)
for(p=k.b,o=0;o<r.gk(a);++o){n=s.S(r.h(a,o),b)
if(o<p*4&&B.a.T(o,4)!==0){m=B.a.F(B.c.H(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.d(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:14}
A.he.prototype={
$1(a){return!J.m(a,0)},
$S:13}
A.hl.prototype={
cb(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j,i,h
t.ew.a(d)
t.ae.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.kb()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.o(n)?new A.c(p,n):new A.c(p,A.H(n))}if(this.fK(a,r,b,p,e==null?new A.c0(t.ao):e))return}for(q=a.gav(),q=q.gD(q),m=t.j,l=t.h;q.t();){k=q.gB()
if(k==="k")continue
j=a.h(0,k)
if(!s.b(j))i=!m.b(j)||l.b(j)
else i=!1
if(i)continue
B.b.m(d,k)
this.cb(j,b,c,d,e,k==="ks"&&J.m(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a)&&!t.h.b(a))for(m=J.R(a),l=t.h,h=0;h<m.gk(a);++h){j=m.h(a,h)
if(!s.b(j))k=!q.b(j)||l.b(j)
else k=!1
if(k)continue
B.b.m(d,h)
this.dO(j,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
fY(a,b,c,d){return this.cb(a,b,c,d,null,!1)},
dO(a,b,c,d,e){return this.cb(a,b,c,d,e,!1)},
fK(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null
t.P.a(a0)
t.bC.a(a4)
if(!a4.m(0,a0))b.a.j(a3,"Cyclic expression reference")
try{i=$.m2()
if(i.b.test(a1)){a0.A(0,"x")
return!0}s=new A.c(a3,"x")
r=$.m0().e6(a1)
if(r==null)b.a.j(s,"Unsupported expression syntax")
q=a2
p=null
i=$.kc()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dR(0,h)
h=new A.cm(h.a,h.b,h.c)
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
d=$.m1()
c=A.H(n)
m=d.b.test(c)?B.z.e2('"'+A.x(n)+'"',a):n
p=b.c8(q,"nm",A.H(m))
if(p==null)f.j(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.C)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=b.c8(q,"ty","tr")
l=i==null?a:i.h(0,"s")
break
case"transform.rotation":i=b.c8(q,"ty","tr")
l=i==null?a:i.h(0,"r")
break
default:i=p
l=i==null?a:J.aj(i,"o")
break}k=l
j=f.aw(0,k,s)
if(j===a0){a0.A(0,"x")
return!0}b.dO(j,a2,s,A.h([],t.f),a4)
a0.l(0)
a0.ak(0,j)
return!1}finally{a4.A(0,a0)}},
c8(a,b,c){var s,r,q,p
for(s=J.cD(a),r=t.P,q=null;s.t();){p=s.gB()
if(!r.b(p)||!J.m(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q}}
A.i5.prototype={
cC(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.aw(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.aj(j,"x")
s=typeof n=="string"?$.kb().e6(n):null
if(s==null){k=k.dk(j,b)
i.q(0,j,k)
return k}r=new A.c(b,"x")
k.O(j,b,B.I)
if(J.aj(j,"a")!=null&&!J.m(J.aj(j,"a"),0)&&!J.m(J.aj(j,"a"),1))k.j(new A.c(b,"a"),"Invalid animated flag")
m=l.d
if(!m.m(0,j))k.j(r,"Cyclic path reference")
try{q=null
p=null
o=l.fT(s,r)
q=o.a
p=o.b
k=l.cC(q,p)
i.q(0,j,k)
return k}finally{m.A(0,j)}},
fT(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.de(j.b,s,B.n,b,"layer")
q=r.a
if(!J.m(q.h(0,"ty"),4))j.a.j(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.c(r.b,"shapes")
s=$.kc()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dR(0,i)
i=new A.cm(i.a,i.b,i.c)
s=t.d
while(i.t()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.de(p,m,o,b,"content")
q=l.a
o=l.b
p=J.m(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.c(o,"it")}k=q.h(0,"ks")
if(!J.m(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.j(b,"Path reference needs a B\xe9zier path")
return new A.y(k,new A.c(o,"ks"))},
de(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.R(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gk(a);++m){l=s.h(a,m)
if(r.b(l)&&J.m(l.h(0,"nm"),b)){if(o!=null)q.j(d,p)
n=m
o=l}}if(o!=null)return new A.y(o,new A.c(c,n))}this.a.j(d,"Missing "+e+" reference: "+b)}}
A.ez.prototype={
a1(a,b,c){var s
A.oH(c,t.K,"T","_copy")
s=c.a(this.b.ef(c.a(a),c.i("0()").a(b)))
return s},
E(a){var s=t.A
s.a(a)
if(a.a!=null)return a
return this.a1(a,new A.hA(a),s)},
ej(a){return this.a1(a,new A.hB(this,a),t.d1)},
cH(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.aa)return s.bG(a)
if(a instanceof A.Y)return s.a1(a,new A.hu(s,a),r)
if(a instanceof A.br)return s.a1(a,new A.hv(s,a),r)
if(a instanceof A.aX)return s.a1(a,new A.hw(s,a),r)
if(a instanceof A.aE)return s.a1(a,new A.hx(s,a),r)
if(a instanceof A.aZ)return s.a1(a,new A.hy(s,a),r)
if(a instanceof A.b7)return s.a1(a,new A.hz(s,a),r)
throw A.f(A.at("Unknown compiled geometry"))},
hf(a){var s=t.I
s.a(a)
if(a instanceof A.aa)return this.bG(a)
if(a instanceof A.bq)return this.a1(a,new A.ho(this,a),s)
throw A.f(A.at("Unknown compiled paint"))},
bG(a){return this.a1(a,new A.hq(this,a),t.eV)},
ep(a){return this.a1(a,new A.hp(this,a),t.cK)},
hQ(a,b){return this.a1(b,new A.hC(this,b),t.e_)},
h4(a){return this.a1(a,new A.hn(this,a),t.bo)},
hA(a){var s=t.J
s.a(a)
return this.a1(a,new A.hs(this,a),s)},
cs(a){var s=t.D
s.a(a)
return this.a1(a,new A.hr(this,a),s)},
cE(a){return this.a1(a,new A.ht(this,a),t.G)}}
A.hA.prototype={
$0(){var s=this.a,r=s.d.length
if(r===0)r=$.bv()
else r=new Float32Array(r)
return new A.F(s.a,s.b,s.c,r,s.f)},
$S:48}
A.hB.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.E(o.a),m=p.E(o.b),l=p.E(o.c),k=p.E(o.d),j=p.E(o.e),i=o.f
i=i==null?q:p.E(i)
s=o.r
s=s==null?q:p.E(s)
r=o.w
r=r==null?q:p.E(r)
o=o.x
return A.jL(n,m,l,k,j,i,s,r,o==null?q:p.E(o))},
$S:49}
A.hu.prototype={
$0(){return new A.Y(this.a.cH(this.b.a))},
$S:50}
A.hv.prototype={
$0(){var s=this.b
return new A.br(this.a.hQ(0,s.a),s.b)},
$S:51}
A.hw.prototype={
$0(){var s=this.b,r=s.a,q=A.a4(r),p=q.i("a1<1,B>")
r=A.aS(new A.a1(r,q.i("B(1)").a(this.a.gba()),p),p.i("a9.E"))
r.$flags=1
return A.ng(r,s.b)},
$S:52}
A.hx.prototype={
$0(){var s=this.b
return new A.aE(this.a.E(s.e),s.f,s.r)},
$S:53}
A.hy.prototype={
$0(){var s=this.b,r=this.a
return new A.aZ(s.e,s.f,r.E(s.r),r.E(s.w),r.E(s.x))},
$S:54}
A.hz.prototype={
$0(){var s,r=this.b,q=this.a,p=q.E(r.r),o=q.E(r.w),n=q.E(r.x),m=q.E(r.y),l=q.E(r.z),k=r.Q
k=k==null?null:q.E(k)
s=r.as
q=s==null?null:q.E(s)
return new A.b7(r.e,r.f,p,o,n,m,l,k,q)},
$S:83}
A.ho.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a4(o),l=m.i("a1<1,B>")
o=A.aS(new A.a1(o,m.i("B(1)").a(n.gba()),l),l.i("a9.E"))
o.$flags=1
m=n.E(p.b)
l=n.E(p.c)
s=n.E(p.d)
r=p.y
r=r==null?null:n.ep(r)
q=p.z
n=q==null?null:n.h4(q)
return A.jK(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:56}
A.hq.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a4(q),n=o.i("a1<1,B>")
q=A.aS(new A.a1(q,o.i("B(1)").a(p.gba()),n),n.i("a9.E"))
q.$flags=1
o=r.b
n=A.a4(o)
s=n.i("a1<1,aL>")
o=A.aS(new A.a1(o,n.i("aL(1)").a(p.ghe()),s),s.i("a9.E"))
o.$flags=1
return A.jI(q,o,p.ej(r.c))},
$S:57}
A.hp.prototype={
$0(){var s,r=this.b,q=this.a,p=q.E(r.c),o=q.E(r.d),n=q.E(r.e),m=r.f
m=m==null?null:q.E(m)
s=r.r
q=s==null?null:q.E(s)
return A.kS(r.a,p,o,n,r.w,m,q)},
$S:58}
A.hC.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a4(r),o=p.i("a1<1,B>")
r=A.aS(new A.a1(r,p.i("B(1)").a(q.gba()),o),o.i("a9.E"))
return A.nr(r,q.E(s.b),q.E(s.c),q.E(s.d),s.e)},
$S:59}
A.hn.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a4(r),o=p.i("a1<1,F>")
r=A.aS(new A.a1(r,p.i("F(1)").a(q.ghO()),o),o.i("a9.E"))
return A.kQ(r,q.E(s.b))},
$S:60}
A.hs.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.E(q.e),o=s.E(r.c),n=r.e
s=n==null?null:s.E(n)
return A.nf(new A.aE(p,q.f,q.r),r.b,o,r.d,s)},
$S:61}
A.hr.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.ej(l.a),j=l.b
j=j==null?n:m.bG(j)
s=l.f
s=s==null?n:m.cE(s)
r=l.x
r=r==null?n:m.E(r)
q=l.z
if(q==null)q=n
else{p=A.a4(q)
o=p.i("a1<1,ac>")
q=A.aS(new A.a1(q,p.i("ac(1)").a(m.ghz()),o),o.i("a9.E"))}p=l.at
p=p==null?n:new A.ey(m.E(p.a),m.E(p.b))
o=l.as
o=o==null?n:A.kT(o.a,o.b,o.c)
r=A.kU(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.cs(k)
r.ch=l.ch
return r},
$S:62}
A.ht.prototype={
$0(){var s,r,q,p,o=this.b,n=A.jG(o.a),m=o.b
m===$&&A.E()
n.b=m
m=o.c
m===$&&A.E()
n.c=m
m=o.d
m===$&&A.E()
n.d=m
m=o.e
m===$&&A.E()
n.e=m
m=o.f
m===$&&A.E()
n.f=m
n.x=o.x
n.y=o.y
m=n.w
o=o.w
s=this.a
r=A.a4(o)
B.b.ak(m,new A.a1(o,r.i("ab(1)").a(s.ghw()),r.i("a1<1,ab>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.cs(p)}}return n},
$S:63}
A.bn.prototype={
ghq(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.n(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
hl(a,b,c){var s,r,q,p,o=this.f
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
return new A.y(Math.cos(p)*r,Math.sin(p)*r)},
eP(a,b){var s,r,q,p,o,n,m
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
A.Y.prototype={
gI(){return this.a.gI()},
ga6(){return this.a.ga6()},
a8(a){return this.a.a8(a)},
$iB:1}
A.br.prototype={
gI(){return this.a.gI()},
ga6(){return this.a.gI()},
a8(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].a8(a)},
$iB:1}
A.bI.prototype={
gI(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.b.ab(r.a,new A.ic())
r.f!==$&&A.T()
q=r.f=s}return q}}
A.ic.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.cq.prototype={
gI(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.b.ab(r.a,new A.hg())
r.e!==$&&A.T()
q=r.e=s}return q}}
A.hg.prototype={
$1(a){return t.A.a(a).a!=null},
$S:64}
A.c4.prototype={
gdd(){var s=this.y
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
gcr(){var s,r=this,q=r.ax
if(q===$){s=A.jM(r.c,100,100)&&A.eK(r.d,0)&&A.eK(r.w,0)
r.ax!==$&&A.T()
q=r.ax=s}return q},
gaD(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gcr())if(A.jM(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.jM(q.b,0,0)
else r=A.eK(r,0)&&A.eK(q.r,0)
s=r}q.ay!==$&&A.T()
p=q.ay=s}return p},
gI(){var s,r=this,q=r.ch
if(q===$){s=r.gaR()&&r.e.a!=null
r.ch!==$&&A.T()
q=r.ch=s}return q},
gco(){var s,r=this,q=r.CW
if(q===$){s=A.eK(r.e,100)
r.CW!==$&&A.T()
r.CW=s
q=s}return q},
d1(a){var s,r,q,p,o=this
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
ec(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gaR()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gdd()
a4.as=a6
r=a4.gdd()
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
cw(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaD())return a
if(b.gcr()){b.d1(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.aC(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.ec(a0)
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
return new A.aC(f-d,e-c,f+d,e+c)}}
A.ac.prototype={
gI(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gcd(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.hU.prototype={
aP(a){var s=this.c
return 255-A.a3((255-(B.a.dw(s,a)&255))*(s>>>24))}}
A.ey.prototype={
h0(a){var s,r,q,p=this.a.n(a),o=new A.hm(),n=this.b.n(a)
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
if(typeof o!=="number")return A.ah(o)
return(n<<24|r<<16|q<<8|o)>>>0}}
A.hm.prototype={
$1(a){return B.c.H(B.c.F(a,0,1)*255)},
$S:65}
A.ab.prototype={
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
r=r==null?p:B.b.ab(r,new A.hZ())
r=r!==!1}else r=s}else r=s}else r=s}else r=s
s=r}}q.db!==$&&A.T()
o=q.db=s}return o},
gho(){var s,r=this,q=r.dx
if(q===$){s=r.z
s=s==null?null:B.b.au(s,new A.hX())
r.dx!==$&&A.T()
q=r.dx=s===!0}return q},
ghr(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.b.ab(s,new A.hY())
r.dy!==$&&A.T()
q=r.dy=s===!0}return q},
gea(){var s,r,q=this,p=q.fx
if(p===$){if(q.a.gaR()){s=q.cy
s=s==null?null:s.gea()
r=s!==!1}else r=!1
q.fx!==$&&A.T()
p=q.fx=r}return p},
ge8(){var s,r,q=this,p=q.fy
if(p===$){if(q.a.gaD()){s=q.cy
s=s==null?null:s.ge8()
r=s===!0}else r=!0
q.fy!==$&&A.T()
p=q.fy=r}return p},
aA(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null
if(!h.em(a))return g
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
q===$&&A.E()
o=s.d
o===$&&A.E()
n=r*q-o}else n=(a-h.r)/h.w
p=A.c7(p,s.aA(n))}if(p==null)return h.go=null
s=h.z
if(s!=null)r=s.length===1&&B.b.gaf(s).gcd()||B.b.ab(s,new A.i_())
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
j=new A.aC(r.a-q,r.b-q,r.c+q,r.d+q)}if(j!=null)m=A.c7(m,j)}}if(m!=null){p=p.bz(m)
if(p.gR(0))return h.go=null}}for(i=h;i!=null;i=i.cy)p=i.a.cw(p,a)
return h.go=p},
em(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
hx(a,b){var s=this.a.e.n(a)
if(0>=s.length)return A.a(s,0)
return B.a.F(B.c.N(b*B.c.H(s[0])/100),0,255)},
aT(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gcd()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.n(a)
if(0>=q.length)return A.a(q,0)
return B.a.F(B.c.H(q[0]*255/100),0,255)}return 255}}
A.hZ.prototype={
$1(a){return t.J.a(a).gI()},
$S:2}
A.hX.prototype={
$1(a){return t.J.a(a).b!=="n"},
$S:2}
A.hY.prototype={
$1(a){t.J.a(a)
return a.b==="n"||a.gI()},
$S:2}
A.i_.prototype={
$1(a){t.J.a(a)
return a.b==="a"&&!a.d},
$S:2}
A.aa.prototype={
ge9(){var s,r=this,q=r.d
if(q===$){s=B.b.au(r.a,new A.hQ())
r.d!==$&&A.T()
r.d=s
q=s}return q},
gb9(){var s,r=this,q=r.e
if(q===$){s=r.fa()
r.e!==$&&A.T()
r.e=s
q=s}return q},
fa(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.b.gaf(n)
if(s instanceof A.aa){r=s.c
r=r.gaD()&&r.gco()}else r=!1
return r?s.gb9():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.aa){r=o.c
r=r.gaD()&&r.gco()}else r=!1
if(r){if(q==null)q=B.b.ex(n,0,p)
B.b.ak(q,o.gb9())}else if(q!=null)B.b.m(q,o)}return q==null?n:q},
gcG(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gb9()
r=null
if(!(s.length!==1)){q=B.b.gaf(s)
A:{if(q instanceof A.bq){s=q
break A}if(q instanceof A.aa){s=q.gcG()
break A}s=r
break A}r=s}p.f!==$&&A.T()
o=p.f=r}return o},
gI(){var s,r=this,q=r.ax
if(q===$){s=r.c.gI()&&B.b.ab(r.a,new A.hS())&&B.b.ab(r.b,new A.hT())
r.ax!==$&&A.T()
q=r.ax=s}return q},
ga6(){var s,r=this,q=r.ay
if(q===$){s=r.c.gaR()&&B.b.ab(r.a,new A.hR())
r.ay!==$&&A.T()
q=r.ay=s}return q},
a8(a){var s,r,q,p,o=this
if(o.ga6()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.a_)(s),++p)q=A.c7(q,s[p].a8(a))
if(q==null)return o.z=null
return o.z=o.c.cw(q,a)},
b2(a){var s,r,q,p,o,n=this
if(n.gI()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.n(a)
if(0>=r.length)return A.a(r,0)
if(B.c.H(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.a_)(r),++o)p=A.c7(p,r[o].b2(a))
if(p==null)return n.Q=null
return n.Q=s.cw(p,a)},
$iaL:1,
$iB:1}
A.hQ.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.aa)||a.ge9()},
$S:1}
A.hS.prototype={
$1(a){return t.u.a(a).gI()},
$S:1}
A.hT.prototype={
$1(a){return t.I.a(a).gI()},
$S:67}
A.hR.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.aX.prototype={
gI(){var s,r=this,q=r.d
if(q===$){s=B.b.ab(r.a,new A.i2())
r.d!==$&&A.T()
r.d=s
q=s}return q},
ga6(){var s,r=this,q=r.e
if(q===$){s=B.b.ab(r.a,new A.i1())
r.e!==$&&A.T()
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
for(o=j,n=0;n<s.length-1;++n)o=A.c7(o,s[n].a8(a))
if(o==null)return k.w=null
m=p.bz(o)
return k.w=m.gR(0)?j:m}if(q===3)--r
for(l=j,n=0;n<r;++n){if(!(n<s.length))return A.a(s,n)
l=A.c7(l,s[n].a8(a))}return k.w=l},
$iB:1}
A.i2.prototype={
$1(a){return t.u.a(a).gI()},
$S:1}
A.i1.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.eB.prototype={
ga6(){return this.gI()},
a8(a){var s=this
if(s.gI()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.ci(a)},
$iB:1}
A.aE.prototype={
gI(){return this.e.a!=null},
ci(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.n(a),f=g.length
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
if(h>q)q=h}return new A.aC(s,r,p,q)}}
A.aZ.prototype={
gI(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
ci(a){var s,r,q,p=this.r.n(a),o=this.w.n(a),n=o.length
if(0>=n)return A.a(o,0)
s=Math.abs(o[0]*0.5)
if(1>=n)return A.a(o,1)
r=Math.abs(o[1]*0.5)
n=p.length
if(0>=n)return A.a(p,0)
q=p[0]
if(1>=n)return A.a(p,1)
n=p[1]
return new A.aC(q-s,n-r,q+s,n+r)}}
A.b7.prototype={
gI(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
ci(a){var s,r,q,p=this,o=p.w.n(a),n=p.y.n(a)
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
return new A.aC(s-r,n-r,s+r,n+r)},
fb(d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=this,d4=t.bp
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
else{b9=A.iv(a,a0,a4)
c0=A.iv(b5,b6,b3)
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
if(d4){d1=A.iv(a,a0,o)
d2=A.iv(b5,b6,o)
d8.$8(a2-d*d1.a,a3-d*d1.b,b7+d*d2.a,b8+d*d2.b,b7,b8,a2,a3)}else d7.$2(b7,b8)
i+=h}d9.$0()}}}
A.bq.prototype={
gc5(){var s,r=this,q=r.fr
if(q===$){s=B.b.ab(r.a,new A.i9())
r.fr!==$&&A.T()
r.fr=s
q=s}return q},
fL(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.b.gaf(r.a)
while(s instanceof A.Y)s=s.a
if((s instanceof A.aZ||s instanceof A.aE||s instanceof A.b7)&&s.gI())return s
return null},
d2(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.a_)(s),++p)q=A.c7(q,s[p].a8(a))
return q},
gI(){var s,r,q,p=this,o=null,n=!1
if(p.gc5())if(p.b.a!=null)if(p.c.a!=null)if(p.d.a!=null){s=p.y
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
if(m.gc5()){p=m.fy
if(p===$){o=m.d2(0)
m.fy!==$&&A.T()
m.fy=o
p=o}n=p}else n=m.d2(a)
if(n==null)return null
return q===0?n:n.hs(q)},
$iaL:1}
A.i9.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.by.prototype={
aJ(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
Z(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
ag(){return this.Z(!1)}}
A.am.prototype={
gR(a){return this.f===0&&this.r===0&&!this.x},
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
e3(a){while(this.a.length<a)this.d7()},
d7(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.f.C(o,0,r.f,q)
s=new Float64Array(p)
B.f.C(s,0,r.f,r.b)
r.a=o
r.b=s},
cl(a){while(this.c.length<a)this.d6()},
d6(){var s=this,r=s.c,q=r.length*2,p=new Int32Array(q)
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
if(p.r===p.c.length)p.d6()
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
p(a,b){var s,r,q,p=this,o=p.f
if(o>p.w){s=p.a
r=o-1
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
s=p.b
if(!(r<s.length))return A.a(s,r)
if(Math.abs(a-q)+Math.abs(b-s[r])<1e-7)return}if(o===p.a.length)p.d7()
o=p.a
s=p.f
o.$flags&2&&A.d(o)
if(!(s>=0&&s<o.length))return A.a(o,s)
o[s]=a
o=p.b
o.$flags&2&&A.d(o)
if(!(s<o.length))return A.a(o,s)
o[s]=b
p.f=s+1},
cc(a,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(a8>=10){b.p(a5,a6)
return}s=3*a1-(2*a+a5)
r=3*a2-(2*a0+a6)
q=3*a3-(a+2*a5)
p=3*a4-(a0+2*a6)
if((s*s+r*r)*0.0625<=a7&&(q*q+p*p)*0.0625<=a7){b.p(a5,a6)
return}o=(a+a1)*0.5
n=(a0+a2)*0.5
m=(a1+a3)*0.5
l=(a2+a4)*0.5
k=(a3+a5)*0.5
j=(a4+a6)*0.5
i=(o+m)*0.5
h=(n+l)*0.5
g=(m+k)*0.5
f=(l+j)*0.5
e=(i+g)*0.5
d=(h+f)*0.5
c=a8+1
b.cc(a,a0,o,n,i,h,e,d,a7,c)
b.cc(e,d,g,f,k,j,a5,a6,a7,c)},
V(a,b,c,d,e,f,g,h,i){return this.cc(a,b,c,d,e,f,g,h,i,0)},
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
aH(a9,b0,b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=this,a8=a9.r
if(a8===0||a9.f===0)return
a7.e3(a7.f+a9.f)
a7.cl(a7.r+a8)
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
B.f.K(s,a,a0,q,d)
B.f.K(r,a,a0,p,d)
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
h_(a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=a3.r
if(a2===0||a3.f===0)return
a1.e3(a1.f+a3.f)
a1.cl(a1.r+a2)
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
A.aJ.prototype={
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
if(this.a.gv().length>s*2)this.a.az(2048,0)},
ag(){return this.Z(!1)},
e1(a){var s=this,r=a.b*2
if(s.a.gv().length<r)s.a.az(r,0)
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
q.az(q.gv().length*2,f.b*2)}g=f.a.gv()
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
er(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a===0){i.l(0)
return}s=i.a.gv()
for(r=i.b*2,q=s.length,p=s.$flags|0,o=0,n=0;n<r;n+=2){m=n+1
if(!(m<q))return A.a(s,m)
l=s[m]
k=B.a.L(((l&255)+1)*a+128,8)
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
A.f6.prototype={
hE(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
d.bT()
d.fy=A.cL(g)
d.go=A.cL(f)
for(e=i+1;e<h;++e){if(!(e<s))return A.a(k,e)
p=k[e]
if(!(e<r))return A.a(j,e)
o=j[e]
d.dr(A.cL(p),A.cL(o))}d.dr(A.cL(g),A.cL(f))}d.eA(b,c)},
hF(a,b,c,d,e,f,g,h,i,j,k){if(k===0||c>=e||d>=f||a.r===0)return!0
return!1},
bT(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
dt(a,b){var s=this
if(s.k4){if(s.id===a&&s.k1===b)return
s.bT()}s.id=a
s.k1=b
s.k3=s.k2=0
s.k4=!0},
aC(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.ay
if(b<s){r.dt(s,a)
r.k2+=e
return}if(b>=r.CW)return
r.dt(b,a)
r.k2+=e
r.k3=r.k3+(c+d)*e},
aG(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.ch||a>=g.cx)return
s=B.a.b7(B.a.L(b,8),32)
r=B.a.b7(B.a.L(d,8),32)
q=s*256
p=r*256
if(s===r){g.aC(a,s,b-q,d-q,f)
return}o=d-b
n=b-q
if(d>b){m=g.ay
if(s<m){if(r<m){g.aC(a,m,0,0,f)
return}l=c+B.a.a_((g.cy-b)*f,o)
g.aC(a,m,0,0,l-c)
s=g.ay
k=l
n=0}else k=c
for(;;){if(!(s<r&&s<g.CW))break
j=s+1
i=c+B.a.a_((j*256-b)*f,o)
g.aC(a,s,n,256,i-k)
k=i
s=j
n=0}if(s<g.CW)g.aC(a,s,n,d-p,e-k)}else{m=g.CW
if(s>=m){if(r>=m)return
l=c+B.a.a_((g.dx-b)*f,o)
s=m-1
k=l
n=256}else k=c
for(;;){if(!(s>r&&s>=g.ay))break
i=c+B.a.a_((s*256-b)*f,o)
g.aC(a,s,n,0,i-k);--s
k=i
n=256}m=g.ay
h=e-k
if(s<m)g.aC(a,m,0,0,h)
else g.aC(a,s,n,d-p,h)}},
dr(a,b){this.fI(a,b)
return},
fI(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.fy,b=d.go
d.fy=a
d.go=a0
s=a0-b
if(s===0)return
r=B.a.b7(B.a.L(b,8),32)
q=B.a.b7(B.a.L(a0,8),32)
p=d.ch
o=r<p
if(o&&q<p)return
n=d.cx
m=r>=n
if(m&&q>=n)return
if(r===q){l=r*256
d.aG(r,c,b-l,a,a0-l)
return}k=a-c
if(s>0){if(o){j=d.db
i=c+B.a.a_((j-b)*k,s)
r=p}else{j=b
i=c}for(;;){if(!(r<q&&r<d.cx))break
p=r+1
h=p*256
g=c+B.a.a_((h-b)*k,s)
d.aG(r,i,j-r*256,g,256)
j=h
i=g
r=p}if(r<d.cx){o=r*256
d.aG(r,i,j-o,a,a0-o)}}else{if(m){j=d.dy
i=c+B.a.a_((j-b)*k,s)
r=n-1}else{j=b
i=c}if(r===q){if(r>=p){l=r*256
d.aG(r,i,j-l,a,a0-l)}return}f=r*256
e=c+B.a.a_((f-b)*k,s)
if(r>=p)d.aG(r,i,j-f,e,0);--r
i=e
for(;;){if(!(r>q&&r>=d.ch))break
g=c+B.a.a_((r*256-b)*k,s)
d.aG(r,i,256,g,0);--r
i=g}if(r>=d.ch)d.aG(r,i,256,a,a0-r*256)}},
eA(a,b){this.fS(a,b)
return},
fS(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.bT()
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
if(k>m&&l!==0){j=A.jf(l*512,a)
if(j>0)b.aO(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.jf(l*512-s[n],a)
if(j>0)b.aO(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.CW){j=A.jf(l*512,a)
if(j>0)b.aO(o,m,i.CW-m,j)}}i.fx=i.ch-1
i.fr=i.cx}}
A.fL.prototype={
$0(){var s,r,q=new Uint32Array(256)
for(s=1;s<256;++s){r=B.a.a_(16711680+s-1,s)
if(!(s<256))return A.a(q,s)
q[s]=r}return q},
$S:69}
A.fK.prototype={
$3(a,b,c){var s=this.a,r=this.b
return B.a.F(B.c.H((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
$S:70}
A.fN.prototype={
$1(a){var s,r,q=this
a+=q.a
s=q.b
if(s<0){r=q.c
a=r+(a-r)*r/(r-s)}s=q.d
if(s>1){r=q.c
a=r+(a-r)*(1-r)/(s-r)}return a},
$S:71}
A.ci.prototype={
gk(a){return this.b}}
A.i0.prototype={
U(){var s,r,q=this,p=q.a,o=q.b,n=q.c
for(s=p.length;n<o;){if(!(n>=0&&n<s))return A.a(p,n)
r=p[n]
if(r!==32&&r!==9&&r!==10&&r!==13)break;++n}q.c=n},
bY(a){var s,r,q=this,p=null,o=q.c
if(o>=q.b)throw A.f(A.U("Unexpected end of JSON at "+o,p,p))
s=q.a
if(!(o>=0&&o<s.length))return A.a(s,o)
r=s[o]
if(r===123)return q.ft()
if(r===91)return q.fl(a)
if(r===34)return q.dl(!1)
if(r===116){q.fu()
return!0}if(r===102){q.fp()
return!1}if(r===110)return q.fq()
if(r>=48&&r<=57||r===45)return q.fs()
throw A.f(A.U("Unexpected byte "+r+" at "+o,p,p))},
ft(){var s,r,q,p,o,n,m,l,k=this,j=null;++k.c
k.U()
s=A.a8(t.N,t.z)
r=k.c
q=k.b
if(r<q){p=k.a
if(!(r>=0&&r<p.length))return A.a(p,r)
p=p[r]===125}else p=!1
if(p){k.c=r+1
return s}for(r=k.a,p=r.length;;){o=k.c
if(o<q){if(!(o>=0&&o<p))return A.a(r,o)
n=r[o]!==34}else n=!0
if(n)throw A.f(A.U("Expected object key at "+o,j,j))
m=k.dl(!0)
k.U()
o=k.c
if(o<q){if(!(o>=0&&o<p))return A.a(r,o)
n=r[o]!==58}else n=!0
if(n)throw A.f(A.U('Expected ":" at '+o,j,j))
k.c=o+1
k.U()
s.q(0,m,k.bY(m))
k.U()
o=k.c
if(o>=q)throw A.f(A.U("Unterminated object at "+o,j,j))
if(!(o>=0&&o<p))return A.a(r,o)
l=r[o]
if(l===44){k.c=o+1
k.U()
continue}if(l===125){k.c=o+1
return s}throw A.f(A.U('Expected "," or "}" at '+o,j,j))}},
fl(a){var s,r,q,p,o,n,m,l,k,j=this,i=null,h=++j.c
j.U()
s=j.c
r=j.b
q=s<r
if(q){p=j.a
if(!(s>=0&&s<p.length))return A.a(p,s)
p=p[s]===93}else p=!1
if(p){j.c=s+1
return[]}p=!1
if(a==="v"||a==="i"||a==="o")if(q){q=j.a
if(!(s>=0&&s<q.length))return A.a(q,s)
s=q[s]===91}else s=p
else s=p
if(s){o=j.fX()
if(o!=null)return o
j.c=h
j.U()}s=j.c
if(s<r){q=j.a
if(!(s>=0&&s<q.length))return A.a(q,s)
n=q[s]}else n=0
if(n>=48&&n<=57||n===45){m=j.fW(a==="k"||a==="s"||a==="e"||a==="to"||a==="ti")
if(m!=null)return m
j.c=h
j.U()}l=[]
for(h=j.a,s=h.length;;){l.push(j.bY(i))
j.U()
q=j.c
if(q>=r)throw A.f(A.U("Unterminated array at "+q,i,i))
if(!(q>=0&&q<s))return A.a(h,q)
k=h[q]
if(k===44){j.c=q+1
j.U()
continue}if(k===93){j.c=q+1
return l}throw A.f(A.U('Expected "," or "]" at '+q,i,i))}},
fX(){var s,r,q,p,o,n,m,l,k,j,i=this,h=null,g=i.d,f=i.a,e=i.b
for(s=f.length,r=0;;){q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==91}else p=!0
if(p)return h
i.c=q+1
i.U()
o=i.c7()
if(o==null)return h
i.U()
q=i.c
if(q<e){if(!(q>=0&&q<s))return A.a(f,q)
p=f[q]!==44}else p=!0
if(p)return h
i.c=q+1
i.U()
n=i.c7()
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
i.d=l
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
return new A.ci(j,r)}return h}},
fW(a){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.e,g=i.a,f=i.b
for(s=g.length,r=0;;r=n){q=i.c7()
if(q==null)return null
p=h.length
if(r>=p){o=new Float64Array(p*2)
B.f.C(o,0,r,h)
i.e=o
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
c7(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e=g.a,d=g.b,c=g.c
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
return A.jw(A.eh(e,c,i))}g.c=q
if(k)return A.jw(A.eh(e,c,q))
if(j===0)h=o
else{if(!(j<16))return A.a(B.r,j)
h=o/B.r[j]}return r?-h:h},
fs(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e="Invalid number at ",d=null,c=f.a,b=f.b,a=f.c,a0=c.length
if(!(a>=0&&a<a0))return A.a(c,a)
s=c[a]===45
if(s){r=a+1
if(r>=b)throw A.f(A.U(e+a,d,d))}else r=a
if(!(r<a0))return A.a(c,r)
q=c[r]
if(q<48||q>57)throw A.f(A.U(e+a,d,d))
p=0
o=0
if(q===48){++r
if(r<b){if(!(r<a0))return A.a(c,r)
n=c[r]
n=n>=48&&n<=57}else n=!1
if(n)throw A.f(A.U("Leading zero in number at "+a,d,d))}else while(r<b){if(!(r<a0))return A.a(c,r)
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
if(o<15){p=p*10+m;++j}else l=!0;++o;++i}if(i===r)throw A.f(A.U("Invalid fraction at "+a,d,d))
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
if(!n)break;++i}if(i===r)throw A.f(A.U("Invalid exponent at "+a,d,d))
r=i
k=!0
l=!0}f.c=r
if(!k&&!l){if(s&&p===0)return-0.0
return s?-p:p}if(l){h=A.eh(c,a,r)
return k?A.oM(h):A.lC(h,d)}if(j===0)g=p
else{if(!(j<16))return A.a(B.r,j)
g=p/B.r[j]}return s?-g:g},
dl(a){var s,r,q,p,o,n,m=this,l=null,k=m.a,j=m.b,i=++m.c
for(s=k.length,r=i,q=!0;r<j;){if(!(r>=0&&r<s))return A.a(k,r)
p=k[r]
if(p===34){m.c=r+1
o=r-i
if(o===0)return""
if(a&&q){n=A.ne(k,i,o)
if(n!=null)return n}if(q)return A.eh(k,i,r)
s=t.L.a(A.b6(k,i,r))
return new A.eN(!1).cX(s,0,l,!0)}if(p===92)return m.fo(i-1)
if(p<32)throw A.f(A.U("Unescaped control character in string at "+r,l,l))
if(p>=128)q=!1;++r}throw A.f(A.U("Unterminated string at "+i,l,l))},
fo(a){var s,r,q=null,p=this.a,o=this.b,n=a+1
for(s=p.length;n<o;){if(!(n>=0&&n<s))return A.a(p,n)
r=p[n]
if(r===92){n+=2
continue}if(r===34){s=n+1
this.c=s
s=t.L.a(A.b6(p,a,s))
return A.H(B.z.e2(new A.eN(!1).cX(s,0,q,!0),q))}++n}throw A.f(A.U("Unterminated escaped string at "+a,q,q))},
fu(){var s,r,q,p=this,o=p.c,n=o+4,m=!1
if(n<=p.b){s=p.a
r=o+1
q=s.length
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===114){r=o+2
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===117){m=o+3
if(!(m>=0&&m<q))return A.a(s,m)
m=s[m]===101}}}if(m){p.c=n
return!0}throw A.f(A.U("Invalid token at "+o,null,null))},
fp(){var s,r,q,p=this,o=p.c,n=o+5,m=!1
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
return!1}throw A.f(A.U("Invalid token at "+o,null,null))},
fq(){var s,r,q,p=this,o=p.c,n=o+4,m=!1
if(n<=p.b){s=p.a
r=o+1
q=s.length
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===117){r=o+2
if(!(r>=0&&r<q))return A.a(s,r)
if(s[r]===108){m=o+3
if(!(m>=0&&m<q))return A.a(s,m)
m=s[m]===108}}}if(m){p.c=n
return null}throw A.f(A.U("Invalid token at "+o,null,null))}}
A.fU.prototype={}
A.dR.prototype={
G(a,b){var s
if(b==null)return!1
if(this!==b)s=b instanceof A.dR&&A.iF(b)===A.iF(this)&&b.a===this.a
else s=!0
return s},
gX(a){return A.e7(A.iF(this),this.a,B.m,B.m)}}
A.fg.prototype={
fP(a){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=null,b=d.w
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
if(p){B.b.q(b,a,$.k6())
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
e=new Float32Array(A.ad(A.h([l,j,l+h,j+g,k+f,e+r[p],k,e],t.n)))
p=new A.du(e,new Float32Array(129))
p.eC(q,o,n,r,m)
B.b.q(b,a,p)
return p}B.b.q(b,a,$.k6())
return c},
cj(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
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
l=new A.fh()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.hY()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.fh.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:72}
A.F.prototype={
gcz(){var s=this.a
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
return c1}if(c2>=B.f.gad(r)){B.h.K(c1,0,o,q,(r.length-1)*p)
return c1}n=c0.r
m=r.length
l=m-1
k=!0
if(n<l){if(!(n<m))return A.a(r,n)
if(!(c2<r[n])){k=n+1
if(!(k<m))return A.a(r,k)
k=c2>=r[k]}}if(k){for(j=0;j+1<l;){i=B.a.L(j+l,1)
if(!(i<m))return A.a(r,i)
if(r[i]<=c2)j=i
else l=i}c0.r=j
n=j}h=n*p
k=s.d
g=k.length
if(!(n>=0&&n<g))return A.a(k,n)
f=k[n]
if((f&1)!==0){B.h.K(c1,0,o,q,h)
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
a1=B.a.L(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.cj(a0,a)
a4=s.fP(n)
if(a4!=null)a4.eq(B.c.F(a3,0,1),c1)
else if(c0.c&&o>=32&&a1<=1)if(a3<=0)B.h.K(c1,0,o,q,h)
else if(a3>=1)B.h.K(c1,0,o,q,d)
else{n=$.dJ()
n.$flags&2&&A.d(n)
n[0]=a3
m=n[0]
n[0]=a3
k=n[0]
n[0]=a3
g=n[0]
n[0]=a3
a5=new A.aT(m,k,g,n[0])
g=s.x
g.toString
a6=B.a.J(h,4)
a7=B.a.J(d,4)
a8=c0.e
if(a8==null)a8=c0.e=J.j7(B.h.ga7(c1),0,o/4|0)
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
b3=new A.aT(b1,b2,b3,n[0]).ah(0,a5)
n[0]=c.a+b3.a
b2=n[0]
n[0]=c.b+b3.b
b1=n[0]
n[0]=c.c+b3.c
e=n[0]
n[0]=c.d+b3.d
a8.q(0,a9,new A.aT(b2,b1,e,n[0]))}for(a9=k*4,n=q.length,k=c1.$flags|0;a9<o;++a9){g=h+a9
if(!(g<n))return A.a(q,g)
g=q[g]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=q[e]
k&2&&A.d(c1)
c1[a9]=g+(e-g)*m}}else if(c0.f)for(n=q.length,k=c1.$flags|0,g=a1>1,a9=0;a9<o;++a9){b4=g&&m?s.cj(a0+4*B.a.T(a9,a1),a):a3
e=h+a9
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.lP()
e=B.a.F(B.c.H(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
b5=c[e]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=B.a.F(B.c.H(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.fR(b5+(c[e]-b5)*B.c.F(b4,0,1))
k&2&&A.d(c1)
c1[a9]=e}else if(a1<=1||a2)if(a3<=0)B.h.K(c1,0,o,q,h)
else if(a3>=1)B.h.K(c1,0,o,q,d)
else for(n=q.length,m=c1.$flags|0,b6=d,b7=h,a9=0;a9<o;++a9,++b7,++b6){if(!(b7<n))return A.a(q,b7)
b8=q[b7]
if(!(b6>=0&&b6<n))return A.a(q,b6)
b9=q[b6]
k=b8===b9?b8:b8+(b9-b8)*a3
m&2&&A.d(c1)
c1[a9]=k}else for(n=q.length,m=c1.$flags|0,a9=0;a9<o;++a9){b4=s.cj(a0+4*B.a.T(a9,a1),a)
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
A.du.prototype={
eC(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i=this,h=i.a,g=h.length
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
eq(a,b){var s,r,q,p,o,n,m,l,k,j,i,h=this
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
for(m=n,l=0;l+1<m;){k=B.a.L(l+m,1)
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
A.fV.prototype={
h7(){var s,r,q,p,o,n,m,l,k,j,i=this.a,h=J.R(i)
switch(A.j(A.X(h.h(i,0)))){case 0:s=h.h(i,1)==null?null:A.H(h.h(i,1))
r=A.j(A.X(h.h(i,2)))
i=new A.ds([0,h.gk(i)<=3||A.aO(h.h(i,3)),s,0,r])
break
case 1:s=A.H(h.h(i,1))
i=new A.dr([1,t.bm.a(h.h(i,2)),s,A.aO(h.h(i,3))])
break
case 2:s=A.j(A.X(h.h(i,1)))
r=A.H(h.h(i,2))
q=A.H(h.h(i,3))
p=A.X(h.h(i,4))
o=A.j(A.X(h.h(i,5)))
n=A.j(A.X(h.h(i,6)))
m=A.j(A.X(h.h(i,7)))
l=A.j(A.X(h.h(i,8)))
n=new A.dl([2,q,r,p,o,m,A.aO(h.h(i,9)),s,l,n])
i=n
break
case 5:s=A.j(A.X(h.h(i,1)))
r=A.H(h.h(i,2))
q=A.H(h.h(i,3))
p=A.j(A.X(h.h(i,4)))
o=A.j(A.X(h.h(i,5)))
n=A.X(h.h(i,6))
m=A.X(h.h(i,7))
l=A.j(A.X(h.h(i,8)))
k=A.j(A.X(h.h(i,9)))
j=A.j(A.X(h.h(i,10)))
l=new A.dm([5,q,r,m,k,A.aO(h.h(i,11)),s,n,o,p,j,l])
i=l
break
case 4:i=B.aE
break
default:i=A.r(B.a3)}return i}}
A.iV.prototype={
$3(a,b,c){return new A.aF(this.a.gck()-a,0-b.a-c,0-b.b)},
$S:73}
A.iU.prototype={
$1(a){var s,r,q=this.b
if(q.gv().length<a){s=Math.max(65536,q.gv().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.az(s,0)}},
$S:6}
A.iW.prototype={
$1(a){return A.b6(this.a.gv(),0,a)},
$S:75}
A.iX.prototype={
$1(a){var s,r=this,q=r.b
if(q.gv().length<=262144){r.a.a=0
return}if(a<=65536){s=r.a
if(++s.a>=16){s.a=0
s=r.c
s.a=null
s.b=-1
q.az(65536,0)}}else r.a.a=0},
$S:6}
A.iZ.prototype={
$3(a,b,c){var s
if(!this.a.hp(b,c))return
s=this.b.A(0,a)
if(s==null)return
this.c.ct(s)},
$S:76}
A.iY.prototype={
$2(a,b){var s,r,q,p,o=this,n=o.a,m=n.A(0,a)
if(m!=null)o.b.ct(m)
o.c.A(0,a)
for(s=o.b,r=A.n(n).i("P<1>");n.a>=24;){q=new A.P(n,r).gD(0)
if(!q.t())A.r(A.ae())
p=n.A(0,q.gB())
p.toString
s.ct(p)}n.q(0,a,b)},
$S:77}
A.j0.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.dq(3,b,a):new A.c3(1,s,a)
this.b.ai(r)},
$S:78}
A.j_.prototype={
$13$cancelSlot$cancelToken$contentKey$entryKey$frameStep$height$poster$reqId$startFrame$stripCount$stripStart$totalFrames$width(f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9=this,f0=null
try{c8=f1>=0
if(c8&&0!==f2){a8=e9.b
e9.a.ai(new A.cv(5,f8,a8.at+a8.CW))
return}c9=e9.c
c9.a=null
c9.b=-1
s=g0>1?1:0
c9=s
if(typeof c9!=="number")return A.ah(c9)
r=g0*f6+(g0-1)*c9
c9=r
if(typeof c9!=="number")return A.ah(c9)
q=g3*c9
e9.d.$1(q)
c9=s
if(typeof c9!=="number")return c9.hW()
if(c9>0){p=1
c9=e9.e
d0=t.a
for(;;){d1=p
if(typeof d1!=="number")return d1.cD()
if(!(d1<g0))break
d1=p
d2=s
if(typeof d2!=="number")return A.ah(d2)
if(typeof d1!=="number")return d1.ah()
o=(d1*(f6+d2)-1)*g3
d1=c9.c
if(d1!=null){d2=d0.a(A.w($.l.memory).buffer)
d3=c9.b
d1=new Uint32Array(d2,d1,d3)}else{d1=c9.d
d1.toString}d2=o
if(typeof d2!=="number")return d2.aE()
B.j.ac(d1,o,d2+g3,0)
d1=p
if(typeof d1!=="number")return d1.aE()
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
if(typeof e0!=="number")return e0.cD()
if(!(e0<g0))break
A:{if(c8&&d7){e9.a.ai(new A.cv(5,f8,c9.at+c9.CW))
e9.f.$1(q)
return}e0=b
if(typeof e0!=="number")return A.ah(e0)
a=A.p4(g1+e0,g2,f5)
e0=a
if(typeof e0!=="number")return A.ah(e0)
a0=f9+e0
e0=b
e1=s
if(typeof e1!=="number")return A.ah(e1)
if(typeof e0!=="number")return e0.ah()
a1=e0*(f6+e1)
e1=a1
if(typeof e1!=="number")return e1.ah()
a2=e1*g3
e1=A.j(a2)
e0=A.j(n)
e2=e1+e0
A.b4(e1,e2,d6.b)
e3=d6.c
e4=e3==null
e5=e4?f0:e3+e1*4
if(e4){e4=d6.d
e4.toString
e2=A.jF(e4,e1,e2)
e1=e2}else e1=f0
a3=new A.b3(!1,e0,e5,e1)
e1=a3
e0=e1.c
if(e0!=null){e2=d8.a(A.w($.l.memory).buffer)
d3=e1.b
e0=new Uint32Array(e2,e0,d3)}else{e0=e1.d
e0.toString}a4=c9.hT(A.b6(e0,0,f0),f4,a,f6,f7,g2,g3)
if(a4){e0=l
if(typeof e0!=="number")return e0.aE()
l=e0+1
if(d==null)d=a
if(g){a5=c9.cy
a6=c9.db
if(d9){f=a5
e=a6}else if(J.m(a5,0)&&J.m(a6,0))g=!1
else{a7=A.km(f,e,a5,a6)
a8=null
a9=null
a8=a7.a
a9=a7.b
f=a8
e=a9}}break A}if(c==null)c=d2.A(0,f3)
if(c==null){e9.w.$2(f8,f3)
return}d2.q(0,f3,c)
b0=d4.gck()
b1=B.G
b2=0
e0=c.a
A.lq(e0,a0,a3,g3,f6,d5,f0)
b3=d1.$3(b0,b1,b2)
e0=j
e1=b3.a
if(typeof e0!=="number")return e0.aE()
j=e0+e1
e1=i
e0=b3.b
if(typeof e1!=="number")return e1.aE()
i=e1+e0
e0=h
e1=b3.c
if(typeof e0!=="number")return e0.aE()
h=e0+e1
e1=m
if(typeof e1!=="number")return e1.aE()
m=e1+1
e1=a3
e0=e1.c
if(e0!=null){e2=d8.a(A.w($.l.memory).buffer)
d3=e1.b
e0=new Uint32Array(e2,e0,d3)}else{e0=e1.d
e0.toString}b4=c9.cJ(f4,a,f6,f7,d0,A.b6(e0,0,f0),g2,g3)
if(b4.a[2]>0)k=b4.a[2]
if(g){b5=b4.a[3]
b6=b4.a[4]
if(d9){f=b5
e=b6}else if(J.m(b5,0)&&J.m(b6,0))g=!1
else{b7=A.km(f,e,b5,b6)
b8=null
b9=null
b8=b7.a
b9=b7.b
f=b8
e=b9}}}e0=b
if(typeof e0!=="number")return e0.aE()
b=e0+1}c0=e9.as.$1(q)
c1=new Uint8Array(A.ad(c0))
c2=null
c3=null
if(!g){c2=0
c3=0}else if(d9){c2=f
c3=e}else{e6=f^g0
e7=e+A.aq(g0,2654435761)>>>0
e6=A.aq((e6^e6>>>15)>>>0,2246822519)
e6=(e6^e6>>>13)>>>0
e7=A.aq((e7^e7>>>16)>>>0,3266489917)
e7=(e7^e7>>>15)>>>0
c4=new A.y(e6,e6===0&&e7===0?1:e7)
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
e9.a.ai(new A.dn([4,a9,b8,f4,c2,c3,d0,c8,c1,c6,f8,g0,r,g1,g3,d1*4,a8,b9+c5]))
e9.f.$1(q)
e9.at.$3(f3,f4,g2)
if(!f7&&d!=null)c9.ee(f4,d,f6,g2,g3)}catch(e8){c7=A.ai(e8)
e9.a.ai(new A.c3(1,J.bM(c7),f8))}},
$S:79}
A.iT.prototype={
$1(g9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7=this,g8=null
A:{if(g9==null){a7=g7.b
a7.cf()
a7.dZ()
g7.c.l(0)
g7.d.a0()
g7.e.a0()
g7.f.a.ce()
A.w(v.G.self).close()
return}a8=t.am.b(g9)
a9=g8
b0=g8
b1=g8
b2=g8
a7=!1
if(a8){b3=g9.a
b4=b3[0]
if(0===b4){b5=b3[2]
if(t.dk.b(b5)){A.im(b5)
b6=b3[3]
if(A.o(b6)){A.j(b6)
b7=b3[4]
if(A.o(b7)){A.j(b7)
b8=b3[1]
a7=A.b1(b8)
if(a7){A.aO(b8)
b2=b8}b1=b7}b0=b6}a9=b5}}}else b4=g8
if(a7){a7=g7.b
a7.b=A.j(b1)
a7.da(0)
a7.shC(b0)
a7.sh3(b2)
a7.eu(a9)
break A}b9=t.hh.b(g9)
c0=g8
c1=g8
c2=!1
if(b9){if(a8)a7=b4
else{b4=A.N()
a7=b4
a8=!0}c0=1===a7
a7=c0
if(a7){c1=A.N()
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
c2=c3}s=A.H(b3)
b3=g9.a
c4=b3[1]
c5=t.p
if(c5.b(c4)){r=c5.a(c4)
c6=b3[3]
a7=A.b1(c6)
if(a7)q=A.aO(c6)}}}}if(a7){try{a7=s
b3=A.oL(r)
c5=A.jG(new A.dR(q))
c7=new Float32Array(256)
c8=b3.length
c9=new A.i0(b3,c8,c7,new Float64Array(64))
if(c8>=3&&b3[0]===239&&b3[1]===187&&b3[2]===191)c9.c=3
c9.U()
d0=c9.bY(g8)
c9.U()
b3=c9.c
if(b3!==c8)A.r(A.U("Unexpected trailing character at "+b3,g8,g8))
if(!t.P.b(d0))A.r(B.a5)
c5.h2(d0)
g7.r.$2(a7,new A.cj(c5))}catch(d1){p=A.ai(d1)
a7=g7.w
if(a7.a>=24)a7.A(0,new A.P(a7,A.n(a7).i("P<1>")).ga5(0))
a7.q(0,s,J.bM(p))}break A}o=null
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
d4=A.o(d2)
if(d4){A.j(d2)
o=d2
d3=b3[2]
if(typeof d3=="string"){A.H(d3)
n=d3
if(c2)c5=c1
else{c1=b3[1]
c5=c1
c2=c3}if(typeof c5=="string"){if(c2)c5=c1
else{c1=b3[1]
c5=c1
c2=c3}m=A.H(c5)
e4=b3[3]
if(typeof e4=="number"){l=A.X(e4)
e5=b3[4]
d6=A.o(e5)
if(d6){k=A.j(e5)
d5=b3[9]
d8=A.o(d5)
if(d8){A.j(d5)
j=d5
d7=b3[5]
e0=A.o(d7)
if(e0){A.j(d7)
i=d7
d9=b3[8]
e2=A.o(d9)
if(e2){A.j(d9)
h=d9
e1=b3[6]
a7=A.b1(e1)
if(a7){A.aO(e1)
g=e1}}}}}}}}}}}else e3=!1
if(a7){try{a7=j
b3=i
if(typeof a7!=="number")return a7.ah()
if(typeof b3!=="number")return A.ah(b3)
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
d=a7.el(e8,e,c5,k,c8,e7,e6,c7)
if(d){g7.Q.$3(m,n,h)
c=new Uint8Array(A.ad(e))
b3=a7.at
c5=a7.CW
c7=e.byteLength
c8=a7.cy
g7.f.ai(new A.ct([0,-1,n,c8,a7.db,0,0,c,0,o,c7,!1,b3+c5]))
g7.as.$1(f)
if(!g){b3=n
c5=j
c7=i
c8=h
a7.ee(b3,k,c7,c8,c5)}return}c5=g7.c
b=c5.A(0,m)
if(b==null){g7.at.$2(o,m)
return}c5.q(0,m,b)
e8.a=null
e8.b=-1
a=g7.ax.gck()
a0=B.G
a1=0
c5=l
c7=j
c8=i
A.lq(b.geT(),c5,g7.e,c7,c8,g7.d,g8)
a2=g7.ay.$3(a,a0,a1)
a3=b3.$1(f)
b3=n
c8=j
c7=i
c5=h
e6=g
a4=a7.cJ(b3,k,c7,e6,g7.ch,a3,c5,c8)
a5=new Uint8Array(A.ad(a3))
c8=a4.a[2]
c5=a7.at
a7=a7.CW
e6=a2.a
c7=a2.b
b3=a2.c
e7=a3.byteLength
e8=a4.a[3]
g7.f.ai(new A.ct([0,c8,n,e8,a4.a[4],b3,c7,a5,e6,o,e7,!0,c5+a7]))
g7.as.$1(f)
g7.Q.$3(m,n,h)}catch(d1){a6=A.ai(d1)
g7.f.ai(new A.c3(1,J.bM(a6),o))}break A}e9=g8
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
e3=g1}if(A.o(b3)){if(e3)b3=d2
else{d2=g9.a[6]
b3=d2
e3=g1}A.j(b3)
if(d4)c5=d3
else{d3=g9.a[2]
c5=d3
d4=g2}if(typeof c5=="string"){if(d4)c5=d3
else{d3=g9.a[2]
c5=d3
d4=g2}A.H(c5)
if(c2)c7=c1
else{c1=g9.a[1]
c7=c1
c2=c3}f0=typeof c7=="string"
if(f0){if(c2)c7=c1
else{c1=g9.a[1]
c7=c1
c2=c3}A.H(c7)
c8=g9.a
e9=c8[9]
f2=A.o(e9)
if(f2){A.j(e9)
f1=c8[8]
f4=A.o(f1)
if(f4){A.j(f1)
f3=c8[7]
f6=typeof f3=="number"
if(f6){A.X(f3)
f5=c8[3]
if(typeof f5=="number"){A.X(f5)
if(d6)e6=d5
else{d5=c8[11]
e6=d5
d6=g3}if(A.o(e6)){if(d6)e6=d5
else{d5=c8[11]
e6=d5
d6=g3}A.j(e6)
if(d8)e7=d7
else{d7=c8[4]
e7=d7
d8=g4}if(A.o(e7)){if(d8)e7=d7
else{d7=c8[4]
e7=d7
d8=g4}A.j(e7)
if(e0)e8=d9
else{d9=c8[10]
e8=d9
e0=g5}if(A.o(e8)){if(e0)e8=d9
else{d9=c8[10]
e8=d9
e0=g5}A.j(e8)
if(e2)a7=e1
else{e1=c8[5]
a7=e1
e2=g6}a7=A.b1(a7)
if(a7){if(e2)c8=e1
else{e1=c8[5]
c8=e1
e2=g6}A.aO(c8)
g=c8}h=e8}i=e7}j=e6}g0=f5}f9=f3}f8=f1}f7=e9}s=c7}n=c5}o=b3}}}if(a7){g7.CW.$13$cancelSlot$cancelToken$contentKey$entryKey$frameStep$height$poster$reqId$startFrame$stripCount$stripStart$totalFrames$width(-1,0,s,n,g0,i,g,o,f9,f8,f7,h,j)
break A}if(t.bx.b(g9)){g2=!0
if(a8)a7=b4
else{b4=A.N()
a7=b4
a8=!0}if(6===a7){if(e3)a7=d2
else{d2=A.N()
a7=d2
e3=!0}if(A.o(a7)){A.j(e3?d2:A.N())
if(d4)a7=d3
else{d3=A.N()
a7=d3
d4=g2}if(typeof a7=="string"){if(d4)a7=d3
else{d3=A.N()
a7=d3
d4=g2}A.H(a7)
if(c2)a7=c1
else{c1=A.N()
a7=c1
c2=!0}if(typeof a7=="string"){A.H(c2?c1:A.N())
if(f0)a7=e9
else{e9=A.N()
a7=e9
f0=!0}if(A.o(a7)){A.j(f0?e9:A.N())
if(f2)a7=f1
else{f1=A.N()
a7=f1
f2=!0}if(A.o(a7)){A.j(f2?f1:A.N())
if(f4)a7=f3
else{f3=A.N()
a7=f3
f4=!0}if(typeof a7=="number"){A.X(f4?f3:A.N())
if(f6)a7=f5
else{f5=A.N()
a7=f5
f6=!0}if(typeof a7=="number"){A.X(f6?f5:A.N())
if(d6)a7=d5
else{d5=A.N()
a7=d5
d6=!0}if(A.o(a7)){A.j(d6?d5:A.N())
if(d8)a7=d7
else{d7=A.N()
a7=d7
d8=!0}if(A.o(a7)){A.j(d8?d7:A.N())
if(e0)a7=d9
else{d9=A.N()
a7=d9
e0=!0}if(A.o(a7)){A.j(e0?d9:A.N())
if(e2)a7=e1
else{e1=A.N()
a7=e1
e2=!0}if(A.b1(a7)){A.aO(e2?e1:A.N())
A.N()}}}}}}}}}}}}}n=g8
a7=!1
if(t.bn.b(g9)){if(a8)b3=b4
else{b4=A.N()
b3=b4
a8=!0}if(3===b3){if(d4)a7=d3
else{d3=A.N()
a7=d3
d4=!0}a7=typeof a7=="string"
if(a7)n=A.H(d4?d3:A.N())}}if(a7){a7=g7.b
a7.hd(n)
a7.hi(n)
g7.f.ai(new A.cu(2,n,a7.at+a7.CW))
break A}if(t.dn.b(g9))a7=4===(a8?b4:g9.a)
else a7=!1
if(a7){a7=g7.z
a7.a=null
a7.b=-1
a7=g7.b
a7.dZ()
a7.cf()
a7.cF()
g7.c.l(0)
g7.w.l(0)
b3=g7.d
b3.eh()
b3.ek(!0)
b3=g7.ch
b3.c=0
if(b3.b.length>131072)b3.b=new Uint8Array(131072)
g7.a.a=0
b3=g7.e
if(b3.gv().length>65536)b3.az(65536,0)
g7.f.ai(new A.cu(2,"",a7.at+a7.CW))}}},
$S:80}
A.iL.prototype={
$1(a){return this.eo(a)},
eo(a5){var s=0,r=A.ln(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.lu(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.fV(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.j(A.X(J.aj(n.a,0)))!==-1||A.j(A.X(J.aj(n.a,1)))!==4)throw A.f(B.X)
q=10
s=13
return A.io(A.k3(A.w(A.w(v.G.self).fetch(A.H(J.aj(n.a,2)))),t.m),$async$$1)
case 13:m=a7
s=A.aO(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.io(A.k3(A.w(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.io(a3.iJ(a4.ju(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.p7(o.b)
d.a=!0
l=null
k=null
d=$.l
j=A.k_([-2,4,d!=null])
l=j.a
k=j.b
A.w(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.n(d)
a=b.c.a(n.h7())
a0=d.b
if(a0>=4)A.r(d.cR())
if((a0&1)!==0)d.c1(a)
else if((a0&3)===0)d.d0().m(0,new A.bY(a,b.i("bY<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.ai(a2)
h=null
g=null
f=A.k_([-3,A.x(i)])
h=f.a
g=f.b
A.w(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.l9(null,r)
case 1:return A.l8(p.at(-1),r)}})
return A.la($async$$1,r)},
$S:81}
A.iM.prototype={
$1(a){return A.mu(new A.iL(this.a,this.b).$1(A.w(a)),t.b)},
$S:82}
A.hi.prototype={
ai(a){var s=A.oN(a)
A.w(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bz.prototype
s.ez=s.u
s=A.A.prototype
s.cK=s.K})();(function installTearOffs(){var s=hunkHelpers._static_0,r=hunkHelpers._static_1,q=hunkHelpers._static_2,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(A,"oi","mP",3)
r(A,"oB","na",5)
r(A,"oC","nb",5)
r(A,"oD","nc",5)
s(A,"lw","ow",0)
q(A,"oF","ol",9)
s(A,"oE","ok",0)
p(A.M.prototype,"geU","eV",9)
r(A,"k4","dD",1)
var m
o(m=A.ez.prototype,"ghO","E",43)
o(m,"gba","cH",44)
o(m,"ghe","hf",45)
o(m,"ghz","hA",46)
o(m,"ghw","cs",47)
p(m=A.am.prototype,"gfZ","p",68)
n(m,"ghg","a2",0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.e,null)
q(A.e,[A.jo,J.D,A.d3,J.bN,A.O,A.bw,A.fE,A.k,A.bT,A.db,A.d4,A.cJ,A.I,A.bE,A.Q,A.de,A.bg,A.fS,A.fu,A.cK,A.dv,A.J,A.fj,A.cR,A.aR,A.cQ,A.dY,A.df,A.cm,A.h3,A.eF,A.ig,A.aT,A.aV,A.eA,A.id,A.ia,A.er,A.aw,A.ev,A.bm,A.M,A.es,A.d6,A.dw,A.et,A.dd,A.bG,A.ew,A.aY,A.eI,A.fX,A.eE,A.bp,A.A,A.dO,A.dQ,A.eN,A.hj,A.e8,A.d5,A.hk,A.a0,A.bA,A.a2,A.eJ,A.fG,A.ck,A.ft,A.fa,A.fW,A.fc,A.ep,A.dT,A.bD,A.hh,A.dV,A.eH,A.eZ,A.fl,A.fP,A.el,A.aC,A.be,A.b3,A.fo,A.i8,A.cj,A.fy,A.ag,A.bX,A.c,A.bF,A.hl,A.i5,A.ez,A.bn,A.Y,A.br,A.bI,A.cq,A.c4,A.ac,A.hU,A.ey,A.ab,A.aa,A.aX,A.eB,A.bq,A.by,A.am,A.aJ,A.f6,A.ci,A.i0,A.dR,A.fg,A.F,A.du,A.fV,A.hi])
q(J.D,[J.cM,J.cO,J.V,J.bP,J.bQ,J.cP,J.cf])
q(J.V,[J.bz,J.z,A.bB,A.cW])
q(J.bz,[J.e9,J.d9,J.az])
r(J.dW,A.d3)
r(J.fd,J.z)
q(J.cP,[J.cN,J.dX])
q(A.O,[A.bd,A.bk,A.dZ,A.eo,A.ed,A.cF,A.ex,A.b2,A.da,A.en,A.bi,A.dP])
q(A.bw,[A.dM,A.dN,A.ek,A.iG,A.iI,A.h_,A.fZ,A.ip,A.hL,A.fH,A.f7,A.iQ,A.iR,A.fb,A.hO,A.f1,A.f_,A.f0,A.iu,A.hf,A.h5,A.h4,A.hc,A.ha,A.h8,A.h9,A.h7,A.he,A.ic,A.hg,A.hm,A.hZ,A.hX,A.hY,A.i_,A.hQ,A.hS,A.hT,A.hR,A.i2,A.i1,A.i9,A.fK,A.fN,A.fh,A.iV,A.iU,A.iW,A.iX,A.iZ,A.j_,A.iT,A.iL,A.iM])
q(A.dM,[A.iO,A.fw,A.h0,A.h1,A.ib,A.hD,A.hH,A.hG,A.hF,A.hE,A.hK,A.hJ,A.hI,A.fI,A.i7,A.i6,A.h2,A.i3,A.fY,A.iy,A.ii,A.ih,A.hP,A.il,A.fQ,A.fq,A.hA,A.hB,A.hu,A.hv,A.hw,A.hx,A.hy,A.hz,A.ho,A.hq,A.hp,A.hC,A.hn,A.hs,A.hr,A.ht,A.fL])
q(A.k,[A.p,A.bW,A.bh,A.eq])
q(A.p,[A.a9,A.cI,A.P,A.bS,A.bR])
q(A.a9,[A.d7,A.a1,A.eD])
r(A.ce,A.bh)
q(A.Q,[A.cr,A.an,A.c2,A.b8])
r(A.dk,A.cr)
q(A.an,[A.cs,A.dl,A.dm,A.ct,A.dn,A.b9,A.dr,A.cw,A.ds,A.bH])
q(A.c2,[A.y,A.dp])
q(A.b8,[A.aF,A.dq,A.cu,A.c3,A.cv])
q(A.bg,[A.cH,A.dt])
r(A.S,A.cH)
r(A.cZ,A.bk)
q(A.ek,[A.ef,A.cd])
r(A.eM,A.cF)
q(A.J,[A.bc,A.eC])
q(A.dN,[A.fe,A.iH,A.iq,A.iA,A.hM,A.fm,A.fn,A.hW,A.f9,A.f8,A.f2,A.fz,A.fA,A.fB,A.fC,A.ix,A.h6,A.hb,A.hd,A.iY,A.j0])
r(A.ak,A.bc)
r(A.cg,A.bB)
r(A.eG,A.eF)
r(A.cT,A.eG)
r(A.eO,A.cT)
r(A.eL,A.eO)
q(A.cW,[A.e1,A.af])
q(A.af,[A.dg,A.di])
r(A.dh,A.dg)
r(A.bC,A.dh)
r(A.dj,A.di)
r(A.aB,A.dj)
q(A.bC,[A.ch,A.cU])
q(A.aB,[A.e3,A.cV,A.e5,A.e6,A.cX,A.cY,A.bU])
r(A.cx,A.ex)
r(A.dc,A.ev)
r(A.cn,A.dw)
r(A.dy,A.d6)
r(A.co,A.dy)
r(A.cp,A.dd)
r(A.bY,A.bG)
r(A.bo,A.dt)
r(A.c0,A.bo)
r(A.e_,A.dO)
r(A.ff,A.dQ)
q(A.b2,[A.bf,A.dS])
q(A.fW,[A.hN,A.ik])
q(A.bD,[A.e0,A.ee,A.bV])
q(A.a0,[A.cc,A.fU])
q(A.cc,[A.cE,A.dK])
r(A.cG,A.hj)
r(A.dU,A.dV)
q(A.eB,[A.aE,A.aZ,A.b7])
s(A.eF,A.A)
s(A.eG,A.I)
s(A.dg,A.A)
s(A.dh,A.I)
s(A.di,A.A)
s(A.dj,A.I)
s(A.eO,A.bE)
s(A.cn,A.et)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",i:"double",ca:"num",q:"String",t:"bool",a2:"Null",v:"List",e:"Object",al:"Map",K:"JSObject"},mangledNames:{},types:["~()","t(B)","t(ac)","b()","~(@)","~(~())","~(b)","a2(@)","a2()","~(e,aD)","@()","t()","t(+(q,b))","t(@)","bx(@,c,bx?,b,b)","~(i,i,i,i,i,i,i,i)","@(@,q)","a2(az,az)","e?(e?)","e(e,aD)","t(bD)","@(q)","~(aW)","t(b,aW)","+(b,b)(b)","@(@)","v<b>()","ay<~>()","t(e,bX)","t(e,ag<am>)","t(e,ag<i>)","t(bn,ag<b3>)","~(ac,aJ)","t(ab)","F(b{dimensions:b})","~(b,b)","a2(@,aD)","i(q,i)","~(b,@)","~(@,b)","~(v<B>)","B(Y)","a2(~())","F(F)","B(B)","aL(aL)","ac(ac)","ab(ab)","F()","c4()","Y()","br()","aX()","aE()","aZ()","a2(e,aD)","bq()","aa()","bn()","bI()","cq()","ac()","ab()","bF()","t(F)","b(i)","~(e?,e?)","t(aL)","~(i,i)","d8()","b(b,b,i)","i(i)","i(i,i,i)","+(b,b,b)(b,+calls,copiedBytes(b,b),b)","~(q,@)","aW(b)","~(q,q,b)","~(q,cj)","~(b,q)","~({cancelSlot!b,cancelToken!b,contentKey!q,entryKey!q,frameStep!i,height!b,poster!t,reqId!b,startFrame!i,stripCount!b,stripStart!b,totalFrames!b,width!b})","~(e?)","ay<a2>(K)","K(K)","b7()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.dk&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.y&&a.b(c.a)&&b.b(c.b),"2;calls,copiedBytes":(a,b)=>c=>c instanceof A.dp&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.aF&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;contentKey,requestId":(a,b,c)=>d=>d instanceof A.dq&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;entryKey,workerRamBytes":(a,b,c)=>d=>d instanceof A.cu&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;message,requestId":(a,b,c)=>d=>d instanceof A.c3&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;requestId,workerRamBytes":(a,b,c)=>d=>d instanceof A.cv&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.b9&&A.bu(a,b.a),"4;bytes,contentKey,useSimd":a=>b=>b instanceof A.dr&&A.bu(a,b.a),"5;deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes":a=>b=>b instanceof A.ds&&A.bu(a,b.a),"5;compressedBytes,crc31,entryDiskBytes,fpHi,fpLo":a=>b=>b instanceof A.cw&&A.bu(a,b.a),"6;":a=>b=>b instanceof A.bH&&A.bu(a,b.a),"10;":a=>b=>b instanceof A.cs&&A.bu(a,b.a),"10;contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width":a=>b=>b instanceof A.dl&&A.bu(a,b.a),"12;contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width":a=>b=>b instanceof A.dm&&A.bu(a,b.a),"13;entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes":a=>b=>b instanceof A.ct&&A.bu(a,b.a),"18;compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes":a=>b=>b instanceof A.dn&&A.bu(a,b.a)}}
A.nz(v.typeUniverse,JSON.parse('{"az":"bz","e9":"bz","d9":"bz","pm":"bB","cM":{"D":[],"t":[],"C":[]},"cO":{"D":[],"a2":[],"C":[]},"V":{"D":[],"K":[]},"bz":{"V":[],"D":[],"K":[]},"bP":{"D":[]},"bQ":{"D":[]},"z":{"v":["1"],"V":[],"p":["1"],"D":[],"K":[],"k":["1"]},"dW":{"d3":[]},"fd":{"z":["1"],"v":["1"],"V":[],"p":["1"],"D":[],"K":[],"k":["1"]},"bN":{"a6":["1"]},"cP":{"i":[],"ca":[],"D":[]},"cN":{"i":[],"b":[],"ca":[],"D":[],"C":[]},"dX":{"i":[],"ca":[],"D":[],"C":[]},"cf":{"q":[],"D":[],"fv":[],"C":[]},"bd":{"O":[]},"p":{"k":["1"]},"a9":{"p":["1"],"k":["1"]},"d7":{"a9":["1"],"p":["1"],"k":["1"],"a9.E":"1","k.E":"1"},"bT":{"a6":["1"]},"a1":{"a9":["2"],"p":["2"],"k":["2"],"a9.E":"2","k.E":"2"},"bW":{"k":["1"],"k.E":"1"},"db":{"a6":["1"]},"bh":{"k":["1"],"k.E":"1"},"ce":{"bh":["1"],"p":["1"],"k":["1"],"k.E":"1"},"d4":{"a6":["1"]},"cI":{"p":["1"],"k":["1"],"k.E":"1"},"cJ":{"a6":["1"]},"dk":{"cr":[],"Q":[]},"cs":{"an":[],"Q":[]},"dl":{"an":[],"Q":[]},"dm":{"an":[],"Q":[]},"ct":{"an":[],"Q":[]},"dn":{"an":[],"Q":[]},"y":{"c2":[],"Q":[]},"dp":{"c2":[],"Q":[]},"aF":{"b8":[],"Q":[]},"dq":{"b8":[],"Q":[]},"cu":{"b8":[],"Q":[]},"c3":{"b8":[],"Q":[]},"cv":{"b8":[],"Q":[]},"b9":{"an":[],"Q":[]},"dr":{"an":[],"Q":[]},"cw":{"an":[],"Q":[]},"ds":{"an":[],"Q":[]},"bH":{"an":[],"Q":[]},"de":{"a6":["1"]},"cH":{"bg":["1"],"b5":["1"],"p":["1"],"k":["1"]},"S":{"cH":["1"],"bg":["1"],"b5":["1"],"p":["1"],"k":["1"]},"cZ":{"bk":[],"O":[]},"dZ":{"O":[]},"eo":{"O":[]},"dv":{"aD":[]},"bw":{"bO":[]},"dM":{"bO":[]},"dN":{"bO":[]},"ek":{"bO":[]},"ef":{"bO":[]},"cd":{"bO":[]},"ed":{"O":[]},"eM":{"O":[]},"bc":{"J":["1","2"],"jq":["1","2"],"al":["1","2"],"J.K":"1","J.V":"2"},"P":{"p":["1"],"k":["1"],"k.E":"1"},"cR":{"a6":["1"]},"bS":{"p":["1"],"k":["1"],"k.E":"1"},"aR":{"a6":["1"]},"bR":{"p":["bA<1,2>"],"k":["bA<1,2>"],"k.E":"bA<1,2>"},"cQ":{"a6":["bA<1,2>"]},"ak":{"bc":["1","2"],"J":["1","2"],"jq":["1","2"],"al":["1","2"],"J.K":"1","J.V":"2"},"c2":{"Q":[]},"cr":{"Q":[]},"b8":{"Q":[]},"an":{"Q":[]},"dY":{"mW":[],"fv":[]},"df":{"eb":[]},"eq":{"k":["eb"],"k.E":"eb"},"cm":{"a6":["eb"]},"cg":{"bB":[],"V":[],"D":[],"K":[],"C":[]},"bB":{"V":[],"D":[],"K":[],"C":[]},"cT":{"f4":[],"A":["a5"],"v":["a5"],"p":["a5"],"k":["a5"],"I":["a5"],"L":[],"C":[],"A.E":"a5","I.E":"a5"},"eL":{"f4":[],"A":["a5"],"bE":["a5"],"v":["a5"],"p":["a5"],"k":["a5"],"I":["a5"],"L":[],"C":[],"A.E":"a5","bE.E":"a5","I.E":"a5"},"cW":{"V":[],"D":[],"K":[],"L":[]},"e1":{"V":[],"D":[],"K":[],"L":[],"C":[]},"af":{"aA":["1"],"V":[],"D":[],"K":[],"L":[]},"bC":{"A":["i"],"af":["i"],"v":["i"],"aA":["i"],"V":[],"p":["i"],"D":[],"K":[],"L":[],"k":["i"],"I":["i"]},"aB":{"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"]},"ch":{"bC":[],"bx":[],"A":["i"],"af":["i"],"v":["i"],"aA":["i"],"V":[],"p":["i"],"D":[],"K":[],"L":[],"k":["i"],"I":["i"],"C":[],"A.E":"i","I.E":"i"},"cU":{"bC":[],"f5":[],"A":["i"],"af":["i"],"v":["i"],"aA":["i"],"V":[],"p":["i"],"D":[],"K":[],"L":[],"k":["i"],"I":["i"],"C":[],"A.E":"i","I.E":"i"},"e3":{"aB":[],"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"],"C":[],"A.E":"b","I.E":"b"},"cV":{"aB":[],"jj":[],"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"],"C":[],"A.E":"b","I.E":"b"},"e5":{"aB":[],"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"],"C":[],"A.E":"b","I.E":"b"},"e6":{"aB":[],"jE":[],"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"],"C":[],"A.E":"b","I.E":"b"},"cX":{"aB":[],"d8":[],"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"],"C":[],"A.E":"b","I.E":"b"},"cY":{"aB":[],"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"],"C":[],"A.E":"b","I.E":"b"},"bU":{"aB":[],"aW":[],"A":["b"],"af":["b"],"v":["b"],"aA":["b"],"V":[],"p":["b"],"D":[],"K":[],"L":[],"k":["b"],"I":["b"],"C":[],"A.E":"b","I.E":"b"},"aT":{"a5":[]},"ex":{"O":[]},"cx":{"bk":[],"O":[]},"aw":{"O":[]},"dc":{"ev":["1"]},"M":{"ay":["1"]},"dw":{"kF":["1"],"fF":["1"],"kY":["1"],"bZ":["1"]},"cn":{"et":["1"],"dw":["1"],"kF":["1"],"fF":["1"],"kY":["1"],"bZ":["1"]},"co":{"dy":["1"],"d6":["1"]},"cp":{"dd":["1"],"eg":["1"],"bZ":["1"]},"dd":{"eg":["1"],"bZ":["1"]},"dy":{"d6":["1"]},"bY":{"bG":["1"]},"ew":{"bG":["@"]},"bo":{"bg":["1"],"b5":["1"],"p":["1"],"k":["1"]},"c0":{"bo":["1"],"bg":["1"],"b5":["1"],"p":["1"],"k":["1"]},"bp":{"a6":["1"]},"J":{"al":["1","2"]},"bg":{"b5":["1"],"p":["1"],"k":["1"]},"dt":{"bg":["1"],"b5":["1"],"p":["1"],"k":["1"]},"eC":{"J":["q","@"],"al":["q","@"],"J.K":"q","J.V":"@"},"eD":{"a9":["q"],"p":["q"],"k":["q"],"a9.E":"q","k.E":"q"},"e_":{"dO":["e?","q"]},"i":{"ca":[]},"b":{"ca":[]},"v":{"p":["1"],"k":["1"]},"b5":{"p":["1"],"k":["1"]},"q":{"fv":[]},"cF":{"O":[]},"bk":{"O":[]},"b2":{"O":[]},"bf":{"O":[]},"dS":{"bf":[],"O":[]},"da":{"O":[]},"en":{"O":[]},"bi":{"O":[]},"dP":{"O":[]},"e8":{"O":[]},"d5":{"O":[]},"eJ":{"aD":[]},"ep":{"fF":["v<b>"]},"e0":{"bD":[]},"ee":{"bD":[]},"dU":{"dV":[]},"bV":{"bD":[]},"Y":{"B":[]},"br":{"B":[]},"aa":{"B":[],"aL":[]},"aX":{"B":[]},"aE":{"B":[]},"aZ":{"B":[]},"b7":{"B":[]},"bq":{"aL":[]},"eB":{"B":[]},"ml":{"L":[]},"mw":{"v":["b"],"p":["b"],"L":[],"k":["b"]},"aW":{"v":["b"],"p":["b"],"L":[],"k":["b"]},"n8":{"v":["b"],"p":["b"],"L":[],"k":["b"]},"mv":{"v":["b"],"p":["b"],"L":[],"k":["b"]},"jE":{"v":["b"],"p":["b"],"L":[],"k":["b"]},"jj":{"v":["b"],"p":["b"],"L":[],"k":["b"]},"d8":{"v":["b"],"p":["b"],"L":[],"k":["b"]},"bx":{"v":["i"],"p":["i"],"L":[],"k":["i"]},"f5":{"v":["i"],"p":["i"],"L":[],"k":["i"]},"f4":{"v":["a5"],"p":["a5"],"L":[],"k":["a5"]}}'))
A.ny(v.typeUniverse,JSON.parse('{"af":1,"bG":1,"dt":1,"dQ":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.dI
return{a7:s("@<~>"),v:s("aw"),fA:s("cG"),M:s("S<q>"),gw:s("p<@>"),R:s("O"),Y:s("a5"),Z:s("bO"),gd:s("D"),bM:s("k<i>"),hf:s("k<@>"),hb:s("k<b>"),dh:s("z<f5>"),f:s("z<e>"),fM:s("z<am>"),hg:s("z<+(t,t)>"),bU:s("z<aJ>"),s:s("z<q>"),gC:s("z<F>"),a1:s("z<d8>"),gN:s("z<aW>"),V:s("z<aL>"),ch:s("z<ab>"),bE:s("z<ac>"),r:s("z<B>"),fq:s("z<Y>"),n:s("z<i>"),o:s("z<@>"),t:s("z<b>"),a2:s("z<b3?>"),a6:s("z<e?>"),cU:s("z<ab?>"),by:s("z<bI?>"),T:s("cO"),m:s("K"),g:s("az"),aU:s("aA<@>"),aX:s("V"),c2:s("ak<e,e>"),el:s("ak<e,bX>"),gt:s("ak<al<q,@>,aE>"),gS:s("ak<e,ag<am>>"),fk:s("ak<e,ag<i>>"),gj:s("ak<bn,ag<b3>>"),ew:s("v<e>"),W:s("v<pn>"),cH:s("v<B>"),dg:s("v<i>"),j:s("v<@>"),L:s("v<b>"),P:s("al<q,@>"),gq:s("al<ab,b>"),B:s("al<b,ab>"),aj:s("al<ab,+(b,c)>"),fP:s("a1<Y,B>"),a:s("cg"),d4:s("bC"),eB:s("aB"),bm:s("bU"),b:s("a2"),K:s("e"),bl:s("bV"),b8:s("bf"),fW:s("cj"),gT:s("po"),bQ:s("+()"),eS:s("+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),a8:s("+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),e6:s("+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),bx:s("+cancelSlot,cancelToken,contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),f2:s("+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),dn:s("+(e?)"),x:s("+(q,b)"),eG:s("+(b,c)"),bn:s("+entryKey(e?,e?)"),bP:s("+(q,i,i)"),h6:s("+(b,b,b)"),ca:s("+contentKey,requestId(e?,e?,e?)"),hh:s("+contentKey,scene(e?,e?,e?)"),dH:s("+entryKey,workerRamBytes(e?,e?,e?)"),bA:s("+message,requestId(e?,e?,e?)"),cm:s("+bytes,contentKey,useSimd(e?,e?,e?,e?)"),am:s("+deduplicateUploads,diskDirectory,maximumDiskBytes,maximumRamBytes(e?,e?,e?,e?,e?)"),d:s("eb"),bC:s("b5<e>"),k:s("b5<q>"),cJ:s("b5<b>"),l:s("aD"),N:s("q"),gz:s("el"),A:s("F"),dm:s("C"),E:s("bk"),h:s("L"),p:s("aW"),ak:s("d9"),eU:s("bW<B>"),co:s("cn<e?>"),G:s("bF"),az:s("bX"),bo:s("cq"),I:s("aL"),_:s("M<@>"),fJ:s("M<b>"),U:s("M<~>"),cK:s("bn"),eV:s("aa"),D:s("ab"),ai:s("c0<al<q,@>>"),ao:s("c0<e>"),J:s("ac"),eY:s("pP"),u:s("B"),bs:s("B(Y)"),g2:s("eH"),dL:s("ag<b3>"),b3:s("ag<am>"),e:s("ag<i>"),bD:s("Y"),fv:s("dx<e?>"),d1:s("c4"),e_:s("bI"),y:s("t"),al:s("t(e)"),aT:s("t(B)"),i:s("i"),z:s("@"),fO:s("@()"),w:s("@(e)"),C:s("@(e,aD)"),S:s("b"),c:s("bx(@,c,bx?,b,b)?"),eH:s("ay<a2>?"),an:s("K?"),bF:s("v<@>?"),aM:s("al<+(q,i,i),bF>?"),cq:s("al<q,al<q,@>>?"),X:s("e?"),ae:s("b5<e>?"),dk:s("q?"),g_:s("bF?"),ev:s("bG<@>?"),F:s("bm<@,@>?"),Q:s("eE?"),cn:s("du?"),fQ:s("t?"),cD:s("i?"),gs:s("b?"),cg:s("ca?"),g5:s("~()?"),cy:s("~(aW)?"),q:s("ca"),H:s("~"),O:s("~()"),d5:s("~(e)"),da:s("~(e,aD)"),cA:s("~(q,@)"),bp:s("~(i,i)"),fi:s("~(i,i,i,i,i,i,i,i)"),as:s("~(b,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a7=J.D.prototype
B.b=J.z.prototype
B.u=J.cM.prototype
B.a=J.cN.prototype
B.c=J.cP.prototype
B.p=J.cf.prototype
B.a8=J.az.prototype
B.a9=J.V.prototype
B.h=A.ch.prototype
B.f=A.cU.prototype
B.e=A.cV.prototype
B.j=A.cX.prototype
B.d=A.bU.prototype
B.F=J.e9.prototype
B.w=J.d9.prototype
B.o=new A.cG(0,"littleEndian")
B.t=new A.cG(1,"bigEndian")
B.J=new A.cJ(A.dI("cJ<0&>"))
B.K=new A.fa()
B.x=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.L=function() {
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
B.Q=function(getTagFallback) {
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
B.M=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.P=function(hooks) {
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
B.O=function(hooks) {
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
B.N=function(hooks) {
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
B.R=new A.e8()
B.m=new A.fE()
B.k=new A.fX()
B.A=new A.ew()
B.S=new A.hN()
B.q=new A.eJ()
B.T=new A.ik()
B.U=new A.a0("Truncated LZ4 match offset",null,null)
B.V=new A.a0("Invalid Huffman code length",null,null)
B.W=new A.a0("Invalid LZ4 match offset",null,null)
B.X=new A.a0("Incompatible FastLottie worker host",null,null)
B.Y=new A.a0("LZ4 literal out of bounds",null,null)
B.Z=new A.a0("Empty LZ4 block",null,null)
B.a_=new A.a0("Truncated LZ4 literal len",null,null)
B.a0=new A.a0("Truncated LZ4 match len",null,null)
B.a1=new A.a0("Lottie JSON exceeds decode budget",null,null)
B.a2=new A.a0("LZ4 match out of output bounds",null,null)
B.a3=new A.a0("Invalid raster worker request",null,null)
B.a4=new A.a0("Incomplete Huffman table",null,null)
B.a5=new A.a0("Expected JSON object at root",null,null)
B.a6=new A.a0("Oversubscribed Huffman table",null,null)
B.aa=new A.ff(null)
B.B=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.ab=s([10,7,2,7,0,0,0],t.t)
B.C=s([],t.o)
B.ac=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.l=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.ad=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.ae=s([10,7,7,7,7,7],t.t)
B.D=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.af=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.ag=s(["_initialize","malloc","free","fastlottie_clear_pixels","fastlottie_fill_solid_spans","fastlottie_blend_rect","fastlottie_blend_solid","fastlottie_inner_shadow","fastlottie_gradient_spans","fl_dense_new","fl_dense_free","fl_dense_trim","fl_dense_raster"],t.s)
B.r=s([1,10,100,1000,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13,1e14,1e15],t.n)
B.ah=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.E=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.aE=new A.dk(4)
B.v=new A.y(0,0)
B.aF=new A.y(0,-1)
B.aG=new A.y(1,4)
B.aH=new A.y(2,0)
B.aI=new A.y(3,1)
B.aJ=new A.y(4,1)
B.aK=new A.y(5,1)
B.G=new A.dp(0,0)
B.aL=new A.y(null,null)
B.aM=new A.aF(0,0,0)
B.aN=new A.aC(0,0,0,0)
B.av={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aO=new A.S(B.av,21,t.M)
B.aj={v:0,i:1,o:2,c:3}
B.aP=new A.S(B.aj,4,t.M)
B.ax={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aQ=new A.S(B.ax,11,t.M)
B.ao={ty:0,nm:1,mn:2,ix:3,v:4}
B.H=new A.S(B.ao,5,t.M)
B.aA={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aR=new A.S(B.aA,9,t.M)
B.ar={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aS=new A.S(B.ar,6,t.M)
B.ay={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aT=new A.S(B.ay,31,t.M)
B.au={a:0,k:1,ix:2,x:3,l:4}
B.I=new A.S(B.au,5,t.M)
B.aD={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aU=new A.S(B.aD,19,t.M)
B.aB={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aV=new A.S(B.aB,10,t.M)
B.an={s:0,x:1,y:2,ix:3}
B.aW=new A.S(B.an,4,t.M)
B.al={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aX=new A.S(B.al,9,t.M)
B.ap={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aY=new A.S(B.ap,8,t.M)
B.aw={}
B.aZ=new A.S(B.aw,0,t.M)
B.am={a:0,s:1,i:2,f:3,n:4}
B.b_=new A.S(B.am,5,t.M)
B.aC={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.b0=new A.S(B.aC,15,t.M)
B.ai={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.b1=new A.S(B.ai,7,t.M)
B.ak={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.b2=new A.S(B.ak,10,t.M)
B.at={n:0,nm:1,v:2}
B.b3=new A.S(B.at,3,t.M)
B.as={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b4=new A.S(B.as,10,t.M)
B.aq={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b5=new A.S(B.aq,16,t.M)
B.az={p:0,k:1}
B.b6=new A.S(B.az,2,t.M)
B.b7=A.aQ("pc")
B.b8=A.aQ("ml")
B.b9=A.aQ("bx")
B.ba=A.aQ("f4")
B.bb=A.aQ("f5")
B.bc=A.aQ("mv")
B.bd=A.aQ("jj")
B.be=A.aQ("mw")
B.bf=A.aQ("e")
B.bg=A.aQ("jE")
B.bh=A.aQ("d8")
B.bi=A.aQ("n8")
B.bj=A.aQ("aW")
B.i=new A.c(null,null)
B.n=new A.c(B.i,"layers")})();(function staticFields(){$.hV=null
$.aG=A.h([],t.f)
$.kA=null
$.fx=0
$.jx=A.oi()
$.kp=null
$.ko=null
$.lA=null
$.lv=null
$.lF=null
$.iC=null
$.iK=null
$.k0=null
$.i4=A.h([],A.dI("z<v<e>?>"))
$.cy=null
$.dE=null
$.dF=null
$.jR=!1
$.G=B.k
$.lt=null
$.jP=null
$.l=null
$.fp=null
$.cS=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"pe","lJ",()=>A.iD("_$dart_dartClosure"))
s($,"pd","j2",()=>A.iD("_$dart_dartClosure_dartJSInterop"))
s($,"q_","m8",()=>B.k.bu(B.k,A.dI("ay<~>()").a(new A.iO()),A.dI("ay<~>")))
s($,"pX","m7",()=>A.h([new J.dW()],A.dI("z<d3>")))
s($,"pB","lR",()=>A.bl(A.fT({
toString:function(){return"$receiver$"}})))
s($,"pC","lS",()=>A.bl(A.fT({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"pD","lT",()=>A.bl(A.fT(null)))
s($,"pE","lU",()=>A.bl(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"pH","lX",()=>A.bl(A.fT(void 0)))
s($,"pI","lY",()=>A.bl(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"pG","lW",()=>A.bl(A.kO(null)))
s($,"pF","lV",()=>A.bl(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"pK","m_",()=>A.bl(A.kO(void 0)))
s($,"pJ","lZ",()=>A.bl(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"pl","dJ",()=>A.fr(4))
s($,"pL","ka",()=>A.n9())
s($,"pf","k5",()=>$.m8())
s($,"pT","m5",()=>A.kz(4096))
s($,"pR","m3",()=>new A.ii().$0())
s($,"pS","m4",()=>new A.ih().$0())
s($,"pV","eX",()=>A.iP(B.bf))
s($,"pp","k7",()=>{A.mR()
return $.fx})
s($,"pW","m6",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"ph","lL",()=>A.jg(B.ah,!1))
s($,"pg","lK",()=>A.jg(B.ac,!1))
s($,"pb","j1",()=>A.mh())
s($,"pa","lI",()=>A.mg($.j1()))
s($,"pk","lN",()=>A.kz(65536))
s($,"pj","lM",()=>{var r=A.mN(16384)
B.e.ac(r,0,16384,-1)
return r})
s($,"pY","kd",()=>A.ky(16384))
s($,"pU","kc",()=>A.ec("content\\('([^']*)'\\)"))
s($,"pO","m2",()=>A.ec("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"pM","m0",()=>A.ec("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"pN","m1",()=>A.ec('[\\\\"\\x00-\\x1f]'))
s($,"pQ","kb",()=>A.ec("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"ps","k9",()=>A.ky(16384))
s($,"pr","k8",()=>new A.fL().$0())
s($,"pi","k6",()=>new A.du(A.fr(0),A.fr(0)))
s($,"pt","bv",()=>A.fr(0))
s($,"pz","j5",()=>A.em(A.e2(A.h([0],t.n))))
s($,"py","lQ",()=>A.em(A.e2(A.h([1],t.n))))
s($,"pw","j3",()=>A.em(A.e2(A.h([100],t.n))))
s($,"pA","j6",()=>A.em(A.e2(A.h([0,0],t.n))))
s($,"px","j4",()=>A.em(A.e2(A.h([100,100],t.n))))
s($,"pv","lP",()=>A.n6())
s($,"pu","lO",()=>A.n5())})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bB,ArrayBuffer:A.cg,ArrayBufferView:A.cW,DataView:A.e1,Float32Array:A.ch,Float64Array:A.cU,Int16Array:A.e3,Int32Array:A.cV,Int8Array:A.e5,Uint16Array:A.e6,Uint32Array:A.cX,Uint8ClampedArray:A.cY,CanvasPixelArray:A.cY,Uint8Array:A.bU})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.af.$nativeSuperclassTag="ArrayBufferView"
A.dg.$nativeSuperclassTag="ArrayBufferView"
A.dh.$nativeSuperclassTag="ArrayBufferView"
A.bC.$nativeSuperclassTag="ArrayBufferView"
A.di.$nativeSuperclassTag="ArrayBufferView"
A.dj.$nativeSuperclassTag="ArrayBufferView"
A.aB.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.oY
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()