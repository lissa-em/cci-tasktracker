let task = {
  taskDesc: "",
  energyBefore: 5,
  energyAfter: 5,
  PainLevel: 5,
  symptoms: [],
  SleepOK: false,
  EatOK: false,
  DrinkOK: false,
  Weather: "Select"
};

function setup() {
  let cnv = createCanvas(330, 225);
  cnv.class('Canvas');
  textSize(16);
  renderTaskHistory();
  //aaaaaaaaaa
  // get everything from the HTML

  const inputTask = document.getElementById('taskInput1');
  const sliderBefore = document.getElementById('energyBefore1');
  const spanBefore = document.getElementById('energyBeforeValue1');
  const sliderAfter = document.getElementById('energyAfter1');
  const spanAfter = document.getElementById('energyAfterValue1');
  const symptomInput = document.getElementById('symptomInput1');
  const symptomList = document.getElementById('symptomList1');
  const addSymptomBtn = document.getElementById('addSymptomBtn');
  const saveTaskBtn = document.getElementById('saveTaskBtn');
  const clearTaskBtn = document.getElementById('clearTaskBtn');
  const WeatherSelect = document.getElementById('WeatherData');
  const SleepYes = document.getElementById('SleepYes');
  const SleepNo = document.getElementById('SleepNo');
  const EatYes = document.getElementById('EatYes');
  const EatNo = document.getElementById('EatNo');
  const DrinkYes = document.getElementById('DrinkYes');
  const DrinkNo = document.getElementById('DrinkNo');
  const PainLevel = document.getElementById('PainLevel');
  spanBefore.textContent = sliderBefore.value;
  spanAfter.textContent = sliderAfter.value;

  inputTask.addEventListener('input', () => {
    task.taskDesc = inputTask.value.trim();
  });

  sliderBefore.addEventListener('input', () => {
    spanBefore.textContent = sliderBefore.value;
    task.energyBefore = Number(sliderBefore.value);
  });

  sliderAfter.addEventListener('input', () => {
    spanAfter.textContent = sliderAfter.value;
    task.energyAfter = Number(sliderAfter.value);
  });

  PainLevel.addEventListener('input', () => {
    spanAfter.textContent = PainLevel.value;
    task.PainLevel = Number(PainLevel.value);
  });

  // Sleep and Eat Checkboxes

SleepYes.addEventListener('change', () => {
  if (SleepYes.checked) {
    SleepNo.checked = false;
    task.SleepOK = true;
  } else {
    task.SleepOK = false; 
  }
});

SleepNo.addEventListener('change', () => {
  if (SleepNo.checked) {
    SleepYes.checked = false;
    task.SleepOK = false;
  }
});

  EatYes.addEventListener('change', () => {
    if (EatYes.checked) {
      EatNo.checked = false;
      task.EatOK = true;
    } else {
      task.EatOK = false; 
    }
  }
);
  EatNo.addEventListener('change', () => {
    if (EatNo.checked) {
      EatYes.checked = false;
      task.EatOK = false;
    }
  }
);

  DrinkYes.addEventListener('change', () => {
    if (DrinkYes.checked) {
      DrinkNo.checked = false;
      task.DrinkOK = true;
    } else {
      task.DrinkOK = false; 
    }
  }
);
  DrinkNo.addEventListener('change', () => {
    if (DrinkNo.checked) {
      DrinkYes.checked = false;
      task.DrinkOK = false;
    }
  }
);

// Weather Input Stuff

  WeatherSelect.addEventListener('change', () => {
    task.Weather = WeatherSelect.value;
  });

  addSymptomBtn.addEventListener('click', () => {
    const symptomText = symptomInput.value.trim();
    if (symptomText !== "") {
      task.symptoms.push(symptomText);
      symptomInput.value = '';
      updateSymptomList(symptomList);
    }
  });

  // Save Task Button
  saveTaskBtn.addEventListener('click', () => {
  task.taskDesc = inputTask.value.trim();

  if (!task.taskDesc) {
    alert("Please enter a task description.");
    return;
  }

  let taskFrame = JSON.parse(localStorage.getItem('Task_DataFrame')) || [];
  const newTask = { ...task, timestamp: new Date().toISOString() };
  taskFrame.push(newTask);
  localStorage.setItem('Task_DataFrame', JSON.stringify(taskFrame));

  renderTaskHistory(); 
  resetForm(); 

  console.log("Task saved:", newTask);
  alert("Task saved to dataframe!");
});

  // Clear Task Button
  clearTaskBtn.addEventListener('click', () => {
    localStorage.removeItem('Task_DataFrame');
    renderTaskHistory();
    task = {
      taskDesc: "",
      energyBefore: 5,
      energyAfter: 5,
      PainLevel:5,
      symptoms: [],
      SleepOK: false,
      EatOK: false,
      DrinkOK: false,
      Weather: "Select"
    };

    resetForm();
    alert("All tasks cleared.");
  });
 
}

function draw() {
  let symptomHeight = task.symptoms.length * 20;
  let baseHeight = 300;
  let totalHeight = baseHeight + symptomHeight + 40;
  resizeCanvas(330, totalHeight);
  clear();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(24);
  textStyle(BOLD);
  text('Current Task:', 10, 10);
  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(NORMAL);
  let x = 55;
  let y = 30;
  text('Task: ' + task.taskDesc, 10, x);
  text('Energy Before: ' + task.energyBefore, 10, x+y);
  text('Energy After: ' + task.energyAfter, 10, x+y*2);
  text('Pain Level: ' + task.PainLevel, 10, x+y*3);
  text('Slept Well: ' + (task.SleepOK ? 'Yes' : 'No'), 10, x+y*4);
  text('Ate Well: ' + (task.EatOK ? 'Yes' : 'No'), 10, x+y*5);
  text('Drank Well: ' + (task.DrinkOK ? 'Yes' : 'No'), 10, x+y*6);
  text('Weather: ' + (task.Weather || 'Not specified'), 10, x+y*7);
  text("Symptoms:", 10, x+y*8);

  if (task.symptoms.length === 0) {
    text("none", 110, x+y*8);
  } else {
    for (let i = 0; i < task.symptoms.length; i++) {
      text(`- ${task.symptoms[i]}`, 50, (x+y*9) + i * 20);
    }
  }
}


function updateSymptomList(container) {
  container.innerHTML = '';
  task.symptoms.forEach((symptom, index) => {
    const li = document.createElement('li');
    li.textContent = symptom;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.addEventListener('click', () => {
      task.symptoms.splice(index, 1);
      updateSymptomList(container);
    });
    li.appendChild(deleteBtn);
    container.appendChild(li);
  });
}

// Function to render the task history from localStorage
//this was kinda by ChatGPT but that wanted to use html here and i didn't
//So i asked it the theory on updating it to javascript
//but I got help with this bit 

function renderTaskHistory() {
  const taskHistoryList = document.getElementById('taskHistoryList');
  taskHistoryList.innerHTML = '';

  let savedTasks = JSON.parse(localStorage.getItem('Task_DataFrame')) || [];

  if (savedTasks.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.textContent = 'No saved tasks yet.';
    taskHistoryList.appendChild(emptyMsg);
    return;
  }

  savedTasks.forEach((t) => {
    const li = document.createElement('li');
    li.style.marginBottom = '1em';

    const title = document.createElement('strong');
    title.textContent = t.taskDesc;
    li.appendChild(title);
    li.appendChild(document.createElement('br'));

    const energyBefore = document.createTextNode(`Energy Before: ${t.energyBefore}`);
    li.appendChild(energyBefore);
    li.appendChild(document.createElement('br'));

    const energyAfter = document.createTextNode(`Energy After: ${t.energyAfter}`);
    li.appendChild(energyAfter);
    li.appendChild(document.createElement('br'));

    const painLevel = document.createTextNode(`Pain Level: ${t.PainLevel}`);
    li.appendChild(painLevel);
    li.appendChild(document.createElement('br'));

    const slept = document.createTextNode(`Slept Well: ${t.SleepOK ? 'Yes' : 'No'}`);
    li.appendChild(slept);
    li.appendChild(document.createElement('br'));

    const ate = document.createTextNode(`Ate Well: ${t.EatOK ? 'Yes' : 'No'}`);
    li.appendChild(ate);
    li.appendChild(document.createElement('br'));

    const drank = document.createTextNode(`Drank Well: ${t.DrinkOK ? 'Yes' : 'No'}`);
    li.appendChild(drank);
    li.appendChild(document.createElement('br'));

    const weather = document.createTextNode(`Weather: ${t.Weather}`);
    li.appendChild(weather);
    li.appendChild(document.createElement('br'));

    const symptoms = document.createTextNode(
      `Symptoms: ${t.symptoms.length ? t.symptoms.join(', ') : 'none'}`
    );
    li.appendChild(symptoms);
    li.appendChild(document.createElement('br'));

    const timestamp = document.createElement('em');
    timestamp.textContent = `Saved at: ${new Date(t.timestamp).toLocaleString()}`;
    li.appendChild(timestamp);

    taskHistoryList.appendChild(li);
  });
}

function resetForm() {

  const inputTask = document.getElementById('taskInput1');
  const sliderBefore = document.getElementById('energyBefore1');
  const spanBefore = document.getElementById('energyBeforeValue1');
  const sliderAfter = document.getElementById('energyAfter1');
  const spanAfter = document.getElementById('energyAfterValue1');
  const symptomInput = document.getElementById('symptomInput1');
  const symptomList = document.getElementById('symptomList1');
  const WeatherSelect = document.getElementById('WeatherData');
  const SleepYes = document.getElementById('SleepYes');
  const SleepNo = document.getElementById('SleepNo');
  const EatYes = document.getElementById('EatYes');
  const EatNo = document.getElementById('EatNo');
  const DrinkYes = document.getElementById('DrinkYes');
  const DrinkNo = document.getElementById('DrinkNo');
  const PainLevel = document.getElementById('PainLevel');

    inputTask.value = "";
    sliderBefore.value = 5;
    sliderAfter.value = 5;
    spanBefore.textContent = 5;
    spanAfter.textContent = 5;
    PainLevel.value = 5;
    PainLevel.textContent = 5;

    task.symptoms = [];
    symptomInput.value = "";
    symptomList.innerHTML = "";

    if (SleepYes.checked) {
      SleepYes.checked = false;
    } else {
      SleepNo.checked = false;
    }
    if (EatYes.checked) {
      EatYes.checked = false;
    }
    else {
      EatNo.checked = false;
    }
    if (DrinkYes.checked) {
      DrinkYes.checked = false;
    }
    else {
      DrinkNo.checked = false;
    }
    WeatherSelect.value = "Select";
    
        task = {
      taskDesc: "",
      energyBefore: 5,
      energyAfter: 5,
      PainLevel: 5,
      symptoms: [],
      SleepOK: false,
      EatOK: false,
      DrinkOK: false,
      Weather: "Select"
    };

}

  // Explination boxes
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
}


// CSV
document.getElementById('downloadCSVBtn').addEventListener('click', () => {
  const taskData = JSON.parse(localStorage.getItem("Task_DataFrame")) || [];
  
  if (taskData.length === 0) {
    alert("No task data to download.");
    return;
  }

  const csvRows = [];

  // Header
  const headers = Object.keys(taskData[0]);
  csvRows.push(headers.join(","));

  // Rows
  for (const task of taskData) {
    const values = headers.map(h => {
      let val = task[h];
      if (Array.isArray(val)) val = val.join(";");
      if (typeof val === "string") val = `"${val.replace(/"/g, '""')}"`;
      return val;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "task_data.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});



