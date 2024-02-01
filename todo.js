const TO_DO_SELECTOR = '[data-todo]';
const DAY_SELECTOR = '[data-current-day]';
const DATE_SELECTOR = '[data-current-date]';
const FILTER_TASKS_SELECTOR = '[data-filter-tasks]'

const TO_DO_ITEM_SELECTOR = '[data-todo-item]'

const FORM_SELECTOR = '[data-form]';
const TASK_INPUT_SELECTOR = '[data-task-input]';

export default class ToDoHandler {
  constructor() {
    this._element = document.querySelector(TO_DO_SELECTOR);
    this._day = this._element.querySelector(DAY_SELECTOR);
    this._date = this._element.querySelector(DATE_SELECTOR);
    this._todoItem = this._element.querySelector(TO_DO_ITEM_SELECTOR);
    this._form = this._element.querySelector(FORM_SELECTOR);
    this._taskInput = this._element.querySelector(TASK_INPUT_SELECTOR);
    this._taskFilter = this._element.querySelector(FILTER_TASKS_SELECTOR);
  };

  init() {
    this.setUpEvents();
    this.setCurrentDate();
  };

 
  setUpEvents() {
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onAddTask();
    });

    this._taskFilter.addEventListener('change', (e) => {
      this.onFilterHandler(e);
    });
  };

  onAddTask(){
    const newTaskValue = this._taskInput.value;

    if(newTaskValue === '') {
      alert('You have to add a task')
    } else {

      // Creates task element
      const newTaskElement = document.createElement('div');
      newTaskElement.classList.add('todo-container__item');
      this._todoItem.appendChild(newTaskElement);

      // Creates checkbox form type
      const checkbox = document.createElement('div');
      checkbox.classList.add('todo-container__checkbox');
      checkbox.setAttribute('data-checkbox-id', '');
      newTaskElement.appendChild(checkbox);

      // Creates span element for input value
      const inputValueShow = document.createElement('span');
      inputValueShow.innerText = newTaskValue;
      inputValueShow.classList.add('todo-container__task-text');
      inputValueShow.setAttribute('data-input-value', '')
      newTaskElement.appendChild(inputValueShow);

      // Creates edit and remove icons
      const editWrapper = document.createElement('div')
      editWrapper.classList.add('todo-container__edit-wrapper')
      const pencilIcon = document.createElement('i');
      pencilIcon.classList.add('fa', 'fa-pencil');
      pencilIcon.setAttribute('data-edit-item', '')

      const trashIcon = document.createElement('i');
      trashIcon.classList.add('fa', 'fa-trash-o');
      trashIcon.setAttribute('data-remove-item', '')
      editWrapper.appendChild(pencilIcon);
      editWrapper.appendChild(trashIcon);
      newTaskElement.appendChild(editWrapper);

      this.handleMultipleTasks(newTaskElement);
      const taskKey = `task_${this._taskCounter++}`;

      // removes input value after submit
      this._taskInput.value = "";
    }

  };

  handleMultipleTasks(taskElement){
    this.onCheckedTask(taskElement);
    this.onDeleteItem(taskElement);
    this.onEditItem(taskElement);

  };

  onFilterHandler(e){
    if(!this._todoItem) return;

    const taskItems = Array.from(this._todoItem.children);

    taskItems.forEach(item => {
      switch(e.target.value) {
        case 'all':
          item.style.display = 'flex'
          break;
        case 'completed':
          if(item.querySelector('.checked')){
            item.style.display = 'flex'
          } else {
            item.style.display = 'none'
          }
            break;
        case 'uncompleted':
          if (!item.querySelector('.checked')) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
          break;
          default:
          break;
        }
    })
  };

  onCheckedTask(taskElement) {
    const checkbox =  taskElement.querySelector('[data-checkbox-id]');
    const taskValue = taskElement.querySelector('[data-input-value]');

    checkbox.addEventListener('click', e => {
        taskValue.classList.toggle('checked');
        checkbox.classList.toggle('checked');
    })
  };

  onDeleteItem(taskElement){
    const deleteItemButton = taskElement.querySelector('[data-remove-item]');
    deleteItemButton.addEventListener('click', e => {
      taskElement.remove();
    });
  };

  onEditItem(taskElement) {
    const editItemButton = taskElement.querySelector('[data-edit-item]');
    const inputValueShow = taskElement.querySelector('[data-input-value]');

    editItemButton.addEventListener('click', e => {
      const inputEdit = document.createElement('input');
      inputEdit.type = 'text';
      inputEdit.value = inputValueShow.innerText;
      inputEdit.classList.add('todo-container__edit-task-text')
      taskElement.replaceChild(inputEdit, inputValueShow);

      // Add a save icon
      const saveIcon = document.createElement('i');
      saveIcon.classList.add('fa', 'fa-bookmark-o');
      editItemButton.replaceWith(saveIcon);

      saveIcon.addEventListener('click', e => {
        inputValueShow.innerText = inputEdit.value;
        inputEdit.classList.add('todo-container__edited-task-text')
        taskElement.replaceChild(inputValueShow,inputEdit);
        saveIcon.replaceWith(editItemButton);
      })
     
    });

  };


  setCurrentDate() {
    const currentDate = new Date();
    const dateNumeric = currentDate.getDate();
    const dateMoth = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const weekDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const date = `${dateNumeric}th ${dateMoth}`;

    this._day.innerHTML = weekDay;
    this._date.innerHTML = date;
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const toDoHandler = new ToDoHandler().init();
});