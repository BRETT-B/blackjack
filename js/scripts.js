// When the user clicks DEAL, deal the cards
var theDeck =[];
var playersHand = [];
var dealersHand = [];
var topOfTheDeck = 4;
var playerBank = 10;
var betAmount = 0;
var cardsDealt = false;
$(document).ready(function(){
	$('.chips').click(function(){
		placeBet();
	});
	$('.deal-button').click(function(){
		createDeck();	//Run a function that creates an array of 1H-13C
		shuffleDeck();	//Run a function to shuffle the deck
		console.log(theDeck);
		playersHand.push(theDeck[0]);//Push onto the playerHand array the new card. Then place it in the DOM 
		placeCard('player', 'one', theDeck[0]);
		dealersHand.push(theDeck[1]);
		placeCard('dealer', 'one', theDeck[1]);
		playersHand.push(theDeck[2]);
		placeCard('player', 'two', theDeck[2]);
		dealersHand.push(theDeck[3]);
		placeCard('dealer', 'two', theDeck[3]);
		cardsDealt = true;
		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');
		console.log(cardsDealt);
	});
	$('.hit-button').click(function(){
		var playerTotal = calculateTotal(playersHand, 'player');
		if(playerTotal <= 21){
			var slotForNewCard = '';
			if(playersHand.length == 2){
				slotForNewCard = 'three';
			}
			else if(playersHand.length == 3){
				slotForNewCard = 'four';
			}
			else if(playersHand.length == 4){
				slotForNewCard = 'five';
			}
			else if(playersHand.length == 5){
				slotForNewCard = 'six';
			}
			placeCard('player', slotForNewCard, theDeck[topOfTheDeck]);
			playersHand.push(theDeck[topOfTheDeck]);
			calculateTotal(playersHand, 'player');
			topOfTheDeck++;
		}
	});
	$('.stand-button').click(function(){
		// Player clicked on stand, wait for dealer to finish their whosTurn
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		while(dealerTotal < 17){
			// Dealer has less than 17 --- dealer must hit-button
			if(dealersHand.length == 2){
				slotForNewCard = 'three';
			}
			else if(dealersHand.length == 3){
				slotForNewCard = 'four';
			}
			else if(dealersHand.length == 4){
				slotForNewCard = 'five';
			}
			else if(dealersHand.length == 5){
				slotForNewCard = 'six';
			}
			placeCard('dealer', slotForNewCard, theDeck[topOfTheDeck]);
			dealersHand.push(theDeck[topOfTheDeck]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
			topOfTheDeck++;
		}
		// Dealer has at least 17. Check to see who whosTurn
		checkWin();
	});
	$('.reset-button').click(function(){
		$('.card').html('');
		theDeck =[];
		topOfTheDeck = 4;
		playersHand = [];
		dealersHand = [];
		calculateTotal(playersHand,'player');
		calculateTotal(dealersHand,'dealer');
		cardsDealt = false;
	});
});
function placeBet(){
	if((cardsDealt == false) && (playerBank > 0)){
			betAmount += 1;
			playerBank -= 1;
			$('.bank-display').html('Bank: ' +playerBank + '<br>Bet: '+ betAmount);
	}
}
function checkWin(){
	// Get player total
	var playersTotal = calculateTotal(playersHand, 'player');
	// Get dealer total
	var dealersTotal = calculateTotal(dealersHand, 'dealer');
	if(playersTotal > 21){
		alert('You Bust!');
		$('.bank-display').html('Bank: ' +playerBank + '<br>Bet: 0');
	}
	else if(playersTotal == 21){
		alert('BLACKJACK!');
		playerBank += (((betAmount * 2)*2)-betAmount);
		$('.bank-display').html('Bank: ' +playerBank + '<br>Bet: 0');

	}
	else if(dealersTotal > 21){
		alert('Dealer Bust! You WIN!');
		playerBank += (betAmount * 2);
		console.log(playerBank);
		$('.bank-display').html('Bank: ' +playerBank + '<br>Bet: 0');
	}
	else{
		if(playersTotal > dealersTotal){
			alert('You WIN!');	
			playerBank += (betAmount * 2);
			$('.bank-display').html('Bank: ' +playerBank + '<br>Bet: 0');
		}
		else if(dealersTotal > playersTotal){
			alert('Better Luck Next Time');
			$('.bank-display').html('Bank: ' +playerBank + '<br>Bet: 0');
		}
		else{
			alert('Push');
			$('.bank-display').html('Bank: ' + (playerBank + betAmount) + '<br>Bet: 0');
		}
	}
	betAmount = 0;
}
function placeCard(who, where, cardToPlace){
	var classSelector = '.'+who+'-cards .card-'+where;
	$(classSelector).html("<img src='images/"+cardToPlace+".png'>");
	console.log(classSelector);
	console.log(cardToPlace);
	// Write logic to fix the 11, 12, 13 issue
}
function createDeck(){
	// Fill the deck with 52 cards, 4 suits [H, S, D, C]
	var suits = ['h', 's', 'd', 'c'];
	for(var s=0; s<suits.length; s++){
		for(var c=1; c<=13; c++){
			theDeck.push(c+suits[s]);
		}
	}
}
function shuffleDeck(){
	for(var i=1; i<1000; i++){
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1];
		theDeck[card1] = theDeck[card2];
		theDeck[card2] = temp;
	}
}
function calculateTotal(hand, whosTurn){
	var cardValue = 0;
	var total = 0;
	var hasAce = false;
	// var hasAce = false; Initiate ACE as false
	for(var i=0; i<hand.length; i++){
		cardValue = Number(hand[i].slice(0, -1));
		if((cardValue == 1) && (total + 11) <= 21){
			// This card is ACE, check if 11 will fit, if not its 1
			cardValue = 11;
			hasAce = true;
		}
		else if((cardValue + total > 22) && (hasAce)){
			total = total - 10;
			hasAce = false;
		}
		 else if(cardValue > 10){
			cardValue = 10;
		}
		total += cardValue;
	}
	var elementToUpdate = '.'+whosTurn+'-total-number';
	$(elementToUpdate).text(total);
	console.log(total);
	return total;
}
