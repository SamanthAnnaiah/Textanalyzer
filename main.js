console.log("Hello World");

let textdata = " ";

let total_chars = 0;
let total_words = 0;
let total_chars_wspace = 0;
let uword_count = 0;
let sentence_count = 0;
let cdmap = "";

let fl2 = document.querySelector(".fl2");
fl2.classList.remove("dflex");
fl2.classList.add("dnone");

let fl3 = document.querySelector(".fl3_ldensity");
fl3.classList.remove("dflex");
fl3.classList.add("dnone");
fl3.addEventListener("mouseover", (e) => {
  handlefl3hover(e);
});

function handlefl3hover(e) {
  let htarget = e.target.closest(".fl3_content");
  console.log("hover: ", htarget);
  if (htarget) {
    htarget.title = htarget.dataset.fortitle;
  }
}

const form1 = document.getElementById("form1");

form1.addEventListener("submit", (e) => {
  e.preventDefault();
  fl2.classList.remove("dflex");
  fl2.classList.add("dnone");

  let fdata = new FormData(form1);
  let tdata = fdata.get("textdata");
  let max_chars = fdata.get("max_chars");
  let exclude_spaces = fdata.get("exclude_spaces");

  textdata = tdata.trim();
  if (textdata == "" || textdata == null) {
    window.alert("Please insert valid text");
    return;
  }
  if (max_chars == "") {
    max_chars = 0;
  }
  max_chars = max_chars ?? 0;
  if (max_chars !== 0 && max_chars < textdata.length) {
    textdata = textdata.substring(0, max_chars);
  }
  total_chars = textdata.length;
  let words = textdata.split(" ");
  total_words = words.length;
  sentence_count = textdata.split(".").length - 1;
  if (sentence_count == 0) {
    sentence_count = 1;
  }
  uword_count = uwordCounter(words);
  let wsdata = textdata.replace(/\s+/g, "");
  wsdata = wsdata.trim();
  wsdata = wsdata.toLowerCase();
  total_chars_wspace = wsdata.length;
  if (exclude_spaces == "on") {
    total_chars = wsdata.length;
  }
  cdmap = "";
  cdmap = characterDensity(wsdata);
  console.log(cdmap);
  console.log("TextData: ", textdata);
  console.log("TotalChars: ", total_chars);
  console.log("TotalChars without space: ", total_chars_wspace);
  console.log("TotalWords: ", total_words);
  console.log("ReadingTime (in seconds) : ", total_words * 2);
  console.log("UniqueWords: ", uword_count);
  console.log("UniqueCharacters (case sensitive) : ", cdmap.size);
  console.log("SentenceCount: ", sentence_count);

  processOutputs();
});

function uwordCounter(twords) {
  //   let wpattern = /[.=\\-*&]/gi;
  let mset = new Set();
  for (let k = 0; k < twords.length; k++) {
    let mword = twords[k].trim();
    mword = mword.replace(/(.\s)+/g, "");
    if (!((mword == " ") | (mword == ""))) {
      mset.add(mword);
    }
  }
  return mset.size;
}

function characterDensity(twsdata) {
  let gdata = twsdata.split("");
  gdata = gdata.sort();
  let smap = new Map();
  console.log(gdata);
  let y = 0;
  for (let i = 0; i < gdata.length; i++) {
    if (y === 0 && i === gdata.lastIndexOf(gdata[i])) {
      smap.set(gdata[i], 1);
      y++;
    } else {
      if (y === 0) {
        smap.set(gdata[i], gdata.lastIndexOf(gdata[i]) + 1);
        y++;
        i = y;
      } else {
        if (i !== gdata.lastIndexOf(gdata[i])) {
          smap.set(gdata[i], gdata.lastIndexOf(gdata[i]) + 1 - i);
          i = gdata.lastIndexOf(gdata[i]);
          y++;
        } else {
          smap.set(gdata[i], 1);
          y++;
        }
      }
    }
  }
  return smap;
}

function processOutputs() {
  fl2.classList.remove("dnone");
  fl2.classList.add("dflex");
  fl2.textContent = "";

  buildoutput(total_chars, "Total Characters");
  buildoutput(total_words, "Total Words");
  buildoutput(uword_count, "Unique Characters");
  buildoutput(sentence_count, "Total Sentences");
  buildletterdensity();
}

function buildoutput(outnum, outtitle) {
  let onum = document.createElement("div");
  onum.classList.add("outcard_num");
  onum.textContent = outnum;

  let otext = document.createElement("div");
  otext.classList.add("outcard_title");
  otext.textContent = outtitle;

  let pdiv = document.createElement("div");
  pdiv.classList.add("outcard");

  pdiv.appendChild(onum);
  pdiv.appendChild(otext);

  fl2.appendChild(pdiv);
}

function buildletterdensity() {
  fl3.textContent = "";
  fl3.classList.remove("dnone");
  fl3.classList.add("dflex");
  let mathsum = 0;
  let h3div = document.createElement("h3");
  h3div.classList.add("outcard_title");
  h3div.textContent = "Letters Density";
  fl3.appendChild(h3div);
  for (let [key, value] of cdmap.entries()) {
    let tletters = Number(total_chars_wspace);
    let cvalue = Number(value);
    mathsum = mathsum + cvalue;
    let lperc = ((cvalue / tletters) * 100).toFixed(4);
    console.log(`Key and Value pairs: ${key} ${lperc}%`);
    let fl3div = document.createElement("div");
    fl3div.classList.add("fl3_content");
    fl3div.classList.add("fl1");
    fl3div.dataset.fortitle = `${cvalue} counts`;

    let fl3div_letter = document.createElement("div");
    fl3div_letter.classList.add("fl3_letter");
    fl3div_letter.textContent = key;

    let fl3div_perc = document.createElement("div");
    fl3div_perc.classList.add("fl3_perc");
    fl3div_perc.textContent = `${cvalue}(${lperc}%)`;

    let fl3div_line_head = document.createElement("div");
    fl3div_line_head.classList.add("fl3_head");

    let fl3div_line = document.createElement("div");
    fl3div_line.classList.add("fl3_line");

    let fl3div_line_perc = document.createElement("div");
    fl3div_line_perc.classList.add("fl3_line_perc");
    let wcalc = 1000 * (lperc / 100) + (lperc / 100) * 2;
    fl3div_line_perc.style.width = `${wcalc}px`;

    fl3div_line_head.appendChild(fl3div_line);
    fl3div_line_head.appendChild(fl3div_line_perc);

    fl3div.appendChild(fl3div_letter);
    fl3div.appendChild(fl3div_line_head);
    fl3div.appendChild(fl3div_perc);

    fl3.appendChild(fl3div);
  }
  console.log("Total sum of chars from map: ", mathsum);
}
