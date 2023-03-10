    //localStorage.clear();

//функция активации кнопки при вводе текста и дезактивании при пустом поле ввода
    function activateBtn() {

        //получаем ввод от пользователя
        let msg = document.getElementById('msg').value;

        //записываем кнопку в переменную
        let btn = document.querySelector('.send-btn');

        if(msg.trim() != '') {

            btn.classList.remove('send-btn_disabled');

        } else {

            btn.classList.add('send-btn_disabled');

        }
    }

    //функция вызова меню при клике на три точки сверху
    function toggleMenu() {

        document.getElementById('menu-right').classList.toggle('menu-right-active');
    }


    //функция для отрисовки тайлов с выбором фона
    function toggleTiles() {

        //тайлы с фонами появляются/исчезают по клику на "Поменять фон"
        document.getElementById('tile-container').classList.toggle('tile-active');

        //находим контейнер, куда будут отрисовываться тайлы
        let container = document.getElementById('tile-container');

        //находим шаблон
        let tmplTiles = document.getElementById('tmpl-tiles').innerHTML;

        //создаем массив с фонами
        let data = [
                    'https://phonoteka.org/uploads/posts/2021-06/1623936347_3-phonoteka_org-p-pattern-dlya-messendzhera-krasivo-3.jpg',
                    'https://pixelbox.ru/wp-content/uploads/2021/09/background-chat-vk-11.jpg',
                    'https://pixelbox.ru/wp-content/uploads/2021/09/background-chat-vk-22.jpg',
                    'https://pixelbox.ru/wp-content/uploads/2021/09/background-chat-vk-70.jpg',
                    'https://adonius.club/uploads/posts/2022-01/thumbs/1642676059_7-adonius-club-p-top-fonov-stim-8.jpg',
                    'https://static.wixstatic.com/media/600959_d0449f0c20954906a78a06b9c58d525a~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/600959_d0449f0c20954906a78a06b9c58d525a~mv2.jpg',
                    'https://phonoteka.org/uploads/posts/2022-02/1644989786_13-phonoteka-org-p-fon-dlya-kompa-krutoi-13.jpg',
                    'https://catherineasquithgallery.com/uploads/posts/2021-02/1612935646_21-p-fon-krasnii-s-sinim-27.jpg'

        ];

        //очищаем содержимое контейнера
        container.innerHTML = '';

        //отрисовываем шаблон в нужный контейнер с добавлением фонов из массива
        for (let i = 0; i < data.length; i++) {

            container.innerHTML += tmplTiles.replace('${background}', data[i])
                                            .replace('${background}', data[i]);
        }

    }


    //функция смены фона
    function changeBackground() {

        let chosenBackground = event.target.getAttribute('data-background');
        document.querySelector('.chat-box').style.backgroundImage = 'url(' + chosenBackground + ')'; 

        //при смене фона сохраняем выбранный фон
        localStorage.setItem('background', chosenBackground);

    }


    //функция отправки сообщений
    function sendMessage() {

        //получаем ввод от пользователя
        let msg = document.getElementById('msg').value;

        //проверка на наличие введенного имени юзера
        if (nameMy !== '') {

            //отправляем запрос и получаем данные
            let xhr = new XMLHttpRequest();
            xhr.open('GET','https://Messenger.stacymch.repl.co/?message=' + msg + '&name=' + nameMy,false);
            xhr.send();

            //используем прописанную ниже функцию отрисовки сообщений из jsonа с сервера
            renderMessages();

            //очистка textarea после отправки сообщения
            document.getElementById('msg').value = '';

        }

    }


    //шаблон функции отправки пустого гет-запроса
    function sendRequestGET(url) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();

        //отдает данные(результат)
        return xhr.responseText;
    }


    //функция отрисовки сообщений
    function renderMessages() {

        //используем шаблон функции гет-запроса с нужным url-ом
        let json = sendRequestGET("https://Messenger.stacymch.repl.co/index.php");

        //раскодируем данные
        let data = JSON.parse(json); 
        
        //console.log(data);

        //html-контейнер, куда будут отрисованы сообщения
        let container = document.getElementById('chat-box__body');

        //чистим контейнер, чтобы не было дублирования  
        container.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            
            //записываем в переменную время (глобальное) из массива на сервере. если без new Date(), получится строка, а нам нужен объект
            let timeGlobal = new Date(data[i]["date"]);
            //console.log(timeGlobal); //формат ISO 8601 (Thu Jan 05 2023 00:40:53 GMT+0300 (Москва, стандартное время)
            //console.log(timeGlobal.toLocaleTimeString()); // формат чч:мм:сс по местному часовому поясу

            if (nameMy == data[i]['name']) {

                //отрисовываем "свои" сообщения справа
                container.innerHTML += document.getElementById('tmpl_mes').innerHTML.replace('${name}', data[i]["name"])
                                                                                    .replace('${message}', data[i]['message'])
                                                                                    .replace('${date}', timeGlobal.toLocaleTimeString().slice(0,5))
                                                                                    .replace('${style}', 'right');

            } else {
                
                //отрисовываем "чужие" сообщения слева
                container.innerHTML += document.getElementById('tmpl_mes').innerHTML.replace('${name}', data[i]["name"])
                                                                                    .replace('${message}', data[i]['message'])
                                                                                    .replace('${date}', timeGlobal.toLocaleTimeString().slice(0,5));
            }
        }

        //scrollToZero();
        scrollToZeroWithTimer();
    
    }

/*//автопрокрутка скроллбара к последнему сообщению
    function scrollToZero() {
        chatWindow = document.getElementById('chat-box__body'); 
        let xH = chatWindow.scrollHeight; 

        chatWindow.scrollTo(0, xH);

        } */

    /*//автопрокрутка скроллбара к последнему сообщению c таймером (нет обнуления при активном скролле юзера)
    function scrollToZeroWithTimer() {
        chatWindow = document.getElementById('chat-box__body'); 
        let xH = chatWindow.scrollHeight; 

        //при активном скролле обнуление скролла будет только через 5 сек после его остановки в любом месте
        let timer = null;
            if(timer !== null) {
                clearTimeout(timer);        
            }
            timer = setTimeout(function() {
                chatWindow.scrollTo(0, xH);

            }, 5000);
        
    } */

    //функция автопрокрутки скроллбара к последнему сообщению c таймером (нет обнуления при активном скролле юзера)
    function scrollToZeroWithTimer() {

        let chatWindow = document.getElementById('chat-box__body'); 
        let xH = chatWindow.scrollHeight; 

        chatWindow.scrollTo(0, xH);

        console.log('scrollToZero');  
        
        //при срабатывании скролла обнуление скролла будет только через 5 сек после его остановки в любом месте
        let timer = null;
            
        //при активном скролле 
        chatWindow.addEventListener('scroll', function() {
            
            //если совершается прокрутка
            if(timer !== null) {

                //действие функции внутри таймера отменяется, т.е. обнуления скролла не происходит
                clearTimeout(timer);  
                console.log('scrollToZero_STOPPED');      
            }

            //в ином случае скролл обнуляется спустя 5 сек
            timer = setTimeout(function() {

                chatWindow.scrollTo(0, xH);
                console.log('scrollToZero_TIMER');
            }, 5000);
        }, false);

        
    }

    //функция автопрокрутки скроллбара к последнему сообщению
    function scrollToZero() {
        chatWindow = document.getElementById('chat-box__body'); 
        let xH = chatWindow.scrollHeight; 

        //скролл будет обнулен сразу
        chatWindow.scrollTo(0, xH);

        console.log('scrollToZero');
     
    }


    /* //функция Long Polling для проверки поступления на сервер новых сообщений
    async function longPolling() {
        let response = await fetch("https://Messenger.stacymch.repl.co/index.php");
        
        if (response.status == 502) {
            // Статус 502 - это таймаут соединения;
            // возможен, когда соединение ожидало слишком долго
            // и сервер (или промежуточный прокси) закрыл его
            // давайте восстановим связь
            await longPolling();
        } else if (response.status != 200) {
            // Какая-то ошибка, покажем её
            console.log(response.statusText);
            // Подключимся снова через секунду.
            await new Promise(resolve => setTimeout(resolve, 5000));
            await longPolling();
        } else {
            if(nameMy) {
                // Получим и покажем сообщение
                renderMessages();
                let message = await response.text();//показывает каждый раз все содержимое data.json
                console.log(message);
            }
            // И снова вызовем longPolling() для получения следующего сообщения
            await longPolling();
        }
        }
        
        longPolling(); */


//Поп-ап Serg

    let popupBg = document.querySelector('.popupBg');
    let popup = document.querySelector('.popup');
    let openPopup = document.querySelectorAll('.open-popup');
    let closePopup = document.querySelector('.close-popup');
    let msgPopup = document.getElementById('msgPopup').value;
    
    openPopup.forEach((button) => {
        button.addEventListener('click', (e) =>{
            e.preventDefault();
            popupBg.classList.add('active');
            popup.classList.add('active');
            toggleMenu();            
        })
    })

    closePopup.addEventListener('click', ()=>{
        if(nameMy) {
            popupBg.classList.remove('active');
            popup.classList.remove('active');
        } 
    })

    /* document.addEventListener('click', (e)=>{
        if(e.target == popupBg) {
            popupBg.classList.remove('active');
            popup.classList.remove('active');
        }
    }) */

     function sendpopup() {
        let msgPopup = document.getElementById('msgPopup').value;
        localStorage.setItem('nameMy', msgPopup);
     }  

       let nameMy = localStorage.getItem('nameMy');
    //    console.log(nameMy);

        if (!nameMy){
                document.addEventListener('DOMContentLoaded', function() {
                    popupBg.classList.add('active');
                    popup.classList.add('active');
                });
        }

    // Serg сообщения по энтеру    
     document.getElementById('msg').addEventListener('keypress', (e)=> {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }            
        });

        //отрисовка истории чата, если юзер ввел имя
        function updateChatHistory() {
            if (nameMy) {

                //если фон был изменен, подгрузится измененный
                if(localStorage.getItem('background')) {

                    let chosenBackground = localStorage.getItem('background');
                    document.querySelector('.chat-box').style.backgroundImage = 'url(' + chosenBackground + ')';

                }
                renderMessages(); 
                //scrollToZero();
                console.log('updateChatHistory');
            }
        }

        
    updateChatHistory(); //единоразово при обновлении страницы


    // ПОКАЗЫВАЕТ НОВЫЕ СООБЩЕНИЯ ДРУГИХ ЛЮДЕЙ, НО ПЕРЕБИВАЕТ ПРИОСТАНОВКУ ОБНУЛЕНИЯ ДАЖЕ ПРИ АКТИВНОМ СКРОЛЛЕ. А БЕЗ НЕЕ ВСЕ ПРЕКРАСНО СО СКРОЛЛОМ, НО НЕ ОТОБРАЖАЮТСЯ СООБЩЕНИЯ ДРУГИХ ЮЗЕРОВ БЕЗ ОБНОВЛЕНИЯ СТРАНИЦЫ
    /* setInterval(function() { 
        if (nameMy) {
            renderMessages(); 
        }
    }, 5000); */


    //Код jquery для растягивания поля сообщения по высоте контента (только для textarea)
    $(function() {
        $('#msg').on('input keyup paste', function() {
            var $el = $(this),
                offset = $el.innerHeight() - $el.height();
        
            if ($el.innerHeight() < this.scrollHeight) {
            // Grow the field if scroll height is smaller
            $el.height(this.scrollHeight - offset);
            } else {
            // Shrink the field and then re-set it to the scroll height in case it needs to shrink
            $el.height(1);
            $el.height(this.scrollHeight - offset);
            }
        });
        });