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

    shuffle(emoji);

    return {
        getEmoji: function(index) {
            return emoji[index];
        },
    }
})();

var uiController = (function() {

    var dom = {
        gameboard: '#gameboard',
        card: '.card_block__card',
        cardsFrontSide: '.card_block__card--front',
        matched: '.matched',
        notMatched: '.not_matched',
        flipped: '.flip'
    }

    return {

        flipCard: function(event) {
            // переворачивает карту и отключает возможность перевернуть обратно
            var target = event.target;
            var card = target.closest(dom.card);
            var notMatched = document.querySelectorAll(dom.notMatched);

            if (card) {
               card.classList.add('flip', 'clickoff');
            //    переворачивает две несовпавшие карты, когда кликнута третья карта
               notMatched.forEach(function(element) {
                   element.classList.remove('not_matched');
                   element.parentNode.classList.remove('flip', 'clickoff');
               })
            }
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

        getDom: function() {
            return dom;
        }
    }

})();


var gameController = (function() {
    var dom = uiController.getDom();

    function setupGame() {
        // назначает emoji лицевой стороне карты
        var cardsFrontSide = document.querySelectorAll(dom.cardsFrontSide);

        for (var i = 0; i < cardsFrontSide.length; i++) {
            cardsFrontSide[i].textContent = gameData.getEmoji(i);
        }
    }
    function cardsHandler(event) {
        uiController.flipCard(event);
        var cards = document.querySelectorAll(dom.flipped)

        if (cards.length === 2) {
            uiController.matchCards(cards);
        }
    }

    function setupEventListeners() {
        document.querySelector(dom.gameboard).addEventListener('click', cardsHandler); 
    }

    return {
        rungame: function() {
            setupGame();
            setupEventListeners();
        }
    }
})();

gameController.rungame();
