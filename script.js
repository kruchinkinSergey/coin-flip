const betInput = document.querySelector(".bet__input");
const coinBtnArr = document.querySelectorAll(".coin__btn");
const betEl = document.querySelector('.bet');
const betBtn = document.querySelector(".bet__btn");
const coinEl = document.querySelector('.coin');
const countRoundsNumEl = document.querySelector('.count__rounds-num');
const countRatioNumEl = document.querySelector('.count__ratio-num');
const countRatioEl = document.querySelector('.count__ratio');
const rewardBtn = document.querySelector('.reward__btn')
const overlay = document.querySelector('.overlay')
const overlayRatio = document.querySelector('.overlay__ratio')
const overlayReward = document.querySelector('.overlay__reward')
const overlayBtnContainer = document.querySelector('.overlay__btn-container')
const orelView = document.querySelector('.orel__view')
const reshkaView = document.querySelector('.reshka__view')

let result;
const orel = 'Orel';
const reshka = 'Reshka';
let isClick = false
let notBetCoin;
let cntRounds = 0;
let cntRatio = 0
let cntHistoryImg = 0
countRoundsNumEl.textContent = '1'
countRatioNumEl.textContent = `x2`
let isLoss = false

// валидация инпута
betInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, ''); 
    //проверка цвета для кнопки
    // giveColourBtn()
});

// выбор исхода раунда
coinBtnArr.forEach((coinBtn) => {
    coinBtn.addEventListener("click", () => {

        for (let i = 0; i < coinBtnArr.length; i++) {

            if (coinBtnArr[i].classList.contains('active')) {
                coinBtnArr[i].classList.remove('active')
            }

        }

        coinBtn.classList.add('active')
        // betCoin - сторона, на которую поставили
        // notBetCoin - оставшаяся сторона
        betCoin = coinBtn.value

        if (betCoin === 'Orel') {
            notBetCoin = 'Reshka'
        } else {
            notBetCoin = 'Orel'
        }

        isClick = true
     
        // giveColourBtn()
    })
})

// кнопка 'сделать ход'
betBtn.addEventListener('click', () => {
    const betInputWarning = document.querySelector('.bet__input-warning')
    // проверяем, что инпут не пустой
    if (betInput.value === '') {
        betInputWarning.textContent = 'Сделайте ставку'
        betInputWarning.style.display = 'block'
        setTimeout(() => {
            betInputWarning.style.display = 'none'
        }, 5000)
    }

    // проверяем, что ставка не меньше 15
    if (betInput.value < 15) {
        betInputWarning.textContent = 'Минимальная ставка 15'
        betInputWarning.style.display = 'block'
        betInput.value = 15
        setTimeout(() => {
            betInputWarning.style.display = 'none'
        }, 5000)
    }

    if (betInput.value !== '' && isClick) {
        if (isLoss) {
            cleanHistoryImg()
        }
        // показывает и обновляет счетчик раундов
        incrementRound(++cntRounds)
        // cleanHistoryImg()
        // показывает и обновляет счетчик коэффициентов
        giveRatio(++cntRatio)
        betInput.style.pointerEvents = 'none'
        betEl.style.pointerEvents = 'none'
        // giveColourBtn()
        // запускает анимацию
        rotateCoin(betCoin, notBetCoin, cntRounds)
        
    }

})

function rotateCoin(betCoin, notBetCoin, cntRounds){

    if (coinEl.classList.contains('rotateToReshka')) {
        coinEl.classList.remove('rotateToReshka')
    }

    if (coinEl.classList.contains('rotateToOrel')) {
        coinEl.classList.remove('rotateToOrel')
    }

    let randomNum = Math.random();
    // функция возвращает вероятность, передается кол-во раундов. Чем больше раундов, тем меньше вероятность
    const probability = getProbability(cntRounds)

    //(выигрыш) если выпало число меньше чем вероятность, то выпадет betCoin, т.е. сторона, на которую поставили
    if (randomNum < probability) {
        // анимация для выпавшей стороны через 0.1 секунд
      setTimeout(function () {
        // coinEl.style.animation = `rotate-to-${betCoin} 1.5s ease-out forwards`
        coinEl.classList.add(`rotateTo${betCoin}`)
        isLoss = false
      }, 100)
      // результат выпадения через 2 секунды
      setTimeout(function () {
        // giveColourBtn()
        // награда, которую пользователь выыиграл
        let reward = betInput.value * countRatioNumEl.textContent.replace(/[^0-9]/g, '');
        // появление кнопки, чтобы награду можно было забрать
        rewardBtn.style.display = 'block'
        rewardBtn.textContent = `Забрать ${reward}`
        // если забрал
        rewardBtn.addEventListener('click', () => {
            overlay.style.display = 'block'
            // betEl.style.pointerEvents = 'none'
            overlayBtnContainer.addEventListener('click', () => {
                overlay.style.display = 'none'
            })
            // кнопка пропадает
            setTimeout(() => {
                rewardBtn.style.display = 'none'
                reward = ''
            }, 2500)
            cleanHistoryImg()
            // все используемые переменные возвращаются к исходным значениям
            restartGame()
            // удалениие оверлея через 2.5 сек
            cleanOverlay()
            betBtn.style.background = 'linear-gradient(90deg, rgba(255,184,1,1) 0%, rgba(224,96,18,1) 100%)'
        })
        //изменение контента оверлея
        overlayRatio.textContent = countRatioNumEl.textContent
        overlayReward.textContent = `Вы выиграли ${reward}!`
        rewardBtn.style.background = 'linear-gradient(90deg, rgba(255,184,1,1) 0%, rgba(224,96,18,1) 100%)'
        rewardBtn.style.pointerEvents = 'auto'
        betBtn.textContent = 'Продолжить игру'
        // если продолжает игру
        betBtn.addEventListener('click', () => {
            rewardBtn.style.background = 'gray'
            rewardBtn.style.pointerEvents = 'none'
        })
        betInput.style.pointerEvents = 'none'
        // в историю игр добавляется выпавшее изображение
        addHistoryImg(betCoin)
        // giveColourBtn()
      }, 1500)
      //(проигрыш) иначе выпадет notBetCoin, т.е. оставшаяся сторона 
    } else {
        setTimeout(function () {
            // coinEl.style.animation = `rotate-to-${betCoin} 1.5s ease-out forwards`
            coinEl.classList.add(`rotateTo${notBetCoin}`)
            isLoss = true
          }, 100)
      // после окончания анимации все используемые переменные возвращаются к исходным значениям
      setTimeout(function () {
        addHistoryImg('cross')
        restartGame()
      }, 1500)
    }

    setTimeout(function () {
        betEl.style.pointerEvents = 'auto'
        // giveColourBtn()
      }, 1500)
}

// удалениие оверлея через 2.5 сек
function cleanOverlay() {
    setTimeout(function() {
        overlay.style.display = 'none'
        betEl.style.pointerEvents = 'auto'
    }, 10000)
}

// функция возвращает вероятность
function getProbability(numberMove) {
    const probability = {
        '1': 0.37,
        '2': 0.33,
        '3': 0.3,
        '4': 0.2,
        '5': 0.0,
        '6': 0.0,
        '7': 0.0,
        '8': 0.0,
        '9': 0.0,
        '10': 0.0,
    };

    return probability[numberMove]
}
// показывает и обновляет счетчик раундов
function incrementRound(cntRound) {
    if (countRoundsNumEl.textContent <= 10) countRoundsNumEl.textContent = cntRound
}

 // показывает и обновляет счетчик коэффицииентов
function giveRatio(cntRatio) {

    const ratioArr = {
        1: 2,
        2: 4,
        3: 8,
        4: 16,
        5: 32,
        6: 64,
        7: 128,
        8: 264,
        9: 512,
        10: 1024,
    }

    if (cntRatio <= 10) {
        countRatioNumEl.textContent = `x${ratioArr[cntRatio]}`
    }
}

// в историю игр добавляется выпавшее изображение
function addHistoryImg(imgName) {
    const historyItemImgArr = document.querySelectorAll('.history__item-img')

    historyItemImgArr[cntHistoryImg].src = `./img/${imgName}-img.png` 
    // historyItemImgArr[cntHistoryImg].style.background = 'transperent'
    cntHistoryImg++
}

// функция очистки истории игр
function cleanHistoryImg() {
    const historyItemImgArr = document.querySelectorAll('.history__item-img')
    for (let el of historyItemImgArr) {
        el.src = './img/unknown-img.png'
    }
}

// функция возврата к начальным значениям
function restartGame() {
    // cleanHistoryImg()
    cntRounds = cntRatio = 0
    cntHistoryImg = 0;
    countRoundsNumEl.textContent = '1'
    countRatioNumEl.textContent = `x2`
    rewardBtn.style.display = 'none'
    betBtn.textContent = 'Начать игру'
    betInput.style.pointerEvents = 'auto'
}

// // проверка цвета для кнопки
// function giveColourBtn() {
//     if (betInput.value !== '' && isClick && betEl.style.pointerEvents == '' || betEl.style.pointerEvents == 'auto') {
//         betBtn.style.background = 'linear-gradient(90deg, rgba(255,184,1,1) 0%, rgba(224,96,18,1) 100%)'
//         return 'orange'
//     } else {
//         betBtn.style.background = 'gray'
//         return 'gray'
//     }
// }