var gameController = (function() {

    var dom = {
        gameboard: 'gameboard',
        card: '.card_block__card',
    }

    function flipCard(event) {
        var target = event.target;
        var card = target.closest(dom.card);
         if (card) {
            card.classList.toggle('flip');
         }
        
    }

    function setupEventListeners() {
        document.getElementById(dom.gameboard).addEventListener('click', flipCard); 
    }

    return {
        rungame: function() {
            setupEventListeners();
        }
    }
})();

gameController.rungame();
