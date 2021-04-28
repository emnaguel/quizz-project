
// VARIABLES
// localStorage.clear();
const surname = localStorage.getItem('surname')

const logged = document.querySelector("#logged")
const happyEmojy = document.querySelector(".happy-emojy")
const sadEmojy = document.querySelector(".sad-emojy")
const emojy = document.querySelector(".emojy")
const textScore = document.querySelector(".text-score")
const categoryName = document.querySelector("#category")
const happyAudio = new Audio('./audios/happy.wav');
const sadAudio = new Audio('./audios/sad.wav');
const btnCategory = document.querySelectorAll(".btn-category")
const cardCategory = document.querySelectorAll(".card-category")
const login = document.querySelector("#login")
const appendSurname = document.querySelector("#append-surname")
const choseCategory = document.querySelector("#choseCategory")
const buttonGetSurname = document.querySelector("#get-surname")
const inputSurname = document.querySelector("#surname")
const secondNavbar = document.querySelector("#average-score-navbar")
let total = []
let score = 0
let beginQuizzTime = ""
let endQuizzTime = ""
let price = []

// LOGIN
function welcome() {
  if(surname !== null) {
    login.style.display = "none";
    const welcome = `Welcome ${surname} 🤓`
    appendSurname.append(welcome)
    secondNavbar.classList.remove("hidden")
  } else {
    choseCategory.classList.add("hidden")
  }

}

function loginQuizz() {
  localStorage.setItem('surname', inputSurname.value);
  choseCategory.classList.remove("hidden")
  secondNavbar.classList.remove('hidden')
  logged.classList.add("hidden")
  const welcome = `Welcome ${inputSurname.value} 🤓`
  appendSurname.append(welcome)
  return inputSurname.value
}


buttonGetSurname.onclick = loginQuizz

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



function setPriceByScore() {
  cardCategory.forEach((card) => {
    let categoryName = card.className.split(" ")[1]
    let timer = localStorage.getItem(`timer-${categoryName}`)
    let score = localStorage.getItem(categoryName)
    
    if(score) {
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
    navbar.append(div)
  } else {
    displayWinnerPrice(navbar, price)

  }

  
}

function displayWinnerPrice(navbar, price) {

  let div = document.createElement("div")
  div.innerHTML = `You have ${price.length} price(s): `
  div.style.color = "rgb(252, 176, 69)"
  price.forEach((card) => {
    let span = document.createElement("span")
    if(card.split(" ").includes("queen")) {
      span.innerHTML = "🏆 |"
      
    } else {
      span.innerHTML = "🚀 |"
    }
    span.title = card.split(" ")[1]
    span.classList.add("space-price")
    div.append(span)
    navbar.append(div)
 
  })

}



function calculateTotal(total) {
 
  const reducer = total.reduce((a, b)=> a + b,0);
  btnCategory.forEach((card) => {
    if(card.classList.contains("hidden") ) {
      const totalScore = reducer === 0 ? 0 : (reducer/total.length).toFixed(2)

      categoryName.innerHTML = `Your average score: ${totalScore} ✓`
      categoryName.parentElement.classList.add("second-title")
    }
  })
}

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
    bravo.innerHTML = `Bravo your score is: ${score}! Chose another test`
    textScore.append(bravo)
  } else {
    happyEmojy.classList.add("hidden")
    sadEmojy.classList.remove("hidden")
    const sorry = document.createElement("a")
    sorry.href="/"
    sorry.classList.add("text-center")
    sorry.innerHTML = `Sorry your score is: ${score}, do it again!`
    textScore.append(sorry)

  }
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
  }

}
function displayTime(category) {
  let newContent = document.createElement("p");
  newContent.innerHTML = "⌚️ You have completed this test in" + " " + calculateTime()
  textScore.appendChild(newContent)
  localStorage.setItem(`timer-${category}`, calculateTime())

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

welcome()
calculateTotal(displayAllScores())
displayAllTimers()
setPriceByScore()
displayPrice()