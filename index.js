'use strict'

const $  = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function rescale (x, from, to, exponent=1) {

  const t = (x - from[0]) / (from[1] - from[0]);
  return to[0] + ((to[1] - to[0]) * (t ** exponent));
}

function experiment(numPeople) {

    const counts = {}

    for (let i = 0; i < numPeople; i++) {

        const birthday = Math.floor(Math.random() * 365)

        counts[birthday] = (counts[birthday] || 0) + 1

        if (counts[birthday] > 1)
            return true
    }

    return false
}

function estimateProbability (numPeople, numSamples) {
    
    let yes = 0;

    for (let i = 0; i < numSamples; i++) {

        if (experiment (numPeople)) {
            yes++
        }
    }

    return (yes / numSamples) // * 100 + '%'
}

//console.log(estimateProbability (40,10000))

function element (tag, { className = '', innerText = '', style = {}, children = [] } = {}) {
    
    const el = document.createElement (tag)

    el.className = className
    el.innerText = innerText

    Object.assign (el.style, style)

    for (const child of children) {
        el.appendChild (child)
    }

    return el
}

document.addEventListener ('DOMContentLoaded', () => {
    
    const slider = $('.slider')

    const bars = $('.plot .bars')   //может сделать глобальной переменной, чтобы 2 раза не писать?

    slider.oninput = function () {
              
       const numSamples = (1.45 ** slider.value) | 0

       $('h2 span').innerText = numSamples

       restartExperiment (numSamples)
    }

    slider.oninput ()
})


function restartExperiment (numSamples) {

    const bars = $('.plot .bars')
        
    for (let i = 1, n = 81; i < n; i++){
        
        const width = 15
        const probabilityPercentage = (estimateProbability (i, numSamples) * 100).toFixed (1) + '%';
        const bar = bars.childNodes[i - 1]
        
        if (!bar) {

            bars.appendChild (element ('div', {
                className: 'bar',
                style: {
                    left:   (i * width) + 'px',
                    height: probabilityPercentage,
                    animationDuration: rescale (i, [0, n - 1], [0.3, 1.5], 12).toFixed (2) + 's',
                    animationDelay: (i * 0.01) + 's'
                },
                children: [
                    element ('label', { className: 'bottom', innerText: i }),
                    element ('label', { className: 'top'   , innerText: probabilityPercentage })
                ]
            }))

        } else {

            bar.style.height = probabilityPercentage
        }
    }
}
