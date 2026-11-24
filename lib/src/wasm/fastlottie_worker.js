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
if(a[b]!==s){A.or(b)}a[b]=r}var q=a[b]
a[c]=function(){return q}
return q}}function makeConstList(a,b){if(b!=null)A.i(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var s=0;s<a.length;++s){convertToFastObject(a[s])}}var y=0
function instanceTearOffGetter(a,b){var s=null
return a?function(c){if(s===null)s=A.jC(b)
return new s(c,this)}:function(){if(s===null)s=A.jC(b)
return new s(this,null)}}function staticTearOffGetter(a){var s=null
return function(){if(s===null)s=A.jC(a).prototype
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
jG(a,b,c,d){return{i:a,p:b,e:c,x:d}},
it(a){var s,r,q,p,o,n="_$dart_js",m=a[v.dispatchPropertyName]
if(m==null)if($.jE==null){A.oa()
m=a[v.dispatchPropertyName]}if(m!=null){s=m.p
if(!1===s)return m.i
if(!0===s)return a
r=Object.getPrototypeOf(a)
if(s===r)return m.i
if(m.e===r)throw A.f(A.kf("Return interceptor for "+A.v(s(a,m))))}q=a.constructor
if(q==null)p=null
else{o=$.hK
if(o==null)o=$.hK=A.is(n)
p=q[o]}if(p!=null)return p
p=A.of(a)
if(p!=null)return p
if(typeof a=="function")return B.a6
s=Object.getPrototypeOf(a)
if(s==null)return B.D
if(s===Object.prototype)return B.D
if(typeof q=="function"){o=$.hK
if(o==null)o=$.hK=A.is(n)
Object.defineProperty(q,o,{value:B.u,enumerable:false,writable:true,configurable:true})
return B.u}return B.u},
j2(a,b){if(a<0||a>4294967295)throw A.f(A.al(a,0,4294967295,"length",null))
return J.lV(new Array(a),b)},
j3(a,b){if(a<0)throw A.f(A.aB("Length must be a non-negative integer: "+a,null))
return A.i(new Array(a),b.i("y<0>"))},
lV(a,b){var s=A.i(a,b.i("y<0>"))
s.$flags=1
return s},
aA(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.cE.prototype
return J.dP.prototype}if(typeof a=="string")return J.c9.prototype
if(a==null)return J.cF.prototype
if(typeof a=="boolean")return J.cD.prototype
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bI.prototype
if(typeof a=="bigint")return J.bH.prototype
return a}if(a instanceof A.d)return a
return J.it(a)},
M(a){if(typeof a=="string")return J.c9.prototype
if(a==null)return a
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bI.prototype
if(typeof a=="bigint")return J.bH.prototype
return a}if(a instanceof A.d)return a
return J.it(a)},
b0(a){if(a==null)return a
if(Array.isArray(a))return J.y.prototype
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bI.prototype
if(typeof a=="bigint")return J.bH.prototype
return a}if(a instanceof A.d)return a
return J.it(a)},
ct(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.ar.prototype
if(typeof a=="symbol")return J.bI.prototype
if(typeof a=="bigint")return J.bH.prototype
return a}if(a instanceof A.d)return a
return J.it(a)},
m(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.aA(a).E(a,b)},
ae(a,b){if(typeof b==="number")if(Array.isArray(a)||typeof a=="string"||A.oe(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.M(a).h(a,b)},
lw(a,b){return J.b0(a).ap(a,b)},
lx(a,b,c){return J.ct(a).dF(a,b,c)},
iQ(a,b,c){return J.ct(a).dG(a,b,c)},
ly(a,b,c){return J.ct(a).dH(a,b,c)},
lz(a,b,c){return J.ct(a).dI(a,b,c)},
lA(a){return J.ct(a).dJ(a)},
c4(a,b,c){return J.ct(a).bu(a,b,c)},
jP(a,b){return J.b0(a).ai(a,b)},
jQ(a){return J.ct(a).gab(a)},
lB(a){return J.b0(a).ga6(a)},
am(a){return J.aA(a).gW(a)},
iR(a){return J.M(a).gR(a)},
cv(a){return J.b0(a).gD(a)},
aj(a){return J.M(a).gk(a)},
lC(a){return J.aA(a).gX(a)},
jR(a){return J.b0(a).gae(a)},
jS(a,b,c,d,e){return J.b0(a).M(a,b,c,d,e)},
lD(a,b){return J.b0(a).am(a,b)},
bE(a){return J.aA(a).p(a)},
C:function C(){},
cD:function cD(){},
cF:function cF(){},
Q:function Q(){},
bo:function bo(){},
e0:function e0(){},
d0:function d0(){},
ar:function ar(){},
bH:function bH(){},
bI:function bI(){},
y:function y(a){this.$ti=a},
dO:function dO(){},
f3:function f3(a){this.$ti=a},
bF:function bF(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cG:function cG(){},
cE:function cE(){},
dP:function dP(){},
c9:function c9(){}},A={j4:function j4(){},
k_(a){return new A.b2("Field '"+a+"' has been assigned during initialization.")},
lX(a){return new A.b2("Field '"+a+"' has not been initialized.")},
ak(a){return new A.b2("Local '"+a+"' has not been initialized.")},
f8(a){return new A.b2("Local '"+a+"' has already been initialized.")},
ba(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
fD(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
jB(a,b,c){return a},
jF(a){var s,r
for(s=$.az.length,r=0;r<s;++r)if(a===$.az[r])return!0
return!1},
fy(a,b,c,d){A.aO(b,"start")
if(c!=null){A.aO(c,"end")
if(b>c)A.x(A.al(b,0,c,"start",null))}return new A.cZ(a,b,c,d.i("cZ<0>"))},
k6(a,b,c){var s="count"
if(t.gw.b(a)){A.eO(b,s,t.S)
A.aO(b,s)
return new A.c8(a,b,c.i("c8<0>"))}A.eO(b,s,t.S)
A.aO(b,s)
return new A.b7(a,b,c.i("b7<0>"))},
aq(){return new A.b8("No element")},
j0(){return new A.b8("Too many elements")},
lT(){return new A.b8("Too few elements")},
b2:function b2(a){this.a=a},
iD:function iD(){},
ft:function ft(){},
o:function o(){},
a4:function a4(){},
cZ:function cZ(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
bK:function bK(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
X:function X(a,b,c){this.a=a
this.b=b
this.$ti=c},
bN:function bN(a,b,c){this.a=a
this.b=b
this.$ti=c},
d2:function d2(a,b,c){this.a=a
this.b=b
this.$ti=c},
b7:function b7(a,b,c){this.a=a
this.b=b
this.$ti=c},
c8:function c8(a,b,c){this.a=a
this.b=b
this.$ti=c},
cW:function cW(a,b,c){this.a=a
this.b=b
this.$ti=c},
cA:function cA(a){this.$ti=a},
cB:function cB(a){this.$ti=a},
G:function G(){},
bw:function bw(){},
lN(){throw A.f(A.aF("Cannot modify constant Set"))},
l7(a){var s=A.l6(a)
if(s!=null)return s
return"minified:"+a},
oe(a,b){var s
if(b!=null){s=b.x
if(s!=null)return s}return t.aU.b(a)},
v(a){var s
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
s=J.bE(a)
return s},
cS(a){var s,r=$.k1
if(r==null)r=$.k1=Symbol("identityHashCode")
s=a[r]
if(s==null){s=Math.random()*0x3fffffff|0
a[r]=s}return s},
mc(a,b){var s,r,q,p,o,n=null,m=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(m==null)return n
if(3>=m.length)return A.a(m,3)
s=m[3]
if(b<2||b>36)throw A.f(A.al(b,2,36,"radix",n))
if(b===10&&s!=null)return parseInt(a,10)
if(b<10||s==null){r=b<=10?47+b:86+b
q=m[1]
for(p=q.length,o=0;o<p;++o)if((q.charCodeAt(o)|32)>r)return n}return parseInt(a,b)},
e1(a){var s,r,q,p
if(a instanceof A.d)return A.ai(A.aJ(a),null)
s=J.aA(a)
if(s===B.a5||s===B.a7||t.ak.b(a)){r=B.v(a)
if(r!=="Object"&&r!=="")return r
q=a.constructor
if(typeof q=="function"){p=q.name
if(typeof p=="string"&&p!=="Object"&&p!=="")return p}}return A.ai(A.aJ(a),null)},
k2(a){var s,r,q
if(a==null||typeof a=="number"||A.bj(a))return J.bE(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.bl)return a.p(0)
if(a instanceof A.O)return a.ds(!0)
s=$.lu()
for(r=0;r<1;++r){q=s[r].ht(a)
if(q!=null)return q}return"Instance of '"+A.e1(a)+"'"},
m9(){return Date.now()},
mb(){var s,r
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
$.jd=new A.fl(r)},
md(a,b,c){var s,r,q,p
if(c<=500&&b===0&&c===a.length)return String.fromCharCode.apply(null,a)
for(s=b,r="";s<c;s=q){q=s+500
p=q<c?q:c
r+=String.fromCharCode.apply(null,a.subarray(s,p))}return r},
cT(a){var s
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){s=a-65536
return String.fromCharCode((B.a.L(s,10)|55296)>>>0,s&1023|56320)}throw A.f(A.al(a,0,1114111,null,null))},
ma(a){var s=a.$thrownJsError
if(s==null)return null
return A.bk(s)},
me(a,b){var s
if(a.$thrownJsError==null){s=new Error()
A.U(a,s)
a.$thrownJsError=s
s.stack=""}},
a3(a){throw A.f(A.jA(a))},
a(a,b){if(a==null)J.aj(a)
throw A.f(A.eL(a,b))},
eL(a,b){var s,r="index"
if(!A.p(b))return new A.aW(!0,b,r,null)
s=A.j(J.aj(a))
if(b<0||b>=s)return A.iY(b,s,a,r)
return A.mf(b,r)},
jA(a){return new A.aW(!0,a,null,null)},
kZ(a){return a},
f(a){return A.U(a,new Error())},
U(a,b){var s
if(a==null)a=new A.bb()
b.dartException=a
s=A.os
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:s})
b.name=""}else b.toString=s
return b},
os(){return J.bE(this.dartException)},
x(a,b){throw A.U(a,b==null?new Error():b)},
h(a,b,c){var s
if(b==null)b=0
if(c==null)c=0
s=Error()
A.x(A.nb(a,b,c),s)},
nb(a,b,c){var s,r,q,p,o,n,m,l,k
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
return new A.d1("'"+s+"': Cannot "+o+" "+l+k+n)},
V(a){throw A.f(A.ao(a))},
bc(a){var s,r,q,p,o,n
a=A.om(a.replace(String({}),"$receiver$"))
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
ke(a){return function($expr$){try{$expr$.$method$}catch(s){return s.message}}(a)},
j5(a,b){var s=b==null,r=s?null:b.method
return new A.dR(a,r,s?null:b.receiver)},
ad(a){var s
if(a==null)return new A.fj(a)
if(a instanceof A.cC){s=a.a
return A.bD(a,s==null?A.aU(s):s)}if(typeof a!=="object")return a
if("dartException" in a)return A.bD(a,a.dartException)
return A.nT(a)},
bD(a,b){if(t.R.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
nT(a){var s,r,q,p,o,n,m,l,k,j,i,h,g
if(!("message" in a))return a
s=a.message
if("number" in a&&typeof a.number=="number"){r=a.number
q=r&65535
if((B.a.L(r,16)&8191)===10)switch(q){case 438:return A.bD(a,A.j5(A.v(s)+" (Error "+q+")",null))
case 445:case 5007:A.v(s)
return A.bD(a,new A.cQ())}}if(a instanceof TypeError){p=$.ld()
o=$.le()
n=$.lf()
m=$.lg()
l=$.lj()
k=$.lk()
j=$.li()
$.lh()
i=$.lm()
h=$.ll()
g=p.aj(s)
if(g!=null)return A.bD(a,A.j5(A.K(s),g))
else{g=o.aj(s)
if(g!=null){g.method="call"
return A.bD(a,A.j5(A.K(s),g))}else if(n.aj(s)!=null||m.aj(s)!=null||l.aj(s)!=null||k.aj(s)!=null||j.aj(s)!=null||m.aj(s)!=null||i.aj(s)!=null||h.aj(s)!=null){A.K(s)
return A.bD(a,new A.cQ())}}return A.bD(a,new A.ec(typeof s=="string"?s:""))}if(a instanceof RangeError){if(typeof s=="string"&&s.indexOf("call stack")!==-1)return new A.cX()
s=function(b){try{return String(b)}catch(f){}return null}(a)
return A.bD(a,new A.aW(!1,null,null,typeof s=="string"?s.replace(/^RangeError:\s*/,""):s))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof s=="string"&&s==="too much recursion")return new A.cX()
return a},
bk(a){var s
if(a instanceof A.cC)return a.b
if(a==null)return new A.dl(a)
s=a.$cachedTrace
if(s!=null)return s
s=new A.dl(a)
if(typeof a==="object")a.$cachedTrace=s
return s},
iE(a){if(a==null)return J.am(a)
if(typeof a=="object")return A.cS(a)
return J.am(a)},
o6(a,b){var s,r,q,p=a.length
for(s=0;s<p;s=q){r=s+1
q=r+1
b.t(0,a[s],a[r])}return b},
no(a,b,c,d,e,f){t.Z.a(a)
switch(A.j(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.f(new A.ha("Unsupported number of arguments for wrapped closure"))},
dy(a,b){var s=a.$identity
if(!!s)return s
s=A.o0(a,b)
a.$identity=s
return s},
o0(a,b){var s
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
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.no)},
lM(a2){var s,r,q,p,o,n,m,l,k,j,i=a2.co,h=a2.iS,g=a2.iI,f=a2.nDA,e=a2.aI,d=a2.fs,c=a2.cs,b=d[0],a=c[0],a0=i[b],a1=a2.fT
a1.toString
s=h?Object.create(new A.e5().constructor.prototype):Object.create(new A.c6(null,null).constructor.prototype)
s.$initialize=s.constructor
r=h?function static_tear_off(){this.$initialize()}:function tear_off(a3,a4){this.$initialize(a3,a4)}
s.constructor=r
r.prototype=s
s.$_name=b
s.$_target=a0
q=!h
if(q)p=A.jY(b,a0,g,f)
else{s.$static_name=b
p=a0}s.$S=A.lI(a1,h,g)
s[a]=p
for(o=p,n=1;n<d.length;++n){m=d[n]
if(typeof m=="string"){l=i[m]
k=m
m=l}else k=""
j=c[n]
if(j!=null){if(q)m=A.jY(k,m,g,f)
s[j]=m}if(n===e)o=m}s.$C=o
s.$R=a2.rC
s.$D=a2.dV
return r},
lI(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.f("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.lG)}throw A.f("Error in functionType of tearoff")},
lJ(a,b,c,d){var s=A.jX
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,s)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,s)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,s)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,s)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,s)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,s)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,s)}},
jY(a,b,c,d){if(c)return A.lL(a,b,d)
return A.lJ(b.length,d,a,b)},
lK(a,b,c,d){var s=A.jX,r=A.lH
switch(b?-1:a){case 0:throw A.f(new A.e4("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,r,s)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,r,s)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,r,s)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,r,s)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,r,s)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,r,s)
default:return function(e,f,g){return function(){var q=[g(this)]
Array.prototype.push.apply(q,arguments)
return e.apply(f(this),q)}}(d,r,s)}},
lL(a,b,c){var s,r
if($.jV==null)$.jV=A.jU("interceptor")
if($.jW==null)$.jW=A.jU("receiver")
s=b.length
r=A.lK(s,c,a,b)
return r},
jC(a){return A.lM(a)},
lG(a,b){return A.dt(v.typeUniverse,A.aJ(a.a),b)},
jX(a){return a.a},
lH(a){return a.b},
jU(a){var s,r,q,p=new A.c6("receiver","interceptor"),o=Object.getOwnPropertyNames(p)
o.$flags=1
s=o
for(o=s.length,r=0;r<o;++r){q=s[r]
if(p[q]===a)return q}throw A.f(A.aB("Field name "+a+" not found.",null))},
is(a){return v.getIsolateTag(a)},
eK(){throw A.f(new A.eB(null))},
p6(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
of(a){var s,r,q,p,o,n=A.K($.l0.$1(a)),m=$.ir[n]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iz[n]
if(s!=null)return s
r=v.interceptorsByTag[n]
if(r==null){q=A.ia($.kX.$2(a,n))
if(q!=null){m=$.ir[q]
if(m!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}s=$.iz[q]
if(s!=null)return s
r=v.interceptorsByTag[q]
n=q}}if(r==null)return null
s=r.prototype
p=n[0]
if(p==="!"){m=A.iC(s)
$.ir[n]=m
Object.defineProperty(a,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
return m.i}if(p==="~"){$.iz[n]=s
return s}if(p==="-"){o=A.iC(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}if(p==="+")return A.l3(a,s)
if(p==="*")throw A.f(A.kf(n))
if(v.leafTags[n]===true){o=A.iC(s)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:o,enumerable:false,writable:true,configurable:true})
return o.i}else return A.l3(a,s)},
l3(a,b){var s=Object.getPrototypeOf(a)
Object.defineProperty(s,v.dispatchPropertyName,{value:J.jG(b,s,null,null),enumerable:false,writable:true,configurable:true})
return b},
iC(a){return J.jG(a,!1,null,!!a.$ias)},
oh(a,b,c){var s=b.prototype
if(v.leafTags[a]===true)return A.iC(s)
else return J.jG(s,c,null,null)},
oa(){if(!0===$.jE)return
$.jE=!0
A.ob()},
ob(){var s,r,q,p,o,n,m,l
$.ir=Object.create(null)
$.iz=Object.create(null)
A.o9()
s=v.interceptorsByTag
r=Object.getOwnPropertyNames(s)
if(typeof window!="undefined"){window
q=function(){}
for(p=0;p<r.length;++p){o=r[p]
n=$.l4.$1(o)
if(n!=null){m=A.oh(o,s[o],n)
if(m!=null){Object.defineProperty(n,v.dispatchPropertyName,{value:m,enumerable:false,writable:true,configurable:true})
q.prototype=n}}}}for(p=0;p<r.length;++p){o=r[p]
if(/^[A-Za-z_]/.test(o)){l=s[o]
s["!"+o]=l
s["~"+o]=l
s["-"+o]=l
s["+"+o]=l
s["*"+o]=l}}},
o9(){var s,r,q,p,o,n,m=B.J()
m=A.cs(B.K,A.cs(B.L,A.cs(B.w,A.cs(B.w,A.cs(B.M,A.cs(B.N,A.cs(B.O(B.v),m)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){s=dartNativeDispatchHooksTransformer
if(typeof s=="function")s=[s]
if(Array.isArray(s))for(r=0;r<s.length;++r){q=s[r]
if(typeof q=="function")m=q(m)||m}}p=m.getTag
o=m.getUnknownTag
n=m.prototypeForTag
$.l0=new A.iv(p)
$.kX=new A.iw(o)
$.l4=new A.ix(n)},
cs(a,b){return a(b)||b},
mI(a,b){var s,r
for(s=0;s<a.length;++s){r=a[s]
if(!(s<b.length))return A.a(b,s)
if(!J.m(r,b[s]))return!1}return!0},
o1(a,b){var s=b.length,r=v.rttc[""+s+";"+a]
if(r==null)return null
if(s===0)return r
if(s===r.length)return r.apply(null,b)
return r(b)},
jZ(a,b,c,d,e,f){var s=b?"m":"",r=c?"":"i",q=d?"u":"",p=e?"s":"",o=function(g,h){try{return new RegExp(g,h)}catch(n){return n}}(a,s+r+q+p+f)
if(o instanceof RegExp)return o
throw A.f(A.dJ("Illegal RegExp pattern ("+String(o)+")",a,null))},
om(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
dc:function dc(a){this.a=a},
cl:function cl(a){this.a=a},
dd:function dd(a){this.a=a},
de:function de(a){this.a=a},
cm:function cm(a){this.a=a},
df:function df(a){this.a=a},
F:function F(a,b){this.a=a
this.b=b},
dg:function dg(a,b){this.a=a
this.b=b},
ay:function ay(a,b,c){this.a=a
this.b=b
this.c=c},
cn:function cn(a,b,c){this.a=a
this.b=b
this.c=c},
dh:function dh(a,b,c){this.a=a
this.b=b
this.c=c},
di:function di(a,b,c){this.a=a
this.b=b
this.c=c},
co:function co(a,b,c){this.a=a
this.b=b
this.c=c},
bV:function bV(a,b,c){this.a=a
this.b=b
this.c=c},
b_:function b_(a){this.a=a},
dj:function dj(a){this.a=a},
bz:function bz(a){this.a=a},
d5:function d5(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
cz:function cz(){},
N:function N(a,b,c){this.a=a
this.b=b
this.$ti=c},
fl:function fl(a){this.a=a},
cV:function cV(){},
fH:function fH(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
cQ:function cQ(){},
dR:function dR(a,b,c){this.a=a
this.b=b
this.c=c},
ec:function ec(a){this.a=a},
fj:function fj(a){this.a=a},
cC:function cC(a,b){this.a=a
this.b=b},
dl:function dl(a){this.a=a
this.b=null},
bl:function bl(){},
dD:function dD(){},
dE:function dE(){},
e9:function e9(){},
e5:function e5(){},
c6:function c6(a,b){this.a=a
this.b=b},
e4:function e4(a){this.a=a},
eB:function eB(a){this.a=a},
b1:function b1(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
f4:function f4(a){this.a=a},
f9:function f9(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
W:function W(a,b){this.a=a
this.$ti=b},
cI:function cI(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
fa:function fa(a,b){this.a=a
this.$ti=b},
aL:function aL(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bJ:function bJ(a,b){this.a=a
this.$ti=b},
cH:function cH(a,b,c,d){var _=this
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
iv:function iv(a){this.a=a},
iw:function iw(a){this.a=a},
ix:function ix(a){this.a=a},
O:function O(){},
bU:function bU(){},
ck:function ck(){},
aT:function aT(){},
ax:function ax(){},
dQ:function dQ(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=null},
d7:function d7(a){this.b=a},
ee:function ee(a,b,c){this.a=a
this.b=b
this.c=c},
cf:function cf(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.d=null},
or(a){throw A.U(A.k_(a),new Error())},
D(){throw A.U(A.lX(""),new Error())},
P(){throw A.U(A.k_(""),new Error())},
ei(){var s=new A.fU()
return s.b=s},
fU:function fU(){this.b=null},
bi(a,b,c){},
T(a){return a},
m2(a,b,c){A.bi(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
m5(a){return new Float32Array(a)},
m6(a,b,c){A.bi(a,b,c)
if(c==null)c=B.a.I(a.byteLength-b,4)
return new Float32Array(a,b,c)},
j9(a,b,c){A.bi(a,b,c)
if(c==null)c=B.a.I(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dW(a,b,c){A.bi(a,b,c)
if(c==null)c=B.a.I(a.byteLength-b,4)
return new Int32Array(a,b,c)},
ja(a,b,c){A.bi(a,b,c)
if(c==null)c=B.a.I(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
m7(a){return new Uint8Array(a)},
jb(a,b,c){A.bi(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
aV(a,b,c){if(a>>>0!==a||a>=c)throw A.f(A.eL(b,a))},
bq:function bq(){},
ca:function ca(){},
cK:function cK(a){this.a=a},
eA:function eA(a){this.a=a},
cN:function cN(){},
i3:function i3(a){this.a=a},
dU:function dU(){},
a8:function a8(){},
br:function br(){},
at:function at(){},
cb:function cb(){},
cL:function cL(){},
dV:function dV(){},
cM:function cM(){},
dX:function dX(){},
dY:function dY(){},
cO:function cO(){},
cP:function cP(){},
bL:function bL(){},
aN:function aN(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
et:function et(){},
eu:function eu(){},
d8:function d8(){},
d9:function d9(){},
da:function da(){},
db:function db(){},
eC:function eC(){},
je(a,b){var s=b.c
return s==null?b.c=A.dr(a,"ap",[b.x]):s},
k4(a){var s=a.w
if(s===6||s===7)return A.k4(a.x)
return s===11||s===12},
mh(a){return a.as},
c3(a,b){var s,r=b.length
for(s=0;s<r;++s)if(!a[s].b(b[s]))return!1
return!0},
dz(a){return A.i2(v.typeUniverse,a,!1)},
bZ(a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=a2.w
switch(a0){case 5:case 1:case 2:case 3:case 4:return a2
case 6:s=a2.x
r=A.bZ(a1,s,a3,a4)
if(r===s)return a2
return A.kr(a1,r,!0)
case 7:s=a2.x
r=A.bZ(a1,s,a3,a4)
if(r===s)return a2
return A.kq(a1,r,!0)
case 8:q=a2.y
p=A.cr(a1,q,a3,a4)
if(p===q)return a2
return A.dr(a1,a2.x,p)
case 9:o=a2.x
n=A.bZ(a1,o,a3,a4)
m=a2.y
l=A.cr(a1,m,a3,a4)
if(n===o&&l===m)return a2
return A.jr(a1,n,l)
case 10:k=a2.x
j=a2.y
i=A.cr(a1,j,a3,a4)
if(i===j)return a2
return A.ks(a1,k,i)
case 11:h=a2.x
g=A.bZ(a1,h,a3,a4)
f=a2.y
e=A.nQ(a1,f,a3,a4)
if(g===h&&e===f)return a2
return A.kp(a1,g,e)
case 12:d=a2.y
a4+=d.length
c=A.cr(a1,d,a3,a4)
o=a2.x
n=A.bZ(a1,o,a3,a4)
if(c===d&&n===o)return a2
return A.js(a1,n,c,!0)
case 13:b=a2.x
if(b<a4)return a2
a=a3[b-a4]
if(a==null)return a2
return a
default:throw A.f(A.dC("Attempted to substitute unexpected RTI kind "+a0))}},
cr(a,b,c,d){var s,r,q,p,o=b.length,n=A.i7(o)
for(s=!1,r=0;r<o;++r){q=b[r]
p=A.bZ(a,q,c,d)
if(p!==q)s=!0
n[r]=p}return s?n:b},
nR(a,b,c,d){var s,r,q,p,o,n,m=b.length,l=A.i7(m)
for(s=!1,r=0;r<m;r+=3){q=b[r]
p=b[r+1]
o=b[r+2]
n=A.bZ(a,o,c,d)
if(n!==o)s=!0
l.splice(r,3,q,p,n)}return s?l:b},
nQ(a,b,c,d){var s,r=b.a,q=A.cr(a,r,c,d),p=b.b,o=A.cr(a,p,c,d),n=b.c,m=A.nR(a,n,c,d)
if(q===r&&o===p&&m===n)return b
s=new A.eo()
s.a=q
s.b=o
s.c=m
return s},
i(a,b){a[v.arrayRti]=b
return a},
l_(a){var s=a.$S
if(s!=null){if(typeof s=="number")return A.o8(s)
return a.$S()}return null},
oc(a,b){var s
if(A.k4(b))if(a instanceof A.bl){s=A.l_(a)
if(s!=null)return s}return A.aJ(a)},
aJ(a){if(a instanceof A.d)return A.n(a)
if(Array.isArray(a))return A.a1(a)
return A.ju(J.aA(a))},
a1(a){var s=a[v.arrayRti],r=t.o
if(s==null)return r
if(s.constructor!==r.constructor)return r
return s},
n(a){var s=a.$ti
return s!=null?s:A.ju(a)},
ju(a){var s=a.constructor,r=s.$ccache
if(r!=null)return r
return A.nm(a,s)},
nm(a,b){var s=a instanceof A.bl?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,r=A.mU(v.typeUniverse,s.name)
b.$ccache=r
return r},
o8(a){var s,r=v.types,q=r[a]
if(typeof q=="string"){s=A.i2(v.typeUniverse,q,!1)
r[a]=s
return s}return q},
iu(a){return A.c0(A.n(a))},
jz(a){var s
if(a instanceof A.O)return A.o5(a.$r,a.aU())
s=a instanceof A.bl?A.l_(a):null
if(s!=null)return s
if(t.dm.b(a))return J.lC(a).a
if(Array.isArray(a))return A.a1(a)
return A.aJ(a)},
c0(a){var s=a.r
return s==null?a.r=new A.i1(a):s},
o5(a,b){var s,r,q=b,p=q.length
if(p===0)return t.bQ
if(0>=p)return A.a(q,0)
s=A.dt(v.typeUniverse,A.jz(q[0]),"@<0>")
for(r=1;r<p;++r){if(!(r<q.length))return A.a(q,r)
s=A.ku(v.typeUniverse,s,A.jz(q[r]))}return A.dt(v.typeUniverse,s,a)},
aK(a){return A.c0(A.i2(v.typeUniverse,a,!1))},
nl(a){var s=this
s.b=A.nO(s)
return s.b(a)},
nO(a){var s,r,q,p,o
if(a===t.K)return A.nu
if(A.c1(a))return A.ny
s=a.w
if(s===6)return A.nj
if(s===1)return A.kN
if(s===7)return A.np
r=A.nN(a)
if(r!=null)return r
if(s===8){q=a.x
if(a.y.every(A.c1)){a.f="$i"+q
if(q==="t")return A.ns
if(a===t.m)return A.nr
return A.nx}}else if(s===10){p=A.o1(a.x,a.y)
o=p==null?A.kN:p
return o==null?A.aU(o):o}return A.nh},
nN(a){if(a.w===8){if(a===t.S)return A.p
if(a===t.i||a===t.q)return A.nt
if(a===t.N)return A.nw
if(a===t.y)return A.bj}return null},
nk(a){var s=this,r=A.ng
if(A.c1(s))r=A.n3
else if(s===t.K)r=A.aU
else if(A.cu(s)){r=A.ni
if(s===t.gs)r=A.n1
else if(s===t.dk)r=A.ia
else if(s===t.fQ)r=A.n_
else if(s===t.cg)r=A.kz
else if(s===t.cD)r=A.n0
else if(s===t.an)r=A.n2}else if(s===t.S)r=A.j
else if(s===t.N)r=A.K
else if(s===t.y)r=A.bC
else if(s===t.q)r=A.eD
else if(s===t.i)r=A.S
else if(s===t.m)r=A.u
s.a=r
return s.a(a)},
nh(a){var s=this
if(a==null)return A.cu(s)
return A.l2(v.typeUniverse,A.oc(a,s),s)},
nj(a){if(a==null)return!0
return this.x.b(a)},
nx(a){var s,r=this
if(a==null)return A.cu(r)
s=r.f
if(a instanceof A.d)return!!a[s]
return!!J.aA(a)[s]},
ns(a){var s,r=this
if(a==null)return A.cu(r)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
s=r.f
if(a instanceof A.d)return!!a[s]
return!!J.aA(a)[s]},
nr(a){var s=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.d)return!!a[s.f]
return!0}if(typeof a=="function")return!0
return!1},
kM(a){if(typeof a=="object"){if(a instanceof A.d)return t.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
ng(a){var s=this
if(a==null){if(A.cu(s))return a}else if(s.b(a))return a
throw A.U(A.kD(a,s),new Error())},
ni(a){var s=this
if(a==null||s.b(a))return a
throw A.U(A.kD(a,s),new Error())},
kD(a,b){return new A.cp("TypeError: "+A.kh(a,A.ai(b,null)))},
o_(a,b,c,d){if(A.l2(v.typeUniverse,a,b))return a
throw A.U(A.mM("The type argument '"+A.ai(a,null)+"' is not a subtype of the type variable bound '"+A.ai(b,null)+"' of type variable '"+c+"' in '"+d+"'."),new Error())},
kh(a,b){return A.eU(a)+": type '"+A.ai(A.jz(a),null)+"' is not a subtype of type '"+b+"'"},
mM(a){return new A.cp("TypeError: "+a)},
aH(a,b){return new A.cp("TypeError: "+A.kh(a,b))},
np(a){var s=this
return s.x.b(a)||A.je(v.typeUniverse,s).b(a)},
nu(a){return a!=null},
aU(a){if(a!=null)return a
throw A.U(A.aH(a,"Object"),new Error())},
ny(a){return!0},
n3(a){return a},
kN(a){return!1},
bj(a){return!0===a||!1===a},
bC(a){if(!0===a)return!0
if(!1===a)return!1
throw A.U(A.aH(a,"bool"),new Error())},
n_(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.U(A.aH(a,"bool?"),new Error())},
S(a){if(typeof a=="number")return a
throw A.U(A.aH(a,"double"),new Error())},
n0(a){if(typeof a=="number")return a
if(a==null)return a
throw A.U(A.aH(a,"double?"),new Error())},
p(a){return typeof a=="number"&&Math.floor(a)===a},
j(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.U(A.aH(a,"int"),new Error())},
n1(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.U(A.aH(a,"int?"),new Error())},
nt(a){return typeof a=="number"},
eD(a){if(typeof a=="number")return a
throw A.U(A.aH(a,"num"),new Error())},
kz(a){if(typeof a=="number")return a
if(a==null)return a
throw A.U(A.aH(a,"num?"),new Error())},
nw(a){return typeof a=="string"},
K(a){if(typeof a=="string")return a
throw A.U(A.aH(a,"String"),new Error())},
ia(a){if(typeof a=="string")return a
if(a==null)return a
throw A.U(A.aH(a,"String?"),new Error())},
u(a){if(A.kM(a))return a
throw A.U(A.aH(a,"JSObject"),new Error())},
n2(a){if(a==null)return a
if(A.kM(a))return a
throw A.U(A.aH(a,"JSObject?"),new Error())},
kS(a,b){var s,r,q
for(s="",r="",q=0;q<a.length;++q,r=", ")s+=r+A.ai(a[q],b)
return s},
nI(a,b){var s,r,q,p,o,n,m=a.x,l=a.y
if(""===m)return"("+A.kS(l,b)+")"
s=l.length
r=m.split(",")
q=r.length-s
for(p="(",o="",n=0;n<s;++n,o=", "){p+=o
if(q===0)p+="{"
p+=A.ai(l[n],b)
if(q>=0)p+=" "+r[q];++q}return p+"})"},
kJ(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", ",a2=null
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
if(l===8){p=A.nS(a.x)
o=a.y
return o.length>0?p+("<"+A.kS(o,b)+">"):p}if(l===10)return A.nI(a,b)
if(l===11)return A.kJ(a,b,null)
if(l===12)return A.kJ(a.x,b,a.y)
if(l===13){n=a.x
m=b.length
n=m-1-n
if(!(n>=0&&n<m))return A.a(b,n)
return b[n]}return"?"},
nS(a){var s=A.l6(a)
if(s!=null)return s
return"minified:"+a},
mV(a,b){var s=a.tR[b]
while(typeof s=="string")s=a.tR[s]
return s},
mU(a,b){var s,r,q,p,o,n=a.eT,m=n[b]
if(m==null)return A.i2(a,b,!1)
else if(typeof m=="number"){s=m
r=A.ds(a,5,"#")
q=A.i7(s)
for(p=0;p<s;++p)q[p]=r
o=A.dr(a,b,q)
n[b]=o
return o}else return m},
mT(a,b){return A.kw(a.tR,b)},
mS(a,b){return A.kw(a.eT,b)},
i2(a,b,c){var s,r=a.eC,q=r.get(b)
if(q!=null)return q
s=A.kt(a,null,b,!1)
r.set(b,s)
return s},
dt(a,b,c){var s,r,q=b.z
if(q==null)q=b.z=new Map()
s=q.get(c)
if(s!=null)return s
r=A.kt(a,b,c,!0)
q.set(c,r)
return r},
ku(a,b,c){var s,r,q,p=b.Q
if(p==null)p=b.Q=new Map()
s=c.as
r=p.get(s)
if(r!=null)return r
q=A.jr(a,b,c.w===9?c.y:[c])
p.set(s,q)
return q},
kt(a,b,c,d){return A.mG(A.mA(a,b,c,d))},
bA(a,b){b.a=A.nk
b.b=A.nl
return b},
ds(a,b,c){var s,r,q=a.eC.get(c)
if(q!=null)return q
s=new A.aP(null,null)
s.w=b
s.as=c
r=A.bA(a,s)
a.eC.set(c,r)
return r},
kr(a,b,c){var s,r=b.as+"?",q=a.eC.get(r)
if(q!=null)return q
s=A.mQ(a,b,r,c)
a.eC.set(r,s)
return s},
mQ(a,b,c,d){var s,r,q
if(d){s=b.w
r=!0
if(!A.c1(b))if(!(b===t.b||b===t.T))if(s!==6)r=s===7&&A.cu(b.x)
if(r)return b
else if(s===1)return t.b}q=new A.aP(null,null)
q.w=6
q.x=b
q.as=c
return A.bA(a,q)},
kq(a,b,c){var s,r=b.as+"/",q=a.eC.get(r)
if(q!=null)return q
s=A.mO(a,b,r,c)
a.eC.set(r,s)
return s},
mO(a,b,c,d){var s,r
if(d){s=b.w
if(A.c1(b)||b===t.K)return b
else if(s===1)return A.dr(a,"ap",[b])
else if(b===t.b||b===t.T)return t.eH}r=new A.aP(null,null)
r.w=7
r.x=b
r.as=c
return A.bA(a,r)},
mR(a,b){var s,r,q=""+b+"^",p=a.eC.get(q)
if(p!=null)return p
s=new A.aP(null,null)
s.w=13
s.x=b
s.as=q
r=A.bA(a,s)
a.eC.set(q,r)
return r},
dq(a){var s,r,q,p=a.length
for(s="",r="",q=0;q<p;++q,r=",")s+=r+a[q].as
return s},
mN(a){var s,r,q,p,o,n=a.length
for(s="",r="",q=0;q<n;q+=3,r=","){p=a[q]
o=a[q+1]?"!":":"
s+=r+p+o+a[q+2].as}return s},
dr(a,b,c){var s,r,q,p=b
if(c.length>0)p+="<"+A.dq(c)+">"
s=a.eC.get(p)
if(s!=null)return s
r=new A.aP(null,null)
r.w=8
r.x=b
r.y=c
if(c.length>0)r.c=c[0]
r.as=p
q=A.bA(a,r)
a.eC.set(p,q)
return q},
jr(a,b,c){var s,r,q,p,o,n
if(b.w===9){s=b.x
r=b.y.concat(c)}else{r=c
s=b}q=s.as+(";<"+A.dq(r)+">")
p=a.eC.get(q)
if(p!=null)return p
o=new A.aP(null,null)
o.w=9
o.x=s
o.y=r
o.as=q
n=A.bA(a,o)
a.eC.set(q,n)
return n},
ks(a,b,c){var s,r,q="+"+(b+"("+A.dq(c)+")"),p=a.eC.get(q)
if(p!=null)return p
s=new A.aP(null,null)
s.w=10
s.x=b
s.y=c
s.as=q
r=A.bA(a,s)
a.eC.set(q,r)
return r},
kp(a,b,c){var s,r,q,p,o,n=b.as,m=c.a,l=m.length,k=c.b,j=k.length,i=c.c,h=i.length,g="("+A.dq(m)
if(j>0){s=l>0?",":""
g+=s+"["+A.dq(k)+"]"}if(h>0){s=l>0?",":""
g+=s+"{"+A.mN(i)+"}"}r=n+(g+")")
q=a.eC.get(r)
if(q!=null)return q
p=new A.aP(null,null)
p.w=11
p.x=b
p.y=c
p.as=r
o=A.bA(a,p)
a.eC.set(r,o)
return o},
js(a,b,c,d){var s,r=b.as+("<"+A.dq(c)+">"),q=a.eC.get(r)
if(q!=null)return q
s=A.mP(a,b,c,r,d)
a.eC.set(r,s)
return s},
mP(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(e){s=c.length
r=A.i7(s)
for(q=0,p=0;p<s;++p){o=c[p]
if(o.w===1){r[p]=o;++q}}if(q>0){n=A.bZ(a,b,r,0)
m=A.cr(a,c,r,0)
return A.js(a,n,m,c!==m)}}l=new A.aP(null,null)
l.w=12
l.x=b
l.y=c
l.as=d
return A.bA(a,l)},
mA(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
mG(a){var s,r,q,p,o,n,m,l=a.r,k=a.s
for(s=l.length,r=0;r<s;){q=l.charCodeAt(r)
if(q>=48&&q<=57)r=A.mC(r+1,q,l,k)
else if((((q|32)>>>0)-97&65535)<26||q===95||q===36||q===124)r=A.km(a,r,l,k,!1)
else if(q===46)r=A.km(a,r,l,k,!0)
else{++r
switch(q){case 44:break
case 58:k.push(!1)
break
case 33:k.push(!0)
break
case 59:k.push(A.bT(a.u,a.e,k.pop()))
break
case 94:k.push(A.mR(a.u,k.pop()))
break
case 35:k.push(A.ds(a.u,5,"#"))
break
case 64:k.push(A.ds(a.u,2,"@"))
break
case 126:k.push(A.ds(a.u,3,"~"))
break
case 60:k.push(a.p)
a.p=k.length
break
case 62:A.mE(a,k)
break
case 38:A.mD(a,k)
break
case 63:p=a.u
k.push(A.kr(p,A.bT(p,a.e,k.pop()),a.n))
break
case 47:p=a.u
k.push(A.kq(p,A.bT(p,a.e,k.pop()),a.n))
break
case 40:k.push(-3)
k.push(a.p)
a.p=k.length
break
case 41:A.mB(a,k)
break
case 91:k.push(a.p)
a.p=k.length
break
case 93:o=k.splice(a.p)
A.kn(a.u,a.e,o)
a.p=k.pop()
k.push(o)
k.push(-1)
break
case 123:k.push(a.p)
a.p=k.length
break
case 125:o=k.splice(a.p)
A.mH(a.u,a.e,o)
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
return A.bT(a.u,a.e,m)},
mC(a,b,c,d){var s,r,q=b-48
for(s=c.length;a<s;++a){r=c.charCodeAt(a)
if(!(r>=48&&r<=57))break
q=q*10+(r-48)}d.push(q)
return a},
km(a,b,c,d,e){var s,r,q,p,o,n,m=b+1
for(s=c.length;m<s;++m){r=c.charCodeAt(m)
if(r===46){if(e)break
e=!0}else{if(!((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124))q=r>=48&&r<=57
else q=!0
if(!q)break}}p=c.substring(b,m)
if(e){s=a.u
o=a.e
if(o.w===9)o=o.x
n=A.mV(s,o.x)[p]
if(n==null)A.x('No "'+p+'" in "'+A.mh(o)+'"')
d.push(A.dt(s,o,n))}else d.push(p)
return m},
mE(a,b){var s,r=a.u,q=A.kl(a,b),p=b.pop()
if(typeof p=="string")b.push(A.dr(r,p,q))
else{s=A.bT(r,a.e,p)
switch(s.w){case 11:b.push(A.js(r,s,q,a.n))
break
default:b.push(A.jr(r,s,q))
break}}},
mB(a,b){var s,r,q,p=a.u,o=b.pop(),n=null,m=null
if(typeof o=="number")switch(o){case-1:n=b.pop()
break
case-2:m=b.pop()
break
default:b.push(o)
break}else b.push(o)
s=A.kl(a,b)
o=b.pop()
switch(o){case-3:o=b.pop()
if(n==null)n=p.sEA
if(m==null)m=p.sEA
r=A.bT(p,a.e,o)
q=new A.eo()
q.a=s
q.b=n
q.c=m
b.push(A.kp(p,r,q))
return
case-4:b.push(A.ks(p,b.pop(),s))
return
default:throw A.f(A.dC("Unexpected state under `()`: "+A.v(o)))}},
mD(a,b){var s=b.pop()
if(0===s){b.push(A.ds(a.u,1,"0&"))
return}if(1===s){b.push(A.ds(a.u,4,"1&"))
return}throw A.f(A.dC("Unexpected extended operation "+A.v(s)))},
kl(a,b){var s=b.splice(a.p)
A.kn(a.u,a.e,s)
a.p=b.pop()
return s},
bT(a,b,c){if(typeof c=="string")return A.dr(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.mF(a,b,c)}else return c},
kn(a,b,c){var s,r=c.length
for(s=0;s<r;++s)c[s]=A.bT(a,b,c[s])},
mH(a,b,c){var s,r=c.length
for(s=2;s<r;s+=3)c[s]=A.bT(a,b,c[s])},
mF(a,b,c){var s,r,q=b.w
if(q===9){if(c===0)return b.x
s=b.y
r=s.length
if(c<=r)return s[c-1]
c-=r
b=b.x
q=b.w}else if(c===0)return b
if(q!==8)throw A.f(A.dC("Indexed base must be an interface type"))
s=b.y
if(c<=s.length)return s[c-1]
throw A.f(A.dC("Bad index "+c+" for "+b.p(0)))},
l2(a,b,c){var s,r=b.d
if(r==null)r=b.d=new Map()
s=r.get(c)
if(s==null){s=A.a2(a,b,null,c,null)
r.set(c,s)}return s},
a2(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i
if(b===d)return!0
if(A.c1(d))return!0
s=b.w
if(s===4)return!0
if(A.c1(b))return!1
if(b.w===1)return!0
r=s===13
if(r)if(A.a2(a,c[b.x],c,d,e))return!0
q=d.w
p=t.b
if(b===p||b===t.T){if(q===7)return A.a2(a,b,c,d.x,e)
return d===p||d===t.T||q===6}if(d===t.K){if(s===7)return A.a2(a,b.x,c,d,e)
return s!==6}if(s===7){if(!A.a2(a,b.x,c,d,e))return!1
return A.a2(a,A.je(a,b),c,d,e)}if(s===6)return A.a2(a,p,c,d,e)&&A.a2(a,b.x,c,d,e)
if(q===7){if(A.a2(a,b,c,d.x,e))return!0
return A.a2(a,b,c,A.je(a,d),e)}if(q===6)return A.a2(a,b,c,p,e)||A.a2(a,b,c,d.x,e)
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
if(!A.a2(a,j,c,i,e)||!A.a2(a,i,e,j,c))return!1}return A.kL(a,b.x,c,d.x,e)}if(q===11){if(b===t.g)return!0
if(p)return!1
return A.kL(a,b,c,d,e)}if(s===8){if(q!==8)return!1
return A.nq(a,b,c,d,e)}if(o&&q===10)return A.nv(a,b,c,d,e)
return!1},
kL(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
if(!A.a2(a3,a4.x,a5,a6.x,a7))return!1
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
if(!A.a2(a3,p[h],a7,g,a5))return!1}for(h=0;h<m;++h){g=l[h]
if(!A.a2(a3,p[o+h],a7,g,a5))return!1}for(h=0;h<i;++h){g=l[m+h]
if(!A.a2(a3,k[h],a7,g,a5))return!1}f=s.c
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
if(!A.a2(a3,e[a+2],a7,g,a5))return!1
break}}while(b<d){if(f[b+1])return!1
b+=3}return!0},
nq(a,b,c,d,e){var s,r,q,p,o,n=b.x,m=d.x
while(n!==m){s=a.tR[n]
if(s==null)return!1
if(typeof s=="string"){n=s
continue}r=s[m]
if(r==null)return!1
q=r.length
p=q>0?new Array(q):v.typeUniverse.sEA
for(o=0;o<q;++o)p[o]=A.dt(a,b,r[o])
return A.ky(a,p,null,c,d.y,e)}return A.ky(a,b.y,null,c,d.y,e)},
ky(a,b,c,d,e,f){var s,r=b.length
for(s=0;s<r;++s)if(!A.a2(a,b[s],d,e[s],f))return!1
return!0},
nv(a,b,c,d,e){var s,r=b.y,q=d.y,p=r.length
if(p!==q.length)return!1
if(b.x!==d.x)return!1
for(s=0;s<p;++s)if(!A.a2(a,r[s],c,q[s],e))return!1
return!0},
cu(a){var s=a.w,r=!0
if(!(a===t.b||a===t.T))if(!A.c1(a))if(s!==6)r=s===7&&A.cu(a.x)
return r},
c1(a){var s=a.w
return s===2||s===3||s===4||s===5||a===t.X},
kw(a,b){var s,r,q=Object.keys(b),p=q.length
for(s=0;s<p;++s){r=q[s]
a[r]=b[r]}},
i7(a){return a>0?new Array(a):v.typeUniverse.sEA},
aP:function aP(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
eo:function eo(){this.c=this.b=this.a=null},
i1:function i1(a){this.a=a},
el:function el(){},
cp:function cp(a){this.a=a},
mu(){var s,r,q
if(self.scheduleImmediate!=null)return A.nU()
if(self.MutationObserver!=null&&self.document!=null){s={}
r=self.document.createElement("div")
q=self.document.createElement("span")
s.a=null
new self.MutationObserver(A.dy(new A.fQ(s),1)).observe(r,{childList:true})
return new A.fP(s,r,q)}else if(self.setImmediate!=null)return A.nV()
return A.nW()},
mv(a){self.scheduleImmediate(A.dy(new A.fR(t.O.a(a)),0))},
mw(a){self.setImmediate(A.dy(new A.fS(t.O.a(a)),0))},
mx(a){t.O.a(a)
A.mJ(0,a)},
mJ(a,b){var s=new A.hZ()
s.eq(a,b)
return s},
kP(a){return new A.ef(new A.J($.E,a.i("J<0>")),a.i("ef<0>"))},
kC(a,b){a.$2(0,null)
b.b=!0
return b.a},
ib(a,b){A.n4(a,b)},
kB(a,b){var s,r=b.$ti
r.i("1/").a(a)
s=b.a
if(r.i("ap<1>").b(a))s.cL(a)
else s.cP(a)},
kA(a,b){var s=A.ad(a),r=A.bk(a),q=A.kK(s,r)
s=new A.an(s,r)
r=b.b
q=b.a
if(r)q.be(s)
else q.bc(s)},
n4(a,b){var s,r,q=new A.ic(b),p=new A.id(b)
if(a instanceof A.J)a.dq(q,p,t.z)
else{s=t.z
if(a instanceof A.J)a.co(q,p,s)
else{r=new A.J($.E,t._)
r.a=8
r.c=a
r.dq(q,p,s)}}},
kW(a){var s=function(b,c){return function(d,e){while(true){try{b(d,e)
break}catch(q){e=q
d=c}}}}(a,1),r=$.E
return r.bZ(r,t.as.a(new A.iq(s)),t.H,t.S,t.z)},
iU(a){var s
if(t.R.b(a)){s=a.gaS()
if(s!=null)return s}return B.q},
kK(a,b){var s=$.E
if(s===B.k)return null
s.eU(s,a,b)
return null},
nn(a,b){if($.E!==B.k)A.kK(a,b)
if(t.R.b(a)){b=a.gaS()
if(b==null){A.me(a,B.q)
b=B.q}}else b=B.q
return new A.an(a,b)},
jl(a,b,c){var s,r,q,p,o,n={},m=n.a=a
for(s=t._;r=m.a,(r&4)!==0;m=a){a=s.a(m.c)
n.a=a}if(m===b){s=A.mi()
b.bc(new A.an(new A.aW(!0,m,null,"Cannot complete a future with itself"),s))
return}q=b.a&1
s=m.a=r|q
if((s&24)===0){p=t.F.a(b.c)
b.a=b.a&1|4
b.c=m
m.d9(p)
return}if(!c)if(b.c==null)m=(s&16)===0||q!==0
else m=!1
else m=!0
if(m){p=b.aW()
b.bd(n.a)
A.bR(b,p)
return}b.a^=2
o=b.b
o.aX(o,new A.hw(n,b))},
bR(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e={},d=e.a=a
for(s=t.v,r=t.F;;){q={}
p=d.a
o=(p&16)===0
n=!o
if(b==null){if(n&&(p&1)===0){m=s.a(d.c)
d=d.b
d.aV(d,m.a,m.b)}return}q.a=b
l=b.a
for(d=b;l!=null;d=l,l=k){d.a=null
A.bR(e.a,d)
q.a=l
k=l.a}j=e.a.c
q.b=n
q.c=j
if(o){p=d.c
p=(p&1)!==0||(p&15)===8}else p=!0
if(p){i=d.b.b
h=$.E
if(h!==i)$.E=i
else h=null
d=d.c
if((d&15)===8)new A.hA(q,e,n).$0()
else if(o){if((d&1)!==0)new A.hz(q,j).$0()}else if((d&2)!==0)new A.hy(e,q).$0()
if(h!=null)$.E=h
d=q.c
if(d instanceof A.J){p=q.a.$ti
p=p.i("ap<2>").b(d)||!p.y[1].b(d)}else p=!1
if(p){g=q.a.b
if((d.a&24)!==0){f=r.a(g.c)
g.c=null
b=g.bq(f)
g.a=d.a&30|g.a&1
g.c=d.c
e.a=d
continue}else A.jl(d,g,!0)
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
nJ(a,b){var s=t.C
if(s.b(a))return b.bZ(b,s.a(a),t.z,t.K,t.l)
s=t.w
if(s.b(a))return b.bo(b,s.a(a),t.z,t.K)
throw A.f(A.jT(a,"onError",u.c))},
nC(){var s,r
for(s=$.cq;s!=null;s=$.cq){$.dw=null
r=s.b
$.cq=r
if(r==null)$.dv=null
s.a.$0()}},
nP(){$.jv=!0
try{A.nC()}finally{$.dw=null
$.jv=!1
if($.cq!=null)$.jM().$1(A.kY())}},
kT(a){var s=new A.eg(a),r=$.dv
if(r==null){$.cq=$.dv=s
if(!$.jv)$.jM().$1(A.kY())}else $.dv=r.b=s},
nM(a){var s,r,q,p=$.cq
if(p==null){A.kT(a)
$.dw=$.dv
return}s=new A.eg(a)
r=$.dw
if(r==null){s.b=p
$.cq=$.dw=s}else{q=r.b
s.b=q
$.dw=r.b=s
if(q==null)$.dv=s}},
oo(a){var s=$.E
if(B.k===s){A.jx(B.k,a)
return}A.jx(s,s.bn(s,a,t.H))
return},
oG(a,b){A.jB(a,"stream",t.K)
return new A.ex(b.i("ex<0>"))},
jy(a){return},
my(a,b){if(b==null)b=A.nY()
if(t.da.b(b))return a.bZ(a,t.C.a(b),t.z,t.K,t.l)
if(t.d5.b(b))return a.bo(a,t.w.a(b),t.z,t.K)
throw A.f(A.aB("handleError callback must take either an Object (the error), or both an Object (the error) and a StackTrace.",null))},
nE(a,b){var s=$.E
s.aV(s,a,b)},
nD(){},
nL(a,b){A.nM(new A.ip(a,b))},
jx(a,b){if(B.k!==a)b=a.fE(b,t.H)
A.kT(b)},
fQ:function fQ(a){this.a=a},
fP:function fP(a,b,c){this.a=a
this.b=b
this.c=c},
fR:function fR(a){this.a=a},
fS:function fS(a){this.a=a},
hZ:function hZ(){},
i_:function i_(a,b){this.a=a
this.b=b},
ef:function ef(a,b){this.a=a
this.b=!1
this.$ti=b},
ic:function ic(a){this.a=a},
id:function id(a){this.a=a},
iq:function iq(a){this.a=a},
an:function an(a,b){this.a=a
this.b=b},
ej:function ej(){},
d3:function d3(a,b){this.a=a
this.$ti=b},
bd:function bd(a,b,c,d,e){var _=this
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
eg:function eg(a){this.a=a
this.b=null},
cY:function cY(){},
fw:function fw(a,b){this.a=a
this.b=b},
fx:function fx(a,b){this.a=a
this.b=b},
dm:function dm(){},
hW:function hW(a){this.a=a},
hV:function hV(a){this.a=a},
eh:function eh(){},
cg:function cg(a,b,c,d,e){var _=this
_.a=null
_.b=0
_.c=null
_.d=a
_.e=b
_.f=c
_.r=d
_.$ti=e},
ch:function ch(a,b){this.a=a
this.$ti=b},
ci:function ci(a,b,c,d,e,f){var _=this
_.w=a
_.a=b
_.c=c
_.d=d
_.e=e
_.r=_.f=null
_.$ti=f},
d4:function d4(){},
fT:function fT(a){this.a=a},
dp:function dp(){},
by:function by(){},
bP:function bP(a,b){this.b=a
this.a=null
this.$ti=b},
ek:function ek(){},
aR:function aR(a){var _=this
_.a=0
_.c=_.b=null
_.$ti=a},
hS:function hS(a,b){this.a=a
this.b=b},
ex:function ex(a){this.$ti=a},
fN:function fN(){},
fO:function fO(a,b,c){this.a=a
this.b=b
this.c=c},
ip:function ip(a,b){this.a=a
this.b=b},
lY(a,b,c){return b.i("@<0>").a3(c).i("j6<1,2>").a(A.o6(a,new A.b1(b.i("@<0>").a3(c).i("b1<1,2>"))))},
ab(a,b){return new A.b1(a.i("@<0>").a3(b).i("b1<1,2>"))},
lZ(a){return new A.bf(a.i("bf<0>"))},
j7(a){return new A.bf(a.i("bf<0>"))},
jn(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
k0(a){var s,r
if(A.jF(a))return"{...}"
s=new A.cd("")
try{r={}
B.b.m($.az,a)
s.a+="{"
r.a=!0
a.aI(0,new A.fd(r,s))
s.a+="}"}finally{if(0>=$.az.length)return A.a($.az,-1)
$.az.pop()}r=s.a
return r.charCodeAt(0)==0?r:r},
bf:function bf(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
bS:function bS(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
es:function es(a){this.a=a
this.c=this.b=null},
d6:function d6(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
w:function w(){},
H:function H(){},
fc:function fc(a){this.a=a},
fd:function fd(a,b){this.a=a
this.b=b},
b6:function b6(){},
dk:function dk(){},
nF(a,b){var s,r,q,p=null
try{p=JSON.parse(a)}catch(r){s=A.ad(r)
q=A.dJ(String(s),null,null)
throw A.f(q)}q=A.ie(p)
return q},
ie(a){var s
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.eq(a,Object.create(null))
for(s=0;s<a.length;++s)a[s]=A.ie(a[s])
return a},
mX(a,b,c){var s,r,q,p,o,n=c-b
if(n<=4096)s=$.ls()
else s=new Uint8Array(n)
for(r=a.length,q=0;q<n;++q){p=b+q
if(!(p<r))return A.a(a,p)
o=a[p]
if((o&255)!==o)o=255
s[q]=o}return s},
mW(a,b,c,d){var s=a?$.lr():$.lq()
if(s==null)return null
if(0===c&&d===b.length)return A.kv(s,b)
return A.kv(s,b.subarray(c,d))},
kv(a,b){var s,r
try{s=a.decode(b)
return s}catch(r){}return null},
mY(a){switch(a){case 65:return"Missing extension byte"
case 67:return"Unexpected extension byte"
case 69:return"Invalid UTF-8 byte"
case 71:return"Overlong encoding"
case 73:return"Out of unicode range"
case 75:return"Encoded surrogate"
case 77:return"Unfinished UTF-8 octet sequence"
default:return""}},
eq:function eq(a,b){this.a=a
this.b=b
this.c=null},
hL:function hL(a){this.a=a},
er:function er(a){this.a=a},
i6:function i6(){},
i5:function i5(){},
c7:function c7(){},
dG:function dG(){},
dH:function dH(){},
dS:function dS(){},
f5:function f5(a){this.a=a},
ed:function ed(){},
fK:function fK(a){this.a=a},
i4:function i4(a){this.a=a
this.b=16
this.c=0},
od(a,b){var s=A.mc(a,b)
if(s!=null)return s
throw A.f(A.dJ(a,null,null))},
lO(a,b){a=A.U(a,new Error())
if(a==null)a=A.aU(a)
a.stack=b.p(0)
throw a},
j8(a,b,c,d){var s,r=c?J.j3(a,d):J.j2(a,d)
if(a!==0&&b!=null)for(s=0;s<r.length;++s)r[s]=b
return r},
m_(a,b,c){var s,r,q=A.i([],c.i("y<0>"))
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.V)(a),++r)B.b.m(q,c.a(a[r]))
q.$flags=1
return q},
aM(a,b){var s,r
if(Array.isArray(a))return A.i(a.slice(0),b.i("y<0>"))
s=A.i([],b.i("y<0>"))
for(r=J.cv(a);r.u();)B.b.m(s,r.gA())
return s},
mj(a,b,c){var s,r
A.aO(b,"start")
s=c-b
if(s<0)throw A.f(A.al(c,b,null,"end",null))
if(s===0)return""
r=A.mk(a,b,c)
return r},
mk(a,b,c){var s=a.length
if(b>=s)return""
return A.md(a,b,c==null||c>s?s:c)},
e3(a){return new A.dQ(a,A.jZ(a,!1,!0,!1,!1,""))},
k8(a,b,c){var s=J.cv(b)
if(!s.u())return a
if(c.length===0){do a+=A.v(s.gA())
while(s.u())}else{a+=A.v(s.gA())
while(s.u())a=a+c+A.v(s.gA())}return a},
mi(){return A.bk(new Error())},
eU(a){if(typeof a=="number"||A.bj(a)||a==null)return J.bE(a)
if(typeof a=="string")return JSON.stringify(a)
return A.k2(a)},
lP(a,b){A.jB(a,"error",t.K)
A.jB(b,"stackTrace",t.l)
A.lO(a,b)},
dC(a){return new A.cx(a)},
aB(a,b){return new A.aW(!1,null,b,a)},
jT(a,b,c){return new A.aW(!0,a,b,c)},
eO(a,b,c){return a},
k3(a){var s=null
return new A.b5(s,s,!1,s,s,a)},
mf(a,b){return new A.b5(null,null,!0,a,b,"Value not in range")},
al(a,b,c,d,e){return new A.b5(b,c,!0,a,d,"Invalid value")},
bt(a,b,c){if(0>a||a>c)throw A.f(A.al(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.f(A.al(b,a,c,"end",null))
return b}return c},
aO(a,b){if(a<0)throw A.f(A.al(a,0,null,b,null))
return a},
iY(a,b,c,d){return new A.dK(b,!0,a,d,"Index out of range")},
aF(a){return new A.d1(a)},
kf(a){return new A.eb(a)},
aD(a){return new A.b8(a)},
ao(a){return new A.dF(a)},
dJ(a,b,c){return new A.a_(a,b,c)},
lU(a,b,c){var s,r
if(A.jF(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}s=A.i([],t.s)
B.b.m($.az,a)
try{A.nz(a,s)}finally{if(0>=$.az.length)return A.a($.az,-1)
$.az.pop()}r=A.k8(b,t.hf.a(s),", ")+c
return r.charCodeAt(0)==0?r:r},
j1(a,b,c){var s,r
if(A.jF(a))return b+"..."+c
s=new A.cd(b)
B.b.m($.az,a)
try{r=s
r.a=A.k8(r.a,a,", ")}finally{if(0>=$.az.length)return A.a($.az,-1)
$.az.pop()}s.a+=c
r=s.a
return r.charCodeAt(0)==0?r:r},
nz(a,b){var s,r,q,p,o,n,m,l=a.gD(a),k=0,j=0
for(;;){if(!(k<80||j<3))break
if(!l.u())return
s=A.v(l.gA())
B.b.m(b,s)
k+=s.length+2;++j}if(!l.u()){if(j<=5)return
if(0>=b.length)return A.a(b,-1)
r=b.pop()
if(0>=b.length)return A.a(b,-1)
q=b.pop()}else{p=l.gA();++j
if(!l.u()){if(j<=4){B.b.m(b,A.v(p))
return}r=A.v(p)
if(0>=b.length)return A.a(b,-1)
q=b.pop()
k+=r.length+2}else{o=l.gA();++j
for(;l.u();p=o,o=n){n=l.gA();++j
if(j>100){for(;;){if(!(k>75&&j>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2;--j}B.b.m(b,"...")
return}}q=A.v(p)
r=A.v(o)
k+=r.length+q.length+4}}if(j>b.length+2){k+=5
m="..."}else m=null
for(;;){if(!(k>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
k-=b.pop().length+2
if(m==null){k+=5
m="..."}}if(m!=null)B.b.m(b,m)
B.b.m(b,q)
B.b.m(b,r)},
dZ(a,b,c,d){var s
if(B.m===c){s=J.am(a)
b=J.am(b)
return A.fD(A.ba(A.ba($.eN(),s),b))}if(B.m===d){s=J.am(a)
b=J.am(b)
c=J.am(c)
return A.fD(A.ba(A.ba(A.ba($.eN(),s),b),c))}s=J.am(a)
b=J.am(b)
c=J.am(c)
d=J.am(d)
d=A.fD(A.ba(A.ba(A.ba(A.ba($.eN(),s),b),c),d))
return d},
m8(a){var s,r,q=$.eN()
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.V)(a),++r)q=A.ba(q,J.am(a[r]))
return A.fD(q)},
h9:function h9(){},
L:function L(){},
cx:function cx(a){this.a=a},
bb:function bb(){},
aW:function aW(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
b5:function b5(a,b,c,d,e,f){var _=this
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
d1:function d1(a){this.a=a},
eb:function eb(a){this.a=a},
b8:function b8(a){this.a=a},
dF:function dF(a){this.a=a},
e_:function e_(){},
cX:function cX(){},
ha:function ha(a){this.a=a},
a_:function a_(a,b,c){this.a=a
this.b=b
this.c=c},
k:function k(){},
bp:function bp(a,b,c){this.a=a
this.b=b
this.$ti=c},
Y:function Y(){},
d:function d(){},
ey:function ey(){},
fv:function fv(){this.b=this.a=0},
cd:function cd(a){this.a=a},
n9(a,b){var s,r,q
if(t.gd.b(a))return a
s=t.g.a(v.G.Error)
r=A.v(a)
r=A.nZ(s,["Wrapped Dart error thrown from converted Future. See 'error'and 'stack' properties.\n"+r],t.m)
if(t.aX.b(a))A.x("Attempting to box non-Dart object.")
q={}
q[$.lt()]=a
r.error=q
r.stack=b.p(0)
return r},
lQ(a,b){var s,r=v.G.Promise,q=new A.f_(a)
if(typeof q=="function")A.x(A.aB("Attempting to rewrap a JS function.",null))
s=function(c,d){return function(e,f){return c(d,e,f,arguments.length)}}(A.n7,q)
s[$.iP()]=q
return A.u(new r(s))},
fi:function fi(a){this.a=a},
f_:function f_(a){this.a=a},
eY:function eY(a){this.a=a},
eZ:function eZ(a){this.a=a},
n6(a,b,c){t.Z.a(a)
if(A.j(c)>=1)return a.$1(b)
return a.$0()},
n7(a,b,c,d){t.Z.a(a)
A.j(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
dx(a,b,c,d){return d.a(a[b].apply(a,c))},
nZ(a,b,c){var s,r
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
jH(a,b){var s=new A.J($.E,b.i("J<0>")),r=new A.d3(s,b.i("d3<0>"))
a.then(A.dy(new A.iF(r,b),1),A.dy(new A.iG(r),1))
return s},
iF:function iF(a,b){this.a=a
this.b=b},
iG:function iG(a){this.a=a},
f0:function f0(){},
f1:function f1(a,b,c){this.a=a
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
iX(a,b){var s=new A.f2()
s.en(a,b)
return s},
f2:function f2(){this.a=$
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
dL:function dL(a,b,c){var _=this
_.a=a
_.b=null
_.c=b
_.d=null
_.e=c
_.f=!1
_.w=_.r=0},
o2(a,b,c){var s,r="The decoded data is larger than the ",q=new A.dT(a,b,a.a),p=null
try{p=c.$1(q)}catch(s){if(q.e)throw A.f(A.iT(r+b+" bytes allowed"))
throw s}if(q.e)throw A.f(A.iT(r+b+" bytes allowed"))
return p},
dT:function dT(a,b,c){var _=this
_.b=a
_.c=b
_.d=0
_.e=!1
_.a=c},
iS(a){return new A.c5(a,null,null)},
lE(a){return new A.cw(a,null,null)},
iT(a){return new A.dB(a,null,null)},
c5:function c5(a,b,c){this.a=a
this.b=b
this.c=c},
cw:function cw(a,b,c){this.a=a
this.b=b
this.c=c},
dB:function dB(a,b,c){this.a=a
this.b=b
this.c=c},
cy:function cy(a,b){this.a=a
this.b=b},
fu:function fu(a,b,c){var _=this
_.b=a
_.c=0
_.e=b
_.f=0
_.r=null
_.a=c},
l1(a,b,c,d){var s,r,q,p=c,o=new A.h7($.jt)
$.jt=o
try{if(d.$0())return!0
if(p){r=A.iS("Invalid "+a+" data")
throw A.f(r)}return!1}catch(q){s=A.ad(q)
r=s
if(!(r instanceof A.c5||r instanceof A.cw||r instanceof A.a_||t.b8.b(r)||t.k.b(r)))throw q
r=s instanceof A.dB
if(r)throw q
if(s instanceof A.cw){if(c){r=A.iS(s.a)
throw A.f(r)}return!1}if(s instanceof A.c5){if(p)throw q
return!1}if(p){r=A.iS("Invalid "+a+" data: "+A.v(s))
throw A.f(r)}return!1}finally{$.jt=o.a}},
h7:function h7(a){this.a=a},
iZ(a,b,c,d){var s,r,q,p,o=new A.dM(b)
if(d==null)d=0
A.aO(d,"offset")
if(d<0)d=0
else{s=a.length
if(d>s)d=s}r=a.length-d
if(c==null)c=r
if(c<0||c>r)c=r
q=t.p.b(a)?a:new Uint8Array(A.T(a))
p=J.c4(B.d.gab(q),q.byteOffset+d,c)
o.b=p
o.d=p.length
return o},
dM:function dM(a){var _=this
_.b=null
_.c=0
_.d=$
_.a=a},
dN:function dN(){},
jc(a){var s=a==null?32768:a
return new A.bM(new Uint8Array(s),B.o)},
bM:function bM(a,b){this.b=0
this.c=a
this.a=b},
bs:function bs(){},
lF(){var s,r,q,p,o=new Uint32Array(256)
for(s=0;s<256;++s){for(r=s,q=0;q<8;++q){p=r>>>1
r=(r&1)!==0?(3988292384^p)>>>0:p}o[s]=r}return o},
iV(a,b,c){var s,r,q,p=b+c,o=$.eM()
for(s=a.length,r=b,q=4294967295;r<p;++r){if(!(r<s))return A.a(a,r)
q=o[(q^a[r])&255]^q>>>8}return(q^4294967295)&2147483647},
ev:function ev(a,b,c){this.a=a
this.b=b
this.c=c},
eP:function eP(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=4194304
_.r=b
_.w=c
_.x=0
_.y=d
_.z=e
_.Q=0
_.at=_.as=null
_.ax=f
_.ay=g
_.ch=h
_.CW=i
_.cy=_.cx=0},
eT:function eT(a,b,c){this.a=a
this.b=b
this.c=c},
eS:function eS(a,b){this.a=a
this.b=b},
eQ:function eQ(a){this.a=a},
eR:function eR(a){this.a=a},
b3(a,b){var s,r,q,p,o=a.length
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
m0(b0,b1,b2,b3,b4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9
if(b1<0||b1>b0.length)throw A.f(A.al(b1,0,b0.length,"srcLength",null))
if(b1===0)return 0
s=b4>=0?b4:b2.length
r=0
q=0
if(b1>=13){B.e.T(b3,0,16384,-1)
p=b1-12
o=b1-5
n=A.b3(b0,0)*2654435761>>>0>>>18
b3.$flags&2&&A.h(b3)
if(!(n<16384))return A.a(b3,n)
b3[n]=0
m=A.b3(b0,1)*2654435761>>>0>>>18
A:for(n=b0.length,l=b2.$flags|0,k=1;;){j=k
i=1
h=64
do{g=j+i
i=h>>>6;++h
if(g>p)break A
f=A.b3(b0,g)*2654435761>>>0>>>18
if(!(m>=0&&m<16384))return A.a(b3,m)
e=b3[m]
b3[m]=j
if(e<0||j-e>65535||A.b3(b0,e)!==A.b3(b0,j)){j=g
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
if(a+B.a.I(b,255)+1+b+2>s)return-1
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
if(a+(B.a.I(a1,255)+1)>=s)return-1
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
c=A.b3(b0,d)*2654435761>>>0>>>18
if(!(c<16384))return A.a(b3,c)
b3[c]=d
a8=A.b3(b0,a6)*2654435761>>>0>>>18
if(!(a8<16384))return A.a(b3,a8)
e=b3[a8]
b3[a8]=a6
if(e<0||a6-e>65535||A.b3(b0,e)!==A.b3(b0,a6)){k=a6+1
m=A.b3(b0,k)*2654435761>>>0>>>18
q=a6
r=a
break}k=a6
q=k
r=a}}}a9=b1-q
n=a9>=15
l=r+(1+(n?B.a.I(a9-15,255)+1:0)+a9)
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
m1(a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3
if(a6<0||a5+a6>a4.length||a8<0||a8>a7.length)throw A.f(A.k3("Invalid LZ4 slice bounds"))
if(a6===0){if(a8!==0)throw A.f(B.Y)
return 0}s=a5+a6
for(r=a7.length,q=a7.$flags|0,p=a4.length,o=a5,n=0;o<s;){m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
l=a4[o]
k=l>>>4
if(k===15)for(o=m;;o=m){if(o>=s)throw A.f(B.Z)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
k+=j
if(j!==255){o=m
break}}else o=m
m=o+k
if(m>s||n+k>a8)throw A.f(B.X)
if(k>0){i=n+k
B.d.M(a7,n,i,a4,o)
n=i
o=m}if(o>=s)break
m=o+2
if(m>s)throw A.f(B.T)
if(!(o>=0&&o<p))return A.a(a4,o)
h=a4[o]
g=o+1
if(!(g<p))return A.a(a4,g)
f=(h|a4[g]<<8)>>>0
if(f<=0||f>n)throw A.f(B.V)
h=l&15
e=h+4
if(h===15)for(o=m;;o=m){if(o>=s)throw A.f(B.a_)
m=o+1
if(!(o>=0&&o<p))return A.a(a4,o)
j=a4[o]
e+=j
if(j!==255){o=m
break}}else o=m
i=n+e
if(i>a8)throw A.f(B.a1)
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
if(c===0&&b===0&&a===0&&a0===0){B.d.T(a7,n,i,0)
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
B.d.T(a7,n,i,a7[d])
n=i}else for(;n<i;d=a3,n=a2){a2=n+1
a3=d+1
if(!(d>=0&&d<r))return A.a(a7,d)
h=a7[d]
q&2&&A.h(a7)
if(!(n>=0&&n<r))return A.a(a7,n)
a7[n]=h}}if(n!==a8)throw A.f(A.dJ("LZ4 decoded "+n+" bytes, expected "+a8,null,null))
return n},
fb:function fb(a,b){this.a=a
this.b=b
this.c=0},
mq(c4,c5,c6,c7,c8,c9,d0,d1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1=null,c2=d1*c7,c3=c5.length
if(d1<=0||c7<=0||c2>65536||c3<2||c3>4||d0.length<c2*4)return c1
s=B.a.I(d1+16-1,16)
r=s*B.a.I(c7+16-1,16)
q=c3*r
p=new Uint16Array(q)
o=new Uint8Array(4)
B.d.T(o,0,4,255)
n=new Int32Array(4)
m=c2*4
if((d0.byteOffset&3)===0)l=A.jj(d0,0,m)
else{k=new Uint8Array(m)
B.d.H(k,0,m,d0)
l=A.jj(k,0,m)}j=A.i([],t.a1)
i=A.ab(t.h6,t.L)
h=128+p.byteLength
for(m=l.length,g=0,f=0;f<c3;++f){if(!(f<c5.length))return A.a(c5,f)
e=c5[f]
d=e-c4
c=!0
if(d>=0)if(d<4){if(!(d>=0&&d<4))return A.a(o,d)
c=o[d]!==255||!c9.$2(e,d0)}if(c)return c1
if(!(d>=0&&d<4))return A.a(o,d)
o[d]=f
c=c6.$1(e)
B.e.t(n,f,c==null?0:c)
for(c=f>0,b=f*r,a=(f-1)*r,a0=0;a0<r;++a0){a1=B.a.N(a0,s)*16
a2=B.a.a2(a0,s)*16
a3=Math.min(16,d1-a1)
a4=Math.min(16,c7-a2)
for(a5=2166136261,a6=0;a6<a4;++a6){a7=(a2+a6)*d1+a1
for(a8=0;a8<a3;++a8){a9=a7+a8
if(!(a9>=0&&a9<m))return A.a(l,a9)
a5=((a5^l[a9])>>>0)*16777619>>>0}}b0=i.e0(new A.ay(a3,a4,a5),new A.fF())
a9=J.b0(b0)
b2=a9.gD(b0)
for(;;){if(!b2.u()){b1=-1
break}b1=b2.gA()
if(b1>>>0!==b1||b1>=j.length)return A.a(j,b1)
b3=j[b1]
b4=b3.length
b5=!0
a6=0
for(;;){if(!(a6<a4&&b5))break
a7=(a2+a6)*d1+a1
for(b6=a6*a3,a8=0;a8<a3;++a8){b7=b6+a8
if(!(b7>=0&&b7<b4))return A.a(b3,b7)
b7=b3[b7]
b8=a7+a8
if(!(b8>=0&&b8<m))return A.a(l,b8)
if(b7!==l[b8]){b5=!1
break}}++a6}if(b5)break}if(b1<0){b2=a3*a4
h+=b2*4+48
if(h>c8)return c1
b3=new Uint32Array(b2)
for(a6=0;a6<a4;a6=b9){b9=a6+1
B.f.M(b3,a6*a3,b9*a3,l,(a2+a6)*d1+a1)}b1=j.length
a9.m(b0,b1)
B.b.m(j,b3)}a9=b+a0
if(!(a9>=0&&a9<q))return A.a(p,a9)
p[a9]=b1
if(c){a9=a+a0
if(!(a9>=0&&a9<q))return A.a(p,a9)
a9=p[a9]!==b1}else a9=!1
if(a9)++g}}if(g*3>(c3-1)*r)return c1
q=A.i([],t.gN)
for(m=j.length,c0=0;c0<j.length;j.length===m||(0,A.V)(j),++c0)q.push(J.lA(B.f.gab(j[c0])))
return new A.ea(d1,c7,c4,o,p,q,new A.d(),h,n)},
fE:function fE(){this.a=null
this.b=-1},
ea:function ea(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.z=_.y=$},
fF:function fF(){},
a9:function a9(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
iy(a){var s=0,r=A.kP(t.H),q,p,o,n,m
var $async$iy=A.kW(function(b,c){if(b===1)return A.kA(c,r)
for(;;)switch(s){case 0:n=A
m=A
s=2
return A.ib(A.jH(A.u(v.G.WebAssembly.instantiate(a)),t.m),$async$iy)
case 2:o=n.u(m.u(c.instance).exports)
for(q=0;q<13;++q){p=B.ae[q]
if(!(typeof o[p]==="function"))throw A.f(A.aD("Missing FastLottie Wasm function: "+p))}o._initialize()
if(t.a.a(A.u(o.memory).buffer).byteLength===0)throw A.f(A.aD("FastLottie Wasm memory is empty"))
$.l=o
return A.kB(null,r)}})
return A.kC($async$iy,r)},
aI(a){var s,r,q=$.l
q.toString
s=a===0?1:a
r=A.j(q.malloc(s))
if(r<=0)throw A.f(A.aD("Could not allocate "+a+" Wasm bytes"))
B.d.T(A.jb(t.a.a(A.u($.l.memory).buffer),r,a),0,a,0)
return r},
fh(a){var s=new A.aX(!0,a,null,null)
if($.l!=null)s.c=A.aI(a*4)
else s.d=new Uint32Array(a)
return s},
l5(a,b){var s=a.c
if(s!=null)$.l.fastlottie_clear_pixels(s,b)
else B.f.T(a.gv(),0,b,0)},
op(a,b,c,d,e,f,g){var s,r,q=a.c
if(q!=null&&e.b!=null){s=$.l
s.toString
r=e.b
r.toString
A.dx(s,"fastlottie_fill_solid_spans",[q,b,c,d,r,f,g],t.H)
return!0}return!1},
oi(a,b,c,d,e,f,g){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dx(s,"fastlottie_blend_rect",[q,b,c,p,e,f,g],t.H)
return!0}catch(r){return!1}},
oj(a,b,c,d,e,f,g,h){var s,r,q=a.c,p=e.b
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dx(s,"fastlottie_blend_solid",[q,b,c,d,p,f,g,h],t.H)
return!0}catch(r){return!1}},
ol(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0){var s,r,q=a.c,p=d.c
if(q==null||p==null)return!1
try{s=$.l
s.toString
A.dx(s,"fastlottie_inner_shadow",[q,b,c,p,e,f,g,h,i,j,k,l,m,n,o,a0],t.H)
return!0}catch(r){return!1}},
ok(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,a0,a1,a2,a3,a4){var s,r,q,p=a.c
if(p==null||e.b==null||g.c==null)return!1
s=$.l
s.toString
r=e.b
r.toString
q=g.c
q.toString
A.dx(s,"fastlottie_gradient_spans",[p,b,c,d,r,f,q,h,i,j?1:0,k,l,m,n,o,a0,a1,a2,a3,a4],t.H)
return!0},
m4(){var s,r,q=$.l
if(q==null)return null
try{s=A.j(q.fl_dense_new())
if(!J.m(s,0)){q=A.aI(16)
return new A.fe(s,q)}}catch(r){}return null},
m3(){var s,r=$.ff
if(r!=null){$.cJ=$.cJ+1
return r}s=A.m4()
if(s==null)return null
$.ff=s
$.cJ=1
return s},
b4:function b4(a){this.a=a
this.c=this.b=null},
aX:function aX(a,b,c,d){var _=this
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
bB(a,b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6){var s,r,q,p,o,n,m,l,k,j,i,h,g
while(a instanceof A.R)a=a.a
if(a instanceof A.a5){s=a.c
if(!s.gaD()){r=a4.cZ(a6)
A.eE(s,b,c,d,e,f,a0,a1,r)
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
A.bB(s[k],b,q,p,o,n,m,l,a2,a3,a4,a5,j)}return}if(a instanceof A.bh){i=A.nd(a.a,a.b,b,A.kO(c,d,e,f,a2),a4,a5,a6)
if(i!=null&&i.r>0)a3.aF(i,c,d,e,f,a0,a1)
return}if(a instanceof A.aQ){if(a.b===3&&a.a.length>=2){for(s=a.a,k=0;k<s.length-1;++k)A.bB(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
h=a4.ex(a6)
A.bB(B.b.gad(s),b,c,d,e,f,a0,a1,a2,h,a4,a5,a6+1)
a3.fC(h)
return}for(s=a.a,k=0;k<s.length;++k)A.bB(s[k],b,c,d,e,f,a0,a1,a2,a3,a4,a5,a6)
return}if(a.ga5()){a3.aF(a4.di(a,b),c,d,e,f,a0,a1)
return}if(c===1&&d===0&&e===0&&f===1&&a0===0&&a1===0)A.ij(a,b,a2,a3)
else{g=a4.fx
g.l(0)
A.ij(a,b,A.kO(c,d,e,f,a2),g)
a3.aF(g,c,d,e,f,a0,a1)}},
kO(a,b,c,d,e){var s=Math.max(a*a+b*b,c*c+d*d)
return s<=1e-12?e:e/s},
kx(a,b,c,d){var s,r,q,p,o
if(d==null){a.q(b,c)
return}s=d.a
r=s[0]
q=s[1]
p=s[2]
o=s[3]
a.q(r*b+p*c+s[4],q*b+o*c+s[5])},
kI(b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9=b3.e,b0=a9.n(b4),b1=b0.length,b2=b1/6|0
if(b2===0)return
s=b3.f
r=b3.r
if(r.length!==0){q=a9.b.a
if(b4<=B.i.ga6(q)){p=B.b.ga6(r).a
s=p}else if(b4>=B.i.gad(q)){p=B.b.gad(r).a
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
A.kx(b6,a9,b0[1],b7)
l=b0[0]
k=b0[1]
j=p?b2:b2-1
for(a9=b7!=null,i=1;i<=j;++i,k=a,l=b){h=(i-1)*6
g=B.a.N(i,b2)*6
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
if(Math.abs(f)<=0.0001&&Math.abs(e)<=0.0001&&Math.abs(d)<=0.0001&&Math.abs(c)<=0.0001)A.kx(b6,b,a,b7)
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
if(a3 instanceof A.aw){A.kI(a3,a4,a5,a6,null)
return}if(a3 instanceof A.aZ){a6.a4(!0)
s=a6.gfB()
a3.f_(a4,s,s,new A.ik(a6,a5),a6.gfV())
return}if(a3 instanceof A.aS){r=a3.r.n(a4)
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
c=B.c.B(s[0],0,Math.min(Math.abs(n),Math.abs(m)))
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
nd(a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a1.a,a0=a.length
if(a2>=a0)return null
s=a1.b.n(a3)
if(0>=s.length)return A.a(s,0)
r=B.c.B(s[0],0,100)/100
s=a1.c.n(a3)
if(0>=s.length)return A.a(s,0)
q=B.c.B(s[0],0,100)/100
p=Math.abs(q-r)
if(p<0.000001)return null
if(!(a2<a.length))return A.a(a,a2)
o=a[a2]
n=a5.eA(a6)
s=a6+1
A.bB(o,a3,1,0,0,1,0,0,a4,n,a5,s,a7)
if(p>=0.999999)return n
m=Math.min(r,q)
l=a1.d.n(a3)
if(0>=l.length)return A.a(l,0)
k=B.c.N(m+l[0]/360,1)
j=k+p
i=a5.ey(a6,a0)
for(m=i.$flags|0,h=0,g=0,f=0;f<a0;++f){if(!(f<a.length))return A.a(a,f)
l=a[f]
e=A.nB(l,a3,a4,a5,f===a2?n:null,s,a7)
m&2&&A.h(i)
if(!(f<i.length))return A.a(i,f)
i[f]=e
if(f<a2)g+=e
h+=e}a=a1.e
if(a)d=h
else{if(!(a2<i.length))return A.a(i,a2)
d=i[a2]}c=a?g:0
b=a5.ez(a6)
a=a5.ok
A.kG(n,k*d-c,Math.min(j,1)*d-c,b,a)
if(j>1)A.kG(n,-c,(j-1)*d-c,b,a)
return b},
nB(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j,i,h
if(a.ga5()){s=d.xr.h(0,a)
if(s!=null)return s.b}r=A.ei()
if(e!=null)r.sdR(e)
else{r.sdR(d.ew(f))
A.bB(a,b,1,0,0,1,0,0,c,r.ao(),d,f,g)}q=0
p=0
for(;;){o=r.b
if(o===r)A.x(A.ak(""))
if(!(p<o.r))break
A:{n=o.c
if(!(p<n.length))return A.a(n,p)
m=n[p]
o=o.d
if(!(p<o.length))return A.a(o,p)
l=o[p]
if(l-m<2)break A
for(k=m+1;k<l;++k){o=r.b
if(o===r)A.x(A.ak(""))
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
if(o===r)A.x(A.ak(""))
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
q+=Math.sqrt(n*n+o*o)}}++p}if(a.ga5()){o=d.xr
if(o.a>=256)o.l(0)
n=d.ay
n.toString
o.t(0,a,new A.aa(n,q,t.e))}return q},
kG(a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2
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
g=p+B.a.N(h,n)
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
a6.q(q,f[a2])}a6.a1()}else A.kF(a3,p,n,m,k,l,a0,a1,a6)
s+=a
if(s>=a5)break}},
kF(a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a5-1
for(s=a4.length,r=0;r<a;){q=B.a.L(r+a,1)
p=q+1
if(!(p<s))return A.a(a4,p)
if(a4[p]<=a6)r=p
else a=q}a8.a4(!1)
o=a1+r
p=r+1
n=a1+B.a.N(p,a2)
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
c=a1+B.a.N(f,a2)
if(a7<=e+1e-9){if(!(g<s))return A.a(a4,g)
p=a4[g]
b=e-p
s=b<=1e-12?0:B.c.B((a7-p)/b,0,1)
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
mZ(b1,b2,b3,b4,b5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8=b2.a,a9=a8.length,b0=b2.c
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
f=b5.aH(g+1)
f.$flags&2&&A.h(f)
q=f.length
if(0>=q)return A.a(f,0)
f[0]=0
for(e=0;e<g;e=c){d=j+e
c=e+1
b=j+B.a.N(c,i)
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
if((a5&1)===0&&a7>a6+1e-7)A.kF(b1,j,i,h,f,g,a6,a7,b4)
a5=(a5+1)%a9
if(!(a5<a8))return A.a(b0,a5)
a4=b0[a5]}}},
kE(e4,e5,e6,e7,e8,e9,f0,f1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3
if(e5<=0)return
if(f1.a&&f1.fZ(e4,e5,e6,e7,e8,e9,f0))return
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
b4=o.aH(b3)
b5=n.aH(b3)
for(j=b4.$flags|0,c=b5.$flags|0,b6=0;b6<b3;b6=b7){b7=b6+1
b8=B.a.N(b7,a5)
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
for(c3=0;c3<a5;++c3){c4=B.a.N(c3-1+b3,b3)
if(!(c3<a0))return A.a(e,c3)
j=e[c3]
if(!(c3<a1))return A.a(d,c3)
c2.$5(c4,c3,j,d[c3],!1)}f0.a1()
f0.a4(!0)
for(c3=a5-1;c3>=0;c3=c5){c5=c3-1
c6=B.a.N(c5+b3,b3)
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
kR(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k=d,j=d*e,i=k
if(typeof i!=="number")return i.a8()
p=i*e
i=k
if(typeof i!=="number")return i.ec()
if(i<d||p>c.gv().length)throw A.f(A.aB("Raster output is too small",null))
i=f.b
if(i)A.l5(c,p)
else B.f.T(c.gv(),0,p,0)
o=!0
if(d>0)if(e>0){n=a.b
n===$&&A.D()
if(!(n<=0)){o=a.c
o===$&&A.D()
o=o<=0}}if(o)return
o=a.b
o===$&&A.D()
s=d/o
o=a.c
o===$&&A.D()
r=e/o
q=f.ay
f.ay=a
try{A.jw(a,b,255,c,0,0,k,0,0,d,e,s,0,0,r,0,0,null,f,0,!0,i)
m=Math.max(A.j(j),f.to)
f.to=0
l=m<=65536&&!f.as
f.as=!1
if(l){if(++f.x1>=16){f.x1=0
f.hs()}}else f.x1=0}finally{f.sfk(q)}},
jw(f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2=null
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
if(B.c.F(B.a.B(B.c.Y(f5*B.c.F(d[0])/100),0,255)*e.aR(f4)/255)===0)continue
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
a3=B.c.F(B.a.B(B.c.Y(a0*B.c.F(a3[0])/100),0,255)*c.aR(f4)/255)>0
a2=a3}}if(a1&&!a2&&!a)continue
if(!a2){if(b===0)A.bY(e,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,0,!0,!1,!1,!1,!0)
else{a4=e.aw(f4)
if(a4!=null){d=j?a4.a:a4.c
a1=k?a4.b:a4.d
a5=B.c.P(g4*d+g6*a1+g8)-1
d=l?a4.a:a4.c
a1=m?a4.b:a4.d
a6=B.c.P(g5*d+g7*a1+g9)-1
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
b1=d==null?f2:d.gcz()}else b1=f2
d=!1
if(b1!=null){a1=b1.y
if(a1!=null){if(g)if($.l!=null){a3=!0
if(b!==6)if(b!==7)if(b!==9)a3=b>=12&&b<=15
if(!a3){d=!1
if(a1.w){a1=a1.f
if(a1!=null)if(a1.a!=null){d=a1.n(0)
if(0>=d.length)return A.a(d,0)
d=d[0]!==0}else d=!0}d=!d}}}else d=!0}if(d){A.bY(e,f4,f5,f6,f7,f8,f9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,b,!0,!1,!1,!1,!0)
continue}d=a9*b0
b2=h1.aJ(f,d)
if(h){a1=b2.c
if(a1!=null)$.l.fastlottie_clear_pixels(a1,d)
else{a1=b2.d
a1.toString
B.f.T(a1,0,d,0)}}else{a1=b2.c
if(a1!=null){a3=i.a(A.u($.l.memory).buffer)
b3=b2.b
a1=new Uint32Array(a3,a1,b3)}else{a1=b2.d
a1.toString}B.f.T(a1,0,d,0)}A.bY(e,f4,f5,b2,a5,a6,a9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,h0,h1,n,h3,h,0,!0,!0,!1,!1,!0)
if(g){d=!0
if(b!==6)if(b!==7)if(b!==9)d=b>=12&&b<=15
b4=!d&&A.oi(s,(a6-f8)*f9+a5-f7,f9,b2,a9,b0,b)}else b4=!1
if(!b4){d=f6.c
if(d!=null){a1=i.a(A.u($.l.memory).buffer)
b3=f6.b
d=new Uint32Array(a1,d,b3)}else{d=f6.d
d.toString}a1=b2.c
if(a1!=null){a3=i.a(A.u($.l.memory).buffer)
b3=b2.b
a1=new Uint32Array(a3,a1,b3)}else{a1=b2.d
a1.toString}A.mn(d,a5-f7,a6-f8,f9,a1,0,0,a9,a9,b0,b)}}}}continue}b5=d===3||d===4
b6=e.aw(f4)
if(b6==null)continue
d=j?b6.a:b6.c
a1=k?b6.b:b6.d
b7=B.c.P(g4*d+g6*a1+g8)-1
d=l?b6.a:b6.c
a1=m?b6.b:b6.d
b8=B.c.P(g5*d+g7*a1+g9)-1
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
c1=c.aw(f4)
if(c1!=null){d=j?c1.a:c1.c
a1=k?c1.b:c1.d
c2=Math.max(b7,B.c.P(g4*d+g6*a1+g8)-1)
d=l?c1.a:c1.c
a1=m?c1.b:c1.d
c3=Math.max(b8,B.c.P(g5*d+g7*a1+g9)-1)
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
if(a&&!c6&&b===0){A.bY(e,f4,f5,f6,f7,f8,f9,b7,b8,b9,c0,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,0,!0,!1,!1,!1,!0)
continue}a5=a?b7:c2
a6=a?b8:c3
a7=a?b9:c4
a8=a?c0:c5
a9=a7-a5
b0=a8-a6
c7=a9*b0
b2=h1.aJ(p,c7)
d=b2.c
if(d!=null){a1=i.a(A.u($.l.memory).buffer)
b3=b2.b
d=new Uint32Array(a1,d,b3)}else{d=b2.d
d.toString}B.f.T(d,0,c7,0)
A.bY(e,f4,f5,b2,a5,a6,a9,a5,a6,a7,a8,g4,g5,g6,g7,g8,g9,f2,h1,n,h3,e.as!=null&&h,0,!0,!0,!1,!1,!0)
c8=h1.aJ(o,c7)
d=c8.c
if(d!=null){a1=i.a(A.u($.l.memory).buffer)
b3=c8.b
d=new Uint32Array(a1,d,b3)}else{d=c8.d
d.toString}B.f.T(d,0,c7,0)
if(c6){d=c.as!=null&&h
A.bY(c,f4,a0,c8,a5,a6,a9,c2,c3,c4,c5,g4,g5,g6,g7,g8,g9,f2,h1,n,h3,d,0,!0,!0,!b5,!1,!0)}d=b===0
if(d)if(h4)if(h1.bv==null){a1=$.jL()
a3=a1.length
c9=new A.aX(!0,a3,f2,f2)
if($.l!=null){d0=c9.c=A.aI(a3*4)
d1=f2}else{d0=c9.d=new Uint32Array(a3)
d1=d0
d0=f2}if(d0!=null){d1=i.a(A.u($.l.memory).buffer)
a3=new Uint32Array(d1,d0,a3)}else{d1.toString
a3=d1}B.f.ef(a3,0,a1)
h1.bv=c9}a1=b2.c
if(a1!=null){a3=i.a(A.u($.l.memory).buffer)
b3=b2.b
d2=new Uint32Array(a3,a1,b3)}else{a1=b2.d
a1.toString
d2=a1}a1=c8.c
if(a1!=null){a3=i.a(A.u($.l.memory).buffer)
b3=c8.b
d3=new Uint32Array(a3,a1,b3)}else{a1=c8.d
a1.toString
d3=a1}a1=f6.c
if(a1!=null){a3=i.a(A.u($.l.memory).buffer)
b3=f6.b
d4=new Uint32Array(a3,a1,b3)}else{a1=f6.d
a1.toString
d4=a1}for(a1=d4.length,a3=!b5,c9=d3.length,d0=d2.length,d1=a5-f7,d5=d4.$flags|0,d6=0;d6<b0;++d6){d7=d6*a9
d8=(a6+d6-f8)*f9+d1
for(d9=0;d9<a9;++d9){e0=d7+d9
if(!(e0>=0&&e0<d0))return A.a(d2,e0)
e1=d2[e0]
if(e1===0)continue
if(!(e0<c9))return A.a(d3,e0)
e2=d3[e0]
e3=e2>>>24
if(a3)e4=a?255-e3:e3
else if(e3===0)e4=a?255:0
else{e5=e2>>>16&255
e6=e2>>>8&255
e7=e2&255
if(e3!==255){e0=$.jL()
if(!(e3<e0.length))return A.a(e0,e3)
e8=e0[e3]
e5=e5*e8>>>16
e6=e6*e8>>>16
e7=e7*e8>>>16}e9=B.a.B(19595*e5+38470*e6+7471*e7>>>16,0,255)
e4=a?255-e9:e9}if(e4===0)continue
f0=e4===255?e1:A.aE(e1,e4)
f1=d8+d9
if(d){if(!(f1>=0&&f1<a1))return A.a(d4,f1)
e0=A.ac(f0,d4[f1])}else{if(!(f1>=0&&f1<a1))return A.a(d4,f1)
e0=A.e8(f0,d4[f1],b)}d5&2&&A.h(d4)
if(!(f1>=0&&f1<a1))return A.a(d4,f1)
d4[f1]=e0}}}},
eI(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eG(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eJ(a,b,c,d){var s=b>=0?a.a:a.c,r=c>=0?a.b:a.d
return b*s+c*r+d},
eH(a,b,c,d){var s=b>=0?a.c:a.a,r=c>=0?a.d:a.b
return b*s+c*r+d},
eE(a,b,c,d,e,f,g,h,i){var s,r,q,p,o,n,m,l,k
if(a.gaD()){i.$flags&2&&A.h(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g
i[5]=h
return}if(a.gcl()){a.cV(b)
s=a.z
r=a.Q
i.$flags&2&&A.h(i)
i[0]=c
i[1]=d
i[2]=e
i[3]=f
i[4]=g+c*s+e*r
i[5]=h+d*s+f*r
return}q=a.dY(b)
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
bY(i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,k0,k1,k2,k3,k4,k5,k6,k7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9=null
if(!i0.e7(i1))return
s=k1?i3:h9
r=k6?255:i0.hb(i1,i2)
q=k3?i0.aR(i1):255
if(r===0||q===0)return
if(!k6)p=k5&&r===255&&q===255
else p=!0
o=p?h9:i0.as
if(o!=null){n=i0.aw(i1)
if(n==null)return
m=B.c.P(A.eI(n,j1,j3,j5))-1
l=B.c.P(A.eJ(n,j2,j4,j6))-1
k=B.c.V(A.eG(n,j1,j3,j5))+1
j=B.c.V(A.eH(n,j2,j4,j6))+1
i=Math.max(m,i7)
h=Math.max(l,i8)
g=Math.min(k,i9)
f=Math.min(j,j0)
if(i>=g||h>=f)return
p=o.a
e=o.b
d=B.c.F((j1*p+j3*e)*256)
c=B.c.F((j2*p+j4*e)*256)
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
a6=k4&&a2===i&&a3===h&&a4===g&&a5===f
a7=a4-a2
a8=a5-a3
a9=a6?i3:j8.aJ(j9*3+2,a7*a8)
b0=a6?i4:a2
b1=a6?i5:a3
b2=a6?i6:a7
if(!a6){p=a7*a8
if(j8.b)A.l5(a9,p)
else B.f.T(a9.gv(),0,p,0)}p=a6?j9:j9+1
A.bY(i0,i1,255,a9,b0,b1,b2,a2,a3,a4,a5,j1,j2,j3,j4,j5,j6,j7,j8,p,k0,a6?k1:j8.b,0,!1,!1,!1,!0,!0)
b3=A.av(r*q)
if(!k5)b4=d===0&&c===0
else b4=!0
p=!1
if(!b4)if(k2===0)if(s!=null)if(b2===a7)if(b0===a2)if(b1===a3)p=(!a6||b3===255)&&A.ol(s,(h-i5)*i6+i-i4,i6,a9,a7,a8,i-a2,h-a3,g-i,f-h,b,a,a0,a1,(255-o.aO(16)<<16|255-o.aO(8)<<8|255-o.aO(0))>>>0,b3)
if(p)return
A.n8(o,b3,k2,a9.gv(),b0,b1,b2,new A.b_([a2,a3,a4,a5]),i3.gv(),i4,i5,i6,new A.b_([i,h,g,f]),b,a,a0,a1,a6,b4)
return}b5=k7?i0.at:h9
b6=b5==null?h9:b5.fD(i1)
b7=k5&&b6!=null&&b6>>>24===255?h9:b6
if(q!==255||b7!=null){p=b7==null
b3=p?q:A.av((b7>>>24)*q)
if(b3===0)return
n=i0.aw(i1)
if(n==null)return
i=Math.max(i7,B.c.P(A.eI(n,j1,j3,j5))-1)
h=Math.max(i8,B.c.P(A.eJ(n,j2,j4,j6))-1)
g=Math.min(i9,B.c.V(A.eG(n,j1,j3,j5))+1)
f=Math.min(j0,B.c.V(A.eH(n,j2,j4,j6))+1)
a7=g-i
a8=f-h
if(a7<=0||a8<=0)return
e=a7*a8
a9=j8.aJ(j9*3+2,e)
B.f.T(a9.gv(),0,e,0)
A.bY(i0,i1,i2,a9,i,h,a7,i,h,g,f,j1,j2,j3,j4,j5,j6,j7,j8,j9+1,k0,j8.b,0,!1,!1,k5,!1,!1)
b8=a9.gv()
b9=i3.gv()
c0=(h-i5)*i6+i-i4
for(e=b9.length,c1=k2===0,c2=b8.length,c3=b9.$flags|0,c4=0;c4<a8;++c4,c0+=i6)for(c5=c4*a7,c6=0;c6<a7;++c6){c7=c5+c6
if(!(c7>=0&&c7<c2))return A.a(b8,c7)
c8=b8[c7]
if(c8===0)continue
if(p)c9=A.aE(c8,b3)
else{d0=(c8>>>24)*b3+128
c9=A.aE((b7&16777215|4278190080)>>>0,B.a.L(d0+B.a.L(d0,8),8))}d1=c0+c6
if(c1){if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.ac(c9,b9[d1])}else{if(!(d1>=0&&d1<e))return A.a(b9,d1)
c7=A.e8(c9,b9[d1],k2)}c3&2&&A.h(b9)
if(!(d1>=0&&d1<e))return A.a(b9,d1)
b9[d1]=c7}return}if(i0.gdU()){for(c8=i0,d2=0;c8!=null;c8=c8.cy)++d2
if(d2===1){d3=j8.c3(j9)
A.eE(i0.a,i1,j1,j2,j3,j4,j5,j6,d3)
d4=d3[0]
d5=d3[1]
d6=d3[2]
d7=d3[3]
d8=d3[4]
d9=d3[5]}else{e0=j8.k3
while(e0.length<d2)B.b.m(e0,h9)
e1=d2-1
for(c8=i0;c8!=null;c8=c8.cy,e1=e2){e2=e1-1
B.b.t(e0,e1,c8)}d3=j8.c3(j9)
for(d9=j6,d8=j5,d7=j4,d6=j3,d5=j2,d4=j1,d1=0;d1<d2;++d1){if(!(d1<e0.length))return A.a(e0,d1)
A.eE(e0[d1].a,i1,d4,d5,d6,d7,d8,d9,d3)
B.b.t(e0,d1,h9)
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
d4=j1}e3=k0&&i0.gdW()
e4=i0.z
if(e4!=null&&i0.gh2()){e5=e3&&i0.gh5()?new A.cl([d4,d5,d6,d7,d8,d9,i7,i8,i9,j0]):h9
p=e5==null
e6=p?h9:j8.de(i0,e5)
if(e6==null){e7=j8.cH(j9)
e7.l(0)
A.nH(e4,i1,d4,d5,d6,d7,d8,d9,i7,i8,i9,j0,e7,j8,j9)
if(!p)j8.c_(i0,e5,e7)}else if(j7==null&&e6.b!==0){e7=j8.cH(j9)
e7.dO(e6)}else e7=e6
if(e7.b===0)return
if(j7!=null){e8=j8.es(j9)
A.fs(e7,j7,e8)
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
if(f4!=null)A.kQ(f4,i1,r,i3,i4,i5,i6,f0,f1,f2,f3,d4,d5,d6,d7,d8,d9,e9,j8,j9+1,e3,k1,k2)
f5=i0.f
if(f5!=null){p=i0.x
if(p!=null){p=p.n(i1)
if(0>=p.length)return A.a(p,0)
p=p[0]
e=f5.f
e===$&&A.D()
c1=f5.d
c1===$&&A.D()
f6=p*e-c1}else f6=(i1-i0.r)/i0.w
p=f5.b
p===$&&A.D()
e=f5.c
e===$&&A.D()
if(Math.abs(d5)<1e-9&&Math.abs(d6)<1e-9){c1=d4>=0
i=B.c.P(d8+(c1?0:d4*p))
g=B.c.V(d8+(c1?d4*p:0))
p=d7>=0
h=B.c.P(d9+(p?0:d7*e))
f=B.c.V(d9+(p?d7*e:0))
f7=Math.max(f0,i)
f8=Math.max(f1,h)
f9=Math.min(f2,g)
g0=Math.min(f3,f)
if(f7<f9&&f8<g0)A.jw(f5,f6,r,i3,i4,i5,i6,f7,f8,f9,g0,d4,d5,d6,d7,d8,d9,e9,j8,j9+1,e3,k1)}else{c1=0+p
c2=0+e
g1=Math.max(f0,B.c.P(A.eI(new A.a9(0,0,c1,c2),d4,d6,d8))-1)
g2=Math.max(f1,B.c.P(A.eJ(new A.a9(0,0,c1,c2),d5,d7,d9))-1)
g3=Math.min(f2,B.c.V(A.eG(new A.a9(0,0,c1,c2),d4,d6,d8))+1)
g4=Math.min(f3,B.c.V(A.eH(new A.a9(0,0,c1,c2),d5,d7,d9))+1)
if(g1<g3&&g2<g4){g5=g3-g1
c1=g5*(g4-g2)
g6=j8.aJ(j9*3+2,c1)
B.f.T(g6.gv(),0,c1,0)
A.jw(f5,f6,r,g6,g1,g2,g5,g1,g2,g3,g4,d4,d5,d6,d7,d8,d9,h9,j8,j9+1,e3,!1)
c1=j8.db
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
j8.aL(c1,!1,j8.gbN(),g1,g2,g3,g4)
g7=j8.gbN()
if(e9!=null){A.fs(j8.gbN(),e9,j8.gbm())
g7=j8.gbm()}g8=g7.b*2
g9=g7.a.gv()
h0=g6.gv()
b9=i3.gv()
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
c2&2&&A.h(b9)
b9[c5]=c7}}}}}}},
n8(c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9=d1.a,c0=b9[0],c1=b9[1],c2=b9[2],c3=b9[3]
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
if(b4!==0){a4=A.av(o*b4)
if(typeof a4!=="number")return A.a3(a4)
a4=A.av((a5>>>16&255)*(255-a4))
if(typeof a4!=="number")return a4.a9()
b5=A.av(n*b4)
if(typeof b5!=="number")return A.a3(b5)
b5=A.av((a5>>>8&255)*(255-b5))
if(typeof b5!=="number")return b5.a9()
b6=A.av(m*b4)
if(typeof b6!=="number")return A.a3(b6)
b6=A.av((a5&255)*(255-b6))
if(typeof b6!=="number")return A.a3(b6)
a5=(a5&4278190080|a4<<16|b5<<8|b6)>>>0}}b7=a0+a3
if(e1){d2.$flags&2&&A.h(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a5}else{if(k)a5=A.aE(a5,c5)
if(l){if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.ac(a5,d2[b7])}else{if(!(b7>=0&&b7<b9))return A.a(d2,b7)
a4=A.e8(a5,d2[b7],c6)}d2.$flags&2&&A.h(d2)
if(!(b7>=0&&b7<b9))return A.a(d2,b7)
d2[b7]=a4}}}if(e1&&k)for(f=r;f<p;++f){b8=(f-d4)*d5-d3
for(a3=s;a3<q;++a3){l=b8+a3
if(!(l>=0&&l<b9))return A.a(d2,l)
k=A.aE(d2[l],c5)
d2.$flags&2&&A.h(d2)
d2[l]=k}}},
nH(a,b,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=b1.ev(b2),e=Math.max(Math.sqrt(a0*a0+a1*a1),Math.sqrt(a2*a2+a3*a3)),d=e<=0.000001?0.25:B.c.B(0.25/e,0.005,1.5),c=new A.io(b1.eu(b2),f,b,d*d,a0,a1,a2,a3,a4,a5,b1,a6,a7,a8,a9,d)
if(a.length===1&&B.b.gae(a).gc9())c.$2(B.b.gae(a),b0)
else{s=b1.an(0)
r=b1.an(1)
q=b1.an(2)
for(p=a.length,o=a8-a6,n=!1,m=0;m<a.length;a.length===p||(0,A.V)(a),++m){l=a[m]
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
i=B.a.B(B.c.F(j[0]*2.56),0,256)
if(i!==256)s.ee(i)
j=l.d
if(!j)h=!n&&k===3
else h=!0
if(h){if(q.b===0)for(g=a7;g<a9;++g)q.aN(g,a6,o,256)
if(j){s.aT(r)
A.cU(q,r,s,3)}}j=!n
if(j&&k!==3)b0.aT(s)
else if(j)A.cU(q,s,b0,k)
else{b0.aT(r)
A.cU(r,s,b0,k)}n=!0}}},
ne(a,b,c,d,e){var s,r,q,p
for(s=a.r,r=a.e,q=r.$flags|0,p=0;p<s;++p){q&2&&A.h(r)
if(!(p<r.length))return A.a(r,p)
r[p]=1}A.kE(a,Math.abs(b),2,2,4,c,d,e)},
kQ(a,b,c,d,e,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=a.c
if(f.gci())s=c
else{r=f.e.n(b)
if(0>=r.length)return A.a(r,0)
s=B.a.B(B.c.F(c*B.c.F(r[0])/100),0,255)}if(s===0)return
if(!f.gaD()){q=b3.c3(b4)
A.eE(f,b,a6,a7,a8,a9,b0,b1,q)
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
i=a.gb6()
for(h=i.length-1,r=b4+1;h>=0;--h){if(!(h<i.length))return A.a(i,h)
g=i[h]
if(g instanceof A.a5)A.kQ(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,r,j,b6,b7)
else if(g instanceof A.bg)A.nK(g,b,s,d,e,a0,a1,a2,a3,a4,a5,p,o,n,m,l,k,b2,b3,j,b6,b7)}},
nK(b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6=null,b7=b8.c.n(b9)
if(0>=b7.length)return A.a(b7,0)
s=B.a.B(B.c.F(c0*B.c.F(b7[0])/100),0,255)
if(s===0)return
r=!1
if(d7){q=b8.id
if(q===$){if(b8.gc4())if(!b8.e||b8.d.a!=null){b7=b8.z
b7=b7==null?b6:b7.gG()
b7=b7!==!1
r=b7}b8.id!==$&&A.P()
b8.id=r
q=r}b7=q}else b7=r
p=b7?new A.cl([c9,d0,d1,d2,d3,d4,c5,c6,c7,c8]):b6
b7=p==null
o=b7?b6:d6.de(b8,p)
if(o==null){n=!b8.e
if(n){q=b8.fx
if(q===$){r=B.b.ap(b8.a,A.jI())
b8.fx!==$&&A.P()
b8.fx=r
q=r}m=q}else m=!1
if(m){l=b8.b_(b9)
if(l==null)return
n=[Math.max(c5,B.c.P(A.eI(l,c9,d1,d3))-2),Math.max(c6,B.c.P(A.eJ(l,d0,d2,d4))-2),Math.min(c7,B.c.V(A.eG(l,c9,d1,d3))+2),Math.min(c8,B.c.V(A.eH(l,d0,d2,d4))+2)]
if(n[0]>=n[2]||n[1]>=n[3])return
o=d6.gaY()
m=b8.a
A.im(m,0,m.length,b9,new A.bz([c9,d0,d1,d2,d3,d4]),new A.b_(n),b8.f,o,d6,0)}else{l=A.nG(b8,b9,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d6)
if(l==null)return
m=l.a
k=m[0]
j=m[1]
i=m[2]
h=m[3]
g=n&&b8.f
f=d5==null&&b8.y==null&&d9===0&&d8
e=f?A.kU(b8,b9,s):0
if(f&&d6.fd(d6.dy,g,d6.gaY(),k,j,i,h,c1,c2,c3,c4,e)){o=d6.gaY()
if(!b7&&o.b>0)d6.c_(b8,p,o)
return}d6.aL(d6.dy,g,d6.gaY(),k,j,i,h)
o=d6.gaY()}if(!b7&&o.b>0)d6.c_(b8,p,o)}if(d5!=null){A.fs(o,d5,d6.gbm())
o=d6.gbm()}if(o.b===0)return
d=d8?c1:b6
c=b8.y
if(c==null){e=A.kU(b8,b9,s)
if(d9===0)A.kb(c1.gv(),c2,c3,c4,o,e,d)
else A.mm(c1.gv(),c2,c3,c4,o,e,d9,d)}else{b=c9*d2-d0*d1
if(Math.abs(b)<=1e-12)return
a=1/b
a0=d2*a
a1=-d0*a
a2=-d1*a
a3=c9*a
a4=(d1*d4-d2*d3)*a
a5=(d0*d3-c9*d4)*a
a6=A.nc(c,b9,d6)
a7=c.d.n(b9)
a8=c.e.n(b9)
if(c.gh4()){b7=a8.length
if(0>=b7)return A.a(a8,0)
n=a8[0]
m=a7.length
if(0>=m)return A.a(a7,0)
a9=n-a7[0]
if(1>=b7)return A.a(a8,1)
b7=a8[1]
if(1>=m)return A.a(a7,1)
b0=b7-a7[1]
b1=c.h_(b9,a9,b0)
if(b1!=null){A.nf(c1.gv(),c2,c3,c4,o,a6.gv(),s,new A.bz([a0,a1,a2,a3,a4,a5]),a7[0],a7[1],Math.max(0.001,Math.sqrt(a9*a9+b0*b0)),b1)
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
b5=A.ok(d,c2,c3,c4,b7,n,a6,s,d9,m,a0,a1,a2,a3,a4,a5,b3,b2,b5,a8[1])
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
A.mp(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}else{m=c1.gv()
b2=a6.gv()
if(0>=b7)return A.a(a7,0)
b3=a7[0]
if(1>=b7)return A.a(a7,1)
b7=a7[1]
if(0>=n)return A.a(a8,0)
b4=a8[0]
if(1>=n)return A.a(a8,1)
A.mo(m,c2,c3,c4,o,b2,s,a0,a1,a2,a3,a4,a5,b3,b7,b4,a8[1])}}},
nf(b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=c0.a,a1=a0[0],a2=a0[1],a3=a0[2],a4=a0[3],a5=a0[4],a6=a0[5],a7=c4.a,a8=c4.b,a9=1-a7*a7-a8*a8,b0=a1/c3,b1=a2/c3,b2=b7.a.gv()
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
if(s)a=A.aE(a,b9)
if(n)a=A.b9(a,j)
if(!(d>=0&&d<a0))return A.a(b3,d)
i=A.ac(a,b3[d])
b3.$flags&2&&A.h(b3)
b3[d]=i}}},
du(a){var s,r,q
t.u.a(a)
A:{if(a instanceof A.aQ){s=a.c
if(s===$){r=a.b!==1||B.b.ap(a.a,A.jI())
a.c!==$&&A.P()
a.c=r
s=r}q=s
break A}if(a instanceof A.a5){s=a.r
if(s===$){r=B.b.ap(a.a,A.jI())
a.r!==$&&A.P()
a.r=r
s=r}q=s
break A}if(a instanceof A.R){q=A.du(a.a)
break A}q=!1
break A}return q},
im(a,b,c,d,e,a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f
if(c-b===1){if(!(b<a.length))return A.a(a,b)
s=A.du(a[b])}else s=!1
if(s){if(!(b<a.length))return A.a(a,b)
A.eF(a[b],d,e,a0,a1,a2,a3,a4)
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
if(!A.du(j))A.bB(j,d,r,q,p,o,n,m,0.0625,l,a3,0,0)}if(l.r===0)a2.l(0)
else{s=a0.a
a3.aL(l,a1,a2,s[0],s[1],s[2],s[3])}i=a4*2
for(s=a4+1,h=i+1,k=b,g=null,f=null;k<c;++k){if(!(k<a.length))return A.a(a,k)
j=a[k]
if(!A.du(j))continue
if(a2.b===0)A.eF(j,d,e,a0,a1,a2,a3,s)
else{if(g==null)g=a3.an(i)
A.eF(j,d,e,a0,a1,g,a3,s)
if(f==null)f=a3.an(h)
f.aT(a2)
A.cU(f,g,a2,a1?5:2)}}},
eF(a0,a1,a2,a3,a4,a5,a6,a7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a
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
if(!s.gaD()){k=a6.cZ(a7)
A.eE(s,a1,q,p,o,n,m,l,k)
a2=new A.bz([k[0],k[1],k[2],k[3],k[4],k[5]])}s=r.a
A.im(s,0,s.length,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.R
j=s?a0:null
if(s){A.eF(j.a,a1,a2,a3,a4,a5,a6,a7+1)
break A}s=a0 instanceof A.aQ
i=s?a0:null
if(s){h=i.a
s=i.b
if(s===1){A.im(h,0,h.length,a1,a2,a3,a4,a5,a6,a7+1)
return}g=a7*2
f=a6.an(g)
e=a6.an(g+1)
d=a7+1
A.im(h,0,h.length-1,a1,a2,a3,!1,f,a6,d)
if(f.b===0)c=s===3||s===4
else c=!1
if(c){a5.l(0)
return}b=B.b.gad(h)
if(A.du(b))A.eF(b,a1,a2,a3,!1,e,a6,d)
else{d=a2.a
q=d[0]
p=d[1]
o=d[2]
n=d[3]
m=d[4]
l=d[5]
a=a6.dy
a.l(0)
A.bB(b,a1,q,p,o,n,m,l,0.0625,a,a6,0,0)
d=a3.a
a6.aL(a,!1,e,d[0],d[1],d[2],d[3])}A.cU(f,e,a5,s)
break A}throw A.f(A.aD("Expected a boolean path"))}},
nG(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7=null,a8=a9.e
if(a8){s=a9.d.n(b0)
if(0>=s.length)return A.a(s,0)
r=s[0]
if(r<=0)return a7}else r=0
q=a9.b_(b0)
if(q==null)return a7
s=B.c.P(A.eI(q,b5,b7,b9))
p=B.c.P(A.eJ(q,b6,b8,c0))
o=B.c.V(A.eG(q,b5,b7,b9))
n=B.c.V(A.eH(q,b6,b8,c0))
m=Math.max(b1,s-2)
l=Math.max(b2,p-2)
k=Math.min(b3,o+2)
j=Math.min(b4,n+2)
if(m>=k||l>=j)return a7
i=a9.go
if(i===$){h=a9.fm()
a9.go!==$&&A.P()
a9.go=h
i=h}if(i!=null){g=c1.di(i,b0)
if(g.r===0)return a7
a8=c1.dy
a8.l(0)
a8.aF(g,b5,b6,b7,b8,b9,c0)
return new A.b_([m,l,k,j])}if(!a8&&a9.z==null&&a9.a.length===1){f=B.b.gae(a9.a)
while(f instanceof A.R)f=f.a
if(f instanceof A.aw&&!f.gG()){e=c1.dy
e.l(0)
A.kI(f,b0,0.0625,e,new A.bz([b5,b6,b7,b8,b9,c0]));++c1.w
return e.r===0?a7:new A.b_([m,l,k,j])}}d=Math.max(Math.sqrt(b5*b5+b6*b6),Math.sqrt(b7*b7+b8*b8))
c=d<=0.000001?0.25:B.c.B(0.25/d,0.005,1.5)
b=c*c
a=c1.db
a.l(0)
a0=a9.a
for(a1=a0.length-1;a1>=0;--a1){if(!(a1<a0.length))return A.a(a0,a1)
A.bB(a0[a1],b0,1,0,0,1,0,0,b,a,c1,0,0)}if(a.r===0)return a7
a2=a9.z
if(a2!=null){a3=c1.dx
a3.l(0)
A.mZ(a,a2,b0,a3,c1.ok)
if(a3.r===0)return a7
a4=a3}else a4=a
if(a8){a5=c1.fr
a5.l(0)
A.kE(a4,r*0.5,a9.r,a9.w,a9.x,c,a5,c1.gdj())
if(a5.r===0)return a7
a4=a5}a6=c1.dy
a6.l(0)
a6.aF(a4,b5,b6,b7,b8,b9,c0)
return new A.b_([m,l,k,j])},
kU(a,b,c){var s,r,q=a.b.n(b),p=q.length
if(0>=p)return A.a(q,0)
s=B.a.B(B.c.F(q[0]*255),0,255)
if(1>=p)return A.a(q,1)
r=B.a.B(B.c.F(q[1]*255),0,255)
if(2>=p)return A.a(q,2)
return A.kc(c,s,r,B.a.B(B.c.F(q[2]*255),0,255))},
nc(a,b,c){var s,r,q,p
if(a.c.a!=null){s=c.y1
r=s.h(0,a)
if(r!=null)return r.b
if(s.a>=256)s.K(0,new A.W(s,s.$ti.i("W<1>")).ga6(0)).b.a_()
q=A.fh(1024)
p=c.ay
p.toString
s.t(0,a,new A.aa(p,q,t.dL))
A.kH(a,b,q.gv())
return q}q=c.y2
if(q==null)q=c.y2=A.fh(1024)
A.kH(a,b,q.gv())
return q},
kH(a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a6.c.n(a7),a4=a6.a,a5=a6.x
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
d=e<=1e-12?0:B.c.B((j-f)/e,0,1)
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
a1=A.kc(B.a.B(B.c.F(a6.eD(a3,j)*255),0,255),B.a.B(B.c.F((m+(g-m)*d)*255),0,255),B.a.B(B.c.F((a+(a0-a)*d)*255),0,255),B.a.B(B.c.F((a1+(a2-a1)*d)*255),0,255))
a8.$flags&2&&A.h(a8)
if(!(k<a8.length))return A.a(a8,k)
a8[k]=a1}},
jk(a){return new A.bx(a,A.i([],t.ch))},
ki(a,b,c,d,e,f,g){var s=a*4,r=Math.max(0,B.a.I(b.gcr()-s,2)),q=new Float32Array(a*3)
s=Math.max(2,a+Math.max(0,B.a.I(b.gcr()-s,2)))
new Float64Array(s)
return new A.be(a,r,b,c,d,f,g,e,q)},
mL(a,b,c,d,e){return new A.bX(a,b,c,d,e,A.ab(t.S,t.W))},
kg(a,b){var s=a.length
return new A.cj(a,b,new Float64Array(s))},
c_(a,b){var s,r,q,p,o
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
return new A.a9(s,r,q,p>o?p:o)},
jp(a,b,c,d,e,f,g,h,i){return new A.bW(a,b,c,d,e,f,g,h,i)},
mK(){var s=null,r=t.n
return A.jp(A.ce(A.i([0,0],r)),A.ce(A.i([0,0],r)),A.ce(A.i([100,100],r)),A.ce(A.i([0],r)),A.ce(A.i([100],r)),s,s,s,s)},
jq(a,b,c){var s,r=a.a,q=!1
if(r!=null){s=r.length
if(0>=s)return A.a(r,0)
if(r[0]===b){if(1>=s)return A.a(r,1)
r=r[1]===c}else r=q}else r=q
return r},
ez(a,b){var s
if(a!=null){s=a.a
if(s!=null){if(0>=s.length)return A.a(s,0)
s=s[0]===b}else s=!1}else s=!0
return s},
kj(a,b,c){return new A.hJ(a,b,c)},
kk(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){return new A.a6(a,b,c,d,e,g,l,m,n,k,j,f,i,h,o)},
jm(a,b,c){return new A.a5(a,b,c)},
mz(a,b){return new A.aQ(a,b)},
il(a,b,c){if(c>0)return new A.F(a,-b)
if(c<0)return new A.F(-a,b)
return B.aD},
jo(a,b,c,d,e,f,g,h,i,j,k){return new A.bg(a,b,c,d,e,f,g,h,i,k,j)},
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
cc:function cc(a){this.a=a},
fn:function fn(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,a0,a1,a2,a3,a4,a5,a6){var _=this
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
_.p2=null
_.p3=q
_.p4=r
_.R8=s
_.RG=a0
_.rx=a1
_.ry=a2
_.x1=_.to=0
_.x2=a3
_.xr=a4
_.y1=a5
_.bv=_.y2=null
_.dQ=a6},
fo:function fo(a,b){this.a=a
this.b=b},
fp:function fp(a){this.a=a},
fq:function fq(a){this.a=a},
fr:function fr(a){this.a=a},
aa:function aa(a,b,c){this.a=a
this.b=b
this.$ti=c},
bO:function bO(a,b,c,d){var _=this
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
bx:function bx(a,b){var _=this
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
en:function en(a){this.b=a},
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
be:function be(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
R:function R(a){this.a=a},
bh:function bh(a,b){this.a=a
this.b=b},
bX:function bX(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=$
_.as=f},
i0:function i0(){},
cj:function cj(a,b,c){var _=this
_.a=a
_.b=b
_.c=c
_.e=$},
h6:function h6(){},
bW:function bW(a,b,c,d,e,f,g,h,i){var _=this
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
em:function em(a,b){this.a=a
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
_.fx=_.fr=_.dy=_.dx=_.db=$
_.fy=null
_.go=0/0},
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
aQ:function aQ(a,b){var _=this
_.a=a
_.b=b
_.e=_.d=_.c=$
_.w=null
_.x=0/0},
hR:function hR(){},
hQ:function hQ(){},
ep:function ep(){},
aw:function aw(a,b,c){var _=this
_.e=a
_.f=b
_.r=c
_.c=null
_.d=0/0},
aS:function aS(a,b,c,d,e){var _=this
_.e=a
_.f=b
_.r=c
_.w=d
_.x=e
_.c=null
_.d=0/0},
aZ:function aZ(a,b,c,d,e,f,g,h,i){var _=this
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
bg:function bg(a,b,c,d,e,f,g,h,i,j,k){var _=this
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
cR(a,b){var s=new Float64Array(b),r=new Float64Array(b),q=new Int32Array(a),p=new Int32Array(a)
return new A.ah(s,r,q,p,new Uint8Array(a))},
bn:function bn(a){this.a=a},
ah:function ah(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.w=_.r=_.f=0
_.x=!1},
cU(a6,a7,a8,a9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=65536
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
iW(a,b){var s=B.a.b4(B.a.L(a,9),32)
if(s<0)s=-s
if(!b)return s>=256?256:s
s&=511
return s>256?512-s:s},
aC:function aC(a){var _=this
_.a=a
_.b=0
_.d=_.c=2147483647
_.f=_.e=0},
eX:function eX(a,b,c,d,e,f){var _=this
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
kc(a,b,c,d){if(a===0)return 0
if(a===255)return(b<<16|c<<8|d|4278190080)>>>0
return(a<<24|B.a.I(b*a+127,255)<<16|B.a.I(c*a+127,255)<<8|B.a.I(d*a+127,255))>>>0},
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
return a+((B.a.L(q+(B.a.L(q,8)&16711935),8)&16711935|p+(B.a.L(p,8)&16711935)&4278255360)>>>0)},
aE(a,b){var s,r
if(b>=255)return a
if(b<=0||a===0)return 0
s=(a&16711935)*b+8388736
r=(a>>>8&16711935)*b+8388736
return(B.a.L(s+(B.a.L(s,8)&16711935),8)&16711935|r+(B.a.L(r,8)&16711935)&4278255360)>>>0},
kb(a,a0,a1,a2,a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b
if(a4===0||a3.b===0)return
if(a5!=null&&A.op(a5,a0,a1,a2,a3.a,a3.b,a4))return
s=a3.b*2
r=a3.a.gv()
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
else for(l=a.$flags|0,d=f;d<e;++d){l&2&&A.h(a)
if(!(d>=0&&d<q))return A.a(a,d)
a[d]=h}else{c=255-g
if(p&&j===1){if(!(f>=0&&f<q))return A.a(a,f)
b=a[f]
l=b===0?h:A.ka(h,b,c)
a.$flags&2&&A.h(a)
a[f]=l}else for(d=f;d<e;++d){if(!(d>=0&&d<q))return A.a(a,d)
b=a[d]
l=b===0?h:A.ka(h,b,c)
a.$flags&2&&A.h(a)
a[d]=l}}}},
ka(a,b,c){var s=(b&16711935)*c+8388736,r=(b>>>8&16711935)*c+8388736
return a+((B.a.L(s+(B.a.L(s,8)&16711935),8)&16711935|r+(B.a.L(r,8)&16711935)&4278255360)>>>0)},
mo(a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8
if(b5===0||b3.b===0)return
s=c4-c2
r=c5-c3
q=s*s+r*r
if(q<=1e-12){if(0>=b4.length)return A.a(b4,0)
p=b4[0]
A.kb(a9,b0,b1,b2,b3,b5<255?A.aE(p,b5):p,null)
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
if(k)p=A.aE(p,b5)
if(d)p=A.b9(p,a0)
if(!(a6>=0&&a6<j))return A.a(a9,a6)
a8=A.ac(p,a9[a6])
a9.$flags&2&&A.h(a9)
a9[a6]=a8
a3+=n}}},
mp(d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6=1023
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
a2=$.dA()
a2.$flags&2&&A.h(a2)
a2[0]=b7
c1=a2[0]
a2[0]=b8
c2=a2[0]
a2[0]=b9
c3=a2[0]
a2[0]=c0
c4=new A.aN(c1,c2,c3,a2[0]).cB()
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
c1=$.dA()
c1.$flags&2&&A.h(c1)
c1[0]=b7
c2=c1[0]
c1[0]=b8
c3=c1[0]
c1[0]=b9
c6=c1[0]
c1[0]=c0
c4=new A.aN(c2,c3,c6,c1[0]).cB()
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
if(f){c9=A.aE(c9,e3)
d0=A.aE(d0,e3)
d1=A.aE(d1,e3)
d2=A.aE(d2,e3)}if(a2){c9=A.b9(c9,a6)
d0=A.b9(d0,a6)
d1=A.b9(d1,a6)
d2=A.b9(d2,a6)}if(!(b6>=0&&b6<e))return A.a(d7,b6)
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
if(f)d5=A.aE(d5,e3)
if(a2)d5=A.b9(d5,a6)
if(!(b6>=0&&b6<e))return A.a(d7,b6)
c1=A.ac(d5,d7[b6])
a&2&&A.h(d7)
d7[b6]=c1
b1+=b2
b2+=i;++b6}}}},
av(a){var s=A.j(a)+128
return B.a.L(s+B.a.L(s,8),8)},
jg(a,b,c,d,e){var s
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
break}return A.av(a*(255-d)+b*(255-c)+s)},
e8(a,b,c){var s,r,q,p,o,n,m,l,k
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
k=s+r-A.av(s*r)
if(A.kd(c))return A.ml(q,o,m,p,n,l,s,r,k,c)
if(c===2)return(k<<24|q+p-A.av(q*p)<<16|o+n-A.av(o*n)<<8|m+l-A.av(m*l))>>>0
return(k<<24|A.jg(q,p,s,r,c)<<16|A.jg(o,n,s,r,c)<<8|A.jg(m,l,s,r,c))>>>0},
kd(a){var s=!0
if(a!==6)if(a!==7)if(a!==9)s=a>=12&&a<=15
return s},
ml(a,b,c,d,e,f,g,h,i,j){var s=a/g,r=b/g,q=c/g,p=new A.ay(s,r,q),o=d/h,n=e/h,m=f/h,l=new A.ay(o,n,m)
switch(j){case 12:s=A.fB(A.k9(p,A.jh(l)),A.e7(l))
break
case 13:s=A.fB(A.k9(l,A.jh(p)),A.e7(l))
break
case 14:s=A.fB(p,A.e7(l))
break
case 15:s=A.fB(l,A.e7(p))
break
default:s=new A.ay(A.jf(o,s,j),A.jf(n,r,j),A.jf(m,q,j))
break}r=new A.fz(h,g,i)
q=r.$3(a,d,s.a)
if(typeof q!=="number")return q.a9()
o=r.$3(b,e,s.b)
if(typeof o!=="number")return o.a9()
s=r.$3(c,f,s.c)
if(typeof s!=="number")return A.a3(s)
return(i<<24|q<<16|o<<8|s)>>>0},
jf(a,b,c){var s,r
if(c===6){if(a===0)s=0
else s=b===1?1:Math.min(1,a/(1-b))
return s}if(c===7){if(a===1)s=1
else s=b===0?0:1-Math.min(1,(1-a)/b)
return s}if(b<=0.5)return a-(1-2*b)*a*(1-a)
r=a<=0.25?((16*a-12)*a+4)*a:Math.sqrt(a)
return a+(2*b-1)*(r-a)},
e7(a){return 0.3*a.a+0.59*a.b+0.11*a.c},
jh(a){var s=a.a,r=a.b,q=a.c
return Math.max(s,Math.max(r,q))-Math.min(s,Math.min(r,q))},
k9(a,b){var s=a.a,r=a.b,q=a.c,p=Math.min(s,Math.min(r,q)),o=A.jh(a)
if(o===0)return B.aK
return new A.ay((s-p)*b/o,(r-p)*b/o,(q-p)*b/o)},
fB(a,b){var s=b-A.e7(a),r=a.a,q=a.b,p=a.c,o=new A.fC(s,Math.min(r,Math.min(q,p))+s,b,Math.max(r,Math.max(q,p))+s)
return new A.ay(o.$1(r),o.$1(q),o.$1(p))},
mm(a,b,c,d,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e
if(a1===0)return
if(a3!=null&&!A.kd(a2)&&A.oj(a3,b,c,d,a0.a,a0.b,a1,a2))return
s=a0.a.gv()
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
if(i!==p||e!==o){n=A.e8(i,e,a2)
o=e
p=i}a.$flags&2&&A.h(a)
a[f]=n}}},
mn(a,b,c,d,e,f,g,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i=c*d+b,h=g*a0+f
for(s=a.length,r=e.length,q=0,p=0,o=0,n=0;n<a2;++n,i+=d,h+=a0)for(m=0;m<a1;++m){l=h+m
if(!(l>=0&&l<r))return A.a(e,l)
k=e[l]
if(k===0)continue
l=i+m
if(!(l>=0&&l<s))return A.a(a,l)
j=a[l]
if(j===0){a.$flags&2&&A.h(a)
a[l]=k
continue}if(k!==q||j!==p){o=A.e8(k,j,a3)
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
dI:function dI(a){this.a=a},
lW(a,b,c,d,e,f,g,h){var s=h&&b>=32?J.iQ(B.j.gab(e),e.byteOffset,e.length/4|0):null
s=new A.f6(a,b,c,d,e,f,g,g==null?null:A.j8(a.length,null,!1,t.cn),s)
s.eo(a,b,c,d,e,f,g,h)
return s},
ce(a){var s=new Float32Array(A.T(a))
return new A.A(s,null,!1,new Float32Array(0),!1)},
ms(){var s,r,q,p=new Float32Array(256)
for(s=0;s<256;++s){r=s/255
q=r<=0.04045?r/12.92:Math.pow((r+0.055)/1.055,2.4)
if(!(s<256))return A.a(p,s)
p[s]=q}return p},
mr(){var s,r,q,p=new Float32Array(4097)
for(s=0;s<=4096;++s){r=s/4096
q=r<=0.0031308?r*12.92:Math.pow(r,0.4166666666666667)*1.055-0.055
if(!(s<4097))return A.a(p,s)
p[s]=q}return p},
fG(a){var s,r,q,p
if(a<=0)return 0
if(a>=1)return 1
if(a<=0.0031308)return a*12.92
s=a*4096
r=B.c.P(s)
if(r>=4096)return 1
q=$.lb()
if(!(r>=0))return A.a(q,r)
p=q[r]
return p+(q[r+1]-p)*(s-r)},
f6:function f6(a,b,c,d,e,f,g,h,i){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i},
f7:function f7(){},
A:function A(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=null
_.f=e
_.r=0
_.w=0/0},
ew:function ew(a,b){this.a=a
this.b=b},
jD(a){var s,r,q,p,o,n,m=[],l=[]
for(s=a.length,r=t.p,q=t.a,p=0;p<a.length;a.length===s||(0,A.V)(a),++p){o=a[p]
A:{if(r.b(o)){m.push(q.a(o.buffer))
n=o
break A}if(A.p(o)){n=o
break A}if(typeof o=="number"){n=o
break A}if(typeof o=="string"){n=o
break A}if(A.bj(o)){n=o
break A}n=A.x(A.aB("Unsupported raster worker field",null))}l.push(n)}return new A.F(l,m)},
o4(d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8=null
A:{s=t.eT.b(d9)
r=d8
q=d8
p=!1
o=d8
n=!1
m=d8
l=!1
k=d8
j=!1
i=d8
h=!1
g=d8
f=!1
e=d8
d=!1
c=d8
b=!1
a=d8
a0=!1
a1=d8
a2=d8
a3=d8
a4=d8
a5=d8
a6=d8
a7=d8
a8=d8
a9=d8
b0=d8
b1=!1
if(s){b2=d9.a
b3=b2[0]
b4=0===b3
if(b4){r=b2[8]
p=A.p(r)
if(p){A.j(r)
q=b2[2]
n=typeof q=="string"
if(n){A.K(q)
o=b2[6]
b5=t.p
if(b5.b(o)){b5.a(o)
b6=b2[10]
l=A.bj(b6)
if(l){A.bC(b6)
m=b2[1]
j=A.p(m)
if(j){A.j(m)
k=b2[11]
h=A.p(k)
if(h){A.j(k)
i=b2[7]
f=A.p(i)
if(f){A.j(i)
g=b2[5]
d=A.p(g)
if(d){A.j(g)
e=b2[4]
b=A.p(e)
if(b){A.j(e)
c=b2[9]
a0=A.p(c)
if(a0){A.j(c)
a=b2[3]
b1=A.p(a)
b0=c}a9=e}a8=g}a7=i}a6=k}a5=m}a4=b6}a3=o}a2=q}a1=r}}}else{b3=d8
b4=!1}if(b1){b1=[0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,A.j(a0?a:d9.a[3])]
break A}a1=d8
a2=d8
b7=d8
b8=d8
a3=d8
a4=d8
b9=d8
a5=d8
a6=d8
c0=d8
c1=d8
a7=d8
a8=d8
a9=d8
b0=d8
b1=!1
if(t.ga.b(d9)){c2=!0
c3=!0
c4=!0
if(s)b2=b3
else{b3=d9.a[0]
b2=b3
s=!0}if(4===b2){if(b4)b2=r
else{r=d9.a[9]
b2=r
b4=c2}if(A.p(b2)){if(b4)b2=r
else{r=d9.a[9]
b2=r
b4=c2}A.j(b2)
if(p)b5=q
else{q=d9.a[3]
b5=q
p=c3}if(typeof b5=="string"){if(p)b5=q
else{q=d9.a[3]
b5=q
p=c3}A.K(b5)
c5=d9.a
c6=c5[12]
if(A.p(c6)){A.j(c6)
c7=c5[10]
if(A.p(c7)){A.j(c7)
if(n)c8=o
else{o=c5[7]
c8=o
n=!0}c9=t.p
if(c9.b(c8)){a3=c9.a(n?o:c5[7])
d0=c5[15]
if(A.p(d0)){A.j(d0)
d1=c5[1]
if(A.p(d1)){A.j(d1)
if(l)c8=m
else{m=c5[2]
c8=m
l=!0}if(A.p(c8)){a5=A.j(l?m:c5[2])
if(j)c8=k
else{k=c5[16]
c8=k
j=c4}if(A.p(c8)){if(j)c8=k
else{k=c5[16]
c8=k
j=c4}A.j(c8)
d2=c5[13]
if(A.p(d2)){A.j(d2)
d3=c5[11]
if(A.p(d3)){A.j(d3)
if(h)c9=i
else{i=c5[8]
c9=i
h=!0}if(A.p(c9)){a7=A.j(h?i:c5[8])
if(f)c9=g
else{g=c5[6]
c9=g
f=!0}if(A.p(c9)){a8=A.j(f?g:c5[6])
if(d)c9=e
else{e=c5[5]
c9=e
d=!0}if(A.p(c9)){a9=A.j(d?e:c5[5])
if(b)c9=c
else{c=c5[14]
c9=c
b=!0}if(A.p(c9)){b0=A.j(b?c:c5[14])
if(a0)b1=a
else{a=c5[4]
b1=a
a0=!0}b1=A.p(b1)}}}}c1=d3}c0=d2}a6=c8}}b9=d1}a4=d0}}b8=c7}b7=c6}a2=b5}a1=b2}}}if(b1){b1=[4,a1,a2,b7,b8,a3,a4,b9,a5,a6,c0,c1,a7,a8,a9,b0,A.j(a0?a:d9.a[4])]
break A}d4=d8
d5=!1
a1=d8
b1=!1
if(t.bA.b(d9)){c2=!0
if(s)b2=b3
else{b3=d9.a
b2=b3
s=!0}if(1===b2){if(b4)b2=r
else{r=d9.c
b2=r
b4=c2}d5=A.p(b2)
if(d5){if(b4)b2=r
else{r=d9.c
b2=r
b4=c2}A.j(b2)
d4=d9.b
b1=typeof d4=="string"
a1=b2}}}if(b1){b1=[1,a1,A.K(d5?d4:d9.b)]
break A}d6=d8
d7=!1
a1=d8
b1=!1
if(t.ca.b(d9)){if(s)b2=b3
else{b3=d9.a
b2=b3
s=!0}if(3===b2){if(b4)b2=r
else{r=d9.c
b2=r
b4=!0}d7=A.p(b2)
if(d7){a1=A.j(b4?r:d9.c)
d6=d9.b
b1=typeof d6=="string"}}}if(b1){b1=[3,a1,A.K(d7?d6:d9.b)]
break A}a2=d8
b1=!1
if(t.dH.b(d9))if(2===(s?b3:d9.a)){if(p)b2=q
else{q=d9.b
b2=q
p=!0}if(typeof b2=="string"){a2=A.K(p?q:d9.b)
if(j)b1=k
else{k=d9.c
b1=k
j=!0}b1=A.p(b1)}}if(b1){b1=[2,a2,A.j(j?k:d9.c)]
break A}b1=A.x(A.aB("Unsupported raster worker reply",d8))}return A.jD(b1)},
fL:function fL(a){this.a=a},
on(a,b,c){var s
if(c<=0||b<=1)return 0
s=b-1
return B.a.B(B.c.P(Math.min(a*c,s)),0,s)},
oq(b0){var s,r,q,p,o,n,m,l,k,j,i={},h=A.cR(32,512),g=A.cR(32,512),f=A.cR(32,512),e=A.cR(32,512),d=A.cR(32,512),c=t.fM,b=A.i([],c),a=A.i([],c),a0=A.i([],c),a1=A.i([],c),a2=t.dh,a3=A.i([],a2),a4=A.i([],t.cU),a5=A.i([],a2),a6=new Float64Array(256),a7=t.bU,a8=A.i([],a7),a9=A.i([],c)
c=A.i([],c)
s=A.i([],a7)
a7=A.i([],a7)
r=A.i([],t.a2)
a2=A.i([],a2)
q=$.l
p=new A.fn(q!=null,new A.af(t.el),h,g,f,e,d,b,a,a0,a1,a3,a4,a5,new A.bn(a6),!1,a8,a9,c,s,a7,r,new A.af(t.gS),new A.af(t.fk),new A.af(t.gj),a2)
h=t.N
o=A.ab(h,h)
g=t.x
f=new Uint8Array(32)
e=new Uint8Array(16)
d=new Uint8Array(65536)
n=new A.eP(null,A.ab(g,t.g2),A.ab(h,t.cJ),A.ab(g,t.gz),A.j7(g),A.ab(h,t.eY),f,e,d)
g=new Int32Array(16384)
f=new Uint8Array(131072)
m=new A.fE()
l=A.ab(h,t.fW)
k=new A.fv()
$.jK()
h=$.jd.$0()
k.a=h
k.b=null
j=A.fh(65536)
i.a=0
h=b0.a
new A.ch(h,A.n(h).i("ch<1>")).hc(new A.iH(i,n,l,p,j,b0,new A.iM(l,p,o),o,new A.iI(i,j,m),new A.iK(j),m,new A.iN(n,l,p),new A.iL(i,j,m),new A.iO(o,b0),k,new A.iJ(k),new A.fb(g,f)))},
iJ:function iJ(a){this.a=a},
iI:function iI(a,b,c){this.a=a
this.b=b
this.c=c},
iK:function iK(a){this.a=a},
iL:function iL(a,b,c){this.a=a
this.b=b
this.c=c},
iN:function iN(a,b,c){this.a=a
this.b=b
this.c=c},
iM:function iM(a,b,c){this.a=a
this.b=b
this.c=c},
iO:function iO(a,b){this.a=a
this.b=b},
iH:function iH(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var _=this
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
og(){var s,r,q=null,p={}
p.a=!1
s=A.u(v.G.self)
p=new A.iB(p,new A.h8(new A.cg(q,q,q,q,t.co)))
if(typeof p=="function")A.x(A.aB("Attempting to rewrap a JS function.",q))
r=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.n6,p)
r[$.iP()]=p
s.onmessage=r},
iA:function iA(a,b){this.a=a
this.b=b},
iB:function iB(a,b){this.a=a
this.b=b},
h8:function h8(a){this.a=a},
bv(a,b,c){var s=a.BYTES_PER_ELEMENT
c=A.bt(b,c,B.a.a2(a.byteLength,s))
return J.c4(J.jQ(a),a.byteOffset+b*s,(c-b)*s)},
jj(a,b,c){var s=a.BYTES_PER_ELEMENT,r=(A.bt(b,c,B.a.a2(a.byteLength,s))-b)*s
if(B.a.N(r,4)!==0)throw A.f(A.aB("The number of bytes to view must be a multiple of 4",null))
return J.lz(J.jQ(a),a.byteOffset+b*s,B.a.I(r,4))},
l6(a){return v.mangledGlobalNames[a]},
o7(a,b){var s,r,q,p=a.length
if(p>=32)return A.na(a,b)
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
n5(a){var s,r,q,p,o,n,m,l=new Uint32Array(8192)
for(s=0;s<256;++s){r=a[s]
if(!(s<8192))return A.a(l,s)
l[s]=r}for(q=1;q<32;++q)for(r=(q-1)*256,p=q*256,s=0;s<256;++s){o=r+s
if(!(o>=0&&o<8192))return A.a(l,o)
n=l[o]
o=p+s
m=l[n&255]
if(!(o<8192))return A.a(l,o)
l[o]=(n>>>8^m)>>>0}return l},
na(c8,c9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7=$.kV
if(c7==null)c7=$.kV=A.n5(B.l)
s=c8.length
r=J.lx(B.d.gab(c8),c8.byteOffset,s)
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
o3(a){var s=a.length
if(s>=2&&a[0]===31&&a[1]===139)return B.I.fK(a,16777216,!0,!1)
if(s>16777216)throw A.f(B.a0)
return a}},B={}
var w=[A,J,B]
var $={}
A.j4.prototype={}
J.C.prototype={
E(a,b){return a===b},
gW(a){return A.cS(a)},
p(a){return"Instance of '"+A.e1(a)+"'"},
gX(a){return A.c0(A.ju(this))}}
J.cD.prototype={
p(a){return String(a)},
bF(a,b){return b||a},
gW(a){return a?519018:218159},
gX(a){return A.c0(t.y)},
$iB:1,
$ir:1}
J.cF.prototype={
E(a,b){return null==b},
p(a){return"null"},
gW(a){return 0},
$iB:1,
$iY:1}
J.Q.prototype={$iI:1}
J.bo.prototype={
gW(a){return 0},
p(a){return String(a)}}
J.e0.prototype={}
J.d0.prototype={}
J.ar.prototype={
p(a){var s=a[$.l8()]
if(s==null)s=a[$.iP()]
if(s==null)return this.el(a)
return"JavaScript function for "+J.bE(s)},
$ibG:1}
J.bH.prototype={
gW(a){return 0},
p(a){return String(a)}}
J.bI.prototype={
gW(a){return 0},
p(a){return String(a)}}
J.y.prototype={
m(a,b){A.a1(a).c.a(b)
a.$flags&1&&A.h(a,29)
a.push(b)},
ah(a,b){var s
A.a1(a).i("k<1>").a(b)
a.$flags&1&&A.h(a,"addAll",2)
if(Array.isArray(b)){this.eC(a,b)
return}for(s=J.cv(b);s.u();)a.push(s.gA())},
eC(a,b){var s,r
t.o.a(b)
s=b.length
if(s===0)return
if(a===b)throw A.f(A.ao(a))
for(r=0;r<s;++r)a.push(b[r])},
l(a){a.$flags&1&&A.h(a,"clear","clear")
a.length=0},
am(a,b){return A.fy(a,b,null,A.a1(a).c)},
ai(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
ej(a,b,c){var s=a.length
if(b>s)throw A.f(A.al(b,0,s,"start",null))
if(c==null)c=s
else if(c<b||c>s)throw A.f(A.al(c,b,s,"end",null))
if(b===c)return A.i([],A.a1(a))
return A.i(a.slice(b,c),A.a1(a))},
ga6(a){if(a.length>0)return a[0]
throw A.f(A.aq())},
gad(a){var s=a.length
if(s>0)return a[s-1]
throw A.f(A.aq())},
gae(a){var s=a.length
if(s===1){if(0>=s)return A.a(a,0)
return a[0]}if(s===0)throw A.f(A.aq())
throw A.f(A.j0())},
b3(a,b,c){a.$flags&1&&A.h(a,18)
A.bt(b,c,a.length)
a.splice(b,c-b)},
ap(a,b){var s,r
A.a1(a).i("r(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(b.$1(a[r]))return!0
if(a.length!==s)throw A.f(A.ao(a))}return!1},
ac(a,b){var s,r
A.a1(a).i("r(1)").a(b)
s=a.length
for(r=0;r<s;++r){if(!b.$1(a[r]))return!1
if(a.length!==s)throw A.f(A.ao(a))}return!0},
gR(a){return a.length===0},
gck(a){return a.length!==0},
p(a){return A.j1(a,"[","]")},
gD(a){return new J.bF(a,a.length,A.a1(a).i("bF<1>"))},
gW(a){return A.cS(a)},
gk(a){return a.length},
sk(a,b){a.$flags&1&&A.h(a,"set length","change the length of")
if(b<0)throw A.f(A.al(b,0,null,"newLength",null))
if(b>a.length)A.a1(a).c.a(null)
a.length=b},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eL(a,b))
return a[b]},
t(a,b,c){A.a1(a).c.a(c)
a.$flags&2&&A.h(a)
if(!(b>=0&&b<a.length))throw A.f(A.eL(a,b))
a[b]=c},
$io:1,
$ik:1,
$it:1}
J.dO.prototype={
ht(a){var s,r,q
if(!Array.isArray(a))return null
s=a.$flags|0
if((s&4)!==0)r="const, "
else if((s&2)!==0)r="unmodifiable, "
else r=(s&1)!==0?"fixed, ":""
q="Instance of '"+A.e1(a)+"'"
if(r==="")return q
return q+" ("+r+"length: "+a.length+")"}}
J.f3.prototype={}
J.bF.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s,r=this,q=r.a,p=q.length
if(r.b!==p){q=A.V(q)
throw A.f(q)}s=r.c
if(s>=p){r.d=null
return!1}r.d=q[s]
r.c=s+1
return!0},
$ia0:1}
J.cG.prototype={
cc(a,b){var s
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){s=this.gcj(b)
if(this.gcj(a)===s)return 0
if(this.gcj(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gcj(a){return a===0?1/a<0:a<0},
Y(a){var s
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){s=a<0?Math.ceil(a):Math.floor(a)
return s+0}throw A.f(A.aF(""+a+".toInt()"))},
V(a){var s,r
if(a>=0){if(a<=2147483647){s=a|0
return a===s?s:s+1}}else if(a>=-2147483648)return a|0
r=Math.ceil(a)
if(isFinite(r))return r
throw A.f(A.aF(""+a+".ceil()"))},
P(a){var s,r
if(a>=0){if(a<=2147483647)return a|0}else if(a>=-2147483648){s=a|0
return a===s?s:s-1}r=Math.floor(a)
if(isFinite(r))return r
throw A.f(A.aF(""+a+".floor()"))},
F(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.f(A.aF(""+a+".round()"))},
e3(a){if(a<0)return-Math.round(-a)
else return Math.round(a)},
B(a,b,c){if(this.cc(b,c)>0)throw A.f(A.jA(b))
if(this.cc(a,b)<0)return b
if(this.cc(a,c)>0)return c
return a},
p(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gW(a){var s,r,q,p,o=a|0
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
a2(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.dn(a,b)},
I(a,b){return(a|0)===a?a/b|0:this.dn(a,b)},
dn(a,b){var s=a/b
if(s>=-2147483648&&s<=2147483647)return s|0
if(s>0){if(s!==1/0)return Math.floor(s)}else if(s>-1/0)return Math.ceil(s)
throw A.f(A.aF("Result of truncating division is "+A.v(s)+": "+A.v(a)+" ~/ "+b))},
a9(a,b){if(b<0)throw A.f(A.jA(b))
return b>31?0:a<<b>>>0},
fq(a,b){return b>31?0:a<<b>>>0},
L(a,b){var s
if(a>0)s=this.c2(a,b)
else{s=b>31?31:b
s=a>>s>>>0}return s},
c2(a,b){return b>31?0:a>>>b},
fs(a,b){if(b>31)return 0
return a>>>b},
gX(a){return A.c0(t.q)},
$ie:1,
$ic2:1}
J.cE.prototype={
b4(a,b){var s=this.a9(1,b-1)
return((a&s-1)>>>0)-((a&s)>>>0)},
gX(a){return A.c0(t.S)},
$iB:1,
$ib:1}
J.dP.prototype={
gX(a){return A.c0(t.i)},
$iB:1}
J.c9.prototype={
eh(a,b){var s=b.length
if(s>a.length)return!1
return b===a.substring(0,s)},
bI(a,b,c){return a.substring(b,A.bt(b,c,a.length))},
ek(a,b){return this.bI(a,b,null)},
a8(a,b){var s,r
if(0>=b)return""
if(b===1||a.length===0)return a
if(b!==b>>>0)throw A.f(B.P)
for(s=a,r="";;){if((b&1)===1)r=s+r
b=b>>>1
if(b===0)break
s+=s}return r},
p(a){return a},
gW(a){var s,r,q
for(s=a.length,r=0,q=0;q<s;++q){r=r+a.charCodeAt(q)&536870911
r=r+((r&524287)<<10)&536870911
r^=r>>6}r=r+((r&67108863)<<3)&536870911
r^=r>>11
return r+((r&16383)<<15)&536870911},
gX(a){return A.c0(t.N)},
gk(a){return a.length},
h(a,b){A.j(b)
if(!(b>=0&&b<a.length))throw A.f(A.eL(a,b))
return a[b]},
$iB:1,
$ifk:1,
$iq:1}
A.b2.prototype={
p(a){return"LateInitializationError: "+this.a}}
A.iD.prototype={
$0(){var s=new A.J($.E,t.U)
s.bL(null)
return s},
$S:28}
A.ft.prototype={}
A.o.prototype={}
A.a4.prototype={
gD(a){var s=this
return new A.bK(s,s.gk(s),A.n(s).i("bK<a4.E>"))},
gR(a){return this.gk(this)===0},
am(a,b){return A.fy(this,b,null,A.n(this).i("a4.E"))}}
A.cZ.prototype={
geS(){var s=J.aj(this.a),r=this.c
if(r==null||r>s)return s
return r},
gft(){var s=J.aj(this.a),r=this.b
if(r>s)return s
return r},
gk(a){var s,r=J.aj(this.a),q=this.b
if(q>=r)return 0
s=this.c
if(s==null||s>=r)return r-q
return s-q},
ai(a,b){var s=this,r=s.gft()+b
if(b<0||r>=s.geS())throw A.f(A.iY(b,s.gk(0),s,"index"))
return J.jP(s.a,r)},
am(a,b){var s,r,q=this
A.aO(b,"count")
s=q.b+b
r=q.c
if(r!=null&&s>=r)return new A.cA(q.$ti.i("cA<1>"))
return A.fy(q.a,s,r,q.$ti.c)},
cp(a,b){var s,r,q,p=this,o=p.b,n=p.a,m=J.M(n),l=m.gk(n),k=p.c
if(k!=null&&k<l)l=k
s=l-o
if(s<=0){n=p.$ti.c
return b?J.j3(0,n):J.j2(0,n)}r=A.j8(s,m.ai(n,o),b,p.$ti.c)
for(q=1;q<s;++q){B.b.t(r,q,m.ai(n,o+q))
if(m.gk(n)<l)throw A.f(A.ao(p))}return r}}
A.bK.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s,r=this,q=r.a,p=J.M(q),o=p.gk(q)
if(r.b!==o)throw A.f(A.ao(q))
s=r.c
if(s>=o){r.d=null
return!1}r.d=p.ai(q,s);++r.c
return!0},
$ia0:1}
A.X.prototype={
gk(a){return J.aj(this.a)},
ai(a,b){return this.b.$1(J.jP(this.a,b))}}
A.bN.prototype={
gD(a){return new A.d2(J.cv(this.a),this.b,this.$ti.i("d2<1>"))}}
A.d2.prototype={
u(){var s,r
for(s=this.a,r=this.b;s.u();)if(r.$1(s.gA()))return!0
return!1},
gA(){return this.a.gA()},
$ia0:1}
A.b7.prototype={
am(a,b){A.eO(b,"count",t.S)
A.aO(b,"count")
return new A.b7(this.a,this.b+b,A.n(this).i("b7<1>"))},
gD(a){var s=this.a
return new A.cW(s.gD(s),this.b,A.n(this).i("cW<1>"))}}
A.c8.prototype={
gk(a){var s=this.a,r=s.gk(s)-this.b
if(r>=0)return r
return 0},
am(a,b){A.eO(b,"count",t.S)
A.aO(b,"count")
return new A.c8(this.a,this.b+b,this.$ti)},
$io:1}
A.cW.prototype={
u(){var s,r
for(s=this.a,r=0;r<this.b;++r)s.u()
this.b=0
return s.u()},
gA(){return this.a.gA()},
$ia0:1}
A.cA.prototype={
gD(a){return B.H},
gR(a){return!0},
gk(a){return 0},
am(a,b){A.aO(b,"count")
return this},
cp(a,b){var s=this.$ti.c
return b?J.j3(0,s):J.j2(0,s)}}
A.cB.prototype={
u(){return!1},
gA(){throw A.f(A.aq())},
$ia0:1}
A.G.prototype={
dz(a,b){return A.x(A.aF("Cannot "+b+" a fixed-length list"))},
sk(a,b){this.dz(a,"change the length of")},
m(a,b){A.aJ(a).i("G.E").a(b)
return this.dz(a,"add to")}}
A.bw.prototype={
t(a,b,c){A.n(this).i("bw.E").a(c)
throw A.f(A.aF("Cannot modify an unmodifiable list"))},
sk(a,b){throw A.f(A.aF("Cannot change the length of an unmodifiable list"))},
m(a,b){A.n(this).i("bw.E").a(b)
throw A.f(A.aF("Cannot add to an unmodifiable list"))},
M(a,b,c,d,e){A.n(this).i("k<bw.E>").a(d)
throw A.f(A.aF("Cannot modify an unmodifiable list"))},
H(a,b,c,d){return this.M(0,b,c,d,0)}}
A.dc.prototype={$r:"+(1)",$s:1}
A.cl.prototype={$r:"+(1,2,3,4,5,6,7,8,9,10)",$s:15}
A.dd.prototype={$r:"+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(1,2,3,4,5,6,7,8,9,10)",$s:16}
A.de.prototype={$r:"+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(1,2,3,4,5,6,7,8,9,10,11,12)",$s:18}
A.cm.prototype={$r:"+entryDiskBytes,entryKey,frameCrc,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12)",$s:19}
A.df.prototype={$r:"+compressedCount,entryDiskBytes,entryKey,frameCrc,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17)",$s:20}
A.F.prototype={$r:"+(1,2)",$s:2}
A.dg.prototype={$r:"+calls,copiedBytes(1,2)",$s:3}
A.ay.prototype={$r:"+(1,2,3)",$s:4}
A.cn.prototype={$r:"+compressedBytes,crc31,entryDiskBytes(1,2,3)",$s:10}
A.dh.prototype={$r:"+contentKey,requestId(1,2,3)",$s:5}
A.di.prototype={$r:"+diskDirectory,maximumRamBytes(1,2,3)",$s:6}
A.co.prototype={$r:"+entryKey,workerRamBytes(1,2,3)",$s:7}
A.bV.prototype={$r:"+message,requestId(1,2,3)",$s:8}
A.b_.prototype={$r:"+(1,2,3,4)",$s:12}
A.dj.prototype={$r:"+bytes,contentKey,useSimd(1,2,3,4)",$s:13}
A.bz.prototype={$r:"+(1,2,3,4,5,6)",$s:14}
A.d5.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s=this,r=s.c
if(r>=s.b){s.d=null
return!1}s.d=s.a[r]
s.c=r+1
return!0},
$ia0:1}
A.cz.prototype={
m(a,b){A.n(this).c.a(b)
A.lN()}}
A.N.prototype={
gk(a){return this.b},
gD(a){var s,r=this,q=r.$keys
if(q==null){q=Object.keys(r.a)
r.$keys=q}s=q
return new A.d5(s,s.length,r.$ti.i("d5<1>"))},
aq(a,b){if(typeof b!="string")return!1
if("__proto__"===b)return!1
return this.a.hasOwnProperty(b)}}
A.fl.prototype={
$0(){return B.c.P(1000*this.a.now())},
$S:3}
A.cV.prototype={}
A.fH.prototype={
aj(a){var s,r,q=this,p=new RegExp(q.a).exec(a)
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
A.cQ.prototype={
p(a){return"Null check operator used on a null value"}}
A.dR.prototype={
p(a){var s,r=this,q="NoSuchMethodError: method not found: '",p=r.b
if(p==null)return"NoSuchMethodError: "+r.a
s=r.c
if(s==null)return q+p+"' ("+r.a+")"
return q+p+"' on '"+s+"' ("+r.a+")"}}
A.ec.prototype={
p(a){var s=this.a
return s.length===0?"Error":"Error: "+s}}
A.fj.prototype={
p(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.cC.prototype={}
A.dl.prototype={
p(a){var s,r=this.b
if(r!=null)return r
r=this.a
s=r!==null&&typeof r==="object"?r.stack:null
return this.b=s==null?"":s},
$iau:1}
A.bl.prototype={
p(a){var s=this.constructor,r=s==null?null:s.name
return"Closure '"+A.l7(r==null?"unknown":r)+"'"},
$ibG:1,
ghv(){return this},
$C:"$1",
$R:1,
$D:null}
A.dD.prototype={$C:"$0",$R:0}
A.dE.prototype={$C:"$2",$R:2}
A.e9.prototype={}
A.e5.prototype={
p(a){var s=this.$static_name
if(s==null)return"Closure of unknown static method"
return"Closure '"+A.l7(s)+"'"}}
A.c6.prototype={
E(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.c6))return!1
return this.$_target===b.$_target&&this.a===b.a},
gW(a){return(A.iE(this.a)^A.cS(this.$_target))>>>0},
p(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.e1(this.a)+"'")}}
A.e4.prototype={
p(a){return"RuntimeError: "+this.a}}
A.eB.prototype={
p(a){return"Assertion failed: Reached dead code"}}
A.b1.prototype={
gk(a){return this.a},
gR(a){return this.a===0},
gar(){return new A.W(this,A.n(this).i("W<1>"))},
aG(a){var s,r
if(typeof a=="string"){s=this.b
if(s==null)return!1
return s[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){r=this.c
if(r==null)return!1
return r[a]!=null}else return this.h7(a)},
h7(a){var s=this.d
if(s==null)return!1
return this.b0(this.cX(s,a),a)>=0},
ah(a,b){A.n(this).i("ag<1,2>").a(b).aI(0,new A.f4(this))},
h(a,b){var s,r,q,p,o=null
if(typeof b=="string"){s=this.b
if(s==null)return o
r=s[b]
q=r==null?o:r.b
return q}else if(typeof b=="number"&&(b&0x3fffffff)===b){p=this.c
if(p==null)return o
r=p[b]
q=r==null?o:r.b
return q}else return this.h8(b)},
h8(a){var s,r,q=this.d
if(q==null)return null
s=this.cX(q,a)
r=this.b0(s,a)
if(r<0)return null
return s[r].b},
t(a,b,c){var s,r,q,p,o,n,m=this,l=A.n(m)
l.c.a(b)
l.y[1].a(c)
if(typeof b=="string"){s=m.b
m.cE(s==null?m.b=m.bV():s,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){r=m.c
m.cE(r==null?m.c=m.bV():r,b,c)}else{q=m.d
if(q==null)q=m.d=m.bV()
p=m.bw(b)
o=q[p]
if(o==null)q[p]=[m.bK(b,c)]
else{n=m.b0(o,b)
if(n>=0)o[n].b=c
else o.push(m.bK(b,c))}}},
e0(a,b){var s,r,q=this,p=A.n(q)
p.c.a(a)
p.i("2()").a(b)
if(q.aG(a)){s=q.h(0,a)
return s==null?p.y[1].a(s):s}r=b.$0()
q.t(0,a,r)
return r},
K(a,b){var s=this
if(typeof b=="string")return s.cF(s.b,b)
else if(typeof b=="number"&&(b&0x3fffffff)===b)return s.cF(s.c,b)
else return s.h9(b)},
h9(a){var s,r,q,p,o=this,n=o.d
if(n==null)return null
s=o.bw(a)
r=n[s]
q=o.b0(r,a)
if(q<0)return null
p=r.splice(q,1)[0]
o.cG(p)
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
if(r!==q.r)throw A.f(A.ao(q))
s=s.c}},
cE(a,b,c){var s,r=A.n(this)
r.c.a(b)
r.y[1].a(c)
s=a[b]
if(s==null)a[b]=this.bK(b,c)
else s.b=c},
cF(a,b){var s
if(a==null)return null
s=a[b]
if(s==null)return null
this.cG(s)
delete a[b]
return s.b},
bJ(){this.r=this.r+1&1073741823},
bK(a,b){var s=this,r=A.n(s),q=new A.f9(r.c.a(a),r.y[1].a(b))
if(s.e==null)s.e=s.f=q
else{r=s.f
r.toString
q.d=r
s.f=r.c=q}++s.a
s.bJ()
return q},
cG(a){var s=this,r=a.d,q=a.c
if(r==null)s.e=q
else r.c=q
if(q==null)s.f=r
else q.d=r;--s.a
s.bJ()},
bw(a){return J.am(a)&1073741823},
cX(a,b){return a[this.bw(b)]},
b0(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1},
p(a){return A.k0(this)},
bV(){var s=Object.create(null)
s["<non-identifier-key>"]=s
delete s["<non-identifier-key>"]
return s},
$ij6:1}
A.f4.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.t(0,r.c.a(a),r.y[1].a(b))},
$S(){return A.n(this.a).i("~(1,2)")}}
A.f9.prototype={}
A.W.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gD(a){var s=this.a
return new A.cI(s,s.r,s.e,this.$ti.i("cI<1>"))}}
A.cI.prototype={
gA(){return this.d},
u(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.ao(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.a
r.c=s.c
return!0}},
$ia0:1}
A.fa.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gD(a){var s=this.a
return new A.aL(s,s.r,s.e,this.$ti.i("aL<1>"))}}
A.aL.prototype={
gA(){return this.d},
u(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.ao(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=s.b
r.c=s.c
return!0}},
$ia0:1}
A.bJ.prototype={
gk(a){return this.a.a},
gR(a){return this.a.a===0},
gD(a){var s=this.a
return new A.cH(s,s.r,s.e,this.$ti.i("cH<1,2>"))}}
A.cH.prototype={
gA(){var s=this.d
s.toString
return s},
u(){var s,r=this,q=r.a
if(r.b!==q.r)throw A.f(A.ao(q))
s=r.c
if(s==null){r.d=null
return!1}else{r.d=new A.bp(s.a,s.b,r.$ti.i("bp<1,2>"))
r.c=s.c
return!0}},
$ia0:1}
A.af.prototype={
bw(a){return A.iE(a)&1073741823},
b0(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.iv.prototype={
$1(a){return this.a(a)},
$S:24}
A.iw.prototype={
$2(a,b){return this.a(a,b)},
$S:16}
A.ix.prototype={
$1(a){return this.a(A.K(a))},
$S:21}
A.O.prototype={
p(a){return this.ds(!1)},
ds(a){var s,r,q,p,o,n=this.eX(),m=this.aU(),l=(a?"Record ":"")+"("
for(s=n.length,r="",q=0;q<s;++q,r=", "){l+=r
p=n[q]
if(typeof p=="string")l=l+p+": "
if(!(q<m.length))return A.a(m,q)
o=m[q]
l=a?l+A.k2(o):l+A.v(o)}l+=")"
return l.charCodeAt(0)==0?l:l},
eX(){var s,r=this.$s
while($.hT.length<=r)B.b.m($.hT,null)
s=$.hT[r]
if(s==null){s=this.eL()
B.b.t($.hT,r,s)}return s},
eL(){var s,r,q,p=this.$r,o=p.indexOf("("),n=p.substring(1,o),m=p.substring(o),l=m==="()"?0:m.replace(/[^,]/g,"").length+1,k=A.i(new Array(l),t.f)
for(s=0;s<l;++s)k[s]=s
if(n!==""){r=n.split(",")
s=r.length
for(q=l;s>0;){--q;--s
B.b.t(k,q,r[s])}}k=A.m_(k,!1,t.K)
k.$flags=3
return k}}
A.bU.prototype={
aU(){return[this.a,this.b]},
E(a,b){if(b==null)return!1
return b instanceof A.bU&&this.$s===b.$s&&J.m(this.a,b.a)&&J.m(this.b,b.b)},
gW(a){return A.dZ(this.$s,this.a,this.b,B.m)}}
A.ck.prototype={
aU(){return[this.a]},
E(a,b){if(b==null)return!1
return b instanceof A.ck&&this.$s===b.$s&&J.m(this.a,b.a)},
gW(a){return A.dZ(this.$s,this.a,B.m,B.m)}}
A.aT.prototype={
aU(){return[this.a,this.b,this.c]},
E(a,b){var s=this
if(b==null)return!1
return b instanceof A.aT&&s.$s===b.$s&&J.m(s.a,b.a)&&J.m(s.b,b.b)&&J.m(s.c,b.c)},
gW(a){var s=this
return A.dZ(s.$s,s.a,s.b,s.c)}}
A.ax.prototype={
aU(){return this.a},
E(a,b){if(b==null)return!1
return b instanceof A.ax&&this.$s===b.$s&&A.mI(this.a,b.a)},
gW(a){return A.dZ(this.$s,A.m8(this.a),B.m,B.m)}}
A.dQ.prototype={
p(a){return"RegExp/"+this.a+"/"+this.b.flags},
gf6(){var s=this,r=s.c
if(r!=null)return r
r=s.b
return s.c=A.jZ(s.a,r.multiline,!r.ignoreCase,r.unicode,r.dotAll,"g")},
dS(a){var s=this.b.exec(a)
if(s==null)return null
return new A.d7(s)},
dE(a,b){return new A.ee(this,b,0)},
eV(a,b){var s,r=this.gf6()
if(r==null)r=A.aU(r)
r.lastIndex=b
s=r.exec(a)
if(s==null)return null
return new A.d7(s)},
$ifk:1,
$img:1}
A.d7.prototype={
h(a,b){var s
A.j(b)
s=this.b
if(!(b>=0&&b<s.length))return A.a(s,b)
return s[b]},
$ie2:1}
A.ee.prototype={
gD(a){return new A.cf(this.a,this.b,this.c)}}
A.cf.prototype={
gA(){var s=this.d
return s==null?t.d.a(s):s},
u(){var s,r,q,p,o,n,m=this,l=m.b
if(l==null)return!1
s=m.c
r=l.length
if(s<=r){q=m.a
p=q.eV(l,s)
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
$ia0:1}
A.fU.prototype={
ao(){var s=this.b
if(s===this)throw A.f(new A.b2("Local '' has not been initialized."))
return s},
sdR(a){if(this.b!==this)throw A.f(new A.b2("Local '' has already been initialized."))
this.b=a}}
A.bq.prototype={
gX(a){return B.b5},
bu(a,b,c){A.bi(a,b,c)
return c==null?new Uint8Array(a,b):new Uint8Array(a,b,c)},
dJ(a){return this.bu(a,0,null)},
dI(a,b,c){A.bi(a,b,c)
if(c==null)c=B.a.I(a.byteLength-b,4)
return new Uint32Array(a,b,c)},
dH(a,b,c){A.bi(a,b,c)
if(c==null)c=B.a.I(a.byteLength-b,8)
return new Float64Array(a,b,c)},
dG(a,b,c){if(B.a.N(b,16)!==0)A.x(A.k3("Offset ("+b+") must be a multiple of BYTES_PER_ELEMENT (16)"))
return new A.cK(A.m6(a,b,(c==null?B.a.I(a.byteLength-b,16):c)*4))},
dF(a,b,c){A.bi(a,b,c)
return c==null?new DataView(a,b):new DataView(a,b,c)},
$iB:1,
$ibq:1}
A.ca.prototype={$ica:1}
A.cK.prototype={
gX(a){return B.b8},
gk(a){return this.a.length/4|0},
h(a,b){var s,r,q,p,o,n,m
A.j(b)
s=this.a
r=s.length
A.aV(b,this,r/4|0)
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
t(a,b,c){var s,r,q,p
t.Y.a(c)
s=this.a
r=s.length
A.aV(b,this,r/4|0)
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
$io:1,
$iB:1,
$ik:1,
$it:1,
$ieV:1}
A.eA.prototype={}
A.cN.prototype={
gab(a){if(((a.$flags|0)&2)!==0)return new A.i3(a.buffer)
else return a.buffer},
f3(a,b,c,d){var s=A.al(b,0,c,d,null)
throw A.f(s)},
cM(a,b,c,d){if(b>>>0!==b||b>c)this.f3(a,b,c,d)}}
A.i3.prototype={
bu(a,b,c){var s=A.jb(this.a,b,c)
s.$flags=3
return s},
dJ(a){return this.bu(0,0,null)},
dI(a,b,c){var s=A.ja(this.a,b,c)
s.$flags=3
return s},
dH(a,b,c){var s=A.j9(this.a,b,c)
s.$flags=3
return s},
dG(a,b,c){return new A.eA(J.iQ(this.a,b,c).a)},
dF(a,b,c){var s=A.m2(this.a,b,c)
s.$flags=3
return s}}
A.dU.prototype={
gX(a){return B.b6},
$iB:1}
A.a8.prototype={
gk(a){return a.length},
dg(a,b,c,d,e){var s,r,q=a.length
this.cM(a,b,q,"start")
this.cM(a,c,q,"end")
if(b>c)throw A.f(A.al(b,0,c,null,null))
s=c-b
if(e<0)throw A.f(A.aB(e,null))
r=d.length
if(r-e<s)throw A.f(A.aD("Not enough elements"))
if(e!==0||r!==s)d=d.subarray(e,e+s)
a.set(d,b)},
$ias:1}
A.br.prototype={
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
t(a,b,c){A.S(c)
a.$flags&2&&A.h(a)
A.aV(b,a,a.length)
a[b]=c},
M(a,b,c,d,e){t.bM.a(d)
a.$flags&2&&A.h(a,5)
if(t.d4.b(d)){this.dg(a,b,c,d,e)
return}this.cD(a,b,c,d,e)},
H(a,b,c,d){return this.M(a,b,c,d,0)},
$io:1,
$ik:1,
$it:1}
A.at.prototype={
t(a,b,c){A.j(c)
a.$flags&2&&A.h(a)
A.aV(b,a,a.length)
a[b]=c},
M(a,b,c,d,e){t.hb.a(d)
a.$flags&2&&A.h(a,5)
if(t.eB.b(d)){this.dg(a,b,c,d,e)
return}this.cD(a,b,c,d,e)},
H(a,b,c,d){return this.M(a,b,c,d,0)},
$io:1,
$ik:1,
$it:1}
A.cb.prototype={
gX(a){return B.b7},
$iB:1,
$icb:1,
$ibm:1}
A.cL.prototype={
gX(a){return B.b9},
$iB:1,
$ieW:1}
A.dV.prototype={
gX(a){return B.ba},
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
$iB:1}
A.cM.prototype={
gX(a){return B.bb},
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
$iB:1,
$ij_:1}
A.dX.prototype={
gX(a){return B.bc},
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
$iB:1}
A.dY.prototype={
gX(a){return B.be},
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
$iB:1,
$iji:1}
A.cO.prototype={
gX(a){return B.bf},
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
$iB:1,
$id_:1}
A.cP.prototype={
gX(a){return B.bg},
gk(a){return a.length},
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
$iB:1}
A.bL.prototype={
gX(a){return B.bh},
gk(a){return a.length},
h(a,b){A.j(b)
A.aV(b,a,a.length)
return a[b]},
$iB:1,
$ibL:1,
$ibu:1}
A.aN.prototype={
a8(a,b){var s,r,q,p,o=this
t.Y.a(b)
s=$.dA()
s.$flags&2&&A.h(s)
s[0]=o.a*b.a
r=s[0]
s[0]=o.b*b.b
q=s[0]
s[0]=o.c*b.c
p=s[0]
s[0]=o.d*b.d
return new A.aN(r,q,p,s[0])},
cB(){var s,r,q,p=this,o=Math.sqrt(p.a),n=Math.sqrt(p.b),m=Math.sqrt(p.c),l=Math.sqrt(p.d),k=$.dA()
k.$flags&2&&A.h(k)
k[0]=o
s=k[0]
k[0]=n
r=k[0]
k[0]=m
q=k[0]
k[0]=l
return new A.aN(s,r,q,k[0])},
p(a){return"V128"},
$iZ:1}
A.et.prototype={}
A.eu.prototype={}
A.d8.prototype={}
A.d9.prototype={}
A.da.prototype={}
A.db.prototype={}
A.eC.prototype={}
A.aP.prototype={
i(a){return A.dt(v.typeUniverse,this,a)},
a3(a){return A.ku(v.typeUniverse,this,a)}}
A.eo.prototype={}
A.i1.prototype={
p(a){return A.ai(this.a,null)}}
A.el.prototype={
p(a){return this.a}}
A.cp.prototype={$ibb:1}
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
eq(a,b){if(self.setTimeout!=null)self.setTimeout(A.dy(new A.i_(this,b),0),a)
else throw A.f(A.aF("`setTimeout()` not found."))}}
A.i_.prototype={
$0(){this.b.$0()},
$S:0}
A.ef.prototype={}
A.ic.prototype={
$1(a){return this.a.$2(0,a)},
$S:4}
A.id.prototype={
$2(a,b){this.a.$2(1,new A.cC(a,t.l.a(b)))},
$S:38}
A.iq.prototype={
$2(a,b){this.a(A.j(a),b)},
$S:40}
A.an.prototype={
p(a){return A.v(this.a)},
$iL:1,
gaS(){return this.b}}
A.ej.prototype={
dN(a){var s=this.a
if((s.a&30)!==0)throw A.f(A.aD("Future already completed"))
s.bc(A.nn(a,null))}}
A.d3.prototype={}
A.bd.prototype={
hf(a){var s
if((this.c&15)!==6)return!0
s=this.b.b
return s.br(s,t.al.a(this.d),a.a,t.y,t.K)},
h1(a){var s,r=this,q=r.e,p=null,o=t.z,n=t.K,m=a.a,l=r.b.b
if(t.C.b(q))p=l.fn(l,q,m,a.b,o,n,t.l)
else p=l.br(l,t.w.a(q),m,o,n)
try{o=r.$ti.i("2/").a(p)
return o}catch(s){if(t.k.b(A.ad(s))){if((r.c&1)!==0)throw A.f(A.aB("The error handler of Future.then must return a value of the returned future's type","onError"))
throw A.f(A.aB("The error handler of Future.catchError must return a value of the future's type","onError"))}else throw s}}}
A.J.prototype={
co(a,b,c){var s,r,q,p=this.$ti
p.a3(c).i("1/(2)").a(a)
s=$.E
if(s===B.k){if(b!=null&&!t.C.b(b)&&!t.w.b(b))throw A.f(A.jT(b,"onError",u.c))}else{r=p.c
a=s.bo(s,c.i("@<0/>").a3(r).i("1(2)").a(a),c.i("0/"),r)
if(b!=null)b=A.nJ(b,s)}q=new A.J(s,c.i("J<0>"))
r=b==null?1:3
this.bb(new A.bd(q,r,a,b,p.i("@<1>").a3(c).i("bd<1,2>")))
return q},
dq(a,b,c){var s,r=this.$ti
r.a3(c).i("1/(2)").a(a)
s=new A.J($.E,c.i("J<0>"))
this.bb(new A.bd(s,19,a,b,r.i("@<1>").a3(c).i("bd<1,2>")))
return s},
cs(a){var s,r,q
t.fO.a(a)
s=this.$ti
r=$.E
q=new A.J(r,s)
if(r!==B.k)a=r.bn(r,a,t.z)
this.bb(new A.bd(q,8,a,null,s.i("bd<1,1>")))
return q},
fo(a){this.a=this.a&1|16
this.c=a},
bd(a){this.a=a.a&30|this.a&1
this.c=a.c},
bb(a){var s,r=this,q=r.a
if(q<=3){a.a=t.F.a(r.c)
r.c=a}else{if((q&4)!==0){s=t._.a(r.c)
if((s.a&24)===0){s.bb(a)
return}r.bd(s)}q=r.b
q.aX(q,new A.ht(r,a))}},
d9(a){var s,r,q,p,o,n,m=this,l={}
l.a=a
if(a==null)return
s=m.a
if(s<=3){r=t.F.a(m.c)
m.c=a
if(r!=null){q=a.a
for(p=a;q!=null;p=q,q=o)o=q.a
p.a=r}}else{if((s&4)!==0){n=t._.a(m.c)
if((n.a&24)===0){n.d9(a)
return}m.bd(n)}l.a=m.bq(a)
s=m.b
s.aX(s,new A.hx(l,m))}},
aW(){var s=t.F.a(this.c)
this.c=null
return this.bq(s)},
bq(a){var s,r,q
for(s=a,r=null;s!=null;r=s,s=q){q=s.a
s.a=r}return r},
cP(a){var s,r=this
r.$ti.c.a(a)
s=r.aW()
r.a=8
r.c=a
A.bR(r,s)},
eK(a){var s=this.aW()
this.bd(a)
A.bR(this,s)},
be(a){var s=this.aW()
this.fo(a)
A.bR(this,s)},
eJ(a,b){A.aU(a)
t.l.a(b)
this.be(new A.an(a,b))},
bL(a){var s=this.$ti
s.i("1/").a(a)
if(s.i("ap<1>").b(a)){this.cL(a)
return}this.eF(a)},
eF(a){var s,r=this
r.$ti.c.a(a)
r.a^=2
s=r.b
s.aX(s,new A.hv(r,a))},
cL(a){A.jl(this.$ti.i("ap<1>").a(a),this,!1)
return},
bc(a){var s
this.a^=2
s=this.b
s.aX(s,new A.hu(this,a))},
$iap:1}
A.ht.prototype={
$0(){A.bR(this.a,this.b)},
$S:0}
A.hx.prototype={
$0(){A.bR(this.b,this.a.a)},
$S:0}
A.hw.prototype={
$0(){A.jl(this.a.a,this.b,!0)},
$S:0}
A.hv.prototype={
$0(){this.a.cP(this.b)},
$S:0}
A.hu.prototype={
$0(){this.a.be(this.b)},
$S:0}
A.hA.prototype={
$0(){var s,r,q,p,o,n,m,l,k=this,j=null
try{q=k.a.a
p=q.b.b
j=p.bs(p,t.fO.a(q.d),t.z)}catch(o){s=A.ad(o)
r=A.bk(o)
if(k.c&&t.v.a(k.b.a.c).a===s){q=k.a
q.c=t.v.a(k.b.a.c)}else{q=s
p=r
if(p==null)p=A.iU(q)
n=k.a
n.c=new A.an(q,p)
q=n}q.b=!0
return}if(j instanceof A.J&&(j.a&24)!==0){if((j.a&16)!==0){q=k.a
q.c=t.v.a(j.c)
q.b=!0}return}if(j instanceof A.J){m=k.b.a
l=new A.J(m.b,m.$ti)
j.co(new A.hB(l,m),new A.hC(l),t.H)
q=k.a
q.c=l
q.b=!1}},
$S:0}
A.hB.prototype={
$1(a){this.a.eK(this.b)},
$S:7}
A.hC.prototype={
$2(a,b){A.aU(a)
t.l.a(b)
this.a.be(new A.an(a,b))},
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
r=A.bk(k)
q=s
p=r
if(p==null)p=A.iU(q)
o=this.a
o.c=new A.an(q,p)
o.b=!0}},
$S:0}
A.hy.prototype={
$0(){var s,r,q,p,o,n,m,l=this
try{s=t.v.a(l.a.a.c)
p=l.b
if(p.a.hf(s)&&p.a.e!=null){p.c=p.a.h1(s)
p.b=!1}}catch(o){r=A.ad(o)
q=A.bk(o)
p=t.v.a(l.a.a.c)
if(p.a===r){n=l.b
n.c=p
p=n}else{p=r
n=q
if(n==null)n=A.iU(p)
m=l.b
m.c=new A.an(p,n)
p=m}p.b=!0}},
$S:0}
A.eg.prototype={}
A.cY.prototype={
gk(a){var s={},r=new A.J($.E,t.fJ)
s.a=0
this.dX(new A.fw(s,this),!0,new A.fx(s,r),r.geI())
return r}}
A.fw.prototype={
$1(a){this.b.$ti.c.a(a);++this.a.a},
$S(){return this.b.$ti.i("~(1)")}}
A.fx.prototype={
$0(){var s=this.b,r=s.$ti,q=r.i("1/").a(this.a.a),p=s.aW()
r.c.a(q)
s.a=8
s.c=q
A.bR(s,p)},
$S:0}
A.dm.prototype={
gfa(){var s,r=this
if((r.b&8)===0)return A.n(r).i("aR<1>?").a(r.a)
s=A.n(r)
return s.i("aR<1>?").a(s.i("dn<1>").a(r.a).gc6())},
cU(){var s,r,q=this
if((q.b&8)===0){s=q.a
if(s==null)s=q.a=new A.aR(A.n(q).i("aR<1>"))
return A.n(q).i("aR<1>").a(s)}r=A.n(q)
s=r.i("dn<1>").a(q.a).gc6()
return r.i("aR<1>").a(s)},
gdk(){var s=this.a
if((this.b&8)!==0)s=t.fv.a(s).gc6()
return A.n(this).i("ci<1>").a(s)},
cK(){if((this.b&4)!==0)return new A.b8("Cannot add event after closing")
return new A.b8("Cannot add event while adding a stream")},
cT(){var s=this.c
if(s==null)s=this.c=(this.b&2)!==0?$.jJ():new A.J($.E,t.U)
return s},
ca(){var s=this,r=s.b
if((r&4)!==0)return s.cT()
if(r>=4)throw A.f(s.cK())
r=s.b=r|4
if((r&1)!==0)s.c1()
else if((r&3)===0)s.cU().m(0,B.y)
return s.cT()},
fu(a,b,c,d){var s,r,q,p,o,n,m,l,k,j,i=this,h=A.n(i)
h.i("~(1)?").a(a)
t.g5.a(c)
if((i.b&3)!==0)throw A.f(A.aD("Stream has already been listened to."))
s=h.c
r=$.E
q=d?1:0
p=b!=null?32:0
o=t.H
s=r.bo(r,t.a7.a3(s).i("1(2)").a(a),o,s)
A.my(r,b)
n=c==null?A.nX():c
m=t.O
l=new A.ci(i,s,r.bn(r,m.a(n),o),r,q|p,h.i("ci<1>"))
k=i.gfa()
if(((i.b|=1)&8)!==0){j=h.i("dn<1>").a(i.a)
j.sc6(l)
j.hm()}else i.a=l
l.fp(k)
h=m.a(new A.hW(i))
s=l.e
l.e=s|64
h.$0()
l.e&=4294967231
l.cN((s&4)!==0)
return l},
ff(a){var s,r,q,p,o,n,m,l,k=this,j=A.n(k)
j.i("e6<1>").a(a)
s=null
if((k.b&8)!==0)s=j.i("dn<1>").a(k.a).hy()
k.a=null
k.b=k.b&4294967286|2
r=k.r
if(r!=null)if(s==null)try{q=r.$0()
if(q instanceof A.J)s=q}catch(n){p=A.ad(n)
o=A.bk(n)
m=new A.J($.E,t.U)
j=A.aU(p)
l=t.l.a(o)
m.bc(new A.an(j,l))
s=m}else s=s.cs(r)
j=new A.hV(k)
if(s!=null)s=s.cs(j)
else j.$0()
return s},
$ik7:1,
$iko:1,
$ibQ:1,
$ik5:1}
A.hW.prototype={
$0(){A.jy(this.a.d)},
$S:0}
A.hV.prototype={
$0(){var s=this.a.c
if(s!=null&&(s.a&30)===0)s.bL(null)},
$S:0}
A.eh.prototype={
c0(a){var s=this.$ti
s.c.a(a)
this.gdk().cJ(new A.bP(a,s.i("bP<1>")))},
c1(){this.gdk().cJ(B.y)}}
A.cg.prototype={}
A.ch.prototype={
gW(a){return(A.cS(this.a)^892482866)>>>0},
E(a,b){if(b==null)return!1
if(this===b)return!0
return b instanceof A.ch&&b.a===this.a}}
A.ci.prototype={
d5(){return this.w.ff(this)},
d6(){var s=this.w,r=A.n(s)
r.i("e6<1>").a(this)
if((s.b&8)!==0)r.i("dn<1>").a(s.a).hC()
A.jy(s.e)},
d7(){var s=this.w,r=A.n(s)
r.i("e6<1>").a(this)
if((s.b&8)!==0)r.i("dn<1>").a(s.a).hm()
A.jy(s.f)}}
A.d4.prototype={
fp(a){var s=this
A.n(s).i("aR<1>?").a(a)
if(a==null)return
s.r=a
if(a.c!=null){s.e|=128
a.bG(s)}},
d6(){},
d7(){},
d5(){return null},
cJ(a){var s,r=this,q=r.r
if(q==null)q=r.r=new A.aR(A.n(r).i("aR<1>"))
q.m(0,a)
s=r.e
if((s&128)===0){s|=128
r.e=s
if(s<256)q.bG(r)}},
c0(a){var s,r=this,q=A.n(r).c
q.a(a)
s=r.e
r.e=s|64
r.d.ho(r.a,a,q)
r.e&=4294967231
r.cN((s&4)!==0)},
c1(){var s,r=this,q=new A.fT(r),p=r.e|=8
if((p&128)!==0){s=r.r
if(s.a===1)s.a=3}if((p&64)===0)r.r=null
p=r.f=r.d5()
r.e|=16
if(p!=null&&p!==$.jJ())p.cs(q)
else q.$0()},
cN(a){var s,r,q=this,p=q.e
if((p&128)!==0&&q.r.c==null){p=q.e=p&4294967167
s=!1
if((p&4)!==0)if(p<256){s=q.r
s=s==null?null:s.c==null
s=s!==!1}if(s){p&=4294967291
q.e=p}}for(;;a=r){if((p&8)!==0){q.r=null
return}r=(p&4)!==0
if(a===r)break
q.e=p^64
if(r)q.d6()
else q.d7()
p=q.e&=4294967231}if((p&128)!==0&&p<256)q.r.bG(q)},
$ie6:1,
$ibQ:1}
A.fT.prototype={
$0(){var s=this.a,r=s.e
if((r&16)===0)return
s.e=r|74
s.d.hn(s.c)
s.e&=4294967231},
$S:0}
A.dp.prototype={
dX(a,b,c,d){var s=this.$ti
s.i("~(1)?").a(a)
t.g5.a(c)
return this.a.fu(s.i("~(1)?").a(a),d,c,b===!0)},
hc(a){return this.dX(a,null,null,null)}}
A.by.prototype={
sb1(a){this.a=t.ev.a(a)},
gb1(){return this.a}}
A.bP.prototype={
dZ(a){this.$ti.i("bQ<1>").a(a).c0(this.b)}}
A.ek.prototype={
dZ(a){a.c1()},
gb1(){return null},
sb1(a){throw A.f(A.aD("No events after a done."))},
$iby:1}
A.aR.prototype={
bG(a){var s,r=this
r.$ti.i("bQ<1>").a(a)
s=r.a
if(s===1)return
if(s>=1){r.a=1
return}A.oo(new A.hS(r,a))
r.a=1},
m(a,b){var s=this,r=s.c
if(r==null)s.b=s.c=b
else{r.sb1(b)
s.c=b}}}
A.hS.prototype={
$0(){var s,r,q,p=this.a,o=p.a
p.a=0
if(o===3)return
s=p.$ti.i("bQ<1>").a(this.b)
r=p.b
q=r.gb1()
p.b=q
if(q==null)p.c=null
r.dZ(s)},
$S:0}
A.ex.prototype={}
A.fN.prototype={
hn(a){var s,r,q,p,o=this
t.O.a(a)
try{q=o.bs(o,a,t.H)
return q}catch(p){s=A.ad(p)
r=A.bk(p)
o.aV(o,s,r)}},
ho(a,b,c){var s,r,q,p,o=this
c.i("~(0)").a(a)
c.a(b)
try{q=o.br(o,a,b,t.H,c)
return q}catch(p){s=A.ad(p)
r=A.bk(p)
o.aV(o,s,r)}},
fE(a,b){return new A.fO(this,this.bn(this,b.i("0()").a(a),b),b)},
h(a,b){var s
while(!1){s=null.ghB(null).h(0,b)
return s}return null},
aV(a,b,c){var s,r,q,p,o,n,m,l
t.l.a(c)
s=null
if(s==null){A.nL(b,c)
return}r=s.gct()
q=r.ghx()
p=$.E
try{$.E=q
s.h0(r,r.gbX(),a,b,c)
$.E=p}catch(m){o=A.ad(m)
n=A.bk(m)
$.E=p
l=b===o?c:n
q.aV(r,o,l)}},
bs(a,b,c){var s,r,q
c.i("0()").a(b)
r=$.E
if(r===a)return b.$0()
s=r
$.E=a
try{r=b.$0()
return r}finally{$.E=s}q=null.gct()
return null.hz(q,q.gbX(),a,b)},
br(a,b,c,d,e){var s,r,q
d.i("@<0>").a3(e).i("1(2)").a(b)
e.a(c)
r=$.E
if(r===a)return b.$1(c)
s=r
$.E=a
try{r=b.$1(c)
return r}finally{$.E=s}q=null.gct()
return null.h0(q,q.gbX(),a,b,c)},
fn(a,b,c,d,e,f,g){var s,r,q
e.i("@<0>").a3(f).a3(g).i("1(2,3)").a(b)
f.a(c)
g.a(d)
r=$.E
if(r===a)return b.$2(c,d)
s=r
$.E=a
try{r=b.$2(c,d)
return r}finally{$.E=s}q=null.gct()
return null.hA(q,q.gbX(),a,b,c,d)},
bn(a,b,c){c.i("0()").a(b)
return b},
bo(a,b,c,d){c.i("@<0>").a3(d).i("1(2)").a(b)
return b},
bZ(a,b,c,d,e){c.i("@<0>").a3(d).a3(e).i("1(2,3)").a(b)
return b},
eU(a,b,c){return null},
aX(a,b){A.jx(a,t.O.a(b))
return}}
A.fO.prototype={
$0(){var s=this.a
return s.bs(s,this.b,this.c)},
$S(){return this.c.i("0()")}}
A.ip.prototype={
$0(){A.lP(this.a,this.b)},
$S:0}
A.bf.prototype={
gD(a){var s=this,r=new A.d6(s,s.r,A.n(s).i("d6<1>"))
r.c=s.e
return r},
gk(a){return this.a},
aq(a,b){var s,r
if(typeof b=="string"&&b!=="__proto__"){s=this.b
if(s==null)return!1
return t.Q.a(s[b])!=null}else if(typeof b=="number"&&(b&1073741823)===b){r=this.c
if(r==null)return!1
return t.Q.a(r[b])!=null}else return this.eM(b)},
eM(a){var s=this.d
if(s==null)return!1
return this.bk(s[this.bf(a)],a)>=0},
ga6(a){var s=this.e
if(s==null)throw A.f(A.aD("No elements"))
return A.n(this).c.a(s.a)},
m(a,b){var s,r,q=this
A.n(q).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){s=q.b
return q.cI(s==null?q.b=A.jn():s,b)}else if(typeof b=="number"&&(b&1073741823)===b){r=q.c
return q.cI(r==null?q.c=A.jn():r,b)}else return q.eB(b)},
eB(a){var s,r,q,p=this
A.n(p).c.a(a)
s=p.d
if(s==null)s=p.d=A.jn()
r=p.bf(a)
q=s[r]
if(q==null)s[r]=[p.bW(a)]
else{if(p.bk(q,a)>=0)return!1
q.push(p.bW(a))}return!0},
K(a,b){var s=this
if(typeof b=="string"&&b!=="__proto__")return s.dc(s.b,b)
else if(typeof b=="number"&&(b&1073741823)===b)return s.dc(s.c,b)
else return s.fh(b)},
fh(a){var s,r,q,p,o=this,n=o.d
if(n==null)return!1
s=o.bf(a)
r=n[s]
q=o.bk(r,a)
if(q<0)return!1
p=r.splice(q,1)[0]
if(0===r.length)delete n[s]
o.dw(p)
return!0},
eY(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("r(1)").a(a)
s=n.e
for(m=m.c;s!=null;s=q){r=m.a(s.a)
q=s.b
p=n.r
o=a.$1(r)
if(p!==n.r)throw A.f(A.ao(n))
if(!0===o)n.K(0,r)}},
cI(a,b){A.n(this).c.a(b)
if(t.Q.a(a[b])!=null)return!1
a[b]=this.bW(b)
return!0},
dc(a,b){var s
if(a==null)return!1
s=t.Q.a(a[b])
if(s==null)return!1
this.dw(s)
delete a[b]
return!0},
bU(){this.r=this.r+1&1073741823},
bW(a){var s,r=this,q=new A.es(A.n(r).c.a(a))
if(r.e==null)r.e=r.f=q
else{s=r.f
s.toString
q.c=s
r.f=s.b=q}++r.a
r.bU()
return q},
dw(a){var s=this,r=a.c,q=a.b
if(r==null)s.e=q
else r.b=q
if(q==null)s.f=r
else q.c=r;--s.a
s.bU()},
bf(a){return J.am(a)&1073741823},
bk(a,b){var s,r
if(a==null)return-1
s=a.length
for(r=0;r<s;++r)if(J.m(a[r].a,b))return r
return-1}}
A.bS.prototype={
bf(a){return A.iE(a)&1073741823},
bk(a,b){var s,r,q
if(a==null)return-1
s=a.length
for(r=0;r<s;++r){q=a[r].a
if(q==null?b==null:q===b)return r}return-1}}
A.es.prototype={}
A.d6.prototype={
gA(){var s=this.d
return s==null?this.$ti.c.a(s):s},
u(){var s=this,r=s.c,q=s.a
if(s.b!==q.r)throw A.f(A.ao(q))
else if(r==null){s.d=null
return!1}else{s.d=s.$ti.i("1?").a(r.a)
s.c=r.b
return!0}},
$ia0:1}
A.w.prototype={
gD(a){return new A.bK(a,this.gk(a),A.aJ(a).i("bK<w.E>"))},
ai(a,b){return this.h(a,b)},
gR(a){return this.gk(a)===0},
gck(a){return!this.gR(a)},
ga6(a){if(this.gk(a)===0)throw A.f(A.aq())
return this.h(a,0)},
gad(a){if(this.gk(a)===0)throw A.f(A.aq())
return this.h(a,this.gk(a)-1)},
gae(a){if(this.gk(a)===0)throw A.f(A.aq())
if(this.gk(a)>1)throw A.f(A.j0())
return this.h(a,0)},
ap(a,b){var s,r
A.aJ(a).i("r(w.E)").a(b)
s=this.gk(a)
for(r=0;r<s;++r){if(b.$1(this.h(a,r)))return!0
if(s!==this.gk(a))throw A.f(A.ao(a))}return!1},
am(a,b){return A.fy(a,b,null,A.aJ(a).i("w.E"))},
m(a,b){var s
A.aJ(a).i("w.E").a(b)
s=this.gk(a)
this.sk(a,s+1)
this.t(a,s,b)},
T(a,b,c,d){var s,r,q=A.aJ(a)
q.i("w.E?").a(d)
s=d==null?q.i("w.E").a(d):d
A.bt(b,c,this.gk(a))
for(r=b;r<c;++r)this.t(a,r,s)},
M(a,b,c,d,e){var s,r,q,p,o
A.aJ(a).i("k<w.E>").a(d)
A.bt(b,c,this.gk(a))
s=c-b
if(s===0)return
A.aO(e,"skipCount")
if(t.j.b(d)){r=e
q=d}else{q=J.lD(d,e).cp(0,!1)
r=0}p=J.M(q)
if(r+s>p.gk(q))throw A.f(A.lT())
if(r<b)for(o=s-1;o>=0;--o)this.t(a,b+o,p.h(q,r+o))
else for(o=0;o<s;++o)this.t(a,b+o,p.h(q,r+o))},
H(a,b,c,d){return this.M(a,b,c,d,0)},
ef(a,b,c){A.aJ(a).i("k<w.E>").a(c)
this.H(a,b,b+c.length,c)},
p(a){return A.j1(a,"[","]")}}
A.H.prototype={
aI(a,b){var s,r,q,p=A.n(this)
p.i("~(H.K,H.V)").a(b)
for(s=this.gar(),s=s.gD(s),p=p.i("H.V");s.u();){r=s.gA()
q=this.h(0,r)
b.$2(r,q==null?p.a(q):q)}},
ah(a,b){A.n(this).i("ag<H.K,H.V>").a(b).aI(0,new A.fc(this))},
bA(a,b){var s,r,q,p,o,n=this,m=A.n(n)
m.i("r(H.K,H.V)").a(b)
s=A.i([],m.i("y<H.K>"))
for(r=n.gar(),r=r.gD(r),m=m.i("H.V");r.u();){q=r.gA()
p=n.h(0,q)
if(b.$2(q,p==null?m.a(p):p))B.b.m(s,q)}for(m=s.length,o=0;o<s.length;s.length===m||(0,A.V)(s),++o)n.K(0,s[o])},
gk(a){var s=this.gar()
return s.gk(s)},
gR(a){var s=this.gar()
return s.gR(s)},
p(a){return A.k0(this)},
$iag:1}
A.fc.prototype={
$2(a,b){var s=this.a,r=A.n(s)
s.t(0,r.i("H.K").a(a),r.i("H.V").a(b))},
$S(){return A.n(this.a).i("~(H.K,H.V)")}}
A.fd.prototype={
$2(a,b){var s,r=this.a
if(!r.a)this.b.a+=", "
r.a=!1
r=this.b
s=A.v(a)
r.a=(r.a+=s)+": "
s=A.v(b)
r.a+=s},
$S:68}
A.b6.prototype={
ah(a,b){var s
A.n(this).i("k<1>").a(b)
for(s=b.gD(b);s.u();)this.m(0,s.gA())},
p(a){return A.j1(this,"{","}")},
am(a,b){return A.k6(this,b,A.n(this).c)},
$io:1,
$ik:1,
$iaY:1}
A.dk.prototype={}
A.eq.prototype={
h(a,b){var s,r=this.b
if(r==null)return this.c.h(0,b)
else if(typeof b!="string")return null
else{s=r[b]
return typeof s=="undefined"?this.fb(b):s}},
gk(a){return this.b==null?this.c.a:this.aK().length},
gR(a){return this.gk(0)===0},
gar(){if(this.b==null){var s=this.c
return new A.W(s,A.n(s).i("W<1>"))}return new A.er(this)},
t(a,b,c){var s,r,q=this
A.K(b)
if(q.b==null)q.c.t(0,b,c)
else if(q.aG(b)){s=q.b
s[b]=c
r=q.a
if(r==null?s!=null:r!==s)r[b]=null}else q.dA().t(0,b,c)},
ah(a,b){t.P.a(b).aI(0,new A.hL(this))},
aG(a){if(this.b==null)return this.c.aG(a)
if(typeof a!="string")return!1
return Object.prototype.hasOwnProperty.call(this.a,a)},
K(a,b){if(this.b!=null&&!this.aG(b))return null
return this.dA().K(0,b)},
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
if(s!==o.c)throw A.f(A.ao(o))}},
aK(){var s=t.bF.a(this.c)
if(s==null)s=this.c=A.i(Object.keys(this.a),t.s)
return s},
dA(){var s,r,q,p,o,n=this
if(n.b==null)return n.c
s=A.ab(t.N,t.z)
r=n.aK()
for(q=0;p=r.length,q<p;++q){o=r[q]
s.t(0,o,n.h(0,o))}if(p===0)B.b.m(r,"")
else B.b.l(r)
n.a=n.b=null
return n.c=s},
fb(a){var s
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
s=A.ie(this.a[a])
return this.b[a]=s}}
A.hL.prototype={
$2(a,b){this.a.t(0,A.K(a),b)},
$S:76}
A.er.prototype={
gk(a){return this.a.gk(0)},
ai(a,b){var s=this.a
if(s.b==null)s=s.gar().ai(0,b)
else{s=s.aK()
if(!(b>=0&&b<s.length))return A.a(s,b)
s=s[b]}return s},
gD(a){var s=this.a
if(s.b==null){s=s.gar()
s=s.gD(s)}else{s=s.aK()
s=new J.bF(s,s.length,A.a1(s).i("bF<1>"))}return s}}
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
A.c7.prototype={}
A.dG.prototype={}
A.dH.prototype={}
A.dS.prototype={
dP(a,b){var s=A.nF(a,this.gfR().a)
return s},
gfR(){return B.a8}}
A.f5.prototype={}
A.ed.prototype={
fJ(a){t.L.a(a)
return B.bi.fG(a)}}
A.fK.prototype={
fG(a){return new A.i4(this.a).eN(t.L.a(a),0,null,!0)}}
A.i4.prototype={
eN(a,b,c,d){var s,r,q,p,o,n,m,l=this
t.L.a(a)
s=A.bt(b,c,a.length)
if(b===s)return""
if(a instanceof Uint8Array){r=a
q=r
p=0}else{q=A.mX(a,b,s)
s-=b
p=b
b=0}if(s-b>=15){o=l.a
n=A.mW(o,q,b,s)
if(n!=null){if(!o)return n
if(n.indexOf("\ufffd")<0)return n}}n=l.bO(q,b,s,!0)
o=l.b
if((o&1)!==0){m=A.mY(o)
l.b=0
throw A.f(A.dJ(m,a,p+l.c))}return n},
bO(a,b,c,d){var s,r,q=this
if(c-b>1000){s=B.a.I(b+c,2)
r=q.bO(a,b,s,!1)
if((q.b&1)!==0)return r
return r+q.bO(a,s,c,d)}return q.fL(a,b,c,d)},
fL(a,b,a0,a1){var s,r,q,p,o,n,m,l,k=this,j="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFFFFFFFFFFFFFFFFGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHIHHHJEEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKCCCCCCCCCCCCDCLONNNMEEEEEEEEEEE",i=" \x000:XECCCCCN:lDb \x000:XECCCCCNvlDb \x000:XECCCCCN:lDb AAAAA\x00\x00\x00\x00\x00AAAAA00000AAAAA:::::AAAAAGG000AAAAA00KKKAAAAAG::::AAAAA:IIIIAAAAA000\x800AAAAA\x00\x00\x00\x00 AAAAA",h=65533,g=k.b,f=k.c,e=new A.cd(""),d=b+1,c=a.length
if(!(b>=0&&b<c))return A.a(a,b)
s=a[b]
A:for(r=k.a;;){for(;;d=o){if(!(s>=0&&s<256))return A.a(j,s)
q=j.charCodeAt(s)&31
f=g<=32?s&61694>>>q:(s&63|f<<6)>>>0
p=g+q
if(!(p>=0&&p<144))return A.a(i,p)
g=i.charCodeAt(p)
if(g===0){p=A.cT(f)
e.a+=p
if(d===a0)break A
break}else if((g&1)!==0){if(r)switch(g){case 69:case 67:p=A.cT(h)
e.a+=p
break
case 65:p=A.cT(h)
e.a+=p;--d
break
default:p=A.cT(h)
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
p=A.cT(a[l])
e.a+=p}else{p=A.mj(a,d,n)
e.a+=p}if(n===a0)break A
d=o}else d=o}if(a1&&g>32)if(r){c=A.cT(h)
e.a+=c}else{k.b=77
k.c=a0
return""}k.b=g
k.c=f
c=e.a
return c.charCodeAt(0)==0?c:c}}
A.h9.prototype={
p(a){return this.eT()}}
A.L.prototype={
gaS(){return A.ma(this)}}
A.cx.prototype={
p(a){var s=this.a
if(s!=null)return"Assertion failed: "+A.eU(s)
return"Assertion failed"}}
A.bb.prototype={}
A.aW.prototype={
gbR(){return"Invalid argument"+(!this.a?"(s)":"")},
gbQ(){return""},
p(a){var s=this,r=s.c,q=r==null?"":" ("+r+")",p=s.d,o=p==null?"":": "+A.v(p),n=s.gbR()+q+o
if(!s.a)return n
return n+s.gbQ()+": "+A.eU(s.gcg())},
gcg(){return this.b}}
A.b5.prototype={
gcg(){return A.kz(this.b)},
gbR(){return"RangeError"},
gbQ(){var s,r=this.e,q=this.f
if(r==null)s=q!=null?": Not less than or equal to "+A.v(q):""
else if(q==null)s=": Not greater than or equal to "+A.v(r)
else if(q>r)s=": Not in inclusive range "+A.v(r)+".."+A.v(q)
else s=q<r?": Valid value range is empty":": Only valid value is "+A.v(r)
return s}}
A.dK.prototype={
gcg(){return A.j(this.b)},
gbR(){return"RangeError"},
gbQ(){if(A.j(this.b)<0)return": index must not be negative"
var s=this.f
if(s===0)return": no indices are valid"
return": index should be less than "+s},
$ib5:1,
gk(a){return this.f}}
A.d1.prototype={
p(a){return"Unsupported operation: "+this.a}}
A.eb.prototype={
p(a){return"UnimplementedError: "+this.a}}
A.b8.prototype={
p(a){return"Bad state: "+this.a}}
A.dF.prototype={
p(a){var s=this.a
if(s==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.eU(s)+"."}}
A.e_.prototype={
p(a){return"Out of Memory"},
gaS(){return null},
$iL:1}
A.cX.prototype={
p(a){return"Stack Overflow"},
gaS(){return null},
$iL:1}
A.ha.prototype={
p(a){return"Exception: "+this.a}}
A.a_.prototype={
p(a){var s,r,q,p,o,n,m,l,k,j,i,h=this.a,g=""!==h?"FormatException: "+h:"FormatException",f=this.c,e=this.b
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
k=""}return g+l+B.p.bI(e,i,j)+k+"\n"+B.p.a8(" ",f-i+l.length)+"^\n"}else return f!=null?g+(" (at offset "+A.v(f)+")"):g}}
A.k.prototype={
ap(a,b){var s
A.n(this).i("r(k.E)").a(b)
for(s=this.gD(this);s.u();)if(b.$1(s.gA()))return!0
return!1},
cp(a,b){var s=A.n(this).i("k.E")
if(b)s=A.aM(this,s)
else{s=A.aM(this,s)
s.$flags=1
s=s}return s},
gk(a){var s,r=this.gD(this)
for(s=0;r.u();)++s
return s},
gR(a){return!this.gD(this).u()},
gck(a){return!this.gR(this)},
am(a,b){return A.k6(this,b,A.n(this).i("k.E"))},
ga6(a){var s=this.gD(this)
if(!s.u())throw A.f(A.aq())
return s.gA()},
gad(a){var s,r=this.gD(this)
if(!r.u())throw A.f(A.aq())
do s=r.gA()
while(r.u())
return s},
gae(a){var s,r=this.gD(this)
if(!r.u())throw A.f(A.aq())
s=r.gA()
if(r.u())throw A.f(A.j0())
return s},
ai(a,b){var s,r
A.aO(b,"index")
s=this.gD(this)
for(r=b;s.u();){if(r===0)return s.gA();--r}throw A.f(A.iY(b,b-r,this,"index"))},
p(a){return A.lU(this,"(",")")}}
A.bp.prototype={
p(a){return"MapEntry("+A.v(this.a)+": "+A.v(this.b)+")"}}
A.Y.prototype={
gW(a){return A.d.prototype.gW.call(this,0)},
p(a){return"null"}}
A.d.prototype={$id:1,
E(a,b){return this===b},
gW(a){return A.cS(this)},
p(a){return"Instance of '"+A.e1(this)+"'"},
gX(a){return A.iu(this)},
toString(){return this.p(this)}}
A.ey.prototype={
p(a){return""},
$iau:1}
A.fv.prototype={
gcf(){var s,r=this.b
if(r==null)r=$.jd.$0()
s=r-this.a
if($.jK()===1e6)return s
return s*1000}}
A.cd.prototype={
gk(a){return this.a.length},
p(a){var s=this.a
return s.charCodeAt(0)==0?s:s}}
A.fi.prototype={
p(a){return"Promise was rejected with a value of `"+(this.a?"undefined":"null")+"`."}}
A.f_.prototype={
$2(a,b){var s=t.g
this.a.co(new A.eY(s.a(a)),new A.eZ(s.a(b)),t.X)},
$S:17}
A.eY.prototype={
$1(a){var s=this.a
s.call(s,a)
return a},
$S:18}
A.eZ.prototype={
$2(a,b){var s=A.n9(A.aU(a),t.l.a(b)),r=this.a
r.call(r,s)
return s},
$S:19}
A.iF.prototype={
$1(a){var s=this.a,r=s.$ti
a=r.i("1/?").a(this.b.i("0/?").a(a))
s=s.a
if((s.a&30)!==0)A.x(A.aD("Future already completed"))
s.bL(r.i("1/").a(a))
return null},
$S:4}
A.iG.prototype={
$1(a){if(a==null)return this.a.dN(new A.fi(a===undefined))
return this.a.dN(a)},
$S:4}
A.f0.prototype={
fK(a,b,c,d){var s
t.L.a(a)
s=A.jc(32768)
this.fP(A.iZ(a,B.o,null,null),s,b,!0,!1)
return s.b5()},
fP(a,b,c,d,e){return A.o2(b,c,new A.f1(a,!1,!0))}}
A.f1.prototype={
$1(a){return B.R.fO(this.a,a,this.c,this.b)},
$S:20}
A.hD.prototype={
fQ(a,b,c,d,e){var s,r,q,p=d===!0,o=a.a
a.a=B.o
r=p
s=r
try{q=A.l1("gzip",!1,p,new A.hE(this,a,b,!1,!1,s))
return q}finally{a.sdK(o)}},
fO(a,b,c,d){return this.fQ(a,b,!1,c,d)},
eP(a,b,c,d,e){var s,r,q,p,o,n=0
for(;;){s=a.c
r=a.d
r===$&&A.D()
if(!(s<r))break
if(!this.fe(a,e)){if(n!==0)return!1
a.c=s
return B.S.fN(a,b,!1,!1)}q=b.gk(b)
p=new A.dL(a,b,!0)
p.d0()
if(!p.f)return!1
s=a.b
if((s==null?0:s.length-a.c)<8)return!1
a.b2()
o=a.b2()
b.dT()
if(B.a.N(b.gk(b)-q,4294967296)!==o)return!1;++n}return n!==0},
fe(a,b){var s,r,q,p,o,n,m,l,k,j,i
if(a.gk(0)<10)return!1
s=a.c
if(a.bz()!==35615)return!1
if(a.ak()!==8)return!1
r=a.ak()
if(b&&(r&224)!==0)return!1
a.b2()
a.ak()
a.ak()
if((r&4)!==0){if(a.gk(0)<2)return!1
q=a.bz()
if(a.gk(0)<q)return!1
a.e1(q)}if((r&8)!==0)if(!this.dh(a))return!1
if((r&16)!==0)if(!this.dh(a))return!1
if((r&2)!==0){if(a.gk(0)<2)return!1
if(b){p=a.bz()
o=a.bH(a.c-s-2,s)
n=0
for(;;){m=o.c
l=o.d
l===$&&A.D()
if(!(m<l))break
l=o.b
k=l==null
if((k?0:l.length-m)<8192)j=k?0:l.length-m
else j=8192
i=o.bH(j,m)
m=o.c
l=i.b
o.c=m+(l==null?0:l.length-i.c)
n=A.o7(i.hp(),n)}if((n&65535)!==p)throw A.f(A.lE("Invalid gzip header checksum"))}else a.bz()}return!0},
dh(a){var s,r
for(;;){s=a.c
r=a.d
r===$&&A.D()
if(!(s<r))break
r=a.b
r.toString
a.c=s+1
if(!(s>=0&&s<r.length))return A.a(r,s)
if(r[s]===0)return!0}return!1}}
A.hE.prototype={
$0(){var s=this
return s.a.eP(s.b,s.c,s.d,s.e,s.f)},
$S:11}
A.f2.prototype={
en(a1,a2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=this,a0=a1.length
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
if(l<0)throw A.f(B.a4)}if(l>0)q=r>(a2?0:1)
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
A.fM.prototype={}
A.i8.prototype={
fN(a,b,c,d){var s,r=!1,q=a.a
a.a=B.r
try{s=A.l1("zlib",!1,r,new A.i9(this,a,b,!1,!1))
return s}finally{a.sdK(q)}},
er(a,b,c,d){var s,r,q,p,o,n,m=a.c,l=a.d
l===$&&A.D()
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
if(B.a.N(q*256+p,31)!==0)return!1
if((p>>>5&1)!==0){a.b2()
return!1}m=new A.bM(new Uint8Array(32768),B.o)
o=new A.dL(a,m,!0)
o.d0()
n=o.c.b5()
if(!o.f){b.al(n)
return!1}m=a.b
if((m==null?0:m.length-a.c)<4){b.al(n)
return!1}a.b2()
break A}if(n!=null)b.al(n)
return!0}}
A.i9.prototype={
$0(){var s=this
return s.a.er(s.b,s.c,s.d,s.e)},
$S:11}
A.dL.prototype={
gag(){var s=this.a
if(s==null)return s
s.d===$&&A.D()
return s},
d0(){var s,r,q,p=this
p.w=p.r=0
if(p.gag()==null)return
s=p.c
if(!(s instanceof A.bM)){p.d=s
p.c=A.jc(32768)}try{for(;;){r=p.gag()
q=r.c
r=r.d
r===$&&A.D()
if(!(q<r))break
if(!p.f7())return
p.cS(32768)}}finally{p.cS(0)
p.c=s
p.d=null}},
cS(a){var s,r,q,p,o=this.d
if(o==null)return
s=t.bl.a(this.c)
r=s.b-a
if(r<(a===0?1:1048576))return
q=s.b5()
o.al(A.bv(q,0,r))
p=A.jc(2097152)
p.al(A.bv(q,r,null))
this.c=p},
f7(){var s,r,q,p=this,o=p.gag()
if(o!=null){s=o.c
r=o.d
r===$&&A.D()
r=s>=r
s=r}else s=!0
if(s)return!1
q=p.aa(3)
s=(q&1)===0
switch(B.a.L(q,1)){case 0:if(p.f9()===-1)return!1
break
case 1:if(p.cQ($.la(),$.l9())===-1)return!1
break
case 2:if(p.f8()===-1)return!1
break
default:return!1}if(!s)p.f=!0
return s},
aa(a){var s,r,q,p,o=this
if(a===0)return 0
while(s=o.w,s<a){s=o.gag()
r=s.c
s=s.d
s===$&&A.D()
if(r>=s)return-1
s=o.gag()
r=s.b
r.toString
s=s.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
q=r[s]
s=o.r
r=o.w
o.r=(s|B.a.a9(q,r))>>>0
o.w=r+8}r=o.r
p=B.a.fq(1,a)
o.r=B.a.c2(r,a)
o.w=s-a
return(r&p-1)>>>0},
bY(a){var s,r,q,p,o,n,m=this,l=a.a
l===$&&A.D()
s=a.b
while(m.w<s){r=m.gag()
q=r.c
r=r.d
r===$&&A.D()
if(q>=r)break
r=m.gag()
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
f9(){var s,r,q=this
q.w=q.r=0
s=q.aa(16)
if(s!==(q.aa(16)^65535)>>>0)return-1
if(s>q.gag().gk(0))return-1
r=q.gag().e1(s)
q.c.bD(r)
return 0},
f8(){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=g.aa(5)
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
n=B.ab[p]
if(!(n<19))return A.a(q,n)
q[n]=o}m=g.dm(q,!0)
if(m==null)return-1
n=f+s
l=new Uint8Array(n)
k=J.c4(B.d.gab(l),0,f)
j=J.c4(B.d.gab(l),f,s)
if(g.f1(n,m,l)===-1)return-1
i=g.dl(k)
n=i==null
h=n?null:g.dl(j)
if(n||h==null)return-1
return g.cQ(i,h)},
dm(a,b){var s,r
t.L.a(a)
try{s=A.iX(a,b)
return s}catch(r){if(A.ad(r) instanceof A.a_)throw r
else throw r}},
dl(a){return this.dm(a,!1)},
cQ(a,b){var s,r,q,p,o,n,m,l,k,j=this
for(;;){s=j.bY(a)
if(s<0||s>285)return-1
if(s===256)break
if(s<256){j.c.bC(s&255)
continue}r=s-257
if(!(r>=0&&r<31))return A.a(B.C,r)
q=j.aa(B.C[r])
if(q<0)return-1
if(!(r<29))return A.a(B.B,r)
p=B.B[r]
o=j.bY(b)
if(o<0||o>29)return-1
if(!(o>=0&&o<30))return A.a(B.z,o)
n=j.aa(B.z[o])
if(n<0)return-1
m=B.ad[o]+n
if(m>=1){l=j.c
l=m>l.gk(l)}else l=!0
if(l)return-1
j.c.bB(m,p+q)}while(p=j.w,p>=8){j.w=p-8
p=j.gag()
l=p.c
if(1>=l)p.c=0
else{k=p.d
k===$&&A.D()
if(1<=l-k)p.c=k
else p.c=l-1}}return 0},
f1(a,b,c){var s,r,q,p,o,n,m,l,k=this
for(s=0,r=0;r<a;){q=k.bY(b)
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
A.dT.prototype={
ba(a){var s=this.c
if((this.d+=a)>s){this.e=!0
throw A.f(A.iT("The decoded data is larger than the "+s+" bytes allowed"))}},
gk(a){return this.b.b},
dT(){return null},
bC(a){this.ba(1)
this.b.bC(a)},
aQ(a,b){t.L.a(a)
this.ba(a.length)
this.b.aQ(a,b)},
al(a){return this.aQ(a,null)},
bD(a){this.ba(a.gk(0))
this.b.bD(a)},
bB(a,b){this.ba(b)
this.b.bB(a,b)},
aB(a,b){return this.b.aB(a,b)},
b8(a){return this.aB(a,null)}}
A.c5.prototype={}
A.cw.prototype={}
A.dB.prototype={}
A.cy.prototype={
eT(){return"ByteOrder."+this.b}}
A.fu.prototype={
gk(a){return this.c},
aQ(a,b){var s
t.L.a(a)
s=A.bv(a,0,a.length)
this.bP(s)},
al(a){return this.aQ(a,null)},
bC(a){var s,r,q,p=this
if(p.r!=null)p.bP(new Uint8Array(A.T(A.i([a],t.t))))
else{++p.c
s=p.e
r=p.f
q=r+1
p.f=q
s.$flags&2&&A.h(s)
if(!(r>=0&&r<65536))return A.a(s,r)
s[r]=a
if(q===65536)p.bM()}},
bD(a){var s,r,q,p=a.c,o=new Uint8Array(65536)
try{for(;;){r=a.c
q=a.d
q===$&&A.D()
if(!(r<q))break
s=a.hj(o,0,J.aj(o))
r=s
if(typeof r!=="number")return r.hw()
if(r<=0)break
this.bP(A.bv(o,0,s))}}finally{a.c=A.j(p)}},
bP(a){var s,r,q,p,o,n,m=this,l=a.length
if(l===0)return
m.c+=l
s=m.r
if(s!=null)s.$1(a)
if(l>=65536){m.bM()
for(s=m.b,r=0;r<l;r=q){q=r+65536
s.m(0,new Uint8Array(A.T(A.bv(a,r,q<l?q:l))))}return}for(s=m.e,r=0;r<l;){p=m.f
o=65536-p
n=l-r
if(o>n)o=n
B.d.M(s,p,p+o,a,r)
r+=o
if((m.f+=o)===65536)m.bM()}},
bM(){var s=this,r=s.f
if(r===0)return
s.b.m(0,new Uint8Array(A.T(A.bv(s.e,0,r))))
s.f=0},
aB(a,b){return A.x(A.aF("a streamed result cannot be read back"))},
b8(a){return this.aB(a,null)}}
A.h7.prototype={}
A.dM.prototype={
gk(a){var s=this.b
return s==null?0:s.length-this.c},
h(a,b){var s,r
A.j(b)
s=this.b
r=this.c+b
if(!(r>=0&&r<s.length))return A.a(s,r)
return s[r]},
bH(a,b){var s,r=this,q=r.b
if(q==null)return A.iZ(A.i([],t.t),B.o,null,null)
if(b==null)b=r.c
if(a==null){s=r.d
s===$&&A.D()
a=s-b}return A.iZ(q,r.a,a,b)},
ak(){var s,r=this.b
r.toString
s=this.c++
if(!(s>=0&&s<r.length))return A.a(r,s)
return r[s]},
hj(a,b,c){var s,r,q,p=this.b
if(p==null)return 0
s=p.length
r=this.c
q=s-r
q=c>q?q:c
if(q<=0)return 0
B.d.M(a,b,b+q,p,r)
this.c+=q
return q},
hp(){var s,r,q,p,o=this,n=o.b
if(n==null)return new Uint8Array(0)
s=o.gk(0)
r=n.length
q=o.c
p=r-q
if(s<0||s>p)s=p
if(q<0)throw A.f(A.al(q,0,r,"position",null))
return J.c4(B.d.gab(n),o.b.byteOffset+o.c,s)}}
A.dN.prototype={
bz(){var s=this.ak(),r=this.ak()
if(this.a===B.r)return(s<<8|r)>>>0
return(r<<8|s)>>>0},
b2(){var s=this,r=s.ak(),q=s.ak(),p=s.ak(),o=s.ak()
if(s.a===B.r)return(r<<24|q<<16|p<<8|o)>>>0
return(o<<24|p<<16|q<<8|r)>>>0},
e1(a){var s=this,r=s.bH(a,s.c)
s.c=s.c+r.gk(0)
return r},
sdK(a){this.a=t.fA.a(a)}}
A.bM.prototype={
dT(){},
b5(){return J.c4(B.d.gab(this.c),this.c.byteOffset,this.b)},
bC(a){var s,r,q=this
if(q.b===q.c.length)q.eW()
s=q.c
r=q.b++
s.$flags&2&&A.h(s)
if(!(r>=0&&r<s.length))return A.a(s,r)
s[r]=a},
aQ(a,b){var s,r,q,p,o=this
t.L.a(a)
b=a.length
while(s=o.b,r=s+b,q=o.c,p=q.length,r>p)o.bj(r-p)
B.d.H(q,s,r,a)
o.b+=b},
al(a){return this.aQ(a,null)},
bD(a){var s,r,q,p,o,n,m=this
for(;;){s=m.b
r=a.b
q=r==null
p=q?0:r.length-a.c
o=m.c
n=o.length
if(!(s+p>n))break
m.bj(s+(q?0:r.length-a.c)-n)}if(!q)B.d.M(o,s,s+a.gk(0),r,a.c)
m.b=m.b+a.gk(0)},
bB(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
while(s=i.b,r=s+b,q=i.c,p=q.length,r>p)i.bj(r-p)
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
return J.c4(B.d.gab(s.c),s.c.byteOffset+a,b-a)},
b8(a){return this.aB(a,null)},
bj(a){var s,r=this.c,q=r.length,p=q+(a==null?1:a),o=q===0?32768:q*2
if(o<p)o=p
s=new Uint8Array(o)
B.d.H(s,0,q,r)
this.c=s},
eW(){return this.bj(null)},
gk(a){return this.b}}
A.bs.prototype={
bB(a,b){var s,r=this
for(s=-a;b>a;){r.al(r.b8(s))
b-=a}if(b===a)r.al(r.b8(s))
else r.al(r.aB(s,b-a))},
b5(){return this.aB(0,this.gk(this))}}
A.ev.prototype={}
A.eP.prototype={
h3(a,b){var s,r,q,p,o,n,m,l
if(b<=0)return!1
s=this.w.h(0,a)
r=s!=null
if(r&&s.a>=b)return!0
q=this.ax.h(0,a)
if(q!=null&&q.x&&q.f===b&&q.y>=b)return!0
for(p=this.y,o=0,n=0;n<b;++n){if(!(r&&s.aq(0,n))){m=p.h(0,new A.F(a,B.a.I(n,4)))
if(m==null)m=null
else{l=n-m.c
m=l>=0&&l<4&&m.d[l]!==255}m=m===!0}else m=!0
if(m)++o
else break}return o>=b},
eg(a){var s=a==null||a.length===0?null:a
if(s==this.a)return
this.cb()
this.a=s},
cw(){this.cx=0
if(this.CW.length>65536)this.CW=new Uint8Array(65536)},
e6(a,b,c,d,e,f,g,h){var s,r,q,p,o,n,m=this
m.at=null
s=h*e*4
if(d<0||d>=g||b.length<s)return!1
r=new A.F(c,B.a.I(d,4))
q=m.y
p=q.K(0,r)
if(p!=null){q.t(0,r,p)
if(p.a===h&&p.b===e&&p.aq(0,d)){p.hi(d,b,a)
m.at=p.fH(d)
return!0}}if(a!=null){a.a=null
a.b=-1}o=new A.F(c,d)
q=m.r
n=q.K(0,o)
if(n!=null){q.t(0,o,n)
q=n.a
if(m.cR(q,0,q.length,n.b,b,s)){m.at=n.c
return!0}m.bp(o)}return!1},
hu(a,b,c,d,e,f,g){return this.e6(null,a,b,c,d,e,f,g)},
e_(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f=this,e=a0*c
if(b<0||b>=d||e>65536||e<256||f.b<=0)return!1
s=B.a.I(b,4)*4
r=Math.min(s+4,d)
if(r-s<2)return!1
q=new A.F(a,B.a.I(s,4))
p=f.y
if(p.aG(q)||f.z.aq(0,q))return!1
o=A.i([],t.t)
for(n=f.r,m=s,l=0;m<r;++m){k=n.h(0,new A.F(a,m))
if(k!=null){l+=k.a.length
B.b.m(o,m)}}if(o.length<2)return!1
n=f.z
n.m(0,q)
if(n.a>128)n.K(0,n.ga6(0))
j=e*4
i=f.as
if(i==null||i.length<j)i=f.as=new Uint8Array(j)
h=A.mq(s,o,new A.eS(f,a),c,Math.min(B.a.I(f.b,8),l*2),new A.eT(f,a,j),i,a0)
if(h==null)return!1
for(n=o.length,g=0;g<o.length;o.length===n||(0,A.V)(o),++g)f.bp(new A.F(a,o[g]))
n=h.w
f.bT(n)
p.t(0,q,h)
f.Q+=n
return!0},
cC(a,b,c,d,e,f,g,h){var s,r,q,p,o,n,m,l,k,j=this,i=h*c*4
if(b<0||b>=g||f.length<i)return new A.cn(0,0,0)
s=new A.F(a,B.a.I(b,4))
r=j.y.h(0,s)
r=r==null?null:r.aq(0,b)
if(r===!0)j.fi(s)
q=i+B.a.I(i,255)+16
p=e.fX(q)
if(i>0)$.eM()
o=A.m0(f,i,p,e.a,i)
n=o<0||o>=i
if(n){m=i
l=f}else{m=o
l=p}k=A.iV(l,0,m)
j.at=k
j.fc(l,k,n,m,new A.F(a,b),0)
e.hk(q)
return new A.cn(m,k,0)},
fS(a){var s,r=this.ax.K(0,a)
if(r!=null)try{r.c.ca()}catch(s){}return!1},
fY(a){var s,r,q,p,o=this,n=o.y,m=A.n(n).i("W<1>"),l=m.i("bN<k.E>")
m=A.aM(new A.bN(new A.W(n,m),m.i("r(k.E)").a(new A.eQ(a)),l),l.i("k.E"))
l=m.length
s=0
for(;s<m.length;m.length===l||(0,A.V)(m),++s){r=n.K(0,m[s])
if(r!=null)o.Q=o.Q-r.w}n=o.z
n.eY(A.n(n).i("r(1)").a(new A.eR(a)),!0)
q=o.w.K(0,a)
if(q==null)return
for(n=q.gD(q),m=o.r;n.u();){p=m.K(0,new A.F(a,n.gA()))
if(p!=null)o.x=o.x-p.a.length}},
cb(){var s,r,q,p
for(r=this.ax,q=new A.aL(r,r.r,r.e,A.n(r).i("aL<2>"));q.u();){s=q.d
try{s.c.ca()}catch(p){}}r.l(0)},
dL(){var s,r=this
r.r.l(0)
r.w.l(0)
r.x=0
r.y.l(0)
s=r.z
if(s.a>0){s.b=s.c=s.d=s.e=s.f=null
s.a=0
s.bU()}r.Q=0
r.as=null
r.cw()},
eQ(a,b,c,d,e,f,g){var s
$.eM()
if(g!=null&&A.iV(a,b,c)!==g)return!1
if(d){if(c!==f)return!1
B.d.M(e,0,f,a,b)
return!0}try{A.m1(a,b,c,e,f)
return!0}catch(s){if(A.ad(s) instanceof A.a_)return!1
else throw s}},
cR(a,b,c,d,e,f){return this.eQ(a,b,c,d,e,f,null)},
fc(a,b,c,d,e,f){var s,r,q,p=this,o=p.b
if(o<=0||d>o)return
p.bp(e)
p.bT(d)
s=new Uint8Array(d)
B.d.M(s,0,d,a,f)
p.r.t(0,e,new A.ev(s,c,b))
o=p.w
r=e.a
q=o.h(0,r)
if(q==null){q=A.j7(t.S)
o.t(0,r,q)
o=q}else o=q
o.m(0,e.b)
p.x+=d},
fi(a){var s=this.y.K(0,a)
if(s!=null)this.Q=this.Q-s.w},
bT(a){var s,r,q,p,o,n,m,l=this
for(s=t.x,r=l.y,q=A.n(r).i("W<1>"),p=l.r,o=A.n(p).i("W<1>");l.x+l.Q+a>l.b;)if(p.a!==0){n=new A.W(p,o).gD(0)
if(!n.u())A.x(A.aq())
l.bp(n.gA())}else if(r.a!==0){n=new A.W(r,q).gD(0)
if(!n.u())A.x(A.aq())
m=r.K(0,s.a(n.gA()))
if(m!=null)l.Q=l.Q-m.w}else break},
bp(a){var s,r,q,p=this,o=p.r.K(0,a)
if(o==null)return
p.x=p.x-o.a.length
s=p.w
r=a.a
q=s.h(0,r)
if(q!=null){q.K(0,a.b)
if(q.a===0)s.K(0,r)}}}
A.eT.prototype={
$2(a,b){var s=this.a,r=s.r.h(0,new A.F(this.b,a)),q=r.a
return s.cR(q,0,q.length,r.b,b,this.c)},
$S:22}
A.eS.prototype={
$1(a){var s=this.a.r.h(0,new A.F(this.b,a))
s=s==null?null:s.c
return s==null?0:s},
$S:23}
A.eQ.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.eR.prototype={
$1(a){return t.x.a(a).a===this.a},
$S:12}
A.fb.prototype={
fX(a){var s=this.b,r=s.length
if(r>=a)return s
while(r<a)r*=2
this.c=0
return this.b=new Uint8Array(r)},
hk(a){var s=this
if(s.b.length<=524288){s.c=0
return}if(a<=131072){if(++s.c>=16){s.b=new Uint8Array(131072)
s.c=0}}else s.c=0}}
A.fE.prototype={}
A.ea.prototype={
aq(a,b){var s=b-this.c
return s>=0&&s<4&&this.d[s]!==255},
fH(a){var s,r,q=a-this.c
if(q>=0&&q<4){s=this.d
if(!(q>=0&&q<4))return A.a(s,q)
r=s[q]
if(r!==255){s=this.x
if(!(r<4))return A.a(s,r)
return s[r]}}return 0},
d4(a){var s=this.d,r=a-this.c
if(!(r>=0&&r<4))return A.a(s,r)
return s[r]*this.gdr()},
gcO(){var s=this.y
return s===$?this.y=B.a.I(this.a+16-1,16):s},
gdr(){var s,r,q=this,p=q.z
if(p===$){s=q.gcO()
r=B.a.I(q.b+16-1,16)
q.z!==$&&A.P()
p=q.z=s*r}return p},
hi(a3,a4,a5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.gdr(),b=d.d4(a3),a=a5==null,a0=a?null:a5.a,a1=d.r,a2=a0===a1?d.d4(a5.b):-1
if(a2===b)return
for(a0=d.a,s=d.b,r=d.f,q=a2>=0,p=d.e,o=p.length,n=0;n<c;++n){m=b+n
if(!(m>=0&&m<o))return A.a(p,m)
l=p[m]
if(q){m=a2+n
if(!(m<o))return A.a(p,m)
m=p[m]===l}else m=!1
if(m)continue
m=d.gcO()
k=B.a.N(n,m)*16
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
A.a9.prototype={
gR(a){var s=this
return s.a>=s.c||s.b>=s.d},
h6(a){var s=this
return new A.a9(s.a-a,s.b-a,s.c+a,s.d+a)},
bx(a){var s=this
return new A.a9(Math.max(s.a,a.a),Math.max(s.b,a.b),Math.min(s.c,a.c),Math.min(s.d,a.d))}}
A.b4.prototype={
b9(a){if($.l!=null)this.b=A.aI(a*4)
else this.c=new Int32Array(a)},
gv(){var s=this.b
if(s!=null)s=A.dW(t.a.a(A.u($.l.memory).buffer),s,this.a)
else{s=this.c
s.toString}return s},
av(a,b){var s,r,q,p,o,n=this
if(n.b!=null){s=A.aI(a*4)
r=A.dW(t.a.a(A.u($.l.memory).buffer),s,a)
if(b>0)B.e.H(r,0,b,n.gv())
q=$.l
q.toString
p=n.b
p.toString
q.free(p)
n.b=s
n.a=a}else{o=new Int32Array(a)
if(b>0){q=n.c
q.toString
B.e.H(o,0,b,q)}n.c=o
n.a=a}},
a_(){var s=this.b
if(s!=null){$.l.free(s)
this.b=null}}}
A.aX.prototype={
gv(){var s=this.c
if(s!=null)s=A.ja(t.a.a(A.u($.l.memory).buffer),s,this.b)
else{s=this.d
s.toString}return s},
av(a,b){var s,r,q,p,o,n=this
if(!n.a)throw A.f(A.aD("Cannot resize a borrowed pixel buffer"))
if(n.c!=null){s=A.aI(a*4)
r=A.ja(t.a.a(A.u($.l.memory).buffer),s,a)
if(b>0)B.f.H(r,0,b,n.gv())
q=$.l
q.toString
p=n.c
p.toString
q.free(p)
n.c=s
n.b=a}else{o=new Uint32Array(a)
if(b>0){q=n.d
q.toString
B.f.H(o,0,b,q)}n.d=o
n.b=a}},
a_(){var s,r,q=this
if(q.a&&q.c!=null){s=$.l
s.toString
r=q.c
r.toString
s.free(r)
q.c=null}}}
A.fe.prototype={
hg(a,b,c,d,e,f,g,h,i,j,k,a0,a1){var s,r,q,p,o,n,m,l=this;++l.f
s=(j-h)*(k-i)
if(e<2||f===0||a0.b==null||s>262144)return-2
if(s>l.e)l.e=s
r=l.c
if(e>r){if(r>0){$.l.free(l.r)
$.l.free(l.w)}r=e*2
l.c=r
l.r=A.aI(r*8)
l.w=A.aI(l.c*8)}r=l.d
if(f>r){if(r>0){$.l.free(l.x)
$.l.free(l.y)}r=f*2
l.d=r
l.x=A.aI(r*4)
l.y=A.aI(l.d*4)}r=t.a
B.i.H(A.j9(r.a(A.u($.l.memory).buffer),l.r,l.c),0,e,a)
B.i.H(A.j9(r.a(A.u($.l.memory).buffer),l.w,l.c),0,e,b)
B.e.H(A.dW(r.a(A.u($.l.memory).buffer),l.x,l.d),0,f,c)
B.e.H(A.dW(r.a(A.u($.l.memory).buffer),l.y,l.d),0,f,d)
q=new A.fg(l,f,h,i,j,k,g,a0)
p=q.$0()
while(p===-1){o=a0.b
if(o!=null){n=r.a(A.u($.l.memory).buffer)
m=a0.a
o=new Int32Array(n,o,m)}else{o=a0.c
o.toString}a0.av(o.length*2,0)
p=q.$0()}return p},
hl(){if($.ff!==this){this.a_()
return}var s=$.cJ-1
$.cJ=s
if(s>0)return
$.cJ=0
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
return A.dx(j,"fl_dense_raster",[s.a,r,q,p,o,k.b,k.c,k.d,k.e,k.f,n,l,m.gv().length/2|0,s.b],t.S)},
$S:3}
A.ik.prototype={
$8(a,b,c,d,e,f,g,h){this.a.U(g,h,a,b,c,d,e,f,this.b)},
$S:26}
A.hX.prototype={
fZ(a,b,c,d,e,f,g){var s,r=!0
if(g.gR(0)){s=a.f
if(s!==0)if(s<=1024){r=a.r
r=r===0||r>128}}if(r)return!1
r=this.f
if(r==null)r=this.f=new A.bn(new Float64Array(256))
r.aH(a.f*4)
g.fW(a.r*2)
for(;;)return!1}}
A.ih.prototype={
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
$S:27}
A.ii.prototype={
$6(a,b,c,d,e,f){var s
this.a.$7(a,b,c,d,e,f,0)
s=this.c
this.b.q(a+s*e,b+s*f)},
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
$S:29}
A.cc.prototype={
geH(){var s=this.a
return s}}
A.fn.prototype={
gd3(){var s=this
if(!s.Q&&s.b){s.Q=!0
s.z=A.m3()}return s.z},
aL(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j=this,i=j.gd3()
if(i!=null){s=a.f
if(s>4096||a.r>256)j.as=!0
r=i.f
q=i.hg(a.a,a.b,a.c,a.d,s,a.r,b,d,e,f,g,c.a,!0)
j.r=j.r+(i.f-r)
if(q>=0){p=A.dW(t.a.a(A.u($.l.memory).buffer),i.b,4)
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
B.e.T(k,0,l,-1)
m=j.ch=new A.eX(l,k,s,o,n,m)
s=m}s.hh(a,b,c,d,e,f,g)},
fd(a,b,c,d,e,f,g,h,i,j,k,l){var s
if(this.gd3()!=null)s=l===0
else s=!0
if(s)return!1
return!1},
de(a,b){var s=this.at,r=s.K(0,a)
if(r==null)return null
if(r.b.E(0,b)){s.t(0,a,r)
return r.c}this.ax=this.ax-r.d
r.c.a.a_()
return null},
c_(a,b,c){var s,r,q,p,o,n,m=this,l=96+c.b*8
if(l>131072)return
s=m.at
r=s.$ti.i("W<1>")
for(;;){if(!(m.ax+l>1048576||s.a>=256))break
q=new A.W(s,r).gD(0)
if(!q.u())A.x(A.aq())
p=s.K(0,q.gA())
m.ax=m.ax-p.d
o=p.c.a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}r=m.ay
r.toString
o=Math.max(1,c.b)*2
n=new A.b4(o)
n.b9(o)
n=new A.aC(n)
n.dO(c)
s.t(0,a,new A.bO(r,b,n,l))
m.ax+=l},
di(a,b){var s,r,q,p=this.x2,o=p.h(0,a)
if(o!=null)return o.b
if(p.a>=512)p.l(0)
s=this.fx
s.l(0)
A.ij(a,b,0.01,s)
r=Math.max(1,s.f)
q=A.cR(Math.max(1,s.r),r)
B.i.H(q.a,0,s.f,s.a)
B.i.H(q.b,0,s.f,s.b)
B.e.H(q.c,0,s.r,s.c)
B.e.H(q.d,0,s.r,s.d)
B.d.H(q.e,0,s.r,s.e)
q.f=s.f
q.r=s.r
r=this.ay
r.toString
p.t(0,a,new A.aa(r,q,t.b3))
return q},
gaY(){var s=this.CW
if(s==null){s=new A.b4(2048)
s.b9(2048)
s=this.CW=new A.aC(s)}return s},
gbN(){var s=this.cx
if(s==null){s=new A.b4(2048)
s.b9(2048)
s=this.cx=new A.aC(s)}return s},
gbm(){var s=this.cy
if(s==null){s=new A.b4(2048)
s.b9(2048)
s=this.cy=new A.aC(s)}return s},
gdj(){var s,r,q=this.p2
if(q==null){q=new Float64Array(256)
s=new Float64Array(256)
r=new Float64Array(256)
q=this.p2=new A.hX(this.p1,new A.bn(q),new A.bn(s),new A.bn(r),new A.bn(new Float64Array(256)))}return q},
ey(a,b){var s,r,q,p
for(s=this.k4;s.length<=a;){r=Math.max(16,b)
B.b.m(s,new Float64Array(r))}q=s[a]
p=q.length
if(p<b){while(p<b)p*=2
q=new Float64Array(p)
B.b.t(s,a,q)}return q},
eA(a){var s,r,q,p,o
for(s=this.fy;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
ez(a){var s,r,q,p,o
for(s=this.go;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
an(a){var s,r
for(s=this.p3;s.length<=a;){r=new A.b4(2048)
if($.l!=null)r.b=A.aI(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aC(r))}s=s[a]
s.l(0)
return s},
ex(a){var s,r,q,p,o
for(s=this.id;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
ew(a){var s,r,q,p,o
for(s=this.k1;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cZ(a){var s
for(s=this.k2;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
ev(a){var s,r,q,p,o
for(s=this.p4;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
eu(a){var s,r,q,p,o
for(s=this.R8;s.length<=a;){r=new Float64Array(512)
q=new Float64Array(512)
p=new Int32Array(32)
o=new Int32Array(32)
B.b.m(s,new A.ah(r,q,p,o,new Uint8Array(32)))}s=s[a]
s.l(0)
return s},
cH(a){var s,r
for(s=this.RG;s.length<=a;){r=new A.b4(2048)
if($.l!=null)r.b=A.aI(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aC(r))}return s[a]},
es(a){var s,r
for(s=this.rx;s.length<=a;){r=new A.b4(2048)
if($.l!=null)r.b=A.aI(8192)
else r.c=new Int32Array(2048)
B.b.m(s,new A.aC(r))}return s[a]},
fg(){var s,r,q,p,o
for(s=this.y1,r=new A.aL(s,s.r,s.e,s.$ti.i("aL<2>"));r.u();){q=r.d.b
if(q.a&&q.c!=null){p=$.l
p.toString
o=q.c
o.toString
p.free(o)
q.c=null}}s.l(0)},
cn(a){var s=this,r=a.a
s.at.bA(0,new A.fo(s,r))
s.x2.bA(0,new A.fp(r))
s.xr.bA(0,new A.fq(r))
s.y1.bA(0,new A.fr(r))},
e2(){var s,r,q,p,o=this
for(s=o.at,r=new A.aL(s,s.r,s.e,s.$ti.i("aL<2>"));r.u();){q=r.d.c.a
p=q.b
if(p!=null){$.l.free(p)
q.b=null}}s.l(0)
o.ax=0
o.x2.l(0)
o.xr.l(0)
o.fg()},
a_(){var s,r,q,p,o,n,m=this
m.e2()
s=m.y2
if(s!=null)s.a_()
m.y2=null
s=m.bv
if(s!=null)s.a_()
m.bv=null
s=m.z
if(s!=null)s.hl()
m.z=null
s=m.CW
if(s!=null)s.a.a_()
s=m.cx
if(s!=null)s.a.a_()
s=m.cy
if(s!=null)s.a.a_()
m.CW=m.cx=m.cy=null
for(s=m.RG,r=s.length,q=0;q<s.length;s.length===r||(0,A.V)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}for(r=m.rx,p=r.length,q=0;q<r.length;r.length===p||(0,A.V)(r),++q){o=r[q].a
n=o.b
if(n!=null){$.l.free(n)
o.b=null}}B.b.l(s)
B.b.l(r)
B.b.l(m.p4)
B.b.l(m.R8)
for(s=m.p3,r=s.length,q=0;q<s.length;s.length===r||(0,A.V)(s),++q){p=s[q].a
o=p.b
if(o!=null){$.l.free(o)
p.b=null}}B.b.l(s)
m.da()
m.ch=null},
e5(a){var s,r,q,p,o,n,m,l,k,j,i=this
i.to=0
if(a){i.x1=0
i.as=!1}s=i.z
if(s!=null)r=a||s.e>65536||s.c>8192||s.d>512
else r=!1
if(r){if(s.e>65536){$.l.fl_dense_trim(s.a,65536)
s.e=0}if(s.c>8192){$.l.free(s.r)
$.l.free(s.w)
s.w=s.r=s.c=0}if(s.d>512){$.l.free(s.x)
$.l.free(s.y)
s.y=s.x=s.d=0}}if(a){r=i.y2
if(r!=null)r.a_()
i.y2=null
i.da()
B.b.l(i.fy)
B.b.l(i.go)
B.b.l(i.id)
B.b.l(i.k1)
B.b.l(i.k4)
B.b.l(i.k2)
B.b.l(i.k3)
B.b.l(i.dQ)
i.p2=null}else{for(r=i.ry,q=t.a,p=0;o=r.length,p<o;++p){n=r[p]
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
n.c=null}B.b.t(r,p,null)}}if(o>5)B.b.sk(r,5)
r=i.fy
q=r.length
B.b.b3(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.V)(r),++k)r[k].af()
r=i.go
q=r.length
B.b.b3(r,Math.min(2,q),q)
for(q=r.length,k=0;k<r.length;r.length===q||(0,A.V)(r),++k)r[k].af()
r=i.id
q=r.length
B.b.b3(r,Math.min(2,q),q)
q=i.k1
r=q.length
B.b.b3(q,Math.min(2,r),r)
for(r=q.length,k=0;k<q.length;q.length===r||(0,A.V)(q),++k)q[k].af()
r=i.k4
q=r.length
B.b.b3(r,Math.min(2,q),q)
for(p=0;p<r.length;++p)if(r[p].length>4096)B.b.t(r,p,new Float64Array(64))
r=i.p2
if(r!=null){r.b.af()
r.c.af()
r.d.af()
r.e.af()
r=r.f
if(r!=null)r.af()}}i.db.Z(a)
i.dx.Z(a)
i.dy.Z(a)
i.fr.Z(a)
i.fx.Z(a)
for(r=i.id,p=0;p<r.length;++p)r[p].Z(a)
if(a){for(r=i.p3,q=r.length,k=0;k<r.length;r.length===q||(0,A.V)(r),++k){o=r[k].a
m=o.b
if(m!=null){$.l.free(m)
o.b=null}}B.b.l(r)}else for(r=i.p3,q=r.length,k=0;k<r.length;r.length===q||(0,A.V)(r),++k)r[k].af()
r=i.CW
if(r!=null)r.Z(a)
r=i.cx
if(r!=null)r.Z(a)
r=i.cy
if(r!=null)r.Z(a)
for(r=i.p4,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.R8,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.RG,p=0;p<r.length;++p)r[p].Z(a)
for(r=i.rx,p=0;p<r.length;++p)r[p].Z(a)
if(a)i.ch=null
else{r=i.ch
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
r.f=new Int32Array(8192)}}}i.ok.Z(a)},
hs(){return this.e5(!1)},
da(){var s,r,q,p,o,n
for(s=this.ry,r=s.length,q=0;q<s.length;s.length===r||(0,A.V)(s),++q){p=s[q]
if(p!=null)if(p.a&&p.c!=null){o=$.l
o.toString
n=p.c
n.toString
o.free(n)
p.c=null}}B.b.l(s)},
aJ(a,b){var s,r,q
if(b>this.to)this.to=b
s=this.ry
if(s.length<=a)B.b.sk(s,a+1)
if(!(a<s.length))return A.a(s,a)
r=s[a]
if(r==null){q=A.fh(b)
B.b.t(s,a,q)
return q}if(r.gv().length<b)r.av(b,0)
return r},
c3(a){var s
for(s=this.dQ;s.length<=a;)B.b.m(s,new Float64Array(6))
return s[a]},
sfk(a){this.ay=t.g_.a(a)}}
A.fo.prototype={
$2(a,b){var s
A.aU(a)
t.az.a(b)
if(b.a!==this.b)return!1
s=this.a
s.ax=s.ax-b.d
b.c.a.a_()
return!0},
$S:30}
A.fp.prototype={
$2(a,b){A.aU(a)
return t.b3.a(b).a===this.a},
$S:31}
A.fq.prototype={
$2(a,b){A.aU(a)
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
A.bO.prototype={}
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
A.ne(a0,e,a.ay,d,k.gdj())
s.l(0)
s.aF(d,q,p,o,n,m,l)
c=k.an(3)
b=k.an(4)
k.aL(s,!1,c,j,i,h,g)
a2.aT(b)
A.cU(b,c,a2,e>0?2:3)},
$S:34}
A.c.prototype={
dC(a){var s,r,q=this.a
if(q==null){a.a+="$"
return}q.dC(a)
s=this.b
if(A.p(s))a.a+="["+A.v(s)+"]"
else{r="."+A.v(s)
a.a+=r}},
p(a){var s,r=new A.cd("")
this.dC(r)
s=r.a
return s.charCodeAt(0)==0?s:s}}
A.bx.prototype={
gG(){var s,r=this,q=r.z
if(q===$){s=B.b.ac(r.w,new A.h5(r))
r.z!==$&&A.P()
r.z=s
q=s}return q},
j(a,b){return A.x(new A.fJ(b+" at "+a.p(0),null,null))},
au(a,b,c){if(!t.P.b(b))this.j(c,"Expected object")
return b},
by(a,b,c){var s
if(typeof a!="number"||!isFinite(a)){A:{if(A.p(c)){s=new A.c(b,c)
break A}if(typeof c=="string"){s=new A.c(b,c)
break A}s=b
break A}this.j(s,"Expected finite number")}return a},
S(a,b){return this.by(a,b,null)},
O(a,b,c){var s,r
t.P.a(a)
t.h.a(c)
for(s=a.gar(),s=s.gD(s);s.u();){r=s.gA()
if(!c.aq(0,r))this.j(new A.c(b,r),"Unsupported field")}},
e8(a,b,c){t.P.a(a)
if(a.h(0,b)!=null&&!J.m(a.h(0,b),0)&&!J.m(a.h(0,b),!1))this.j(new A.c(c,b),"Unsupported nonzero "+b)},
dM(g4,g5,g6,g7){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0=this,f1=null,f2="ip",f3="op",f4="Expected object",f5="layers",f6="hasMask",f7="tp",f8="td",f9="masksProperties",g0="shapes",g1="refId",g2="parent",g3=t.P
g3.a(g4)
t.cq.a(g5)
t.h.a(g6)
t.aM.a(g7)
f0.O(g4,B.h,B.aS)
f0.e8(g4,"ddd",B.h)
for(s=["fonts","chars","slots","props"],r=s.length,q=t.j,p=0;p<r;++p){o=s[p]
n=g4.h(0,o)
m=!1
if(n!=null)if(!(q.b(n)&&J.iR(n)))m=!(n instanceof A.H&&n.gR(n))
if(m)f0.j(new A.c(B.h,o),"Unsupported "+o)}f0.b=f0.S(g4.h(0,"w"),new A.c(B.h,"w"))
f0.c=f0.S(g4.h(0,"h"),new A.c(B.h,"h"))
f0.d=f0.S(g4.h(0,f2),new A.c(B.h,f2))
f0.e=f0.S(g4.h(0,f3),new A.c(B.h,f3))
s=f0.S(g4.h(0,"fr"),new A.c(B.h,"fr"))
f0.f=s
if(f0.b<=0||f0.c<=0||s<=0||f0.e<=f0.d)f0.j(B.h,"Invalid bounds/timing")
s=g5==null
l=s?A.ab(t.N,g3):g5
if(s)for(s=["assets","comps"],r=s.length,p=0;p<r;++p){k=s[p]
j=g4.h(0,k)
if(j==null)j=[]
if(!q.b(j))f0.j(new A.c(B.h,k),"Expected asset definitions")
for(m=J.cv(j);m.u();){i=m.gA()
if(!g3.b(i))f0.j(new A.c(B.h,k),f4)
h=i.h(0,"id")
if(typeof h!="string")f0.j(new A.c(B.h,k),"Expected asset id")
l.t(0,h,i)}}g=g4.h(0,f5)
if(!q.b(g))f0.j(B.n,"Expected layers")
f=g7==null?A.ab(t.bP,t.E):g7
e=new A.hU(f0,g,new A.af(t.gt),new A.bS(t.ai))
s=t.S
r=t.D
d=A.ab(s,r)
c=A.ab(r,s)
s=A.i([],t.f)
b=new A.hb(f0,s)
a=A.ab(r,t.eG)
for(r=J.M(g),m=f0.w,a0=t.n,a1=t.r,a2=t.V,a3=t.c2,a4=f0.a,a5=t.N,a6=t.z,a7=0;a7<r.gk(g);++a7){a8=new A.c(B.n,a7)
a9=r.h(g,a7)
if(!g3.b(a9))f0.j(a8,f4)
f0.O(a9,a8,B.aR)
b0=a9.h(0,"bm")
if(b0==null)b0=0
if(!A.p(b0)||b0<0||b0>16)f0.j(new A.c(a8,"bm"),"Blend mode "+A.v(b0))
for(b1=["ddd","ao"],b2=b1.length,p=0;p<b2;++p)f0.e8(a9,b1[p],a8)
if(a9.h(0,f6)!=null&&!A.bj(a9.h(0,f6))&&!J.m(a9.h(0,f6),0)&&!J.m(a9.h(0,f6),1))f0.j(new A.c(a8,f6),"Expected boolean hasMask")
b3=a9.h(0,"tt")
if(b3==null)b3=0
if(!A.p(b3)||b3<0||b3>4)f0.j(new A.c(a8,"tt"),"Matte type")
if(a9.h(0,f7)!=null&&!J.m(a9.h(0,f7),0)){b1=!0
if(b3!==0)if(a7!==0){b1=a9.h(0,f7)
b2=a7-1
b4=J.ae(r.h(g,b2),"ind")
b1=!J.m(b1,b4==null?b2:b4)}if(b1)f0.j(new A.c(a8,f7),"Unsupported nonzero tp")}if(a9.h(0,f8)!=null&&!J.m(a9.h(0,f8),0)&&!J.m(a9.h(0,f8),1))f0.j(new A.c(a8,f8),"Matte source flag")
b5=f0.eG(a9.h(0,f9),new A.c(a8,f9))
g3.a(a9)
b.fA(a9,q.a(q.b(a9.h(0,g0))?a9.h(0,g0):B.A),a8,s)
b1=a9.h(0,"sr")
if(b1==null)b1=1
b6=f0.S(b1,new A.c(a8,"sr"))
if(b6===0)f0.j(new A.c(a8,"sr"),"Invalid zero time stretch")
b7=a9.h(0,"ty")
b1=J.aA(b7)
if(!b1.E(b7,4)&&!b1.E(b7,3)&&!b1.E(b7,0)&&!b1.E(b7,1))f0.j(new A.c(a8,"ty"),"Layer type "+A.v(b7))
b8=f0.eR(a9.h(0,"ef"),new A.c(a8,"ef"),g)
b9=b8.a
c0=b8.b
c1=f0.f2(a9.h(0,"sy"),new A.c(a8,"sy"))
if(c1!=null&&b9!=null)f0.j(new A.c(a8,"ef"),"Fill with Inner Shadow")
b2=c0==null
b4=!b2
if(b4)c2=!b1.E(b7,4)||b3!==0||b0!==0
else c2=!1
if(c2)f0.j(c0.b,"Set Matte requires a normal shape layer without a track matte")
c3=f0.dv(a9.h(0,"ks"),new A.c(a8,"ks"))
if(b1.E(b7,4))c4=f0.cY(a9.h(0,g0),new A.c(a8,g0),e)
else if(b1.E(b7,1)){c2=a9.h(0,"sw")
if(c2==null)c2=0
c5=f0.S(c2,new A.c(a8,"sw"))
c2=a9.h(0,"sh")
if(c2==null)c2=0
c6=f0.S(c2,new A.c(a8,"sh"))
c7=a9.h(0,"sc")
if(typeof c7!="string"||!B.p.eh(c7,"#"))f0.j(new A.c(a8,"sc"),"Invalid solid color")
c8=A.od(B.p.ek(c7,1),16)
c2=B.a.L(c8,16)
c9=B.a.L(c8,8)
d0=new Float32Array(A.T(A.i([c5*0.5,c6*0.5],a0)))
d1=new Float32Array(0)
d2=new Float32Array(A.T(A.i([c5,c6],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.T(A.i([0],a0)))
d5=new A.R(new A.aS(!1,!1,new A.A(d0,f1,!1,d1,!1),new A.A(d2,f1,!1,d3,!1),new A.A(d4,f1,!1,new Float32Array(0),!1)))
c2=new Float32Array(A.T(A.i([(c2&255)/255,(c9&255)/255,(c8&255)/255],a0)))
d6=new A.A(c2,f1,!1,new Float32Array(0),!1)
d6.f=!0
c2=new Float32Array(A.T(A.i([100],a0)))
c9=new Float32Array(0)
d0=new Float32Array(A.T(A.i([1],a0)))
d1=new Float32Array(0)
d7=A.jo(A.i([d5],a1),d6,new A.A(c2,f1,!1,c9,!1),new A.A(d0,f1,!1,d1,!1),!1,!1,1,1,4,f1,f1)
d1=A.i([d5],a1)
d0=A.i([d7],a2)
c9=new Float32Array(A.T(A.i([0,0],a0)))
c2=new Float32Array(0)
d2=new Float32Array(A.T(A.i([0,0],a0)))
d3=new Float32Array(0)
d4=new Float32Array(A.T(A.i([100,100],a0)))
d8=new Float32Array(0)
d9=new Float32Array(A.T(A.i([0],a0)))
e0=new Float32Array(0)
e1=new Float32Array(A.T(A.i([100],a0)))
c4=A.jm(d1,d0,new A.bW(new A.A(c9,f1,!1,c2,!1),new A.A(d2,f1,!1,d3,!1),new A.A(d4,f1,!1,d8,!1),new A.A(d9,f1,!1,e0,!1),new A.A(e1,f1,!1,new Float32Array(0),!1),f1,f1,f1,f1))}else c4=f1
if(b1.E(b7,0)){h=a9.h(0,g1)
e2=l.h(0,h)
if(typeof h!="string"||e2==null||!q.b(e2.h(0,f5)))f0.j(new A.c(a8,g1),"Missing precomposition")
if(g6.aq(0,h))f0.j(new A.c(a8,g1),"Cyclic precomposition")
b1=a9.h(0,"w")
if(b1==null)b1=f0.b
e3=f0.S(b1,new A.c(a8,"w"))
b1=a9.h(0,"h")
if(b1==null)b1=f0.c
e4=f0.S(b1,new A.c(a8,"h"))
e5=new A.ay(h,e3,e4)
e6=f.h(0,e5)
if(e6==null){e6=A.jk(a4)
b1=A.lY(["w",e3,"h",e4,"ip",0,"op",f0.e-f0.d,"fr",f0.f,"layers",e2.h(0,f5)],a5,a6)
c2=A.lZ(a5)
c2.ah(0,g6)
c2.m(0,h)
e6.dM(b1,l,c2,f)
f.t(0,e5,e6)}e7=new A.en(new A.af(a3)).cv(e6)
f0.x=f0.x+e7.x
f0.y=B.t.bF(f0.y,e7.y)}else e7=f1
e8=a9.h(0,"tm")!=null?f0.J(a9.h(0,"tm"),new A.c(a8,"tm"),1,A.i([0],a0)):f1
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
e9=A.kk(c3,c4,b1,c2,c9,b0,e7,b9,c1,b5,b2?b3:1,d0,b6,e8,b4)
if(b4)a.t(0,e9,c0)
B.b.m(m,e9)
h=a9.h(0,"ind")
if(h==null)h=a7
if(!A.p(h)||d.aG(h))f0.j(new A.c(a8,"ind"),"Invalid/duplicate layer id")
d.t(0,h,e9)
if(a9.h(0,g2)!=null){if(!A.p(a9.h(0,g2)))f0.j(new A.c(a8,g2),"Invalid parent id")
c.t(0,e9,A.j(a9.h(0,g2)))}}f0.f4(g,d,a)
f0.f5(d,c)},
fF(a){return this.dM(a,null,B.aX,null)},
eG(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=null,e="pt"
if(a==null)return f
if(!t.j.b(a))g.j(b,"Expected list")
s=J.M(a)
if(s.gR(a))return f
r=A.i([],t.bE)
for(q=t.n,p=t.P,o=0;o<s.gk(a);++o){n=new A.c(b,o)
m=s.h(a,o)
if(!p.b(m))g.j(n,"Expected object")
g.O(m,n,B.aQ)
l=J.m(m.h(0,"inv"),!0)
k=A.ia(m.h(0,"mode"))
if(k==null)k="a"
if(!B.aY.aq(0,k))g.j(new A.c(n,"mode"),"Unsupported mask mode "+k)
if(m.h(0,e)==null)g.j(new A.c(n,e),"Missing mask path")
j=g.d8(m.h(0,e),new A.c(n,e))
if(m.h(0,"o")!=null)i=g.J(m.h(0,"o"),new A.c(n,"o"),1,A.i([100],q))
else{h=new Float32Array(A.T(A.i([100],q)))
i=new A.A(h,f,!1,new Float32Array(0),!1)}B.b.m(r,new A.a7(j,k,i,l,m.h(0,"x")!=null?g.J(m.h(0,"x"),new A.c(n,"x"),1,A.i([0],q)):f))}return r},
f4(a,b,c){var s,r,q,p,o,n,m,l,k,j=this
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
j.x+=4}}for(p=new A.bJ(c,A.n(c).i("bJ<1,2>")).gD(0);p.u();){n=p.d
m=n.a
l=n.b
o=b.h(0,l.a)
k=!0
if(o!=null)if(o.b!=null)if(!o.e)k=o!==m&&o.y!==0
if(k)j.j(l.b,"Set Matte requires a visible shape source without its own matte")
m.ay=o
j.x+=4}for(p=J.M(a),r=0;r<s.length;++r){if(J.m(J.ae(p.h(a,r),"td"),1)){if(!(r<s.length))return A.a(s,r)
k=!s[r].ch}else k=!1
if(k)j.j(new A.c(new A.c(B.n,r),"td"),"Unpaired matte source")}},
f5(a,b){var s,r,q,p,o,n,m,l,k
t.B.a(a)
t.gq.a(b)
for(s=new A.bJ(b,A.n(b).i("bJ<1,2>")).gD(0);s.u();){r=s.d
q=r.b
p=a.h(0,q)
if(p==null)this.j(B.n,"Missing parent "+q)
r.a.cy=p}for(s=this.w,q=s.length,o=t.D,n=0;n<s.length;s.length===q||(0,A.V)(s),++n){m=s[n]
l=A.j7(o)
for(k=m;k!=null;k=k.cy)if(!l.m(0,k))this.j(B.n,"Cyclic parenting")}},
aw(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this
for(s=g.w,r=s.length-1,q=null;r>=0;--r){if(!(r<s.length))return A.a(s,r)
p=s[r]
if(!p.ch){if(!p.e)o=(p.b!=null||p.f!=null)&&a>=p.c&&a<p.d
else o=!1
o=!o}else o=!0
if(o)continue
o=p.a.e.n(a)
if(0>=o.length)return A.a(o,0)
if(B.c.F(B.a.B(B.c.Y(255*B.c.F(o[0])/100),0,255)*p.aR(a)/255)===0)continue
n=p.ay
m=p.aw(a)
if(m==null)continue
if(n!=null){o=p.y
l=o===2||o===4
if(!n.e)o=(n.b!=null||n.f!=null)&&a>=n.c&&a<n.d
else o=!1
if(o){o=n.a.e.n(a)
if(0>=o.length)return A.a(o,0)
k=B.c.F(B.a.B(B.c.Y(255*B.c.F(o[0])/100),0,255)*n.aR(a)/255)>0}else k=!1
if(!k){if(!l)continue}else if(!l){j=n.aw(a)
if(j==null)continue
m=m.bx(j)
if(m.a>=m.c||m.b>=m.d)continue}}q=A.c_(q,m)}if(q==null)return null
i=g.r
if(i===$){s=g.b
s===$&&A.D()
o=g.c
o===$&&A.D()
i=g.r=new A.a9(0,0,0+s,0+o)}h=q.bx(i)
return h.gR(0)?null:h},
dv(a,b){var s,r,q,p,o,n,m,l,k,j,i=this,h="p",g=a==null?A.ab(t.N,t.z):i.au(0,a,b)
i.O(g,b,B.b3)
for(s=["rx","ry","rz","or"],r=s.length,q=0;q<r;++q){p=s[q]
if(g.h(0,p)!=null)i.j(new A.c(b,p),"3D transform")}s=t.n
o=i.J(g.h(0,"sk"),new A.c(b,"sk"),1,A.i([0],s))
n=i.J(g.h(0,"sa"),new A.c(b,"sa"),1,A.i([0],s))
m=g.h(0,h)
if(m instanceof A.H&&J.m(m.h(0,"s"),!0)){l=i.au(0,m,new A.c(b,h))
i.O(l,new A.c(b,h),B.aU)
k=i.J(l.h(0,"x"),new A.c(new A.c(b,h),"x"),1,A.i([0],s))
j=i.J(l.h(0,"y"),new A.c(new A.c(b,h),"y"),1,A.i([0],s))
m=null}else{k=null
j=null}return A.jp(i.J(g.h(0,"a"),new A.c(b,"a"),2,A.i([0,0],s)),i.J(m,new A.c(b,h),2,A.i([0,0],s)),i.fz(g.h(0,"s"),new A.c(b,"s"),2,A.i([100,100],s),100),i.J(g.h(0,"r"),new A.c(b,"r"),1,A.i([0],s)),i.J(g.h(0,"o"),new A.c(b,"o"),1,A.i([100],s)),k,j,o,n)},
eR(b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5="Expected object",a6="ty",a7="mn",a8="en",a9="ef",b0=t.j
b0.a(b3)
if(b1==null)return B.aJ
if(!b0.b(b1))a4.j(b2,"Expected effects array")
for(s=J.b0(b3),r=t.n,q=t.P,p=null,o=null,n=0;m=J.M(b1),n<m.gk(b1);++n){l=new A.c(b2,n)
m=m.h(b1,n)
if(!q.b(m))a4.j(new A.c(b2,n),a5)
a4.O(m,l,B.b_)
k=J.m(m.h(0,a6),21)&&J.m(m.h(0,a7),"ADBE Fill")
j=J.m(m.h(0,a6),28)&&J.m(m.h(0,a7),"ADBE Set Matte3")
i=J.m(m.h(0,a6),5)&&J.m(m.h(0,a7),"ADBE Layer Control")
h=!k
if(h&&!j&&!i)a4.j(l,"Unsupported visual effect")
if(J.m(m.h(0,a8),0)||J.m(m.h(0,a8),!1))continue
if(m.h(0,a8)!=null&&!J.m(m.h(0,a8),1)&&!J.m(m.h(0,a8),!0))a4.j(new A.c(l,a8),"Invalid effect enabled flag")
if(!h||j){if(p!=null||o!=null)a4.j(l,"Multiple visual effects")
g=k?B.a9:B.ac
f=m.h(0,a9)
if(!b0.b(f)||J.aj(f)!==g.length)a4.j(new A.c(l,a9),"Invalid effect parameters")
e=new A.fW(a4,l,f,g)
d=new A.fX(a4,e,l)
if(k){for(m=[0,1,3,4,5],h=m.length,c=0;c<h;++c)d.$2(m[c],0)
p=new A.em(e.$2$dimensions(2,3),e.$1(6))}else{for(m=[B.aE,B.aF,B.aG,B.aH,B.aI],h=m.length,c=0;c<h;++c){b=m[c]
d.$2(b.a,b.b)}a=e.$1(0)
m=a.n(0)
if(0>=m.length)return A.a(m,0)
a0=m[0]
a1=new A.c(new A.c(new A.c(l,a9),0),"v")
if(a.a==null||a0<=0||a0!==B.c.e3(a0))a4.j(a1,"Expected a static layer index")
o=new A.F(B.c.Y(a0),a1)}continue}a2=m.h(0,a9)
if(!b0.b(a2)||J.aj(a2)!==1)a4.j(l,"Invalid layer control")
m=J.jR(a2)
if(!q.b(m))a4.j(new A.c(new A.c(l,a9),0),a5)
a4.O(m,new A.c(new A.c(l,a9),0),B.F)
if(!J.m(m.h(0,a6),10)||!J.m(m.h(0,a7),"ADBE Layer Control-0001"))a4.j(l,"Unsupported effect control")
a=a4.J(m.h(0,"v"),new A.c(new A.c(new A.c(l,a9),0),"v"),1,A.i([0],r))
a3=a.a
if(a3==null)a3=a.b.e
for(m=a3.length,c=0;c<m;++c){a0=a3[c]
if(a0===B.c.e3(a0))h=a0!==0&&!s.ap(b3,new A.fV(a0))
else h=!0
if(h)a4.j(l,"Missing layer control target")}}return new A.F(p,o)},
f2(a,b){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
if(a!=null)s=t.j.b(a)&&J.iR(a)
else s=!0
if(s)return null
if(!t.j.b(a)||J.aj(a)!==1)d.j(b,"Expected one Inner Shadow style")
r=new A.c(b,0)
q=d.au(0,J.jR(a),r)
if(!J.m(q.h(0,"ty"),2))d.j(new A.c(r,"ty"),"Unsupported layer style")
d.O(q,r,B.aO)
p=new A.h1(d,q,r)
for(s=["s","ch","no"],o=s.length,n=0;n<o;++n){m=s[n]
if(!J.m(p.$2(m,0),0))d.j(new A.c(r,m),"Unsupported Inner Shadow parameter")}if(!J.m(p.$2("bm",1),1))d.j(new A.c(r,"bm"),"Inner Shadow requires Multiply")
l=d.J(q.h(0,"c"),new A.c(r,"c"),3,A.i([0,0,0],t.n))
if(l.a==null)d.j(new A.c(r,"c"),"Animated Inner Shadow")
k=l.n(0)
s=p.$2("o",100)
if(typeof s!=="number")return s.a8()
j=B.a.B(B.c.F(s*255/100),0,255)
s=p.$2("a",0)
if(typeof s!=="number")return s.N()
i=B.c.N(s,360)*3.141592653589793/180
h=p.$2("d",0)
if(h<0)d.j(new A.c(r,"d"),"Negative Inner Shadow distance")
if(h===0||j===0)return null
s=Math.cos(i)
o=Math.sin(i)
g=k.length
if(0>=g)return A.a(k,0)
f=B.a.B(B.c.F(k[0]*255),0,255)
if(1>=g)return A.a(k,1)
e=B.a.B(B.c.F(k[1]*255),0,255)
if(2>=g)return A.a(k,2)
return A.kj(-s*h,o*h,(j<<24|f<<16|e<<8|B.a.B(B.c.F(k[2]*255),0,255))>>>0)},
d8(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=this,b={}
b.a=b.b=null
b.c=!1
s=c.dt(a,a0,-1,A.i([],t.n),new A.h2(b,c,a))
r=A.i([],t.hg)
q=s.b
if(q!=null&&b.c){p=b.a
p.toString
o=q.a.length
n=A.j8(o,!1,!1,t.y)
m=b.b
m.toString
for(l=p.length,k=m,j=0;j<o;++j){m=j*2
i=m<l
h=i?p[m]:0
if(i){++m
if(!(m<l))return A.a(p,m)
g=p[m]}else g=0
B.b.t(n,j,h===0?k:h===1)
k=g===0?n[j]:g===1}for(m=o-1,i=q.d,f=i.length,j=0;j<o;++j){e=j*2
if(e<l){++e
if(!(e<l))return A.a(p,e)
g=p[e]}else g=0
e=n[j]
if(!(j<f))return A.a(i,j)
if((i[j]&1)!==0)d=e
else d=g!==0?g===1:B.b.h(n,Math.min(j+1,m))
B.b.m(r,new A.F(e,d))}}c.x=c.x+(s.gcr()/6|0)
p=b.b
return new A.aw(s,p!==!1,r)},
cY(e3,e4,e5){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7=this,d8=null,d9="ks",e0="d",e1="Path direction",e2="r"
if(!t.j.b(e3))d7.j(e4,"Expected shape list")
s=t.r
r=A.i([],s)
q=A.i([],t.V)
for(p=t.P,o=t.aT,n=t.eU,m=n.i("k.E"),l=t.n,k=t.u,j=t.S,i=t.W,h=t.fq,g=t.bs,f=t.fP,e=d8,d=0;c=J.M(e3),d<c.gk(e3);++d){b=new A.c(e4,d)
a=c.h(e3,d)
if(!p.b(a))d7.j(b,"Expected object")
a0=a.h(0,"ty")
a1=a.h(0,"bm")
if(a1==null)a1=0
if(!A.p(a1)||a1<0||a1>16)d7.j(new A.c(b,"bm"),"Blend mode "+A.v(a1))
a2=J.m(a.h(0,"hd"),!0)
switch(a0){case"tr":if(e!=null||d!==c.gk(e3)-1)d7.j(b,"Transform must be last and unique")
e=d7.dv(a,b)
break
case"gr":d7.O(a,b,B.aT)
a3=d7.cY(a.h(0,"it"),new A.c(b,"it"),e5)
if(!a2){B.b.m(r,a3)
B.b.m(q,a3)}break
case"sh":d7.O(a,b,B.aV)
if(a.h(0,d9)==null)d7.j(new A.c(b,d9),"Missing path data")
a4=e5.cu(a.h(0,d9),new A.c(b,d9))
if(!a2)B.b.m(r,new A.R(a4))
break
case"rc":case"el":d7.O(a,b,B.b0)
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a5=d7.aZ(a.h(0,"p"),new A.c(b,"p"),2,A.i([0,0],l),!0)
a6=d7.aZ(a.h(0,"s"),new A.c(b,"s"),2,A.i([0,0],l),!0)
a7=d7.J(a.h(0,e2),new A.c(b,e2),1,A.i([0],l))
d7.x+=8
if(!a2)B.b.m(r,new A.R(new A.aS(J.m(a0,"el"),J.m(a.h(0,e0),3),a5,a6,a7)))
break
case"sr":d7.O(a,b,B.aZ)
a8=a.h(0,"sy")
if(a8==null)a8=1
c=J.aA(a8)
if(!c.E(a8,1)&&!c.E(a8,2))d7.j(new A.c(b,"sy"),"PolyStar type "+A.v(a8))
if(a.h(0,e0)!=null&&!J.m(a.h(0,e0),1)&&!J.m(a.h(0,e0),2)&&!J.m(a.h(0,e0),3))d7.j(new A.c(b,e0),e1)
a9=d7.J(a.h(0,"pt"),new A.c(b,"pt"),1,A.i([5],l))
a5=d7.aZ(a.h(0,"p"),new A.c(b,"p"),2,A.i([0,0],l),!0)
b0=d7.J(a.h(0,e2),new A.c(b,e2),1,A.i([0],l))
b1=d7.J(a.h(0,"or"),new A.c(b,"or"),1,A.i([0],l))
b2=d7.J(a.h(0,"os"),new A.c(b,"os"),1,A.i([0],l))
if(c.E(a8,1))if(a.h(0,"ir")!=null){b3=d7.J(a.h(0,"ir"),new A.c(b,"ir"),1,A.i([0],l))
b4=b3}else{b3=new Float32Array(A.T(A.i([0],l)))
b3=new A.A(b3,d8,!1,new Float32Array(0),!1)
b4=b3}else b4=d8
if(c.E(a8,1))if(a.h(0,"is")!=null){b3=d7.J(a.h(0,"is"),new A.c(b,"is"),1,A.i([0],l))
b5=b3}else{b3=new Float32Array(A.T(A.i([0],l)))
b3=new A.A(b3,d8,!1,new Float32Array(0),!1)
b5=b3}else b5=d8
d7.x+=12
if(!a2)B.b.m(r,new A.R(new A.aZ(c.E(a8,1),J.m(a.h(0,e0),3),a9,a5,b0,b1,b2,b4,b5)))
break
case"tm":d7.O(a,b,B.b2)
b6=a.h(0,"m")
if(b6==null)b6=1
c=J.aA(b6)
if(!c.E(b6,1)&&!c.E(b6,2))d7.j(new A.c(b,"m"),"Trim mode")
b3=A.i([],s)
b7=new A.bX(b3,d7.J(a.h(0,"s"),new A.c(b,"s"),1,A.i([0],l)),d7.J(a.h(0,"e"),new A.c(b,"e"),1,A.i([100],l)),d7.J(a.h(0,"o"),new A.c(b,"o"),1,A.i([0],l)),c.E(b6,2),A.ab(j,i))
if(!a2){b8=A.i([],h)
new A.h0(b8).$1(r)
B.b.ah(b3,new A.X(b8,g.a(new A.fZ()),f))
for(b9=0;b9<b8.length;++b9)b8[b9].a=new A.bh(b7,b9)}++d7.x
break
case"fl":case"st":case"gf":case"gs":d7.O(a,b,B.aM)
c=J.aA(a0)
c0=c.E(a0,"st")||c.E(a0,"gs")
if(c0)d7.y=!0
c1=c0?d7.eO(a.h(0,e0),new A.c(b,e0)):d8
c2=a.h(0,e2)
if(c2==null)c2=1
b3=J.aA(c2)
if(!b3.E(c2,1)&&!b3.E(c2,2))d7.j(new A.c(b,e2),"Fill rule")
c3=a.h(0,"lc")
if(c3==null)c3=1
c4=a.h(0,"lj")
if(c4==null)c4=1
if(!A.p(c3)||c3<1||c3>3||!A.p(c4)||c4<1||c4>3)d7.j(b,"Stroke cap/join")
c5=d7.J(a.h(0,"c"),new A.c(b,"c"),3,A.i([0,0,0],l))
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
c6[d0]=d1/255}}d3=d7.J(a.h(0,"o"),new A.c(b,"o"),1,A.i([100],l))
d4=d7.J(a.h(0,"w"),new A.c(b,"w"),1,A.i([1],l))
if(!a2){c7=A.aM(r,k)
b3=b3.E(c2,2)
c8=a.h(0,"ml")
if(c8==null)c8=4
c8=d7.S(c8,new A.c(b,"ml"))
B.b.m(q,A.jo(c7,c5,d3,d4,c0,b3,c3,c4,c8,c1,c.E(a0,"gf")||c.E(a0,"gs")?d7.f0(a,b):d8))}d7.x+=2
break
case"mm":d7.O(a,b,B.aW)
b6=a.h(0,"mm")
if(b6==null)b6=1
if(!A.p(b6)||b6<1||b6>5)d7.j(new A.c(b,"mm"),"Shape op mm mode "+A.v(b6))
if(!a2&&r.length!==0){d5=A.aM(new A.bN(r,o.a(new A.h_()),n),m)
if(d5.length===1)d6=b6===4||r.length>1
else d6=!1
B.b.l(r)
if(d5.length!==0)B.b.m(r,d6?B.b.gae(d5):new A.aQ(d5,b6))}else if(a2)B.b.l(r);++d7.x
break
default:d7.j(new A.c(b,"ty"),"Shape op "+A.v(a0))}}return A.jm(r,q,e==null?A.mK():e)},
eO(a,b){var s,r,q,p,o,n,m,l,k,j=this
if(a==null)return null
if(!t.j.b(a))j.j(b,"Expected dash array")
s=A.i([],t.gC)
for(r=t.n,q=t.P,p=null,o=0;n=J.M(a),o<n.gk(a);++o){m=new A.c(b,o)
n=n.h(a,o)
if(!q.b(n))j.j(new A.c(b,o),"Expected object")
j.O(n,m,B.b1)
l=j.J(n.h(0,"v"),new A.c(m,"v"),1,A.i([0],r))
k=n.h(0,"n")
n=J.aA(k)
if(n.E(k,"o")){if(p!=null)j.j(m,"Duplicate dash offset")
p=l}else if(n.E(k,(s.length&1)===0?"d":"g"))B.b.m(s,l)
else j.j(new A.c(m,"n"),"Expected alternating dash/gap")}q=s.length
if(q===0)return null
if((q&1)===1)B.b.m(s,B.b.gad(s))
return A.kg(s,p==null?A.ce(A.i([0],r)):p)},
f0(a,b){var s,r,q,p,o,n,m,l,k=this
t.P.a(a)
s=k.au(0,a.h(0,"g"),new A.c(b,"g"))
k.O(s,new A.c(b,"g"),B.b4)
r=s.h(0,"p")
if(!A.p(r)||r<=0)k.j(new A.c(new A.c(b,"g"),"p"),"Invalid gradient stop count")
q=t.n
p=k.dt(s.h(0,"k"),new A.c(new A.c(b,"g"),"k"),-1,A.i([],q),new A.fY(k,r))
if(!J.m(a.h(0,"t"),1)&&!J.m(a.h(0,"t"),2))k.j(new A.c(b,"t"),"Gradient type")
o=k.aZ(a.h(0,"s"),new A.c(b,"s"),2,A.i([0,0],q),!0)
n=k.aZ(a.h(0,"e"),new A.c(b,"e"),2,A.i([0,0],q),!0)
m=J.m(a.h(0,"t"),2)
l=a.h(0,"h")==null?null:k.J(a.h(0,"h"),new A.c(b,"h"),1,A.i([0],q))
return A.ki(r,p,o,n,m,l,a.h(0,"a")==null?null:k.J(a.h(0,"a"),new A.c(b,"a"),1,A.i([0],q)))},
bt(a,b,c,d,e,f,g){var s,r,q,p,o=this
t.dg.a(d)
t.c.a(e)
if(a==null)return A.ce(d)
s=o.au(0,a,b)
o.O(s,b,B.G)
if(s.h(0,"a")!=null&&!J.m(s.h(0,"a"),0)&&!J.m(s.h(0,"a"),1))o.j(new A.c(b,"a"),"Invalid animated flag")
if(s.h(0,"x")!=null&&!J.m(s.h(0,"x"),""))o.j(new A.c(b,"x"),"Expressions")
r=new A.c(b,"k")
q=s.h(0,"k")
if(!J.m(s.h(0,"a"),1)){if(t.j.b(q)){p=J.M(q)
p=p.gck(q)&&p.ga6(q) instanceof A.H&&J.ae(p.ga6(q),"t")!=null}else p=!1
p=!p}else p=!1
if(p){p=o.bh(q,r,c,g,e,null,0,0)
return new A.A(p,null,!1,new Float32Array(0),!1)}if(!t.j.b(q)||J.iR(q))o.j(r,"Expected keyframes")
return o.eE(q,r,c,g,f,e)},
J(a,b,c,d){return this.bt(a,b,c,d,null,!1,0)},
aZ(a,b,c,d,e){return this.bt(a,b,c,d,null,e,0)},
dt(a,b,c,d,e){return this.bt(a,b,c,d,e,!1,0)},
fz(a,b,c,d,e){return this.bt(a,b,c,d,null,!1,e)},
du(a,b,c,d){var s
A.j(c)
if(b==null)return new Float32Array(c)
if(c!==d){s=a.a
s.toString
this.j(s,"Morph topology/component count changes")}return b},
bh(a,b,c,d,e,f,g,h){var s,r,q,p,o,n=this
t.c.a(e)
if(e!=null)return e.$5(a,b,f,g,h)
if(f==null)s=new Float32Array(c)
else s=f
if(t.j.b(a)){r=J.M(a)
if(r.gk(a)<c)n.j(b,"Expected "+c+" components")
for(q=0;q<c;++q){p=g+q
o=n.by(r.h(a,q),b,q)
s.$flags&2&&A.h(s)
if(!(p>=0&&p<s.length))return A.a(s,p)
s[p]=o}if(c===2&&r.gk(a)>2&&n.S(r.h(a,2),b)!==d)n.j(b,"Non-planar component")}else{if(c!==1)n.j(b,"Expected "+c+" components")
r=n.by(a,b,0)
s.$flags&2&&A.h(s)
if(!(g>=0&&g<s.length))return A.a(s,g)
s[g]=r}return s},
eE(e7,e8,e9,f0,f1,f2){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3=this,e4=null,e5="Expected object",e6=t.j
e6.a(e7)
t.c.a(f2)
s=J.b0(e7)
r=s.gad(e7)
q=t.P
p=q.b(r)
o=p?r.h(0,"t"):e4
n=!1
if(p)if(r.h(0,"e")!=null){if(!J.m(r.h(0,"h"),1))if(typeof o=="number"){p=e3.e
p===$&&A.D()
p=o<p}else p=n
else p=n
n=p}p=s.gk(e7)
m=p+(n?1:0)
l=new Float64Array(m)
p=m*3
k=new Int32Array(p)
for(j=s.gD(e7),i=0,h=0,g=!1;j.u();){f=j.gA()
if(!q.b(f))continue
if(f.h(0,"e")!=null)++i
if(f.h(0,"i")!=null&&f.h(0,"o")!=null&&!J.m(f.h(0,"h"),1))++h
g=B.t.bF(g,f.h(0,"to")!=null)}j=h*(f1?8:4)
e=new Float64Array(j)
if(g)d=new Float32Array(m*4)
else d=e4
c=A.ei()
b=A.ei()
a=A.ei()
a0=A.ei()
for(a1=2*m,a2=m-1,a3=m+i,a4=e3.a.a,a5=e9===2,a6=m,a7=0,a8=0,a9=0;a9<s.gk(e7);++a9){b0=new A.c(e8,a9)
b1=s.h(e7,a9)
if(!q.b(b1))e3.j(b0,e5)
e3.O(b1,b0,B.aP)
b2=b1.h(0,"to")
b3=b1.h(0,"ti")
b4=b2==null
b5=!b4
if(b5)e3.dD(b2,"to",e9,b0,d,a9*4)
b6=b3==null
if(!b6)e3.dD(b3,"ti",e9,b0,d,a9*4+2)
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
c0=e3.bh(b8,new A.c(b0,"s"),e9,f0,f2,e4,0,0)
if(b.b!==b)A.x(A.f8(""))
b.b=c0
if(a.b!==a)A.x(A.f8(""))
b4=a.b=c0.length
if(a4)b6=b4>=32
else b6=!1
if(b6)b4=(b4+3&4294967292)>>>0
if(a0.b!==a0)A.x(A.f8(""))
a0.b=b4
b4=new Float32Array(a3*b4)
if(c.b!==c)A.x(A.f8(""))
c.b=b4
b6=a.b
if(b6===a)A.x(A.ak(""))
B.j.H(b4,0,b6,c0)}else{b4=a0.b
if(b4===a0)A.x(A.ak(""))
if(typeof b4!=="number")return A.a3(b4)
c1=a9*b4
if(b8==null){b4=c.b
if(b4===c)A.x(A.ak(""))
b6=a.b
if(b6===a)A.x(A.ak(""))
if(typeof b6!=="number")return A.a3(b6)
J.jS(b4,c1,c1+b6,b4,a8)}else{b4=c.b
if(b4===c)A.x(A.ak(""))
b6=a.b
if(b6===a)A.x(A.ak(""))
e3.bh(b8,new A.c(b0,"s"),e9,f0,f2,b4,c1,b6)}}c2=J.m(b1.h(0,"h"),1)
c3=(c2?1:0)|8
if(b5)c3|=4
b4=a0.b
if(b4===a0)A.x(A.ak(""))
if(typeof b4!=="number")return A.a3(b4)
a8=a9*b4
if(b9!=null){c4=a6+1
c1=a6*b4
b4=c.b
if(b4===c)A.x(A.ak(""))
b5=a.b
if(b5===a)A.x(A.ak(""))
e3.bh(b9,new A.c(b0,"e"),e9,f0,f2,b4,c1,b5)
b4=m+a9
k.$flags&2&&A.h(k)
if(!(b4>=0&&b4<p))return A.a(k,b4)
k[b4]=c1
c3=(c3|2)>>>0
a8=c1
a6=c4}else{b5=Math.min(a9+1,a2)
B.e.t(k,m+a9,b5*b4)}b4=a1+a9
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
c9=e3.bi(c5,b0)
d0=e3.bi(c6,b0)
d1=e3.bi(c7,b0)
d2=e3.bi(c8,b0)
d3=Math.max(Math.max(c9,d0),Math.max(d1,d2))
b1=!1
if(d3!==1){b4=a.b
if(b4===a)A.x(A.ak(""))
if(d3!==b4)b1=!(a5&&d3===3)}if(b1)e3.j(b0,"Easing component count")
b1=!0
if(c9===1||c9===d3)if(d0===1||d0===d3)if(d1===1||d1===d3)b1=!(d2===1||d2===d3)
if(b1)e3.j(b0,"Easing component mismatch")
if(f1){b1=a.b
if(b1===a)A.x(A.ak(""))}else{b1=a.b
if(b1===a)A.x(A.ak(""))
b1=Math.min(A.kZ(b1),1)}d4=Math.min(A.kZ(b1),d3)
c3=(c3|d4<<4)>>>0
for(b1=e6.b(c8),b4=e6.b(c7),b5=e6.b(c6),b6=e6.b(c5),d5=0;d5<d4;++d5){if(b6){d6=J.M(c5)
d6=d6.h(c5,d6.gk(c5)===1?0:d5)}else d6=c5
d7=B.c.B(A.eD(d6),0,1)
if(b5){d6=J.M(c6)
d6=d6.h(c6,d6.gk(c6)===1?0:d5)}else d6=c6
A.eD(d6)
if(b4){d8=J.M(c7)
d8=d8.h(c7,d8.gk(c7)===1?0:d5)}else d8=c7
d9=B.c.B(A.eD(d8),0,1)
if(b1){d8=J.M(c8)
d8=d8.h(c8,d8.gk(c8)===1?0:d5)}else d8=c8
A.eD(d8)
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
k[a9]=c3}if(m===1){e6=b.ao()
return new A.A(e6,e4,!1,new Float32Array(0),!1)}if(n){e6=a0.ao()
if(typeof e6!=="number")return A.a3(e6)
c1=a2*e6
e6=e3.e
e6===$&&A.D()
if(!(a2>=0))return A.a(l,a2)
l[a2]=e6
e6=c.ao()
s=a.ao()
if(typeof s!=="number")return A.a3(s)
J.jS(e6,c1,c1+s,c.ao(),a8)
if(!(a2<p))return A.a(k,a2)
k[a2]=8
s=m+a2
k.$flags&2&&A.h(k)
if(!(s>=0&&s<p))return A.a(k,s)
k[s]=c1
a2=a1+a2
if(!(a2>=0&&a2<p))return A.a(k,a2)
k[a2]=a7}e6=a.ao()
s=a0.ao()
q=c.ao()
if(a7===j)p=e
else{e1=e.BYTES_PER_ELEMENT
e2=A.bt(0,a7,B.a.a2(e.byteLength,e1))*e1
if(B.a.N(e2,8)!==0)A.x(A.aB("The number of bytes to view must be a multiple of 8",e4))
p=J.ly(B.i.gab(e),e.byteOffset+0*e1,B.a.I(e2,8))}p=A.lW(l,e6,s,k,q,p,d,a4)
return new A.A(e4,p,a4,new Float32Array(p.b),!1)},
dD(a,b,c,d,e,f){var s,r,q,p,o=this
if(!t.j.b(a)||J.aj(a)<2)o.j(new A.c(d,b),"Invalid spatial tangent")
if(c!==2&&J.lw(a,new A.h4()))o.j(new A.c(d,b),"Spatial tangent on non-position")
s=J.M(a)
r=o.S(s.h(a,0),d)
q=o.S(s.h(a,1),d)
if(e!=null){e.$flags&2&&A.h(e)
s=e.length
if(!(f<s))return A.a(e,f)
e[f]=r
p=f+1
if(!(p<s))return A.a(e,p)
e[p]=q}},
bi(a,b){var s,r
if(!t.j.b(a)){this.S(a,b)
return 1}for(s=J.b0(a),r=s.gD(a);r.u();)this.S(r.gA(),b)
return s.gk(a)}}
A.h5.prototype={
$1(a){var s,r,q
t.D.a(a)
s=!1
if(a.gG()){r=this.a
q=r.d
q===$&&A.D()
if(a.c<=q){s=r.e
s===$&&A.D()
s=a.d>=s}}return s},
$S:35}
A.fW.prototype={
$2$dimensions(a,b){var s,r,q=this,p=new A.c(new A.c(q.b,"ef"),a),o=q.a,n=o.au(0,J.ae(q.c,a),p)
o.O(n,p,B.F)
s=n.h(0,"ty")
r=q.d
if(!(a>=0&&a<r.length))return A.a(r,a)
if(!J.m(s,r[a])||n.h(0,"v")==null)o.j(p,"Invalid effect parameter")
return o.J(n.h(0,"v"),new A.c(p,"v"),b,A.i([],t.n))},
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
$2(a,b){var s=this.a,r=this.c,q=s.J(this.b.h(0,a),new A.c(r,a),1,A.i([b],t.n))
if(q.a==null)s.j(new A.c(r,a),"Animated Inner Shadow")
s=q.n(0)
if(0>=s.length)return A.a(s,0)
return s[0]},
$S:39}
A.h2.prototype={
$5(a,b,c,d,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e=t.j
if(e.b(a)){s=J.M(a)
s=s.gk(a)===1&&s.ga6(a) instanceof A.H}else s=!1
if(s)a=J.lB(a)
s=this.b
r=s.au(0,a,b)
s.O(r,b,B.aN)
q=r.h(0,"c")
if(!A.bj(q))s.j(new A.c(b,"c"),"Expected closed flag")
p=this.a
o=p.b
if(o==null){p.b=q
o=q}p.c=B.t.bF(p.c,q!==o)
o=b.a
n=o==null?null:o.b
if(A.p(n)){m=p.a
if(m==null){o=J.aj(e.a(J.ae(this.c,"k")))
m=p.a=new Uint8Array(o*2)}p=b.b==="e"?1:0
p=n*2+p
o=q?1:2
m.$flags&2&&A.h(m)
if(!(p>=0&&p<m.length))return A.a(m,p)
m[p]=o}l=r.h(0,"v")
k=r.h(0,"i")
j=r.h(0,"o")
p=!0
if(e.b(l))if(e.b(k))if(e.b(j)){e=J.M(l)
e=e.gk(l)!==J.aj(k)||e.gk(l)!==J.aj(j)}else e=p
else e=p
else e=p
if(e)s.j(b,"Invalid path topology")
e=J.M(l)
i=s.du(b,c,e.gk(l)*6,a0)
h=new A.h3(s,b,i)
for(g=0;g<e.gk(l);++g){f=d+g*6
h.$2(e.h(l,g),f)
h.$2(J.ae(k,g),f+2)
h.$2(J.ae(j,g),f+4)}return i},
$S:14}
A.h3.prototype={
$2(a,b){var s,r,q,p,o,n,m=this
if(!t.j.b(a)||J.aj(a)!==2)m.a.j(m.b,"Expected 2D path point")
s=m.c
r=m.a
q=J.M(a)
p=m.b
o=r.S(q.h(a,0),p)
s.$flags&2&&A.h(s)
n=s.length
if(!(b>=0&&b<n))return A.a(s,b)
s[b]=o
o=b+1
p=r.S(q.h(a,1),p)
if(!(o<n))return A.a(s,o)
s[o]=p},
$S:41}
A.h0.prototype={
$1(a){var s,r,q,p
t.cH.a(a)
for(s=a.length,r=this.a,q=0;q<a.length;a.length===s||(0,A.V)(a),++q){p=a[q]
if(p instanceof A.R)B.b.m(r,p)
if(p instanceof A.a5)this.$1(p.a)}},
$S:42}
A.fZ.prototype={
$1(a){return t.bD.a(a).a},
$S:43}
A.h_.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a5)||a.gdV()},
$S:1}
A.fY.prototype={
$5(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this
if(t.j.b(a)){s=J.M(a)
r=k.b*4
s=s.gk(a)<r||(s.gk(a)-r&1)===1}else s=!0
if(s)k.a.j(b,"Invalid gradient stops")
s=k.a
r=J.M(a)
q=s.du(b,c,r.gk(a),e)
for(p=k.b,o=0;o<r.gk(a);++o){n=s.S(r.h(a,o),b)
if(o<p*4&&B.a.N(o,4)!==0){m=B.a.B(B.c.F(n*255),0,255)/255
n=m<=0.04045?m/12.92:Math.pow((m+0.055)/1.055,2.4)}l=d+o
q.$flags&2&&A.h(q)
if(!(l>=0&&l<q.length))return A.a(q,l)
q[l]=n}return q},
$S:14}
A.h4.prototype={
$1(a){return!J.m(a,0)},
$S:13}
A.hb.prototype={
c7(a,b,c,d,e,f){var s,r,q,p,o,n,m,l,k,j
t.ew.a(d)
t.ae.a(e)
s=t.P
if(s.b(a)){r=a.h(0,"x")
if(typeof r=="string"&&r.length!==0){if(f){q=$.jN()
q=q.b.test(r)}else q=!1
if(q)return
for(q=d.length,p=c,o=0;o<q;++o){n=d[o]
p=A.p(n)?new A.c(p,n):new A.c(p,A.K(n))}if(this.fl(a,r,b,p,e==null?new A.bS(t.ao):e))return}for(q=a.gar(),q=q.gD(q),m=t.j;q.u();){l=q.gA()
k=a.h(0,l)
if(!s.b(k)&&!m.b(k))continue
B.b.m(d,l)
this.c7(k,b,c,d,e,l==="ks"&&J.m(a.h(0,"ty"),"sh"))
if(0>=d.length)return A.a(d,-1)
d.pop()}}else{q=t.j
if(q.b(a))for(m=J.M(a),j=0;j<m.gk(a);++j){k=m.h(a,j)
if(!s.b(k)&&!q.b(k))continue
B.b.m(d,j)
this.dB(k,b,c,d,e)
if(0>=d.length)return A.a(d,-1)
d.pop()}}},
fA(a,b,c,d){return this.c7(a,b,c,d,null,!1)},
dB(a,b,c,d,e){return this.c7(a,b,c,d,e,!1)},
fl(a0,a1,a2,a3,a4){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this,a=null
t.P.a(a0)
t.bC.a(a4)
if(!a4.m(0,a0))b.a.j(a3,"Cyclic expression reference")
try{i=$.lp()
if(i.b.test(a1)){a0.K(0,"x")
return!0}s=new A.c(a3,"x")
r=$.ln().dS(a1)
if(r==null)b.a.j(s,"Unsupported expression syntax")
q=a2
p=null
i=$.jO()
h=r.b
if(1>=h.length)return A.a(h,1)
h=h[1]
h.toString
h=i.dE(0,h)
h=new A.cf(h.a,h.b,h.c)
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
d=$.lo()
c=A.K(n)
m=d.b.test(c)?B.x.dP('"'+A.v(n)+'"',a):n
p=b.c5(q,"nm",A.K(m))
if(p==null)f.j(s,"Missing/ambiguous content reference")
q=i.a(i.b(p.h(0,"it"))?p.h(0,"it"):B.A)}l=null
i=r.b
if(2>=i.length)return A.a(i,2)
switch(i[2]){case"transform.scale":i=b.c5(q,"ty","tr")
l=i==null?a:i.h(0,"s")
break
case"transform.rotation":i=b.c5(q,"ty","tr")
l=i==null?a:i.h(0,"r")
break
default:i=p
l=i==null?a:J.ae(i,"o")
break}k=l
j=f.au(0,k,s)
if(j===a0){a0.K(0,"x")
return!0}b.dB(j,a2,s,A.i([],t.f),a4)
a0.l(0)
a0.ah(0,j)
return!1}finally{a4.K(0,a0)}},
c5(a,b,c){var s,r,q,p
for(s=J.cv(a),r=t.P,q=null;s.u();){p=s.gA()
if(!r.b(p)||!J.m(p.h(0,b),c))continue
if(q!=null)return null
q=p}return q}}
A.hU.prototype={
cu(a,b){var s,r,q,p,o,n,m,l=this,k=l.a,j=k.au(0,a,b),i=l.c,h=i.h(0,j)
if(h!=null)return h
n=J.ae(j,"x")
s=typeof n=="string"?$.jN().dS(n):null
if(s==null){k=k.d8(j,b)
i.t(0,j,k)
return k}r=new A.c(b,"x")
k.O(j,b,B.G)
if(J.ae(j,"a")!=null&&!J.m(J.ae(j,"a"),0)&&!J.m(J.ae(j,"a"),1))k.j(new A.c(b,"a"),"Invalid animated flag")
m=l.d
if(!m.m(0,j))k.j(r,"Cyclic path reference")
try{q=null
p=null
o=l.fw(s,r)
q=o.a
p=o.b
k=l.cu(q,p)
i.t(0,j,k)
return k}finally{m.K(0,j)}},
fw(a,b){var s,r,q,p,o,n,m,l,k,j=this,i=a.b
if(1>=i.length)return A.a(i,1)
s=i[1]
s.toString
r=j.d2(j.b,s,B.n,b,"layer")
q=r.a
if(!J.m(q.h(0,"ty"),4))j.a.j(b,"Path reference needs a shape layer")
p=q.h(0,"shapes")
o=new A.c(r.b,"shapes")
s=$.jO()
if(2>=i.length)return A.a(i,2)
i=i[2]
i.toString
i=s.dE(0,i)
i=new A.cf(i.a,i.b,i.c)
s=t.d
while(i.u()){n=i.d
m=(n==null?s.a(n):n).b
if(1>=m.length)return A.a(m,1)
m=m[1]
m.toString
l=j.d2(p,m,o,b,"content")
q=l.a
o=l.b
p=J.m(q.h(0,"ty"),"gr")?q.h(0,"it"):null
if(p!=null)o=new A.c(o,"it")}k=q.h(0,"ks")
if(!J.m(q.h(0,"ty"),"sh")||!t.P.b(k))j.a.j(b,"Path reference needs a B\xe9zier path")
return new A.F(k,new A.c(o,"ks"))},
d2(a,b,c,d,e){var s,r,q,p,o,n,m,l
if(t.j.b(a)){for(s=J.M(a),r=t.P,q=this.a,p="Ambiguous "+e+" reference: "+b,o=null,n=0,m=0;m<s.gk(a);++m){l=s.h(a,m)
if(r.b(l)&&J.m(l.h(0,"nm"),b)){if(o!=null)q.j(d,p)
n=m
o=l}}if(o!=null)return new A.F(o,new A.c(c,n))}this.a.j(d,"Missing "+e+" reference: "+b)}}
A.en.prototype={
a0(a,b,c){var s
A.o_(c,t.K,"T","_copy")
s=c.a(this.b.e0(c.a(a),c.i("0()").a(b)))
return s},
C(a){var s=t.A
s.a(a)
if(a.a!=null)return a
return this.a0(a,new A.hq(a),s)},
e4(a){return this.a0(a,new A.hr(this,a),t.d1)},
cA(a){var s=this,r=t.u
r.a(a)
if(a instanceof A.a5)return s.bE(a)
if(a instanceof A.R)return s.a0(a,new A.hk(s,a),r)
if(a instanceof A.bh)return s.a0(a,new A.hl(s,a),r)
if(a instanceof A.aQ)return s.a0(a,new A.hm(s,a),r)
if(a instanceof A.aw)return s.a0(a,new A.hn(s,a),r)
if(a instanceof A.aS)return s.a0(a,new A.ho(s,a),r)
if(a instanceof A.aZ)return s.a0(a,new A.hp(s,a),r)
throw A.f(A.aD("Unknown compiled geometry"))},
fU(a){var s=t.G
s.a(a)
if(a instanceof A.a5)return this.bE(a)
if(a instanceof A.bg)return this.a0(a,new A.he(this,a),s)
throw A.f(A.aD("Unknown compiled paint"))},
bE(a){return this.a0(a,new A.hg(this,a),t.eV)},
ea(a){return this.a0(a,new A.hf(this,a),t.I)},
hr(a,b){return this.a0(b,new A.hs(this,b),t.e_)},
fI(a){return this.a0(a,new A.hd(this,a),t.bo)},
he(a){var s=t.J
s.a(a)
return this.a0(a,new A.hi(this,a),s)},
cm(a){var s=t.D
s.a(a)
return this.a0(a,new A.hh(this,a),s)},
cv(a){return this.a0(a,new A.hj(this,a),t.E)}}
A.hq.prototype={
$0(){var s=this.a
return new A.A(s.a,s.b,s.c,new Float32Array(s.d.length),s.f)},
$S:50}
A.hr.prototype={
$0(){var s,r,q=null,p=this.a,o=this.b,n=p.C(o.a),m=p.C(o.b),l=p.C(o.c),k=p.C(o.d),j=p.C(o.e),i=o.f
i=i==null?q:p.C(i)
s=o.r
s=s==null?q:p.C(s)
r=o.w
r=r==null?q:p.C(r)
o=o.x
return A.jp(n,m,l,k,j,i,s,r,o==null?q:p.C(o))},
$S:51}
A.hk.prototype={
$0(){return new A.R(this.a.cA(this.b.a))},
$S:52}
A.hl.prototype={
$0(){var s=this.b
return new A.bh(this.a.hr(0,s.a),s.b)},
$S:53}
A.hm.prototype={
$0(){var s=this.b,r=s.a,q=A.a1(r),p=q.i("X<1,z>")
r=A.aM(new A.X(r,q.i("z(1)").a(this.a.gb7()),p),p.i("a4.E"))
return A.mz(r,s.b)},
$S:54}
A.hn.prototype={
$0(){var s=this.b
return new A.aw(this.a.C(s.e),s.f,s.r)},
$S:55}
A.ho.prototype={
$0(){var s=this.b,r=this.a
return new A.aS(s.e,s.f,r.C(s.r),r.C(s.w),r.C(s.x))},
$S:84}
A.hp.prototype={
$0(){var s,r=this.b,q=this.a,p=q.C(r.r),o=q.C(r.w),n=q.C(r.x),m=q.C(r.y),l=q.C(r.z),k=r.Q
k=k==null?null:q.C(k)
s=r.as
q=s==null?null:q.C(s)
return new A.aZ(r.e,r.f,p,o,n,m,l,k,q)},
$S:57}
A.he.prototype={
$0(){var s,r,q,p=this.b,o=p.a,n=this.a,m=A.a1(o),l=m.i("X<1,z>")
o=A.aM(new A.X(o,m.i("z(1)").a(n.gb7()),l),l.i("a4.E"))
m=n.C(p.b)
l=n.C(p.c)
s=n.C(p.d)
r=p.y
r=r==null?null:n.ea(r)
q=p.z
n=q==null?null:n.fI(q)
return A.jo(o,m,l,s,p.e,p.f,p.r,p.w,p.x,n,r)},
$S:58}
A.hg.prototype={
$0(){var s,r=this.b,q=r.a,p=this.a,o=A.a1(q),n=o.i("X<1,z>")
q=A.aM(new A.X(q,o.i("z(1)").a(p.gb7()),n),n.i("a4.E"))
o=r.b
n=A.a1(o)
s=n.i("X<1,aG>")
o=A.aM(new A.X(o,n.i("aG(1)").a(p.gfT()),s),s.i("a4.E"))
return A.jm(q,o,p.e4(r.c))},
$S:59}
A.hf.prototype={
$0(){var s,r=this.b,q=this.a,p=q.C(r.c),o=q.C(r.d),n=q.C(r.e),m=r.f
m=m==null?null:q.C(m)
s=r.r
q=s==null?null:q.C(s)
return A.ki(r.a,p,o,n,r.w,m,q)},
$S:60}
A.hs.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a1(r),o=p.i("X<1,z>")
r=A.aM(new A.X(r,p.i("z(1)").a(q.gb7()),o),o.i("a4.E"))
return A.mL(r,q.C(s.b),q.C(s.c),q.C(s.d),s.e)},
$S:61}
A.hd.prototype={
$0(){var s=this.b,r=s.a,q=this.a,p=A.a1(r),o=p.i("X<1,A>")
r=A.aM(new A.X(r,p.i("A(1)").a(q.ghq()),o),o.i("a4.E"))
return A.kg(r,q.C(s.b))},
$S:62}
A.hi.prototype={
$0(){var s=this.a,r=this.b,q=r.a,p=s.C(q.e),o=s.C(r.c),n=r.e
s=n==null?null:s.C(n)
return new A.a7(new A.aw(p,q.f,q.r),r.b,o,r.d,s)},
$S:63}
A.hh.prototype={
$0(){var s,r,q,p,o,n=null,m=this.a,l=this.b,k=m.e4(l.a),j=l.b
j=j==null?n:m.bE(j)
s=l.f
s=s==null?n:m.cv(s)
r=l.x
r=r==null?n:m.C(r)
q=l.z
if(q==null)q=n
else{p=A.a1(q)
o=p.i("X<1,a7>")
q=A.aM(new A.X(q,p.i("a7(1)").a(m.ghd()),o),o.i("a4.E"))}p=l.at
p=p==null?n:new A.em(m.C(p.a),m.C(p.b))
o=l.as
o=o==null?n:A.kj(o.a,o.b,o.c)
r=A.kk(k,j,l.c,l.d,l.e,l.Q,s,p,o,q,l.y,l.r,l.w,r,l.ax)
k=l.cy
r.cy=k==null?n:m.cm(k)
r.ch=l.ch
return r},
$S:64}
A.hj.prototype={
$0(){var s,r,q,p,o=this.b,n=A.jk(o.a),m=o.b
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
r=A.a1(o)
B.b.ah(m,new A.X(o,r.i("a6(1)").a(s.gha()),r.i("X<1,a6>")))
for(q=0;q<o.length;++q){p=o[q].ay
if(p!=null){if(!(q<m.length))return A.a(m,q)
m[q].ay=s.cm(p)}}return n},
$S:65}
A.be.prototype={
gh4(){var s,r=!1
if(this.w){s=this.f
if(s!=null)if(s.a!=null){r=s.n(0)
if(0>=r.length)return A.a(r,0)
r=r[0]!==0}else r=!0}return r},
h_(a,b,c){var s,r,q,p,o=this.f
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
return new A.F(Math.cos(p)*r,Math.sin(p)*r)},
eD(a,b){var s,r,q,p,o,n,m
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
A.R.prototype={
gG(){return this.a.gG()},
ga5(){return this.a.ga5()},
a7(a){return this.a.a7(a)},
$iz:1}
A.bh.prototype={
gG(){return this.a.gG()},
ga5(){return this.a.gG()},
a7(a){var s=this.a.a,r=this.b
if(!(r<s.length))return A.a(s,r)
return s[r].a7(a)},
$iz:1}
A.bX.prototype={
gG(){var s,r=this,q=r.f
if(q===$){s=r.b.a!=null&&r.c.a!=null&&r.d.a!=null&&B.b.ac(r.a,new A.i0())
r.f!==$&&A.P()
q=r.f=s}return q}}
A.i0.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.cj.prototype={
gG(){var s,r=this,q=r.e
if(q===$){s=r.b.a!=null&&B.b.ac(r.a,new A.h6())
r.e!==$&&A.P()
q=r.e=s}return q}}
A.h6.prototype={
$1(a){return t.A.a(a).a!=null},
$S:66}
A.bW.prototype={
gd1(){var s=this.y
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
gcl(){var s,r=this,q=r.ax
if(q===$){s=A.jq(r.c,100,100)&&A.ez(r.d,0)&&A.ez(r.w,0)
r.ax!==$&&A.P()
q=r.ax=s}return q},
gaD(){var s,r,q=this,p=q.ay
if(p===$){s=!1
if(q.gcl())if(A.jq(q.a,0,0)){r=q.f
if(r==null&&q.r==null)r=A.jq(q.b,0,0)
else r=A.ez(r,0)&&A.ez(q.r,0)
s=r}q.ay!==$&&A.P()
p=q.ay=s}return p},
gG(){var s,r=this,q=r.ch
if(q===$){s=r.gaP()&&r.e.a!=null
r.ch!==$&&A.P()
q=r.ch=s}return q},
gci(){var s,r=this,q=r.CW
if(q===$){s=A.ez(r.e,100)
r.CW!==$&&A.P()
r.CW=s
q=s}return q},
cV(a){var s,r,q,p,o=this
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
dY(a6){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=null
if(a4.as!==a6)s=a4.gaP()&&!isNaN(a4.as)
else s=!0
if(s)return a4.gd1()
a4.as=a6
r=a4.gd1()
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
cq(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
if(b.gaD())return a
if(b.gcl()){b.cV(a0)
s=b.z
if(Math.abs(s)<0.00001&&Math.abs(b.Q)<0.00001)s=a
else{r=b.Q
r=new A.a9(a.a+s,a.b+r,a.c+s,a.d+r)
s=r}return s}q=b.dY(a0)
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
return new A.a9(f-d,e-c,f+d,e+c)}}
A.a7.prototype={
gG(){var s,r,q=this,p=q.f
if(p===$){s=!1
if(q.a.e.a!=null)if(q.c.a!=null){r=q.e
r=r==null?null:r.a!=null
r=r!==!1
s=r}p=q.f=s}return p},
gc9(){if(!this.d){var s=this.b
s=s==="a"||s==="i"||s==="f"}else s=!1
return s}}
A.hJ.prototype={
aO(a){var s=this.c
return 255-A.av((255-(B.a.fs(s,a)&255))*(s>>>24))}}
A.em.prototype={
fD(a){var s,r,q,p=this.a.n(a),o=new A.hc(),n=this.b.n(a)
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
if(typeof o!=="number")return A.a3(o)
return(n<<24|r<<16|q<<8|o)>>>0}}
A.hc.prototype={
$1(a){return B.c.F(B.c.B(a,0,1)*255)},
$S:67}
A.a6.prototype={
gG(){var s,r,q=this,p=null,o=q.db
if(o===$){s=!1
if(q.a.gG()){r=q.x
r=r==null?p:r.a!=null
if(r!==!1){r=q.b
r=r==null?p:r.gG()
if(r!==!1){r=q.f
r=r==null?p:r.gG()
if(r!==!1){r=q.at
if(r==null)r=p
else r=r.a.a!=null&&r.b.a!=null
if(r!==!1){r=q.cy
r=r==null?p:r.gG()
if(r!==!1){r=q.z
r=r==null?p:B.b.ac(r,new A.hO())
r=r!==!1}else r=s}else r=s}else r=s}else r=s
s=r}}q.db!==$&&A.P()
o=q.db=s}return o},
gh2(){var s,r=this,q=r.dx
if(q===$){s=r.z
s=s==null?null:B.b.ap(s,new A.hM())
r.dx!==$&&A.P()
q=r.dx=s===!0}return q},
gh5(){var s,r=this,q=r.dy
if(q===$){s=r.z
s=s==null?null:B.b.ac(s,new A.hN())
r.dy!==$&&A.P()
q=r.dy=s===!0}return q},
gdW(){var s,r,q=this,p=q.fr
if(p===$){if(q.a.gaP()){s=q.cy
s=s==null?null:s.gdW()
r=s!==!1}else r=!1
q.fr!==$&&A.P()
p=q.fr=r}return p},
gdU(){var s,r,q=this,p=q.fx
if(p===$){if(q.a.gaD()){s=q.cy
s=s==null?null:s.gdU()
r=s===!0}else r=!0
q.fx!==$&&A.P()
p=q.fx=r}return p},
aw(a){var s,r,q,p,o,n,m,l,k,j,i,h=this,g=null
if(!h.e7(a))return g
s=h.f
r=s==null
if(r&&h.gG()&&!isNaN(h.go))return h.fy
if(h.go===a)return h.fy
h.go=a
q=h.b
p=q==null?g:q.b_(a)
if(!r){r=h.x
if(r!=null){r=r.n(a)
if(0>=r.length)return A.a(r,0)
r=r[0]
q=s.f
q===$&&A.D()
o=s.d
o===$&&A.D()
n=r*q-o}else n=(a-h.r)/h.w
p=A.c_(p,s.aw(n))}if(p==null)return h.fy=null
s=h.z
if(s!=null)r=s.length===1&&B.b.gae(s).gc9()||B.b.ac(s,new A.hP())
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
j=new A.a9(r.a-q,r.b-q,r.c+q,r.d+q)}if(j!=null)m=A.c_(m,j)}}if(m!=null){p=p.bx(m)
if(p.gR(0))return h.fy=null}}for(i=h;i!=null;i=i.cy)p=i.a.cq(p,a)
return h.fy=p},
e7(a){var s,r=this
if(!r.e)s=(r.b!=null||r.f!=null)&&a>=r.c&&a<r.d
else s=!1
return s},
hb(a,b){var s=this.a.e.n(a)
if(0>=s.length)return A.a(s,0)
return B.a.B(B.c.Y(b*B.c.F(s[0])/100),0,255)},
aR(a){var s,r=this.z,q=!1
if(r!=null){s=r.length
if(s===1){if(0>=s)return A.a(r,0)
q=r[0].gc9()}}if(q){if(0>=r.length)return A.a(r,0)
q=r[0].c.n(a)
if(0>=q.length)return A.a(q,0)
return B.a.B(B.c.F(q[0]*255/100),0,255)}return 255}}
A.hO.prototype={
$1(a){return t.J.a(a).gG()},
$S:2}
A.hM.prototype={
$1(a){return t.J.a(a).b!=="n"},
$S:2}
A.hN.prototype={
$1(a){t.J.a(a)
return a.b==="n"||a.gG()},
$S:2}
A.hP.prototype={
$1(a){t.J.a(a)
return a.b==="a"&&!a.d},
$S:2}
A.a5.prototype={
gdV(){var s,r=this,q=r.d
if(q===$){s=B.b.ap(r.a,new A.hF())
r.d!==$&&A.P()
r.d=s
q=s}return q},
gb6(){var s,r=this,q=r.e
if(q===$){s=r.eZ()
r.e!==$&&A.P()
r.e=s
q=s}return q},
eZ(){var s,r,q,p,o,n=this.b
if(n.length===1){s=B.b.gae(n)
if(s instanceof A.a5){r=s.c
r=r.gaD()&&r.gci()}else r=!1
return r?s.gb6():n}for(q=null,p=0;p<n.length;++p){o=n[p]
if(o instanceof A.a5){r=o.c
r=r.gaD()&&r.gci()}else r=!1
if(r){if(q==null)q=B.b.ej(n,0,p)
B.b.ah(q,o.gb6())}else if(q!=null)B.b.m(q,o)}return q==null?n:q},
gcz(){var s,r,q,p=this,o=p.f
if(o===$){s=p.gb6()
r=null
if(!(s.length!==1)){q=B.b.gae(s)
A:{if(q instanceof A.bg){s=q
break A}if(q instanceof A.a5){s=q.gcz()
break A}s=r
break A}r=s}p.f!==$&&A.P()
o=p.f=r}return o},
gG(){var s,r=this,q=r.ax
if(q===$){s=r.c.gG()&&B.b.ac(r.a,new A.hH())&&B.b.ac(r.b,new A.hI())
r.ax!==$&&A.P()
q=r.ax=s}return q},
ga5(){var s,r=this,q=r.ay
if(q===$){s=r.c.gaP()&&B.b.ac(r.a,new A.hG())
r.ay!==$&&A.P()
q=r.ay=s}return q},
a7(a){var s,r,q,p,o=this
if(o.ga5()&&!isNaN(o.as))return o.z
if(o.as===a)return o.z
o.as=a
for(s=o.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.V)(s),++p)q=A.c_(q,s[p].a7(a))
if(q==null)return o.z=null
return o.z=o.c.cq(q,a)},
b_(a){var s,r,q,p,o,n=this
if(n.gG()&&!isNaN(n.at))return n.Q
if(n.at===a)return n.Q
n.at=a
s=n.c
r=s.e.n(a)
if(0>=r.length)return A.a(r,0)
if(B.c.F(r[0])<=0)return n.Q=null
for(r=n.b,q=r.length,p=null,o=0;o<r.length;r.length===q||(0,A.V)(r),++o)p=A.c_(p,r[o].b_(a))
if(p==null)return n.Q=null
return n.Q=s.cq(p,a)},
$iaG:1,
$iz:1}
A.hF.prototype={
$1(a){t.u.a(a)
return!(a instanceof A.a5)||a.gdV()},
$S:1}
A.hH.prototype={
$1(a){return t.u.a(a).gG()},
$S:1}
A.hI.prototype={
$1(a){return t.G.a(a).gG()},
$S:69}
A.hG.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.aQ.prototype={
gG(){var s,r=this,q=r.d
if(q===$){s=B.b.ac(r.a,new A.hR())
r.d!==$&&A.P()
r.d=s
q=s}return q},
ga5(){var s,r=this,q=r.e
if(q===$){s=B.b.ac(r.a,new A.hQ())
r.e!==$&&A.P()
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
if(q===4){p=B.b.gad(s).a7(a)
if(p==null)return k.w=null
for(o=j,n=0;n<s.length-1;++n)o=A.c_(o,s[n].a7(a))
if(o==null)return k.w=null
m=p.bx(o)
return k.w=m.gR(0)?j:m}if(q===3)--r
for(l=j,n=0;n<r;++n){if(!(n<s.length))return A.a(s,n)
l=A.c_(l,s[n].a7(a))}return k.w=l},
$iz:1}
A.hR.prototype={
$1(a){return t.u.a(a).gG()},
$S:1}
A.hQ.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.ep.prototype={
ga5(){return this.gG()},
a7(a){var s=this
if(s.gG()&&!isNaN(s.d))return s.c
if(s.d===a)return s.c
s.d=a
return s.c=s.cd(a)},
$iz:1}
A.aw.prototype={
gG(){return this.e.a!=null},
cd(a){var s,r,q,p,o,n,m,l,k,j,i,h,g=this.e.n(a),f=g.length
if(f===0)return B.aL
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
if(h>q)q=h}return new A.a9(s,r,p,q)}}
A.aS.prototype={
gG(){return this.r.a!=null&&this.w.a!=null&&this.x.a!=null},
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
return new A.a9(q-s,n-r,q+s,n+r)}}
A.aZ.prototype={
gG(){var s,r=this,q=!1
if(r.r.a!=null)if(r.w.a!=null)if(r.x.a!=null)if(r.y.a!=null)if(r.z.a!=null){s=r.Q
s=s==null?null:s.a!=null
if(s!==!1){q=r.as
q=q==null?null:q.a!=null
q=q!==!1}}return q},
cd(a){var s,r,q=this.w.n(a),p=this.y.n(a)
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
return new A.a9(p-r,s-r,p+r,s+r)},
f_(d5,d6,d7,d8,d9){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3=this,d4=t.bp
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
A.bg.prototype={
gc4(){var s,r=this,q=r.fr
if(q===$){s=B.b.ac(r.a,new A.hY())
r.fr!==$&&A.P()
r.fr=s
q=s}return q},
fm(){var s,r=this
if(r.e||r.z!=null||r.a.length!==1)return null
s=B.b.gae(r.a)
while(s instanceof A.R)s=s.a
if((s instanceof A.aS||s instanceof A.aw||s instanceof A.aZ)&&s.gG())return s
return null},
cW(a){var s,r,q,p
for(s=this.a,r=s.length,q=null,p=0;p<s.length;s.length===r||(0,A.V)(s),++p)q=A.c_(q,s[p].a7(a))
return q},
gG(){var s,r,q,p=this,o=null,n=!1
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
n=n==null?o:n.gG()
n=n!==!1}}return n},
b_(a){var s,r,q,p,o,n,m=this,l=m.c.n(a)
if(0>=l.length)return A.a(l,0)
if(B.c.F(l[0])<=0)return null
if(m.e){l=m.d.n(a)
if(0>=l.length)return A.a(l,0)
s=l[0]
if(s<=0)return null
r=m.w===1?Math.max(1.42,m.x):1.42
q=s*0.5*r+1}else q=0
if(m.gc4()){p=m.fy
if(p===$){o=m.cW(0)
m.fy!==$&&A.P()
m.fy=o
p=o}n=p}else n=m.cW(a)
if(n==null)return null
return q===0?n:n.h6(q)},
$iaG:1}
A.hY.prototype={
$1(a){return t.u.a(a).ga5()},
$S:1}
A.bn.prototype={
aH(a){var s=this.a,r=s.length
if(r>=a)return s
while(r<a)r*=2
return this.a=new Float64Array(r)},
Z(a){var s=a?256:4096
if(this.a.length>s)this.a=new Float64Array(256)},
af(){return this.Z(!1)}}
A.ah.prototype={
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
af(){return this.Z(!1)},
bl(){var s,r=this,q=r.a,p=q.length*2,o=new Float64Array(p)
B.i.H(o,0,r.f,q)
s=new Float64Array(p)
B.i.H(s,0,r.f,r.b)
r.a=o
r.b=s},
fW(a){while(this.c.length<a)this.d_()},
d_(){var s=this,r=s.c,q=r.length*2,p=new Int32Array(q)
B.e.H(p,0,s.r,r)
s.c=p
r=new Int32Array(q)
B.e.H(r,0,s.r,s.d)
s.d=r
r=new Uint8Array(q)
B.d.H(r,0,s.r,s.e)
s.e=r},
a4(a){var s,r,q,p=this
if(p.x)p.a1()
p.x=!0
p.w=p.f
if(p.r===p.c.length)p.d_()
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
q(a,b){var s,r,q,p=this,o=p.f
if(o>p.w){s=p.a
r=o-1
if(!(r>=0&&r<s.length))return A.a(s,r)
q=s[r]
s=p.b
if(!(r<s.length))return A.a(s,r)
if(Math.abs(a-q)+Math.abs(b-s[r])<1e-7)return}if(o===p.a.length)p.bl()
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
c8(a,a0,a1,a2,a3,a4,a5,a6,a7,a8){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b=this
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
b.c8(a,a0,o,n,i,h,e,d,a7,c)
b.c8(e,d,g,f,k,j,a5,a6,a7,c)},
U(a,b,c,d,e,f,g,h,i){return this.c8(a,b,c,d,e,f,g,h,i,0)},
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
aF(a,b,c,d,e,f,g){var s,r,q,p,o,n,m,l,k,j=this,i=b===1&&c===0&&d===0&&e===1&&f===0&&g===0
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
if(i)for(o=q;o<p;++o){if(j.f===j.a.length)j.bl()
r=j.a
n=j.f
m=a.a
if(!(o>=0&&o<m.length))return A.a(m,o)
m=m[o]
r.$flags&2&&A.h(r)
if(!(n>=0&&n<r.length))return A.a(r,n)
r[n]=m
m=j.b
r=a.b
if(!(o<r.length))return A.a(r,o)
r=r[o]
m.$flags&2&&A.h(m)
if(!(n<m.length))return A.a(m,n)
m[n]=r
j.f=n+1}else for(o=q;o<p;++o){r=a.a
if(!(o>=0&&o<r.length))return A.a(r,o)
l=r[o]
r=a.b
if(!(o<r.length))return A.a(r,o)
k=r[o]
if(j.f===j.a.length)j.bl()
r=j.a
n=j.f
r.$flags&2&&A.h(r)
if(!(n>=0&&n<r.length))return A.a(r,n)
r[n]=b*l+d*k+f
r=j.b
r.$flags&2&&A.h(r)
if(!(n<r.length))return A.a(r,n)
r[n]=c*l+e*k+g
j.f=n+1}j.a1()}},
fC(a){var s,r,q,p,o,n,m,l=this
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
for(o=p-1;o>=q;--o){if(l.f===l.a.length)l.bl()
r=l.a
n=l.f
m=a.a
if(!(o>=0&&o<m.length))return A.a(m,o)
m=m[o]
r.$flags&2&&A.h(r)
if(!(n>=0&&n<r.length))return A.a(r,n)
r[n]=m
m=l.b
r=a.b
if(!(o<r.length))return A.a(r,o)
r=r[o]
m.$flags&2&&A.h(m)
if(!(n<m.length))return A.a(m,n)
m[n]=r
l.f=n+1}l.a1()}}}
A.aC.prototype={
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
Z(a){var s
this.l(0)
s=a?1024:16384
if(this.a.gv().length>s*2)this.a.av(2048,0)},
af(){return this.Z(!1)},
dO(a){var s=this,r=a.b*2
if(s.a.gv().length<r)s.a.av(r,0)
B.e.H(s.a.gv(),0,r,a.a.gv())
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
q.av(q.gv().length*2,f.b*2)}g=f.a.gv()
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
ee(a){var s,r,q,p,o,n,m,l,k,j,i=this
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
s[j]=(l&4294967040|k-1)>>>0}i.b=B.a.I(o,2)}}
A.eX.prototype={
aM(a){if(!isFinite(a))return 0
if(a>1048576)a=1048576
return B.c.F((a<-1048576?-1048576:a)*256)},
hh(a,b,c,a0,a1,a2,a3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
d.bS()
d.CW=d.aM(g)
d.cx=d.aM(f)
for(e=i+1;e<h;++e){if(!(e<s))return A.a(k,e)
p=k[e]
if(!(e<r))return A.a(j,e)
o=j[e]
d.dd(d.aM(p),d.aM(o))}d.dd(d.aM(g),d.aM(f))}d.em(b,c)},
bS(){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this
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
B.e.H(k,0,q,j)
d.c=k
q=new Int32Array(e)
B.e.H(q,0,d.r,d.d)
d.d=q
q=new Int32Array(e)
B.e.H(q,0,d.r,d.e)
d.e=q
q=new Int32Array(e)
B.e.H(q,0,d.r,d.f)
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
df(a,b){var s=this
if(s.fr){if(s.cy===a&&s.db===b)return
s.bS()}s.cy=a
s.db=b
s.dy=s.dx=0
s.fr=!0},
aC(a,b,c,d,e){var s,r=this
if(e===0)return
s=r.w
if(b<s){r.df(s,a)
r.dx+=e
return}if(b>=r.y)return
r.df(b,a)
r.dx+=e
r.dy=r.dy+(c+d)*e},
aE(a,b,c,d,e){var s,r,q,p,o,n,m,l,k,j,i,h,g=this,f=e-c
if(f===0||a<g.x||a>=g.z)return
s=B.a.b4(B.a.L(b,8),32)
r=B.a.b4(B.a.L(d,8),32)
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
dd(a,b){this.fj(a,b)
return},
fj(a,a0){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.CW,b=d.cx
d.CW=a
d.cx=a0
s=a0-b
if(s===0)return
r=B.a.b4(B.a.L(b,8),32)
q=B.a.b4(B.a.L(a0,8),32)
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
em(a,b){this.fv(a,b)
return},
fv(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
i.bS()
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
if(k>m&&l!==0){j=A.iW(l*512,a)
if(j>0)b.aN(o,m,k-m,j)}s=i.d
if(!(n<s.length))return A.a(s,n)
l+=s[n]
s=i.e
if(!(n<s.length))return A.a(s,n)
j=A.iW(l*512-s[n],a)
if(j>0)b.aN(o,k,1,j)
m=k+1
s=i.f
if(!(n<s.length))return A.a(s,n)
n=s[n]}if(l!==0&&m<i.y){j=A.iW(l*512,a)
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
return B.a.B(B.c.F((a*(255-s)+b*(255-r)+r*s*c)/255),0,this.c)},
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
A.dI.prototype={
E(a,b){var s
if(b==null)return!1
if(this!==b)s=b instanceof A.dI&&A.iu(b)===A.iu(this)&&b.a===this.a
else s=!0
return s},
gW(a){return A.dZ(A.iu(this),this.a,B.m,B.m)}}
A.f6.prototype={
eo(a6,a7,a8,a9,b0,b1,b2,b3){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4=this,a5=a4.r
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
c=new A.ew(new Float64Array(A.T(A.i([h,b,h+a,b+a0,d+a1,a2+a5[a3],d,a2],k))),c)
c.ep(q,g,f,a5,e)
B.b.t(j,i,c)}}},
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
l=new A.f7()
for(r=3*n,p=3*q,k=3*(1-r+p),r=2*(r-6*q),j=b,i=0,h=1,g=0;g<16;++g){f=l.$3(j,q,n)
if(typeof f!=="number")return f.ei()
e=f-b
if(Math.abs(e)<1e-7)break
if(e>0)h=j
else i=j
d=k*j*j+r*j+p
c=Math.abs(d)>1e-7?j-e/d:-1
j=c>i&&c<h?c:(i+h)*0.5}return l.$3(j,o,m)}}
A.f7.prototype={
$3(a,b,c){var s=3*c,r=3*b
return((1-s+r)*a+s-6*b)*a*a+r*a},
$S:74}
A.A.prototype={
gcr(){var s=this.a
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
if(c2<B.i.ga6(r)){B.j.H(c1,0,o,q)
return c1}if(c2>=B.i.gad(r)){B.j.M(c1,0,o,q,(r.length-1)*p)
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
a=b<=0?0:B.c.B((c2-c)/b,0,1)
m=2*m+n
if(!(m<g))return A.a(k,m)
a0=k[m]
a1=B.a.L(f,4)
m=(f&8)===0
a2=!m
a3=a2?a:s.ce(a0,a)
k=s.w
if(k==null)a4=null
else{if(!(n<k.length))return A.a(k,n)
a4=k[n]}if(a4!=null)a4.ed(B.c.B(a3,0,1),c1)
else if(c0.c&&o>=32&&a1<=1)if(a3<=0)B.j.M(c1,0,o,q,h)
else if(a3>=1)B.j.M(c1,0,o,q,d)
else{n=$.dA()
n.$flags&2&&A.h(n)
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
a6=B.a.I(h,4)
a7=B.a.I(d,4)
a8=c0.e
if(a8==null)a8=c0.e=J.iQ(B.j.gab(c1),0,o/4|0)
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
b3=new A.aN(b1,b2,b3,n[0]).a8(0,a5)
n[0]=c.a+b3.a
b2=n[0]
n[0]=c.b+b3.b
b1=n[0]
n[0]=c.c+b3.c
e=n[0]
n[0]=c.d+b3.d
a8.t(0,a9,new A.aN(b2,b1,e,n[0]))}for(a9=k*4,n=q.length,k=c1.$flags|0;a9<o;++a9){g=h+a9
if(!(g<n))return A.a(q,g)
g=q[g]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=q[e]
k&2&&A.h(c1)
c1[a9]=g+(e-g)*m}}else if(c0.f)for(n=q.length,k=c1.$flags|0,g=a1>1,a9=0;a9<o;++a9){b4=g&&m?s.ce(a0+4*B.a.N(a9,a1),a):a3
e=h+a9
if(!(e<n))return A.a(q,e)
e=q[e]
c=$.lc()
e=B.a.B(B.c.F(e*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
b5=c[e]
e=d+a9
if(!(e>=0&&e<n))return A.a(q,e)
e=B.a.B(B.c.F(q[e]*255),0,255)
if(!(e>=0&&e<256))return A.a(c,e)
e=A.fG(b5+(c[e]-b5)*B.c.B(b4,0,1))
k&2&&A.h(c1)
c1[a9]=e}else if(a1<=1||a2)if(a3<=0)B.j.M(c1,0,o,q,h)
else if(a3>=1)B.j.M(c1,0,o,q,d)
else for(n=q.length,m=c1.$flags|0,b6=d,b7=h,a9=0;a9<o;++a9,++b7,++b6){if(!(b7<n))return A.a(q,b7)
b8=q[b7]
if(!(b6>=0&&b6<n))return A.a(q,b6)
b9=q[b6]
k=b8===b9?b8:b8+(b9-b8)*a3
m&2&&A.h(c1)
c1[a9]=k}else for(n=q.length,m=c1.$flags|0,a9=0;a9<o;++a9){b4=s.ce(a0+4*B.a.N(a9,a1),a)
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
A.ew.prototype={
ep(a,b,c,d,e){var s,r,q,p,o,n,m,l,k=this,j=k.a,i=j.length
if(0>=i)return A.a(j,0)
s=j[0]
if(1>=i)return A.a(j,1)
r=j[1]
for(j=k.b,i=j.$flags|0,q=1;q<129;++q,r=o,s=p){e=q/128
p=k.bg(e,0)
o=k.bg(e,1)
n=j[q-1]
m=p-s
l=o-r
l=Math.sqrt(m*m+l*l)
i&2&&A.h(j)
j[q]=n+l}},
bg(a,b){var s,r,q,p,o,n=1-a,m=this.a,l=m.length
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
ed(a,b){var s,r,q,p,o,n,m,l,k,j,i=this
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
o=B.i.gad(s)*a
for(n=0,m=128;n+1<m;){l=n+m>>>1
if(!(l<129))return A.a(s,l)
if(s[l]<=o)n=l
else m=l}if(!(m>=0&&m<129))return A.a(s,m)
r=s[m]
if(!(n>=0&&n<129))return A.a(s,n)
s=s[n]
k=r-s
j=(n+(k===0?0:(o-s)/k))/128
s=i.bg(j,0)
b.$flags&2&&A.h(b)
r=b.length
if(0>=r)return A.a(b,0)
b[0]=s
s=i.bg(j,1)
b.$flags&2&&A.h(b)
if(1>=r)return A.a(b,1)
b[1]=s}}
A.fL.prototype={
fM(){var s,r,q,p,o,n,m,l,k,j,i=this.a,h=J.M(i)
switch(A.j(A.S(h.h(i,0)))){case 0:s=h.h(i,1)==null?null:A.K(h.h(i,1))
i=new A.di(0,s,A.j(A.S(h.h(i,2))))
break
case 1:s=A.K(h.h(i,1))
i=new A.dj([1,t.bm.a(h.h(i,2)),s,A.bC(h.h(i,3))])
break
case 2:s=A.j(A.S(h.h(i,1)))
r=A.K(h.h(i,2))
q=A.K(h.h(i,3))
p=A.S(h.h(i,4))
o=A.j(A.S(h.h(i,5)))
n=A.j(A.S(h.h(i,6)))
m=A.j(A.S(h.h(i,7)))
l=A.j(A.S(h.h(i,8)))
n=new A.dd([2,q,r,p,o,m,A.bC(h.h(i,9)),s,l,n])
i=n
break
case 5:s=A.j(A.S(h.h(i,1)))
r=A.K(h.h(i,2))
q=A.K(h.h(i,3))
p=A.j(A.S(h.h(i,4)))
o=A.j(A.S(h.h(i,5)))
n=A.S(h.h(i,6))
m=A.S(h.h(i,7))
l=A.j(A.S(h.h(i,8)))
k=A.j(A.S(h.h(i,9)))
j=A.j(A.S(h.h(i,10)))
l=new A.de([5,q,r,m,k,A.bC(h.h(i,11)),s,n,o,p,j,l])
i=l
break
case 4:i=B.aC
break
default:i=A.x(B.a2)}return i}}
A.iJ.prototype={
$3(a,b,c){return new A.ay(this.a.gcf()-a,0-b.a-c,0-b.b)},
$S:75}
A.iI.prototype={
$1(a){var s,r,q=this.b
if(q.gv().length<a){s=Math.max(65536,q.gv().length)
while(s<a)s*=2
this.a.a=0
r=this.c
r.a=null
r.b=-1
q.av(s,0)}},
$S:6}
A.iK.prototype={
$1(a){return A.bv(this.a.gv(),0,a)},
$S:77}
A.iL.prototype={
$1(a){var s,r=this,q=r.b
if(q.gv().length<=262144){r.a.a=0
return}if(a<=65536){s=r.a
if(++s.a>=16){s.a=0
s=r.c
s.a=null
s.b=-1
q.av(65536,0)}}else r.a.a=0},
$S:6}
A.iN.prototype={
$3(a,b,c){var s
if(!this.a.h3(b,c))return
s=this.b.K(0,a)
if(s==null)return
this.c.cn(s)},
$S:78}
A.iM.prototype={
$2(a,b){var s,r,q,p,o=this,n=o.a,m=n.K(0,a)
if(m!=null)o.b.cn(m)
o.c.K(0,a)
for(s=o.b,r=A.n(n).i("W<1>");n.a>=8;){q=new A.W(n,r).gD(0)
if(!q.u())A.x(A.aq())
p=n.K(0,q.gA())
p.toString
s.cn(p)}n.t(0,a,b)},
$S:79}
A.iO.prototype={
$2(a,b){var s=this.a.h(0,b),r=s==null?new A.dh(3,b,a):new A.bV(1,s,a)
this.b.aA(r)},
$S:80}
A.iH.prototype={
$1(k1){var s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,i0,i1,i2,i3,i4,i5,i6,i7,i8,i9,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9=this,k0=null
A:{if(k1==null){e8=j9.b
e8.cb()
e8.dL()
j9.c.l(0)
j9.d.a_()
j9.e.a_()
j9.f.a.ca()
A.u(v.G.self).close()
return}e9=t.gk.b(k1)
f0=k0
f1=k0
e8=!1
if(e9){f2=k1.a
if(0===f2){f3=k1.b
if(t.dk.b(f3)){A.ia(f3)
f4=k1.c
e8=A.p(f4)
if(e8){A.j(f4)
f1=f4}f0=f3}}}else f2=k0
if(e8){e8=j9.b
e8.b=A.j(f1)
e8.bT(0)
e8.eg(f0)
break A}f5=t.hh.b(k1)
f6=k0
f7=k0
f8=!1
if(f5){if(e9)e8=f2
else{f2=A.eK()
e8=f2
e9=!0}f6=1===e8
e8=f6
if(e8){f7=A.eK()
f8=!0}}s=null
r=null
q=null
e8=!1
if(t.cm.b(k1)){f9=!0
if(f5)g0=f6
else{if(e9)g0=f2
else{f2=k1.a[0]
g0=f2
e9=!0}f6=1===g0
g0=f6}if(g0){if(f8)g0=f7
else{f7=k1.a[2]
g0=f7
f8=f9}if(typeof g0=="string"){if(f8)g0=f7
else{f7=k1.a[2]
g0=f7
f8=f9}s=A.K(g0)
g0=k1.a
g1=g0[1]
g2=t.p
if(g2.b(g1)){r=g2.a(g1)
g3=g0[3]
e8=A.bj(g3)
if(e8)q=A.bC(g3)}}}}if(e8){try{p=t.P.a(B.x.dP(B.Q.fJ(A.o3(r)),k0))
e8=s
g0=A.jk(new A.dI(q))
g0.fF(p)
j9.r.$2(e8,new A.cc(g0))}catch(g4){o=A.ad(g4)
e8=j9.w
if(e8.a>=8)e8.K(0,new A.W(e8,A.n(e8).i("W<1>")).ga6(0))
e8.t(0,s,J.bE(o))}break A}n=null
m=null
l=null
k=null
j=null
i=null
h=null
g=null
f=null
g5=k0
g6=k0
g7=!1
g8=k0
g9=!1
h0=k0
h1=!1
h2=k0
h3=!1
h4=k0
h5=!1
e8=!1
if(t.eS.b(k1)){f9=!0
if(e9)g0=f2
else{f2=k1.a[0]
g0=f2
e9=!0}h6=2===g0
if(h6){g0=k1.a
g5=g0[7]
g7=A.p(g5)
if(g7){A.j(g5)
n=g5
g6=g0[2]
if(typeof g6=="string"){A.K(g6)
m=g6
if(f8)g2=f7
else{f7=g0[1]
g2=f7
f8=f9}if(typeof g2=="string"){if(f8)g2=f7
else{f7=g0[1]
g2=f7
f8=f9}l=A.K(g2)
h7=g0[3]
if(typeof h7=="number"){k=A.S(h7)
h8=g0[4]
g9=A.p(h8)
if(g9){j=A.j(h8)
g8=g0[9]
h1=A.p(g8)
if(h1){A.j(g8)
i=g8
h0=g0[5]
h3=A.p(h0)
if(h3){A.j(h0)
h=h0
h2=g0[8]
h5=A.p(h2)
if(h5){A.j(h2)
g=h2
h4=g0[6]
e8=A.bj(h4)
if(e8){A.bC(h4)
f=h4}}}}}}}}}}}else h6=!1
if(e8){try{e8=i
g0=h
if(typeof e8!=="number")return e8.a8()
if(typeof g0!=="number")return A.a3(g0)
e=e8*g0
j9.x.$1(e)
g0=j9.y
d=g0.$1(e)
e8=j9.b
g2=m
h9=i
i0=h
i1=g
i2=f
i3=j9.z
c=e8.e6(i3,d,g2,j,i0,i2,i1,h9)
if(c){j9.Q.$3(l,m,g)
b=new Uint8Array(A.T(d))
e6=e8.at
a=e6==null?0:e6
g0=e8.x
g2=e8.Q
h9=d.byteLength
j9.f.aA(new A.cm([0,-1,m,a,0,0,b,0,n,h9,!1,g0+g2]))
j9.as.$1(e)
if(!f){g0=m
g2=i
h9=h
i0=g
e8.e_(g0,j,h9,i0,g2)}return}g2=j9.c
a0=g2.K(0,l)
if(a0==null){j9.at.$2(n,l)
return}g2.t(0,l,a0)
i3.a=null
i3.b=-1
a1=j9.ax.gcf()
a2=B.E
a3=0
g2=k
h9=i
i0=h
A.kR(a0.geH(),g2,j9.e,h9,i0,j9.d,k0)
a4=j9.ay.$3(a1,a2,a3)
a5=g0.$1(e)
g0=m
i0=i
h9=h
g2=g
i1=f
a6=e8.cC(g0,j,h9,i1,j9.ch,a5,g2,i0)
a7=new Uint8Array(A.T(a5))
i0=a6.c
g2=e8.x
e8=e8.Q
i1=a4.a
h9=a4.b
g0=a4.c
i2=a5.byteLength
j9.f.aA(new A.cm([0,i0,m,a6.b,g0,h9,a7,i1,n,i2,!0,g2+e8]))
j9.as.$1(e)
j9.Q.$3(l,m,g)}catch(g4){a8=A.ad(g4)
j9.f.aA(new A.bV(1,J.bE(a8),n))}break A}a9=null
b0=null
b1=null
b2=null
b3=null
b4=null
b5=null
b6=null
b7=null
b8=null
b9=null
e8=!1
if(t.a8.b(k1)){i4=!0
if(e9)g0=f2
else{f2=k1.a[0]
g0=f2
e9=!0}if(5===g0){if(h6)g0=g5
else{g5=k1.a[6]
g0=g5
h6=!0}if(A.p(g0)){a9=A.j(h6?g5:k1.a[6])
if(g7)g0=g6
else{g6=k1.a[2]
g0=g6
g7=i4}if(typeof g0=="string"){if(g7)g0=g6
else{g6=k1.a[2]
g0=g6
g7=i4}b0=A.K(g0)
if(f8)g0=f7
else{f7=k1.a[1]
g0=f7
f8=!0}if(typeof g0=="string"){b1=A.K(f8?f7:k1.a[1])
g0=k1.a
i5=g0[9]
if(A.p(i5)){b2=A.j(i5)
i6=g0[8]
if(A.p(i6)){b3=A.j(i6)
i7=g0[7]
if(typeof i7=="number"){b4=A.S(i7)
i8=g0[3]
if(typeof i8=="number"){b5=A.S(i8)
if(g9)g2=g8
else{g8=g0[11]
g2=g8
g9=!0}if(A.p(g2)){b6=A.j(g9?g8:g0[11])
if(h1)g2=h0
else{h0=g0[4]
g2=h0
h1=!0}if(A.p(g2)){b7=A.j(h1?h0:g0[4])
if(h3)g2=h2
else{h2=g0[10]
g2=h2
h3=!0}if(A.p(g2)){b8=A.j(h3?h2:g0[10])
if(h5)e8=h4
else{h4=g0[5]
e8=h4
h5=!0}e8=A.bj(e8)
if(e8)b9=A.bC(h5?h4:g0[5])}}}}}}}}}}}}if(e8){try{e8=j9.z
e8.a=null
e8.b=-1
e8=b3
if(typeof e8!=="number")return e8.eb()
c0=e8>1?1:0
g0=b3
g2=b7
if(typeof g0!=="number")return g0.a8()
if(typeof g2!=="number")return A.a3(g2)
h9=b3
if(typeof h9!=="number")return h9.ei()
i0=c0
if(typeof i0!=="number")return A.a3(i0)
c1=g0*g2+(h9-1)*i0
i0=b6
h9=c1
if(typeof i0!=="number")return i0.a8()
if(typeof h9!=="number")return A.a3(h9)
c2=i0*h9
j9.x.$1(c2)
e8=c0
if(typeof e8!=="number")return e8.eb()
if(e8>0)B.f.T(j9.e.gv(),0,c2,0)
e8=b6
g0=b7
if(typeof e8!=="number")return e8.a8()
if(typeof g0!=="number")return A.a3(g0)
c3=e8*g0
c4=0
c5=0
c6=-1
c7=0
c8=0
c9=0
d0=null
d1=null
d2=0
e8=j9.ch
g0=j9.ay
g2=j9.b
h9=j9.c
i0=j9.ax
i1=j9.d
i2=j9.e
i3=t.a
for(;;){i9=d2
j0=b3
if(typeof i9!=="number")return i9.ec()
if(typeof j0!=="number")return A.a3(j0)
if(!(i9<j0))break
B:{i9=b2
j0=d2
if(typeof i9!=="number")return i9.az()
if(typeof j0!=="number")return A.a3(j0)
d3=A.on(i9+j0,b8,b5)
j0=b4
i9=d3
if(typeof j0!=="number")return j0.az()
if(typeof i9!=="number")return A.a3(i9)
d4=j0+i9
i9=d2
j0=b7
j1=c0
if(typeof j0!=="number")return j0.az()
if(typeof j1!=="number")return A.a3(j1)
if(typeof i9!=="number")return i9.a8()
d5=i9*(j0+j1)
j1=d5
j0=b6
if(typeof j1!=="number")return j1.a8()
if(typeof j0!=="number")return A.a3(j0)
d6=j1*j0
j0=A.j(d6)
j1=A.j(c3)
i9=j0+j1
A.bt(j0,i9,i2.b)
j2=i2.c
j3=j2==null
j4=j3?k0:j2+j0*4
if(j3){j3=i2.d
j3.toString
i9=A.jj(j3,j0,i9)}else i9=k0
d7=new A.aX(!1,j1,j4,i9)
i9=b0
j4=b6
j1=b7
j0=b8
j3=b9
j5=d7
j6=j5.c
if(j6!=null){j7=i3.a(A.u($.l.memory).buffer)
j8=j5.b
j5=new Uint32Array(j7,j6,j8)}else{j5=j5.d
j5.toString}d8=g2.hu(A.bv(j5,0,k0),i9,d3,j1,j3,j0,j4)
if(d8){i9=c5
if(typeof i9!=="number")return i9.az()
c5=i9+1
if(d0==null)d0=d3
break B}if(d1==null)d1=h9.K(0,b1)
if(d1==null){j9.at.$2(a9,b1)
return}h9.t(0,b1,d1)
d9=i0.gcf()
e0=B.E
e1=0
i9=d1
j0=b6
j1=b7
i9=i9.a
A.kR(i9,d4,d7,j0,j1,i1,k0)
e2=g0.$3(d9,e0,e1)
i9=c7
j0=e2.a
if(typeof i9!=="number")return i9.az()
c7=i9+j0
j0=c8
i9=e2.b
if(typeof j0!=="number")return j0.az()
c8=j0+i9
i9=c9
j0=e2.c
if(typeof i9!=="number")return i9.az()
c9=i9+j0
j0=c4
if(typeof j0!=="number")return j0.az()
c4=j0+1
j0=b0
i9=b6
j1=b7
j3=b8
j4=b9
j5=d7
j6=j5.c
if(j6!=null){j7=i3.a(A.u($.l.memory).buffer)
j8=j5.b
j5=new Uint32Array(j7,j6,j8)}else{j5=j5.d
j5.toString}e3=g2.cC(j0,d3,j1,j4,e8,A.bv(j5,0,k0),j3,i9)
if(e3.c>0)c6=e3.c}i9=d2
if(typeof i9!=="number")return i9.az()
d2=i9+1}e4=j9.y.$1(c2)
e5=new Uint8Array(A.T(e4))
if(J.m(b3,1)){e8=g2.at
a=e8==null?0:e8}else{e8=e4
$.eM()
a=A.iV(e8,0,e8.byteLength)}e6=a
e8=c4
g0=c5
h9=c6
i0=g2.x
i1=g2.Q
i2=c7
i3=c8
i9=c9
j0=c2
if(typeof j0!=="number")return j0.a8()
j9.f.aA(new A.df([4,g0,h9,b0,e6,i9,i3,e5,i2,a9,b3,c1,b2,b6,j0*4,e8,i0+i1]))
j9.as.$1(c2)
j9.Q.$3(b1,b0,b8)
if(!b9&&d0!=null){e8=b0
g0=b6
b7=b7
h9=b8
g2.e_(e8,d0,b7,h9,g0)}}catch(g4){e7=A.ad(g4)
j9.f.aA(new A.bV(1,J.bE(e7),a9))}break A}m=k0
e8=!1
if(t.bn.b(k1)){if(e9)g0=f2
else{f2=A.eK()
g0=f2
e9=!0}if(3===g0){if(g7)e8=g6
else{g6=A.eK()
e8=g6
g7=!0}e8=typeof e8=="string"
if(e8)m=A.K(g7?g6:A.eK())}}if(e8){e8=j9.b
e8.fS(m)
e8.fY(m)
j9.f.aA(new A.co(2,m,e8.x+e8.Q))
break A}if(t.dn.b(k1))e8=4===(e9?f2:k1.a)
else e8=!1
if(e8){e8=j9.z
e8.a=null
e8.b=-1
e8=j9.b
e8.dL()
e8.cb()
e8.cw()
j9.c.l(0)
j9.w.l(0)
g0=j9.d
g0.e2()
g0.e5(!0)
g0=j9.ch
g0.c=0
if(g0.b.length>131072)g0.b=new Uint8Array(131072)
j9.a.a=0
g0=j9.e
if(g0.gv().length>65536)g0.av(65536,0)
j9.f.aA(new A.co(2,"",e8.x+e8.Q))}}},
$S:81}
A.iA.prototype={
$1(a){return this.e9(a)},
e9(a5){var s=0,r=A.kP(t.b),q=1,p=[],o=this,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4
var $async$$1=A.kW(function(a6,a7){if(a6===1){p.push(a7)
s=q}for(;;)switch(s){case 0:q=3
e=t.a6.a(a5.data)
n=new A.fL(e)
d=o.a
s=!d.a?6:8
break
case 6:if(A.j(A.S(J.ae(n.a,0)))!==-1||A.j(A.S(J.ae(n.a,1)))!==3)throw A.f(B.W)
q=10
s=13
return A.ib(A.jH(A.u(A.u(v.G.self).fetch(A.K(J.ae(n.a,2)))),t.m),$async$$1)
case 13:m=a7
s=A.bC(m.ok)?14:15
break
case 14:a3=A
a4=A
s=17
return A.ib(A.jH(A.u(m.arrayBuffer()),t.a),$async$$1)
case 17:s=16
return A.ib(a3.iy(a4.jb(a7,0,null)),$async$$1)
case 16:case 15:q=3
s=12
break
case 10:q=9
a1=p.pop()
s=12
break
case 9:s=3
break
case 12:A.oq(o.b)
d.a=!0
l=null
k=null
j=A.jD([-2,3,$.l!=null])
l=j.a
k=j.b
A.u(v.G.self).postMessage(l,k)
s=7
break
case 8:d=o.b.a
b=A.n(d)
a=b.c.a(n.fM())
a0=d.b
if(a0>=4)A.x(d.cK())
if((a0&1)!==0)d.c0(a)
else if((a0&3)===0)d.cU().m(0,new A.bP(a,b.i("bP<1>")))
case 7:q=1
s=5
break
case 3:q=2
a2=p.pop()
i=A.ad(a2)
h=null
g=null
f=A.jD([-3,A.v(i)])
h=f.a
g=f.b
A.u(v.G.self).postMessage(h,g)
s=5
break
case 2:s=1
break
case 5:return A.kB(null,r)
case 1:return A.kA(p.at(-1),r)}})
return A.kC($async$$1,r)},
$S:82}
A.iB.prototype={
$1(a){return A.lQ(new A.iA(this.a,this.b).$1(A.u(a)),t.b)},
$S:83}
A.h8.prototype={
aA(a){var s=A.o4(a)
A.u(v.G.self).postMessage(s.a,s.b)}};(function aliases(){var s=J.bo.prototype
s.el=s.p
s=A.w.prototype
s.cD=s.M})();(function installTearOffs(){var s=hunkHelpers._static_0,r=hunkHelpers._static_1,q=hunkHelpers._static_2,p=hunkHelpers._instance_2u,o=hunkHelpers._instance_1u,n=hunkHelpers._instance_0u
s(A,"nA","m9",3)
r(A,"nU","mv",5)
r(A,"nV","mw",5)
r(A,"nW","mx",5)
s(A,"kY","nP",0)
q(A,"nY","nE",9)
s(A,"nX","nD",0)
p(A.J.prototype,"geI","eJ",9)
r(A,"jI","du",1)
var m
o(m=A.en.prototype,"ghq","C",45)
o(m,"gb7","cA",46)
o(m,"gfT","fU",47)
o(m,"ghd","he",48)
o(m,"gha","cm",49)
p(m=A.ah.prototype,"gfB","q",70)
n(m,"gfV","a1",0)})();(function inheritance(){var s=hunkHelpers.mixin,r=hunkHelpers.inherit,q=hunkHelpers.inheritMany
r(A.d,null)
q(A.d,[A.j4,J.C,A.cV,J.bF,A.L,A.bl,A.ft,A.k,A.bK,A.d2,A.cW,A.cB,A.G,A.bw,A.O,A.d5,A.b6,A.fH,A.fj,A.cC,A.dl,A.H,A.f9,A.cI,A.aL,A.cH,A.dQ,A.d7,A.cf,A.fU,A.et,A.i3,A.aN,A.aP,A.eo,A.i1,A.hZ,A.ef,A.an,A.ej,A.bd,A.J,A.eg,A.cY,A.dm,A.eh,A.d4,A.by,A.ek,A.aR,A.ex,A.fN,A.es,A.d6,A.w,A.c7,A.dG,A.i4,A.h9,A.e_,A.cX,A.ha,A.a_,A.bp,A.Y,A.ey,A.fv,A.cd,A.fi,A.f0,A.fM,A.f2,A.dL,A.bs,A.h7,A.dN,A.ev,A.eP,A.fb,A.fE,A.ea,A.a9,A.b4,A.aX,A.fe,A.hX,A.cc,A.fn,A.aa,A.bO,A.c,A.bx,A.hb,A.hU,A.en,A.be,A.R,A.bh,A.bX,A.cj,A.bW,A.a7,A.hJ,A.em,A.a6,A.a5,A.aQ,A.ep,A.bg,A.bn,A.ah,A.aC,A.eX,A.dI,A.f6,A.A,A.ew,A.fL,A.h8])
q(J.C,[J.cD,J.cF,J.Q,J.bH,J.bI,J.cG,J.c9])
q(J.Q,[J.bo,J.y,A.bq,A.cN])
q(J.bo,[J.e0,J.d0,J.ar])
r(J.dO,A.cV)
r(J.f3,J.y)
q(J.cG,[J.cE,J.dP])
q(A.L,[A.b2,A.bb,A.dR,A.ec,A.e4,A.cx,A.el,A.aW,A.d1,A.eb,A.b8,A.dF])
q(A.bl,[A.dD,A.dE,A.e9,A.iv,A.ix,A.fQ,A.fP,A.ic,A.hB,A.fw,A.eY,A.iF,A.iG,A.f1,A.eS,A.eQ,A.eR,A.ik,A.ih,A.ii,A.ig,A.h5,A.fW,A.fV,A.h2,A.h0,A.fZ,A.h_,A.fY,A.h4,A.i0,A.h6,A.hc,A.hO,A.hM,A.hN,A.hP,A.hF,A.hH,A.hI,A.hG,A.hR,A.hQ,A.hY,A.fz,A.fC,A.f7,A.iJ,A.iI,A.iK,A.iL,A.iN,A.iH,A.iA,A.iB])
q(A.dD,[A.iD,A.fl,A.fR,A.fS,A.i_,A.ht,A.hx,A.hw,A.hv,A.hu,A.hA,A.hz,A.hy,A.fx,A.hW,A.hV,A.fT,A.hS,A.fO,A.ip,A.i6,A.i5,A.hE,A.i9,A.fF,A.fg,A.hq,A.hr,A.hk,A.hl,A.hm,A.hn,A.ho,A.hp,A.he,A.hg,A.hf,A.hs,A.hd,A.hi,A.hh,A.hj,A.fA])
q(A.k,[A.o,A.bN,A.b7,A.ee])
q(A.o,[A.a4,A.cA,A.W,A.fa,A.bJ])
q(A.a4,[A.cZ,A.X,A.er])
r(A.c8,A.b7)
q(A.O,[A.ck,A.ax,A.bU,A.aT])
r(A.dc,A.ck)
q(A.ax,[A.cl,A.dd,A.de,A.cm,A.df,A.b_,A.dj,A.bz])
q(A.bU,[A.F,A.dg])
q(A.aT,[A.ay,A.cn,A.dh,A.di,A.co,A.bV])
q(A.b6,[A.cz,A.dk])
r(A.N,A.cz)
r(A.cQ,A.bb)
q(A.e9,[A.e5,A.c6])
r(A.eB,A.cx)
q(A.H,[A.b1,A.eq])
q(A.dE,[A.f4,A.iw,A.id,A.iq,A.hC,A.fc,A.fd,A.hL,A.f_,A.eZ,A.eT,A.fo,A.fp,A.fq,A.fr,A.io,A.fX,A.h1,A.h3,A.iM,A.iO])
r(A.af,A.b1)
r(A.ca,A.bq)
r(A.eu,A.et)
r(A.cK,A.eu)
r(A.eC,A.cK)
r(A.eA,A.eC)
q(A.cN,[A.dU,A.a8])
q(A.a8,[A.d8,A.da])
r(A.d9,A.d8)
r(A.br,A.d9)
r(A.db,A.da)
r(A.at,A.db)
q(A.br,[A.cb,A.cL])
q(A.at,[A.dV,A.cM,A.dX,A.dY,A.cO,A.cP,A.bL])
r(A.cp,A.el)
r(A.d3,A.ej)
r(A.cg,A.dm)
r(A.dp,A.cY)
r(A.ch,A.dp)
r(A.ci,A.d4)
r(A.bP,A.by)
r(A.bf,A.dk)
r(A.bS,A.bf)
q(A.c7,[A.dH,A.dS])
q(A.dG,[A.f5,A.fK])
r(A.ed,A.dH)
q(A.aW,[A.b5,A.dK])
q(A.fM,[A.hD,A.i8])
q(A.bs,[A.dT,A.fu,A.bM])
q(A.a_,[A.c5,A.fJ])
q(A.c5,[A.cw,A.dB])
r(A.cy,A.h9)
r(A.dM,A.dN)
q(A.ep,[A.aw,A.aS,A.aZ])
s(A.et,A.w)
s(A.eu,A.G)
s(A.d8,A.w)
s(A.d9,A.G)
s(A.da,A.w)
s(A.db,A.G)
s(A.eC,A.bw)
s(A.cg,A.eh)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",e:"double",c2:"num",q:"String",r:"bool",Y:"Null",t:"List",d:"Object",ag:"Map",I:"JSObject"},mangledNames:{},types:["~()","r(z)","r(a7)","b()","~(@)","~(~())","~(b)","Y(@)","Y()","~(d,au)","@()","r()","r(+(q,b))","r(@)","bm(@,c,bm?,b,b)","~(e,e,e,e,e,e)","@(@,q)","Y(ar,ar)","d?(d?)","d(d,au)","r(bs)","@(q)","r(b,bu)","b(b)","@(@)","t<b>()","~(e,e,e,e,e,e,e,e)","~(e,e,e,e,e,e,b)","ap<~>()","~(b,b,e,e,r)","r(d,bO)","r(d,aa<ah>)","r(d,aa<e>)","r(be,aa<aX>)","~(a7,aC)","r(a6)","A(b{dimensions:b})","~(b,b)","Y(@,au)","e(q,e)","~(b,@)","~(@,b)","~(t<z>)","z(R)","Y(~())","A(A)","z(z)","aG(aG)","a7(a7)","a6(a6)","A()","bW()","R()","bh()","aQ()","aw()","Y(d,au)","aZ()","bg()","a5()","be()","bX()","cj()","a7()","a6()","bx()","r(A)","b(e)","~(d?,d?)","r(aG)","~(e,e)","d_()","b(b,b,e)","e(e)","e(e,e,e)","+(b,b,b)(b,+calls,copiedBytes(b,b),b)","~(q,@)","bu(b)","~(q,q,b)","~(q,cc)","~(b,q)","~(d?)","ap<Y>(I)","I(I)","aS()"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"1;":a=>b=>b instanceof A.dc&&a.b(b.a),"2;":(a,b)=>c=>c instanceof A.F&&a.b(c.a)&&b.b(c.b),"2;calls,copiedBytes":(a,b)=>c=>c instanceof A.dg&&a.b(c.a)&&b.b(c.b),"3;":(a,b,c)=>d=>d instanceof A.ay&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;contentKey,requestId":(a,b,c)=>d=>d instanceof A.dh&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;diskDirectory,maximumRamBytes":(a,b,c)=>d=>d instanceof A.di&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;entryKey,workerRamBytes":(a,b,c)=>d=>d instanceof A.co&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;message,requestId":(a,b,c)=>d=>d instanceof A.bV&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"3;compressedBytes,crc31,entryDiskBytes":(a,b,c)=>d=>d instanceof A.cn&&a.b(d.a)&&b.b(d.b)&&c.b(d.c),"4;":a=>b=>b instanceof A.b_&&A.c3(a,b.a),"4;bytes,contentKey,useSimd":a=>b=>b instanceof A.dj&&A.c3(a,b.a),"6;":a=>b=>b instanceof A.bz&&A.c3(a,b.a),"10;":a=>b=>b instanceof A.cl&&A.c3(a,b.a),"10;contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width":a=>b=>b instanceof A.dd&&A.c3(a,b.a),"12;contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width":a=>b=>b instanceof A.de&&A.c3(a,b.a),"12;entryDiskBytes,entryKey,frameCrc,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes":a=>b=>b instanceof A.cm&&A.c3(a,b.a),"17;compressedCount,entryDiskBytes,entryKey,frameCrc,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes":a=>b=>b instanceof A.df&&A.c3(a,b.a)}}
A.mT(v.typeUniverse,JSON.parse('{"ar":"bo","e0":"bo","d0":"bo","oC":"bq","cD":{"C":[],"r":[],"B":[]},"cF":{"C":[],"Y":[],"B":[]},"Q":{"C":[],"I":[]},"bo":{"Q":[],"C":[],"I":[]},"bH":{"C":[]},"bI":{"C":[]},"y":{"t":["1"],"Q":[],"o":["1"],"C":[],"I":[],"k":["1"]},"dO":{"cV":[]},"f3":{"y":["1"],"t":["1"],"Q":[],"o":["1"],"C":[],"I":[],"k":["1"]},"bF":{"a0":["1"]},"cG":{"e":[],"c2":[],"C":[]},"cE":{"e":[],"b":[],"c2":[],"C":[],"B":[]},"dP":{"e":[],"c2":[],"C":[],"B":[]},"c9":{"q":[],"C":[],"fk":[],"B":[]},"b2":{"L":[]},"o":{"k":["1"]},"a4":{"o":["1"],"k":["1"]},"cZ":{"a4":["1"],"o":["1"],"k":["1"],"k.E":"1","a4.E":"1"},"bK":{"a0":["1"]},"X":{"a4":["2"],"o":["2"],"k":["2"],"k.E":"2","a4.E":"2"},"bN":{"k":["1"],"k.E":"1"},"d2":{"a0":["1"]},"b7":{"k":["1"],"k.E":"1"},"c8":{"b7":["1"],"o":["1"],"k":["1"],"k.E":"1"},"cW":{"a0":["1"]},"cA":{"o":["1"],"k":["1"],"k.E":"1"},"cB":{"a0":["1"]},"dc":{"ck":[],"O":[]},"cl":{"ax":[],"O":[]},"dd":{"ax":[],"O":[]},"de":{"ax":[],"O":[]},"cm":{"ax":[],"O":[]},"df":{"ax":[],"O":[]},"F":{"bU":[],"O":[]},"dg":{"bU":[],"O":[]},"ay":{"aT":[],"O":[]},"cn":{"aT":[],"O":[]},"dh":{"aT":[],"O":[]},"di":{"aT":[],"O":[]},"co":{"aT":[],"O":[]},"bV":{"aT":[],"O":[]},"b_":{"ax":[],"O":[]},"dj":{"ax":[],"O":[]},"bz":{"ax":[],"O":[]},"d5":{"a0":["1"]},"cz":{"b6":["1"],"aY":["1"],"o":["1"],"k":["1"]},"N":{"cz":["1"],"b6":["1"],"aY":["1"],"o":["1"],"k":["1"]},"cQ":{"bb":[],"L":[]},"dR":{"L":[]},"ec":{"L":[]},"dl":{"au":[]},"bl":{"bG":[]},"dD":{"bG":[]},"dE":{"bG":[]},"e9":{"bG":[]},"e5":{"bG":[]},"c6":{"bG":[]},"e4":{"L":[]},"eB":{"L":[]},"b1":{"H":["1","2"],"j6":["1","2"],"ag":["1","2"],"H.K":"1","H.V":"2"},"W":{"o":["1"],"k":["1"],"k.E":"1"},"cI":{"a0":["1"]},"fa":{"o":["1"],"k":["1"],"k.E":"1"},"aL":{"a0":["1"]},"bJ":{"o":["bp<1,2>"],"k":["bp<1,2>"],"k.E":"bp<1,2>"},"cH":{"a0":["bp<1,2>"]},"af":{"b1":["1","2"],"H":["1","2"],"j6":["1","2"],"ag":["1","2"],"H.K":"1","H.V":"2"},"bU":{"O":[]},"ck":{"O":[]},"aT":{"O":[]},"ax":{"O":[]},"dQ":{"mg":[],"fk":[]},"d7":{"e2":[]},"ee":{"k":["e2"],"k.E":"e2"},"cf":{"a0":["e2"]},"ca":{"bq":[],"Q":[],"C":[],"I":[],"B":[]},"bq":{"Q":[],"C":[],"I":[],"B":[]},"cK":{"eV":[],"w":["Z"],"t":["Z"],"o":["Z"],"k":["Z"],"G":["Z"],"B":[],"w.E":"Z","G.E":"Z"},"eA":{"eV":[],"w":["Z"],"bw":["Z"],"t":["Z"],"o":["Z"],"k":["Z"],"G":["Z"],"B":[],"w.E":"Z","bw.E":"Z","G.E":"Z"},"cN":{"Q":[],"C":[],"I":[]},"dU":{"Q":[],"C":[],"I":[],"B":[]},"a8":{"as":["1"],"Q":[],"C":[],"I":[]},"br":{"w":["e"],"a8":["e"],"t":["e"],"as":["e"],"Q":[],"o":["e"],"C":[],"I":[],"k":["e"],"G":["e"]},"at":{"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"]},"cb":{"br":[],"bm":[],"w":["e"],"a8":["e"],"t":["e"],"as":["e"],"Q":[],"o":["e"],"C":[],"I":[],"k":["e"],"G":["e"],"B":[],"w.E":"e","G.E":"e"},"cL":{"br":[],"eW":[],"w":["e"],"a8":["e"],"t":["e"],"as":["e"],"Q":[],"o":["e"],"C":[],"I":[],"k":["e"],"G":["e"],"B":[],"w.E":"e","G.E":"e"},"dV":{"at":[],"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"],"B":[],"w.E":"b","G.E":"b"},"cM":{"at":[],"j_":[],"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"],"B":[],"w.E":"b","G.E":"b"},"dX":{"at":[],"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"],"B":[],"w.E":"b","G.E":"b"},"dY":{"at":[],"ji":[],"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"],"B":[],"w.E":"b","G.E":"b"},"cO":{"at":[],"d_":[],"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"],"B":[],"w.E":"b","G.E":"b"},"cP":{"at":[],"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"],"B":[],"w.E":"b","G.E":"b"},"bL":{"at":[],"bu":[],"w":["b"],"a8":["b"],"t":["b"],"as":["b"],"Q":[],"o":["b"],"C":[],"I":[],"k":["b"],"G":["b"],"B":[],"w.E":"b","G.E":"b"},"aN":{"Z":[]},"el":{"L":[]},"cp":{"bb":[],"L":[]},"an":{"L":[]},"d3":{"ej":["1"]},"J":{"ap":["1"]},"dm":{"k7":["1"],"k5":["1"],"ko":["1"],"bQ":["1"]},"cg":{"eh":["1"],"dm":["1"],"k7":["1"],"k5":["1"],"ko":["1"],"bQ":["1"]},"ch":{"dp":["1"],"cY":["1"]},"ci":{"d4":["1"],"e6":["1"],"bQ":["1"]},"d4":{"e6":["1"],"bQ":["1"]},"dp":{"cY":["1"]},"bP":{"by":["1"]},"ek":{"by":["@"]},"bf":{"b6":["1"],"aY":["1"],"o":["1"],"k":["1"]},"bS":{"bf":["1"],"b6":["1"],"aY":["1"],"o":["1"],"k":["1"]},"d6":{"a0":["1"]},"H":{"ag":["1","2"]},"b6":{"aY":["1"],"o":["1"],"k":["1"]},"dk":{"b6":["1"],"aY":["1"],"o":["1"],"k":["1"]},"eq":{"H":["q","@"],"ag":["q","@"],"H.K":"q","H.V":"@"},"er":{"a4":["q"],"o":["q"],"k":["q"],"k.E":"q","a4.E":"q"},"dH":{"c7":["q","t<b>"]},"dS":{"c7":["d?","q"]},"ed":{"c7":["q","t<b>"]},"e":{"c2":[]},"b":{"c2":[]},"t":{"o":["1"],"k":["1"]},"aY":{"o":["1"],"k":["1"]},"q":{"fk":[]},"cx":{"L":[]},"bb":{"L":[]},"aW":{"L":[]},"b5":{"L":[]},"dK":{"b5":[],"L":[]},"d1":{"L":[]},"eb":{"L":[]},"b8":{"L":[]},"dF":{"L":[]},"e_":{"L":[]},"cX":{"L":[]},"ey":{"au":[]},"dT":{"bs":[]},"fu":{"bs":[]},"dM":{"dN":[]},"bM":{"bs":[]},"R":{"z":[]},"bh":{"z":[]},"a5":{"z":[],"aG":[]},"aQ":{"z":[]},"aw":{"z":[]},"aS":{"z":[]},"aZ":{"z":[]},"bg":{"aG":[]},"ep":{"z":[]},"lS":{"t":["b"],"o":["b"],"k":["b"]},"bu":{"t":["b"],"o":["b"],"k":["b"]},"mt":{"t":["b"],"o":["b"],"k":["b"]},"lR":{"t":["b"],"o":["b"],"k":["b"]},"ji":{"t":["b"],"o":["b"],"k":["b"]},"j_":{"t":["b"],"o":["b"],"k":["b"]},"d_":{"t":["b"],"o":["b"],"k":["b"]},"bm":{"t":["e"],"o":["e"],"k":["e"]},"eW":{"t":["e"],"o":["e"],"k":["e"]},"eV":{"t":["Z"],"o":["Z"],"k":["Z"]}}'))
A.mS(v.typeUniverse,JSON.parse('{"a8":1,"by":1,"dk":1,"dG":2}'))
var u={c:"Error handler must accept one Object or one Object and a StackTrace as arguments, and return a value of the returned future's type"}
var t=(function rtii(){var s=A.dz
return{a7:s("@<~>"),v:s("an"),fA:s("cy"),M:s("N<q>"),gw:s("o<@>"),R:s("L"),Y:s("Z"),Z:s("bG"),gd:s("C"),bM:s("k<e>"),hf:s("k<@>"),hb:s("k<b>"),dh:s("y<eW>"),f:s("y<d>"),fM:s("y<ah>"),hg:s("y<+(r,r)>"),bU:s("y<aC>"),s:s("y<q>"),gC:s("y<A>"),a1:s("y<d_>"),gN:s("y<bu>"),V:s("y<aG>"),ch:s("y<a6>"),bE:s("y<a7>"),r:s("y<z>"),fq:s("y<R>"),n:s("y<e>"),o:s("y<@>"),t:s("y<b>"),a2:s("y<aX?>"),a6:s("y<d?>"),cU:s("y<a6?>"),T:s("cF"),m:s("I"),g:s("ar"),aU:s("as<@>"),aX:s("Q"),c2:s("af<d,d>"),el:s("af<d,bO>"),gt:s("af<ag<q,@>,aw>"),gS:s("af<d,aa<ah>>"),fk:s("af<d,aa<e>>"),gj:s("af<be,aa<aX>>"),ew:s("t<d>"),W:s("t<oD>"),cH:s("t<z>"),dg:s("t<e>"),j:s("t<@>"),L:s("t<b>"),P:s("ag<q,@>"),gq:s("ag<a6,b>"),B:s("ag<b,a6>"),aj:s("ag<a6,+(b,c)>"),fP:s("X<R,z>"),a:s("ca"),d4:s("br"),eB:s("at"),bm:s("bL"),b:s("Y"),K:s("d"),bl:s("bM"),b8:s("b5"),fW:s("cc"),gT:s("oE"),bQ:s("+()"),eS:s("+contentKey,entryKey,frame,frameIndex,height,poster,requestId,totalFrames,width(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),a8:s("+contentKey,entryKey,frameStep,height,poster,requestId,startFrame,stripCount,stripStart,totalFrames,width(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),eT:s("+entryDiskBytes,entryKey,frameCrc,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,transferBytes,vectorRendered,workerRamBytes(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),ga:s("+compressedCount,entryDiskBytes,entryKey,frameCrc,geometryCopyBytes,kernelCalls,pixels,renderMicros,requestId,stripCount,stripHeight,stripStart,stripWidth,transferBytes,vectorCount,workerRamBytes(d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?,d?)"),dn:s("+(d?)"),x:s("+(q,b)"),eG:s("+(b,c)"),bn:s("+entryKey(d?,d?)"),bP:s("+(q,e,e)"),h6:s("+(b,b,b)"),ca:s("+contentKey,requestId(d?,d?,d?)"),hh:s("+contentKey,scene(d?,d?,d?)"),gk:s("+diskDirectory,maximumRamBytes(d?,d?,d?)"),dH:s("+entryKey,workerRamBytes(d?,d?,d?)"),bA:s("+message,requestId(d?,d?,d?)"),cm:s("+bytes,contentKey,useSimd(d?,d?,d?,d?)"),d:s("e2"),bC:s("aY<d>"),h:s("aY<q>"),cJ:s("aY<b>"),l:s("au"),N:s("q"),gz:s("ea"),A:s("A"),dm:s("B"),k:s("bb"),p:s("bu"),ak:s("d0"),eU:s("bN<z>"),co:s("cg<d?>"),E:s("bx"),az:s("bO"),bo:s("cj"),G:s("aG"),_:s("J<@>"),fJ:s("J<b>"),U:s("J<~>"),I:s("be"),eV:s("a5"),D:s("a6"),ai:s("bS<ag<q,@>>"),ao:s("bS<d>"),J:s("a7"),eY:s("oY"),u:s("z"),bs:s("z(R)"),g2:s("ev"),dL:s("aa<aX>"),b3:s("aa<ah>"),e:s("aa<e>"),bD:s("R"),fv:s("dn<d?>"),d1:s("bW"),e_:s("bX"),y:s("r"),al:s("r(d)"),aT:s("r(z)"),i:s("e"),z:s("@"),fO:s("@()"),w:s("@(d)"),C:s("@(d,au)"),S:s("b"),c:s("bm(@,c,bm?,b,b)?"),eH:s("ap<Y>?"),an:s("I?"),bF:s("t<@>?"),aM:s("ag<+(q,e,e),bx>?"),cq:s("ag<q,ag<q,@>>?"),X:s("d?"),ae:s("aY<d>?"),dk:s("q?"),g_:s("bx?"),ev:s("by<@>?"),F:s("bd<@,@>?"),Q:s("es?"),cn:s("ew?"),fQ:s("r?"),cD:s("e?"),gs:s("b?"),cg:s("c2?"),g5:s("~()?"),q:s("c2"),H:s("~"),O:s("~()"),d5:s("~(d)"),da:s("~(d,au)"),cA:s("~(q,@)"),bp:s("~(e,e)"),fi:s("~(e,e,e,e,e,e,e,e)"),as:s("~(b,@)")}})();(function constants(){var s=hunkHelpers.makeConstList
B.a5=J.C.prototype
B.b=J.y.prototype
B.t=J.cD.prototype
B.a=J.cE.prototype
B.c=J.cG.prototype
B.p=J.c9.prototype
B.a6=J.ar.prototype
B.a7=J.Q.prototype
B.j=A.cb.prototype
B.i=A.cL.prototype
B.e=A.cM.prototype
B.f=A.cO.prototype
B.d=A.bL.prototype
B.D=J.e0.prototype
B.u=J.d0.prototype
B.o=new A.cy(0,"littleEndian")
B.r=new A.cy(1,"bigEndian")
B.H=new A.cB(A.dz("cB<0&>"))
B.I=new A.f0()
B.v=function getTagFallback(o) {
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
B.w=function(hooks) { return hooks; }

B.x=new A.dS()
B.P=new A.e_()
B.m=new A.ft()
B.Q=new A.ed()
B.k=new A.fN()
B.y=new A.ek()
B.R=new A.hD()
B.q=new A.ey()
B.S=new A.i8()
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
B.a4=new A.a_("Oversubscribed Huffman table",null,null)
B.a8=new A.f5(null)
B.z=s([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],t.t)
B.a9=s([10,7,2,7,0,0,0],t.t)
B.A=s([],t.o)
B.aa=s([5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],t.t)
B.l=s([0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],t.t)
B.ab=s([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],t.t)
B.ac=s([10,7,7,7,7,7],t.t)
B.B=s([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],t.t)
B.ad=s([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t.t)
B.ae=s(["_initialize","malloc","free","fastlottie_clear_pixels","fastlottie_fill_solid_spans","fastlottie_blend_rect","fastlottie_blend_solid","fastlottie_inner_shadow","fastlottie_gradient_spans","fl_dense_new","fl_dense_free","fl_dense_trim","fl_dense_raster"],t.s)
B.af=s([8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8],t.t)
B.C=s([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],t.t)
B.aC=new A.dc(4)
B.aD=new A.F(0,-1)
B.aE=new A.F(1,4)
B.aF=new A.F(2,0)
B.aG=new A.F(3,1)
B.aH=new A.F(4,1)
B.aI=new A.F(5,1)
B.E=new A.dg(0,0)
B.aJ=new A.F(null,null)
B.aK=new A.ay(0,0,0)
B.aL=new A.a9(0,0,0,0)
B.at={ty:0,nm:1,mn:2,ix:3,hd:4,c:5,o:6,r:7,w:8,lc:9,lj:10,ml:11,ml2:12,d:13,bm:14,g:15,s:16,e:17,t:18,h:19,a:20}
B.aM=new A.N(B.at,21,t.M)
B.ah={v:0,i:1,o:2,c:3}
B.aN=new A.N(B.ah,4,t.M)
B.av={ty:0,nm:1,mn:2,c:3,o:4,a:5,s:6,d:7,ch:8,bm:9,no:10}
B.aO=new A.N(B.av,11,t.M)
B.am={ty:0,nm:1,mn:2,ix:3,v:4}
B.F=new A.N(B.am,5,t.M)
B.ay={t:0,s:1,e:2,h:3,i:4,o:5,to:6,ti:7,n:8}
B.aP=new A.N(B.ay,9,t.M)
B.ap={inv:0,mode:1,pt:2,o:3,x:4,nm:5}
B.aQ=new A.N(B.ap,6,t.M)
B.aw={ddd:0,ind:1,ty:2,nm:3,sr:4,st:5,ip:6,op:7,ks:8,shapes:9,parent:10,ao:11,bm:12,tt:13,td:14,tp:15,masksProperties:16,hasMask:17,ef:18,hd:19,cl:20,ln:21,refId:22,w:23,h:24,ct:25,sw:26,sh:27,sc:28,tm:29,sy:30}
B.aR=new A.N(B.aw,31,t.M)
B.as={a:0,k:1,ix:2,x:3,l:4}
B.G=new A.N(B.as,5,t.M)
B.aB={v:0,fr:1,ip:2,op:3,w:4,h:5,nm:6,ddd:7,assets:8,layers:9,markers:10,meta:11,fonts:12,chars:13,slots:14,tgs:15,comps:16,fitz:17,props:18}
B.aS=new A.N(B.aB,19,t.M)
B.az={ty:0,nm:1,mn:2,ix:3,hd:4,it:5,np:6,cix:7,bm:8,cl:9}
B.aT=new A.N(B.az,10,t.M)
B.al={s:0,x:1,y:2,ix:3}
B.aU=new A.N(B.al,4,t.M)
B.aj={ty:0,nm:1,mn:2,ix:3,hd:4,ks:5,ind:6,d:7,bm:8}
B.aV=new A.N(B.aj,9,t.M)
B.an={ty:0,nm:1,mn:2,ix:3,hd:4,mm:5,bm:6,cix:7}
B.aW=new A.N(B.an,8,t.M)
B.au={}
B.aX=new A.N(B.au,0,t.M)
B.ak={a:0,s:1,i:2,f:3,n:4}
B.aY=new A.N(B.ak,5,t.M)
B.aA={ty:0,nm:1,mn:2,ix:3,hd:4,sy:5,pt:6,p:7,r:8,ir:9,is:10,or:11,os:12,d:13,bm:14}
B.aZ=new A.N(B.aA,15,t.M)
B.ag={ty:0,nm:1,np:2,mn:3,ix:4,en:5,ef:6}
B.b_=new A.N(B.ag,7,t.M)
B.ai={ty:0,nm:1,mn:2,ix:3,hd:4,p:5,s:6,r:7,d:8,bm:9}
B.b0=new A.N(B.ai,10,t.M)
B.ar={n:0,nm:1,v:2}
B.b1=new A.N(B.ar,3,t.M)
B.aq={ty:0,nm:1,mn:2,ix:3,hd:4,s:5,e:6,o:7,m:8,bm:9}
B.b2=new A.N(B.aq,10,t.M)
B.ao={ty:0,nm:1,mn:2,ix:3,hd:4,a:5,p:6,s:7,r:8,o:9,sk:10,sa:11,rx:12,ry:13,rz:14,or:15}
B.b3=new A.N(B.ao,16,t.M)
B.ax={p:0,k:1}
B.b4=new A.N(B.ax,2,t.M)
B.b5=A.aK("ou")
B.b6=A.aK("ov")
B.b7=A.aK("bm")
B.b8=A.aK("eV")
B.b9=A.aK("eW")
B.ba=A.aK("lR")
B.bb=A.aK("j_")
B.bc=A.aK("lS")
B.bd=A.aK("d")
B.be=A.aK("ji")
B.bf=A.aK("d_")
B.bg=A.aK("mt")
B.bh=A.aK("bu")
B.bi=new A.fK(!1)
B.h=new A.c(null,null)
B.n=new A.c(B.h,"layers")})();(function staticFields(){$.hK=null
$.az=A.i([],t.f)
$.k1=null
$.fm=0
$.jd=A.nA()
$.jW=null
$.jV=null
$.l0=null
$.kX=null
$.l4=null
$.ir=null
$.iz=null
$.jE=null
$.hT=A.i([],A.dz("y<t<d>?>"))
$.cq=null
$.dv=null
$.dw=null
$.jv=!1
$.E=B.k
$.kV=null
$.jt=null
$.l=null
$.ff=null
$.cJ=0})();(function lazyInitializers(){var s=hunkHelpers.lazyFinal
s($,"ox","l8",()=>A.is("_$dart_dartClosure"))
s($,"ow","iP",()=>A.is("_$dart_dartClosure_dartJSInterop"))
s($,"p7","lv",()=>B.k.bs(B.k,A.dz("ap<~>()").a(new A.iD()),A.dz("ap<~>")))
s($,"p5","lu",()=>A.i([new J.dO()],A.dz("y<cV>")))
s($,"oK","ld",()=>A.bc(A.fI({
toString:function(){return"$receiver$"}})))
s($,"oL","le",()=>A.bc(A.fI({$method$:null,
toString:function(){return"$receiver$"}})))
s($,"oM","lf",()=>A.bc(A.fI(null)))
s($,"oN","lg",()=>A.bc(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"oQ","lj",()=>A.bc(A.fI(void 0)))
s($,"oR","lk",()=>A.bc(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(r){return r.message}}()))
s($,"oP","li",()=>A.bc(A.ke(null)))
s($,"oO","lh",()=>A.bc(function(){try{null.$method$}catch(r){return r.message}}()))
s($,"oT","lm",()=>A.bc(A.ke(void 0)))
s($,"oS","ll",()=>A.bc(function(){try{(void 0).$method$}catch(r){return r.message}}()))
s($,"oB","dA",()=>A.m5(4))
s($,"oU","jM",()=>A.mu())
s($,"oy","jJ",()=>$.lv())
s($,"p1","ls",()=>A.m7(4096))
s($,"p_","lq",()=>new A.i6().$0())
s($,"p0","lr",()=>new A.i5().$0())
s($,"p3","eN",()=>A.iE(B.bd))
s($,"oF","jK",()=>{A.mb()
return $.fm})
s($,"p4","lt",()=>Symbol("jsBoxedDartObjectProperty"))
s($,"oA","la",()=>A.iX(B.af,!1))
s($,"oz","l9",()=>A.iX(B.aa,!1))
s($,"ot","eM",()=>A.lF())
s($,"p2","jO",()=>A.e3("content\\('([^']*)'\\)"))
s($,"oX","lp",()=>A.e3("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*transform\\.[xy]Position;\\s*$"))
s($,"oV","ln",()=>A.e3("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*((?:content\\('[^']*'\\)\\.)+)(transform\\.scale|transform\\.rotation|opacity);\\s*$"))
s($,"oW","lo",()=>A.e3('[\\\\"\\x00-\\x1f]'))
s($,"oZ","jN",()=>A.e3("^var \\$bm_rt;\\s*\\$bm_rt\\s*=\\s*thisComp\\.layer\\('([^']*)'\\)\\.((?:content\\('[^']*'\\)\\.)+)path;\\s*$"))
s($,"oH","jL",()=>new A.fA().$0())
s($,"oJ","lc",()=>A.ms())
s($,"oI","lb",()=>A.mr())})();(function nativeSupport(){!function(){var s=function(a){var m={}
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
hunkHelpers.setOrUpdateInterceptorsByTag({SharedArrayBuffer:A.bq,ArrayBuffer:A.ca,ArrayBufferView:A.cN,DataView:A.dU,Float32Array:A.cb,Float64Array:A.cL,Int16Array:A.dV,Int32Array:A.cM,Int8Array:A.dX,Uint16Array:A.dY,Uint32Array:A.cO,Uint8ClampedArray:A.cP,CanvasPixelArray:A.cP,Uint8Array:A.bL})
hunkHelpers.setOrUpdateLeafTags({SharedArrayBuffer:true,ArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.a8.$nativeSuperclassTag="ArrayBufferView"
A.d8.$nativeSuperclassTag="ArrayBufferView"
A.d9.$nativeSuperclassTag="ArrayBufferView"
A.br.$nativeSuperclassTag="ArrayBufferView"
A.da.$nativeSuperclassTag="ArrayBufferView"
A.db.$nativeSuperclassTag="ArrayBufferView"
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
var s=A.og
if(typeof dartMainRunner==="function"){dartMainRunner(s,[])}else{s([])}})})()