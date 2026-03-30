let tabs = [];
let subjects = [];
let inblock = false;

let data = {
  name: "",
  date: "",
  version: "",
  contains: "",
};

let filedata = {
  name: "",
  date: "",
  description: "",
  version: "",
};

let FILES = ["project1.txt", "project2.txt"];

let isOn = false;
const files = document.getElementById("files");

files.addEventListener("transitionend", () => {
  if (!isOn) {
    files.style.display = "none"; // hide completely after closing
  }
});

function toggleFiles() {
  if (isOn) {
    // Closing: animate height to 0
    files.style.height = files.scrollHeight + "px"; // start from current
    files.offsetHeight; // force reflow
    files.style.height = "0";
    create("reload", {});
    isOn = false;
  } else {
    // Opening: make visible and animate height
    files.style.display = "flex";
    let height = 0;
    if (files.childElementCount < 4) {
      height = files.scrollHeight + "px";
    } else {
      height = "270px";
    }

    files.style.height = "0"; // start from 0
    files.offsetHeight; // force reflow
    files.style.height = height; // animate to full height

    isOn = true;
  }
}

toggleFiles();

loadData();
async function loadData() {
  const response = await fetch("./Files/base.txt");
  const text = await response.text();
  let lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let lineComps = lines[i].split(" ");
    let line = lines[i].trim();

    switch (lineComps[0].trim()) {
      case "}":
        create("file", filedata);
        break;

      case "NAME:":
        filedata.name = getValue(lines[i]);
        break;

      case "DATE:":
        filedata.date = getValue(lines[i]);
        break;
    }
  }

  toggleFiles();
}

function convertFileToIndex(file) {
  console.log(file);
  for (let i = 0; i < FILES.length; i++) {
    if (file === FILES[i]) {
      return i;
    }
  }
}
async function readFile(file) {
  console.log("boom");
  const response = await fetch(
    "./Files/subfiles/" + FILES[convertFileToIndex(file)],
  );
  const text = await response.text();

  let lines = text.split("\n");

  if (inblock) {
    Display("back", {});
    inblock = false;
  }

  create("reload", {});
  for (let i = 0; i < lines.length; i++) {
    let lineComps = lines[i].split(" ");
    let line = lines[i].trim();

    switch (lineComps[0].trim()) {
      case "}":
        create("button", data);

        break;

      case "NAME:":
        data.name = getValue(lines[i]);

        break;

      case "DATE:":
        data.date = getValue(lines[i]);

        break;
    }
  }
}

let index = 0;
let blocks = {};
const page = document.getElementById("pageid");
function create(type, l = {}) {
  let buttons = document.querySelectorAll(".bi");

  if (type === "file") {
    const parent = document.getElementById("files");
    //parent.style.visibility = false;
    let button = document.createElement("button");
    button.className = "bon";
    button.innerText = [l.name];

    button.addEventListener("click", () => {
      readFile([l.name] + ".txt");
    });
    parent.appendChild(button);
    filedata = {
      name: "",
      date: "",
      description: "",
      version: "",
    };
  }
  if (type === "reload") {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].remove();
      //Display("back", {});
    }

    const not = document.getElementsByClassName("not");
    for (let e = 0; e < not.length; e++) {
      if (not[e] !== null) {
        not[e].remove();
      }
    }
  } else if (type === "button") {
    let name = l.name;
    let date = l.date;

    const parent = document.getElementById("output");

    let button = document.createElement("button");
    button.textContent = name || "Button";
    button.classList.add("bi");
    // Set a unique ID
    let ID = "bi" + buttons.length;
    button.id = ID;

    let blockID = index;
    blocks[blockID] = {
      Name: name,
      Date: date,
    };

    //console.table(blocks);

    // Add the click listener directly to the button
    button.addEventListener("click", () => {
      Display("display", blocks[blockID]);
      inblock = true;
    });

    index++;

    parent.appendChild(button);
  }
}
function Display(type, array = {}) {
  let name = array.Name;
  let date = array.Date;
  console.log(name + " " + date);
  const parent = document.getElementById("pr");

  if (type === "display") {
    document.getElementById("output").remove();
    const page = document.createElement("div");
    page.className = "display";
    page.id = "pageid";
    const head = document.createElement("h1");
    head.className = "not";
    head.innerText = name;
    page.appendChild(head);
    parent.appendChild(page);
  } else if (type === "back") {
    let elements = document.getElementById("pageid");
    elements.remove();
    const page = document.createElement("div");
    page.className = "content";
    page.id = "output";
    parent.appendChild(page);
  }

  data = {
    name: "",
    date: "",
  };
}

function getValue(line) {
  let start = line.indexOf('"');
  let end = line.lastIndexOf('"');

  if (start !== -1 && end !== -1 && end > start) {
    return line.substring(start + 1, end);
  }

  return "";
}
