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
if(a[b]!==s){A.nL(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.h(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.iY(b)
return new s(c,this)}:function(){if(s===null)s=A.iY(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.iY(a).prototype
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
j1(a,b,c,d){return{i:a,p:b,e:c,x:d}},
hW(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.j_==null){A.nu()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.d(A.jx("Return interceptor for "+A.t(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.h6
if(o==null)o=$.h6=A.hV(n)
p=q[o]}if(p!=null)return p
p=A.nz(a)
if(p!=null)return p
if(typeof a=="function")return B.a3
s=Object.getPrototypeOf(a)
if(s==null)return B.D
if(s===Object.prototype)return B.D
if(typeof q=="function"){o=$.h6
if(o==null)o=$.h6=A.hV(n)
Object.defineProperty(q,o,{value:B.u,enumerable:false,writable:true,configurable:true})
return B.u}return B.u},
lg(a,b){if(a<0||a>4294967295)throw A.d(A.al(a,0,4294967295,"length",null))
return J.li(new Array(a),b)},
lh(a,b){if(a<0)throw A.d(A.aC("Length must be a non-negative integer: "+a,null))
return A.h(new Array(a),b.i("v<0>"))},
li(a,b){var s=A.h(a,b.i("v<0>"))
s.$flags=1
return s},
ap(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cr.prototype
return J.du.prototype}if(typeof a=="string")return J.c0.prototype
if(a==null)return J.cs.prototype
if(typeof a=="boolean")return J.cq.prototype
if(Array.isArray(a))return J.v.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aj.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bv.prototype
return a}if(a instanceof A.i)return a
return J.hW(a)},
O(a){if(typeof a=="string")return J.c0.prototype
if(a==null)return a
if(Array.isArray(a))return J.v.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aj.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bv.prototype
return a}if(a instanceof A.i)return a
return J.hW(a)},
bp(a){if(a==null)return a
if(Array.isArray(a))return J.v.prototype
if(typeof a!="object"){if(typeof a=="function")return J.aj.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bv.prototype
return a}if(a instanceof A.i)return a
return J.hW(a)},
bq(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.aj.prototype
if(typeof a=="symbol")return J.bw.prototype
if(typeof a=="bigint")return J.bv.prototype
return a}if(a instanceof A.i)return a
return J.hW(a)},
l(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.ap(a).E(a,b)},
ad(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.ny(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.O(a).h(a,b)},
kS(a,b){return J.bp(a).an(a,b)},
kT(a,b,c){return J.bq(a).dw(a,b,c)},
kU(a){return J.bq(a).dz(a)},
j8(a,b,c){return J.bq(a).bs(a,b,c)},
kV(a,b,c){return J.bq(a).dA(a,b,c)},
kW(a,b,c){return J.bq(a).dB(a,b,c)},
kX(a){return J.bq(a).dC(a)},
bY(a,b,c){return J.bq(a).bt(a,b,c)},
kY(a,b){return J.bp(a).aE(a,b)},
j9(a){return J.bq(a).gaa(a)},
kZ(a){return J.bp(a).ga6(a)},
aM(a){return J.ap(a).gS(a)},
ih(a){return J.O(a).gZ(a)},
cl(a){return J.bp(a).gG(a)},
aB(a){return J.O(a).gk(a)},
l_(a){return J.ap(a).gV(a)},
ja(a){return J.bp(a).gae(a)},
jb(a,b,c,d,e){return J.bq(a).P(a,b,c,d,e)},
bs(a){return J.ap(a).p(a)},
B:function B(){},
cq:function cq(){},
cs:function cs(){},
N:function N(){},
bd:function bd(){},
dF:function dF(){},
cM:function cM(){},
aj:function aj(){},
bv:function bv(){},
bw:function bw(){},
v:function v(a){this.$ti=a},
dt:function dt(){},
eF:function eF(a){this.$ti=a},
bt:function bt(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
ct:function ct(){},
cr:function cr(){},
du:function du(){},
c0:function c0(){}},A={ir:function ir(){},
jl(a){return new A.aU("Field '"+a+"' has been assigned during initialization.")},
lj(a){return new A.aU("Field '"+a+"' has not been initialized.")},
ag(a){return new A.aU("Local '"+a+"' has not been initialized.")},
eI(a){return new A.aU("Local '"+a+"' has already been initialized.")},
b_(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
f0(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
iX(a,b,c){return a},
j0(a){var s,r
for(s=$.ao.length,r=0;r<s;++r)if(a===$.ao[r])return!0
return!1},
ar(){return new A.bh("No element")},
ip(){return new A.bh("Too many elements")},
aU:function aU(a){this.a=a},
i4:function i4(){},
eX:function eX(){},
aO:function aO(){},
a9:function a9(){},
by:function by(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
U:function U(a,b,c){this.a=a
this.b=b
this.$ti=c},
bE:function bE(a,b,c){this.a=a
this.b=b
this.$ti=c},
cO:function cO(a,b,c){this.a=a
this.b=b
this.$ti=c},
E:function E(){},
bD:function bD(){},
l9(){throw A.d(A.aG("Cannot modify constant Set"))},
kr(a){var s=A.kq(a)
if(s!=null)return s
return"minified:"+a},
ny(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
t(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bs(a)
return s},
cG(a){var s,r=$.jo
if(r==null)r=$.jo=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
lw(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.d(A.al(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
dG(a){var s,r,q,p
if(a instanceof A.i)return A.af(A.ba(a),null)
s=J.ap(a)
if(s===B.a2||s===B.a4||t.ak.b(a)){r=B.v(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.af(A.ba(a),null)},
jp(a){var s,r,q
if(a==null||typeof a=="number"||A.b8(a))return J.bs(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bb)return a.p(0)
if(a instanceof A.a3)return a.dj(!0)
s=$.kQ()
for(r=0;r<1;++r){q=s[r].h5(a)
if(q!=null)return q}return"Instance of '"+A.dG(a)+"'"},
lx(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
cH(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.I(s,10)|55296)>>>0,s&1023|56320)}throw A.d(A.al(a,0,1114111,null,null))},
lv(a){var s=a.$thrownJsError
if(s==null)return null
return A.b9(s)},
ly(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.S(a,s)
a.$thrownJsError=s
s.stack=""}},
Z(a){throw A.d(A.iW(a))},
a(a,b){if(a==null)J.aB(a)
throw A.d(A.en(a,b))},
en(a,b){var s,r="index"
if(!A.q(b))return new A.aN(!0,b,r,null)
s=A.k(J.aB(a))
if(b<0||b>=s)return A.jj(b,s,a,r)
return A.lz(b,r)},
iW(a){return new A.aN(!0,a,null,null)},
ki(a){return a},
d(a){return A.S(a,new Error())},
S(a,b){var s
if(a==null)a=new A.b0()
b.dartException=a
s=A.nM
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
nM(){return J.bs(this.dartException)},
u(a,b){throw A.S(a,b==null?new Error():b)},
f(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.u(A.mv(a,b,c),s)},
mv(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.cN("'"+s+"': Cannot "+o+" "+l+k+n)},
W(a){throw A.d(A.aq(a))},
b1(a){var s,r,q,p,o,n
a=A.nG(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.h([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.f3(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
f4(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
jv(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
is(a,b){var s=b==null,r=s?null:b.method
return new A.dw(a,r,s?null:b.receiver)},
ac(a){var s
if(a==null)return new A.eT(a)
if(a instanceof A.cp){s=a.a
return A.br(a,s==null?A.bo(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.br(a,a.dartException)
return A.nb(a)},
br(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
nb(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.I(r,16)&8191)===10)switch(q){case 438:return A.br(a,A.is(A.t(s)+" (Error "+q+")",null))
case 445:case 5007:A.t(s)
return A.br(a,new A.cF())}}if(a instanceof TypeError){p=$.kw()
o=$.kx()
n=$.ky()
m=$.kz()
l=$.kC()
k=$.kD()
j=$.kB()
$.kA()
i=$.kF()
h=$.kE()
g=p.ah(s)
if(g!=null)return A.br(a,A.is(A.G(s),g))
else{g=o.ah(s)
if(g!=null){g.method="call"
return A.br(a,A.is(A.G(s),g))}else if(n.ah(s)!=null||m.ah(s)!=null||l.ah(s)!=null||k.ah(s)!=null||j.ah(s)!=null||m.ah(s)!=null||i.ah(s)!=null||h.ah(s)!=null){A.G(s)
return A.br(a,new A.cF())}}return A.br(a,new A.dP(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.cJ()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.br(a,new A.aN(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.cJ()
return a},
b9(a){var s
if(a instanceof A.cp)return a.b
if(a==null)return new A.d1(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.d1(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
i5(a){if(a==null)return J.aM(a)
if(typeof a=="object")return A.cG(a)
return J.aM(a)},
np(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.u(0,a[s],a[r])}return b},
mI(a,b,c,d,e,f){t.Z.a(a)
switch(A.k(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.d(new A.fx("Unsupported number of arguments for wrapped closure"))},
dd(a,b){var s=a.$identity
if(!!s)return s
s=A.nj(a,b)
a.$identity=s
return s},
nj(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.mI)},
l8(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.dK().constructor.prototype):Object.create(new A.c_(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.ji(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.l4(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.ji(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
l4(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.l2)}throw A.d("Error in functionType of tearoff")},
l5(a,b,c,d){var s=A.jh
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
ji(a,b,c,d){if(c)return A.l7(a,b,d)
return A.l5(b.length,d,a,b)},
l6(a,b,c,d){var s=A.jh,r=A.l3
switch(b?-1:a){case 0:throw A.d(new A.dJ("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
l7(a,b,c){var s,r
if($.jf==null)$.jf=A.je("interceptor")
if($.jg==null)$.jg=A.je("receiver")
s=b.length
r=A.l6(s,c,a,b)
return r},
iY(a){return A.l8(a)},
l2(a,b){return A.d8(v.typeUniverse,A.ba(a.a),b)},
jh(a){return a.a},
l3(a){return a.b},
je(a){var s,r,q,p=new A.c_("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.d(A.aC("Field name "+a+" not found.",null))},
hV(a){return v.getIsolateTag(a)},
op(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
nz(a){var s,r,q,p,o,n=A.G($.kk.$1(a)),m=$.hU[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.i0[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.hF($.kg.$2(a,n))
if(q!=null){m=$.hU[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.i0[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.i3(s)
$.hU[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.i0[n]=s
return s}if(p==="-"){o=A.i3(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.kn(a,s)
if(p==="*")throw A.d(A.jx(n))
if(v.leafTags[n]===true){o=A.i3(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.kn(a,s)},
kn(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.j1(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
i3(a){return J.j1(a,!1,null,!!a.$iak)},
nB(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.i3(s)
else return J.j1(s,c,null,null)},
nu(){if(!0===$.j_)return
$.j_=!0
A.nv()},
nv(){var s,r,q,p,o,n,m,l
$.hU=Object.create(null)
$.i0=Object.create(null)
A.nt()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.ko.$1(o)
if(n!=null){m=A.nB(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
nt(){var s,r,q,p,o,n,m=B.H()
m=A.cj(B.I,A.cj(B.J,A.cj(B.w,A.cj(B.w,A.cj(B.K,A.cj(B.L,A.cj(B.M(B.v),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.kk=new A.hX(p)
$.kg=new A.hY(o)
$.ko=new A.hZ(n)},
cj(a,b){return a(b)||b},
lV(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.l(r,b[s]))return!1}return!0},
nk(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
jk(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.d(A.dn("Illegal RegExp pattern ("+String(o)+")",a,null))},
nG(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
cZ:function cZ(a){this.a=a},
bO:function bO(a){this.a=a},
cc:function cc(a){this.a=a},
F:function F(a,b){this.a=a
this.b=b},
cd:function cd(a,b){this.a=a
this.b=b},
a0:function a0(a,b,c){this.a=a
this.b=b
this.c=c},
aS:function aS(a){this.a=a},
bP:function bP(a){this.a=a},
ce:function ce(a){this.a=a},
cR:function cR(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
co:function co(){},
J:function J(a,b,c){this.a=a
this.b=b
this.$ti=c},
cI:function cI(){},
f3:function f3(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
cF:function cF(){},
dw:function dw(a,b,c){this.a=a
this.b=b
this.c=c},
dP:function dP(a){this.a=a},
eT:function eT(a){this.a=a},
cp:function cp(a,b){this.a=a
this.b=b},
d1:function d1(a){this.a=a
this.b=null},
bb:function bb(){},
di:function di(){},
dj:function dj(){},
dM:function dM(){},
dK:function dK(){},
c_:function c_(a,b){this.a=a
this.b=b},
dJ:function dJ(a){this.a=a},
aT:function aT(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
eG:function eG(a){this.a=a},
eJ:function eJ(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
T:function T(a,b){this.a=a
this.$ti=b},
cv:function cv(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
eK:function eK(a,b){this.a=a
this.$ti=b},
aD:function aD(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bx:function bx(a,b){this.a=a
this.$ti=b},
cu:function cu(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
ae:function ae(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
hX:function hX(a){this.a=a},
hY:function hY(a){this.a=a},
hZ:function hZ(a){this.a=a},
a3:function a3(){},
bN:function bN(){},
ca:function ca(){},
cb:function cb(){},
aR:function aR(){},
dv:function dv(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
cT:function cT(a){this.b=a},
dQ:function dQ(a,b,c){this.a=a
this.b=b
this.c=c},
c5:function c5(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
nL(a){throw A.S(A.jl(a),new Error())},
C(){throw A.S(A.lj(""),new Error())},
M(){throw A.S(A.jl(""),new Error())},
dU(){var s=new A.fg()
return s.b=s},
fg:function fg(){this.b=null},
b7(a,b,c){},
R(a){return a},
lp(a,b,c){A.b7(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
ls(a){return new Float32Array(a)},
iv(a,b,c){A.b7(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dB(a,b,c){A.b7(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Int32Array(a,b,c)},
iw(a,b,c){A.b7(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
lt(a){return new Uint8Array(a)},
ix(a,b,c){A.b7(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
aL(a,b,c){if(a>>>0!==a||a>=c)throw A.d(A.en(b,a))},
bf:function bf(){},
c1:function c1(){},
cx:function cx(a){this.a=a},
ee:function ee(a){this.a=a},
cC:function cC(){},
hy:function hy(a){this.a=a},
dz:function dz(){},
a5:function a5(){},
cA:function cA(){},
cB:function cB(){},
c2:function c2(){},
cy:function cy(){},
dA:function dA(){},
cz:function cz(){},
dC:function dC(){},
dD:function dD(){},
cD:function cD(){},
cE:function cE(){},
bz:function bz(){},
aE:function aE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
e5:function e5(){},
e6:function e6(){},
cU:function cU(){},
cV:function cV(){},
cW:function cW(){},
cX:function cX(){},
ef:function ef(){},
iA(a,b){var s=b.c
return s==null?b.c=A.d6(a,"ai",[b.x]):s},
jr(a){var s=a.w
if(s===6||s===7)return A.jr(a.x)
return s===11||s===12},
lB(a){return a.as},
ep(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
eo(a){return A.hx(v.typeUniverse,a,!1)},
bT(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.bT(a1,s,a3,a4)
if(r===s)return a2
return A.jO(a1,r,!0)
case 7:s=a2.x
r=A.bT(a1,s,a3,a4)
if(r===s)return a2
return A.jN(a1,r,!0)
case 8:q=a2.y
p=A.ci(a1,q,a3,a4)
if(p===q)return a2
return A.d6(a1,a2.x,p)
case 9:o=a2.x
n=A.bT(a1,o,a3,a4)
m=a2.y
l=A.ci(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.iN(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.ci(a1,j,a3,a4)
if(i===j)return a2
return A.jP(a1,k,i)
case 11:h=a2.x
g=A.bT(a1,h,a3,a4)
f=a2.y
e=A.n8(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.jM(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.ci(a1,d,a3,a4)
o=a2.x
n=A.bT(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.iO(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.d(A.dh("Attempted to substitute unexpected RTI kind "+a0))}},
ci(a,b,c,d){var s,r,q,p,o=b.length,n=A.hC(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.bT(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
n9(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.hC(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.bT(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
n8(a,b,c,d){var s,r=b.a,q=A.ci(a,r,c,d),p=b.b,o=A.ci(a,p,c,d),n=b.c,m=A.n9(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.e0()
s.a=q
s.b=o
s.c=m
return s},
h(a,b){a[v.arrayRti]=b
return a},
kj(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.ns(s)
return a.$S()}return null},
nw(a,b){var s
if(A.jr(b))if(a instanceof A.bb){s=A.kj(a)
if(s!=null)return s}return A.ba(a)},
ba(a){if(a instanceof A.i)return A.n(a)
if(Array.isArray(a))return A.a1(a)
return A.iQ(J.ap(a))},
a1(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
n(a){var s=a.$ti
return s!=null?s:A.iQ(a)},
iQ(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.mG(a,s)},
mG(a,b){var s=a instanceof A.bb?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.md(v.typeUniverse,s.name)
b.$ccache=r
return r},
ns(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.hx(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
nr(a){return A.bV(A.n(a))},
iV(a){var s
if(a instanceof A.a3)return A.no(a.$r,a.aT())
s=a instanceof A.bb?A.kj(a):null
if(s!=null)return s
if(t.dm.b(a))return J.l_(a).a
if(Array.isArray(a))return A.a1(a)
return A.ba(a)},
bV(a){var s=a.r
return s==null?a.r=new A.hw(a):s},
no(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.d8(v.typeUniverse,A.iV(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.jR(v.typeUniverse,s,A.iV(q[r]))}return A.d8(v.typeUniverse,s,a)},
aA(a){return A.bV(A.hx(v.typeUniverse,a,!1))},
mF(a){var s=this
s.b=A.n6(s)
return s.b(a)},
n6(a){var s,r,q,p,o
if(a===t.K)return A.mO
if(A.bW(a))return A.mS
s=a.w
if(s===6)return A.mD
if(s===1)return A.k7
if(s===7)return A.mJ
r=A.n5(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.bW)){a.f="$i"+q
if(q==="p")return A.mM
if(a===t.m)return A.mL
return A.mR}}else if(s===10){p=A.nk(a.x,a.y)
o=p==null?A.k7:p
return o==null?A.bo(o):o}return A.mB},
n5(a){if(a.w===8){if(a===t.S)return A.q
if(a===t.i||a===t.q)return A.mN
if(a===t.N)return A.mQ
if(a===t.y)return A.b8}return null},
mE(a){var s=this,r=A.mA
if(A.bW(s))r=A.mn
else if(s===t.K)r=A.bo
else if(A.ck(s)){r=A.mC
if(s===t.gs)r=A.ml
else if(s===t.dk)r=A.hF
else if(s===t.fQ)r=A.mj
else if(s===t.cg)r=A.jV
else if(s===t.cD)r=A.mk
else if(s===t.an)r=A.mm}else if(s===t.S)r=A.k
else if(s===t.N)r=A.G
else if(s===t.y)r=A.bn
else if(s===t.q)r=A.eg
else if(s===t.i)r=A.Q
else if(s===t.m)r=A.r
s.a=r
return s.a(a)},
mB(a){var s=this
if(a==null)return A.ck(s)
return A.km(v.typeUniverse,A.nw(a,s),s)},
mD(a){if(a==null)return!0
return this.x.b(a)},
mR(a){var s,r=this
if(a==null)return A.ck(r)
s=r.f
if(a instanceof A.i)return!!a[s]
return!!J.ap(a)[s]},
mM(a){var s,r=this
if(a==null)return A.ck(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.i)return!!a[s]
return!!J.ap(a)[s]},
mL(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.i)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
k6(a){if(typeof a=="object"){if(a instanceof A.i)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
mA(a){var s=this
if(a==null){if(A.ck(s))return a}else if(s.b(a))return a
throw A.S(A.jZ(a,s),new Error())},
mC(a){var s=this
if(a==null||s.b(a))return a
throw A.S(A.jZ(a,s),new Error())},
jZ(a,b){return new A.cg("TypeError: "+A.jz(a,A.af(b,null)))},
ni(a,b,c,d){if(A.km(v.typeUniverse,a,b))return a
throw A.S(A.m5("The type argument '"+A.af(a,null)+"' is not a subtype of the type variable bound '"+A.af(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
jz(a,b){return A.ev(a)+": type '"+A.af(A.iV(a),null)+"' is not a subtype of type '"+b+"'"},
m5(a){return new A.cg("TypeError: "+a)},
az(a,b){return new A.cg("TypeError: "+A.jz(a,b))},
mJ(a){var s=this
return s.x.b(a)||A.iA(v.typeUniverse,s).b(a)},
mO(a){return a!=null},
bo(a){if(a!=null)return a
throw A.S(A.az(a,"Object"),new Error())},
mS(a){return!0},
mn(a){return a},
k7(a){return!1},
b8(a){return!0===a||!1===a},
bn(a){if(!0===a)return!0
if(!1===a)return!1
throw A.S(A.az(a,"bool"),new Error())},
mj(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.S(A.az(a,"bool?"),new Error())},
Q(a){if(typeof a=="number")return a
throw A.S(A.az(a,"double"),new Error())},
mk(a){if(typeof a=="number")return a
if(a==null)return a
throw A.S(A.az(a,"double?"),new Error())},
q(a){return typeof a=="number"&&Math.floor(a)===a},
k(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.S(A.az(a,"int"),new Error())},
ml(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.S(A.az(a,"int?"),new Error())},
mN(a){return typeof a=="number"},
eg(a){if(typeof a=="number")return a
throw A.S(A.az(a,"num"),new Error())},
jV(a){if(typeof a=="number")return a
if(a==null)return a
throw A.S(A.az(a,"num?"),new Error())},
mQ(a){return typeof a=="string"},
G(a){if(typeof a=="string")return a
throw A.S(A.az(a,"String"),new Error())},
hF(a){if(typeof a=="string")return a
if(a==null)return a
throw A.S(A.az(a,"String?"),new Error())},
r(a){if(A.k6(a))return a
throw A.S(A.az(a,"JSObject"),new Error())},
mm(a){if(a==null)return a
if(A.k6(a))return a
throw A.S(A.az(a,"JSObject?"),new Error())},
kc(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.af(a[q],b)
return s},
n0(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.kc(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.af(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
k3(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
if(a5!=null){s=a5.length
if(a4==null)a4=A.h([],t.s)
else a2=a4.length
r=a4.length
for(q=s;q>0;--q)B.b.n(a4,"T"+(r+q))
for(p=t.X,o="<",n="",q=0;q<s;++q,n=a1){m=a4.length
l=m-1-q
if(!(l>=0))return A.a(a4,l)
o=o+n+a4[l]
k=a5[q]
j=k.w
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.af(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.af(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.af(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.af(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.af(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
af(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.af(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.af(a.x,b)+">"
if(l===8){p=A.na(a.x)
o=a.y
return o.length>0?p+("<"+A.kc(o,b)+">"):p}if(l===10)return A.n0(a,b)
if(l===11)return A.k3(a,b,null)
if(l===12)return A.k3(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
na(a){var s=A.kq(a)
if(s!=null)return s
return"minified:"+a},
me(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
md(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.hx(a,b,!1)
else if(typeof m=="number"){s=m
r=A.d7(a,5,"#")
q=A.hC(s)
for(p=0;p<s;++p)q[p]=r
o=A.d6(a,b,q)
n[b]=o
return o}else return m},
mc(a,b){return A.jT(a.tR,b)},
mb(a,b){return A.jT(a.eT,b)},
hx(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.jQ(a,null,b,!1)
r.set(b,s)
return s},
d8(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.jQ(a,b,c,!0)
q.set(c,r)
return r},
jR(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.iN(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
jQ(a,b,c,d){return A.lT(A.lN(a,b,c,d))},
bl(a,b){b.a=A.mE
b.b=A.mF
return b},
d7(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aF(null,null)
s.w=b
s.as=c
r=A.bl(a,s)
a.eC.set(c,r)
return r},
jO(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.m9(a,b,r,c)
a.eC.set(r,s)
return s},
m9(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.bW(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.ck(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aF(null,null)
q.w=6
q.x=b
q.as=c
return A.bl(a,q)},
jN(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.m7(a,b,r,c)
a.eC.set(r,s)
return s},
m7(a,b,c,d){var s,r
if(d){s=b.w
if(A.bW(b)||b===t.K)return b
else if(s===1)return A.d6(a,"ai",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aF(null,null)
r.w=7
r.x=b
r.as=c
return A.bl(a,r)},
ma(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aF(null,null)
s.w=13
s.x=b
s.as=q
r=A.bl(a,s)
a.eC.set(q,r)
return r},
d5(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
m6(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
d6(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.d5(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aF(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bl(a,r)
a.eC.set(p,q)
return q},
iN(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.d5(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aF(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bl(a,o)
a.eC.set(q,n)
return n},
jP(a,b,c){var s,r,q="+"+(b+"("+A.d5(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aF(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bl(a,s)
a.eC.set(q,r)
return r},
jM(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.d5(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.d5(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.m6(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aF(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bl(a,p)
a.eC.set(r,o)
return o},
iO(a,b,c,d){var s,r=b.as+("<"+A.d5(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.m8(a,b,c,r,d)
a.eC.set(r,s)
return s},
m8(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.hC(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.bT(a,b,r,0)
m=A.ci(a,c,r,0)
return A.iO(a,n,m,c!==m)}}l=new A.aF(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bl(a,l)},
lN(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
lT(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.lP(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.jE(a,r,l,k,!1)
else if(q===46)r=A.jE(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.bM(a.u,a.e,k.pop()))
break
case 94:k.push(A.ma(a.u,k.pop()))
break
case 35:k.push(A.d7(a.u,5,"#"))
break
case 64:k.push(A.d7(a.u,2,"@"))
break
case 126:k.push(A.d7(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.lR(a,k)
break
case 38:A.lQ(a,k)
break
case 63:p=a.u
k.push(A.jO(p,A.bM(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.jN(p,A.bM(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.lO(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.jF(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.lU(a.u,a.e,o)
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
return A.bM(a.u,a.e,m)},
lP(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
jE(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.me(s,o.x)[p]
if(n==null)A.u('No "'+p+'" in "'+A.lB(o)+'"')
d.push(A.d8(s,o,n))}else d.push(p)
return m},
lR(a,b){var s,r=a.u,q=A.jD(a,b),p=b.pop()
if(typeof p=="string")b.push(A.d6(r,p,q))
else{s=A.bM(r,a.e,p)
switch(s.w){case 11:b.push(A.iO(r,s,q,a.n))
break
default:b.push(A.iN(r,s,q))
break}}},
lO(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.jD(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.bM(p,a.e,o)
q=new A.e0()
q.a=s
q.b=n
q.c=m
b.push(A.jM(p,r,q))
return
case-4:b.push(A.jP(p,b.pop(),s))
return
default:throw A.d(A.dh("Unexpected state under `()`: "+A.t(o)))}},
lQ(a,b){var s=b.pop()
if(0===s){b.push(A.d7(a.u,1,"0&"))
return}if(1===s){b.push(A.d7(a.u,4,"1&"))
return}throw A.d(A.dh("Unexpected extended operation "+A.t(s)))},
jD(a,b){var s=b.splice(a.p)
A.jF(a.u,a.e,s)
a.p=b.pop()
return s},
bM(a,b,c){if(typeof c=="string")return A.d6(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.lS(a,b,c)}else return c},
jF(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.bM(a,b,c[s])},
lU(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.bM(a,b,c[s])},
lS(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.d(A.dh("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.d(A.dh("Bad index "+c+" for "+b.p(0)))},
km(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.Y(a,b,null,c,null)
r.set(c,s)}return s},
Y(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.bW(d))return!0
s=b.w
if(s===4)return!0
if(A.bW(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.Y(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.Y(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.Y(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.Y(a,b.x,c,d,e))return!1
return A.Y(a,A.iA(a,b),c,d,e)}if(s===6)return A.Y(a,p,c,d,e)&&A.Y(a,b.x,c,d,e)
if(q===7){if(A.Y(a,b,c,d.x,e))return!0
return A.Y(a,b,c,A.iA(a,d),e)}if(q===6)return A.Y(a,b,c,p,e)||A.Y(a,b,c,d.x,e)
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
if(!A.Y(a,j,c,i,e)||!A.Y(a,i,e,j,c))return!1}return A.k5(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.k5(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.mK(a,b,c,d,e)}if(o&&q===10)return A.mP(a,b,c,d,e)
return!1},
k5(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.Y(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.Y(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.Y(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.Y(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.Y(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
mK(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.d8(a,b,r[o])
return A.jU(a,p,null,c,d.y,e)}return A.jU(a,b.y,null,c,d.y,e)},
jU(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.Y(a,b[s],d,e[s],f))return!1
return!0},
mP(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.Y(a,r[s],c,q[s],e))return!1
return!0},
ck(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.bW(a))if(s!==6)r=s===7&&A.ck(a.x)
return r},
bW(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
jT(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
hC(a){return a>0?new Array(a):v.typeUniverse.sEA},
aF:function aF(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
e0:function e0(){this.c=this.b=this.a=null},
hw:function hw(a){this.a=a},
dY:function dY(){},
cg:function cg(a){this.a=a},
lH(){var s,r,q
if(self.scheduleImmediate!=null)return A.nc()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dd(new A.fc(s),1)).observe(r,{childList:true})
return new A.fb(s,r,q)}else if(self.setImmediate!=null)return A.nd()
return A.ne()},
lI(a){self.scheduleImmediate(A.dd(new A.fd(t.O.a(a)),0))},
lJ(a){self.setImmediate(A.dd(new A.fe(t.O.a(a)),0))},
lK(a){t.O.a(a)
A.m0(0,a)},
m0(a,b){var s=new A.hs()
s.ef(a,b)
return s},
k9(a){return new A.dR(new A.I($.D,a.i("I<0>")),a.i("dR<0>"))},
jY(a,b){a.$2(0,null)
b.b=!0
return b.a},
hG(a,b){A.mo(a,b)},
jX(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("ai<1>").b(a))s.cF(a)
else s.cJ(a)},
jW(a,b){var s=A.ac(a),r=A.b9(a),q=A.k4(s,r)
s=new A.ah(s,r)
r=b.b
q=b.a
if(r)q.bc(s)
else q.ba(s)},
mo(a,b){var s,r,q=new A.hH(b),p=new A.hI(b)
if(a instanceof A.I)a.dh(q,p,t.z)
else{s=t.z
if(a instanceof A.I)a.ck(q,p,s)
else{r=new A.I($.D,t._)
r.a=8
r.c=a
r.dh(q,p,s)}}},
kf(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.D
return r.bY(r,t.as.a(new A.hT(s)),t.H,t.S,t.z)},
ik(a){var s
if(t.R.b(a)){s=a.gaR()
if(s!=null)return s}return B.q},
k4(a,b){var s=$.D
if(s===B.k)return null
s.eF(s,a,b)
return null},
mH(a,b){if($.D!==B.k)A.k4(a,b)
if(t.R.b(a)){b=a.gaR()
if(b==null){A.ly(a,B.q)
b=B.q}}else b=B.q
return new A.ah(a,b)},
iE(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.lC()
b.ba(new A.ah(new A.aN(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.d1(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.aV()
b.bb(n.a)
A.bJ(b,p)
return}b.a^=2
o=b.b
o.aW(o,new A.fT(n,b))},
bJ(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.aU(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.bJ(e.a,d)
q.a=l
k=l.a}j=e.a.c
q.b=n
q.c=j
if(o){p=d.c
p=(p&1)!==0||(p&15)===8}else p=!0
if(p){i=d.b.b
h=$.D
if(h!==i)$.D=i
else h=null
d=d.c
if((d&15)===8)new A.fX(q,e,n).$0()
else if(o){if((d&1)!==0)new A.fW(q,j).$0()}else if((d&2)!==0)new A.fV(e,q).$0()
if(h!=null)$.D=h
d=q.c
if(d instanceof A.I){p=q.a.$ti
p=p.i("ai<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bo(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.iE(d,g,!0)
return}}g=q.a.b
f=r.a(g.c)
g.c=null
b=g.bo(f)
d=q.b
p=q.c
if(!d){g.$ti.c.a(p)
g.a=8
g.c=p}else{s.a(p)
g.a=g.a&1|16
g.c=p}e.a=g
d=g}},
n1(a,b){var s=t.C
if(s.b(a))return b.bY(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.bm(b,s.a(a),t.z,t.K)
throw A.d(A.jc(a,"onError",u.c))},
mV(){var s,r
for(s=$.ch;s!=null;s=$.ch){$.db=null
r=s.b
$.ch=r
if(r==null)$.da=null
s.a.$0()}},
n7(){$.iR=!0
try{A.mV()}finally{$.db=null
$.iR=!1
if($.ch!=null)$.j5().$1(A.kh())}},
kd(a){var s=new A.dS(a),r=$.da
if(r==null){$.ch=$.da=s
if(!$.iR)$.j5().$1(A.kh())}else $.da=r.b=s},
n4(a){var s,r,q,p=$.ch
if(p==null){A.kd(a)
$.db=$.da
return}s=new A.dS(a)
r=$.db
if(r==null){s.b=p
$.ch=$.db=s}else{q=r.b
s.b=q
$.db=r.b=s
if(q==null)$.da=s}},
nI(a){var s=$.D
if(B.k===s){A.iT(B.k,a)
return}A.iT(s,s.bl(s,a,t.H))
return},
nZ(a,b){A.iX(a,"stream",t.K)
return new A.e9(b.i("e9<0>"))},
iU(a){return},
lL(a,b){if(b==null)b=A.ng()
if(t.da.b(b))return a.bY(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.bm(a,t.w.a(b),t.z,t.K)
throw A.d(A.aC("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
mX(a,b){var s=$.D
s.aU(s,a,b)},
mW(){},
n3(a,b){A.n4(new A.hS(a,b))},
iT(a,b){if(B.k!==a)b=a.fh(b,t.H)
A.kd(b)},
fc:function fc(a){this.a=a},
fb:function fb(a,b,c){this.a=a
this.b=b
this.c=c},
fd:function fd(a){this.a=a},
fe:function fe(a){this.a=a},
hs:function hs(){},
ht:function ht(a,b){this.a=a
this.b=b},
dR:function dR(a,b){this.a=a
this.b=!1
this.$ti=b},
hH:function hH(a){this.a=a},
hI:function hI(a){this.a=a},
hT:function hT(a){this.a=a},
ah:function ah(a,b){this.a=a
this.b=b},
dV:function dV(){},
cP:function cP(a,b){this.a=a
this.$ti=b},
b2:function b2(a,b,c,d,e){var _=this
_.a=null
_.b=a
_.c=b
_.d=c
_.e=d
_.$ti=e},
I:function I(a,b){var _=this
_.a=0
_.b=a
_.c=null
_.$ti=b},
fQ:function fQ(a,b){this.a=a
this.b=b},
fU:function fU(a,b){this.a=a
this.b=b},
fT:function fT(a,b){this.a=a
this.b=b},
fS:function fS(a,b){this.a=a
this.b=b},
fR:function fR(a,b){this.a=a
this.b=b},
fX:function fX(a,b,c){this.a=a
this.b=b
this.c=c},
fY:function fY(a,b){this.a=a
this.b=b},
fZ:function fZ(a){this.a=a},
fW:function fW(a,b){this.a=a
this.b=b},
fV:function fV(a,b){this.a=a
this.b=b},
dS:function dS(a){this.a=a
this.b=null},
cK:function cK(){},
eZ:function eZ(a,b){this.a=a
this.b=b},
f_:function f_(a,b){this.a=a
this.b=b},
d2:function d2(){},
hl:function hl(a){this.a=a},
hk:function hk(a){this.a=a},
dT:function dT(){},
c6:function c6(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
c7:function c7(a,b){this.a=a
this.$ti=b},
c8:function c8(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
cQ:function cQ(){},
ff:function ff(a){this.a=a},
d4:function d4(){},
bk:function bk(){},
bG:function bG(a,b){this.b=a
this.a=null
this.$ti=b},
dX:function dX(){},
aI:function aI(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
hg:function hg(a,b){this.a=a
this.b=b},
e9:function e9(a){this.$ti=a},
f9:function f9(){},
fa:function fa(a,b,c){this.a=a
this.b=b
this.c=c},
hS:function hS(a,b){this.a=a
this.b=b},
lk(a,b,c){return b.i("@<0>").a2(c).i("it<1,2>").a(A.np(a,new A.aT(b.i("@<0>").a2(c).i("aT<1,2>"))))},
a8(a,b){return new A.aT(a.i("@<0>").a2(b).i("aT<1,2>"))},
ll(a){return new A.b3(a.i("b3<0>"))},
iu(a){return new A.b3(a.i("b3<0>"))},
iG(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
jn(a){var s,r
if(A.j0(a))return"{...}"
s=new A.c4("")
try{r={}
B.b.n($.ao,a)
s.a+="{"
r.a=!0
a.aF(0,new A.eN(r,s))
s.a+="}"}finally{if(0>=$.ao.length)return A.a($.ao,-1)
$.ao.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
b3:function b3(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
bL:function bL(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
e4:function e4(a){this.a=a
this.c=this.b=null},
cS:function cS(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
A:function A(){},
L:function L(){},
eM:function eM(a){this.a=a},
eN:function eN(a,b){this.a=a
this.b=b},
aZ:function aZ(){},
d0:function d0(){},
mY(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ac(r)
q=A.dn(String(s),null,null)
throw A.d(q)}q=A.hJ(p)
return q},
hJ(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.e2(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.hJ(a[s])
return a},
mg(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.kO()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
mf(a,b,c,d){var s=a?$.kN():$.kM()
if(s==null)return null
if(0===c&&d===b.length)return A.jS(s,b)
return A.jS(s,b.subarray(c,d))},
jS(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
mh(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
e2:function e2(a,b){this.a=a
this.b=b
this.c=null},
h7:function h7(a){this.a=a},
e3:function e3(a){this.a=a},
hB:function hB(){},
hA:function hA(){},
dk:function dk(){},
dm:function dm(){},
dx:function dx(){},
eH:function eH(a){this.a=a},
f6:function f6(a){this.a=a},
hz:function hz(a){this.a=a
this.b=16
this.c=0},
nx(a,b){var s=A.lw(a,b)
if(s!=null)return s
throw A.d(A.dn(a,null,null))},
la(a,b){a=A.S(a,new Error())
if(a==null)a=A.bo(a)
a.stack=b.p(0)
throw a},
jm(a,b,c,d){var s,r=c?J.lh(a,d):J.lg(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
lm(a,b,c){var s,r,q=A.h([],c.i("v<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.W)(a),++r)B.b.n(q,c.a(a[r]))
q.$flags=1
return q},
aV(a,b){var s,r
if(Array.isArray(a))return A.h(a.slice(0),b.i("v<0>"))
s=A.h([],b.i("v<0>"))
for(r=J.cl(a);r.v();)B.b.n(s,r.gC())
return s},
lD(a,b,c){var s,r
A.iz(b,"start")
s=c-b
if(s<0)throw A.d(A.al(c,b,null,"end",null))
if(s===0)return""
r=A.lE(a,b,c)
return r},
lE(a,b,c){var s=a.length
if(b>=s)return""
return A.lx(a,b,c==null||c>s?s:c)},
dI(a){return new A.dv(a,A.jk(a,!1,!0,!1,!1,""))},
ju(a,b,c){var s=J.cl(b)
if(!s.v())return a
if(c.length===0){do a+=A.t(s.gC())
while(s.v())}else{a+=A.t(s.gC())
while(s.v())a=a+c+A.t(s.gC())}return a},
lC(){return A.b9(new Error())},
ev(a){if(typeof a=="number"||A.b8(a)||a==null)return J.bs(a)
if(typeof a=="string")return JSON.stringify(a)
return A.jp(a)},
lb(a,b){A.iX(a,"error",t.K)
A.iX(b,"stackTrace",t.l)
A.la(a,b)},
dh(a){return new A.dg(a)},
aC(a,b){return new A.aN(!1,null,b,a)},
jc(a,b,c){return new A.aN(!0,a,b,c)},
jq(a){var s=null
return new A.aY(s,s,!1,s,s,a)},
lz(a,b){return new A.aY(null,null,!0,a,b,"Value not in range")},
al(a,b,c,d,e){return new A.aY(b,c,!0,a,d,"Invalid value")},
bB(a,b,c){if(0>a||a>c)throw A.d(A.al(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.al(b,a,c,"end",null))
return b}return c},
iz(a,b){if(a<0)throw A.d(A.al(a,0,null,b,null))
return a},
jj(a,b,c,d){return new A.dp(b,!0,a,d,"Index out of range")},
aG(a){return new A.cN(a)},
jx(a){return new A.dO(a)},
at(a){return new A.bh(a)},
aq(a){return new A.dl(a)},
dn(a,b,c){return new A.X(a,b,c)},
lf(a,b,c){var s,r
if(A.j0(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.h([],t.s)
B.b.n($.ao,a)
try{A.mT(a,s)}finally{if(0>=$.ao.length)return A.a($.ao,-1)
$.ao.pop()}r=A.ju(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
iq(a,b,c){var s,r
if(A.j0(a))return b+"..."+c
s=new A.c4(b)
B.b.n($.ao,a)
try{r=s
r.a=A.ju(r.a,a,", ")}finally{if(0>=$.ao.length)return A.a($.ao,-1)
$.ao.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
mT(a,b){var s,r,q,p,o,n,m,l=a.gG(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.v())return
s=A.t(l.gC())
B.b.n(b,s)
k+=s.length+2;++j}if(!l.v()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gC();++j
if(!l.v()){if(j<=4){B.b.n(b,A.t(p))
return}r=A.t(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gC();++j
for(;l.v();p=o,o=n){n=l.gC();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.b.n(b,"...")
return}}q=A.t(p)
r=A.t(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.b.n(b,m)
B.b.n(b,q)
B.b.n(b,r)},
eU(a,b,c,d){var s
if(B.n===c){s=B.a.gS(a)
b=J.aM(b)
return A.f0(A.b_(A.b_($.eq(),s),b))}if(B.n===d){s=B.a.gS(a)
b=J.aM(b)
c=J.aM(c)
return A.f0(A.b_(A.b_(A.b_($.eq(),s),b),c))}s=B.a.gS(a)
b=J.aM(b)
c=J.aM(c)
d=J.aM(d)
d=A.f0(A.b_(A.b_(A.b_(A.b_($.eq(),s),b),c),d))
return d},
lu(a){var s,r,q=$.eq()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.W)(a),++r)q=A.b_(q,J.aM(a[r]))
return A.f0(q)},
fw:function fw(){},
K:function K(){},
dg:function dg(a){this.a=a},
b0:function b0(){},
aN:function aN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aY:function aY(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
dp:function dp(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
cN:function cN(a){this.a=a},
dO:function dO(a){this.a=a},
bh:function bh(a){this.a=a},
dl:function dl(a){this.a=a},
dE:function dE(){},
cJ:function cJ(){},
fx:function fx(a){this.a=a},
X:function X(a,b,c){this.a=a
this.b=b
this.c=c},
m:function m(){},
be:function be(a,b,c){this.a=a
this.b=b
this.$ti=c},
V:function V(){},
i:function i(){},
ea:function ea(){},
c4:function c4(a){this.a=a},
mt(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.t(a)
r=A.nh(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.u("Attempting to box non-Dart object.")
q={}
q[$.kP()]=a
r.error=q
r.stack=b.p(0)
return r},
lc(a,b){var s,r=v.G.Promise,q=new A.eB(a)
if(typeof q=="function")A.u(A.aC("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.mr,q)
s[$.ig()]=q
return A.r(new r(s))},
eS:function eS(a){this.a=a},
eB:function eB(a){this.a=a},
ez:function ez(a){this.a=a},
eA:function eA(a){this.a=a},
mq(a,b,c){t.Z.a(a)
if(A.k(c)>=1)return a.$1(b)
return a.$0()},
mr(a,b,c,d){t.Z.a(a)
A.k(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
dc(a,b,c,d){return d.a(a[b].apply(a,c))},
nh(a,b,c){var s,r
if(b==null)return c.a(new a())
if(b instanceof Array)switch(b.length){case 0:return c.a(new a())
case 1:return c.a(new a(b[0]))
case 2:return c.a(new a(b[0],b[1]))
case 3:return c.a(new a(b[0],b[1],b[2]))
case 4:return c.a(new a(b[0],b[1],b[2],b[3]))}s=[null]
B.b.ag(s,b)
r=a.bind.apply(a,s)
String(r)
return c.a(new r())},
j2(a,b){var s=new A.I($.D,b.i("I<0>")),r=new A.cP(s,b.i("cP<0>"))
a.then(A.dd(new A.i6(r,b),1),A.dd(new A.i7(r),1))
return s},
i6:function i6(a,b){this.a=a
this.b=b},
i7:function i7(a){this.a=a},
eC:function eC(){},
eD:function eD(a,b,c){this.a=a
this.b=b
this.c=c},
h_:function h_(){},
h0:function h0(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
il(a,b){var s=new A.eE()
s.ec(a,b)
return s},
eE:function eE(){this.a=$
this.b=0
this.c=2147483647},
f8:function f8(){},
hD:function hD(){},
hE:function hE(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dq:function dq(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
nl(a,b,c){var s,r="The decoded data is larger than the ",q=new A.dy(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.d(A.ij(r+b+" bytes allowed"))
throw s}if(q.e)throw A.d(A.ij(r+b+" bytes allowed"))
return p},
dy:function dy(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
ii(a){return new A.bZ(a,null,null)},
l0(a){return new A.cm(a,null,null)},
ij(a){return new A.df(a,null,null)},
bZ:function bZ(a,b,c){this.a=a
this.b=b
this.c=c},
cm:function cm(a,b,c){this.a=a
this.b=b
this.c=c},
df:function df(a,b,c){this.a=a
this.b=b
this.c=c},
cn:function cn(a,b){this.a=a
this.b=b},
eY:function eY(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
kl(a,b,c,d){var s,r,q,p=c,o=new A.fu($.iP)
$.iP=o
try{if(d.$0())return!0
if(p){r=A.ii("Invalid "+a+" data")
throw A.d(r)}return!1}catch(q){s=A.ac(q)
r=s
if(!(r instanceof A.bZ||r instanceof A.cm||r instanceof A.X||t.b8.b(r)||t.k.b(r)))throw q
r=s instanceof A.df
if(r)throw q
if(s instanceof A.cm){if(c){r=A.ii(s.a)
throw A.d(r)}return!1}if(s instanceof A.bZ){if(p)throw q
return!1}if(p){r=A.ii("Invalid "+a+" data: "+A.t(s))
throw A.d(r)}return!1}finally{$.iP=o.a}},
fu:function fu(a){this.a=a},
im(a,b,c,d){var s,r,q,p,o=new A.dr(b)
if(d==null)d=0
A.iz(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.R(a))
p=J.bY(B.d.gaa(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
dr:function dr(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
ds:function ds(){},
iy(a){var s=a==null?32768:a
return new A.bA(new Uint8Array(s),B.o)},
bA:function bA(a,b){this.b=0
this.c=a
this.a=b},
bg:function bg(){},
l1(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
jd(a,b,c){var s,r,q,p=b+c,o=$.ks()
for(s=a.length,r=b,q=4294967295;r<p;++r){if(!(r<s))return A.a(a,r)
q=o[(q^a[r])&255]^q>>>8}return(q^4294967295)&2147483647},
e7:function e7(a,b,c){this.a=a
this.b=b
this.c=c},
er:function er(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=4194304
_.d=b
_.e=c
_.f=0
_.r=d
_.w=e
_.x=0
_.y=null
_.z=f
_.Q=g
_.as=h
_.at=i
_.ay=_.ax=0},
eu:function eu(a,b,c){this.a=a
this.b=b
this.c=c},
es:function es(a){this.a=a},
et:function et(a){this.a=a},
aW(a,b){var s,r,q,p,o=a.length
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
ln(b0,b1,b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9
if(b1<0||b1>b0.length)throw A.d(A.al(b1,0,b0.length,"srcLength",null))
if(b1===0)return 0
s=b4>=0?b4:b2.length
r=0
q=0
if(b1>=13){B.e.T(b3,0,16384,-1)
p=b1-12
o=b1-5
n=A.aW(b0,0)*2654435761>>>0>>>18
b3.$flags&2&&A.f(b3)
if(!(n<16384))return A.a(b3,n)
b3[n]=0
m=A.aW(b0,1)*2654435761>>>0>>>18
A:for(n=b0.length,l=b2.$flags|0,k=1;;){j=k
i=1
h=64
do{g=j+i
i=h>>>6;++h
if(g>p)break A
f=A.aW(b0,g)*2654435761>>>0>>>18
if(!(m>=0&&m<16384))return A.a(b3,m)
e=b3[m]
b3[m]=j
if(e<0||j-e>65535||A.aW(b0,e)!==A.aW(b0,j)){j=g
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
l&2&&A.f(b2)
if(!(a>=0&&a<b2.length))return A.a(b2,a)
b2[a]=255
a1-=255}a2=a+1
l&2&&A.f(b2)
if(!(a>=0&&a<b2.length))return A.a(b2,a)
b2[a]=a1
a=a2}for(a3=0;a3<b;++a3,a=a2){a2=a+1
d=q+a3
if(!(d>=0&&d<n))return A.a(b0,d)
d=b0[d]
l&2&&A.f(b2)
if(!(a>=0&&a<b2.length))return A.a(b2,a)
b2[a]=d}a4=k-e
a2=a+1
l&2&&A.f(b2)
d=b2.length
if(!(a>=0&&a<d))return A.a(b2,a)
b2[a]=a4&255
a=a2+1
c=B.a.I(a4,8)
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
c=A.aW(b0,d)*2654435761>>>0>>>18
if(!(c<16384))return A.a(b3,c)
b3[c]=d
a8=A.aW(b0,a6)*2654435761>>>0>>>18
if(!(a8<16384))return A.a(b3,a8)
e=b3[a8]
b3[a8]=a6
if(e<0||a6-e>65535||A.aW(b0,e)!==A.aW(b0,a6)){k=a6+1
m=A.aW(b0,k)*2654435761>>>0>>>18
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
if(n){l&2&&A.f(b2)
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
r=a}else{l&2&&A.f(b2)
if(!(r>=0&&r<b2.length))return A.a(b2,r)
b2[r]=a9<<4>>>0
r=a}n=r+a9
B.d.P(b2,r,n,b0,q)
return n},
lo(a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3
if(a6<0||a5+a6>a4.length||a8<0||a8>a7.length)throw A.d(A.jq("Invalid LZ4 slice bounds"))
if(a6===0){if(a8!==0)throw A.d(B.V)
return 0}s=a5+a6
for(r=a7.length,q=a7.$flags|0,p=a4.length,o=a5,n=0;o<s;){m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
l=a4[o]
k=l>>>4
if(k===15)for(o=m;;o=m){if(o>=s)throw A.d(B.W)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
k+=j
if(j!==255){o=m
break}}else o=m
m=o+k
if(m>s||n+k>a8)throw A.d(B.U)
if(k>0){i=n+k
B.d.P(a7,n,i,a4,o)
n=i
o=m}if(o>=s)break
m=o+2
if(m>s)throw A.d(B.Q)
if(!(o>=0&&o<p))return A.a(a4,o)
h=a4[o]
g=o+1
if(!(g<p))return A.a(a4,g)
f=(h|a4[g]<<8)>>>0
if(f<=0||f>n)throw A.d(B.S)
h=l&15
e=h+4
if(h===15)for(o=m;;o=m){if(o>=s)throw A.d(B.X)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
e+=j
if(j!==255){o=m
break}}else o=m
i=n+e
if(i>a8)throw A.d(B.Z)
d=n-f
if(f>=e){B.d.P(a7,n,i,a7,d)
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
if(c===0&&b===0&&a===0&&a0===0){B.d.T(a7,n,i,0)
n=i}else{a1=n+((e&4294967292)>>>0)
while(n<a1){q&2&&A.f(a7)
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
q&2&&A.f(a7)
if(!(n>=0&&n<r))return A.a(a7,n)
a7[n]=h}}}else if(f===1){if(!(d>=0&&d<r))return A.a(a7,d)
B.d.T(a7,n,i,a7[d])
n=i}else for(;n<i;d=a3,n=a2){a2=n+1
a3=d+1
if(!(d>=0&&d<r))return A.a(a7,d)
h=a7[d]
q&2&&A.f(a7)
if(!(n>=0&&n<r))return A.a(a7,n)
a7[n]=h}}if(n!==a8)throw A.d(A.dn("LZ4 decoded "+n+" bytes, expected "+a8,null,null))
return n},
eL:function eL(a,b){this.a=a
this.b=b
this.c=0},
f5:function f5(a,b,c){this.a=a
this.b=b
this.c=c},
ew:function ew(a){this.a=a},
iC(a){return new A.bF(a,A.h([],t.ch))},
jA(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.a.J(b.gcm()-s,2)),q=new Float32Array(a*3)
s=Math.max(2,a+Math.max(0,B.a.J(b.gcm()-s,2)))
new Float64Array(s)
return new A.bK(a,r,b,c,d,f,g,e,q)},
m4(a,b,c,d,e){return new A.bR(a,b,c,d,e,A.a8(t.S,t.V))},
jy(a,b){var s=a.length
return new A.c9(a,b,new Float64Array(s))},
nH(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.a.A(B.c.R(Math.min(a*c,s)),0,s)},
nK(a9){var s,r,q,p,o,n,m,l,k,j={},i=A.cY(32,512),h=A.cY(32,512),g=A.cY(32,512),f=A.cY(32,512),e=A.cY(32,512),d=t.cu,c=A.h([],d),b=A.h([],d),a=A.h([],d),a0=A.h([],d),a1=t.dh,a2=A.h([],a1),a3=A.h([],t.cU),a4=A.h([],a1),a5=new Float64Array(256),a6=t.gw,a7=A.h([],a6),a8=A.h([],d)
d=A.h([],d)
s=A.h([],a6)
a6=A.h([],a6)
r=A.h([],t.a2)
a1=A.h([],a1)
q=$.j
p=new A.eW(q!=null,new A.ae(t.el),i,h,g,f,e,c,b,a,a0,a2,a3,a4,new A.bI(a5),a7,a8,d,s,a6,r,new A.ae(t.ed),new A.ae(t.bu),new A.ae(t.ad),a1)
i=t.N
o=A.a8(i,i)
h=t.x
g=new Uint8Array(32)
f=new Uint8Array(16)
e=new Uint8Array(65536)
n=new A.er(null,A.a8(h,t.g2),A.a8(i,t.cJ),A.a8(h,t.gz),A.iu(h),A.a8(i,t.eY),g,f,e)
h=new Int32Array(16384)
g=new Uint8Array(131072)
m=new A.f1()
l=A.a8(i,t.h)
k=A.eR(65536)
j.a=0
i=a9.a
new A.c7(i,A.n(i).i("c7<1>")).fP(new A.i8(j,n,l,p,k,a9,new A.ic(l,o,p),o,new A.i9(j,k,m),new A.ia(k),m,new A.id(n,l,p),new A.ib(j,k,m),new A.ie(o,a9),new A.eL(h,g)))},
cY(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.aw(s,r,q,p,new Uint8Array(a))},
d_(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
if(a9===4){A.hi(a6,a7,a8)
return}a8.l(0)
s=a6.a.gt()
r=a7.a.gt()
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
break}if(a8.aK(f,c,a0-c,l)){l=a6.a
j=l.b
if(j!=null){a3=o.a(A.r($.j.memory).buffer)
a4=l.a
s=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
s=l}l=a7.a
j=l.b
if(j!=null){a3=o.a(A.r($.j.memory).buffer)
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
hi(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
a7.l(0)
s=a5.b
if(s===0||a6.b===0)return
if(!(a5.c<a6.e&&a6.c<a5.e&&a5.d<a6.f&&a6.d<a5.f))return
r=s*2
q=a6.b*2
p=a5.a.gt()
o=a6.a.gt()
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
if(a3>0&&a7.aK(h,a1,a2-a1,a3)){l=a5.a
j=l.b
if(j!=null){d=s.a(A.r($.j.memory).buffer)
a4=l.a
p=new Int32Array(d,j,a4)}else{l=l.c
l.toString
p=l}l=a6.a
j=l.b
if(j!=null){d=s.a(A.r($.j.memory).buffer)
a4=l.a
o=new Int32Array(d,j,a4)}else{l=l.c
l.toString
o=l}}}if(a<=a0)n+=2
if(a0<=a)m+=2}}},
iD(a,b){var s=B.a.b2(B.a.I(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
jL(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.a.J(b*a+127,255)<<16|B.a.J(c*a+127,255)<<8|B.a.J(d*a+127,255))>>>0},
b5(a,b){if(b>=256)return a
if(b<=0||a===0)return 0
return((a&16711935)*b+8388736>>>8&16711935|(a>>>8&16711935)*b+8388736&4278255360)>>>0},
ab(a,b){var s,r,q,p
if(a===0)return b
s=a>>>24
if(s===255||b===0)return a
r=255-s
q=(b&16711935)*r+8388736
p=(b>>>8&16711935)*r+8388736
return a+((B.a.I(q+(B.a.I(q,8)&16711935),8)&16711935|p+(B.a.I(p,8)&16711935)&4278255360)>>>0)},
ay(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.a.I(s+(B.a.I(s,8)&16711935),8)&16711935|r+(B.a.I(r,8)&16711935)&4278255360)>>>0},
jK(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a4===0||a3.b===0)return
if(a5!=null&&A.nJ(a5,a0,a1,a2,a3.a,a3.b,a4))return
s=a3.b*2
r=a3.a.gt()
for(q=a.length,p=a4>>>24===255,o=r.length,n=0;n<s;n+=2){if(!(n<o))return A.a(r,n)
m=r[n]
l=n+1
if(!(l<o))return A.a(r,l)
k=r[l]
j=k>>>8
i=(k&255)+1
h=i===256?a4:A.b5(a4,i)
if(h===0)continue
g=h>>>24
f=((m>>>16)-a1)*a2+((m&65535)-a0)
e=f+j
if(g===255)if(j>=8)B.f.T(a,f,e,h)
else for(l=a.$flags|0,d=f;d<e;++d){l&2&&A.f(a)
if(!(d>=0&&d<q))return A.a(a,d)
a[d]=h}else{c=255-g
if(p&&j===1){if(!(f>=0&&f<q))return A.a(a,f)
b=a[f]
l=b===0?h:A.jI(h,b,c)
a.$flags&2&&A.f(a)
a[f]=l}else for(d=f;d<e;++d){if(!(d>=0&&d<q))return A.a(a,d)
b=a[d]
l=b===0?h:A.jI(h,b,c)
a.$flags&2&&A.f(a)
a[d]=l}}}},
jI(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.a.I(s+(B.a.I(s,8)&16711935),8)&16711935|r+(B.a.I(r,8)&16711935)&4278255360)>>>0)},
lZ(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8
if(b5===0||b3.b===0)return
s=c4-c2
r=c5-c3
q=s*s+r*r
if(q<=1e-12){if(0>=b4.length)return A.a(b4,0)
p=b4[0]
A.jK(a9,b0,b1,b2,b3,b5<255?A.ay(p,b5):p,null)
return}o=1/q
n=(b6*s+b7*r)*o
m=b3.b*2
l=b3.a.gt()
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
else a7=a3>=1?1023:B.c.W(a3*1023+0.5)
if(!(a7>=0&&a7<i))return A.a(b4,a7)
d=b4[a7]
if(!(a6>=0&&a6<j))return A.a(a9,a6)
d=A.ab(d,a9[a6])
a9.$flags&2&&A.f(a9)
a9[a6]=d
a3+=n}else for(d=a0<256,a6=a4;a6<a5;++a6){if(a3<=0)a7=0
else a7=a3>=1?1023:B.c.W(a3*1023+0.5)
if(!(a7>=0&&a7<i))return A.a(b4,a7)
p=b4[a7]
if(k)p=A.ay(p,b5)
if(d)p=A.b5(p,a0)
if(!(a6>=0&&a6<j))return A.a(a9,a6)
a8=A.ab(p,a9[a6])
a9.$flags&2&&A.f(a9)
a9[a6]=a8
a3+=n}}},
m_(d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6=1023
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
g=e1.a.gt()
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
a2=$.de()
a2.$flags&2&&A.f(a2)
a2[0]=b7
c1=a2[0]
a2[0]=b8
c2=a2[0]
a2[0]=b9
c3=a2[0]
a2[0]=c0
c4=new A.aE(c1,c2,c3,a2[0]).cu()
c5=c4.a
c6=c4.b
c7=c4.c
c8=c4.d
c9=c5>=1?d6:B.c.W(c5*1023+0.5)
d0=c6>=1?d6:B.c.W(c6*1023+0.5)
d1=c7>=1?d6:B.c.W(c7*1023+0.5)
d2=c8>=1?d6:B.c.W(c8*1023+0.5)
if(!(c9>=0&&c9<d))return A.a(e2,c9)
a2=e2[c9]
if(!(b6>=0&&b6<e))return A.a(d7,b6)
a2=A.ab(a2,d7[b6])
a&2&&A.f(d7)
d7[b6]=a2
a2=b6+1
if(!(d0>=0&&d0<d))return A.a(e2,d0)
c1=e2[d0]
if(!(a2<e))return A.a(d7,a2)
d7[a2]=A.ab(c1,d7[a2])
a2=b6+2
if(!(d1>=0&&d1<d))return A.a(e2,d1)
c1=e2[d1]
if(!(a2<e))return A.a(d7,a2)
d7[a2]=A.ab(c1,d7[a2])
a2=b6+3
if(!(d2>=0&&d2<d))return A.a(e2,d2)
c1=e2[d2]
if(!(a2<e))return A.a(d7,a2)
d7[a2]=A.ab(c1,d7[a2])
b6+=4}while(b6<b4){a2=b1>0?b1:0
d3=Math.sqrt(a2)
d4=d3>=1?d6:B.c.W(d3*1023+0.5)
if(!(d4>=0&&d4<d))return A.a(e2,d4)
a2=e2[d4]
if(!(b6>=0&&b6<e))return A.a(d7,b6)
a2=A.ab(a2,d7[b6])
a&2&&A.f(d7)
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
c1=$.de()
c1.$flags&2&&A.f(c1)
c1[0]=b7
c2=c1[0]
c1[0]=b8
c3=c1[0]
c1[0]=b9
c6=c1[0]
c1[0]=c0
c4=new A.aE(c2,c3,c6,c1[0]).cu()
c5=c4.a
c6=c4.b
c7=c4.c
c8=c4.d
c1=c5>=1?d6:B.c.W(c5*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
c9=e2[c1]
c1=c6>=1?d6:B.c.W(c6*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
d0=e2[c1]
c1=c7>=1?d6:B.c.W(c7*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
d1=e2[c1]
c1=c8>=1?d6:B.c.W(c8*1023+0.5)
if(!(c1>=0&&c1<d))return A.a(e2,c1)
d2=e2[c1]
if(f){c9=A.ay(c9,e3)
d0=A.ay(d0,e3)
d1=A.ay(d1,e3)
d2=A.ay(d2,e3)}if(a2){c9=A.b5(c9,a6)
d0=A.b5(d0,a6)
d1=A.b5(d1,a6)
d2=A.b5(d2,a6)}if(!(b6>=0&&b6<e))return A.a(d7,b6)
c1=A.ab(c9,d7[b6])
a&2&&A.f(d7)
d7[b6]=c1
c1=b6+1
if(!(c1<e))return A.a(d7,c1)
d7[c1]=A.ab(d0,d7[c1])
c1=b6+2
if(!(c1<e))return A.a(d7,c1)
d7[c1]=A.ab(d1,d7[c1])
c1=b6+3
if(!(c1<e))return A.a(d7,c1)
d7[c1]=A.ab(d2,d7[c1])
b6+=4}while(b6<b4){c1=b1>0?b1:0
d3=Math.sqrt(c1)
d4=d3>=1?d6:B.c.W(d3*1023+0.5)
if(!(d4>=0&&d4<d))return A.a(e2,d4)
d5=e2[d4]
if(f)d5=A.ay(d5,e3)
if(a2)d5=A.b5(d5,a6)
if(!(b6>=0&&b6<e))return A.a(d7,b6)
c1=A.ab(d5,d7[b6])
a&2&&A.f(d7)
d7[b6]=c1
b1+=b2
b2+=i;++b6}}}},
an(a){var s=A.k(a)+128
return B.a.I(s+B.a.I(s,8),8)},
iJ(a,b,c,d,e){var s
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
break}return A.an(a*(255-d)+b*(255-c)+s)},
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
k=s+r-A.an(s*r)
if(A.jJ(c))return A.lW(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.an(q*p)<<16|o+n-A.an(o*n)<<8|m+l-A.an(m*l))>>>0
return(k<<24|A.iJ(q,p,s,r,c)<<16|A.iJ(o,n,s,r,c)<<8|A.iJ(m,l,s,r,c))>>>0},
jJ(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
lW(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.a0(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.a0(o,n,m)
switch(j){case 12:s=A.hq(A.jH(p,A.iK(l)),A.eb(l))
break
case 13:s=A.hq(A.jH(l,A.iK(p)),A.eb(l))
break
case 14:s=A.hq(p,A.eb(l))
break
case 15:s=A.hq(l,A.eb(p))
break
default:s=new A.a0(A.iI(o,s,j),A.iI(n,r,j),A.iI(m,q,j))
break}r=new A.ho(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.a8()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.a8()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.Z(s)
return(i<<24|q<<16|o<<8|s)>>>0},
iI(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
eb(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
iK(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
jH(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.iK(a)
if(o===0)return B.aI
return new A.a0((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
hq(a,b){var s=b-A.eb(a),r=a.a,q=a.b,p=a.c,o=new A.hr(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.a0(o.$1(r),o.$1(q),o.$1(p))},
lX(a,b,c,d,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
if(a1===0)return
if(a3!=null&&!A.jJ(a2)&&A.nD(a3,b,c,d,a0.a,a0.b,a1,a2))return
s=a0.a.gt()
for(r=a.length,q=s.length,p=0,o=0,n=0,m=0;m<a0.b*2;m+=2){if(!(m<q))return A.a(s,m)
l=s[m]
k=m+1
if(!(k<q))return A.a(s,k)
j=s[k]
i=A.b5(a1,(j&255)+1)
if(i===0)continue
h=((l>>>16)-c)*d+(l&65535)-b
g=h+(j>>>8)
for(f=h;f<g;++f){if(!(f>=0&&f<r))return A.a(a,f)
e=a[f]
if(i!==p||e!==o){n=A.ec(i,e,a2)
o=e
p=i}a.$flags&2&&A.f(a)
a[f]=n}}},
lY(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.f(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.ec(k,j,a3)
p=j
q=k}a.$flags&2&&A.f(a)
a[l]=o}},
kb(a,b,c,d,e,f){var s,r,q,p,o=d*e,n=f.b
if(n)A.kp(c,o)
else B.f.T(c.gt(),0,o,0)
s=!0
if(d>0)if(e>0){r=a.b
r===$&&A.C()
if(!(r<=0)){s=a.c
s===$&&A.C()
s=s<=0}}if(s)return
s=a.b
s===$&&A.C()
r=a.c
r===$&&A.C()
A.iS(a,b,255,c,0,0,d,0,0,d,e,d/s,0,0,e/r,0,0,null,f,0,!0,n)
q=Math.max(o,f.ok)
f.ok=0
p=q<=65536&&!f.f
f.f=!1
if(p){if(++f.p1>=16){f.p1=0
f.h4()}}else f.p1=0},
iS(f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2=null
if(g0>=g2||g1>=g3||f5<=0)return
s=h4?f6:f2
r=f3.w
for(q=r.length-1,p=h2*3,o=p+1,n=h2+1,m=g7>=0,l=g5>=0,k=g6>=0,j=g4>=0,i=t.a,h=h1.b,g=s!=null,f=p+2;q>=0;--q){if(!(q<r.length))return A.a(r,q)
e=r[q]
if(!e.ch){if(!e.e)d=(e.b!=null||e.f!=null)&&f4>=e.c&&f4<e.d
else d=!1
d=!d}else d=!0
if(d)continue
d=e.a.e.m(f4)
if(0>=d.length)return A.a(d,0)
if(B.c.D(B.a.A(B.c.W(f5*B.c.D(d[0])/100),0,255)*e.aQ(f4)/255)===0)continue
c=e.ay
b=e.Q
d=e.y
a=d===2||d===4
a0=e.ax?255:f5
a1=c!=null
a2=!1
if(a1){if(!c.e)a3=(c.b!=null||c.f!=null)&&f4>=c.c&&f4<c.d
else a3=!1
if(a3){a3=c.a.e.m(f4)
if(0>=a3.length)return A.a(a3,0)
a3=B.c.D(B.a.A(B.c.W(a0*B.c.D(a3[0])/100),0,255)*c.aQ(f4)/255)>0
a2=a3}}if(a1&&!a2&&!a)continue
if(!a2){if(b===0)A.bS(e,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,0,!0,!1,!1,!1,!0)
else{a4=e.aq(f4)
if(a4!=null){d=j?a4.a:a4.c
a1=k?a4.b:a4.d
a5=B.c.R(g4*d+g6*a1+g8)-1
d=l?a4.a:a4.c
a1=m?a4.b:a4.d
a6=B.c.R(g5*d+g7*a1+g9)-1
d=j?a4.c:a4.a
a1=k?a4.d:a4.b
a7=B.c.U(g4*d+g6*a1+g8)+1
d=l?a4.c:a4.a
a1=m?a4.d:a4.b
a8=B.c.U(g5*d+g7*a1+g9)+1
if(a5<g0)a5=g0
if(a6<g1)a6=g1
if(a7>g2)a7=g2
if(a8>g3)a8=g3
a9=a7-a5
b0=a8-a6
if(a9>0&&b0>0){if(e.f==null){d=e.b
b1=d==null?f2:d.gcs()}else b1=f2
d=!1
if(b1!=null){a1=b1.y
if(a1!=null){if(g)if($.j!=null){a3=!0
if(b!==6)if(b!==7)if(b!==9)a3=b>=12&&b<=15
if(!a3){d=!1
if(a1.w){a1=a1.f
if(a1!=null)if(a1.a!=null){d=a1.m(0)
if(0>=d.length)return A.a(d,0)
d=d[0]!==0}else d=!0}d=!d}}}else d=!0}if(d){A.bS(e,f4,f5,f6,f7,f8,f9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,b,!0,!1,!1,!1,!0)
continue}d=a9*b0
b2=h1.aG(f,d)
if(h){a1=b2.c
if(a1!=null)$.j.fastlottie_clear_pixels(a1,d)
else{a1=b2.d
a1.toString
B.f.T(a1,0,d,0)}}else{a1=b2.c
if(a1!=null){a3=i.a(A.r($.j.memory).buffer)
b3=b2.b
a1=new Uint32Array(a3,a1,b3)}else{a1=b2.d
a1.toString}B.f.T(a1,0,d,0)}A.bS(e,f4,f5,b2,a5,a6,a9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,h0,h1,n,h3,h,0,!0,!0,!1,!1,!0)
if(g){d=!0
if(b!==6)if(b!==7)if(b!==9)d=b>=12&&b<=15
b4=!d&&A.nC(s,(a6-f8)*f9+a5-f7,f9,b2,a9,b0,b)}else b4=!1
if(!b4){d=f6.c
if(d!=null){a1=i.a(A.r($.j.memory).buffer)
b3=f6.b
d=new Uint32Array(a1,d,b3)}else{d=f6.d
d.toString}a1=b2.c
if(a1!=null){a3=i.a(A.r($.j.memory).buffer)
b3=b2.b
a1=new Uint32Array(a3,a1,b3)}else{a1=b2.d
a1.toString}A.lY(d,a5-f7,a6-f8,f9,a1,0,0,a9,a9,b0,b)}}}}continue}b5=d===3||d===4
b6=e.aq(f4)
if(b6==null)continue
d=j?b6.a:b6.c
a1=k?b6.b:b6.d
b7=B.c.R(g4*d+g6*a1+g8)-1
d=l?b6.a:b6.c
a1=m?b6.b:b6.d
b8=B.c.R(g5*d+g7*a1+g9)-1
d=j?b6.c:b6.a
a1=k?b6.d:b6.b
b9=B.c.U(g4*d+g6*a1+g8)+1
d=l?b6.c:b6.a
a1=m?b6.d:b6.b
c0=B.c.U(g5*d+g7*a1+g9)+1
if(b7<g0)b7=g0
if(b8<g1)b8=g1
if(b9>g2)b9=g2
if(c0>g3)c0=g3
if(b7>=b9||b8>=c0)continue
c1=c.aq(f4)
if(c1!=null){d=j?c1.a:c1.c
a1=k?c1.b:c1.d
c2=Math.max(b7,B.c.R(g4*d+g6*a1+g8)-1)
d=l?c1.a:c1.c
a1=m?c1.b:c1.d
c3=Math.max(b8,B.c.R(g5*d+g7*a1+g9)-1)
d=j?c1.c:c1.a
a1=k?c1.d:c1.b
c4=Math.min(b9,B.c.U(g4*d+g6*a1+g8)+1)
d=l?c1.c:c1.a
a1=m?c1.d:c1.b
c5=Math.min(c0,B.c.U(g5*d+g7*a1+g9)+1)}else{c5=g1
c4=g0
c3=c5
c2=c4}c6=c2<c4&&c3<c5
if(!a&&!c6)continue
if(a&&!c6&&b===0){A.bS(e,f4,f5,f6,f7,f8,f9,b7,b8,b9,c0,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,0,!0,!1,!1,!1,!0)
continue}a5=a?b7:c2
a6=a?b8:c3
a7=a?b9:c4
a8=a?c0:c5
a9=a7-a5
b0=a8-a6
c7=a9*b0
b2=h1.aG(p,c7)
d=b2.c
if(d!=null){a1=i.a(A.r($.j.memory).buffer)
b3=b2.b
d=new Uint32Array(a1,d,b3)}else{d=b2.d
d.toString}B.f.T(d,0,c7,0)
A.bS(e,f4,f5,b2,a5,a6,a9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,f2,h1,n,h3,e.as!=null&&h,0,!0,!0,!1,!1,!0)
c8=h1.aG(o,c7)
d=c8.c
if(d!=null){a1=i.a(A.r($.j.memory).buffer)
b3=c8.b
d=new Uint32Array(a1,d,b3)}else{d=c8.d
d.toString}B.f.T(d,0,c7,0)
if(c6){d=c.as!=null&&h
A.bS(c,f4,a0,c8,a5,a6,a9,c2,c3,c4,c5,g4,g5,g6,g7,g8,g9,f2,h1,n,h3,d,0,!0,!0,!b5,!1,!0)}d=b2.c
if(d!=null){a1=i.a(A.r($.j.memory).buffer)
b3=b2.b
c9=new Uint32Array(a1,d,b3)}else{d=b2.d
d.toString
c9=d}d=c8.c
if(d!=null){a1=i.a(A.r($.j.memory).buffer)
b3=c8.b
d0=new Uint32Array(a1,d,b3)}else{d=c8.d
d.toString
d0=d}d=f6.c
if(d!=null){a1=i.a(A.r($.j.memory).buffer)
b3=f6.b
d1=new Uint32Array(a1,d,b3)}else{d=f6.d
d.toString
d1=d}for(d=d1.length,a1=b===0,a3=!b5,d2=d0.length,d3=c9.length,d4=a5-f7,d5=d1.$flags|0,d6=0;d6<b0;++d6){d7=d6*a9
d8=(a6+d6-f8)*f9+d4
for(d9=0;d9<a9;++d9){e0=d7+d9
if(!(e0>=0&&e0<d3))return A.a(c9,e0)
e1=c9[e0]
if(e1===0)continue
if(!(e0<d2))return A.a(d0,e0)
e2=d0[e0]
e3=e2>>>24
if(a3)e4=a?255-e3:e3
else if(e3===0)e4=a?255:0
else{e5=e2>>>16&255
e6=e2>>>8&255
e7=e2&255
if(e3!==255){e0=$.kJ()
if(!(e3<e0.length))return A.a(e0,e3)
e8=e0[e3]
e5=e5*e8>>>16
e6=e6*e8>>>16
e7=e7*e8>>>16}e9=B.a.A(19595*e5+38470*e6+7471*e7>>>16,0,255)
e4=a?255-e9:e9}if(e4===0)continue
f0=e4===255?e1:A.ay(e1,e4)
f1=d8+d9
if(a1){if(!(f1>=0&&f1<d))return A.a(d1,f1)
e0=A.ab(f0,d1[f1])}else{if(!(f1>=0&&f1<d))return A.a(d1,f1)
e0=A.ec(f0,d1[f1],b)}d5&2&&A.f(d1)
if(!(f1>=0&&f1<d))return A.a(d1,f1)
d1[f1]=e0}}}},
el(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
ej(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
em(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
ek(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eh(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaz()){i.$flags&2&&A.f(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gci()){a.cP(b)
s=a.z
r=a.Q
i.$flags&2&&A.f(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.dQ(b)
p=q[0]
o=q[1]
n=q[4]
m=q[5]
l=q[12]
k=q[13]
i.$flags&2&&A.f(i)
i[0]=c*p+e*o
i[1]=d*p+f*o
i[2]=c*n+e*m
i[3]=d*n+f*m
i[4]=c*l+e*k+g
i[5]=d*l+f*k+h},
bS(i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9=null
if(!i0.dZ(i1))return
s=k1?i3:h9
r=k6?255:i0.fO(i1,i2)
q=k3?i0.aQ(i1):255
if(r===0||q===0)return
if(!k6)p=k5&&r===255&&q===255
else p=!0
o=p?h9:i0.as
if(o!=null){n=i0.aq(i1)
if(n==null)return
m=B.c.R(A.el(n,j1,j3,j5))-1
l=B.c.R(A.em(n,j2,j4,j6))-1
k=B.c.U(A.ej(n,j1,j3,j5))+1
j=B.c.U(A.ek(n,j2,j4,j6))+1
i=Math.max(m,i7)
h=Math.max(l,i8)
g=Math.min(k,i9)
f=Math.min(j,j0)
if(i>=g||h>=f)return
p=o.a
e=o.b
d=B.c.D((j1*p+j3*e)*256)
c=B.c.D((j2*p+j4*e)*256)
e=-d
b=B.a.I(e,8)
p=-c
a=B.a.I(p,8)
a0=e&255
a1=p&255
a2=Math.max(0,Math.max(m,Math.min(i,i+b)))
a3=Math.max(0,Math.max(l,Math.min(h,h+a)))
p=a0===0?0:1
a4=Math.min(65535,Math.min(k,Math.max(g,g+b+p)))
p=a1===0?0:1
a5=Math.min(65535,Math.min(j,Math.max(f,f+a+p)))
a6=k4&&a2===i&&a3===h&&a4===g&&a5===f
a7=a4-a2
a8=a5-a3
a9=a6?i3:j8.aG(j9*3+2,a7*a8)
b0=a6?i4:a2
b1=a6?i5:a3
b2=a6?i6:a7
if(!a6){p=a7*a8
if(j8.b)A.kp(a9,p)
else B.f.T(a9.gt(),0,p,0)}p=a6?j9:j9+1
A.bS(i0,i1,255,a9,b0,b1,b2,a2,a3,a4,a5,j1,j2,j3,j4,j5,j6,j7,j8,p,k0,a6?k1:j8.b,0,!1,!1,!1,!0,!0)
b3=A.an(r*q)
if(!k5)b4=d===0&&c===0
else b4=!0
p=!1
if(!b4)if(k2===0)if(s!=null)if(b2===a7)if(b0===a2)if(b1===a3)p=(!a6||b3===255)&&A.nF(s,(h-i5)*i6+i-i4,i6,a9,a7,a8,i-a2,h-a3,g-i,f-h,b,a,a0,a1,(255-o.aL(16)<<16|255-o.aL(8)<<8|255-o.aL(0))>>>0,b3)
if(p)return
A.ms(o,b3,k2,a9.gt(),b0,b1,b2,new A.aS([a2,a3,a4,a5]),i3.gt(),i4,i5,i6,new A.aS([i,h,g,f]),b,a,a0,a1,a6,b4)
return}b5=k7?i0.at:h9
b6=b5==null?h9:b5.fg(i1)
b7=k5&&b6!=null&&b6>>>24===255?h9:b6
if(q!==255||b7!=null){p=b7==null
b3=p?q:A.an((b7>>>24)*q)
if(b3===0)return
n=i0.aq(i1)
if(n==null)return
i=Math.max(i7,B.c.R(A.el(n,j1,j3,j5))-1)
h=Math.max(i8,B.c.R(A.em(n,j2,j4,j6))-1)
g=Math.min(i9,B.c.U(A.ej(n,j1,j3,j5))+1)
f=Math.min(j0,B.c.U(A.ek(n,j2,j4,j6))+1)
a7=g-i
a8=f-h
if(a7<=0||a8<=0)return
e=a7*a8
a9=j8.aG(j9*3+2,e)
B.f.T(a9.gt(),0,e,0)
A.bS(i0,i1,i2,a9,i,h,a7,i,h,g,f,j1,j2,j3,j4,j5,j6,j7,j8,j9+1,k0,j8.b,0,!1,!1,k5,!1,!1)
b8=a9.gt()
b9=i3.gt()
c0=(h-i5)*i6+i-i4
for(e=b9.length,c1=k2===0,c2=b8.length,c3=b9.$flags|0,c4=0;c4<a8;++c4,c0+=i6)for(c5=c4*a7,c6=0;c6<a7;++c6){c7=c5+c6
if(!(c7>=0&&c7<c2))return A.a(b8,c7)
c8=b8[c7]
if(c8===0)continue
if(p)c9=A.ay(c8,b3)
else{d0=(c8>>>24)*b3+128
c9=A.ay((b7&16777215|4278190080)>>>0,B.a.I(d0+B.a.I(d0,8),8))}d1=c0+c6
if(c1){if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ab(c9,b9[d1])}else{if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ec(c9,b9[d1],k2)}c3&2&&A.f(b9)
if(!(d1>=0&&d1<e))return A.a(b9,d1)
b9[d1]=c7}return}if(i0.gdM()){for(c8=i0,d2=0;c8!=null;c8=c8.cy)++d2
if(d2===1){d3=j8.c2(j9)
A.eh(i0.a,i1,j1,j2,j3,j4,j5,j6,d3)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}else{e0=j8.dy
while(e0.length<d2)B.b.n(e0,h9)
e1=d2-1
for(c8=i0;c8!=null;c8=c8.cy,e1=e2){e2=e1-1
B.b.u(e0,e1,c8)}d3=j8.c2(j9)
for(d9=j6,d8=j5,d7=j4,d6=j3,d5=j2,d4=j1,d1=0;d1<d2;++d1){if(!(d1<e0.length))return A.a(e0,d1)
A.eh(e0[d1].a,i1,d4,d5,d6,d7,d8,d9,d3)
B.b.u(e0,d1,h9)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}}}else{d9=j6
d8=j5
d7=j4
d6=j3
d5=j2
d4=j1}e3=k0&&i0.gdO()
e4=i0.z
if(e4!=null&&i0.gfF()){e5=e3&&i0.gfI()?new A.bO([d4,d5,d6,d7,d8,d9,i7,i8,i9,j0]):h9
p=e5==null
e6=p?h9:j8.d6(i0,e5)
if(e6==null){e7=j8.cB(j9)
e7.l(0)
A.n_(e4,i1,d4,d5,d6,d7,d8,d9,i7,i8,i9,j0,e7,j8,j9)
if(!p)j8.d5(i0,e5,e7)}else if(j7==null&&e6.b!==0){e7=j8.cB(j9)
e7.dH(e6)}else e7=e6
if(e7.b===0)return
if(j7!=null){e8=j8.eh(j9)
A.hi(e7,j7,e8)
if(e8.b===0)return
e9=e8}else e9=e7
f0=Math.max(i7,e9.c)
f1=Math.max(i8,e9.d)
f2=Math.min(i9,e9.e)
f3=Math.min(j0,e9.f)
if(f0>=f2||f1>=f3)return}else{f3=j0
f2=i9
f1=i8
f0=i7
e9=j7}f4=i0.b
if(f4!=null)A.ka(f4,i1,r,i3,i4,i5,i6,f0,f1,f2,f3,d4,d5,d6,d7,d8,d9,e9,j8,j9+1,e3,k1,k2)
f5=i0.f
if(f5!=null){p=i0.x
if(p!=null){p=p.m(i1)
if(0>=p.length)return A.a(p,0)
p=p[0]
e=f5.f
e===$&&A.C()
c1=f5.d
c1===$&&A.C()
f6=p*e-c1}else f6=(i1-i0.r)/i0.w
p=f5.b
p===$&&A.C()
e=f5.c
e===$&&A.C()
if(Math.abs(d5)<1e-9&&Math.abs(d6)<1e-9){c1=d4>=0
i=B.c.R(d8+(c1?0:d4*p))
g=B.c.U(d8+(c1?d4*p:0))
p=d7>=0
h=B.c.R(d9+(p?0:d7*e))
f=B.c.U(d9+(p?d7*e:0))
f7=Math.max(f0,i)
f8=Math.max(f1,h)
f9=Math.min(f2,g)
g0=Math.min(f3,f)
if(f7<f9&&f8<g0)A.iS(f5,f6,r,i3,i4,i5,i6,f7,f8,f9,g0,d4,d5,d6,d7,d8,d9,e9,j8,j9+1,e3,k1)}else{c1=0+p
c2=0+e
g1=Math.max(f0,B.c.R(A.el(new A.a6(0,0,c1,c2),d4,d6,d8))-1)
g2=Math.max(f1,B.c.R(A.em(new A.a6(0,0,c1,c2),d5,d7,d9))-1)
g3=Math.min(f2,B.c.U(A.ej(new A.a6(0,0,c1,c2),d4,d6,d8))+1)
g4=Math.min(f3,B.c.U(A.ek(new A.a6(0,0,c1,c2),d5,d7,d9))+1)
if(g1<g3&&g2<g4){g5=g3-g1
c1=g5*(g4-g2)
g6=j8.aG(j9*3+2,c1)
B.f.T(g6.gt(),0,c1,0)
A.iS(f5,f6,r,g6,g1,g2,g5,g1,g2,g3,g4,d4,d5,d6,d7,d8,d9,h9,j8,j9+1,e3,!1)
c1=j8.as
c1.l(0)
c1.a3(!0)
c1.q(d8,d9)
c2=d4*p
p=d5*p
c1.q(c2+d8,p+d9)
c3=d6*e
e=d7*e
c1.q(c2+c3+d8,p+e+d9)
c1.q(c3+d8,e+d9)
c1.a0()
j8.aI(c1,!1,j8.gbM(),g1,g2,g3,g4)
g7=j8.gbM()
if(e9!=null){A.hi(j8.gbM(),e9,j8.gbk())
g7=j8.gbk()}g8=g7.b*2
g9=g7.a.gt()
h0=g6.gt()
b9=i3.gt()
for(p=h0.length,e=b9.length,c1=g9.length,c2=b9.$flags|0,e1=0;e1<g8;e1+=2){if(!(e1<c1))return A.a(g9,e1)
h1=g9[e1]
c3=e1+1
if(!(c3<c1))return A.a(g9,c3)
h2=g9[c3]
c4=h1>>>16
c6=h1&65535
h3=h2>>>8
h4=(h2&255)+1
h5=(c4-g2)*g5+(c6-g1)
h6=(c4-i5)*i6+(c6-i4)
for(c3=h4===256,h7=0;h7<h3;++h7){c5=h5+h7
if(!(c5>=0&&c5<p))return A.a(h0,c5)
c8=h0[c5]
if(c8!==0){h8=c3?c8:A.b5(c8,h4)
c5=h6+h7
if(!(c5>=0&&c5<e))return A.a(b9,c5)
c7=A.ab(h8,b9[c5])
c2&2&&A.f(b9)
b9[c5]=c7}}}}}}},
ms(c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=d1.a,c0=b9[0],c1=b9[1],c2=b9[2],c3=b9[3]
b9=d6.a
s=b9[0]
r=b9[1]
q=b9[2]
p=b9[3]
o=255-c4.aL(16)
n=255-c4.aL(8)
m=255-c4.aL(0)
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
if(b4!==0){a4=A.an(o*b4)
if(typeof a4!=="number")return A.Z(a4)
a4=A.an((a5>>>16&255)*(255-a4))
if(typeof a4!=="number")return a4.a8()
b5=A.an(n*b4)
if(typeof b5!=="number")return A.Z(b5)
b5=A.an((a5>>>8&255)*(255-b5))
if(typeof b5!=="number")return b5.a8()
b6=A.an(m*b4)
if(typeof b6!=="number")return A.Z(b6)
b6=A.an((a5&255)*(255-b6))
if(typeof b6!=="number")return A.Z(b6)
a5=(a5&4278190080|a4<<16|b5<<8|b6)>>>0}}b7=a0+a3
if(e1){d2.$flags&2&&A.f(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a5}else{if(k)a5=A.ay(a5,c5)
if(l){if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ab(a5,d2[b7])}else{if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ec(a5,d2[b7],c6)}d2.$flags&2&&A.f(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a4}}}if(e1&&k)for(f=r;f<p;++f){b8=(f-d4)*d5-d3
for(a3=s;a3<q;++a3){l=b8+a3
if(!(l>=0&&l<b9))return A.a(d2,l)
k=A.ay(d2[l],c5)
d2.$flags&2&&A.f(d2)
d2[l]=k}}},
n_(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.ej(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.A(0.25/e,0.005,1.5),c=new A.hR(b1.ei(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.b.gae(a).gc8())c.$2(B.b.gae(a),b0)
else{s=b1.al(0)
r=b1.al(1)
q=b1.al(2)
for(p=a.length,o=a8-a6,n=!1,m=0;m<a.length;a.length===p||(0,A.W)(a),++m){l=a[m]
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
j=l.c.m(b)
if(0>=j.length)return A.a(j,0)
i=B.a.A(B.c.D(j[0]*2.56),0,256)
if(i!==256)s.e4(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aK(g,a6,o,256)
if(j){s.aS(r)
A.d_(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aS(s)
else if(j)A.d_(q,s,b0,k)
else{b0.aS(r)
A.d_(r,s,b0,k)}n=!0}}},
my(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.f(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.k_(a,Math.abs(b),2,2,4,c,d,e)},
ka(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gcf())s=c
else{r=f.e.m(b)
if(0>=r.length)return A.a(r,0)
s=B.a.A(B.c.D(c*B.c.D(r[0])/100),0,255)}if(s===0)return
if(!f.gaz()){q=b3.c2(b4)
A.eh(f,b,a6,a7,a8,a9,b0,b1,q)
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
p=a6}j=b5&&f.gaN()
i=a.gb4()
for(h=i.length-1,r=b4+1;h>=0;--h){if(!(h<i.length))return A.a(i,h)
g=i[h]
if(g instanceof A.a_)A.ka(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.b4)A.n2(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
n2(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.m(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.a.A(B.c.D(c0*B.c.D(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gc3())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gF()
b7=b7!==!1
r=b7}b8.id!==$&&A.M()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.bO([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.d6(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.b.an(b8.a,A.j3())
b8.fx!==$&&A.M()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.aY(b9)
if(l==null)return
n=[Math.max(c5,B.c.R(A.el(l,c9,d1,d3))-2),Math.max(c6,B.c.R(A.em(l,d0,d2,d4))-2),Math.min(c7,B.c.U(A.ej(l,c9,d1,d3))+2),Math.min(c8,B.c.U(A.ek(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gc1()
m=b8.a
A.hQ(m,0,m.length,b9,new A.bP([c9,d0,d1,d2,d3,d4]),new A.aS(n),b8.f,o,d6,0)}else{l=A.mZ(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
d6.aI(d6.ax,g,d6.gc1(),k,j,i,h)
o=d6.gc1()}if(!b7&&o.b>0)d6.d5(b8,p,o)}if(d5!=null){A.hi(o,d5,d6.gbk())
o=d6.gbk()}if(o.b===0)return
f=d8?c1:b6
e=b8.y
if(e==null){d=b8.b.m(b9)
b7=d.length
if(0>=b7)return A.a(d,0)
n=B.a.A(B.c.D(d[0]*255),0,255)
if(1>=b7)return A.a(d,1)
m=B.a.A(B.c.D(d[1]*255),0,255)
if(2>=b7)return A.a(d,2)
c=A.jL(s,n,m,B.a.A(B.c.D(d[2]*255),0,255))
if(d9===0)A.jK(c1.gt(),c2,c3,c4,o,c,f)
else A.lX(c1.gt(),c2,c3,c4,o,c,d9,f)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.mw(e,b9,d6)
a7=e.d.m(b9)
a8=e.e.m(b9)
if(e.gfH()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=e.fC(b9,a9,b0)
if(b1!=null){A.mz(c1.gt(),c2,c3,c4,o,a6.gt(),s,new A.bP([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
return}}b7=!1
if(f!=null)if($.j!=null){b7=o.a
n=o.b
m=e.w
b2=a7.length
if(0>=b2)return A.a(a7,0)
b3=a7[0]
if(1>=b2)return A.a(a7,1)
b2=a7[1]
b4=a8.length
if(0>=b4)return A.a(a8,0)
b5=a8[0]
if(1>=b4)return A.a(a8,1)
b5=A.nE(f,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
b7=b5}if(b7)return
b7=a7.length
n=a8.length
if(e.w){m=c1.gt()
b2=a6.gt()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.m_(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gt()
b2=a6.gt()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.lZ(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
mz(b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=c0.a,a1=a0[0],a2=a0[1],a3=a0[2],a4=a0[3],a5=a0[4],a6=a0[5],a7=c4.a,a8=c4.b,a9=1-a7*a7-a8*a8,b0=a1/c3,b1=a2/c3,b2=b7.a.gt()
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
i=b>=1?1023:B.c.W(b*1023+0.5)
if(!(i>=0&&i<r))return A.a(b8,i)
a=b8[i]
if(s)a=A.ay(a,b9)
if(n)a=A.b5(a,j)
if(!(d>=0&&d<a0))return A.a(b3,d)
i=A.ab(a,b3[d])
b3.$flags&2&&A.f(b3)
b3[d]=i}}},
d9(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aH){s=a.c
if(s===$){r=a.b!==1||B.b.an(a.a,A.j3())
a.c!==$&&A.M()
a.c=r
s=r}q=s
break A}if(a instanceof A.a_){s=a.r
if(s===$){r=B.b.an(a.a,A.j3())
a.r!==$&&A.M()
a.r=r
s=r}q=s
break A}if(a instanceof A.P){q=A.d9(a.a)
break A}q=!1
break A}return q},
hQ(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.d9(a[b])}else s=!1
if(s){if(!(b<a.length))return A.a(a,b)
A.ei(a[b],d,e,a0,a1,a2,a3,a4)
return}s=e.a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
n=s[4]
m=s[5]
l=a3.ax
l.l(0)
for(k=b;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.d9(j))A.bm(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.l(0)
else{s=a0.a
a3.aI(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.d9(j))continue
if(a2.b===0)A.ei(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.al(i)
A.ei(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.al(h)
f.aS(a2)
A.d_(f,g,a2,a1?5:2)}}},
ei(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
A:{s=a0 instanceof A.a_
r=s?a0:null
if(s){s=a2.a
q=s[0]
p=s[1]
o=s[2]
n=s[3]
m=s[4]
l=s[5]
s=r.c
if(!s.gaz()){k=a6.cT(a7)
A.eh(s,a1,q,p,o,n,m,l,k)
a2=new A.bP([k[0],k[1],k[2],k[3],k[4],k[5]])}s=r.a
A.hQ(s,0,s.length,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.P
j=s?a0:null
if(s){A.ei(j.a,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.aH
i=s?a0:null
if(s){h=i.a
s=i.b
if(s===1){A.hQ(h,0,h.length,a1,a2,a3,a4,a5,a6,a7+1)
return}g=a7*2
f=a6.al(g)
e=a6.al(g+1)
d=a7+1
A.hQ(h,0,h.length-1,a1,a2,a3,!1,f,a6,d)
if(f.b===0)c=s===3||s===4
else c=!1
if(c){a5.l(0)
return}b=B.b.gac(h)
if(A.d9(b))A.ei(b,a1,a2,a3,!1,e,a6,d)
else{d=a2.a
q=d[0]
p=d[1]
o=d[2]
n=d[3]
m=d[4]
l=d[5]
a=a6.ax
a.l(0)
A.bm(b,a1,q,p,o,n,m,l,0.0625,a,a6,0,0)
d=a3.a
a6.aI(a,!1,e,d[0],d[1],d[2],d[3])}A.d_(f,e,a5,s)
break A}throw A.d(A.at("Expected a boolean path"))}},
mZ(a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=null,a6=a7.e
if(a6){s=a7.d.m(a8)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a5}else r=0
q=a7.aY(a8)
if(q==null)return a5
s=B.c.R(A.el(q,b3,b5,b7))
p=B.c.R(A.em(q,b4,b6,b8))
o=B.c.U(A.ej(q,b3,b5,b7))
n=B.c.U(A.ek(q,b4,b6,b8))
m=Math.max(a9,s-2)
l=Math.max(b0,p-2)
k=Math.min(b1,o+2)
j=Math.min(b2,n+2)
if(m>=k||l>=j)return a5
i=a7.go
if(i===$){h=a7.f3()
a7.go!==$&&A.M()
a7.go=h
i=h}if(i!=null){g=b9.da(i,a8)
if(g.r===0)return a5
a6=b9.ax
a6.l(0)
a6.aC(g,b3,b4,b5,b6,b7,b8)
return new A.aS([m,l,k,j])}f=Math.max(Math.sqrt(b3*b3+b4*b4),Math.sqrt(b5*b5+b6*b6))
e=f<=0.000001?0.25:B.c.A(0.25/f,0.005,1.5)
d=e*e
c=b9.as
c.l(0)
b=a7.a
for(a=b.length-1;a>=0;--a){if(!(a<b.length))return A.a(b,a)
A.bm(b[a],a8,1,0,0,1,0,0,d,c,b9,0,0)}if(c.r===0)return a5
a0=a7.z
if(a0!=null){a1=b9.at
a1.l(0)
A.mi(c,a0,a8,a1,b9.fx)
if(a1.r===0)return a5
a2=a1}else a2=c
if(a6){a3=b9.ay
a3.l(0)
A.k_(a2,r*0.5,a7.r,a7.w,a7.x,e,a3,b9.gdc())
if(a3.r===0)return a5
a2=a3}a4=b9.ax
a4.l(0)
a4.aC(a2,b3,b4,b5,b6,b7,b8)
return new A.aS([m,l,k,j])},
mw(a,b,c){var s,r,q
if(a.c.a!=null){s=c.p4
r=s.h(0,a)
if(r!=null)return r
if(s.a>=256)s.K(0,new A.T(s,s.$ti.i("T<1>")).ga6(0)).a4()
q=A.eR(1024)
s.u(0,a,q)
A.k2(a,b,q.gt())
return q}q=c.R8
if(q==null)q=c.R8=A.eR(1024)
A.k2(a,b,q.gt())
return q},
k2(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a6.c.m(a7),a4=a6.a,a5=a6.x
for(s=a3.length,r=0;r<a4;++r){q=4*r
p=3*r
o=q+1
if(!(o<s))return A.a(a3,o)
o=A.hu(a3[o])
a5.$flags&2&&A.f(a5)
n=a5.length
if(!(p<n))return A.a(a5,p)
a5[p]=o
o=p+1
m=q+2
if(!(m<s))return A.a(a3,m)
m=A.hu(a3[m])
a5.$flags&2&&A.f(a5)
if(!(o<n))return A.a(a5,o)
a5[o]=m
m=p+2
o=q+3
if(!(o<s))return A.a(a3,o)
o=A.hu(a3[o])
a5.$flags&2&&A.f(a5)
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
d=e<=1e-12?0:B.c.A((j-f)/e,0,1)
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
a1=A.jL(B.a.A(B.c.D(a6.er(a3,j)*255),0,255),B.a.A(B.c.D((m+(g-m)*d)*255),0,255),B.a.A(B.c.D((a+(a0-a)*d)*255),0,255),B.a.A(B.c.D((a1+(a2-a1)*d)*255),0,255))
a8.$flags&2&&A.f(a8)
if(!(k<a8.length))return A.a(a8,k)
a8[k]=a1}},
bm(a,b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g
while(a instanceof A.P)a=a.a
if(a instanceof A.a_){s=a.c
if(!s.gaz()){r=a4.cT(a6)
A.eh(s,b,c,d,e,f,a0,a1,r)
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
A.bm(s[k],b,q,p,o,n,m,l,a2,a3,a4,a5,j)}return}if(a instanceof A.b6){i=A.mx(a.a,a.b,b,A.k8(c,d,e,f,a2),a4,a5,a6)
if(i!=null&&i.r>0)a3.aC(i,c,d,e,f,a0,a1)
return}if(a instanceof A.aH){if(a.b===3&&a.a.length>=2){for(s=a.a,k=0;k<s.length-1;++k)A.bm(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
h=a4.el(a6)
A.bm(B.b.gac(s),b,c,d,e,f,a0,a1,a2,h,a4,a5,a6+1)
a3.ff(h)
return}for(s=a.a,k=0;k<s.length;++k)A.bm(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
return}if(a.ga5()){a3.aC(a4.da(a,b),c,d,e,f,a0,a1)
return}if(c===1&&d===0&&e===0&&f===1&&a0===0&&a1===0)A.hN(a,b,a2,a3)
else{g=a4.ch
g.l(0)
A.hN(a,b,A.k8(c,d,e,f,a2),g)
a3.aC(g,c,d,e,f,a0,a1)}},
k8(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
hN(c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0
if(c1 instanceof A.au){s=c1.e
r=s.m(c2)
q=r.length
p=q/6|0
if(p===0)return
o=c1.f
n=c1.r
if(n.length!==0){m=s.b.a
if(c2<=B.i.ga6(m)){l=B.b.ga6(n).a
o=l}else if(c2>=B.i.gac(m)){l=B.b.gac(n).a
o=l}else{s=s.r
if(!(s<n.length))return A.a(n,s)
k=n[s]
j=k.a
i=k.b
l=j&&i
o=j}}else l=o
c4.a3(o)
if(0>=q)return A.a(r,0)
s=r[0]
if(1>=q)return A.a(r,1)
c4.q(s,r[1])
h=r[0]
g=r[1]
f=l?p:p-1
for(e=1;e<=f;++e,g=a3,h=a2){d=(e-1)*6
c=B.a.M(e,p)*6
s=d+4
if(!(s>=0&&s<q))return A.a(r,s)
b=r[s]
s=d+5
if(!(s>=0&&s<q))return A.a(r,s)
a=r[s]
s=c+2
if(!(s<q))return A.a(r,s)
a0=r[s]
s=c+3
if(!(s<q))return A.a(r,s)
a1=r[s]
if(!(c<q))return A.a(r,c)
a2=r[c]
s=c+1
if(!(s<q))return A.a(r,s)
a3=r[s]
if(Math.abs(b)<=0.0001&&Math.abs(a)<=0.0001&&Math.abs(a0)<=0.0001&&Math.abs(a1)<=0.0001)c4.q(a2,a3)
else{if(!(d>=0&&d<q))return A.a(r,d)
s=r[d]
n=d+1
if(!(n<q))return A.a(r,n)
c4.Y(h,g,s+b,r[n]+a,a2+a0,a3+a1,a2,a3,c3)}}c4.a0()
return}if(c1 instanceof A.aQ){c4.a3(!0)
s=c4.gfe()
c1.eL(c2,s,s,new A.hO(c4,c3),c4.gfz())
return}if(c1 instanceof A.aJ){d=c1.r.m(c2)
a4=c1.w.m(c2)
s=d.length
if(0>=s)return A.a(d,0)
a5=d[0]
if(1>=s)return A.a(d,1)
a6=d[1]
s=a4.length
if(0>=s)return A.a(a4,0)
a7=a4[0]*0.5
if(1>=s)return A.a(a4,1)
a8=a4[1]*0.5
if(c1.e){a9=a7*0.5522847498307936
b0=a8*0.5522847498307936
c4.a3(!0)
s=a6-a8
c4.q(a5,s)
q=a5+a9
n=a5+a7
m=a6-b0
b1=a6+b0
b2=a6+a8
b3=a5-a9
b4=a5-a7
if(!c1.f){c4.Y(a5,s,q,s,n,m,n,a6,c3)
c4.Y(n,a6,n,b1,q,b2,a5,b2,c3)
c4.Y(a5,b2,b3,b2,b4,b1,b4,a6,c3)
c4.Y(b4,a6,b4,m,b3,s,a5,s,c3)}else{c4.Y(a5,s,b3,s,b4,m,b4,a6,c3)
c4.Y(b4,a6,b4,b1,b3,b2,a5,b2,c3)
c4.Y(a5,b2,q,b2,n,b1,n,a6,c3)
c4.Y(n,a6,n,m,q,s,a5,s,c3)}c4.a0()
return}s=c1.x.m(c2)
if(0>=s.length)return A.a(s,0)
b5=B.c.A(s[0],0,Math.min(Math.abs(a7),Math.abs(a8)))
if(b5<=0.0001){c4.a3(!0)
s=a5+a7
q=a6-a8
c4.q(s,q)
n=a6+a8
m=a5-a7
if(!c1.f){c4.q(s,n)
c4.q(m,n)
c4.q(m,q)}else{c4.q(m,q)
c4.q(m,n)
c4.q(s,n)}c4.a0()
return}b6=b5*0.5522847498307936
c4.a3(!0)
s=a5+a7
q=a6-a8
n=q+b5
c4.q(s,n)
m=a6+a8
b1=s-b5
b2=a5-a7
b3=n-b6
b4=m-b5
b7=b1+b6
b8=b2+b5
if(!c1.f){c4.q(s,b4)
b9=b4+b6
c4.Y(s,b4,s,b9,b7,m,b1,m,c3)
c4.q(b8,m)
c0=b8-b6
c4.Y(b8,m,c0,m,b2,b9,b2,b4,c3)
c4.q(b2,n)
c4.Y(b2,n,b2,b3,c0,q,b8,q,c3)
c4.q(b1,q)
c4.Y(b1,q,b7,q,s,b3,s,n,c3)}else{c4.Y(s,n,s,b3,b7,q,b1,q,c3)
c4.q(b8,q)
b9=b8-b6
c4.Y(b8,q,b9,q,b2,b3,b2,n,c3)
c4.q(b2,b4)
n=b4+b6
c4.Y(b2,b4,b2,n,b9,m,b8,m,c3)
c4.q(b1,m)
c4.Y(b1,m,b7,m,s,n,s,b4,c3)}c4.a0()}},
mx(a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a1.a,a0=a.length
if(a2>=a0)return null
s=a1.b.m(a3)
if(0>=s.length)return A.a(s,0)
r=B.c.A(s[0],0,100)/100
s=a1.c.m(a3)
if(0>=s.length)return A.a(s,0)
q=B.c.A(s[0],0,100)/100
p=Math.abs(q-r)
if(p<0.000001)return null
if(!(a2<a.length))return A.a(a,a2)
o=a[a2]
n=a5.eo(a6)
s=a6+1
A.bm(o,a3,1,0,0,1,0,0,a4,n,a5,s,a7)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a1.d.m(a3)
if(0>=l.length)return A.a(l,0)
k=B.c.M(m+l[0]/360,1)
j=k+p
i=a5.em(a6,a0)
for(m=i.$flags|0,h=0,g=0,f=0;f<a0;++f){if(!(f<a.length))return A.a(a,f)
l=a[f]
e=A.mU(l,a3,a4,a5,f===a2?n:null,s,a7)
m&2&&A.f(i)
if(!(f<i.length))return A.a(i,f)
i[f]=e
if(f<a2)g+=e
h+=e}a=a1.e
if(a)d=h
else{if(!(a2<i.length))return A.a(i,a2)
d=i[a2]}c=a?g:0
b=a5.en(a6)
a=a5.fx
A.k1(n,k*d-c,Math.min(j,1)*d-c,b,a)
if(j>1)A.k1(n,-c,(j-1)*d-c,b,a)
return b},
mU(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga5()){s=d.p3.h(0,a)
if(s!=null)return s}r=A.dU()
if(e!=null)r.sdJ(e)
else{r.sdJ(d.ek(f))
A.bm(a,b,1,0,0,1,0,0,c,r.am(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.u(A.ag(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.u(A.ag(""))
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
if(o===r)A.u(A.ag(""))
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
q+=Math.sqrt(n*n+o*o)}}++p}if(a.ga5()){o=d.p3
if(o.a>=256)o.l(0)
o.u(0,a,q)}return q},
k1(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
k=a7.aM(l+1)
k.$flags&2&&A.f(k)
q=k.length
if(0>=q)return A.a(k,0)
k[0]=0
for(j=0;j<l;j=h){i=p+j
h=j+1
g=p+B.a.M(h,n)
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
k.$flags&2&&A.f(k)
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
a6.q(q,f[a2])}a6.a0()}else A.k0(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
k0(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.a.I(r+a,1)
p=q+1
if(!(p<s))return A.a(a4,p)
if(a4[p]<=a6)r=p
else a=q}a8.a3(!1)
o=a1+r
p=r+1
n=a1+B.a.M(p,a2)
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
a8.q(j+(p-j)*k,h+(m[n]-h)*k)
for(g=r;g<a5;g=f){f=g+1
if(!(f<s))return A.a(a4,f)
e=a4[f]
d=a1+g
c=a1+B.a.M(f,a2)
if(a7<=e+1e-9){if(!(g<s))return A.a(a4,g)
p=a4[g]
b=e-p
s=b<=1e-12?0:B.c.A((a7-p)/b,0,1)
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
a8.q(j+(p-j)*s,h+(m[c]-h)*s)
break}p=a0.a
if(!(c>=0&&c<p.length))return A.a(p,c)
p=p[c]
m=a0.b
if(!(c<m.length))return A.a(m,c)
a8.q(p,m[c])}a8.a0()},
mi(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
for(s=0,r=0;r<a9;++r){q=(r&1)===0?1:0.1
if(!(r<a8.length))return A.a(a8,r)
p=a8[r].m(b3)
if(0>=p.length)return A.a(p,0)
o=Math.max(q,p[0])
b0.$flags&2&&A.f(b0)
if(!(r<b0.length))return A.a(b0,r)
b0[r]=o
s+=o}if(s<=0)return
a8=b2.b.m(b3)
if(0>=a8.length)return A.a(a8,0)
n=B.c.M(a8[0],s)
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
f=b5.aM(g+1)
f.$flags&2&&A.f(f)
q=f.length
if(0>=q)return A.a(f,0)
f[0]=0
for(e=0;e<g;e=c){d=j+e
c=e+1
b=j+B.a.M(c,i)
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
f.$flags&2&&A.f(f)
if(!(c<q))return A.a(f,c)
f[c]=p+a1}if(!(g<q))return A.a(f,g)
a3=f[g]
if(a3<=1e-7)continue
a4=b0[l]-m
for(q=a3-1e-7,a5=l,a6=0;a6<q;a6=a7){a7=Math.min(a3,a6+a4)
if((a5&1)===0&&a7>a6+1e-7)A.k0(b1,j,i,h,f,g,a6,a7,b4)
a5=(a5+1)%a9
if(!(a5<a8))return A.a(b0,a5)
a4=b0[a5]}}},
k_(e4,e5,e6,e7,e8,e9,f0,f1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3
if(e5<=0)return
s=e8*e8
r=new A.hM(new A.hL(e5,Math.max(0.12,e9*0.5),f0),f0,e5)
for(q=e6===2,p=e6===3,o=f1.c,n=f1.d,m=f1.a,l=f1.b,k=0;k<e4.r;++k){j=e4.c
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
e=m.aM(g)
d=l.aM(g)
for(j=e4.a,c=j.length,b=e4.b,a=b.length,a0=e.length,a1=d.length,a2=e.$flags|0,a3=d.$flags|0,a4=i,a5=0;a4<h;++a4){if(!(a4>=0&&a4<c))return A.a(j,a4)
a6=j[a4]
if(!(a4<a))return A.a(b,a4)
a7=b[a4]
if(a5!==0){a8=a5-1
if(!(a8>=0&&a8<a0))return A.a(e,a8)
a9=e[a8]
if(!(a8<a1))return A.a(d,a8)
a8=Math.abs(a6-a9)+Math.abs(a7-d[a8])>=0.000001}else a8=!0
if(a8){a2&2&&A.f(e)
if(!(a5<a0))return A.a(e,a5)
e[a5]=a6
b0=a5+1
a3&2&&A.f(d)
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
if(q){f0.a3(!0)
f0.q(b1+e5,b2)
r.$6(b1,b2,1,0,0,1)
r.$6(b1,b2,0,1,-1,0)
r.$6(b1,b2,-1,0,0,-1)
r.$6(b1,b2,0,-1,1,0)
f0.a0()}else if(p){f0.a3(!0)
j=b1-e5
c=b2-e5
f0.q(j,c)
b=b1+e5
f0.q(b,c)
c=b2+e5
f0.q(b,c)
f0.q(j,c)
f0.a0()}continue}b3=f?a5:a5-1
b4=o.aM(b3)
b5=n.aM(b3)
for(j=b4.$flags|0,c=b5.$flags|0,b6=0;b6<b3;b6=b7){b7=b6+1
b8=B.a.M(b7,a5)
if(!(b8>=0&&b8<a0))return A.a(e,b8)
b=e[b8]
if(!(b6<a0))return A.a(e,b6)
b9=b-e[b6]
if(!(b8<a1))return A.a(d,b8)
b=d[b8]
if(!(b6<a1))return A.a(d,b6)
c0=b-d[b6]
c1=Math.sqrt(b9*b9+c0*c0)
if(c1>1e-9){j&2&&A.f(b4)
if(!(b6<b4.length))return A.a(b4,b6)
b4[b6]=b9/c1
c&2&&A.f(b5)
if(!(b6<b5.length))return A.a(b5,b6)
b5[b6]=c0/c1}else{j&2&&A.f(b4)
if(!(b6<b4.length))return A.a(b4,b6)
b4[b6]=0
c&2&&A.f(b5)
if(!(b6<b5.length))return A.a(b5,b6)
b5[b6]=0}}c2=new A.hK(b4,b5,e5,f0,e7,s,r)
if(f){f0.a3(!0)
for(c3=0;c3<a5;++c3){c4=B.a.M(c3-1+b3,b3)
if(!(c3<a0))return A.a(e,c3)
j=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c4,c3,j,d[c3],!1)}f0.a0()
f0.a3(!0)
for(c3=a5-1;c3>=0;c3=c5){c5=c3-1
c6=B.a.M(c5+b3,b3)
if(!(c3<a0))return A.a(e,c3)
j=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c3,c6,j,d[c3],!0)}f0.a0()}else{f0.a3(!0)
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
if(p)f0.q(c7-a2,c8-e5*b)
else f0.q(c7,c8)
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
f0.q(d4+b,d5+j)
f0.q(d6+b,d7+j)}else if(q){f0.q(d4,d5)
r.$6(d0,d1,j,d2,d2,d3)
r.$6(d0,d1,d2,d3,d3,-d2)}else{f0.q(d4,d5)
f0.q(d6,d7)}for(c3=a5-2;c3>=1;c3=c5){c5=c3-1
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
if(p)f0.q(e2-c,e3-e5*e1)
else if(q){f0.q(e2,e3)
c=-e0
r.$6(d8,d9,e1,c,c,j)
r.$6(d8,d9,c,j,j,e0)}else f0.q(e2,e3)
f0.a0()}}},
bU(a,b){var s,r,q,p,o
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
return new A.a6(s,r,q,p>o?p:o)},
iL(a,b,c,d,e,f,g,h,i){return new A.bQ(a,b,c,d,e,f,g,h,i)},
m3(){var s=null,r=t.n
return A.iL(A.cf(A.h([0,0],r)),A.cf(A.h([0,0],r)),A.cf(A.h([100,100],r)),A.cf(A.h([0],r)),A.cf(A.h([100],r)),s,s,s,s)},
iM(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
ed(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
jB(a,b,c){return new A.h5(a,b,c)},
jC(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.aa(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
iF(a,b,c){return new A.a_(a,b,c)},
lM(a,b){return new A.aH(a,b)},
hP(a,b,c){if(c>0)return new A.F(a,-b)
if(c<0)return new A.F(-a,b)
return B.aA},
iH(a,b,c,d,e,f,g,h,i,j,k){return new A.b4(a,b,c,d,e,f,g,h,i,k,j)},
cf(a){var s=new Float32Array(A.R(a))
return new A.z(s,null,!1,new Float32Array(0),!1)},
m2(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
m1(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
hu(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.R(s)
if(r>=4096)return 1
q=$.kK()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
b:function b(a,b){this.a=a
this.b=b},
bF:function bF(a,b){var _=this
_.a=a
_.r=_.f=_.e=_.d=_.c=_.b=$
_.w=b
_.x=1
_.y=!1
_.z=$},
fs:function fs(a){this.a=a},
fi:function fi(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fj:function fj(a,b,c){this.a=a
this.b=b
this.c=c},
fh:function fh(a){this.a=a},
fo:function fo(a,b,c){this.a=a
this.b=b
this.c=c},
fp:function fp(a,b,c){this.a=a
this.b=b
this.c=c},
fq:function fq(a,b,c){this.a=a
this.b=b
this.c=c},
fn:function fn(a){this.a=a},
fl:function fl(){},
fm:function fm(){},
fk:function fk(a,b){this.a=a
this.b=b},
fr:function fr(){},
hj:function hj(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
e_:function e_(a){this.b=a},
fM:function fM(a){this.a=a},
fN:function fN(a,b){this.a=a
this.b=b},
fG:function fG(a,b){this.a=a
this.b=b},
fH:function fH(a,b){this.a=a
this.b=b},
fI:function fI(a,b){this.a=a
this.b=b},
fJ:function fJ(a,b){this.a=a
this.b=b},
fK:function fK(a,b){this.a=a
this.b=b},
fL:function fL(a,b){this.a=a
this.b=b},
fA:function fA(a,b){this.a=a
this.b=b},
fC:function fC(a,b){this.a=a
this.b=b},
fB:function fB(a,b){this.a=a
this.b=b},
fO:function fO(a,b){this.a=a
this.b=b},
fz:function fz(a,b){this.a=a
this.b=b},
fE:function fE(a,b){this.a=a
this.b=b},
fD:function fD(a,b){this.a=a
this.b=b},
fF:function fF(a,b){this.a=a
this.b=b},
bK:function bK(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
P:function P(a){this.a=a},
b6:function b6(a,b){this.a=a
this.b=b},
bR:function bR(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$
_.as=f},
hv:function hv(){},
c9:function c9(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
ft:function ft(){},
bC:function bC(a){this.a=a},
i9:function i9(a,b,c){this.a=a
this.b=b
this.c=c},
ia:function ia(a){this.a=a},
ib:function ib(a,b,c){this.a=a
this.b=b
this.c=c},
id:function id(a,b,c){this.a=a
this.b=b
this.c=c},
ic:function ic(a,b,c){this.a=a
this.b=b
this.c=c},
ie:function ie(a,b){this.a=a
this.b=b},
i8:function i8(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
eW:function eW(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5){var _=this
_.b=a
_.d=null
_.f=_.e=!1
_.r=b
_.w=0
_.Q=_.z=_.y=_.x=null
_.as=c
_.at=d
_.ax=e
_.ay=f
_.ch=g
_.CW=h
_.cx=i
_.cy=j
_.db=k
_.dx=l
_.dy=m
_.fr=n
_.fx=o
_.fy=null
_.go=p
_.id=q
_.k1=r
_.k2=s
_.k3=a0
_.k4=a1
_.p1=_.ok=0
_.p2=a2
_.p3=a3
_.p4=a4
_.R8=null
_.RG=a5},
bI:function bI(a){this.a=a},
aw:function aw(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
dW:function dW(a,b,c){this.a=a
this.b=b
this.c=c},
ax:function ax(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
fP:function fP(a,b,c,d,e,f){var _=this
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
hp:function hp(){},
ho:function ho(a,b,c){this.a=a
this.b=b
this.c=c},
hr:function hr(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hR:function hR(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
hO:function hO(a,b){this.a=a
this.b=b},
hm:function hm(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hL:function hL(a,b,c){this.a=a
this.b=b
this.c=c},
hM:function hM(a,b,c){this.a=a
this.b=b
this.c=c},
hK:function hK(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
bQ:function bQ(a,b,c,d,e,f,g,h,i){var _=this
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
a2:function a2(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$},
h5:function h5(a,b,c){this.a=a
this.b=b
this.c=c},
dZ:function dZ(a,b){this.a=a
this.b=b},
fy:function fy(){},
aa:function aa(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
_.fx=_.fr=_.dy=_.dx=_.db=$
_.fy=null
_.go=0/0},
hc:function hc(){},
ha:function ha(){},
hb:function hb(){},
hd:function hd(){},
a_:function a_(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.r=_.f=_.e=_.d=$
_.Q=_.z=null
_.at=_.as=0/0
_.ay=_.ax=$},
h1:function h1(){},
h3:function h3(){},
h4:function h4(){},
h2:function h2(){},
aH:function aH(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
hf:function hf(){},
he:function he(){},
e1:function e1(){},
au:function au(a,b,c){var _=this
_.e=a
_.f=b
_.r=c
_.c=null
_.d=0/0},
aJ:function aJ(a,b,c,d,e){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.c=null
_.d=0/0},
aQ:function aQ(a,b,c,d,e,f,g,h,i){var _=this
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
b4:function b4(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
hn:function hn(){},
h8:function h8(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
h9:function h9(){},
z:function z(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
e8:function e8(a,b){this.a=a
this.b=b},
a6:function a6(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iZ(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.W)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.q(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.b8(o)){n=o
break A}n=A.u(A.aC("Unsupported raster worker field",null))}l.push(n)}return new A.F(l,m)},
nn(b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8=null
A:{s=t.e6.b(b9)
r=b8
q=b8
p=!1
o=b8
n=!1
m=b8
l=!1
k=b8
j=!1
i=b8
h=!1
g=b8
f=b8
e=b8
d=b8
c=b8
b=!1
if(s){a=b9.a
a0=a[0]
a1=0===a0
if(a1){r=a[1]
p=A.q(r)
if(p){A.k(r)
q=a[2]
n=typeof q=="string"
if(n){A.G(q)
o=a[3]
a2=t.p
l=a2.b(o)
if(l){a2.a(o)
m=a[4]
j=A.b8(m)
if(j){A.bn(m)
k=a[5]
h=A.q(k)
if(h){A.k(k)
i=a[6]
b=A.q(i)
c=k}d=m}e=o}f=q}g=r}}}else{a0=b8
a1=!1}if(b){b=[0,g,f,e,d,c,A.k(h?i:b9.a[6])]
break A}a3=b8
a4=!1
g=b8
f=b8
a5=b8
a6=b8
e=b8
d=b8
a7=b8
c=b8
a8=b8
a9=b8
b=!1
if(t.r.b(b9)){b0=!0
b1=!0
if(s)a=a0
else{a0=b9.a[0]
a=a0
s=!0}if(4===a){if(a1)a=r
else{r=b9.a[1]
a=r
a1=b0}if(A.q(a)){if(a1)a=r
else{r=b9.a[1]
a=r
a1=b0}A.k(a)
if(p)a2=q
else{q=b9.a[2]
a2=q
p=b1}if(typeof a2=="string"){if(p)a2=q
else{q=b9.a[2]
a2=q
p=b1}A.G(a2)
if(n)b2=o
else{o=b9.a[3]
b2=o
n=!0}if(A.q(b2)){a5=A.k(n?o:b9.a[3])
if(l)b2=m
else{m=b9.a[4]
b2=m
l=!0}if(A.q(b2)){a6=A.k(l?m:b9.a[4])
if(j)b2=k
else{k=b9.a[5]
b2=k
j=!0}b3=t.p
if(b3.b(b2)){e=b3.a(j?k:b9.a[5])
if(h)b2=i
else{i=b9.a[6]
b2=i
h=!0}if(A.q(b2)){d=A.k(h?i:b9.a[6])
b2=b9.a
b4=b2[7]
if(A.q(b4)){A.k(b4)
b5=b2[8]
if(A.q(b5)){A.k(b5)
b6=b2[9]
if(A.q(b6)){A.k(b6)
b7=b2[10]
a4=A.q(b7)
if(a4){A.k(b7)
a3=b2[11]
b=A.q(a3)
a9=b7}a8=b6}c=b5}a7=b4}}}}}f=a2}g=a}}}if(b){b=[4,g,f,a5,a6,e,d,a7,c,a8,a9,A.k(a4?a3:b9.a[11])]
break A}b=t.W.b(b9)
g=b8
a=!1
if(b){b0=!0
if(s)a2=a0
else{a0=b9.a
a2=a0
s=!0}if(1===a2){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}if(A.q(a2)){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}A.k(a2)
if(p)a=q
else{q=b9.c
a=q
p=!0}a=typeof a=="string"
g=a2}}}if(a){b=[1,g,A.G(p?q:b9.c)]
break A}g=b8
a=!1
if(b){b0=!0
if(s)a2=a0
else{a0=b9.a
a2=a0
s=!0}if(3===a2){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}if(A.q(a2)){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}A.k(a2)
if(p)a=q
else{q=b9.c
a=q
p=!0}a=typeof a=="string"
g=a2}}}if(a){b=[3,g,A.G(p?q:b9.c)]
break A}f=b8
a=!1
if(b)if(2===(s?a0:b9.a)){if(a1)b=r
else{r=b9.b
b=r
a1=!0}if(typeof b=="string"){f=A.G(a1?r:b9.b)
if(p)b=q
else{q=b9.c
b=q
p=!0}b=A.q(b)}else b=a}else b=a
else b=a
if(b){b=[2,f,A.k(p?q:b9.c)]
break A}b=A.u(A.aC("Unsupported raster worker reply",b8))}return A.iZ(b)},
f7:function f7(a){this.a=a},
i_(a){var s=0,r=A.k9(t.H),q,p,o,n,m
var $async$i_=A.kf(function(b,c){if(b===1)return A.jW(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.hG(A.j2(A.r(v.G.WebAssembly.instantiate(a)),t.m),$async$i_)
case 2:o=n.r(m.r(c.instance).exports)
for(q=0;q<13;++q){p=B.ab[q]
if(!(typeof o[p]==="function"))throw A.d(A.at("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.r(o.memory).buffer).byteLength===0)throw A.d(A.at("FastLottie Wasm memory is empty"))
$.j=o
return A.jX(null,r)}})
return A.jY($async$i_,r)},
aK(a){var s,r,q=$.j
q.toString
s=a===0?1:a
r=A.k(q.malloc(s))
if(r<=0)throw A.d(A.at("Could not allocate "+a+" Wasm bytes"))
B.d.T(A.ix(t.a.a(A.r($.j.memory).buffer),r,a),0,a,0)
return r},
eR(a){var s=new A.c3(!0,a,null,null)
if($.j!=null)s.c=A.aK(a*4)
else s.d=new Uint32Array(a)
return s},
kp(a,b){var s=a.c
if(s!=null)$.j.fastlottie_clear_pixels(s,b)
else B.f.T(a.gt(),0,b,0)},
nJ(a,b,c,d,e,f,g){var s,r,q=a.c
if(q!=null&&e.b!=null){s=$.j
s.toString
r=e.b
r.toString
A.dc(s,"fastlottie_fill_solid_spans",[q,b,c,d,r,f,g],t.H)
return!0}return!1},
nC(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.j
s.toString
A.dc(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
nD(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null)return!1
try{s=$.j
s.toString
A.dc(s,"fastlottie_blend_solid",[q,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
nF(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.j
s.toString
A.dc(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
nE(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0,a1,a2,a3,a4){var s,r,q,p=a.c
if(p==null||e.b==null||g.c==null)return!1
s=$.j
s.toString
r=e.b
r.toString
q=g.c
q.toString
A.dc(s,"fastlottie_gradient_spans",[p,b,c,d,r,f,q,h,i,j?1:0,k,l,m,n,o,a0,a1,a2,a3,a4],t.H)
return!0},
lr(){var s,r,q=$.j
if(q==null)return null
try{s=A.k(q.fl_dense_new())
if(!J.l(s,0)){q=A.aK(16)
return new A.eO(s,q)}}catch(r){}return null},
lq(){var s,r=$.eP
if(r!=null){$.cw=$.cw+1
return r}s=A.lr()
if(s==null)return null
$.eP=s
$.cw=1
return s},
aX:function aX(a){this.a=a
this.c=this.b=null},
c3:function c3(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
eO:function eO(a,b){var _=this
_.a=a
_.b=b
_.x=_.w=_.r=_.f=_.e=_.d=_.c=0},
eQ:function eQ(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
lF(c2,c3,c4,c5,c6,c7,c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=null,c0=c8*c4,c1=c3.length
if(c8<=0||c4<=0||c0>65536||c1<2||c1>4||c7.length<c0*4)return b9
s=B.a.J(c8+16-1,16)
r=s*B.a.J(c4+16-1,16)
q=c1*r
p=new Uint16Array(q)
o=new Uint8Array(4)
B.d.T(o,0,4,255)
n=A.jw(c7,0,c0*4)
m=A.h([],t.a1)
l=A.a8(t.h6,t.L)
k=128+p.byteLength
for(j=n.length,i=0,h=0;h<c1;++h){if(!(h<c3.length))return A.a(c3,h)
g=c3[h]
f=g-c2
e=!0
if(f>=0)if(f<4){if(!(f>=0&&f<4))return A.a(o,f)
e=o[f]!==255||!c6.$2(g,c7)}if(e)return b9
if(!(f>=0&&f<4))return A.a(o,f)
o[f]=h
for(e=h>0,d=h*r,c=(h-1)*r,b=0;b<r;++b){a=B.a.M(b,s)*16
a0=B.a.a1(b,s)*16
a1=Math.min(16,c8-a)
a2=Math.min(16,c4-a0)
for(a3=2166136261,a4=0;a4<a2;++a4){a5=(a0+a4)*c8+a
for(a6=0;a6<a1;++a6){a7=a5+a6
if(!(a7>=0&&a7<j))return A.a(n,a7)
a3=((a3^n[a7])>>>0)*16777619>>>0}}a8=l.dT(new A.a0(a1,a2,a3),new A.f2())
a7=J.bp(a8)
b0=a7.gG(a8)
for(;;){if(!b0.v()){a9=-1
break}a9=b0.gC()
if(a9>>>0!==a9||a9>=m.length)return A.a(m,a9)
b1=m[a9]
b2=b1.length
b3=!0
a4=0
for(;;){if(!(a4<a2&&b3))break
a5=(a0+a4)*c8+a
for(b4=a4*a1,a6=0;a6<a1;++a6){b5=b4+a6
if(!(b5>=0&&b5<b2))return A.a(b1,b5)
b5=b1[b5]
b6=a5+a6
if(!(b6>=0&&b6<j))return A.a(n,b6)
if(b5!==n[b6]){b3=!1
break}}++a4}if(b3)break}if(a9<0){b0=a1*a2
k+=b0*4+48
if(k>c5)return b9
b1=new Uint32Array(b0)
for(a4=0;a4<a2;a4=b7){b7=a4+1
B.f.P(b1,a4*a1,b7*a1,n,(a0+a4)*c8+a)}a9=m.length
a7.n(a8,a9)
B.b.n(m,b1)}a7=d+b
if(!(a7>=0&&a7<q))return A.a(p,a7)
p[a7]=a9
if(e){a7=c+b
if(!(a7>=0&&a7<q))return A.a(p,a7)
a7=p[a7]!==a9}else a7=!1
if(a7)++i}}if(i*3>(c1-1)*r)return b9
q=A.h([],t.gN)
for(j=m.length,b8=0;b8<m.length;m.length===j||(0,A.W)(m),++b8)q.push(J.kX(B.f.gaa(m[b8])))
return new A.dN(c8,c4,c2,o,p,q,new A.i(),k)},
f1:function f1(){this.a=null
this.b=-1},
dN:function dN(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.y=_.x=$},
f2:function f2(){},
nA(){var s,r,q=null,p={}
p.a=!1
s=A.r(v.G.self)
p=new A.i2(p,new A.fv(new A.c6(q,q,q,q,t.co)))
if(typeof p=="function")A.u(A.aC("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.mq,p)
r[$.ig()]=p
s.onmessage=r},
i1:function i1(a,b){this.a=a
this.b=b},
i2:function i2(a,b){this.a=a
this.b=b},
fv:function fv(a){this.a=a},
bj(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.bB(b,c,B.a.a1(a.byteLength,s))
return J.bY(J.j9(a),a.byteOffset+b*s,(c-b)*s)},
jw(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.bB(b,c,B.a.a1(a.byteLength,s))-b)*s
if(B.a.M(r,4)!==0)throw A.d(A.aC("The number of bytes to view must be a multiple of 4",null))
return J.kW(J.j9(a),a.byteOffset+b*s,B.a.J(r,4))},
kq(a){return v.mangledGlobalNames[a]},
nq(a,b){var s,r,q,p=a.length
if(p>=32)return A.mu(a,b)
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
mp(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
mu(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.ke
if(c7==null)c7=$.ke=A.mp(B.l)
s=c8.length
r=J.kT(B.d.gaa(c8),c8.byteOffset,s)
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
nm(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.G.fl(a,16777216,!0,!1)
if(s>16777216)throw A.d(B.Y)
return a}},B={}
var w=[A,J,B]
var $={}
A.ir.prototype={}
J.B.prototype={
E(a,b){return a===b},
gS(a){return A.cG(a)},
p(a){return"Instance of '"+A.dG(a)+"'"},
gV(a){return A.bV(A.iQ(this))}}
J.cq.prototype={
p(a){return String(a)},
bE(a,b){return b||a},
gS(a){return a?519018:218159},
gV(a){return A.bV(t.y)},
$iy:1,
$ix:1}
J.cs.prototype={
E(a,b){return null==b},
p(a){return"null"},
gS(a){return 0},
$iy:1,
$iV:1}
J.N.prototype={$iH:1}
J.bd.prototype={
gS(a){return 0},
p(a){return String(a)}}
J.dF.prototype={}
J.cM.prototype={}
J.aj.prototype={
p(a){var s=a[$.kt()]
if(s==null)s=a[$.ig()]
if(s==null)return this.ea(a)
return"JavaScript function for "+J.bs(s)},
$ibu:1}
J.bv.prototype={
gS(a){return 0},
p(a){return String(a)}}
J.bw.prototype={
gS(a){return 0},
p(a){return String(a)}}
J.v.prototype={
n(a,b){A.a1(a).c.a(b)
a.$flags&1&&A.f(a,29)
a.push(b)},
ag(a,b){var s
A.a1(a).i("m<1>").a(b)
a.$flags&1&&A.f(a,"addAll",2)
if(Array.isArray(b)){this.eq(a,b)
return}for(s=J.cl(b);s.v();)a.push(s.gC())},
eq(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.d(A.aq(a))
for(r=0;r<s;++r)a.push(b[r])},
l(a){a.$flags&1&&A.f(a,"clear","clear")
a.length=0},
aE(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
e8(a,b,c){var s=a.length
if(b>s)throw A.d(A.al(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.d(A.al(c,b,s,"end",null))
if(b===c)return A.h([],A.a1(a))
return A.h(a.slice(b,c),A.a1(a))},
ga6(a){if(a.length>0)return a[0]
throw A.d(A.ar())},
gac(a){var s=a.length
if(s>0)return a[s-1]
throw A.d(A.ar())},
gae(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.d(A.ar())
throw A.d(A.ip())},
b1(a,b,c){a.$flags&1&&A.f(a,18)
A.bB(b,c,a.length)
a.splice(b,c-b)},
an(a,b){var s,r
A.a1(a).i("x(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.d(A.aq(a))}return!1},
ab(a,b){var s,r
A.a1(a).i("x(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.d(A.aq(a))}return!0},
gZ(a){return a.length===0},
gbw(a){return a.length!==0},
p(a){return A.iq(a,"[","]")},
gG(a){return new J.bt(a,a.length,A.a1(a).i("bt<1>"))},
gS(a){return A.cG(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.f(a,"set length","change the length of")
if(b<0)throw A.d(A.al(b,0,null,"newLength",null))
if(b>a.length)A.a1(a).c.a(null)
a.length=b},
h(a,b){A.k(b)
if(!(b>=0&&b<a.length))throw A.d(A.en(a,b))
return a[b]},
u(a,b,c){A.a1(a).c.a(c)
a.$flags&2&&A.f(a)
if(!(b>=0&&b<a.length))throw A.d(A.en(a,b))
a[b]=c},
$im:1,
$ip:1}
J.dt.prototype={
h5(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.dG(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.eF.prototype={}
J.bt.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.W(q)
throw A.d(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$ia7:1}
J.ct.prototype={
cb(a,b){var s
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gcg(b)
if(this.gcg(a)===s)return 0
if(this.gcg(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gcg(a){return a===0?1/a<0:a<0},
W(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.d(A.aG(""+a+".toInt()"))},
U(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.d(A.aG(""+a+".ceil()"))},
R(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.d(A.aG(""+a+".floor()"))},
D(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.d(A.aG(""+a+".round()"))},
dV(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
A(a,b,c){if(this.cb(b,c)>0)throw A.d(A.iW(b))
if(this.cb(a,b)<0)return b
if(this.cb(a,c)>0)return c
return a},
p(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gS(a){var s,r,q,p,o=a|0
if(a===o)return o&536870911
s=Math.abs(a)
r=Math.log(s)/0.6931471805599453|0
q=Math.pow(2,r)
p=s<1?s/q:q/s
return((p*9007199254740992|0)+(p*3542243181176521|0))*599197+r*1259&536870911},
M(a,b){var s=a%b
if(s===0)return 0
if(s>0)return s
if(b<0)return s-b
else return s+b},
a1(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dg(a,b)},
J(a,b){return(a|0)===a?a/b|0:this.dg(a,b)},
dg(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.d(A.aG("Result of truncating division is "+A.t(s)+": "+A.t(a)+" ~/ "+b))},
a8(a,b){if(b<0)throw A.d(A.iW(b))
return b>31?0:a<<b>>>0},
f7(a,b){return b>31?0:a<<b>>>0},
I(a,b){var s
if(a>0)s=this.c0(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
c0(a,b){return b>31?0:a>>>b},
f8(a,b){if(b>31)return 0
return a>>>b},
gV(a){return A.bV(t.q)},
$ie:1,
$ibX:1}
J.cr.prototype={
b2(a,b){var s=this.a8(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
gV(a){return A.bV(t.S)},
$iy:1,
$ic:1}
J.du.prototype={
gV(a){return A.bV(t.i)},
$iy:1}
J.c0.prototype={
e6(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bH(a,b,c){return a.substring(b,A.bB(b,c,a.length))},
e9(a,b){return this.bH(a,b,null)},
ad(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.d(B.N)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
p(a){return a},
gS(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gV(a){return A.bV(t.N)},
gk(a){return a.length},
h(a,b){A.k(b)
if(!(b>=0&&b<a.length))throw A.d(A.en(a,b))
return a[b]},
$iy:1,
$ieV:1,
$io:1}
A.aU.prototype={
p(a){return"LateInitializationError: "+this.a}}
A.i4.prototype={
$0(){var s=new A.I($.D,t.D)
s.bK(null)
return s},
$S:26}
A.eX.prototype={}
A.aO.prototype={}
A.a9.prototype={
gG(a){var s=this
return new A.by(s,s.gk(s),A.n(s).i("by<a9.E>"))},
gZ(a){return this.gk(this)===0}}
A.by.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s,r=this,q=r.a,p=J.O(q),o=p.gk(q)
if(r.b!==o)throw A.d(A.aq(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.aE(q,s);++r.c
return!0},
$ia7:1}
A.U.prototype={
gk(a){return J.aB(this.a)},
aE(a,b){return this.b.$1(J.kY(this.a,b))}}
A.bE.prototype={
gG(a){return new A.cO(J.cl(this.a),this.b,this.$ti.i("cO<1>"))}}
A.cO.prototype={
v(){var s,r
for(s=this.a,r=this.b;s.v();)if(r.$1(s.gC()))return!0
return!1},
gC(){return this.a.gC()},
$ia7:1}
A.E.prototype={
dq(a,b){return A.u(A.aG("Cannot "+b+" a fixed-length list"))},
sk(a,b){this.dq(a,"change the length of")},
n(a,b){A.ba(a).i("E.E").a(b)
return this.dq(a,"add to")}}
A.bD.prototype={
u(a,b,c){A.n(this).i("bD.E").a(c)
throw A.d(A.aG("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.d(A.aG("Cannot change the length of an unmodifiable list"))},
n(a,b){A.n(this).i("bD.E").a(b)
throw A.d(A.aG("Cannot add to an unmodifiable list"))}}
A.cZ.prototype={$r:"+(1)",$s:1}
A.bO.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:8}
A.cc.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10,11,12)",$s:9}
A.F.prototype={$r:"+(1,2)",$s:2}
A.cd.prototype={$r:"+compressedBytes,entryDiskBytes(1,2)",$s:3}
A.a0.prototype={$r:"+(1,2,3)",$s:4}
A.aS.prototype={$r:"+(1,2,3,4)",$s:5}
A.bP.prototype={$r:"+(1,2,3,4,5,6)",$s:6}
A.ce.prototype={$r:"+(1,2,3,4,5,6,7)",$s:7}
A.cR.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$ia7:1}
A.co.prototype={
n(a,b){A.n(this).c.a(b)
A.l9()}}
A.J.prototype={
gk(a){return this.b},
gG(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.cR(s,s.length,r.$ti.i("cR<1>"))},
aw(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.cI.prototype={}
A.f3.prototype={
ah(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.cF.prototype={
p(a){return"Null check operator used on a null value"}}
A.dw.prototype={
p(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.dP.prototype={
p(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.eT.prototype={
p(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cp.prototype={}
A.d1.prototype={
p(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iam:1}
A.bb.prototype={
p(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.kr(r==null?"unknown":r)+"'"},
$ibu:1,
gh7(){return this},
$C:"$1",
$R:1,
$D:null}
A.di.prototype={$C:"$0",$R:0}
A.dj.prototype={$C:"$2",$R:2}
A.dM.prototype={}
A.dK.prototype={
p(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.kr(s)+"'"}}
A.c_.prototype={
E(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.c_))return!1
return this.$_target===b.$_target&&this.a===b.a},
gS(a){return(A.i5(this.a)^A.cG(this.$_target))>>>0},
p(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.dG(this.a)+"'")}}
A.dJ.prototype={
p(a){return"RuntimeError: "+this.a}}
A.aT.prototype={
gk(a){return this.a},
gZ(a){return this.a===0},
gaA(){return new A.T(this,A.n(this).i("T<1>"))},
aD(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.fK(a)},
fK(a){var s=this.d
if(s==null)return!1
return this.aZ(this.cR(s,a),a)>=0},
ag(a,b){A.n(this).i("as<1,2>").a(b).aF(0,new A.eG(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.fL(b)},
fL(a){var s,r,q=this.d
if(q==null)return null
s=this.cR(q,a)
r=this.aZ(s,a)
if(r<0)return null
return s[r].b},
u(a,b,c){var s,r,q,p,o,n,m=this,l=A.n(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cw(s==null?m.b=m.bU():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cw(r==null?m.c=m.bU():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.bU()
p=m.bu(b)
o=q[p]
if(o==null)q[p]=[m.bJ(b,c)]
else{n=m.aZ(o,b)
if(n>=0)o[n].b=c
else o.push(m.bJ(b,c))}}},
dT(a,b){var s,r,q=this,p=A.n(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aD(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.u(0,a,r)
return r},
K(a,b){var s=this
if(typeof b=="string")return s.cz(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cz(s.c,b)
else return s.fM(b)},
fM(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bu(a)
r=n[s]
q=o.aZ(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.cA(p)
if(r.length===0)delete n[s]
return p.b},
l(a){var s=this
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bI()}},
aF(a,b){var s,r,q=this
A.n(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.d(A.aq(q))
s=s.c}},
cw(a,b,c){var s,r=A.n(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bJ(b,c)
else s.b=c},
cz(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.cA(s)
delete a[b]
return s.b},
bI(){this.r=this.r+1&1073741823},
bJ(a,b){var s=this,r=A.n(s),q=new A.eJ(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bI()
return q},
cA(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bI()},
bu(a){return J.aM(a)&1073741823},
cR(a,b){return a[this.bu(b)]},
aZ(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1},
p(a){return A.jn(this)},
bU(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$iit:1}
A.eG.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.u(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.n(this.a).i("~(1,2)")}}
A.eJ.prototype={}
A.T.prototype={
gk(a){return this.a.a},
gZ(a){return this.a.a===0},
gG(a){var s=this.a
return new A.cv(s,s.r,s.e,this.$ti.i("cv<1>"))}}
A.cv.prototype={
gC(){return this.d},
v(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.aq(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$ia7:1}
A.eK.prototype={
gk(a){return this.a.a},
gZ(a){return this.a.a===0},
gG(a){var s=this.a
return new A.aD(s,s.r,s.e,this.$ti.i("aD<1>"))}}
A.aD.prototype={
gC(){return this.d},
v(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.aq(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$ia7:1}
A.bx.prototype={
gk(a){return this.a.a},
gZ(a){return this.a.a===0},
gG(a){var s=this.a
return new A.cu(s,s.r,s.e,this.$ti.i("cu<1,2>"))}}
A.cu.prototype={
gC(){var s=this.d
s.toString
return s},
v(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.d(A.aq(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.be(s.a,s.b,r.$ti.i("be<1,2>"))
r.c=s.c
return!0}},
$ia7:1}
A.ae.prototype={
bu(a){return A.i5(a)&1073741823},
aZ(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.hX.prototype={
$1(a){return this.a(a)},
$S:20}
A.hY.prototype={
$2(a,b){return this.a(a,b)},
$S:55}
A.hZ.prototype={
$1(a){return this.a(A.G(a))},
$S:15}
A.a3.prototype={
p(a){return this.dj(!1)},
dj(a){var s,r,q,p,o,n=this.eI(),m=this.aT(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.jp(o):l+A.t(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
eI(){var s,r=this.$s
while($.hh.length<=r)B.b.n($.hh,null)
s=$.hh[r]
if(s==null){s=this.ey()
B.b.u($.hh,r,s)}return s},
ey(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.h(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.b.u(k,q,r[s])}}k=A.lm(k,!1,t.K)
k.$flags=3
return k}}
A.bN.prototype={
aT(){return[this.a,this.b]},
E(a,b){if(b==null)return!1
return b instanceof A.bN&&this.$s===b.$s&&J.l(this.a,b.a)&&J.l(this.b,b.b)},
gS(a){return A.eU(this.$s,this.a,this.b,B.n)}}
A.ca.prototype={
aT(){return[this.a]},
E(a,b){if(b==null)return!1
return b instanceof A.ca&&this.$s===b.$s&&J.l(this.a,b.a)},
gS(a){return A.eU(this.$s,this.a,B.n,B.n)}}
A.cb.prototype={
aT(){return[this.a,this.b,this.c]},
E(a,b){var s=this
if(b==null)return!1
return b instanceof A.cb&&s.$s===b.$s&&J.l(s.a,b.a)&&J.l(s.b,b.b)&&J.l(s.c,b.c)},
gS(a){var s=this
return A.eU(s.$s,s.a,s.b,s.c)}}
A.aR.prototype={
aT(){return this.a},
E(a,b){if(b==null)return!1
return b instanceof A.aR&&this.$s===b.$s&&A.lV(this.a,b.a)},
gS(a){return A.eU(this.$s,A.lu(this.a),B.n,B.n)}}
A.dv.prototype={
p(a){return"RegExp/"+this.a+"/"+this.b.flags},
geQ(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.jk(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
dK(a){var s=this.b.exec(a)
if(s==null)return null
return new A.cT(s)},
dv(a,b){return new A.dQ(this,b,0)},
eG(a,b){var s,r=this.geQ()
if(r==null)r=A.bo(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.cT(s)},
$ieV:1,
$ilA:1}
A.cT.prototype={
h(a,b){var s
A.k(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$idH:1}
A.dQ.prototype={
gG(a){return new A.c5(this.a,this.b,this.c)}}
A.c5.prototype={
gC(){var s=this.d
return s==null?t.d.a(s):s},
v(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.eG(l,s)
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
$ia7:1}
A.fg.prototype={
am(){var s=this.b
if(s===this)throw A.d(new A.aU("Local '' has not been initialized."))
return s},
sdJ(a){if(this.b!==this)throw A.d(new A.aU("Local '' has already been initialized."))
this.b=a}}
A.bf.prototype={
gV(a){return B.b3},
bt(a,b,c){A.b7(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dC(a){return this.bt(a,0,null)},
dB(a,b,c){A.b7(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dA(a,b,c){A.b7(a,b,c)
if(c==null)c=B.a.J(a.byteLength-b,8)
return new Float64Array(a,b,c)},
bs(a,b,c){if(B.a.M(b,16)!==0)A.u(A.jq("Offset ("+b+") must be a multiple of BYTES_PER_ELEMENT (16)"))
c=(c==null?B.a.J(a.byteLength-b,16):c)*4
A.b7(a,b,c)
return new A.cx(new Float32Array(a,b,c))},
dz(a){return this.bs(a,0,null)},
dw(a,b,c){A.b7(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iy:1,
$ibf:1}
A.c1.prototype={$ic1:1}
A.cx.prototype={
gV(a){return B.b6},
gk(a){return this.a.length/4|0},
h(a,b){var s,r,q,p,o,n,m
A.k(b)
s=this.a
r=s.length
A.aL(b,this,r/4|0)
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
return new A.aE(p,n,m,s[q])},
u(a,b,c){var s,r,q,p
t.Y.a(c)
s=this.a
r=s.length
A.aL(b,this,r/4|0)
q=b*4
s.$flags&2&&A.f(s)
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
$iy:1,
$im:1,
$ip:1,
$iex:1}
A.ee.prototype={}
A.cC.prototype={
gaa(a){if(((a.$flags|0)&2)!==0)return new A.hy(a.buffer)
else return a.buffer},
eP(a,b,c,d){var s=A.al(b,0,c,d,null)
throw A.d(s)},
cG(a,b,c,d){if(b>>>0!==b||b>c)this.eP(a,b,c,d)}}
A.hy.prototype={
bt(a,b,c){var s=A.ix(this.a,b,c)
s.$flags=3
return s},
dC(a){return this.bt(0,0,null)},
dB(a,b,c){var s=A.iw(this.a,b,c)
s.$flags=3
return s},
dA(a,b,c){var s=A.iv(this.a,b,c)
s.$flags=3
return s},
bs(a,b,c){return new A.ee(J.j8(this.a,b,c).a)},
dz(a){return this.bs(0,0,null)},
dw(a,b,c){var s=A.lp(this.a,b,c)
s.$flags=3
return s}}
A.dz.prototype={
gV(a){return B.b4},
$iy:1}
A.a5.prototype={
gk(a){return a.length},
d8(a,b,c,d,e){var s,r,q=a.length
this.cG(a,b,q,"start")
this.cG(a,c,q,"end")
if(b>c)throw A.d(A.al(b,0,c,null,null))
s=c-b
if(e<0)throw A.d(A.aC(e,null))
r=d.length
if(r-e<s)throw A.d(A.at("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$iak:1}
A.cA.prototype={
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
u(a,b,c){A.Q(c)
a.$flags&2&&A.f(a)
A.aL(b,a,a.length)
a[b]=c},
P(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.f(a,5)
this.d8(a,b,c,d,e)
return},
L(a,b,c,d){return this.P(a,b,c,d,0)},
$im:1,
$ip:1}
A.cB.prototype={
u(a,b,c){A.k(c)
a.$flags&2&&A.f(a)
A.aL(b,a,a.length)
a[b]=c},
P(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.f(a,5)
this.d8(a,b,c,d,e)
return},
L(a,b,c,d){return this.P(a,b,c,d,0)},
$im:1,
$ip:1}
A.c2.prototype={
gV(a){return B.b5},
$iy:1,
$ic2:1,
$ibc:1}
A.cy.prototype={
gV(a){return B.b7},
$iy:1,
$iey:1}
A.dA.prototype={
gV(a){return B.b8},
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
$iy:1}
A.cz.prototype={
gV(a){return B.b9},
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
$iy:1,
$iio:1}
A.dC.prototype={
gV(a){return B.ba},
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
$iy:1}
A.dD.prototype={
gV(a){return B.bc},
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
$iy:1,
$iiB:1}
A.cD.prototype={
gV(a){return B.bd},
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
$iy:1,
$icL:1}
A.cE.prototype={
gV(a){return B.be},
gk(a){return a.length},
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
$iy:1}
A.bz.prototype={
gV(a){return B.bf},
gk(a){return a.length},
h(a,b){A.k(b)
A.aL(b,a,a.length)
return a[b]},
$iy:1,
$ibz:1,
$ibi:1}
A.aE.prototype={
ad(a,b){var s,r,q,p,o=this
t.Y.a(b)
s=$.de()
s.$flags&2&&A.f(s)
s[0]=o.a*b.a
r=s[0]
s[0]=o.b*b.b
q=s[0]
s[0]=o.c*b.c
p=s[0]
s[0]=o.d*b.d
return new A.aE(r,q,p,s[0])},
cu(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.de()
k.$flags&2&&A.f(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.aE(s,r,q,k[0])},
p(a){return"V128"},
$ia4:1}
A.e5.prototype={}
A.e6.prototype={}
A.cU.prototype={}
A.cV.prototype={}
A.cW.prototype={}
A.cX.prototype={}
A.ef.prototype={}
A.aF.prototype={
i(a){return A.d8(v.typeUniverse,this,a)},
a2(a){return A.jR(v.typeUniverse,this,a)}}
A.e0.prototype={}
A.hw.prototype={
p(a){return A.af(this.a,null)}}
A.dY.prototype={
p(a){return this.a}}
A.cg.prototype={$ib0:1}
A.fc.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:5}
A.fb.prototype={
$1(a){var s,r
this.a.a=t.O.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:32}
A.fd.prototype={
$0(){this.a.$0()},
$S:6}
A.fe.prototype={
$0(){this.a.$0()},
$S:6}
A.hs.prototype={
ef(a,b){if(self.setTimeout!=null)self.setTimeout(A.dd(new A.ht(this,b),0),a)
else throw A.d(A.aG("`setTimeout()` not found."))}}
A.ht.prototype={
$0(){this.b.$0()},
$S:0}
A.dR.prototype={}
A.hH.prototype={
$1(a){return this.a.$2(0,a)},
$S:3}
A.hI.prototype={
$2(a,b){this.a.$2(1,new A.cp(a,t.l.a(b)))},
$S:22}
A.hT.prototype={
$2(a,b){this.a(A.k(a),b)},
$S:28}
A.ah.prototype={
p(a){return A.t(this.a)},
$iK:1,
gaR(){return this.b}}
A.dV.prototype={
dG(a){var s=this.a
if((s.a&30)!==0)throw A.d(A.at("Future already completed"))
s.ba(A.mH(a,null))}}
A.cP.prototype={}
A.b2.prototype={
fS(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.bp(s,t.al.a(this.d),a.a,t.y,t.K)},
fE(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.f4(l,q,m,a.b,o,n,t.l)
else p=l.bp(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.k.b(A.ac(s))){if((r.c&1)!==0)throw A.d(A.aC("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.d(A.aC("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.I.prototype={
ck(a,b,c){var s,r,q,p=this.$ti
p.a2(c).i("1/(2)").a(a)
s=$.D
if(s===B.k){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.d(A.jc(b,"onError",u.c))}else{r=p.c
a=s.bm(s,c.i("@<0/>").a2(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.n1(b,s)}q=new A.I(s,c.i("I<0>"))
r=b==null?1:3
this.b9(new A.b2(q,r,a,b,p.i("@<1>").a2(c).i("b2<1,2>")))
return q},
dh(a,b,c){var s,r=this.$ti
r.a2(c).i("1/(2)").a(a)
s=new A.I($.D,c.i("I<0>"))
this.b9(new A.b2(s,19,a,b,r.i("@<1>").a2(c).i("b2<1,2>")))
return s},
cn(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.D
q=new A.I(r,s)
if(r!==B.k)a=r.bl(r,a,t.z)
this.b9(new A.b2(q,8,a,null,s.i("b2<1,1>")))
return q},
f5(a){this.a=this.a&1|16
this.c=a},
bb(a){this.a=a.a&30|this.a&1
this.c=a.c},
b9(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.b9(a)
return}r.bb(s)}q=r.b
q.aW(q,new A.fQ(r,a))}},
d1(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.d1(a)
return}m.bb(n)}l.a=m.bo(a)
s=m.b
s.aW(s,new A.fU(l,m))}},
aV(){var s=t.F.a(this.c)
this.c=null
return this.bo(s)},
bo(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
cJ(a){var s,r=this
r.$ti.c.a(a)
s=r.aV()
r.a=8
r.c=a
A.bJ(r,s)},
ex(a){var s=this.aV()
this.bb(a)
A.bJ(this,s)},
bc(a){var s=this.aV()
this.f5(a)
A.bJ(this,s)},
ew(a,b){A.bo(a)
t.l.a(b)
this.bc(new A.ah(a,b))},
bK(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("ai<1>").b(a)){this.cF(a)
return}this.eu(a)},
eu(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.aW(s,new A.fS(r,a))},
cF(a){A.iE(this.$ti.i("ai<1>").a(a),this,!1)
return},
ba(a){var s
this.a^=2
s=this.b
s.aW(s,new A.fR(this,a))},
$iai:1}
A.fQ.prototype={
$0(){A.bJ(this.a,this.b)},
$S:0}
A.fU.prototype={
$0(){A.bJ(this.b,this.a.a)},
$S:0}
A.fT.prototype={
$0(){A.iE(this.a.a,this.b,!0)},
$S:0}
A.fS.prototype={
$0(){this.a.cJ(this.b)},
$S:0}
A.fR.prototype={
$0(){this.a.bc(this.b)},
$S:0}
A.fX.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bq(p,t.fO.a(q.d),t.z)}catch(o){s=A.ac(o)
r=A.b9(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.ik(q)
n=k.a
n.c=new A.ah(q,p)
q=n}q.b=!0
return}if(j instanceof A.I&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.I){m=k.b.a
l=new A.I(m.b,m.$ti)
j.ck(new A.fY(l,m),new A.fZ(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.fY.prototype={
$1(a){this.a.ex(this.b)},
$S:5}
A.fZ.prototype={
$2(a,b){A.bo(a)
t.l.a(b)
this.a.bc(new A.ah(a,b))},
$S:52}
A.fW.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.bp(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.ac(k)
r=A.b9(k)
q=s
p=r
if(p==null)p=A.ik(q)
o=this.a
o.c=new A.ah(q,p)
o.b=!0}},
$S:0}
A.fV.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.fS(s)&&p.a.e!=null){p.c=p.a.fE(s)
p.b=!1}}catch(o){r=A.ac(o)
q=A.b9(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.ik(p)
m=l.b
m.c=new A.ah(p,n)
p=m}p.b=!0}},
$S:0}
A.dS.prototype={}
A.cK.prototype={
gk(a){var s={},r=new A.I($.D,t.fJ)
s.a=0
this.dP(new A.eZ(s,this),!0,new A.f_(s,r),r.gev())
return r}}
A.eZ.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.f_.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.aV()
r.c.a(q)
s.a=8
s.c=q
A.bJ(s,p)},
$S:0}
A.d2.prototype={
geU(){var s,r=this
if((r.b&8)===0)return A.n(r).i("aI<1>?").a(r.a)
s=A.n(r)
return s.i("aI<1>?").a(s.i("d3<1>").a(r.a).gc5())},
cO(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aI(A.n(q).i("aI<1>"))
return A.n(q).i("aI<1>").a(s)}r=A.n(q)
s=r.i("d3<1>").a(q.a).gc5()
return r.i("aI<1>").a(s)},
gdd(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gc5()
return A.n(this).i("c8<1>").a(s)},
cE(){if((this.b&4)!==0)return new A.bh("Cannot add event after closing")
return new A.bh("Cannot add event while adding a stream")},
cN(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.j4():new A.I($.D,t.D)
return s},
c9(){var s=this,r=s.b
if((r&4)!==0)return s.cN()
if(r>=4)throw A.d(s.cE())
r=s.b=r|4
if((r&1)!==0)s.c_()
else if((r&3)===0)s.cO().n(0,B.y)
return s.cN()},
f9(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.n(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.d(A.at("Stream has already been listened to."))
s=h.c
r=$.D
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.bm(r,t.a7.a2(s).i("1(2)").a(a),o,s)
A.lL(r,b)
n=c==null?A.nf():c
m=t.O
l=new A.c8(i,s,r.bl(r,m.a(n),o),r,q|p,h.i("c8<1>"))
k=i.geU()
if(((i.b|=1)&8)!==0){j=h.i("d3<1>").a(i.a)
j.sc5(l)
j.fZ()}else i.a=l
l.f6(k)
h=m.a(new A.hl(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cH((s&4)!==0)
return l},
eY(a){var s,r,q,p,o,n,m,l,k=this,j=A.n(k)
j.i("dL<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("d3<1>").a(k.a).hb()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.I)s=q}catch(n){p=A.ac(n)
o=A.b9(n)
m=new A.I($.D,t.D)
j=A.bo(p)
l=t.l.a(o)
m.ba(new A.ah(j,l))
s=m}else s=s.cn(r)
j=new A.hk(k)
if(s!=null)s=s.cn(j)
else j.$0()
return s},
$ijt:1,
$ijG:1,
$ibH:1,
$ijs:1}
A.hl.prototype={
$0(){A.iU(this.a.d)},
$S:0}
A.hk.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bK(null)},
$S:0}
A.dT.prototype={
bZ(a){var s=this.$ti
s.c.a(a)
this.gdd().cD(new A.bG(a,s.i("bG<1>")))},
c_(){this.gdd().cD(B.y)}}
A.c6.prototype={}
A.c7.prototype={
gS(a){return(A.cG(this.a)^892482866)>>>0},
E(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.c7&&b.a===this.a}}
A.c8.prototype={
cY(){return this.w.eY(this)},
cZ(){var s=this.w,r=A.n(s)
r.i("dL<1>").a(this)
if((s.b&8)!==0)r.i("d3<1>").a(s.a).hf()
A.iU(s.e)},
d_(){var s=this.w,r=A.n(s)
r.i("dL<1>").a(this)
if((s.b&8)!==0)r.i("d3<1>").a(s.a).fZ()
A.iU(s.f)}}
A.cQ.prototype={
f6(a){var s=this
A.n(s).i("aI<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bF(s)}},
cZ(){},
d_(){},
cY(){return null},
cD(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aI(A.n(r).i("aI<1>"))
q.n(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bF(r)}},
bZ(a){var s,r=this,q=A.n(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.h0(r.a,a,q)
r.e&=4294967231
r.cH((s&4)!==0)},
c_(){var s,r=this,q=new A.ff(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.cY()
r.e|=16
if(p!=null&&p!==$.j4())p.cn(q)
else q.$0()},
cH(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=p&4294967167
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p&=4294967291
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=p^64
if(r)q.cZ()
else q.d_()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bF(q)},
$idL:1,
$ibH:1}
A.ff.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.h_(s.c)
s.e&=4294967231},
$S:0}
A.d4.prototype={
dP(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.f9(s.i("~(1)?").a(a),d,c,b===!0)},
fP(a){return this.dP(a,null,null,null)}}
A.bk.prototype={
sb_(a){this.a=t.ev.a(a)},
gb_(){return this.a}}
A.bG.prototype={
dR(a){this.$ti.i("bH<1>").a(a).bZ(this.b)}}
A.dX.prototype={
dR(a){a.c_()},
gb_(){return null},
sb_(a){throw A.d(A.at("No events after a done."))},
$ibk:1}
A.aI.prototype={
bF(a){var s,r=this
r.$ti.i("bH<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.nI(new A.hg(r,a))
r.a=1},
n(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sb_(b)
s.c=b}}}
A.hg.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("bH<1>").a(this.b)
r=p.b
q=r.gb_()
p.b=q
if(q==null)p.c=null
r.dR(s)},
$S:0}
A.e9.prototype={}
A.f9.prototype={
h_(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.bq(o,a,t.H)
return q}catch(p){s=A.ac(p)
r=A.b9(p)
o.aU(o,s,r)}},
h0(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.bp(o,a,b,t.H,c)
return q}catch(p){s=A.ac(p)
r=A.b9(p)
o.aU(o,s,r)}},
fh(a,b){return new A.fa(this,this.bl(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.ghe(null).h(0,b)
return s}return null},
aU(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.n3(b,c)
return}r=s.gco()
q=r.gha()
p=$.D
try{$.D=q
s.fD(r,r.gbW(),a,b,c)
$.D=p}catch(m){o=A.ac(m)
n=A.b9(m)
$.D=p
l=b===o?c:n
q.aU(r,o,l)}},
bq(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.D
if(r===a)return b.$0()
s=r
$.D=a
try{r=b.$0()
return r}finally{$.D=s}q=null.gco()
return null.hc(q,q.gbW(),a,b)},
bp(a,b,c,d,e){var s,r,q
d.i("@<0>").a2(e).i("1(2)").a(b)
e.a(c)
r=$.D
if(r===a)return b.$1(c)
s=r
$.D=a
try{r=b.$1(c)
return r}finally{$.D=s}q=null.gco()
return null.fD(q,q.gbW(),a,b,c)},
f4(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").a2(f).a2(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.D
if(r===a)return b.$2(c,d)
s=r
$.D=a
try{r=b.$2(c,d)
return r}finally{$.D=s}q=null.gco()
return null.hd(q,q.gbW(),a,b,c,d)},
bl(a,b,c){c.i("0()").a(b)
return b},
bm(a,b,c,d){c.i("@<0>").a2(d).i("1(2)").a(b)
return b},
bY(a,b,c,d,e){c.i("@<0>").a2(d).a2(e).i("1(2,3)").a(b)
return b},
eF(a,b,c){return null},
aW(a,b){A.iT(a,t.O.a(b))
return}}
A.fa.prototype={
$0(){var s=this.a
return s.bq(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.hS.prototype={
$0(){A.lb(this.a,this.b)},
$S:0}
A.b3.prototype={
gG(a){var s=this,r=new A.cS(s,s.r,A.n(s).i("cS<1>"))
r.c=s.e
return r},
gk(a){return this.a},
aw(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.ez(b)},
ez(a){var s=this.d
if(s==null)return!1
return this.bi(s[this.bd(a)],a)>=0},
ga6(a){var s=this.e
if(s==null)throw A.d(A.at("No elements"))
return A.n(this).c.a(s.a)},
n(a,b){var s,r,q=this
A.n(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cC(s==null?q.b=A.iG():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cC(r==null?q.c=A.iG():r,b)}else return q.ep(b)},
ep(a){var s,r,q,p=this
A.n(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.iG()
r=p.bd(a)
q=s[r]
if(q==null)s[r]=[p.bV(a)]
else{if(p.bi(q,a)>=0)return!1
q.push(p.bV(a))}return!0},
K(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.d3(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.d3(s.c,b)
else return s.f_(b)},
f_(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bd(a)
r=n[s]
q=o.bi(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dn(p)
return!0},
eJ(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("x(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.d(A.aq(n))
if(!0===o)n.K(0,r)}},
cC(a,b){A.n(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.bV(b)
return!0},
d3(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dn(s)
delete a[b]
return!0},
bT(){this.r=this.r+1&1073741823},
bV(a){var s,r=this,q=new A.e4(A.n(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.bT()
return q},
dn(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.bT()},
bd(a){return J.aM(a)&1073741823},
bi(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.bL.prototype={
bd(a){return A.i5(a)&1073741823},
bi(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.e4.prototype={}
A.cS.prototype={
gC(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.d(A.aq(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$ia7:1}
A.A.prototype={
gG(a){return new A.by(a,this.gk(a),A.ba(a).i("by<A.E>"))},
aE(a,b){return this.h(a,b)},
gZ(a){return this.gk(a)===0},
gbw(a){return!this.gZ(a)},
ga6(a){if(this.gk(a)===0)throw A.d(A.ar())
return this.h(a,0)},
gac(a){if(this.gk(a)===0)throw A.d(A.ar())
return this.h(a,this.gk(a)-1)},
gae(a){if(this.gk(a)===0)throw A.d(A.ar())
if(this.gk(a)>1)throw A.d(A.ip())
return this.h(a,0)},
an(a,b){var s,r
A.ba(a).i("x(A.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.d(A.aq(a))}return!1},
n(a,b){var s
A.ba(a).i("A.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.u(a,s,b)},
T(a,b,c,d){var s,r,q=A.ba(a)
q.i("A.E?").a(d)
s=d==null?q.i("A.E").a(d):d
A.bB(b,c,this.gk(a))
for(r=b;r<c;++r)this.u(a,r,s)},
p(a){return A.iq(a,"[","]")}}
A.L.prototype={
aF(a,b){var s,r,q,p=A.n(this)
p.i("~(L.K,L.V)").a(b)
for(s=this.gaA(),s=s.gG(s),p=p.i("L.V");s.v();){r=s.gC()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ag(a,b){A.n(this).i("as<L.K,L.V>").a(b).aF(0,new A.eM(this))},
gk(a){var s=this.gaA()
return s.gk(s)},
gZ(a){var s=this.gaA()
return s.gZ(s)},
p(a){return A.jn(this)},
$ias:1}
A.eM.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.u(0,r.i("L.K").a(a),r.i("L.V").a(b))},
$S(){return A.n(this.a).i("~(L.K,L.V)")}}
A.eN.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.t(a)
r.a=(r.a+=s)+": "
s=A.t(b)
r.a+=s},
$S:14}
A.aZ.prototype={
ag(a,b){var s
A.n(this).i("m<1>").a(b)
for(s=b.gG(b);s.v();)this.n(0,s.gC())},
p(a){return A.iq(this,"{","}")},
$im:1,
$iaP:1}
A.d0.prototype={}
A.e2.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.eV(b):s}},
gk(a){return this.b==null?this.c.a:this.aH().length},
gZ(a){return this.gk(0)===0},
gaA(){if(this.b==null){var s=this.c
return new A.T(s,A.n(s).i("T<1>"))}return new A.e3(this)},
u(a,b,c){var s,r,q=this
A.G(b)
if(q.b==null)q.c.u(0,b,c)
else if(q.aD(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.dr().u(0,b,c)},
ag(a,b){t.P.a(b).aF(0,new A.h7(this))},
aD(a){if(this.b==null)return this.c.aD(a)
return Object.prototype.hasOwnProperty.call(this.a,a)},
K(a,b){if(this.b!=null&&!this.aD(b))return null
return this.dr().K(0,b)},
l(a){var s,r=this
if(r.b==null)r.c.l(0)
else{if(r.c!=null)B.b.l(r.aH())
r.a=r.b=null
s=t.z
r.c=A.a8(s,s)}},
aF(a,b){var s,r,q,p,o=this
t.cA.a(b)
if(o.b==null)return o.c.aF(0,b)
s=o.aH()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.hJ(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.d(A.aq(o))}},
aH(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.h(Object.keys(this.a),t.s)
return s},
dr(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.a8(t.N,t.z)
r=n.aH()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.u(0,o,n.h(0,o))}if(p===0)B.b.n(r,"")
else B.b.l(r)
n.a=n.b=null
return n.c=s},
eV(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.hJ(this.a[a])
return this.b[a]=s}}
A.h7.prototype={
$2(a,b){this.a.u(0,A.G(a),b)},
$S:71}
A.e3.prototype={
gk(a){return this.a.gk(0)},
aE(a,b){var s=this.a
if(s.b==null)s=s.gaA().aE(0,b)
else{s=s.aH()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gG(a){var s=this.a
if(s.b==null){s=s.gaA()
s=s.gG(s)}else{s=s.aH()
s=new J.bt(s,s.length,A.a1(s).i("bt<1>"))}return s}}
A.hB.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:9}
A.hA.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:9}
A.dk.prototype={}
A.dm.prototype={}
A.dx.prototype={
dI(a,b){var s=A.mY(a,this.gft().a)
return s},
gft(){return B.a5}}
A.eH.prototype={}
A.f6.prototype={
fj(a){return new A.hz(this.a).eA(t.L.a(a),0,null,!0)}}
A.hz.prototype={
eA(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.bB(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.mg(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.mf(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bN(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.mh(o)
l.b=0
throw A.d(A.dn(m,a,p+l.c))}return n},
bN(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.J(b+c,2)
r=q.bN(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bN(a,s,c,d)}return q.fm(a,b,c,d)},
fm(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.c4(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.cH(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.cH(h)
e.a+=p
break
case 65:p=A.cH(h)
e.a+=p;--d
break
default:p=A.cH(h)
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
p=A.cH(a[l])
e.a+=p}else{p=A.lD(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.cH(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.fw.prototype={
p(a){return this.eE()}}
A.K.prototype={
gaR(){return A.lv(this)}}
A.dg.prototype={
p(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.ev(s)
return"Assertion failed"}}
A.b0.prototype={}
A.aN.prototype={
gbQ(){return"Invalid argument"+(!this.a?"(s)":"")},
gbP(){return""},
p(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.t(p),n=s.gbQ()+q+o
if(!s.a)return n
return n+s.gbP()+": "+A.ev(s.gce())},
gce(){return this.b}}
A.aY.prototype={
gce(){return A.jV(this.b)},
gbQ(){return"RangeError"},
gbP(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.t(q):""
else if(q==null)s=": Not greater than or equal to "+A.t(r)
else if(q>r)s=": Not in inclusive range "+A.t(r)+".."+A.t(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.t(r)
return s}}
A.dp.prototype={
gce(){return A.k(this.b)},
gbQ(){return"RangeError"},
gbP(){if(A.k(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$iaY:1,
gk(a){return this.f}}
A.cN.prototype={
p(a){return"Unsupported operation: "+this.a}}
A.dO.prototype={
p(a){return"UnimplementedError: "+this.a}}
A.bh.prototype={
p(a){return"Bad state: "+this.a}}
A.dl.prototype={
p(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.ev(s)+"."}}
A.dE.prototype={
p(a){return"Out of Memory"},
gaR(){return null},
$iK:1}
A.cJ.prototype={
p(a){return"Stack Overflow"},
gaR(){return null},
$iK:1}
A.fx.prototype={
p(a){return"Exception: "+this.a}}
A.X.prototype={
p(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.p.bH(e,0,75)+"..."
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
k=""}return g+l+B.p.bH(e,i,j)+k+"\n"+B.p.ad(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.t(f)+")"):g}}
A.m.prototype={
an(a,b){var s
A.n(this).i("x(m.E)").a(b)
for(s=this.gG(this);s.v();)if(b.$1(s.gC()))return!0
return!1},
gk(a){var s,r=this.gG(this)
for(s=0;r.v();)++s
return s},
gZ(a){return!this.gG(this).v()},
gbw(a){return!this.gZ(this)},
ga6(a){var s=this.gG(this)
if(!s.v())throw A.d(A.ar())
return s.gC()},
gac(a){var s,r=this.gG(this)
if(!r.v())throw A.d(A.ar())
do s=r.gC()
while(r.v())
return s},
gae(a){var s,r=this.gG(this)
if(!r.v())throw A.d(A.ar())
s=r.gC()
if(r.v())throw A.d(A.ip())
return s},
aE(a,b){var s,r
A.iz(b,"index")
s=this.gG(this)
for(r=b;s.v();){if(r===0)return s.gC();--r}throw A.d(A.jj(b,b-r,this,"index"))},
p(a){return A.lf(this,"(",")")}}
A.be.prototype={
p(a){return"MapEntry("+A.t(this.a)+": "+A.t(this.b)+")"}}
A.V.prototype={
gS(a){return A.i.prototype.gS.call(this,0)},
p(a){return"null"}}
A.i.prototype={$ii:1,
E(a,b){return this===b},
gS(a){return A.cG(this)},
p(a){return"Instance of '"+A.dG(this)+"'"},
gV(a){return A.nr(this)},
toString(){return this.p(this)}}
A.ea.prototype={
p(a){return""},
$iam:1}
A.c4.prototype={
gk(a){return this.a.length},
p(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.eS.prototype={
p(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.eB.prototype={
$2(a,b){var s=t.g
this.a.ck(new A.ez(s.a(a)),new A.eA(s.a(b)),t.X)},
$S:16}
A.ez.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:17}
A.eA.prototype={
$2(a,b){var s=A.mt(A.bo(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:18}
A.i6.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.u(A.at("Future already completed"))
s.bK(r.i("1/").a(a))
return null},
$S:3}
A.i7.prototype={
$1(a){if(a==null)return this.a.dG(new A.eS(a===undefined))
return this.a.dG(a)},
$S:3}
A.eC.prototype={
fl(a,b,c,d){var s
t.L.a(a)
s=A.iy(32768)
this.fq(A.im(a,B.o,null,null),s,b,!0,!1)
return s.b3()},
fq(a,b,c,d,e){return A.nl(b,c,new A.eD(a,!1,!0))}}
A.eD.prototype={
$1(a){return B.O.fp(this.a,a,this.c,this.b)},
$S:19}
A.h_.prototype={
fs(a,b,c,d,e){var s,r,q,p=d===!0,o=a.a
a.a=B.o
r=p
s=r
try{q=A.kl("gzip",!1,p,new A.h0(this,a,b,!1,!1,s))
return q}finally{a.sdD(o)}},
fp(a,b,c,d){return this.fs(a,b,!1,c,d)},
eC(a,b,c,d,e){var s,r,q,p,o,n=0
for(;;){s=a.c
r=a.d
r===$&&A.C()
if(!(s<r))break
if(!this.eX(a,e)){if(n!==0)return!1
a.c=s
return B.P.fo(a,b,!1,!1)}q=b.gk(b)
p=new A.dq(a,b,!0)
p.cU()
if(!p.f)return!1
s=a.b
if((s==null?0:s.length-a.c)<8)return!1
a.b0()
o=a.b0()
b.dL()
if(B.a.M(b.gk(b)-q,4294967296)!==o)return!1;++n}return n!==0},
eX(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gk(0)<10)return!1
s=a.c
if(a.by()!==35615)return!1
if(a.ai()!==8)return!1
r=a.ai()
if(b&&(r&224)!==0)return!1
a.b0()
a.ai()
a.ai()
if((r&4)!==0){if(a.gk(0)<2)return!1
q=a.by()
if(a.gk(0)<q)return!1
a.dU(q)}if((r&8)!==0)if(!this.d9(a))return!1
if((r&16)!==0)if(!this.d9(a))return!1
if((r&2)!==0){if(a.gk(0)<2)return!1
if(b){p=a.by()
o=a.bG(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.C()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bG(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.nq(i.h1(),n)}if((n&65535)!==p)throw A.d(A.l0("Invalid gzip header checksum"))}else a.by()}return!0},
d9(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.C()
if(!(s<r))break
r=a.b
r.toString
a.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1}}
A.h0.prototype={
$0(){var s=this
return s.a.eC(s.b,s.c,s.d,s.e,s.f)},
$S:10}
A.eE.prototype={
ec(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
for(s=0;s<a0;++s){r=a1[s]
if(r>a.b)a.b=r
if(r<a.c)a.c=r}r=a.b
if(r>15)throw A.d(B.R)
q=r+1
p=new Uint16Array(q)
for(o=0;o<a0;++o){n=a1[o]
if(n!==0){if(!(n>=0&&n<q))return A.a(p,n)
m=p[n]
if(!(n<q))return A.a(p,n)
p[n]=m+1}}for(l=1,k=1;k<=r;++k){l=(l<<1>>>0)-p[k]
if(l<0)throw A.d(B.a1)}if(l>0)q=r>(a2?0:1)
else q=!1
if(q)throw A.d(B.a0)
j=B.a.a8(1,r)
r=a.a=new Uint32Array(j)
for(q=a.b,m=a1.length,i=1,h=0,g=2;i<=q;){for(f=i<<16,s=0;s<a0;++s){if(!(s<m))return A.a(a1,s)
if(a1[s]===i){for(e=h,d=0,c=0;c<i;++c){d=(d<<1|e&1)>>>0
e=e>>>1}for(b=(f|s)>>>0,c=d;c<j;c+=g){if(!(c>=0&&c<j))return A.a(r,c)
r[c]=b}++h}}++i
h=h<<1>>>0
g=g<<1>>>0}}}
A.f8.prototype={}
A.hD.prototype={
fo(a,b,c,d){var s,r=!1,q=a.a
a.a=B.r
try{s=A.kl("zlib",!1,r,new A.hE(this,a,b,!1,!1))
return s}finally{a.sdD(q)}},
eg(a,b,c,d){var s,r,q,p,o,n,m=a.c,l=a.d
l===$&&A.C()
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
if(B.a.M(q*256+p,31)!==0)return!1
if((p>>>5&1)!==0){a.b0()
return!1}m=new A.bA(new Uint8Array(32768),B.o)
o=new A.dq(a,m,!0)
o.cU()
n=o.c.b3()
if(!o.f){b.ak(n)
return!1}m=a.b
if((m==null?0:m.length-a.c)<4){b.ak(n)
return!1}a.b0()
break A}if(n!=null)b.ak(n)
return!0}}
A.hE.prototype={
$0(){var s=this
return s.a.eg(s.b,s.c,s.d,s.e)},
$S:10}
A.dq.prototype={
gaf(){var s=this.a
if(s==null)return s
s.d===$&&A.C()
return s},
cU(){var s,r,q,p=this
p.w=p.r=0
if(p.gaf()==null)return
s=p.c
if(!(s instanceof A.bA)){p.d=s
p.c=A.iy(32768)}try{for(;;){r=p.gaf()
q=r.c
r=r.d
r===$&&A.C()
if(!(q<r))break
if(!p.eR())return
p.cM(32768)}}finally{p.cM(0)
p.c=s
p.d=null}},
cM(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.b3()
o.ak(A.bj(q,0,r))
p=A.iy(2097152)
p.ak(A.bj(q,r,null))
this.c=p},
eR(){var s,r,q,p=this,o=p.gaf()
if(o!=null){s=o.c
r=o.d
r===$&&A.C()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.a9(3)
s=(q&1)===0
switch(B.a.I(q,1)){case 0:if(p.eT()===-1)return!1
break
case 1:if(p.cK($.kv(),$.ku())===-1)return!1
break
case 2:if(p.eS()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
a9(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gaf()
r=s.c
s=s.d
s===$&&A.C()
if(r>=s)return-1
s=o.gaf()
r=s.b
r.toString
s=s.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
q=r[s]
s=o.r
r=o.w
o.r=(s|B.a.a8(q,r))>>>0
o.w=r+8}r=o.r
p=B.a.f7(1,a)
o.r=B.a.c0(r,a)
o.w=s-a
return(r&p-1)>>>0},
bX(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.C()
s=a.b
while(m.w<s){r=m.gaf()
q=r.c
r=r.d
r===$&&A.C()
if(q>=r)break
r=m.gaf()
q=r.b
q.toString
r=r.c++
if(!(r>=0&&r<q.length))return A.a(q,r)
p=q[r]
r=m.r
q=m.w
m.r=(r|B.a.a8(p,q))>>>0
m.w=q+8}r=m.r
q=(r&B.a.a8(1,s)-1)>>>0
if(!(q<l.length))return A.a(l,q)
o=l[q]
n=o>>>16
if(n===0||n>m.w)return-1
m.r=B.a.c0(r,n)
m.w-=n
return o&65535},
eT(){var s,r,q=this
q.w=q.r=0
s=q.a9(16)
if(s!==(q.a9(16)^65535)>>>0)return-1
if(s>q.gaf().gk(0))return-1
r=q.gaf().dU(s)
q.c.bC(r)
return 0},
eS(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.a9(5)
if(f===-1)return-1
f+=257
if(f>286)return-1
s=g.a9(5)
if(s===-1)return-1;++s
if(s>32)return-1
r=g.a9(4)
if(r===-1)return-1
r+=4
if(r>19)return-1
q=new Uint8Array(19)
for(p=0;p<r;++p){o=g.a9(3)
if(o===-1)return-1
n=B.a8[p]
if(!(n<19))return A.a(q,n)
q[n]=o}m=g.df(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.bY(B.d.gaa(l),0,f)
j=J.bY(B.d.gaa(l),f,s)
if(g.eN(n,m,l)===-1)return-1
i=g.de(k)
n=i==null
h=n?null:g.de(j)
if(n||h==null)return-1
return g.cK(i,h)},
df(a,b){var s,r
t.L.a(a)
try{s=A.il(a,b)
return s}catch(r){if(A.ac(r) instanceof A.X)throw r
else throw r}},
de(a){return this.df(a,!1)},
cK(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.bX(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bB(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.C,r)
q=j.a9(B.C[r])
if(q<0)return-1
if(!(r<29))return A.a(B.B,r)
p=B.B[r]
o=j.bX(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.z,o)
n=j.a9(B.z[o])
if(n<0)return-1
m=B.aa[o]+n
if(m>=1){l=j.c
l=m>l.gk(l)}else l=!0
if(l)return-1
j.c.bA(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gaf()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.C()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
eN(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.bX(b)
if(q===-1)return-1
p=0
switch(q){case 16:if(r===0)return-1
o=k.a9(2)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.f(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=s}break
case 17:o=k.a9(3)
if(o===-1)return-1
o+=3
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.f(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
case 18:o=k.a9(7)
if(o===-1)return-1
o+=11
if(r+o>a)return-1
for(n=c.$flags|0;m=o-1,o>0;o=m,r=l){l=r+1
n&2&&A.f(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=0}s=p
break
default:if(q<0||q>15)return-1
l=r+1
c.$flags&2&&A.f(c)
if(!(r>=0&&r<c.length))return A.a(c,r)
c[r]=q
r=l
s=q
break}}return 0}}
A.dy.prototype={
b8(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.d(A.ij("The decoded data is larger than the "+s+" bytes allowed"))}},
gk(a){return this.b.b},
dL(){return null},
bB(a){this.b8(1)
this.b.bB(a)},
aO(a,b){t.L.a(a)
this.b8(a.length)
this.b.aO(a,b)},
ak(a){return this.aO(a,null)},
bC(a){this.b8(a.gk(0))
this.b.bC(a)},
bA(a,b){this.b8(b)
this.b.bA(a,b)},
au(a,b){return this.b.au(a,b)},
b6(a){return this.au(a,null)}}
A.bZ.prototype={}
A.cm.prototype={}
A.df.prototype={}
A.cn.prototype={
eE(){return"ByteOrder."+this.b}}
A.eY.prototype={
gk(a){return this.c},
aO(a,b){var s
t.L.a(a)
s=A.bj(a,0,a.length)
this.bO(s)},
ak(a){return this.aO(a,null)},
bB(a){var s,r,q,p=this
if(p.r!=null)p.bO(new Uint8Array(A.R(A.h([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.f(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bL()}},
bC(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.C()
if(!(r<q))break
s=a.fW(o,0,J.aB(o))
r=s
if(typeof r!=="number")return r.h8()
if(r<=0)break
this.bO(A.bj(o,0,s))}}finally{a.c=A.k(p)}},
bO(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bL()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.n(0,new Uint8Array(A.R(A.bj(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.P(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bL()}},
bL(){var s=this,r=s.f
if(r===0)return
s.b.n(0,new Uint8Array(A.R(A.bj(s.e,0,r))))
s.f=0},
au(a,b){return A.u(A.aG("a streamed result cannot be read back"))},
b6(a){return this.au(a,null)}}
A.fu.prototype={}
A.dr.prototype={
gk(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.k(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bG(a,b){var s,r=this,q=r.b
if(q==null)return A.im(A.h([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.C()
a=s-b}return A.im(q,r.a,a,b)},
ai(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
fW(a,b,c){var s,r,q,p=this.b
if(p==null)return 0
s=p.length
r=this.c
q=s-r
q=c>q?q:c
if(q<=0)return 0
B.d.P(a,b,b+q,p,r)
this.c+=q
return q},
h1(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gk(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.d(A.al(q,0,r,"position",null))
return J.bY(B.d.gaa(n),o.b.byteOffset+o.c,s)}}
A.ds.prototype={
by(){var s=this.ai(),r=this.ai()
if(this.a===B.r)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
b0(){var s=this,r=s.ai(),q=s.ai(),p=s.ai(),o=s.ai()
if(s.a===B.r)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
dU(a){var s=this,r=s.bG(a,s.c)
s.c=s.c+r.gk(0)
return r},
sdD(a){this.a=t.fA.a(a)}}
A.bA.prototype={
dL(){},
b3(){return J.bY(B.d.gaa(this.c),this.c.byteOffset,this.b)},
bB(a){var s,r,q=this
if(q.b===q.c.length)q.eH()
s=q.c
r=q.b++
s.$flags&2&&A.f(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
aO(a,b){var s,r,q,p,o=this
t.L.a(a)
b=a.length
while(s=o.b,r=s+b,q=o.c,p=q.length,r>p)o.bh(r-p)
B.d.L(q,s,r,a)
o.b+=b},
ak(a){return this.aO(a,null)},
bC(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bh(s+(q?0:r.length-a.c)-n)}if(!q)B.d.P(o,s,s+a.gk(0),r,a.c)
m.b=m.b+a.gk(0)},
bA(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.bh(r-p)
o=s-a
if(a>=b)B.d.P(q,s,r,q,o)
else for(n=q.$flags|0,m=o;s<r;s=l,m=k){l=s+1
k=m+1
if(!(m>=0&&m<p))return A.a(q,m)
j=q[m]
n&2&&A.f(q)
if(!(s>=0))return A.a(q,s)
q[s]=j}i.b+=b},
au(a,b){var s=this
if(a<0)a=s.b+a
if(b==null)b=s.b
else if(b<0)b=s.b+b
return J.bY(B.d.gaa(s.c),s.c.byteOffset+a,b-a)},
b6(a){return this.au(a,null)},
bh(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.L(s,0,q,r)
this.c=s},
eH(){return this.bh(null)},
gk(a){return this.b}}
A.bg.prototype={
bA(a,b){var s,r=this
for(s=-a;b>a;){r.ak(r.b6(s))
b-=a}if(b===a)r.ak(r.b6(s))
else r.ak(r.au(s,b-a))},
b3(){return this.au(0,this.gk(this))}}
A.e7.prototype={}
A.er.prototype={
fG(a,b){var s,r
if(b<=0)return!1
s=this.e.h(0,a)
if(s!=null&&s.a>=b)return!0
r=this.z.h(0,a)
return r!=null&&r.x&&r.f===b&&r.y>=b},
e5(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.ca()
this.a=s},
cr(){this.ax=0
if(this.at.length>65536)this.at=new Uint8Array(65536)},
dY(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this,m=h*e*4
if(d<0||d>=g||b.length<m)return!1
s=new A.F(c,B.a.J(d,4))
r=n.r
q=r.K(0,s)
if(q!=null){r.u(0,s,q)
if(q.a===h&&q.b===e&&q.aw(0,d)){q.fV(d,b,a)
return!0}}if(a!=null){a.a=null
a.b=-1}p=new A.F(c,d)
r=n.d
o=r.K(0,p)
if(o!=null){r.u(0,p,o)
r=o.a
if(n.cL(r,0,r.length,o.b,o.c,b,m))return!0
n.bn(p)}return!1},
h6(a,b,c,d,e,f,g){return this.dY(null,a,b,c,d,e,f,g)},
dS(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a0*c
if(b<0||b>=d||e>65536||e<256||f.b<=0)return!1
s=B.a.J(b,4)*4
r=Math.min(s+4,d)
if(r-s<2)return!1
q=new A.F(a,B.a.J(s,4))
p=f.r
if(p.aD(q)||f.w.aw(0,q))return!1
o=A.h([],t.t)
for(n=f.d,m=s,l=0;m<r;++m){k=n.h(0,new A.F(a,m))
if(k!=null){l+=k.a.length
B.b.n(o,m)}}if(o.length<2)return!1
n=f.w
n.n(0,q)
if(n.a>128)n.K(0,n.ga6(0))
j=e*4
i=f.y
if(i==null||i.length<j)i=f.y=new Uint8Array(j)
h=A.lF(s,o,c,Math.min(B.a.J(f.b,8),l*2),new A.eu(f,a,j),i,a0)
if(h==null)return!1
for(n=o.length,g=0;g<o.length;o.length===n||(0,A.W)(o),++g)f.bn(new A.F(a,o[g]))
n=h.w
f.bS(n)
p.u(0,q,h)
f.x+=n
return!0},
cv(a,b,c,d,e,f,g,h){var s,r,q,p,o,n,m,l,k=h*c*4
if(b<0||b>=g||f.length<k)return B.aG
s=new A.F(a,B.a.J(b,4))
r=this.r.h(0,s)
r=r==null?null:r.aw(0,b)
if(r===!0)this.f0(s)
q=k+B.a.J(k,255)+16
p=e.fA(q)
o=A.ln(f,k,p,e.a,k)
n=o<0||o>=k
if(n){m=k
l=f}else{m=o
l=p}this.eW(l,A.jd(l,0,m),n,m,new A.F(a,b),0)
e.fX(q)
return new A.cd(m,0)},
fu(a){var s,r=this.z.K(0,a)
if(r!=null)try{r.c.c9()}catch(s){}return!1},
fB(a){var s,r,q,p,o=this,n=o.r,m=A.n(n).i("T<1>"),l=m.i("bE<m.E>")
m=A.aV(new A.bE(new A.T(n,m),m.i("x(m.E)").a(new A.es(a)),l),l.i("m.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.W)(m),++s){r=n.K(0,m[s])
if(r!=null)o.x=o.x-r.w}n=o.w
n.eJ(A.n(n).i("x(1)").a(new A.et(a)),!0)
q=o.e.K(0,a)
if(q==null)return
for(n=q.gG(q),m=o.d;n.v();){p=m.K(0,new A.F(a,n.gC()))
if(p!=null)o.f=o.f-p.a.length}},
ca(){var s,r,q,p
for(r=this.z,q=new A.aD(r,r.r,r.e,A.n(r).i("aD<2>"));q.v();){s=q.d
try{s.c.c9()}catch(p){}}r.l(0)},
dE(){var s,r=this
r.d.l(0)
r.e.l(0)
r.f=0
r.r.l(0)
s=r.w
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bT()}r.x=0
r.y=null
r.cr()},
cL(a,b,c,d,e,f,g){var s,r,q
if(A.jd(a,b,c)!==e)return!1
if(d){if(c!==g)return!1
B.d.P(f,0,g,a,b)
return!0}try{s=A.lo(a,b,c,f,g)
r=J.l(s,g)
return r}catch(q){if(A.ac(q) instanceof A.X)return!1
else throw q}},
eW(a,b,c,d,e,f){var s,r,q,p=this,o=p.b
if(o<=0||d>o)return
p.bn(e)
p.bS(d)
s=new Uint8Array(d)
B.d.P(s,0,d,a,f)
p.d.u(0,e,new A.e7(s,c,b))
o=p.e
r=e.a
q=o.h(0,r)
if(q==null){q=A.iu(t.S)
o.u(0,r,q)
o=q}else o=q
o.n(0,e.b)
p.f+=d},
f0(a){var s=this.r.K(0,a)
if(s!=null)this.x=this.x-s.w},
bS(a){var s,r,q,p,o,n,m,l=this
for(s=t.x,r=l.r,q=A.n(r).i("T<1>"),p=l.d,o=A.n(p).i("T<1>");l.f+l.x+a>l.b;)if(p.a!==0){n=new A.T(p,o).gG(0)
if(!n.v())A.u(A.ar())
l.bn(n.gC())}else if(r.a!==0){n=new A.T(r,q).gG(0)
if(!n.v())A.u(A.ar())
m=r.K(0,s.a(n.gC()))
if(m!=null)l.x=l.x-m.w}else break},
bn(a){var s,r,q,p=this,o=p.d.K(0,a)
if(o==null)return
p.f=p.f-o.a.length
s=p.e
r=a.a
q=s.h(0,r)
if(q!=null){q.K(0,a.b)
if(q.a===0)s.K(0,r)}}}
A.eu.prototype={
$2(a,b){var s=this.a,r=s.d.h(0,new A.F(this.b,a)),q=r.a
return s.cL(q,0,q.length,r.b,r.c,b,this.c)},
$S:21}
A.es.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:11}
A.et.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:11}
A.eL.prototype={
fA(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
fX(a){var s=this
if(s.b.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.f5.prototype={}
A.ew.prototype={}
A.b.prototype={
dt(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.dt(a)
s=this.b
if(A.q(s))a.a+="["+A.t(s)+"]"
else{r="."+A.t(s)
a.a+=r}},
p(a){var s,r=new A.c4("")
this.dt(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bF.prototype={
gF(){var s,r=this,q=r.z
if(q===$){s=B.b.ab(r.w,new A.fs(r))
r.z!==$&&A.M()
r.z=s
q=s}return q},
j(a,b){return A.u(new A.f5(b+" at "+a.p(0),null,null))},
ao(a,b,c){if(!t.P.b(b))this.j(c,"Expected object")
return b},
bx(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.q(c)){s=new A.b(b,c)
break A}if(typeof c=="string"){s=new A.b(b,c)
break A}s=b
break A}this.j(s,"Expected finite number")}return a},
O(a,b){return this.bx(a,b,null)},
N(a,b,c){var s,r
t.P.a(a)
t.e.a(c)
for(s=a.gaA(),s=s.gG(s);s.v();){r=s.gC()
if(!c.aw(0,r))this.j(new A.b(b,r),"Unsupported field")}},
e_(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.l(a.h(0,b),0)&&!J.l(a.h(0,b),!1))this.j(new A.b(c,b),"Unsupported nonzero "+b)},
dF(i2,i3,i4,i5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6=this,g7=null,g8="ip",g9="op",h0="Expected object",h1="layers",h2="hasMask",h3="tt",h4="tp",h5="td",h6="masksProperties",h7="pt",h8="shapes",h9="refId",i0="parent",i1=t.P
i1.a(i2)
t.cq.a(i3)
t.e.a(i4)
t.aM.a(i5)
g6.N(i2,B.h,B.aQ)
g6.e_(i2,"ddd",B.h)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=i2.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.ih(n)))m=!(n instanceof A.L&&n.gZ(n))
if(m)g6.j(new A.b(B.h,o),"Unsupported "+o)}g6.b=g6.O(i2.h(0,"w"),new A.b(B.h,"w"))
g6.c=g6.O(i2.h(0,"h"),new A.b(B.h,"h"))
g6.d=g6.O(i2.h(0,g8),new A.b(B.h,g8))
g6.e=g6.O(i2.h(0,g9),new A.b(B.h,g9))
s=g6.O(i2.h(0,"fr"),new A.b(B.h,"fr"))
g6.f=s
if(g6.b<=0||g6.c<=0||s<=0||g6.e<=g6.d)g6.j(B.h,"Invalid bounds/timing")
s=i3==null
l=s?A.a8(t.N,i1):i3
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){k=s[p]
j=i2.h(0,k)
if(j==null)j=[]
if(!q.b(j))g6.j(new A.b(B.h,k),"Expected asset definitions")
for(m=J.cl(j);m.v();){i=m.gC()
if(!i1.b(i))g6.j(new A.b(B.h,k),h0)
h=i.h(0,"id")
if(typeof h!="string")g6.j(new A.b(B.h,k),"Expected asset id")
l.u(0,h,i)}}g=i2.h(0,h1)
if(!q.b(g))g6.j(B.m,"Expected layers")
f=i5==null?A.a8(t.bP,t.B):i5
e=new A.hj(g6,g,new A.ae(t.gt),new A.bL(t.ai))
s=t.S
r=t.E
d=A.a8(s,r)
c=A.a8(r,s)
b=A.h([],t.f)
a=A.a8(r,t.eG)
for(s=J.O(g),m=g6.w,a0=t.n,a1=t.bE,a2=t.A,a3=t.U,a4=t.c2,a5=g6.a,a6=t.N,a7=t.z,a8=0;a8<s.gk(g);++a8){a9=new A.b(B.m,a8)
b0=s.h(g,a8)
if(!i1.b(b0))g6.j(a9,h0)
g6.N(b0,a9,B.aP)
b1=b0.h(0,"bm")
if(b1==null)b1=0
if(!A.q(b1)||b1<0||b1>16)g6.j(new A.b(a9,"bm"),"Blend mode "+A.t(b1))
for(b2=["ddd","ao"],b3=b2.length,p=0;p<b3;++p)g6.e_(b0,b2[p],a9)
if(b0.h(0,h2)!=null&&!A.b8(b0.h(0,h2))&&!J.l(b0.h(0,h2),0)&&!J.l(b0.h(0,h2),1))g6.j(new A.b(a9,h2),"Expected boolean hasMask")
b4=b0.h(0,h3)
if(b4==null)b4=0
if(!A.q(b4)||b4<0||b4>4)g6.j(new A.b(a9,h3),"Matte type")
if(b0.h(0,h4)!=null&&!J.l(b0.h(0,h4),0)){b2=!0
if(b4!==0)if(a8!==0){b2=b0.h(0,h4)
b3=a8-1
b5=J.ad(s.h(g,b3),"ind")
b2=!J.l(b2,b5==null?b3:b5)}if(b2)g6.j(new A.b(a9,h4),"Unsupported nonzero tp")}if(b0.h(0,h5)!=null&&!J.l(b0.h(0,h5),0)&&!J.l(b0.h(0,h5),1))g6.j(new A.b(a9,h5),"Matte source flag")
b6=b0.h(0,h6)
b7=g7
if(b6!=null){if(!q.b(b6))g6.j(new A.b(a9,h6),"Expected list")
b2=J.O(b6)
if(b2.gbw(b6)){b7=A.h([],a1)
for(b8=0;b8<b2.gk(b6);++b8){b9=new A.b(new A.b(a9,h6),b8)
b3=b2.h(b6,b8)
if(!i1.b(b3))g6.j(b9,h0)
g6.N(b3,b9,B.aO)
c0=J.l(b3.h(0,"inv"),!0)
c1=A.hF(b3.h(0,"mode"))
if(c1==null)c1="a"
if(!B.aW.aw(0,c1))g6.j(new A.b(b9,"mode"),"Unsupported mask mode "+c1)
if(b3.h(0,h7)==null)g6.j(new A.b(b9,h7),"Missing mask path")
c2=g6.d0(b3.h(0,h7),new A.b(b9,h7))
if(b3.h(0,"o")!=null)c3=g6.H(b3.h(0,"o"),new A.b(b9,"o"),1,A.h([100],a0))
else{b5=new Float32Array(A.R(A.h([100],a0)))
c3=new A.z(b5,g7,!1,new Float32Array(0),!1)}B.b.n(b7,new A.a2(c2,c1,c3,c0,b3.h(0,"x")!=null?g6.H(b3.h(0,"x"),new A.b(b9,"x"),1,A.h([0],a0)):g7))}}}g6.fd(b0,q.a(q.b(b0.h(0,h8))?b0.h(0,h8):B.A),a9,b)
b2=b0.h(0,"sr")
if(b2==null)b2=1
c4=g6.O(b2,new A.b(a9,"sr"))
if(c4===0)g6.j(new A.b(a9,"sr"),"Invalid zero time stretch")
c5=b0.h(0,"ty")
b2=J.ap(c5)
if(!b2.E(c5,4)&&!b2.E(c5,3)&&!b2.E(c5,0)&&!b2.E(c5,1))g6.j(new A.b(a9,"ty"),"Layer type "+A.t(c5))
c6=g6.eD(b0.h(0,"ef"),new A.b(a9,"ef"),g)
c7=c6.a
c8=c6.b
c9=g6.eO(b0.h(0,"sy"),new A.b(a9,"sy"))
if(c9!=null&&c7!=null)g6.j(new A.b(a9,"ef"),"Fill with Inner Shadow")
b3=c8==null
b5=!b3
if(b5)d0=!b2.E(c5,4)||b4!==0||b1!==0
else d0=!1
if(d0)g6.j(c8.b,"Set Matte requires a normal shape layer without a track matte")
d1=g6.dm(b0.h(0,"ks"),new A.b(a9,"ks"))
if(b2.E(c5,4))d2=g6.cS(b0.h(0,h8),new A.b(a9,h8),e)
else if(b2.E(c5,1)){d0=b0.h(0,"sw")
if(d0==null)d0=0
d3=g6.O(d0,new A.b(a9,"sw"))
d0=b0.h(0,"sh")
if(d0==null)d0=0
d4=g6.O(d0,new A.b(a9,"sh"))
d5=b0.h(0,"sc")
if(typeof d5!="string"||!B.p.e6(d5,"#"))g6.j(new A.b(a9,"sc"),"Invalid solid color")
d6=A.nx(B.p.e9(d5,1),16)
d0=B.a.I(d6,16)
d7=B.a.I(d6,8)
d8=new Float32Array(A.R(A.h([d3*0.5,d4*0.5],a0)))
d9=new Float32Array(0)
e0=new Float32Array(A.R(A.h([d3,d4],a0)))
e1=new Float32Array(0)
e2=new Float32Array(A.R(A.h([0],a0)))
e3=new A.P(new A.aJ(!1,!1,new A.z(d8,g7,!1,d9,!1),new A.z(e0,g7,!1,e1,!1),new A.z(e2,g7,!1,new Float32Array(0),!1)))
d0=new Float32Array(A.R(A.h([(d0&255)/255,(d7&255)/255,(d6&255)/255],a0)))
e4=new A.z(d0,g7,!1,new Float32Array(0),!1)
e4.f=!0
d0=new Float32Array(A.R(A.h([100],a0)))
d7=new Float32Array(0)
d8=new Float32Array(A.R(A.h([1],a0)))
d9=new Float32Array(0)
e5=A.iH(A.h([e3],a2),e4,new A.z(d0,g7,!1,d7,!1),new A.z(d8,g7,!1,d9,!1),!1,!1,1,1,4,g7,g7)
d9=A.h([e3],a2)
d8=A.h([e5],a3)
d7=new Float32Array(A.R(A.h([0,0],a0)))
d0=new Float32Array(0)
e0=new Float32Array(A.R(A.h([0,0],a0)))
e1=new Float32Array(0)
e2=new Float32Array(A.R(A.h([100,100],a0)))
e6=new Float32Array(0)
e7=new Float32Array(A.R(A.h([0],a0)))
e8=new Float32Array(0)
e9=new Float32Array(A.R(A.h([100],a0)))
d2=A.iF(d9,d8,new A.bQ(new A.z(d7,g7,!1,d0,!1),new A.z(e0,g7,!1,e1,!1),new A.z(e2,g7,!1,e6,!1),new A.z(e7,g7,!1,e8,!1),new A.z(e9,g7,!1,new Float32Array(0),!1),g7,g7,g7,g7))}else d2=g7
if(b2.E(c5,0)){h=b0.h(0,h9)
f0=l.h(0,h)
if(typeof h!="string"||f0==null||!q.b(f0.h(0,h1)))g6.j(new A.b(a9,h9),"Missing precomposition")
if(i4.aw(0,h))g6.j(new A.b(a9,h9),"Cyclic precomposition")
b2=b0.h(0,"w")
if(b2==null)b2=g6.b
f1=g6.O(b2,new A.b(a9,"w"))
b2=b0.h(0,"h")
if(b2==null)b2=g6.c
f2=g6.O(b2,new A.b(a9,"h"))
f3=new A.a0(h,f1,f2)
f4=f.h(0,f3)
if(f4==null){f4=A.iC(a5)
b2=A.lk(["w",f1,"h",f2,"ip",0,"op",g6.e-g6.d,"fr",g6.f,"layers",f0.h(0,h1)],a6,a7)
d0=A.ll(a6)
d0.ag(0,i4)
d0.n(0,h)
f4.dF(b2,l,d0,f)
f.u(0,f3,f4)}f5=new A.e_(new A.ae(a4)).cq(f4)
g6.x=g6.x+f5.x
g6.y=B.t.bE(g6.y,f5.y)}else f5=g7
f6=b0.h(0,"tm")!=null?g6.H(b0.h(0,"tm"),new A.b(a9,"tm"),1,A.h([0],a0)):g7
b2=b0.h(0,g8)
if(b2==null)b2=g6.d
b2=g6.O(b2,new A.b(a9,g8))
d0=b0.h(0,g9)
if(d0==null)d0=g6.e
d0=g6.O(d0,new A.b(a9,g9))
d7=J.l(b0.h(0,"hd"),!0)
d8=b0.h(0,"st")
if(d8==null)d8=0
d8=g6.O(d8,new A.b(a9,"st"))
f7=A.jC(d1,d2,b2,d0,d7,b1,f5,c7,c9,b7,b3?b4:1,d8,c4,f6,b5)
if(b5)a.u(0,f7,c8)
B.b.n(m,f7)
h=b0.h(0,"ind")
if(h==null)h=a8
if(!A.q(h)||d.aD(h))g6.j(new A.b(a9,"ind"),"Invalid/duplicate layer id")
d.u(0,h,f7)
if(b0.h(0,i0)!=null){if(!A.q(b0.h(0,i0)))g6.j(new A.b(a9,i0),"Invalid parent id")
c.u(0,f7,A.k(b0.h(0,i0)))}}for(a8=0;a8<m.length;++a8){f7=m[a8]
if(f7.y!==0&&!f7.ax){if(a8===0)g6.j(new A.b(new A.b(B.m,a8),h3),"Missing preceding matte source")
i1=a8-1
if(!(i1>=0&&i1<m.length))return A.a(m,i1)
f8=m[i1]
if(f8.y!==0)g6.j(new A.b(new A.b(B.m,a8),h3),"Chained matte")
f7.ay=f8
f8.ch=!0
g6.x+=4}}for(i1=new A.bx(a,a.$ti.i("bx<1,2>")).gG(0);i1.v();){f9=i1.d
g0=f9.a
g1=f9.b
f8=d.h(0,g1.a)
q=!0
if(f8!=null)if(f8.b!=null)if(!f8.e)q=f8!==g0&&f8.y!==0
if(q)g6.j(g1.b,"Set Matte requires a visible shape source without its own matte")
g0.ay=f8
g6.x+=4}for(a8=0;a8<m.length;++a8){if(J.l(J.ad(s.h(g,a8),h5),1)){if(!(a8<m.length))return A.a(m,a8)
i1=!m[a8].ch}else i1=!1
if(i1)g6.j(new A.b(new A.b(B.m,a8),h5),"Unpaired matte source")}for(i1=new A.bx(c,c.$ti.i("bx<1,2>")).gG(0);i1.v();){g2=i1.d
s=g2.b
g3=d.h(0,s)
if(g3==null)g6.j(B.m,"Missing parent "+s)
g2.a.cy=g3}for(i1=m.length,p=0;p<m.length;m.length===i1||(0,A.W)(m),++p){f7=m[p]
g4=A.iu(r)
for(g5=f7;g5!=null;g5=g5.cy)if(!g4.n(0,g5))g6.j(B.m,"Cyclic parenting")}},
fi(a){return this.dF(a,null,B.aV,null)},
aq(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
for(s=g.w,r=s.length-1,q=null;r>=0;--r){if(!(r<s.length))return A.a(s,r)
p=s[r]
if(!p.ch){if(!p.e)o=(p.b!=null||p.f!=null)&&a>=p.c&&a<p.d
else o=!1
o=!o}else o=!0
if(o)continue
o=p.a.e.m(a)
if(0>=o.length)return A.a(o,0)
if(B.c.D(B.a.A(B.c.W(255*B.c.D(o[0])/100),0,255)*p.aQ(a)/255)===0)continue
n=p.ay
m=p.aq(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.m(a)
if(0>=o.length)return A.a(o,0)
k=B.c.D(B.a.A(B.c.W(255*B.c.D(o[0])/100),0,255)*n.aQ(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.aq(a)
if(j==null)continue
m=m.bv(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.bU(q,m)}if(q==null)return null
i=g.r
if(i===$){s=g.b
s===$&&A.C()
o=g.c
o===$&&A.C()
i=g.r=new A.a6(0,0,0+s,0+o)}h=q.bv(i)
return h.gZ(0)?null:h},
dm(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.a8(t.N,t.z):i.ao(0,a,b)
i.N(g,b,B.b1)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.j(new A.b(b,p),"3D transform")}s=t.n
o=i.H(g.h(0,"sk"),new A.b(b,"sk"),1,A.h([0],s))
n=i.H(g.h(0,"sa"),new A.b(b,"sa"),1,A.h([0],s))
m=g.h(0,h)
if(m instanceof A.L&&J.l(m.h(0,"s"),!0)){l=i.ao(0,m,new A.b(b,h))
i.N(l,new A.b(b,h),B.aS)
k=i.H(l.h(0,"x"),new A.b(new A.b(b,h),"x"),1,A.h([0],s))
j=i.H(l.h(0,"y"),new A.b(new A.b(b,h),"y"),1,A.h([0],s))
m=null}else{k=null
j=null}return A.iL(i.H(g.h(0,"a"),new A.b(b,"a"),2,A.h([0,0],s)),i.H(m,new A.b(b,h),2,A.h([0,0],s)),i.fc(g.h(0,"s"),new A.b(b,"s"),2,A.h([100,100],s),100),i.H(g.h(0,"r"),new A.b(b,"r"),1,A.h([0],s)),i.H(g.h(0,"o"),new A.b(b,"o"),1,A.h([100],s)),k,j,o,n)},
eD(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aH
if(!b0.b(b1))a4.j(b2,"Expected effects array")
for(s=J.bp(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.O(b1),n<m.gk(b1);++n){l=new A.b(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.j(new A.b(b2,n),a5)
a4.N(m,l,B.aY)
k=J.l(m.h(0,a6),21)&&J.l(m.h(0,a7),"ADBE Fill")
j=J.l(m.h(0,a6),28)&&J.l(m.h(0,a7),"ADBE Set Matte3")
i=J.l(m.h(0,a6),5)&&J.l(m.h(0,a7),"ADBE Layer Control")
h=!k
if(h&&!j&&!i)a4.j(l,"Unsupported visual effect")
if(J.l(m.h(0,a8),0)||J.l(m.h(0,a8),!1))continue
if(m.h(0,a8)!=null&&!J.l(m.h(0,a8),1)&&!J.l(m.h(0,a8),!0))a4.j(new A.b(l,a8),"Invalid effect enabled flag")
if(!h||j){if(p!=null||o!=null)a4.j(l,"Multiple visual effects")
g=k?B.a6:B.a9
f=m.h(0,a9)
if(!b0.b(f)||J.aB(f)!==g.length)a4.j(new A.b(l,a9),"Invalid effect parameters")
e=new A.fi(a4,l,f,g)
d=new A.fj(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.dZ(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aB,B.aC,B.aD,B.aE,B.aF],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.m(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.b(new A.b(new A.b(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.dV(a0))a4.j(a1,"Expected a static layer index")
o=new A.F(B.c.W(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.aB(a2)!==1)a4.j(l,"Invalid layer control")
m=J.ja(a2)
if(!q.b(m))a4.j(new A.b(new A.b(l,a9),0),a5)
a4.N(m,new A.b(new A.b(l,a9),0),B.E)
if(!J.l(m.h(0,a6),10)||!J.l(m.h(0,a7),"ADBE Layer Control-0001"))a4.j(l,"Unsupported effect control")
a=a4.H(m.h(0,"v"),new A.b(new A.b(new A.b(l,a9),0),"v"),1,A.h([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.dV(a0))h=a0!==0&&!s.an(b3,new A.fh(a0))
else h=!0
if(h)a4.j(l,"Missing layer control target")}}return new A.F(p,o)},
eO(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.ih(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.aB(a)!==1)d.j(b,"Expected one Inner Shadow style")
r=new A.b(b,0)
q=d.ao(0,J.ja(a),r)
if(!J.l(q.h(0,"ty"),2))d.j(new A.b(r,"ty"),"Unsupported layer style")
d.N(q,r,B.aM)
p=new A.fo(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.l(p.$2(m,0),0))d.j(new A.b(r,m),"Unsupported Inner Shadow parameter")}if(!J.l(p.$2("bm",1),1))d.j(new A.b(r,"bm"),"Inner Shadow requires Multiply")
l=d.H(q.h(0,"c"),new A.b(r,"c"),3,A.h([0,0,0],t.n))
if(l.a==null)d.j(new A.b(r,"c"),"Animated Inner Shadow")
k=l.m(0)
s=p.$2("o",100)
if(typeof s!=="number")return s.ad()
j=B.a.A(B.c.D(s*255/100),0,255)
s=p.$2("a",0)
if(typeof s!=="number")return s.M()
i=B.c.M(s,360)*3.141592653589793/180
h=p.$2("d",0)
if(h<0)d.j(new A.b(r,"d"),"Negative Inner Shadow distance")
if(h===0||j===0)return null
s=Math.cos(i)
o=Math.sin(i)
g=k.length
if(0>=g)return A.a(k,0)
f=B.a.A(B.c.D(k[0]*255),0,255)
if(1>=g)return A.a(k,1)
e=B.a.A(B.c.D(k[1]*255),0,255)
if(2>=g)return A.a(k,2)
return A.jB(-s*h,o*h,(j<<24|f<<16|e<<8|B.a.A(B.c.D(k[2]*255),0,255))>>>0)},
c6(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
t.ew.a(d)
t.ae.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.j7()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.q(n)?new A.b(p,n):new A.b(p,A.G(n))}if(this.f2(a,r,b,p,e==null?new A.bL(t.ao):e))return}for(q=a.gaA(),q=q.gG(q),m=t.j;q.v();){l=q.gC()
k=a.h(0,l)
if(!s.b(k)&&!m.b(k))continue
B.b.n(d,l)
this.c6(k,b,c,d,e,l==="ks"&&J.l(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a))for(m=J.O(a),j=0;j<m.gk(a);++j){k=m.h(a,j)
if(!s.b(k)&&!q.b(k))continue
B.b.n(d,j)
this.ds(k,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
fd(a,b,c,d){return this.c6(a,b,c,d,null,!1)},
ds(a,b,c,d,e){return this.c6(a,b,c,d,e,!1)},
f2(a,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b=null
t.P.a(a)
t.bC.a(a3)
if(!a3.n(0,a))c.j(a2,"Cyclic expression reference")
try{i=$.kI()
if(i.b.test(a0)){a.K(0,"x")
return!0}s=new A.b(a2,"x")
r=$.kG().dK(a0)
if(r==null)c.j(s,"Unsupported expression syntax")
q=a1
p=null
i=$.j6()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dv(0,h)
h=new A.c5(h.a,h.b,h.c)
i=t.j
g=t.d
while(h.v()){f=h.d
o=f==null?g.a(f):f
e=o.b
if(1>=e.length)return A.a(e,1)
e=e[1]
e.toString
n=e
e=$.kH()
d=A.G(n)
m=e.b.test(d)?B.x.dI('"'+A.t(n)+'"',b):n
p=c.c4(q,"nm",A.G(m))
if(p==null)c.j(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.A)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=c.c4(q,"ty","tr")
l=i==null?b:i.h(0,"s")
break
case"transform.rotation":i=c.c4(q,"ty","tr")
l=i==null?b:i.h(0,"r")
break
default:i=p
l=i==null?b:J.ad(i,"o")
break}k=l
j=c.ao(0,k,s)
if(j===a){a.K(0,"x")
return!0}c.ds(j,a1,s,A.h([],t.f),a3)
a.l(0)
a.ag(0,j)
return!1}finally{a3.K(0,a)}},
c4(a,b,c){var s,r,q,p
for(s=J.cl(a),r=t.P,q=null;s.v();){p=s.gC()
if(!r.b(p)||!J.l(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q},
d0(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b={}
b.a=b.b=null
b.c=!1
s=c.dk(a,a0,-1,A.h([],t.n),new A.fp(b,c,a))
r=A.h([],t.hg)
q=s.b
if(q!=null&&b.c){p=b.a
p.toString
o=q.a.length
n=A.jm(o,!1,!1,t.y)
m=b.b
m.toString
for(l=p.length,k=m,j=0;j<o;++j){m=j*2
i=m<l
h=i?p[m]:0
if(i){++m
if(!(m<l))return A.a(p,m)
g=p[m]}else g=0
B.b.u(n,j,h===0?k:h===1)
k=g===0?n[j]:g===1}for(m=o-1,i=q.d,f=i.length,j=0;j<o;++j){e=j*2
if(e<l){++e
if(!(e<l))return A.a(p,e)
g=p[e]}else g=0
e=n[j]
if(!(j<f))return A.a(i,j)
if((i[j]&1)!==0)d=e
else d=g!==0?g===1:B.b.h(n,Math.min(j+1,m))
B.b.n(r,new A.F(e,d))}}c.x=c.x+(s.gcm()/6|0)
p=b.b
return new A.au(s,p!==!1,r)},
cS(e4,e5,e6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8=this,d9=null,e0="ks",e1="d",e2="Path direction",e3="r"
if(!t.j.b(e4))d8.j(e5,"Expected shape list")
s=t.A
r=A.h([],s)
q=A.h([],t.U)
p=A.m3()
for(o=t.P,n=t.aT,m=t.eU,l=m.i("m.E"),k=t.n,j=t.u,i=t.S,h=t.V,g=t.fq,f=t.bs,e=t.fP,d=!1,c=0;b=J.O(e4),c<b.gk(e4);++c){a=new A.b(e5,c)
a0=b.h(e4,c)
if(!o.b(a0))d8.j(a,"Expected object")
a1=a0.h(0,"ty")
a2=a0.h(0,"bm")
if(a2==null)a2=0
if(!A.q(a2)||a2<0||a2>16)d8.j(new A.b(a,"bm"),"Blend mode "+A.t(a2))
a3=J.l(a0.h(0,"hd"),!0)
switch(a1){case"tr":if(d||c!==b.gk(e4)-1)d8.j(a,"Transform must be last and unique")
p=d8.dm(a0,a)
d=!0
break
case"gr":d8.N(a0,a,B.aR)
a4=d8.cS(a0.h(0,"it"),new A.b(a,"it"),e6)
if(!a3){B.b.n(r,a4)
B.b.n(q,a4)}break
case"sh":d8.N(a0,a,B.aT)
if(a0.h(0,e0)==null)d8.j(new A.b(a,e0),"Missing path data")
a5=e6.cp(a0.h(0,e0),new A.b(a,e0))
if(!a3)B.b.n(r,new A.P(a5))
break
case"rc":case"el":d8.N(a0,a,B.aZ)
if(a0.h(0,e1)!=null&&!J.l(a0.h(0,e1),1)&&!J.l(a0.h(0,e1),2)&&!J.l(a0.h(0,e1),3))d8.j(new A.b(a,e1),e2)
a6=d8.aX(a0.h(0,"p"),new A.b(a,"p"),2,A.h([0,0],k),!0)
a7=d8.aX(a0.h(0,"s"),new A.b(a,"s"),2,A.h([0,0],k),!0)
a8=d8.H(a0.h(0,e3),new A.b(a,e3),1,A.h([0],k))
d8.x+=8
if(!a3)B.b.n(r,new A.P(new A.aJ(J.l(a1,"el"),J.l(a0.h(0,e1),3),a6,a7,a8)))
break
case"sr":d8.N(a0,a,B.aX)
a9=a0.h(0,"sy")
if(a9==null)a9=1
b=J.ap(a9)
if(!b.E(a9,1)&&!b.E(a9,2))d8.j(new A.b(a,"sy"),"PolyStar type "+A.t(a9))
if(a0.h(0,e1)!=null&&!J.l(a0.h(0,e1),1)&&!J.l(a0.h(0,e1),2)&&!J.l(a0.h(0,e1),3))d8.j(new A.b(a,e1),e2)
b0=d8.H(a0.h(0,"pt"),new A.b(a,"pt"),1,A.h([5],k))
a6=d8.aX(a0.h(0,"p"),new A.b(a,"p"),2,A.h([0,0],k),!0)
b1=d8.H(a0.h(0,e3),new A.b(a,e3),1,A.h([0],k))
b2=d8.H(a0.h(0,"or"),new A.b(a,"or"),1,A.h([0],k))
b3=d8.H(a0.h(0,"os"),new A.b(a,"os"),1,A.h([0],k))
if(b.E(a9,1))if(a0.h(0,"ir")!=null){b4=d8.H(a0.h(0,"ir"),new A.b(a,"ir"),1,A.h([0],k))
b5=b4}else{b4=new Float32Array(A.R(A.h([0],k)))
b4=new A.z(b4,d9,!1,new Float32Array(0),!1)
b5=b4}else b5=d9
if(b.E(a9,1))if(a0.h(0,"is")!=null){b4=d8.H(a0.h(0,"is"),new A.b(a,"is"),1,A.h([0],k))
b6=b4}else{b4=new Float32Array(A.R(A.h([0],k)))
b4=new A.z(b4,d9,!1,new Float32Array(0),!1)
b6=b4}else b6=d9
d8.x+=12
if(!a3)B.b.n(r,new A.P(new A.aQ(b.E(a9,1),J.l(a0.h(0,e1),3),b0,a6,b1,b2,b3,b5,b6)))
break
case"tm":d8.N(a0,a,B.b0)
b7=a0.h(0,"m")
if(b7==null)b7=1
b=J.ap(b7)
if(!b.E(b7,1)&&!b.E(b7,2))d8.j(new A.b(a,"m"),"Trim mode")
b4=A.h([],s)
b8=new A.bR(b4,d8.H(a0.h(0,"s"),new A.b(a,"s"),1,A.h([0],k)),d8.H(a0.h(0,"e"),new A.b(a,"e"),1,A.h([100],k)),d8.H(a0.h(0,"o"),new A.b(a,"o"),1,A.h([0],k)),b.E(b7,2),A.a8(i,h))
if(!a3){b9=A.h([],g)
new A.fn(b9).$1(r)
B.b.ag(b4,new A.U(b9,f.a(new A.fl()),e))
for(c0=0;c0<b9.length;++c0)b9[c0].a=new A.b6(b8,c0)}++d8.x
break
case"fl":case"st":case"gf":case"gs":d8.N(a0,a,B.aK)
b=J.ap(a1)
c1=b.E(a1,"st")||b.E(a1,"gs")
if(c1)d8.y=!0
c2=c1?d8.eB(a0.h(0,e1),new A.b(a,e1)):d9
c3=a0.h(0,e3)
if(c3==null)c3=1
b4=J.ap(c3)
if(!b4.E(c3,1)&&!b4.E(c3,2))d8.j(new A.b(a,e3),"Fill rule")
c4=a0.h(0,"lc")
if(c4==null)c4=1
c5=a0.h(0,"lj")
if(c5==null)c5=1
if(!A.q(c4)||c4<1||c4>3||!A.q(c5)||c5<1||c5>3)d8.j(a,"Stroke cap/join")
c6=d8.H(a0.h(0,"c"),new A.b(a,"c"),3,A.h([0,0,0],k))
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
c9&2&&A.f(c7)
c7[d1]=d2/255}}d4=d8.H(a0.h(0,"o"),new A.b(a,"o"),1,A.h([100],k))
d5=d8.H(a0.h(0,"w"),new A.b(a,"w"),1,A.h([1],k))
if(!a3){c8=A.aV(r,j)
b4=b4.E(c3,2)
c9=a0.h(0,"ml")
if(c9==null)c9=4
c9=d8.O(c9,new A.b(a,"ml"))
B.b.n(q,A.iH(c8,c6,d4,d5,c1,b4,c4,c5,c9,c2,b.E(a1,"gf")||b.E(a1,"gs")?d8.eM(a0,a):d9))}d8.x+=2
break
case"mm":d8.N(a0,a,B.aU)
b7=a0.h(0,"mm")
if(b7==null)b7=1
if(!A.q(b7)||b7<1||b7>5)d8.j(new A.b(a,"mm"),"Shape op mm mode "+A.t(b7))
if(!a3&&r.length!==0){d6=A.aV(new A.bE(r,n.a(new A.fm()),m),l)
if(d6.length===1)d7=b7===4||r.length>1
else d7=!1
B.b.l(r)
if(d6.length!==0)B.b.n(r,d7?B.b.gae(d6):new A.aH(d6,b7))}else if(a3)B.b.l(r);++d8.x
break
default:d8.j(new A.b(a,"ty"),"Shape op "+A.t(a1))}}return A.iF(r,q,p)},
eB(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.j(b,"Expected dash array")
s=A.h([],t.cl)
for(r=t.n,q=t.P,p=null,o=0;n=J.O(a),o<n.gk(a);++o){m=new A.b(b,o)
n=n.h(a,o)
if(!q.b(n))j.j(new A.b(b,o),"Expected object")
j.N(n,m,B.b_)
l=j.H(n.h(0,"v"),new A.b(m,"v"),1,A.h([0],r))
k=n.h(0,"n")
n=J.ap(k)
if(n.E(k,"o")){if(p!=null)j.j(m,"Duplicate dash offset")
p=l}else if(n.E(k,(s.length&1)===0?"d":"g"))B.b.n(s,l)
else j.j(new A.b(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.b.n(s,B.b.gac(s))
return A.jy(s,p==null?A.cf(A.h([0],r)):p)},
eM(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.ao(0,a.h(0,"g"),new A.b(b,"g"))
k.N(s,new A.b(b,"g"),B.b2)
r=s.h(0,"p")
if(!A.q(r)||r<=0)k.j(new A.b(new A.b(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dk(s.h(0,"k"),new A.b(new A.b(b,"g"),"k"),-1,A.h([],q),new A.fk(k,r))
if(!J.l(a.h(0,"t"),1)&&!J.l(a.h(0,"t"),2))k.j(new A.b(b,"t"),"Gradient type")
o=k.aX(a.h(0,"s"),new A.b(b,"s"),2,A.h([0,0],q),!0)
n=k.aX(a.h(0,"e"),new A.b(b,"e"),2,A.h([0,0],q),!0)
m=J.l(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.H(a.h(0,"h"),new A.b(b,"h"),1,A.h([0],q))
return A.jA(r,p,o,n,m,l,a.h(0,"a")==null?null:k.H(a.h(0,"a"),new A.b(b,"a"),1,A.h([0],q)))},
br(a,b,c,d,e,f,g){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return A.cf(d)
s=o.ao(0,a,b)
o.N(s,b,B.F)
if(s.h(0,"a")!=null&&!J.l(s.h(0,"a"),0)&&!J.l(s.h(0,"a"),1))o.j(new A.b(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.l(s.h(0,"x"),""))o.j(new A.b(b,"x"),"Expressions")
r=new A.b(b,"k")
q=s.h(0,"k")
if(!J.l(s.h(0,"a"),1)){if(t.j.b(q)){p=J.O(q)
p=p.gbw(q)&&p.ga6(q) instanceof A.L&&J.ad(p.ga6(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p){p=o.bf(q,r,c,g,e,null,0,0)
return new A.z(p,null,!1,new Float32Array(0),!1)}if(!t.j.b(q)||J.ih(q))o.j(r,"Expected keyframes")
return o.es(q,r,c,g,f,e)},
H(a,b,c,d){return this.br(a,b,c,d,null,!1,0)},
aX(a,b,c,d,e){return this.br(a,b,c,d,null,e,0)},
dk(a,b,c,d,e){return this.br(a,b,c,d,e,!1,0)},
fc(a,b,c,d,e){return this.br(a,b,c,d,null,!1,e)},
dl(a,b,c,d){var s
A.k(c)
if(b==null)return new Float32Array(c)
if(c!==d){s=a.a
s.toString
this.j(s,"Morph topology/component count changes")}return b},
bf(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this
t.c.a(e)
if(e!=null)return e.$5(a,b,f,g,h)
if(f==null)s=new Float32Array(c)
else s=f
if(t.j.b(a)){r=J.O(a)
if(r.gk(a)<c)n.j(b,"Expected "+c+" components")
for(q=0;q<c;++q){p=g+q
o=n.bx(r.h(a,q),b,q)
s.$flags&2&&A.f(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gk(a)>2&&n.O(r.h(a,2),b)!==d)n.j(b,"Non-planar component")}else{if(c!==1)n.j(b,"Expected "+c+" components")
r=n.bx(a,b,0)
s.$flags&2&&A.f(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
es(e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3=this,e4=null,e5="Expected object",e6=t.j
e6.a(e7)
t.c.a(f2)
s=J.bp(e7)
r=s.gac(e7)
q=t.P
p=q.b(r)
o=p?r.h(0,"t"):e4
n=!1
if(p)if(r.h(0,"e")!=null){if(!J.l(r.h(0,"h"),1))if(typeof o=="number"){p=e3.e
p===$&&A.C()
p=o<p}else p=n
else p=n
n=p}p=s.gk(e7)
m=p+(n?1:0)
l=new Float64Array(m)
p=m*3
k=new Int32Array(p)
for(j=s.gG(e7),i=0,h=0,g=!1;j.v();){f=j.gC()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.l(f.h(0,"h"),1))++h
g=B.t.bE(g,f.h(0,"to")!=null)}j=h*(f1?8:4)
e=new Float64Array(j)
if(g)d=new Float32Array(m*4)
else d=e4
c=A.dU()
b=A.dU()
a=A.dU()
a0=A.dU()
for(a1=2*m,a2=m-1,a3=m+i,a4=e3.a.a,a5=e9===2,a6=m,a7=0,a8=0,a9=0;a9<s.gk(e7);++a9){b0=new A.b(e8,a9)
b1=s.h(e7,a9)
if(!q.b(b1))e3.j(b0,e5)
e3.N(b1,b0,B.aN)
b2=b1.h(0,"to")
b3=b1.h(0,"ti")
b4=b2==null
b5=!b4
if(b5)e3.du(b2,"to",e9,b0,d,a9*4)
b6=b3==null
if(!b6)e3.du(b3,"ti",e9,b0,d,a9*4+2)
if(b4!==b6)e3.j(b0,"Incomplete spatial tangents")
b7=e3.bx(b1.h(0,"t"),b0,"t")
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
c0=e3.bf(b8,new A.b(b0,"s"),e9,f0,f2,e4,0,0)
if(b.b!==b)A.u(A.eI(""))
b.b=c0
if(a.b!==a)A.u(A.eI(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.u(A.eI(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.u(A.eI(""))
c.b=b4
b6=a.b
if(b6===a)A.u(A.ag(""))
B.j.L(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.u(A.ag(""))
if(typeof b4!=="number")return A.Z(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.u(A.ag(""))
b6=a.b
if(b6===a)A.u(A.ag(""))
if(typeof b6!=="number")return A.Z(b6)
J.jb(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.u(A.ag(""))
b6=a.b
if(b6===a)A.u(A.ag(""))
e3.bf(b8,new A.b(b0,"s"),e9,f0,f2,b4,c1,b6)}}c2=J.l(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.u(A.ag(""))
if(typeof b4!=="number")return A.Z(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.u(A.ag(""))
b5=a.b
if(b5===a)A.u(A.ag(""))
e3.bf(b9,new A.b(b0,"e"),e9,f0,f2,b4,c1,b5)
b4=m+a9
k.$flags&2&&A.f(k)
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=c1
c3=(c3|2)>>>0
a8=c1
a6=c4}else{b5=Math.min(a9+1,a2)
B.e.u(k,m+a9,b5*b4)}b4=a1+a9
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=a7
if(!c2&&b1.h(0,"o")!=null&&b1.h(0,"i")!=null){b4=b1.h(0,"o")
if(!q.b(b4))e3.j(new A.b(b0,"o"),e5)
b1=b1.h(0,"i")
if(!q.b(b1))e3.j(new A.b(b0,"i"),e5)
c5=b4.h(0,"x")
c6=b4.h(0,"y")
c7=b1.h(0,"x")
c8=b1.h(0,"y")
c9=e3.bg(c5,b0)
d0=e3.bg(c6,b0)
d1=e3.bg(c7,b0)
d2=e3.bg(c8,b0)
d3=Math.max(Math.max(c9,d0),Math.max(d1,d2))
b1=!1
if(d3!==1){b4=a.b
if(b4===a)A.u(A.ag(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e3.j(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e3.j(b0,"Easing component mismatch")
if(f1){b1=a.b
if(b1===a)A.u(A.ag(""))}else{b1=a.b
if(b1===a)A.u(A.ag(""))
b1=Math.min(A.ki(b1),1)}d4=Math.min(A.ki(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e6.b(c8),b4=e6.b(c7),b5=e6.b(c6),b6=e6.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.O(c5)
d6=d6.h(c5,d6.gk(c5)===1?0:d5)}else d6=c5
d7=B.c.A(A.eg(d6),0,1)
if(b5){d6=J.O(c6)
d6=d6.h(c6,d6.gk(c6)===1?0:d5)}else d6=c6
A.eg(d6)
if(b4){d8=J.O(c7)
d8=d8.h(c7,d8.gk(c7)===1?0:d5)}else d8=c7
d9=B.c.A(A.eg(d8),0,1)
if(b1){d8=J.O(c8)
d8=d8.h(c8,d8.gk(c8)===1?0:d5)}else d8=c8
A.eg(d8)
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
k[a9]=c3}if(m===1){e6=b.am()
return new A.z(e6,e4,!1,new Float32Array(0),!1)}if(n){e6=a0.am()
if(typeof e6!=="number")return A.Z(e6)
c1=a2*e6
e6=e3.e
e6===$&&A.C()
if(!(a2>=0))return A.a(l,a2)
l[a2]=e6
e6=c.am()
s=a.am()
if(typeof s!=="number")return A.Z(s)
J.jb(e6,c1,c1+s,c.am(),a8)
if(!(a2<p))return A.a(k,a2)
k[a2]=8
s=m+a2
k.$flags&2&&A.f(k)
if(!(s>=0&&s<p))return A.a(k,s)
k[s]=c1
a2=a1+a2
if(!(a2>=0&&a2<p))return A.a(k,a2)
k[a2]=a7}e6=a.am()
s=a0.am()
q=c.am()
if(a7===j)p=e
else{e1=e.BYTES_PER_ELEMENT
e2=A.bB(0,a7,B.a.a1(e.byteLength,e1))*e1
if(B.a.M(e2,8)!==0)A.u(A.aC("The number of bytes to view must be a multiple of 8",e4))
p=J.kV(B.i.gaa(e),e.byteOffset+0*e1,B.a.J(e2,8))}j=a4&&e6>=32?J.kU(B.j.gaa(q)):e4
j=new A.h8(l,e6,s,k,q,p,d,d==null?e4:A.jm(m,e4,!1,t.cn),j)
j.ed(l,e6,s,k,q,p,d,a4)
return new A.z(e4,j,a4,new Float32Array(e6),!1)},
du(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.aB(a)<2)o.j(new A.b(d,b),"Invalid spatial tangent")
if(c!==2&&J.kS(a,new A.fr()))o.j(new A.b(d,b),"Spatial tangent on non-position")
s=J.O(a)
r=o.O(s.h(a,0),d)
q=o.O(s.h(a,1),d)
if(e!=null){e.$flags&2&&A.f(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=r
p=f+1
if(!(p<s))return A.a(e,p)
e[p]=q}},
bg(a,b){var s,r
if(!t.j.b(a)){this.O(a,b)
return 1}for(s=J.bp(a),r=s.gG(a);r.v();)this.O(r.gC(),b)
return s.gk(a)}}
A.fs.prototype={
$1(a){var s,r,q
t.E.a(a)
s=!1
if(a.gF()){r=this.a
q=r.d
q===$&&A.C()
if(a.c<=q){s=r.e
s===$&&A.C()
s=a.d>=s}}return s},
$S:23}
A.fi.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.b(new A.b(q.b,"ef"),a),o=q.a,n=o.ao(0,J.ad(q.c,a),p)
o.N(n,p,B.E)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.l(s,r[a])||n.h(0,"v")==null)o.j(p,"Invalid effect parameter")
return o.H(n.h(0,"v"),new A.b(p,"v"),b,A.h([],t.n))},
$1(a){return this.$2$dimensions(a,1)},
$S:24}
A.fj.prototype={
$2(a,b){var s,r=this.b.$1(a)
if(r.a!=null){s=r.m(0)
if(0>=s.length)return A.a(s,0)
s=s[0]!==b}else s=!0
if(s)this.a.j(new A.b(new A.b(new A.b(this.c,"ef"),a),"v"),"Unsupported effect parameter value")},
$S:25}
A.fh.prototype={
$1(a){return J.l(J.ad(a,"ind"),this.a)},
$S:8}
A.fo.prototype={
$2(a,b){var s=this.a,r=this.c,q=s.H(this.b.h(0,a),new A.b(r,a),1,A.h([b],t.n))
if(q.a==null)s.j(new A.b(r,a),"Animated Inner Shadow")
s=q.m(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:27}
A.fp.prototype={
$5(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=t.j
if(e.b(a)){s=J.O(a)
s=s.gk(a)===1&&s.ga6(a) instanceof A.L}else s=!1
if(s)a=J.kZ(a)
s=this.b
r=s.ao(0,a,b)
s.N(r,b,B.aL)
q=r.h(0,"c")
if(!A.b8(q))s.j(new A.b(b,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.t.bE(p.c,q!==o)
o=b.a
n=o==null?null:o.b
if(A.q(n)){m=p.a
if(m==null){o=J.aB(e.a(J.ad(this.c,"k")))
m=p.a=new Uint8Array(o*2)}p=b.b==="e"?1:0
p=n*2+p
o=q?1:2
m.$flags&2&&A.f(m)
if(!(p>=0&&p<m.length))return A.a(m,p)
m[p]=o}l=r.h(0,"v")
k=r.h(0,"i")
j=r.h(0,"o")
p=!0
if(e.b(l))if(e.b(k))if(e.b(j)){e=J.O(l)
e=e.gk(l)!==J.aB(k)||e.gk(l)!==J.aB(j)}else e=p
else e=p
else e=p
if(e)s.j(b,"Invalid path topology")
e=J.O(l)
i=s.dl(b,c,e.gk(l)*6,a0)
h=new A.fq(s,b,i)
for(g=0;g<e.gk(l);++g){f=d+g*6
h.$2(e.h(l,g),f)
h.$2(J.ad(k,g),f+2)
h.$2(J.ad(j,g),f+4)}return i},
$S:12}
A.fq.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.aB(a)!==2)m.a.j(m.b,"Expected 2D path point")
s=m.c
r=m.a
q=J.O(a)
p=m.b
o=r.O(q.h(a,0),p)
s.$flags&2&&A.f(s)
n=s.length
if(!(b>=0&&b<n))return A.a(s,b)
s[b]=o
o=b+1
p=r.O(q.h(a,1),p)
if(!(o<n))return A.a(s,o)
s[o]=p},
$S:29}
A.fn.prototype={
$1(a){var s,r,q,p
t.cH.a(a)
for(s=a.length,r=this.a,q=0;q<a.length;a.length===s||(0,A.W)(a),++q){p=a[q]
if(p instanceof A.P)B.b.n(r,p)
if(p instanceof A.a_)this.$1(p.a)}},
$S:30}
A.fl.prototype={
$1(a){return t.aj.a(a).a},
$S:31}
A.fm.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a_)||a.gdN()},
$S:1}
A.fk.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.O(a)
r=k.b*4
s=s.gk(a)<r||(s.gk(a)-r&1)===1}else s=!0
if(s)k.a.j(b,"Invalid gradient stops")
s=k.a
r=J.O(a)
q=s.dl(b,c,r.gk(a),e)
for(p=k.b,o=0;o<r.gk(a);++o){n=s.O(r.h(a,o),b)
if(o<p*4&&B.a.M(o,4)!==0){m=B.a.A(B.c.D(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.f(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:12}
A.fr.prototype={
$1(a){return!J.l(a,0)},
$S:8}
A.hj.prototype={
cp(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.ao(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.ad(j,"x")
s=typeof n=="string"?$.j7().dK(n):null
if(s==null){k=k.d0(j,b)
i.u(0,j,k)
return k}r=new A.b(b,"x")
k.N(j,b,B.F)
if(J.ad(j,"a")!=null&&!J.l(J.ad(j,"a"),0)&&!J.l(J.ad(j,"a"),1))k.j(new A.b(b,"a"),"Invalid animated flag")
m=l.d
if(!m.n(0,j))k.j(r,"Cyclic path reference")
try{q=null
p=null
o=l.fb(s,r)
q=o.a
p=o.b
k=l.cp(q,p)
i.u(0,j,k)
return k}finally{m.K(0,j)}},
fb(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.cW(j.b,s,B.m,b,"layer")
q=r.a
if(!J.l(q.h(0,"ty"),4))j.a.j(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.b(r.b,"shapes")
s=$.j6()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dv(0,i)
i=new A.c5(i.a,i.b,i.c)
s=t.d
while(i.v()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.cW(p,m,o,b,"content")
q=l.a
o=l.b
p=J.l(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.b(o,"it")}k=q.h(0,"ks")
if(!J.l(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.j(b,"Path reference needs a B\xe9zier path")
return new A.F(k,new A.b(o,"ks"))},
cW(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.O(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gk(a);++m){l=s.h(a,m)
if(r.b(l)&&J.l(l.h(0,"nm"),b)){if(o!=null)q.j(d,p)
n=m
o=l}}if(o!=null)return new A.F(o,new A.b(c,n))}this.a.j(d,"Missing "+e+" reference: "+b)}}
A.e_.prototype={
a_(a,b,c){var s
A.ni(c,t.K,"T","_copy")
s=c.a(this.b.dT(c.a(a),c.i("0()").a(b)))
return s},
B(a){var s=t.I
s.a(a)
return this.a_(a,new A.fM(a),s)},
dW(a){return this.a_(a,new A.fN(this,a),t.d1)},
ct(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.a_)return s.bD(a)
if(a instanceof A.P)return s.a_(a,new A.fG(s,a),r)
if(a instanceof A.b6)return s.a_(a,new A.fH(s,a),r)
if(a instanceof A.aH)return s.a_(a,new A.fI(s,a),r)
if(a instanceof A.au)return s.a_(a,new A.fJ(s,a),r)
if(a instanceof A.aJ)return s.a_(a,new A.fK(s,a),r)
if(a instanceof A.aQ)return s.a_(a,new A.fL(s,a),r)
throw A.d(A.at("Unknown compiled geometry"))},
fw(a){var s=t.G
s.a(a)
if(a instanceof A.a_)return this.bD(a)
if(a instanceof A.b4)return this.a_(a,new A.fA(this,a),s)
throw A.d(A.at("Unknown compiled paint"))},
bD(a){return this.a_(a,new A.fC(this,a),t.eV)},
e1(a){return this.a_(a,new A.fB(this,a),t.cK)},
h3(a,b){return this.a_(b,new A.fO(this,b),t.e_)},
fk(a){return this.a_(a,new A.fz(this,a),t.bo)},
fR(a){var s=t.J
s.a(a)
return this.a_(a,new A.fE(this,a),s)},
cj(a){var s=t.E
s.a(a)
return this.a_(a,new A.fD(this,a),s)},
cq(a){return this.a_(a,new A.fF(this,a),t.B)}}
A.fM.prototype={
$0(){var s=this.a
return new A.z(s.a,s.b,s.c,new Float32Array(s.d.length),s.f)},
$S:38}
A.fN.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.B(o.a),m=p.B(o.b),l=p.B(o.c),k=p.B(o.d),j=p.B(o.e),i=o.f
i=i==null?q:p.B(i)
s=o.r
s=s==null?q:p.B(s)
r=o.w
r=r==null?q:p.B(r)
o=o.x
return A.iL(n,m,l,k,j,i,s,r,o==null?q:p.B(o))},
$S:39}
A.fG.prototype={
$0(){return new A.P(this.a.ct(this.b.a))},
$S:40}
A.fH.prototype={
$0(){var s=this.b
return new A.b6(this.a.h3(0,s.a),s.b)},
$S:41}
A.fI.prototype={
$0(){var s=this.b,r=s.a,q=A.a1(r),p=q.i("U<1,w>")
r=A.aV(new A.U(r,q.i("w(1)").a(this.a.gb5()),p),p.i("a9.E"))
return A.lM(r,s.b)},
$S:42}
A.fJ.prototype={
$0(){var s=this.b
return new A.au(this.a.B(s.e),s.f,s.r)},
$S:43}
A.fK.prototype={
$0(){var s=this.b,r=this.a
return new A.aJ(s.e,s.f,r.B(s.r),r.B(s.w),r.B(s.x))},
$S:44}
A.fL.prototype={
$0(){var s,r=this.b,q=this.a,p=q.B(r.r),o=q.B(r.w),n=q.B(r.x),m=q.B(r.y),l=q.B(r.z),k=r.Q
k=k==null?null:q.B(k)
s=r.as
q=s==null?null:q.B(s)
return new A.aQ(r.e,r.f,p,o,n,m,l,k,q)},
$S:45}
A.fA.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a1(o),l=m.i("U<1,w>")
o=A.aV(new A.U(o,m.i("w(1)").a(n.gb5()),l),l.i("a9.E"))
m=n.B(p.b)
l=n.B(p.c)
s=n.B(p.d)
r=p.y
r=r==null?null:n.e1(r)
q=p.z
n=q==null?null:n.fk(q)
return A.iH(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:46}
A.fC.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a1(q),n=o.i("U<1,w>")
q=A.aV(new A.U(q,o.i("w(1)").a(p.gb5()),n),n.i("a9.E"))
o=r.b
n=A.a1(o)
s=n.i("U<1,av>")
o=A.aV(new A.U(o,n.i("av(1)").a(p.gfv()),s),s.i("a9.E"))
return A.iF(q,o,p.dW(r.c))},
$S:47}
A.fB.prototype={
$0(){var s,r=this.b,q=this.a,p=q.B(r.c),o=q.B(r.d),n=q.B(r.e),m=r.f
m=m==null?null:q.B(m)
s=r.r
q=s==null?null:q.B(s)
return A.jA(r.a,p,o,n,r.w,m,q)},
$S:48}
A.fO.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a1(r),o=p.i("U<1,w>")
r=A.aV(new A.U(r,p.i("w(1)").a(q.gb5()),o),o.i("a9.E"))
return A.m4(r,q.B(s.b),q.B(s.c),q.B(s.d),s.e)},
$S:49}
A.fz.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a1(r),o=p.i("U<1,z>")
r=A.aV(new A.U(r,p.i("z(1)").a(q.gh2()),o),o.i("a9.E"))
return A.jy(r,q.B(s.b))},
$S:50}
A.fE.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.B(q.e),o=s.B(r.c),n=r.e
s=n==null?null:s.B(n)
return new A.a2(new A.au(p,q.f,q.r),r.b,o,r.d,s)},
$S:51}
A.fD.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.dW(l.a),j=l.b
j=j==null?n:m.bD(j)
s=l.f
s=s==null?n:m.cq(s)
r=l.x
r=r==null?n:m.B(r)
q=l.z
if(q==null)q=n
else{p=A.a1(q)
o=p.i("U<1,a2>")
q=A.aV(new A.U(q,p.i("a2(1)").a(m.gfQ()),o),o.i("a9.E"))}p=l.at
p=p==null?n:new A.dZ(m.B(p.a),m.B(p.b))
o=l.as
o=o==null?n:A.jB(o.a,o.b,o.c)
r=A.jC(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.cj(k)
r.ch=l.ch
return r},
$S:78}
A.fF.prototype={
$0(){var s,r,q,p,o=this.b,n=A.iC(o.a),m=o.b
m===$&&A.C()
n.b=m
m=o.c
m===$&&A.C()
n.c=m
m=o.d
m===$&&A.C()
n.d=m
m=o.e
m===$&&A.C()
n.e=m
m=o.f
m===$&&A.C()
n.f=m
n.x=o.x
n.y=o.y
m=n.w
o=o.w
s=this.a
r=A.a1(o)
B.b.ag(m,new A.U(o,r.i("aa(1)").a(s.gfN()),r.i("U<1,aa>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.cj(p)}}return n},
$S:53}
A.bK.prototype={
gfH(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.m(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
fC(a,b,c){var s,r,q,p,o=this.f
if(o==null)o=null
else{o=o.m(a)
if(0>=o.length)return A.a(o,0)
o=o[0]}s=(o==null?0:o)*0.01
if(s===0)return null
if(s<=-1)r=-0.99
else r=s>=1?0.99:s
o=Math.atan2(c,b)
q=this.r
if(q==null)q=null
else{q=q.m(a)
if(0>=q.length)return A.a(q,0)
q=q[0]}p=o+(q==null?0:q)*3.141592653589793/180
return new A.F(Math.cos(p)*r,Math.sin(p)*r)},
er(a,b){var s,r,q,p,o,n,m
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
return q+(a[o]-q)*m}}return B.j.gac(a)}}
A.P.prototype={
gF(){return this.a.gF()},
ga5(){return this.a.ga5()},
a7(a){return this.a.a7(a)},
$iw:1}
A.b6.prototype={
gF(){return this.a.gF()},
ga5(){return this.a.gF()},
a7(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].a7(a)},
$iw:1}
A.bR.prototype={
gF(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.b.ab(r.a,new A.hv())
r.f!==$&&A.M()
q=r.f=s}return q}}
A.hv.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.c9.prototype={
gF(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.b.ab(r.a,new A.ft())
r.e!==$&&A.M()
q=r.e=s}return q}}
A.ft.prototype={
$1(a){return t.I.a(a).a!=null},
$S:54}
A.bC.prototype={}
A.i9.prototype={
$1(a){var s,r,q=this.b
if(q.gt().length<a){s=Math.max(65536,q.gt().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.ap(s,0)}},
$S:13}
A.ia.prototype={
$1(a){return A.bj(this.a.gt(),0,a)},
$S:56}
A.ib.prototype={
$1(a){var s,r=this,q=r.b
if(q.gt().length<=262144){r.a.a=0
return}if(a<=65536){s=r.a
if(++s.a>=16){s.a=0
s=r.c
s.a=null
s.b=-1
q.ap(65536,0)}}else r.a.a=0},
$S:13}
A.id.prototype={
$3(a,b,c){if(!this.a.fG(b,c))return
if(this.b.K(0,a)==null)return
this.c.bz()},
$S:57}
A.ic.prototype={
$2(a,b){var s,r,q,p=this.a
p.K(0,a)
this.b.K(0,a)
for(s=this.c,r=A.n(p).i("T<1>");p.a>=8;){q=new A.T(p,r).gG(0)
if(!q.v())A.u(A.ar())
p.K(0,q.gC())
s.bz()}p.u(0,a,b)},
$S:58}
A.ie.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.a0(3,a,b):new A.a0(1,a,s)
this.b.ar(r)},
$S:59}
A.i8.prototype={
$1(i3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1=this,i2=null
A:{if(i3==null){d4=i1.b
d4.ca()
d4.dE()
i1.c.l(0)
i1.d.a4()
i1.e.a4()
i1.f.a.c9()
A.r(v.G.self).close()
return}d5=t.W.b(i3)
d6=i2
d7=i2
d8=!1
d9=i2
e0=i2
d4=!1
if(d5){e1=i3.a
e2=0===e1
if(e2){d6=i3.b
d8=t.dk.b(d6)
if(d8){A.hF(d6)
d7=i3.c
d4=A.q(d7)
if(d4){A.k(d7)
e0=d7}d9=d6}}}else{e1=i2
e2=!1}if(d4){d4=i1.b
d4.b=A.k(e0)
d4.bS(0)
d4.e5(d9)
break A}e3=i2
e4=i2
e5=i2
d4=!1
if(d5){e6=!0
e7=!0
e3=1===e1
e8=e3
if(e8){if(e2)e8=d6
else{d6=i3.b
e8=d6
e2=e6}if(typeof e8=="string"){if(e2)e8=d6
else{d6=i3.b
e8=d6
e2=e6}A.G(e8)
if(d8)d4=d7
else{d7=i3.c
d4=d7
d8=e7}d4=d4 instanceof A.bC
if(d4){if(d8)e9=d7
else{d7=i3.c
e9=d7
d8=e7}t.h.a(e9)
e5=e9}e4=e8}}}if(d4){i1.r.$2(e4,e5)
break A}s=null
r=null
q=null
f0=i2
f1=!1
d4=!1
if(t.a5.b(i3)){e6=!0
e7=!0
if(d5)e8=e3
else{e1=i3.a[0]
e3=1===e1
e8=e3
d5=!0}if(e8){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}if(typeof e8=="string"){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}s=A.G(e8)
if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=e7}e9=t.p
f1=e9.b(e8)
if(f1){if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=e7}r=e9.a(e8)
f0=i3.a[3]
d4=A.b8(f0)
if(d4){A.bn(f0)
q=f0}}}}}if(d4){try{d4=t.L.a(A.nm(r))
p=t.P.a(B.x.dI(B.bg.fj(d4),i2))
d4=s
e8=A.iC(new A.ew(q))
e8.fi(p)
i1.r.$2(d4,new A.bC(e8))}catch(f2){o=A.ac(f2)
d4=i1.w
if(d4.a>=8)d4.K(0,new A.T(d4,A.n(d4).i("T<1>")).ga6(0))
d4.u(0,s,J.bs(o))}break A}n=null
m=null
l=null
k=null
j=null
i=null
h=null
g=null
f=null
f3=i2
f4=!1
f5=i2
f6=!1
f7=i2
f8=!1
f9=i2
g0=!1
g1=i2
g2=!1
g3=i2
g4=!1
d4=!1
if(t.gv.b(i3)){e6=!0
e7=!0
g5=!0
if(d5)e8=e1
else{e1=i3.a[0]
e8=e1
d5=!0}if(2===e8){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}if(A.q(e8)){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}n=A.k(e8)
if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=e7}if(typeof e8=="string"){if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=e7}m=A.G(e8)
if(f1)e8=f0
else{f0=i3.a[3]
e8=f0
f1=g5}f4=typeof e8=="string"
if(f4){if(f1)e8=f0
else{f0=i3.a[3]
e8=f0
f1=g5}l=A.G(e8)
e8=i3.a
f3=e8[4]
f6=typeof f3=="number"
if(f6){A.Q(f3)
k=f3
f5=e8[5]
f8=A.q(f5)
if(f8){A.k(f5)
j=f5
f7=e8[6]
g0=A.q(f7)
if(g0){A.k(f7)
i=f7
f9=e8[7]
g2=A.q(f9)
if(g2){A.k(f9)
h=f9
g1=e8[8]
g4=A.q(g1)
if(g4){A.k(g1)
g=g1
g3=e8[9]
d4=A.b8(g3)
if(d4){A.bn(g3)
f=g3}}}}}}}}}}}if(d4){try{d4=i
e8=h
if(typeof d4!=="number")return d4.ad()
if(typeof e8!=="number")return A.Z(e8)
e=d4*e8
i1.x.$1(e)
e8=i1.y
d=e8.$1(e)
d4=i1.b
e9=m
g6=i
g7=h
g8=g
g9=f
h0=i1.z
c=d4.dY(h0,d,e9,j,g7,g9,g8,g6)
if(c){i1.Q.$3(l,m,g)
b=new Uint8Array(A.R(d))
i1.f.ar(new A.ce([0,n,m,b,!1,-1,d4.f+d4.x]))
i1.as.$1(e)
if(!f){e8=m
e9=i
g6=h
g7=g
d4.dS(e8,j,g6,g7,e9)}return}e9=i1.c
a=e9.K(0,l)
if(a==null){i1.at.$2(n,l)
return}e9.u(0,l,a)
h0.a=null
h0.b=-1
e9=k
g6=i
g7=h
A.kb(a.a,e9,i1.e,g6,g7,i1.d)
a0=e8.$1(e)
e8=m
g7=i
g6=h
e9=g
g8=f
a1=d4.cv(e8,j,g6,g8,i1.ax,a0,e9,g7)
a2=new Uint8Array(A.R(a0))
i1.f.ar(new A.ce([0,n,m,a2,!0,a1.b,d4.f+d4.x]))
i1.as.$1(e)
i1.Q.$3(l,m,g)}catch(f2){a3=A.ac(f2)
i1.f.ar(new A.a0(1,n,J.bs(a3)))}break A}a4=null
a5=null
a6=null
a7=null
a8=null
a9=null
b0=null
b1=null
b2=null
b3=null
b4=null
d4=!1
if(t.r.b(i3)){e6=!0
if(d5)e8=e1
else{e1=i3.a[0]
e8=e1
d5=!0}if(5===e8){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}if(A.q(e8)){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}a4=A.k(e8)
if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=!0}if(typeof e8=="string"){a5=A.G(d8?d7:i3.a[2])
if(f1)e8=f0
else{f0=i3.a[3]
e8=f0
f1=!0}if(typeof e8=="string"){a6=A.G(f1?f0:i3.a[3])
if(f4)e8=f3
else{f3=i3.a[4]
e8=f3
f4=!0}if(A.q(e8)){a7=A.k(f4?f3:i3.a[4])
if(f6)e8=f5
else{f5=i3.a[5]
e8=f5
f6=!0}if(A.q(e8)){a8=A.k(f6?f5:i3.a[5])
if(f8)e8=f7
else{f7=i3.a[6]
e8=f7
f8=!0}if(typeof e8=="number"){a9=A.Q(f8?f7:i3.a[6])
if(g0)e8=f9
else{f9=i3.a[7]
e8=f9
g0=!0}if(typeof e8=="number"){b0=A.Q(g0?f9:i3.a[7])
if(g2)e8=g1
else{g1=i3.a[8]
e8=g1
g2=!0}if(A.q(e8)){b1=A.k(g2?g1:i3.a[8])
if(g4)e8=g3
else{g3=i3.a[9]
e8=g3
g4=!0}if(A.q(e8)){b2=A.k(g4?g3:i3.a[9])
e8=i3.a
h1=e8[10]
if(A.q(h1)){b3=A.k(h1)
h2=e8[11]
d4=A.b8(h2)
if(d4)b4=A.bn(h2)}}}}}}}}}}}}if(d4){try{d4=i1.z
d4.a=null
d4.b=-1
d4=a8
if(typeof d4!=="number")return d4.e2()
b5=d4>1?1:0
e8=a8
e9=b2
if(typeof e8!=="number")return e8.ad()
if(typeof e9!=="number")return A.Z(e9)
g6=a8
if(typeof g6!=="number")return g6.e7()
g7=b5
if(typeof g7!=="number")return A.Z(g7)
b6=e8*e9+(g6-1)*g7
g7=b1
g6=b6
if(typeof g7!=="number")return g7.ad()
if(typeof g6!=="number")return A.Z(g6)
b7=g7*g6
i1.x.$1(b7)
d4=b5
if(typeof d4!=="number")return d4.e2()
if(d4>0)B.f.T(i1.e.gt(),0,b7,0)
d4=b1
e8=b2
if(typeof d4!=="number")return d4.ad()
if(typeof e8!=="number")return A.Z(e8)
b8=d4*e8
b9=0
c0=0
c1=-1
c2=null
c3=null
c4=0
d4=i1.ax
e8=i1.c
e9=i1.d
g6=i1.b
g7=i1.e
g8=t.a
for(;;){g9=c4
h0=a8
if(typeof g9!=="number")return g9.h9()
if(typeof h0!=="number")return A.Z(h0)
if(!(g9<h0))break
B:{g9=a7
h0=c4
if(typeof g9!=="number")return g9.aP()
if(typeof h0!=="number")return A.Z(h0)
c5=A.nH(g9+h0,b3,b0)
h0=a9
g9=c5
if(typeof h0!=="number")return h0.aP()
if(typeof g9!=="number")return A.Z(g9)
c6=h0+g9
g9=c4
h0=b2
h3=b5
if(typeof h0!=="number")return h0.aP()
if(typeof h3!=="number")return A.Z(h3)
if(typeof g9!=="number")return g9.ad()
c7=g9*(h0+h3)
h3=c7
h0=b1
if(typeof h3!=="number")return h3.ad()
if(typeof h0!=="number")return A.Z(h0)
c8=h3*h0
h0=A.k(c8)
h3=A.k(b8)
g9=h0+h3
A.bB(h0,g9,g7.b)
h4=g7.c
h5=h4==null
h6=h5?i2:h4+h0*4
if(h5){h5=g7.d
h5.toString
g9=A.jw(h5,h0,g9)}else g9=i2
c9=new A.c3(!1,h3,h6,g9)
g9=a5
h6=b1
h3=b2
h0=b3
h5=b4
h7=c9
h8=h7.c
if(h8!=null){h9=g8.a(A.r($.j.memory).buffer)
i0=h7.b
h7=new Uint32Array(h9,h8,i0)}else{h7=h7.d
h7.toString}d0=g6.h6(A.bj(h7,0,i2),g9,c5,h3,h5,h0,h6)
if(d0){g9=c0
if(typeof g9!=="number")return g9.aP()
c0=g9+1
if(c2==null)c2=c5
break B}if(c3==null)c3=e8.K(0,a6)
if(c3==null){i1.at.$2(a4,a6)
return}e8.u(0,a6,c3)
g9=c3
h0=b1
h3=b2
A.kb(g9.a,c6,c9,h0,h3,e9)
h3=b9
if(typeof h3!=="number")return h3.aP()
b9=h3+1
h3=a5
h0=b1
g9=b2
h5=b3
h6=b4
h7=c9
h8=h7.c
if(h8!=null){h9=g8.a(A.r($.j.memory).buffer)
i0=h7.b
h7=new Uint32Array(h9,h8,i0)}else{h7=h7.d
h7.toString}d1=g6.cv(h3,c5,g9,h6,d4,A.bj(h7,0,i2),h5,h0)
if(d1.b>0)c1=d1.b}g9=c4
if(typeof g9!=="number")return g9.aP()
c4=g9+1}d2=new Uint8Array(A.R(i1.y.$1(b7)))
i1.f.ar(new A.cc([4,a4,a5,a7,a8,d2,b9,c0,c1,g6.f+g6.x,b1,b6]))
i1.as.$1(b7)
i1.Q.$3(a6,a5,b3)
if(!b4&&c2!=null){d4=a5
e8=b1
b2=b2
e9=b3
g6.dS(d4,c2,b2,e9,e8)}}catch(f2){d3=A.ac(f2)
i1.f.ar(new A.a0(1,a4,J.bs(d3)))}break A}m=i2
d4=!1
if(t.ei.b(i3)){if(d5)e8=e1
else{e1=i3.a
e8=e1
d5=!0}if(3===e8){if(e2)d4=d6
else{d6=i3.b
d4=d6
e2=!0}d4=typeof d4=="string"
if(d4)m=A.G(e2?d6:i3.b)}}if(d4){d4=i1.b
d4.fu(m)
d4.fB(m)
i1.f.ar(new A.a0(2,m,d4.f+d4.x))
break A}if(t.dn.b(i3))d4=4===(d5?e1:i3.a)
else d4=!1
if(d4){d4=i1.z
d4.a=null
d4.b=-1
d4=i1.b
d4.dE()
d4.ca()
d4.cr()
i1.c.l(0)
i1.w.l(0)
e8=i1.d
e8.bz()
e8.dX(!0)
e8=i1.ax
e8.c=0
if(e8.b.length>131072)e8.b=new Uint8Array(131072)
i1.a.a=0
e8=i1.e
if(e8.gt().length>65536)e8.ap(65536,0)
i1.f.ar(new A.a0(2,"",d4.f+d4.x))}}},
$S:60}
A.eW.prototype={
aI(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j=this
if(!j.e&&j.b){j.e=!0
j.d=A.lq()}s=j.d
if(s!=null){r=a.f
if(r>4096||a.r>256)j.f=!0
q=s.fT(a.a,a.b,a.c,a.d,r,a.r,b,d,e,f,g,c.a)
if(q>=0){p=A.dB(t.a.a(A.r($.j.memory).buffer),s.b,4)
c.b=q
r=p.length
if(0>=r)return A.a(p,0)
c.c=p[0]
if(1>=r)return A.a(p,1)
c.d=p[1]
if(2>=r)return A.a(p,2)
c.e=p[2]
if(3>=r)return A.a(p,3)
c.f=p[3]
return}}r=j.x
if(r==null){r=new Int32Array(8192)
o=new Int32Array(8192)
n=new Int32Array(8192)
m=new Int32Array(8192)
l=Math.max(64,256)
k=new Int32Array(l)
B.e.T(k,0,l,-1)
m=j.x=new A.fP(l,k,r,o,n,m)
r=m}r.fU(a,b,c,d,e,f,g)},
d6(a,b){var s=this.r,r=s.K(0,a)
if(r==null)return null
if(r.a.E(0,b)){s.u(0,a,r)
return r.b}this.w=this.w-r.c
r.b.a.a4()
return null},
d5(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.r
r=s.$ti.i("T<1>")
for(;;){if(!(m.w+l>1048576||s.a>=256))break
q=new A.T(s,r).gG(0)
if(!q.v())A.u(A.ar())
p=s.K(0,q.gC())
m.w=m.w-p.c
o=p.b.a
n=o.b
if(n!=null){$.j.free(n)
o.b=null}}r=Math.max(1,c.b)*2
o=new A.aX(r)
o.b7(r)
o=new A.ax(o)
o.dH(c)
s.u(0,a,new A.dW(b,o,l))
m.w+=l},
da(a,b){var s,r,q,p=this.p2,o=p.h(0,a)
if(o!=null)return o
if(p.a>=512)p.l(0)
s=this.ch
s.l(0)
A.hN(a,b,0.01,s)
r=Math.max(1,s.f)
q=A.cY(Math.max(1,s.r),r)
B.i.L(q.a,0,s.f,s.a)
B.i.L(q.b,0,s.f,s.b)
B.e.L(q.c,0,s.r,s.c)
B.e.L(q.d,0,s.r,s.d)
B.d.L(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
p.u(0,a,q)
return q},
gc1(){var s=this.y
if(s==null){s=new A.aX(2048)
s.b7(2048)
s=this.y=new A.ax(s)}return s},
gbM(){var s=this.z
if(s==null){s=new A.aX(2048)
s.b7(2048)
s=this.z=new A.ax(s)}return s},
gbk(){var s=this.Q
if(s==null){s=new A.aX(2048)
s.b7(2048)
s=this.Q=new A.ax(s)}return s},
gdc(){var s,r,q=this.fy
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.fy=new A.hm(new A.bI(q),new A.bI(s),new A.bI(r),new A.bI(new Float64Array(256)))}return q},
em(a,b){var s,r,q,p
for(s=this.fr;s.length<=a;){r=Math.max(16,b)
B.b.n(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.b.u(s,a,q)}return q},
eo(a){var s,r,q,p,o
for(s=this.CW;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.n(s,new A.aw(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
en(a){var s,r,q,p,o
for(s=this.cx;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.n(s,new A.aw(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
al(a){var s,r
for(s=this.go;s.length<=a;){r=new A.aX(2048)
if($.j!=null)r.b=A.aK(8192)
else r.c=new Int32Array(2048)
B.b.n(s,new A.ax(r))}s=s[a]
s.l(0)
return s},
el(a){var s,r,q,p,o
for(s=this.cy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.n(s,new A.aw(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
ek(a){var s,r,q,p,o
for(s=this.db;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.n(s,new A.aw(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cT(a){var s
for(s=this.dx;s.length<=a;)B.b.n(s,new Float64Array(6))
return s[a]},
ej(a){var s,r,q,p,o
for(s=this.id;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.n(s,new A.aw(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
ei(a){var s,r,q,p,o
for(s=this.k1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.n(s,new A.aw(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cB(a){var s,r
for(s=this.k2;s.length<=a;){r=new A.aX(2048)
if($.j!=null)r.b=A.aK(8192)
else r.c=new Int32Array(2048)
B.b.n(s,new A.ax(r))}return s[a]},
eh(a){var s,r
for(s=this.k3;s.length<=a;){r=new A.aX(2048)
if($.j!=null)r.b=A.aK(8192)
else r.c=new Int32Array(2048)
B.b.n(s,new A.ax(r))}return s[a]},
eZ(){var s,r,q,p,o
for(s=this.p4,r=new A.aD(s,s.r,s.e,s.$ti.i("aD<2>"));r.v();){q=r.d
if(q.a&&q.c!=null){p=$.j
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.l(0)},
bz(){var s,r,q,p,o=this
for(s=o.r,r=new A.aD(s,s.r,s.e,s.$ti.i("aD<2>"));r.v();){q=r.d.b.a
p=q.b
if(p!=null){$.j.free(p)
q.b=null}}s.l(0)
o.w=0
o.p2.l(0)
o.p3.l(0)
o.eZ()},
a4(){var s,r,q,p,o,n,m=this
m.bz()
s=m.R8
if(s!=null)s.a4()
m.R8=null
s=m.d
if(s!=null)s.fY()
m.d=null
s=m.y
if(s!=null)s.a.a4()
s=m.z
if(s!=null)s.a.a4()
s=m.Q
if(s!=null)s.a.a4()
m.y=m.z=m.Q=null
for(s=m.k2,r=s.length,q=0;q<s.length;s.length===r||(0,A.W)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.j.free(o)
p.b=null}}for(r=m.k3,p=r.length,q=0;q<r.length;r.length===p||(0,A.W)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.j.free(n)
o.b=null}}B.b.l(s)
B.b.l(r)
B.b.l(m.id)
B.b.l(m.k1)
for(s=m.go,r=s.length,q=0;q<s.length;s.length===r||(0,A.W)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.j.free(o)
p.b=null}}B.b.l(s)
m.d2()
m.x=null},
dX(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.ok=0
if(a){i.p1=0
i.f=!1}s=i.d
if(s!=null)r=a||s.e>65536||s.c>8192||s.d>512
else r=!1
if(r){if(s.e>65536){$.j.fl_dense_trim(s.a,65536)
s.e=0}if(s.c>8192){$.j.free(s.f)
$.j.free(s.r)
s.r=s.f=s.c=0}if(s.d>512){$.j.free(s.w)
$.j.free(s.x)
s.x=s.w=s.d=0}}if(a){r=i.R8
if(r!=null)r.a4()
i.R8=null
i.d2()
B.b.l(i.CW)
B.b.l(i.cx)
B.b.l(i.cy)
B.b.l(i.db)
B.b.l(i.fr)
B.b.l(i.dx)
B.b.l(i.dy)
B.b.l(i.RG)
i.fy=null}else{for(r=i.k4,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
if(n!=null)if(p<5){o=n.c
if(o!=null){m=q.a(A.r($.j.memory).buffer)
l=n.b
o=new Uint32Array(m,o,l)}else{o=n.d
o.toString}o=o.length>262144}else o=!0
else o=!1
if(o){if(n.a&&n.c!=null){o=$.j
o.toString
m=n.c
m.toString
o.free(m)
n.c=null}B.b.u(r,p,null)}}if(o>5)B.b.sk(r,5)
r=i.CW
q=r.length
B.b.b1(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.W)(r),++k)r[k].aj()
r=i.cx
q=r.length
B.b.b1(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.W)(r),++k)r[k].aj()
r=i.cy
q=r.length
B.b.b1(r,Math.min(2,q),q)
q=i.db
r=q.length
B.b.b1(q,Math.min(2,r),r)
for(r=q.length,k=0;k<q.length;q.length===r||(0,A.W)(q),++k)q[k].aj()
r=i.fr
q=r.length
B.b.b1(r,Math.min(2,q),q)
for(p=0;p<r.length;++p)if(r[p].length>4096)B.b.u(r,p,new Float64Array(64))
r=i.fy
if(r!=null){r.a.aj()
r.b.aj()
r.c.aj()
r.d.aj()}}i.as.X(a)
i.at.X(a)
i.ax.X(a)
i.ay.X(a)
i.ch.X(a)
for(r=i.cy,p=0;p<r.length;++p)r[p].X(a)
if(a){for(r=i.go,q=r.length,k=0;k<r.length;r.length===q||(0,A.W)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.j.free(m)
o.b=null}}B.b.l(r)}else for(r=i.go,q=r.length,k=0;k<r.length;r.length===q||(0,A.W)(r),++k)r[k].aj()
r=i.y
if(r!=null)r.X(a)
r=i.z
if(r!=null)r.X(a)
r=i.Q
if(r!=null)r.X(a)
for(r=i.id,p=0;p<r.length;++p)r[p].X(a)
for(r=i.k1,p=0;p<r.length;++p)r[p].X(a)
for(r=i.k2,p=0;p<r.length;++p)r[p].X(a)
for(r=i.k3,p=0;p<r.length;++p)r[p].X(a)
if(a)i.x=null
else{r=i.x
if(r!=null){r.r=0
r.fr=!1
r.ch=-1
r.ay=0
q=r.a
j=Math.max(q,2048)
if(r.b.length>j){o=new Int32Array(q)
B.e.T(o,0,q,-1)
r.b=o}if(r.c.length>32768){r.c=new Int32Array(8192)
r.d=new Int32Array(8192)
r.e=new Int32Array(8192)
r.f=new Int32Array(8192)}}}i.fx.X(a)},
h4(){return this.dX(!1)},
d2(){var s,r,q,p,o,n
for(s=this.k4,r=s.length,q=0;q<s.length;s.length===r||(0,A.W)(s),++q){p=s[q]
if(p!=null)if(p.a&&p.c!=null){o=$.j
o.toString
n=p.c
n.toString
o.free(n)
p.c=null}}B.b.l(s)},
aG(a,b){var s,r,q
if(b>this.ok)this.ok=b
s=this.k4
if(s.length<=a)B.b.sk(s,a+1)
if(!(a<s.length))return A.a(s,a)
r=s[a]
if(r==null){q=A.eR(b)
B.b.u(s,a,q)
return q}if(r.gt().length<b)r.ap(b,0)
return r},
c2(a){var s
for(s=this.RG;s.length<=a;)B.b.n(s,new Float64Array(6))
return s[a]}}
A.bI.prototype={
aM(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
X(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
aj(){return this.X(!1)}}
A.aw.prototype={
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
aj(){return this.X(!1)},
bj(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.i.L(o,0,r.f,q)
s=new Float64Array(p)
B.i.L(s,0,r.f,r.b)
r.a=o
r.b=s},
a3(a){var s,r,q,p,o=this
if(o.x)o.a0()
o.x=!0
o.w=o.f
s=o.r
r=o.c
q=r.length
if(s===q){p=q*2
q=new Int32Array(p)
B.e.L(q,0,s,r)
o.c=q
s=new Int32Array(p)
B.e.L(s,0,o.r,o.d)
o.d=s
s=new Uint8Array(p)
B.d.L(s,0,o.r,o.e)
o.e=s}s=o.c
r=o.r
q=o.w
s.$flags&2&&A.f(s)
if(!(r<s.length))return A.a(s,r)
s[r]=q
q=o.e
s=a?1:0
q.$flags&2&&A.f(q)
if(!(r<q.length))return A.a(q,r)
q[r]=s},
q(a,b){var s,r,q,p=this,o=p.f
if(o>p.w){s=p.a
r=o-1
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
s=p.b
if(!(r<s.length))return A.a(s,r)
if(Math.abs(a-q)+Math.abs(b-s[r])<1e-7)return}if(o===p.a.length)p.bj()
o=p.a
s=p.f
o.$flags&2&&A.f(o)
if(!(s>=0&&s<o.length))return A.a(o,s)
o[s]=a
o=p.b
o.$flags&2&&A.f(o)
if(!(s<o.length))return A.a(o,s)
o[s]=b
p.f=s+1},
c7(a,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(a8>=10){b.q(a5,a6)
return}s=a1-(2*a+a5)/3
r=a2-(2*a0+a6)/3
q=a3-(a+2*a5)/3
p=a4-(a0+2*a6)/3
if(Math.max(s*s+r*r,q*q+p*p)*0.5625<=a7){b.q(a5,a6)
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
b.c7(a,a0,o,n,i,h,e,d,a7,c)
b.c7(e,d,g,f,k,j,a5,a6,a7,c)},
Y(a,b,c,d,e,f,g,h,i){return this.c7(a,b,c,d,e,f,g,h,i,0)},
a0(){var s,r,q,p,o,n,m,l,k,j,i=this
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
s.$flags&2&&A.f(s)
if(!(p<s.length))return A.a(s,p)
s[p]=r
i.r=p+1},
aC(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j=this,i=b===1&&c===0&&d===0&&e===1&&f===0&&g===0
for(s=0;s<a.r;++s){r=a.c
if(!(s<r.length))return A.a(r,s)
q=r[s]
r=a.d
if(!(s<r.length))return A.a(r,s)
p=r[s]
if(p<=q)continue
r=a.e
if(!(s<r.length))return A.a(r,s)
j.a3(r[s]===1)
if(i)for(o=q;o<p;++o){if(j.f===j.a.length)j.bj()
r=j.a
n=j.f
m=a.a
if(!(o>=0&&o<m.length))return A.a(m,o)
m=m[o]
r.$flags&2&&A.f(r)
if(!(n>=0&&n<r.length))return A.a(r,n)
r[n]=m
m=j.b
r=a.b
if(!(o<r.length))return A.a(r,o)
r=r[o]
m.$flags&2&&A.f(m)
if(!(n<m.length))return A.a(m,n)
m[n]=r
j.f=n+1}else for(o=q;o<p;++o){r=a.a
if(!(o>=0&&o<r.length))return A.a(r,o)
l=r[o]
r=a.b
if(!(o<r.length))return A.a(r,o)
k=r[o]
if(j.f===j.a.length)j.bj()
r=j.a
n=j.f
r.$flags&2&&A.f(r)
if(!(n>=0&&n<r.length))return A.a(r,n)
r[n]=b*l+d*k+f
r=j.b
r.$flags&2&&A.f(r)
if(!(n<r.length))return A.a(r,n)
r[n]=c*l+e*k+g
j.f=n+1}j.a0()}},
ff(a){var s,r,q,p,o,n,m,l=this
for(s=0;s<a.r;++s){r=a.c
if(!(s<r.length))return A.a(r,s)
q=r[s]
r=a.d
if(!(s<r.length))return A.a(r,s)
p=r[s]
if(p<=q)continue
r=a.e
if(!(s<r.length))return A.a(r,s)
l.a3(r[s]===1)
for(o=p-1;o>=q;--o){if(l.f===l.a.length)l.bj()
r=l.a
n=l.f
m=a.a
if(!(o>=0&&o<m.length))return A.a(m,o)
m=m[o]
r.$flags&2&&A.f(r)
if(!(n>=0&&n<r.length))return A.a(r,n)
r[n]=m
m=l.b
r=a.b
if(!(o<r.length))return A.a(r,o)
r=r[o]
m.$flags&2&&A.f(m)
if(!(n<m.length))return A.a(m,n)
m[n]=r
l.f=n+1}l.a0()}}}
A.dW.prototype={}
A.ax.prototype={
l(a){var s=this
s.b=0
s.d=s.c=2147483647
s.f=s.e=0},
aS(a){var s=this,r=[s.a,s.b,s.c,s.d,s.e,s.f],q=r[0],p=r[1],o=r[2],n=r[3],m=r[4],l=r[5]
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
if(this.a.gt().length>s*2)this.a.ap(2048,0)},
aj(){return this.X(!1)},
dH(a){var s=this,r=a.b*2
if(s.a.gt().length<r)s.a.ap(r,0)
B.e.L(s.a.gt(),0,r,a.a.gt())
s.b=a.b
s.c=a.c
s.d=a.d
s.e=a.e
s.f=a.f},
aK(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
if(c<=0||d<=0)return!1
s=(d>256?256:d)-1
r=f.a.gt()
q=f.b
if(q>0){p=(q-1)*2
o=r.length
if(!(p>=0&&p<o))return A.a(r,p)
n=r[p]
if(n>>>16===a){m=p+1
if(!(m<o))return A.a(r,m)
l=r[m]
if((l&255)===s){k=l>>>8
if((n&65535)+k===b){r.$flags&2&&A.f(r)
r[m]=(k+c<<8|s)>>>0
j=b+c
if(j>f.e)f.e=j
return!1}}}}i=q*2
h=i+2>r.length
if(h){q=f.a
q.ap(q.gt().length*2,f.b*2)}g=f.a.gt()
g.$flags&2&&A.f(g)
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
e4(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a===0){i.l(0)
return}s=i.a.gt()
for(r=i.b*2,q=s.length,p=s.$flags|0,o=0,n=0;n<r;n+=2){m=n+1
if(!(m<q))return A.a(s,m)
l=s[m]
k=B.a.I(((l&255)+1)*a+128,8)
if(k===0)continue
j=o+1
if(!(n<q))return A.a(s,n)
m=s[n]
p&2&&A.f(s)
if(!(o<q))return A.a(s,o)
s[o]=m
o=j+1
s.$flags&2&&A.f(s)
if(!(j<q))return A.a(s,j)
s[j]=(l&4294967040|k-1)>>>0}i.b=B.a.J(o,2)}}
A.fP.prototype={
aJ(a){if(!isFinite(a))return 0
if(a>1048576)a=1048576
return B.c.D((a<-1048576?-1048576:a)*256)},
fU(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
c.l(0)
if(a0>=a2||a1>=a3||a.r===0)return
s=d.b
r=s.length
if(a3>r){q=Math.max(a3,r*2)
s=new Int32Array(q)
B.e.T(s,0,q,-1)
d.b=s}else{p=d.ch
o=d.ay
if(p>=o){n=Math.max(0,o)
m=Math.min(r,p+1)
if(m>n)B.e.T(s,n,m,-1)}}d.w=a0
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
d.bR()
d.CW=d.aJ(g)
d.cx=d.aJ(f)
for(e=i+1;e<h;++e){if(!(e<s))return A.a(k,e)
p=k[e]
if(!(e<r))return A.a(j,e)
o=j[e]
d.d4(d.aJ(p),d.aJ(o))}d.d4(d.aJ(g),d.aJ(f))}d.eb(b,c)},
bR(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
q.$flags&2&&A.f(q)
q[l]=k+s
k=d.e
if(!(l<k.length))return A.a(k,l)
q=k[l]
k.$flags&2&&A.f(k)
k[l]=q+m
return}if(g>o)break
if(!(l<k))return A.a(q,l)
f=q[l]}q=d.r
if(q===i){e=i*2
k=new Int32Array(e)
B.e.L(k,0,q,j)
d.c=k
q=new Int32Array(e)
B.e.L(q,0,d.r,d.d)
d.d=q
q=new Int32Array(e)
B.e.L(q,0,d.r,d.e)
d.e=q
q=new Int32Array(e)
B.e.L(q,0,d.r,d.f)
d.f=q}q=d.r++
k=d.c
k.$flags&2&&A.f(k)
if(!(q<k.length))return A.a(k,q)
k[q]=o
k=d.d
k.$flags&2&&A.f(k)
if(!(q<k.length))return A.a(k,q)
k[q]=s
k=d.e
k.$flags&2&&A.f(k)
if(!(q<k.length))return A.a(k,q)
k[q]=m
k=d.f
k.$flags&2&&A.f(k)
j=k.length
if(!(q<j))return A.a(k,q)
k[q]=l
if(h===-1){k=d.b
k.$flags&2&&A.f(k)
if(!(p<k.length))return A.a(k,p)
k[p]=q}else{if(!(h>=0&&h<j))return A.a(k,h)
k[h]=q}},
d7(a,b){var s=this
if(s.fr){if(s.cy===a&&s.db===b)return
s.bR()}s.cy=a
s.db=b
s.dy=s.dx=0
s.fr=!0},
av(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.w
if(b<s){r.d7(s,a)
r.dx+=e
return}if(b>=r.y)return
r.d7(b,a)
r.dx+=e
r.dy=r.dy+(c+d)*e},
aB(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.x||a>=g.z)return
s=B.a.b2(B.a.I(b,8),32)
r=B.a.b2(B.a.I(d,8),32)
q=s*256
p=r*256
if(s===r){g.av(a,s,b-q,d-q,f)
return}o=d-b
n=b-q
if(d>b){m=g.w
if(s<m){if(r<m){g.av(a,m,0,0,f)
return}l=c+B.a.a1((g.Q-b)*f,o)
g.av(a,m,0,0,l-c)
s=g.w
k=l
n=0}else k=c
for(;;){if(!(s<r&&s<g.y))break
j=s+1
i=c+B.a.a1((j*256-b)*f,o)
g.av(a,s,n,256,i-k)
k=i
s=j
n=0}if(s<g.y)g.av(a,s,n,d-p,e-k)}else{m=g.y
if(s>=m){if(r>=m)return
l=c+B.a.a1((g.at-b)*f,o)
s=m-1
k=l
n=256}else k=c
for(;;){if(!(s>r&&s>=g.w))break
i=c+B.a.a1((s*256-b)*f,o)
g.av(a,s,n,0,i-k);--s
k=i
n=256}m=g.w
h=e-k
if(s<m)g.av(a,m,0,0,h)
else g.av(a,s,n,d-p,h)}},
d4(a,b){this.f1(a,b)
return},
f1(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.CW,b=d.cx
d.CW=a
d.cx=a0
s=a0-b
if(s===0)return
r=B.a.b2(B.a.I(b,8),32)
q=B.a.b2(B.a.I(a0,8),32)
p=d.x
o=r<p
if(o&&q<p)return
n=d.z
m=r>=n
if(m&&q>=n)return
if(r===q){l=r*256
d.aB(r,c,b-l,a,a0-l)
return}k=a-c
if(s>0){if(o){j=d.as
i=c+B.a.a1((j-b)*k,s)
r=p}else{j=b
i=c}for(;;){if(!(r<q&&r<d.z))break
p=r+1
h=p*256
g=c+B.a.a1((h-b)*k,s)
d.aB(r,i,j-r*256,g,256)
j=h
i=g
r=p}if(r<d.z){o=r*256
d.aB(r,i,j-o,a,a0-o)}}else{if(m){j=d.ax
i=c+B.a.a1((j-b)*k,s)
r=n-1}else{j=b
i=c}if(r===q){if(r>=p){l=r*256
d.aB(r,i,j-l,a,a0-l)}return}f=r*256
e=c+B.a.a1((f-b)*k,s)
if(r>=p)d.aB(r,i,j-f,e,0);--r
i=e
for(;;){if(!(r>q&&r>=d.x))break
g=c+B.a.a1((r*256-b)*k,s)
d.aB(r,i,256,g,0);--r
i=g}if(r>=d.x)d.aB(r,i,256,a,a0-r*256)}},
eb(a,b){this.fa(a,b)
return},
fa(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.bR()
s=i.ch
r=i.ay
if(s<r)return
q=Math.max(i.x,r)
p=Math.min(i.z-1,s)
for(o=q;o<=p;++o){s=i.b
if(!(o>=0&&o<s.length))return A.a(s,o)
n=s[o]
s.$flags&2&&A.f(s)
s[o]=-1
if(n===-1)continue
m=i.w
for(l=0;n!==-1;){s=i.c
if(!(n>=0&&n<s.length))return A.a(s,n)
k=s[n]
if(k>m&&l!==0){j=A.iD(l*512,a)
if(j>0)b.aK(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.iD(l*512-s[n],a)
if(j>0)b.aK(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.y){j=A.iD(l*512,a)
if(j>0)b.aK(o,m,i.y-m,j)}}i.ch=i.x-1
i.ay=i.z}}
A.hp.prototype={
$0(){var s,r,q=new Uint32Array(256)
for(s=1;s<256;++s){r=B.a.a1(16711680+s-1,s)
if(!(s<256))return A.a(q,s)
q[s]=r}return q},
$S:62}
A.ho.prototype={
$3(a,b,c){var s=this.a,r=this.b
return B.a.A(B.c.D((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
$S:63}
A.hr.prototype={
$1(a){var s,r,q=this
a+=q.a
s=q.b
if(s<0){r=q.c
a=r+(a-r)*r/(r-s)}s=q.d
if(s>1){r=q.c
a=r+(a-r)*(1-r)/(s-r)}return a},
$S:64}
A.hR.prototype={
$2(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.a
a0.l(0)
s=a.b
s.l(0)
r=a.c
A.hN(a1.a,r,a.d,a0)
q=a.e
p=a.f
o=a.r
n=a.w
m=a.x
l=a.y
s.aC(a0,q,p,o,n,m,l)
k=a.z
j=a.Q
i=a.as
h=a.at
g=a.ax
k.aI(s,!1,a2,j,i,h,g)
f=a1.e
if(f==null)e=null
else{r=f.m(r)
if(0>=r.length)return A.a(r,0)
r=r[0]
e=r}if(e==null)e=0
if(e!==0)r=a2.b===0&&e<0
else r=!0
if(r)return
d=k.ay
d.l(0)
A.my(a0,e,a.ay,d,k.gdc())
s.l(0)
s.aC(d,q,p,o,n,m,l)
c=k.al(3)
b=k.al(4)
k.aI(s,!1,c,j,i,h,g)
a2.aS(b)
A.d_(b,c,a2,e>0?2:3)},
$S:65}
A.hO.prototype={
$8(a,b,c,d,e,f,g,h){this.a.Y(g,h,a,b,c,d,e,f,this.b)},
$S:66}
A.hm.prototype={}
A.hL.prototype={
$7(a,b,c,d,e,f,g){var s,r,q,p=this,o=c+e,n=d+f,m=o*o+n*n
if(m>1e-12&&g<5){s=1/Math.sqrt(m)
o*=s
n*=s
r=p.a
if(g<2||r*(1-(c*o+d*n))>p.b){q=g+1
p.$7(a,b,c,d,o,n,q)
p.c.q(a+r*o,b+r*n)
p.$7(a,b,o,n,e,f,q)
return}}if(g===0){r=p.a
p.c.q(a+r*e,b+r*f)}},
$S:67}
A.hM.prototype={
$6(a,b,c,d,e,f){var s
this.a.$7(a,b,c,d,e,f,0)
s=this.c
this.b.q(a+s*e,b+s*f)},
$S:68}
A.hK.prototype={
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
if(Math.abs(j)<0.0001&&k>0){d.d.q((i+g)*0.5,(h+f)*0.5)
return}if(j>=0){b=d.d
b.q(i,h)
b.q(a2,a3)
b.q(g,f)
return}b=d.e
if(b===1){a=1+k
a=a>0.000001&&2<=d.f*a}else a=!1
if(a){e=r/(1+k)
d.d.q(a2+(m+l)*e,a3+(s+o)*e)}else{a=d.d
if(b===2){a.q(i,h)
b=d.r
if(k<-0.999){b.$6(a2,a3,m,s,s,p)
b.$6(a2,a3,s,p,l,o)}else b.$6(a2,a3,m,s,l,o)}else{a.q(i,h)
a.q(g,f)}}},
$S:69}
A.bQ.prototype={
gcV(){var s=this.y
if(s==null){s=new Float64Array(16)
s[10]=1
s[15]=1
this.y=s}return s},
gaN(){var s,r,q=this,p=null,o=q.at
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
gci(){var s,r=this,q=r.ax
if(q===$){s=A.iM(r.c,100,100)&&A.ed(r.d,0)&&A.ed(r.w,0)
r.ax!==$&&A.M()
q=r.ax=s}return q},
gaz(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gci())if(A.iM(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.iM(q.b,0,0)
else r=A.ed(r,0)&&A.ed(q.r,0)
s=r}q.ay!==$&&A.M()
p=q.ay=s}return p},
gF(){var s,r=this,q=r.ch
if(q===$){s=r.gaN()&&r.e.a!=null
r.ch!==$&&A.M()
q=r.ch=s}return q},
gcf(){var s,r=this,q=r.CW
if(q===$){s=A.ed(r.e,100)
r.CW!==$&&A.M()
r.CW=s
q=s}return q},
cP(a){var s,r,q,p,o=this
if(o.as!==a)s=o.gaN()&&!isNaN(o.as)
else s=!0
if(s)return
o.as=a
r=o.a.m(a)
s=o.f
q=s==null
p=q||o.r==null?o.b.m(a):null
if(q)s=null
else{s=s.m(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(0>=p.length)return A.a(p,0)
s=p[0]}q=r.length
if(0>=q)return A.a(r,0)
o.z=s-r[0]
s=o.r
if(s==null)s=null
else{s=s.m(a)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(1>=p.length)return A.a(p,1)
s=p[1]}if(1>=q)return A.a(r,1)
o.Q=s-r[1]},
dQ(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gaN()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gcV()
a4.as=a6
r=a4.gcV()
q=a4.a.m(a6)
p=a4.b.m(a6)
o=a4.c.m(a6)
s=a4.d.m(a6)
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
r.$flags&2&&A.f(r)
r[0]=m*k
r[1]=l*k
r[4]=-l*j
r[5]=m*j
s=a4.w
if(s==null)i=a5
else{s=s.m(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]
i=s}if(i==null)i=0
if(i!==0){s=a4.x
if(s==null)s=a5
else{s=s.m(a6)
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
else{s=s.m(a6)
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
else{s=a3.m(a6)
if(0>=s.length)return A.a(s,0)
s=s[0]}if(s==null){if(1>=p.length)return A.a(p,1)
s=p[1]}r[13]=s-r[1]*q[0]-r[5]*q[1]
return r},
cl(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaz())return a
if(b.gci()){b.cP(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.a6(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.dQ(a0)
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
return new A.a6(f-d,e-c,f+d,e+c)}}
A.a2.prototype={
gF(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gc8(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.h5.prototype={
aL(a){var s=this.c
return 255-A.an((255-(B.a.f8(s,a)&255))*(s>>>24))}}
A.dZ.prototype={
fg(a){var s,r,q,p=this.a.m(a),o=new A.fy(),n=this.b.m(a)
if(0>=n.length)return A.a(n,0)
n=o.$1(n[0])
if(typeof n!=="number")return n.a8()
s=p.length
if(0>=s)return A.a(p,0)
r=o.$1(p[0])
if(typeof r!=="number")return r.a8()
if(1>=s)return A.a(p,1)
q=o.$1(p[1])
if(typeof q!=="number")return q.a8()
if(2>=s)return A.a(p,2)
o=o.$1(p[2])
if(typeof o!=="number")return A.Z(o)
return(n<<24|r<<16|q<<8|o)>>>0}}
A.fy.prototype={
$1(a){return B.c.D(B.c.A(a,0,1)*255)},
$S:70}
A.aa.prototype={
gF(){var s,r,q=this,p=null,o=q.db
if(o===$){s=!1
if(q.a.gF()){r=q.x
r=r==null?p:r.a!=null
if(r!==!1){r=q.b
r=r==null?p:r.gF()
if(r!==!1){r=q.f
r=r==null?p:r.gF()
if(r!==!1){r=q.at
if(r==null)r=p
else r=r.a.a!=null&&r.b.a!=null
if(r!==!1){r=q.cy
r=r==null?p:r.gF()
if(r!==!1){r=q.z
r=r==null?p:B.b.ab(r,new A.hc())
r=r!==!1}else r=s}else r=s}else r=s}else r=s
s=r}}q.db!==$&&A.M()
o=q.db=s}return o},
gfF(){var s,r=this,q=r.dx
if(q===$){s=r.z
s=s==null?null:B.b.an(s,new A.ha())
r.dx!==$&&A.M()
q=r.dx=s===!0}return q},
gfI(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.b.ab(s,new A.hb())
r.dy!==$&&A.M()
q=r.dy=s===!0}return q},
gdO(){var s,r,q=this,p=q.fr
if(p===$){if(q.a.gaN()){s=q.cy
s=s==null?null:s.gdO()
r=s!==!1}else r=!1
q.fr!==$&&A.M()
p=q.fr=r}return p},
gdM(){var s,r,q=this,p=q.fx
if(p===$){if(q.a.gaz()){s=q.cy
s=s==null?null:s.gdM()
r=s===!0}else r=!0
q.fx!==$&&A.M()
p=q.fx=r}return p},
aq(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null
if(!h.dZ(a))return g
s=h.f
r=s==null
if(r&&h.gF()&&!isNaN(h.go))return h.fy
if(h.go===a)return h.fy
h.go=a
q=h.b
p=q==null?g:q.aY(a)
if(!r){r=h.x
if(r!=null){r=r.m(a)
if(0>=r.length)return A.a(r,0)
r=r[0]
q=s.f
q===$&&A.C()
o=s.d
o===$&&A.C()
n=r*q-o}else n=(a-h.r)/h.w
p=A.bU(p,s.aq(n))}if(p==null)return h.fy=null
s=h.z
if(s!=null)r=s.length===1&&B.b.gae(s).gc8()||B.b.ab(s,new A.hd())
else r=!1
if(r){for(m=g,l=0;l<s.length;++l){k=s[l]
if(!k.d){r=k.b
r=r==="a"||r==="i"||r==="f"}else r=!1
if(r){r=k.a.a7(a)
if(r==null)j=g
else{q=k.e
if(q==null)q=g
else{q=q.m(a)
if(0>=q.length)return A.a(q,0)
q=q[0]}if(q==null)q=0
q=Math.max(0,q)
j=new A.a6(r.a-q,r.b-q,r.c+q,r.d+q)}if(j!=null)m=A.bU(m,j)}}if(m!=null){p=p.bv(m)
if(p.gZ(0))return h.fy=null}}for(i=h;i!=null;i=i.cy)p=i.a.cl(p,a)
return h.fy=p},
dZ(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
fO(a,b){var s=this.a.e.m(a)
if(0>=s.length)return A.a(s,0)
return B.a.A(B.c.W(b*B.c.D(s[0])/100),0,255)},
aQ(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gc8()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.m(a)
if(0>=q.length)return A.a(q,0)
return B.a.A(B.c.D(q[0]*255/100),0,255)}return 255}}
A.hc.prototype={
$1(a){return t.J.a(a).gF()},
$S:2}
A.ha.prototype={
$1(a){return t.J.a(a).b!=="n"},
$S:2}
A.hb.prototype={
$1(a){t.J.a(a)
return a.b==="n"||a.gF()},
$S:2}
A.hd.prototype={
$1(a){t.J.a(a)
return a.b==="a"&&!a.d},
$S:2}
A.a_.prototype={
gdN(){var s,r=this,q=r.d
if(q===$){s=B.b.an(r.a,new A.h1())
r.d!==$&&A.M()
r.d=s
q=s}return q},
gb4(){var s,r=this,q=r.e
if(q===$){s=r.eK()
r.e!==$&&A.M()
r.e=s
q=s}return q},
eK(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.b.gae(n)
if(s instanceof A.a_){r=s.c
r=r.gaz()&&r.gcf()}else r=!1
return r?s.gb4():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.a_){r=o.c
r=r.gaz()&&r.gcf()}else r=!1
if(r){if(q==null)q=B.b.e8(n,0,p)
B.b.ag(q,o.gb4())}else if(q!=null)B.b.n(q,o)}return q==null?n:q},
gcs(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gb4()
r=null
if(!(s.length!==1)){q=B.b.gae(s)
A:{if(q instanceof A.b4){s=q
break A}if(q instanceof A.a_){s=q.gcs()
break A}s=r
break A}r=s}p.f!==$&&A.M()
o=p.f=r}return o},
gF(){var s,r=this,q=r.ax
if(q===$){s=r.c.gF()&&B.b.ab(r.a,new A.h3())&&B.b.ab(r.b,new A.h4())
r.ax!==$&&A.M()
q=r.ax=s}return q},
ga5(){var s,r=this,q=r.ay
if(q===$){s=r.c.gaN()&&B.b.ab(r.a,new A.h2())
r.ay!==$&&A.M()
q=r.ay=s}return q},
a7(a){var s,r,q,p,o=this
if(o.ga5()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.W)(s),++p)q=A.bU(q,s[p].a7(a))
if(q==null)return o.z=null
return o.z=o.c.cl(q,a)},
aY(a){var s,r,q,p,o,n=this
if(n.gF()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.m(a)
if(0>=r.length)return A.a(r,0)
if(B.c.D(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.W)(r),++o)p=A.bU(p,r[o].aY(a))
if(p==null)return n.Q=null
return n.Q=s.cl(p,a)},
$iav:1,
$iw:1}
A.h1.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a_)||a.gdN()},
$S:1}
A.h3.prototype={
$1(a){return t.u.a(a).gF()},
$S:1}
A.h4.prototype={
$1(a){return t.G.a(a).gF()},
$S:72}
A.h2.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.aH.prototype={
gF(){var s,r=this,q=r.d
if(q===$){s=B.b.ab(r.a,new A.hf())
r.d!==$&&A.M()
r.d=s
q=s}return q},
ga5(){var s,r=this,q=r.e
if(q===$){s=B.b.ab(r.a,new A.he())
r.e!==$&&A.M()
r.e=s
q=s}return q},
a7(a){var s,r,q,p,o,n,m,l,k=this,j=null
if(k.ga5()&&!isNaN(k.x))return k.w
if(k.x===a)return k.w
k.x=a
s=k.a
r=s.length
if(r===0)return k.w=null
if(r===1){q=k.b
if(q===3||q===4)s=j
else{if(0>=r)return A.a(s,0)
s=s[0].a7(a)}return k.w=s}q=k.b
if(q===4){p=B.b.gac(s).a7(a)
if(p==null)return k.w=null
for(o=j,n=0;n<s.length-1;++n)o=A.bU(o,s[n].a7(a))
if(o==null)return k.w=null
m=p.bv(o)
return k.w=m.gZ(0)?j:m}if(q===3)--r
for(l=j,n=0;n<r;++n){if(!(n<s.length))return A.a(s,n)
l=A.bU(l,s[n].a7(a))}return k.w=l},
$iw:1}
A.hf.prototype={
$1(a){return t.u.a(a).gF()},
$S:1}
A.he.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.e1.prototype={
ga5(){return this.gF()},
a7(a){var s=this
if(s.gF()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.cc(a)},
$iw:1}
A.au.prototype={
gF(){return this.e.a!=null},
cc(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.m(a),f=g.length
if(f===0)return B.aJ
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
if(h>q)q=h}return new A.a6(s,r,p,q)}}
A.aJ.prototype={
gF(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
cc(a){var s,r,q,p=this.r.m(a),o=this.w.m(a),n=o.length
if(0>=n)return A.a(o,0)
s=Math.abs(o[0]*0.5)
if(1>=n)return A.a(o,1)
r=Math.abs(o[1]*0.5)
n=p.length
if(0>=n)return A.a(p,0)
q=p[0]
if(1>=n)return A.a(p,1)
n=p[1]
return new A.a6(q-s,n-r,q+s,n+r)}}
A.aQ.prototype={
gF(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
cc(a){var s,r,q=this.w.m(a),p=this.y.m(a)
if(0>=p.length)return A.a(p,0)
p=p[0]
s=this.z.m(a)
if(0>=s.length)return A.a(s,0)
r=Math.abs(p)*(1+Math.abs(s[0]*0.01)*0.5)
s=q.length
if(0>=s)return A.a(q,0)
p=q[0]
if(1>=s)return A.a(q,1)
s=q[1]
return new A.a6(p-r,s-r,p+r,s+r)},
eL(d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=this,d4=t.bn
d4.a(d6)
d4.a(d7)
t.fi.a(d8)
t.O.a(d9)
s=d3.w.m(d5)
d4=s.length
if(0>=d4)return A.a(s,0)
r=s[0]
if(1>=d4)return A.a(s,1)
q=s[1]
d4=d3.x.m(d5)
if(0>=d4.length)return A.a(d4,0)
p=d4[0]
d4=d3.y.m(d5)
if(0>=d4.length)return A.a(d4,0)
o=d4[0]
d4=d3.z.m(d5)
if(0>=d4.length)return A.a(d4,0)
n=d4[0]
d4=d3.r.m(d5)
if(0>=d4.length)return A.a(d4,0)
m=d4[0]
if(d3.e){l=Math.max(1,m)
d4=d3.Q
if(d4==null)k=null
else{d4=d4.m(d5)
if(0>=d4.length)return A.a(d4,0)
d4=d4[0]
k=d4}if(k==null)k=0
d4=d3.as
if(d4==null)j=null
else{d4=d4.m(d5)
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
else{b9=A.hP(a,a0,a4)
c0=A.hP(b5,b6,b3)
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
if(d4){d1=A.hP(a,a0,o)
d2=A.hP(b5,b6,o)
d8.$8(a2-d*d1.a,a3-d*d1.b,b7+d*d2.a,b8+d*d2.b,b7,b8,a2,a3)}else d7.$2(b7,b8)
i+=h}d9.$0()}}}
A.b4.prototype={
gc3(){var s,r=this,q=r.fr
if(q===$){s=B.b.ab(r.a,new A.hn())
r.fr!==$&&A.M()
r.fr=s
q=s}return q},
f3(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.b.gae(r.a)
while(s instanceof A.P)s=s.a
if((s instanceof A.aJ||s instanceof A.au||s instanceof A.aQ)&&s.gF())return s
return null},
cQ(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.W)(s),++p)q=A.bU(q,s[p].a7(a))
return q},
gF(){var s,r,q,p=this,o=null,n=!1
if(p.gc3())if(p.b.a!=null)if(p.c.a!=null)if(p.d.a!=null){s=p.y
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
n=n==null?o:n.gF()
n=n!==!1}}return n},
aY(a){var s,r,q,p,o,n,m=this,l=m.c.m(a)
if(0>=l.length)return A.a(l,0)
if(B.c.D(l[0])<=0)return null
if(m.e){l=m.d.m(a)
if(0>=l.length)return A.a(l,0)
s=l[0]
if(s<=0)return null
r=m.w===1?Math.max(1.42,m.x):1.42
q=s*0.5*r+1}else q=0
if(m.gc3()){p=m.fy
if(p===$){o=m.cQ(0)
m.fy!==$&&A.M()
m.fy=o
p=o}n=p}else n=m.cQ(a)
if(n==null)return null
return q===0?n:n.fJ(q)},
$iav:1}
A.hn.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.h8.prototype={
ed(a6,a7,a8,a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=a4.r
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
c=new A.e8(new Float64Array(A.R(A.h([h,b,h+a,b+a0,d+a1,a2+a5[a3],d,a2],k))),c)
c.ee(q,g,f,a5,e)
B.b.u(j,i,c)}}},
cd(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
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
l=new A.h9()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.e7()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.h9.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:73}
A.z.prototype={
gcm(){var s=this.a
s=s==null?null:s.length
return s==null?this.d.length:s},
m(c2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0=this,c1=c0.a
if(c1!=null)return c1
if(c2===c0.w)return c0.d
c0.w=c2
s=c0.b
r=s.a
q=s.e
p=s.c
c1=c0.d
o=c1.length
if(c2<B.i.ga6(r)){B.j.L(c1,0,o,q)
return c1}if(c2>=B.i.gac(r)){B.j.P(c1,0,o,q,(r.length-1)*p)
return c1}n=c0.r
m=r.length
l=m-1
k=!0
if(n<l){if(!(n<m))return A.a(r,n)
if(!(c2<r[n])){k=n+1
if(!(k<m))return A.a(r,k)
k=c2>=r[k]}}if(k){for(j=0;j+1<l;){i=B.a.I(j+l,1)
if(!(i<m))return A.a(r,i)
if(r[i]<=c2)j=i
else l=i}c0.r=j
n=j}h=n*p
k=s.d
g=k.length
if(!(n>=0&&n<g))return A.a(k,n)
f=k[n]
if((f&1)!==0){B.j.P(c1,0,o,q,h)
return c1}e=m+n
if(!(e<g))return A.a(k,e)
d=k[e]
e=n+1
if(!(e<m))return A.a(r,e)
e=r[e]
if(!(n<m))return A.a(r,n)
c=r[n]
b=e-c
a=b<=0?0:B.c.A((c2-c)/b,0,1)
m=2*m+n
if(!(m<g))return A.a(k,m)
a0=k[m]
a1=B.a.I(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.cd(a0,a)
k=s.w
if(k==null)a4=null
else{if(!(n<k.length))return A.a(k,n)
a4=k[n]}if(a4!=null)a4.e3(B.c.A(a3,0,1),c1)
else if(c0.c&&o>=32&&a1<=1)if(a3<=0)B.j.P(c1,0,o,q,h)
else if(a3>=1)B.j.P(c1,0,o,q,d)
else{n=$.de()
n.$flags&2&&A.f(n)
n[0]=a3
m=n[0]
n[0]=a3
k=n[0]
n[0]=a3
g=n[0]
n[0]=a3
a5=new A.aE(m,k,g,n[0])
g=s.x
g.toString
a6=B.a.J(h,4)
a7=B.a.J(d,4)
a8=c0.e
if(a8==null)a8=c0.e=J.j8(B.j.gaa(c1),0,o/4|0)
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
b3=new A.aE(b1,b2,b3,n[0]).ad(0,a5)
n[0]=c.a+b3.a
b2=n[0]
n[0]=c.b+b3.b
b1=n[0]
n[0]=c.c+b3.c
e=n[0]
n[0]=c.d+b3.d
a8.u(0,a9,new A.aE(b2,b1,e,n[0]))}for(a9=k*4,n=q.length,k=c1.$flags|0;a9<o;++a9){g=h+a9
if(!(g<n))return A.a(q,g)
g=q[g]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=q[e]
k&2&&A.f(c1)
c1[a9]=g+(e-g)*m}}else if(c0.f)for(n=q.length,k=c1.$flags|0,g=a1>1,a9=0;a9<o;++a9){b4=g&&m?s.cd(a0+4*B.a.M(a9,a1),a):a3
e=h+a9
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.kL()
e=B.a.A(B.c.D(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
b5=c[e]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=B.a.A(B.c.D(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.hu(b5+(c[e]-b5)*B.c.A(b4,0,1))
k&2&&A.f(c1)
c1[a9]=e}else if(a1<=1||a2)if(a3<=0)B.j.P(c1,0,o,q,h)
else if(a3>=1)B.j.P(c1,0,o,q,d)
else for(n=q.length,m=c1.$flags|0,b6=d,b7=h,a9=0;a9<o;++a9,++b7,++b6){if(!(b7<n))return A.a(q,b7)
b8=q[b7]
if(!(b6>=0&&b6<n))return A.a(q,b6)
b9=q[b6]
k=b8===b9?b8:b8+(b9-b8)*a3
m&2&&A.f(c1)
c1[a9]=k}else for(n=q.length,m=c1.$flags|0,a9=0;a9<o;++a9){b4=s.cd(a0+4*B.a.M(a9,a1),a)
k=h+a9
if(!(k<n))return A.a(q,k)
b8=q[k]
k=d+a9
if(!(k>=0&&k<n))return A.a(q,k)
b9=q[k]
if(b4<=0)k=b8
else if(b4>=1)k=b9
else k=b8===b9?b8:b8+(b9-b8)*b4
m&2&&A.f(c1)
c1[a9]=k}return c1}}
A.e8.prototype={
ee(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this,j=k.a,i=j.length
if(0>=i)return A.a(j,0)
s=j[0]
if(1>=i)return A.a(j,1)
r=j[1]
for(j=k.b,i=j.$flags|0,q=1;q<129;++q,r=o,s=p){e=q/128
p=k.be(e,0)
o=k.be(e,1)
n=j[q-1]
m=p-s
l=o-r
l=Math.sqrt(m*m+l*l)
i&2&&A.f(j)
j[q]=n+l}},
be(a,b){var s,r,q,p,o,n=1-a,m=this.a,l=m.length
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
e3(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
if(a<=0){s=i.a
r=s.length
if(0>=r)return A.a(s,0)
q=s[0]
b.$flags&2&&A.f(b)
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
b.$flags&2&&A.f(b)
p=b.length
if(0>=p)return A.a(b,0)
b[0]=q
if(7>=r)return A.a(s,7)
s=s[7]
if(1>=p)return A.a(b,1)
b[1]=s
return}s=i.b
o=B.i.gac(s)*a
for(n=0,m=128;n+1<m;){l=n+m>>>1
if(!(l<129))return A.a(s,l)
if(s[l]<=o)n=l
else m=l}if(!(m>=0&&m<129))return A.a(s,m)
r=s[m]
if(!(n>=0&&n<129))return A.a(s,n)
s=s[n]
k=r-s
j=(n+(k===0?0:(o-s)/k))/128
s=i.be(j,0)
b.$flags&2&&A.f(b)
r=b.length
if(0>=r)return A.a(b,0)
b[0]=s
s=i.be(j,1)
b.$flags&2&&A.f(b)
if(1>=r)return A.a(b,1)
b[1]=s}}
A.a6.prototype={
gZ(a){var s=this
return s.a>=s.c||s.b>=s.d},
fJ(a){var s=this
return new A.a6(s.a-a,s.b-a,s.c+a,s.d+a)},
bv(a){var s=this
return new A.a6(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.f7.prototype={
fn(){var s,r=this.a,q=J.O(r)
switch(A.k(A.Q(q.h(r,0)))){case 0:s=q.h(r,1)==null?null:A.G(q.h(r,1))
r=new A.a0(0,s,A.k(A.Q(q.h(r,2))))
break
case 1:r=new A.aS([1,A.G(q.h(r,1)),t.bm.a(q.h(r,2)),A.bn(q.h(r,3))])
break
case 2:r=new A.bO([2,A.k(A.Q(q.h(r,1))),A.G(q.h(r,2)),A.G(q.h(r,3)),A.Q(q.h(r,4)),A.k(A.Q(q.h(r,5))),A.k(A.Q(q.h(r,6))),A.k(A.Q(q.h(r,7))),A.k(A.Q(q.h(r,8))),A.bn(q.h(r,9))])
break
case 5:r=new A.cc([5,A.k(A.Q(q.h(r,1))),A.G(q.h(r,2)),A.G(q.h(r,3)),A.k(A.Q(q.h(r,4))),A.k(A.Q(q.h(r,5))),A.Q(q.h(r,6)),A.Q(q.h(r,7)),A.k(A.Q(q.h(r,8))),A.k(A.Q(q.h(r,9))),A.k(A.Q(q.h(r,10))),A.bn(q.h(r,11))])
break
case 4:r=B.az
break
default:r=A.u(B.a_)}return r}}
A.aX.prototype={
b7(a){if($.j!=null)this.b=A.aK(a*4)
else this.c=new Int32Array(a)},
gt(){var s=this.b
if(s!=null)s=A.dB(t.a.a(A.r($.j.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
ap(a,b){var s,r,q,p,o,n=this
if(n.b!=null){s=A.aK(a*4)
r=A.dB(t.a.a(A.r($.j.memory).buffer),s,a)
if(b>0)B.e.L(r,0,b,n.gt())
q=$.j
q.toString
p=n.b
p.toString
q.free(p)
n.b=s
n.a=a}else{o=new Int32Array(a)
if(b>0){q=n.c
q.toString
B.e.L(o,0,b,q)}n.c=o
n.a=a}},
a4(){var s=this.b
if(s!=null){$.j.free(s)
this.b=null}}}
A.c3.prototype={
gt(){var s=this.c
if(s!=null)s=A.iw(t.a.a(A.r($.j.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
ap(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.d(A.at("Cannot resize a borrowed pixel buffer"))
if(n.c!=null){s=A.aK(a*4)
r=A.iw(t.a.a(A.r($.j.memory).buffer),s,a)
if(b>0)B.f.L(r,0,b,n.gt())
q=$.j
q.toString
p=n.c
p.toString
q.free(p)
n.c=s
n.b=a}else{o=new Uint32Array(a)
if(b>0){q=n.d
q.toString
B.f.L(o,0,b,q)}n.d=o
n.b=a}},
a4(){var s,r,q=this
if(q.a&&q.c!=null){s=$.j
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.eO.prototype={
fT(a,b,c,d,e,f,g,h,i,j,k,a0){var s,r,q,p,o,n,m=this,l=(j-h)*(k-i)
if(e<2||f===0||a0.b==null||l>262144)return-2
if(l>m.e)m.e=l
s=m.c
if(e>s){if(s>0){$.j.free(m.f)
$.j.free(m.r)}s=e*2
m.c=s
m.f=A.aK(s*8)
m.r=A.aK(m.c*8)}s=m.d
if(f>s){if(s>0){$.j.free(m.w)
$.j.free(m.x)}s=f*2
m.d=s
m.w=A.aK(s*4)
m.x=A.aK(m.d*4)}s=t.a
B.i.L(A.iv(s.a(A.r($.j.memory).buffer),m.f,m.c),0,e,a)
B.i.L(A.iv(s.a(A.r($.j.memory).buffer),m.r,m.c),0,e,b)
B.e.L(A.dB(s.a(A.r($.j.memory).buffer),m.w,m.d),0,f,c)
B.e.L(A.dB(s.a(A.r($.j.memory).buffer),m.x,m.d),0,f,d)
r=new A.eQ(m,f,h,i,j,k,g,a0)
q=r.$0()
while(q===-1){p=a0.b
if(p!=null){o=s.a(A.r($.j.memory).buffer)
n=a0.a
p=new Int32Array(o,p,n)}else{p=a0.c
p.toString}a0.ap(p.length*2,0)
q=r.$0()}return q},
fY(){if($.eP!==this){this.a4()
return}var s=$.cw-1
$.cw=s
if(s>0)return
$.cw=0
$.eP=null
this.a4()},
a4(){var s=this,r=s.a
if(r!==0)$.j.fl_dense_free(r)
$.j.free(s.b)
if(s.c>0){$.j.free(s.f)
$.j.free(s.r)
s.r=s.f=s.c=0}if(s.d>0){$.j.free(s.w)
$.j.free(s.x)
s.x=s.w=s.d=0}}}
A.eQ.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=$.j
j.toString
s=k.a
r=s.f
q=s.r
p=s.w
o=s.x
n=k.r?1:0
m=k.w
l=m.b
l.toString
return A.dc(j,"fl_dense_raster",[s.a,r,q,p,o,k.b,k.c,k.d,k.e,k.f,n,l,m.gt().length/2|0,s.b],t.S)},
$S:74}
A.f1.prototype={}
A.dN.prototype={
aw(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
cX(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdi()},
gcI(){var s=this.x
return s===$?this.x=B.a.J(this.a+16-1,16):s},
gdi(){var s,r,q=this,p=q.y
if(p===$){s=q.gcI()
r=B.a.J(q.b+16-1,16)
q.y!==$&&A.M()
p=q.y=s*r}return p},
fV(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdi(),b=d.cX(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.cX(a5.b):-1
if(a2===b)return
for(a0=d.a,s=d.b,r=d.f,q=a2>=0,p=d.e,o=p.length,n=0;n<c;++n){m=b+n
if(!(m>=0&&m<o))return A.a(p,m)
l=p[m]
if(q){m=a2+n
if(!(m<o))return A.a(p,m)
m=p[m]===l}else m=!1
if(m)continue
m=d.gcI()
k=B.a.M(n,m)*16
j=B.a.a1(n,m)*16
i=Math.min(16,a0-k)
h=Math.min(16,s-j)
if(!(l<r.length))return A.a(r,l)
g=r[l]
for(m=i*4,f=0;f<h;++f){e=((j+f)*a0+k)*4
B.d.P(a4,e,e+m,g,f*i*4)}}if(!a){a5.a=a1
a5.b=a3}}}
A.f2.prototype={
$0(){return A.h([],t.t)},
$S:75}
A.i1.prototype={
$1(a){return this.e0(a)},
e0(a5){var s=0,r=A.k9(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.kf(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.f7(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.k(A.Q(J.ad(n.a,0)))!==-1||A.k(A.Q(J.ad(n.a,1)))!==1)throw A.d(B.T)
q=10
s=13
return A.hG(A.j2(A.r(A.r(v.G.self).fetch(A.G(J.ad(n.a,2)))),t.m),$async$$1)
case 13:m=a7
s=A.bn(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.hG(A.j2(A.r(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.hG(a3.i_(a4.ix(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.nK(o.b)
d.a=!0
l=null
k=null
j=A.iZ([-2,1,$.j!=null])
l=j.a
k=j.b
A.r(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.n(d)
a=b.c.a(n.fn())
a0=d.b
if(a0>=4)A.u(d.cE())
if((a0&1)!==0)d.bZ(a)
else if((a0&3)===0)d.cO().n(0,new A.bG(a,b.i("bG<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.ac(a2)
h=null
g=null
f=A.iZ([-3,A.t(i)])
h=f.a
g=f.b
A.r(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.jX(null,r)
case 1:return A.jW(p.at(-1),r)}})
return A.jY($async$$1,r)},
$S:76}
A.i2.prototype={
$1(a){return A.lc(new A.i1(this.a,this.b).$1(A.r(a)),t.b)},
$S:77}
A.fv.prototype={
ar(a){var s=A.nn(a)
A.r(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bd.prototype
s.ea=s.p})();(function installTearOffs(){var s=hunkHelpers._static_1,r=hunkHelpers._static_0,q=hunkHelpers._static_2,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(A,"nc","lI",4)
s(A,"nd","lJ",4)
s(A,"ne","lK",4)
r(A,"kh","n7",0)
q(A,"ng","mX",7)
r(A,"nf","mW",0)
p(A.I.prototype,"gev","ew",7)
s(A,"j3","d9",1)
var m
o(m=A.e_.prototype,"gh2","B",33)
o(m,"gb5","ct",34)
o(m,"gfv","fw",35)
o(m,"gfQ","fR",36)
o(m,"gfN","cj",37)
p(m=A.aw.prototype,"gfe","q",61)
n(m,"gfz","a0",0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.i,null)
q(A.i,[A.ir,J.B,A.cI,J.bt,A.K,A.bb,A.eX,A.m,A.by,A.cO,A.E,A.bD,A.a3,A.cR,A.aZ,A.f3,A.eT,A.cp,A.d1,A.L,A.eJ,A.cv,A.aD,A.cu,A.dv,A.cT,A.c5,A.fg,A.e5,A.hy,A.aE,A.aF,A.e0,A.hw,A.hs,A.dR,A.ah,A.dV,A.b2,A.I,A.dS,A.cK,A.d2,A.dT,A.cQ,A.bk,A.dX,A.aI,A.e9,A.f9,A.e4,A.cS,A.A,A.dk,A.dm,A.hz,A.fw,A.dE,A.cJ,A.fx,A.X,A.be,A.V,A.ea,A.c4,A.eS,A.eC,A.f8,A.eE,A.dq,A.bg,A.fu,A.ds,A.e7,A.er,A.eL,A.ew,A.b,A.bF,A.hj,A.e_,A.bK,A.P,A.b6,A.bR,A.c9,A.bC,A.eW,A.bI,A.aw,A.dW,A.ax,A.fP,A.hm,A.bQ,A.a2,A.h5,A.dZ,A.aa,A.a_,A.aH,A.e1,A.b4,A.h8,A.z,A.e8,A.a6,A.f7,A.aX,A.c3,A.eO,A.f1,A.dN,A.fv])
q(J.B,[J.cq,J.cs,J.N,J.bv,J.bw,J.ct,J.c0])
q(J.N,[J.bd,J.v,A.bf,A.cC])
q(J.bd,[J.dF,J.cM,J.aj])
r(J.dt,A.cI)
r(J.eF,J.v)
q(J.ct,[J.cr,J.du])
q(A.K,[A.aU,A.b0,A.dw,A.dP,A.dJ,A.dY,A.dg,A.aN,A.cN,A.dO,A.bh,A.dl])
q(A.bb,[A.di,A.dj,A.dM,A.hX,A.hZ,A.fc,A.fb,A.hH,A.fY,A.eZ,A.ez,A.i6,A.i7,A.eD,A.es,A.et,A.fs,A.fi,A.fh,A.fp,A.fn,A.fl,A.fm,A.fk,A.fr,A.hv,A.ft,A.i9,A.ia,A.ib,A.id,A.i8,A.ho,A.hr,A.hO,A.hL,A.hM,A.hK,A.fy,A.hc,A.ha,A.hb,A.hd,A.h1,A.h3,A.h4,A.h2,A.hf,A.he,A.hn,A.h9,A.i1,A.i2])
q(A.di,[A.i4,A.fd,A.fe,A.ht,A.fQ,A.fU,A.fT,A.fS,A.fR,A.fX,A.fW,A.fV,A.f_,A.hl,A.hk,A.ff,A.hg,A.fa,A.hS,A.hB,A.hA,A.h0,A.hE,A.fM,A.fN,A.fG,A.fH,A.fI,A.fJ,A.fK,A.fL,A.fA,A.fC,A.fB,A.fO,A.fz,A.fE,A.fD,A.fF,A.hp,A.eQ,A.f2])
q(A.m,[A.aO,A.bE,A.dQ])
q(A.aO,[A.a9,A.T,A.eK,A.bx])
q(A.a9,[A.U,A.e3])
q(A.a3,[A.ca,A.aR,A.bN,A.cb])
r(A.cZ,A.ca)
q(A.aR,[A.bO,A.cc,A.aS,A.bP,A.ce])
q(A.bN,[A.F,A.cd])
r(A.a0,A.cb)
q(A.aZ,[A.co,A.d0])
r(A.J,A.co)
r(A.cF,A.b0)
q(A.dM,[A.dK,A.c_])
q(A.L,[A.aT,A.e2])
q(A.dj,[A.eG,A.hY,A.hI,A.hT,A.fZ,A.eM,A.eN,A.h7,A.eB,A.eA,A.eu,A.fj,A.fo,A.fq,A.ic,A.ie,A.hR])
r(A.ae,A.aT)
r(A.c1,A.bf)
r(A.e6,A.e5)
r(A.cx,A.e6)
r(A.ef,A.cx)
r(A.ee,A.ef)
q(A.cC,[A.dz,A.a5])
q(A.a5,[A.cU,A.cW])
r(A.cV,A.cU)
r(A.cA,A.cV)
r(A.cX,A.cW)
r(A.cB,A.cX)
q(A.cA,[A.c2,A.cy])
q(A.cB,[A.dA,A.cz,A.dC,A.dD,A.cD,A.cE,A.bz])
r(A.cg,A.dY)
r(A.cP,A.dV)
r(A.c6,A.d2)
r(A.d4,A.cK)
r(A.c7,A.d4)
r(A.c8,A.cQ)
r(A.bG,A.bk)
r(A.b3,A.d0)
r(A.bL,A.b3)
r(A.dx,A.dk)
q(A.dm,[A.eH,A.f6])
q(A.aN,[A.aY,A.dp])
q(A.f8,[A.h_,A.hD])
q(A.bg,[A.dy,A.eY,A.bA])
q(A.X,[A.bZ,A.f5])
q(A.bZ,[A.cm,A.df])
r(A.cn,A.fw)
r(A.dr,A.ds)
q(A.e1,[A.au,A.aJ,A.aQ])
s(A.e5,A.A)
s(A.e6,A.E)
s(A.cU,A.A)
s(A.cV,A.E)
s(A.cW,A.A)
s(A.cX,A.E)
s(A.ef,A.bD)
s(A.c6,A.dT)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{c:"int",e:"double",bX:"num",o:"String",x:"bool",V:"Null",p:"List",i:"Object",as:"Map",H:"JSObject"},mangledNames:{},types:["~()","x(w)","x(a2)","~(@)","~(~())","V(@)","V()","~(i,am)","x(@)","@()","x()","x(+(o,c))","bc(@,b,bc?,c,c)","~(c)","~(i?,i?)","@(o)","V(aj,aj)","i?(i?)","i(i,am)","x(bg)","@(@)","x(c,bi)","V(@,am)","x(aa)","z(c{dimensions:c})","~(c,c)","ai<~>()","e(o,e)","~(c,@)","~(@,c)","~(p<w>)","w(P)","V(~())","z(z)","w(w)","av(av)","a2(a2)","aa(aa)","z()","bQ()","P()","b6()","aH()","au()","aJ()","aQ()","b4()","a_()","bK()","bR()","c9()","a2()","V(i,am)","bF()","x(z)","@(@,o)","bi(c)","~(o,o,c)","~(o,bC)","~(c,o)","~(i?)","~(e,e)","cL()","c(c,c,e)","e(e)","~(a2,ax)","~(e,e,e,e,e,e,e,e)","~(e,e,e,e,e,e,c)","~(e,e,e,e,e,e)","~(c,c,e,e,x)","c(e)","~(o,@)","x(av)","e(e,e,e)","c()","p<c>()","ai<V>(H)","H(H)","aa()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.cZ&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.F&&a.b(c.a)&&b.b(c.b),"2;compressedBytes,entryDiskBytes":(a,b)=>c=>c instanceof A.cd&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.a0&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.aS&&A.ep(a,b.a),"6;":a=>b=>b instanceof A.bP&&A.ep(a,b.a),"7;":a=>b=>b instanceof A.ce&&A.ep(a,b.a),"10;":a=>b=>b instanceof A.bO&&A.ep(a,b.a),"12;":a=>b=>b instanceof A.cc&&A.ep(a,b.a)}}
A.mc(v.typeUniverse,JSON.parse('{"aj":"bd","dF":"bd","cM":"bd","nW":"bf","cq":{"B":[],"x":[],"y":[]},"cs":{"B":[],"V":[],"y":[]},"N":{"B":[],"H":[]},"bd":{"N":[],"B":[],"H":[]},"bv":{"B":[]},"bw":{"B":[]},"v":{"p":["1"],"N":[],"B":[],"H":[],"m":["1"]},"dt":{"cI":[]},"eF":{"v":["1"],"p":["1"],"N":[],"B":[],"H":[],"m":["1"]},"bt":{"a7":["1"]},"ct":{"e":[],"bX":[],"B":[]},"cr":{"e":[],"c":[],"bX":[],"B":[],"y":[]},"du":{"e":[],"bX":[],"B":[],"y":[]},"c0":{"o":[],"B":[],"eV":[],"y":[]},"aU":{"K":[]},"aO":{"m":["1"]},"a9":{"aO":["1"],"m":["1"]},"by":{"a7":["1"]},"U":{"a9":["2"],"aO":["2"],"m":["2"],"m.E":"2","a9.E":"2"},"bE":{"m":["1"],"m.E":"1"},"cO":{"a7":["1"]},"cZ":{"ca":[],"a3":[]},"bO":{"aR":[],"a3":[]},"cc":{"aR":[],"a3":[]},"F":{"bN":[],"a3":[]},"cd":{"bN":[],"a3":[]},"a0":{"cb":[],"a3":[]},"aS":{"aR":[],"a3":[]},"bP":{"aR":[],"a3":[]},"ce":{"aR":[],"a3":[]},"cR":{"a7":["1"]},"co":{"aZ":["1"],"aP":["1"],"m":["1"]},"J":{"co":["1"],"aZ":["1"],"aP":["1"],"m":["1"]},"cF":{"b0":[],"K":[]},"dw":{"K":[]},"dP":{"K":[]},"d1":{"am":[]},"bb":{"bu":[]},"di":{"bu":[]},"dj":{"bu":[]},"dM":{"bu":[]},"dK":{"bu":[]},"c_":{"bu":[]},"dJ":{"K":[]},"aT":{"L":["1","2"],"it":["1","2"],"as":["1","2"],"L.K":"1","L.V":"2"},"T":{"aO":["1"],"m":["1"],"m.E":"1"},"cv":{"a7":["1"]},"eK":{"aO":["1"],"m":["1"],"m.E":"1"},"aD":{"a7":["1"]},"bx":{"aO":["be<1,2>"],"m":["be<1,2>"],"m.E":"be<1,2>"},"cu":{"a7":["be<1,2>"]},"ae":{"aT":["1","2"],"L":["1","2"],"it":["1","2"],"as":["1","2"],"L.K":"1","L.V":"2"},"bN":{"a3":[]},"ca":{"a3":[]},"cb":{"a3":[]},"aR":{"a3":[]},"dv":{"lA":[],"eV":[]},"cT":{"dH":[]},"dQ":{"m":["dH"],"m.E":"dH"},"c5":{"a7":["dH"]},"c1":{"bf":[],"N":[],"B":[],"H":[],"y":[]},"bf":{"N":[],"B":[],"H":[],"y":[]},"cx":{"ex":[],"A":["a4"],"p":["a4"],"m":["a4"],"E":["a4"],"y":[],"A.E":"a4","E.E":"a4"},"ee":{"ex":[],"A":["a4"],"bD":["a4"],"p":["a4"],"m":["a4"],"E":["a4"],"y":[],"A.E":"a4","bD.E":"a4","E.E":"a4"},"cC":{"N":[],"B":[],"H":[]},"dz":{"N":[],"B":[],"H":[],"y":[]},"a5":{"ak":["1"],"N":[],"B":[],"H":[]},"cA":{"A":["e"],"a5":["e"],"p":["e"],"ak":["e"],"N":[],"B":[],"H":[],"m":["e"],"E":["e"]},"cB":{"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"]},"c2":{"bc":[],"A":["e"],"a5":["e"],"p":["e"],"ak":["e"],"N":[],"B":[],"H":[],"m":["e"],"E":["e"],"y":[],"A.E":"e","E.E":"e"},"cy":{"ey":[],"A":["e"],"a5":["e"],"p":["e"],"ak":["e"],"N":[],"B":[],"H":[],"m":["e"],"E":["e"],"y":[],"A.E":"e","E.E":"e"},"dA":{"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"cz":{"io":[],"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"dC":{"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"dD":{"iB":[],"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"cD":{"cL":[],"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"cE":{"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"bz":{"bi":[],"A":["c"],"a5":["c"],"p":["c"],"ak":["c"],"N":[],"B":[],"H":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"aE":{"a4":[]},"dY":{"K":[]},"cg":{"b0":[],"K":[]},"ah":{"K":[]},"cP":{"dV":["1"]},"I":{"ai":["1"]},"d2":{"jt":["1"],"js":["1"],"jG":["1"],"bH":["1"]},"c6":{"dT":["1"],"d2":["1"],"jt":["1"],"js":["1"],"jG":["1"],"bH":["1"]},"c7":{"d4":["1"],"cK":["1"]},"c8":{"cQ":["1"],"dL":["1"],"bH":["1"]},"cQ":{"dL":["1"],"bH":["1"]},"d4":{"cK":["1"]},"bG":{"bk":["1"]},"dX":{"bk":["@"]},"b3":{"aZ":["1"],"aP":["1"],"m":["1"]},"bL":{"b3":["1"],"aZ":["1"],"aP":["1"],"m":["1"]},"cS":{"a7":["1"]},"L":{"as":["1","2"]},"aZ":{"aP":["1"],"m":["1"]},"d0":{"aZ":["1"],"aP":["1"],"m":["1"]},"e2":{"L":["o","@"],"as":["o","@"],"L.K":"o","L.V":"@"},"e3":{"a9":["o"],"aO":["o"],"m":["o"],"m.E":"o","a9.E":"o"},"dx":{"dk":["i?","o"]},"e":{"bX":[]},"c":{"bX":[]},"p":{"m":["1"]},"aP":{"m":["1"]},"o":{"eV":[]},"dg":{"K":[]},"b0":{"K":[]},"aN":{"K":[]},"aY":{"K":[]},"dp":{"aY":[],"K":[]},"cN":{"K":[]},"dO":{"K":[]},"bh":{"K":[]},"dl":{"K":[]},"dE":{"K":[]},"cJ":{"K":[]},"ea":{"am":[]},"dy":{"bg":[]},"eY":{"bg":[]},"dr":{"ds":[]},"bA":{"bg":[]},"P":{"w":[]},"b6":{"w":[]},"a_":{"w":[],"av":[]},"aH":{"w":[]},"au":{"w":[]},"aJ":{"w":[]},"aQ":{"w":[]},"b4":{"av":[]},"e1":{"w":[]},"le":{"p":["c"],"m":["c"]},"bi":{"p":["c"],"m":["c"]},"lG":{"p":["c"],"m":["c"]},"ld":{"p":["c"],"m":["c"]},"iB":{"p":["c"],"m":["c"]},"io":{"p":["c"],"m":["c"]},"cL":{"p":["c"],"m":["c"]},"bc":{"p":["e"],"m":["e"]},"ey":{"p":["e"],"m":["e"]},"ex":{"p":["a4"],"m":["a4"]}}'))
A.mb(v.typeUniverse,JSON.parse('{"a5":1,"bk":1,"d0":1,"dm":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.eo
return{a7:s("@<~>"),v:s("ah"),fA:s("cn"),M:s("J<o>"),R:s("K"),Y:s("a4"),Z:s("bu"),gd:s("B"),bM:s("m<e>"),hf:s("m<@>"),hb:s("m<c>"),dh:s("v<ey>"),f:s("v<i>"),hg:s("v<+(x,x)>"),s:s("v<o>"),a1:s("v<cL>"),gN:s("v<bi>"),U:s("v<av>"),ch:s("v<aa>"),bE:s("v<a2>"),A:s("v<w>"),cu:s("v<aw>"),gw:s("v<ax>"),fq:s("v<P>"),cl:s("v<z>"),n:s("v<e>"),o:s("v<@>"),t:s("v<c>"),a2:s("v<c3?>"),a6:s("v<i?>"),cU:s("v<aa?>"),T:s("cs"),m:s("H"),g:s("aj"),aU:s("ak<@>"),aX:s("N"),c2:s("ae<i,i>"),el:s("ae<i,dW>"),ed:s("ae<i,aw>"),bu:s("ae<i,e>"),ad:s("ae<bK,c3>"),gt:s("ae<as<o,@>,au>"),ew:s("p<i>"),V:s("p<nX>"),cH:s("p<w>"),dg:s("p<e>"),j:s("p<@>"),L:s("p<c>"),P:s("as<o,@>"),fP:s("U<P,w>"),a:s("c1"),bm:s("bz"),b:s("V"),K:s("i"),bl:s("bA"),b8:s("aY"),h:s("bC"),gT:s("nY"),bQ:s("+()"),gv:s("+(i?,i?,i?,i?,i?,i?,i?,i?,i?,i?)"),r:s("+(i?,i?,i?,i?,i?,i?,i?,i?,i?,i?,i?,i?)"),dn:s("+(i?)"),x:s("+(o,c)"),eG:s("+(c,b)"),ei:s("+(i?,i?)"),bP:s("+(o,e,e)"),h6:s("+(c,c,c)"),W:s("+(i?,i?,i?)"),a5:s("+(i?,i?,i?,i?)"),e6:s("+(i?,i?,i?,i?,i?,i?,i?)"),d:s("dH"),bC:s("aP<i>"),e:s("aP<o>"),cJ:s("aP<c>"),l:s("am"),N:s("o"),gz:s("dN"),dm:s("y"),k:s("b0"),p:s("bi"),ak:s("cM"),eU:s("bE<w>"),co:s("c6<i?>"),B:s("bF"),bo:s("c9"),G:s("av"),_:s("I<@>"),fJ:s("I<c>"),D:s("I<~>"),cK:s("bK"),eV:s("a_"),E:s("aa"),ai:s("bL<as<o,@>>"),ao:s("bL<i>"),J:s("a2"),eY:s("od"),u:s("w"),bs:s("w(P)"),g2:s("e7"),aj:s("P"),fv:s("d3<i?>"),I:s("z"),d1:s("bQ"),e_:s("bR"),y:s("x"),al:s("x(i)"),aT:s("x(w)"),i:s("e"),z:s("@"),fO:s("@()"),w:s("@(i)"),C:s("@(i,am)"),S:s("c"),c:s("bc(@,b,bc?,c,c)?"),eH:s("ai<V>?"),an:s("H?"),bF:s("p<@>?"),aM:s("as<+(o,e,e),bF>?"),cq:s("as<o,as<o,@>>?"),X:s("i?"),ae:s("aP<i>?"),dk:s("o?"),ev:s("bk<@>?"),F:s("b2<@,@>?"),Q:s("e4?"),cn:s("e8?"),fQ:s("x?"),cD:s("e?"),gs:s("c?"),cg:s("bX?"),g5:s("~()?"),q:s("bX"),H:s("~"),O:s("~()"),d5:s("~(i)"),da:s("~(i,am)"),cA:s("~(o,@)"),bn:s("~(e,e)"),fi:s("~(e,e,e,e,e,e,e,e)"),as:s("~(c,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a2=J.B.prototype
B.b=J.v.prototype
B.t=J.cq.prototype
B.a=J.cr.prototype
B.c=J.ct.prototype
B.p=J.c0.prototype
B.a3=J.aj.prototype
B.a4=J.N.prototype
B.j=A.c2.prototype
B.i=A.cy.prototype
B.e=A.cz.prototype
B.f=A.cD.prototype
B.d=A.bz.prototype
B.D=J.dF.prototype
B.u=J.cM.prototype
B.o=new A.cn(0,"littleEndian")
B.r=new A.cn(1,"bigEndian")
B.G=new A.eC()
B.v=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.H=function() {
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
B.M=function(getTagFallback) {
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
B.I=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.L=function(hooks) {
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
B.K=function(hooks) {
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
B.J=function(hooks) {
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
B.w=function(hooks) { return hooks; }

B.x=new A.dx()
B.N=new A.dE()
B.n=new A.eX()
B.k=new A.f9()
B.y=new A.dX()
B.O=new A.h_()
B.q=new A.ea()
B.P=new A.hD()
B.Q=new A.X("Truncated LZ4 match offset",null,null)
B.R=new A.X("Invalid Huffman code length",null,null)
B.S=new A.X("Invalid LZ4 match offset",null,null)
B.T=new A.X("Incompatible FastLottie worker host",null,null)
B.U=new A.X("LZ4 literal out of bounds",null,null)
B.V=new A.X("Empty LZ4 block",null,null)
B.W=new A.X("Truncated LZ4 literal len",null,null)
B.X=new A.X("Truncated LZ4 match len",null,null)
B.Y=new A.X("Lottie JSON exceeds decode budget",null,null)
B.Z=new A.X("LZ4 match out of output bounds",null,null)
B.a_=new A.X("Invalid raster worker request",null,null)
B.a0=new A.X("Incomplete Huffman table",null,null)
B.a1=new A.X("Oversubscribed Huffman table",null,null)
B.a5=new A.eH(null)
B.z=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.a6=s([10,7,2,7,0,0,0],t.t)
B.A=s([],t.o)
B.a7=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.l=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.a8=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.a9=s([10,7,7,7,7,7],t.t)
B.B=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.aa=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.ab=s(["_initialize","malloc","free","fastlottie_clear_pixels","fastlottie_fill_solid_spans","fastlottie_blend_rect","fastlottie_blend_solid","fastlottie_inner_shadow","fastlottie_gradient_spans","fl_dense_new","fl_dense_free","fl_dense_trim","fl_dense_raster"],t.s)
B.ac=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.C=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.az=new A.cZ(4)
B.aA=new A.F(0,-1)
B.aB=new A.F(1,4)
B.aC=new A.F(2,0)
B.aD=new A.F(3,1)
B.aE=new A.F(4,1)
B.aF=new A.F(5,1)
B.aG=new A.cd(0,0)
B.aH=new A.F(null,null)
B.aI=new A.a0(0,0,0)
B.aJ=new A.a6(0,0,0,0)
B.aq={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aK=new A.J(B.aq,21,t.M)
B.ae={v:0,i:1,o:2,c:3}
B.aL=new A.J(B.ae,4,t.M)
B.as={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aM=new A.J(B.as,11,t.M)
B.aj={ty:0,nm:1,mn:2,ix:3,v:4}
B.E=new A.J(B.aj,5,t.M)
B.av={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aN=new A.J(B.av,9,t.M)
B.am={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aO=new A.J(B.am,6,t.M)
B.at={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aP=new A.J(B.at,31,t.M)
B.ap={a:0,k:1,ix:2,x:3,l:4}
B.F=new A.J(B.ap,5,t.M)
B.ay={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aQ=new A.J(B.ay,19,t.M)
B.aw={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aR=new A.J(B.aw,10,t.M)
B.ai={s:0,x:1,y:2,ix:3}
B.aS=new A.J(B.ai,4,t.M)
B.ag={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aT=new A.J(B.ag,9,t.M)
B.ak={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aU=new A.J(B.ak,8,t.M)
B.ar={}
B.aV=new A.J(B.ar,0,t.M)
B.ah={a:0,s:1,i:2,f:3,n:4}
B.aW=new A.J(B.ah,5,t.M)
B.ax={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.aX=new A.J(B.ax,15,t.M)
B.ad={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.aY=new A.J(B.ad,7,t.M)
B.af={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.aZ=new A.J(B.af,10,t.M)
B.ao={n:0,nm:1,v:2}
B.b_=new A.J(B.ao,3,t.M)
B.an={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b0=new A.J(B.an,10,t.M)
B.al={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b1=new A.J(B.al,16,t.M)
B.au={p:0,k:1}
B.b2=new A.J(B.au,2,t.M)
B.b3=A.aA("nO")
B.b4=A.aA("nP")
B.b5=A.aA("bc")
B.b6=A.aA("ex")
B.b7=A.aA("ey")
B.b8=A.aA("ld")
B.b9=A.aA("io")
B.ba=A.aA("le")
B.bb=A.aA("i")
B.bc=A.aA("iB")
B.bd=A.aA("cL")
B.be=A.aA("lG")
B.bf=A.aA("bi")
B.bg=new A.f6(!1)
B.h=new A.b(null,null)
B.m=new A.b(B.h,"layers")})();(function staticFields(){$.h6=null
$.ao=A.h([],t.f)
$.jo=null
$.jg=null
$.jf=null
$.kk=null
$.kg=null
$.ko=null
$.hU=null
$.i0=null
$.j_=null
$.hh=A.h([],A.eo("v<p<i>?>"))
$.ch=null
$.da=null
$.db=null
$.iR=!1
$.D=B.k
$.ke=null
$.iP=null
$.j=null
$.eP=null
$.cw=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"nR","kt",()=>A.hV("_$dart_dartClosure"))
s($,"nQ","ig",()=>A.hV("_$dart_dartClosure_dartJSInterop"))
s($,"oq","kR",()=>B.k.bq(B.k,A.eo("ai<~>()").a(new A.i4()),A.eo("ai<~>")))
s($,"oo","kQ",()=>A.h([new J.dt()],A.eo("v<cI>")))
s($,"o_","kw",()=>A.b1(A.f4({
toString:function(){return"$receiver$"}})))
s($,"o0","kx",()=>A.b1(A.f4({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"o1","ky",()=>A.b1(A.f4(null)))
s($,"o2","kz",()=>A.b1(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"o5","kC",()=>A.b1(A.f4(void 0)))
s($,"o6","kD",()=>A.b1(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"o4","kB",()=>A.b1(A.jv(null)))
s($,"o3","kA",()=>A.b1(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"o8","kF",()=>A.b1(A.jv(void 0)))
s($,"o7","kE",()=>A.b1(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"nV","de",()=>A.ls(4))
s($,"o9","j5",()=>A.lH())
s($,"nS","j4",()=>$.kR())
s($,"ol","kO",()=>A.lt(4096))
s($,"oj","kM",()=>new A.hB().$0())
s($,"ok","kN",()=>new A.hA().$0())
s($,"om","eq",()=>A.i5(B.bb))
s($,"on","kP",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"nU","kv",()=>A.il(B.ac,!1))
s($,"nT","ku",()=>A.il(B.a7,!1))
s($,"nN","ks",()=>A.l1())
s($,"oc","kI",()=>A.dI("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"oa","kG",()=>A.dI("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"ob","kH",()=>A.dI('[\\\\"\\x00-\\x1f]'))
s($,"of","j7",()=>A.dI("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"oe","j6",()=>A.dI("content\\('([^']*)'\\)"))
s($,"og","kJ",()=>new A.hp().$0())
s($,"oi","kL",()=>A.m2())
s($,"oh","kK",()=>A.m1())})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bf,ArrayBuffer:A.c1,ArrayBufferView:A.cC,DataView:A.dz,Float32Array:A.c2,Float64Array:A.cy,Int16Array:A.dA,Int32Array:A.cz,Int8Array:A.dC,Uint16Array:A.dD,Uint32Array:A.cD,Uint8ClampedArray:A.cE,CanvasPixelArray:A.cE,Uint8Array:A.bz})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.a5.$nativeSuperclassTag="ArrayBufferView"
A.cU.$nativeSuperclassTag="ArrayBufferView"
A.cV.$nativeSuperclassTag="ArrayBufferView"
A.cA.$nativeSuperclassTag="ArrayBufferView"
A.cW.$nativeSuperclassTag="ArrayBufferView"
A.cX.$nativeSuperclassTag="ArrayBufferView"
A.cB.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.nA
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()