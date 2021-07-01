const main = () => {
  setInterval(() => {
    console.log('script injected and running')
  }, 1000)

  let dico = window.dico
  const answer = () => {
    const syllabe = document.querySelector('.syllable').innerText
    const possibleWords = dico.filter((word) => word.includes(syllabe.toLowerCase()))
    const correctWord = possibleWords[Math.floor(Math.random() * possibleWords.length)]
    dico = dico.filter((word) => word !== correctWord)
    correctWord.split('').forEach((letter, i) => {
      setTimeout(() => {
        const inputEvent = new Event('input')
        document.querySelector('.selfTurn form input').value += letter
        document.querySelector('.selfTurn form input').dispatchEvent(inputEvent)
      }, i * 100)
    })
    setTimeout(() => {
      document.querySelector('.selfTurn form').dispatchEvent(new SubmitEvent('submit'))
    }, correctWord.length * 100 + 50)
    setTimeout(() => {
      if (!document.querySelector('.selfTurn').attributes.hidden && !document.querySelector('.round').attributes.hidden)
        answer()
    }, correctWord.length * 100 + 100)
  }
  const answerIfSelfTurn = (mutationList) => {
    setTimeout(() => {
      mutationList.forEach(() => {
        if (
          !document.querySelector('.selfTurn').attributes.hidden &&
          !document.querySelector('.round').attributes.hidden
        ) {
          answer()
        }
      })
    }, 500 + Math.random() * 1000)
  }

  const observerOnRound = new MutationObserver(answerIfSelfTurn)
  const observerOnSelfTurn = new MutationObserver(answerIfSelfTurn)

  const round = document.querySelector('.round')
  const selfTurn = document.querySelector('.selfTurn')

  observerOnRound.observe(round, { attributes: true })
  observerOnSelfTurn.observe(selfTurn, { attributes: true })
}

chrome.tabs.query({ active: true, currentWindow: true }).then(async ([tab]) => {
  chrome.webNavigation.getAllFrames({ tabId: tab.id }, (frames) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id, frameIds: [frames[1]?.frameId] },
      function: main,
    })
  })
})
