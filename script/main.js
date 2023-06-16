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
        <div data-id="${el.id}">
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

