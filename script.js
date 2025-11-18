// =========================
// ELEMENTY
// =========================
const to_do_div = document.querySelector('#todo_list');
const in_progress_div = document.querySelector('#progress_list');
const done_div = document.querySelector('#done_list');

const task_name_input = document.querySelector('#task_name');
const desc_input = document.querySelector('#desc');
const new_task_button = document.querySelector('#new_task_button');


// =========================
// LOCAL STORAGE
// =========================
function saveData() {
    const data = {
        todo: to_do_div.innerHTML,
        progress: in_progress_div.innerHTML,
        done: done_div.innerHTML
    };
    localStorage.setItem("task_board", JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem("task_board");
    if (!saved) return;

    const data = JSON.parse(saved);

    to_do_div.innerHTML = data.todo;
    in_progress_div.innerHTML = data.progress;
    done_div.innerHTML = data.done;

    restoreButtons();
}


// =========================
// PRZYWRACANIE PRZYCISKÓW
// =========================
function restoreButtons() {

    // TO DO → IN PROGRESS
    to_do_div.querySelectorAll('.task').forEach(task => {
        const btn = task.querySelector('.to_progress');
        if (btn) {
            btn.addEventListener('click', () => {
                moveToProgress(task);
                saveData();
            });
        }
    });

    // IN PROGRESS → DONE
    in_progress_div.querySelectorAll('.task').forEach(task => {
        const btn = task.querySelector('.to_done');
        if (btn) {
            btn.addEventListener('click', () => {
                moveToDone(task);
                saveData();
            });
        }
    });

    // DELETE tylko w DONE
    done_div.querySelectorAll('.task').forEach(task => {
        const del = task.querySelector('.delete_btn');
        if (del) {
            del.addEventListener('click', () => {
                task.remove();
                saveData();
            });
        }
    });
}


// =========================
// TWORZENIE NOWEGO TASKA
// =========================
new_task_button.addEventListener('click', () => {
    const name = task_name_input.value.trim();
    const desc = desc_input.value.trim();

    if (!name) return;

    const task = document.createElement('div');
    task.classList.add('task');

    task.innerHTML = `
        <h3>${name}</h3>
        <p>${desc}</p>
        <button class="task_btn to_progress">Start</button>
    `;

    to_do_div.appendChild(task);

    task.querySelector('.to_progress').addEventListener('click', () => {
        moveToProgress(task);
        saveData();
    });

    task_name_input.value = "";
    desc_input.value = "";

    saveData();
});


// =========================
// PRZENOSZENIE TASKÓW
// =========================
function moveToProgress(task) {
    // usuń przycisk START
    const btn = task.querySelector('.to_progress');
    if (btn) btn.remove();

    // dodaj FINISH
    const doneBtn = document.createElement('button');
    doneBtn.classList.add('task_btn', 'to_done');
    doneBtn.textContent = "Finish";

    task.appendChild(doneBtn);
    in_progress_div.appendChild(task);

    doneBtn.addEventListener('click', () => {
        moveToDone(task);
        saveData();
    });
}

function moveToDone(task) {
    const finishBtn = task.querySelector('.to_done');
    if (finishBtn) finishBtn.remove();

    // w DONE dodajemy jedyny przycisk DELETE
    const del = document.createElement('button');
    del.classList.add('task_btn', 'delete_btn');
    del.textContent = "Delete";

    task.appendChild(del);

    del.addEventListener('click', () => {
        task.remove();
        saveData();
    });

    done_div.appendChild(task);
}


// =========================
// START
// =========================
loadData();
