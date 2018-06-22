var $ = function(sel) {
    return document.querySelector(sel);
};
var $All = function(sel) {
    return document.querySelectorAll(sel);
};
var makeArray = function(likeArray) {
    var array = [];
    for (var i = 0; i < likeArray.length; ++i) {
      array.push(likeArray[i]);
    }
    return array;
};


var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
    items: [
        // {msg:'', completed: false}
      ],
    msg: '',
    filter: 'All'
};

var guid = 0;
var CL_COMPLETED = 'done';
var CL_SELECTED = 'selected';
var CL_EDITING = 'editing';

// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';


function dataObjectUpdated() {
    localStorage.setItem('todoList', JSON.stringify(data));
}

function update() {
    dataObjectUpdated();
    
    var activeCount = 0;
    var todoList = $('.todo');
    todoList.innerHTML = '';
    data.items.forEach(function(itemData, index) {
      if (!itemData.completed) activeCount++;
  
      if (
        data.filter == 'All'
        || (data.filter == 'Active' && !itemData.completed)
        || (data.filter == 'Completed' && itemData.completed)
      ) {
        var item = document.createElement('li');
        var id = 'item' + guid++;
        item.setAttribute('id', id);
        if (itemData.completed) item.classList.add(CL_COMPLETED);
        item.innerText = itemData.msg;

        var buttons = document.createElement('div');
        buttons.classList.add('buttons');

        var remove = document.createElement('button');
        remove.classList.add('remove');
        remove.innerHTML = removeSVG;

        // Add click event for removing the item
        remove.addEventListener('click', function(){
            data.items.splice(index, 1);
            update();
        },false);

        var complete = document.createElement('button');
        complete.classList.add('complete');
        complete.innerHTML = completeSVG;

        // Add click event for completing the item
        complete.addEventListener('click', function(){
            itemData.completed = !itemData.completed;
            update();
        },false);

        buttons.appendChild(remove);
        buttons.appendChild(complete);
        item.appendChild(buttons);

        item.addEventListener("touchstart", touchFn);
        item.addEventListener("touchmove", touchFn);
        item.addEventListener("touchend", touchFn);
        var timerId;

        function touchFn(e){
            switch (e.type){
                case "touchstart" :  //500ms之后执行
                    timerId = setTimeout(function (){
                        // console.log("长按成功");
                        item.classList.add(CL_EDITING);

                        var edit = document.createElement('input');
                        var finished = false;
                        edit.setAttribute('type', 'text');
                        edit.setAttribute('class', 'edit');
                        edit.setAttribute('value', item.innerText);

                        function finish(){
                            if(finished) return;
                            finished = true;
                            item.removeChild(edit);
                            item.classList.remove(CL_EDITING);
                        }

                        edit.addEventListener('blur',function(){
                            finish();
                        },false);

                        edit.addEventListener('keyup', function(ev) {
                            if (ev.keyCode == 27) { // Esc
                                finish();
                            }
                            else if (ev.keyCode == 13) {
                                if(this.value==""){finish();return;};
                                item.innerHTML = this.value;
                                itemData.msg = this.value;
                                update();
                            }
                        }, false);

                        item.appendChild(edit);
                        edit.focus();
                    }, 500)
                    break;
                case "touchmove" :
                    //如果中间有移动也清除定时器
                    clearTimeout(timerId)
                    break;
                case "touchend" :
                    //如果在500ms之内抬起了手指，则需要定时器
                    clearTimeout(timerId);
                    break;
            }
        }
  
        todoList.insertBefore(item, todoList.firstChild);
      }
    });
  
    var newTodo = document.getElementById('item');
    newTodo.value = data.msg;
  
    var completedCount = data.items.length - activeCount;
    var count = $('.todo-count');
    count.innerHTML = (activeCount || 'No') + (activeCount > 1 ? ' items' : ' item') + ' left';
  
    var clearCompleted = $('.clear-completed');
    clearCompleted.style.visibility = completedCount > 0 ? 'visible' : 'hidden';
  
    var toggleAll = $('.toggle-all');
    toggleAll.style.visibility = data.items.length > 0 ? 'visible' : 'hidden';
    toggleAll.checked = data.items.length == completedCount;
  
    var filters = makeArray($All('.filters li a'));
    filters.forEach(function(filter) {
      if (data.filter == filter.innerHTML) filter.classList.add(CL_SELECTED);
      else filter.classList.remove(CL_SELECTED);
    });
}

window.onload = function() {
    var newTodo = document.getElementById('item');
    newTodo.addEventListener('keyup', function() {
        data.msg = newTodo.value;
    });
    newTodo.addEventListener('change', function() {
        dataObjectUpdated();
    });
    newTodo.addEventListener('keyup', function(ev) {
        if (ev.keyCode != 13) return; // Enter
  
        if (data.msg == '') {
          console.warn('input msg is empty');
          return;
        }
        data.items.push({msg: data.msg, completed: false});
        data.msg = '';
        update();
    }, false);
    document.getElementById('add').addEventListener('click', function() {
        if (data.msg == '') {
            console.warn('input msg is empty');
            return;
        }
        data.items.push({msg: data.msg, completed: false});
        data.msg = '';
        update();
    },false);
    
    var clearCompleted = $('.clear-completed');
    clearCompleted.addEventListener('click', function(e) {
        var temp = [];
        data.items.forEach(function(itemData, index) {
          console.log(itemData);
          if(!itemData.completed) temp.push(itemData);
            // if (itemData.completed) data.items.splice(index, 1);
        });
        data.items = temp;
        e.stopPropagation()
        update();
    }, false);

    var toggleAll = $('.toggle-all');
    toggleAll.addEventListener('change', function() {
        var completed = toggleAll.checked;
        data.items.forEach(function(itemData) {
            itemData.completed = completed;
        });
        update();
    }, false);

    var filters = makeArray($All('.filters li div'));
    filters.forEach(function(filter) {
        filter.addEventListener('click', function() {
            data.filter = filter.innerHTML;
            filters.forEach(function(filter) {
            filter.classList.remove(CL_SELECTED);
            });
            filter.classList.add(CL_SELECTED);
            update();
        }, false);
    });

    document.body.addEventListener("touchstart", touchHandler.start, false);
    document.body.addEventListener("touchend", touchHandler.end, false);
    
    update();
};

var oldTouch;
touchHandler = {
  start: function(ev) {
//     console.log(ev.changedTouches[0].clientX);
    oldTouch = ev.changedTouches[0];
  },
  end: function(ev) {
//     console.log(ev.changedTouches[0].clientX);
    var newTouch = ev.changedTouches[0];
    if(oldTouch.clientX - newTouch.clientX > 100){
      $('.mdui-btn').click();
    }
  }
};



