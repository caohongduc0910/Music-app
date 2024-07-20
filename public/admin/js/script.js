//Img preview
const updateImage = document.querySelector('[upload-image]')
const updateImageInput = document.querySelector('[upload-image-input]')
const updateImagePreview = document.querySelector('[upload-image-preview]')
const closePreviewBtn = document.querySelector('.close-preview')

if(updateImagePreview.src != "") {
  closePreviewBtn.style.display = 'inline-block'
}

if (updateImage) {
  updateImageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const img = e.target.files[0]
      updateImagePreview.src = URL.createObjectURL(img)
      closePreviewBtn.style.display = 'inline-block'
    }
  })

  closePreviewBtn.onclick = () => {
    updateImageInput.value = ""
    updateImagePreview.src = ""
    closePreviewBtn.style.display = 'none'
  }
}

//Audio preview
const updateAudio = document.querySelector('[upload-audio]')
const updateAudioInput = document.querySelector('[upload-audio-input]')
const updateImagePlay = document.querySelector('[upload-audio-play]')
const source = updateImagePlay.querySelector('source')

if (updateAudio) {
  updateAudioInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const audio = e.target.files[0]
      source.src = URL.createObjectURL(audio)
      updateImagePlay.load()
      updateImagePlay.style.display = 'inline-block'
    }
  })
} 