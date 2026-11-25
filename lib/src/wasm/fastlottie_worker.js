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
if(a[b]!==s){A.ox(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.i(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.jE(b)
return new s(c,this)}:function(){if(s===null)s=A.jE(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.jE(a).prototype
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
jI(a,b,c,d){return{i:a,p:b,e:c,x:d}},
iu(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.jG==null){A.og()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.kk("Return interceptor for "+A.w(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.hK
if(o==null)o=$.hK=A.it(n)
p=q[o]}if(p!=null)return p
p=A.ol(a)
if(p!=null)return p
if(typeof a=="function")return B.a7
s=Object.getPrototypeOf(a)
if(s==null)return B.E
if(s===Object.prototype)return B.E
if(typeof q=="function"){o=$.hK
if(o==null)o=$.hK=A.it(n)
Object.defineProperty(q,o,{value:B.v,enumerable:false,writable:true,configurable:true})
return B.v}return B.v},
j5(a,b){if(a<0||a>4294967295)throw A.e(A.am(a,0,4294967295,"length",null))
return J.m0(new Array(a),b)},
j6(a,b){if(a<0)throw A.e(A.aB("Length must be a non-negative integer: "+a,null))
return A.i(new Array(a),b.i("x<0>"))},
m0(a,b){var s=A.i(a,b.i("x<0>"))
s.$flags=1
return s},
aA(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cG.prototype
return J.dR.prototype}if(typeof a=="string")return J.cb.prototype
if(a==null)return J.cH.prototype
if(typeof a=="boolean")return J.cF.prototype
if(Array.isArray(a))return J.x.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.d)return a
return J.iu(a)},
N(a){if(typeof a=="string")return J.cb.prototype
if(a==null)return a
if(Array.isArray(a))return J.x.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.d)return a
return J.iu(a)},
b2(a){if(a==null)return a
if(Array.isArray(a))return J.x.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.d)return a
return J.iu(a)},
cv(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.d)return a
return J.iu(a)},
m(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aA(a).F(a,b)},
ae(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.ok(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.N(a).h(a,b)},
lB(a,b){return J.b2(a).aq(a,b)},
lC(a,b,c){return J.cv(a).dM(a,b,c)},
iT(a,b,c){return J.cv(a).dN(a,b,c)},
lD(a,b,c){return J.cv(a).dO(a,b,c)},
lE(a,b,c){return J.cv(a).dP(a,b,c)},
lF(a){return J.cv(a).dQ(a)},
c6(a,b,c){return J.cv(a).bu(a,b,c)},
jR(a,b){return J.b2(a).aj(a,b)},
jS(a){return J.cv(a).gab(a)},
lG(a){return J.b2(a).ga5(a)},
an(a){return J.aA(a).gW(a)},
iU(a){return J.N(a).gS(a)},
cx(a){return J.b2(a).gB(a)},
ak(a){return J.N(a).gk(a)},
lH(a){return J.aA(a).gX(a)},
jT(a){return J.b2(a).gaf(a)},
jU(a,b,c,d,e){return J.b2(a).M(a,b,c,d,e)},
lI(a,b){return J.b2(a).an(a,b)},
bH(a){return J.aA(a).t(a)},
D:function D(){},
cF:function cF(){},
cH:function cH(){},
R:function R(){},
bs:function bs(){},
e2:function e2(){},
d2:function d2(){},
ar:function ar(){},
bK:function bK(){},
bL:function bL(){},
x:function x(a){this.$ti=a},
dQ:function dQ(){},
f4:function f4(a){this.$ti=a},
bI:function bI(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cI:function cI(){},
cG:function cG(){},
dR:function dR(){},
cb:function cb(){}},A={j7:function j7(){},
k4(a){return new A.b4("Field '"+a+"' has been assigned during initialization.")},
m2(a){return new A.b4("Field '"+a+"' has not been initialized.")},
al(a){return new A.b4("Local '"+a+"' has not been initialized.")},
f9(a){return new A.b4("Local '"+a+"' has already been initialized.")},
bd(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
fD(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
jD(a,b,c){return a},
jH(a){var s,r
for(s=$.az.length,r=0;r<s;++r)if(a===$.az[r])return!0
return!1},
fy(a,b,c,d){A.aP(b,"start")
if(c!=null){A.aP(c,"end")
if(b>c)A.v(A.am(b,0,c,"start",null))}return new A.d0(a,b,c,d.i("d0<0>"))},
kb(a,b,c){var s="count"
if(t.gw.b(a)){A.eP(b,s,t.S)
A.aP(b,s)
return new A.ca(a,b,c.i("ca<0>"))}A.eP(b,s,t.S)
A.aP(b,s)
return new A.ba(a,b,c.i("ba<0>"))},
a8(){return new A.bb("No element")},
j3(){return new A.bb("Too many elements")},
lZ(){return new A.bb("Too few elements")},
b4:function b4(a){this.a=a},
iE:function iE(){},
ft:function ft(){},
p:function p(){},
a4:function a4(){},
d0:function d0(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
bO:function bO(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
Y:function Y(a,b,c){this.a=a
this.b=b
this.$ti=c},
bR:function bR(a,b,c){this.a=a
this.b=b
this.$ti=c},
d4:function d4(a,b,c){this.a=a
this.b=b
this.$ti=c},
ba:function ba(a,b,c){this.a=a
this.b=b
this.$ti=c},
ca:function ca(a,b,c){this.a=a
this.b=b
this.$ti=c},
cY:function cY(a,b,c){this.a=a
this.b=b
this.$ti=c},
cC:function cC(a){this.$ti=a},
cD:function cD(a){this.$ti=a},
G:function G(){},
bz:function bz(){},
lT(){throw A.e(A.aG("Cannot modify constant Set"))},
lc(a){var s=A.lb(a)
if(s!=null)return s
return"minified:"+a},
ok(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
w(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bH(a)
return s},
cU(a){var s,r=$.k6
if(r==null)r=$.k6=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
mi(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.e(A.am(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
e3(a){var s,r,q,p
if(a instanceof A.d)return A.aj(A.aK(a),null)
s=J.aA(a)
if(s===B.a6||s===B.a8||t.ak.b(a)){r=B.w(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.aj(A.aK(a),null)},
k7(a){var s,r,q
if(a==null||typeof a=="number"||A.b1(a))return J.bH(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bp)return a.t(0)
if(a instanceof A.P)return a.dB(!0)
s=$.lz()
for(r=0;r<1;++r){q=s[r].hD(a)
if(q!=null)return q}return"Instance of '"+A.e3(a)+"'"},
mf(){return Date.now()},
mh(){var s,r
if($.fm!==0)return
$.fm=1000
if(typeof window=="undefined")return
s=window
if(s==null)return
if(!!s.dartUseDateNowForTicks)return
r=s.performance
if(r==null)return
if(typeof r.now!="function")return
$.fm=1e6
$.jg=new A.fl(r)},
mj(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
cV(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.L(s,10)|55296)>>>0,s&1023|56320)}throw A.e(A.am(a,0,1114111,null,null))},
mg(a){var s=a.$thrownJsError
if(s==null)return null
return A.bn(s)},
mk(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.W(a,s)
a.$thrownJsError=s
s.stack=""}},
S(a){throw A.e(A.ir(a))},
a(a,b){if(a==null)J.ak(a)
throw A.e(A.eN(a,b))},
eN(a,b){var s,r="index"
if(!A.o(b))return new A.aX(!0,b,r,null)
s=A.j(J.ak(a))
if(b<0||b>=s)return A.j0(b,s,a,r)
return A.ml(b,r)},
ir(a){return new A.aX(!0,a,null,null)},
l4(a){return a},
e(a){return A.W(a,new Error())},
W(a,b){var s
if(a==null)a=new A.be()
b.dartException=a
s=A.oy
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
oy(){return J.bH(this.dartException)},
v(a,b){throw A.W(a,b==null?new Error():b)},
h(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.v(A.ni(a,b,c),s)},
ni(a,b,c){var s,r,q,p,o,n,m,l,k
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
X(a){throw A.e(A.ap(a))},
bf(a){var s,r,q,p,o,n
a=A.os(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.i([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.fH(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
fI(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
kj(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
j8(a,b){var s=b==null,r=s?null:b.method
return new A.dT(a,r,s?null:b.receiver)},
ad(a){var s
if(a==null)return new A.fj(a)
if(a instanceof A.cE){s=a.a
return A.bG(a,s==null?A.aV(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bG(a,a.dartException)
return A.nZ(a)},
bG(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
nZ(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.L(r,16)&8191)===10)switch(q){case 438:return A.bG(a,A.j8(A.w(s)+" (Error "+q+")",null))
case 445:case 5007:A.w(s)
return A.bG(a,new A.cS())}}if(a instanceof TypeError){p=$.li()
o=$.lj()
n=$.lk()
m=$.ll()
l=$.lo()
k=$.lp()
j=$.ln()
$.lm()
i=$.lr()
h=$.lq()
g=p.ak(s)
if(g!=null)return A.bG(a,A.j8(A.K(s),g))
else{g=o.ak(s)
if(g!=null){g.method="call"
return A.bG(a,A.j8(A.K(s),g))}else if(n.ak(s)!=null||m.ak(s)!=null||l.ak(s)!=null||k.ak(s)!=null||j.ak(s)!=null||m.ak(s)!=null||i.ak(s)!=null||h.ak(s)!=null){A.K(s)
return A.bG(a,new A.cS())}}return A.bG(a,new A.ee(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.cZ()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bG(a,new A.aX(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.cZ()
return a},
bn(a){var s
if(a instanceof A.cE)return a.b
if(a==null)return new A.dn(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.dn(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
iF(a){if(a==null)return J.an(a)
if(typeof a=="object")return A.cU(a)
return J.an(a)},
oc(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.p(0,a[s],a[r])}return b},
nv(a,b,c,d,e,f){t.Z.a(a)
switch(A.j(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(new A.ha("Unsupported number of arguments for wrapped closure"))},
dA(a,b){var s=a.$identity
if(!!s)return s
s=A.o6(a,b)
a.$identity=s
return s},
o6(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.nv)},
lS(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.e7().constructor.prototype):Object.create(new A.c8(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.k2(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.lO(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.k2(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
lO(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.lM)}throw A.e("Error in functionType of tearoff")},
lP(a,b,c,d){var s=A.k1
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
k2(a,b,c,d){if(c)return A.lR(a,b,d)
return A.lP(b.length,d,a,b)},
lQ(a,b,c,d){var s=A.k1,r=A.lN
switch(b?-1:a){case 0:throw A.e(new A.e6("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
lR(a,b,c){var s,r
if($.k_==null)$.k_=A.jZ("interceptor")
if($.k0==null)$.k0=A.jZ("receiver")
s=b.length
r=A.lQ(s,c,a,b)
return r},
jE(a){return A.lS(a)},
lM(a,b){return A.dv(v.typeUniverse,A.aK(a.a),b)},
k1(a){return a.a},
lN(a){return a.b},
jZ(a){var s,r,q,p=new A.c8("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.aB("Field name "+a+" not found.",null))},
it(a){return v.getIsolateTag(a)},
eM(){throw A.e(new A.eD(null))},
pc(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
ol(a){var s,r,q,p,o,n=A.K($.l6.$1(a)),m=$.is[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iA[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.ia($.l2.$2(a,n))
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
return o.i}if(p==="+")return A.l9(a,s)
if(p==="*")throw A.e(A.kk(n))
if(v.leafTags[n]===true){o=A.iD(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.l9(a,s)},
l9(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.jI(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
iD(a){return J.jI(a,!1,null,!!a.$ias)},
on(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.iD(s)
else return J.jI(s,c,null,null)},
og(){if(!0===$.jG)return
$.jG=!0
A.oh()},
oh(){var s,r,q,p,o,n,m,l
$.is=Object.create(null)
$.iA=Object.create(null)
A.of()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.la.$1(o)
if(n!=null){m=A.on(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
of(){var s,r,q,p,o,n,m=B.K()
m=A.cu(B.L,A.cu(B.M,A.cu(B.x,A.cu(B.x,A.cu(B.N,A.cu(B.O,A.cu(B.P(B.w),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.l6=new A.iw(p)
$.l2=new A.ix(o)
$.la=new A.iy(n)},
cu(a,b){return a(b)||b},
mP(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.m(r,b[s]))return!1}return!0},
o7(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
k3(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.e(A.dL("Illegal RegExp pattern ("+String(o)+")",a,null))},
os(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
de:function de(a){this.a=a},
cn:function cn(a){this.a=a},
df:function df(a){this.a=a},
dg:function dg(a){this.a=a},
co:function co(a){this.a=a},
dh:function dh(a){this.a=a},
z:function z(a,b){this.a=a
this.b=b},
di:function di(a,b){this.a=a
this.b=b},
ay:function ay(a,b,c){this.a=a
this.b=b
this.c=c},
dj:function dj(a,b,c){this.a=a
this.b=b
this.c=c},
cp:function cp(a,b,c){this.a=a
this.b=b
this.c=c},
bZ:function bZ(a,b,c){this.a=a
this.b=b
this.c=c},
b0:function b0(a){this.a=a},
dk:function dk(a){this.a=a},
dl:function dl(a){this.a=a},
cq:function cq(a){this.a=a},
bC:function bC(a){this.a=a},
d7:function d7(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cB:function cB(){},
O:function O(a,b,c){this.a=a
this.b=b
this.$ti=c},
fl:function fl(a){this.a=a},
cX:function cX(){},
fH:function fH(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
cS:function cS(){},
dT:function dT(a,b,c){this.a=a
this.b=b
this.c=c},
ee:function ee(a){this.a=a},
fj:function fj(a){this.a=a},
cE:function cE(a,b){this.a=a
this.b=b},
dn:function dn(a){this.a=a
this.b=null},
bp:function bp(){},
dF:function dF(){},
dG:function dG(){},
eb:function eb(){},
e7:function e7(){},
c8:function c8(a,b){this.a=a
this.b=b},
e6:function e6(a){this.a=a},
eD:function eD(a){this.a=a},
b3:function b3(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
f5:function f5(a){this.a=a},
fa:function fa(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
M:function M(a,b){this.a=a
this.$ti=b},
cK:function cK(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bN:function bN(a,b){this.a=a
this.$ti=b},
aM:function aM(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bM:function bM(a,b){this.a=a
this.$ti=b},
cJ:function cJ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
af:function af(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
iw:function iw(a){this.a=a},
ix:function ix(a){this.a=a},
iy:function iy(a){this.a=a},
P:function P(){},
bY:function bY(){},
cm:function cm(){},
bj:function bj(){},
ai:function ai(){},
dS:function dS(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
d9:function d9(a){this.b=a},
eg:function eg(a,b,c){this.a=a
this.b=b
this.c=c},
ch:function ch(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
ox(a){throw A.W(A.k4(a),new Error())},
E(){throw A.W(A.m2(""),new Error())},
Q(){throw A.W(A.k4(""),new Error())},
ek(){var s=new A.fU()
return s.b=s},
fU:function fU(){this.b=null},
bm(a,b,c){},
V(a){return a},
m8(a,b,c){A.bm(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
mb(a){return new Float32Array(a)},
mc(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Float32Array(a,b,c)},
jc(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dY(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Int32Array(a,b,c)},
jd(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
md(a){return new Uint8Array(a)},
je(a,b,c){A.bm(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
aW(a,b,c){if(a>>>0!==a||a>=c)throw A.e(A.eN(b,a))},
bu:function bu(){},
cc:function cc(){},
cM:function cM(a){this.a=a},
eC:function eC(a){this.a=a},
cP:function cP(){},
i3:function i3(a){this.a=a},
dW:function dW(){},
a9:function a9(){},
bv:function bv(){},
at:function at(){},
cd:function cd(){},
cN:function cN(){},
dX:function dX(){},
cO:function cO(){},
dZ:function dZ(){},
e_:function e_(){},
cQ:function cQ(){},
cR:function cR(){},
bP:function bP(){},
aO:function aO(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ev:function ev(){},
ew:function ew(){},
da:function da(){},
db:function db(){},
dc:function dc(){},
dd:function dd(){},
eE:function eE(){},
jh(a,b){var s=b.c
return s==null?b.c=A.dt(a,"aq",[b.x]):s},
k9(a){var s=a.w
if(s===6||s===7)return A.k9(a.x)
return s===11||s===12},
mn(a){return a.as},
bo(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
dB(a){return A.i2(v.typeUniverse,a,!1)},
c1(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.c1(a1,s,a3,a4)
if(r===s)return a2
return A.kw(a1,r,!0)
case 7:s=a2.x
r=A.c1(a1,s,a3,a4)
if(r===s)return a2
return A.kv(a1,r,!0)
case 8:q=a2.y
p=A.ct(a1,q,a3,a4)
if(p===q)return a2
return A.dt(a1,a2.x,p)
case 9:o=a2.x
n=A.c1(a1,o,a3,a4)
m=a2.y
l=A.ct(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.ju(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.ct(a1,j,a3,a4)
if(i===j)return a2
return A.kx(a1,k,i)
case 11:h=a2.x
g=A.c1(a1,h,a3,a4)
f=a2.y
e=A.nW(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.ku(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.ct(a1,d,a3,a4)
o=a2.x
n=A.c1(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.jv(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.dE("Attempted to substitute unexpected RTI kind "+a0))}},
ct(a,b,c,d){var s,r,q,p,o=b.length,n=A.i7(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.c1(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
nX(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.i7(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.c1(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
nW(a,b,c,d){var s,r=b.a,q=A.ct(a,r,c,d),p=b.b,o=A.ct(a,p,c,d),n=b.c,m=A.nX(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.eq()
s.a=q
s.b=o
s.c=m
return s},
i(a,b){a[v.arrayRti]=b
return a},
l5(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.oe(s)
return a.$S()}return null},
oi(a,b){var s
if(A.k9(b))if(a instanceof A.bp){s=A.l5(a)
if(s!=null)return s}return A.aK(a)},
aK(a){if(a instanceof A.d)return A.n(a)
if(Array.isArray(a))return A.a_(a)
return A.jx(J.aA(a))},
a_(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
n(a){var s=a.$ti
return s!=null?s:A.jx(a)},
jx(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.nt(a,s)},
nt(a,b){var s=a instanceof A.bp?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.n0(v.typeUniverse,s.name)
b.$ccache=r
return r},
oe(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.i2(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
iv(a){return A.c3(A.n(a))},
jC(a){var s
if(a instanceof A.P)return A.ob(a.$r,a.aV())
s=a instanceof A.bp?A.l5(a):null
if(s!=null)return s
if(t.dm.b(a))return J.lH(a).a
if(Array.isArray(a))return A.a_(a)
return A.aK(a)},
c3(a){var s=a.r
return s==null?a.r=new A.i1(a):s},
ob(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.dv(v.typeUniverse,A.jC(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.kz(v.typeUniverse,s,A.jC(q[r]))}return A.dv(v.typeUniverse,s,a)},
aL(a){return A.c3(A.i2(v.typeUniverse,a,!1))},
ns(a){var s=this
s.b=A.nU(s)
return s.b(a)},
nU(a){var s,r,q,p,o
if(a===t.K)return A.nB
if(A.c4(a))return A.nF
s=a.w
if(s===6)return A.nq
if(s===1)return A.kS
if(s===7)return A.nw
r=A.nT(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.c4)){a.f="$i"+q
if(q==="t")return A.nz
if(a===t.m)return A.ny
return A.nE}}else if(s===10){p=A.o7(a.x,a.y)
o=p==null?A.kS:p
return o==null?A.aV(o):o}return A.no},
nT(a){if(a.w===8){if(a===t.S)return A.o
if(a===t.i||a===t.q)return A.nA
if(a===t.N)return A.nD
if(a===t.y)return A.b1}return null},
nr(a){var s=this,r=A.nn
if(A.c4(s))r=A.na
else if(s===t.K)r=A.aV
else if(A.cw(s)){r=A.np
if(s===t.gs)r=A.n8
else if(s===t.dk)r=A.ia
else if(s===t.fQ)r=A.n6
else if(s===t.cg)r=A.kE
else if(s===t.cD)r=A.n7
else if(s===t.an)r=A.n9}else if(s===t.S)r=A.j
else if(s===t.N)r=A.K
else if(s===t.y)r=A.aU
else if(s===t.q)r=A.eF
else if(s===t.i)r=A.U
else if(s===t.m)r=A.u
s.a=r
return s.a(a)},
no(a){var s=this
if(a==null)return A.cw(s)
return A.l8(v.typeUniverse,A.oi(a,s),s)},
nq(a){if(a==null)return!0
return this.x.b(a)},
nE(a){var s,r=this
if(a==null)return A.cw(r)
s=r.f
if(a instanceof A.d)return!!a[s]
return!!J.aA(a)[s]},
nz(a){var s,r=this
if(a==null)return A.cw(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.d)return!!a[s]
return!!J.aA(a)[s]},
ny(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.d)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
kR(a){if(typeof a=="object"){if(a instanceof A.d)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
nn(a){var s=this
if(a==null){if(A.cw(s))return a}else if(s.b(a))return a
throw A.W(A.kI(a,s),new Error())},
np(a){var s=this
if(a==null||s.b(a))return a
throw A.W(A.kI(a,s),new Error())},
kI(a,b){return new A.cr("TypeError: "+A.km(a,A.aj(b,null)))},
o5(a,b,c,d){if(A.l8(v.typeUniverse,a,b))return a
throw A.W(A.mT("The type argument '"+A.aj(a,null)+"' is not a subtype of the type variable bound '"+A.aj(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
km(a,b){return A.eV(a)+": type '"+A.aj(A.jC(a),null)+"' is not a subtype of type '"+b+"'"},
mT(a){return new A.cr("TypeError: "+a)},
aI(a,b){return new A.cr("TypeError: "+A.km(a,b))},
nw(a){var s=this
return s.x.b(a)||A.jh(v.typeUniverse,s).b(a)},
nB(a){return a!=null},
aV(a){if(a!=null)return a
throw A.W(A.aI(a,"Object"),new Error())},
nF(a){return!0},
na(a){return a},
kS(a){return!1},
b1(a){return!0===a||!1===a},
aU(a){if(!0===a)return!0
if(!1===a)return!1
throw A.W(A.aI(a,"bool"),new Error())},
n6(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.W(A.aI(a,"bool?"),new Error())},
U(a){if(typeof a=="number")return a
throw A.W(A.aI(a,"double"),new Error())},
n7(a){if(typeof a=="number")return a
if(a==null)return a
throw A.W(A.aI(a,"double?"),new Error())},
o(a){return typeof a=="number"&&Math.floor(a)===a},
j(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.W(A.aI(a,"int"),new Error())},
n8(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.W(A.aI(a,"int?"),new Error())},
nA(a){return typeof a=="number"},
eF(a){if(typeof a=="number")return a
throw A.W(A.aI(a,"num"),new Error())},
kE(a){if(typeof a=="number")return a
if(a==null)return a
throw A.W(A.aI(a,"num?"),new Error())},
nD(a){return typeof a=="string"},
K(a){if(typeof a=="string")return a
throw A.W(A.aI(a,"String"),new Error())},
ia(a){if(typeof a=="string")return a
if(a==null)return a
throw A.W(A.aI(a,"String?"),new Error())},
u(a){if(A.kR(a))return a
throw A.W(A.aI(a,"JSObject"),new Error())},
n9(a){if(a==null)return a
if(A.kR(a))return a
throw A.W(A.aI(a,"JSObject?"),new Error())},
kY(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.aj(a[q],b)
return s},
nO(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.kY(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.aj(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
kO(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.i([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.b.m(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.aj(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.aj(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.aj(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.aj(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.aj(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
aj(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.aj(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.aj(a.x,b)+">"
if(l===8){p=A.nY(a.x)
o=a.y
return o.length>0?p+("<"+A.kY(o,b)+">"):p}if(l===10)return A.nO(a,b)
if(l===11)return A.kO(a,b,null)
if(l===12)return A.kO(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
nY(a){var s=A.lb(a)
if(s!=null)return s
return"minified:"+a},
n1(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
n0(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.i2(a,b,!1)
else if(typeof m=="number"){s=m
r=A.du(a,5,"#")
q=A.i7(s)
for(p=0;p<s;++p)q[p]=r
o=A.dt(a,b,q)
n[b]=o
return o}else return m},
n_(a,b){return A.kB(a.tR,b)},
mZ(a,b){return A.kB(a.eT,b)},
i2(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.ky(a,null,b,!1)
r.set(b,s)
return s},
dv(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.ky(a,b,c,!0)
q.set(c,r)
return r},
kz(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.ju(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
ky(a,b,c,d){return A.mN(A.mH(a,b,c,d))},
bE(a,b){b.a=A.nr
b.b=A.ns
return b},
du(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aQ(null,null)
s.w=b
s.as=c
r=A.bE(a,s)
a.eC.set(c,r)
return r},
kw(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.mX(a,b,r,c)
a.eC.set(r,s)
return s},
mX(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.c4(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.cw(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aQ(null,null)
q.w=6
q.x=b
q.as=c
return A.bE(a,q)},
kv(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.mV(a,b,r,c)
a.eC.set(r,s)
return s},
mV(a,b,c,d){var s,r
if(d){s=b.w
if(A.c4(b)||b===t.K)return b
else if(s===1)return A.dt(a,"aq",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aQ(null,null)
r.w=7
r.x=b
r.as=c
return A.bE(a,r)},
mY(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aQ(null,null)
s.w=13
s.x=b
s.as=q
r=A.bE(a,s)
a.eC.set(q,r)
return r},
ds(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
mU(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
dt(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.ds(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aQ(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bE(a,r)
a.eC.set(p,q)
return q},
ju(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.ds(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aQ(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bE(a,o)
a.eC.set(q,n)
return n},
kx(a,b,c){var s,r,q="+"+(b+"("+A.ds(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aQ(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bE(a,s)
a.eC.set(q,r)
return r},
ku(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.ds(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.ds(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.mU(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aQ(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bE(a,p)
a.eC.set(r,o)
return o},
jv(a,b,c,d){var s,r=b.as+("<"+A.ds(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.mW(a,b,c,r,d)
a.eC.set(r,s)
return s},
mW(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.i7(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.c1(a,b,r,0)
m=A.ct(a,c,r,0)
return A.jv(a,n,m,c!==m)}}l=new A.aQ(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bE(a,l)},
mH(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
mN(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.mJ(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.kr(a,r,l,k,!1)
else if(q===46)r=A.kr(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.bX(a.u,a.e,k.pop()))
break
case 94:k.push(A.mY(a.u,k.pop()))
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
case 62:A.mL(a,k)
break
case 38:A.mK(a,k)
break
case 63:p=a.u
k.push(A.kw(p,A.bX(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.kv(p,A.bX(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.mI(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.ks(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.mO(a.u,a.e,o)
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
return A.bX(a.u,a.e,m)},
mJ(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
kr(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.n1(s,o.x)[p]
if(n==null)A.v('No "'+p+'" in "'+A.mn(o)+'"')
d.push(A.dv(s,o,n))}else d.push(p)
return m},
mL(a,b){var s,r=a.u,q=A.kq(a,b),p=b.pop()
if(typeof p=="string")b.push(A.dt(r,p,q))
else{s=A.bX(r,a.e,p)
switch(s.w){case 11:b.push(A.jv(r,s,q,a.n))
break
default:b.push(A.ju(r,s,q))
break}}},
mI(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.kq(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.bX(p,a.e,o)
q=new A.eq()
q.a=s
q.b=n
q.c=m
b.push(A.ku(p,r,q))
return
case-4:b.push(A.kx(p,b.pop(),s))
return
default:throw A.e(A.dE("Unexpected state under `()`: "+A.w(o)))}},
mK(a,b){var s=b.pop()
if(0===s){b.push(A.du(a.u,1,"0&"))
return}if(1===s){b.push(A.du(a.u,4,"1&"))
return}throw A.e(A.dE("Unexpected extended operation "+A.w(s)))},
kq(a,b){var s=b.splice(a.p)
A.ks(a.u,a.e,s)
a.p=b.pop()
return s},
bX(a,b,c){if(typeof c=="string")return A.dt(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.mM(a,b,c)}else return c},
ks(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.bX(a,b,c[s])},
mO(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.bX(a,b,c[s])},
mM(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.dE("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.dE("Bad index "+c+" for "+b.t(0)))},
l8(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.a3(a,b,null,c,null)
r.set(c,s)}return s},
a3(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.c4(d))return!0
s=b.w
if(s===4)return!0
if(A.c4(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.a3(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.a3(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.a3(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.a3(a,b.x,c,d,e))return!1
return A.a3(a,A.jh(a,b),c,d,e)}if(s===6)return A.a3(a,p,c,d,e)&&A.a3(a,b.x,c,d,e)
if(q===7){if(A.a3(a,b,c,d.x,e))return!0
return A.a3(a,b,c,A.jh(a,d),e)}if(q===6)return A.a3(a,b,c,p,e)||A.a3(a,b,c,d.x,e)
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
if(!A.a3(a,j,c,i,e)||!A.a3(a,i,e,j,c))return!1}return A.kQ(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.kQ(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.nx(a,b,c,d,e)}if(o&&q===10)return A.nC(a,b,c,d,e)
return!1},
kQ(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.a3(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.a3(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.a3(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.a3(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.a3(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
nx(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.dv(a,b,r[o])
return A.kD(a,p,null,c,d.y,e)}return A.kD(a,b.y,null,c,d.y,e)},
kD(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.a3(a,b[s],d,e[s],f))return!1
return!0},
nC(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.a3(a,r[s],c,q[s],e))return!1
return!0},
cw(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.c4(a))if(s!==6)r=s===7&&A.cw(a.x)
return r},
c4(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
kB(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
i7(a){return a>0?new Array(a):v.typeUniverse.sEA},
aQ:function aQ(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
eq:function eq(){this.c=this.b=this.a=null},
i1:function i1(a){this.a=a},
en:function en(){},
cr:function cr(a){this.a=a},
mA(){var s,r,q
if(self.scheduleImmediate!=null)return A.o_()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dA(new A.fQ(s),1)).observe(r,{childList:true})
return new A.fP(s,r,q)}else if(self.setImmediate!=null)return A.o0()
return A.o1()},
mB(a){self.scheduleImmediate(A.dA(new A.fR(t.O.a(a)),0))},
mC(a){self.setImmediate(A.dA(new A.fS(t.O.a(a)),0))},
mD(a){t.O.a(a)
A.mQ(0,a)},
mQ(a,b){var s=new A.hZ()
s.eA(a,b)
return s},
kU(a){return new A.eh(new A.J($.F,a.i("J<0>")),a.i("eh<0>"))},
kH(a,b){a.$2(0,null)
b.b=!0
return b.a},
ib(a,b){A.nb(a,b)},
kG(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("aq<1>").b(a))s.cP(a)
else s.cT(a)},
kF(a,b){var s=A.ad(a),r=A.bn(a),q=A.kP(s,r)
s=new A.ao(s,r)
r=b.b
q=b.a
if(r)q.bg(s)
else q.be(s)},
nb(a,b){var s,r,q=new A.ic(b),p=new A.id(b)
if(a instanceof A.J)a.dz(q,p,t.z)
else{s=t.z
if(a instanceof A.J)a.cr(q,p,s)
else{r=new A.J($.F,t._)
r.a=8
r.c=a
r.dz(q,p,s)}}},
l1(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.F
return r.c_(r,t.as.a(new A.iq(s)),t.H,t.S,t.z)},
iX(a){var s
if(t.R.b(a)){s=a.gaT()
if(s!=null)return s}return B.q},
kP(a,b){var s=$.F
if(s===B.k)return null
s.f2(s,a,b)
return null},
nu(a,b){if($.F!==B.k)A.kP(a,b)
if(t.R.b(a)){b=a.gaT()
if(b==null){A.mk(a,B.q)
b=B.q}}else b=B.q
return new A.ao(a,b)},
jo(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.mo()
b.be(new A.ao(new A.aX(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.df(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.aX()
b.bf(n.a)
A.bV(b,p)
return}b.a^=2
o=b.b
o.aZ(o,new A.hw(n,b))},
bV(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.aW(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.bV(e.a,d)
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
if((d&15)===8)new A.hA(q,e,n).$0()
else if(o){if((d&1)!==0)new A.hz(q,j).$0()}else if((d&2)!==0)new A.hy(e,q).$0()
if(h!=null)$.F=h
d=q.c
if(d instanceof A.J){p=q.a.$ti
p=p.i("aq<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bq(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.jo(d,g,!0)
return}}g=q.a.b
f=r.a(g.c)
g.c=null
b=g.bq(f)
d=q.b
p=q.c
if(!d){g.$ti.c.a(p)
g.a=8
g.c=p}else{s.a(p)
g.a=g.a&1|16
g.c=p}e.a=g
d=g}},
nP(a,b){var s=t.C
if(s.b(a))return b.c_(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.bp(b,s.a(a),t.z,t.K)
throw A.e(A.jV(a,"onError",u.c))},
nI(){var s,r
for(s=$.cs;s!=null;s=$.cs){$.dy=null
r=s.b
$.cs=r
if(r==null)$.dx=null
s.a.$0()}},
nV(){$.jy=!0
try{A.nI()}finally{$.dy=null
$.jy=!1
if($.cs!=null)$.jO().$1(A.l3())}},
kZ(a){var s=new A.ei(a),r=$.dx
if(r==null){$.cs=$.dx=s
if(!$.jy)$.jO().$1(A.l3())}else $.dx=r.b=s},
nS(a){var s,r,q,p=$.cs
if(p==null){A.kZ(a)
$.dy=$.dx
return}s=new A.ei(a)
r=$.dy
if(r==null){s.b=p
$.cs=$.dy=s}else{q=r.b
s.b=q
$.dy=r.b=s
if(q==null)$.dx=s}},
ou(a){var s=$.F
if(B.k===s){A.jA(B.k,a)
return}A.jA(s,s.bo(s,a,t.H))
return},
oM(a,b){A.jD(a,"stream",t.K)
return new A.ez(b.i("ez<0>"))},
jB(a){return},
mE(a,b){if(b==null)b=A.o3()
if(t.da.b(b))return a.c_(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.bp(a,t.w.a(b),t.z,t.K)
throw A.e(A.aB("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
nK(a,b){var s=$.F
s.aW(s,a,b)},
nJ(){},
nR(a,b){A.nS(new A.ip(a,b))},
jA(a,b){if(B.k!==a)b=a.fO(b,t.H)
A.kZ(b)},
fQ:function fQ(a){this.a=a},
fP:function fP(a,b,c){this.a=a
this.b=b
this.c=c},
fR:function fR(a){this.a=a},
fS:function fS(a){this.a=a},
hZ:function hZ(){},
i_:function i_(a,b){this.a=a
this.b=b},
eh:function eh(a,b){this.a=a
this.b=!1
this.$ti=b},
ic:function ic(a){this.a=a},
id:function id(a){this.a=a},
iq:function iq(a){this.a=a},
ao:function ao(a,b){this.a=a
this.b=b},
el:function el(){},
d5:function d5(a,b){this.a=a
this.$ti=b},
bg:function bg(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
J:function J(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
ht:function ht(a,b){this.a=a
this.b=b},
hx:function hx(a,b){this.a=a
this.b=b},
hw:function hw(a,b){this.a=a
this.b=b},
hv:function hv(a,b){this.a=a
this.b=b},
hu:function hu(a,b){this.a=a
this.b=b},
hA:function hA(a,b,c){this.a=a
this.b=b
this.c=c},
hB:function hB(a,b){this.a=a
this.b=b},
hC:function hC(a){this.a=a},
hz:function hz(a,b){this.a=a
this.b=b},
hy:function hy(a,b){this.a=a
this.b=b},
ei:function ei(a){this.a=a
this.b=null},
d_:function d_(){},
fw:function fw(a,b){this.a=a
this.b=b},
fx:function fx(a,b){this.a=a
this.b=b},
dp:function dp(){},
hW:function hW(a){this.a=a},
hV:function hV(a){this.a=a},
ej:function ej(){},
ci:function ci(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
cj:function cj(a,b){this.a=a
this.$ti=b},
ck:function ck(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
d6:function d6(){},
fT:function fT(a){this.a=a},
dr:function dr(){},
bB:function bB(){},
bT:function bT(a,b){this.b=a
this.a=null
this.$ti=b},
em:function em(){},
aS:function aS(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
hS:function hS(a,b){this.a=a
this.b=b},
ez:function ez(a){this.$ti=a},
fN:function fN(){},
fO:function fO(a,b,c){this.a=a
this.b=b
this.c=c},
ip:function ip(a,b){this.a=a
this.b=b},
m3(a,b,c){return b.i("@<0>").a3(c).i("j9<1,2>").a(A.oc(a,new A.b3(b.i("@<0>").a3(c).i("b3<1,2>"))))},
ab(a,b){return new A.b3(a.i("@<0>").a3(b).i("b3<1,2>"))},
m4(a){return new A.bi(a.i("bi<0>"))},
ja(a){return new A.bi(a.i("bi<0>"))},
jq(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
k5(a){var s,r
if(A.jH(a))return"{...}"
s=new A.cf("")
try{r={}
B.b.m($.az,a)
s.a+="{"
r.a=!0
a.aI(0,new A.fd(r,s))
s.a+="}"}finally{if(0>=$.az.length)return A.a($.az,-1)
$.az.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
bi:function bi(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
bW:function bW(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
eu:function eu(a){this.a=a
this.c=this.b=null},
d8:function d8(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
y:function y(){},
H:function H(){},
fc:function fc(a){this.a=a},
fd:function fd(a,b){this.a=a
this.b=b},
b9:function b9(){},
dm:function dm(){},
nL(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ad(r)
q=A.dL(String(s),null,null)
throw A.e(q)}q=A.ie(p)
return q},
ie(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.es(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.ie(a[s])
return a},
n3(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.lx()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
n2(a,b,c,d){var s=a?$.lw():$.lv()
if(s==null)return null
if(0===c&&d===b.length)return A.kA(s,b)
return A.kA(s,b.subarray(c,d))},
kA(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
n4(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
es:function es(a,b){this.a=a
this.b=b
this.c=null},
hL:function hL(a){this.a=a},
et:function et(a){this.a=a},
i6:function i6(){},
i5:function i5(){},
c9:function c9(){},
dI:function dI(){},
dJ:function dJ(){},
dU:function dU(){},
f6:function f6(a){this.a=a},
ef:function ef(){},
fK:function fK(a){this.a=a},
i4:function i4(a){this.a=a
this.b=16
this.c=0},
oj(a,b){var s=A.mi(a,b)
if(s!=null)return s
throw A.e(A.dL(a,null,null))},
lU(a,b){a=A.W(a,new Error())
if(a==null)a=A.aV(a)
a.stack=b.t(0)
throw a},
jb(a,b,c,d){var s,r=c?J.j6(a,d):J.j5(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
m5(a,b,c){var s,r,q=A.i([],c.i("x<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.X)(a),++r)B.b.m(q,c.a(a[r]))
q.$flags=1
return q},
aN(a,b){var s,r
if(Array.isArray(a))return A.i(a.slice(0),b.i("x<0>"))
s=A.i([],b.i("x<0>"))
for(r=J.cx(a);r.q();)B.b.m(s,r.gA())
return s},
mp(a,b,c){var s,r
A.aP(b,"start")
s=c-b
if(s<0)throw A.e(A.am(c,b,null,"end",null))
if(s===0)return""
r=A.mq(a,b,c)
return r},
mq(a,b,c){var s=a.length
if(b>=s)return""
return A.mj(a,b,c==null||c>s?s:c)},
e5(a){return new A.dS(a,A.k3(a,!1,!0,!1,!1,""))},
kd(a,b,c){var s=J.cx(b)
if(!s.q())return a
if(c.length===0){do a+=A.w(s.gA())
while(s.q())}else{a+=A.w(s.gA())
while(s.q())a=a+c+A.w(s.gA())}return a},
mo(){return A.bn(new Error())},
eV(a){if(typeof a=="number"||A.b1(a)||a==null)return J.bH(a)
if(typeof a=="string")return JSON.stringify(a)
return A.k7(a)},
lV(a,b){A.jD(a,"error",t.K)
A.jD(b,"stackTrace",t.l)
A.lU(a,b)},
dE(a){return new A.cz(a)},
aB(a,b){return new A.aX(!1,null,b,a)},
jV(a,b,c){return new A.aX(!0,a,b,c)},
eP(a,b,c){return a},
k8(a){var s=null
return new A.b7(s,s,!1,s,s,a)},
ml(a,b){return new A.b7(null,null,!0,a,b,"Value not in range")},
am(a,b,c,d,e){return new A.b7(b,c,!0,a,d,"Invalid value")},
b8(a,b,c){if(0>a||a>c)throw A.e(A.am(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.am(b,a,c,"end",null))
return b}return c},
aP(a,b){if(a<0)throw A.e(A.am(a,0,null,b,null))
return a},
j0(a,b,c,d){return new A.dM(b,!0,a,d,"Index out of range")},
aG(a){return new A.d3(a)},
kk(a){return new A.ed(a)},
aE(a){return new A.bb(a)},
ap(a){return new A.dH(a)},
dL(a,b,c){return new A.a1(a,b,c)},
m_(a,b,c){var s,r
if(A.jH(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.i([],t.s)
B.b.m($.az,a)
try{A.nG(a,s)}finally{if(0>=$.az.length)return A.a($.az,-1)
$.az.pop()}r=A.kd(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
j4(a,b,c){var s,r
if(A.jH(a))return b+"..."+c
s=new A.cf(b)
B.b.m($.az,a)
try{r=s
r.a=A.kd(r.a,a,", ")}finally{if(0>=$.az.length)return A.a($.az,-1)
$.az.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
nG(a,b){var s,r,q,p,o,n,m,l=a.gB(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.q())return
s=A.w(l.gA())
B.b.m(b,s)
k+=s.length+2;++j}if(!l.q()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gA();++j
if(!l.q()){if(j<=4){B.b.m(b,A.w(p))
return}r=A.w(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gA();++j
for(;l.q();p=o,o=n){n=l.gA();++j
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
e0(a,b,c,d){var s
if(B.m===c){s=J.an(a)
b=J.an(b)
return A.fD(A.bd(A.bd($.eO(),s),b))}if(B.m===d){s=J.an(a)
b=J.an(b)
c=J.an(c)
return A.fD(A.bd(A.bd(A.bd($.eO(),s),b),c))}s=J.an(a)
b=J.an(b)
c=J.an(c)
d=J.an(d)
d=A.fD(A.bd(A.bd(A.bd(A.bd($.eO(),s),b),c),d))
return d},
me(a){var s,r,q=$.eO()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.X)(a),++r)q=A.bd(q,J.an(a[r]))
return A.fD(q)},
h9:function h9(){},
L:function L(){},
cz:function cz(a){this.a=a},
be:function be(){},
aX:function aX(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b7:function b7(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
dM:function dM(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
d3:function d3(a){this.a=a},
ed:function ed(a){this.a=a},
bb:function bb(a){this.a=a},
dH:function dH(a){this.a=a},
e1:function e1(){},
cZ:function cZ(){},
ha:function ha(a){this.a=a},
a1:function a1(a,b,c){this.a=a
this.b=b
this.c=c},
k:function k(){},
bt:function bt(a,b,c){this.a=a
this.b=b
this.$ti=c},
Z:function Z(){},
d:function d(){},
eA:function eA(){},
fv:function fv(){this.b=this.a=0},
cf:function cf(a){this.a=a},
ng(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.w(a)
r=A.o4(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.v("Attempting to box non-Dart object.")
q={}
q[$.ly()]=a
r.error=q
r.stack=b.t(0)
return r},
lW(a,b){var s,r=v.G.Promise,q=new A.f0(a)
if(typeof q=="function")A.v(A.aB("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.ne,q)
s[$.iS()]=q
return A.u(new r(s))},
fi:function fi(a){this.a=a},
f0:function f0(a){this.a=a},
eZ:function eZ(a){this.a=a},
f_:function f_(a){this.a=a},
nd(a,b,c){t.Z.a(a)
if(A.j(c)>=1)return a.$1(b)
return a.$0()},
ne(a,b,c,d){t.Z.a(a)
A.j(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
dz(a,b,c,d){return d.a(a[b].apply(a,c))},
o4(a,b,c){var s,r
if(b==null)return c.a(new a())
if(b instanceof Array)switch(b.length){case 0:return c.a(new a())
case 1:return c.a(new a(b[0]))
case 2:return c.a(new a(b[0],b[1]))
case 3:return c.a(new a(b[0],b[1],b[2]))
case 4:return c.a(new a(b[0],b[1],b[2],b[3]))}s=[null]
B.b.ai(s,b)
r=a.bind.apply(a,s)
String(r)
return c.a(new r())},
jJ(a,b){var s=new A.J($.F,b.i("J<0>")),r=new A.d5(s,b.i("d5<0>"))
a.then(A.dA(new A.iG(r,b),1),A.dA(new A.iH(r),1))
return s},
iG:function iG(a,b){this.a=a
this.b=b},
iH:function iH(a){this.a=a},
f1:function f1(){},
f2:function f2(a,b,c){this.a=a
this.b=b
this.c=c},
hD:function hD(){},
hE:function hE(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
j_(a,b){var s=new A.f3()
s.ex(a,b)
return s},
f3:function f3(){this.a=$
this.b=0
this.c=2147483647},
fM:function fM(){},
i8:function i8(){},
i9:function i9(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dN:function dN(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
o8(a,b,c){var s,r="The decoded data is larger than the ",q=new A.dV(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.e(A.iW(r+b+" bytes allowed"))
throw s}if(q.e)throw A.e(A.iW(r+b+" bytes allowed"))
return p},
dV:function dV(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
iV(a){return new A.c7(a,null,null)},
lJ(a){return new A.cy(a,null,null)},
iW(a){return new A.dD(a,null,null)},
c7:function c7(a,b,c){this.a=a
this.b=b
this.c=c},
cy:function cy(a,b,c){this.a=a
this.b=b
this.c=c},
dD:function dD(a,b,c){this.a=a
this.b=b
this.c=c},
cA:function cA(a,b){this.a=a
this.b=b},
fu:function fu(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
l7(a,b,c,d){var s,r,q,p=c,o=new A.h7($.jw)
$.jw=o
try{if(d.$0())return!0
if(p){r=A.iV("Invalid "+a+" data")
throw A.e(r)}return!1}catch(q){s=A.ad(q)
r=s
if(!(r instanceof A.c7||r instanceof A.cy||r instanceof A.a1||t.b8.b(r)||t.k.b(r)))throw q
r=s instanceof A.dD
if(r)throw q
if(s instanceof A.cy){if(c){r=A.iV(s.a)
throw A.e(r)}return!1}if(s instanceof A.c7){if(p)throw q
return!1}if(p){r=A.iV("Invalid "+a+" data: "+A.w(s))
throw A.e(r)}return!1}finally{$.jw=o.a}},
h7:function h7(a){this.a=a},
j1(a,b,c,d){var s,r,q,p,o=new A.dO(b)
if(d==null)d=0
A.aP(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.V(a))
p=J.c6(B.d.gab(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
dO:function dO(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
dP:function dP(){},
jf(a){var s=a==null?32768:a
return new A.bQ(new Uint8Array(s),B.o)},
bQ:function bQ(a,b){this.b=0
this.c=a
this.a=b},
bw:function bw(){},
lK(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
jX(a,b,c){var s,r,q,p=b+c,o=$.iR()
for(s=a.length,r=b,q=4294967295;r<p;++r){if(!(r<s))return A.a(a,r)
q=o[(q^a[r])&255]^q>>>8}return(q^4294967295)&2147483647},
aC(a,b){return(a&65535)*b+(((a>>>16)*b&65535)<<16>>>0)>>>0},
jW(a,b){return(B.a.dm(a,b)|B.a.ep(a,32-b))>>>0},
lL(a,b,c,d){var s,r,q,p,o,n,m=3266489917,l=d?1367130551:0,k=(2654435761^c^l)>>>0,j=b+((c&4294967292)>>>0)
for(l=a.length,s=b;s<j;){if(!(s<l))return A.a(a,s)
r=a[s]
q=s+1
if(!(q<l))return A.a(a,q)
q=a[q]
p=s+2
if(!(p<l))return A.a(a,p)
p=a[p]
o=s+3
if(!(o<l))return A.a(a,o)
o=k+A.aC((r|q<<8|p<<16|a[o]<<24)>>>0,m)>>>0
k=A.aC((o<<17|o>>>15)>>>0,668265263)
s+=4}n=b+c
while(s<n){if(!(s<l))return A.a(a,s)
r=k+A.aC(a[s],374761393)>>>0
k=A.aC((r<<11|r>>>21)>>>0,2654435761);++s}k=A.aC((k^k>>>15)>>>0,2246822519)
k=A.aC((k^k>>>13)>>>0,m)
return(k^k>>>16)>>>0},
iY(a,b,c,d,e){var s=e?2147483648:0,r=(a&2147483647|s)>>>0,q=A.lL(b,c,d,e)
return new A.z(r,r===0&&q===0?1:q)},
jY(a,b,c,d){var s=A.jW(A.aC((a^c)>>>0,2246822519),13),r=A.jW(A.aC((b^d)>>>0,3266489917),17)
s=A.aC(s+r>>>0,668265263)
return new A.z(s,A.aC((r^s>>>16)>>>0,374761393))},
ex:function ex(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eQ:function eQ(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=4194304
_.f=!0
_.w=b
_.x=c
_.z=_.y=0
_.Q=d
_.as=e
_.at=0
_.ax=null
_.ch=_.ay=0
_.CW=f
_.cx=g
_.cy=h
_.db=i
_.dy=_.dx=0},
eU:function eU(a,b,c){this.a=a
this.b=b
this.c=c},
eT:function eT(a,b){this.a=a
this.b=b},
eR:function eR(a){this.a=a},
eS:function eS(a){this.a=a},
b5(a,b){var s,r,q,p,o=a.length
if(!(b>=0&&b<o))return A.a(a,b)
s=a[b]
r=b+1
if(!(r<o))return A.a(a,r)
r=a[r]
q=b+2
if(!(q<o))return A.a(a,q)
q=a[q]
p=b+3
if(!(p<o))return A.a(a,p)
return(s|r<<8|q<<16|a[p]<<24)>>>0},
m6(b0,b1,b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9
if(b1<0||b1>b0.length)throw A.e(A.am(b1,0,b0.length,"srcLength",null))
if(b1===0)return 0
s=b4>=0?b4:b2.length
r=0
q=0
if(b1>=13){B.e.N(b3,0,16384,-1)
p=b1-12
o=b1-5
n=A.b5(b0,0)*2654435761>>>0>>>18
b3.$flags&2&&A.h(b3)
if(!(n<16384))return A.a(b3,n)
b3[n]=0
m=A.b5(b0,1)*2654435761>>>0>>>18
A:for(n=b0.length,l=b2.$flags|0,k=1;;){j=k
i=1
h=64
do{g=j+i
i=h>>>6;++h
if(g>p)break A
f=A.b5(b0,g)*2654435761>>>0>>>18
if(!(m>=0&&m<16384))return A.a(b3,m)
e=b3[m]
b3[m]=j
if(e<0||j-e>65535||A.b5(b0,e)!==A.b5(b0,j)){j=g
m=f
continue}else break}while(!0)
k=j
for(;;){d=!1
if(k>q)if(e>0){d=k-1
if(!(d>=0&&d<n))return A.a(b0,d)
d=b0[d]
c=e-1
if(!(c<n))return A.a(b0,c)
c=d===b0[c]
d=c}if(!d)break;--k;--e}for(;;){if(!!0){m=f
break}b=k-q
a=r+1
if(a+B.a.J(b,255)+1+b+2>s)return-1
d=b>=15
a0=(d?15:b)<<4
if(d){a1=b-15
for(;a1>=255;a=a2){a2=a+1
l&2&&A.h(b2)
if(!(a>=0&&a<b2.length))return A.a(b2,a)
b2[a]=255
a1-=255}a2=a+1
l&2&&A.h(b2)
if(!(a>=0&&a<b2.length))return A.a(b2,a)
b2[a]=a1
a=a2}for(a3=0;a3<b;++a3,a=a2){a2=a+1
d=q+a3
if(!(d>=0&&d<n))return A.a(b0,d)
d=b0[d]
l&2&&A.h(b2)
if(!(a>=0&&a<b2.length))return A.a(b2,a)
b2[a]=d}a4=k-e
a2=a+1
l&2&&A.h(b2)
d=b2.length
if(!(a>=0&&a<d))return A.a(b2,a)
b2[a]=a4&255
a=a2+1
c=B.a.L(a4,8)
if(!(a2>=0&&a2<d))return A.a(b2,a2)
b2[a2]=c&255
a5=e+4
a6=k+4
for(;;){if(a6<o){if(!(a6>=0&&a6<n))return A.a(b0,a6)
c=b0[a6]
if(!(a5>=0&&a5<n))return A.a(b0,a5)
c=c===b0[a5]}else c=!1
if(!c)break;++a6;++a5}a7=a6-k-4
if(a7>=15){a0=(a0|15)>>>0
a1=a7-15
if(a+(B.a.J(a1,255)+1)>=s)return-1
for(;a1>=255;a=a2){a2=a+1
if(!(a>=0&&a<d))return A.a(b2,a)
b2[a]=255
a1-=255}a2=a+1
if(!(a>=0&&a<d))return A.a(b2,a)
b2[a]=a1
a=a2}else a0=(a0|a7)>>>0
if(!(r>=0&&r<d))return A.a(b2,r)
b2[r]=a0
if(a6>p){q=a6
r=a
break A}d=a6-2
c=A.b5(b0,d)*2654435761>>>0>>>18
if(!(c<16384))return A.a(b3,c)
b3[c]=d
a8=A.b5(b0,a6)*2654435761>>>0>>>18
if(!(a8<16384))return A.a(b3,a8)
e=b3[a8]
b3[a8]=a6
if(e<0||a6-e>65535||A.b5(b0,e)!==A.b5(b0,a6)){k=a6+1
m=A.b5(b0,k)*2654435761>>>0>>>18
q=a6
r=a
break}k=a6
q=k
r=a}}}a9=b1-q
n=a9>=15
l=r+(1+(n?B.a.J(a9-15,255)+1:0)+a9)
if(l>s||l>b2.length)return-1
a=r+1
l=b2.$flags|0
if(n){l&2&&A.h(b2)
n=b2.length
if(!(r>=0&&r<n))return A.a(b2,r)
b2[r]=240
a1=a9-15
for(r=a;a1>=255;r=a){a=r+1
if(!(r>=0&&r<n))return A.a(b2,r)
b2[r]=255
a1-=255}a=r+1
if(!(r>=0&&r<n))return A.a(b2,r)
b2[r]=a1
r=a}else{l&2&&A.h(b2)
if(!(r>=0&&r<b2.length))return A.a(b2,r)
b2[r]=a9<<4>>>0
r=a}n=r+a9
B.d.M(b2,r,n,b0,q)
return n},
m7(a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3
if(a6<0||a5+a6>a4.length||a8<0||a8>a7.length)throw A.e(A.k8("Invalid LZ4 slice bounds"))
if(a6===0){if(a8!==0)throw A.e(B.Z)
return 0}s=a5+a6
for(r=a7.length,q=a7.$flags|0,p=a4.length,o=a5,n=0;o<s;){m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
l=a4[o]
k=l>>>4
if(k===15)for(o=m;;o=m){if(o>=s)throw A.e(B.a_)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
k+=j
if(j!==255){o=m
break}}else o=m
m=o+k
if(m>s||n+k>a8)throw A.e(B.Y)
if(k>0){i=n+k
B.d.M(a7,n,i,a4,o)
n=i
o=m}if(o>=s)break
m=o+2
if(m>s)throw A.e(B.U)
if(!(o>=0&&o<p))return A.a(a4,o)
h=a4[o]
g=o+1
if(!(g<p))return A.a(a4,g)
f=(h|a4[g]<<8)>>>0
if(f<=0||f>n)throw A.e(B.W)
h=l&15
e=h+4
if(h===15)for(o=m;;o=m){if(o>=s)throw A.e(B.a0)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
e+=j
if(j!==255){o=m
break}}else o=m
i=n+e
if(i>a8)throw A.e(B.a2)
d=n-f
if(f>=e){B.d.M(a7,n,i,a7,d)
n=i}else if(f===4){if(!(d>=0&&d<r))return A.a(a7,d)
c=a7[d]
h=d+1
if(!(h<r))return A.a(a7,h)
b=a7[h]
h=d+2
if(!(h<r))return A.a(a7,h)
a=a7[h]
h=d+3
if(!(h<r))return A.a(a7,h)
a0=a7[h]
if(c===0&&b===0&&a===0&&a0===0){B.d.N(a7,n,i,0)
n=i}else{a1=n+((e&4294967292)>>>0)
while(n<a1){q&2&&A.h(a7)
if(!(n>=0&&n<r))return A.a(a7,n)
a7[n]=c
h=n+1
if(!(h<r))return A.a(a7,h)
a7[h]=b
h=n+2
if(!(h<r))return A.a(a7,h)
a7[h]=a
h=n+3
if(!(h<r))return A.a(a7,h)
a7[h]=a0
n+=4}for(;n<i;d=a3,n=a2){a2=n+1
a3=d+1
if(!(d<r))return A.a(a7,d)
h=a7[d]
q&2&&A.h(a7)
if(!(n>=0&&n<r))return A.a(a7,n)
a7[n]=h}}}else if(f===1){if(!(d>=0&&d<r))return A.a(a7,d)
B.d.N(a7,n,i,a7[d])
n=i}else for(;n<i;d=a3,n=a2){a2=n+1
a3=d+1
if(!(d>=0&&d<r))return A.a(a7,d)
h=a7[d]
q&2&&A.h(a7)
if(!(n>=0&&n<r))return A.a(a7,n)
a7[n]=h}}if(n!==a8)throw A.e(A.dL("LZ4 decoded "+n+" bytes, expected "+a8,null,null))
return n},
fb:function fb(a,b){this.a=a
this.b=b
this.c=0},
mw(c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5=null,c6=d5*d1,c7=c9.length
if(d5<=0||d1<=0||c6>65536||c7<2||c7>4||d4.length<c6*4)return c5
s=B.a.J(d5+16-1,16)
r=s*B.a.J(d1+16-1,16)
q=c7*r
p=new Uint16Array(q)
o=new Uint8Array(4)
B.d.N(o,0,4,255)
n=new Uint32Array(4)
m=new Uint32Array(4)
l=c6*4
if((d4.byteOffset&3)===0){k=A.jm(d4,0,l)
j=c5}else{j=new Uint8Array(l)
k=A.jm(j,0,l)}i=A.i([],t.a1)
h=A.ab(t.h6,t.L)
g=128+p.byteLength
for(f=k.length,e=j!=null,d=0,c=0;c<c7;++c){if(!(c<c9.length))return A.a(c9,c)
b=c9[c]
a=b-c8
a0=!0
if(a>=0)if(a<4){if(!(a>=0&&a<4))return A.a(o,a)
a0=o[a]!==255||!d3.$2(b,d4)}if(a0)return c5
if(e)B.d.I(j,0,l,d4)
if(!(a>=0&&a<4))return A.a(o,a)
o[a]=c
a1=d0.$1(b)
if(a1==null)a1=B.u
if(!(c<4))return A.a(n,c)
n[c]=a1.a
m[c]=a1.b
for(a0=c>0,a2=c*r,a3=(c-1)*r,a4=0;a4<r;++a4){a5=B.a.O(a4,s)*16
a6=B.a.a2(a4,s)*16
a7=Math.min(16,d5-a5)
a8=Math.min(16,d1-a6)
for(a9=2166136261,b0=0;b0<a8;++b0){b1=(a6+b0)*d5+a5
for(b2=0;b2<a7;++b2){b3=b1+b2
if(!(b3>=0&&b3<f))return A.a(k,b3)
a9=((a9^k[b3])>>>0)*16777619>>>0}}b4=h.e9(new A.ay(a7,a8,a9),new A.fF())
b3=J.b2(b4)
b6=b3.gB(b4)
for(;;){if(!b6.q()){b5=-1
break}b5=b6.gA()
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
B.f.M(b7,b0*a7,c3*a7,k,(a6+b0)*d5+a5)}b5=i.length
b3.m(b4,b5)
B.b.m(i,b7)}b3=a2+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
p[b3]=b5
if(a0){b3=a3+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
b3=p[b3]!==b5}else b3=!1
if(b3)++d}}if(d*3>(c7-1)*r)return c5
q=A.i([],t.gN)
for(l=i.length,c4=0;c4<i.length;i.length===l||(0,A.X)(i),++c4)q.push(J.lF(B.f.gab(i[c4])))
return new A.ec(d5,d1,c8,o,p,q,new A.d(),g,n,m)},
fE:function fE(){this.a=null
this.b=-1},
ec:function ec(a,b,c,d,e,f,g,h,i,j){var _=this
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
fF:function fF(){},
au:function au(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iz(a){var s=0,r=A.kU(t.H),q,p,o,n,m
var $async$iz=A.l1(function(b,c){if(b===1)return A.kF(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.ib(A.jJ(A.u(v.G.WebAssembly.instantiate(a)),t.m),$async$iz)
case 2:o=n.u(m.u(c.instance).exports)
for(q=0;q<13;++q){p=B.af[q]
if(!(typeof o[p]==="function"))throw A.e(A.aE("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.u(o.memory).buffer).byteLength===0)throw A.e(A.aE("FastLottie Wasm memory is empty"))
$.l=o
return A.kG(null,r)}})
return A.kH($async$iz,r)},
aJ(a){var s,r,q=$.l
q.toString
s=a===0?1:a
r=A.j(q.malloc(s))
if(r<=0)throw A.e(A.aE("Could not allocate "+a+" Wasm bytes"))
B.d.N(A.je(t.a.a(A.u($.l.memory).buffer),r,a),0,a,0)
return r},
fh(a){var s=new A.aY(!0,a,null,null)
if($.l!=null)s.c=A.aJ(a*4)
else s.d=new Uint32Array(a)
return s},
iI(a,b){var s=a.c
if(s!=null)$.l.fastlottie_clear_pixels(s,b)
else B.f.N(a.gv(),0,b,0)},
ov(a,b,c,d,e,f,g){var s,r,q=a.c
if(q!=null&&e.b!=null){s=$.l
s.toString
r=e.b
r.toString
A.dz(s,"fastlottie_fill_solid_spans",[q,b,c,d,r,f,g],t.H)
return!0}return!1},
oo(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dz(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
op(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dz(s,"fastlottie_blend_solid",[q,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
or(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dz(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
oq(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0,a1,a2,a3,a4){var s,r,q,p=a.c
if(p==null||e.b==null||g.c==null)return!1
s=$.l
s.toString
r=e.b
r.toString
q=g.c
q.toString
A.dz(s,"fastlottie_gradient_spans",[p,b,c,d,r,f,q,h,i,j?1:0,k,l,m,n,o,a0,a1,a2,a3,a4],t.H)
return!0},
ma(){var s,r,q=$.l
if(q==null)return null
try{s=A.j(q.fl_dense_new())
if(!J.m(s,0)){q=A.aJ(16)
return new A.fe(s,q)}}catch(r){}return null},
m9(){var s,r=$.ff
if(r!=null){$.cL=$.cL+1
return r}s=A.ma()
if(s==null)return null
$.ff=s
$.cL=1
return s},
b6:function b6(a){this.a=a
this.c=this.b=null},
aY:function aY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fe:function fe(a,b){var _=this
_.a=a
_.b=b
_.y=_.x=_.w=_.r=_.f=_.e=_.d=_.c=0},
fg:function fg(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
bF(a,b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g
while(a instanceof A.T)a=a.a
if(a instanceof A.a5){s=a.c
if(!s.gaD()){r=a4.d2(a6)
A.eG(s,b,c,d,e,f,a0,a1,r)
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
A.bF(s[k],b,q,p,o,n,m,l,a2,a3,a4,a5,j)}return}if(a instanceof A.bl){i=A.nk(a.a,a.b,b,A.kT(c,d,e,f,a2),a4,a5,a6)
if(i!=null&&i.r>0)a3.aF(i,c,d,e,f,a0,a1)
return}if(a instanceof A.aR){if(a.b===3&&a.a.length>=2){for(s=a.a,k=0;k<s.length-1;++k)A.bF(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
h=a4.eG(a6)
A.bF(B.b.gad(s),b,c,d,e,f,a0,a1,a2,h,a4,a5,a6+1)
a3.fM(h)
return}for(s=a.a,k=0;k<s.length;++k)A.bF(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
return}if(a.ga6()){a3.aF(a4.dr(a,b),c,d,e,f,a0,a1)
return}if(c===1&&d===0&&e===0&&f===1&&a0===0&&a1===0)A.ij(a,b,a2,a3)
else{g=a4.fx
g.l(0)
A.ij(a,b,A.kT(c,d,e,f,a2),g)
a3.aF(g,c,d,e,f,a0,a1)}},
kT(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
kC(a,b,c,d){var s,r,q,p,o
if(d==null){a.u(b,c)
return}s=d.a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
a.u(r*b+p*c+s[4],q*b+o*c+s[5])},
kN(b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=b3.e,b0=a9.n(b4),b1=b0.length,b2=b1/6|0
if(b2===0)return
s=b3.f
r=b3.r
if(r.length!==0){q=a9.b.a
if(b4<=B.h.ga5(q)){p=B.b.ga5(r).a
s=p}else if(b4>=B.h.gad(q)){p=B.b.gad(r).a
s=p}else{a9=a9.r
if(!(a9<r.length))return A.a(r,a9)
o=r[a9]
n=o.a
m=o.b
p=n&&m
s=n}}else p=s
b6.a4(s)
for(;;)break
if(0>=b1)return A.a(b0,0)
a9=b0[0]
if(1>=b1)return A.a(b0,1)
A.kC(b6,a9,b0[1],b7)
l=b0[0]
k=b0[1]
j=p?b2:b2-1
for(a9=b7!=null,i=1;i<=j;++i,k=a,l=b){h=(i-1)*6
g=B.a.O(i,b2)*6
r=h+4
if(!(r>=0&&r<b1))return A.a(b0,r)
f=b0[r]
r=h+5
if(!(r>=0&&r<b1))return A.a(b0,r)
e=b0[r]
r=g+2
if(!(r<b1))return A.a(b0,r)
d=b0[r]
r=g+3
if(!(r<b1))return A.a(b0,r)
c=b0[r]
if(!(g<b1))return A.a(b0,g)
b=b0[g]
r=g+1
if(!(r<b1))return A.a(b0,r)
a=b0[r]
if(Math.abs(f)<=0.0001&&Math.abs(e)<=0.0001&&Math.abs(d)<=0.0001&&Math.abs(c)<=0.0001)A.kC(b6,b,a,b7)
else{r=h+1
a0=b+d
a1=a+c
if(a9){q=b7.a
a2=q[0]
a3=q[1]
g=q[2]
a4=q[3]
a5=q[4]
a6=q[5]
if(!(h>=0&&h<b1))return A.a(b0,h)
a7=b0[h]+f
if(!(r>=0&&r<b1))return A.a(b0,r)
a8=b0[r]+e
b6.U(a2*l+g*k+a5,a3*l+a4*k+a6,a2*a7+g*a8+a5,a3*a7+a4*a8+a6,a2*a0+g*a1+a5,a3*a0+a4*a1+a6,a2*b+g*a+a5,a3*b+a4*a+a6,b5)}else{if(!(h>=0&&h<b1))return A.a(b0,h)
q=b0[h]
if(!(r>=0&&r<b1))return A.a(b0,r)
b6.U(l,k,q+f,b0[r]+e,a0,a1,b,a,b5)}}}b6.a1()},
ij(a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(a3 instanceof A.ax){A.kN(a3,a4,a5,a6,null)
return}if(a3 instanceof A.b_){a6.a4(!0)
s=a6.gfL()
a3.f8(a4,s,s,new A.ik(a6,a5),a6.gh4())
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
a6.u(p,s)
j=p+l
i=p+n
h=o-k
g=o+k
f=o+m
e=p-l
d=p-n
if(!a3.f){a6.U(p,s,j,s,i,h,i,o,a5)
a6.U(i,o,i,g,j,f,p,f,a5)
a6.U(p,f,e,f,d,g,d,o,a5)
a6.U(d,o,d,h,e,s,p,s,a5)}else{a6.U(p,s,e,s,d,h,d,o,a5)
a6.U(d,o,d,g,e,f,p,f,a5)
a6.U(p,f,j,f,i,g,i,o,a5)
a6.U(i,o,i,h,j,s,p,s,a5)}a6.a1()
return}s=a3.x.n(a4)
if(0>=s.length)return A.a(s,0)
c=B.c.C(s[0],0,Math.min(Math.abs(n),Math.abs(m)))
if(c<=0.0001){a6.a4(!0)
s=p+n
j=o-m
a6.u(s,j)
i=o+m
h=p-n
if(!a3.f){a6.u(s,i)
a6.u(h,i)
a6.u(h,j)}else{a6.u(h,j)
a6.u(h,i)
a6.u(s,i)}a6.a1()
return}b=c*0.5522847498307936
a6.a4(!0)
s=p+n
j=o-m
i=j+c
a6.u(s,i)
h=o+m
g=s-c
f=p-n
e=i-b
d=h-c
a=g+b
a0=f+c
if(!a3.f){a6.u(s,d)
a1=d+b
a6.U(s,d,s,a1,a,h,g,h,a5)
a6.u(a0,h)
a2=a0-b
a6.U(a0,h,a2,h,f,a1,f,d,a5)
a6.u(f,i)
a6.U(f,i,f,e,a2,j,a0,j,a5)
a6.u(g,j)
a6.U(g,j,a,j,s,e,s,i,a5)}else{a6.U(s,i,s,e,a,j,g,j,a5)
a6.u(a0,j)
a1=a0-b
a6.U(a0,j,a1,j,f,e,f,i,a5)
a6.u(f,d)
i=d+b
a6.U(f,d,f,i,a1,h,a0,h,a5)
a6.u(g,h)
a6.U(g,h,a,h,s,i,s,d,a5)}a6.a1()}},
nk(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=a.a,b=c.length
if(a0>=b)return null
s=a.b.n(a1)
if(0>=s.length)return A.a(s,0)
r=B.c.C(s[0],0,100)/100
s=a.c.n(a1)
if(0>=s.length)return A.a(s,0)
q=B.c.C(s[0],0,100)/100
p=Math.abs(q-r)
if(p<0.000001)return null
if(!(a0<c.length))return A.a(c,a0)
o=c[a0]
n=a3.eJ(a4)
s=a4+1
A.bF(o,a1,1,0,0,1,0,0,a2,n,a3,s,a5)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a.d.n(a1)
if(0>=l.length)return A.a(l,0)
k=B.c.O(m+l[0]/360,1)
j=k+p
if(!a.e){i=A.kV(o,a1,a2,a3,n,s,a5)
h=0}else{g=a3.f9(a4,a,a1,a2)
if(g==null){g=a3.eH(a4,b+1)
g.$flags&2&&A.h(g)
m=g.length
if(0>=m)return A.a(g,0)
g[0]=0
for(f=0,e=0;e<b;){if(!(e<c.length))return A.a(c,e)
l=c[e]
f+=A.kV(l,a1,a2,a3,e===a0?n:null,s,a5);++e
if(!(e<m))return A.a(g,e)
g[e]=f}a3.fn(a4,a,a1,a2)}c=g.length
if(!(b<c))return A.a(g,b)
i=g[b]
if(!(a0<c))return A.a(g,a0)
h=g[a0]}d=a3.eI(a4)
c=a3.p3
A.kL(n,k*i-h,Math.min(j,1)*i-h,d,c)
if(j>1)A.kL(n,-h,(j-1)*i-h,d,c)
return d},
kV(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga6()){s=d.fa(a)
if(s!=null)return s}r=A.ek()
if(e!=null)r.se_(e)
else{r.se_(d.eF(f))
A.bF(a,b,1,0,0,1,0,0,c,r.ap(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.v(A.al(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.v(A.al(""))
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
if(o===r)A.v(A.al(""))
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
q+=Math.sqrt(n*n+o*o)}}++p}if(a.ga6()){o=d.bv
o.E(0,a)
if(o.a>=256)o.E(0,new A.M(o,o.$ti.i("M<1>")).ga5(0))
n=d.ay
n.toString
o.p(0,a,new A.aa(n,q,t.e))}return q},
kL(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
k=a7.aH(l+1)
k.$flags&2&&A.h(k)
q=k.length
if(0>=q)return A.a(k,0)
k[0]=0
for(j=0;j<l;j=h){i=p+j
h=j+1
g=p+B.a.O(h,n)
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
k.$flags&2&&A.h(k)
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
a6.u(q,f[a2])}a6.a1()}else A.kK(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
kK(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.a.L(r+a,1)
p=q+1
if(!(p<s))return A.a(a4,p)
if(a4[p]<=a6)r=p
else a=q}a8.a4(!1)
o=a1+r
p=r+1
n=a1+B.a.O(p,a2)
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
a8.u(j+(p-j)*k,h+(m[n]-h)*k)
for(g=r;g<a5;g=f){f=g+1
if(!(f<s))return A.a(a4,f)
e=a4[f]
d=a1+g
c=a1+B.a.O(f,a2)
if(a7<=e+1e-9){if(!(g<s))return A.a(a4,g)
p=a4[g]
b=e-p
s=b<=1e-12?0:B.c.C((a7-p)/b,0,1)
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
a8.u(j+(p-j)*s,h+(m[c]-h)*s)
break}p=a0.a
if(!(c>=0&&c<p.length))return A.a(p,c)
p=p[c]
m=a0.b
if(!(c<m.length))return A.a(m,c)
a8.u(p,m[c])}a8.a1()},
n5(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
for(s=0,r=0;r<a9;++r){q=(r&1)===0?1:0.1
if(!(r<a8.length))return A.a(a8,r)
p=a8[r].n(b3)
if(0>=p.length)return A.a(p,0)
o=Math.max(q,p[0])
b0.$flags&2&&A.h(b0)
if(!(r<b0.length))return A.a(b0,r)
b0[r]=o
s+=o}if(s<=0)return
a8=b2.b.n(b3)
if(0>=a8.length)return A.a(a8,0)
n=B.c.O(a8[0],s)
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
f=b5.aH(g+1)
f.$flags&2&&A.h(f)
q=f.length
if(0>=q)return A.a(f,0)
f[0]=0
for(e=0;e<g;e=c){d=j+e
c=e+1
b=j+B.a.O(c,i)
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
f.$flags&2&&A.h(f)
if(!(c<q))return A.a(f,c)
f[c]=p+a1}if(!(g<q))return A.a(f,g)
a3=f[g]
if(a3<=1e-7)continue
a4=b0[l]-m
for(q=a3-1e-7,a5=l,a6=0;a6<q;a6=a7){a7=Math.min(a3,a6+a4)
if((a5&1)===0&&a7>a6+1e-7)A.kK(b1,j,i,h,f,g,a6,a7,b4)
a5=(a5+1)%a9
if(!(a5<a8))return A.a(b0,a5)
a4=b0[a5]}}},
kJ(e4,e5,e6,e7,e8,e9,f0,f1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3
if(e5<=0)return
if(f1.a&&f1.h7(e4,e5,e6,e7,e8,e9,f0))return
s=e8*e8
r=new A.ii(new A.ih(e5,Math.max(0.12,e9*0.5),f0),f0,e5)
for(q=e6===2,p=e6===3,o=f1.d,n=f1.e,m=f1.b,l=f1.c,k=0;k<e4.r;++k){j=e4.c
if(!(k<j.length))return A.a(j,k)
i=j[k]
j=e4.d
if(!(k<j.length))return A.a(j,k)
h=j[k]
g=h-i
if(g<=0)continue
j=e4.e
if(!(k<j.length))return A.a(j,k)
f=j[k]===1
e=m.aH(g)
d=l.aH(g)
for(j=e4.a,c=j.length,b=e4.b,a=b.length,a0=e.length,a1=d.length,a2=e.$flags|0,a3=d.$flags|0,a4=i,a5=0;a4<h;++a4){if(!(a4>=0&&a4<c))return A.a(j,a4)
a6=j[a4]
if(!(a4<a))return A.a(b,a4)
a7=b[a4]
if(a5!==0){a8=a5-1
if(!(a8>=0&&a8<a0))return A.a(e,a8)
a9=e[a8]
if(!(a8<a1))return A.a(d,a8)
a8=Math.abs(a6-a9)+Math.abs(a7-d[a8])>=0.000001}else a8=!0
if(a8){a2&2&&A.h(e)
if(!(a5<a0))return A.a(e,a5)
e[a5]=a6
b0=a5+1
a3&2&&A.h(d)
if(!(a5<a1))return A.a(d,a5)
d[a5]=a7
a5=b0}}j=!1
if(f)if(a5>1){if(0>=a0)return A.a(e,0)
j=e[0]
c=a5-1
if(!(c<a0))return A.a(e,c)
b=e[c]
if(0>=a1)return A.a(d,0)
a=d[0]
if(!(c<a1))return A.a(d,c)
c=Math.abs(j-b)+Math.abs(a-d[c])<0.000001
j=c}if(j)--a5
if(a5===0)continue
if(a5===1){if(0>=a0)return A.a(e,0)
b1=e[0]
if(0>=a1)return A.a(d,0)
b2=d[0]
if(q){f0.a4(!0)
f0.u(b1+e5,b2)
r.$6(b1,b2,1,0,0,1)
r.$6(b1,b2,0,1,-1,0)
r.$6(b1,b2,-1,0,0,-1)
r.$6(b1,b2,0,-1,1,0)
f0.a1()}else if(p){f0.a4(!0)
j=b1-e5
c=b2-e5
f0.u(j,c)
b=b1+e5
f0.u(b,c)
c=b2+e5
f0.u(b,c)
f0.u(j,c)
f0.a1()}continue}b3=f?a5:a5-1
b4=o.aH(b3)
b5=n.aH(b3)
for(j=b4.$flags|0,c=b5.$flags|0,b6=0;b6<b3;b6=b7){b7=b6+1
b8=B.a.O(b7,a5)
if(!(b8>=0&&b8<a0))return A.a(e,b8)
b=e[b8]
if(!(b6<a0))return A.a(e,b6)
b9=b-e[b6]
if(!(b8<a1))return A.a(d,b8)
b=d[b8]
if(!(b6<a1))return A.a(d,b6)
c0=b-d[b6]
c1=Math.sqrt(b9*b9+c0*c0)
if(c1>1e-9){j&2&&A.h(b4)
if(!(b6<b4.length))return A.a(b4,b6)
b4[b6]=b9/c1
c&2&&A.h(b5)
if(!(b6<b5.length))return A.a(b5,b6)
b5[b6]=c0/c1}else{j&2&&A.h(b4)
if(!(b6<b4.length))return A.a(b4,b6)
b4[b6]=0
c&2&&A.h(b5)
if(!(b6<b5.length))return A.a(b5,b6)
b5[b6]=0}}c2=new A.ig(b4,b5,e5,f0,e7,s,r)
if(f){f0.a4(!0)
for(c3=0;c3<a5;++c3){c4=B.a.O(c3-1+b3,b3)
if(!(c3<a0))return A.a(e,c3)
j=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c4,c3,j,d[c3],!1)}f0.a1()
f0.a4(!0)
for(c3=a5-1;c3>=0;c3=c5){c5=c3-1
c6=B.a.O(c5+b3,b3)
if(!(c3<a0))return A.a(e,c3)
j=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c3,c6,j,d[c3],!0)}f0.a1()}else{f0.a4(!0)
if(0>=a0)return A.a(e,0)
j=e[0]
c=b5.length
if(0>=c)return A.a(b5,0)
b=b5[0]
c7=j+e5*-b
if(0>=a1)return A.a(d,0)
j=d[0]
a=b4.length
if(0>=a)return A.a(b4,0)
a2=e5*b4[0]
c8=j+a2
if(p)f0.u(c7-a2,c8-e5*b)
else f0.u(c7,c8)
for(j=a5-1,c3=1;c3<j;++c3){if(!(c3<a0))return A.a(e,c3)
b=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c3-1,c3,b,d[c3],!1)}c9=b3-1
if(!(j>=0&&j<a0))return A.a(e,j)
d0=e[j]
if(!(j<a1))return A.a(d,j)
d1=d[j]
if(!(c9>=0&&c9<a))return A.a(b4,c9)
d2=b4[c9]
if(!(c9<c))return A.a(b5,c9)
d3=b5[c9]
j=-d3
c=e5*j
d4=d0+c
b=e5*d2
d5=d1+b
d6=d0-c
d7=d1-b
if(p){j=e5*d3
f0.u(d4+b,d5+j)
f0.u(d6+b,d7+j)}else if(q){f0.u(d4,d5)
r.$6(d0,d1,j,d2,d2,d3)
r.$6(d0,d1,d2,d3,d3,-d2)}else{f0.u(d4,d5)
f0.u(d6,d7)}for(c3=a5-2;c3>=1;c3=c5){c5=c3-1
if(!(c3<a0))return A.a(e,c3)
j=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c3,c5,j,d[c3],!0)}d8=e[0]
d9=d[0]
e0=b4[0]
e1=b5[0]
j=-e1
e2=d8-e5*j
c=e5*e0
e3=d9-c
if(p)f0.u(e2-c,e3-e5*e1)
else if(q){f0.u(e2,e3)
c=-e0
r.$6(d8,d9,e1,c,c,j)
r.$6(d8,d9,c,j,j,e0)}else f0.u(e2,e3)
f0.a1()}}},
kX(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k=d,j=d*e,i=k
if(typeof i!=="number")return i.a7()
p=i*e
i=k
if(typeof i!=="number")return i.cA()
if(i<d||p>c.gv().length)throw A.e(A.aB("Raster output is too small",null))
i=f.b
if(i)A.iI(c,p)
else B.f.N(c.gv(),0,p,0)
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
try{A.jz(a,b,255,c,0,0,k,0,0,d,e,s,0,0,r,0,0,null,f,0,!0,i)
m=Math.max(A.j(j),f.xr)
f.xr=0
l=m<=65536&&!f.as
f.as=!1
if(l){if(++f.y1>=16){f.y1=0
f.hC()}}else f.y1=0}finally{f.sfz(q)}},
jz(f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1=null
if(f9>=g1||g0>=g2||f4<=0)return
s=h3?f5:f1
r=f2.w
for(q=r.length-1,p=h1+1,o=h1*3,n=o+1,m=g6>=0,l=g4>=0,k=g5>=0,j=g3>=0,i=t.a,h=s!=null,g=o+2;q>=0;--q){if(!(q<r.length))return A.a(r,q)
f=r[q]
if(!f.ch){if(!f.e)e=(f.b!=null||f.f!=null)&&f3>=f.c&&f3<f.d
else e=!1
e=!e}else e=!0
if(e)continue
e=f.a.e.n(f3)
if(0>=e.length)return A.a(e,0)
if(B.c.G(B.a.C(B.c.Y(f4*B.c.G(e[0])/100),0,255)*f.aS(f3)/255)===0)continue
d=f.ay
c=f.Q
e=f.y
b=e===2||e===4
a=f.ax?255:f4
a0=d!=null
a1=!1
if(a0){if(!d.e)a2=(d.b!=null||d.f!=null)&&f3>=d.c&&f3<d.d
else a2=!1
if(a2){a2=d.a.e.n(f3)
if(0>=a2.length)return A.a(a2,0)
a2=B.c.G(B.a.C(B.c.Y(a*B.c.G(a2[0])/100),0,255)*d.aS(f3)/255)>0
a1=a2}}if(a0&&!a1&&!b)continue
if(!a1){if(c===0)A.c0(f,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,0,!0,!1,!1,!1,!0)
else{a3=f.az(f3)
if(a3!=null){e=j?a3.a:a3.c
a0=k?a3.b:a3.d
a4=B.c.R(g3*e+g5*a0+g7)-1
e=l?a3.a:a3.c
a0=m?a3.b:a3.d
a5=B.c.R(g4*e+g6*a0+g8)-1
e=j?a3.c:a3.a
a0=k?a3.d:a3.b
a6=B.c.V(g3*e+g5*a0+g7)+1
e=l?a3.c:a3.a
a0=m?a3.d:a3.b
a7=B.c.V(g4*e+g6*a0+g8)+1
if(a4<f9)a4=f9
if(a5<g0)a5=g0
if(a6>g1)a6=g1
if(a7>g2)a7=g2
a8=a6-a4
a9=a7-a5
if(a8>0&&a9>0){if(f.f==null){e=f.b
b0=e==null?f1:e.gcD()}else b0=f1
e=!1
if(b0!=null){a0=b0.y
if(a0!=null){if(h)if($.l!=null){a2=!0
if(c!==6)if(c!==7)if(c!==9)a2=c>=12&&c<=15
if(!a2){e=!1
if(a0.w){a0=a0.f
if(a0!=null)if(a0.a!=null){e=a0.n(0)
if(0>=e.length)return A.a(e,0)
e=e[0]!==0}else e=!0}e=!e}}}else e=!0}if(e){A.c0(f,f3,f4,f5,f6,f7,f8,a4,a5,a6,a7,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,c,!0,!1,!1,!1,!0)
continue}e=a8*a9
b1=h0.aJ(g,e)
if(h3){a0=b1.c
if(a0!=null)$.l.fastlottie_clear_pixels(a0,e)
else{a0=b1.d
a0.toString
B.f.N(a0,0,e,0)}}else{a0=b1.c
if(a0!=null){a2=i.a(A.u($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}B.f.N(a0,0,e,0)}A.c0(f,f3,f4,b1,a4,a5,a8,a4,a5,a6,a7,g3,g4,g5,g6,g7,g8,g9,h0,p,h2,h3,0,!0,!0,!1,!1,!0)
if(h){e=!0
if(c!==6)if(c!==7)if(c!==9)e=c>=12&&c<=15
b3=!e&&A.oo(s,(a5-f7)*f8+a4-f6,f8,b1,a8,a9,c)}else b3=!1
if(!b3){e=f5.c
if(e!=null){a0=i.a(A.u($.l.memory).buffer)
b2=f5.b
e=new Uint32Array(a0,e,b2)}else{e=f5.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.u($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.mt(e,a4-f6,a5-f7,f8,a0,0,0,a8,a8,a9,c)}}}}continue}b4=e===3||e===4
b5=f.az(f3)
if(b5==null)continue
e=j?b5.a:b5.c
a0=k?b5.b:b5.d
b6=B.c.R(g3*e+g5*a0+g7)-1
e=l?b5.a:b5.c
a0=m?b5.b:b5.d
b7=B.c.R(g4*e+g6*a0+g8)-1
e=j?b5.c:b5.a
a0=k?b5.d:b5.b
b8=B.c.V(g3*e+g5*a0+g7)+1
e=l?b5.c:b5.a
a0=m?b5.d:b5.b
b9=B.c.V(g4*e+g6*a0+g8)+1
if(b6<f9)b6=f9
if(b7<g0)b7=g0
if(b8>g1)b8=g1
if(b9>g2)b9=g2
if(b6>=b8||b7>=b9)continue
c0=d.az(f3)
if(c0!=null){e=j?c0.a:c0.c
a0=k?c0.b:c0.d
c1=Math.max(b6,B.c.R(g3*e+g5*a0+g7)-1)
e=l?c0.a:c0.c
a0=m?c0.b:c0.d
c2=Math.max(b7,B.c.R(g4*e+g6*a0+g8)-1)
e=j?c0.c:c0.a
a0=k?c0.d:c0.b
c3=Math.min(b8,B.c.V(g3*e+g5*a0+g7)+1)
e=l?c0.c:c0.a
a0=m?c0.d:c0.b
c4=Math.min(b9,B.c.V(g4*e+g6*a0+g8)+1)}else{c4=g0
c3=f9
c2=c4
c1=c3}c5=c1<c3&&c2<c4
if(!b&&!c5)continue
if(b&&!c5&&c===0){A.c0(f,f3,f4,f5,f6,f7,f8,b6,b7,b8,b9,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,0,!0,!1,!1,!1,!0)
continue}a4=b?b6:c1
a5=b?b7:c2
a6=b?b8:c3
a7=b?b9:c4
a8=a6-a4
a9=a7-a5
c6=a8*a9
b1=h0.aJ(o,c6)
if(h3){e=b1.c
if(e!=null)$.l.fastlottie_clear_pixels(e,c6)
else{e=b1.d
e.toString
B.f.N(e,0,c6,0)}}else{e=b1.c
if(e!=null){a0=i.a(A.u($.l.memory).buffer)
b2=b1.b
e=new Uint32Array(a0,e,b2)}else{e=b1.d
e.toString}B.f.N(e,0,c6,0)}A.c0(f,f3,f4,b1,a4,a5,a8,a4,a5,a6,a7,g3,g4,g5,g6,g7,g8,f1,h0,p,h2,h3,0,!0,!0,!1,!1,!0)
c7=h0.aJ(n,c6)
if(h3){e=c7.c
if(e!=null)$.l.fastlottie_clear_pixels(e,c6)
else{e=c7.d
e.toString
B.f.N(e,0,c6,0)}}else{e=c7.c
if(e!=null){a0=i.a(A.u($.l.memory).buffer)
b2=c7.b
e=new Uint32Array(a0,e,b2)}else{e=c7.d
e.toString}B.f.N(e,0,c6,0)}if(c5)A.c0(d,f3,a,c7,a4,a5,a8,c1,c2,c3,c4,g3,g4,g5,g6,g7,g8,f1,h0,p,h2,h3,0,!0,!0,!b4,!1,!0)
e=c===0
if(e)if(h3)if(h0.bw==null){a0=$.jN()
a2=a0.length
c8=new A.aY(!0,a2,f1,f1)
if($.l!=null){c9=c8.c=A.aJ(a2*4)
d0=f1}else{c9=c8.d=new Uint32Array(a2)
d0=c9
c9=f1}if(c9!=null){d0=i.a(A.u($.l.memory).buffer)
a2=new Uint32Array(d0,c9,a2)}else{d0.toString
a2=d0}B.f.en(a2,0,a0)
h0.bw=c8}a0=b1.c
if(a0!=null){a2=i.a(A.u($.l.memory).buffer)
b2=b1.b
d1=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString
d1=a0}a0=c7.c
if(a0!=null){a2=i.a(A.u($.l.memory).buffer)
b2=c7.b
d2=new Uint32Array(a2,a0,b2)}else{a0=c7.d
a0.toString
d2=a0}a0=f5.c
if(a0!=null){a2=i.a(A.u($.l.memory).buffer)
b2=f5.b
d3=new Uint32Array(a2,a0,b2)}else{a0=f5.d
a0.toString
d3=a0}for(a0=d3.length,a2=!b4,c8=d2.length,c9=d1.length,d0=a4-f6,d4=d3.$flags|0,d5=0;d5<a9;++d5){d6=d5*a8
d7=(a5+d5-f7)*f8+d0
for(d8=0;d8<a8;++d8){d9=d6+d8
if(!(d9>=0&&d9<c9))return A.a(d1,d9)
e0=d1[d9]
if(e0===0)continue
if(!(d9<c8))return A.a(d2,d9)
e1=d2[d9]
e2=e1>>>24
if(a2)e3=b?255-e2:e2
else if(e2===0)e3=b?255:0
else{e4=e1>>>16&255
e5=e1>>>8&255
e6=e1&255
if(e2!==255){d9=$.jN()
if(!(e2<d9.length))return A.a(d9,e2)
e7=d9[e2]
e4=e4*e7>>>16
e5=e5*e7>>>16
e6=e6*e7>>>16}e8=B.a.C(19595*e4+38470*e5+7471*e6>>>16,0,255)
e3=b?255-e8:e8}if(e3===0)continue
e9=e3===255?e0:A.aF(e0,e3)
f0=d7+d8
if(e){if(!(f0>=0&&f0<a0))return A.a(d3,f0)
d9=A.ac(e9,d3[f0])}else{if(!(f0>=0&&f0<a0))return A.a(d3,f0)
d9=A.ea(e9,d3[f0],c)}d4&2&&A.h(d3)
if(!(f0>=0&&f0<a0))return A.a(d3,f0)
d3[f0]=d9}}}},
eK(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eI(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eL(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eJ(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eG(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaD()){i.$flags&2&&A.h(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gco()){a.cZ(b)
s=a.z
r=a.Q
i.$flags&2&&A.h(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.e6(b)
p=q[0]
o=q[1]
n=q[4]
m=q[5]
l=q[12]
k=q[13]
i.$flags&2&&A.h(i)
i[0]=c*p+e*o
i[1]=d*p+f*o
i[2]=c*n+e*m
i[3]=d*n+f*m
i[4]=c*l+e*k+g
i[5]=d*l+f*k+h},
c0(i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0=null
if(!i1.eg(i2))return
s=k2?i4:i0
r=k7?255:i1.hl(i2,i3)
q=k4?i1.aS(i2):255
if(r===0||q===0)return
if(!k7)p=k6&&r===255&&q===255
else p=!0
o=p?i0:i1.as
if(o!=null){n=i1.az(i2)
if(n==null)return
m=B.c.R(A.eK(n,j2,j4,j6))-1
l=B.c.R(A.eL(n,j3,j5,j7))-1
k=B.c.V(A.eI(n,j2,j4,j6))+1
j=B.c.V(A.eJ(n,j3,j5,j7))+1
i=Math.max(m,i8)
h=Math.max(l,i9)
g=Math.min(k,j0)
f=Math.min(j,j1)
if(i>=g||h>=f)return
p=o.a
e=o.b
d=B.c.G((j2*p+j4*e)*256)
c=B.c.G((j3*p+j5*e)*256)
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
a9=a6?i4:j9.aJ(k0*3+2,a7*a8)
b0=a6?i5:a2
b1=a6?i6:a3
b2=a6?i7:a7
if(!a6){p=a7*a8
if(j9.b)A.iI(a9,p)
else B.f.N(a9.gv(),0,p,0)}p=a6?k0:k0+1
A.c0(i1,i2,255,a9,b0,b1,b2,a2,a3,a4,a5,j2,j3,j4,j5,j6,j7,j8,j9,p,k1,a6?k2:j9.b,0,!1,!1,!1,!0,!0)
b3=A.aw(r*q)
if(!k6)b4=d===0&&c===0
else b4=!0
p=!1
if(!b4)if(k3===0)if(s!=null)if(b2===a7)if(b0===a2)if(b1===a3)p=(!a6||b3===255)&&A.or(s,(h-i6)*i7+i-i5,i7,a9,a7,a8,i-a2,h-a3,g-i,f-h,b,a,a0,a1,(255-o.aO(16)<<16|255-o.aO(8)<<8|255-o.aO(0))>>>0,b3)
if(p)return
A.nf(o,b3,k3,a9.gv(),b0,b1,b2,new A.b0([a2,a3,a4,a5]),i4.gv(),i5,i6,i7,new A.b0([i,h,g,f]),b,a,a0,a1,a6,b4)
return}b5=k8?i1.at:i0
b6=b5==null?i0:b5.fN(i2)
b7=k6&&b6!=null&&b6>>>24===255?i0:b6
if(q!==255||b7!=null){p=b7==null
b3=p?q:A.aw((b7>>>24)*q)
if(b3===0)return
n=i1.az(i2)
if(n==null)return
i=Math.max(i8,B.c.R(A.eK(n,j2,j4,j6))-1)
h=Math.max(i9,B.c.R(A.eL(n,j3,j5,j7))-1)
g=Math.min(j0,B.c.V(A.eI(n,j2,j4,j6))+1)
f=Math.min(j1,B.c.V(A.eJ(n,j3,j5,j7))+1)
a7=g-i
a8=f-h
if(a7<=0||a8<=0)return
e=a7*a8
a9=j9.aJ(k0*3+2,e)
if(k2)A.iI(a9,e)
else B.f.N(a9.gv(),0,e,0)
A.c0(i1,i2,i3,a9,i,h,a7,i,h,g,f,j2,j3,j4,j5,j6,j7,j8,j9,k0+1,k1,k2,0,!1,!1,k6,!1,!1)
b8=a9.gv()
b9=i4.gv()
c0=(h-i6)*i7+i-i5
for(e=b9.length,c1=k3===0,c2=b8.length,c3=b9.$flags|0,c4=0;c4<a8;++c4,c0+=i7)for(c5=c4*a7,c6=0;c6<a7;++c6){c7=c5+c6
if(!(c7>=0&&c7<c2))return A.a(b8,c7)
c8=b8[c7]
if(c8===0)continue
if(p)c9=A.aF(c8,b3)
else{d0=(c8>>>24)*b3+128
c9=A.aF((b7&16777215|4278190080)>>>0,B.a.L(d0+B.a.L(d0,8),8))}d1=c0+c6
if(c1){if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ac(c9,b9[d1])}else{if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ea(c9,b9[d1],k3)}c3&2&&A.h(b9)
if(!(d1>=0&&d1<e))return A.a(b9,d1)
b9[d1]=c7}return}if(i1.ge2()){for(c8=i1,d2=0;c8!=null;c8=c8.cy)++d2
if(d2===1){d3=j9.c4(k0)
A.eG(i1.a,i2,j2,j3,j4,j5,j6,j7,d3)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}else{e0=j9.k3
while(e0.length<d2)B.b.m(e0,i0)
e1=d2-1
for(c8=i1;c8!=null;c8=c8.cy,e1=e2){e2=e1-1
B.b.p(e0,e1,c8)}d3=j9.c4(k0)
for(d9=j7,d8=j6,d7=j5,d6=j4,d5=j3,d4=j2,d1=0;d1<d2;++d1){if(!(d1<e0.length))return A.a(e0,d1)
A.eG(e0[d1].a,i2,d4,d5,d6,d7,d8,d9,d3)
B.b.p(e0,d1,i0)
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
d4=j2}e3=k1&&i1.ge4()
e4=i1.z
if(e4!=null&&i1.ghc()){e5=e3&&i1.ghf()?new A.cn([d4,d5,d6,d7,d8,d9,i8,i9,j0,j1]):i0
p=e5==null
e6=p?i0:j9.dj(i1,e5)
if(e6==null){e7=j9.cL(k0)
e7.l(0)
A.nN(e4,i2,d4,d5,d6,d7,d8,d9,i8,i9,j0,j1,e7,j9,k0)
if(!p)j9.c0(i1,e5,e7)}else if(j8==null&&e6.b!==0){e7=j9.cL(k0)
e7.dW(e6)}else e7=e6
if(e7.b===0)return
if(j8!=null){e8=j9.eC(k0)
A.fs(e7,j8,e8)
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
if(f4!=null)A.kW(f4,i2,r,i4,i5,i6,i7,f0,f1,f2,f3,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2,k3)
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
i=B.c.R(d8+(c1?0:d4*p))
g=B.c.V(d8+(c1?d4*p:0))
p=d7>=0
h=B.c.R(d9+(p?0:d7*e))
f=B.c.V(d9+(p?d7*e:0))
f7=Math.max(f0,i)
f8=Math.max(f1,h)
f9=Math.min(f2,g)
g0=Math.min(f3,f)
if(f7<f9&&f8<g0)A.jz(f5,f6,r,i4,i5,i6,i7,f7,f8,f9,g0,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2)}else{g1=f5.gdR()
g2=Math.max(f0,B.c.R(A.eK(g1,d4,d6,d8))-1)
g3=Math.max(f1,B.c.R(A.eL(g1,d5,d7,d9))-1)
g4=Math.min(f2,B.c.V(A.eI(g1,d4,d6,d8))+1)
g5=Math.min(f3,B.c.V(A.eJ(g1,d5,d7,d9))+1)
if(g2<g4&&g3<g5){g6=g4-g2
c1=g6*(g5-g3)
g7=j9.aJ(k0*3+2,c1)
if(k2)A.iI(g7,c1)
else B.f.N(g7.gv(),0,c1,0)
A.jz(f5,f6,r,g7,g2,g3,g6,g2,g3,g4,g5,d4,d5,d6,d7,d8,d9,i0,j9,k0+1,e3,k2)
c1=j9.db
c1.l(0)
c1.a4(!0)
c1.u(d8,d9)
c2=d4*p
p=d5*p
c1.u(c2+d8,p+d9)
c3=d6*e
e=d7*e
c1.u(c2+c3+d8,p+e+d9)
c1.u(c3+d8,e+d9)
c1.a1()
j9.aL(c1,!1,j9.gbO(),g2,g3,g4,g5)
g8=j9.gbO()
if(e9!=null){A.fs(j9.gbO(),e9,j9.gbn())
g8=j9.gbn()}g9=g8.b*2
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
if(c8!==0){h9=c3?c8:A.bc(c8,h5)
c5=h7+h8
if(!(c5>=0&&c5<e))return A.a(b9,c5)
c7=A.ac(h9,b9[c5])
c2&2&&A.h(b9)
b9[c5]=c7}}}}}}},
nf(c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=d1.a,c0=b9[0],c1=b9[1],c2=b9[2],c3=b9[3]
b9=d6.a
s=b9[0]
r=b9[1]
q=b9[2]
p=b9[3]
o=255-c4.aO(16)
n=255-c4.aO(8)
m=255-c4.aO(0)
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
if(b4!==0){a4=A.aw(o*b4)
if(typeof a4!=="number")return A.S(a4)
a4=A.aw((a5>>>16&255)*(255-a4))
if(typeof a4!=="number")return a4.a9()
b5=A.aw(n*b4)
if(typeof b5!=="number")return A.S(b5)
b5=A.aw((a5>>>8&255)*(255-b5))
if(typeof b5!=="number")return b5.a9()
b6=A.aw(m*b4)
if(typeof b6!=="number")return A.S(b6)
b6=A.aw((a5&255)*(255-b6))
if(typeof b6!=="number")return A.S(b6)
a5=(a5&4278190080|a4<<16|b5<<8|b6)>>>0}}b7=a0+a3
if(e1){d2.$flags&2&&A.h(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a5}else{if(k)a5=A.aF(a5,c5)
if(l){if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ac(a5,d2[b7])}else{if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ea(a5,d2[b7],c6)}d2.$flags&2&&A.h(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a4}}}if(e1&&k)for(f=r;f<p;++f){b8=(f-d4)*d5-d3
for(a3=s;a3<q;++a3){l=b8+a3
if(!(l>=0&&l<b9))return A.a(d2,l)
k=A.aF(d2[l],c5)
d2.$flags&2&&A.h(d2)
d2[l]=k}}},
nN(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.eE(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.C(0.25/e,0.005,1.5),c=new A.io(b1.eD(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.b.gaf(a).gca())c.$2(B.b.gaf(a),b0)
else{s=b1.ao(0)
r=b1.ao(1)
q=b1.ao(2)
for(p=a.length,o=a8-a6,n=!1,m=0;m<a.length;a.length===p||(0,A.X)(a),++m){l=a[m]
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
i=B.a.C(B.c.G(j[0]*2.56),0,256)
if(i!==256)s.em(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aN(g,a6,o,256)
if(j){s.aU(r)
A.cW(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aU(s)
else if(j)A.cW(q,s,b0,k)
else{b0.aU(r)
A.cW(r,s,b0,k)}n=!0}}},
nl(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.h(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.kJ(a,Math.abs(b),2,2,4,c,d,e)},
kW(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gcl())s=c
else{r=f.e.n(b)
if(0>=r.length)return A.a(r,0)
s=B.a.C(B.c.G(c*B.c.G(r[0])/100),0,255)}if(s===0)return
if(!f.gaD()){q=b3.c4(b4)
A.eG(f,b,a6,a7,a8,a9,b0,b1,q)
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
p=a6}j=b5&&f.gaQ()
i=a.gb8()
for(h=i.length-1,r=b4+1;h>=0;--h){if(!(h<i.length))return A.a(i,h)
g=i[h]
if(g instanceof A.a5)A.kW(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.bk)A.nQ(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
nQ(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.n(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.a.C(B.c.G(c0*B.c.G(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gc5())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gH()
b7=b7!==!1
r=b7}b8.id!==$&&A.Q()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.cn([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.dj(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.b.aq(b8.a,A.jK())
b8.fx!==$&&A.Q()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.b1(b9)
if(l==null)return
n=[Math.max(c5,B.c.R(A.eK(l,c9,d1,d3))-2),Math.max(c6,B.c.R(A.eL(l,d0,d2,d4))-2),Math.min(c7,B.c.V(A.eI(l,c9,d1,d3))+2),Math.min(c8,B.c.V(A.eJ(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gb_()
m=b8.a
A.im(m,0,m.length,b9,new A.bC([c9,d0,d1,d2,d3,d4]),new A.b0(n),b8.f,o,d6,0)}else{l=A.nM(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
f=d5==null&&b8.y==null&&d9===0&&d8
e=f?A.l_(b8,b9,s):0
if(f&&d6.fp(d6.dy,g,d6.gb_(),k,j,i,h,c1,c2,c3,c4,e)){o=d6.gb_()
if(!b7&&o.b>0)d6.c0(b8,p,o)
return}d6.aL(d6.dy,g,d6.gb_(),k,j,i,h)
o=d6.gb_()}if(!b7&&o.b>0)d6.c0(b8,p,o)}if(d5!=null){A.fs(o,d5,d6.gbn())
o=d6.gbn()}if(o.b===0)return
d=d8?c1:b6
c=b8.y
if(c==null){e=A.l_(b8,b9,s)
if(d9===0)A.kg(c1.gv(),c2,c3,c4,o,e,d)
else A.ms(c1.gv(),c2,c3,c4,o,e,d9,d)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.nj(c,b9,d6)
a7=c.d.n(b9)
a8=c.e.n(b9)
if(c.ghe()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=c.h9(b9,a9,b0)
if(b1!=null){A.nm(c1.gv(),c2,c3,c4,o,a6.gv(),s,new A.bC([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
return}}b7=!1
if(d!=null)if($.l!=null){b7=o.a
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
b5=A.oq(d,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
b7=b5}if(b7)return
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
A.mv(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gv()
b2=a6.gv()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.mu(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
nm(b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=c0.a,a1=a0[0],a2=a0[1],a3=a0[2],a4=a0[3],a5=a0[4],a6=a0[5],a7=c4.a,a8=c4.b,a9=1-a7*a7-a8*a8,b0=a1/c3,b1=a2/c3,b2=b7.a.gv()
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
i=b>=1?1023:B.c.Y(b*1023+0.5)
if(!(i>=0&&i<r))return A.a(b8,i)
a=b8[i]
if(s)a=A.aF(a,b9)
if(n)a=A.bc(a,j)
if(!(d>=0&&d<a0))return A.a(b3,d)
i=A.ac(a,b3[d])
b3.$flags&2&&A.h(b3)
b3[d]=i}}},
dw(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aR){s=a.c
if(s===$){r=a.b!==1||B.b.aq(a.a,A.jK())
a.c!==$&&A.Q()
a.c=r
s=r}q=s
break A}if(a instanceof A.a5){s=a.r
if(s===$){r=B.b.aq(a.a,A.jK())
a.r!==$&&A.Q()
a.r=r
s=r}q=s
break A}if(a instanceof A.T){q=A.dw(a.a)
break A}q=!1
break A}return q},
im(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.dw(a[b])}else s=!1
if(s){if(!(b<a.length))return A.a(a,b)
A.eH(a[b],d,e,a0,a1,a2,a3,a4)
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
if(!A.dw(j))A.bF(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.l(0)
else{s=a0.a
a3.aL(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dw(j))continue
if(a2.b===0)A.eH(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.ao(i)
A.eH(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.ao(h)
f.aU(a2)
A.cW(f,g,a2,a1?5:2)}}},
eH(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
A:{s=a0 instanceof A.a5
r=s?a0:null
if(s){s=a2.a
q=s[0]
p=s[1]
o=s[2]
n=s[3]
m=s[4]
l=s[5]
s=r.c
if(!s.gaD()){k=a6.d2(a7)
A.eG(s,a1,q,p,o,n,m,l,k)
a2=new A.bC([k[0],k[1],k[2],k[3],k[4],k[5]])}s=r.a
A.im(s,0,s.length,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.T
j=s?a0:null
if(s){A.eH(j.a,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.aR
i=s?a0:null
if(s){h=i.a
s=i.b
if(s===1){A.im(h,0,h.length,a1,a2,a3,a4,a5,a6,a7+1)
return}g=a7*2
f=a6.ao(g)
e=a6.ao(g+1)
d=a7+1
A.im(h,0,h.length-1,a1,a2,a3,!1,f,a6,d)
if(f.b===0)c=s===3||s===4
else c=!1
if(c){a5.l(0)
return}b=B.b.gad(h)
if(A.dw(b))A.eH(b,a1,a2,a3,!1,e,a6,d)
else{d=a2.a
q=d[0]
p=d[1]
o=d[2]
n=d[3]
m=d[4]
l=d[5]
a=a6.dy
a.l(0)
A.bF(b,a1,q,p,o,n,m,l,0.0625,a,a6,0,0)
d=a3.a
a6.aL(a,!1,e,d[0],d[1],d[2],d[3])}A.cW(f,e,a5,s)
break A}throw A.e(A.aE("Expected a boolean path"))}},
nM(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8=a9.e
if(a8){s=a9.d.n(b0)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a7}else r=0
q=a9.b1(b0)
if(q==null)return a7
s=B.c.R(A.eK(q,b5,b7,b9))
p=B.c.R(A.eL(q,b6,b8,c0))
o=B.c.V(A.eI(q,b5,b7,b9))
n=B.c.V(A.eJ(q,b6,b8,c0))
m=Math.max(b1,s-2)
l=Math.max(b2,p-2)
k=Math.min(b3,o+2)
j=Math.min(b4,n+2)
if(m>=k||l>=j)return a7
i=a9.go
if(i===$){h=a9.fB()
a9.go!==$&&A.Q()
a9.go=h
i=h}if(i!=null){g=c1.dr(i,b0)
if(g.r===0)return a7
a8=c1.dy
a8.l(0)
a8.aF(g,b5,b6,b7,b8,b9,c0)
return new A.b0([m,l,k,j])}if(!a8&&a9.z==null&&a9.a.length===1){f=B.b.gaf(a9.a)
while(f instanceof A.T)f=f.a
if(f instanceof A.ax&&!f.gH()){e=c1.dy
e.l(0)
A.kN(f,b0,0.0625,e,new A.bC([b5,b6,b7,b8,b9,c0]));++c1.w
return e.r===0?a7:new A.b0([m,l,k,j])}}d=Math.max(Math.sqrt(b5*b5+b6*b6),Math.sqrt(b7*b7+b8*b8))
c=d<=0.000001?0.25:B.c.C(0.25/d,0.005,1.5)
b=c*c
a=c1.db
a.l(0)
a0=a9.a
for(a1=a0.length-1;a1>=0;--a1){if(!(a1<a0.length))return A.a(a0,a1)
A.bF(a0[a1],b0,1,0,0,1,0,0,b,a,c1,0,0)}if(a.r===0)return a7
a2=a9.z
if(a2!=null){a3=c1.dx
a3.l(0)
A.n5(a,a2,b0,a3,c1.p3)
if(a3.r===0)return a7
a4=a3}else a4=a
if(a8){a5=c1.fr
a5.l(0)
A.kJ(a4,r*0.5,a9.r,a9.w,a9.x,c,a5,c1.gds())
if(a5.r===0)return a7
a4=a5}a6=c1.dy
a6.l(0)
a6.aF(a4,b5,b6,b7,b8,b9,c0)
return new A.b0([m,l,k,j])},
l_(a,b,c){var s,r,q=a.b.n(b),p=q.length
if(0>=p)return A.a(q,0)
s=B.a.C(B.c.G(q[0]*255),0,255)
if(1>=p)return A.a(q,1)
r=B.a.C(B.c.G(q[1]*255),0,255)
if(2>=p)return A.a(q,2)
return A.kh(c,s,r,B.a.C(B.c.G(q[2]*255),0,255))},
nj(a,b,c){var s,r,q,p
if(a.c.a!=null){s=c.cj
r=s.h(0,a)
if(r!=null)return r.b
if(s.a>=256)s.E(0,new A.M(s,s.$ti.i("M<1>")).ga5(0)).b.a_()
q=A.fh(1024)
p=c.ay
p.toString
s.p(0,a,new A.aa(p,q,t.dL))
A.kM(a,b,q.gv())
return q}q=c.aP
if(q==null)q=c.aP=A.fh(1024)
A.kM(a,b,q.gv())
return q},
kM(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a6.c.n(a7),a4=a6.a,a5=a6.x
for(s=a3.length,r=0;r<a4;++r){q=4*r
p=3*r
o=q+1
if(!(o<s))return A.a(a3,o)
o=A.fG(a3[o])
a5.$flags&2&&A.h(a5)
n=a5.length
if(!(p<n))return A.a(a5,p)
a5[p]=o
o=p+1
m=q+2
if(!(m<s))return A.a(a3,m)
m=A.fG(a3[m])
a5.$flags&2&&A.h(a5)
if(!(o<n))return A.a(a5,o)
a5[o]=m
m=p+2
o=q+3
if(!(o<s))return A.a(a3,o)
o=A.fG(a3[o])
a5.$flags&2&&A.h(a5)
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
d=e<=1e-12?0:B.c.C((j-f)/e,0,1)
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
a1=A.kh(B.a.C(B.c.G(a6.eM(a3,j)*255),0,255),B.a.C(B.c.G((m+(g-m)*d)*255),0,255),B.a.C(B.c.G((a+(a0-a)*d)*255),0,255),B.a.C(B.c.G((a1+(a2-a1)*d)*255),0,255))
a8.$flags&2&&A.h(a8)
if(!(k<a8.length))return A.a(a8,k)
a8[k]=a1}},
jn(a){return new A.bA(a,A.i([],t.ch))},
kn(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.a.J(b.gcu()-s,2)),q=new Float32Array(a*3)
s=Math.max(2,a+Math.max(0,B.a.J(b.gcu()-s,2)))
new Float64Array(s)
return new A.bh(a,r,b,c,d,f,g,e,q)},
mS(a,b,c,d,e){return new A.bD(a,b,c,d,e,A.ab(t.S,t.W))},
kl(a,b){var s=a.length
return new A.cl(a,b,new Float64Array(s))},
c2(a,b){var s,r,q,p,o
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
return new A.au(s,r,q,p>o?p:o)},
js(a,b,c,d,e,f,g,h,i){return new A.c_(a,b,c,d,e,f,g,h,i)},
mR(){var s=null,r=t.n
return A.js(A.cg(A.i([0,0],r)),A.cg(A.i([0,0],r)),A.cg(A.i([100,100],r)),A.cg(A.i([0],r)),A.cg(A.i([100],r)),s,s,s,s)},
jt(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
eB(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
mF(a,b,c,d,e){return new A.a7(a,b,c,d,e)},
ko(a,b,c){return new A.hJ(a,b,c)},
kp(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.a6(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
jp(a,b,c){return new A.a5(a,b,c)},
mG(a,b){return new A.aR(a,b)},
il(a,b,c){if(c>0)return new A.z(a,-b)
if(c<0)return new A.z(-a,b)
return B.aE},
jr(a,b,c,d,e,f,g,h,i,j,k){return new A.bk(a,b,c,d,e,f,g,h,i,k,j)},
ik:function ik(a,b){this.a=a
this.b=b},
hX:function hX(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=null},
ih:function ih(a,b,c){this.a=a
this.b=b
this.c=c},
ii:function ii(a,b,c){this.a=a
this.b=b
this.c=c},
ig:function ig(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
ce:function ce(a){this.a=a},
fn:function fn(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var _=this
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
_.bv=a7
_.cj=a8
_.bw=_.aP=null
_.dZ=a9},
fo:function fo(a,b){this.a=a
this.b=b},
fp:function fp(a){this.a=a},
fq:function fq(a){this.a=a},
fr:function fr(a){this.a=a},
aa:function aa(a,b,c){this.a=a
this.b=b
this.$ti=c},
bS:function bS(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
io:function io(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
bA:function bA(a,b){var _=this
_.a=a
_.r=_.f=_.e=_.d=_.c=_.b=$
_.w=b
_.x=1
_.y=!1
_.z=$},
h5:function h5(a){this.a=a},
fW:function fW(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fX:function fX(a,b,c){this.a=a
this.b=b
this.c=c},
fV:function fV(a){this.a=a},
h1:function h1(a,b,c){this.a=a
this.b=b
this.c=c},
h2:function h2(a,b,c){this.a=a
this.b=b
this.c=c},
h3:function h3(a,b,c){this.a=a
this.b=b
this.c=c},
h0:function h0(a){this.a=a},
fZ:function fZ(){},
h_:function h_(){},
fY:function fY(a,b){this.a=a
this.b=b},
h4:function h4(){},
hb:function hb(a,b){this.a=a
this.b=b},
hU:function hU(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ep:function ep(a){this.b=a},
hq:function hq(a){this.a=a},
hr:function hr(a,b){this.a=a
this.b=b},
hk:function hk(a,b){this.a=a
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
he:function he(a,b){this.a=a
this.b=b},
hg:function hg(a,b){this.a=a
this.b=b},
hf:function hf(a,b){this.a=a
this.b=b},
hs:function hs(a,b){this.a=a
this.b=b},
hd:function hd(a,b){this.a=a
this.b=b},
hi:function hi(a,b){this.a=a
this.b=b},
hh:function hh(a,b){this.a=a
this.b=b},
hj:function hj(a,b){this.a=a
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
T:function T(a){this.a=a},
bl:function bl(a,b){this.a=a
this.b=b},
bD:function bD(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$
_.as=f},
i0:function i0(){},
cl:function cl(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
h6:function h6(){},
c_:function c_(a,b,c,d,e,f,g,h,i){var _=this
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
a7:function a7(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$},
hJ:function hJ(a,b,c){this.a=a
this.b=b
this.c=c},
eo:function eo(a,b){this.a=a
this.b=b},
hc:function hc(){},
a6:function a6(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
hO:function hO(){},
hM:function hM(){},
hN:function hN(){},
hP:function hP(){},
a5:function a5(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.r=_.f=_.e=_.d=$
_.Q=_.z=null
_.at=_.as=0/0
_.ay=_.ax=$},
hF:function hF(){},
hH:function hH(){},
hI:function hI(){},
hG:function hG(){},
aR:function aR(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
hR:function hR(){},
hQ:function hQ(){},
er:function er(){},
ax:function ax(a,b,c){var _=this
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
b_:function b_(a,b,c,d,e,f,g,h,i){var _=this
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
hY:function hY(){},
cT(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.ah(s,r,q,p,new Uint8Array(a))},
br:function br(a){this.a=a},
ah:function ah(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
cW(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
if(a9===4){A.fs(a6,a7,a8)
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
break}if(a8.aN(f,c,a0-c,l)){l=a6.a
j=l.b
if(j!=null){a3=o.a(A.u($.l.memory).buffer)
a4=l.a
s=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
s=l}l=a7.a
j=l.b
if(j!=null){a3=o.a(A.u($.l.memory).buffer)
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
fs(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
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
if(a3>0&&a7.aN(h,a1,a2-a1,a3)){l=a5.a
j=l.b
if(j!=null){d=s.a(A.u($.l.memory).buffer)
a4=l.a
p=new Int32Array(d,j,a4)}else{l=l.c
l.toString
p=l}l=a6.a
j=l.b
if(j!=null){d=s.a(A.u($.l.memory).buffer)
a4=l.a
o=new Int32Array(d,j,a4)}else{l=l.c
l.toString
o=l}}}if(a<=a0)n+=2
if(a0<=a)m+=2}}},
iZ(a,b){var s=B.a.b6(B.a.L(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
aD:function aD(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
eY:function eY(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.ay=_.ax=_.at=_.as=_.Q=_.z=_.y=_.x=_.w=_.r=0
_.ch=-1
_.dy=_.dx=_.db=_.cy=_.cx=_.CW=0
_.fr=!1},
kh(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.a.J(b*a+127,255)<<16|B.a.J(c*a+127,255)<<8|B.a.J(d*a+127,255))>>>0},
bc(a,b){if(b>=256)return a
if(b<=0||a===0)return 0
return((a&16711935)*b+8388736>>>8&16711935|(a>>>8&16711935)*b+8388736&4278255360)>>>0},
ac(a,b){var s,r,q,p
if(a===0)return b
s=a>>>24
if(s===255||b===0)return a
r=255-s
q=(b&16711935)*r+8388736
p=(b>>>8&16711935)*r+8388736
return a+((B.a.L(q+(B.a.L(q,8)&16711935),8)&16711935|p+(B.a.L(p,8)&16711935)&4278255360)>>>0)},
aF(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.a.L(s+(B.a.L(s,8)&16711935),8)&16711935|r+(B.a.L(r,8)&16711935)&4278255360)>>>0},
kg(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a4===0||a3.b===0)return
if(a5!=null&&A.ov(a5,a0,a1,a2,a3.a,a3.b,a4))return
s=a3.b*2
r=a3.a.gv()
for(q=a.length,p=a4>>>24===255,o=r.length,n=0;n<s;n+=2){if(!(n<o))return A.a(r,n)
m=r[n]
l=n+1
if(!(l<o))return A.a(r,l)
k=r[l]
j=k>>>8
i=(k&255)+1
h=i===256?a4:A.bc(a4,i)
if(h===0)continue
g=h>>>24
f=((m>>>16)-a1)*a2+((m&65535)-a0)
e=f+j
if(g===255)if(j>=8)B.f.N(a,f,e,h)
else for(l=a.$flags|0,d=f;d<e;++d){l&2&&A.h(a)
if(!(d>=0&&d<q))return A.a(a,d)
a[d]=h}else{c=255-g
if(p&&j===1){if(!(f>=0&&f<q))return A.a(a,f)
b=a[f]
l=b===0?h:A.kf(h,b,c)
a.$flags&2&&A.h(a)
a[f]=l}else for(d=f;d<e;++d){if(!(d>=0&&d<q))return A.a(a,d)
b=a[d]
l=b===0?h:A.kf(h,b,c)
a.$flags&2&&A.h(a)
a[d]=l}}}},
kf(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.a.L(s+(B.a.L(s,8)&16711935),8)&16711935|r+(B.a.L(r,8)&16711935)&4278255360)>>>0)},
mu(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8
if(b5===0||b3.b===0)return
s=c4-c2
r=c5-c3
q=s*s+r*r
if(q<=1e-12){if(0>=b4.length)return A.a(b4,0)
p=b4[0]
A.kg(a9,b0,b1,b2,b3,b5<255?A.aF(p,b5):p,null)
return}o=1/q
n=(b6*s+b7*r)*o
m=b3.b*2
l=b3.a.gv()
k=b5<255
for(j=a9.length,i=b4.length,h=l.length,g=!k,f=0;f<m;f+=2){if(!(f<h))return A.a(l,f)
e=l[f]
d=f+1
if(!(d<h))return A.a(l,d)
c=l[d]
b=e>>>16
a=e&65535
a0=(c&255)+1
a1=b+0.5
a2=a+0.5
a3=((b6*a2+b8*a1+c0-c2)*s+(b7*a2+b9*a1+c1-c3)*r)*o
a4=(b-b1)*b2+(a-b0)
a5=a4+(c>>>8)
if(a0===256&&g)for(a6=a4;a6<a5;++a6){if(a3<=0)a7=0
else a7=a3>=1?1023:B.c.Y(a3*1023+0.5)
if(!(a7>=0&&a7<i))return A.a(b4,a7)
d=b4[a7]
if(!(a6>=0&&a6<j))return A.a(a9,a6)
d=A.ac(d,a9[a6])
a9.$flags&2&&A.h(a9)
a9[a6]=d
a3+=n}else for(d=a0<256,a6=a4;a6<a5;++a6){if(a3<=0)a7=0
else a7=a3>=1?1023:B.c.Y(a3*1023+0.5)
if(!(a7>=0&&a7<i))return A.a(b4,a7)
p=b4[a7]
if(k)p=A.aF(p,b5)
if(d)p=A.bc(p,a0)
if(!(a6>=0&&a6<j))return A.a(a9,a6)
a8=A.ac(p,a9[a6])
a9.$flags&2&&A.h(a9)
a9[a6]=a8
a3+=n}}},
mv(d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6=1023
if(e3===0||e1.b===0)return
s=f2-f0
r=f3-f1
q=1/Math.max(0.001,Math.sqrt(s*s+r*r))
p=e4*q
o=e5*q
n=e6*q
m=e7*q
l=(e8-f0)*q
k=(e9-f1)*q
j=p*p+o*o
i=2*j
h=e1.b*2
g=e1.a.gv()
f=e3<255
for(e=d7.length,d=e2.length,c=g.length,b=!f,a=d7.$flags|0,a0=0;a0<h;a0+=2){if(!(a0<c))return A.a(g,a0)
a1=g[a0]
a2=a0+1
if(!(a2<c))return A.a(g,a2)
a3=g[a2]
a4=a1>>>16
a5=a1&65535
a6=(a3&255)+1
a7=a4+0.5
a8=a5+0.5
a9=p*a8+n*a7+l
b0=o*a8+m*a7+k
b1=a9*a9+b0*b0
b2=2*(a9*p+b0*o)+j
b3=(a4-d9)*e0+(a5-d8)
b4=b3+(a3>>>8)
a2=a6===256&&b
b5=b4-3
if(a2){for(b6=b3;b6<b5;){b7=b1>0?b1:0
b1+=b2
b2+=i
b8=b1>0?b1:0
b1+=b2
b2+=i
b9=b1>0?b1:0
b1+=b2
b2+=i
c0=b1>0?b1:0
b1+=b2
b2+=i
a2=$.dC()
a2.$flags&2&&A.h(a2)
a2[0]=b7
c1=a2[0]
a2[0]=b8
c2=a2[0]
a2[0]=b9
c3=a2[0]
a2[0]=c0
c4=new A.aO(c1,c2,c3,a2[0]).cF()
c5=c4.a
c6=c4.b
c7=c4.c
c8=c4.d
c9=c5>=1?d6:B.c.Y(c5*1023+0.5)
d0=c6>=1?d6:B.c.Y(c6*1023+0.5)
d1=c7>=1?d6:B.c.Y(c7*1023+0.5)
d2=c8>=1?d6:B.c.Y(c8*1023+0.5)
if(!(c9>=0&&c9<d))return A.a(e2,c9)
a2=e2[c9]
if(!(b6>=0&&b6<e))return A.a(d7,b6)
a2=A.ac(a2,d7[b6])
a&2&&A.h(d7)
d7[b6]=a2
a2=b6+1
if(!(d0>=0&&d0<d))return A.a(e2,d0)
c1=e2[d0]
if(!(a2<e))return A.a(d7,a2)
d7[a2]=A.ac(c1,d7[a2])
a2=b6+2
if(!(d1>=0&&d1<d))return A.a(e2,d1)
c1=e2[d1]
if(!(a2<e))return A.a(d7,a2)
d7[a2]=A.ac(c1,d7[a2])
a2=b6+3
if(!(d2>=0&&d2<d))return A.a(e2,d2)
c1=e2[d2]
if(!(a2<e))return A.a(d7,a2)
d7[a2]=A.ac(c1,d7[a2])
b6+=4}while(b6<b4){a2=b1>0?b1:0
d3=Math.sqrt(a2)
d4=d3>=1?d6:B.c.Y(d3*1023+0.5)
if(!(d4>=0&&d4<d))return A.a(e2,d4)
a2=e2[d4]
if(!(b6>=0&&b6<e))return A.a(d7,b6)
a2=A.ac(a2,d7[b6])
a&2&&A.h(d7)
d7[b6]=a2
b1+=b2
b2+=i;++b6}}else{for(a2=a6<256,b6=b3;b6<b5;){b7=b1>0?b1:0
b1+=b2
b2+=i
b8=b1>0?b1:0
b1+=b2
b2+=i
b9=b1>0?b1:0
b1+=b2
b2+=i
c0=b1>0?b1:0
b1+=b2
b2+=i
c1=$.dC()
c1.$flags&2&&A.h(c1)
c1[0]=b7
c2=c1[0]
c1[0]=b8
c3=c1[0]
c1[0]=b9
c6=c1[0]
c1[0]=c0
c4=new A.aO(c2,c3,c6,c1[0]).cF()
c5=c4.a
c6=c4.b
c7=c4.c
c8=c4.d
c1=c5>=1?d6:B.c.Y(c5*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
c9=e2[c1]
c1=c6>=1?d6:B.c.Y(c6*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
d0=e2[c1]
c1=c7>=1?d6:B.c.Y(c7*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
d1=e2[c1]
c1=c8>=1?d6:B.c.Y(c8*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
d2=e2[c1]
if(f){c9=A.aF(c9,e3)
d0=A.aF(d0,e3)
d1=A.aF(d1,e3)
d2=A.aF(d2,e3)}if(a2){c9=A.bc(c9,a6)
d0=A.bc(d0,a6)
d1=A.bc(d1,a6)
d2=A.bc(d2,a6)}if(!(b6>=0&&b6<e))return A.a(d7,b6)
c1=A.ac(c9,d7[b6])
a&2&&A.h(d7)
d7[b6]=c1
c1=b6+1
if(!(c1<e))return A.a(d7,c1)
d7[c1]=A.ac(d0,d7[c1])
c1=b6+2
if(!(c1<e))return A.a(d7,c1)
d7[c1]=A.ac(d1,d7[c1])
c1=b6+3
if(!(c1<e))return A.a(d7,c1)
d7[c1]=A.ac(d2,d7[c1])
b6+=4}while(b6<b4){c1=b1>0?b1:0
d3=Math.sqrt(c1)
d4=d3>=1?d6:B.c.Y(d3*1023+0.5)
if(!(d4>=0&&d4<d))return A.a(e2,d4)
d5=e2[d4]
if(f)d5=A.aF(d5,e3)
if(a2)d5=A.bc(d5,a6)
if(!(b6>=0&&b6<e))return A.a(d7,b6)
c1=A.ac(d5,d7[b6])
a&2&&A.h(d7)
d7[b6]=c1
b1+=b2
b2+=i;++b6}}}},
aw(a){var s=A.j(a)+128
return B.a.L(s+B.a.L(s,8),8)},
jj(a,b,c,d,e){var s
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
break}return A.aw(a*(255-d)+b*(255-c)+s)},
ea(a,b,c){var s,r,q,p,o,n,m,l,k
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
k=s+r-A.aw(s*r)
if(A.ki(c))return A.mr(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.aw(q*p)<<16|o+n-A.aw(o*n)<<8|m+l-A.aw(m*l))>>>0
return(k<<24|A.jj(q,p,s,r,c)<<16|A.jj(o,n,s,r,c)<<8|A.jj(m,l,s,r,c))>>>0},
ki(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
mr(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.ay(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.ay(o,n,m)
switch(j){case 12:s=A.fB(A.ke(p,A.jk(l)),A.e9(l))
break
case 13:s=A.fB(A.ke(l,A.jk(p)),A.e9(l))
break
case 14:s=A.fB(p,A.e9(l))
break
case 15:s=A.fB(l,A.e9(p))
break
default:s=new A.ay(A.ji(o,s,j),A.ji(n,r,j),A.ji(m,q,j))
break}r=new A.fz(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.a9()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.a9()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.S(s)
return(i<<24|q<<16|o<<8|s)>>>0},
ji(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
e9(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
jk(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
ke(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.jk(a)
if(o===0)return B.aL
return new A.ay((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
fB(a,b){var s=b-A.e9(a),r=a.a,q=a.b,p=a.c,o=new A.fC(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.ay(o.$1(r),o.$1(q),o.$1(p))},
ms(a,b,c,d,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
if(a1===0)return
if(a3!=null&&!A.ki(a2)&&A.op(a3,b,c,d,a0.a,a0.b,a1,a2))return
s=a0.a.gv()
for(r=a.length,q=s.length,p=0,o=0,n=0,m=0;m<a0.b*2;m+=2){if(!(m<q))return A.a(s,m)
l=s[m]
k=m+1
if(!(k<q))return A.a(s,k)
j=s[k]
i=A.bc(a1,(j&255)+1)
if(i===0)continue
h=((l>>>16)-c)*d+(l&65535)-b
g=h+(j>>>8)
for(f=h;f<g;++f){if(!(f>=0&&f<r))return A.a(a,f)
e=a[f]
if(i!==p||e!==o){n=A.ea(i,e,a2)
o=e
p=i}a.$flags&2&&A.h(a)
a[f]=n}}},
mt(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.h(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.ea(k,j,a3)
p=j
q=k}a.$flags&2&&A.h(a)
a[l]=o}},
fA:function fA(){},
fz:function fz(a,b,c){this.a=a
this.b=b
this.c=c},
fC:function fC(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fJ:function fJ(a,b,c){this.a=a
this.b=b
this.c=c},
dK:function dK(a){this.a=a},
m1(a,b,c,d,e,f,g,h){var s=h&&b>=32?J.iT(B.j.gab(e),e.byteOffset,e.length/4|0):null
s=new A.f7(a,b,c,d,e,f,g,g==null?null:A.jb(a.length,null,!1,t.cn),s)
s.ey(a,b,c,d,e,f,g,h)
return s},
cg(a){var s=new Float32Array(A.V(a))
return new A.B(s,null,!1,new Float32Array(0),!1)},
my(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
mx(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
fG(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.R(s)
if(r>=4096)return 1
q=$.lg()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
f7:function f7(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
f8:function f8(){},
B:function B(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
ey:function ey(a,b){this.a=a
this.b=b},
jF(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.X)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.o(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.b1(o)){n=o
break A}n=A.v(A.aB("Unsupported raster worker field",null))}l.push(n)}return new A.z(l,m)},
oa(e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1=null
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
if(n){A.K(q)
o=b5[7]
b8=t.p
if(b8.b(o)){b8.a(o)
b9=b5[11]
l=A.b1(b9)
if(l){A.aU(b9)
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
p=c6}A.K(b8)
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
a3=b5}}}if(b4){b4=[1,a3,A.K(d8?d7:e2.b)]
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
b4=typeof d9=="string"}}}if(b4){b4=[3,a3,A.K(e0?d9:e2.b)]
break A}a4=e1
b4=!1
if(t.dH.b(e2))if(2===(s?b6:e2.a)){if(p)b5=q
else{q=e2.b
b5=q
p=!0}if(typeof b5=="string"){a4=A.K(p?q:e2.b)
if(j)b4=k
else{k=e2.c
b4=k
j=!0}b4=A.o(b4)}}if(b4){b4=[2,a4,A.j(j?k:e2.c)]
break A}b4=A.v(A.aB("Unsupported raster worker reply",e1))}return A.jF(b4)},
fL:function fL(a){this.a=a},
ot(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.a.C(B.c.R(Math.min(a*c,s)),0,s)},
ow(b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=A.cT(32,512),c=A.cT(32,512),b=A.cT(32,512),a=A.cT(32,512),a0=A.cT(32,512),a1=t.fM,a2=A.i([],a1),a3=A.i([],a1),a4=A.i([],a1),a5=A.i([],a1),a6=t.dh,a7=A.i([],a6),a8=A.i([],t.cU),a9=A.i([],a6),b0=A.i([],t.by),b1=t.n,b2=A.i([],b1)
b1=A.i([],b1)
s=new Float64Array(256)
r=t.bU
q=A.i([],r)
p=A.i([],a1)
a1=A.i([],a1)
o=A.i([],r)
r=A.i([],r)
n=A.i([],t.a2)
a6=A.i([],a6)
m=$.l
l=new A.fn(m!=null,new A.af(t.el),d,c,b,a,a0,a2,a3,a4,a5,a7,a8,a9,b0,b2,b1,new A.br(s),!1,q,p,a1,o,r,n,new A.af(t.gS),new A.af(t.fk),new A.af(t.gj),a6)
d=t.N
k=A.ab(d,d)
c=t.x
b=new Uint8Array(32)
a=new Uint8Array(16)
a0=new Uint8Array(65536)
j=new A.eQ(null,A.ab(c,t.g2),A.ab(d,t.cJ),A.ab(c,t.gz),A.ja(c),A.ab(d,t.eY),b,a,a0)
c=new Int32Array(16384)
b=new Uint8Array(131072)
i=new A.fE()
h=A.ab(d,t.fW)
g=new A.fv()
$.jM()
d=$.jg.$0()
g.a=d
g.b=null
f=A.fh(65536)
e.a=0
d=b3.a
new A.cj(d,A.n(d).i("cj<1>")).hm(new A.iJ(e,j,h,l,f,b3,new A.iO(h,l,k),k,new A.iK(e,f,i),new A.iM(f),i,new A.iP(j,h,l),new A.iN(e,f,i),new A.iQ(k,b3),g,new A.iL(g),new A.fb(c,b)))},
iL:function iL(a){this.a=a},
iK:function iK(a,b,c){this.a=a
this.b=b
this.c=c},
iM:function iM(a){this.a=a},
iN:function iN(a,b,c){this.a=a
this.b=b
this.c=c},
iP:function iP(a,b,c){this.a=a
this.b=b
this.c=c},
iO:function iO(a,b,c){this.a=a
this.b=b
this.c=c},
iQ:function iQ(a,b){this.a=a
this.b=b},
iJ:function iJ(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var _=this
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
_.ch=q},
om(){var s,r,q=null,p={}
p.a=!1
s=A.u(v.G.self)
p=new A.iC(p,new A.h8(new A.ci(q,q,q,q,t.co)))
if(typeof p=="function")A.v(A.aB("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.nd,p)
r[$.iS()]=p
s.onmessage=r},
iB:function iB(a,b){this.a=a
this.b=b},
iC:function iC(a,b){this.a=a
this.b=b},
h8:function h8(a){this.a=a},
by(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.b8(b,c,B.a.a2(a.byteLength,s))
return J.c6(J.jS(a),a.byteOffset+b*s,(c-b)*s)},
jm(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.b8(b,c,B.a.a2(a.byteLength,s))-b)*s
if(B.a.O(r,4)!==0)throw A.e(A.aB("The number of bytes to view must be a multiple of 4",null))
return J.lE(J.jS(a),a.byteOffset+b*s,B.a.J(r,4))},
lb(a){return v.mangledGlobalNames[a]},
od(a,b){var s,r,q,p=a.length
if(p>=32)return A.nh(a,b)
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
nc(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
nh(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.l0
if(c7==null)c7=$.l0=A.nc(B.l)
s=c8.length
r=J.lC(B.d.gab(c8),c8.byteOffset,s)
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
o9(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.J.fU(a,16777216,!0,!1)
if(s>16777216)throw A.e(B.a1)
return a}},B={}
var w=[A,J,B]
var $={}
A.j7.prototype={}
J.D.prototype={
F(a,b){return a===b},
gW(a){return A.cU(a)},
t(a){return"Instance of '"+A.e3(a)+"'"},
gX(a){return A.c3(A.jx(this))}}
J.cF.prototype={
t(a){return String(a)},
bG(a,b){return b||a},
gW(a){return a?519018:218159},
gX(a){return A.c3(t.y)},
$iC:1,
$ir:1}
J.cH.prototype={
F(a,b){return null==b},
t(a){return"null"},
gW(a){return 0},
$iC:1,
$iZ:1}
J.R.prototype={$iI:1}
J.bs.prototype={
gW(a){return 0},
t(a){return String(a)}}
J.e2.prototype={}
J.d2.prototype={}
J.ar.prototype={
t(a){var s=a[$.ld()]
if(s==null)s=a[$.iS()]
if(s==null)return this.ev(a)
return"JavaScript function for "+J.bH(s)},
$ibJ:1}
J.bK.prototype={
gW(a){return 0},
t(a){return String(a)}}
J.bL.prototype={
gW(a){return 0},
t(a){return String(a)}}
J.x.prototype={
m(a,b){A.a_(a).c.a(b)
a.$flags&1&&A.h(a,29)
a.push(b)},
ai(a,b){var s
A.a_(a).i("k<1>").a(b)
a.$flags&1&&A.h(a,"addAll",2)
if(Array.isArray(b)){this.eL(a,b)
return}for(s=J.cx(b);s.q();)a.push(s.gA())},
eL(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.e(A.ap(a))
for(r=0;r<s;++r)a.push(b[r])},
l(a){a.$flags&1&&A.h(a,"clear","clear")
a.length=0},
an(a,b){return A.fy(a,b,null,A.a_(a).c)},
aj(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
es(a,b,c){var s=a.length
if(b>s)throw A.e(A.am(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.e(A.am(c,b,s,"end",null))
if(b===c)return A.i([],A.a_(a))
return A.i(a.slice(b,c),A.a_(a))},
ga5(a){if(a.length>0)return a[0]
throw A.e(A.a8())},
gad(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.a8())},
gaf(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.e(A.a8())
throw A.e(A.j3())},
b5(a,b,c){a.$flags&1&&A.h(a,18)
A.b8(b,c,a.length)
a.splice(b,c-b)},
N(a,b,c,d){var s
a.$flags&2&&A.h(a,"fillRange")
A.b8(b,c,a.length)
A.a_(a).c.a(d)
for(s=b;s<c;++s)a[s]=d},
aq(a,b){var s,r
A.a_(a).i("r(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.e(A.ap(a))}return!1},
ac(a,b){var s,r
A.a_(a).i("r(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.ap(a))}return!0},
gS(a){return a.length===0},
gcn(a){return a.length!==0},
t(a){return A.j4(a,"[","]")},
gB(a){return new J.bI(a,a.length,A.a_(a).i("bI<1>"))},
gW(a){return A.cU(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.h(a,"set length","change the length of")
if(b<0)throw A.e(A.am(b,0,null,"newLength",null))
if(b>a.length)A.a_(a).c.a(null)
a.length=b},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.e(A.eN(a,b))
return a[b]},
p(a,b,c){A.a_(a).c.a(c)
a.$flags&2&&A.h(a)
if(!(b>=0&&b<a.length))throw A.e(A.eN(a,b))
a[b]=c},
$ip:1,
$ik:1,
$it:1}
J.dQ.prototype={
hD(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.e3(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.f4.prototype={}
J.bI.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
q(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.X(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$ia2:1}
J.cI.prototype={
cd(a,b){var s
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gcm(b)
if(this.gcm(a)===s)return 0
if(this.gcm(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gcm(a){return a===0?1/a<0:a<0},
Y(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.e(A.aG(""+a+".toInt()"))},
V(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.e(A.aG(""+a+".ceil()"))},
R(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.e(A.aG(""+a+".floor()"))},
G(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.e(A.aG(""+a+".round()"))},
ec(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
C(a,b,c){if(this.cd(b,c)>0)throw A.e(A.ir(b))
if(this.cd(a,b)<0)return b
if(this.cd(a,c)>0)return c
return a},
t(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gW(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
O(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a2(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dw(a,b)},
J(a,b){return(a|0)===a?a/b|0:this.dw(a,b)},
dw(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.aG("Result of truncating division is "+A.w(s)+": "+A.w(a)+" ~/ "+b))},
a9(a,b){if(b<0)throw A.e(A.ir(b))
return b>31?0:a<<b>>>0},
dm(a,b){return b>31?0:a<<b>>>0},
L(a,b){var s
if(a>0)s=this.c3(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
c3(a,b){return b>31?0:a>>>b},
ep(a,b){if(b<0)throw A.e(A.ir(b))
return this.dn(a,b)},
dn(a,b){if(b>31)return 0
return a>>>b},
gX(a){return A.c3(t.q)},
$if:1,
$ic5:1}
J.cG.prototype={
b6(a,b){var s=this.a9(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
gX(a){return A.c3(t.S)},
$iC:1,
$ib:1}
J.dR.prototype={
gX(a){return A.c3(t.i)},
$iC:1}
J.cb.prototype={
eq(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bJ(a,b,c){return a.substring(b,A.b8(b,c,a.length))},
eu(a,b){return this.bJ(a,b,null)},
a7(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.e(B.Q)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
t(a){return a},
gW(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gX(a){return A.c3(t.N)},
gk(a){return a.length},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.e(A.eN(a,b))
return a[b]},
$iC:1,
$ifk:1,
$iq:1}
A.b4.prototype={
t(a){return"LateInitializationError: "+this.a}}
A.iE.prototype={
$0(){var s=new A.J($.F,t.U)
s.bM(null)
return s},
$S:28}
A.ft.prototype={}
A.p.prototype={}
A.a4.prototype={
gB(a){var s=this
return new A.bO(s,s.gk(s),A.n(s).i("bO<a4.E>"))},
gS(a){return this.gk(this)===0},
an(a,b){return A.fy(this,b,null,A.n(this).i("a4.E"))}}
A.d0.prototype={
gf0(){var s=J.ak(this.a),r=this.c
if(r==null||r>s)return s
return r},
gfF(){var s=J.ak(this.a),r=this.b
if(r>s)return s
return r},
gk(a){var s,r=J.ak(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
aj(a,b){var s=this,r=s.gfF()+b
if(b<0||r>=s.gf0())throw A.e(A.j0(b,s.gk(0),s,"index"))
return J.jR(s.a,r)},
an(a,b){var s,r,q=this
A.aP(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.cC(q.$ti.i("cC<1>"))
return A.fy(q.a,s,r,q.$ti.c)},
cs(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.N(n),l=m.gk(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=p.$ti.c
return b?J.j6(0,n):J.j5(0,n)}r=A.jb(s,m.aj(n,o),b,p.$ti.c)
for(q=1;q<s;++q){B.b.p(r,q,m.aj(n,o+q))
if(m.gk(n)<l)throw A.e(A.ap(p))}return r}}
A.bO.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
q(){var s,r=this,q=r.a,p=J.N(q),o=p.gk(q)
if(r.b!==o)throw A.e(A.ap(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.aj(q,s);++r.c
return!0},
$ia2:1}
A.Y.prototype={
gk(a){return J.ak(this.a)},
aj(a,b){return this.b.$1(J.jR(this.a,b))}}
A.bR.prototype={
gB(a){return new A.d4(J.cx(this.a),this.b,this.$ti.i("d4<1>"))}}
A.d4.prototype={
q(){var s,r
for(s=this.a,r=this.b;s.q();)if(r.$1(s.gA()))return!0
return!1},
gA(){return this.a.gA()},
$ia2:1}
A.ba.prototype={
an(a,b){A.eP(b,"count",t.S)
A.aP(b,"count")
return new A.ba(this.a,this.b+b,A.n(this).i("ba<1>"))},
gB(a){var s=this.a
return new A.cY(s.gB(s),this.b,A.n(this).i("cY<1>"))}}
A.ca.prototype={
gk(a){var s=this.a,r=s.gk(s)-this.b
if(r>=0)return r
return 0},
an(a,b){A.eP(b,"count",t.S)
A.aP(b,"count")
return new A.ca(this.a,this.b+b,this.$ti)},
$ip:1}
A.cY.prototype={
q(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.q()
this.b=0
return s.q()},
gA(){return this.a.gA()},
$ia2:1}
A.cC.prototype={
gB(a){return B.I},
gS(a){return!0},
gk(a){return 0},
an(a,b){A.aP(b,"count")
return this},
cs(a,b){var s=this.$ti.c
return b?J.j6(0,s):J.j5(0,s)}}
A.cD.prototype={
q(){return!1},
gA(){throw A.e(A.a8())},
$ia2:1}
A.G.prototype={
dG(a,b){return A.v(A.aG("Cannot "+b+" a fixed-length list"))},
sk(a,b){this.dG(a,"change the length of")},
m(a,b){A.aK(a).i("G.E").a(b)
return this.dG(a,"add to")}}
A.bz.prototype={
p(a,b,c){A.n(this).i("bz.E").a(c)
throw A.e(A.aG("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.e(A.aG("Cannot change the length of an unmodifiable list"))},
m(a,b){A.n(this).i("bz.E").a(b)
throw A.e(A.aG("Cannot add to an unmodifiable list"))},
M(a,b,c,d,e){A.n(this).i("k<bz.E>").a(d)
throw A.e(A.aG("Cannot modify an unmodifiable list"))},
I(a,b,c,d){return this.M(0,b,c,d,0)}}
A.de.prototype={$r:"+(1)",$s:1}
A.cn.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:15}
A.df.prototype={$r:"+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(1,2,3,4,5,6,7,8,9,10)",$s:16}
A.dg.prototype={$r:"+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(1,2,3,4,5,6,7,8,9,10,11,12)",$s:18}
A.co.prototype={$r:"+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13)",$s:19}
A.dh.prototype={$r:"+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)",$s:20}
A.z.prototype={$r:"+(1,2)",$s:2}
A.di.prototype={$r:"+calls,copiedBytes(1,2)",$s:3}
A.ay.prototype={$r:"+(1,2,3)",$s:4}
A.dj.prototype={$r:"+contentKey,requestId(1,2,3)",$s:5}
A.cp.prototype={$r:"+entryKey,workerRamBytes(1,2,3)",$s:6}
A.bZ.prototype={$r:"+message,requestId(1,2,3)",$s:7}
A.b0.prototype={$r:"+(1,2,3,4)",$s:10}
A.dk.prototype={$r:"+bytes,contentKey,useSimd(1,2,3,4)",$s:11}
A.dl.prototype={$r:"+deduplicateUploads,diskDirectory,maximumRamBytes(1,2,3,4)",$s:12}
A.cq.prototype={$r:"+compressedBytes,crc31,entryDiskBytes,fpHi,fpLo(1,2,3,4,5)",$s:13}
A.bC.prototype={$r:"+(1,2,3,4,5,6)",$s:14}
A.d7.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
q(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$ia2:1}
A.cB.prototype={
m(a,b){A.n(this).c.a(b)
A.lT()}}
A.O.prototype={
gk(a){return this.b},
gB(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.d7(s,s.length,r.$ti.i("d7<1>"))},
ar(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.fl.prototype={
$0(){return B.c.R(1000*this.a.now())},
$S:3}
A.cX.prototype={}
A.fH.prototype={
ak(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.cS.prototype={
t(a){return"Null check operator used on a null value"}}
A.dT.prototype={
t(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.ee.prototype={
t(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.fj.prototype={
t(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cE.prototype={}
A.dn.prototype={
t(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iav:1}
A.bp.prototype={
t(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.lc(r==null?"unknown":r)+"'"},
$ibJ:1,
ghF(){return this},
$C:"$1",
$R:1,
$D:null}
A.dF.prototype={$C:"$0",$R:0}
A.dG.prototype={$C:"$2",$R:2}
A.eb.prototype={}
A.e7.prototype={
t(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.lc(s)+"'"}}
A.c8.prototype={
F(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.c8))return!1
return this.$_target===b.$_target&&this.a===b.a},
gW(a){return(A.iF(this.a)^A.cU(this.$_target))>>>0},
t(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.e3(this.a)+"'")}}
A.e6.prototype={
t(a){return"RuntimeError: "+this.a}}
A.eD.prototype={
t(a){return"Assertion failed: Reached dead code"}}
A.b3.prototype={
gk(a){return this.a},
gS(a){return this.a===0},
gau(){return new A.M(this,A.n(this).i("M<1>"))},
aG(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.hh(a)},
hh(a){var s=this.d
if(s==null)return!1
return this.b2(this.d0(s,a),a)>=0},
ai(a,b){A.n(this).i("ag<1,2>").a(b).aI(0,new A.f5(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hi(b)},
hi(a){var s,r,q=this.d
if(q==null)return null
s=this.d0(q,a)
r=this.b2(s,a)
if(r<0)return null
return s[r].b},
p(a,b,c){var s,r,q,p,o,n,m=this,l=A.n(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cI(s==null?m.b=m.bW():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cI(r==null?m.c=m.bW():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.bW()
p=m.bx(b)
o=q[p]
if(o==null)q[p]=[m.bL(b,c)]
else{n=m.b2(o,b)
if(n>=0)o[n].b=c
else o.push(m.bL(b,c))}}},
e9(a,b){var s,r,q=this,p=A.n(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aG(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.p(0,a,r)
return r},
E(a,b){var s=this
if(typeof b=="string")return s.cJ(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cJ(s.c,b)
else return s.hj(b)},
hj(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bx(a)
r=n[s]
q=o.b2(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.cK(p)
if(r.length===0)delete n[s]
return p.b},
l(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bK()}},
aI(a,b){var s,r,q=this
A.n(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.ap(q))
s=s.c}},
cI(a,b,c){var s,r=A.n(this)
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
bL(a,b){var s=this,r=A.n(s),q=new A.fa(r.c.a(a),r.y[1].a(b))
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
bx(a){return J.an(a)&1073741823},
d0(a,b){return a[this.bx(b)]},
b2(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1},
t(a){return A.k5(this)},
bW(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ij9:1}
A.f5.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.p(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.n(this.a).i("~(1,2)")}}
A.fa.prototype={}
A.M.prototype={
gk(a){return this.a.a},
gS(a){return this.a.a===0},
gB(a){var s=this.a
return new A.cK(s,s.r,s.e,this.$ti.i("cK<1>"))}}
A.cK.prototype={
gA(){return this.d},
q(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.ap(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$ia2:1}
A.bN.prototype={
gk(a){return this.a.a},
gS(a){return this.a.a===0},
gB(a){var s=this.a
return new A.aM(s,s.r,s.e,this.$ti.i("aM<1>"))}}
A.aM.prototype={
gA(){return this.d},
q(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.ap(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$ia2:1}
A.bM.prototype={
gk(a){return this.a.a},
gS(a){return this.a.a===0},
gB(a){var s=this.a
return new A.cJ(s,s.r,s.e,this.$ti.i("cJ<1,2>"))}}
A.cJ.prototype={
gA(){var s=this.d
s.toString
return s},
q(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.ap(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.bt(s.a,s.b,r.$ti.i("bt<1,2>"))
r.c=s.c
return!0}},
$ia2:1}
A.af.prototype={
bx(a){return A.iF(a)&1073741823},
b2(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.iw.prototype={
$1(a){return this.a(a)},
$S:24}
A.ix.prototype={
$2(a,b){return this.a(a,b)},
$S:16}
A.iy.prototype={
$1(a){return this.a(A.K(a))},
$S:21}
A.P.prototype={
t(a){return this.dB(!1)},
dB(a){var s,r,q,p,o,n=this.f5(),m=this.aV(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.k7(o):l+A.w(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
f5(){var s,r=this.$s
while($.hT.length<=r)B.b.m($.hT,null)
s=$.hT[r]
if(s==null){s=this.eU()
B.b.p($.hT,r,s)}return s},
eU(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.i(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.b.p(k,q,r[s])}}k=A.m5(k,!1,t.K)
k.$flags=3
return k}}
A.bY.prototype={
aV(){return[this.a,this.b]},
F(a,b){if(b==null)return!1
return b instanceof A.bY&&this.$s===b.$s&&J.m(this.a,b.a)&&J.m(this.b,b.b)},
gW(a){return A.e0(this.$s,this.a,this.b,B.m)}}
A.cm.prototype={
aV(){return[this.a]},
F(a,b){if(b==null)return!1
return b instanceof A.cm&&this.$s===b.$s&&J.m(this.a,b.a)},
gW(a){return A.e0(this.$s,this.a,B.m,B.m)}}
A.bj.prototype={
aV(){return[this.a,this.b,this.c]},
F(a,b){var s=this
if(b==null)return!1
return b instanceof A.bj&&s.$s===b.$s&&J.m(s.a,b.a)&&J.m(s.b,b.b)&&J.m(s.c,b.c)},
gW(a){var s=this
return A.e0(s.$s,s.a,s.b,s.c)}}
A.ai.prototype={
aV(){return this.a},
F(a,b){if(b==null)return!1
return b instanceof A.ai&&this.$s===b.$s&&A.mP(this.a,b.a)},
gW(a){return A.e0(this.$s,A.me(this.a),B.m,B.m)}}
A.dS.prototype={
t(a){return"RegExp/"+this.a+"/"+this.b.flags},
gfh(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.k3(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
e0(a){var s=this.b.exec(a)
if(s==null)return null
return new A.d9(s)},
dL(a,b){return new A.eg(this,b,0)},
f3(a,b){var s,r=this.gfh()
if(r==null)r=A.aV(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.d9(s)},
$ifk:1,
$imm:1}
A.d9.prototype={
h(a,b){var s
A.j(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$ie4:1}
A.eg.prototype={
gB(a){return new A.ch(this.a,this.b,this.c)}}
A.ch.prototype={
gA(){var s=this.d
return s==null?t.d.a(s):s},
q(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.f3(l,s)
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
$ia2:1}
A.fU.prototype={
ap(){var s=this.b
if(s===this)throw A.e(new A.b4("Local '' has not been initialized."))
return s},
se_(a){if(this.b!==this)throw A.e(new A.b4("Local '' has already been initialized."))
this.b=a}}
A.bu.prototype={
gX(a){return B.b6},
bu(a,b,c){A.bm(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dQ(a){return this.bu(a,0,null)},
dP(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dO(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dN(a,b,c){if(B.a.O(b,16)!==0)A.v(A.k8("Offset ("+b+") must be a multiple of BYTES_PER_ELEMENT (16)"))
return new A.cM(A.mc(a,b,(c==null?B.a.J(a.byteLength-b,16):c)*4))},
dM(a,b,c){A.bm(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iC:1,
$ibu:1}
A.cc.prototype={$icc:1}
A.cM.prototype={
gX(a){return B.b9},
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
return new A.aO(p,n,m,s[q])},
p(a,b,c){var s,r,q,p
t.Y.a(c)
s=this.a
r=s.length
A.aW(b,this,r/4|0)
q=b*4
s.$flags&2&&A.h(s)
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
$it:1,
$ieW:1}
A.eC.prototype={}
A.cP.prototype={
gab(a){if(((a.$flags|0)&2)!==0)return new A.i3(a.buffer)
else return a.buffer},
fe(a,b,c,d){var s=A.am(b,0,c,d,null)
throw A.e(s)},
cQ(a,b,c,d){if(b>>>0!==b||b>c)this.fe(a,b,c,d)}}
A.i3.prototype={
bu(a,b,c){var s=A.je(this.a,b,c)
s.$flags=3
return s},
dQ(a){return this.bu(0,0,null)},
dP(a,b,c){var s=A.jd(this.a,b,c)
s.$flags=3
return s},
dO(a,b,c){var s=A.jc(this.a,b,c)
s.$flags=3
return s},
dN(a,b,c){return new A.eC(J.iT(this.a,b,c).a)},
dM(a,b,c){var s=A.m8(this.a,b,c)
s.$flags=3
return s}}
A.dW.prototype={
gX(a){return B.b7},
$iC:1}
A.a9.prototype={
gk(a){return a.length},
dl(a,b,c,d,e){var s,r,q=a.length
this.cQ(a,b,q,"start")
this.cQ(a,c,q,"end")
if(b>c)throw A.e(A.am(b,0,c,null,null))
s=c-b
if(e<0)throw A.e(A.aB(e,null))
r=d.length
if(r-e<s)throw A.e(A.aE("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$ias:1}
A.bv.prototype={
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
p(a,b,c){A.U(c)
a.$flags&2&&A.h(a)
A.aW(b,a,a.length)
a[b]=c},
M(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.h(a,5)
if(t.d4.b(d)){this.dl(a,b,c,d,e)
return}this.cH(a,b,c,d,e)},
I(a,b,c,d){return this.M(a,b,c,d,0)},
$ip:1,
$ik:1,
$it:1}
A.at.prototype={
p(a,b,c){A.j(c)
a.$flags&2&&A.h(a)
A.aW(b,a,a.length)
a[b]=c},
M(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.h(a,5)
if(t.eB.b(d)){this.dl(a,b,c,d,e)
return}this.cH(a,b,c,d,e)},
I(a,b,c,d){return this.M(a,b,c,d,0)},
$ip:1,
$ik:1,
$it:1}
A.cd.prototype={
gX(a){return B.b8},
$iC:1,
$icd:1,
$ibq:1}
A.cN.prototype={
gX(a){return B.ba},
$iC:1,
$ieX:1}
A.dX.prototype={
gX(a){return B.bb},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iC:1}
A.cO.prototype={
gX(a){return B.bc},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iC:1,
$ij2:1}
A.dZ.prototype={
gX(a){return B.bd},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iC:1}
A.e_.prototype={
gX(a){return B.bf},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iC:1,
$ijl:1}
A.cQ.prototype={
gX(a){return B.bg},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iC:1,
$id1:1}
A.cR.prototype={
gX(a){return B.bh},
gk(a){return a.length},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iC:1}
A.bP.prototype={
gX(a){return B.bi},
gk(a){return a.length},
h(a,b){A.j(b)
A.aW(b,a,a.length)
return a[b]},
$iC:1,
$ibP:1,
$ibx:1}
A.aO.prototype={
a7(a,b){var s,r,q,p,o=this
t.Y.a(b)
s=$.dC()
s.$flags&2&&A.h(s)
s[0]=o.a*b.a
r=s[0]
s[0]=o.b*b.b
q=s[0]
s[0]=o.c*b.c
p=s[0]
s[0]=o.d*b.d
return new A.aO(r,q,p,s[0])},
cF(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.dC()
k.$flags&2&&A.h(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.aO(s,r,q,k[0])},
t(a){return"V128"},
$ia0:1}
A.ev.prototype={}
A.ew.prototype={}
A.da.prototype={}
A.db.prototype={}
A.dc.prototype={}
A.dd.prototype={}
A.eE.prototype={}
A.aQ.prototype={
i(a){return A.dv(v.typeUniverse,this,a)},
a3(a){return A.kz(v.typeUniverse,this,a)}}
A.eq.prototype={}
A.i1.prototype={
t(a){return A.aj(this.a,null)}}
A.en.prototype={
t(a){return this.a}}
A.cr.prototype={$ibe:1}
A.fQ.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:7}
A.fP.prototype={
$1(a){var s,r
this.a.a=t.O.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:44}
A.fR.prototype={
$0(){this.a.$0()},
$S:8}
A.fS.prototype={
$0(){this.a.$0()},
$S:8}
A.hZ.prototype={
eA(a,b){if(self.setTimeout!=null)self.setTimeout(A.dA(new A.i_(this,b),0),a)
else throw A.e(A.aG("`setTimeout()` not found."))}}
A.i_.prototype={
$0(){this.b.$0()},
$S:0}
A.eh.prototype={}
A.ic.prototype={
$1(a){return this.a.$2(0,a)},
$S:4}
A.id.prototype={
$2(a,b){this.a.$2(1,new A.cE(a,t.l.a(b)))},
$S:38}
A.iq.prototype={
$2(a,b){this.a(A.j(a),b)},
$S:40}
A.ao.prototype={
t(a){return A.w(this.a)},
$iL:1,
gaT(){return this.b}}
A.el.prototype={
dV(a){var s=this.a
if((s.a&30)!==0)throw A.e(A.aE("Future already completed"))
s.be(A.nu(a,null))}}
A.d5.prototype={}
A.bg.prototype={
hp(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.br(s,t.al.a(this.d),a.a,t.y,t.K)},
hb(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.fC(l,q,m,a.b,o,n,t.l)
else p=l.br(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.k.b(A.ad(s))){if((r.c&1)!==0)throw A.e(A.aB("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.e(A.aB("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.J.prototype={
cr(a,b,c){var s,r,q,p=this.$ti
p.a3(c).i("1/(2)").a(a)
s=$.F
if(s===B.k){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.e(A.jV(b,"onError",u.c))}else{r=p.c
a=s.bp(s,c.i("@<0/>").a3(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.nP(b,s)}q=new A.J(s,c.i("J<0>"))
r=b==null?1:3
this.bd(new A.bg(q,r,a,b,p.i("@<1>").a3(c).i("bg<1,2>")))
return q},
dz(a,b,c){var s,r=this.$ti
r.a3(c).i("1/(2)").a(a)
s=new A.J($.F,c.i("J<0>"))
this.bd(new A.bg(s,19,a,b,r.i("@<1>").a3(c).i("bg<1,2>")))
return s},
cv(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.F
q=new A.J(r,s)
if(r!==B.k)a=r.bo(r,a,t.z)
this.bd(new A.bg(q,8,a,null,s.i("bg<1,1>")))
return q},
fD(a){this.a=this.a&1|16
this.c=a},
bf(a){this.a=a.a&30|this.a&1
this.c=a.c},
bd(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.bd(a)
return}r.bf(s)}q=r.b
q.aZ(q,new A.ht(r,a))}},
df(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.df(a)
return}m.bf(n)}l.a=m.bq(a)
s=m.b
s.aZ(s,new A.hx(l,m))}},
aX(){var s=t.F.a(this.c)
this.c=null
return this.bq(s)},
bq(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
cT(a){var s,r=this
r.$ti.c.a(a)
s=r.aX()
r.a=8
r.c=a
A.bV(r,s)},
eT(a){var s=this.aX()
this.bf(a)
A.bV(this,s)},
bg(a){var s=this.aX()
this.fD(a)
A.bV(this,s)},
eS(a,b){A.aV(a)
t.l.a(b)
this.bg(new A.ao(a,b))},
bM(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("aq<1>").b(a)){this.cP(a)
return}this.eO(a)},
eO(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.aZ(s,new A.hv(r,a))},
cP(a){A.jo(this.$ti.i("aq<1>").a(a),this,!1)
return},
be(a){var s
this.a^=2
s=this.b
s.aZ(s,new A.hu(this,a))},
$iaq:1}
A.ht.prototype={
$0(){A.bV(this.a,this.b)},
$S:0}
A.hx.prototype={
$0(){A.bV(this.b,this.a.a)},
$S:0}
A.hw.prototype={
$0(){A.jo(this.a.a,this.b,!0)},
$S:0}
A.hv.prototype={
$0(){this.a.cT(this.b)},
$S:0}
A.hu.prototype={
$0(){this.a.bg(this.b)},
$S:0}
A.hA.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bs(p,t.fO.a(q.d),t.z)}catch(o){s=A.ad(o)
r=A.bn(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.iX(q)
n=k.a
n.c=new A.ao(q,p)
q=n}q.b=!0
return}if(j instanceof A.J&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.J){m=k.b.a
l=new A.J(m.b,m.$ti)
j.cr(new A.hB(l,m),new A.hC(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.hB.prototype={
$1(a){this.a.eT(this.b)},
$S:7}
A.hC.prototype={
$2(a,b){A.aV(a)
t.l.a(b)
this.a.bg(new A.ao(a,b))},
$S:56}
A.hz.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.br(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.ad(k)
r=A.bn(k)
q=s
p=r
if(p==null)p=A.iX(q)
o=this.a
o.c=new A.ao(q,p)
o.b=!0}},
$S:0}
A.hy.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.hp(s)&&p.a.e!=null){p.c=p.a.hb(s)
p.b=!1}}catch(o){r=A.ad(o)
q=A.bn(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.iX(p)
m=l.b
m.c=new A.ao(p,n)
p=m}p.b=!0}},
$S:0}
A.ei.prototype={}
A.d_.prototype={
gk(a){var s={},r=new A.J($.F,t.fJ)
s.a=0
this.e5(new A.fw(s,this),!0,new A.fx(s,r),r.geR())
return r}}
A.fw.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.fx.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.aX()
r.c.a(q)
s.a=8
s.c=q
A.bV(s,p)},
$S:0}
A.dp.prototype={
gfl(){var s,r=this
if((r.b&8)===0)return A.n(r).i("aS<1>?").a(r.a)
s=A.n(r)
return s.i("aS<1>?").a(s.i("dq<1>").a(r.a).gc7())},
cY(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aS(A.n(q).i("aS<1>"))
return A.n(q).i("aS<1>").a(s)}r=A.n(q)
s=r.i("dq<1>").a(q.a).gc7()
return r.i("aS<1>").a(s)},
gdt(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gc7()
return A.n(this).i("ck<1>").a(s)},
cO(){if((this.b&4)!==0)return new A.bb("Cannot add event after closing")
return new A.bb("Cannot add event while adding a stream")},
cX(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.jL():new A.J($.F,t.U)
return s},
cb(){var s=this,r=s.b
if((r&4)!==0)return s.cX()
if(r>=4)throw A.e(s.cO())
r=s.b=r|4
if((r&1)!==0)s.c2()
else if((r&3)===0)s.cY().m(0,B.z)
return s.cX()},
fG(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.n(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.e(A.aE("Stream has already been listened to."))
s=h.c
r=$.F
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.bp(r,t.a7.a3(s).i("1(2)").a(a),o,s)
A.mE(r,b)
n=c==null?A.o2():c
m=t.O
l=new A.ck(i,s,r.bo(r,m.a(n),o),r,q|p,h.i("ck<1>"))
k=i.gfl()
if(((i.b|=1)&8)!==0){j=h.i("dq<1>").a(i.a)
j.sc7(l)
j.hw()}else i.a=l
l.fE(k)
h=m.a(new A.hW(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cR((s&4)!==0)
return l},
fs(a){var s,r,q,p,o,n,m,l,k=this,j=A.n(k)
j.i("e8<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("dq<1>").a(k.a).hI()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.J)s=q}catch(n){p=A.ad(n)
o=A.bn(n)
m=new A.J($.F,t.U)
j=A.aV(p)
l=t.l.a(o)
m.be(new A.ao(j,l))
s=m}else s=s.cv(r)
j=new A.hV(k)
if(s!=null)s=s.cv(j)
else j.$0()
return s},
$ikc:1,
$ikt:1,
$ibU:1,
$ika:1}
A.hW.prototype={
$0(){A.jB(this.a.d)},
$S:0}
A.hV.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bM(null)},
$S:0}
A.ej.prototype={
c1(a){var s=this.$ti
s.c.a(a)
this.gdt().cN(new A.bT(a,s.i("bT<1>")))},
c2(){this.gdt().cN(B.z)}}
A.ci.prototype={}
A.cj.prototype={
gW(a){return(A.cU(this.a)^892482866)>>>0},
F(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.cj&&b.a===this.a}}
A.ck.prototype={
da(){return this.w.fs(this)},
dc(){var s=this.w,r=A.n(s)
r.i("e8<1>").a(this)
if((s.b&8)!==0)r.i("dq<1>").a(s.a).hM()
A.jB(s.e)},
dd(){var s=this.w,r=A.n(s)
r.i("e8<1>").a(this)
if((s.b&8)!==0)r.i("dq<1>").a(s.a).hw()
A.jB(s.f)}}
A.d6.prototype={
fE(a){var s=this
A.n(s).i("aS<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bH(s)}},
dc(){},
dd(){},
da(){return null},
cN(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aS(A.n(r).i("aS<1>"))
q.m(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bH(r)}},
c1(a){var s,r=this,q=A.n(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.hy(r.a,a,q)
r.e&=4294967231
r.cR((s&4)!==0)},
c2(){var s,r=this,q=new A.fT(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.da()
r.e|=16
if(p!=null&&p!==$.jL())p.cv(q)
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
if(r)q.dc()
else q.dd()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bH(q)},
$ie8:1,
$ibU:1}
A.fT.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.hx(s.c)
s.e&=4294967231},
$S:0}
A.dr.prototype={
e5(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.fG(s.i("~(1)?").a(a),d,c,b===!0)},
hm(a){return this.e5(a,null,null,null)}}
A.bB.prototype={
sb3(a){this.a=t.ev.a(a)},
gb3(){return this.a}}
A.bT.prototype={
e7(a){this.$ti.i("bU<1>").a(a).c1(this.b)}}
A.em.prototype={
e7(a){a.c2()},
gb3(){return null},
sb3(a){throw A.e(A.aE("No events after a done."))},
$ibB:1}
A.aS.prototype={
bH(a){var s,r=this
r.$ti.i("bU<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.ou(new A.hS(r,a))
r.a=1},
m(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sb3(b)
s.c=b}}}
A.hS.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("bU<1>").a(this.b)
r=p.b
q=r.gb3()
p.b=q
if(q==null)p.c=null
r.e7(s)},
$S:0}
A.ez.prototype={}
A.fN.prototype={
hx(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.bs(o,a,t.H)
return q}catch(p){s=A.ad(p)
r=A.bn(p)
o.aW(o,s,r)}},
hy(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.br(o,a,b,t.H,c)
return q}catch(p){s=A.ad(p)
r=A.bn(p)
o.aW(o,s,r)}},
fO(a,b){return new A.fO(this,this.bo(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.ghL(null).h(0,b)
return s}return null},
aW(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.nR(b,c)
return}r=s.gcw()
q=r.ghH()
p=$.F
try{$.F=q
s.ha(r,r.gbY(),a,b,c)
$.F=p}catch(m){o=A.ad(m)
n=A.bn(m)
$.F=p
l=b===o?c:n
q.aW(r,o,l)}},
bs(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.F
if(r===a)return b.$0()
s=r
$.F=a
try{r=b.$0()
return r}finally{$.F=s}q=null.gcw()
return null.hJ(q,q.gbY(),a,b)},
br(a,b,c,d,e){var s,r,q
d.i("@<0>").a3(e).i("1(2)").a(b)
e.a(c)
r=$.F
if(r===a)return b.$1(c)
s=r
$.F=a
try{r=b.$1(c)
return r}finally{$.F=s}q=null.gcw()
return null.ha(q,q.gbY(),a,b,c)},
fC(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").a3(f).a3(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.F
if(r===a)return b.$2(c,d)
s=r
$.F=a
try{r=b.$2(c,d)
return r}finally{$.F=s}q=null.gcw()
return null.hK(q,q.gbY(),a,b,c,d)},
bo(a,b,c){c.i("0()").a(b)
return b},
bp(a,b,c,d){c.i("@<0>").a3(d).i("1(2)").a(b)
return b},
c_(a,b,c,d,e){c.i("@<0>").a3(d).a3(e).i("1(2,3)").a(b)
return b},
f2(a,b,c){return null},
aZ(a,b){A.jA(a,t.O.a(b))
return}}
A.fO.prototype={
$0(){var s=this.a
return s.bs(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.ip.prototype={
$0(){A.lV(this.a,this.b)},
$S:0}
A.bi.prototype={
gB(a){var s=this,r=new A.d8(s,s.r,A.n(s).i("d8<1>"))
r.c=s.e
return r},
gk(a){return this.a},
ar(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.eV(b)},
eV(a){var s=this.d
if(s==null)return!1
return this.bm(s[this.bh(a)],a)>=0},
ga5(a){var s=this.e
if(s==null)throw A.e(A.aE("No elements"))
return A.n(this).c.a(s.a)},
m(a,b){var s,r,q=this
A.n(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cM(s==null?q.b=A.jq():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cM(r==null?q.c=A.jq():r,b)}else return q.eK(b)},
eK(a){var s,r,q,p=this
A.n(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.jq()
r=p.bh(a)
q=s[r]
if(q==null)s[r]=[p.bX(a)]
else{if(p.bm(q,a)>=0)return!1
q.push(p.bX(a))}return!0},
E(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.dh(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.dh(s.c,b)
else return s.fu(b)},
fu(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bh(a)
r=n[s]
q=o.bm(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dF(p)
return!0},
f6(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("r(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.e(A.ap(n))
if(!0===o)n.E(0,r)}},
cM(a,b){A.n(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.bX(b)
return!0},
dh(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dF(s)
delete a[b]
return!0},
bV(){this.r=this.r+1&1073741823},
bX(a){var s,r=this,q=new A.eu(A.n(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.bV()
return q},
dF(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.bV()},
bh(a){return J.an(a)&1073741823},
bm(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1}}
A.bW.prototype={
bh(a){return A.iF(a)&1073741823},
bm(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.eu.prototype={}
A.d8.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
q(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.ap(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$ia2:1}
A.y.prototype={
gB(a){return new A.bO(a,this.gk(a),A.aK(a).i("bO<y.E>"))},
aj(a,b){return this.h(a,b)},
gS(a){return this.gk(a)===0},
gcn(a){return!this.gS(a)},
ga5(a){if(this.gk(a)===0)throw A.e(A.a8())
return this.h(a,0)},
gad(a){if(this.gk(a)===0)throw A.e(A.a8())
return this.h(a,this.gk(a)-1)},
gaf(a){if(this.gk(a)===0)throw A.e(A.a8())
if(this.gk(a)>1)throw A.e(A.j3())
return this.h(a,0)},
aq(a,b){var s,r
A.aK(a).i("r(y.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.e(A.ap(a))}return!1},
an(a,b){return A.fy(a,b,null,A.aK(a).i("y.E"))},
m(a,b){var s
A.aK(a).i("y.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.p(a,s,b)},
N(a,b,c,d){var s,r,q=A.aK(a)
q.i("y.E?").a(d)
s=d==null?q.i("y.E").a(d):d
A.b8(b,c,this.gk(a))
for(r=b;r<c;++r)this.p(a,r,s)},
M(a,b,c,d,e){var s,r,q,p,o
A.aK(a).i("k<y.E>").a(d)
A.b8(b,c,this.gk(a))
s=c-b
if(s===0)return
A.aP(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.lI(d,e).cs(0,!1)
r=0}p=J.N(q)
if(r+s>p.gk(q))throw A.e(A.lZ())
if(r<b)for(o=s-1;o>=0;--o)this.p(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.p(a,b+o,p.h(q,r+o))},
I(a,b,c,d){return this.M(a,b,c,d,0)},
en(a,b,c){A.aK(a).i("k<y.E>").a(c)
this.I(a,b,b+c.length,c)},
t(a){return A.j4(a,"[","]")}}
A.H.prototype={
aI(a,b){var s,r,q,p=A.n(this)
p.i("~(H.K,H.V)").a(b)
for(s=this.gau(),s=s.gB(s),p=p.i("H.V");s.q();){r=s.gA()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ai(a,b){A.n(this).i("ag<H.K,H.V>").a(b).aI(0,new A.fc(this))},
bB(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("r(H.K,H.V)").a(b)
s=A.i([],m.i("x<H.K>"))
for(r=n.gau(),r=r.gB(r),m=m.i("H.V");r.q();){q=r.gA()
p=n.h(0,q)
if(b.$2(q,p==null?m.a(p):p))B.b.m(s,q)}for(m=s.length,o=0;o<s.length;s.length===m||(0,A.X)(s),++o)n.E(0,s[o])},
gk(a){var s=this.gau()
return s.gk(s)},
gS(a){var s=this.gau()
return s.gS(s)},
t(a){return A.k5(this)},
$iag:1}
A.fc.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.p(0,r.i("H.K").a(a),r.i("H.V").a(b))},
$S(){return A.n(this.a).i("~(H.K,H.V)")}}
A.fd.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.w(a)
r.a=(r.a+=s)+": "
s=A.w(b)
r.a+=s},
$S:68}
A.b9.prototype={
ai(a,b){var s
A.n(this).i("k<1>").a(b)
for(s=b.gB(b);s.q();)this.m(0,s.gA())},
t(a){return A.j4(this,"{","}")},
an(a,b){return A.kb(this,b,A.n(this).c)},
$ip:1,
$ik:1,
$iaZ:1}
A.dm.prototype={}
A.es.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fm(b):s}},
gk(a){return this.b==null?this.c.a:this.aK().length},
gS(a){return this.gk(0)===0},
gau(){if(this.b==null){var s=this.c
return new A.M(s,A.n(s).i("M<1>"))}return new A.et(this)},
p(a,b,c){var s,r,q=this
A.K(b)
if(q.b==null)q.c.p(0,b,c)
else if(q.aG(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.dH().p(0,b,c)},
ai(a,b){t.P.a(b).aI(0,new A.hL(this))},
aG(a){if(this.b==null)return this.c.aG(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
E(a,b){if(this.b!=null&&!this.aG(b))return null
return this.dH().E(0,b)},
l(a){var s,r=this
if(r.b==null)r.c.l(0)
else{if(r.c!=null)B.b.l(r.aK())
r.a=r.b=null
s=t.z
r.c=A.ab(s,s)}},
aI(a,b){var s,r,q,p,o=this
t.cA.a(b)
if(o.b==null)return o.c.aI(0,b)
s=o.aK()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.ie(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.e(A.ap(o))}},
aK(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.i(Object.keys(this.a),t.s)
return s},
dH(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.ab(t.N,t.z)
r=n.aK()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.p(0,o,n.h(0,o))}if(p===0)B.b.m(r,"")
else B.b.l(r)
n.a=n.b=null
return n.c=s},
fm(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.ie(this.a[a])
return this.b[a]=s}}
A.hL.prototype={
$2(a,b){this.a.p(0,A.K(a),b)},
$S:76}
A.et.prototype={
gk(a){return this.a.gk(0)},
aj(a,b){var s=this.a
if(s.b==null)s=s.gau().aj(0,b)
else{s=s.aK()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gB(a){var s=this.a
if(s.b==null){s=s.gau()
s=s.gB(s)}else{s=s.aK()
s=new J.bI(s,s.length,A.a_(s).i("bI<1>"))}return s}}
A.i6.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:10}
A.i5.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:10}
A.c9.prototype={}
A.dI.prototype={}
A.dJ.prototype={}
A.dU.prototype={
dX(a,b){var s=A.nL(a,this.gh0().a)
return s},
gh0(){return B.a9}}
A.f6.prototype={}
A.ef.prototype={
fT(a){t.L.a(a)
return B.bj.fR(a)}}
A.fK.prototype={
fR(a){return new A.i4(this.a).eW(t.L.a(a),0,null,!0)}}
A.i4.prototype={
eW(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.b8(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.n3(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.n2(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bP(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.n4(o)
l.b=0
throw A.e(A.dL(m,a,p+l.c))}return n},
bP(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.J(b+c,2)
r=q.bP(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bP(a,s,c,d)}return q.fV(a,b,c,d)},
fV(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.cf(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.cV(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.cV(h)
e.a+=p
break
case 65:p=A.cV(h)
e.a+=p;--d
break
default:p=A.cV(h)
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
p=A.cV(a[l])
e.a+=p}else{p=A.mp(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.cV(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.h9.prototype={
t(a){return this.f1()}}
A.L.prototype={
gaT(){return A.mg(this)}}
A.cz.prototype={
t(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.eV(s)
return"Assertion failed"}}
A.be.prototype={}
A.aX.prototype={
gbS(){return"Invalid argument"+(!this.a?"(s)":"")},
gbR(){return""},
t(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.w(p),n=s.gbS()+q+o
if(!s.a)return n
return n+s.gbR()+": "+A.eV(s.gck())},
gck(){return this.b}}
A.b7.prototype={
gck(){return A.kE(this.b)},
gbS(){return"RangeError"},
gbR(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.w(q):""
else if(q==null)s=": Not greater than or equal to "+A.w(r)
else if(q>r)s=": Not in inclusive range "+A.w(r)+".."+A.w(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.w(r)
return s}}
A.dM.prototype={
gck(){return A.j(this.b)},
gbS(){return"RangeError"},
gbR(){if(A.j(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ib7:1,
gk(a){return this.f}}
A.d3.prototype={
t(a){return"Unsupported operation: "+this.a}}
A.ed.prototype={
t(a){return"UnimplementedError: "+this.a}}
A.bb.prototype={
t(a){return"Bad state: "+this.a}}
A.dH.prototype={
t(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.eV(s)+"."}}
A.e1.prototype={
t(a){return"Out of Memory"},
gaT(){return null},
$iL:1}
A.cZ.prototype={
t(a){return"Stack Overflow"},
gaT(){return null},
$iL:1}
A.ha.prototype={
t(a){return"Exception: "+this.a}}
A.a1.prototype={
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
k=""}return g+l+B.p.bJ(e,i,j)+k+"\n"+B.p.a7(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.w(f)+")"):g}}
A.k.prototype={
aq(a,b){var s
A.n(this).i("r(k.E)").a(b)
for(s=this.gB(this);s.q();)if(b.$1(s.gA()))return!0
return!1},
cs(a,b){var s=A.n(this).i("k.E")
if(b)s=A.aN(this,s)
else{s=A.aN(this,s)
s.$flags=1
s=s}return s},
gk(a){var s,r=this.gB(this)
for(s=0;r.q();)++s
return s},
gS(a){return!this.gB(this).q()},
gcn(a){return!this.gS(this)},
an(a,b){return A.kb(this,b,A.n(this).i("k.E"))},
ga5(a){var s=this.gB(this)
if(!s.q())throw A.e(A.a8())
return s.gA()},
gad(a){var s,r=this.gB(this)
if(!r.q())throw A.e(A.a8())
do s=r.gA()
while(r.q())
return s},
gaf(a){var s,r=this.gB(this)
if(!r.q())throw A.e(A.a8())
s=r.gA()
if(r.q())throw A.e(A.j3())
return s},
aj(a,b){var s,r
A.aP(b,"index")
s=this.gB(this)
for(r=b;s.q();){if(r===0)return s.gA();--r}throw A.e(A.j0(b,b-r,this,"index"))},
t(a){return A.m_(this,"(",")")}}
A.bt.prototype={
t(a){return"MapEntry("+A.w(this.a)+": "+A.w(this.b)+")"}}
A.Z.prototype={
gW(a){return A.d.prototype.gW.call(this,0)},
t(a){return"null"}}
A.d.prototype={$id:1,
F(a,b){return this===b},
gW(a){return A.cU(this)},
t(a){return"Instance of '"+A.e3(this)+"'"},
gX(a){return A.iv(this)},
toString(){return this.t(this)}}
A.eA.prototype={
t(a){return""},
$iav:1}
A.fv.prototype={
gcg(){var s,r=this.b
if(r==null)r=$.jg.$0()
s=r-this.a
if($.jM()===1e6)return s
return s*1000}}
A.cf.prototype={
gk(a){return this.a.length},
t(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.fi.prototype={
t(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.f0.prototype={
$2(a,b){var s=t.g
this.a.cr(new A.eZ(s.a(a)),new A.f_(s.a(b)),t.X)},
$S:17}
A.eZ.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:18}
A.f_.prototype={
$2(a,b){var s=A.ng(A.aV(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:19}
A.iG.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.v(A.aE("Future already completed"))
s.bM(r.i("1/").a(a))
return null},
$S:4}
A.iH.prototype={
$1(a){if(a==null)return this.a.dV(new A.fi(a===undefined))
return this.a.dV(a)},
$S:4}
A.f1.prototype={
fU(a,b,c,d){var s
t.L.a(a)
s=A.jf(32768)
this.fZ(A.j1(a,B.o,null,null),s,b,!0,!1)
return s.b7()},
fZ(a,b,c,d,e){return A.o8(b,c,new A.f2(a,!1,!0))}}
A.f2.prototype={
$1(a){return B.S.fY(this.a,a,this.c,this.b)},
$S:20}
A.hD.prototype={
h_(a,b,c,d,e){var s,r,q,p=d===!0,o=a.a
a.a=B.o
r=p
s=r
try{q=A.l7("gzip",!1,p,new A.hE(this,a,b,!1,!1,s))
return q}finally{a.sdS(o)}},
fY(a,b,c,d){return this.h_(a,b,!1,c,d)},
eY(a,b,c,d,e){var s,r,q,p,o,n=0
for(;;){s=a.c
r=a.d
r===$&&A.E()
if(!(s<r))break
if(!this.fq(a,e)){if(n!==0)return!1
a.c=s
return B.T.fX(a,b,!1,!1)}q=b.gk(b)
p=new A.dN(a,b,!0)
p.d5()
if(!p.f)return!1
s=a.b
if((s==null?0:s.length-a.c)<8)return!1
a.b4()
o=a.b4()
b.e1()
if(B.a.O(b.gk(b)-q,4294967296)!==o)return!1;++n}return n!==0},
fq(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gk(0)<10)return!1
s=a.c
if(a.bA()!==35615)return!1
if(a.al()!==8)return!1
r=a.al()
if(b&&(r&224)!==0)return!1
a.b4()
a.al()
a.al()
if((r&4)!==0){if(a.gk(0)<2)return!1
q=a.bA()
if(a.gk(0)<q)return!1
a.ea(q)}if((r&8)!==0)if(!this.dq(a))return!1
if((r&16)!==0)if(!this.dq(a))return!1
if((r&2)!==0){if(a.gk(0)<2)return!1
if(b){p=a.bA()
o=a.bI(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.E()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bI(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.od(i.hz(),n)}if((n&65535)!==p)throw A.e(A.lJ("Invalid gzip header checksum"))}else a.bA()}return!0},
dq(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.E()
if(!(s<r))break
r=a.b
r.toString
a.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1}}
A.hE.prototype={
$0(){var s=this
return s.a.eY(s.b,s.c,s.d,s.e,s.f)},
$S:11}
A.f3.prototype={
ex(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
for(s=0;s<a0;++s){r=a1[s]
if(r>a.b)a.b=r
if(r<a.c)a.c=r}r=a.b
if(r>15)throw A.e(B.V)
q=r+1
p=new Uint16Array(q)
for(o=0;o<a0;++o){n=a1[o]
if(n!==0){if(!(n>=0&&n<q))return A.a(p,n)
m=p[n]
if(!(n<q))return A.a(p,n)
p[n]=m+1}}for(l=1,k=1;k<=r;++k){l=(l<<1>>>0)-p[k]
if(l<0)throw A.e(B.a5)}if(l>0)q=r>(a2?0:1)
else q=!1
if(q)throw A.e(B.a4)
j=B.a.a9(1,r)
r=a.a=new Uint32Array(j)
for(q=a.b,m=a1.length,i=1,h=0,g=2;i<=q;){for(f=i<<16,s=0;s<a0;++s){if(!(s<m))return A.a(a1,s)
if(a1[s]===i){for(e=h,d=0,c=0;c<i;++c){d=(d<<1|e&1)>>>0
e=e>>>1}for(b=(f|s)>>>0,c=d;c<j;c+=g){if(!(c>=0&&c<j))return A.a(r,c)
r[c]=b}++h}}++i
h=h<<1>>>0
g=g<<1>>>0}}}
A.fM.prototype={}
A.i8.prototype={
fX(a,b,c,d){var s,r=!1,q=a.a
a.a=B.r
try{s=A.l7("zlib",!1,r,new A.i9(this,a,b,!1,!1))
return s}finally{a.sdS(q)}},
eB(a,b,c,d){var s,r,q,p,o,n,m=a.c,l=a.d
l===$&&A.E()
if(m>=l)return!1
A:{l=a.b
if((l==null?0:l.length-m)<2)return!1
l.toString
s=a.c=m+1
r=l.length
if(!(m>=0&&m<r))return A.a(l,m)
q=l[m]
a.c=s+1
if(!(s>=0&&s<r))return A.a(l,s)
p=l[s]
if((q&15)!==8)return!1
if(q>>>4>7)return!1
if(B.a.O(q*256+p,31)!==0)return!1
if((p>>>5&1)!==0){a.b4()
return!1}m=new A.bQ(new Uint8Array(32768),B.o)
o=new A.dN(a,m,!0)
o.d5()
n=o.c.b7()
if(!o.f){b.am(n)
return!1}m=a.b
if((m==null?0:m.length-a.c)<4){b.am(n)
return!1}a.b4()
break A}if(n!=null)b.am(n)
return!0}}
A.i9.prototype={
$0(){var s=this
return s.a.eB(s.b,s.c,s.d,s.e)},
$S:11}
A.dN.prototype={
gah(){var s=this.a
if(s==null)return s
s.d===$&&A.E()
return s},
d5(){var s,r,q,p=this
p.w=p.r=0
if(p.gah()==null)return
s=p.c
if(!(s instanceof A.bQ)){p.d=s
p.c=A.jf(32768)}try{for(;;){r=p.gah()
q=r.c
r=r.d
r===$&&A.E()
if(!(q<r))break
if(!p.fi())return
p.cW(32768)}}finally{p.cW(0)
p.c=s
p.d=null}},
cW(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.b7()
o.am(A.by(q,0,r))
p=A.jf(2097152)
p.am(A.by(q,r,null))
this.c=p},
fi(){var s,r,q,p=this,o=p.gah()
if(o!=null){s=o.c
r=o.d
r===$&&A.E()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.aa(3)
s=(q&1)===0
switch(B.a.L(q,1)){case 0:if(p.fk()===-1)return!1
break
case 1:if(p.cU($.lf(),$.le())===-1)return!1
break
case 2:if(p.fj()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
aa(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gah()
r=s.c
s=s.d
s===$&&A.E()
if(r>=s)return-1
s=o.gah()
r=s.b
r.toString
s=s.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
q=r[s]
s=o.r
r=o.w
o.r=(s|B.a.a9(q,r))>>>0
o.w=r+8}r=o.r
p=B.a.dm(1,a)
o.r=B.a.c3(r,a)
o.w=s-a
return(r&p-1)>>>0},
bZ(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.E()
s=a.b
while(m.w<s){r=m.gah()
q=r.c
r=r.d
r===$&&A.E()
if(q>=r)break
r=m.gah()
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
fk(){var s,r,q=this
q.w=q.r=0
s=q.aa(16)
if(s!==(q.aa(16)^65535)>>>0)return-1
if(s>q.gah().gk(0))return-1
r=q.gah().ea(s)
q.c.bE(r)
return 0},
fj(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.aa(5)
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
q[n]=o}m=g.dv(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.c6(B.d.gab(l),0,f)
j=J.c6(B.d.gab(l),f,s)
if(g.fc(n,m,l)===-1)return-1
i=g.du(k)
n=i==null
h=n?null:g.du(j)
if(n||h==null)return-1
return g.cU(i,h)},
dv(a,b){var s,r
t.L.a(a)
try{s=A.j_(a,b)
return s}catch(r){if(A.ad(r) instanceof A.a1)throw r
else throw r}},
du(a){return this.dv(a,!1)},
cU(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.bZ(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bD(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.D,r)
q=j.aa(B.D[r])
if(q<0)return-1
if(!(r<29))return A.a(B.C,r)
p=B.C[r]
o=j.bZ(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.A,o)
n=j.aa(B.A[o])
if(n<0)return-1
m=B.ae[o]+n
if(m>=1){l=j.c
l=m>l.gk(l)}else l=!0
if(l)return-1
j.c.bC(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gah()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.E()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
fc(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.bZ(b)
if(q===-1)return-1
p=0
switch(q){case 16:if(r===0)return-1
o=k.aa(2)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.h(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=s}break
case 17:o=k.aa(3)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.h(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
case 18:o=k.aa(7)
if(o===-1)return-1
o+=11
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.h(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
default:if(q<0||q>15)return-1
l=r+1
c.$flags&2&&A.h(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=q
r=l
s=q
break}}return 0}}
A.dV.prototype={
bc(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.e(A.iW("The decoded data is larger than the "+s+" bytes allowed"))}},
gk(a){return this.b.b},
e1(){return null},
bD(a){this.bc(1)
this.b.bD(a)},
aR(a,b){t.L.a(a)
this.bc(a.length)
this.b.aR(a,b)},
am(a){return this.aR(a,null)},
bE(a){this.bc(a.gk(0))
this.b.bE(a)},
bC(a,b){this.bc(b)
this.b.bC(a,b)},
aB(a,b){return this.b.aB(a,b)},
ba(a){return this.aB(a,null)}}
A.c7.prototype={}
A.cy.prototype={}
A.dD.prototype={}
A.cA.prototype={
f1(){return"ByteOrder."+this.b}}
A.fu.prototype={
gk(a){return this.c},
aR(a,b){var s
t.L.a(a)
s=A.by(a,0,a.length)
this.bQ(s)},
am(a){return this.aR(a,null)},
bD(a){var s,r,q,p=this
if(p.r!=null)p.bQ(new Uint8Array(A.V(A.i([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.h(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bN()}},
bE(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.E()
if(!(r<q))break
s=a.ht(o,0,J.ak(o))
r=s
if(typeof r!=="number")return r.hG()
if(r<=0)break
this.bQ(A.by(o,0,s))}}finally{a.c=A.j(p)}},
bQ(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bN()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.m(0,new Uint8Array(A.V(A.by(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.M(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bN()}},
bN(){var s=this,r=s.f
if(r===0)return
s.b.m(0,new Uint8Array(A.V(A.by(s.e,0,r))))
s.f=0},
aB(a,b){return A.v(A.aG("a streamed result cannot be read back"))},
ba(a){return this.aB(a,null)}}
A.h7.prototype={}
A.dO.prototype={
gk(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.j(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bI(a,b){var s,r=this,q=r.b
if(q==null)return A.j1(A.i([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.E()
a=s-b}return A.j1(q,r.a,a,b)},
al(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
ht(a,b,c){var s,r,q,p=this.b
if(p==null)return 0
s=p.length
r=this.c
q=s-r
q=c>q?q:c
if(q<=0)return 0
B.d.M(a,b,b+q,p,r)
this.c+=q
return q},
hz(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gk(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.e(A.am(q,0,r,"position",null))
return J.c6(B.d.gab(n),o.b.byteOffset+o.c,s)}}
A.dP.prototype={
bA(){var s=this.al(),r=this.al()
if(this.a===B.r)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
b4(){var s=this,r=s.al(),q=s.al(),p=s.al(),o=s.al()
if(s.a===B.r)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
ea(a){var s=this,r=s.bI(a,s.c)
s.c=s.c+r.gk(0)
return r},
sdS(a){this.a=t.fA.a(a)}}
A.bQ.prototype={
e1(){},
b7(){return J.c6(B.d.gab(this.c),this.c.byteOffset,this.b)},
bD(a){var s,r,q=this
if(q.b===q.c.length)q.f4()
s=q.c
r=q.b++
s.$flags&2&&A.h(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
aR(a,b){var s,r,q,p,o=this
t.L.a(a)
b=a.length
while(s=o.b,r=s+b,q=o.c,p=q.length,r>p)o.bl(r-p)
B.d.I(q,s,r,a)
o.b+=b},
am(a){return this.aR(a,null)},
bE(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bl(s+(q?0:r.length-a.c)-n)}if(!q)B.d.M(o,s,s+a.gk(0),r,a.c)
m.b=m.b+a.gk(0)},
bC(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.bl(r-p)
o=s-a
if(a>=b)B.d.M(q,s,r,q,o)
else for(n=q.$flags|0,m=o;s<r;s=l,m=k){l=s+1
k=m+1
if(!(m>=0&&m<p))return A.a(q,m)
j=q[m]
n&2&&A.h(q)
if(!(s>=0))return A.a(q,s)
q[s]=j}i.b+=b},
aB(a,b){var s=this
if(a<0)a=s.b+a
if(b==null)b=s.b
else if(b<0)b=s.b+b
return J.c6(B.d.gab(s.c),s.c.byteOffset+a,b-a)},
ba(a){return this.aB(a,null)},
bl(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.I(s,0,q,r)
this.c=s},
f4(){return this.bl(null)},
gk(a){return this.b}}
A.bw.prototype={
bC(a,b){var s,r=this
for(s=-a;b>a;){r.am(r.ba(s))
b-=a}if(b===a)r.am(r.ba(s))
else r.am(r.aB(s,b-a))},
b7(){return this.aB(0,this.gk(this))}}
A.ex.prototype={}
A.eQ.prototype={
hd(a,b){var s,r,q,p,o,n,m,l
if(b<=0)return!1
s=this.x.h(0,a)
r=s!=null
if(r&&s.a>=b)return!0
q=this.CW.h(0,a)
if(q!=null&&q.x&&q.f===b&&q.y>=b)return!0
for(p=this.Q,o=0,n=0;n<b;++n){if(!(r&&s.ar(0,n))){m=p.h(0,new A.z(a,B.a.J(n,4)))
if(m==null)m=null
else{l=n-m.c
m=l>=0&&l<4&&m.d[l]!==255}m=m===!0}else m=!0
if(m)++o
else break}return o>=b},
eo(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.cc()
this.a=s},
cC(){this.dx=0
if(this.db.length>65536)this.db=new Uint8Array(65536)},
ef(a,b,c,d,e,f,g,a0){var s,r,q,p,o,n,m,l,k,j,i,h=this
h.ch=h.ay=0
s=a0*e*4
if(d<0||d>=g||b.length<s)return!1
r=new A.z(c,B.a.J(d,4))
q=h.Q
p=q.E(0,r)
if(p!=null){q.p(0,r,p)
if(p.a===a0&&p.b===e&&p.ar(0,d)){p.z=++h.z
p.hs(d,b,a)
if(h.f){o=p.h8(d)
h.ay=o.a
h.ch=o.b}return!0}}if(a!=null){a.a=null
a.b=-1}n=new A.z(c,d)
q=h.w
m=q.E(0,n)
if(m!=null){m.f=++h.z
q.p(0,n,m)
q=m.a
l=q.length
k=m.b
if(h.cV(q,0,l,k,b,s)){if(h.f){j=m.d
if(j===0&&m.e===0){i=A.iY(m.c,q,0,l,k)
q=m.d=i.a
m.e=i.b}else q=j
h.ay=q
h.ch=m.e}return!0}h.aY(n)}return!1},
hE(a,b,c,d,e,f,g){return this.ef(null,a,b,c,d,e,f,g)},
e8(a,b,c,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=a1*c
if(b<0||b>=a0||d>65536||d<256||e.b<=0)return!1
s=B.a.J(b,4)*4
r=Math.min(s+4,a0)
q=r-s
if(q<2)return!1
p=new A.z(a,B.a.J(s,4))
o=e.Q
if(o.aG(p)||e.as.ar(0,p))return!1
n=A.i([],t.t)
for(m=e.w,l=s,k=0;l<r;++l){j=m.h(0,new A.z(a,l))
if(j!=null){k+=j.a.length
B.b.m(n,l)}}if(n.length<2)return!1
i=d*4
h=e.ax
if(h==null||h.length<i)h=e.ax=new Uint8Array(i)
g=A.mw(s,n,new A.eT(e,a),c,Math.min(B.a.J(e.b,8),k*2),new A.eU(e,a,i),h,a1)
if(g==null){if(n.length===q){q=e.as
q.m(0,p)
if(q.a>128)q.E(0,q.ga5(0))}return!1}for(q=n.length,f=0;f<n.length;n.length===q||(0,A.X)(n),++f)e.aY(new A.z(a,n[f]))
q=g.w
e.bU(q)
g.z=++e.z
o.p(0,p,g)
e.at+=q
return!0},
cG(a,b,c,d,e,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a2*c*4
if(b<0||b>=a1||a0.length<f)return new A.cq([0,0,0,0,0])
s=new A.z(a,B.a.J(b,4))
g.as.E(0,s)
r=g.Q.h(0,s)
r=r==null?null:r.ar(0,b)
if(r===!0)g.fv(s)
q=f+B.a.J(f,255)+16
p=e.h5(q)
if(f>0)$.iR()
o=A.m6(a0,f,p,e.a,f)
n=o<0||o>=f
if(n){m=f
l=a0}else{m=o
l=p}k=A.jX(l,0,m)
if(g.f){j=A.iY(k,l,0,m,n)
i=j.a
h=j.b}else{i=0
h=0}g.ay=i
g.ch=h
g.fo(l,k,i,h,n,m,new A.z(a,b),0)
e.hu(q)
return new A.cq([m,k,0,i,h])},
h1(a){var s,r=this.CW.E(0,a)
if(r!=null)try{r.c.cb()}catch(s){}return!1},
h6(a){var s,r,q,p,o=this,n=o.Q,m=A.n(n).i("M<1>"),l=m.i("bR<k.E>")
m=A.aN(new A.bR(new A.M(n,m),m.i("r(k.E)").a(new A.eR(a)),l),l.i("k.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.X)(m),++s){r=n.E(0,m[s])
if(r!=null)o.at=o.at-r.w}n=o.as
n.f6(A.n(n).i("r(1)").a(new A.eS(a)),!0)
q=o.x.E(0,a)
if(q==null)return
for(n=q.gB(q),m=o.w;n.q();){p=m.E(0,new A.z(a,n.gA()))
if(p!=null)o.y=o.y-p.a.length}},
cc(){var s,r,q,p
for(r=this.CW,q=new A.aM(r,r.r,r.e,A.n(r).i("aM<2>"));q.q();){s=q.d
try{s.c.cb()}catch(p){}}r.l(0)},
dT(){var s,r=this
r.w.l(0)
r.x.l(0)
r.y=0
r.Q.l(0)
s=r.as
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bV()}r.at=0
r.ax=null
r.cC()},
eZ(a,b,c,d,e,f,g){var s
$.iR()
if(g!=null&&A.jX(a,b,c)!==g)return!1
if(d){if(c!==f)return!1
B.d.M(e,0,f,a,b)
return!0}try{A.m7(a,b,c,e,f)
return!0}catch(s){if(A.ad(s) instanceof A.a1)return!1
else throw s}},
cV(a,b,c,d,e,f){return this.eZ(a,b,c,d,e,f,null)},
fo(a,b,c,d,e,f,g,h){var s,r,q,p=this,o=p.b
if(o<=0||f>o)return
p.aY(g)
p.bU(f)
s=new Uint8Array(f)
B.d.M(s,0,f,a,h)
p.w.p(0,g,new A.ex(s,e,b,c,d,++p.z))
o=p.x
r=g.a
q=o.h(0,r)
if(q==null){q=A.ja(t.S)
o.p(0,r,q)
o=q}else o=q
o.m(0,g.b)
p.y+=f},
fv(a){var s=this.Q.E(0,a)
if(s!=null)this.at=this.at-s.w},
bU(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
for(s=t.x,r=g.Q,q=A.n(r),p=q.i("M<1>"),o=g.w,n=A.n(o),m=n.i("M<1>"),q=q.i("bN<2>"),n=n.i("bN<2>");g.y+g.at+a>g.b;){l=o.a!==0
k=r.a!==0
if(l&&k){j=new A.bN(o,n).gB(0)
if(!j.q())A.v(A.a8())
i=j.gA().f
j=new A.bN(r,q).gB(0)
if(!j.q())A.v(A.a8())
if(i<=j.gA().z){j=new A.M(o,m).gB(0)
if(!j.q())A.v(A.a8())
g.aY(j.gA())}else{j=new A.M(r,p).gB(0)
if(!j.q())A.v(A.a8())
h=r.E(0,s.a(j.gA()))
if(h!=null)g.at=g.at-h.w}}else if(l){j=new A.M(o,m).gB(0)
if(!j.q())A.v(A.a8())
g.aY(j.gA())}else if(k){j=new A.M(r,p).gB(0)
if(!j.q())A.v(A.a8())
h=r.E(0,s.a(j.gA()))
if(h!=null)g.at=g.at-h.w}else break}},
aY(a){var s,r,q,p=this,o=p.w.E(0,a)
if(o==null)return
p.y=p.y-o.a.length
s=p.x
r=a.a
q=s.h(0,r)
if(q!=null){q.E(0,a.b)
if(q.a===0)s.E(0,r)}},
sfQ(a){this.f=A.aU(a)}}
A.eU.prototype={
$2(a,b){var s=this.a,r=s.w.h(0,new A.z(this.b,a)),q=r.a
return s.cV(q,0,q.length,r.b,b,this.c)},
$S:22}
A.eT.prototype={
$1(a){var s,r,q=this.a,p=q.w.h(0,new A.z(this.b,a))
if(p==null)return B.u
if(q.f&&p.d===0&&p.e===0){q=p.c
s=p.a
r=A.iY(q,s,0,s.length,p.b)
p.d=r.a
p.e=r.b}return new A.z(p.d,p.e)},
$S:23}
A.eR.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.eS.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.fb.prototype={
h5(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
hu(a){var s=this
if(s.b.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.fE.prototype={}
A.ec.prototype={
ar(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
h8(a){var s,r,q=this,p=a-q.c
if(p>=0&&p<4){s=q.d
if(!(p>=0&&p<4))return A.a(s,p)
r=s[p]
if(r!==255){s=q.x
if(!(r<4))return A.a(s,r)
return new A.z(s[r],q.y[r])}}return B.u},
d9(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdA()},
gcS(){var s=this.Q
return s===$?this.Q=B.a.J(this.a+16-1,16):s},
gdA(){var s,r,q=this,p=q.as
if(p===$){s=q.gcS()
r=B.a.J(q.b+16-1,16)
q.as!==$&&A.Q()
p=q.as=s*r}return p},
hs(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdA(),b=d.d9(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.d9(a5.b):-1
if(a2===b)return
for(a0=d.a,s=d.b,r=d.f,q=a2>=0,p=d.e,o=p.length,n=0;n<c;++n){m=b+n
if(!(m>=0&&m<o))return A.a(p,m)
l=p[m]
if(q){m=a2+n
if(!(m<o))return A.a(p,m)
m=p[m]===l}else m=!1
if(m)continue
m=d.gcS()
k=B.a.O(n,m)*16
j=B.a.a2(n,m)*16
i=Math.min(16,a0-k)
h=Math.min(16,s-j)
if(!(l<r.length))return A.a(r,l)
g=r[l]
for(m=i*4,f=0;f<h;++f){e=((j+f)*a0+k)*4
B.d.M(a4,e,e+m,g,f*i*4)}}if(!a){a5.a=a1
a5.b=a3}}}
A.fF.prototype={
$0(){return A.i([],t.t)},
$S:25}
A.au.prototype={
gS(a){var s=this
return s.a>=s.c||s.b>=s.d},
hg(a){var s=this
return new A.au(s.a-a,s.b-a,s.c+a,s.d+a)},
by(a){var s=this
return new A.au(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.b6.prototype={
bb(a){if($.l!=null)this.b=A.aJ(a*4)
else this.c=new Int32Array(a)},
gv(){var s=this.b
if(s!=null)s=A.dY(t.a.a(A.u($.l.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
aw(a,b){var s,r,q,p,o,n=this
if(n.b!=null){s=A.aJ(a*4)
r=A.dY(t.a.a(A.u($.l.memory).buffer),s,a)
if(b>0)B.e.I(r,0,b,n.gv())
q=$.l
q.toString
p=n.b
p.toString
q.free(p)
n.b=s
n.a=a}else{o=new Int32Array(a)
if(b>0){q=n.c
q.toString
B.e.I(o,0,b,q)}n.c=o
n.a=a}},
a_(){var s=this.b
if(s!=null){$.l.free(s)
this.b=null}}}
A.aY.prototype={
gv(){var s=this.c
if(s!=null)s=A.jd(t.a.a(A.u($.l.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
aw(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.e(A.aE("Cannot resize a borrowed pixel buffer"))
if(n.c!=null){s=A.aJ(a*4)
r=A.jd(t.a.a(A.u($.l.memory).buffer),s,a)
if(b>0)B.f.I(r,0,b,n.gv())
q=$.l
q.toString
p=n.c
p.toString
q.free(p)
n.c=s
n.b=a}else{o=new Uint32Array(a)
if(b>0){q=n.d
q.toString
B.f.I(o,0,b,q)}n.d=o
n.b=a}},
a_(){var s,r,q=this
if(q.a&&q.c!=null){s=$.l
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.fe.prototype={
hq(a,b,c,d,e,f,g,h,i,j,k,a0,a1){var s,r,q,p,o,n,m,l=this;++l.f
s=(j-h)*(k-i)
if(e<2||f===0||a0.b==null||s>262144)return-2
if(s>l.e)l.e=s
r=l.c
if(e>r){if(r>0){$.l.free(l.r)
$.l.free(l.w)}r=e*2
l.c=r
l.r=A.aJ(r*8)
l.w=A.aJ(l.c*8)}r=l.d
if(f>r){if(r>0){$.l.free(l.x)
$.l.free(l.y)}r=f*2
l.d=r
l.x=A.aJ(r*4)
l.y=A.aJ(l.d*4)}r=t.a
B.h.I(A.jc(r.a(A.u($.l.memory).buffer),l.r,l.c),0,e,a)
B.h.I(A.jc(r.a(A.u($.l.memory).buffer),l.w,l.c),0,e,b)
B.e.I(A.dY(r.a(A.u($.l.memory).buffer),l.x,l.d),0,f,c)
B.e.I(A.dY(r.a(A.u($.l.memory).buffer),l.y,l.d),0,f,d)
q=new A.fg(l,f,h,i,j,k,g,a0)
p=q.$0()
while(p===-1){o=a0.b
if(o!=null){n=r.a(A.u($.l.memory).buffer)
m=a0.a
o=new Int32Array(n,o,m)}else{o=a0.c
o.toString}a0.aw(o.length*2,0)
p=q.$0()}return p},
hv(){if($.ff!==this){this.a_()
return}var s=$.cL-1
$.cL=s
if(s>0)return
$.cL=0
$.ff=null
this.a_()},
a_(){var s=this,r=s.a
if(r!==0)$.l.fl_dense_free(r)
$.l.free(s.b)
if(s.c>0){$.l.free(s.r)
$.l.free(s.w)
s.w=s.r=s.c=0}if(s.d>0){$.l.free(s.x)
$.l.free(s.y)
s.y=s.x=s.d=0}}}
A.fg.prototype={
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
return A.dz(j,"fl_dense_raster",[s.a,r,q,p,o,k.b,k.c,k.d,k.e,k.f,n,l,m.gv().length/2|0,s.b],t.S)},
$S:3}
A.ik.prototype={
$8(a,b,c,d,e,f,g,h){this.a.U(g,h,a,b,c,d,e,f,this.b)},
$S:26}
A.hX.prototype={
h7(a,b,c,d,e,f,g){var s,r=!0
if(g.gS(0)){s=a.f
if(s!==0)if(s<=1024){r=a.r
r=r===0||r>128}}if(r)return!1
r=this.f
if(r==null)r=this.f=new A.br(new Float64Array(256))
r.aH(a.f*4)
g.ci(a.r*2)
for(;;)return!1}}
A.ih.prototype={
$7(a,b,c,d,e,f,g){var s,r,q,p=this,o=c+e,n=d+f,m=o*o+n*n
if(m>1e-12&&g<5){s=1/Math.sqrt(m)
o*=s
n*=s
r=p.a
if(g<2||r*(1-(c*o+d*n))>p.b){q=g+1
p.$7(a,b,c,d,o,n,q)
p.c.u(a+r*o,b+r*n)
p.$7(a,b,o,n,e,f,q)
return}}if(g===0){r=p.a
p.c.u(a+r*e,b+r*f)}},
$S:27}
A.ii.prototype={
$6(a,b,c,d,e,f){var s
this.a.$7(a,b,c,d,e,f,0)
s=this.c
this.b.u(a+s*e,b+s*f)},
$S:15}
A.ig.prototype={
$5(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=a4?-1:1,b=d.a,a=b.length
if(!(a0>=0&&a0<a))return A.a(b,a0)
s=b[a0]*c
r=d.b
q=r.length
if(!(a0<q))return A.a(r,a0)
p=r[a0]*c
if(!(a1>=0&&a1<a))return A.a(b,a1)
o=b[a1]*c
if(!(a1<q))return A.a(r,a1)
n=r[a1]*c
m=-p
l=-n
k=s*o+p*n
j=s*n-p*o
r=d.c
i=a2+r*m
h=a3+r*s
g=a2+r*l
f=a3+r*o
if(Math.abs(j)<0.0001&&k>0){d.d.u((i+g)*0.5,(h+f)*0.5)
return}if(j>=0){b=d.d
b.u(i,h)
b.u(a2,a3)
b.u(g,f)
return}b=d.e
if(b===1){a=1+k
a=a>0.000001&&2<=d.f*a}else a=!1
if(a){e=r/(1+k)
d.d.u(a2+(m+l)*e,a3+(s+o)*e)}else{a=d.d
if(b===2){a.u(i,h)
b=d.r
if(k<-0.999){b.$6(a2,a3,m,s,s,p)
b.$6(a2,a3,s,p,l,o)}else b.$6(a2,a3,m,s,l,o)}else{a.u(i,h)
a.u(g,f)}}},
$S:29}
A.ce.prototype={
geQ(){var s=this.a
return s}}
A.fn.prototype={
gd8(){var s=this
if(!s.Q&&s.b){s.Q=!0
s.z=A.m9()}return s.z},
aL(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j=this,i=j.gd8()
if(i!=null){s=a.f
if(s>4096||a.r>256)j.as=!0
r=i.f
q=i.hq(a.a,a.b,a.c,a.d,s,a.r,b,d,e,f,g,c.a,!0)
j.r=j.r+(i.f-r)
if(q>=0){p=A.dY(t.a.a(A.u($.l.memory).buffer),i.b,4)
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
return}}s=j.ch
if(s==null){s=new Int32Array(8192)
o=new Int32Array(8192)
n=new Int32Array(8192)
m=new Int32Array(8192)
l=Math.max(64,256)
k=new Int32Array(l)
B.e.N(k,0,l,-1)
m=j.ch=new A.eY(l,k,s,o,n,m)
s=m}s.hr(a,b,c,d,e,f,g)},
fp(a,b,c,d,e,f,g,h,i,j,k,l){var s
if(this.gd8()!=null)s=l===0
else s=!0
if(s)return!1
return!1},
dj(a,b){var s=this.at,r=s.E(0,a)
if(r==null)return null
if(r.b.F(0,b)){s.p(0,a,r)
return r.c}this.ax=this.ax-r.d
r.c.a.a_()
return null},
c0(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.at
r=s.$ti.i("M<1>")
for(;;){if(!(m.ax+l>1048576||s.a>=256))break
q=new A.M(s,r).gB(0)
if(!q.q())A.v(A.a8())
p=s.E(0,q.gA())
m.ax=m.ax-p.d
o=p.c.a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}r=m.ay
r.toString
o=Math.max(1,c.b)*2
n=new A.b6(o)
n.bb(o)
n=new A.aD(n)
n.dW(c)
s.p(0,a,new A.bS(r,b,n,l))
m.ax+=l},
dr(a,b){var s,r,q,p=this.y2,o=p.E(0,a)
if(o!=null){p.p(0,a,o)
return o.b}if(p.a>=512)p.E(0,new A.M(p,p.$ti.i("M<1>")).ga5(0))
s=this.fx
s.l(0)
A.ij(a,b,0.01,s)
r=Math.max(1,s.f)
q=A.cT(Math.max(1,s.r),r)
B.h.I(q.a,0,s.f,s.a)
B.h.I(q.b,0,s.f,s.b)
B.e.I(q.c,0,s.r,s.c)
B.e.I(q.d,0,s.r,s.d)
B.d.I(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
r=this.ay
r.toString
p.p(0,a,new A.aa(r,q,t.b3))
return q},
fa(a){var s=this.bv,r=s.E(0,a)
if(r==null)return null
s.p(0,a,r)
return r.b},
gb_(){var s=this.CW
if(s==null){s=new A.b6(2048)
s.bb(2048)
s=this.CW=new A.aD(s)}return s},
gbO(){var s=this.cx
if(s==null){s=new A.b6(2048)
s.bb(2048)
s=this.cx=new A.aD(s)}return s},
gbn(){var s=this.cy
if(s==null){s=new A.b6(2048)
s.bb(2048)
s=this.cy=new A.aD(s)}return s},
gds(){var s,r,q=this.R8
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.R8=new A.hX(this.p4,new A.br(q),new A.br(s),new A.br(r),new A.br(new Float64Array(256)))}return q},
f9(a,b,c,d){var s=this,r=s.ok,q=!1
if(a<r.length)if(r[a]===b){r=s.p1
if(!(a<r.length))return A.a(r,a)
if(r[a]===c){r=s.p2
if(!(a<r.length))return A.a(r,a)
r=r[a]===d}else r=q}else r=q
else r=q
if(r){r=s.k4
if(!(a<r.length))return A.a(r,a)
return r[a]}return null},
fn(a,b,c,d){var s,r,q
for(s=this.ok,r=this.p1,q=this.p2;s.length<=a;){B.b.m(s,null)
B.b.m(r,0/0)
B.b.m(q,0/0)}B.b.p(s,a,b)
B.b.p(r,a,c)
B.b.p(q,a,d)},
eH(a,b){var s,r,q,p
for(s=this.k4;s.length<=a;){r=Math.max(16,b)
B.b.m(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.b.p(s,a,q)}return q},
eJ(a){var s,r,q,p,o
for(s=this.fy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eI(a){var s,r,q,p,o
for(s=this.go;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
ao(a){var s,r
for(s=this.RG;s.length<=a;){r=new A.b6(2048)
if($.l!=null)r.b=A.aJ(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aD(r))}s=s[a]
s.l(0)
return s},
eG(a){var s,r,q,p,o
for(s=this.id;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eF(a){var s,r,q,p,o
for(s=this.k1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
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
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eD(a){var s,r,q,p,o
for(s=this.ry;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cL(a){var s,r
for(s=this.to;s.length<=a;){r=new A.b6(2048)
if($.l!=null)r.b=A.aJ(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aD(r))}return s[a]},
eC(a){var s,r
for(s=this.x1;s.length<=a;){r=new A.b6(2048)
if($.l!=null)r.b=A.aJ(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aD(r))}return s[a]},
ft(){var s,r,q,p,o
for(s=this.cj,r=new A.aM(s,s.r,s.e,s.$ti.i("aM<2>"));r.q();){q=r.d.b
if(q.a&&q.c!=null){p=$.l
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.l(0)},
cq(a){var s=this,r=a.a,q=s.ok
B.b.N(q,0,q.length,null)
s.at.bB(0,new A.fo(s,r))
s.y2.bB(0,new A.fp(r))
s.bv.bB(0,new A.fq(r))
s.cj.bB(0,new A.fr(r))},
eb(){var s,r,q,p=this,o=p.ok
B.b.N(o,0,o.length,null)
for(o=p.at,s=new A.aM(o,o.r,o.e,o.$ti.i("aM<2>"));s.q();){r=s.d.c.a
q=r.b
if(q!=null){$.l.free(q)
r.b=null}}o.l(0)
p.ax=0
p.y2.l(0)
p.bv.l(0)
p.ft()},
a_(){var s,r,q,p,o,n,m=this
m.eb()
s=m.aP
if(s!=null)s.a_()
m.aP=null
s=m.bw
if(s!=null)s.a_()
m.bw=null
s=m.z
if(s!=null)s.hv()
m.z=null
s=m.CW
if(s!=null)s.a.a_()
s=m.cx
if(s!=null)s.a.a_()
s=m.cy
if(s!=null)s.a.a_()
m.CW=m.cx=m.cy=null
for(s=m.to,r=s.length,q=0;q<s.length;s.length===r||(0,A.X)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}for(r=m.x1,p=r.length,q=0;q<r.length;r.length===p||(0,A.X)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}B.b.l(s)
B.b.l(r)
B.b.l(m.rx)
B.b.l(m.ry)
for(s=m.RG,r=s.length,q=0;q<s.length;s.length===r||(0,A.X)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}B.b.l(s)
m.dg()
m.ch=null},
ee(a){var s,r,q,p,o,n,m,l,k,j,i=this
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
s.y=s.x=s.d=0}}if(a){r=i.aP
if(r!=null)r.a_()
i.aP=null
i.dg()
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
B.b.l(i.dZ)
i.R8=null}else{for(r=i.x2,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
if(n!=null)if(p<5){o=n.c
if(o!=null){m=q.a(A.u($.l.memory).buffer)
l=n.b
o=new Uint32Array(m,o,l)}else{o=n.d
o.toString}o=o.length>262144}else o=!0
else o=!1
if(o){if(n.a&&n.c!=null){o=$.l
o.toString
m=n.c
m.toString
o.free(m)
n.c=null}B.b.p(r,p,null)}}if(o>5)B.b.sk(r,5)
r=i.fy
q=r.length
B.b.b5(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.X)(r),++k)r[k].ag()
r=i.go
q=r.length
B.b.b5(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.X)(r),++k)r[k].ag()
r=i.id
q=r.length
B.b.b5(r,Math.min(2,q),q)
q=i.k1
r=q.length
B.b.b5(q,Math.min(2,r),r)
for(r=q.length,k=0;k<q.length;q.length===r||(0,A.X)(q),++k)q[k].ag()
r=i.k4
q=r.length
B.b.b5(r,Math.min(2,q),q)
q=i.ok
B.b.N(q,0,q.length,null)
for(p=0;p<r.length;++p)if(r[p].length>4096)B.b.p(r,p,new Float64Array(64))
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
if(a){for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.X)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.l.free(m)
o.b=null}}B.b.l(r)}else for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.X)(r),++k)r[k].ag()
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
r.fr=!1
r.ch=-1
r.ay=0
q=r.a
j=Math.max(q,2048)
if(r.b.length>j){o=new Int32Array(q)
B.e.N(o,0,q,-1)
r.b=o}if(r.c.length>32768){r.c=new Int32Array(8192)
r.d=new Int32Array(8192)
r.e=new Int32Array(8192)
r.f=new Int32Array(8192)}}}i.p3.Z(a)},
hC(){return this.ee(!1)},
dg(){var s,r,q,p,o,n
for(s=this.x2,r=s.length,q=0;q<s.length;s.length===r||(0,A.X)(s),++q){p=s[q]
if(p!=null)if(p.a&&p.c!=null){o=$.l
o.toString
n=p.c
n.toString
o.free(n)
p.c=null}}B.b.l(s)},
aJ(a,b){var s,r,q
if(b>this.xr)this.xr=b
s=this.x2
if(s.length<=a)B.b.sk(s,a+1)
if(!(a<s.length))return A.a(s,a)
r=s[a]
if(r==null){q=A.fh(b)
B.b.p(s,a,q)
return q}if(r.gv().length<b)r.aw(b,0)
return r},
c4(a){var s
for(s=this.dZ;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
sfz(a){this.ay=t.g_.a(a)}}
A.fo.prototype={
$2(a,b){var s
A.aV(a)
t.az.a(b)
if(b.a!==this.b)return!1
s=this.a
s.ax=s.ax-b.d
b.c.a.a_()
return!0},
$S:30}
A.fp.prototype={
$2(a,b){A.aV(a)
return t.b3.a(b).a===this.a},
$S:31}
A.fq.prototype={
$2(a,b){A.aV(a)
return t.e.a(b).a===this.a},
$S:32}
A.fr.prototype={
$2(a,b){t.I.a(a)
t.dL.a(b)
if(b.a!==this.a)return!1
b.b.a_()
return!0},
$S:33}
A.aa.prototype={}
A.bS.prototype={}
A.io.prototype={
$2(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.a
a0.l(0)
s=a.b
s.l(0)
r=a.c
A.ij(a1.a,r,a.d,a0)
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
k.aL(s,!1,a2,j,i,h,g)
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
A.nl(a0,e,a.ay,d,k.gds())
s.l(0)
s.aF(d,q,p,o,n,m,l)
c=k.ao(3)
b=k.ao(4)
k.aL(s,!1,c,j,i,h,g)
a2.aU(b)
A.cW(b,c,a2,e>0?2:3)},
$S:34}
A.c.prototype={
dJ(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.dJ(a)
s=this.b
if(A.o(s))a.a+="["+A.w(s)+"]"
else{r="."+A.w(s)
a.a+=r}},
t(a){var s,r=new A.cf("")
this.dJ(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bA.prototype={
gdR(){var s,r,q=this,p=q.r
if(p===$){s=q.b
s===$&&A.E()
r=q.c
r===$&&A.E()
p=q.r=new A.au(0,0,0+s,0+r)}return p},
gH(){var s,r=this,q=r.z
if(q===$){s=B.b.ac(r.w,new A.h5(r))
r.z!==$&&A.Q()
r.z=s
q=s}return q},
j(a,b){return A.v(new A.fJ(b+" at "+a.t(0),null,null))},
av(a,b,c){if(!t.P.b(b))this.j(c,"Expected object")
return b},
bz(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.o(c)){s=new A.c(b,c)
break A}if(typeof c=="string"){s=new A.c(b,c)
break A}s=b
break A}this.j(s,"Expected finite number")}return a},
T(a,b){return this.bz(a,b,null)},
P(a,b,c){var s,r
t.P.a(a)
t.h.a(c)
for(s=a.gau(),s=s.gB(s);s.q();){r=s.gA()
if(!c.ar(0,r))this.j(new A.c(b,r),"Unsupported field")}},
eh(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.m(a.h(0,b),0)&&!J.m(a.h(0,b),!1))this.j(new A.c(c,b),"Unsupported nonzero "+b)},
dU(g4,g5,g6,g7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0=this,f1=null,f2="ip",f3="op",f4="Expected object",f5="layers",f6="hasMask",f7="tp",f8="td",f9="masksProperties",g0="shapes",g1="refId",g2="parent",g3=t.P
g3.a(g4)
t.cq.a(g5)
t.h.a(g6)
t.aM.a(g7)
f0.P(g4,B.i,B.aT)
f0.eh(g4,"ddd",B.i)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=g4.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.iU(n)))m=!(n instanceof A.H&&n.gS(n))
if(m)f0.j(new A.c(B.i,o),"Unsupported "+o)}f0.b=f0.T(g4.h(0,"w"),new A.c(B.i,"w"))
f0.c=f0.T(g4.h(0,"h"),new A.c(B.i,"h"))
f0.d=f0.T(g4.h(0,f2),new A.c(B.i,f2))
f0.e=f0.T(g4.h(0,f3),new A.c(B.i,f3))
s=f0.T(g4.h(0,"fr"),new A.c(B.i,"fr"))
f0.f=s
if(f0.b<=0||f0.c<=0||s<=0||f0.e<=f0.d)f0.j(B.i,"Invalid bounds/timing")
s=g5==null
l=s?A.ab(t.N,g3):g5
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){k=s[p]
j=g4.h(0,k)
if(j==null)j=[]
if(!q.b(j))f0.j(new A.c(B.i,k),"Expected asset definitions")
for(m=J.cx(j);m.q();){i=m.gA()
if(!g3.b(i))f0.j(new A.c(B.i,k),f4)
h=i.h(0,"id")
if(typeof h!="string")f0.j(new A.c(B.i,k),"Expected asset id")
l.p(0,h,i)}}g=g4.h(0,f5)
if(!q.b(g))f0.j(B.n,"Expected layers")
f=g7==null?A.ab(t.bP,t.E):g7
e=new A.hU(f0,g,new A.af(t.gt),new A.bW(t.ai))
s=t.S
r=t.D
d=A.ab(s,r)
c=A.ab(r,s)
s=A.i([],t.f)
b=new A.hb(f0,s)
a=A.ab(r,t.eG)
for(r=J.N(g),m=f0.w,a0=t.n,a1=t.r,a2=t.V,a3=t.c2,a4=f0.a,a5=t.N,a6=t.z,a7=0;a7<r.gk(g);++a7){a8=new A.c(B.n,a7)
a9=r.h(g,a7)
if(!g3.b(a9))f0.j(a8,f4)
f0.P(a9,a8,B.aS)
b0=a9.h(0,"bm")
if(b0==null)b0=0
if(!A.o(b0)||b0<0||b0>16)f0.j(new A.c(a8,"bm"),"Blend mode "+A.w(b0))
for(b1=["ddd","ao"],b2=b1.length,p=0;p<b2;++p)f0.eh(a9,b1[p],a8)
if(a9.h(0,f6)!=null&&!A.b1(a9.h(0,f6))&&!J.m(a9.h(0,f6),0)&&!J.m(a9.h(0,f6),1))f0.j(new A.c(a8,f6),"Expected boolean hasMask")
b3=a9.h(0,"tt")
if(b3==null)b3=0
if(!A.o(b3)||b3<0||b3>4)f0.j(new A.c(a8,"tt"),"Matte type")
if(a9.h(0,f7)!=null&&!J.m(a9.h(0,f7),0)){b1=!0
if(b3!==0)if(a7!==0){b1=a9.h(0,f7)
b2=a7-1
b4=J.ae(r.h(g,b2),"ind")
b1=!J.m(b1,b4==null?b2:b4)}if(b1)f0.j(new A.c(a8,f7),"Unsupported nonzero tp")}if(a9.h(0,f8)!=null&&!J.m(a9.h(0,f8),0)&&!J.m(a9.h(0,f8),1))f0.j(new A.c(a8,f8),"Matte source flag")
b5=f0.eP(a9.h(0,f9),new A.c(a8,f9))
g3.a(a9)
b.fK(a9,q.a(q.b(a9.h(0,g0))?a9.h(0,g0):B.B),a8,s)
b1=a9.h(0,"sr")
if(b1==null)b1=1
b6=f0.T(b1,new A.c(a8,"sr"))
if(b6===0)f0.j(new A.c(a8,"sr"),"Invalid zero time stretch")
b7=a9.h(0,"ty")
b1=J.aA(b7)
if(!b1.F(b7,4)&&!b1.F(b7,3)&&!b1.F(b7,0)&&!b1.F(b7,1))f0.j(new A.c(a8,"ty"),"Layer type "+A.w(b7))
b8=f0.f_(a9.h(0,"ef"),new A.c(a8,"ef"),g)
b9=b8.a
c0=b8.b
c1=f0.fd(a9.h(0,"sy"),new A.c(a8,"sy"))
if(c1!=null&&b9!=null)f0.j(new A.c(a8,"ef"),"Fill with Inner Shadow")
b2=c0==null
b4=!b2
if(b4)c2=!b1.F(b7,4)||b3!==0||b0!==0
else c2=!1
if(c2)f0.j(c0.b,"Set Matte requires a normal shape layer without a track matte")
c3=f0.dE(a9.h(0,"ks"),new A.c(a8,"ks"))
if(b1.F(b7,4))c4=f0.d1(a9.h(0,g0),new A.c(a8,g0),e)
else if(b1.F(b7,1)){c2=a9.h(0,"sw")
if(c2==null)c2=0
c5=f0.T(c2,new A.c(a8,"sw"))
c2=a9.h(0,"sh")
if(c2==null)c2=0
c6=f0.T(c2,new A.c(a8,"sh"))
c7=a9.h(0,"sc")
if(typeof c7!="string"||!B.p.eq(c7,"#"))f0.j(new A.c(a8,"sc"),"Invalid solid color")
c8=A.oj(B.p.eu(c7,1),16)
c2=B.a.L(c8,16)
c9=B.a.L(c8,8)
d0=new Float32Array(A.V(A.i([c5*0.5,c6*0.5],a0)))
d1=new Float32Array(0)
d2=new Float32Array(A.V(A.i([c5,c6],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.V(A.i([0],a0)))
d5=new A.T(new A.aT(!1,!1,new A.B(d0,f1,!1,d1,!1),new A.B(d2,f1,!1,d3,!1),new A.B(d4,f1,!1,new Float32Array(0),!1)))
c2=new Float32Array(A.V(A.i([(c2&255)/255,(c9&255)/255,(c8&255)/255],a0)))
d6=new A.B(c2,f1,!1,new Float32Array(0),!1)
d6.f=!0
c2=new Float32Array(A.V(A.i([100],a0)))
c9=new Float32Array(0)
d0=new Float32Array(A.V(A.i([1],a0)))
d1=new Float32Array(0)
d7=A.jr(A.i([d5],a1),d6,new A.B(c2,f1,!1,c9,!1),new A.B(d0,f1,!1,d1,!1),!1,!1,1,1,4,f1,f1)
d1=A.i([d5],a1)
d0=A.i([d7],a2)
c9=new Float32Array(A.V(A.i([0,0],a0)))
c2=new Float32Array(0)
d2=new Float32Array(A.V(A.i([0,0],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.V(A.i([100,100],a0)))
d8=new Float32Array(0)
d9=new Float32Array(A.V(A.i([0],a0)))
e0=new Float32Array(0)
e1=new Float32Array(A.V(A.i([100],a0)))
c4=A.jp(d1,d0,new A.c_(new A.B(c9,f1,!1,c2,!1),new A.B(d2,f1,!1,d3,!1),new A.B(d4,f1,!1,d8,!1),new A.B(d9,f1,!1,e0,!1),new A.B(e1,f1,!1,new Float32Array(0),!1),f1,f1,f1,f1))}else c4=f1
if(b1.F(b7,0)){h=a9.h(0,g1)
e2=l.h(0,h)
if(typeof h!="string"||e2==null||!q.b(e2.h(0,f5)))f0.j(new A.c(a8,g1),"Missing precomposition")
if(g6.ar(0,h))f0.j(new A.c(a8,g1),"Cyclic precomposition")
b1=a9.h(0,"w")
if(b1==null)b1=f0.b
e3=f0.T(b1,new A.c(a8,"w"))
b1=a9.h(0,"h")
if(b1==null)b1=f0.c
e4=f0.T(b1,new A.c(a8,"h"))
e5=new A.ay(h,e3,e4)
e6=f.h(0,e5)
if(e6==null){e6=A.jn(a4)
b1=A.m3(["w",e3,"h",e4,"ip",0,"op",f0.e-f0.d,"fr",f0.f,"layers",e2.h(0,f5)],a5,a6)
c2=A.m4(a5)
c2.ai(0,g6)
c2.m(0,h)
e6.dU(b1,l,c2,f)
f.p(0,e5,e6)}e7=new A.ep(new A.af(a3)).cB(e6)
f0.x=f0.x+e7.x
f0.y=B.t.bG(f0.y,e7.y)}else e7=f1
e8=a9.h(0,"tm")!=null?f0.K(a9.h(0,"tm"),new A.c(a8,"tm"),1,A.i([0],a0)):f1
b1=a9.h(0,f2)
if(b1==null)b1=f0.d
b1=f0.T(b1,new A.c(a8,f2))
c2=a9.h(0,f3)
if(c2==null)c2=f0.e
c2=f0.T(c2,new A.c(a8,f3))
c9=J.m(a9.h(0,"hd"),!0)
d0=a9.h(0,"st")
if(d0==null)d0=0
d0=f0.T(d0,new A.c(a8,"st"))
e9=A.kp(c3,c4,b1,c2,c9,b0,e7,b9,c1,b5,b2?b3:1,d0,b6,e8,b4)
if(b4)a.p(0,e9,c0)
B.b.m(m,e9)
h=a9.h(0,"ind")
if(h==null)h=a7
if(!A.o(h)||d.aG(h))f0.j(new A.c(a8,"ind"),"Invalid/duplicate layer id")
d.p(0,h,e9)
if(a9.h(0,g2)!=null){if(!A.o(a9.h(0,g2)))f0.j(new A.c(a8,g2),"Invalid parent id")
c.p(0,e9,A.j(a9.h(0,g2)))}}f0.ff(g,d,a)
f0.fg(d,c)},
fP(a){return this.dU(a,null,B.aY,null)},
eP(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e="pt"
if(a==null)return f
if(!t.j.b(a))g.j(b,"Expected list")
s=J.N(a)
if(s.gS(a))return f
r=A.i([],t.bE)
for(q=t.n,p=t.P,o=0;o<s.gk(a);++o){n=new A.c(b,o)
m=s.h(a,o)
if(!p.b(m))g.j(n,"Expected object")
g.P(m,n,B.aR)
l=J.m(m.h(0,"inv"),!0)
k=A.ia(m.h(0,"mode"))
if(k==null)k="a"
if(!B.aZ.ar(0,k))g.j(new A.c(n,"mode"),"Unsupported mask mode "+k)
if(m.h(0,e)==null)g.j(new A.c(n,e),"Missing mask path")
j=g.de(m.h(0,e),new A.c(n,e))
if(m.h(0,"o")!=null)i=g.K(m.h(0,"o"),new A.c(n,"o"),1,A.i([100],q))
else{h=new Float32Array(A.V(A.i([100],q)))
i=new A.B(h,f,!1,new Float32Array(0),!1)}B.b.m(r,new A.a7(j,k,i,l,m.h(0,"x")!=null?g.K(m.h(0,"x"),new A.c(n,"x"),1,A.i([0],q)):f))}return r},
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
j.x+=4}}for(p=new A.bM(c,A.n(c).i("bM<1,2>")).gB(0);p.q();){n=p.d
m=n.a
l=n.b
o=b.h(0,l.a)
k=!0
if(o!=null)if(o.b!=null)if(!o.e)k=o!==m&&o.y!==0
if(k)j.j(l.b,"Set Matte requires a visible shape source without its own matte")
m.ay=o
j.x+=4}for(p=J.N(a),r=0;r<s.length;++r){if(J.m(J.ae(p.h(a,r),"td"),1)){if(!(r<s.length))return A.a(s,r)
k=!s[r].ch}else k=!1
if(k)j.j(new A.c(new A.c(B.n,r),"td"),"Unpaired matte source")}},
fg(a,b){var s,r,q,p,o,n,m,l,k
t.B.a(a)
t.gq.a(b)
for(s=new A.bM(b,A.n(b).i("bM<1,2>")).gB(0);s.q();){r=s.d
q=r.b
p=a.h(0,q)
if(p==null)this.j(B.n,"Missing parent "+q)
r.a.cy=p}for(s=this.w,q=s.length,o=t.D,n=0;n<s.length;s.length===q||(0,A.X)(s),++n){m=s[n]
l=A.ja(o)
for(k=m;k!=null;k=k.cy)if(!l.m(0,k))this.j(B.n,"Cyclic parenting")}},
az(a){var s,r,q,p,o,n,m,l,k,j,i
for(s=this.w,r=s.length-1,q=null;r>=0;--r){if(!(r<s.length))return A.a(s,r)
p=s[r]
if(!p.ch){if(!p.e)o=(p.b!=null||p.f!=null)&&a>=p.c&&a<p.d
else o=!1
o=!o}else o=!0
if(o)continue
o=p.a.e.n(a)
if(0>=o.length)return A.a(o,0)
if(B.c.G(B.a.C(B.c.Y(255*B.c.G(o[0])/100),0,255)*p.aS(a)/255)===0)continue
n=p.ay
m=p.az(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.n(a)
if(0>=o.length)return A.a(o,0)
k=B.c.G(B.a.C(B.c.Y(255*B.c.G(o[0])/100),0,255)*n.aS(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.az(a)
if(j==null)continue
m=m.by(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.c2(q,m)}if(q==null)return null
i=q.by(this.gdR())
return i.gS(0)?null:i},
dE(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.ab(t.N,t.z):i.av(0,a,b)
i.P(g,b,B.b4)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.j(new A.c(b,p),"3D transform")}s=t.n
o=i.K(g.h(0,"sk"),new A.c(b,"sk"),1,A.i([0],s))
n=i.K(g.h(0,"sa"),new A.c(b,"sa"),1,A.i([0],s))
m=g.h(0,h)
if(m instanceof A.H&&J.m(m.h(0,"s"),!0)){l=i.av(0,m,new A.c(b,h))
i.P(l,new A.c(b,h),B.aV)
k=i.K(l.h(0,"x"),new A.c(new A.c(b,h),"x"),1,A.i([0],s))
j=i.K(l.h(0,"y"),new A.c(new A.c(b,h),"y"),1,A.i([0],s))
m=null}else{k=null
j=null}return A.js(i.K(g.h(0,"a"),new A.c(b,"a"),2,A.i([0,0],s)),i.K(m,new A.c(b,h),2,A.i([0,0],s)),i.fJ(g.h(0,"s"),new A.c(b,"s"),2,A.i([100,100],s),100),i.K(g.h(0,"r"),new A.c(b,"r"),1,A.i([0],s)),i.K(g.h(0,"o"),new A.c(b,"o"),1,A.i([100],s)),k,j,o,n)},
f_(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aK
if(!b0.b(b1))a4.j(b2,"Expected effects array")
for(s=J.b2(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.N(b1),n<m.gk(b1);++n){l=new A.c(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.j(new A.c(b2,n),a5)
a4.P(m,l,B.b0)
k=J.m(m.h(0,a6),21)&&J.m(m.h(0,a7),"ADBE Fill")
j=J.m(m.h(0,a6),28)&&J.m(m.h(0,a7),"ADBE Set Matte3")
i=J.m(m.h(0,a6),5)&&J.m(m.h(0,a7),"ADBE Layer Control")
h=!k
if(h&&!j&&!i)a4.j(l,"Unsupported visual effect")
if(J.m(m.h(0,a8),0)||J.m(m.h(0,a8),!1))continue
if(m.h(0,a8)!=null&&!J.m(m.h(0,a8),1)&&!J.m(m.h(0,a8),!0))a4.j(new A.c(l,a8),"Invalid effect enabled flag")
if(!h||j){if(p!=null||o!=null)a4.j(l,"Multiple visual effects")
g=k?B.aa:B.ad
f=m.h(0,a9)
if(!b0.b(f)||J.ak(f)!==g.length)a4.j(new A.c(l,a9),"Invalid effect parameters")
e=new A.fW(a4,l,f,g)
d=new A.fX(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.eo(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aF,B.aG,B.aH,B.aI,B.aJ],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.n(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.c(new A.c(new A.c(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.ec(a0))a4.j(a1,"Expected a static layer index")
o=new A.z(B.c.Y(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.ak(a2)!==1)a4.j(l,"Invalid layer control")
m=J.jT(a2)
if(!q.b(m))a4.j(new A.c(new A.c(l,a9),0),a5)
a4.P(m,new A.c(new A.c(l,a9),0),B.G)
if(!J.m(m.h(0,a6),10)||!J.m(m.h(0,a7),"ADBE Layer Control-0001"))a4.j(l,"Unsupported effect control")
a=a4.K(m.h(0,"v"),new A.c(new A.c(new A.c(l,a9),0),"v"),1,A.i([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.ec(a0))h=a0!==0&&!s.aq(b3,new A.fV(a0))
else h=!0
if(h)a4.j(l,"Missing layer control target")}}return new A.z(p,o)},
fd(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.iU(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.ak(a)!==1)d.j(b,"Expected one Inner Shadow style")
r=new A.c(b,0)
q=d.av(0,J.jT(a),r)
if(!J.m(q.h(0,"ty"),2))d.j(new A.c(r,"ty"),"Unsupported layer style")
d.P(q,r,B.aP)
p=new A.h1(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.m(p.$2(m,0),0))d.j(new A.c(r,m),"Unsupported Inner Shadow parameter")}if(!J.m(p.$2("bm",1),1))d.j(new A.c(r,"bm"),"Inner Shadow requires Multiply")
l=d.K(q.h(0,"c"),new A.c(r,"c"),3,A.i([0,0,0],t.n))
if(l.a==null)d.j(new A.c(r,"c"),"Animated Inner Shadow")
k=l.n(0)
s=p.$2("o",100)
if(typeof s!=="number")return s.a7()
j=B.a.C(B.c.G(s*255/100),0,255)
s=p.$2("a",0)
if(typeof s!=="number")return s.O()
i=B.c.O(s,360)*3.141592653589793/180
h=p.$2("d",0)
if(h<0)d.j(new A.c(r,"d"),"Negative Inner Shadow distance")
if(h===0||j===0)return null
s=Math.cos(i)
o=Math.sin(i)
g=k.length
if(0>=g)return A.a(k,0)
f=B.a.C(B.c.G(k[0]*255),0,255)
if(1>=g)return A.a(k,1)
e=B.a.C(B.c.G(k[1]*255),0,255)
if(2>=g)return A.a(k,2)
return A.ko(-s*h,o*h,(j<<24|f<<16|e<<8|B.a.C(B.c.G(k[2]*255),0,255))>>>0)},
de(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b={}
b.a=b.b=null
b.c=!1
s=c.dC(a,a0,-1,A.i([],t.n),new A.h2(b,c,a))
r=A.i([],t.hg)
q=s.b
if(q!=null&&b.c){p=b.a
p.toString
o=q.a.length
n=A.jb(o,!1,!1,t.y)
m=b.b
m.toString
for(l=p.length,k=m,j=0;j<o;++j){m=j*2
i=m<l
h=i?p[m]:0
if(i){++m
if(!(m<l))return A.a(p,m)
g=p[m]}else g=0
B.b.p(n,j,h===0?k:h===1)
k=g===0?n[j]:g===1}for(m=o-1,i=q.d,f=i.length,j=0;j<o;++j){e=j*2
if(e<l){++e
if(!(e<l))return A.a(p,e)
g=p[e]}else g=0
e=n[j]
if(!(j<f))return A.a(i,j)
if((i[j]&1)!==0)d=e
else d=g!==0?g===1:B.b.h(n,Math.min(j+1,m))
B.b.m(r,new A.z(e,d))}}c.x=c.x+(s.gcu()/6|0)
p=b.b
return new A.ax(s,p!==!1,r)},
d1(e3,e4,e5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7=this,d8=null,d9="ks",e0="d",e1="Path direction",e2="r"
if(!t.j.b(e3))d7.j(e4,"Expected shape list")
s=t.r
r=A.i([],s)
q=A.i([],t.V)
for(p=t.P,o=t.aT,n=t.eU,m=n.i("k.E"),l=t.n,k=t.u,j=t.S,i=t.W,h=t.fq,g=t.bs,f=t.fP,e=d8,d=0;c=J.N(e3),d<c.gk(e3);++d){b=new A.c(e4,d)
a=c.h(e3,d)
if(!p.b(a))d7.j(b,"Expected object")
a0=a.h(0,"ty")
a1=a.h(0,"bm")
if(a1==null)a1=0
if(!A.o(a1)||a1<0||a1>16)d7.j(new A.c(b,"bm"),"Blend mode "+A.w(a1))
a2=J.m(a.h(0,"hd"),!0)
switch(a0){case"tr":if(e!=null||d!==c.gk(e3)-1)d7.j(b,"Transform must be last and unique")
e=d7.dE(a,b)
break
case"gr":d7.P(a,b,B.aU)
a3=d7.d1(a.h(0,"it"),new A.c(b,"it"),e5)
if(!a2){B.b.m(r,a3)
B.b.m(q,a3)}break
case"sh":d7.P(a,b,B.aW)
if(a.h(0,d9)==null)d7.j(new A.c(b,d9),"Missing path data")
a4=e5.cz(a.h(0,d9),new A.c(b,d9))
if(!a2)B.b.m(r,new A.T(a4))
break
case"rc":case"el":d7.P(a,b,B.b1)
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a5=d7.b0(a.h(0,"p"),new A.c(b,"p"),2,A.i([0,0],l),!0)
a6=d7.b0(a.h(0,"s"),new A.c(b,"s"),2,A.i([0,0],l),!0)
a7=d7.K(a.h(0,e2),new A.c(b,e2),1,A.i([0],l))
d7.x+=8
if(!a2)B.b.m(r,new A.T(new A.aT(J.m(a0,"el"),J.m(a.h(0,e0),3),a5,a6,a7)))
break
case"sr":d7.P(a,b,B.b_)
a8=a.h(0,"sy")
if(a8==null)a8=1
c=J.aA(a8)
if(!c.F(a8,1)&&!c.F(a8,2))d7.j(new A.c(b,"sy"),"PolyStar type "+A.w(a8))
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a9=d7.K(a.h(0,"pt"),new A.c(b,"pt"),1,A.i([5],l))
a5=d7.b0(a.h(0,"p"),new A.c(b,"p"),2,A.i([0,0],l),!0)
b0=d7.K(a.h(0,e2),new A.c(b,e2),1,A.i([0],l))
b1=d7.K(a.h(0,"or"),new A.c(b,"or"),1,A.i([0],l))
b2=d7.K(a.h(0,"os"),new A.c(b,"os"),1,A.i([0],l))
if(c.F(a8,1))if(a.h(0,"ir")!=null){b3=d7.K(a.h(0,"ir"),new A.c(b,"ir"),1,A.i([0],l))
b4=b3}else{b3=new Float32Array(A.V(A.i([0],l)))
b3=new A.B(b3,d8,!1,new Float32Array(0),!1)
b4=b3}else b4=d8
if(c.F(a8,1))if(a.h(0,"is")!=null){b3=d7.K(a.h(0,"is"),new A.c(b,"is"),1,A.i([0],l))
b5=b3}else{b3=new Float32Array(A.V(A.i([0],l)))
b3=new A.B(b3,d8,!1,new Float32Array(0),!1)
b5=b3}else b5=d8
d7.x+=12
if(!a2)B.b.m(r,new A.T(new A.b_(c.F(a8,1),J.m(a.h(0,e0),3),a9,a5,b0,b1,b2,b4,b5)))
break
case"tm":d7.P(a,b,B.b3)
b6=a.h(0,"m")
if(b6==null)b6=1
c=J.aA(b6)
if(!c.F(b6,1)&&!c.F(b6,2))d7.j(new A.c(b,"m"),"Trim mode")
b3=A.i([],s)
b7=new A.bD(b3,d7.K(a.h(0,"s"),new A.c(b,"s"),1,A.i([0],l)),d7.K(a.h(0,"e"),new A.c(b,"e"),1,A.i([100],l)),d7.K(a.h(0,"o"),new A.c(b,"o"),1,A.i([0],l)),c.F(b6,2),A.ab(j,i))
if(!a2){b8=A.i([],h)
new A.h0(b8).$1(r)
B.b.ai(b3,new A.Y(b8,g.a(new A.fZ()),f))
for(b9=0;b9<b8.length;++b9)b8[b9].a=new A.bl(b7,b9)}++d7.x
break
case"fl":case"st":case"gf":case"gs":d7.P(a,b,B.aN)
c=J.aA(a0)
c0=c.F(a0,"st")||c.F(a0,"gs")
if(c0)d7.y=!0
c1=c0?d7.eX(a.h(0,e0),new A.c(b,e0)):d8
c2=a.h(0,e2)
if(c2==null)c2=1
b3=J.aA(c2)
if(!b3.F(c2,1)&&!b3.F(c2,2))d7.j(new A.c(b,e2),"Fill rule")
c3=a.h(0,"lc")
if(c3==null)c3=1
c4=a.h(0,"lj")
if(c4==null)c4=1
if(!A.o(c3)||c3<1||c3>3||!A.o(c4)||c4<1||c4>3)d7.j(b,"Stroke cap/join")
c5=d7.K(a.h(0,"c"),new A.c(b,"c"),3,A.i([0,0,0],l))
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
c8&2&&A.h(c6)
c6[d0]=d1/255}}d3=d7.K(a.h(0,"o"),new A.c(b,"o"),1,A.i([100],l))
d4=d7.K(a.h(0,"w"),new A.c(b,"w"),1,A.i([1],l))
if(!a2){c7=A.aN(r,k)
b3=b3.F(c2,2)
c8=a.h(0,"ml")
if(c8==null)c8=4
c8=d7.T(c8,new A.c(b,"ml"))
B.b.m(q,A.jr(c7,c5,d3,d4,c0,b3,c3,c4,c8,c1,c.F(a0,"gf")||c.F(a0,"gs")?d7.fb(a,b):d8))}d7.x+=2
break
case"mm":d7.P(a,b,B.aX)
b6=a.h(0,"mm")
if(b6==null)b6=1
if(!A.o(b6)||b6<1||b6>5)d7.j(new A.c(b,"mm"),"Shape op mm mode "+A.w(b6))
if(!a2&&r.length!==0){d5=A.aN(new A.bR(r,o.a(new A.h_()),n),m)
if(d5.length===1)d6=b6===4||r.length>1
else d6=!1
B.b.l(r)
if(d5.length!==0)B.b.m(r,d6?B.b.gaf(d5):new A.aR(d5,b6))}else if(a2)B.b.l(r);++d7.x
break
default:d7.j(new A.c(b,"ty"),"Shape op "+A.w(a0))}}return A.jp(r,q,e==null?A.mR():e)},
eX(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.j(b,"Expected dash array")
s=A.i([],t.gC)
for(r=t.n,q=t.P,p=null,o=0;n=J.N(a),o<n.gk(a);++o){m=new A.c(b,o)
n=n.h(a,o)
if(!q.b(n))j.j(new A.c(b,o),"Expected object")
j.P(n,m,B.b2)
l=j.K(n.h(0,"v"),new A.c(m,"v"),1,A.i([0],r))
k=n.h(0,"n")
n=J.aA(k)
if(n.F(k,"o")){if(p!=null)j.j(m,"Duplicate dash offset")
p=l}else if(n.F(k,(s.length&1)===0?"d":"g"))B.b.m(s,l)
else j.j(new A.c(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.b.m(s,B.b.gad(s))
return A.kl(s,p==null?A.cg(A.i([0],r)):p)},
fb(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.av(0,a.h(0,"g"),new A.c(b,"g"))
k.P(s,new A.c(b,"g"),B.b5)
r=s.h(0,"p")
if(!A.o(r)||r<=0)k.j(new A.c(new A.c(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dC(s.h(0,"k"),new A.c(new A.c(b,"g"),"k"),-1,A.i([],q),new A.fY(k,r))
if(!J.m(a.h(0,"t"),1)&&!J.m(a.h(0,"t"),2))k.j(new A.c(b,"t"),"Gradient type")
o=k.b0(a.h(0,"s"),new A.c(b,"s"),2,A.i([0,0],q),!0)
n=k.b0(a.h(0,"e"),new A.c(b,"e"),2,A.i([0,0],q),!0)
m=J.m(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.K(a.h(0,"h"),new A.c(b,"h"),1,A.i([0],q))
return A.kn(r,p,o,n,m,l,a.h(0,"a")==null?null:k.K(a.h(0,"a"),new A.c(b,"a"),1,A.i([0],q)))},
bt(a,b,c,d,e,f,g){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return A.cg(d)
s=o.av(0,a,b)
o.P(s,b,B.H)
if(s.h(0,"a")!=null&&!J.m(s.h(0,"a"),0)&&!J.m(s.h(0,"a"),1))o.j(new A.c(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.m(s.h(0,"x"),""))o.j(new A.c(b,"x"),"Expressions")
r=new A.c(b,"k")
q=s.h(0,"k")
if(!J.m(s.h(0,"a"),1)){if(t.j.b(q)){p=J.N(q)
p=p.gcn(q)&&p.ga5(q) instanceof A.H&&J.ae(p.ga5(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p){p=o.bj(q,r,c,g,e,null,0,0)
return new A.B(p,null,!1,new Float32Array(0),!1)}if(!t.j.b(q)||J.iU(q))o.j(r,"Expected keyframes")
return o.eN(q,r,c,g,f,e)},
K(a,b,c,d){return this.bt(a,b,c,d,null,!1,0)},
b0(a,b,c,d,e){return this.bt(a,b,c,d,null,e,0)},
dC(a,b,c,d,e){return this.bt(a,b,c,d,e,!1,0)},
fJ(a,b,c,d,e){return this.bt(a,b,c,d,null,!1,e)},
dD(a,b,c,d){var s
A.j(c)
if(b==null)return new Float32Array(c)
if(c!==d){s=a.a
s.toString
this.j(s,"Morph topology/component count changes")}return b},
bj(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this
t.c.a(e)
if(e!=null)return e.$5(a,b,f,g,h)
if(f==null)s=new Float32Array(c)
else s=f
if(t.j.b(a)){r=J.N(a)
if(r.gk(a)<c)n.j(b,"Expected "+c+" components")
for(q=0;q<c;++q){p=g+q
o=n.bz(r.h(a,q),b,q)
s.$flags&2&&A.h(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gk(a)>2&&n.T(r.h(a,2),b)!==d)n.j(b,"Non-planar component")}else{if(c!==1)n.j(b,"Expected "+c+" components")
r=n.bz(a,b,0)
s.$flags&2&&A.h(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
eN(e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3=this,e4=null,e5="Expected object",e6=t.j
e6.a(e7)
t.c.a(f2)
s=J.b2(e7)
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
for(j=s.gB(e7),i=0,h=0,g=!1;j.q();){f=j.gA()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.m(f.h(0,"h"),1))++h
g=B.t.bG(g,f.h(0,"to")!=null)}j=h*(f1?8:4)
e=new Float64Array(j)
if(g)d=new Float32Array(m*4)
else d=e4
c=A.ek()
b=A.ek()
a=A.ek()
a0=A.ek()
for(a1=2*m,a2=m-1,a3=m+i,a4=e3.a.a,a5=e9===2,a6=m,a7=0,a8=0,a9=0;a9<s.gk(e7);++a9){b0=new A.c(e8,a9)
b1=s.h(e7,a9)
if(!q.b(b1))e3.j(b0,e5)
e3.P(b1,b0,B.aQ)
b2=b1.h(0,"to")
b3=b1.h(0,"ti")
b4=b2==null
b5=!b4
if(b5)e3.dK(b2,"to",e9,b0,d,a9*4)
b6=b3==null
if(!b6)e3.dK(b3,"ti",e9,b0,d,a9*4+2)
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
c0=e3.bj(b8,new A.c(b0,"s"),e9,f0,f2,e4,0,0)
if(b.b!==b)A.v(A.f9(""))
b.b=c0
if(a.b!==a)A.v(A.f9(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.v(A.f9(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.v(A.f9(""))
c.b=b4
b6=a.b
if(b6===a)A.v(A.al(""))
B.j.I(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.v(A.al(""))
if(typeof b4!=="number")return A.S(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.v(A.al(""))
b6=a.b
if(b6===a)A.v(A.al(""))
if(typeof b6!=="number")return A.S(b6)
J.jU(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.v(A.al(""))
b6=a.b
if(b6===a)A.v(A.al(""))
e3.bj(b8,new A.c(b0,"s"),e9,f0,f2,b4,c1,b6)}}c2=J.m(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.v(A.al(""))
if(typeof b4!=="number")return A.S(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.v(A.al(""))
b5=a.b
if(b5===a)A.v(A.al(""))
e3.bj(b9,new A.c(b0,"e"),e9,f0,f2,b4,c1,b5)
b4=m+a9
k.$flags&2&&A.h(k)
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=c1
c3=(c3|2)>>>0
a8=c1
a6=c4}else{b5=Math.min(a9+1,a2)
B.e.p(k,m+a9,b5*b4)}b4=a1+a9
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
c9=e3.bk(c5,b0)
d0=e3.bk(c6,b0)
d1=e3.bk(c7,b0)
d2=e3.bk(c8,b0)
d3=Math.max(Math.max(c9,d0),Math.max(d1,d2))
b1=!1
if(d3!==1){b4=a.b
if(b4===a)A.v(A.al(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e3.j(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e3.j(b0,"Easing component mismatch")
if(f1){b1=a.b
if(b1===a)A.v(A.al(""))}else{b1=a.b
if(b1===a)A.v(A.al(""))
b1=Math.min(A.l4(b1),1)}d4=Math.min(A.l4(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e6.b(c8),b4=e6.b(c7),b5=e6.b(c6),b6=e6.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.N(c5)
d6=d6.h(c5,d6.gk(c5)===1?0:d5)}else d6=c5
d7=B.c.C(A.eF(d6),0,1)
if(b5){d6=J.N(c6)
d6=d6.h(c6,d6.gk(c6)===1?0:d5)}else d6=c6
A.eF(d6)
if(b4){d8=J.N(c7)
d8=d8.h(c7,d8.gk(c7)===1?0:d5)}else d8=c7
d9=B.c.C(A.eF(d8),0,1)
if(b1){d8=J.N(c8)
d8=d8.h(c8,d8.gk(c8)===1?0:d5)}else d8=c8
A.eF(d8)
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
k[a9]=c3}if(m===1){e6=b.ap()
return new A.B(e6,e4,!1,new Float32Array(0),!1)}if(n){e6=a0.ap()
if(typeof e6!=="number")return A.S(e6)
c1=a2*e6
e6=e3.e
e6===$&&A.E()
if(!(a2>=0))return A.a(l,a2)
l[a2]=e6
e6=c.ap()
s=a.ap()
if(typeof s!=="number")return A.S(s)
J.jU(e6,c1,c1+s,c.ap(),a8)
if(!(a2<p))return A.a(k,a2)
k[a2]=8
s=m+a2
k.$flags&2&&A.h(k)
if(!(s>=0&&s<p))return A.a(k,s)
k[s]=c1
a2=a1+a2
if(!(a2>=0&&a2<p))return A.a(k,a2)
k[a2]=a7}e6=a.ap()
s=a0.ap()
q=c.ap()
if(a7===j)p=e
else{e1=e.BYTES_PER_ELEMENT
e2=A.b8(0,a7,B.a.a2(e.byteLength,e1))*e1
if(B.a.O(e2,8)!==0)A.v(A.aB("The number of bytes to view must be a multiple of 8",e4))
p=J.lD(B.h.gab(e),e.byteOffset+0*e1,B.a.J(e2,8))}p=A.m1(l,e6,s,k,q,p,d,a4)
return new A.B(e4,p,a4,new Float32Array(p.b),!1)},
dK(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.ak(a)<2)o.j(new A.c(d,b),"Invalid spatial tangent")
if(c!==2&&J.lB(a,new A.h4()))o.j(new A.c(d,b),"Spatial tangent on non-position")
s=J.N(a)
r=o.T(s.h(a,0),d)
q=o.T(s.h(a,1),d)
if(e!=null){e.$flags&2&&A.h(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=r
p=f+1
if(!(p<s))return A.a(e,p)
e[p]=q}},
bk(a,b){var s,r
if(!t.j.b(a)){this.T(a,b)
return 1}for(s=J.b2(a),r=s.gB(a);r.q();)this.T(r.gA(),b)
return s.gk(a)}}
A.h5.prototype={
$1(a){var s,r,q
t.D.a(a)
s=!1
if(a.gH()){r=this.a
q=r.d
q===$&&A.E()
if(a.c<=q){s=r.e
s===$&&A.E()
s=a.d>=s}}return s},
$S:35}
A.fW.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.c(new A.c(q.b,"ef"),a),o=q.a,n=o.av(0,J.ae(q.c,a),p)
o.P(n,p,B.G)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.m(s,r[a])||n.h(0,"v")==null)o.j(p,"Invalid effect parameter")
return o.K(n.h(0,"v"),new A.c(p,"v"),b,A.i([],t.n))},
$1(a){return this.$2$dimensions(a,1)},
$S:36}
A.fX.prototype={
$2(a,b){var s,r=this.b.$1(a)
if(r.a!=null){s=r.n(0)
if(0>=s.length)return A.a(s,0)
s=s[0]!==b}else s=!0
if(s)this.a.j(new A.c(new A.c(new A.c(this.c,"ef"),a),"v"),"Unsupported effect parameter value")},
$S:37}
A.fV.prototype={
$1(a){return J.m(J.ae(a,"ind"),this.a)},
$S:13}
A.h1.prototype={
$2(a,b){var s=this.a,r=this.c,q=s.K(this.b.h(0,a),new A.c(r,a),1,A.i([b],t.n))
if(q.a==null)s.j(new A.c(r,a),"Animated Inner Shadow")
s=q.n(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:39}
A.h2.prototype={
$5(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=t.j
if(e.b(a)){s=J.N(a)
s=s.gk(a)===1&&s.ga5(a) instanceof A.H}else s=!1
if(s)a=J.lG(a)
s=this.b
r=s.av(0,a,b)
s.P(r,b,B.aO)
q=r.h(0,"c")
if(!A.b1(q))s.j(new A.c(b,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.t.bG(p.c,q!==o)
o=b.a
n=o==null?null:o.b
if(A.o(n)){m=p.a
if(m==null){o=J.ak(e.a(J.ae(this.c,"k")))
m=p.a=new Uint8Array(o*2)}p=b.b==="e"?1:0
p=n*2+p
o=q?1:2
m.$flags&2&&A.h(m)
if(!(p>=0&&p<m.length))return A.a(m,p)
m[p]=o}l=r.h(0,"v")
k=r.h(0,"i")
j=r.h(0,"o")
p=!0
if(e.b(l))if(e.b(k))if(e.b(j)){e=J.N(l)
e=e.gk(l)!==J.ak(k)||e.gk(l)!==J.ak(j)}else e=p
else e=p
else e=p
if(e)s.j(b,"Invalid path topology")
e=J.N(l)
i=s.dD(b,c,e.gk(l)*6,a0)
h=new A.h3(s,b,i)
for(g=0;g<e.gk(l);++g){f=d+g*6
h.$2(e.h(l,g),f)
h.$2(J.ae(k,g),f+2)
h.$2(J.ae(j,g),f+4)}return i},
$S:14}
A.h3.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.ak(a)!==2)m.a.j(m.b,"Expected 2D path point")
s=m.c
r=m.a
q=J.N(a)
p=m.b
o=r.T(q.h(a,0),p)
s.$flags&2&&A.h(s)
n=s.length
if(!(b>=0&&b<n))return A.a(s,b)
s[b]=o
o=b+1
p=r.T(q.h(a,1),p)
if(!(o<n))return A.a(s,o)
s[o]=p},
$S:41}
A.h0.prototype={
$1(a){var s,r,q,p
t.cH.a(a)
for(s=a.length,r=this.a,q=0;q<a.length;a.length===s||(0,A.X)(a),++q){p=a[q]
if(p instanceof A.T)B.b.m(r,p)
if(p instanceof A.a5)this.$1(p.a)}},
$S:42}
A.fZ.prototype={
$1(a){return t.bD.a(a).a},
$S:43}
A.h_.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a5)||a.ge3()},
$S:1}
A.fY.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.N(a)
r=k.b*4
s=s.gk(a)<r||(s.gk(a)-r&1)===1}else s=!0
if(s)k.a.j(b,"Invalid gradient stops")
s=k.a
r=J.N(a)
q=s.dD(b,c,r.gk(a),e)
for(p=k.b,o=0;o<r.gk(a);++o){n=s.T(r.h(a,o),b)
if(o<p*4&&B.a.O(o,4)!==0){m=B.a.C(B.c.G(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.h(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:14}
A.h4.prototype={
$1(a){return!J.m(a,0)},
$S:13}
A.hb.prototype={
c8(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
t.ew.a(d)
t.ae.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.jP()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.o(n)?new A.c(p,n):new A.c(p,A.K(n))}if(this.fA(a,r,b,p,e==null?new A.bW(t.ao):e))return}for(q=a.gau(),q=q.gB(q),m=t.j;q.q();){l=q.gA()
k=a.h(0,l)
if(!s.b(k)&&!m.b(k))continue
B.b.m(d,l)
this.c8(k,b,c,d,e,l==="ks"&&J.m(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a))for(m=J.N(a),j=0;j<m.gk(a);++j){k=m.h(a,j)
if(!s.b(k)&&!q.b(k))continue
B.b.m(d,j)
this.dI(k,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
fK(a,b,c,d){return this.c8(a,b,c,d,null,!1)},
dI(a,b,c,d,e){return this.c8(a,b,c,d,e,!1)},
fA(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null
t.P.a(a0)
t.bC.a(a4)
if(!a4.m(0,a0))b.a.j(a3,"Cyclic expression reference")
try{i=$.lu()
if(i.b.test(a1)){a0.E(0,"x")
return!0}s=new A.c(a3,"x")
r=$.ls().e0(a1)
if(r==null)b.a.j(s,"Unsupported expression syntax")
q=a2
p=null
i=$.jQ()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dL(0,h)
h=new A.ch(h.a,h.b,h.c)
i=t.j
g=t.d
f=b.a
while(h.q()){e=h.d
o=e==null?g.a(e):e
d=o.b
if(1>=d.length)return A.a(d,1)
d=d[1]
d.toString
n=d
d=$.lt()
c=A.K(n)
m=d.b.test(c)?B.y.dX('"'+A.w(n)+'"',a):n
p=b.c6(q,"nm",A.K(m))
if(p==null)f.j(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.B)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=b.c6(q,"ty","tr")
l=i==null?a:i.h(0,"s")
break
case"transform.rotation":i=b.c6(q,"ty","tr")
l=i==null?a:i.h(0,"r")
break
default:i=p
l=i==null?a:J.ae(i,"o")
break}k=l
j=f.av(0,k,s)
if(j===a0){a0.E(0,"x")
return!0}b.dI(j,a2,s,A.i([],t.f),a4)
a0.l(0)
a0.ai(0,j)
return!1}finally{a4.E(0,a0)}},
c6(a,b,c){var s,r,q,p
for(s=J.cx(a),r=t.P,q=null;s.q();){p=s.gA()
if(!r.b(p)||!J.m(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q}}
A.hU.prototype={
cz(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.av(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.ae(j,"x")
s=typeof n=="string"?$.jP().e0(n):null
if(s==null){k=k.de(j,b)
i.p(0,j,k)
return k}r=new A.c(b,"x")
k.P(j,b,B.H)
if(J.ae(j,"a")!=null&&!J.m(J.ae(j,"a"),0)&&!J.m(J.ae(j,"a"),1))k.j(new A.c(b,"a"),"Invalid animated flag")
m=l.d
if(!m.m(0,j))k.j(r,"Cyclic path reference")
try{q=null
p=null
o=l.fI(s,r)
q=o.a
p=o.b
k=l.cz(q,p)
i.p(0,j,k)
return k}finally{m.E(0,j)}},
fI(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.d7(j.b,s,B.n,b,"layer")
q=r.a
if(!J.m(q.h(0,"ty"),4))j.a.j(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.c(r.b,"shapes")
s=$.jQ()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dL(0,i)
i=new A.ch(i.a,i.b,i.c)
s=t.d
while(i.q()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.d7(p,m,o,b,"content")
q=l.a
o=l.b
p=J.m(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.c(o,"it")}k=q.h(0,"ks")
if(!J.m(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.j(b,"Path reference needs a B\xe9zier path")
return new A.z(k,new A.c(o,"ks"))},
d7(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.N(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gk(a);++m){l=s.h(a,m)
if(r.b(l)&&J.m(l.h(0,"nm"),b)){if(o!=null)q.j(d,p)
n=m
o=l}}if(o!=null)return new A.z(o,new A.c(c,n))}this.a.j(d,"Missing "+e+" reference: "+b)}}
A.ep.prototype={
a0(a,b,c){var s
A.o5(c,t.K,"T","_copy")
s=c.a(this.b.e9(c.a(a),c.i("0()").a(b)))
return s},
D(a){var s=t.A
s.a(a)
if(a.a!=null)return a
return this.a0(a,new A.hq(a),s)},
ed(a){return this.a0(a,new A.hr(this,a),t.d1)},
cE(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.a5)return s.bF(a)
if(a instanceof A.T)return s.a0(a,new A.hk(s,a),r)
if(a instanceof A.bl)return s.a0(a,new A.hl(s,a),r)
if(a instanceof A.aR)return s.a0(a,new A.hm(s,a),r)
if(a instanceof A.ax)return s.a0(a,new A.hn(s,a),r)
if(a instanceof A.aT)return s.a0(a,new A.ho(s,a),r)
if(a instanceof A.b_)return s.a0(a,new A.hp(s,a),r)
throw A.e(A.aE("Unknown compiled geometry"))},
h3(a){var s=t.G
s.a(a)
if(a instanceof A.a5)return this.bF(a)
if(a instanceof A.bk)return this.a0(a,new A.he(this,a),s)
throw A.e(A.aE("Unknown compiled paint"))},
bF(a){return this.a0(a,new A.hg(this,a),t.eV)},
ej(a){return this.a0(a,new A.hf(this,a),t.I)},
hB(a,b){return this.a0(b,new A.hs(this,b),t.e_)},
fS(a){return this.a0(a,new A.hd(this,a),t.bo)},
ho(a){var s=t.J
s.a(a)
return this.a0(a,new A.hi(this,a),s)},
cp(a){var s=t.D
s.a(a)
return this.a0(a,new A.hh(this,a),s)},
cB(a){return this.a0(a,new A.hj(this,a),t.E)}}
A.hq.prototype={
$0(){var s=this.a
return new A.B(s.a,s.b,s.c,new Float32Array(s.d.length),s.f)},
$S:50}
A.hr.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.D(o.a),m=p.D(o.b),l=p.D(o.c),k=p.D(o.d),j=p.D(o.e),i=o.f
i=i==null?q:p.D(i)
s=o.r
s=s==null?q:p.D(s)
r=o.w
r=r==null?q:p.D(r)
o=o.x
return A.js(n,m,l,k,j,i,s,r,o==null?q:p.D(o))},
$S:51}
A.hk.prototype={
$0(){return new A.T(this.a.cE(this.b.a))},
$S:52}
A.hl.prototype={
$0(){var s=this.b
return new A.bl(this.a.hB(0,s.a),s.b)},
$S:53}
A.hm.prototype={
$0(){var s=this.b,r=s.a,q=A.a_(r),p=q.i("Y<1,A>")
r=A.aN(new A.Y(r,q.i("A(1)").a(this.a.gb9()),p),p.i("a4.E"))
return A.mG(r,s.b)},
$S:54}
A.hn.prototype={
$0(){var s=this.b
return new A.ax(this.a.D(s.e),s.f,s.r)},
$S:55}
A.ho.prototype={
$0(){var s=this.b,r=this.a
return new A.aT(s.e,s.f,r.D(s.r),r.D(s.w),r.D(s.x))},
$S:84}
A.hp.prototype={
$0(){var s,r=this.b,q=this.a,p=q.D(r.r),o=q.D(r.w),n=q.D(r.x),m=q.D(r.y),l=q.D(r.z),k=r.Q
k=k==null?null:q.D(k)
s=r.as
q=s==null?null:q.D(s)
return new A.b_(r.e,r.f,p,o,n,m,l,k,q)},
$S:57}
A.he.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a_(o),l=m.i("Y<1,A>")
o=A.aN(new A.Y(o,m.i("A(1)").a(n.gb9()),l),l.i("a4.E"))
m=n.D(p.b)
l=n.D(p.c)
s=n.D(p.d)
r=p.y
r=r==null?null:n.ej(r)
q=p.z
n=q==null?null:n.fS(q)
return A.jr(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:58}
A.hg.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a_(q),n=o.i("Y<1,A>")
q=A.aN(new A.Y(q,o.i("A(1)").a(p.gb9()),n),n.i("a4.E"))
o=r.b
n=A.a_(o)
s=n.i("Y<1,aH>")
o=A.aN(new A.Y(o,n.i("aH(1)").a(p.gh2()),s),s.i("a4.E"))
return A.jp(q,o,p.ed(r.c))},
$S:59}
A.hf.prototype={
$0(){var s,r=this.b,q=this.a,p=q.D(r.c),o=q.D(r.d),n=q.D(r.e),m=r.f
m=m==null?null:q.D(m)
s=r.r
q=s==null?null:q.D(s)
return A.kn(r.a,p,o,n,r.w,m,q)},
$S:60}
A.hs.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a_(r),o=p.i("Y<1,A>")
r=A.aN(new A.Y(r,p.i("A(1)").a(q.gb9()),o),o.i("a4.E"))
return A.mS(r,q.D(s.b),q.D(s.c),q.D(s.d),s.e)},
$S:61}
A.hd.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a_(r),o=p.i("Y<1,B>")
r=A.aN(new A.Y(r,p.i("B(1)").a(q.ghA()),o),o.i("a4.E"))
return A.kl(r,q.D(s.b))},
$S:62}
A.hi.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.D(q.e),o=s.D(r.c),n=r.e
s=n==null?null:s.D(n)
return A.mF(new A.ax(p,q.f,q.r),r.b,o,r.d,s)},
$S:63}
A.hh.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.ed(l.a),j=l.b
j=j==null?n:m.bF(j)
s=l.f
s=s==null?n:m.cB(s)
r=l.x
r=r==null?n:m.D(r)
q=l.z
if(q==null)q=n
else{p=A.a_(q)
o=p.i("Y<1,a7>")
q=A.aN(new A.Y(q,p.i("a7(1)").a(m.ghn()),o),o.i("a4.E"))}p=l.at
p=p==null?n:new A.eo(m.D(p.a),m.D(p.b))
o=l.as
o=o==null?n:A.ko(o.a,o.b,o.c)
r=A.kp(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.cp(k)
r.ch=l.ch
return r},
$S:64}
A.hj.prototype={
$0(){var s,r,q,p,o=this.b,n=A.jn(o.a),m=o.b
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
r=A.a_(o)
B.b.ai(m,new A.Y(o,r.i("a6(1)").a(s.ghk()),r.i("Y<1,a6>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.cp(p)}}return n},
$S:65}
A.bh.prototype={
ghe(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.n(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
h9(a,b,c){var s,r,q,p,o=this.f
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
return new A.z(Math.cos(p)*r,Math.sin(p)*r)},
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
return q+(a[o]-q)*m}}return B.j.gad(a)}}
A.T.prototype={
gH(){return this.a.gH()},
ga6(){return this.a.ga6()},
a8(a){return this.a.a8(a)},
$iA:1}
A.bl.prototype={
gH(){return this.a.gH()},
ga6(){return this.a.gH()},
a8(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].a8(a)},
$iA:1}
A.bD.prototype={
gH(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.b.ac(r.a,new A.i0())
r.f!==$&&A.Q()
q=r.f=s}return q}}
A.i0.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.cl.prototype={
gH(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.b.ac(r.a,new A.h6())
r.e!==$&&A.Q()
q=r.e=s}return q}}
A.h6.prototype={
$1(a){return t.A.a(a).a!=null},
$S:66}
A.c_.prototype={
gd6(){var s=this.y
if(s==null){s=new Float64Array(16)
s[10]=1
s[15]=1
this.y=s}return s},
gaQ(){var s,r,q=this,p=null,o=q.at
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
gco(){var s,r=this,q=r.ax
if(q===$){s=A.jt(r.c,100,100)&&A.eB(r.d,0)&&A.eB(r.w,0)
r.ax!==$&&A.Q()
q=r.ax=s}return q},
gaD(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gco())if(A.jt(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.jt(q.b,0,0)
else r=A.eB(r,0)&&A.eB(q.r,0)
s=r}q.ay!==$&&A.Q()
p=q.ay=s}return p},
gH(){var s,r=this,q=r.ch
if(q===$){s=r.gaQ()&&r.e.a!=null
r.ch!==$&&A.Q()
q=r.ch=s}return q},
gcl(){var s,r=this,q=r.CW
if(q===$){s=A.eB(r.e,100)
r.CW!==$&&A.Q()
r.CW=s
q=s}return q},
cZ(a){var s,r,q,p,o=this
if(o.as!==a)s=o.gaQ()&&!isNaN(o.as)
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
e6(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gaQ()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gd6()
a4.as=a6
r=a4.gd6()
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
r.$flags&2&&A.h(r)
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
ct(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaD())return a
if(b.gco()){b.cZ(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.au(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.e6(a0)
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
return new A.au(f-d,e-c,f+d,e+c)}}
A.a7.prototype={
gH(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gca(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.hJ.prototype={
aO(a){var s=this.c
return 255-A.aw((255-(B.a.dn(s,a)&255))*(s>>>24))}}
A.eo.prototype={
fN(a){var s,r,q,p=this.a.n(a),o=new A.hc(),n=this.b.n(a)
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
if(typeof o!=="number")return A.S(o)
return(n<<24|r<<16|q<<8|o)>>>0}}
A.hc.prototype={
$1(a){return B.c.G(B.c.C(a,0,1)*255)},
$S:67}
A.a6.prototype={
gH(){var s,r,q=this,p=null,o=q.db
if(o===$){s=!1
if(q.a.gH()){r=q.x
r=r==null?p:r.a!=null
if(r!==!1){r=q.b
r=r==null?p:r.gH()
if(r!==!1){r=q.f
r=r==null?p:r.gH()
if(r!==!1){r=q.at
if(r==null)r=p
else r=r.a.a!=null&&r.b.a!=null
if(r!==!1){r=q.cy
r=r==null?p:r.gH()
if(r!==!1){r=q.z
r=r==null?p:B.b.ac(r,new A.hO())
r=r!==!1}else r=s}else r=s}else r=s}else r=s
s=r}}q.db!==$&&A.Q()
o=q.db=s}return o},
ghc(){var s,r=this,q=r.dx
if(q===$){s=r.z
s=s==null?null:B.b.aq(s,new A.hM())
r.dx!==$&&A.Q()
q=r.dx=s===!0}return q},
ghf(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.b.ac(s,new A.hN())
r.dy!==$&&A.Q()
q=r.dy=s===!0}return q},
ge4(){var s,r,q=this,p=q.fx
if(p===$){if(q.a.gaQ()){s=q.cy
s=s==null?null:s.ge4()
r=s!==!1}else r=!1
q.fx!==$&&A.Q()
p=q.fx=r}return p},
ge2(){var s,r,q=this,p=q.fy
if(p===$){if(q.a.gaD()){s=q.cy
s=s==null?null:s.ge2()
r=s===!0}else r=!0
q.fy!==$&&A.Q()
p=q.fy=r}return p},
az(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null
if(!h.eg(a))return g
s=h.f
r=s==null
if(r&&h.gH()&&!isNaN(h.id))return h.go
if(h.id===a)return h.go
h.id=a
q=h.b
p=q==null?g:q.b1(a)
if(!r){r=h.x
if(r!=null){r=r.n(a)
if(0>=r.length)return A.a(r,0)
r=r[0]
q=s.f
q===$&&A.E()
o=s.d
o===$&&A.E()
n=r*q-o}else n=(a-h.r)/h.w
p=A.c2(p,s.az(n))}if(p==null)return h.go=null
s=h.z
if(s!=null)r=s.length===1&&B.b.gaf(s).gca()||B.b.ac(s,new A.hP())
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
j=new A.au(r.a-q,r.b-q,r.c+q,r.d+q)}if(j!=null)m=A.c2(m,j)}}if(m!=null){p=p.by(m)
if(p.gS(0))return h.go=null}}for(i=h;i!=null;i=i.cy)p=i.a.ct(p,a)
return h.go=p},
eg(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
hl(a,b){var s=this.a.e.n(a)
if(0>=s.length)return A.a(s,0)
return B.a.C(B.c.Y(b*B.c.G(s[0])/100),0,255)},
aS(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gca()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.n(a)
if(0>=q.length)return A.a(q,0)
return B.a.C(B.c.G(q[0]*255/100),0,255)}return 255}}
A.hO.prototype={
$1(a){return t.J.a(a).gH()},
$S:2}
A.hM.prototype={
$1(a){return t.J.a(a).b!=="n"},
$S:2}
A.hN.prototype={
$1(a){t.J.a(a)
return a.b==="n"||a.gH()},
$S:2}
A.hP.prototype={
$1(a){t.J.a(a)
return a.b==="a"&&!a.d},
$S:2}
A.a5.prototype={
ge3(){var s,r=this,q=r.d
if(q===$){s=B.b.aq(r.a,new A.hF())
r.d!==$&&A.Q()
r.d=s
q=s}return q},
gb8(){var s,r=this,q=r.e
if(q===$){s=r.f7()
r.e!==$&&A.Q()
r.e=s
q=s}return q},
f7(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.b.gaf(n)
if(s instanceof A.a5){r=s.c
r=r.gaD()&&r.gcl()}else r=!1
return r?s.gb8():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.a5){r=o.c
r=r.gaD()&&r.gcl()}else r=!1
if(r){if(q==null)q=B.b.es(n,0,p)
B.b.ai(q,o.gb8())}else if(q!=null)B.b.m(q,o)}return q==null?n:q},
gcD(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gb8()
r=null
if(!(s.length!==1)){q=B.b.gaf(s)
A:{if(q instanceof A.bk){s=q
break A}if(q instanceof A.a5){s=q.gcD()
break A}s=r
break A}r=s}p.f!==$&&A.Q()
o=p.f=r}return o},
gH(){var s,r=this,q=r.ax
if(q===$){s=r.c.gH()&&B.b.ac(r.a,new A.hH())&&B.b.ac(r.b,new A.hI())
r.ax!==$&&A.Q()
q=r.ax=s}return q},
ga6(){var s,r=this,q=r.ay
if(q===$){s=r.c.gaQ()&&B.b.ac(r.a,new A.hG())
r.ay!==$&&A.Q()
q=r.ay=s}return q},
a8(a){var s,r,q,p,o=this
if(o.ga6()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.X)(s),++p)q=A.c2(q,s[p].a8(a))
if(q==null)return o.z=null
return o.z=o.c.ct(q,a)},
b1(a){var s,r,q,p,o,n=this
if(n.gH()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.n(a)
if(0>=r.length)return A.a(r,0)
if(B.c.G(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.X)(r),++o)p=A.c2(p,r[o].b1(a))
if(p==null)return n.Q=null
return n.Q=s.ct(p,a)},
$iaH:1,
$iA:1}
A.hF.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a5)||a.ge3()},
$S:1}
A.hH.prototype={
$1(a){return t.u.a(a).gH()},
$S:1}
A.hI.prototype={
$1(a){return t.G.a(a).gH()},
$S:69}
A.hG.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.aR.prototype={
gH(){var s,r=this,q=r.d
if(q===$){s=B.b.ac(r.a,new A.hR())
r.d!==$&&A.Q()
r.d=s
q=s}return q},
ga6(){var s,r=this,q=r.e
if(q===$){s=B.b.ac(r.a,new A.hQ())
r.e!==$&&A.Q()
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
for(o=j,n=0;n<s.length-1;++n)o=A.c2(o,s[n].a8(a))
if(o==null)return k.w=null
m=p.by(o)
return k.w=m.gS(0)?j:m}if(q===3)--r
for(l=j,n=0;n<r;++n){if(!(n<s.length))return A.a(s,n)
l=A.c2(l,s[n].a8(a))}return k.w=l},
$iA:1}
A.hR.prototype={
$1(a){return t.u.a(a).gH()},
$S:1}
A.hQ.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.er.prototype={
ga6(){return this.gH()},
a8(a){var s=this
if(s.gH()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.ce(a)},
$iA:1}
A.ax.prototype={
gH(){return this.e.a!=null},
ce(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.n(a),f=g.length
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
if(h>q)q=h}return new A.au(s,r,p,q)}}
A.aT.prototype={
gH(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
ce(a){var s,r,q,p=this.r.n(a),o=this.w.n(a),n=o.length
if(0>=n)return A.a(o,0)
s=Math.abs(o[0]*0.5)
if(1>=n)return A.a(o,1)
r=Math.abs(o[1]*0.5)
n=p.length
if(0>=n)return A.a(p,0)
q=p[0]
if(1>=n)return A.a(p,1)
n=p[1]
return new A.au(q-s,n-r,q+s,n+r)}}
A.b_.prototype={
gH(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
ce(a){var s,r,q,p=this,o=p.w.n(a),n=p.y.n(a)
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
return new A.au(s-r,n-r,s+r,n+r)},
f8(d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=this,d4=t.bp
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
a5=B.c.V(l)*2
for(d4=Math.abs(c)<=0.0001,a6=a1!==0,a7=a5-2,a8=h*e/2,a9=a5-1,b0=Math.abs(b)<=0.0001,b1=!1,b2=0;b2<a5;++b2,a4=b3,a0=b6,a=b5,a3=b8,a2=b7){b3=b1?o:k
b4=a6&&b2===a7?a8:g
if(a6&&b2===a9)b3=a1
b5=Math.sin(i)
b6=Math.cos(i)
b7=r+b3*b6
b8=q+b3*b5
if(d4&&b0)d7.$2(b7,b8)
else{b9=A.il(a,a0,a4)
c0=A.il(b5,b6,b3)
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
b1=!b1}d9.$0()}else{l=Math.max(1,B.c.R(m))
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
if(d4){d1=A.il(a,a0,o)
d2=A.il(b5,b6,o)
d8.$8(a2-d*d1.a,a3-d*d1.b,b7+d*d2.a,b8+d*d2.b,b7,b8,a2,a3)}else d7.$2(b7,b8)
i+=h}d9.$0()}}}
A.bk.prototype={
gc5(){var s,r=this,q=r.fr
if(q===$){s=B.b.ac(r.a,new A.hY())
r.fr!==$&&A.Q()
r.fr=s
q=s}return q},
fB(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.b.gaf(r.a)
while(s instanceof A.T)s=s.a
if((s instanceof A.aT||s instanceof A.ax||s instanceof A.b_)&&s.gH())return s
return null},
d_(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.X)(s),++p)q=A.c2(q,s[p].a8(a))
return q},
gH(){var s,r,q,p=this,o=null,n=!1
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
n=n==null?o:n.gH()
n=n!==!1}}return n},
b1(a){var s,r,q,p,o,n,m=this,l=m.c.n(a)
if(0>=l.length)return A.a(l,0)
if(B.c.G(l[0])<=0)return null
if(m.e){l=m.d.n(a)
if(0>=l.length)return A.a(l,0)
s=l[0]
if(s<=0)return null
r=m.w===1?Math.max(1.42,m.x):1.42
q=s*0.5*r+1}else q=0
if(m.gc5()){p=m.fy
if(p===$){o=m.d_(0)
m.fy!==$&&A.Q()
m.fy=o
p=o}n=p}else n=m.d_(a)
if(n==null)return null
return q===0?n:n.hg(q)},
$iaH:1}
A.hY.prototype={
$1(a){return t.u.a(a).ga6()},
$S:1}
A.br.prototype={
aH(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
Z(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
ag(){return this.Z(!1)}}
A.ah.prototype={
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
dY(a){while(this.a.length<a)this.d4()},
d4(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.h.I(o,0,r.f,q)
s=new Float64Array(p)
B.h.I(s,0,r.f,r.b)
r.a=o
r.b=s},
ci(a){while(this.c.length<a)this.d3()},
d3(){var s=this,r=s.c,q=r.length*2,p=new Int32Array(q)
B.e.I(p,0,s.r,r)
s.c=p
r=new Int32Array(q)
B.e.I(r,0,s.r,s.d)
s.d=r
r=new Uint8Array(q)
B.d.I(r,0,s.r,s.e)
s.e=r},
a4(a){var s,r,q,p=this
if(p.x)p.a1()
p.x=!0
p.w=p.f
if(p.r===p.c.length)p.d3()
s=p.c
r=p.r
q=p.w
s.$flags&2&&A.h(s)
if(!(r<s.length))return A.a(s,r)
s[r]=q
q=p.e
s=a?1:0
q.$flags&2&&A.h(q)
if(!(r<q.length))return A.a(q,r)
q[r]=s},
u(a,b){var s,r,q,p=this,o=p.f
if(o>p.w){s=p.a
r=o-1
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
s=p.b
if(!(r<s.length))return A.a(s,r)
if(Math.abs(a-q)+Math.abs(b-s[r])<1e-7)return}if(o===p.a.length)p.d4()
o=p.a
s=p.f
o.$flags&2&&A.h(o)
if(!(s>=0&&s<o.length))return A.a(o,s)
o[s]=a
o=p.b
o.$flags&2&&A.h(o)
if(!(s<o.length))return A.a(o,s)
o[s]=b
p.f=s+1},
c9(a,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(a8>=10){b.u(a5,a6)
return}s=a1-(2*a+a5)/3
r=a2-(2*a0+a6)/3
q=a3-(a+2*a5)/3
p=a4-(a0+2*a6)/3
if(Math.max(s*s+r*r,q*q+p*p)*0.5625<=a7){b.u(a5,a6)
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
b.c9(a,a0,o,n,i,h,e,d,a7,c)
b.c9(e,d,g,f,k,j,a5,a6,a7,c)},
U(a,b,c,d,e,f,g,h,i){return this.c9(a,b,c,d,e,f,g,h,i,0)},
a1(){var s,r,q,p,o,n,m,l,k,j,i=this
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
s.$flags&2&&A.h(s)
if(!(p<s.length))return A.a(s,p)
s[p]=r
i.r=p+1},
aF(a9,b0,b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=this,a8=a9.r
if(a8===0||a9.f===0)return
a7.dY(a7.f+a9.f)
a7.ci(a7.r+a8)
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
B.h.M(s,a,a0,q,d)
B.h.M(r,a,a0,p,d)
a=a0}else if(l)for(a1=s.$flags|0,a2=r.$flags|0,a3=d;a3<c;++a3){if(!(a3>=0&&a3<j))return A.a(q,a3)
a4=q[a3]
a1&2&&A.h(s)
if(!(a>=0&&a<s.length))return A.a(s,a)
s[a]=b0*a4+b4
if(!(a3<i))return A.a(p,a3)
a4=p[a3]
a2&2&&A.h(r)
if(!(a<r.length))return A.a(r,a)
r[a]=b3*a4+b5;++a}else for(a1=s.$flags|0,a2=r.$flags|0,a3=d;a3<c;++a3){if(!(a3>=0&&a3<j))return A.a(q,a3)
a5=q[a3]
if(!(a3<i))return A.a(p,a3)
a6=p[a3]
a1&2&&A.h(s)
if(!(a>=0&&a<s.length))return A.a(s,a)
s[a]=b0*a5+b2*a6+b4
a2&2&&A.h(r)
if(!(a<r.length))return A.a(r,a)
r[a]=b1*a5+b3*a6+b5;++a}a7.f=a
a7.a1()}},
fM(a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=a3.r
if(a2===0||a3.f===0)return
a1.dY(a1.f+a3.f)
a1.ci(a1.r+a2)
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
b&2&&A.h(s)
if(!(d>=0&&d<s.length))return A.a(s,d)
s[d]=a0
if(!(c<k))return A.a(p,c)
a0=p[c]
a&2&&A.h(r)
if(!(d<r.length))return A.a(r,d)
r[d]=a0;++d}a1.f=d
a1.a1()}}}
A.aD.prototype={
l(a){var s=this
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
Z(a){var s
this.l(0)
s=a?1024:16384
if(this.a.gv().length>s*2)this.a.aw(2048,0)},
ag(){return this.Z(!1)},
dW(a){var s=this,r=a.b*2
if(s.a.gv().length<r)s.a.aw(r,0)
B.e.I(s.a.gv(),0,r,a.a.gv())
s.b=a.b
s.c=a.c
s.d=a.d
s.e=a.e
s.f=a.f},
aN(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
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
if((n&65535)+k===b){r.$flags&2&&A.h(r)
r[m]=(k+c<<8|s)>>>0
j=b+c
if(j>f.e)f.e=j
return!1}}}}i=q*2
h=i+2>r.length
if(h){q=f.a
q.aw(q.gv().length*2,f.b*2)}g=f.a.gv()
g.$flags&2&&A.h(g)
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
em(a){var s,r,q,p,o,n,m,l,k,j,i=this
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
p&2&&A.h(s)
if(!(o<q))return A.a(s,o)
s[o]=m
o=j+1
s.$flags&2&&A.h(s)
if(!(j<q))return A.a(s,j)
s[j]=(l&4294967040|k-1)>>>0}i.b=B.a.J(o,2)}}
A.eY.prototype={
aM(a){if(!isFinite(a))return 0
if(a>1048576)a=1048576
return B.c.G((a<-1048576?-1048576:a)*256)},
hr(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
c.l(0)
if(a0>=a2||a1>=a3||a.r===0)return
s=d.b
r=s.length
if(a3>r){q=Math.max(a3,r*2)
s=new Int32Array(q)
B.e.N(s,0,q,-1)
d.b=s}else{p=d.ch
o=d.ay
if(p>=o){n=Math.max(0,o)
m=Math.min(r,p+1)
if(m>n)B.e.N(s,n,m,-1)}}d.w=a0
d.x=a1
d.y=a2
d.z=a3
d.Q=a0*256
d.as=a1*256
d.at=a2*256
d.ax=a3*256
d.ay=a3
d.ch=a1-1
d.r=0
d.fr=!1
l=d.cx=d.CW=0
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
d.CW=d.aM(g)
d.cx=d.aM(f)
for(e=i+1;e<h;++e){if(!(e<s))return A.a(k,e)
p=k[e]
if(!(e<r))return A.a(j,e)
o=j[e]
d.di(d.aM(p),d.aM(o))}d.di(d.aM(g),d.aM(f))}d.ew(b,c)},
bT(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(!d.fr)return
d.fr=!1
s=d.dx
r=d.dy
q=s===0
if(q&&r===0)return
p=d.db
if(p<d.x||p>=d.z)return
o=d.cy
n=d.w
if(o<n){if(q)return
o=n
m=0}else{if(o>=d.y)return
m=r}if(p<d.ay)d.ay=p
if(p>d.ch)d.ch=p
q=d.b
if(!(p>=0&&p<q.length))return A.a(q,p)
l=q[p]
for(q=d.f,k=q.length,j=d.c,i=j.length,h=-1;l!==-1;h=l,l=f){if(!(l>=0&&l<i))return A.a(j,l)
g=j[l]
if(g===o){q=d.d
if(!(l<q.length))return A.a(q,l)
k=q[l]
q.$flags&2&&A.h(q)
q[l]=k+s
k=d.e
if(!(l<k.length))return A.a(k,l)
q=k[l]
k.$flags&2&&A.h(k)
k[l]=q+m
return}if(g>o)break
if(!(l<k))return A.a(q,l)
f=q[l]}q=d.r
if(q===i){e=i*2
k=new Int32Array(e)
B.e.I(k,0,q,j)
d.c=k
q=new Int32Array(e)
B.e.I(q,0,d.r,d.d)
d.d=q
q=new Int32Array(e)
B.e.I(q,0,d.r,d.e)
d.e=q
q=new Int32Array(e)
B.e.I(q,0,d.r,d.f)
d.f=q}q=d.r++
k=d.c
k.$flags&2&&A.h(k)
if(!(q<k.length))return A.a(k,q)
k[q]=o
k=d.d
k.$flags&2&&A.h(k)
if(!(q<k.length))return A.a(k,q)
k[q]=s
k=d.e
k.$flags&2&&A.h(k)
if(!(q<k.length))return A.a(k,q)
k[q]=m
k=d.f
k.$flags&2&&A.h(k)
j=k.length
if(!(q<j))return A.a(k,q)
k[q]=l
if(h===-1){k=d.b
k.$flags&2&&A.h(k)
if(!(p<k.length))return A.a(k,p)
k[p]=q}else{if(!(h>=0&&h<j))return A.a(k,h)
k[h]=q}},
dk(a,b){var s=this
if(s.fr){if(s.cy===a&&s.db===b)return
s.bT()}s.cy=a
s.db=b
s.dy=s.dx=0
s.fr=!0},
aC(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.w
if(b<s){r.dk(s,a)
r.dx+=e
return}if(b>=r.y)return
r.dk(b,a)
r.dx+=e
r.dy=r.dy+(c+d)*e},
aE(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.x||a>=g.z)return
s=B.a.b6(B.a.L(b,8),32)
r=B.a.b6(B.a.L(d,8),32)
q=s*256
p=r*256
if(s===r){g.aC(a,s,b-q,d-q,f)
return}o=d-b
n=b-q
if(d>b){m=g.w
if(s<m){if(r<m){g.aC(a,m,0,0,f)
return}l=c+B.a.a2((g.Q-b)*f,o)
g.aC(a,m,0,0,l-c)
s=g.w
k=l
n=0}else k=c
for(;;){if(!(s<r&&s<g.y))break
j=s+1
i=c+B.a.a2((j*256-b)*f,o)
g.aC(a,s,n,256,i-k)
k=i
s=j
n=0}if(s<g.y)g.aC(a,s,n,d-p,e-k)}else{m=g.y
if(s>=m){if(r>=m)return
l=c+B.a.a2((g.at-b)*f,o)
s=m-1
k=l
n=256}else k=c
for(;;){if(!(s>r&&s>=g.w))break
i=c+B.a.a2((s*256-b)*f,o)
g.aC(a,s,n,0,i-k);--s
k=i
n=256}m=g.w
h=e-k
if(s<m)g.aC(a,m,0,0,h)
else g.aC(a,s,n,d-p,h)}},
di(a,b){this.fw(a,b)
return},
fw(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.CW,b=d.cx
d.CW=a
d.cx=a0
s=a0-b
if(s===0)return
r=B.a.b6(B.a.L(b,8),32)
q=B.a.b6(B.a.L(a0,8),32)
p=d.x
o=r<p
if(o&&q<p)return
n=d.z
m=r>=n
if(m&&q>=n)return
if(r===q){l=r*256
d.aE(r,c,b-l,a,a0-l)
return}k=a-c
if(s>0){if(o){j=d.as
i=c+B.a.a2((j-b)*k,s)
r=p}else{j=b
i=c}for(;;){if(!(r<q&&r<d.z))break
p=r+1
h=p*256
g=c+B.a.a2((h-b)*k,s)
d.aE(r,i,j-r*256,g,256)
j=h
i=g
r=p}if(r<d.z){o=r*256
d.aE(r,i,j-o,a,a0-o)}}else{if(m){j=d.ax
i=c+B.a.a2((j-b)*k,s)
r=n-1}else{j=b
i=c}if(r===q){if(r>=p){l=r*256
d.aE(r,i,j-l,a,a0-l)}return}f=r*256
e=c+B.a.a2((f-b)*k,s)
if(r>=p)d.aE(r,i,j-f,e,0);--r
i=e
for(;;){if(!(r>q&&r>=d.x))break
g=c+B.a.a2((r*256-b)*k,s)
d.aE(r,i,256,g,0);--r
i=g}if(r>=d.x)d.aE(r,i,256,a,a0-r*256)}},
ew(a,b){this.fH(a,b)
return},
fH(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.bT()
s=i.ch
r=i.ay
if(s<r)return
q=Math.max(i.x,r)
p=Math.min(i.z-1,s)
for(o=q;o<=p;++o){s=i.b
if(!(o>=0&&o<s.length))return A.a(s,o)
n=s[o]
s.$flags&2&&A.h(s)
s[o]=-1
if(n===-1)continue
m=i.w
for(l=0;n!==-1;){s=i.c
if(!(n>=0&&n<s.length))return A.a(s,n)
k=s[n]
if(k>m&&l!==0){j=A.iZ(l*512,a)
if(j>0)b.aN(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.iZ(l*512-s[n],a)
if(j>0)b.aN(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.y){j=A.iZ(l*512,a)
if(j>0)b.aN(o,m,i.y-m,j)}}i.ch=i.x-1
i.ay=i.z}}
A.fA.prototype={
$0(){var s,r,q=new Uint32Array(256)
for(s=1;s<256;++s){r=B.a.a2(16711680+s-1,s)
if(!(s<256))return A.a(q,s)
q[s]=r}return q},
$S:71}
A.fz.prototype={
$3(a,b,c){var s=this.a,r=this.b
return B.a.C(B.c.G((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
$S:72}
A.fC.prototype={
$1(a){var s,r,q=this
a+=q.a
s=q.b
if(s<0){r=q.c
a=r+(a-r)*r/(r-s)}s=q.d
if(s>1){r=q.c
a=r+(a-r)*(1-r)/(s-r)}return a},
$S:73}
A.fJ.prototype={}
A.dK.prototype={
F(a,b){var s
if(b==null)return!1
if(this!==b)s=b instanceof A.dK&&A.iv(b)===A.iv(this)&&b.a===this.a
else s=!0
return s},
gW(a){return A.e0(A.iv(this),this.a,B.m,B.m)}}
A.f7.prototype={
ey(a6,a7,a8,a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=a4.r
if(a5==null||a4.b<2)return
for(s=a4.a.length,r=s-1,q=a4.e,p=q.length,o=a4.c,n=a4.d,m=n.length,l=a5.length,k=t.n,j=a4.w,i=0;i<r;++i){if(!(i<m))return A.a(n,i)
h=n[i]
if((h&1)!==0||(h&4)===0)continue
g=i*o
h=s+i
if(!(h<m))return A.a(n,h)
f=n[h]
e=i*4
if(!(g<p))return A.a(q,g)
h=q[g]
if(!(f>=0&&f<p))return A.a(q,f)
d=q[f]
if(h===d){c=g+1
if(!(c<p))return A.a(q,c)
c=q[c]
b=f+1
if(!(b<p))return A.a(q,b)
b=c!==q[b]
c=b}else c=!0
if(c){if(!(e<l))return A.a(a5,e)
c=!0
if(a5[e]===0){b=e+1
if(!(b<l))return A.a(a5,b)
if(a5[b]===0){b=e+2
if(!(b<l))return A.a(a5,b)
if(a5[b]===0){c=e+3
if(!(c<l))return A.a(a5,c)
c=a5[c]!==0}}}}else c=!1
if(c){j.toString
c=new Float64Array(129)
b=g+1
if(!(b<p))return A.a(q,b)
b=q[b]
if(!(e<l))return A.a(a5,e)
a=a5[e]
a0=e+1
if(!(a0<l))return A.a(a5,a0)
a0=a5[a0]
a1=e+2
if(!(a1<l))return A.a(a5,a1)
a1=a5[a1]
a2=f+1
if(!(a2<p))return A.a(q,a2)
a2=q[a2]
a3=e+3
if(!(a3<l))return A.a(a5,a3)
c=new A.ey(new Float64Array(A.V(A.i([h,b,h+a,b+a0,d+a1,a2+a5[a3],d,a2],k))),c)
c.ez(q,g,f,a5,e)
B.b.p(j,i,c)}}},
cf(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
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
l=new A.f8()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.er()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.f8.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:74}
A.B.prototype={
gcu(){var s=this.a
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
if(c2<B.h.ga5(r)){B.j.I(c1,0,o,q)
return c1}if(c2>=B.h.gad(r)){B.j.M(c1,0,o,q,(r.length-1)*p)
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
if((f&1)!==0){B.j.M(c1,0,o,q,h)
return c1}e=m+n
if(!(e<g))return A.a(k,e)
d=k[e]
e=n+1
if(!(e<m))return A.a(r,e)
e=r[e]
if(!(n<m))return A.a(r,n)
c=r[n]
b=e-c
a=b<=0?0:B.c.C((c2-c)/b,0,1)
m=2*m+n
if(!(m<g))return A.a(k,m)
a0=k[m]
a1=B.a.L(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.cf(a0,a)
k=s.w
if(k==null)a4=null
else{if(!(n<k.length))return A.a(k,n)
a4=k[n]}if(a4!=null)a4.el(B.c.C(a3,0,1),c1)
else if(c0.c&&o>=32&&a1<=1)if(a3<=0)B.j.M(c1,0,o,q,h)
else if(a3>=1)B.j.M(c1,0,o,q,d)
else{n=$.dC()
n.$flags&2&&A.h(n)
n[0]=a3
m=n[0]
n[0]=a3
k=n[0]
n[0]=a3
g=n[0]
n[0]=a3
a5=new A.aO(m,k,g,n[0])
g=s.x
g.toString
a6=B.a.J(h,4)
a7=B.a.J(d,4)
a8=c0.e
if(a8==null)a8=c0.e=J.iT(B.j.gab(c1),0,o/4|0)
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
b3=new A.aO(b1,b2,b3,n[0]).a7(0,a5)
n[0]=c.a+b3.a
b2=n[0]
n[0]=c.b+b3.b
b1=n[0]
n[0]=c.c+b3.c
e=n[0]
n[0]=c.d+b3.d
a8.p(0,a9,new A.aO(b2,b1,e,n[0]))}for(a9=k*4,n=q.length,k=c1.$flags|0;a9<o;++a9){g=h+a9
if(!(g<n))return A.a(q,g)
g=q[g]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=q[e]
k&2&&A.h(c1)
c1[a9]=g+(e-g)*m}}else if(c0.f)for(n=q.length,k=c1.$flags|0,g=a1>1,a9=0;a9<o;++a9){b4=g&&m?s.cf(a0+4*B.a.O(a9,a1),a):a3
e=h+a9
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.lh()
e=B.a.C(B.c.G(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
b5=c[e]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=B.a.C(B.c.G(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.fG(b5+(c[e]-b5)*B.c.C(b4,0,1))
k&2&&A.h(c1)
c1[a9]=e}else if(a1<=1||a2)if(a3<=0)B.j.M(c1,0,o,q,h)
else if(a3>=1)B.j.M(c1,0,o,q,d)
else for(n=q.length,m=c1.$flags|0,b6=d,b7=h,a9=0;a9<o;++a9,++b7,++b6){if(!(b7<n))return A.a(q,b7)
b8=q[b7]
if(!(b6>=0&&b6<n))return A.a(q,b6)
b9=q[b6]
k=b8===b9?b8:b8+(b9-b8)*a3
m&2&&A.h(c1)
c1[a9]=k}else for(n=q.length,m=c1.$flags|0,a9=0;a9<o;++a9){b4=s.cf(a0+4*B.a.O(a9,a1),a)
k=h+a9
if(!(k<n))return A.a(q,k)
b8=q[k]
k=d+a9
if(!(k>=0&&k<n))return A.a(q,k)
b9=q[k]
if(b4<=0)k=b8
else if(b4>=1)k=b9
else k=b8===b9?b8:b8+(b9-b8)*b4
m&2&&A.h(c1)
c1[a9]=k}return c1}}
A.ey.prototype={
ez(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this,j=k.a,i=j.length
if(0>=i)return A.a(j,0)
s=j[0]
if(1>=i)return A.a(j,1)
r=j[1]
for(j=k.b,i=j.$flags|0,q=1;q<129;++q,r=o,s=p){e=q/128
p=k.bi(e,0)
o=k.bi(e,1)
n=j[q-1]
m=p-s
l=o-r
l=Math.sqrt(m*m+l*l)
i&2&&A.h(j)
j[q]=n+l}},
bi(a,b){var s,r,q,p,o,n=1-a,m=this.a,l=m.length
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
el(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
if(a<=0){s=i.a
r=s.length
if(0>=r)return A.a(s,0)
q=s[0]
b.$flags&2&&A.h(b)
p=b.length
if(0>=p)return A.a(b,0)
b[0]=q
if(1>=r)return A.a(s,1)
s=s[1]
if(1>=p)return A.a(b,1)
b[1]=s
return}if(a>=1){s=i.a
r=s.length
if(6>=r)return A.a(s,6)
q=s[6]
b.$flags&2&&A.h(b)
p=b.length
if(0>=p)return A.a(b,0)
b[0]=q
if(7>=r)return A.a(s,7)
s=s[7]
if(1>=p)return A.a(b,1)
b[1]=s
return}s=i.b
o=B.h.gad(s)*a
for(n=0,m=128;n+1<m;){l=n+m>>>1
if(!(l<129))return A.a(s,l)
if(s[l]<=o)n=l
else m=l}if(!(m>=0&&m<129))return A.a(s,m)
r=s[m]
if(!(n>=0&&n<129))return A.a(s,n)
s=s[n]
k=r-s
j=(n+(k===0?0:(o-s)/k))/128
s=i.bi(j,0)
b.$flags&2&&A.h(b)
r=b.length
if(0>=r)return A.a(b,0)
b[0]=s
s=i.bi(j,1)
b.$flags&2&&A.h(b)
if(1>=r)return A.a(b,1)
b[1]=s}}
A.fL.prototype={
fW(){var s,r,q,p,o,n,m,l,k,j,i=this.a,h=J.N(i)
switch(A.j(A.U(h.h(i,0)))){case 0:s=h.h(i,1)==null?null:A.K(h.h(i,1))
r=A.j(A.U(h.h(i,2)))
i=new A.dl([0,h.gk(i)<=3||A.aU(h.h(i,3)),s,r])
break
case 1:s=A.K(h.h(i,1))
i=new A.dk([1,t.bm.a(h.h(i,2)),s,A.aU(h.h(i,3))])
break
case 2:s=A.j(A.U(h.h(i,1)))
r=A.K(h.h(i,2))
q=A.K(h.h(i,3))
p=A.U(h.h(i,4))
o=A.j(A.U(h.h(i,5)))
n=A.j(A.U(h.h(i,6)))
m=A.j(A.U(h.h(i,7)))
l=A.j(A.U(h.h(i,8)))
n=new A.df([2,q,r,p,o,m,A.aU(h.h(i,9)),s,l,n])
i=n
break
case 5:s=A.j(A.U(h.h(i,1)))
r=A.K(h.h(i,2))
q=A.K(h.h(i,3))
p=A.j(A.U(h.h(i,4)))
o=A.j(A.U(h.h(i,5)))
n=A.U(h.h(i,6))
m=A.U(h.h(i,7))
l=A.j(A.U(h.h(i,8)))
k=A.j(A.U(h.h(i,9)))
j=A.j(A.U(h.h(i,10)))
l=new A.dg([5,q,r,m,k,A.aU(h.h(i,11)),s,n,o,p,j,l])
i=l
break
case 4:i=B.aD
break
default:i=A.v(B.a3)}return i}}
A.iL.prototype={
$3(a,b,c){return new A.ay(this.a.gcg()-a,0-b.a-c,0-b.b)},
$S:75}
A.iK.prototype={
$1(a){var s,r,q=this.b
if(q.gv().length<a){s=Math.max(65536,q.gv().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.aw(s,0)}},
$S:6}
A.iM.prototype={
$1(a){return A.by(this.a.gv(),0,a)},
$S:77}
A.iN.prototype={
$1(a){var s,r=this,q=r.b
if(q.gv().length<=262144){r.a.a=0
return}if(a<=65536){s=r.a
if(++s.a>=16){s.a=0
s=r.c
s.a=null
s.b=-1
q.aw(65536,0)}}else r.a.a=0},
$S:6}
A.iP.prototype={
$3(a,b,c){var s
if(!this.a.hd(b,c))return
s=this.b.E(0,a)
if(s==null)return
this.c.cq(s)},
$S:78}
A.iO.prototype={
$2(a,b){var s,r,q,p,o=this,n=o.a,m=n.E(0,a)
if(m!=null)o.b.cq(m)
o.c.E(0,a)
for(s=o.b,r=A.n(n).i("M<1>");n.a>=24;){q=new A.M(n,r).gB(0)
if(!q.q())A.v(A.a8())
p=n.E(0,q.gA())
p.toString
s.cq(p)}n.p(0,a,b)},
$S:79}
A.iQ.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.dj(3,b,a):new A.bZ(1,s,a)
this.b.aA(r)},
$S:80}
A.iJ.prototype={
$1(m3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8,k9,l0,l1,l2,l3,l4,l5,l6,l7,l8,l9,m0,m1=this,m2=null
A:{if(m3==null){e6=m1.b
e6.cc()
e6.dT()
m1.c.l(0)
m1.d.a_()
m1.e.a_()
m1.f.a.cb()
A.u(v.G.self).close()
return}g6=t.gx.b(m3)
g7=m2
g8=m2
g9=m2
h0=!1
if(g6){h1=m3.a
h2=h1[0]
if(0===h2){h3=h1[2]
if(t.dk.b(h3)){A.ia(h3)
h4=h1[3]
if(A.o(h4)){A.j(h4)
h5=h1[1]
h0=A.b1(h5)
if(h0){A.aU(h5)
g9=h5}g8=h4}g7=h3}}}else h2=m2
if(h0){e6=m1.b
e6.b=A.j(g8)
e6.bU(0)
e6.sfQ(g9)
e6.eo(g7)
break A}h6=t.hh.b(m3)
h7=m2
h8=m2
h9=!1
if(h6){if(g6)h0=h2
else{h2=A.eM()
h0=h2
g6=!0}h7=1===h0
h0=h7
if(h0){h8=A.eM()
h9=!0}}s=null
r=null
q=null
h0=!1
if(t.cm.b(m3)){i0=!0
if(h6)h1=h7
else{if(g6)h1=h2
else{h2=m3.a[0]
h1=h2
g6=!0}h7=1===h1
h1=h7}if(h1){if(h9)h1=h8
else{h8=m3.a[2]
h1=h8
h9=i0}if(typeof h1=="string"){if(h9)h1=h8
else{h8=m3.a[2]
h1=h8
h9=i0}s=A.K(h1)
h1=m3.a
i1=h1[1]
i2=t.p
if(i2.b(i1)){r=i2.a(i1)
i3=h1[3]
h0=A.b1(i3)
if(h0)q=A.aU(i3)}}}}if(h0){try{p=t.P.a(B.y.dX(B.R.fT(A.o9(r)),m2))
e6=s
e7=A.jn(new A.dK(q))
e7.fP(p)
m1.r.$2(e6,new A.ce(e7))}catch(i4){o=A.ad(i4)
e6=m1.w
if(e6.a>=24)e6.E(0,new A.M(e6,A.n(e6).i("M<1>")).ga5(0))
e6.p(0,s,J.bH(o))}break A}n=null
m=null
l=null
k=null
j=null
i=null
h=null
g=null
f=null
i5=m2
i6=m2
i7=!1
i8=m2
i9=!1
j0=m2
j1=!1
j2=m2
j3=!1
j4=m2
j5=!1
h0=!1
if(t.eS.b(m3)){i0=!0
if(g6)h1=h2
else{h2=m3.a[0]
h1=h2
g6=!0}j6=2===h1
if(j6){h1=m3.a
i5=h1[7]
i7=A.o(i5)
if(i7){A.j(i5)
n=i5
i6=h1[2]
if(typeof i6=="string"){A.K(i6)
m=i6
if(h9)i2=h8
else{h8=h1[1]
i2=h8
h9=i0}if(typeof i2=="string"){if(h9)i2=h8
else{h8=h1[1]
i2=h8
h9=i0}l=A.K(i2)
j7=h1[3]
if(typeof j7=="number"){k=A.U(j7)
j8=h1[4]
i9=A.o(j8)
if(i9){j=A.j(j8)
i8=h1[9]
j1=A.o(i8)
if(j1){A.j(i8)
i=i8
j0=h1[5]
j3=A.o(j0)
if(j3){A.j(j0)
h=j0
j2=h1[8]
j5=A.o(j2)
if(j5){A.j(j2)
g=j2
j4=h1[6]
h0=A.b1(j4)
if(h0){A.aU(j4)
f=j4}}}}}}}}}}}else j6=!1
if(h0){try{e6=i
e7=h
if(typeof e6!=="number")return e6.a7()
if(typeof e7!=="number")return A.S(e7)
e=e6*e7
m1.x.$1(e)
e7=m1.y
d=e7.$1(e)
e6=m1.b
f6=m
f7=i
g3=h
g4=g
h0=f
h1=m1.z
c=e6.ef(h1,d,f6,j,g3,h0,g4,f7)
if(c){m1.Q.$3(l,m,g)
b=new Uint8Array(A.V(d))
e7=e6.y
f6=e6.at
f7=d.byteLength
g3=e6.ay
m1.f.aA(new A.co([0,-1,m,g3,e6.ch,0,0,b,0,n,f7,!1,e7+f6]))
m1.as.$1(e)
if(!f){e7=m
f6=i
f7=h
g3=g
e6.e8(e7,j,f7,g3,f6)}return}f6=m1.c
a=f6.E(0,l)
if(a==null){m1.at.$2(n,l)
return}f6.p(0,l,a)
h1.a=null
h1.b=-1
a0=m1.ax.gcg()
a1=B.F
a2=0
f6=k
f7=i
g3=h
A.kX(a.geQ(),f6,m1.e,f7,g3,m1.d,m2)
a3=m1.ay.$3(a0,a1,a2)
a4=e7.$1(e)
e7=m
g3=i
f7=h
f6=g
g4=f
a5=e6.cG(e7,j,f7,g4,m1.ch,a4,f6,g3)
a6=new Uint8Array(A.V(a4))
g3=a5.a[2]
f6=e6.y
e6=e6.at
g4=a3.a
f7=a3.b
e7=a3.c
h0=a4.byteLength
h1=a5.a[3]
m1.f.aA(new A.co([0,g3,m,h1,a5.a[4],e7,f7,a6,g4,n,h0,!0,f6+e6]))
m1.as.$1(e)
m1.Q.$3(l,m,g)}catch(i4){a7=A.ad(i4)
m1.f.aA(new A.bZ(1,J.bH(a7),n))}break A}a8=null
a9=null
b0=null
b1=null
b2=null
b3=null
b4=null
b5=null
b6=null
b7=null
b8=null
h0=!1
if(t.a8.b(m3)){j9=!0
if(g6)h1=h2
else{h2=m3.a[0]
h1=h2
g6=!0}if(5===h1){if(j6)h1=i5
else{i5=m3.a[6]
h1=i5
j6=!0}if(A.o(h1)){a8=A.j(j6?i5:m3.a[6])
if(i7)h1=i6
else{i6=m3.a[2]
h1=i6
i7=j9}if(typeof h1=="string"){if(i7)h1=i6
else{i6=m3.a[2]
h1=i6
i7=j9}a9=A.K(h1)
if(h9)h1=h8
else{h8=m3.a[1]
h1=h8
h9=!0}if(typeof h1=="string"){b0=A.K(h9?h8:m3.a[1])
h1=m3.a
k0=h1[9]
if(A.o(k0)){b1=A.j(k0)
k1=h1[8]
if(A.o(k1)){b2=A.j(k1)
k2=h1[7]
if(typeof k2=="number"){b3=A.U(k2)
k3=h1[3]
if(typeof k3=="number"){b4=A.U(k3)
if(i9)i2=i8
else{i8=h1[11]
i2=i8
i9=!0}if(A.o(i2)){b5=A.j(i9?i8:h1[11])
if(j1)i2=j0
else{j0=h1[4]
i2=j0
j1=!0}if(A.o(i2)){b6=A.j(j1?j0:h1[4])
if(j3)i2=j2
else{j2=h1[10]
i2=j2
j3=!0}if(A.o(i2)){b7=A.j(j3?j2:h1[10])
if(j5)h0=j4
else{j4=h1[5]
h0=j4
j5=!0}h0=A.b1(h0)
if(h0)b8=A.aU(j5?j4:h1[5])}}}}}}}}}}}}if(h0){try{h0=m1.z
h0.a=null
h0.b=-1
h0=b2
if(typeof h0!=="number")return h0.ek()
b9=h0>1?1:0
h1=b2
i2=b6
if(typeof h1!=="number")return h1.a7()
if(typeof i2!=="number")return A.S(i2)
k4=b2
if(typeof k4!=="number")return k4.er()
k5=b9
if(typeof k5!=="number")return A.S(k5)
c0=h1*i2+(k4-1)*k5
k5=b5
k4=c0
if(typeof k5!=="number")return k5.a7()
if(typeof k4!=="number")return A.S(k4)
c1=k5*k4
m1.x.$1(c1)
h0=b9
if(typeof h0!=="number")return h0.ek()
if(h0>0){c2=1
h0=m1.e
h1=t.a
for(;;){i2=c2
k4=b2
if(typeof i2!=="number")return i2.cA()
if(typeof k4!=="number")return A.S(k4)
if(!(i2<k4))break
i2=c2
k4=b6
k5=b9
if(typeof k4!=="number")return k4.ae()
if(typeof k5!=="number")return A.S(k5)
if(typeof i2!=="number")return i2.a7()
k6=b5
if(typeof k6!=="number")return A.S(k6)
c3=(i2*(k4+k5)-1)*k6
i2=h0.c
if(i2!=null){k4=h1.a(A.u($.l.memory).buffer)
k7=h0.b
i2=new Uint32Array(k4,i2,k7)}else{i2=h0.d
i2.toString}k4=c3
k5=b5
if(typeof k4!=="number")return k4.ae()
if(typeof k5!=="number")return A.S(k5)
B.f.N(i2,c3,k4+k5,0)
i2=c2
if(typeof i2!=="number")return i2.ae()
c2=i2+1}}h0=b5
h1=b6
if(typeof h0!=="number")return h0.a7()
if(typeof h1!=="number")return A.S(h1)
c4=h0*h1
c5=0
c6=0
c7=-1
c8=0
c9=0
d0=0
h1=m1.b
d1=h1.f
d2=2654435769
d3=2246822507
d4=null
d5=null
d6=0
h0=m1.ch
i2=m1.ay
k4=m1.c
k5=m1.ax
k6=m1.d
k8=m1.e
k9=t.a
for(;;){l0=d6
l1=b2
if(typeof l0!=="number")return l0.cA()
if(typeof l1!=="number")return A.S(l1)
if(!(l0<l1))break
B:{l0=b1
l1=d6
if(typeof l0!=="number")return l0.ae()
if(typeof l1!=="number")return A.S(l1)
d7=A.ot(l0+l1,b7,b4)
l1=b3
l0=d7
if(typeof l1!=="number")return l1.ae()
if(typeof l0!=="number")return A.S(l0)
d8=l1+l0
l0=d6
l1=b6
l2=b9
if(typeof l1!=="number")return l1.ae()
if(typeof l2!=="number")return A.S(l2)
if(typeof l0!=="number")return l0.a7()
d9=l0*(l1+l2)
l2=d9
l1=b5
if(typeof l2!=="number")return l2.a7()
if(typeof l1!=="number")return A.S(l1)
e0=l2*l1
l1=A.j(e0)
l2=A.j(c4)
l0=l1+l2
A.b8(l1,l0,k8.b)
l3=k8.c
l4=l3==null
l5=l4?m2:l3+l1*4
if(l4){l4=k8.d
l4.toString
l0=A.jm(l4,l1,l0)}else l0=m2
e1=new A.aY(!1,l2,l5,l0)
l0=a9
l5=b5
l2=b6
l1=b7
l4=b8
l6=e1
l7=l6.c
if(l7!=null){l8=k9.a(A.u($.l.memory).buffer)
k7=l6.b
l6=new Uint32Array(l8,l7,k7)}else{l6=l6.d
l6.toString}e2=h1.hE(A.by(l6,0,m2),l0,d7,l2,l4,l1,l5)
if(e2){l0=c6
if(typeof l0!=="number")return l0.ae()
c6=l0+1
if(d4==null)d4=d7
if(d1){e3=h1.ay
e4=h1.ch
if(J.m(b2,1)){d2=e3
d3=e4}else if(J.m(e3,0)&&J.m(e4,0))d1=!1
else{e5=A.jY(d2,d3,e3,e4)
e6=null
e7=null
e6=e5.a
e7=e5.b
d2=e6
d3=e7}}break B}if(d5==null)d5=k4.E(0,b0)
if(d5==null){m1.at.$2(a8,b0)
return}k4.p(0,b0,d5)
e8=k5.gcg()
e9=B.F
f0=0
l0=d5
l1=b5
l2=b6
l0=l0.a
A.kX(l0,d8,e1,l1,l2,k6,m2)
f1=i2.$3(e8,e9,f0)
l0=c8
l1=f1.a
if(typeof l0!=="number")return l0.ae()
c8=l0+l1
l1=c9
l0=f1.b
if(typeof l1!=="number")return l1.ae()
c9=l1+l0
l0=d0
l1=f1.c
if(typeof l0!=="number")return l0.ae()
d0=l0+l1
l1=c5
if(typeof l1!=="number")return l1.ae()
c5=l1+1
l1=a9
l0=b5
l2=b6
l4=b7
l5=b8
l6=e1
l7=l6.c
if(l7!=null){l8=k9.a(A.u($.l.memory).buffer)
k7=l6.b
l6=new Uint32Array(l8,l7,k7)}else{l6=l6.d
l6.toString}f2=h1.cG(l1,d7,l2,l5,h0,A.by(l6,0,m2),l4,l0)
if(f2.a[2]>0)c7=f2.a[2]
if(d1){f3=f2.a[3]
f4=f2.a[4]
if(J.m(b2,1)){d2=f3
d3=f4}else if(J.m(f3,0)&&J.m(f4,0))d1=!1
else{f5=A.jY(d2,d3,f3,f4)
f6=null
f7=null
f6=f5.a
f7=f5.b
d2=f6
d3=f7}}}l0=d6
if(typeof l0!=="number")return l0.ae()
d6=l0+1}f8=m1.y.$1(c1)
f9=new Uint8Array(A.V(f8))
g0=null
g1=null
if(!d1){g0=0
g1=0}else if(J.m(b2,1)){g0=d2
g1=d3}else{e6=d2
e7=d3
f6=b2
l9=e6^f6
m0=e7+A.aC(f6,2654435761)>>>0
l9=A.aC((l9^l9>>>15)>>>0,2246822519)
l9=(l9^l9>>>13)>>>0
m0=A.aC((m0^m0>>>16)>>>0,3266489917)
m0=(m0^m0>>>15)>>>0
g2=new A.z(l9,l9===0&&m0===0?1:m0)
g3=null
g4=null
g3=g2.a
g4=g2.b
g0=g3
g1=g4}e6=c5
e7=c6
f6=c7
f7=h1.y
g3=h1.at
g4=c8
h0=c9
i2=d0
k4=c1
if(typeof k4!=="number")return k4.a7()
m1.f.aA(new A.dh([4,e7,f6,a9,g0,g1,i2,h0,f9,g4,a8,b2,c0,b1,b5,k4*4,e6,f7+g3]))
m1.as.$1(c1)
m1.Q.$3(b0,a9,b7)
if(!b8&&d4!=null){e6=a9
e7=b5
b6=b6
f6=b7
h1.e8(e6,d4,b6,f6,e7)}}catch(i4){g5=A.ad(i4)
m1.f.aA(new A.bZ(1,J.bH(g5),a8))}break A}m=m2
e6=!1
if(t.bn.b(m3)){if(g6)e7=h2
else{h2=A.eM()
e7=h2
g6=!0}if(3===e7){if(i7)e6=i6
else{i6=A.eM()
e6=i6
i7=!0}e6=typeof e6=="string"
if(e6)m=A.K(i7?i6:A.eM())}}if(e6){e6=m1.b
e6.h1(m)
e6.h6(m)
m1.f.aA(new A.cp(2,m,e6.y+e6.at))
break A}if(t.dn.b(m3))e6=4===(g6?h2:m3.a)
else e6=!1
if(e6){e6=m1.z
e6.a=null
e6.b=-1
e6=m1.b
e6.dT()
e6.cc()
e6.cC()
m1.c.l(0)
m1.w.l(0)
e7=m1.d
e7.eb()
e7.ee(!0)
e7=m1.ch
e7.c=0
if(e7.b.length>131072)e7.b=new Uint8Array(131072)
m1.a.a=0
e7=m1.e
if(e7.gv().length>65536)e7.aw(65536,0)
m1.f.aA(new A.cp(2,"",e6.y+e6.at))}}},
$S:81}
A.iB.prototype={
$1(a){return this.ei(a)},
ei(a5){var s=0,r=A.kU(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.l1(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.fL(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.j(A.U(J.ae(n.a,0)))!==-1||A.j(A.U(J.ae(n.a,1)))!==4)throw A.e(B.X)
q=10
s=13
return A.ib(A.jJ(A.u(A.u(v.G.self).fetch(A.K(J.ae(n.a,2)))),t.m),$async$$1)
case 13:m=a7
s=A.aU(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.ib(A.jJ(A.u(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.ib(a3.iz(a4.je(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.ow(o.b)
d.a=!0
l=null
k=null
j=A.jF([-2,4,$.l!=null])
l=j.a
k=j.b
A.u(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.n(d)
a=b.c.a(n.fW())
a0=d.b
if(a0>=4)A.v(d.cO())
if((a0&1)!==0)d.c1(a)
else if((a0&3)===0)d.cY().m(0,new A.bT(a,b.i("bT<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.ad(a2)
h=null
g=null
f=A.jF([-3,A.w(i)])
h=f.a
g=f.b
A.u(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.kG(null,r)
case 1:return A.kF(p.at(-1),r)}})
return A.kH($async$$1,r)},
$S:82}
A.iC.prototype={
$1(a){return A.lW(new A.iB(this.a,this.b).$1(A.u(a)),t.b)},
$S:83}
A.h8.prototype={
aA(a){var s=A.oa(a)
A.u(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bs.prototype
s.ev=s.t
s=A.y.prototype
s.cH=s.M})();(function installTearOffs(){var s=hunkHelpers._static_0,r=hunkHelpers._static_1,q=hunkHelpers._static_2,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(A,"nH","mf",3)
r(A,"o_","mB",5)
r(A,"o0","mC",5)
r(A,"o1","mD",5)
s(A,"l3","nV",0)
q(A,"o3","nK",9)
s(A,"o2","nJ",0)
p(A.J.prototype,"geR","eS",9)
r(A,"jK","dw",1)
var m
o(m=A.ep.prototype,"ghA","D",45)
o(m,"gb9","cE",46)
o(m,"gh2","h3",47)
o(m,"ghn","ho",48)
o(m,"ghk","cp",49)
p(m=A.ah.prototype,"gfL","u",70)
n(m,"gh4","a1",0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.d,null)
q(A.d,[A.j7,J.D,A.cX,J.bI,A.L,A.bp,A.ft,A.k,A.bO,A.d4,A.cY,A.cD,A.G,A.bz,A.P,A.d7,A.b9,A.fH,A.fj,A.cE,A.dn,A.H,A.fa,A.cK,A.aM,A.cJ,A.dS,A.d9,A.ch,A.fU,A.ev,A.i3,A.aO,A.aQ,A.eq,A.i1,A.hZ,A.eh,A.ao,A.el,A.bg,A.J,A.ei,A.d_,A.dp,A.ej,A.d6,A.bB,A.em,A.aS,A.ez,A.fN,A.eu,A.d8,A.y,A.c9,A.dI,A.i4,A.h9,A.e1,A.cZ,A.ha,A.a1,A.bt,A.Z,A.eA,A.fv,A.cf,A.fi,A.f1,A.fM,A.f3,A.dN,A.bw,A.h7,A.dP,A.ex,A.eQ,A.fb,A.fE,A.ec,A.au,A.b6,A.aY,A.fe,A.hX,A.ce,A.fn,A.aa,A.bS,A.c,A.bA,A.hb,A.hU,A.ep,A.bh,A.T,A.bl,A.bD,A.cl,A.c_,A.a7,A.hJ,A.eo,A.a6,A.a5,A.aR,A.er,A.bk,A.br,A.ah,A.aD,A.eY,A.dK,A.f7,A.B,A.ey,A.fL,A.h8])
q(J.D,[J.cF,J.cH,J.R,J.bK,J.bL,J.cI,J.cb])
q(J.R,[J.bs,J.x,A.bu,A.cP])
q(J.bs,[J.e2,J.d2,J.ar])
r(J.dQ,A.cX)
r(J.f4,J.x)
q(J.cI,[J.cG,J.dR])
q(A.L,[A.b4,A.be,A.dT,A.ee,A.e6,A.cz,A.en,A.aX,A.d3,A.ed,A.bb,A.dH])
q(A.bp,[A.dF,A.dG,A.eb,A.iw,A.iy,A.fQ,A.fP,A.ic,A.hB,A.fw,A.eZ,A.iG,A.iH,A.f2,A.eT,A.eR,A.eS,A.ik,A.ih,A.ii,A.ig,A.h5,A.fW,A.fV,A.h2,A.h0,A.fZ,A.h_,A.fY,A.h4,A.i0,A.h6,A.hc,A.hO,A.hM,A.hN,A.hP,A.hF,A.hH,A.hI,A.hG,A.hR,A.hQ,A.hY,A.fz,A.fC,A.f8,A.iL,A.iK,A.iM,A.iN,A.iP,A.iJ,A.iB,A.iC])
q(A.dF,[A.iE,A.fl,A.fR,A.fS,A.i_,A.ht,A.hx,A.hw,A.hv,A.hu,A.hA,A.hz,A.hy,A.fx,A.hW,A.hV,A.fT,A.hS,A.fO,A.ip,A.i6,A.i5,A.hE,A.i9,A.fF,A.fg,A.hq,A.hr,A.hk,A.hl,A.hm,A.hn,A.ho,A.hp,A.he,A.hg,A.hf,A.hs,A.hd,A.hi,A.hh,A.hj,A.fA])
q(A.k,[A.p,A.bR,A.ba,A.eg])
q(A.p,[A.a4,A.cC,A.M,A.bN,A.bM])
q(A.a4,[A.d0,A.Y,A.et])
r(A.ca,A.ba)
q(A.P,[A.cm,A.ai,A.bY,A.bj])
r(A.de,A.cm)
q(A.ai,[A.cn,A.df,A.dg,A.co,A.dh,A.b0,A.dk,A.dl,A.cq,A.bC])
q(A.bY,[A.z,A.di])
q(A.bj,[A.ay,A.dj,A.cp,A.bZ])
q(A.b9,[A.cB,A.dm])
r(A.O,A.cB)
r(A.cS,A.be)
q(A.eb,[A.e7,A.c8])
r(A.eD,A.cz)
q(A.H,[A.b3,A.es])
q(A.dG,[A.f5,A.ix,A.id,A.iq,A.hC,A.fc,A.fd,A.hL,A.f0,A.f_,A.eU,A.fo,A.fp,A.fq,A.fr,A.io,A.fX,A.h1,A.h3,A.iO,A.iQ])
r(A.af,A.b3)
r(A.cc,A.bu)
r(A.ew,A.ev)
r(A.cM,A.ew)
r(A.eE,A.cM)
r(A.eC,A.eE)
q(A.cP,[A.dW,A.a9])
q(A.a9,[A.da,A.dc])
r(A.db,A.da)
r(A.bv,A.db)
r(A.dd,A.dc)
r(A.at,A.dd)
q(A.bv,[A.cd,A.cN])
q(A.at,[A.dX,A.cO,A.dZ,A.e_,A.cQ,A.cR,A.bP])
r(A.cr,A.en)
r(A.d5,A.el)
r(A.ci,A.dp)
r(A.dr,A.d_)
r(A.cj,A.dr)
r(A.ck,A.d6)
r(A.bT,A.bB)
r(A.bi,A.dm)
r(A.bW,A.bi)
q(A.c9,[A.dJ,A.dU])
q(A.dI,[A.f6,A.fK])
r(A.ef,A.dJ)
q(A.aX,[A.b7,A.dM])
q(A.fM,[A.hD,A.i8])
q(A.bw,[A.dV,A.fu,A.bQ])
q(A.a1,[A.c7,A.fJ])
q(A.c7,[A.cy,A.dD])
r(A.cA,A.h9)
r(A.dO,A.dP)
q(A.er,[A.ax,A.aT,A.b_])
s(A.ev,A.y)
s(A.ew,A.G)
s(A.da,A.y)
s(A.db,A.G)
s(A.dc,A.y)
s(A.dd,A.G)
s(A.eE,A.bz)
s(A.ci,A.ej)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",f:"double",c5:"num",q:"String",r:"bool",Z:"Null",t:"List",d:"Object",ag:"Map",I:"JSObject"},mangledNames:{},types:["~()","r(A)","r(a7)","b()","~(@)","~(~())","~(b)","Z(@)","Z()","~(d,av)","@()","r()","r(+(q,b))","r(@)","bq(@,c,bq?,b,b)","~(f,f,f,f,f,f)","@(@,q)","Z(ar,ar)","d?(d?)","d(d,av)","r(bw)","@(q)","r(b,bx)","+(b,b)(b)","@(@)","t<b>()","~(f,f,f,f,f,f,f,f)","~(f,f,f,f,f,f,b)","aq<~>()","~(b,b,f,f,r)","r(d,bS)","r(d,aa<ah>)","r(d,aa<f>)","r(bh,aa<aY>)","~(a7,aD)","r(a6)","B(b{dimensions:b})","~(b,b)","Z(@,av)","f(q,f)","~(b,@)","~(@,b)","~(t<A>)","A(T)","Z(~())","B(B)","A(A)","aH(aH)","a7(a7)","a6(a6)","B()","c_()","T()","bl()","aR()","ax()","Z(d,av)","b_()","bk()","a5()","bh()","bD()","cl()","a7()","a6()","bA()","r(B)","b(f)","~(d?,d?)","r(aH)","~(f,f)","d1()","b(b,b,f)","f(f)","f(f,f,f)","+(b,b,b)(b,+calls,copiedBytes(b,b),b)","~(q,@)","bx(b)","~(q,q,b)","~(q,ce)","~(b,q)","~(d?)","aq<Z>(I)","I(I)","aT()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.de&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.z&&a.b(c.a)&&b.b(c.b),"2;calls,copiedBytes":(a,b)=>c=>c instanceof A.di&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.ay&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;contentKey,requestId":(a,b,c)=>d=>d instanceof A.dj&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;entryKey,workerRamBytes":(a,b,c)=>d=>d instanceof A.cp&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;message,requestId":(a,b,c)=>d=>d instanceof A.bZ&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.b0&&A.bo(a,b.a),"4;bytes,contentKey,useSimd":a=>b=>b instanceof A.dk&&A.bo(a,b.a),"4;deduplicateUploads,diskDirectory,maximumRamBytes":a=>b=>b instanceof A.dl&&A.bo(a,b.a),"5;compressedBytes,crc31,entryDiskBytes,fpHi,fpLo":a=>b=>b instanceof A.cq&&A.bo(a,b.a),"6;":a=>b=>b instanceof A.bC&&A.bo(a,b.a),"10;":a=>b=>b instanceof A.cn&&A.bo(a,b.a),"10;contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width":a=>b=>b instanceof A.df&&A.bo(a,b.a),"12;contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width":a=>b=>b instanceof A.dg&&A.bo(a,b.a),"13;entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes":a=>b=>b instanceof A.co&&A.bo(a,b.a),"18;compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes":a=>b=>b instanceof A.dh&&A.bo(a,b.a)}}
A.n_(v.typeUniverse,JSON.parse('{"ar":"bs","e2":"bs","d2":"bs","oI":"bu","cF":{"D":[],"r":[],"C":[]},"cH":{"D":[],"Z":[],"C":[]},"R":{"D":[],"I":[]},"bs":{"R":[],"D":[],"I":[]},"bK":{"D":[]},"bL":{"D":[]},"x":{"t":["1"],"R":[],"p":["1"],"D":[],"I":[],"k":["1"]},"dQ":{"cX":[]},"f4":{"x":["1"],"t":["1"],"R":[],"p":["1"],"D":[],"I":[],"k":["1"]},"bI":{"a2":["1"]},"cI":{"f":[],"c5":[],"D":[]},"cG":{"f":[],"b":[],"c5":[],"D":[],"C":[]},"dR":{"f":[],"c5":[],"D":[],"C":[]},"cb":{"q":[],"D":[],"fk":[],"C":[]},"b4":{"L":[]},"p":{"k":["1"]},"a4":{"p":["1"],"k":["1"]},"d0":{"a4":["1"],"p":["1"],"k":["1"],"k.E":"1","a4.E":"1"},"bO":{"a2":["1"]},"Y":{"a4":["2"],"p":["2"],"k":["2"],"k.E":"2","a4.E":"2"},"bR":{"k":["1"],"k.E":"1"},"d4":{"a2":["1"]},"ba":{"k":["1"],"k.E":"1"},"ca":{"ba":["1"],"p":["1"],"k":["1"],"k.E":"1"},"cY":{"a2":["1"]},"cC":{"p":["1"],"k":["1"],"k.E":"1"},"cD":{"a2":["1"]},"de":{"cm":[],"P":[]},"cn":{"ai":[],"P":[]},"df":{"ai":[],"P":[]},"dg":{"ai":[],"P":[]},"co":{"ai":[],"P":[]},"dh":{"ai":[],"P":[]},"z":{"bY":[],"P":[]},"di":{"bY":[],"P":[]},"ay":{"bj":[],"P":[]},"dj":{"bj":[],"P":[]},"cp":{"bj":[],"P":[]},"bZ":{"bj":[],"P":[]},"b0":{"ai":[],"P":[]},"dk":{"ai":[],"P":[]},"dl":{"ai":[],"P":[]},"cq":{"ai":[],"P":[]},"bC":{"ai":[],"P":[]},"d7":{"a2":["1"]},"cB":{"b9":["1"],"aZ":["1"],"p":["1"],"k":["1"]},"O":{"cB":["1"],"b9":["1"],"aZ":["1"],"p":["1"],"k":["1"]},"cS":{"be":[],"L":[]},"dT":{"L":[]},"ee":{"L":[]},"dn":{"av":[]},"bp":{"bJ":[]},"dF":{"bJ":[]},"dG":{"bJ":[]},"eb":{"bJ":[]},"e7":{"bJ":[]},"c8":{"bJ":[]},"e6":{"L":[]},"eD":{"L":[]},"b3":{"H":["1","2"],"j9":["1","2"],"ag":["1","2"],"H.K":"1","H.V":"2"},"M":{"p":["1"],"k":["1"],"k.E":"1"},"cK":{"a2":["1"]},"bN":{"p":["1"],"k":["1"],"k.E":"1"},"aM":{"a2":["1"]},"bM":{"p":["bt<1,2>"],"k":["bt<1,2>"],"k.E":"bt<1,2>"},"cJ":{"a2":["bt<1,2>"]},"af":{"b3":["1","2"],"H":["1","2"],"j9":["1","2"],"ag":["1","2"],"H.K":"1","H.V":"2"},"bY":{"P":[]},"cm":{"P":[]},"bj":{"P":[]},"ai":{"P":[]},"dS":{"mm":[],"fk":[]},"d9":{"e4":[]},"eg":{"k":["e4"],"k.E":"e4"},"ch":{"a2":["e4"]},"cc":{"bu":[],"R":[],"D":[],"I":[],"C":[]},"bu":{"R":[],"D":[],"I":[],"C":[]},"cM":{"eW":[],"y":["a0"],"t":["a0"],"p":["a0"],"k":["a0"],"G":["a0"],"C":[],"y.E":"a0","G.E":"a0"},"eC":{"eW":[],"y":["a0"],"bz":["a0"],"t":["a0"],"p":["a0"],"k":["a0"],"G":["a0"],"C":[],"y.E":"a0","bz.E":"a0","G.E":"a0"},"cP":{"R":[],"D":[],"I":[]},"dW":{"R":[],"D":[],"I":[],"C":[]},"a9":{"as":["1"],"R":[],"D":[],"I":[]},"bv":{"y":["f"],"a9":["f"],"t":["f"],"as":["f"],"R":[],"p":["f"],"D":[],"I":[],"k":["f"],"G":["f"]},"at":{"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"]},"cd":{"bv":[],"bq":[],"y":["f"],"a9":["f"],"t":["f"],"as":["f"],"R":[],"p":["f"],"D":[],"I":[],"k":["f"],"G":["f"],"C":[],"y.E":"f","G.E":"f"},"cN":{"bv":[],"eX":[],"y":["f"],"a9":["f"],"t":["f"],"as":["f"],"R":[],"p":["f"],"D":[],"I":[],"k":["f"],"G":["f"],"C":[],"y.E":"f","G.E":"f"},"dX":{"at":[],"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"],"C":[],"y.E":"b","G.E":"b"},"cO":{"at":[],"j2":[],"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"],"C":[],"y.E":"b","G.E":"b"},"dZ":{"at":[],"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"],"C":[],"y.E":"b","G.E":"b"},"e_":{"at":[],"jl":[],"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"],"C":[],"y.E":"b","G.E":"b"},"cQ":{"at":[],"d1":[],"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"],"C":[],"y.E":"b","G.E":"b"},"cR":{"at":[],"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"],"C":[],"y.E":"b","G.E":"b"},"bP":{"at":[],"bx":[],"y":["b"],"a9":["b"],"t":["b"],"as":["b"],"R":[],"p":["b"],"D":[],"I":[],"k":["b"],"G":["b"],"C":[],"y.E":"b","G.E":"b"},"aO":{"a0":[]},"en":{"L":[]},"cr":{"be":[],"L":[]},"ao":{"L":[]},"d5":{"el":["1"]},"J":{"aq":["1"]},"dp":{"kc":["1"],"ka":["1"],"kt":["1"],"bU":["1"]},"ci":{"ej":["1"],"dp":["1"],"kc":["1"],"ka":["1"],"kt":["1"],"bU":["1"]},"cj":{"dr":["1"],"d_":["1"]},"ck":{"d6":["1"],"e8":["1"],"bU":["1"]},"d6":{"e8":["1"],"bU":["1"]},"dr":{"d_":["1"]},"bT":{"bB":["1"]},"em":{"bB":["@"]},"bi":{"b9":["1"],"aZ":["1"],"p":["1"],"k":["1"]},"bW":{"bi":["1"],"b9":["1"],"aZ":["1"],"p":["1"],"k":["1"]},"d8":{"a2":["1"]},"H":{"ag":["1","2"]},"b9":{"aZ":["1"],"p":["1"],"k":["1"]},"dm":{"b9":["1"],"aZ":["1"],"p":["1"],"k":["1"]},"es":{"H":["q","@"],"ag":["q","@"],"H.K":"q","H.V":"@"},"et":{"a4":["q"],"p":["q"],"k":["q"],"k.E":"q","a4.E":"q"},"dJ":{"c9":["q","t<b>"]},"dU":{"c9":["d?","q"]},"ef":{"c9":["q","t<b>"]},"f":{"c5":[]},"b":{"c5":[]},"t":{"p":["1"],"k":["1"]},"aZ":{"p":["1"],"k":["1"]},"q":{"fk":[]},"cz":{"L":[]},"be":{"L":[]},"aX":{"L":[]},"b7":{"L":[]},"dM":{"b7":[],"L":[]},"d3":{"L":[]},"ed":{"L":[]},"bb":{"L":[]},"dH":{"L":[]},"e1":{"L":[]},"cZ":{"L":[]},"eA":{"av":[]},"dV":{"bw":[]},"fu":{"bw":[]},"dO":{"dP":[]},"bQ":{"bw":[]},"T":{"A":[]},"bl":{"A":[]},"a5":{"A":[],"aH":[]},"aR":{"A":[]},"ax":{"A":[]},"aT":{"A":[]},"b_":{"A":[]},"bk":{"aH":[]},"er":{"A":[]},"lY":{"t":["b"],"p":["b"],"k":["b"]},"bx":{"t":["b"],"p":["b"],"k":["b"]},"mz":{"t":["b"],"p":["b"],"k":["b"]},"lX":{"t":["b"],"p":["b"],"k":["b"]},"jl":{"t":["b"],"p":["b"],"k":["b"]},"j2":{"t":["b"],"p":["b"],"k":["b"]},"d1":{"t":["b"],"p":["b"],"k":["b"]},"bq":{"t":["f"],"p":["f"],"k":["f"]},"eX":{"t":["f"],"p":["f"],"k":["f"]},"eW":{"t":["a0"],"p":["a0"],"k":["a0"]}}'))
A.mZ(v.typeUniverse,JSON.parse('{"a9":1,"bB":1,"dm":1,"dI":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.dB
return{a7:s("@<~>"),v:s("ao"),fA:s("cA"),M:s("O<q>"),gw:s("p<@>"),R:s("L"),Y:s("a0"),Z:s("bJ"),gd:s("D"),bM:s("k<f>"),hf:s("k<@>"),hb:s("k<b>"),dh:s("x<eX>"),f:s("x<d>"),fM:s("x<ah>"),hg:s("x<+(r,r)>"),bU:s("x<aD>"),s:s("x<q>"),gC:s("x<B>"),a1:s("x<d1>"),gN:s("x<bx>"),V:s("x<aH>"),ch:s("x<a6>"),bE:s("x<a7>"),r:s("x<A>"),fq:s("x<T>"),n:s("x<f>"),o:s("x<@>"),t:s("x<b>"),a2:s("x<aY?>"),a6:s("x<d?>"),cU:s("x<a6?>"),by:s("x<bD?>"),T:s("cH"),m:s("I"),g:s("ar"),aU:s("as<@>"),aX:s("R"),c2:s("af<d,d>"),el:s("af<d,bS>"),gt:s("af<ag<q,@>,ax>"),gS:s("af<d,aa<ah>>"),fk:s("af<d,aa<f>>"),gj:s("af<bh,aa<aY>>"),ew:s("t<d>"),W:s("t<oJ>"),cH:s("t<A>"),dg:s("t<f>"),j:s("t<@>"),L:s("t<b>"),P:s("ag<q,@>"),gq:s("ag<a6,b>"),B:s("ag<b,a6>"),aj:s("ag<a6,+(b,c)>"),fP:s("Y<T,A>"),a:s("cc"),d4:s("bv"),eB:s("at"),bm:s("bP"),b:s("Z"),K:s("d"),bl:s("bQ"),b8:s("b7"),fW:s("ce"),gT:s("oK"),bQ:s("+()"),eS:s("+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),a8:s("+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),e6:s("+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),f2:s("+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),dn:s("+(d?)"),x:s("+(q,b)"),eG:s("+(b,c)"),bn:s("+entryKey(d?,d?)"),bP:s("+(q,f,f)"),h6:s("+(b,b,b)"),ca:s("+contentKey,requestId(d?,d?,d?)"),hh:s("+contentKey,scene(d?,d?,d?)"),dH:s("+entryKey,workerRamBytes(d?,d?,d?)"),bA:s("+message,requestId(d?,d?,d?)"),cm:s("+bytes,contentKey,useSimd(d?,d?,d?,d?)"),gx:s("+deduplicateUploads,diskDirectory,maximumRamBytes(d?,d?,d?,d?)"),d:s("e4"),bC:s("aZ<d>"),h:s("aZ<q>"),cJ:s("aZ<b>"),l:s("av"),N:s("q"),gz:s("ec"),A:s("B"),dm:s("C"),k:s("be"),p:s("bx"),ak:s("d2"),eU:s("bR<A>"),co:s("ci<d?>"),E:s("bA"),az:s("bS"),bo:s("cl"),G:s("aH"),_:s("J<@>"),fJ:s("J<b>"),U:s("J<~>"),I:s("bh"),eV:s("a5"),D:s("a6"),ai:s("bW<ag<q,@>>"),ao:s("bW<d>"),J:s("a7"),eY:s("p3"),u:s("A"),bs:s("A(T)"),g2:s("ex"),dL:s("aa<aY>"),b3:s("aa<ah>"),e:s("aa<f>"),bD:s("T"),fv:s("dq<d?>"),d1:s("c_"),e_:s("bD"),y:s("r"),al:s("r(d)"),aT:s("r(A)"),i:s("f"),z:s("@"),fO:s("@()"),w:s("@(d)"),C:s("@(d,av)"),S:s("b"),c:s("bq(@,c,bq?,b,b)?"),eH:s("aq<Z>?"),an:s("I?"),bF:s("t<@>?"),aM:s("ag<+(q,f,f),bA>?"),cq:s("ag<q,ag<q,@>>?"),X:s("d?"),ae:s("aZ<d>?"),dk:s("q?"),g_:s("bA?"),ev:s("bB<@>?"),F:s("bg<@,@>?"),Q:s("eu?"),cn:s("ey?"),fQ:s("r?"),cD:s("f?"),gs:s("b?"),cg:s("c5?"),g5:s("~()?"),q:s("c5"),H:s("~"),O:s("~()"),d5:s("~(d)"),da:s("~(d,av)"),cA:s("~(q,@)"),bp:s("~(f,f)"),fi:s("~(f,f,f,f,f,f,f,f)"),as:s("~(b,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a6=J.D.prototype
B.b=J.x.prototype
B.t=J.cF.prototype
B.a=J.cG.prototype
B.c=J.cI.prototype
B.p=J.cb.prototype
B.a7=J.ar.prototype
B.a8=J.R.prototype
B.j=A.cd.prototype
B.h=A.cN.prototype
B.e=A.cO.prototype
B.f=A.cQ.prototype
B.d=A.bP.prototype
B.E=J.e2.prototype
B.v=J.d2.prototype
B.o=new A.cA(0,"littleEndian")
B.r=new A.cA(1,"bigEndian")
B.I=new A.cD(A.dB("cD<0&>"))
B.J=new A.f1()
B.w=function getTagFallback(o) {
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
B.x=function(hooks) { return hooks; }

B.y=new A.dU()
B.Q=new A.e1()
B.m=new A.ft()
B.R=new A.ef()
B.k=new A.fN()
B.z=new A.em()
B.S=new A.hD()
B.q=new A.eA()
B.T=new A.i8()
B.U=new A.a1("Truncated LZ4 match offset",null,null)
B.V=new A.a1("Invalid Huffman code length",null,null)
B.W=new A.a1("Invalid LZ4 match offset",null,null)
B.X=new A.a1("Incompatible FastLottie worker host",null,null)
B.Y=new A.a1("LZ4 literal out of bounds",null,null)
B.Z=new A.a1("Empty LZ4 block",null,null)
B.a_=new A.a1("Truncated LZ4 literal len",null,null)
B.a0=new A.a1("Truncated LZ4 match len",null,null)
B.a1=new A.a1("Lottie JSON exceeds decode budget",null,null)
B.a2=new A.a1("LZ4 match out of output bounds",null,null)
B.a3=new A.a1("Invalid raster worker request",null,null)
B.a4=new A.a1("Incomplete Huffman table",null,null)
B.a5=new A.a1("Oversubscribed Huffman table",null,null)
B.a9=new A.f6(null)
B.A=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.aa=s([10,7,2,7,0,0,0],t.t)
B.B=s([],t.o)
B.ab=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.l=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.ac=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.ad=s([10,7,7,7,7,7],t.t)
B.C=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.ae=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.af=s(["_initialize","malloc","free","fastlottie_clear_pixels","fastlottie_fill_solid_spans","fastlottie_blend_rect","fastlottie_blend_solid","fastlottie_inner_shadow","fastlottie_gradient_spans","fl_dense_new","fl_dense_free","fl_dense_trim","fl_dense_raster"],t.s)
B.ag=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.D=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.aD=new A.de(4)
B.u=new A.z(0,0)
B.aE=new A.z(0,-1)
B.aF=new A.z(1,4)
B.aG=new A.z(2,0)
B.aH=new A.z(3,1)
B.aI=new A.z(4,1)
B.aJ=new A.z(5,1)
B.F=new A.di(0,0)
B.aK=new A.z(null,null)
B.aL=new A.ay(0,0,0)
B.aM=new A.au(0,0,0,0)
B.au={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aN=new A.O(B.au,21,t.M)
B.ai={v:0,i:1,o:2,c:3}
B.aO=new A.O(B.ai,4,t.M)
B.aw={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aP=new A.O(B.aw,11,t.M)
B.an={ty:0,nm:1,mn:2,ix:3,v:4}
B.G=new A.O(B.an,5,t.M)
B.az={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aQ=new A.O(B.az,9,t.M)
B.aq={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aR=new A.O(B.aq,6,t.M)
B.ax={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aS=new A.O(B.ax,31,t.M)
B.at={a:0,k:1,ix:2,x:3,l:4}
B.H=new A.O(B.at,5,t.M)
B.aC={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aT=new A.O(B.aC,19,t.M)
B.aA={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aU=new A.O(B.aA,10,t.M)
B.am={s:0,x:1,y:2,ix:3}
B.aV=new A.O(B.am,4,t.M)
B.ak={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aW=new A.O(B.ak,9,t.M)
B.ao={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aX=new A.O(B.ao,8,t.M)
B.av={}
B.aY=new A.O(B.av,0,t.M)
B.al={a:0,s:1,i:2,f:3,n:4}
B.aZ=new A.O(B.al,5,t.M)
B.aB={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.b_=new A.O(B.aB,15,t.M)
B.ah={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.b0=new A.O(B.ah,7,t.M)
B.aj={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.b1=new A.O(B.aj,10,t.M)
B.as={n:0,nm:1,v:2}
B.b2=new A.O(B.as,3,t.M)
B.ar={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b3=new A.O(B.ar,10,t.M)
B.ap={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b4=new A.O(B.ap,16,t.M)
B.ay={p:0,k:1}
B.b5=new A.O(B.ay,2,t.M)
B.b6=A.aL("oA")
B.b7=A.aL("oB")
B.b8=A.aL("bq")
B.b9=A.aL("eW")
B.ba=A.aL("eX")
B.bb=A.aL("lX")
B.bc=A.aL("j2")
B.bd=A.aL("lY")
B.be=A.aL("d")
B.bf=A.aL("jl")
B.bg=A.aL("d1")
B.bh=A.aL("mz")
B.bi=A.aL("bx")
B.bj=new A.fK(!1)
B.i=new A.c(null,null)
B.n=new A.c(B.i,"layers")})();(function staticFields(){$.hK=null
$.az=A.i([],t.f)
$.k6=null
$.fm=0
$.jg=A.nH()
$.k0=null
$.k_=null
$.l6=null
$.l2=null
$.la=null
$.is=null
$.iA=null
$.jG=null
$.hT=A.i([],A.dB("x<t<d>?>"))
$.cs=null
$.dx=null
$.dy=null
$.jy=!1
$.F=B.k
$.l0=null
$.jw=null
$.l=null
$.ff=null
$.cL=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"oD","ld",()=>A.it("_$dart_dartClosure"))
s($,"oC","iS",()=>A.it("_$dart_dartClosure_dartJSInterop"))
s($,"pd","lA",()=>B.k.bs(B.k,A.dB("aq<~>()").a(new A.iE()),A.dB("aq<~>")))
s($,"pb","lz",()=>A.i([new J.dQ()],A.dB("x<cX>")))
s($,"oQ","li",()=>A.bf(A.fI({
toString:function(){return"$receiver$"}})))
s($,"oR","lj",()=>A.bf(A.fI({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"oS","lk",()=>A.bf(A.fI(null)))
s($,"oT","ll",()=>A.bf(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"oW","lo",()=>A.bf(A.fI(void 0)))
s($,"oX","lp",()=>A.bf(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"oV","ln",()=>A.bf(A.kj(null)))
s($,"oU","lm",()=>A.bf(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"oZ","lr",()=>A.bf(A.kj(void 0)))
s($,"oY","lq",()=>A.bf(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"oH","dC",()=>A.mb(4))
s($,"p_","jO",()=>A.mA())
s($,"oE","jL",()=>$.lA())
s($,"p7","lx",()=>A.md(4096))
s($,"p5","lv",()=>new A.i6().$0())
s($,"p6","lw",()=>new A.i5().$0())
s($,"p9","eO",()=>A.iF(B.be))
s($,"oL","jM",()=>{A.mh()
return $.fm})
s($,"pa","ly",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"oG","lf",()=>A.j_(B.ag,!1))
s($,"oF","le",()=>A.j_(B.ab,!1))
s($,"oz","iR",()=>A.lK())
s($,"p8","jQ",()=>A.e5("content\\('([^']*)'\\)"))
s($,"p2","lu",()=>A.e5("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"p0","ls",()=>A.e5("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"p1","lt",()=>A.e5('[\\\\"\\x00-\\x1f]'))
s($,"p4","jP",()=>A.e5("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"oN","jN",()=>new A.fA().$0())
s($,"oP","lh",()=>A.my())
s($,"oO","lg",()=>A.mx())})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bu,ArrayBuffer:A.cc,ArrayBufferView:A.cP,DataView:A.dW,Float32Array:A.cd,Float64Array:A.cN,Int16Array:A.dX,Int32Array:A.cO,Int8Array:A.dZ,Uint16Array:A.e_,Uint32Array:A.cQ,Uint8ClampedArray:A.cR,CanvasPixelArray:A.cR,Uint8Array:A.bP})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.a9.$nativeSuperclassTag="ArrayBufferView"
A.da.$nativeSuperclassTag="ArrayBufferView"
A.db.$nativeSuperclassTag="ArrayBufferView"
A.bv.$nativeSuperclassTag="ArrayBufferView"
A.dc.$nativeSuperclassTag="ArrayBufferView"
A.dd.$nativeSuperclassTag="ArrayBufferView"
A.at.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$0=function(){return this()}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
Function.prototype.$5=function(a,b,c,d,e){return this(a,b,c,d,e)}
Function.prototype.$6=function(a,b,c,d,e,f){return this(a,b,c,d,e,f)}
Function.prototype.$7=function(a,b,c,d,e,f,g){return this(a,b,c,d,e,f,g)}
Function.prototype.$9=function(a,b,c,d,e,f,g,h,i){return this(a,b,c,d,e,f,g,h,i)}
Function.prototype.$8=function(a,b,c,d,e,f,g,h){return this(a,b,c,d,e,f,g,h)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var s=document.scripts
function onLoad(b){for(var q=0;q<s.length;++q){s[q].removeEventListener("load",onLoad,false)}a(b.target)}for(var r=0;r<s.length;++r){s[r].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var s=A.om
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()