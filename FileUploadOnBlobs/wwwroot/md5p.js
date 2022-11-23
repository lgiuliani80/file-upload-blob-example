class MD5Hash {
    constructor() {
        this.init();
    }

    init() {
        this.a =  1732584193;
        this.b = -271733879;
        this.c = -1732584194;
        this.d =  271733878;
        this.countLo = 0;
        this.countHi = 0;
        this.block = new Uint8Array(64);
    }

    update(binarydata) {
        let index = (this.countLo >> 3) & 0x3F;
        let i = 0;

        this.countLo += binarydata.length << 3;

        if (this.countLo >= 2**32) {
            this.countLo %= 2**32;
            this.countHi++;
        }

        let partLen = 64 - index;

        if (binarydata.length >= partLen) {
            for (i = 0; i < partLen; i++)
                this.block[index + i] = binarydata[i];
            
                this._transformBlock(this.block);
            
            for (i = partLen; i + 63 < binarydata.length; i += 64)
                this._transformBlock(binarydata.slice(i));

            index = 0;
        }
        
        for (let k = i; k < binarydata.length; k++)
            this.block[k - i + index] = binarydata[i + (k - i)];
    }

    _transformBlock(block) {
        let m00,m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12,m13,m14,m15,aa,bb,cc,dd;
        let l = block.length * 8;
        let m = Crypt.bytesToWords(block);

        function ____(s,t,n){ return ( ( n << s ) | ( n >>> t ) ) }

        // Swap endian
        for (let j = 0; j < m.length; j++) {
            m[j] = ((m[j] <<  8) | (m[j] >>> 24)) & 0x00FF00FF | ((m[j] << 24) | (m[j] >>>  8)) & 0xFF00FF00;
        }

        // Padding
        //m[l >>> 5] |= 0x80 << (l % 32);
        //m[(((l + 64) >>> 9) << 4) + 14] = l;
        
        aa            = this.a;
        bb            = this.b;
        cc            = this.c;
        dd            = this.d;

        m00           = m[ 0] >>> 0;
        m01           = m[ 1] >>> 0;
        m02           = m[ 2] >>> 0;
        m03           = m[ 3] >>> 0;
        m04           = m[ 4] >>> 0;
        m05           = m[ 5] >>> 0;
        m06           = m[ 6] >>> 0;
        m07           = m[ 7] >>> 0;
        m08           = m[ 8] >>> 0;
        m09           = m[ 9] >>> 0;
        m10           = m[10] >>> 0;
        m11           = m[11] >>> 0;
        m12           = m[12] >>> 0;
        m13           = m[13] >>> 0;
        m14           = m[14] >>> 0;
        m15           = m[15] >>> 0;

        this.a             = ____( 7, 25, this.a + ( this.b & this.c | ~this.b & this.d ) + m00 - 680876936) + this.b ;
        this.d             = ____(12, 20, this.d + ( this.a & this.b | ~this.a & this.c ) + m01 - 389564586) + this.a ;
        this.c             = ____(17, 15, this.c + ( this.d & this.a | ~this.d & this.b ) + m02 + 606105819) + this.d ;
        this.b             = ____(22, 10, this.b + ( this.c & this.d | ~this.c & this.a ) + m03 - 1044525330) + this.c ;
        this.a             = ____( 7, 25, this.a + ( this.b & this.c | ~this.b & this.d ) + m04 - 176418897) + this.b ;
        this.d             = ____(12, 20, this.d + ( this.a & this.b | ~this.a & this.c ) + m05 + 1200080426) + this.a ;
        this.c             = ____(17, 15, this.c + ( this.d & this.a | ~this.d & this.b ) + m06 - 1473231341) + this.d ;
        this.b             = ____(22, 10, this.b + ( this.c & this.d | ~this.c & this.a ) + m07 - 45705983) + this.c ;
        this.a             = ____( 7, 25, this.a + ( this.b & this.c | ~this.b & this.d ) + m08 + 1770035416) + this.b ;
        this.d             = ____(12, 20, this.d + ( this.a & this.b | ~this.a & this.c ) + m09 - 1958414417) + this.a ;
        this.c             = ____(17, 15, this.c + ( this.d & this.a | ~this.d & this.b ) + m10 - 42063) + this.d ;
        this.b             = ____(22, 10, this.b + ( this.c & this.d | ~this.c & this.a ) + m11 - 1990404162) + this.c ;
        this.a             = ____( 7, 25, this.a + ( this.b & this.c | ~this.b & this.d ) + m12 + 1804603682) + this.b ;
        this.d             = ____(12, 20, this.d + ( this.a & this.b | ~this.a & this.c ) + m13 - 40341101) + this.a ;
        this.c             = ____(17, 15, this.c + ( this.d & this.a | ~this.d & this.b ) + m14 - 1502002290) + this.d ;
        this.b             = ____(22, 10, this.b + ( this.c & this.d | ~this.c & this.a ) + m15 + 1236535329) + this.c ;

        this.a             = ____( 5, 27, this.a + ( this.b & this.d | this.c & ~this.d ) + m01 - 165796510) + this.b ;
        this.d             = ____( 9, 23, this.d + ( this.a & this.c | this.b & ~this.c ) + m06 - 1069501632) + this.a ;
        this.c             = ____(14, 18, this.c + ( this.d & this.b | this.a & ~this.b ) + m11 + 643717713) + this.d ;
        this.b             = ____(20, 12, this.b + ( this.c & this.a | this.d & ~this.a ) + m00 - 373897302) + this.c ;
        this.a             = ____( 5, 27, this.a + ( this.b & this.d | this.c & ~this.d ) + m05 - 701558691) + this.b ;
        this.d             = ____( 9, 23, this.d + ( this.a & this.c | this.b & ~this.c ) + m10 + 38016083) + this.a ;
        this.c             = ____(14, 18, this.c + ( this.d & this.b | this.a & ~this.b ) + m15 - 660478335) + this.d ;
        this.b             = ____(20, 12, this.b + ( this.c & this.a | this.d & ~this.a ) + m04 - 405537848) + this.c ;
        this.a             = ____( 5, 27, this.a + ( this.b & this.d | this.c & ~this.d ) + m09 + 568446438) + this.b ;
        this.d             = ____( 9, 23, this.d + ( this.a & this.c | this.b & ~this.c ) + m14 - 1019803690) + this.a ;
        this.c             = ____(14, 18, this.c + ( this.d & this.b | this.a & ~this.b ) + m03 - 187363961) + this.d ;
        this.b             = ____(20, 12, this.b + ( this.c & this.a | this.d & ~this.a ) + m08 + 1163531501) + this.c ;
        this.a             = ____( 5, 27, this.a + ( this.b & this.d | this.c & ~this.d ) + m13 - 1444681467) + this.b ;
        this.d             = ____( 9, 23, this.d + ( this.a & this.c | this.b & ~this.c ) + m02 - 51403784) + this.a ;
        this.c             = ____(14, 18, this.c + ( this.d & this.b | this.a & ~this.b ) + m07 + 1735328473) + this.d ;
        this.b             = ____(20, 12, this.b + ( this.c & this.a | this.d & ~this.a ) + m12 - 1926607734) + this.c ;

        this.a             = ____( 4, 28, this.a + (this.b ^ this.c ^ this.d) + m05 - 378558) + this.b ;
        this.d             = ____(11, 21, this.d + (this.a ^ this.b ^ this.c) + m08 - 2022574463) + this.a ;
        this.c             = ____(16, 16, this.c + (this.d ^ this.a ^ this.b) + m11 + 1839030562) + this.d ;
        this.b             = ____(23,  9, this.b + (this.c ^ this.d ^ this.a) + m14 - 35309556) + this.c ;
        this.a             = ____( 4, 28, this.a + (this.b ^ this.c ^ this.d) + m01 - 1530992060) + this.b ;
        this.d             = ____(11, 21, this.d + (this.a ^ this.b ^ this.c) + m04 + 1272893353) + this.a ;
        this.c             = ____(16, 16, this.c + (this.d ^ this.a ^ this.b) + m07 - 155497632) + this.d ;
        this.b             = ____(23,  9, this.b + (this.c ^ this.d ^ this.a) + m10 - 1094730640) + this.c ;
        this.a             = ____( 4, 28, this.a + (this.b ^ this.c ^ this.d) + m13 + 681279174) + this.b ;
        this.d             = ____(11, 21, this.d + (this.a ^ this.b ^ this.c) + m00 - 358537222) + this.a ;
        this.c             = ____(16, 16, this.c + (this.d ^ this.a ^ this.b) + m03 - 722521979) + this.d ;
        this.b             = ____(23,  9, this.b + (this.c ^ this.d ^ this.a) + m06 + 76029189) + this.c ;
        this.a             = ____( 4, 28, this.a + (this.b ^ this.c ^ this.d) + m09 - 640364487) + this.b ;
        this.d             = ____(11, 21, this.d + (this.a ^ this.b ^ this.c) + m12 - 421815835) + this.a ;
        this.c             = ____(16, 16, this.c + (this.d ^ this.a ^ this.b) + m15 + 530742520) + this.d ;
        this.b             = ____(23,  9, this.b + (this.c ^ this.d ^ this.a) + m02 - 995338651) + this.c ;

        this.a             = ____( 6, 26, this.a + (this.c ^ (this.b | ~this.d)) + m00 - 198630844) + this.b ;
        this.d             = ____(10, 22, this.d + (this.b ^ (this.a | ~this.c)) + m07 + 1126891415) + this.a ;
        this.c             = ____(15, 17, this.c + (this.a ^ (this.d | ~this.b)) + m14 - 1416354905) + this.d ;
        this.b             = ____(21, 11, this.b + (this.d ^ (this.c | ~this.a)) + m05 - 57434055) + this.c ;
        this.a             = ____( 6, 26, this.a + (this.c ^ (this.b | ~this.d)) + m12 + 1700485571) + this.b ;
        this.d             = ____(10, 22, this.d + (this.b ^ (this.a | ~this.c)) + m03 - 1894986606) + this.a ;
        this.c             = ____(15, 17, this.c + (this.a ^ (this.d | ~this.b)) + m10 - 1051523) + this.d ;
        this.b             = ____(21, 11, this.b + (this.d ^ (this.c | ~this.a)) + m01 - 2054922799) + this.c ;
        this.a             = ____( 6, 26, this.a + (this.c ^ (this.b | ~this.d)) + m08 + 1873313359) + this.b ;
        this.d             = ____(10, 22, this.d + (this.b ^ (this.a | ~this.c)) + m15 - 30611744) + this.a ;
        this.c             = ____(15, 17, this.c + (this.a ^ (this.d | ~this.b)) + m06 - 1560198380) + this.d ;
        this.b             = ____(21, 11, this.b + (this.d ^ (this.c | ~this.a)) + m13 + 1309151649) + this.c ;
        this.a             = ____( 6, 26, this.a + (this.c ^ (this.b | ~this.d)) + m04 - 145523070) + this.b ;
        this.d             = ____(10, 22, this.d + (this.b ^ (this.a | ~this.c)) + m11 - 1120210379) + this.a ;
        this.c             = ____(15, 17, this.c + (this.a ^ (this.d | ~this.b)) + m02 + 718787259) + this.d ;
        this.b             = ____(21, 11, this.b + (this.d ^ (this.c | ~this.a)) + m09 - 343485551) + this.c ;

        this.a = (this.a + aa) >>> 0;
        this.b = (this.b + bb) >>> 0;
        this.c = (this.c + cc) >>> 0;
        this.d = (this.d + dd) >>> 0;
    }

    finalize() {
        // Padding
        const PADDING = [0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

        let bits = Crypt.wordsToBytes([Crypt.endian(this.countLo), Crypt.endian(this.countHi)]);
        let index = ((this.countLo >> 3) & 0x3f);
        let padLen = (index < 56) ? (56 - index) : (120 - index);
        this.update(PADDING.slice(0, padLen));
        this.update(bits);
    }

    get hashBytes() {
        let words = Crypt.endian([this.a, this.b, this.c, this.d]);
        return Crypt.wordsToBytes(words);
    }
    
    get hashHex() {
        return Crypt.bytesToHex(this.hashBytes)
    }
}

class Crypt {
    static rotl(n,b) {
        return (n << b) | (n >>> (32 - b));
    }

    static endian(n) {
        if (n.constructor == Number) {
            return Crypt.rotl(n, 8) & 0x00FF00FF | Crypt.rotl(n, 24) & 0xFF00FF00;
        }
        for (let i = 0; i < n.length; i++)
            n[i] = Crypt.endian(n[i]);
        return n;
    }

    static bytesToWords(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= bytes[i] << (24 - b % 32);
        return words;
    }

    static wordsToBytes(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        return bytes;
    }

    static bytesToHex(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join('');
    }
}