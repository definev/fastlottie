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
if(a[b]!==s){A.nW(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.h(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.j6(b)
return new s(c,this)}:function(){if(s===null)s=A.j6(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.j6(a).prototype
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
ja(a,b,c,d){return{i:a,p:b,e:c,x:d}},
i3(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.j8==null){A.nF()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.e(A.jF("Return interceptor for "+A.u(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.he
if(o==null)o=$.he=A.i2(n)
p=q[o]}if(p!=null)return p
p=A.nK(a)
if(p!=null)return p
if(typeof a=="function")return B.a4
s=Object.getPrototypeOf(a)
if(s==null)return B.D
if(s===Object.prototype)return B.D
if(typeof q=="function"){o=$.he
if(o==null)o=$.he=A.i2(n)
Object.defineProperty(q,o,{value:B.u,enumerable:false,writable:true,configurable:true})
return B.u}return B.u},
lp(a,b){if(a<0||a>4294967295)throw A.e(A.ao(a,0,4294967295,"length",null))
return J.lr(new Array(a),b)},
lq(a,b){if(a<0)throw A.e(A.au("Length must be a non-negative integer: "+a,null))
return A.h(new Array(a),b.i("v<0>"))},
lr(a,b){var s=A.h(a,b.i("v<0>"))
s.$flags=1
return s},
at(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cu.prototype
return J.dx.prototype}if(typeof a=="string")return J.c4.prototype
if(a==null)return J.cv.prototype
if(typeof a=="boolean")return J.ct.prototype
if(Array.isArray(a))return J.v.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.bB.prototype
if(typeof a=="bigint")return J.bA.prototype
return a}if(a instanceof A.i)return a
return J.i3(a)},
O(a){if(typeof a=="string")return J.c4.prototype
if(a==null)return a
if(Array.isArray(a))return J.v.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.bB.prototype
if(typeof a=="bigint")return J.bA.prototype
return a}if(a instanceof A.i)return a
return J.i3(a)},
bv(a){if(a==null)return a
if(Array.isArray(a))return J.v.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.bB.prototype
if(typeof a=="bigint")return J.bA.prototype
return a}if(a instanceof A.i)return a
return J.i3(a)},
bY(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.bB.prototype
if(typeof a=="bigint")return J.bA.prototype
return a}if(a instanceof A.i)return a
return J.i3(a)},
l(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.at(a).E(a,b)},
ae(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.nJ(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.O(a).h(a,b)},
l1(a,b){return J.bv(a).an(a,b)},
l2(a,b,c){return J.bY(a).dz(a,b,c)},
iq(a,b,c){return J.bY(a).dA(a,b,c)},
l3(a,b,c){return J.bY(a).dB(a,b,c)},
l4(a,b,c){return J.bY(a).dC(a,b,c)},
l5(a){return J.bY(a).dD(a)},
c0(a,b,c){return J.bY(a).bs(a,b,c)},
l6(a,b){return J.bv(a).aE(a,b)},
jh(a){return J.bY(a).gaa(a)},
l7(a){return J.bv(a).ga6(a)},
aP(a){return J.at(a).gS(a)},
ir(a){return J.O(a).gW(a)},
co(a){return J.bv(a).gG(a)},
aD(a){return J.O(a).gk(a)},
l8(a){return J.at(a).gX(a)},
ji(a){return J.bv(a).gae(a)},
jj(a,b,c,d,e){return J.bY(a).P(a,b,c,d,e)},
bx(a){return J.at(a).p(a)},
B:function B(){},
ct:function ct(){},
cv:function cv(){},
N:function N(){},
bh:function bh(){},
dI:function dI(){},
cP:function cP(){},
am:function am(){},
bA:function bA(){},
bB:function bB(){},
v:function v(a){this.$ti=a},
dw:function dw(){},
eI:function eI(a){this.$ti=a},
by:function by(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cw:function cw(){},
cu:function cu(){},
dx:function dx(){},
c4:function c4(){}},A={iA:function iA(){},
jt(a){return new A.aW("Field '"+a+"' has been assigned during initialization.")},
ls(a){return new A.aW("Field '"+a+"' has not been initialized.")},
aj(a){return new A.aW("Local '"+a+"' has not been initialized.")},
eL(a){return new A.aW("Local '"+a+"' has already been initialized.")},
b2(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
f7(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
j5(a,b,c){return a},
j9(a){var s,r
for(s=$.as.length,r=0;r<s;++r)if(a===$.as[r])return!0
return!1},
aw(){return new A.bl("No element")},
iy(){return new A.bl("Too many elements")},
aW:function aW(a){this.a=a},
ic:function ic(){},
f3:function f3(){},
aR:function aR(){},
ab:function ab(){},
bD:function bD(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
V:function V(a,b,c){this.a=a
this.b=b
this.$ti=c},
bJ:function bJ(a,b,c){this.a=a
this.b=b
this.$ti=c},
cR:function cR(a,b,c){this.a=a
this.b=b
this.$ti=c},
E:function E(){},
bI:function bI(){},
li(){throw A.e(A.aH("Cannot modify constant Set"))},
kB(a){var s=A.kA(a)
if(s!=null)return s
return"minified:"+a},
nJ(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
u(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bx(a)
return s},
cJ(a){var s,r=$.jw
if(r==null)r=$.jw=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
lG(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.e(A.ao(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
dJ(a){var s,r,q,p
if(a instanceof A.i)return A.ai(A.be(a),null)
s=J.at(a)
if(s===B.a3||s===B.a5||t.ak.b(a)){r=B.v(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.ai(A.be(a),null)},
jx(a){var s,r,q
if(a==null||typeof a=="number"||A.bc(a))return J.bx(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bf)return a.p(0)
if(a instanceof A.a4)return a.dk(!0)
s=$.l_()
for(r=0;r<1;++r){q=s[r].hf(a)
if(q!=null)return q}return"Instance of '"+A.dJ(a)+"'"},
lH(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
cK(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.K(s,10)|55296)>>>0,s&1023|56320)}throw A.e(A.ao(a,0,1114111,null,null))},
lF(a){var s=a.$thrownJsError
if(s==null)return null
return A.bd(s)},
lI(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.S(a,s)
a.$thrownJsError=s
s.stack=""}},
Z(a){throw A.e(A.j4(a))},
a(a,b){if(a==null)J.aD(a)
throw A.e(A.eq(a,b))},
eq(a,b){var s,r="index"
if(!A.r(b))return new A.aQ(!0,b,r,null)
s=A.j(J.aD(a))
if(b<0||b>=s)return A.jr(b,s,a,r)
return A.lJ(b,r)},
j4(a){return new A.aQ(!0,a,null,null)},
ks(a){return a},
e(a){return A.S(a,new Error())},
S(a,b){var s
if(a==null)a=new A.b3()
b.dartException=a
s=A.nX
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
nX(){return J.bx(this.dartException)},
w(a,b){throw A.S(a,b==null?new Error():b)},
f(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.w(A.mG(a,b,c),s)},
mG(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.cQ("'"+s+"': Cannot "+o+" "+l+k+n)},
T(a){throw A.e(A.av(a))},
b4(a){var s,r,q,p,o,n
a=A.nR(a.replace(String({}),"$receiver$"))
s=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(s==null)s=A.h([],t.s)
r=s.indexOf("\\$arguments\\$")
q=s.indexOf("\\$argumentsExpr\\$")
p=s.indexOf("\\$expr\\$")
o=s.indexOf("\\$method\\$")
n=s.indexOf("\\$receiver\\$")
return new A.fa(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),r,q,p,o,n)},
fb(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(s){return s.message}}(a)},
jD(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
iB(a,b){var s=b==null,r=s?null:b.method
return new A.dz(a,r,s?null:b.receiver)},
ad(a){var s
if(a==null)return new A.eW(a)
if(a instanceof A.cs){s=a.a
return A.bw(a,s==null?A.aN(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bw(a,a.dartException)
return A.nm(a)},
bw(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
nm(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.K(r,16)&8191)===10)switch(q){case 438:return A.bw(a,A.iB(A.u(s)+" (Error "+q+")",null))
case 445:case 5007:A.u(s)
return A.bw(a,new A.cI())}}if(a instanceof TypeError){p=$.kG()
o=$.kH()
n=$.kI()
m=$.kJ()
l=$.kM()
k=$.kN()
j=$.kL()
$.kK()
i=$.kP()
h=$.kO()
g=p.ai(s)
if(g!=null)return A.bw(a,A.iB(A.H(s),g))
else{g=o.ai(s)
if(g!=null){g.method="call"
return A.bw(a,A.iB(A.H(s),g))}else if(n.ai(s)!=null||m.ai(s)!=null||l.ai(s)!=null||k.ai(s)!=null||j.ai(s)!=null||m.ai(s)!=null||i.ai(s)!=null||h.ai(s)!=null){A.H(s)
return A.bw(a,new A.cI())}}return A.bw(a,new A.dS(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.cM()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bw(a,new A.aQ(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.cM()
return a},
bd(a){var s
if(a instanceof A.cs)return a.b
if(a==null)return new A.d4(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.d4(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
id(a){if(a==null)return J.aP(a)
if(typeof a=="object")return A.cJ(a)
return J.aP(a)},
nA(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.u(0,a[s],a[r])}return b},
mT(a,b,c,d,e,f){t.Z.a(a)
switch(A.j(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.e(new A.fE("Unsupported number of arguments for wrapped closure"))},
dg(a,b){var s=a.$identity
if(!!s)return s
s=A.nu(a,b)
a.$identity=s
return s},
nu(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.mT)},
lh(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.dN().constructor.prototype):Object.create(new A.c2(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.jq(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.ld(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.jq(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
ld(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.e("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.lb)}throw A.e("Error in functionType of tearoff")},
le(a,b,c,d){var s=A.jp
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
jq(a,b,c,d){if(c)return A.lg(a,b,d)
return A.le(b.length,d,a,b)},
lf(a,b,c,d){var s=A.jp,r=A.lc
switch(b?-1:a){case 0:throw A.e(new A.dM("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
lg(a,b,c){var s,r
if($.jn==null)$.jn=A.jm("interceptor")
if($.jo==null)$.jo=A.jm("receiver")
s=b.length
r=A.lf(s,c,a,b)
return r},
j6(a){return A.lh(a)},
lb(a,b){return A.db(v.typeUniverse,A.be(a.a),b)},
jp(a){return a.a},
lc(a){return a.b},
jm(a){var s,r,q,p=new A.c2("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.e(A.au("Field name "+a+" not found.",null))},
i2(a){return v.getIsolateTag(a)},
oA(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
nK(a){var s,r,q,p,o,n=A.H($.ku.$1(a)),m=$.i1[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.i8[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.hN($.kq.$2(a,n))
if(q!=null){m=$.i1[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.i8[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.ib(s)
$.i1[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.i8[n]=s
return s}if(p==="-"){o=A.ib(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.kx(a,s)
if(p==="*")throw A.e(A.jF(n))
if(v.leafTags[n]===true){o=A.ib(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.kx(a,s)},
kx(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.ja(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
ib(a){return J.ja(a,!1,null,!!a.$ian)},
nM(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.ib(s)
else return J.ja(s,c,null,null)},
nF(){if(!0===$.j8)return
$.j8=!0
A.nG()},
nG(){var s,r,q,p,o,n,m,l
$.i1=Object.create(null)
$.i8=Object.create(null)
A.nE()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.ky.$1(o)
if(n!=null){m=A.nM(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
nE(){var s,r,q,p,o,n,m=B.H()
m=A.cm(B.I,A.cm(B.J,A.cm(B.w,A.cm(B.w,A.cm(B.K,A.cm(B.L,A.cm(B.M(B.v),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.ku=new A.i4(p)
$.kq=new A.i5(o)
$.ky=new A.i6(n)},
cm(a,b){return a(b)||b},
m5(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.l(r,b[s]))return!1}return!0},
nv(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
js(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.e(A.dr("Illegal RegExp pattern ("+String(o)+")",a,null))},
nR(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
d1:function d1(a){this.a=a},
bR:function bR(a){this.a=a},
cf:function cf(a){this.a=a},
G:function G(a,b){this.a=a
this.b=b},
cg:function cg(a,b){this.a=a
this.b=b},
a1:function a1(a,b,c){this.a=a
this.b=b
this.c=c},
aL:function aL(a){this.a=a},
br:function br(a){this.a=a},
ch:function ch(a){this.a=a},
cU:function cU(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cr:function cr(){},
K:function K(a,b,c){this.a=a
this.b=b
this.$ti=c},
cL:function cL(){},
fa:function fa(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
cI:function cI(){},
dz:function dz(a,b,c){this.a=a
this.b=b
this.c=c},
dS:function dS(a){this.a=a},
eW:function eW(a){this.a=a},
cs:function cs(a,b){this.a=a
this.b=b},
d4:function d4(a){this.a=a
this.b=null},
bf:function bf(){},
dl:function dl(){},
dm:function dm(){},
dP:function dP(){},
dN:function dN(){},
c2:function c2(a,b){this.a=a
this.b=b},
dM:function dM(a){this.a=a},
aV:function aV(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
eJ:function eJ(a){this.a=a},
eM:function eM(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
U:function U(a,b){this.a=a
this.$ti=b},
cy:function cy(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
eN:function eN(a,b){this.a=a
this.$ti=b},
aE:function aE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bC:function bC(a,b){this.a=a
this.$ti=b},
cx:function cx(a,b,c,d){var _=this
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
i4:function i4(a){this.a=a},
i5:function i5(a){this.a=a},
i6:function i6(a){this.a=a},
a4:function a4(){},
bQ:function bQ(){},
cd:function cd(){},
ce:function ce(){},
aU:function aU(){},
dy:function dy(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
cW:function cW(a){this.b=a},
dU:function dU(a,b,c){this.a=a
this.b=b
this.c=c},
c8:function c8(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
nW(a){throw A.S(A.jt(a),new Error())},
C(){throw A.S(A.ls(""),new Error())},
M(){throw A.S(A.jt(""),new Error())},
dY(){var s=new A.fn()
return s.b=s},
fn:function fn(){this.b=null},
bb(a,b,c){},
R(a){return a},
ly(a,b,c){A.bb(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
lB(a){return new Float32Array(a)},
lC(a,b,c){A.bb(a,b,c)
if(c==null)c=B.a.H(a.byteLength-b,4)
return new Float32Array(a,b,c)},
iE(a,b,c){A.bb(a,b,c)
if(c==null)c=B.a.H(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dE(a,b,c){A.bb(a,b,c)
if(c==null)c=B.a.H(a.byteLength-b,4)
return new Int32Array(a,b,c)},
iF(a,b,c){A.bb(a,b,c)
if(c==null)c=B.a.H(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
lD(a){return new Uint8Array(a)},
iG(a,b,c){A.bb(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
aO(a,b,c){if(a>>>0!==a||a>=c)throw A.e(A.eq(b,a))},
bj:function bj(){},
c5:function c5(){},
cA:function cA(a){this.a=a},
eh:function eh(a){this.a=a},
cF:function cF(){},
hG:function hG(a){this.a=a},
dC:function dC(){},
a6:function a6(){},
cD:function cD(){},
cE:function cE(){},
c6:function c6(){},
cB:function cB(){},
dD:function dD(){},
cC:function cC(){},
dF:function dF(){},
dG:function dG(){},
cG:function cG(){},
cH:function cH(){},
bE:function bE(){},
aF:function aF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
e8:function e8(){},
e9:function e9(){},
cX:function cX(){},
cY:function cY(){},
cZ:function cZ(){},
d_:function d_(){},
ei:function ei(){},
iJ(a,b){var s=b.c
return s==null?b.c=A.d9(a,"al",[b.x]):s},
jz(a){var s=a.w
if(s===6||s===7)return A.jz(a.x)
return s===11||s===12},
lL(a){return a.as},
es(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
er(a){return A.hF(v.typeUniverse,a,!1)},
bV(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.bV(a1,s,a3,a4)
if(r===s)return a2
return A.jW(a1,r,!0)
case 7:s=a2.x
r=A.bV(a1,s,a3,a4)
if(r===s)return a2
return A.jV(a1,r,!0)
case 8:q=a2.y
p=A.cl(a1,q,a3,a4)
if(p===q)return a2
return A.d9(a1,a2.x,p)
case 9:o=a2.x
n=A.bV(a1,o,a3,a4)
m=a2.y
l=A.cl(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.iW(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.cl(a1,j,a3,a4)
if(i===j)return a2
return A.jX(a1,k,i)
case 11:h=a2.x
g=A.bV(a1,h,a3,a4)
f=a2.y
e=A.nj(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.jU(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.cl(a1,d,a3,a4)
o=a2.x
n=A.bV(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.iX(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.e(A.dk("Attempted to substitute unexpected RTI kind "+a0))}},
cl(a,b,c,d){var s,r,q,p,o=b.length,n=A.hK(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.bV(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
nk(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.hK(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.bV(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
nj(a,b,c,d){var s,r=b.a,q=A.cl(a,r,c,d),p=b.b,o=A.cl(a,p,c,d),n=b.c,m=A.nk(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.e3()
s.a=q
s.b=o
s.c=m
return s},
h(a,b){a[v.arrayRti]=b
return a},
kt(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.nD(s)
return a.$S()}return null},
nH(a,b){var s
if(A.jz(b))if(a instanceof A.bf){s=A.kt(a)
if(s!=null)return s}return A.be(a)},
be(a){if(a instanceof A.i)return A.n(a)
if(Array.isArray(a))return A.a2(a)
return A.iZ(J.at(a))},
a2(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
n(a){var s=a.$ti
return s!=null?s:A.iZ(a)},
iZ(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.mR(a,s)},
mR(a,b){var s=a instanceof A.bf?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.mo(v.typeUniverse,s.name)
b.$ccache=r
return r},
nD(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.hF(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
nC(a){return A.bX(A.n(a))},
j3(a){var s
if(a instanceof A.a4)return A.nz(a.$r,a.aT())
s=a instanceof A.bf?A.kt(a):null
if(s!=null)return s
if(t.dm.b(a))return J.l8(a).a
if(Array.isArray(a))return A.a2(a)
return A.be(a)},
bX(a){var s=a.r
return s==null?a.r=new A.hE(a):s},
nz(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.db(v.typeUniverse,A.j3(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.jZ(v.typeUniverse,s,A.j3(q[r]))}return A.db(v.typeUniverse,s,a)},
aC(a){return A.bX(A.hF(v.typeUniverse,a,!1))},
mQ(a){var s=this
s.b=A.nh(s)
return s.b(a)},
nh(a){var s,r,q,p,o
if(a===t.K)return A.mZ
if(A.bZ(a))return A.n2
s=a.w
if(s===6)return A.mO
if(s===1)return A.kh
if(s===7)return A.mU
r=A.ng(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.bZ)){a.f="$i"+q
if(q==="q")return A.mX
if(a===t.m)return A.mW
return A.n1}}else if(s===10){p=A.nv(a.x,a.y)
o=p==null?A.kh:p
return o==null?A.aN(o):o}return A.mM},
ng(a){if(a.w===8){if(a===t.S)return A.r
if(a===t.i||a===t.q)return A.mY
if(a===t.N)return A.n0
if(a===t.y)return A.bc}return null},
mP(a){var s=this,r=A.mL
if(A.bZ(s))r=A.my
else if(s===t.K)r=A.aN
else if(A.cn(s)){r=A.mN
if(s===t.gs)r=A.mw
else if(s===t.dk)r=A.hN
else if(s===t.fQ)r=A.mu
else if(s===t.cg)r=A.k3
else if(s===t.cD)r=A.mv
else if(s===t.an)r=A.mx}else if(s===t.S)r=A.j
else if(s===t.N)r=A.H
else if(s===t.y)r=A.bu
else if(s===t.q)r=A.ej
else if(s===t.i)r=A.Q
else if(s===t.m)r=A.t
s.a=r
return s.a(a)},
mM(a){var s=this
if(a==null)return A.cn(s)
return A.kw(v.typeUniverse,A.nH(a,s),s)},
mO(a){if(a==null)return!0
return this.x.b(a)},
n1(a){var s,r=this
if(a==null)return A.cn(r)
s=r.f
if(a instanceof A.i)return!!a[s]
return!!J.at(a)[s]},
mX(a){var s,r=this
if(a==null)return A.cn(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.i)return!!a[s]
return!!J.at(a)[s]},
mW(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.i)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
kg(a){if(typeof a=="object"){if(a instanceof A.i)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
mL(a){var s=this
if(a==null){if(A.cn(s))return a}else if(s.b(a))return a
throw A.S(A.k7(a,s),new Error())},
mN(a){var s=this
if(a==null||s.b(a))return a
throw A.S(A.k7(a,s),new Error())},
k7(a,b){return new A.cj("TypeError: "+A.jH(a,A.ai(b,null)))},
nt(a,b,c,d){if(A.kw(v.typeUniverse,a,b))return a
throw A.S(A.mg("The type argument '"+A.ai(a,null)+"' is not a subtype of the type variable bound '"+A.ai(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
jH(a,b){return A.ey(a)+": type '"+A.ai(A.j3(a),null)+"' is not a subtype of type '"+b+"'"},
mg(a){return new A.cj("TypeError: "+a)},
aB(a,b){return new A.cj("TypeError: "+A.jH(a,b))},
mU(a){var s=this
return s.x.b(a)||A.iJ(v.typeUniverse,s).b(a)},
mZ(a){return a!=null},
aN(a){if(a!=null)return a
throw A.S(A.aB(a,"Object"),new Error())},
n2(a){return!0},
my(a){return a},
kh(a){return!1},
bc(a){return!0===a||!1===a},
bu(a){if(!0===a)return!0
if(!1===a)return!1
throw A.S(A.aB(a,"bool"),new Error())},
mu(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.S(A.aB(a,"bool?"),new Error())},
Q(a){if(typeof a=="number")return a
throw A.S(A.aB(a,"double"),new Error())},
mv(a){if(typeof a=="number")return a
if(a==null)return a
throw A.S(A.aB(a,"double?"),new Error())},
r(a){return typeof a=="number"&&Math.floor(a)===a},
j(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.S(A.aB(a,"int"),new Error())},
mw(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.S(A.aB(a,"int?"),new Error())},
mY(a){return typeof a=="number"},
ej(a){if(typeof a=="number")return a
throw A.S(A.aB(a,"num"),new Error())},
k3(a){if(typeof a=="number")return a
if(a==null)return a
throw A.S(A.aB(a,"num?"),new Error())},
n0(a){return typeof a=="string"},
H(a){if(typeof a=="string")return a
throw A.S(A.aB(a,"String"),new Error())},
hN(a){if(typeof a=="string")return a
if(a==null)return a
throw A.S(A.aB(a,"String?"),new Error())},
t(a){if(A.kg(a))return a
throw A.S(A.aB(a,"JSObject"),new Error())},
mx(a){if(a==null)return a
if(A.kg(a))return a
throw A.S(A.aB(a,"JSObject?"),new Error())},
km(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.ai(a[q],b)
return s},
nb(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.km(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.ai(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
kd(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(!(j===2||j===3||j===4||j===5||k===p))o+=" extends "+A.ai(k,a4)}o+=">"}else o=""
p=a3.x
i=a3.y
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.ai(p,a4)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.ai(h[q],a4)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.ai(f[q],a4)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.ai(d[q+2],a4)+" "+d[q]}a+="}"}if(a2!=null){a4.toString
a4.length=a2}return o+"("+a+") => "+b},
ai(a,b){var s,r,q,p,o,n,m,l=a.w
if(l===5)return"erased"
if(l===2)return"dynamic"
if(l===3)return"void"
if(l===1)return"Never"
if(l===4)return"any"
if(l===6){s=a.x
r=A.ai(s,b)
q=s.w
return(q===11||q===12?"("+r+")":r)+"?"}if(l===7)return"FutureOr<"+A.ai(a.x,b)+">"
if(l===8){p=A.nl(a.x)
o=a.y
return o.length>0?p+("<"+A.km(o,b)+">"):p}if(l===10)return A.nb(a,b)
if(l===11)return A.kd(a,b,null)
if(l===12)return A.kd(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
nl(a){var s=A.kA(a)
if(s!=null)return s
return"minified:"+a},
mp(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
mo(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.hF(a,b,!1)
else if(typeof m=="number"){s=m
r=A.da(a,5,"#")
q=A.hK(s)
for(p=0;p<s;++p)q[p]=r
o=A.d9(a,b,q)
n[b]=o
return o}else return m},
mn(a,b){return A.k0(a.tR,b)},
mm(a,b){return A.k0(a.eT,b)},
hF(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.jY(a,null,b,!1)
r.set(b,s)
return s},
db(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.jY(a,b,c,!0)
q.set(c,r)
return r},
jZ(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.iW(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
jY(a,b,c,d){return A.m3(A.lY(a,b,c,d))},
bs(a,b){b.a=A.mP
b.b=A.mQ
return b},
da(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aG(null,null)
s.w=b
s.as=c
r=A.bs(a,s)
a.eC.set(c,r)
return r},
jW(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.mk(a,b,r,c)
a.eC.set(r,s)
return s},
mk(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.bZ(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.cn(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aG(null,null)
q.w=6
q.x=b
q.as=c
return A.bs(a,q)},
jV(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.mi(a,b,r,c)
a.eC.set(r,s)
return s},
mi(a,b,c,d){var s,r
if(d){s=b.w
if(A.bZ(b)||b===t.K)return b
else if(s===1)return A.d9(a,"al",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aG(null,null)
r.w=7
r.x=b
r.as=c
return A.bs(a,r)},
ml(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aG(null,null)
s.w=13
s.x=b
s.as=q
r=A.bs(a,s)
a.eC.set(q,r)
return r},
d8(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
mh(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
d9(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.d8(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aG(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bs(a,r)
a.eC.set(p,q)
return q},
iW(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.d8(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aG(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bs(a,o)
a.eC.set(q,n)
return n},
jX(a,b,c){var s,r,q="+"+(b+"("+A.d8(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aG(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bs(a,s)
a.eC.set(q,r)
return r},
jU(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.d8(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.d8(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.mh(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aG(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bs(a,p)
a.eC.set(r,o)
return o},
iX(a,b,c,d){var s,r=b.as+("<"+A.d8(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.mj(a,b,c,r,d)
a.eC.set(r,s)
return s},
mj(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.hK(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.bV(a,b,r,0)
m=A.cl(a,c,r,0)
return A.iX(a,n,m,c!==m)}}l=new A.aG(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bs(a,l)},
lY(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
m3(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.m_(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.jM(a,r,l,k,!1)
else if(q===46)r=A.jM(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.bP(a.u,a.e,k.pop()))
break
case 94:k.push(A.ml(a.u,k.pop()))
break
case 35:k.push(A.da(a.u,5,"#"))
break
case 64:k.push(A.da(a.u,2,"@"))
break
case 126:k.push(A.da(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.m1(a,k)
break
case 38:A.m0(a,k)
break
case 63:p=a.u
k.push(A.jW(p,A.bP(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.jV(p,A.bP(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.lZ(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.jN(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.m4(a.u,a.e,o)
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
return A.bP(a.u,a.e,m)},
m_(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
jM(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.mp(s,o.x)[p]
if(n==null)A.w('No "'+p+'" in "'+A.lL(o)+'"')
d.push(A.db(s,o,n))}else d.push(p)
return m},
m1(a,b){var s,r=a.u,q=A.jL(a,b),p=b.pop()
if(typeof p=="string")b.push(A.d9(r,p,q))
else{s=A.bP(r,a.e,p)
switch(s.w){case 11:b.push(A.iX(r,s,q,a.n))
break
default:b.push(A.iW(r,s,q))
break}}},
lZ(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.jL(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.bP(p,a.e,o)
q=new A.e3()
q.a=s
q.b=n
q.c=m
b.push(A.jU(p,r,q))
return
case-4:b.push(A.jX(p,b.pop(),s))
return
default:throw A.e(A.dk("Unexpected state under `()`: "+A.u(o)))}},
m0(a,b){var s=b.pop()
if(0===s){b.push(A.da(a.u,1,"0&"))
return}if(1===s){b.push(A.da(a.u,4,"1&"))
return}throw A.e(A.dk("Unexpected extended operation "+A.u(s)))},
jL(a,b){var s=b.splice(a.p)
A.jN(a.u,a.e,s)
a.p=b.pop()
return s},
bP(a,b,c){if(typeof c=="string")return A.d9(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.m2(a,b,c)}else return c},
jN(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.bP(a,b,c[s])},
m4(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.bP(a,b,c[s])},
m2(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.e(A.dk("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.e(A.dk("Bad index "+c+" for "+b.p(0)))},
kw(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.Y(a,b,null,c,null)
r.set(c,s)}return s},
Y(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.bZ(d))return!0
s=b.w
if(s===4)return!0
if(A.bZ(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.Y(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.Y(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.Y(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.Y(a,b.x,c,d,e))return!1
return A.Y(a,A.iJ(a,b),c,d,e)}if(s===6)return A.Y(a,p,c,d,e)&&A.Y(a,b.x,c,d,e)
if(q===7){if(A.Y(a,b,c,d.x,e))return!0
return A.Y(a,b,c,A.iJ(a,d),e)}if(q===6)return A.Y(a,b,c,p,e)||A.Y(a,b,c,d.x,e)
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
if(!A.Y(a,j,c,i,e)||!A.Y(a,i,e,j,c))return!1}return A.kf(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.kf(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.mV(a,b,c,d,e)}if(o&&q===10)return A.n_(a,b,c,d,e)
return!1},
kf(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
mV(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.db(a,b,r[o])
return A.k2(a,p,null,c,d.y,e)}return A.k2(a,b.y,null,c,d.y,e)},
k2(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.Y(a,b[s],d,e[s],f))return!1
return!0},
n_(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.Y(a,r[s],c,q[s],e))return!1
return!0},
cn(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.bZ(a))if(s!==6)r=s===7&&A.cn(a.x)
return r},
bZ(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
k0(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
hK(a){return a>0?new Array(a):v.typeUniverse.sEA},
aG:function aG(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
e3:function e3(){this.c=this.b=this.a=null},
hE:function hE(a){this.a=a},
e0:function e0(){},
cj:function cj(a){this.a=a},
lR(){var s,r,q
if(self.scheduleImmediate!=null)return A.nn()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dg(new A.fj(s),1)).observe(r,{childList:true})
return new A.fi(s,r,q)}else if(self.setImmediate!=null)return A.no()
return A.np()},
lS(a){self.scheduleImmediate(A.dg(new A.fk(t.O.a(a)),0))},
lT(a){self.setImmediate(A.dg(new A.fl(t.O.a(a)),0))},
lU(a){t.O.a(a)
A.mb(0,a)},
mb(a,b){var s=new A.hA()
s.ei(a,b)
return s},
kj(a){return new A.dV(new A.J($.D,a.i("J<0>")),a.i("dV<0>"))},
k6(a,b){a.$2(0,null)
b.b=!0
return b.a},
hO(a,b){A.mz(a,b)},
k5(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("al<1>").b(a))s.cF(a)
else s.cJ(a)},
k4(a,b){var s=A.ad(a),r=A.bd(a),q=A.ke(s,r)
s=new A.ak(s,r)
r=b.b
q=b.a
if(r)q.bc(s)
else q.ba(s)},
mz(a,b){var s,r,q=new A.hP(b),p=new A.hQ(b)
if(a instanceof A.J)a.di(q,p,t.z)
else{s=t.z
if(a instanceof A.J)a.ck(q,p,s)
else{r=new A.J($.D,t._)
r.a=8
r.c=a
r.di(q,p,s)}}},
kp(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.D
return r.bW(r,t.as.a(new A.i0(s)),t.H,t.S,t.z)},
iu(a){var s
if(t.R.b(a)){s=a.gaR()
if(s!=null)return s}return B.q},
ke(a,b){var s=$.D
if(s===B.k)return null
s.eK(s,a,b)
return null},
mS(a,b){if($.D!==B.k)A.ke(a,b)
if(t.R.b(a)){b=a.gaR()
if(b==null){A.lI(a,B.q)
b=B.q}}else b=B.q
return new A.ak(a,b)},
iN(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.lM()
b.ba(new A.ak(new A.aQ(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.d2(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.aV()
b.bb(n.a)
A.bN(b,p)
return}b.a^=2
o=b.b
o.aW(o,new A.h0(n,b))},
bN(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.aU(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.bN(e.a,d)
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
if((d&15)===8)new A.h4(q,e,n).$0()
else if(o){if((d&1)!==0)new A.h3(q,j).$0()}else if((d&2)!==0)new A.h2(e,q).$0()
if(h!=null)$.D=h
d=q.c
if(d instanceof A.J){p=q.a.$ti
p=p.i("al<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bo(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.iN(d,g,!0)
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
nc(a,b){var s=t.C
if(s.b(a))return b.bW(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.bm(b,s.a(a),t.z,t.K)
throw A.e(A.jk(a,"onError",u.c))},
n5(){var s,r
for(s=$.ck;s!=null;s=$.ck){$.de=null
r=s.b
$.ck=r
if(r==null)$.dd=null
s.a.$0()}},
ni(){$.j_=!0
try{A.n5()}finally{$.de=null
$.j_=!1
if($.ck!=null)$.je().$1(A.kr())}},
kn(a){var s=new A.dW(a),r=$.dd
if(r==null){$.ck=$.dd=s
if(!$.j_)$.je().$1(A.kr())}else $.dd=r.b=s},
nf(a){var s,r,q,p=$.ck
if(p==null){A.kn(a)
$.de=$.dd
return}s=new A.dW(a)
r=$.de
if(r==null){s.b=p
$.ck=$.de=s}else{q=r.b
s.b=q
$.de=r.b=s
if(q==null)$.dd=s}},
nT(a){var s=$.D
if(B.k===s){A.j1(B.k,a)
return}A.j1(s,s.bl(s,a,t.H))
return},
o9(a,b){A.j5(a,"stream",t.K)
return new A.ec(b.i("ec<0>"))},
j2(a){return},
lV(a,b){if(b==null)b=A.nr()
if(t.da.b(b))return a.bW(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.bm(a,t.w.a(b),t.z,t.K)
throw A.e(A.au("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
n7(a,b){var s=$.D
s.aU(s,a,b)},
n6(){},
ne(a,b){A.nf(new A.i_(a,b))},
j1(a,b){if(B.k!==a)b=a.fp(b,t.H)
A.kn(b)},
fj:function fj(a){this.a=a},
fi:function fi(a,b,c){this.a=a
this.b=b
this.c=c},
fk:function fk(a){this.a=a},
fl:function fl(a){this.a=a},
hA:function hA(){},
hB:function hB(a,b){this.a=a
this.b=b},
dV:function dV(a,b){this.a=a
this.b=!1
this.$ti=b},
hP:function hP(a){this.a=a},
hQ:function hQ(a){this.a=a},
i0:function i0(a){this.a=a},
ak:function ak(a,b){this.a=a
this.b=b},
dZ:function dZ(){},
cS:function cS(a,b){this.a=a
this.$ti=b},
b5:function b5(a,b,c,d,e){var _=this
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
fY:function fY(a,b){this.a=a
this.b=b},
h1:function h1(a,b){this.a=a
this.b=b},
h0:function h0(a,b){this.a=a
this.b=b},
h_:function h_(a,b){this.a=a
this.b=b},
fZ:function fZ(a,b){this.a=a
this.b=b},
h4:function h4(a,b,c){this.a=a
this.b=b
this.c=c},
h5:function h5(a,b){this.a=a
this.b=b},
h6:function h6(a){this.a=a},
h3:function h3(a,b){this.a=a
this.b=b},
h2:function h2(a,b){this.a=a
this.b=b},
dW:function dW(a){this.a=a
this.b=null},
cN:function cN(){},
f5:function f5(a,b){this.a=a
this.b=b},
f6:function f6(a,b){this.a=a
this.b=b},
d5:function d5(){},
ht:function ht(a){this.a=a},
hs:function hs(a){this.a=a},
dX:function dX(){},
c9:function c9(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
ca:function ca(a,b){this.a=a
this.$ti=b},
cb:function cb(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
cT:function cT(){},
fm:function fm(a){this.a=a},
d7:function d7(){},
bp:function bp(){},
bL:function bL(a,b){this.b=a
this.a=null
this.$ti=b},
e_:function e_(){},
aJ:function aJ(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
ho:function ho(a,b){this.a=a
this.b=b},
ec:function ec(a){this.$ti=a},
fg:function fg(){},
fh:function fh(a,b,c){this.a=a
this.b=b
this.c=c},
i_:function i_(a,b){this.a=a
this.b=b},
lt(a,b,c){return b.i("@<0>").a3(c).i("iC<1,2>").a(A.nA(a,new A.aV(b.i("@<0>").a3(c).i("aV<1,2>"))))},
aa(a,b){return new A.aV(a.i("@<0>").a3(b).i("aV<1,2>"))},
lu(a){return new A.b7(a.i("b7<0>"))},
iD(a){return new A.b7(a.i("b7<0>"))},
iP(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
jv(a){var s,r
if(A.j9(a))return"{...}"
s=new A.c7("")
try{r={}
B.b.m($.as,a)
s.a+="{"
r.a=!0
a.aG(0,new A.eQ(r,s))
s.a+="}"}finally{if(0>=$.as.length)return A.a($.as,-1)
$.as.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
b7:function b7(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
bO:function bO(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
e7:function e7(a){this.a=a
this.c=this.b=null},
cV:function cV(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
A:function A(){},
F:function F(){},
eP:function eP(a){this.a=a},
eQ:function eQ(a,b){this.a=a
this.b=b},
b1:function b1(){},
d3:function d3(){},
n8(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ad(r)
q=A.dr(String(s),null,null)
throw A.e(q)}q=A.hR(p)
return q},
hR(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.e5(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.hR(a[s])
return a},
mr(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.kY()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
mq(a,b,c,d){var s=a?$.kX():$.kW()
if(s==null)return null
if(0===c&&d===b.length)return A.k_(s,b)
return A.k_(s,b.subarray(c,d))},
k_(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
ms(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
e5:function e5(a,b){this.a=a
this.b=b
this.c=null},
hf:function hf(a){this.a=a},
e6:function e6(a){this.a=a},
hJ:function hJ(){},
hI:function hI(){},
c3:function c3(){},
dp:function dp(){},
dq:function dq(){},
dA:function dA(){},
eK:function eK(a){this.a=a},
dT:function dT(){},
fd:function fd(a){this.a=a},
hH:function hH(a){this.a=a
this.b=16
this.c=0},
nI(a,b){var s=A.lG(a,b)
if(s!=null)return s
throw A.e(A.dr(a,null,null))},
lj(a,b){a=A.S(a,new Error())
if(a==null)a=A.aN(a)
a.stack=b.p(0)
throw a},
ju(a,b,c,d){var s,r=c?J.lq(a,d):J.lp(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
lv(a,b,c){var s,r,q=A.h([],c.i("v<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.T)(a),++r)B.b.m(q,c.a(a[r]))
q.$flags=1
return q},
aX(a,b){var s,r
if(Array.isArray(a))return A.h(a.slice(0),b.i("v<0>"))
s=A.h([],b.i("v<0>"))
for(r=J.co(a);r.v();)B.b.m(s,r.gB())
return s},
lN(a,b,c){var s,r
A.iI(b,"start")
s=c-b
if(s<0)throw A.e(A.ao(c,b,null,"end",null))
if(s===0)return""
r=A.lO(a,b,c)
return r},
lO(a,b,c){var s=a.length
if(b>=s)return""
return A.lH(a,b,c==null||c>s?s:c)},
dL(a){return new A.dy(a,A.js(a,!1,!0,!1,!1,""))},
jC(a,b,c){var s=J.co(b)
if(!s.v())return a
if(c.length===0){do a+=A.u(s.gB())
while(s.v())}else{a+=A.u(s.gB())
while(s.v())a=a+c+A.u(s.gB())}return a},
lM(){return A.bd(new Error())},
ey(a){if(typeof a=="number"||A.bc(a)||a==null)return J.bx(a)
if(typeof a=="string")return JSON.stringify(a)
return A.jx(a)},
lk(a,b){A.j5(a,"error",t.K)
A.j5(b,"stackTrace",t.l)
A.lj(a,b)},
dk(a){return new A.dj(a)},
au(a,b){return new A.aQ(!1,null,b,a)},
jk(a,b,c){return new A.aQ(!0,a,b,c)},
jy(a){var s=null
return new A.b0(s,s,!1,s,s,a)},
lJ(a,b){return new A.b0(null,null,!0,a,b,"Value not in range")},
ao(a,b,c,d,e){return new A.b0(b,c,!0,a,d,"Invalid value")},
bG(a,b,c){if(0>a||a>c)throw A.e(A.ao(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.e(A.ao(b,a,c,"end",null))
return b}return c},
iI(a,b){if(a<0)throw A.e(A.ao(a,0,null,b,null))
return a},
jr(a,b,c,d){return new A.ds(b,!0,a,d,"Index out of range")},
aH(a){return new A.cQ(a)},
jF(a){return new A.dR(a)},
ax(a){return new A.bl(a)},
av(a){return new A.dn(a)},
dr(a,b,c){return new A.X(a,b,c)},
lo(a,b,c){var s,r
if(A.j9(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.h([],t.s)
B.b.m($.as,a)
try{A.n3(a,s)}finally{if(0>=$.as.length)return A.a($.as,-1)
$.as.pop()}r=A.jC(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
iz(a,b,c){var s,r
if(A.j9(a))return b+"..."+c
s=new A.c7(b)
B.b.m($.as,a)
try{r=s
r.a=A.jC(r.a,a,", ")}finally{if(0>=$.as.length)return A.a($.as,-1)
$.as.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
n3(a,b){var s,r,q,p,o,n,m,l=a.gG(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.v())return
s=A.u(l.gB())
B.b.m(b,s)
k+=s.length+2;++j}if(!l.v()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gB();++j
if(!l.v()){if(j<=4){B.b.m(b,A.u(p))
return}r=A.u(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gB();++j
for(;l.v();p=o,o=n){n=l.gB();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.b.m(b,"...")
return}}q=A.u(p)
r=A.u(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.b.m(b,m)
B.b.m(b,q)
B.b.m(b,r)},
eX(a,b,c,d){var s
if(B.n===c){s=B.a.gS(a)
b=J.aP(b)
return A.f7(A.b2(A.b2($.et(),s),b))}if(B.n===d){s=B.a.gS(a)
b=J.aP(b)
c=J.aP(c)
return A.f7(A.b2(A.b2(A.b2($.et(),s),b),c))}s=B.a.gS(a)
b=J.aP(b)
c=J.aP(c)
d=J.aP(d)
d=A.f7(A.b2(A.b2(A.b2(A.b2($.et(),s),b),c),d))
return d},
lE(a){var s,r,q=$.et()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.T)(a),++r)q=A.b2(q,J.aP(a[r]))
return A.f7(q)},
fD:function fD(){},
L:function L(){},
dj:function dj(a){this.a=a},
b3:function b3(){},
aQ:function aQ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b0:function b0(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
ds:function ds(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
cQ:function cQ(a){this.a=a},
dR:function dR(a){this.a=a},
bl:function bl(a){this.a=a},
dn:function dn(a){this.a=a},
dH:function dH(){},
cM:function cM(){},
fE:function fE(a){this.a=a},
X:function X(a,b,c){this.a=a
this.b=b
this.c=c},
m:function m(){},
bi:function bi(a,b,c){this.a=a
this.b=b
this.$ti=c},
W:function W(){},
i:function i(){},
ed:function ed(){},
c7:function c7(a){this.a=a},
mE(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.u(a)
r=A.ns(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.w("Attempting to box non-Dart object.")
q={}
q[$.kZ()]=a
r.error=q
r.stack=b.p(0)
return r},
ll(a,b){var s,r=v.G.Promise,q=new A.eE(a)
if(typeof q=="function")A.w(A.au("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.mC,q)
s[$.ip()]=q
return A.t(new r(s))},
eV:function eV(a){this.a=a},
eE:function eE(a){this.a=a},
eC:function eC(a){this.a=a},
eD:function eD(a){this.a=a},
mB(a,b,c){t.Z.a(a)
if(A.j(c)>=1)return a.$1(b)
return a.$0()},
mC(a,b,c,d){t.Z.a(a)
A.j(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
df(a,b,c,d){return d.a(a[b].apply(a,c))},
ns(a,b,c){var s,r
if(b==null)return c.a(new a())
if(b instanceof Array)switch(b.length){case 0:return c.a(new a())
case 1:return c.a(new a(b[0]))
case 2:return c.a(new a(b[0],b[1]))
case 3:return c.a(new a(b[0],b[1],b[2]))
case 4:return c.a(new a(b[0],b[1],b[2],b[3]))}s=[null]
B.b.ah(s,b)
r=a.bind.apply(a,s)
String(r)
return c.a(new r())},
jb(a,b){var s=new A.J($.D,b.i("J<0>")),r=new A.cS(s,b.i("cS<0>"))
a.then(A.dg(new A.ie(r,b),1),A.dg(new A.ig(r),1))
return s},
ie:function ie(a,b){this.a=a
this.b=b},
ig:function ig(a){this.a=a},
eF:function eF(){},
eG:function eG(a,b,c){this.a=a
this.b=b
this.c=c},
h7:function h7(){},
h8:function h8(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
iv(a,b){var s=new A.eH()
s.ef(a,b)
return s},
eH:function eH(){this.a=$
this.b=0
this.c=2147483647},
ff:function ff(){},
hL:function hL(){},
hM:function hM(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
dt:function dt(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
nw(a,b,c){var s,r="The decoded data is larger than the ",q=new A.dB(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.e(A.it(r+b+" bytes allowed"))
throw s}if(q.e)throw A.e(A.it(r+b+" bytes allowed"))
return p},
dB:function dB(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
is(a){return new A.c1(a,null,null)},
l9(a){return new A.cp(a,null,null)},
it(a){return new A.di(a,null,null)},
c1:function c1(a,b,c){this.a=a
this.b=b
this.c=c},
cp:function cp(a,b,c){this.a=a
this.b=b
this.c=c},
di:function di(a,b,c){this.a=a
this.b=b
this.c=c},
cq:function cq(a,b){this.a=a
this.b=b},
f4:function f4(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
kv(a,b,c,d){var s,r,q,p=c,o=new A.fB($.iY)
$.iY=o
try{if(d.$0())return!0
if(p){r=A.is("Invalid "+a+" data")
throw A.e(r)}return!1}catch(q){s=A.ad(q)
r=s
if(!(r instanceof A.c1||r instanceof A.cp||r instanceof A.X||t.b8.b(r)||t.G.b(r)))throw q
r=s instanceof A.di
if(r)throw q
if(s instanceof A.cp){if(c){r=A.is(s.a)
throw A.e(r)}return!1}if(s instanceof A.c1){if(p)throw q
return!1}if(p){r=A.is("Invalid "+a+" data: "+A.u(s))
throw A.e(r)}return!1}finally{$.iY=o.a}},
fB:function fB(a){this.a=a},
iw(a,b,c,d){var s,r,q,p,o=new A.du(b)
if(d==null)d=0
A.iI(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.R(a))
p=J.c0(B.d.gaa(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
du:function du(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
dv:function dv(){},
iH(a){var s=a==null?32768:a
return new A.bF(new Uint8Array(s),B.o)},
bF:function bF(a,b){this.b=0
this.c=a
this.a=b},
bk:function bk(){},
la(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
jl(a,b,c){var s,r,q,p=b+c,o=$.kC()
for(s=a.length,r=b,q=4294967295;r<p;++r){if(!(r<s))return A.a(a,r)
q=o[(q^a[r])&255]^q>>>8}return(q^4294967295)&2147483647},
ea:function ea(a,b,c){this.a=a
this.b=b
this.c=c},
eu:function eu(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=4194304
_.r=b
_.w=c
_.x=0
_.y=d
_.z=e
_.Q=0
_.as=null
_.at=f
_.ax=g
_.ay=h
_.ch=i
_.cx=_.CW=0},
ex:function ex(a,b,c){this.a=a
this.b=b
this.c=c},
ev:function ev(a){this.a=a},
ew:function ew(a){this.a=a},
aY(a,b){var s,r,q,p,o=a.length
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
lw(b0,b1,b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9
if(b1<0||b1>b0.length)throw A.e(A.ao(b1,0,b0.length,"srcLength",null))
if(b1===0)return 0
s=b4>=0?b4:b2.length
r=0
q=0
if(b1>=13){B.e.T(b3,0,16384,-1)
p=b1-12
o=b1-5
n=A.aY(b0,0)*2654435761>>>0>>>18
b3.$flags&2&&A.f(b3)
if(!(n<16384))return A.a(b3,n)
b3[n]=0
m=A.aY(b0,1)*2654435761>>>0>>>18
A:for(n=b0.length,l=b2.$flags|0,k=1;;){j=k
i=1
h=64
do{g=j+i
i=h>>>6;++h
if(g>p)break A
f=A.aY(b0,g)*2654435761>>>0>>>18
if(!(m>=0&&m<16384))return A.a(b3,m)
e=b3[m]
b3[m]=j
if(e<0||j-e>65535||A.aY(b0,e)!==A.aY(b0,j)){j=g
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
if(a+B.a.H(b,255)+1+b+2>s)return-1
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
c=B.a.K(a4,8)
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
if(a+(B.a.H(a1,255)+1)>=s)return-1
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
c=A.aY(b0,d)*2654435761>>>0>>>18
if(!(c<16384))return A.a(b3,c)
b3[c]=d
a8=A.aY(b0,a6)*2654435761>>>0>>>18
if(!(a8<16384))return A.a(b3,a8)
e=b3[a8]
b3[a8]=a6
if(e<0||a6-e>65535||A.aY(b0,e)!==A.aY(b0,a6)){k=a6+1
m=A.aY(b0,k)*2654435761>>>0>>>18
q=a6
r=a
break}k=a6
q=k
r=a}}}a9=b1-q
n=a9>=15
l=r+(1+(n?B.a.H(a9-15,255)+1:0)+a9)
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
lx(a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3
if(a6<0||a5+a6>a4.length||a8<0||a8>a7.length)throw A.e(A.jy("Invalid LZ4 slice bounds"))
if(a6===0){if(a8!==0)throw A.e(B.W)
return 0}s=a5+a6
for(r=a7.length,q=a7.$flags|0,p=a4.length,o=a5,n=0;o<s;){m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
l=a4[o]
k=l>>>4
if(k===15)for(o=m;;o=m){if(o>=s)throw A.e(B.X)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
k+=j
if(j!==255){o=m
break}}else o=m
m=o+k
if(m>s||n+k>a8)throw A.e(B.V)
if(k>0){i=n+k
B.d.P(a7,n,i,a4,o)
n=i
o=m}if(o>=s)break
m=o+2
if(m>s)throw A.e(B.R)
if(!(o>=0&&o<p))return A.a(a4,o)
h=a4[o]
g=o+1
if(!(g<p))return A.a(a4,g)
f=(h|a4[g]<<8)>>>0
if(f<=0||f>n)throw A.e(B.T)
h=l&15
e=h+4
if(h===15)for(o=m;;o=m){if(o>=s)throw A.e(B.Y)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
e+=j
if(j!==255){o=m
break}}else o=m
i=n+e
if(i>a8)throw A.e(B.a_)
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
a7[n]=h}}if(n!==a8)throw A.e(A.dr("LZ4 decoded "+n+" bytes, expected "+a8,null,null))
return n},
eO:function eO(a,b){this.a=a
this.b=b
this.c=0},
fc:function fc(a,b,c){this.a=a
this.b=b
this.c=c},
ez:function ez(a){this.a=a},
iL(a){return new A.bo(a,A.h([],t.ch))},
jI(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.a.H(b.gcm()-s,2)),q=new Float32Array(a*3)
s=Math.max(2,a+Math.max(0,B.a.H(b.gcm()-s,2)))
new Float64Array(s)
return new A.b6(a,r,b,c,d,f,g,e,q)},
mf(a,b,c,d,e){return new A.bT(a,b,c,d,e,A.aa(t.S,t.W))},
jG(a,b){var s=a.length
return new A.cc(a,b,new Float64Array(s))},
nS(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.a.A(B.c.R(Math.min(a*c,s)),0,s)},
nV(a9){var s,r,q,p,o,n,m,l,k,j={},i=A.d0(32,512),h=A.d0(32,512),g=A.d0(32,512),f=A.d0(32,512),e=A.d0(32,512),d=t.cu,c=A.h([],d),b=A.h([],d),a=A.h([],d),a0=A.h([],d),a1=t.dh,a2=A.h([],a1),a3=A.h([],t.cU),a4=A.h([],a1),a5=new Float64Array(256),a6=t.gw,a7=A.h([],a6),a8=A.h([],d)
d=A.h([],d)
s=A.h([],a6)
a6=A.h([],a6)
r=A.h([],t.a2)
a1=A.h([],a1)
q=$.k
p=new A.eZ(q!=null,new A.af(t.el),i,h,g,f,e,c,b,a,a0,a2,a3,a4,new A.bq(a5),!1,a7,a8,d,s,a6,r,new A.af(t.c8),new A.af(t.fk),new A.af(t.gj),a1)
i=t.N
o=A.aa(i,i)
h=t.x
g=new Uint8Array(32)
f=new Uint8Array(16)
e=new Uint8Array(65536)
n=new A.eu(null,A.aa(h,t.g2),A.aa(i,t.cJ),A.aa(h,t.gz),A.iD(h),A.aa(i,t.eY),g,f,e)
h=new Int32Array(16384)
g=new Uint8Array(131072)
m=new A.f8()
l=A.aa(i,t.h)
k=A.eU(65536)
j.a=0
i=a9.a
new A.ca(i,A.n(i).i("ca<1>")).fZ(new A.ih(j,n,l,p,k,a9,new A.il(l,p,o),o,new A.ii(j,k,m),new A.ij(k),m,new A.im(n,l,p),new A.ik(j,k,m),new A.io(o,a9),new A.eO(h,g)))},
d0(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.ah(s,r,q,p,new Uint8Array(a))},
d2(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
if(a9===4){A.hq(a6,a7,a8)
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
break}if(a8.aL(f,c,a0-c,l)){l=a6.a
j=l.b
if(j!=null){a3=o.a(A.t($.k.memory).buffer)
a4=l.a
s=new Int32Array(a3,j,a4)}else{l=l.c
l.toString
s=l}l=a7.a
j=l.b
if(j!=null){a3=o.a(A.t($.k.memory).buffer)
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
hq(a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
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
if(a3>0&&a7.aL(h,a1,a2-a1,a3)){l=a5.a
j=l.b
if(j!=null){d=s.a(A.t($.k.memory).buffer)
a4=l.a
p=new Int32Array(d,j,a4)}else{l=l.c
l.toString
p=l}l=a6.a
j=l.b
if(j!=null){d=s.a(A.t($.k.memory).buffer)
a4=l.a
o=new Int32Array(d,j,a4)}else{l=l.c
l.toString
o=l}}}if(a<=a0)n+=2
if(a0<=a)m+=2}}},
iM(a,b){var s=B.a.b2(B.a.K(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
jT(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.a.H(b*a+127,255)<<16|B.a.H(c*a+127,255)<<8|B.a.H(d*a+127,255))>>>0},
b9(a,b){if(b>=256)return a
if(b<=0||a===0)return 0
return((a&16711935)*b+8388736>>>8&16711935|(a>>>8&16711935)*b+8388736&4278255360)>>>0},
ac(a,b){var s,r,q,p
if(a===0)return b
s=a>>>24
if(s===255||b===0)return a
r=255-s
q=(b&16711935)*r+8388736
p=(b>>>8&16711935)*r+8388736
return a+((B.a.K(q+(B.a.K(q,8)&16711935),8)&16711935|p+(B.a.K(p,8)&16711935)&4278255360)>>>0)},
aA(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.a.K(s+(B.a.K(s,8)&16711935),8)&16711935|r+(B.a.K(r,8)&16711935)&4278255360)>>>0},
jS(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a4===0||a3.b===0)return
if(a5!=null&&A.nU(a5,a0,a1,a2,a3.a,a3.b,a4))return
s=a3.b*2
r=a3.a.gt()
for(q=a.length,p=a4>>>24===255,o=r.length,n=0;n<s;n+=2){if(!(n<o))return A.a(r,n)
m=r[n]
l=n+1
if(!(l<o))return A.a(r,l)
k=r[l]
j=k>>>8
i=(k&255)+1
h=i===256?a4:A.b9(a4,i)
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
l=b===0?h:A.jQ(h,b,c)
a.$flags&2&&A.f(a)
a[f]=l}else for(d=f;d<e;++d){if(!(d>=0&&d<q))return A.a(a,d)
b=a[d]
l=b===0?h:A.jQ(h,b,c)
a.$flags&2&&A.f(a)
a[d]=l}}}},
jQ(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.a.K(s+(B.a.K(s,8)&16711935),8)&16711935|r+(B.a.K(r,8)&16711935)&4278255360)>>>0)},
m9(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8
if(b5===0||b3.b===0)return
s=c4-c2
r=c5-c3
q=s*s+r*r
if(q<=1e-12){if(0>=b4.length)return A.a(b4,0)
p=b4[0]
A.jS(a9,b0,b1,b2,b3,b5<255?A.aA(p,b5):p,null)
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
else a7=a3>=1?1023:B.c.Y(a3*1023+0.5)
if(!(a7>=0&&a7<i))return A.a(b4,a7)
d=b4[a7]
if(!(a6>=0&&a6<j))return A.a(a9,a6)
d=A.ac(d,a9[a6])
a9.$flags&2&&A.f(a9)
a9[a6]=d
a3+=n}else for(d=a0<256,a6=a4;a6<a5;++a6){if(a3<=0)a7=0
else a7=a3>=1?1023:B.c.Y(a3*1023+0.5)
if(!(a7>=0&&a7<i))return A.a(b4,a7)
p=b4[a7]
if(k)p=A.aA(p,b5)
if(d)p=A.b9(p,a0)
if(!(a6>=0&&a6<j))return A.a(a9,a6)
a8=A.ac(p,a9[a6])
a9.$flags&2&&A.f(a9)
a9[a6]=a8
a3+=n}}},
ma(d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6=1023
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
a2=$.dh()
a2.$flags&2&&A.f(a2)
a2[0]=b7
c1=a2[0]
a2[0]=b8
c2=a2[0]
a2[0]=b9
c3=a2[0]
a2[0]=c0
c4=new A.aF(c1,c2,c3,a2[0]).cu()
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
a&2&&A.f(d7)
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
c1=$.dh()
c1.$flags&2&&A.f(c1)
c1[0]=b7
c2=c1[0]
c1[0]=b8
c3=c1[0]
c1[0]=b9
c6=c1[0]
c1[0]=c0
c4=new A.aF(c2,c3,c6,c1[0]).cu()
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
if(f){c9=A.aA(c9,e3)
d0=A.aA(d0,e3)
d1=A.aA(d1,e3)
d2=A.aA(d2,e3)}if(a2){c9=A.b9(c9,a6)
d0=A.b9(d0,a6)
d1=A.b9(d1,a6)
d2=A.b9(d2,a6)}if(!(b6>=0&&b6<e))return A.a(d7,b6)
c1=A.ac(c9,d7[b6])
a&2&&A.f(d7)
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
if(f)d5=A.aA(d5,e3)
if(a2)d5=A.b9(d5,a6)
if(!(b6>=0&&b6<e))return A.a(d7,b6)
c1=A.ac(d5,d7[b6])
a&2&&A.f(d7)
d7[b6]=c1
b1+=b2
b2+=i;++b6}}}},
ar(a){var s=A.j(a)+128
return B.a.K(s+B.a.K(s,8),8)},
iS(a,b,c,d,e){var s
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
break}return A.ar(a*(255-d)+b*(255-c)+s)},
ef(a,b,c){var s,r,q,p,o,n,m,l,k
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
k=s+r-A.ar(s*r)
if(A.jR(c))return A.m6(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.ar(q*p)<<16|o+n-A.ar(o*n)<<8|m+l-A.ar(m*l))>>>0
return(k<<24|A.iS(q,p,s,r,c)<<16|A.iS(o,n,s,r,c)<<8|A.iS(m,l,s,r,c))>>>0},
jR(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
m6(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.a1(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.a1(o,n,m)
switch(j){case 12:s=A.hy(A.jP(p,A.iT(l)),A.ee(l))
break
case 13:s=A.hy(A.jP(l,A.iT(p)),A.ee(l))
break
case 14:s=A.hy(p,A.ee(l))
break
case 15:s=A.hy(l,A.ee(p))
break
default:s=new A.a1(A.iR(o,s,j),A.iR(n,r,j),A.iR(m,q,j))
break}r=new A.hw(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.a8()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.a8()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.Z(s)
return(i<<24|q<<16|o<<8|s)>>>0},
iR(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
ee(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
iT(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
jP(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.iT(a)
if(o===0)return B.aJ
return new A.a1((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
hy(a,b){var s=b-A.ee(a),r=a.a,q=a.b,p=a.c,o=new A.hz(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.a1(o.$1(r),o.$1(q),o.$1(p))},
m7(a,b,c,d,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
if(a1===0)return
if(a3!=null&&!A.jR(a2)&&A.nO(a3,b,c,d,a0.a,a0.b,a1,a2))return
s=a0.a.gt()
for(r=a.length,q=s.length,p=0,o=0,n=0,m=0;m<a0.b*2;m+=2){if(!(m<q))return A.a(s,m)
l=s[m]
k=m+1
if(!(k<q))return A.a(s,k)
j=s[k]
i=A.b9(a1,(j&255)+1)
if(i===0)continue
h=((l>>>16)-c)*d+(l&65535)-b
g=h+(j>>>8)
for(f=h;f<g;++f){if(!(f>=0&&f<r))return A.a(a,f)
e=a[f]
if(i!==p||e!==o){n=A.ef(i,e,a2)
o=e
p=i}a.$flags&2&&A.f(a)
a[f]=n}}},
m8(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.f(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.ef(k,j,a3)
p=j
q=k}a.$flags&2&&A.f(a)
a[l]=o}},
kl(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k=d,j=d*e,i=k
if(typeof i!=="number")return i.ad()
p=i*e
i=k
if(typeof i!=="number")return i.e5()
if(i<d||p>c.gt().length)throw A.e(A.au("Raster output is too small",null))
i=f.b
if(i)A.kz(c,p)
else B.f.T(c.gt(),0,p,0)
o=!0
if(d>0)if(e>0){n=a.b
n===$&&A.C()
if(!(n<=0)){o=a.c
o===$&&A.C()
o=o<=0}}if(o)return
o=a.b
o===$&&A.C()
s=d/o
o=a.c
o===$&&A.C()
r=e/o
q=f.at
f.at=a
try{A.j0(a,b,255,c,0,0,k,0,0,d,e,s,0,0,r,0,0,null,f,0,!0,i)
m=Math.max(A.j(j),f.rx)
f.rx=0
l=m<=65536&&!f.z
f.z=!1
if(l){if(++f.ry>=16){f.ry=0
f.he()}}else f.ry=0}finally{f.sf9(q)}},
j0(f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2=null
if(g0>=g2||g1>=g3||f5<=0)return
s=h4?f6:f2
r=f3.w
for(q=r.length-1,p=h2*3,o=p+1,n=h2+1,m=g7>=0,l=g5>=0,k=g6>=0,j=g4>=0,i=t.a,h=h1.b,g=s!=null,f=p+2;q>=0;--q){if(!(q<r.length))return A.a(r,q)
e=r[q]
if(!e.ch){if(!e.e)d=(e.b!=null||e.f!=null)&&f4>=e.c&&f4<e.d
else d=!1
d=!d}else d=!0
if(d)continue
d=e.a.e.n(f4)
if(0>=d.length)return A.a(d,0)
if(B.c.D(B.a.A(B.c.Y(f5*B.c.D(d[0])/100),0,255)*e.aQ(f4)/255)===0)continue
c=e.ay
b=e.Q
d=e.y
a=d===2||d===4
a0=e.ax?255:f5
a1=c!=null
a2=!1
if(a1){if(!c.e)a3=(c.b!=null||c.f!=null)&&f4>=c.c&&f4<c.d
else a3=!1
if(a3){a3=c.a.e.n(f4)
if(0>=a3.length)return A.a(a3,0)
a3=B.c.D(B.a.A(B.c.Y(a0*B.c.D(a3[0])/100),0,255)*c.aQ(f4)/255)>0
a2=a3}}if(a1&&!a2&&!a)continue
if(!a2){if(b===0)A.bU(e,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,0,!0,!1,!1,!1,!0)
else{a4=e.ar(f4)
if(a4!=null){d=j?a4.a:a4.c
a1=k?a4.b:a4.d
a5=B.c.R(g4*d+g6*a1+g8)-1
d=l?a4.a:a4.c
a1=m?a4.b:a4.d
a6=B.c.R(g5*d+g7*a1+g9)-1
d=j?a4.c:a4.a
a1=k?a4.d:a4.b
a7=B.c.V(g4*d+g6*a1+g8)+1
d=l?a4.c:a4.a
a1=m?a4.d:a4.b
a8=B.c.V(g5*d+g7*a1+g9)+1
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
if(a1!=null){if(g)if($.k!=null){a3=!0
if(b!==6)if(b!==7)if(b!==9)a3=b>=12&&b<=15
if(!a3){d=!1
if(a1.w){a1=a1.f
if(a1!=null)if(a1.a!=null){d=a1.n(0)
if(0>=d.length)return A.a(d,0)
d=d[0]!==0}else d=!0}d=!d}}}else d=!0}if(d){A.bU(e,f4,f5,f6,f7,f8,f9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,b,!0,!1,!1,!1,!0)
continue}d=a9*b0
b2=h1.aH(f,d)
if(h){a1=b2.c
if(a1!=null)$.k.fastlottie_clear_pixels(a1,d)
else{a1=b2.d
a1.toString
B.f.T(a1,0,d,0)}}else{a1=b2.c
if(a1!=null){a3=i.a(A.t($.k.memory).buffer)
b3=b2.b
a1=new Uint32Array(a3,a1,b3)}else{a1=b2.d
a1.toString}B.f.T(a1,0,d,0)}A.bU(e,f4,f5,b2,a5,a6,a9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,h0,h1,n,h3,h,0,!0,!0,!1,!1,!0)
if(g){d=!0
if(b!==6)if(b!==7)if(b!==9)d=b>=12&&b<=15
b4=!d&&A.nN(s,(a6-f8)*f9+a5-f7,f9,b2,a9,b0,b)}else b4=!1
if(!b4){d=f6.c
if(d!=null){a1=i.a(A.t($.k.memory).buffer)
b3=f6.b
d=new Uint32Array(a1,d,b3)}else{d=f6.d
d.toString}a1=b2.c
if(a1!=null){a3=i.a(A.t($.k.memory).buffer)
b3=b2.b
a1=new Uint32Array(a3,a1,b3)}else{a1=b2.d
a1.toString}A.m8(d,a5-f7,a6-f8,f9,a1,0,0,a9,a9,b0,b)}}}}continue}b5=d===3||d===4
b6=e.ar(f4)
if(b6==null)continue
d=j?b6.a:b6.c
a1=k?b6.b:b6.d
b7=B.c.R(g4*d+g6*a1+g8)-1
d=l?b6.a:b6.c
a1=m?b6.b:b6.d
b8=B.c.R(g5*d+g7*a1+g9)-1
d=j?b6.c:b6.a
a1=k?b6.d:b6.b
b9=B.c.V(g4*d+g6*a1+g8)+1
d=l?b6.c:b6.a
a1=m?b6.d:b6.b
c0=B.c.V(g5*d+g7*a1+g9)+1
if(b7<g0)b7=g0
if(b8<g1)b8=g1
if(b9>g2)b9=g2
if(c0>g3)c0=g3
if(b7>=b9||b8>=c0)continue
c1=c.ar(f4)
if(c1!=null){d=j?c1.a:c1.c
a1=k?c1.b:c1.d
c2=Math.max(b7,B.c.R(g4*d+g6*a1+g8)-1)
d=l?c1.a:c1.c
a1=m?c1.b:c1.d
c3=Math.max(b8,B.c.R(g5*d+g7*a1+g9)-1)
d=j?c1.c:c1.a
a1=k?c1.d:c1.b
c4=Math.min(b9,B.c.V(g4*d+g6*a1+g8)+1)
d=l?c1.c:c1.a
a1=m?c1.d:c1.b
c5=Math.min(c0,B.c.V(g5*d+g7*a1+g9)+1)}else{c5=g1
c4=g0
c3=c5
c2=c4}c6=c2<c4&&c3<c5
if(!a&&!c6)continue
if(a&&!c6&&b===0){A.bU(e,f4,f5,f6,f7,f8,f9,b7,b8,b9,c0,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,0,!0,!1,!1,!1,!0)
continue}a5=a?b7:c2
a6=a?b8:c3
a7=a?b9:c4
a8=a?c0:c5
a9=a7-a5
b0=a8-a6
c7=a9*b0
b2=h1.aH(p,c7)
d=b2.c
if(d!=null){a1=i.a(A.t($.k.memory).buffer)
b3=b2.b
d=new Uint32Array(a1,d,b3)}else{d=b2.d
d.toString}B.f.T(d,0,c7,0)
A.bU(e,f4,f5,b2,a5,a6,a9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,f2,h1,n,h3,e.as!=null&&h,0,!0,!0,!1,!1,!0)
c8=h1.aH(o,c7)
d=c8.c
if(d!=null){a1=i.a(A.t($.k.memory).buffer)
b3=c8.b
d=new Uint32Array(a1,d,b3)}else{d=c8.d
d.toString}B.f.T(d,0,c7,0)
if(c6){d=c.as!=null&&h
A.bU(c,f4,a0,c8,a5,a6,a9,c2,c3,c4,c5,g4,g5,g6,g7,g8,g9,f2,h1,n,h3,d,0,!0,!0,!b5,!1,!0)}d=b2.c
if(d!=null){a1=i.a(A.t($.k.memory).buffer)
b3=b2.b
c9=new Uint32Array(a1,d,b3)}else{d=b2.d
d.toString
c9=d}d=c8.c
if(d!=null){a1=i.a(A.t($.k.memory).buffer)
b3=c8.b
d0=new Uint32Array(a1,d,b3)}else{d=c8.d
d.toString
d0=d}d=f6.c
if(d!=null){a1=i.a(A.t($.k.memory).buffer)
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
if(e3!==255){e0=$.kT()
if(!(e3<e0.length))return A.a(e0,e3)
e8=e0[e3]
e5=e5*e8>>>16
e6=e6*e8>>>16
e7=e7*e8>>>16}e9=B.a.A(19595*e5+38470*e6+7471*e7>>>16,0,255)
e4=a?255-e9:e9}if(e4===0)continue
f0=e4===255?e1:A.aA(e1,e4)
f1=d8+d9
if(a1){if(!(f1>=0&&f1<d))return A.a(d1,f1)
e0=A.ac(f0,d1[f1])}else{if(!(f1>=0&&f1<d))return A.a(d1,f1)
e0=A.ef(f0,d1[f1],b)}d5&2&&A.f(d1)
if(!(f1>=0&&f1<d))return A.a(d1,f1)
d1[f1]=e0}}}},
eo(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
em(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
ep(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
en(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
ek(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaA()){i.$flags&2&&A.f(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gcg()){a.cP(b)
s=a.z
r=a.Q
i.$flags&2&&A.f(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.dR(b)
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
bU(i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9=null
if(!i0.e0(i1))return
s=k1?i3:h9
r=k6?255:i0.fY(i1,i2)
q=k3?i0.aQ(i1):255
if(r===0||q===0)return
if(!k6)p=k5&&r===255&&q===255
else p=!0
o=p?h9:i0.as
if(o!=null){n=i0.ar(i1)
if(n==null)return
m=B.c.R(A.eo(n,j1,j3,j5))-1
l=B.c.R(A.ep(n,j2,j4,j6))-1
k=B.c.V(A.em(n,j1,j3,j5))+1
j=B.c.V(A.en(n,j2,j4,j6))+1
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
b=B.a.K(e,8)
p=-c
a=B.a.K(p,8)
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
a9=a6?i3:j8.aH(j9*3+2,a7*a8)
b0=a6?i4:a2
b1=a6?i5:a3
b2=a6?i6:a7
if(!a6){p=a7*a8
if(j8.b)A.kz(a9,p)
else B.f.T(a9.gt(),0,p,0)}p=a6?j9:j9+1
A.bU(i0,i1,255,a9,b0,b1,b2,a2,a3,a4,a5,j1,j2,j3,j4,j5,j6,j7,j8,p,k0,a6?k1:j8.b,0,!1,!1,!1,!0,!0)
b3=A.ar(r*q)
if(!k5)b4=d===0&&c===0
else b4=!0
p=!1
if(!b4)if(k2===0)if(s!=null)if(b2===a7)if(b0===a2)if(b1===a3)p=(!a6||b3===255)&&A.nQ(s,(h-i5)*i6+i-i4,i6,a9,a7,a8,i-a2,h-a3,g-i,f-h,b,a,a0,a1,(255-o.aM(16)<<16|255-o.aM(8)<<8|255-o.aM(0))>>>0,b3)
if(p)return
A.mD(o,b3,k2,a9.gt(),b0,b1,b2,new A.aL([a2,a3,a4,a5]),i3.gt(),i4,i5,i6,new A.aL([i,h,g,f]),b,a,a0,a1,a6,b4)
return}b5=k7?i0.at:h9
b6=b5==null?h9:b5.fo(i1)
b7=k5&&b6!=null&&b6>>>24===255?h9:b6
if(q!==255||b7!=null){p=b7==null
b3=p?q:A.ar((b7>>>24)*q)
if(b3===0)return
n=i0.ar(i1)
if(n==null)return
i=Math.max(i7,B.c.R(A.eo(n,j1,j3,j5))-1)
h=Math.max(i8,B.c.R(A.ep(n,j2,j4,j6))-1)
g=Math.min(i9,B.c.V(A.em(n,j1,j3,j5))+1)
f=Math.min(j0,B.c.V(A.en(n,j2,j4,j6))+1)
a7=g-i
a8=f-h
if(a7<=0||a8<=0)return
e=a7*a8
a9=j8.aH(j9*3+2,e)
B.f.T(a9.gt(),0,e,0)
A.bU(i0,i1,i2,a9,i,h,a7,i,h,g,f,j1,j2,j3,j4,j5,j6,j7,j8,j9+1,k0,j8.b,0,!1,!1,k5,!1,!1)
b8=a9.gt()
b9=i3.gt()
c0=(h-i5)*i6+i-i4
for(e=b9.length,c1=k2===0,c2=b8.length,c3=b9.$flags|0,c4=0;c4<a8;++c4,c0+=i6)for(c5=c4*a7,c6=0;c6<a7;++c6){c7=c5+c6
if(!(c7>=0&&c7<c2))return A.a(b8,c7)
c8=b8[c7]
if(c8===0)continue
if(p)c9=A.aA(c8,b3)
else{d0=(c8>>>24)*b3+128
c9=A.aA((b7&16777215|4278190080)>>>0,B.a.K(d0+B.a.K(d0,8),8))}d1=c0+c6
if(c1){if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ac(c9,b9[d1])}else{if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ef(c9,b9[d1],k2)}c3&2&&A.f(b9)
if(!(d1>=0&&d1<e))return A.a(b9,d1)
b9[d1]=c7}return}if(i0.gdN()){for(c8=i0,d2=0;c8!=null;c8=c8.cy)++d2
if(d2===1){d3=j8.c0(j9)
A.ek(i0.a,i1,j1,j2,j3,j4,j5,j6,d3)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}else{e0=j8.k1
while(e0.length<d2)B.b.m(e0,h9)
e1=d2-1
for(c8=i0;c8!=null;c8=c8.cy,e1=e2){e2=e1-1
B.b.u(e0,e1,c8)}d3=j8.c0(j9)
for(d9=j6,d8=j5,d7=j4,d6=j3,d5=j2,d4=j1,d1=0;d1<d2;++d1){if(!(d1<e0.length))return A.a(e0,d1)
A.ek(e0[d1].a,i1,d4,d5,d6,d7,d8,d9,d3)
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
d4=j1}e3=k0&&i0.gdP()
e4=i0.z
if(e4!=null&&i0.gfP()){e5=e3&&i0.gfS()?new A.bR([d4,d5,d6,d7,d8,d9,i7,i8,i9,j0]):h9
p=e5==null
e6=p?h9:j8.d7(i0,e5)
if(e6==null){e7=j8.cB(j9)
e7.l(0)
A.na(e4,i1,d4,d5,d6,d7,d8,d9,i7,i8,i9,j0,e7,j8,j9)
if(!p)j8.d6(i0,e5,e7)}else if(j7==null&&e6.b!==0){e7=j8.cB(j9)
e7.dI(e6)}else e7=e6
if(e7.b===0)return
if(j7!=null){e8=j8.ek(j9)
A.hq(e7,j7,e8)
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
if(f4!=null)A.kk(f4,i1,r,i3,i4,i5,i6,f0,f1,f2,f3,d4,d5,d6,d7,d8,d9,e9,j8,j9+1,e3,k1,k2)
f5=i0.f
if(f5!=null){p=i0.x
if(p!=null){p=p.n(i1)
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
g=B.c.V(d8+(c1?d4*p:0))
p=d7>=0
h=B.c.R(d9+(p?0:d7*e))
f=B.c.V(d9+(p?d7*e:0))
f7=Math.max(f0,i)
f8=Math.max(f1,h)
f9=Math.min(f2,g)
g0=Math.min(f3,f)
if(f7<f9&&f8<g0)A.j0(f5,f6,r,i3,i4,i5,i6,f7,f8,f9,g0,d4,d5,d6,d7,d8,d9,e9,j8,j9+1,e3,k1)}else{c1=0+p
c2=0+e
g1=Math.max(f0,B.c.R(A.eo(new A.a7(0,0,c1,c2),d4,d6,d8))-1)
g2=Math.max(f1,B.c.R(A.ep(new A.a7(0,0,c1,c2),d5,d7,d9))-1)
g3=Math.min(f2,B.c.V(A.em(new A.a7(0,0,c1,c2),d4,d6,d8))+1)
g4=Math.min(f3,B.c.V(A.en(new A.a7(0,0,c1,c2),d5,d7,d9))+1)
if(g1<g3&&g2<g4){g5=g3-g1
c1=g5*(g4-g2)
g6=j8.aH(j9*3+2,c1)
B.f.T(g6.gt(),0,c1,0)
A.j0(f5,f6,r,g6,g1,g2,g5,g1,g2,g3,g4,d4,d5,d6,d7,d8,d9,h9,j8,j9+1,e3,!1)
c1=j8.cx
c1.l(0)
c1.a4(!0)
c1.q(d8,d9)
c2=d4*p
p=d5*p
c1.q(c2+d8,p+d9)
c3=d6*e
e=d7*e
c1.q(c2+c3+d8,p+e+d9)
c1.q(c3+d8,e+d9)
c1.a1()
j8.aJ(c1,!1,j8.gbK(),g1,g2,g3,g4)
g7=j8.gbK()
if(e9!=null){A.hq(j8.gbK(),e9,j8.gbk())
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
if(c8!==0){h8=c3?c8:A.b9(c8,h4)
c5=h6+h7
if(!(c5>=0&&c5<e))return A.a(b9,c5)
c7=A.ac(h8,b9[c5])
c2&2&&A.f(b9)
b9[c5]=c7}}}}}}},
mD(c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=d1.a,c0=b9[0],c1=b9[1],c2=b9[2],c3=b9[3]
b9=d6.a
s=b9[0]
r=b9[1]
q=b9[2]
p=b9[3]
o=255-c4.aM(16)
n=255-c4.aM(8)
m=255-c4.aM(0)
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
if(b4!==0){a4=A.ar(o*b4)
if(typeof a4!=="number")return A.Z(a4)
a4=A.ar((a5>>>16&255)*(255-a4))
if(typeof a4!=="number")return a4.a8()
b5=A.ar(n*b4)
if(typeof b5!=="number")return A.Z(b5)
b5=A.ar((a5>>>8&255)*(255-b5))
if(typeof b5!=="number")return b5.a8()
b6=A.ar(m*b4)
if(typeof b6!=="number")return A.Z(b6)
b6=A.ar((a5&255)*(255-b6))
if(typeof b6!=="number")return A.Z(b6)
a5=(a5&4278190080|a4<<16|b5<<8|b6)>>>0}}b7=a0+a3
if(e1){d2.$flags&2&&A.f(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a5}else{if(k)a5=A.aA(a5,c5)
if(l){if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ac(a5,d2[b7])}else{if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ef(a5,d2[b7],c6)}d2.$flags&2&&A.f(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a4}}}if(e1&&k)for(f=r;f<p;++f){b8=(f-d4)*d5-d3
for(a3=s;a3<q;++a3){l=b8+a3
if(!(l>=0&&l<b9))return A.a(d2,l)
k=A.aA(d2[l],c5)
d2.$flags&2&&A.f(d2)
d2[l]=k}}},
na(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.em(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.A(0.25/e,0.005,1.5),c=new A.hZ(b1.el(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.b.gae(a).gc6())c.$2(B.b.gae(a),b0)
else{s=b1.al(0)
r=b1.al(1)
q=b1.al(2)
for(p=a.length,o=a8-a6,n=!1,m=0;m<a.length;a.length===p||(0,A.T)(a),++m){l=a[m]
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
i=B.a.A(B.c.D(j[0]*2.56),0,256)
if(i!==256)s.e7(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aL(g,a6,o,256)
if(j){s.aS(r)
A.d2(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aS(s)
else if(j)A.d2(q,s,b0,k)
else{b0.aS(r)
A.d2(r,s,b0,k)}n=!0}}},
mJ(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.f(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.k8(a,Math.abs(b),2,2,4,c,d,e)},
kk(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gcd())s=c
else{r=f.e.n(b)
if(0>=r.length)return A.a(r,0)
s=B.a.A(B.c.D(c*B.c.D(r[0])/100),0,255)}if(s===0)return
if(!f.gaA()){q=b3.c0(b4)
A.ek(f,b,a6,a7,a8,a9,b0,b1,q)
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
if(g instanceof A.a_)A.kk(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.b8)A.nd(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
nd(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.n(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.a.A(B.c.D(c0*B.c.D(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gc1())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gF()
b7=b7!==!1
r=b7}b8.id!==$&&A.M()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.bR([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.d7(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.b.an(b8.a,A.jc())
b8.fx!==$&&A.M()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.aY(b9)
if(l==null)return
n=[Math.max(c5,B.c.R(A.eo(l,c9,d1,d3))-2),Math.max(c6,B.c.R(A.ep(l,d0,d2,d4))-2),Math.min(c7,B.c.V(A.em(l,c9,d1,d3))+2),Math.min(c8,B.c.V(A.en(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gc_()
m=b8.a
A.hY(m,0,m.length,b9,new A.br([c9,d0,d1,d2,d3,d4]),new A.aL(n),b8.f,o,d6,0)}else{l=A.n9(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
d6.aJ(d6.db,g,d6.gc_(),k,j,i,h)
o=d6.gc_()}if(!b7&&o.b>0)d6.d6(b8,p,o)}if(d5!=null){A.hq(o,d5,d6.gbk())
o=d6.gbk()}if(o.b===0)return
f=d8?c1:b6
e=b8.y
if(e==null){d=b8.b.n(b9)
b7=d.length
if(0>=b7)return A.a(d,0)
n=B.a.A(B.c.D(d[0]*255),0,255)
if(1>=b7)return A.a(d,1)
m=B.a.A(B.c.D(d[1]*255),0,255)
if(2>=b7)return A.a(d,2)
c=A.jT(s,n,m,B.a.A(B.c.D(d[2]*255),0,255))
if(d9===0)A.jS(c1.gt(),c2,c3,c4,o,c,f)
else A.m7(c1.gt(),c2,c3,c4,o,c,d9,f)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.mH(e,b9,d6)
a7=e.d.n(b9)
a8=e.e.n(b9)
if(e.gfR()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=e.fM(b9,a9,b0)
if(b1!=null){A.mK(c1.gt(),c2,c3,c4,o,a6.gt(),s,new A.br([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
return}}b7=!1
if(f!=null)if($.k!=null){b7=o.a
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
b5=A.nP(f,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
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
A.ma(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gt()
b2=a6.gt()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.m9(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
mK(b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=c0.a,a1=a0[0],a2=a0[1],a3=a0[2],a4=a0[3],a5=a0[4],a6=a0[5],a7=c4.a,a8=c4.b,a9=1-a7*a7-a8*a8,b0=a1/c3,b1=a2/c3,b2=b7.a.gt()
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
if(s)a=A.aA(a,b9)
if(n)a=A.b9(a,j)
if(!(d>=0&&d<a0))return A.a(b3,d)
i=A.ac(a,b3[d])
b3.$flags&2&&A.f(b3)
b3[d]=i}}},
dc(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aI){s=a.c
if(s===$){r=a.b!==1||B.b.an(a.a,A.jc())
a.c!==$&&A.M()
a.c=r
s=r}q=s
break A}if(a instanceof A.a_){s=a.r
if(s===$){r=B.b.an(a.a,A.jc())
a.r!==$&&A.M()
a.r=r
s=r}q=s
break A}if(a instanceof A.P){q=A.dc(a.a)
break A}q=!1
break A}return q},
hY(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.dc(a[b])}else s=!1
if(s){if(!(b<a.length))return A.a(a,b)
A.el(a[b],d,e,a0,a1,a2,a3,a4)
return}s=e.a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
n=s[4]
m=s[5]
l=a3.db
l.l(0)
for(k=b;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dc(j))A.bt(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.l(0)
else{s=a0.a
a3.aJ(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.dc(j))continue
if(a2.b===0)A.el(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.al(i)
A.el(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.al(h)
f.aS(a2)
A.d2(f,g,a2,a1?5:2)}}},
el(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
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
if(!s.gaA()){k=a6.cT(a7)
A.ek(s,a1,q,p,o,n,m,l,k)
a2=new A.br([k[0],k[1],k[2],k[3],k[4],k[5]])}s=r.a
A.hY(s,0,s.length,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.P
j=s?a0:null
if(s){A.el(j.a,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.aI
i=s?a0:null
if(s){h=i.a
s=i.b
if(s===1){A.hY(h,0,h.length,a1,a2,a3,a4,a5,a6,a7+1)
return}g=a7*2
f=a6.al(g)
e=a6.al(g+1)
d=a7+1
A.hY(h,0,h.length-1,a1,a2,a3,!1,f,a6,d)
if(f.b===0)c=s===3||s===4
else c=!1
if(c){a5.l(0)
return}b=B.b.gac(h)
if(A.dc(b))A.el(b,a1,a2,a3,!1,e,a6,d)
else{d=a2.a
q=d[0]
p=d[1]
o=d[2]
n=d[3]
m=d[4]
l=d[5]
a=a6.db
a.l(0)
A.bt(b,a1,q,p,o,n,m,l,0.0625,a,a6,0,0)
d=a3.a
a6.aJ(a,!1,e,d[0],d[1],d[2],d[3])}A.d2(f,e,a5,s)
break A}throw A.e(A.ax("Expected a boolean path"))}},
n9(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8=a9.e
if(a8){s=a9.d.n(b0)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a7}else r=0
q=a9.aY(b0)
if(q==null)return a7
s=B.c.R(A.eo(q,b5,b7,b9))
p=B.c.R(A.ep(q,b6,b8,c0))
o=B.c.V(A.em(q,b5,b7,b9))
n=B.c.V(A.en(q,b6,b8,c0))
m=Math.max(b1,s-2)
l=Math.max(b2,p-2)
k=Math.min(b3,o+2)
j=Math.min(b4,n+2)
if(m>=k||l>=j)return a7
i=a9.go
if(i===$){h=a9.fb()
a9.go!==$&&A.M()
a9.go=h
i=h}if(i!=null){g=c1.dc(i,b0)
if(g.r===0)return a7
a8=c1.db
a8.l(0)
a8.aC(g,b5,b6,b7,b8,b9,c0)
return new A.aL([m,l,k,j])}if(!a8&&a9.z==null&&a9.a.length===1){f=B.b.gae(a9.a)
while(f instanceof A.P)f=f.a
if(f instanceof A.aq&&!f.gF()){e=c1.db
e.l(0)
A.kc(f,b0,0.0625,e,new A.br([b5,b6,b7,b8,b9,c0]));++c1.w
return e.r===0?a7:new A.aL([m,l,k,j])}}d=Math.max(Math.sqrt(b5*b5+b6*b6),Math.sqrt(b7*b7+b8*b8))
c=d<=0.000001?0.25:B.c.A(0.25/d,0.005,1.5)
b=c*c
a=c1.cx
a.l(0)
a0=a9.a
for(a1=a0.length-1;a1>=0;--a1){if(!(a1<a0.length))return A.a(a0,a1)
A.bt(a0[a1],b0,1,0,0,1,0,0,b,a,c1,0,0)}if(a.r===0)return a7
a2=a9.z
if(a2!=null){a3=c1.cy
a3.l(0)
A.mt(a,a2,b0,a3,c1.k3)
if(a3.r===0)return a7
a4=a3}else a4=a
if(a8){a5=c1.dx
a5.l(0)
A.k8(a4,r*0.5,a9.r,a9.w,a9.x,c,a5,c1.gdd())
if(a5.r===0)return a7
a4=a5}a6=c1.db
a6.l(0)
a6.aC(a4,b5,b6,b7,b8,b9,c0)
return new A.aL([m,l,k,j])},
mH(a,b,c){var s,r,q,p
if(a.c.a!=null){s=c.x2
r=s.h(0,a)
if(r!=null)return r.b
if(s.a>=256)s.J(0,new A.U(s,s.$ti.i("U<1>")).ga6(0)).b.a0()
q=A.eU(1024)
p=c.at
p.toString
s.u(0,a,new A.a8(p,q,t.dL))
A.kb(a,b,q.gt())
return q}q=c.xr
if(q==null)q=c.xr=A.eU(1024)
A.kb(a,b,q.gt())
return q},
kb(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a6.c.n(a7),a4=a6.a,a5=a6.x
for(s=a3.length,r=0;r<a4;++r){q=4*r
p=3*r
o=q+1
if(!(o<s))return A.a(a3,o)
o=A.hC(a3[o])
a5.$flags&2&&A.f(a5)
n=a5.length
if(!(p<n))return A.a(a5,p)
a5[p]=o
o=p+1
m=q+2
if(!(m<s))return A.a(a3,m)
m=A.hC(a3[m])
a5.$flags&2&&A.f(a5)
if(!(o<n))return A.a(a5,o)
a5[o]=m
m=p+2
o=q+3
if(!(o<s))return A.a(a3,o)
o=A.hC(a3[o])
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
a1=A.jT(B.a.A(B.c.D(a6.ev(a3,j)*255),0,255),B.a.A(B.c.D((m+(g-m)*d)*255),0,255),B.a.A(B.c.D((a+(a0-a)*d)*255),0,255),B.a.A(B.c.D((a1+(a2-a1)*d)*255),0,255))
a8.$flags&2&&A.f(a8)
if(!(k<a8.length))return A.a(a8,k)
a8[k]=a1}},
bt(a,b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g
while(a instanceof A.P)a=a.a
if(a instanceof A.a_){s=a.c
if(!s.gaA()){r=a4.cT(a6)
A.ek(s,b,c,d,e,f,a0,a1,r)
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
A.bt(s[k],b,q,p,o,n,m,l,a2,a3,a4,a5,j)}return}if(a instanceof A.ba){i=A.mI(a.a,a.b,b,A.ki(c,d,e,f,a2),a4,a5,a6)
if(i!=null&&i.r>0)a3.aC(i,c,d,e,f,a0,a1)
return}if(a instanceof A.aI){if(a.b===3&&a.a.length>=2){for(s=a.a,k=0;k<s.length-1;++k)A.bt(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
h=a4.eo(a6)
A.bt(B.b.gac(s),b,c,d,e,f,a0,a1,a2,h,a4,a5,a6+1)
a3.fn(h)
return}for(s=a.a,k=0;k<s.length;++k)A.bt(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
return}if(a.ga5()){a3.aC(a4.dc(a,b),c,d,e,f,a0,a1)
return}if(c===1&&d===0&&e===0&&f===1&&a0===0&&a1===0)A.hV(a,b,a2,a3)
else{g=a4.dy
g.l(0)
A.hV(a,b,A.ki(c,d,e,f,a2),g)
a3.aC(g,c,d,e,f,a0,a1)}},
ki(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
k1(a,b,c,d){var s,r,q,p,o
if(d==null){a.q(b,c)
return}s=d.a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
a.q(r*b+p*c+s[4],q*b+o*c+s[5])},
kc(b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=b3.e,b0=a9.n(b4),b1=b0.length,b2=b1/6|0
if(b2===0)return
s=b3.f
r=b3.r
if(r.length!==0){q=a9.b.a
if(b4<=B.i.ga6(q)){p=B.b.ga6(r).a
s=p}else if(b4>=B.i.gac(q)){p=B.b.gac(r).a
s=p}else{a9=a9.r
if(!(a9<r.length))return A.a(r,a9)
o=r[a9]
n=o.a
m=o.b
p=n&&m
s=n}}else p=s
b6.a4(s)
if(0>=b1)return A.a(b0,0)
a9=b0[0]
if(1>=b1)return A.a(b0,1)
A.k1(b6,a9,b0[1],b7)
l=b0[0]
k=b0[1]
j=p?b2:b2-1
for(a9=b7!=null,i=1;i<=j;++i,k=a,l=b){h=(i-1)*6
g=B.a.M(i,b2)*6
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
if(Math.abs(f)<=0.0001&&Math.abs(e)<=0.0001&&Math.abs(d)<=0.0001&&Math.abs(c)<=0.0001)A.k1(b6,b,a,b7)
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
hV(a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(a3 instanceof A.aq){A.kc(a3,a4,a5,a6,null)
return}if(a3 instanceof A.aT){a6.a4(!0)
s=a6.gfm()
a3.eQ(a4,s,s,new A.hW(a6,a5),a6.gfI())
return}if(a3 instanceof A.aK){r=a3.r.n(a4)
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
a6.q(p,s)
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
c=B.c.A(s[0],0,Math.min(Math.abs(n),Math.abs(m)))
if(c<=0.0001){a6.a4(!0)
s=p+n
j=o-m
a6.q(s,j)
i=o+m
h=p-n
if(!a3.f){a6.q(s,i)
a6.q(h,i)
a6.q(h,j)}else{a6.q(h,j)
a6.q(h,i)
a6.q(s,i)}a6.a1()
return}b=c*0.5522847498307936
a6.a4(!0)
s=p+n
j=o-m
i=j+c
a6.q(s,i)
h=o+m
g=s-c
f=p-n
e=i-b
d=h-c
a=g+b
a0=f+c
if(!a3.f){a6.q(s,d)
a1=d+b
a6.U(s,d,s,a1,a,h,g,h,a5)
a6.q(a0,h)
a2=a0-b
a6.U(a0,h,a2,h,f,a1,f,d,a5)
a6.q(f,i)
a6.U(f,i,f,e,a2,j,a0,j,a5)
a6.q(g,j)
a6.U(g,j,a,j,s,e,s,i,a5)}else{a6.U(s,i,s,e,a,j,g,j,a5)
a6.q(a0,j)
a1=a0-b
a6.U(a0,j,a1,j,f,e,f,i,a5)
a6.q(f,d)
i=d+b
a6.U(f,d,f,i,a1,h,a0,h,a5)
a6.q(g,h)
a6.U(g,h,a,h,s,i,s,d,a5)}a6.a1()}},
mI(a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a1.a,a0=a.length
if(a2>=a0)return null
s=a1.b.n(a3)
if(0>=s.length)return A.a(s,0)
r=B.c.A(s[0],0,100)/100
s=a1.c.n(a3)
if(0>=s.length)return A.a(s,0)
q=B.c.A(s[0],0,100)/100
p=Math.abs(q-r)
if(p<0.000001)return null
if(!(a2<a.length))return A.a(a,a2)
o=a[a2]
n=a5.er(a6)
s=a6+1
A.bt(o,a3,1,0,0,1,0,0,a4,n,a5,s,a7)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a1.d.n(a3)
if(0>=l.length)return A.a(l,0)
k=B.c.M(m+l[0]/360,1)
j=k+p
i=a5.ep(a6,a0)
for(m=i.$flags|0,h=0,g=0,f=0;f<a0;++f){if(!(f<a.length))return A.a(a,f)
l=a[f]
e=A.n4(l,a3,a4,a5,f===a2?n:null,s,a7)
m&2&&A.f(i)
if(!(f<i.length))return A.a(i,f)
i[f]=e
if(f<a2)g+=e
h+=e}a=a1.e
if(a)d=h
else{if(!(a2<i.length))return A.a(i,a2)
d=i[a2]}c=a?g:0
b=a5.eq(a6)
a=a5.k3
A.ka(n,k*d-c,Math.min(j,1)*d-c,b,a)
if(j>1)A.ka(n,-c,(j-1)*d-c,b,a)
return b},
n4(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga5()){s=d.x1.h(0,a)
if(s!=null)return s.b}r=A.dY()
if(e!=null)r.sdK(e)
else{r.sdK(d.en(f))
A.bt(a,b,1,0,0,1,0,0,c,r.am(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.w(A.aj(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.w(A.aj(""))
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
if(o===r)A.w(A.aj(""))
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
q+=Math.sqrt(n*n+o*o)}}++p}if(a.ga5()){o=d.x1
if(o.a>=256)o.l(0)
n=d.at
n.toString
o.u(0,a,new A.a8(n,q,t.e))}return q},
ka(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
k=a7.aF(l+1)
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
if(a1>a0+1e-7)if(m&&a0<=1e-7&&a1>=a-1e-7){a6.a4(!0)
for(a2=p;a2<o;++a2){q=a3.a
if(!(a2>=0&&a2<q.length))return A.a(q,a2)
q=q[a2]
f=a3.b
if(!(a2<f.length))return A.a(f,a2)
a6.q(q,f[a2])}a6.a1()}else A.k9(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
k9(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.a.K(r+a,1)
p=q+1
if(!(p<s))return A.a(a4,p)
if(a4[p]<=a6)r=p
else a=q}a8.a4(!1)
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
a8.q(p,m[c])}a8.a1()},
mt(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
for(s=0,r=0;r<a9;++r){q=(r&1)===0?1:0.1
if(!(r<a8.length))return A.a(a8,r)
p=a8[r].n(b3)
if(0>=p.length)return A.a(p,0)
o=Math.max(q,p[0])
b0.$flags&2&&A.f(b0)
if(!(r<b0.length))return A.a(b0,r)
b0[r]=o
s+=o}if(s<=0)return
a8=b2.b.n(b3)
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
f=b5.aF(g+1)
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
if((a5&1)===0&&a7>a6+1e-7)A.k9(b1,j,i,h,f,g,a6,a7,b4)
a5=(a5+1)%a9
if(!(a5<a8))return A.a(b0,a5)
a4=b0[a5]}}},
k8(e4,e5,e6,e7,e8,e9,f0,f1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3
if(e5<=0)return
if(f1.a&&f1.fL(e4,e5,e6,e7,e8,e9,f0))return
s=e8*e8
r=new A.hU(new A.hT(e5,Math.max(0.12,e9*0.5),f0),f0,e5)
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
e=m.aF(g)
d=l.aF(g)
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
if(q){f0.a4(!0)
f0.q(b1+e5,b2)
r.$6(b1,b2,1,0,0,1)
r.$6(b1,b2,0,1,-1,0)
r.$6(b1,b2,-1,0,0,-1)
r.$6(b1,b2,0,-1,1,0)
f0.a1()}else if(p){f0.a4(!0)
j=b1-e5
c=b2-e5
f0.q(j,c)
b=b1+e5
f0.q(b,c)
c=b2+e5
f0.q(b,c)
f0.q(j,c)
f0.a1()}continue}b3=f?a5:a5-1
b4=o.aF(b3)
b5=n.aF(b3)
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
b5[b6]=0}}c2=new A.hS(b4,b5,e5,f0,e7,s,r)
if(f){f0.a4(!0)
for(c3=0;c3<a5;++c3){c4=B.a.M(c3-1+b3,b3)
if(!(c3<a0))return A.a(e,c3)
j=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c4,c3,j,d[c3],!1)}f0.a1()
f0.a4(!0)
for(c3=a5-1;c3>=0;c3=c5){c5=c3-1
c6=B.a.M(c5+b3,b3)
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
f0.a1()}}},
bW(a,b){var s,r,q,p,o
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
return new A.a7(s,r,q,p>o?p:o)},
iU(a,b,c,d,e,f,g,h,i){return new A.bS(a,b,c,d,e,f,g,h,i)},
me(){var s=null,r=t.n
return A.iU(A.ci(A.h([0,0],r)),A.ci(A.h([0,0],r)),A.ci(A.h([100,100],r)),A.ci(A.h([0],r)),A.ci(A.h([100],r)),s,s,s,s)},
iV(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
eg(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
jJ(a,b,c){return new A.hd(a,b,c)},
jK(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.a0(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
iO(a,b,c){return new A.a_(a,b,c)},
lX(a,b){return new A.aI(a,b)},
hX(a,b,c){if(c>0)return new A.G(a,-b)
if(c<0)return new A.G(-a,b)
return B.aB},
iQ(a,b,c,d,e,f,g,h,i,j,k){return new A.b8(a,b,c,d,e,f,g,h,i,k,j)},
lW(a,b,c,d,e,f,g,h){var s=h&&b>=32?J.iq(B.j.gaa(e),e.byteOffset,e.length/4|0):null
s=new A.hg(a,b,c,d,e,f,g,g==null?null:A.ju(a.length,null,!1,t.cn),s)
s.eg(a,b,c,d,e,f,g,h)
return s},
ci(a){var s=new Float32Array(A.R(a))
return new A.z(s,null,!1,new Float32Array(0),!1)},
md(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
mc(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
hC(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.R(s)
if(r>=4096)return 1
q=$.kU()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
b:function b(a,b){this.a=a
this.b=b},
bo:function bo(a,b){var _=this
_.a=a
_.r=_.f=_.e=_.d=_.c=_.b=$
_.w=b
_.x=1
_.y=!1
_.z=$},
fz:function fz(a){this.a=a},
fp:function fp(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
fq:function fq(a,b,c){this.a=a
this.b=b
this.c=c},
fo:function fo(a){this.a=a},
fv:function fv(a,b,c){this.a=a
this.b=b
this.c=c},
fw:function fw(a,b,c){this.a=a
this.b=b
this.c=c},
fx:function fx(a,b,c){this.a=a
this.b=b
this.c=c},
fu:function fu(a){this.a=a},
fs:function fs(){},
ft:function ft(){},
fr:function fr(a,b){this.a=a
this.b=b},
fy:function fy(){},
fF:function fF(a,b){this.a=a
this.b=b},
hr:function hr(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
e2:function e2(a){this.b=a},
fU:function fU(a){this.a=a},
fV:function fV(a,b){this.a=a
this.b=b},
fO:function fO(a,b){this.a=a
this.b=b},
fP:function fP(a,b){this.a=a
this.b=b},
fQ:function fQ(a,b){this.a=a
this.b=b},
fR:function fR(a,b){this.a=a
this.b=b},
fS:function fS(a,b){this.a=a
this.b=b},
fT:function fT(a,b){this.a=a
this.b=b},
fI:function fI(a,b){this.a=a
this.b=b},
fK:function fK(a,b){this.a=a
this.b=b},
fJ:function fJ(a,b){this.a=a
this.b=b},
fW:function fW(a,b){this.a=a
this.b=b},
fH:function fH(a,b){this.a=a
this.b=b},
fM:function fM(a,b){this.a=a
this.b=b},
fL:function fL(a,b){this.a=a
this.b=b},
fN:function fN(a,b){this.a=a
this.b=b},
b6:function b6(a,b,c,d,e,f,g,h,i){var _=this
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
ba:function ba(a,b){this.a=a
this.b=b},
bT:function bT(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$
_.as=f},
hD:function hD(){},
cc:function cc(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
fA:function fA(){},
bH:function bH(a){this.a=a},
ii:function ii(a,b,c){this.a=a
this.b=b
this.c=c},
ij:function ij(a){this.a=a},
ik:function ik(a,b,c){this.a=a
this.b=b
this.c=c},
im:function im(a,b,c){this.a=a
this.b=b
this.c=c},
il:function il(a,b,c){this.a=a
this.b=b
this.c=c},
io:function io(a,b){this.a=a
this.b=b},
ih:function ih(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
eZ:function eZ(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6){var _=this
_.b=a
_.w=_.r=_.f=0
_.x=null
_.z=_.y=!1
_.Q=b
_.as=0
_.CW=_.ch=_.ay=_.ax=_.at=null
_.cx=c
_.cy=d
_.db=e
_.dx=f
_.dy=g
_.fr=h
_.fx=i
_.fy=j
_.go=k
_.id=l
_.k1=m
_.k2=n
_.k3=o
_.k4=p
_.ok=null
_.p1=q
_.p2=r
_.p3=s
_.p4=a0
_.R8=a1
_.RG=a2
_.ry=_.rx=0
_.to=a3
_.x1=a4
_.x2=a5
_.xr=null
_.y1=a6},
f_:function f_(a,b){this.a=a
this.b=b},
f0:function f0(a){this.a=a},
f1:function f1(a){this.a=a},
f2:function f2(a){this.a=a},
bq:function bq(a){this.a=a},
ah:function ah(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
a8:function a8(a,b,c){this.a=a
this.b=b
this.$ti=c},
bK:function bK(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
az:function az(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
fX:function fX(a,b,c,d,e,f){var _=this
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
hx:function hx(){},
hw:function hw(a,b,c){this.a=a
this.b=b
this.c=c},
hz:function hz(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
hZ:function hZ(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var _=this
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
hW:function hW(a,b){this.a=a
this.b=b},
hu:function hu(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=null},
hT:function hT(a,b,c){this.a=a
this.b=b
this.c=c},
hU:function hU(a,b,c){this.a=a
this.b=b
this.c=c},
hS:function hS(a,b,c,d,e,f,g){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g},
bS:function bS(a,b,c,d,e,f,g,h,i){var _=this
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
a3:function a3(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$},
hd:function hd(a,b,c){this.a=a
this.b=b
this.c=c},
e1:function e1(a,b){this.a=a
this.b=b},
fG:function fG(){},
a0:function a0(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var _=this
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
hk:function hk(){},
hi:function hi(){},
hj:function hj(){},
hl:function hl(){},
a_:function a_(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.r=_.f=_.e=_.d=$
_.Q=_.z=null
_.at=_.as=0/0
_.ay=_.ax=$},
h9:function h9(){},
hb:function hb(){},
hc:function hc(){},
ha:function ha(){},
aI:function aI(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
hn:function hn(){},
hm:function hm(){},
e4:function e4(){},
aq:function aq(a,b,c){var _=this
_.e=a
_.f=b
_.r=c
_.c=null
_.d=0/0},
aK:function aK(a,b,c,d,e){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.c=null
_.d=0/0},
aT:function aT(a,b,c,d,e,f,g,h,i){var _=this
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
b8:function b8(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
hv:function hv(){},
hg:function hg(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
hh:function hh(){},
z:function z(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
eb:function eb(a,b){this.a=a
this.b=b},
a7:function a7(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
j7(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.T)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.r(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.bc(o)){n=o
break A}n=A.w(A.au("Unsupported raster worker field",null))}l.push(n)}return new A.G(l,m)},
ny(b9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8=null
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
p=A.r(r)
if(p){A.j(r)
q=a[2]
n=typeof q=="string"
if(n){A.H(q)
o=a[3]
a2=t.p
l=a2.b(o)
if(l){a2.a(o)
m=a[4]
j=A.bc(m)
if(j){A.bu(m)
k=a[5]
h=A.r(k)
if(h){A.j(k)
i=a[6]
b=A.r(i)
c=k}d=m}e=o}f=q}g=r}}}else{a0=b8
a1=!1}if(b){b=[0,g,f,e,d,c,A.j(h?i:b9.a[6])]
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
a1=b0}if(A.r(a)){if(a1)a=r
else{r=b9.a[1]
a=r
a1=b0}A.j(a)
if(p)a2=q
else{q=b9.a[2]
a2=q
p=b1}if(typeof a2=="string"){if(p)a2=q
else{q=b9.a[2]
a2=q
p=b1}A.H(a2)
if(n)b2=o
else{o=b9.a[3]
b2=o
n=!0}if(A.r(b2)){a5=A.j(n?o:b9.a[3])
if(l)b2=m
else{m=b9.a[4]
b2=m
l=!0}if(A.r(b2)){a6=A.j(l?m:b9.a[4])
if(j)b2=k
else{k=b9.a[5]
b2=k
j=!0}b3=t.p
if(b3.b(b2)){e=b3.a(j?k:b9.a[5])
if(h)b2=i
else{i=b9.a[6]
b2=i
h=!0}if(A.r(b2)){d=A.j(h?i:b9.a[6])
b2=b9.a
b4=b2[7]
if(A.r(b4)){A.j(b4)
b5=b2[8]
if(A.r(b5)){A.j(b5)
b6=b2[9]
if(A.r(b6)){A.j(b6)
b7=b2[10]
a4=A.r(b7)
if(a4){A.j(b7)
a3=b2[11]
b=A.r(a3)
a9=b7}a8=b6}c=b5}a7=b4}}}}}f=a2}g=a}}}if(b){b=[4,g,f,a5,a6,e,d,a7,c,a8,a9,A.j(a4?a3:b9.a[11])]
break A}b=t.k.b(b9)
g=b8
a=!1
if(b){b0=!0
if(s)a2=a0
else{a0=b9.a
a2=a0
s=!0}if(1===a2){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}if(A.r(a2)){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}A.j(a2)
if(p)a=q
else{q=b9.c
a=q
p=!0}a=typeof a=="string"
g=a2}}}if(a){b=[1,g,A.H(p?q:b9.c)]
break A}g=b8
a=!1
if(b){b0=!0
if(s)a2=a0
else{a0=b9.a
a2=a0
s=!0}if(3===a2){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}if(A.r(a2)){if(a1)a2=r
else{r=b9.b
a2=r
a1=b0}A.j(a2)
if(p)a=q
else{q=b9.c
a=q
p=!0}a=typeof a=="string"
g=a2}}}if(a){b=[3,g,A.H(p?q:b9.c)]
break A}f=b8
a=!1
if(b)if(2===(s?a0:b9.a)){if(a1)b=r
else{r=b9.b
b=r
a1=!0}if(typeof b=="string"){f=A.H(a1?r:b9.b)
if(p)b=q
else{q=b9.c
b=q
p=!0}b=A.r(b)}else b=a}else b=a
else b=a
if(b){b=[2,f,A.j(p?q:b9.c)]
break A}b=A.w(A.au("Unsupported raster worker reply",b8))}return A.j7(b)},
fe:function fe(a){this.a=a},
i7(a){var s=0,r=A.kj(t.H),q,p,o,n,m
var $async$i7=A.kp(function(b,c){if(b===1)return A.k4(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.hO(A.jb(A.t(v.G.WebAssembly.instantiate(a)),t.m),$async$i7)
case 2:o=n.t(m.t(c.instance).exports)
for(q=0;q<13;++q){p=B.ac[q]
if(!(typeof o[p]==="function"))throw A.e(A.ax("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.t(o.memory).buffer).byteLength===0)throw A.e(A.ax("FastLottie Wasm memory is empty"))
$.k=o
return A.k5(null,r)}})
return A.k6($async$i7,r)},
aM(a){var s,r,q=$.k
q.toString
s=a===0?1:a
r=A.j(q.malloc(s))
if(r<=0)throw A.e(A.ax("Could not allocate "+a+" Wasm bytes"))
B.d.T(A.iG(t.a.a(A.t($.k.memory).buffer),r,a),0,a,0)
return r},
eU(a){var s=new A.aZ(!0,a,null,null)
if($.k!=null)s.c=A.aM(a*4)
else s.d=new Uint32Array(a)
return s},
kz(a,b){var s=a.c
if(s!=null)$.k.fastlottie_clear_pixels(s,b)
else B.f.T(a.gt(),0,b,0)},
nU(a,b,c,d,e,f,g){var s,r,q=a.c
if(q!=null&&e.b!=null){s=$.k
s.toString
r=e.b
r.toString
A.df(s,"fastlottie_fill_solid_spans",[q,b,c,d,r,f,g],t.H)
return!0}return!1},
nN(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.k
s.toString
A.df(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
nO(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null)return!1
try{s=$.k
s.toString
A.df(s,"fastlottie_blend_solid",[q,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
nQ(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.k
s.toString
A.df(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
nP(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0,a1,a2,a3,a4){var s,r,q,p=a.c
if(p==null||e.b==null||g.c==null)return!1
s=$.k
s.toString
r=e.b
r.toString
q=g.c
q.toString
A.df(s,"fastlottie_gradient_spans",[p,b,c,d,r,f,q,h,i,j?1:0,k,l,m,n,o,a0,a1,a2,a3,a4],t.H)
return!0},
lA(){var s,r,q=$.k
if(q==null)return null
try{s=A.j(q.fl_dense_new())
if(!J.l(s,0)){q=A.aM(16)
return new A.eR(s,q)}}catch(r){}return null},
lz(){var s,r=$.eS
if(r!=null){$.cz=$.cz+1
return r}s=A.lA()
if(s==null)return null
$.eS=s
$.cz=1
return s},
b_:function b_(a){this.a=a
this.c=this.b=null},
aZ:function aZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
eR:function eR(a,b){var _=this
_.a=a
_.b=b
_.y=_.x=_.w=_.r=_.f=_.e=_.d=_.c=0},
eT:function eT(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
lP(c2,c3,c4,c5,c6,c7,c8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=null,c0=c8*c4,c1=c3.length
if(c8<=0||c4<=0||c0>65536||c1<2||c1>4||c7.length<c0*4)return b9
s=B.a.H(c8+16-1,16)
r=s*B.a.H(c4+16-1,16)
q=c1*r
p=new Uint16Array(q)
o=new Uint8Array(4)
B.d.T(o,0,4,255)
n=A.jE(c7,0,c0*4)
m=A.h([],t.a1)
l=A.aa(t.h6,t.L)
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
a0=B.a.a2(b,s)*16
a1=Math.min(16,c8-a)
a2=Math.min(16,c4-a0)
for(a3=2166136261,a4=0;a4<a2;++a4){a5=(a0+a4)*c8+a
for(a6=0;a6<a1;++a6){a7=a5+a6
if(!(a7>=0&&a7<j))return A.a(n,a7)
a3=((a3^n[a7])>>>0)*16777619>>>0}}a8=l.dU(new A.a1(a1,a2,a3),new A.f9())
a7=J.bv(a8)
b0=a7.gG(a8)
for(;;){if(!b0.v()){a9=-1
break}a9=b0.gB()
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
a7.m(a8,a9)
B.b.m(m,b1)}a7=d+b
if(!(a7>=0&&a7<q))return A.a(p,a7)
p[a7]=a9
if(e){a7=c+b
if(!(a7>=0&&a7<q))return A.a(p,a7)
a7=p[a7]!==a9}else a7=!1
if(a7)++i}}if(i*3>(c1-1)*r)return b9
q=A.h([],t.eS)
for(j=m.length,b8=0;b8<m.length;m.length===j||(0,A.T)(m),++b8)q.push(J.l5(B.f.gaa(m[b8])))
return new A.dQ(c8,c4,c2,o,p,q,new A.i(),k)},
f8:function f8(){this.a=null
this.b=-1},
dQ:function dQ(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.y=_.x=$},
f9:function f9(){},
nL(){var s,r,q=null,p={}
p.a=!1
s=A.t(v.G.self)
p=new A.ia(p,new A.fC(new A.c9(q,q,q,q,t.co)))
if(typeof p=="function")A.w(A.au("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.mB,p)
r[$.ip()]=p
s.onmessage=r},
i9:function i9(a,b){this.a=a
this.b=b},
ia:function ia(a,b){this.a=a
this.b=b},
fC:function fC(a){this.a=a},
bn(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.bG(b,c,B.a.a2(a.byteLength,s))
return J.c0(J.jh(a),a.byteOffset+b*s,(c-b)*s)},
jE(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.bG(b,c,B.a.a2(a.byteLength,s))-b)*s
if(B.a.M(r,4)!==0)throw A.e(A.au("The number of bytes to view must be a multiple of 4",null))
return J.l4(J.jh(a),a.byteOffset+b*s,B.a.H(r,4))},
kA(a){return v.mangledGlobalNames[a]},
nB(a,b){var s,r,q,p=a.length
if(p>=32)return A.mF(a,b)
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
mA(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
mF(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.ko
if(c7==null)c7=$.ko=A.mA(B.l)
s=c8.length
r=J.l2(B.d.gaa(c8),c8.byteOffset,s)
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
nx(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.G.fv(a,16777216,!0,!1)
if(s>16777216)throw A.e(B.Z)
return a}},B={}
var w=[A,J,B]
var $={}
A.iA.prototype={}
J.B.prototype={
E(a,b){return a===b},
gS(a){return A.cJ(a)},
p(a){return"Instance of '"+A.dJ(a)+"'"},
gX(a){return A.bX(A.iZ(this))}}
J.ct.prototype={
p(a){return String(a)},
bC(a,b){return b||a},
gS(a){return a?519018:218159},
gX(a){return A.bX(t.y)},
$iy:1,
$ip:1}
J.cv.prototype={
E(a,b){return null==b},
p(a){return"null"},
gS(a){return 0},
$iy:1,
$iW:1}
J.N.prototype={$iI:1}
J.bh.prototype={
gS(a){return 0},
p(a){return String(a)}}
J.dI.prototype={}
J.cP.prototype={}
J.am.prototype={
p(a){var s=a[$.kD()]
if(s==null)s=a[$.ip()]
if(s==null)return this.ed(a)
return"JavaScript function for "+J.bx(s)},
$ibz:1}
J.bA.prototype={
gS(a){return 0},
p(a){return String(a)}}
J.bB.prototype={
gS(a){return 0},
p(a){return String(a)}}
J.v.prototype={
m(a,b){A.a2(a).c.a(b)
a.$flags&1&&A.f(a,29)
a.push(b)},
ah(a,b){var s
A.a2(a).i("m<1>").a(b)
a.$flags&1&&A.f(a,"addAll",2)
if(Array.isArray(b)){this.eu(a,b)
return}for(s=J.co(b);s.v();)a.push(s.gB())},
eu(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.e(A.av(a))
for(r=0;r<s;++r)a.push(b[r])},
l(a){a.$flags&1&&A.f(a,"clear","clear")
a.length=0},
aE(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
eb(a,b,c){var s=a.length
if(b>s)throw A.e(A.ao(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.e(A.ao(c,b,s,"end",null))
if(b===c)return A.h([],A.a2(a))
return A.h(a.slice(b,c),A.a2(a))},
ga6(a){if(a.length>0)return a[0]
throw A.e(A.aw())},
gac(a){var s=a.length
if(s>0)return a[s-1]
throw A.e(A.aw())},
gae(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.e(A.aw())
throw A.e(A.iy())},
b1(a,b,c){a.$flags&1&&A.f(a,18)
A.bG(b,c,a.length)
a.splice(b,c-b)},
an(a,b){var s,r
A.a2(a).i("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.e(A.av(a))}return!1},
ab(a,b){var s,r
A.a2(a).i("p(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.e(A.av(a))}return!0},
gW(a){return a.length===0},
gcf(a){return a.length!==0},
p(a){return A.iz(a,"[","]")},
gG(a){return new J.by(a,a.length,A.a2(a).i("by<1>"))},
gS(a){return A.cJ(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.f(a,"set length","change the length of")
if(b<0)throw A.e(A.ao(b,0,null,"newLength",null))
if(b>a.length)A.a2(a).c.a(null)
a.length=b},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.e(A.eq(a,b))
return a[b]},
u(a,b,c){A.a2(a).c.a(c)
a.$flags&2&&A.f(a)
if(!(b>=0&&b<a.length))throw A.e(A.eq(a,b))
a[b]=c},
$im:1,
$iq:1}
J.dw.prototype={
hf(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.dJ(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.eI.prototype={}
J.by.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.T(q)
throw A.e(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$ia9:1}
J.cw.prototype={
c9(a,b){var s
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gce(b)
if(this.gce(a)===s)return 0
if(this.gce(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gce(a){return a===0?1/a<0:a<0},
Y(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.e(A.aH(""+a+".toInt()"))},
V(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.e(A.aH(""+a+".ceil()"))},
R(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.e(A.aH(""+a+".floor()"))},
D(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.e(A.aH(""+a+".round()"))},
dX(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
A(a,b,c){if(this.c9(b,c)>0)throw A.e(A.j4(b))
if(this.c9(a,b)<0)return b
if(this.c9(a,c)>0)return c
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
a2(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dh(a,b)},
H(a,b){return(a|0)===a?a/b|0:this.dh(a,b)},
dh(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.e(A.aH("Result of truncating division is "+A.u(s)+": "+A.u(a)+" ~/ "+b))},
a8(a,b){if(b<0)throw A.e(A.j4(b))
return b>31?0:a<<b>>>0},
ff(a,b){return b>31?0:a<<b>>>0},
K(a,b){var s
if(a>0)s=this.bZ(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
bZ(a,b){return b>31?0:a>>>b},
fg(a,b){if(b>31)return 0
return a>>>b},
gX(a){return A.bX(t.q)},
$id:1,
$ic_:1}
J.cu.prototype={
b2(a,b){var s=this.a8(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
gX(a){return A.bX(t.S)},
$iy:1,
$ic:1}
J.dx.prototype={
gX(a){return A.bX(t.i)},
$iy:1}
J.c4.prototype={
e9(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bF(a,b,c){return a.substring(b,A.bG(b,c,a.length))},
ec(a,b){return this.bF(a,b,null)},
ad(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.e(B.N)
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
gX(a){return A.bX(t.N)},
gk(a){return a.length},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.e(A.eq(a,b))
return a[b]},
$iy:1,
$ieY:1,
$io:1}
A.aW.prototype={
p(a){return"LateInitializationError: "+this.a}}
A.ic.prototype={
$0(){var s=new A.J($.D,t.U)
s.bI(null)
return s},
$S:28}
A.f3.prototype={}
A.aR.prototype={}
A.ab.prototype={
gG(a){var s=this
return new A.bD(s,s.gk(s),A.n(s).i("bD<ab.E>"))},
gW(a){return this.gk(this)===0}}
A.bD.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s,r=this,q=r.a,p=J.O(q),o=p.gk(q)
if(r.b!==o)throw A.e(A.av(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.aE(q,s);++r.c
return!0},
$ia9:1}
A.V.prototype={
gk(a){return J.aD(this.a)},
aE(a,b){return this.b.$1(J.l6(this.a,b))}}
A.bJ.prototype={
gG(a){return new A.cR(J.co(this.a),this.b,this.$ti.i("cR<1>"))}}
A.cR.prototype={
v(){var s,r
for(s=this.a,r=this.b;s.v();)if(r.$1(s.gB()))return!0
return!1},
gB(){return this.a.gB()},
$ia9:1}
A.E.prototype={
dr(a,b){return A.w(A.aH("Cannot "+b+" a fixed-length list"))},
sk(a,b){this.dr(a,"change the length of")},
m(a,b){A.be(a).i("E.E").a(b)
return this.dr(a,"add to")}}
A.bI.prototype={
u(a,b,c){A.n(this).i("bI.E").a(c)
throw A.e(A.aH("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.e(A.aH("Cannot change the length of an unmodifiable list"))},
m(a,b){A.n(this).i("bI.E").a(b)
throw A.e(A.aH("Cannot add to an unmodifiable list"))}}
A.d1.prototype={$r:"+(1)",$s:1}
A.bR.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:10}
A.cf.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10,11,12)",$s:12}
A.G.prototype={$r:"+(1,2)",$s:2}
A.cg.prototype={$r:"+compressedBytes,entryDiskBytes(1,2)",$s:3}
A.a1.prototype={$r:"+(1,2,3)",$s:4}
A.aL.prototype={$r:"+(1,2,3,4)",$s:7}
A.br.prototype={$r:"+(1,2,3,4,5,6)",$s:8}
A.ch.prototype={$r:"+(1,2,3,4,5,6,7)",$s:9}
A.cU.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$ia9:1}
A.cr.prototype={
m(a,b){A.n(this).c.a(b)
A.li()}}
A.K.prototype={
gk(a){return this.b},
gG(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.cU(s,s.length,r.$ti.i("cU<1>"))},
az(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.cL.prototype={}
A.fa.prototype={
ai(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.cI.prototype={
p(a){return"Null check operator used on a null value"}}
A.dz.prototype={
p(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.dS.prototype={
p(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.eW.prototype={
p(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cs.prototype={}
A.d4.prototype={
p(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iap:1}
A.bf.prototype={
p(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.kB(r==null?"unknown":r)+"'"},
$ibz:1,
ghh(){return this},
$C:"$1",
$R:1,
$D:null}
A.dl.prototype={$C:"$0",$R:0}
A.dm.prototype={$C:"$2",$R:2}
A.dP.prototype={}
A.dN.prototype={
p(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.kB(s)+"'"}}
A.c2.prototype={
E(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.c2))return!1
return this.$_target===b.$_target&&this.a===b.a},
gS(a){return(A.id(this.a)^A.cJ(this.$_target))>>>0},
p(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.dJ(this.a)+"'")}}
A.dM.prototype={
p(a){return"RuntimeError: "+this.a}}
A.aV.prototype={
gk(a){return this.a},
gW(a){return this.a===0},
gao(){return new A.U(this,A.n(this).i("U<1>"))},
aD(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.fU(a)},
fU(a){var s=this.d
if(s==null)return!1
return this.aZ(this.cR(s,a),a)>=0},
ah(a,b){A.n(this).i("ag<1,2>").a(b).aG(0,new A.eJ(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.fV(b)},
fV(a){var s,r,q=this.d
if(q==null)return null
s=this.cR(q,a)
r=this.aZ(s,a)
if(r<0)return null
return s[r].b},
u(a,b,c){var s,r,q,p,o,n,m=this,l=A.n(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cw(s==null?m.b=m.bS():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cw(r==null?m.c=m.bS():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.bS()
p=m.bt(b)
o=q[p]
if(o==null)q[p]=[m.bH(b,c)]
else{n=m.aZ(o,b)
if(n>=0)o[n].b=c
else o.push(m.bH(b,c))}}},
dU(a,b){var s,r,q=this,p=A.n(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aD(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.u(0,a,r)
return r},
J(a,b){var s=this
if(typeof b=="string")return s.cz(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cz(s.c,b)
else return s.fW(b)},
fW(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bt(a)
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
s.bG()}},
aG(a,b){var s,r,q=this
A.n(q).i("~(1,2)").a(b)
s=q.e
r=q.r
while(s!=null){b.$2(s.a,s.b)
if(r!==q.r)throw A.e(A.av(q))
s=s.c}},
cw(a,b,c){var s,r=A.n(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bH(b,c)
else s.b=c},
cz(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.cA(s)
delete a[b]
return s.b},
bG(){this.r=this.r+1&1073741823},
bH(a,b){var s=this,r=A.n(s),q=new A.eM(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bG()
return q},
cA(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bG()},
bt(a){return J.aP(a)&1073741823},
cR(a,b){return a[this.bt(b)]},
aZ(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1},
p(a){return A.jv(this)},
bS(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$iiC:1}
A.eJ.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.u(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.n(this.a).i("~(1,2)")}}
A.eM.prototype={}
A.U.prototype={
gk(a){return this.a.a},
gW(a){return this.a.a===0},
gG(a){var s=this.a
return new A.cy(s,s.r,s.e,this.$ti.i("cy<1>"))}}
A.cy.prototype={
gB(){return this.d},
v(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.av(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$ia9:1}
A.eN.prototype={
gk(a){return this.a.a},
gW(a){return this.a.a===0},
gG(a){var s=this.a
return new A.aE(s,s.r,s.e,this.$ti.i("aE<1>"))}}
A.aE.prototype={
gB(){return this.d},
v(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.av(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$ia9:1}
A.bC.prototype={
gk(a){return this.a.a},
gW(a){return this.a.a===0},
gG(a){var s=this.a
return new A.cx(s,s.r,s.e,this.$ti.i("cx<1,2>"))}}
A.cx.prototype={
gB(){var s=this.d
s.toString
return s},
v(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.e(A.av(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.bi(s.a,s.b,r.$ti.i("bi<1,2>"))
r.c=s.c
return!0}},
$ia9:1}
A.af.prototype={
bt(a){return A.id(a)&1073741823},
aZ(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.i4.prototype={
$1(a){return this.a(a)},
$S:20}
A.i5.prototype={
$2(a,b){return this.a(a,b)},
$S:55}
A.i6.prototype={
$1(a){return this.a(A.H(a))},
$S:15}
A.a4.prototype={
p(a){return this.dk(!1)},
dk(a){var s,r,q,p,o,n=this.eN(),m=this.aT(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.jx(o):l+A.u(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
eN(){var s,r=this.$s
while($.hp.length<=r)B.b.m($.hp,null)
s=$.hp[r]
if(s==null){s=this.eD()
B.b.u($.hp,r,s)}return s},
eD(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.h(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.b.u(k,q,r[s])}}k=A.lv(k,!1,t.K)
k.$flags=3
return k}}
A.bQ.prototype={
aT(){return[this.a,this.b]},
E(a,b){if(b==null)return!1
return b instanceof A.bQ&&this.$s===b.$s&&J.l(this.a,b.a)&&J.l(this.b,b.b)},
gS(a){return A.eX(this.$s,this.a,this.b,B.n)}}
A.cd.prototype={
aT(){return[this.a]},
E(a,b){if(b==null)return!1
return b instanceof A.cd&&this.$s===b.$s&&J.l(this.a,b.a)},
gS(a){return A.eX(this.$s,this.a,B.n,B.n)}}
A.ce.prototype={
aT(){return[this.a,this.b,this.c]},
E(a,b){var s=this
if(b==null)return!1
return b instanceof A.ce&&s.$s===b.$s&&J.l(s.a,b.a)&&J.l(s.b,b.b)&&J.l(s.c,b.c)},
gS(a){var s=this
return A.eX(s.$s,s.a,s.b,s.c)}}
A.aU.prototype={
aT(){return this.a},
E(a,b){if(b==null)return!1
return b instanceof A.aU&&this.$s===b.$s&&A.m5(this.a,b.a)},
gS(a){return A.eX(this.$s,A.lE(this.a),B.n,B.n)}}
A.dy.prototype={
p(a){return"RegExp/"+this.a+"/"+this.b.flags},
geX(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.js(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
dL(a){var s=this.b.exec(a)
if(s==null)return null
return new A.cW(s)},
dw(a,b){return new A.dU(this,b,0)},
eL(a,b){var s,r=this.geX()
if(r==null)r=A.aN(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.cW(s)},
$ieY:1,
$ilK:1}
A.cW.prototype={
h(a,b){var s
A.j(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$idK:1}
A.dU.prototype={
gG(a){return new A.c8(this.a,this.b,this.c)}}
A.c8.prototype={
gB(){var s=this.d
return s==null?t.d.a(s):s},
v(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.eL(l,s)
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
$ia9:1}
A.fn.prototype={
am(){var s=this.b
if(s===this)throw A.e(new A.aW("Local '' has not been initialized."))
return s},
sdK(a){if(this.b!==this)throw A.e(new A.aW("Local '' has already been initialized."))
this.b=a}}
A.bj.prototype={
gX(a){return B.b4},
bs(a,b,c){A.bb(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dD(a){return this.bs(a,0,null)},
dC(a,b,c){A.bb(a,b,c)
if(c==null)c=B.a.H(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dB(a,b,c){A.bb(a,b,c)
if(c==null)c=B.a.H(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dA(a,b,c){if(B.a.M(b,16)!==0)A.w(A.jy("Offset ("+b+") must be a multiple of BYTES_PER_ELEMENT (16)"))
return new A.cA(A.lC(a,b,(c==null?B.a.H(a.byteLength-b,16):c)*4))},
dz(a,b,c){A.bb(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iy:1,
$ibj:1}
A.c5.prototype={$ic5:1}
A.cA.prototype={
gX(a){return B.b7},
gk(a){return this.a.length/4|0},
h(a,b){var s,r,q,p,o,n,m
A.j(b)
s=this.a
r=s.length
A.aO(b,this,r/4|0)
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
return new A.aF(p,n,m,s[q])},
u(a,b,c){var s,r,q,p
t.Y.a(c)
s=this.a
r=s.length
A.aO(b,this,r/4|0)
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
$iq:1,
$ieA:1}
A.eh.prototype={}
A.cF.prototype={
gaa(a){if(((a.$flags|0)&2)!==0)return new A.hG(a.buffer)
else return a.buffer},
eU(a,b,c,d){var s=A.ao(b,0,c,d,null)
throw A.e(s)},
cG(a,b,c,d){if(b>>>0!==b||b>c)this.eU(a,b,c,d)}}
A.hG.prototype={
bs(a,b,c){var s=A.iG(this.a,b,c)
s.$flags=3
return s},
dD(a){return this.bs(0,0,null)},
dC(a,b,c){var s=A.iF(this.a,b,c)
s.$flags=3
return s},
dB(a,b,c){var s=A.iE(this.a,b,c)
s.$flags=3
return s},
dA(a,b,c){return new A.eh(J.iq(this.a,b,c).a)},
dz(a,b,c){var s=A.ly(this.a,b,c)
s.$flags=3
return s}}
A.dC.prototype={
gX(a){return B.b5},
$iy:1}
A.a6.prototype={
gk(a){return a.length},
d9(a,b,c,d,e){var s,r,q=a.length
this.cG(a,b,q,"start")
this.cG(a,c,q,"end")
if(b>c)throw A.e(A.ao(b,0,c,null,null))
s=c-b
if(e<0)throw A.e(A.au(e,null))
r=d.length
if(r-e<s)throw A.e(A.ax("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$ian:1}
A.cD.prototype={
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
u(a,b,c){A.Q(c)
a.$flags&2&&A.f(a)
A.aO(b,a,a.length)
a[b]=c},
P(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.f(a,5)
this.d9(a,b,c,d,e)
return},
L(a,b,c,d){return this.P(a,b,c,d,0)},
$im:1,
$iq:1}
A.cE.prototype={
u(a,b,c){A.j(c)
a.$flags&2&&A.f(a)
A.aO(b,a,a.length)
a[b]=c},
P(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.f(a,5)
this.d9(a,b,c,d,e)
return},
L(a,b,c,d){return this.P(a,b,c,d,0)},
$im:1,
$iq:1}
A.c6.prototype={
gX(a){return B.b6},
$iy:1,
$ic6:1,
$ibg:1}
A.cB.prototype={
gX(a){return B.b8},
$iy:1,
$ieB:1}
A.dD.prototype={
gX(a){return B.b9},
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
$iy:1}
A.cC.prototype={
gX(a){return B.ba},
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
$iy:1,
$iix:1}
A.dF.prototype={
gX(a){return B.bb},
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
$iy:1}
A.dG.prototype={
gX(a){return B.bd},
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
$iy:1,
$iiK:1}
A.cG.prototype={
gX(a){return B.be},
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
$iy:1,
$icO:1}
A.cH.prototype={
gX(a){return B.bf},
gk(a){return a.length},
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
$iy:1}
A.bE.prototype={
gX(a){return B.bg},
gk(a){return a.length},
h(a,b){A.j(b)
A.aO(b,a,a.length)
return a[b]},
$iy:1,
$ibE:1,
$ibm:1}
A.aF.prototype={
ad(a,b){var s,r,q,p,o=this
t.Y.a(b)
s=$.dh()
s.$flags&2&&A.f(s)
s[0]=o.a*b.a
r=s[0]
s[0]=o.b*b.b
q=s[0]
s[0]=o.c*b.c
p=s[0]
s[0]=o.d*b.d
return new A.aF(r,q,p,s[0])},
cu(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.dh()
k.$flags&2&&A.f(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.aF(s,r,q,k[0])},
p(a){return"V128"},
$ia5:1}
A.e8.prototype={}
A.e9.prototype={}
A.cX.prototype={}
A.cY.prototype={}
A.cZ.prototype={}
A.d_.prototype={}
A.ei.prototype={}
A.aG.prototype={
i(a){return A.db(v.typeUniverse,this,a)},
a3(a){return A.jZ(v.typeUniverse,this,a)}}
A.e3.prototype={}
A.hE.prototype={
p(a){return A.ai(this.a,null)}}
A.e0.prototype={
p(a){return this.a}}
A.cj.prototype={$ib3:1}
A.fj.prototype={
$1(a){var s=this.a,r=s.a
s.a=null
r.$0()},
$S:5}
A.fi.prototype={
$1(a){var s,r
this.a.a=t.O.a(a)
s=this.b
r=this.c
s.firstChild?s.removeChild(r):s.appendChild(r)},
$S:32}
A.fk.prototype={
$0(){this.a.$0()},
$S:6}
A.fl.prototype={
$0(){this.a.$0()},
$S:6}
A.hA.prototype={
ei(a,b){if(self.setTimeout!=null)self.setTimeout(A.dg(new A.hB(this,b),0),a)
else throw A.e(A.aH("`setTimeout()` not found."))}}
A.hB.prototype={
$0(){this.b.$0()},
$S:0}
A.dV.prototype={}
A.hP.prototype={
$1(a){return this.a.$2(0,a)},
$S:3}
A.hQ.prototype={
$2(a,b){this.a.$2(1,new A.cs(a,t.l.a(b)))},
$S:22}
A.i0.prototype={
$2(a,b){this.a(A.j(a),b)},
$S:26}
A.ak.prototype={
p(a){return A.u(this.a)},
$iL:1,
gaR(){return this.b}}
A.dZ.prototype={
dH(a){var s=this.a
if((s.a&30)!==0)throw A.e(A.ax("Future already completed"))
s.ba(A.mS(a,null))}}
A.cS.prototype={}
A.b5.prototype={
h1(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.bp(s,t.al.a(this.d),a.a,t.y,t.K)},
fO(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.fc(l,q,m,a.b,o,n,t.l)
else p=l.bp(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.G.b(A.ad(s))){if((r.c&1)!==0)throw A.e(A.au("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.e(A.au("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.J.prototype={
ck(a,b,c){var s,r,q,p=this.$ti
p.a3(c).i("1/(2)").a(a)
s=$.D
if(s===B.k){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.e(A.jk(b,"onError",u.c))}else{r=p.c
a=s.bm(s,c.i("@<0/>").a3(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.nc(b,s)}q=new A.J(s,c.i("J<0>"))
r=b==null?1:3
this.b9(new A.b5(q,r,a,b,p.i("@<1>").a3(c).i("b5<1,2>")))
return q},
di(a,b,c){var s,r=this.$ti
r.a3(c).i("1/(2)").a(a)
s=new A.J($.D,c.i("J<0>"))
this.b9(new A.b5(s,19,a,b,r.i("@<1>").a3(c).i("b5<1,2>")))
return s},
cn(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.D
q=new A.J(r,s)
if(r!==B.k)a=r.bl(r,a,t.z)
this.b9(new A.b5(q,8,a,null,s.i("b5<1,1>")))
return q},
fd(a){this.a=this.a&1|16
this.c=a},
bb(a){this.a=a.a&30|this.a&1
this.c=a.c},
b9(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.b9(a)
return}r.bb(s)}q=r.b
q.aW(q,new A.fY(r,a))}},
d2(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.d2(a)
return}m.bb(n)}l.a=m.bo(a)
s=m.b
s.aW(s,new A.h1(l,m))}},
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
A.bN(r,s)},
eC(a){var s=this.aV()
this.bb(a)
A.bN(this,s)},
bc(a){var s=this.aV()
this.fd(a)
A.bN(this,s)},
eB(a,b){A.aN(a)
t.l.a(b)
this.bc(new A.ak(a,b))},
bI(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("al<1>").b(a)){this.cF(a)
return}this.ex(a)},
ex(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.aW(s,new A.h_(r,a))},
cF(a){A.iN(this.$ti.i("al<1>").a(a),this,!1)
return},
ba(a){var s
this.a^=2
s=this.b
s.aW(s,new A.fZ(this,a))},
$ial:1}
A.fY.prototype={
$0(){A.bN(this.a,this.b)},
$S:0}
A.h1.prototype={
$0(){A.bN(this.b,this.a.a)},
$S:0}
A.h0.prototype={
$0(){A.iN(this.a.a,this.b,!0)},
$S:0}
A.h_.prototype={
$0(){this.a.cJ(this.b)},
$S:0}
A.fZ.prototype={
$0(){this.a.bc(this.b)},
$S:0}
A.h4.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bq(p,t.fO.a(q.d),t.z)}catch(o){s=A.ad(o)
r=A.bd(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.iu(q)
n=k.a
n.c=new A.ak(q,p)
q=n}q.b=!0
return}if(j instanceof A.J&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.J){m=k.b.a
l=new A.J(m.b,m.$ti)
j.ck(new A.h5(l,m),new A.h6(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.h5.prototype={
$1(a){this.a.eC(this.b)},
$S:5}
A.h6.prototype={
$2(a,b){A.aN(a)
t.l.a(b)
this.a.bc(new A.ak(a,b))},
$S:54}
A.h3.prototype={
$0(){var s,r,q,p,o,n,m,l,k
try{q=this.a
p=q.a
o=p.$ti
n=o.c
m=n.a(this.b)
l=p.b.b
q.c=l.bp(l,o.i("2/(1)").a(p.d),m,o.i("2/"),n)}catch(k){s=A.ad(k)
r=A.bd(k)
q=s
p=r
if(p==null)p=A.iu(q)
o=this.a
o.c=new A.ak(q,p)
o.b=!0}},
$S:0}
A.h2.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.h1(s)&&p.a.e!=null){p.c=p.a.fO(s)
p.b=!1}}catch(o){r=A.ad(o)
q=A.bd(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.iu(p)
m=l.b
m.c=new A.ak(p,n)
p=m}p.b=!0}},
$S:0}
A.dW.prototype={}
A.cN.prototype={
gk(a){var s={},r=new A.J($.D,t.fJ)
s.a=0
this.dQ(new A.f5(s,this),!0,new A.f6(s,r),r.geA())
return r}}
A.f5.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.f6.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.aV()
r.c.a(q)
s.a=8
s.c=q
A.bN(s,p)},
$S:0}
A.d5.prototype={
gf0(){var s,r=this
if((r.b&8)===0)return A.n(r).i("aJ<1>?").a(r.a)
s=A.n(r)
return s.i("aJ<1>?").a(s.i("d6<1>").a(r.a).gc3())},
cO(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aJ(A.n(q).i("aJ<1>"))
return A.n(q).i("aJ<1>").a(s)}r=A.n(q)
s=r.i("d6<1>").a(q.a).gc3()
return r.i("aJ<1>").a(s)},
gde(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gc3()
return A.n(this).i("cb<1>").a(s)},
cE(){if((this.b&4)!==0)return new A.bl("Cannot add event after closing")
return new A.bl("Cannot add event while adding a stream")},
cN(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.jd():new A.J($.D,t.U)
return s},
c7(){var s=this,r=s.b
if((r&4)!==0)return s.cN()
if(r>=4)throw A.e(s.cE())
r=s.b=r|4
if((r&1)!==0)s.bY()
else if((r&3)===0)s.cO().m(0,B.y)
return s.cN()},
fh(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.n(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.e(A.ax("Stream has already been listened to."))
s=h.c
r=$.D
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.bm(r,t.a7.a3(s).i("1(2)").a(a),o,s)
A.lV(r,b)
n=c==null?A.nq():c
m=t.O
l=new A.cb(i,s,r.bl(r,m.a(n),o),r,q|p,h.i("cb<1>"))
k=i.gf0()
if(((i.b|=1)&8)!==0){j=h.i("d6<1>").a(i.a)
j.sc3(l)
j.h8()}else i.a=l
l.fe(k)
h=m.a(new A.ht(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cH((s&4)!==0)
return l},
f4(a){var s,r,q,p,o,n,m,l,k=this,j=A.n(k)
j.i("dO<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("d6<1>").a(k.a).hk()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.J)s=q}catch(n){p=A.ad(n)
o=A.bd(n)
m=new A.J($.D,t.U)
j=A.aN(p)
l=t.l.a(o)
m.ba(new A.ak(j,l))
s=m}else s=s.cn(r)
j=new A.hs(k)
if(s!=null)s=s.cn(j)
else j.$0()
return s},
$ijB:1,
$ijO:1,
$ibM:1,
$ijA:1}
A.ht.prototype={
$0(){A.j2(this.a.d)},
$S:0}
A.hs.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bI(null)},
$S:0}
A.dX.prototype={
bX(a){var s=this.$ti
s.c.a(a)
this.gde().cD(new A.bL(a,s.i("bL<1>")))},
bY(){this.gde().cD(B.y)}}
A.c9.prototype={}
A.ca.prototype={
gS(a){return(A.cJ(this.a)^892482866)>>>0},
E(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.ca&&b.a===this.a}}
A.cb.prototype={
cZ(){return this.w.f4(this)},
d_(){var s=this.w,r=A.n(s)
r.i("dO<1>").a(this)
if((s.b&8)!==0)r.i("d6<1>").a(s.a).ho()
A.j2(s.e)},
d0(){var s=this.w,r=A.n(s)
r.i("dO<1>").a(this)
if((s.b&8)!==0)r.i("d6<1>").a(s.a).h8()
A.j2(s.f)}}
A.cT.prototype={
fe(a){var s=this
A.n(s).i("aJ<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bD(s)}},
d_(){},
d0(){},
cZ(){return null},
cD(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aJ(A.n(r).i("aJ<1>"))
q.m(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bD(r)}},
bX(a){var s,r=this,q=A.n(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.ha(r.a,a,q)
r.e&=4294967231
r.cH((s&4)!==0)},
bY(){var s,r=this,q=new A.fm(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.cZ()
r.e|=16
if(p!=null&&p!==$.jd())p.cn(q)
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
if(r)q.d_()
else q.d0()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bD(q)},
$idO:1,
$ibM:1}
A.fm.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.h9(s.c)
s.e&=4294967231},
$S:0}
A.d7.prototype={
dQ(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.fh(s.i("~(1)?").a(a),d,c,b===!0)},
fZ(a){return this.dQ(a,null,null,null)}}
A.bp.prototype={
sb_(a){this.a=t.ev.a(a)},
gb_(){return this.a}}
A.bL.prototype={
dS(a){this.$ti.i("bM<1>").a(a).bX(this.b)}}
A.e_.prototype={
dS(a){a.bY()},
gb_(){return null},
sb_(a){throw A.e(A.ax("No events after a done."))},
$ibp:1}
A.aJ.prototype={
bD(a){var s,r=this
r.$ti.i("bM<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.nT(new A.ho(r,a))
r.a=1},
m(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sb_(b)
s.c=b}}}
A.ho.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("bM<1>").a(this.b)
r=p.b
q=r.gb_()
p.b=q
if(q==null)p.c=null
r.dS(s)},
$S:0}
A.ec.prototype={}
A.fg.prototype={
h9(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.bq(o,a,t.H)
return q}catch(p){s=A.ad(p)
r=A.bd(p)
o.aU(o,s,r)}},
ha(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.bp(o,a,b,t.H,c)
return q}catch(p){s=A.ad(p)
r=A.bd(p)
o.aU(o,s,r)}},
fp(a,b){return new A.fh(this,this.bl(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.ghn(null).h(0,b)
return s}return null},
aU(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.ne(b,c)
return}r=s.gco()
q=r.ghj()
p=$.D
try{$.D=q
s.fN(r,r.gbU(),a,b,c)
$.D=p}catch(m){o=A.ad(m)
n=A.bd(m)
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
return null.hl(q,q.gbU(),a,b)},
bp(a,b,c,d,e){var s,r,q
d.i("@<0>").a3(e).i("1(2)").a(b)
e.a(c)
r=$.D
if(r===a)return b.$1(c)
s=r
$.D=a
try{r=b.$1(c)
return r}finally{$.D=s}q=null.gco()
return null.fN(q,q.gbU(),a,b,c)},
fc(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").a3(f).a3(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.D
if(r===a)return b.$2(c,d)
s=r
$.D=a
try{r=b.$2(c,d)
return r}finally{$.D=s}q=null.gco()
return null.hm(q,q.gbU(),a,b,c,d)},
bl(a,b,c){c.i("0()").a(b)
return b},
bm(a,b,c,d){c.i("@<0>").a3(d).i("1(2)").a(b)
return b},
bW(a,b,c,d,e){c.i("@<0>").a3(d).a3(e).i("1(2,3)").a(b)
return b},
eK(a,b,c){return null},
aW(a,b){A.j1(a,t.O.a(b))
return}}
A.fh.prototype={
$0(){var s=this.a
return s.bq(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.i_.prototype={
$0(){A.lk(this.a,this.b)},
$S:0}
A.b7.prototype={
gG(a){var s=this,r=new A.cV(s,s.r,A.n(s).i("cV<1>"))
r.c=s.e
return r},
gk(a){return this.a},
az(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.eE(b)},
eE(a){var s=this.d
if(s==null)return!1
return this.bi(s[this.bd(a)],a)>=0},
ga6(a){var s=this.e
if(s==null)throw A.e(A.ax("No elements"))
return A.n(this).c.a(s.a)},
m(a,b){var s,r,q=this
A.n(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cC(s==null?q.b=A.iP():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cC(r==null?q.c=A.iP():r,b)}else return q.es(b)},
es(a){var s,r,q,p=this
A.n(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.iP()
r=p.bd(a)
q=s[r]
if(q==null)s[r]=[p.bT(a)]
else{if(p.bi(q,a)>=0)return!1
q.push(p.bT(a))}return!0},
J(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.d4(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.d4(s.c,b)
else return s.f6(b)},
f6(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bd(a)
r=n[s]
q=o.bi(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dq(p)
return!0},
eO(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("p(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.e(A.av(n))
if(!0===o)n.J(0,r)}},
cC(a,b){A.n(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.bT(b)
return!0},
d4(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dq(s)
delete a[b]
return!0},
bR(){this.r=this.r+1&1073741823},
bT(a){var s,r=this,q=new A.e7(A.n(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.bR()
return q},
dq(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.bR()},
bd(a){return J.aP(a)&1073741823},
bi(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.l(a[r].a,b))return r
return-1}}
A.bO.prototype={
bd(a){return A.id(a)&1073741823},
bi(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.e7.prototype={}
A.cV.prototype={
gB(){var s=this.d
return s==null?this.$ti.c.a(s):s},
v(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.e(A.av(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$ia9:1}
A.A.prototype={
gG(a){return new A.bD(a,this.gk(a),A.be(a).i("bD<A.E>"))},
aE(a,b){return this.h(a,b)},
gW(a){return this.gk(a)===0},
gcf(a){return!this.gW(a)},
ga6(a){if(this.gk(a)===0)throw A.e(A.aw())
return this.h(a,0)},
gac(a){if(this.gk(a)===0)throw A.e(A.aw())
return this.h(a,this.gk(a)-1)},
gae(a){if(this.gk(a)===0)throw A.e(A.aw())
if(this.gk(a)>1)throw A.e(A.iy())
return this.h(a,0)},
an(a,b){var s,r
A.be(a).i("p(A.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.e(A.av(a))}return!1},
m(a,b){var s
A.be(a).i("A.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.u(a,s,b)},
T(a,b,c,d){var s,r,q=A.be(a)
q.i("A.E?").a(d)
s=d==null?q.i("A.E").a(d):d
A.bG(b,c,this.gk(a))
for(r=b;r<c;++r)this.u(a,r,s)},
p(a){return A.iz(a,"[","]")}}
A.F.prototype={
aG(a,b){var s,r,q,p=A.n(this)
p.i("~(F.K,F.V)").a(b)
for(s=this.gao(),s=s.gG(s),p=p.i("F.V");s.v();){r=s.gB()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ah(a,b){A.n(this).i("ag<F.K,F.V>").a(b).aG(0,new A.eP(this))},
bx(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("p(F.K,F.V)").a(b)
s=A.h([],m.i("v<F.K>"))
for(r=n.gao(),r=r.gG(r),m=m.i("F.V");r.v();){q=r.gB()
p=n.h(0,q)
if(b.$2(q,p==null?m.a(p):p))B.b.m(s,q)}for(m=s.length,o=0;o<s.length;s.length===m||(0,A.T)(s),++o)n.J(0,s[o])},
gk(a){var s=this.gao()
return s.gk(s)},
gW(a){var s=this.gao()
return s.gW(s)},
p(a){return A.jv(this)},
$iag:1}
A.eP.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.u(0,r.i("F.K").a(a),r.i("F.V").a(b))},
$S(){return A.n(this.a).i("~(F.K,F.V)")}}
A.eQ.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.u(a)
r.a=(r.a+=s)+": "
s=A.u(b)
r.a+=s},
$S:14}
A.b1.prototype={
ah(a,b){var s
A.n(this).i("m<1>").a(b)
for(s=b.gG(b);s.v();)this.m(0,s.gB())},
p(a){return A.iz(this,"{","}")},
$im:1,
$iaS:1}
A.d3.prototype={}
A.e5.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.f1(b):s}},
gk(a){return this.b==null?this.c.a:this.aI().length},
gW(a){return this.gk(0)===0},
gao(){if(this.b==null){var s=this.c
return new A.U(s,A.n(s).i("U<1>"))}return new A.e6(this)},
u(a,b,c){var s,r,q=this
A.H(b)
if(q.b==null)q.c.u(0,b,c)
else if(q.aD(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.ds().u(0,b,c)},
ah(a,b){t.P.a(b).aG(0,new A.hf(this))},
aD(a){if(this.b==null)return this.c.aD(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
J(a,b){if(this.b!=null&&!this.aD(b))return null
return this.ds().J(0,b)},
l(a){var s,r=this
if(r.b==null)r.c.l(0)
else{if(r.c!=null)B.b.l(r.aI())
r.a=r.b=null
s=t.z
r.c=A.aa(s,s)}},
aG(a,b){var s,r,q,p,o=this
t.cA.a(b)
if(o.b==null)return o.c.aG(0,b)
s=o.aI()
for(r=0;r<s.length;++r){q=s[r]
p=o.b[q]
if(typeof p=="undefined"){p=A.hR(o.a[q])
o.b[q]=p}b.$2(q,p)
if(s!==o.c)throw A.e(A.av(o))}},
aI(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.h(Object.keys(this.a),t.s)
return s},
ds(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.aa(t.N,t.z)
r=n.aI()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.u(0,o,n.h(0,o))}if(p===0)B.b.m(r,"")
else B.b.l(r)
n.a=n.b=null
return n.c=s},
f1(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.hR(this.a[a])
return this.b[a]=s}}
A.hf.prototype={
$2(a,b){this.a.u(0,A.H(a),b)},
$S:75}
A.e6.prototype={
gk(a){return this.a.gk(0)},
aE(a,b){var s=this.a
if(s.b==null)s=s.gao().aE(0,b)
else{s=s.aI()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gG(a){var s=this.a
if(s.b==null){s=s.gao()
s=s.gG(s)}else{s=s.aI()
s=new J.by(s,s.length,A.a2(s).i("by<1>"))}return s}}
A.hJ.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:true})
return s}catch(r){}return null},
$S:9}
A.hI.prototype={
$0(){var s,r
try{s=new TextDecoder("utf-8",{fatal:false})
return s}catch(r){}return null},
$S:9}
A.c3.prototype={}
A.dp.prototype={}
A.dq.prototype={}
A.dA.prototype={
dJ(a,b){var s=A.n8(a,this.gfE().a)
return s},
gfE(){return B.a6}}
A.eK.prototype={}
A.dT.prototype={
fu(a){t.L.a(a)
return B.bh.fs(a)}}
A.fd.prototype={
fs(a){return new A.hH(this.a).eF(t.L.a(a),0,null,!0)}}
A.hH.prototype={
eF(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.bG(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.mr(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.mq(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bL(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.ms(o)
l.b=0
throw A.e(A.dr(m,a,p+l.c))}return n},
bL(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.H(b+c,2)
r=q.bL(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bL(a,s,c,d)}return q.fw(a,b,c,d)},
fw(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.c7(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.cK(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.cK(h)
e.a+=p
break
case 65:p=A.cK(h)
e.a+=p;--d
break
default:p=A.cK(h)
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
p=A.cK(a[l])
e.a+=p}else{p=A.lN(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.cK(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.fD.prototype={
p(a){return this.eJ()}}
A.L.prototype={
gaR(){return A.lF(this)}}
A.dj.prototype={
p(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.ey(s)
return"Assertion failed"}}
A.b3.prototype={}
A.aQ.prototype={
gbO(){return"Invalid argument"+(!this.a?"(s)":"")},
gbN(){return""},
p(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.u(p),n=s.gbO()+q+o
if(!s.a)return n
return n+s.gbN()+": "+A.ey(s.gcc())},
gcc(){return this.b}}
A.b0.prototype={
gcc(){return A.k3(this.b)},
gbO(){return"RangeError"},
gbN(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.u(q):""
else if(q==null)s=": Not greater than or equal to "+A.u(r)
else if(q>r)s=": Not in inclusive range "+A.u(r)+".."+A.u(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.u(r)
return s}}
A.ds.prototype={
gcc(){return A.j(this.b)},
gbO(){return"RangeError"},
gbN(){if(A.j(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ib0:1,
gk(a){return this.f}}
A.cQ.prototype={
p(a){return"Unsupported operation: "+this.a}}
A.dR.prototype={
p(a){return"UnimplementedError: "+this.a}}
A.bl.prototype={
p(a){return"Bad state: "+this.a}}
A.dn.prototype={
p(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.ey(s)+"."}}
A.dH.prototype={
p(a){return"Out of Memory"},
gaR(){return null},
$iL:1}
A.cM.prototype={
p(a){return"Stack Overflow"},
gaR(){return null},
$iL:1}
A.fE.prototype={
p(a){return"Exception: "+this.a}}
A.X.prototype={
p(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
if(typeof e=="string"){if(f!=null)s=f<0||f>e.length
else s=!1
if(s)f=null
if(f==null){if(e.length>78)e=B.p.bF(e,0,75)+"..."
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
k=""}return g+l+B.p.bF(e,i,j)+k+"\n"+B.p.ad(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.u(f)+")"):g}}
A.m.prototype={
an(a,b){var s
A.n(this).i("p(m.E)").a(b)
for(s=this.gG(this);s.v();)if(b.$1(s.gB()))return!0
return!1},
gk(a){var s,r=this.gG(this)
for(s=0;r.v();)++s
return s},
gW(a){return!this.gG(this).v()},
gcf(a){return!this.gW(this)},
ga6(a){var s=this.gG(this)
if(!s.v())throw A.e(A.aw())
return s.gB()},
gac(a){var s,r=this.gG(this)
if(!r.v())throw A.e(A.aw())
do s=r.gB()
while(r.v())
return s},
gae(a){var s,r=this.gG(this)
if(!r.v())throw A.e(A.aw())
s=r.gB()
if(r.v())throw A.e(A.iy())
return s},
aE(a,b){var s,r
A.iI(b,"index")
s=this.gG(this)
for(r=b;s.v();){if(r===0)return s.gB();--r}throw A.e(A.jr(b,b-r,this,"index"))},
p(a){return A.lo(this,"(",")")}}
A.bi.prototype={
p(a){return"MapEntry("+A.u(this.a)+": "+A.u(this.b)+")"}}
A.W.prototype={
gS(a){return A.i.prototype.gS.call(this,0)},
p(a){return"null"}}
A.i.prototype={$ii:1,
E(a,b){return this===b},
gS(a){return A.cJ(this)},
p(a){return"Instance of '"+A.dJ(this)+"'"},
gX(a){return A.nC(this)},
toString(){return this.p(this)}}
A.ed.prototype={
p(a){return""},
$iap:1}
A.c7.prototype={
gk(a){return this.a.length},
p(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.eV.prototype={
p(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.eE.prototype={
$2(a,b){var s=t.g
this.a.ck(new A.eC(s.a(a)),new A.eD(s.a(b)),t.X)},
$S:16}
A.eC.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:17}
A.eD.prototype={
$2(a,b){var s=A.mE(A.aN(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:18}
A.ie.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.w(A.ax("Future already completed"))
s.bI(r.i("1/").a(a))
return null},
$S:3}
A.ig.prototype={
$1(a){if(a==null)return this.a.dH(new A.eV(a===undefined))
return this.a.dH(a)},
$S:3}
A.eF.prototype={
fv(a,b,c,d){var s
t.L.a(a)
s=A.iH(32768)
this.fC(A.iw(a,B.o,null,null),s,b,!0,!1)
return s.b3()},
fC(a,b,c,d,e){return A.nw(b,c,new A.eG(a,!1,!0))}}
A.eG.prototype={
$1(a){return B.P.fB(this.a,a,this.c,this.b)},
$S:19}
A.h7.prototype={
fD(a,b,c,d,e){var s,r,q,p=d===!0,o=a.a
a.a=B.o
r=p
s=r
try{q=A.kv("gzip",!1,p,new A.h8(this,a,b,!1,!1,s))
return q}finally{a.sdE(o)}},
fB(a,b,c,d){return this.fD(a,b,!1,c,d)},
eH(a,b,c,d,e){var s,r,q,p,o,n=0
for(;;){s=a.c
r=a.d
r===$&&A.C()
if(!(s<r))break
if(!this.f3(a,e)){if(n!==0)return!1
a.c=s
return B.Q.fA(a,b,!1,!1)}q=b.gk(b)
p=new A.dt(a,b,!0)
p.cV()
if(!p.f)return!1
s=a.b
if((s==null?0:s.length-a.c)<8)return!1
a.b0()
o=a.b0()
b.dM()
if(B.a.M(b.gk(b)-q,4294967296)!==o)return!1;++n}return n!==0},
f3(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gk(0)<10)return!1
s=a.c
if(a.bw()!==35615)return!1
if(a.aj()!==8)return!1
r=a.aj()
if(b&&(r&224)!==0)return!1
a.b0()
a.aj()
a.aj()
if((r&4)!==0){if(a.gk(0)<2)return!1
q=a.bw()
if(a.gk(0)<q)return!1
a.dV(q)}if((r&8)!==0)if(!this.da(a))return!1
if((r&16)!==0)if(!this.da(a))return!1
if((r&2)!==0){if(a.gk(0)<2)return!1
if(b){p=a.bw()
o=a.bE(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.C()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bE(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.nB(i.hb(),n)}if((n&65535)!==p)throw A.e(A.l9("Invalid gzip header checksum"))}else a.bw()}return!0},
da(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.C()
if(!(s<r))break
r=a.b
r.toString
a.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1}}
A.h8.prototype={
$0(){var s=this
return s.a.eH(s.b,s.c,s.d,s.e,s.f)},
$S:10}
A.eH.prototype={
ef(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
for(s=0;s<a0;++s){r=a1[s]
if(r>a.b)a.b=r
if(r<a.c)a.c=r}r=a.b
if(r>15)throw A.e(B.S)
q=r+1
p=new Uint16Array(q)
for(o=0;o<a0;++o){n=a1[o]
if(n!==0){if(!(n>=0&&n<q))return A.a(p,n)
m=p[n]
if(!(n<q))return A.a(p,n)
p[n]=m+1}}for(l=1,k=1;k<=r;++k){l=(l<<1>>>0)-p[k]
if(l<0)throw A.e(B.a2)}if(l>0)q=r>(a2?0:1)
else q=!1
if(q)throw A.e(B.a1)
j=B.a.a8(1,r)
r=a.a=new Uint32Array(j)
for(q=a.b,m=a1.length,i=1,h=0,g=2;i<=q;){for(f=i<<16,s=0;s<a0;++s){if(!(s<m))return A.a(a1,s)
if(a1[s]===i){for(e=h,d=0,c=0;c<i;++c){d=(d<<1|e&1)>>>0
e=e>>>1}for(b=(f|s)>>>0,c=d;c<j;c+=g){if(!(c>=0&&c<j))return A.a(r,c)
r[c]=b}++h}}++i
h=h<<1>>>0
g=g<<1>>>0}}}
A.ff.prototype={}
A.hL.prototype={
fA(a,b,c,d){var s,r=!1,q=a.a
a.a=B.r
try{s=A.kv("zlib",!1,r,new A.hM(this,a,b,!1,!1))
return s}finally{a.sdE(q)}},
ej(a,b,c,d){var s,r,q,p,o,n,m=a.c,l=a.d
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
return!1}m=new A.bF(new Uint8Array(32768),B.o)
o=new A.dt(a,m,!0)
o.cV()
n=o.c.b3()
if(!o.f){b.ak(n)
return!1}m=a.b
if((m==null?0:m.length-a.c)<4){b.ak(n)
return!1}a.b0()
break A}if(n!=null)b.ak(n)
return!0}}
A.hM.prototype={
$0(){var s=this
return s.a.ej(s.b,s.c,s.d,s.e)},
$S:10}
A.dt.prototype={
gag(){var s=this.a
if(s==null)return s
s.d===$&&A.C()
return s},
cV(){var s,r,q,p=this
p.w=p.r=0
if(p.gag()==null)return
s=p.c
if(!(s instanceof A.bF)){p.d=s
p.c=A.iH(32768)}try{for(;;){r=p.gag()
q=r.c
r=r.d
r===$&&A.C()
if(!(q<r))break
if(!p.eY())return
p.cM(32768)}}finally{p.cM(0)
p.c=s
p.d=null}},
cM(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.b3()
o.ak(A.bn(q,0,r))
p=A.iH(2097152)
p.ak(A.bn(q,r,null))
this.c=p},
eY(){var s,r,q,p=this,o=p.gag()
if(o!=null){s=o.c
r=o.d
r===$&&A.C()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.a9(3)
s=(q&1)===0
switch(B.a.K(q,1)){case 0:if(p.f_()===-1)return!1
break
case 1:if(p.cK($.kF(),$.kE())===-1)return!1
break
case 2:if(p.eZ()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
a9(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gag()
r=s.c
s=s.d
s===$&&A.C()
if(r>=s)return-1
s=o.gag()
r=s.b
r.toString
s=s.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
q=r[s]
s=o.r
r=o.w
o.r=(s|B.a.a8(q,r))>>>0
o.w=r+8}r=o.r
p=B.a.ff(1,a)
o.r=B.a.bZ(r,a)
o.w=s-a
return(r&p-1)>>>0},
bV(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.C()
s=a.b
while(m.w<s){r=m.gag()
q=r.c
r=r.d
r===$&&A.C()
if(q>=r)break
r=m.gag()
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
m.r=B.a.bZ(r,n)
m.w-=n
return o&65535},
f_(){var s,r,q=this
q.w=q.r=0
s=q.a9(16)
if(s!==(q.a9(16)^65535)>>>0)return-1
if(s>q.gag().gk(0))return-1
r=q.gag().dV(s)
q.c.bA(r)
return 0},
eZ(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.a9(5)
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
n=B.a9[p]
if(!(n<19))return A.a(q,n)
q[n]=o}m=g.dg(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.c0(B.d.gaa(l),0,f)
j=J.c0(B.d.gaa(l),f,s)
if(g.eS(n,m,l)===-1)return-1
i=g.df(k)
n=i==null
h=n?null:g.df(j)
if(n||h==null)return-1
return g.cK(i,h)},
dg(a,b){var s,r
t.L.a(a)
try{s=A.iv(a,b)
return s}catch(r){if(A.ad(r) instanceof A.X)throw r
else throw r}},
df(a){return this.dg(a,!1)},
cK(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.bV(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bz(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.C,r)
q=j.a9(B.C[r])
if(q<0)return-1
if(!(r<29))return A.a(B.B,r)
p=B.B[r]
o=j.bV(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.z,o)
n=j.a9(B.z[o])
if(n<0)return-1
m=B.ab[o]+n
if(m>=1){l=j.c
l=m>l.gk(l)}else l=!0
if(l)return-1
j.c.by(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gag()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.C()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
eS(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.bV(b)
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
A.dB.prototype={
b8(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.e(A.it("The decoded data is larger than the "+s+" bytes allowed"))}},
gk(a){return this.b.b},
dM(){return null},
bz(a){this.b8(1)
this.b.bz(a)},
aO(a,b){t.L.a(a)
this.b8(a.length)
this.b.aO(a,b)},
ak(a){return this.aO(a,null)},
bA(a){this.b8(a.gk(0))
this.b.bA(a)},
by(a,b){this.b8(b)
this.b.by(a,b)},
av(a,b){return this.b.av(a,b)},
b6(a){return this.av(a,null)}}
A.c1.prototype={}
A.cp.prototype={}
A.di.prototype={}
A.cq.prototype={
eJ(){return"ByteOrder."+this.b}}
A.f4.prototype={
gk(a){return this.c},
aO(a,b){var s
t.L.a(a)
s=A.bn(a,0,a.length)
this.bM(s)},
ak(a){return this.aO(a,null)},
bz(a){var s,r,q,p=this
if(p.r!=null)p.bM(new Uint8Array(A.R(A.h([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.f(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bJ()}},
bA(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.C()
if(!(r<q))break
s=a.h5(o,0,J.aD(o))
r=s
if(typeof r!=="number")return r.hi()
if(r<=0)break
this.bM(A.bn(o,0,s))}}finally{a.c=A.j(p)}},
bM(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bJ()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.m(0,new Uint8Array(A.R(A.bn(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.P(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bJ()}},
bJ(){var s=this,r=s.f
if(r===0)return
s.b.m(0,new Uint8Array(A.R(A.bn(s.e,0,r))))
s.f=0},
av(a,b){return A.w(A.aH("a streamed result cannot be read back"))},
b6(a){return this.av(a,null)}}
A.fB.prototype={}
A.du.prototype={
gk(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.j(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bE(a,b){var s,r=this,q=r.b
if(q==null)return A.iw(A.h([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.C()
a=s-b}return A.iw(q,r.a,a,b)},
aj(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
h5(a,b,c){var s,r,q,p=this.b
if(p==null)return 0
s=p.length
r=this.c
q=s-r
q=c>q?q:c
if(q<=0)return 0
B.d.P(a,b,b+q,p,r)
this.c+=q
return q},
hb(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gk(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.e(A.ao(q,0,r,"position",null))
return J.c0(B.d.gaa(n),o.b.byteOffset+o.c,s)}}
A.dv.prototype={
bw(){var s=this.aj(),r=this.aj()
if(this.a===B.r)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
b0(){var s=this,r=s.aj(),q=s.aj(),p=s.aj(),o=s.aj()
if(s.a===B.r)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
dV(a){var s=this,r=s.bE(a,s.c)
s.c=s.c+r.gk(0)
return r},
sdE(a){this.a=t.fA.a(a)}}
A.bF.prototype={
dM(){},
b3(){return J.c0(B.d.gaa(this.c),this.c.byteOffset,this.b)},
bz(a){var s,r,q=this
if(q.b===q.c.length)q.eM()
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
bA(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bh(s+(q?0:r.length-a.c)-n)}if(!q)B.d.P(o,s,s+a.gk(0),r,a.c)
m.b=m.b+a.gk(0)},
by(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
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
av(a,b){var s=this
if(a<0)a=s.b+a
if(b==null)b=s.b
else if(b<0)b=s.b+b
return J.c0(B.d.gaa(s.c),s.c.byteOffset+a,b-a)},
b6(a){return this.av(a,null)},
bh(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.L(s,0,q,r)
this.c=s},
eM(){return this.bh(null)},
gk(a){return this.b}}
A.bk.prototype={
by(a,b){var s,r=this
for(s=-a;b>a;){r.ak(r.b6(s))
b-=a}if(b===a)r.ak(r.b6(s))
else r.ak(r.av(s,b-a))},
b3(){return this.av(0,this.gk(this))}}
A.ea.prototype={}
A.eu.prototype={
fQ(a,b){var s,r
if(b<=0)return!1
s=this.w.h(0,a)
if(s!=null&&s.a>=b)return!0
r=this.at.h(0,a)
return r!=null&&r.x&&r.f===b&&r.y>=b},
e8(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.c8()
this.a=s},
cr(){this.CW=0
if(this.ch.length>65536)this.ch=new Uint8Array(65536)},
e_(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this,m=h*e*4
if(d<0||d>=g||b.length<m)return!1
s=new A.G(c,B.a.H(d,4))
r=n.y
q=r.J(0,s)
if(q!=null){r.u(0,s,q)
if(q.a===h&&q.b===e&&q.az(0,d)){q.h4(d,b,a)
return!0}}if(a!=null){a.a=null
a.b=-1}p=new A.G(c,d)
r=n.r
o=r.J(0,p)
if(o!=null){r.u(0,p,o)
r=o.a
if(n.cL(r,0,r.length,o.b,o.c,b,m))return!0
n.bn(p)}return!1},
hg(a,b,c,d,e,f,g){return this.e_(null,a,b,c,d,e,f,g)},
dT(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a0*c
if(b<0||b>=d||e>65536||e<256||f.b<=0)return!1
s=B.a.H(b,4)*4
r=Math.min(s+4,d)
if(r-s<2)return!1
q=new A.G(a,B.a.H(s,4))
p=f.y
if(p.aD(q)||f.z.az(0,q))return!1
o=A.h([],t.t)
for(n=f.r,m=s,l=0;m<r;++m){k=n.h(0,new A.G(a,m))
if(k!=null){l+=k.a.length
B.b.m(o,m)}}if(o.length<2)return!1
n=f.z
n.m(0,q)
if(n.a>128)n.J(0,n.ga6(0))
j=e*4
i=f.as
if(i==null||i.length<j)i=f.as=new Uint8Array(j)
h=A.lP(s,o,c,Math.min(B.a.H(f.b,8),l*2),new A.ex(f,a,j),i,a0)
if(h==null)return!1
for(n=o.length,g=0;g<o.length;o.length===n||(0,A.T)(o),++g)f.bn(new A.G(a,o[g]))
n=h.w
f.bQ(n)
p.u(0,q,h)
f.Q+=n
return!0},
cv(a,b,c,d,e,f,g,h){var s,r,q,p,o,n,m,l,k,j=h*c*4
if(b<0||b>=g||f.length<j)return B.aH
s=new A.G(a,B.a.H(b,4))
r=this.y.h(0,s)
r=r==null?null:r.az(0,b)
if(r===!0)this.f7(s)
q=j+B.a.H(j,255)+16
p=e.fJ(q)
o=A.lw(f,j,p,e.a,j)
n=o<0||o>=j
if(n){m=j
l=f}else{m=o
l=p}k=A.jl(l,0,m)
this.f2(l,k,n,m,new A.G(a,b),0)
e.h6(q)
return new A.cg(m,0)},
fF(a){var s,r=this.at.J(0,a)
if(r!=null)try{r.c.c7()}catch(s){}return!1},
fK(a){var s,r,q,p,o=this,n=o.y,m=A.n(n).i("U<1>"),l=m.i("bJ<m.E>")
m=A.aX(new A.bJ(new A.U(n,m),m.i("p(m.E)").a(new A.ev(a)),l),l.i("m.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.T)(m),++s){r=n.J(0,m[s])
if(r!=null)o.Q=o.Q-r.w}n=o.z
n.eO(A.n(n).i("p(1)").a(new A.ew(a)),!0)
q=o.w.J(0,a)
if(q==null)return
for(n=q.gG(q),m=o.r;n.v();){p=m.J(0,new A.G(a,n.gB()))
if(p!=null)o.x=o.x-p.a.length}},
c8(){var s,r,q,p
for(r=this.at,q=new A.aE(r,r.r,r.e,A.n(r).i("aE<2>"));q.v();){s=q.d
try{s.c.c7()}catch(p){}}r.l(0)},
dF(){var s,r=this
r.r.l(0)
r.w.l(0)
r.x=0
r.y.l(0)
s=r.z
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bR()}r.Q=0
r.as=null
r.cr()},
cL(a,b,c,d,e,f,g){var s,r,q
if(A.jl(a,b,c)!==e)return!1
if(d){if(c!==g)return!1
B.d.P(f,0,g,a,b)
return!0}try{s=A.lx(a,b,c,f,g)
r=J.l(s,g)
return r}catch(q){if(A.ad(q) instanceof A.X)return!1
else throw q}},
f2(a,b,c,d,e,f){var s,r,q,p=this,o=p.b
if(o<=0||d>o)return
p.bn(e)
p.bQ(d)
s=new Uint8Array(d)
B.d.P(s,0,d,a,f)
p.r.u(0,e,new A.ea(s,c,b))
o=p.w
r=e.a
q=o.h(0,r)
if(q==null){q=A.iD(t.S)
o.u(0,r,q)
o=q}else o=q
o.m(0,e.b)
p.x+=d},
f7(a){var s=this.y.J(0,a)
if(s!=null)this.Q=this.Q-s.w},
bQ(a){var s,r,q,p,o,n,m,l=this
for(s=t.x,r=l.y,q=A.n(r).i("U<1>"),p=l.r,o=A.n(p).i("U<1>");l.x+l.Q+a>l.b;)if(p.a!==0){n=new A.U(p,o).gG(0)
if(!n.v())A.w(A.aw())
l.bn(n.gB())}else if(r.a!==0){n=new A.U(r,q).gG(0)
if(!n.v())A.w(A.aw())
m=r.J(0,s.a(n.gB()))
if(m!=null)l.Q=l.Q-m.w}else break},
bn(a){var s,r,q,p=this,o=p.r.J(0,a)
if(o==null)return
p.x=p.x-o.a.length
s=p.w
r=a.a
q=s.h(0,r)
if(q!=null){q.J(0,a.b)
if(q.a===0)s.J(0,r)}}}
A.ex.prototype={
$2(a,b){var s=this.a,r=s.r.h(0,new A.G(this.b,a)),q=r.a
return s.cL(q,0,q.length,r.b,r.c,b,this.c)},
$S:21}
A.ev.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:11}
A.ew.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:11}
A.eO.prototype={
fJ(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
h6(a){var s=this
if(s.b.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.fc.prototype={}
A.ez.prototype={}
A.b.prototype={
du(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.du(a)
s=this.b
if(A.r(s))a.a+="["+A.u(s)+"]"
else{r="."+A.u(s)
a.a+=r}},
p(a){var s,r=new A.c7("")
this.du(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bo.prototype={
gF(){var s,r=this,q=r.z
if(q===$){s=B.b.ab(r.w,new A.fz(r))
r.z!==$&&A.M()
r.z=s
q=s}return q},
j(a,b){return A.w(new A.fc(b+" at "+a.p(0),null,null))},
ap(a,b,c){if(!t.P.b(b))this.j(c,"Expected object")
return b},
bv(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.r(c)){s=new A.b(b,c)
break A}if(typeof c=="string"){s=new A.b(b,c)
break A}s=b
break A}this.j(s,"Expected finite number")}return a},
O(a,b){return this.bv(a,b,null)},
N(a,b,c){var s,r
t.P.a(a)
t.E.a(c)
for(s=a.gao(),s=s.gG(s);s.v();){r=s.gB()
if(!c.az(0,r))this.j(new A.b(b,r),"Unsupported field")}},
e1(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.l(a.h(0,b),0)&&!J.l(a.h(0,b),!1))this.j(new A.b(c,b),"Unsupported nonzero "+b)},
dG(g4,g5,g6,g7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0=this,f1=null,f2="ip",f3="op",f4="Expected object",f5="layers",f6="hasMask",f7="tp",f8="td",f9="masksProperties",g0="shapes",g1="refId",g2="parent",g3=t.P
g3.a(g4)
t.cq.a(g5)
t.E.a(g6)
t.aM.a(g7)
f0.N(g4,B.h,B.aR)
f0.e1(g4,"ddd",B.h)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=g4.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.ir(n)))m=!(n instanceof A.F&&n.gW(n))
if(m)f0.j(new A.b(B.h,o),"Unsupported "+o)}f0.b=f0.O(g4.h(0,"w"),new A.b(B.h,"w"))
f0.c=f0.O(g4.h(0,"h"),new A.b(B.h,"h"))
f0.d=f0.O(g4.h(0,f2),new A.b(B.h,f2))
f0.e=f0.O(g4.h(0,f3),new A.b(B.h,f3))
s=f0.O(g4.h(0,"fr"),new A.b(B.h,"fr"))
f0.f=s
if(f0.b<=0||f0.c<=0||s<=0||f0.e<=f0.d)f0.j(B.h,"Invalid bounds/timing")
s=g5==null
l=s?A.aa(t.N,g3):g5
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){k=s[p]
j=g4.h(0,k)
if(j==null)j=[]
if(!q.b(j))f0.j(new A.b(B.h,k),"Expected asset definitions")
for(m=J.co(j);m.v();){i=m.gB()
if(!g3.b(i))f0.j(new A.b(B.h,k),f4)
h=i.h(0,"id")
if(typeof h!="string")f0.j(new A.b(B.h,k),"Expected asset id")
l.u(0,h,i)}}g=g4.h(0,f5)
if(!q.b(g))f0.j(B.m,"Expected layers")
f=g7==null?A.aa(t.bP,t.I):g7
e=new A.hr(f0,g,new A.af(t.gt),new A.bO(t.ai))
s=t.S
r=t.D
d=A.aa(s,r)
c=A.aa(r,s)
s=A.h([],t.f)
b=new A.fF(f0,s)
a=A.aa(r,t.eG)
for(r=J.O(g),m=f0.w,a0=t.n,a1=t.A,a2=t.V,a3=t.c2,a4=f0.a,a5=t.N,a6=t.z,a7=0;a7<r.gk(g);++a7){a8=new A.b(B.m,a7)
a9=r.h(g,a7)
if(!g3.b(a9))f0.j(a8,f4)
f0.N(a9,a8,B.aQ)
b0=a9.h(0,"bm")
if(b0==null)b0=0
if(!A.r(b0)||b0<0||b0>16)f0.j(new A.b(a8,"bm"),"Blend mode "+A.u(b0))
for(b1=["ddd","ao"],b2=b1.length,p=0;p<b2;++p)f0.e1(a9,b1[p],a8)
if(a9.h(0,f6)!=null&&!A.bc(a9.h(0,f6))&&!J.l(a9.h(0,f6),0)&&!J.l(a9.h(0,f6),1))f0.j(new A.b(a8,f6),"Expected boolean hasMask")
b3=a9.h(0,"tt")
if(b3==null)b3=0
if(!A.r(b3)||b3<0||b3>4)f0.j(new A.b(a8,"tt"),"Matte type")
if(a9.h(0,f7)!=null&&!J.l(a9.h(0,f7),0)){b1=!0
if(b3!==0)if(a7!==0){b1=a9.h(0,f7)
b2=a7-1
b4=J.ae(r.h(g,b2),"ind")
b1=!J.l(b1,b4==null?b2:b4)}if(b1)f0.j(new A.b(a8,f7),"Unsupported nonzero tp")}if(a9.h(0,f8)!=null&&!J.l(a9.h(0,f8),0)&&!J.l(a9.h(0,f8),1))f0.j(new A.b(a8,f8),"Matte source flag")
b5=f0.ey(a9.h(0,f9),new A.b(a8,f9))
g3.a(a9)
b.fl(a9,q.a(q.b(a9.h(0,g0))?a9.h(0,g0):B.A),a8,s)
b1=a9.h(0,"sr")
if(b1==null)b1=1
b6=f0.O(b1,new A.b(a8,"sr"))
if(b6===0)f0.j(new A.b(a8,"sr"),"Invalid zero time stretch")
b7=a9.h(0,"ty")
b1=J.at(b7)
if(!b1.E(b7,4)&&!b1.E(b7,3)&&!b1.E(b7,0)&&!b1.E(b7,1))f0.j(new A.b(a8,"ty"),"Layer type "+A.u(b7))
b8=f0.eI(a9.h(0,"ef"),new A.b(a8,"ef"),g)
b9=b8.a
c0=b8.b
c1=f0.eT(a9.h(0,"sy"),new A.b(a8,"sy"))
if(c1!=null&&b9!=null)f0.j(new A.b(a8,"ef"),"Fill with Inner Shadow")
b2=c0==null
b4=!b2
if(b4)c2=!b1.E(b7,4)||b3!==0||b0!==0
else c2=!1
if(c2)f0.j(c0.b,"Set Matte requires a normal shape layer without a track matte")
c3=f0.dn(a9.h(0,"ks"),new A.b(a8,"ks"))
if(b1.E(b7,4))c4=f0.cS(a9.h(0,g0),new A.b(a8,g0),e)
else if(b1.E(b7,1)){c2=a9.h(0,"sw")
if(c2==null)c2=0
c5=f0.O(c2,new A.b(a8,"sw"))
c2=a9.h(0,"sh")
if(c2==null)c2=0
c6=f0.O(c2,new A.b(a8,"sh"))
c7=a9.h(0,"sc")
if(typeof c7!="string"||!B.p.e9(c7,"#"))f0.j(new A.b(a8,"sc"),"Invalid solid color")
c8=A.nI(B.p.ec(c7,1),16)
c2=B.a.K(c8,16)
c9=B.a.K(c8,8)
d0=new Float32Array(A.R(A.h([c5*0.5,c6*0.5],a0)))
d1=new Float32Array(0)
d2=new Float32Array(A.R(A.h([c5,c6],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.R(A.h([0],a0)))
d5=new A.P(new A.aK(!1,!1,new A.z(d0,f1,!1,d1,!1),new A.z(d2,f1,!1,d3,!1),new A.z(d4,f1,!1,new Float32Array(0),!1)))
c2=new Float32Array(A.R(A.h([(c2&255)/255,(c9&255)/255,(c8&255)/255],a0)))
d6=new A.z(c2,f1,!1,new Float32Array(0),!1)
d6.f=!0
c2=new Float32Array(A.R(A.h([100],a0)))
c9=new Float32Array(0)
d0=new Float32Array(A.R(A.h([1],a0)))
d1=new Float32Array(0)
d7=A.iQ(A.h([d5],a1),d6,new A.z(c2,f1,!1,c9,!1),new A.z(d0,f1,!1,d1,!1),!1,!1,1,1,4,f1,f1)
d1=A.h([d5],a1)
d0=A.h([d7],a2)
c9=new Float32Array(A.R(A.h([0,0],a0)))
c2=new Float32Array(0)
d2=new Float32Array(A.R(A.h([0,0],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.R(A.h([100,100],a0)))
d8=new Float32Array(0)
d9=new Float32Array(A.R(A.h([0],a0)))
e0=new Float32Array(0)
e1=new Float32Array(A.R(A.h([100],a0)))
c4=A.iO(d1,d0,new A.bS(new A.z(c9,f1,!1,c2,!1),new A.z(d2,f1,!1,d3,!1),new A.z(d4,f1,!1,d8,!1),new A.z(d9,f1,!1,e0,!1),new A.z(e1,f1,!1,new Float32Array(0),!1),f1,f1,f1,f1))}else c4=f1
if(b1.E(b7,0)){h=a9.h(0,g1)
e2=l.h(0,h)
if(typeof h!="string"||e2==null||!q.b(e2.h(0,f5)))f0.j(new A.b(a8,g1),"Missing precomposition")
if(g6.az(0,h))f0.j(new A.b(a8,g1),"Cyclic precomposition")
b1=a9.h(0,"w")
if(b1==null)b1=f0.b
e3=f0.O(b1,new A.b(a8,"w"))
b1=a9.h(0,"h")
if(b1==null)b1=f0.c
e4=f0.O(b1,new A.b(a8,"h"))
e5=new A.a1(h,e3,e4)
e6=f.h(0,e5)
if(e6==null){e6=A.iL(a4)
b1=A.lt(["w",e3,"h",e4,"ip",0,"op",f0.e-f0.d,"fr",f0.f,"layers",e2.h(0,f5)],a5,a6)
c2=A.lu(a5)
c2.ah(0,g6)
c2.m(0,h)
e6.dG(b1,l,c2,f)
f.u(0,e5,e6)}e7=new A.e2(new A.af(a3)).cq(e6)
f0.x=f0.x+e7.x
f0.y=B.t.bC(f0.y,e7.y)}else e7=f1
e8=a9.h(0,"tm")!=null?f0.I(a9.h(0,"tm"),new A.b(a8,"tm"),1,A.h([0],a0)):f1
b1=a9.h(0,f2)
if(b1==null)b1=f0.d
b1=f0.O(b1,new A.b(a8,f2))
c2=a9.h(0,f3)
if(c2==null)c2=f0.e
c2=f0.O(c2,new A.b(a8,f3))
c9=J.l(a9.h(0,"hd"),!0)
d0=a9.h(0,"st")
if(d0==null)d0=0
d0=f0.O(d0,new A.b(a8,"st"))
e9=A.jK(c3,c4,b1,c2,c9,b0,e7,b9,c1,b5,b2?b3:1,d0,b6,e8,b4)
if(b4)a.u(0,e9,c0)
B.b.m(m,e9)
h=a9.h(0,"ind")
if(h==null)h=a7
if(!A.r(h)||d.aD(h))f0.j(new A.b(a8,"ind"),"Invalid/duplicate layer id")
d.u(0,h,e9)
if(a9.h(0,g2)!=null){if(!A.r(a9.h(0,g2)))f0.j(new A.b(a8,g2),"Invalid parent id")
c.u(0,e9,A.j(a9.h(0,g2)))}}f0.eV(g,d,a)
f0.eW(d,c)},
fq(a){return this.dG(a,null,B.aW,null)},
ey(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e="pt"
if(a==null)return f
if(!t.j.b(a))g.j(b,"Expected list")
s=J.O(a)
if(s.gW(a))return f
r=A.h([],t.bE)
for(q=t.n,p=t.P,o=0;o<s.gk(a);++o){n=new A.b(b,o)
m=s.h(a,o)
if(!p.b(m))g.j(n,"Expected object")
g.N(m,n,B.aP)
l=J.l(m.h(0,"inv"),!0)
k=A.hN(m.h(0,"mode"))
if(k==null)k="a"
if(!B.aX.az(0,k))g.j(new A.b(n,"mode"),"Unsupported mask mode "+k)
if(m.h(0,e)==null)g.j(new A.b(n,e),"Missing mask path")
j=g.d1(m.h(0,e),new A.b(n,e))
if(m.h(0,"o")!=null)i=g.I(m.h(0,"o"),new A.b(n,"o"),1,A.h([100],q))
else{h=new Float32Array(A.R(A.h([100],q)))
i=new A.z(h,f,!1,new Float32Array(0),!1)}B.b.m(r,new A.a3(j,k,i,l,m.h(0,"x")!=null?g.I(m.h(0,"x"),new A.b(n,"x"),1,A.h([0],q)):f))}return r},
eV(a,b,c){var s,r,q,p,o,n,m,l,k,j=this
t.j.a(a)
t.B.a(b)
t.aj.a(c)
for(s=j.w,r=0;r<s.length;++r){q=s[r]
if(q.y!==0&&!q.ax){if(r===0)j.j(new A.b(new A.b(B.m,r),"tt"),"Missing preceding matte source")
p=r-1
if(!(p>=0&&p<s.length))return A.a(s,p)
o=s[p]
if(o.y!==0)j.j(new A.b(new A.b(B.m,r),"tt"),"Chained matte")
q.ay=o
o.ch=!0
j.x+=4}}for(p=new A.bC(c,A.n(c).i("bC<1,2>")).gG(0);p.v();){n=p.d
m=n.a
l=n.b
o=b.h(0,l.a)
k=!0
if(o!=null)if(o.b!=null)if(!o.e)k=o!==m&&o.y!==0
if(k)j.j(l.b,"Set Matte requires a visible shape source without its own matte")
m.ay=o
j.x+=4}for(p=J.O(a),r=0;r<s.length;++r){if(J.l(J.ae(p.h(a,r),"td"),1)){if(!(r<s.length))return A.a(s,r)
k=!s[r].ch}else k=!1
if(k)j.j(new A.b(new A.b(B.m,r),"td"),"Unpaired matte source")}},
eW(a,b){var s,r,q,p,o,n,m,l,k
t.B.a(a)
t.gq.a(b)
for(s=new A.bC(b,A.n(b).i("bC<1,2>")).gG(0);s.v();){r=s.d
q=r.b
p=a.h(0,q)
if(p==null)this.j(B.m,"Missing parent "+q)
r.a.cy=p}for(s=this.w,q=s.length,o=t.D,n=0;n<s.length;s.length===q||(0,A.T)(s),++n){m=s[n]
l=A.iD(o)
for(k=m;k!=null;k=k.cy)if(!l.m(0,k))this.j(B.m,"Cyclic parenting")}},
ar(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
for(s=g.w,r=s.length-1,q=null;r>=0;--r){if(!(r<s.length))return A.a(s,r)
p=s[r]
if(!p.ch){if(!p.e)o=(p.b!=null||p.f!=null)&&a>=p.c&&a<p.d
else o=!1
o=!o}else o=!0
if(o)continue
o=p.a.e.n(a)
if(0>=o.length)return A.a(o,0)
if(B.c.D(B.a.A(B.c.Y(255*B.c.D(o[0])/100),0,255)*p.aQ(a)/255)===0)continue
n=p.ay
m=p.ar(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.n(a)
if(0>=o.length)return A.a(o,0)
k=B.c.D(B.a.A(B.c.Y(255*B.c.D(o[0])/100),0,255)*n.aQ(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.ar(a)
if(j==null)continue
m=m.bu(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.bW(q,m)}if(q==null)return null
i=g.r
if(i===$){s=g.b
s===$&&A.C()
o=g.c
o===$&&A.C()
i=g.r=new A.a7(0,0,0+s,0+o)}h=q.bu(i)
return h.gW(0)?null:h},
dn(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.aa(t.N,t.z):i.ap(0,a,b)
i.N(g,b,B.b2)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.j(new A.b(b,p),"3D transform")}s=t.n
o=i.I(g.h(0,"sk"),new A.b(b,"sk"),1,A.h([0],s))
n=i.I(g.h(0,"sa"),new A.b(b,"sa"),1,A.h([0],s))
m=g.h(0,h)
if(m instanceof A.F&&J.l(m.h(0,"s"),!0)){l=i.ap(0,m,new A.b(b,h))
i.N(l,new A.b(b,h),B.aT)
k=i.I(l.h(0,"x"),new A.b(new A.b(b,h),"x"),1,A.h([0],s))
j=i.I(l.h(0,"y"),new A.b(new A.b(b,h),"y"),1,A.h([0],s))
m=null}else{k=null
j=null}return A.iU(i.I(g.h(0,"a"),new A.b(b,"a"),2,A.h([0,0],s)),i.I(m,new A.b(b,h),2,A.h([0,0],s)),i.fk(g.h(0,"s"),new A.b(b,"s"),2,A.h([100,100],s),100),i.I(g.h(0,"r"),new A.b(b,"r"),1,A.h([0],s)),i.I(g.h(0,"o"),new A.b(b,"o"),1,A.h([100],s)),k,j,o,n)},
eI(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aI
if(!b0.b(b1))a4.j(b2,"Expected effects array")
for(s=J.bv(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.O(b1),n<m.gk(b1);++n){l=new A.b(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.j(new A.b(b2,n),a5)
a4.N(m,l,B.aZ)
k=J.l(m.h(0,a6),21)&&J.l(m.h(0,a7),"ADBE Fill")
j=J.l(m.h(0,a6),28)&&J.l(m.h(0,a7),"ADBE Set Matte3")
i=J.l(m.h(0,a6),5)&&J.l(m.h(0,a7),"ADBE Layer Control")
h=!k
if(h&&!j&&!i)a4.j(l,"Unsupported visual effect")
if(J.l(m.h(0,a8),0)||J.l(m.h(0,a8),!1))continue
if(m.h(0,a8)!=null&&!J.l(m.h(0,a8),1)&&!J.l(m.h(0,a8),!0))a4.j(new A.b(l,a8),"Invalid effect enabled flag")
if(!h||j){if(p!=null||o!=null)a4.j(l,"Multiple visual effects")
g=k?B.a7:B.aa
f=m.h(0,a9)
if(!b0.b(f)||J.aD(f)!==g.length)a4.j(new A.b(l,a9),"Invalid effect parameters")
e=new A.fp(a4,l,f,g)
d=new A.fq(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.e1(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aC,B.aD,B.aE,B.aF,B.aG],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.n(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.b(new A.b(new A.b(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.dX(a0))a4.j(a1,"Expected a static layer index")
o=new A.G(B.c.Y(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.aD(a2)!==1)a4.j(l,"Invalid layer control")
m=J.ji(a2)
if(!q.b(m))a4.j(new A.b(new A.b(l,a9),0),a5)
a4.N(m,new A.b(new A.b(l,a9),0),B.E)
if(!J.l(m.h(0,a6),10)||!J.l(m.h(0,a7),"ADBE Layer Control-0001"))a4.j(l,"Unsupported effect control")
a=a4.I(m.h(0,"v"),new A.b(new A.b(new A.b(l,a9),0),"v"),1,A.h([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.dX(a0))h=a0!==0&&!s.an(b3,new A.fo(a0))
else h=!0
if(h)a4.j(l,"Missing layer control target")}}return new A.G(p,o)},
eT(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.ir(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.aD(a)!==1)d.j(b,"Expected one Inner Shadow style")
r=new A.b(b,0)
q=d.ap(0,J.ji(a),r)
if(!J.l(q.h(0,"ty"),2))d.j(new A.b(r,"ty"),"Unsupported layer style")
d.N(q,r,B.aN)
p=new A.fv(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.l(p.$2(m,0),0))d.j(new A.b(r,m),"Unsupported Inner Shadow parameter")}if(!J.l(p.$2("bm",1),1))d.j(new A.b(r,"bm"),"Inner Shadow requires Multiply")
l=d.I(q.h(0,"c"),new A.b(r,"c"),3,A.h([0,0,0],t.n))
if(l.a==null)d.j(new A.b(r,"c"),"Animated Inner Shadow")
k=l.n(0)
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
return A.jJ(-s*h,o*h,(j<<24|f<<16|e<<8|B.a.A(B.c.D(k[2]*255),0,255))>>>0)},
d1(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b={}
b.a=b.b=null
b.c=!1
s=c.dl(a,a0,-1,A.h([],t.n),new A.fw(b,c,a))
r=A.h([],t.hg)
q=s.b
if(q!=null&&b.c){p=b.a
p.toString
o=q.a.length
n=A.ju(o,!1,!1,t.y)
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
B.b.m(r,new A.G(e,d))}}c.x=c.x+(s.gcm()/6|0)
p=b.b
return new A.aq(s,p!==!1,r)},
cS(e3,e4,e5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7=this,d8=null,d9="ks",e0="d",e1="Path direction",e2="r"
if(!t.j.b(e3))d7.j(e4,"Expected shape list")
s=t.A
r=A.h([],s)
q=A.h([],t.V)
for(p=t.P,o=t.aT,n=t.eU,m=n.i("m.E"),l=t.n,k=t.u,j=t.S,i=t.W,h=t.fq,g=t.bs,f=t.fP,e=d8,d=0;c=J.O(e3),d<c.gk(e3);++d){b=new A.b(e4,d)
a=c.h(e3,d)
if(!p.b(a))d7.j(b,"Expected object")
a0=a.h(0,"ty")
a1=a.h(0,"bm")
if(a1==null)a1=0
if(!A.r(a1)||a1<0||a1>16)d7.j(new A.b(b,"bm"),"Blend mode "+A.u(a1))
a2=J.l(a.h(0,"hd"),!0)
switch(a0){case"tr":if(e!=null||d!==c.gk(e3)-1)d7.j(b,"Transform must be last and unique")
e=d7.dn(a,b)
break
case"gr":d7.N(a,b,B.aS)
a3=d7.cS(a.h(0,"it"),new A.b(b,"it"),e5)
if(!a2){B.b.m(r,a3)
B.b.m(q,a3)}break
case"sh":d7.N(a,b,B.aU)
if(a.h(0,d9)==null)d7.j(new A.b(b,d9),"Missing path data")
a4=e5.cp(a.h(0,d9),new A.b(b,d9))
if(!a2)B.b.m(r,new A.P(a4))
break
case"rc":case"el":d7.N(a,b,B.b_)
if(a.h(0,e0)!=null&&!J.l(a.h(0,e0),1)&&!J.l(a.h(0,e0),2)&&!J.l(a.h(0,e0),3))d7.j(new A.b(b,e0),e1)
a5=d7.aX(a.h(0,"p"),new A.b(b,"p"),2,A.h([0,0],l),!0)
a6=d7.aX(a.h(0,"s"),new A.b(b,"s"),2,A.h([0,0],l),!0)
a7=d7.I(a.h(0,e2),new A.b(b,e2),1,A.h([0],l))
d7.x+=8
if(!a2)B.b.m(r,new A.P(new A.aK(J.l(a0,"el"),J.l(a.h(0,e0),3),a5,a6,a7)))
break
case"sr":d7.N(a,b,B.aY)
a8=a.h(0,"sy")
if(a8==null)a8=1
c=J.at(a8)
if(!c.E(a8,1)&&!c.E(a8,2))d7.j(new A.b(b,"sy"),"PolyStar type "+A.u(a8))
if(a.h(0,e0)!=null&&!J.l(a.h(0,e0),1)&&!J.l(a.h(0,e0),2)&&!J.l(a.h(0,e0),3))d7.j(new A.b(b,e0),e1)
a9=d7.I(a.h(0,"pt"),new A.b(b,"pt"),1,A.h([5],l))
a5=d7.aX(a.h(0,"p"),new A.b(b,"p"),2,A.h([0,0],l),!0)
b0=d7.I(a.h(0,e2),new A.b(b,e2),1,A.h([0],l))
b1=d7.I(a.h(0,"or"),new A.b(b,"or"),1,A.h([0],l))
b2=d7.I(a.h(0,"os"),new A.b(b,"os"),1,A.h([0],l))
if(c.E(a8,1))if(a.h(0,"ir")!=null){b3=d7.I(a.h(0,"ir"),new A.b(b,"ir"),1,A.h([0],l))
b4=b3}else{b3=new Float32Array(A.R(A.h([0],l)))
b3=new A.z(b3,d8,!1,new Float32Array(0),!1)
b4=b3}else b4=d8
if(c.E(a8,1))if(a.h(0,"is")!=null){b3=d7.I(a.h(0,"is"),new A.b(b,"is"),1,A.h([0],l))
b5=b3}else{b3=new Float32Array(A.R(A.h([0],l)))
b3=new A.z(b3,d8,!1,new Float32Array(0),!1)
b5=b3}else b5=d8
d7.x+=12
if(!a2)B.b.m(r,new A.P(new A.aT(c.E(a8,1),J.l(a.h(0,e0),3),a9,a5,b0,b1,b2,b4,b5)))
break
case"tm":d7.N(a,b,B.b1)
b6=a.h(0,"m")
if(b6==null)b6=1
c=J.at(b6)
if(!c.E(b6,1)&&!c.E(b6,2))d7.j(new A.b(b,"m"),"Trim mode")
b3=A.h([],s)
b7=new A.bT(b3,d7.I(a.h(0,"s"),new A.b(b,"s"),1,A.h([0],l)),d7.I(a.h(0,"e"),new A.b(b,"e"),1,A.h([100],l)),d7.I(a.h(0,"o"),new A.b(b,"o"),1,A.h([0],l)),c.E(b6,2),A.aa(j,i))
if(!a2){b8=A.h([],h)
new A.fu(b8).$1(r)
B.b.ah(b3,new A.V(b8,g.a(new A.fs()),f))
for(b9=0;b9<b8.length;++b9)b8[b9].a=new A.ba(b7,b9)}++d7.x
break
case"fl":case"st":case"gf":case"gs":d7.N(a,b,B.aL)
c=J.at(a0)
c0=c.E(a0,"st")||c.E(a0,"gs")
if(c0)d7.y=!0
c1=c0?d7.eG(a.h(0,e0),new A.b(b,e0)):d8
c2=a.h(0,e2)
if(c2==null)c2=1
b3=J.at(c2)
if(!b3.E(c2,1)&&!b3.E(c2,2))d7.j(new A.b(b,e2),"Fill rule")
c3=a.h(0,"lc")
if(c3==null)c3=1
c4=a.h(0,"lj")
if(c4==null)c4=1
if(!A.r(c3)||c3<1||c3>3||!A.r(c4)||c4<1||c4>3)d7.j(b,"Stroke cap/join")
c5=d7.I(a.h(0,"c"),new A.b(b,"c"),3,A.h([0,0,0],l))
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
c8&2&&A.f(c6)
c6[d0]=d1/255}}d3=d7.I(a.h(0,"o"),new A.b(b,"o"),1,A.h([100],l))
d4=d7.I(a.h(0,"w"),new A.b(b,"w"),1,A.h([1],l))
if(!a2){c7=A.aX(r,k)
b3=b3.E(c2,2)
c8=a.h(0,"ml")
if(c8==null)c8=4
c8=d7.O(c8,new A.b(b,"ml"))
B.b.m(q,A.iQ(c7,c5,d3,d4,c0,b3,c3,c4,c8,c1,c.E(a0,"gf")||c.E(a0,"gs")?d7.eR(a,b):d8))}d7.x+=2
break
case"mm":d7.N(a,b,B.aV)
b6=a.h(0,"mm")
if(b6==null)b6=1
if(!A.r(b6)||b6<1||b6>5)d7.j(new A.b(b,"mm"),"Shape op mm mode "+A.u(b6))
if(!a2&&r.length!==0){d5=A.aX(new A.bJ(r,o.a(new A.ft()),n),m)
if(d5.length===1)d6=b6===4||r.length>1
else d6=!1
B.b.l(r)
if(d5.length!==0)B.b.m(r,d6?B.b.gae(d5):new A.aI(d5,b6))}else if(a2)B.b.l(r);++d7.x
break
default:d7.j(new A.b(b,"ty"),"Shape op "+A.u(a0))}}return A.iO(r,q,e==null?A.me():e)},
eG(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.j(b,"Expected dash array")
s=A.h([],t.cl)
for(r=t.n,q=t.P,p=null,o=0;n=J.O(a),o<n.gk(a);++o){m=new A.b(b,o)
n=n.h(a,o)
if(!q.b(n))j.j(new A.b(b,o),"Expected object")
j.N(n,m,B.b0)
l=j.I(n.h(0,"v"),new A.b(m,"v"),1,A.h([0],r))
k=n.h(0,"n")
n=J.at(k)
if(n.E(k,"o")){if(p!=null)j.j(m,"Duplicate dash offset")
p=l}else if(n.E(k,(s.length&1)===0?"d":"g"))B.b.m(s,l)
else j.j(new A.b(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.b.m(s,B.b.gac(s))
return A.jG(s,p==null?A.ci(A.h([0],r)):p)},
eR(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.ap(0,a.h(0,"g"),new A.b(b,"g"))
k.N(s,new A.b(b,"g"),B.b3)
r=s.h(0,"p")
if(!A.r(r)||r<=0)k.j(new A.b(new A.b(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dl(s.h(0,"k"),new A.b(new A.b(b,"g"),"k"),-1,A.h([],q),new A.fr(k,r))
if(!J.l(a.h(0,"t"),1)&&!J.l(a.h(0,"t"),2))k.j(new A.b(b,"t"),"Gradient type")
o=k.aX(a.h(0,"s"),new A.b(b,"s"),2,A.h([0,0],q),!0)
n=k.aX(a.h(0,"e"),new A.b(b,"e"),2,A.h([0,0],q),!0)
m=J.l(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.I(a.h(0,"h"),new A.b(b,"h"),1,A.h([0],q))
return A.jI(r,p,o,n,m,l,a.h(0,"a")==null?null:k.I(a.h(0,"a"),new A.b(b,"a"),1,A.h([0],q)))},
br(a,b,c,d,e,f,g){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return A.ci(d)
s=o.ap(0,a,b)
o.N(s,b,B.F)
if(s.h(0,"a")!=null&&!J.l(s.h(0,"a"),0)&&!J.l(s.h(0,"a"),1))o.j(new A.b(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.l(s.h(0,"x"),""))o.j(new A.b(b,"x"),"Expressions")
r=new A.b(b,"k")
q=s.h(0,"k")
if(!J.l(s.h(0,"a"),1)){if(t.j.b(q)){p=J.O(q)
p=p.gcf(q)&&p.ga6(q) instanceof A.F&&J.ae(p.ga6(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p){p=o.bf(q,r,c,g,e,null,0,0)
return new A.z(p,null,!1,new Float32Array(0),!1)}if(!t.j.b(q)||J.ir(q))o.j(r,"Expected keyframes")
return o.ew(q,r,c,g,f,e)},
I(a,b,c,d){return this.br(a,b,c,d,null,!1,0)},
aX(a,b,c,d,e){return this.br(a,b,c,d,null,e,0)},
dl(a,b,c,d,e){return this.br(a,b,c,d,e,!1,0)},
fk(a,b,c,d,e){return this.br(a,b,c,d,null,!1,e)},
dm(a,b,c,d){var s
A.j(c)
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
o=n.bv(r.h(a,q),b,q)
s.$flags&2&&A.f(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gk(a)>2&&n.O(r.h(a,2),b)!==d)n.j(b,"Non-planar component")}else{if(c!==1)n.j(b,"Expected "+c+" components")
r=n.bv(a,b,0)
s.$flags&2&&A.f(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
ew(e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3=this,e4=null,e5="Expected object",e6=t.j
e6.a(e7)
t.c.a(f2)
s=J.bv(e7)
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
for(j=s.gG(e7),i=0,h=0,g=!1;j.v();){f=j.gB()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.l(f.h(0,"h"),1))++h
g=B.t.bC(g,f.h(0,"to")!=null)}j=h*(f1?8:4)
e=new Float64Array(j)
if(g)d=new Float32Array(m*4)
else d=e4
c=A.dY()
b=A.dY()
a=A.dY()
a0=A.dY()
for(a1=2*m,a2=m-1,a3=m+i,a4=e3.a.a,a5=e9===2,a6=m,a7=0,a8=0,a9=0;a9<s.gk(e7);++a9){b0=new A.b(e8,a9)
b1=s.h(e7,a9)
if(!q.b(b1))e3.j(b0,e5)
e3.N(b1,b0,B.aO)
b2=b1.h(0,"to")
b3=b1.h(0,"ti")
b4=b2==null
b5=!b4
if(b5)e3.dv(b2,"to",e9,b0,d,a9*4)
b6=b3==null
if(!b6)e3.dv(b3,"ti",e9,b0,d,a9*4+2)
if(b4!==b6)e3.j(b0,"Incomplete spatial tangents")
b7=e3.bv(b1.h(0,"t"),b0,"t")
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
if(b.b!==b)A.w(A.eL(""))
b.b=c0
if(a.b!==a)A.w(A.eL(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.w(A.eL(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.w(A.eL(""))
c.b=b4
b6=a.b
if(b6===a)A.w(A.aj(""))
B.j.L(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.w(A.aj(""))
if(typeof b4!=="number")return A.Z(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.w(A.aj(""))
b6=a.b
if(b6===a)A.w(A.aj(""))
if(typeof b6!=="number")return A.Z(b6)
J.jj(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.w(A.aj(""))
b6=a.b
if(b6===a)A.w(A.aj(""))
e3.bf(b8,new A.b(b0,"s"),e9,f0,f2,b4,c1,b6)}}c2=J.l(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.w(A.aj(""))
if(typeof b4!=="number")return A.Z(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.w(A.aj(""))
b5=a.b
if(b5===a)A.w(A.aj(""))
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
if(b4===a)A.w(A.aj(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e3.j(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e3.j(b0,"Easing component mismatch")
if(f1){b1=a.b
if(b1===a)A.w(A.aj(""))}else{b1=a.b
if(b1===a)A.w(A.aj(""))
b1=Math.min(A.ks(b1),1)}d4=Math.min(A.ks(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e6.b(c8),b4=e6.b(c7),b5=e6.b(c6),b6=e6.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.O(c5)
d6=d6.h(c5,d6.gk(c5)===1?0:d5)}else d6=c5
d7=B.c.A(A.ej(d6),0,1)
if(b5){d6=J.O(c6)
d6=d6.h(c6,d6.gk(c6)===1?0:d5)}else d6=c6
A.ej(d6)
if(b4){d8=J.O(c7)
d8=d8.h(c7,d8.gk(c7)===1?0:d5)}else d8=c7
d9=B.c.A(A.ej(d8),0,1)
if(b1){d8=J.O(c8)
d8=d8.h(c8,d8.gk(c8)===1?0:d5)}else d8=c8
A.ej(d8)
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
J.jj(e6,c1,c1+s,c.am(),a8)
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
e2=A.bG(0,a7,B.a.a2(e.byteLength,e1))*e1
if(B.a.M(e2,8)!==0)A.w(A.au("The number of bytes to view must be a multiple of 8",e4))
p=J.l3(B.i.gaa(e),e.byteOffset+0*e1,B.a.H(e2,8))}p=A.lW(l,e6,s,k,q,p,d,a4)
return new A.z(e4,p,a4,new Float32Array(p.b),!1)},
dv(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.aD(a)<2)o.j(new A.b(d,b),"Invalid spatial tangent")
if(c!==2&&J.l1(a,new A.fy()))o.j(new A.b(d,b),"Spatial tangent on non-position")
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
return 1}for(s=J.bv(a),r=s.gG(a);r.v();)this.O(r.gB(),b)
return s.gk(a)}}
A.fz.prototype={
$1(a){var s,r,q
t.D.a(a)
s=!1
if(a.gF()){r=this.a
q=r.d
q===$&&A.C()
if(a.c<=q){s=r.e
s===$&&A.C()
s=a.d>=s}}return s},
$S:23}
A.fp.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.b(new A.b(q.b,"ef"),a),o=q.a,n=o.ap(0,J.ae(q.c,a),p)
o.N(n,p,B.E)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.l(s,r[a])||n.h(0,"v")==null)o.j(p,"Invalid effect parameter")
return o.I(n.h(0,"v"),new A.b(p,"v"),b,A.h([],t.n))},
$1(a){return this.$2$dimensions(a,1)},
$S:24}
A.fq.prototype={
$2(a,b){var s,r=this.b.$1(a)
if(r.a!=null){s=r.n(0)
if(0>=s.length)return A.a(s,0)
s=s[0]!==b}else s=!0
if(s)this.a.j(new A.b(new A.b(new A.b(this.c,"ef"),a),"v"),"Unsupported effect parameter value")},
$S:25}
A.fo.prototype={
$1(a){return J.l(J.ae(a,"ind"),this.a)},
$S:12}
A.fv.prototype={
$2(a,b){var s=this.a,r=this.c,q=s.I(this.b.h(0,a),new A.b(r,a),1,A.h([b],t.n))
if(q.a==null)s.j(new A.b(r,a),"Animated Inner Shadow")
s=q.n(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:27}
A.fw.prototype={
$5(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=t.j
if(e.b(a)){s=J.O(a)
s=s.gk(a)===1&&s.ga6(a) instanceof A.F}else s=!1
if(s)a=J.l7(a)
s=this.b
r=s.ap(0,a,b)
s.N(r,b,B.aM)
q=r.h(0,"c")
if(!A.bc(q))s.j(new A.b(b,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.t.bC(p.c,q!==o)
o=b.a
n=o==null?null:o.b
if(A.r(n)){m=p.a
if(m==null){o=J.aD(e.a(J.ae(this.c,"k")))
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
e=e.gk(l)!==J.aD(k)||e.gk(l)!==J.aD(j)}else e=p
else e=p
else e=p
if(e)s.j(b,"Invalid path topology")
e=J.O(l)
i=s.dm(b,c,e.gk(l)*6,a0)
h=new A.fx(s,b,i)
for(g=0;g<e.gk(l);++g){f=d+g*6
h.$2(e.h(l,g),f)
h.$2(J.ae(k,g),f+2)
h.$2(J.ae(j,g),f+4)}return i},
$S:8}
A.fx.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.aD(a)!==2)m.a.j(m.b,"Expected 2D path point")
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
A.fu.prototype={
$1(a){var s,r,q,p
t.cH.a(a)
for(s=a.length,r=this.a,q=0;q<a.length;a.length===s||(0,A.T)(a),++q){p=a[q]
if(p instanceof A.P)B.b.m(r,p)
if(p instanceof A.a_)this.$1(p.a)}},
$S:30}
A.fs.prototype={
$1(a){return t.bD.a(a).a},
$S:31}
A.ft.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a_)||a.gdO()},
$S:1}
A.fr.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.O(a)
r=k.b*4
s=s.gk(a)<r||(s.gk(a)-r&1)===1}else s=!0
if(s)k.a.j(b,"Invalid gradient stops")
s=k.a
r=J.O(a)
q=s.dm(b,c,r.gk(a),e)
for(p=k.b,o=0;o<r.gk(a);++o){n=s.O(r.h(a,o),b)
if(o<p*4&&B.a.M(o,4)!==0){m=B.a.A(B.c.D(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.f(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:8}
A.fy.prototype={
$1(a){return!J.l(a,0)},
$S:12}
A.fF.prototype={
c4(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
t.ew.a(d)
t.ae.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.jf()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.r(n)?new A.b(p,n):new A.b(p,A.H(n))}if(this.fa(a,r,b,p,e==null?new A.bO(t.ao):e))return}for(q=a.gao(),q=q.gG(q),m=t.j;q.v();){l=q.gB()
k=a.h(0,l)
if(!s.b(k)&&!m.b(k))continue
B.b.m(d,l)
this.c4(k,b,c,d,e,l==="ks"&&J.l(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a))for(m=J.O(a),j=0;j<m.gk(a);++j){k=m.h(a,j)
if(!s.b(k)&&!q.b(k))continue
B.b.m(d,j)
this.dt(k,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
fl(a,b,c,d){return this.c4(a,b,c,d,null,!1)},
dt(a,b,c,d,e){return this.c4(a,b,c,d,e,!1)},
fa(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null
t.P.a(a0)
t.bC.a(a4)
if(!a4.m(0,a0))b.a.j(a3,"Cyclic expression reference")
try{i=$.kS()
if(i.b.test(a1)){a0.J(0,"x")
return!0}s=new A.b(a3,"x")
r=$.kQ().dL(a1)
if(r==null)b.a.j(s,"Unsupported expression syntax")
q=a2
p=null
i=$.jg()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dw(0,h)
h=new A.c8(h.a,h.b,h.c)
i=t.j
g=t.d
f=b.a
while(h.v()){e=h.d
o=e==null?g.a(e):e
d=o.b
if(1>=d.length)return A.a(d,1)
d=d[1]
d.toString
n=d
d=$.kR()
c=A.H(n)
m=d.b.test(c)?B.x.dJ('"'+A.u(n)+'"',a):n
p=b.c2(q,"nm",A.H(m))
if(p==null)f.j(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.A)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=b.c2(q,"ty","tr")
l=i==null?a:i.h(0,"s")
break
case"transform.rotation":i=b.c2(q,"ty","tr")
l=i==null?a:i.h(0,"r")
break
default:i=p
l=i==null?a:J.ae(i,"o")
break}k=l
j=f.ap(0,k,s)
if(j===a0){a0.J(0,"x")
return!0}b.dt(j,a2,s,A.h([],t.f),a4)
a0.l(0)
a0.ah(0,j)
return!1}finally{a4.J(0,a0)}},
c2(a,b,c){var s,r,q,p
for(s=J.co(a),r=t.P,q=null;s.v();){p=s.gB()
if(!r.b(p)||!J.l(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q}}
A.hr.prototype={
cp(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.ap(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.ae(j,"x")
s=typeof n=="string"?$.jf().dL(n):null
if(s==null){k=k.d1(j,b)
i.u(0,j,k)
return k}r=new A.b(b,"x")
k.N(j,b,B.F)
if(J.ae(j,"a")!=null&&!J.l(J.ae(j,"a"),0)&&!J.l(J.ae(j,"a"),1))k.j(new A.b(b,"a"),"Invalid animated flag")
m=l.d
if(!m.m(0,j))k.j(r,"Cyclic path reference")
try{q=null
p=null
o=l.fj(s,r)
q=o.a
p=o.b
k=l.cp(q,p)
i.u(0,j,k)
return k}finally{m.J(0,j)}},
fj(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.cX(j.b,s,B.m,b,"layer")
q=r.a
if(!J.l(q.h(0,"ty"),4))j.a.j(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.b(r.b,"shapes")
s=$.jg()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dw(0,i)
i=new A.c8(i.a,i.b,i.c)
s=t.d
while(i.v()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.cX(p,m,o,b,"content")
q=l.a
o=l.b
p=J.l(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.b(o,"it")}k=q.h(0,"ks")
if(!J.l(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.j(b,"Path reference needs a B\xe9zier path")
return new A.G(k,new A.b(o,"ks"))},
cX(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.O(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gk(a);++m){l=s.h(a,m)
if(r.b(l)&&J.l(l.h(0,"nm"),b)){if(o!=null)q.j(d,p)
n=m
o=l}}if(o!=null)return new A.G(o,new A.b(c,n))}this.a.j(d,"Missing "+e+" reference: "+b)}}
A.e2.prototype={
a_(a,b,c){var s
A.nt(c,t.K,"T","_copy")
s=c.a(this.b.dU(c.a(a),c.i("0()").a(b)))
return s},
C(a){var s=t.aD
s.a(a)
if(a.a!=null)return a
return this.a_(a,new A.fU(a),s)},
dY(a){return this.a_(a,new A.fV(this,a),t.d1)},
ct(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.a_)return s.bB(a)
if(a instanceof A.P)return s.a_(a,new A.fO(s,a),r)
if(a instanceof A.ba)return s.a_(a,new A.fP(s,a),r)
if(a instanceof A.aI)return s.a_(a,new A.fQ(s,a),r)
if(a instanceof A.aq)return s.a_(a,new A.fR(s,a),r)
if(a instanceof A.aK)return s.a_(a,new A.fS(s,a),r)
if(a instanceof A.aT)return s.a_(a,new A.fT(s,a),r)
throw A.e(A.ax("Unknown compiled geometry"))},
fH(a){var s=t.h1
s.a(a)
if(a instanceof A.a_)return this.bB(a)
if(a instanceof A.b8)return this.a_(a,new A.fI(this,a),s)
throw A.e(A.ax("Unknown compiled paint"))},
bB(a){return this.a_(a,new A.fK(this,a),t.eV)},
e3(a){return this.a_(a,new A.fJ(this,a),t.cK)},
hd(a,b){return this.a_(b,new A.fW(this,b),t.e_)},
ft(a){return this.a_(a,new A.fH(this,a),t.bo)},
h0(a){var s=t.J
s.a(a)
return this.a_(a,new A.fM(this,a),s)},
ci(a){var s=t.D
s.a(a)
return this.a_(a,new A.fL(this,a),s)},
cq(a){return this.a_(a,new A.fN(this,a),t.I)}}
A.fU.prototype={
$0(){var s=this.a
return new A.z(s.a,s.b,s.c,new Float32Array(s.d.length),s.f)},
$S:38}
A.fV.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.C(o.a),m=p.C(o.b),l=p.C(o.c),k=p.C(o.d),j=p.C(o.e),i=o.f
i=i==null?q:p.C(i)
s=o.r
s=s==null?q:p.C(s)
r=o.w
r=r==null?q:p.C(r)
o=o.x
return A.iU(n,m,l,k,j,i,s,r,o==null?q:p.C(o))},
$S:39}
A.fO.prototype={
$0(){return new A.P(this.a.ct(this.b.a))},
$S:40}
A.fP.prototype={
$0(){var s=this.b
return new A.ba(this.a.hd(0,s.a),s.b)},
$S:41}
A.fQ.prototype={
$0(){var s=this.b,r=s.a,q=A.a2(r),p=q.i("V<1,x>")
r=A.aX(new A.V(r,q.i("x(1)").a(this.a.gb5()),p),p.i("ab.E"))
return A.lX(r,s.b)},
$S:42}
A.fR.prototype={
$0(){var s=this.b
return new A.aq(this.a.C(s.e),s.f,s.r)},
$S:43}
A.fS.prototype={
$0(){var s=this.b,r=this.a
return new A.aK(s.e,s.f,r.C(s.r),r.C(s.w),r.C(s.x))},
$S:44}
A.fT.prototype={
$0(){var s,r=this.b,q=this.a,p=q.C(r.r),o=q.C(r.w),n=q.C(r.x),m=q.C(r.y),l=q.C(r.z),k=r.Q
k=k==null?null:q.C(k)
s=r.as
q=s==null?null:q.C(s)
return new A.aT(r.e,r.f,p,o,n,m,l,k,q)},
$S:45}
A.fI.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a2(o),l=m.i("V<1,x>")
o=A.aX(new A.V(o,m.i("x(1)").a(n.gb5()),l),l.i("ab.E"))
m=n.C(p.b)
l=n.C(p.c)
s=n.C(p.d)
r=p.y
r=r==null?null:n.e3(r)
q=p.z
n=q==null?null:n.ft(q)
return A.iQ(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:46}
A.fK.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a2(q),n=o.i("V<1,x>")
q=A.aX(new A.V(q,o.i("x(1)").a(p.gb5()),n),n.i("ab.E"))
o=r.b
n=A.a2(o)
s=n.i("V<1,ay>")
o=A.aX(new A.V(o,n.i("ay(1)").a(p.gfG()),s),s.i("ab.E"))
return A.iO(q,o,p.dY(r.c))},
$S:47}
A.fJ.prototype={
$0(){var s,r=this.b,q=this.a,p=q.C(r.c),o=q.C(r.d),n=q.C(r.e),m=r.f
m=m==null?null:q.C(m)
s=r.r
q=s==null?null:q.C(s)
return A.jI(r.a,p,o,n,r.w,m,q)},
$S:48}
A.fW.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a2(r),o=p.i("V<1,x>")
r=A.aX(new A.V(r,p.i("x(1)").a(q.gb5()),o),o.i("ab.E"))
return A.mf(r,q.C(s.b),q.C(s.c),q.C(s.d),s.e)},
$S:49}
A.fH.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a2(r),o=p.i("V<1,z>")
r=A.aX(new A.V(r,p.i("z(1)").a(q.ghc()),o),o.i("ab.E"))
return A.jG(r,q.C(s.b))},
$S:50}
A.fM.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.C(q.e),o=s.C(r.c),n=r.e
s=n==null?null:s.C(n)
return new A.a3(new A.aq(p,q.f,q.r),r.b,o,r.d,s)},
$S:51}
A.fL.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.dY(l.a),j=l.b
j=j==null?n:m.bB(j)
s=l.f
s=s==null?n:m.cq(s)
r=l.x
r=r==null?n:m.C(r)
q=l.z
if(q==null)q=n
else{p=A.a2(q)
o=p.i("V<1,a3>")
q=A.aX(new A.V(q,p.i("a3(1)").a(m.gh_()),o),o.i("ab.E"))}p=l.at
p=p==null?n:new A.e1(m.C(p.a),m.C(p.b))
o=l.as
o=o==null?n:A.jJ(o.a,o.b,o.c)
r=A.jK(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.ci(k)
r.ch=l.ch
return r},
$S:52}
A.fN.prototype={
$0(){var s,r,q,p,o=this.b,n=A.iL(o.a),m=o.b
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
r=A.a2(o)
B.b.ah(m,new A.V(o,r.i("a0(1)").a(s.gfX()),r.i("V<1,a0>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.ci(p)}}return n},
$S:53}
A.b6.prototype={
gfR(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.n(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
fM(a,b,c){var s,r,q,p,o=this.f
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
return new A.G(Math.cos(p)*r,Math.sin(p)*r)},
ev(a,b){var s,r,q,p,o,n,m
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
$ix:1}
A.ba.prototype={
gF(){return this.a.gF()},
ga5(){return this.a.gF()},
a7(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].a7(a)},
$ix:1}
A.bT.prototype={
gF(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.b.ab(r.a,new A.hD())
r.f!==$&&A.M()
q=r.f=s}return q}}
A.hD.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.cc.prototype={
gF(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.b.ab(r.a,new A.fA())
r.e!==$&&A.M()
q=r.e=s}return q}}
A.fA.prototype={
$1(a){return t.aD.a(a).a!=null},
$S:82}
A.bH.prototype={
gez(){var s=this.a
return s}}
A.ii.prototype={
$1(a){var s,r,q=this.b
if(q.gt().length<a){s=Math.max(65536,q.gt().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.aq(s,0)}},
$S:13}
A.ij.prototype={
$1(a){return A.bn(this.a.gt(),0,a)},
$S:56}
A.ik.prototype={
$1(a){var s,r=this,q=r.b
if(q.gt().length<=262144){r.a.a=0
return}if(a<=65536){s=r.a
if(++s.a>=16){s.a=0
s=r.c
s.a=null
s.b=-1
q.aq(65536,0)}}else r.a.a=0},
$S:13}
A.im.prototype={
$3(a,b,c){var s
if(!this.a.fQ(b,c))return
s=this.b.J(0,a)
if(s==null)return
this.c.cj(s)},
$S:57}
A.il.prototype={
$2(a,b){var s,r,q,p,o=this,n=o.a,m=n.J(0,a)
if(m!=null)o.b.cj(m)
o.c.J(0,a)
for(s=o.b,r=A.n(n).i("U<1>");n.a>=8;){q=new A.U(n,r).gG(0)
if(!q.v())A.w(A.aw())
p=n.J(0,q.gB())
p.toString
s.cj(p)}n.u(0,a,b)},
$S:58}
A.io.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.a1(3,a,b):new A.a1(1,a,s)
this.b.au(r)},
$S:59}
A.ih.prototype={
$1(i3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1=this,i2=null
A:{if(i3==null){d4=i1.b
d4.c8()
d4.dF()
i1.c.l(0)
i1.d.a0()
i1.e.a0()
i1.f.a.c7()
A.t(v.G.self).close()
return}d5=t.k.b(i3)
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
if(d8){A.hN(d6)
d7=i3.c
d4=A.r(d7)
if(d4){A.j(d7)
e0=d7}d9=d6}}}else{e1=i2
e2=!1}if(d4){d4=i1.b
d4.b=A.j(e0)
d4.bQ(0)
d4.e8(d9)
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
e2=e6}A.H(e8)
if(d8)d4=d7
else{d7=i3.c
d4=d7
d8=e7}d4=d4 instanceof A.bH
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
e2=e6}s=A.H(e8)
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
d4=A.bc(f0)
if(d4){A.bu(f0)
q=f0}}}}}if(d4){try{p=t.P.a(B.x.dJ(B.O.fu(A.nx(r)),i2))
d4=s
e8=A.iL(new A.ez(q))
e8.fq(p)
i1.r.$2(d4,new A.bH(e8))}catch(f2){o=A.ad(f2)
d4=i1.w
if(d4.a>=8)d4.J(0,new A.U(d4,A.n(d4).i("U<1>")).ga6(0))
d4.u(0,s,J.bx(o))}break A}n=null
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
e2=e6}if(A.r(e8)){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}n=A.j(e8)
if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=e7}if(typeof e8=="string"){if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=e7}m=A.H(e8)
if(f1)e8=f0
else{f0=i3.a[3]
e8=f0
f1=g5}f4=typeof e8=="string"
if(f4){if(f1)e8=f0
else{f0=i3.a[3]
e8=f0
f1=g5}l=A.H(e8)
e8=i3.a
f3=e8[4]
f6=typeof f3=="number"
if(f6){A.Q(f3)
k=f3
f5=e8[5]
f8=A.r(f5)
if(f8){A.j(f5)
j=f5
f7=e8[6]
g0=A.r(f7)
if(g0){A.j(f7)
i=f7
f9=e8[7]
g2=A.r(f9)
if(g2){A.j(f9)
h=f9
g1=e8[8]
g4=A.r(g1)
if(g4){A.j(g1)
g=g1
g3=e8[9]
d4=A.bc(g3)
if(d4){A.bu(g3)
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
c=d4.e_(h0,d,e9,j,g7,g9,g8,g6)
if(c){i1.Q.$3(l,m,g)
b=new Uint8Array(A.R(d))
i1.f.au(new A.ch([0,n,m,b,!1,-1,d4.x+d4.Q]))
i1.as.$1(e)
if(!f){e8=m
e9=i
g6=h
g7=g
d4.dT(e8,j,g6,g7,e9)}return}e9=i1.c
a=e9.J(0,l)
if(a==null){i1.at.$2(n,l)
return}e9.u(0,l,a)
h0.a=null
h0.b=-1
e9=k
g6=i
g7=h
A.kl(a.gez(),e9,i1.e,g6,g7,i1.d,i2)
a0=e8.$1(e)
e8=m
g7=i
g6=h
e9=g
g8=f
a1=d4.cv(e8,j,g6,g8,i1.ax,a0,e9,g7)
a2=new Uint8Array(A.R(a0))
i1.f.au(new A.ch([0,n,m,a2,!0,a1.b,d4.x+d4.Q]))
i1.as.$1(e)
i1.Q.$3(l,m,g)}catch(f2){a3=A.ad(f2)
i1.f.au(new A.a1(1,n,J.bx(a3)))}break A}a4=null
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
e2=e6}if(A.r(e8)){if(e2)e8=d6
else{d6=i3.a[1]
e8=d6
e2=e6}a4=A.j(e8)
if(d8)e8=d7
else{d7=i3.a[2]
e8=d7
d8=!0}if(typeof e8=="string"){a5=A.H(d8?d7:i3.a[2])
if(f1)e8=f0
else{f0=i3.a[3]
e8=f0
f1=!0}if(typeof e8=="string"){a6=A.H(f1?f0:i3.a[3])
if(f4)e8=f3
else{f3=i3.a[4]
e8=f3
f4=!0}if(A.r(e8)){a7=A.j(f4?f3:i3.a[4])
if(f6)e8=f5
else{f5=i3.a[5]
e8=f5
f6=!0}if(A.r(e8)){a8=A.j(f6?f5:i3.a[5])
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
g2=!0}if(A.r(e8)){b1=A.j(g2?g1:i3.a[8])
if(g4)e8=g3
else{g3=i3.a[9]
e8=g3
g4=!0}if(A.r(e8)){b2=A.j(g4?g3:i3.a[9])
e8=i3.a
h1=e8[10]
if(A.r(h1)){b3=A.j(h1)
h2=e8[11]
d4=A.bc(h2)
if(d4)b4=A.bu(h2)}}}}}}}}}}}}if(d4){try{d4=i1.z
d4.a=null
d4.b=-1
d4=a8
if(typeof d4!=="number")return d4.e4()
b5=d4>1?1:0
e8=a8
e9=b2
if(typeof e8!=="number")return e8.ad()
if(typeof e9!=="number")return A.Z(e9)
g6=a8
if(typeof g6!=="number")return g6.ea()
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
if(typeof d4!=="number")return d4.e4()
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
e8=i1.b
e9=i1.c
g6=i1.d
g7=i1.e
g8=t.a
for(;;){g9=c4
h0=a8
if(typeof g9!=="number")return g9.e5()
if(typeof h0!=="number")return A.Z(h0)
if(!(g9<h0))break
B:{g9=a7
h0=c4
if(typeof g9!=="number")return g9.aP()
if(typeof h0!=="number")return A.Z(h0)
c5=A.nS(g9+h0,b3,b0)
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
h0=A.j(c8)
h3=A.j(b8)
g9=h0+h3
A.bG(h0,g9,g7.b)
h4=g7.c
h5=h4==null
h6=h5?i2:h4+h0*4
if(h5){h5=g7.d
h5.toString
g9=A.jE(h5,h0,g9)}else g9=i2
c9=new A.aZ(!1,h3,h6,g9)
g9=a5
h6=b1
h3=b2
h0=b3
h5=b4
h7=c9
h8=h7.c
if(h8!=null){h9=g8.a(A.t($.k.memory).buffer)
i0=h7.b
h7=new Uint32Array(h9,h8,i0)}else{h7=h7.d
h7.toString}d0=e8.hg(A.bn(h7,0,i2),g9,c5,h3,h5,h0,h6)
if(d0){g9=c0
if(typeof g9!=="number")return g9.aP()
c0=g9+1
if(c2==null)c2=c5
break B}if(c3==null)c3=e9.J(0,a6)
if(c3==null){i1.at.$2(a4,a6)
return}e9.u(0,a6,c3)
g9=c3
h0=b1
h3=b2
g9=g9.a
A.kl(g9,c6,c9,h0,h3,g6,i2)
g9=b9
if(typeof g9!=="number")return g9.aP()
b9=g9+1
g9=a5
h0=b1
h3=b2
h5=b3
h6=b4
h7=c9
h8=h7.c
if(h8!=null){h9=g8.a(A.t($.k.memory).buffer)
i0=h7.b
h7=new Uint32Array(h9,h8,i0)}else{h7=h7.d
h7.toString}d1=e8.cv(g9,c5,h3,h6,d4,A.bn(h7,0,i2),h5,h0)
if(d1.b>0)c1=d1.b}g9=c4
if(typeof g9!=="number")return g9.aP()
c4=g9+1}d2=new Uint8Array(A.R(i1.y.$1(b7)))
i1.f.au(new A.cf([4,a4,a5,a7,a8,d2,b9,c0,c1,e8.x+e8.Q,b1,b6]))
i1.as.$1(b7)
i1.Q.$3(a6,a5,b3)
if(!b4&&c2!=null){d4=a5
e9=b1
b2=b2
g6=b3
e8.dT(d4,c2,b2,g6,e9)}}catch(f2){d3=A.ad(f2)
i1.f.au(new A.a1(1,a4,J.bx(d3)))}break A}m=i2
d4=!1
if(t.ei.b(i3)){if(d5)e8=e1
else{e1=i3.a
e8=e1
d5=!0}if(3===e8){if(e2)d4=d6
else{d6=i3.b
d4=d6
e2=!0}d4=typeof d4=="string"
if(d4)m=A.H(e2?d6:i3.b)}}if(d4){d4=i1.b
d4.fF(m)
d4.fK(m)
i1.f.au(new A.a1(2,m,d4.x+d4.Q))
break A}if(t.dn.b(i3))d4=4===(d5?e1:i3.a)
else d4=!1
if(d4){d4=i1.z
d4.a=null
d4.b=-1
d4=i1.b
d4.dF()
d4.c8()
d4.cr()
i1.c.l(0)
i1.w.l(0)
e8=i1.d
e8.dW()
e8.dZ(!0)
e8=i1.ax
e8.c=0
if(e8.b.length>131072)e8.b=new Uint8Array(131072)
i1.a.a=0
e8=i1.e
if(e8.gt().length>65536)e8.aq(65536,0)
i1.f.au(new A.a1(2,"",d4.x+d4.Q))}}},
$S:60}
A.eZ.prototype={
aJ(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i=this
if(!i.y&&i.b){i.y=!0
i.x=A.lz()}s=i.x
if(s!=null){r=a.f
if(r>4096||a.r>256)i.z=!0
q=s.f
p=s.h2(a.a,a.b,a.c,a.d,r,a.r,b,d,e,f,g,c.a,!1)
i.r=i.r+(s.f-q)
if(p>=0){o=A.dE(t.a.a(A.t($.k.memory).buffer),s.b,4)
c.b=p
r=o.length
if(0>=r)return A.a(o,0)
c.c=o[0]
if(1>=r)return A.a(o,1)
c.d=o[1]
if(2>=r)return A.a(o,2)
c.e=o[2]
if(3>=r)return A.a(o,3)
c.f=o[3]
return}}r=i.ax
if(r==null){r=new Int32Array(8192)
n=new Int32Array(8192)
m=new Int32Array(8192)
l=new Int32Array(8192)
k=Math.max(64,256)
j=new Int32Array(k)
B.e.T(j,0,k,-1)
l=i.ax=new A.fX(k,j,r,n,m,l)
r=l}r.h3(a,b,c,d,e,f,g)},
d7(a,b){var s=this.Q,r=s.J(0,a)
if(r==null)return null
if(r.b.E(0,b)){s.u(0,a,r)
return r.c}this.as=this.as-r.d
r.c.a.a0()
return null},
d6(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.Q
r=s.$ti.i("U<1>")
for(;;){if(!(m.as+l>1048576||s.a>=256))break
q=new A.U(s,r).gG(0)
if(!q.v())A.w(A.aw())
p=s.J(0,q.gB())
m.as=m.as-p.d
o=p.c.a
n=o.b
if(n!=null){$.k.free(n)
o.b=null}}r=m.at
r.toString
o=Math.max(1,c.b)*2
n=new A.b_(o)
n.b7(o)
n=new A.az(n)
n.dI(c)
s.u(0,a,new A.bK(r,b,n,l))
m.as+=l},
dc(a,b){var s,r,q,p=this.to,o=p.h(0,a)
if(o!=null)return o.b
if(p.a>=512)p.l(0)
s=this.dy
s.l(0)
A.hV(a,b,0.01,s)
r=Math.max(1,s.f)
q=A.d0(Math.max(1,s.r),r)
B.i.L(q.a,0,s.f,s.a)
B.i.L(q.b,0,s.f,s.b)
B.e.L(q.c,0,s.r,s.c)
B.e.L(q.d,0,s.r,s.d)
B.d.L(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
r=this.at
r.toString
p.u(0,a,new A.a8(r,q,t.gN))
return q},
gc_(){var s=this.ay
if(s==null){s=new A.b_(2048)
s.b7(2048)
s=this.ay=new A.az(s)}return s},
gbK(){var s=this.ch
if(s==null){s=new A.b_(2048)
s.b7(2048)
s=this.ch=new A.az(s)}return s},
gbk(){var s=this.CW
if(s==null){s=new A.b_(2048)
s.b7(2048)
s=this.CW=new A.az(s)}return s},
gdd(){var s,r,q=this.ok
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.ok=new A.hu(this.k4,new A.bq(q),new A.bq(s),new A.bq(r),new A.bq(new Float64Array(256)))}return q},
ep(a,b){var s,r,q,p
for(s=this.k2;s.length<=a;){r=Math.max(16,b)
B.b.m(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.b.u(s,a,q)}return q},
er(a){var s,r,q,p,o
for(s=this.fr;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eq(a){var s,r,q,p,o
for(s=this.fx;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
al(a){var s,r
for(s=this.p1;s.length<=a;){r=new A.b_(2048)
if($.k!=null)r.b=A.aM(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.az(r))}s=s[a]
s.l(0)
return s},
eo(a){var s,r,q,p,o
for(s=this.fy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
en(a){var s,r,q,p,o
for(s=this.go;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cT(a){var s
for(s=this.id;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
em(a){var s,r,q,p,o
for(s=this.p2;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
el(a){var s,r,q,p,o
for(s=this.p3;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cB(a){var s,r
for(s=this.p4;s.length<=a;){r=new A.b_(2048)
if($.k!=null)r.b=A.aM(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.az(r))}return s[a]},
ek(a){var s,r
for(s=this.R8;s.length<=a;){r=new A.b_(2048)
if($.k!=null)r.b=A.aM(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.az(r))}return s[a]},
f5(){var s,r,q,p,o
for(s=this.x2,r=new A.aE(s,s.r,s.e,s.$ti.i("aE<2>"));r.v();){q=r.d.b
if(q.a&&q.c!=null){p=$.k
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.l(0)},
cj(a){var s=this,r=a.a
s.Q.bx(0,new A.f_(s,r))
s.to.bx(0,new A.f0(r))
s.x1.bx(0,new A.f1(r))
s.x2.bx(0,new A.f2(r))},
dW(){var s,r,q,p,o=this
for(s=o.Q,r=new A.aE(s,s.r,s.e,s.$ti.i("aE<2>"));r.v();){q=r.d.c.a
p=q.b
if(p!=null){$.k.free(p)
q.b=null}}s.l(0)
o.as=0
o.to.l(0)
o.x1.l(0)
o.f5()},
a0(){var s,r,q,p,o,n,m=this
m.dW()
s=m.xr
if(s!=null)s.a0()
m.xr=null
s=m.x
if(s!=null)s.h7()
m.x=null
s=m.ay
if(s!=null)s.a.a0()
s=m.ch
if(s!=null)s.a.a0()
s=m.CW
if(s!=null)s.a.a0()
m.ay=m.ch=m.CW=null
for(s=m.p4,r=s.length,q=0;q<s.length;s.length===r||(0,A.T)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.k.free(o)
p.b=null}}for(r=m.R8,p=r.length,q=0;q<r.length;r.length===p||(0,A.T)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.k.free(n)
o.b=null}}B.b.l(s)
B.b.l(r)
B.b.l(m.p2)
B.b.l(m.p3)
for(s=m.p1,r=s.length,q=0;q<s.length;s.length===r||(0,A.T)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.k.free(o)
p.b=null}}B.b.l(s)
m.d3()
m.ax=null},
dZ(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.rx=0
if(a){i.ry=0
i.z=!1}s=i.x
if(s!=null)r=a||s.e>65536||s.c>8192||s.d>512
else r=!1
if(r){if(s.e>65536){$.k.fl_dense_trim(s.a,65536)
s.e=0}if(s.c>8192){$.k.free(s.r)
$.k.free(s.w)
s.w=s.r=s.c=0}if(s.d>512){$.k.free(s.x)
$.k.free(s.y)
s.y=s.x=s.d=0}}if(a){r=i.xr
if(r!=null)r.a0()
i.xr=null
i.d3()
B.b.l(i.fr)
B.b.l(i.fx)
B.b.l(i.fy)
B.b.l(i.go)
B.b.l(i.k2)
B.b.l(i.id)
B.b.l(i.k1)
B.b.l(i.y1)
i.ok=null}else{for(r=i.RG,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
if(n!=null)if(p<5){o=n.c
if(o!=null){m=q.a(A.t($.k.memory).buffer)
l=n.b
o=new Uint32Array(m,o,l)}else{o=n.d
o.toString}o=o.length>262144}else o=!0
else o=!1
if(o){if(n.a&&n.c!=null){o=$.k
o.toString
m=n.c
m.toString
o.free(m)
n.c=null}B.b.u(r,p,null)}}if(o>5)B.b.sk(r,5)
r=i.fr
q=r.length
B.b.b1(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.T)(r),++k)r[k].af()
r=i.fx
q=r.length
B.b.b1(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.T)(r),++k)r[k].af()
r=i.fy
q=r.length
B.b.b1(r,Math.min(2,q),q)
q=i.go
r=q.length
B.b.b1(q,Math.min(2,r),r)
for(r=q.length,k=0;k<q.length;q.length===r||(0,A.T)(q),++k)q[k].af()
r=i.k2
q=r.length
B.b.b1(r,Math.min(2,q),q)
for(p=0;p<r.length;++p)if(r[p].length>4096)B.b.u(r,p,new Float64Array(64))
r=i.ok
if(r!=null){r.b.af()
r.c.af()
r.d.af()
r.e.af()
r=r.f
if(r!=null)r.af()}}i.cx.Z(a)
i.cy.Z(a)
i.db.Z(a)
i.dx.Z(a)
i.dy.Z(a)
for(r=i.fy,p=0;p<r.length;++p)r[p].Z(a)
if(a){for(r=i.p1,q=r.length,k=0;k<r.length;r.length===q||(0,A.T)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.k.free(m)
o.b=null}}B.b.l(r)}else for(r=i.p1,q=r.length,k=0;k<r.length;r.length===q||(0,A.T)(r),++k)r[k].af()
r=i.ay
if(r!=null)r.Z(a)
r=i.ch
if(r!=null)r.Z(a)
r=i.CW
if(r!=null)r.Z(a)
for(r=i.p2,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.p3,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.p4,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.R8,p=0;p<r.length;++p)r[p].Z(a)
if(a)i.ax=null
else{r=i.ax
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
r.f=new Int32Array(8192)}}}i.k3.Z(a)},
he(){return this.dZ(!1)},
d3(){var s,r,q,p,o,n
for(s=this.RG,r=s.length,q=0;q<s.length;s.length===r||(0,A.T)(s),++q){p=s[q]
if(p!=null)if(p.a&&p.c!=null){o=$.k
o.toString
n=p.c
n.toString
o.free(n)
p.c=null}}B.b.l(s)},
aH(a,b){var s,r,q
if(b>this.rx)this.rx=b
s=this.RG
if(s.length<=a)B.b.sk(s,a+1)
if(!(a<s.length))return A.a(s,a)
r=s[a]
if(r==null){q=A.eU(b)
B.b.u(s,a,q)
return q}if(r.gt().length<b)r.aq(b,0)
return r},
c0(a){var s
for(s=this.y1;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
sf9(a){this.at=t.g_.a(a)}}
A.f_.prototype={
$2(a,b){var s
A.aN(a)
t.az.a(b)
if(b.a!==this.b)return!1
s=this.a
s.as=s.as-b.d
b.c.a.a0()
return!0},
$S:61}
A.f0.prototype={
$2(a,b){A.aN(a)
return t.gN.a(b).a===this.a},
$S:62}
A.f1.prototype={
$2(a,b){A.aN(a)
return t.e.a(b).a===this.a},
$S:63}
A.f2.prototype={
$2(a,b){t.cK.a(a)
t.dL.a(b)
if(b.a!==this.a)return!1
b.b.a0()
return!0},
$S:64}
A.bq.prototype={
aF(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
Z(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
af(){return this.Z(!1)}}
A.ah.prototype={
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
af(){return this.Z(!1)},
bj(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.i.L(o,0,r.f,q)
s=new Float64Array(p)
B.i.L(s,0,r.f,r.b)
r.a=o
r.b=s},
cU(){var s=this,r=s.c,q=r.length*2,p=new Int32Array(q)
B.e.L(p,0,s.r,r)
s.c=p
r=new Int32Array(q)
B.e.L(r,0,s.r,s.d)
s.d=r
r=new Uint8Array(q)
B.d.L(r,0,s.r,s.e)
s.e=r},
a4(a){var s,r,q,p=this
if(p.x)p.a1()
p.x=!0
p.w=p.f
if(p.r===p.c.length)p.cU()
s=p.c
r=p.r
q=p.w
s.$flags&2&&A.f(s)
if(!(r<s.length))return A.a(s,r)
s[r]=q
q=p.e
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
c5(a,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
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
b.c5(a,a0,o,n,i,h,e,d,a7,c)
b.c5(e,d,g,f,k,j,a5,a6,a7,c)},
U(a,b,c,d,e,f,g,h,i){return this.c5(a,b,c,d,e,f,g,h,i,0)},
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
j.a4(r[s]===1)
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
j.f=n+1}j.a1()}},
fn(a){var s,r,q,p,o,n,m,l=this
for(s=0;s<a.r;++s){r=a.c
if(!(s<r.length))return A.a(r,s)
q=r[s]
r=a.d
if(!(s<r.length))return A.a(r,s)
p=r[s]
if(p<=q)continue
r=a.e
if(!(s<r.length))return A.a(r,s)
l.a4(r[s]===1)
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
l.f=n+1}l.a1()}}}
A.a8.prototype={}
A.bK.prototype={}
A.az.prototype={
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
Z(a){var s
this.l(0)
s=a?1024:16384
if(this.a.gt().length>s*2)this.a.aq(2048,0)},
af(){return this.Z(!1)},
dI(a){var s=this,r=a.b*2
if(s.a.gt().length<r)s.a.aq(r,0)
B.e.L(s.a.gt(),0,r,a.a.gt())
s.b=a.b
s.c=a.c
s.d=a.d
s.e=a.e
s.f=a.f},
aL(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this
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
q.aq(q.gt().length*2,f.b*2)}g=f.a.gt()
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
e7(a){var s,r,q,p,o,n,m,l,k,j,i=this
if(a===0){i.l(0)
return}s=i.a.gt()
for(r=i.b*2,q=s.length,p=s.$flags|0,o=0,n=0;n<r;n+=2){m=n+1
if(!(m<q))return A.a(s,m)
l=s[m]
k=B.a.K(((l&255)+1)*a+128,8)
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
s[j]=(l&4294967040|k-1)>>>0}i.b=B.a.H(o,2)}}
A.fX.prototype={
aK(a){if(!isFinite(a))return 0
if(a>1048576)a=1048576
return B.c.D((a<-1048576?-1048576:a)*256)},
h3(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
d.bP()
d.CW=d.aK(g)
d.cx=d.aK(f)
for(e=i+1;e<h;++e){if(!(e<s))return A.a(k,e)
p=k[e]
if(!(e<r))return A.a(j,e)
o=j[e]
d.d5(d.aK(p),d.aK(o))}d.d5(d.aK(g),d.aK(f))}d.ee(b,c)},
bP(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
d8(a,b){var s=this
if(s.fr){if(s.cy===a&&s.db===b)return
s.bP()}s.cy=a
s.db=b
s.dy=s.dx=0
s.fr=!0},
aw(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.w
if(b<s){r.d8(s,a)
r.dx+=e
return}if(b>=r.y)return
r.d8(b,a)
r.dx+=e
r.dy=r.dy+(c+d)*e},
aB(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.x||a>=g.z)return
s=B.a.b2(B.a.K(b,8),32)
r=B.a.b2(B.a.K(d,8),32)
q=s*256
p=r*256
if(s===r){g.aw(a,s,b-q,d-q,f)
return}o=d-b
n=b-q
if(d>b){m=g.w
if(s<m){if(r<m){g.aw(a,m,0,0,f)
return}l=c+B.a.a2((g.Q-b)*f,o)
g.aw(a,m,0,0,l-c)
s=g.w
k=l
n=0}else k=c
for(;;){if(!(s<r&&s<g.y))break
j=s+1
i=c+B.a.a2((j*256-b)*f,o)
g.aw(a,s,n,256,i-k)
k=i
s=j
n=0}if(s<g.y)g.aw(a,s,n,d-p,e-k)}else{m=g.y
if(s>=m){if(r>=m)return
l=c+B.a.a2((g.at-b)*f,o)
s=m-1
k=l
n=256}else k=c
for(;;){if(!(s>r&&s>=g.w))break
i=c+B.a.a2((s*256-b)*f,o)
g.aw(a,s,n,0,i-k);--s
k=i
n=256}m=g.w
h=e-k
if(s<m)g.aw(a,m,0,0,h)
else g.aw(a,s,n,d-p,h)}},
d5(a,b){this.f8(a,b)
return},
f8(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.CW,b=d.cx
d.CW=a
d.cx=a0
s=a0-b
if(s===0)return
r=B.a.b2(B.a.K(b,8),32)
q=B.a.b2(B.a.K(a0,8),32)
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
i=c+B.a.a2((j-b)*k,s)
r=p}else{j=b
i=c}for(;;){if(!(r<q&&r<d.z))break
p=r+1
h=p*256
g=c+B.a.a2((h-b)*k,s)
d.aB(r,i,j-r*256,g,256)
j=h
i=g
r=p}if(r<d.z){o=r*256
d.aB(r,i,j-o,a,a0-o)}}else{if(m){j=d.ax
i=c+B.a.a2((j-b)*k,s)
r=n-1}else{j=b
i=c}if(r===q){if(r>=p){l=r*256
d.aB(r,i,j-l,a,a0-l)}return}f=r*256
e=c+B.a.a2((f-b)*k,s)
if(r>=p)d.aB(r,i,j-f,e,0);--r
i=e
for(;;){if(!(r>q&&r>=d.x))break
g=c+B.a.a2((r*256-b)*k,s)
d.aB(r,i,256,g,0);--r
i=g}if(r>=d.x)d.aB(r,i,256,a,a0-r*256)}},
ee(a,b){this.fi(a,b)
return},
fi(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.bP()
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
if(k>m&&l!==0){j=A.iM(l*512,a)
if(j>0)b.aL(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.iM(l*512-s[n],a)
if(j>0)b.aL(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.y){j=A.iM(l*512,a)
if(j>0)b.aL(o,m,i.y-m,j)}}i.ch=i.x-1
i.ay=i.z}}
A.hx.prototype={
$0(){var s,r,q=new Uint32Array(256)
for(s=1;s<256;++s){r=B.a.a2(16711680+s-1,s)
if(!(s<256))return A.a(q,s)
q[s]=r}return q},
$S:66}
A.hw.prototype={
$3(a,b,c){var s=this.a,r=this.b
return B.a.A(B.c.D((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
$S:67}
A.hz.prototype={
$1(a){var s,r,q=this
a+=q.a
s=q.b
if(s<0){r=q.c
a=r+(a-r)*r/(r-s)}s=q.d
if(s>1){r=q.c
a=r+(a-r)*(1-r)/(s-r)}return a},
$S:68}
A.hZ.prototype={
$2(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a.a
a0.l(0)
s=a.b
s.l(0)
r=a.c
A.hV(a1.a,r,a.d,a0)
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
k.aJ(s,!1,a2,j,i,h,g)
f=a1.e
if(f==null)e=null
else{r=f.n(r)
if(0>=r.length)return A.a(r,0)
r=r[0]
e=r}if(e==null)e=0
if(e!==0)r=a2.b===0&&e<0
else r=!0
if(r)return
d=k.dx
d.l(0)
A.mJ(a0,e,a.ay,d,k.gdd())
s.l(0)
s.aC(d,q,p,o,n,m,l)
c=k.al(3)
b=k.al(4)
k.aJ(s,!1,c,j,i,h,g)
a2.aS(b)
A.d2(b,c,a2,e>0?2:3)},
$S:69}
A.hW.prototype={
$8(a,b,c,d,e,f,g,h){this.a.U(g,h,a,b,c,d,e,f,this.b)},
$S:70}
A.hu.prototype={
fL(a,b,c,d,e,f,g){var s,r=!0
if(g.f===0)if(g.r===0)if(!g.x){s=a.f
if(s!==0)if(s<=1024){r=a.r
r=r===0||r>128}}if(r)return!1
r=this.f
if(r==null)r=this.f=new A.bq(new Float64Array(256))
r.aF(a.f*4)
while(g.c.length<a.r*2)g.cU()
for(;;)return!1}}
A.hT.prototype={
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
$S:71}
A.hU.prototype={
$6(a,b,c,d,e,f){var s
this.a.$7(a,b,c,d,e,f,0)
s=this.c
this.b.q(a+s*e,b+s*f)},
$S:72}
A.hS.prototype={
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
$S:73}
A.bS.prototype={
gcW(){var s=this.y
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
gcg(){var s,r=this,q=r.ax
if(q===$){s=A.iV(r.c,100,100)&&A.eg(r.d,0)&&A.eg(r.w,0)
r.ax!==$&&A.M()
q=r.ax=s}return q},
gaA(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gcg())if(A.iV(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.iV(q.b,0,0)
else r=A.eg(r,0)&&A.eg(q.r,0)
s=r}q.ay!==$&&A.M()
p=q.ay=s}return p},
gF(){var s,r=this,q=r.ch
if(q===$){s=r.gaN()&&r.e.a!=null
r.ch!==$&&A.M()
q=r.ch=s}return q},
gcd(){var s,r=this,q=r.CW
if(q===$){s=A.eg(r.e,100)
r.CW!==$&&A.M()
r.CW=s
q=s}return q},
cP(a){var s,r,q,p,o=this
if(o.as!==a)s=o.gaN()&&!isNaN(o.as)
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
dR(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gaN()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gcW()
a4.as=a6
r=a4.gcW()
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
r.$flags&2&&A.f(r)
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
cl(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaA())return a
if(b.gcg()){b.cP(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.a7(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.dR(a0)
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
return new A.a7(f-d,e-c,f+d,e+c)}}
A.a3.prototype={
gF(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gc6(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.hd.prototype={
aM(a){var s=this.c
return 255-A.ar((255-(B.a.fg(s,a)&255))*(s>>>24))}}
A.e1.prototype={
fo(a){var s,r,q,p=this.a.n(a),o=new A.fG(),n=this.b.n(a)
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
A.fG.prototype={
$1(a){return B.c.D(B.c.A(a,0,1)*255)},
$S:74}
A.a0.prototype={
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
r=r==null?p:B.b.ab(r,new A.hk())
r=r!==!1}else r=s}else r=s}else r=s}else r=s
s=r}}q.db!==$&&A.M()
o=q.db=s}return o},
gfP(){var s,r=this,q=r.dx
if(q===$){s=r.z
s=s==null?null:B.b.an(s,new A.hi())
r.dx!==$&&A.M()
q=r.dx=s===!0}return q},
gfS(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.b.ab(s,new A.hj())
r.dy!==$&&A.M()
q=r.dy=s===!0}return q},
gdP(){var s,r,q=this,p=q.fr
if(p===$){if(q.a.gaN()){s=q.cy
s=s==null?null:s.gdP()
r=s!==!1}else r=!1
q.fr!==$&&A.M()
p=q.fr=r}return p},
gdN(){var s,r,q=this,p=q.fx
if(p===$){if(q.a.gaA()){s=q.cy
s=s==null?null:s.gdN()
r=s===!0}else r=!0
q.fx!==$&&A.M()
p=q.fx=r}return p},
ar(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null
if(!h.e0(a))return g
s=h.f
r=s==null
if(r&&h.gF()&&!isNaN(h.go))return h.fy
if(h.go===a)return h.fy
h.go=a
q=h.b
p=q==null?g:q.aY(a)
if(!r){r=h.x
if(r!=null){r=r.n(a)
if(0>=r.length)return A.a(r,0)
r=r[0]
q=s.f
q===$&&A.C()
o=s.d
o===$&&A.C()
n=r*q-o}else n=(a-h.r)/h.w
p=A.bW(p,s.ar(n))}if(p==null)return h.fy=null
s=h.z
if(s!=null)r=s.length===1&&B.b.gae(s).gc6()||B.b.ab(s,new A.hl())
else r=!1
if(r){for(m=g,l=0;l<s.length;++l){k=s[l]
if(!k.d){r=k.b
r=r==="a"||r==="i"||r==="f"}else r=!1
if(r){r=k.a.a7(a)
if(r==null)j=g
else{q=k.e
if(q==null)q=g
else{q=q.n(a)
if(0>=q.length)return A.a(q,0)
q=q[0]}if(q==null)q=0
q=Math.max(0,q)
j=new A.a7(r.a-q,r.b-q,r.c+q,r.d+q)}if(j!=null)m=A.bW(m,j)}}if(m!=null){p=p.bu(m)
if(p.gW(0))return h.fy=null}}for(i=h;i!=null;i=i.cy)p=i.a.cl(p,a)
return h.fy=p},
e0(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
fY(a,b){var s=this.a.e.n(a)
if(0>=s.length)return A.a(s,0)
return B.a.A(B.c.Y(b*B.c.D(s[0])/100),0,255)},
aQ(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gc6()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.n(a)
if(0>=q.length)return A.a(q,0)
return B.a.A(B.c.D(q[0]*255/100),0,255)}return 255}}
A.hk.prototype={
$1(a){return t.J.a(a).gF()},
$S:2}
A.hi.prototype={
$1(a){return t.J.a(a).b!=="n"},
$S:2}
A.hj.prototype={
$1(a){t.J.a(a)
return a.b==="n"||a.gF()},
$S:2}
A.hl.prototype={
$1(a){t.J.a(a)
return a.b==="a"&&!a.d},
$S:2}
A.a_.prototype={
gdO(){var s,r=this,q=r.d
if(q===$){s=B.b.an(r.a,new A.h9())
r.d!==$&&A.M()
r.d=s
q=s}return q},
gb4(){var s,r=this,q=r.e
if(q===$){s=r.eP()
r.e!==$&&A.M()
r.e=s
q=s}return q},
eP(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.b.gae(n)
if(s instanceof A.a_){r=s.c
r=r.gaA()&&r.gcd()}else r=!1
return r?s.gb4():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.a_){r=o.c
r=r.gaA()&&r.gcd()}else r=!1
if(r){if(q==null)q=B.b.eb(n,0,p)
B.b.ah(q,o.gb4())}else if(q!=null)B.b.m(q,o)}return q==null?n:q},
gcs(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gb4()
r=null
if(!(s.length!==1)){q=B.b.gae(s)
A:{if(q instanceof A.b8){s=q
break A}if(q instanceof A.a_){s=q.gcs()
break A}s=r
break A}r=s}p.f!==$&&A.M()
o=p.f=r}return o},
gF(){var s,r=this,q=r.ax
if(q===$){s=r.c.gF()&&B.b.ab(r.a,new A.hb())&&B.b.ab(r.b,new A.hc())
r.ax!==$&&A.M()
q=r.ax=s}return q},
ga5(){var s,r=this,q=r.ay
if(q===$){s=r.c.gaN()&&B.b.ab(r.a,new A.ha())
r.ay!==$&&A.M()
q=r.ay=s}return q},
a7(a){var s,r,q,p,o=this
if(o.ga5()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.T)(s),++p)q=A.bW(q,s[p].a7(a))
if(q==null)return o.z=null
return o.z=o.c.cl(q,a)},
aY(a){var s,r,q,p,o,n=this
if(n.gF()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.n(a)
if(0>=r.length)return A.a(r,0)
if(B.c.D(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.T)(r),++o)p=A.bW(p,r[o].aY(a))
if(p==null)return n.Q=null
return n.Q=s.cl(p,a)},
$iay:1,
$ix:1}
A.h9.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a_)||a.gdO()},
$S:1}
A.hb.prototype={
$1(a){return t.u.a(a).gF()},
$S:1}
A.hc.prototype={
$1(a){return t.h1.a(a).gF()},
$S:76}
A.ha.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.aI.prototype={
gF(){var s,r=this,q=r.d
if(q===$){s=B.b.ab(r.a,new A.hn())
r.d!==$&&A.M()
r.d=s
q=s}return q},
ga5(){var s,r=this,q=r.e
if(q===$){s=B.b.ab(r.a,new A.hm())
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
for(o=j,n=0;n<s.length-1;++n)o=A.bW(o,s[n].a7(a))
if(o==null)return k.w=null
m=p.bu(o)
return k.w=m.gW(0)?j:m}if(q===3)--r
for(l=j,n=0;n<r;++n){if(!(n<s.length))return A.a(s,n)
l=A.bW(l,s[n].a7(a))}return k.w=l},
$ix:1}
A.hn.prototype={
$1(a){return t.u.a(a).gF()},
$S:1}
A.hm.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.e4.prototype={
ga5(){return this.gF()},
a7(a){var s=this
if(s.gF()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.ca(a)},
$ix:1}
A.aq.prototype={
gF(){return this.e.a!=null},
ca(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.n(a),f=g.length
if(f===0)return B.aK
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
if(h>q)q=h}return new A.a7(s,r,p,q)}}
A.aK.prototype={
gF(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
ca(a){var s,r,q,p=this.r.n(a),o=this.w.n(a),n=o.length
if(0>=n)return A.a(o,0)
s=Math.abs(o[0]*0.5)
if(1>=n)return A.a(o,1)
r=Math.abs(o[1]*0.5)
n=p.length
if(0>=n)return A.a(p,0)
q=p[0]
if(1>=n)return A.a(p,1)
n=p[1]
return new A.a7(q-s,n-r,q+s,n+r)}}
A.aT.prototype={
gF(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
ca(a){var s,r,q=this.w.n(a),p=this.y.n(a)
if(0>=p.length)return A.a(p,0)
p=p[0]
s=this.z.n(a)
if(0>=s.length)return A.a(s,0)
r=Math.abs(p)*(1+Math.abs(s[0]*0.01)*0.5)
s=q.length
if(0>=s)return A.a(q,0)
p=q[0]
if(1>=s)return A.a(q,1)
s=q[1]
return new A.a7(p-r,s-r,p+r,s+r)},
eQ(d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=this,d4=t.bn
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
else{b9=A.hX(a,a0,a4)
c0=A.hX(b5,b6,b3)
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
if(d4){d1=A.hX(a,a0,o)
d2=A.hX(b5,b6,o)
d8.$8(a2-d*d1.a,a3-d*d1.b,b7+d*d2.a,b8+d*d2.b,b7,b8,a2,a3)}else d7.$2(b7,b8)
i+=h}d9.$0()}}}
A.b8.prototype={
gc1(){var s,r=this,q=r.fr
if(q===$){s=B.b.ab(r.a,new A.hv())
r.fr!==$&&A.M()
r.fr=s
q=s}return q},
fb(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.b.gae(r.a)
while(s instanceof A.P)s=s.a
if((s instanceof A.aK||s instanceof A.aq||s instanceof A.aT)&&s.gF())return s
return null},
cQ(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.T)(s),++p)q=A.bW(q,s[p].a7(a))
return q},
gF(){var s,r,q,p=this,o=null,n=!1
if(p.gc1())if(p.b.a!=null)if(p.c.a!=null)if(p.d.a!=null){s=p.y
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
aY(a){var s,r,q,p,o,n,m=this,l=m.c.n(a)
if(0>=l.length)return A.a(l,0)
if(B.c.D(l[0])<=0)return null
if(m.e){l=m.d.n(a)
if(0>=l.length)return A.a(l,0)
s=l[0]
if(s<=0)return null
r=m.w===1?Math.max(1.42,m.x):1.42
q=s*0.5*r+1}else q=0
if(m.gc1()){p=m.fy
if(p===$){o=m.cQ(0)
m.fy!==$&&A.M()
m.fy=o
p=o}n=p}else n=m.cQ(a)
if(n==null)return null
return q===0?n:n.fT(q)},
$iay:1}
A.hv.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.hg.prototype={
eg(a6,a7,a8,a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=a4.r
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
c=new A.eb(new Float64Array(A.R(A.h([h,b,h+a,b+a0,d+a1,a2+a5[a3],d,a2],k))),c)
c.eh(q,g,f,a5,e)
B.b.u(j,i,c)}}},
cb(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c
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
l=new A.hh()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.ea()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.hh.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:77}
A.z.prototype={
gcm(){var s=this.a
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
if(c2<B.i.ga6(r)){B.j.L(c1,0,o,q)
return c1}if(c2>=B.i.gac(r)){B.j.P(c1,0,o,q,(r.length-1)*p)
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
a1=B.a.K(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.cb(a0,a)
k=s.w
if(k==null)a4=null
else{if(!(n<k.length))return A.a(k,n)
a4=k[n]}if(a4!=null)a4.e6(B.c.A(a3,0,1),c1)
else if(c0.c&&o>=32&&a1<=1)if(a3<=0)B.j.P(c1,0,o,q,h)
else if(a3>=1)B.j.P(c1,0,o,q,d)
else{n=$.dh()
n.$flags&2&&A.f(n)
n[0]=a3
m=n[0]
n[0]=a3
k=n[0]
n[0]=a3
g=n[0]
n[0]=a3
a5=new A.aF(m,k,g,n[0])
g=s.x
g.toString
a6=B.a.H(h,4)
a7=B.a.H(d,4)
a8=c0.e
if(a8==null)a8=c0.e=J.iq(B.j.gaa(c1),0,o/4|0)
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
b3=new A.aF(b1,b2,b3,n[0]).ad(0,a5)
n[0]=c.a+b3.a
b2=n[0]
n[0]=c.b+b3.b
b1=n[0]
n[0]=c.c+b3.c
e=n[0]
n[0]=c.d+b3.d
a8.u(0,a9,new A.aF(b2,b1,e,n[0]))}for(a9=k*4,n=q.length,k=c1.$flags|0;a9<o;++a9){g=h+a9
if(!(g<n))return A.a(q,g)
g=q[g]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=q[e]
k&2&&A.f(c1)
c1[a9]=g+(e-g)*m}}else if(c0.f)for(n=q.length,k=c1.$flags|0,g=a1>1,a9=0;a9<o;++a9){b4=g&&m?s.cb(a0+4*B.a.M(a9,a1),a):a3
e=h+a9
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.kV()
e=B.a.A(B.c.D(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
b5=c[e]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=B.a.A(B.c.D(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.hC(b5+(c[e]-b5)*B.c.A(b4,0,1))
k&2&&A.f(c1)
c1[a9]=e}else if(a1<=1||a2)if(a3<=0)B.j.P(c1,0,o,q,h)
else if(a3>=1)B.j.P(c1,0,o,q,d)
else for(n=q.length,m=c1.$flags|0,b6=d,b7=h,a9=0;a9<o;++a9,++b7,++b6){if(!(b7<n))return A.a(q,b7)
b8=q[b7]
if(!(b6>=0&&b6<n))return A.a(q,b6)
b9=q[b6]
k=b8===b9?b8:b8+(b9-b8)*a3
m&2&&A.f(c1)
c1[a9]=k}else for(n=q.length,m=c1.$flags|0,a9=0;a9<o;++a9){b4=s.cb(a0+4*B.a.M(a9,a1),a)
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
A.eb.prototype={
eh(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this,j=k.a,i=j.length
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
e6(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
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
A.a7.prototype={
gW(a){var s=this
return s.a>=s.c||s.b>=s.d},
fT(a){var s=this
return new A.a7(s.a-a,s.b-a,s.c+a,s.d+a)},
bu(a){var s=this
return new A.a7(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.fe.prototype={
fz(){var s,r=this.a,q=J.O(r)
switch(A.j(A.Q(q.h(r,0)))){case 0:s=q.h(r,1)==null?null:A.H(q.h(r,1))
r=new A.a1(0,s,A.j(A.Q(q.h(r,2))))
break
case 1:r=new A.aL([1,A.H(q.h(r,1)),t.bm.a(q.h(r,2)),A.bu(q.h(r,3))])
break
case 2:r=new A.bR([2,A.j(A.Q(q.h(r,1))),A.H(q.h(r,2)),A.H(q.h(r,3)),A.Q(q.h(r,4)),A.j(A.Q(q.h(r,5))),A.j(A.Q(q.h(r,6))),A.j(A.Q(q.h(r,7))),A.j(A.Q(q.h(r,8))),A.bu(q.h(r,9))])
break
case 5:r=new A.cf([5,A.j(A.Q(q.h(r,1))),A.H(q.h(r,2)),A.H(q.h(r,3)),A.j(A.Q(q.h(r,4))),A.j(A.Q(q.h(r,5))),A.Q(q.h(r,6)),A.Q(q.h(r,7)),A.j(A.Q(q.h(r,8))),A.j(A.Q(q.h(r,9))),A.j(A.Q(q.h(r,10))),A.bu(q.h(r,11))])
break
case 4:r=B.aA
break
default:r=A.w(B.a0)}return r}}
A.b_.prototype={
b7(a){if($.k!=null)this.b=A.aM(a*4)
else this.c=new Int32Array(a)},
gt(){var s=this.b
if(s!=null)s=A.dE(t.a.a(A.t($.k.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
aq(a,b){var s,r,q,p,o,n=this
if(n.b!=null){s=A.aM(a*4)
r=A.dE(t.a.a(A.t($.k.memory).buffer),s,a)
if(b>0)B.e.L(r,0,b,n.gt())
q=$.k
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
a0(){var s=this.b
if(s!=null){$.k.free(s)
this.b=null}}}
A.aZ.prototype={
gt(){var s=this.c
if(s!=null)s=A.iF(t.a.a(A.t($.k.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
aq(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.e(A.ax("Cannot resize a borrowed pixel buffer"))
if(n.c!=null){s=A.aM(a*4)
r=A.iF(t.a.a(A.t($.k.memory).buffer),s,a)
if(b>0)B.f.L(r,0,b,n.gt())
q=$.k
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
a0(){var s,r,q=this
if(q.a&&q.c!=null){s=$.k
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.eR.prototype={
h2(a,b,c,d,e,f,g,h,i,j,k,a0,a1){var s,r,q,p,o,n,m,l=this;++l.f
s=(j-h)*(k-i)
if(e<2||f===0||a0.b==null||s>262144)return-2
if(s>l.e)l.e=s
r=l.c
if(e>r){if(r>0){$.k.free(l.r)
$.k.free(l.w)}r=e*2
l.c=r
l.r=A.aM(r*8)
l.w=A.aM(l.c*8)}r=l.d
if(f>r){if(r>0){$.k.free(l.x)
$.k.free(l.y)}r=f*2
l.d=r
l.x=A.aM(r*4)
l.y=A.aM(l.d*4)}r=t.a
B.i.L(A.iE(r.a(A.t($.k.memory).buffer),l.r,l.c),0,e,a)
B.i.L(A.iE(r.a(A.t($.k.memory).buffer),l.w,l.c),0,e,b)
B.e.L(A.dE(r.a(A.t($.k.memory).buffer),l.x,l.d),0,f,c)
B.e.L(A.dE(r.a(A.t($.k.memory).buffer),l.y,l.d),0,f,d)
q=new A.eT(l,f,h,i,j,k,g,a0)
p=q.$0()
while(p===-1){o=a0.b
if(o!=null){n=r.a(A.t($.k.memory).buffer)
m=a0.a
o=new Int32Array(n,o,m)}else{o=a0.c
o.toString}a0.aq(o.length*2,0)
p=q.$0()}return p},
h7(){if($.eS!==this){this.a0()
return}var s=$.cz-1
$.cz=s
if(s>0)return
$.cz=0
$.eS=null
this.a0()},
a0(){var s=this,r=s.a
if(r!==0)$.k.fl_dense_free(r)
$.k.free(s.b)
if(s.c>0){$.k.free(s.r)
$.k.free(s.w)
s.w=s.r=s.c=0}if(s.d>0){$.k.free(s.x)
$.k.free(s.y)
s.y=s.x=s.d=0}}}
A.eT.prototype={
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
return A.df(j,"fl_dense_raster",[s.a,r,q,p,o,k.b,k.c,k.d,k.e,k.f,n,l,m.gt().length/2|0,s.b],t.S)},
$S:78}
A.f8.prototype={}
A.dQ.prototype={
az(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
cY(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdj()},
gcI(){var s=this.x
return s===$?this.x=B.a.H(this.a+16-1,16):s},
gdj(){var s,r,q=this,p=q.y
if(p===$){s=q.gcI()
r=B.a.H(q.b+16-1,16)
q.y!==$&&A.M()
p=q.y=s*r}return p},
h4(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdj(),b=d.cY(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.cY(a5.b):-1
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
j=B.a.a2(n,m)*16
i=Math.min(16,a0-k)
h=Math.min(16,s-j)
if(!(l<r.length))return A.a(r,l)
g=r[l]
for(m=i*4,f=0;f<h;++f){e=((j+f)*a0+k)*4
B.d.P(a4,e,e+m,g,f*i*4)}}if(!a){a5.a=a1
a5.b=a3}}}
A.f9.prototype={
$0(){return A.h([],t.t)},
$S:79}
A.i9.prototype={
$1(a){return this.e2(a)},
e2(a5){var s=0,r=A.kj(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.kp(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.fe(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.j(A.Q(J.ae(n.a,0)))!==-1||A.j(A.Q(J.ae(n.a,1)))!==2)throw A.e(B.U)
q=10
s=13
return A.hO(A.jb(A.t(A.t(v.G.self).fetch(A.H(J.ae(n.a,2)))),t.m),$async$$1)
case 13:m=a7
s=A.bu(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.hO(A.jb(A.t(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.hO(a3.i7(a4.iG(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.nV(o.b)
d.a=!0
l=null
k=null
j=A.j7([-2,2,$.k!=null])
l=j.a
k=j.b
A.t(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.n(d)
a=b.c.a(n.fz())
a0=d.b
if(a0>=4)A.w(d.cE())
if((a0&1)!==0)d.bX(a)
else if((a0&3)===0)d.cO().m(0,new A.bL(a,b.i("bL<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.ad(a2)
h=null
g=null
f=A.j7([-3,A.u(i)])
h=f.a
g=f.b
A.t(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.k5(null,r)
case 1:return A.k4(p.at(-1),r)}})
return A.k6($async$$1,r)},
$S:80}
A.ia.prototype={
$1(a){return A.ll(new A.i9(this.a,this.b).$1(A.t(a)),t.b)},
$S:81}
A.fC.prototype={
au(a){var s=A.ny(a)
A.t(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bh.prototype
s.ed=s.p})();(function installTearOffs(){var s=hunkHelpers._static_1,r=hunkHelpers._static_0,q=hunkHelpers._static_2,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(A,"nn","lS",4)
s(A,"no","lT",4)
s(A,"np","lU",4)
r(A,"kr","ni",0)
q(A,"nr","n7",7)
r(A,"nq","n6",0)
p(A.J.prototype,"geA","eB",7)
s(A,"jc","dc",1)
var m
o(m=A.e2.prototype,"ghc","C",33)
o(m,"gb5","ct",34)
o(m,"gfG","fH",35)
o(m,"gh_","h0",36)
o(m,"gfX","ci",37)
p(m=A.ah.prototype,"gfm","q",65)
n(m,"gfI","a1",0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.i,null)
q(A.i,[A.iA,J.B,A.cL,J.by,A.L,A.bf,A.f3,A.m,A.bD,A.cR,A.E,A.bI,A.a4,A.cU,A.b1,A.fa,A.eW,A.cs,A.d4,A.F,A.eM,A.cy,A.aE,A.cx,A.dy,A.cW,A.c8,A.fn,A.e8,A.hG,A.aF,A.aG,A.e3,A.hE,A.hA,A.dV,A.ak,A.dZ,A.b5,A.J,A.dW,A.cN,A.d5,A.dX,A.cT,A.bp,A.e_,A.aJ,A.ec,A.fg,A.e7,A.cV,A.A,A.c3,A.dp,A.hH,A.fD,A.dH,A.cM,A.fE,A.X,A.bi,A.W,A.ed,A.c7,A.eV,A.eF,A.ff,A.eH,A.dt,A.bk,A.fB,A.dv,A.ea,A.eu,A.eO,A.ez,A.b,A.bo,A.fF,A.hr,A.e2,A.b6,A.P,A.ba,A.bT,A.cc,A.bH,A.eZ,A.bq,A.ah,A.a8,A.bK,A.az,A.fX,A.hu,A.bS,A.a3,A.hd,A.e1,A.a0,A.a_,A.aI,A.e4,A.b8,A.hg,A.z,A.eb,A.a7,A.fe,A.b_,A.aZ,A.eR,A.f8,A.dQ,A.fC])
q(J.B,[J.ct,J.cv,J.N,J.bA,J.bB,J.cw,J.c4])
q(J.N,[J.bh,J.v,A.bj,A.cF])
q(J.bh,[J.dI,J.cP,J.am])
r(J.dw,A.cL)
r(J.eI,J.v)
q(J.cw,[J.cu,J.dx])
q(A.L,[A.aW,A.b3,A.dz,A.dS,A.dM,A.e0,A.dj,A.aQ,A.cQ,A.dR,A.bl,A.dn])
q(A.bf,[A.dl,A.dm,A.dP,A.i4,A.i6,A.fj,A.fi,A.hP,A.h5,A.f5,A.eC,A.ie,A.ig,A.eG,A.ev,A.ew,A.fz,A.fp,A.fo,A.fw,A.fu,A.fs,A.ft,A.fr,A.fy,A.hD,A.fA,A.ii,A.ij,A.ik,A.im,A.ih,A.hw,A.hz,A.hW,A.hT,A.hU,A.hS,A.fG,A.hk,A.hi,A.hj,A.hl,A.h9,A.hb,A.hc,A.ha,A.hn,A.hm,A.hv,A.hh,A.i9,A.ia])
q(A.dl,[A.ic,A.fk,A.fl,A.hB,A.fY,A.h1,A.h0,A.h_,A.fZ,A.h4,A.h3,A.h2,A.f6,A.ht,A.hs,A.fm,A.ho,A.fh,A.i_,A.hJ,A.hI,A.h8,A.hM,A.fU,A.fV,A.fO,A.fP,A.fQ,A.fR,A.fS,A.fT,A.fI,A.fK,A.fJ,A.fW,A.fH,A.fM,A.fL,A.fN,A.hx,A.eT,A.f9])
q(A.m,[A.aR,A.bJ,A.dU])
q(A.aR,[A.ab,A.U,A.eN,A.bC])
q(A.ab,[A.V,A.e6])
q(A.a4,[A.cd,A.aU,A.bQ,A.ce])
r(A.d1,A.cd)
q(A.aU,[A.bR,A.cf,A.aL,A.br,A.ch])
q(A.bQ,[A.G,A.cg])
r(A.a1,A.ce)
q(A.b1,[A.cr,A.d3])
r(A.K,A.cr)
r(A.cI,A.b3)
q(A.dP,[A.dN,A.c2])
q(A.F,[A.aV,A.e5])
q(A.dm,[A.eJ,A.i5,A.hQ,A.i0,A.h6,A.eP,A.eQ,A.hf,A.eE,A.eD,A.ex,A.fq,A.fv,A.fx,A.il,A.io,A.f_,A.f0,A.f1,A.f2,A.hZ])
r(A.af,A.aV)
r(A.c5,A.bj)
r(A.e9,A.e8)
r(A.cA,A.e9)
r(A.ei,A.cA)
r(A.eh,A.ei)
q(A.cF,[A.dC,A.a6])
q(A.a6,[A.cX,A.cZ])
r(A.cY,A.cX)
r(A.cD,A.cY)
r(A.d_,A.cZ)
r(A.cE,A.d_)
q(A.cD,[A.c6,A.cB])
q(A.cE,[A.dD,A.cC,A.dF,A.dG,A.cG,A.cH,A.bE])
r(A.cj,A.e0)
r(A.cS,A.dZ)
r(A.c9,A.d5)
r(A.d7,A.cN)
r(A.ca,A.d7)
r(A.cb,A.cT)
r(A.bL,A.bp)
r(A.b7,A.d3)
r(A.bO,A.b7)
q(A.c3,[A.dq,A.dA])
q(A.dp,[A.eK,A.fd])
r(A.dT,A.dq)
q(A.aQ,[A.b0,A.ds])
q(A.ff,[A.h7,A.hL])
q(A.bk,[A.dB,A.f4,A.bF])
q(A.X,[A.c1,A.fc])
q(A.c1,[A.cp,A.di])
r(A.cq,A.fD)
r(A.du,A.dv)
q(A.e4,[A.aq,A.aK,A.aT])
s(A.e8,A.A)
s(A.e9,A.E)
s(A.cX,A.A)
s(A.cY,A.E)
s(A.cZ,A.A)
s(A.d_,A.E)
s(A.ei,A.bI)
s(A.c9,A.dX)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{c:"int",d:"double",c_:"num",o:"String",p:"bool",W:"Null",q:"List",i:"Object",ag:"Map",I:"JSObject"},mangledNames:{},types:["~()","p(x)","p(a3)","~(@)","~(~())","W(@)","W()","~(i,ap)","bg(@,b,bg?,c,c)","@()","p()","p(+(o,c))","p(@)","~(c)","~(i?,i?)","@(o)","W(am,am)","i?(i?)","i(i,ap)","p(bk)","@(@)","p(c,bm)","W(@,ap)","p(a0)","z(c{dimensions:c})","~(c,c)","~(c,@)","d(o,d)","al<~>()","~(@,c)","~(q<x>)","x(P)","W(~())","z(z)","x(x)","ay(ay)","a3(a3)","a0(a0)","z()","bS()","P()","ba()","aI()","aq()","aK()","aT()","b8()","a_()","b6()","bT()","cc()","a3()","a0()","bo()","W(i,ap)","@(@,o)","bm(c)","~(o,o,c)","~(o,bH)","~(c,o)","~(i?)","p(i,bK)","p(i,a8<ah>)","p(i,a8<d>)","p(b6,a8<aZ>)","~(d,d)","cO()","c(c,c,d)","d(d)","~(a3,az)","~(d,d,d,d,d,d,d,d)","~(d,d,d,d,d,d,c)","~(d,d,d,d,d,d)","~(c,c,d,d,p)","c(d)","~(o,@)","p(ay)","d(d,d,d)","c()","q<c>()","al<W>(I)","I(I)","p(z)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.d1&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.G&&a.b(c.a)&&b.b(c.b),"2;compressedBytes,entryDiskBytes":(a,b)=>c=>c instanceof A.cg&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.a1&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.aL&&A.es(a,b.a),"6;":a=>b=>b instanceof A.br&&A.es(a,b.a),"7;":a=>b=>b instanceof A.ch&&A.es(a,b.a),"10;":a=>b=>b instanceof A.bR&&A.es(a,b.a),"12;":a=>b=>b instanceof A.cf&&A.es(a,b.a)}}
A.mn(v.typeUniverse,JSON.parse('{"am":"bh","dI":"bh","cP":"bh","o6":"bj","ct":{"B":[],"p":[],"y":[]},"cv":{"B":[],"W":[],"y":[]},"N":{"B":[],"I":[]},"bh":{"N":[],"B":[],"I":[]},"bA":{"B":[]},"bB":{"B":[]},"v":{"q":["1"],"N":[],"B":[],"I":[],"m":["1"]},"dw":{"cL":[]},"eI":{"v":["1"],"q":["1"],"N":[],"B":[],"I":[],"m":["1"]},"by":{"a9":["1"]},"cw":{"d":[],"c_":[],"B":[]},"cu":{"d":[],"c":[],"c_":[],"B":[],"y":[]},"dx":{"d":[],"c_":[],"B":[],"y":[]},"c4":{"o":[],"B":[],"eY":[],"y":[]},"aW":{"L":[]},"aR":{"m":["1"]},"ab":{"aR":["1"],"m":["1"]},"bD":{"a9":["1"]},"V":{"ab":["2"],"aR":["2"],"m":["2"],"m.E":"2","ab.E":"2"},"bJ":{"m":["1"],"m.E":"1"},"cR":{"a9":["1"]},"d1":{"cd":[],"a4":[]},"bR":{"aU":[],"a4":[]},"cf":{"aU":[],"a4":[]},"G":{"bQ":[],"a4":[]},"cg":{"bQ":[],"a4":[]},"a1":{"ce":[],"a4":[]},"aL":{"aU":[],"a4":[]},"br":{"aU":[],"a4":[]},"ch":{"aU":[],"a4":[]},"cU":{"a9":["1"]},"cr":{"b1":["1"],"aS":["1"],"m":["1"]},"K":{"cr":["1"],"b1":["1"],"aS":["1"],"m":["1"]},"cI":{"b3":[],"L":[]},"dz":{"L":[]},"dS":{"L":[]},"d4":{"ap":[]},"bf":{"bz":[]},"dl":{"bz":[]},"dm":{"bz":[]},"dP":{"bz":[]},"dN":{"bz":[]},"c2":{"bz":[]},"dM":{"L":[]},"aV":{"F":["1","2"],"iC":["1","2"],"ag":["1","2"],"F.K":"1","F.V":"2"},"U":{"aR":["1"],"m":["1"],"m.E":"1"},"cy":{"a9":["1"]},"eN":{"aR":["1"],"m":["1"],"m.E":"1"},"aE":{"a9":["1"]},"bC":{"aR":["bi<1,2>"],"m":["bi<1,2>"],"m.E":"bi<1,2>"},"cx":{"a9":["bi<1,2>"]},"af":{"aV":["1","2"],"F":["1","2"],"iC":["1","2"],"ag":["1","2"],"F.K":"1","F.V":"2"},"bQ":{"a4":[]},"cd":{"a4":[]},"ce":{"a4":[]},"aU":{"a4":[]},"dy":{"lK":[],"eY":[]},"cW":{"dK":[]},"dU":{"m":["dK"],"m.E":"dK"},"c8":{"a9":["dK"]},"c5":{"bj":[],"N":[],"B":[],"I":[],"y":[]},"bj":{"N":[],"B":[],"I":[],"y":[]},"cA":{"eA":[],"A":["a5"],"q":["a5"],"m":["a5"],"E":["a5"],"y":[],"A.E":"a5","E.E":"a5"},"eh":{"eA":[],"A":["a5"],"bI":["a5"],"q":["a5"],"m":["a5"],"E":["a5"],"y":[],"A.E":"a5","bI.E":"a5","E.E":"a5"},"cF":{"N":[],"B":[],"I":[]},"dC":{"N":[],"B":[],"I":[],"y":[]},"a6":{"an":["1"],"N":[],"B":[],"I":[]},"cD":{"A":["d"],"a6":["d"],"q":["d"],"an":["d"],"N":[],"B":[],"I":[],"m":["d"],"E":["d"]},"cE":{"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"]},"c6":{"bg":[],"A":["d"],"a6":["d"],"q":["d"],"an":["d"],"N":[],"B":[],"I":[],"m":["d"],"E":["d"],"y":[],"A.E":"d","E.E":"d"},"cB":{"eB":[],"A":["d"],"a6":["d"],"q":["d"],"an":["d"],"N":[],"B":[],"I":[],"m":["d"],"E":["d"],"y":[],"A.E":"d","E.E":"d"},"dD":{"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"cC":{"ix":[],"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"dF":{"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"dG":{"iK":[],"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"cG":{"cO":[],"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"cH":{"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"bE":{"bm":[],"A":["c"],"a6":["c"],"q":["c"],"an":["c"],"N":[],"B":[],"I":[],"m":["c"],"E":["c"],"y":[],"A.E":"c","E.E":"c"},"aF":{"a5":[]},"e0":{"L":[]},"cj":{"b3":[],"L":[]},"ak":{"L":[]},"cS":{"dZ":["1"]},"J":{"al":["1"]},"d5":{"jB":["1"],"jA":["1"],"jO":["1"],"bM":["1"]},"c9":{"dX":["1"],"d5":["1"],"jB":["1"],"jA":["1"],"jO":["1"],"bM":["1"]},"ca":{"d7":["1"],"cN":["1"]},"cb":{"cT":["1"],"dO":["1"],"bM":["1"]},"cT":{"dO":["1"],"bM":["1"]},"d7":{"cN":["1"]},"bL":{"bp":["1"]},"e_":{"bp":["@"]},"b7":{"b1":["1"],"aS":["1"],"m":["1"]},"bO":{"b7":["1"],"b1":["1"],"aS":["1"],"m":["1"]},"cV":{"a9":["1"]},"F":{"ag":["1","2"]},"b1":{"aS":["1"],"m":["1"]},"d3":{"b1":["1"],"aS":["1"],"m":["1"]},"e5":{"F":["o","@"],"ag":["o","@"],"F.K":"o","F.V":"@"},"e6":{"ab":["o"],"aR":["o"],"m":["o"],"m.E":"o","ab.E":"o"},"dq":{"c3":["o","q<c>"]},"dA":{"c3":["i?","o"]},"dT":{"c3":["o","q<c>"]},"d":{"c_":[]},"c":{"c_":[]},"q":{"m":["1"]},"aS":{"m":["1"]},"o":{"eY":[]},"dj":{"L":[]},"b3":{"L":[]},"aQ":{"L":[]},"b0":{"L":[]},"ds":{"b0":[],"L":[]},"cQ":{"L":[]},"dR":{"L":[]},"bl":{"L":[]},"dn":{"L":[]},"dH":{"L":[]},"cM":{"L":[]},"ed":{"ap":[]},"dB":{"bk":[]},"f4":{"bk":[]},"du":{"dv":[]},"bF":{"bk":[]},"P":{"x":[]},"ba":{"x":[]},"a_":{"x":[],"ay":[]},"aI":{"x":[]},"aq":{"x":[]},"aK":{"x":[]},"aT":{"x":[]},"b8":{"ay":[]},"e4":{"x":[]},"ln":{"q":["c"],"m":["c"]},"bm":{"q":["c"],"m":["c"]},"lQ":{"q":["c"],"m":["c"]},"lm":{"q":["c"],"m":["c"]},"iK":{"q":["c"],"m":["c"]},"ix":{"q":["c"],"m":["c"]},"cO":{"q":["c"],"m":["c"]},"bg":{"q":["d"],"m":["d"]},"eB":{"q":["d"],"m":["d"]},"eA":{"q":["a5"],"m":["a5"]}}'))
A.mm(v.typeUniverse,JSON.parse('{"a6":1,"bp":1,"d3":1,"dp":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.er
return{a7:s("@<~>"),v:s("ak"),fA:s("cq"),M:s("K<o>"),R:s("L"),Y:s("a5"),Z:s("bz"),gd:s("B"),bM:s("m<d>"),hf:s("m<@>"),hb:s("m<c>"),dh:s("v<eB>"),f:s("v<i>"),hg:s("v<+(p,p)>"),s:s("v<o>"),a1:s("v<cO>"),eS:s("v<bm>"),V:s("v<ay>"),ch:s("v<a0>"),bE:s("v<a3>"),A:s("v<x>"),cu:s("v<ah>"),gw:s("v<az>"),fq:s("v<P>"),cl:s("v<z>"),n:s("v<d>"),o:s("v<@>"),t:s("v<c>"),a2:s("v<aZ?>"),a6:s("v<i?>"),cU:s("v<a0?>"),T:s("cv"),m:s("I"),g:s("am"),aU:s("an<@>"),aX:s("N"),c2:s("af<i,i>"),el:s("af<i,bK>"),gt:s("af<ag<o,@>,aq>"),c8:s("af<i,a8<ah>>"),fk:s("af<i,a8<d>>"),gj:s("af<b6,a8<aZ>>"),ew:s("q<i>"),W:s("q<o7>"),cH:s("q<x>"),dg:s("q<d>"),j:s("q<@>"),L:s("q<c>"),P:s("ag<o,@>"),gq:s("ag<a0,c>"),B:s("ag<c,a0>"),aj:s("ag<a0,+(c,b)>"),fP:s("V<P,x>"),a:s("c5"),bm:s("bE"),b:s("W"),K:s("i"),bl:s("bF"),b8:s("b0"),h:s("bH"),gT:s("o8"),bQ:s("+()"),gv:s("+(i?,i?,i?,i?,i?,i?,i?,i?,i?,i?)"),r:s("+(i?,i?,i?,i?,i?,i?,i?,i?,i?,i?,i?,i?)"),dn:s("+(i?)"),x:s("+(o,c)"),eG:s("+(c,b)"),ei:s("+(i?,i?)"),bP:s("+(o,d,d)"),h6:s("+(c,c,c)"),k:s("+(i?,i?,i?)"),a5:s("+(i?,i?,i?,i?)"),e6:s("+(i?,i?,i?,i?,i?,i?,i?)"),d:s("dK"),bC:s("aS<i>"),E:s("aS<o>"),cJ:s("aS<c>"),l:s("ap"),N:s("o"),gz:s("dQ"),dm:s("y"),G:s("b3"),p:s("bm"),ak:s("cP"),eU:s("bJ<x>"),co:s("c9<i?>"),I:s("bo"),az:s("bK"),bo:s("cc"),h1:s("ay"),_:s("J<@>"),fJ:s("J<c>"),U:s("J<~>"),cK:s("b6"),eV:s("a_"),D:s("a0"),ai:s("bO<ag<o,@>>"),ao:s("bO<i>"),J:s("a3"),eY:s("oo"),u:s("x"),bs:s("x(P)"),g2:s("ea"),dL:s("a8<aZ>"),gN:s("a8<ah>"),e:s("a8<d>"),bD:s("P"),fv:s("d6<i?>"),aD:s("z"),d1:s("bS"),e_:s("bT"),y:s("p"),al:s("p(i)"),aT:s("p(x)"),i:s("d"),z:s("@"),fO:s("@()"),w:s("@(i)"),C:s("@(i,ap)"),S:s("c"),c:s("bg(@,b,bg?,c,c)?"),eH:s("al<W>?"),an:s("I?"),bF:s("q<@>?"),aM:s("ag<+(o,d,d),bo>?"),cq:s("ag<o,ag<o,@>>?"),X:s("i?"),ae:s("aS<i>?"),dk:s("o?"),g_:s("bo?"),ev:s("bp<@>?"),F:s("b5<@,@>?"),Q:s("e7?"),cn:s("eb?"),fQ:s("p?"),cD:s("d?"),gs:s("c?"),cg:s("c_?"),g5:s("~()?"),q:s("c_"),H:s("~"),O:s("~()"),d5:s("~(i)"),da:s("~(i,ap)"),cA:s("~(o,@)"),bn:s("~(d,d)"),fi:s("~(d,d,d,d,d,d,d,d)"),as:s("~(c,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a3=J.B.prototype
B.b=J.v.prototype
B.t=J.ct.prototype
B.a=J.cu.prototype
B.c=J.cw.prototype
B.p=J.c4.prototype
B.a4=J.am.prototype
B.a5=J.N.prototype
B.j=A.c6.prototype
B.i=A.cB.prototype
B.e=A.cC.prototype
B.f=A.cG.prototype
B.d=A.bE.prototype
B.D=J.dI.prototype
B.u=J.cP.prototype
B.o=new A.cq(0,"littleEndian")
B.r=new A.cq(1,"bigEndian")
B.G=new A.eF()
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

B.x=new A.dA()
B.N=new A.dH()
B.n=new A.f3()
B.O=new A.dT()
B.k=new A.fg()
B.y=new A.e_()
B.P=new A.h7()
B.q=new A.ed()
B.Q=new A.hL()
B.R=new A.X("Truncated LZ4 match offset",null,null)
B.S=new A.X("Invalid Huffman code length",null,null)
B.T=new A.X("Invalid LZ4 match offset",null,null)
B.U=new A.X("Incompatible FastLottie worker host",null,null)
B.V=new A.X("LZ4 literal out of bounds",null,null)
B.W=new A.X("Empty LZ4 block",null,null)
B.X=new A.X("Truncated LZ4 literal len",null,null)
B.Y=new A.X("Truncated LZ4 match len",null,null)
B.Z=new A.X("Lottie JSON exceeds decode budget",null,null)
B.a_=new A.X("LZ4 match out of output bounds",null,null)
B.a0=new A.X("Invalid raster worker request",null,null)
B.a1=new A.X("Incomplete Huffman table",null,null)
B.a2=new A.X("Oversubscribed Huffman table",null,null)
B.a6=new A.eK(null)
B.z=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.a7=s([10,7,2,7,0,0,0],t.t)
B.A=s([],t.o)
B.a8=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.l=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.a9=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.aa=s([10,7,7,7,7,7],t.t)
B.B=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.ab=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.ac=s(["_initialize","malloc","free","fastlottie_clear_pixels","fastlottie_fill_solid_spans","fastlottie_blend_rect","fastlottie_blend_solid","fastlottie_inner_shadow","fastlottie_gradient_spans","fl_dense_new","fl_dense_free","fl_dense_trim","fl_dense_raster"],t.s)
B.ad=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.C=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.aA=new A.d1(4)
B.aB=new A.G(0,-1)
B.aC=new A.G(1,4)
B.aD=new A.G(2,0)
B.aE=new A.G(3,1)
B.aF=new A.G(4,1)
B.aG=new A.G(5,1)
B.aH=new A.cg(0,0)
B.aI=new A.G(null,null)
B.aJ=new A.a1(0,0,0)
B.aK=new A.a7(0,0,0,0)
B.ar={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aL=new A.K(B.ar,21,t.M)
B.af={v:0,i:1,o:2,c:3}
B.aM=new A.K(B.af,4,t.M)
B.at={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aN=new A.K(B.at,11,t.M)
B.ak={ty:0,nm:1,mn:2,ix:3,v:4}
B.E=new A.K(B.ak,5,t.M)
B.aw={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aO=new A.K(B.aw,9,t.M)
B.an={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aP=new A.K(B.an,6,t.M)
B.au={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aQ=new A.K(B.au,31,t.M)
B.aq={a:0,k:1,ix:2,x:3,l:4}
B.F=new A.K(B.aq,5,t.M)
B.az={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aR=new A.K(B.az,19,t.M)
B.ax={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aS=new A.K(B.ax,10,t.M)
B.aj={s:0,x:1,y:2,ix:3}
B.aT=new A.K(B.aj,4,t.M)
B.ah={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aU=new A.K(B.ah,9,t.M)
B.al={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aV=new A.K(B.al,8,t.M)
B.as={}
B.aW=new A.K(B.as,0,t.M)
B.ai={a:0,s:1,i:2,f:3,n:4}
B.aX=new A.K(B.ai,5,t.M)
B.ay={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.aY=new A.K(B.ay,15,t.M)
B.ae={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.aZ=new A.K(B.ae,7,t.M)
B.ag={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.b_=new A.K(B.ag,10,t.M)
B.ap={n:0,nm:1,v:2}
B.b0=new A.K(B.ap,3,t.M)
B.ao={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b1=new A.K(B.ao,10,t.M)
B.am={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b2=new A.K(B.am,16,t.M)
B.av={p:0,k:1}
B.b3=new A.K(B.av,2,t.M)
B.b4=A.aC("nZ")
B.b5=A.aC("o_")
B.b6=A.aC("bg")
B.b7=A.aC("eA")
B.b8=A.aC("eB")
B.b9=A.aC("lm")
B.ba=A.aC("ix")
B.bb=A.aC("ln")
B.bc=A.aC("i")
B.bd=A.aC("iK")
B.be=A.aC("cO")
B.bf=A.aC("lQ")
B.bg=A.aC("bm")
B.bh=new A.fd(!1)
B.h=new A.b(null,null)
B.m=new A.b(B.h,"layers")})();(function staticFields(){$.he=null
$.as=A.h([],t.f)
$.jw=null
$.jo=null
$.jn=null
$.ku=null
$.kq=null
$.ky=null
$.i1=null
$.i8=null
$.j8=null
$.hp=A.h([],A.er("v<q<i>?>"))
$.ck=null
$.dd=null
$.de=null
$.j_=!1
$.D=B.k
$.ko=null
$.iY=null
$.k=null
$.eS=null
$.cz=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"o1","kD",()=>A.i2("_$dart_dartClosure"))
s($,"o0","ip",()=>A.i2("_$dart_dartClosure_dartJSInterop"))
s($,"oB","l0",()=>B.k.bq(B.k,A.er("al<~>()").a(new A.ic()),A.er("al<~>")))
s($,"oz","l_",()=>A.h([new J.dw()],A.er("v<cL>")))
s($,"oa","kG",()=>A.b4(A.fb({
toString:function(){return"$receiver$"}})))
s($,"ob","kH",()=>A.b4(A.fb({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"oc","kI",()=>A.b4(A.fb(null)))
s($,"od","kJ",()=>A.b4(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"og","kM",()=>A.b4(A.fb(void 0)))
s($,"oh","kN",()=>A.b4(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"of","kL",()=>A.b4(A.jD(null)))
s($,"oe","kK",()=>A.b4(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"oj","kP",()=>A.b4(A.jD(void 0)))
s($,"oi","kO",()=>A.b4(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"o5","dh",()=>A.lB(4))
s($,"ok","je",()=>A.lR())
s($,"o2","jd",()=>$.l0())
s($,"ov","kY",()=>A.lD(4096))
s($,"ot","kW",()=>new A.hJ().$0())
s($,"ou","kX",()=>new A.hI().$0())
s($,"ox","et",()=>A.id(B.bc))
s($,"oy","kZ",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"o4","kF",()=>A.iv(B.ad,!1))
s($,"o3","kE",()=>A.iv(B.a8,!1))
s($,"nY","kC",()=>A.la())
s($,"ow","jg",()=>A.dL("content\\('([^']*)'\\)"))
s($,"on","kS",()=>A.dL("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"ol","kQ",()=>A.dL("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"om","kR",()=>A.dL('[\\\\"\\x00-\\x1f]'))
s($,"op","jf",()=>A.dL("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"oq","kT",()=>new A.hx().$0())
s($,"os","kV",()=>A.md())
s($,"or","kU",()=>A.mc())})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bj,ArrayBuffer:A.c5,ArrayBufferView:A.cF,DataView:A.dC,Float32Array:A.c6,Float64Array:A.cB,Int16Array:A.dD,Int32Array:A.cC,Int8Array:A.dF,Uint16Array:A.dG,Uint32Array:A.cG,Uint8ClampedArray:A.cH,CanvasPixelArray:A.cH,Uint8Array:A.bE})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.a6.$nativeSuperclassTag="ArrayBufferView"
A.cX.$nativeSuperclassTag="ArrayBufferView"
A.cY.$nativeSuperclassTag="ArrayBufferView"
A.cD.$nativeSuperclassTag="ArrayBufferView"
A.cZ.$nativeSuperclassTag="ArrayBufferView"
A.d_.$nativeSuperclassTag="ArrayBufferView"
A.cE.$nativeSuperclassTag="ArrayBufferView"})()
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
var s=A.nL
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()