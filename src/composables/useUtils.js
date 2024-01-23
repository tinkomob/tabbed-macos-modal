import imagesLoaded from 'imagesloaded'

export function useUtils() {
  function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  function pxToNumber(value) {
    if (value) {
      value = Number(value.replace('px', ''))

      return value
    }
    return 0
  }

  function numberToPx(value) {
    if (value) {
      value = value + 'px'

      return value
    }
    return '0px'
  }

  function isIphone() {
    const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
    const aspect = window.screen.width / window.screen.height;
    return iPhone && aspect.toFixed(3) === "0.462";
  }

  function imagesIsLoaded (container) {
    return new Promise((resolve) => {
      imagesLoaded(container, () => {
        resolve('loaded')
      })
    })
  }

  return {
    pxToNumber,
    numberToPx,
    isIphone,
    makeId,
    imagesIsLoaded
  }
}