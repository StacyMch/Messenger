    //функция вызова меню при клике на три точки сверху
    function toggleMenu() {

        document.getElementById('menu-right').classList.toggle('menu-right-active');
    }
    
    //функция отправки сообщений
    function sendMessage() {

        //получаем ввод от пользователя
        let msg = document.getElementById('msg').value;

        //проверка на наличие введенного имени юзера
        if (nameMy !== '') {

            //отправляем запрос и получаем данные
            let xhr = new XMLHttpRequest();
            xhr.open('GET','https://nordic.sierghieipielie.repl.co/?messeg=' + msg + '&name=' + nameMy,false);
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
            
            if (nameMy == data[i]['name']) {

                //отрисовываем "свои" сообщения справа
                container.innerHTML += document.getElementById('tmpl_mes').innerHTML.replace('${name}', data[i]["name"])
                                                                                    .replace('${message}', data[i]['messeg'])
                                                                                    .replace('${date}', data[i]["date"])
                                                                                    .replace('${style}', 'right');
            } else {
                
                //отрисовываем "чужие" сообщения слева
                container.innerHTML += document.getElementById('tmpl_mes').innerHTML.replace('${name}', data[i]["name"])
                                                                                    .replace('${message}', data[i]['messeg'])
                                                                                    .replace('${date}', data[i]["date"]);
            }
        }

        scrollToZero();
    
    }

    //автопрокрутка скроллбара к последнему сообщению
    function scrollToZero() {
        chatWindow = document.getElementById('chat-box__body'); 
        let xH = chatWindow.scrollHeight; 
        chatWindow.scrollTo(0, xH);
    }


//Попаб Serg

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

    document.addEventListener('click', (e)=>{
        if(e.target == popupBg) {
            popupBg.classList.remove('active');
            popup.classList.remove('active');
        }
    })

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
                    sendMessage();
                }            
        });

        //отрисовка истории чата, если юзер ввел имя
        function updateChatHistory() {
            if (nameMy) {
                renderMessages(); 
            }
        }

        updateChatHistory();

    // Serg обновление сообщений
    setInterval(function() { 
        if (nameMy) {
            renderMessages(); 
        }
    }, 5000);


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