const itemForm = document.getElementById('item-form');
const container =document.querySelector(".container");
const input = document.querySelector(".input");
const addButton = document.getElementById("add-button");
const emptyInput = document.querySelector(".empty-input");
const taskLists = document.querySelector(".task-lists");
const taskListsContainer = document.querySelector(".task-lists-container");
const emptyImg = document.getElementById("empty-img");
const clearAll = document.querySelector(".clear-all");


function addItem(e){
    e.preventDefault();

    const newItem = input.value;

    if(newItem == ''){
        emptyInput.innerText = "please add a task";
        return;
    } else{
        emptyInput.innerText = "";
        emptyImg.style.display = 'none';
        clearAll.style.display = 'inline';
    }

    const task = {
        text: newItem,
        completed: false
    };

    addItemToDOM(task);
    addItemToStorage(task);

    input.value = '';
}


function addItemToDOM(item){
    const li = document.createElement('li');
    li.className = 'list-item';

    if(item.completed){
        li.classList.add('completed');
    }

    li.innerHTML = `
    <div class = "li-left">
        <button class = "tasks-done"></button>
        <span>${item.text}</span>
    </div>

    <div class = "li-right">
        <i class = "fa fa-trash"></i>
        <i class = "fa fa-edit"></i>
    </div>    
    `;

    const doneBtn = li.querySelector('.tasks-done');

    doneBtn.addEventListener('click', function () {
        li.classList.toggle('completed');

        item.completed = !item.completed;

        updateStorage();

        checkAllTasksCompleted();
    });
    

    const deleteBtn = li.querySelector('.fa-trash');

    deleteBtn.addEventListener('click', function () {
        li.remove();

        removeItemFromStorage(item);

        if (taskLists.children.length === 0) {
            emptyImg.style.display = 'inline';
            clearAll.style.display = 'none';
        }
    });


    const editBtn = li.querySelector('.fa-edit');
    const taskText = li.querySelector('span');

    editBtn.addEventListener('click', function () {

        if (li.classList.contains('editing')) return;

        li.classList.add('editing');

        const oldText = taskText.textContent;

        taskText.innerHTML = `
            <input type="text" class="edit-input" value="${oldText}">
        `;

        const editInput = li.querySelector('.edit-input');

        li.querySelector('.li-right').innerHTML = `
            <i class="fa fa-check save-btn"></i>
            <i class="fa fa-times cancel-btn"></i>
        `;

        const saveBtn = li.querySelector('.save-btn');
        const cancelBtn = li.querySelector('.cancel-btn');

        editInput.focus();


        saveBtn.addEventListener('click', function () {

            const newText = editInput.value.trim();

            if (newText === '') {
                return;
            }

            taskText.textContent = newText;

            item.text = newText;

            updateStorage();

            li.classList.remove('editing');

            li.querySelector('.li-right').innerHTML = `
                <i class="fa fa-trash"></i>
                <i class="fa fa-edit"></i>
            `;

            addActionListeners();
        });


        cancelBtn.addEventListener('click', function () {

            taskText.textContent = oldText;

            li.classList.remove('editing');

            li.querySelector('.li-right').innerHTML = `
                <i class="fa fa-trash"></i>
                <i class="fa fa-edit"></i>
            `;

            addActionListeners();
        });


        function addActionListeners() {

            const newDeleteBtn = li.querySelector('.fa-trash');
            const newEditBtn = li.querySelector('.fa-edit');

            newDeleteBtn.addEventListener('click', function () {
                li.remove();

                removeItemFromStorage(item);

                if (taskLists.children.length === 0) {
                    emptyImg.style.display = 'inline';
                    clearAll.style.display = 'none';
                }
            });


            newEditBtn.addEventListener('click', function () {
                editBtn.click();
            });
        }
    });


    taskLists.appendChild(li);
}


function clearItems(){
    taskLists.innerHTML = '';
    localStorage.removeItem('items');
    emptyImg.style.display = 'inline';
    clearAll.style.display = 'none';
}


function checkAllTasksCompleted() {
    const allTasks = taskLists.querySelectorAll('.list-item');
    const completedTasks = taskLists.querySelectorAll('.list-item.completed');

    if (
        allTasks.length > 0 &&
        allTasks.length === completedTasks.length
    ) {
        showCelebration();
    }
}


const successModal = document.querySelector('.success-modal');
const closeModal = document.querySelector('.close-modal');


function showCelebration() {
    successModal.style.display = 'flex';

    confetti({
        particleCount: 150,
        spread: 100,
        origin: {
            y: 0.6
        }
    });
}


function addItemToStorage(item){
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function getItemFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}


function updateStorage(){
    const items = [];

    const allTasks = taskLists.querySelectorAll('.list-item');

    allTasks.forEach(function(li){
        const item = {
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        };

        items.push(item);
    });

    localStorage.setItem('items', JSON.stringify(items));
}


function removeItemFromStorage(item){
    const itemsFromStorage = getItemFromStorage();

    const updatedItems = itemsFromStorage.filter(function(storageItem){
        return storageItem.text !== item.text;
    });

    localStorage.setItem('items', JSON.stringify(updatedItems));
}


function displayItems(){
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.forEach(function(item){
        addItemToDOM(item);
    });

    if(itemsFromStorage.length > 0){
        emptyImg.style.display = 'none';
        clearAll.style.display = 'inline';
    }
}


closeModal.addEventListener('click', function () {
    successModal.style.display = 'none';
});


itemForm.addEventListener('submit', addItem);
clearAll.addEventListener('click', clearItems);


displayItems();