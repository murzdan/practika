const listDocs = document.querySelector('.list-content'),
      sortHeaders = document.querySelectorAll('.sort-header');
let dataDB = [];

// Вспомогательная функция по преобразованию даты в милисекунды из чч.мм.гг формата в приемлимый Date() формат гг.мм.чч
const dataFormat = (date) =>  Date.parse(new Date(date.split('.').reverse().join('.')))

// Вспомогательная функция для добавления класса активности к сортировке
const activeClass = (arrElem, activeItem, rotate='') => {
    arrElem.forEach(item => {
        const elem = item.querySelector(`i`)
        if (elem) elem.remove()
    })
    activeItem.insertAdjacentHTML('beforeend', `<i class="fa-solid fa-angle-up text-slate-700 ${rotate}"></i>`)
}

// Функция для отрисовки данных из бд
const renderData = (data,directionSortStr) => {
    data.forEach(el => {
        listDocs.insertAdjacentHTML(directionSortStr,`
        <div data-id="${el.id}" onclick='openMail(${el.id})'>
            <div class="p-4 flex flex-nowrap justify-between items-start gap-1 h-fit font-sm cursor-pointer text-left text-sm w-full hover:bg-sky-100">
                <p class="min-h-fit break-words w-2/6 text-justify px-4 line-clamp-3">${el.text}</p>
                <span class="break-words px-4 w-1/6">${el.data}</span>
                <span class="break-words w-1/6 flex flex-row flex-nowrap items-center gap-2 px-4">${el.size} ${el.includeImg ? '<i class="text-slate-700 fa-regular fa-file-image"></i>' : ''}</span>
                <span class="break-words px-4 w-1/6">${el.author}</span>
                <span class="break-words px-4 w-1/6">${el.language}</span>
            </div>
            <hr class="">
        </div>
        `);
    });
}

// Функция для сортировки данных по убыванию
const sortData = (arr, field, directionSortStr) => {
    let sorted;
    if (field=="data") {
        sorted = arr.sort((a, b) => dataFormat(b[field]) - dataFormat(a[field]));    
    }
    else if(field=="size") {
        sorted = arr.sort((a, b) => parseFloat(b[field]) - parseFloat(a[field]));
    } 
    else {
        sorted = arr.sort((a, b) => a[field].localeCompare(b[field]));
    }
    renderData(sorted, directionSortStr)
}

// Навешивание функции сортировки на все пункты заголовка
sortHeaders.forEach(item => {
    item.addEventListener('click', () => {
        activeClass(sortHeaders, item, 'rotate-180')
        listDocs.innerHTML = ''
        sortData(dataDB, item.dataset.sort, 'beforeend')
    })
})

// Функция получения данных из бд
const getData = (url) => {
    fetch(url)
        .then((response) => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error('Данные были получены с ошибкой!');
            }
        })
        .then((data) => {
            // Сортировка по умолчанию = сортировка по дате (новое сверху) + отрисовка на странице
            sortData(data, "data",'beforeend')

            dataDB = [...data]
        })
        .catch((error) => {
            console.error(error.message);
        });
};

getData('../database/dbase.json')


// Открытие окна с информацией Daniil Rybin PK ENERGY


let okno = document.getElementById('okno');

// Получаем данные из бд
let dataDB_window
const getData2 = (url) => {
    fetch(url)
        .then((response) => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error('Данные были получены с ошибкой!');
            }
        })
        .then((data) => {
            dataDB_window = [...data]
        })
        .catch((error) => {
            console.error(error.message);
        });
};

getData2('../database/dbase.json')


// функция для открытия окна и заполнение его информацией
function openMail(num){
    num--;

console.log(dataDB_window[num]);

    okno.style.display='block'

    setTimeout(() => {
        okno.style.left = '0%';
      }, 50);

      

    okno.innerHTML=`
    <div class="flex text-2xl pt-12">
    <a href="#" class="pr-2" onclick='closeMail()'><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
    <b>${dataDB_window[num].name}</b>
</div>
<div class="flex pl-8 pt-1 text-sm text-gray-500">
    <p>${dataDB_window[num].data}</p>
</div>
<div class="grid grid-cols-3 mt-8 gap-x-4 justify-start">
    <p>
        Автор: <br/>
        ${dataDB_window[num].author}</p>
    <p>
        Размер: <br/>
        ${dataDB_window[num].size}</p>
    <p>
        Язык: <br/>
        ${dataDB_window[num].language}</p>
</div>
<div class="mt-10 shadow-lg border border-gray-200 rounded-3xl h-70 overflow-hidden" id="cont1">
    <div class="flex justify-between">
        <h2 class="flex font-bold pt-4 pl-8">Описание</h2>
        <a onclick="openDescription()" class="text-3xl p-3"><i class="fa fa-angle-down" id="description_angel" aria-hidden="true"></i></a>
    </div>
    <p class="flex px-8 pt-6 pb-6">
    ${dataDB_window[num].text}
    </p>
</div>
<div class="mt-10 shadow-lg border border-gray-200 rounded-3xl h-70 overflow-hidden" id="cont2">
    <div class="flex justify-between">
        <h2 class="flex font-bold pt-4 pl-8">Перевод</h2>
    <a onclick="openTranslate()" class="text-3xl p-3"><i class="fa fa-angle-down" id="translate_angel" aria-hidden="true"></i></a>
    </div>
    <p class="flex px-8 pt-6 pb-6">
    ${dataDB_window[num].engText}
    </p>
</div>
    `
}

// закрытие окна и удаление из него информации
function closeMail(){

    okno.style.left = '120%';
   
    setTimeout(() => {
        okno.style.display='none'
      }, 50);

    
    okno.innerHTML="";
}


// изменение блоков с текстсом и стрелок в окне с информацией

function openDescription() {
    if (document.getElementById('cont1').style.cssText == 'height: auto;'){
        document.getElementById('cont1').style.cssText = 'height: 70;'
        document.getElementById('description_angel').setAttribute('class','fa fa-angle-down')
    } else{
    document.getElementById('cont1').style.cssText = 'height: auto;';
    document.getElementById('description_angel').setAttribute('class','fa fa-angle-up')}

}

function openTranslate() {

    if (document.getElementById('cont2').style.cssText == 'height: auto;'){
        document.getElementById('cont2').style.cssText = 'height: 70;'
        document.getElementById('translate_angel').setAttribute('class','fa fa-angle-down')
    } else{
    document.getElementById('cont2').style.cssText = 'height: auto;';
    document.getElementById('translate_angel').setAttribute('class','fa fa-angle-up')}
    
}