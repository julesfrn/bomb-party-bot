const main = () => {
  let dico = window.dico
  const answerIfSelfTurn = (mutationList) => {
    mutationList.forEach(() => {
      if (
        !document.querySelector('.selfTurn').attributes.hidden &&
        !document.querySelector('.round').attributes.hidden
      ) {
        const syllabe = document.querySelector('.syllable').innerText
        const correctWord = dico.find(word => word.includes(syllabe.toLowerCase()))
        dico = dico.filter(word => word !== correctWord)
        document.querySelector('.selfTurn form input').value = correctWord
        setTimeout(() => {
          document.querySelector('.selfTurn form').dispatchEvent(new SubmitEvent('submit'))
        }, 250)
      }
    })
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
