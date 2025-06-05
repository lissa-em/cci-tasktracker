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

  // Get all DOM elements
  const inputTask = document.getElementById('taskInput1');
  const sliderBefore = document.getElementById('energyBefore1');
  const spanBefore = document.getElementById('energyBeforeValue1');
  const sliderAfter = document.getElementById('energyAfter1');
  const spanAfter = document.getElementById('energyAfterValue1');
  const PainLevel = document.getElementById('PainLevelSlider');
  const spanPain = document.getElementById('painLevelValue');

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

  // Initialize display
  spanBefore.textContent = sliderBefore.value;
  spanAfter.textContent = sliderAfter.value;
  spanPain.textContent = PainLevel.value;

  // Event listeners
  inputTask.addEventListener('input', () => task.taskDesc = inputTask.value.trim());

  sliderBefore.addEventListener('input', () => {
    spanBefore.textContent = sliderBefore.value;
    task.energyBefore = Number(sliderBefore.value);
  });

  sliderAfter.addEventListener('input', () => {
    spanAfter.textContent = sliderAfter.value;
    task.energyAfter = Number(sliderAfter.value);
  });

  PainLevel.addEventListener('input', () => {
    spanPain.textContent = PainLevel.value;
    task.PainLevel = Number(PainLevel.value);
  });

  // Sleep
  SleepYes.addEventListener('change', () => {
    SleepNo.checked = !SleepYes.checked;
    task.SleepOK = SleepYes.checked;
  });

  SleepNo.addEventListener('change', () => {
    SleepYes.checked = !SleepNo.checked;
    task.SleepOK = !SleepNo.checked;
  });

  // Eat
  EatYes.addEventListener('change', () => {
    EatNo.checked = !EatYes.checked;
    task.EatOK = EatYes.checked;
  });

  EatNo.addEventListener('change', () => {
    EatYes.checked = !EatNo.checked;
    task.EatOK = !EatNo.checked;
  });

  // Drink
  DrinkYes.addEventListener('change', () => {
    DrinkNo.checked = !DrinkYes.checked;
    task.DrinkOK = DrinkYes.checked;
  });

  DrinkNo.addEventListener('change', () => {
    DrinkYes.checked = !DrinkNo.checked;
    task.DrinkOK = !DrinkNo.checked;
  });

  // Weather
  WeatherSelect.addEventListener('change', () => {
    task.Weather = WeatherSelect.value;
  });

  // Symptoms
  addSymptomBtn.addEventListener('click', () => {
    const symptomText = symptomInput.value.trim();
    if (symptomText) {
      task.symptoms.push(symptomText);
      symptomInput.value = '';
      updateSymptomList(symptomList);
    }
  });

  // Save Task
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

  // Clear All
  clearTaskBtn.addEventListener('click', () => {
    localStorage.removeItem('Task_DataFrame');
    renderTaskHistory();
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
    resetForm();
    alert("All tasks cleared.");
  });
}

function draw() {
  let symptomHeight = task.symptoms.length * 20;
  let baseHeight = 300;
  resizeCanvas(330, baseHeight + symptomHeight + 40);
  clear();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(24);
  textStyle(BOLD);
  text('Current Task:', 10, 10);

  let x = 55;
  let y = 30;
  textSize(18);
  textStyle(NORMAL);
  text('Task: ' + task.taskDesc, 10, x);
  text('Energy Before: ' + task.energyBefore, 10, x + y);
  text('Energy After: ' + task.energyAfter, 10, x + y * 2);
  text('Pain Level: ' + task.PainLevel, 10, x + y * 3);
  text('Slept Well: ' + (task.SleepOK ? 'Yes' : 'No'), 10, x + y * 4);
  text('Ate Well: ' + (task.EatOK ? 'Yes' : 'No'), 10, x + y * 5);
  text('Drank Well: ' + (task.DrinkOK ? 'Yes' : 'No'), 10, x + y * 6);
  text('Weather: ' + (task.Weather || 'Not specified'), 10, x + y * 7);
  text("Symptoms:", 10, x + y * 8);

  if (task.symptoms.length === 0) {
    text("none", 110, x + y * 8);
  } else {
    task.symptoms.forEach((s, i) => {
      text(`- ${s}`, 50, (x + y * 9) + i * 20);
    });
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

function renderTaskHistory() {
  const taskHistoryList = document.getElementById('taskHistoryList');
  taskHistoryList.innerHTML = '';
  let savedTasks = JSON.parse(localStorage.getItem('Task_DataFrame')) || [];

  if (!savedTasks.length) {
    const emptyMsg = document.createElement('li');
    emptyMsg.textContent = 'No saved tasks yet.';
    taskHistoryList.appendChild(emptyMsg);
    return;
  }

  savedTasks.forEach(t => {
    const li = document.createElement('li');
    li.style.marginBottom = '1em';
    li.innerHTML = `
      <strong>${t.taskDesc}</strong><br>
      Energy Before: ${t.energyBefore}<br>
      Energy After: ${t.energyAfter}<br>
      Pain Level: ${t.PainLevel}<br>
      Slept Well: ${t.SleepOK ? 'Yes' : 'No'}<br>
      Ate Well: ${t.EatOK ? 'Yes' : 'No'}<br>
      Drank Well: ${t.DrinkOK ? 'Yes' : 'No'}<br>
      Weather: ${t.Weather}<br>
      Symptoms: ${t.symptoms.length ? t.symptoms.join(', ') : 'none'}<br>
      <em>Saved at: ${new Date(t.timestamp).toLocaleString()}</em>
    `;
    taskHistoryList.appendChild(li);
  });
}

function resetForm() {
  const inputTask = document.getElementById('taskInput1');
  const sliderBefore = document.getElementById('energyBefore1');
  const spanBefore = document.getElementById('energyBeforeValue1');
  const sliderAfter = document.getElementById('energyAfter1');
  const spanAfter = document.getElementById('energyAfterValue1');
  const PainLevel = document.getElementById('PainLevelSlider');
  const spanPain = document.getElementById('painLevelValue');

  const symptomInput = document.getElementById('symptomInput1');
  const symptomList = document.getElementById('symptomList1');
  const WeatherSelect = document.getElementById('WeatherData');
  const SleepYes = document.getElementById('SleepYes');
  const SleepNo = document.getElementById('SleepNo');
  const EatYes = document.getElementById('EatYes');
  const EatNo = document.getElementById('EatNo');
  const DrinkYes = document.getElementById('DrinkYes');
  const DrinkNo = document.getElementById('DrinkNo');

  inputTask.value = "";
  sliderBefore.value = 5;
  sliderAfter.value = 5;
  spanBefore.textContent = 5;
  spanAfter.textContent = 5;

  PainLevel.value = 5;
  spanPain.textContent = 5;

  symptomInput.value = "";
  symptomList.innerHTML = "";

  SleepYes.checked = false;
  SleepNo.checked = false;
  EatYes.checked = false;
  EatNo.checked = false;
  DrinkYes.checked = false;
  DrinkNo.checked = false;
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

// Dropdown box toggle
var dropdown = document.getElementsByClassName("dropdown-btn");
for (let i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let dropdownContent = this.nextElementSibling;
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
  });
}

// CSV download
document.getElementById('downloadCSVBtn').addEventListener('click', () => {
  const taskData = JSON.parse(localStorage.getItem("Task_DataFrame")) || [];
  if (!taskData.length) {
    alert("No task data to download.");
    return;
  }

  const csvRows = [];
  const headers = Object.keys(taskData[0]);
  csvRows.push(headers.join(","));

  taskData.forEach(task => {
    const values = headers.map(h => {
      let val = task[h];
      if (Array.isArray(val)) val = val.join(";");
      if (typeof val === "string") val = `"${val.replace(/"/g, '""')}"`;
      return val;
    });
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.hidden = true;
  a.href = url;
  a.download = "task_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
