var gameData = (function() {
    var emoji = ['🐶', '🐹', '🐻', '🐨', '🦁', '🐸', '🐶', '🐹', '🐻', '🐨', '🦁', '🐸'];

    function shuffle(array) {
        // перемешивает emoji в случайном порядке
        var temp, random;
        for (var i = array.length - 1; i > 0; i--) {
            random = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[random];
            array[random] = temp;
        }
        return array;
    }

    return {
        getEmoji: function(index) {
            return emoji[index];
        },

        shuffle: function() {
            shuffle(emoji);
        }
    }
})();

var uiController = (function() {

    var dom = {
        gameboard: '#gameboard',
        card: '.card_block__card',
        cardsFrontSide: '.card_block__card--front',
        cardsBackSide: '.card_block__card--back',
        matched: '.matched',
        notMatched: '.not_matched',
        flipped: '.flip',
        lost: '.lost',
        win: '.win',
        modal: '.modal'
    }

    return {

        flipCard: function(card) {
            // переворачивает карту и отключает возможность перевернуть обратно
            var notMatched = document.querySelectorAll(dom.notMatched);
            card.classList.add('flip', 'clickoff');
            // переворачивает две несовпавшие карты, когда кликнута третья карта
            notMatched.forEach(function(element) {
                element.classList.remove('not_matched');
                element.parentNode.classList.remove('flip', 'clickoff');
            })
        },

        matchCards(cards) {
            /* получает id контейнера карты и сравнивает emoji,
            лежащего в контейнере с данным id, используя id 
            как индекс в массиве  emoji*/
            var card1Id = cards[0].parentNode.id;
            var card2Id = cards[1].parentNode.id;

            // добавляет соответствующий класс лицевой стороне карты
            if (gameData.getEmoji(card1Id) === gameData.getEmoji(card2Id)) {
                cards.forEach(function(elem) {
                    elem.firstChild.classList.add('matched');
                    elem.classList.add('keep_flipped');
                    elem.classList.remove('flip');
                });

            } else {
                cards.forEach(function(elem) {
                    elem.firstChild.classList.add('not_matched');
                });
            }

        },

        win: function() {
            document.querySelector(dom.win).classList.remove('hide');
        },

        lose: function() {
            document.querySelector(dom.lost).classList.remove('hide');
            document.getElementById('seconds').textContent = '00';
        },
        
        resetTimer: function() {
            document.getElementById('minute').textContent = '01';
            document.getElementById('seconds').textContent = '00';
        },

        hideModal: function(domObj) {
            domObj.classList.add('hide');
        },

        resetGame: function() {
            document.querySelectorAll(dom.modal).forEach(function(element) {
                element.classList.add('hide');
            })
            document.querySelectorAll(dom.card).forEach(function(element) {
                element.classList.remove('flip', 'keep_flipped', 'clickoff');
                element.firstChild.classList.remove('matched', 'not_matched');
            })
            this.resetTimer();
        }, 

        getDom: function() {
            return dom;
        }
    }

})();


var gameController = (function() {
    var dom = uiController.getDom();
    var gameTimer, timerForLose;

    function setupGame() {
        // назначает emoji лицевой стороне карты
        gameData.shuffle();
        var cardsFrontSide = document.querySelectorAll(dom.cardsFrontSide);

        for (var i = 0; i < cardsFrontSide.length; i++) {
            cardsFrontSide[i].textContent = gameData.getEmoji(i);
        }
    }
    function cardsHandler(event) {
        var target = event.target;
        var card = target.closest(dom.card);
        if (card) {
            uiController.flipCard(card);

            var allCards = document.querySelectorAll(dom.card);
    
            var flipedCards = document.querySelectorAll(dom.flipped);
    
            if (flipedCards.length === 2) {
                uiController.matchCards(flipedCards);
            }

            var matchedCards = document.querySelectorAll(dom.matched);
            if (matchedCards.length === allCards.length) {
                clearTimeout(timerForLose);
                clearInterval(gameTimer);
                uiController.win();
            }
        }
    }

    function setTimerForlose() {
        uiController.lose();
        clearInterval(gameTimer);
    }

    function timer() {
        var minuteDiv = document.getElementById('minute');
        var minute = parseInt(minuteDiv.textContent, 10);
        var secondsDiv = document.getElementById('seconds');
        var seconds = parseInt(secondsDiv.textContent, 10);

        if (seconds > 0) {
            seconds--;
        } else {
            seconds = 59;
        }

        if (minute > 0) {
            minute--;
        }

        document.getElementById('minute').textContent = '0' + minute;
        seconds > 9 ? secondsDiv.textContent = seconds : secondsDiv.textContent = '0' + seconds;
    }

    function timerHandler(event) {
        var target = event.target;
        var card = target.closest(dom.card);
        if (card) {
            timerForLose = setTimeout(setTimerForlose, 60000);
            gameTimer = setInterval(timer, 1000);
            document.querySelector(dom.gameboard).removeEventListener('click', timerHandler);
        }
    }

    function modalHandler(event) {
        var target = event.target;
        if (target.tagName === 'BUTTON') {
            uiController.resetGame();
            setupGame();
            setupEventListeners();
        }
    }

    function setupEventListeners() {
        document.querySelector(dom.gameboard).addEventListener('click', cardsHandler);
        document.querySelector(dom.gameboard).addEventListener('click', timerHandler);
        document.querySelector(dom.lost).addEventListener('click', modalHandler);
        document.querySelector(dom.win).addEventListener('click', modalHandler);
    }

    return {
        rungame: function() {
            setupGame();
            setupEventListeners();
        }
    }
})();

gameController.rungame();
