
// VARIABLES

localStorage.clear();
const surname = localStorage.getItem('surname')

const logged = document.querySelector("#logged")
const happyEmojy = document.querySelector(".happy-emojy")
const sadEmojy = document.querySelector(".sad-emojy")
const emojy = document.querySelector(".emojy")
const textScore = document.querySelector(".text-score")
const categoryName = document.querySelector("#category")
const happyAudio = new Audio('./audios/happy.wav');
const sadAudio = new Audio('./audios/sad.wav');
const sadFinal = new Audio('./audios/sad-final.wav');
const happyFinal = new Audio('./audios/applause.wav');
const veryHappyFinal = new Audio('./audios/fanfare.wav');
const btnCategory = document.querySelectorAll(".btn-category")
const cardCategory = document.querySelectorAll(".card-category")
const login = document.querySelector("#login")
const appendSurname = document.querySelector("#append-surname")
const choseCategory = document.querySelector("#choseCategory")
const buttonGetSurname = document.querySelector("#get-surname")
const inputSurname = document.querySelector("#surname")
const secondNavbar = document.querySelector("#average-score-navbar")
const gameExplanation = document.querySelector("#game-explanation")
const banner = document.querySelector('.banner')
let total = []
let score = 0
let beginQuizzTime = ""
let endQuizzTime = ""
let price = []
let finalTimer = 0
let finalScore = 0

// LOGIN
function welcome() {
  if(surname !== null) {
    login.style.display = "none";
    const welcome = `Welcome ${surname} 🤓`
    appendSurname.append(welcome)
    secondNavbar.classList.remove("hidden")
    banner.classList.add("hidden")
    gameExplanation.style.visibility='visible'

  } else {
    choseCategory.classList.add("hidden")
    gameExplanation.style.visibility='hidden'
    
  }

}

function loginQuizz() {
  banner.classList.add("hidden")
  gameExplanation.style.visibility='visible'
  localStorage.setItem('surname', inputSurname.value);
  choseCategory.classList.remove("hidden")
  secondNavbar.classList.remove('hidden')
  logged.classList.add("hidden")
  const welcome = `Welcome ${inputSurname.value} 🤓`
  appendSurname.append(welcome)
  return inputSurname.value
}


buttonGetSurname.onclick = loginQuizz



// REDIRECT TO QUIZZ CATEGORY

function redirectCategory(event) {
  const choseCategory = document.querySelector("#choseCategory")
  choseCategory.style.display = "none";
  const category = document.querySelector(`#${event.target.className.split(" ")[1]}`)
  category.classList.remove("hidden")
  categoryChosen(event.target.className.split(" ")[1])
  displayCategoryName(category)
}

function categoryChosen(category) {
  let url = ""
  switch (category) {
    case 'general':
      url = "https://opentdb.com/api.php?amount=10&category=9&type=multiple"
      return getAxios(url, 'general')
      break;
    case 'book':
      url = "https://opentdb.com/api.php?amount=10&category=10&type=multiple"
      return getAxios(url, 'book')
      break;
    case 'movie':
      url = "https://opentdb.com/api.php?amount=10&category=11&type=multiple"
      return getAxios(url, 'movie')
      break;
    case 'math':
      url = "https://opentdb.com/api.php?amount=10&category=19&type=multiple"
      return getAxios(url, "math")

      break;
    case 'mythologie':
      url = "https://opentdb.com/api.php?amount=10&category=20&type=multiple"
      return getAxios(url, "mythologie")
      break;
    case 'nature':
      url = "https://opentdb.com/api.php?amount=10&category=17&type=multiple"
      return getAxios(url, "nature")
      break;
  }
}

// RANDOMIZE ANSWERS

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// QUIZZ LOGIC

function displayScore(score) {
  if(score > 5) {
    happyEmojy.classList.remove("hidden")
    sadEmojy.classList.add("hidden")
    const bravo = document.createElement("a")
    bravo.href = "/"
    bravo.classList.add("text-center")
    bravo.innerHTML = `Bravo your score is: <span id="final-score">${score}</span>! Chose another test`
    textScore.append(bravo)
    
  } else {
    happyEmojy.classList.add("hidden")
    sadEmojy.classList.remove("hidden")
    const sorry = document.createElement("a")
    sorry.href="/"
    sorry.classList.add("text-center")
    sorry.innerHTML = `Sorry your score is: <span id="final-score">${score}</span>, do it again!`
    textScore.append(sorry)

  }
  finalScore = score
}


function rightAnswer(allChildren, rightAnswer) {
  let allAnswers= [...allChildren]
  allAnswers.forEach((answer) => {
    if(answer.textContent === rightAnswer) answer.classList.add("right-answer")
    
  })
}

function choseAnswers(button, answer, categoryChosen) {
  console.log(answer)
  button.addEventListener("click", (event) => {
    rightAnswer(event.target.parentElement.children, answer)
    
    emojy.classList.add('hidden')
    if(event.target.textContent === answer) {
      score++
      happyEmojy.classList.remove("hidden")
      happyAudio.play()
      sadEmojy.classList.add("hidden")

    }else {
      happyEmojy.classList.add("hidden")
      sadAudio.play()
      sadEmojy.classList.remove("hidden")
    }
    displayCardAnimation(event, score)
    localStorage.setItem(`${categoryChosen.id}`, score);
  })
  
  
}



function displayCardAnimation(event, score) {
  let category = event.target.parentElement.parentElement.parentElement.id
  event.target.classList.add("clicked")
  setTimeout(() => event.target.parentElement.parentElement.remove(), 500);
  if(event.target.parentElement.parentElement.nextSibling) {
    setTimeout(() => event.target.parentElement.parentElement.nextSibling.classList.remove('hidden'), 499)
  } else {
    endQuizzTime = Date.now()
    displayScore(score)
    displayTime(category)
    displayPriceInEndOfQuizz()

  }

}

function displayPriceInEndOfQuizz() {
    let containerPrice = document.querySelector('.price-container')
    let p = document.createElement("p")
    let content = ""
    if(finalScore > 5 && finalTimer.includes('min')) {
      content = "You have won this price 🏆!!"
      containerPrice.innerHTML = "🏆"
      happyFinal.play()
    } else if(finalScore > 5 && !finalTimer.includes('min')) {
      content = "You have won this price 🚀 !"
      containerPrice.innerHTML = "🚀"
      veryHappyFinal.play()
    } else {
      content = "You haven't won anything 🤷🏻‍♀️, play again to earn some prices"
      containerPrice.innerHTML = "🤷🏻‍♀️ Play again to earn some prices"
      sadFinal.play()
    }
    p.innerHTML = content
    p.classList.add("bigger")
    textScore.appendChild(p)

}




function displayTime(category) {
  let newContent = document.createElement("p");
  newContent.innerHTML = `⌚️ You have completed this test in ${calculateTime()}`
  textScore.appendChild(newContent)
  localStorage.setItem(`timer-${category}`, calculateTime())
  finalTimer = calculateTime()
}

function calculateTime() {
  let timer = Math.floor((endQuizzTime - beginQuizzTime) / 1000)
  if(timer > 60) {
    let min = Math.floor((timer % 3600) / 60)
    let second = timer % 60
    return second > 0 ? `${min} min ${second} sec` : `${min} min`
  } else {
    return `${timer} secondes`
  }

}

function createCard(allAnsweredShuffled, result, categoryChosen) {
  let newContent = document.createTextNode(HtmlSanitizer.SanitizeHtml(`👉 ${result.question}`));
  let newH = document.createElement("h2");
  let newUl = document.createElement("ul");
  let card= document.createElement("div");
  card.className = `card-category`;
  allAnsweredShuffled.forEach((answer) => { 
    newH.appendChild(newContent)
    const li = document.createElement("li");
    li.innerText = `${HtmlSanitizer.SanitizeHtml(answer)}`;
    li.className = `answer`;
    newUl.append(li) 
    choseAnswers(li, result.correct_answer, categoryChosen)
    card.appendChild(newH)
    card.appendChild(newUl)
  })
    categoryChosen.appendChild(card);
    categoryChosen.children[0].classList.add('active')
    
    emojy.classList.remove("hidden")

    
}


function displayQuestions(result, categoryChosen) {

  let allAnswers = []
  allAnswers.push(result.correct_answer)
  allAnswers.push(result.incorrect_answers)
  
 
  let allAnsweredShuffled = shuffle(allAnswers.flat())
  createCard(allAnsweredShuffled, result, categoryChosen)
  displayCard(categoryChosen) 



}



function displayCard(categoryChosen) {
  let children = [ ...categoryChosen.children ];  
  children.forEach((child) => {

    if(!child.classList.contains('active')){
      child.classList.add("hidden")
    } else if ((child.classList.contains('last')) && (child.classList.contains('active'))){
      endQuizzTime = Date.now()
      
    }
  })
}



function displayCategoryName(category) {

  switch (category.id) {
    case 'general':
      categoryName.innerHTML = "General Knowledge"
      break;
    case 'book':
      categoryName.innerHTML = "Books"
 
      break;
    case 'movie':
      categoryName.innerHTML = "Movies"
 
      break;
    case 'general':
      categoryName.innerHTML = "Mathematics"

      break;
    case 'mythologie':
      categoryName.innerHTML = "Mythology"
   
      break;
    case 'nature':
      categoryName.innerHTML = "Nature"
    
      break;
    
  }
        
  categoryName.parentElement.classList.add("second-title")
    
}


function getAxios(url, category) {
  axios.get(url)
  .then(function (response) {
    // handle success
    let results = response.data.results;
    let categoryChosen = document.querySelector(`#${category}`)

    beginQuizzTime = Date.now()
    results.forEach((result) => {
      displayQuestions(result, categoryChosen)
    })
  })
}



// PRICE
function setPriceByScore() {
  cardCategory.forEach((card) => {
    let categoryName = card.className.split(" ")[1]
    let timer = localStorage.getItem(`timer-${categoryName}`)
    let score = localStorage.getItem(categoryName)
    
    if(score && timer) {
      
      if((score > 5) && (timer.split(" ").includes("min")))  {
        price.push(`queen ${categoryName}`)
      } else if ((score > 5) && !timer.split(" ").includes("min")) {
        price.push(`master ${categoryName}`)
      }

    }
  })
  return price
}


function displayPrice() {
  let navbar = document.querySelector("#average-score-navbar .container-fluid")
  if(price.length === 0) {
    let div = document.createElement("div")
    div.innerHTML = "Play and earn some prices !!"
    div.style.color = "rgb(252, 176, 69)"
    div.classList.add("price-container")
    navbar.append(div)
  } else {
    displayWinnerPrice(navbar, price)

  }

  
}

function displayWinnerPrice(navbar, price) {

  let div = document.createElement("div")

  div.style.color = "rgb(252, 176, 69)"
  price.forEach((card) => {
    let span = document.createElement("span")
    if(card.split(" ").includes("queen")) {
      span.innerHTML = "🏆 "
      
    } else {
      span.innerHTML = "🚀 "
    }
    span.title = card.split(" ")[1]
    span.classList.add("space-price")
    div.classList.add('price-container')
    div.append(span)
    navbar.append(div)
 
  })

}

// SCORE



function displayAllScores() {
  cardCategory.forEach((card) => {
    const space = card.querySelector('h5')
    if(localStorage.getItem(card.classList[1]) !==null) {
      const scoreTitle = `${localStorage.getItem(card.classList[1])}/10`
      space.append(scoreTitle)
      total.push(Number(localStorage.getItem(card.classList[1])))
    } else {
      const colorfulBtn = document.createElement("span")
      colorfulBtn.innerHTML = "PLAY ▶️"
      colorfulBtn.style.color = "#fcb045"
      const magicButton = setInterval(function(){
        colorfulBtn.classList.toggle("colorful")
      }, 2000);
      space.append(colorfulBtn)
    }

    card.addEventListener("click", (event) => redirectCategory(event))
   
  })
  return total
}

function displayAllTimers() {
  cardCategory.forEach((card) => {
    let categoryName = card.className.split(" ")[1]
    let timerRegistered = localStorage.getItem(`timer-${categoryName}`)
    if(timerRegistered) {
      const timerCard = document.createElement("p")
      timerCard.classList.add('timer')
      timerCard.innerHTML = `⏰ Test completed in ${timerRegistered} `
      card.append(timerCard) 
    } else {
      card.classList.add('shrink-card')
    }
  
  })
}




function calculateTotal(total) {
 
  const reducer = total.reduce((a, b)=> a + b,0);
  btnCategory.forEach((card) => {
    if(card.classList.contains("hidden") ) {
      const totalScore = reducer === 0 ? 0 : (reducer/total.length).toFixed(2)
      const emojiScore = totalScore > 5 ? "🤙" : "👎"
      categoryName.innerHTML = `Average score: ${totalScore} ${emojiScore}`
      categoryName.parentElement.classList.add("second-title")
    }
  })
}

welcome()
calculateTotal(displayAllScores())
displayAllTimers()
setPriceByScore()
displayPrice()