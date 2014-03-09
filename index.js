function count(word){
    // syllable count.
    word = word.toLowerCase();                                       
    if (word.length <= 3)
        return 1; 
    
    // cleanup                          
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   
    word = word.replace(/^y/, '');                                
    return word.match(/[aeiouy]{1,2}/g).length;                    
}

function o(w){
    var s = count(w),
        o = {
            length: s
        },
        p;    
    
    // one syllable is easy.
    if (s == 1){
        p = (w.length / 2 >> 0);
        p > 1 && w.length % 2 == 0 && p--;
        o.pre = '&nbsp;';
        p && (o.pre = w.substr(0, p));
        o.orp = w.charAt(p);
        
        o.post = '&nbsp;';
        p < w.length -1 && (o.post = w.substr(p+1));
    }
    else {
        p = (w.length / 3 >> 0);
        p > 2 && p--;
        // p > 1 && w.length % 2 == 0 && p--;
        o.pre = '&nbsp;';
        p && (o.pre = w.substr(0, p));
        o.orp = w.charAt(p);
        
        o.post = '&nbsp;';
        p < w.length -1 && (o.post = w.substr(p+1));
   
    }
    // for more, we need to orp to the left, which means hyphenation detection...
    
    //console.log(o);
    return o;
}
    
function getWords(text){
    return text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s/);    
};

var words = getWords('A cigarette a day keeps the doctor away. The quick brown fox jumps over the lazy dog. Kentaromiura likes to blow himself in the bath'),
    els = {
        pre: document.querySelector('.pre'),
        orp: document.querySelector('.orp'),
        post: document.querySelector('.post'),
        count: document.querySelector('.count')
    },
    c = 0,
    time = +new Date,
    baseSpeed = 120;

function getSpeed(){
    var val = this.value.replace(/[\W]/g,''),
        speed = parseInt(val, 10);
    if (!isNaN(speed)){
        baseSpeed = speed;
        c = 0;
        time = +new Date;
    }
}

document.querySelector('.speed').addEventListener('change', getSpeed);


var proc = function(a){
    var w = a.shift(),
        t = o(w),
        k;
    
    els.count.innerHTML = 'Speed: ' + ++c + ' words in ' + ((+new Date - time) / 1000 >> 0)  + 's';
    for (k in t)
        els[k] && (els[k].innerHTML = t[k]);
    
    a.length || (a = words.slice());
    
    a.length && setTimeout(function(){
        proc(a);
    }, baseSpeed + w.length * 10);
    
};


proc(words.slice());