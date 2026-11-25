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
if(a[b]!==s){A.oN(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.h(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.jJ(b)
return new s(c,this)}:function(){if(s===null)s=A.jJ(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.jJ(a).prototype
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
jN(a,b,c,d){return{i:a,p:b,e:c,x:d}},
iv(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.jL==null){A.ow()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.f(A.ky("Return interceptor for "+A.x(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.hM
if(o==null)o=$.hM=A.iu(n)
p=q[o]}if(p!=null)return p
p=A.oB(a)
if(p!=null)return p
if(typeof a=="function")return B.a7
s=Object.getPrototypeOf(a)
if(s==null)return B.E
if(s===Object.prototype)return B.E
if(typeof q=="function"){o=$.hM
if(o==null)o=$.hM=A.iu(n)
Object.defineProperty(q,o,{value:B.v,enumerable:false,writable:true,configurable:true})
return B.v}return B.v},
j7(a,b){if(a<0||a>4294967295)throw A.f(A.ap(a,0,4294967295,"length",null))
return J.mf(new Array(a),b)},
j8(a,b){if(a<0)throw A.f(A.aE("Length must be a non-negative integer: "+a,null))
return A.h(new Array(a),b.i("y<0>"))},
mf(a,b){var s=A.h(a,b.i("y<0>"))
s.$flags=1
return s},
aD(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cI.prototype
return J.dT.prototype}if(typeof a=="string")return J.cb.prototype
if(a==null)return J.cJ.prototype
if(typeof a=="boolean")return J.cH.prototype
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.av.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iv(a)},
O(a){if(typeof a=="string")return J.cb.prototype
if(a==null)return a
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.av.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iv(a)},
b5(a){if(a==null)return a
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.av.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iv(a)},
cw(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.av.prototype
if(typeof a=="symbol")return J.bL.prototype
if(typeof a=="bigint")return J.bK.prototype
return a}if(a instanceof A.e)return a
return J.iv(a)},
m(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aD(a).G(a,b)},
ag(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.oA(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.O(a).h(a,b)},
lQ(a,b){return J.b5(a).aq(a,b)},
jY(a,b,c){return J.cw(a).dL(a,b,c)},
iU(a,b,c){return J.cw(a).dM(a,b,c)},
lR(a,b,c){return J.cw(a).dN(a,b,c)},
lS(a,b,c){return J.cw(a).dO(a,b,c)},
lT(a){return J.cw(a).dP(a)},
c6(a,b,c){return J.cw(a).bt(a,b,c)},
jZ(a,b){return J.b5(a).aj(a,b)},
k_(a){return J.cw(a).ga7(a)},
lU(a){return J.b5(a).ga4(a)},
ar(a){return J.aD(a).gV(a)},
iV(a){return J.O(a).gR(a)},
cy(a){return J.b5(a).gB(a)},
am(a){return J.O(a).gk(a)},
lV(a){return J.aD(a).gW(a)},
k0(a){return J.b5(a).gaf(a)},
k1(a,b,c,d,e){return J.b5(a).J(a,b,c,d,e)},
lW(a,b){return J.b5(a).an(a,b)},
bH(a){return J.aD(a).u(a)},
E:function E(){},
cH:function cH(){},
cJ:function cJ(){},
S:function S(){},
bs:function bs(){},
e4:function e4(){},
d4:function d4(){},
av:function av(){},
bK:function bK(){},
bL:function bL(){},
y:function y(a){this.$ti=a},
dS:function dS(){},
f6:function f6(a){this.$ti=a},
bI:function bI(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cK:function cK(){},
cI:function cI(){},
dT:function dT(){},
cb:function cb(){}},A={j9:function j9(){},
kd(a){return new A.b7("Field '"+a+"' has been assigned during initialization.")},
mh(a){return new A.b7("Field '"+a+"' has not been initialized.")},
ao(a){return new A.b7("Local '"+a+"' has not been initialized.")},
fb(a){return new A.b7("Local '"+a+"' has already been initialized.")},
bd(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
fF(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
jI(a,b,c){return a},
jM(a){var s,r
for(s=$.aC.length,r=0;r<s;++r)if(a===$.aC[r])return!0
return!1},
fA(a,b,c,d){A.aQ(b,"start")
if(c!=null){A.aQ(c,"end")
if(b>c)A.w(A.ap(b,0,c,"start",null))}return new A.d2(a,b,c,d.i("d2<0>"))},
kn(a,b,c){var s="count"
if(t.gw.b(a)){A.eR(b,s,t.S)
A.aQ(b,s)
return new A.ca(a,b,c.i("ca<0>"))}A.eR(b,s,t.S)
A.aQ(b,s)
return new A.bb(a,b,c.i("bb<0>"))},
ab(){return new A.bc("No element")},
j5(){return new A.bc("Too many elements")},
md(){return new A.bc("Too few elements")},
b7:function b7(a){this.a=a},
iF:function iF(){},
fv:function fv(){},
p:function p(){},
a7:function a7(){},
d2:function d2(a,b,c,d){var _=this
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
a_:function a_(a,b,c){this.a=a
this.b=b
this.$ti=c},
bR:function bR(a,b,c){this.a=a
this.b=b
this.$ti=c},
d6:function d6(a,b,c){this.a=a
this.b=b
this.$ti=c},
bb:function bb(a,b,c){this.a=a
this.b=b
this.$ti=c},
ca:function ca(a,b,c){this.a=a
this.b=b
this.$ti=c},
d_:function d_(a,b,c){this.a=a
this.b=b
this.$ti=c},
cD:function cD(a){this.$ti=a},
cE:function cE(a){this.$ti=a},
H:function H(){},
bz:function bz(){},
m7(){throw A.f(A.aH("Cannot modify constant Set"))},
lo(a){var s=A.ln(a)
if(s!=null)return s
return"minified:"+a},
oA(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
x(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bH(a)
return s},
cW(a){var s,r=$.ki
if(r==null)r=$.ki=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
mx(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.f(A.ap(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
e5(a){var s,r,q,p
if(a instanceof A.e)return A.al(A.aL(a),null)
s=J.aD(a)
if(s===B.a6||s===B.a8||t.ak.b(a)){r=B.w(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.al(A.aL(a),null)},
kj(a){var s,r,q
if(a==null||typeof a=="number"||A.b3(a))return J.bH(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bp)return a.u(0)
if(a instanceof A.Q)return a.dA(!0)
s=$.lO()
for(r=0;r<1;++r){q=s[r].hD(a)
if(q!=null)return q}return"Instance of '"+A.e5(a)+"'"},
mu(){return Date.now()},
mw(){var s,r
if($.fo!==0)return
$.fo=1000
if(typeof window=="undefined")return
s=window
if(s==null)return
if(!!s.dartUseDateNowForTicks)return
r=s.performance
if(r==null)return
if(typeof r.now!="function")return
$.fo=1e6
$.ji=new A.fn(r)},
my(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
cX(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.M(s,10)|55296)>>>0,s&1023|56320)}throw A.f(A.ap(a,0,1114111,null,null))},
mv(a){var s=a.$thrownJsError
if(s==null)return null
return A.bn(s)},
mz(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.Y(a,s)
a.$thrownJsError=s
s.stack=""}},
U(a){throw A.f(A.is(a))},
a(a,b){if(a==null)J.am(a)
throw A.f(A.eP(a,b))},
eP(a,b){var s,r="index"
if(!A.o(b))return new A.aY(!0,b,r,null)
s=A.j(J.am(a))
if(b<0||b>=s)return A.j2(b,s,a,r)
return A.mA(b,r)},
is(a){return new A.aY(!0,a,null,null)},
lg(a){return a},
f(a){return A.Y(a,new Error())},
Y(a,b){var s
if(a==null)a=new A.be()
b.dartException=a
s=A.oO
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
oO(){return J.bH(this.dartException)},
w(a,b){throw A.Y(a,b==null?new Error():b)},
d(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.w(A.ny(a,b,c),s)},
ny(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.d5("'"+s+"': Cannot "+o+" "+l+k+n)},
Z(a){throw A.f(A.at(a))},
bf(a){var s,r,q,p,o,n
a=A.oI(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.h([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.fJ(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
fK(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
kx(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
ja(a,b){var s=b==null,r=s?null:b.method
return new A.dV(a,r,s?null:b.receiver)},
af(a){var s
if(a==null)return new A.fl(a)
if(a instanceof A.cF){s=a.a
return A.bG(a,s==null?A.aW(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bG(a,a.dartException)
return A.oe(a)},
bG(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
oe(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.M(r,16)&8191)===10)switch(q){case 438:return A.bG(a,A.ja(A.x(s)+" (Error "+q+")",null))
case 445:case 5007:A.x(s)
return A.bG(a,new A.cU())}}if(a instanceof TypeError){p=$.lx()
o=$.ly()
n=$.lz()
m=$.lA()
l=$.lD()
k=$.lE()
j=$.lC()
$.lB()
i=$.lG()
h=$.lF()
g=p.ak(s)
if(g!=null)return A.bG(a,A.ja(A.L(s),g))
else{g=o.ak(s)
if(g!=null){g.method="call"
return A.bG(a,A.ja(A.L(s),g))}else if(n.ak(s)!=null||m.ak(s)!=null||l.ak(s)!=null||k.ak(s)!=null||j.ak(s)!=null||m.ak(s)!=null||i.ak(s)!=null||h.ak(s)!=null){A.L(s)
return A.bG(a,new A.cU())}}return A.bG(a,new A.eg(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.d0()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bG(a,new A.aY(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.d0()
return a},
bn(a){var s
if(a instanceof A.cF)return a.b
if(a==null)return new A.dq(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.dq(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
iG(a){if(a==null)return J.ar(a)
if(typeof a=="object")return A.cW(a)
return J.ar(a)},
os(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.q(0,a[s],a[r])}return b},
nL(a,b,c,d,e,f){t.Z.a(a)
switch(A.j(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.f(new A.hc("Unsupported number of arguments for wrapped closure"))},
dC(a,b){var s=a.$identity
if(!!s)return s
s=A.om(a,b)
a.$identity=s
return s},
om(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.nL)},
m6(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.e9().constructor.prototype):Object.create(new A.c8(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.ka(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.m2(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.ka(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
m2(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.f("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.m0)}throw A.f("Error in functionType of tearoff")},
m3(a,b,c,d){var s=A.k9
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
ka(a,b,c,d){if(c)return A.m5(a,b,d)
return A.m3(b.length,d,a,b)},
m4(a,b,c,d){var s=A.k9,r=A.m1
switch(b?-1:a){case 0:throw A.f(new A.e8("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
m5(a,b,c){var s,r
if($.k7==null)$.k7=A.k6("interceptor")
if($.k8==null)$.k8=A.k6("receiver")
s=b.length
r=A.m4(s,c,a,b)
return r},
jJ(a){return A.m6(a)},
m0(a,b){return A.dx(v.typeUniverse,A.aL(a.a),b)},
k9(a){return a.a},
m1(a){return a.b},
k6(a){var s,r,q,p=new A.c8("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.f(A.aE("Field name "+a+" not found.",null))},
iu(a){return v.getIsolateTag(a)},
eO(){throw A.f(new A.eF(null))},
px(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
oB(a){var s,r,q,p,o,n=A.L($.li.$1(a)),m=$.it[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iB[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.ic($.le.$2(a,n))
if(q!=null){m=$.it[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iB[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.iE(s)
$.it[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.iB[n]=s
return s}if(p==="-"){o=A.iE(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.ll(a,s)
if(p==="*")throw A.f(A.ky(n))
if(v.leafTags[n]===true){o=A.iE(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.ll(a,s)},
ll(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.jN(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
iE(a){return J.jN(a,!1,null,!!a.$iaw)},
oD(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.iE(s)
else return J.jN(s,c,null,null)},
ow(){if(!0===$.jL)return
$.jL=!0
A.ox()},
ox(){var s,r,q,p,o,n,m,l
$.it=Object.create(null)
$.iB=Object.create(null)
A.ov()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.lm.$1(o)
if(n!=null){m=A.oD(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
ov(){var s,r,q,p,o,n,m=B.K()
m=A.cv(B.L,A.cv(B.M,A.cv(B.x,A.cv(B.x,A.cv(B.N,A.cv(B.O,A.cv(B.P(B.w),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.li=new A.ix(p)
$.le=new A.iy(o)
$.lm=new A.iz(n)},
cv(a,b){return a(b)||b},
n3(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.m(r,b[s]))return!1}return!0},
on(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
kc(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.f(A.dN("Illegal RegExp pattern ("+String(o)+")",a,null))},
oI(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
dg:function dg(a){this.a=a},
co:function co(a){this.a=a},
dh:function dh(a){this.a=a},
di:function di(a){this.a=a},
cp:function cp(a){this.a=a},
dj:function dj(a){this.a=a},
A:function A(a,b){this.a=a
this.b=b},
dk:function dk(a,b){this.a=a
this.b=b},
aB:function aB(a,b,c){this.a=a
this.b=b
this.c=c},
dl:function dl(a,b,c){this.a=a
this.b=b
this.c=c},
cq:function cq(a,b,c){this.a=a
this.b=b
this.c=c},
bZ:function bZ(a,b,c){this.a=a
this.b=b
this.c=c},
b2:function b2(a){this.a=a},
dm:function dm(a){this.a=a},
dn:function dn(a){this.a=a},
cr:function cr(a){this.a=a},
bC:function bC(a){this.a=a},
d9:function d9(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cC:function cC(){},
P:function P(a,b,c){this.a=a
this.b=b
this.$ti=c},
fn:function fn(a){this.a=a},
cZ:function cZ(){},
fJ:function fJ(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
cU:function cU(){},
dV:function dV(a,b,c){this.a=a
this.b=b
this.c=c},
eg:function eg(a){this.a=a},
fl:function fl(a){this.a=a},
cF:function cF(a,b){this.a=a
this.b=b},
dq:function dq(a){this.a=a
this.b=null},
bp:function bp(){},
dH:function dH(){},
dI:function dI(){},
ed:function ed(){},
e9:function e9(){},
c8:function c8(a,b){this.a=a
this.b=b},
e8:function e8(a){this.a=a},
eF:function eF(a){this.a=a},
b6:function b6(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
f7:function f7(a){this.a=a},
fc:function fc(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
N:function N(a,b){this.a=a
this.$ti=b},
cM:function cM(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bN:function bN(a,b){this.a=a
this.$ti=b},
aN:function aN(a,b,c,d){var _=this
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
ah:function ah(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
ix:function ix(a){this.a=a},
iy:function iy(a){this.a=a},
iz:function iz(a){this.a=a},
Q:function Q(){},
bY:function bY(){},
cn:function cn(){},
bj:function bj(){},
ak:function ak(){},
dU:function dU(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
db:function db(a){this.b=a},
ei:function ei(a,b,c){this.a=a
this.b=b
this.c=c},
ci:function ci(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
oN(a){throw A.Y(A.kd(a),new Error())},
F(){throw A.Y(A.mh(""),new Error())},
R(){throw A.Y(A.kd(""),new Error())},
em(){var s=new A.fW()
return s.b=s},
fW:function fW(){this.b=null},
bm(a,b,c){},
X(a){return a},
mn(a,b,c){A.bm(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
mq(a){return new Float32Array(a)},
mr(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.K(a.byteLength-b,4)
return new Float32Array(a,b,c)},
je(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.K(a.byteLength-b,8)
return new Float64Array(a,b,c)},
ms(a){return new Int32Array(a)},
e_(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.K(a.byteLength-b,4)
return new Int32Array(a,b,c)},
kg(a){return new Uint32Array(a)},
jf(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.K(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
kh(a){return new Uint8Array(a)},
jg(a,b,c){A.bm(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
aX(a,b,c){if(a>>>0!==a||a>=c)throw A.f(A.eP(b,a))},
bu:function bu(){},
cc:function cc(){},
cO:function cO(a){this.a=a},
eE:function eE(a){this.a=a},
cR:function cR(){},
i5:function i5(a){this.a=a},
dY:function dY(){},
ac:function ac(){},
bv:function bv(){},
ax:function ax(){},
cd:function cd(){},
cP:function cP(){},
dZ:function dZ(){},
cQ:function cQ(){},
e0:function e0(){},
e1:function e1(){},
cS:function cS(){},
cT:function cT(){},
bP:function bP(){},
aP:function aP(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ex:function ex(){},
ey:function ey(){},
dc:function dc(){},
dd:function dd(){},
de:function de(){},
df:function df(){},
eG:function eG(){},
jj(a,b){var s=b.c
return s==null?b.c=A.dv(a,"au",[b.x]):s},
kl(a){var s=a.w
if(s===6||s===7)return A.kl(a.x)
return s===11||s===12},
mC(a){return a.as},
bo(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
dD(a){return A.i4(v.typeUniverse,a,!1)},
c1(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.c1(a1,s,a3,a4)
if(r===s)return a2
return A.kK(a1,r,!0)
case 7:s=a2.x
r=A.c1(a1,s,a3,a4)
if(r===s)return a2
return A.kJ(a1,r,!0)
case 8:q=a2.y
p=A.cu(a1,q,a3,a4)
if(p===q)return a2
return A.dv(a1,a2.x,p)
case 9:o=a2.x
n=A.c1(a1,o,a3,a4)
m=a2.y
l=A.cu(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.jx(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.cu(a1,j,a3,a4)
if(i===j)return a2
return A.kL(a1,k,i)
case 11:h=a2.x
g=A.c1(a1,h,a3,a4)
f=a2.y
e=A.ob(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.kI(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.cu(a1,d,a3,a4)
o=a2.x
n=A.c1(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.jy(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.f(A.dG("Attempted to substitute unexpected RTI kind "+a0))}},
cu(a,b,c,d){var s,r,q,p,o=b.length,n=A.i9(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.c1(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
oc(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.i9(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.c1(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
ob(a,b,c,d){var s,r=b.a,q=A.cu(a,r,c,d),p=b.b,o=A.cu(a,p,c,d),n=b.c,m=A.oc(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.es()
s.a=q
s.b=o
s.c=m
return s},
h(a,b){a[v.arrayRti]=b
return a},
lh(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.ou(s)
return a.$S()}return null},
oy(a,b){var s
if(A.kl(b))if(a instanceof A.bp){s=A.lh(a)
if(s!=null)return s}return A.aL(a)},
aL(a){if(a instanceof A.e)return A.n(a)
if(Array.isArray(a))return A.a2(a)
return A.jA(J.aD(a))},
a2(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
n(a){var s=a.$ti
return s!=null?s:A.jA(a)},
jA(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.nJ(a,s)},
nJ(a,b){var s=a instanceof A.bp?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.nf(v.typeUniverse,s.name)
b.$ccache=r
return r},
ou(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.i4(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
iw(a){return A.c3(A.n(a))},
jG(a){var s
if(a instanceof A.Q)return A.or(a.$r,a.aU())
s=a instanceof A.bp?A.lh(a):null
if(s!=null)return s
if(t.dm.b(a))return J.lV(a).a
if(Array.isArray(a))return A.a2(a)
return A.aL(a)},
c3(a){var s=a.r
return s==null?a.r=new A.i3(a):s},
or(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.dx(v.typeUniverse,A.jG(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.kN(v.typeUniverse,s,A.jG(q[r]))}return A.dx(v.typeUniverse,s,a)},
aM(a){return A.c3(A.i4(v.typeUniverse,a,!1))},
nI(a){var s=this
s.b=A.o9(s)
return s.b(a)},
o9(a){var s,r,q,p,o
if(a===t.K)return A.nR
if(A.c4(a))return A.nV
s=a.w
if(s===6)return A.nG
if(s===1)return A.l4
if(s===7)return A.nM
r=A.o8(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.c4)){a.f="$i"+q
if(q==="r")return A.nP
if(a===t.m)return A.nO
return A.nU}}else if(s===10){p=A.on(a.x,a.y)
o=p==null?A.l4:p
return o==null?A.aW(o):o}return A.nE},
o8(a){if(a.w===8){if(a===t.S)return A.o
if(a===t.i||a===t.q)return A.nQ
if(a===t.N)return A.nT
if(a===t.y)return A.b3}return null},
nH(a){var s=this,r=A.nD
if(A.c4(s))r=A.np
else if(s===t.K)r=A.aW
else if(A.cx(s)){r=A.nF
if(s===t.gs)r=A.nn
else if(s===t.dk)r=A.ic
else if(s===t.fQ)r=A.nl
else if(s===t.cg)r=A.kR
else if(s===t.cD)r=A.nm
else if(s===t.an)r=A.no}else if(s===t.S)r=A.j
else if(s===t.N)r=A.L
else if(s===t.y)r=A.aV
else if(s===t.q)r=A.eH
else if(s===t.i)r=A.W
else if(s===t.m)r=A.v
s.a=r
return s.a(a)},
nE(a){var s=this
if(a==null)return A.cx(s)
return A.lk(v.typeUniverse,A.oy(a,s),s)},
nG(a){if(a==null)return!0
return this.x.b(a)},
nU(a){var s,r=this
if(a==null)return A.cx(r)
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aD(a)[s]},
nP(a){var s,r=this
if(a==null)return A.cx(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.e)return!!a[s]
return!!J.aD(a)[s]},
nO(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.e)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
l3(a){if(typeof a=="object"){if(a instanceof A.e)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
nD(a){var s=this
if(a==null){if(A.cx(s))return a}else if(s.b(a))return a
throw A.Y(A.kV(a,s),new Error())},
nF(a){var s=this
if(a==null||s.b(a))return a
throw A.Y(A.kV(a,s),new Error())},
kV(a,b){return new A.cs("TypeError: "+A.kA(a,A.al(b,null)))},
ol(a,b,c,d){if(A.lk(v.typeUniverse,a,b))return a
throw A.Y(A.n7("The type argument '"+A.al(a,null)+"' is not a subtype of the type variable bound '"+A.al(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
kA(a,b){return A.eX(a)+": type '"+A.al(A.jG(a),null)+"' is not a subtype of type '"+b+"'"},
n7(a){return new A.cs("TypeError: "+a)},
aJ(a,b){return new A.cs("TypeError: "+A.kA(a,b))},
nM(a){var s=this
return s.x.b(a)||A.jj(v.typeUniverse,s).b(a)},
nR(a){return a!=null},
aW(a){if(a!=null)return a
throw A.Y(A.aJ(a,"Object"),new Error())},
nV(a){return!0},
np(a){return a},
l4(a){return!1},
b3(a){return!0===a||!1===a},
aV(a){if(!0===a)return!0
if(!1===a)return!1
throw A.Y(A.aJ(a,"bool"),new Error())},
nl(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.Y(A.aJ(a,"bool?"),new Error())},
W(a){if(typeof a=="number")return a
throw A.Y(A.aJ(a,"double"),new Error())},
nm(a){if(typeof a=="number")return a
if(a==null)return a
throw A.Y(A.aJ(a,"double?"),new Error())},
o(a){return typeof a=="number"&&Math.floor(a)===a},
j(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.Y(A.aJ(a,"int"),new Error())},
nn(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.Y(A.aJ(a,"int?"),new Error())},
nQ(a){return typeof a=="number"},
eH(a){if(typeof a=="number")return a
throw A.Y(A.aJ(a,"num"),new Error())},
kR(a){if(typeof a=="number")return a
if(a==null)return a
throw A.Y(A.aJ(a,"num?"),new Error())},
nT(a){return typeof a=="string"},
L(a){if(typeof a=="string")return a
throw A.Y(A.aJ(a,"String"),new Error())},
ic(a){if(typeof a=="string")return a
if(a==null)return a
throw A.Y(A.aJ(a,"String?"),new Error())},
v(a){if(A.l3(a))return a
throw A.Y(A.aJ(a,"JSObject"),new Error())},
no(a){if(a==null)return a
if(A.l3(a))return a
throw A.Y(A.aJ(a,"JSObject?"),new Error())},
la(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.al(a[q],b)
return s},
o3(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.la(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.al(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
l0(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.al(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.al(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.al(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.al(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.al(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
al(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.al(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.al(a.x,b)+">"
if(l===8){p=A.od(a.x)
o=a.y
return o.length>0?p+("<"+A.la(o,b)+">"):p}if(l===10)return A.o3(a,b)
if(l===11)return A.l0(a,b,null)
if(l===12)return A.l0(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
od(a){var s=A.ln(a)
if(s!=null)return s
return"minified:"+a},
ng(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
nf(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.i4(a,b,!1)
else if(typeof m=="number"){s=m
r=A.dw(a,5,"#")
q=A.i9(s)
for(p=0;p<s;++p)q[p]=r
o=A.dv(a,b,q)
n[b]=o
return o}else return m},
ne(a,b){return A.kP(a.tR,b)},
nd(a,b){return A.kP(a.eT,b)},
i4(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.kM(a,null,b,!1)
r.set(b,s)
return s},
dx(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.kM(a,b,c,!0)
q.set(c,r)
return r},
kN(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.jx(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
kM(a,b,c,d){return A.n1(A.mW(a,b,c,d))},
bE(a,b){b.a=A.nH
b.b=A.nI
return b},
dw(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aR(null,null)
s.w=b
s.as=c
r=A.bE(a,s)
a.eC.set(c,r)
return r},
kK(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.nb(a,b,r,c)
a.eC.set(r,s)
return s},
nb(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.c4(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.cx(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aR(null,null)
q.w=6
q.x=b
q.as=c
return A.bE(a,q)},
kJ(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.n9(a,b,r,c)
a.eC.set(r,s)
return s},
n9(a,b,c,d){var s,r
if(d){s=b.w
if(A.c4(b)||b===t.K)return b
else if(s===1)return A.dv(a,"au",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aR(null,null)
r.w=7
r.x=b
r.as=c
return A.bE(a,r)},
nc(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aR(null,null)
s.w=13
s.x=b
s.as=q
r=A.bE(a,s)
a.eC.set(q,r)
return r},
du(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
n8(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
dv(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.du(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aR(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bE(a,r)
a.eC.set(p,q)
return q},
jx(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.du(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aR(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bE(a,o)
a.eC.set(q,n)
return n},
kL(a,b,c){var s,r,q="+"+(b+"("+A.du(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aR(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bE(a,s)
a.eC.set(q,r)
return r},
kI(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.du(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.du(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.n8(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aR(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bE(a,p)
a.eC.set(r,o)
return o},
jy(a,b,c,d){var s,r=b.as+("<"+A.du(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.na(a,b,c,r,d)
a.eC.set(r,s)
return s},
na(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.i9(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.c1(a,b,r,0)
m=A.cu(a,c,r,0)
return A.jy(a,n,m,c!==m)}}l=new A.aR(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bE(a,l)},
mW(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
n1(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.mY(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.kF(a,r,l,k,!1)
else if(q===46)r=A.kF(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.bX(a.u,a.e,k.pop()))
break
case 94:k.push(A.nc(a.u,k.pop()))
break
case 35:k.push(A.dw(a.u,5,"#"))
break
case 64:k.push(A.dw(a.u,2,"@"))
break
case 126:k.push(A.dw(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.n_(a,k)
break
case 38:A.mZ(a,k)
break
case 63:p=a.u
k.push(A.kK(p,A.bX(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.kJ(p,A.bX(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.mX(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.kG(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.n2(a.u,a.e,o)
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
mY(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
kF(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.ng(s,o.x)[p]
if(n==null)A.w('No "'+p+'" in "'+A.mC(o)+'"')
d.push(A.dx(s,o,n))}else d.push(p)
return m},
n_(a,b){var s,r=a.u,q=A.kE(a,b),p=b.pop()
if(typeof p=="string")b.push(A.dv(r,p,q))
else{s=A.bX(r,a.e,p)
switch(s.w){case 11:b.push(A.jy(r,s,q,a.n))
break
default:b.push(A.jx(r,s,q))
break}}},
mX(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.kE(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.bX(p,a.e,o)
q=new A.es()
q.a=s
q.b=n
q.c=m
b.push(A.kI(p,r,q))
return
case-4:b.push(A.kL(p,b.pop(),s))
return
default:throw A.f(A.dG("Unexpected state under `()`: "+A.x(o)))}},
mZ(a,b){var s=b.pop()
if(0===s){b.push(A.dw(a.u,1,"0&"))
return}if(1===s){b.push(A.dw(a.u,4,"1&"))
return}throw A.f(A.dG("Unexpected extended operation "+A.x(s)))},
kE(a,b){var s=b.splice(a.p)
A.kG(a.u,a.e,s)
a.p=b.pop()
return s},
bX(a,b,c){if(typeof c=="string")return A.dv(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.n0(a,b,c)}else return c},
kG(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.bX(a,b,c[s])},
n2(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.bX(a,b,c[s])},
n0(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.f(A.dG("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.f(A.dG("Bad index "+c+" for "+b.u(0)))},
lk(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.a6(a,b,null,c,null)
r.set(c,s)}return s},
a6(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.c4(d))return!0
s=b.w
if(s===4)return!0
if(A.c4(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.a6(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.a6(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.a6(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.a6(a,b.x,c,d,e))return!1
return A.a6(a,A.jj(a,b),c,d,e)}if(s===6)return A.a6(a,p,c,d,e)&&A.a6(a,b.x,c,d,e)
if(q===7){if(A.a6(a,b,c,d.x,e))return!0
return A.a6(a,b,c,A.jj(a,d),e)}if(q===6)return A.a6(a,b,c,p,e)||A.a6(a,b,c,d.x,e)
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
if(!A.a6(a,j,c,i,e)||!A.a6(a,i,e,j,c))return!1}return A.l2(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.l2(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.nN(a,b,c,d,e)}if(o&&q===10)return A.nS(a,b,c,d,e)
return!1},
l2(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.a6(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.a6(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.a6(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.a6(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.a6(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
nN(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.dx(a,b,r[o])
return A.kQ(a,p,null,c,d.y,e)}return A.kQ(a,b.y,null,c,d.y,e)},
kQ(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.a6(a,b[s],d,e[s],f))return!1
return!0},
nS(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.a6(a,r[s],c,q[s],e))return!1
return!0},
cx(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.c4(a))if(s!==6)r=s===7&&A.cx(a.x)
return r},
c4(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
kP(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
i9(a){return a>0?new Array(a):v.typeUniverse.sEA},
aR:function aR(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
es:function es(){this.c=this.b=this.a=null},
i3:function i3(a){this.a=a},
ep:function ep(){},
cs:function cs(a){this.a=a},
mP(){var s,r,q
if(self.scheduleImmediate!=null)return A.of()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dC(new A.fS(s),1)).observe(r,{childList:true})
return new A.fR(s,r,q)}else if(self.setImmediate!=null)return A.og()
return A.oh()},
mQ(a){self.scheduleImmediate(A.dC(new A.fT(t.O.a(a)),0))},
mR(a){self.setImmediate(A.dC(new A.fU(t.O.a(a)),0))},
mS(a){t.O.a(a)
A.n4(0,a)},
n4(a,b){var s=new A.i0()
s.ez(a,b)
return s},
l6(a){return new A.ej(new A.K($.G,a.i("K<0>")),a.i("ej<0>"))},
kU(a,b){a.$2(0,null)
b.b=!0
return b.a},
id(a,b){A.nq(a,b)},
kT(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("au<1>").b(a))s.cO(a)
else s.cS(a)},
kS(a,b){var s=A.af(a),r=A.bn(a),q=A.l1(s,r)
s=new A.as(s,r)
r=b.b
q=b.a
if(r)q.bf(s)
else q.bd(s)},
nq(a,b){var s,r,q=new A.ie(b),p=new A.ig(b)
if(a instanceof A.K)a.dw(q,p,t.z)
else{s=t.z
if(a instanceof A.K)a.cq(q,p,s)
else{r=new A.K($.G,t._)
r.a=8
r.c=a
r.dw(q,p,s)}}},
ld(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.G
return r.bZ(r,t.as.a(new A.ir(s)),t.H,t.S,t.z)},
iY(a){var s
if(t.R.b(a)){s=a.gaS()
if(s!=null)return s}return B.q},
l1(a,b){var s=$.G
if(s===B.k)return null
s.f1(s,a,b)
return null},
nK(a,b){if($.G!==B.k)A.l1(a,b)
if(t.R.b(a)){b=a.gaS()
if(b==null){A.mz(a,B.q)
b=B.q}}else b=B.q
return new A.as(a,b)},
jr(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.mD()
b.bd(new A.as(new A.aY(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.de(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.aW()
b.be(n.a)
A.bV(b,p)
return}b.a^=2
o=b.b
o.aY(o,new A.hy(n,b))},
bV(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.aV(d,m.a,m.b)}return}q.a=b
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
h=$.G
if(h!==i)$.G=i
else h=null
d=d.c
if((d&15)===8)new A.hC(q,e,n).$0()
else if(o){if((d&1)!==0)new A.hB(q,j).$0()}else if((d&2)!==0)new A.hA(e,q).$0()
if(h!=null)$.G=h
d=q.c
if(d instanceof A.K){p=q.a.$ti
p=p.i("au<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bp(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.jr(d,g,!0)
return}}g=q.a.b
f=r.a(g.c)
g.c=null
b=g.bp(f)
d=q.b
p=q.c
if(!d){g.$ti.c.a(p)
g.a=8
g.c=p}else{s.a(p)
g.a=g.a&1|16
g.c=p}e.a=g
d=g}},
o4(a,b){var s=t.C
if(s.b(a))return b.bZ(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.bo(b,s.a(a),t.z,t.K)
throw A.f(A.k2(a,"onError",u.c))},
nY(){var s,r
for(s=$.ct;s!=null;s=$.ct){$.dA=null
r=s.b
$.ct=r
if(r==null)$.dz=null
s.a.$0()}},
oa(){$.jB=!0
try{A.nY()}finally{$.dA=null
$.jB=!1
if($.ct!=null)$.jU().$1(A.lf())}},
lb(a){var s=new A.ek(a),r=$.dz
if(r==null){$.ct=$.dz=s
if(!$.jB)$.jU().$1(A.lf())}else $.dz=r.b=s},
o7(a){var s,r,q,p=$.ct
if(p==null){A.lb(a)
$.dA=$.dz
return}s=new A.ek(a)
r=$.dA
if(r==null){s.b=p
$.ct=$.dA=s}else{q=r.b
s.b=q
$.dA=r.b=s
if(q==null)$.dz=s}},
oK(a){var s=$.G
if(B.k===s){A.jD(B.k,a)
return}A.jD(s,s.bn(s,a,t.H))
return},
p4(a,b){A.jI(a,"stream",t.K)
return new A.eB(b.i("eB<0>"))},
jE(a){return},
mT(a,b){if(b==null)b=A.oj()
if(t.da.b(b))return a.bZ(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.bo(a,t.w.a(b),t.z,t.K)
throw A.f(A.aE("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
o_(a,b){var s=$.G
s.aV(s,a,b)},
nZ(){},
o6(a,b){A.o7(new A.ip(a,b))},
jD(a,b){if(B.k!==a)b=a.fN(b,t.H)
A.lb(b)},
fS:function fS(a){this.a=a},
fR:function fR(a,b,c){this.a=a
this.b=b
this.c=c},
fT:function fT(a){this.a=a},
fU:function fU(a){this.a=a},
i0:function i0(){},
i1:function i1(a,b){this.a=a
this.b=b},
ej:function ej(a,b){this.a=a
this.b=!1
this.$ti=b},
ie:function ie(a){this.a=a},
ig:function ig(a){this.a=a},
ir:function ir(a){this.a=a},
as:function as(a,b){this.a=a
this.b=b},
en:function en(){},
d7:function d7(a,b){this.a=a
this.$ti=b},
bg:function bg(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
K:function K(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
hv:function hv(a,b){this.a=a
this.b=b},
hz:function hz(a,b){this.a=a
this.b=b},
hy:function hy(a,b){this.a=a
this.b=b},
hx:function hx(a,b){this.a=a
this.b=b},
hw:function hw(a,b){this.a=a
this.b=b},
hC:function hC(a,b,c){this.a=a
this.b=b
this.c=c},
hD:function hD(a,b){this.a=a
this.b=b},
hE:function hE(a){this.a=a},
hB:function hB(a,b){this.a=a
this.b=b},
hA:function hA(a,b){this.a=a
this.b=b},
ek:function ek(a){this.a=a
this.b=null},
d1:function d1(){},
fy:function fy(a,b){this.a=a
this.b=b},
fz:function fz(a,b){this.a=a
this.b=b},
dr:function dr(){},
hY:function hY(a){this.a=a},
hX:function hX(a){this.a=a},
el:function el(){},
cj:function cj(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
ck:function ck(a,b){this.a=a
this.$ti=b},
cl:function cl(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
d8:function d8(){},
fV:function fV(a){this.a=a},
dt:function dt(){},
bB:function bB(){},
bT:function bT(a,b){this.b=a
this.a=null
this.$ti=b},
eo:function eo(){},
aT:function aT(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
hU:function hU(a,b){this.a=a
this.b=b},
eB:function eB(a){this.$ti=a},
fP:function fP(){},
fQ:function fQ(a,b,c){this.a=a
this.b=b
this.c=c},
ip:function ip(a,b){this.a=a
this.b=b},
mi(a,b,c){return b.i("@<0>").a2(c).i("jb<1,2>").a(A.os(a,new A.b6(b.i("@<0>").a2(c).i("b6<1,2>"))))},
ae(a,b){return new A.b6(a.i("@<0>").a2(b).i("b6<1,2>"))},
mj(a){return new A.bi(a.i("bi<0>"))},
jc(a){return new A.bi(a.i("bi<0>"))},
jt(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
kf(a){var s,r
if(A.jM(a))return"{...}"
s=new A.cf("")
try{r={}
B.b.m($.aC,a)
s.a+="{"
r.a=!0
a.aI(0,new A.ff(r,s))
s.a+="}"}finally{if(0>=$.aC.length)return A.a($.aC,-1)
$.aC.pop()}r=s.a
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
ew:function ew(a){this.a=a
this.c=this.b=null},
da:function da(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
z:function z(){},
I:function I(){},
fe:function fe(a){this.a=a},
ff:function ff(a,b){this.a=a
this.b=b},
ba:function ba(){},
dp:function dp(){},
o0(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.af(r)
q=A.dN(String(s),null,null)
throw A.f(q)}q=A.ii(p)
return q},
ii(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.eu(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.ii(a[s])
return a},
ni(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.lM()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
nh(a,b,c,d){var s=a?$.lL():$.lK()
if(s==null)return null
if(0===c&&d===b.length)return A.kO(s,b)
return A.kO(s,b.subarray(c,d))},
kO(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
nj(a){switch(a){case 65:return"Missing extension byte"
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
c9:function c9(){},
dK:function dK(){},
dL:function dL(){},
dW:function dW(){},
f8:function f8(a){this.a=a},
eh:function eh(){},
fM:function fM(a){this.a=a},
i6:function i6(a){this.a=a
this.b=16
this.c=0},
oz(a,b){var s=A.mx(a,b)
if(s!=null)return s
throw A.f(A.dN(a,null,null))},
m8(a,b){a=A.Y(a,new Error())
if(a==null)a=A.aW(a)
a.stack=b.u(0)
throw a},
jd(a,b,c,d){var s,r=c?J.j8(a,d):J.j7(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
mk(a,b,c){var s,r,q=A.h([],c.i("y<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.Z)(a),++r)B.b.m(q,c.a(a[r]))
q.$flags=1
return q},
aO(a,b){var s,r
if(Array.isArray(a))return A.h(a.slice(0),b.i("y<0>"))
s=A.h([],b.i("y<0>"))
for(r=J.cy(a);r.t();)B.b.m(s,r.gA())
return s},
mE(a,b,c){var s,r
A.aQ(b,"start")
s=c-b
if(s<0)throw A.f(A.ap(c,b,null,"end",null))
if(s===0)return""
r=A.mF(a,b,c)
return r},
mF(a,b,c){var s=a.length
if(b>=s)return""
return A.my(a,b,c==null||c>s?s:c)},
e7(a){return new A.dU(a,A.kc(a,!1,!0,!1,!1,""))},
kp(a,b,c){var s=J.cy(b)
if(!s.t())return a
if(c.length===0){do a+=A.x(s.gA())
while(s.t())}else{a+=A.x(s.gA())
while(s.t())a=a+c+A.x(s.gA())}return a},
mD(){return A.bn(new Error())},
eX(a){if(typeof a=="number"||A.b3(a)||a==null)return J.bH(a)
if(typeof a=="string")return JSON.stringify(a)
return A.kj(a)},
m9(a,b){A.jI(a,"error",t.K)
A.jI(b,"stackTrace",t.l)
A.m8(a,b)},
dG(a){return new A.cA(a)},
aE(a,b){return new A.aY(!1,null,b,a)},
k2(a,b,c){return new A.aY(!0,a,b,c)},
eR(a,b,c){return a},
kk(a){var s=null
return new A.b9(s,s,!1,s,s,a)},
mA(a,b){return new A.b9(null,null,!0,a,b,"Value not in range")},
ap(a,b,c,d,e){return new A.b9(b,c,!0,a,d,"Invalid value")},
b_(a,b,c){if(0>a||a>c)throw A.f(A.ap(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.f(A.ap(b,a,c,"end",null))
return b}return c},
aQ(a,b){if(a<0)throw A.f(A.ap(a,0,null,b,null))
return a},
j2(a,b,c,d){return new A.dO(b,!0,a,d,"Index out of range")},
aH(a){return new A.d5(a)},
ky(a){return new A.ef(a)},
aG(a){return new A.bc(a)},
at(a){return new A.dJ(a)},
dN(a,b,c){return new A.a4(a,b,c)},
me(a,b,c){var s,r
if(A.jM(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.h([],t.s)
B.b.m($.aC,a)
try{A.nW(a,s)}finally{if(0>=$.aC.length)return A.a($.aC,-1)
$.aC.pop()}r=A.kp(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
j6(a,b,c){var s,r
if(A.jM(a))return b+"..."+c
s=new A.cf(b)
B.b.m($.aC,a)
try{r=s
r.a=A.kp(r.a,a,", ")}finally{if(0>=$.aC.length)return A.a($.aC,-1)
$.aC.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
nW(a,b){var s,r,q,p,o,n,m,l=a.gB(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.t())return
s=A.x(l.gA())
B.b.m(b,s)
k+=s.length+2;++j}if(!l.t()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gA();++j
if(!l.t()){if(j<=4){B.b.m(b,A.x(p))
return}r=A.x(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gA();++j
for(;l.t();p=o,o=n){n=l.gA();++j
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
e2(a,b,c,d){var s
if(B.m===c){s=J.ar(a)
b=J.ar(b)
return A.fF(A.bd(A.bd($.eQ(),s),b))}if(B.m===d){s=J.ar(a)
b=J.ar(b)
c=J.ar(c)
return A.fF(A.bd(A.bd(A.bd($.eQ(),s),b),c))}s=J.ar(a)
b=J.ar(b)
c=J.ar(c)
d=J.ar(d)
d=A.fF(A.bd(A.bd(A.bd(A.bd($.eQ(),s),b),c),d))
return d},
mt(a){var s,r,q=$.eQ()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.Z)(a),++r)q=A.bd(q,J.ar(a[r]))
return A.fF(q)},
hb:function hb(){},
M:function M(){},
cA:function cA(a){this.a=a},
be:function be(){},
aY:function aY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b9:function b9(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
dO:function dO(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
d5:function d5(a){this.a=a},
ef:function ef(a){this.a=a},
bc:function bc(a){this.a=a},
dJ:function dJ(a){this.a=a},
e3:function e3(){},
d0:function d0(){},
hc:function hc(a){this.a=a},
a4:function a4(a,b,c){this.a=a
this.b=b
this.c=c},
k:function k(){},
bt:function bt(a,b,c){this.a=a
this.b=b
this.$ti=c},
a0:function a0(){},
e:function e(){},
eC:function eC(){},
fx:function fx(){this.b=this.a=0},
cf:function cf(a){this.a=a},
nw(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.x(a)
r=A.ok(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.w("Attempting to box non-Dart object.")
q={}
q[$.lN()]=a
r.error=q
r.stack=b.u(0)
return r},
ma(a,b){var s,r=v.G.Promise,q=new A.f2(a)
if(typeof q=="function")A.w(A.aE("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.nt,q)
s[$.iT()]=q
return A.v(new r(s))},
fk:function fk(a){this.a=a},
f2:function f2(a){this.a=a},
f0:function f0(a){this.a=a},
f1:function f1(a){this.a=a},
ns(a,b,c){t.Z.a(a)
if(A.j(c)>=1)return a.$1(b)
return a.$0()},
nt(a,b,c,d){t.Z.a(a)
A.j(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
dB(a,b,c,d){return d.a(a[b].apply(a,c))},
ok(a,b,c){var s,r
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
jO(a,b){var s=new A.K($.G,b.i("K<0>")),r=new A.d7(s,b.i("d7<0>"))
a.then(A.dC(new A.iH(r,b),1),A.dC(new A.iI(r),1))
return s},
iH:function iH(a,b){this.a=a
this.b=b},
iI:function iI(a){this.a=a},
f3:function f3(){},
f4:function f4(a,b,c){this.a=a
this.b=b
this.c=c},
hF:function hF(){},
hG:function hG(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
j1(a,b){var s=new A.f5()
s.ew(a,b)
return s},
f5:function f5(){this.a=$
this.b=0
this.c=2147483647},
fO:function fO(){},
ia:function ia(){},
ib:function ib(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dP:function dP(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
oo(a,b,c){var s,r="The decoded data is larger than the ",q=new A.dX(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.f(A.iX(r+b+" bytes allowed"))
throw s}if(q.e)throw A.f(A.iX(r+b+" bytes allowed"))
return p},
dX:function dX(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
iW(a){return new A.c7(a,null,null)},
lX(a){return new A.cz(a,null,null)},
iX(a){return new A.dF(a,null,null)},
c7:function c7(a,b,c){this.a=a
this.b=b
this.c=c},
cz:function cz(a,b,c){this.a=a
this.b=b
this.c=c},
dF:function dF(a,b,c){this.a=a
this.b=b
this.c=c},
cB:function cB(a,b){this.a=a
this.b=b},
fw:function fw(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
lj(a,b,c,d){var s,r,q,p=c,o=new A.h9($.jz)
$.jz=o
try{if(d.$0())return!0
if(p){r=A.iW("Invalid "+a+" data")
throw A.f(r)}return!1}catch(q){s=A.af(q)
r=s
if(!(r instanceof A.c7||r instanceof A.cz||r instanceof A.a4||t.b8.b(r)||t.k.b(r)))throw q
r=s instanceof A.dF
if(r)throw q
if(s instanceof A.cz){if(c){r=A.iW(s.a)
throw A.f(r)}return!1}if(s instanceof A.c7){if(p)throw q
return!1}if(p){r=A.iW("Invalid "+a+" data: "+A.x(s))
throw A.f(r)}return!1}finally{$.jz=o.a}},
h9:function h9(a){this.a=a},
j3(a,b,c,d){var s,r,q,p,o=new A.dQ(b)
if(d==null)d=0
A.aQ(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.X(a))
p=J.c6(B.d.ga7(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
dQ:function dQ(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
dR:function dR(){},
jh(a){var s=a==null?32768:a
return new A.bQ(new Uint8Array(s),B.o)},
bQ:function bQ(a,b){this.b=0
this.c=a
this.a=b},
bw:function bw(){},
lZ(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
lY(a){var s,r,q,p,o=new Uint32Array(2048)
B.j.C(o,0,256,a)
for(s=0;s<256;++s){r=a[s]
for(q=1;q<8;++q){r=(a[r&255]^r>>>8)>>>0
p=(q<<8|s)>>>0
if(!(p<2048))return A.a(o,p)
o[p]=r}}return o},
k4(a,b,c){var s,r,q,p,o,n,m,l,k=$.lp(),j=b+c,i=4294967295
if(c>=16){s=A.j_(a,b,j)
r=(c&4294967288)>>>0
for(q=0;q<r;){p=s.getUint32(q,!0)^i
o=s.getUint32(q+4,!0)
i=k[1792+(p&255)]^k[1536+(p>>>8&255)]^k[1280+(p>>>16&255)]^k[1024+(p>>>24&255)]^k[768+(o&255)]^k[512+(o>>>8&255)]^k[256+(o>>>16&255)]^k[o>>>24&255]
q+=8}n=b+q}else n=b
for(m=a.length;n<j;n=l){l=n+1
if(!(n<m))return A.a(a,n)
i=k[(i^a[n])&255]^i>>>8}return(i^4294967295)&2147483647},
an(a,b){return(a&65535)*b+(((a>>>16)*b&65535)<<16>>>0)>>>0},
k3(a,b){return(B.a.dl(a,b)|B.a.eo(a,32-b))>>>0},
m_(a,b,c,d){var s,r,q,p,o,n,m,l=3266489917,k=d?1367130551:0,j=(2654435761^c^k)>>>0,i=b+c,h=(c&4294967292)>>>0
if(c>=16){s=A.j_(a,b,i)
for(r=0;r<h;){k=j+A.an(s.getUint32(r,!0),l)>>>0
j=A.an((k<<17|k>>>15)>>>0,668265263)
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
m=j+A.an((p|o<<8|n<<16|a[m]<<24)>>>0,l)>>>0
j=A.an((m<<17|m>>>15)>>>0,668265263)
q+=4}}for(k=a.length;q<i;){if(!(q<k))return A.a(a,q)
p=j+A.an(a[q],374761393)>>>0
j=A.an((p<<11|p>>>21)>>>0,2654435761);++q}j=A.an((j^j>>>15)>>>0,2246822519)
j=A.an((j^j>>>13)>>>0,l)
return(j^j>>>16)>>>0},
iZ(a,b,c,d,e){var s=e?2147483648:0,r=(a&2147483647|s)>>>0,q=A.m_(b,c,d,e)
return new A.A(r,r===0&&q===0?1:q)},
k5(a,b,c,d){var s=A.k3(A.an((a^c)>>>0,2246822519),13),r=A.k3(A.an((b^d)>>>0,3266489917),17)
s=A.an(s+r>>>0,668265263)
return new A.A(s,A.an((r^s>>>16)>>>0,374761393))},
ez:function ez(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eS:function eS(a,b,c,d,e,f,g,h,i){var _=this
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
eW:function eW(a,b,c){this.a=a
this.b=b
this.c=c},
eV:function eV(a,b){this.a=a
this.b=b},
eT:function eT(a){this.a=a},
eU:function eU(a){this.a=a},
ke(a,b,c){var s,r,q
for(s=b;s<c;s=r){r=s+65536
q=r<c?r:c
B.d.C(a,s,q,$.lu())}},
ml(b5,b6,b7,b8,b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4
if(b6<0||b6>b5.length)throw A.f(A.ap(b6,0,b5.length,"srcLength",null))
if(b6===0)return 0
s=b9>=0?b9:b7.length
r=0
q=0
if(b6>=13){B.e.C(b8,0,16384,$.lt())
p=A.j_(b5,0,b6)
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
if(a3+B.a.K(a2,255)+1+a2+2>s)return-1
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
B.d.J(b7,a3,a6,b5,q)
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
a1=B.a.M(a8,8)
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
if(a3+(B.a.K(a5,255)+1)>=s)return-1
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
i=r+(1+(l?B.a.K(b4-15,255)+1:0)+b4)
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
B.d.J(b7,r,l,b5,q)
return l},
mm(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0
if(b3<0||b2+b3>b1.length||b5<0||b5>b4.length)throw A.f(A.kk("Invalid LZ4 slice bounds"))
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
if(k>=8){B.d.J(b4,n,i,b1,o)
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
if(e>=d){if(d>=8)B.d.J(b4,n,i,b4,c)
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
if((a|a0|a1|a2)===0){A.ke(b4,n,i)
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
B.d.J(b4,g,g+a7,b4,n)
a5+=a7}n=i}}else if(e===1){if(!(c>=0&&c<r))return A.a(b4,c)
a8=b4[c]
if(a8===0){A.ke(b4,n,i)
n=i}else if(d<=32)for(;n<i;n=h){h=n+1
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=a8}else{for(b=0;b<16;++b){g=n+b
q&2&&A.d(b4)
if(!(g>=0&&g<r))return A.a(b4,g)
b4[g]=a8}for(a5=16;a5<d;){a6=d-a5
a7=a5<a6?a5:a6
g=n+a5
B.d.J(b4,g,g+a7,b4,n)
a5+=a7}n=i}}else if(d>32){a9=e>=16?e:B.a.Z(16+e-1,e)*e
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
B.d.J(b4,g,g+a7,b4,n)
a5+=a7}n=i}else for(;n<i;c=a4,n=h){h=n+1
a4=c+1
if(!(c>=0&&c<r))return A.a(b4,c)
g=b4[c]
q&2&&A.d(b4)
if(!(n>=0&&n<r))return A.a(b4,n)
b4[n]=g}}if(n!==b5)throw A.f(A.dN("LZ4 decoded "+n+" bytes, expected "+b5,null,null))
return n},
fd:function fd(a,b){this.a=a
this.b=b
this.c=0},
mL(c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5=null,c6=d5*d1,c7=c9.length
if(d5<=0||d1<=0||c6>65536||c7<2||c7>4||d4.length<c6*4)return c5
s=B.a.K(d5+16-1,16)
r=s*B.a.K(d1+16-1,16)
q=c7*r
p=new Uint16Array(q)
o=new Uint8Array(4)
B.d.ac(o,0,4,255)
n=new Uint32Array(4)
m=new Uint32Array(4)
l=c6*4
if((d4.byteOffset&3)===0){k=A.jp(d4,0,l)
j=c5}else{j=new Uint8Array(l)
k=A.jp(j,0,l)}i=A.h([],t.a1)
h=A.ae(t.h6,t.L)
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
if(a1==null)a1=B.u
if(!(c<4))return A.a(n,c)
n[c]=a1.a
m[c]=a1.b
for(a0=c>0,a2=c*r,a3=(c-1)*r,a4=0;a4<r;++a4){a5=B.a.Y(a4,s)*16
a6=B.a.Z(a4,s)*16
a7=Math.min(16,d5-a5)
a8=Math.min(16,d1-a6)
for(a9=2166136261,b0=0;b0<a8;++b0){b1=(a6+b0)*d5+a5
for(b2=0;b2<a7;++b2){b3=b1+b2
if(!(b3>=0&&b3<f))return A.a(k,b3)
a9=((a9^k[b3])>>>0)*16777619>>>0}}b4=h.e8(new A.aB(a7,a8,a9),new A.fH())
b3=J.b5(b4)
b6=b3.gB(b4)
for(;;){if(!b6.t()){b5=-1
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
B.j.J(b7,b0*a7,c3*a7,k,(a6+b0)*d5+a5)}b5=i.length
b3.m(b4,b5)
B.b.m(i,b7)}b3=a2+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
p[b3]=b5
if(a0){b3=a3+a4
if(!(b3>=0&&b3<q))return A.a(p,b3)
b3=p[b3]!==b5}else b3=!1
if(b3)++d}}if(d*3>(c7-1)*r)return c5
q=A.h([],t.gN)
for(l=i.length,c4=0;c4<i.length;i.length===l||(0,A.Z)(i),++c4)q.push(J.lT(B.j.ga7(i[c4])))
return new A.ee(d5,d1,c8,o,p,q,new A.e(),g,n,m)},
fG:function fG(){this.a=null
this.b=-1},
ee:function ee(a,b,c,d,e,f,g,h,i,j){var _=this
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
fH:function fH(){},
ay:function ay(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ih(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.j.C(a,0,b,$.jX())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.j.C(a,s,q,$.jX())}},
iA(a){var s=0,r=A.l6(t.H),q,p,o,n,m
var $async$iA=A.ld(function(b,c){if(b===1)return A.kS(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.id(A.jO(A.v(v.G.WebAssembly.instantiate(a)),t.m),$async$iA)
case 2:o=n.v(m.v(c.instance).exports)
for(q=0;q<13;++q){p=B.af[q]
if(!(typeof o[p]==="function"))throw A.f(A.aG("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.v(o.memory).buffer).byteLength===0)throw A.f(A.aG("FastLottie Wasm memory is empty"))
$.l=o
return A.kT(null,r)}})
return A.kU($async$iA,r)},
aK(a){var s,r,q=$.l
q.toString
s=a===0?1:a
r=A.j(q.malloc(s))
if(r<=0)throw A.f(A.aG("Could not allocate "+a+" Wasm bytes"))
B.d.ac(A.jg(t.a.a(A.v($.l.memory).buffer),r,a),0,a,0)
return r},
fj(a){var s=new A.aZ(!0,a,null,null),r=$.l!=null
if(r)s.c=A.aK(a*4)
else s.d=new Uint32Array(a)
return s},
iJ(a,b){var s=a.c
if(s!=null)$.l.fastlottie_clear_pixels(s,b)
else A.ih(a.gv(),b)},
oL(a,b,c,d,e,f,g){var s,r,q=a.c
if(q!=null&&e.b!=null){s=$.l
s.toString
r=e.b
r.toString
A.dB(s,"fastlottie_fill_solid_spans",[q,b,c,d,r,f,g],t.H)
return!0}return!1},
oE(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dB(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
oF(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dB(s,"fastlottie_blend_solid",[q,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
oH(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dB(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
oG(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0,a1,a2,a3,a4){var s,r,q,p=a.c
if(p==null||e.b==null||g.c==null)return!1
s=$.l
s.toString
r=e.b
r.toString
q=g.c
q.toString
A.dB(s,"fastlottie_gradient_spans",[p,b,c,d,r,f,q,h,i,j?1:0,k,l,m,n,o,a0,a1,a2,a3,a4],t.H)
return!0},
mp(){var s,r,q=$.l==null
if(q)return null
try{s=A.j($.l.fl_dense_new())
if(!J.m(s,0)){q=A.aK(16)
return new A.fg(s,q)}}catch(r){}return null},
mo(){var s,r=$.fh
if(r!=null){$.cN=$.cN+1
return r}s=A.mp()
if(s==null)return null
$.fh=s
$.cN=1
return s},
b8:function b8(a){this.a=a
this.c=this.b=null},
aZ:function aZ(a,b,c,d){var _=this
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
bF(a,b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g
while(a instanceof A.V)a=a.a
if(a instanceof A.a8){s=a.c
if(!s.gaD()){r=a4.d1(a6)
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
A.bF(s[k],b,q,p,o,n,m,l,a2,a3,a4,a5,j)}return}if(a instanceof A.bl){i=A.nA(a.a,a.b,b,A.l5(c,d,e,f,a2),a4,a5,a6)
if(i!=null&&i.r>0)a3.aF(i,c,d,e,f,a0,a1)
return}if(a instanceof A.aS){if(a.b===3&&a.a.length>=2){for(s=a.a,k=0;k<s.length-1;++k)A.bF(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
h=a4.eF(a6)
A.bF(B.b.gad(s),b,c,d,e,f,a0,a1,a2,h,a4,a5,a6+1)
a3.fL(h)
return}for(s=a.a,k=0;k<s.length;++k)A.bF(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
return}if(a.ga5()){a3.aF(a4.dq(a,b),c,d,e,f,a0,a1)
return}if(c===1&&d===0&&e===0&&f===1&&a0===0&&a1===0)A.ij(a,b,a2,a3)
else{g=a4.fx
g.l(0)
A.ij(a,b,A.l5(c,d,e,f,a2),g)
a3.aF(g,c,d,e,f,a0,a1)}},
l5(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
l_(b4,b5,b6,b7,b8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0=b4.e,b1=b0.n(b5),b2=b1.length,b3=b2/6|0
if(b3===0)return
s=b4.f
r=b4.r
if(r.length!==0){q=b0.b.a
if(b5<=B.f.ga4(q)){p=B.b.ga4(r).a
s=p}else if(b5>=B.f.gad(q)){p=B.b.gad(r).a
s=p}else{b0=b0.r
if(!(b0<r.length))return A.a(r,b0)
o=r[b0]
n=o.a
m=o.b
p=n&&m
s=n}}else p=s
b7.a3(s)
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
b7.T(k*e+i*d+g,j*e+h*d+f,k*a6+i*a7+g,j*a6+h*a7+f,k*a8+i*a9+g,j*a8+h*a9+f,r+g,q+f,b6)}}}else{if(0>=b2)return A.a(b1,0)
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
b7.T(e,d,b0+a0,b1[r]+a1,a4+a2,a5+a3,a4,a5,b6)}}}b7.a1()},
ij(a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(a3 instanceof A.aA){A.l_(a3,a4,a5,a6,null)
return}if(a3 instanceof A.b1){a6.a3(!0)
s=a6.gfK()
a3.f7(a4,s,s,new A.ik(a6,a5),a6.gh3())
return}if(a3 instanceof A.aU){r=a3.r.n(a4)
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
a6.a3(!0)
s=o-m
a6.p(p,s)
j=p+l
i=p+n
h=o-k
g=o+k
f=o+m
e=p-l
d=p-n
if(!a3.f){a6.T(p,s,j,s,i,h,i,o,a5)
a6.T(i,o,i,g,j,f,p,f,a5)
a6.T(p,f,e,f,d,g,d,o,a5)
a6.T(d,o,d,h,e,s,p,s,a5)}else{a6.T(p,s,e,s,d,h,d,o,a5)
a6.T(d,o,d,g,e,f,p,f,a5)
a6.T(p,f,j,f,i,g,i,o,a5)
a6.T(i,o,i,h,j,s,p,s,a5)}a6.a1()
return}s=a3.x.n(a4)
if(0>=s.length)return A.a(s,0)
c=B.c.E(s[0],0,Math.min(Math.abs(n),Math.abs(m)))
if(c<=0.0001){a6.a3(!0)
s=p+n
j=o-m
a6.p(s,j)
i=o+m
h=p-n
if(!a3.f){a6.p(s,i)
a6.p(h,i)
a6.p(h,j)}else{a6.p(h,j)
a6.p(h,i)
a6.p(s,i)}a6.a1()
return}b=c*0.5522847498307936
a6.a3(!0)
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
a6.T(s,d,s,a1,a,h,g,h,a5)
a6.p(a0,h)
a2=a0-b
a6.T(a0,h,a2,h,f,a1,f,d,a5)
a6.p(f,i)
a6.T(f,i,f,e,a2,j,a0,j,a5)
a6.p(g,j)
a6.T(g,j,a,j,s,e,s,i,a5)}else{a6.T(s,i,s,e,a,j,g,j,a5)
a6.p(a0,j)
a1=a0-b
a6.T(a0,j,a1,j,f,e,f,i,a5)
a6.p(f,d)
i=d+b
a6.T(f,d,f,i,a1,h,a0,h,a5)
a6.p(g,h)
a6.T(g,h,a,h,s,i,s,d,a5)}a6.a1()}},
nA(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=a.a,b=c.length
if(a0>=b)return null
s=a.b.n(a1)
if(0>=s.length)return A.a(s,0)
r=B.c.E(s[0],0,100)/100
s=a.c.n(a1)
if(0>=s.length)return A.a(s,0)
q=B.c.E(s[0],0,100)/100
p=Math.abs(q-r)
if(p<0.000001)return null
if(!(a0<c.length))return A.a(c,a0)
o=c[a0]
n=a3.eI(a4)
s=a4+1
A.bF(o,a1,1,0,0,1,0,0,a2,n,a3,s,a5)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a.d.n(a1)
if(0>=l.length)return A.a(l,0)
k=B.c.Y(m+l[0]/360,1)
j=k+p
if(!a.e){i=A.l7(o,a1,a2,a3,n,s,a5)
h=0}else{g=a3.f8(a4,a,a1,a2)
if(g==null){g=a3.eG(a4,b+1)
g.$flags&2&&A.d(g)
m=g.length
if(0>=m)return A.a(g,0)
g[0]=0
for(f=0,e=0;e<b;){if(!(e<c.length))return A.a(c,e)
l=c[e]
f+=A.l7(l,a1,a2,a3,e===a0?n:null,s,a5);++e
if(!(e<m))return A.a(g,e)
g[e]=f}a3.fm(a4,a,a1,a2)}c=g.length
if(!(b<c))return A.a(g,b)
i=g[b]
if(!(a0<c))return A.a(g,a0)
h=g[a0]}d=a3.eH(a4)
c=a3.p3
A.kY(n,k*i-h,Math.min(j,1)*i-h,d,c)
if(j>1)A.kY(n,-h,(j-1)*i-h,d,c)
return d},
l7(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga5()){s=d.f9(a)
if(s!=null)return s}r=A.em()
if(e!=null)r.sdZ(e)
else{r.sdZ(d.eE(f))
A.bF(a,b,1,0,0,1,0,0,c,r.ap(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.w(A.ao(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.w(A.ao(""))
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
if(o===r)A.w(A.ao(""))
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
q+=Math.sqrt(n*n+o*o)}}++p}if(a.ga5()){o=d.bu
o.F(0,a)
if(o.a>=256)o.F(0,new A.N(o,o.$ti.i("N<1>")).ga4(0))
n=d.ay
n.toString
o.q(0,a,new A.ad(n,q,t.e))}return q},
kY(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
k.$flags&2&&A.d(k)
q=k.length
if(0>=q)return A.a(k,0)
k[0]=0
for(j=0;j<l;j=h){i=p+j
h=j+1
g=p+B.a.Y(h,n)
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
if(a1>a0+1e-7)if(m&&a0<=1e-7&&a1>=a-1e-7){a6.a3(!0)
for(a2=p;a2<o;++a2){q=a3.a
if(!(a2>=0&&a2<q.length))return A.a(q,a2)
q=q[a2]
f=a3.b
if(!(a2<f.length))return A.a(f,a2)
a6.p(q,f[a2])}a6.a1()}else A.kX(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
kX(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.a.M(r+a,1)
p=q+1
if(!(p<s))return A.a(a4,p)
if(a4[p]<=a6)r=p
else a=q}a8.a3(!1)
o=a1+r
p=r+1
n=a1+B.a.Y(p,a2)
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
c=a1+B.a.Y(f,a2)
if(a7<=e+1e-9){if(!(g<s))return A.a(a4,g)
p=a4[g]
b=e-p
s=b<=1e-12?0:B.c.E((a7-p)/b,0,1)
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
a8.p(p,m[c])}a8.a1()},
nk(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
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
n=B.c.Y(a8[0],s)
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
f.$flags&2&&A.d(f)
q=f.length
if(0>=q)return A.a(f,0)
f[0]=0
for(e=0;e<g;e=c){d=j+e
c=e+1
b=j+B.a.Y(c,i)
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
if((a5&1)===0&&a7>a6+1e-7)A.kX(b1,j,i,h,f,g,a6,a7,b4)
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
jF(a,b,c,d,e,f,g,h,i){A.b4(a,b,c,d,e,f,g,h,i,0)
a.p(d+b*h,e+b*i)},
iq(a,b,c,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=a8?-1:1,d=b.length
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
if(l<-0.999){A.jF(a,a0,a2,a6,a7,n,s,s,q)
A.jF(a,a0,a2,a6,a7,s,q,m,p)}else A.jF(a,a0,a2,a6,a7,n,s,m,p)}else{a.p(j,i)
a.p(h,g)}},
kW(e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5
if(e7<=0)return
if(f3.a&&f3.h6(e6,e7,e8,e9,f0,f1,f2))return
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
c=m.aH(e)
b=l.aH(e)
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
if(q){f2.a3(!0)
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
f2.a1()}else if(p){f2.a3(!0)
h=b3-e7
a=b4-e7
f2.p(h,a)
a0=b3+e7
f2.p(a0,a)
a=b4+e7
f2.p(a0,a)
f2.p(h,a)
f2.a1()}continue}b5=d?a7:a7-1
b6=o.aH(b5)
b7=n.aH(b5)
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
b7[b8]=0}}if(d){f2.a3(!0)
for(c4=b5-1,c5=0;c5<a7;++c5){c6=c5===0?c4:c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.iq(f2,b6,b7,e7,s,r,e9,c6,c5,h,b[c5],!1)}f2.a1()
f2.a3(!0)
for(c5=a7-1;c5>=0;--c5){c7=c5===0?c4:c5-1
if(!(c5<a2))return A.a(c,c5)
h=c[c5]
if(!(c5<a3))return A.a(b,c5)
A.iq(f2,b6,b7,e7,s,r,e9,c5,c7,h,b[c5],!0)}f2.a1()}else{f2.a3(!0)
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
A.iq(f2,b6,b7,e7,s,r,e9,c5-1,c5,a0,b[c5],!1)}d0=b5-1
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
A.iq(f2,b6,b7,e7,s,r,e9,c5,d9,h,b[c5],!0)}e0=c[0]
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
f2.a1()}}},
l9(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k=d,j=d*e,i=k
if(typeof i!=="number")return i.a6()
p=i*e
i=k
if(typeof i!=="number")return i.cz()
if(i<d||p>c.gv().length)throw A.f(A.aE("Raster output is too small",null))
i=f.b
if(i)A.iJ(c,p)
else A.cg(c.gv(),p)
o=!0
if(d>0)if(e>0){n=a.b
n===$&&A.F()
if(!(n<=0)){o=a.c
o===$&&A.F()
o=o<=0}}if(o)return
o=a.b
o===$&&A.F()
s=d/o
o=a.c
o===$&&A.F()
r=e/o
q=f.ay
f.ay=a
try{A.jC(a,b,255,c,0,0,k,0,0,d,e,s,0,0,r,0,0,null,f,0,!0,i)
m=Math.max(A.j(j),f.xr)
f.xr=0
l=m<=65536&&!f.as
f.as=!1
if(l){if(++f.y1>=16){f.y1=0
f.hC()}}else f.y1=0}finally{f.sfw(q)}},
jC(d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0=null
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
if(B.c.H(B.a.E(B.c.N(d3*B.c.H(e[0])/100),0,255)*f.aR(d2)/255)===0)continue
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
a2=B.c.H(B.a.E(B.c.N(a*B.c.H(a2[0])/100),0,255)*d.aR(d2)/255)>0
a1=a2}}if(a0&&!a1&&!b)continue
if(!a1){if(c===0)A.c0(f,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,0,!0,!1,!1,!1,!0)
else{a3=f.az(d2)
if(a3!=null){e=j?a3.a:a3.c
a0=k?a3.b:a3.d
a4=B.c.P(e2*e+e4*a0+e6)-1
e=l?a3.a:a3.c
a0=m?a3.b:a3.d
a5=B.c.P(e3*e+e5*a0+e7)-1
e=j?a3.c:a3.a
a0=k?a3.d:a3.b
a6=B.c.U(e2*e+e4*a0+e6)+1
e=l?a3.c:a3.a
a0=m?a3.d:a3.b
a7=B.c.U(e3*e+e5*a0+e7)+1
if(a4<d8)a4=d8
if(a5<d9)a5=d9
if(a6>e0)a6=e0
if(a7>e1)a7=e1
a8=a6-a4
a9=a7-a5
if(a8>0&&a9>0){if(f.f==null){e=f.b
b0=e==null?d0:e.gcC()}else b0=d0
e=!1
if(b0!=null){a0=b0.y
if(a0!=null){if(h){a2=$.l
if(a2!=null){a2=!0
if(c!==6)if(c!==7)if(c!==9)a2=c>=12&&c<=15
if(!a2){e=!1
if(a0.w){a0=a0.f
if(a0!=null)if(a0.a!=null){e=a0.n(0)
if(0>=e.length)return A.a(e,0)
e=e[0]!==0}else e=!0}e=!e}}}}else e=!0}if(e){A.c0(f,d2,d3,d4,d5,d6,d7,a4,a5,a6,a7,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,c,!0,!1,!1,!1,!0)
continue}e=a8*a9
b1=e9.aJ(g,e)
if(f2){a0=b1.c
if(a0!=null)$.l.fastlottie_clear_pixels(a0,e)
else{a0=b1.d
a0.toString
A.ih(a0,e)}}else{a0=b1.c
if(a0!=null){a2=i.a(A.v($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.cg(a0,e)}A.c0(f,d2,d3,b1,a4,a5,a8,a4,a5,a6,a7,e2,e3,e4,e5,e6,e7,e8,e9,p,f1,f2,0,!0,!0,!1,!1,!0)
if(h){e=!0
if(c!==6)if(c!==7)if(c!==9)e=c>=12&&c<=15
b3=!e&&A.oE(s,(a5-d6)*d7+a4-d5,d7,b1,a8,a9,c)}else b3=!1
if(!b3){e=d4.c
if(e!=null){a0=i.a(A.v($.l.memory).buffer)
b2=d4.b
e=new Uint32Array(a0,e,b2)}else{e=d4.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.v($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}A.mI(e,a4-d5,a5-d6,d7,a0,0,0,a8,a8,a9,c)}}}}continue}b4=e===3||e===4
b5=f.az(d2)
if(b5==null)continue
e=j?b5.a:b5.c
a0=k?b5.b:b5.d
b6=B.c.P(e2*e+e4*a0+e6)-1
e=l?b5.a:b5.c
a0=m?b5.b:b5.d
b7=B.c.P(e3*e+e5*a0+e7)-1
e=j?b5.c:b5.a
a0=k?b5.d:b5.b
b8=B.c.U(e2*e+e4*a0+e6)+1
e=l?b5.c:b5.a
a0=m?b5.d:b5.b
b9=B.c.U(e3*e+e5*a0+e7)+1
if(b6<d8)b6=d8
if(b7<d9)b7=d9
if(b8>e0)b8=e0
if(b9>e1)b9=e1
if(b6>=b8||b7>=b9)continue
c0=d.az(d2)
if(c0!=null){e=j?c0.a:c0.c
a0=k?c0.b:c0.d
c1=Math.max(b6,B.c.P(e2*e+e4*a0+e6)-1)
e=l?c0.a:c0.c
a0=m?c0.b:c0.d
c2=Math.max(b7,B.c.P(e3*e+e5*a0+e7)-1)
e=j?c0.c:c0.a
a0=k?c0.d:c0.b
c3=Math.min(b8,B.c.U(e2*e+e4*a0+e6)+1)
e=l?c0.c:c0.a
a0=m?c0.d:c0.b
c4=Math.min(b9,B.c.U(e3*e+e5*a0+e7)+1)}else{c4=d9
c3=d8
c2=c4
c1=c3}c5=c1<c3&&c2<c4
if(!b&&!c5)continue
if(b&&!c5&&c===0){A.c0(f,d2,d3,d4,d5,d6,d7,b6,b7,b8,b9,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,0,!0,!1,!1,!1,!0)
continue}a4=b?b6:c1
a5=b?b7:c2
a6=b?b8:c3
a7=b?b9:c4
a8=a6-a4
a9=a7-a5
c6=a8*a9
b1=e9.aJ(o,c6)
if(f2){e=b1.c
if(e!=null)$.l.fastlottie_clear_pixels(e,c6)
else{e=b1.d
e.toString
A.ih(e,c6)}}else{e=b1.c
if(e!=null){a0=i.a(A.v($.l.memory).buffer)
b2=b1.b
e=new Uint32Array(a0,e,b2)}else{e=b1.d
e.toString}A.cg(e,c6)}A.c0(f,d2,d3,b1,a4,a5,a8,a4,a5,a6,a7,e2,e3,e4,e5,e6,e7,d0,e9,p,f1,f2,0,!0,!0,!1,!1,!0)
c7=e9.aJ(n,c6)
if(f2){e=c7.c
if(e!=null)$.l.fastlottie_clear_pixels(e,c6)
else{e=c7.d
e.toString
A.ih(e,c6)}}else{e=c7.c
if(e!=null){a0=i.a(A.v($.l.memory).buffer)
b2=c7.b
e=new Uint32Array(a0,e,b2)}else{e=c7.d
e.toString}A.cg(e,c6)}if(c5)A.c0(d,d2,a,c7,a4,a5,a8,c1,c2,c3,c4,e2,e3,e4,e5,e6,e7,d0,e9,p,f1,f2,0,!0,!0,!b4,!1,!0)
if(c===0)if(f2)if(e9.bv==null){e=$.jS()
a0=e.length
a2=new A.aZ(!0,a0,d0,d0)
c8=$.l!=null
if(c8){c8=a2.c=A.aK(a0*4)
c9=d0}else{c8=a2.d=new Uint32Array(a0)
c9=c8
c8=d0}if(c8!=null){c9=i.a(A.v($.l.memory).buffer)
a0=new Uint32Array(c9,c8,a0)}else{c9.toString
a0=c9}B.j.em(a0,0,e)
e9.bv=a2}e=d4.c
if(e!=null){a0=i.a(A.v($.l.memory).buffer)
b2=d4.b
e=new Uint32Array(a0,e,b2)}else{e=d4.d
e.toString}a0=b1.c
if(a0!=null){a2=i.a(A.v($.l.memory).buffer)
b2=b1.b
a0=new Uint32Array(a2,a0,b2)}else{a0=b1.d
a0.toString}a2=c7.c
if(a2!=null){c8=i.a(A.v($.l.memory).buffer)
b2=c7.b
a2=new Uint32Array(c8,a2,b2)}else{a2=c7.d
a2.toString}A.nv(e,d5,d6,d7,a0,a2,a8,a9,a4,a5,b,b4,c)}},
nv(c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=d1-c4,c2=!d4
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
j=A.t(k,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
i=A.t(i,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
g=A.t(g,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
e=A.t(e,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=e}}m+=4
continue}a1=d>>>24
if(k!==0&&a1!==0){a2=a1===255?k:A.T(k,a1)
if(!(a0>=0&&a0<r))return A.a(c3,a0)
j=A.t(a2,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}a3=c>>>24
if(i!==0&&a3!==0){a2=a3===255?i:A.T(i,a3)
j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.t(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}a4=b>>>24
if(g!==0&&a4!==0){a2=a4===255?g:A.T(g,a4)
j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.t(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}a5=a>>>24
if(e!==0&&a5!==0){a2=a5===255?e:A.T(e,a5)
j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.t(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}m+=4}while(m<c9){j=o+m
if(!(j>=0&&j<c2))return A.a(c7,j)
a6=c7[j]
if(a6!==0){if(!(j<s))return A.a(c8,j)
a7=c8[j]>>>24
if(a7!==0){a2=a7===255?a6:A.T(a6,a7)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(c3,a8)
j=A.t(a2,c3[a8])
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
j=A.t(k,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}if(i!==0){j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
i=A.t(i,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=i}if(g!==0){j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
g=A.t(g,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=g}if(e!==0){j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
e=A.t(e,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=e}}m+=4
continue}a9=255-(d>>>24)
if(k!==0&&a9!==0){a2=a9===255?k:A.T(k,a9)
if(!(a0>=0&&a0<r))return A.a(c3,a0)
j=A.t(a2,c3[a0])
c3.$flags&2&&A.d(c3)
c3[a0]=j}b0=255-(c>>>24)
if(i!==0&&b0!==0){a2=b0===255?i:A.T(i,b0)
j=a0+1
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.t(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}b1=255-(b>>>24)
if(g!==0&&b1!==0){a2=b1===255?g:A.T(g,b1)
j=a0+2
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.t(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}b2=255-(a>>>24)
if(e!==0&&b2!==0){a2=b2===255?e:A.T(e,b2)
j=a0+3
if(!(j>=0&&j<r))return A.a(c3,j)
h=A.t(a2,c3[j])
c3.$flags&2&&A.d(c3)
c3[j]=h}m+=4}while(m<c9){j=o+m
if(!(j>=0&&j<c2))return A.a(c7,j)
a6=c7[j]
if(a6!==0){if(!(j<s))return A.a(c8,j)
b3=255-(c8[j]>>>24)
if(b3!==0){a2=b3===255?a6:A.T(a6,b3)
a8=n+m
if(!(a8>=0&&a8<r))return A.a(c3,a8)
j=A.t(a2,c3[a8])
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
if(a7!==255){f=$.jS()
if(!(a7<f.length))return A.a(f,a7)
b8=f[a7]
b5=b5*b8>>>16
b6=b6*b8>>>16
b7=b7*b8>>>16}b9=19595*b5+38470*b6+7471*b7>>>16
c0=b9>255?255:b9
b3=d3?255-c0:c0}if(b3===0)continue
a2=b3===255?a6:A.T(a6,b3)
a8=n+m
if(r){if(!(a8>=0&&a8<s))return A.a(c3,a8)
f=A.t(a2,c3[a8])}else{if(!(a8>=0&&a8<s))return A.a(c3,a8)
f=A.ec(a2,c3[a8],d5)}c3.$flags&2&&A.d(c3)
if(!(a8>=0&&a8<s))return A.a(c3,a8)
c3[a8]=f}}},
eM(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eK(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eN(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eL(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eI(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaD()){i.$flags&2&&A.d(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gcn()){a.cY(b)
s=a.z
r=a.Q
i.$flags&2&&A.d(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.e5(b)
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
c0(i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0=null
if(!i1.ef(i2))return
s=k2?i4:i0
r=k7?255:i1.hk(i2,i3)
q=k4?i1.aR(i2):255
if(r===0||q===0)return
if(!k7)p=k6&&r===255&&q===255
else p=!0
o=p?i0:i1.as
if(o!=null){n=i1.az(i2)
if(n==null)return
m=B.c.P(A.eM(n,j2,j4,j6))-1
l=B.c.P(A.eN(n,j3,j5,j7))-1
k=B.c.U(A.eK(n,j2,j4,j6))+1
j=B.c.U(A.eL(n,j3,j5,j7))+1
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
b=B.a.M(e,8)
p=-c
a=B.a.M(p,8)
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
if(j9.b)A.iJ(a9,p)
else A.cg(a9.gv(),p)}p=a6?k0:k0+1
A.c0(i1,i2,255,a9,b0,b1,b2,a2,a3,a4,a5,j2,j3,j4,j5,j6,j7,j8,j9,p,k1,a6?k2:j9.b,0,!1,!1,!1,!0,!0)
b3=A.a1(r*q)
if(!k6)b4=d===0&&c===0
else b4=!0
p=!1
if(!b4)if(k3===0)if(s!=null)if(b2===a7)if(b0===a2)if(b1===a3)p=(!a6||b3===255)&&A.oH(s,(h-i6)*i7+i-i5,i7,a9,a7,a8,i-a2,h-a3,g-i,f-h,b,a,a0,a1,(255-o.aN(16)<<16|255-o.aN(8)<<8|255-o.aN(0))>>>0,b3)
if(p)return
A.nu(o,b3,k3,a9.gv(),b0,b1,b2,new A.b2([a2,a3,a4,a5]),i4.gv(),i5,i6,i7,new A.b2([i,h,g,f]),b,a,a0,a1,a6,b4)
return}b5=k8?i1.at:i0
b6=b5==null?i0:b5.fM(i2)
b7=k6&&b6!=null&&b6>>>24===255?i0:b6
if(q!==255||b7!=null){p=b7==null
b3=p?q:A.a1((b7>>>24)*q)
if(b3===0)return
n=i1.az(i2)
if(n==null)return
i=Math.max(i8,B.c.P(A.eM(n,j2,j4,j6))-1)
h=Math.max(i9,B.c.P(A.eN(n,j3,j5,j7))-1)
g=Math.min(j0,B.c.U(A.eK(n,j2,j4,j6))+1)
f=Math.min(j1,B.c.U(A.eL(n,j3,j5,j7))+1)
a7=g-i
a8=f-h
if(a7<=0||a8<=0)return
e=a7*a8
a9=j9.aJ(k0*3+2,e)
if(k2)A.iJ(a9,e)
else A.cg(a9.gv(),e)
A.c0(i1,i2,i3,a9,i,h,a7,i,h,g,f,j2,j3,j4,j5,j6,j7,j8,j9,k0+1,k1,k2,0,!1,!1,k6,!1,!1)
b8=a9.gv()
b9=i4.gv()
c0=(h-i6)*i7+i-i5
for(e=b9.length,c1=k3===0,c2=b8.length,c3=b9.$flags|0,c4=0;c4<a8;++c4,c0+=i7)for(c5=c4*a7,c6=0;c6<a7;++c6){c7=c5+c6
if(!(c7>=0&&c7<c2))return A.a(b8,c7)
c8=b8[c7]
if(c8===0)continue
if(p)c9=A.T(c8,b3)
else{d0=(c8>>>24)*b3+128
c9=A.T((b7&16777215|4278190080)>>>0,B.a.M(d0+B.a.M(d0,8),8))}d1=c0+c6
if(c1){if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.t(c9,b9[d1])}else{if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ec(c9,b9[d1],k3)}c3&2&&A.d(b9)
if(!(d1>=0&&d1<e))return A.a(b9,d1)
b9[d1]=c7}return}if(i1.ge1()){for(c8=i1,d2=0;c8!=null;c8=c8.cy)++d2
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
d4=j2}e3=k1&&i1.ge3()
e4=i1.z
if(e4!=null&&i1.ghb()){e5=e3&&i1.ghe()?new A.co([d4,d5,d6,d7,d8,d9,i8,i9,j0,j1]):i0
p=e5==null
e6=p?i0:j9.di(i1,e5)
if(e6==null){e7=j9.cK(k0)
e7.l(0)
A.o2(e4,i2,d4,d5,d6,d7,d8,d9,i8,i9,j0,j1,e7,j9,k0)
if(!p)j9.c_(i1,e5,e7)}else if(j8==null&&e6.b!==0){e7=j9.cK(k0)
e7.dV(e6)}else e7=e6
if(e7.b===0)return
if(j8!=null){e8=j9.eB(k0)
A.fu(e7,j8,e8)
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
if(f4!=null)A.l8(f4,i2,r,i4,i5,i6,i7,f0,f1,f2,f3,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2,k3)
f5=i1.f
if(f5!=null){p=i1.x
if(p!=null){p=p.n(i2)
if(0>=p.length)return A.a(p,0)
p=p[0]
e=f5.f
e===$&&A.F()
c1=f5.d
c1===$&&A.F()
f6=p*e-c1}else f6=(i2-i1.r)/i1.w
p=f5.b
p===$&&A.F()
e=f5.c
e===$&&A.F()
if(Math.abs(d5)<1e-9&&Math.abs(d6)<1e-9){c1=d4>=0
i=B.c.P(d8+(c1?0:d4*p))
g=B.c.U(d8+(c1?d4*p:0))
p=d7>=0
h=B.c.P(d9+(p?0:d7*e))
f=B.c.U(d9+(p?d7*e:0))
f7=Math.max(f0,i)
f8=Math.max(f1,h)
f9=Math.min(f2,g)
g0=Math.min(f3,f)
if(f7<f9&&f8<g0)A.jC(f5,f6,r,i4,i5,i6,i7,f7,f8,f9,g0,d4,d5,d6,d7,d8,d9,e9,j9,k0+1,e3,k2)}else{g1=f5.gdQ()
g2=Math.max(f0,B.c.P(A.eM(g1,d4,d6,d8))-1)
g3=Math.max(f1,B.c.P(A.eN(g1,d5,d7,d9))-1)
g4=Math.min(f2,B.c.U(A.eK(g1,d4,d6,d8))+1)
g5=Math.min(f3,B.c.U(A.eL(g1,d5,d7,d9))+1)
if(g2<g4&&g3<g5){g6=g4-g2
c1=g6*(g5-g3)
g7=j9.aJ(k0*3+2,c1)
if(k2)A.iJ(g7,c1)
else A.cg(g7.gv(),c1)
A.jC(f5,f6,r,g7,g2,g3,g6,g2,g3,g4,g5,d4,d5,d6,d7,d8,d9,i0,j9,k0+1,e3,k2)
c1=j9.db
c1.l(0)
c1.a3(!0)
c1.p(d8,d9)
c2=d4*p
p=d5*p
c1.p(c2+d8,p+d9)
c3=d6*e
e=d7*e
c1.p(c2+c3+d8,p+e+d9)
c1.p(c3+d8,e+d9)
c1.a1()
j9.aL(c1,!1,j9.gbN(),g2,g3,g4,g5)
g8=j9.gbN()
if(e9!=null){A.fu(j9.gbN(),e9,j9.gbm())
g8=j9.gbm()}g9=g8.b*2
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
if(c8!==0){h9=c3?c8:A.aq(c8,h5)
c5=h7+h8
if(!(c5>=0&&c5<e))return A.a(b9,c5)
c7=A.t(h9,b9[c5])
c2&2&&A.d(b9)
b9[c5]=c7}}}}}}},
nu(c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=d1.a,c0=b9[0],c1=b9[1],c2=b9[2],c3=b9[3]
b9=d6.a
s=b9[0]
r=b9[1]
q=b9[2]
p=b9[3]
o=255-c4.aN(16)
n=255-c4.aN(8)
m=255-c4.aN(0)
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
if(b4!==0){a4=A.a1(o*b4)
if(typeof a4!=="number")return A.U(a4)
a4=A.a1((a5>>>16&255)*(255-a4))
if(typeof a4!=="number")return a4.a9()
b5=A.a1(n*b4)
if(typeof b5!=="number")return A.U(b5)
b5=A.a1((a5>>>8&255)*(255-b5))
if(typeof b5!=="number")return b5.a9()
b6=A.a1(m*b4)
if(typeof b6!=="number")return A.U(b6)
b6=A.a1((a5&255)*(255-b6))
if(typeof b6!=="number")return A.U(b6)
a5=(a5&4278190080|a4<<16|b5<<8|b6)>>>0}}b7=a0+a3
if(e1){d2.$flags&2&&A.d(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a5}else{if(k)a5=A.T(a5,c5)
if(l){if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.t(a5,d2[b7])}else{if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ec(a5,d2[b7],c6)}d2.$flags&2&&A.d(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a4}}}if(e1&&k)for(f=r;f<p;++f){b8=(f-d4)*d5-d3
for(a3=s;a3<q;++a3){l=b8+a3
if(!(l>=0&&l<b9))return A.a(d2,l)
k=A.T(d2[l],c5)
d2.$flags&2&&A.d(d2)
d2[l]=k}}},
o2(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.eD(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.E(0.25/e,0.005,1.5),c=new A.io(b1.eC(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.b.gaf(a).gc9())c.$2(B.b.gaf(a),b0)
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
i=B.a.E(B.c.H(j[0]*2.56),0,256)
if(i!==256)s.el(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aM(g,a6,o,256)
if(j){s.aT(r)
A.cY(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aT(s)
else if(j)A.cY(q,s,b0,k)
else{b0.aT(r)
A.cY(r,s,b0,k)}n=!0}}},
nB(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.d(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.kW(a,Math.abs(b),2,2,4,c,d,e)},
l8(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gck())s=c
else{r=f.e.n(b)
if(0>=r.length)return A.a(r,0)
s=B.a.E(B.c.H(c*B.c.H(r[0])/100),0,255)}if(s===0)return
if(!f.gaD()){q=b3.c3(b4)
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
p=a6}j=b5&&f.gaP()
i=a.gb7()
for(h=i.length-1,r=b4+1;h>=0;--h){if(!(h<i.length))return A.a(i,h)
g=i[h]
if(g instanceof A.a8)A.l8(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.bk)A.o5(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
o5(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.n(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.a.E(B.c.H(c0*B.c.H(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gc4())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gI()
b7=b7!==!1
r=b7}b8.id!==$&&A.R()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.co([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.di(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.b.aq(b8.a,A.jP())
b8.fx!==$&&A.R()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.b0(b9)
if(l==null)return
n=[Math.max(c5,B.c.P(A.eM(l,c9,d1,d3))-2),Math.max(c6,B.c.P(A.eN(l,d0,d2,d4))-2),Math.min(c7,B.c.U(A.eK(l,c9,d1,d3))+2),Math.min(c8,B.c.U(A.eL(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gaZ()
m=b8.a
A.im(m,0,m.length,b9,new A.bC([c9,d0,d1,d2,d3,d4]),new A.b2(n),b8.f,o,d6,0)}else{l=A.o1(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
f=d5==null&&b8.y==null&&d9===0
if(f&&d8){e=A.jH(b8,b9,s)
if(d6.fo(d6.dy,g,d6.gaZ(),k,j,i,h,c1,c2,c3,c4,e)){o=d6.gaZ()
if(!b7&&o.b>0)d6.c_(b8,p,o)
return}}else if(f&&!d8&&b7){e=A.jH(b8,b9,s)
n=c1.gv()
m=d6.ch
if(m==null)m=d6.ch=A.kb(256)
if(m.hr(d6.dy,g,k,j,i,h,n,c2,c3,c4,e))return}d6.aL(d6.dy,g,d6.gaZ(),k,j,i,h)
o=d6.gaZ()}if(!b7&&o.b>0)d6.c_(b8,p,o)}if(d5!=null){A.fu(o,d5,d6.gbm())
o=d6.gbm()}if(o.b===0)return
d=d8?c1:b6
c=b8.y
if(c==null){e=A.jH(b8,b9,s)
if(d9===0)A.ku(c1.gv(),c2,c3,c4,o,e,d)
else A.mH(c1.gv(),c2,c3,c4,o,e,d9,d)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.nz(c,b9,d6)
a7=c.d.n(b9)
a8=c.e.n(b9)
if(c.ghd()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=c.h8(b9,a9,b0)
if(b1!=null){A.nC(c1.gv(),c2,c3,c4,o,a6.gv(),s,new A.bC([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
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
b5=A.oG(d,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
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
A.mK(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gv()
b2=a6.gv()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.mJ(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
nC(b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=c0.a,a1=a0[0],a2=a0[1],a3=a0[2],a4=a0[3],a5=a0[4],a6=a0[5],a7=c4.a,a8=c4.b,a9=1-a7*a7-a8*a8,b0=a1/c3,b1=a2/c3,b2=b7.a.gv()
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
if(s)a=A.T(a,b9)
if(n)a=A.aq(a,j)
if(!(d>=0&&d<a0))return A.a(b3,d)
i=A.t(a,b3[d])
b3.$flags&2&&A.d(b3)
b3[d]=i}}},
dy(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aS){s=a.c
if(s===$){r=a.b!==1||B.b.aq(a.a,A.jP())
a.c!==$&&A.R()
a.c=r
s=r}q=s
break A}if(a instanceof A.a8){s=a.r
if(s===$){r=B.b.aq(a.a,A.jP())
a.r!==$&&A.R()
a.r=r
s=r}q=s
break A}if(a instanceof A.V){q=A.dy(a.a)
break A}q=!1
break A}return q},
im(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.dy(a[b])}else s=!1
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
if(!A.dy(j))A.bF(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.l(0)
else{s=a0.a
a3.aL(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dy(j))continue
if(a2.b===0)A.eJ(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.ao(i)
A.eJ(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.ao(h)
f.aT(a2)
A.cY(f,g,a2,a1?5:2)}}},
eJ(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
A:{s=a0 instanceof A.a8
r=s?a0:null
if(s){s=a2.a
q=s[0]
p=s[1]
o=s[2]
n=s[3]
m=s[4]
l=s[5]
s=r.c
if(!s.gaD()){k=a6.d1(a7)
A.eI(s,a1,q,p,o,n,m,l,k)
a2=new A.bC([k[0],k[1],k[2],k[3],k[4],k[5]])}s=r.a
A.im(s,0,s.length,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.V
j=s?a0:null
if(s){A.eJ(j.a,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.aS
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
if(A.dy(b))A.eJ(b,a1,a2,a3,!1,e,a6,d)
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
a6.aL(a,!1,e,d[0],d[1],d[2],d[3])}A.cY(f,e,a5,s)
break A}throw A.f(A.aG("Expected a boolean path"))}},
o1(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8=a9.e
if(a8){s=a9.d.n(b0)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a7}else r=0
q=a9.b0(b0)
if(q==null)return a7
s=B.c.P(A.eM(q,b5,b7,b9))
p=B.c.P(A.eN(q,b6,b8,c0))
o=B.c.U(A.eK(q,b5,b7,b9))
n=B.c.U(A.eL(q,b6,b8,c0))
m=Math.max(b1,s-2)
l=Math.max(b2,p-2)
k=Math.min(b3,o+2)
j=Math.min(b4,n+2)
if(m>=k||l>=j)return a7
i=a9.go
if(i===$){h=a9.fA()
a9.go!==$&&A.R()
a9.go=h
i=h}if(i!=null){g=c1.dq(i,b0)
if(g.r===0)return a7
a8=c1.dy
a8.l(0)
a8.aF(g,b5,b6,b7,b8,b9,c0)
return new A.b2([m,l,k,j])}if(!a8&&a9.z==null&&a9.a.length===1){f=B.b.gaf(a9.a)
while(f instanceof A.V)f=f.a
if(f instanceof A.aA&&!f.gI()){e=c1.dy
e.l(0)
A.l_(f,b0,0.0625,e,new A.bC([b5,b6,b7,b8,b9,c0]));++c1.w
return e.r===0?a7:new A.b2([m,l,k,j])}}d=Math.max(Math.sqrt(b5*b5+b6*b6),Math.sqrt(b7*b7+b8*b8))
c=d<=0.000001?0.25:B.c.E(0.25/d,0.005,1.5)
b=c*c
a=c1.db
a.l(0)
a0=a9.a
for(a1=a0.length-1;a1>=0;--a1){if(!(a1<a0.length))return A.a(a0,a1)
A.bF(a0[a1],b0,1,0,0,1,0,0,b,a,c1,0,0)}if(a.r===0)return a7
a2=a9.z
if(a2!=null){a3=c1.dx
a3.l(0)
A.nk(a,a2,b0,a3,c1.p3)
if(a3.r===0)return a7
a4=a3}else a4=a
if(a8){a5=c1.fr
a5.l(0)
A.kW(a4,r*0.5,a9.r,a9.w,a9.x,c,a5,c1.gdr())
if(a5.r===0)return a7
a4=a5}a6=c1.dy
a6.l(0)
a6.aF(a4,b5,b6,b7,b8,b9,c0)
return new A.b2([m,l,k,j])},
jH(a,b,c){var s,r,q=a.b.n(b),p=q.length
if(0>=p)return A.a(q,0)
s=B.a.E(B.c.H(q[0]*255),0,255)
if(1>=p)return A.a(q,1)
r=B.a.E(B.c.H(q[1]*255),0,255)
if(2>=p)return A.a(q,2)
return A.kv(c,s,r,B.a.E(B.c.H(q[2]*255),0,255))},
nz(a,b,c){var s,r,q,p
if(a.c.a!=null){s=c.ci
r=s.h(0,a)
if(r!=null)return r.b
if(s.a>=256)s.F(0,new A.N(s,s.$ti.i("N<1>")).ga4(0)).b.a_()
q=A.fj(1024)
p=c.ay
p.toString
s.q(0,a,new A.ad(p,q,t.dL))
A.kZ(a,b,q.gv())
return q}q=c.aO
if(q==null)q=c.aO=A.fj(1024)
A.kZ(a,b,q.gv())
return q},
kZ(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a6.c.n(a7),a4=a6.a,a5=a6.x
for(s=a3.length,r=0;r<a4;++r){q=4*r
p=3*r
o=q+1
if(!(o<s))return A.a(a3,o)
o=A.fI(a3[o])
a5.$flags&2&&A.d(a5)
n=a5.length
if(!(p<n))return A.a(a5,p)
a5[p]=o
o=p+1
m=q+2
if(!(m<s))return A.a(a3,m)
m=A.fI(a3[m])
a5.$flags&2&&A.d(a5)
if(!(o<n))return A.a(a5,o)
a5[o]=m
m=p+2
o=q+3
if(!(o<s))return A.a(a3,o)
o=A.fI(a3[o])
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
d=e<=1e-12?0:B.c.E((j-f)/e,0,1)
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
a1=A.kv(B.a.E(B.c.H(a6.eL(a3,j)*255),0,255),B.a.E(B.c.H((m+(g-m)*d)*255),0,255),B.a.E(B.c.H((a+(a0-a)*d)*255),0,255),B.a.E(B.c.H((a1+(a2-a1)*d)*255),0,255))
a8.$flags&2&&A.d(a8)
if(!(k<a8.length))return A.a(a8,k)
a8[k]=a1}},
jq(a){return new A.bA(a,A.h([],t.ch))},
kB(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.a.K(b.gct()-s,2)),q=new Float32Array(a*3)
s=Math.max(2,a+Math.max(0,B.a.K(b.gct()-s,2)))
new Float64Array(s)
return new A.bh(a,r,b,c,d,f,g,e,q)},
n6(a,b,c,d,e){return new A.bD(a,b,c,d,e,A.ae(t.S,t.W))},
kz(a,b){var s=a.length
return new A.cm(a,b,new Float64Array(s))},
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
return new A.ay(s,r,q,p>o?p:o)},
jv(a,b,c,d,e,f,g,h,i){return new A.c_(a,b,c,d,e,f,g,h,i)},
n5(){var s=null,r=t.n
return A.jv(A.ch(A.h([0,0],r)),A.ch(A.h([0,0],r)),A.ch(A.h([100,100],r)),A.ch(A.h([0],r)),A.ch(A.h([100],r)),s,s,s,s)},
jw(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
eD(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
mU(a,b,c,d,e){return new A.aa(a,b,c,d,e)},
kC(a,b,c){return new A.hL(a,b,c)},
kD(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.a9(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
js(a,b,c){return new A.a8(a,b,c)},
mV(a,b){return new A.aS(a,b)},
il(a,b,c){if(c>0)return new A.A(a,-b)
if(c<0)return new A.A(-a,b)
return B.aE},
ju(a,b,c,d,e,f,g,h,i,j,k){return new A.bk(a,b,c,d,e,f,g,h,i,k,j)},
ik:function ik(a,b){this.a=a
this.b=b},
hZ:function hZ(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=null},
ce:function ce(a){this.a=a},
fp:function fp(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){var _=this
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
_.bu=a7
_.ci=a8
_.bv=_.aO=null
_.dY=a9},
fq:function fq(a,b){this.a=a
this.b=b},
fr:function fr(a){this.a=a},
fs:function fs(a){this.a=a},
ft:function ft(a){this.a=a},
ad:function ad(a,b,c){this.a=a
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
h7:function h7(a){this.a=a},
fY:function fY(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fZ:function fZ(a,b,c){this.a=a
this.b=b
this.c=c},
fX:function fX(a){this.a=a},
h3:function h3(a,b,c){this.a=a
this.b=b
this.c=c},
h4:function h4(a,b,c){this.a=a
this.b=b
this.c=c},
h5:function h5(a,b,c){this.a=a
this.b=b
this.c=c},
h2:function h2(a){this.a=a},
h0:function h0(){},
h1:function h1(){},
h_:function h_(a,b){this.a=a
this.b=b},
h6:function h6(){},
hd:function hd(a,b){this.a=a
this.b=b},
hW:function hW(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
er:function er(a){this.b=a},
hs:function hs(a){this.a=a},
ht:function ht(a,b){this.a=a
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
hr:function hr(a,b){this.a=a
this.b=b},
hg:function hg(a,b){this.a=a
this.b=b},
hi:function hi(a,b){this.a=a
this.b=b},
hh:function hh(a,b){this.a=a
this.b=b},
hu:function hu(a,b){this.a=a
this.b=b},
hf:function hf(a,b){this.a=a
this.b=b},
hk:function hk(a,b){this.a=a
this.b=b},
hj:function hj(a,b){this.a=a
this.b=b},
hl:function hl(a,b){this.a=a
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
V:function V(a){this.a=a},
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
i2:function i2(){},
cm:function cm(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
h8:function h8(){},
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
aa:function aa(a,b,c,d,e){var _=this
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
he:function he(){},
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
_.fy=_.fx=_.dy=_.dx=_.db=$
_.go=null
_.id=0/0},
hQ:function hQ(){},
hO:function hO(){},
hP:function hP(){},
hR:function hR(){},
a8:function a8(a,b,c){var _=this
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
aS:function aS(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
hT:function hT(){},
hS:function hS(){},
et:function et(){},
aA:function aA(a,b,c){var _=this
_.e=a
_.f=b
_.r=c
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
i_:function i_(){},
cV(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.aj(s,r,q,p,new Uint8Array(a))},
br:function br(a){this.a=a},
aj:function aj(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
cY(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
if(a9===4){A.fu(a6,a7,a8)
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
break}if(a8.aM(f,c,a0-c,l)){l=a6.a
j=l.b
if(j!=null){a3=o.a(A.v($.l.memory).buffer)
a4=l.a
s=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
s=l}l=a7.a
j=l.b
if(j!=null){a3=o.a(A.v($.l.memory).buffer)
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
fu(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
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
if(a3>0&&a7.aM(h,a1,a2-a1,a3)){l=a5.a
j=l.b
if(j!=null){d=s.a(A.v($.l.memory).buffer)
a4=l.a
p=new Int32Array(d,j,a4)}else{l=l.c
l.toString
p=l}l=a6.a
j=l.b
if(j!=null){d=s.a(A.v($.l.memory).buffer)
a4=l.a
o=new Int32Array(d,j,a4)}else{l=l.c
l.toString
o=l}}}if(a<=a0)n+=2
if(a0<=a)m+=2}}},
kb(a){var s=new Int32Array(8192),r=new Int32Array(8192),q=new Int32Array(8192),p=new Int32Array(8192),o=new Int32Array(0),n=Math.max(64,a),m=new Int32Array(n)
B.e.ac(m,0,n,-1)
return new A.f_(n,m,s,r,q,p,o)},
cG(a){if(a>=-1048576&&a<=1048576)return B.c.H(a*256)
if(!isFinite(a))return 0
return a>0?268435456:-268435456},
j0(a,b){var s=B.a.b5(B.a.M(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
aF:function aF(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
f_:function f_(a,b,c,d,e,f,g){var _=this
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
cg(a,b){var s,r,q
if(b<=0)return
if(b<=16384){B.j.C(a,0,b,$.jT())
return}for(s=0;s<b;s=r){r=s+16384
q=r<b?r:b
B.j.C(a,s,q,$.jT())}},
kv(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.a.K(b*a+127,255)<<16|B.a.K(c*a+127,255)<<8|B.a.K(d*a+127,255))>>>0},
aq(a,b){if(b>=256)return a
if(b<=0||a===0)return 0
return((a&16711935)*b+8388736>>>8&16711935|(a>>>8&16711935)*b+8388736&4278255360)>>>0},
t(a,b){var s,r,q,p
if(a===0)return b
s=a>>>24
if(s===255||b===0)return a
r=255-s
q=(b&16711935)*r+8388736
p=(b>>>8&16711935)*r+8388736
return a+((B.a.M(q+(B.a.M(q,8)&16711935),8)&16711935|p+(B.a.M(p,8)&16711935)&4278255360)>>>0)},
T(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.a.M(s+(B.a.M(s,8)&16711935),8)&16711935|r+(B.a.M(r,8)&16711935)&4278255360)>>>0},
ku(a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(a7===0||a6.b===0)return
if(a8!=null&&A.oL(a8,a3,a4,a5,a6.a,a6.b,a7))return
s=a6.b*2
r=a6.a.gv()
for(q=a2.length,p=a7>>>24===255,o=r.length,n=0;n<s;n+=2){if(!(n<o))return A.a(r,n)
m=r[n]
l=n+1
if(!(l<o))return A.a(r,l)
k=r[l]
j=k>>>8
i=(k&255)+1
h=i===256?a7:A.aq(a7,i)
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
l=a1===0?h:A.jn(h,a1,a0)
a2.$flags&2&&A.d(a2)
a2[f]=l}else for(c=f;c<e;++c){if(!(c>=0&&c<q))return A.a(a2,c)
a1=a2[c]
l=a1===0?h:A.jn(h,a1,a0)
a2.$flags&2&&A.d(a2)
a2[c]=l}}}},
ks(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
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
m=j===0?f:A.jn(f,j,k)
n&2&&A.d(a)
a[o]=m}}},
jn(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.a.M(s+(B.a.M(s,8)&16711935),8)&16711935|r+(B.a.M(r,8)&16711935)&4278255360)>>>0)},
mJ(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8=null,c9=1023
if(d6===0||d4.b===0)return
s=e5-e3
r=e6-e4
q=s*s+r*r
if(q<=1e-12){if(0>=d5.length)return A.a(d5,0)
p=d5[0]
A.ku(d0,d1,d2,d3,d4,d6<255?A.T(p,d6):p,c8)
return}o=1/q
n=(d7*s+d8*r)*o
m=d4.b*2
l=d4.a.gv()
k=d6>=255
j=d5.length
if(k){if(0>=j)return A.a(d5,0)
i=d5[0]}else{if(0>=j)return A.a(d5,0)
i=A.T(d5[0],d6)}if(k){if(1023>=j)return A.a(d5,1023)
h=d5[1023]}else{if(1023>=j)return A.a(d5,1023)
h=A.T(d5[1023],d6)}for(g=d0.length,f=l.length,e=n<=0,d=n>=0,c=d0.$flags|0,b=0;b<m;b+=2){if(!(b<f))return A.a(l,b)
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
if(a8<=0&&e){A.ks(d0,c8,c8,a9,a4,a5===256?i:A.aq(i,a5))
continue}if(a8>=1&&d){A.ks(d0,c8,c8,a9,a4,a5===256?h:A.aq(h,a5))
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
c6=A.t(c0,d0[b2])
c&2&&A.d(d0)
d0[b2]=c6
if(!(c4>=0&&c4<g))return A.a(d0,c4)
d0[c4]=A.t(c1,d0[c4])
if(!(c5>=0&&c5<g))return A.a(d0,c5)
d0[c5]=A.t(c2,d0[c5])
if(!(b3>=0&&b3<g))return A.a(d0,b3)
d0[b3]=A.t(c3,d0[b3])}b2+=4}while(b2<b0){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=d5[c7]
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}}else if(k)for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.aq(d5[c7],a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}else if(a0)for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
a0=A.T(d5[c7],d6)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(a0,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}else for(b2=a9;b2<b0;){if(a8<=0)c7=0
else c7=a8>=1?c9:B.c.N(a8*1023+0.5)
if(!(c7>=0&&c7<j))return A.a(d5,c7)
p=A.aq(A.T(d5[c7],d6),a5)
if(!(b2>=0&&b2<g))return A.a(d0,b2)
a0=A.t(p,d0[b2])
c&2&&A.d(d0)
d0[b2]=a0
a8+=n;++b2}}},
mK(e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9=1023
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
a5=A.t(d,e0[b9])
a2&2&&A.d(e0)
e0[b9]=a5
a5=b9+1
if(!(a5<b))return A.a(e0,a5)
e0[a5]=A.t(d,e0[a5])
a5=b9+2
if(!(a5<b))return A.a(e0,a5)
e0[a5]=A.t(d,e0[a5])
a5=b9+3
if(!(a5<b))return A.a(e0,a5)
e0[a5]=A.t(d,e0[a5])}b9+=4
continue}a5=$.dE()
a5.$flags&2&&A.d(a5)
a5[0]=c0
c4=a5[0]
a5[0]=c1
c5=a5[0]
a5[0]=c2
c6=a5[0]
a5[0]=c3
c7=new A.aP(c4,c5,c6,a5[0]).cE()
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
c6=A.t(d1,e0[b9])
a2&2&&A.d(e0)
e0[b9]=c6
if(!(a5>=0&&a5<b))return A.a(e0,a5)
e0[a5]=A.t(d2,e0[a5])
if(!(c4>=0&&c4<b))return A.a(e0,c4)
e0[c4]=A.t(d3,e0[c4])
if(!(c5>=0&&c5<b))return A.a(e0,c5)
e0[c5]=A.t(d4,e0[c5])}b9+=4}while(b9<b7){d5=b4>0?b4:0
d6=d5>=1?d9:B.c.N(Math.sqrt(d5)*1023+0.5)
if(!(d6>=0&&d6<e))return A.a(e5,d6)
a5=e5[d6]
if(!(b9>=0&&b9<b))return A.a(e0,b9)
a5=A.t(a5,e0[b9])
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
d1=d2}else{c4=$.dE()
c4.$flags&2&&A.d(c4)
c4[0]=c0
c5=c4[0]
c4[0]=c1
c6=c4[0]
c4[0]=c2
d7=c4[0]
c4[0]=c3
c7=new A.aP(c5,c6,d7,c4[0]).cE()
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
d4=e5[c4]}if(f){d1=A.T(d1,e6)
d2=A.T(d2,e6)
d3=A.T(d3,e6)
d4=A.T(d4,e6)}if(a5){d1=A.aq(d1,a9)
d2=A.aq(d2,a9)
d3=A.aq(d3,a9)
d4=A.aq(d4,a9)}if(!(b9>=0&&b9<b))return A.a(e0,b9)
c4=A.t(d1,e0[b9])
a2&2&&A.d(e0)
e0[b9]=c4
c4=b9+1
if(!(c4<b))return A.a(e0,c4)
e0[c4]=A.t(d2,e0[c4])
c4=b9+2
if(!(c4<b))return A.a(e0,c4)
e0[c4]=A.t(d3,e0[c4])
c4=b9+3
if(!(c4<b))return A.a(e0,c4)
e0[c4]=A.t(d4,e0[c4])
b9+=4}while(b9<b7){d5=b4>0?b4:0
d6=d5>=1?d9:B.c.N(Math.sqrt(d5)*1023+0.5)
if(!(d6>=0&&d6<e))return A.a(e5,d6)
d8=e5[d6]
if(f)d8=A.T(d8,e6)
if(a5)d8=A.aq(d8,a9)
if(!(b9>=0&&b9<b))return A.a(e0,b9)
c4=A.t(d8,e0[b9])
a2&2&&A.d(e0)
e0[b9]=c4
b4+=b5
b5+=i;++b9}}}},
a1(a){var s=A.j(a)+128
return B.a.M(s+B.a.M(s,8),8)},
jl(a,b,c,d,e){var s
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
break}return A.a1(a*(255-d)+b*(255-c)+s)},
ec(a,b,c){var s,r,q,p,o,n,m,l,k
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
k=s+r-A.a1(s*r)
if(A.kw(c))return A.mG(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.a1(q*p)<<16|o+n-A.a1(o*n)<<8|m+l-A.a1(m*l))>>>0
return(k<<24|A.jl(q,p,s,r,c)<<16|A.jl(o,n,s,r,c)<<8|A.jl(m,l,s,r,c))>>>0},
kw(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
mG(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.aB(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.aB(o,n,m)
switch(j){case 12:s=A.fD(A.kt(p,A.jm(l)),A.eb(l))
break
case 13:s=A.fD(A.kt(l,A.jm(p)),A.eb(l))
break
case 14:s=A.fD(p,A.eb(l))
break
case 15:s=A.fD(l,A.eb(p))
break
default:s=new A.aB(A.jk(o,s,j),A.jk(n,r,j),A.jk(m,q,j))
break}r=new A.fB(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.a9()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.a9()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.U(s)
return(i<<24|q<<16|o<<8|s)>>>0},
jk(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
eb(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
jm(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
kt(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.jm(a)
if(o===0)return B.aL
return new A.aB((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
fD(a,b){var s=b-A.eb(a),r=a.a,q=a.b,p=a.c,o=new A.fE(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.aB(o.$1(r),o.$1(q),o.$1(p))},
kq(a,b){var s,r,q,p,o,n,m,l,k,j
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
return(s+r-A.a1(s*r)<<24|A.a1(o*p+n*q+o*n)<<16|A.a1(m*p+l*q+m*l)<<8|A.a1(k*p+j*q+k*j))>>>0},
kr(a,b){var s,r,q,p,o,n,m,l
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
return(s+r-A.a1(s*r)<<24|q+p-A.a1(q*p)<<16|o+n-A.a1(o*n)<<8|m+l-A.a1(m*l))>>>0},
mH(a,b,c,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d
if(a2===0)return
if(a4!=null&&!A.kw(a3)&&A.oF(a4,b,c,a0,a1.a,a1.b,a2,a3))return
s=a1.a.gv()
r=a1.b*2
if(a3===1){for(q=a.length,p=s.length,o=0,n=0,m=0,l=0;l<r;l+=2){if(!(l<p))return A.a(s,l)
k=s[l]
j=l+1
if(!(j<p))return A.a(s,j)
i=s[j]
h=A.aq(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<q))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.kq(h,d)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}return}if(a3===2){for(q=a.length,p=s.length,o=0,n=0,m=0,l=0;l<r;l+=2){if(!(l<p))return A.a(s,l)
k=s[l]
j=l+1
if(!(j<p))return A.a(s,j)
i=s[j]
h=A.aq(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<q))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.kr(h,d)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}return}for(q=a.length,p=s.length,o=0,n=0,m=0,l=0;l<r;l+=2){if(!(l<p))return A.a(s,l)
k=s[l]
j=l+1
if(!(j<p))return A.a(s,j)
i=s[j]
h=A.aq(a2,(i&255)+1)
if(h===0)continue
g=((k>>>16)-c)*a0+(k&65535)-b
f=g+(i>>>8)
for(e=g;e<f;++e){if(!(e>=0&&e<q))return A.a(a,e)
d=a[e]
if(h!==o||d!==n){m=A.ec(h,d,a3)
n=d
o=h}a.$flags&2&&A.d(a)
a[e]=m}}},
mI(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
if(a3===1){for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.d(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.kq(k,j)
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
continue}if(k!==q||j!==p){o=A.kr(k,j)
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
continue}if(k!==q||j!==p){o=A.ec(k,j,a3)
p=j
q=k}a.$flags&2&&A.d(a)
a[l]=o}},
fC:function fC(){},
fB:function fB(a,b,c){this.a=a
this.b=b
this.c=c},
fE:function fE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fL:function fL(a,b,c){this.a=a
this.b=b
this.c=c},
dM:function dM(a){this.a=a},
mg(a,b,c,d,e,f,g,h){var s=h&&b>=32?J.iU(B.i.ga7(e),e.byteOffset,e.length/4|0):null
s=new A.f9(a,b,c,d,e,f,g,g==null?null:A.jd(a.length,null,!1,t.cn),s)
s.ex(a,b,c,d,e,f,g,h)
return s},
ch(a){var s=new Float32Array(A.X(a))
return new A.C(s,null,!1,new Float32Array(0),!1)},
mN(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
mM(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
fI(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.P(s)
if(r>=4096)return 1
q=$.lv()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
f9:function f9(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
fa:function fa(){},
C:function C(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
eA:function eA(a,b){this.a=a
this.b=b},
jK(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.Z)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.o(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.b3(o)){n=o
break A}n=A.w(A.aE("Unsupported raster worker field",null))}l.push(n)}return new A.A(l,m)},
oq(e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1=null
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
if(n){A.L(q)
o=b5[7]
b8=t.p
if(b8.b(o)){b8.a(o)
b9=b5[11]
l=A.b3(b9)
if(l){A.aV(b9)
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
p=c6}A.L(b8)
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
a3=b5}}}if(b4){b4=[1,a3,A.L(d8?d7:e2.b)]
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
b4=typeof d9=="string"}}}if(b4){b4=[3,a3,A.L(e0?d9:e2.b)]
break A}a4=e1
b4=!1
if(t.dH.b(e2))if(2===(s?b6:e2.a)){if(p)b5=q
else{q=e2.b
b5=q
p=!0}if(typeof b5=="string"){a4=A.L(p?q:e2.b)
if(j)b4=k
else{k=e2.c
b4=k
j=!0}b4=A.o(b4)}}if(b4){b4=[2,a4,A.j(j?k:e2.c)]
break A}b4=A.w(A.aE("Unsupported raster worker reply",e1))}return A.jK(b4)},
fN:function fN(a){this.a=a},
oJ(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.a.E(B.c.P(Math.min(a*c,s)),0,s)},
oM(b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=A.cV(32,512),c=A.cV(32,512),b=A.cV(32,512),a=A.cV(32,512),a0=A.cV(32,512),a1=t.fM,a2=A.h([],a1),a3=A.h([],a1),a4=A.h([],a1),a5=A.h([],a1),a6=t.dh,a7=A.h([],a6),a8=A.h([],t.cU),a9=A.h([],a6),b0=A.h([],t.by),b1=t.n,b2=A.h([],b1)
b1=A.h([],b1)
s=new Float64Array(256)
r=t.bU
q=A.h([],r)
p=A.h([],a1)
a1=A.h([],a1)
o=A.h([],r)
r=A.h([],r)
n=A.h([],t.a2)
a6=A.h([],a6)
m=$.l!=null
l=new A.fp(m,new A.ah(t.el),d,c,b,a,a0,a2,a3,a4,a5,a7,a8,a9,b0,b2,b1,new A.br(s),!1,q,p,a1,o,r,n,new A.ah(t.gS),new A.ah(t.fk),new A.ah(t.gj),a6)
d=t.N
k=A.ae(d,d)
c=t.x
b=new Uint8Array(32)
a=new Uint8Array(16)
a0=new Uint8Array(65536)
j=new A.eS(null,A.ae(c,t.g2),A.ae(d,t.cJ),A.ae(c,t.gz),A.jc(c),A.ae(d,t.eY),b,a,a0)
c=new Int32Array(16384)
b=new Uint8Array(131072)
i=new A.fG()
h=A.ae(d,t.fW)
g=new A.fx()
$.jR()
d=$.ji.$0()
g.a=d
g.b=null
f=A.fj(65536)
e.a=0
d=b3.a
new A.ck(d,A.n(d).i("ck<1>")).hl(new A.iK(e,j,h,l,f,b3,new A.iP(h,l,k),k,new A.iL(e,f,i),new A.iN(f),i,new A.iQ(j,h,l),new A.iO(e,f,i),new A.iR(k,b3),g,new A.iM(g),new A.fd(c,b)))},
iM:function iM(a){this.a=a},
iL:function iL(a,b,c){this.a=a
this.b=b
this.c=c},
iN:function iN(a){this.a=a},
iO:function iO(a,b,c){this.a=a
this.b=b
this.c=c},
iQ:function iQ(a,b,c){this.a=a
this.b=b
this.c=c},
iP:function iP(a,b,c){this.a=a
this.b=b
this.c=c},
iR:function iR(a,b){this.a=a
this.b=b},
iK:function iK(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var _=this
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
oC(){var s,r,q=null,p={}
p.a=!1
s=A.v(v.G.self)
p=new A.iD(p,new A.ha(new A.cj(q,q,q,q,t.co)))
if(typeof p=="function")A.w(A.aE("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.ns,p)
r[$.iT()]=p
s.onmessage=r},
iC:function iC(a,b){this.a=a
this.b=b},
iD:function iD(a,b){this.a=a
this.b=b},
ha:function ha(a){this.a=a},
j_(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.b_(b,c,B.a.Z(a.byteLength,s))
return J.jY(B.d.ga7(a),a.byteOffset+b*s,(c-b)*s)},
by(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.b_(b,c,B.a.Z(a.byteLength,s))
return J.c6(J.k_(a),a.byteOffset+b*s,(c-b)*s)},
jp(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.b_(b,c,B.a.Z(a.byteLength,s))-b)*s
if(B.a.Y(r,4)!==0)throw A.f(A.aE("The number of bytes to view must be a multiple of 4",null))
return J.lS(J.k_(a),a.byteOffset+b*s,B.a.K(r,4))},
ln(a){return v.mangledGlobalNames[a]},
ot(a,b){var s,r,q,p=a.length
if(p>=32)return A.nx(a,b)
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
nr(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
nx(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.lc
if(c7==null)c7=$.lc=A.nr(B.l)
s=c8.length
r=J.jY(B.d.ga7(c8),c8.byteOffset,s)
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
op(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.J.fT(a,16777216,!0,!1)
if(s>16777216)throw A.f(B.a1)
return a}},B={}
var w=[A,J,B]
var $={}
A.j9.prototype={}
J.E.prototype={
G(a,b){return a===b},
gV(a){return A.cW(a)},
u(a){return"Instance of '"+A.e5(a)+"'"},
gW(a){return A.c3(A.jA(this))}}
J.cH.prototype={
u(a){return String(a)},
bF(a,b){return b||a},
gV(a){return a?519018:218159},
gW(a){return A.c3(t.y)},
$iD:1,
$iu:1}
J.cJ.prototype={
G(a,b){return null==b},
u(a){return"null"},
gV(a){return 0},
$iD:1,
$ia0:1}
J.S.prototype={$iJ:1}
J.bs.prototype={
gV(a){return 0},
u(a){return String(a)}}
J.e4.prototype={}
J.d4.prototype={}
J.av.prototype={
u(a){var s=a[$.lq()]
if(s==null)s=a[$.iT()]
if(s==null)return this.eu(a)
return"JavaScript function for "+J.bH(s)},
$ibJ:1}
J.bK.prototype={
gV(a){return 0},
u(a){return String(a)}}
J.bL.prototype={
gV(a){return 0},
u(a){return String(a)}}
J.y.prototype={
m(a,b){A.a2(a).c.a(b)
a.$flags&1&&A.d(a,29)
a.push(b)},
ai(a,b){var s
A.a2(a).i("k<1>").a(b)
a.$flags&1&&A.d(a,"addAll",2)
if(Array.isArray(b)){this.eK(a,b)
return}for(s=J.cy(b);s.t();)a.push(s.gA())},
eK(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.f(A.at(a))
for(r=0;r<s;++r)a.push(b[r])},
l(a){a.$flags&1&&A.d(a,"clear","clear")
a.length=0},
an(a,b){return A.fA(a,b,null,A.a2(a).c)},
aj(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
er(a,b,c){var s=a.length
if(b>s)throw A.f(A.ap(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.f(A.ap(c,b,s,"end",null))
if(b===c)return A.h([],A.a2(a))
return A.h(a.slice(b,c),A.a2(a))},
ga4(a){if(a.length>0)return a[0]
throw A.f(A.ab())},
gad(a){var s=a.length
if(s>0)return a[s-1]
throw A.f(A.ab())},
gaf(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.f(A.ab())
throw A.f(A.j5())},
b4(a,b,c){a.$flags&1&&A.d(a,18)
A.b_(b,c,a.length)
a.splice(b,c-b)},
ac(a,b,c,d){var s
a.$flags&2&&A.d(a,"fillRange")
A.b_(b,c,a.length)
A.a2(a).c.a(d)
for(s=b;s<c;++s)a[s]=d},
aq(a,b){var s,r
A.a2(a).i("u(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.f(A.at(a))}return!1},
ab(a,b){var s,r
A.a2(a).i("u(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.f(A.at(a))}return!0},
gR(a){return a.length===0},
gcm(a){return a.length!==0},
u(a){return A.j6(a,"[","]")},
gB(a){return new J.bI(a,a.length,A.a2(a).i("bI<1>"))},
gV(a){return A.cW(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.d(a,"set length","change the length of")
if(b<0)throw A.f(A.ap(b,0,null,"newLength",null))
if(b>a.length)A.a2(a).c.a(null)
a.length=b},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eP(a,b))
return a[b]},
q(a,b,c){A.a2(a).c.a(c)
a.$flags&2&&A.d(a)
if(!(b>=0&&b<a.length))throw A.f(A.eP(a,b))
a[b]=c},
$ip:1,
$ik:1,
$ir:1}
J.dS.prototype={
hD(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.e5(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.f6.prototype={}
J.bI.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.Z(q)
throw A.f(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$ia5:1}
J.cK.prototype={
cc(a,b){var s
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gcl(b)
if(this.gcl(a)===s)return 0
if(this.gcl(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gcl(a){return a===0?1/a<0:a<0},
N(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.f(A.aH(""+a+".toInt()"))},
U(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.f(A.aH(""+a+".ceil()"))},
P(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.f(A.aH(""+a+".floor()"))},
H(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.f(A.aH(""+a+".round()"))},
eb(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
E(a,b,c){if(this.cc(b,c)>0)throw A.f(A.is(b))
if(this.cc(a,b)<0)return b
if(this.cc(a,c)>0)return c
return a},
u(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gV(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
Y(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
Z(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dv(a,b)},
K(a,b){return(a|0)===a?a/b|0:this.dv(a,b)},
dv(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.f(A.aH("Result of truncating division is "+A.x(s)+": "+A.x(a)+" ~/ "+b))},
a9(a,b){if(b<0)throw A.f(A.is(b))
return b>31?0:a<<b>>>0},
dl(a,b){return b>31?0:a<<b>>>0},
M(a,b){var s
if(a>0)s=this.c2(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
c2(a,b){return b>31?0:a>>>b},
eo(a,b){if(b<0)throw A.f(A.is(b))
return this.dm(a,b)},
dm(a,b){if(b>31)return 0
return a>>>b},
gW(a){return A.c3(t.q)},
$ii:1,
$ic5:1}
J.cI.prototype={
b5(a,b){var s=this.a9(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
gW(a){return A.c3(t.S)},
$iD:1,
$ib:1}
J.dT.prototype={
gW(a){return A.c3(t.i)},
$iD:1}
J.cb.prototype={
ep(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bI(a,b,c){return a.substring(b,A.b_(b,c,a.length))},
es(a,b){return this.bI(a,b,null)},
a6(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.f(B.Q)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
u(a){return a},
gV(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gW(a){return A.c3(t.N)},
gk(a){return a.length},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eP(a,b))
return a[b]},
$iD:1,
$ifm:1,
$iq:1}
A.b7.prototype={
u(a){return"LateInitializationError: "+this.a}}
A.iF.prototype={
$0(){var s=new A.K($.G,t.U)
s.bL(null)
return s},
$S:27}
A.fv.prototype={}
A.p.prototype={}
A.a7.prototype={
gB(a){var s=this
return new A.bO(s,s.gk(s),A.n(s).i("bO<a7.E>"))},
gR(a){return this.gk(this)===0},
an(a,b){return A.fA(this,b,null,A.n(this).i("a7.E"))}}
A.d2.prototype={
gf_(){var s=J.am(this.a),r=this.c
if(r==null||r>s)return s
return r},
gfE(){var s=J.am(this.a),r=this.b
if(r>s)return s
return r},
gk(a){var s,r=J.am(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
aj(a,b){var s=this,r=s.gfE()+b
if(b<0||r>=s.gf_())throw A.f(A.j2(b,s.gk(0),s,"index"))
return J.jZ(s.a,r)},
an(a,b){var s,r,q=this
A.aQ(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.cD(q.$ti.i("cD<1>"))
return A.fA(q.a,s,r,q.$ti.c)},
cr(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.O(n),l=m.gk(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=p.$ti.c
return b?J.j8(0,n):J.j7(0,n)}r=A.jd(s,m.aj(n,o),b,p.$ti.c)
for(q=1;q<s;++q){B.b.q(r,q,m.aj(n,o+q))
if(m.gk(n)<l)throw A.f(A.at(p))}return r}}
A.bO.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s,r=this,q=r.a,p=J.O(q),o=p.gk(q)
if(r.b!==o)throw A.f(A.at(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.aj(q,s);++r.c
return!0},
$ia5:1}
A.a_.prototype={
gk(a){return J.am(this.a)},
aj(a,b){return this.b.$1(J.jZ(this.a,b))}}
A.bR.prototype={
gB(a){return new A.d6(J.cy(this.a),this.b,this.$ti.i("d6<1>"))}}
A.d6.prototype={
t(){var s,r
for(s=this.a,r=this.b;s.t();)if(r.$1(s.gA()))return!0
return!1},
gA(){return this.a.gA()},
$ia5:1}
A.bb.prototype={
an(a,b){A.eR(b,"count",t.S)
A.aQ(b,"count")
return new A.bb(this.a,this.b+b,A.n(this).i("bb<1>"))},
gB(a){var s=this.a
return new A.d_(s.gB(s),this.b,A.n(this).i("d_<1>"))}}
A.ca.prototype={
gk(a){var s=this.a,r=s.gk(s)-this.b
if(r>=0)return r
return 0},
an(a,b){A.eR(b,"count",t.S)
A.aQ(b,"count")
return new A.ca(this.a,this.b+b,this.$ti)},
$ip:1}
A.d_.prototype={
t(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.t()
this.b=0
return s.t()},
gA(){return this.a.gA()},
$ia5:1}
A.cD.prototype={
gB(a){return B.I},
gR(a){return!0},
gk(a){return 0},
an(a,b){A.aQ(b,"count")
return this},
cr(a,b){var s=this.$ti.c
return b?J.j8(0,s):J.j7(0,s)}}
A.cE.prototype={
t(){return!1},
gA(){throw A.f(A.ab())},
$ia5:1}
A.H.prototype={
dF(a,b){return A.w(A.aH("Cannot "+b+" a fixed-length list"))},
sk(a,b){this.dF(a,"change the length of")},
m(a,b){A.aL(a).i("H.E").a(b)
return this.dF(a,"add to")}}
A.bz.prototype={
q(a,b,c){A.n(this).i("bz.E").a(c)
throw A.f(A.aH("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.f(A.aH("Cannot change the length of an unmodifiable list"))},
m(a,b){A.n(this).i("bz.E").a(b)
throw A.f(A.aH("Cannot add to an unmodifiable list"))},
J(a,b,c,d,e){A.n(this).i("k<bz.E>").a(d)
throw A.f(A.aH("Cannot modify an unmodifiable list"))},
C(a,b,c,d){return this.J(0,b,c,d,0)}}
A.dg.prototype={$r:"+(1)",$s:1}
A.co.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:15}
A.dh.prototype={$r:"+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(1,2,3,4,5,6,7,8,9,10)",$s:16}
A.di.prototype={$r:"+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(1,2,3,4,5,6,7,8,9,10,11,12)",$s:18}
A.cp.prototype={$r:"+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13)",$s:19}
A.dj.prototype={$r:"+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)",$s:20}
A.A.prototype={$r:"+(1,2)",$s:2}
A.dk.prototype={$r:"+calls,copiedBytes(1,2)",$s:3}
A.aB.prototype={$r:"+(1,2,3)",$s:4}
A.dl.prototype={$r:"+contentKey,requestId(1,2,3)",$s:5}
A.cq.prototype={$r:"+entryKey,workerRamBytes(1,2,3)",$s:6}
A.bZ.prototype={$r:"+message,requestId(1,2,3)",$s:7}
A.b2.prototype={$r:"+(1,2,3,4)",$s:10}
A.dm.prototype={$r:"+bytes,contentKey,useSimd(1,2,3,4)",$s:11}
A.dn.prototype={$r:"+deduplicateUploads,diskDirectory,maximumRamBytes(1,2,3,4)",$s:12}
A.cr.prototype={$r:"+compressedBytes,crc31,entryDiskBytes,fpHi,fpLo(1,2,3,4,5)",$s:13}
A.bC.prototype={$r:"+(1,2,3,4,5,6)",$s:14}
A.d9.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$ia5:1}
A.cC.prototype={
m(a,b){A.n(this).c.a(b)
A.m7()}}
A.P.prototype={
gk(a){return this.b},
gB(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.d9(s,s.length,r.$ti.i("d9<1>"))},
ar(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.fn.prototype={
$0(){return B.c.P(1000*this.a.now())},
$S:3}
A.cZ.prototype={}
A.fJ.prototype={
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
A.cU.prototype={
u(a){return"Null check operator used on a null value"}}
A.dV.prototype={
u(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.eg.prototype={
u(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.fl.prototype={
u(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cF.prototype={}
A.dq.prototype={
u(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iaz:1}
A.bp.prototype={
u(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.lo(r==null?"unknown":r)+"'"},
$ibJ:1,
ghF(){return this},
$C:"$1",
$R:1,
$D:null}
A.dH.prototype={$C:"$0",$R:0}
A.dI.prototype={$C:"$2",$R:2}
A.ed.prototype={}
A.e9.prototype={
u(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.lo(s)+"'"}}
A.c8.prototype={
G(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.c8))return!1
return this.$_target===b.$_target&&this.a===b.a},
gV(a){return(A.iG(this.a)^A.cW(this.$_target))>>>0},
u(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.e5(this.a)+"'")}}
A.e8.prototype={
u(a){return"RuntimeError: "+this.a}}
A.eF.prototype={
u(a){return"Assertion failed: Reached dead code"}}
A.b6.prototype={
gk(a){return this.a},
gR(a){return this.a===0},
gau(){return new A.N(this,A.n(this).i("N<1>"))},
aG(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.hg(a)},
hg(a){var s=this.d
if(s==null)return!1
return this.b1(this.d_(s,a),a)>=0},
ai(a,b){A.n(this).i("ai<1,2>").a(b).aI(0,new A.f7(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.hh(b)},
hh(a){var s,r,q=this.d
if(q==null)return null
s=this.d_(q,a)
r=this.b1(s,a)
if(r<0)return null
return s[r].b},
q(a,b,c){var s,r,q,p,o,n,m=this,l=A.n(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cH(s==null?m.b=m.bV():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cH(r==null?m.c=m.bV():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.bV()
p=m.bw(b)
o=q[p]
if(o==null)q[p]=[m.bK(b,c)]
else{n=m.b1(o,b)
if(n>=0)o[n].b=c
else o.push(m.bK(b,c))}}},
e8(a,b){var s,r,q=this,p=A.n(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aG(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.q(0,a,r)
return r},
F(a,b){var s=this
if(typeof b=="string")return s.cI(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cI(s.c,b)
else return s.hi(b)},
hi(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bw(a)
r=n[s]
q=o.b1(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.cJ(p)
if(r.length===0)delete n[s]
return p.b},
l(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bJ()}},
aI(a,b){var s,r,q=this
A.n(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.f(A.at(q))
s=s.c}},
cH(a,b,c){var s,r=A.n(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bK(b,c)
else s.b=c},
cI(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.cJ(s)
delete a[b]
return s.b},
bJ(){this.r=this.r+1&1073741823},
bK(a,b){var s=this,r=A.n(s),q=new A.fc(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bJ()
return q},
cJ(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bJ()},
bw(a){return J.ar(a)&1073741823},
d_(a,b){return a[this.bw(b)]},
b1(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1},
u(a){return A.kf(this)},
bV(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ijb:1}
A.f7.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.q(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.n(this.a).i("~(1,2)")}}
A.fc.prototype={}
A.N.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gB(a){var s=this.a
return new A.cM(s,s.r,s.e,this.$ti.i("cM<1>"))}}
A.cM.prototype={
gA(){return this.d},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.at(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$ia5:1}
A.bN.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gB(a){var s=this.a
return new A.aN(s,s.r,s.e,this.$ti.i("aN<1>"))}}
A.aN.prototype={
gA(){return this.d},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.at(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$ia5:1}
A.bM.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gB(a){var s=this.a
return new A.cL(s,s.r,s.e,this.$ti.i("cL<1,2>"))}}
A.cL.prototype={
gA(){var s=this.d
s.toString
return s},
t(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.at(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.bt(s.a,s.b,r.$ti.i("bt<1,2>"))
r.c=s.c
return!0}},
$ia5:1}
A.ah.prototype={
bw(a){return A.iG(a)&1073741823},
b1(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.ix.prototype={
$1(a){return this.a(a)},
$S:24}
A.iy.prototype={
$2(a,b){return this.a(a,b)},
$S:16}
A.iz.prototype={
$1(a){return this.a(A.L(a))},
$S:21}
A.Q.prototype={
u(a){return this.dA(!1)},
dA(a){var s,r,q,p,o,n=this.f4(),m=this.aU(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.kj(o):l+A.x(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
f4(){var s,r=this.$s
while($.hV.length<=r)B.b.m($.hV,null)
s=$.hV[r]
if(s==null){s=this.eT()
B.b.q($.hV,r,s)}return s},
eT(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.h(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.b.q(k,q,r[s])}}k=A.mk(k,!1,t.K)
k.$flags=3
return k}}
A.bY.prototype={
aU(){return[this.a,this.b]},
G(a,b){if(b==null)return!1
return b instanceof A.bY&&this.$s===b.$s&&J.m(this.a,b.a)&&J.m(this.b,b.b)},
gV(a){return A.e2(this.$s,this.a,this.b,B.m)}}
A.cn.prototype={
aU(){return[this.a]},
G(a,b){if(b==null)return!1
return b instanceof A.cn&&this.$s===b.$s&&J.m(this.a,b.a)},
gV(a){return A.e2(this.$s,this.a,B.m,B.m)}}
A.bj.prototype={
aU(){return[this.a,this.b,this.c]},
G(a,b){var s=this
if(b==null)return!1
return b instanceof A.bj&&s.$s===b.$s&&J.m(s.a,b.a)&&J.m(s.b,b.b)&&J.m(s.c,b.c)},
gV(a){var s=this
return A.e2(s.$s,s.a,s.b,s.c)}}
A.ak.prototype={
aU(){return this.a},
G(a,b){if(b==null)return!1
return b instanceof A.ak&&this.$s===b.$s&&A.n3(this.a,b.a)},
gV(a){return A.e2(this.$s,A.mt(this.a),B.m,B.m)}}
A.dU.prototype={
u(a){return"RegExp/"+this.a+"/"+this.b.flags},
gfg(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.kc(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
e_(a){var s=this.b.exec(a)
if(s==null)return null
return new A.db(s)},
dK(a,b){return new A.ei(this,b,0)},
f2(a,b){var s,r=this.gfg()
if(r==null)r=A.aW(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.db(s)},
$ifm:1,
$imB:1}
A.db.prototype={
h(a,b){var s
A.j(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$ie6:1}
A.ei.prototype={
gB(a){return new A.ci(this.a,this.b,this.c)}}
A.ci.prototype={
gA(){var s=this.d
return s==null?t.d.a(s):s},
t(){var s,r,q,p,o,n,m=this,l=m.b
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
$ia5:1}
A.fW.prototype={
ap(){var s=this.b
if(s===this)throw A.f(new A.b7("Local '' has not been initialized."))
return s},
sdZ(a){if(this.b!==this)throw A.f(new A.b7("Local '' has already been initialized."))
this.b=a}}
A.bu.prototype={
gW(a){return B.b6},
bt(a,b,c){A.bm(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dP(a){return this.bt(a,0,null)},
dO(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.K(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dN(a,b,c){A.bm(a,b,c)
if(c==null)c=B.a.K(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dM(a,b,c){if(B.a.Y(b,16)!==0)A.w(A.kk("Offset ("+b+") must be a multiple of BYTES_PER_ELEMENT (16)"))
return new A.cO(A.mr(a,b,(c==null?B.a.K(a.byteLength-b,16):c)*4))},
dL(a,b,c){A.bm(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iD:1,
$ibu:1}
A.cc.prototype={$icc:1}
A.cO.prototype={
gW(a){return B.b9},
gk(a){return this.a.length/4|0},
h(a,b){var s,r,q,p,o,n,m
A.j(b)
s=this.a
r=s.length
A.aX(b,this,r/4|0)
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
return new A.aP(p,n,m,s[q])},
q(a,b,c){var s,r,q,p
t.Y.a(c)
s=this.a
r=s.length
A.aX(b,this,r/4|0)
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
$iD:1,
$ik:1,
$ir:1,
$ieY:1}
A.eE.prototype={}
A.cR.prototype={
ga7(a){if(((a.$flags|0)&2)!==0)return new A.i5(a.buffer)
else return a.buffer},
fd(a,b,c,d){var s=A.ap(b,0,c,d,null)
throw A.f(s)},
cP(a,b,c,d){if(b>>>0!==b||b>c)this.fd(a,b,c,d)}}
A.i5.prototype={
bt(a,b,c){var s=A.jg(this.a,b,c)
s.$flags=3
return s},
dP(a){return this.bt(0,0,null)},
dO(a,b,c){var s=A.jf(this.a,b,c)
s.$flags=3
return s},
dN(a,b,c){var s=A.je(this.a,b,c)
s.$flags=3
return s},
dM(a,b,c){return new A.eE(J.iU(this.a,b,c).a)},
dL(a,b,c){var s=A.mn(this.a,b,c)
s.$flags=3
return s}}
A.dY.prototype={
gW(a){return B.b7},
$iD:1}
A.ac.prototype={
gk(a){return a.length},
dk(a,b,c,d,e){var s,r,q=a.length
this.cP(a,b,q,"start")
this.cP(a,c,q,"end")
if(b>c)throw A.f(A.ap(b,0,c,null,null))
s=c-b
if(e<0)throw A.f(A.aE(e,null))
r=d.length
if(r-e<s)throw A.f(A.aG("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iaw:1}
A.bv.prototype={
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
q(a,b,c){A.W(c)
a.$flags&2&&A.d(a)
A.aX(b,a,a.length)
a[b]=c},
J(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.d(a,5)
if(t.d4.b(d)){this.dk(a,b,c,d,e)
return}this.cG(a,b,c,d,e)},
C(a,b,c,d){return this.J(a,b,c,d,0)},
$ip:1,
$ik:1,
$ir:1}
A.ax.prototype={
q(a,b,c){A.j(c)
a.$flags&2&&A.d(a)
A.aX(b,a,a.length)
a[b]=c},
J(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.d(a,5)
if(t.eB.b(d)){this.dk(a,b,c,d,e)
return}this.cG(a,b,c,d,e)},
C(a,b,c,d){return this.J(a,b,c,d,0)},
$ip:1,
$ik:1,
$ir:1}
A.cd.prototype={
gW(a){return B.b8},
$iD:1,
$icd:1,
$ibq:1}
A.cP.prototype={
gW(a){return B.ba},
$iD:1,
$ieZ:1}
A.dZ.prototype={
gW(a){return B.bb},
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
$iD:1}
A.cQ.prototype={
gW(a){return B.bc},
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
$iD:1,
$ij4:1}
A.e0.prototype={
gW(a){return B.bd},
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
$iD:1}
A.e1.prototype={
gW(a){return B.bf},
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
$iD:1,
$ijo:1}
A.cS.prototype={
gW(a){return B.bg},
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
$iD:1,
$id3:1}
A.cT.prototype={
gW(a){return B.bh},
gk(a){return a.length},
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
$iD:1}
A.bP.prototype={
gW(a){return B.bi},
gk(a){return a.length},
h(a,b){A.j(b)
A.aX(b,a,a.length)
return a[b]},
$iD:1,
$ibP:1,
$ibx:1}
A.aP.prototype={
a6(a,b){var s,r,q,p,o=this
t.Y.a(b)
s=$.dE()
s.$flags&2&&A.d(s)
s[0]=o.a*b.a
r=s[0]
s[0]=o.b*b.b
q=s[0]
s[0]=o.c*b.c
p=s[0]
s[0]=o.d*b.d
return new A.aP(r,q,p,s[0])},
cE(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.dE()
k.$flags&2&&A.d(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.aP(s,r,q,k[0])},
u(a){return"V128"},
$ia3:1}
A.ex.prototype={}
A.ey.prototype={}
A.dc.prototype={}
A.dd.prototype={}
A.de.prototype={}
A.df.prototype={}
A.eG.prototype={}
A.aR.prototype={
i(a){return A.dx(v.typeUniverse,this,a)},
a2(a){return A.kN(v.typeUniverse,this,a)}}
A.es.prototype={}
A.i3.prototype={
u(a){return A.al(this.a,null)}}
A.ep.prototype={
u(a){return this.a}}
A.cs.prototype={$ibe:1}
A.fS.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:7}
A.fR.prototype={
$1(a){var s,r
this.a.a=t.O.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:41}
A.fT.prototype={
$0(){this.a.$0()},
$S:8}
A.fU.prototype={
$0(){this.a.$0()},
$S:8}
A.i0.prototype={
ez(a,b){if(self.setTimeout!=null)self.setTimeout(A.dC(new A.i1(this,b),0),a)
else throw A.f(A.aH("`setTimeout()` not found."))}}
A.i1.prototype={
$0(){this.b.$0()},
$S:0}
A.ej.prototype={}
A.ie.prototype={
$1(a){return this.a.$2(0,a)},
$S:4}
A.ig.prototype={
$2(a,b){this.a.$2(1,new A.cF(a,t.l.a(b)))},
$S:35}
A.ir.prototype={
$2(a,b){this.a(A.j(a),b)},
$S:37}
A.as.prototype={
u(a){return A.x(this.a)},
$iM:1,
gaS(){return this.b}}
A.en.prototype={
dU(a){var s=this.a
if((s.a&30)!==0)throw A.f(A.aG("Future already completed"))
s.bd(A.nK(a,null))}}
A.d7.prototype={}
A.bg.prototype={
ho(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.bq(s,t.al.a(this.d),a.a,t.y,t.K)},
ha(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.fB(l,q,m,a.b,o,n,t.l)
else p=l.bq(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.k.b(A.af(s))){if((r.c&1)!==0)throw A.f(A.aE("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.f(A.aE("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.K.prototype={
cq(a,b,c){var s,r,q,p=this.$ti
p.a2(c).i("1/(2)").a(a)
s=$.G
if(s===B.k){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.f(A.k2(b,"onError",u.c))}else{r=p.c
a=s.bo(s,c.i("@<0/>").a2(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.o4(b,s)}q=new A.K(s,c.i("K<0>"))
r=b==null?1:3
this.bc(new A.bg(q,r,a,b,p.i("@<1>").a2(c).i("bg<1,2>")))
return q},
dw(a,b,c){var s,r=this.$ti
r.a2(c).i("1/(2)").a(a)
s=new A.K($.G,c.i("K<0>"))
this.bc(new A.bg(s,19,a,b,r.i("@<1>").a2(c).i("bg<1,2>")))
return s},
cu(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.G
q=new A.K(r,s)
if(r!==B.k)a=r.bn(r,a,t.z)
this.bc(new A.bg(q,8,a,null,s.i("bg<1,1>")))
return q},
fC(a){this.a=this.a&1|16
this.c=a},
be(a){this.a=a.a&30|this.a&1
this.c=a.c},
bc(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.bc(a)
return}r.be(s)}q=r.b
q.aY(q,new A.hv(r,a))}},
de(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.de(a)
return}m.be(n)}l.a=m.bp(a)
s=m.b
s.aY(s,new A.hz(l,m))}},
aW(){var s=t.F.a(this.c)
this.c=null
return this.bp(s)},
bp(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
cS(a){var s,r=this
r.$ti.c.a(a)
s=r.aW()
r.a=8
r.c=a
A.bV(r,s)},
eS(a){var s=this.aW()
this.be(a)
A.bV(this,s)},
bf(a){var s=this.aW()
this.fC(a)
A.bV(this,s)},
eR(a,b){A.aW(a)
t.l.a(b)
this.bf(new A.as(a,b))},
bL(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("au<1>").b(a)){this.cO(a)
return}this.eN(a)},
eN(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.aY(s,new A.hx(r,a))},
cO(a){A.jr(this.$ti.i("au<1>").a(a),this,!1)
return},
bd(a){var s
this.a^=2
s=this.b
s.aY(s,new A.hw(this,a))},
$iau:1}
A.hv.prototype={
$0(){A.bV(this.a,this.b)},
$S:0}
A.hz.prototype={
$0(){A.bV(this.b,this.a.a)},
$S:0}
A.hy.prototype={
$0(){A.jr(this.a.a,this.b,!0)},
$S:0}
A.hx.prototype={
$0(){this.a.cS(this.b)},
$S:0}
A.hw.prototype={
$0(){this.a.bf(this.b)},
$S:0}
A.hC.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.br(p,t.fO.a(q.d),t.z)}catch(o){s=A.af(o)
r=A.bn(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.iY(q)
n=k.a
n.c=new A.as(q,p)
q=n}q.b=!0
return}if(j instanceof A.K&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.K){m=k.b.a
l=new A.K(m.b,m.$ti)
j.cq(new A.hD(l,m),new A.hE(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.hD.prototype={
$1(a){this.a.eS(this.b)},
$S:7}
A.hE.prototype={
$2(a,b){A.aW(a)
t.l.a(b)
this.a.bf(new A.as(a,b))},
$S:53}
A.hB.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.bq(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.af(k)
r=A.bn(k)
q=s
p=r
if(p==null)p=A.iY(q)
o=this.a
o.c=new A.as(q,p)
o.b=!0}},
$S:0}
A.hA.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.ho(s)&&p.a.e!=null){p.c=p.a.ha(s)
p.b=!1}}catch(o){r=A.af(o)
q=A.bn(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.iY(p)
m=l.b
m.c=new A.as(p,n)
p=m}p.b=!0}},
$S:0}
A.ek.prototype={}
A.d1.prototype={
gk(a){var s={},r=new A.K($.G,t.fJ)
s.a=0
this.e4(new A.fy(s,this),!0,new A.fz(s,r),r.geQ())
return r}}
A.fy.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.fz.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.aW()
r.c.a(q)
s.a=8
s.c=q
A.bV(s,p)},
$S:0}
A.dr.prototype={
gfk(){var s,r=this
if((r.b&8)===0)return A.n(r).i("aT<1>?").a(r.a)
s=A.n(r)
return s.i("aT<1>?").a(s.i("ds<1>").a(r.a).gc6())},
cX(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aT(A.n(q).i("aT<1>"))
return A.n(q).i("aT<1>").a(s)}r=A.n(q)
s=r.i("ds<1>").a(q.a).gc6()
return r.i("aT<1>").a(s)},
gds(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gc6()
return A.n(this).i("cl<1>").a(s)},
cN(){if((this.b&4)!==0)return new A.bc("Cannot add event after closing")
return new A.bc("Cannot add event while adding a stream")},
cW(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.jQ():new A.K($.G,t.U)
return s},
ca(){var s=this,r=s.b
if((r&4)!==0)return s.cW()
if(r>=4)throw A.f(s.cN())
r=s.b=r|4
if((r&1)!==0)s.c1()
else if((r&3)===0)s.cX().m(0,B.z)
return s.cW()},
fF(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.n(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.f(A.aG("Stream has already been listened to."))
s=h.c
r=$.G
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.bo(r,t.a7.a2(s).i("1(2)").a(a),o,s)
A.mT(r,b)
n=c==null?A.oi():c
m=t.O
l=new A.cl(i,s,r.bn(r,m.a(n),o),r,q|p,h.i("cl<1>"))
k=i.gfk()
if(((i.b|=1)&8)!==0){j=h.i("ds<1>").a(i.a)
j.sc6(l)
j.hw()}else i.a=l
l.fD(k)
h=m.a(new A.hY(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cQ((s&4)!==0)
return l},
fq(a){var s,r,q,p,o,n,m,l,k=this,j=A.n(k)
j.i("ea<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("ds<1>").a(k.a).hI()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.K)s=q}catch(n){p=A.af(n)
o=A.bn(n)
m=new A.K($.G,t.U)
j=A.aW(p)
l=t.l.a(o)
m.bd(new A.as(j,l))
s=m}else s=s.cu(r)
j=new A.hX(k)
if(s!=null)s=s.cu(j)
else j.$0()
return s},
$iko:1,
$ikH:1,
$ibU:1,
$ikm:1}
A.hY.prototype={
$0(){A.jE(this.a.d)},
$S:0}
A.hX.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bL(null)},
$S:0}
A.el.prototype={
c0(a){var s=this.$ti
s.c.a(a)
this.gds().cM(new A.bT(a,s.i("bT<1>")))},
c1(){this.gds().cM(B.z)}}
A.cj.prototype={}
A.ck.prototype={
gV(a){return(A.cW(this.a)^892482866)>>>0},
G(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.ck&&b.a===this.a}}
A.cl.prototype={
d9(){return this.w.fq(this)},
da(){var s=this.w,r=A.n(s)
r.i("ea<1>").a(this)
if((s.b&8)!==0)r.i("ds<1>").a(s.a).hM()
A.jE(s.e)},
dc(){var s=this.w,r=A.n(s)
r.i("ea<1>").a(this)
if((s.b&8)!==0)r.i("ds<1>").a(s.a).hw()
A.jE(s.f)}}
A.d8.prototype={
fD(a){var s=this
A.n(s).i("aT<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bG(s)}},
da(){},
dc(){},
d9(){return null},
cM(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aT(A.n(r).i("aT<1>"))
q.m(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bG(r)}},
c0(a){var s,r=this,q=A.n(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.hy(r.a,a,q)
r.e&=4294967231
r.cQ((s&4)!==0)},
c1(){var s,r=this,q=new A.fV(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.d9()
r.e|=16
if(p!=null&&p!==$.jQ())p.cu(q)
else q.$0()},
cQ(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=p&4294967167
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p&=4294967291
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=p^64
if(r)q.da()
else q.dc()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bG(q)},
$iea:1,
$ibU:1}
A.fV.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.hx(s.c)
s.e&=4294967231},
$S:0}
A.dt.prototype={
e4(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.fF(s.i("~(1)?").a(a),d,c,b===!0)},
hl(a){return this.e4(a,null,null,null)}}
A.bB.prototype={
sb2(a){this.a=t.ev.a(a)},
gb2(){return this.a}}
A.bT.prototype={
e6(a){this.$ti.i("bU<1>").a(a).c0(this.b)}}
A.eo.prototype={
e6(a){a.c1()},
gb2(){return null},
sb2(a){throw A.f(A.aG("No events after a done."))},
$ibB:1}
A.aT.prototype={
bG(a){var s,r=this
r.$ti.i("bU<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.oK(new A.hU(r,a))
r.a=1},
m(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sb2(b)
s.c=b}}}
A.hU.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("bU<1>").a(this.b)
r=p.b
q=r.gb2()
p.b=q
if(q==null)p.c=null
r.e6(s)},
$S:0}
A.eB.prototype={}
A.fP.prototype={
hx(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.br(o,a,t.H)
return q}catch(p){s=A.af(p)
r=A.bn(p)
o.aV(o,s,r)}},
hy(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.bq(o,a,b,t.H,c)
return q}catch(p){s=A.af(p)
r=A.bn(p)
o.aV(o,s,r)}},
fN(a,b){return new A.fQ(this,this.bn(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.ghL(null).h(0,b)
return s}return null},
aV(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.o6(b,c)
return}r=s.gcv()
q=r.ghH()
p=$.G
try{$.G=q
s.h9(r,r.gbX(),a,b,c)
$.G=p}catch(m){o=A.af(m)
n=A.bn(m)
$.G=p
l=b===o?c:n
q.aV(r,o,l)}},
br(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.G
if(r===a)return b.$0()
s=r
$.G=a
try{r=b.$0()
return r}finally{$.G=s}q=null.gcv()
return null.hJ(q,q.gbX(),a,b)},
bq(a,b,c,d,e){var s,r,q
d.i("@<0>").a2(e).i("1(2)").a(b)
e.a(c)
r=$.G
if(r===a)return b.$1(c)
s=r
$.G=a
try{r=b.$1(c)
return r}finally{$.G=s}q=null.gcv()
return null.h9(q,q.gbX(),a,b,c)},
fB(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").a2(f).a2(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.G
if(r===a)return b.$2(c,d)
s=r
$.G=a
try{r=b.$2(c,d)
return r}finally{$.G=s}q=null.gcv()
return null.hK(q,q.gbX(),a,b,c,d)},
bn(a,b,c){c.i("0()").a(b)
return b},
bo(a,b,c,d){c.i("@<0>").a2(d).i("1(2)").a(b)
return b},
bZ(a,b,c,d,e){c.i("@<0>").a2(d).a2(e).i("1(2,3)").a(b)
return b},
f1(a,b,c){return null},
aY(a,b){A.jD(a,t.O.a(b))
return}}
A.fQ.prototype={
$0(){var s=this.a
return s.br(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.ip.prototype={
$0(){A.m9(this.a,this.b)},
$S:0}
A.bi.prototype={
gB(a){var s=this,r=new A.da(s,s.r,A.n(s).i("da<1>"))
r.c=s.e
return r},
gk(a){return this.a},
ar(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.eU(b)},
eU(a){var s=this.d
if(s==null)return!1
return this.bl(s[this.bg(a)],a)>=0},
ga4(a){var s=this.e
if(s==null)throw A.f(A.aG("No elements"))
return A.n(this).c.a(s.a)},
m(a,b){var s,r,q=this
A.n(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cL(s==null?q.b=A.jt():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cL(r==null?q.c=A.jt():r,b)}else return q.eJ(b)},
eJ(a){var s,r,q,p=this
A.n(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.jt()
r=p.bg(a)
q=s[r]
if(q==null)s[r]=[p.bW(a)]
else{if(p.bl(q,a)>=0)return!1
q.push(p.bW(a))}return!0},
F(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.dg(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.dg(s.c,b)
else return s.ft(b)},
ft(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bg(a)
r=n[s]
q=o.bl(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dE(p)
return!0},
f5(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("u(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.f(A.at(n))
if(!0===o)n.F(0,r)}},
cL(a,b){A.n(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.bW(b)
return!0},
dg(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dE(s)
delete a[b]
return!0},
bU(){this.r=this.r+1&1073741823},
bW(a){var s,r=this,q=new A.ew(A.n(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.bU()
return q},
dE(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.bU()},
bg(a){return J.ar(a)&1073741823},
bl(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1}}
A.bW.prototype={
bg(a){return A.iG(a)&1073741823},
bl(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.ew.prototype={}
A.da.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
t(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.f(A.at(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$ia5:1}
A.z.prototype={
gB(a){return new A.bO(a,this.gk(a),A.aL(a).i("bO<z.E>"))},
aj(a,b){return this.h(a,b)},
gR(a){return this.gk(a)===0},
gcm(a){return!this.gR(a)},
ga4(a){if(this.gk(a)===0)throw A.f(A.ab())
return this.h(a,0)},
gad(a){if(this.gk(a)===0)throw A.f(A.ab())
return this.h(a,this.gk(a)-1)},
gaf(a){if(this.gk(a)===0)throw A.f(A.ab())
if(this.gk(a)>1)throw A.f(A.j5())
return this.h(a,0)},
aq(a,b){var s,r
A.aL(a).i("u(z.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.f(A.at(a))}return!1},
an(a,b){return A.fA(a,b,null,A.aL(a).i("z.E"))},
m(a,b){var s
A.aL(a).i("z.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.q(a,s,b)},
ac(a,b,c,d){var s,r,q=A.aL(a)
q.i("z.E?").a(d)
s=d==null?q.i("z.E").a(d):d
A.b_(b,c,this.gk(a))
for(r=b;r<c;++r)this.q(a,r,s)},
J(a,b,c,d,e){var s,r,q,p,o
A.aL(a).i("k<z.E>").a(d)
A.b_(b,c,this.gk(a))
s=c-b
if(s===0)return
A.aQ(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.lW(d,e).cr(0,!1)
r=0}p=J.O(q)
if(r+s>p.gk(q))throw A.f(A.md())
if(r<b)for(o=s-1;o>=0;--o)this.q(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.q(a,b+o,p.h(q,r+o))},
C(a,b,c,d){return this.J(a,b,c,d,0)},
em(a,b,c){A.aL(a).i("k<z.E>").a(c)
this.C(a,b,b+c.length,c)},
u(a){return A.j6(a,"[","]")}}
A.I.prototype={
aI(a,b){var s,r,q,p=A.n(this)
p.i("~(I.K,I.V)").a(b)
for(s=this.gau(),s=s.gB(s),p=p.i("I.V");s.t();){r=s.gA()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ai(a,b){A.n(this).i("ai<I.K,I.V>").a(b).aI(0,new A.fe(this))},
bA(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("u(I.K,I.V)").a(b)
s=A.h([],m.i("y<I.K>"))
for(r=n.gau(),r=r.gB(r),m=m.i("I.V");r.t();){q=r.gA()
p=n.h(0,q)
if(b.$2(q,p==null?m.a(p):p))B.b.m(s,q)}for(m=s.length,o=0;o<s.length;s.length===m||(0,A.Z)(s),++o)n.F(0,s[o])},
gk(a){var s=this.gau()
return s.gk(s)},
gR(a){var s=this.gau()
return s.gR(s)},
u(a){return A.kf(this)},
$iai:1}
A.fe.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.q(0,r.i("I.K").a(a),r.i("I.V").a(b))},
$S(){return A.n(this.a).i("~(I.K,I.V)")}}
A.ff.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.x(a)
r.a=(r.a+=s)+": "
s=A.x(b)
r.a+=s},
$S:65}
A.ba.prototype={
ai(a,b){var s
A.n(this).i("k<1>").a(b)
for(s=b.gB(b);s.t();)this.m(0,s.gA())},
u(a){return A.j6(this,"{","}")},
an(a,b){return A.kn(this,b,A.n(this).c)},
$ip:1,
$ik:1,
$ib0:1}
A.dp.prototype={}
A.eu.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fl(b):s}},
gk(a){return this.b==null?this.c.a:this.aK().length},
gR(a){return this.gk(0)===0},
gau(){if(this.b==null){var s=this.c
return new A.N(s,A.n(s).i("N<1>"))}return new A.ev(this)},
q(a,b,c){var s,r,q=this
A.L(b)
if(q.b==null)q.c.q(0,b,c)
else if(q.aG(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.dG().q(0,b,c)},
ai(a,b){t.P.a(b).aI(0,new A.hN(this))},
aG(a){if(this.b==null)return this.c.aG(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
F(a,b){if(this.b!=null&&!this.aG(b))return null
return this.dG().F(0,b)},
l(a){var s,r=this
if(r.b==null)r.c.l(0)
else{if(r.c!=null)B.b.l(r.aK())
r.a=r.b=null
s=t.z
r.c=A.ae(s,s)}},
aI(a,b){var s,r,q,p,o=this
t.cA.a(b)
if(o.b==null)return o.c.aI(0,b)
s=o.aK()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.ii(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.f(A.at(o))}},
aK(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.h(Object.keys(this.a),t.s)
return s},
dG(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.ae(t.N,t.z)
r=n.aK()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.q(0,o,n.h(0,o))}if(p===0)B.b.m(r,"")
else B.b.l(r)
n.a=n.b=null
return n.c=s},
fl(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.ii(this.a[a])
return this.b[a]=s}}
A.hN.prototype={
$2(a,b){this.a.q(0,A.L(a),b)},
$S:73}
A.ev.prototype={
gk(a){return this.a.gk(0)},
aj(a,b){var s=this.a
if(s.b==null)s=s.gau().aj(0,b)
else{s=s.aK()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gB(a){var s=this.a
if(s.b==null){s=s.gau()
s=s.gB(s)}else{s=s.aK()
s=new J.bI(s,s.length,A.a2(s).i("bI<1>"))}return s}}
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
A.c9.prototype={}
A.dK.prototype={}
A.dL.prototype={}
A.dW.prototype={
dW(a,b){var s=A.o0(a,this.gh_().a)
return s},
gh_(){return B.a9}}
A.f8.prototype={}
A.eh.prototype={
fS(a){t.L.a(a)
return B.bj.fQ(a)}}
A.fM.prototype={
fQ(a){return new A.i6(this.a).eV(t.L.a(a),0,null,!0)}}
A.i6.prototype={
eV(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.b_(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.ni(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.nh(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bO(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.nj(o)
l.b=0
throw A.f(A.dN(m,a,p+l.c))}return n},
bO(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.K(b+c,2)
r=q.bO(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bO(a,s,c,d)}return q.fU(a,b,c,d)},
fU(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.cf(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.cX(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.cX(h)
e.a+=p
break
case 65:p=A.cX(h)
e.a+=p;--d
break
default:p=A.cX(h)
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
p=A.cX(a[l])
e.a+=p}else{p=A.mE(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.cX(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.hb.prototype={
u(a){return this.f0()}}
A.M.prototype={
gaS(){return A.mv(this)}}
A.cA.prototype={
u(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.eX(s)
return"Assertion failed"}}
A.be.prototype={}
A.aY.prototype={
gbR(){return"Invalid argument"+(!this.a?"(s)":"")},
gbQ(){return""},
u(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.x(p),n=s.gbR()+q+o
if(!s.a)return n
return n+s.gbQ()+": "+A.eX(s.gcj())},
gcj(){return this.b}}
A.b9.prototype={
gcj(){return A.kR(this.b)},
gbR(){return"RangeError"},
gbQ(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.x(q):""
else if(q==null)s=": Not greater than or equal to "+A.x(r)
else if(q>r)s=": Not in inclusive range "+A.x(r)+".."+A.x(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.x(r)
return s}}
A.dO.prototype={
gcj(){return A.j(this.b)},
gbR(){return"RangeError"},
gbQ(){if(A.j(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ib9:1,
gk(a){return this.f}}
A.d5.prototype={
u(a){return"Unsupported operation: "+this.a}}
A.ef.prototype={
u(a){return"UnimplementedError: "+this.a}}
A.bc.prototype={
u(a){return"Bad state: "+this.a}}
A.dJ.prototype={
u(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.eX(s)+"."}}
A.e3.prototype={
u(a){return"Out of Memory"},
gaS(){return null},
$iM:1}
A.d0.prototype={
u(a){return"Stack Overflow"},
gaS(){return null},
$iM:1}
A.hc.prototype={
u(a){return"Exception: "+this.a}}
A.a4.prototype={
u(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.p.bI(e,0,75)+"..."
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
k=""}return g+l+B.p.bI(e,i,j)+k+"\n"+B.p.a6(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.x(f)+")"):g}}
A.k.prototype={
aq(a,b){var s
A.n(this).i("u(k.E)").a(b)
for(s=this.gB(this);s.t();)if(b.$1(s.gA()))return!0
return!1},
cr(a,b){var s=A.n(this).i("k.E")
if(b)s=A.aO(this,s)
else{s=A.aO(this,s)
s.$flags=1
s=s}return s},
gk(a){var s,r=this.gB(this)
for(s=0;r.t();)++s
return s},
gR(a){return!this.gB(this).t()},
gcm(a){return!this.gR(this)},
an(a,b){return A.kn(this,b,A.n(this).i("k.E"))},
ga4(a){var s=this.gB(this)
if(!s.t())throw A.f(A.ab())
return s.gA()},
gad(a){var s,r=this.gB(this)
if(!r.t())throw A.f(A.ab())
do s=r.gA()
while(r.t())
return s},
gaf(a){var s,r=this.gB(this)
if(!r.t())throw A.f(A.ab())
s=r.gA()
if(r.t())throw A.f(A.j5())
return s},
aj(a,b){var s,r
A.aQ(b,"index")
s=this.gB(this)
for(r=b;s.t();){if(r===0)return s.gA();--r}throw A.f(A.j2(b,b-r,this,"index"))},
u(a){return A.me(this,"(",")")}}
A.bt.prototype={
u(a){return"MapEntry("+A.x(this.a)+": "+A.x(this.b)+")"}}
A.a0.prototype={
gV(a){return A.e.prototype.gV.call(this,0)},
u(a){return"null"}}
A.e.prototype={$ie:1,
G(a,b){return this===b},
gV(a){return A.cW(this)},
u(a){return"Instance of '"+A.e5(this)+"'"},
gW(a){return A.iw(this)},
toString(){return this.u(this)}}
A.eC.prototype={
u(a){return""},
$iaz:1}
A.fx.prototype={
gcf(){var s,r=this.b
if(r==null)r=$.ji.$0()
s=r-this.a
if($.jR()===1e6)return s
return s*1000}}
A.cf.prototype={
gk(a){return this.a.length},
u(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.fk.prototype={
u(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.f2.prototype={
$2(a,b){var s=t.g
this.a.cq(new A.f0(s.a(a)),new A.f1(s.a(b)),t.X)},
$S:17}
A.f0.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:18}
A.f1.prototype={
$2(a,b){var s=A.nw(A.aW(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:19}
A.iH.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.w(A.aG("Future already completed"))
s.bL(r.i("1/").a(a))
return null},
$S:4}
A.iI.prototype={
$1(a){if(a==null)return this.a.dU(new A.fk(a===undefined))
return this.a.dU(a)},
$S:4}
A.f3.prototype={
fT(a,b,c,d){var s
t.L.a(a)
s=A.jh(32768)
this.fY(A.j3(a,B.o,null,null),s,b,!0,!1)
return s.b6()},
fY(a,b,c,d,e){return A.oo(b,c,new A.f4(a,!1,!0))}}
A.f4.prototype={
$1(a){return B.S.fX(this.a,a,this.c,this.b)},
$S:20}
A.hF.prototype={
fZ(a,b,c,d,e){var s,r,q,p=d===!0,o=a.a
a.a=B.o
r=p
s=r
try{q=A.lj("gzip",!1,p,new A.hG(this,a,b,!1,!1,s))
return q}finally{a.sdR(o)}},
fX(a,b,c,d){return this.fZ(a,b,!1,c,d)},
eX(a,b,c,d,e){var s,r,q,p,o,n=0
for(;;){s=a.c
r=a.d
r===$&&A.F()
if(!(s<r))break
if(!this.fp(a,e)){if(n!==0)return!1
a.c=s
return B.T.fW(a,b,!1,!1)}q=b.gk(b)
p=new A.dP(a,b,!0)
p.d4()
if(!p.f)return!1
s=a.b
if((s==null?0:s.length-a.c)<8)return!1
a.b3()
o=a.b3()
b.e0()
if(B.a.Y(b.gk(b)-q,4294967296)!==o)return!1;++n}return n!==0},
fp(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gk(0)<10)return!1
s=a.c
if(a.bz()!==35615)return!1
if(a.al()!==8)return!1
r=a.al()
if(b&&(r&224)!==0)return!1
a.b3()
a.al()
a.al()
if((r&4)!==0){if(a.gk(0)<2)return!1
q=a.bz()
if(a.gk(0)<q)return!1
a.e9(q)}if((r&8)!==0)if(!this.dn(a))return!1
if((r&16)!==0)if(!this.dn(a))return!1
if((r&2)!==0){if(a.gk(0)<2)return!1
if(b){p=a.bz()
o=a.bH(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.F()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bH(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.ot(i.hz(),n)}if((n&65535)!==p)throw A.f(A.lX("Invalid gzip header checksum"))}else a.bz()}return!0},
dn(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.F()
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
A.f5.prototype={
ew(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
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
if(l<0)throw A.f(B.a5)}if(l>0)q=r>(a2?0:1)
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
A.fO.prototype={}
A.ia.prototype={
fW(a,b,c,d){var s,r=!1,q=a.a
a.a=B.r
try{s=A.lj("zlib",!1,r,new A.ib(this,a,b,!1,!1))
return s}finally{a.sdR(q)}},
eA(a,b,c,d){var s,r,q,p,o,n,m=a.c,l=a.d
l===$&&A.F()
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
if(B.a.Y(q*256+p,31)!==0)return!1
if((p>>>5&1)!==0){a.b3()
return!1}m=new A.bQ(new Uint8Array(32768),B.o)
o=new A.dP(a,m,!0)
o.d4()
n=o.c.b6()
if(!o.f){b.am(n)
return!1}m=a.b
if((m==null?0:m.length-a.c)<4){b.am(n)
return!1}a.b3()
break A}if(n!=null)b.am(n)
return!0}}
A.ib.prototype={
$0(){var s=this
return s.a.eA(s.b,s.c,s.d,s.e)},
$S:11}
A.dP.prototype={
gah(){var s=this.a
if(s==null)return s
s.d===$&&A.F()
return s},
d4(){var s,r,q,p=this
p.w=p.r=0
if(p.gah()==null)return
s=p.c
if(!(s instanceof A.bQ)){p.d=s
p.c=A.jh(32768)}try{for(;;){r=p.gah()
q=r.c
r=r.d
r===$&&A.F()
if(!(q<r))break
if(!p.fh())return
p.cV(32768)}}finally{p.cV(0)
p.c=s
p.d=null}},
cV(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.b6()
o.am(A.by(q,0,r))
p=A.jh(2097152)
p.am(A.by(q,r,null))
this.c=p},
fh(){var s,r,q,p=this,o=p.gah()
if(o!=null){s=o.c
r=o.d
r===$&&A.F()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.aa(3)
s=(q&1)===0
switch(B.a.M(q,1)){case 0:if(p.fj()===-1)return!1
break
case 1:if(p.cT($.ls(),$.lr())===-1)return!1
break
case 2:if(p.fi()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
aa(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gah()
r=s.c
s=s.d
s===$&&A.F()
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
p=B.a.dl(1,a)
o.r=B.a.c2(r,a)
o.w=s-a
return(r&p-1)>>>0},
bY(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.F()
s=a.b
while(m.w<s){r=m.gah()
q=r.c
r=r.d
r===$&&A.F()
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
m.r=B.a.c2(r,n)
m.w-=n
return o&65535},
fj(){var s,r,q=this
q.w=q.r=0
s=q.aa(16)
if(s!==(q.aa(16)^65535)>>>0)return-1
if(s>q.gah().gk(0))return-1
r=q.gah().e9(s)
q.c.bD(r)
return 0},
fi(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.aa(5)
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
q[n]=o}m=g.du(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.c6(B.d.ga7(l),0,f)
j=J.c6(B.d.ga7(l),f,s)
if(g.fb(n,m,l)===-1)return-1
i=g.dt(k)
n=i==null
h=n?null:g.dt(j)
if(n||h==null)return-1
return g.cT(i,h)},
du(a,b){var s,r
t.L.a(a)
try{s=A.j1(a,b)
return s}catch(r){if(A.af(r) instanceof A.a4)throw r
else throw r}},
dt(a){return this.du(a,!1)},
cT(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.bY(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bC(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.D,r)
q=j.aa(B.D[r])
if(q<0)return-1
if(!(r<29))return A.a(B.C,r)
p=B.C[r]
o=j.bY(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.A,o)
n=j.aa(B.A[o])
if(n<0)return-1
m=B.ae[o]+n
if(m>=1){l=j.c
l=m>l.gk(l)}else l=!0
if(l)return-1
j.c.bB(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gah()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.F()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
fb(a,b,c){var s,r,q,p,o,n,m,l,k=this
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
A.dX.prototype={
bb(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.f(A.iX("The decoded data is larger than the "+s+" bytes allowed"))}},
gk(a){return this.b.b},
e0(){return null},
bC(a){this.bb(1)
this.b.bC(a)},
aQ(a,b){t.L.a(a)
this.bb(a.length)
this.b.aQ(a,b)},
am(a){return this.aQ(a,null)},
bD(a){this.bb(a.gk(0))
this.b.bD(a)},
bB(a,b){this.bb(b)
this.b.bB(a,b)},
aB(a,b){return this.b.aB(a,b)},
b9(a){return this.aB(a,null)}}
A.c7.prototype={}
A.cz.prototype={}
A.dF.prototype={}
A.cB.prototype={
f0(){return"ByteOrder."+this.b}}
A.fw.prototype={
gk(a){return this.c},
aQ(a,b){var s
t.L.a(a)
s=A.by(a,0,a.length)
this.bP(s)},
am(a){return this.aQ(a,null)},
bC(a){var s,r,q,p=this
if(p.r!=null)p.bP(new Uint8Array(A.X(A.h([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.d(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bM()}},
bD(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.F()
if(!(r<q))break
s=a.ht(o,0,J.am(o))
r=s
if(typeof r!=="number")return r.hG()
if(r<=0)break
this.bP(A.by(o,0,s))}}finally{a.c=A.j(p)}},
bP(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bM()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.m(0,new Uint8Array(A.X(A.by(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.J(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bM()}},
bM(){var s=this,r=s.f
if(r===0)return
s.b.m(0,new Uint8Array(A.X(A.by(s.e,0,r))))
s.f=0},
aB(a,b){return A.w(A.aH("a streamed result cannot be read back"))},
b9(a){return this.aB(a,null)}}
A.h9.prototype={}
A.dQ.prototype={
gk(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.j(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bH(a,b){var s,r=this,q=r.b
if(q==null)return A.j3(A.h([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.F()
a=s-b}return A.j3(q,r.a,a,b)},
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
B.d.J(a,b,b+q,p,r)
this.c+=q
return q},
hz(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gk(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.f(A.ap(q,0,r,"position",null))
return J.c6(B.d.ga7(n),o.b.byteOffset+o.c,s)}}
A.dR.prototype={
bz(){var s=this.al(),r=this.al()
if(this.a===B.r)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
b3(){var s=this,r=s.al(),q=s.al(),p=s.al(),o=s.al()
if(s.a===B.r)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
e9(a){var s=this,r=s.bH(a,s.c)
s.c=s.c+r.gk(0)
return r},
sdR(a){this.a=t.fA.a(a)}}
A.bQ.prototype={
e0(){},
b6(){return J.c6(B.d.ga7(this.c),this.c.byteOffset,this.b)},
bC(a){var s,r,q=this
if(q.b===q.c.length)q.f3()
s=q.c
r=q.b++
s.$flags&2&&A.d(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
aQ(a,b){var s,r,q,p,o=this
t.L.a(a)
b=a.length
while(s=o.b,r=s+b,q=o.c,p=q.length,r>p)o.bk(r-p)
B.d.C(q,s,r,a)
o.b+=b},
am(a){return this.aQ(a,null)},
bD(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bk(s+(q?0:r.length-a.c)-n)}if(!q)B.d.J(o,s,s+a.gk(0),r,a.c)
m.b=m.b+a.gk(0)},
bB(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.bk(r-p)
o=s-a
if(a>=b)B.d.J(q,s,r,q,o)
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
return J.c6(B.d.ga7(s.c),s.c.byteOffset+a,b-a)},
b9(a){return this.aB(a,null)},
bk(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.C(s,0,q,r)
this.c=s},
f3(){return this.bk(null)},
gk(a){return this.b}}
A.bw.prototype={
bB(a,b){var s,r=this
for(s=-a;b>a;){r.am(r.b9(s))
b-=a}if(b===a)r.am(r.b9(s))
else r.am(r.aB(s,b-a))},
b6(){return this.aB(0,this.gk(this))}}
A.ez.prototype={}
A.eS.prototype={
hc(a,b){var s,r,q,p,o,n,m,l
if(b<=0)return!1
s=this.x.h(0,a)
r=s!=null
if(r&&s.a>=b)return!0
q=this.CW.h(0,a)
if(q!=null&&q.x&&q.f===b&&q.y>=b)return!0
for(p=this.Q,o=0,n=0;n<b;++n){if(!(r&&s.ar(0,n))){m=p.h(0,new A.A(a,B.a.K(n,4)))
if(m==null)m=null
else{l=n-m.c
m=l>=0&&l<4&&m.d[l]!==255}m=m===!0}else m=!0
if(m)++o
else break}return o>=b},
en(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.cb()
this.a=s},
cB(){this.dx=0
if(this.db.length>65536)this.db=new Uint8Array(65536)},
ee(a,b,c,d,e,f,g,a0){var s,r,q,p,o,n,m,l,k,j,i,h=this
h.ch=h.ay=0
s=a0*e*4
if(d<0||d>=g||b.length<s)return!1
r=new A.A(c,B.a.K(d,4))
q=h.Q
p=q.F(0,r)
if(p!=null){q.q(0,r,p)
if(p.a===a0&&p.b===e&&p.ar(0,d)){p.z=++h.z
p.hs(d,b,a)
if(h.f){o=p.h7(d)
h.ay=o.a
h.ch=o.b}return!0}}if(a!=null){a.a=null
a.b=-1}n=new A.A(c,d)
q=h.w
m=q.F(0,n)
if(m!=null){m.f=++h.z
q.q(0,n,m)
q=m.a
l=q.length
k=m.b
if(h.cU(q,0,l,k,b,s)){if(h.f){j=m.d
if(j===0&&m.e===0){i=A.iZ(m.c,q,0,l,k)
q=m.d=i.a
m.e=i.b}else q=j
h.ay=q
h.ch=m.e}return!0}h.aX(n)}return!1},
hE(a,b,c,d,e,f,g){return this.ee(null,a,b,c,d,e,f,g)},
e7(a,b,c,a0,a1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=this,d=a1*c
if(b<0||b>=a0||d>65536||d<256||e.b<=0)return!1
s=B.a.K(b,4)*4
r=Math.min(s+4,a0)
q=r-s
if(q<2)return!1
p=new A.A(a,B.a.K(s,4))
o=e.Q
if(o.aG(p)||e.as.ar(0,p))return!1
n=A.h([],t.t)
for(m=e.w,l=s,k=0;l<r;++l){j=m.h(0,new A.A(a,l))
if(j!=null){k+=j.a.length
B.b.m(n,l)}}if(n.length<2)return!1
i=d*4
h=e.ax
if(h==null||h.length<i)h=e.ax=new Uint8Array(i)
g=A.mL(s,n,new A.eV(e,a),c,Math.min(B.a.K(e.b,8),k*2),new A.eW(e,a,i),h,a1)
if(g==null){if(n.length===q){q=e.as
q.m(0,p)
if(q.a>128)q.F(0,q.ga4(0))}return!1}for(q=n.length,f=0;f<n.length;n.length===q||(0,A.Z)(n),++f)e.aX(new A.A(a,n[f]))
q=g.w
e.bT(q)
g.z=++e.z
o.q(0,p,g)
e.at+=q
return!0},
cF(a,b,c,d,e,a0,a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=a2*c*4
if(b<0||b>=a1||a0.length<f)return new A.cr([0,0,0,0,0])
s=new A.A(a,B.a.K(b,4))
g.as.F(0,s)
r=g.Q.h(0,s)
r=r==null?null:r.ar(0,b)
if(r===!0)g.fu(s)
q=f+B.a.K(f,255)+16
p=e.h4(q)
if(f>0)$.iS()
o=A.ml(a0,f,p,e.a,f)
n=o<0||o>=f
if(n){m=f
l=a0}else{m=o
l=p}k=A.k4(l,0,m)
if(g.f){j=A.iZ(k,l,0,m,n)
i=j.a
h=j.b}else{i=0
h=0}g.ay=i
g.ch=h
g.fn(l,k,i,h,n,m,new A.A(a,b),0)
e.hu(q)
return new A.cr([m,k,0,i,h])},
h0(a){var s,r=this.CW.F(0,a)
if(r!=null)try{r.c.ca()}catch(s){}return!1},
h5(a){var s,r,q,p,o=this,n=o.Q,m=A.n(n).i("N<1>"),l=m.i("bR<k.E>")
m=A.aO(new A.bR(new A.N(n,m),m.i("u(k.E)").a(new A.eT(a)),l),l.i("k.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.Z)(m),++s){r=n.F(0,m[s])
if(r!=null)o.at=o.at-r.w}n=o.as
n.f5(A.n(n).i("u(1)").a(new A.eU(a)),!0)
q=o.x.F(0,a)
if(q==null)return
for(n=q.gB(q),m=o.w;n.t();){p=m.F(0,new A.A(a,n.gA()))
if(p!=null)o.y=o.y-p.a.length}},
cb(){var s,r,q,p
for(r=this.CW,q=new A.aN(r,r.r,r.e,A.n(r).i("aN<2>"));q.t();){s=q.d
try{s.c.ca()}catch(p){}}r.l(0)},
dS(){var s,r=this
r.w.l(0)
r.x.l(0)
r.y=0
r.Q.l(0)
s=r.as
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bU()}r.at=0
r.ax=null
r.cB()},
eY(a,b,c,d,e,f,g){var s
$.iS()
if(g!=null&&A.k4(a,b,c)!==g)return!1
if(d){if(c!==f)return!1
B.d.J(e,0,f,a,b)
return!0}try{A.mm(a,b,c,e,f)
return!0}catch(s){if(A.af(s) instanceof A.a4)return!1
else throw s}},
cU(a,b,c,d,e,f){return this.eY(a,b,c,d,e,f,null)},
fn(a,b,c,d,e,f,g,h){var s,r,q,p=this,o=p.b
if(o<=0||f>o)return
p.aX(g)
p.bT(f)
s=new Uint8Array(f)
B.d.J(s,0,f,a,h)
p.w.q(0,g,new A.ez(s,e,b,c,d,++p.z))
o=p.x
r=g.a
q=o.h(0,r)
if(q==null){q=A.jc(t.S)
o.q(0,r,q)
o=q}else o=q
o.m(0,g.b)
p.y+=f},
fu(a){var s=this.Q.F(0,a)
if(s!=null)this.at=this.at-s.w},
bT(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
for(s=t.x,r=g.Q,q=A.n(r),p=q.i("N<1>"),o=g.w,n=A.n(o),m=n.i("N<1>"),q=q.i("bN<2>"),n=n.i("bN<2>");g.y+g.at+a>g.b;){l=o.a!==0
k=r.a!==0
if(l&&k){j=new A.bN(o,n).gB(0)
if(!j.t())A.w(A.ab())
i=j.gA().f
j=new A.bN(r,q).gB(0)
if(!j.t())A.w(A.ab())
if(i<=j.gA().z){j=new A.N(o,m).gB(0)
if(!j.t())A.w(A.ab())
g.aX(j.gA())}else{j=new A.N(r,p).gB(0)
if(!j.t())A.w(A.ab())
h=r.F(0,s.a(j.gA()))
if(h!=null)g.at=g.at-h.w}}else if(l){j=new A.N(o,m).gB(0)
if(!j.t())A.w(A.ab())
g.aX(j.gA())}else if(k){j=new A.N(r,p).gB(0)
if(!j.t())A.w(A.ab())
h=r.F(0,s.a(j.gA()))
if(h!=null)g.at=g.at-h.w}else break}},
aX(a){var s,r,q,p=this,o=p.w.F(0,a)
if(o==null)return
p.y=p.y-o.a.length
s=p.x
r=a.a
q=s.h(0,r)
if(q!=null){q.F(0,a.b)
if(q.a===0)s.F(0,r)}},
sfP(a){this.f=A.aV(a)}}
A.eW.prototype={
$2(a,b){var s=this.a,r=s.w.h(0,new A.A(this.b,a)),q=r.a
return s.cU(q,0,q.length,r.b,b,this.c)},
$S:22}
A.eV.prototype={
$1(a){var s,r,q=this.a,p=q.w.h(0,new A.A(this.b,a))
if(p==null)return B.u
if(q.f&&p.d===0&&p.e===0){q=p.c
s=p.a
r=A.iZ(q,s,0,s.length,p.b)
p.d=r.a
p.e=r.b}return new A.A(p.d,p.e)},
$S:23}
A.eT.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.eU.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.fd.prototype={
h4(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
hu(a){var s=this
if(s.b.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.fG.prototype={}
A.ee.prototype={
ar(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
h7(a){var s,r,q=this,p=a-q.c
if(p>=0&&p<4){s=q.d
if(!(p>=0&&p<4))return A.a(s,p)
r=s[p]
if(r!==255){s=q.x
if(!(r<4))return A.a(s,r)
return new A.A(s[r],q.y[r])}}return B.u},
d8(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdz()},
gcR(){var s=this.Q
return s===$?this.Q=B.a.K(this.a+16-1,16):s},
gdz(){var s,r,q=this,p=q.as
if(p===$){s=q.gcR()
r=B.a.K(q.b+16-1,16)
q.as!==$&&A.R()
p=q.as=s*r}return p},
hs(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdz(),b=d.d8(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.d8(a5.b):-1
if(a2===b)return
for(a0=d.a,s=d.b,r=d.f,q=a2>=0,p=d.e,o=p.length,n=0;n<c;++n){m=b+n
if(!(m>=0&&m<o))return A.a(p,m)
l=p[m]
if(q){m=a2+n
if(!(m<o))return A.a(p,m)
m=p[m]===l}else m=!1
if(m)continue
m=d.gcR()
k=B.a.Y(n,m)*16
j=B.a.Z(n,m)*16
i=Math.min(16,a0-k)
h=Math.min(16,s-j)
if(!(l<r.length))return A.a(r,l)
g=r[l]
for(m=i*4,f=0;f<h;++f){e=((j+f)*a0+k)*4
B.d.J(a4,e,e+m,g,f*i*4)}}if(!a){a5.a=a1
a5.b=a3}}}
A.fH.prototype={
$0(){return A.h([],t.t)},
$S:25}
A.ay.prototype={
gR(a){var s=this
return s.a>=s.c||s.b>=s.d},
hf(a){var s=this
return new A.ay(s.a-a,s.b-a,s.c+a,s.d+a)},
bx(a){var s=this
return new A.ay(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.b8.prototype={
ba(a){var s=$.l!=null
if(s)this.b=A.aK(a*4)
else this.c=new Int32Array(a)},
gv(){var s=this.b
if(s!=null)s=A.e_(t.a.a(A.v($.l.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
aw(a,b){var s,r,q,p,o=this,n=o.b
if(n!=null){s=A.aK(a*4)
r=A.e_(t.a.a(A.v($.l.memory).buffer),s,a)
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
a_(){var s=this.b
if(s!=null){$.l.free(s)
this.b=null}}}
A.aZ.prototype={
gv(){var s=this.c
if(s!=null)s=A.jf(t.a.a(A.v($.l.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
aw(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.f(A.aG("Cannot resize a borrowed pixel buffer"))
s=n.c
if(s!=null){r=A.aK(a*4)
q=A.jf(t.a.a(A.v($.l.memory).buffer),r,a)
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
a_(){var s,r,q=this
if(q.a&&q.c!=null){s=$.l
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.fg.prototype={
hp(a,b,c,d,e,f,g,h,i,j,k,a0,a1){var s,r,q,p,o,n,m,l=this;++l.f
s=(j-h)*(k-i)
if(e<2||f===0||a0.b==null||s>262144)return-2
if(s>l.e)l.e=s
r=l.c
if(e>r){if(r>0){$.l.free(l.r)
$.l.free(l.w)}r=e*2
l.c=r
l.r=A.aK(r*8)
l.w=A.aK(l.c*8)}r=l.d
if(f>r){if(r>0){$.l.free(l.x)
$.l.free(l.y)}r=f*2
l.d=r
l.x=A.aK(r*4)
l.y=A.aK(l.d*4)}r=t.a
B.f.C(A.je(r.a(A.v($.l.memory).buffer),l.r,l.c),0,e,a)
B.f.C(A.je(r.a(A.v($.l.memory).buffer),l.w,l.c),0,e,b)
B.e.C(A.e_(r.a(A.v($.l.memory).buffer),l.x,l.d),0,f,c)
B.e.C(A.e_(r.a(A.v($.l.memory).buffer),l.y,l.d),0,f,d)
q=new A.fi(l,f,h,i,j,k,g,a0)
p=q.$0()
while(p===-1){o=a0.b
if(o!=null){n=r.a(A.v($.l.memory).buffer)
m=a0.a
o=new Int32Array(n,o,m)}else{o=a0.c
o.toString}a0.aw(o.length*2,0)
p=q.$0()}return p},
hv(){if($.fh!==this){this.a_()
return}var s=$.cN-1
$.cN=s
if(s>0)return
$.cN=0
$.fh=null
this.a_()},
a_(){var s=this,r=s.a
if(r!==0)$.l.fl_dense_free(r)
$.l.free(s.b)
if(s.c>0){$.l.free(s.r)
$.l.free(s.w)
s.w=s.r=s.c=0}if(s.d>0){$.l.free(s.x)
$.l.free(s.y)
s.y=s.x=s.d=0}}}
A.fi.prototype={
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
return A.dB(j,"fl_dense_raster",[s.a,r,q,p,o,k.b,k.c,k.d,k.e,k.f,n,l,m.gv().length/2|0,s.b],t.S)},
$S:3}
A.ik.prototype={
$8(a,b,c,d,e,f,g,h){this.a.T(g,h,a,b,c,d,e,f,this.b)},
$S:26}
A.hZ.prototype={
h6(a,b,c,d,e,f,g){var s,r=!0
if(g.gR(0)){s=a.f
if(s!==0)if(s<=1024){r=a.r
r=r===0||r>128}}if(r)return!1
r=this.f
if(r==null)r=this.f=new A.br(new Float64Array(256))
r.aH(a.f*4)
g.cg(a.r*2)
for(;;)return!1}}
A.ce.prototype={
geP(){var s=this.a
return s}}
A.fp.prototype={
gd7(){var s=this
if(!s.Q&&s.b){s.Q=!0
s.z=A.mo()}return s.z},
aL(a,b,c,d,e,f,g){var s,r,q,p,o=this,n=o.gd7()
if(n!=null){s=a.f
if(s>4096||a.r>256)o.as=!0
r=n.f
q=n.hp(a.a,a.b,a.c,a.d,s,a.r,b,d,e,f,g,c.a,!0)
o.r=o.r+(n.f-r)
if(q>=0){p=A.e_(t.a.a(A.v($.l.memory).buffer),n.b,4)
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
return}}s=o.ch;(s==null?o.ch=A.kb(256):s).hq(a,b,c,d,e,f,g)},
fo(a,b,c,d,e,f,g,h,i,j,k,l){var s
if(this.gd7()!=null)s=l===0
else s=!0
if(s)return!1
return!1},
di(a,b){var s=this.at,r=s.F(0,a)
if(r==null)return null
if(r.b.G(0,b)){s.q(0,a,r)
return r.c}this.ax=this.ax-r.d
r.c.a.a_()
return null},
c_(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.at
r=s.$ti.i("N<1>")
for(;;){if(!(m.ax+l>1048576||s.a>=256))break
q=new A.N(s,r).gB(0)
if(!q.t())A.w(A.ab())
p=s.F(0,q.gA())
m.ax=m.ax-p.d
o=p.c.a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}r=m.ay
r.toString
o=Math.max(1,c.b)*2
n=new A.b8(o)
n.ba(o)
n=new A.aF(n)
n.dV(c)
s.q(0,a,new A.bS(r,b,n,l))
m.ax+=l},
dq(a,b){var s,r,q,p=this.y2,o=p.F(0,a)
if(o!=null){p.q(0,a,o)
return o.b}if(p.a>=512)p.F(0,new A.N(p,p.$ti.i("N<1>")).ga4(0))
s=this.fx
s.l(0)
A.ij(a,b,0.01,s)
r=Math.max(1,s.f)
q=A.cV(Math.max(1,s.r),r)
B.f.C(q.a,0,s.f,s.a)
B.f.C(q.b,0,s.f,s.b)
B.e.C(q.c,0,s.r,s.c)
B.e.C(q.d,0,s.r,s.d)
B.d.C(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
r=this.ay
r.toString
p.q(0,a,new A.ad(r,q,t.b3))
return q},
f9(a){var s=this.bu,r=s.F(0,a)
if(r==null)return null
s.q(0,a,r)
return r.b},
gaZ(){var s=this.CW
if(s==null){s=new A.b8(2048)
s.ba(2048)
s=this.CW=new A.aF(s)}return s},
gbN(){var s=this.cx
if(s==null){s=new A.b8(2048)
s.ba(2048)
s=this.cx=new A.aF(s)}return s},
gbm(){var s=this.cy
if(s==null){s=new A.b8(2048)
s.ba(2048)
s=this.cy=new A.aF(s)}return s},
gdr(){var s,r,q=this.R8
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.R8=new A.hZ(this.p4,new A.br(q),new A.br(s),new A.br(r),new A.br(new Float64Array(256)))}return q},
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
fm(a,b,c,d){var s,r,q
for(s=this.ok,r=this.p1,q=this.p2;s.length<=a;){B.b.m(s,null)
B.b.m(r,0/0)
B.b.m(q,0/0)}B.b.q(s,a,b)
B.b.q(r,a,c)
B.b.q(q,a,d)},
eG(a,b){var s,r,q,p
for(s=this.k4;s.length<=a;){r=Math.max(16,b)
B.b.m(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.b.q(s,a,q)}return q},
eI(a){var s,r,q,p,o
for(s=this.fy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.aj(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eH(a){var s,r,q,p,o
for(s=this.go;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.aj(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
ao(a){var s,r,q
for(s=this.RG;s.length<=a;){r=new A.b8(2048)
q=$.l!=null
if(q)r.b=A.aK(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aF(r))}s=s[a]
s.l(0)
return s},
eF(a){var s,r,q,p,o
for(s=this.id;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.aj(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eE(a){var s,r,q,p,o
for(s=this.k1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.aj(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
d1(a){var s
for(s=this.k2;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
eD(a){var s,r,q,p,o
for(s=this.rx;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.aj(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eC(a){var s,r,q,p,o
for(s=this.ry;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.aj(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cK(a){var s,r,q
for(s=this.to;s.length<=a;){r=new A.b8(2048)
q=$.l!=null
if(q)r.b=A.aK(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aF(r))}return s[a]},
eB(a){var s,r,q
for(s=this.x1;s.length<=a;){r=new A.b8(2048)
q=$.l!=null
if(q)r.b=A.aK(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aF(r))}return s[a]},
fs(){var s,r,q,p,o
for(s=this.ci,r=new A.aN(s,s.r,s.e,s.$ti.i("aN<2>"));r.t();){q=r.d.b
if(q.a&&q.c!=null){p=$.l
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.l(0)},
cp(a){var s=this,r=a.a,q=s.ok
B.b.ac(q,0,q.length,null)
s.at.bA(0,new A.fq(s,r))
s.y2.bA(0,new A.fr(r))
s.bu.bA(0,new A.fs(r))
s.ci.bA(0,new A.ft(r))},
ea(){var s,r,q,p=this,o=p.ok
B.b.ac(o,0,o.length,null)
for(o=p.at,s=new A.aN(o,o.r,o.e,o.$ti.i("aN<2>"));s.t();){r=s.d.c.a
q=r.b
if(q!=null){$.l.free(q)
r.b=null}}o.l(0)
p.ax=0
p.y2.l(0)
p.bu.l(0)
p.fs()},
a_(){var s,r,q,p,o,n,m=this
m.ea()
s=m.aO
if(s!=null)s.a_()
m.aO=null
s=m.bv
if(s!=null)s.a_()
m.bv=null
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
for(s=m.to,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}for(r=m.x1,p=r.length,q=0;q<r.length;r.length===p||(0,A.Z)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}B.b.l(s)
B.b.l(r)
B.b.l(m.rx)
B.b.l(m.ry)
for(s=m.RG,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}B.b.l(s)
m.df()
m.ch=null},
ed(a){var s,r,q,p,o,n,m,l,k,j,i=this
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
s.y=s.x=s.d=0}}if(a){r=i.aO
if(r!=null)r.a_()
i.aO=null
i.df()
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
B.b.l(i.dY)
i.R8=null}else{for(r=i.x2,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
if(n!=null)if(p<5){o=n.c
if(o!=null){m=q.a(A.v($.l.memory).buffer)
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
B.b.b4(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ag()
r=i.go
q=r.length
B.b.b4(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ag()
r=i.id
q=r.length
B.b.b4(r,Math.min(2,q),q)
q=i.k1
r=q.length
B.b.b4(q,Math.min(2,r),r)
for(r=q.length,k=0;k<q.length;q.length===r||(0,A.Z)(q),++k)q[k].ag()
r=i.k4
q=r.length
B.b.b4(r,Math.min(2,q),q)
q=i.ok
B.b.ac(q,0,q.length,null)
for(p=0;p<r.length;++p)if(r[p].length>4096)B.b.q(r,p,new Float64Array(64))
r=i.R8
if(r!=null){r.b.ag()
r.c.ag()
r.d.ag()
r.e.ag()
r=r.f
if(r!=null)r.ag()}}i.db.X(a)
i.dx.X(a)
i.dy.X(a)
i.fr.X(a)
i.fx.X(a)
for(r=i.id,p=0;p<r.length;++p)r[p].X(a)
if(a){for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.l.free(m)
o.b=null}}B.b.l(r)}else for(r=i.RG,q=r.length,k=0;k<r.length;r.length===q||(0,A.Z)(r),++k)r[k].ag()
r=i.CW
if(r!=null)r.X(a)
r=i.cx
if(r!=null)r.X(a)
r=i.cy
if(r!=null)r.X(a)
for(r=i.rx,p=0;p<r.length;++p)r[p].X(a)
for(r=i.ry,p=0;p<r.length;++p)r[p].X(a)
for(r=i.to,p=0;p<r.length;++p)r[p].X(a)
for(r=i.x1,p=0;p<r.length;++p)r[p].X(a)
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
r.Q=!1}}}i.p3.X(a)},
hC(){return this.ed(!1)},
df(){var s,r,q,p,o,n
for(s=this.x2,r=s.length,q=0;q<s.length;s.length===r||(0,A.Z)(s),++q){p=s[q]
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
if(r==null){q=A.fj(b)
B.b.q(s,a,q)
return q}if(r.gv().length<b)r.aw(b,0)
return r},
c3(a){var s
for(s=this.dY;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
sfw(a){this.ay=t.g_.a(a)}}
A.fq.prototype={
$2(a,b){var s
A.aW(a)
t.az.a(b)
if(b.a!==this.b)return!1
s=this.a
s.ax=s.ax-b.d
b.c.a.a_()
return!0},
$S:15}
A.fr.prototype={
$2(a,b){A.aW(a)
return t.b3.a(b).a===this.a},
$S:28}
A.fs.prototype={
$2(a,b){A.aW(a)
return t.e.a(b).a===this.a},
$S:29}
A.ft.prototype={
$2(a,b){t.I.a(a)
t.dL.a(b)
if(b.a!==this.a)return!1
b.b.a_()
return!0},
$S:30}
A.ad.prototype={}
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
A.nB(a0,e,a.ay,d,k.gdr())
s.l(0)
s.aF(d,q,p,o,n,m,l)
c=k.ao(3)
b=k.ao(4)
k.aL(s,!1,c,j,i,h,g)
a2.aT(b)
A.cY(b,c,a2,e>0?2:3)},
$S:31}
A.c.prototype={
dI(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.dI(a)
s=this.b
if(A.o(s))a.a+="["+A.x(s)+"]"
else{r="."+A.x(s)
a.a+=r}},
u(a){var s,r=new A.cf("")
this.dI(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bA.prototype={
gdQ(){var s,r,q=this,p=q.r
if(p===$){s=q.b
s===$&&A.F()
r=q.c
r===$&&A.F()
p=q.r=new A.ay(0,0,0+s,0+r)}return p},
gI(){var s,r=this,q=r.z
if(q===$){s=B.b.ab(r.w,new A.h7(r))
r.z!==$&&A.R()
r.z=s
q=s}return q},
j(a,b){return A.w(new A.fL(b+" at "+a.u(0),null,null))},
av(a,b,c){if(!t.P.b(b))this.j(c,"Expected object")
return b},
by(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.o(c)){s=new A.c(b,c)
break A}if(typeof c=="string"){s=new A.c(b,c)
break A}s=b
break A}this.j(s,"Expected finite number")}return a},
S(a,b){return this.by(a,b,null)},
O(a,b,c){var s,r
t.P.a(a)
t.h.a(c)
for(s=a.gau(),s=s.gB(s);s.t();){r=s.gA()
if(!c.ar(0,r))this.j(new A.c(b,r),"Unsupported field")}},
eg(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.m(a.h(0,b),0)&&!J.m(a.h(0,b),!1))this.j(new A.c(c,b),"Unsupported nonzero "+b)},
dT(g4,g5,g6,g7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0=this,f1=null,f2="ip",f3="op",f4="Expected object",f5="layers",f6="hasMask",f7="tp",f8="td",f9="masksProperties",g0="shapes",g1="refId",g2="parent",g3=t.P
g3.a(g4)
t.cq.a(g5)
t.h.a(g6)
t.aM.a(g7)
f0.O(g4,B.h,B.aT)
f0.eg(g4,"ddd",B.h)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=g4.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.iV(n)))m=!(n instanceof A.I&&n.gR(n))
if(m)f0.j(new A.c(B.h,o),"Unsupported "+o)}f0.b=f0.S(g4.h(0,"w"),new A.c(B.h,"w"))
f0.c=f0.S(g4.h(0,"h"),new A.c(B.h,"h"))
f0.d=f0.S(g4.h(0,f2),new A.c(B.h,f2))
f0.e=f0.S(g4.h(0,f3),new A.c(B.h,f3))
s=f0.S(g4.h(0,"fr"),new A.c(B.h,"fr"))
f0.f=s
if(f0.b<=0||f0.c<=0||s<=0||f0.e<=f0.d)f0.j(B.h,"Invalid bounds/timing")
s=g5==null
l=s?A.ae(t.N,g3):g5
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){k=s[p]
j=g4.h(0,k)
if(j==null)j=[]
if(!q.b(j))f0.j(new A.c(B.h,k),"Expected asset definitions")
for(m=J.cy(j);m.t();){i=m.gA()
if(!g3.b(i))f0.j(new A.c(B.h,k),f4)
h=i.h(0,"id")
if(typeof h!="string")f0.j(new A.c(B.h,k),"Expected asset id")
l.q(0,h,i)}}g=g4.h(0,f5)
if(!q.b(g))f0.j(B.n,"Expected layers")
f=g7==null?A.ae(t.bP,t.E):g7
e=new A.hW(f0,g,new A.ah(t.gt),new A.bW(t.ai))
s=t.S
r=t.D
d=A.ae(s,r)
c=A.ae(r,s)
s=A.h([],t.f)
b=new A.hd(f0,s)
a=A.ae(r,t.eG)
for(r=J.O(g),m=f0.w,a0=t.n,a1=t.r,a2=t.V,a3=t.c2,a4=f0.a,a5=t.N,a6=t.z,a7=0;a7<r.gk(g);++a7){a8=new A.c(B.n,a7)
a9=r.h(g,a7)
if(!g3.b(a9))f0.j(a8,f4)
f0.O(a9,a8,B.aS)
b0=a9.h(0,"bm")
if(b0==null)b0=0
if(!A.o(b0)||b0<0||b0>16)f0.j(new A.c(a8,"bm"),"Blend mode "+A.x(b0))
for(b1=["ddd","ao"],b2=b1.length,p=0;p<b2;++p)f0.eg(a9,b1[p],a8)
if(a9.h(0,f6)!=null&&!A.b3(a9.h(0,f6))&&!J.m(a9.h(0,f6),0)&&!J.m(a9.h(0,f6),1))f0.j(new A.c(a8,f6),"Expected boolean hasMask")
b3=a9.h(0,"tt")
if(b3==null)b3=0
if(!A.o(b3)||b3<0||b3>4)f0.j(new A.c(a8,"tt"),"Matte type")
if(a9.h(0,f7)!=null&&!J.m(a9.h(0,f7),0)){b1=!0
if(b3!==0)if(a7!==0){b1=a9.h(0,f7)
b2=a7-1
b4=J.ag(r.h(g,b2),"ind")
b1=!J.m(b1,b4==null?b2:b4)}if(b1)f0.j(new A.c(a8,f7),"Unsupported nonzero tp")}if(a9.h(0,f8)!=null&&!J.m(a9.h(0,f8),0)&&!J.m(a9.h(0,f8),1))f0.j(new A.c(a8,f8),"Matte source flag")
b5=f0.eO(a9.h(0,f9),new A.c(a8,f9))
g3.a(a9)
b.fJ(a9,q.a(q.b(a9.h(0,g0))?a9.h(0,g0):B.B),a8,s)
b1=a9.h(0,"sr")
if(b1==null)b1=1
b6=f0.S(b1,new A.c(a8,"sr"))
if(b6===0)f0.j(new A.c(a8,"sr"),"Invalid zero time stretch")
b7=a9.h(0,"ty")
b1=J.aD(b7)
if(!b1.G(b7,4)&&!b1.G(b7,3)&&!b1.G(b7,0)&&!b1.G(b7,1))f0.j(new A.c(a8,"ty"),"Layer type "+A.x(b7))
b8=f0.eZ(a9.h(0,"ef"),new A.c(a8,"ef"),g)
b9=b8.a
c0=b8.b
c1=f0.fc(a9.h(0,"sy"),new A.c(a8,"sy"))
if(c1!=null&&b9!=null)f0.j(new A.c(a8,"ef"),"Fill with Inner Shadow")
b2=c0==null
b4=!b2
if(b4)c2=!b1.G(b7,4)||b3!==0||b0!==0
else c2=!1
if(c2)f0.j(c0.b,"Set Matte requires a normal shape layer without a track matte")
c3=f0.dD(a9.h(0,"ks"),new A.c(a8,"ks"))
if(b1.G(b7,4))c4=f0.d0(a9.h(0,g0),new A.c(a8,g0),e)
else if(b1.G(b7,1)){c2=a9.h(0,"sw")
if(c2==null)c2=0
c5=f0.S(c2,new A.c(a8,"sw"))
c2=a9.h(0,"sh")
if(c2==null)c2=0
c6=f0.S(c2,new A.c(a8,"sh"))
c7=a9.h(0,"sc")
if(typeof c7!="string"||!B.p.ep(c7,"#"))f0.j(new A.c(a8,"sc"),"Invalid solid color")
c8=A.oz(B.p.es(c7,1),16)
c2=B.a.M(c8,16)
c9=B.a.M(c8,8)
d0=new Float32Array(A.X(A.h([c5*0.5,c6*0.5],a0)))
d1=new Float32Array(0)
d2=new Float32Array(A.X(A.h([c5,c6],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.X(A.h([0],a0)))
d5=new A.V(new A.aU(!1,!1,new A.C(d0,f1,!1,d1,!1),new A.C(d2,f1,!1,d3,!1),new A.C(d4,f1,!1,new Float32Array(0),!1)))
c2=new Float32Array(A.X(A.h([(c2&255)/255,(c9&255)/255,(c8&255)/255],a0)))
d6=new A.C(c2,f1,!1,new Float32Array(0),!1)
d6.f=!0
c2=new Float32Array(A.X(A.h([100],a0)))
c9=new Float32Array(0)
d0=new Float32Array(A.X(A.h([1],a0)))
d1=new Float32Array(0)
d7=A.ju(A.h([d5],a1),d6,new A.C(c2,f1,!1,c9,!1),new A.C(d0,f1,!1,d1,!1),!1,!1,1,1,4,f1,f1)
d1=A.h([d5],a1)
d0=A.h([d7],a2)
c9=new Float32Array(A.X(A.h([0,0],a0)))
c2=new Float32Array(0)
d2=new Float32Array(A.X(A.h([0,0],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.X(A.h([100,100],a0)))
d8=new Float32Array(0)
d9=new Float32Array(A.X(A.h([0],a0)))
e0=new Float32Array(0)
e1=new Float32Array(A.X(A.h([100],a0)))
c4=A.js(d1,d0,new A.c_(new A.C(c9,f1,!1,c2,!1),new A.C(d2,f1,!1,d3,!1),new A.C(d4,f1,!1,d8,!1),new A.C(d9,f1,!1,e0,!1),new A.C(e1,f1,!1,new Float32Array(0),!1),f1,f1,f1,f1))}else c4=f1
if(b1.G(b7,0)){h=a9.h(0,g1)
e2=l.h(0,h)
if(typeof h!="string"||e2==null||!q.b(e2.h(0,f5)))f0.j(new A.c(a8,g1),"Missing precomposition")
if(g6.ar(0,h))f0.j(new A.c(a8,g1),"Cyclic precomposition")
b1=a9.h(0,"w")
if(b1==null)b1=f0.b
e3=f0.S(b1,new A.c(a8,"w"))
b1=a9.h(0,"h")
if(b1==null)b1=f0.c
e4=f0.S(b1,new A.c(a8,"h"))
e5=new A.aB(h,e3,e4)
e6=f.h(0,e5)
if(e6==null){e6=A.jq(a4)
b1=A.mi(["w",e3,"h",e4,"ip",0,"op",f0.e-f0.d,"fr",f0.f,"layers",e2.h(0,f5)],a5,a6)
c2=A.mj(a5)
c2.ai(0,g6)
c2.m(0,h)
e6.dT(b1,l,c2,f)
f.q(0,e5,e6)}e7=new A.er(new A.ah(a3)).cA(e6)
f0.x=f0.x+e7.x
f0.y=B.t.bF(f0.y,e7.y)}else e7=f1
e8=a9.h(0,"tm")!=null?f0.L(a9.h(0,"tm"),new A.c(a8,"tm"),1,A.h([0],a0)):f1
b1=a9.h(0,f2)
if(b1==null)b1=f0.d
b1=f0.S(b1,new A.c(a8,f2))
c2=a9.h(0,f3)
if(c2==null)c2=f0.e
c2=f0.S(c2,new A.c(a8,f3))
c9=J.m(a9.h(0,"hd"),!0)
d0=a9.h(0,"st")
if(d0==null)d0=0
d0=f0.S(d0,new A.c(a8,"st"))
e9=A.kD(c3,c4,b1,c2,c9,b0,e7,b9,c1,b5,b2?b3:1,d0,b6,e8,b4)
if(b4)a.q(0,e9,c0)
B.b.m(m,e9)
h=a9.h(0,"ind")
if(h==null)h=a7
if(!A.o(h)||d.aG(h))f0.j(new A.c(a8,"ind"),"Invalid/duplicate layer id")
d.q(0,h,e9)
if(a9.h(0,g2)!=null){if(!A.o(a9.h(0,g2)))f0.j(new A.c(a8,g2),"Invalid parent id")
c.q(0,e9,A.j(a9.h(0,g2)))}}f0.fe(g,d,a)
f0.ff(d,c)},
fO(a){return this.dT(a,null,B.aY,null)},
eO(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e="pt"
if(a==null)return f
if(!t.j.b(a))g.j(b,"Expected list")
s=J.O(a)
if(s.gR(a))return f
r=A.h([],t.bE)
for(q=t.n,p=t.P,o=0;o<s.gk(a);++o){n=new A.c(b,o)
m=s.h(a,o)
if(!p.b(m))g.j(n,"Expected object")
g.O(m,n,B.aR)
l=J.m(m.h(0,"inv"),!0)
k=A.ic(m.h(0,"mode"))
if(k==null)k="a"
if(!B.aZ.ar(0,k))g.j(new A.c(n,"mode"),"Unsupported mask mode "+k)
if(m.h(0,e)==null)g.j(new A.c(n,e),"Missing mask path")
j=g.dd(m.h(0,e),new A.c(n,e))
if(m.h(0,"o")!=null)i=g.L(m.h(0,"o"),new A.c(n,"o"),1,A.h([100],q))
else{h=new Float32Array(A.X(A.h([100],q)))
i=new A.C(h,f,!1,new Float32Array(0),!1)}B.b.m(r,new A.aa(j,k,i,l,m.h(0,"x")!=null?g.L(m.h(0,"x"),new A.c(n,"x"),1,A.h([0],q)):f))}return r},
fe(a,b,c){var s,r,q,p,o,n,m,l,k,j=this
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
j.x+=4}}for(p=new A.bM(c,A.n(c).i("bM<1,2>")).gB(0);p.t();){n=p.d
m=n.a
l=n.b
o=b.h(0,l.a)
k=!0
if(o!=null)if(o.b!=null)if(!o.e)k=o!==m&&o.y!==0
if(k)j.j(l.b,"Set Matte requires a visible shape source without its own matte")
m.ay=o
j.x+=4}for(p=J.O(a),r=0;r<s.length;++r){if(J.m(J.ag(p.h(a,r),"td"),1)){if(!(r<s.length))return A.a(s,r)
k=!s[r].ch}else k=!1
if(k)j.j(new A.c(new A.c(B.n,r),"td"),"Unpaired matte source")}},
ff(a,b){var s,r,q,p,o,n,m,l,k
t.B.a(a)
t.gq.a(b)
for(s=new A.bM(b,A.n(b).i("bM<1,2>")).gB(0);s.t();){r=s.d
q=r.b
p=a.h(0,q)
if(p==null)this.j(B.n,"Missing parent "+q)
r.a.cy=p}for(s=this.w,q=s.length,o=t.D,n=0;n<s.length;s.length===q||(0,A.Z)(s),++n){m=s[n]
l=A.jc(o)
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
if(B.c.H(B.a.E(B.c.N(255*B.c.H(o[0])/100),0,255)*p.aR(a)/255)===0)continue
n=p.ay
m=p.az(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.n(a)
if(0>=o.length)return A.a(o,0)
k=B.c.H(B.a.E(B.c.N(255*B.c.H(o[0])/100),0,255)*n.aR(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.az(a)
if(j==null)continue
m=m.bx(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.c2(q,m)}if(q==null)return null
i=q.bx(this.gdQ())
return i.gR(0)?null:i},
dD(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.ae(t.N,t.z):i.av(0,a,b)
i.O(g,b,B.b4)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.j(new A.c(b,p),"3D transform")}s=t.n
o=i.L(g.h(0,"sk"),new A.c(b,"sk"),1,A.h([0],s))
n=i.L(g.h(0,"sa"),new A.c(b,"sa"),1,A.h([0],s))
m=g.h(0,h)
if(m instanceof A.I&&J.m(m.h(0,"s"),!0)){l=i.av(0,m,new A.c(b,h))
i.O(l,new A.c(b,h),B.aV)
k=i.L(l.h(0,"x"),new A.c(new A.c(b,h),"x"),1,A.h([0],s))
j=i.L(l.h(0,"y"),new A.c(new A.c(b,h),"y"),1,A.h([0],s))
m=null}else{k=null
j=null}return A.jv(i.L(g.h(0,"a"),new A.c(b,"a"),2,A.h([0,0],s)),i.L(m,new A.c(b,h),2,A.h([0,0],s)),i.fI(g.h(0,"s"),new A.c(b,"s"),2,A.h([100,100],s),100),i.L(g.h(0,"r"),new A.c(b,"r"),1,A.h([0],s)),i.L(g.h(0,"o"),new A.c(b,"o"),1,A.h([100],s)),k,j,o,n)},
eZ(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aK
if(!b0.b(b1))a4.j(b2,"Expected effects array")
for(s=J.b5(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.O(b1),n<m.gk(b1);++n){l=new A.c(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.j(new A.c(b2,n),a5)
a4.O(m,l,B.b0)
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
if(!b0.b(f)||J.am(f)!==g.length)a4.j(new A.c(l,a9),"Invalid effect parameters")
e=new A.fY(a4,l,f,g)
d=new A.fZ(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.eq(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aF,B.aG,B.aH,B.aI,B.aJ],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.n(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.c(new A.c(new A.c(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.eb(a0))a4.j(a1,"Expected a static layer index")
o=new A.A(B.c.N(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.am(a2)!==1)a4.j(l,"Invalid layer control")
m=J.k0(a2)
if(!q.b(m))a4.j(new A.c(new A.c(l,a9),0),a5)
a4.O(m,new A.c(new A.c(l,a9),0),B.G)
if(!J.m(m.h(0,a6),10)||!J.m(m.h(0,a7),"ADBE Layer Control-0001"))a4.j(l,"Unsupported effect control")
a=a4.L(m.h(0,"v"),new A.c(new A.c(new A.c(l,a9),0),"v"),1,A.h([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.eb(a0))h=a0!==0&&!s.aq(b3,new A.fX(a0))
else h=!0
if(h)a4.j(l,"Missing layer control target")}}return new A.A(p,o)},
fc(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.iV(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.am(a)!==1)d.j(b,"Expected one Inner Shadow style")
r=new A.c(b,0)
q=d.av(0,J.k0(a),r)
if(!J.m(q.h(0,"ty"),2))d.j(new A.c(r,"ty"),"Unsupported layer style")
d.O(q,r,B.aP)
p=new A.h3(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.m(p.$2(m,0),0))d.j(new A.c(r,m),"Unsupported Inner Shadow parameter")}if(!J.m(p.$2("bm",1),1))d.j(new A.c(r,"bm"),"Inner Shadow requires Multiply")
l=d.L(q.h(0,"c"),new A.c(r,"c"),3,A.h([0,0,0],t.n))
if(l.a==null)d.j(new A.c(r,"c"),"Animated Inner Shadow")
k=l.n(0)
s=p.$2("o",100)
if(typeof s!=="number")return s.a6()
j=B.a.E(B.c.H(s*255/100),0,255)
s=p.$2("a",0)
if(typeof s!=="number")return s.Y()
i=B.c.Y(s,360)*3.141592653589793/180
h=p.$2("d",0)
if(h<0)d.j(new A.c(r,"d"),"Negative Inner Shadow distance")
if(h===0||j===0)return null
s=Math.cos(i)
o=Math.sin(i)
g=k.length
if(0>=g)return A.a(k,0)
f=B.a.E(B.c.H(k[0]*255),0,255)
if(1>=g)return A.a(k,1)
e=B.a.E(B.c.H(k[1]*255),0,255)
if(2>=g)return A.a(k,2)
return A.kC(-s*h,o*h,(j<<24|f<<16|e<<8|B.a.E(B.c.H(k[2]*255),0,255))>>>0)},
dd(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b={}
b.a=b.b=null
b.c=!1
s=c.dB(a,a0,-1,A.h([],t.n),new A.h4(b,c,a))
r=A.h([],t.hg)
q=s.b
if(q!=null&&b.c){p=b.a
p.toString
o=q.a.length
n=A.jd(o,!1,!1,t.y)
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
B.b.m(r,new A.A(e,d))}}c.x=c.x+(s.gct()/6|0)
p=b.b
return new A.aA(s,p!==!1,r)},
d0(e3,e4,e5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7=this,d8=null,d9="ks",e0="d",e1="Path direction",e2="r"
if(!t.j.b(e3))d7.j(e4,"Expected shape list")
s=t.r
r=A.h([],s)
q=A.h([],t.V)
for(p=t.P,o=t.aT,n=t.eU,m=n.i("k.E"),l=t.n,k=t.u,j=t.S,i=t.W,h=t.fq,g=t.bs,f=t.fP,e=d8,d=0;c=J.O(e3),d<c.gk(e3);++d){b=new A.c(e4,d)
a=c.h(e3,d)
if(!p.b(a))d7.j(b,"Expected object")
a0=a.h(0,"ty")
a1=a.h(0,"bm")
if(a1==null)a1=0
if(!A.o(a1)||a1<0||a1>16)d7.j(new A.c(b,"bm"),"Blend mode "+A.x(a1))
a2=J.m(a.h(0,"hd"),!0)
switch(a0){case"tr":if(e!=null||d!==c.gk(e3)-1)d7.j(b,"Transform must be last and unique")
e=d7.dD(a,b)
break
case"gr":d7.O(a,b,B.aU)
a3=d7.d0(a.h(0,"it"),new A.c(b,"it"),e5)
if(!a2){B.b.m(r,a3)
B.b.m(q,a3)}break
case"sh":d7.O(a,b,B.aW)
if(a.h(0,d9)==null)d7.j(new A.c(b,d9),"Missing path data")
a4=e5.cw(a.h(0,d9),new A.c(b,d9))
if(!a2)B.b.m(r,new A.V(a4))
break
case"rc":case"el":d7.O(a,b,B.b1)
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a5=d7.b_(a.h(0,"p"),new A.c(b,"p"),2,A.h([0,0],l),!0)
a6=d7.b_(a.h(0,"s"),new A.c(b,"s"),2,A.h([0,0],l),!0)
a7=d7.L(a.h(0,e2),new A.c(b,e2),1,A.h([0],l))
d7.x+=8
if(!a2)B.b.m(r,new A.V(new A.aU(J.m(a0,"el"),J.m(a.h(0,e0),3),a5,a6,a7)))
break
case"sr":d7.O(a,b,B.b_)
a8=a.h(0,"sy")
if(a8==null)a8=1
c=J.aD(a8)
if(!c.G(a8,1)&&!c.G(a8,2))d7.j(new A.c(b,"sy"),"PolyStar type "+A.x(a8))
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a9=d7.L(a.h(0,"pt"),new A.c(b,"pt"),1,A.h([5],l))
a5=d7.b_(a.h(0,"p"),new A.c(b,"p"),2,A.h([0,0],l),!0)
b0=d7.L(a.h(0,e2),new A.c(b,e2),1,A.h([0],l))
b1=d7.L(a.h(0,"or"),new A.c(b,"or"),1,A.h([0],l))
b2=d7.L(a.h(0,"os"),new A.c(b,"os"),1,A.h([0],l))
if(c.G(a8,1))if(a.h(0,"ir")!=null){b3=d7.L(a.h(0,"ir"),new A.c(b,"ir"),1,A.h([0],l))
b4=b3}else{b3=new Float32Array(A.X(A.h([0],l)))
b3=new A.C(b3,d8,!1,new Float32Array(0),!1)
b4=b3}else b4=d8
if(c.G(a8,1))if(a.h(0,"is")!=null){b3=d7.L(a.h(0,"is"),new A.c(b,"is"),1,A.h([0],l))
b5=b3}else{b3=new Float32Array(A.X(A.h([0],l)))
b3=new A.C(b3,d8,!1,new Float32Array(0),!1)
b5=b3}else b5=d8
d7.x+=12
if(!a2)B.b.m(r,new A.V(new A.b1(c.G(a8,1),J.m(a.h(0,e0),3),a9,a5,b0,b1,b2,b4,b5)))
break
case"tm":d7.O(a,b,B.b3)
b6=a.h(0,"m")
if(b6==null)b6=1
c=J.aD(b6)
if(!c.G(b6,1)&&!c.G(b6,2))d7.j(new A.c(b,"m"),"Trim mode")
b3=A.h([],s)
b7=new A.bD(b3,d7.L(a.h(0,"s"),new A.c(b,"s"),1,A.h([0],l)),d7.L(a.h(0,"e"),new A.c(b,"e"),1,A.h([100],l)),d7.L(a.h(0,"o"),new A.c(b,"o"),1,A.h([0],l)),c.G(b6,2),A.ae(j,i))
if(!a2){b8=A.h([],h)
new A.h2(b8).$1(r)
B.b.ai(b3,new A.a_(b8,g.a(new A.h0()),f))
for(b9=0;b9<b8.length;++b9)b8[b9].a=new A.bl(b7,b9)}++d7.x
break
case"fl":case"st":case"gf":case"gs":d7.O(a,b,B.aN)
c=J.aD(a0)
c0=c.G(a0,"st")||c.G(a0,"gs")
if(c0)d7.y=!0
c1=c0?d7.eW(a.h(0,e0),new A.c(b,e0)):d8
c2=a.h(0,e2)
if(c2==null)c2=1
b3=J.aD(c2)
if(!b3.G(c2,1)&&!b3.G(c2,2))d7.j(new A.c(b,e2),"Fill rule")
c3=a.h(0,"lc")
if(c3==null)c3=1
c4=a.h(0,"lj")
if(c4==null)c4=1
if(!A.o(c3)||c3<1||c3>3||!A.o(c4)||c4<1||c4>3)d7.j(b,"Stroke cap/join")
c5=d7.L(a.h(0,"c"),new A.c(b,"c"),3,A.h([0,0,0],l))
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
c6[d0]=d1/255}}d3=d7.L(a.h(0,"o"),new A.c(b,"o"),1,A.h([100],l))
d4=d7.L(a.h(0,"w"),new A.c(b,"w"),1,A.h([1],l))
if(!a2){c7=A.aO(r,k)
b3=b3.G(c2,2)
c8=a.h(0,"ml")
if(c8==null)c8=4
c8=d7.S(c8,new A.c(b,"ml"))
B.b.m(q,A.ju(c7,c5,d3,d4,c0,b3,c3,c4,c8,c1,c.G(a0,"gf")||c.G(a0,"gs")?d7.fa(a,b):d8))}d7.x+=2
break
case"mm":d7.O(a,b,B.aX)
b6=a.h(0,"mm")
if(b6==null)b6=1
if(!A.o(b6)||b6<1||b6>5)d7.j(new A.c(b,"mm"),"Shape op mm mode "+A.x(b6))
if(!a2&&r.length!==0){d5=A.aO(new A.bR(r,o.a(new A.h1()),n),m)
if(d5.length===1)d6=b6===4||r.length>1
else d6=!1
B.b.l(r)
if(d5.length!==0)B.b.m(r,d6?B.b.gaf(d5):new A.aS(d5,b6))}else if(a2)B.b.l(r);++d7.x
break
default:d7.j(new A.c(b,"ty"),"Shape op "+A.x(a0))}}return A.js(r,q,e==null?A.n5():e)},
eW(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.j(b,"Expected dash array")
s=A.h([],t.gC)
for(r=t.n,q=t.P,p=null,o=0;n=J.O(a),o<n.gk(a);++o){m=new A.c(b,o)
n=n.h(a,o)
if(!q.b(n))j.j(new A.c(b,o),"Expected object")
j.O(n,m,B.b2)
l=j.L(n.h(0,"v"),new A.c(m,"v"),1,A.h([0],r))
k=n.h(0,"n")
n=J.aD(k)
if(n.G(k,"o")){if(p!=null)j.j(m,"Duplicate dash offset")
p=l}else if(n.G(k,(s.length&1)===0?"d":"g"))B.b.m(s,l)
else j.j(new A.c(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.b.m(s,B.b.gad(s))
return A.kz(s,p==null?A.ch(A.h([0],r)):p)},
fa(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.av(0,a.h(0,"g"),new A.c(b,"g"))
k.O(s,new A.c(b,"g"),B.b5)
r=s.h(0,"p")
if(!A.o(r)||r<=0)k.j(new A.c(new A.c(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dB(s.h(0,"k"),new A.c(new A.c(b,"g"),"k"),-1,A.h([],q),new A.h_(k,r))
if(!J.m(a.h(0,"t"),1)&&!J.m(a.h(0,"t"),2))k.j(new A.c(b,"t"),"Gradient type")
o=k.b_(a.h(0,"s"),new A.c(b,"s"),2,A.h([0,0],q),!0)
n=k.b_(a.h(0,"e"),new A.c(b,"e"),2,A.h([0,0],q),!0)
m=J.m(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.L(a.h(0,"h"),new A.c(b,"h"),1,A.h([0],q))
return A.kB(r,p,o,n,m,l,a.h(0,"a")==null?null:k.L(a.h(0,"a"),new A.c(b,"a"),1,A.h([0],q)))},
bs(a,b,c,d,e,f,g){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return A.ch(d)
s=o.av(0,a,b)
o.O(s,b,B.H)
if(s.h(0,"a")!=null&&!J.m(s.h(0,"a"),0)&&!J.m(s.h(0,"a"),1))o.j(new A.c(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.m(s.h(0,"x"),""))o.j(new A.c(b,"x"),"Expressions")
r=new A.c(b,"k")
q=s.h(0,"k")
if(!J.m(s.h(0,"a"),1)){if(t.j.b(q)){p=J.O(q)
p=p.gcm(q)&&p.ga4(q) instanceof A.I&&J.ag(p.ga4(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p){p=o.bi(q,r,c,g,e,null,0,0)
return new A.C(p,null,!1,new Float32Array(0),!1)}if(!t.j.b(q)||J.iV(q))o.j(r,"Expected keyframes")
return o.eM(q,r,c,g,f,e)},
L(a,b,c,d){return this.bs(a,b,c,d,null,!1,0)},
b_(a,b,c,d,e){return this.bs(a,b,c,d,null,e,0)},
dB(a,b,c,d,e){return this.bs(a,b,c,d,e,!1,0)},
fI(a,b,c,d,e){return this.bs(a,b,c,d,null,!1,e)},
dC(a,b,c,d){var s
A.j(c)
if(b==null)return new Float32Array(c)
if(c!==d){s=a.a
s.toString
this.j(s,"Morph topology/component count changes")}return b},
bi(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this
t.c.a(e)
if(e!=null)return e.$5(a,b,f,g,h)
if(f==null)s=new Float32Array(c)
else s=f
if(t.j.b(a)){r=J.O(a)
if(r.gk(a)<c)n.j(b,"Expected "+c+" components")
for(q=0;q<c;++q){p=g+q
o=n.by(r.h(a,q),b,q)
s.$flags&2&&A.d(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gk(a)>2&&n.S(r.h(a,2),b)!==d)n.j(b,"Non-planar component")}else{if(c!==1)n.j(b,"Expected "+c+" components")
r=n.by(a,b,0)
s.$flags&2&&A.d(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
eM(e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3=this,e4=null,e5="Expected object",e6=t.j
e6.a(e7)
t.c.a(f2)
s=J.b5(e7)
r=s.gad(e7)
q=t.P
p=q.b(r)
o=p?r.h(0,"t"):e4
n=!1
if(p)if(r.h(0,"e")!=null){if(!J.m(r.h(0,"h"),1))if(typeof o=="number"){p=e3.e
p===$&&A.F()
p=o<p}else p=n
else p=n
n=p}p=s.gk(e7)
m=p+(n?1:0)
l=new Float64Array(m)
p=m*3
k=new Int32Array(p)
for(j=s.gB(e7),i=0,h=0,g=!1;j.t();){f=j.gA()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.m(f.h(0,"h"),1))++h
g=B.t.bF(g,f.h(0,"to")!=null)}j=h*(f1?8:4)
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
if(b5)e3.dJ(b2,"to",e9,b0,d,a9*4)
b6=b3==null
if(!b6)e3.dJ(b3,"ti",e9,b0,d,a9*4+2)
if(b4!==b6)e3.j(b0,"Incomplete spatial tangents")
b7=e3.by(b1.h(0,"t"),b0,"t")
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
c0=e3.bi(b8,new A.c(b0,"s"),e9,f0,f2,e4,0,0)
if(b.b!==b)A.w(A.fb(""))
b.b=c0
if(a.b!==a)A.w(A.fb(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.w(A.fb(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.w(A.fb(""))
c.b=b4
b6=a.b
if(b6===a)A.w(A.ao(""))
B.i.C(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.w(A.ao(""))
if(typeof b4!=="number")return A.U(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.w(A.ao(""))
b6=a.b
if(b6===a)A.w(A.ao(""))
if(typeof b6!=="number")return A.U(b6)
J.k1(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.w(A.ao(""))
b6=a.b
if(b6===a)A.w(A.ao(""))
e3.bi(b8,new A.c(b0,"s"),e9,f0,f2,b4,c1,b6)}}c2=J.m(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.w(A.ao(""))
if(typeof b4!=="number")return A.U(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.w(A.ao(""))
b5=a.b
if(b5===a)A.w(A.ao(""))
e3.bi(b9,new A.c(b0,"e"),e9,f0,f2,b4,c1,b5)
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
c9=e3.bj(c5,b0)
d0=e3.bj(c6,b0)
d1=e3.bj(c7,b0)
d2=e3.bj(c8,b0)
d3=Math.max(Math.max(c9,d0),Math.max(d1,d2))
b1=!1
if(d3!==1){b4=a.b
if(b4===a)A.w(A.ao(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e3.j(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e3.j(b0,"Easing component mismatch")
if(f1){b1=a.b
if(b1===a)A.w(A.ao(""))}else{b1=a.b
if(b1===a)A.w(A.ao(""))
b1=Math.min(A.lg(b1),1)}d4=Math.min(A.lg(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e6.b(c8),b4=e6.b(c7),b5=e6.b(c6),b6=e6.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.O(c5)
d6=d6.h(c5,d6.gk(c5)===1?0:d5)}else d6=c5
d7=B.c.E(A.eH(d6),0,1)
if(b5){d6=J.O(c6)
d6=d6.h(c6,d6.gk(c6)===1?0:d5)}else d6=c6
A.eH(d6)
if(b4){d8=J.O(c7)
d8=d8.h(c7,d8.gk(c7)===1?0:d5)}else d8=c7
d9=B.c.E(A.eH(d8),0,1)
if(b1){d8=J.O(c8)
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
k[a9]=c3}if(m===1){e6=b.ap()
return new A.C(e6,e4,!1,new Float32Array(0),!1)}if(n){e6=a0.ap()
if(typeof e6!=="number")return A.U(e6)
c1=a2*e6
e6=e3.e
e6===$&&A.F()
if(!(a2>=0))return A.a(l,a2)
l[a2]=e6
e6=c.ap()
s=a.ap()
if(typeof s!=="number")return A.U(s)
J.k1(e6,c1,c1+s,c.ap(),a8)
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
e2=A.b_(0,a7,B.a.Z(e.byteLength,e1))*e1
if(B.a.Y(e2,8)!==0)A.w(A.aE("The number of bytes to view must be a multiple of 8",e4))
p=J.lR(B.f.ga7(e),e.byteOffset+0*e1,B.a.K(e2,8))}p=A.mg(l,e6,s,k,q,p,d,a4)
return new A.C(e4,p,a4,new Float32Array(p.b),!1)},
dJ(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.am(a)<2)o.j(new A.c(d,b),"Invalid spatial tangent")
if(c!==2&&J.lQ(a,new A.h6()))o.j(new A.c(d,b),"Spatial tangent on non-position")
s=J.O(a)
r=o.S(s.h(a,0),d)
q=o.S(s.h(a,1),d)
if(e!=null){e.$flags&2&&A.d(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=r
p=f+1
if(!(p<s))return A.a(e,p)
e[p]=q}},
bj(a,b){var s,r
if(!t.j.b(a)){this.S(a,b)
return 1}for(s=J.b5(a),r=s.gB(a);r.t();)this.S(r.gA(),b)
return s.gk(a)}}
A.h7.prototype={
$1(a){var s,r,q
t.D.a(a)
s=!1
if(a.gI()){r=this.a
q=r.d
q===$&&A.F()
if(a.c<=q){s=r.e
s===$&&A.F()
s=a.d>=s}}return s},
$S:32}
A.fY.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.c(new A.c(q.b,"ef"),a),o=q.a,n=o.av(0,J.ag(q.c,a),p)
o.O(n,p,B.G)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.m(s,r[a])||n.h(0,"v")==null)o.j(p,"Invalid effect parameter")
return o.L(n.h(0,"v"),new A.c(p,"v"),b,A.h([],t.n))},
$1(a){return this.$2$dimensions(a,1)},
$S:33}
A.fZ.prototype={
$2(a,b){var s,r=this.b.$1(a)
if(r.a!=null){s=r.n(0)
if(0>=s.length)return A.a(s,0)
s=s[0]!==b}else s=!0
if(s)this.a.j(new A.c(new A.c(new A.c(this.c,"ef"),a),"v"),"Unsupported effect parameter value")},
$S:34}
A.fX.prototype={
$1(a){return J.m(J.ag(a,"ind"),this.a)},
$S:13}
A.h3.prototype={
$2(a,b){var s=this.a,r=this.c,q=s.L(this.b.h(0,a),new A.c(r,a),1,A.h([b],t.n))
if(q.a==null)s.j(new A.c(r,a),"Animated Inner Shadow")
s=q.n(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:36}
A.h4.prototype={
$5(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=t.j
if(e.b(a)){s=J.O(a)
s=s.gk(a)===1&&s.ga4(a) instanceof A.I}else s=!1
if(s)a=J.lU(a)
s=this.b
r=s.av(0,a,b)
s.O(r,b,B.aO)
q=r.h(0,"c")
if(!A.b3(q))s.j(new A.c(b,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.t.bF(p.c,q!==o)
o=b.a
n=o==null?null:o.b
if(A.o(n)){m=p.a
if(m==null){o=J.am(e.a(J.ag(this.c,"k")))
m=p.a=new Uint8Array(o*2)}p=b.b==="e"?1:0
p=n*2+p
o=q?1:2
m.$flags&2&&A.d(m)
if(!(p>=0&&p<m.length))return A.a(m,p)
m[p]=o}l=r.h(0,"v")
k=r.h(0,"i")
j=r.h(0,"o")
p=!0
if(e.b(l))if(e.b(k))if(e.b(j)){e=J.O(l)
e=e.gk(l)!==J.am(k)||e.gk(l)!==J.am(j)}else e=p
else e=p
else e=p
if(e)s.j(b,"Invalid path topology")
e=J.O(l)
i=s.dC(b,c,e.gk(l)*6,a0)
h=new A.h5(s,b,i)
for(g=0;g<e.gk(l);++g){f=d+g*6
h.$2(e.h(l,g),f)
h.$2(J.ag(k,g),f+2)
h.$2(J.ag(j,g),f+4)}return i},
$S:14}
A.h5.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.am(a)!==2)m.a.j(m.b,"Expected 2D path point")
s=m.c
r=m.a
q=J.O(a)
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
$S:38}
A.h2.prototype={
$1(a){var s,r,q,p
t.cH.a(a)
for(s=a.length,r=this.a,q=0;q<a.length;a.length===s||(0,A.Z)(a),++q){p=a[q]
if(p instanceof A.V)B.b.m(r,p)
if(p instanceof A.a8)this.$1(p.a)}},
$S:39}
A.h0.prototype={
$1(a){return t.bD.a(a).a},
$S:40}
A.h1.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a8)||a.ge2()},
$S:1}
A.h_.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.O(a)
r=k.b*4
s=s.gk(a)<r||(s.gk(a)-r&1)===1}else s=!0
if(s)k.a.j(b,"Invalid gradient stops")
s=k.a
r=J.O(a)
q=s.dC(b,c,r.gk(a),e)
for(p=k.b,o=0;o<r.gk(a);++o){n=s.S(r.h(a,o),b)
if(o<p*4&&B.a.Y(o,4)!==0){m=B.a.E(B.c.H(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.d(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:14}
A.h6.prototype={
$1(a){return!J.m(a,0)},
$S:13}
A.hd.prototype={
c7(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
t.ew.a(d)
t.ae.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.jV()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.o(n)?new A.c(p,n):new A.c(p,A.L(n))}if(this.fz(a,r,b,p,e==null?new A.bW(t.ao):e))return}for(q=a.gau(),q=q.gB(q),m=t.j;q.t();){l=q.gA()
k=a.h(0,l)
if(!s.b(k)&&!m.b(k))continue
B.b.m(d,l)
this.c7(k,b,c,d,e,l==="ks"&&J.m(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a))for(m=J.O(a),j=0;j<m.gk(a);++j){k=m.h(a,j)
if(!s.b(k)&&!q.b(k))continue
B.b.m(d,j)
this.dH(k,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
fJ(a,b,c,d){return this.c7(a,b,c,d,null,!1)},
dH(a,b,c,d,e){return this.c7(a,b,c,d,e,!1)},
fz(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null
t.P.a(a0)
t.bC.a(a4)
if(!a4.m(0,a0))b.a.j(a3,"Cyclic expression reference")
try{i=$.lJ()
if(i.b.test(a1)){a0.F(0,"x")
return!0}s=new A.c(a3,"x")
r=$.lH().e_(a1)
if(r==null)b.a.j(s,"Unsupported expression syntax")
q=a2
p=null
i=$.jW()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dK(0,h)
h=new A.ci(h.a,h.b,h.c)
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
d=$.lI()
c=A.L(n)
m=d.b.test(c)?B.y.dW('"'+A.x(n)+'"',a):n
p=b.c5(q,"nm",A.L(m))
if(p==null)f.j(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.B)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=b.c5(q,"ty","tr")
l=i==null?a:i.h(0,"s")
break
case"transform.rotation":i=b.c5(q,"ty","tr")
l=i==null?a:i.h(0,"r")
break
default:i=p
l=i==null?a:J.ag(i,"o")
break}k=l
j=f.av(0,k,s)
if(j===a0){a0.F(0,"x")
return!0}b.dH(j,a2,s,A.h([],t.f),a4)
a0.l(0)
a0.ai(0,j)
return!1}finally{a4.F(0,a0)}},
c5(a,b,c){var s,r,q,p
for(s=J.cy(a),r=t.P,q=null;s.t();){p=s.gA()
if(!r.b(p)||!J.m(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q}}
A.hW.prototype={
cw(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.av(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.ag(j,"x")
s=typeof n=="string"?$.jV().e_(n):null
if(s==null){k=k.dd(j,b)
i.q(0,j,k)
return k}r=new A.c(b,"x")
k.O(j,b,B.H)
if(J.ag(j,"a")!=null&&!J.m(J.ag(j,"a"),0)&&!J.m(J.ag(j,"a"),1))k.j(new A.c(b,"a"),"Invalid animated flag")
m=l.d
if(!m.m(0,j))k.j(r,"Cyclic path reference")
try{q=null
p=null
o=l.fH(s,r)
q=o.a
p=o.b
k=l.cw(q,p)
i.q(0,j,k)
return k}finally{m.F(0,j)}},
fH(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.d6(j.b,s,B.n,b,"layer")
q=r.a
if(!J.m(q.h(0,"ty"),4))j.a.j(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.c(r.b,"shapes")
s=$.jW()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dK(0,i)
i=new A.ci(i.a,i.b,i.c)
s=t.d
while(i.t()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.d6(p,m,o,b,"content")
q=l.a
o=l.b
p=J.m(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.c(o,"it")}k=q.h(0,"ks")
if(!J.m(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.j(b,"Path reference needs a B\xe9zier path")
return new A.A(k,new A.c(o,"ks"))},
d6(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.O(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gk(a);++m){l=s.h(a,m)
if(r.b(l)&&J.m(l.h(0,"nm"),b)){if(o!=null)q.j(d,p)
n=m
o=l}}if(o!=null)return new A.A(o,new A.c(c,n))}this.a.j(d,"Missing "+e+" reference: "+b)}}
A.er.prototype={
a0(a,b,c){var s
A.ol(c,t.K,"T","_copy")
s=c.a(this.b.e8(c.a(a),c.i("0()").a(b)))
return s},
D(a){var s=t.A
s.a(a)
if(a.a!=null)return a
return this.a0(a,new A.hs(a),s)},
ec(a){return this.a0(a,new A.ht(this,a),t.d1)},
cD(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.a8)return s.bE(a)
if(a instanceof A.V)return s.a0(a,new A.hm(s,a),r)
if(a instanceof A.bl)return s.a0(a,new A.hn(s,a),r)
if(a instanceof A.aS)return s.a0(a,new A.ho(s,a),r)
if(a instanceof A.aA)return s.a0(a,new A.hp(s,a),r)
if(a instanceof A.aU)return s.a0(a,new A.hq(s,a),r)
if(a instanceof A.b1)return s.a0(a,new A.hr(s,a),r)
throw A.f(A.aG("Unknown compiled geometry"))},
h2(a){var s=t.G
s.a(a)
if(a instanceof A.a8)return this.bE(a)
if(a instanceof A.bk)return this.a0(a,new A.hg(this,a),s)
throw A.f(A.aG("Unknown compiled paint"))},
bE(a){return this.a0(a,new A.hi(this,a),t.eV)},
ei(a){return this.a0(a,new A.hh(this,a),t.I)},
hB(a,b){return this.a0(b,new A.hu(this,b),t.e_)},
fR(a){return this.a0(a,new A.hf(this,a),t.bo)},
hn(a){var s=t.J
s.a(a)
return this.a0(a,new A.hk(this,a),s)},
co(a){var s=t.D
s.a(a)
return this.a0(a,new A.hj(this,a),s)},
cA(a){return this.a0(a,new A.hl(this,a),t.E)}}
A.hs.prototype={
$0(){var s=this.a
return new A.C(s.a,s.b,s.c,new Float32Array(s.d.length),s.f)},
$S:47}
A.ht.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.D(o.a),m=p.D(o.b),l=p.D(o.c),k=p.D(o.d),j=p.D(o.e),i=o.f
i=i==null?q:p.D(i)
s=o.r
s=s==null?q:p.D(s)
r=o.w
r=r==null?q:p.D(r)
o=o.x
return A.jv(n,m,l,k,j,i,s,r,o==null?q:p.D(o))},
$S:48}
A.hm.prototype={
$0(){return new A.V(this.a.cD(this.b.a))},
$S:49}
A.hn.prototype={
$0(){var s=this.b
return new A.bl(this.a.hB(0,s.a),s.b)},
$S:50}
A.ho.prototype={
$0(){var s=this.b,r=s.a,q=A.a2(r),p=q.i("a_<1,B>")
r=A.aO(new A.a_(r,q.i("B(1)").a(this.a.gb8()),p),p.i("a7.E"))
return A.mV(r,s.b)},
$S:51}
A.hp.prototype={
$0(){var s=this.b
return new A.aA(this.a.D(s.e),s.f,s.r)},
$S:52}
A.hq.prototype={
$0(){var s=this.b,r=this.a
return new A.aU(s.e,s.f,r.D(s.r),r.D(s.w),r.D(s.x))},
$S:81}
A.hr.prototype={
$0(){var s,r=this.b,q=this.a,p=q.D(r.r),o=q.D(r.w),n=q.D(r.x),m=q.D(r.y),l=q.D(r.z),k=r.Q
k=k==null?null:q.D(k)
s=r.as
q=s==null?null:q.D(s)
return new A.b1(r.e,r.f,p,o,n,m,l,k,q)},
$S:54}
A.hg.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a2(o),l=m.i("a_<1,B>")
o=A.aO(new A.a_(o,m.i("B(1)").a(n.gb8()),l),l.i("a7.E"))
m=n.D(p.b)
l=n.D(p.c)
s=n.D(p.d)
r=p.y
r=r==null?null:n.ei(r)
q=p.z
n=q==null?null:n.fR(q)
return A.ju(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:55}
A.hi.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a2(q),n=o.i("a_<1,B>")
q=A.aO(new A.a_(q,o.i("B(1)").a(p.gb8()),n),n.i("a7.E"))
o=r.b
n=A.a2(o)
s=n.i("a_<1,aI>")
o=A.aO(new A.a_(o,n.i("aI(1)").a(p.gh1()),s),s.i("a7.E"))
return A.js(q,o,p.ec(r.c))},
$S:56}
A.hh.prototype={
$0(){var s,r=this.b,q=this.a,p=q.D(r.c),o=q.D(r.d),n=q.D(r.e),m=r.f
m=m==null?null:q.D(m)
s=r.r
q=s==null?null:q.D(s)
return A.kB(r.a,p,o,n,r.w,m,q)},
$S:57}
A.hu.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a2(r),o=p.i("a_<1,B>")
r=A.aO(new A.a_(r,p.i("B(1)").a(q.gb8()),o),o.i("a7.E"))
return A.n6(r,q.D(s.b),q.D(s.c),q.D(s.d),s.e)},
$S:58}
A.hf.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a2(r),o=p.i("a_<1,C>")
r=A.aO(new A.a_(r,p.i("C(1)").a(q.ghA()),o),o.i("a7.E"))
return A.kz(r,q.D(s.b))},
$S:59}
A.hk.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.D(q.e),o=s.D(r.c),n=r.e
s=n==null?null:s.D(n)
return A.mU(new A.aA(p,q.f,q.r),r.b,o,r.d,s)},
$S:60}
A.hj.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.ec(l.a),j=l.b
j=j==null?n:m.bE(j)
s=l.f
s=s==null?n:m.cA(s)
r=l.x
r=r==null?n:m.D(r)
q=l.z
if(q==null)q=n
else{p=A.a2(q)
o=p.i("a_<1,aa>")
q=A.aO(new A.a_(q,p.i("aa(1)").a(m.ghm()),o),o.i("a7.E"))}p=l.at
p=p==null?n:new A.eq(m.D(p.a),m.D(p.b))
o=l.as
o=o==null?n:A.kC(o.a,o.b,o.c)
r=A.kD(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.co(k)
r.ch=l.ch
return r},
$S:61}
A.hl.prototype={
$0(){var s,r,q,p,o=this.b,n=A.jq(o.a),m=o.b
m===$&&A.F()
n.b=m
m=o.c
m===$&&A.F()
n.c=m
m=o.d
m===$&&A.F()
n.d=m
m=o.e
m===$&&A.F()
n.e=m
m=o.f
m===$&&A.F()
n.f=m
n.x=o.x
n.y=o.y
m=n.w
o=o.w
s=this.a
r=A.a2(o)
B.b.ai(m,new A.a_(o,r.i("a9(1)").a(s.ghj()),r.i("a_<1,a9>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.co(p)}}return n},
$S:62}
A.bh.prototype={
ghd(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.n(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
h8(a,b,c){var s,r,q,p,o=this.f
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
return new A.A(Math.cos(p)*r,Math.sin(p)*r)},
eL(a,b){var s,r,q,p,o,n,m
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
return q+(a[o]-q)*m}}return B.i.gad(a)}}
A.V.prototype={
gI(){return this.a.gI()},
ga5(){return this.a.ga5()},
a8(a){return this.a.a8(a)},
$iB:1}
A.bl.prototype={
gI(){return this.a.gI()},
ga5(){return this.a.gI()},
a8(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].a8(a)},
$iB:1}
A.bD.prototype={
gI(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.b.ab(r.a,new A.i2())
r.f!==$&&A.R()
q=r.f=s}return q}}
A.i2.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.cm.prototype={
gI(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.b.ab(r.a,new A.h8())
r.e!==$&&A.R()
q=r.e=s}return q}}
A.h8.prototype={
$1(a){return t.A.a(a).a!=null},
$S:63}
A.c_.prototype={
gd5(){var s=this.y
if(s==null){s=new Float64Array(16)
s[10]=1
s[15]=1
this.y=s}return s},
gaP(){var s,r,q=this,p=null,o=q.at
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
gcn(){var s,r=this,q=r.ax
if(q===$){s=A.jw(r.c,100,100)&&A.eD(r.d,0)&&A.eD(r.w,0)
r.ax!==$&&A.R()
q=r.ax=s}return q},
gaD(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gcn())if(A.jw(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.jw(q.b,0,0)
else r=A.eD(r,0)&&A.eD(q.r,0)
s=r}q.ay!==$&&A.R()
p=q.ay=s}return p},
gI(){var s,r=this,q=r.ch
if(q===$){s=r.gaP()&&r.e.a!=null
r.ch!==$&&A.R()
q=r.ch=s}return q},
gck(){var s,r=this,q=r.CW
if(q===$){s=A.eD(r.e,100)
r.CW!==$&&A.R()
r.CW=s
q=s}return q},
cY(a){var s,r,q,p,o=this
if(o.as!==a)s=o.gaP()&&!isNaN(o.as)
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
e5(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gaP()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gd5()
a4.as=a6
r=a4.gd5()
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
cs(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaD())return a
if(b.gcn()){b.cY(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.ay(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.e5(a0)
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
return new A.ay(f-d,e-c,f+d,e+c)}}
A.aa.prototype={
gI(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gc9(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.hL.prototype={
aN(a){var s=this.c
return 255-A.a1((255-(B.a.dm(s,a)&255))*(s>>>24))}}
A.eq.prototype={
fM(a){var s,r,q,p=this.a.n(a),o=new A.he(),n=this.b.n(a)
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
if(typeof o!=="number")return A.U(o)
return(n<<24|r<<16|q<<8|o)>>>0}}
A.he.prototype={
$1(a){return B.c.H(B.c.E(a,0,1)*255)},
$S:64}
A.a9.prototype={
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
s=r}}q.db!==$&&A.R()
o=q.db=s}return o},
ghb(){var s,r=this,q=r.dx
if(q===$){s=r.z
s=s==null?null:B.b.aq(s,new A.hO())
r.dx!==$&&A.R()
q=r.dx=s===!0}return q},
ghe(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.b.ab(s,new A.hP())
r.dy!==$&&A.R()
q=r.dy=s===!0}return q},
ge3(){var s,r,q=this,p=q.fx
if(p===$){if(q.a.gaP()){s=q.cy
s=s==null?null:s.ge3()
r=s!==!1}else r=!1
q.fx!==$&&A.R()
p=q.fx=r}return p},
ge1(){var s,r,q=this,p=q.fy
if(p===$){if(q.a.gaD()){s=q.cy
s=s==null?null:s.ge1()
r=s===!0}else r=!0
q.fy!==$&&A.R()
p=q.fy=r}return p},
az(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null
if(!h.ef(a))return g
s=h.f
r=s==null
if(r&&h.gI()&&!isNaN(h.id))return h.go
if(h.id===a)return h.go
h.id=a
q=h.b
p=q==null?g:q.b0(a)
if(!r){r=h.x
if(r!=null){r=r.n(a)
if(0>=r.length)return A.a(r,0)
r=r[0]
q=s.f
q===$&&A.F()
o=s.d
o===$&&A.F()
n=r*q-o}else n=(a-h.r)/h.w
p=A.c2(p,s.az(n))}if(p==null)return h.go=null
s=h.z
if(s!=null)r=s.length===1&&B.b.gaf(s).gc9()||B.b.ab(s,new A.hR())
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
j=new A.ay(r.a-q,r.b-q,r.c+q,r.d+q)}if(j!=null)m=A.c2(m,j)}}if(m!=null){p=p.bx(m)
if(p.gR(0))return h.go=null}}for(i=h;i!=null;i=i.cy)p=i.a.cs(p,a)
return h.go=p},
ef(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
hk(a,b){var s=this.a.e.n(a)
if(0>=s.length)return A.a(s,0)
return B.a.E(B.c.N(b*B.c.H(s[0])/100),0,255)},
aR(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gc9()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.n(a)
if(0>=q.length)return A.a(q,0)
return B.a.E(B.c.H(q[0]*255/100),0,255)}return 255}}
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
A.a8.prototype={
ge2(){var s,r=this,q=r.d
if(q===$){s=B.b.aq(r.a,new A.hH())
r.d!==$&&A.R()
r.d=s
q=s}return q},
gb7(){var s,r=this,q=r.e
if(q===$){s=r.f6()
r.e!==$&&A.R()
r.e=s
q=s}return q},
f6(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.b.gaf(n)
if(s instanceof A.a8){r=s.c
r=r.gaD()&&r.gck()}else r=!1
return r?s.gb7():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.a8){r=o.c
r=r.gaD()&&r.gck()}else r=!1
if(r){if(q==null)q=B.b.er(n,0,p)
B.b.ai(q,o.gb7())}else if(q!=null)B.b.m(q,o)}return q==null?n:q},
gcC(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gb7()
r=null
if(!(s.length!==1)){q=B.b.gaf(s)
A:{if(q instanceof A.bk){s=q
break A}if(q instanceof A.a8){s=q.gcC()
break A}s=r
break A}r=s}p.f!==$&&A.R()
o=p.f=r}return o},
gI(){var s,r=this,q=r.ax
if(q===$){s=r.c.gI()&&B.b.ab(r.a,new A.hJ())&&B.b.ab(r.b,new A.hK())
r.ax!==$&&A.R()
q=r.ax=s}return q},
ga5(){var s,r=this,q=r.ay
if(q===$){s=r.c.gaP()&&B.b.ab(r.a,new A.hI())
r.ay!==$&&A.R()
q=r.ay=s}return q},
a8(a){var s,r,q,p,o=this
if(o.ga5()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.Z)(s),++p)q=A.c2(q,s[p].a8(a))
if(q==null)return o.z=null
return o.z=o.c.cs(q,a)},
b0(a){var s,r,q,p,o,n=this
if(n.gI()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.n(a)
if(0>=r.length)return A.a(r,0)
if(B.c.H(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.Z)(r),++o)p=A.c2(p,r[o].b0(a))
if(p==null)return n.Q=null
return n.Q=s.cs(p,a)},
$iaI:1,
$iB:1}
A.hH.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a8)||a.ge2()},
$S:1}
A.hJ.prototype={
$1(a){return t.u.a(a).gI()},
$S:1}
A.hK.prototype={
$1(a){return t.G.a(a).gI()},
$S:66}
A.hI.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.aS.prototype={
gI(){var s,r=this,q=r.d
if(q===$){s=B.b.ab(r.a,new A.hT())
r.d!==$&&A.R()
r.d=s
q=s}return q},
ga5(){var s,r=this,q=r.e
if(q===$){s=B.b.ab(r.a,new A.hS())
r.e!==$&&A.R()
r.e=s
q=s}return q},
a8(a){var s,r,q,p,o,n,m,l,k=this,j=null
if(k.ga5()&&!isNaN(k.x))return k.w
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
m=p.bx(o)
return k.w=m.gR(0)?j:m}if(q===3)--r
for(l=j,n=0;n<r;++n){if(!(n<s.length))return A.a(s,n)
l=A.c2(l,s[n].a8(a))}return k.w=l},
$iB:1}
A.hT.prototype={
$1(a){return t.u.a(a).gI()},
$S:1}
A.hS.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.et.prototype={
ga5(){return this.gI()},
a8(a){var s=this
if(s.gI()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.cd(a)},
$iB:1}
A.aA.prototype={
gI(){return this.e.a!=null},
cd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.n(a),f=g.length
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
if(h>q)q=h}return new A.ay(s,r,p,q)}}
A.aU.prototype={
gI(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
cd(a){var s,r,q,p=this.r.n(a),o=this.w.n(a),n=o.length
if(0>=n)return A.a(o,0)
s=Math.abs(o[0]*0.5)
if(1>=n)return A.a(o,1)
r=Math.abs(o[1]*0.5)
n=p.length
if(0>=n)return A.a(p,0)
q=p[0]
if(1>=n)return A.a(p,1)
n=p[1]
return new A.ay(q-s,n-r,q+s,n+r)}}
A.b1.prototype={
gI(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
cd(a){var s,r,q,p=this,o=p.w.n(a),n=p.y.n(a)
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
return new A.ay(s-r,n-r,s+r,n+r)},
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
a5=B.c.U(l)*2
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
if(d4){d1=A.il(a,a0,o)
d2=A.il(b5,b6,o)
d8.$8(a2-d*d1.a,a3-d*d1.b,b7+d*d2.a,b8+d*d2.b,b7,b8,a2,a3)}else d7.$2(b7,b8)
i+=h}d9.$0()}}}
A.bk.prototype={
gc4(){var s,r=this,q=r.fr
if(q===$){s=B.b.ab(r.a,new A.i_())
r.fr!==$&&A.R()
r.fr=s
q=s}return q},
fA(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.b.gaf(r.a)
while(s instanceof A.V)s=s.a
if((s instanceof A.aU||s instanceof A.aA||s instanceof A.b1)&&s.gI())return s
return null},
cZ(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.Z)(s),++p)q=A.c2(q,s[p].a8(a))
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
b0(a){var s,r,q,p,o,n,m=this,l=m.c.n(a)
if(0>=l.length)return A.a(l,0)
if(B.c.H(l[0])<=0)return null
if(m.e){l=m.d.n(a)
if(0>=l.length)return A.a(l,0)
s=l[0]
if(s<=0)return null
r=m.w===1?Math.max(1.42,m.x):1.42
q=s*0.5*r+1}else q=0
if(m.gc4()){p=m.fy
if(p===$){o=m.cZ(0)
m.fy!==$&&A.R()
m.fy=o
p=o}n=p}else n=m.cZ(a)
if(n==null)return null
return q===0?n:n.hf(q)},
$iaI:1}
A.i_.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.br.prototype={
aH(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
X(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
ag(){return this.X(!1)}}
A.aj.prototype={
gR(a){return this.f===0&&this.r===0&&!this.x},
l(a){var s=this
s.w=s.r=s.f=0
s.x=!1},
X(a){var s,r,q=this
q.l(0)
s=a?512:8192
if(q.a.length>s){q.a=new Float64Array(512)
q.b=new Float64Array(512)}r=a?32:512
if(q.c.length>r){q.c=new Int32Array(32)
q.d=new Int32Array(32)
q.e=new Uint8Array(32)}},
ag(){return this.X(!1)},
dX(a){while(this.a.length<a)this.d3()},
d3(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.f.C(o,0,r.f,q)
s=new Float64Array(p)
B.f.C(s,0,r.f,r.b)
r.a=o
r.b=s},
cg(a){while(this.c.length<a)this.d2()},
d2(){var s=this,r=s.c,q=r.length*2,p=new Int32Array(q)
B.e.C(p,0,s.r,r)
s.c=p
r=new Int32Array(q)
B.e.C(r,0,s.r,s.d)
s.d=r
r=new Uint8Array(q)
B.d.C(r,0,s.r,s.e)
s.e=r},
a3(a){var s,r,q,p=this
if(p.x)p.a1()
p.x=!0
p.w=p.f
if(p.r===p.c.length)p.d2()
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
if(Math.abs(a-q)+Math.abs(b-s[r])<1e-7)return}if(o===p.a.length)p.d3()
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
c8(a,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
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
b.c8(a,a0,o,n,i,h,e,d,a7,c)
b.c8(e,d,g,f,k,j,a5,a6,a7,c)},
T(a,b,c,d,e,f,g,h,i){return this.c8(a,b,c,d,e,f,g,h,i,0)},
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
s.$flags&2&&A.d(s)
if(!(p<s.length))return A.a(s,p)
s[p]=r
i.r=p+1},
aF(a9,b0,b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=this,a8=a9.r
if(a8===0||a9.f===0)return
a7.dX(a7.f+a9.f)
a7.cg(a7.r+a8)
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
a7.a3(m[e]===1)
a=a7.f
if(k){a0=a+b
B.f.J(s,a,a0,q,d)
B.f.J(r,a,a0,p,d)
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
a7.a1()}},
fL(a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=this,a2=a3.r
if(a2===0||a3.f===0)return
a1.dX(a1.f+a3.f)
a1.cg(a1.r+a2)
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
a1.a3(m[g]===1)
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
a1.a1()}}}
A.aF.prototype={
l(a){var s=this
s.b=0
s.d=s.c=2147483647
s.f=s.e=0},
aT(a){var s=this,r=[s.a,s.b,s.c,s.d,s.e,s.f],q=r[0],p=r[1],o=r[2],n=r[3],m=r[4],l=r[5]
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
X(a){var s
this.l(0)
s=a?1024:16384
if(this.a.gv().length>s*2)this.a.aw(2048,0)},
ag(){return this.X(!1)},
dV(a){var s=this,r=a.b*2
if(s.a.gv().length<r)s.a.aw(r,0)
B.e.C(s.a.gv(),0,r,a.a.gv())
s.b=a.b
s.c=a.c
s.d=a.d
s.e=a.e
s.f=a.f},
aM(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
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
q.aw(q.gv().length*2,f.b*2)}g=f.a.gv()
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
el(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a===0){i.l(0)
return}s=i.a.gv()
for(r=i.b*2,q=s.length,p=s.$flags|0,o=0,n=0;n<r;n+=2){m=n+1
if(!(m<q))return A.a(s,m)
l=s[m]
k=B.a.M(((l&255)+1)*a+128,8)
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
s[j]=(l&4294967040|k-1)>>>0}i.b=B.a.K(o,2)}}
A.f_.prototype={
hq(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
d.dh(A.cG(p),A.cG(o))}d.dh(A.cG(g),A.cG(f))}d.ev(b,c)},
hr(a,b,c,d,e,f,g,h,i,j,k){if(k===0||c>=e||d>=f||a.r===0)return!0
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
dj(a,b){var s=this
if(s.k4){if(s.id===a&&s.k1===b)return
s.bS()}s.id=a
s.k1=b
s.k3=s.k2=0
s.k4=!0},
aC(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.ay
if(b<s){r.dj(s,a)
r.k2+=e
return}if(b>=r.CW)return
r.dj(b,a)
r.k2+=e
r.k3=r.k3+(c+d)*e},
aE(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.ch||a>=g.cx)return
s=B.a.b5(B.a.M(b,8),32)
r=B.a.b5(B.a.M(d,8),32)
q=s*256
p=r*256
if(s===r){g.aC(a,s,b-q,d-q,f)
return}o=d-b
n=b-q
if(d>b){m=g.ay
if(s<m){if(r<m){g.aC(a,m,0,0,f)
return}l=c+B.a.Z((g.cy-b)*f,o)
g.aC(a,m,0,0,l-c)
s=g.ay
k=l
n=0}else k=c
for(;;){if(!(s<r&&s<g.CW))break
j=s+1
i=c+B.a.Z((j*256-b)*f,o)
g.aC(a,s,n,256,i-k)
k=i
s=j
n=0}if(s<g.CW)g.aC(a,s,n,d-p,e-k)}else{m=g.CW
if(s>=m){if(r>=m)return
l=c+B.a.Z((g.dx-b)*f,o)
s=m-1
k=l
n=256}else k=c
for(;;){if(!(s>r&&s>=g.ay))break
i=c+B.a.Z((s*256-b)*f,o)
g.aC(a,s,n,0,i-k);--s
k=i
n=256}m=g.ay
h=e-k
if(s<m)g.aC(a,m,0,0,h)
else g.aC(a,s,n,d-p,h)}},
dh(a,b){this.fv(a,b)
return},
fv(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.fy,b=d.go
d.fy=a
d.go=a0
s=a0-b
if(s===0)return
r=B.a.b5(B.a.M(b,8),32)
q=B.a.b5(B.a.M(a0,8),32)
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
i=c+B.a.Z((j-b)*k,s)
r=p}else{j=b
i=c}for(;;){if(!(r<q&&r<d.cx))break
p=r+1
h=p*256
g=c+B.a.Z((h-b)*k,s)
d.aE(r,i,j-r*256,g,256)
j=h
i=g
r=p}if(r<d.cx){o=r*256
d.aE(r,i,j-o,a,a0-o)}}else{if(m){j=d.dy
i=c+B.a.Z((j-b)*k,s)
r=n-1}else{j=b
i=c}if(r===q){if(r>=p){l=r*256
d.aE(r,i,j-l,a,a0-l)}return}f=r*256
e=c+B.a.Z((f-b)*k,s)
if(r>=p)d.aE(r,i,j-f,e,0);--r
i=e
for(;;){if(!(r>q&&r>=d.ch))break
g=c+B.a.Z((r*256-b)*k,s)
d.aE(r,i,256,g,0);--r
i=g}if(r>=d.ch)d.aE(r,i,256,a,a0-r*256)}},
ev(a,b){this.fG(a,b)
return},
fG(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
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
if(k>m&&l!==0){j=A.j0(l*512,a)
if(j>0)b.aM(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.j0(l*512-s[n],a)
if(j>0)b.aM(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.CW){j=A.j0(l*512,a)
if(j>0)b.aM(o,m,i.CW-m,j)}}i.fx=i.ch-1
i.fr=i.cx}}
A.fC.prototype={
$0(){var s,r,q=new Uint32Array(256)
for(s=1;s<256;++s){r=B.a.Z(16711680+s-1,s)
if(!(s<256))return A.a(q,s)
q[s]=r}return q},
$S:68}
A.fB.prototype={
$3(a,b,c){var s=this.a,r=this.b
return B.a.E(B.c.H((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
$S:69}
A.fE.prototype={
$1(a){var s,r,q=this
a+=q.a
s=q.b
if(s<0){r=q.c
a=r+(a-r)*r/(r-s)}s=q.d
if(s>1){r=q.c
a=r+(a-r)*(1-r)/(s-r)}return a},
$S:70}
A.fL.prototype={}
A.dM.prototype={
G(a,b){var s
if(b==null)return!1
if(this!==b)s=b instanceof A.dM&&A.iw(b)===A.iw(this)&&b.a===this.a
else s=!0
return s},
gV(a){return A.e2(A.iw(this),this.a,B.m,B.m)}}
A.f9.prototype={
ex(a6,a7,a8,a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=a4.r
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
c=new A.eA(new Float64Array(A.X(A.h([h,b,h+a,b+a0,d+a1,a2+a5[a3],d,a2],k))),c)
c.ey(q,g,f,a5,e)
B.b.q(j,i,c)}}},
ce(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
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
l=new A.fa()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.eq()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.fa.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:71}
A.C.prototype={
gct(){var s=this.a
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
if(c2<B.f.ga4(r)){B.i.C(c1,0,o,q)
return c1}if(c2>=B.f.gad(r)){B.i.J(c1,0,o,q,(r.length-1)*p)
return c1}n=c0.r
m=r.length
l=m-1
k=!0
if(n<l){if(!(n<m))return A.a(r,n)
if(!(c2<r[n])){k=n+1
if(!(k<m))return A.a(r,k)
k=c2>=r[k]}}if(k){for(j=0;j+1<l;){i=B.a.M(j+l,1)
if(!(i<m))return A.a(r,i)
if(r[i]<=c2)j=i
else l=i}c0.r=j
n=j}h=n*p
k=s.d
g=k.length
if(!(n>=0&&n<g))return A.a(k,n)
f=k[n]
if((f&1)!==0){B.i.J(c1,0,o,q,h)
return c1}e=m+n
if(!(e<g))return A.a(k,e)
d=k[e]
e=n+1
if(!(e<m))return A.a(r,e)
e=r[e]
if(!(n<m))return A.a(r,n)
c=r[n]
b=e-c
a=b<=0?0:B.c.E((c2-c)/b,0,1)
m=2*m+n
if(!(m<g))return A.a(k,m)
a0=k[m]
a1=B.a.M(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.ce(a0,a)
k=s.w
if(k==null)a4=null
else{if(!(n<k.length))return A.a(k,n)
a4=k[n]}if(a4!=null)a4.ek(B.c.E(a3,0,1),c1)
else if(c0.c&&o>=32&&a1<=1)if(a3<=0)B.i.J(c1,0,o,q,h)
else if(a3>=1)B.i.J(c1,0,o,q,d)
else{n=$.dE()
n.$flags&2&&A.d(n)
n[0]=a3
m=n[0]
n[0]=a3
k=n[0]
n[0]=a3
g=n[0]
n[0]=a3
a5=new A.aP(m,k,g,n[0])
g=s.x
g.toString
a6=B.a.K(h,4)
a7=B.a.K(d,4)
a8=c0.e
if(a8==null)a8=c0.e=J.iU(B.i.ga7(c1),0,o/4|0)
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
b3=new A.aP(b1,b2,b3,n[0]).a6(0,a5)
n[0]=c.a+b3.a
b2=n[0]
n[0]=c.b+b3.b
b1=n[0]
n[0]=c.c+b3.c
e=n[0]
n[0]=c.d+b3.d
a8.q(0,a9,new A.aP(b2,b1,e,n[0]))}for(a9=k*4,n=q.length,k=c1.$flags|0;a9<o;++a9){g=h+a9
if(!(g<n))return A.a(q,g)
g=q[g]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=q[e]
k&2&&A.d(c1)
c1[a9]=g+(e-g)*m}}else if(c0.f)for(n=q.length,k=c1.$flags|0,g=a1>1,a9=0;a9<o;++a9){b4=g&&m?s.ce(a0+4*B.a.Y(a9,a1),a):a3
e=h+a9
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.lw()
e=B.a.E(B.c.H(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
b5=c[e]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=B.a.E(B.c.H(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.fI(b5+(c[e]-b5)*B.c.E(b4,0,1))
k&2&&A.d(c1)
c1[a9]=e}else if(a1<=1||a2)if(a3<=0)B.i.J(c1,0,o,q,h)
else if(a3>=1)B.i.J(c1,0,o,q,d)
else for(n=q.length,m=c1.$flags|0,b6=d,b7=h,a9=0;a9<o;++a9,++b7,++b6){if(!(b7<n))return A.a(q,b7)
b8=q[b7]
if(!(b6>=0&&b6<n))return A.a(q,b6)
b9=q[b6]
k=b8===b9?b8:b8+(b9-b8)*a3
m&2&&A.d(c1)
c1[a9]=k}else for(n=q.length,m=c1.$flags|0,a9=0;a9<o;++a9){b4=s.ce(a0+4*B.a.Y(a9,a1),a)
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
A.eA.prototype={
ey(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this,j=k.a,i=j.length
if(0>=i)return A.a(j,0)
s=j[0]
if(1>=i)return A.a(j,1)
r=j[1]
for(j=k.b,i=j.$flags|0,q=1;q<129;++q,r=o,s=p){e=q/128
p=k.bh(e,0)
o=k.bh(e,1)
n=j[q-1]
m=p-s
l=o-r
l=Math.sqrt(m*m+l*l)
i&2&&A.d(j)
j[q]=n+l}},
bh(a,b){var s,r,q,p,o,n=1-a,m=this.a,l=m.length
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
ek(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
if(a<=0){s=i.a
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
return}if(a>=1){s=i.a
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
return}s=i.b
o=B.f.gad(s)*a
for(n=0,m=128;n+1<m;){l=n+m>>>1
if(!(l<129))return A.a(s,l)
if(s[l]<=o)n=l
else m=l}if(!(m>=0&&m<129))return A.a(s,m)
r=s[m]
if(!(n>=0&&n<129))return A.a(s,n)
s=s[n]
k=r-s
j=(n+(k===0?0:(o-s)/k))/128
s=i.bh(j,0)
b.$flags&2&&A.d(b)
r=b.length
if(0>=r)return A.a(b,0)
b[0]=s
s=i.bh(j,1)
b.$flags&2&&A.d(b)
if(1>=r)return A.a(b,1)
b[1]=s}}
A.fN.prototype={
fV(){var s,r,q,p,o,n,m,l,k,j,i=this.a,h=J.O(i)
switch(A.j(A.W(h.h(i,0)))){case 0:s=h.h(i,1)==null?null:A.L(h.h(i,1))
r=A.j(A.W(h.h(i,2)))
i=new A.dn([0,h.gk(i)<=3||A.aV(h.h(i,3)),s,r])
break
case 1:s=A.L(h.h(i,1))
i=new A.dm([1,t.bm.a(h.h(i,2)),s,A.aV(h.h(i,3))])
break
case 2:s=A.j(A.W(h.h(i,1)))
r=A.L(h.h(i,2))
q=A.L(h.h(i,3))
p=A.W(h.h(i,4))
o=A.j(A.W(h.h(i,5)))
n=A.j(A.W(h.h(i,6)))
m=A.j(A.W(h.h(i,7)))
l=A.j(A.W(h.h(i,8)))
n=new A.dh([2,q,r,p,o,m,A.aV(h.h(i,9)),s,l,n])
i=n
break
case 5:s=A.j(A.W(h.h(i,1)))
r=A.L(h.h(i,2))
q=A.L(h.h(i,3))
p=A.j(A.W(h.h(i,4)))
o=A.j(A.W(h.h(i,5)))
n=A.W(h.h(i,6))
m=A.W(h.h(i,7))
l=A.j(A.W(h.h(i,8)))
k=A.j(A.W(h.h(i,9)))
j=A.j(A.W(h.h(i,10)))
l=new A.di([5,q,r,m,k,A.aV(h.h(i,11)),s,n,o,p,j,l])
i=l
break
case 4:i=B.aD
break
default:i=A.w(B.a3)}return i}}
A.iM.prototype={
$3(a,b,c){return new A.aB(this.a.gcf()-a,0-b.a-c,0-b.b)},
$S:72}
A.iL.prototype={
$1(a){var s,r,q=this.b
if(q.gv().length<a){s=Math.max(65536,q.gv().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.aw(s,0)}},
$S:6}
A.iN.prototype={
$1(a){return A.by(this.a.gv(),0,a)},
$S:74}
A.iO.prototype={
$1(a){var s,r=this,q=r.b
if(q.gv().length<=262144){r.a.a=0
return}if(a<=65536){s=r.a
if(++s.a>=16){s.a=0
s=r.c
s.a=null
s.b=-1
q.aw(65536,0)}}else r.a.a=0},
$S:6}
A.iQ.prototype={
$3(a,b,c){var s
if(!this.a.hc(b,c))return
s=this.b.F(0,a)
if(s==null)return
this.c.cp(s)},
$S:75}
A.iP.prototype={
$2(a,b){var s,r,q,p,o=this,n=o.a,m=n.F(0,a)
if(m!=null)o.b.cp(m)
o.c.F(0,a)
for(s=o.b,r=A.n(n).i("N<1>");n.a>=24;){q=new A.N(n,r).gB(0)
if(!q.t())A.w(A.ab())
p=n.F(0,q.gA())
p.toString
s.cp(p)}n.q(0,a,b)},
$S:76}
A.iR.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.dl(3,b,a):new A.bZ(1,s,a)
this.b.aA(r)},
$S:77}
A.iK.prototype={
$1(m3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7,k8,k9,l0,l1,l2,l3,l4,l5,l6,l7,l8,l9,m0,m1=this,m2=null
A:{if(m3==null){e6=m1.b
e6.cb()
e6.dS()
m1.c.l(0)
m1.d.a_()
m1.e.a_()
m1.f.a.ca()
A.v(v.G.self).close()
return}g6=t.gx.b(m3)
g7=m2
g8=m2
g9=m2
h0=!1
if(g6){h1=m3.a
h2=h1[0]
if(0===h2){h3=h1[2]
if(t.dk.b(h3)){A.ic(h3)
h4=h1[3]
if(A.o(h4)){A.j(h4)
h5=h1[1]
h0=A.b3(h5)
if(h0){A.aV(h5)
g9=h5}g8=h4}g7=h3}}}else h2=m2
if(h0){e6=m1.b
e6.b=A.j(g8)
e6.bT(0)
e6.sfP(g9)
e6.en(g7)
break A}h6=t.hh.b(m3)
h7=m2
h8=m2
h9=!1
if(h6){if(g6)h0=h2
else{h2=A.eO()
h0=h2
g6=!0}h7=1===h0
h0=h7
if(h0){h8=A.eO()
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
h9=i0}s=A.L(h1)
h1=m3.a
i1=h1[1]
i2=t.p
if(i2.b(i1)){r=i2.a(i1)
i3=h1[3]
h0=A.b3(i3)
if(h0)q=A.aV(i3)}}}}if(h0){try{p=t.P.a(B.y.dW(B.R.fS(A.op(r)),m2))
e6=s
e7=A.jq(new A.dM(q))
e7.fO(p)
m1.r.$2(e6,new A.ce(e7))}catch(i4){o=A.af(i4)
e6=m1.w
if(e6.a>=24)e6.F(0,new A.N(e6,A.n(e6).i("N<1>")).ga4(0))
e6.q(0,s,J.bH(o))}break A}n=null
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
if(typeof i6=="string"){A.L(i6)
m=i6
if(h9)i2=h8
else{h8=h1[1]
i2=h8
h9=i0}if(typeof i2=="string"){if(h9)i2=h8
else{h8=h1[1]
i2=h8
h9=i0}l=A.L(i2)
j7=h1[3]
if(typeof j7=="number"){k=A.W(j7)
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
h0=A.b3(j4)
if(h0){A.aV(j4)
f=j4}}}}}}}}}}}else j6=!1
if(h0){try{e6=i
e7=h
if(typeof e6!=="number")return e6.a6()
if(typeof e7!=="number")return A.U(e7)
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
c=e6.ee(h1,d,f6,j,g3,h0,g4,f7)
if(c){m1.Q.$3(l,m,g)
b=new Uint8Array(A.X(d))
e7=e6.y
f6=e6.at
f7=d.byteLength
g3=e6.ay
m1.f.aA(new A.cp([0,-1,m,g3,e6.ch,0,0,b,0,n,f7,!1,e7+f6]))
m1.as.$1(e)
if(!f){e7=m
f6=i
f7=h
g3=g
e6.e7(e7,j,f7,g3,f6)}return}f6=m1.c
a=f6.F(0,l)
if(a==null){m1.at.$2(n,l)
return}f6.q(0,l,a)
h1.a=null
h1.b=-1
a0=m1.ax.gcf()
a1=B.F
a2=0
f6=k
f7=i
g3=h
A.l9(a.geP(),f6,m1.e,f7,g3,m1.d,m2)
a3=m1.ay.$3(a0,a1,a2)
a4=e7.$1(e)
e7=m
g3=i
f7=h
f6=g
g4=f
a5=e6.cF(e7,j,f7,g4,m1.ch,a4,f6,g3)
a6=new Uint8Array(A.X(a4))
g3=a5.a[2]
f6=e6.y
e6=e6.at
g4=a3.a
f7=a3.b
e7=a3.c
h0=a4.byteLength
h1=a5.a[3]
m1.f.aA(new A.cp([0,g3,m,h1,a5.a[4],e7,f7,a6,g4,n,h0,!0,f6+e6]))
m1.as.$1(e)
m1.Q.$3(l,m,g)}catch(i4){a7=A.af(i4)
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
i7=j9}a9=A.L(h1)
if(h9)h1=h8
else{h8=m3.a[1]
h1=h8
h9=!0}if(typeof h1=="string"){b0=A.L(h9?h8:m3.a[1])
h1=m3.a
k0=h1[9]
if(A.o(k0)){b1=A.j(k0)
k1=h1[8]
if(A.o(k1)){b2=A.j(k1)
k2=h1[7]
if(typeof k2=="number"){b3=A.W(k2)
k3=h1[3]
if(typeof k3=="number"){b4=A.W(k3)
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
j5=!0}h0=A.b3(h0)
if(h0)b8=A.aV(j5?j4:h1[5])}}}}}}}}}}}}if(h0){try{h0=m1.z
h0.a=null
h0.b=-1
h0=b2
if(typeof h0!=="number")return h0.ej()
b9=h0>1?1:0
h1=b2
i2=b6
if(typeof h1!=="number")return h1.a6()
if(typeof i2!=="number")return A.U(i2)
k4=b2
if(typeof k4!=="number")return k4.eq()
k5=b9
if(typeof k5!=="number")return A.U(k5)
c0=h1*i2+(k4-1)*k5
k5=b5
k4=c0
if(typeof k5!=="number")return k5.a6()
if(typeof k4!=="number")return A.U(k4)
c1=k5*k4
m1.x.$1(c1)
h0=b9
if(typeof h0!=="number")return h0.ej()
if(h0>0){c2=1
h0=m1.e
h1=t.a
for(;;){i2=c2
k4=b2
if(typeof i2!=="number")return i2.cz()
if(typeof k4!=="number")return A.U(k4)
if(!(i2<k4))break
i2=c2
k4=b6
k5=b9
if(typeof k4!=="number")return k4.ae()
if(typeof k5!=="number")return A.U(k5)
if(typeof i2!=="number")return i2.a6()
k6=b5
if(typeof k6!=="number")return A.U(k6)
c3=(i2*(k4+k5)-1)*k6
i2=h0.c
if(i2!=null){k4=h1.a(A.v($.l.memory).buffer)
k7=h0.b
i2=new Uint32Array(k4,i2,k7)}else{i2=h0.d
i2.toString}k4=c3
k5=b5
if(typeof k4!=="number")return k4.ae()
if(typeof k5!=="number")return A.U(k5)
B.j.ac(i2,c3,k4+k5,0)
i2=c2
if(typeof i2!=="number")return i2.ae()
c2=i2+1}}h0=b5
h1=b6
if(typeof h0!=="number")return h0.a6()
if(typeof h1!=="number")return A.U(h1)
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
if(typeof l0!=="number")return l0.cz()
if(typeof l1!=="number")return A.U(l1)
if(!(l0<l1))break
B:{l0=b1
l1=d6
if(typeof l0!=="number")return l0.ae()
if(typeof l1!=="number")return A.U(l1)
d7=A.oJ(l0+l1,b7,b4)
l1=b3
l0=d7
if(typeof l1!=="number")return l1.ae()
if(typeof l0!=="number")return A.U(l0)
d8=l1+l0
l0=d6
l1=b6
l2=b9
if(typeof l1!=="number")return l1.ae()
if(typeof l2!=="number")return A.U(l2)
if(typeof l0!=="number")return l0.a6()
d9=l0*(l1+l2)
l2=d9
l1=b5
if(typeof l2!=="number")return l2.a6()
if(typeof l1!=="number")return A.U(l1)
e0=l2*l1
l1=A.j(e0)
l2=A.j(c4)
l0=l1+l2
A.b_(l1,l0,k8.b)
l3=k8.c
l4=l3==null
l5=l4?m2:l3+l1*4
if(l4){l4=k8.d
l4.toString
l0=A.jp(l4,l1,l0)}else l0=m2
e1=new A.aZ(!1,l2,l5,l0)
l0=a9
l5=b5
l2=b6
l1=b7
l4=b8
l6=e1
l7=l6.c
if(l7!=null){l8=k9.a(A.v($.l.memory).buffer)
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
else{e5=A.k5(d2,d3,e3,e4)
e6=null
e7=null
e6=e5.a
e7=e5.b
d2=e6
d3=e7}}break B}if(d5==null)d5=k4.F(0,b0)
if(d5==null){m1.at.$2(a8,b0)
return}k4.q(0,b0,d5)
e8=k5.gcf()
e9=B.F
f0=0
l0=d5
l1=b5
l2=b6
l0=l0.a
A.l9(l0,d8,e1,l1,l2,k6,m2)
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
if(l7!=null){l8=k9.a(A.v($.l.memory).buffer)
k7=l6.b
l6=new Uint32Array(l8,l7,k7)}else{l6=l6.d
l6.toString}f2=h1.cF(l1,d7,l2,l5,h0,A.by(l6,0,m2),l4,l0)
if(f2.a[2]>0)c7=f2.a[2]
if(d1){f3=f2.a[3]
f4=f2.a[4]
if(J.m(b2,1)){d2=f3
d3=f4}else if(J.m(f3,0)&&J.m(f4,0))d1=!1
else{f5=A.k5(d2,d3,f3,f4)
f6=null
f7=null
f6=f5.a
f7=f5.b
d2=f6
d3=f7}}}l0=d6
if(typeof l0!=="number")return l0.ae()
d6=l0+1}f8=m1.y.$1(c1)
f9=new Uint8Array(A.X(f8))
g0=null
g1=null
if(!d1){g0=0
g1=0}else if(J.m(b2,1)){g0=d2
g1=d3}else{e6=d2
e7=d3
f6=b2
l9=e6^f6
m0=e7+A.an(f6,2654435761)>>>0
l9=A.an((l9^l9>>>15)>>>0,2246822519)
l9=(l9^l9>>>13)>>>0
m0=A.an((m0^m0>>>16)>>>0,3266489917)
m0=(m0^m0>>>15)>>>0
g2=new A.A(l9,l9===0&&m0===0?1:m0)
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
if(typeof k4!=="number")return k4.a6()
m1.f.aA(new A.dj([4,e7,f6,a9,g0,g1,i2,h0,f9,g4,a8,b2,c0,b1,b5,k4*4,e6,f7+g3]))
m1.as.$1(c1)
m1.Q.$3(b0,a9,b7)
if(!b8&&d4!=null){e6=a9
e7=b5
b6=b6
f6=b7
h1.e7(e6,d4,b6,f6,e7)}}catch(i4){g5=A.af(i4)
m1.f.aA(new A.bZ(1,J.bH(g5),a8))}break A}m=m2
e6=!1
if(t.bn.b(m3)){if(g6)e7=h2
else{h2=A.eO()
e7=h2
g6=!0}if(3===e7){if(i7)e6=i6
else{i6=A.eO()
e6=i6
i7=!0}e6=typeof e6=="string"
if(e6)m=A.L(i7?i6:A.eO())}}if(e6){e6=m1.b
e6.h0(m)
e6.h5(m)
m1.f.aA(new A.cq(2,m,e6.y+e6.at))
break A}if(t.dn.b(m3))e6=4===(g6?h2:m3.a)
else e6=!1
if(e6){e6=m1.z
e6.a=null
e6.b=-1
e6=m1.b
e6.dS()
e6.cb()
e6.cB()
m1.c.l(0)
m1.w.l(0)
e7=m1.d
e7.ea()
e7.ed(!0)
e7=m1.ch
e7.c=0
if(e7.b.length>131072)e7.b=new Uint8Array(131072)
m1.a.a=0
e7=m1.e
if(e7.gv().length>65536)e7.aw(65536,0)
m1.f.aA(new A.cq(2,"",e6.y+e6.at))}}},
$S:78}
A.iC.prototype={
$1(a){return this.eh(a)},
eh(a5){var s=0,r=A.l6(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.ld(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.fN(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.j(A.W(J.ag(n.a,0)))!==-1||A.j(A.W(J.ag(n.a,1)))!==4)throw A.f(B.X)
q=10
s=13
return A.id(A.jO(A.v(A.v(v.G.self).fetch(A.L(J.ag(n.a,2)))),t.m),$async$$1)
case 13:m=a7
s=A.aV(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.id(A.jO(A.v(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.id(a3.iA(a4.jg(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.oM(o.b)
d.a=!0
l=null
k=null
d=$.l
j=A.jK([-2,4,d!=null])
l=j.a
k=j.b
A.v(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.n(d)
a=b.c.a(n.fV())
a0=d.b
if(a0>=4)A.w(d.cN())
if((a0&1)!==0)d.c0(a)
else if((a0&3)===0)d.cX().m(0,new A.bT(a,b.i("bT<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.af(a2)
h=null
g=null
f=A.jK([-3,A.x(i)])
h=f.a
g=f.b
A.v(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.kT(null,r)
case 1:return A.kS(p.at(-1),r)}})
return A.kU($async$$1,r)},
$S:79}
A.iD.prototype={
$1(a){return A.ma(new A.iC(this.a,this.b).$1(A.v(a)),t.b)},
$S:80}
A.ha.prototype={
aA(a){var s=A.oq(a)
A.v(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bs.prototype
s.eu=s.u
s=A.z.prototype
s.cG=s.J})();(function installTearOffs(){var s=hunkHelpers._static_0,r=hunkHelpers._static_1,q=hunkHelpers._static_2,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(A,"nX","mu",3)
r(A,"of","mQ",5)
r(A,"og","mR",5)
r(A,"oh","mS",5)
s(A,"lf","oa",0)
q(A,"oj","o_",9)
s(A,"oi","nZ",0)
p(A.K.prototype,"geQ","eR",9)
r(A,"jP","dy",1)
var m
o(m=A.er.prototype,"ghA","D",42)
o(m,"gb8","cD",43)
o(m,"gh1","h2",44)
o(m,"ghm","hn",45)
o(m,"ghj","co",46)
p(m=A.aj.prototype,"gfK","p",67)
n(m,"gh3","a1",0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.e,null)
q(A.e,[A.j9,J.E,A.cZ,J.bI,A.M,A.bp,A.fv,A.k,A.bO,A.d6,A.d_,A.cE,A.H,A.bz,A.Q,A.d9,A.ba,A.fJ,A.fl,A.cF,A.dq,A.I,A.fc,A.cM,A.aN,A.cL,A.dU,A.db,A.ci,A.fW,A.ex,A.i5,A.aP,A.aR,A.es,A.i3,A.i0,A.ej,A.as,A.en,A.bg,A.K,A.ek,A.d1,A.dr,A.el,A.d8,A.bB,A.eo,A.aT,A.eB,A.fP,A.ew,A.da,A.z,A.c9,A.dK,A.i6,A.hb,A.e3,A.d0,A.hc,A.a4,A.bt,A.a0,A.eC,A.fx,A.cf,A.fk,A.f3,A.fO,A.f5,A.dP,A.bw,A.h9,A.dR,A.ez,A.eS,A.fd,A.fG,A.ee,A.ay,A.b8,A.aZ,A.fg,A.hZ,A.ce,A.fp,A.ad,A.bS,A.c,A.bA,A.hd,A.hW,A.er,A.bh,A.V,A.bl,A.bD,A.cm,A.c_,A.aa,A.hL,A.eq,A.a9,A.a8,A.aS,A.et,A.bk,A.br,A.aj,A.aF,A.f_,A.dM,A.f9,A.C,A.eA,A.fN,A.ha])
q(J.E,[J.cH,J.cJ,J.S,J.bK,J.bL,J.cK,J.cb])
q(J.S,[J.bs,J.y,A.bu,A.cR])
q(J.bs,[J.e4,J.d4,J.av])
r(J.dS,A.cZ)
r(J.f6,J.y)
q(J.cK,[J.cI,J.dT])
q(A.M,[A.b7,A.be,A.dV,A.eg,A.e8,A.cA,A.ep,A.aY,A.d5,A.ef,A.bc,A.dJ])
q(A.bp,[A.dH,A.dI,A.ed,A.ix,A.iz,A.fS,A.fR,A.ie,A.hD,A.fy,A.f0,A.iH,A.iI,A.f4,A.eV,A.eT,A.eU,A.ik,A.h7,A.fY,A.fX,A.h4,A.h2,A.h0,A.h1,A.h_,A.h6,A.i2,A.h8,A.he,A.hQ,A.hO,A.hP,A.hR,A.hH,A.hJ,A.hK,A.hI,A.hT,A.hS,A.i_,A.fB,A.fE,A.fa,A.iM,A.iL,A.iN,A.iO,A.iQ,A.iK,A.iC,A.iD])
q(A.dH,[A.iF,A.fn,A.fT,A.fU,A.i1,A.hv,A.hz,A.hy,A.hx,A.hw,A.hC,A.hB,A.hA,A.fz,A.hY,A.hX,A.fV,A.hU,A.fQ,A.ip,A.i8,A.i7,A.hG,A.ib,A.fH,A.fi,A.hs,A.ht,A.hm,A.hn,A.ho,A.hp,A.hq,A.hr,A.hg,A.hi,A.hh,A.hu,A.hf,A.hk,A.hj,A.hl,A.fC])
q(A.k,[A.p,A.bR,A.bb,A.ei])
q(A.p,[A.a7,A.cD,A.N,A.bN,A.bM])
q(A.a7,[A.d2,A.a_,A.ev])
r(A.ca,A.bb)
q(A.Q,[A.cn,A.ak,A.bY,A.bj])
r(A.dg,A.cn)
q(A.ak,[A.co,A.dh,A.di,A.cp,A.dj,A.b2,A.dm,A.dn,A.cr,A.bC])
q(A.bY,[A.A,A.dk])
q(A.bj,[A.aB,A.dl,A.cq,A.bZ])
q(A.ba,[A.cC,A.dp])
r(A.P,A.cC)
r(A.cU,A.be)
q(A.ed,[A.e9,A.c8])
r(A.eF,A.cA)
q(A.I,[A.b6,A.eu])
q(A.dI,[A.f7,A.iy,A.ig,A.ir,A.hE,A.fe,A.ff,A.hN,A.f2,A.f1,A.eW,A.fq,A.fr,A.fs,A.ft,A.io,A.fZ,A.h3,A.h5,A.iP,A.iR])
r(A.ah,A.b6)
r(A.cc,A.bu)
r(A.ey,A.ex)
r(A.cO,A.ey)
r(A.eG,A.cO)
r(A.eE,A.eG)
q(A.cR,[A.dY,A.ac])
q(A.ac,[A.dc,A.de])
r(A.dd,A.dc)
r(A.bv,A.dd)
r(A.df,A.de)
r(A.ax,A.df)
q(A.bv,[A.cd,A.cP])
q(A.ax,[A.dZ,A.cQ,A.e0,A.e1,A.cS,A.cT,A.bP])
r(A.cs,A.ep)
r(A.d7,A.en)
r(A.cj,A.dr)
r(A.dt,A.d1)
r(A.ck,A.dt)
r(A.cl,A.d8)
r(A.bT,A.bB)
r(A.bi,A.dp)
r(A.bW,A.bi)
q(A.c9,[A.dL,A.dW])
q(A.dK,[A.f8,A.fM])
r(A.eh,A.dL)
q(A.aY,[A.b9,A.dO])
q(A.fO,[A.hF,A.ia])
q(A.bw,[A.dX,A.fw,A.bQ])
q(A.a4,[A.c7,A.fL])
q(A.c7,[A.cz,A.dF])
r(A.cB,A.hb)
r(A.dQ,A.dR)
q(A.et,[A.aA,A.aU,A.b1])
s(A.ex,A.z)
s(A.ey,A.H)
s(A.dc,A.z)
s(A.dd,A.H)
s(A.de,A.z)
s(A.df,A.H)
s(A.eG,A.bz)
s(A.cj,A.el)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",i:"double",c5:"num",q:"String",u:"bool",a0:"Null",r:"List",e:"Object",ai:"Map",J:"JSObject"},mangledNames:{},types:["~()","u(B)","u(aa)","b()","~(@)","~(~())","~(b)","a0(@)","a0()","~(e,az)","@()","u()","u(+(q,b))","u(@)","bq(@,c,bq?,b,b)","u(e,bS)","@(@,q)","a0(av,av)","e?(e?)","e(e,az)","u(bw)","@(q)","u(b,bx)","+(b,b)(b)","@(@)","r<b>()","~(i,i,i,i,i,i,i,i)","au<~>()","u(e,ad<aj>)","u(e,ad<i>)","u(bh,ad<aZ>)","~(aa,aF)","u(a9)","C(b{dimensions:b})","~(b,b)","a0(@,az)","i(q,i)","~(b,@)","~(@,b)","~(r<B>)","B(V)","a0(~())","C(C)","B(B)","aI(aI)","aa(aa)","a9(a9)","C()","c_()","V()","bl()","aS()","aA()","a0(e,az)","b1()","bk()","a8()","bh()","bD()","cm()","aa()","a9()","bA()","u(C)","b(i)","~(e?,e?)","u(aI)","~(i,i)","d3()","b(b,b,i)","i(i)","i(i,i,i)","+(b,b,b)(b,+calls,copiedBytes(b,b),b)","~(q,@)","bx(b)","~(q,q,b)","~(q,ce)","~(b,q)","~(e?)","au<a0>(J)","J(J)","aU()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.dg&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.A&&a.b(c.a)&&b.b(c.b),"2;calls,copiedBytes":(a,b)=>c=>c instanceof A.dk&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.aB&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;contentKey,requestId":(a,b,c)=>d=>d instanceof A.dl&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;entryKey,workerRamBytes":(a,b,c)=>d=>d instanceof A.cq&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;message,requestId":(a,b,c)=>d=>d instanceof A.bZ&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.b2&&A.bo(a,b.a),"4;bytes,contentKey,useSimd":a=>b=>b instanceof A.dm&&A.bo(a,b.a),"4;deduplicateUploads,diskDirectory,maximumRamBytes":a=>b=>b instanceof A.dn&&A.bo(a,b.a),"5;compressedBytes,crc31,entryDiskBytes,fpHi,fpLo":a=>b=>b instanceof A.cr&&A.bo(a,b.a),"6;":a=>b=>b instanceof A.bC&&A.bo(a,b.a),"10;":a=>b=>b instanceof A.co&&A.bo(a,b.a),"10;contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width":a=>b=>b instanceof A.dh&&A.bo(a,b.a),"12;contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width":a=>b=>b instanceof A.di&&A.bo(a,b.a),"13;entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes":a=>b=>b instanceof A.cp&&A.bo(a,b.a),"18;compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes":a=>b=>b instanceof A.dj&&A.bo(a,b.a)}}
A.ne(v.typeUniverse,JSON.parse('{"av":"bs","e4":"bs","d4":"bs","p0":"bu","cH":{"E":[],"u":[],"D":[]},"cJ":{"E":[],"a0":[],"D":[]},"S":{"E":[],"J":[]},"bs":{"S":[],"E":[],"J":[]},"bK":{"E":[]},"bL":{"E":[]},"y":{"r":["1"],"S":[],"p":["1"],"E":[],"J":[],"k":["1"]},"dS":{"cZ":[]},"f6":{"y":["1"],"r":["1"],"S":[],"p":["1"],"E":[],"J":[],"k":["1"]},"bI":{"a5":["1"]},"cK":{"i":[],"c5":[],"E":[]},"cI":{"i":[],"b":[],"c5":[],"E":[],"D":[]},"dT":{"i":[],"c5":[],"E":[],"D":[]},"cb":{"q":[],"E":[],"fm":[],"D":[]},"b7":{"M":[]},"p":{"k":["1"]},"a7":{"p":["1"],"k":["1"]},"d2":{"a7":["1"],"p":["1"],"k":["1"],"k.E":"1","a7.E":"1"},"bO":{"a5":["1"]},"a_":{"a7":["2"],"p":["2"],"k":["2"],"k.E":"2","a7.E":"2"},"bR":{"k":["1"],"k.E":"1"},"d6":{"a5":["1"]},"bb":{"k":["1"],"k.E":"1"},"ca":{"bb":["1"],"p":["1"],"k":["1"],"k.E":"1"},"d_":{"a5":["1"]},"cD":{"p":["1"],"k":["1"],"k.E":"1"},"cE":{"a5":["1"]},"dg":{"cn":[],"Q":[]},"co":{"ak":[],"Q":[]},"dh":{"ak":[],"Q":[]},"di":{"ak":[],"Q":[]},"cp":{"ak":[],"Q":[]},"dj":{"ak":[],"Q":[]},"A":{"bY":[],"Q":[]},"dk":{"bY":[],"Q":[]},"aB":{"bj":[],"Q":[]},"dl":{"bj":[],"Q":[]},"cq":{"bj":[],"Q":[]},"bZ":{"bj":[],"Q":[]},"b2":{"ak":[],"Q":[]},"dm":{"ak":[],"Q":[]},"dn":{"ak":[],"Q":[]},"cr":{"ak":[],"Q":[]},"bC":{"ak":[],"Q":[]},"d9":{"a5":["1"]},"cC":{"ba":["1"],"b0":["1"],"p":["1"],"k":["1"]},"P":{"cC":["1"],"ba":["1"],"b0":["1"],"p":["1"],"k":["1"]},"cU":{"be":[],"M":[]},"dV":{"M":[]},"eg":{"M":[]},"dq":{"az":[]},"bp":{"bJ":[]},"dH":{"bJ":[]},"dI":{"bJ":[]},"ed":{"bJ":[]},"e9":{"bJ":[]},"c8":{"bJ":[]},"e8":{"M":[]},"eF":{"M":[]},"b6":{"I":["1","2"],"jb":["1","2"],"ai":["1","2"],"I.K":"1","I.V":"2"},"N":{"p":["1"],"k":["1"],"k.E":"1"},"cM":{"a5":["1"]},"bN":{"p":["1"],"k":["1"],"k.E":"1"},"aN":{"a5":["1"]},"bM":{"p":["bt<1,2>"],"k":["bt<1,2>"],"k.E":"bt<1,2>"},"cL":{"a5":["bt<1,2>"]},"ah":{"b6":["1","2"],"I":["1","2"],"jb":["1","2"],"ai":["1","2"],"I.K":"1","I.V":"2"},"bY":{"Q":[]},"cn":{"Q":[]},"bj":{"Q":[]},"ak":{"Q":[]},"dU":{"mB":[],"fm":[]},"db":{"e6":[]},"ei":{"k":["e6"],"k.E":"e6"},"ci":{"a5":["e6"]},"cc":{"bu":[],"S":[],"E":[],"J":[],"D":[]},"bu":{"S":[],"E":[],"J":[],"D":[]},"cO":{"eY":[],"z":["a3"],"r":["a3"],"p":["a3"],"k":["a3"],"H":["a3"],"D":[],"z.E":"a3","H.E":"a3"},"eE":{"eY":[],"z":["a3"],"bz":["a3"],"r":["a3"],"p":["a3"],"k":["a3"],"H":["a3"],"D":[],"z.E":"a3","bz.E":"a3","H.E":"a3"},"cR":{"S":[],"E":[],"J":[]},"dY":{"S":[],"E":[],"J":[],"D":[]},"ac":{"aw":["1"],"S":[],"E":[],"J":[]},"bv":{"z":["i"],"ac":["i"],"r":["i"],"aw":["i"],"S":[],"p":["i"],"E":[],"J":[],"k":["i"],"H":["i"]},"ax":{"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"]},"cd":{"bv":[],"bq":[],"z":["i"],"ac":["i"],"r":["i"],"aw":["i"],"S":[],"p":["i"],"E":[],"J":[],"k":["i"],"H":["i"],"D":[],"z.E":"i","H.E":"i"},"cP":{"bv":[],"eZ":[],"z":["i"],"ac":["i"],"r":["i"],"aw":["i"],"S":[],"p":["i"],"E":[],"J":[],"k":["i"],"H":["i"],"D":[],"z.E":"i","H.E":"i"},"dZ":{"ax":[],"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"],"D":[],"z.E":"b","H.E":"b"},"cQ":{"ax":[],"j4":[],"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"],"D":[],"z.E":"b","H.E":"b"},"e0":{"ax":[],"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"],"D":[],"z.E":"b","H.E":"b"},"e1":{"ax":[],"jo":[],"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"],"D":[],"z.E":"b","H.E":"b"},"cS":{"ax":[],"d3":[],"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"],"D":[],"z.E":"b","H.E":"b"},"cT":{"ax":[],"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"],"D":[],"z.E":"b","H.E":"b"},"bP":{"ax":[],"bx":[],"z":["b"],"ac":["b"],"r":["b"],"aw":["b"],"S":[],"p":["b"],"E":[],"J":[],"k":["b"],"H":["b"],"D":[],"z.E":"b","H.E":"b"},"aP":{"a3":[]},"ep":{"M":[]},"cs":{"be":[],"M":[]},"as":{"M":[]},"d7":{"en":["1"]},"K":{"au":["1"]},"dr":{"ko":["1"],"km":["1"],"kH":["1"],"bU":["1"]},"cj":{"el":["1"],"dr":["1"],"ko":["1"],"km":["1"],"kH":["1"],"bU":["1"]},"ck":{"dt":["1"],"d1":["1"]},"cl":{"d8":["1"],"ea":["1"],"bU":["1"]},"d8":{"ea":["1"],"bU":["1"]},"dt":{"d1":["1"]},"bT":{"bB":["1"]},"eo":{"bB":["@"]},"bi":{"ba":["1"],"b0":["1"],"p":["1"],"k":["1"]},"bW":{"bi":["1"],"ba":["1"],"b0":["1"],"p":["1"],"k":["1"]},"da":{"a5":["1"]},"I":{"ai":["1","2"]},"ba":{"b0":["1"],"p":["1"],"k":["1"]},"dp":{"ba":["1"],"b0":["1"],"p":["1"],"k":["1"]},"eu":{"I":["q","@"],"ai":["q","@"],"I.K":"q","I.V":"@"},"ev":{"a7":["q"],"p":["q"],"k":["q"],"k.E":"q","a7.E":"q"},"dL":{"c9":["q","r<b>"]},"dW":{"c9":["e?","q"]},"eh":{"c9":["q","r<b>"]},"i":{"c5":[]},"b":{"c5":[]},"r":{"p":["1"],"k":["1"]},"b0":{"p":["1"],"k":["1"]},"q":{"fm":[]},"cA":{"M":[]},"be":{"M":[]},"aY":{"M":[]},"b9":{"M":[]},"dO":{"b9":[],"M":[]},"d5":{"M":[]},"ef":{"M":[]},"bc":{"M":[]},"dJ":{"M":[]},"e3":{"M":[]},"d0":{"M":[]},"eC":{"az":[]},"dX":{"bw":[]},"fw":{"bw":[]},"dQ":{"dR":[]},"bQ":{"bw":[]},"V":{"B":[]},"bl":{"B":[]},"a8":{"B":[],"aI":[]},"aS":{"B":[]},"aA":{"B":[]},"aU":{"B":[]},"b1":{"B":[]},"bk":{"aI":[]},"et":{"B":[]},"mc":{"r":["b"],"p":["b"],"k":["b"]},"bx":{"r":["b"],"p":["b"],"k":["b"]},"mO":{"r":["b"],"p":["b"],"k":["b"]},"mb":{"r":["b"],"p":["b"],"k":["b"]},"jo":{"r":["b"],"p":["b"],"k":["b"]},"j4":{"r":["b"],"p":["b"],"k":["b"]},"d3":{"r":["b"],"p":["b"],"k":["b"]},"bq":{"r":["i"],"p":["i"],"k":["i"]},"eZ":{"r":["i"],"p":["i"],"k":["i"]},"eY":{"r":["a3"],"p":["a3"],"k":["a3"]}}'))
A.nd(v.typeUniverse,JSON.parse('{"ac":1,"bB":1,"dp":1,"dK":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.dD
return{a7:s("@<~>"),v:s("as"),fA:s("cB"),M:s("P<q>"),gw:s("p<@>"),R:s("M"),Y:s("a3"),Z:s("bJ"),gd:s("E"),bM:s("k<i>"),hf:s("k<@>"),hb:s("k<b>"),dh:s("y<eZ>"),f:s("y<e>"),fM:s("y<aj>"),hg:s("y<+(u,u)>"),bU:s("y<aF>"),s:s("y<q>"),gC:s("y<C>"),a1:s("y<d3>"),gN:s("y<bx>"),V:s("y<aI>"),ch:s("y<a9>"),bE:s("y<aa>"),r:s("y<B>"),fq:s("y<V>"),n:s("y<i>"),o:s("y<@>"),t:s("y<b>"),a2:s("y<aZ?>"),a6:s("y<e?>"),cU:s("y<a9?>"),by:s("y<bD?>"),T:s("cJ"),m:s("J"),g:s("av"),aU:s("aw<@>"),aX:s("S"),c2:s("ah<e,e>"),el:s("ah<e,bS>"),gt:s("ah<ai<q,@>,aA>"),gS:s("ah<e,ad<aj>>"),fk:s("ah<e,ad<i>>"),gj:s("ah<bh,ad<aZ>>"),ew:s("r<e>"),W:s("r<p1>"),cH:s("r<B>"),dg:s("r<i>"),j:s("r<@>"),L:s("r<b>"),P:s("ai<q,@>"),gq:s("ai<a9,b>"),B:s("ai<b,a9>"),aj:s("ai<a9,+(b,c)>"),fP:s("a_<V,B>"),a:s("cc"),d4:s("bv"),eB:s("ax"),bm:s("bP"),b:s("a0"),K:s("e"),bl:s("bQ"),b8:s("b9"),fW:s("ce"),gT:s("p2"),bQ:s("+()"),eS:s("+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),a8:s("+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),e6:s("+entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),f2:s("+compressedCount,entryDiskBytes,entryKey,fpHi,fpLo,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?,e?)"),dn:s("+(e?)"),x:s("+(q,b)"),eG:s("+(b,c)"),bn:s("+entryKey(e?,e?)"),bP:s("+(q,i,i)"),h6:s("+(b,b,b)"),ca:s("+contentKey,requestId(e?,e?,e?)"),hh:s("+contentKey,scene(e?,e?,e?)"),dH:s("+entryKey,workerRamBytes(e?,e?,e?)"),bA:s("+message,requestId(e?,e?,e?)"),cm:s("+bytes,contentKey,useSimd(e?,e?,e?,e?)"),gx:s("+deduplicateUploads,diskDirectory,maximumRamBytes(e?,e?,e?,e?)"),d:s("e6"),bC:s("b0<e>"),h:s("b0<q>"),cJ:s("b0<b>"),l:s("az"),N:s("q"),gz:s("ee"),A:s("C"),dm:s("D"),k:s("be"),p:s("bx"),ak:s("d4"),eU:s("bR<B>"),co:s("cj<e?>"),E:s("bA"),az:s("bS"),bo:s("cm"),G:s("aI"),_:s("K<@>"),fJ:s("K<b>"),U:s("K<~>"),I:s("bh"),eV:s("a8"),D:s("a9"),ai:s("bW<ai<q,@>>"),ao:s("bW<e>"),J:s("aa"),eY:s("pn"),u:s("B"),bs:s("B(V)"),g2:s("ez"),dL:s("ad<aZ>"),b3:s("ad<aj>"),e:s("ad<i>"),bD:s("V"),fv:s("ds<e?>"),d1:s("c_"),e_:s("bD"),y:s("u"),al:s("u(e)"),aT:s("u(B)"),i:s("i"),z:s("@"),fO:s("@()"),w:s("@(e)"),C:s("@(e,az)"),S:s("b"),c:s("bq(@,c,bq?,b,b)?"),eH:s("au<a0>?"),an:s("J?"),bF:s("r<@>?"),aM:s("ai<+(q,i,i),bA>?"),cq:s("ai<q,ai<q,@>>?"),X:s("e?"),ae:s("b0<e>?"),dk:s("q?"),g_:s("bA?"),ev:s("bB<@>?"),F:s("bg<@,@>?"),Q:s("ew?"),cn:s("eA?"),fQ:s("u?"),cD:s("i?"),gs:s("b?"),cg:s("c5?"),g5:s("~()?"),q:s("c5"),H:s("~"),O:s("~()"),d5:s("~(e)"),da:s("~(e,az)"),cA:s("~(q,@)"),bp:s("~(i,i)"),fi:s("~(i,i,i,i,i,i,i,i)"),as:s("~(b,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a6=J.E.prototype
B.b=J.y.prototype
B.t=J.cH.prototype
B.a=J.cI.prototype
B.c=J.cK.prototype
B.p=J.cb.prototype
B.a7=J.av.prototype
B.a8=J.S.prototype
B.i=A.cd.prototype
B.f=A.cP.prototype
B.e=A.cQ.prototype
B.j=A.cS.prototype
B.d=A.bP.prototype
B.E=J.e4.prototype
B.v=J.d4.prototype
B.o=new A.cB(0,"littleEndian")
B.r=new A.cB(1,"bigEndian")
B.I=new A.cE(A.dD("cE<0&>"))
B.J=new A.f3()
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

B.y=new A.dW()
B.Q=new A.e3()
B.m=new A.fv()
B.R=new A.eh()
B.k=new A.fP()
B.z=new A.eo()
B.S=new A.hF()
B.q=new A.eC()
B.T=new A.ia()
B.U=new A.a4("Truncated LZ4 match offset",null,null)
B.V=new A.a4("Invalid Huffman code length",null,null)
B.W=new A.a4("Invalid LZ4 match offset",null,null)
B.X=new A.a4("Incompatible FastLottie worker host",null,null)
B.Y=new A.a4("LZ4 literal out of bounds",null,null)
B.Z=new A.a4("Empty LZ4 block",null,null)
B.a_=new A.a4("Truncated LZ4 literal len",null,null)
B.a0=new A.a4("Truncated LZ4 match len",null,null)
B.a1=new A.a4("Lottie JSON exceeds decode budget",null,null)
B.a2=new A.a4("LZ4 match out of output bounds",null,null)
B.a3=new A.a4("Invalid raster worker request",null,null)
B.a4=new A.a4("Incomplete Huffman table",null,null)
B.a5=new A.a4("Oversubscribed Huffman table",null,null)
B.a9=new A.f8(null)
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
B.aD=new A.dg(4)
B.u=new A.A(0,0)
B.aE=new A.A(0,-1)
B.aF=new A.A(1,4)
B.aG=new A.A(2,0)
B.aH=new A.A(3,1)
B.aI=new A.A(4,1)
B.aJ=new A.A(5,1)
B.F=new A.dk(0,0)
B.aK=new A.A(null,null)
B.aL=new A.aB(0,0,0)
B.aM=new A.ay(0,0,0,0)
B.au={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aN=new A.P(B.au,21,t.M)
B.ai={v:0,i:1,o:2,c:3}
B.aO=new A.P(B.ai,4,t.M)
B.aw={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aP=new A.P(B.aw,11,t.M)
B.an={ty:0,nm:1,mn:2,ix:3,v:4}
B.G=new A.P(B.an,5,t.M)
B.az={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aQ=new A.P(B.az,9,t.M)
B.aq={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aR=new A.P(B.aq,6,t.M)
B.ax={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aS=new A.P(B.ax,31,t.M)
B.at={a:0,k:1,ix:2,x:3,l:4}
B.H=new A.P(B.at,5,t.M)
B.aC={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aT=new A.P(B.aC,19,t.M)
B.aA={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aU=new A.P(B.aA,10,t.M)
B.am={s:0,x:1,y:2,ix:3}
B.aV=new A.P(B.am,4,t.M)
B.ak={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aW=new A.P(B.ak,9,t.M)
B.ao={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aX=new A.P(B.ao,8,t.M)
B.av={}
B.aY=new A.P(B.av,0,t.M)
B.al={a:0,s:1,i:2,f:3,n:4}
B.aZ=new A.P(B.al,5,t.M)
B.aB={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.b_=new A.P(B.aB,15,t.M)
B.ah={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.b0=new A.P(B.ah,7,t.M)
B.aj={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.b1=new A.P(B.aj,10,t.M)
B.as={n:0,nm:1,v:2}
B.b2=new A.P(B.as,3,t.M)
B.ar={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b3=new A.P(B.ar,10,t.M)
B.ap={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b4=new A.P(B.ap,16,t.M)
B.ay={p:0,k:1}
B.b5=new A.P(B.ay,2,t.M)
B.b6=A.aM("oR")
B.b7=A.aM("oS")
B.b8=A.aM("bq")
B.b9=A.aM("eY")
B.ba=A.aM("eZ")
B.bb=A.aM("mb")
B.bc=A.aM("j4")
B.bd=A.aM("mc")
B.be=A.aM("e")
B.bf=A.aM("jo")
B.bg=A.aM("d3")
B.bh=A.aM("mO")
B.bi=A.aM("bx")
B.bj=new A.fM(!1)
B.h=new A.c(null,null)
B.n=new A.c(B.h,"layers")})();(function staticFields(){$.hM=null
$.aC=A.h([],t.f)
$.ki=null
$.fo=0
$.ji=A.nX()
$.k8=null
$.k7=null
$.li=null
$.le=null
$.lm=null
$.it=null
$.iB=null
$.jL=null
$.hV=A.h([],A.dD("y<r<e>?>"))
$.ct=null
$.dz=null
$.dA=null
$.jB=!1
$.G=B.k
$.lc=null
$.jz=null
$.l=null
$.fh=null
$.cN=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"oU","lq",()=>A.iu("_$dart_dartClosure"))
s($,"oT","iT",()=>A.iu("_$dart_dartClosure_dartJSInterop"))
s($,"py","lP",()=>B.k.br(B.k,A.dD("au<~>()").a(new A.iF()),A.dD("au<~>")))
s($,"pv","lO",()=>A.h([new J.dS()],A.dD("y<cZ>")))
s($,"p9","lx",()=>A.bf(A.fK({
toString:function(){return"$receiver$"}})))
s($,"pa","ly",()=>A.bf(A.fK({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"pb","lz",()=>A.bf(A.fK(null)))
s($,"pc","lA",()=>A.bf(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"pf","lD",()=>A.bf(A.fK(void 0)))
s($,"pg","lE",()=>A.bf(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"pe","lC",()=>A.bf(A.kx(null)))
s($,"pd","lB",()=>A.bf(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"pi","lG",()=>A.bf(A.kx(void 0)))
s($,"ph","lF",()=>A.bf(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"p_","dE",()=>A.mq(4))
s($,"pj","jU",()=>A.mP())
s($,"oV","jQ",()=>$.lP())
s($,"pr","lM",()=>A.kh(4096))
s($,"pp","lK",()=>new A.i8().$0())
s($,"pq","lL",()=>new A.i7().$0())
s($,"pt","eQ",()=>A.iG(B.be))
s($,"p3","jR",()=>{A.mw()
return $.fo})
s($,"pu","lN",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"oX","ls",()=>A.j1(B.ag,!1))
s($,"oW","lr",()=>A.j1(B.ab,!1))
s($,"oQ","iS",()=>A.lZ())
s($,"oP","lp",()=>A.lY($.iS()))
s($,"oZ","lu",()=>A.kh(65536))
s($,"oY","lt",()=>{var r=A.ms(16384)
B.e.ac(r,0,16384,-1)
return r})
s($,"pw","jX",()=>A.kg(16384))
s($,"ps","jW",()=>A.e7("content\\('([^']*)'\\)"))
s($,"pm","lJ",()=>A.e7("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"pk","lH",()=>A.e7("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"pl","lI",()=>A.e7('[\\\\"\\x00-\\x1f]'))
s($,"po","jV",()=>A.e7("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"p6","jT",()=>A.kg(16384))
s($,"p5","jS",()=>new A.fC().$0())
s($,"p8","lw",()=>A.mN())
s($,"p7","lv",()=>A.mM())})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bu,ArrayBuffer:A.cc,ArrayBufferView:A.cR,DataView:A.dY,Float32Array:A.cd,Float64Array:A.cP,Int16Array:A.dZ,Int32Array:A.cQ,Int8Array:A.e0,Uint16Array:A.e1,Uint32Array:A.cS,Uint8ClampedArray:A.cT,CanvasPixelArray:A.cT,Uint8Array:A.bP})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ac.$nativeSuperclassTag="ArrayBufferView"
A.dc.$nativeSuperclassTag="ArrayBufferView"
A.dd.$nativeSuperclassTag="ArrayBufferView"
A.bv.$nativeSuperclassTag="ArrayBufferView"
A.de.$nativeSuperclassTag="ArrayBufferView"
A.df.$nativeSuperclassTag="ArrayBufferView"
A.ax.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.oC
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()